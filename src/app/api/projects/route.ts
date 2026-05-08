import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !prisma || !session.user.organizationId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const projects = await prisma.project.findMany({
    where: { organizationId: session.user.organizationId },
    include: { _count: { select: { tasks: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || !prisma || !session.user.organizationId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await req.json()
  const project = await prisma.project.create({
    data: {
      name: body.name,
      description: body.description,
      color: body.color ?? "#6366f1",
      organizationId: session.user.organizationId,
    },
  })

  return NextResponse.json(project, { status: 201 })
}
