import { storyPackDirector } from "../../story-pack-director";
import type { DirectorRequest, Locale, ThemeId } from "../../game-types";

export const runtime = "edge";

function cleanRequest(value: unknown): DirectorRequest | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (!(["start", "twist", "finale"] as const).includes(input.action as DirectorRequest["action"])) return null;
  if (!(["heist", "office", "wedding", "space"] as const).includes(input.theme as ThemeId)) return null;
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
    locale: (["zh", "en"] as const).includes(input.locale as Locale) ? input.locale as Locale : "zh",
    sessionSeed: typeof input.sessionSeed === "string" && input.sessionSeed
      ? input.sessionSeed.slice(0, 64)
      : "judge-demo",
  };
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

  return Response.json(storyPackDirector(input), {
    headers: {
      "Cache-Control": "no-store",
      "X-CueChaos-Mode": "story-pack",
    },
  });
}
