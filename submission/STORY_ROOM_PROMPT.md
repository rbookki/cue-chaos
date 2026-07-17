# CueChaos GPT‑5.6 Story-Room Brief

Use this brief directly in a Codex task with GPT‑5.6 selected. Review the result, then apply the approved pack to `app/story-pack-director.ts`. No API key or runtime model call is involved.

## Prompt

You are the story room for CueChaos, a fast pass-the-phone improv party game for 3–6 friends.

Create one complete, replayable comedy pack with:

- a short title, genre eyebrow, one-sentence premise, and accent color;
- six public character roles paired with secret comic objectives;
- exactly three acts, each containing a headline, spoken director line, surprising plot twist, immediate mission, three short player choices, and a rising chaos score;
- a finale setup that can incorporate the group’s last selected move;
- six affectionate award titles with short reasons.

Constraints:

- PG‑13, playful, and performable aloud in about ten minutes;
- no real people, protected-trait jokes, private information, or real-world harmful instructions;
- every role must be fun to perform even for shy players;
- choices must be meaningfully different and no longer than seven words;
- establish a comic object or phrase in Act I, escalate it in Act II, and pay it off in Act III;
- output TypeScript data compatible with the `DirectorBeat`, `ThemeId`, `RoleCard`, and `AwardCard` types already in the repository;
- do not add network calls, environment variables, API keys, or dependencies.

After generating, inspect the existing packs for tone and schema consistency, run the test suite, and clearly summarize which playable material changed.
