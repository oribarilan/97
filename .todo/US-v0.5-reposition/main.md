# US-v0.5-reposition

## Context

v0.4.0 shipped the content expansion: six existing skills enriched
with principles from Fowler, Wlaschin, Nygard, 12-factor, *Continuous
Delivery*, GOOS, Meszaros, Ousterhout, Liskov, King, plus a new
`observability` skill drawn from the SRE book, OpenTelemetry, and
*Observability Engineering*. The reposition that was originally
planned alongside that content was **deliberately deferred** in the
v1.0 story — explicitly to let the content land first and be judged
on its own.

That deferral has paid out. The content is in. The `principles.md`
files cite seven additional named authors. The bootstrap already
says "*97 Things*… and adjacent canonical sources." The new FAQ
(landed in this branch's earlier commit) frames 97 as the *craft*
layer of a stack, alongside `superpowers` (process) and `BMAD`
(methodology) — already speaking layer-language, not 97-Things-only
language.

The remaining holdouts are user-visible surfaces that still describe
97 as a *97 Things* companion: the `README.md` `## What this is`
section plus three nearby README paragraphs, the four manifest
`description` fields, the `AGENTS.md` and `CONTRIBUTE.md` opening
paragraphs, and one bootstrap line that uses the word "canonical."
Those surfaces now read inconsistently with the shipped content and
with the FAQ.

This story closes that inconsistency. It is presentation work, not
content work — no skill bodies change, no principles are added or
removed, no trigger map changes.

## Goal

Reposition 97's user-visible identity from *"a multi-harness companion
to* 97 Things*"* to *"skills distilled from the classics of programming
practice, in the spirit of* 97 Things Every Programmer Should Know*."*

Concretely: 97 Things moves from being framed as the primary content
source to being framed as the namesake exemplar — the project
inherits its **form** from the book (one principle at a time,
hard-won, distilled small, applied at the moment of decision) while
its **content** is honestly described as drawing from a wider set of
established practitioner works.

The umbrella term "canon" / "canonical" is retired across user-visible
copy in favor of "the classics of programming practice" — same intent,
less self-important register. Term-of-art uses of "canonical" inside
`principles.md` (e.g. "canonical mirror," "canonical home for an ID")
and `CITATION-SCHEME.md` are precise terminology and **not retired**.

## Hard dependencies

None. v0.4.0's content is already shipped; this story is purely a
framing pass over user-visible copy.

**Soft dependency:** this story should land **before** any v0.5
release commit, otherwise the release ships with the inconsistency
the story is fixing.

## Definition of Done

Edit the following surfaces in the recommended order
(see "Sequencing" below). Run `npm test` after the manifest group and
after the bootstrap edit, minimum.

- [ ] **`README.md` `## What this is`** rewritten per "Final copy
      targets" below. Section length stays in the same neighborhood
      as today.
- [ ] **`README.md` "What's inside" closing paragraph** (currently
      lines 101–104) rewritten so it does not frame v0.4 sources as
      "additional sources" enriching "book principles." Treat the
      sources as peers under the new framing.
- [ ] **`README.md` "Attribution & sources" subsection** (currently
      lines 108–117) — replace "Treat 97 as a guided reading list
      into the source book" with language that points readers to the
      source authors / underlying literature, not specifically the
      book. The "essay author / CC-BY-3.0 source essay" wording
      assumes every principle is a *97 Things* essay; generalize so
      it covers Fowler/Nygard/SRE-book/etc. attribution too.
- [ ] **`README.md` "Licensing"** (currently lines 158–163) — the
      "principles discussed in the book… Unofficial companion"
      phrasing implies the book is the only source. Generalize to
      cover the wider source set; keep the formal CC-BY attribution
      pointer to `CONTENT-LICENSE.md`.
- [ ] **`package.json` `description`** rewritten per the table below.
- [ ] **`.claude-plugin/plugin.json` `description`** rewritten per the
      table below. **`keywords` array unchanged** — `"97-things"`
      stays for SEO.
- [ ] **`.claude-plugin/marketplace.json`** — both the root
      `description` and the `plugins[0].description` rewritten per
      the table below.
- [ ] **`AGENTS.md` "What this repo is" first paragraph** rewritten
      per the target wording below.
- [ ] **`CONTRIBUTE.md`** opening paragraph (currently around line 16)
      rewritten in matching framing. Contributor-facing surface,
      same family as `AGENTS.md`; included for consistency.
- [ ] **`skills/using-97/SKILL.md`** Overview — opening sentence
      rewritten per the target wording below. The Overview's closing
      sentence ("Unofficial companion, not affiliated with O'Reilly
      or any contributor") stays — that's an attribution disclaimer,
      not framing. Trigger map and Priority section untouched.
- [ ] **`CHANGELOG.md`** — entries stay in `[Unreleased]`. See
      "Changelog handling" below.
- [ ] **`npm test`** (lint + format-check + smoke) passes.
- [ ] **Cross-read grep** — run
      `rg -i 'canon|companion|97 things|source book|the book' README.md CONTRIBUTE.md AGENTS.md package.json .claude-plugin/ skills/using-97/SKILL.md hooks/ .opencode/`
      and confirm every remaining match is either (a) the namesake
      reference in the new framing, (b) a credit/attribution line, or
      (c) an out-of-scope file. No surface still calls 97 a
      "*97 Things* companion" or uses "canon"/"canonical" outside
      term-of-art contexts.
- [ ] **Humanizer pass on the final copy.** The target wordings
      below are drafts; cut em-dashes, rule-of-three padding,
      copula-avoidance ("serves as"), promotional language, and
      AI-vocabulary words ("crucial," "pivotal," "underscore,"
      "showcase," etc.) before committing.

## Out of scope

- The actual v0.5.0 release commit — `package.json` `version`,
  `.claude-plugin/plugin.json` `version`,
  `.claude-plugin/marketplace.json` `plugins[0].version`, and the git
  tag are release activities per `AGENTS.md` rule 3, not feature
  work. The release happens in a separate, deliberate commit. The
  story filename presumes v0.5.0; the actual version tag is decided
  at release time.
- **GitHub repo description, About, and topics** — set on github.com,
  not in repo files. Maintainer to update manually post-merge.
- **`plugin.json` `keywords` array** — unchanged. `"97-things"` stays
  for marketplace SEO. Not a framing surface.
- **No file or directory renames** — `using-97/` stays
  `using-97/`, the `97` project name and tagline stay.
- `CONTENT-LICENSE.md` — already restructured in v0.4.0 with a
  "Beyond *97 Things* — fair-use commentary on canonical sources"
  section. The word "canonical" appears there in a legal/attribution
  context where it is the precise term; not retired.
- `CITATION-SCHEME.md` — "canonical home" / "canonical mirror" are
  term-of-art usage referring to the authoritative source location
  of a principle ID. Not retired.
- `principles.md` files — "canonical mirror," "canonical home,"
  "Companion to 97/N" are term-of-art and citation usage, not
  framing. Untouched.
- **Source list** — no new sources, no removed sources, no new
  principles. This story does not signal openness to new sources;
  source additions still require a trigger that fires, not a name
  that belongs.
- Tagline ("Your agent, on the shoulders of giants.") — stays.
- FAQ entry — stays.
- Credits ordering — stays. *97 Things* remains the first credit;
  it is the namesake, which is correct under the new framing too.
- Skill bodies, trigger map, Priority section in
  `using-97/SKILL.md` — untouched.
- Tagline rework, README header rework — already shipped earlier in
  this branch.
- `hooks/session-start.mjs` and `.opencode/plugins/97.js` — verified
  to contain no framing copy (only mechanical injection of the
  bootstrap). Untouched.

## Cross-Cutting Concerns

### Voice and language

- "The classics of programming practice" is the chosen umbrella
  phrase. Decision recorded with eyes open: it is a credentialing
  phrase, not a humble one. The names in the README do most of the
  credibility work; the umbrella phrase exists only where the names
  cannot fit (manifests, AGENTS.md first line, bootstrap opener).
  In the README intro paragraph, the umbrella **does not appear** —
  the names carry the meaning.
- "In the spirit of" is the chosen lineage phrase. It explicitly
  describes *form-inheritance* rather than *content-fidelity*.
- **JSON manifests use plain text for the book title**
  (`'97 Things Every Programmer Should Know'` with single quotes,
  matching the current style). Markdown italics (`*…*`) belong in
  `.md` files only — npm and many marketplace UIs render asterisks
  literally.
- `AGENTS.md` is contributor-facing, not user-facing; it is updated
  for consistency, not for SEO.

### Final copy targets

These are **drafts**. Apply humanizer discipline before committing.

**README `## What this is` (target wording, draft):**

> Skills your coding agent invokes when they apply: when it's about
> to refactor, write a test, design an API, or commit. They distill
> established programming practice — Fowler on refactoring smells,
> Wlaschin on domain modeling, Nygard on production resilience,
> Ousterhout and Liskov on API shape, GOOS and Meszaros on testing,
> 12-factor on configuration and deploys, the SRE book and
> OpenTelemetry on observability, King on parse-don't-validate.
>
> The project is named for *97 Things Every Programmer Should Know*
> (O'Reilly, ed. Kevlin Henney) and built in its spirit: one
> hard-won principle, distilled small, applied where it matters.
> Every principle ships with attribution to the original author.

**Manifest descriptions (target wording, draft):**

| File | Field | Text |
|---|---|---|
| `package.json` | `description` | `"Skills distilled from the classics of programming practice, in the spirit of '97 Things Every Programmer Should Know'. Plugin for Claude Code, GitHub Copilot CLI, and OpenCode."` |
| `.claude-plugin/plugin.json` | `description` | `"Skills distilled from the classics of programming practice, in the spirit of '97 Things Every Programmer Should Know'. Your coding agent invokes them when about to refactor, write a test, design an API, or commit."` |
| `.claude-plugin/marketplace.json` (plugin entry) | `description` | Same as `plugin.json`. |
| `.claude-plugin/marketplace.json` (root) | `description` | `"Marketplace for the 97 plugin — skills distilled from the classics of programming practice, in the spirit of '97 Things Every Programmer Should Know'."` |

(Single quotes around the book title in JSON, matching the current
style and avoiding markdown-italic regressions.)

**`AGENTS.md` "What this repo is" first paragraph (target wording,
draft):**

> `97` is a multi-harness plugin that ships behavior-shaping skills
> distilled from the classics of programming practice, in the spirit
> of *97 Things Every Programmer Should Know* (O'Reilly, ed. Kevlin
> Henney).

**`CONTRIBUTE.md` opening paragraph** — match the AGENTS.md framing.

**Bootstrap (`using-97/SKILL.md`) Overview — target rewrite of the
opening sentence (draft, reordered for readability):**

> **97** distills principles from the classics of programming
> practice into trigger-based skills, in the spirit of
> *97 Things Every Programmer Should Know* (O'Reilly, ed. Kevlin
> Henney; CC-BY-3.0 originals at
> https://github.com/97-things/97-things-every-programmer-should-know).

The rest of the Overview ("You have eleven themed skills plus this
bootstrap…") is untouched, including the closing
"Unofficial companion, not affiliated with O'Reilly" disclaimer.

### Changelog handling

Current `CHANGELOG.md` `[Unreleased]` has two `### Documentation`
bullets. The second bullet contains the phrase *"Reframes 97 as a
guided reading list into the source book"*, which uses the framing
this story is retiring.

Plan (entries stay in `[Unreleased]`; the release commit moves them
into a versioned section per `AGENTS.md` rule 3):

- **Reword the second `### Documentation` bullet** in place so it
  does not announce the demoted framing. Suggested replacement:
  "explains how every principle is attributed to its original
  author and how to ask the agent for the source."
- **Add a `### Changed` bullet** under `[Unreleased]` describing
  the reposition itself (one or two sentences naming the framing
  shift). This story does not create a `## [0.5.0]` section, does
  not pick a version, and does not date a release. The release
  commit owns those.

### Sequencing

Order matters. Recommended:

1. **README first.** Voice gets set here; everything else compresses
   from this. Edit the four affected sections in one pass.
2. **`AGENTS.md` and `CONTRIBUTE.md`.** Mirror the README framing in
   the contributor-facing prose.
3. **Manifests as a JSON group** (`package.json`, `plugin.json`,
   `marketplace.json`). Run `npm test` after this group — catches
   any JSON or format-check breakage immediately.
4. **Bootstrap (`using-97/SKILL.md`) last.** Highest-stakes file:
   loaded into every agent context, lint-checked against
   `SKILL_RULES`, exercised by smoke. Doing it last means the
   framing language has stabilized.
5. **`CHANGELOG.md`.** Write the framing line after the prose has
   stabilized.
6. Final `npm test` + cross-read grep.

### Risks and mitigations

- **Discoverability / SEO.** Demoting "*97 Things*" from the lead of
  every manifest description weakens exact-string match for "97
  Things plugin" searches. *Mitigation:* the full title appears in
  every manifest description (just demoted to the second clause),
  the `"97-things"` keyword in `plugin.json` is preserved, and the
  project name itself is `97`. Net SEO impact: small.
- **Scope-creep invitation.** "The classics of programming practice"
  is an open set; framing this way invites future PRs adding Knuth,
  K&R, *The Pragmatic Programmer*, *Code Complete*, *Clean Code*,
  etc. *Mitigation:* the out-of-scope section explicitly states this
  reposition does not signal openness to new sources; trigger fit
  remains the gate, not name recognition.
- **Markdown-italic regression in JSON.** *Mitigation:* manifest
  copy uses plain single-quoted strings, not `*…*`.
- **Legal/attribution clarity loss.** The current framing leans on
  "97 Things companion" partly as a CC-BY-3.0 attribution posture.
  *Mitigation:* `CONTENT-LICENSE.md` already holds the formal
  attribution and takedown policy and is left untouched; per-
  principle attribution remains in every `principles.md`. The README
  and manifests are user-facing copy, not the legal posture.
- **Project-name dissonance.** The project is named "97" but the
  framing now puts *97 Things* in second position. *Mitigation:* the
  new framing addresses this head-on by naming 97 Things as the
  namesake explicitly ("named for… and built in its spirit"), more
  honest than the current implicit framing where the name goes
  unexplained.
- **Lint / smoke regressions on shared files.** Several files in
  `AGENTS.md` rule 4's parallel-work-forbidden list change in
  lockstep. *Mitigation:* single-author single-session story; no
  parallel subagent dispatch; `npm test` after the manifest group
  and after the bootstrap edit minimum. Rollback is a single revert
  (no data, no version, no migration).
- **Content-vs-frame honesty.** *97 Things* is still the largest
  single source by principle count. *Mitigation accepted, not
  fully closed:* "in the spirit of" claims form-inheritance, not
  exclusive content-fidelity, and the README intro lists multiple
  sources alongside the book. We do not add a quantitative caveat.
  If readers find this misleading in practice, revisit.
