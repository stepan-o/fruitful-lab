# canonicalization.md — KVP-0001 v0.1
## Canonicalization & Hashing (Normative)

**Status:** Locked (v0.1, Option A)  
**Applies to:** Producers (kernel/exporters), fixtures, conformance suite; consumers validate (and may recompute in tests)  
**Goal:** Make golden traces stable across platforms/languages and make `step_hash` *semantically meaningful*.

> **Constitutional rule:**  
> If you cannot canonicalize deterministically, it is **not valid protocol behavior**.

---

## 0) Scope & Canonical State Definition (Normative)

In **KVP-0001 v0.1 (Option A)**, the **canonical state** is defined as:

```json
{
  "world": { ... },
  "agents": [ ... ],
  "items": [ ... ],
  "events": [ ... ]
}
```
This object — after canonicalization — is the **only input** to `step_hash`.

### Explicit exclusions
The following MUST NOT affect canonical state or hashing:
- overlays (UI events, psycho topology)
- render_spec
- manifest metadata
- envelope fields (`msg_id`, `sent_at_ms`, etc.)

---

## 1) Canonicalization Pipeline (Normative)

For any viewer-facing record payload that contributes to determinism, canonicalization MUST be applied in this order:

1. **Schema validation** (reject if invalid)
2. **Drop/ignore unknown fields** (direction-specific; see §8)
3. **Normalize numeric types** (integers vs floats; see §4)
4. **Float quantization** (Q1E3; see §3)
5. **Canonical ordering** of collections (see §2)
6. **Canonical JSON bytes** (for hashing only; see §6)
7. **Compute hashes** (`step_hash`, file SHA-256; see §7)

**Producer rule:** exporters MUST emit payloads already canonicalized.  
**Consumer rule:** viewers MAY canonicalize for validation/debug, but MUST treat producer output as authoritative.

---

## 2) Canonical Ordering Rules (Normative)

### 2.1 General Rules
- Arrays that represent **sets** MUST be deterministically ordered.
- Arrays that represent **ordered operations** MUST preserve emitted order.
- Objects/maps: semantic ordering irrelevant; hashing uses JCS ordering (§6).

---

### 2.2 FULL_SNAPSHOT Ordering (v0.1)

A `FULL_SNAPSHOT` payload MUST satisfy:

#### World
- `world.rooms[]` sorted by `room_id` ascending
- `world.zones[]` sorted by `zone_id` ascending (if present)
- `world.static_assets[]` sorted by `asset_id` ascending (if present)

#### Agents / Items
- `agents[]` sorted by `agent_id` ascending
- `items[]` sorted by `item_id` ascending

#### Events
- `events[]` sorted by `(tick, event_id)` ascending

> If a channel is unsubscribed or omitted, it does not participate in ordering or hashing.

---

### 2.3 FRAME_DIFF Ordering (v0.1)

A `FRAME_DIFF` payload MUST satisfy:

- `ops[]` order is **canonical as-emitted**
- Producers MUST emit `ops[]` in deterministic order
- Consumers MUST apply ops **strictly in array order**

**Recommended deterministic emission (non-binding):**
- Removals before upserts, or
- Stable tuple ordering by `(op_kind, entity_id)`

> v0.1 forbids consumer-side reordering of `ops[]`.

---

### 2.4 Overlay Ordering (v0.1)
Overlays are canonicalized independently of state:

- `X_UI_EVENT_BATCH.events[]` sorted by `(tick, event_id)`
- `X_PSYCHO_FRAME.nodes[]` sorted by `id`
- `X_PSYCHO_FRAME.edges[]` sorted by `(src_id, dst_id, kind)`

---

## 3) Float Quantization (Normative)

### 3.1 Policy
**Q1E3** — round to nearest 1e-3.

Applied to **all viewer-facing floats** that influence:
- state equality
- step hashing
- fixture stability

### 3.2 Quantization Function
For float `x`:
```text
q = round_half_away_from_zero(x * 1000) / 1000
```

---

### 3.3 Mandatory Test Vectors
| Input   | 	Output |
|---------|---------|
| 0.0001  | 	0.000  |
| 0.1234  | 	0.123  |
| 0.1235  | 	0.124  |
| −0.1235 | 	−0.124 |
| 1.0004  | 	1.000  |
| 1.0005  | 	1.001  |

All implementations MUST match these exactly.

---

## 4) Numeric Normalization (Normative)

---

### 4.1 Integers vs Floats
- Integer-typed fields MUST be encoded as integers.
- Float-typed fields MUST be JSON numbers and quantized (§3).

---

### 4.2 NaN / Infinity
- NaN and ±Infinity are **forbidden**
- Producers MUST reject/sanitize
- Consumers MUST reject if detected

---

## 5) Stable Identifiers (Normative)

### 5.1 Entity Identity
All entities MUST be referenced by stable scalar IDs:
- `room_id`, `agent_id`, `item_id`, `event_id`, etc.

No pointer identity is permitted.

### 5.2 msg_id Determinism
- `msg_id` MUST be deterministic (e.g., UUIDv5 from stable inputs)
- `sent_at_ms` MUST be `0` in offline artifacts

---

## 6) Canonical JSON Bytes (Normative)

### 6.1 Canonicalization Scheme
Canonical bytes MUST be produced using:

- UTF-8 JSON (no BOM)
- RFC 8785 **JCS**
  - lexicographic member ordering
  - deterministic number formatting
  - no insignificant whitespace

### 6.2 Hash Scope (v0.1)

`step_hash` bytes are computed over:

```text
canonical_json(
  {
    world,
    agents,
    items,
    events
  }
)
```
after:
- schema validation
- unknown field handling
- numeric normalization
- float quantization
- canonical ordering

---

## 7) Hashing (Normative)

### 7.1 step_hash
- Algorithm: SHA-256
- Encoding: lowercase hex

Boundary semantics:
- `FULL_SNAPSHOT.step_hash` → state at `tick`
- `FRAME_DIFF.step_hash` → state at `to_tick`

### 7.2 File Hashes
- SHA-256 of raw file bytes
- Used for CI parity only
- Distinct from `step_hash`

### 7.3 Hash Chain
- `FRAME_DIFF.prev_step_hash` MUST equal prior boundary hash
- First diff after snapshot MUST reference snapshot hash

---

## 8) Unknown Fields & Directionality (Normative)

### 8.1 Producer — Strict
- MUST NOT emit unknown fields
- Schema changes require canon updates

### 8.2 Consumer — Tolerant
- Unknown `msg_type` → reject
- Unknown enum variant → reject
- Unknown object fields → ignore
- Ignored fields MUST NOT affect hashing or ordering

---

## 9) FRAME_DIFF Ops Canonicalization (Normative)

### 9.1 Op Ordering
- `ops[]` order is canonical and authoritative

### 9.2 Op Payloads
Each op’s embedded payload MUST itself be canonicalized:
- sort nested arrays
- quantize floats
- reject NaN/Infinity

### 9.3 Event Identity
Event identity key: `(tick, event_id)`

---

## 10) Render Spec Canonicalization (Normative)

`render_spec` is REQUIRED but **non-authoritative**.

- Quantize floats Q1E3
- Canonicalize arrays if they represent sets
- MUST NOT participate in `step_hash`

---

## 11) Conformance Requirements (Mandatory)

The conformance suite MUST verify:

- Float quantization matches test vectors
- Snapshot ordering rules
- `ops[]` preserved exactly
- Hash chain continuity
- step_hash equals reference
- NaN/Infinity rejection
- Producer strict / consumer tolerant behavior

---

## 12) Migration Note — v0.1b Legacy Fixtures (Non-Normative but Binding)

### Status
Fixtures that encode:
```json
payload.state = { ... }
```

and use `FRAME_DIFF` as **state replacement** are **NOT KVP-0001 Option A compliant**.

### Classification
These fixtures are classified as:
> v0.1b — Deprecated Prototype Fixtures

They exist only to support early tooling and MUST NOT:
- be extended
- be used for conformance
- be used as normative examples

### Required migration
- Replace state-blob fixtures with:
  - FULL_SNAPSHOT(world/agents/items/events)
  - FRAME_DIFF(ops[])
- OR introduce a new msg_type (e.g., FRAME_STATE) and remove misuse of FRAME_DIFF.

Once Option A fixtures land, v0.1b fixtures are removed from CI.

---

## 13) Open Items (Lock Before v0.2)

- [ ] Confirm event inclusion/exclusion in minimal snapshots
- [ ] Finalize op taxonomy (`UPSERT`, `REMOVE`, etc.)
- [ ] Decide whether partial channel snapshots are allowed
- [ ] Lock schema_version evolution rules

---

### One-Sentence Constitutional Reminder
**If two independent implementations cannot produce identical `step_hash` values for the same tick, the protocol is broken — not the viewer.**