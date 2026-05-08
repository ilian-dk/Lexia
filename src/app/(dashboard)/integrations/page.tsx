'use client'

import { useState } from 'react'
import {
  Plug, CheckCircle2, AlertCircle, ExternalLink, Plus, Copy, Eye, EyeOff,
  RefreshCw, Webhook, Code2, Globe, Trash2, ToggleLeft, ToggleRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const INTEGRATIONS = [
  {
    id: 'teams',
    name: 'Microsoft Teams',
    logo: '🔷',
    description: 'Recevez des notifications de tâches et alertes de deadline directement dans vos canaux Teams.',
    status: 'connected',
    features: ['Notifications de tâches', 'Alertes deadline', 'Rapports hebdomadaires', 'Commandes slash'],
    category: 'Communication',
  },
  {
    id: 'google',
    name: 'Google Workspace',
    logo: '🔵',
    description: 'Synchronisez vos tâches et deadlines avec Google Calendar et Google Meet.',
    status: 'disconnected',
    features: ['Sync Google Calendar', 'Création d\'événements', 'Intégration Meet', 'Google Drive'],
    category: 'Productivité',
  },
  {
    id: 'slack',
    name: 'Slack',
    logo: '💬',
    description: 'Intégration native Slack pour les notifications et la gestion de tâches.',
    status: 'disconnected',
    features: ['Notifications', 'Commandes slash', 'Rapports auto', 'Alertes smart'],
    category: 'Communication',
  },
  {
    id: 'jira',
    name: 'Jira',
    logo: '🔷',
    description: 'Synchronisez vos projets Jira avec Lexia pour une vue unifiée.',
    status: 'disconnected',
    features: ['Sync tickets', 'Mise à jour bidirectionnelle', 'Import sprint', 'Epics mapping'],
    category: 'Gestion de projet',
  },
  {
    id: 'sap',
    name: 'SAP',
    logo: '🟠',
    description: 'Connexion avec SAP HR et SAP PM pour synchroniser les ressources et projets.',
    status: 'disconnected',
    features: ['Sync RH', 'Projets SAP PM', 'Coûts temps', 'Reporting'],
    category: 'ERP',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    logo: '☁️',
    description: 'Liez vos opportunités et comptes Salesforce aux tâches et projets Lexia.',
    status: 'disconnected',
    features: ['Sync opportunités', 'Tâches CRM', 'Rapports ROI', 'Workflows'],
    category: 'CRM',
  },
]

const WEBHOOKS = [
  { id: '1', name: 'Alerte ERP production', url: 'https://erp.entreprise.fr/webhooks/lexia', events: ['task.completed', 'deadline.alert'], active: true },
  { id: '2', name: 'Sync SIRH RH', url: 'https://sirh.entreprise.fr/api/hook', events: ['user.created', 'time.logged'], active: true },
  { id: '3', name: 'Dashboard BI interne', url: 'https://bi.entreprise.fr/ingest/lexia', events: ['report.generated'], active: false },
]

const WEBHOOK_EVENTS = [
  'task.created', 'task.updated', 'task.completed', 'task.deleted',
  'time.started', 'time.stopped', 'time.logged',
  'deadline.alert', 'deadline.missed',
  'user.created', 'user.invited', 'user.removed',
  'report.generated', 'team.updated',
]

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/v1/tasks', desc: 'Lister toutes les tâches' },
  { method: 'POST', path: '/api/v1/tasks', desc: 'Créer une tâche' },
  { method: 'PATCH', path: '/api/v1/tasks/:id', desc: 'Modifier une tâche' },
  { method: 'GET', path: '/api/v1/time-sessions', desc: 'Sessions de temps' },
  { method: 'POST', path: '/api/v1/time-sessions', desc: 'Démarrer un timer' },
  { method: 'GET', path: '/api/v1/reports', desc: 'Rapports et analytics' },
  { method: 'GET', path: '/api/v1/users', desc: 'Utilisateurs de l\'organisation' },
  { method: 'GET', path: '/api/v1/teams', desc: 'Équipes et membres' },
]

const METHOD_COLORS: Record<string, string> = {
  GET: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  POST: 'text-blue-700 bg-blue-50 border-blue-200',
  PATCH: 'text-amber-700 bg-amber-50 border-amber-200',
  DELETE: 'text-red-700 bg-red-50 border-red-200',
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState(INTEGRATIONS)
  const [webhooks, setWebhooks] = useState(WEBHOOKS)
  const [showApiKey, setShowApiKey] = useState(false)
  const apiKey = 'lx_live_k9m2p4n8x1v7q3w6r0y5j2e8'

  const toggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(i =>
      i.id === id ? { ...i, status: i.status === 'connected' ? 'disconnected' : 'connected' } : i
    ))
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Plug className="w-5 h-5 text-primary" />
          Intégrations
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Connectez Lexia à vos outils enterprise : Teams, Google, SAP, Salesforce et plus
        </p>
      </div>

      <Tabs defaultValue="integrations">
        <TabsList>
          <TabsTrigger value="integrations">Intégrations</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="api">API REST</TabsTrigger>
        </TabsList>

        {/* Integrations tab */}
        <TabsContent value="integrations" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className={integration.status === 'connected' ? 'border-emerald-200 dark:border-emerald-900' : ''}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{integration.logo}</span>
                      <div>
                        <p className="font-semibold text-sm">{integration.name}</p>
                        <Badge variant="secondary" className="text-[10px] py-0 mt-0.5">{integration.category}</Badge>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-medium ${
                      integration.status === 'connected' ? 'text-emerald-600' : 'text-slate-400'
                    }`}>
                      {integration.status === 'connected'
                        ? <CheckCircle2 className="w-3.5 h-3.5" />
                        : <AlertCircle className="w-3.5 h-3.5" />
                      }
                      {integration.status === 'connected' ? 'Connecté' : 'Déconnecté'}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{integration.description}</p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {integration.features.map((f) => (
                      <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{f}</span>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    variant={integration.status === 'connected' ? 'outline' : 'default'}
                    size="sm"
                    onClick={() => toggleIntegration(integration.id)}
                  >
                    {integration.status === 'connected' ? 'Configurer' : 'Connecter'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Webhooks tab */}
        <TabsContent value="webhooks" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Configurez des webhooks pour envoyer des événements vers vos systèmes internes (SAP, ERP, BI...)</p>
            <Button size="sm" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Nouveau webhook
            </Button>
          </div>

          <div className="space-y-3">
            {webhooks.map((wh) => (
              <Card key={wh.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${wh.active ? 'bg-emerald-50' : 'bg-muted'}`}>
                      <Webhook className={`w-4 h-4 ${wh.active ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{wh.name}</p>
                        <Badge variant={wh.active ? 'default' : 'secondary'} className={`text-[10px] py-0 ${wh.active ? 'bg-emerald-500' : ''}`}>
                          {wh.active ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mb-2">{wh.url}</p>
                      <div className="flex flex-wrap gap-1">
                        {wh.events.map((ev) => (
                          <span key={ev} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">{ev}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="w-7 h-7">
                        <RefreshCw className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Événements disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {WEBHOOK_EVENTS.map((ev) => (
                  <code key={ev} className="text-[10px] px-2 py-1 rounded bg-muted font-mono">{ev}</code>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API tab */}
        <TabsContent value="api" className="mt-4 space-y-4">
          {/* API Key */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Clé API
              </CardTitle>
              <CardDescription>Utilisez cette clé pour authentifier vos requêtes API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    readOnly
                    value={showApiKey ? apiKey : '•'.repeat(apiKey.length)}
                    className="font-mono text-xs pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-1 hover:text-foreground text-muted-foreground"
                    >
                      {showApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(apiKey)}
                      className="p-1 hover:text-foreground text-muted-foreground"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <Button variant="outline" size="sm">Régénérer</Button>
              </div>

              <div className="mt-3 p-3 rounded-lg bg-muted/50">
                <p className="text-xs font-mono text-muted-foreground">
                  <span className="text-blue-600">Authorization:</span> Bearer {showApiKey ? apiKey : '•'.repeat(20)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Endpoints */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm">Endpoints REST</CardTitle>
                  <CardDescription>Base URL : https://api.lexia.io/v1</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Documentation complète
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {API_ENDPOINTS.map((ep) => (
                  <div key={ep.path} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${METHOD_COLORS[ep.method]}`}>
                      {ep.method}
                    </span>
                    <code className="text-xs font-mono text-muted-foreground flex-1">{ep.path}</code>
                    <span className="text-xs text-muted-foreground">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* SDK example */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Exemple d'intégration</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-slate-900 text-slate-100 rounded-lg p-4 overflow-x-auto scrollbar-thin">
{`// Installation
npm install @lexia/sdk

// Initialisation
import { LexiaClient } from '@lexia/sdk'
const lexia = new LexiaClient({ apiKey: 'lx_live_...' })

// Créer une tâche
const task = await lexia.tasks.create({
  title: 'Revue de code',
  priority: 'HIGH',
  deadline: '2025-06-15',
  assigneeEmail: 'dev@entreprise.fr'
})

// Loguer du temps
await lexia.time.log({
  taskId: task.id,
  duration: 3600, // 1 heure en secondes
  description: 'Implémentation du module auth'
})

// Récupérer les rapports
const report = await lexia.reports.get({
  type: 'weekly',
  teamId: 'team_xyz'
})`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
