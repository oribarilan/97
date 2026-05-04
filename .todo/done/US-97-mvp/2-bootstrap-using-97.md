# 2-bootstrap-using-97

## Context

Write the `using-97` skill — the bootstrap that gets injected into the system prompt every session. This skill is what makes the agent *aware* of 97 and primes it to invoke the themed skills when the right triggers appear.

This task ships a **placeholder** bootstrap describing the 9-skill trigger map at the level locked in `main.md`. Per-skill trigger strings will be **rewritten in `release-v0.1.0`** once each themed skill is final and its `description:` frontmatter is verified, so the bootstrap and the actual skill descriptions agree.

Without this bootstrap, the themed skills exist but the agent doesn't know to reach for them. With it, every session starts with a one-page contract telling the agent: "you have these 9 lenses on coding wisdom; here's when each one fires."

**Value delivered**: A working agent-priming layer. After this task, installing 97 visibly changes agent behavior even before any themed skill is built (the agent will mention 97 when asked, and will know the trigger map).

## Related Files

- `.todo/US-97-mvp/reference/using-superpowers-SKILL.md` — direct template to model after (vendored in task #1)
- `.todo/US-97-mvp/reference/superpowers-plugin.js` lines 49-95 — how the bootstrap gets injected (already wired in task 1)
- `.todo/US-97-mvp/main.md` — the "Skill grouping" table is the source of truth for the trigger map; the "Skill precedence" section is the source of truth for conflict resolution

## Dependencies

- `1-scaffold-plugin-bundle.md` (the plugin loader needs to exist to inject this)

## Acceptance Criteria

- [ ] `skills/using-97/SKILL.md` exists with valid frontmatter:
  - [ ] `name: using-97`
  - [ ] `description: Use when starting any coding task — establishes the 97 trigger map so principles fire when relevant`
- [ ] Body includes an **Overview** section explaining what 97 is in 2-3 sentences (distilled wisdom from *97 Things Every Programmer Should Know*, sliced into 9 trigger-based skills, sourced from CC-BY-3.0 originals)
- [ ] Body includes a **Trigger Map** table listing all 9 themed skills with their one-line trigger conditions (copy from `main.md` "Skill grouping" — exact text, no drift)
- [ ] Body includes a **How to invoke** section that tells the agent to use the `skill` tool with **bare skill names** (e.g., `before-you-refactor`, `writing-clean-code`) — OpenCode does NOT namespace skills by plugin (verified against superpowers in task #1)
- [ ] Body includes a **Skill precedence** section copied verbatim from `main.md` (user > superpowers process > 97 specific > 97 broad; never duplicate process)
- [ ] Body includes a **Red Flags** table with **≥6 rows** covering rationalizations the agent might use to skip an 97 skill (e.g., "I already know this principle" → "Knowing ≠ applying. Invoke the skill."; "It's just a small change" → "Small changes are where principles get skipped — invoke."; etc.)
- [ ] Body includes a clear **Priority** statement: user instructions override 97; 97 overrides default behavior; explicit project conventions in `AGENTS.md`/`CLAUDE.md` win over 97 principles
- [ ] Body credits the source: *97 Things Every Programmer Should Know* (O'Reilly, ed. Kevlin Henney), states this is an unofficial companion not affiliated with O'Reilly/contributors, and links the CC-BY-3.0 GitHub mirror as the canonical source
- [ ] **Total length under 100 lines** (reduced from 150 — this gets injected into every system prompt; every line costs tokens forever; justify any line over 80)
- [ ] After installing 97 into a sandbox opencode config and starting a session, asking "what is 97?" produces a response that names the 9 skills and their triggers (proves the bootstrap is actually being injected)
- [ ] `scripts/lint-skills.mjs` passes for `using-97/SKILL.md` (frontmatter, sections, line budget)

## Verification

- **Automated**:
  1. `npm run lint` exits 0
  2. `wc -l skills/using-97/SKILL.md` ≤ 100
- **Ad-hoc**:
  1. Install plugin into sandbox opencode config (file: install from local path)
  2. Start a fresh session
  3. Ask: "What is 97 and when should you use each of its skills?"
  4. Response must name `97` by name AND list the 9 themed skills with their triggers
  5. Run 5 distinct prompts that should trigger different 97 skills (e.g., "refactor this", "design a public API", "add tests", "add error handling", "review this before commit"). All 5 should invoke the correct skill — if <4 invoke correctly, the bootstrap content needs sharper trigger language (the `<EXTREMELY_IMPORTANT>` wrapper itself comes for free from mirroring superpowers' `getBootstrapContent()`)

## Notes

- Bootstrap content gets injected into EVERY first user message (per superpowers' `experimental.chat.messages.transform` pattern). Be ruthless about brevity. If a section isn't earning its tokens, cut it.
- The `<EXTREMELY_IMPORTANT>` wrapper + tool-mapping block is added automatically by `97.js`'s `getBootstrapContent()` helper (mirrored from superpowers). The body of `using-97/SKILL.md` does NOT need to include those wrappers — they're injected at runtime.
- DO NOT include the full content of every themed skill here — just triggers. The whole point of skills is progressive disclosure: load the full content only when triggered.
- The themed skills don't exist yet at this point. That's fine — the bootstrap describes *what the skills will do*. Subsequent tasks deliver them. The bootstrap will be **rewritten in `release-v0.1.0`** to reflect the final per-skill `description:` strings, so this task only needs to be approximately right.
- **Skill names are flat** (no `97/` prefix). OpenCode discovers skills by their frontmatter `name:` and the agent invokes them by bare name. Verified against superpowers in task #1.
