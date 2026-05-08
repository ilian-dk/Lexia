"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar, Clock, Trash2 } from "lucide-react"
import { TaskWithRelations, TaskStatus } from "@/types"

const priorityBadge: Record<string, string> = {
  URGENT: "bg-red-100 text-red-700 border-red-200",
  HIGH: "bg-orange-100 text-orange-700 border-orange-200",
  MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
  LOW: "bg-green-100 text-green-700 border-green-200",
}

const statusLabel: Record<string, string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  REVIEW: "En revue",
  DONE: "Terminé",
}

interface ListViewProps {
  tasks: TaskWithRelations[]
  onTaskUpdate: (updater: (prev: TaskWithRelations[]) => TaskWithRelations[]) => void
  onTaskClick: (task: TaskWithRelations) => void
  onTaskDelete: (taskId: string) => void
}

export function ListView({ tasks, onTaskUpdate, onTaskClick, onTaskDelete }: ListViewProps) {
  async function toggleStatus(task: TaskWithRelations) {
    const next: TaskStatus = task.status === "DONE" ? "TODO" : task.status === "TODO" ? "IN_PROGRESS" : task.status === "IN_PROGRESS" ? "REVIEW" : "DONE"
    onTaskUpdate((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: next } : t)))
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    })
  }

  return (
    <div className="space-y-2">
      {tasks.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium">Aucune tâche</p>
          <p className="text-sm">Créez votre première tâche ci-dessus</p>
        </div>
      )}
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-sm transition-all group"
        >
          <button
            onClick={() => toggleStatus(task)}
            className={`h-5 w-5 rounded-full border-2 flex-shrink-0 transition-colors ${
              task.status === "DONE"
                ? "border-green-500 bg-green-500"
                : "border-gray-300 hover:border-indigo-400"
            }`}
          >
            {task.status === "DONE" && (
              <svg viewBox="0 0 12 12" fill="none" className="text-white">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onTaskClick(task)}>
            <p className={`text-sm font-medium ${task.status === "DONE" ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {task.project && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: task.project.color }} />
                  {task.project.name}
                </span>
              )}
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
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className={`text-xs ${priorityBadge[task.priority]}`} variant="outline">
              {task.priority === "URGENT" ? "Urgent" : task.priority === "HIGH" ? "Haute" : task.priority === "MEDIUM" ? "Moyenne" : "Basse"}
            </Badge>
            <Badge variant="secondary" className="text-xs hidden sm:flex">
              {statusLabel[task.status]}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
              onClick={() => onTaskDelete(task.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
