# enrich-before-you-refactor-fowler

## Context

Fowler's *Refactoring* (2nd ed., 2018) is the **best fit in the canon**
for this skill. Its code-smell catalog is already trigger-shaped —
each smell is a named pattern an agent can recognize before a refactor
and a corresponding refactoring is the response. The current skill
focuses on *whether* and *when* to refactor; Fowler adds *what to look
for* and *what to do*.

**Value delivered:** sharpens the "I see X → do Y" axis of the skill
with the canonical reference for refactoring practice.

## Related Files

- `skills/before-you-refactor/SKILL.md`
- `skills/before-you-refactor/principles.md`
- `scripts/lint-skills.mjs` — `SKILL_RULES` entry (principle count)
- `CHANGELOG.md` — `### Changed` entry under `[Unreleased]`
- `CONTENT-LICENSE.md` — per-source attribution line for Fowler

## Dependencies

- `0a-citation-scheme-spec.md` in `done/` — Fowler IDs (e.g.
  `Fowler/LongMethod`) follow the format defined in
  `CITATION-SCHEME.md`.
- `0b-citation-scheme-migration.md` in `done/` — `principles.md` is
  already in the new heading format; this task appends new entries.

## Acceptance Criteria

- [ ] Add **3–6** principles to `principles.md` distilled from Fowler's
      *Refactoring* smell catalog. Suggested set (pick 4–5; do not
      include all):
  - **Long Method / Long Function** → extract function
  - **Large Class** → extract class / extract subclass
  - **Duplicated Code** → extract function or pull up
  - **Feature Envy** — a method uses another object's data more than
    its own → move method
  - **Data Clumps** — same group of fields appearing together → extract
    class or introduce parameter object
  - **Shotgun Surgery** — one change forces edits across many places →
    move related behavior together
  - **Divergent Change** — one class changes for many unrelated reasons
    → split responsibilities
  - **Primitive Obsession** — primitives where a domain type belongs →
    introduce value object (overlaps with `domain-modeling`; cite the
    overlap)
- [ ] Each principle in `principles.md` is structured as: name → smell
      description (1–2 lines) → response refactoring → "when not to"
      caveat. Cite source: *Refactoring*, Fowler, ch. 3 (smells).
- [ ] At least **2** of the added principles are surfaced in `SKILL.md`
      — either as a Red Flags row ("This change feels like a refactor
      because…") or a numbered checklist item before the refactor
      decision.
- [ ] No principle is added that is not trigger-actionable. Smells the
      agent cannot recognize from a diff or a function signature do not
      belong here.
- [ ] `scripts/lint-skills.mjs` `SKILL_RULES.before-you-refactor`
      `principles` count updated.
- [ ] `principles.md` cites Fowler with publisher (Addison-Wesley) and
      edition (2nd ed., 2018) at least once.
- [ ] `CHANGELOG.md` `### Changed` entry written.
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:**
- Read the enriched `SKILL.md`. Each surfaced Fowler principle changes
  what the agent does in a specific moment (sees long method → extracts;
  sees data clump → introduces parameter object). If a principle is
  there but does not change behavior, drop it.
- Spot-check density against `error-and-correctness-traps` — concrete
  examples, not abstract category names.

## Notes

- **Do not** copy Fowler's smell list wholesale. The skill stays surgical.
  Pick the 4–5 highest-leverage smells for agent work; the rest live in
  `principles.md` as pure reference at most.
- **Voice:** Fowler's prose is calm and pedagogical. Distill into the
  imperative 97 voice without quoting.
- **Overlap with `writing-clean-code`:** several smells (Long Method,
  Duplicated Code) are also clean-code concerns. The boundary: these
  fire **before a refactor**, not while writing fresh code. Note the
  precedence in `SKILL.md` if it shifts.
- **Overlap with `domain-modeling`:** Primitive Obsession is shared.
  Cite the overlap in `principles.md`; do not duplicate the principle
  fully — pick which skill owns the trigger and cross-reference.
