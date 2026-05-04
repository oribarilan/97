# 1-scaffold-plugin-bundle

## Context

Set up the OpenCode plugin bundle skeleton so the rest of the work has a place to live. This task ships an installable (but empty-of-skills) plugin: someone could add it to `opencode.jsonc` today and OpenCode would load it without errors — it just wouldn't expose any skills yet.

Mirrors the `superpowers` plugin layout exactly so behavior is predictable and so `using-97` (next task) can crib the bootstrap pattern.

**Value delivered**: A real, installable plugin bundle. Proves the install UX works end-to-end before any skill content is written.

## Related Files

- `~/.config/dotfiles/opencode/superpowers/.opencode/plugins/superpowers.js` — reference implementation to mirror
- `~/.config/dotfiles/opencode/superpowers/package.json` — reference package.json
- `~/.config/dotfiles/opencode/superpowers/.opencode/INSTALL.md` — reference install doc

## Dependencies

- None (this is the foundation)

## Acceptance Criteria

### Plugin scaffold

**OpenCode plugin API surface (verified against superpowers v5.0.7):**

- Plugin entry: **named export** (e.g., `export const NinetySevenPlugin = async ({ client, directory }) => { ... }`), NOT default export. Discovered from `package.json` `main`.
- Skill registration: `config` hook pushes the absolute `skills/` path into `config.skills.paths`. OpenCode lazily discovers skill files from those paths.
- **Skill names are flat** — invoked by bare name (`before-you-refactor`), NOT prefixed by plugin name. No `97/` namespace.
- Bootstrap injection: `'experimental.chat.messages.transform'` hook prepends bootstrap content to the **first user message** (not a system message — avoids token bloat per turn and Qwen multi-system issues). Idempotent via substring marker check (e.g., `EXTREMELY_IMPORTANT`).
- Bootstrap content built dynamically: read `using-97/SKILL.md`, strip frontmatter, wrap in `<EXTREMELY_IMPORTANT>...</EXTREMELY_IMPORTANT>` with tool-mapping block. Mirror superpowers' `getBootstrapContent()` helper.
- Zero runtime deps; use only Node built-ins (`path`, `fs`, `os`, `url`).

**Acceptance:**

- [ ] **Vendor reference files** into `.todo/US-97-mvp/reference/`: copy `superpowers.js`, `using-superpowers/SKILL.md`, `test-driven-development/SKILL.md` from `~/.config/dotfiles/opencode/superpowers/...` so subagents on other machines can read them. Also commit the public-mirror URL (`https://github.com/obra/superpowers`) as a fallback.
- [ ] **Package name = `97`** (locked default). Verify it works in: (a) npm — leading-digit names ARE allowed by npm spec but check `npm install` from git URL succeeds; (b) OpenCode's plugin loader — confirm it resolves `97@git+https://...` syntax; (c) skill discovery — confirm skills load and are invokable by bare name. **Only if any of these reject `97`**, fall back to `ninety-seven` (npm package name) while keeping "97" as repo/brand name and `name: 97` in skill frontmatter. Record the decision in `package.json` + README.
- [ ] `package.json` exists at repo root with `name: "97"` (or fallback), `version: "0.1.0"`, `type: "module"`, `main: ".opencode/plugins/97.js"`. Add `scripts: { "lint": "node scripts/lint-skills.mjs", "smoke": "node scripts/smoke-load.mjs", "test": "npm run lint && npm run smoke" }`.
- [ ] `.opencode/plugins/97.js` exists and **named-exports** `NinetySevenPlugin` (mirror superpowers signature). Document the API surface above as a comment block at top of file. Record OpenCode version tested. The plugin must:
  - [ ] Resolve the bundled `skills/` directory absolutely via `import.meta.url` + `fileURLToPath` (mirror superpowers lines 8-13, 51)
  - [ ] Implement the `config` hook to push `skillsDir` into `config.skills.paths` (mirror superpowers lines 89-95) — idempotent (don't push duplicates)
  - [ ] Implement the `'experimental.chat.messages.transform'` hook to inject the bootstrap into the first user message (mirror superpowers lines 101-110) — idempotent via substring marker
  - [ ] `getBootstrapContent()` helper reads `using-97/SKILL.md`, strips frontmatter, wraps in `<EXTREMELY_IMPORTANT>` + tool mapping (mirror superpowers lines 56-82). Returns `null` if the file doesn't exist (graceful no-op for incremental development)
- [ ] `skills/` directory exists at repo root (empty placeholder, with a `.gitkeep` so it commits)

### Project files

- [ ] `README.md` exists with: one-paragraph description of 97, install snippet (`"plugin": ["97@git+https://github.com/oribarilan/97.git#v0.1.0"]` — pinned to tag, not floating `main`), credit to the source book and Birat Rai's Medium series, **content-licensing notice** (unofficial companion, not affiliated with O'Reilly/contributors, MIT covers code only), and a "What's inside" stub that will be filled in as skills land
- [ ] `LICENSE` file exists (MIT — covers plugin code only)
- [ ] `CONTENT-LICENSE.md` exists per the source-material policy in `main.md` (clarifies MIT scope, points to CC-BY-3.0 origins of the principles, takedown commitment)
- [ ] `.gitignore` excludes `node_modules/`, `.DS_Store`, and any local-only files

### Automated checks (NEW — replaces "no automated test" stance)

- [ ] `scripts/lint-skills.mjs` exists (≤80 LoC, zero deps, uses Node built-ins). Checks every `skills/*/SKILL.md`:
  - [ ] Frontmatter parses, has `name` and `description`
  - [ ] `description` starts with "Use when"
  - [ ] Skill dir name matches frontmatter `name`
  - [ ] Body contains required sections: `Overview`, `When to invoke`, `Red Flags`
  - [ ] Body contains a markdown table after the `Red Flags` heading
  - [ ] Line count ≤ declared budget (per-skill budgets hard-coded in the script, sourced from this folder's task files)
  - [ ] If `principles.md` exists, it contains every `#NN` principle number listed for that skill in `main.md`'s grouping table (regex set equality)
- [ ] `scripts/smoke-load.mjs` exists (≤40 LoC). Imports `.opencode/plugins/97.js`, asserts default export is a function, calls it with a minimal stub OpenCode API, asserts no throw and that the registered skills directory resolves to a real dir
- [ ] `npm test` runs both scripts and exits 0 on the empty-skills repo
- [ ] Both scripts are idempotent and run in <2s

## Verification

- **Automated** (must pass):
  1. `npm test` exits 0 (lint + smoke pass on empty-skills repo)
  2. `node -e "import('./.opencode/plugins/97.js').then(m => console.log(typeof m.default))"` prints `function`
- **Ad-hoc**:
  1. In a sandbox `opencode.jsonc`, add `"97@file:/Users/orbarila/repos/personal/97"` to the `plugin` array
  2. Start OpenCode in a throwaway directory
  3. Confirm OpenCode starts without errors and the plugin loads (check OpenCode logs / no startup crash)
  4. Run `git status` in the 97 repo — clean working tree (everything committed)

## Notes

- DO NOT add `node_modules/` to git. The plugin must be zero-dependency at runtime (mirror superpowers — it uses only Node built-ins: `path`, `fs`, `os`, `url`). The lint/smoke scripts must also be zero-dep.
- `.opencode/plugins/97.js` should be readable in under 5 minutes. If it's getting longer than `superpowers.js` (~112 lines), something is wrong — copy more, invent less. **Exception**: the comment block documenting the OpenCode plugin API surface is mandatory and doesn't count against this budget.
- Do NOT commit any skill content in this task. Skills come in subsequent tasks. This task is purely the bundle skeleton + automated rails.
- Licensing rationale lives in `main.md` (Source material policy). Do not re-litigate here.
