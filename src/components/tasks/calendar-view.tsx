"use client"

import { useState } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { TaskWithRelations } from "@/types"

interface CalendarViewProps {
  tasks: TaskWithRelations[]
  onTaskClick: (task: TaskWithRelations) => void
}

export function CalendarView({ tasks, onTaskClick }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  })

  const firstDayOfWeek = (startOfMonth(currentMonth).getDay() + 6) % 7

  const weekDays = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

  function getTasksForDay(day: Date) {
    return tasks.filter(
      (t) => t.dueDate && isSameDay(new Date(t.dueDate), day)
    )
  }

  const priorityColors: Record<string, string> = {
    URGENT: "bg-red-500",
    HIGH: "bg-orange-500",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-green-500",
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: fr })}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setCurrentMonth(new Date())}>
            Aujourd'hui
          </Button>
          <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
            {d}
          </div>
        ))}

        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const dayTasks = getTasksForDay(day)
          const isToday = isSameDay(day, new Date())
          return (
            <div
              key={day.toISOString()}
              className={`min-h-20 p-1 rounded-lg border ${
                isToday ? "border-indigo-400 bg-indigo-50" : "border-border"
              } ${!isSameMonth(day, currentMonth) ? "opacity-40" : ""}`}
            >
              <div className={`text-xs font-medium mb-1 ${isToday ? "text-indigo-600" : "text-muted-foreground"}`}>
                {format(day, "d")}
              </div>
              <div className="space-y-0.5">
                {dayTasks.slice(0, 3).map((task) => (
                  <button
                    key={task.id}
                    onClick={() => onTaskClick(task)}
                    className="w-full text-left"
                  >
                    <div className={`flex items-center gap-1 px-1 py-0.5 rounded text-xs truncate ${
                      task.status === "DONE" ? "opacity-50 line-through" : ""
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${priorityColors[task.priority]}`} />
                      <span className="truncate">{task.title}</span>
                    </div>
                  </button>
                ))}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-muted-foreground px-1">+{dayTasks.length - 3}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
