# decide-lint-budget-policy

**Council confidence:** [Split] — 3 councillors said the lint line
budget is over-constrained on its current axis (loosen the maximum); 1
(contrarian) said replace the maximum with a *minimum* density check;
1 (claude) was neutral but observed the budget pushes some skills
toward abstraction.

## Context

`scripts/lint-skills.mjs:27-74` enforces per-skill maximum line budgets
(typically 200-250 lines for `SKILL.md`). The intent: prevent skill
files from sprawling into unreadable size.

The councillor critiques:

1. **Loosen the max (3 councillors).** Some skills genuinely need more
   lines to be clear. `error-and-correctness-traps` at 130 is fine, but
   if a security skill needs 280 lines with worked examples to match
   its density, capping at 250 forces abstraction. Particularly relevant
   if `add-security-traps-skill.md` ships.
2. **Replace max with density minimum (contrarian).** Add lints like
   "Red Flags table has ≥6 rows," "≥1 concrete code-style identifier
   per checklist item," "every principle number cited in `SKILL.md`
   appears in the principles table." This shifts the linter from
   policing length to policing quality.
3. **Status quo (claude implicitly).** The current lint is fine if
   authors push back when a skill needs more room.

**Value delivered:** the linter enforces what actually matters
(density, citation hygiene) rather than a proxy (line count) that may
work against quality.

## Related Files

- `scripts/lint-skills.mjs` — main edit
- All `skills/*/SKILL.md` — affected by whatever rules ship
- `AGENTS.md` rule about lint discipline

## Dependencies

- Should land **before** large content tasks (`add-security-traps-skill.md`,
  `tighten-writing-clean-code.md`) so authors know the rules.

## Acceptance Criteria

- [x] A decision is made and documented in this task file. Acceptable
      outcomes:
  - **Loosen (Option 1):** raise the per-skill max to 300 across the
    board, OR raise specific skills' max (e.g., the new security skill
    gets 300, others stay).
  - **Replace with density (Option 2):** add at least 2 minimum-density
    lints (Red Flags row count, principle-citation back-reference) and
    raise the line max materially or remove it.
  - **Hybrid (Option 3):** keep maxes but bump them, *and* add at
    least one density lint.
  - **Status quo (Option 4):** keep current rules unchanged; rationale
    and revisit trigger are documented in `AGENTS.md` "Adding a new
    skill" section (or a new "Skill lint policy" subsection if the
    existing one doesn't fit).
- [ ] If new lints are added (Options 2 or 3), at minimum the
      following two density lints are implemented:
  - [ ] **Red Flags row count:** every skill's `Red Flags` table has
        ≥ 6 data rows (excluding the header).
  - [ ] **Principle citation back-reference:** every `#NN` referenced
        in `SKILL.md` (in decisions, Red Flags, or anywhere else)
        appears in the "Principles in this skill" attribution table
        at the bottom of the same file. Catches the silent failure
        where a principle is cited mid-file but not attributed.
  - [ ] Each new lint has a clear failure message identifying the file
        and the failing rule.
  - [ ] Each new lint is testable: a deliberate violation in a skill
        causes `npm test` to fail with the expected message.
  - [ ] The rule is documented in `AGENTS.md` "Adding a new skill"
        section.
- [x] If max is raised (Options 1 or 3):
  - [x] New maxes are written to `SKILL_RULES` in `lint-skills.mjs`
  - [x] No skill is *required* to use the new headroom — existing
        compact skills stay compact.
- [x] `npm test` passes against current skills (no skill is
      retroactively in violation).
- [x] `CHANGELOG.md` updated.

## Verification

**Automated:**
- `npm test` exercises the new (or unchanged) lint
- Negative test: deliberately add a violation, confirm lint fails;
  revert.

**Ad-hoc:**
- If density lints added: read the failure message a contributor
  would see. Is it clear what to fix?

## Notes

- **Ordering:** if this task hasn't shipped before
  `add-security-traps-skill.md`, the security skill author will hit
  the existing 250 cap and have to either compress or temporarily bump.
  Either is fine; just don't let it block.
- The `principles.md`-required-numbers lint (`lint-skills.mjs:144-156`)
  is a separate concern and should be left alone unless the decision
  here explicitly addresses it.
- **Minimum-density lints are mechanically easy** — `≥6 rows in Red
  Flags table`, `every #NN cited in SKILL.md must appear in principles
  table` — and would be high-leverage. If choosing Option 4 (status
  quo), at minimum keep this paragraph in mind for v0.4.

## Decision

**Outcome: hold the line.** Existing per-skill `maxLines` caps stay
at 200/250 (matching the v0.2 status quo). The new
`security-and-trust-boundaries` skill gets `maxLines: 250` — same as
other content skills — with `error-and-correctness-traps` density
(~7 trap domains in ~130 lines) as the explicit target.

**Rationale (revised after self-review):**

A first pass closed this decision as Option 1 ("loosen blanket to
300"). On review with the maintainer, that was wrong. The actual
situation:

- The cap was blocking exactly **one** thing: the projected line
  count of the new security skill (280–320 in the original task
  spec). That projection was a guess, padded for safety.
- Every existing content skill sits 30–50% **below** its cap. None
  was being squeezed. v0.3 is *reducing* two more
  (`tighten-writing-clean-code`, `prune-working-with-users-and-team`).
- A blanket bump to 300 sends the wrong signal. The cap is a forcing
  function for editorial density; loosening it without a binding
  pressure rewards bloat against the v0.3 theme of *remove more
  than add*.
- `error-and-correctness-traps` (the gold-standard skill, the
  template for `add-security-traps-skill`) covers ~7 trap domains
  with concrete examples in **130 lines**. Holding security to that
  density target lands the skill in ~150–200 lines, well under 250.

**If at implementation time the security skill genuinely cannot fit
in 250 after a real density pass**, bump just that one skill's cap
(to 280 or 300), document the reason in the changelog, and treat the
bump as honest signal worth recording — not noise to disguise. A
one-skill bump with a reason is better than a blanket bump that hides
the question.

**Density lints** (Red Flags ≥6 rows, principle citation
back-reference) remain deferred to v0.4 or later. They are still good
ideas. Not now.

**Files changed in this task:**

- `scripts/lint-skills.mjs` — caps unchanged; comment block added
  documenting the budget philosophy and the "match
  `error-and-correctness-traps` density first" rule for new skills.
