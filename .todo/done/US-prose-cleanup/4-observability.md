# 4-observability

## Context

Third skill using the `trap-scan` template. Uses "in slow motion" metaphor
that's reused elsewhere — pick one instance to keep or cut all.

**Value delivered:** breaks the templated trio (error-traps,
security-and-trust, observability) opening pattern.

## Related Files
- `skills/observability/SKILL.md`

## Dependencies
- Task 1 (calibration)
- Tasks 2-3 (consistent voice)

## Acceptance Criteria

- [x] **Agent-first cuts**: removed all 3 subsection lead-ins (free-form/illegible-traces/metrics-outage). Trimmed Overview rule-of-four `-ing` list. Removed duplicate navigation. Dropped "trap-scan modeled on..." meta-reference.
- [x] **Precedence cleanup**: deleted entire Precedence section (4 bullets). The 3 content-boundary bullets duplicated item 3 in Logs section ("Log content boundaries belong to other skills"). The 4th was generic process.
- [x] Overview opening reshaped — bold imperative now lists 4 short noun phrases instead of 4 `-ing` clauses; pattern differs from error-traps and security skills.
- [x] `Concrete trap` (×3) → `Example`
- [x] `Same trap` → `Same problem`
- [x] `mid-instrumentation` deleted; tail replaced with "Either finish, or revert and re-plan."
- [x] "in slow motion" — already cut earlier in the subsection lead-in removal.
- [x] Cross-reference to `error-and-correctness-traps` (was line 39 in old Precedence) is removed; cross-references in item 3 (security-and-trust-boundaries, build-deploy-and-tooling) preserved.
- [x] `npm test` passes

## Verification

- `rg 'trap-scan' skills/observability/SKILL.md` returns 0 hits
- `npm test` exits 0
