# The first working Conveyor

21 October 2026 · active production plan · kit and cumulative 1,000-credit cap approved

The first brain arrives dirty in a battered crate. sam’s intake station lifts it into a tray. At Brain Wash, jets and a worker’s hose strip the dirt away; runoff goes into a drain. A clamp seats the clean brain on the main belt. The Lattice Forge closes around it and compresses it to roughly the size of a supervisor’s head. The small finished brain leaves on an output cradle. A player should understand that journey without a diagram.

## The reference

The original room art is authoritative for shape, materials and atmosphere. The owner’s latest process definition is authoritative where the old images are ambiguous. Do not mistake the later Brain Forge/Cortex room for this initial Lattice Forge.

- Intake: `04_loopforge_rooms_neural_lattice_a_intake_1.png`. sam’s approved brief explicitly extracts the central heavy tray carrier. Keep the broad intake mouth, trays, riveted crates and nearby Scrap Maw.
- Brain Wash: `04_loopforge_rooms_neural_lattice_a_intake_2.png`. Keep the exposed rinse manifold, soaking brains, hand hose, catch basin, drain and damp work apron. This is literal cleaning, separate from later Theatre conditioning.
- Main belt: `04_loopforge_rooms_neural_lattice_converyor_1.png`. Heavy articulated chain, individual clamping carriers, inspection points, head-sized output, dense service walls and clear operator access.
- Forge: `04_loopforge_rooms_neural_lattice_out_1.png`. The enormous vertical compression head is the room’s destination and strongest silhouette. The machine must visibly compress the workpiece; a generic furnace cannot stand in for it.
- Working state: `stiletto_conveyor_success_1.png` and `rivet_witch_conveyor_repair.png`. Overdrive, stopped line and repair need distinct visible states. No permanent wall of fire: reserve heat, sparks and steam for the process that causes them.

## Generate a kit we can operate

| Asset | Meshy contribution | Engine / Blender completion | First-pass floor-detail target |
| --- | --- | --- | --- |
| Brain master | Uneven lobes, deep folds, convincing organic silhouette | Dirty, rinsed/wet and compressed states from one compatible mesh; clean compression shape, no skeletal rig | 2–4k triangles; 0.6–1k distant |
| Brain crate | Battered riveted body, side handles, slatted/drained base | Separate lid if needed; independent brain instances, empty/full states, carry grips | 1–3k |
| Intake chassis | Wide iron loading mouth, tray lift housing, inspection ledge | Separate lift tray, guard, lever; crate seat and two hand targets; accepted/rejected item routes | 8–12k |
| Brain Wash housing | Stained basin, rinse hood/manifold, maintenance panels | Separate valves/nozzles; simple hose and spray, dirt fade, runoff; dry/running/blocked states | 8–12k |
| Main-belt drive housing | Distinctive ribbed motor and heavy bearing castings | Exact modular track, rollers, plates and chain authored for repeatability; proper path and item spacing | 3–5k housing; 1–2k per instanced segment |
| Carrier / clamp | Worn cradle silhouette and cast jaws | Independent jaws, prop socket, open/closed/jammed states | 1–2k per instanced carrier |
| Lattice Forge frame | Towering iron/brass press frame, pressure pipes, relief panels | Collision and operator clearance; separate compression mechanism and interlocks | 12–18k |
| Forge compression head | Heavy shaped platen, inset lattice surface | Guided ram, contact surface, squash timing, pressure/release states | 4–6k |
| Operator console | Battered casing, gauges, switches, guarded lever | Readable runtime labels, needle/lever pivots, work and repair sockets | 2–4k |
| Scrap Maw | Riveted reject bin/crucible with a memorable mouth | Separate opening and reject path; scrap fill, blockage and cleanout | 3–5k |
| Security desk | Brass-edged inspection desk and records housing from LIMEN’s art | ID tray, stamp, register and reachable clerk positions; ed/gus interactions | 6–10k |
| Checkpoint portal | Heavy frame and reader pedestal | Separate gate leaves and authored pivots; clear passage for STILETTO and her blades | 6–10k |

No complete fused-room generation. Precise moving parts, handles and contact surfaces are authored or separated offline; generated geometry is not assumed to have usable pivots. Do not generate workers, text, steam, flames or a brain fused into its machine. Every station receives floor origin, metric bounds, travel axis, simple collision, operator spot, approach lane, grip targets, item input/output and repair anchors.

The belt and its carriers share materials. Brains remain separate objects with one shared material family. A full crate uses reused brain instances, not another texture set for every brain. Keep the crate itself useful when empty, carried, stacked or overturned.

## Room dressing with a job

Use a small shared library for service pipes, junctions, cable trays, wall panels, floor grates and railings. Most are authored modular pieces; their exact dimensions matter more than AI variation. Bake bolts, scratches and embossed panel decoration into normal/roughness maps. Add readable signs in engine, including a wall clock, pressure warnings and station labels.

The intake needs a crate stack and empty-crate return. Brain Wash needs a dirty-water sump, drain, hose hook and drip tray. The belt needs an accessible drive, jam point, emergency stop and service hatch. The Forge needs pressure gauges, a hot output rack and a safe operator position. These provide places for work, repairs, shortcuts, arguments and accidents; they are not random clutter.

Retain dark iron and brass, but keep broad backgrounds behind the blue workers and pale/red supervisors relatively quiet. Wetness can be a material patch. Local warm emissive surfaces establish heat; they do not require a shadow-casting light on every item. Match reference depth and density through layered silhouettes and wall dressing without filling every walkable metre.

## Lobby and Security extension

[Before the factory lets you in](SECURITY_LOBBY_ASSET_BUILD_PLAN.md) develops the entrance, assignment wall, working checkpoint and access controls from the original room and interaction art. It retains the desk and portal already listed here and proposes four additional asset families within the same 1,000-credit cap. Its proposed reserve reallocation is recorded separately; do not count the shared assets twice.

## Budget proposal

The owner extended the original 500-credit cap by 500: cumulative authorization is 1,000. Current actual spend is 480, with no pending paid jobs. The initial cast consumed 400; the room pilot has consumed 80. Remaining total reserve: 520.

Recent textured model jobs in this project cost 30 credits each. That is a planning basis, not a guarantee of future API pricing. Reserve each actual request before submitting it, including retries and remeshing, and never overrun the approved total.

1. **Pilot ceiling: 150 credits.** Brain, carrier, Brain Wash and Forge frame. Fit them in a running scene with bob, sam and STILETTO. Check room-scale readability, believable proportions, inspection close-ups and HD620 rendering before expanding the kit.
2. **Remaining kit and Lobby/Security extension: up to 360 credits.** Reuses the originally budgeted desk and checkpoint; the four extra entrance/security families are included once.
3. **Iteration/remesh reserve: 90 credits.** Correct weak silhouettes, fused functional parts, texture mismatch and delivery budgets. This is headroom, not a spending target.

The original 600-credit room allocation is now 80 spent + 70 remaining pilot + 360 remaining kit + 90 reserve. The cumulative cap, including the 400-credit cast, remains 1,000. No new Meshy requests are needed merely to revise the scene script or dialogue clock.

## Production order and acceptance

With this kit and ceiling approved, prepare isolated image briefs from the cited art, with approved workers for scale. Generate the pilot, inspect every side, separate mechanisms and optimize the delivery meshes. Put the pilot into the same station/action architecture used by the tutorial. Record the numbered body/parts, interaction and delivery briefs in the existing model-brief convention.

Target 80–120k visible room-prop triangles for the first occupied bay, excluding cast; one or two material sets per major machine, shared small-prop atlases, 1K maps for most props and 2K only where hero inspection justifies them. These are initial constraints to test, not a performance certification. Distant room summaries use simpler geometry and baked surface detail; close supervisor/interaction shots can use the higher detail tier.

Test with the actual opening cast, speech, camera changes and active machines on the HD620. Compare room-only and cast-plus-room cost, frame-time percentiles, stalls, draw calls, texture residency and cold load. Test reading holds separately: animation continues while the factory clock is held, so their rendering cost remains real. Use bounded spray/steam/sparks, no real fluid simulation or per-brain shadows. Verify 320/390-pixel layouts and reduced effects; do not claim physical-phone performance without testing one.

Done means the player can see a dirty brain enter, get washed, travel under control, compress and leave—and bob can operate each part without hands passing through it. Only then expand decorative density.

## First implementation · 21 October

The opening now has an authored moving belt, independent carrier/press, bounded rinse streaks and practical fixture accents. The brain and wash housing have optimized delivery candidates; dirty and processed maps reuse the brain UVs. [Numbered rebuild briefs and current measurements](model-briefs/room-kit/README.md). Carrier and Forge frame generation, final room art, prop contacts and the sustained performance gate remain open.
