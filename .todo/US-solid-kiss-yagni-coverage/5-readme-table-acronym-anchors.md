# 5-readme-table-acronym-anchors

## Context

The README's `What's inside` table (line 88) is the first place a
reader looks to understand what 97 ships. Today it lists each skill
keyed by its trigger ("when it fires"). A reader who knows craft
acronyms — SRP, DRY, KISS, YAGNI, LSP — and Ctrl-Fs the page lands
in the FAQ entry (task 4) at the bottom of the document, not the
table at the top. This task adds parenthetical search anchors to the
relevant table rows so first-impression discoverability matches
reference-level discoverability.

The acronyms are added as **search anchors only**, in parentheses, in
the existing trigger description. No new column, no new row, no
schema change.

**Special case:** SRP is spelled out as "Single Responsibility
Principle (SRP)" because it's the only one of the four whose acronym
is not universally recognizable on its own — DRY, KISS, YAGNI carry
themselves; SRP needs the expansion at first encounter for clarity.
This is an explicit exception to the `main.md` "no dictionary-style
expansions" forbidden rule, scoped to the README table only because
this is the user-facing entry point, not internal skill prose.

**Value delivered:** a reader Ctrl-F'ing the README for any of
SOLID/SRP/DRY/KISS/YAGNI/LSP gets a hit *in the table at the top*,
and lands on the right skill row.

## Related Files

- `README.md` — `## What's inside` table (line 88), specifically:
  - `writing-clean-code` row description (line 94)
  - `api-and-interface-design` row description (line 96)

## Dependencies

- **Tasks 1, 2, 3** — the table parentheticals describe post-edit
  reality (SRP-at-boundary in `api-and-interface-design`,
  KISS/YAGNI in `writing-clean-code`).
- Independent of task 4. Can run in parallel with 4.

## Acceptance Criteria

- [ ] `writing-clean-code` row's "When it fires" cell gains a trailing
      parenthetical along the lines of:
      `(includes Single Responsibility Principle (SRP), DRY, KISS,
      YAGNI)`. Exact wording at author's discretion within the voice
      rules.
- [ ] `api-and-interface-design` row's "When it fires" cell gains a
      trailing parenthetical along the lines of:
      `(includes LSP, SRP at the boundary)`.
- [ ] **No other rows touched.** `before-you-refactor` already names
      DRY and (after task 2) SRP through cross-references, but its
      table row is about the trigger, not the principles named.
      Adding parentheticals to other rows would expand scope and
      re-create the acronym-driven framing this US rejects.
- [ ] **No new column or rename of existing columns.** The table
      stays trigger-keyed; the parentheticals are search anchors
      *inside* the existing description cell.
- [ ] **No new bullets in `### Giants`** for any acronym. That list
      is source-driven, not acronym-driven (per `AGENTS.md`).
- [ ] Voice check: the parentheticals do not introduce promotional
      language. They are bare lists of acronyms inside parens, not
      sales copy. No "covers"/"we cover", no "the SOLID principles",
      no "philosophy" (per `main.md` forbidden list).
- [ ] SRP is the only acronym expanded in the table; DRY, KISS,
      YAGNI, LSP appear bare. Justification: those four are
      universally recognized at the level of a reader who knows the
      acronym in the first place; SRP carries the additional risk of
      being mistaken for an unrelated three-letter abbreviation.
      (This exception is documented in this task's Context.)
- [ ] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:** in the rendered README, Ctrl-F each of "SRP",
"Single Responsibility", "DRY", "KISS", "YAGNI", "LSP" — every one of
them lands in the `What's inside` table near the top of the page (in
addition to the FAQ entry from task 4). Read the two modified table
rows in sequence with the unmodified rows — the cadence should be
consistent; the parentheticals should read as terse search anchors,
not as a second sentence per row.

## Notes

- **Why a fifth task and not a one-liner inside task 4?** The FAQ
  entry (task 4) and the table parentheticals (this task) solve
  different sides of the same discoverability problem. Splitting
  them keeps each task's verification clean and the changelog
  truthful (one bullet per logical change; this task and task 4
  collapse together into the single `### Documentation` bullet per
  `main.md`).
- **Why expand SRP and not the others?** User decision recorded in
  the conversation that produced this task: "Single Responsibility
  Principle (SRP)" is clearer than the bare acronym for a reader
  encountering it cold. DRY/KISS/YAGNI/LSP are recognizable on their
  own to any reader who knows craft acronyms.
- **Forbidden in this task:** adding rows for OCP/ISP/DIP, adding a
  new column for "principles cited," restructuring the table.
- **Changelog:** this task and task 4 share the single
  `### Documentation` bullet under `[Unreleased]` (per `main.md`
  changelog discipline — two bullets total for the whole US).
