# Shared character review structure — 13 October 2026

## Entry and navigation

Game Design → Agents → Asset review library. The library is the permanent index of character candidates. Every implemented player links directly to every other implemented player and back to the library. The active subject is marked; selecting another releases the previous scene. No background model preloading. Cathexis, Rivet Witch and Thrum appear as “awaiting model” entries with their review focus, without dead player links or invented readiness.

The common structure is a review workbench, separate from player-facing game UI and simulation authority. LIMEN, Worker 01 and STILETTO retain specialized controls. Shared navigation and six evidence gates are implemented now; one configurable player shell and a normalized animation adapter are the next refactor when the next supervisor is added. Do not duplicate a complete viewer for every new character.

## Six shared gates

| Gate | What we inspect | Required evidence |
| --- | --- | --- |
| Body & materials | Concept silhouette, intended height, neutral pose, armour, joints, textures, rig | Reference views; actual mesh/rig/material inventory; front/side/back and clay inspection |
| Equipment & effects | Forearm/hand/tool sockets, attachment scale, replaceable modules, glow and motion | Mounted assembly, neutral and moving; separate technical and artistic sign-off |
| Motion library | Idle, locomotion, emotion and job-specific actions readable without captions | Actual clip names, semantic role, duration, travel/turn data, play/pause/scrub/speed; unavailable clips explicitly listed |
| Contacts & clearance | Limb/body, tool/body, floor, other agents, machinery, transitions | Exact model revision and timestamp; original/corrected comparison; sampled method and its blind spots |
| Factory & CCTV | Recognizable character and action in dark rooms, three cameras, near/far | Camera/room/light settings and stills; effects-off comparison where relevant; owner visual judgment |
| Performance & delivery | Transfer size, triangles, joints/materials/draws, frame times, crowd cost | Runtime hash, device/viewport, measured scene and sample; loading/disposal/failure checks |

All six appear in each current player's collapsible **Review coverage** panel. Status is per gate: **Accepted slice**, **Candidate**, **Needs work**, or **Not measured**. An accepted silhouette does not approve a gait; passing isolated sampled clearance does not approve animation blends. Owner feedback names the accepted slice. Missing assets start **Awaiting model** in the library. No silent global “production-ready” badge.

## Shared screen jobs

1. Library: available cast, revisions, pending cast, review purpose and direction links.
2. Player header: subject/revision and cross-model navigation; concise review coverage.
3. Stage: one assembled character in the real factory renderer; close inspection or CCTV. Pause and inspect a meaningful pose before autoplay.
4. Controls: motion selection, transport, precise time, speed, loop behavior, surface, orientation, room and camera. Group advanced controls into disclosure panels. Use semantic action labels while retaining source identifiers in evidence.
5. Character-specific tools: LIMEN's emitter and power-cycle beats; STILETTO's interchangeable arms and original/corrected comparison; future tools describe genuine character differences, not separate navigation systems.
6. Evidence: visible unresolved checks, recorded images, audit method and exportable review state. STILETTO pose links currently preserve clip/version/time. A common pose-link schema across all players is a follow-up, not already implemented.

Never load all characters to populate an index. Review images and references load on demand. Mobile stacks stage/controls; interactive targets remain accessible and the viewer stops work when hidden or unmounted. The preview route uses the production renderer and immutable assets, but does not alter the game run.

## Intake record for each new supervisor

Use `lib/loopforge/agents/review-catalog.ts` for stable identity, route, revision and public description; `review-contract.ts` owns the six gates and the pending cast. Each candidate supplies an immutable asset manifest plus a character-specific motion/equipment record. Keep identities independent of storage URLs so moving from app-hosted derivatives to the CDN does not change navigation or simulation IDs.

Record:

- Character ID, author/source, source concept images, source file names and hashes, revision and license/provenance record.
- Neutral rigged body, runtime GLB, real triangle/joint/material counts, bounds, height, rest pose, skin hierarchy and texture sizes. Preserve editable source separately.
- Modules with a stable module ID, target bone/socket, transform, scale, operating envelope, effect/material mask and allowed combinations. No regeneration of a whole body to replace one tool.
- Motions with semantic ID, original clip name/catalog ID, duration, loop/one-shot, root translation/yaw policy, clip hash, intended visual meaning, equipment constraints and known faults. Preserve source curves; corrected alternatives have their own IDs and evidence.
- Evidence with exact runtime hash, clip/version/time, mounted modules, camera, room/light/surface settings, audit method/sample rate, observed contacts, screenshot references, remaining limitations and reviewer decision.
- Performance evidence states the hardware and workload. One character in Security cannot certify 100 workers or a phone.

A cast definition should select a shared runtime adapter and optional equipment/effect controller. The shell must not branch on character names throughout unrelated controls. Migrate existing adapters only when their lifecycle and animation behavior can remain covered; preserve LIMEN's specialized energy controller. Do not add a simulation dependency to the catalog.

## Next three intakes

- **Cathexis:** recognizable presence and the approved Hot Walk direction on her own rig. Test foot placement, expressive idle, persuasion and worker-facing acting. The worker stand-in's animation is not proof that her rig is clear. Crowd reaction and indoctrination contacts need a later paired scene.
- **Rivet Witch:** engineer silhouette and tool identity. Inspection and repair require authored machine contact targets. Record grip/socket limitations before requesting catalog gestures; a generic wave cannot stand in for a successful repair.
- **Thrum:** distinctive posture, rhythm and vibration effects. Calm, exhaustion and relaxed discipline must be visibly distinguishable. Check worker reactions in paired scenes before treating a gesture as a gameplay intervention.

For every intake: validate downloaded contents and names → assemble and normalize a runtime derivative → mount equipment → expose source clips → flag contacts → author corrections → inspect the final exported bytes under factory lighting → record owner acceptance by slice. Missing visualization stays a design/production gap, never an invented completed action. The deterministic engine owns action eligibility and outcomes; animation visualizes permitted events.

## Existing review records

- [LIMEN](LIMEN_MESHY_REVIEW.md): body/emitter/energy and authored idle.
- [Worker 01](WORKER_MOTION_REVIEW.md): motion inventory and gait flags.
- [STILETTO](STILETTO_MOTION_REVIEW.md): twin blades, five corrected candidates and sampled audit.
