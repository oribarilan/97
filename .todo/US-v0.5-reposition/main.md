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
97 as a *97 Things* companion: the `README.md ## What this is`
section, the four manifest `description` fields, the `AGENTS.md`
"What this repo is" line, and one bootstrap line that uses the word
"canonical." Those surfaces now read inconsistently with the
shipped content and with the FAQ.

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
less self-important register.

## Hard dependencies

- **None.** v0.4.0's content is already shipped; this story is purely a
  framing pass over user-visible copy.

## Definition of Done

- [ ] `README.md` `## What this is` rewritten to lead with what the
      skills do, name specific authors as the actual content source,
      and frame 97 Things as namesake/inspiration ("in its spirit"),
      not as the primary corpus. Section length stays in the same
      neighborhood as today (no expansion).
- [ ] `package.json` `description` rewritten in the new framing.
- [ ] `.claude-plugin/plugin.json` `description` rewritten in the new
      framing.
- [ ] `.claude-plugin/marketplace.json` — both the root `description`
      and the `plugins[0].description` rewritten in the new framing.
- [ ] `AGENTS.md` "What this repo is" first paragraph rewritten in the
      new framing.
- [ ] `skills/using-97/SKILL.md` Overview retires the word
      "canonical" — replaces "*97 Things*… and adjacent canonical
      sources" with the new framing language. No other bootstrap
      changes; trigger map and Priority section untouched.
- [ ] `CHANGELOG.md` — moves the existing `[Unreleased]` →
      `### Documentation` bullet (FAQ + tagline header) into a new
      `## [0.5.0]` section with a 1–2 sentence framing line, and
      adds a `### Changed` bullet describing the reposition. Two
      bullets total in the new section. New `[Unreleased]` is empty.
- [ ] `npm test` (lint + format-check + smoke) passes.
- [ ] Manual cross-read: README intro + manifest descriptions + AGENTS
      first paragraph + bootstrap Overview all use the same framing
      language. No surface still calls 97 a "*97 Things* companion"
      or uses "canon"/"canonical."

## Out of scope

- The actual v0.5.0 release commit itself — `package.json` `version`,
  `.claude-plugin/plugin.json` `version`,
  `.claude-plugin/marketplace.json` `plugins[0].version`, and the git
  tag are release activities per `AGENTS.md` rule 3, not feature
  work. The release happens in a separate, deliberate commit.
- `CONTENT-LICENSE.md` — already restructured in v0.4.0 with a
  "Beyond *97 Things* — fair-use commentary on canonical sources"
  section. The word "canonical" appears there in a legal/attribution
  context where it is the precise term; not retired.
- Tagline ("Your agent, on the shoulders of giants.") — stays.
- FAQ entry — stays.
- Credits ordering — stays. *97 Things* remains the first credit
  (it is the namesake; that's correct under the new framing too).
- Skill content / `principles.md` files — untouched.
- Trigger map in `using-97/SKILL.md` — untouched.
- New skills, new sources, new principles — none.
- Tagline rework, README header rework — already shipped earlier in
  this branch.
- Versioning decision authority — the release commit author confirms
  whether v0.5.0 is the right tag. Story-level naming follows the
  user's expressed intent.

## Cross-Cutting Concerns

### Voice and language

- "The classics of programming practice" is the chosen umbrella phrase.
  Not "canon," not "canonical sources," not "established literature,"
  not "modern programming canon." The phrase reads as how a senior
  engineer would actually talk.
- "In the spirit of" is the chosen lineage phrase. It explicitly
  describes *form-inheritance* rather than *content-fidelity*.
- The README intro paragraph that lists authors does the credibility
  work itself — no umbrella-term decoration around the names. Names
  carry the meaning.
- Manifest descriptions (no room to list authors) use "the classics
  of programming practice" since the umbrella phrase is doing the
  credibility work the name list does in the README.
- Apply `humanizer` discipline as the final pass: cut promotional
  language, copula avoidance ("serves as"), em-dash overuse,
  rule-of-three padding, and the AI-vocabulary words ("crucial,"
  "pivotal," "underscore," "showcase," etc.).

### Final copy targets

**README `## What this is` (target wording):**

> Skills your coding agent invokes at the moment they apply — when
> it's about to refactor, write a test, design an API, or commit.
> They distill established practice from the classics of programming:
> Fowler on refactoring smells, Wlaschin on domain modeling, Nygard
> on production resilience, Ousterhout and Liskov on API shape,
> GOOS and Meszaros on testing, the 12-factor app on configuration
> and deploys.
>
> The project is named for *97 Things Every Programmer Should Know*
> (O'Reilly, ed. Kevlin Henney) and built in its spirit: one
> hard-won principle at a time, distilled small, applied where it
> matters. Every principle ships with attribution to the original
> author.

**Manifest descriptions (target wording):**

| File | Field | Text |
|---|---|---|
| `package.json` | `description` | "Skills distilled from the classics of programming practice, in the spirit of *97 Things Every Programmer Should Know*. Plugin for Claude Code, GitHub Copilot CLI, and OpenCode." |
| `.claude-plugin/plugin.json` | `description` | "Skills distilled from the classics of programming practice, in the spirit of *97 Things Every Programmer Should Know*. Your coding agent invokes them when about to refactor, write a test, design an API, or commit." |
| `.claude-plugin/marketplace.json` (plugin entry) | `description` | Same as `plugin.json`. |
| `.claude-plugin/marketplace.json` (root) | `description` | "Marketplace for the 97 plugin — skills distilled from the classics of programming practice, in the spirit of *97 Things Every Programmer Should Know*." |

**AGENTS.md "What this repo is" first paragraph (target wording):**

> `97` is a multi-harness plugin that ships behavior-shaping skills
> distilled from the classics of programming practice, in the spirit
> of *97 Things Every Programmer Should Know* (O'Reilly, ed. Kevlin
> Henney).

**Bootstrap (`using-97/SKILL.md`) Overview — target rewrite of the
opening sentence only:**

> **97** distills principles from the classics of programming
> practice, in the spirit of *97 Things Every Programmer Should Know*
> (O'Reilly, ed. Kevlin Henney; CC-BY-3.0 originals at
> https://github.com/97-things/97-things-every-programmer-should-know),
> into trigger-based skills.

The rest of the Overview ("You have eleven themed skills plus this
bootstrap…") is untouched.

### Risks and mitigations

- **Risk: legal/attribution clarity loss.** The current framing leans
  hard on "97 Things companion" partly as a CC-BY-3.0 attribution
  posture. *Mitigation:* `CONTENT-LICENSE.md` already holds the
  formal attribution and takedown policy and is left untouched; per-
  principle attribution remains in every `principles.md`. The README
  and manifests are user-facing copy, not the legal posture.
- **Risk: project-name dissonance.** The project is named "97" but
  the framing now puts *97 Things* in second position. *Mitigation:*
  the new framing addresses this head-on by naming 97 Things as the
  namesake explicitly ("named for… and built in its spirit"), which
  is more honest than the current implicit framing where the name
  goes unexplained.
- **Risk: lint / smoke regressions on shared files.** The reposition
  touches several files concurrently. *Mitigation:* this is a
  single-author single-session story; no parallel subagent
  dispatch. Run `npm test` after each file group.

### Shared-files ledger

This story edits files listed in `AGENTS.md` rule 4 as forbidden
under parallel work (`README.md`, `package.json`, `using-97/SKILL.md`,
`AGENTS.md`, `.claude-plugin/`). Compliance: this story is **not**
being executed by parallel subagents; all edits land sequentially
in one session. No subagent dispatch within this story.
