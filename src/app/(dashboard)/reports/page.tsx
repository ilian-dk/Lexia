'use client'

import { useState } from 'react'
import { BarChart2, Download, Calendar, Users, TrendingUp, Clock, CheckSquare, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const WEEKLY_DATA = [
  { week: 'S1', heures: 32, taches: 8, score: 76 },
  { week: 'S2', heures: 38, taches: 11, score: 82 },
  { week: 'S3', heures: 25, taches: 6, score: 65 },
  { week: 'S4', heures: 40, taches: 14, score: 88 },
  { week: 'S5', heures: 35, taches: 10, score: 81 },
  { week: 'S6', heures: 28, taches: 9, score: 78 },
]

const TEAM_PERF = [
  { name: 'Marie L.', heures: 38, taches: 8, score: 91, onTime: 95 },
  { name: 'Thomas R.', heures: 32, taches: 12, score: 78, onTime: 83 },
  { name: 'Sophie M.', heures: 40, taches: 6, score: 95, onTime: 100 },
  { name: 'Alex B.', heures: 25, taches: 5, score: 62, onTime: 70 },
  { name: 'Camille D.', heures: 35, taches: 7, score: 84, onTime: 88 },
]

const PROJECT_DATA = [
  { name: 'Infra 2025', heures: 48, taches: 12, progress: 67, color: '#ef4444' },
  { name: 'Migration DB', heures: 32, taches: 8, progress: 45, color: '#f59e0b' },
  { name: 'API Publique', heures: 24, taches: 5, progress: 80, color: '#06b6d4' },
  { name: 'Reporting', heures: 18, taches: 4, progress: 90, color: '#8b5cf6' },
  { name: 'CRM Connect', heures: 15, taches: 6, progress: 30, color: '#3b82f6' },
]

const DAILY_HOURS = [
  { day: 'Lun', Marie: 8, Thomas: 6, Sophie: 8, Alex: 5, Camille: 7 },
  { day: 'Mar', Marie: 7, Thomas: 7, Sophie: 8, Alex: 4, Camille: 7 },
  { day: 'Mer', Marie: 8, Thomas: 6, Sophie: 8, Alex: 6, Camille: 7 },
  { day: 'Jeu', Marie: 8, Thomas: 7, Sophie: 8, Alex: 5, Camille: 7 },
  { day: 'Ven', Marie: 7, Thomas: 6, Sophie: 8, Alex: 5, Camille: 7 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function ReportsPage() {
  const [period, setPeriod] = useState('week')

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-primary" />
            Rapports & Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Vue d'ensemble de la performance équipe</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-md border border-input overflow-hidden">
            {[['week', 'Semaine'], ['month', 'Mois'], ['quarter', 'Trimestre']].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setPeriod(val)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  period === val ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total heures loguées', value: '198h', change: '+12%', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Tâches complétées', value: '54', change: '+8', icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Score moyen équipe', value: '82/100', change: '+4pts', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Taux ponctualité', value: '87%', change: '+3%', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-7 h-7 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
                </div>
                <span className="text-xs text-emerald-600 font-medium">{kpi.change}</span>
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Heures et tâches */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Heures loguées & Tâches complétées</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={WEEKLY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} unit="h" />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar yAxisId="left" dataKey="heures" fill="#3b82f6" radius={[3, 3, 0, 0]} name="Heures" />
                <Bar yAxisId="right" dataKey="taches" fill="#10b981" radius={[3, 3, 0, 0]} name="Tâches" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score de productivité */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Évolution du score de productivité</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={WEEKLY_DATA}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2} fill="url(#scoreGrad)" name="Score" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Heures par membre */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Heures quotidiennes par membre</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DAILY_HOURS} barSize={8}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} unit="h" />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                {TEAM_PERF.map((m, i) => (
                  <Bar key={m.name} dataKey={m.name.split(' ')[0]} fill={COLORS[i]} radius={[2, 2, 0, 0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Projects */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Temps par projet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {PROJECT_DATA.map((proj) => (
              <div key={proj.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: proj.color }} />
                    <span className="text-xs font-medium">{proj.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{proj.heures}h</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-1.5">
                    <div className="h-1.5 rounded-full" style={{ width: `${proj.progress}%`, background: proj.color }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-8 text-right">{proj.progress}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Team performance table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            Performance individuelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {['Membre', 'Heures/sem', 'Tâches', 'Score', 'Ponctualité'].map((h) => (
                  <th key={h} className="text-left py-2 text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TEAM_PERF.map((member, i) => (
                <tr key={member.name} className="hover:bg-muted/30">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="text-[10px]">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm">{member.heures}h</td>
                  <td className="py-3 text-sm">{member.taches}</td>
                  <td className="py-3">
                    <span className={`font-bold ${member.score >= 80 ? 'text-emerald-600' : member.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                      {member.score}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-1.5">
                        <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${member.onTime}%` }} />
                      </div>
                      <span className="text-xs">{member.onTime}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
