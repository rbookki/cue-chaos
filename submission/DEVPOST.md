# CueChaos — Devpost Submission Draft

## Inspiration

AI entertainment often becomes a solitary prompt box. We wanted a game that makes friends study one another instead—and that strangers cannot use to drain the creator’s API budget. CueChaos turns one phone and a set of committed comedy packs into a social deduction match with a real winner.

## What it does

CueChaos gives 3–6 players public cover roles, then secretly makes one of them the Plot Saboteur. The group faces three absurd story crises and votes anonymously on what happens next. The Saboteur knows one target outcome per round and tries to steer the majority toward at least two targets without being caught. After every reveal, the table gets 30 seconds to debate the evidence. A final secret accusation decides whether the Cast saved the story or the Saboteur stole the final cut.

The game is bilingual, defaults to English, takes 8–12 minutes, and requires no acting.

## How we used GPT‑5.6 and Codex

GPT‑5.6 worked directly inside Codex as CueChaos’s controlled writers’ room. It created and refined the four playable worlds, bilingual cover roles, three-round crises, decisions, consequences, and calibrated chaos values. The reviewed result is committed as typed packs, and `submission/STORY_ROOM_PROMPT.md` makes that workflow reproducible.

Codex was the primary environment for product ideation, interaction design, implementation, responsive styling, tests, the security model, and submission preparation. A central Codex decision was replacing a publicly callable model endpoint with build-time authored packs. Judges receive a complete experience, while visitors have no path to consume our API budget.

## How it works

The app is built with Next.js and React for a Cloudflare-compatible worker. A local route validates 3–6 unique player names, selects exactly one Saboteur from a session seed, rotates cover roles and options, and marks each round’s highest-chaos consequence as the private target. All ballots, accusations, scoring, and verdict logic run locally in the browser.

There are no OpenAI credentials, runtime inference calls, accounts, or usage charges in the deployed game.

## Built with

- Codex
- GPT‑5.6 used directly in the Codex writers’ room
- TypeScript
- React / Next.js
- Vinext / Vite
- Cloudflare-compatible Workers runtime
- Node test runner and ESLint

## Highlights

- One hidden Plot Saboteur and three private target outcomes.
- Anonymous pass-the-phone ballots and final accusations for 3–6 players.
- Four complete bilingual comedy cases with deterministic replayability.
- Clear two-part win condition, 30-second discussions, vote evidence, and a final damage ledger.
- English default with one-tap Simplified Chinese switching.
- Credential-free judge path with zero runtime AI calls and zero visitor-driven API spend.

## Category

Apps for Your Life

## Submission checklist

- [ ] Public YouTube demo, 3 minutes or shorter, with voiceover
- [ ] Explain the direct GPT‑5.6-in-Codex writers’ room workflow
- [ ] Show `STORY_ROOM_PROMPT.md` and `app/sabotage-director.ts`
- [ ] Show the **Zero-API Social Deduction** label during gameplay
- [ ] Include the primary `/feedback` Codex Session ID
- [ ] Share the repository with the required judging accounts if private
