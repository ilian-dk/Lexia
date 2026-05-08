import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !prisma) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const projectId = searchParams.get("projectId")
  const status = searchParams.get("status")

  const tasks = await prisma.task.findMany({
    where: {
      ...(projectId ? { projectId } : {}),
      ...(status ? { status: status as any } : {}),
      OR: [
        { assigneeId: session.user.id },
        { project: { organizationId: session.user.organizationId ?? undefined } },
      ],
    },
    include: {
      project: { select: { id: true, name: true, color: true } },
      assignee: { select: { id: true, name: true, image: true } },
      timeSessions: { select: { id: true, startTime: true, endTime: true, duration: true } },
    },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(tasks)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !prisma) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body = await req.json()
  const task = await prisma.task.create({
    data: {
      title: body.title,
      description: body.description,
      status: body.status ?? "TODO",
      priority: body.priority ?? "MEDIUM",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      estimatedMin: body.estimatedMin,
      projectId: body.projectId,
      assigneeId: body.assigneeId ?? session.user.id,
    },
    include: {
      project: { select: { id: true, name: true, color: true } },
      assignee: { select: { id: true, name: true, image: true } },
    },
  })

  return NextResponse.json(task, { status: 201 })
}
