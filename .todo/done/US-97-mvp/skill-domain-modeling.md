# skill-domain-modeling

## Context

Build the `domain-modeling` themed skill. Triggers when modeling a problem domain, choosing names, designing data structures, or deciding where state lives.

**Value delivered**: Agents speak the user's domain language in code, lean on functional principles where appropriate, and know when to reach for a database vs. in-memory structures.

**Use `3-skill-before-you-refactor` as the template.**

## Related Files

- `skills/before-you-refactor/SKILL.md` — proven template
- `.todo/US-97-mvp/main.md` — cross-cutting rules

## Dependencies

- `3-skill-before-you-refactor.md`

## Source principles to distill

Per `main.md` source-material policy: GitHub mirror first, Medium as reading aid only.

1. **#2 Apply Functional Programming Principles** — Edward Garson
2. **#11 Code in the Language of the Domain** — Dan North
3. **#12 Code Is Design** — Ryan Brush
4. **#23 Domain-Specific Languages** — Michael Hunger
5. **#48 Large, Interconnected Data Belongs to a Database** — Diomidis Spinellis

## Acceptance Criteria

- [ ] All 5 sources fetched from GitHub mirror first; provenance recorded in `principles.md`
- [ ] `skills/domain-modeling/SKILL.md` exists with frontmatter:
  - [ ] `name: domain-modeling`
  - [ ] **Trigger** (situation-based — narrowed from "choosing names" because that's constant; this skill fires on *introducing* concepts, not on every rename): `description: Use when introducing a new top-level type, table, or domain concept; renaming an existing domain concept; or choosing where state lives (in-memory vs persistent)`
- [ ] Body matches template structure
- [ ] **Non-triggers** subsection lists ≥3 prompts that should NOT fire this skill:
  - "rename a local variable inside a function" → no
  - "rename a private helper" → no
  - "add a new field to an existing type" (unless it represents a new domain concept) → no
- [ ] `principles.md` has long-form per-principle distillations in your own words (no verbatim quotes >25 words)
- [ ] `SKILL.md` under 180 lines (smallest skill — only 5 principles; resist padding)
- [ ] `scripts/lint-skills.mjs` passes
- [ ] **Positive trigger test**: "design the data model for a hotel booking system" → invokes skill before any class/type sketches; expect ubiquitous-language reasoning per #11
- [ ] **Negative trigger test**: "rename `x` to `count` in this function" → does NOT invoke

## Verification

- **Automated**: `npm run lint` exits 0
- **Ad-hoc**:
  - Positive: "design the domain model for a hotel booking system" → expect invocation, ubiquitous-language reasoning
  - Negative: "rename this local variable" → must NOT invoke

## Notes

- This is the smallest, sharpest skill. Resist padding it. 5 principles, well-distilled, beats 5 + filler.
- Cross-reference `97/api-and-interface-design` for the type-design overlap (#65 Domain-Specific Types lives there).
- Recommend dispatching this skill **first** after the human approval of `before-you-refactor` (per `main.md` Parallelism: "dispatch ONE follow-up skill first") — smallest principle count, lowest cost to redo if the template needs adjustment.
