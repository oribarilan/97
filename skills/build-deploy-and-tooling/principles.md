# build-deploy-and-tooling — principles

Long-form per-principle distillations. The summary in `SKILL.md` is what the
agent loads on trigger; this file is the on-demand reference for when a
deeper cut is needed on a specific principle.

All eleven principles come from *97 Things Every Programmer Should Know*
(O'Reilly, ed. Kevlin Henney, 2010). Originals are CC-BY-3.0 at the canonical
mirror: https://github.com/97-things/97-things-every-programmer-should-know.

Distillations below are original commentary in our own words. No verbatim
quotes longer than ~25 words. If a contributor objects to a particular
distillation, file an issue and the file will be revised or removed.

---

## #4 — Automate Your Coding Standard

**Author:** Filip van Laenen
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_04/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None — chapter present on the mirror, complete, attributed.

**Distillation.** The lifecycle of an unenforced coding standard is
predictable: kickoff agreement, gradual neglect, post-mortem disappointment.
Hand-following style rules is boring, deadline pressure compresses the
"polish" phase, and the standard erodes one rule at a time. The fix is to
take the rules a machine can check and let the machine check them on every
commit: formatting, import order, banned APIs, complexity ceilings,
test-coverage floors, project-specific anti-patterns. Break the build on
violations, because a warning nobody must address is a warning nobody will.
The rules a machine cannot check — naming intent, comment quality,
architectural taste — are guidelines, and the team should expect them to
drift more than the automated rules do. The standard itself should evolve
as the project learns, not be frozen at kickoff.

**Agent application.** Source for checklist step 8 ("automate the coding
standard") and the "I'll just hand-format this once" Red Flag. Pairs with
#79 (analysis tools as the *technical* mechanism for many of the rules van
Laenen wants enforced).

---

## #10 — Choose Your Tools with Care

**Author:** Giovanni Asproni
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_10/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** Modern applications are assemblages of components,
libraries, and frameworks; the assembly choice has long-tail consequences
the initial decision rarely accounts for. Asproni names six recurring
costs. Architectural mismatch — tools assume different control, data, or
threading models, and the gaps are bridged with hacks. Lifecycle skew —
tool A's required upgrade breaks tool B, and the more tools, the worse it
gets. Configuration sprawl — XML or YAML grows until the application is
config with a thin code shell. Vendor lock-in — performance, evolution, and
cost are pinned to a third party's roadmap. "Free" software with paid
support tiers — the unit cost is zero until support is needed, then it is
not. License compatibility — viral terms (GPL family) are unacceptable in
some contexts. The author's working strategy: start with the smallest tool
set that meets the requirement, isolate every external tool behind an
internal interface so substitution is bounded-cost, and add more only when
forced. The result tends to be smaller systems built from fewer tools than
the initial estimate forecast.

**Agent application.** Source for checklist step 5 ("respect the project's
existing tool conventions before recommending a new one") and the Red Flags
about parallel tool adoption and "open source is free." The skill leans
particularly hard on Asproni's isolation guidance: every external tool gets
an interface so the next person can swap it.

---

## #20 — Deploy Early and Often

**Author:** Steve Berczuk
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_20/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** Deployment delegated to a release engineer at the end of
the project is the source of two compounding problems. The team gets no
practice with the deploy process, so the first real deployment surfaces
every assumption the code makes about a developer's laptop at the worst
possible moment. And the deploy process itself never gets to evolve under
the same iterative pressure as the code, so it stays brittle. Berczuk's
inversion: deploy from week one, before the application does anything
worth deploying. The first deployment matures the pipeline; subsequent
deployments to a clean environment expose code-level assumptions that
bind to the dev environment; and code can be refactored to simplify the
deploy. "Being able to deploy" looks like low business value early, but
nothing else delivers business value until that is true.

**Agent application.** Source for checklist step 4 ("deploy from week one")
and the "deploy is trivial, we'll wire it up at the end" Red Flag. Pairs
with #61 — Berczuk gives the cadence (early, often), Freeman gives the
artifact discipline (one image, promoted).

---

## #38 — How to Use a Bug Tracker

**Author:** Matt Doar
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_38/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** A bug report is a conversation with a permanent record;
how you write and triage it shapes how the team treats defects. A useful
report carries three pieces: how to reproduce (steps, frequency); what
should have happened, in the reporter's view; what actually happened, with
as much supporting detail as exists. "This sucks" tells the assignee the
reporter had a bad experience and nothing else. Status changes are public
positions on the defect; "closed" without a reason invites a re-open war.
Field discipline matters too — overloading the subject line with personal
priority tags ("VITAL:") is a sign that the tracker is missing a real
field. Make the standard query for "open bugs in this area" a one-click
link every contributor knows. A bug is not a unit of work, any more than a
line of code is a unit of effort.

**Agent application.** Source for checklist step 7 ("set up the bug tracker
so reports are conversations"). The skill applies Doar's three-part report
structure as the issue-template requirement and his "discoverable standard
query" as a setup obligation.

---

## #40 — Install Me

**Author:** Marcus Baker
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_40/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** Baker writes from the user's point of view: the user does
not care about your project, runs a continuous cost-benefit on every
interaction, and abandons the moment friction outweighs perceived value.
Install is the first interaction. The downloads folder is full of archives
that were unpacked once and never used. Detect what the environment makes
detectable — platform, architecture, locale — and ask only what cannot be
detected. Tell the user where files are written; users want to keep their
machine tidy and want to be able to remove the software if they sour on
it, and the suspicion that removal is impossible blocks installation in
the first place. For GUI apps, prefer simple action with immediate result
over wizards that demand project setup before showing anything. For
libraries and CLIs, ship a five-line "Hello, world" that produces exactly
the output the documentation promises — no XML scaffold, no template
generation, no boilerplate to ignore. Users who reach success in five
minutes write thank-you emails, file good bug reports, and tell others.

**Agent application.** Source for checklist step 6 ("treat the installer as
the user's first impression") and the "README is enough" Red Flag. The
"five-line Hello, world" rule reappears in the "done" checklist as a hard
requirement for any new install/library/CLI surface.

---

## #61 — One Binary

**Author:** Steve Freeman
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_61/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** Freeman wrote in 2010 about per-environment binaries
generated by build-time code rewriting; the principle generalizes cleanly
to today's container-image and bundle pipelines. The deployable artifact
should be built exactly once, from a tagged commit, and the *same bytes*
should be promoted through dev, staging, and prod. Environment-specific
values — endpoints, secrets, feature flags, log levels — belong in the
environment that loads the artifact: container env vars, mounted config
files, an external configuration service. Per-environment builds destroy
the chain of evidence: when the bytes that ran in staging are not the bytes
that run in prod, "staging tested it" is no longer a true statement.
Sysadmins who rebuild from source on the prod box reintroduce the same
problem. Two narrow exceptions are honest: significantly different
resource constraints across targets (rare for typical request/response
applications) and a legacy build too tangled to fix in this iteration
(move incrementally). Version environment configuration separately from
code, since the two change at different rates and for different reasons.

**Agent application.** Source for checklist step 3 ("build one immutable
artifact and promote that") and the deploy-side application in step 4. The
"bake the staging URL into the image" and "rebuild from source on prod"
Red Flags both come from here. The modernization (binary → container image)
is the skill's editorial framing, not a claim about Freeman's original text.

---

## #63 — Own (and Refactor) the Build

**Author:** Steve Berczuk
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_63/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** Disciplined teams that demand clean code and tested
behavior often leave the build script in a corner — dismissed as plumbing,
or feared as the property of a release-engineering "cult." Berczuk argues
both reactions are wrong on the same evidence. The build defines the
component architecture, decides what artifact ships, and gates every
change; an unmaintainable build script causes outages on the same scale as
unmaintainable code. The justifications for the neglect are weak: the
build script is in a different language (programmers learn languages all
the time), or the build "isn't really code" (it produces the only thing
users actually run). The historical analogy is testing — once seen as
QA's problem, now understood as developer-owned. The build belongs on the
same arc. A build that takes a new contributor a day to get green is a
defect; refactor it. Easy build means fast onboarding; automated config
means consistent results across machines; the build's own reports are an
early code-quality signal.

**Agent application.** Source for checklist step 2 ("the dev team owns the
build as code, and refactors it") and the "release-engineering thing" Red
Flag. The "build is part of the codebase" framing in the Overview also
comes from here.

---

## #68 — Put Everything Under Version Control

**Author:** Diomidis Spinellis
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_68/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** The historical reasons not to put a particular file in
version control — disk cost, server cost, network bandwidth, tooling
friction — no longer apply. Free, capable VCS (git, hg, svn) and free
hosting make the marginal cost of versioning anything close to zero, and
the marginal benefit close to large. The two operations a contributor
needs are commit and update; the benefits include traceable history,
attribution, named versions, fearless changes (no commented-out "just in
case" blocks), tagged releases, and parallel branches. The integration
guarantee is what makes teamwork work: independent contributors merge
their work, conflicts are surfaced rather than hidden, and notification
hooks give the team a shared sense of progress. Spinellis's three
operating rules: one logical change per commit (so revert and bisect
work), every commit carries a message explaining the change (at minimum
*what*, ideally also *why*), and never commit code that breaks the build.
Include source, docs, scripts, fixtures, libraries, artwork — everything
the project needs to set up on a fresh machine.

**Agent application.** Source for checklist step 1 ("put everything in
version control before anything else") and the "`fix bug` is a fine commit
message" Red Flag. The "single clone plus bootstrap script" onboarding
target in the Overview comes from Spinellis's "set up on a new machine
equals one checkout" framing.

---

## #78 — Step Back and Automate, Automate, Automate

**Author:** Cay Horstmann
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_78/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** Horstmann opens with two field reports: a programmer
pasting source files into Word weekly to get a line count, and a
deployment so cumbersome that a team automated it during final testing and
then ran the script hundreds of times in the same week. The contrast is
the entire argument — the second team noticed the repetition and stopped
to script it; the first did not. Five misconceptions block automation.
"It's only for testing" — no, also for build, package, deploy, doc
generation, reporting. "I have an IDE" — the IDE has thousands of
settings nobody can guarantee match across teammates, and the IDE does
not run in CI. "I need exotic tools" — a competent shell plus a build
system covers most cases; web automation has its own well-understood
toolset. "The file format is hostile" — small tweaks toward plain text
often unlock big tediousness reductions. "I don't have time" — learn
just enough to script the one task, do it early in the project when slack
is easier to find, and the demonstrated win earns buy-in for more.

**Agent application.** Source for checklist step 11 ("step back when you
notice yourself doing the same manual sequence twice") and the "third
time will be just as fast" Red Flag. The "IDE-only or laptop-only workflow
does not survive CI" framing comes directly from Horstmann's IDE
misconception.

---

## #79 — Take Advantage of Code Analysis Tools

**Author:** Sarah Mount
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_79/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** Testing finds the bugs the tests imagined. Static
analysis finds the bug class the tests forgot — null dereferences, dead
branches, possible races, unused returns, suspicious type coercions. The
historical bad reputation of static analysis (false positives, stylistic
nitpicking) reflects early tools running on tight memory budgets; modern
analyzers are configurable, IDE-integrated, and tunable for the project's
signal/noise tolerance. Mount points at language-specific examples
(Splint for C, Pylint for Python, with inline annotations and per-warning
configuration) and at the AST and bytecode introspection facilities most
languages now expose in their standard library — when nothing
off-the-shelf catches the project's specific anti-pattern, a small custom
checker is in reach. The summary recommendation: do not let the test
suite be the only quality gate; run analysis as a first-class check, and
write your own when the catalog does not cover what you need.

**Agent application.** Source for checklist step 9 ("run static analysis as
a first-class quality gate") and the "we have tests, so we don't need
static analysis" Red Flag. Pairs with #4 — Mount supplies the *mechanism*
for many of the rules van Laenen wants enforced.

---

## #88 — The Unix Tools Are Your Friends

**Author:** Diomidis Spinellis
**Source (primary):** https://github.com/97-things/97-things-every-programmer-should-know/blob/master/en/thing_88/README.md
**Source (reading aid):** n/a (no Medium link in TOC)
**Source used:** GitHub mirror (CC-BY-3.0).
**Access date:** 2026-05-04
**Gaps:** None.

**Distillation.** Spinellis would pick the Unix toolchest over an IDE if
forced to choose. Seven reasons stack up. IDEs are language-bound; Unix
tools work on any textual format, so the investment pays out across every
language a programmer will touch. IDEs offer the commands their authors
imagined; Unix tools are composable Lego blocks for the task you are
imagining now (Cunningham's signature analysis as a five-line shell loop
is the canonical example). IDE skill is task-specific; shell skill makes
you faster at any task. The tools were designed for 128KB machines, so
modern data sizes are unremarkable — `grep '<revision>' | wc -l` counts
revisions on a Wikipedia dump without effort. Pipelines distribute work
across CPU cores naturally. The toolchest is small and ubiquitous —
BusyBox on a set-top box, Cygwin on Windows, the system shell everywhere
else. And extension is easy: a program in any language that reads stdin
lines and writes stdout lines joins the chest as a peer.

**Agent application.** Source for checklist step 10 ("reach for the Unix
toolchest before reaching for a custom script") and the "I'll write a
Python script for this one-line text munge" Red Flag. The skill applies
Spinellis's argument as a *first-reach* heuristic, not a prohibition on
larger tools when they are warranted.
