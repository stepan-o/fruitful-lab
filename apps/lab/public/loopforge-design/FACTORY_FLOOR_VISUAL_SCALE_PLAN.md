# Factory floor: scale & feel

**Approved Day 1 floor · 18 November 2026.** Follow the workers in through the south Lobby, east through Dispatch and into the Security pen. Once cleared, they can reach five workrooms. Only the Lattice Forge admits them during the intro. Use the [editable factory geometry](https://github.com/stepan-o/fruitful-lab/blob/master/apps/lab/lib/loopforge/spatial/approved-factory.json) for placement. The floor board, rehearsal and artist pack use its metre coordinates, with north up, x east and y south.

![North-up measured floor. Security connects the entrance route to the Forge and four locked workrooms.](/loopforge-design/factory-floor-plan.73eea13acbcc.svg)
Figure 1. Measured plan from `approved-factory/day-one-3`. Across the north are Weaving, Brewery and Cortex. Freight travels east from the Forge into Burn-in Theatre, then south to Logistics. Open the plan at full size to inspect the thresholds.

[Inspect the rooms, passages and fixtures](/loopforge-design/factory-layout-proposal.html) · [Run the top-down rehearsal](/loopforge-design/day-one-rehearsal.html) · [Watch the rehearsal at 1×](/loopforge-design/recordings/day-one-approved-1x.mp4)

## Where to put the camera

The overview answers “Where did they go?” Use it to trace the crew through a doorway or a cortex along the line. At a machine, frame the worker, the control they touch and the first visible result together. On a phone, tighten the view around that action and leave room for the speaker’s name and bubble. Keep every foot, desk and machine at its measured position.

**C4 · The jammed press.** In the 80 × 56 m Forge, bob is planted at (131.7, 144.4) m beside the 4 × 4 m press at (130, 145) m. At 108.90 edited seconds the heel of his right palm meets the half-open door. Keep his injured left leg, striking hand and door in frame through recoil. In the narrow room proof the fingertips and heel are too small to distinguish. Compare the two cuts at the same instant. [Room proof at 1×](/loopforge-design/day-one-calibration/08c8db11/forge-room-1280x720-lit-1x.mp4) · [Contact proof at 1×](/loopforge-design/day-one-calibration/08c8db11/forge-contact-inspection-lit-1x.mp4)

![Close view of bob braced beside the press, with his right palm at the door.](/loopforge-design/day-one-calibration/08c8db11/contact-poster.webp)
Figure 2. B, Raking light · art handoff 08c8db11. Offline composite sampled 7.6 s into the C4 proof, at the authored palm contact. Use the door edge to judge where the hand lands.

**S5 · The fourth ID check.** Keep max and LIMEN at the 1.6 × 1 m ID desk. STILETTO comes back from the Forge through the staff doorway and crosses the 4.25 m apron to the boom. Establish her approach in the wider frame. In the close view keep the credential, max’s face and both raised blades visible together as he ducks. On a phone the room view loses the photograph. [Fourth-check art proof](/loopforge-design/day-one-calibration/08c8db11/fourth-id-check-1280x720-lit.mp4)

## Footprints, pivots and sightlines

The selected B assets use 64 native pixels per ground metre. bob is 70 native pixels tall and max is 85. In an untrimmed 256 × 256 frame the pivot is (128, 208). Restore any atlas trim offset before placing that pivot between the feet. A fixture’s footprint determines clearance. Its elevated silhouette and front lip can cover a hand or a card well beyond that footprint.

At S5, inspect the approach, hold and release against the desk lip, rail and boom. At C4, watch the footplant, palm, guard and moving door with speech shown and hidden. Keep the same credential owner and machine state when switching views. Swept route checks establish clearance between roots and obstacles. The rendered hands, blades and tools require frame inspection. [Placement pack and scene bindings](/loopforge-design/sprite-briefs.html) · [Delivered art bindings](/loopforge-design/day-one-calibration/08c8db11/ENGINE-MASTER.md)

## Movement and speech share the beat

The [approved script](/stepanoskin/loopforge/design#day-one-intro) and [route and timing score](https://github.com/stepan-o/fruitful-lab/blob/master/docs/loopforge/game-design/day-one-sequence.mjs) give speech and travel separate tracks. On arrival, bob glances back while max keeps walking. Leave the last steps to Security silent. During the fourth check, let the newly cleared workers hurry to their stations as each card is stamped. The three cortexes stay accounted for across the solo, paired and staffed runs.

**Bell to blackout · 165.400–190.604 edited seconds.** mae cuts the feed and kit stops the drive as the others turn. STILETTO catches the moving crew. jo, max, lou and sam answer over one another and resume walking. Her dismissal lands on their backs. ed counts eight line workers. All ten workers reach the yard. LIMEN and STILETTO follow at 1.25 m/s and are still inside when the lights go out. [Rehearse the ending](/loopforge-design/day-one-rehearsal.html#end-of-shift) · [Writing and timing](/stepanoskin/loopforge/design#writing-style)

**For SYSTEMS.** The 190.604 s edit includes travel cuts. Use world time and the actor tracks for admission, travel and work. A cut or view change confers no movement, perception or knowledge. At the fourth check, use the desk, apron and doorway to establish who could witness the exchange. Any rule about who notices it or how they respond belongs to the simulation. In a replay compare actor positions, gate state, credential custody and the three rack slots before and after switching views.

## What to check in the sprite build

**Framing test for ENGINE and ART DIRECTOR.** At 1280 × 720 and 390 × 844, then 320 CSS pixels wide with dialogue visible, play both contacts at 1×. Record the displayed height of bob and max, ask which part of the hand freed the door and whose face is on the card, and check all four overlapping replies can be attributed while the workers move. These are proposed live checks. The gallery contains composited proofs. [Calibration gallery](/stepanoskin/loopforge/design#day-one-art-calibration)

Sylvester, *Designing Games* (2013), chapter 9, “Interface,” **“Visual Hierarchy,” printed pp. 227–228** (PDF pages 235–236, counting from 1). The relative visibility of cues affects what a player notices first. At the press, spend the available pixels on bob’s hand and the door while keeping the casing quiet. At S5, put the face and card together and let the background queue recede. The two identification questions above test whether that choice communicates the action. A larger image alone cannot establish that it worked.

**Performance test for ENGINE.** The proposed targets are 30 fps on a modest phone and 60 fps on a capable desktop. Run the occupied line and the four-reply exit. Record device, viewport, pixel ratio, frame intervals, texture memory and cold/warm loads. Check for stalls when switching from overview to contact. Compare the event trace after reducing shadow, light and particle detail. The approval of B covers the visual treatment. Live contact, phone performance and owner review of the integrated sequence remain open. [Engine delivery reference](/stepanoskin/loopforge/architecture/webview)

## Historical evidence

### Compact R10 rooms · 25 October 2026 retrospective

The owner approved the demonstrated R10 3D slice in its own coordinate frame. Its Lobby measured 16 × 11 m, Security 8 × 7.5 m with a 4 × 2.5 m connector, and Conveyor 24 × 14 m. In that run three outputs completed and all twelve cast members were outside at night. Use those captures to study framing. Current placements and the current ending come from the November plan and score above. [R10 scene studies](/stepanoskin/loopforge/play/scene-studies) · [Dated retrospective](/loopforge-dev-blog/retrospectives/2026-10-25-second-retrospective/index.html)

At factory clock 08:09:57 the staffed view showed all four controls and the central aisle. At 08:01:53 the Forge view showed the workpiece but cropped most of bob. The dialogue card could also cover a speaker. These Producer-captured running-game stills establish the crop at those instants. Hand contact, gait and sustained performance need motion evidence. [Staffed line capture](/loopforge-dev-blog/media/2026-10-25-day-one/r10-staffed-layout-948c584293ef.png) · [Cropped Forge capture](/loopforge-dev-blog/media/2026-10-25-day-one/r10-forge-crop-2e3fa5238d95.png)

### Large-hall study and CCTV proposal · 11–12 October 2026

The earlier study framed a 10–14 m working cluster inside a 72 × 48 m Lobby. The desk close-up lost the entrance and queue. The useful lesson was to keep the immediate upstream or downstream connection visible. The study proposed three CCTV angles per selected room, including desktop multi-feed and a single feed on phones. R10 had selectable room cameras and story shots. Its review did not exercise the operating feeds. Neither study establishes a multi-camera requirement or measured sprite performance.

[Complete October study, budgets and research links](/loopforge-design/FACTORY_FLOOR_3D_STUDY_2026-10-11.md) · [Lobby evidence from 11 October](/loopforge-design/LOBBY_VISUAL_PASS_2026-10-11.md) · [Original Lobby art](/media/files/ae82e775b1060842bf8b2364500c6bc7f547b37b2212b226fcdba1e8f42e02aa.webp)
