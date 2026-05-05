# add-security-traps-skill

**Council confidence:** [Consensus] — all 5 councillors named security
as the largest behavioral gap in the bundle.

## Context

The current 9 themed skills do not cover security as a discipline.
Agents routinely:

- Concatenate user input into SQL strings
- Spawn shells with `shell=True` / unescaped args
- Write user input straight to file paths (path traversal)
- Log secrets, tokens, PII, and bearer tokens
- Use unsafe deserialization (`pickle`, `yaml.load` without `SafeLoader`,
  Java/PHP unserialize)
- Generate eval-style code (`eval`, `exec`, `setTimeout` with strings)
- Pass user-controlled URLs to server-side fetchers (SSRF)
- Skip input validation on data crossing trust boundaries

The book *97 Things* predates much of modern security practice and has
limited principle-shaped content here. **This skill is the one acceptable
"book-inspired plus agent-critical extension" in v0.3.** Frame it as
extending the book's tradition (#26 "Don't ignore that error" generalizes
to "don't ignore the trust boundary") with material the book didn't
cover at the depth modern agent work needs.

**Value delivered:** closes the single largest production-risk gap in
the bundle; mirrors the strongest existing skill's shape.

## Related Files (to create)

- `skills/security-and-trust-boundaries/SKILL.md` — name is fixed; do
  not rename during the task
- `skills/security-and-trust-boundaries/principles.md`
- `skills/using-97/SKILL.md` — add trigger row
- `scripts/lint-skills.mjs` — add `SKILL_RULES` entry
- `README.md` — add row to "What's inside" table
- `CONTENT-LICENSE.md` — paragraph documenting this skill's mixed
  content provenance (mostly original commentary; #26/#29 distillations
  under CC-BY-3.0)

## Dependencies

- Should land **after** `prune-bootstrap-urgency.md` so the new trigger
  row is added to the slimmed-down bootstrap rather than the bloated one.
- **Lint cap target: `maxLines: 250`**, same as other content skills
  (`decide-lint-budget-policy` decision). The 280–320 line projection
  in earlier drafts was padded; the gold-standard
  `error-and-correctness-traps` covers ~7 trap domains in ~130 lines,
  so 5 trap domains at the same density should fit in ~150–200 lines.
  Aim for that density. If after a real density pass the skill
  genuinely cannot fit in 250, bump *only* this skill's cap (to 280
  or 300) and document the reason in the CHANGELOG — do not blanket-
  loosen.

## Acceptance Criteria

- [x] New skill directory exists with `SKILL.md` and `principles.md`.
- [x] `SKILL.md` follows the **`error-and-correctness-traps` template
      exactly**: Overview → When to invoke → Non-triggers → Precedence →
      Trap checks by domain (numbered) → Red Flags table → What "done"
      looks like → Principles in this skill table.
- [x] At minimum the following trap domains are covered, each with at
      least one concrete example/code snippet:
  - [x] **Injection:** SQL, shell, command, LDAP, NoSQL — with the
        canonical "use parameterized queries / `shell=False`" fix
  - [x] **Untrusted input boundaries:** path traversal, SSRF, XXE,
        deserialization (`pickle`, `yaml.load`)
  - [x] **Secrets in transit/storage:** logging tokens, error messages
        that leak credentials, secrets in stack traces, secrets in
        version control
  - [x] **Crypto misuse:** plain MD5/SHA1 for passwords, hand-rolled
        crypto, weak random, hardcoded IVs
  - [x] **Authentication/authorization:** missing authz checks on new
        endpoints, IDOR, privilege escalation via user-controlled IDs
- [x] Trigger phrasing in `using-97/SKILL.md` is concrete and decidable,
      not "when writing security-sensitive code." Example acceptable
      phrasing: "Parsing user input, writing/executing SQL or shell
      commands, handling secrets/tokens/credentials, hashing passwords,
      adding/changing an auth check, deserializing untrusted data, or
      constructing file paths from input."
- [x] Non-triggers list includes obvious exclusions (renaming a local
      variable in a function that happens to live in `auth/`).
- [x] Precedence section: notes overlap with `error-and-correctness-traps`
      (input validation as error handling), and cites
      `superpowers/systematic-debugging` for "is this a security
      vulnerability" forensics.
- [x] Voice passes the humanizer rules (no AI tells, imperative,
      concrete).
- [x] `scripts/lint-skills.mjs` `SKILL_RULES` entry added with:
  - `maxLines: 250` (same as other content skills; aim for
    `error-and-correctness-traps` density first; bump only this
    skill's cap with a CHANGELOG reason if 250 truly cannot hold
    after a real density pass)
  - `sections: ['Overview', 'When to invoke', 'Red Flags']`
  - `principles: [26, 29]` — #26 (Goodliffe, "Don't ignore that
    error") and #29 (Griffiths, "Don't rely on magic"), the two book
    principles that generalize cleanly to trust-boundary discipline.
    The rest of the skill content is original commentary.
- [x] `CONTENT-LICENSE.md` updated **unconditionally** with a
      paragraph documenting that this skill is predominantly original
      commentary (MIT plugin code license applies to original parts;
      #26/#29 distillations remain attributed under CC-BY-3.0 with
      author credit in `principles.md`). The book has thin direct
      coverage of modern security practice — this is the project's
      one acknowledged "97-inspired plus extension" skill.
- [x] `README.md` "What's inside" table updated; total skill count
      changes from 10 → 11.
- [x] `CHANGELOG.md` `### Added` entry written.
- [x] `npm test` passes.

## Verification

**Automated:**
- `npm test` validates structure and presence
- Smoke test confirms the bundle still loads

**Ad-hoc:**
- Manual read-through: every trap has a concrete example, not just a
  category name. Compare line-by-line to `error-and-correctness-traps`
  density.
- Spot-check in one harness: ask the agent to "write a Python function
  that runs a shell command from user input." Verify it triggers this
  skill and produces `subprocess.run([...], shell=False)` with proper
  argument list, not `os.system(f"cmd {user_input}")`.

## Notes

- **Name is fixed: `security-and-trust-boundaries`.** Decided at story
  level to remove naming-bikeshed risk during implementation. The name
  describes the skill's actual scope (trust-boundary discipline) more
  precisely than `security-traps` would.
- The `principles.md` should distinguish clearly between content
  derived from CC-BY-3.0 originals (cite under that license, with
  author credit) vs. original commentary written for this plugin (MIT
  plugin code license applies). The unconditional `CONTENT-LICENSE.md`
  update covers the policy side.
- **Do not** pad with 12 trap domains. 5 dense, well-exampled domains
  beats 12 thin ones. The goal is the `error-and-correctness-traps`
  template, not a security textbook.
- **Trigger overlap with `error-and-correctness-traps`** (input
  validation as error handling): the Precedence section must spell
  out how an agent picks. Suggested rule: trust-boundary crossings
  (untrusted input, secrets, auth, deserialization, code execution
  surfaces) → this skill; non-security correctness traps (errors,
  floats, concurrency, IPC, perf, singletons) → the existing
  trap skill.
