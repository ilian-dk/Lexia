import Anthropic from "@anthropic-ai/sdk"

let _client: Anthropic | null = null

export function getAnthropicClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "build-placeholder") {
    return null
  }
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return _client
}
