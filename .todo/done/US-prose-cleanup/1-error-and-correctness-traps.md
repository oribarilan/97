# 1-error-and-correctness-traps

## Context

Densest jargon file (9 flagged hits). This is the calibration checkpoint —
the user reviews the diff before any other task runs. If the new voice
misses, we recalibrate before sweeping the rest.

**Value delivered:** the worst-offender file reads as plain professional
prose, and we've locked in the voice for the rest of the sweep.

## Related Files
- `skills/error-and-correctness-traps/SKILL.md`

## Dependencies
- None (first task)

## Acceptance Criteria

- [x] **Agent-first cuts** (see `main.md` cross-cutting concerns): removed 5 subsection lead-in one-liners, trimmed atmospheric Overview opener, removed duplicate navigation, reframed item 3 ("don't rely on magic") as an action an agent can take ("surface in your summary to the user before shipping")
- [x] **Precedence cleanup** (see `main.md`): deleted the entire Precedence section. Both remaining bullets (`before-you-refactor` ordering, `pre-commit-self-review` at end) were already implied by `using-97`'s trigger map + rule 3, so they added nothing for an agent that has the skill loaded.
- [x] `trap-scan` removed (replaced with "checklist of common bugs grouped by domain" once in Overview; section header → "Checks by domain")
- [x] `the trap closes` removed (deleted; replaced with "before you commit")
- [x] `invisible until it bites` cut and rewritten as "easy to miss until production hits it"
- [x] `mid-trap` removed; replaced "you are not done — you are mid-trap" with "you are not done. Either finish, or revert and re-plan."
- [x] `wearing a real-numbers costume` → "a finite, unevenly-spaced approximation of the real numbers"; `wearing a class` → "inside a class"
- [x] Rule-of-four `-ing` opening cut to three short examples in separate sentences
- [x] Bare `trap` decorative uses (`Concrete trap:` ×5, `for every trap domain`, `trap domains`) replaced with `Example:` / `domain` / `these domains`
- [x] `Fires hardest` / `Fires lightly` rewritten as "These checks matter most when ... in MVPs ... prefer the simplest thing"
- [x] `self-DDoS` (line 74) and `kick a downed service harder` (Red Flag) replaced with plain phrasing
- [x] `OOMs in slow motion` (×2) replaced with "eventually exhausts memory" / "exhaust memory under sustained load"
- [x] `Calibration applies` line plainly rewritten
- [x] `hand-off` in precedence section → "before you ship"
- [x] No new coinages introduced
- [x] `npm test` passes
- [x] No cross-skill references to removed phrases broken (skill name unchanged; `trap-scan` references in `security`/`observability`/`using-97` are scoped to tasks 3, 4, 12)

## Verification

- `rg 'trap-scan|the trap closes|invisible until it bites|mid-trap|wearing a (?:costume|class)' skills/error-and-correctness-traps/SKILL.md` returns 0 hits
- `npm test` exits 0
- User confirms the new voice before task 2 starts

## Notes

This is the calibration file. Diff is reviewed by the user. Don't proceed to task 2 until sign-off.
