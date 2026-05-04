# US-eval

## Goal

Build a reproducible A/B benchmark harness, invoked by `just eval`, that measures
the impact of the **97** plugin on a coding agent's behavior. Each run executes
the same curated task subset twice — once with vanilla OpenCode + a target model,
once with OpenCode + 97 installed — using
[harbor](https://github.com/laude-institute/harbor) as the runner and
[terminal-bench@2.0](https://github.com/laude-institute/terminal-bench-2) as the
task source. Results give us:

1. **Evidence for users** that installing 97 changes outcomes (positively or
   neutrally — we report what we find, not what we hope).
2. **Regression detection** during plugin development: if we change a skill
   and a prior pass becomes a fail, we want to know before tagging a release.

A follow-up story, `US-eval-expansion`, tracks adding SWE-bench Lite and Aider
Polyglot once the TB 2.0 harness is proven.

## Definition of Done

- [ ] `just eval` runs end-to-end on macOS and Linux, producing a results JSON
      under `bench/results/<UTC-timestamp>-<git-sha>.json` and a human-readable
      summary appended to `bench/README.md`.
- [ ] A single `just eval` invocation runs **the curated 12-task subset** twice
      (control = vanilla OpenCode; treatment = OpenCode + 97), 2 trials per
      task per condition = 48 task-runs total, against `claude-opus-4.7`
      (or whatever model is passed via `--model`).
- [ ] The treatment condition has 97 actually loaded inside the harbor sandbox
      — verifiable by a sentinel task that asks the agent "list installed
      skills" and expects `using-97` plus the 9 themed skills in the answer.
- [ ] Per-trial metrics captured: pass/fail (from harbor), wall-clock time,
      cost USD, prompt/completion/cached tokens, total step count, and
      **skill-invocation count** (number of `skill` tool calls in the
      trajectory, broken down by skill name).
- [ ] Aggregate report shows: pass-rate per condition, per-task pass-rate
      delta, total cost per condition, mean tokens per task per condition,
      and skill-invocation distribution for the treatment condition.
- [ ] `npm test` (lint + format + smoke) still passes — eval code is excluded
      from the existing skill lint but has its own minimal checks.
- [ ] `bench/README.md` documents what `just eval` does, prerequisites
      (`uv`, `Docker`, `harbor`, `ANTHROPIC_API_KEY`), how to interpret the
      JSON, and a sample invocation.
- [ ] `CHANGELOG.md` `[Unreleased]` has an `### Added` entry naming the
      eval harness.

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  just eval [--model X] [--trials N] [--only task1,task2]         │
└─────────────────┬────────────────────────────────────────────────┘
                  │ shells out to
                  ▼
┌──────────────────────────────────────────────────────────────────┐
│  bench/run_eval.py  (entry point, ~150 LOC)                      │
│   - reads bench/tasks.yaml (curated subset)                      │
│   - invokes harbor twice: control + treatment                    │
│   - parses harbor's per-trial trajectory.json + run-metadata     │
│   - writes bench/results/<ts>-<sha>.json                         │
│   - appends a row to bench/README.md summary table               │
└─────────────────┬────────────────────────────────────────────────┘
                  │ spawns
                  ▼
┌──────────────────────────────────────────────────────────────────┐
│  harbor run --dataset terminal-bench@2.0                         │
│             --agent <opencode | opencode97>                      │
│             --model <model>                                      │
│             --task-ids ...  --n-trials 2                         │
└─────────────────┬────────────────────────────────────────────────┘
                  │ for treatment, uses
                  ▼
┌──────────────────────────────────────────────────────────────────┐
│  bench/agents/opencode97.py                                      │
│   - subclasses harbor's OpenCode agent                           │
│   - copies 97's skills/ dir into ~/.config/opencode/skills/      │
│     (harbor already supports this via skills_dir)                │
│   - copies .opencode/plugins/97.js into                          │
│     ~/.config/opencode/plugin/97.js inside the sandbox           │
│   - registered as a custom agent via harbor's agent factory      │
└──────────────────────────────────────────────────────────────────┘
```

### Why a custom agent subclass

Harbor's stock `OpenCode` agent already has a `skills_dir` parameter that
copies a directory into `~/.config/opencode/skills/`. That covers the
`skills/` half of the plugin, but **NOT** the `using-97` bootstrap injection
that makes any skill fire — that injection lives in
`.opencode/plugins/97.js`, which OpenCode auto-loads from
`~/.config/opencode/plugin/`. Without the plugin file, the agent never sees
the trigger map and has no reason to call any skill. The subclass closes
that gap by also copying the plugin file into the sandbox.

This keeps the change **local to the eval harness** — we don't fork harbor.
If the pattern proves useful, we can upstream a generic `--plugin-dir` flag
to harbor's OpenCode adapter as a separate task in `US-eval-expansion`.

## Curated task subset (12 tasks)

Selected from terminal-bench@2.0 because each plausibly intersects with at
least one 97 skill trigger. Tasks where 97 is orthogonal (algorithm puzzles,
build-from-source, train-a-model) are deliberately excluded — full-bench A/B
is in `US-eval-expansion`.

| Task | 97 skills plausibly engaged |
|---|---|
| `fix-code-vulnerability` | error-and-correctness-traps, pre-commit-self-review |
| `fix-git` | pre-commit-self-review |
| `git-leak-recovery` | pre-commit-self-review |
| `sanitize-git-repo` | pre-commit-self-review |
| `cancel-async-tasks` | error-and-correctness-traps (concurrency) |
| `db-wal-recovery` | error-and-correctness-traps (data integrity) |
| `kv-store-grpc` | api-and-interface-design, domain-modeling |
| `pypi-server` | api-and-interface-design, build-deploy-and-tooling |
| `multi-source-data-merger` | domain-modeling, error-and-correctness-traps |
| `bn-fit-modify` | before-you-refactor |
| `large-scale-text-editing` | before-you-refactor |
| `nginx-request-logging` | error-and-correctness-traps (logging) |

Plus one **sentinel task** authored in `bench/sentinel/` (not part of TB):

| Task | Purpose |
|---|---|
| `97-skills-listed` | Instructs the agent to write the names of all available skills to `/tmp/skills.txt`. Test script `grep`s for `using-97`. Treatment must pass; control must fail. Verifies the plugin actually loaded — fail in treatment = misconfiguration, not a real benchmark result. |

The list lives in `bench/tasks.yaml` so it can be edited without code changes.

## Metrics & reporting

**Per trial (recorded in results JSON):**
- `task_id`, `condition` (`control`|`treatment`), `trial_index`
- `passed: bool` (from harbor's verifier output)
- `wall_seconds`, `cost_usd`, `prompt_tokens`, `completion_tokens`, `cached_tokens`
- `step_count` (trajectory length)
- `skill_invocations`: `{skill_name: count}` parsed from trajectory `tool_calls` where `function_name == "skill"`

**Aggregates (in summary table):**
- Pass rate per condition (control vs. treatment), with N
- Per-task pass-rate delta (treatment − control)
- Total cost per condition
- Mean tokens per successful trial per condition
- For treatment only: total skill invocations, top-3 invoked skills

**We report negative and null results.** If treatment pass-rate ≤ control,
the README says so. The benchmark's job is to tell the truth, not to
advertise.

## Cost & time budget

- 12 tasks × 2 trials × 2 conditions = 48 task-runs per `just eval`.
- Rough estimate with Claude Opus 4.7: $1.50–$4 per task-run (TB tasks vary
  widely), so a full run is **$70–$200** and **45–90 minutes** wall-clock with
  `--n-concurrent 4`.
- `just eval --only fix-git` runs a single task (4 runs total) for fast
  iteration during harness development, ~$5 and ~5 minutes.
- No CI integration in this story. `just eval` is human-triggered only.
  Adding it to a release workflow is in `US-eval-expansion`.

## Cross-cutting concerns

### Secrets

`ANTHROPIC_API_KEY` (or whichever provider matches `--model`) must be set in
the host environment. `bench/run_eval.py` validates the var is present
before spawning harbor and exits with a clear message if not. Never commit
keys; never echo them in logs. `.env` patterns are out of scope —
operators export the var themselves.

### Reproducibility

Every results JSON records: git SHA of 97, harbor version, terminal-bench-2
dataset version, model name, agent name, full task list, trial count, total
seed (if harbor exposes one — currently it does not, so trials are
non-deterministic and we record this caveat).

### Cross-platform

`just eval` must work on macOS and Linux (the two platforms harbor itself
supports — Docker on Windows is harbor's headache, not ours). We do **not**
add a Windows job for this story; `bench/` is excluded from the
cross-platform CI matrix already used by `npm test`. This is a deliberate
deviation from AGENTS.md rule #6 because harbor's containerized execution
is Linux/macOS-only in practice.

### Where results live

- `bench/results/*.json` — raw per-trial data, gitignored (potentially
  large + contains run-specific paths). One file per `just eval` run.
- `bench/results/.gitkeep` — keeps the directory.
- `bench/SUMMARY.md` — append-only table of every `just eval` invocation,
  one row per run: timestamp, git SHA, model, pass-rate Δ, cost. Committed.
- `bench/README.md` — docs for the harness. Committed.

### Out of scope (deferred to US-eval-expansion)

- SWE-bench Lite and Aider Polyglot adapters
- Multi-model sweeps (testing 97 with Haiku, GPT-5, Gemini, etc. — relative
  effect may differ for smaller/larger models)
- LLM-judge code-quality scoring on diffs (the binary pass/fail metric
  systematically undervalues 97's discipline-shaping effect; a judge would
  capture it but doubles cost and adds methodological complexity)
- CI integration (running `just eval` automatically on tags)
- Statistical significance tests (only meaningful with much larger N than
  2 trials; for now we report raw deltas and let humans interpret)
- Upstreaming a generic `--plugin-dir` flag to harbor

## Task Priority

Tasks use numeric prefixes — they are sequential. Each must work before the
next is meaningful.

1. `1-bench-skeleton.md` — `bench/` directory, `tasks.yaml`, results dir,
   README skeleton, `just eval` recipe stub. Ships a working "hello world"
   that calls harbor with no tasks, exits cleanly.
2. `2-opencode97-agent.md` — custom agent subclass that injects the 97
   plugin into the sandbox, plus harbor agent registration. Verified by the
   sentinel task `97-skills-listed`.
3. `3-task-runner.md` — `bench/run_eval.py` orchestrates control + treatment
   runs against the 12-task curated subset, parses harbor outputs, writes
   results JSON.
4. `4-metrics-aggregation.md` — skill-invocation parser, summary table
   generator, `bench/SUMMARY.md` append logic.
5. `5-docs-and-changelog.md` — flesh out `bench/README.md`, add CHANGELOG
   entry, ensure `npm test` still green.

A separate story, `US-eval-expansion.md`, gets created in `.todo/` at the
end of this work to track the deferred items above.

## Cross-Cutting Concerns

### Don't break existing checks

- `npm test` must still pass after each task. The skill linter
  (`scripts/lint-skills.mjs`) ignores `bench/`. The smoke loader
  (`scripts/smoke-load.mjs`) ignores `bench/`.
- `just check` adds a new `just eval-self-check` recipe that runs only the
  bench harness's own minimal lint (no API calls), to be run by humans
  before merging eval changes. It is **not** added to `just check` itself
  because it requires Python/`uv`/Docker which existing contributors may
  not have.

### Voice & docs

`bench/README.md` follows the repo's existing humanizer voice: imperative,
no AI tells, no marketing language. The `humanizer` skill is the source of
truth.

### Attribution

Harbor and terminal-bench-2 are credited in `bench/README.md` with links
and licenses. Both are Apache-2.0; we are users, not redistributors.

## Open questions (resolve during task 1)

- **Does harbor expose a per-trial seed?** If yes, record and replay it. If
  no, document non-determinism in the results JSON.
- **Does `harbor run --task-ids` accept a list?** If not, fall back to
  multiple invocations or a generated dataset filter file. Confirm before
  task 3.
- **How does harbor register a custom agent class?** Inspect
  `harbor/src/harbor/agents/factory.py`; expected mechanism is either
  entry-points, a `--agent-class` flag, or a Python import path. Confirm
  before task 2.
- **Is the `OPENCODE_FAKE_VCS=git` env var harbor's adapter sets** going to
  collide with the 97 plugin's `pre-commit-self-review` skill expectations?
  Verify in task 2 with the sentinel task.
- **Sentinel task fidelity.** The 97 plugin works by injecting the bootstrap
  via the OpenCode plugin loader, not via files in `~/.config/opencode/skills/`
  alone. The sentinel task verifies the bootstrap injection happened — but
  if OpenCode caches plugin loading across runs in unexpected ways, the
  sentinel may produce false negatives. Validate by running the sentinel
  task in isolation as the first thing task 2 does.
