# CueChaos

**Your friends. One impossible scene. A movie that listens.**

CueChaos is a 3–6 player, pass-the-phone improv party game. GPT‑5.6 acts as a live director: it casts every player, assigns private objectives, reacts to the group’s choices, and rewrites a three-act comedy around the chaos in the room.

Built with Codex and GPT‑5.6 for OpenAI Build Week 2026. Category: **Apps for Your Life**.

## Why it is fun

Most AI storytelling experiences ask one person to sit at a prompt box. CueChaos puts the screen back in the middle of the room:

1. Pick a ridiculous story world and enter 3–6 names.
2. Pass the phone so each player can privately reveal a role and secret objective.
3. Perform a scene, choose one of the director’s moves, or improvise something worse.
4. GPT‑5.6 remembers the choice and weaponizes it as the next plot twist.
5. Finish with a custom ending and one affectionate award for every player.

The game currently includes three replayable worlds: a pastry heist, a corporate disaster, and a wedding mystery.

## Run the judge demo

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. No account or API key is required: when `OPENAI_API_KEY` is absent, the server uses a deterministic director with the same response contract so judges can complete the entire game.

## Enable the live GPT‑5.6 director

Copy `.env.example` to `.env.local` and set a server-side OpenAI API key:

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6
```

The key is read only by the server route and is never sent to the browser. The director uses the [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses) with a strict JSON schema. `gpt-5.6` is the alias for GPT‑5.6 Sol; the family supports structured outputs through the Responses API. See the [official model page](https://developers.openai.com/api/docs/models/gpt-5.6-sol).

If the API is unavailable, CueChaos fails safely to demo mode instead of interrupting the game. The interface always labels whether a beat came from **GPT‑5.6 Live** or the **Demo Director**.

## Architecture

```text
Browser game state
      │
      ├── lobby → private role reveal → three live acts → finale
      │
      └── POST /api/director
              ├── OPENAI_API_KEY present → GPT‑5.6 Responses API
              └── no key / provider unavailable → deterministic director
```

- `app/CueChaosGame.tsx` — complete pass-the-phone game state and interaction.
- `app/api/director/route.ts` — validation, GPT‑5.6 structured output, and safe fallback.
- `app/demo-director.ts` — deterministic offline story worlds for judging.
- `app/game-types.ts` — shared game and response contract.
- `tests/rendered-html.test.mjs` — server render, playable beat, and validation tests.

## How Codex contributed

Codex was used as the primary development environment for product framing, interaction design, implementation, API integration, responsive styling, test design, and submission preparation. The main build thread should be submitted through `/feedback` as required by the event.

Key Codex decisions:

- Narrowed the experience from a generic story generator to a social, pass-the-phone game loop.
- Designed one strict response contract that both GPT‑5.6 and the offline director satisfy.
- Kept private objectives device-local and the OpenAI key server-side.
- Built a complete judge path that never depends on credentials or external setup.
- Added visible provider labeling so fixture output is never presented as live model output.

## Safety and privacy

- Player names and moves are limited in length before reaching the model.
- The system prompt keeps scenes playful and PG‑13 and excludes targeting real people, protected traits, or private information.
- No player data is persisted by the application.
- OpenAI credentials remain server-side.
- The final choice is always made by the players; CueChaos generates fiction, not real-world instructions.

## Verification

```bash
npm test
npm run lint
```

## Open-source resources

The interface uses the open-source Geist and Geist Mono typefaces through `next/font`. The visual system otherwise uses original CSS typography, gradients, and geometric stage effects; no unlicensed stock imagery is bundled.

## License

MIT. See [LICENSE](LICENSE).
