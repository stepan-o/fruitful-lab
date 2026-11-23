# Raking floor correction · 19 November 2026

Art delivery for the Days 2–4 Security and Conveyor cameras. [Review the comparisons](/loopforge-design/floor-correction/v1/index.html) or [read the binding note](/loopforge-design/floor-correction/v1/ENGINE.md). Runtime files, editable OpenRaster masters, the placement manifest and proofs live together under `apps/lab/public/loopforge-design/floor-correction/v1/`.

## Authorship and rebuild

The 18 November B exemplar contains separate enamel/grain and joint layers under `png/` in [01-style-B.zip](../day-one-sprite-calibration/01-style-B.zip). The original material study supplied the grain. This correction reuses the artists' enamel, plate lips, countersunk screws, queue grip and service louver. The toroidal material filter quiets the larger enamel pattern. The desk approaches, operator wear, oblique light masks, falloffs and press-side practical were authored for the measured factory. The grating and distinctive abrasions belong to the nonrepeating room layers.

Open an ORA file in Krita or GIMP to edit its individual layers. Each ORA canvas and merged preview has exactly the runtime extent. To rebuild from the archived source and change the authored positions or masks, run `python3 docs/loopforge/production/floor-correction/build.py` with Pillow and NumPy. Changes painted directly into an ORA should be exported from the editor. Regenerating from the script recreates the original delivery.

## Proof provenance

Before and after compositions draw the current painter and atlas foreground at the same verified public snapshot. A native Canvas renderer draws the matched stills with a backdrop made from either the old painter or the four proposed exports. The signal and lower-left status cue are composed at their viewer positions. The full production captures were taken separately in Chromium at the matching checkpoints. Paused comparisons verify lighting across the joints. They carry no timing or device-performance claim.

| View | Fixture, snapshot | Public SHA-256 |
|---|---|---|
| Security · Missing ID | missing-pass.json · initial · 5671 | cd3d285ef8ca0d089470d6da0fe62af08068fa08cbd53b318cf41d5c27f47602 |
| Conveyor · Conveyor chat | chat-rushed.json · initial · 6142 | 7b3b126e50589ae719e898f05e222c7ef09ac180d75b61d82e8d442779eb067a |

The supplemental pass proof uses the accepted baseline in missing-pass.json. The warm camera includes the in-process carrier at Wash and the three outfeed sockets. Every file named *live.jpg is a production capture. The before/after WebPs are whole-camera compositions. The material sheets show four repeats across and three down without room lighting.

## Frozen 18 November reference

| Original | SHA-256 |
|---|---|
| 01-style-B.zip | 4982f06004024fed4e5852d965cc3237bbc2ef7ea158c00b00e1c16bbb1141bf |
| tile-security.webp | a2e580a915f60d6348e72bf34c09d37475c230250cca061f1398126c177fe364 |
| tile-forge.webp | d313d785189a74c3a1ccfb82a7971104f593dcefcb3b60500803cd0827485c0d |
