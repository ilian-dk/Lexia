'use client'

import { useState } from 'react'
import { Zap, RefreshCw, AlertTriangle, ArrowRight, Clock, Loader2, TrendingUp, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const MOCK_SUGGESTIONS = [
  {
    taskId: '1',
    score: 94,
    urgencyLevel: 'critical',
    explanation: 'Cette tâche est critique car sa deadline est dans 36h et elle est assignée à un membre déjà chargé à 95%. Un retard impacterait directement la production.',
    task: { title: 'Audit sécurité infrastructure cloud', priority: 'URGENT', deadline: new Date(Date.now() + 1.5 * 86400000), assignee: { name: 'Marie Laurent', initials: 'ML' }, estimatedHours: 8, project: { name: 'Infra 2025', color: '#ef4444' } }
  },
  {
    taskId: '2',
    score: 78,
    urgencyLevel: 'high',
    explanation: 'La révision de code bloque la mise en production prévue vendredi. La charge de l\'équipe dev est à 80% cette semaine.',
    task: { title: 'Revue de code module authentification', priority: 'HIGH', deadline: new Date(Date.now() + 2 * 86400000), assignee: { name: 'Marie Laurent', initials: 'ML' }, estimatedHours: 3, project: { name: 'Infra 2025', color: '#ef4444' } }
  },
  {
    taskId: '3',
    score: 71,
    urgencyLevel: 'high',
    explanation: 'Le rapport Q2 est attendu par la Direction Financière d\'ici 5 jours. Sophie est à 70% de capacité cette semaine, ce qui reste gérable.',
    task: { title: 'Rapport Q2 pour la Direction Financière', priority: 'HIGH', deadline: new Date(Date.now() + 5 * 86400000), assignee: { name: 'Sophie Martin', initials: 'SM' }, estimatedHours: 4, project: { name: 'Reporting', color: '#8b5cf6' } }
  },
  {
    taskId: '4',
    score: 58,
    urgencyLevel: 'medium',
    explanation: 'Migration importante mais la deadline dans 3 jours laisse suffisamment de temps. Thomas est disponible à 60% cette semaine.',
    task: { title: 'Migration base de données PostgreSQL v15', priority: 'HIGH', deadline: new Date(Date.now() + 3 * 86400000), assignee: { name: 'Thomas Roux', initials: 'TR' }, estimatedHours: 12, project: { name: 'Migration DB', color: '#f59e0b' } }
  },
  {
    taskId: '5',
    score: 38,
    urgencyLevel: 'medium',
    explanation: 'Les webhooks Salesforce ont une deadline confortable dans 10 jours. Peut être planifié en début de semaine prochaine.',
    task: { title: 'Mise en place des webhooks Salesforce', priority: 'MEDIUM', deadline: new Date(Date.now() + 10 * 86400000), assignee: { name: 'Thomas Roux', initials: 'TR' }, estimatedHours: 5, project: { name: 'CRM Connect', color: '#3b82f6' } }
  },
  {
    taskId: '6',
    score: 22,
    urgencyLevel: 'low',
    explanation: 'Documentation avec deadline dans 14 jours et priorité faible. Peut être traité en fin de semaine ou la semaine prochaine.',
    task: { title: 'Documentation API REST v2', priority: 'LOW', deadline: new Date(Date.now() + 14 * 86400000), assignee: { name: 'Sophie Martin', initials: 'SM' }, estimatedHours: 8, project: { name: 'API Publique', color: '#06b6d4' } }
  },
]

const URGENCY_CONFIG = {
  critical: { label: 'Critique', color: 'text-red-600 bg-red-50 border-red-200', dot: 'bg-red-500' },
  high: { label: 'Haute', color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
  medium: { label: 'Moyenne', color: 'text-blue-600 bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  low: { label: 'Faible', color: 'text-slate-600 bg-slate-50 border-slate-200', dot: 'bg-slate-400' },
}

const WORKLOAD_DATA = [
  { name: 'Marie Laurent', workload: 95, tasks: 8 },
  { name: 'Thomas Roux', workload: 60, tasks: 5 },
  { name: 'Sophie Martin', workload: 70, tasks: 6 },
  { name: 'Alex Beaulieu', workload: 45, tasks: 4 },
]

export default function AIPrioritiesPage() {
  const [suggestions, setSuggestions] = useState(MOCK_SUGGESTIONS)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const handleRefresh = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 2000))
    setLoading(false)
    setLastUpdated(new Date())
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600'
    if (score >= 60) return 'text-amber-600'
    if (score >= 40) return 'text-blue-600'
    return 'text-slate-500'
  }

  const getDeadlineText = (deadline: Date) => {
    const diff = Math.ceil((deadline.getTime() - Date.now()) / 86400000)
    if (diff < 0) return `En retard (${Math.abs(diff)}j)`
    if (diff === 0) return "Aujourd'hui"
    if (diff === 1) return 'Demain'
    return `Dans ${diff}j`
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Suggestions IA
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Analyse par Claude AI · Dernière mise à jour : {lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={loading} variant="outline" className="gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Actualiser l'analyse
        </Button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900">
        <Info className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Comment fonctionne l'IA ?</p>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5 leading-relaxed">
            Claude AI analyse vos deadlines, la charge de travail actuelle de chaque membre et l'historique de productivité pour établir un ordre de priorité optimal. Chaque suggestion est accompagnée d'une explication concrète.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Suggestions list */}
        <div className="xl:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Ordre de traitement recommandé
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Claude AI analyse vos tâches...</p>
            </div>
          ) : (
            suggestions.map((s, index) => {
              const urgency = URGENCY_CONFIG[s.urgencyLevel as keyof typeof URGENCY_CONFIG]
              return (
                <Card key={s.taskId} className={`transition-shadow hover:shadow-md ${s.urgencyLevel === 'critical' ? 'border-red-200 dark:border-red-900' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Rank */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${
                        index === 0 ? 'bg-red-100 text-red-600' :
                        index === 1 ? 'bg-amber-100 text-amber-600' :
                        index === 2 ? 'bg-blue-100 text-blue-600' : 'bg-muted text-muted-foreground'
                      }`}>
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="w-2 h-2 rounded-full" style={{ background: s.task.project.color }} />
                              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.task.project.name}</span>
                            </div>
                            <p className="font-semibold text-sm">{s.task.title}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`text-lg font-bold ${getScoreColor(s.score)}`}>{s.score}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${urgency.color}`}>
                              {urgency.label}
                            </span>
                          </div>
                        </div>

                        {/* AI Explanation */}
                        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50 mb-3">
                          <Zap className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                          <p className="text-xs text-muted-foreground leading-relaxed">{s.explanation}</p>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{getDeadlineText(s.task.deadline)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>~{s.task.estimatedHours}h estimées</span>
                          </div>
                          <div className="flex items-center gap-1.5 ml-auto">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="text-[9px]">{s.task.assignee.initials}</AvatarFallback>
                            </Avatar>
                            <span>{s.task.assignee.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Alertes deadline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.filter(s => s.urgencyLevel === 'critical' || s.urgencyLevel === 'high').map((s) => (
                <div key={s.taskId} className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium">{s.task.title}</p>
                    <p className="text-[10px] text-muted-foreground">{getDeadlineText(s.task.deadline)} · {s.task.assignee.name}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Charge équipe
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {WORKLOAD_DATA.map((member) => (
                <div key={member.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{member.name.split(' ')[0]}</span>
                    <span className={`text-xs font-bold ${
                      member.workload >= 90 ? 'text-red-600' :
                      member.workload >= 70 ? 'text-amber-600' : 'text-emerald-600'
                    }`}>{member.workload}%</span>
                  </div>
                  <Progress value={member.workload} className={`h-1.5 ${
                    member.workload >= 90 ? '[&>div]:bg-red-500' :
                    member.workload >= 70 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'
                  }`} />
                  <p className="text-[10px] text-muted-foreground mt-0.5">{member.tasks} tâches actives</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-indigo-50 dark:from-primary/10 dark:to-indigo-950/30 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Score d'équipe</span>
              </div>
              <p className="text-4xl font-bold text-primary mb-1">78<span className="text-lg text-muted-foreground">/100</span></p>
              <p className="text-xs text-muted-foreground">Productivité hebdomadaire</p>
              <div className="flex items-center gap-1 mt-2 text-emerald-600">
                <TrendingUp className="w-3 h-3" />
                <span className="text-xs font-medium">+5 pts vs semaine passée</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
