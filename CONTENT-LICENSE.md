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
