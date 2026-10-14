# Agents: character, movement and contact

14 October 2026. Current character review and integration direction.

The [asset review library](/stepanoskin/loopforge/play/asset-review) is the entry point for **LIMEN, Worker 01 and STILETTO’s new Meshy models**. Each has its own equipment/motion controls, six shared review gates and factory/CCTV inspection. Mouse/touch orbit belongs to close inspection; CCTV remains fixed. Cathexis, Rivet Witch and Thrum await models.

LIMEN’s body, mount and energy direction have owner acceptance. Worker 01 has 19 motion candidates. STILETTO has two mounted blades, 18 original clips and five corrected arm alternatives. Exact inventories and open issues live in their [review records](production/CHARACTER_REVIEW_STRUCTURE.md). The old spherical cast is a rejected engineering fixture, not the current production model set. Main play still uses placeholders; paired acting, crowd performance and gameplay integration with these new rigs remain to build.

Companion to [the first-turn contract](FIRST_TURN_ENGINE.md) and [the room scale plan](FACTORY_FLOOR_VISUAL_SCALE_PLAN.md).

## Decision

The factory is prebuilt. Remove player construction, purchase/placement tools and the night-zero installation tutorial. Keep the approved room dimensions, portals, locked rooms and shared world. Begin at the producer console with the leadership call. Night still means review and charging; it does not imply a builder.

Call workers and supervisors **agents** because the intended simulation gives them beliefs, desires and intentions. An agent does not require an LLM. Current first-turn workers have individual component records and bounded task movement; this is not yet a complete BDI implementation. Current procedural bodies are placeholders, not approved character art.

Keep Babylon 9.30.0. The best next step is authored, rigged 3D characters in the existing procedural factory, with baked surface detail and deliberate animation. Authoring can use procedural modeling offline; it need not construct hundreds of little meshes in every browser. The goal is a movable, lightable character that matches the art from every CCTV angle. Flat sprites or generated video cannot supply reliable arbitrary views, shadows, contacts and gameplay timing. Native asset-driven illustrations remain valuable for briefings and major event cuts.

## Model direction reset after production review

12 October, owner review: the production-test models are too clumsy, too spherical and insufficiently textured. **That earlier cast failed the visual gate.** Keep its deterministic action fixture, import/validation pipeline and performance evidence as engineering tools. Do not expand or integrate these bodies as the accepted character style.

### What the test got wrong

The original art has connected mechanical anatomy: shaped shells over a narrower frame, recessed bearings, layered plates and purposeful empty space. LIMEN has a skull, fitted security armour and equipment; STILETTO has a continuous slim torso, long tapered limbs and swept forearm blades. Workers have coherent chest/pelvis assemblies and capable hands. Curved armour is appropriate; repeated isolated balls and capsules defining the whole body are not.

The legacy `scripts/characters/author.mjs` uses scaled spheres for chest, head, limb covers and most joints. Changing their dimensions does not establish convincing part construction. Its texture coordinates project X/Y across every surface, collapsing depth-oriented faces, and `surface.mjs` adds a shared 256-pixel noise/scratch pattern. Nearly all body surfaces share one metallic response. Additional scratches, bevel segments or brighter lighting cannot repair those shape and material decisions.

### Recommended replacement: authored mechanical characters

Use the owner’s **Meshy-generated bodies and catalog motions**, then targeted offline cleanup and contact authoring where the review finds gaps. Blender or an equivalent DCC can provide that cleanup; it is not an automatic quality upgrade: recreating the same sphere recipe there would fail for the same reason. Art-directed mesh editing, coherent surface maps and repeated actual-model review are the necessary work. Browser-side procedural code remains useful for assembly, state variation and animation; it should not invent the final bodies.

| Body feature | Required construction |
| --- | --- |
| Head | Designed brow, cheek/jaw planes, recessed optics, neck connection and a convincing back. Preserve a skull-like worker/LIMEN face and STILETTO's narrow visor/helmet. |
| Torso and pelvis | One coherent load-bearing assembly with tapered sections, overlapping shell panels and access covers; a narrower waist with visible suspension. |
| Limbs | Shaped cross-sections and tapered forearm/shin shells around a lighter frame. Show where a shell ends and a moving linkage begins. |
| Joints | Recessed hinge barrels, bearings, sockets and clearances appropriate to the motion; rounded parts remain only where their construction calls for them. |
| Hands and feet | A palm, thumb, credible gripping fingers, ankle and articulated sole. Fit the same cradle and station contacts used in the engine. |
| Wear | Damage follows exposure and use: paint loss at edges, grime inside recesses, oil near moving joints and polished contact surfaces. Avoid uniform noise over every material. |

Use real geometry for silhouette, overhangs, deep cavities and moving parts. Bake shallow panel grooves, screws and small damage from detailed sources into normal maps. UV unwrap surfaces deliberately. A compact material atlas can still encode painted enamel, bare steel, brass and rubber separately through colour, roughness and metalness masks. Painted/coated regions must not inherit the same metallic response as exposed metal. Preserve readable planes and some quiet surfaces; detail should form a hierarchy rather than cover everything equally. Do not bake the concept art's fixed highlights or dramatic shadows into base colour.

Hard shell pieces follow their rigid mechanical bones. Model articulation clearances and joint centres before texturing; cables and soft covers can use limited weighted deformation. Bake authoring constraints into clips. Preserve action names/contact semantics, but version a new rig if proportions or articulation require it; do not force the asset into the test's 17-bone rig. Foot planting, turns, grip timing and weight transfer are reviewed with the mesh, since a good static body can still become clumsy in motion.

### Candidate production routes

| Route | Role in this project | Main constraint |
| --- | --- | --- |
| Targeted Blender/DCC authoring | Correct weights, joints, sockets and contact clips on the selected bodies | Requires actual character-art work and visual iteration; scripting alone does not guarantee it |
| Meshy multi-view generation, rigging and catalog motion | Current source for the selected LIMEN, Worker 01 and STILETTO candidates | Generated hidden surfaces, joint separation, hands, texture lighting and animation topology still need review and repair |
| Purchased generic robot or unedited generated mesh | Possible temporary reference/benchmark, not the selected Loopforge cast | A technically usable model can still miss the character completely |

Meshy's current multi-image API supports several views, PBR maps and GLB output; that makes it a plausible candidate experiment, not a proven winner for Loopforge. Hunyuan3D 2.1 provides an alternative shape/PBR pipeline; its published memory requirements make it a separate offline/GPU production decision. The owner subsequently selected Meshy and generated LIMEN, Worker 01 and STILETTO; their runtime derivatives are in the shared review library. Blender was not found on this task's shell PATH. Establish that toolchain before claiming automated mesh production is available.

### Intake gates for each candidate

1. **Reference:** resolve one worker's front, side and back in a consistent neutral pose, using existing room art. Define body proportions and joint clearances. A new illustration is a specification, not proof of a finished model.
2. **Shape:** author the complete worker. Review actual mesh renders in neutral grey from front, rear, side and three-quarter views. It must already look mechanical with textures and glow disabled. Reject the silhouette before spending time on surface polish.
3. **Surface:** unwrap and texture the same mesh; bake detailed source geometry into the delivery mesh. Inspect close-up and at actual CCTV size under neutral and factory lighting, including the alarm sweep.
4. **Motion:** test walk/stop/turn, credential presentation and cradle lift/carry/set-down. Check shell intersections, feet and hands. The existing headless fixture remains the source of action timing and outcomes.
5. **Delivery:** retain the detailed source outside public deployment, export validated GLB/material maps, and test in the existing viewer. Measure a close actor and 10/24/100-worker scenes at fixed resolution/camera settings; only then derive background meshes and shared animation tiers.
6. **Expansion:** derive two worker variants from the accepted construction and material family. Build bespoke LIMEN and STILETTO bodies next; sharing contact semantics does not mean sharing a rescaled torso.

Acceptance requires side-by-side original-art comparison and rendered-asset evidence: shape without textures, material response, all three CCTV angles, visible contact sequence and measured frame-time tails. A polished offline beauty render alone cannot pass the in-game gate. If the first worker still misses the art, escalate the modelling method or obtain specialist character-art input rather than repeat the primitive recipe across the cast.

The performance strategy is better allocation of detail: shaped visible surfaces, baked microdetail, shared texture/mesh resources, spatially culled crowds, limited contact shadows and camera-specific detail. A richer offline source need not produce a heavier browser asset. This is a design objective to measure, not a promise that more detailed art will automatically run faster. Keep Babylon and the frontend-independent BDI/action contract.

Primary production references checked 12 October: [Blender Studio modelling workflow](https://studio.blender.org/tools/artist-guide/asset-creation/modeling), [Blender baking](https://docs.blender.org/UATEST/manual/en/4.5/render/cycles/baking.html), [Meshy multi-image generation](https://docs.meshy.ai/en/api/multi-image-to-3d), [Hunyuan3D 2.1](https://github.com/Tencent-Hunyuan/Hunyuan3D-2.1). Their documented capabilities do not establish a quality or speed result for our characters.

## Style pass: what must survive the translation

Sources: original Loopforge character sheets and room interaction art, already published in the versioned `loopforge`, `loopforge-console` and `loopforge-supervisors` packs. These are references, not finished 3D turnarounds. Read shape, gesture and materials before ornamental grain.

| Agent | Identity from the art | Motion and contact direction | What would break the character |
| --- | --- | --- | --- |
| Workers | Worn industrial skull/visor heads, exposed joints and ribbed bodies, repair plates, brass/steel with restrained eye light. Smaller and less ornate than supervisors. | Weight shifts under a brain cradle; planted feet at a press; both hands meet handles. Waiting, hesitation and fatigue have distinct silhouettes. Start with three compatible body variants and stable cosmetic seeds. | Identical upright toy figures, oversized round heads, floating hands, synchronized marching, random twitching as a substitute for stress. |
| LIMEN | Broad, heavy dark armour; skull-like face, cyan eyes/accents, straps and equipment. A single asymmetric cyan blade is the primary dark-CCTV recognition cue; retain its outline when labels are hidden. A low, stable centre of mass. | Deliberate steps; a planted blocking stance at a gate; head looks at a worker before a stop gesture. Inspection visibly holds that worker and the queue behind them. | The same slim rig silhouette as STILETTO, fast flailing, or cyan glow covering every surface. |
| STILETTO | Narrow elongated silhouette, articulated black chrome, sharp forearms, restrained red visor. Clear distinction between hard polish and dirty surroundings. | Short decisive turns, forward intent, crisp pointing and impatient checking. Workers hurry in response; she cannot perform engineering repairs. | Bulky armour, soft round proportions, indiscriminate spikes, a permanent attack pose or excessive bloom hiding articulation. |
| Cathexis | Cracked porcelain, warm eyes/core, crown/headphones, trailing cables and distressed fabric. An inviting face that can become disturbing. | Open-handed address, controlled head tilt, attention spreading across a worker group. A refusal or loss of trust changes who turns toward her. | A generic metal worker painted white; workers applauding regardless of their actual response. |
| Rivet Witch | Hood, round green goggles, brass mask, dense tools/cables and heavy boots. Her kit has a practical working silhouette. | Kneel, brace, inspect, wrench and test at authored machine sockets. The work changes an actual repair task once engineering is available. | A repair beam, tools missing the machine, or decorative repair motion producing free condition recovery. |
| Thrum | Rectangular speaker/boombox head, central blue lens, chest resonator, monk-like cloth and tuning-fork imagery. | Deliberate pauses, resonant torso/hand movement, workers visibly settling or turning toward him. Lost discipline and lost throughput remain possible costs. | A human face in a hood, nightclub strobing, or universal happiness unrelated to beliefs and stress. |

Use silhouette geometry for the head, torso, blades, hood and speaker head. Bake fine screws, cracks, seams and surface wear into normal/roughness/colour maps. Eyes are small emissive accents; glow must not erase faces. Limit palette noise so cyan LIMEN, red STILETTO, porcelain Cathexis, green Witch and blue Thrum remain distinguishable in the same dirty amber factory light.

Review each at the actual work camera size, in silhouette and under final lighting, then at a close interaction angle. A beautiful full-resolution sheet is not evidence that a 60-pixel worker reads. Do not add high-frequency scratches to solve a weak outline. Workers keep individual IDs and appearance through task changes, injuries, room changes and rendering tiers.

## Acting is a mechanical consequence

A repeated task needs anticipation, weight transfer, contact, effort, release and recovery. The sequence should feel rhythmic without every worker sharing a phase. Walking must cover the distance implied by the stride; an agent waiting at an occupied station must actually stop. Mechanical secondary motion can use a small number of spring/damped joints. Cloth and cables use authored bones initially, not per-agent live cloth physics.

Start with one complete inspection: a worker approaches the Security gate, requests its queue slot, stops, presents a credential, receives LIMEN's inspection, and is released or held. Both bodies face one another; hands and the scanner meet. The resulting queue is a fact, not a decorative animation. Compare with STILETTO waving the worker through: shorter service time, less checking and observable disorder. Their different operating priorities should be readable with the labels hidden.

Then prove one conveyor cycle: approach, reserve a workstation, lift a cradle, align it to the machine, perform the task, transfer the prop and leave the slot. Add a supervisor interaction with that specific worker. A strained worker can hesitate or refuse when the mechanics warrant it; different stress/discipline states must not merely recolour a badge. Incident aftermath uses the actual affected IDs. Later calm, rally, reprimand, assist, argue and sabotage use the same action interface with their own conditions and consequences.

## Engine: BDI decides; animation expresses

**Authoritative domain:** headless TypeScript for this prototype, with Rust-shaped boundaries: stable entity IDs, explicit component records, tagged commands/actions, seeded randomness, integer time/position, ordered iteration and one state owner. No Babylon, React, wall clock, network or model references inside the kernel.

1. Perception systems derive observations from actual location, access and events. A supervisor's belief can be wrong; the truth ledger stays separate.
2. BDI evaluates relevant changes on deterministic scheduled ticks, with stable tie-breaking and a bounded work queue. Do not reconsider every desire for every agent on every animation frame. Committed intentions persist until completed, invalidated or explicitly interrupted.
3. A plan selects legal actions and reserves navigation/interaction slots. Use the existing room/portal graph plus authored walkable lanes and approach anchors. Avoidance and queue order belong to authority whenever they affect throughput, accident exposure or encounters. A floating-point browser crowd solver must not decide those outcomes.
4. A paired action reserves actor, recipient and contact anchors as one transaction. It validates room access, distance, availability and authority. The recipient's response can be refusal; a supervisor gesture cannot silently force compliance. Use deterministic expiry/cancellation to avoid deadlocks.
5. Accepted actions advance on fixed ticks and produce effects, events and traces. Animation markers can trigger sound or particles, never production, injury, money or trust changes.

A proposed public action record contains action ID/type, actor IDs, equipment/anchor IDs, start/end tick, visible phase, prop owner and observable outcome. Supply sparse timestamped path/action segments and interpolate locally; do not send skeleton matrices each frame. A late client catches up to confirmed action time or holds its last confirmed state. It must not invent a completed transfer while waiting for the server. Camera changes and animation LOD do not restart an action.

The private trace links observation → belief/relevance → competing intention → selected plan → validation → outcome. Explanation uses the information available at the time. Public UI only receives permitted evidence; Act 1 must not leak stress, loyalty or hidden knowledge through debug/action payloads. An LLM may later improve constrained interpretation or dialogue, asynchronously and with evals. It has no mandatory role in navigation, contact timing or the render loop.

The existing service replays a bounded command transcript over response-paced HTTP. It is not a persistent background world or a streaming crowd server. Growing the population and history will require snapshots/checkpoints and an explicit hosting decision; keep the public action boundary independent of that choice. The next BDI slice must compare authoritative CPU/replay cost at 10, 24 and 100 agents as well as client rendering cost.

## Renderer: spend detail where someone can read it

| Layer | Recommended first implementation | Boundary |
| --- | --- | --- |
| Supervisors and close interactions | GLB skeletons, GPU skinning, named clip groups, controlled blends, look targets and limited hand/foot correction | Bespoke proportions/heads and extensions; share semantic contacts and compatible clips, not one identical body |
| Nearby workers | A small modular rig family with shared meshes/materials/clip data; individual phase and visible state | Establish this baseline before optimizing 100 agents; no React component per bone or per frame |
| Background routine work | Benchmark baked bone-matrix animation with grouped instances against skeletal workers | Stock Babylon BVA cannot blend simultaneous clips; promote an approaching interaction to skeletal animation before the important contact |
| Prebuilt architecture | Shared materials, baked static light/AO where appropriate, visibility chunks, limited dynamic contact shadows | Baking must not double-light or paint a fixed reflection that fights the rotating beacon |
| Cinematic feedback | Framing, short lighting impulses, sound at confirmed visual contact, bounded particles and camera cuts | Feedback is tied to real events; no constant glitch or camera shake concealing weak motion |

The installed Babylon baker stores bone matrices per frame. Its uncompressed float storage is `(bones + 1) × 16 × frames × 4 bytes`; this is not a separate vertex-position sample for every vertex. Bake offline, reuse across compatible worker instances, account for decoded GPU memory and download cost. The stock path does not offer the animation blending needed for close acting. A custom blend shader is future work only if profiling makes it worthwhile.

Thin instances reduce JavaScript objects but trade away individual automatic culling: the group is visible together. Partition by room/work area and material/rig/detail tier; preserve a stable ID→instance mapping. Do not combine the whole factory into one always-visible crowd batch. Reassignment/LOD needs careful buffer lifecycle. Mesh/material reuse is useful even before thin instancing.

One Babylon engine, one active room and one pose update feed all three CCTV passes. Count all views and shadows in the frame budget. Phones use one selected camera. Lazy-load the floor on first entry; pause its render loop when hidden. Never load every supervisor/room variant at startup. Capability tiers reduce auxiliary resolution, shadows and background detail before removing causal animation. Offscreen agents still exist and act in the simulation.

## Asset package and production pipeline

Use Blender or equivalent offline authoring for measured turnaround → low-poly silhouette → UV/material bake → rig → contact clips → GLB export → actual Babylon review. Image generation can help designs and surface art; it cannot guarantee a usable rig, topology, correct unseen surfaces or synchronized contacts by itself. Meshy supplies the current LIMEN, Worker 01 and STILETTO candidates. The remaining supervisors follow the same intake; exact contact animation still needs offline work against real props.

A character prefab needs a versioned source/model, compatible rig ID, mesh/material detail tiers, named clips and their phase ranges, foot/hand/look/tool sockets, bounds, semantic appearance states and dependencies. A machine prefab needs approach/stand/contact slots and prop sockets. Simulation definitions own slot capacity, action duration, authority and effects separately. Validate scale, coordinate conversion, finite transforms, sockets, clip coverage, legal transitions, prop handoffs, hash integrity and disposal. A cosmetic asset revision cannot change production balance.

The immutable asset manifest/CDN workflow now accepts self-contained GLB model entries. Embedded texture dependencies are validated before publication. Use compressed GPU textures where measured appropriate; keep export sources, high-resolution intermediates and raw takes out of runtime packs and Vercel deployments. Load only the chosen room/agents, share dependencies, retain a bounded cache and release unused resources. Do not add speculative libraries or bulk generated artwork now.

## First production slice and acceptance

1. One worker family, LIMEN and STILETTO: matching silhouette/material sheets and rigs; no generic robot recolours presented as finished characters.
2. Walk, turn, wait, inspect/release and one complete cradle transfer, plus one supervisor→worker interaction. Prove three-camera contacts before expanding the repertoire.
3. Deterministic action reservations, interruption/cancellation and causal trace for that slice. Replay must preserve the same agents and outcomes through every camera/quality setting.
4. Compare skeletal and baked background paths at 10, 24 and 100 agents. Measure whole-frame p50/p95/p99, interaction latency, draw calls, all-pass triangles, decoded texture memory, loading, API/replay cost and repeated room-switch memory. Use the existing visual-scale plan's device targets; claim no universal performance percentage.
5. Review side by side with original art at actual game size: silhouette, surface response, stride, contacts, paired reactions and compositional hierarchy. Motion must read with badges hidden. Continue the remaining supervisors’ individual intakes in parallel with this integration gate; their availability does not imply paired acting is complete.

**Historical engineering fixture — 12 October (rejected bodies):** `/stepanoskin/loopforge/play/agent-test` reviews three worker variants, LIMEN and STILETTO in the real Security/Forge scene. Offline geometry/material recipes export validated GLB rigs and named clips. A bounded headless fixture owns paired reservations, gate inspection/release, cradle ownership and supervisor intervention/refusal. The review includes fixed-tick seeking, three cameras, original-art comparison and hybrid/all-skeletal diagnostics at 10/24/100 workers. [Execution and evidence record](production/AGENT_PRODUCTION_TEST.md).

**Remaining:** integrate the new library’s rigs into paired scenes with newly authored contact poses; richer acting, planted locomotion and smooth transitions; general BDI perception/planning/navigation; first-turn integration; dynamic asset loading by cast membership and physical-device certification. The review route eagerly loads its small complete comparison cast (8.69 MiB of raw models/data) so switching paths is a controlled comparison. That is an author-bench exception, not the intended main-game loading policy. Main-play figures remain placeholders. No Blender dependency or KTX2 pipeline is claimed.

**Economy consequence:** removing construction removes the prototype's immediate cash sink. Keep the existing opening funds and delivery income honestly; do not invent a replacement purchase or charge for prebuilt fixtures. Later funding/unlocks, payroll and engineering need a separate balance pass. Adviser choice, assignments, process controls, responses and permanent allocation still carry first-turn agency.

## Primary technical references

Verified 12 October 2026; recommendations above are design judgments, not performance guarantees from these sources.

- [Babylon baked texture animation](https://doc.babylonjs.com/features/featuresDeepDive/animation/baked_texture_animations/) — instanced playback and current blending limitations; checked against installed 9.30.0 `VertexAnimationBaker`.
- [Babylon thin instances](https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/thinInstances/) — instance lifecycle and group visibility tradeoffs.
- [Babylon skeletons](https://doc.babylonjs.com/features/featuresDeepDive/mesh/bonesSkeletons) — skeletal deformation and bone attachments.
- [Babylon animation groups](https://doc.babylonjs.com/features/featuresDeepDive/animation/groupAnimations/) — clip grouping and playback control.
- [Babylon lightmaps](https://doc.babylonjs.com/guidedLearning/lightmaps/) — static lighting as an environment optimization.
- [Babylon crowd navigation](https://doc.babylonjs.com/features/featuresDeepDive/crowdNavigation/) — available navigation tools, not a guarantee of deterministic cross-runtime simulation.

## Worker motion bank and Cathexis gait — 13 October 2026

Worker 01’s 19 exported motions are available in the [production review player](/stepanoskin/loopforge/play/asset-review/worker), linked from Game design → Agents → Asset review. The new Idle and Injured Walk share the same FBX rig as the other standalone exports. They are review candidates; machine-contact authoring and several clearance adjustments remain. See [the complete inventory and audit](production/WORKER_MOTION_REVIEW.md).

The owner selects **Hot Walk as Cathexis’s default walk**. Keep that public name even though the source FBX says `Confident_Walk`. Preserve the expressive gait; fix mesh intersections without erasing its character. Worker 01 is a temporary motion stand-in until Cathexis’s own mesh/rig can be reviewed. Style approval does not certify retargeting or factory contact. `afraid_recoil` and `work_cradle` remain missing custom motions.
