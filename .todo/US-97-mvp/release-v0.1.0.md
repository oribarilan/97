# release-v0.1.0

## Context

All 9 themed skills shipped, README polished, tag cut, push to public repo. This is the "ship it" task — and also the task that **rewrites the `using-97` bootstrap** to reflect the final per-skill `description:` strings (since task #2 ships only a placeholder).

**Value delivered**: 97 is publicly installable. Other developers (and other machines you own) can add one line to `opencode.jsonc` and get the full skill bundle, pinned to a tagged release.

## Related Files

- `README.md` — needs final pass with full skill list + content-licensing notice
- `package.json` — version bump to 0.1.0 (if not already there)
- `skills/using-97/SKILL.md` — rewritten in this task with verified per-skill triggers
- `CONTENT-LICENSE.md` — verified accurate for shipped scope
- `scripts/lint-skills.mjs`, `scripts/smoke-load.mjs` — must exit 0

## Dependencies

- `1-scaffold-plugin-bundle.md`
- `2-bootstrap-using-97.md`
- `3-skill-before-you-refactor.md`
- All 8 unprefixed `skill-*.md` tasks

## Acceptance Criteria

### Content completeness

- [ ] All 9 themed skill directories exist under `skills/` and each has a `SKILL.md` + `principles.md`
- [ ] **`using-97/SKILL.md` rewritten** with the final per-skill `description:` strings copied verbatim from each shipped skill's frontmatter — bootstrap and skills agree, no drift
- [ ] All 10 SKILL.md files (9 themed + bootstrap) include the **Skill precedence** rules from `main.md`
- [ ] Every `principles.md` records source provenance per principle (which source used, access date, gaps)
- [ ] No verbatim quote in any file exceeds ~25 words (spot-check during release review)

### README & docs

- [ ] `README.md` has:
  - [ ] One-paragraph "what is 97"
  - [ ] Install snippet pinned to tag: `"97@git+https://github.com/oribarilan/97.git#v0.1.0"` (NOT floating `main`)
  - [ ] "What's inside" table listing all 9 skills with their final triggers (one row each)
  - [ ] **Content-licensing notice**: unofficial companion to *97 Things Every Programmer Should Know* (O'Reilly, ed. Kevlin Henney); not affiliated with O'Reilly or any contributor; original principles are CC-BY-3.0 from https://github.com/97-things/97-things-every-programmer-should-know; MIT covers plugin code only; takedown commitment
  - [ ] "Credits" section listing **every contributor whose work is distilled in this release** by name (~50 contributors across 78 principles), pointing to the O'Reilly book and the CC-BY GitHub mirror; Birat Rai's Medium series credited as a reading aid
  - [ ] "How it differs from superpowers" section (one paragraph: superpowers = process & methodology; 97 = distilled domain wisdom from a specific book)
  - [ ] "Scope of v0.1.0" section: 78 of 97 principles covered; 19 mindset principles deliberately deferred (link to exclusion list)

### Automated checks (gates)

- [ ] `npm run lint` exits 0 (frontmatter, line budgets, required sections, principle-number coverage for all 10 skills)
- [ ] `npm run smoke` exits 0 (plugin imports, skills directory resolves, all 10 skills enumerable)
- [ ] `npm test` exits 0 (runs both)

### Trigger-overlap matrix

- [ ] Walk through this matrix manually before tagging — for each skill, run one prompt that should fire it AND one that should NOT (the "Negative trigger test" prompts already in each skill task file). Record results in a release-notes file or PR comment.
- [ ] If any skill fails its positive trigger test → fix the `description:` and retest before tagging
- [ ] If any skill fires on a negative-trigger prompt → narrow its `description:` and retest

### Versioning & release

- [ ] `package.json` version is `0.1.0`
- [ ] Clean fresh-install verification: in a throwaway opencode config (e.g., `OPENCODE_CONFIG_DIR=/tmp/97-test-config opencode`), `"plugin": ["97@git+https://github.com/oribarilan/97.git#v0.1.0"]` works after a single `opencode` restart
- [ ] Git tag `v0.1.0` created and pushed
- [ ] GitHub release created with notes summarizing what's in v0.1.0 (use `gh release create`):
  - [ ] Lists all 9 skills with triggers
  - [ ] Names every contributor distilled
  - [ ] States content-licensing posture
  - [ ] Links to the trigger-overlap matrix results

## Verification

- **Automated** (gates):
  1. `npm test` exits 0
- **Ad-hoc**:
  1. On a clean opencode config (separate machine or `OPENCODE_CONFIG_DIR=/tmp/97-test-config opencode`), add the pinned plugin line and restart
  2. Run `skill list` (or whatever the actual OpenCode command is — verify the command name before release; if it doesn't exist, document the alternative discovery method)
  3. In a fresh session, ask "what is 97 and what skills does it include?" — agent must enumerate all 9 themed skills accurately
  4. Run a real refactor task — agent must invoke `before-you-refactor`
  5. Walk the trigger-overlap matrix (positive + negative test per skill) — all pass
  6. `git tag --list` must show `v0.1.0`
  7. `gh release view v0.1.0` must return the release

## Notes

- Do NOT cut the release until every individual skill task has passed its own verification step (positive AND negative trigger tests). Releases are commitments.
- After release, optionally update your personal `~/.config/opencode/opencode.jsonc` to install 97 from the public URL instead of any local file path you may have used during development. Pin to `#v0.1.0` so future churn doesn't break your setup.
- Consider opening an issue/discussion on the 97 repo with a "next 9 skills" wishlist (career-mindset principles, language-specific skills, etc.) to capture future-work ideas before they're lost.
- **Fallback if second human gate failed during the parallel skill phase**: per `main.md` "Alternative scope" — ship a 2-3 skill v0.1.0 (whichever passed the gate) and defer the rest to v0.2+. Adjust this task's "all 9 themed skills" criteria accordingly. Don't ship skills that didn't pass their own verification just to hit the 9-skill target.
