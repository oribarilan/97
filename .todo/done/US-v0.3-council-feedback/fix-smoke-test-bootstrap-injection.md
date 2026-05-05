# fix-smoke-test-bootstrap-injection

**Council confidence:** [Consensus] — gpt and simplifier called this out
explicitly; others implicit ("you're testing the postman, not the
letter").

## Context

`scripts/smoke-load.mjs:54-55` exercises the OpenCode bootstrap
transform hook with an empty messages array:

```js
await hooks['experimental.chat.messages.transform']({}, { messages: [] });
```

That's a no-op test. A broken transform that silently fails to inject
the bootstrap into a real first user message would still pass smoke.
The current smoke test verifies plugin loading, manifest version
equality, and AGENTS≡CLAUDE byte-equality, but not that the bootstrap
**actually arrives** in agent context.

**Value delivered:** real assertion that the most consequential thing
the plugin does (inject the bootstrap) actually works. Catches silent
breakage from `experimental.chat.messages.transform` rename, frontmatter
parsing changes, or wrapper-string drift.

## Related Files

- `scripts/smoke-load.mjs` — main edit
- `.opencode/plugins/97.js` — under test (no edit expected)
- `hooks/session-start.mjs` — under test if `node-rewrite-session-start.md`
  has landed

## Dependencies

- Coordinates with `node-rewrite-session-start.md` — if that's landed,
  add a smoke check for the Node hook script too.
- Coordinates with `prune-bootstrap-urgency.md` — the marker substring
  this test asserts on may change. Use a stable marker (e.g., the
  string "97 — bootstrap" or a frontmatter-derived skill name) rather
  than `EXTREMELY_IMPORTANT`.

## Acceptance Criteria

- [x] Smoke test constructs a fake `output.messages` array with one
      user message containing `parts: [{ type: 'text', text: 'hello' }]`,
      runs the transform, and asserts:
  - [x] The user message's parts array now has length 2 (bootstrap
        prepended)
  - [x] The first part is type `'text'`
  - [x] The text contains a stable marker derived from
        `using-97/SKILL.md` content (e.g., the literal "Trigger Map"
        heading, or the skill's frontmatter `name:` value)
  - [x] The text contains the OpenCode tool-mapping appendix (e.g.,
        the substring `OpenCode equivalents`)
- [x] Idempotency check: running the transform a second time does not
      add a third part to the user message (current code uses substring
      check for idempotency; verify still works after marker change).
- [x] Smoke test for `hooks/session-start.mjs` (if landed):
  - [x] Spawn `node hooks/session-start.mjs` as a subprocess
  - [x] Capture stdout, JSON-parse it
  - [x] Assert the resulting object has the expected shape
        (`hookSpecificOutput.additionalContext` by default,
        `additionalContext` when `COPILOT_CLI=1`)
  - [x] Assert the embedded context contains the same stable marker
- [x] All assertions use clear failure messages so a CI failure points
      to which invariant broke.
- [x] CI matrix passes.

## Verification

**Automated:**
- `npm test` runs the augmented smoke
- CI passes on all 9 matrix combinations

**Ad-hoc:**
- Deliberately break the transform (e.g., return early before
  `unshift`) and confirm the smoke fails with a clear message
- Revert and confirm smoke passes again

## Notes

- This is the foundation for any future "did the skill actually fire"
  evidence-gathering. Without it, the project has zero automated
  evidence that the bootstrap reaches the model.
- Per the `decide-feedback-loop-approach.md` decision, this task may
  later grow a logging assertion (e.g., bootstrap has fired N times
  → write to a JSONL). That's out of scope here; this task only
  asserts arrival, not telemetry.
- Do **not** add a real harness e2e test (would require Claude Code /
  OpenCode runtime in CI). Smoke remains a unit-level assertion on the
  hook output shape.
