# 2-security-landmine-checklist

(File name preserved for stable cross-references; the actual
edit is **not** a new front-loaded checklist — it's a
voice-agnostic reframe of existing trap principles plus a
non-trigger fix and a non-negotiable carve-out. See "Why
this changed shape" below.)

## Context

`security-and-trust-boundaries/SKILL.md` is well-cited and
covers the right principles. The bench identified a
content-quality problem on the hardcoded-credential task: the
skill is invoked 10/10 on haiku-4.5, content delivered 5/10
via file-read fallback, pass rate stays 0/10. In 20/20
trials the agent edits the function it was asked to extend
and leaves `API_KEY = "sk-prod-..."` literal in the file.

Council Round 1 hypothesized the failure was content
*structure* — "secrets live outside source" is principle #9
in a long list. Council Round 2 stress-tested this and found
the structural hypothesis insufficient on its own:

- `error-and-correctness-traps` has nearly identical
  structural depth (16 red-flag rows, 19 numbered items,
  trap-equivalent rules at positions 9–11) and works at
  80–90% pass under the same bench conditions. Position in
  list is not the discriminator.
- The actual mechanism is **scope dismissal**: the bench
  task presents the credential as pre-existing seed code.
  The agent reads principle #9, classifies it as advice for
  *authoring* secrets, observes that it isn't authoring one
  here, and reasonably concludes the principle doesn't
  apply.
- The non-trigger list at line 34 ("Reading code without
  modifying it") reinforces this dismissal: the skill itself
  tells the agent that read-time findings are out of scope.
- Priority rule 7 in `using-97/SKILL.md` (calibration: prefer
  simplicity in MVPs/prototypes/internal tools) gives the
  agent a second off-ramp. Bench tasks look like internal
  tooling, so calibration says "don't retrofit production
  discipline." But hardcoded credentials are
  *not stage-conditional* — a credential committed in a
  prototype leaks the same as one in production.

The fix is voice surgery on the principles themselves
(rewrite trap-shaped principles as code-facts with explicit
"found, not authored — surface in hand-off, don't silently
rewrite" framing), an edit to the contradictory non-trigger,
and a non-negotiable carve-out in the calibration paragraph
covering committed credentials and a small set of other
always-bites traps. This is the *biting-failure* patch. The
*firing-failure* patch lives in tasks 1 (pre-commit
file-scan) and 3 (bootstrap one-clause amendment).

## Why this changed shape

The original Council Round 1 plan (file name
`2-security-landmine-checklist`) was to add a front-loaded
landmine checklist near the top of the skill. Council Round 2
rejected this as treating a symptom rather than the cause: a
front-loaded checklist that says the same write-time things
in a different position would still be deflected by the
scope-dismissal reflex. Reframing the principles themselves
to bite on found code is the smaller, sharper edit.

If after this US the bench still shows hardcoded-credential
pass rate <2/10 on bootstrap-followers, the front-loaded
checklist remains a fallback option for a follow-up US. Don't
do both at once — they'd duplicate.

**Value delivered:** when `security-and-trust-boundaries`
loads on a task that touches a file containing a hardcoded
credential, missing auth check on a new endpoint adjacent to
the change, raw SQL string-build, or `pickle.loads` on
untrusted data — whether the agent authored it or found it —
the agent surfaces the finding in the hand-off instead of
silently passing.

## Related Files

- `skills/security-and-trust-boundaries/SKILL.md` — voice
  rewrite of trap-shaped principles (roughly #8–#13), edit
  to non-trigger at line 34, one sentence added to Overview
  paragraph at line 14 carving out non-negotiables, one Red
  Flags row added or rewritten, one "What done looks like"
  checkbox at line 117 rewritten.
- `skills/security-and-trust-boundaries/principles.md` —
  long-form sections may need matching tweaks to keep
  voice/wording consistent with the SKILL.md reframe. No
  new principle added; no `97/N` cite changes.

## Dependencies

- None on tasks 2 or 3 in terms of file conflicts (different
  files), but **task 2 references the canonical landmine
  category list this task promotes**, and **task 3's
  bootstrap clause names the same categories**. So this task
  runs **first** in priority order (then task 2, then task
  3) so the canonical list lives in one place and the others
  reference it.

## Acceptance Criteria

### Voice-agnostic reframe of trap principles

- [x] Principle #8 (line 72, "Never log secrets, tokens,
  PII, or auth headers") is rewritten in voice-agnostic
  form. Both authoring and encountering cases are covered.
  Example shape: *"Logs containing `Authorization`, password
  fields, or tokens leak secrets to log aggregators,
  support tools, and screenshots — whether you authored the
  log line or found it. If you encounter such a log line in
  a file you are touching, surface it in your hand-off; mask
  in middleware before committing."*
- [x] Principle #9 (line 73, "Secrets live outside version
  control and outside images") is rewritten with explicit
  "found, not authored" framing AND a rotation note.
  Example shape: *"Hardcoded credentials in source — API
  keys, tokens, passwords, private keys, connection strings
  — are leaked secrets the moment they hit git or a built
  image. Whether you wrote them or found them in code you're
  touching, they require both removal and rotation: deleting
  the commit does not unleak public history. Use the
  platform secret store and reference by name. If you find
  one and the user did not ask you to address it, surface it
  in the hand-off — do not silently rewrite the file."*
- [x] Principle #10 (line 74, "Errors leaking internal
  state") is rewritten in voice-agnostic form. Default
  exception handlers, stack traces in client responses,
  account-existence-disclosing error messages — bite whether
  authored or encountered.
- [x] Principle #11 (line 80, "Passwords: use a
  password-hash function") is rewritten in voice-agnostic
  form. `md5`/`sha1`/`sha256` of `salt + password` is
  broken whether you wrote it or found it; surface and
  surface in hand-off.
- [x] Principle #12 (line 81, "Random for security uses a
  cryptographic RNG") is rewritten in voice-agnostic form.
  `Math.random()` for a CSRF token in existing code is the
  same vulnerability as one you'd add today.
- [x] Principle #13 (line 82, "Don't roll crypto") is
  rewritten in voice-agnostic form. Hand-rolled AES,
  hardcoded IVs, and reused nonces — bite whether authored
  or encountered.
- [x] Each rewritten principle preserves its existing
  `97/N` cite. No new cites introduced.
- [x] Voice check on each rewrite: keep the **active**
  obligation, do not slip into passive code-fact prose.
  Bad: *"Hardcoded credentials are considered leaked
  secrets."* Good: *"Hardcoded credentials leak the moment
  they hit git — whether you wrote them or found them.
  Surface in hand-off; do not silently rewrite."*
- [x] Each rewritten principle includes the explicit
  **surface-don't-silently-fix** carve-out. The agent's
  obligation when finding a pre-existing trap is to surface
  it in the hand-off (so the human can scope the fix), not
  to unilaterally rewrite the file. Without this carve-out,
  voice-agnostic phrasing produces a new failure mode:
  agents helpfully refactoring unrelated files and
  inflating diff size beyond what the user asked for.
- [x] Workflow-shaped principles (those that name an
  authoring action with no read-time analog) are **not**
  rewritten. Examples: principle #14 ("Every new endpoint
  declares its auth requirement explicitly") is intrinsically
  about authoring a new endpoint and stays imperative.
  Principle #7 ("Validate at the boundary, then trust") is
  primarily a write-time discipline and stays imperative.
  Use judgment; the rule of thumb is: **if a principle
  describes a property of code rather than an action by an
  author, it's a candidate for reframe.**

### Non-trigger fix

- [x] The non-trigger at line 34, "Reading code without
  modifying it", is edited so it no longer contradicts the
  found-not-authored reframe. Likely shape: *"Reading code
  with no intent to modify it or its surrounding work
  (pure exploration, code review tooling without an active
  edit context)."* The intent is to keep the carve-out for
  pure read-only exploration while opening the door to
  read-time findings when the agent is actively editing the
  file.

### Non-negotiable carve-out

- [x] The Overview paragraph at line 14 (calibration:
  "fires lightly in MVPs, prototypes…") gets one sentence
  appended carving out non-negotiables. Example shape:
  *"Three traps bite regardless of stage and override the
  calibration above: committed credentials in source,
  string-built SQL or shell commands, and `pickle.loads`
  (or equivalent) on untrusted input. Surface and address
  these even in prototypes and one-off scripts."* Wording
  open; the constraint is that committed secrets, SQL
  injection, and unsafe deserialization must be named
  explicitly as overriding the calibration off-ramp.

### Red Flags row

- [x] One Red Flags row added or rewritten to target the
  found-in-existing-code failure mode. The current row at
  line 104 (*"Just put the API key in the config file for
  now — we'll move it before launch"*) targets the
  authoring case. Add a sibling row, or rewrite this one
  to cover both. Example shape: *"The API key was already
  in the file when I opened it — not my problem."* →
  *"Once it's in git, it's leaked, regardless of who put
  it there. Surface in hand-off and flag for rotation,
  even if the user didn't ask. (97/9)"*

### "What done" checkbox

- [x] The checkbox at line 117 (*"no secret is committed to
  the repo or baked into an image"*) is rewritten to cover
  both authored and encountered. Example shape: *"No secret
  is in any file you touched, whether you wrote it or
  found it. Pre-existing credentials are surfaced in the
  hand-off and flagged for rotation."*

### Cross-skill consistency

- [x] The canonical landmine category list promoted by this
  task — used by task 2's `pre-commit-self-review` step 1
  replacement and task 3's bootstrap clause — is named
  here in one place. Suggested canonical list (≤4
  categories): **hardcoded credentials, raw SQL string-
  build, swallowed exceptions, TOCTOU patterns**. If this
  list changes during implementation, tasks 2 and 3 must
  be updated to match. Drift between the three skills'
  category lists is the cross-skill consistency risk
  Council Round 2 flagged most loudly.

### False-positive guard

- [x] No skill-file example string trips bench verifier
  patterns. Specifically: line 55 contains the literal
  `' OR '1'='1` and line 81 contains `Math.random` —
  these are existing examples and should stay, but if the
  reframe introduces *new* example credential-shaped
  strings (e.g., `sk-prod-...`), use obvious placeholders
  like `<EXAMPLE_KEY>` or `sk_test_fake` so the agent
  doesn't flag the skill's own examples as production
  credentials.

### Voice and structural guards

- [x] Voice rules from `humanizer` hold. Concrete grep
  across the diff for `stands as`, `serves as`, `embraces`,
  `embodies`, `pivotal`, `landscape`, `testament`,
  trailing -ing clauses, `first-class`, `comprehensive`,
  rule-of-three padding returns no matches. Watch for
  passive code-fact constructions: *"are leaked"*,
  *"is exposed"*, *"are considered"*. Active form
  required.
- [x] No front-loaded landmine checklist section added.
  The reframed principles do the work in their existing
  positions. (If after the bench validation we still need
  a front-loaded checklist, that's a follow-up US, not
  this one.)
- [x] Existing long-form sections ("Injection",
  "Untrusted-input boundaries", "Secrets in transit,
  storage, and logs", "Crypto misuse", "Authentication
  & authorization") stay in place. Section headers
  unchanged.
- [x] `security-and-trust-boundaries/SKILL.md` line count
  under cap (per `scripts/lint-skills.mjs`). The rewrite
  may add 5–15 lines net (active obligation clauses are
  longer than write-time imperatives). If the cap is
  approached, trim a low-value Red Flags row or merge
  two short bullet points before raising the cap.
- [x] `npm test` passes.

## Verification

**Automated:** `npm test`.

**Ad-hoc:**

- `rg -n 'sk-(prod|test|live)' skills/security-and-trust-boundaries/`
  must return zero false-positive examples (the skill content
  cannot itself contain credential-shaped strings or the
  bench verifier patterns trip on the skill's own examples;
  use `<EXAMPLE_KEY>` placeholders if needed).
- Read each rewritten principle as a stranger. Apply the test
  *"would this principle bite if the agent encountered the
  trap in pre-existing code that the user did not ask about?"*
  Answerable yes/no by a human reader. If the answer is no,
  the rewrite hasn't landed.
- Read the non-negotiable carve-out aloud. Apply the test
  *"would this carve-out close the priority-rule-7
  calibration off-ramp for committed credentials in a
  prototype?"* If the answer is no, the carve-out wording is
  too soft.

**Bench-side validation (in `97-bench`, separate work):** run
`discipline-traps-v052` against the bumped plugin version.
`hardcoded-credential` for haiku-4.5 should lift from 0/10 to
4–6/10 on natural framing. <2/10 means the reframe didn't
bite — scope dismissal still dominates, and the front-loaded
checklist alternative becomes a candidate for a follow-up
US. See `main.md` "Bench prediction" table for full grid and
revisit conditions.

## Notes

- Voice-agnostic reframing is being applied **surgically**
  to trap-shaped principles in this skill only. It is not a
  global rewrite across all 11 skills. Workflow-shaped
  principles ("state in one sentence what this commit
  does") and design-shaped principles ("declare auth posture
  at route definition time") stay imperative. Council Round
  2 unanimously warned against prophylactic reframing across
  all skills as aesthetic-driven scope creep.
- The "found, not authored — surface in hand-off, don't
  silently rewrite" carve-out is load-bearing. Without it,
  voice-agnostic phrasing produces a *new* bench failure
  mode that doesn't currently exist: agents helpfully
  refactoring unrelated files. Keep this clause attached to
  every reframed principle.
- The choice **not** to add a front-loaded landmine
  checklist (despite the file's name) is a deliberate
  Council Round 2 decision. Reframing existing principles is
  smaller and addresses scope dismissal at the principle
  level rather than in a separate parallel section. If
  bench validation shows reframing alone is insufficient,
  the front-loaded checklist returns as an option in a
  follow-up US — but doing both simultaneously would
  duplicate.
- The new-skill question (a small `scan-before-edit` skill
  or widening `before-you-refactor`'s trigger) is deferred
  with explicit conditions in `main.md` "New-skill
  decision" section. Don't pre-empt that decision in this
  task.

## Outcome

Shipped in PR #1 (merged 2026-05-08, commit `94dd5ae`).
Implementation criteria met; bench validation deferred.

**What landed in `skills/security-and-trust-boundaries/SKILL.md`:**
- Principles #8, #9, #11, #12, #13 reframed in voice-agnostic
  code-shape form, each carrying the surface-don't-silently-fix
  carve-out.
- Principle #10 left mostly unchanged (was already
  property-shaped; minor wording tightening only).
- Non-trigger at line 34 ("Reading code without modifying it")
  REMOVED entirely (spec allowed "edit so it doesn't
  contradict"; removal is the cleanest form).
- Overview gained the override-trio sentence: committed
  credentials in source, string-built SQL/shell commands,
  `pickle.loads` on untrusted input bite regardless of stage.
- Three Red Flags rows (rows 7, 9, 10 — hardcoded creds, weak
  hash, weak RNG) now carry both author-voice and code-shape
  framing.
- "What done" Secrets and Crypto checkboxes updated to require
  surfacing adjacent traps in the hand-off.

**Deviation from spec:** the canonical landmine list landed at
SIX categories, not four as suggested in the spec. Per user
confirmation during execution, the list is: hardcoded
credentials, raw SQL/shell string-build, unsafe deserialization
on untrusted input, swallowed exceptions, TOCTOU patterns,
mutable default in signature. The full list lives in
`pre-commit-self-review` step 1; this skill's reframe covers
the security subset (first three) directly and overrides the
stage calibration for them.

**Verification:** `npm test` green. File at 131/250 lines, well
under cap. Bench-side validation deferred to next
`discipline-traps-v052` run.
