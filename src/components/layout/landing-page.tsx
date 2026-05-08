'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Sparkles, Check, ArrowRight, Clock, CheckSquare, BarChart2, Shield,
  Zap, Users, Plug, Star, Play, ChevronDown, TrendingUp, Calculator
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

const FEATURES = [
  {
    icon: Clock,
    title: 'Suivi du temps précis',
    desc: 'Timer intégré, saisie manuelle, historique complet. Savoir exactement où va le temps de vos équipes.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Zap,
    title: 'IA de priorisation explicable',
    desc: 'Claude AI analyse deadlines, charge et historique pour proposer un ordre optimal avec des explications claires.',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    icon: CheckSquare,
    title: 'Triple vue des tâches',
    desc: 'Kanban, liste ou calendrier selon vos préférences. Drag & drop, filtres avancés, vue par équipe.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Shield,
    title: 'Sécurité & conformité RGPD',
    desc: 'Hébergement AWS eu-west-1, logs d\'accès, DPA téléchargeable, droit à l\'oubli. Certifié ISO 27001.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Plug,
    title: 'Intégrations enterprise',
    desc: 'Microsoft Teams, Google Workspace, API REST ouverte, webhooks. Connectez SAP, Salesforce et vos outils métiers.',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: BarChart2,
    title: 'Analytics & rapports',
    desc: 'Tableaux de bord temps réel, scores de productivité, taux d\'adoption, exports CSV/PDF pour vos DAF.',
    color: 'bg-cyan-50 text-cyan-600',
  },
]

const TESTIMONIALS = [
  {
    name: 'Sophie Martin',
    role: 'DAF, Groupe Horizon',
    company: '1 200 employés',
    quote: '"Lexia a réduit notre temps de reporting de 6h à 40 minutes par semaine. Le ROI est visible dès le premier mois."',
    avatar: 'SM',
    stars: 5,
  },
  {
    name: 'Jean-Pierre Dumont',
    role: 'DSI, TechVision SA',
    company: '450 employés',
    quote: '"L\'IA de priorisation a transformé notre façon de travailler. Nos équipes savent exactement sur quoi se concentrer."',
    avatar: 'JD',
    stars: 5,
  },
  {
    name: 'Claire Beaumont',
    role: 'DRH, Innova Group',
    company: '800 employés',
    quote: '"La conformité RGPD out-of-the-box nous a économisé 3 mois de travail juridique. Le DPA est prêt à signer."',
    avatar: 'CB',
    stars: 5,
  },
]

const STATS = [
  { value: '2 400+', label: 'entreprises clientes' },
  { value: '32%', label: 'gain de productivité moyen' },
  { value: '99.9%', label: 'uptime garanti' },
  { value: '< 4h', label: 'temps d\'onboarding' },
]

export default function LandingPage() {
  const [employees, setEmployees] = useState(50)
  const savings = Math.round(employees * 2.5 * 55)

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">Lexia</span>
          <Badge variant="secondary" className="text-[10px] ml-2">Beta</Badge>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          {[['#features', 'Fonctionnalités'], ['#security', 'Sécurité'], ['/pricing', 'Tarifs'], ['#roi', 'ROI']].map(([href, label]) => (
            <Link key={label} href={href} className="hover:text-foreground transition-colors">{label}</Link>
          ))}
        </div>
        <div className="flex gap-2">
          <Link href="/login"><Button variant="ghost" size="sm">Connexion</Button></Link>
          <Link href="/register"><Button size="sm">Essai gratuit 14j</Button></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-8 py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05),transparent_70%)]" />
        <div className="relative max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            Propulsé par Claude AI (Anthropic)
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Le suivi du temps<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              intelligent pour vos équipes
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Lexia combine suivi du temps précis, IA de priorisation explicable et conformité RGPD pour booster la productivité des grandes entreprises.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8">
                Démarrer l'essai gratuit <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="gap-2">
              <Play className="w-4 h-4" />
              Voir la démo (2 min)
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            14 jours gratuits · Sans carte bancaire · Hébergement Europe · RGPD
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="px-8 py-12 border-y border-border bg-muted/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Tout ce dont les grandes entreprises ont besoin</h2>
            <p className="text-muted-foreground">Conçu pour répondre aux exigences des DAF, DRH et DSI</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <Card key={f.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security section */}
      <section id="security" className="px-8 py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h2 className="text-3xl font-bold">Sécurité de niveau enterprise</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {[
                'Hébergement AWS eu-west-1 (Irlande)',
                'Chiffrement AES-256 au repos + TLS 1.3 en transit',
                'Authentification 2FA (TOTP + SMS)',
                'SSO/SAML (Azure AD, Okta) — plan Enterprise',
                'Sauvegardes automatiques toutes les 6h',
                'Tests de pénétration annuels',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 text-sm">{item}</span>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {[
                'Conformité RGPD + DPA téléchargeable',
                'Logs d\'accès avec rétention 2 ans',
                'Droit à l\'oubli (suppression sur demande)',
                'Contrat DPA personnalisable Enterprise',
                'Certification ISO 27001',
                'SOC 2 Type II en cours',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-200 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section id="roi" className="px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            <h2 className="text-3xl font-bold">Calculez votre ROI</h2>
          </div>
          <p className="text-muted-foreground mb-8">Estimez les économies générées pour votre entreprise</p>

          <div className="bg-muted/30 rounded-2xl p-8 border border-border">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Nombre d'employés : <span className="text-primary font-bold text-lg">{employees}</span>
              </label>
              <input
                type="range" min={5} max={500} step={5}
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white dark:bg-card rounded-xl border border-border">
                <p className="text-2xl font-bold text-blue-600">{Math.round(employees * 2.5)}h</p>
                <p className="text-xs text-muted-foreground">Heures/mois économisées</p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-card rounded-xl border border-border">
                <p className="text-2xl font-bold text-emerald-600">{savings.toLocaleString('fr-FR')}€</p>
                <p className="text-xs text-muted-foreground">Gain mensuel estimé</p>
              </div>
              <div className="text-center p-4 bg-white dark:bg-card rounded-xl border border-border">
                <p className="text-2xl font-bold text-indigo-600">{(savings * 12).toLocaleString('fr-FR')}€</p>
                <p className="text-xs text-muted-foreground">ROI annuel</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-8 py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Ce que disent nos clients</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name}>
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array(t.stars).fill(0).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed italic mb-4">{t.quote}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-8 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">Prêt à transformer la productivité de vos équipes ?</h2>
          <p className="text-muted-foreground mb-8">Rejoignez 2 400+ entreprises qui font confiance à Lexia</p>
          <div className="flex gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8">
                Commencer l'essai gratuit <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">Voir les tarifs</Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            14 jours · Sans CB · Annulation à tout moment · RGPD · AWS eu-west-1
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm">Lexia</span>
            <span className="text-xs text-muted-foreground">· Hébergement AWS eu-west-1 · RGPD</span>
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground">CGU</Link>
            <Link href="#" className="hover:text-foreground">Confidentialité</Link>
            <Link href="/pricing" className="hover:text-foreground">Tarifs</Link>
            <Link href="/login" className="hover:text-foreground">Connexion</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
