# CueChaos — Devpost Submission Draft

## Submission links

- Live demo: https://cue-chaos-party-56.rbookki.chatgpt.site/
- Demo video: https://youtu.be/wyZp7NEEIWE
- Source code: https://github.com/rbookki/cue-chaos

## Inspiration

AI party games often become either a solitary prompt box or a stream of unrelated “random” jokes. We wanted a social game where people debate plans, remember consequences, and catch a human bluff—without giving strangers a way to drain the creator’s API budget.

## What it does

CueChaos gives 3–6 players one connected mission with a deadline and real stakes. One player secretly becomes the Inside Saboteur. Across three causal phases, the group debates three plausible plans and votes anonymously. The selected plan changes case progress and risk, reveals a concrete clue, and becomes visible history in the next phase.

The Saboteur knows one tempting high-risk plan per phase and tries to make at least two win while protecting a case-specific motive. After three phases, everyone privately accuses a suspect. The investigation team wins only by identifying the Saboteur and preserving the mission.

## How we used GPT‑5.6 and Codex

GPT‑5.6 worked directly inside Codex as a controlled case writers’ room. It created and refined the four bilingual missions, roles, motives, decisions, consequences, clues, and cause-and-effect chains. We used Codex to audit every case with a simple standard: if the phases could be reordered without breaking the story, the story was not ready.

Codex was also the primary environment for gameplay design, implementation, responsive styling, tests, the zero-API security model, and submission preparation. The reviewed case packs are committed to the repository, so visitors cannot trigger billable inference.

## How it works

The app runs with Next.js and React on a Cloudflare-compatible worker. A local route validates 3–6 unique names, deterministically deals one Saboteur, rotates roles and plan order, and serves the committed case. Ballots, case state, accusation scoring, and the verdict all run locally.

There are no OpenAI credentials, runtime inference calls, accounts, or usage charges in the deployed game.

## Highlights

- Four complete English/Chinese cases with goals, deadlines, stakes, and case-specific motives.
- Three connected phases where consequences and evidence remain visible.
- Plausible plans with hidden risk rather than obviously silly “bad” choices.
- Anonymous ballots, discussion windows, final accusations, and a clear winner.
- Credential-free judge path and zero visitor-driven API spend.

## Built with

- Codex
- GPT‑5.6 used directly in the Codex case-room workflow
- TypeScript
- React / Next.js
- Vinext / Vite
- Cloudflare-compatible Workers runtime
- Node test runner and ESLint

## Category

Apps for Your Life

## Submission checklist

- [x] Public YouTube demo, 3 minutes or shorter
- [x] Show one complete consequence → clue → next-phase transition
- [x] Explain the GPT‑5.6-in-Codex causal case workflow
- [ ] Show `STORY_ROOM_PROMPT.md` and `app/sabotage-director.ts`
- [ ] Include the primary `/feedback` Codex Session ID
- [x] Public MIT-licensed source repository
