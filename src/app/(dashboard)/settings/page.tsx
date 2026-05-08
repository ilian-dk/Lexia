"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Shield, Webhook, Download, Trash2, Zap } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function SettingsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [webhookUrl, setWebhookUrl] = useState("")

  async function saveWebhook(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/webhooks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl }),
    })
    if (res.ok) {
      toast({ title: "Webhook créé" })
      setWebhookUrl("")
    } else {
      toast({ title: "Erreur", variant: "destructive" })
    }
  }

  function exportData() {
    toast({ title: "Export RGPD", description: "Vos données seront envoyées par email dans 24h" })
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground text-sm">Gérez votre compte et vos préférences</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom</Label>
              <Input defaultValue={session?.user?.name ?? ""} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" defaultValue={session?.user?.email ?? ""} disabled />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1">
              <Shield className="h-3 w-3" />
              {session?.user?.role ?? "—"}
            </Badge>
          </div>
          <Button className="bg-indigo-500 hover:bg-indigo-600">Enregistrer</Button>
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-indigo-500" />
            Intégrations
          </CardTitle>
          <CardDescription>Connectez TimeTrack Pro à vos outils</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { name: "Google Calendar", desc: "Synchronisez vos tâches avec Google Agenda", status: "Disponible" },
            { name: "Microsoft Teams", desc: "Notifications et mises à jour dans Teams", status: "Disponible" },
            { name: "Slack", desc: "Rapports quotidiens dans vos channels Slack", status: "Bientôt" },
            { name: "Jira", desc: "Import/export de tickets Jira", status: "Bientôt" },
          ].map((integ) => (
            <div key={integ.name} className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="text-sm font-medium">{integ.name}</p>
                <p className="text-xs text-muted-foreground">{integ.desc}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                disabled={integ.status === "Bientôt"}
              >
                {integ.status === "Bientôt" ? "Bientôt" : "Connecter"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Webhooks */}
      {(session?.user?.role === "ADMIN" || session?.user?.role === "MANAGER") && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Webhook className="h-4 w-4 text-indigo-500" />
              Webhooks
            </CardTitle>
            <CardDescription>Recevez des notifications HTTP pour les événements</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={saveWebhook} className="flex gap-2">
              <Input
                placeholder="https://votre-serveur.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                type="url"
                required
              />
              <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600 flex-shrink-0">
                Ajouter
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* RGPD */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-500" />
            Données personnelles (RGPD)
          </CardTitle>
          <CardDescription>
            Conformément au RGPD, vous pouvez exporter ou supprimer vos données
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3 flex-wrap">
          <Button variant="outline" className="gap-2" onClick={exportData}>
            <Download className="h-4 w-4" />
            Exporter mes données
          </Button>
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" />
            Supprimer mon compte
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
