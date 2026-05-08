import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("build@localhost")) {
    return null as unknown as PrismaClient
  }
  return new PrismaClient({ log: ["error"] })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
