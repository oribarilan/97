# decide-feedback-loop-approach

**Council confidence:** [Split] — 4 councillors recommended local
opt-in JSONL telemetry; 1 (contrarian) argued telemetry is unattainable
in this domain and proposed a quarterly dogfooding journal instead.

## Context

There is currently no evidence whether the plugin changes agent
behavior. Every councillor agreed this is the single biggest gap;
they disagreed on how to address it.

**Option A — Local opt-in telemetry (4/5 councillors):**

- Append-only JSONL at `~/.cache/97/triggers.jsonl` (or platform
  equivalent), opt-in via env var
- Each entry: timestamp, harness, skill name, "loaded" or "fired"
  (whichever signal is reliably observable)
- Author and beta users contribute logs voluntarily
- Even N=5 sessions of data would tell the maintainer which skills
  never fire and should be deleted

**Option B — Quarterly dogfooding journal (1/5 councillor, contrarian):**

- Pick 5 representative tasks per quarter
- Run each with and without the plugin
- Write up: which skills fired, which didn't, what changed in the
  output, what bugs the skill caught (or missed)
- Costs ~4 hours per quarter; produces structured prose evidence
- Argues telemetry on agent behavior is fundamentally unmeasurable from
  logs alone — "did the skill help?" can't be inferred from "the skill
  fired"

**Both can coexist.** The split is about which is the *primary* mechanism.

**Value delivered:** the plugin acquires its first feedback signal,
making future iteration evidence-driven rather than vibes-driven.

## Related Files (depending on decision)

- `.opencode/plugins/97.js` — telemetry hook (Option A)
- `hooks/session-start.mjs` — telemetry hook (Option A)
- `docs/dogfooding/` (new directory) — journal entries (Option B)
- `CONTRIBUTE.md` — process documentation either way

## Dependencies

- Should land **early** in v0.3 (in the priority list of `main.md` it's
  task #1) — its outcome shapes other tasks (whether
  `fix-smoke-test-bootstrap-injection.md` adds telemetry assertions,
  whether `add-security-traps-skill.md` adds telemetry calls).

## Acceptance Criteria

### Decision deliverables (required for this task to close)

- [x] A decision is made and recorded in this task file's "Decision"
      section (add it before closing). Acceptable outcomes:
  - **A only** — implement local opt-in JSONL telemetry
  - **B only** — establish dogfooding journal cadence
  - **A + B** — both, with clear scope for each
  - **Defer** — neither in v0.3, with explicit re-evaluation trigger
    (e.g., "revisit if invocation rate is unclear after 1 month of
    v0.3 use")
- [x] **Privacy constraint** (applies to any A-flavored outcome):
      JSONL contents must not include user prompts, code content,
      file paths, or filenames. Skill name, harness, event type,
      timestamp, and a per-session opaque ID only. This is documented
      in the decision record as a non-negotiable.
- [x] **If implementation is deferred** (e.g., decision is "ship A,
      implement in v0.4"), a follow-up task file already exists in
      `.todo/` (e.g., `.todo/backlog/implement-telemetry-jsonl.md` or
      a new `US-v0.4-*` story) before this decision task is moved to
      `done/`. Decisions without a paper trail evaporate.
- [x] `CHANGELOG.md` `### Documentation` (or `### Added` if behavior
      changed) entry recording the decision.

### Implementation deliverables (only if Option A lands in v0.3)

- [ ] Telemetry is **opt-in**, off by default. Env var name documented
      (suggest `NINETYSEVEN_TELEMETRY=1`).
- [ ] Telemetry is **local only**. No network calls. No upload.
- [ ] File location is platform-correct
      (`~/.cache/97/triggers.jsonl` on Linux/macOS,
      `%LOCALAPPDATA%\97\triggers.jsonl` on Windows — see AGENTS.md
      rule 6).
- [ ] Format is JSONL with stable schema:
      `{ ts, harness, skill, event, session_id }`. No prompt content,
      no code content, no file paths.
- [ ] Documented in `README.md` and `CONTRIBUTE.md`.
- [ ] Smoke test asserts: no telemetry file created when env var
      unset; one parseable JSONL line written when env var set and a
      skill load occurs.

### Implementation deliverables (only if Option B lands in v0.3)

- [ ] `docs/dogfooding/` directory created with a `README.md`
      describing the journal format.
- [ ] First journal entry written from current state (a baseline
      "what does v0.2.0 do?" recording) before v0.3 ships.
- [ ] Cadence documented: quarterly, with calendar trigger or
      release-aligned trigger.

## Verification

**Automated:**
- If A: smoke test asserts no telemetry file is created when env var
  is unset; asserts file is created and contains a parseable JSONL line
  when env var is set.
- If B: no automated verification (intentional — it's process, not code).

**Ad-hoc:**
- For A: enable telemetry, run a session in each harness, confirm a
  JSONL line appears per skill load.
- For B: read the first journal entry; could a future contributor read
  it and understand what was learned?

## Notes

- **Scope discipline:** the *decision* is in scope for v0.3. The full
  *implementation* of telemetry (Option A) may be too large; if so,
  this task ships the decision and a smaller follow-up task ships the
  implementation. That's fine.
- **The contrarian's caveat is real.** "Skill loaded" is observable;
  "skill helped" requires human judgment. Even with Option A, the
  maintainer should plan for periodic qualitative review of what the
  data means. A means without B is at risk of optimizing for loaded-rate
  rather than helped-rate.

## Decision

**Outcome: kill — no feedback infrastructure in v0.3, no v0.4 follow-up
backlog task.** Both Option A (local opt-in JSONL telemetry) and Option B
(quarterly dogfooding journal) are rejected as speculative work.

**Rationale:**

- Option A is rejected on principle. "Telemetry" — even local-only,
  opt-in, no-network, with an aggressive privacy constraint — is the
  wrong posture for a developer-tool plugin. The trust cost of having
  any data-collection apparatus in the repo, however benign, exceeds
  the maintainer-side benefit of the data. "We don't collect anything,
  ever" is a stronger posture than "we collect locally with caveats."
- Option B is rejected on cost-vs-need. A quarterly journal is ~4
  hours/quarter of structured prose work whose value depends on
  whether v0.2/v0.3 is actually deployed widely enough to journal
  about. Today, that's unclear.
- v0.3's theme is *remove more than you add* (council [Consensus]).
  Adding a feedback mechanism — code, doc, or process — inverts that.
- The honest forcing function is real-world usage. If the trigger
  taxonomy doesn't fire when it should, users will report it as a
  GitHub issue or stop using the plugin. Either signal is more
  reliable than self-administered telemetry or maintainer journaling.

**Revisit trigger:** if a concrete pattern of "skill X never seems to
fire" emerges from real usage (issues, anecdotes, dogfooding), open a
new decision task at that point with the specific gap as motivation.
Do not pre-build feedback infrastructure speculatively.

**No backlog task created.** This is an explicit kill, not a defer.
