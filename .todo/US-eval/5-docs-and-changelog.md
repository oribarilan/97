# 5-docs-and-changelog

## Context

Finish the harness so a new contributor (or the human partner six months
later) can run `just eval` without rereading every task file. Lock in the
docs, add the CHANGELOG entry, and ensure existing checks still pass.
Spawn the follow-up story `US-eval-expansion` so the deferred items don't
get lost.

**Value delivered**: The benchmark is shippable. Anyone with the right
keys can reproduce a run; anyone without can read the result table.

## Related Files

- Modify: `bench/README.md` — full documentation
- Modify: `CHANGELOG.md` — `[Unreleased]` `### Added` entry
- Modify: `README.md` (repo root) — add a one-paragraph section linking to
  `bench/README.md`
- Modify: `AGENTS.md` and `CLAUDE.md` — note that `bench/` is excluded
  from cross-platform discipline (harbor is Linux/macOS-only); both files
  must remain byte-identical
- Create: `.todo/US-eval-expansion/main.md` — follow-up story for deferred
  items

## Dependencies

- `1-bench-skeleton.md`
- `2-opencode97-agent.md`
- `3-task-runner.md`
- `4-metrics-aggregation.md`

## Acceptance Criteria

- [ ] `bench/README.md` covers:
  - what the harness measures and what it does not
  - prerequisites with platform-specific install hints (uv, docker,
    harbor; explicitly note Windows is unsupported here and why)
  - all `just eval` flags with examples
  - results-JSON schema reference
  - a "How to read SUMMARY.md" subsection
  - explicit caveats: TB 2.0's capability bias vs. 97's discipline focus,
    pass/fail under-measures plugin impact, no statistical significance
    at N=2, non-deterministic trials
  - links to harbor and terminal-bench-2 with attribution
- [ ] `CHANGELOG.md` `[Unreleased]` has an `### Added` bullet:
      `Eval harness (`just eval`): A/B benchmark of 97 vs. vanilla OpenCode
      on a curated 12-task subset of terminal-bench@2.0. See `bench/README.md`.`
- [ ] `README.md` (repo root) has a short "Benchmarks" subsection linking
      to `bench/README.md` with a one-line summary and the latest pass-rate
      delta from `bench/SUMMARY.md` (manually copied — no auto-update).
- [ ] `AGENTS.md` and `CLAUDE.md` updated identically with one paragraph
      under "Cross-platform discipline" noting that `bench/` is exempt.
      `npm test` enforces byte-equality between the two files; verify it
      still passes.
- [ ] `.todo/US-eval-expansion/main.md` exists with the deferred items
      from `US-eval/main.md`'s "Out of scope" section, with cross-links.
- [ ] `npm test` passes (lint + format-check + smoke + AGENTS.md/CLAUDE.md
      equality).
- [ ] `just check` passes.
- [ ] At least one **end-to-end run** of the harness with `--only fix-git
      --trials 1` has been performed by the human partner; the resulting
      JSON is committed under `bench/results/` (this is the one exception
      to the gitignore — the very first reference run is checked in for
      posterity, named with a `-reference` suffix).

## Verification

- **Automated**:
  - `npm test` exits 0
  - `just check` exits 0
  - `uv run pytest bench/tests` exits 0 (all tasks 1-4 tests still green)
- **Ad-hoc**:
  - Reading `bench/README.md` cold, can a stranger reproduce a run? Run a
    "fresh-eyes" pass: clone the repo to /tmp, follow only the README
    instructions, see if `just eval --dry-run` succeeds.
  - `git diff` between `AGENTS.md` and `CLAUDE.md` is empty after the
    edits (i.e., they were modified identically).
  - The bullet in `CHANGELOG.md` matches Keep-a-Changelog conventions
    used elsewhere in the file.

## Notes

- The reference run committed to `bench/results/` will become outdated.
  That's fine — it documents what the harness's output looked like at the
  moment of release. Future runs are gitignored.
- The cross-platform exemption in `AGENTS.md`/`CLAUDE.md` is the only
  rule deviation in this story; surface it clearly so the next reader
  knows it was deliberate, not an oversight.
- `US-eval-expansion/main.md` should list, with brief one-paragraph
  context for each: SWE-bench Lite adapter; Aider Polyglot adapter;
  multi-model sweep (Haiku/GPT-5/Gemini); LLM-judge code-quality scoring
  on diffs; CI integration on tags; deterministic seeds (upstream PR to
  harbor); upstreaming a generic `--plugin-dir` flag to harbor's OpenCode
  adapter; statistical significance once N is large enough.
- After this task ships, finalize the story per the `tasks` skill: verify
  story-level DoD in `US-eval/main.md`, move `main.md` to
  `.todo/done/US-eval/`, remove the empty source directory.
