# Factory scale and equipment study — 9 October 2026

Owner direction: preserve the original floor's room proportions and connections, enlarge its tile count, and calibrate equipment/worker/architecture relationships to the original concept art. Future purchases and construction must place actual equipment; this pass stages prototypes for scale review.

## Scale decision — construction capacity revision

The owner found the preceding 105 × 75 study too small. Its single installation almost filled each room. This revision treats that machinery as a starter cell within a substantially larger factory.

- Floor envelope: **280 × 200 one-metre design tiles**, 8× the original reference plan in each direction and 7.11× the area of the preceding study. Room proportions and all thirteen connections are preserved. Metres remain a design convention, not a measurement of a painting.
- **Workers and equipment do not grow.** Workers remain about 1.9 m tall; the conveyor surface remains 1.43 m; the current intake-to-outtake chain remains about 25 m long. Six-metre architectural doorways stay centred on their original openings.
- **Lattice Forge: 80 × 56 m.** Its starter cell leaves four explicit empty plots: 22 × 22 m feed/buffer ground, 18 × 20 m extension ground, and two 34 × 18 m production bays. Total reserved ground: **2,068 m²**, separately from the six-metre cross-hall delivery aisle, service access and encounter apron. This is enough geometric space to prototype several chains; it is not a promised throughput or worker capacity.
- Security 32 × 48 m; Brewery 88 × 64 m; Weaving 80 × 64 m; Theatre 56 × 64 m; Cortex 64 × 88 m. Each has more than 35% of its footprint explicitly reserved as clear construction plots, with further space for the initial installation and circulation. `capacity.ts` records 17 plots, separate aisle rectangles and local camera frames.
- Hall cornices rise to 7–15 m, according to room function. Workstations retain their dimensions. Machine-height-to-worker relationships remain fixed rather than scaling every object together.
- **Work area** shows the local installation at readable scale; **Whole room** shows expansion ground; **Overview** shows geography. Orbit, pan and zoom continue to operate on the same scene in Build and production. Empty ground must be visible as future construction capacity, not filled with decorative equipment to disguise it.
- Plot markings are a planning study, not hard building slots. Future placement must validate machinery, worker access, buffer/transport capacity, maintenance and room-specific hazards. Floor capacity alone does not implement the eventual logistics simulation.

## Revision checklist

- [x] Enlarge all nine footprints; preserve the thirteen connections and first-turn locks.
- [x] Relocate the unchanged equipment kits and opening crew route.
- [x] Reserve clear construction ground and separate delivery aisles; test overlap and containment.
- [x] Separate local working camera framing from whole-room framing.
- [x] Check all six rooms, normal first-turn construction, 100-worker playback and phone layout.
- [x] Validate rendering cost, lint and tests; compile/type checking and optimized local route generation complete. Hosted build validation is recorded with the PR.
- Hosted publication gate: record the final commit, deployment and browser verification on [PR #102](https://github.com/stepan-o/fruitful-lab/pull/102).

## Read art and spatial consequences

All paths below are under old Loopforge `frontend/loopforge-webview/public/assets/concept_art/`.

| Room | Viewed references | Spatial commitments | Interaction space |
| --- | --- | --- | --- |
| Security | `rooms/03_loopforge_rooms_access_control_1.png`; `characters/interactions/argue_limen_stiletto_security.png` | checkpoint lane, cage, wall-mounted records and real operator desk, conduit ceiling | two supervisors can confront each other at the gate; queue waits on the entry side, bypass remains visually distinct |
| Lattice Forge | `rooms/04_loopforge_rooms_neural_lattice_converyor_1.png`, `...a_intake_1.png`, `...out_1.png`; `characters/conveyor_operations/rivet_witch_conveyor_repair.png` | long waist-height line, intake furnace/scrap maw, operator stations, outtake press, power spine, tool reach and side aisles | Stiletto's drive position, Witch's repair access and worker witnesses occupy distinct ground; Security threshold opens onto the approach aisle |
| Brewery | `rooms/06_loopforge_rooms_cognition_brewery_1.png` | large open vat with suspended agitators, side filtration bank, instruments and pipes | perimeter working deck for Witch's intervention and Thrum's gathering; safe approach and spill apron |
| Weaving | `rooms/05_loopforge_rooms_weaving_room_1.png`; `characters/weaving_operations/thrum_weaving.png` | tall neural cylinders, paired loom banks, central aisle and raised harmonic control dais | Thrum faces the instrument from an open forecourt; Witch reaches the loom mechanisms from service aisles |
| Theatre | `rooms/07_loopforge_rooms_burnin_theatre_2.png`; `characters/theatre_operations/cathexis_theatre_revolution.png` | repeated conditioning cradles, three projection surfaces, lecturer podium, side booth and aisles | Cathexis can face an audience; a crowd has a gathering space, not a decorative chair icon |
| Cortex | `rooms/08_loopforge_rooms_brain_forge_3.png` | central assembly chamber, service ring, approach conveyors, cooling cylinders and operating console | several technicians can occupy separate control/maintenance positions; supervisor-specific outcomes remain unapproved |

These paintings disagree on exact sizes and are perspective compositions. The study extracts consistent relationships and functional staging, not a literal measured reconstruction.

## Delivery checklist

- [x] Inspect original room and supervisor-interaction art.
- [x] Expand spatial authority, preserve topology and regenerate valid crew routes.
- [x] Give architecture believable height, wall service density, floor rhythm and lighting.
- [x] Stage distinct procedural equipment kits in all six managed rooms, using consistent worker scale.
- [x] Provide explicit equipment-study inspection without changing first-turn admission.
- [x] Record placement footprints, service clearances and encounter anchors for the future builder.
- [x] Review desktop, phone, open/covered rooms, construction and live movement; iterate.
- [x] Run meaningful topology/footprint/kernel tests, lint and production build.
- [x] Update design deck and architecture docs.
- Publication and hosted-preview evidence: [PR #102](https://github.com/stepan-o/fruitful-lab/pull/102).

## Scope boundary

Equipment-study objects are authored prototypes, not purchased assets or completed room simulation. The normal opening still unlocks only Security and Conveyor. The study does not change the canonical console economy, unlock progression, supervisor actions or BDI. Source art is reused as reference; procedural meshes and textures are authored in code.

## Implementation boundary

`loopforge-floor-1/3` and `loopforge-commissioning/4` identify the expanded local fixture. The renderer consumes the same nine footprints and thirteen portals as routing and the floor-plan selector. `spatial/equipment.ts` supplies 21 equipment groups, operator tiles and room encounter rectangles; these records are validated for room containment, separation and unoccupied interaction ground. They are reference placements, not a finished build catalog.

The inspection toggle pauses the commissioning clock and exposes staged kits and worker-size reference figures in the later rooms. Returning to the opening restores covered wings and the same two-room admission. The six-metre doors stay centred on the original portal axes; the clearance gate itself remains a smaller worker-scale machine.

## Construction-capacity revision validation

- All **77 suites / 406 tests** and the stored snapshot pass with the required API origin. The 12 focused spatial/commissioning checks include clear plot containment, no overlap with machines, encounter ground or delivery aisles, original portal topology and deterministic 100-worker replay. Focused lint and whitespace validation pass.
- Optimized compilation, TypeScript checks and all 61 static routes completed locally; 46 retained asset releases verified. The final local build wrapper ended with signal 143 after producing its full successful route report; the generated production server was then used for the visual checks. The PR's hosted deployment is the independent final build gate.
- All six staged rooms inspected at 1280 × 720. The close **Work area** and expanded **Whole room** views serve different purposes. Corrected local shadow projection clipping after enlargement; foreground north walls now cut away when they would obscure the selected room, without removing floors, covered wings or admission checks.
- At 390 × 844 and 320 × 720: terminal, clearance gate and conveyor drive installation; Morning and Shift transitions; jam/restart and pace controls; 100-worker playback through to Night 2. At 320 px the document stays 320 px wide, with no horizontal overflow. This verifies controls in browser emulation, not native-device performance.
- Bounded final production-browser samples on Intel HD Graphics 620 at 1280 × 720: **38 FPS / 268 active meshes / 10 ms submission** in the Forge working view; **26 FPS / 378 active meshes / 11 ms submission** in its whole-room equipment-study view. Adaptive rendering had reduced internal resolution to 832 × 468. These are diagnostic samples, not a sustained performance pass; overview rendering still needs profiling as the building catalog grows.
- Static architecture remains material-batched and floors use repeated textures; wall detail repeats every two metres instead of multiplying one-metre geometry over the enlarged perimeter. No full-resolution per-tile scene was introduced. The worker fixture still follows authored routes and is not a crowd/task scheduler.

## Previous 105 × 75 revision validation (historical)

- Six topology/placement tests and five commissioning tests pass, including 100-worker deterministic replay. The full app run passed 74 suites / 388 tests; the three environment-dependent suites then passed their 17 tests with the required `API_BASE_URL`, for 77 suites / 405 tests plus the stored snapshot. Asset-tool tests pass.
- Focused React/TypeScript lint passes. The review preserves lazy renderer loading, event-owned commands, a separate local host, native dialog focus management, reduced motion and disposal of observers/scene resources. The scene interpolates outside React.
- Visual checks so far cover every staged room at 1280 × 720, Conveyor at 1440 × 900, and Security/Conveyor construction at 390 × 844. Floor texture clamping and washed-out process emissions were corrected during this pass.
- A bounded development sample in the equipment-study Brewery view reported 39 FPS at 1280 × 720 on Intel HD Graphics 620, with 165 active meshes and 13 ms render submission. This is not sustained profiling or mobile-device certification.

- Final optimized production build and type checking pass; 46 retained asset releases verify. The build used the repository-required API origin and a bounded 1280 MB Node heap.

- Production-browser checks: all three placements, 100-worker reset, Morning/Shift transitions, obstruction/release and pace changes pass. The 320 × 720 document remains 320 px wide with every live control visible. A 100-worker alarm sample reported 36 FPS at 1280 × 720, 242 active meshes, 2 ms pose update and 15 ms render submission on the same Intel HD 620. The crew is still a fixed route fixture, not an implemented crowd/task scheduler.

- The 100-worker production shift returned automatically to Night 2 with all three installations retained. Room admission remains two of six.
