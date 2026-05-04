# skill-pre-commit-self-review

## Context

Build the `pre-commit-self-review` themed skill — the "last line of defense" before code ships. Triggers when the agent is about to commit, declare a task done, open a PR, or hand off code for review.

**Value delivered**: Agents catch their own mistakes before the human partner has to. High-leverage skill: cheap to invoke, expensive to skip.

**Use `3-skill-before-you-refactor` as the template.**

## Related Files

- `skills/before-you-refactor/SKILL.md` — proven template
- `.todo/US-97-mvp/main.md` — cross-cutting rules
- `~/.config/dotfiles/opencode/superpowers/skills/verification-before-completion/SKILL.md` — closely related; cross-reference

## Dependencies

- `3-skill-before-you-refactor.md`

## Source principles to distill

Per `main.md` source-material policy: GitHub mirror first, Medium as reading aid only.

1. **#1 Act with Prudence** — Edward Garson
2. **#9 Check Your Code First Before Looking to Blame Others** — Allan Kelly
3. **#14 Code Reviews** — Mattias Karlsson
4. **#16 A Comment on Comments** — Cal Evans
5. **#42 Keep the Build Clean** — Johannes Brodwall
6. **#47 Know Your Next Commit** — Dan Bergh Johnsson
7. **#58 A Message to the Future** — Linda Rising
8. **#69 Put the Mouse Down and Step Away from the Keyboard** — Burk Hufnagel
9. **#90 Verbose Logging Will Disturb Your Sleep** — Johannes Brodwall

## Acceptance Criteria

- [ ] All 9 sources fetched from GitHub mirror first; provenance recorded in `principles.md`
- [ ] `skills/pre-commit-self-review/SKILL.md` exists with frontmatter:
  - [ ] `name: pre-commit-self-review`
  - [ ] **Trigger** (covers both autonomous and human-driven flows): `description: Use when about to commit, finish a task, open a PR, summarize work for the human partner, or when the human partner asks for a review or hand-off — NOT just on autonomous commits, which are rare in OpenCode usage`
- [ ] Body matches template structure with a concrete **Self-review checklist** the agent runs through before committing/handing off (drawn from #9 and #47)
- [ ] **Non-triggers** subsection lists ≥3 prompts that should NOT fire this skill:
  - mid-implementation edits (skill fires at the end, not in the middle)
  - "fix this typo" / one-line edits (no review surface)
  - exploratory or read-only tasks
- [ ] Body explicitly states: this skill triggers when the human partner asks for review/commit/handoff or when the agent reaches a natural completion point — not only on autonomous `git commit` calls (which are rare in OpenCode usage where the human typically commits)
- [ ] Body cross-references `superpowers:verification-before-completion`: that skill = "did the change actually work" (verification gate); this skill = "is the change well-considered, well-named, well-bounded for the future reader" (broader self-review). Verification runs first; if it passes, this skill applies.
- [ ] `principles.md` has long-form per-principle distillations in your own words (no verbatim quotes >25 words)
- [ ] **"Message to the Future" (#58)** is a section header, not a bullet — make sure it lands
- [ ] `SKILL.md` under 220 lines
- [ ] `scripts/lint-skills.mjs` passes
- [ ] **Positive trigger test 1**: ask agent to make a small code change and "commit it" → invokes skill BEFORE the commit
- [ ] **Positive trigger test 2**: agent finishes a multi-step task and is about to summarize for the human → invokes skill before the summary
- [ ] **Negative trigger test**: mid-task partial edit → does NOT invoke

## Verification

- **Automated**: `npm run lint` exits 0
- **Ad-hoc**:
  - Positive: "make this change and commit it" → expect invocation before the commit command
  - Positive: "you've finished implementing X, summarize for me" → expect invocation before summary
  - Negative: "edit this line, I'll review next" → must NOT invoke (mid-flow)

## Notes

- Avoid overlap with `superpowers:verification-before-completion`. That skill = "did the change actually work". This skill = "is the change well-considered, well-named, well-documented, well-bounded for the future reader". Frame this skill as broader and call out the cross-reference explicitly.
- The "Message to the Future" (#58) framing is gold — make sure it lands as a section, not just a bullet.
- This skill must trigger reliably at task-completion moments even when there's no autonomous commit. The trigger string explicitly covers "summarize work for the human partner" and "human partner asks for review or hand-off" to handle the typical OpenCode flow where humans commit.
