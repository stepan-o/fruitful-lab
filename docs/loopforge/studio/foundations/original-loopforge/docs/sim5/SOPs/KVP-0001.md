# 📡 KVP-0001 — Kernel ↔ Viewer Protocol
## _Public Interface Contract for Loopforge Sim5 → SimX_

**Status:** Locked v0.1 (Sprint 14.0A)  
**Audience:** Kernel, Viewer, Tooling, Replay, QA  
**Scope:** Deterministic simulation → external renderers  
**Applies to:** Godot, Web Viewer, Unreal, Unity, future runtime shells
---

## 0. Purpose

Define a **public, versioned, testable protocol** between the **Loopforge deterministic kernel** and any **viewer/client**.

This protocol ensures:
- engine-agnostic rendering (viewers are replaceable)
- deterministic replay (replay, streaming, and tooling are first-class)
- multi-viewer compatibility
- long-term forward portability (kernel portable across runtimes)

**If it is not expressed here, it is not part of the system.**
---

## 1. Core Principles (Non-Negotiable)

1. **Protocol, not code**
    - Viewer never imports kernel code
    - Kernel never imports viewer code
    - No shared runtime state
    - No engine-specific logic
    - No implicit contracts

2. **Kernel sovereignty**
    - Kernel is the only authority
    - All simulation state lives in the kernel
    - Viewers are observers + command emitters

3. **Determinism is sacred**
    - Replay defines truth
    - Same seed + inputs = same outputs
    - Viewer must never affect determinism
    - Visual polish is secondary

4. **Primitives-only payloads**
    - Rust-portable
    - JSON / msgpack / protobuf friendly
    - No engine objects; no pointers; no shared memory

5. **Replaceable viewers**
    - Godot today, Web tomorrow, Unreal later
    - Viewers are shells, not authorities

6. **Testable by construction**
    - Golden snapshots/diffs
    - Canonical ordering
    - Float quantization
    - Stable schemas
---

## 2. Transport Model

KVP-0001 is **transport-agnostic**.

> Sprint 14 Offline Replay (v0.1 banner)
>
> There are two replay modes in v0.1:
> - Replay via Kernel (LIVE transport replay session) — uses `REPLAY_BEGIN`/`REPLAY_READY`/`REPLAY_SEEK` on LIVE transports that support kernel-hosted replay.
> - Offline Artifact Replay (Sprint 14) — NO `REPLAY_*` messages at all; the viewer loads `manifest.kvp.json` and state records (snapshots/diffs) directly from artifacts.
>
> MUST rules:
> - Sprint 14 Offline Artifact Replay uses zero REPLAY_* messages.
> - REPLAY_* exists only for kernel-hosted replay on LIVE transports.
> - Viewer discovers tick window/keyframes solely from manifest.kvp.json.
>
> Interop notes:
> - State records in artifacts REUSE the same envelope + `msg_type` + payload schemas as LIVE state delivery.
> - Artifact organization (chunking/indexing/paths/URLs) is defined in the Export Appendix (normative for Sprint 14 offline).
>
> Transport note (v0.1): implementations MAY batch multiple envelopes into a single transport frame (e.g., a single WebSocket message), but each record MUST remain an independently decodable envelope; no implicit concatenation or shared outer wrapper.

### Recommended implementations
- **WebSocket** (default): bidirectional streaming
- **TCP**: local/high-throughput
- **HTTP**: snapshot + replay fetch (out-of-band)

Transport requirements are split by mode:

- LIVE transport (e.g., WebSocket):
  - MUST preserve message order
  - MUST deliver in-order; loss/failure MUST be surfaced and recovered via resubscribe + snapshot
  - MUST support bidirectional flow (viewer→kernel inputs)
  - WebSocket LIVE sessions MUST send protocol messages as UTF-8 JSON text frames (not binary frames)

- REPLAY artifacts (e.g., HTTP fetch of snapshots/diffs/manifests):
  - MAY use HTTP or any content-addressable fetch; no bidirectional requirement
  - Ordering and integrity MUST be defined at the artifact/manifest level (e.g., each diff references from_tick/to_tick and previous hash)
  - Client-only fetching is expected; no server-rendered tick state is required or assumed

Transport failures must be recoverable via **resubscription + snapshot replay** (LIVE) or **re-fetch** (REPLAY).
---

## 3. Message Envelope (Mandatory)

All protocol messages MUST use this envelope:

```text
{
  "kvp_version": "0.1",
  "msg_type": "FULL_SNAPSHOT",
  "msg_id": "uuid",
  "sent_at_ms": 0,
  "payload": { }
}
```
**Envelope fields**
- `kvp_version` (string): protocol version, MUST equal `"0.1"` for this spec
- `msg_type` (string): discriminator (SCREAMING_SNAKE_CASE)
- `msg_id` (string): unique identifier (UUID string in v0.1)
- `sent_at_ms` (u64): sender timestamp (non-authoritative)
  - `sent_at_ms` MUST NOT be used for state ordering, reconciliation, or tick advancement
- `payload` (object): schema-defined content for msg_type

Notes (v0.1 AAA Fix Pack):
- Envelope.msg_type is the single authoritative discriminator.
- Decoder MUST decode the envelope first, then decode payload based on Envelope.msg_type only.
- Payload objects carry no inner type discriminator in v0.1 for selecting message type.
  - Nested tagged unions INSIDE payloads are allowed (e.g., InputCommand.cmd.type) but MUST NOT be used to infer the top-level message type.
- Implementations MUST NOT perform shape-based dispatch for top-level payloads (forbid untagged top-level payload unions and polymorphic-by-shape decoding).
- Decoders MUST switch on envelope.msg_type to decode payload; decoding by payload shape is non-compliant.

**Messages without this envelope are invalid and MUST be rejected.**

---

## 4. Versioning & Compatibility

### Version layers
- **KVP version** (`kvp_version`) → protocol compatibility
- **Schema version** (`schema_version`) → integration data model compatibility

### Compatibility rules
- Major mismatch → hard reject (v0.x treated as “major locked” for v0.1)
- Minor may add **optional** fields only
- Required fields are immutable
- Schema-breaking changes require a new KVP version (or new schema + enforced handshake gating)

**Kernel MUST explicitly reject unsupported viewers.**

### 4.1 Multi-engine / multi-schema routing

KVP transport/handshake is shared, but state payload schemas are not globally fixed.

- `KERNEL_HELLO.payload.engine_name` + `KERNEL_HELLO.payload.schema_version` is the authoritative routing key for viewer pipeline selection.
- `schema_version` is a namespaced string, not a global constant.
  - Example legacy schema: `"1"` (sim4)
  - Example engine-scoped schema: `"sim_sim_1"` (sim_sim)
- Viewers may support multiple schema handlers simultaneously and advertise all supported schema strings in `VIEWER_HELLO.supported_schema_versions`.
- Kernel MUST select exactly one compatible `schema_version` for the session and publish it in `KERNEL_HELLO`.
- If no compatible schema exists:
  - Kernel SHOULD send `ERROR` (e.g., `SCHEMA_MISMATCH`) with a clear reason and then close the session.
  - Viewer MUST treat this as a hard protocol incompatibility (desync/error state).

### 4.2 Schema registry / naming convention

v0.1 naming guidance:
- Existing legacy schema IDs may remain as-is (example: `"1"` for sim4).
- New schemas SHOULD use `<engine>_<major>` (example: `"sim_sim_1"`).

Bump rules:
- Breaking payload changes (field removals/renames/type changes/semantic reinterpretation) MUST mint a new `schema_version` string.
- Additive optional fields MAY remain within the same `schema_version` if canonicalization and semantic meaning are preserved.
- Viewer support tables MUST be updated whenever a new schema string is introduced.

Reserved values (v0.1):
- Reserved enum variants are treated as unsupported and MUST be rejected in v0.1.

Unknown/unsupported handling (v0.1):
- Unknown `envelope.msg_type` → MUST be rejected.
- Unknown enum variants inside recognized payloads → MUST be rejected.
- Unknown object fields inside otherwise recognized payload objects → MUST be ignored in v0.1. This rule applies only after envelope-first dispatch by `msg_type` and does not permit shape-based dispatch.
- Kernel encoders MUST emit schema-minimal payloads; viewers MUST treat extra fields as non-semantic and MUST NOT include them in canonicalization/hashing.

Processing sequence (v0.1):
1) Envelope decode
2) `msg_type` switch (envelope-first)
3) Payload decode (for the matched `msg_type` only)
4) Payload validation (v0.1 rules)
5) Canonicalize (ordering + float quantization)
6) Hash compare (only when an external integrity reference exists)

---

## 5. Identity & Run Anchors

A session is anchored by:
- `engine_name` (e.g. `"sim5"`, `"simx"`)
- `engine_version` (semver or commit hash)
- `schema_version` (string)
- `world_id` (UUID)
- `run_id` (UUID per execution)
- `seed` (int)
- `tick_rate_hz` (int)
- `time_origin_ms` (u64)

These are **required** for determinism, replay, and trace validity.

---

## 6. Session Lifecycle (Strict State Machine, LIVE transports only)

**No state payloads may be sent until handshake + subscribe are complete.**

### Allowed sequence (v0.1)
1) `VIEWER_HELLO` →  
2) `KERNEL_HELLO` →  
3) `SUBSCRIBE` →  
4) `SUBSCRIBED` →  
5) then and only then: `FULL_SNAPSHOT` and/or `FRAME_DIFF`

If the viewer violates sequencing, kernel MUST send `ERROR` and may close the session.

Baseline delivery guarantees (AAA):
- If `snapshot_policy = ON_JOIN`, kernel MUST send exactly one baseline `FULL_SNAPSHOT` immediately after `SUBSCRIBED` and BEFORE any `FRAME_DIFF` is sent. This rule is non-optional.
- If `snapshot_policy = NEVER`, kernel MUST either reject the subscription with `ERROR` or require the viewer to obtain a baseline via replay/seek artifacts before any diffs can be applied. Kernels MUST make this behavior explicit (documented per integration or via `REPLAY_READY`).

“This lifecycle applies to **LIVE transport sessions** only. In **ARTIFACTS replay**, the viewer loads exported records (manifest + snapshots/diffs) without handshake/subscription.”

---

## 7. Handshake

### 7.1 Viewer → Kernel: `VIEWER_HELLO`

```json
{
  "viewer_name": "webview",
  "viewer_version": "0.1.0",
  "supported_schema_versions": ["1", "sim_sim_1"],
  "supports": {
    "diff_stream": true,
    "full_snapshot": true,
    "replay_seek": true
  }
}
```

**Rules:**
- supported_schema_versions MUST be non-empty
- Kernel chooses exactly one schema_version for the session
- Chosen schema_version MUST be one of viewer-advertised supported_schema_versions

---

### 7.2 Kernel → Viewer: `KERNEL_HELLO` (REQUIRED fields)

```json
{
  "engine_name": "sim_sim",
  "engine_version": "0.1.0",
  "schema_version": "sim_sim_1",
  "world_id": "uuid",
  "run_id": "uuid",
  "seed": 12345,
  "tick_rate_hz": 30,
  "time_origin_ms": 0,
  "render_spec": {}
}
```

`KERNEL_HELLO` is transport-level and shared across engines.  
Its payload carries engine/schema routing anchors (`engine_name`, `schema_version`) plus run identity and `render_spec`.

`render_spec` **is REQUIRED in v0.1**  
`render_spec` is a viewer contract: camera fit, coordinate system, projection hints, draw ordering hints, asset resolution fallback.

It MUST be stable for the run (and ideally stable across engine versions unless schema bumps).  
render_spec MUST NOT change during a run. Any change requires a new run_id.
- Viewer should cache render_spec keyed by run_id and treat any change as fatal protocol violation (or at least WARN + hard reset).

Example `render_spec` (normative shape):
```json
{
  "coord_system": {
    "units": "WORLD_UNITS",
    "units_per_tile": 1.0,
    "axis": { "x_positive": "EAST", "y_positive": "SOUTH" },
    "origin": { "x": 0.0, "y": 0.0 },
    "bounds": { "min_x": 0.0, "min_y": 0.0, "max_x": 100.0, "max_y": 100.0 }
  },
  "projection": {
    "kind": "ISOMETRIC_2_5D",
    "recommended_iso_tile_w": 64,
    "recommended_iso_tile_h": 32
  },
  "z_layer": {
    "meaning": "DRAW_STACK_HINT",
    "stable_across_run": true,
    "notes": "Lower draws first. Not used for physics."
  },
  "draw_order": {
    "rooms": ["Z_LAYER", "ROOM_ID"],
    "agents": ["ROOM_ID", "LOCAL_SORT_KEY", "AGENT_ID"],
    "items": ["ROOM_ID", "LOCAL_SORT_KEY", "ITEM_ID"]
  },
  "local_sort_key": {
    "source": "WORLD_Y",
    "quantization": "Q1E3",
    "direction": "ASC",
    "notes": "Default: quantized world_y; higher y draws later."
  },
  "asset_resolution": {
    "policy": "MANIFEST_OR_PRIMITIVE_FALLBACK",
    "missing_ref_behavior": "DRAW_PRIMITIVE"
  }
}
```

`bounds` **MUST be present** (initial camera fit + minimap scaling).

---

### 7.3 Shared transport vs engine-specific payload schemas

| msg_type | Layer | Payload contract |
|---|---|---|
| `KERNEL_HELLO` | Shared transport/session | Shared shape; includes `engine_name`, `schema_version`, `render_spec` |
| `FULL_SNAPSHOT` | State delivery | Schema-specific by `schema_version` |
| `FRAME_DIFF` | State delivery | Schema-specific by `schema_version` |

Routing rule:
- Viewer first dispatches by envelope `msg_type`.
- For state payloads, viewer then dispatches to the schema handler selected by `KERNEL_HELLO.engine_name + schema_version`.

---

## 8. Subscription Model (No Unsolicited Data)

After handshake, viewers explicitly subscribe to streams and channels.

`SUBSCRIBE/SUBSCRIBED` are **LIVE-only**, and artifacts replay does not model “subscription,” only file/record selection.

### 8.1 Viewer → Kernel: `SUBSCRIBE`

```json
{
  "stream": "LIVE",
  "channels": ["WORLD", "AGENTS", "EVENTS"],
  "diff_policy": "DIFF_ONLY",
  "snapshot_policy": "ON_JOIN",
  "compression": "NONE"
}
```

**Rules:**
- Kernel MUST NOT send state before `SUBSCRIBED`
- Kernel MAY narrow channels/policies but must tell the viewer
- `channels` MUST be a set (duplicates invalid)
- `channels` MUST be non-empty to avoid ambiguous “connected but no contract” sessions.
- `compression` is a hint; negotiated result is implicit in transport (v0.1) unless later extended
- In v0.1, `SUBSCRIBE.stream` is LIVE-only. Replay/seek is controlled via `REPLAY_BEGIN`/`REPLAY_SEEK` and artifact fetch, not via a `SUBSCRIBE` with `stream = REPLAY`.
  - v0.1 rule: decoders/validators MUST reject any `SUBSCRIBE.stream` value other than `LIVE` (`REPLAY` is reserved).

---

### 8.2 Kernel → Viewer: `SUBSCRIBED`

```json
{
  "stream_id": "uuid",
  "effective_stream": "LIVE",
  "effective_channels": ["WORLD", "AGENTS", "EVENTS"],
  "effective_diff_policy": "DIFF_ONLY",
  "effective_snapshot_policy": "ON_JOIN",
  "effective_compression": "NONE"
}
```

Rules:
- **Kernel MUST NOT send data for unsubscribed channels.**
- `effective_stream` and `effective_snapshot_policy` MUST be returned. If negotiation is not supported, they MUST echo the request values.

---

## 9. Channels

Core channels (v0.1):
- `WORLD`
- `AGENTS`
- `ITEMS`
- `EVENTS`
- `DEBUG`
Reserved / future:
- `NARRATIVE` (reserved; not used for v0.1 state delivery)

If a channel is not subscribed, **data from that channel MUST NOT be sent**.

v0.1 rule — Reserved/future channels (e.g., `NARRATIVE`) MUST be rejected or stripped during SUBSCRIBE negotiation and MUST NOT result in any state delivery in v0.1.

---

## 10. Time Model (Kernel Authoritative)

Kernel is the sole authority on time.

All state deliveries include:
- `tick` or (`from_tick`,`to_tick`)
- `step_hash` (deterministic)
- `schema_version` (string) inside state payloads

Viewer MUST:
- treat ticks as immutable history
- apply diffs strictly in order
- never invent time or advance tick locally

Viewers MAY interpolate visually between ticks for smoothness, but MUST snap to kernel-provided state on tick boundaries and MUST NOT emit commands based on interpolated state.

Normative step_hash definition (v0.1):
- `step_hash` is the hash of the canonical resulting STATE at the boundary tick: for `FULL_SNAPSHOT`, at `tick`; for `FRAME_DIFF`, at `to_tick` (i.e., after applying the transition from `from_tick` to `to_tick`).
- **Viewer MUST NOT compute its own `step_hash` in v0.1 unless a declared viewer-hash scheme exists.**
  - Otherwise, `step_hash` is for logging / manifests / integrity.
  - This prevents someone “helpfully” hashing reconstructed viewer state (which can drift due to rendering-only transforms).

Encoding strictness for hashing (v0.1):
- Kernel encoders MUST NOT emit unknown or non-schema fields in any payload. Kernel output MUST be schema-minimal.
- Viewers MAY include unknown/extra fields in messages sent to the kernel; such fields MUST be ignored during decode and MUST NOT participate in canonicalization, hashing, or `step_hash` computation.

Step hash algorithm and canonicalization (v0.1):
- Hash algorithm: SHA-256. `step_hash` is the lowercase hex string of the SHA-256 digest of the canonical bytes.
- Canonical bytes: UTF-8 (no BOM) JSON of the STATE after canonicalization, encoded using RFC 8785 JSON Canonicalization Scheme (JCS) rules for object member ordering and number formatting.
- Float policy: apply float quantization (Q1E3 unless otherwise negotiated in a future version) BEFORE hashing.
  - No negotiation exists in v0.1; Q1E3 is mandatory.
- Array ordering: apply the protocol’s canonical ordering rules (IDs, keys, or as-emitted for ops) BEFORE hashing.
- Scope: compute over SUBSCRIBED CHANNELS ONLY in v0.1 (the viewer’s negotiated channel set). Unsubscribed channels MUST NOT contribute to `step_hash`.
- In offline artifact replay, the hash scope MUST equal the channels declared in the manifest stream descriptors (treated as the effective subscribed set).
- Unknown fields: MUST be ignored for state reconstruction and MUST NOT participate in canonicalization or hashing.

---

## 11. Delivery Modes

> Sprint 14 Offline Replay (banner)
>
> - Offline Artifact Replay (Sprint 14) does not use `REPLAY_*` messages. The viewer discovers tick windows and keyframes from the exported manifest and fetches state records (enveloped snapshots/diffs) directly from artifacts.
>   - Offline Artifact Replay (file/folder) uses zero REPLAY_* because there is no kernel session. Kernel-hosted replay may still use REPLAY_* control messages even when delivery=ARTIFACTS.
> - LIVE replay sessions (kernel-hosted) use `REPLAY_*` messages; these are only valid on LIVE transports.
> - Artifact packaging (chunking/indexing/paths) is specified in the Export Appendix, not here.

Sprint 14 Offline Export — Normative binding:
- For Sprint 14 Offline Artifact Replay, the Export Appendix is NORMATIVE. A viewer is compliant with KVP-0001 v0.1 offline mode only if it implements the Export Appendix requirements.
- Minimal manifest contract surface (viewer MUST be able to read these fields either inline or via pointers in `manifest.kvp.json`):
  - Tick window: `available_start_tick`, `available_end_tick`
  - Keyframe policy: either a fixed `keyframe_interval` or explicit `keyframe_ticks`
  - Record inventory/pointers: how to locate `FULL_SNAPSHOT` keyframes and `FRAME_DIFF` records (files, chunks, or URLs)
  - Integrity metadata: expected hashes and/or hash chain references for manifests/chunks
  - Render spec: present inline or via an explicit pointer (must match/extend `KERNEL_HELLO.render_spec`)

### LIVE
- Kernel streams diffs tick-by-tick (subject to diff policy)
- Snapshot used for join / recovery

Backpressure and slow-consumer rule (v0.1):
- If the kernel cannot deliver diffs in order due to backpressure, it MUST enter the defined recovery path: pause diff streaming, send a `FULL_SNAPSHOT` baseline at an authoritative recovery tick, then resume `FRAME_DIFF` ONLY AFTER the snapshot is applied. This avoids dropped ticks. If recovery fails (e.g., viewer non-compliant), the kernel MAY emit a fatal `ERROR` and require reconnect + resubscribe.

### REPLAY
- Kernel serves historical snapshots + diffs
- Replay uses the **same message types** as live execution
- Viewer learns the available tick window and keyframe policy via `REPLAY_READY`:
  - `available_start_tick`, `available_end_tick`
  - One of: `keyframe_interval` (fixed interval) OR `keyframe_ticks` (explicit list)
  - Optional `artifacts_manifest_url` (HTTP or content-addressable pointer) for fetching snapshots/diffs
- REPLAY diff semantics are explicit: `to_tick = from_tick + 1`. Diffs MUST be applied in ascending tick order. If chunking is introduced in a future version, it will use a new message type (e.g., `DIFF_CHUNK`) with explicit semantics; v0.1 does not allow implicit chunking.
- Chunking is an **artifact storage concern**. Regardless of file chunking, `FRAME_DIFF` semantics remain tick-to-tick transitions (`from_tick → to_tick`), and the viewer MUST apply them in order.
- **Protocol REPLAY**: `REPLAY_BEGIN`, `REPLAY_READY`, `REPLAY_SEEK` are control messages only.
- **Artifact replay**: snapshots/diffs are fetched as exported records; artifact organization (chunked `.jsonl`, indexes, integrity) is **not part of KVP-0001**.
  - Artifact organization is not part of the LIVE protocol surface of KVP-0001. However, for Sprint 14 offline compliance, the Export Appendix is normative and required.- 

v0.1 replay control is not negotiated via `SUBSCRIBE.stream`. Replay and seek are controlled via `REPLAY_BEGIN`/`REPLAY_SEEK`, and snapshots/diffs may be fetched via artifacts as indicated by `REPLAY_READY`.

Tick order MUST be preserved.  
Dropped ticks are invalid and require resync.
- If the viewer detects a gap, it must transition to `DESYNC_RECOVERY` and request a new baseline (or reconnect + resubscribe).

---

## 12. Canonicalization & Quantization (MANDATORY)

To make golden traces stable, the kernel MUST enforce:

1) **Canonical ordering** of arrays (by stable IDs / keys)  
2) **Float quantization** (default policy: `Q1E3` = round to 1e-3)  
3) **Stable identifiers** (IDs are primitives; no pointer identity)  
4) **Schema version included** in every snapshot and diff

If it cannot be canonicalized deterministically, it is not valid protocol behavior.

---

## 13. Full Snapshot

### Kernel → Viewer: `FULL_SNAPSHOT`

Payload shape is schema_version-specific.

Example A — sim4 legacy schema `"1"`:
```json
{
  "schema_version": "1",
  "tick": 0,
  "step_hash": "sim4_hash_0000",
  "state": {
    "rooms": [],
    "agents": [],
    "items": [],
    "events": []
  }
}
```

Example B — sim_sim schema `"sim_sim_1"`:
```json
{
  "schema_version": "sim_sim_1",
  "tick": 0,
  "step_hash": "sim_sim_hash_0000",
  "state": {
    "rooms": [],
    "agents": [],
    "objects": [],
    "events": []
  }
}
```

Rules:
- FULL_SNAPSHOT MUST contain only **kernel state** for subscribed channels.
- Presentation overlays (narrative, UI bubbles, psycho topology) are out-of-protocol export streams or separate rendering inputs, not kernel state.
- MUST be complete baseline for subscribed channels
- MUST be primitives-only
- MUST be canonicalized + quantized
- Defines canonical truth for viewer state reconstruction

Baseline sequencing (AAA):
- If `snapshot_policy = ON_JOIN`, this snapshot MUST be sent immediately after `SUBSCRIBED` and before any `FRAME_DIFF`.
- If `snapshot_policy = NEVER`, viewer MUST obtain a baseline via replay artifacts or the kernel MUST reject the subscription.

---

## 14. Frame Diff Stream

### Kernel → Viewer: `FRAME_DIFF`

Canonical schema is defined once in “Normative v0.1 Contract Surface”. This section adds rules and guidance only (no alternate schema):

Example A — sim4 legacy schema `"1"`:
```json
{
  "schema_version": "1",
  "from_tick": 0,
  "to_tick": 1,
  "prev_step_hash": "sim4_hash_0000",
  "step_hash": "sim4_hash_0001",
  "ops": [
    {
      "op": "UPSERT_AGENT",
      "agent": { "agent_id": 1, "room_id": 2 }
    }
  ]
}
```

Example B — sim_sim schema `"sim_sim_1"`:
```json
{
  "schema_version": "sim_sim_1",
  "from_tick": 0,
  "to_tick": 1,
  "prev_step_hash": "sim_sim_hash_0000",
  "step_hash": "sim_sim_hash_0001",
  "ops": [
    {
      "op": "UPSERT_AGENT",
      "agent": { "agent_id": 101, "room_id": 3 }
    }
  ]
}
```

Rules:
- MUST apply in order
- MUST assume a valid baseline
- MUST be replayable without loss
- Diff describes _transition_; snapshot describes _state_
- `to_tick` MUST equal `from_tick + 1` for LIVE tick mode (v0.1).
- `prev_step_hash` MUST match the previous known `step_hash` at `from_tick` (or the baseline snapshot hash if applying from a keyframe).
- `ops[]` MUST be applied **in order** as emitted.
- ops list order is canonical; changing it is a breaking change.
- Canonicalization constraints:
  - Kernel MUST emit ops in a deterministic order (define a stable sort tuple or specify “as-emitted is canonical, and kernel is responsible for stable emission”).

Apply semantics (v0.1 op enum table):
- UPSERT_ROOM / REMOVE_ROOM
- UPSERT_AGENT / REMOVE_AGENT
- UPSERT_ITEM / REMOVE_ITEM (optional if items not present; if absent, MUST NOT be emitted)
- UPSERT_EVENT / REMOVE_EVENT (event identity = (tick,event_id))

Note: Narrative/UI/psycho overlays are out-of-protocol in v0.1 (see Section 18) and MUST NOT appear in FRAME_DIFF.

**Supported diff policies (v0.1)**
- `DIFF_ONLY`
- `PERIODIC_SNAPSHOT`
- `SNAPSHOT_ON_DESYNC`

Policy affects delivery, **not simulation semantics**.

---

## 15. Viewer → Kernel Input (Commands, Not State)

### Viewer → Kernel: `INPUT_COMMAND`

```json
{
  "client_cmd_id": "uuid",
  "tick_target": 1210,
  "cmd": {
    "type": "WORLD_NUDGE",
    "payload": {
      "room_id": 7,
      "nudge_type": "LIGHTS_FLICKER",
      "strength": 0.2
    }
  }
}
```
Rules:
- Commands are validated, sanitized, and logged
- Kernel applies deterministically at `tick_target` (or rejects)
- Viewer MUST NOT send state mutations

Replay control in KVP v0.1 is expressed exclusively via `REPLAY_*` protocol messages. Replay-related commands inside `INPUT_COMMAND` are RESERVED and MUST NOT be used.

**Kernel responses**
- `COMMAND_ACCEPTED` `{ "client_cmd_id": "uuid" }`
- `COMMAND_REJECTED` `{ "client_cmd_id": "uuid", "reason": "..." }`

Accepted commands are part of the run history and MUST be replay-consistent.

---

## 16. Input Philosophy (Sim5/SimX)

Sim5 supports **indirect control only**.

Allowed categories:
- `WORLD_NUDGE`
- `DEBUG_PROBE`
- `REPLAY_CONTROL` — RESERVED in v0.1 (use `REPLAY_*` messages instead)
- (Optional hint) `VIEW_CONTROL` (non-authoritative; may be ignored)

Disallowed:
- direct movement control
- direct state mutation
- imperative scripting that changes determinism

Influence the world like weather, not like hands.

---

## 17. Replay Control (Same Protocol)

Replay uses the same protocol types as live.

### Viewer → Kernel: `REPLAY_BEGIN`

v0.1 decision (ARTIFACTS mode): when `delivery = ARTIFACTS`, the kernel MUST NOT stream FULL_SNAPSHOT or FRAME_DIFF records over the LIVE transport. The kernel sends control messages only (e.g., REPLAY_READY). The viewer fetches state records via artifacts/manifest.

Implementation note (Sim4 current): offline exports use `manifest.kvp.json` plus
`state/snapshots/` and `state/diffs/` (no `artifacts/manifest` sidecar).

Replay control messages are only valid in LIVE transports that support kernel-hosted replay. Sprint 14 artifacts mode uses no replay control messages; viewers discover tick windows and keyframes from the exported manifest.

```json
{
  "run_id": "uuid",
  "start_tick": 0,
  "end_tick": 20000,
  "delivery": "ARTIFACTS"
}
```

`delivery` clarifies how replay data is obtained in v0.1. `ARTIFACTS` means the viewer will fetch snapshots/diffs via artifact pointers/manifests (e.g., HTTP), not that diffs are chunked. Diff chunking is not allowed in v0.1.

v0.1 rule: decoders/validators MUST reject any `REPLAY_BEGIN.delivery` value other than `ARTIFACTS` (`CONTINUOUS` is reserved).

Kernel may respond `REPLAY_READY` indicating availability window.

### Viewer → Kernel: `REPLAY_SEEK`
```json
{
  "tick": 8500,
  "policy": "SNAPSHOT_THEN_DIFFS"
}
```
Replay MUST reproduce identical state as live execution given the same inputs.

---

## 18. Presentation Overlays (Out of Protocol)
- Narrative/UI bubbles and psycho topology are presentation overlays.
- They MUST NOT appear inside FULL_SNAPSHOT or FRAME_DIFF.
- They MUST NOT affect kernel determinism or kernel state.
- They MAY be delivered via:
  - Offline export streams (recommended)
  - Or separate tooling channels outside KVP-0001 (implementation-specific)

See: “KVP Replay Export Appendix v0.1” for X_UI_EVENT_BATCH, X_PSYCHO_FRAME stream formats and sampling rules.

---

## 19. Desync Detection & Recovery (Protocol-Defined)

“Viewer verifies stream correctness via tick continuity and payload validity.  
`step_hash` is kernel-provided metadata; hash _comparison_ is only performed when an external integrity reference exists (e.g., a manifest) or an explicitly implemented viewer-hash scheme is declared.”

### Viewer → Kernel: `DESYNC_REPORT`

- Viewer can always report `TICK_GAP`, `FROM_TICK_MISMATCH`, `INVALID_PAYLOAD`
- Viewer reports `EXTERNAL_HASH_MISMATCH` only if it has an external reference

```json
{
  "tick": 1201,
  "issue": "FROM_TICK_MISMATCH",
  "reference_step_hash": "def456",
  "last_applied_msg_id": "uuid",
  "viewer_state_token": "opaque-optional"
}
```

Fields (v0.1):
- `issue` (REQUIRED): discriminator for why desync is reported. Allowed values:
  - `TICK_GAP`
  - `FROM_TICK_MISMATCH`
  - `INVALID_PAYLOAD`
  - `EXTERNAL_HASH_MISMATCH`
- `reference_step_hash` (OPTIONAL): only present when `issue = EXTERNAL_HASH_MISMATCH`; refers to a hash computed or supplied by an external authority (e.g., manifest), not by the viewer.
- `last_applied_msg_id` (OPTIONAL): progress hint for kernel.
- `viewer_state_token` (OPTIONAL): opaque string for debugging; not required to be comparable.

**Kernel responses**
- `DESYNC_CONFIRMED` MUST include an authoritative `recovery_tick`.
  - LIVE mode: kernel MUST send a `FULL_SNAPSHOT(recovery_tick)` in-band over the live transport. Streaming of `FRAME_DIFF` MUST resume only AFTER that snapshot is applied. Viewer MUST perform a hard reset from the snapshot (forbid partial merges).
  - REPLAY ARTIFACTS mode: kernel MUST provide `recovery_tick` and, if available, a manifest/pointer compatible with `REPLAY_READY` (e.g., artifacts manifest URL). Viewer MUST fetch the `FULL_SNAPSHOT(recovery_tick)` via artifacts; the kernel MUST NOT stream snapshot/diffs in-band in ARTIFACTS mode.
- or `DESYNC_DENIED`

Desync recovery is protocol-defined, not viewer-defined. In all modes, the viewer MUST discard divergent local state and rebuild from the authoritative baseline at `recovery_tick`, then apply subsequent `FRAME_DIFF` in order (via live stream for LIVE mode; via artifacts fetch for ARTIFACTS mode).

---

## 20. Keepalive & Session Control

Optional but recommended:
- `PING` / `PONG` for keepalive (nonce echoed)
- `UNSUBSCRIBE` to end a stream by `stream_id`

If a session is terminated, kernel should send an `ERROR` (fatal) when possible.

---

## 21. Error Handling (Structured)

Kernel may emit:
- `WARN` (non-fatal)
- `ERROR` (fatal or non-fatal with explicit `fatal` flag)

Errors include:
- schema mismatch
- protocol violation (bad sequencing, invalid payload)
- determinism failure / invalid tick chain

Error payload shape (v0.1):
```json
{
  "code": "SCHEMA_MISMATCH",
  "message": "Viewer does not support engine=sim_sim schema_version=sim_sim_1",
  "fatal": true
}
```

---

## 21.1 Practical debugging checklist (LIVE)

In browser DevTools (WebSocket frames), verify this exact order:
- outgoing `VIEWER_HELLO` (Text frame)
- incoming `KERNEL_HELLO` (Text frame) with `engine_name` + `schema_version`
- outgoing `SUBSCRIBE` (Text frame)
- incoming `SUBSCRIBED` (Text frame)
- incoming baseline `FULL_SNAPSHOT` (Text frame)
- incoming per-step `FRAME_DIFF` (Text frame) as ticks advance

Operational checks:
- All KVP envelopes are JSON text frames (no binary message frames for protocol payloads).
- Leaving live mode (for example, “Exit to menu”) closes the WebSocket cleanly.

---

## 22. Testability Requirements (MANDATORY)

KVP-0001 mandates:
- golden snapshots
- golden diff streams
- canonical ordering rules
- float quantization rules
- CI parity checks (viewer replays traces deterministically)

If it cannot be tested deterministically, it is not valid protocol behavior.

---

## 23. Final Authority

KVP-0001 is **constitutional**.

- No viewer may bypass it
- No kernel change may ignore it
- No shortcut may undermine it

This spec is what makes Loopforge:
- engine-agnostic
- replay-native
- simulation-first
- forward portable

---

# Appendix A — Non‑Normative Viewer UI State Mapping (AAA guidance)

This appendix is non-normative. It maps protocol phases to suggested viewer UI states:

- HANDSHAKING: after connecting, during `VIEWER_HELLO`/`KERNEL_HELLO` exchange
- SUBSCRIBING: after sending `SUBSCRIBE`, awaiting `SUBSCRIBED`
- LOADING_BASELINE: awaiting required `FULL_SNAPSHOT` (per `snapshot_policy = ON_JOIN`) or fetching replay snapshot
- PLAYING: applying tick-by-tick `FRAME_DIFF` in order
- PAUSED: transport connected but not advancing (e.g., replay pause)
- SEEKING: performing `REPLAY_SEEK` and awaiting new baseline + diffs
- DESYNC_RECOVERY: after `DESYNC_CONFIRMED`, awaiting `FULL_SNAPSHOT(recovery_tick)` and hard reset
- ERROR_FATAL: unrecoverable error (e.g., schema mismatch)

Viewers should never render tick-dependent UI outside LOADING_BASELINE/PLAYING/PAUSED/SEEKING/DESYNC_RECOVERY.

**Handshake/session**
- `VIEWER_HELLO`
- `KERNEL_HELLO`
- `SUBSCRIBE`
- `SUBSCRIBED`
- `UNSUBSCRIBE`
- `PING`
- `PONG`

**State delivery**
- `FULL_SNAPSHOT`
- `FRAME_DIFF`

**Input**
- `INPUT_COMMAND`
- `COMMAND_ACCEPTED`
- `COMMAND_REJECTED`

**Replay**
- `REPLAY_BEGIN`
- `REPLAY_READY`
- `REPLAY_SEEK`
- `REPLAY_END`

**Debug/recovery**
- `DEBUG_PROBE`
- `DEBUG_PROBE_RESULT`
- `DESYNC_REPORT`
- `DESYNC_CONFIRMED`
- `DESYNC_DENIED`

**Errors**
- `WARN`
- `ERROR`

`X_*` message types are reserved for export stream records (offline sidecars) and are not valid protocol messages on LIVE transport.

---

# Appendix B — State Payload Invariants (Sprint 14.0A Locked)

These invariants apply to `FULL_SNAPSHOT` and `FRAME_DIFF`:

1) **`schema_version` REQUIRED** inside each state payload  
2) **Canonical ordering**:
   - agents sorted by `agent_id`
   - rooms sorted by `room_id`
   - items sorted by `item_id`
   - events sorted by `(tick, event_id)`
3) **Float quantization** default `Q1E3` across all viewer-facing floats  
4) **Diff apply rules**:
   - `FRAME_DIFF.from_tick` must equal viewer current tick
   - `to_tick = from_tick + 1` in live tick mode (unless explicitly chunked later)
5) **Channel gating**: kernel never sends unsubscribed channel data  
6) **No unsolicited state** before `SUBSCRIBED`

---

# Appendix C — Rust Reference (Traits + Payloads)

- `KernelHello.render_spec` is **REQUIRED**
- `FullSnapshot` / `FrameDiff` include `schema_version`
- `Subscribe.channels` treated as a set (duplicates invalid)
- `canonicalize()` must be applied before hashing, emitting, and golden trace comparison

## Appendix C.1 - Rust traits

---

```rust
//! KVP-0001 — Kernel ↔ Viewer Protocol (Rust traits)
//! Draft v0.1 — primitives-only, transport-agnostic, testable.
//!
//! Design goals:
//! - Kernel/viewer swap without code-sharing
//! - Deterministic kernel + diff stream
//! - Versioned envelope + schema version
//! - Works with JSON now; msgpack/protobuf later

use std::fmt::Debug;

pub type Tick = u64;

/// Protocol version (KVP) and integration schema version (your IntegrationSchemaVersion).
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ProtocolVersions {
    pub kvp_version: &'static str,    // e.g. "0.1"
    pub schema_version: &'static str, // e.g. "2"
}

/// Every message rides inside this envelope.
///
/// Payload is protocol-defined but transport/encoding-agnostic.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct Envelope<P> {
    pub kvp_version: &'static str, // "0.1"
    pub msg_type: MsgType,
    pub msg_id: MsgId,
    pub sent_at_ms: u64, // non-authoritative
    pub payload: P,
}

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub struct MsgId(pub String); // UUID string in v0.1

/// KVP-0001 message types (v0.1).
#[derive(Copy, Clone, Debug, PartialEq, Eq)]
pub enum MsgType {
    // Handshake/session
    ViewerHello,
    KernelHello,
    Subscribe,
    Subscribed,
    Unsubscribe,
    Ping,
    Pong,

    // State delivery
    FullSnapshot,
    FrameDiff,

    // Input
    InputCommand,
    CommandAccepted,
    CommandRejected,

    // Replay
    ReplayBegin,
    ReplayReady,
    ReplaySeek,
    ReplayEnd,

    // Debug/recovery
    DebugProbe,
    DebugProbeResult,
    DesyncReport,
    DesyncConfirmed,
    DesyncDenied,

    // Errors
    Warn,
    Error,
}

/// A strongly-typed view of messages.
/// Implementations typically use an enum with one variant per msg payload.
pub trait KvpMessage: Clone + Debug + Send + Sync + 'static {
    /// The message discriminator for this payload.
    fn msg_type(&self) -> MsgType;

    /// The protocol versions expected by this message (kvp + schema).
    fn versions(&self) -> ProtocolVersions;
}

/// Transport-agnostic frame interface.
///
/// WebSocket/TCP/etc implement this. No JSON assumptions here.
pub trait KvpTransport: Send {
    type Err: Debug + Send + Sync + 'static;

    /// Send raw bytes (already encoded).
    fn send(&mut self, bytes: &[u8]) -> Result<(), Self::Err>;

    /// Receive raw bytes (already encoded).
    /// Non-blocking transports may return Ok(None) when no frame is ready.
    fn recv(&mut self) -> Result<Option<Vec<u8>>, Self::Err>;
}

/// Encoding/decoding boundary.
///
/// Swap JSON for msgpack/protobuf later without changing kernel/viewer logic.
pub trait KvpCodec: Send + Sync {
    type Err: Debug + Send + Sync + 'static;

    /// The “wire” representation of any message payload set your app supports.
    type Wire: Clone + Debug + Send + Sync + 'static;

    fn encode(&self, msg: &Envelope<Self::Wire>) -> Result<Vec<u8>, Self::Err>;
    fn decode(&self, bytes: &[u8]) -> Result<Envelope<Self::Wire>, Self::Err>;
}

/// High-level handler for incoming messages.
///
/// You’ll usually implement this on the kernel side (viewer → kernel),
/// and separately on the viewer side (kernel → viewer).
pub trait KvpHandler<M>: Send
where
    M: KvpMessage,
{
    type Err: Debug + Send + Sync + 'static;

    fn on_message(&mut self, msg: Envelope<M>) -> Result<(), Self::Err>;
}

/// Optional: hook for desync recovery policies (snapshot-on-desync etc).
pub trait DesyncPolicy: Send {
    fn on_desync_report(&mut self, tick: Tick, expected: &str, got: &str);
}

/// Hashing contract: kernel provides step_hash per tick; viewer verifies.
pub trait StepHash: Send + Sync {
    /// Hash of the canonical resulting STATE at the boundary tick.
    /// Snapshot: hash at `tick`. Diff: hash at `to_tick` (after applying transition).
    fn step_hash(&self) -> &str;
}

/// Ordering + quantization rules are what make golden tests stable.
pub trait Canonicalize {
    /// Sort arrays, normalize float precision, enforce stable IDs, etc.
    fn canonicalize(&mut self);
}

/// --- Core domain payload traits (viewer-facing, primitives-only) ---

/// Full snapshot payload (baseline).
pub trait FullSnapshotPayload: KvpMessage + Canonicalize {
    fn tick(&self) -> Tick;
    fn step_hash(&self) -> &str;
}

/// Frame diff payload (tick-to-tick transition).
pub trait FrameDiffPayload: KvpMessage + Canonicalize {
    fn from_tick(&self) -> Tick;
    fn to_tick(&self) -> Tick;
    fn step_hash(&self) -> &str;
}

/// Viewer → Kernel input command payload.
pub trait InputCommandPayload: KvpMessage + Canonicalize {
    fn client_cmd_id(&self) -> &str;
    fn tick_target(&self) -> Tick;
}

/// Kernel response: accepted command.
pub trait CommandAcceptedPayload: KvpMessage {
    fn client_cmd_id(&self) -> &str;
}

/// Kernel response: rejected command.
pub trait CommandRejectedPayload: KvpMessage {
    fn client_cmd_id(&self) -> &str;
    fn reason(&self) -> &str;
}

/// Replay control payloads.
pub trait ReplayBeginPayload: KvpMessage {
    fn run_id(&self) -> &str;
    fn start_tick(&self) -> Tick;
    fn end_tick(&self) -> Tick;
}
pub trait ReplaySeekPayload: KvpMessage {
    fn tick(&self) -> Tick;
}

/// --- Session model traits ---

/// ViewerHello payload (capabilities + supported schema versions).
pub trait ViewerHelloPayload: KvpMessage {
    fn viewer_name(&self) -> &str;
    fn viewer_version(&self) -> &str;
    fn supported_schema_versions(&self) -> &[String];
}

/// KernelHello payload (identity + run seed + tick rate).
pub trait KernelHelloPayload: KvpMessage {
    fn engine_name(&self) -> &str;
    fn engine_version(&self) -> &str;
    fn schema_version(&self) -> &str;
    fn world_id(&self) -> &str;
    fn run_id(&self) -> &str;
    fn seed(&self) -> i64;
    fn tick_rate_hz(&self) -> u32;
}

/// Subscription payloads.
pub trait SubscribePayload: KvpMessage {
    fn stream(&self) -> &str; // "LIVE" only in v0.1; "REPLAY" is reserved for future versions
    fn channels(&self) -> &[String];
    fn diff_policy(&self) -> &str; // "DIFF_ONLY" etc
    fn snapshot_policy(&self) -> &str; // "ON_JOIN" etc
}
pub trait SubscribedPayload: KvpMessage {
    fn stream_id(&self) -> &str;
    fn effective_channels(&self) -> &[String];
    fn effective_diff_policy(&self) -> &str;
}

/// --- Engine-side contracts (kernel) ---

/// The kernel produces snapshots/diffs and consumes commands.
pub trait KernelApi<S, D, C>: Send
where
    S: FullSnapshotPayload,
    D: FrameDiffPayload,
    C: InputCommandPayload,
{
    type Err: Debug + Send + Sync + 'static;

    fn build_snapshot(&mut self, tick: Tick) -> Result<S, Self::Err>;
    fn build_diff(&mut self, from: Tick, to: Tick) -> Result<D, Self::Err>;

    /// Validate + sanitize command before deterministically applying.
    fn apply_command(&mut self, cmd: &C) -> Result<(), Self::Err>;
}

/// Viewer-side contract: consumes snapshots/diffs and renders, emits commands.
pub trait ViewerApi<S, D, C>: Send
where
    S: FullSnapshotPayload,
    D: FrameDiffPayload,
    C: InputCommandPayload,
{
    type Err: Debug + Send + Sync + 'static;

    fn on_snapshot(&mut self, snap: S) -> Result<(), Self::Err>;
    fn on_diff(&mut self, diff: D) -> Result<(), Self::Err>;

    /// Optional: viewer can request a command emission (UI nudge etc).
    fn poll_outgoing_command(&mut self) -> Result<Option<C>, Self::Err>;
}

/// --- A tiny “pump” loop skeleton (transport + codec + handler) ---

pub fn pump_wire<T, C, H>(
    transport: &mut T,
    codec: &C,
    handler: &mut H,
) -> Result<(), PumpError<T::Err, C::Err, H::Err>>
where
    T: KvpTransport,
    C: KvpCodec,
    H: KvpHandler<C::Wire>,
{
    if let Some(bytes) = transport.recv().map_err(PumpError::Transport)? {
        let env = codec.decode(&bytes).map_err(PumpError::Codec)?;
        handler.on_message(env).map_err(PumpError::Handler)?;
    }
    Ok(())
}

#[derive(Debug)]
pub enum PumpError<TE: Debug, CE: Debug, HE: Debug> {
    Transport(TE),
    Codec(CE),
    Handler(HE),
}
```

---

## Appendix C.2: Rust payload types

C.2 is NON-NORMATIVE. The canonical envelope definition lives in Section 3.

Envelope-first dispatch: the `Envelope.payload` is intentionally `serde_json::Value`; typed payload structs are decoded only after matching `msg_type` from the envelope. Wire format for examples is UTF-8 JSON.

This is a wire-layer convenience and remains compliant with the normative envelope.

Reserved/unsupported variants (v0.1): Reserved or unsupported enum variants may deserialize successfully but MUST be rejected by KVP v0.1 validation. Do not rely on serde skip to hide them on the wire.

---

```rust
//! KVP-0001 v0.1 — Concrete payload types (serde) + canonicalize()
//!
//! Goals:
//! - Concrete Rust structs/enums for v0.1 payloads
//! - serde derives for JSON/msgpack/protobuf evolution
//! - canonicalize(): stable ordering + float quantization for golden traces
//!
//! Notes:
//! - Payloads are "primitives-only": ints/floats/strings/bools/arrays/maps/structs
//! - Ordering rules:
//!   - agents sorted by agent_id
//!   - rooms sorted by room_id
//!   - items sorted by item_id
//!   - events sorted by (tick, event_id)
//! - Float quantization: round to 1e-3 by default (configurable if needed)

use serde::{Deserialize, Serialize};

pub type Tick = u64;

pub const KVP_VERSION_V0_1: &str = "0.1";

/// Schema version is your IntegrationSchemaVersion (string in v0.1).
/// Example: "2"
pub type SchemaVersion = String;

/// ---------------------------
/// Canonicalization utilities
/// ---------------------------

pub trait Canonicalize {
    fn canonicalize(&mut self);
}

/// Quantize a float to a fixed decimal precision for stable tests.
///
/// Default policy: 1e-3 (milliprecision) is usually enough for 2D coords.
/// If you need more, change Q to 1e-4 or 1e-5 consistently everywhere.
#[inline]
pub fn quantize_f32(x: f32) -> f32 {
    const Q: f32 = 1000.0;
    (x * Q).round() / Q
}

#[inline]
pub fn quantize_f64(x: f64) -> f64 {
    const Q: f64 = 1000.0;
    (x * Q).round() / Q
}

#[inline]
fn sort_by_key_stable<T, K: Ord, F: FnMut(&T) -> K>(v: &mut [T], mut f: F) {
    v.sort_by_key(|x| f(x));
}

/// ---------------------------
/// KVP envelope + wire message
/// ---------------------------

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Envelope {
    pub kvp_version: String, // "0.1"
    pub msg_type: MsgType,
    pub msg_id: String, // UUID as string
    pub sent_at_ms: u64,
    /// Raw wire value; decode based on msg_type only (never by shape)
    pub payload: serde_json::Value,
}

impl Canonicalize for Envelope {
    fn canonicalize(&mut self) {
        // Envelope fields are already stable; payload canonicalization happens
        // after it is decoded into a concrete type per msg_type.
    }
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum MsgType {
    // Handshake/session
    ViewerHello,
    KernelHello,
    Subscribe,
    Subscribed,
    Unsubscribe,
    Ping,
    Pong,

    // State delivery
    FullSnapshot,
    FrameDiff,

    // Input
    InputCommand,
    CommandAccepted,
    CommandRejected,

    // Replay
    ReplayBegin,
    ReplayReady,
    ReplaySeek,
    ReplayEnd,

    // Debug/recovery
    DebugProbe,
    DebugProbeResult,
    DesyncReport,
    DesyncConfirmed,
    DesyncDenied,

    // Errors
    Warn,
    Error,
}

/// Decoding pipeline (normative example):
/// 1) Deserialize Envelope (payload as serde_json::Value)
/// 2) Match envelope.msg_type and then deserialize payload to the corresponding struct
/// 3) Canonicalize the decoded payload (if applicable)
///
/// Example helper:
pub enum KvpIncoming {
    ViewerHello(ViewerHello),
    KernelHello(KernelHello),
    Subscribe(Subscribe),
    Subscribed(Subscribed),
    Unsubscribe(Unsubscribe),
    Ping(Ping),
    Pong(Pong),
    FullSnapshot(FullSnapshot),
    FrameDiff(FrameDiff),
    InputCommand(InputCommand),
    CommandAccepted(CommandAccepted),
    CommandRejected(CommandRejected),
    ReplayBegin(ReplayBegin),
    ReplayReady(ReplayReady),
    ReplaySeek(ReplaySeek),
    ReplayEnd(ReplayEnd),
    DebugProbe(DebugProbe),
    DebugProbeResult(DebugProbeResult),
    DesyncReport(DesyncReport),
    DesyncConfirmed(DesyncConfirmed),
    DesyncDenied(DesyncDenied),
    Warn(Warn),
    Error(ErrorMsg),
}

impl TryFrom<&Envelope> for KvpIncoming {
    type Error = serde_json::Error;
    fn try_from(env: &Envelope) -> Result<Self, Self::Error> {
        use MsgType::*;
        match env.msg_type {
            ViewerHello => Ok(KvpIncoming::ViewerHello(serde_json::from_value(env.payload.clone())?)),
            KernelHello => Ok(KvpIncoming::KernelHello(serde_json::from_value(env.payload.clone())?)),
            Subscribe => Ok(KvpIncoming::Subscribe(serde_json::from_value(env.payload.clone())?)),
            Subscribed => Ok(KvpIncoming::Subscribed(serde_json::from_value(env.payload.clone())?)),
            Unsubscribe => Ok(KvpIncoming::Unsubscribe(serde_json::from_value(env.payload.clone())?)),
            Ping => Ok(KvpIncoming::Ping(serde_json::from_value(env.payload.clone())?)),
            Pong => Ok(KvpIncoming::Pong(serde_json::from_value(env.payload.clone())?)),
            FullSnapshot => Ok(KvpIncoming::FullSnapshot(serde_json::from_value(env.payload.clone())?)),
            FrameDiff => Ok(KvpIncoming::FrameDiff(serde_json::from_value(env.payload.clone())?)),
            InputCommand => Ok(KvpIncoming::InputCommand(serde_json::from_value(env.payload.clone())?)),
            CommandAccepted => Ok(KvpIncoming::CommandAccepted(serde_json::from_value(env.payload.clone())?)),
            CommandRejected => Ok(KvpIncoming::CommandRejected(serde_json::from_value(env.payload.clone())?)),
            ReplayBegin => Ok(KvpIncoming::ReplayBegin(serde_json::from_value(env.payload.clone())?)),
            ReplayReady => Ok(KvpIncoming::ReplayReady(serde_json::from_value(env.payload.clone())?)),
            ReplaySeek => Ok(KvpIncoming::ReplaySeek(serde_json::from_value(env.payload.clone())?)),
            ReplayEnd => Ok(KvpIncoming::ReplayEnd(serde_json::from_value(env.payload.clone())?)),
            DebugProbe => Ok(KvpIncoming::DebugProbe(serde_json::from_value(env.payload.clone())?)),
            DebugProbeResult => Ok(KvpIncoming::DebugProbeResult(serde_json::from_value(env.payload.clone())?)),
            DesyncReport => Ok(KvpIncoming::DesyncReport(serde_json::from_value(env.payload.clone())?)),
            DesyncConfirmed => Ok(KvpIncoming::DesyncConfirmed(serde_json::from_value(env.payload.clone())?)),
            DesyncDenied => Ok(KvpIncoming::DesyncDenied(serde_json::from_value(env.payload.clone())?)),
            Warn => Ok(KvpIncoming::Warn(serde_json::from_value(env.payload.clone())?)),
            Error => Ok(KvpIncoming::Error(serde_json::from_value(env.payload.clone())?)),
        }
    }
}

/// ---------------------------
/// Handshake/session payloads
/// ---------------------------

/// RenderSpec (REQUIRED in v0.1): viewer contract for coordinate system, projection, draw ordering.
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct RenderSpec {
    pub coord_system: CoordSystem,
    pub projection: ProjectionSpec,
    pub z_layer: ZLayerSpec,
    pub draw_order: DrawOrderSpec,
    pub local_sort_key: LocalSortKeySpec,
    pub asset_resolution: AssetResolutionSpec,
}

impl Canonicalize for RenderSpec {
    fn canonicalize(&mut self) {
        // draw_order arrays are stable by their string order (already stable)
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct CoordSystem {
    pub units: String,             // e.g., "WORLD_UNITS"
    pub units_per_tile: f32,       // recommended tile size if gridlike
    pub axis: AxisSpec,
    pub origin: Vec2F32,
    pub bounds: BoundsF32,         // MUST be present
}

impl Canonicalize for CoordSystem {
    fn canonicalize(&mut self) {
        self.units_per_tile = quantize_f32(self.units_per_tile);
        self.origin.canonicalize();
        self.bounds.canonicalize();
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct AxisSpec {
    pub x_positive: String, // "EAST"/"WEST"
    pub y_positive: String, // "NORTH"/"SOUTH"
}

impl Canonicalize for AxisSpec { fn canonicalize(&mut self) {} }

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct BoundsF32 {
    pub min_x: f32,
    pub min_y: f32,
    pub max_x: f32,
    pub max_y: f32,
}

impl Canonicalize for BoundsF32 {
    fn canonicalize(&mut self) {
        self.min_x = quantize_f32(self.min_x);
        self.min_y = quantize_f32(self.min_y);
        self.max_x = quantize_f32(self.max_x);
        self.max_y = quantize_f32(self.max_y);
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct ProjectionSpec {
    pub kind: String,                    // "ISOMETRIC_2_5D" | "ORTHO_2D"
    pub recommended_iso_tile_w: Option<i32>,
    pub recommended_iso_tile_h: Option<i32>,
}

impl Canonicalize for ProjectionSpec { fn canonicalize(&mut self) {} }

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct ZLayerSpec {
    pub meaning: String,           // "DRAW_STACK_HINT"
    pub stable_across_run: bool,   // MUST be true for v0.1
    pub notes: Option<String>,
}

impl Canonicalize for ZLayerSpec { fn canonicalize(&mut self) {} }

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct DrawOrderSpec {
    pub rooms: Vec<String>,   // e.g., ["Z_LAYER", "ROOM_ID"]
    pub agents: Vec<String>,  // e.g., ["ROOM_ID", "LOCAL_SORT_KEY", "AGENT_ID"]
    pub items: Vec<String>,   // e.g., ["ROOM_ID", "LOCAL_SORT_KEY", "ITEM_ID"]
}

impl Canonicalize for DrawOrderSpec { fn canonicalize(&mut self) {} }

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct LocalSortKeySpec {
    pub source: String,        // "WORLD_Y"
    pub quantization: String,  // "Q1E3"
    pub direction: String,     // "ASC" | "DESC"
    pub notes: Option<String>,
}

impl Canonicalize for LocalSortKeySpec { fn canonicalize(&mut self) {} }

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct AssetResolutionSpec {
    pub policy: String,               // "MANIFEST_OR_PRIMITIVE_FALLBACK"
    pub missing_ref_behavior: String, // "DRAW_PRIMITIVE"
}

impl Canonicalize for AssetResolutionSpec { fn canonicalize(&mut self) {} }

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct ViewerHello {
    pub viewer_name: String,
    pub viewer_version: String,
    pub supported_schema_versions: Vec<String>,
    pub supports: ViewerSupports,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct ViewerSupports {
    pub diff_stream: bool,
    pub full_snapshot: bool,
    pub replay_seek: bool,
}

impl Canonicalize for ViewerHello {
    fn canonicalize(&mut self) {
        // Keep schema versions stable (lex sort).
        self.supported_schema_versions.sort();
    }
}
impl Canonicalize for ViewerSupports {
    fn canonicalize(&mut self) {}
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct KernelHello {
    pub engine_name: String,    // "sim4" | "simx"
    pub engine_version: String, // semver or git sha
    pub schema_version: String, // IntegrationSchemaVersion as string
    pub world_id: String,       // uuid
    pub run_id: String,         // uuid
    pub seed: i64,
    pub tick_rate_hz: u32,
    pub time_origin_ms: u64,
    pub render_spec: RenderSpec,
}

impl Canonicalize for KernelHello {
    fn canonicalize(&mut self) {
        self.render_spec.canonicalize();
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Subscribe {
    pub stream: StreamMode, // LIVE only in v0.1 (REPLAY reserved for future versions)
    pub channels: Vec<Channel>,
    pub diff_policy: DiffPolicy,
    pub snapshot_policy: SnapshotPolicy,
    pub compression: Compression,
}

impl Canonicalize for Subscribe {
    fn canonicalize(&mut self) {
        // Stable channel ordering
        self.channels.sort();
    }
}

impl Subscribe {
    /// v0.1 validation: only LIVE is permitted
    pub fn validate_v0_1(&self) -> Result<(), &'static str> {
        use std::collections::HashSet;

        // Stream mode check
        if !matches!(self.stream, StreamMode::Live) {
            return Err("StreamMode=REPLAY is reserved in KVP-0001 v0.1; SUBSCRIBE.stream must be LIVE");
        }

        // Non-empty channels
        if self.channels.is_empty() {
            return Err("Subscribe.channels must be non-empty in v0.1");
        }

        // Set semantics: no duplicates
        let mut set = HashSet::new();
        for ch in &self.channels {
            if !set.insert(ch) {
                return Err("Subscribe.channels contains duplicates; channels are a set in v0.1");
            }
        }

        // Known-channel-only is enforced by enum deserialization; no runtime check needed here.

        Ok(())
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Subscribed {
    pub stream_id: String, // uuid
    pub effective_stream: StreamMode,
    pub effective_channels: Vec<Channel>,
    pub effective_diff_policy: DiffPolicy,
    pub effective_snapshot_policy: SnapshotPolicy,
    pub effective_compression: Compression,
}

impl Canonicalize for Subscribed {
    fn canonicalize(&mut self) {
        self.effective_channels.sort();
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Unsubscribe {
    pub stream_id: String,
}

impl Canonicalize for Unsubscribe {
    fn canonicalize(&mut self) {}
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Ping {
    pub nonce: u64,
}
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Pong {
    pub nonce: u64,
}
impl Canonicalize for Ping {
    fn canonicalize(&mut self) {}
}
impl Canonicalize for Pong {
    fn canonicalize(&mut self) {}
}

#[derive(
    Copy, Clone, Debug, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord, Hash,
)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Channel {
    World,
    Agents,
    Items,
    Events,
    Debug,
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum StreamMode {
    /// LIVE is the only valid Subscribe.stream in v0.1
    Live,
    /// Replay is RESERVED for future versions; not negotiated via SUBSCRIBE in v0.1.
    /// Note: This variant may deserialize but MUST be rejected by v0.1 validators.
    Replay,
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum DiffPolicy {
    DiffOnly,
    PeriodicSnapshot,
    SnapshotOnDesync,
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum SnapshotPolicy {
    OnJoin,
    Never,
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Compression {
    None,
    // Future: Lz4, Zstd, etc.
}

/// ---------------------------
/// Viewer-facing world model
/// (primitives-only, minimal v0.1)
/// ---------------------------

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct WorldSnapshot {
    pub rooms: Vec<RoomSnapshot>,
    pub zones: Vec<ZoneSnapshot>,
    pub static_assets: Vec<StaticAssetSnapshot>,
}

impl Canonicalize for WorldSnapshot {
    fn canonicalize(&mut self) {
        sort_by_key_stable(&mut self.rooms, |r| r.room_id);
        for r in &mut self.rooms {
            r.canonicalize();
        }
        sort_by_key_stable(&mut self.zones, |z| z.zone_id);
        for z in &mut self.zones {
            z.canonicalize();
        }
        sort_by_key_stable(&mut self.static_assets, |a| a.asset_id);
        for a in &mut self.static_assets {
            a.canonicalize();
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct RoomSnapshot {
    pub room_id: i32,
    pub name: String,
    pub zone_id: i32,
    pub bounds: RectF32, // 2D for viewer
    pub occupancy: i32,
    pub tension: f32, // example scalar (0..1)
}

impl Canonicalize for RoomSnapshot {
    fn canonicalize(&mut self) {
        self.bounds.canonicalize();
        self.tension = quantize_f32(self.tension);
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct ZoneSnapshot {
    pub zone_id: i32,
    pub name: String,
}

impl Canonicalize for ZoneSnapshot {
    fn canonicalize(&mut self) {}
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct StaticAssetSnapshot {
    pub asset_id: i32,
    pub kind: String, // "lamp", "bench", etc.
    pub room_id: i32,
    pub pos: Vec2F32,
}

impl Canonicalize for StaticAssetSnapshot {
    fn canonicalize(&mut self) {
        self.pos.canonicalize();
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct AgentSnapshot {
    pub agent_id: i32,
    pub room_id: Option<i32>,
    pub pos: Vec2F32,
    pub facing_deg: f32,
    pub public_state: AgentPublicState,
}

impl Canonicalize for AgentSnapshot {
    fn canonicalize(&mut self) {
        self.pos.canonicalize();
        self.facing_deg = quantize_f32(self.facing_deg);
        self.public_state.canonicalize();
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct AgentPublicState {
    pub label: String,     // display name
    pub mood: f32,         // -1..1
    pub energy: f32,       // 0..1
    pub speaking: bool,    // UI hint
    pub emote: Option<String>, // "anxious", "curious", etc.
}

impl Canonicalize for AgentPublicState {
    fn canonicalize(&mut self) {
        self.mood = quantize_f32(self.mood);
        self.energy = quantize_f32(self.energy);
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct ItemSnapshot {
    pub item_id: i32,
    pub kind: String,
    pub room_id: Option<i32>,
    pub pos: Option<Vec2F32>,
    pub state: String, // "idle", "broken", etc.
}

impl Canonicalize for ItemSnapshot {
    fn canonicalize(&mut self) {
        if let Some(p) = &mut self.pos {
            p.canonicalize();
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct EventSnapshot {
    pub tick: Tick,
    pub event_id: i32,
    pub kind: String,
    pub room_id: Option<i32>,
    pub severity: f32,
}

impl Canonicalize for EventSnapshot {
    fn canonicalize(&mut self) {
        self.severity = quantize_f32(self.severity);
    }
}

// Narrative/UI/psycho overlays are out of protocol in v0.1; no in-band types here.

/// Simple geometry primitives (viewer-only)
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Vec2F32 {
    pub x: f32,
    pub y: f32,
}
impl Canonicalize for Vec2F32 {
    fn canonicalize(&mut self) {
        self.x = quantize_f32(self.x);
        self.y = quantize_f32(self.y);
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct RectF32 {
    pub x: f32,
    pub y: f32,
    pub w: f32,
    pub h: f32,
}
impl Canonicalize for RectF32 {
    fn canonicalize(&mut self) {
        self.x = quantize_f32(self.x);
        self.y = quantize_f32(self.y);
        self.w = quantize_f32(self.w);
        self.h = quantize_f32(self.h);
    }
}

/// ---------------------------
/// State delivery payloads
/// ---------------------------

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct FullSnapshot {
    pub schema_version: SchemaVersion,
    pub tick: Tick,
    pub step_hash: String,
    pub world: WorldSnapshot,
    pub agents: Vec<AgentSnapshot>,
    pub items: Vec<ItemSnapshot>,
    pub events: Vec<EventSnapshot>,
}

impl Canonicalize for FullSnapshot {
    fn canonicalize(&mut self) {
        self.world.canonicalize();

        sort_by_key_stable(&mut self.agents, |a| a.agent_id);
        for a in &mut self.agents {
            a.canonicalize();
        }

        sort_by_key_stable(&mut self.items, |i| i.item_id);
        for i in &mut self.items {
            i.canonicalize();
        }

        // events stable by (tick, event_id)
        self.events.sort_by_key(|e| (e.tick, e.event_id));
        for e in &mut self.events {
            e.canonicalize();
        }

    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct FrameDiff {
    pub schema_version: SchemaVersion,
    pub from_tick: Tick,
    pub to_tick: Tick,
    pub prev_step_hash: String,
    pub step_hash: String,
    pub ops: Vec<DiffOp>,
}

impl Canonicalize for FrameDiff {
    fn canonicalize(&mut self) {
        // ops are applied as-emitted; canonicalization applies to inner snapshots
        for op in &mut self.ops {
            op.canonicalize();
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(tag = "op", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum DiffOp {
    UpsertRoom { room: RoomSnapshot },
    RemoveRoom { room_id: i32 },
    UpsertAgent { agent: AgentSnapshot },
    RemoveAgent { agent_id: i32 },
    UpsertItem { item: ItemSnapshot },
    RemoveItem { item_id: i32 },
    UpsertEvent { event: EventSnapshot },
    RemoveEvent { event: EventKey },
}

impl DiffOp {
    fn canonicalize(&mut self) {
        match self {
            DiffOp::UpsertRoom { room } => room.canonicalize(),
            DiffOp::UpsertAgent { agent } => agent.canonicalize(),
            DiffOp::UpsertItem { item } => item.canonicalize(),
            DiffOp::UpsertEvent { event } => event.canonicalize(),
            _ => {}
        }
    }
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
pub struct EventKey {
    pub tick: Tick,
    pub event_id: i32,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct AgentMove {
    pub agent_id: i32,
    pub from_room_id: Option<i32>,
    pub to_room_id: Option<i32>,
    pub from_pos: Vec2F32,
    pub to_pos: Vec2F32,
}

impl Canonicalize for AgentMove {
    fn canonicalize(&mut self) {
        self.from_pos.canonicalize();
        self.to_pos.canonicalize();
    }
}

/// ---------------------------
/// Input + command responses
/// ---------------------------

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct InputCommand {
    pub client_cmd_id: String,
    pub tick_target: Tick,
    pub cmd: Command,
}

impl Canonicalize for InputCommand {
    fn canonicalize(&mut self) {
        self.cmd.canonicalize();
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type", content = "payload", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Command {
    WorldNudge(WorldNudge),
    DebugProbe(DebugProbe),
    ViewControl(ViewControl),
}

impl Canonicalize for Command {
    fn canonicalize(&mut self) {
        match self {
            Command::WorldNudge(x) => x.canonicalize(),
            Command::DebugProbe(x) => x.canonicalize(),
            Command::ViewControl(x) => x.canonicalize(),
        }
    }
}

/// Your “indirect god” influence command.
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct WorldNudge {
    pub nudge_type: String, // "LIGHTS_FLICKER"
    pub room_id: i32,
    pub strength: f32, // 0..1
}

impl Canonicalize for WorldNudge {
    fn canonicalize(&mut self) {
        self.strength = quantize_f32(self.strength);
    }
}

/// Debug probe command (viewer asks kernel for an entity/room state).
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct DebugProbe {
    pub probe_id: String, // uuid
    pub target: ProbeTarget,
}

impl Canonicalize for DebugProbe {
    fn canonicalize(&mut self) {}
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(tag = "kind", content = "id", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ProbeTarget {
    Agent(i32),
    Room(i32),
    Item(i32),
}

// Replay control is expressed via top-level REPLAY_* protocol messages in v0.1.
// No command variant is provided for replay control in v0.1.

/// ViewControl is a hint; kernel may ignore (no determinism impact).
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct ViewControl {
    pub hint: String, // "FOCUS_AGENT"
    pub agent_id: Option<i32>,
}

impl Canonicalize for ViewControl {
    fn canonicalize(&mut self) {}
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct CommandAccepted {
    pub client_cmd_id: String,
}

impl Canonicalize for CommandAccepted {
    fn canonicalize(&mut self) {}
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct CommandRejected {
    pub client_cmd_id: String,
    pub reason: String,
}

impl Canonicalize for CommandRejected {
    fn canonicalize(&mut self) {}
}

/// ---------------------------
/// Replay payloads
/// ---------------------------

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct ReplayBegin {
    pub run_id: String,
    pub start_tick: Tick,
    pub end_tick: Tick,
    pub delivery: ReplayDelivery,
}

impl Canonicalize for ReplayBegin {
    fn canonicalize(&mut self) {}
}

impl ReplayBegin {
    /// v0.1 validation: only ARTIFACTS delivery is permitted
    pub fn validate_v0_1(&self) -> Result<(), &'static str> {
        match self.delivery {
            ReplayDelivery::Artifacts => Ok(()),
            _ => Err("ReplayDelivery=CONTINUOUS is reserved in KVP-0001 v0.1; delivery must be ARTIFACTS"),
        }
    }
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ReplayDelivery {
    /// ARTIFACTS = viewer fetches snapshots/diffs via external artifacts (e.g., HTTP)
    /// Note: unrelated to diff chunking; v0.1 diffs are per-tick only.
    Artifacts,
    /// RESERVED/FUTURE: not used in v0.1. If introduced, semantics MUST be defined explicitly.
    /// Note: This variant may deserialize but MUST be rejected by v0.1 validators.
    Continuous,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct ReplayReady {
    pub run_id: String,
    pub available_start_tick: Tick,
    pub available_end_tick: Tick,
    /// Either a fixed interval or an explicit list of keyframe ticks
    pub keyframe_interval: Option<u64>,
    pub keyframe_ticks: Option<Vec<Tick>>,
    /// Optional pointer to an artifacts manifest (e.g., HTTP URL)
    pub artifacts_manifest_url: Option<String>,
}

impl Canonicalize for ReplayReady {
    fn canonicalize(&mut self) {
        if let Some(v) = &mut self.keyframe_ticks {
            v.sort();
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct ReplaySeek {
    pub tick: Tick,
    pub policy: ReplaySeekPolicy,
}

impl Canonicalize for ReplaySeek {
    fn canonicalize(&mut self) {}
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ReplaySeekPolicy {
    SnapshotThenDiffs,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct ReplayEnd {
    pub run_id: String,
}

impl Canonicalize for ReplayEnd {
    fn canonicalize(&mut self) {}
}

/// ---------------------------
/// Debug + desync payloads
/// ---------------------------

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct DebugProbeResult {
    pub probe_id: String,
    pub ok: bool,
    pub json: Option<String>, // v0.1 escape hatch; later make structured
}

impl Canonicalize for DebugProbeResult {
    fn canonicalize(&mut self) {}
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct DesyncReport {
    pub tick: Tick,
    pub issue: DesyncIssue,
    pub reference_step_hash: Option<String>,
    pub last_applied_msg_id: Option<String>,
    pub last_applied_from_tick: Option<Tick>,
    pub last_applied_to_tick: Option<Tick>,
    pub viewer_state_token: Option<String>,
}

impl Canonicalize for DesyncReport {
    fn canonicalize(&mut self) {}
}

#[derive(Copy, Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum DesyncIssue {
    TickGap,
    FromTickMismatch,
    InvalidPayload,
    ExternalHashMismatch,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct DesyncConfirmed {
    pub recovery_tick: Tick,
    pub message: String,
}

impl Canonicalize for DesyncConfirmed {
    fn canonicalize(&mut self) {}
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct DesyncDenied {
    pub tick: Tick,
    pub message: String,
}

impl Canonicalize for DesyncDenied {
    fn canonicalize(&mut self) {}
}

/// ---------------------------
/// Errors
/// ---------------------------

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Warn {
    pub code: String,
    pub message: String,
}

impl Canonicalize for Warn {
    fn canonicalize(&mut self) {}
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct ErrorMsg {
    pub code: String,
    pub message: String,
    pub fatal: bool,
}

impl Canonicalize for ErrorMsg {
    fn canonicalize(&mut self) {}
}

/// ---------------------------
/// Convenience: build an envelope
/// ---------------------------

pub fn make_envelope(msg_type: MsgType, payload: serde_json::Value, msg_id: String, sent_at_ms: u64) -> Envelope {
    Envelope {
        kvp_version: KVP_VERSION_V0_1.to_string(),
        msg_type,
        msg_id,
        sent_at_ms,
        payload,
    }
}
```
- v0.1 validation rules (MUST):
  - `channels` MUST be non-empty.
  - `channels` MUST contain no duplicates (set semantics).
  - `channels` MUST contain only known `Channel` enum values; unknown → reject.
