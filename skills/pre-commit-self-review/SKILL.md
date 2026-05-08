---
name: pre-commit-self-review
description: Use when about to commit, finish a task, open a PR, summarize work for the user, or when the user asks for a review or summary — NOT just on autonomous commits, which are rare in OpenCode usage
---

# Pre-Commit Self-Review

## Overview

Before claiming a task is complete, pause and read what you wrote as a stranger would. **Most defects you would catch in your own code are still in your own code because you never looked.** Draws on nine contributors to *97 Things Every Programmer Should Know* (CC-BY-3.0; see `principles.md` for citations and links).

This is a **rigid** skill. Run the checklist in order. If you can't satisfy a step, fix it or call it out in your summary to the user.

## When to invoke

Invoke when you're about to:

- Run `git commit` (autonomous or otherwise)
- Tell your human partner "I'm done" or "ready for review"
- Open or update a pull request
- Summarize a chunk of work, hand off to another agent, or close out a task
- Be asked by your human partner to review, sanity-check, or hand off the change

In OpenCode and similar agent harnesses, commits are usually initiated by the user, not the agent. The trigger is therefore **the moment of completion**, not specifically the moment of `git commit` — whichever comes first.

### Non-triggers — do NOT invoke for

- Mid-implementation edits: this skill fires at the end of a unit of work, not in the middle of one
- Single-line fixes — typo, comment, formatter-only change — where there is no review surface
- Exploratory or read-only tasks (reading code, answering a question, writing a summary with no code change)
- Routine save points during a long task where you are not yet claiming completion
- Reverts and mechanical undo operations

If the change is small but introduces real logic, **invoke anyway** — the checklist is short.

## Self-review checklist

Run every step before you commit, hand off, or claim completion.

1. **Re-read the diff as a stranger, and scan ±20 lines around every hunk for unsafe code.** Open the diff fresh and read it top to bottom without context. If a section needs you to remember what you were thinking yesterday to make sense of it, the next reader will not have that memory — rename, comment, or restructure until the diff explains itself. Then, in the same pass, read the **20 lines above and below each hunk** in every touched file and look for these six unsafe patterns in the surrounding code, whether or not your change introduced them:
   - **Hardcoded credentials.** String literals that look like API keys, OAuth client secrets, database passwords, JWT signing secrets, bearer tokens, private keys (`-----BEGIN`), or connection strings with embedded passwords — assigned to a variable, passed as an argument, or written into a config file.
   - **String-built SQL, LDAP, or shell commands.** F-strings, `+` concatenation, or `.format()` building a query/command string with interpolated values; `subprocess.run(..., shell=True)` with non-constant input.
   - **Unsafe deserialization on untrusted input.** `pickle.loads`, `yaml.load` without `SafeLoader`, `marshal.loads`, Java `ObjectInputStream`, PHP `unserialize`, .NET `BinaryFormatter` against data that crosses a trust boundary.
   - **Swallowed exceptions.** Broad `except:` / `except Exception:` / `catch (Throwable)` blocks with `pass`, an empty body, or a comment-only body — the call site silently absorbs failures the caller cannot see.
   - **TOCTOU patterns.** Check-then-use against the same path or resource (`if os.path.exists(p): open(p)`, `if user.has_permission(x): do(x)`) where the state can change between check and use.
   - **Mutable default arguments.** `def f(x=[])`, `def f(x={})`, `def f(x=set())` — the default is shared across calls and accumulates state.

   **Test fixtures, mocks, and example values inside `tests/`, `test_*.py`, `*.spec.*`, `fixtures/`, or files with names containing `mock`, `fake`, or `stub` are intentional test data, not unsafe code.** Skip them.

   When you find one of these in the surrounding code (not in your diff), **surface it in your summary to the user — do not silently rewrite the file outside the scope you were asked to change.** Add an `Adjacent issues` line to your summary naming the file, line, and pattern (e.g. `Adjacent issues: src/billing/charge.py:142 — string-built SQL with f-string interpolation`). If you find none, say so explicitly: `Adjacent issues: none found in ±20 lines of touched hunks.` The named artifact is the verification — agents that skipped the scan have nothing to write on this line. *(Rising, 97/58.)*
2. **Suspect your own code first.** Before you blame the framework, the library, or the flaky test, assume the bug is yours. It almost always is. Walk the code path with the failing input in mind; confirm assumptions about types, ordering, null cases, and shared state. Reach for "compiler bug" only after you have ruled out yours. *(Kelly, 97/9.)*
3. **Know what your next commit is.** State, in one sentence, what this commit does. If the sentence contains "and also" or "various", the commit is two commits. Split it. If you cannot name a clear, bounded change, you are committing speculation — throw the speculative parts away and re-scope. *(Bergh Johnsson, 97/47.)*
4. **Check for deliberate technical debt.** Did you take a shortcut to ship? Name it. File a follow-up note (issue, todo, line in your summary) so the debt is visible. Untracked debt accrues silent interest. *(Rose, 97/1.)*
5. **Clean the build before you leave it.** New compiler warnings, lint errors, or deprecation notices introduced by this change get fixed now, not later. A noisy build hides the warning that actually matters. *(Brodwall, 97/42.)*
6. **Audit the logs you added.** Every new log line: is its level right? Will it fire once per significant event, or per inner-loop iteration? Would you want to be paged for an ERROR-level message you wrote? If not, downgrade it. *(Brodwall, 97/90.)*
7. **Re-read the comments.** Header comments should let the next reader use the code without reading the body. Inline comments should explain *why*, not narrate *what*. Delete comments that have drifted from the code. Never paste anything into a comment you would not want quoted back in a meeting. *(Evans, 97/16.)*
8. **Step away if you're stuck on a smell.** If something feels off but you can't say why, stop typing. Walk, switch tasks, sleep on it. The creative side surfaces the problem once the logical side stops talking. Do not commit a change you are uneasy about because you are tired. *(Hufnagel, 97/69.)*
9. **Frame your summary as a review, not a defense.** When you summarize for the user, mention the trade-offs, the parts you are least sure about, and any debt you incurred. Reviews exist for knowledge sharing, not for catching you out — invite scrutiny rather than deflect it. *(Karlsson, 97/14.)*

## Red Flags

These thoughts mean STOP — do not commit yet:

| Thought | Reality |
|---|---|
| "It works on my machine — shipping it." | "Works" is the verification gate, not the review gate. Re-read the diff as a stranger before claiming done. (97/58) |
| "I'll skip the ±20 line scan — my diff doesn't touch security code." | The point of the scan is to find unsafe code you didn't author. Hardcoded credentials, string-built SQL, and unsafe deserialization in code adjacent to your edit will ship under your name if you don't surface them. The `Adjacent issues:` line is mandatory; "none found" is a valid value, "I didn't look" is not. (97/58) |
| "Must be a bug in the library." | Mature libraries used by many people are usually fine. Suspect your code first; reach for "library bug" only after ruling yours out. (97/9) |
| "I'll squash this giant commit and figure out the message later." | If you can't state the commit in one sentence now, the commit is speculation. Split it or throw the speculative parts away. (97/47) |
| "I took a shortcut, I'll come back and fix it." | The promise is sincere and rarely kept. Track the debt explicitly — issue, todo, summary note — or pay it now. (97/1) |
| "There are a few new warnings, but the build still passes." | Today's ignored warning hides tomorrow's real one. Fix warnings as they appear, not in a future cleanup pass. (97/42) |
| "More logging is safer." | A log flooded with INFO drowns the ERROR that wakes you at 3am. Audit log levels before committing. (97/90) |
| "The code is obvious, no comments needed." | Obvious to you today is opaque to the next reader. Header comment for *how to use*, inline comment for *why*. (97/16) |
| "I'm tired but let me push this through." | Tired commits are the ones you regret. Step away; the answer is usually obvious after a break. (97/69) |
| "I'll just downplay the messy parts in the summary." | The summary is for knowledge sharing, not self-defense. Name the trade-offs and the parts you're unsure about. (97/14) |

## What "done" looks like

You are done when **all** of the following are true:

- [ ] You ruled out your own code as the source of any unresolved oddness before blaming external systems.
- [ ] The diff was re-read top-to-bottom as a stranger, and the ±20 lines around every hunk were scanned for the six unsafe patterns (hardcoded credentials, string-built SQL/shell, unsafe deserialization, swallowed exceptions, TOCTOU, mutable default).
- [ ] The summary contains an `Adjacent issues:` line — either naming surfaced issues (file, line, pattern) or stating `none found` after an actual scan.
- [ ] The commit (or summary) can be described in one sentence with no "and also."
- [ ] Any shortcut taken is named in a tracked follow-up.
- [ ] Build is clean — no new warnings, lint errors, or deprecation notices introduced.
- [ ] New log lines have correct levels and reasonable volume.
- [ ] The summary names trade-offs and uncertainties rather than hiding them.

If any box is unchecked, you are not done. Either finish the review, or hand back with the gaps named explicitly.

## Principles in this skill

| # | Principle | Author |
|---|---|---|
| 97/1 | Act with Prudence | Seb Rose |
| 97/9 | Check Your Code First Before Looking to Blame Others | Allan Kelly |
| 97/14 | Code Reviews | Mattias Karlsson |
| 97/16 | A Comment on Comments | Cal Evans |
| 97/42 | Keep the Build Clean | Johannes Brodwall |
| 97/47 | Know Your Next Commit | Dan Bergh Johnsson |
| 97/58 | A Message to the Future | Linda Rising |
| 97/69 | Put the Mouse Down and Step Away from the Keyboard | Burk Hufnagel |
| 97/90 | Verbose Logging Will Disturb Your Sleep | Johannes Brodwall |

See `principles.md` for the long-form distillations, citations, and source links.
