# LIMEN blade — identity through CCTV

Decision: 12 October 2026. First assembly implemented; action integration and full visual/performance acceptance remain open.

## The player-facing promise

**The blade is how you tell LIMEN from other robots in a dark factory room through a CCTV camera angle.** Recognition must work before reading a name, opening a portrait or zooming in. It is part of the interface's visual language, not an optional close-up ornament.

Preserve the original character sheet: a heavy dark security body with a single asymmetric cyan blade extending from its arm. A narrow white-cyan core, torn cyan braids and deliberate heavy movement distinguish it from worker eye lights, Thrum's blue lens and fixed cyan machinery. Colour alone is insufficient. Shape, placement, rhythm and local contrast carry identity together. Keep the body mechanically controlled while its contained energy moves fiercely; do not turn LIMEN into a flailing swordsman.

When powered and visible, the blade retains a restrained luminous core at rest. Rich activity arrives in phrases, not continuous fireworks. This differs from the console beacon, whose default is dark with brief event impulses. An extinguished, stowed or fully occluded blade must not appear through armour or walls to preserve a recognition cue. Use body shape, motion and the existing accessible inspection/name affordance when the blade cannot be seen.

## The layered asset

| Layer | Visual responsibility | Implementation direction |
| --- | --- | --- |
| Rigid housing | Weight, worn metal and a credible mounting point | Simplified Meshy-derived mesh with deliberate material maps. Attach to a calibrated forearm socket. Verify actual rig handedness, axes, units and carry pose; do not guess from the camera view. |
| Energy core | A readable blade silhouette, even at small size | Small procedural mesh anchored at the emitter. Preserve a firm cutting edge and a pointed asymmetrical outline. |
| Cyan braids | Contained instability; flex, tear and snap back | A few segmented ribbons with shader displacement, small shared noise data and tapered motion. Keep the base fixed; increase displacement toward the tip. No cloth or fluid simulation. |
| Sparks and trail | Brief release of energy during a specific action | Bounded pooled particles and a short swing trail. A bright head and fast decay matter more than particle count. Ordinary footsteps do not trigger repeated bursts. |
| Glow and spill | Separate LIMEN from the dark room and connect the blade to nearby surfaces | Reuse the factory's existing bloom. Test a small scoped light on the gauntlet/torso or nearby receivers only at useful viewing distances. Correct occlusion and restrained bloom are mandatory. |
| Sound | Anticipation, discharge and recovery | A restrained electrical hum/whine, dry snap and short decay tied to the same action envelope. Spatial attenuation and mute apply; recognition must still work silently. |

The uploaded blade is a single 1,145,974-triangle mesh with embedded material maps, not a ready runtime effect. Separate housing from modeled energy offline. Preserve the housing silhouette; bake fine detail into a lower-complexity mesh and replace the sculpted energy with controlled procedural geometry. Do not upload the full master into a browser pack or merely wobble its million vertices.

## Motion phrases and evidence

| Visible state | Proposed treatment |
| --- | --- |
| Powered rest / walking | Narrow stable core with slow uneven braid crawling. The blade follows a calibrated carry pose and clears the leg. |
| Preparing an intervention | Strands tighten, brightness briefly gathers at the emitter and sound rises. Use an actual visible action wind-up, not a guessed emotion. |
| Intervention / contact | A brief outward lash, trail and spark burst at the authored action phase. Contact sparks require confirmed contact, not proximity alone. |
| Recovery / interruption | A short uneven decay back to the core. Cancel pending contact effects when an action is interrupted; do not finish a rejected strike visually. |
| Reduced motion / paused inspection | Stable readable core and restrained state changes. No rapid flashes, wandering ribbons or compulsory camera shake. |

Stress, malfunction or aggression variants may be added only when the projection permits that observable behaviour. Do not drive brightness directly from private loyalty, confidence, beliefs or motives. A furious-looking effect must not invent a hostile intention the world never committed.

## Engine and viewer boundary

The simulation owns agent/action IDs, action timing, equipment availability and committed contacts. The renderer consumes permitted action records and maps them to a versioned visual recipe. Proposed inputs are the stable agent/action ID, blade mode, phase timing, approved visible intensity and a separate cosmetic seed. These are a design contract, not newly implemented KVP fields.

Evaluate the core/ribbons from action time and that visual seed. Key one-shot bursts by event ID; seeking or changing cameras must not duplicate them. Camera passes share the same pose and effect time. Handle pause, resume, cancellation, replay seek and room disposal explicitly. Cosmetic RNG never advances the gameplay random stream. No LLM, particle collision or animation callback can produce damage, trust changes or production outcomes.

A viewer's lower detail tier may simplify appearance but must retain identity and permitted action meaning. Geometry/FX updates stay outside React; UI readouts update at bounded frequency. The effect stops when hidden or unloaded while the authoritative agent continues to exist.

## Initial budgets — hypotheses to measure

- Housing: roughly 2–5k triangles, with a compact texture set; tune against the actual silhouette and viewing distance.
- Core and braids: under 1k triangles total; a few shared materials and a small noise texture.
- Sparks: begin with 4–12 per burst, capped at 24 live blade sparks across the active room. Use a small pooled system first; GPU particles are an option if measured demand warrants their setup cost.
- No per-spark lights, continuous shadow-map updates, fluid physics or new full-screen distortion pass. A scoped blade light is conditional, not required for recognition.
- Reuse the existing bloom before introducing a separate glow layer. Check transparent overdraw, brightness clipping and occlusion from every feed.
- Test a provisional incremental effect cost of at most 1 ms at the 60 fps tier / 2 ms at the 30 fps tier, measured over the complete camera composition. These are targets, not achieved results; the underlying room must also meet its total frame budget.

Near view: housing detail, braids, brief trail/sparks and optional spill. Ordinary CCTV: silhouette, limited braid motion and short bursts. Very small feed: the clean core and asymmetric motion signature survive; micro-sparks and spill can disappear. Set thresholds using projected pixel size, not arbitrary world distance. In all tiers, avoid making the blade a broad bloom blob that hides a worker or a gate interaction.

## First implementation — 12 October

The separate `/play/agent-test/limen` bench now loads body v2 and the blade housing from an immutable two-file pack. They total **5,493,992 bytes**. The 61.81 MB blade master remains offline: a revision-specific extraction removes modeled energy, then Meshoptimizer reduces the housing to **4,994 triangles**. Three retained source maps become 1024² JPEGs; MikkTSpace tangents are generated. This is not a fresh high-to-low texture bake.

The mount follows `mixamorig:RightForeArm`. The rig uses centimetres; equipment uses metres. Calibration is versioned in `limen-blade-calibration.json` and shared by the renderer and geometry check. Sampling 73 poses per walk/run clip finds no blade-axis intersections with the leg mesh. Nearest sampled leg vertices are 12.4 cm / 6.6 cm away respectively. This is a regression measure, not a guaranteed minimum surface distance, swept-volume test or acceptance of future contact poses.

A single opaque shader draw supplies the **672-triangle** tapered core and three moving braids. It reuses factory bloom and adds no dynamic light, particle allocation or full-screen pass. A half-second manual surge previews a stronger energy phrase. It is explicitly a review cue, not a game event or a replacement for the authoritative action contract. Pause freezes cosmetic time; reduced motion keeps energy steady. Hidden tabs pause, offscreen canvases stop rendering and teardown disposes both assets and the effect.

Close inspection and three elevated CCTV-scale presets frame the stationary subject in Security or the Forge. They support silhouette review without replacing the game's fixed feeds. The complete recognition gate still includes those real feeds, partial occlusion, other robots, machinery and low-end devices. Contact poses, event-keyed sparks/trails, audio and main-play integration remain open. CloudFront is pending; temporary app-hosted delivery is authorized. Private source records already select v2.

No additional Meshy export is required for this first assembly. A targeted housing revision remains available if owner review finds a shape or mount problem.

## Targeted Meshy regeneration is available

The owner has credits and can generate additional models. Treat that as an available production route, not a prerequisite. Inspect the current blade first. If its housing cannot be separated cleanly, has an unsuitable mount, or loses its silhouette at the delivery budget, request a housing-only revision using the original character sheet: rigid emitter, gauntlet mount and clear attachment surfaces, without modeled energy, sparks or trails. Aim initially for the same 2–5k-triangle housing budget with baked material detail; inspect actual geometry and materials rather than relying on the generator’s reported target.

Keep the accepted body unchanged unless a specific rig or clearance failure requires it. Request each new asset against an observed failure and compare it in the same CCTV camera before adoption. A new Meshy mesh still needs socket calibration, material preparation and motion clearance. The living energy remains procedural so it can react to committed actions, pause, scale in detail and cancel cleanly.

## Implementation checklist and exit gate

- [x] Preserve and verify the separate body and blade sources; record the prior source as retired.
- [x] Establish the identity, state/visibility boundary and performance proposal in the design and engine readers.
- [x] Prepare the first housing delivery mesh, retained maps, pivot and bounds; replace modeled energy with a procedural core and braids.
- [x] Attach to the verified forearm socket and establish sampled rest/walk/run review.
- [ ] Author intervention poses and certify full swept leg, torso and paired-worker clearance.
- [ ] Implement bounded phrases, event-keyed sparks/trails, shared bloom and optional scoped spill. Add sound only through the existing opt-in/mute path.
- [x] Integrate v2 body and blade in the separate review bench with blade visibility, pause/scrub and fixed framing presets. Quality remains adaptive; a controlled performance comparison is still required before main-play integration.
- [ ] Review normal, dark and alarm lighting from all three room CCTV angles at their real on-screen size. Test beside workers, STILETTO and cyan machinery; test overlapping bodies and partial occlusion.
- [ ] Hide labels and portraits. The owner should identify LIMEN quickly without zooming, including at the smallest supported feed size, in stills/reduced motion and with sound off. Check grayscale contrast as well as colour. Record failures rather than compensating with permanent UI arrows.
- [ ] Compare the same room/agents/camera sequence with blade FX off and on at 10/24/100 workers. Record CPU/GPU time where available, p50/p95/p99, draw calls, transparent overdraw, memory and all three camera passes. Retain the 30 fps modest-device goal; physical-phone performance remains unmeasured until tested.
- [ ] Check hidden-tab suspension, room swaps, repeated load/dispose, pause/seek/replay, no duplicated sparks and unchanged simulation hashes across quality tiers.
- [x] Publish optimized immutable dependencies and switch the review manifest. Retained v1 assets remain available for older release references; the main-play cast is unchanged.

## References and related records

- [Original cast, acting and BDI boundaries](AGENT_CHARACTER_AND_ANIMATION_DIRECTION.md)
- [Source revisions and deployed LIMEN bench](production/LIMEN_MESHY_REVIEW.md)
- [Webview rendering, assets and total room budget](WEBVIEW_RENDERING_AND_ASSETS.md)
- [Babylon ShaderMaterial](https://doc.babylonjs.com/features/featuresDeepDive/materials/shaders/shaderMaterial/) — vertex/fragment animation and explicit uniforms.
- [Babylon default rendering pipeline](https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/defaultRenderingPipeline/) — shared bloom and adjustable post-processing.
- [Babylon GPU particles](https://doc.babylonjs.com/features/featuresDeepDive/particles/particle_system/gpu_particles/) — capabilities, limitations and lifecycle costs. GPU simulation is not automatically the best choice for a tiny burst.

Technical references checked 12 October 2026. Art direction and numeric budgets are Loopforge proposals, not vendor performance guarantees. Private bucket addresses, account IDs and credentials stay outside published records.

## Owner feedback and idle refinement — 13 October

Body/weapon clearance and the energy flowing from the forearm are accepted. Make blade motion visible beside full-body movement: separate the narrower white-cyan core from thicker travelling turquoise/ice-blue braids. Keep colour near cyan, without colour-coding hidden state. The same one-draw effect now follows an authored maintenance idle: inspect → power down → opposite-hand adjustment → two local failed starts → reignite → lower. Reduced effects preserve slow power transitions and suppress flicker/surge/displacement.

The 11-second, nine-track pose clip is baked offline against the existing rig. No Meshy regeneration or Blender work is required for this pass. Fingers, armour weights and exact worker contact are later Blender tasks; actual gameplay effects still need authoritative action timing. The existing GLBs, forearm mount and walk/run tracks are preserved. Review through the [asset library](/stepanoskin/loopforge/play/asset-review); implementation details live in [the production record](production/LIMEN_MESHY_REVIEW.md).
