# 9-domain-modeling

## Context

Light cleanup. `mid-modeling` if present, otherwise minor humanizer pass.

## Related Files
- `skills/domain-modeling/SKILL.md`

## Dependencies
- Task 1 (calibration)

## Acceptance Criteria

- [x] **Agent-first cuts**: kept Language Guard (genuinely agent-actionable: don't apply typed-domain principles in dynamic-language scripts). Reformatted "Cross-reference:" prefix into a plain sentence.
- [x] **Precedence cleanup**: deleted entire Precedence section (3 bullets — brainstorming/api-and-interface-design/writing-clean-code). All redundant with `using-97` rules.
- [x] `mid-modeling` removed; "you are not done modeling — you are mid-modeling" → "you are not done."
- [x] `human partner` → `the user`
- [x] `npm test` passes

## Verification

- `rg 'mid-modeling' skills/domain-modeling/SKILL.md` returns 0 hits
- `npm test` exits 0
