# pre-commit-self-review — principles

Long-form per-principle distillations. The summary in `SKILL.md` is what the
agent loads on trigger; this file is the on-demand reference for when a
deeper cut is needed on a specific principle.

All nine principles come from *97 Things Every Programmer Should Know*
(O'Reilly, ed. Kevlin Henney, 2010). Originals are CC-BY-3.0 at the canonical
mirror: https://github.com/97-things/97-things-every-programmer-should-know.

Distillations below are original commentary in our own words. No verbatim
quotes longer than ~25 words. If a contributor objects to a particular
distillation, file an issue and the file will be revised or removed.

A note on attribution: the canonical CC-BY mirror credits 97/1 to Seb Rose.
Some secondary walkthroughs (e.g. Medium reposts) credit Edward Garson; the
mirror is the source of truth for this project. 97/69 appears on the mirror
under the byline "BurkHufnagel"; we use "Burk Hufnagel" with a space for
readability.

---

## 97/1 — Act with Prudence

**Author:** Seb Rose
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_01/README.md
**License:** CC-BY-3.0

**Distillation.** Schedule pressure pushes the choice from "do it right" to
"do it quick," with the silent promise to come back and fix it later. The
promise is sincere, but the next iteration has its own pressures and the
fix usually doesn't happen. Martin Fowler's taxonomy calls this *deliberate*
technical debt — distinct from *inadvertent* debt that comes from not yet
knowing better. Either way, debt behaves like a loan: a short-term gain
against ongoing interest, where the interest takes the form of harder
features, riskier refactors, and brittle tests. Layered debt compounds —
by the time you must address the original shortcut, several other not-quite-
right choices sit on top of it. The discipline isn't "never take debt" —
sometimes you ship — but "make the debt visible." Write the card, log the
ticket, name the shortcut. Repaying next iteration is cheap; deferred
repayment accrues a cost that should be tracked so the team can see what
they actually owe.

**Agent application.** Source for checklist step 4 ("check for deliberate
technical debt") and the matching Red Flag ("I took a shortcut, I'll come
back and fix it"). The skill uses Rose's framing to insist that any
shortcut taken during the work be named in a tracked follow-up before the
hand-off, not held in the agent's head where the human partner can't see it.

---

## 97/9 — Check Your Code First Before Looking to Blame Others

**Author:** Allan Kelly
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_09/README.md
**License:** CC-BY-3.0

**Distillation.** Programmers find it hard to accept that their own code is
the broken thing. Compiler, OS, and library bugs do exist, but mature tools
used by many people are usually fine — and the cost of an hour spent
blaming a healthy library is an hour not spent debugging the actual fault.
The remedy is plain debugging discipline: isolate the failing path, stub
external calls, surround the suspect code with tests, check calling
conventions and library versions, explain the problem out loud to someone
else, and watch for the classics — stack corruption, type mismatches,
multi-threaded races. When someone reports a bug you can't reproduce, go
watch them; they are often doing the steps in a different order. A useful
heuristic: if you're convinced the compiler is wrong and adding trace
statements moves the bug, suspect stack corruption. Sherlock Holmes's
"eliminate the impossible" beats Dirk Gently's "eliminate the improbable" —
look at the likely causes first.

**Agent application.** Source for checklist step 2 ("suspect your own code
first") and the "Must be a bug in the library" Red Flag. Self-review is the
moment to catch the framing where the agent has already concluded the
problem is external; the skill forces a return to the local code first.

---

## 97/14 — Code Reviews

**Author:** Mattias Karlsson
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_14/README.md
**License:** CC-BY-3.0

**Distillation.** Code reviews raise quality, but not for the reason most
people assume. The chief value isn't catching errors — it's spreading
knowledge of the code and its conventions across the team. The pattern
many programmers dislike (one architect reviews everything, parole-board
style) is the wrong shape: it makes the architect a bottleneck and turns
the review into a verdict. Better tactics: a team member walks the code
through with the rest of the team; reviewers approach the code trying to
learn it rather than to find fault; comments are constructive and not
caustic; reviewers take roles (one reads docs, one reads error handling,
one reads the main flow) so the work spreads and seniority matters less.
Coding conventions get checked by tools, so formatting never comes up in
review. Newbies bring fresh eyes, experts spot familiar trouble — both
belong. Make it pleasant: bring food, drop the sarcasm.

**Agent application.** Source for checklist step 9 ("frame the hand-off as
a review, not a defense") and the matching Red Flag. The skill carries
Karlsson's reframing — review is for knowledge sharing, not gotcha-catching
— into the agent's hand-off summary, where the agent should name trade-offs
and uncertainties rather than minimize them.

---

## 97/16 — A Comment on Comments

**Author:** Cal Evans
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_16/README.md
**License:** CC-BY-3.0

**Distillation.** Evans tells a college story: a clean BASIC program,
recopied for legibility, came back with a near-failing grade and "No
comments?" written across the top. The lesson stuck. Comments aren't
evil — they belong in the toolkit alongside loops and branches. Modern
toolchains can extract API docs from formatted header comments, and that
matters because a header comment lets the next reader use the code without
reading the body. Inline comments do a different job: they explain what
the code is *supposed* to do, so the next reader can tell when the code
no longer does it. The old "if it was hard to write, it should be hard to
read" pose disserves clients, employers, colleagues, and the future-you
who will fix this in two years. Comments can also go too far — they should
clarify, not bury the code. And one cautionary tale: pasting a manager's
contentious email into a header comment as evidence is, as the next code
review revealed, a career-limiting move.

**Agent application.** Source for checklist step 7 ("re-read the comments")
and the "no comments needed" Red Flag. The skill applies Evans's split —
header comments for use, inline comments for intent — and adds the explicit
warning to never commit a comment you wouldn't want quoted back at you.

---

## 97/42 — Keep the Build Clean

**Author:** Johannes Brodwall
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_42/README.md
**License:** CC-BY-3.0

**Distillation.** Compiler warnings pile up the moment a team adopts
"I'll deal with that later." A build emitting hundreds of warnings hides
the one warning that actually points at a defect. The remedy is a zero-
tolerance policy applied as warnings appear, not in a future cleanup
sprint. If the warning is real, fix it. If the warning is technically
real but you "know" the case can't happen in production (a null-pointer
warning on a path you believe is unreachable), fix the cause anyway —
your knowledge is not in the build. If documentation references a removed
or renamed parameter, clean the doc. If a class of warning genuinely
doesn't apply (Java 5 generics warnings retroactively flagged on legacy
code), change the team's warning policy explicitly so the suppression is
visible. The win is mental: an always-clean build means you don't re-
decide for each warning whether it matters, and you don't leave a warning
swamp for the next person to wade through.

**Agent application.** Source for checklist step 5 ("clean the build before
you leave it") and the warnings Red Flag. The agent inherits Brodwall's
discipline: address each warning at the moment it appears in the diff,
rather than promising a future cleanup that won't happen.

---

## 97/47 — Know Your Next Commit

**Author:** Dan Bergh Johnsson
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_47/README.md
**License:** CC-BY-3.0

**Distillation.** Three programmers, asked what they're doing: "refactoring
these methods," "adding parameters to this web action," "working on this
user story." The third sounds the most strategic — until you ask each
of them when they will commit. The first two finish in about an hour
with a clear file scope. The third estimates "a few days, probably some
classes and changed services, somehow." The first two have decomposed the
work into a sequence of clear, achievable, committable steps; the third
is in speculative mode, programming hopefully toward a commit point
nobody has named. If the first two find the task takes more than two
hours, they throw away their changes, redefine smaller tasks, and
restart — keeping the insights, not the speculative code. The third just
keeps patching, can't bear to throw away "wasted" work, and eventually
commits aimless code. The heuristic: if you can't commit in roughly two
hours, you don't have a task — you have speculation. Throw the changes
away, define a real task with what you've learned. Speculative
experimentation is fine when it is explicitly that; the trouble is
sliding into it without noticing.

**Agent application.** Source for checklist step 3 ("know what your next
commit is") and the giant-commit Red Flag. The skill turns Bergh
Johnsson's heuristic into a self-review test: if the diff in front of
you can't be described in one sentence without "and also," it's two
commits or it's speculation, and either way it shouldn't ship as one.

---

## 97/58 — A Message to the Future

**Author:** Linda Rising
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_58/README.md
**License:** CC-BY-3.0

**Distillation.** Joe arrives at Rising's desk with a clever data-
structures hack and a grin: "Betcha can't guess what it does!" Rising
asks whether Joe's smart younger brother Phil could read it. "No way —
this is hard stuff." Then imagine, Rising says, that Phil is hired in
three years to maintain this code: what have you done for him? Every
line of code you write is a message to a future reader, who might be
your younger brother, or a teammate, or you in six months with no
memory of this week. The aspiration is the future reader saying "I can
see exactly what's been done here, and it's clear" — not "betcha can't
guess." Programmers slip into the assumption that because the problem
was hard, the code should look hard. The opposite is closer to true:
a hard problem deserves code that makes the solution look easy.

**Agent application.** Source for the standalone "A Message to the
Future" section that frames the WHY of self-review, and for checklist
step 1 ("re-read the diff as a stranger"). Rising's framing earns its
own header rather than a bullet because it carries the motivation for
the entire skill — the self-review checklist is the practice of writing
that future-message well.

---

## 97/69 — Put the Mouse Down and Step Away from the Keyboard

**Author:** Burk Hufnagel
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_69/README.md
**License:** CC-BY-3.0

**Distillation.** Hufnagel was stuck on a gnarly problem; on a coffee
break the answer became obvious. The mechanism: while the logical brain
is busy typing, the creative brain doesn't get airtime — it can't
surface a solution until the logical side takes a break. The example
he gives is a time-string validator that originally did three try /
parseInt / range-check blocks plus an AM/PM substring check. He cleaned
it up to half the size and made it more accurate (the original tested
only upper bounds). The next morning, while getting ready, the better
idea arrived: a single regex.
`time.matches("(0[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9] ([AP]M)")`. The
point isn't that one-liners always win — it's that until he stepped
away, his first attempt looked like the best one available. Once you
understand a problem, sketch it, walk, listen to music, do something
that engages the creative side.

**Agent application.** Source for checklist step 8 ("step away if you're
stuck on a smell") and the "I'm tired but let me push this through" Red
Flag. The agent equivalent of a coffee break is naming the unease
explicitly and pausing the commit, rather than shipping a change you
already feel uncertain about.

---

## 97/90 — Verbose Logging Will Disturb Your Sleep

**Author:** Johannes Brodwall
**Source:** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_90/README.md
**License:** CC-BY-3.0

**Distillation.** The first sign of trouble in a long-running system is a
dirty log. One user click producing a deluge of messages in the only log
the system has is as useless as no log at all — the messages that matter
drown in the noise. After development, somebody operates the system, and
that somebody might be you. If you'll be paged at 3am for whatever lands
in the error log, then anything in the error log has to genuinely warrant
waking you. During load testing, a clean error log is a first-pass signal
that the system is robust. Distributed systems make this harder —
external dependency failures may be normal and should be folded into the
logging policy rather than treated as exceptions. The routine indicator
that the system is healthy is INFO messages ticking by at roughly one per
significant application event. A cluttered log makes production hard to
control; a clean log makes a real signal obvious the moment it appears.

**Agent application.** Source for checklist step 6 ("audit the logs you
added") and the "more logging is safer" Red Flag. The skill applies
Brodwall's question — would you want to be paged for this message? — as
a per-line test the agent runs against any new log statements before the
commit lands.
