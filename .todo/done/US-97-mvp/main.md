# US-97-mvp

## Goal

Ship **97** v0.1.0 — an OpenCode plugin bundle that turns the book *[97 Things Every Programmer Should Know: Collective Wisdom from the Experts](https://www.oreilly.com/library/view/97-things-every/9780596809515/)* (O'Reilly, ed. Kevlin Henney) into behavior-shaping skills for coding agents. Each contributor's essay becomes a principle the agent applies in the right context — sourced from Birat Rai's [Medium walkthrough](https://biratkirat.medium.com/97-journey-every-programmer-should-accomplish-a0c53dbbfd47) of all 97 essays.

The plugin must install with a single line in `opencode.jsonc` (`"97@git+https://github.com/oribarilan/97.git"`), auto-register its skills directory, and inject a small bootstrap into the system prompt — mirroring the install UX of [`superpowers`](https://github.com/obra/superpowers).

## Definition of Done

- [ ] Repo cloned, scaffolded, and pushed to `https://github.com/oribarilan/97` with v0.1.0 tag
- [ ] After adding `"97@git+https://github.com/oribarilan/97.git#v0.1.0"` to a fresh `opencode.jsonc` and restarting OpenCode, `skill` tool lists all 9 themed skills + `using-97`
- [ ] System prompt contains the 97 bootstrap (verifiable by asking the agent "tell me about 97" in a fresh session)
- [ ] Each of the 9 themed skills has: situation-based trigger in description, "When to invoke" section with explicit **non-triggers**, distilled per-principle nuggets sourced from the original CC-BY book/GitBook (Medium as reading aid only), and a Red Flags table for rationalizations the agent might use to skip the skill
- [ ] `scripts/lint-skills.mjs` exits 0 (frontmatter, line budgets, required sections, principle-number coverage)
- [ ] `scripts/smoke-load.mjs` exits 0 (plugin imports without throwing, skills directory resolves)
- [ ] `README.md` documents what 97 is, what skills it ships, install instructions (pinned to `#v0.1.0`), credits the source book + every contributor distilled in this release, and includes the **content-licensing notice**
- [ ] `CONTENT-LICENSE.md` exists clarifying that MIT covers plugin code only; principle distillations are original commentary on publicly-discussed techniques
- [ ] At least one skill (`before-you-refactor`) has been **used by the human partner on ≥3 real refactor tasks** — installed, invoked, and judged useful before the remaining 8 skills are built
- [ ] After the **first parallel-built skill** lands, the human partner reviews it before the remaining 7 are dispatched (second human gate)
- [ ] **Trigger-overlap matrix** walked through manually before tagging: for each skill, one prompt that should fire it and one that should not

## Task Priority

The first three tasks are sequential (numeric prefixes). After `3-skill-before-you-refactor` is shipped and validated by the human partner, the remaining 8 themed skills are independent and can be built in parallel using the proven template — but with a **second human gate** after the first parallel skill lands.

1. `1-scaffold-plugin-bundle.md` — must come first; ships scaffold + lint/smoke scripts
2. `2-bootstrap-using-97.md` — depends on scaffold; ships a **placeholder** bootstrap. Final bootstrap (with verified per-skill trigger strings) is rewritten in `release-v0.1.0`
3. `3-skill-before-you-refactor.md` — MVP skill that proves the template; **FIRST HUMAN GATE** (≥3 real refactor uses) before continuing
4. After human approval of #3, dispatch ONE follow-up skill first (suggest: `domain-modeling` — smallest, lowest cost to redo); **SECOND HUMAN GATE** verifies the template generalizes
5. After second gate, dispatch remaining 7 skills in waves of 2-4 (not all 8 at once — see Parallelism below)
6. `release-v0.1.0.md` — last; rewrites bootstrap, runs lint/smoke, walks trigger-overlap matrix, tags

## Non-goals for v0.1.0

- Covering the 19 career/mindset principles (deliberately deferred — see exclusion list below)
- Automated content-quality checks (only structural lint is automated; content quality is human-judged)
- Optimizing the bootstrap's token cost beyond the 100-line budget
- Per-language or per-framework specializations of any principle
- Web UI, settings panel, or any user-facing surface beyond install + skill invocation

## Alternative scope (documented, not chosen)

The simplifier voice in plan review argued for **shipping v0.1.0 with only `before-you-refactor`** and treating subsequent skills as v0.2+, v0.3+ releases driven by real-usage feedback. We are choosing the broader scope, but if the second human gate fails (template doesn't generalize cleanly), fall back to a 2-3 skill v0.1.0 and ship the rest later.

## Cross-Cutting Concerns

### Voice & style (applies to every skill)

All skills MUST match the rigid imperative voice of `superpowers`:
- Frontmatter `description` starts with "Use when..." and names the trigger condition (not the topic)
- Body opens with **Overview** stating the core principle in one sentence
- Include a **Red Flags** table mapping rationalizations → reality (see `superpowers/skills/test-driven-development/SKILL.md` for the canonical pattern)
- Use "your human partner" (not "the user") when referring to the developer
- Use imperative mood: "Stop. Do X." not "You should consider doing X."
- When a principle has a memorable name from the book, use it as a section header verbatim (e.g., "The Boy Scout Rule", "Beware the Share")

### Source material policy (licensing & attribution)

The original *97 Things* essays are published under **CC-BY-3.0** at https://github.com/97-things/97-things-every-programmer-should-know — that is the **canonical source of truth** and the citation target for every principle. Birat Rai's Medium walkthrough is a **reading aid only**, not the source of record.

Workflow per skill:

1. Fetch the principle text from the **GitBook/GitHub mirror first** (CC-BY, free, stable). Use Medium only if the GitBook chapter is missing or unclear.
2. Fall back order: GitBook → GitHub `97-things` repo → Birat Rai's Medium post → skip the principle and note the gap in `principles.md`.
3. Distill each principle to **2-4 actionable sentences** capturing the underlying technique in your own words. Original commentary, not paraphrase of the essay's structure.
4. **No verbatim quotes longer than ~25 words** from book, GitBook, or Medium. Quote only short principle titles/section headers when they're already generic phrases ("The Boy Scout Rule", "Don't Repeat Yourself"). Avoid lifting unique phrasings (e.g., "WET Dilutes Performance Bottlenecks" → paraphrase).
5. Cite the original contributor by name in `principles.md`. Link the GitHub mirror chapter as primary; Medium link as supplementary.
6. Skip principles that are pure career/mindset advice and don't translate to "agent should do X when Y" — these are intentionally out of scope (see exclusion list below).
7. Record source provenance per principle in `principles.md` (which fallback was used, access date, any gaps).

`README.md` and `CONTENT-LICENSE.md` MUST state: this plugin is an **unofficial companion** to *97 Things Every Programmer Should Know*, not affiliated with O'Reilly, Kevlin Henney, or any contributor; MIT covers plugin code only; principle distillations are original commentary on publicly-discussed techniques and remain attributed to their original authors under CC-BY-3.0; if any contributor or rightsholder objects, the offending file is removed without argument.

### Skill precedence (conflict resolution)

When multiple skills could fire for the same prompt, resolve in this order:

1. **User instructions** (CLAUDE.md, AGENTS.md, direct prompts) override everything below
2. **Process skills (superpowers)** precede **content skills (97)** — `superpowers/brainstorming` runs before `97/working-with-users-and-team`; `superpowers/test-driven-development` decides *whether* to write a test, `97/testing-discipline` decides *what makes the test good*; `superpowers/verification-before-completion` decides *did it work*, `97/pre-commit-self-review` decides *is it well-considered*
3. **More specific 97 skill > broader 97 skill** — `before-you-refactor` wins over `writing-clean-code` when both could apply; `testing-discipline` wins over `writing-clean-code` for test code
4. **Never duplicate process** — 97 skills cite the relevant superpowers skill and defer; they don't re-implement TDD, brainstorming, or verification

This precedence is repeated in `using-97/SKILL.md` so the agent sees it on every session.

### File layout (every skill)

```
skills/<skill-name>/
├── SKILL.md         # Rigid trigger, when-to-invoke, workflow, Red Flags table, principles list
└── principles.md    # Long-form per-principle distillations with author + GitHub mirror link + source provenance
```

`SKILL.md` stays under its declared budget (loaded into agent context — token cost matters). `principles.md` is the **reference-only** companion: `SKILL.md` MUST NOT include the contents of `principles.md` and MUST NOT instruct the agent to always read it; principles.md is consulted on demand when the agent needs the deep cut on a specific principle.

### Skill grouping (locked) — 78 of 97 principles covered

The 9 themed skills and which book principles each one covers — do not relitigate this in individual tasks. **78 principles covered, 19 deliberately excluded** (pure career/mindset, not agent-actionable).

| Skill | Trigger | Principles (numbered as in the Medium post) | # |
|---|---|---|---|
| `writing-clean-code` | About to write a new function/class or modify ≥3 lines of non-trivial logic (NOT typos, config, or test code) | #5, #13, #15, #17, #30, #39, #62, #75, #76, #91, #93, #94 | 12 |
| `before-you-refactor` | About to refactor or "clean up" existing code | #6, #8, #24, #31, #74 | 5 |
| `testing-discipline` | Writing tests or test data | #25, #60, #80, #81, #82, #83, #92, #95 | 8 |
| `api-and-interface-design` | Designing a public API, function signature, module boundary, or type | #7, #19, #32, #35, #55, #59, #65, #66, #84 | 9 |
| `pre-commit-self-review` | About to commit, finish a task, hand off code, or summarize work for review | #1, #9, #14, #16, #42, #47, #58, #69, #90 | 9 |
| `error-and-correctness-traps` | Writing error handling, comparing/calculating with floats, writing concurrent code, calling a remote process, adding a singleton/global, choosing a data structure for a hot path, or adding/changing log statements | #21, #26, #29, #33, #41, #46, #57, #73, #89 | 9 |
| `build-deploy-and-tooling` | Authoring/changing build scripts, CI config, deploy pipelines, repo setup, or evaluating a new tool for adoption | #4, #10, #20, #38, #40, #61, #63, #68, #78, #79, #88 | 11 |
| `domain-modeling` | Introducing a new top-level type/table/domain concept, or renaming an existing one | #2, #11, #12, #23, #48 | 5 |
| `working-with-users-and-team` | Designing UX, gathering requirements, estimating, or communicating with stakeholders | #3, #36, #50, #64, #77, #85, #86, #87, #96, #97 | 10 |

Total: **78 / 97**. Principles intentionally **not** covered (pure career/mindset, not agent-actionable): #18, #22, #27, #28, #34, #37, #43, #44, #45, #49, #51, #52, #53, #54, #56, #67, #70, #71, #72 (19 total).

### Parallelism

After task `3` is approved by the human partner, dispatch follow-up skill tasks to `@fixer` subagents — but **do not fan out to all 8 at once**. Process:

1. Dispatch ONE follow-up skill first (suggest: `domain-modeling` — smallest principle count, lowest cost to redo)
2. Human reviews → if template generalized cleanly, proceed; if not, fix the template before more skills launch
3. Dispatch remaining 7 in **waves of 2-4**, not all at once. Reasons: Medium/GitBook fetch reliability, voice drift across many subagents, cross-references between skills that don't exist yet
4. Between waves, run `scripts/lint-skills.mjs` to catch frontmatter/budget regressions early
5. Forbid parallel agents from editing shared files (`README.md`, `using-97/SKILL.md`, `package.json`) — those updates land in the release task
6. Each task file is self-contained — a fixer needs only that task file + this `main.md` + the proven `before-you-refactor` skill as a template + pre-fetched source material (see `2.5-prefetch-sources` if added)

### Reference templates (vendored)

To keep the plan reproducible by subagents that don't have access to the author's machine, vendor these reference files into `.todo/US-97-mvp/reference/` as part of task #1:

- `superpowers-plugin.js` — copy of `~/.config/dotfiles/opencode/superpowers/.opencode/plugins/superpowers.js` (plugin layout & bootstrap pattern)
- `using-superpowers-SKILL.md` — copy of the bootstrap skill structure
- `test-driven-development-SKILL.md` — canonical Red Flags / Iron Law / imperative voice pattern

Public mirrors as fallback: https://github.com/obra/superpowers

### OpenCode plugin API (verified against superpowers v5.0.7)

This is the API surface task #1 must mirror — locked, no further investigation needed:

- **Plugin entry**: named export (e.g., `export const NinetySevenPlugin = async ({ client, directory }) => { ... }`), NOT default. Discovered from `package.json` `main`.
- **Skill registration**: `config` hook pushes the absolute `skills/` path into `config.skills.paths`. OpenCode lazily discovers skill files from those paths.
- **Skill names are flat** — agents invoke by bare name (`before-you-refactor`), NOT prefixed by plugin (`97/before-you-refactor` does NOT work). All references in this plan use bare names.
- **Bootstrap injection**: `'experimental.chat.messages.transform'` hook prepends bootstrap content to the first user message (not a system message — avoids per-turn token bloat and Qwen multi-system-message issues). Idempotent via substring marker (`EXTREMELY_IMPORTANT`).
- **Bootstrap content**: built dynamically from `using-97/SKILL.md` body (frontmatter stripped) wrapped in `<EXTREMELY_IMPORTANT>...</EXTREMELY_IMPORTANT>` + tool-mapping block. Mirror superpowers' `getBootstrapContent()` helper.
- **Zero runtime deps**: Node built-ins only (`path`, `fs`, `os`, `url`).

### Package name (locked)

Package name is `97`. Task #1 verifies this works in npm (leading digits are spec-allowed), in OpenCode's plugin loader, and in skill discovery. **Only if any of these reject `97`** does task #1 fall back to `ninety-seven` as the npm package name while keeping "97" as the brand and skill `name:` prefix. Decision recorded in `package.json` + README.
