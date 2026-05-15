<h1 align="center">97</h1>

<p align="center"><strong>Your agent, on the shoulders of giants.</strong></p>

<p align="center">
  <a href="https://github.com/oribarilan/97/actions/workflows/test.yml"><img src="https://github.com/oribarilan/97/actions/workflows/test.yml/badge.svg?branch=main" alt="CI"></a>
</p>

<p align="center"><em>Early beta. Works on Claude Code, GitHub Copilot CLI, and OpenCode.</em></p>

<p align="center">
  <a href="#install">Install</a> ·
  <a href="#whats-inside">What's inside</a> ·
  <a href="#does-it-work">Does it work?</a> ·
  <a href="#faq">FAQ</a> ·
  <a href="#credits">Credits</a> ·
  <a href="#development">Development</a>
</p>

---

## What this is

Skills your coding agent uses at the moment of decision: when it's about
to refactor, write a test, design an API, or commit. They draw on
Fowler on refactoring, 12-factor on configuration and deploys,
Ousterhout and Liskov on API design, Nygard on resilience patterns,
and others.

The project is named after *97 Things Every Programmer Should Know*
(O'Reilly, ed. Kevlin Henney) and follows the same idea: one principle
at a time, applied when it matters. Every principle is attributed to
its original author. Principles are language-agnostic and durable.

## Install

*Works on Linux, macOS, and Windows. Node 18+.*

Three supported harnesses. Pick the one you use.

### Claude Code

```
/plugin marketplace add oribarilan/97
/plugin install 97@97-marketplace
```

Updates ship via the marketplace; run `/plugin update 97` when a new version is available.

### GitHub Copilot CLI

```sh
copilot plugin marketplace add oribarilan/97
copilot plugin install 97@97-marketplace
```

Updates ship via the marketplace; run `copilot plugin update 97` when a new version is available.

### OpenCode

Add to your OpenCode config file.

```jsonc
{
  "plugin": [
    "97@git+https://github.com/oribarilan/97.git"
  ]
}
```

Restart OpenCode. The plugin pulls the latest commit on each restart.

<details>
<summary><strong>Advanced: pinned install</strong></summary>

For reproducible behavior across sessions, pin to a specific tag (`#vX.Y.Z`):

```jsonc
{
  "plugin": [
    "97@git+https://github.com/oribarilan/97.git#v0.5.0"
  ]
}
```

</details>

## What's inside

| Skill | When it applies |
|---|---|
| `using-97` | Always — entry skill that loads the trigger map |
| `before-you-refactor` | Considering, evaluating, or performing a refactor, restructure, cross-file rename, or cleanup |
| `clean-code` | Writing or reviewing functions, classes, naming, or ≥3 lines of non-trivial logic (includes Single Responsibility Principle (SRP), DRY, KISS, YAGNI) |
| `domain-modeling` | Introducing, reviewing, or renaming a top-level type/table/domain concept, or deciding where state lives |
| `api-design` | Designing or reviewing a public API, function signature, module boundary, exported type, or any contract other code depends on (includes LSP, SRP at the boundary) |
| `testing-discipline` | Writing or reviewing tests, designing test data, naming a test, choosing what to assert, or writing test helpers/mocks/fixtures |
| `correctness-traps` | Writing or reviewing error handling, floating-point math, concurrent code, remote calls, singletons, hot-path data structures, or high-volume log statements |
| `security-and-trust-boundaries` | Writing or reviewing code that parses user input, builds SQL/shell commands, handles secrets/credentials, changes auth checks, deserializes untrusted data, or constructs paths/URLs from input |
| `observability` | Writing or reviewing request handlers, RPCs, or background jobs for production; adding tracing, metrics, or structured-log calls; or making diagnosability decisions |
| `build-deploy-and-tooling` | Writing, reviewing, or changing build scripts, CI config, deploy pipelines, repo setup, or evaluating a new tool/dependency |
| `self-review` | About to commit, finish a task, open a PR, summarize work, or when asked for a review or hand-off of your own work |
| `working-with-users-and-team` | Gathering or interpreting requirements, estimating effort, or communicating with stakeholders about what to build |

12 skills total: one entry skill plus 11 themed skills. Every principle
is cited and attributed in the skill's `principles.md`.

### Giants

Every principle the agent applies is attributed to its original author.
Each skill ships a `principles.md` next to its `SKILL.md` with, per
principle: the author, a link to the source (CC-BY-3.0 essay, book
chapter, RFC, or specification as appropriate), our paraphrase, and
how the agent applies it.

The sources currently cited:

- *97 Things Every Programmer Should Know* — Kevlin Henney (ed.) and contributors. Namesake; principles across most skills.
- Martin Fowler — *Refactoring*. Code smells (Long Method, Primitive Obsession, and others).
- Scott Wlaschin — *Domain Modeling Made Functional*. Make invalid states unrepresentable.
- Michael Nygard — *Release It!* Stability patterns (circuit breaker, timeout, bulkhead, and others).
- Adam Wiggins — *The Twelve-Factor App*. Config in the environment, build/release/run separation, and other deploy hygiene.
- Jez Humble & David Farley — *Continuous Delivery*. Pipeline as code.
- Steve Freeman & Nat Pryce — *Growing Object-Oriented Software, Guided by Tests*. Listen to test pain.
- Gerard Meszaros — *xUnit Test Patterns*. Test smells (mystery guest, fragile test, and others).
- John Ousterhout — *A Philosophy of Software Design*. Deep modules; define errors out of existence.
- Barbara Liskov — the Liskov Substitution Principle.
- Alexis King — [*Parse, Don't Validate*](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/).
- Google SRE — *Site Reliability Engineering*. The four golden signals.
- OpenTelemetry / W3C — Trace Context, structured-log conventions.
- Charity Majors, Liz Fong-Jones, George Miranda — *Observability Engineering*. Cardinality discipline.

You can ask the agent at any time: *"Who wrote the principle you just
applied, and why does it say what it says?"* The agent will open the
relevant `principles.md` and tell you who wrote it, link the source,
and explain the reasoning. 97 doubles as a reading list — the
principles point back to the books and essays they came from.

The `security-and-trust-boundaries` and `observability` skills are
mostly written for this project, drawing on sources outside *97 Things*;
see `CONTENT-LICENSE.md`.

## Does it work?

Standard coding benchmarks (e.g., SWE-bench) test
whether an agent produces *working* code: pass the tests, fix the bug,
return the right answer. An agent can score 100% on SWE-bench with
f-string SQL and a god-function. Those benchmarks don't measure what 97
targets: whether the agent writes code a senior engineer would approve.

We built a craft-quality eval instead. 11 scenarios (one per skill),
each with a latent craft issue the skill should catch. Each scenario
runs 15 times on two arms: with 97 and without. An independent judge
(claude-opus-4.7) compares both diffs blindly on correctness, code
quality, and skill-specific criteria.

| | Wins | Never worse |
|---|---|---|
| **claude-opus-4.6** | **77%** | **95%** |
| **gpt-5.5** | **62%** | **77%** |

Per-skill results — win rate with ties in parentheses:

| Skill | gpt-5.5 | opus-4.6 |
|---|---|---|
| observability | 93% (7%) | 100% |
| security | 87% | 27% (67%) |
| api-design | 70% (3%) | 93% |
| clean-code | 70% (10%) | 70% (17%) |
| build-deploy | 67% (23%) | 100% |
| domain-modeling | 67% (27%) | 80% (3%) |
| working-with-users | 63% (7%) | 100% |
| before-you-refactor | 60% (3%) | 93% (7%) |
| self-review | 50% (3%) | 20% (80%) |
| testing-discipline | 50% (3%) | 90% |
| correctness-traps | 3% (77%) | 77% (20%) |

These scenarios started as an internal eval to avoid regressions and
track progress across 97 versions. They're custom-built to surface
each skill's value, not pulled from an established benchmark, but the
results felt worth sharing. If you know of a benchmark that would be a
good fit, please [open an issue](https://github.com/oribarilan/97/issues)
and I'll run it.

## FAQ

### How does 97 compare to popular plugins like `superpowers` or `BMAD`?

They sit at different layers, so you can run them side by side:

| Layer | Project | What it changes |
|---|---|---|
| **Methodology** | [`BMAD-METHOD`](https://github.com/bmad-code-org/BMAD-METHOD) | Which *role* the agent plays and which *phase* of the SDLC it's in (PM, Architect, Dev, SM…) |
| **Process** | [`superpowers`](https://github.com/obra/superpowers) | *How* the agent works — when to plan, how to debug, when work is verified |
| **Craft** | **`97`** | *What* makes the code good once the agent is writing — naming, API shape, error handling, testing, security |

Take writing a test:

- `BMAD` picks *who* on the agent team writes it (the Dev persona).
- `superpowers/test-driven-development` decides *whether* a test gets written.
- `97/testing-discipline` decides *what makes that test any good*.

97's entry skill draws an explicit line at the superpowers boundary: process
skills run first. `superpowers/verification-before-completion` asks *did it work*;
`97/self-review` asks *is it well-considered*.

### Where do SOLID, DRY, KISS, YAGNI live in 97?

Partially, and on purpose. SRP is named twice — in `clean-code` for one-reason-to-change at unit scope, and in `api-design` for the same check at module boundaries; `before-you-refactor` carries the SRP trigger to consider a split. LSP is in `api-design`. DRY is in `clean-code`. KISS and YAGNI surface as Red Flags in `clean-code` against speculative knobs and unused hooks.

OCP, ISP, and DIP are not promoted by name. The substance closest to ISP and DIP lives in `api-design` as narrow interfaces, abstractions at boundaries, and Ousterhout's deep modules. OCP is intentionally left aside — speculative extension points conflict with YAGNI. The Giants list above is built from authors and works, not from the SOLID acronym.

## Credits

- *97 Things Every Programmer Should Know: Collective Wisdom from the Experts*
  — O'Reilly, ed. Kevlin Henney
  ([book](https://www.oreilly.com/library/view/97-things-every/9780596809515/),
  [CC-BY-3.0 source mirror](https://github.com/97-things/97-things-every-programmer-should-know))
- Birat Rai's
  [97-day Medium walkthrough](https://biratkirat.medium.com/97-journey-every-programmer-should-accomplish-a0c53dbbfd47)
  of every essay (used as a reading aid)
- [`superpowers`](https://github.com/obra/superpowers) by Jesse Vincent for the multi-harness distribution pattern

## Licensing

- Plugin code: MIT — see [`LICENSE`](./LICENSE).
- Skill content: original commentary on principles drawn from the source
  authors named above, with per-principle attribution. Unofficial work,
  not affiliated with O'Reilly, Kevlin Henney, or any contributor. See
  [`CONTENT-LICENSE.md`](./CONTENT-LICENSE.md) for the full policy and
  takedown commitment.

## Development

We use [`just`](https://github.com/casey/just) as the local task runner.
Run `just` with no args to list recipes:

```sh
just            # list available recipes
just check      # everything CI runs: lint + format-check + smoke
just lint       # structural lint of skills/
just format     # prettier --write on JS/JSON/YAML
```

CI uses `npm test` directly (which is the same as `just check`), so
contributors who prefer npm don't need to install `just`:

```sh
npm test          # same as `just check`
npm run lint      # same as `just lint`
npm run smoke     # same as `just test`
```

One devDependency: `prettier`. Zero runtime deps.

For the full contributor guide — repo layout, changelog discipline, release
process, CI/CD, and the multi-harness adapter pattern — see
[`CONTRIBUTE.md`](./CONTRIBUTE.md). For agent-specific conventions, see
[`AGENTS.md`](./AGENTS.md).
