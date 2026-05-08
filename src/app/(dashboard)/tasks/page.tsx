"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { KanbanView } from "@/components/tasks/kanban-view"
import { ListView } from "@/components/tasks/list-view"
import { CalendarView } from "@/components/tasks/calendar-view"
import { KanbanSquare, List, CalendarDays, Plus, Sparkles, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { TaskWithRelations } from "@/types"

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"
type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE"

export default function TasksPage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<TaskWithRelations[]>([])
  const [projects, setProjects] = useState<{ id: string; name: string; color: string }[]>([])
  const [selectedTask, setSelectedTask] = useState<TaskWithRelations | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as Priority,
    status: "TODO" as TaskStatus,
    dueDate: "",
    estimatedMin: "",
    projectId: "",
  })

  useEffect(() => {
    fetch("/api/tasks").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setTasks(d) })
    fetch("/api/projects").then((r) => r.json()).then((d) => { if (Array.isArray(d)) setProjects(d) })
  }, [])

  async function createTask(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newTask,
        estimatedMin: newTask.estimatedMin ? parseInt(newTask.estimatedMin) : undefined,
        projectId: newTask.projectId || undefined,
        dueDate: newTask.dueDate || undefined,
      }),
    })
    const task = await res.json()
    setTasks((prev) => [task, ...prev])
    setShowCreate(false)
    setNewTask({ title: "", description: "", priority: "MEDIUM", status: "TODO", dueDate: "", estimatedMin: "", projectId: "" })
    toast({ title: "Tâche créée" })
  }

  async function deleteTask(taskId: string) {
    await fetch(`/api/tasks/${taskId}`, { method: "DELETE" })
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    toast({ title: "Tâche supprimée" })
  }

  async function runAI() {
    const pendingTasks = tasks.filter((t) => t.status !== "DONE")
    if (pendingTasks.length === 0) {
      toast({ title: "Aucune tâche à analyser" })
      return
    }
    setAiLoading(true)
    try {
      const res = await fetch("/api/ai/priorities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks: pendingTasks }),
      })
      const data = await res.json()
      if (data.suggestions) {
        setTasks((prev) =>
          prev.map((t) => {
            const s = data.suggestions.find((s: any) => s.taskId === t.id)
            return s ? { ...t, aiScore: s.score, aiReason: s.reason, priority: s.suggestedPriority } : t
          })
        )
        toast({ title: `IA analysée (${data.source})`, description: `${data.suggestions.length} tâches priorisées` })
      }
    } catch {
      toast({ title: "Erreur IA", variant: "destructive" })
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold">Tâches</h1>
          <p className="text-muted-foreground text-sm">{tasks.length} tâche{tasks.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={runAI} disabled={aiLoading} className="gap-2">
            {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-indigo-500" />}
            IA Priorités
          </Button>
          <Button onClick={() => setShowCreate(true)} className="gap-2 bg-indigo-500 hover:bg-indigo-600">
            <Plus className="h-4 w-4" />
            Nouvelle tâche
          </Button>
        </div>
      </div>

      <Tabs defaultValue="kanban" className="flex-1 flex flex-col min-h-0">
        <TabsList className="flex-shrink-0">
          <TabsTrigger value="kanban" className="gap-2">
            <KanbanSquare className="h-4 w-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            Liste
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            Calendrier
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban" className="flex-1 mt-4 overflow-hidden">
          <KanbanView tasks={tasks} onTaskUpdate={setTasks} onTaskClick={setSelectedTask} />
        </TabsContent>

        <TabsContent value="list" className="flex-1 mt-4 overflow-auto">
          <ListView tasks={tasks} onTaskUpdate={setTasks} onTaskClick={setSelectedTask} onTaskDelete={deleteTask} />
        </TabsContent>

        <TabsContent value="calendar" className="flex-1 mt-4 overflow-auto">
          <CalendarView tasks={tasks} onTaskClick={setSelectedTask} />
        </TabsContent>
      </Tabs>

      {/* Create task dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvelle tâche</DialogTitle>
          </DialogHeader>
          <form onSubmit={createTask} className="space-y-4">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                placeholder="Titre de la tâche"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Description optionnelle"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priorité</Label>
                <Select value={newTask.priority} onValueChange={(v) => setNewTask({ ...newTask, priority: v as Priority })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Basse</SelectItem>
                    <SelectItem value="MEDIUM">Moyenne</SelectItem>
                    <SelectItem value="HIGH">Haute</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Statut</Label>
                <Select value={newTask.status} onValueChange={(v) => setNewTask({ ...newTask, status: v as TaskStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TODO">À faire</SelectItem>
                    <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                    <SelectItem value="REVIEW">En revue</SelectItem>
                    <SelectItem value="DONE">Terminé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Échéance</Label>
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Durée estimée (min)</Label>
                <Input
                  type="number"
                  placeholder="60"
                  value={newTask.estimatedMin}
                  onChange={(e) => setNewTask({ ...newTask, estimatedMin: e.target.value })}
                  min={1}
                />
              </div>
            </div>
            {projects.length > 0 && (
              <div className="space-y-2">
                <Label>Projet</Label>
                <Select value={newTask.projectId} onValueChange={(v) => setNewTask({ ...newTask, projectId: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Annuler</Button>
              <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600">Créer</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Task detail dialog */}
      <Dialog open={!!selectedTask} onOpenChange={(o) => !o && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedTask?.title}</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              {selectedTask.description && (
                <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
              )}
              {selectedTask.aiReason && (
                <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium text-indigo-700">Recommandation IA</span>
                    {selectedTask.aiScore !== null && (
                      <span className="ml-auto text-sm font-bold text-indigo-600">{selectedTask.aiScore}/100</span>
                    )}
                  </div>
                  <p className="text-sm text-indigo-600">{selectedTask.aiReason}</p>
                </div>
              )}
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setSelectedTask(null)}>Fermer</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
