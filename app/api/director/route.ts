import { prepareSabotageGame } from "../../sabotage-director";
import type { Locale, SabotageGameRequest, ThemeId } from "../../game-types";

export const runtime = "edge";

function cleanRequest(value: unknown): SabotageGameRequest | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  if (!(["heist", "office", "wedding", "space"] as const).includes(input.theme as ThemeId)) return null;
  if (!Array.isArray(input.players) || input.players.length < 3 || input.players.length > 6) return null;

  const players = input.players
    .filter((name): name is string => typeof name === "string")
    .map((name) => name.trim().slice(0, 24));
  if (players.length !== input.players.length || players.some((name) => !name)) return null;
  if (new Set(players.map((name) => name.toLocaleLowerCase())).size !== players.length) return null;

  return {
    theme: input.theme as ThemeId,
    players,
    locale: (["zh", "en"] as const).includes(input.locale as Locale) ? input.locale as Locale : "en",
    sessionSeed: typeof input.sessionSeed === "string" && input.sessionSeed
      ? input.sessionSeed.slice(0, 64)
      : "judge-demo",
  };
}

export async function POST(request: Request) {
  let input: SabotageGameRequest | null = null;
  try {
    input = cleanRequest(await request.json());
  } catch {
    // Invalid JSON is handled below.
  }

  if (!input) {
    return Response.json({ error: "Use 3–6 player names and a valid story world." }, { status: 400 });
  }

  return Response.json(prepareSabotageGame(input), {
    headers: {
      "Cache-Control": "no-store",
      "X-CueChaos-Mode": "offline-saboteur",
    },
  });
}
