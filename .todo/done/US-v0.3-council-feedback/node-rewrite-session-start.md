# node-rewrite-session-start

**Council confidence:** [Consensus] — all 5 councillors flagged the
bash+cmd polyglot as the weakest link.

## Context

`hooks/run-hook.cmd` is a bash/batch polyglot that locates Git for Windows
bash to run `hooks/session-start` (a bash script). On Windows hosts
without Git Bash it silently `exit /b 0` — the plugin "installs" but the
SessionStart bootstrap is never injected, with no warning. This is worse
than a loud failure: users get a working `/plugin list` but a non-working
plugin and never know.

The repo already requires Node 18+ for the OpenCode plugin and lint
scripts. There is no reason to keep a separate bash dependency.

**Value delivered:** removes silent-failure path on Windows; eliminates
~90 lines of polyglot/escape acrobatics; aligns with AGENTS.md rule 6
("cross-platform is non-negotiable"); single language for hooks.

## Related Files

- `hooks/run-hook.cmd` — to delete
- `hooks/session-start` — to delete (bash version)
- `hooks/hooks.json` — update `command` to invoke node directly
- `scripts/smoke-load.mjs:140-143` — update file presence checks
- `package.json` `files` array — update if filenames change

## Dependencies

- None (pure infra; no decision tasks block this).

## Acceptance Criteria

- [x] New `hooks/session-start.mjs` written in pure Node (zero deps,
      built-ins only) that:
  - [x] Reads `skills/using-97/SKILL.md`
  - [x] Strips frontmatter (matching `.opencode/plugins/97.js`'s logic
        for consistency between adapters — this fixes the existing
        inconsistency where OpenCode strips frontmatter and the bash
        hook does not)
  - [x] Emits the correct JSON shape per harness:
    - Claude Code (default): `{ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: "…" } }`
    - Copilot CLI (when `COPILOT_CLI` env var set): `{ additionalContext: "…" }`
  - [x] Drops the Cursor branch — Cursor is not a supported harness
  - [x] **Wrapper coordination with `prune-bootstrap-urgency.md`:**
    - If `prune-bootstrap-urgency` has **not** landed yet: retain the
      existing `<EXTREMELY_IMPORTANT>` wrapper byte-for-byte in the
      Node port. Wrapper changes are explicitly out of scope here.
    - If `prune-bootstrap-urgency` **has** landed: use the new
      (non-shouty) wrapper that task introduced. Do not introduce a
      third wrapper variant.
- [x] **OpenCode idempotency marker coordination:** the OpenCode
      plugin (`.opencode/plugins/97.js:128`) keys idempotency on the
      substring `EXTREMELY_IMPORTANT`. If `prune-bootstrap-urgency`
      changes the wrapper, the marker substring used by the OpenCode
      idempotency check **and** the wrapper string emitted by this
      Node hook must agree. This task does not own the marker change
      (that's `prune-bootstrap-urgency`'s job), but verify they're in
      sync before closing this task.
- [x] `hooks/run-hook.cmd` deleted
- [x] Old bash `hooks/session-start` deleted
- [x] `hooks/hooks.json` `command` field invokes
      `"node" "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.mjs"` (or
      equivalent quoted path). Verify quoting works on cmd.exe and bash.
- [x] `scripts/smoke-load.mjs` updated to check the new files
- [x] `npm test` passes locally
- [x] CI (Ubuntu/macOS/Windows × Node 18/20/22) green
- [x] On a Windows host without Git Bash, the hook still runs (because
      it now uses Node, which is already required) — verified via CI's
      Windows job

## Verification

**Automated:**
- `npm test` exercises the smoke-load assertions and lint
- CI matrix proves cross-platform execution

**Ad-hoc:**
- Run `node hooks/session-start.mjs` locally and pipe to `jq` — output
  should be valid JSON with the `hookSpecificOutput.additionalContext`
  shape and contain the substring `using-97` somewhere
- Set `COPILOT_CLI=1 node hooks/session-start.mjs` — output shape should
  switch to top-level `additionalContext`

## Notes

- The OpenCode plugin (`.opencode/plugins/97.js`) is unchanged; its
  injection path is independent.
- Consider extracting a shared `lib/bootstrap.mjs` that both
  `.opencode/plugins/97.js` and `hooks/session-start.mjs` import to
  build the bootstrap content. Single source of truth, no drift between
  harnesses. **Optional** — fine to inline duplicate in v0.3 if the
  shared module adds friction.
- **`${CLAUDE_PLUGIN_ROOT}` substitution:** the `command` field in
  `hooks/hooks.json` uses `"${CLAUDE_PLUGIN_ROOT}/..."`. That
  substitution is performed by Claude Code (and by Copilot CLI which
  shares the format) before the command is passed to the OS — it is
  not a shell variable. Verifiable behavior on Windows; CI matrix
  exercises this. No special quoting tricks needed beyond standard
  double-quoting around the path.
- Add a `CHANGELOG.md` `[Unreleased]` entry under `### Changed` and
  `### Removed`.
