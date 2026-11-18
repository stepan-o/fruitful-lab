# Loopforge | Day 1 pixel-art production plan

18 November 2026 · For owner review

## What the room should look like

Security should look cold enough that LIMEN’s pale steel catches the light before his cyan blade moves. Down the line, the Forge casts amber across the crew, including the undersides of their hands. Keep enough blue on bob’s enamel to recognize him in either room. Chipped paint belongs on the desk lip, rail, knuckles and press handle. Leave space around the grate for an off-white card and the edge of ed’s boot to register at room size.

| Owner decision | Direction for the artists |
|---|---|
| Surface detail | Worn enamel in broad shapes. Group chips where people and machinery touch. |
| Sprite scale | About 72 native pixels from sole to crown for a typical standing worker. Preserve the cast’s individual heights, widths and proportions. Check the actual displayed height on phone and desktop. |
| Projection | Fixed north-up floor and elevated three-quarter bodies and fixtures. The top of the ID desk, max’s jaw and the approach from the Forge must read in the same shot. |
| Acting | Broad physical comedy. max borrows LIMEN’s bearing for two strides while talking. Other workers continue walking. ed can play the theft with one boot while his shoulders hold their official posture. |
| Lighting | Strong cinematic contrast. Security has deep teal shadows and narrow lights. Amber reaches across the working line. Maintain bob’s blue, LIMEN’s steel and STILETTO’s black body, red shoulders and T-shaped visor in both rooms. |

Use the measured SVG, scene bindings and edited sequence from `approved-factory/day-one-3` at `d0e85b3a8d29b39da320d342fdff40847c478c8c`. The edit lasts 190.604 seconds. These sources govern footprints, room connections, travel cuts, actions and timing. [Pinned artist pack](https://github.com/stepan-o/fruitful-lab/blob/d0e85b3a8d29b39da320d342fdff40847c478c8c/apps/lab/public/loopforge-design/sprite-briefs/day-one-2d.27ccffdd47398e1f.zip)

## First build and review

I’ll prepare one candidate style sheet with the same bob pose against the Security and Forge floors, at native size and at the room camera’s displayed size. It will set the proposed palette, shading, edge treatment and viewing angle. I’ll use selective dark edges where adjacent shapes merge, square pixels and crisp scaling. I’ll check a names-hidden version with glow disabled. You’ll select or correct the sheet before it becomes the reference attached to artist assignments.

The motion trial covers four actors across three short excerpts. Only the facings used in each excerpt need finished frames. All other actors and equipment can retain their rehearsal placeholders for this review.

| Corrected scene excerpt | Finish for this trial | What the owner should be able to see at 1× |
|---|---|---|
| Morning walk | max’s walk and jaw imitation, bob’s walking head turn, both under the approved lines | max becomes recognizably LIMEN for two strides. bob notices. Their feet keep pace with the queue, including through dialogue. |
| Fourth check | LIMEN’s ID-photo check, max’s face turn, STILETTO’s approach and two-blade threat. Finish one ID desk and the credential. Use the measured boom and rail as occluders. | LIMEN holds the photograph beside max’s face while STILETTO crosses the 4.25 m apron from the Forge to the boom. Her blades, the card and max’s jaw remain visible together. This is max’s credential. |
| Jammed press | bob’s heel-of-hand strike, the sticking door and one press control, in a small Forge floor section | bob plants his feet, hits the half-open door and recoils. His palm meets the door at the authored contact. The same blue worker reads under amber light. |

Use the ID desk at build marker S5 (1.6 × 1 m) and the Forge press at C4 (4 × 4 m). Draw the doorway and actor ground anchors from the supplied geometry. This trial covers two floor swatches, one finished desk, one credential template and the working face of one press. sam’s kneel, ed’s boot and the complete machinery assemblies belong to the next batches.

## Engine integration

Before artists expand a sheet, I’ll agree with Engine on world-to-pixel scale, an untrimmed source canvas, a ground pivot in pixels, the current action-facing data, attachment names and the runtime asset paths. A 72 px neutral body is the drawing target. Individual actors can keep more headroom for a blade or a fall. I’ll supply an editable layered master, straight-alpha sRGB PNGs, frame durations, pivots, foot and hand contacts, and necessary foreground slices. Engine supplies positions, facing, action phase, credential ownership and machine state. Each lighting treatment derives from the same actor master.

The first technical test is a bob sprite and one fixture at their measured positions, including a pass behind the fixture. Then we’ll insert the three excerpts into the running Day 1 scene and capture them at 1×. I’ll check hand contact, foot planting, the readable walking line, clean edges and depth order at 1280 × 720 and 390 × 844, plus the dialogue layout at 320 px wide. Record displayed actor heights and distinguish phone viewport playback from measurements on an actual device. Engine records frame rate and memory. A pending renderer or missing action sample stays an explicit integration dependency.

## Artist queue after approval

The owner launches each assignment and returns the output to me. I’ll issue each brief when its references and dependencies are ready. During calibration, the orders are the two-room exemplar, the max/bob walking exchange, the fourth-check group at its measured desk, and bob at the press. The latter orders reuse accepted poses, colors and contact positions. Each includes an early sample before additional frames.

After the in-scene calibration review, expand in this order:

1. **Security and the gate.** Finish bob’s fall and persistent injury, sam’s support, ed’s boot-stop and pocketing of bob’s credential, LIMEN’s check, STILETTO’s pass and gus’s desk. Build the rail, desks, boom, drain, cards and ledger as a reusable checkpoint kit.
2. **Conveyor and the ensemble.** Complete the remaining worker performances, the five stations from Intake to Output, the carrier, the three product states and the occupied hall. Review bob’s first output, the paired second cycle, then the unbroken third run through sam, bob, jo and max to lou’s count.
3. **Arrival, release and the remaining factory.** Finish the exterior, Lobby, Dispatch, locked thresholds, room shells, lighting transitions, dialogue and supporting effects. Test the four overlapping replies while the workers resume walking. STILETTO dismisses their backs. LIMEN and STILETTO follow at 1.25 m/s and are still inside at the cut.
4. **Full intro review.** Show uninterrupted normal-speed desktop and phone playback, with three cortexes still on the rack at the count. Review with speech both visible and hidden to distinguish text legibility from physical acting. Deliver editable masters, runtime exports, provenance and the asset register. Track the six sound entries from the 53-entry catalogue with Engine and the audio owner at their authored cues.

Each artist gets a completed copy of the supplied assignment template with stable asset IDs, accessible reference images, the selected exemplar, a measured scene crop, dimensions and pivots, exact facings and actions, file formats and a scene-specific pass condition. I’ll check the returned files, direct corrections and record the chosen version against its runtime placement. You approve the integrated visual result.

**For approval** — the production plan and its four-character calibration scope. The first reviewable output will be the two-room style sheet. The next review will show motion and contact in the running scene.
