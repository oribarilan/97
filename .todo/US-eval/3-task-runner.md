# 3-task-runner

## Context

Wire up the actual A/B execution in `bench/run_eval.py`. Each `just eval`
invocation runs the curated task list twice (control + treatment), records
per-trial outputs, and writes the results JSON.

**Value delivered**: One command produces honest A/B numbers. The harness
is now usable end-to-end, even before the metrics aggregator (task 4)
makes the output pretty.

## Related Files

- Modify: `bench/run_eval.py` — replace the "not implemented" stub
- Reference: `bench/tasks.yaml` — task list
- Reference: `bench/agents/opencode97.py` — treatment agent
- Reference: harbor's run-output layout — confirmed in task 1
- Create: `bench/results/<UTC-timestamp>-<git-sha>.json` (sample after run)

## Dependencies

- `1-bench-skeleton.md`
- `2-opencode97-agent.md`

## Acceptance Criteria

- [ ] `bench/run_eval.py` orchestrates two harbor invocations per `just eval`:
  - **Control**: `harbor run --agent opencode --model <X> --task-ids
    <list> --n-trials <N> --output-dir <tmp>/control`
  - **Treatment**: same but `--agent bench.agents.opencode97:OpenCode97`
    and a separate output dir
- [ ] After each harbor run completes, `run_eval.py` walks the harbor
      output dir, locates each trial's `trajectory.json` and
      `task-result.json` (or whatever harbor's per-trial result file is —
      task 1 confirmed), and extracts per-trial:
  - `task_id`, `condition`, `trial_index`
  - `passed: bool`
  - `wall_seconds`, `cost_usd`, `prompt_tokens`, `completion_tokens`,
    `cached_tokens`, `step_count`
  - `skill_invocations: dict[str, int]` (key = skill name from `arguments.name`)
  - `error: str | null` (harbor failure mode, if any)
- [ ] Aggregated results JSON written to
      `bench/results/<UTC-iso>-<git-sha>.json` with this shape:

```json
{
  "schema_version": 1,
  "run_id": "2025-11-04T12:34:56Z-abc1234",
  "git_sha": "abc1234",
  "harbor_version": "x.y.z",
  "dataset": "terminal-bench@2.0",
  "model": "anthropic/claude-opus-4-1",
  "trials_per_task": 2,
  "tasks": ["fix-git", "..."],
  "trials": [ { ... per-trial fields above ... } ],
  "totals": {
    "control": { "pass_rate": 0.42, "n": 24, "cost_usd": 38.10, "duration_min": 22 },
    "treatment": { "pass_rate": 0.50, "n": 24, "cost_usd": 41.50, "duration_min": 25 }
  }
}
```

- [ ] On any harbor failure (network, container crash), the JSON still
      writes with the trials that did complete, and the runner exits with
      a non-zero code so the invoker knows the run is partial.
- [ ] `--only <comma-list>` runs a subset of tasks (both conditions still
      run for whichever tasks remain).
- [ ] `--condition control|treatment|both` (default `both`) lets the user
      run one side only — useful when iterating on the agent code without
      re-paying for the control side.
- [ ] **Sentinel handling**: the sentinel task `97-skills-listed` is run
      every time and its result is recorded but excluded from
      `totals.*.pass_rate`. If the sentinel fails under treatment, the
      runner prints a loud warning ("plugin did not load — treatment
      results unreliable") and tags the JSON with `"sentinel_failed":
      true`. It does NOT abort; the data still goes to disk.
- [ ] Results JSON validates against a JSON Schema in
      `bench/schema/results.schema.json` (added in this task).

## Verification

- **Automated** (`uv run pytest bench/tests`):
  - Unit test: harbor-output parser handles a fixture trajectory and
    produces the expected per-trial dict.
  - Unit test: schema validation passes on a generated sample, fails on a
    malformed sample.
  - Unit test: `--only sentinel` produces a one-row JSON.
- **Ad-hoc**:
  - `just eval --only fix-git --trials 1`. Real run. Should take ~5 min,
    cost ~$5, produce a JSON with 2 trials (1 control, 1 treatment) for
    `fix-git` plus the sentinel.
  - Inspect the JSON manually: every required field present, totals sum
    correctly.

## Notes

- Concurrency: harbor has its own `--n-concurrent` flag. Pass through from
  `run_eval.py` as `--n-concurrent` so the operator decides. Do NOT
  parallelize control vs. treatment within the runner — it doubles peak
  rate-limit pressure for marginal savings.
- Be defensive about harbor's output schema. Harbor is on a fast release
  cadence; if a key is missing in a trajectory, log a warning and treat
  the value as `null`, don't crash the whole run.
- `git_sha` recorded should be the current 97 SHA (the plugin under test),
  not harbor's. Use `git rev-parse --short HEAD`.
- For `cached_tokens`, harbor's OpenCode adapter populates this from
  opencode's `tokens.cache.read` field — already verified by reading
  `harbor/.../opencode.py`.
- Sentinel-failure behavior is intentional: a hard abort would mean a
  partial run is wasted. Emit the warning, write the JSON, exit non-zero.
- If harbor doesn't expose a deterministic seed, record
  `"seed": "non-deterministic"` in the JSON and document the variance
  caveat in `bench/README.md` and `bench/SUMMARY.md`.
