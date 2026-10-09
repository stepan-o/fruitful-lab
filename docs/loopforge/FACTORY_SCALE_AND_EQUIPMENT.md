# Factory scale and equipment study — 9 October 2026

Owner direction: preserve the original floor's room proportions and connections, enlarge its tile count, and calibrate equipment/worker/architecture relationships to the original concept art. Future purchases and construction must place actual equipment; this pass stages prototypes for scale review.

## Scale decision

- Expand every room footprint and portal anchor by 3: 105 × 75 one-metre design tiles, nine times the previous floor area. The metre is a working design convention, not a measurement claimed from the paintings.
- Worker body: approximately 1.8–2 m. Belt surface: 1.43 m; a deliberate slightly high industrial work surface with brain cradles on top. Brains ~0.8–1 m across in their carrier; not room-sized icons.
- Conveyor bay: 30 × 21 m. Security: 12 × 18 m. Large process halls: 21–33 m across. Portal clearances retain their original relative locations; clearance machinery funnels through a smaller human-scale lane.
- Walls 5 m in Security, 7 m in Conveyor, 7.5 m in Theatre, 9 m in Brewery, 9.5 m in Weaving and 10 m in Cortex; machinery and services follow their room’s height, low camera-facing cutaways. Room focus must place the viewer inside these relationships; overview is a navigation view, not a reason to enlarge the robots.

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

`loopforge-floor-1/2` and `loopforge-commissioning/3` identify the expanded local fixture. The renderer consumes the same nine footprints and thirteen portals as routing and the floor-plan selector. `spatial/equipment.ts` supplies 21 equipment groups, operator tiles and room encounter rectangles; these records are validated for room containment, separation and unoccupied interaction ground. They are reference placements, not a finished build catalog.

The inspection toggle pauses the commissioning clock and exposes staged kits and worker-size reference figures in the later rooms. Returning to the opening restores covered wings and the same two-room admission. The six-metre doors preserve the enlarged architectural proportions; the clearance gate itself remains a smaller worker-scale machine.

## Validation record

- Six topology/placement tests and five commissioning tests pass, including 100-worker deterministic replay. The full app run passed 74 suites / 388 tests; the three environment-dependent suites then passed their 17 tests with the required `API_BASE_URL`, for 77 suites / 405 tests plus the stored snapshot. Asset-tool tests pass.
- Focused React/TypeScript lint passes. The review preserves lazy renderer loading, event-owned commands, a separate local host, native dialog focus management, reduced motion and disposal of observers/scene resources. The scene interpolates outside React.
- Visual checks so far cover every staged room at 1280 × 720, Conveyor at 1440 × 900, and Security/Conveyor construction at 390 × 844. Floor texture clamping and washed-out process emissions were corrected during this pass.
- A bounded development sample in the equipment-study Brewery view reported 39 FPS at 1280 × 720 on Intel HD Graphics 620, with 165 active meshes and 13 ms render submission. This is not sustained profiling or mobile-device certification.

- Final optimized production build and type checking pass; 46 retained asset releases verify. The build used the repository-required API origin and a bounded 1280 MB Node heap.

- Production-browser checks: all three placements, 100-worker reset, Morning/Shift transitions, obstruction/release and pace changes pass. The 320 × 720 document remains 320 px wide with every live control visible. A 100-worker alarm sample reported 36 FPS at 1280 × 720, 242 active meshes, 2 ms pose update and 15 ms render submission on the same Intel HD 620. The crew is still a fixed route fixture, not an implemented crowd/task scheduler.

- The 100-worker production shift returned automatically to Night 2 with all three installations retained. Room admission remains two of six.
