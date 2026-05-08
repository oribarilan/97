# 13-agents-and-contribute

## Context

Promotional opener ("behavior-shaping skills distilled from the hard-won
lessons of world-renowned programmers, in the spirit of *97 Things*") near-
verbatim in both files. AGENTS.md uses that exact phrase as its
gold-standard "Good" changelog example — must be rewritten in the same
commit, or the file contradicts itself.

Also: "in lockstep", "load-bearing", "namesake exemplar" (already
self-flagged in AGENTS.md as bad example, but still survives elsewhere).

## Related Files
- `AGENTS.md`
- `CONTRIBUTE.md`

## Dependencies
- Tasks 1-12 (skill voice settled)

## Acceptance Criteria

- [x] **Agent-first cuts** (AGENTS.md is read by both contributor humans AND agents): no atmospheric prose left to cut beyond the opener.
- [x] Opener phrase rewritten in both files identically: "behavior-shaping skills distilled from the hard-won lessons of world-renowned programmers" → "skills distilled from established programming practice"
- [x] AGENTS.md "Good" changelog example (line 166-170) rewritten in same edit pass; no contradiction
- [x] Remaining `hard-won lessons of world-renowned programmers` / `namesake exemplar` instances in AGENTS.md (lines 150, 173) are intentional — they live inside Bad-example / AI-vocabulary-to-avoid sections, used as self-referential demonstration. Keep.
- [x] `in lockstep` (AGENTS.md line 298, CONTRIBUTE.md line 313) preserved — "in lockstep" describes a real synchronization invariant for version bumps, not decorative phrasing.
- [x] `load-bearing` (CONTRIBUTE.md line 196) preserved — precise term for "code that other parts depend on", not decorative.
- [x] `npm test` passes (smoke check on AGENTS.md byte size still OK)

## Verification

- `rg 'hard-won lessons|world-renowned|behavior-shaping|namesake exemplar' AGENTS.md CONTRIBUTE.md` returns 0 hits
- AGENTS.md changelog example reads consistently with the new opener (no contradiction)
- `npm test` exits 0
