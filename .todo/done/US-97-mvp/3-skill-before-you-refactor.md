# 3-skill-before-you-refactor

## Context

Build the first themed skill end-to-end. This task is the **template-validation step** — once the human partner has installed and used this skill on a real refactor and judged it useful, the remaining 8 themed skills can be built in parallel using the same shape.

Picked first because: narrow trigger ("about to refactor"), only 5 source principles to fetch (lowest research overhead), and high everyday value.

**Value delivered**: A working, installed, human-validated skill that demonstrably changes agent behavior before refactors. Also: a proven skill-shape template that 8 follow-up tasks can mechanically replicate.

## Related Files

- `~/.config/dotfiles/opencode/superpowers/skills/test-driven-development/SKILL.md` — shape and voice template (Red Flags, Iron Law, imperative)
- `~/.config/dotfiles/opencode/superpowers/skills/systematic-debugging/SKILL.md` — example of a skill with supporting `principles.md`-style files
- `.todo/US-97-mvp/main.md` — cross-cutting concerns (voice, file layout, source workflow)

## Dependencies

- `1-scaffold-plugin-bundle.md` (need the plugin)
- `2-bootstrap-using-97.md` (the bootstrap should reference this skill once it exists)

## Source principles to distill

Per `main.md` source-material policy: **fetch from the CC-BY-3.0 GitHub mirror first** (https://github.com/97-things/97-things-every-programmer-should-know), use Birat Rai's Medium walkthrough as a reading aid only, never as the canonical citation. Fetch sources for all five principles in a single parallel `webfetch` batch:

1. **#6 Before You Refactor** — Rajith Attapattu
2. **#8 The Boy Scout Rule** — Robert C. Martin
3. **#24 Don't Be Afraid to Break Things** — Mike Lewis
4. **#31 Don't Touch That Code!** — Cal Evans
5. **#74 The Road to Performance Is Littered with Dirty Code Bombs** — Kirk Pepperdine

Medium reading-aid links (do not cite as primary):
- https://medium.com/@biratkirat/step-6-before-you-refactor-rajith-attapattu-386e525222e1
- https://medium.com/@biratkirat/step-8-the-boy-scout-rule-robert-c-martin-uncle-bob-9ac839778385
- https://medium.com/@biratkirat/step-24-dont-be-afraid-to-break-things-mike-lewis-96fb42119888
- https://medium.com/@biratkirat/step-31-dont-touch-that-code-cal-evans-bf70fc41e155
- https://medium.com/@biratkirat/step-74-the-road-to-performance-is-littered-with-dirty-code-bombs-kirk-pepperdine-727a334bfce6

For each: distill to **2-4 actionable sentences in your own words** capturing the underlying technique. Cite the author. Link the GitHub mirror chapter as primary, Medium as supplementary. **No verbatim quotes longer than ~25 words.**

## Acceptance Criteria

- [ ] All 5 sources fetched from the GitHub mirror (Medium consulted as needed); rough notes captured before writing the skill — preserved as scratch in this task file or discarded only after the skill is final
- [ ] **Source provenance recorded in `principles.md`** for each principle: which source was used (GitHub mirror / Medium / both), access date, any gaps; if any principle had to fall back away from the GitHub mirror, the human partner is notified before the human-approval gate
- [ ] `skills/before-you-refactor/SKILL.md` exists with frontmatter:
  - [ ] `name: before-you-refactor`
  - [ ] `description: Use when about to refactor, restructure, rename across files, or "clean up" existing code`
- [ ] `SKILL.md` body has these sections in this order:
  - [ ] **Overview** — one-sentence core principle
  - [ ] **When to invoke** — explicit triggers AND a **Non-triggers** subsection listing ≥3 prompts that should NOT fire this skill (e.g., "fixing a one-line bug", "adding a new function in a new file", "renaming a single local variable")
  - [ ] **The pre-refactor checklist** — concrete imperative steps the agent must do before changing any code (drawn from #6 Before You Refactor)
  - [ ] **The 5 principles** — short section per principle with author attribution and 2-4 sentence distillation in your own words, linking to the GitHub mirror chapter
  - [ ] **Red Flags** — table mapping rationalizations → reality (at least 5 rows)
  - [ ] **What "done" looks like** — how the agent knows the refactor is actually safe to commit
- [ ] `skills/before-you-refactor/principles.md` exists with the long-form per-principle reference (deeper than the SKILL.md summary, in your own words, no verbatim quotes >25 words, full GitHub mirror URLs + Medium URLs + access dates + source-used-for-each)
- [ ] Voice matches superpowers exactly (imperative, "your human partner", Red Flags table, no hedging)
- [ ] `SKILL.md` is under 200 lines
- [ ] `scripts/lint-skills.mjs` passes for `before-you-refactor`
- [ ] After installing into sandbox opencode and asking the agent to "refactor this messy function" in a throwaway file, the agent invokes `before-you-refactor` BEFORE editing AND produces named pre-refactor checklist items in its response before any `edit` tool call (proves both the trigger fires AND the content is actually applied, not just loaded-and-ignored)
- [ ] Negative-trigger check: prompt the agent with "fix this typo in a comment" — must NOT invoke `before-you-refactor`
- [ ] **Human partner has used this skill on ≥3 real refactor tasks** in their actual work and explicitly approved it as the template for the remaining skills (the "review on a real refactor" gate is not satisfied by a single use)

## Verification

- **Automated** (must pass before human gate):
  1. `npm run lint` exits 0
- **Ad-hoc** (mandatory before marking done):
  1. Install 97 into sandbox opencode config
  2. Open a fresh session in a project with refactor-able code
  3. Prompt: "Please refactor `<some file>` to be cleaner"
  4. Agent must invoke the `skill` tool to load `before-you-refactor` BEFORE making edits — verify by reading the agent's tool calls
  5. Agent must produce named pre-refactor checklist items or named-principle reasoning before any `edit` call
  6. Negative test: prompt "fix this typo" — agent must NOT invoke this skill
  7. Human partner uses the skill on **≥3 real refactor tasks** in their actual work and gives explicit thumbs-up on usefulness AND template shape
- **No automated test of agent behavior** — skills are behavior-shaping; the only meaningful test is observed agent behavior under pressure

## Notes

- This is the **template task**. Whatever shape this skill takes IS the shape of the next 8. Spend time on it. Iterate. Get the voice right.
- After this ships and the human approves, copy this task file as the starting point for each of the 8 follow-up skill tasks — only the trigger, source principles, and "what done looks like" change.
- If the GitHub mirror chapter is missing or unclear for a principle, fall back to Medium, and note the source used in `principles.md`. If both fail, drop the principle and note the gap.
- **Do NOT include direct quotes from the book or Medium posts longer than ~25 words.** Distill in your own words. The original principles are CC-BY-3.0; respect the attribution but don't redistribute the prose.
- DO NOT start the 8 follow-up tasks before the human partner approves this one. That gate exists on purpose, and now requires ≥3 real refactor uses (not a single approval moment).
