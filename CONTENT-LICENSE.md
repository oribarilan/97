# Content licensing & attribution

This repository mixes two kinds of material under different terms.

## Plugin code — MIT

The loader, scripts, `package.json`, and `skills/using-97/SKILL.md` are
plugin code, licensed under MIT. See [`LICENSE`](./LICENSE).

## Skill content — original commentary, attributed

The themed skills under `skills/` distill **selected principles discussed in**
*97 Things Every Programmer Should Know* (O'Reilly, ed. Kevlin Henney, 2010).
This plugin curates and reorganizes a subset of those principles around its
own trigger taxonomy; it does not reproduce the book or its editorial
selection. The book's essays are published by their contributors under
**CC-BY-3.0** at:

> https://github.com/97-things/97-things-every-programmer-should-know

For each principle we include:

- **Original commentary in our own words**, written as instructions for a
  coding agent. No verbatim quotes longer than ~25 words; distinctive
  phrasings are paraphrased. Generic principle names ("DRY", "Boy Scout
  Rule") may appear as headers.
- **Attribution** to the original essay author, with a link to their
  chapter on the CC-BY-3.0 mirror above, in each skill's `principles.md`.

This commentary is original work, offered under MIT alongside the code.
The source essays remain CC-BY-3.0 and are credited to their authors.

## Principle IDs

Every principle in this bundle has a stable string ID of the form
`<source-key>/<principle-key>` (e.g. `97/74`, `Fowler/LongMethod`).
The full registry of accepted source keys and the format spec live in
`CITATION-SCHEME.md`. Citation of *97 Things* essays remains by author
and essay number (`97/N`); citation of other sources is by author,
book, and chapter as documented in each skill's `principles.md`.

## Beyond *97 Things* — fair-use commentary on canonical sources

Some skills draw on canonical programming-practice sources outside the
*97 Things* essay set. Distillations are written in our own words and
function as commentary; we cite each source by author + book +
chapter, do not reproduce source text, and use only standard
descriptive labels (smell names, pattern names, factor numbers) where
those labels are the source's vocabulary for the concept.

- `before-you-refactor` cites Martin Fowler, *Refactoring* (2nd ed.,
  Addison-Wesley, 2018), ch. 3 — for the Long Method, Feature Envy,
  Shotgun Surgery, and Data Clumps smells.
- `domain-modeling` cites Scott Wlaschin, *Domain Modeling Made
  Functional* (Pragmatic Bookshelf, 2018), ch. 6 — for the
  make-invalid-states-unrepresentable, smart-constructors, and
  types-for-effects principles. Also cites Fowler, *Refactoring*,
  ch. 3, for the canonical Primitive Obsession entry (the smell is
  cross-referenced from `before-you-refactor`).
- `build-deploy-and-tooling` cites the Twelve-Factor App (Adam
  Wiggins / Heroku, 2011, 12factor.net) — for factors III (config),
  V (build/release/run), VI (processes, paired with VIII concurrency),
  and XI (logs). Also cites Jez Humble & David Farley, *Continuous
  Delivery* (Addison-Wesley, 2010), ch. 5, for pipeline-as-code.
- `error-and-correctness-traps` cites Michael Nygard, *Release It!*
  (2nd ed., Pragmatic Bookshelf, 2018), ch. 5 — for the timeout,
  circuit-breaker, bulkhead, backpressure / bounded-queues, and
  fail-fast stability patterns.
- `api-and-interface-design` cites John Ousterhout, *A Philosophy of
  Software Design* (2nd ed., Yaknyam Press, 2021), chapters 4 and 10
  — for deep modules and define-errors-out-of-existence. Also cites
  Barbara Liskov, "Data Abstraction and Hierarchy" (CACM, 1987), for
  the substitution principle, and Alexis King, "Parse, don't
  validate" (lexi-lambda.github.io, 2019). Hyrum's Law
  (hyrumslaw.com) is referenced in a Red Flag without a principle row.
- `testing-discipline` cites Steve Freeman & Nat Pryce, *Growing
  Object-Oriented Software, Guided by Tests* (Addison-Wesley, 2009),
  ch. 20 — for "listen to test pain." Also cites Gerard Meszaros,
  *xUnit Test Patterns* (Addison-Wesley, 2007), chapters 16 and 18,
  for the obscure-test, fragile-test, mystery-guest, and
  conditional-test-logic smells.

## `observability` — predominantly original

The `observability` skill is the project's second skill drawn from
sources outside *97 Things*. The book has no direct coverage of structured
logging, distributed tracing, or metrics cardinality. Distillations
draw on Google's *Site Reliability Engineering* (O'Reilly, 2016,
ch. 6 — golden signals); the OpenTelemetry semantic conventions
(opentelemetry.io, Apache-2.0 / CC-BY-4.0); and *Observability
Engineering* (Charity Majors, Liz Fong-Jones, George Miranda, O'Reilly,
2022 — cardinality discipline). The MIT plugin code license applies
to the original text; no source text is reproduced. See
`skills/observability/principles.md` for per-principle citations.

## `security-and-trust-boundaries` — predominantly original

The `security-and-trust-boundaries` skill is the project's one acknowledged
"97-inspired plus extension." The book has thin direct coverage of modern
security practice. Two book principles generalize cleanly to
trust-boundary discipline and are surfaced in the skill's `SKILL.md`
as Red Flags and cross-references; their canonical entries live in
`error-and-correctness-traps/principles.md` per the ID-uniqueness rule
in `CITATION-SCHEME.md`:

- **`97/26`** ("Don't Ignore That Error!", Pete Goodliffe) — generalized to
  "don't ignore the trust boundary."
- **`97/29`** ("Don't Rely on 'Magic Happens Here'", Alan Griffiths) —
  generalized to "don't rely on a security control no one on the team
  understands."

The remaining trap domains in that skill — injection, untrusted-input
boundaries, secrets handling, crypto misuse, authentication and
authorization — are original commentary written for this plugin. They
draw on standard industry references (OWASP Top 10, language vendor
security guides, CWE catalog) and on agent-specific failure modes
observed in production code review. The MIT plugin code license applies
to the original parts; CC-BY-3.0 attribution covers the two cited book
principles.

## Unofficial, and easy to take down

This plugin is an **unofficial companion**. It is not affiliated with,
endorsed by, or sponsored by O'Reilly Media, Kevlin Henney, or any
contributor to the book.

If you are a contributor or rightsholder and want a distillation removed
or changed, **open an issue and it will be done, no argument**.
