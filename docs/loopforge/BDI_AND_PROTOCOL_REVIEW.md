# BDI, recorded I/O and the larger engine

Incorporates the owner's 2026-10-03 architecture attachment. It is design input,
not evidence that these components exist in the archived implementation.

## The boundary we retain

`S[t+1] = step(S[t], admitted_inputs[t])`. External player and planner proposals
become mechanically relevant only after admission to a recorded total order.
Replay feeds those admitted inputs; it never asks the LLM again. Narrative prose
is a separate artifact attached to evidence, with no command authority.

## Two model jobs, two evaluation contracts

| Lane | Input | Output | Authority | Evaluation |
| --- | --- | --- | --- | --- |
| Narration | Committed, bounded evidence + voice | Attributed reaction | None | Faithfulness, voice, repetition, enjoyment, latency, cost |
| Deliberation (future) | Scoped beliefs + motives + plan library | Typed intention proposal | None until admission | Feasibility, permissions, preconditions, persistence, conflicts, stale results |

The planner does not need to revise every belief using an LLM. Sensors and known
events update beliefs deterministically where possible. Facts, uncertain beliefs
and rumors have different types/provenance. Desires can be authored utilities.
Commitments need continuation, success and abandonment rules; choosing a new
action on every tick is not a complete BDI implementation.

The implemented advisor has an intentionally short one-shift commitment: it
observes public strain/order data, scores recovery/delivery/stability using
character traits, and offers a doctrine. It cannot alter state. The original
Loopforge has no BDI framework; this advisor is new and does not pretend to be
an autonomous population of agents.

## Future intention envelope

```text
proposal_id, agent_id, world_id, observation_sequence,
created_from_event_ids, planner_version, model_version,
goal_id, plan_id, typed_arguments,
earliest_tick, expiry_tick, preconditions, resource_budget
```

Admission checks ownership, permissions, current preconditions, resource bounds,
expiry and duplicate ID. Log admitted tick, sequence, accepted typed command and
reason; retain rejected proposals separately for diagnosis. A thought based on
an old world must be rejected or deliberately reconsidered. Do not silently
rebase it onto new facts. A committed intention executes with cheap deterministic
systems until completion or an explicit reconsideration trigger.

Async arrival changes live outcomes. A fixed seed alone cannot make two live
model-driven runs identical. Deterministic replay starts from the same admitted
input history, including authoritative ordering. Wall-clock timestamps do not
provide a sufficient concurrency rule. Traceability is engineered with provenance,
stable identifiers, logging and retention; it is not free.

## Kernel–viewer contract

The prototype uses versioned JSON request/response and a complete bounded
snapshot. It deliberately permits forks and does not use a client-provided
snapshot as authority. No account, leaderboard or scarce inventory is promised.

A continuously running world should define:

- Snapshot: world/session, schema version, sequence, tick, view projection, state.
- Delta: world/session, schema version, base sequence, new sequence, tick, ordered
  typed operations; explicitly define deletion and component replacement.
- Acknowledgment: last applied sequence. An unknown/missing baseline triggers a
  full resync; obsolete deltas are discarded. Reconnect never guesses.
- Intent: idempotency ID, controlled entity, expected version, typed command.
- Backpressure: bounded outbound buffer, coalescing rules and resnapshot policy.
- Visibility: filter before serialization; rendering concealment is not access control.

FlatBuffers and Cap'n Proto are options after profiling. Binary serialization
does not supply diff semantics, baselines, ordering or recovery. ‘Zero-copy’ also
does not mean zero allocation across transports and browser bindings. Prefer a
debuggable schema until real scene sizes justify another format.

## Stack and scale qualifications

Rust with standalone bevy_ecs or hecs is a strong candidate for a measured
large-world core. Rust does not confer determinism: explicitly order dependent
systems, RNG streams, entity iteration and structural changes; specify arithmetic
and serialize versions. Parallelize independent work with deterministic reduction
where justified. A single-threaded scheduler alone does not define every order.

The slow planner can be TypeScript or Python. I/O latency usually dominates a
small orchestration service, but CPU/memory, parsing, queues and concurrency still
matter. LangGraph is optional when durable graph orchestration earns its complexity.
‘All Python cannot work’ is too absolute without world size and workload evidence.

ECS does not make navigation, sensing, neighborhood interactions, interest
management or serialization automatically cheap. Measure them. At population
scale, use deterministic controllers for routine work, event-triggered
reconsideration, a bounded deliberation queue, quotas, duplicate coalescing and
existing-plan fallback. A model call per entity per tick is not the default.

References: [Rao & Georgeff 1995](https://cdn.aaai.org/ICMAS/1995/ICMAS95-042.pdf),
[Bevy ECS system ordering](https://docs.rs/bevy_ecs/latest/bevy_ecs/system/index.html),
[Rust ownership](https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html).
