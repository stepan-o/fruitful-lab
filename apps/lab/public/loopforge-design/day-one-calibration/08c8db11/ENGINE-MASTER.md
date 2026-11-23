# Loopforge Day One · 2D asset handoff

The owner selected **B, Raking light**, for this four-lane calibration. Use the supplied art as a skin over the shared Day One simulation. ENGINE MASTER owns the live prototype. Final owner review takes place in that build.

## Asset entry points

The individual ZIPs open at the root of each lane. The combined handoff has the same contents in four numbered directories.

| Lane | Load first | Production assets |
|---|---|---|
| [01 · Two-room exemplar](01-style-B.zip) | `style-lock.json` | bob r2 OpenRaster master and alpha layers, 4 × 4 m Security and Forge swatches, selected B actor and floor lighting, separate cast shadow, emissive and S5 depth test |
| [02 · Morning walk](02-morning-walk.zip) | `manifest.json`, then `motion/reusable/` | Frozen max r2, eight-phase north/south in-place gaits for both workers, addressable jaw and glance overlays, frame exposure and footfall data |
| [03 · Fourth ID check](03-fourth-id-check.zip) | `exports/lane03-pose-manifest.json` | LIMEN, STILETTO and the same max, his credential, grip, desk back and lip, rail, boom and separate light layers |
| [04 · Jammed press](04-jammed-press.zip) | `palm-unjam-manifest.json` and `display-track.json` | bob’s injured plant, palm contact and recovery, plus separate C4 housing, front guard, door and control |

## Binding to the shared game

Use **approved-factory/day-one-3** and the pinned edited sequence. All times below are edited seconds. The full intro runs **190.604 s**. Use the shared world clock and tracks for root motion, dialogue, actor facing, credential custody and press state. The lane tables index art poses. The runtime continues to own the gate, three cortexes and the final departure where workers hurry out and both supervisors are still inside at blackout.

Actor exports use a 256 × 256 untrimmed frame and a ground pivot at **(128, 208)**. For trimmed atlas cells, first restore the descriptor’s trim offset. Register the resulting pivot between the feet at the engine ground anchor. World x increases east and y south. Ground textures use 64 native pixels per metre. bob stands 70 native pixels high and max 85. Apply a provided B light overlay once, then the optional emission. A prelit body already includes the room paint pass. Sort shadows, actor parts and foreground fixtures using the lane manifests.

| Edited interval | What to bind and verify |
|---|---|
| 0.00–16.30 · Morning walk | max tucks his jaw and carries LIMEN’s bearing over two 0.775 m strides from 0.50–1.50. bob looks back without interrupting his gait. Preserve the northbound approach, the 12.50 travel cut, southbound arrival and silent last steps. |
| 101.30–110.50 · C4 | Register C4 at (130, 145) m, with bob at (131.7, 144.4) m. He unloads his anatomical left leg. The right palm heel meets the half-open door at 108.90. The release follows the machine state. His westward track resumes at 109.10 during the recoil. |
| 125.10–139.90 · S5 | Hold LIMEN and max at the measured checkpoint. STILETTO returns across the 4.25 m apron. The photo comparison runs 130.70–137.65, her blades stay up until 139.20, and the card returns as max ducks. The pose table has the extra exit samples through 140.10. |

The same max SE body and head are registered in the walk manifest and the fourth-check descriptor. The credential portrait comes from that head. `approved-cues.json` records the source dialogue windows, cuts and relevant actions. `calibration-index.json` records the handoff hashes and binding paths.

## Screening and live acceptance

[Play the 42.7-second calibration reel](Loopforge-Day-One-Screening.mp4). It opens with the neutral exemplar, then plays the three moving excerpts at 1× in story order. The art proofs use original on-screen dialogue. The supplied rehearsal clips have no voice track. Each motion lane includes full-room and speech-hidden or emission-off proofs, plus desktop and phone framing checks.

The proof lens makes the important contacts inspectable. At the narrowest Forge room framing, the heel of the palm occupies too few pixels to distinguish it from the fingertips. The fourth-check photograph similarly needs closer framing to show max’s features on a phone. Use the C4 and S5 inspection views as framing references in the live prototype. Confirm readability with the 320 px dialogue rail, then verify depth, planted feet, live state-driven seeking and playback on desktop and phone. GPU timing and memory measurements belong to that build.

Production references are [the corrected layout and edit](https://github.com/stepan-o/fruitful-lab/pull/153) and [the merged art plan](https://github.com/stepan-o/fruitful-lab/pull/154).
