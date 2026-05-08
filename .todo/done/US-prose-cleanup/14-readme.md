# 14-readme

## Context

Highest-visibility surface, edited last so the voice is settled upstream.
Tagline ("Your agent, on the shoulders of giants.") is borderline marketing.
Section header `### Giants` inherits the same metaphor. Rule-of-three +
"and others" pattern in the "What this is" paragraph. "When it fires"
column header.

## Related Files
- `README.md`

## Dependencies
- All prior tasks (voice anchor)

## Acceptance Criteria

- [x] **Tagline decision: keep "on the shoulders of giants"** — recognized phrase, fits the project's stated intent of crediting source authors. Pairs intentionally with `### Giants` section header. Decision documented.
- [x] `### Giants` section header preserved (matches tagline decision).
- [x] "What this is" paragraph: replaced "like ... and others" with named-fourth example ("Nygard on resilience patterns, and others"). Tighter, less padded.
- [x] "outlast specific frameworks or stacks" → "durable". Cut rule-of-two padding.
- [x] "When it fires" column header → "When it applies"
- [x] "the bootstrap" / "primes the agent" → "entry skill that loads the trigger map"
- [x] No `hard-won lessons of world-renowned programmers` (was already absent)
- [x] `npm test` passes

## Verification

- README reads on its own as plain professional copy — no marketing register, no rule-of-three stacking
- `npm test` exits 0
