"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Clock,
  LayoutDashboard,
  CheckSquare,
  Timer,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Sparkles,
  DollarSign,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
  { href: "/tasks", icon: CheckSquare, label: "Tâches" },
  { href: "/timer", icon: Timer, label: "Chronomètre" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/team", icon: Users, label: "Équipe" },
  { href: "/settings", icon: Settings, label: "Paramètres" },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "??"

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <Clock className="h-7 w-7 text-indigo-500" />
        <span className="text-lg font-bold">TimeTrack Pro</span>
      </div>

      <nav className="flex-1 overflow-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                  active
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-3 border-t space-y-2">
        <Link href="/pricing">
          <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Passer à Pro
          </span>
        </Link>
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session?.user?.image ?? undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session?.user?.name ?? "Utilisateur"}</p>
            <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
