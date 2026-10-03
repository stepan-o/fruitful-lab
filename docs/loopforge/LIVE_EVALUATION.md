# First live narration evaluation

Date: 2026-10-03. Provider: OpenAI, pinned `gpt-4.1-mini-2025-04-14`.
Corpus: `lf-evals-1`, six fixtures, one fresh sample each. The shared approved
allocation remains $1; prompt revisions do not reset its durable counter.

## Baseline: lf-voice-1

All six responses passed structural/evidence-identity validation. Provider p50
was 1,955 ms and p95 2,914 ms. Recorded usage implies $0.0019164 at the pinned
rates; conservative non-refundable reservations totaled $0.011996. These are
six laboratory requests, not production latency percentiles or a quality score.

Agent editorial inspection found defects despite the 6/6 envelope acceptance:

- Five of six reactions selected Stiletto, limiting cast variety.
- The recovery line asserted intact paperwork and no shortcuts without evidence.
- The staffing case referred to an internal "room 0".
- Several lines described output as steady without previous-shift output.
- The final-order line failed to recognize the narrowly met quota.

Raw outputs and unfilled human review fields: [baseline records](eval-baseline-v1.json).
These observations are agent review, not blinded human ratings. Human fields
remain null. This baseline should not be promoted as a narrative-quality result.

## Revision: lf-voice-2

The narrative adapter now assigns a speaker with an explicit, deterministic
casting policy; this changes no simulation state. High strain selects Cathexis,
an otherwise completed run selects Thrum, care selects Rivet Witch, pressure
selects Stiletto and balanced work selects Limen. This is authored coverage,
not emergent agency. Schema and runtime validation require that assigned speaker.

The evidence projection names rooms and includes quota/completion facts. It
separates personality examples from committed events and forbids unsupported
history or output comparisons. The prompt asks for a short spoken reaction.
The same six cases were rerun; the versioned artifact keys preserve the old
outputs and prevent false reuse as independent samples.

All six revised responses passed their envelope checks. Provider p50 was 1,329 ms
and p95 2,584 ms; recorded usage implies $0.0020804. Reservations were $0.012956.
All five assigned voices appeared. A second retrieval of the same six cases
returned six cached artifacts, making no additional paid generation calls.
See [revision records](eval-revision-v2.json). Both fresh runs together used an
estimated **$0.0039968** and reserved **$0.024952** of the shared $1 allocation.

Agent inspection confirms that raw room indices and invented paperwork checks
disappeared, and final-run reactions now address the order outcome. The prose
still needs editorial judgment: the staffing reaction's overtime assertion is
unsupported, and some metaphors are generic. Structural acceptance is therefore
not a faithfulness pass. This version is exposed only as the private learning
prototype, not certified production narration. Human review remains unfilled.

## Hosted integration

The hosted browser completed all eight shifts at 241 units and 42 strain, matching
the golden replay. A wrong private access code was rejected without changing
the committed 38-unit first shift. OpenAI responses and durable cached retrieval
were verified through the deployed endpoint. The Vercel preview is protected;
use an authorized preview session before testing its API requests.

Future model/provider changes require a held-out corpus, repeated samples,
blinded human faithfulness/voice review and preset acceptance criteria. Six
examples can expose defects; they cannot establish model superiority.
