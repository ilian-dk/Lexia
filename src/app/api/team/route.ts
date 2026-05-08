import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || !prisma || !session.user.organizationId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const members = await prisma.user.findMany({
    where: { organizationId: session.user.organizationId },
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json(members)
}
