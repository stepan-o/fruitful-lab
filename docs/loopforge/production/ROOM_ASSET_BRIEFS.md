# First-room scale and Meshy production kit

17 October 2026 · proposed calibration dimensions and asset requests. The existing whole-floor bounds have not yet been rebuilt to these interior dimensions.

## Read the reference correctly

The Lobby is a worn pay-claim hall: paperwork desks, terminals, stools, numbered bays, pipes and a recognisable entrance capsule. Security is a staffed bureaucratic checkpoint, with worker clerks checking other workers, short divided queues and LIMEN controlling the process. Neither should read as a huge empty hangar containing toy furniture. Conveyor can retain its generous industrial floor area for long chains and many operators.

Reference images in the design deck: Lobby room, LIMEN’s Security Operations, and STILETTO’s Conveyor Success 2. The original artwork is the material/silhouette authority; dimensions below are our practical staging proposals, not measurements extracted from a painting.

## Proposed occupied interiors

| Area | Current macro rectangle | Proposed usable dramatic interior | Staging requirement |
| --- | --- | --- | --- |
| Lobby | 72 × 48 m | 22 × 16 m | Four working claim desks plus two background bays, waiting space, readable entrance and exit |
| Security | 44 × 32 m | 18 × 16 m | Two inspection lanes, four clerical work positions, waiting/held bays and a shared Conveyor threshold |
| Conveyor | 80 × 56 m | Retain overall footprint; stage a compact initial work cell | Empty operator positions and the first arrivals are legible before filling the room |

Preserve the continuous outer building, existing room adjacency and equal first-floor structural height. Repartition the surplus Lobby/Security envelope into service circulation and non-playable plant/records space, with explicit doors and routes to existing neighbours. This needs authored floor, walls, occupancy and nav bounds together; do not shrink character scale or disguise the problem with a camera crop. Local lighting/cable canopies at roughly 4–5 m can establish a human-readable working volume below the common structural ceiling.

Reserve the existing Security–Conveyor connection as a two-sided encounter point. Actors stand on their own sides about 2–3 m apart, with a protected lane behind them so an argument cannot magically stop all circulation. STILETTO’s blades require wider clearance than a worker. Mark her pause/turn positions and test the full tool sweep; a speech action alone is not a collision solution. Separate mechanical tool clearance from navigation body radius.

The dimensions are an initial in-engine calibration target, to be reviewed with 1.8–2 m agents, the four desks and a 24-worker opening cohort. Final capacities come from actual paths and station reservations. There must be no compulsory clipping to fit the desired headcount.

## Generate modules, assemble the room in engine

Send each request below with the corresponding concept image and one approved worker scale reference. Keep modules separate so their pivots, interaction anchors, state and reuse can be controlled. Return a textured GLB delivery candidate, plus an editable source only where mechanical cleanup requires it. Keep source masters out of the client deployment.

### Request 1: Security inspection station

Create a modular Loopforge security inspection desk faithful to LIMEN’s Security Operations reference: worn dark green enamel, aged brass, black iron, dense practical fittings, cyan terminal, paper tray, badge reader and a rigid stamp or clamp. It is operated by a worker, not just scenic furniture. Approximate envelope 1.8 m wide, 0.9 m deep, work surface 1.05 m high. Leave 0.9 m clear operator access and a reachable front presentation tray. No robot, hands, baked text, smoke, light rays or floating glow geometry.

Deliver desk casing, terminal face, tray and moving stamp/clamp as separable named parts. Keep terminal screen suitable for a runtime texture. Put origin on the floor at the desk centre; preserve metric scale and identify forward direction. Aim at 8–12k triangles for the whole station, one 2K PBR material set where feasible, with emissive mask confined to the screen/indicators. This is a target, not permission to lose the silhouette.

### Request 2: Security checkpoint and queue rail kit

Create the tubular iron/brass checkpoint from the same reference: one 2.4 m-wide portal, two physically separate hinged gate leaves, badge-reader plinth, and a reusable 1.5 m queue rail segment with end posts. Portal height about 3.2 m. Preserve clearance for the approved supervisors and their tools. Gate leaves must not be fused into the frame. No people, solid energy curtain or prelit bloom.

Aim at 12–18k triangles for portal and gates, 1–2k per rail segment. Hinge placement and actual moving geometry will be inspected and corrected offline. Supply clean closed geometry where visible, base color, normal, metallic/roughness and a small emissive mask. We will instance repeated rail segments and operate the gates from engine state.

### Request 3: Lobby claim desk variant

Use the Lobby room reference. Build a 1.6 × 0.85 m pay-claim desk at 1.0 m working height, with a battered CRT enclosure, paper slot, service lamp, two trays, worn brass edging and a separate adjustable stool. Reuse the visual language of the Security desk but make this a worker bureaucracy station, not a security weapon. Leave the tabletop interaction area clear. No robot, piles welded across the working slot, readable invented labels or baked illumination. Approximate 8–12k triangles; share material vocabulary with the Security station.

### Request 4: Paperwork prop kit

Produce a rigid worker pass/badge, thin document board, small packet of papers, empty tray and stamp. Each item must remain an independent rigid prop. Keep dimensions plausible for the approved worker’s palm; avoid individual sheets as thick slabs. One shared 1K atlas, approximately 200–1,500 triangles per item. Labels and claim state are added by the app. We need deliberate grip, offer, accept and put-down anchors, which will be authored against the actual hand rig after intake.

### Request 5: Conveyor cradle work cell

Use STILETTO’s Conveyor Success 2 and the existing neural-lattice intake art. Build one reusable industrial cradle and a short transfer bed with grounded, grimy iron mechanics, brass clamps, exposed drive housing and clearly separable latch components. No characters and no complete room. Start with a 1.2 m-long × 0.8 m-wide cradle on a roughly 0.9 m-high working surface; validate against the approved carry pose before finalizing. Provide a clear prop seat and two reachable latch handles. Keep the transported object separate from the machine and do not invent the final brain-to-robot activation process. Aim at 12–20k triangles for the hero cell; repetitive background cells will use simpler variants.

## Intake and performance gates

Meshy can remesh and rebake texture maps, but exported polygon counts depend on triangle/quad topology; inspect actual GLB triangles. It does not guarantee precise socket alignment, moving-part separation or correct mechanical pivots. Those are intake/Blender tasks. See [Meshy Remesh API](https://docs.meshy.ai/en/api/remesh) and [simplification recipe](https://www.meshy.ai/developers/cookbook/recipes/simplify-3d-model/).

Keep small flat pipes, labels, fasteners and wall wear in texture/normal layers when their silhouette is irrelevant. Use real geometry for reachable rails, doors, machinery, silhouettes and anything an agent touches. Use shared material atlases, instances for truly repeated static parts, and a small shadow-casting set. No permanent light per desk or particle system per screw. Budget whole-room draw calls, texture memory and animation cost, not just individual triangle counts. The initial scene limit is two foreground actors; the intended 24-worker room still needs measurement.

Version published GLBs/textures by content hash and store sizes, materials, triangle counts, bounds, pivots and affordance anchors in manifests. Runtime positions belong to room prefabs; agents reserve those anchors rather than deriving contact from arbitrary mesh bounds. This keeps fixture-to-final-art replacement compatible with BDI action admission.
