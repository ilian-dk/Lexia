"use client"

import { useEffect, useState } from "react"
import { TimerWidget } from "@/components/timer/timer-widget"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { formatDuration } from "@/lib/utils"
import { Clock } from "lucide-react"

interface Task { id: string; title: string }
interface Session {
  id: string
  startTime: string
  endTime: string | null
  duration: number | null
  task?: { id: string; title: string } | null
  notes?: string | null
}

export default function TimerPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    fetch("/api/tasks").then((r) => r.json()).then((d) => {
      if (Array.isArray(d)) setTasks(d.filter((t: any) => t.status !== "DONE"))
    })
    fetchSessions()
  }, [])

  function fetchSessions() {
    fetch("/api/timer").then((r) => r.json()).then((d) => {
      if (Array.isArray(d)) setSessions(d.filter((s: Session) => s.endTime !== null))
    })
  }

  const totalToday = sessions
    .filter((s) => s.endTime && new Date(s.endTime).toDateString() === new Date().toDateString())
    .reduce((acc, s) => acc + (s.duration ?? 0), 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Chronomètre</h1>
        <p className="text-muted-foreground text-sm">
          Aujourd'hui : <span className="font-semibold text-foreground">{formatDuration(totalToday)}</span> enregistrées
        </p>
      </div>

      <div className="max-w-md">
        <TimerWidget tasks={tasks} onSessionComplete={fetchSessions} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-500" />
            Sessions récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucune session enregistrée. Démarrez votre premier chronomètre !
            </p>
          ) : (
            <div className="space-y-2">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center gap-4 p-3 rounded-lg border bg-muted/30">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{s.task?.title ?? "Sans tâche"}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.startTime ? format(new Date(s.startTime), "d MMM à HH:mm", { locale: fr }) : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatDuration(s.duration ?? 0)}</p>
                    {s.endTime && (
                      <p className="text-xs text-muted-foreground">
                        → {format(new Date(s.endTime), "HH:mm")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
