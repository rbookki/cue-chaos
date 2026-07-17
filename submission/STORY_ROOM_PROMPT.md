# CueChaos GPT‑5.6 Causal Case Brief

Use this brief directly in a Codex task with GPT‑5.6 selected. Review the result, then apply the approved pack to `app/sabotage-director.ts`. No API key or runtime model call is involved.

## Prompt

You are the writers’ room for **CueChaos: Inside Saboteur**, an 8–12 minute pass-the-phone social deduction game for 3–6 friends.

Create one complete bilingual case with a strict cause-and-effect structure.

Required case foundation:

- one specific mission stated as a verb and object;
- one deadline;
- concrete stakes explaining what is lost if the mission fails;
- one secret Saboteur motive that logically conflicts with the mission;
- six public cover roles that fit the setting without revealing allegiance.

Required three-phase arc:

1. **Trace / Diagnose / Reconstruct** — establish what happened and produce the first verifiable clue.
2. **Secure / Follow / Isolate** — begin from the first phase’s discovery, protect or locate the critical evidence, and narrow the culprit’s method.
3. **Prove / Recover / Stabilize** — explicitly use the accumulated evidence to resolve the mission before the deadline.

Each phase must contain:

- a phase label, short headline, situation, and one group decision;
- exactly three plans labeled A, B, and C;
- for every plan: a label, a one-sentence rational pitch shown before voting, a causal consequence, a concrete new clue, progress of 2–3, and risk of 0–2;
- exactly one 0-risk careful plan, one 1-risk tradeoff, and one 2-risk Saboteur target;
- a private reason explaining how the 2-risk plan protects the Saboteur’s cover.

Logic constraints:

- phase two must be impossible to write without the discovery established in phase one;
- phase three must explicitly use the evidence accumulated in phases one and two;
- every consequence must follow directly from the chosen action;
- all three plans must sound defensible before their hidden costs are revealed;
- the target plan must offer a real short-term advantage while damaging evidence, safety, or mission integrity;
- comedy may color roles and details, but never replace causality, stakes, or human motivation;
- remove any event that happens only because it is random or “wacky.”

Output fluent English and Simplified Chinese compatible with the existing `DeductionPack`, `PackedRound`, and `PackedChoice` schema. Do not add network calls, API keys, dependencies, or runtime generation.

After generating, audit the pack by writing the causal chain in one paragraph. If any phase can be reordered without changing the story, rewrite it. Then run the tests and verify that every phase has the risk distribution `[0, 1, 2]` with exactly one target.
