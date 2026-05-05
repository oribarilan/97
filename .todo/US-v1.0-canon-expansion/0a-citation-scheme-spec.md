# 0a-citation-scheme-spec

## Context

Foundational, structural pre-task for v1.0. Today every principle is
identified by `#NN` where `NN` is the *97 Things* essay number (1–97).
The lint (`scripts/lint-skills.mjs`) is integer-keyed on those numbers.
Cross-references in `principles.md` files use `#NN` strings.

The moment a canon enrichment task lands a Fowler smell or a 12-factor
item, that scheme breaks: a Fowler smell has no `#NN`, the lint cannot
represent it, and whichever enrichment ships first will invent a heading
format ad-hoc. Without a settled scheme, every `principles.md` ends up
with inconsistently-shaped IDs, cross-references between skills break,
and the lint guardrail goes silent on all canon content.

This task **writes the spec only**. No code changes. No file
migrations. The spec is implemented in `0b-citation-scheme-migration.md`.

**Value delivered:** unblocks every other v1.0 task by deciding once
how non–*97 Things* principles are identified, cited, and lint-enforced.
Without it, the scheme gets invented under deadline pressure in a PR
comment.

## Related Files (to create or edit)

- `CITATION-SCHEME.md` (NEW, repo root) — the spec itself
- `AGENTS.md` — one-line pointer under "Where the deeper rules live"
- `CHANGELOG.md` — `### Added` entry under `[Unreleased]`

**Not edited in this task:** `scripts/lint-skills.mjs`, any
`principles.md`, any `SKILL.md`, `SKILL_RULES`, `README.md`,
`CONTENT-LICENSE.md`. Those land in `0b`.

## Dependencies

- v0.3 (`US-v0.3-council-feedback`) in `done/`. Story-level dependency
  per `main.md`.
- **Must run before `0b-citation-scheme-migration.md`.**
- **Must run before any enrichment task** so each enrichment can
  reference the settled ID scheme.

## Acceptance Criteria

- [ ] `CITATION-SCHEME.md` exists at repo root with all sections below.

### `CITATION-SCHEME.md` required sections

- [ ] **Overview.** One paragraph: what this doc decides, who reads it
      (humans + agents writing or reviewing `principles.md`), and what
      it does not cover (voice rules — those live in the `humanizer`
      skill).

- [ ] **ID grammar.** Every principle in the bundle has a stable string
      ID matching:
      ```
      <source-key>/<principle-key>
      ```
      - `source-key`: short, conventional, registered in the Sources
        table below. Match `[A-Za-z0-9]+`.
      - `principle-key`: PascalCase identifier, OR original numeric ID
        for sources that have one, OR Roman numeral where the source
        uses one (e.g. 12-factor). Match `[A-Za-z0-9]+`.
      - Full ID match: `^[A-Za-z0-9]+/[A-Za-z0-9]+$`.
      - **Stability rule:** once published in a release, an ID never
        renames. Add a deprecated alias if a key absolutely must change.

- [ ] **Sources table.** Canonical registry of accepted source keys.
      Required columns: source-key, full title, author/editor, year,
      license posture (CC-BY-3.0 / fair-use commentary / etc.). Initial
      rows the spec must include:

      | Key | Source | Notes |
      |---|---|---|
      | `97` | *97 Things Every Programmer Should Know*, ed. Henney, O'Reilly 2010 | CC-BY-3.0 |
      | `Fowler` | *Refactoring* (2nd ed.), Fowler, Addison-Wesley 2018 | fair-use commentary |
      | `RI` | *Release It!* (2nd ed.), Nygard, Pragmatic 2018 | fair-use commentary |
      | `Wlaschin` | *Domain Modeling Made Functional*, Wlaschin, Pragmatic 2018 | fair-use commentary |
      | `King` | "Parse, don't validate", Alexis King, 2019 (lexi-lambda.github.io) | fair-use commentary |
      | `12F` | The Twelve-Factor App, Wiggins / Heroku 2011 (12factor.net) | fair-use commentary |
      | `CD` | *Continuous Delivery*, Humble & Farley, Addison-Wesley 2010 | fair-use commentary |
      | `DORA` | *Accelerate*, Forsgren/Humble/Kim, IT Revolution 2018 | fair-use commentary |
      | `GOOS` | *Growing Object-Oriented Software, Guided by Tests*, Freeman & Pryce, Addison-Wesley 2009 | fair-use commentary |
      | `xUnit` | *xUnit Test Patterns*, Meszaros, Addison-Wesley 2007 | fair-use commentary |
      | `SRE` | *Site Reliability Engineering*, ed. Beyer/Jones/Petoff/Murphy, O'Reilly 2016 | fair-use commentary |
      | `OE` | *Observability Engineering*, Majors et al., O'Reilly 2022 | fair-use commentary |
      | `OTel` | OpenTelemetry semantic conventions, opentelemetry.io | Apache 2.0 / CC-BY-4.0 |
      | `Liskov` | Liskov, "Data Abstraction and Hierarchy", CACM 1987 | fair-use commentary |
      | `Hyrum` | Hyrum's Law, hyrumslaw.com | informal canon |
      | `Ousterhout` | *A Philosophy of Software Design* (2nd ed.), Ousterhout, Yaknyam Press 2021 | fair-use commentary |

      **Pre-registered sources only.** Sources whose enrichment tasks
      are still under review (e.g. Martin's *Clean Code*, *Pragmatic
      Programmer*, Cagan's *Inspired*, *The Phoenix Project*) are
      **not** pre-registered. If a future enrichment task confirms one
      of those sources is in scope, that task adds the source key to
      this table in the same PR.

- [ ] **Heading format in `principles.md`.** Every principle starts with:
      ```markdown
      ## <full-id> — <Title>
      ```
      Examples:
      - `## 97/74 — The Road to Performance Is Littered with Dirty Code Bombs`
      - `## Fowler/LongMethod — Long Method`
      - `## RI/CircuitBreaker — Circuit Breaker`
      - `## 12F/III — Config in the Environment`

      Followed by the unified 5-field metadata block specified below.

- [ ] **License posture and CC-BY-3.0 obligations.** CC-BY-3.0 (the
      license of the 97 Things GitHub mirror) requires four things:
      attribute the author, identify the license, link the original
      work, and indicate any modifications. The unified metadata block
      satisfies all four:
      - `Author:` field — attribution.
      - `Source:` field — link to original.
      - `License:` field — license identification.
      - The fact that the entry is in *our* `principles.md` under
        `## Distillation.` headed "**own words**" is the modification
        notice; the file-level header note in each `principles.md`
        ("Distillations below are original commentary in our own
        words…") makes this explicit.

      For copyrighted-book sources (Fowler, Nygard, Wlaschin, etc.),
      no license obligation flows to us beyond fair-use posture: we
      cite the source, write commentary in our own words, do not
      reproduce source text. The `License: fair-use commentary` field
      records this posture explicitly.

- [ ] **Per-principle metadata block — single unified template.** Five
      fields, same shape regardless of source mode. Calibrated to
      license-minimum + agent-application; no hygiene fields:
      ```markdown
      **Author:** <Name>
      **Source:** <citation — see formats below>
      **License:** <one-liner; see formats below>

      **Distillation.** <own words; no quoted strings; ≤25 words verbatim if absolutely necessary>

      **Agent application.** <how the principle is wired into SKILL.md>
      ```

      Source field formats by source mode:
      - **CC-BY-3.0 sources** (`97/*`): URL to the canonical chapter on
        the GitHub mirror. Example:
        `https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_74/README.md`
      - **Copyrighted-book sources** (`Fowler/*`, `RI/*`, `Wlaschin/*`, etc.):
        `<Book title>, <edition>, <publisher> <year>, ch./§ <ref>`.
        Example: `Refactoring, 2nd ed., Addison-Wesley 2018, ch. 3`.
      - **Online-essay sources** (`King/*`, `12F/*`, `Hyrum/*`): URL to
        the canonical version.

      License field formats by source mode:
      - **CC-BY-3.0 sources**: `CC-BY-3.0` (link to license text optional but
        recommended on first occurrence per file).
      - **Copyrighted-book sources**: `fair-use commentary` (commentary is
        original; no source text reproduced).
      - **Permissively-licensed online sources** (e.g. OpenTelemetry):
        the actual license name (`Apache-2.0`, `CC-BY-4.0`).

      Why no `Access date` / `Gaps` / `Source (reading aid)` / `Source used`
      fields: these are contributor-hygiene notes, not legal requirements.
      Removed during the `0b-citation-scheme-migration.md` migration to
      keep `principles.md` files lean. Provenance is recoverable from
      `git log` and the source URL or chapter reference.

- [ ] **Lint regex spec.** Replacement matcher for the existing
      integer-only one in `scripts/lint-skills.mjs`. Spec text:
      ```
      Anchored to ## headings only (not freeform mentions in body):
        /^##\s+([A-Za-z0-9]+\/[A-Za-z0-9]+)\b/gm
      Captured group 1 is the full principle ID. Lint asserts every
      ID listed in SKILL_RULES.principles for that skill appears as a
      heading in the corresponding principles.md file.
      ```

- [ ] **`SKILL_RULES.principles` schema.** One field, type `string[]`.
      Migration semantics: existing integer entries become `97/<int>`
      strings (e.g. `[6, 8, 24, 31, 74]` → `["97/6", "97/8", "97/24",
      "97/31", "97/74"]`). New canon principles append IDs in the same
      array. No parallel `canonPrinciples` field.

- [ ] **README phrasing rule.** Spec forbids any count-coupled headline
      phrase like "78 of the book's 97 principles." Suggested
      replacement (final wording landed by `0b-citation-scheme-migration.md`):
      > Trigger-based skills distilled from *97 Things* and adjacent
      > canonical sources. Per-skill `principles.md` files list every
      > source.
      v1.0 does not reframe the README's "What this is" section beyond
      removing the count-coupled sentence. A larger reposition is
      deferred to v2.0.

- [ ] **Cross-reference convention.** Inside `SKILL.md` or
      `principles.md`, refer to another principle by its full ID in
      backticks:
      ```markdown
      See also `Fowler/LongMethod` (in `before-you-refactor`).
      ```
      File paths are not used for cross-references; IDs are stable, file
      paths are not.

- [ ] **Agent output policy: silent application.** The spec records
      the decision that the agent applies principles **silently** in
      user-facing responses. Concretely:
      - The agent does not surface author names, book titles, or essay
        IDs (`97/74`, `Fowler/LongMethod`, etc.) in responses to the
        end user.
      - The agent applies the principle and explains the reasoning
        in plain terms ("this function is doing too many things; let
        me extract a helper") without name-dropping the source.
      - Citations exist for repo provenance and CC-BY-3.0 compliance,
        not for user-facing authority.

      Why: the trigger taxonomy is the moat (per `main.md` cross-cutting
      concerns); the moat works whether or not the agent name-drops.
      Silent application keeps user-facing output clean and avoids
      turning the plugin into indirect advertising for source books.

      **Implementation:** the actual one-line Priority rule lands in
      `using-97/SKILL.md` as part of `0b-citation-scheme-migration.md`'s
      edits to the bootstrap. This task only records the policy in
      the spec doc; `0b` adds the line.

- [ ] **What this spec does NOT cover.** Explicit non-goals:
      - Voice rules — those live in `humanizer`.
      - Trigger-actionability bar — that lives in `main.md` cross-cutting
        concerns and the per-skill `SKILL.md` discipline.
      - Per-skill principle selection — that lives in each enrichment
        task.
      - License/copyright posture for individual sources — that lives in
        `CONTENT-LICENSE.md` (updated in `0b` and per-enrichment tasks).

### Other edits

- [ ] `AGENTS.md` "Where the deeper rules live" section gains a line:
      > - Citation/principle-ID scheme: `CITATION-SCHEME.md`
- [ ] `CHANGELOG.md` `[Unreleased]` `### Added` entry, past tense:
      > Added `CITATION-SCHEME.md` defining the `<source-key>/<principle-key>` ID format used by every `principles.md` heading and the lint. Replaces the implicit `#NN` convention. No content changes; migration lands in a follow-up.
- [ ] `npm test` passes (no code touched, but smoke checks the new doc
      doesn't break anything).

## Verification

**Automated:**
- `npm test` (lint + format-check + smoke).

**Ad-hoc:**
- Read `CITATION-SCHEME.md` end-to-end. A reader who has not seen this
  conversation can decide:
  - what ID a new Fowler smell would get,
  - what heading format their `principles.md` entry uses,
  - what fields go in their metadata block,
  - what their `SKILL_RULES.principles` entry looks like.
- Confirm `AGENTS.md` references the new doc.
- Confirm no `principles.md`, no `SKILL.md`, no `scripts/`, no `README.md`,
  no `CONTENT-LICENSE.md` was touched. `git diff` should show only
  `CITATION-SCHEME.md` (added), `AGENTS.md` (one line), `CHANGELOG.md`
  (one line).

## Notes

- **Spec only.** Tempting to "just go ahead and migrate while I'm at
  it." Do not. The migration is reviewable as a pure refactor (`0b`)
  precisely because the spec it implements has been reviewed and
  agreed first.
- **Stability rule on IDs is load-bearing.** The whole point of moving
  to string IDs is stable cross-references. Renaming an ID after
  release breaks every cross-reference and every external link to a
  GitHub anchor.
- **Source-key registry is the bottleneck for new sources.** Every new
  source added in an enrichment task must edit the Sources table in
  the same PR. This is intentional — it forces the source decision to
  be visible, not buried in a `principles.md` file.
- **Roman numerals for 12-factor.** 12-factor itself uses Roman
  numerals (Factor III, Factor V, etc.). Preserve them: `12F/III`,
  `12F/V`, `12F/XI`. They are valid `[A-Za-z0-9]+`. Do not Arabic-ize.
- **The `Hyrum` source key is for the failure-mode reference**, not a
  principle. It is registered so cross-references work; it does not
  imply a principle row exists with ID `Hyrum/Law`.
- **No quoted source text from copyrighted books.** The unified
  metadata block has no field for "verbatim excerpt" — that is
  intentional. If an enrichment task author finds themselves wanting
  one, the answer is "rewrite in own words."
- **Why the metadata block is lean.** Earlier `principles.md` files in
  the repo carried 7 fields per principle (Author, Source primary,
  Source reading aid, Source used, Access date, Gaps, Distillation,
  Agent application). Of those, four were contributor-hygiene notes
  with no license obligation behind them. The unified 5-field block
  keeps everything CC-BY-3.0 actually requires plus the agent-
  application field, and drops the rest. Provenance (when, by whom,
  with what reading aids) is recoverable from `git log` for anyone
  who needs it; it does not need to live inline in agent context.
- **CC-BY-3.0 license attribution discipline.** Each `principles.md`
  file's existing top matter — attribution paragraph + takedown
  commitment + "originals are CC-BY-3.0" pointer — stays. The
  per-principle `License:` field is a per-row repeat of the posture
  for clarity; the file-level paragraph is the canonical statement.
