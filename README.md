# CueChaos

**Your friends. One impossible scene. A movie that listens—without a runtime AI bill.**

CueChaos is a 3–6 player, pass-the-phone improv party game. It casts every player, assigns private objectives, unfolds a three-act comedy, folds the group’s choices back into later scenes, and finishes with affectionate cast awards.

Built with Codex and GPT‑5.6 for OpenAI Build Week 2026. Category: **Apps for Your Life**.

## The zero-API idea

GPT‑5.6 is used directly inside the Codex build workflow as the project’s story room. It creates and refines the world concepts, roles, secret objectives, three-act beats, callbacks, choices, and finale material. Those reviewed story packs are committed with the game in `app/story-pack-director.ts`.

The shipped website never calls the OpenAI API. Playing is deterministic, private, and free of model charges:

1. Pick one of three absurd story worlds and enter 3–6 names.
2. Pass the phone so every player can privately reveal a role and secret objective.
3. Perform each scene, choose a move, or improvise something worse.
4. The local story engine turns the last move into a callback and advances the pack.
5. Finish with a movie ending and one award for every player.

The reusable story-room brief is documented in `submission/STORY_ROOM_PROMPT.md`. The primary Codex task and commit history provide evidence of the direct GPT‑5.6/Codex workflow.

## Run the judge demo

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. No account, environment variables, or API key are required. Judges can complete the full game offline after the application has been installed.

## Architecture

```text
GPT‑5.6 in Codex (build-time story room)
              │
              ▼
committed, reviewed story packs
              │
              ▼
lobby → private role reveal → three acts → finale
              │
              └── local request validation and callback remixing
```

- `app/CueChaosGame.tsx` — pass-the-phone game state and interaction.
- `app/api/director/route.ts` — local validation; contains no external model call.
- `app/story-pack-director.ts` — committed story worlds and deterministic callback engine.
- `app/game-types.ts` — shared game contract.
- `submission/STORY_ROOM_PROMPT.md` — reproducible GPT‑5.6-in-Codex content workflow.
- `tests/rendered-html.test.mjs` — server render, playable pack, safety, and validation tests.

## How Codex and GPT‑5.6 contributed

Codex was the primary development environment for product framing, interaction design, implementation, responsive styling, testing, and submission preparation. GPT‑5.6’s meaningful product role is the story-room pass: it generates the actual playable roles, objectives, scenes, and comic escalation committed in the repository rather than being a decorative chatbot.

Key decisions made with Codex:

- Narrowed the experience from a generic story generator to a social, pass-the-phone game loop.
- Replaced a publicly callable runtime model endpoint with committed story packs, eliminating visitor-driven API spend.
- Preserved reactive fun locally by echoing player moves into later scenes and awards.
- Made the entire judge path credential-free and visibly labeled **Offline Story Pack**.
- Kept the content workflow reproducible with a checked-in story-room brief.

The required `/feedback` Session ID from the primary build task should be included in the Devpost submission.

## Safety and privacy

- There is no API key, hosted model credential, or externally billable inference path.
- Player names and moves are validated and length-limited.
- No player data is persisted or transmitted outside the application.
- Story material is reviewed, playful, and PG‑13.
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
