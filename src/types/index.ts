import { UserRole, TaskStatus, Priority, PlanTier } from "@prisma/client"

export type { UserRole, TaskStatus, Priority, PlanTier }

export interface TaskWithRelations {
  id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: Priority
  dueDate: Date | null
  estimatedMin: number | null
  projectId: string | null
  assigneeId: string | null
  aiScore: number | null
  aiReason: string | null
  createdAt: Date
  updatedAt: Date
  project?: { id: string; name: string; color: string } | null
  assignee?: { id: string; name: string | null; image: string | null } | null
  timeSessions?: TimeSessionBasic[]
}

export interface TimeSessionBasic {
  id: string
  startTime: Date
  endTime: Date | null
  duration: number | null
}

export interface ProjectBasic {
  id: string
  name: string
  color: string
  description: string | null
}

export interface UserBasic {
  id: string
  name: string | null
  email: string
  image: string | null
  role: UserRole
}

export interface AISuggestion {
  taskId: string
  score: number
  reason: string
  suggestedPriority: Priority
}

declare module "next-auth" {
  interface User {
    id: string
    role: string
    organizationId: string | null
    onboardingCompleted: boolean
  }
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
      organizationId: string | null
      onboardingCompleted: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    organizationId: string | null
    onboardingCompleted: boolean
  }
}
