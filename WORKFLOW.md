# WORKFLOW.md — Vague Prompt vs. Precise Prompt: Settings Form Drill

## The Task
Build a settings form (name, email, bio, notifications toggle) with validation, twice — once with a single vague prompt, once with a precise, constraint-driven prompt including a verification step.

## The Two Prompts

**Round 1 (vague):** "Build me a settings form with validation." One sentence, no file references, no constraints, no verification step.

**Round 2 (precise):** A multi-paragraph prompt specifying exact fields and validation rules, naming the library to use (`react-hook-form` + `zod`), describing exact interaction behavior (blur-triggered errors, disabled submit button with a loading label during save), specifying accessibility requirements (`label`/`htmlFor`, `aria-invalid`, `aria-describedby`, full keyboard operability), and ending with an explicit instruction to write unit tests and run them before reporting done.

## The Diff
`git diff round1-vague round2-precise --stat` shows **25 files changed, 2420 insertions(+), 2203 deletions(-)**. The most telling lines:

```
src/App.css               |  184 ---   (deleted entirely)
src/App.tsx               |  119 +-   (rewritten)
src/SettingsForm.css      |  100 ++   (new)
src/SettingsForm.test.tsx |   84 ++   (new)
src/SettingsForm.tsx      |  156 ++   (new)
src/assets/hero.png       |  Bin 13057 -> 0 bytes  (deleted)
src/settingsSchema.ts     |   29 +    (new)
vitest.config.ts          |   11 +    (new)
```

## Correctness
Round 1 delivered **zero implementation of the requested feature**. Opening the app showed Vite's default "Get started" starter page — the counter button, the spinning logo, links to Vite/React docs — with no form, no fields, and no validation logic anywhere in the codebase. The vague one-line prompt caused the agent to interpret the task as "scaffold a new project" rather than "build a feature," and it stopped at the scaffold. This is the single clearest AI mistake this drill caught: a full miss, not a subtle bug.

Round 2 produced a working `SettingsForm.tsx` (156 lines) backed by a dedicated `settingsSchema.ts` (29 lines) zod schema, plus `SettingsForm.test.tsx` (84 lines) covering four behaviors: empty-submit validation errors, invalid-email format errors, a successful submission path, and the submit button disabling during the simulated save. I ran the tests myself (`npm test`) rather than trusting the agent's summary — all 4 passed.

## Accessibility
Round 1: not applicable — there was no form to evaluate.
Round 2: the prompt explicitly required `label`/`htmlFor` pairing, `aria-invalid` and `aria-describedby` on invalid fields, and full keyboard operability. I confirmed this by tabbing through the rendered form and triggering validation errors — focus order was logical and error states were reachable via keyboard alone.

## Edge Cases
Round 1: none handled, since no form existed to test edge cases against.
Round 2: the four automated tests cover the core edge cases (empty submission, malformed email, disabled-during-save state), and I manually tried a few more — whitespace-only name and an over-length bio — as a spot check beyond what the agent tested itself.

## Review Effort
Round 1 took almost no time to prompt (one sentence) but delivered nothing usable, meaning its "review effort" was effectively wasted — I still had to build the entire feature from scratch afterward. Round 2 took noticeably longer to write (a multi-paragraph prompt with explicit constraints and a verification instruction), and the agent's run itself took longer too since it had to write and execute tests. But total end-to-end time was lower: I spent that time once, up front, and needed almost no manual debugging afterward because the agent's own test run caught issues before I ever touched the code. This matches the drill's stated lesson — round two feels slower in the moment but is faster overall.

## Takeaway
The deciding factor wasn't code style or polish — it was that round 1's prompt was ambiguous enough that the agent satisfied a *plausible* but wrong interpretation of the task ("set up a project") instead of the intended one ("build this specific feature"), and had no verification step to catch that it had drifted. Round 2's constraints and built-in test-and-run loop closed both gaps.
