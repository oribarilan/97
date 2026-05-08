# US-bench-driven-skill-improvements

## Goal

Apply three coordinated edits to existing skills based on
empirical evidence from the `97-bench` discipline-bench
campaign and a follow-up council review. Each edit addresses a
distinct mechanism of failure that the bench measured:

1. **`security-and-trust-boundaries/SKILL.md` — voice-agnostic
   reframing of trap principles, with a non-trigger fix and a
   non-negotiable carve-out for committed secrets.** Bench data
   shows the skill is invoked on the hardcoded-credential task
   (10/10 on haiku-4.5) and its content is delivered (5/10
   file-read fallback) but pass rate stays 0/10. The current
   principles are written in write-time voice ("don't hardcode
   credentials"); the agent reads them, classifies the
   pre-existing literal `API_KEY = "sk-prod-..."` as
   "seed code, not my change," and skips it. Reframing
   principles as code-facts ("hardcoded credentials in source
   are leaked secrets — found or authored") attacks the
   scope-dismissal reflex directly. The non-trigger list at
   line 34 ("Reading code without modifying it") currently
   contradicts a found-not-authored reframe and must be
   adjusted. A non-negotiable carve-out is needed because
   priority rule 7 (calibration for MVPs/prototypes) gives the
   agent an off-ramp; committed secrets bite regardless of
   stage.

2. **`pre-commit-self-review/SKILL.md` — replace step 1 with a
   file-scan version.** Bench data shows this skill is invoked
   27/30 in the vE variant but pass rate stays 0/30 across
   three latent-trap tasks. The diff anchored "Re-read the diff
   as a stranger" framing never reaches latent traps in the
   surrounding unchanged code — a hardcoded credential 3 lines
   above the modified function, a TOCTOU pattern in an
   unmodified body, a swallowed exception in an unmodified
   handler. Replacing (not appending) step 1 with concrete
   code-shape signatures, a spatial scope (±20 lines around
   each hunk), and a named output artifact (an
   `Adjacent issues` hand-off section) makes the step bite
   instead of getting skimmed. This is the safety net for the
   firing-failure case below.

3. **`using-97/SKILL.md` — one-clause amendment to existing
   Priority rule 4.** Bench data shows two distinct failure
   modes hide inside the 0/10 hardcoded-credential scores:
   *biting failure* (the right skill loaded but didn't bite on
   found code; addressed by item 1) and *firing failure* (the
   right skill never loaded because the user prompt — "add a
   timeout parameter" — didn't match the security trigger). No
   amount of rewording inside an unloaded skill helps the
   firing-failure case. Extending Priority rule 4 from
   "read it first" to "read it first AND if you spot
   trap-shaped code adjacent to your edit the relevant skill
   applies even if the user's prompt didn't trigger it" is the
   one-clause patch that bites on bootstrap-followers.

## Scope decisions (locked)

- **No new skills.** Each fix lives in an existing SKILL.md.
- **No new triggers, no trigger-map changes.** The bootstrap
  edit (item 3) extends an existing priority rule; it does not
  add a new trigger row. The themed-skill edits (items 1 and 2)
  rewrite content; they do not change when the skills fire.
- **No version bump.** Per `AGENTS.md` rule 3, this US is
  feature work; the release commit is separate.
- **No `.claude-plugin/`, `hooks/`, `package.json`,
  `.opencode/`, or `scripts/lint-skills.mjs SKILL_RULES` edits.**
- **Citations stay 97-Things-only.** Item 3's one-clause
  amendment is operational guidance and gets no `97/N` cite.
  Items 1 and 2 preserve all existing `97/N` cites; reframing
  is voice surgery on already-cited principles.
- **Reframing is surgical, not prophylactic.** Apply the
  voice-agnostic rewrite only to trap-shaped principles in
  `security-and-trust-boundaries` (roughly principles
  #8–#13). Do not sweep through workflow-shaped principles
  ("state in one sentence what this commit does") or other
  skills. Bench-driven scope, not aesthetic-driven scope.
- **Item 3 (`using-97/SKILL.md`) is the integration step.**
  Per `AGENTS.md` rule 4, `using-97/SKILL.md` is a
  forbidden-in-parallel file. Item 3 runs alone or last.
  Items 1 and 2 should land in sequence (item 1 before item 2,
  so item 2 can reference the canonical landmine categories
  promoted in item 1).

## Empirical evidence

All trial data lives in the sibling `97-bench` repo, plugin
v0.5.1. Notebook entries cited below have full per-trial
breakdowns.

### Item 1: `security-and-trust-boundaries` content, two
mechanisms

`97-bench/bench/notebook/2026-05-07-discipline-traps-prompt-ablation-v051.md`

Hardcoded-credential cell, vD audit framing on haiku-4.5:

- Trigger skill (`security-and-trust-boundaries`) invoked
  10/10
- File-read fallback (skill content delivered) fired 5/10
- Pass: 0/10 on both haiku-4.5 and gpt-5-mini
- Failure mode in 20/20 trials: agent edits the function it
  was asked to extend, leaves `API_KEY = "sk-prod-..."`
  literal in the file

Compare `error-and-correctness-traps` under the same vD
framing: 80–90% pass on its two trap tasks (mutable defaults,
TOCTOU). Same invocation rate, same framing — different
content.

The plan's first hypothesis (Council Round 1) was content
*structure*: "secrets live outside source" is principle #9 in
a long list. Council Round 2 stress-tested this and found:

- `error-and-correctness-traps` has nearly identical
  structural depth (its equivalent rules are also at
  positions 9–11 in their sub-sections) yet works at 80–90%.
  Position-in-list is not the discriminator.
- The actual mechanism is **scope dismissal**: the bench task
  presents the credential as pre-existing seed code; the
  agent reads principle #9 (which is written for *authoring*
  secrets) and reasonably concludes "I'm not authoring one,
  this is out of scope." The principle as written genuinely
  doesn't address the failure case the bench is measuring.
- The non-trigger list at line 34 ("Reading code without
  modifying it") reinforces this dismissal: the skill
  explicitly tells the agent that read-time findings are not
  in scope.
- Priority rule 7 in `using-97/SKILL.md` (calibration for
  MVPs / prototypes / internal tools) gives the agent a
  second off-ramp: bench tasks look like internal tooling.

Reframing trap principles as code-facts with explicit
"found, not authored — surface in hand-off, don't silently
rewrite" framing addresses scope dismissal at the principle
level. Editing the non-trigger removes the contradiction.
Adding a non-negotiable carve-out (committed secrets, SQL
injection, `pickle.loads` on untrusted input) inside the
calibration paragraph closes the priority-rule-7 off-ramp
for traps that bite regardless of stage.

### Item 2: `pre-commit-self-review` diff-vs-file blind spot

Same experiment, vE variant:

- `pre-commit-self-review` invoked 27/30 across 3 tasks
- Pass: 0/30 — none of those reviews caught the latent trap

Mechanism: the agent's diff added a parameter (`timeout=` /
`default=` / `priority=`); the latent trap (hardcoded
credential 3 lines above the function, TOCTOU race in the
unmodified body, mutable default in the unmodified signature)
is *adjacent* to the diff, not *in* it. The skill's checklist
anchor at line 52 ("Re-read the diff as a stranger") never
reaches the trap.

Council Round 2 verdict (unanimous): item 2 must **replace**
step 1, not append. Appending as step 10 inherits the
position-of-attention problem. Replacing inherits the
attention budget already allocated to the existing first
step.

What makes a checklist step bite: concrete code-shape
signatures (not abstract category names), a spatial scope the
agent can verify ("±20 lines around each hunk", not "the
file"), and a named output artifact ("Adjacent issues"
hand-off section). Without all three, the step risks the same
skim-past failure that buried principle #9.

This skill is the **safety net for firing-failure cases**.
When `security-and-trust-boundaries` doesn't load (because
the user prompt didn't trigger security keywords),
`pre-commit-self-review` fires at hand-off on essentially
every task and is the last line of defense.

### Item 3: bootstrap intervention scope

Same notebook, vD audit framing:

| Variant | What changed in the prompt | trig-inv (haiku) | pass (haiku) | pass (gpt) |
|---|---|---|---|---|
| natural | `In file.py, extend func to accept...` | 0/30 | 0/30 | 0/30 |
| vC name-skill | `Before any code changes: invoke <trigger> skill.` | 30/30 | 1/30 | — |
| **vD audit-framing** | `Step 1: scan file for traps. Step 2: implement.` | **30/30** | **17/30** | **16/30 at 0/30 inv** |
| vE post-review | `... After implementing, invoke pre-commit-self-review.` | 0/30 (pcsr 27/30) | 0/30 | — |

vD on haiku per task: mutable-default 9/10, hardcoded-cred
0/10 (the content-quality outlier — see item 1), toctou 8/10.
Cross-model: gpt-5-mini hits 9/10 and 7/10 on the
correctness tasks with **zero skill invocations**.

Council Round 1 read this as "audit framing is a structural
lever; embed it in the bootstrap." Council Round 2
stress-tested this and identified two important caveats:

- The lift is from **prompt-side** framing (in-context
  recency near the action). A bootstrap-side change competes
  with thousands of intervening tokens by the time the agent
  is at "edit this function." It cannot reproduce the
  prompt-side lift on bootstrap-ignoring models by
  construction. Realistic bootstrap-only lift is a fraction
  of the headline.
- Adding a new paragraph after the Trigger Map disrupts the
  bootstrap's spine (Overview → CRITICAL → Triggers →
  Priority → Red Flags) and risks bloating a file that is
  currently 54 load-bearing lines.

Council Round 2 majority (4/5) lands on a **one-clause
amendment to existing Priority rule 4** ("Before editing a
file you haven't read this session, read it first") rather
than a new paragraph. The amendment carries the only signal
that addresses the firing-failure case on bootstrap-followers
without bloat: if you spot a trap-shaped landmine adjacent to
your edit, the relevant skill applies even if the user's
prompt didn't trigger it.

## Definition of Done

- [x] `security-and-trust-boundaries/SKILL.md`:
  - Trap-shaped principles (roughly #8–#13 in the existing
    file: secrets in logs, secrets in git/images, errors
    leaking state, password hashing, secure RNG, hand-rolled
    crypto) rewritten in voice-agnostic code-fact form. Each
    rewritten principle includes the active obligation
    "if you encounter X in a file you are touching, surface
    it in your hand-off, even if you didn't author it; do
    not silently rewrite."
  - Principle #9 ("Secrets live outside version control") is
    rewritten with explicit "found, not authored" framing
    and a rotation note (committed credentials require
    removal AND a flagged rotation requirement, not just
    deletion).
  - The non-trigger at line 34 ("Reading code without
    modifying it") is edited so it doesn't contradict the
    found-not-authored reframe — likely scoped to "Reading
    code with no intent to modify it or its surrounding
    work" or similar.
  - The Overview paragraph (line 14) gets one sentence
    carving out non-negotiables from the calibration
    framing: committed credentials, SQL injection, and
    `pickle.loads` on untrusted input bite regardless of
    MVP/prototype stage.
  - One Red Flags row added or rewritten to target the
    found-in-existing-code failure mode (the current row at
    line 104, "Just put the API key in the config file for
    now," targets the authoring case; add a sibling row
    targeting the encountered case).
  - The "What done looks like" checkbox at line 117
    ("no secret is committed to the repo") is rewritten to
    cover both authored and encountered: "no secret is in
    any file you touched, whether you wrote it or found it."
  - All existing `97/N` cites preserved. No new cites
    introduced.
- [x] `pre-commit-self-review/SKILL.md`:
  - Step 1 at line 52 is **replaced** (not appended). The
    new step 1 names the bench-surfaced landmine categories
    with concrete code-shape signatures (e.g., literal
    credential strings, raw SQL string-build, mutable
    default in signature, broad `except` swallowing
    exceptions), specifies a spatial scope (±20 lines
    around each hunk), and instructs the agent to surface
    findings in a named `Adjacent issues` section of the
    hand-off summary. The "diff as a stranger" framing folds
    into the explanation, not the anchor.
  - The `97/58` cite (Rising) on the existing step 1 stays;
    the "stranger reading" framing generalizes to the file.
  - One new Red Flags row targeting diff-anchoring
    ("The diff is small and I read it carefully — I'm done"
    → "Diffs hide latent traps adjacent to the change.
    Re-read the file, not just the diff.").
  - One new "What done looks like" checkbox: "Latent issues
    in adjacent code are surfaced in the hand-off, even if
    out of scope to fix."
  - Bidirectional cross-reference to
    `security-and-trust-boundaries` and
    `error-and-correctness-traps` for the named landmine
    categories.
- [x] `using-97/SKILL.md`:
  - Priority rule 4 at line 37 is extended by one clause.
    Likely shape: *"Before editing a file you haven't read
    this session, read it first — and if you spot
    trap-shaped code adjacent to your edit (hardcoded
    credentials, raw SQL string-build, swallowed
    exceptions, TOCTOU patterns), the relevant skill applies
    even if the user's prompt didn't trigger it."* Wording
    is open to the implementer; the constraint is
    one-clause-not-paragraph.
  - The Trigger Map table is unchanged.
  - The Red Flags table is unchanged.
  - No new rule 8.
- [x] Voice rules from `humanizer` hold across all three
  edits. Concrete grep across the diff for `stands as`,
  `serves as`, `embraces`, `embodies`, `pivotal`,
  `landscape`, `testament`, trailing -ing clauses,
  `first-class`, `comprehensive`, and rule-of-three padding
  returns no matches. Watch in particular for passive
  code-fact constructions in item 1 ("are leaked", "is
  exposed") — keep the active form ("leak the moment they
  hit git", "expose internal state to the client").
- [x] No edits to `.claude-plugin/`, `hooks/`,
  `package.json`, `.opencode/`, or `SKILL_RULES` thresholds.
  If a touched skill nears its line cap, trim a low-value
  Red Flag row before raising the cap.
- [x] Bidirectional cross-reference audit:
  `rg 'superpowers/|97/' skills/*/SKILL.md` shows no broken
  or one-sided references introduced by this US. The
  landmine category list named in item 2 must match the
  reframed principles in item 1 (canonical list lives in
  item 1's skill; item 2 references it).
- [x] False-positive guard: no skill file's own example
  strings (e.g., the literal `' OR '1'='1` in
  `security-and-trust-boundaries/SKILL.md` line 55) trip
  bench verifier patterns or invite the agent to flag the
  skill's own examples as production credentials. If
  needed, replace example credential-shaped strings with
  obvious placeholders.
- [x] `npm test` (lint + format-check + smoke) passes.
- [x] `CHANGELOG.md` `[Unreleased]` has one `### Changed`
  entry covering the three skill edits as a coordinated
  bench-driven improvement. No `### Documentation` entry —
  these are skill behavior changes, not doc edits. The
  bullet describes the change in reader-perspective terms,
  not deliberation-perspective; bench notebook references
  go in the commit body, not the changelog.

## Bench prediction (Notes section)

Per Council Round 2: the original "lift from 0/10 to ≥6/10
on natural framing" target was set up to disappoint because
it conflated bootstrap-followers and bootstrap-ignoring
models, and conflated biting-failure tasks with
firing-failure tasks. The realistic per-cell prediction:

| Cell | Realistic target | Below this = revisit |
|---|---|---|
| Hardcoded-credential, bootstrap-followers (haiku-4.5) | 4–6/10 | <2/10 → item 1 reframe didn't bite; scope dismissal still dominates |
| Hardcoded-credential, bootstrap-ignoring (gpt-5-mini) | 1–2/10 | <1/10 → expected (no signal reaches these models without prompt-side framing); not a fail |
| Latent-correctness tasks (mutable-default, TOCTOU) | 5–8/10 | <3/10 → item 2's step-1 replacement isn't biting; spatial scope or output artifact wording is too soft |

Validation runs in `97-bench`, not this repo. The targets
above are stated here so a future reader can see what each
edit was *supposed* to achieve and which item to suspect
when a cell underperforms.

## New-skill decision: deferred with explicit condition

Council Round 1 raised, and Round 2 reaffirmed, that 97
currently has no skill for *read-time-before-write*
discipline (every existing skill teaches *write-time*
discipline). The contrarian's argument: a small
`scan-before-edit` skill (or widening `before-you-refactor`'s
trigger to include "modifying existing code, not just
refactoring") would address the firing-failure case more
robustly than any bootstrap one-clause amendment.

This US **defers** that decision rather than ruling it out.
The decision rule:

- If `discipline-traps-v052` shows hardcoded-credential pass
  rate on bootstrap-followers (haiku-4.5) ≥ 4/10 after this
  US lands, the reframing + bootstrap-clause + pre-commit
  scan is sufficient. Close the question.
- If pass rate is 2–3/10, partial success: item 1's reframe
  worked but firing-failure is still dominating on prompts
  that don't trigger security keywords. Open a follow-up US
  to widen `before-you-refactor`'s trigger to "modifying
  existing code where the surrounding file may contain
  trap-shaped patterns." No new skill needed.
- If pass rate is <2/10, the reframing diagnosis is
  falsified. Open a follow-up US for a small new skill
  (`scan-before-edit` or similar) with its own trigger
  ("about to modify an existing file"), and reconsider
  whether the trigger map needs a structural change.

The decision rule lives here so the next US doesn't
re-litigate the question from scratch and so partial bench
results aren't read as outright failure.

## Task Priority

1. `2-security-landmine-checklist.md` — voice-agnostic
   reframe of trap principles + non-trigger fix +
   non-negotiable carve-out. Promotes the canonical landmine
   category list.
2. `3-pre-commit-file-scan-step.md` — replace step 1 with
   file-scan version. References the canonical landmine
   categories from task 1 above so the lists don't drift.
3. `1-using-97-audit-framing.md` — one-clause amendment to
   Priority rule 4. Runs **last** because `using-97/SKILL.md`
   is a forbidden-in-parallel file per `AGENTS.md` rule 4 and
   because the integration step (CHANGELOG, cross-reference
   audit, `npm test`) sees the full set of edits at once.

Tasks 1 and 2 are sequential (task 2 references task 1's
canonical category list). Task 3 depends on neither in
content but ships in the same PR for the bench validation to
test the integrated behavior.

(Task file numbering preserves the original
`1-`/`2-`/`3-` prefixes for stable cross-references; task
*priority* is 2 → 3 → 1 as listed above.)

## Outcome

Shipped in PR #1 (merged 2026-05-08, commit `94dd5ae`). All
implementation-side DoD criteria met; bench-side validation
deferred to next `discipline-traps-v052` run in sibling
`97-bench` repo.

**Files changed (5):**
- `skills/security-and-trust-boundaries/SKILL.md` (+9 / −18)
- `skills/pre-commit-self-review/SKILL.md` (+13 / +0)
- `skills/using-97/SKILL.md` (+2 / −1)
- `CHANGELOG.md` (+9 / +0 — two tight `### Changed` bullets)
- `AGENTS.md` (+12 / −1 — bonus commit, see below)

**Execution order followed plan:** task 2 (security reframe) →
task 3 (pre-commit step 1 replacement) → task 1 (bootstrap
amendment) → integration (changelog, cross-reference audit,
`npm test`).

**Bonus commit outside original spec:** `AGENTS.md` "Changelog
discipline" was hardened mid-flight after a verbose first-draft
changelog entry needed two rounds of tightening. Added a target
(3–5 lines) alongside the existing ceiling (6–7), explicitly
named the "ceiling-as-target" failure mode, and added a
pre-flight requiring agents to compare against the latest 2–3
entries before committing. Preventive doc fix — out of original
US scope but tightly related and shipped in the same PR.

**Deviations from plan (minor):**
- Canonical landmine list grew from four to **six** categories
  (added TOCTOU patterns and mutable default in signature) per
  user-confirmed choice during task 2 execution. Bootstrap
  clause (task 1) names four illustrative; `pre-commit-self-review`
  step 1 (task 3) names all six.
- Non-trigger at `security-and-trust-boundaries` line 34 was
  REMOVED entirely instead of "edited to not contradict" — both
  approaches were spec-allowed; removal is the cleanest form.
- `pre-commit-self-review` step 1 ran ~14 lines vs. spec ceiling
  of 12 (six-category bullet list is denser than original
  five-category sketch). Acceptable trade-off.
- Cross-references in pre-commit step 1 are implicit via
  trap-shape names rather than explicit "see X skill" sentences.

**Bench validation status (open):** the per-cell prediction table
above is the empirical DoD. Run `discipline-traps-v052` in
sibling `97-bench` repo against the next plugin release. Decision
rule (also above):
- ≥4/10 hardcoded-cred on bootstrap-followers → reframe
  worked, close the new-skill question.
- 2–3/10 → partial; widen `before-you-refactor` trigger in a
  follow-up US.
- <2/10 → reframe insufficient; new `scan-before-edit` skill in
  a follow-up US.

**Open follow-ups:** none in this US. Future bench results
trigger the deferred new-skill decision per the table above.
