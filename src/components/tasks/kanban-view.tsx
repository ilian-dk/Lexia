"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { TaskWithRelations, TaskStatus } from "@/types"

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: "TODO", label: "À faire", color: "border-t-slate-400" },
  { id: "IN_PROGRESS", label: "En cours", color: "border-t-blue-500" },
  { id: "REVIEW", label: "En revue", color: "border-t-amber-500" },
  { id: "DONE", label: "Terminé", color: "border-t-green-500" },
]

const priorityBadge: Record<string, string> = {
  URGENT: "bg-red-100 text-red-700 border-red-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
  LOW: "bg-green-100 text-green-700 border-green-200",
}

const priorityLabel: Record<string, string> = {
  URGENT: "Urgent",
  HIGH: "Haute",
  MEDIUM: "Moyenne",
  LOW: "Basse",
}

interface KanbanViewProps {
  tasks: TaskWithRelations[]
  onTaskUpdate: (updater: (prev: TaskWithRelations[]) => TaskWithRelations[]) => void
  onTaskClick: (task: TaskWithRelations) => void
}

export function KanbanView({ tasks, onTaskUpdate, onTaskClick }: KanbanViewProps) {
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null)

  function handleDragStart(e: React.DragEvent, taskId: string) {
    e.dataTransfer.setData("taskId", taskId)
    setDragging(taskId)
  }

  function handleDragEnd() {
    setDragging(null)
    setDragOver(null)
  }

  function handleDrop(e: React.DragEvent, status: TaskStatus) {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    if (!taskId) return

    onTaskUpdate((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)))
    fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setDragOver(null)
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id)
        return (
          <div
            key={col.id}
            className={`flex-shrink-0 w-72 flex flex-col rounded-xl border-t-4 ${col.color} bg-muted/30 ${
              dragOver === col.id ? "ring-2 ring-indigo-400" : ""
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(col.id) }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-sm">{col.label}</h3>
              <Badge variant="secondary" className="text-xs">{colTasks.length}</Badge>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
              {colTasks.map((task) => (
                <Card
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => onTaskClick(task)}
                  className={`cursor-pointer hover:shadow-md transition-all select-none ${
                    dragging === task.id ? "opacity-50 rotate-1" : ""
                  }`}
                >
                  <CardContent className="p-3 space-y-2">
                    {task.project && (
                      <div className="flex items-center gap-1.5">
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: task.project.color }}
                        />
                        <span className="text-xs text-muted-foreground">{task.project.name}</span>
                      </div>
                    )}
                    <p className="text-sm font-medium leading-snug">{task.title}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`text-xs ${priorityBadge[task.priority]}`} variant="outline">
                        {priorityLabel[task.priority]}
                      </Badge>
                      {task.dueDate && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(task.dueDate), "d MMM", { locale: fr })}
                        </span>
                      )}
                      {task.estimatedMin && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {task.estimatedMin}m
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
