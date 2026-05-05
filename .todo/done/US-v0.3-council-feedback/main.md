# US-v0.3-council-feedback

## Goal

Act on the v0.2.0 post-release council review (5 councillors: claude, gpt,
gemini, simplifier, contrarian). The dominant message: **the next release
should remove more than it adds**. Sharpen content, prove triggers fire,
close production-risk gaps (security), and replace cargo-culted urgency
with measurable behavior.

This story does **not** add a 4th harness and does **not** add new
principles beyond what's needed to close the security gap. Principle
coverage is not the KPI; behavior change is.

This story does **not** include the v0.3.0 release commit itself —
version bumps, tagging, and marketplace push follow `CONTRIBUTE.md`'s
manual release process and happen in a separate session by the release
author after every task here is in `done/`.

## Definition of Done

The story is complete when **all** of the following hold:

- [x] Every task file in this story is in `.todo/done/US-v0.3-council-feedback/`
      with all acceptance criteria checked.
- [x] `npm test` (lint + format-check + smoke) passes on a clean checkout.
- [x] Bootstrap is materially shorter — total injected bootstrap
      characters per harness (wrapper + body) drop ≥ 30% from current
      v0.2.0 baseline — and `<EXTREMELY_IMPORTANT>` no longer wraps
      the bootstrap content in any harness adapter.
- [x] `hooks/run-hook.cmd` is deleted; `hooks/session-start` is a Node
      script invoked directly via `node`; CI (Ubuntu/macOS/Windows × Node
      18/20/22) is green. *(Local test suite green; CI matrix runs on
      push.)*
- [x] One new themed skill exists: `security-and-trust-boundaries` (or
      similar), structured in the `error-and-correctness-traps` template
      (concrete traps, worked examples, named failures).
- [x] `working-with-users-and-team` is either pruned (pairing/rotation
      content demoted to `principles.md`) or split — the agent-irrelevant
      content is no longer in `SKILL.md`.
- [x] A documented decision exists for each Split item (feedback loop,
      lint budget policy, AGENTS≡CLAUDE strategy) — even if the decision
      is "keep current behavior, revisit at trigger X."
- [x] `CHANGELOG.md` `[Unreleased]` reflects every user-visible change.
- [ ] Release process for v0.3.0 follows the manual procedure in
      `CONTRIBUTE.md` — version bump in lockstep across the three
      manifests, tagged commit, etc. (Out of scope for this story; flagged
      for the release author.)

## Cross-Cutting Concerns

### `error-and-correctness-traps` is the template

All councillors converged on this skill as the gold standard: concrete
traps, worked examples (`0.1+0.2`, `strlen` in loop, ORM N+1, retry
self-DDoS), named failures with line-citable fixes. **When in doubt about
content shape, defer to its structure.** The new security skill mimics it
exactly. Tightening tasks for `writing-clean-code` and others should move
toward this density.

### Voice rules unchanged

The humanizer pass on v0.2.0 prose was successful. Keep the imperative,
keep the contractions, no AI tells. Voice rules in AGENTS.md still apply.

### No new harnesses

Freeze harness count at 3 (Claude Code, Copilot CLI, OpenCode) until at
least v1.0. The `hooks/session-start` script must drop the unused Cursor
branch when ported to Node — Cursor is not a supported harness.

### Decision tasks before their implementations

The two remaining Split tasks (`decide-lint-budget-policy`,
`decide-agents-claude-md-strategy`) have shipped their decisions; their
files live in `.todo/done/US-v0.3-council-feedback/`.
`decide-feedback-loop-approach` was **killed** — no feedback
infrastructure ships in v0.3, no v0.4 follow-up backlog. See that task
file for rationale.

### Soft chokepoint: `prune-bootstrap-urgency`

Six tasks (`add-security-traps-skill`, `node-rewrite-session-start`,
`fix-smoke-test-bootstrap-injection`, `patch-trigger-coverage-gaps`,
`prune-working-with-users-and-team`, plus the implicit "every task
that touches `using-97/SKILL.md`") have soft dependencies on
`prune-bootstrap-urgency`. It is the single highest-leverage task and
also the single biggest serialization risk. Prioritize it early in the
sequence; if it slips, do not block other tasks — they can ship
against the current bloated bootstrap and the prune task absorbs any
last-mile sync.

### Shared-files ledger (Rule 4 compliance)

AGENTS.md rule 4 forbids parallel edits to shared files. The following
files are touched by multiple tasks; each must be serialized through
a single integrator (the human partner running the story, or one
agent at a time). **Do not dispatch tasks to parallel agents without
checking this ledger first.**

| Shared file | Tasks that edit it |
|---|---|
| `skills/using-97/SKILL.md` | `prune-bootstrap-urgency`, `drop-once-per-file-rule`, `prune-working-with-users-and-team`, `add-security-traps-skill`, `patch-trigger-coverage-gaps` |
| `.opencode/plugins/97.js` | `prune-bootstrap-urgency` (idempotency marker), `node-rewrite-session-start` (cross-ref) |
| `hooks/session-start{,.mjs}` | `node-rewrite-session-start`, `prune-bootstrap-urgency` (wrapper), `freeze-harness-count-policy` (Cursor branch) |
| `hooks/hooks.json` | `node-rewrite-session-start`, `fix-smoke-test-bootstrap-injection` |
| `scripts/lint-skills.mjs` | `add-security-traps-skill` (new entry), `prune-working-with-users-and-team` (principle list), `tighten-writing-clean-code` (principle list) |
| `scripts/smoke-load.mjs` | `node-rewrite-session-start`, `fix-smoke-test-bootstrap-injection`, `prune-bootstrap-urgency` (marker), `freeze-harness-count-policy` |
| `README.md` | `drop-once-per-file-rule`, `add-security-traps-skill`, `prune-working-with-users-and-team`, `freeze-harness-count-policy` |
| `CHANGELOG.md` | every task |
| `AGENTS.md` | `freeze-harness-count-policy` |
| `CONTRIBUTE.md` | `freeze-harness-count-policy` |
| `CONTENT-LICENSE.md` | `add-security-traps-skill` (unconditional update) |

**Integration discipline:** when a task is ready to merge, the
integrator pulls the latest, applies the task's edits, runs `npm test`,
and commits. Two tasks editing the same shared file in flight at once
is a merge-conflict bug. Single-file ownership at any given moment is
the norm.

### Council confidence tags on every task

Each task file is tagged in its frontmatter:

- **[Consensus]** — all 5 councillors agreed
- **[Majority]** — 4/5 councillors agreed
- **[Split]** — councillors diverged; task is to make and record the
  decision (and optionally ship the chosen path)

## Task Priority

The three `decide-*` tasks have closed (two shipped decisions land
real edits in this story; `decide-feedback-loop-approach` was killed).
Recommended order for the remaining 10 tasks (none strictly blocking,
but lower numbers unblock or de-risk later ones):

1. `node-rewrite-session-start.md` — [Consensus] — pure infra, low risk
2. `fix-smoke-test-bootstrap-injection.md` — [Consensus] — small, unblocks evidence
3. `prune-bootstrap-urgency.md` — [Consensus] — content, high leverage
4. `drop-once-per-file-rule.md` — [Consensus] — content, small
5. `prune-working-with-users-and-team.md` — [Consensus] — content
6. `tighten-writing-clean-code.md` — [Majority] — content, biggest content task
7. `prune-done-checkboxes.md` — [Majority] — content sweep across skills
8. `patch-trigger-coverage-gaps.md` — [Majority] — content / triggers
9. `add-security-traps-skill.md` — [Consensus] — new skill, biggest net-add
10. `freeze-harness-count-policy.md` — [Majority] — policy doc

## Council Source Material

The synthesis lives in the conversation that opened this story (May 5, 2026).
Per-councillor responses identify file:line citations. Keep that material as
the spec — task files reference findings rather than restate them in full.
