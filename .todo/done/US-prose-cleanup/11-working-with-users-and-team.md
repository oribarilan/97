# 11-working-with-users-and-team

## Context

Rule-of-four padding on line 10 ("what the user said, what the user meant,
what you heard, what you built"). "Surface a definitional gap"
consultantese on line 42.

## Related Files
- `skills/working-with-users-and-team/SKILL.md`

## Dependencies
- Task 1 (calibration)

## Acceptance Criteria

- [x] **Agent-first cuts**: trimmed Overview rule-of-four ("said/meant/heard/built") to two clauses ("said and meant"). Trimmed footer paren listing demoted principles (project metadata, not agent-actionable).
- [x] **Precedence cleanup**: deleted entire Precedence section (3 bullets — brainstorming/TDD/api-and-interface-design+domain-modeling). All redundant.
- [x] "Surface a definitional gap" → "shows where you and the user disagree on what a word means"
- [x] `npm test` passes

## Verification

- Overview line 10 reads as plain prose, not a four-beat list
- `npm test` exits 0
