import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !prisma) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const active = searchParams.get("active")

  if (active === "true") {
    const running = await prisma.timeSession.findFirst({
      where: { userId: session.user.id, endTime: null },
      include: { task: { select: { id: true, title: true } } },
    })
    return NextResponse.json(running)
  }

  const sessions = await prisma.timeSession.findMany({
    where: { userId: session.user.id },
    include: { task: { select: { id: true, title: true } } },
    orderBy: { startTime: "desc" },
    take: 50,
  })

  return NextResponse.json(sessions)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !prisma) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body = await req.json()

  const existing = await prisma.timeSession.findFirst({
    where: { userId: session.user.id, endTime: null },
  })
  if (existing) {
    return NextResponse.json({ error: "Un chronomètre est déjà en cours" }, { status: 409 })
  }

  const ts = await prisma.timeSession.create({
    data: {
      userId: session.user.id,
      taskId: body.taskId ?? null,
      startTime: new Date(),
      notes: body.notes,
    },
    include: { task: { select: { id: true, title: true } } },
  })

  return NextResponse.json(ts, { status: 201 })
}
