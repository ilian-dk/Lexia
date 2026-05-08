"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Clock, CheckCircle, ArrowLeft, Calculator } from "lucide-react"

const plans = [
  {
    name: "Gratuit",
    price: 0,
    period: "",
    desc: "Parfait pour débuter",
    badge: null,
    features: [
      "1 utilisateur",
      "3 projets",
      "Chronomètre basique",
      "Vue liste et Kanban",
      "7 jours d'historique",
    ],
    cta: "Commencer gratuitement",
    href: "/register",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: 12,
    period: "/ utilisateur / mois",
    desc: "Pour les équipes productives",
    badge: "Le plus populaire",
    features: [
      "Utilisateurs illimités",
      "Projets illimités",
      "IA prioritization (Claude)",
      "Vue Calendrier",
      "Analytics avancés",
      "Intégrations (Google, Teams)",
      "Webhooks",
      "Export RGPD",
      "Support prioritaire",
    ],
    cta: "Essai gratuit 14 jours",
    href: "/register",
    variant: "default" as const,
  },
  {
    name: "Enterprise",
    price: 35,
    period: "/ utilisateur / mois",
    desc: "Pour les grandes organisations",
    badge: null,
    features: [
      "Tout le plan Pro",
      "SSO / SAML",
      "Audit logs complets",
      "SLA 99.9%",
      "Déploiement on-premise",
      "API rate limits étendus",
      "Account manager dédié",
      "Formations incluses",
    ],
    cta: "Contacter les ventes",
    href: "/register",
    variant: "outline" as const,
  },
]

export default function PricingPage() {
  const [employees, setEmployees] = useState(10)
  const [avgSalary, setAvgSalary] = useState(45000)
  const [productivityGain, setProductivityGain] = useState(15)

  const annualSavings = Math.round((avgSalary * (productivityGain / 100) * employees))
  const toolCost = employees * 12 * 12
  const roi = toolCost > 0 ? Math.round(((annualSavings - toolCost) / toolCost) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-white/70 hover:text-white gap-1">
              <ArrowLeft className="h-4 w-4" />
              Accueil
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-indigo-400" />
            <span className="font-bold">TimeTrack Pro</span>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Tarifs simples et transparents
        </h1>
        <p className="text-lg text-white/60">
          Commencez gratuitement. Évoluez quand vous êtes prêt.
        </p>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.badge
                  ? "border-indigo-500 shadow-indigo-500/20 shadow-xl bg-white"
                  : "bg-white/95"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-indigo-500 text-white">{plan.badge}</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">{plan.name}</CardTitle>
                <CardDescription>{plan.desc}</CardDescription>
                <div className="pt-2">
                  <span className="text-4xl font-black text-gray-900">
                    {plan.price === 0 ? "Gratuit" : `€${plan.price}`}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-muted-foreground ml-1">{plan.period}</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Link href={plan.href} className="w-full">
                  <Button
                    className={`w-full ${
                      plan.variant === "default" ? "bg-indigo-500 hover:bg-indigo-600" : ""
                    }`}
                    variant={plan.variant}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <Card className="bg-white/10 border-white/20 text-white">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calculator className="h-6 w-6 text-indigo-400" />
              <CardTitle className="text-white">Calculateur de ROI</CardTitle>
            </div>
            <CardDescription className="text-white/60">
              Estimez les économies annuelles générées par TimeTrack Pro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="space-y-2">
                <Label className="text-white/80">Nombre d'employés</Label>
                <Input
                  type="number"
                  value={employees}
                  onChange={(e) => setEmployees(parseInt(e.target.value) || 0)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  min={1}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Salaire annuel moyen (€)</Label>
                <Input
                  type="number"
                  value={avgSalary}
                  onChange={(e) => setAvgSalary(parseInt(e.target.value) || 0)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  step={1000}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/80">Gain de productivité estimé (%)</Label>
                <Input
                  type="number"
                  value={productivityGain}
                  onChange={(e) => setProductivityGain(parseInt(e.target.value) || 0)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  min={1}
                  max={100}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 p-6 bg-white/5 rounded-xl border border-white/10">
              <div className="text-center">
                <div className="text-3xl font-black text-green-400">
                  €{annualSavings.toLocaleString("fr-FR")}
                </div>
                <div className="text-sm text-white/60 mt-1">Économies annuelles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-indigo-400">
                  €{toolCost.toLocaleString("fr-FR")}
                </div>
                <div className="text-sm text-white/60 mt-1">Coût annuel Pro</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-black ${roi > 0 ? "text-green-400" : "text-red-400"}`}>
                  {roi > 0 ? "+" : ""}{roi}%
                </div>
                <div className="text-sm text-white/60 mt-1">ROI</div>
              </div>
            </div>

            {roi > 0 && (
              <p className="text-center text-sm text-white/60 mt-4">
                En moyenne, nos clients récupèrent leur investissement en moins de{" "}
                <span className="text-white font-semibold">2 mois</span>.
              </p>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <Link href="/register">
              <Button className="bg-indigo-500 hover:bg-indigo-600 gap-2">
                Commencer gratuitement
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}
