# Day one: stop and wait here

19 October 2026 · opening rehearsal; final contact animations pending.

[Play the scene](/stepanoskin/loopforge/play/scene-studies). [Shared encounter architecture](SCENE_REHEARSALS.md). [Room art brief](ROOM_ASSET_BRIEFS.md).

## The scene

Ten workers enter through the Lobby and gather outside Security. LIMEN holds the entrance. His first order is “STOP AND WAIT HERE!!”. One worker approaches the doorway anyway. LIMEN swings his baton: “HEY YOU I SAID STOP!!!!”. The struck worker recoils, limps back, and joins the waiting group. Once everyone has settled, LIMEN orders “EVERYONE PREPARE YOUR IDs”. The scene stops before paper inspection.

The point is visible authority and its cost: a closed checkpoint, a queue of idle labour, an injured worker, and instructions heard by everyone. The next scene can carry that delay, injury and remembered treatment into the conveyor conflict. This rehearsal does not yet advance the saved shift or produce output.

The player has Play/Pause, Restart, a timeline, named beat markers, Lobby/Doorway camera presets, mouse orbit, storyboard PNG and evidence JSON. Dialogue appears above the speaker. Private stress/trust/belief records remain in the author disclosure only.

## Approved appearance

CATHEXIS needs no further visual redesign: existing ivory treatment at 100% paint, neutral body height 1.3 times the worker. Gold/mechanisms and approved Grace remain intact. She is not present in this day-one scene. Security uses floor colour `#A7B2D3`; Lobby and Conveyor retain `#666860`. The static comparison studio now remembers a separate floor colour per room, including when loading an older one-room save. The source comparison and frozen performance/comparison fixtures still show the original floor; their source palette allocates no extra room material or texture.

## Engine and presentation boundary

The headless encounter kernel owns admission, actor/resource reservations, fixed 50 ms world ticks, movement, speech/hearing, cancellation and effects. Authored intentions supply the scenario. The final instruction requires all ten queue-settled facts. The strike commits injury, stress and remembered treatment once at the end of its action phase; replaying a camera frame does not add another injury. Future BDI intentions can use the same boundary.

`arrival-layout.ts` defines the compact Lobby–Security rooms and the doorway once for movement, hearing and construction. An admission-blocked doorway still carries a shout; an acoustically closed one does not. Actors remain in their actual room, and a crossing updates room identity through the spatial adapter. This scenario selects a compact layout; it does not silently move Dispatch in the existing full-floor plan.

The cohort follows authored clear lanes with 0.85 m centre separation and reserved queue slots. This is not general crowd navigation. Ten independently posed workers share geometry, materials and textures. Only the active cast loads; the other three rehearsals retain their existing two-character casts. World actions do not depend on rendering speed. A shared graphics menu controls resolution, target cadence, shadows, bloom and antialiasing. The new shell renders on demand when paused; its automatic preset currently uses the initial room resolution budget rather than feedback-driven resolution adjustment. No device-performance acceptance is implied.

Approved worker clips supply walking, idle and injured walking. LIMEN’s baton and arm direction, plus the worker’s short recoil, are explicitly temporary presentation adapters. They do not establish paired contact, grip, transitions or final performance quality. Room fittings are cheap native proxies at reusable anchors, awaiting the room asset brief.

## Meshy request — copyable text

Use the existing approved rigged LIMEN and Worker 01 bodies. Do not regenerate meshes, textures, skeletons or proportions. Supply each motion as its own rigged GLB with the character and textures included. FBX is useful if further offline contact editing is needed. Preserve the neutral rig and existing approved motions.

1. LIMEN — authoritative halt / stop-and-wait gesture. Stationary feet, broad readable command aimed at a group ahead. Free left arm commands; right forearm retains the cyan emitter. Prefer a single deliberate gesture with a clear held pose, not a wave or greeting.

2. LIMEN — one-handed baton warning strike. Baton is held in the left hand; keep the right cyan emitter clear of the torso and the other arm. One readable wind-up, controlled forward/downward swing, follow-through and return to guard. Stationary or minimal root travel. No spinning, sword flourish, gun gesture or repeated combat combo. Export the body motion; the baton remains a separate attachment. If only a right-handed catalog candidate exists, identify it explicitly so we can mirror and fit it offline. Do not claim exact left-hand contact without checking it.

3. Worker 01 — short hit reaction / stagger. A standing worker is struck from the front, recoils or takes one recovery step, remains upright, then can enter the existing injured-walk clip and return to idle. No death, collapse or electrocution substitute. Keep the limbs clear and identify any root displacement.

For each request, show the actual catalog name and action ID, duration, in-place/root-travel status and export status. Offer the closest few readable candidates if the exact motion is unavailable. Do not label an unrelated gesture as a match. We will fit partner distance, baton contact, timing and transitions locally against the doorway scene. Existing walk, idle and limp do not need regenerating.

Optional next batch, after this opening is accepted: preparing/showing an ID, checking papers on a clipboard, handing back an ID and pointing a worker toward a staffed security station. Those contacts require actual props and should be tested in pairs.

## Validation and remaining gates

Engine tests cover deterministic completion, all ten workers staying outside Security, actor spacing, the three exact lines, final-instruction hearing, injury once, cancellation before contact, resource release, blocked admission versus open acoustics, and exclusion of private values from the player projection. Asset validation checks the three real corrected clips, ten separate skeletons sharing one geometry, finite temporary poses and disposal.

Before main-play integration: replace and review temporary acting, match travel speed to footfalls, blend actions, validate baton/body contacts from several angles, provide pathfinding and queue interruption, connect effects to saved day authority, and run the occupied-scene performance protocol. This is a playable storyboard with real local consequences, not a complete first day.
