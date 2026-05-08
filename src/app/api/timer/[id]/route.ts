import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !prisma) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body = await req.json()
  const now = new Date()

  const existing = await prisma.timeSession.findUnique({ where: { id: params.id } })
  if (!existing || existing.userId !== session.user.id) {
    return NextResponse.json({ error: "Non trouvé" }, { status: 404 })
  }

  const endTime = body.endTime ? new Date(body.endTime) : now
  const duration = Math.round((endTime.getTime() - existing.startTime.getTime()) / 60000)

  const ts = await prisma.timeSession.update({
    where: { id: params.id },
    data: { endTime, duration, notes: body.notes },
    include: { task: { select: { id: true, title: true } } },
  })

  return NextResponse.json(ts)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !prisma) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  await prisma.timeSession.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
