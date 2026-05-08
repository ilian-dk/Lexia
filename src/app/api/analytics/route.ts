import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { startOfDay, subDays, format } from "date-fns"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !prisma) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get("days") ?? "7")
  const since = startOfDay(subDays(new Date(), days))

  const [timeSessions, tasks, scores] = await Promise.all([
    prisma.timeSession.findMany({
      where: { userId: session.user.id, startTime: { gte: since }, endTime: { not: null } },
      include: { task: { select: { title: true, project: { select: { name: true, color: true } } } } },
      orderBy: { startTime: "asc" },
    }),
    prisma.task.findMany({
      where: {
        assigneeId: session.user.id,
        updatedAt: { gte: since },
      },
    }),
    prisma.productivityScore.findMany({
      where: { userId: session.user.id, date: { gte: since } },
      orderBy: { date: "asc" },
    }),
  ])

  const totalMinutes = timeSessions.reduce((acc, s) => acc + (s.duration ?? 0), 0)
  const tasksDone = tasks.filter((t) => t.status === "DONE").length
  const avgScore = scores.length ? scores.reduce((a, s) => a + s.score, 0) / scores.length : 0

  const dailyData: Record<string, { date: string; minutes: number; tasks: number }> = {}
  for (let i = days; i >= 0; i--) {
    const d = format(subDays(new Date(), i), "yyyy-MM-dd")
    dailyData[d] = { date: format(subDays(new Date(), i), "dd/MM"), minutes: 0, tasks: 0 }
  }
  timeSessions.forEach((s) => {
    const d = format(s.startTime, "yyyy-MM-dd")
    if (dailyData[d]) dailyData[d].minutes += s.duration ?? 0
  })
  tasks.filter((t) => t.status === "DONE").forEach((t) => {
    const d = format(t.updatedAt, "yyyy-MM-dd")
    if (dailyData[d]) dailyData[d].tasks += 1
  })

  return NextResponse.json({
    totalMinutes,
    tasksDone,
    avgScore: Math.round(avgScore),
    dailyData: Object.values(dailyData),
    timeSessions,
  })
}
