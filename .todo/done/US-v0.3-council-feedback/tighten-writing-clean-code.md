# tighten-writing-clean-code

**Council confidence:** [Majority] — 4/5 councillors flagged this skill
as the weakest of the flagship skills (most-fired, largest, most
abstract). One councillor (claude) graded it as "strong overall" with
specific weaknesses; the other four were more critical.

## Context

`skills/writing-clean-code/SKILL.md` is 142 lines / 12 principles. It is
the most-fired skill in the bundle and the most likely to be loaded into
context for any non-trivial edit. Some decisions are concrete and
checkable (#94 "use domain types over `int`", #75 "delete to debug",
#76 "single responsibility"). Others are taste claims dressed as
principles (#5 "default to simplest thing that works", #13 "treat layout
as tool for the reader", #62 "names that let the code speak", #93 "write
as if you'll support it for years"). The agent will dutifully agree and
move on, no behavior change.

The two contrasts the council pointed at:

- **`error-and-correctness-traps`** is 130 lines and packed: every
  decision has a concrete trap and a concrete fix. That density is the
  target.
- **`writing-clean-code`'s** "What done looks like" checkboxes
  (lines 113-121) are mostly self-graded vibes. "You tried deleting at
  least one line you initially wrote" — agent will tick yes regardless.

**Value delivered:** the most-fired skill becomes the most-rigorous, not
the most-philosophical. Smaller token footprint per fire, higher chance
of actually changing behavior.

## Related Files

- `skills/writing-clean-code/SKILL.md` — main edit
- `skills/writing-clean-code/principles.md` — destination for demoted
  principles
- `scripts/lint-skills.mjs:34-38` — `principles` array for this skill
- `README.md:99` — "What's inside" row may need refresh

## Dependencies

- Coordinates with `drop-once-per-file-rule.md` (rate limit removal) and
  `prune-done-checkboxes.md` (sweep across skills). All three are
  improvements to the same file; can land in one PR.

## Acceptance Criteria

- [x] `SKILL.md` line count drops to ≤ 120 lines (from 142). Stretch
      goal ≤ 100 if achievable without sacrificing density;
      `error-and-correctness-traps` is 130 lines for comparable density,
      so do not chase a smaller number than the template.
- [x] Decisions reduced from 12 to **≤ 8**. The author chooses which
      decisions to demote based on the agent-actionability rubric
      below. Recommended cuts (Notes section explains rationale; not
      binding on the author):
  - #62 ("Only the Code Tells the Truth") — taste-claim
  - #93 ("Write Code As If You Had to Support It…") — motivational
  - One of #30 (DRY) or #91 (WET dilutes performance) — same idea,
    two angles. Keep one with a one-line nod to the other.
- [x] **Agent-actionability rubric** for retained decisions: each
      decision must be paired with at least one *check* that a
      reviewer (human or agent) could apply by reading the diff.
      The check can be qualitative ("comment narrates what the code
      does → rename or extract") or quantitative ("≥ 2 functions
      with the same business rule → extract or document"). **Do not
      invent arbitrary numeric thresholds** (e.g., "function ≤ 30
      lines") without a named justification — see Notes.
- [x] No retained decision is purely a taste claim ("default to the
      simplest thing that works") without an attached check.
- [x] "What done looks like" checkbox section updated per
      `prune-done-checkboxes.md` rules — keep only checkable items
      (or remove section entirely if that task lands first).
- [x] Red Flags table retained with at least 6 high-signal rows. Cut
      any rows whose "Reality" column is taste-restating-the-decision.
- [x] `scripts/lint-skills.mjs` `principles` array reduced to match
      what's actually cited in the new `SKILL.md`. Demoted principles
      remain in `principles.md` (lint enforcement on principles.md
      stays).
- [x] `npm test` passes.

## Verification

**Automated:**
- `npm test` — lint enforces principle-citation consistency

**Ad-hoc:**
- Read the new `SKILL.md` end-to-end. Every decision should have a
  rule that an agent can either satisfy or fail concretely. Apply this
  test: "could a code reviewer point at a specific line and say 'this
  violates decision N'?" If not, the decision is too abstract.
- Compare side-by-side with `error-and-correctness-traps/SKILL.md`.
  Density should look comparable.

## Notes

- **Numeric thresholds:** the AC explicitly forbids inventing
  arbitrary numbers without justification. Acceptable forms include
  "function length: keep < page-of-screen unless extracting splits a
  cohesive operation" (qualitative) or "≤ N parameters where N is
  the project's existing convention as documented in <link>"
  (citation-backed). Unacceptable: "≤ 30 lines" with no rationale.
  When in doubt, prefer qualitative checks.
- **Recommended cuts (rationale, not binding):**
  - #62 — operationalizes as "use good names," redundant with #76
    and the layout/comment material
  - #93 — emotional framing ("imagine you'll support this for years")
    doesn't translate to agent action
  - #30/#91 overlap — DRY (#30) is the headline; #91's perf angle
    fits as a one-line aside in the DRY decision
- This task touches the most-loaded skill. Be conservative on cuts:
  if a principle is genuinely doing work in a real edit, keep it. The
  point isn't aggressive pruning, it's higher density per line.
- Voice rules from AGENTS.md and the humanizer skill apply.
