import { demoDirector } from "../../demo-director";
import type { DirectorBeat, DirectorRequest, ThemeId } from "../../game-types";

export const runtime = "edge";

const beatSchema = {
  type: "object",
  additionalProperties: false,
  required: ["headline", "directorLine", "twist", "mission", "choices", "heat", "roles", "finale", "awards"],
  properties: {
    headline: { type: "string", maxLength: 70 },
    directorLine: { type: "string", maxLength: 360 },
    twist: { type: "string", maxLength: 180 },
    mission: { type: "string", maxLength: 180 },
    choices: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: { type: "string", maxLength: 70 },
    },
    heat: { type: "integer", minimum: 0, maximum: 100 },
    roles: {
      type: "array",
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["player", "publicRole", "secretObjective"],
        properties: {
          player: { type: "string", maxLength: 24 },
          publicRole: { type: "string", maxLength: 48 },
          secretObjective: { type: "string", maxLength: 140 },
        },
      },
    },
    finale: { type: "string", maxLength: 360 },
    awards: {
      type: "array",
      maxItems: 6,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["player", "title", "reason"],
        properties: {
          player: { type: "string", maxLength: 24 },
          title: { type: "string", maxLength: 60 },
          reason: { type: "string", maxLength: 160 },
        },
      },
    },
  },
} as const;

function cleanRequest(value: unknown): DirectorRequest | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (!(["start", "twist", "finale"] as const).includes(input.action as DirectorRequest["action"])) return null;
  if (!(["heist", "office", "wedding"] as const).includes(input.theme as ThemeId)) return null;
  if (!Array.isArray(input.players) || input.players.length < 3 || input.players.length > 6) return null;

  const players = input.players
    .filter((name): name is string => typeof name === "string")
    .map((name) => name.trim().slice(0, 24));
  if (players.length !== input.players.length || players.some((name) => !name)) return null;

  return {
    action: input.action as DirectorRequest["action"],
    theme: input.theme as ThemeId,
    players,
    act: Math.max(0, Math.min(2, Number(input.act) || 0)),
    playerMove: typeof input.playerMove === "string" ? input.playerMove.trim().slice(0, 120) : undefined,
    history: Array.isArray(input.history)
      ? input.history.filter((item): item is string => typeof item === "string").slice(-6).map((item) => item.slice(0, 120))
      : [],
  };
}

function outputText(payload: Record<string, unknown>): string | null {
  if (typeof payload.output_text === "string") return payload.output_text;
  if (!Array.isArray(payload.output)) return null;
  for (const item of payload.output) {
    if (!item || typeof item !== "object") continue;
    const content = (item as { content?: unknown }).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (part && typeof part === "object" && typeof (part as { text?: unknown }).text === "string") {
        return (part as { text: string }).text;
      }
    }
  }
  return null;
}

async function callDirector(request: DirectorRequest, apiKey: string): Promise<DirectorBeat> {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.6",
      reasoning: { effort: "medium" },
      instructions: [
        "You are the live director of CueChaos, a fast pass-the-phone improv party game.",
        "Write playful, surprising, PG-13 scenes that react specifically to player choices.",
        "Every beat must be playable aloud in under two minutes. Never target protected traits, real people, or private information.",
        "For start: create exactly one role for every named player. For twist: roles and awards must be empty arrays.",
        "For finale: write a satisfying comic ending and exactly one affectionate award for every player; roles must be empty.",
        "Choices must be short, distinct actions. Preserve continuity with the history. Do not mention being an AI.",
      ].join(" "),
      input: JSON.stringify(request),
      text: {
        format: {
          type: "json_schema",
          name: "cue_chaos_director_beat",
          strict: true,
          schema: beatSchema,
        },
      },
    }),
  });

  if (!response.ok) throw new Error(`OpenAI request failed with ${response.status}`);
  const payload = await response.json() as Record<string, unknown>;
  const text = outputText(payload);
  if (!text) throw new Error("OpenAI response contained no director beat");
  const beat = JSON.parse(text) as DirectorBeat;
  return { ...beat, choices: beat.choices.slice(0, 3) as DirectorBeat["choices"], source: "gpt-5.6" };
}

export async function POST(request: Request) {
  let input: DirectorRequest | null = null;
  try {
    input = cleanRequest(await request.json());
  } catch {
    // Invalid JSON is handled by the validation response below.
  }

  if (!input) {
    return Response.json({ error: "Use 3–6 player names and a valid game action." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      return Response.json(await callDirector(input, apiKey), {
        headers: { "Cache-Control": "no-store" },
      });
    } catch (error) {
      console.error("GPT-5.6 director unavailable; using the deterministic demo director.", error);
    }
  }

  return Response.json(demoDirector(input), {
    headers: { "Cache-Control": "no-store", "X-CueChaos-Mode": "demo" },
  });
}
