# freeze-harness-count-policy

**Council confidence:** [Majority] — 4/5 councillors said multi-harness
support is premature for the current proof state and adding a 4th
harness now is the wrong investment. One councillor (claude) said the
adapter pattern is sound; the disagreement was about timing, not design.

## Context

The plugin currently supports 3 harnesses: Claude Code, Copilot CLI (free
because Copilot uses Claude's plugin format), and OpenCode. The
`hooks/session-start` script *also* contains a Cursor branch
(`hooks/session-start:32`) despite Cursor not being a documented
supported harness. Council framed this as scope creep — engineering
investment in adapter logic for harnesses without users, while the
underlying content has no behavioral evidence backing it.

**Value delivered:** explicit policy that channels v0.3 → v1.0 effort
into content quality and evidence, not adapter breadth. Removes the
unused Cursor branch.

## Related Files

- `hooks/session-start` (or `hooks/session-start.mjs` if
  `node-rewrite-session-start.md` has landed) — Cursor branch
- `CONTRIBUTE.md` — policy paragraph to add
- `AGENTS.md` — possibly cross-reference

## Dependencies

- Should land **after** `node-rewrite-session-start.md` so the policy
  applies to the rewritten Node hook directly.

## Acceptance Criteria

(In order — earlier ACs unblock later ones. The policy doc lands first
so the in-code comment can reference an existing section.)

- [x] `CONTRIBUTE.md` has a new short policy section, "Harness scope
      policy," stating:
  - Supported harnesses through v1.0: Claude Code, Copilot CLI, OpenCode.
  - New harnesses require *both* (a) demonstrated user demand and (b)
    behavioral evidence that existing skills change agent output (see
    `decide-feedback-loop-approach.md` outcome).
  - Adapter PRs that add a new harness without meeting both bars will
    be deferred until v1.0 at earliest.
- [x] Cursor branch removed from `hooks/session-start{,.mjs}`. The
      `CURSOR_PLUGIN_ROOT` check and the snake_case `additional_context`
      output path are both gone. **Coordinates with
      `node-rewrite-session-start.md`:** if that task lands first, this
      AC is auto-satisfied (verify the branch is absent in the new
      Node script). If this task lands first, remove from the bash
      script.
- [x] If `hooks/session-start.mjs` exists (per node-rewrite), the
      removed branch leaves a one-line code comment: `// Add a new
      harness adapter only after content evidence justifies the scope
      expansion — see CONTRIBUTE.md.`
- [x] `CHANGELOG.md` `### Removed` entry: "Unused Cursor adapter branch
      in `hooks/session-start`."
- [x] `npm test` passes.

## Verification

**Automated:**
- `npm test` (no functional change to supported harnesses)
- `grep -ri "cursor\|CURSOR_PLUGIN_ROOT" hooks/ scripts/ skills/ AGENTS.md README.md CONTRIBUTE.md` returns no
  hits except the new `CONTRIBUTE.md` policy section's mention of
  "Cursor" in the supported-harness explanation, if any. (If the policy
  section names the excluded harnesses by name, that's intentional.)

**Ad-hoc:**
- Read the policy paragraph in `CONTRIBUTE.md`. Could a contributor
  reading it correctly decide "should I open a PR adding harness X"?

## Notes

- This is a small task with a disproportionate strategic weight. It
  protects v0.3 and v0.4 from getting pulled into adapter sprawl by
  well-meaning contributors.
- It's also reversible. If a major harness (Cursor, Codex, Gemini)
  ships a coding agent with strong demand and the project has accrued
  behavioral evidence, the policy can be revisited.
- Frame the policy as "scope discipline," not "rejection of
  contribution." External adapters can be maintained as separate
  forks/repos by interested parties without inflating the core repo's
  CI matrix or maintenance load.
