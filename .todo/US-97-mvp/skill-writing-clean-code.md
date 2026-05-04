# skill-writing-clean-code

## Context

Build the `writing-clean-code` themed skill — the most-frequently-fired skill in the bundle, and therefore the **highest-risk skill for trigger habituation**. Triggers when the agent is about to make a meaningful production-code decision (new abstraction, new function, naming, non-trivial logic change), NOT every keystroke.

**Critical trigger-design constraint** (per plan review): the previous trigger ("about to write or modify production code") fires on essentially every coding task, which causes (a) habituation — the agent learns the skill is noise and skips it, and (b) collisions with every other 97 skill (refactor, testing, API design, pre-commit) which are subsets of "writing code." Per `main.md` Skill precedence, more specific skills win — so this skill must trigger only on the residual moments not covered by another 97 skill.

**Value delivered**: Agents reach for clean-code principles at the actual decision moments (writing a new function, naming, choosing structure) — not as background noise on every edit.

**Use `3-skill-before-you-refactor` as the template.** Same shape, narrower trigger.

## Related Files

- `skills/before-you-refactor/SKILL.md` — proven template (must exist + be human-approved before this task)
- `.todo/US-97-mvp/main.md` — voice, layout, source-material policy, skill precedence

## Dependencies

- `3-skill-before-you-refactor.md` (template must be validated first)

## Source principles to distill

Per `main.md` source-material policy: GitHub mirror first, Medium as reading aid only. URLs from https://biratkirat.medium.com/97-journey-every-programmer-should-accomplish-a0c53dbbfd47 are reading aids only:

1. **#5 Beauty Is in Simplicity** — Jørn Ølmheim
2. **#13 Code Layout Matters** — Steve Freeman
3. **#15 Coding with Reason** — Yechiel Kimchi
4. **#17 Comment Only What the Code Cannot Say** — Kevlin Henney
5. **#30 Don't Repeat Yourself** — Steve Smith
6. **#39 Improve Code by Removing It** — Pete Goodliffe
7. **#62 Only the Code Tells the Truth** — Peter Sommerlad
8. **#75 Simplicity Comes from Reduction** — Paul W. Homer
9. **#76 The Single Responsibility Principle** — Robert C. Martin
10. **#91 WET Dilutes Performance Bottlenecks** — Kirk Pepperdine
11. **#93 Write Code As If You Had to Support It for the Rest of Your Life** — Yuriy Zubarev
12. **#94 Write Small Functions Using Examples** — Keith Braithwaite

## Acceptance Criteria

- [ ] All 12 sources fetched from GitHub mirror first; provenance recorded in `principles.md` (which source used per principle, access date, gaps)
- [ ] `skills/writing-clean-code/SKILL.md` exists with frontmatter:
  - [ ] `name: writing-clean-code`
  - [ ] **Trigger** (situation-based, NOT topic-based): `description: Use when adding a new function/class, naming a new entity, or modifying ≥3 lines of non-trivial logic — at most once per file per session`
- [ ] Body matches the proven template structure: Overview, When to invoke, Principles, Red Flags table, What "done" looks like
- [ ] **Non-triggers** subsection in "When to invoke" lists ≥5 prompts that should NOT fire this skill:
  - typo / one-line bug fix
  - config edits (JSON/YAML/TOML/dotfiles)
  - test code (use `testing-discipline` instead)
  - refactoring existing code (use `before-you-refactor` instead)
  - mechanical edits like running a formatter, sorting imports, renaming a single local variable
  - generated code
  - already-fired-this-file in the current session (the once-per-file constraint)
- [ ] Body explicitly defers to more-specific 97 skills per `main.md` precedence: when `before-you-refactor`, `testing-discipline`, or `api-and-interface-design` could apply, this skill steps aside
- [ ] `skills/writing-clean-code/principles.md` has long-form distillations for all 12 principles in your own words (no verbatim quotes >25 words), with author + GitHub mirror link + Medium link + source provenance
- [ ] Tension explicitly resolved in `SKILL.md`: #93 (write for long-term support) vs YAGNI / over-engineering — resolution in favor of "support" without inviting speculative complexity
- [ ] `SKILL.md` under 250 lines (slightly larger budget — 12 principles vs 5)
- [ ] `scripts/lint-skills.mjs` passes for this skill
- [ ] **Positive trigger test**: ask the agent to "write a function that parses CSV and groups by column" → invokes `writing-clean-code` before writing
- [ ] **Negative trigger test 1**: ask the agent to "fix the typo in this comment" → does NOT invoke
- [ ] **Negative trigger test 2**: ask the agent to "refactor this messy function" → invokes `before-you-refactor`, NOT `writing-clean-code`
- [ ] **Negative trigger test 3**: ask the agent to "add tests for `parseCSV`" → invokes `testing-discipline`, NOT `writing-clean-code`
- [ ] **Habituation check**: in a session where the agent makes 5 sequential code edits to the same file, this skill is invoked at most once

## Verification

- **Automated**:
  1. `npm run lint` exits 0
- **Ad-hoc**: install in sandbox → fresh session → run all 5 trigger tests above (1 positive, 3 negative-other-skill, 1 habituation) and verify outcomes match expectations
- Read the `SKILL.md` aloud — does it sound like a senior engineer giving rules, or like a textbook? Must be the former.

## Notes

- 12 principles is a lot. Group them in `SKILL.md` under thematic sub-headers (e.g., "Simplicity", "Comments", "Function shape", "Removal as a verb") to keep it scannable. Full per-author distillations live in `principles.md`.
- The "at most once per file per session" constraint in the description is the most important word in this skill. Without it, this skill becomes session noise and ruins the rest of the bundle by association.
- If after launch the trigger still over-fires, fall back to a narrower description (e.g., "Use when introducing a new abstraction or naming a new domain entity") and prune the principle list to match.
