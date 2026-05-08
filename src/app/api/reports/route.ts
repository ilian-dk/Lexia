import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfWeek, endOfWeek, subWeeks, format } from 'date-fns'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !prisma) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const organizationId = (session.user as any).organizationId
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') ?? 'dashboard'

  const taskWhere = organizationId
    ? { project: { organizationId } }
    : { assigneeId: userId }

  if (type === 'dashboard') {
    const now = new Date()
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

    const [totalTasks, completedTasks, inProgressTasks, weekTimeSessions, atRiskTasks] =
      await Promise.all([
        prisma.task.count({ where: taskWhere }),
        prisma.task.count({ where: { status: 'DONE', ...taskWhere } }),
        prisma.task.count({ where: { status: 'IN_PROGRESS', ...taskWhere } }),
        prisma.timeSession.aggregate({
          where: {
            userId,
            startTime: { gte: weekStart, lte: weekEnd },
            endTime: { not: null },
          },
          _sum: { duration: true },
        }),
        prisma.task.count({
          where: {
            status: { not: 'DONE' },
            dueDate: { lt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000) },
            ...taskWhere,
          },
        }),
      ])

    const weeklyHours = Math.round(((weekTimeSessions._sum.duration ?? 0) / 60) * 10) / 10
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return NextResponse.json({
      totalTasks,
      completedTasks,
      inProgressTasks,
      weeklyHours,
      completionRate,
      tasksAtRisk: atRiskTasks,
      productivityScore: Math.min(100, Math.round(completionRate * 0.6 + (weeklyHours / 40) * 40)),
    })
  }

  if (type === 'weekly-time') {
    const weeks = []
    for (let i = 5; i >= 0; i--) {
      const start = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 })
      const end = endOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 })
      const agg = await prisma.timeSession.aggregate({
        where: { userId, startTime: { gte: start, lte: end }, endTime: { not: null } },
        _sum: { duration: true },
      })
      weeks.push({
        week: format(start, 'dd/MM'),
        hours: Math.round(((agg._sum.duration ?? 0) / 60) * 10) / 10,
      })
    }
    return NextResponse.json(weeks)
  }

  return NextResponse.json({ error: 'Unknown report type' }, { status: 400 })
}
