import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !prisma) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body = await req.json()
  const task = await prisma.task.update({
    where: { id: params.id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.status !== undefined && { status: body.status }),
      ...(body.priority !== undefined && { priority: body.priority }),
      ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
      ...(body.estimatedMin !== undefined && { estimatedMin: body.estimatedMin }),
      ...(body.projectId !== undefined && { projectId: body.projectId }),
      ...(body.assigneeId !== undefined && { assigneeId: body.assigneeId }),
      ...(body.aiScore !== undefined && { aiScore: body.aiScore }),
      ...(body.aiReason !== undefined && { aiReason: body.aiReason }),
    },
    include: {
      project: { select: { id: true, name: true, color: true } },
      assignee: { select: { id: true, name: true, image: true } },
    },
  })

  return NextResponse.json(task)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !prisma) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  await prisma.task.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
