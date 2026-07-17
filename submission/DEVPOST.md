# CueChaos — Devpost Submission Draft

## Inspiration

AI entertainment often becomes a solitary prompt box. We wanted something that makes people look at each other instead of the screen—and that cannot be abused to run up the creator’s API bill. CueChaos turns one phone and a set of committed story packs into a ten-minute comedy for a room of friends.

## What it does

CueChaos casts 3–6 players into an absurd three-act story. Every player privately receives a character and secret objective. The group performs the scene, picks a suggested move or improvises its own, and the local story engine folds that decision into the next scene. The finale turns the run into a movie ending and gives every player an award.

## How we used GPT‑5.6 and Codex

GPT‑5.6 is used directly inside Codex as CueChaos’s build-time story room. It creates and refines the playable worlds, roles, secret objectives, three-act escalation, choices, callbacks, endings, and awards. The reviewed output is committed as typed story packs. The reusable brief is included in `submission/STORY_ROOM_PROMPT.md`, and the primary Codex task plus commit history documents the workflow.

Codex was also the primary environment for product ideation, interaction design, implementation, responsive styling, test design, security decisions, and submission preparation. One key Codex decision was replacing an anonymous runtime model endpoint with committed packs: judges get a complete experience, while visitors get no path to consume our API budget.

## How it works

The application is built with Next.js/React and runs on a Cloudflare-compatible worker. A local route validates player input and remixes the committed story pack with the group’s latest move. There are no OpenAI credentials, external inference calls, accounts, or usage charges in the deployed game.

## Built with

- Codex
- GPT‑5.6 used directly in the Codex story-room workflow
- TypeScript
- React / Next.js
- Vinext / Vite
- Cloudflare-compatible Workers runtime
- Node test runner and ESLint

## Highlights

- Pass-the-phone secret role reveals for 3–6 players.
- Three complete comedy worlds with escalating story beats.
- Free-form moves become local callbacks in later scenes.
- A complete credential-free judge path.
- Zero runtime AI calls and zero visitor-driven API spend.

## Category

Apps for Your Life

## Submission checklist

- [ ] Public YouTube demo, 3 minutes or shorter, with voiceover
- [ ] Explain the direct GPT‑5.6-in-Codex story-room workflow
- [ ] Show `STORY_ROOM_PROMPT.md` and a committed story pack
- [ ] Show the **Offline Story Pack** badge during gameplay
- [ ] Include the primary `/feedback` Codex Session ID
- [ ] Share the repository with the required judging accounts if private
