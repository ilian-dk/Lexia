"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Clock, CheckSquare } from "lucide-react"
import { formatDuration } from "@/lib/utils"

interface AnalyticsData {
  totalMinutes: number
  tasksDone: number
  avgScore: number
  dailyData: { date: string; minutes: number; tasks: number }[]
}

interface Task {
  id: string
  title: string
  status: string
  priority: string
  dueDate: string | null
  project?: { name: string; color: string } | null
}

const priorityColors: Record<string, string> = {
  URGENT: "bg-red-100 text-red-700",
  HIGH: "bg-orange-100 text-orange-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    fetch("/api/analytics?days=7").then((r) => r.json()).then(setAnalytics)
    fetch("/api/tasks").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setTasks(data.filter((t: Task) => t.status !== "DONE").slice(0, 5))
    })
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Bonjour, {session?.user?.name?.split(" ")[0] ?? ""}
        </h1>
        <p className="text-muted-foreground">Voici un résumé de votre semaine</p>
      </div>

      {analytics && (
        <StatsCards
          totalMinutes={analytics.totalMinutes}
          tasksDone={analytics.tasksDone}
          avgScore={analytics.avgScore}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-indigo-500" />
              Tâches en cours
            </CardTitle>
            <Link href="/tasks">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Voir tout <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Aucune tâche en cours</p>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    {task.project && (
                      <p className="text-xs text-muted-foreground">{task.project.name}</p>
                    )}
                  </div>
                  <Badge className={`text-xs ${priorityColors[task.priority] ?? ""}`} variant="outline">
                    {task.priority === "URGENT" ? "Urgent" : task.priority === "HIGH" ? "Haute" : task.priority === "MEDIUM" ? "Moyenne" : "Basse"}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Daily tracker */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-500" />
              Activité quotidienne
            </CardTitle>
            <Link href="/analytics">
              <Button variant="ghost" size="sm" className="gap-1 text-xs">
                Analytics <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {analytics?.dailyData ? (
              <div className="space-y-2">
                {analytics.dailyData.slice(-5).map((d) => (
                  <div key={d.date} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-10">{d.date}</span>
                    <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (d.minutes / 480) * 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {formatDuration(d.minutes)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Chargement…</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
