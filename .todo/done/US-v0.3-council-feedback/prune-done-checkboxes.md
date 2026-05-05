# prune-done-checkboxes

**Council confidence:** [Majority] — 4/5 councillors flagged the
"What 'done' looks like" sections as ceremony in most skills, with
`error-and-correctness-traps` as the exception (its checkboxes are
checkable: "no `==` between floats", "retries have backoff, jitter,
and a ceiling").

## Context

Most themed skills end with a "What 'done' looks like" checklist that
restates the decisions as checkboxes. In skills like `writing-clean-code`
(`SKILL.md:113-121`) and `pre-commit-self-review` (`SKILL.md:80-90`),
many items are unfalsifiable from the agent's perspective — the agent
will confidently tick them all and the section becomes self-graded
ceremony.

`error-and-correctness-traps:106-112` is the exception. Its checks are
literal-truth assertions about the code:

- "no `==` between floats; tolerances scaled to magnitude"
- "money uses a decimal type"
- "retries have backoff, jitter, and a ceiling"
- "any new singleton is justified, narrowly scoped, and accessed
  through an interface"

These an agent (or a reviewer) can actually check.

**Value delivered:** removes self-graded ceremony from skills where it
doesn't earn its keep; sharpens the remaining checks where they do.

## Related Files

- `skills/writing-clean-code/SKILL.md` — likely full rewrite of section
- `skills/before-you-refactor/SKILL.md`
- `skills/testing-discipline/SKILL.md`
- `skills/api-and-interface-design/SKILL.md`
- `skills/pre-commit-self-review/SKILL.md`
- `skills/error-and-correctness-traps/SKILL.md` — likely keep as-is
  (template)
- `skills/build-deploy-and-tooling/SKILL.md`
- `skills/domain-modeling/SKILL.md`
- `skills/working-with-users-and-team/SKILL.md` — may already be edited
  by `prune-working-with-users-and-team.md`
- `scripts/lint-skills.mjs` — does not currently lint for "done"
  section presence; verify this stays the case after edits

## Dependencies

- Coordinates with `tighten-writing-clean-code.md` and
  `prune-working-with-users-and-team.md` — those tasks own their own
  files and should apply this rule when they land. If those land first,
  this task only sweeps the remaining 7 skills.

## Acceptance Criteria

- [x] Each themed skill's "What 'done' looks like" section is reviewed
      against this rubric, item by item:
  - **Keep** items that are literal-truth checks an agent or reviewer
    can verify by reading the code/config (concrete identifiers,
    measurable thresholds, explicit absences).
  - **Remove** items that are restatements of taste, motivational
    framing, or unfalsifiable self-grading.
  - If fewer than 3 items remain after the rubric, **remove the entire
    section** rather than leave a token-light vestige.

**Worked rubric examples** (from `pre-commit-self-review/SKILL.md:80-90`):

  - **Keep** — "Build is clean — no new warnings, lint errors, or
    deprecation notices introduced." → observable from build output.
  - **Keep** — "The commit (or hand-off) can be described in one
    sentence with no 'and also.'" → checkable by reading the proposed
    commit message.
  - **Cut** — "You can describe what each non-trivial block does to
    your human partner without reading the code aloud." → unfalsifiable
    self-grading; the agent will check this regardless of code state.
  - **Cut** — "Nothing in the change is something you'd want to undo
    after a night's sleep." → motivational; agents don't sleep.
  - **Borderline** — "You re-read the full diff as a stranger and it
    explains itself." The action is observable (did the agent re-read?)
    but "explains itself" is judgment. Resolve by either rewording to
    a checkable form ("every hunk has either an inline comment or a
    name that explains intent without reading the body") or cutting.
- [x] `error-and-correctness-traps` is the explicit template; its
      "done" section stays. Verify by re-reading.
- [x] **Every skill's "done" section is reviewed**, with the result
      recorded in this task file under a new "Per-skill outcomes"
      heading: skill name, kept item count, cut item count, removed
      entirely (yes/no). No skill is silently skipped.
- [x] No skill's "done" section grows under this task.
- [x] `CHANGELOG.md` `### Changed` entry names the affected skills.
- [x] `npm test` passes.

## Verification

**Automated:**
- `npm test` for structure and budget compliance

**Ad-hoc:**
- For each retained "done" item, confirm it expresses the form
  "*observable property* of the code/config/diff" not "*author's
  feeling* about the code/config/diff."
- Spot-check: pick a hypothetical agent-output and walk through each
  retained checkbox. If the answer is "the agent says it's checked"
  rather than "I can grep for the property," cut it.

## Notes

- The "What 'done' looks like" section is genuinely useful when
  checkable. The rule is **density, not absence**. Don't go on a
  crusade against the section; go on a crusade against bad items in it.
- This task is partly cosmetic and partly behavioral: cosmetic in that
  it shortens skills slightly; behavioral in that it stops training
  the agent to go through self-grading motions.
- One councillor (gemini) was less critical of these sections than the
  others. Tagging Majority rather than Consensus.

## Per-skill outcomes

| Skill | Items kept | Items cut | Section removed? |
|---|---|---|---|
| `api-and-interface-design` | 9 | 0 | no |
| `before-you-refactor` | 7 | 0 | no |
| `build-deploy-and-tooling` | 9 | 0 | no |
| `domain-modeling` | 6 | 1 (cut "describe in one sentence to your human partner" — self-grading) | no |
| `error-and-correctness-traps` | 5 | 0 | no (template — explicitly retained) |
| `pre-commit-self-review` | 6 | 3 (cut "re-read as stranger, explains itself" — self-grading; "comments help next reader, none stale/snarky/career-limiting" — qualitative; "nothing you'd want to undo after a night's sleep" — motivational, agents don't sleep) | no |
| `testing-discipline` | 8 | 0 | no |
| `working-with-users-and-team` | 4 | already handled in `prune-working-with-users-and-team` (cut from 7 to 4) | no |
| `writing-clean-code` | 6 | already handled in `tighten-writing-clean-code` (cut from 9 to 6) | no |

No skill grew under this task. No skill's section was removed entirely.
