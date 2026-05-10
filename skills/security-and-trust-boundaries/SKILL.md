---
name: security-and-trust-boundaries
description: Use when writing or reviewing code that parses user input, builds SQL/shell commands, handles secrets/credentials, hashes passwords, changes auth checks, deserializes untrusted data, or constructs paths/URLs from input
---

# Security and Trust Boundaries

## Overview

Common security mistakes grouped by trust boundary: input concatenated into a query, a token logged "for debugging", an unguarded endpoint, `pickle.loads` on untrusted bytes. **When code crosses a trust boundary, stop and run the matching checks before you commit.**

This is a **rigid** skill. Jump to the sub-section that matches what you're writing and run that sub-section's checks.

These checks matter most when untrusted input is crossing into a system with real users — production endpoint, shared service, anything that touches user data, secrets, or auth state. In MVPs, prototypes, internal dev tools, and one-off scripts, prefer the simplest thing that works and re-invoke this skill before the code reaches users. **Three rules apply at every stage, even prototypes: no committed credentials in source, no string-built SQL or shell commands, no `pickle.loads` (or equivalent) on untrusted input. Surface these in your summary to the user even in throwaway code.**

The rules below describe properties of code that crosses a trust boundary, whether you authored that code or encountered it in a file you are touching. When you find an issue in pre-existing code adjacent to your edit, surface it in your summary to the user — don't silently rewrite the file outside the scope you were asked to change.

## When to invoke

Invoke when you're about to:

- Parse, validate, or transform input that originated outside your process
- Write or execute SQL, NoSQL, LDAP, OS command, shell command, or any other interpreted query/script string
- Handle secrets, tokens, credentials, API keys, certificates, or any session/auth material
- Hash a password, encrypt data, generate a token, or pick a random value used in a security context
- Add, remove, or change an authentication or authorization check, or expose a new endpoint
- Deserialize data (`pickle`, `yaml.load`, Java/PHP unserialize, XML with entities, JSON merge)
- Construct a file path or URL from user-controlled input
- Review or audit code that crosses trust boundaries

### Non-triggers — do NOT invoke for

- Renaming a local variable inside a function that happens to live in `auth/` or `crypto/`
- Adjusting a docstring or formatting in security-adjacent code
- A unit test that pins down already-agreed behavior on validated inputs
- Editing config files where the values are not secrets and the keys are not new auth toggles
- An early-stage MVP or prototype where the architecture is still in flux and no real user data is involved
- An internal dev tool, debugging endpoint, or one-off script
- Throwaway code expected to be replaced before reaching users

If the change touches one of these domains even slightly, **invoke anyway** — the per-domain check is short and the bugs are not.

## Precedence

- `97/correctness-traps` overlaps on input validation as error handling. **Rule:** trust-boundary crossings (untrusted input, secrets, auth, deserialization, code-execution surfaces) → this skill; non-security correctness (errors, floats, concurrency, IPC, perf, singletons) → that skill. When both clearly apply (e.g., parsing a config file from a possibly-malicious source), run this one first.

## Checks by domain

### Injection

1. **Parameterize, never concatenate.** SQL: use bound parameters (`cursor.execute("SELECT * FROM u WHERE id = ?", (uid,))`), not f-strings or `+`. NoSQL: use the driver's typed query API, not string-templated JSON. LDAP: escape per RFC 4515 with the driver's helper, not by hand. Command: pass an argv list, not a shell string. Example: `cursor.execute(f"SELECT * FROM users WHERE name = '{name}'")` is exploitable by any user setting their name to `' OR '1'='1`.
2. **`shell=False` is the default; `shell=True` is a vulnerability.** Use `subprocess.run(["git", "clone", url], shell=False)` (argv form), not `subprocess.run(f"git clone {url}", shell=True)`. The argv form passes arguments straight to the kernel; the shell form runs a shell first, which expands `$(...)`, backticks, `;`, `|`, `&&`, globs, and substitutions in attacker-controlled strings. If a shell genuinely is required (rare), every interpolated value must be passed through the language's shell-quoting helper (`shlex.quote`, etc.) — and you should re-justify why a shell is required.
3. **Template engines auto-escape; raw concatenation does not.** Building HTML, SQL, JSON, or any structured output by `+` or f-string puts the structure-vs-data decision on the developer. Use a template engine with auto-escaping on (Jinja2, ERB with safe defaults, parameterized JSON builders), or generate via the language's typed AST (LXML for XML, the JSON library for JSON). The legitimate exception is templating a known-constant string, never user input.

### Untrusted-input boundaries

4. **Path traversal: validate to a known root.** `open(os.path.join(BASE, user_filename))` is a vulnerability if `user_filename` can be `../../etc/passwd`. Resolve to a real path and verify the result starts with the intended root (`os.path.realpath(p).startswith(os.path.realpath(BASE) + os.sep)`). Reject `..`, absolute paths, null bytes, alternate path separators, and Windows device names (`CON`, `NUL`, `AUX`).
5. **SSRF: don't fetch arbitrary URLs from input.** Server-side `requests.get(user_url)` lets the attacker pivot into your VPC, hit metadata services (`169.254.169.254`), and read internal endpoints. If you must fetch user-supplied URLs, allowlist the scheme and host (or DNS-resolve and reject private/loopback/link-local ranges) and disable redirects (`allow_redirects=False`).
6. **Deserialization: only on trusted sources, only with a safe loader.** `pickle.loads`, `yaml.load` (without `SafeLoader`), `marshal.loads`, Java's `ObjectInputStream`, PHP's `unserialize`, .NET `BinaryFormatter` — all execute attacker-controlled code on untrusted input. Example: a Flask session cookie unpickled to read a user ID is full RCE. Use `pickle` only between processes you control, `yaml.safe_load` always, and prefer JSON for cross-trust data. XML parsers default to resolving external entities (XXE) — disable explicitly (`defusedxml`, `lxml` with `resolve_entities=False`).
7. **Validate at the boundary, then trust.** Once data is past the validator (typed, ranged, allowlisted, length-capped), downstream code can stop re-checking. Mixing partial trust through the codebase is how the missed check ships. The validator is the single line you can audit; without it, every line below is the audit surface.

### Secrets in transit, storage, and logs

8. **Logging secrets, tokens, PII, or auth headers is a leak.** A log line containing `Authorization: Bearer <token>`, a stack trace including a credentials object's `__repr__`, or an exception message containing the connection string ships to log aggregators, support tools, and screenshot inboxes. The pattern: any `log.*`, `print`, or `console.*` call whose arguments include a request object, a session object, an auth header, a password field, or a credentials object — even via interpolation. Example: `logger.error(f"login failed for {user}", extra={"request": request})` includes the request body, which had a password. Fix by masking in middleware (`Authorization → ***`, password fields → `***`) and overriding `__repr__` on security-relevant types to redact. When you find this in code adjacent to your edit, surface it in your summary to the user.
9. **Secrets in source files, version control, or built images are leaks the moment they land.** The pattern: any string literal that *looks* like a credential — API keys, OAuth client secrets, database passwords, JWT signing secrets, private keys (`-----BEGIN`), connection strings with embedded passwords, bearer tokens — assigned to a variable, passed as an argument, or written into a config file checked into git. Equally a problem: keys baked into Docker images, keys in built JS bundles, keys in CI logs. Fix by moving the value to the platform secret store (AWS Secrets Manager, Vault, Kubernetes Secrets, env vars injected at runtime) and referencing it by name. If a secret has already been committed, **rotate it before deleting the commit** — the git rewrite does not unleak public history. When you find a credential-shaped literal in code you're touching (or adjacent to it), surface it — this rule applies at any stage.
10. **Errors that leak internal state widen the attack surface.** Default exception handlers that return the stack trace, ORM error messages that include the SQL, or "user not found" vs "wrong password" messages that distinguish account existence — each gives the attacker a probe. Code shape: any handler that returns the raw exception, traceback, or framework-default error page to a non-internal caller. Return generic errors to clients; log details server-side.

### Crypto misuse

11. **General-purpose hashes for passwords are crackable at GPU speeds.** The pattern: any `md5`, `sha1`, `sha256`, `sha512` call whose input is a password or `salt + password` concatenation, used to derive a stored password verifier. Password verifiers require a deliberately-slow, memory-hard function: `bcrypt`, `scrypt`, `argon2id`, or PBKDF2 with a tuned cost. Example: `hashlib.sha256(password.encode()).hexdigest()` is crackable on consumer GPUs at billions of attempts per second. When you find a general-purpose hash being used as a password verifier, surface it.
12. **Non-cryptographic RNGs in security contexts are forgeable.** The pattern: tokens, session IDs, password resets, nonces, CSRF tokens, or anything an attacker would benefit from predicting, generated by `random.random`, `random.choice`, `Math.random`, `rand()`, or any seeded RNG. Use the cryptographic source: `secrets.token_urlsafe(32)` (Python), `crypto.randomBytes(32)` (Node), `SecureRandom` (Java). When you find a non-crypto RNG generating a security-sensitive value, surface it — this is one of the easiest "looks fine, isn't" patterns to miss.
13. **Hand-rolled crypto is almost always wrong.** The pattern: hand-coded AES, "lightweight" XOR ciphers, hardcoded IVs, reused nonces, hand-generated key material. Use the language's standard library or a well-audited library (libsodium, AWS KMS, OpenSSL bindings). Hardcoded IVs and reused nonces under AES-GCM are catastrophic; the library can prevent both.

### Authentication & authorization

14. **Every new endpoint declares its auth requirement explicitly.** "By default authenticated" is fine; "by default whatever-the-framework-does-when-unspecified" is not. The route definition (or a fail-closed middleware) should make the auth posture inspectable in one place. Example: a new admin-only endpoint added next to a public one inherits the public posture by default and ships unauthenticated.
15. **Authorize on the resource, not just the route.** A user authenticated as Alice asking for `/orders/42` must have ownership of order 42 verified server-side; the route check that "the user is logged in" is not sufficient. Example (IDOR): ` /api/users/<id>/email` returns any user's email because the controller looked up the user by the URL ID without checking the requester. Pass the requester's identity into the lookup, not just into the auth check.
16. **Trust no client-side auth state.** A hidden form field, a JWT claim the client could craft, a "role" cookie set after login — none of these are authoritative. The server re-derives every authorization decision from the session/token signature it issued and the resource being accessed.

## Red Flags

These thoughts mean STOP — apply the domain check before committing:

| Thought | Reality |
|---|---|
| "I'll f-string the user value into the SQL — it's faster than parameters." | The interpreter cannot tell your code from the attacker's input. Parameterize, always. (97/1) |
| "I need shell features here, so `shell=True` is justified." | Shell features in argv form are usually achievable with `subprocess` itself, or with `shlex.quote`-ing every interpolated value. Re-justify. (97/2) |
| "I'll just `os.path.join(base, user_filename)` — `..` is rare." | `..` is one keystroke. Resolve to realpath and verify it starts with the intended root. (97/4) |
| "Let me fetch this URL the user provided — it's just a webhook test." | SSRF into the metadata service is one URL away. Allowlist host/scheme; reject private ranges. (97/5) |
| "`pickle.loads` is convenient and we trust the source." | Trust drifts. The next caller of this function won't know the contract. Use a safe loader for any cross-trust data. (97/6) |
| "I'll log the request object so we can debug auth issues." | Request bodies and headers contain passwords and bearer tokens. Mask in middleware before logging. (97/8) |
| "Just put the API key in the config file for now — we'll move it before launch." / *finding a credential-shaped string literal in a file you're editing* | Once it's in git, it's leaked. Rotate the moment it's pushed. Surface and address even in prototypes — this rule applies at any stage. (97/9) |
| "SHA-256 of password+salt is hashed, so it's secure." / *finding `sha256(password)` in code you're touching* | Password hashing is a *category*, not "any hash function." Use bcrypt/scrypt/argon2id. Surface when found. (97/11) |
| "`Math.random()` for the password reset token is fine — it's random." / *finding `Math.random` or `random.random` generating a token, session ID, nonce, or CSRF value* | It's predictable. Tokens use `secrets.token_urlsafe` / `crypto.randomBytes` / `SecureRandom`. Surface when found. (97/12) |
| "I'll add the auth decorator after I get the endpoint working." | "After" is when it ships unauth'd to production. Auth decoration is part of the route definition, not a follow-up. (97/14) |
| "`/api/users/<id>` looks the user up by id — the auth check at the door is enough." | That's IDOR. Authorize on the resource, not just the route. (97/15) |
| "The client sends `is_admin=true` in the JWT and we trust it." | Trusting client-side state is the canonical privilege-escalation bug. The server re-derives authorization from its own signed session. (97/16) |

## What "done" looks like

For every trust-boundary crossing your change touches, **all** of the following are true:

- [ ] **Injection:** every dynamic value is parameterized at the driver level (no f-strings into SQL/LDAP/shell); `shell=False` everywhere except a re-justified exception with shell-quoted values.
- [ ] **Untrusted input:** path inputs are realpath-validated against an intended root; URL inputs hit an allowlist or block private/loopback ranges; deserialization uses `safe_load`/JSON for cross-trust data; the validator is at the boundary and downstream code does not re-validate.
- [ ] **Secrets:** logs do not contain `Authorization`, password fields, or tokens (verified by reading the diff and the log middleware); no credential-shaped string literal lives in source files, version control, or built images — including in code adjacent to your edit (surfaced in your summary to the user if found, not silently rewritten); client-facing errors are generic.
- [ ] **Crypto:** passwords use a password-hash (bcrypt/scrypt/argon2id) at a documented cost; security tokens use the cryptographic RNG (not `Math.random`/`random.random`); no hand-rolled crypto, no hardcoded IVs. Adjacent code with these issues is surfaced, not silently rewritten.
- [ ] **Auth:** every new endpoint's auth posture is inspectable at the route definition; authorization decisions check the resource (not just session validity); no client-side claim is authoritative.

If any box that applies to your change is unchecked, you are not done. Either finish, or revert and re-plan.

## Principles in this skill

| # | Principle | Author |
|---|---|---|
| 97/26 | Don't Ignore That Error! (generalized to "don't ignore the trust boundary") | Pete Goodliffe |
| 97/29 | Don't Rely on "Magic Happens Here" (generalized to "don't rely on a security control no one on the team understands") | Alan Griffiths |

The remaining content is original commentary written for this plugin — the book has thin direct coverage of modern security practice. See `principles.md` for the long-form distillations of 97/26 and 97/29 and a note on the rest. See `CONTENT-LICENSE.md` for the licensing posture.
