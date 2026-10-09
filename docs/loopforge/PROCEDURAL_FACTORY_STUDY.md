# Procedural factory commissioning study

Route: `/stepanoskin/loopforge/play/factory-study`. Branch / draft PR: `codex/loopforge-conveyor-study` / #102. Updated 2026-10-09.

## Implemented slice

One persistent Babylon.js 9.30.0 scene contains a Security corner and a short Lattice Forge test line. Room geometry, materials, surface grain/normal relief, brains, workers, equipment and moving light are procedural. Authored images appear only on the three phase interludes. The original console prototype is still available; this is an isolated commissioning fixture, not its replacement or a complete playable economy.

1. Arrive at night; production is stopped. Explicitly enter **Build** (button or B).
2. Select and confirm Security’s clearance terminal, then access gate, then the conveyor drive. A translucent equipment preview shows the fixed socket. Click it or use the confirmation button. Escape cancels the selection, then leaves the tool. Camera drags do not place machinery.
3. Leave Build, finish the night, see the Morning interlude, then start the test shift.
4. Watch the individual crew, gate, belt plates, cradles and drive follow live state. Choose steady/push, pause, introduce a test obstruction, or release it. Test cradles are explicitly **not** quota production.
5. After 1,200 ticks the shift ends and returns automatically to the next night. Installed equipment persists for another test shift.

Camera orbit, pan, zoom and room focus use the same camera in both modes. The canvas reserves space above contextual controls. Build admission is enforced in the kernel; hiding a button is not the rule. This study compresses the default **18-hour shift into one minute**, followed by the fictional **six-hour charge/night window**. Faster chargers remain future research. Night, Morning and Shift start have three-second interludes; their timer begins after the image decodes. Both the host and production sound pause while the card is shown or the document is hidden. There is no elapsed-time catch-up.

## Architecture boundary

- `lib/loopforge/factory-study/kernel.ts`: versioned plain-data snapshot, stable worker IDs, integer travel, immutable typed commands, deterministic 50ms ticks and bounded events. No React, renderer, random wall-clock decisions or LLM dependency.
- `host.ts`: replaceable local clock/command adapter. The browser owns this public study fixture only.
- `scene.ts`: snapshot consumption and interpolation. Babylon meshes, camera transforms, light animation and GPU buffers are disposable presentation data; they are never simulation authority.
- `FactoryStudy.tsx`: contextual controls, lazy renderer import, four-per-second readout updates, phase cards, visibility/lifecycle handling and optional existing FactoryAudio cues.

This does not migrate the canonical first-shift server, worker components, quota, injury, money, BDI, knowledge/rumour state or save protocol. Obstruction/release is a test control, not an implemented repair or accident rule. The current route does not call a model service.

## Art grounding

The initial interlude drafts were rejected for metropolitan scale. The replacement set was generated with the built-in image tool after viewing these originals in the old Loopforge repository, under `frontend/loopforge-webview/public/assets/concept_art/`:

- `world/loopforge_factory_overview_1.png` and `_2.png`: compact buildings, cluttered fenced yard, oversized entrance sign.
- `world/loopforge_factory_entrance_1.png`: an ordinary working entrance rather than a monumental civic threshold.
- `world/loopforge_world_scrapyards_1.png`: local salvage, patched machinery and low industrial structures.
- `rooms/01_loopforge_factory_rooms_lobby.png`: dense brass/olive interiors and factory identity.
- `rooms/04_loopforge_rooms_neural_lattice_converyor_1.png`: close brain cradles, skull-like machinery, layered pipes and localized warm/cyan light.

The final sequence is a cramped six-robot charging room, the compact factory yard at morning, and one crowded conveyor bay. It follows the original town scale. Prompts and provenance: `apps/lab/assets/sources/loopforge-time-transitions/provenance.json`; originals sit beside that file. The immutable `loopforge-time-transitions` pack contains 768px and 1672px WebP variants. The three full-width runtime images total approximately 1.2MB. They are also available in the design deck’s Conveyor tab.

The procedural renderer is a first art-direction study. It establishes materials, mechanisms, neural folds and coherent space, but it does not claim parity with the detail density of the original paintings or a final AAA art gate.

## Construction references

The interaction borrows established builder conventions rather than creating a separate construction viewer:

- [Factorio tutorial design](https://www.factorio.com/blog/post/fff-213): introduce a small task and immediately exercise it.
- [Factorio ghosts](https://wiki.factorio.com/Ghost) and [controls](https://wiki.factorio.com/Controls): explicit placement state, a preview and cancellation.
- [Factorio’s early-game design](https://direct.factorio.com/blog/post/fff-273): show machinery in the same world the player operates.
- [Satisfactory Build Gun](https://satisfactory.wiki.gg/wiki/Build_Gun) and [tutorial](https://satisfactory.wiki.gg/wiki/Tutorial): enter a recognizable building tool, preview, confirm and return to operation.

The two fixed Security placements teach the same verb used on the drive. Free-layout construction, installation cost/time and the full minimum chain remain design proposals.

## Rendering and accessibility

Static geometry is merged by parent/material/vertex layout. Articulated workers use shared GPU matrix buffers while retaining separate worker state. Belt plates also use GPU instances. The renderer batches fixed body parts, caps pixel density, reduces internal resolution under sustained slow frame delivery, and caches unchanged shadow maps. Warm overhead, cool fill and the rotary signal are the three primary light channels. The signal shares a source/direction with its reflector, visible beam and shadow projection. Alarm mode rotates faster. None of this requires per-frame React renders.

Motion preference disables decorative camera easing, specimen tremor, scan movement and rotating/flashing atmosphere; simulation and essential production movement remain visible. Sound is opt-in. Focus buttons and explicit placement confirmation supplement pointer gestures. Controls, tool state and phase changes have accessible labels. Rendering and clocks stop when hidden, and scene/observer/audio resources are disposed on exit.

## Validation record

- Kernel/host: five tests covering installation admission/order, immutable commands, pause/jam behavior, the 1,200-tick day boundary, deterministic replay of 100 individual workers, event bounds and clock cleanup.
- Full app CI: 76 suites / 399 tests, immutable asset checks and production compilation passed during this change. Later renderer-only adjustments receive focused lint and a fresh production build.
- Browser: explicit mode entry/exit, Escape cancellation, drag without placement, world/socket placement, the three-install sequence, Morning/Shift interludes, steady/push, obstruction/release, and mobile control/socket framing exercised. Layout inspected at 1440×900, 390×844 and 320×720; no page-width overflow.
- Performance is measured on the available Intel HD Graphics 620 browser, not representative device certification. The initial per-part worker implementation fell to single-digit FPS at 100 workers and was replaced with GPU batching. Observed samples after batching: 29 FPS with 100 workers in the phone-sized view (253×548 internal pixels), and 18–21 FPS on the desktop view with 10 workers (936×585 to 1440×900 internal pixels). These development-browser samples fall short of a stable 30 FPS target; the final performance gate remains open. GPU timing and broader device profiling are still required. A 100-worker study is a rendering load test, not a claim that this small room offers plausible space for 100 bodies.

## Delivery checklist

- [x] Inspect original art and align town scale.
- [x] Build independent deterministic commissioning kernel/host and procedural room study.
- [x] Share camera/navigation between explicit construction and operation.
- [x] Add phase interludes, 18+6 schedule, optional sound and diagnostics.
- [x] Exercise responsive placement and improve measured rendering workload.
- [x] Update game/UI/system reading copies and reference gallery.
- [ ] Complete final production/hosted checks and publish this revision to PR #102.

Remaining product work: connect real room economics/worker capabilities through the canonical host, supervisor assignment/briefing, meaningful construction costs, chain optimization, real accident consequences, broader device profiling, and further procedural art direction. These are not represented by fake completion badges in this fixture.
