# Loopforge — the interface belongs to the factory

**10 October — room art calibration:** each room should recover its own concept-art identity through a navigable hybrid of real structure/working objects and painted world-space surfaces. Start with the [lobby wage-claim hall](LOBBY_ART_DIRECTION.md): autonomous desks, forms, local task light and actual worker scale. The approved floor layout stays fixed. [Webview rendering and assets](WEBVIEW_RENDERING_AND_ASSETS.md) and [prefab pipeline](ASSET_PREFAB_PIPELINE.md) document the technical plan; these are not claims of a completed lobby or worker economy.

**Full-floor follow-up, 9 October:** The separate procedural study now uses a calibrated 280 × 200 tile map (8× the reference plan in each direction) with all six managed rooms plus Lobby, Dispatch and Shipping. Security and Conveyor alone are initially unlocked. Room bounds, portals, locks, pathfinding and direct interaction adjacency share a framework-free spatial definition; workers carry integer positions and room identity. The floor-plan dialog and camera consume the same map. The existing console protocol remains unchanged. An explicit Equipment study view reveals staged machinery and operator spaces in all six rooms without granting access or changing the host snapshot. Equipment dimensions stay at worker scale. The Forge now measures 80 × 56 m, with 2,068 m² reserved for construction. Whole room and Work area are camera framings of the same world; typed construction reserves and delivery aisles live outside the renderer. See [Factory floor calibration](FACTORY_FLOOR_CALIBRATION.md) and [Factory scale and equipment](FACTORY_SCALE_AND_EQUIPMENT.md).


**9 October implementation update:** The procedural commissioning study now uses Babylon.js in a separate route. One persistent factory camera serves night construction and production playback. The eighteen-hour shift / six-hour charge baseline and three-second illustrated day/phase interludes are approved direction. The existing first-shift game protocol is unchanged. See [Procedural factory study](PROCEDURAL_FACTORY_STUDY.md) for the implemented boundaries and verification.

9 October 2026 — [Conveyor mini-game proposal](CONVEYOR_MINIGAME_PROPOSAL.md) is the current direction for the next operating prototype. Each room is a distinct puzzle within a common cinematic 3D factory; the console handles overview and communications. Physical machinery, routes, shared policies applied per room and supervisor delegation supply player agency during production. This supersedes the earlier scope of a later observation-only 3D view. The illustrated-console game remains the canonical runtime baseline. The separate commissioning fixture exercises construction and motion without changing that game’s economic or supervisor rules.

Owner direction, 8 October 2026. Applies to the landing, playable console, camera views, briefings and future live factory. Read alongside the repository’s [design and performance standards](../DESIGN_AND_PERFORMANCE_STANDARDS.md).

**Latest owner review:** the focused-screen/material direction is improved. This pass separates the adviser roster and weekly leadership call, strengthens factory feedback and tests a five-supervisor selection layout. The call may drop console chrome entirely. See [living-console direction](LIVING_CONSOLE_DIRECTION.md) and [cinematic surfaces](CINEMATIC_INTERFACE_DIRECTION.md). Automated checks do not establish owner visual/enjoyment acceptance.

## The whole day shares a minute

Owner direction: one complete routine day takes about a minute; a heavier day takes two to three minutes at most. Reading, daily adviser choice, brief/plan approval, production, interruptions and permanent allocation all count. Give the primary choice room by removing repeated reports and compulsory inspection trips. Keep structured speech, recoverable outcomes and optional depth. Weekly calls and first-time explanations fit the longer-day allowance. Proposed: concise plan approval within the brief, detailed edits on demand, and a daily result reused as tomorrow’s context. These are design requirements for the next pass, not a change to the current runtime. See [flow and interface inventory](ONE_MINUTE_LOOP.md).

## The guiding principle

**Visceral conveyor and factory operations are the foundation of the interface.** The accepted landing conveyor is the reference: weight, uneven momentum, friction, light crossing machinery, stoppage, and a deliberate act that restarts the line. Carry that physical logic through the game UI. It must feel responsive *with* the factory.

Direct artwork, transitions, typography, lighting, motion, SFX and eventually music as one experience. Each layer reinforces the same mechanic and theme: more minds produced, workers consumed by pressure, authority delegated to imperfect supervisors, consequences that remain after the machinery resumes. A satisfying button alone is insufficient if the world ignores the decision.

The player’s central first-day choice is whom to trust with authority. The resulting production line gives that choice tangible meaning. The quota supplies continuing pressure; the workforce and equipment reveal what output costs. Clear information and enjoyable play take priority over exposing the whole simulation.

## Earlier delivery: the asset-driven interface baseline

Owner clarification, 8 October 2026: build the **asset-driven decision interfaces** now. Adviser selection, structured briefing, assignment approval and overrides, incident responses, permanent allocation and debrief must carry the core loop as a playable prototype on their own, supported by illustrated room scenes and the authoritative simulation. They are substantive game interfaces, not temporary menus waiting for a renderer to make the game interesting.

The **live, tick-fed 3D factory is a later cinematic view** of that same simulation. It will show continuous machinery, workers, batches and interventions, following the old world viewer’s observation direction. It joins the existing interfaces; it does not replace them or supply their game rules. “Side interfaces” describes their relationship to this future world view, not a requirement to squeeze them into a narrow sidebar. A briefing or incident can occupy the foreground while preserving factory context.

The old working world viewer is the Sim4/KVP **Pixi isometric renderer**, with world positions, room bounds, floor selection and interpolated movement. Sim5 contains broader viewer strategy documents. Neither establishes an already finished 3D implementation. Babylon.js 9.30.0 now powers the separate commissioning study; the illustrated interfaces retain their own implementation.

## Entry and visual hierarchy

Next-prototype entry, 9 October: arrive through the Lobby at night, place two Security items in predefined positions, then commission the first Conveyor element in Lattice Forge. The camera and build lesson precedes all supervisor assignments. Morning then reaches the producer console with the leadership call required before adviser selection. The existing runtime still opens directly at that console; night construction is design work. Answering opens the illustrated weekly planning call. Its art can fill the viewport, with an uneven soot vignette and lower captions/results. It presents the opening handover and quota; later weeks should review real prior performance. Returning reveals two live cameras and four dark screens, with no assignments. Only a compact quota summary and Choose adviser action belong on this wall.

Adviser selection has a dedicated five-or-more-person roster. Current pitches and focused priority/tradeoff details explain the choice before appointment. Once committed, the selected adviser’s structured brief owns the screen, followed by placements and explicit authorization. A physical Start the line control then releases production. No duplicated full briefings or persistent tutorial column on the factory view.

Keep the factory identifiable without burying the next decision under a panorama, a large title or explanatory prose. On a phone, recompose the same scene and action; do not shrink a desktop wall until its instruments become illegible.

## Assets define almost every visible element

Use the original sim-sim Director Console as the visual starting point. Inspect and adapt its actual assets and modules before inventing replacements:

- `docs/sim_sim/sim_sim_ui_spec_v1.md` and its style sheet: CCTV wall, director’s console, phase-specific primary action and focused incident surfaces.
- `frontend/loopforge-webview/public/assets/ui/`: gunmetal, glass, noise, instrument plate and resource icon variants.
- `frontend/loopforge-webview/public/assets/cards/rooms/` and the interaction-art archive: illustrated rooms and character-grounded outcomes.
- `src/viewers/sim_sim/ui/{assets,bezelPanel,topStrip,roomArt}.ts`: loading, material layering, instruments and room selection patterns. These paths are in the original Loopforge repository.

| Interface element | Authored material | Responsive behaviour |
| --- | --- | --- |
| Room camera | Scene art, physical bezel and glass | Select a matching scene; crop deliberately; layer permitted event cues |
| Adviser and briefing | Expressive character art, dialogue framing and physical dossier/intercom surfaces | Reveal short labelled topics; keep speaker and attribution clear |
| HUD and meters | Instrument plates, resource symbols and meter artwork | Render changing values and labels as readable native text |
| Buttons and orders | Coherent control art and meaningful state variants | Normal, hover/focus, pressed, selected, disabled and alarm states where needed; immediate press response, explicit accepted state |
| Incident and allocation | Scene-specific framing, dispatch/retention apparatus and aftermath art | Preview the commitment and its consequences; preserve the record after the effect ends |

CSS and code position, mask, slice and animate these assets; they also provide text, hit areas, focus, semantics and reflow. They are not a substitute for authored material, perspective and lighting. Do not return to generic cards, line icons and flat gradient buttons with a factory picture behind them. Reuse sliced frames and tiles without distorting rivets, corners or material scale. Generate missing art against a specific interface role and state, retaining neutral, clearly identified placeholders during development.

Procedural effects support the authored surfaces: transitions, restrained light, glare, grain and feedback from confirmed events. A genuine future live 3D view can render geometry, materials and spatial lighting. Decorative animation is not a substitute for that view, and is not needed to prove the current loop.

The director-console revision implements this direction in `/play`: dedicated adviser choice, authored frames/control states and portraits, a persistent factory scene, and dedicated briefing, incident, dispatch and debrief surfaces. The [rebuild gate report](UI_REBUILD_VALIDATION.md) records the agent assessment. The owner rejected the preceding PR #94 composition; neither that baseline’s checks nor this revision’s checks substitute for owner enjoyment approval.

## Borrow pacing, preserve identity

Frostpunk is a reference for connecting a central machine and survival pressure to emotional decisions; for foregrounding an illustrated account while the world remains behind it; and for coordinating image entrance, sound, pause and commitment. Its lead designer explicitly connects the console interface to the generator’s central spatial role and argues for clearer presentation rather than reducing underlying complexity. [Developer account](https://blog.playstation.com/2019/10/10/adapting-frostpunks-complex-city-building-for-ps4-out-tomorrow/).

Visual study: [convoy decision composition](https://www.gamewatcher.com/reviews/frostpunk-review/13025) and [housing decision screenshot](https://abbysblog.net/blog/frostpunk). The observed composition uses a legible illustrated foreground and compact decisions, with the wider world receding behind it. Fade and audio timing below are our proposed direction, not measured reproductions of Frostpunk’s implementation. No Frostpunk artwork or audio is shipped.

Loopforge retains soot, worn brass, industrial green-black, cyan cognition and Stiletto red. Its character comes from its own painted factory art and mechanical rhythm. Avoid generic dashboard cards, pristine science-fiction glass, cartoon apparatus and unmotivated glitch decoration.

## One event, one directed response

| Factory beat | Visual and interface response | Sound direction | Mechanical meaning |
| --- | --- | --- | --- |
| Arrive and build | Lobby → guided Security setup → first Conveyor installation at night. Morning introduces the weekly mandate and adviser selection. | Quiet room tone, distinct placement clangs, gate movement and the first motor starting; sound only after activation. | See a physical piece of the factory come alive through your input before choosing who will run it. |
| Choose an adviser | The chosen figure comes forward; their competing colleague recedes. Briefing topics appear as readable comic panels. | Intercom relay and a distinct supervisor signature. | One adviser is committed for the day; no placements yet. |
| Approve a plan | Assignments lock into the room labels. The delegated room’s authority is explicit. | A weighted latch, not a celebratory reward sting. | Your order is accepted; a supervisor remembers an override. |
| Start the shift | Contact indicators engage; confirmed activity updates the illustrated cameras and instruments. The future 3D view adds continuous spatial execution. | Contactor, motor spin-up, low machinery bed. | The accepted plan begins producing outcomes. |
| Complete a batch | Output advances once; a restrained local highlight connects the batch to the ledger. | Outtake latch, capped so production never becomes notification spam. | Real produced units, still awaiting allocation. |
| Accumulate strain | The relevant camera and condition readout show load. Disturbance is localized, not random across the whole UI. | Irregular knocks, electrical chatter, more stressed motor texture. | Exposure and equipment condition have changed. |
| Adviser acts autonomously | Briefly foreground their action and its result; leave a durable record. Do not offer a fake approval button. | Intercom intervention followed by the relevant machinery response. | Authority belongs to the adviser in their actual assigned room. |
| Decision elsewhere | Factory recedes, relevant scene and adviser account come forward. Response options state consequences and whether they override. | Warning cue, machinery ducked; silence creates space for judgment. | Simulation pauses for a consequential decision. |
| Injury or damage | Sharp, localized interruption followed by an uncomfortable stillness. Worker and equipment changes remain visible after the cue. | Impact, power interruption, then a gap. | Loss is not just a transient red flash. |
| Resume | The selected response completes, record updates, then the line resumes. | Mechanical engagement appropriate to the outcome. | An accepted command changed the world. |
| Allocate | Preview two destinations; confirmation visibly seals the split. | Dispatch gate for delivery; activation for retained workers. | Irreversible allocation, not an adjustable resource slider afterward. |
| End the day | Cameras settle; ledger and supervisor reactions remain together. | Motors wind down; ledger feed; score resolves without erasing unease. | Tomorrow inherits machinery, people and memories. |

## Timing and restraint

- Fast controls acknowledge immediately; only a server-confirmed command presents a committed world change. Pending and disconnected states remain honest.
- Proposed choreography: control press 80–140 ms; ledger acknowledgment 160–240 ms; scene/briefing crossfade 350–650 ms; arrival 900–1,600 ms. These are starting ranges for review, not mandatory delays on input.
- The world remains spatially identifiable during a decision. Fade through atmosphere and light; avoid unrelated page wipes, bouncy menus and forced cinematic waits.
- Use the same scene for compatible states, adding restrained effects. Change artwork when the depicted action or consequence changes. Never display a graphic accident plate for a harmless warning.
- New artwork fades in only when ready. No black image-loading hole. Keep the last confirmed camera visible through reconnection.
- No invented warning pulses, arbitrary sensor values or random glitches implying nonexistent accidents. Cosmetic grain is neutral texture; alarm cues require a known event.
- A cue ends; its consequence stays in the readouts and record. The player can inspect who acted, what changed and why.
- At faster playback, coalesce ordinary cues. Never accelerate a warning into a strobe or stack a wall of production sounds.

## Sound and eventual soundtrack

SFX categories: console relays; supervisor intercom signatures; briefing handling; shift contactor/motor; batch outtake; line strain; decision warning/duck; accident impact/silence; override transmission; allocation seal/dispatch/activation; shift-end ledger.

Music is a separate authored layer, not continuous reinforcement of every click. Plan stems for the working pulse, mounting pressure, deliberation space and aftermath. Crossfade from known episode states; duck under intercom and critical signals. Avoid triumphant rewards for output whose human—or robot—cost is still unresolved. Recorded and procedural SFX currently cover part of the feedback. The recorded library and final mix remain incomplete; a soundtrack has not shipped.

The first recorded pass adds the `loopforge-sfx` pack: metal clang for landing navigation, contactor for RESET / shift startup, engagement ratchet for commitment and release latch for shift shutdown. The gate and dark-room loop remain audition-only. The playable [Sound library](/stepanoskin/loopforge/design#sound-library) documents crops, CC0 sources, intended roles and missing cues. Source recipes and measurements live in `apps/lab/assets/sources/loopforge-sfx/`. A recorded cue replaces its procedural counterpart only when decoded and ready; failed or slow loads use the immediate fallback, never a delayed replay. No kernel, protocol or decision rules change.

Use separate effects and music controls once music exists. Start silent until the player enables sound. Cap concurrent one-shots, set prepared source levels and tune the final mix, stop hidden-tab work and suspend audio. The sound library requires explicit preview playback and does not preload its clips. Final timbre and mix approval require listening in context; waveform and peak checks alone do not establish that judgment.

## Causality and accessibility

The presentation consumes the knowledge-filtered event stream. It cannot invent simulation outcomes, update hidden state or depend on frame rate. Cue IDs prevent replays/reconnections from duplicating feedback. Timing interpolation belongs to the viewer; committed ticks belong to the engine.

Every important sound has visible text or a readable state change. Reduced motion and the atmosphere toggle preserve complete decision information. Use bounded opacity/transform effects, stable text, restrained contrast changes, clear keyboard focus and 44px touch targets. Mobile must retain the quota, chosen adviser, affected room and current decision without requiring a desktop-sized camera wall.

## Review questions

1. Can the player connect their choice to an action on the line, a measurable consequence and a supervisor’s reaction?
2. Do image, motion, light, sound and text tell the same story at the same moment?
3. Is the physical feeling distinctly the Loopforge conveyor, rather than a generic strategy UI?
4. Does a bad outcome remain legible after the dramatic effect ends?
5. Does it stay clear with sound off, reduced motion, a narrow phone and an interrupted connection?
6. Does the owner enjoy playing it and want to try the other adviser? Visual polish does not answer that playtest question by itself.
7. Can the asset-driven interfaces carry the complete loop with the future 3D view absent?
8. Do the actual control surfaces, character treatment and scene composition share Loopforge’s material identity, rather than merely borrowing its background images?

## Equipment and feedback update — 8 October

The owner requested all six generated themes be implemented and kept in the selector. A game start menu and in-run Settings now provide those material sets; the first gameplay action remains adviser choice. An author workbench combines implemented monitor and control families without resetting the run. These changes do not accept the prior composition or complete the broader focused-interface redesign. See `UI_THEME_ASSET_SYSTEM.md`.

The overhead console beacon is dark by default. A confirmed production batch fires green; an actual accident fires red; an attention request fires ember/amber. Sparse cyan impulses occur only after inactivity. Each performs one rotation, then extinguishes; no constant sweep or continuous alarm wash. Shared effects respect reduced motion and atmosphere settings. See `CONSOLE_LIGHT_FEEDBACK.md`.
