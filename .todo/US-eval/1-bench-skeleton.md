# 1-bench-skeleton

## Context

Lay down the directory layout, config files, and `just eval` recipe stub so
later tasks have somewhere to land. Resolve the open questions about harbor's
CLI surface before any agent code gets written.

**Value delivered**: `just eval --help` prints meaningful usage; `just eval
--dry-run` validates the environment (uv, docker, harbor, API key) without
spending money. The skeleton exists, no real runs yet.

## Related Files

- Create: `bench/README.md`
- Create: `bench/tasks.yaml`
- Create: `bench/run_eval.py`
- Create: `bench/results/.gitkeep`
- Create: `bench/SUMMARY.md`
- Create: `bench/sentinel/97-skills-listed/` (task definition; structure TBD per harbor's task format)
- Modify: `justfile` (add `eval` recipe)
- Modify: `.gitignore` (ignore `bench/results/*.json`, keep `.gitkeep`)
- Modify: `package.json` (ensure `npm test` skips `bench/`)
- Modify: `scripts/lint-skills.mjs` (already path-scoped to `skills/`; verify it ignores `bench/`)

## Dependencies

None. First task in the story.

## Acceptance Criteria

- [ ] `bench/` directory created with the layout above.
- [ ] `bench/tasks.yaml` lists the 12 curated TB 2.0 task ids plus the sentinel
      task id, in the format harbor consumes (verify against
      `harbor run --help` output).
- [ ] `bench/run_eval.py` is an executable Python entry point that:
  - parses `--model`, `--trials` (default 2), `--only <comma-list>`,
    `--dry-run`, `--n-concurrent` (default 4)
  - on `--dry-run`: validates `uv`, `docker`, `harbor`, and the relevant
    `*_API_KEY` are present; prints the planned task list and exits 0
  - without `--dry-run`: prints "not implemented yet" and exits 1 (real
    execution lands in task 3)
- [ ] `justfile` has an `eval` recipe that shells out to `uv run python
      bench/run_eval.py {{ARGS}}`. Args pass through (`just eval --dry-run`,
      `just eval --only fix-git`).
- [ ] `bench/results/` exists with `.gitkeep`; `bench/results/*.json` is
      gitignored.
- [ ] `bench/SUMMARY.md` exists with a header row only (no data yet).
- [ ] `bench/README.md` documents the harness's purpose, prerequisites, the
      `just eval` invocation, and the results-JSON schema (even though the
      writer doesn't exist yet — schema is decided here).
- [ ] **Open questions resolved and recorded in `bench/README.md`** under a
      `## Harbor compatibility notes` section:
  - confirmed flag for selecting tasks (`--task-ids`, `--include`, etc.)
  - whether harbor exposes a per-trial seed
  - confirmed flag for passing a custom agent (`--agent <import-path>` vs
    YAML config)
- [ ] `npm test` still passes.

## Verification

- **Automated**:
  - `just eval --dry-run` exits 0 and lists 13 task ids (12 curated + 1
    sentinel)
  - `just eval --dry-run` exits non-zero with a clear message if
    `ANTHROPIC_API_KEY` is unset
  - `npm test` exits 0
- **Ad-hoc**:
  - Inspect `bench/README.md` to confirm the resolved harbor flags match
    actual `harbor run --help` output

## Notes

- The point of `--dry-run` is to surface environment issues before a $100
  run. Make the failure messages specific (which tool is missing, which env
  var, where to install harbor).
- `bench/sentinel/97-skills-listed/` task structure depends on harbor's
  task-format spec — investigate during this task. If harbor requires the
  task to live inside the dataset repo, use a local task directory plus
  whatever flag harbor supplies for "extra task path" (e.g. `--task-path`).
  If no such flag exists, escalate: we may need to upstream that flag, or
  fold the sentinel check into a wrapper script that runs the agent
  manually outside harbor for the verification-only path.
- Python is fine for `run_eval.py` even though the rest of the repo is JS —
  harbor itself is Python and using `uv run` matches its installation
  story. Document this in `bench/README.md`.
