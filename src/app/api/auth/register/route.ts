import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  organizationName: z.string().min(2),
  gdprConsent: z.boolean().refine((v) => v === true),
})

export async function POST(req: NextRequest) {
  if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) return NextResponse.json({ error: "Email déjà utilisé" }, { status: 409 })

    const slug = data.organizationName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now()
    const org = await prisma.organization.create({
      data: { name: data.organizationName, slug },
    })

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: await hash(data.password, 12),
        role: "ADMIN",
        organizationId: org.id,
        gdprConsent: true,
        gdprConsentDate: new Date(),
      },
    })

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
  } catch (err: any) {
    if (err.name === "ZodError") return NextResponse.json({ error: "Données invalides" }, { status: 400 })
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
