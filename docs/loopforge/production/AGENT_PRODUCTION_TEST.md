> **Historical fixture — rejected placeholder models.** Current model reviews live in the [asset library](/stepanoskin/loopforge/play/asset-review). The older action and crowd experiments below remain engineering evidence only; they do not validate the new Meshy cast or its contact/performance behaviour. The direct fixture page is labelled legacy.

# Agent production test / 12 October 2026

**New Meshy candidate (12 October):** open `/stepanoskin/loopforge/play/agent-test/limen` for the owner-supplied 41,326-triangle LIMEN, 23-joint rig and walk/run clips. The previous procedural cast below remains an engineering fixture rejected on visual quality. See [LIMEN model review](LIMEN_MESHY_REVIEW.md) for provenance, material treatment and the temporary app-hosted delivery plan.

Production experiment on the existing prebuilt factory, not approval of the final cast. No construction returns and no LLM is required.

## Delivery checklist

- [x] Author and export a worker family, broad armoured LIMEN and narrow bladed STILETTO; stable rig/socket conventions and named motion clips.
- [x] Validate GLB structure, finite bounds, bone/clip coverage and immutable asset hashes; preserve reproducible source outside runtime delivery.
- [x] Implement a bounded deterministic interaction kernel: queue, paired reservation, inspection/release, cradle ownership transfer and supervisor intervention/refusal. Record causal traces; never commit outcomes from animation callbacks.
- [x] Review imported models in the actual Security/Forge scene, with three camera angles, pause/seek and original-art comparison.
- [x] Compare skeletal workers with shared baked background animation at 10/24/100. Keep contact actors fully rigged. Record whole-composition timing, draw calls, triangles, download/decoded costs and lifecycle behavior.
- [x] Exercise desktop and 320/390-pixel responsive layouts, keyboard seek/dialog dismissal, camera changes, repeated resets and return to the main console. Run tests, lint and production build.
- [x] Update the design/engine records and prepare the scoped draft review. Hosting verification is reported with the PR.
- [ ] Certify physical-phone frame times, GPU-memory disposal soak and deliberately interrupted-load recovery before promoting these characters into the game.

## Owner review outcome

The owner rejected this cast visually: bodies are clumsy, overly spherical and lack convincing surface construction. This test remains an engineering benchmark. Replace the models through the [worker-first authoring gate](../AGENT_CHARACTER_AND_ANIMATION_DIRECTION.md#model-direction-reset-after-production-review); do not expand the current geometry recipe or promote it into main play. The replacement pass is planned, not implemented.

## Art contract

Workers: industrial skull/goggle face, ribbed torso, exposed actuator rods, repair plates and separate knuckles. Their heads must stay subordinate to their bodies. LIMEN: broad shoulder caps, heavy greaves, skull jaw/teeth, harness, pouches, restrained cyan optics. STILETTO: long legs, narrow waist, black polished shell, continuous angular red visor, blade forearms. Fine detail cannot substitute for the silhouettes.

Author mechanical geometry offline, merge by material and skin rigid parts to articulated joints. Export ordinary GLB; no recipe runs in the browser. Contact clips share semantic names but use each character's actual proportions. Baked crowd motion is a secondary tier, never the source of interaction truth.

## Scope boundary

The production test uses its own explicitly labeled, bounded headless fixture and public projection. It exercises the animation/action interface without changing first-turn economy or pretending to implement the complete BDI planner. General perception, factory-wide pathfinding, later supervisors, final production-ready models and physical-device certification remain separate gates.

## Implemented test boundary

`/stepanoskin/loopforge/play/agent-test` is an author review route inside the app. It reuses the actual Security/Forge geometry, materials, lighting and camera renderer. Only those two room kits are constructed for this test. Main play continues to use its existing worker projection until this cast passes owner review.

The fixture is `loopforge-agent-test/1`, 20 integer ticks per second, with a bounded 30-second take. Gate inspection and bypass have different durations. The cradle has one owner at every tick and changes owner only at committed contact boundaries. A strained worker refuses STILETTO's acceleration request in the intervention take. This is a deliberately small rule-driven BDI/action slice; it is not the full belief propagation or autonomous planning engine. Cancellation returns the test prop to its source dock and releases paired reservations without output. It is an author reset operation, not an in-game power.

The browser review runs the headless fixture locally and passes only its public projection into the renderer. It does not call the first-turn API, create quota output or alter a saved run. The visible author trace is intentionally separate from that projection. The fixture has no LLM dependency, wall clock, rendering imports or external state.

## Reproducible assets

From `apps/lab`:

```
node scripts/characters/author.mjs /tmp/loopforge-agent-export
node scripts/characters/publish.mjs /tmp/loopforge-agent-export
```

Babylon NullEngine is the offline authoring host. The recipe creates distinct silhouettes, 17-joint mechanical rigs, seven named motion clips, articulated fingers/feet and two material groups. Rigid skin weights suit mechanical plates; this is not a soft-body or cloth rig. Small original procedural metal maps add worn colour, roughness and relief. GLB export is optimized offline, checked with Khronos glTF Validator, then delivered through content-hashed immutable model/data entries in `loopforge-agents`. External model dependencies are rejected. The matching runtime loader is Babylon 9.30.0. No high-resolution source renders or authoring executable is shipped as a browser dependency.

Three workers share compatible joints but have different chest/head hardware. Close workers use roughly 15k triangles, background workers roughly 7k, LIMEN roughly 32k and STILETTO roughly 24k before post-export optimization. Full and reduced meshes remain a first calibration, not a final LOD policy. The shared float32 bone texture has 180 samples × 18 matrices × 16 floats = 207,360 bytes before transfer encoding. Its three one-second clips are sampled at 60 Hz. Instance frame selection is tied to confirmed action time; it has no independent world clock.

Compare hybrid and skeletal paths with the **same reduced background geometry**. Close actors always keep full joint control. Camera count, viewport and rendering resolution must be recorded with timings. Do not compare an idle single view against a moving three-view composition.

## Remaining gate

The art is a first authored 3D interpretation for owner review. Final silhouette approval, richer motion repertoire, robust walking foot plants, broader interaction coverage, automatic animation LOD and physical phone performance remain open. This test must not be described as the full game BDI implementation or universal AAA/performance certification.

## Measured desktop review

12 October, local production build, Chromium/ANGLE on Intel HD Graphics 620, 1280 × 800 browser, three simultaneous cameras. Six exported active-run records are in `evidence/`. These are exploratory samples, not controlled performance certification. Adaptive resolution was enabled; rows with different resolution or action phase are not like-for-like speed comparisons.

| Workers | Path | Canvas | p50 / p95 / p99 ms | Draw calls | Submitted triangles |
| --- | --- | --- | --- | --- | --- |
| 10 | hybrid | 862 × 624 | 28 / 47 / 67 | 166 | 428,484 |
| 10 | skeletal | 732 × 530 | 24 / 38 / 50 | 187 | 334,082 |
| 24 | hybrid | 862 × 624 | 28 / 52 / 75 | 169 | 714,444 |
| 24 | skeletal | 862 × 624 | 30 / 50 / 66 | 264 | 678,608 |
| 100 | hybrid | 862 × 624 | 32 / 45 / 86 | 164 | 2,263,100 |
| 100 | skeletal | 732 × 530 | 36 / 54 / 68 | 495 | 1,505,924 |

The useful result is bounded crowd scene-object/draw overhead: hybrid stays at 247 scene meshes, versus 544 at 100 skeletal workers. It submits more geometry because the current three appearance batches are culled together. Three-view p95 remains above 33 ms on this integrated GPU; **the stable 30/60 fps production gate has not passed**. Next optimizations are spatial crowd batches, auxiliary-camera detail/resolution and cast-based loading, followed by fixed-resolution A/B runs. Do not interpret fewer draw calls as finished performance work.

The author bench loads 9,114,311 raw bytes of model/rig/bake data, including both detail tiers and both supervisors; one observed warm local decode/load took 3.47 s. The 207,360-byte shared matrix texture is not the complete GPU memory budget. Initial drafts (31.22 MiB) were removed before publication; only the final immutable pack remains.

Warmed 600-tick fixture replays plus final projection (100 repetitions) measured p50/p95 of 0.58/3.26 ms at 10 workers, 0.44/1.47 ms at 24, and 0.42/1.47 ms at 100. Only one paired action is active in this fixture; these timings do not predict a full 100-agent BDI world or network/API latency.

Gate hand-contact error was corrected from 72 mm to a reported 0 mm at the inspected hold. Clearance, transfer, refusal, camera switching, fixed-tick seeking and repeated population/path changes were exercised. No browser errors were logged during those interactions. All 88 Jest suites passed across the regression run and a targeted rerun (463 tests, one snapshot). Three unrelated auth/page suites initially lacked `API_BASE_URL`; all three passed with the test origin supplied. The latest queue-lane/exit regression passes among 11 interaction-kernel tests. Asset-publication safety tests, eight model semantic checks, scoped lint and the production build passed. The final pure-kernel queue refinement was tested after that local build; the exact published commit is also built by Vercel.

The final visual pass corrected portrait framing so the supervisor and carrying worker both fit at 320 pixels, removed the page-edge background mismatch, and reduced the overbright transfer prop/docks. Keyboard seek, native-dialog Escape dismissal, main-menu return and first-shift entry were checked. Physical phone/GPU memory soak and deliberately interrupted network recovery remain unverified. Reduced-motion handling is implemented; no physical-device accessibility certification is claimed.

Hosted verification found a protected-preview loading issue: immutable model requests omitted the same-origin session and were redirected to Vercel authentication. The loader now retains the existing same-origin session while preserving integrity checks. No bypass secret or protection-setting change is required.
