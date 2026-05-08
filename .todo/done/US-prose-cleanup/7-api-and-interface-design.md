# 7-api-and-interface-design

## Context

Triple `-ing` tail clauses on line 10 (classic AI tell). "tired caller"
anthropomorphism. Inflated phrasing on line 55 ("dual problem", "surface
they don't all need").

## Related Files
- `skills/api-and-interface-design/SKILL.md`

## Dependencies
- Task 1 (calibration)

## Acceptance Criteria

- [x] **Agent-first cuts**: trimmed Overview triple `-ing` tail clause to a single short sentence ("Every other decision below is a tactic for that rule — encapsulate behavior so callers can't reach past the contract, lean on the type system so wrong calls fail at compile time."). Kept H3 category headers (structural anchors, not atmospheric prose).
- [x] **Precedence cleanup**: deleted entire Precedence section (3 bullets — domain-modeling/writing-clean-code/TDD). All 97↔97 ordering covered by `using-97` rule 3 and the trigger map.
- [x] `mid-design` removed from done section
- [x] `human partner` → `the user` (1 instance)
- [x] No `Concrete trap`, no `mid-X` elsewhere
- [x] `npm test` passes

## Verification

- `rg 'mid-design' skills/api-and-interface-design/SKILL.md` returns 0 hits
- Overview opens with a sentence that doesn't pattern-match the templated four-clause shape
- `npm test` exits 0
