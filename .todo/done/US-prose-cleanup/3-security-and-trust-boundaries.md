# 3-security-and-trust-boundaries

## Context

Templated overview matches `error-and-correctness-traps` (rule-of-four `-ing`
list). Heavy `trap`-compound use: `trap-scan`, `the trap closes`,
`trap shape`, four uses of "The trap shape:" as a structural phrase.

**Value delivered:** the security skill stops sounding like a templated
clone of error-traps.

## Related Files
- `skills/security-and-trust-boundaries/SKILL.md`

## Dependencies
- Task 1 (calibration)
- Task 2 (consistent landmine/hand-off voice)

## Acceptance Criteria

- [x] **Agent-first cuts**: removed all 5 subsection lead-ins (interpreter/validation-contract/radioactive-secrets/crypto-looks-secure/missing-decorator), trimmed Overview meta-commentary about "97/26 generalizes to..." (project bookkeeping, not agent-actionable), removed duplicate navigation, dropped OpenCode-coupling phrasing.
- [x] **Precedence cleanup**: cut 2 of 3 bullets (`superpowers/systematic-debugging` generic, `api-and-interface-design` shape vs boundary). Kept the `error-and-correctness-traps` tiebreak rule — it's a non-obvious 97↔97 ordering rule the trigger map doesn't make explicit.
- [x] Overview opening: rule-of-four `-ing` list cut, "invisible until it bites" cut, "the trap closes" cut, "trap-scan" cut.
- [x] `Fires hardest` / `Fires lightly` → "These checks matter most"
- [x] `trap-scan`, `trap shape` (×6), `Concrete trap` (×6), `Concrete trap (IDOR)`: all replaced with "pattern" / "Example:" / "Example (IDOR):" / cut.
- [x] `hand-off` (×2) → "summary to the user"
- [x] `wearing a costume` not present (was in error-traps).
- [x] `mid-trust-boundary` deleted (replaced "you are not done — you are mid-trust-boundary" with "you are not done. Either finish, or revert and re-plan.")
- [x] `stage exemption` → "this rule applies at any stage"
- [x] "Three traps override that calibration" → "Three rules apply at every stage, even prototypes"
- [x] Cross-reference to `error-and-correctness-traps` line 44 still resolves (the file exists with the same name).
- [x] `npm test` passes

## Verification

- `rg 'trap-scan|the trap closes|trap shape' skills/security-and-trust-boundaries/SKILL.md` returns 0 hits
- `rg 'error-and-correctness-traps' skills/security-and-trust-boundaries/SKILL.md` still resolves to real text in the target file
- `npm test` exits 0
