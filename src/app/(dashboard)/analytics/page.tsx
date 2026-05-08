"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ProductivityChart } from "@/components/analytics/productivity-chart"
import { Button } from "@/components/ui/button"
import { BarChart3, TrendingUp } from "lucide-react"

interface AnalyticsData {
  totalMinutes: number
  tasksDone: number
  avgScore: number
  dailyData: { date: string; minutes: number; tasks: number }[]
}

export default function AnalyticsPage() {
  const [data7, setData7] = useState<AnalyticsData | null>(null)
  const [data30, setData30] = useState<AnalyticsData | null>(null)
  const [activePeriod, setActivePeriod] = useState<"7" | "30">("7")

  useEffect(() => {
    fetch("/api/analytics?days=7").then((r) => r.json()).then(setData7)
    fetch("/api/analytics?days=30").then((r) => r.json()).then(setData30)
  }, [])

  const currentData = activePeriod === "7" ? data7 : data30

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground text-sm">Suivez votre productivité dans le temps</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activePeriod === "7" ? "default" : "outline"}
            size="sm"
            onClick={() => setActivePeriod("7")}
            className={activePeriod === "7" ? "bg-indigo-500 hover:bg-indigo-600" : ""}
          >
            7 jours
          </Button>
          <Button
            variant={activePeriod === "30" ? "default" : "outline"}
            size="sm"
            onClick={() => setActivePeriod("30")}
            className={activePeriod === "30" ? "bg-indigo-500 hover:bg-indigo-600" : ""}
          >
            30 jours
          </Button>
        </div>
      </div>

      {currentData && (
        <StatsCards
          totalMinutes={currentData.totalMinutes}
          tasksDone={currentData.tasksDone}
          avgScore={currentData.avgScore}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              Temps par jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentData?.dailyData ? (
              <ProductivityChart data={currentData.dailyData} type="bar" />
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                Chargement…
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              Tâches terminées
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentData?.dailyData ? (
              <ProductivityChart data={currentData.dailyData} type="line" />
            ) : (
              <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
                Chargement…
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ROI section */}
      <Card className="border-indigo-200 bg-indigo-50/50">
        <CardHeader>
          <CardTitle className="text-base text-indigo-800">Estimation ROI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: "Temps productif",
                value: currentData ? `${Math.round(currentData.totalMinutes / 60)}h` : "—",
                sub: `sur ${activePeriod} jours`,
              },
              {
                label: "Valeur estimée",
                value: currentData ? `€${Math.round((currentData.totalMinutes / 60) * 65)}` : "—",
                sub: "à 65€/h moyen",
              },
              {
                label: "Productivité",
                value: currentData?.avgScore ? `${currentData.avgScore}%` : "—",
                sub: "score moyen",
              },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-3xl font-bold text-indigo-700">{item.value}</div>
                <div className="text-sm font-medium text-indigo-800 mt-1">{item.label}</div>
                <div className="text-xs text-indigo-600">{item.sub}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
