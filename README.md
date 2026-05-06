<h1 align="center">97</h1>

<p align="center"><strong>Your agent, on the shoulders of giants.</strong></p>

<p align="center">
  <a href="https://github.com/oribarilan/97/actions/workflows/test.yml"><img src="https://github.com/oribarilan/97/actions/workflows/test.yml/badge.svg?branch=main" alt="CI"></a>
</p>

<p align="center"><em>Early beta. Works on Claude Code, GitHub Copilot CLI, and OpenCode.</em></p>

<p align="center">
  <a href="#install">Install</a> ·
  <a href="#whats-inside">What's inside</a> ·
  <a href="#faq">FAQ</a> ·
  <a href="#credits">Credits</a> ·
  <a href="#development">Development</a>
</p>

---

## What this is

Skills your coding agent invokes when they apply: when it's about to
refactor, write a test, design an API, or commit. They distill established
programming practice like Fowler on refactoring smells, 12-factor on
configuration and deploys, Ousterhout and Liskov on API shape and design,
and others.

The project is named for *97 Things Every Programmer Should Know*
(O'Reilly, ed. Kevlin Henney) and built in its spirit: one principle
at a time, applied at the moment of decision. Every principle ships
with attribution to the original author. Principles are chosen to be
language-agnostic and outlast specific frameworks or stacks.

## Install

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

**Advanced: pinned install.** For reproducible behavior across sessions,
pin to a specific tag (`#vX.Y.Z`):

```jsonc
{
  "plugin": [
    "97@git+https://github.com/oribarilan/97.git#v0.2.0"
  ]
}
```

Works on Linux, macOS, and Windows. Node 18+.

## What's inside

| Skill | When it fires |
|---|---|
| `using-97` | Always — bootstrap that primes the agent on the trigger map |
| `before-you-refactor` | About to refactor, restructure, rename across files, or "clean up" existing code |
| `writing-clean-code` | Adding a new function/class, naming a new entity, or modifying ≥3 lines of non-trivial logic |
| `domain-modeling` | Introducing a new top-level type/table/domain concept, renaming a domain concept, or deciding where state lives |
| `api-and-interface-design` | Designing a public API, function signature, module boundary, exported type, or any contract other code depends on |
| `testing-discipline` | Writing tests, designing test data, naming a test, choosing what to assert, or writing test helpers/mocks/fixtures |
| `error-and-correctness-traps` | Writing error handling, comparing/calculating with floats, writing concurrent code, calling a remote process, adding a singleton, choosing a data structure for a hot path, or changing log statements |
| `security-and-trust-boundaries` | Parsing user input, writing SQL or shell commands, handling secrets/tokens, hashing passwords, adding/changing an auth check, deserializing untrusted data, or constructing file paths/URLs from input |
| `observability` | Adding a request handler, RPC, or background job that will run in production; adding tracing, metrics, or structured-log calls; or making cross-process diagnosability decisions |
| `build-deploy-and-tooling` | Authoring/changing build scripts, CI workflows, deploy pipelines, repo setup, or evaluating a new tool for adoption |
| `pre-commit-self-review` | About to commit, finish a task, open a PR, summarize work, or when asked for a review or hand-off |
| `working-with-users-and-team` | Gathering or interpreting requirements, estimating effort, or communicating with stakeholders about what to build |

12 skills total (the bootstrap plus 11 themed skills). Every principle
is cited and attributed in the skill's `principles.md`.

### Attribution & sources

Every principle the agent applies is attributed to its original author.
Each skill ships a `principles.md` next to its `SKILL.md` with, per
principle: the author, a link to the source (CC-BY-3.0 essay, book
chapter, RFC, or specification as appropriate), our distillation in
our own words, and how the agent applies it.

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
and explain the reasoning. Treat 97 as a guided reading list into the
underlying literature as much as a behavior plugin.

The `security-and-trust-boundaries` and `observability` skills are
mostly original commentary on sources outside *97 Things*; see
`CONTENT-LICENSE.md`.

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

97's bootstrap is explicit about the superpowers boundary: process skills
fire first. `superpowers/verification-before-completion` asks *did it work*;
`97/pre-commit-self-review` asks *is it well-considered*.

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
