"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, TrendingUp, Flame } from "lucide-react"
import { formatDuration } from "@/lib/utils"

interface StatsCardsProps {
  totalMinutes: number
  tasksDone: number
  avgScore: number
  streak?: number
}

export function StatsCards({ totalMinutes, tasksDone, avgScore, streak = 0 }: StatsCardsProps) {
  const stats = [
    {
      title: "Temps total",
      value: formatDuration(totalMinutes),
      icon: Clock,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
      desc: "cette semaine",
    },
    {
      title: "Tâches terminées",
      value: tasksDone.toString(),
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-50",
      desc: "cette semaine",
    },
    {
      title: "Score productivité",
      value: avgScore ? `${avgScore}/100` : "—",
      icon: TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-50",
      desc: "moyenne 7 jours",
    },
    {
      title: "Série active",
      value: `${streak} jours`,
      icon: Flame,
      color: "text-red-500",
      bg: "bg-red-50",
      desc: "consécutifs",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
            <div className={`rounded-lg p-2 ${s.bg}`}>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{s.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{s.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
