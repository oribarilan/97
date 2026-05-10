# US-acronym-discoverability

## Goal

Surface the well-known craft acronyms (SOLID, KISS, DRY, YAGNI, SRP, LSP)
at the spots in 97 where their substance already lives, so users searching
for them find them. Fill one real gap: module-scope SRP in
`before-you-refactor`.

This is naming and discoverability work, not new content. DRY and YAGNI
already appear by acronym. SRP, KISS, LSP, and SOLID do not appear (or
barely appear) in SKILL.md files. OCP/ISP/DIP lack cited sources in the
project and are not surfaced.

## Definition of Done

- [x] `writing-clean-code/SKILL.md` decision 1: "(KISS)" parenthetical
      added where simplicity-by-removal is described (97/75).
      (Council: dropped trailing period for consistency with other acronyms.)
- [x] `writing-clean-code/SKILL.md` decision 4: "(SRP)" added after
      "The Single Responsibility Principle."
- [x] `before-you-refactor/SKILL.md`: new Red Flag row for module-scope
      SRP — co-location by import convenience is not a single
      responsibility. Cites 97/76.
- [x] `before-you-refactor/SKILL.md` principles table: "SRP" added to
      the 97/76 description.
- [x] `api-and-interface-design/SKILL.md` Red Flag (line 85): "(LSP)"
      parenthetical — already present as `(Liskov/LSP)`. No change needed.
      (Council: unanimous that this item was already satisfied.)
- [x] `writing-clean-code/principles.md` 97/76 entry: one-line note
      that SRP is the S in SOLID.
- [x] `api-and-interface-design/principles.md` Liskov/LSP entry:
      one-line note that LSP is the L in SOLID.
- [x] `grep -i 'KISS\|SRP\|LSP' skills/*/SKILL.md` returns hits in
      all three SKILL.md files touched.
- [x] `grep -i 'SOLID' skills/*/principles.md` returns hits in both
      `writing-clean-code` and `api-and-interface-design`.
- [x] Line counts stay within lint budgets.
- [x] `CHANGELOG.md` `[Unreleased]` has a `### Changed` entry.
- [x] `npm test` passes.

## Out of Scope

- No new skills. No "SOLID skill."
- OCP, ISP, DIP are not surfaced — no cited source in the project.
- No structural additions (no index file, no README section).
- No principles.md changes beyond the two SOLID anchor lines.
- DRY and YAGNI already appear by acronym — no changes needed.

## Cross-Cutting Concerns

- **Conciseness.** Labels are bare acronym parentheticals for grep, not
  explanatory prose. "(KISS.)" not "(The substance of KISS applied as
  a technique: subtract first.)".
- **Voice.** AGENTS.md rules apply. No AI tells, imperative voice in
  checklists and red flags.
- **Lint.** `scripts/lint-skills.mjs` enforces line-count caps. The new
  red flag row adds ~2 lines to `before-you-refactor/SKILL.md` (budget:
  200, current: 98). Parentheticals add a few words inline.
- **SOLID anchors go in principles.md, not SKILL.md.** The agent doesn't
  need to know about SOLID; the grep-searching human does.
  `principles.md` is the deep-cut reference loaded on demand.
