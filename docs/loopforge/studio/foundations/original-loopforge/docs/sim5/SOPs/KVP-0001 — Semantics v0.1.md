# semantics.md — KVP-0001 v0.1 Semantics (Normative)
**Status:** Locked (v0.1)  
**Applies to:** LIVE transport sessions (kernel-hosted) + Sprint 14 OFFLINE artifacts replay  
**Scope:** Meaning of ticks, windows, keyframes, snapshots, diffs, overlays, and validation rules  
**Non-goal:** UI behavior, renderer implementation details, engine-specific asset systems

> **Constitutional rule:** If behavior is not specified here (or in the schemas + canonicalization.md), it is not part of KVP-0001.

---

## 1) Core Definitions

### 1.1 Tick
- A **tick** is the kernel’s discrete simulation step (u64).
- Kernel is the only authority on tick progression.
- Viewers may interpolate visually, but **must snap to kernel-provided tick boundaries** and must not emit commands based on interpolated state.

### 1.2 Run Anchors
A run is uniquely described by (all required):
- `engine_name`, `engine_version`
- `schema_version`
- `world_id`, `run_id`
- `seed`
- `tick_rate_hz`
- `time_origin_ms`
- `render_spec` (required in v0.1)

These define identity, timing, and replay validity.

### 1.3 State vs Transition
- **State**: a complete viewer-facing baseline at a tick boundary (`FULL_SNAPSHOT`).
- **Transition**: a tick-to-tick change applied to a baseline (`FRAME_DIFF`).

---

## 2) Tick Windows (Normative)

### 2.1 Window Convention (Global)
All tick windows in v0.1 are **half-open**:

> **[start_tick, end_tick)** — start inclusive, end exclusive.

This applies to:
- `available_start_tick`, `available_end_tick` in `manifest.kvp.json`
- overlay batch windows (`X_UI_EVENT_BATCH.start_tick/end_tick`)
- any other window fields introduced in v0.1 schemas

### 2.2 Valid Tick Domain
Given a manifest with:
- `available_start_tick = S`
- `available_end_tick = E`

The set of valid ticks is:

> `t ∈ [S, E)`

Therefore:
- `t = E` is **not** valid / not contained in the artifact run.
- A viewer **must reject** seeks to `t < S` or `t ≥ E`.

### 2.3 Diff Coverage Domain
For offline artifact replay and for any diff inventory described by manifest:

- Diffs must cover every `from_tick` in:

> `from_tick ∈ [S, E-1]`

Each diff transitions:
- `from_tick = t`
- `to_tick = t + 1`

So:
- last diff ends at `to_tick = E`.

---

## 3) Keyframes (Normative)

A **keyframe** is a tick `kf` for which a `FULL_SNAPSHOT` exists.

The manifest must declare exactly one of:
- `keyframe_interval` (fixed spacing), OR
- `keyframe_ticks` (explicit list)

Rules:
- Exactly one of the two must be present (XOR).
- If `keyframe_ticks` is used:
    - Ticks must be **sorted ascending**
    - Ticks must be unique
    - All keyframes must satisfy `kf ∈ [S, E)`
- If `keyframe_interval` is used:
    - interval must be `>= 1`
    - the derived keyframe set must be well-defined over `[S, E)` (implementation described below)

### 3.1 Nearest Keyframe Definition
For any target tick `t ∈ [S, E)`:

> `kf = max({k | k is a keyframe AND k ≤ t})`

If no such keyframe exists, the artifacts are invalid for seeking and the viewer must error.

---

## 4) Record Semantics (Normative)

All records are delivered as KVP envelopes (see `envelope.schema.json`):
- Envelope-first dispatch is mandatory.
- `kvp_version` must equal `"0.1"`.

### 4.1 FULL_SNAPSHOT (Baseline)
`FULL_SNAPSHOT` payload represents complete kernel state for subscribed/effective channels at tick `t`.

Rules:
- `payload.tick` is the snapshot tick `t`.
- Snapshot is a **complete baseline** for reconstruction.
- Snapshot includes only viewer-facing kernel state for the subscribed/effective channel set.
- Snapshot must be primitives-only, canonicalized, and quantized (see canonicalization.md).

**No overlays** appear inside snapshots.

### 4.2 FRAME_DIFF (Transition)
`FRAME_DIFF` payload represents a **tick-to-tick transition**.

Rules (v0.1):
- `to_tick` **must equal** `from_tick + 1`.
- `ops[]` is the **only** authoritative diff mechanism in v0.1.
- `ops[]` must be applied **in emitted order** (order is canonical).
- `prev_step_hash` must equal the previous known `step_hash` at the `from_tick` boundary:
    - For the first diff after a keyframe snapshot, it must match the snapshot’s `step_hash`.
    - For subsequent diffs, it must match the prior diff’s `step_hash`.

**Hard prohibition (v0.1):**
- `FRAME_DIFF` must **not** contain `payload.state` or any “state replacement” representation.
- Any state-at-tick delivery is a **new msg_type** (e.g., `FRAME_STATE`) with its own schema and semantics. It must never be introduced by reinterpreting `FRAME_DIFF`.

**No overlays** appear inside diffs.

---

## 5) Overlay Semantics (Normative)

Overlays are presentation-only and do not affect determinism.

### 5.1 Overlay Delivery
Offline artifacts may include overlay sidecar streams as JSONL:
- each line is a KVP envelope
- overlay message types are `X_*` and are not valid on LIVE transports

### 5.2 Window Convention
Overlay payloads that define a window must follow:

> `[start_tick, end_tick)` (end exclusive)

Meaning:
- events/frames with `tick == end_tick` are **not included**.
- viewer must treat `start_tick` as inclusive.

### 5.3 Sorting Requirements (v0.1)
- `X_UI_EVENT_BATCH.events` must be sorted by `(tick, event_id)` ascending.
- `X_PSYCHO_FRAME` (if containing node/edge arrays):
    - nodes sorted by `id`
    - edges sorted by `(src_id, dst_id, kind)` (or the tuple declared in schema)

---

## 6) Manifest Semantics (Offline Artifacts) (Normative)

### 6.1 Manifest Authority
For offline artifacts replay:
- `manifest.kvp.json` is the **authoritative discovery surface**.
- The viewer must not guess paths or infer inventory; it must follow manifest pointers.

### 6.2 Pointer / Record Type Invariant (Required)
Each RecordPointer includes `msg_type`.

**Required invariant:**
- `RecordPointer.msg_type` must equal the fetched envelope’s `msg_type`.
- Mismatch is a fatal error (invalid artifacts).

This prevents indexing bugs (e.g., pointing to the wrong file type).

### 6.3 Inventory Completeness
Manifest must provide:
- snapshot pointer for every keyframe tick
- diff pointer for every `from_tick ∈ [S, E-1]`
- (optional) overlay pointers for the sidecar streams present

Missing pointers are fatal for compliant offline replay.

---

## 7) Reconstruction Semantics (Offline)

### 7.1 Seeking / Reconstruction Algorithm (Normative)
Given:
- manifest with window `[S, E)`
- target tick `t ∈ [S, E)`

Algorithm:
1) Load and validate `manifest.kvp.json`.
2) Compute `kf = nearest_keyframe_leq(t)`.
3) Fetch snapshot at `kf` via manifest pointer.
4) Initialize reconstructed state from snapshot baseline.
5) For each `u` in `[kf, t)`:
    - fetch diff pointer for `from_tick = u`
    - validate `to_tick = u+1`
    - validate `prev_step_hash` chain (strict mode required for conformance)
    - apply `ops[]` in order
6) The resulting state equals the authoritative viewer-facing state at tick `t`.

### 7.2 Failure Modes
The viewer must error (invalid artifacts) on:
- missing snapshot or diff pointer/file
- invalid keyframe policy (cannot derive keyframes)
- `to_tick != from_tick + 1`
- pointer `msg_type` != envelope `msg_type`
- invalid envelope (`kvp_version != 0.1`, unknown msg_type)
- hash chain failure in strict mode

---

## 8) Step Hash Semantics (Normative)

### 8.1 Meaning
`step_hash` is the hash of the canonical resulting STATE at a tick boundary:
- For `FULL_SNAPSHOT`: the boundary is `tick`.
- For `FRAME_DIFF`: the boundary is `to_tick` (state after applying the transition).

### 8.2 Scope (v0.1)
`step_hash` is computed over **effective subscribed channels only**.
- In offline artifacts replay, “effective subscribed channels” is the channel set declared by the manifest’s stream descriptors.
- Unsubscribed channels must not contribute to the hash.

### 8.3 Viewer Hashing (v0.1)
- Viewers must not invent their own `step_hash` scheme unless explicitly declared in a future version.
- Hash comparisons are performed only when an external integrity reference exists (manifest/fixture) or conformance tests require it.

---

## 9) Producer vs Consumer Field Rules (Normative)

### 9.1 Producer Strictness (Kernel/Exporters)
- Kernel/exporters must emit schema-minimal payloads.
- Unknown or non-schema fields must not be present in producer output.
- Canonicalization + quantization must already be applied prior to emission.

### 9.2 Consumer Tolerance (Viewer)
- Unknown `envelope.msg_type` must be rejected.
- Unknown enum variants inside recognized payloads must be rejected (v0.1).
- Unknown object fields inside otherwise recognized payload objects must be ignored (v0.1).
- Consumers must not rely on “fixing” producer ordering or float formats for correctness; producer outputs must already be canonical.

---

## 10) Conformance Requirements (Normative)

Any producer/consumer claiming KVP-0001 v0.1 compliance must pass the conformance suite:
- Envelope-first dispatch
- Tick window semantics `[S, E)`
- Keyframe derivation and nearest keyframe rule
- Snapshot/diff inventory completeness
- Pointer msg_type matches envelope msg_type
- Diff tick rule `to_tick = from_tick + 1`
- Hash chain continuity (`prev_step_hash` matches prior boundary)
- Overlay window semantics `[start, end)` and sorting rules
- Producer-minimal output and consumer tolerance rules as defined above

---

## 11) Extensions (Normative Process)

- New semantics require a new `msg_type` and schema addition.
- Existing `msg_type` semantics must not be reinterpreted in-place.
- Any “state-at-tick” fast path must be introduced as a new msg_type (e.g., `FRAME_STATE`) and must not overload `FRAME_DIFF`.

---