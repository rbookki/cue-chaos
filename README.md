# CueChaos: Plot Saboteur

**Trust the cast. Suspect everyone.**

CueChaos is a bilingual, pass-the-phone social deduction game for 3–6 friends. One player is secretly the Plot Saboteur. Across three absurd story crises, everyone votes anonymously, debates the result, and finally accuses the person they think has been steering the story toward disaster.

Built with Codex and GPT‑5.6 for OpenAI Build Week 2026. Category: **Apps for Your Life**.

## The game in one minute

1. Choose English or Chinese, pick one of four comedy cases, and enter 3–6 unique names.
2. Pass the phone so each player can privately reveal a cover role. One player also sees **Plot Saboteur** and three target outcomes.
3. Read a crisis together, then pass the phone for a secret vote. The Saboteur tries to make the marked target win without looking suspicious.
4. Reveal the anonymous vote split and discuss who pushed the group toward disaster. Repeat for three rounds.
5. Pass the phone one last time for secret accusations, then reveal the Saboteur and the winner.

The Cast wins only if it uniquely identifies the Saboteur **and** fewer than two sabotage targets succeeded. Otherwise, the Saboteur wins. No acting experience is required; a full case takes about 8–12 minutes.

## Zero runtime API spend

GPT‑5.6 is used directly inside the Codex build workflow as the project’s writers’ room. It creates and refines the bilingual roles, crises, decisions, consequences, chaos values, and sabotage targets. The reviewed packs are committed in `app/sabotage-director.ts`.

The shipped website never calls the OpenAI API. Every visitor gets the complete game without an API key, model latency, or a way to consume the creator’s model budget. The same player list, case, and seed always produces the same private deal and option order.

The reproducible content brief lives in `submission/STORY_ROOM_PROMPT.md`. The primary Codex task and commit history document the implementation workflow.

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. No account, environment variable, or API key is required.

## Architecture

```text
GPT‑5.6 in Codex (controlled build-time writers’ room)
                         │
                         ▼
            committed bilingual chaos packs
                         │
                         ▼
secret role deal → 3 anonymous ballots → final accusation
                         │
                         └── deterministic local game engine
```

- `app/CueChaosGame.tsx` — lobby, pass-the-phone privacy screens, ballots, discussion, and verdict.
- `app/api/director/route.ts` — input validation and local pack delivery; no external model call.
- `app/sabotage-director.ts` — four committed cases and deterministic secret-role setup.
- `app/game-types.ts` — the shared game contract.
- `submission/STORY_ROOM_PROMPT.md` — reproducible GPT‑5.6-in-Codex content workflow.
- `tests/rendered-html.test.mjs` — rendering, pack integrity, determinism, validation, and zero-API tests.

## Delivery-ready features

- English by default with a one-tap Simplified Chinese switch.
- Four complete worlds: pastry heist, corporate disaster, wedding mystery, and lunar motel.
- Exactly one hidden Saboteur, three private targets, anonymous ballots, 30-second discussions, and final accusations.
- A clear, two-condition win rule and a verdict ledger showing votes, damage, and target successes.
- Duplicate-name protection, 3–6 player validation, private pass screens, keyboard focus states, large touch targets, and reduced-motion support.
- Fully deterministic, credential-free gameplay with no persisted player data.

## How Codex and GPT‑5.6 contributed

Codex was the primary environment for product framing, interaction design, implementation, responsive styling, testing, security decisions, and submission preparation. GPT‑5.6’s meaningful product role is the controlled writers’ room: it produced the actual bilingual decisions and consequences players encounter, not a decorative chatbot.

The most important design decision was moving model use to creation time. Visitors still receive authored variety and replayable comedy, but the public runtime has no billable inference endpoint. The required `/feedback` Session ID from the primary build task should be included in the Devpost submission.

## Safety and privacy

- No API key, hosted model credential, or externally billable inference path.
- Names are validated, trimmed, length-limited, and kept in memory only.
- No accounts, analytics, database, or player-data persistence.
- Fictional, playful, PG‑13 story material with no harmful real-world instructions.

## Verification

```bash
npm test
npm run lint
```

## Open-source resources

The interface uses the open-source Geist and Geist Mono typefaces through `next/font`. The remaining visual system uses original CSS typography, gradients, and geometric effects; no unlicensed stock imagery is bundled.

## License

MIT. See [LICENSE](LICENSE).
