# 97

> An OpenCode plugin that distills selected principles discussed in
> *97 Things Every Programmer Should Know: Collective Wisdom from the Experts*
> into trigger-based skills your coding agent invokes automatically when relevant.

**Status:** early beta

## What this is

The book *97 Things Every Programmer Should Know* (O'Reilly, edited by Kevlin
Henney) collects short essays from 73 expert contributors — Uncle Bob, Kevlin
Henney, Michael Feathers, Linda Rising, and many others. Each essay distills
one piece of wisdom about writing software.

This plugin curates a subset of those principles around its own trigger
taxonomy and ships them as skills your coding agent invokes automatically:
when it's about to refactor, when it's writing tests, when it's designing an
API, when it's about to commit. Same shape as
[`superpowers`](https://github.com/obra/superpowers), narrower in scope and
book-inspired rather than book-derived. It does not reproduce the book or
its editorial selection.

## Install

Add to your OpenCode config file. Location varies by platform:

| Platform | Default location |
|---|---|
| Linux | `~/.config/opencode/opencode.jsonc` |
| macOS | `~/.config/opencode/opencode.jsonc` |
| Windows | `%APPDATA%\opencode\opencode.jsonc` |

Add (or merge into your existing config):

```jsonc
{
  "plugin": [
    "97@git+https://github.com/oribarilan/97.git#v0.1.0"
  ]
}
```

Restart OpenCode. The `skill` tool will list `using-97` plus the nine themed
skills (see "What's inside" below). Pin to the `#v0.1.0` tag rather than
floating `main` so behavior stays stable across sessions.

Works on Linux, macOS, and Windows. Node 18+.

## Updating

When a new release ships, the plugin prints a one-line notice in your
session pointing to the update command. To upgrade:

```sh
npx github:oribarilan/97 update
```

This bumps the pinned `#vX.Y.Z` in your `opencode.jsonc` to the latest
GitHub Release. Restart OpenCode to apply. To pin to a specific older
version, pass `--version vX.Y.Z`. Run `npx github:oribarilan/97 update --help`
for all options.

To disable the version-check notice:

| Shell | Command |
|---|---|
| bash / zsh | `export NINETYSEVEN_DISABLE_VERSION_CHECK=1` |
| Windows cmd | `set NINETYSEVEN_DISABLE_VERSION_CHECK=1` |
| PowerShell | `$env:NINETYSEVEN_DISABLE_VERSION_CHECK = "1"` |

Full mechanism docs in [`CONTRIBUTE.md` §9](./CONTRIBUTE.md#9-auto-update-mechanism).

## What's inside

| Skill | When it fires |
|---|---|
| `using-97` | Always — bootstrap that primes the agent on the trigger map |
| `before-you-refactor` | About to refactor, restructure, rename across files, or "clean up" existing code |
| `writing-clean-code` | Adding a new function/class, naming a new entity, or modifying ≥3 lines of non-trivial logic — at most once per file per session |
| `domain-modeling` | Introducing a new top-level type/table/domain concept, renaming a domain concept, or deciding where state lives |
| `api-and-interface-design` | Designing a public API, function signature, module boundary, exported type, or any contract other code depends on |
| `testing-discipline` | Writing tests, designing test data, naming a test, choosing what to assert, or writing test helpers/mocks/fixtures |
| `error-and-correctness-traps` | Writing error handling, comparing/calculating with floats, writing concurrent code, calling a remote process, adding a singleton, choosing a data structure for a hot path, or changing log statements |
| `build-deploy-and-tooling` | Authoring/changing build scripts, CI workflows, deploy pipelines, repo setup, or evaluating a new tool for adoption |
| `pre-commit-self-review` | About to commit, finish a task, open a PR, summarize work, or when asked for a review or hand-off |
| `working-with-users-and-team` | Designing UX, gathering/interpreting requirements, estimating effort, or communicating with stakeholders about what to build |

10 skills total. 78 of the book's 97 principles are distilled across the 9 themed skills (the remaining 19 are pure career/mindset essays — not agent-actionable). Per-skill contributor attributions live in each skill's `principles.md`.

## Credits

- *97 Things Every Programmer Should Know: Collective Wisdom from the Experts*
  — O'Reilly, ed. Kevlin Henney
  ([book](https://www.oreilly.com/library/view/97-things-every/9780596809515/),
  [CC-BY-3.0 source mirror](https://github.com/97-things/97-things-every-programmer-should-know))
- Birat Rai's
  [97-day Medium walkthrough](https://biratkirat.medium.com/97-journey-every-programmer-should-accomplish-a0c53dbbfd47)
  of every essay (used as a reading aid)
- [`superpowers`](https://github.com/obra/superpowers) by Jesse Vincent for its distribution pattern

## Licensing

- Plugin code: MIT — see [`LICENSE`](./LICENSE).
- Skill content: original commentary on selected principles discussed in the
  book, attributed to the CC-BY-3.0 source essays. Unofficial companion, not
  affiliated with O'Reilly, Kevlin Henney, or any contributor. See
  [`CONTENT-LICENSE.md`](./CONTENT-LICENSE.md) for the full policy and
  takedown commitment.

## Development

```sh
npm test          # runs lint + smoke
npm run lint      # structural lint of skills/
npm run smoke     # imports the plugin and exercises hooks
```

Zero runtime deps. Both scripts use Node built-ins only.

For the full contributor guide — repo layout, changelog discipline, release
process, CI/CD, and auto-update mechanism — see [`CONTRIBUTE.md`](./CONTRIBUTE.md).
For agent-specific conventions, see [`AGENTS.md`](./AGENTS.md).
