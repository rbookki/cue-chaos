# CueChaos: Inside Saboteur

**Trust the team. Suspect everyone. Follow the evidence.**

CueChaos is a bilingual, pass-the-phone social deduction game for 3–6 friends. Every session is one coherent case with a clear objective, concrete stakes, and three connected phases. One player is secretly the Inside Saboteur and tries to steer the group toward plausible shortcuts that compromise the evidence trail.

Built with Codex and GPT‑5.6 for OpenAI Build Week 2026. Category: **Apps for Your Life**.

## Live build

Play the public, credential-free version at [cue-chaos-party-56.rbookki.chatgpt.site](https://cue-chaos-party-56.rbookki.chatgpt.site/). The game requires no account, API key, or external model call.

Watch the [2:12 demo video on YouTube](https://youtu.be/wyZp7NEEIWE).

## How a case works

1. Choose English or Chinese, select one of four cases, and enter 3–6 unique names.
2. Pass the phone. Every player receives a public cover role; one player privately learns the Saboteur’s motive and three target plans.
3. Read the shared mission, stakes, current evidence, and three defensible plans. Discuss them, then pass the phone for a secret ballot.
4. Reveal the winning plan. Its consequence changes **case progress** and **case risk**, adds a concrete clue, and becomes part of the next phase’s visible history.
5. After three phases, use the complete evidence trail and social behavior to make one final secret accusation.

The investigation team wins only if it uniquely identifies the Saboteur and blocks at least two of the three marked high-risk plans. Otherwise, the Saboteur wins. No acting is required; a full case takes about 8–12 minutes.

## Four causal cases

- **The Last Croissant** — trace a stolen master recipe, infiltrate the hotel archive, and extract the recipe before its midnight auction.
- **Reply All** — trace a falsified forecast, preserve its audit trail, and stop the board vote before 5 PM.
- **Object Forever** — reconstruct a ring swap, follow the delivery trail, and recover the real wedding rings without contaminating evidence.
- **Moon Motel** — diagnose orbital decay, isolate an illegal mining rig, and stabilize the motel before a passenger shuttle arrives.

Each option has a rational pitch, an immediate consequence, an evidence clue, progress gained, and risk created. The humor stays in the setting and character roles; the plot itself follows a stable cause-and-effect chain.

## Zero runtime API spend

GPT‑5.6 is used directly inside the Codex build workflow as the project’s controlled writers’ room. It creates and refines the bilingual case structures, roles, motives, plans, consequences, and evidence trails. The reviewed packs are committed in `app/sabotage-director.ts`.

The shipped website never calls the OpenAI API. Every visitor gets the complete game without an API key, model latency, or a way to consume the creator’s model budget. The same player list, case, and seed always produces the same private deal and plan order.

The reproducible content brief lives in `submission/STORY_ROOM_PROMPT.md`.

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
             committed causal case packs
                         │
                         ▼
secret deal → plan → consequence → evidence → next phase
                         │
                         └── final accusation and local verdict
```

- `app/CueChaosGame.tsx` — pass-the-phone roles, causal case history, ballots, discussion, and verdict.
- `app/api/director/route.ts` — validates the cast and serves a local case; no external model call.
- `app/sabotage-director.ts` — four committed bilingual cases and deterministic secret setup.
- `app/game-types.ts` — shared case and gameplay contract.
- `submission/STORY_ROOM_PROMPT.md` — reproducible GPT‑5.6-in-Codex content workflow.
- `tests/rendered-html.test.mjs` — render, schema, determinism, causal-plan, validation, and zero-API tests.

## Safety and privacy

- No API key, hosted model credential, or externally billable inference path.
- Names are validated, trimmed, length-limited, and kept in memory only.
- No accounts, analytics, database, or player-data persistence.
- Fictional, PG‑13 cases with no harmful real-world instructions.

## Verification

```bash
npm test
npm run lint
```

## License

MIT. See [LICENSE](LICENSE).
