import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { randomBytes } from "crypto"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !prisma || !session.user.organizationId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const webhooks = await prisma.webhook.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(webhooks)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !prisma || !session.user.organizationId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }
  if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
    return NextResponse.json({ error: "Permissions insuffisantes" }, { status: 403 })
  }

  const body = await req.json()
  const webhook = await prisma.webhook.create({
    data: {
      organizationId: session.user.organizationId,
      url: body.url,
      secret: randomBytes(32).toString("hex"),
      events: body.events ?? ["task.created", "task.updated", "timer.stopped"],
    },
  })

  return NextResponse.json(webhook, { status: 201 })
}
