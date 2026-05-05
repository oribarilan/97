# observability — principles

Long-form per-principle distillations. The summary in `SKILL.md` is what
the agent loads on trigger; this file is the on-demand reference.

This skill is **predominantly original commentary** drawn from
Google's *Site Reliability Engineering* (O'Reilly, 2016), the
OpenTelemetry semantic conventions (opentelemetry.io), and
*Observability Engineering* (Majors / Fong-Jones / Miranda, O'Reilly,
2022). MIT plugin code license applies to the original text. No
verbatim source reproduction.

See `CONTENT-LICENSE.md` for the licensing posture.

---

## OTel/StructuredLogs — Structured Logs

**Author:** OpenTelemetry semantic conventions; reinforced by *SRE* (ch. 16) and *Observability Engineering*
**Source:** https://opentelemetry.io/docs/specs/semconv/general/logs/
**License:** Apache-2.0 / CC-BY-4.0

**Distillation.** A log line in production is data the operator
queries, not text the operator reads. The shape that supports queries
is structured key/value: a stable `event` name (`user_login_failed`,
`order_placed`, `db_query_slow`); a `level` (`info`, `warn`, `error`);
a `timestamp` the platform produces; a `request_id` (or `trace_id`)
for correlation; and the relevant context fields, named at the call
site. Free-form interpolated strings (`f"user {id} did {action}"`)
defeat aggregation and force operators to write substring queries
that drift over time. The trade-off is one extra line of code per
log call; the payoff is the difference between "find every failed
login in the last hour for users in region X" being one query and
being a grep through 50GB of plaintext.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "free-form
log string" and "request id missing from a log line." Cross-references
`12F/XI` (in `build-deploy-and-tooling`) for transport and
`security-and-trust-boundaries` for content limits.

---

## OTel/TraceContext — W3C Trace Context

**Author:** OpenTelemetry semantic conventions
**Source:** https://www.w3.org/TR/trace-context/
**License:** CC-BY-4.0

**Distillation.** Distributed systems are illegible without a trace
that connects each user action to every cross-service call it
caused. The W3C Trace Context specification defines two HTTP headers
(`traceparent`, `tracestate`) that carry the trace and parent-span
IDs. Every outgoing HTTP / gRPC / queue call propagates them; every
incoming handler reads them and continues the trace. Modern tracer
SDKs do this automatically when you use the SDK's HTTP client and
queue helpers. The case that breaks: code that reaches around the
SDK (raw `requests.get`, manual queue producer, custom RPC) — the
trace ends at that line and the operator cannot see the cross-service
path. Span boundaries follow meaningful units of work — request,
DB transaction, queue message, batch job — not every function call;
over-spanning produces noise and trace storage cost.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "raw
HTTP call without trace headers" and "span per private helper." The
"meaningful units of work" rule keeps trace cost bounded.

---

## SRE/GoldenSignals — The Four Golden Signals

**Author:** ed. Beyer / Jones / Petoff / Murphy
**Source:** Site Reliability Engineering, O'Reilly 2016, ch. 6 ("Monitoring Distributed Systems")
**License:** fair-use commentary

**Distillation.** For user-facing service code, four signals carry
most of the operator-facing value: **latency** (how long does work
take, broken down by request type and at percentiles, not means),
**traffic** (how much work — requests per second, queue depth),
**errors** (rate of explicit failures and of policy-violating
successes), and **saturation** (how full is the resource — CPU,
memory, connection pool, queue capacity). For each new request
handler, RPC method, or background job, the agent asks which of
the four are observable for this code path; if any is not, it adds
the instrument or notes the gap. Not every codebase needs all
four — a CLI is not a service, a one-off script is not a service —
but production service code does. The four signals are a *coverage
check*, not a metric scheme; the actual metric names follow
project conventions.

**Agent application.** Surfaces in `SKILL.md` Red Flags as "no
latency or error signal on a new production handler." Sharpens
the "what 'done' looks like" checklist for service code.

---

## OE/CardinalityDiscipline — Cardinality Discipline

**Author:** Charity Majors, Liz Fong-Jones, George Miranda
**Source:** Observability Engineering, O'Reilly 2022
**License:** fair-use commentary

**Distillation.** Metric labels are indexed; every unique combination
of label values produces a separate time series the backend stores,
indexes, and queries. Adding `user_id` as a label on a counter
produces one series per user — millions for a service with millions
of users — and the metrics backend either rejects writes, drops
data, or falls over. **High-cardinality fields (user id, request
id, trace id, full URL path, raw error message) belong in logs and
traces, where one event is one record; never in metric labels.**
Metric labels are for low-cardinality, bounded sets: HTTP method,
route template (`/users/:id`, not `/users/12345`), status class
(`2xx`, `4xx`, `5xx`), region, downstream service name. The
discipline is the difference between metrics that scale to a
production load and metrics that take down the metrics system.

**Agent application.** Surfaces in `SKILL.md` Red Flags as
"per-user metric label," "full URL path as a label," and the
highest-leverage single check in the skill. The cardinality bug is
the one agents most often introduce by default — Prometheus-style
labels with user ids in them are the canonical example.
