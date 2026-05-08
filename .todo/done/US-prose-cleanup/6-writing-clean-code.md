# 6-writing-clean-code

## Context

"the substance of KISS", "cuts through the clutter" purple line about
discarding bad code.

## Related Files
- `skills/writing-clean-code/SKILL.md`

## Dependencies
- Task 1 (calibration)

## Acceptance Criteria

- [x] **Agent-first cuts**: trimmed Overview opener (cut atmospheric "Most 'clean code' advice is taste dressed up as principle" + "That reader is usually you, six months on, debugging at 2 a.m."). Trimmed footer paren listing demoted principles (project metadata, not agent-actionable).
- [x] **Precedence cleanup**: deleted entire Precedence section (4 bullets — `before-you-refactor`, `testing-discipline`, `api-and-interface-design`, `domain-modeling`). All applications of `using-97` rule 3 ("more specific > broader"); the trigger map already routes correctly.
- [x] "the substance of KISS" cut from Red Flag row
- [x] "cuts through the clutter" tail cut from decision 1
- [x] No `mid-X` (file didn't have any)
- [x] `npm test` passes

## Verification

- `rg 'substance of KISS|cuts through the clutter|mid-[a-z]+' skills/writing-clean-code/SKILL.md` returns 0 hits
- `npm test` exits 0
