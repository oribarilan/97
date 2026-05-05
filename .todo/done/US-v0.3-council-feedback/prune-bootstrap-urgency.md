# prune-bootstrap-urgency

**Council confidence:** [Consensus] — all 5 councillors flagged
`<EXTREMELY_IMPORTANT>`, the 8-row Red Flags table, and "1% chance" as
overkill / a smell / urgency theater.

## Context

`skills/using-97/SKILL.md` and the two adapter wrappers
(`.opencode/plugins/97.js:99-107`, `hooks/session-start:26`) lean hard on
shouted-urgency prompting:

- `<EXTREMELY_IMPORTANT>` wrapper around the entire bootstrap
- "If even a 1% chance the trigger applies, invoke the skill" (line 28)
- 8 Red Flags rows (lines 41-54), each rationalizing why an agent might
  skip and resolving with "invoke."

Mature instruction-tuned models discount this register; it pattern-matches
to low-quality jailbreak/coercive prompting. When you have to write 8
distinct rationalization-defeats, the underlying trigger map probably
isn't crisp enough — and shouting won't fix that.

**Value delivered:** lower bootstrap token cost per session; clearer
signal-to-noise; honest framing that doesn't degrade the rest of the
plugin's prompts by association.

## Related Files

- `skills/using-97/SKILL.md` — main edit
- `.opencode/plugins/97.js:99-107` — wrapper
- `hooks/session-start:26` (or `hooks/session-start.mjs` if
  `node-rewrite-session-start.md` has landed) — wrapper

## Dependencies

- None strictly. Coordinates with `node-rewrite-session-start.md` — if
  that task hasn't landed, edit the bash wrapper here.

## Acceptance Criteria

- [x] `<EXTREMELY_IMPORTANT>` wrapper removed from both adapters. Replace
      with a non-shouty header — e.g., a plain `## 97 — bootstrap` or
      `<bootstrap>` tag — at the author's discretion.
- [x] Bootstrap "Red Flags" table reduced from 8 rows to **at most 3**.
      Keep the highest-signal ones; specifically retain:
  - "The trigger almost matches but not quite." (almost-matches rationalization)
  - "Two skills could fit; I'll just pick one." (precedence reminder)
  - One more at author's choice.
- [x] "If even a 1% chance the trigger applies, invoke the skill"
      (`using-97/SKILL.md:28`) replaced with calmer guidance:
      "When the trigger description matches your current action, invoke.
      When in doubt, invoke."
- [x] Total `using-97/SKILL.md` line count drops by at least 30% from
      its current 58 lines (target ≤ 40 lines).
- [x] **Wrapper text shrinks alongside the body.** The wrapper added by
      both adapters (`.opencode/plugins/97.js:99-107` and the bash or
      Node hook) currently contributes ~6-8 lines of fixed-cost
      preamble (`<EXTREMELY_IMPORTANT>`, the "ALREADY LOADED" warning,
      tool-mapping appendix). Wrapper preamble drops by at least 4
      lines per adapter. Measure as: total injected bootstrap chars
      per harness drops ≥ 30% from current.
- [x] The OpenCode plugin's substring idempotency check
      (`.opencode/plugins/97.js:128`) is updated to the new marker
      substring (it currently keys on `EXTREMELY_IMPORTANT`). Pick a
      stable replacement marker — suggested: a substring derived from
      the bootstrap content itself such as the "Trigger Map" heading
      or the `name: using-97` frontmatter value. Whatever is chosen,
      it must be in the emitted output of **both** adapters.
- [x] `npm test` (lint + smoke) passes — note the lint budget for
      `using-97` is 100 lines, so reductions are well within it.

## Verification

**Automated:**
- `npm test` for structural lint
- `scripts/smoke-load.mjs` — update the idempotency marker assertion if
  needed

**Ad-hoc:**
- `wc -l skills/using-97/SKILL.md` shows ≤ 40 lines
- Total injected bootstrap chars per harness (measured by capturing
  hook output / OpenCode transform output) drops ≥ 30%
- Manual: open a fresh OpenCode session, ask "what is 97?" — verify
  the agent still has the trigger map in context and names ≥ 5 of the
  9 themed skills

## Notes

- This task is the single highest-leverage content edit per councillor
  consensus. It's also the one most likely to *appear* trivial and get
  reverted later by a contributor who feels the urgency was load-bearing.
  Document the rationale in `CHANGELOG.md` `### Changed` so the choice is
  legible.
- If a future eval shows invocation rate dropped meaningfully after this
  change, that's evidence the trigger taxonomy is the real problem and
  shouting was masking it. Re-open and address triggers, don't re-add
  the urgency theater.
