"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"

interface DailyData {
  date: string
  minutes: number
  tasks: number
}

interface ProductivityChartProps {
  data: DailyData[]
  type?: "bar" | "line"
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h${m}m`
}

export function ProductivityChart({ data, type = "bar" }: ProductivityChartProps) {
  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v: number) => [v, "Tâches"]} />
          <Line type="monotone" dataKey="tasks" stroke="#6366f1" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tickFormatter={formatMinutes} tick={{ fontSize: 11 }} />
        <Tooltip
          formatter={(v: number) => [formatMinutes(v), "Temps"]}
          labelStyle={{ fontSize: 12 }}
        />
        <Bar dataKey="minutes" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
