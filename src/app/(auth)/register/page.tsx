"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [gdprAccepted, setGdprAccepted] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    organizationName: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!gdprAccepted) {
      toast({ title: "Consentement requis", description: "Veuillez accepter la politique de confidentialité", variant: "destructive" })
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, gdprConsent: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur d'inscription")
      toast({ title: "Compte créé !", description: "Bienvenue sur TimeTrack Pro" })
      router.push("/login")
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="h-8 w-8 text-indigo-500" />
            <span className="text-2xl font-bold">TimeTrack Pro</span>
          </div>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>14 jours gratuits · Aucune carte bancaire</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                placeholder="Marie Dupont"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="org">Nom de l'organisation</Label>
              <Input
                id="org"
                placeholder="Mon Entreprise SAS"
                value={form.organizationName}
                onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                placeholder="vous@entreprise.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 caractères"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={8}
                required
              />
            </div>
            <div
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                gdprAccepted ? "border-indigo-500 bg-indigo-50" : "border-border"
              }`}
              onClick={() => setGdprAccepted(!gdprAccepted)}
            >
              <div className={`mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                gdprAccepted ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
              }`}>
                {gdprAccepted && <CheckCircle className="h-3 w-3 text-white" />}
              </div>
              <p className="text-sm text-muted-foreground">
                J'accepte la{" "}
                <span className="text-indigo-500 hover:underline">politique de confidentialité</span>{" "}
                et le traitement de mes données personnelles conformément au RGPD.
              </p>
            </div>
            <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Créer mon compte
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link href="/login" className="text-indigo-500 hover:underline font-medium">
              Se connecter
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
