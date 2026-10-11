# Factory floor: scale, grain and motion

11 October 2026 · Design proposal and build checklist · **Renderer changes not implemented by this pass.**

## Decision

Keep the large, connected factory. Make an **active work area** the normal unit of play and composition. Give factory overview, work and close interaction distinct visual responsibilities within one continuous, navigable world. Author detail for its projected size, rather than putting the same noisy material on every object and hoping zoom will resolve it.

The visual target is Loopforge's oppressive, engraved industrial realism: substantial machinery, recognisable robot bodies, bureaucratic clutter, deep recesses and selective hot light. Performance and that identity are joint acceptance gates. “100%” means every required gate passes on the declared devices and views; the design is not evidence that unbuilt scenes already pass. The owner judges the artistic result.

This precedes another factory build. The first implementation must prove one lobby work area, one Security threshold and one conveyor work area before producing the remaining rooms.

## Diagnosis from the actual images and code

Reference authority: original lobby `01_loopforge_factory_rooms_lobby.png` and forge `04_loopforge_rooms_neural_lattice_converyor_1.png` in the old repository. Compare them with the hall, desk and phone evidence from [the previous pass](LOBBY_VISUAL_PASS_2026-10-11.md).

| Current mismatch | Why it matters | Design response |
| --- | --- | --- |
| The 26 × 29 m lobby working frame spends much of its image on floor; desks and robots become punctuation | A room feels large but its activity is hard to read | Compose around an operating cluster; preserve the rest as navigable context |
| The desk close-up is more legible but loses the doorway, arrival and queue relationship | Detail inspection alone cannot carry the operating loop | Add a middle composition that shows a full action and its immediate upstream/downstream connection |
| Patina repeats across differently sized model faces; the floor has dense contrast at a similar visual strength | The image reads as mottling instead of machinery/materials | Calibrated world-scale UVs, distinct material values and authored macro/mid/micro detail |
| Existing generic material code derives bump from generated colour noise; new lobby maps are diffuse-only | Relief can turn dirt into false geometry; the new surfaces can still look flat | Author/bake relief from intended form, separately from dirt and illumination |
| FXAA, bloom and adaptive resolution coexist with fine linework | Their combined filtering can erase useful lines or leave shimmering texture | Compare effects separately at real delivery sizes before choosing the final combination |
| Worker gait uses a wall-time phase, while position follows tick records | Foot motion is not guaranteed to match distance travelled | Stride phase follows travelled distance; contacts are authored at the real equipment sockets |
| A 30 fps diagnostic sample is the available performance evidence | It hides frame-time tails, GPU costs, memory growth and loading stalls | Instrument those separately and test sustained operation/camera changes |

The 72 × 48 m lobby, 15 m common hall height, 1.9 m nominal worker and accepted portal graph remain the spatial authority. One tile is approximately one metre. Do not shrink rooms, enlarge workers, move doors or fill construction reserves to rescue a screenshot. The concept paintings are compositions, not dimensioned blueprints.

## Four scales that must agree

1. **World scale:** metres, paths, equipment footprints, worker contacts and admission. These affect simulation and construction.
2. **Play scale:** the cluster the player currently operates—its input, work, buffer and exit. This establishes the normal camera composition.
3. **Image scale:** projected pixels available for a worker, warning gesture, moving part or inscription. This determines detail, framing and material frequency.
4. **Time scale:** tick-owned task/travel progress, the compressed shift calendar and the animation that depicts it. These cannot be one uniform speed multiplier.

Changing camera, texture or detail tier must not alter world footprints, path costs, output, accidents, worker identity or the event log.

## Camera and interface contract

Use a restrained perspective camera in Babylon, with a consistent three-quarter working angle. Start calibration at 35–40° vertical field of view and roughly 35–45° above the floor. These are candidates, not final constants. Keep orbit/pan/zoom; provide authored starting angles, a return-to-work control and directional room transitions. Compare an orthographic candidate once in the calibration bench, but prefer perspective if it meets the same readability gates while retaining depth.

| View | Player question | Required read | Initial projected worker target |
| --- | --- | --- | --- |
| Factory / room overview | Where is the problem, connection or free build space? | Room identity, process routes, blocked/open threshold, affected cluster | No individual-gesture promise; truthful aggregate cues lead to the relevant work area |
| Work area — default operating view | What is moving, waiting or going wrong, and where can I act? | Several workers, one meaningful equipment sequence, immediate buffer/exit | Approximately 56–90 CSS px tall for standing workers near the action |
| Interaction / inspection | What happened to this worker or mechanism? What am I changing? | Pose, contact, specific attachment and local consequence | Approximately 120–220 CSS px; worker identity survives the transition |

These numbers are calibration starting points. Record the projected bounding box of the actual worker, not an estimate from camera radius. A required moving feature should span at least 3 internal render pixels at its smallest supported work view; make its action readable through a larger silhouette if it cannot. Important UI text remains native text, not a 5-pixel label baked into a wall.

The same view and navigation serve night construction and production. Build mode adds footprints, approach clearance and connection previews. It never swaps to a disconnected model of the room. Selected equipment, target and orientation survive mode changes.

In the normal view, aim for at least 70% unobscured scene height on desktop and 60% in portrait. These are proposed layout gates with drawers closed. Keep a compact status strip and contextual controls; use the existing focused interfaces for briefings, room policy and equipment purchase. Opening a drawer may temporarily reduce that space without silently zooming the action to an unreadable size.

On phones, show fewer workstations at the same legible size. Pan along the process, with a small room locator and explicit previous/next work-area targets. Do not fit the entire desktop scene into portrait. Landscape, tablet and ultrawide preserve subject size; added width reveals context, rather than making the hero tiny or stretching it. A 44 × 44 CSS-pixel hit area can select a smaller object without enlarging its physical model. Close targets need an inspector/list alternative.

Events may suggest a camera focus; ordinary production must not repeatedly steal the camera. A consequential paused event can offer a clear cut-in and return to the saved position. Reduced motion uses immediate or short fades and a complete readable pose.

## Grain is a hierarchy, not an overlay

There are three separate things to calibrate: **shape/detail granularity**, **surface wear/engraving**, and optional **camera noise**. They need separate controls and budgets. Grain is not a substitute for form, material response, lighting or animation.

| Frequency | Examples | Treatment and viewing rule |
| --- | --- | --- |
| Large masses | Door arch, furnace, desk, robot thorax, pipe banks | Real silhouette and coherent values. Read before texture is enabled, including from room view |
| Working detail | Panel divisions, cable braids, drawer rims, floor joints, hand/paper contact | Geometry where it changes silhouette/contact; trim textures and deliberate relief elsewhere. Survive the normal work camera |
| Fine finish | Scratches, soot flecks, engraved strokes, tiny rivets | Restrained albedo/roughness/normal detail. Filter or fade before becoming subpixel sparkle; strongest only in inspection |
| Camera texture | Fine film grain or CCTV interference | Optional final polish, low contrast and separate from surface detail. Never cover text or a decision target; not required for identity |

Build a material sheet with iron, olive enamel, brass, paper, stone and glass under the same neutral and room light. Give them different values, roughness and wear patterns. Dirt collects in joints, touch wear on handles, paper catches task light, glass gets a bounded reflection. Do not tint everything brown and turn up grain or global brightness.

Use physical texture scale: a paper sheet, drawer and wall panel cannot share an unscaled 0–1 texture that stretches one scratch to three different sizes. Use trim/atlas regions with declared world dimensions and separate authored decals for distinctive marks. Keep macro wear variation separate from repeatable fine finish. Variant selection uses stable visual seeds, never the gameplay RNG.

Prepare far/work/close material responses. At distance, remove fine normals and busy linework while preserving silhouette, broad grime, lit windows and colour grouping. Select tiers using screen coverage/projected pixels with hysteresis, not only metre distance. Build the mips and compressed variants from the final intended maps; inspect them in motion at the actual render scale. A source PNG looking good at 100% is not acceptance.

Compare a clean image first, then antialiasing, then selective bloom, then optional grain. No full-scene blur or aggressive sharpening to conceal a mismatch. A lower-resolution performance mode must still pass the work-view silhouette and action tests. If it does not, reduce unseen detail and effects or narrow the visible work area before accepting blur.

## Composition and light

The worker kit also needs its own silhouette pass against the original factory art: cast head/face, recessed optics, a weighted torso, articulated limbs and recognisable hands/feet. Preserve machinery scale through joints, grip and gait; adding a textured sphere head to generic limbs is not an accepted final character. Test silhouette, mid-distance work pose and close contact separately.

The normal lobby composition should contain a **complete action**: arrival → waiting space → desk and clerk → response → departure toward Dispatch. Start with two active desks in a roughly 10–14 m-wide local cluster. This is a framing/layout candidate inside the approved hall, not a new room size. Keep the actual passage clear and the central construction/movement space usable. Allow the broader hall to recede behind repeated architecture, softer contrast and controlled cutaways.

Carry the art's framing elements: the paperwork wall behind the activity, a substantial door/pipe mass on one side, and the floor insignia in the arrival composition. Exact placement may differ from the painting to respect the accepted portal. Do not create a false exit to mimic the artwork.

Lighting must explain depth: stable architectural fill, local task pools, contact at feet and desks, then event accents. Bake static indirect illumination where useful, with separate movable-object contacts and night/morning contributions. Lightmap texel density follows camera need. No moving desk shadow baked into the floor; no painted directional reflection that fights the live lamp. The conceptual key is warm work against cooler, quieter recesses—not uniformly black surroundings.

Keep the beacon as an event source. Cyan idle, green production, ember attention and red accident retain their established meanings, in brief impulses with dark intervals. For the 3D floor, source, cone, obstacle and receiver use the same world transform. Cast a bounded moving shadow near the relevant action; let light reach farther only where the camera benefits. Avoid multiple transparent cones/smoke layers covering the entire frame. Idle beauty must not resemble an unresolved alarm.

## Motion, travel and the compressed day

The study currently advances workers about 1.1 m/s in steady mode and 1.44 m/s when pushed: 55/72 position units per 50 ms tick, with 1,000 units per tile. The 60-second fixture represents an 18-hour shift. A long cross-factory walk can therefore outlast a shift. That mismatch needs explicit task/time design, not faster legs or invisible teleports.

Proposed contract:

- Keep approximately 1.0–1.5 m/s as the initial visible gait range; derive stride from distance and foot contact. Changes in discipline/stress affect permitted task behaviour and authored poses, not arbitrary random jitter.
- Preposition the scheduled crew during the night/morning handover using deterministic assignment and travel costs. Show the transition honestly. Once the continuous shift begins, positions and transfers remain authoritative.
- Put repeatedly coupled starter activities near their shared threshold. A normal local handoff should be visible within roughly 5–12 seconds; a Security–Forge transfer can take longer and consume real operating time. Validate these candidates against the 60–120 second day budget.
- Long transfers may span work windows or use later purchased transport. Their costs cannot disappear when offscreen. Do not promise every worker traverses the whole 280 × 200 m envelope each day.
- The 18-hour calendar is an authored compression of work, not a ×1,080 multiplier applied to body animation. Task durations, yields, shifts and eventual pay rules must be calibrated together in the kernel. This pass does not approve new throughput numbers.
- Render a machine's phase from authoritative progress. A jam stops useful work; a brief recoil/settle is cosmetic. No extra brain appears because a clip completed. Repeatable work loops can span many ticks, but meaningful start/completion events retain IDs.
- Reconstruct presentation after a pause, hidden tab or dropped frame from committed state; do not play a backlog of every decorative stamp/flash. Preserve consequential events in the trace and attention queue.

A useful motion grammar is anticipation → contact → effort → outcome → settle. At work scale, a returned form might be a held sheet, halted feed and worker recoil. At inspection scale it adds fingers, stamp and face optics. At room scale it becomes an actual queue/idle desk and a focus target. These are views of the same event, not separate generated stories. The current staged clerks remain explicitly staged until task records exist.

## One implementation architecture

Keep Babylon.js and the renderer-independent, integer-tick kernel. Do not introduce another renderer, one React component per worker or an LLM into the frame loop.

| Layer | Owns | Must not own |
| --- | --- | --- |
| Kernel and spatial data | Entity IDs, positions, paths, room admission, task/production progress, outcomes | Meshes, pixels, asset loading or camera-dependent output |
| Public projection | Visible facts/events and stable IDs; permitted worker information | Hidden motive values leaked through a pose or debug label |
| Presentation recipes | Camera bounds, emphasis targets, clip/state mapping, detail variants | New outcomes or independent worker movement |
| Babylon view | Interpolation, geometry, materials, light, animation and picking proxies | Payroll, task completion or authoritative collisions |
| React interfaces | Commands, accessible controls, dossiers, briefings and summaries | Per-frame transforms |

Add versioned camera/work-area definitions, prefab metadata, physical material scale and presentation event recipes. Keep visual recipe versions separate from sim/schema versions. When a low-detail proxy becomes a close actor, bind the same entity ID, position, task and clip phase; do not reset it. Distant crowd summaries must derive from real entities. They are not invented extras that suggest false production.

Partition static geometry and repeated instances by room/work area and material. The current batching is a useful baseline, but a whole-factory material batch would prevent effective visibility control. Thin instances are useful for stable repeated props; frequently changing actors need a measured approach. Prototype one rigged/paletted or cached-pose worker batch against the existing articulated-part approach. Choose by measured cost and contact quality; do not make GPU skinning an untested dependency.

Load the active detailed area, shared actor kit and a bounded adjacent-area cache. Retain light room shells for overview. Visibility affects drawing, not simulation. Use a minimal placeholder with truthful footprints while assets load, and preserve commands/state on failure. Only adopting a complete compatible asset release may replace that placeholder.

## Acceptance budgets

These are proposed release gates and initial engineering envelopes, not claims about current performance. Record browser, viewport, DPR, internal resolution, asset release, workload and quality tier. The desktop anchor is the available Intel HD 620 laptop; a real midrange phone must be named and measured before calling mobile performance complete.

| Gate | Initial target |
| --- | --- |
| Modest device, 100 simulated workers | 30 fps target; ≥95% of warm frame intervals ≤34 ms, p99 ≤50 ms, no recurring >100 ms stall |
| Capable desktop | 60 fps target; ≥95% intervals ≤17 ms, with the same semantic/visual requirements |
| Warm frame work, modest device | CPU simulation + projection ≤4 ms, pose/culling/submission ≤8 ms, GPU ≤24 ms at p95; measure overlapping stages separately, never sum CPU submission as GPU time |
| Input | Visible command acknowledgement within 100 ms p95; relevant deterministic state change within the next eligible tick; dragging does not wait for model/text generation |
| First usable factory view | Target ≤4 s cold at a declared 20 Mbps/80 ms RTT profile; warm ≤1.5 s. Measure renderer-ready separately from page LCP |
| Initial active-area media | Target ≤6 MB compressed, with staged loading; initial decoded textures/render targets ≤128 MiB as an asset ledger estimate, peak ≤192 MiB during a bounded adjacent-area transition |
| Lifetime | After warmup, 20 area/attachment switches return to stable resource counts; no monotonic retained heap/texture growth or context loss |
| UI delivery | Shared field goals remain LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1; field data is still unmeasured. A 3D canvas is not certified by Lighthouse alone |

Draw calls/triangles are diagnostic envelopes, not portable FPS guarantees. Start the work-area prototype around ≤150 total draws including shadows/effects and ≤250k visible triangles on the modest tier, then replace those guesses with measured material/pass costs. Preserve room character, actor silhouette and required feedback on every tier; reduce distant microdetail, unimportant live lights, particle overdraw and resolution in that order, subject to the readability floor.

Use GPU timer queries where available, with disjoint results rejected. Otherwise mark GPU timing unavailable and rely on observed frame intervals without labelling `scene.render()` CPU duration as GPU time. Record actual browser memory where available and asset/resource ledgers elsewhere; WebP transfer size is not GPU memory.

The previous 30 fps samples at 1280 × 720 are encouraging baseline evidence, not a pass of these sustained gates. More headroom must be demonstrated before adding all later rooms.

## Build sequence — each step produces reviewable evidence

| Step | Build output | Exit gate / failure response |
| --- | --- | --- |
| 0. Freeze the contract | References, target devices, camera candidates, required visible actions, baseline capture and repeatable replay | Measure actual actor pixels, frame intervals, startup and resource counts; no guessed acceptance |
| 1. Find the playable composition | Grey/clean-material lobby cluster plus existing Security/Forge; wide/work/close and responsive framing | In five seconds, identify active work, waiting/blocked work and next action without help text. Correct composition before adding detail |
| 2. Calibrate the finish | Shared material sheet, macro/mid/micro controls, physical UVs, far/work/close variants and separate light/AA/bloom comparisons | Recognisable Loopforge from silhouette/light first; no crawling grain or mush on slow pan, 320/390/768 and desktop. Re-author maps/values if it fails |
| 3. Prove bodies and machinery | One reusable worker, desk/feeder and Security–Forge transfer; walk/contact/work/wait/jam/release clips or procedural poses | Feet/hands remain attached, gait tracks distance, no toy vibration or invisible outcome. State is identical across views and render rates |
| 4. Prove depth and feedback | Static light solution, movable contact treatment and one correctly placed beacon impulse | Source–obstacle–receiver alignment from several angles; event catches attention without flattening materials or hiding the action |
| 5. Prove the delivery path | Typed prefab manifest, required sockets, visibility chunks, validated dependencies, detail tiers, bounded loading/disposal | Bad/missing asset fallback, repeated swaps and 100-worker replay meet the budgets. Choose imported GLB/KTX2 only after the measured need and quality check |
| 6. Run the combined slice | Arrival → local task → blocked flow → player action → visible recovery, on desktop and actual phone | All visual, interaction, performance and truth gates pass together; owner approves the feel |
| 7. Expand | Apply the approved kit grammar to later work areas and rooms | Re-run worst-case visibility and transitions after each room; do not fill the whole factory first |

Implementation workstreams remain sequential on this memory-limited development machine: author/package → bounded build → production preview → capture/profile. Do not run multiple compilers and live 3D previews at once. Offline baking, when added, follows the same resource discipline.

## Evidence package and decision rule

For each candidate, save the same clean still, final-lit still and 10–15 second slow pan; then a 60-second replay with 10 and 100 workers. Include overview → work → close transitions, selected-worker continuity, a purchase/attachment change, a jam, hidden/resumed tab and motion-off mode. Fixed inputs/seed permit frame and outcome comparison. Reference original art alongside the real renderer, never substitute a concept render for implementation evidence.

The owner should be able to recognise Loopforge, read what workers are doing and enjoy watching the factory before opening diagnostics. The engineering record must demonstrate responsiveness and headroom on the same candidate. Neither a beautiful still at poor frame rate nor a smooth generic scene clears the gate. The first combined slice is the decision point for further construction.

No new user artwork is required to start. Missing production assets are the close/work/far worker and equipment variants, calibrated material maps, architectural lighting data and animated event poses. Original concepts supply the art authority; they do not supply those deliverables automatically.

## Research and limits of inference

Primary sources checked 11 October 2026. Their techniques inform the proposal; the Loopforge targets, scale ranges and budgets above are our design choices.

- [Factorio art workflow](https://www.factorio.com/blog/post/fff-146): models are revised after in-game inspection; authored contrast and shape clarification are part of production. Borrow the feedback loop and purposeful contrast, not its sprite renderer or assets.
- [Factorio high-resolution redesign](https://www.factorio.com/blog/post/fff-144): changing resolution can require redesign rather than a larger render. This supports authoring for the intended viewing size.
- [Factorio texture streaming and overdraw](https://www.factorio.com/blog/post/fff-264): zoom, texture residency and repeated transparent drawing interact. Use that lesson to profile our smoke/glare and texture tiers; do not transplant its old GPU timings or build virtual texturing prematurely.
- [Babylon screen-coverage LOD](https://doc.babylonjs.com/features/featuresDeepDive/mesh/LOD/): supports size-sensitive mesh selection. Our readability/hysteresis policy remains additional design work.
- [Babylon thin instances](https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/thinInstances/): shared visibility and add/remove tradeoffs justify grouping by work area, rather than one global instance batch.
- [Babylon optimization](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene/) and [KTX2](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/ktx2Compression/): available runtime techniques to validate against the pinned project version, not automatic speed guarantees.

## Status of this design pass

The plan, its dedicated `design#floor-scale` tab, engine-reader link and companion documents are delivered as a proposal. The tab was checked at desktop, 390 and 320 CSS-pixel viewports with no horizontal overflow or browser warnings/errors; its generator and component lint pass. No factory renderer, simulation, geometry or material implementation was changed in this pass. Steps 0–7 above are the implementation checklist still to execute.
