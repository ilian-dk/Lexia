'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Sparkles, ArrowRight, Users, Calculator, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const PLANS = [
  {
    name: 'Starter',
    price: 9,
    desc: 'Pour les petites équipes qui démarrent',
    color: 'from-slate-500 to-slate-600',
    badge: null,
    features: [
      'Jusqu\'à 10 utilisateurs',
      'Suivi du temps illimité',
      'Vue Kanban, liste, calendrier',
      'Rapports basiques',
      'Intégrations Google Calendar',
      'Support email',
      'Hébergement Europe',
      'Conformité RGPD',
    ],
    missing: ['IA de priorisation', 'Intégrations Teams/Slack', 'API REST', 'Webhooks', 'SSO/SAML', 'SLA garantie'],
  },
  {
    name: 'Business',
    price: 29,
    desc: 'Pour les équipes en croissance',
    color: 'from-blue-600 to-indigo-600',
    badge: 'Recommandé',
    features: [
      'Utilisateurs illimités',
      'IA de priorisation (Claude AI)',
      'Toutes les vues tâches',
      'Rapports avancés & exports',
      'Microsoft Teams + Slack',
      'Google Workspace complet',
      'API REST documentée',
      'Webhooks configurables',
      'Support prioritaire 24h',
      'Hébergement Europe dédié',
      'RGPD + DPA inclus',
    ],
    missing: ['SSO/SAML', 'SLA 99.9% garanti', 'Onboarding dédié'],
  },
  {
    name: 'Enterprise',
    price: null,
    desc: 'Pour les grandes entreprises',
    color: 'from-purple-600 to-indigo-700',
    badge: 'Sur mesure',
    features: [
      'Tout Business inclus',
      'SSO/SAML (Azure AD, Okta)',
      'SLA 99.9% garanti',
      'Onboarding dédié & formation',
      'Chef de projet dédié',
      'Intégrations SAP, Salesforce',
      'Data residency au choix',
      'Audit logs avancés',
      'Contrat DPA personnalisé',
      'Facturation consolidée',
      'Support 24/7 téléphone',
    ],
    missing: [],
  },
]

const FAQ = [
  { q: 'Puis-je changer de plan à tout moment ?', a: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement.' },
  { q: 'Que comprend l\'essai gratuit 14 jours ?', a: 'L\'essai gratuit donne accès au plan Business complet pendant 14 jours, sans carte bancaire requise.' },
  { q: 'Vos données sont-elles hébergées en Europe ?', a: 'Oui, toutes les données sont hébergées sur AWS eu-west-1 (Irlande). Nous sommes conformes RGPD et pouvons fournir un DPA.' },
  { q: 'Comment fonctionne l\'IA de priorisation ?', a: 'Notre IA (Claude par Anthropic) analyse vos deadlines, la charge de travail et l\'historique pour suggérer un ordre de priorité optimal, avec des explications claires.' },
  { q: 'Proposez-vous des tarifs pour les associations ?', a: 'Oui, nous offrons 50% de réduction pour les associations et ONG. Contactez notre équipe.' },
]

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual')
  const [employees, setEmployees] = useState(50)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const discount = billing === 'annual' ? 0.8 : 1
  const savedHoursPerEmployee = 2.5
  const hourlyRate = 55
  const monthlySavings = Math.round(employees * savedHoursPerEmployee * hourlyRate)
  const annualSavings = monthlySavings * 12

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">Lexia</span>
        </div>
        <div className="flex gap-3">
          <Link href="/login"><Button variant="ghost" size="sm">Connexion</Button></Link>
          <Link href="/register"><Button size="sm">Essai gratuit</Button></Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="secondary" className="text-xs">Tarifs transparents</Badge>
          <h1 className="text-4xl font-bold">Des tarifs adaptés à chaque taille d'équipe</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            14 jours gratuits sans carte bancaire. Passez à un plan payant quand vous êtes prêt.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm ${billing === 'monthly' ? 'font-semibold' : 'text-muted-foreground'}`}>Mensuel</span>
            <button
              onClick={() => setBilling(billing === 'monthly' ? 'annual' : 'monthly')}
              className={`relative w-12 h-6 rounded-full transition-colors ${billing === 'annual' ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${billing === 'annual' ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
            <span className={`text-sm ${billing === 'annual' ? 'font-semibold' : 'text-muted-foreground'}`}>
              Annuel
              <Badge variant="default" className="ml-2 text-[10px] bg-emerald-500">-20%</Badge>
            </span>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden ${plan.badge === 'Recommandé' ? 'border-primary shadow-lg shadow-primary/10 scale-105' : ''}`}
            >
              {plan.badge && (
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${plan.color}`} />
              )}
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      {plan.badge && (
                        <Badge className={`text-[10px] bg-gradient-to-r ${plan.color} text-white border-0`}>
                          {plan.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{plan.desc}</p>
                  </div>
                </div>

                <div className="mb-6">
                  {plan.price !== null ? (
                    <div>
                      <span className="text-4xl font-bold">{Math.round(plan.price * discount)}€</span>
                      <span className="text-muted-foreground text-sm">/utilisateur/mois</span>
                      {billing === 'annual' && (
                        <p className="text-xs text-emerald-600 mt-0.5">Facturé {Math.round(plan.price * discount * 12)}€/an</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <span className="text-2xl font-bold">Sur devis</span>
                      <p className="text-xs text-muted-foreground mt-0.5">Tarif personnalisé selon vos besoins</p>
                    </div>
                  )}
                </div>

                <Link href={plan.price === null ? '#contact' : '/register'}>
                  <Button
                    className={`w-full mb-6 ${plan.badge === 'Recommandé' ? '' : ''}`}
                    variant={plan.badge === 'Recommandé' ? 'default' : 'outline'}
                  >
                    {plan.price === null ? 'Nous contacter' : 'Démarrer l\'essai gratuit'}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>

                <div className="space-y-2">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                  {plan.missing.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm text-muted-foreground line-through">
                      <span className="w-4 h-4 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ROI Calculator */}
        <div id="roi" className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-900">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">Calculateur de ROI</h2>
            </div>
            <p className="text-muted-foreground">Estimez les économies générées par Lexia dans votre entreprise</p>
          </div>

          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">
                Nombre d'employés : <span className="text-primary font-bold">{employees}</span>
              </label>
              <input
                type="range"
                min={5}
                max={500}
                step={5}
                value={employees}
                onChange={(e) => setEmployees(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>5</span>
                <span>500</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  label: 'Heures économisées/mois',
                  value: `${Math.round(employees * savedHoursPerEmployee)}h`,
                  sub: `${savedHoursPerEmployee}h/employé en moyenne`,
                  color: 'text-blue-600',
                },
                {
                  label: 'Économies mensuelles',
                  value: `${monthlySavings.toLocaleString('fr-FR')}€`,
                  sub: `À ${hourlyRate}€/h chargé`,
                  color: 'text-emerald-600',
                },
                {
                  label: 'ROI annuel estimé',
                  value: `${annualSavings.toLocaleString('fr-FR')}€`,
                  sub: 'Gain net de productivité',
                  color: 'text-indigo-600',
                },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-white dark:bg-card rounded-xl border border-border shadow-sm">
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-sm font-medium mt-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.sub}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Estimation basée sur une moyenne de {savedHoursPerEmployee}h économisées par employé et par mois grâce à l'automatisation du reporting et à la priorisation IA.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {FAQ.map((item, i) => (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-sm">{item.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 shrink-0 text-muted-foreground" />
                    : <ChevronDown className="w-4 h-4 shrink-0 text-muted-foreground" />
                  }
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 py-8">
          <h2 className="text-3xl font-bold">Prêt à booster la productivité de vos équipes ?</h2>
          <p className="text-muted-foreground">Rejoignez 2 400+ entreprises qui font confiance à Lexia</p>
          <div className="flex gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2 px-8">
                Commencer l'essai gratuit <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Button variant="outline" size="lg">Voir une démo</Button>
          </div>
          <p className="text-xs text-muted-foreground">14 jours gratuits · Sans carte bancaire · Annulation à tout moment</p>
        </div>
      </div>
    </div>
  )
}
