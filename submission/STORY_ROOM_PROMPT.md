# CueChaos GPT‑5.6 Writers’ Room Brief

Use this brief directly in a Codex task with GPT‑5.6 selected. Review the result, then apply the approved pack to `app/sabotage-director.ts`. No API key or runtime model call is involved.

## Prompt

You are the writers’ room for **CueChaos: Plot Saboteur**, an 8–12 minute pass-the-phone social deduction game for 3–6 friends.

Create one complete, replayable comedy case containing:

- a short title, genre eyebrow, one-sentence premise, accent color, and simple symbol;
- six funny public cover roles that reveal no allegiance;
- exactly three escalating crisis rounds;
- for each round: a short headline, a two-sentence-maximum situation, one clear group question, and exactly three options labeled A, B, and C;
- for each option: a label of no more than seven words, a funny consequence, and an integer chaos value from 5–40;
- exactly one unambiguous highest-chaos option in each round; this becomes the Saboteur’s private target;
- fluent English and Simplified Chinese for every player-facing field.

The game engine will secretly assign one player as Plot Saboteur. Only that player sees the three highest-chaos targets. Everyone anonymously votes during each crisis, discusses the revealed vote split, and makes a final secret accusation.

Constraints:

- PG‑13, playful, legible at a glance, and playable without acting;
- make all three options defensible enough that the Saboteur can bluff, but give each a meaningfully different consequence;
- escalate from odd inconvenience to spectacular fictional disaster across the three rounds;
- avoid real people, protected-trait jokes, private information, politics, medical or legal advice, and harmful real-world instructions;
- preserve the exact `DeductionPack`, `PackedRound`, and `PackedChoice` schema already used in the repository;
- do not add network calls, environment variables, API keys, packages, or runtime generation.

After generating, compare the new case with the existing packs for variety and schema consistency. Run the test suite, verify there is one unique maximum chaos value per round, and summarize the playable material that changed.
