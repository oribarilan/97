# drop-once-per-file-rule

**Council confidence:** [Consensus] — all 5 councillors flagged
"once per file per session" as fragile.

## Context

`skills/writing-clean-code/SKILL.md:14` and `skills/using-97/SKILL.md:18`
encode a rate-limit: the skill should fire at most once per file per
session. The rationale is to prevent habituation and token bloat from
re-firing on every small edit.

Problems all councillors identified:

1. **No enforcement.** Agents have no reliable session-scoped ledger of
   "files I've fired on." In long sessions or after compaction, this
   memory is the first thing to go. The constraint is honor-system; the
   agent will violate it quietly and inconsistently.
2. **Wrong axis.** It optimizes for annoyance/token cost. The risk it
   *introduces* is that the second feature added to a file — often the
   more interesting one, written under more time pressure — gets none
   of the discipline.
3. **Undefined escape hatch.** "If the file changes shape enough that
   prior decisions no longer hold, that is a refactor — invoke
   `before-you-refactor`." But adding a second new function isn't a
   refactor.

If `writing-clean-code` is too expensive to fire twice in one file, the
skill is too long — fix the skill, not the trigger.

**Value delivered:** one fewer fragile, unverifiable instruction; the
second-edit-in-a-file case (a real and important case) gets covered.

## Related Files

- `skills/writing-clean-code/SKILL.md:3` — frontmatter `description:`
  field contains "at most once per file per session"
- `skills/writing-clean-code/SKILL.md:14, :36` — the rule paragraph and
  its non-trigger reference
- `skills/using-97/SKILL.md:18` — the bootstrap trigger row

## Dependencies

- Coordinates with `tighten-writing-clean-code.md`: that task shrinks
  the skill, which makes re-firing cheaper. If both ship together,
  great; if this lands first, the skill remains 142 lines and re-fires
  cost more — acceptable for v0.3.

## Acceptance Criteria

- [x] Remove "at most once per file per session" qualifier from
      `using-97/SKILL.md` `writing-clean-code` trigger row.
- [x] Update `writing-clean-code/SKILL.md` frontmatter `description:`
      field (line 3) to drop "— at most once per file per session"
      tail. Note: the `lint-skills.mjs` rule that the description
      starts with "Use when" must still hold.
- [x] Remove the once-per-file paragraph from
      `writing-clean-code/SKILL.md` (currently line ~14 and the
      "Non-triggers" entry at line ~36 referencing
      "already-fired-this-file").
- [x] `README.md` "What's inside" row updated to drop the rate-limit
      language.
- [x] `npm test` passes (lint budget for `writing-clean-code` is 250
      lines; this edit reduces line count, so well within budget).

## Verification

**Automated:**
- `npm test` — structural lint, smoke

**Ad-hoc:**
- `grep -ri "once per file" skills/ README.md` returns no hits

## Notes

- If telemetry (per `decide-feedback-loop-approach.md`) later shows
  `writing-clean-code` actually does fire 10x per session and degrades
  agent output, revisit. But the current "rate limit by honor system"
  is the worst of both worlds — it appears to control firing but
  actually doesn't.
- This is a one-line conceptual change with broad downstream effects.
  Document in `CHANGELOG.md` `### Changed`.
