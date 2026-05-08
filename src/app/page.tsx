import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Clock,
  BarChart3,
  Brain,
  Shield,
  Users,
  Zap,
  CheckCircle,
  ArrowRight,
  Timer,
  KanbanSquare,
  CalendarDays,
} from "lucide-react"

export default function LandingPage() {
  const features = [
    { icon: Timer, title: "Suivi de temps précis", desc: "Chronomètre intelligent avec association automatique aux tâches et projets" },
    { icon: KanbanSquare, title: "Kanban / Liste / Calendrier", desc: "Trois vues pour gérer vos tâches selon votre préférence de travail" },
    { icon: Brain, title: "IA prioritization (Claude)", desc: "L'IA analyse vos tâches et explique ses recommandations de priorité en français" },
    { icon: BarChart3, title: "Analytics avancés", desc: "Tableaux de bord de productivité, rapports d'équipe et ROI mesurable" },
    { icon: Shield, title: "RGPD & Conformité", desc: "Logs d'accès, consentement, export/suppression des données personnelles" },
    { icon: Users, title: "Gestion d'équipe", desc: "Rôles Admin / Manager / Employé avec permissions granulaires" },
    { icon: Zap, title: "Intégrations", desc: "Google Calendar, Microsoft Teams, Webhooks, API REST complète" },
    { icon: CalendarDays, title: "Onboarding guidé", desc: "Mise en route en moins de 5 minutes pour toute l'équipe" },
  ]

  const stats = [
    { value: "3.2×", label: "Gain de productivité moyen" },
    { value: "47%", label: "Réduction du temps admin" },
    { value: "€18k", label: "Économies annuelles / équipe" },
    { value: "2 min", label: "Temps de prise en main" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-7 w-7 text-indigo-400" />
            <span className="text-xl font-bold">TimeTrack Pro</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm text-white/70 hover:text-white transition-colors">
              Tarifs
            </Link>
            <Link href="/login">
              <Button variant="ghost" className="text-white border-white/20 hover:bg-white/10">
                Se connecter
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-indigo-500 hover:bg-indigo-600">
                Essai gratuit
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <Badge className="mb-6 bg-indigo-500/20 text-indigo-300 border-indigo-500/30">
          Propulsé par Claude AI
        </Badge>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
          Le suivi de temps qui
          <span className="text-indigo-400"> comprend</span> votre équipe
        </h1>
        <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10">
          TimeTrack Pro combine gestion de tâches, suivi de temps et intelligence artificielle pour
          transformer la productivité de vos équipes avec des insights actionnables.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="bg-indigo-500 hover:bg-indigo-600 gap-2 text-lg px-8">
              Démarrer gratuitement <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 text-lg px-8">
              Voir les tarifs
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="text-center p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-4xl font-black text-indigo-400 mb-2">{s.value}</div>
            <div className="text-sm text-white/60">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center mb-4">Tout ce dont votre équipe a besoin</h2>
        <p className="text-center text-white/60 mb-12 max-w-2xl mx-auto">
          Une plateforme unifiée pour suivre le temps, gérer les tâches et mesurer la productivité.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="bg-white/5 border-white/10 text-white">
              <CardHeader className="pb-3">
                <f.icon className="h-8 w-8 text-indigo-400 mb-2" />
                <CardTitle className="text-base">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-white/60">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="bg-indigo-600/20 border border-indigo-500/30 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Prêt à booster la productivité de votre équipe ?</h2>
          <p className="text-white/60 mb-8">
            Rejoignez des milliers d'équipes qui font confiance à TimeTrack Pro. 14 jours d'essai gratuit, sans carte bancaire.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {["Aucune carte requise", "Annulation facile", "Support réactif"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-white/70">
                <CheckCircle className="h-4 w-4 text-green-400" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg" className="bg-indigo-500 hover:bg-indigo-600 gap-2">
                Commencer maintenant <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-white/40 text-sm">
        <p>© 2025 TimeTrack Pro · RGPD compliant · <Link href="/pricing" className="hover:text-white/70">Tarifs</Link></p>
      </footer>
    </div>
  )
}
