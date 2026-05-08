"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Square, Clock } from "lucide-react"
import { formatSeconds } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

interface ActiveSession {
  id: string
  startTime: string
  task?: { id: string; title: string } | null
}

interface Task {
  id: string
  title: string
}

interface TimerWidgetProps {
  tasks: Task[]
  onSessionComplete?: () => void
}

export function TimerWidget({ tasks, onSessionComplete }: TimerWidgetProps) {
  const { toast } = useToast()
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [selectedTaskId, setSelectedTaskId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetch("/api/timer?active=true")
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setActiveSession(data)
          const start = new Date(data.startTime).getTime()
          setElapsed(Math.floor((Date.now() - start) / 1000))
        }
      })
  }, [])

  useEffect(() => {
    if (activeSession) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setElapsed(0)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [activeSession])

  async function startTimer() {
    setLoading(true)
    const res = await fetch("/api/timer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId: selectedTaskId || null }),
    })
    const data = await res.json()
    if (res.ok) {
      setActiveSession(data)
      toast({ title: "Chronomètre démarré" })
    } else {
      toast({ title: "Erreur", description: data.error, variant: "destructive" })
    }
    setLoading(false)
  }

  async function stopTimer() {
    if (!activeSession) return
    setLoading(true)
    await fetch(`/api/timer/${activeSession.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
    const mins = Math.floor(elapsed / 60)
    toast({ title: "Session enregistrée", description: `${mins} minute${mins !== 1 ? "s" : ""} enregistrées` })
    setActiveSession(null)
    onSessionComplete?.()
    setLoading(false)
  }

  return (
    <Card className={`${activeSession ? "border-indigo-400 shadow-indigo-100 shadow-lg" : ""} transition-all`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className={`text-6xl font-mono font-bold tracking-tight ${activeSession ? "text-indigo-600" : "text-foreground"}`}>
              {formatSeconds(elapsed)}
            </div>
            {activeSession?.task && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                {activeSession.task.title}
              </p>
            )}
          </div>

          {!activeSession && (
            <div className="w-full">
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger>
                  <SelectValue placeholder="Associer une tâche (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-3">
            {!activeSession ? (
              <Button
                onClick={startTimer}
                disabled={loading}
                size="lg"
                className="gap-2 bg-indigo-500 hover:bg-indigo-600 px-8"
              >
                <Play className="h-5 w-5" />
                Démarrer
              </Button>
            ) : (
              <Button
                onClick={stopTimer}
                disabled={loading}
                size="lg"
                variant="destructive"
                className="gap-2 px-8"
              >
                <Square className="h-5 w-5" />
                Arrêter
              </Button>
            )}
          </div>

          {activeSession && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
              <Clock className="h-4 w-4 text-indigo-500" />
              Session en cours…
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
