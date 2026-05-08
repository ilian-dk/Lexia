import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getAnthropicClient } from "@/lib/anthropic"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { tasks } = await req.json()
  if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
    return NextResponse.json({ error: "Aucune tâche fournie" }, { status: 400 })
  }

  const client = getAnthropicClient()

  if (!client) {
    const suggestions = tasks.map((t: any) => {
      let score = 50
      if (t.priority === "URGENT") score += 30
      else if (t.priority === "HIGH") score += 20
      else if (t.priority === "LOW") score -= 10
      if (t.dueDate) {
        const daysLeft = Math.ceil((new Date(t.dueDate).getTime() - Date.now()) / 86400000)
        if (daysLeft <= 1) score += 25
        else if (daysLeft <= 3) score += 15
        else if (daysLeft <= 7) score += 5
      }
      return {
        taskId: t.id,
        score: Math.min(100, Math.max(0, score)),
        reason: "Priorité calculée selon l'échéance et le niveau d'urgence.",
        suggestedPriority: score >= 80 ? "URGENT" : score >= 65 ? "HIGH" : score >= 45 ? "MEDIUM" : "LOW",
      }
    })
    return NextResponse.json({ suggestions, source: "rule-based" })
  }

  const prompt = `Tu es un assistant de productivité expert. Analyse ces tâches et retourne un JSON avec des suggestions de priorité.

Tâches:
${JSON.stringify(
  tasks.map((t: any) => ({
    id: t.id,
    title: t.title,
    priority: t.priority,
    status: t.status,
    dueDate: t.dueDate,
    estimatedMin: t.estimatedMin,
  })),
  null,
  2
)}

Retourne UNIQUEMENT ce JSON (sans markdown):
{
  "suggestions": [
    {
      "taskId": "id",
      "score": 0-100,
      "reason": "Explication en français (1-2 phrases)",
      "suggestedPriority": "LOW|MEDIUM|HIGH|URGENT"
    }
  ]
}`

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    })

    const text = message.content[0].type === "text" ? message.content[0].text : ""
    const parsed = JSON.parse(text.trim())
    return NextResponse.json({ ...parsed, source: "claude-ai" })
  } catch {
    return NextResponse.json({ error: "Erreur IA" }, { status: 500 })
  }
}
