# 15-meta-rule-and-changelog

## Context

Final task. Encode "subtract before substitute" as durable contributor
guidance, write the single `### Changed` changelog bullet for the whole
sweep, run final verification.

## Related Files
- `AGENTS.md` (one-line addition under rule 5 / voice rules)
- `CHANGELOG.md` (`[Unreleased]` → `### Changed`)

## Dependencies
- All prior tasks

## Acceptance Criteria

- [x] Two meta-rules added to AGENTS.md (rule 5 voice-rule neighborhood):
  1. **Subtract before substitute** — one sentence, plain.
  2. **Agent-first prose in skill files** — one sentence, names what to cut, requires reframing vague rules into actions.
- [x] `CHANGELOG.md` `[Unreleased]` → `### Changed` bullet added (5 lines, past tense, reader's perspective, period at end). Density matches recent peer entries.
- [x] Existing `[Unreleased]` bullets updated to use new vocabulary (`landmines` → `unsafe code`, `hand-offs` → `summaries`) since they hadn't shipped yet.
- [x] `npm test` passes (final run)
- [x] All DoD items in `main.md` met
- [ ] Bullet matches the density of recent peer entries (read latest 2-3 entries first, per AGENTS.md)
- [ ] `npm test` passes (final run)
- [ ] Final `rg` audit confirms all DoD items in `main.md` are met

## Verification

- AGENTS.md contains the meta-rule sentence (visual confirm)
- `CHANGELOG.md` `[Unreleased]` `### Changed` contains the new bullet
- All DoD items in `main.md` checked
- `npm test` exits 0

## Suggested changelog draft (refine after seeing the actual diff)

```
- Tightened skill prose for plainer, more human voice. Removed coined
  metaphors (`trap-scan`, `mid-X`, `landmines`, `the trap closes`) and
  promotional openers across `skills/`, `AGENTS.md`, `CONTRIBUTE.md`,
  and `README.md`. No skill names or behavior changed.
```
