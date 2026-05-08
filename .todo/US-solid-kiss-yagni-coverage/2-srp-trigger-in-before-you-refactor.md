# 2-srp-trigger-in-before-you-refactor

## Context

The "Fowler smells" preamble in `before-you-refactor/principles.md`
already flags duplicated code (DRY, `97/30`) as covered elsewhere by
`writing-clean-code`. SRP — "two reasons to change in one unit, split
it" — is the equally-canonical refactoring trigger and is currently
absent. This is a real gap, not a labeling exercise.

The `writing-clean-code` decision 4 frames SRP as the *discipline of
writing one responsibility per unit*. This task adds the *trigger to
consider a split* in `before-you-refactor`. Two skills, two verbs;
not duplicates.

**Value delivered:** when the agent is asked to refactor, "this
function does scheduling *and* logging *and* persistence" lights up as
a named, citable trigger to consider before touching the code.

## Related Files

- `skills/before-you-refactor/SKILL.md` — add SRP to the "What to look
  for" content (likely as a Red Flag row, matching the existing
  `Fowler/LongMethod`, `Fowler/ShotgunSurgery`, `Fowler/DataClumps`
  pattern).
- `skills/before-you-refactor/principles.md` — short distillation
  (2–4 sentences) for SRP, alongside or near the existing DRY mention
  in the "Fowler smells" preamble. Cite `97/76`.
- `skills/writing-clean-code/SKILL.md` — decision 4 gains a one-clause
  back-reference to the new `before-you-refactor` SRP trigger
  (bidirectional consistency). See Acceptance Criteria.

## Dependencies

- None. Citation key locked at `97/76` in `main.md`. This task can run
  in parallel with tasks 1 and 3.

## Acceptance Criteria

- [ ] `before-you-refactor/SKILL.md` lists SRP as a refactoring trigger
      with a verifiable check ("can you state the unit's responsibility
      in one sentence with no 'and also'?"). Likely a Red Flag row
      whose "Thought" column captures the engineer-facing pattern
      ("the function does X *and also* Y, but they're related") and
      whose "Reality" cites `97/76`.
- [ ] `before-you-refactor/principles.md` has an SRP entry near the
      existing DRY mention in the "Fowler smells" preamble, citing
      `97/76`.
- [ ] **Bidirectional cross-reference.** `writing-clean-code/SKILL.md`
      decision 4 gains a one-clause pointer to
      `before-you-refactor`'s SRP trigger ("see `before-you-refactor`
      for when to *trigger* a split"). The `before-you-refactor`
      entry mirrors the pointer back ("see `writing-clean-code`
      decision 4 for the discipline of writing the result").
- [ ] Cross-reference tone is consistent: `before-you-refactor` says
      "this is the trigger to *consider* the refactor",
      `writing-clean-code` says "this is the discipline to *write* the
      result". They don't restate each other.
- [ ] Citation: `97/76` reused. No new citation key introduced.
- [ ] Voice check: no acronym banners, no rule-of-three. The Red Flag
      "Thought" column does not contain the acronym SRP (per `main.md`
      forbidden list).
- [ ] `npm test` passes. If the line cap on
      `before-you-refactor/SKILL.md` is approached, trim a low-value
      Red Flag row before raising the cap.

## Verification

**Automated:** `npm test`.

**Ad-hoc:** `rg -n '97/76' skills/before-you-refactor/` shows entries
in both `SKILL.md` and `principles.md`. `rg -n
'before-you-refactor' skills/writing-clean-code/SKILL.md` shows the
back-reference in decision 4. Re-read both the new entry and
`writing-clean-code` decision 4 — confirm one frames the *trigger* and
the other frames the *discipline*; they should not sound like
duplicates.

**Locating the existing DRY mention:** grep
`skills/before-you-refactor/principles.md` for `97/30` — the line
number drifts as the file evolves; use the heading or content as
the anchor, not the absolute line.

## Notes

- The trigger framing matters: `before-you-refactor` fires *before*
  refactoring; `writing-clean-code` fires *while* writing. The SRP
  language in `before-you-refactor` should ask "should we split?"
  (yes/no decision); the language in `writing-clean-code` should ask
  "is what I just wrote one responsibility?" (review check). Different
  verbs.
- The bidirectional cross-reference is required by `AGENTS.md`
  "Editing existing skills" rule 2 ("cross-references must stay
  bidirectionally consistent"). Without it, this task leaves the two
  skills in inconsistent states and a future contributor will have to
  add the back-reference anyway.
