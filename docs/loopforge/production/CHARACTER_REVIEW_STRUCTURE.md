# Shared character review structure — 13 October 2026

## Entry and navigation

Game Design → Agents → Asset review library. This is the current cast entry point; the rejected-model action fixture appears only in a collapsed historical section and identifies itself as legacy on direct entry. The library is the permanent index of character candidates. Every implemented player links directly to every other implemented player and back to the library. Navigation and library cards follow All models → Worker 01 → LIMEN → STILETTO → CATHEXIS → Model briefs, with the worker before every supervisor. The active subject is marked; selecting another releases the previous scene. No background model preloading. Rivet Witch and Thrum appear as “awaiting model” entries with their review focus, without dead player links or invented readiness.

The common structure is a review workbench, separate from player-facing game UI and simulation authority. LIMEN, Worker 01 and STILETTO retain specialized controls. Shared navigation and six evidence gates are implemented. CATHEXIS now uses a configurable shell with separate static-assembly and baked-motion adapters; earlier specialized players can migrate incrementally. Do not duplicate a complete viewer for every new character.

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
4. Controls: close inspection supports mouse/touch orbit, scroll/pinch zoom, keyboard arrows and visible zoom/reset buttons. Fixed CCTV presets deliberately detach orbit controls; returning to inspection restores its angle and distance. Camera gestures do not change the pose or simulation. Export the actual camera pose with evidence. Motion selection, transport, precise time, speed, loop behavior, surface, orientation, room and camera. Group advanced controls into disclosure panels. Use semantic action labels while retaining source identifiers in evidence.
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


## Rebuild archive — 14 October 2026

Game Design → Model briefs stores versioned reference inputs, copyable stage prompts, downloadable kits and links back to every available model player. Viewer navigation returns to the active character brief. LIMEN, Worker 01 and STILETTO have inspected results; CATHEXIS has six static inspection assets, a generation brief and face/condition references. Its assembly and four approved corrected motions are now available in separate workbench modes. See `model-briefs/README.md`.

## Static intake workbench

CATHEXIS introduces a configurable static adapter within the same review navigation and six acceptance gates. It owns one canvas and one selected model, lazy-loads the selected SHA-verified GLB, cancels stale downloads and disposes previous geometry, textures, shadow registrations and its inspection lamp. The scene pauses offscreen and when the document is hidden. Model materials, clay and wireframe views share the same geometry. Framing can target the body or its face seat; the default limits of the existing motion viewers remain unchanged.

Grace 3k/8k comparisons preserve camera pose and subject orientation. Isolated faces use normalized display dimensions, explicitly distinguished from mounted scale. Static-part inspection does not establish motion clearance or game outcomes. Review evidence includes source filename, runtime hash, selection, camera pose, lighting, viewport and available scene counters. High-resolution FBX masters stay private.

## Baked motion adapter — 15 October 2026

The same shell switches between CATHEXIS motion cleanup and face fitting, disposing the inactive subject. The motion adapter loads one checksum-verified bank, renders only its selected source/corrected skin, and supports same-pose comparison, neutral reset, play/pause, scrub, speed, looping, camera and material controls. It starts paused and stops when hidden/offscreen. Evidence includes clip, version, time and asset hash. Six baked skirt joints avoid live cloth cost. Full/split Grace fit is owner-approved. A fixed clip origin, optional 10 cm floor grid and unobscured feet separate true motion from preview movement. Supervisor portrait, full-body and CCTV framing use the same performer. Hot Walk, Happy Sway, Mirror Viewing and Red Carpet Walk are owner-approved. Blends, travel-speed matching and paired contacts remain open. See [motion record](CATHEXIS_MOTION_REVIEW.md).

## One performer across information screens and the factory

Supervisor information screens reuse the versioned body, rig, clip IDs, equipment sockets and appearance controller that world scenes use. Screen-specific cameras, lighting and quality budgets frame that performer; they do not fork its anatomy or acting. Review full motion cycles in portrait and full-body framing before using a flattering close-up as evidence. The current portrait preset is a review view, not an implemented information screen.

Stationary acting preserves hip weight shift over anchored feet. Keep scene placement outside the skeleton; never cancel pelvis translation every frame to centre a preview. Locomotion declares in-place or authored root travel and must match world speed/contact phases. Interaction clips declare targets and contact/release timing; shared scenes still need collision, interruption and blend checks. The engine owns action eligibility and results. Offline corrections avoid a per-agent runtime IK/cloth solver. LOD, animation update cadence, effect/shadow budgets and device/crowd measurements are required before scaling the accepted single figure to many agents.
