# 3-name-kiss-and-yagni-in-clean-code

## Context

`writing-clean-code` already carries the substance of KISS (decision 1
"simplicity by removing", `97/75`, plus `97/5` and `97/39` in the
principles roster) and YAGNI (the "Long-term mindset vs YAGNI"
subsection plus principle commentary on `97/39`). Neither acronym
appears in **`SKILL.md` Red Flags**, and the acronym **KISS does not
appear anywhere** in the repo.

This is a discoverability fix, not a content addition. Users searching
for "KISS" or "YAGNI" should land on the existing distilled principles
instead of bouncing.

**Value delivered:** the search keys "KISS" and "YAGNI" route to the
right principles; the agent can use the acronyms when explaining a
review comment without referencing principles that don't name them.

## Related Files

- `skills/writing-clean-code/SKILL.md` — Red Flags table (one row
  each for KISS and YAGNI, mapped to existing principle citations)
- `skills/writing-clean-code/principles.md` — one parenthetical inline
  mention per acronym in the existing decision 1 / "Long-term mindset"
  passages

## Dependencies

- None. Independent of tasks 1, 2. Can run in parallel.

## Acceptance Criteria

- [ ] `writing-clean-code/SKILL.md` Red Flags table has a KISS row
      whose "Thought" reflects a real over-engineering pattern (e.g.,
      "I'll add this configuration knob in case someone wants to
      override it") and "Reality" cites `97/75` (and optionally
      `97/39`). The "Thought" column does not contain the acronym
      KISS itself (per `main.md` forbidden list); the acronym appears
      only in the "Reality" column as a search anchor.
- [ ] `writing-clean-code/SKILL.md` Red Flags table has a YAGNI row
      with the canonical thought ("I'll add this hook now in case we
      need it later") and a citation to `97/39` ("Improve Code by
      Removing It") — the closest 97-Things match. The "Thought"
      column does not contain the acronym YAGNI.
- [ ] **No new decisions** added to `SKILL.md`; KISS and YAGNI are
      surfaced as Red Flags only. The existing decision 1 stays as-is.
- [ ] `principles.md` mentions the acronym **KISS** **once**, as an
      inline parenthetical next to the existing simplicity-cluster
      prose (e.g., "(this is the substance of what people call KISS)").
      The acronym **YAGNI** stays where it already is or gets at most
      one additional inline parenthetical mention.
- [ ] **No dictionary-style expansions.** `principles.md` does not
      contain "KISS — Keep It Simple, Stupid" or "YAGNI — You Aren't
      Gonna Need It" as definition lines (per `main.md` forbidden
      list). The principle text already explains the substance; the
      acronym is a search anchor, not a glossary entry.
- [ ] Voice check: no rule-of-three padding around the acronyms, no
      "embodies", no "epitomizes", no "well-known acronyms".
- [ ] **No `SKILL_RULES` line-cap changes.** `writing-clean-code/SKILL.md`
      is at 107 lines; with two new Red Flag rows it should sit
      comfortably under any reasonable cap. If it doesn't, trim a
      low-value existing Red Flag row before raising the cap.
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:** `rg -n 'KISS' skills/ README.md` returns hits in
`writing-clean-code/SKILL.md` and `writing-clean-code/principles.md`
(and, after task 4, the README FAQ; after task 5, the README table).
`rg -n 'YAGNI'` similarly shows both `SKILL.md` and `principles.md`.
Read the two Red Flag rows in sequence with the existing rows — the
cadence should match, not stand out.

Confirm: the proposed Red Flag "Thought" columns are things a tired
engineer actually thinks (concrete: "I'll add this configuration
knob…"), not abstractions naming the principle ("this violates
KISS"). If a Red Flag's Thought reads as the latter, rewrite it.

## Notes

- **Citation map:** KISS Red Flag → `97/75` (Homer, "Simplicity Comes
  from Reduction"), the existing primary source for decision 1.
  Optionally also `97/39` if both apply naturally. YAGNI Red Flag →
  `97/39` (Lott, "Improve Code by Removing It"), the closest
  97-Things essay. Neither essay actually uses the KISS or YAGNI
  acronym — that's expected and is the whole point of this US
  (substance-not-name match). Same prose-only acknowledgement pattern
  as ISP in task 1. **Do not introduce a new citation key for either
  acronym.**
- Forbidden: adding KISS/YAGNI as numbered decisions, or rewriting
  decision 1 around the KISS acronym. Decisions are trigger-derived;
  the acronyms are search keys.
- The "Long-term mindset vs YAGNI" subsection (line 68 of
  `writing-clean-code/SKILL.md`) already names YAGNI in prose and is
  fine as-is for the acronym mention; the new Red Flag row adds the
  Ctrl-F hit for searchers who don't read prose subsections.
