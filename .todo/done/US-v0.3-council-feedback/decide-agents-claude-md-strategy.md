# decide-agents-claude-md-strategy

**Council confidence:** [Split] — 3 councillors said keep the
byte-identical `AGENTS.md` ≡ `CLAUDE.md` rule (small tax, smoke catches
drift); 2 (simplifier, contrarian) said switch to a templated
single-source-of-truth generator before a 3rd-name harness arrives.

## Context

`AGENTS.md` and `CLAUDE.md` are two real files (not symlinks — Git on
Windows doesn't preserve symlinks reliably) with identical content. The
smoke test (`scripts/smoke-load.mjs:115-123`) asserts byte equality.
Editing one without the other fails CI.

**Option A — Keep current rule (3 councillors):**

- Sustainable for now
- Smoke catches drift; CI blocks merge
- Tax is small (one extra file edit per change)
- The Windows-symlink-doesn't-work argument is correct and rules out
  the obvious solution
- The "right" long-term answer (harnesses learning to read both names)
  isn't this project's problem to fix

**Option B — Generator from single source (2 councillors):**

- Maintain one source file (e.g., `docs/agent-instructions.md` or
  inline in a `scripts/sync-agent-docs.mjs`)
- Run the generator in pre-commit and CI to emit `AGENTS.md` and
  `CLAUDE.md`
- Per-harness divergence (Cursor wants different tone, Gemini has
  different tool names, etc.) becomes possible without duplication
  explosion
- Removes a real footgun: contributors editing only one of the two and
  having CI catch it after-the-fact

**Value delivered:** explicit decision. Either keep with confidence,
or migrate now while there are 2 files (cheap), not later when there
are 4 (expensive).

## Related Files

- `AGENTS.md` — current source of truth
- `CLAUDE.md` — current twin
- `scripts/smoke-load.mjs:115-123` — current enforcement
- (Option B) `scripts/sync-agent-docs.mjs` — new generator
- (Option B) possibly `docs/` — new source-of-truth directory
- `CONTRIBUTE.md` — process documentation

## Dependencies

- None blocking. Decision is independent of other v0.3 tasks.

## Acceptance Criteria

- [x] A decision is made and documented in this task file. Acceptable
      outcomes:
  - **Option A (status quo):** explicitly affirm the rule and document
    the trigger to revisit (e.g., "revisit when a 3rd file with
    different content needs to exist").
  - **Option B (generator):** ship a generator script, deprecate
    manual edits to the two files.
  - **Defer:** decision postponed to a specific later trigger; status
    quo continues.
- [x] If Option A:
  - [x] AGENTS.md `## CLAUDE.md and AGENTS.md are byte-identical`
        section is sharpened with a "trigger to revisit" sentence.
        Suggested trigger: "Revisit when a third agent-instructions
        file (e.g., `GEMINI.md`, `CURSOR.md`) needs to exist with
        content that diverges from the current pair."
  - [x] No code changes.
- [ ] If Option B:
  - [ ] `scripts/sync-agent-docs.mjs` written (zero deps, Node
        built-ins).
  - [ ] Source file location documented in `CONTRIBUTE.md`.
  - [ ] Generator runs as part of `npm test` and fails if generated
        files are stale.
  - [ ] Generator can produce per-harness divergence (e.g., a marker
        in source like `<!-- claude-only -->` … `<!-- /claude-only -->`).
        Even if no current divergence is needed, the mechanism exists.
  - [ ] AGENTS.md and CLAUDE.md are now generated; manually editing
        them shows up as a stale-output failure.
  - [ ] Smoke test updated: it now verifies the generator produces
        output that matches checked-in files, rather than asserting
        byte equality. **Note:** this changes the failure mode — the
        prior rule caught hand-edits to either file; the new rule
        catches drift between source and outputs. Manual hand-edits
        to `AGENTS.md`/`CLAUDE.md` that aren't regenerated are still
        caught (as stale outputs) — same protection, different
        triggering mechanism.
  - [ ] Pre-commit hook or `just check` recipe runs the generator
        (or instructs the user to).
  - [ ] First-time contributor docs in `CONTRIBUTE.md` explain the
        new flow.
- [x] `CHANGELOG.md` reflects whatever shipped.
- [x] `npm test` passes.

## Verification

**Automated:**
- `npm test`
- If Option B: deliberately edit `AGENTS.md` directly, confirm CI fails
  with a clear message; revert.

**Ad-hoc:**
- For A: re-read the affirmed paragraph; is the "revisit trigger" clear?
- For B: edit the generator source, run the generator, confirm both
  output files updated identically (or with documented divergence).

## Notes

- **The 3rd-harness problem.** If a future harness wants its own file
  with different content (`GEMINI.md`, `CURSOR.md`), Option A's
  byte-equality rule no longer applies and the rule has to be relaxed
  anyway. Option B handles this from day one.
- **The migration cost is small now, larger later.** With 2 files and
  identical content, the generator's first version emits the same
  bytes; risk is low. With 4 files and divergent content, building a
  generator backwards is harder.
- **The 3-councillor "keep it" view is grounded** — the smoke test
  already prevents drift, and migration introduces a build step where
  there was none. Don't migrate just because Option B is theoretically
  cleaner; migrate only if a concrete near-term need exists or the
  v0.3 release author wants to remove the cost of remembering to
  edit both files.

## Decision

**Outcome: Option A — keep the byte-identical rule.** Revisit-when
trigger added to both `AGENTS.md` and `CLAUDE.md`.

**Rationale:**

- 3/5 councillors recommended status quo. The smoke test already
  prevents drift; CI blocks merge. Tax is small.
- v0.3's `freeze-harness-count-policy` explicitly freezes the harness
  count at 3 until at least v1.0. The 3rd-divergent-file pressure that
  would justify a generator is by policy not arriving in v0.3 or v0.4.
- Building Option B's generator now would solve a problem the project
  has explicitly forbidden creating, which is exactly the speculative
  bloat the council called out in the v0.2 review.
- If a 3rd harness with divergent content does arrive (probably in
  v1.x), the migration cost from "two files, byte-identical" to
  "generator emits N files" is small — same first-version output, no
  semantic ambiguity.

**Files changed in this task:**

- `AGENTS.md` — appended "Revisit when…" paragraph to the
  byte-identical section.
- `CLAUDE.md` — same paragraph appended (byte-identical maintained).

## Revision (same v0.3 cycle)

The Option A decision above was made on **stale framing**: it treated
`AGENTS.md`/`CLAUDE.md` as user-facing project docs that needed broad
agent coverage. On review with the maintainer, these are
**contributor-facing** docs only — they guide AI agents working *on*
the 97 codebase, not end users of the plugin. Plugin users get skill
content through the loader (`skills/`, `.claude-plugin/`, `hooks/`,
`.opencode/`); none of that depends on `AGENTS.md` or `CLAUDE.md`.

With that reframing, the cost-benefit shifts:

- The contributor population using Claude Code is small. Most modern
  agents (OpenCode, Copilot CLI, Cursor, Codex) read `AGENTS.md`.
- A Claude Code contributor can manually load `AGENTS.md` at session
  start (`@AGENTS.md` or "read AGENTS.md before making changes").
- The byte-identical maintenance tax — every conventions edit lands
  in two files, smoke check enforces drift catching — is paid every
  time conventions change, for a benefit that auto-loads only Claude
  Code.

**Revised outcome: drop `CLAUDE.md` entirely. `AGENTS.md` becomes the
single source of truth for contributor docs.**

**Files changed in the revision:**

- `CLAUDE.md` — **deleted**.
- `scripts/smoke-load.mjs` — byte-equality check replaced with a
  guard that fails if `CLAUDE.md` is reintroduced (prevents
  accidental drift back into the two-file world).
- `AGENTS.md` — section retitled "AGENTS.md is the single source of
  truth"; explains the policy, points Claude Code contributors to
  manual loading.
- `package.json` — `CLAUDE.md` removed from `files` array.
- `.prettierignore` — comment updated.
- `CONTRIBUTE.md` — file-tree diagram, smoke-test description,
  release procedure, CI summary all updated to single-source rule.
- v0.3 task files (`main.md`, `freeze-harness-count-policy.md`)
  updated to drop `CLAUDE.md` references.
- `CHANGELOG.md` — entry recorded.

**Revisit when** Anthropic adopts `AGENTS.md`, the ecosystem
standardizes on a single name, or a real contributor-flow problem
emerges from Claude Code users not getting these conventions. At that
point reintroducing `CLAUDE.md` (or generating it from a single
source) becomes worth the tax.
