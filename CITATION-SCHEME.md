# CITATION-SCHEME.md

## Overview

This document decides how every principle in the bundle is identified,
cited, and lint-enforced. It is read by humans and agents writing or
reviewing per-skill `principles.md` files and the skill manifest in
`scripts/lint-skills.mjs`. It does not cover voice or writing style —
those rules live in the `humanizer` skill and in each `SKILL.md`'s own
discipline. It does not decide which principles ship in which skill —
that is per-skill editorial work, settled inside each enrichment task.

## ID grammar

Every principle in the bundle has a stable string ID:

```
<source-key>/<principle-key>
```

- `source-key` is short, conventional, and registered in the **Sources**
  table below. Matches `[A-Za-z0-9]+`.
- `principle-key` is a PascalCase identifier (e.g. `LongMethod`), an
  original numeric ID for sources that have one (e.g. `74`), or a Roman
  numeral where the source uses one (e.g. `III` for 12-factor). Matches
  `[A-Za-z0-9]+`.
- Full ID matches: `^[A-Za-z0-9]+/[A-Za-z0-9]+$`.

**Stability rule.** Once a principle ID has shipped in a release, the
ID never renames. Cross-references inside the repo and external links
to GitHub anchors depend on the ID being a fixed point. If a key
absolutely must change, add a deprecated alias and keep the old ID
resolving for one release cycle.

Examples:

- `97/74` — *97 Things* essay 74.
- `Fowler/LongMethod` — Fowler smell, "Long Method".
- `RI/CircuitBreaker` — *Release It!* stability pattern.
- `12F/III` — Twelve-Factor factor III (config).

## Sources

The accepted source-key registry. New sources require a row added to
this table in the same PR as the first enrichment that uses them.

| Key | Source | Author / Editor | Year | License posture |
|---|---|---|---|---|
| `97` | *97 Things Every Programmer Should Know*, O'Reilly | ed. Kevlin Henney | 2010 | CC-BY-3.0 |
| `Fowler` | *Refactoring* (2nd ed.), Addison-Wesley | Martin Fowler | 2018 | fair-use commentary |
| `RI` | *Release It!* (2nd ed.), Pragmatic | Michael Nygard | 2018 | fair-use commentary |
| `Wlaschin` | *Domain Modeling Made Functional*, Pragmatic | Scott Wlaschin | 2018 | fair-use commentary |
| `King` | "Parse, don't validate" (lexi-lambda.github.io) | Alexis King | 2019 | fair-use commentary |
| `12F` | The Twelve-Factor App (12factor.net) | Adam Wiggins / Heroku | 2011 | fair-use commentary |
| `CD` | *Continuous Delivery*, Addison-Wesley | Jez Humble & David Farley | 2010 | fair-use commentary |
| `GOOS` | *Growing Object-Oriented Software, Guided by Tests*, Addison-Wesley | Steve Freeman & Nat Pryce | 2009 | fair-use commentary |
| `xUnit` | *xUnit Test Patterns*, Addison-Wesley | Gerard Meszaros | 2007 | fair-use commentary |
| `SRE` | *Site Reliability Engineering*, O'Reilly | ed. Beyer / Jones / Petoff / Murphy | 2016 | fair-use commentary |
| `OE` | *Observability Engineering*, O'Reilly | Charity Majors / Liz Fong-Jones / George Miranda | 2022 | fair-use commentary |
| `OTel` | OpenTelemetry semantic conventions (opentelemetry.io) | OpenTelemetry project | n/a | Apache-2.0 / CC-BY-4.0 |
| `Liskov` | "Data Abstraction and Hierarchy", CACM | Barbara Liskov | 1987 | fair-use commentary |
| `Hyrum` | Hyrum's Law (hyrumslaw.com) | Hyrum Wright | n/a | informal canon (cross-reference target only; no principle row) |
| `Ousterhout` | *A Philosophy of Software Design* (2nd ed.), Yaknyam Press | John Ousterhout | 2021 | fair-use commentary |

**`DORA` is not registered in v1.0.** *Accelerate* / DORA's four key
metrics are organizational measurement, not code-time agent behavior.
Considered and explicitly cut. If a future enrichment task confirms a
trigger-actionable use, the task adds the row in the same PR.

**`Hyrum` does not have a principle row.** The source key is registered
so cross-references in Red Flags resolve, but no `## Hyrum/Law — …`
heading exists in any `principles.md`. The pattern is documented in
`enrich-api-design-ousterhout-liskov-king.md`.

**Pre-registration is intentional, not aspirational.** Sources whose
enrichment tasks are still under consideration (e.g. Martin's *Clean
Code*, Hunt & Thomas's *Pragmatic Programmer*, Cagan's *Inspired*,
*The Phoenix Project*) are **not** pre-registered. The bottleneck is
deliberate: every new source decision becomes visible in the same PR
as the first principle that uses it.

## ID uniqueness

A given principle ID appears in exactly one skill's
`SKILL_RULES.principles` array. The matching `principles.md` file owns
the canonical `## <id> — Title` heading. Cross-referencing skills
surface the principle in their `SKILL.md` (Red Flags row, checklist
item) using the bare ID in backticks but do **not** add it to their
own `SKILL_RULES.principles` and do **not** add a `## <id> — Title`
heading in their own `principles.md`. A cross-reference heading of
the form `## (cross-reference) <id> — Title` is permitted and is
excluded from uniqueness counts by the lint regex (which is anchored
to bare-ID `## <id> —` headings).

**v0.3 carryover resolved in `0b`.** The v0.3 cross-listing of
`97/26` and `97/29` in both `error-and-correctness-traps` and
`security-and-trust-boundaries` violates this rule. The Canonical-home
table below settles the resolution: canonical home is
`error-and-correctness-traps`; `security-and-trust-boundaries` keeps
a Red Flags surfacing with bare-ID cross-references and drops the IDs
from its `SKILL_RULES.principles`. The migration in
`0b-citation-scheme-migration.md` performs the trim.

## Canonical-home table

Cross-cutting principles whose triggers could validly fire under more
than one skill have their owning skill named here, up front, before
any enrichment runs. Enrichment tasks add IDs only to the canonical
home; cross-referencing skills surface the rule in `SKILL.md` only.

| Principle ID | Canonical home | Cross-references | Note |
|---|---|---|---|
| `97/26` (Don't Ignore That Error!) | `error-and-correctness-traps` | `security-and-trust-boundaries` | Resolves v0.3 cross-listing in `0b`. |
| `97/29` (Don't Rely on "Magic Happens Here") | `error-and-correctness-traps` | `security-and-trust-boundaries` | Resolves v0.3 cross-listing in `0b`. |
| `Fowler/PrimitiveObsession` | `domain-modeling` | `before-you-refactor`, `api-and-interface-design`, `writing-clean-code` | Closest trigger: introducing a domain concept. |
| `King/ParseDontValidate` | `api-and-interface-design` | `domain-modeling`, `security-and-trust-boundaries` | Boundary parsing is contract design. |
| `Wlaschin/InvalidStatesUnrepresentable` | `domain-modeling` | `api-and-interface-design` | Internal-invariant counterpart to `King/ParseDontValidate`. |
| `12F/XI` (logs as event streams) | `build-deploy-and-tooling` | `error-and-correctness-traps`, `observability` | Owns log *transport*; trap skill owns *what not to log*; observability owns *content shape*. |
| `OTel/StructuredLogs` | `observability` | `build-deploy-and-tooling`, `error-and-correctness-traps` | Log *content shape*. |
| `RI/CircuitBreaker` | `error-and-correctness-traps` | `observability` (open-circuit events should be observable) | Distinct from existing `97/9` retry/backoff territory. |
| `97/8` (Boy Scout Rule) | `before-you-refactor` | none | Already canonical here; verify no enrichment duplicates. |
| `97/30` (Don't Repeat Yourself) | `writing-clean-code` | none | Already canonical here; verify no enrichment duplicates. |

New cross-cutting principles surfaced mid-enrichment add a row here in
the same PR as the enrichment that surfaced them. The closing
`99a-overlap-matrix-audit.md` task **verifies** this table; it does
not **create** it.

## Heading format in `principles.md`

Every principle starts with:

```markdown
## <full-id> — <Title>
```

Examples:

- `## 97/74 — The Road to Performance Is Littered with Dirty Code Bombs`
- `## Fowler/LongMethod — Long Method`
- `## RI/CircuitBreaker — Circuit Breaker`
- `## 12F/III — Config in the Environment`

Followed by the unified five-field metadata block.

## License posture and CC-BY-3.0 obligations

CC-BY-3.0, the license of the *97 Things* GitHub mirror, requires four
things: attribute the author, identify the license, link the original
work, and indicate any modifications. The unified metadata block
satisfies all four:

- `Author:` field — attribution.
- `Source:` field — link to original.
- `License:` field — license identification.
- The fact that the entry is in *our* `principles.md` under a
  `**Distillation.**` paragraph headed "**own words**" is the
  modification notice. Each `principles.md` carries a file-level note
  ("Distillations below are original commentary in our own words…")
  that makes this explicit.

For copyrighted-book sources (Fowler, Nygard, Wlaschin, Ousterhout,
GOOS, xUnit, SRE, *Observability Engineering*, *Continuous Delivery*),
no license obligation flows to us beyond fair-use posture: we cite the
source, write commentary in our own words, do not reproduce source
text. The `License: fair-use commentary` field records this posture
explicitly.

## Per-principle metadata block — unified template

Five fields, identical shape regardless of source mode. Calibrated to
license-minimum plus the agent-application field that ties the
principle into `SKILL.md`. No hygiene fields.

```markdown
## <full-id> — <Title>

**Author:** <Name>
**Source:** <citation — see formats below>
**License:** <one-liner — see formats below>

**Distillation.** <own words; no quoted source text; ≤25 words verbatim if absolutely necessary>

**Agent application.** <how the principle is wired into SKILL.md>
```

### Source field formats by source mode

- **CC-BY-3.0 sources** (`97/*`): URL to the canonical chapter on the
  GitHub mirror. Example:
  `https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_74/README.md`
- **Copyrighted-book sources** (`Fowler/*`, `RI/*`, `Wlaschin/*`,
  `Ousterhout/*`, `GOOS/*`, `xUnit/*`, `SRE/*`, `OE/*`, `CD/*`):
  `<Book title>, <edition>, <publisher> <year>, ch./§ <ref>`. Example:
  `Refactoring, 2nd ed., Addison-Wesley 2018, ch. 3`.
- **Online-essay or web sources** (`King/*`, `12F/*`, `Hyrum/*`,
  `OTel/*`): URL to the canonical version.

### License field formats by source mode

- **CC-BY-3.0 sources**: `CC-BY-3.0`.
- **Copyrighted-book sources**: `fair-use commentary`.
- **Permissively-licensed online sources** (e.g. OpenTelemetry): the
  actual license name (`Apache-2.0`, `CC-BY-4.0`).

### Why no hygiene fields

Earlier `principles.md` files in the repo carried seven fields per
principle: `Author`, `Source (primary)`, `Source (reading aid)`,
`Source used`, `Access date`, `Gaps`, `Distillation`, `Agent
application`. Four of those (`Source (reading aid)`, `Source used`,
`Access date`, `Gaps`) were contributor-hygiene notes with no license
obligation behind them. The unified five-field block keeps everything
CC-BY-3.0 actually requires plus the agent-application field, and
drops the rest. Provenance (when, by whom, with what reading aids) is
recoverable from `git log` for anyone who needs it; it does not need
to live inline in agent context.

## Lint regex

`scripts/lint-skills.mjs` walks each skill's `principles.md` and
asserts every ID listed in `SKILL_RULES[skill].principles` appears as
a heading. The matcher is anchored to `##` headings so freeform body
mentions of an ID do not satisfy the assertion:

```
/^##\s+([A-Za-z0-9]+\/[A-Za-z0-9]+)\b/gm
```

Captured group 1 is the full principle ID. The `(cross-reference)`
prefix used by non-canonical homes is excluded automatically because
the regex anchors on `##\s+<id>` directly after the heading marker.

## `SKILL_RULES.principles` schema

Type `string[]`. One field per skill. Migration semantics: existing
integer entries become `97/<int>` strings (e.g.
`[6, 8, 24, 31, 74]` → `["97/6", "97/8", "97/24", "97/31", "97/74"]`).
New non-`97` principles append IDs to the same array. There is no
parallel `canonPrinciples` field — the `97/*` and non-`97` IDs share
the same list.

## README phrasing rule

The README does not carry count-coupled headline phrases like "78 of
the book's 97 principles." A counted phrase couples the README to a
specific principle inventory and breaks every time an enrichment task
ships. Replace any such phrase with a description like:

> Trigger-based skills distilled from *97 Things* and adjacent
> canonical sources. Per-skill `principles.md` files list every
> source.

v1.0 does not reframe the README's "What this is" section beyond this
constraint. A larger reposition is deferred to v2.0.

## Cross-reference convention

Inside `SKILL.md` or `principles.md`, refer to another principle by
its full ID in backticks:

```markdown
See also `Fowler/LongMethod` (in `before-you-refactor`).
```

File paths are not used for cross-references — IDs are stable, file
paths are not.

## Agent output policy: silent application

The agent applies principles **silently** in user-facing responses.
Concretely:

- The agent does not surface author names, book titles, or essay IDs
  (`97/74`, `Fowler/LongMethod`, etc.) in responses to the end user.
- The agent applies the principle and explains the reasoning in plain
  terms ("this function is doing too many things; let me extract a
  helper") without name-dropping the source.
- Citations exist for repo provenance and CC-BY-3.0 compliance, not
  for user-facing authority.

The trigger taxonomy is the moat; the moat works whether or not the
agent name-drops. Silent application keeps user-facing output clean
and avoids turning the plugin into indirect advertising for source
books.

The actual one-line Priority rule that wires this into agent behavior
lands in `using-97/SKILL.md` as part of `0b-citation-scheme-migration.md`.

## What this document does not cover

- Voice rules — those live in `humanizer`.
- Trigger-actionability bar — that lives in `main.md` cross-cutting
  concerns and per-skill `SKILL.md` discipline.
- Per-skill principle selection — that lives in each enrichment task.
- License/copyright posture per source — that lives in
  `CONTENT-LICENSE.md`.
