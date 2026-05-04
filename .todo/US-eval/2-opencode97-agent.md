# 2-opencode97-agent

## Context

Build the custom harbor agent that drops the 97 plugin into the OpenCode
sandbox. Without this, harbor's stock OpenCode adapter only copies
`skills/`, missing the `.opencode/plugins/97.js` bootstrap that's actually
what makes any 97 skill fire. The sentinel task `97-skills-listed` proves
the plugin loaded.

**Value delivered**: A treatment condition that genuinely tests the 97
plugin end-to-end, not just its skill files.

## Related Files

- Create: `bench/agents/__init__.py`
- Create: `bench/agents/opencode97.py` — `OpenCode97(OpenCode)` subclass
- Create: `bench/sentinel/97-skills-listed/` — sentinel task (format
  resolved in task 1)
- Modify: `bench/README.md` — document `--agent bench.agents.opencode97:OpenCode97`
- Reference (do not modify): `<harbor_clone>/src/harbor/agents/installed/opencode.py`
- Reference (do not modify): `.opencode/plugins/97.js` — the file we copy
  into the sandbox

## Dependencies

- `1-bench-skeleton.md` (task list, results schema, harbor flag confirmations)

## Acceptance Criteria

- [ ] `bench/agents/opencode97.py` defines `class OpenCode97(OpenCode)`
      that:
  - registers itself with a unique name (e.g. `"opencode97"`) — ensure
    harbor's import-path agent loading picks it up
  - takes a `plugin_path` kwarg (path to a JS file on the host, defaulting
    to `<repo>/.opencode/plugins/97.js`)
  - takes a `skills_dir` kwarg via `BaseAgent` (already supported)
  - in `run()`, before calling super's logic, copies the plugin file
    contents into `~/.config/opencode/plugin/97.js` inside the sandbox
    using `exec_as_agent` with a heredoc/echo + `shlex.quote`
- [ ] The plugin file is read from disk at agent construction time and its
      contents stashed on the instance so each trial doesn't re-read.
- [ ] The agent class is invocable via:
      `harbor run --agent bench.agents.opencode97:OpenCode97 --model ...`
      (or whichever flag task 1 confirmed).
- [ ] Sentinel task `97-skills-listed` exists. The instruction reads
      something like: "Write the names of every Skill registered in your
      skill tool, one per line, to /tmp/skills.txt. Do not invoke the
      skills, just list them." The verifier script greps `/tmp/skills.txt`
      for `using-97`.
- [ ] Sentinel task **passes under treatment** and **fails under control**
      when run against `--model anthropic/claude-opus-4-1`.
- [ ] Skill-invocation parser (helper used in task 4) reports
      `using-97` invocations on at least one of the 12 curated tasks under
      treatment.
- [ ] No collision with `OPENCODE_FAKE_VCS=git` — verified by running the
      sentinel and one curated task that touches git (`fix-git`) without
      hangs or crashes.

## Verification

- **Automated** (added to `bench/tests/test_opencode97.py`, run via
  `uv run pytest bench/tests`):
  - Unit test: instantiating `OpenCode97(plugin_path="/nonexistent")`
    raises a clear FileNotFoundError at construction, not at run time.
  - Unit test: the plugin-copy command, when generated against a fixture
    plugin file, contains the expected `mkdir -p ~/.config/opencode/plugin`
    and a heredoc/echo carrying the file's bytes (compare to a known
    fixture).
- **Ad-hoc**:
  - Run `just eval --only 97-skills-listed --condition treatment`. Sentinel
    must pass.
  - Run `just eval --only 97-skills-listed --condition control`. Sentinel
    must fail (the bootstrap is not present, so the agent cannot list
    `using-97`).
  - Run `just eval --only fix-git`. Both conditions complete without
    crashing; trajectory under treatment shows at least one `skill` tool
    call.

## Notes

- Harbor's `OpenCode._build_register_skills_command()` already handles
  `~/.config/opencode/skills/`. Don't duplicate; just add the plugin copy.
- OpenCode's plugin discovery directory: `~/.config/opencode/plugin/`
  (singular `plugin`, not `plugins`). Confirm by reading OpenCode's docs
  before writing the path; if wrong, the bootstrap silently never loads
  and the sentinel will catch it.
- The plugin file is JavaScript and OpenCode's plugin loader expects
  ESM/CJS. Our `.opencode/plugins/97.js` is already in the right format
  (it's the production plugin file). Copy bytes, don't transform.
- If task 1 found that harbor needs a YAML agent config rather than an
  import-path flag, the registration may live in a `bench/agents.yaml`
  passed to `harbor run --config`. Adjust accordingly.
- This task adds a test-file dependency (`pytest`). Add it to `bench/`'s
  own `pyproject.toml` or pin via `uv tool` in `bench/README.md`.
