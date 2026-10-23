# Factory floor: scale, grain and motion

**Current direction — 12 October 2026:** The world is prebuilt; all player construction and the night-zero installation tutorial are removed. First entry is the morning console and mandatory leadership call. [Agents: character, movement and contact](AGENT_CHARACTER_AND_ANIMATION_DIRECTION.md) defines the next art/animation/BDI pipeline and supersedes earlier building references in this record. Current procedural figures remain placeholders; production rigs, general BDI and paired acting are not yet implemented.


11 October 2026 · Design proposal and build checklist · **Renderer changes not implemented by this pass.**

## Decision

Keep the large, connected factory. **The producer console is the default entry and return point for factory observation. Select one room and see that same live room through three authored CCTV angles.** The room feeds show work and consequences; focused action workspaces carry construction, operating controls and consequential commitments. The core loop should feel like “I am the actor”, with observation helping the player decide and understand what they changed.

This owner clarification supersedes the previous proposal of a freely navigable work-area camera as the default playing interface. Three CCTV angles are three physical viewpoints, not the overview/work/inspection detail levels. Author detail for its actual projected size in each feed and action workspace.

The visual target is Loopforge's oppressive, engraved industrial realism: substantial machinery, recognisable robot bodies, bureaucratic clutter, deep recesses and selective hot light. Performance and that identity are joint acceptance gates. “100%” means every required gate passes on the declared devices and views; the design is not evidence that unbuilt scenes already pass. The owner judges the artistic result.

This precedes another factory build. The first implementation must prove one lobby work area, one Security threshold and one conveyor work area before producing the remaining rooms.

## Diagnosis from the actual images and code

Reference authority: original lobby `01_loopforge_factory_rooms_lobby.png` and forge `04_loopforge_rooms_neural_lattice_converyor_1.png` in the old repository. Compare them with the hall, desk and phone evidence from [the previous pass](LOBBY_VISUAL_PASS_2026-10-11.md).

| Current mismatch | Why it matters | Design response |
| --- | --- | --- |
| The 26 × 29 m lobby working frame spends much of its image on floor; desks and robots become punctuation | A room feels large but its activity is hard to read | Compose authored room angles around operating clusters; preserve the rest as spatial context and usable circulation space |
| The desk close-up is more legible but loses the doorway, arrival and queue relationship | Detail inspection alone cannot carry the operating loop | Add a middle composition that shows a full action and its immediate upstream/downstream connection |
| Patina repeats across differently sized model faces; the floor has dense contrast at a similar visual strength | The image reads as mottling instead of machinery/materials | Calibrated world-scale UVs, distinct material values and authored macro/mid/micro detail |
| Existing generic material code derives bump from generated colour noise; new lobby maps are diffuse-only | Relief can turn dirt into false geometry; the new surfaces can still look flat | Author/bake relief from intended form, separately from dirt and illumination |
| FXAA, bloom and adaptive resolution coexist with fine linework | Their combined filtering can erase useful lines or leave shimmering texture | Compare effects separately at real delivery sizes before choosing the final combination |
| Worker gait uses a wall-time phase, while position follows tick records | Foot motion is not guaranteed to match distance travelled | Stride phase follows travelled distance; contacts are authored at the real equipment sockets |
| A 30 fps diagnostic sample is the available performance evidence | It hides frame-time tails, GPU costs, memory growth and loading stalls | Instrument those separately and test sustained operation/camera changes |

The 72 × 48 m lobby, 15 m common hall height, 1.9 m nominal worker and accepted portal graph remain the spatial authority. One tile is approximately one metre. Do not shrink rooms, enlarge workers, move doors or fill construction reserves to rescue a screenshot. The concept paintings are compositions, not dimensioned blueprints.

## Four scales that must agree

1. **World scale:** metres, paths, equipment footprints, worker contacts and admission. These affect simulation and construction.
2. **Play scale:** the process the player can change—its input, work, buffer and exit. Compose both its room feeds and its action workspace to expose the relevant cause and effect.
3. **Image scale:** projected pixels available for a worker, warning gesture, moving part or inscription. This determines detail, framing and material frequency.
4. **Time scale:** tick-owned task/travel progress, the compressed shift calendar and the animation that depicts it. These cannot be one uniform speed multiplier.

Changing camera, texture or detail tier must not alter world footprints, path costs, output, accidents, worker identity or the event log.

## Console, room feeds and player agency

The recurring route is **producer console → selected room’s live feeds → focused action → producer console and its room feeds**. Adviser selection, briefing, development and dispatch also depart from and return to this hub. Returning restores the room, primary angle, selected entity and pending issue. Do not add a mandatory trip through the hub between every related adjustment: a player can keep working inside the relevant workspace.

The factory summary can retain all six room positions, including named unpowered screens for locked rooms. It does not render six detailed live 3D rooms. Selecting an accessible room opens its floor view: one room, three camera angles, one simulation. The one-time Lobby → Security → Forge construction tutorial remains an explicit guided exception to the recurring navigation; it finishes at the morning console. It does not establish free roaming as the default daily interface.

| Place | What the player does | Relationship to the live floor |
| --- | --- | --- |
| Producer console / room CCTV | Observe flow, notice warnings, inspect known evidence, choose where to act | Primarily a spectator view. May expose a few clearly legal remote controls; it cannot be the only source of agency |
| Night builder | Place and connect machinery, reserve clearance, choose an investment over opening another room | Same room geometry and installed state, paused production, placement/connection previews and useful camera controls |
| Room operating workspace | Adjust a meaningful process constraint, pace or feed using installed equipment; compare the result | Current proposal to prove with the Conveyor puzzle. Concrete command, opportunity cost and visible physical response; no manual per-worker station staffing |
| Adviser and incident interfaces | Choose whose judgment to trust, authorize assignments, support or override a response where permitted | Advice, order, execution and outcome remain distinct; relationships react to actual known decisions |
| Dispatch / development | Commit output to growth or quota; commit eligible funds and downtime | Irreversible or scheduled changes in the same factory, not isolated interface scores |

**Actor does not mean first-person, free camera or constant clicking.** It means the player can form an intention, take a consequential action and recognise its effect. Most substantive play must be making and testing those choices. Brief observation is the payoff and the information for the next move. A successful safe arrangement can run without busywork; delegation becomes more valuable as rooms open.

For the first Conveyor proof, test this proposed sequence: notice output accumulating in one camera → open that machinery’s operating controls → change an available feed/pace constraint → see the accepted command and its local response → return to the same room feeds and read the changed queue, throughput and wear exposure. If the only satisfying interaction is starting the shift and waiting for an incident popup, the loop fails this gate even if the scene is beautiful. Exact controls and numbers still need the room-puzzle design; this plan does not invent repair before Rivet Witch arrives.

The adviser still resolves events in their own effectively assigned room without asking. A CCTV cue there is a receipt, not a retroactive veto. In other rooms the player can accept or override permitted responses. Direct machinery controls cannot silently bypass a pending incident, adviser delegation or an authority restriction. Mode, room, camera and render cadence never change who has authority.

## Three authored angles per room

Start with restrained perspective cameras in Babylon. Calibrate roughly 35–40° vertical field of view and 35–45° above the floor as candidates, varying placement to serve the room. The default CCTV positions are authored and recognisable; changing angle is a cut or short transition, not an uncontrolled orbit. Free pan/orbit/zoom can serve construction and close inspection within room bounds. Those tools are not required for ordinary observation.

| Angle role · proposed starting coverage | Required read | Avoid |
| --- | --- | --- |
| A · Flow / arrival | The room’s process, incoming work and a meaningful operating cluster | Fitting an enormous hall into a tiny frame just to show every wall |
| B · Work / contact | Workers operating the key mechanism; a queue, unsafe action or task response | A second shot that supplies no information beyond A |
| C · Exit / reverse / threshold | Downstream accumulation, departure or a connected-room encounter that A/B obscure | An attractive empty corner or a contradictory invented doorway |

These are composition jobs, not mandatory equal distances. Security may favour admission, verification and the Forge threshold; the Forge may favour intake/feed, assembly and outtake. Author each room’s coverage map against its actual equipment and portals. Player-built expansions must remain inspectable: bounded camera framing presets may adapt to occupied work areas, while retaining recognisable angle identity. If an important task is outside a default shot, offer an explicit focus target rather than inventing its visibility.

**Proposed desktop layout:** one large primary feed and two smaller live alternate feeds, each promotable without reloading the room. This is a layout candidate to compare with equal panes, not a newly accepted constraint. **Phone/short layout:** one legible live feed with three angle selectors; inactive feeds need not render. Keep room selection separate from angle selection. Do not shrink three full views into unreadable phone tiles. Normal scene height targets remain ≥70% desktop / ≥60% portrait with drawers closed, measured for the room-feed composition as a whole.

All visible feeds depict the same entity positions and committed event sequence. Update animation once, then render the room from its cameras. Signals lost to occlusion remain available as truthful room/event cues, not hidden-state highlights through walls. Ordinary production does not steal the selected angle. A consequential paused event may offer a cut-in and return to the saved room and angle. Reduced motion retains a readable still and all controls.

### Readability levels are a separate axis

| Rendering scale | Required read | Initial projected worker target |
| --- | --- | --- |
| Small alternate feed / room context | Flow, queue, affected area and a reason to promote this angle | No promise of individual facial/hand detail; preserve silhouettes and meaningful motion |
| Primary feed / operating workspace | Several workers, one meaningful equipment sequence, immediate buffer/exit | Approximately 56–90 CSS px for standing workers near the action |
| Focused inspection | Specific pose, contact, attachment and consequence | Approximately 120–220 CSS px; preserve entity identity |

Record actual projected bounding boxes in the delivered console, not a standalone full-screen scene. A required moving feature should span at least 3 internal render pixels in its supported primary view; otherwise use a larger readable silhouette. Camera A, B or C can become the primary feed: these detail levels do not define their positions. Native text carries important instructions; do not depend on a 5-pixel inscription.

Night construction and production reuse room geometry, equipment and entity IDs. A builder may use a different camera from the CCTV feed without creating another world. Remember both the build position and the console return position. Resize preserves the current room, angle, drafts and authority state. On ultrawide screens, use additional context rather than making the action smaller. Keep 44 × 44 CSS-pixel selection targets and an inspector/list alternative for crowded objects.

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

The lobby’s primary feed should contain a **complete action**: arrival → waiting space → desk and clerk → response → departure toward Dispatch. Start with two active desks in a roughly 10–14 m-wide local cluster. This is a framing/layout candidate inside the approved hall, not a new room size. Keep the actual passage clear and the central construction/movement space usable. Allow the broader hall to recede behind repeated architecture, softer contrast and controlled cutaways.

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

Add versioned per-room camera profiles (three angle IDs, poses, focus bounds and coverage), action-workspace return state, prefab metadata, physical material scale and presentation event recipes. Keep visual recipe versions separate from sim/schema versions. When a low-detail proxy becomes a close actor, bind the same entity ID, position, task and clip phase; do not reset it. Distant crowd summaries must derive from real entities. They are not invented extras that suggest false production.

Partition static geometry and repeated instances by room/work area and material. The current batching is a useful baseline, but a whole-factory material batch would prevent effective visibility control. Thin instances are useful for stable repeated props; frequently changing actors need a measured approach. Prototype one rigged/paletted or cached-pose worker batch against the existing articulated-part approach. Choose by measured cost and contact quality; do not make GPU skinning an untested dependency.

Use one Babylon engine/canvas and one room presentation graph for all three feeds. Tick the kernel once and update actor poses once; camera passes reuse that state, geometry and materials. Culling and postprocessing are still per-view costs. Reuse camera-independent lighting/shadow results only where valid. Never launch three engines, three worker populations or three clocks.

Load the selected room’s required areas, shared actor kit and a bounded next-room cache. Retain a lightweight map/summary for room selection. Other rooms continue simulating; they do not need detailed rendering. Release unneeded render targets and meshes on switches without disposing shared resources. Stop inactive camera passes on phones. Visibility affects drawing, not simulation. Use a minimal placeholder with truthful footprints while assets load, and preserve commands/state on failure. Only adopting a complete compatible asset release may replace that placeholder.

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

**The budgets cover the entire console composition, not each camera.** Profile three simultaneously animated feeds on desktop as well as the single-feed phone layout. Start with one primary feed plus two smaller targets at the same presentation timestamp. Allocate resolution by actual panel size and account for every target, depth buffer, shadow and postprocess pass. Lowering auxiliary cadence is an experiment only if motion remains coherent and readable; it is not a claimed free optimisation or an accepted substitute for the requested animated angles. No invisible feed keeps rendering.

Draw calls/triangles are diagnostic envelopes, not portable FPS guarantees. Start around ≤150 total draws including all camera, shadow and effect passes and ≤250k submitted triangles across those passes on the modest tier, then replace those guesses with measured material/pass costs. Preserve room character, actor silhouette and required feedback on every tier; reduce distant microdetail, unimportant live lights, particle overdraw and resolution in that order, subject to the readability floor.

Use GPU timer queries where available, with disjoint results rejected. Otherwise mark GPU timing unavailable and rely on observed frame intervals without labelling `scene.render()` CPU duration as GPU time. Record actual browser memory where available and asset/resource ledgers elsewhere; WebP transfer size is not GPU memory.

The previous 30 fps samples at 1280 × 720 are encouraging baseline evidence, not a pass of these sustained gates. More headroom must be demonstrated before adding all later rooms.

## Build sequence — each step produces reviewable evidence

| Step | Build output | Exit gate / failure response |
| --- | --- | --- |
| 0. Freeze the contract | References, devices, room/angle coverage, actor actions, baseline capture and repeatable replay | Measure actual actor pixels, frame intervals, startup and resource counts; no guessed acceptance |
| 1. Find the playable composition | Clean-material lobby/Security/Forge; three authored angles per room, primary/alternate feed composition, action workspace and console return | In five seconds, read active/blocked work and where to act. On desktop and phone, enter an action workspace and return without losing context. Correct composition before detail |
| 2. Calibrate the finish | Shared material sheet, macro/mid/micro controls, physical UVs, far/work/close variants and separate light/AA/bloom comparisons | Recognisable Loopforge from silhouette/light first; no crawling grain or mush on slow pan, 320/390/768 and desktop. Re-author maps/values if it fails |
| 3. Prove bodies and machinery | One reusable worker, desk/feeder and Security–Forge transfer; walk/contact/work/wait/jam/release clips or procedural poses | Feet/hands remain attached, gait tracks distance, no toy vibration or invisible outcome. State is identical across views and render rates |
| 4. Prove depth and feedback | Static light solution, movable contact treatment and one correctly placed beacon impulse | Source–obstacle–receiver alignment from several angles; event catches attention without flattening materials or hiding the action |
| 5. Prove the delivery path | Typed prefab manifest, required sockets, visibility chunks, validated dependencies, detail tiers, bounded loading/disposal | Bad/missing asset fallback, repeated swaps and 100-worker replay meet the budgets. Choose imported GLB/KTX2 only after the measured need and quality check |
| 6. Run the combined slice | Console → selected room → direct process adjustment → physical response → console consequence; night construction and adviser authority included, on desktop and actual phone | All visual, actor-agency, interaction, total multi-camera performance and truth gates pass together; owner approves the feel |
| 7. Expand | Apply the approved kit grammar to later work areas and rooms | Re-run worst-case visibility and transitions after each room; do not fill the whole factory first |

Implementation workstreams remain sequential on this memory-limited development machine: author/package → bounded build → production preview → capture/profile. Do not run multiple compilers and live 3D previews at once. Offline baking, when added, follows the same resource discipline.

## Evidence package and decision rule

For each candidate, save the same clean still, final-lit still and 10–15 second slow pan; then a 60-second replay with 10 and 100 workers. Include all three angles, primary/alternate promotion, phone angle selection, console → action → console return, selected-worker continuity, a purchase/attachment change, a jam, hidden/resumed tab and motion-off mode. Record intended action, accepted command and visible consequence; evaluate whether the day feels actively shaped rather than spent waiting for prompts. Fixed inputs/seed permit frame and outcome comparison. Reference original art alongside the real renderer, never substitute a concept render for implementation evidence.

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

The plan, its dedicated `design#floor-scale` tab, engine-reader link and companion documents are delivered as a proposal. The console/CCTV and actor-agency revision passed desktop, 390 and 320 CSS-pixel checks without horizontal overflow or browser warnings/errors. Its document generator, spatial-map freshness check and changed-component lint pass. These are documentation checks, not certification of the unbuilt room interface. No factory renderer, simulation, geometry or material implementation was changed in this pass. Steps 0–7 above are the implementation checklist still to execute.
