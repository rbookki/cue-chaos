# CueChaos — Devpost submission draft

## Inspiration

AI entertainment often becomes a solitary prompt box. We wanted to build something that makes people look at each other instead of the screen. CueChaos turns one phone into a live director for a ten-minute comedy that only this group of friends could create.

## What it does

CueChaos casts 3–6 players into an absurd three-act story. Every player privately receives a character and secret objective. The group performs the scene, picks a suggested move or improvises their own, and GPT‑5.6 rewrites the next act around that decision. The finale turns the whole run into a movie ending and gives every player a personalized award.

## How we built it

The application is built with Next.js/React and runs on a Cloudflare-compatible worker. A server route validates the game state and calls the OpenAI Responses API using the `gpt-5.6` model alias and strict structured outputs. The same typed contract is implemented by a deterministic demo director, so judges can play without credentials and can always see whether a beat is live or simulated.

Codex was the primary development environment for ideation, interaction design, implementation, API integration, testing, and this submission. We will include the `/feedback` Session ID from the main build thread in the final form.

## Challenges

The hard part was not generating a story. It was keeping a shared story playable, private when it needed to be, continuous across three acts, and short enough that a room of people would not lose energy. We solved this with a compact story-state contract, hard response limits, three distinct action choices per beat, and a pass-the-phone role reveal.

## Accomplishments

- A complete 3–6 player game from casting through finale.
- GPT‑5.6 plot twists grounded in the group’s actual choices.
- Private objectives without accounts or persisted player data.
- A credential-free judge experience with transparent provider labeling.
- Responsive visual design that works on a shared phone or laptop.

## What we learned

For social AI experiences, latency and continuity matter as much as raw creativity. The model needs a strong format, a clear dramatic job, and enough constraints to keep people playing rather than reading.

## What’s next

We would add QR-based multi-phone role reveals, community-authored story packs, optional voice narration, and a shareable end-credits poster generated from each game.

## Category

Apps for Your Life

## Submission checklist

- [ ] Public deployment URL
- [ ] Public repository with MIT license
- [ ] README with setup and testing instructions
- [ ] Under-three-minute public YouTube demo with English voiceover
- [ ] Show GPT‑5.6 Live badge and explain the deterministic judge fallback
- [ ] Explain how Codex was used
- [ ] Add `/feedback` Session ID from the primary build thread
