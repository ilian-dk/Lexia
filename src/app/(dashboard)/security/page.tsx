'use client'

import { useState } from 'react'
import {
  Shield, Lock, FileText, Download, Trash2, Eye, CheckCircle2,
  AlertCircle, Server, Key, Activity, Globe, ChevronRight, ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const ACCESS_LOGS = [
  { id: '1', user: 'Marie Laurent', action: 'Connexion', resource: 'Tableau de bord', ip: '192.168.1.45', date: new Date(Date.now() - 10 * 60000), status: 'success' },
  { id: '2', user: 'Thomas Roux', action: 'Export données', resource: 'Rapports', ip: '10.0.0.12', date: new Date(Date.now() - 35 * 60000), status: 'success' },
  { id: '3', user: 'Inconnu', action: 'Tentative connexion', resource: 'Auth', ip: '89.123.45.67', date: new Date(Date.now() - 2 * 3600000), status: 'failed' },
  { id: '4', user: 'Sophie Martin', action: 'Modification profil', resource: 'Paramètres', ip: '192.168.1.78', date: new Date(Date.now() - 3 * 3600000), status: 'success' },
  { id: '5', user: 'Admin', action: 'Accès logs', resource: 'Sécurité', ip: '192.168.1.1', date: new Date(Date.now() - 5 * 3600000), status: 'success' },
]

const CERTIFICATIONS = [
  { name: 'RGPD / GDPR', status: 'active', desc: 'Conformité au Règlement Général sur la Protection des Données' },
  { name: 'ISO 27001', status: 'active', desc: 'Système de management de la sécurité de l\'information' },
  { name: 'SOC 2 Type II', status: 'active', desc: 'Contrôles de sécurité, disponibilité et confidentialité' },
  { name: 'HDS (Hébergeur de Données)', status: 'pending', desc: 'Certification hébergeur de données de santé (en cours)' },
]

const SECURITY_CHECKS = [
  { label: 'Chiffrement des données au repos', status: true, detail: 'AES-256' },
  { label: 'Chiffrement en transit', status: true, detail: 'TLS 1.3' },
  { label: 'Authentification à 2 facteurs (2FA)', status: true, detail: 'TOTP + SMS' },
  { label: 'Hébergement région Europe', status: true, detail: 'AWS eu-west-1 (Irlande)' },
  { label: 'Sauvegardes automatiques', status: true, detail: 'Toutes les 6h, rétention 30 jours' },
  { label: 'Contrôle d\'accès basé sur les rôles', status: true, detail: 'RBAC Admin/Manager/Employé' },
  { label: 'Logs d\'audit complets', status: true, detail: 'Rétention 2 ans' },
  { label: 'Tests de pénétration', status: true, detail: 'Annuel, dernier : Jan 2025' },
]

export default function SecurityPage() {
  const [dpaDownloaded, setDpaDownloaded] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleDpaDownload = () => {
    setDpaDownloaded(true)
    setTimeout(() => setDpaDownloaded(false), 3000)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-500" />
            Sécurité & Conformité RGPD
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Centre de sécurité · Hébergement AWS eu-west-1 (Irlande)
          </p>
        </div>
        <Badge className="text-emerald-700 bg-emerald-50 border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
          Conforme RGPD
        </Badge>
      </div>

      {/* Security score */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-900">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-1">Score de sécurité</p>
              <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-400">98<span className="text-xl text-emerald-500">/100</span></p>
              <p className="text-xs text-emerald-600 mt-1">Excellent · 8/8 contrôles actifs</p>
            </div>
            <div className="w-20 h-20 relative">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-200" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="97.9 2.1" className="text-emerald-500" />
              </svg>
              <Shield className="absolute inset-0 m-auto w-8 h-8 text-emerald-500" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Security checklist */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Contrôles de sécurité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {SECURITY_CHECKS.map((check) => (
              <div key={check.label} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{check.label}</p>
                  <p className="text-xs text-muted-foreground">{check.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Certifications + Hosting */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Certifications & Conformité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert.name} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cert.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{cert.name}</p>
                      <Badge variant={cert.status === 'active' ? 'default' : 'secondary'} className={`text-[10px] py-0 ${cert.status === 'active' ? 'bg-emerald-500' : 'bg-amber-100 text-amber-700'}`}>
                        {cert.status === 'active' ? 'Actif' : 'En cours'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{cert.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Server className="w-4 h-4" />
                Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Fournisseur cloud', value: 'Amazon Web Services (AWS)' },
                { label: 'Région', value: 'eu-west-1 (Dublin, Irlande)' },
                { label: 'Disponibilité SLA', value: '99.9% garanti' },
                { label: 'Sauvegarde', value: 'Multi-AZ, réplication temps réel' },
                { label: 'DRP (RTO)', value: '< 4 heures' },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm py-1.5 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RGPD Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Documents RGPD
            </CardTitle>
            <CardDescription>Téléchargez vos documents contractuels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Contrat DPA (Data Processing Agreement)', size: '156 KB', updated: 'Jan 2025' },
              { name: 'Politique de confidentialité', size: '89 KB', updated: 'Jan 2025' },
              { name: 'Registre des traitements', size: '234 KB', updated: 'Déc 2024' },
              { name: 'Rapport d\'audit sécurité 2024', size: '1.2 MB', updated: 'Oct 2024' },
            ].map((doc) => (
              <div key={doc.name} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.size} · Mis à jour {doc.updated}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 h-7"
                  onClick={handleDpaDownload}
                >
                  <Download className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right to be forgotten */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Key className="w-4 h-4" />
              Droits des personnes
            </CardTitle>
            <CardDescription>Gestion des droits RGPD utilisateurs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              {[
                { label: 'Droit d\'accès', desc: 'Export des données personnelles', icon: Eye, action: 'Exporter' },
                { label: 'Droit à la portabilité', desc: 'Export au format JSON/CSV', icon: Download, action: 'Télécharger' },
                { label: 'Droit à l\'oubli', desc: 'Suppression définitive des données', icon: Trash2, action: 'Supprimer', danger: true },
              ].map(({ label, desc, icon: Icon, action, danger }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${danger ? 'bg-red-50 dark:bg-red-950/30' : 'bg-muted'}`}>
                    <Icon className={`w-4 h-4 ${danger ? 'text-red-600' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <Button
                    variant={danger ? 'destructive' : 'outline'}
                    size="sm"
                    className="text-xs shrink-0"
                  >
                    {action}
                  </Button>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-800 dark:text-amber-300">
                  La suppression est irréversible. Toutes les données personnelles seront effacées dans un délai de 30 jours conformément au RGPD Art. 17.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Access logs */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Logs d'accès récents
              </CardTitle>
              <CardDescription>Suivi des accès aux données sensibles</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              Voir tout <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-xs font-medium text-muted-foreground">Utilisateur</th>
                <th className="text-left py-2 text-xs font-medium text-muted-foreground">Action</th>
                <th className="text-left py-2 text-xs font-medium text-muted-foreground">Ressource</th>
                <th className="text-left py-2 text-xs font-medium text-muted-foreground">IP</th>
                <th className="text-left py-2 text-xs font-medium text-muted-foreground">Heure</th>
                <th className="text-left py-2 text-xs font-medium text-muted-foreground">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ACCESS_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30">
                  <td className="py-2.5 text-sm font-medium">{log.user}</td>
                  <td className="py-2.5 text-sm text-muted-foreground">{log.action}</td>
                  <td className="py-2.5 text-sm text-muted-foreground">{log.resource}</td>
                  <td className="py-2.5 text-xs font-mono text-muted-foreground">{log.ip}</td>
                  <td className="py-2.5 text-xs text-muted-foreground">
                    {log.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-2.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      log.status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {log.status === 'success' ? 'Succès' : 'Échec'}
                    </span>
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
