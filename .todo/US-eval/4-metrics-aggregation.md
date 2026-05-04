# 4-metrics-aggregation

## Context

Turn the raw per-trial JSON from task 3 into something a human can scan
at a glance. The two outputs are: (a) a Markdown summary appended to
`bench/SUMMARY.md` for every `just eval` run, and (b) a `--report` mode on
`run_eval.py` that prints the same summary to stdout for any historical
results JSON.

**Value delivered**: `git log -p bench/SUMMARY.md` becomes a reviewable
history of how 97's measured impact has changed over time.

## Related Files

- Modify: `bench/run_eval.py` — add `--report <path>` subcommand and
  end-of-run summary append
- Modify: `bench/SUMMARY.md` — append-only table maintained by the runner
- Create: `bench/lib/aggregate.py` — pure functions that take a results
  JSON and produce summary structures
- Create: `bench/lib/format.py` — Markdown rendering of aggregate output

## Dependencies

- `3-task-runner.md`

## Acceptance Criteria

- [ ] `bench/SUMMARY.md` has a stable header section the runner does not
      touch, followed by an append-only table:

```markdown
| Run (UTC) | 97 SHA | Model | Tasks | Trials | Control pass | Treatment pass | Δ pp | Cost (C/T) | Sentinel |
|---|---|---|---|---|---|---|---|---|---|
| 2025-11-04T12:34Z | abc1234 | claude-opus-4-1 | 12 | 2 | 5/24 (21%) | 8/24 (33%) | +12 | $38 / $41 | ✅ |
```

- [ ] After each `just eval`, the runner appends one row using ASCII-only
      characters (no Unicode glyphs that break in mailbox-style log
      tooling — use `pass` / `fail` / `?` instead of emoji if portability
      becomes an issue).
- [ ] `just eval --report bench/results/2025-11-04T12:34Z-abc1234.json`
      prints a longer, per-task breakdown to stdout:

```
Run: 2025-11-04T12:34Z-abc1234   Model: claude-opus-4-1   Tasks: 12 (×2 trials each)

Per-task pass rate (control / treatment):
  fix-git                   1/2 (50%) → 2/2 (100%)   Δ +50 pp
  fix-code-vulnerability    0/2 ( 0%) → 1/2 ( 50%)   Δ +50 pp
  cancel-async-tasks        2/2 (100%) → 2/2 (100%)  Δ   0 pp
  ...

Skill invocations (treatment only, total across all trials):
  before-you-refactor              7
  error-and-correctness-traps      5
  pre-commit-self-review           3
  ...

Cost: control $38.10, treatment $41.50 (+9%)
Tokens (mean per successful trial): control 142k, treatment 168k
Sentinel: passed
```

- [ ] `bench/lib/aggregate.py` has unit-tested pure functions:
  - `compute_pass_rates(results) -> {"control": (n_pass, n_total), "treatment": (n_pass, n_total)}`
  - `per_task_deltas(results) -> list[{task_id, control_pass, treatment_pass, delta_pp}]`
  - `skill_invocation_totals(results) -> dict[skill_name, count]`
  - `cost_and_tokens(results) -> {"control": {...}, "treatment": {...}}`
- [ ] All aggregator functions handle the sentinel correctly: it's parsed
      separately and reported separately, never merged into pass-rate
      totals.
- [ ] Per-task pass-rate delta is computed in **percentage points** (not
      relative percent), and labeled `pp` in output.
- [ ] If a trial's `passed` is null (harbor failure mode), it counts as
      neither pass nor fail; total trials drops and the report annotates
      `(n=Y of Z)` in such cases.

## Verification

- **Automated** (`uv run pytest bench/tests`):
  - Each aggregator pure function tested against fixture results JSONs:
    - all pass / all fail / mixed
    - one trial with `passed=null`
    - sentinel failed
    - control side missing entirely (e.g., `--condition treatment`)
  - Markdown renderer tested via golden file in `bench/tests/fixtures/`.
- **Ad-hoc**:
  - Run `just eval --only fix-git --trials 1`. After completion,
    `bench/SUMMARY.md` has one new row matching the run.
  - Run `just eval --report <that JSON>`. stdout matches the row in
    `SUMMARY.md` and contains the per-task breakdown.

## Notes

- This is the only task where formatting matters a lot. Keep the table
  columns narrow enough to read on a phone (GitHub mobile renders
  Markdown tables poorly past ~10 columns).
- Skill-invocation totals are the most 97-specific metric we have. Surface
  them prominently in the per-run report. If treatment shows zero skill
  invocations across the whole run, that's a major signal to investigate
  before trusting the pass-rate numbers.
- Don't try to compute statistical significance (chi-square, etc.) at N=2.
  The numbers are too small. We report raw counts and let humans interpret.
  Confidence intervals belong to `US-eval-expansion`.
- The renderer should never edit existing rows in `SUMMARY.md` — only
  append. If a run needs to be retracted, do it in a separate commit with
  a strikethrough or a comment explaining what went wrong, by hand.
