# Loopforge operations and evaluations

## What is running

The two English presentations contain 8 overview and 16 architecture chapters.
Routes: `/stepanoskin/loopforge/overview/the-factory`,
`/stepanoskin/loopforge/architecture/the-thesis`, `/stepanoskin/loopforge/play`.
The existing Stepanoskin entrance links to all three and Sanctuary Economics.

The eight-shift kernel is `lf-teaching-1`, a new TypeScript teaching model. It is
not a Python port, archetype ECS, persistent multiplayer world or full BDI agent.
No credentials are needed for the public, branchable simulation. Every server
request reconstructs at most eight commands; the client cannot submit output.
State is not persisted across browser reload. No scarce resources or anti-cheat
claims require a signed run capability, so that earlier proposed complexity was
removed. Narration recomputes evidence and hashes the normalized command history.

Rules: each room yields `max(0, 4 + expertise + doctrine + disturbance - floor(strain/20))`.
Specialist expertise is 2, otherwise 0. Doctrine modifiers: care -1, balanced 0,
pressure +2. Strain changes by -16 / +4 / +18 and is clamped to 0..100.
Five xorshift32 draws per shift yield disturbances `rng % 3 - 1`, in room order.
This modulo mapping has a tiny bias; it is part of the versioned teaching rules.
Quota is 240. The example policy on seed 7 ends at 241 units and 42 strain.

The deterministic BDI advisor observes current public state and selects a
one-shift recommendation using authored trait biases. The player must accept it.
Persistent plans, partial observation, LLM deliberation and intention admission
are future architecture, explicitly distinguished from the implemented advisor.

## Enable the paid sidecar

The owner approved a **$1 total model-testing budget** on 2026-10-03. Vercel Preview
settings now contain `LOOPFORGE_BUDGET_MICRO_USD=1000000` and allocation ID
`lf-initial-2026-10-03`. Preserve that ID across redeployments. This is a shared
allocation, not $1 per deployment. An existing preview `OPENAI_API_KEY` is present
and has been verified by twelve fresh model calls across two prompt versions.
Estimated token cost: $0.0039968; durable reservations: $0.024952. See
[live evaluation](LIVE_EVALUATION.md) and [owner setup](OWNER_SETUP.md).

Configure these server-only secrets on the preview deployment (never NEXT_PUBLIC):

The free `loopforge-preview-quota` Upstash store has been created in `iad1` with
eviction disabled and connected to Preview only, using prefix `LOOPFORGE`.
Its integration injects `LOOPFORGE_KV_REST_API_URL` and
`LOOPFORGE_KV_REST_API_TOKEN`; the adapter accepts that complete pair when neither
manual `LOOPFORGE_REDIS_REST_*` variable is set. A partial manual pair disables
generation rather than mixing two stores' credentials. Values were not revealed.

| Name | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | Dedicated OpenAI project key |
| `LOOPFORGE_DEMO_ACCESS_CODE` | Private demo gate, entered in the console; not the API key |
| `LOOPFORGE_REDIS_REST_URL` | HTTPS REST endpoint of a durable Redis-compatible store |
| `LOOPFORGE_REDIS_REST_TOKEN` | Credential for that store |
| `LOOPFORGE_BUDGET_ID` | Stable allocation identifier shared by all deployments |
| `LOOPFORGE_BUDGET_MICRO_USD` | Explicit approved model budget; 1 USD = 1,000,000 |

No default spending allocation exists. No key, gate, store or positive allocation
means no paid calls. Do not rotate the budget ID merely to deploy; that would
create a new allocation. The store must preserve keys and use a no-eviction
policy for budget records. Redis hosting is outside the model-token budget.

The prototype pins `gpt-4.1-mini-2025-04-14` with Responses structured output,
240 output tokens, `store:false`, no tools, no provider retries and a 15-second
deadline. This is a cheap baseline to evaluate, not a claim of best available
quality. Rates checked 2026-10-03: $0.40/M input, $0.10/M cached input, $1.60/M
output ([official model page](https://developers.openai.com/api/docs/models/gpt-4.1-mini)).
Changing the model requires changing the budget calculation and running the same
evaluation corpus; do not silently repoint a model environment variable.

Before the provider request, an atomic Redis script reserves a conservative
uncached token allowance using UTF-8 request bytes plus a 2,048-token envelope
margin and the full output cap. Reservations are never refunded. Uncertain
timeouts consume their reservation; retries of the same event/prompt/model/sample
do not make a second provider call. This sacrifices some budget utilization to
keep failure handling simple. Monitor actual usage against reservations; revised
provider prices require recalibration. This is a model-cost cap under those
documented rates and token bounds, not a universal cloud-spend guarantee.

Validated artifacts and provenance are stored in Redis. Atomic reservation and
artifact write are separate: if delivery/storage fails after inference, that beat
remains reserved, may have no recoverable artifact, and is not retried. Production
should use a durable job state machine with reconciliation and retention policy.
The current store is append-only for the bounded private prototype; give it a
storage budget before broader access. No process-local quota or provider budget
alert is treated as a hard spending limit.

## Evaluation workflow

1. Run `npm test -- --runInBand __tests__/loopforge`. These are offline mechanical,
   protocol and model-envelope checks, including intentionally schema-valid but
   unfaithful prose. Passing them says nothing about real model narrative quality.
2. Configure the preview sidecar and an approved spend allocation. Set
   `LOOPFORGE_EVAL_BASE_URL`, `LOOPFORGE_DEMO_ACCESS_CODE`, and optionally
   `LOOPFORGE_EVAL_SAMPLES=1..3` locally. Run
   `node scripts/loopforge-eval.mjs /tmp/loopforge-candidate-a.json`.
3. Use the same six-case corpus on a candidate deployment with a deliberately
   versioned model/prompt/adapter. Samples have distinct keys within the same
   budget. Re-running a sample retrieves the stored artifact; it is not fresh
   independent evidence. No automatic paid evaluation runs in CI.
4. Run `node scripts/loopforge-eval-report.mjs /tmp/loopforge-candidate-a.json`.
   It reports accepted rate with Wilson interval, fresh-artifact p50/p95 latency,
   known accepted-output cost and review completeness. Failed-call actual costs
   are not inferred; their conservative reservations remain consumed.
5. Blind candidate/provider labels and randomize A/B order for review. Complete
   factual faithfulness first (unsupported outcomes are failures), then voice,
   consequence recognition and preference. Add adjudication notes. Calibrate any
   model grader against human labels; check position bias and disagreement.
6. Do not rank models from six examples. Expand a held-out set, include routine
   and edge situations, repeat stochastic samples, set thresholds before testing,
   and inspect confidence intervals and per-slice regressions. Compare against
   authored-only baseline. Canary a passing version; retain rollback artifacts.

Future deliberation needs another corpus: goal feasibility, precondition checking,
permission compliance, stale proposals, planner interruption, plan persistence,
resource conflicts and deterministic execution after admission. Narrative voice
quality is not evidence of planning competence.

## Evidence status

Preview credentials, durable quota storage and the owner's $1 spending limit are
configured. Real provider calls, durable cached retrieval, the private gate and
the hosted eight-shift simulation are verified. The six-case corpus exposed real
writing defects and drove prompt revision `lf-voice-2`; remaining semantic issues
are recorded in [the evaluation](LIVE_EVALUATION.md). No human quality score is claimed.
The site says not connected while configuration is absent, and ready (not verified)
when configuration exists. Generation records identify accepted live artifacts.
