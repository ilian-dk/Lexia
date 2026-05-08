"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, CheckCircle, ArrowRight, Users, Timer, KanbanSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const steps = [
  {
    id: 1,
    title: "Bienvenue sur TimeTrack Pro !",
    desc: "Configurons votre espace de travail en 3 étapes rapides.",
    icon: Clock,
  },
  {
    id: 2,
    title: "Créez votre premier projet",
    desc: "Les projets vous permettent d'organiser vos tâches et de suivre le temps par contexte.",
    icon: KanbanSquare,
  },
  {
    id: 3,
    title: "Invitez votre équipe",
    desc: "Collaborez en temps réel avec vos collègues. Vous pouvez le faire plus tard.",
    icon: Users,
  },
  {
    id: 4,
    title: "Tout est prêt !",
    desc: "Votre espace de travail est configuré. Commencez à suivre votre temps.",
    icon: CheckCircle,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [projectName, setProjectName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")

  async function createProject() {
    if (!projectName) { setStep(3); return }
    await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: projectName }),
    })
    setStep(3)
  }

  async function finish() {
    router.push("/dashboard")
    toast({ title: "Bienvenue !", description: "Votre compte est prêt." })
  }

  const progress = ((step - 1) / (steps.length - 1)) * 100
  const currentStep = steps[step - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/60">
            <span>Étape {step} / {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="h-16 w-16 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto">
                <currentStep.icon className="h-8 w-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold">{currentStep.title}</h1>
              <p className="text-muted-foreground">{currentStep.desc}</p>
            </div>

            {step === 2 && (
              <div className="space-y-2">
                <Label>Nom du projet</Label>
                <Input
                  placeholder="Mon premier projet"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-2">
                <Label>Email du collègue (optionnel)</Label>
                <Input
                  type="email"
                  placeholder="collegue@entreprise.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
            )}

            {step === 4 && (
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: Timer, label: "Chronomètre", desc: "Démarrez en 1 clic" },
                  { icon: KanbanSquare, label: "Kanban", desc: "Gérez vos tâches" },
                  { icon: CheckCircle, label: "Analytics", desc: "Suivez vos progrès" },
                ].map((f) => (
                  <div key={f.label} className="p-3 rounded-lg bg-muted">
                    <f.icon className="h-6 w-6 text-indigo-500 mx-auto mb-1" />
                    <p className="text-xs font-medium">{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              {step > 1 && step < 4 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  Retour
                </Button>
              )}
              {step === 1 && (
                <Button onClick={() => setStep(2)} className="flex-1 bg-indigo-500 hover:bg-indigo-600 gap-2">
                  Commencer <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              {step === 2 && (
                <Button onClick={createProject} className="flex-1 bg-indigo-500 hover:bg-indigo-600 gap-2">
                  {projectName ? "Créer et continuer" : "Passer"} <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              {step === 3 && (
                <Button onClick={() => setStep(4)} className="flex-1 bg-indigo-500 hover:bg-indigo-600 gap-2">
                  Continuer <ArrowRight className="h-4 w-4" />
                </Button>
              )}
              {step === 4 && (
                <Button onClick={finish} className="flex-1 bg-indigo-500 hover:bg-indigo-600 gap-2">
                  Aller au tableau de bord <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
