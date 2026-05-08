# 10-build-deploy-and-tooling

## Context

"cult artifact" jargon, "calcify into legend", "kick a downed service
harder". Five-clause imperative thesis statement on line 10.

## Related Files
- `skills/build-deploy-and-tooling/SKILL.md`

## Dependencies
- Task 1 (calibration)

## Acceptance Criteria

- [x] **Agent-first cuts**: kept H3 sub-area headers (Version control / Builds / Deploy / Tooling choice / Automation — they're structural anchors). Kept 5-clause imperative thesis (each clause maps to a numbered item; agent-actionable).
- [x] **Precedence cleanup**: deleted entire Precedence section (4 bullets — pre-commit-self-review/verification-before-completion/TDD/scope statement). All redundant.
- [x] "cult artifact" → "someone else's problem"
- [x] "calcify into legend" → "nobody understands"
- [x] `Fires hardest` / `Fires lightly` → "These checks matter most..."
- [x] `mid-authored` removed; "the change is not done — it is mid-authored" → "the change is not done"
- [x] `human partner` → `the user`
- [x] `npm test` passes

## Verification

- `rg 'cult artifact|calcify into legend' skills/build-deploy-and-tooling/SKILL.md` returns 0 hits
- `npm test` exits 0
