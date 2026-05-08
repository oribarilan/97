# US-solid-kiss-yagni-coverage

## Goal

Surface the well-known craft acronyms — **SOLID**, **KISS**, **DRY**,
**YAGNI** — at the spots in 97 where their substance already lives (or
should live), so users searching for them find them, without retrofitting
acronym-driven content the project doesn't believe in.

The substance of SRP, LSP, DRY, KISS, and YAGNI is already in the skills.
This US is mostly about **naming, discoverability, and one real gap**
(SRP at module boundaries / before-you-refactor). It is **not** about
adding a "SOLID skill" or wedging OCP/ISP/DIP in by name where the
substance isn't drawn from a cited source.

## Scope decisions (locked)

- **No new skill.** `writing-clean-code` and `api-and-interface-design`
  already carry the substance; this US sharpens what's there.
- **No first-class OCP / ISP / DIP** by acronym. The substance closest to
  them (narrow interfaces, abstractions at boundaries, designing errors
  out of existence) is already in `api-and-interface-design` under
  better-cited framing. Mentioning the acronyms in passing in
  `principles.md` prose is fine; promoting them to decisions or Red
  Flags is not.
- **SRP appears in two skills, framed differently** — unit-level in
  `writing-clean-code` (already there), boundary-level in
  `api-and-interface-design` (new). They are not duplicates.
- **README acknowledges the acronyms honestly** in a single FAQ entry
  rather than throughout the marketing copy.
- **Citation key for SRP across both new locations: `97/76` (reuse).**
  The 97-Things essay text generalizes from "class" to "responsibility =
  reason to change," which is honest at both unit and boundary scope.
  Citation reuse across skills is precedented (`97/30` appears in both
  `writing-clean-code` and `before-you-refactor/principles.md`).
  Introducing `Martin/SRP` from *Agile Software Development* (2002)
  would require adding the book to README `### Giants` per
  `AGENTS.md` "Adding or removing a source" — out of scope here.

## Definition of Done

- [ ] A user searching the README for "SOLID", "DRY", "KISS", or "YAGNI"
      finds an honest, scoped answer (FAQ entry) explaining where each
      lives — and that OCP/ISP/DIP are intentionally not called out by
      name.
- [ ] `writing-clean-code/SKILL.md` has KISS and YAGNI named explicitly
      (Red Flags rows + a sentence in `principles.md` linking the
      existing distilled principles to the acronyms). No new decisions.
- [ ] `api-and-interface-design/SKILL.md` has an SRP-at-the-boundary
      check or Red Flag (fat interfaces / "one reason to depend") with
      `97/76` cited; `principles.md` notes the ISP overlap.
- [ ] `before-you-refactor/SKILL.md` lists SRP as a refactoring trigger
      ("two reasons to change in one unit → split"), matching the
      existing DRY mention in `before-you-refactor/principles.md`.
- [ ] `writing-clean-code/SKILL.md` decision 4 has a one-clause
      back-reference to `before-you-refactor`'s SRP trigger
      (bidirectional consistency per `AGENTS.md` "Editing existing
      skills" rule 2).
- [ ] `README.md` `What's inside` table has acronym search anchors in
      the relevant rows: `writing-clean-code` row gains
      `(includes Single Responsibility Principle (SRP), DRY, KISS,
      YAGNI)`; `api-and-interface-design` row gains `(includes LSP,
      SRP at the boundary)`.
- [ ] `using-97/SKILL.md` Trigger Map untouched. No edits to
      `package.json`, `.claude-plugin/*`, `hooks/`, or `.opencode/`.
- [ ] No `scripts/lint-skills.mjs` `SKILL_RULES` line-cap changes.
      If a touched skill nears its cap, trim a low-value Red Flag row
      before raising the cap.
- [ ] Bidirectional cross-reference audit passes:
      `rg 'superpowers/|97/' skills/*/SKILL.md` shows no broken or
      one-sided references introduced by this US.
- [ ] Humanizer pass over the diff. Concrete grep across the diff for
      `stands as`, `serves as`, `embraces`, `embodies`, `philosophy`,
      `well-known acronyms`, `the SOLID principles`, `following KISS`,
      `applying YAGNI`, and `first-class` returns no matches.
- [ ] Voice rules from `humanizer` hold across all edits — no AI tells,
      no rule-of-three padding, no promotional acronym soup.
- [ ] `npm test` passes (lint + format-check + smoke).
- [ ] `CHANGELOG.md` `[Unreleased]` has **two** entries total: one
      `### Changed` covering the SRP + KISS/YAGNI surfacing across the
      three skills, one `### Documentation` for the FAQ entry plus the
      `What's inside` acronym anchors.

## Task Priority

1. `1-srp-at-boundary-in-api-design.md` — fills the only real *gap*
   (SRP framed at module boundaries).
2. `2-srp-trigger-in-before-you-refactor.md` — second real gap.
3. `3-name-kiss-and-yagni-in-clean-code.md` — pure surfacing of
   existing substance; no new claims, just labels and discoverability.
4. `4-readme-faq-acronyms.md` — the FAQ entry should accurately
   describe the *post-edit* state of the skills, so it runs after 1–3.
5. `5-readme-table-acronym-anchors.md` — Ctrl-F discoverability win
   on the `What's inside` table; runs alongside or after task 4.

The citation key is locked in `main.md` (`97/76` reuse), so tasks 1, 2,
and 3 have **no inter-task dependencies** and can run in parallel or in
any order. Tasks 4 and 5 depend on 1–3 because they describe post-edit
reality.

## Cross-Cutting Concerns

- **Citations.** SRP-at-boundary and SRP-as-refactor-trigger both reuse
  `97/76`. No new citation keys introduced by this US. See locked scope
  decision above.
- **Voice.** Apply `humanizer` rules. No "stands as", no "serves as", no
  inflated symbolism around acronyms. The acronyms are search keys, not
  rallying cries.
- **Forbidden phrases (anywhere in this US's diff):**
  - **"the SOLID principles"** as a phrase. Treating SOLID as a named
    bundle reintroduces the acronym-driven framing this US rejects.
  - **"following KISS" / "applying YAGNI"** as verbs. Turns acronyms
    into ceremony. Use them as labels on concrete advice, not as
    instructions in their own right.
  - **"covers" / "we cover"** in the FAQ entry. Promotional. Prefer
    "the substance of X lives in skill Y" or "X is named in skill Y as
    a Red Flag."
  - **"first-class"** when describing what's in/out. Project jargon
    that reads as marketing.
  - **"well-known acronyms"** anywhere in the FAQ. Filler.
  - **Dictionary-style expansions** in `principles.md` ("KISS — Keep
    It Simple, Stupid"). The principle text already explains the
    substance; the acronym in parens is wiki-cruft. The exception is
    the `What's inside` table, which expands SRP once for unfamiliarity
    reasons (see task 5).
  - **Acronym-as-Thought-column.** Red Flag "Thought" entries are a
    quoted internal monologue from a tired engineer. No tired engineer
    thinks "this violates KISS"; they think "I'll add a config knob in
    case someone wants to override it." Acronyms belong in the
    Reality column, never the Thought column.
- **Forbidden additions.** Do not introduce a `solid-principles` skill.
  Do not add OCP / ISP / DIP as Red Flag rows or numbered decisions.
  Do not rebrand existing decisions around acronyms; the trigger-based
  structure stays. Do not introduce `Martin/SRP` as a new citation key.
- **Lockstep files.** Per `AGENTS.md` rule 4, do not edit
  `using-97/SKILL.md`, `package.json`, `.claude-plugin/*`, or hooks as
  part of this US — there's no trigger-map change and no version bump.
- **Lint caps.** Do not raise `SKILL_RULES` line caps in
  `scripts/lint-skills.mjs`. If a skill nears its cap, trim a
  low-value existing row.
- **Changelog.** Two bullets total: one `### Changed`, one
  `### Documentation`. Don't enumerate file paths in the bullets;
  that's for the commit body.

## Notes

- Decision recap from the conversation that produced this US:
  - **Add by name:** SRP-at-boundary, KISS, YAGNI (already partially
    present, just under-labeled).
  - **Already named, leave alone:** SRP-at-unit (`97/76` in
    `writing-clean-code`), DRY (`97/30`), LSP (`Liskov/LSP` in
    `api-and-interface-design`).
  - **Deliberately not named:** OCP, ISP, DIP — substance covered by
    other principles under more honest framing. Note: OCP is
    *deliberately* under-served because speculative extension points
    conflict with YAGNI; the FAQ should say so honestly rather than
    hand-wave "covered under other framing."
- Provenance for the FAQ stance: README's `### Giants` bullets are
  source-driven, not acronym-driven (`AGENTS.md` "Adding or removing a
  source"). The FAQ entry should reinforce that framing.
