# 0b-citation-scheme-migration

## Context

Mechanical migration that implements the spec landed in
`0a-citation-scheme-spec.md`. Pure refactor — no semantic change. Every
existing principle keeps the same author, distillation, source URL,
and skill membership. Two shape changes:

1. **ID rename:** `## #NN — Title` → `## 97/NN — Title`. Lint and
   `SKILL_RULES` move from integer-keyed to `<source-key>/<principle-key>`
   string-keyed.
2. **Metadata-block trim:** existing 7-field blocks (Author, Source
   primary, Source reading aid, Source used, Access date, Gaps,
   Distillation, Agent application) collapse to the unified 5-field
   block specified in `CITATION-SCHEME.md` (Author, Source, License,
   Distillation, Agent application). Hygiene fields are dropped because
   they exceed CC-BY-3.0 obligations and inflate agent context cost.

The migration is scoped so a reviewer can verify it touched only ID
format and metadata shape, not principle content. Distillation text and
agent-application text stay byte-identical.

**Value delivered:** the codebase is in the new format before any
enrichment task starts, so every enrichment is a pure additive change
against a settled scheme. No enrichment task carries the migration
burden. `principles.md` files shrink by ~30% in line count, reducing
agent context cost on demand-loaded reference material.

## Related Files

- `scripts/lint-skills.mjs` — regex + schema + comments
- `skills/using-97/SKILL.md` — adds one Priority rule (silent-application
  policy from `0a-citation-scheme-spec.md`)
- `skills/before-you-refactor/principles.md`
- `skills/writing-clean-code/principles.md`
- `skills/testing-discipline/principles.md`
- `skills/api-and-interface-design/principles.md`
- `skills/pre-commit-self-review/principles.md`
- `skills/error-and-correctness-traps/principles.md`
- `skills/build-deploy-and-tooling/principles.md`
- `skills/domain-modeling/principles.md`
- `skills/working-with-users-and-team/principles.md`
- `README.md` — replace the "78 of 97" sentence
- `CONTENT-LICENSE.md` — paragraph noting the new ID convention
- `CHANGELOG.md` — `### Changed` entry

## Dependencies

- `0a-citation-scheme-spec.md` in `done/`. The migration implements
  that spec exactly; deviations require amending the spec first.
- v0.3 (`US-v0.3-council-feedback`) in `done/` (story-level dep).
- **Must run before any enrichment task.** Enrichments append IDs to a
  `string[]` field; pre-migration that field is `number[]`.

## Acceptance Criteria

### Lint changes

- [ ] `scripts/lint-skills.mjs` regex updated. Replace:
      ```js
      for (const m of text.matchAll(/#(\d+)\b/g)) found.add(Number(m[1]));
      const missing = rules.principles.filter((n) => !found.has(n));
      ```
      With:
      ```js
      for (const m of text.matchAll(/^##\s+([A-Za-z0-9]+\/[A-Za-z0-9]+)\b/gm)) found.add(m[1]);
      const missing = rules.principles.filter((id) => !found.has(id));
      ```
- [ ] `scripts/lint-skills.mjs` `SKILL_RULES` `principles` arrays
      converted from `number[]` to `string[]`. Every existing entry
      maps as `N → "97/N"`. Concretely, after migration:
      ```js
      'before-you-refactor':       principles: ['97/6', '97/8', '97/24', '97/31', '97/74']
      'writing-clean-code':        principles: ['97/5', '97/13', '97/15', '97/17', '97/30',
                                                '97/39', '97/62', '97/75', '97/76', '97/91',
                                                '97/93', '97/94']
      'testing-discipline':        principles: ['97/25', '97/60', '97/80', '97/81', '97/82',
                                                '97/83', '97/92', '97/95']
      'api-and-interface-design':  principles: ['97/7', '97/19', '97/32', '97/35', '97/55',
                                                '97/59', '97/65', '97/66', '97/84']
      'pre-commit-self-review':    principles: ['97/1', '97/9', '97/14', '97/16', '97/42',
                                                '97/47', '97/58', '97/69', '97/90']
      'error-and-correctness-traps': principles: ['97/21', '97/26', '97/29', '97/33', '97/41',
                                                  '97/46', '97/57', '97/73', '97/89']
      'build-deploy-and-tooling':  principles: ['97/4', '97/10', '97/20', '97/38', '97/40',
                                                '97/61', '97/63', '97/68', '97/78', '97/79',
                                                '97/88']
      'domain-modeling':           principles: ['97/2', '97/11', '97/12', '97/23', '97/48']
      'working-with-users-and-team': principles: ['97/3', '97/36', '97/50', '97/64', '97/77',
                                                  '97/85', '97/86', '97/87', '97/96', '97/97']
      'using-97':                  principles: []
      ```
- [ ] Header comments in `scripts/lint-skills.mjs` (lines 5–14, 25–38)
      updated:
      - "if principles.md exists, contains every #NN principle for that skill"
        → "if principles.md exists, contains every `<source>/<principle>` ID listed in SKILL_RULES.principles for that skill (see CITATION-SCHEME.md)"
      - Source-of-truth comment now reads: "Per-skill budgets (lines)
        and required principle IDs. ID format: see CITATION-SCHEME.md."

### `principles.md` heading + metadata rewrites (9 files)

Two shape changes per file. Distillation text and agent-application
text are unchanged.

**Heading rewrite:**
- [ ] Every `## #NN — Title` heading rewritten to `## 97/NN — Title`.
- [ ] Body prose mentions of `#NN` (e.g. "the agent invokes #74 in this
      flow") rewritten to `97/NN` for consistency. Rare; verification
      grep below catches any missed.

**Metadata-block trim** (per principle, mechanical field-by-field):
- [ ] `**Author:** <Name>` — keep verbatim.
- [ ] `**Source (primary):** <URL>` — rename to `**Source:** <URL>`,
      keep URL byte-identical.
- [ ] `**Source (reading aid):** <URL>` — **delete this line.**
- [ ] `**Source used:** <text>` — **delete this line.** The license
      identifier moves to a new `**License:**` field below.
- [ ] `**Access date:** <date>` — **delete this line.** Provenance is
      recoverable from `git log`.
- [ ] `**Gaps:** <text>` — **delete this line.** If the value was
      anything other than `None`, copy the text to a follow-up issue
      titled "Provenance note: <skill>/<principle ID>" so nothing is
      lost; otherwise drop silently.
- [ ] **Insert** `**License:** CC-BY-3.0` immediately after the
      `**Source:**` line for every existing principle (all are 97 Things
      and therefore CC-BY-3.0).
- [ ] `**Distillation.**` block — keep verbatim.
- [ ] `**Agent application.**` block — keep verbatim.

After this trim, every existing principle ends up matching the unified
5-field template:
```markdown
## 97/NN — Title

**Author:** <Name>
**Source:** <URL>
**License:** CC-BY-3.0

**Distillation.** <unchanged>

**Agent application.** <unchanged>
```

**File-level top matter** (paragraph above the first principle in each
`principles.md`):
- [ ] Existing top matter — attribution paragraph, "Distillations below
      are original commentary," takedown invitation — stays unchanged.
      The `License:` field per principle is a per-row repeat for
      clarity; the file-level paragraph remains the canonical
      attribution statement.

**No `principles.md` file gains or loses a principle.** Author,
distillation text, source URL, and agent-application text are unchanged.
This is a pure shape refactor.

### `README.md`

- [ ] Replace the sentence (currently ~line 101):
      > 10 skills total. 78 of the book's 97 principles are distilled across the 9 themed skills. The remaining 19 are pure career/mindset essays and aren't agent-actionable. Per-skill contributor attributions live in each skill's `principles.md`.

      With:
      > 10 skills total. Trigger-based skills distilled from *97 Things*
      > and adjacent canonical sources. Per-skill `principles.md` files
      > list every source. Per-skill contributor attributions live in
      > each skill's `principles.md`.

      v1.0 does not reframe the rest of the README's "What this is"
      section. A larger reposition is deferred to v2.0; this migration
      only removes the count-coupled sentence per the spec's README
      phrasing rule.

### `CONTENT-LICENSE.md`

- [ ] Add one short paragraph noting the new ID convention. Suggested
      placement: directly after the existing CC-BY-3.0 attribution
      paragraph. Suggested wording:
      > **Principle IDs.** Every principle in this bundle has a stable
      > string ID of the form `<source-key>/<principle-key>` (e.g.
      > `97/74`, `Fowler/LongMethod`). The full registry of accepted
      > source keys and the format spec live in `CITATION-SCHEME.md`.
      > Citation of *97 Things* essays remains by author + essay number
      > (`97/N`); citation of other sources is by author + book +
      > chapter as documented in each skill's `principles.md`.
- [ ] Existing CC-BY-3.0 attribution and takedown commitment unchanged.

### `using-97/SKILL.md` — silent-application policy

Implements the agent-output policy recorded in
`0a-citation-scheme-spec.md`. One Priority rule added; nothing else
in the bootstrap touched.

- [ ] In `skills/using-97/SKILL.md` Priority section, add one rule.
      Suggested wording (place after the existing rules):
      > **Apply principles silently.** Do not surface source author
      > names, book titles, or principle IDs (e.g. `97/74`,
      > `Fowler/LongMethod`) in user-facing responses. Citations exist
      > for repo provenance, not for user-facing authority.
- [ ] No other edits to `using-97/SKILL.md`. Trigger map, Overview,
      Red Flags table, and any other Priority rules stay byte-identical.

### Changelog & verification

- [ ] `CHANGELOG.md` `[Unreleased]` `### Changed` entry, past tense:
      > Migrated principle IDs from `#NN` to `<source-key>/<principle-key>` format (e.g. `#74` → `97/74`) and trimmed per-principle metadata blocks to the unified 5-field shape (Author, Source, License, Distillation, Agent application). Hygiene fields (Source reading aid, Source used, Access date, Gaps) dropped — provenance is recoverable from `git log`. No content change to distillations or agent-application notes; preparation for canon expansion. Lint regex and `SKILL_RULES.principles` updated.
- [ ] `npm test` passes. Lint must report all 10 skills OK against the
      new ID scheme.
- [ ] Smoke test passes (bundle still loads, harnesses unaffected).

## Verification

**Automated:**
- `npm test` (lint + format-check + smoke). Lint failure = migration
  is incomplete or inconsistent.

**Ad-hoc — pure-refactor checks:**
- `git diff --stat` shows changes only in: `scripts/lint-skills.mjs`,
  9 `principles.md` files, `README.md`, `CONTENT-LICENSE.md`,
  `CHANGELOG.md`.
- No `SKILL.md` file is touched. (Cross-references inside `SKILL.md`
  files use `#NN` only in author-credit footers; if any such reference
  exists, update it — but verify by `git grep '#[0-9]'` first to
  confirm scope.)
- `git grep -E '##\s+#[0-9]+\s+—'` returns zero matches across
  `skills/`. Every old-style heading is gone.
- `git grep -E '##\s+97/[0-9]+\s+—'` returns exactly the count of
  principles previously listed in all `SKILL_RULES.principles` arrays
  combined.
- For each of the 9 enriched skills, every ID listed in
  `SKILL_RULES.principles` appears as a `## <id> —` heading in the
  matching `principles.md`. (Lint enforces this.)
- `git grep 'Source (primary):'`, `git grep 'Source (reading aid):'`,
  `git grep 'Source used:'`, `git grep 'Access date:'`, `git grep 'Gaps:'`
  all return zero matches across `skills/`. The hygiene fields are gone.
- `git grep '**License:** CC-BY-3.0' skills/` returns one hit per
  principle (count matches the SKILL_RULES total).

**Ad-hoc — content-preservation checks:**
- Pick three random principles across three skills. For each:
  - The `**Distillation.**` block body is byte-identical to
    pre-migration.
  - The `**Agent application.**` block body is byte-identical.
  - The author name is byte-identical.
  - The source URL is byte-identical.
- `git log -p` for any single `principles.md` file should show: heading
  line replacements (`s/## #N/## 97\/N/g`), one `**Source (primary):**`
  → `**Source:**` rename per principle, four field deletions per
  principle (reading aid, source used, access date, gaps), one
  `**License:** CC-BY-3.0` insertion per principle. No edits to
  distillation or agent-application paragraphs.

## Notes

- **No semantic changes.** If reviewing this PR surfaces a question
  like "should this principle's distillation say X instead of Y?",
  the answer is "no, file an issue and let an enrichment task address
  it." This task is scoped strictly to ID format.
- **Roman numerals.** No 12-factor IDs exist yet (added by enrichment
  tasks). The migration deals only with `97/NN` integer-suffix IDs.
  Roman-numeral handling is exercised by enrichment tasks; the regex
  already accepts them.
- **Cross-references inside `SKILL.md` files.** Today, `SKILL.md`
  files have a `## Principles in this skill` table that lists `#NN`
  identifiers. Inspect each: if the table uses `#NN`, update those
  cells to `97/NN` here. (The acceptance criteria above lists
  `principles.md` files only because that is where headings live; if
  a `SKILL.md` table also references IDs, update it as part of this
  task to keep the codebase consistent.)
- **Reading-aid Medium URLs unchanged.** Birat Rai's walkthrough URLs
  encode the original essay number (`step-74-...`). Those URLs are not
  rewritten; the URL is a reference to *97 Things* essay 74 and stays
  the same regardless of our internal ID format.
- **What lint will catch after this lands.** If a future PR adds
  `Fowler/LongMethod` to `SKILL_RULES.before-you-refactor.principles`
  but forgets to add a `## Fowler/LongMethod — ...` heading in
  `before-you-refactor/principles.md`, lint fails with the same
  message shape it uses for missing `97/NN` IDs today. This is the
  whole point of the migration.
- **Honest about scope.** This task does not redistribute principles
  across skills, does not change which principles ship, does not
  rewrite distillations, does not edit `SKILL.md` checklists or Red
  Flags. Anything beyond ID format is out of scope.
