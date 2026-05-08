# 12-using-97

## Context

The bootstrap skill. Care needed: `scripts/test-trigger-force.mjs` checks
the entry skill still has strong imperative wording. "Simpler" must not
become "softer" — keep the action-target trigger force intact.

Specific lines to address: rule 7 (67-word sentence with rule-of-three
inside a list of four), "primes the agent" jargon in the table header
context, "fires" verb usage, "action-target prompts" coined term,
"behavior-shaping" if used.

## Related Files
- `skills/using-97/SKILL.md`
- `scripts/test-trigger-force.mjs` (read; do not modify)

## Dependencies
- Tasks 1-11 (skill prose voice settled)

## Acceptance Criteria

- [x] **Agent-first cuts**: Overview "hard-won lessons of world-renowned programmers" → "established programming practice" (drops promotional register; this skill loads into every agent context).
- [x] **Precedence rule (rule 2) decoupled from "superpowers" brand:** done in earlier turn.
- [x] **Rule 4 ("scan for landmines") rewritten** as "scan for unsafe code adjacent to your edit" — done in earlier turn.
- [x] **Rule 5 ("defer to `superpowers/systematic-debugging`")** generalized to "defer to a systematic-debugging skill if one is available" — done in earlier turn.
- [x] **Rule 7 (the production-shaped guidance paragraph) shortened**: 67-word sentence trimmed; dropped inner parenthetical "(timeouts, circuit breakers, bulkheads)" (those examples live in `error-and-correctness-traps`); changed "fires hardest" → "matters most"; cut "debugging endpoints" from MVP list (covered by "internal dev tools").
- [x] Trigger-force imperative language preserved (the "MUST invoke matching skills BEFORE any response" rule unchanged).
- [x] `npm test` passes
- [ ] "behavior-shaping skills" if present → "skills" or "skills that change how the agent works"
- [ ] "hard-won lessons of world-renowned programmers" line in Overview → plain phrasing
- [ ] "primes the agent" / "trigger map" reviewed — keep "trigger map" (it's a section header that's also referenced elsewhere); reword running prose
- [ ] Trigger-force imperative language preserved (the rule "you MUST invoke matching skills BEFORE any response" stays exactly as-is)
- [ ] `npm test` passes (this includes the trigger-force test if it exists)
- [ ] Spot-check: `node scripts/test-trigger-force.mjs` if it exists and is invokable

## Verification

- `rg 'behavior-shaping|hard-won lessons' skills/using-97/SKILL.md` returns 0 hits
- The "MUST invoke" / trigger-force language is unchanged (visual diff)
- `npm test` exits 0
