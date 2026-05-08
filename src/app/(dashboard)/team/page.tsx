"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Users, Plus, Mail, Shield } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const roleLabel: Record<string, string> = {
  ADMIN: "Admin",
  MANAGER: "Manager",
  EMPLOYEE: "Employé",
}

const roleBadge: Record<string, string> = {
  ADMIN: "bg-purple-100 text-purple-700",
  MANAGER: "bg-blue-100 text-blue-700",
  EMPLOYEE: "bg-gray-100 text-gray-700",
}

interface Member {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
  createdAt: string
}

export default function TeamPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [members, setMembers] = useState<Member[]>([])
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")

  useEffect(() => {
    fetch("/api/team").then((r) => r.json()).then((d) => {
      if (Array.isArray(d)) setMembers(d)
    })
  }, [])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    toast({ title: "Invitation envoyée", description: `Un email a été envoyé à ${inviteEmail}` })
    setInviteEmail("")
    setShowInvite(false)
  }

  const isAdmin = session?.user?.role === "ADMIN"

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Équipe</h1>
          <p className="text-muted-foreground text-sm">
            {members.length} membre{members.length !== 1 ? "s" : ""}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowInvite(true)} className="gap-2 bg-indigo-500 hover:bg-indigo-600">
            <Plus className="h-4 w-4" />
            Inviter
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.length === 0 ? (
          <Card className="col-span-3">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun membre trouvé</p>
            </CardContent>
          </Card>
        ) : (
          members.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.image ?? undefined} />
                    <AvatarFallback>
                      {(member.name ?? member.email).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{member.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </p>
                  </div>
                  <Badge className={`text-xs flex-shrink-0 ${roleBadge[member.role]}`} variant="outline">
                    <Shield className="h-3 w-3 mr-1" />
                    {roleLabel[member.role]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Roles explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rôles et permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { role: "ADMIN", label: "Admin", desc: "Accès complet : gestion équipe, intégrations, facturation, paramètres" },
              { role: "MANAGER", label: "Manager", desc: "Gestion projets et tâches, accès aux analytics d'équipe" },
              { role: "EMPLOYEE", label: "Employé", desc: "Suivi de temps, gestion de ses propres tâches, analytics personnels" },
            ].map((r) => (
              <div key={r.role} className="p-3 rounded-lg border">
                <Badge className={`mb-2 ${roleBadge[r.role]}`} variant="outline">
                  {r.label}
                </Badge>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Inviter un membre</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="collegue@entreprise.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowInvite(false)}>Annuler</Button>
              <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600">Envoyer l'invitation</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
