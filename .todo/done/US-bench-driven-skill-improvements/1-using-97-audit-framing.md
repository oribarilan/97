# 1-using-97-audit-framing

## Context

`using-97/SKILL.md` is the bootstrap loaded on session start
in every harness (Claude Code, Copilot CLI, OpenCode). It is
54 lines, every line load-bearing, injected into every coding
session for every task.

The bench measured a large structural effect from
**prompt-side** framing ("Step 1: scan file for traps. Step 2:
implement.") on latent-trap tasks: 0/10 → 80–90% pass on
bootstrap-following and bootstrap-ignoring models alike, with
and without skill invocation. Council Round 1 read this as
"embed audit framing in the bootstrap." Council Round 2
stress-tested that and pushed back hard:

- The bench's lift is from **in-context recency near the
  action** (the framing arrives in the same prompt as the
  task). A bootstrap-side change competes with thousands of
  intervening tokens by the time the agent is at "edit this
  function." It cannot reproduce the prompt-side lift on
  bootstrap-ignoring models *by construction* — those models
  ignore bootstrap content and only respond to in-context
  prompt framing.
- Adding a new paragraph after the Trigger Map disrupts the
  bootstrap's spine (Overview → CRITICAL → Triggers →
  Priority → Red Flags) and risks bloating a file whose
  brevity is doing real saliency work.
- Two distinct failure modes hide inside the bench scores:
  *biting failure* (skill loaded, didn't bite on found code —
  addressed by task 2's reframe of `security-and-trust-
  boundaries`) and *firing failure* (skill never loaded
  because the user prompt didn't match its trigger). No
  amount of rewording inside an unloaded skill helps the
  firing-failure case; this is the only thing in the US that
  addresses it on bootstrap-followers.

The minimum viable form: extend Priority rule 4 by one clause.
Rule 4 currently reads *"Before editing a file you haven't
read this session, read it first. No skill load — just the
cheap reminder. Editing without reading is the most common
avoidable failure mode."* The amendment piggy-backs on the
existing read-before-edit framing rather than introducing a
new "pre-action scan" concept.

**Value delivered:** on bootstrap-following models, when the
agent reads a file and notices a trap-shaped landmine
adjacent to the change the user requested, the agent
re-triggers from file contents — invoking
`security-and-trust-boundaries` on a found credential, or
`error-and-correctness-traps` on a found TOCTOU pattern, even
when the user prompt didn't keyword-match those skills. This
is the firing-failure patch the reframe in task 2 cannot
reach.

## Related Files

- `skills/using-97/SKILL.md` — extend Priority rule 4 at
  line 37 by one clause. Do not add a new paragraph. Do not
  edit the Trigger Map, the Red Flags table, or any other
  rule.
- `skills/using-97/principles.md` — no edit. The amendment is
  operational guidance, not a cited principle from a
  97-Things essay.

## Dependencies

- Tasks 1 and 2 should land **in the same PR**. The PR
  description and CHANGELOG entry frame the three edits as a
  single bench-driven improvement set.
- Per `AGENTS.md` rule 4, `using-97/SKILL.md` is in the
  forbidden-in-parallel-work list. This task runs last,
  after tasks 1 and 2 are at least staged.

## Acceptance Criteria

- [x] Priority rule 4 in `using-97/SKILL.md` (currently line
  37, single sentence) is extended by **one clause**.
  Likely shape: *"Before editing a file you haven't read
  this session, read it first — and if you spot trap-shaped
  code adjacent to your edit (hardcoded credentials, raw
  SQL string-build, swallowed exceptions, TOCTOU patterns),
  the relevant skill applies even if the user's prompt
  didn't trigger it. No skill load for the read itself —
  just the cheap reminder. Editing without reading is the
  most common avoidable failure mode."* Wording is open to
  the implementer; the constraint is **one clause, not a
  paragraph**.
- [x] The four landmine categories named in the amendment
  (hardcoded credentials, raw SQL string-build, swallowed
  exceptions, TOCTOU patterns) **match** the canonical
  category list promoted by tasks 1 and 2. Drift between
  category lists is the cross-skill consistency risk Council
  Round 2 flagged most loudly. If task 1 promotes a slightly
  different ordering or naming, this amendment matches.
- [x] The amendment names this as a *re-trigger from file
  contents*, not as a separate "audit" or "scan" workflow.
  No new tool calls, no new skill invocation pattern beyond
  what Priority rule 4 already implies.
- [x] The Trigger Map table is unchanged.
- [x] The Red Flags table is unchanged.
- [x] No new rule 8 added.
- [x] No new section added between the Trigger Map and the
  Priority list, or between the Priority list and the Red
  Flags table.
- [x] Voice check: the amendment reads as the same terse
  imperative voice as the rest of the rule. Concrete grep
  across the diff for `stands as`, `serves as`, `embraces`,
  `embodies`, `pivotal`, `landscape`, `comprehensive`,
  `audit framing` (the bench-coined jargon — don't use it),
  `pre-action scan` (rejected by Council Round 2), and
  trailing -ing clauses returns no matches.
- [x] No `97/N` cite added. The amendment is operational
  guidance, not a distilled principle.
- [x] `using-97/SKILL.md` line count under cap (per
  `scripts/lint-skills.mjs`). The current file is 54 lines;
  the amendment should add no more than 2–3 lines net. If
  the cap is approached, do not raise it; trim a
  lower-value sentence elsewhere or accept a tighter
  amendment.
- [x] `npm test` passes after this and tasks 1, 2 are
  integrated.

## Verification

**Automated:** `npm test`.

**Ad-hoc:** read the extended rule 4 aloud. It should sound
like one sentence with a clarifying clause, not two
instructions stapled together. Test: a junior engineer
reading the rule should know what to do if they open `db.py`
to add a parameter and notice `PASSWORD = "hunter2"` two
lines above the function — they should re-route to the
security skill, not silently proceed.

**Bench-side validation (in `97-bench`, separate work):** run
`discipline-traps-v052` against the bumped plugin version.
Expected lift on bootstrap-followers (haiku-4.5) for
hardcoded-credential on natural framing: 4–6/10. Expected
lift on bootstrap-ignoring models (gpt-5-mini): 1–2/10
(bootstrap edits don't reach them; this is expected, not a
fail). See `main.md` "Bench prediction" table for the full
grid and revisit conditions.

## Notes

- The Council Round 1 plan to add a new paragraph after the
  Trigger Map was rejected in Round 2 by 4/5 councillors on
  bloat / spine-disruption grounds. The one-clause amendment
  preserves the bootstrap's saliency battle and addresses the
  same firing-failure mechanism with a much smaller surface
  area.
- The choice to extend rule 4 specifically (rather than rule
  7's calibration paragraph or a new rule 8) is deliberate:
  rule 4 is the only rule in the bootstrap that already
  speaks to file-reading-before-editing, and the amendment is
  a natural elaboration of that idea, not a new concept.
- The four named landmine categories are illustrative, not
  exhaustive. The themed skills carry the full lists;
  the bootstrap delegates to them. If a fifth category
  emerges from a future bench (e.g., unbounded
  `pickle.loads` becoming a recurrent trap), it goes in
  `security-and-trust-boundaries`'s reframe and the
  bootstrap clause's parenthetical example list, not as a
  trigger-map row.
- This task does **not** introduce a new "scan-before-edit"
  workflow as its own concept. The contrarian's argument
  for a new skill (or for widening
  `before-you-refactor`'s trigger to "modifying existing
  code") is preserved as the deferred decision in
  `main.md`'s "New-skill decision" section, gated on
  `discipline-traps-v052` results.

## Outcome

Shipped in PR #1 (merged 2026-05-08, commit `94dd5ae`). All
acceptance criteria met as written.

**What landed:** Priority rule 4 in `skills/using-97/SKILL.md`
extended by one clause naming four illustrative landmines
(hardcoded credentials, string-built SQL/shell, unsafe
deserialization on untrusted input, swallowed exceptions) plus
the surface-don't-rewrite carve-out. Bootstrap line count
unchanged (54).

**Deviation from spec:** task spec named four illustrative
categories matching an early canonical list of four. The
canonical list in skill 2 grew to six during execution
(added TOCTOU patterns and mutable defaults per user-confirmed
choice). The bootstrap clause keeps the same four — illustrative
subset is fine; full list lives in
`pre-commit-self-review` step 1.

**Verification:** `npm test` green (lint + format + smoke).
Bench-side validation deferred to next `discipline-traps-v052`
run in sibling `97-bench` repo, per main.md prediction table.
