# skill-error-and-correctness-traps

## Context

Build the `error-and-correctness-traps` themed skill. Triggers in the technical danger zones: error handling, numerical code, concurrency, IPC, logging, and singletons. These are the places where "looks fine to the agent" routinely produces production bugs.

**Value delivered**: Agents pause and apply specific principles in the exact contexts where naive code is most dangerous.

**Use `3-skill-before-you-refactor` as the template.**

## Related Files

- `skills/before-you-refactor/SKILL.md` — proven template
- `.todo/US-97-mvp/main.md` — cross-cutting rules

## Dependencies

- `3-skill-before-you-refactor.md`

## Source principles to distill

Per `main.md` source-material policy: GitHub mirror first, Medium as reading aid only.

1. **#21 Distinguish Business Exceptions from Technical** — Dan Bergh Johnsson
2. **#26 Don't Ignore That Error!** — Pete Goodliffe
3. **#29 Don't Rely on "Magic Happens Here"** — Alan Griffiths
4. **#33 Floating-Point Numbers Aren't Real** — Chuck Allison
5. **#41 Interprocess Communication Affects Application Response Time** — Randy Stafford
6. **#46 Know Your Limits** — Greg Colvin
7. **#57 Message Passing Leads to Better Scalability in Parallel Systems** — Russel Winder
8. **#73 Resist the Temptation of the Singleton** — Sam Saariste
9. **#89 Use the Right Algorithm and Data Structure** — Jan Christiaan "JC" van Winkel

## Acceptance Criteria

- [ ] All 9 sources fetched from GitHub mirror first; provenance recorded in `principles.md`
- [ ] `skills/error-and-correctness-traps/SKILL.md` exists with frontmatter:
  - [ ] `name: error-and-correctness-traps`
  - [ ] **Trigger** (situation-based, NOT topic-based — list of concrete situations the agent can pattern-match): `description: Use when adding error handling to a call that can fail, comparing or calculating with floating-point numbers, writing concurrent or parallel code, calling a remote process or another service, adding a singleton or globally-shared mutable state, choosing a data structure for a hot path, or adding/changing log statements`
- [ ] Body matches template structure
- [ ] Body has clearly-labeled sub-sections per trap domain so the agent can jump straight to the relevant principle: **Errors** (#21, #26, #29) / **Numerics** (#33) / **Concurrency & IPC** (#41, #57) / **Limits & Performance** (#46, #89) / **Globals & Singletons** (#73)
- [ ] **Non-triggers** subsection lists ≥4 prompts that should NOT fire this skill:
  - "rename a local variable" → no
  - "add a docstring to this function" → no
  - "fix the typo in this comment" → no
  - "format this file" → no
- [ ] `principles.md` has long-form distillations in your own words (no verbatim quotes >25 words), with author + GitHub mirror link + Medium link + source provenance
- [ ] `SKILL.md` under 250 lines (broad scope — slightly larger budget)
- [ ] `scripts/lint-skills.mjs` passes for this skill
- [ ] **Concrete-example requirement**: each sub-section includes at least one short concrete example (e.g., `0.1 + 0.2 != 0.3` for Numerics; a retry-without-backoff anti-pattern for IPC) — memorable concrete examples beat abstract advice for behavior change

## Verification

- **Automated**:
  1. `npm run lint` exits 0
- **Ad-hoc** (multiple positive + negative trigger tests):
  1. Positive: "Add error handling to this HTTP call" → expect skill invocation, expect business-vs-technical exception framing per #21
  2. Positive: "Compare these two floats for equality" → expect skill invocation citing #33
  3. Positive: "Add a singleton for the config" → expect skill invocation pushing back per #73
  4. Positive: "Add retry logic for this flaky API" → expect skill invocation (concurrency + IPC + error handling — all three sub-domains)
  5. **Negative**: "Rename this variable from `x` to `count`" → must NOT invoke
  6. **Negative**: "Add a docstring to this function" → must NOT invoke

## Notes

- This skill is broader than the others (multiple distinct trap domains), but the situation-based trigger above lists concrete pattern-matchable situations — the agent decides invocation from the description string, not from sub-headers, so the trigger string itself must be specific.
- For #33 (floating point): include the punchy concrete example (`0.1 + 0.2 != 0.3`). Memorable concrete examples beat abstract advice for behavior change.
- **Open question for v0.2**: if positive/negative trigger tests show under- or over-firing despite the situation-based trigger, split into `error-handling` (#21, #26, #29) and `correctness-traps` (#33, #41, #46, #57, #73, #89) in v0.2. For v0.1.0, ship as one and accept the trade-off.
