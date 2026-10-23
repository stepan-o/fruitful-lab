## The Million-Dollar Plan v1.0
**North Star:** *KVP-0001 is constitutional.* Therefore **Option A**: exporters + fixtures + WEBVIEW contract **must match** `FULL_SNAPSHOT(world/agents/items/events)` and `FRAME_DIFF(ops[])`.  
Any “state replacement” is a **new msg_type**, never a reinterpretation of `FRAME_DIFF`.

**Implementation status (this repo, Feb 2026):**
- Offline exporter is implemented in `backend/sim4/integration/export_state.py` and writes
  `FULL_SNAPSHOT` plus `FRAME_DIFF` **with full-state payloads** (not ops yet).
- Canonicalization + hashing are implemented (`canonicalize.py`, `jcs.py`, `step_hash.py`).
- Host orchestration is in `backend/sim4/host/sim_runner.py` (runtime → snapshot → integration).
- Live transport scaffolding exists (`live_session.py`, `live_sink.py`) but is minimal.

---

## 0) Canon: One Place Where Truth Lives
Create a dedicated canon module/repo (or top-level folder) that owns **everything normative**:

```text
kvp/
  spec/                 # normative artifacts
    schemas/            # JSON Schemas (or protobuf/OpenAPI)
      manifest.schema.json
      envelope.schema.json
      full_snapshot.schema.json
      frame_diff.schema.json
      overlays.schema.json
    canonicalization.md # normative ordering + Q1E3 + hashing bytes rules
    semantics.md        # tick windows, [start,end) conventions, op apply rules
  gen/
    ts/                 # generated TS types + validators
    py/                 # generated Python dataclasses + validators
    rust/               # later
  conformance/
    runner_ts/
    runner_py/
  fixtures/
    kvp/v0_1/small_run/
```

**Key rule:** If it’s part of interop (viewer/kernel/tooling), it goes here:  
**manifest + record schemas + overlay schemas + canonicalization + hashing semantics.**

---

## 1) Single canonical schema source + generated types (expanded)
Generate types/validators from `kvp/spec/schemas/*` for:
- **Python** (exporters + verifier + fixture generator)
- **TypeScript** (viewer loader + overlay readers)
- (Later) **Rust** (kernel portability)

This eliminates “docs drift” like `payload.state` vs `world/agents/items/events`.
markdown
Copy code
## 2) Canonicalization + hashing becomes a first-class spec artifact
Schemas don’t prevent the real drift. So we explicitly canonize:
- **array ordering** rules (by stable IDs / tuples)
- **float quantization** Q1E3 (when, where)
- **step_hash** definition (what bytes; what scope; boundary tick meaning)
- **unknown fields** rule (direction-specific)

And we ship shared helpers:
- `kvp_canon.py` + `kvp_canon.ts`
- `kvp_hash.py` + `kvp_hash.ts`

These helpers are referenced by exporters **and** by conformance tests.

---

## 3) Overlay semantics become normative (and tested)
Pick one, write it once, never discuss again:

- **Window convention:** `[start_tick, end_tick)` (**end exclusive**)
- Boundary rule: tick == end_tick → not included
- UI events batching: windows are deterministic; events sorted (tick, event_id)
- Psycho frames: either per tick or sampled, but **tick alignment rules must be explicit**

Then add conformance tests that fail on off-by-one.

---

## 4) Conformance suite runs in backend + frontend CI (with 2 profiles)
This is the “divergence is impossible” part.

### Test profiles
- **producer_strict** (kernel/exporters)
  - MUST be schema-minimal (no unknown fields)
  - MUST canonicalize + quantize correctly
  - MUST emit correct envelope + msg_type

- **consumer_tolerant** (viewer)
  - MUST reject unknown `msg_type`
  - MUST require `kvp_version == "0.1"`
  - MUST decode envelope-first
  - MUST ignore unknown fields inside recognized payloads (v0.1 rule)

This ends the “ignore vs reject” arguments permanently.

---

## 5) The 90% bug-killer: round-trip invariants test (required)
In conformance:

1. load manifest  
2. for every tick in `[start, end]` (or `[start, end)` depending on how you define available_end):
   - seek nearest keyframe
   - apply diffs to target
   - validate:
     - tick continuity
     - `to_tick = from_tick + 1`
     - pointer.msg_type matches envelope.msg_type
     - hash chain: `prev_step_hash` matches prior `step_hash`
     - (optional) step_hash matches externally declared value, if present

This catches “works at tick 0, breaks at tick 2” instantly.

---

## 6) Reference reader/writer libraries (boring truth)
Ship small libraries used by everyone:
- `kvp_reader` (TS): manifest → seek → reconstruct → overlays by window
- `kvp_writer` (PY): envelope writer, msg_id determinism, canonicalization hooks

They’re boring, tiny, and conformance-tested.

Viewer teams build UI on top of `kvp_reader`, not bespoke ad hoc loaders.

---

## 7) Protocol gate job in CI (no merge without it)
Add a mandatory job: `protocol_gate` that verifies:
- schema diff review artifact (auto-generated changelog)
- fixtures parity (byte hashes)
- conformance suite pass (both profiles where applicable)

This is how you prevent “one harmless rename” from breaking the world.

---

## Immediate next action for Sprint 14 reality
Because you already have fixtures and exporters:
1) **Audit one snapshot + one diff payload keyset** from `fixtures/kvp/v0_1/small_run/`
2) If they’re `payload.state` + “diff replaces state,” you are currently **Option B disguised as A**.
3) Fix by:
- **Preferred:** change exporters to emit true KVP-0001 `world/agents/items/events` + `ops[]` diffs

Given your “constitutional” stance: **do the preferred fix**.
