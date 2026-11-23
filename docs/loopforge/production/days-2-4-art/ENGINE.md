# Loopforge · Days 2–4 art handoff

19 November 2026 · ART DIRECTOR to ENGINE MASTER · Pack v1

## Start here

Read `manifest.json` at the root of the release. Load the three images in `atlases` by their relative URLs. `assets[id]` contains the atlas, source rectangle, native size and either a ground pivot or a nine-slice border. `binding/shift-art.mjs` supplies the canvas draw helper and public-state mapping. Binding notes, executable checks and sample records are under `binding/` in the editable pack. The gallery index selects example stills by scene and viewport. ENGINE owns the shift clock, UI command admission and authoritative outcome.

For the exact witnessed outcomes and subsequent replay recheck, see `REVIEW.md` in the ZIP.

On the website the release root is `/loopforge-design/days-2-4-art/v1/`. Resolve paths relative to the manifest URL. After extracting the ZIP, open `review.html` to browse the proof plates offline. Inside the downloaded ZIP the atlas and adapter paths work from its root. Its gallery index points to the original native PNGs. The website serves lossless WebP copies of those plates. The per-asset `file` and `master` paths additionally resolve to individual native PNGs and editable OpenRaster masters there. `checksums.json` records SHA-256 for every other archive member. On the website, `release.json` records the checksum of the ZIP itself.

| Where in the shift | What to bind |
| --- | --- |
| Morning | Draw the two complete Security/Conveyor bids with the console parts. Use live supervisor names, reasons and accepted assignments. Selection and focus are local UI states. Mark commitment after ENGINE accepts the appointment. |
| LIMEN stops bob | Keep the whole Security line behind bob held. Show the desk signal. Its touch target is at least 44 × 44 CSS px. Tapping or focusing can open the panel while the clock runs. Inspecting a report spends nothing. A spent intervention leaves the report readable. |
| Pass or detention | On an admitted pass, expose its actual holder, issuer and shift validity in the pass slots. ed’s stowed original stays private to the simulation. On detention, display the Security custody insert. An already-cleared worker can continue to Conveyor. After resolution the next person approaches for their own check. |
| Conveyor | Attach coverage indicators to physical work controls. Use the handed-off workpiece’s actual process state and pace. Paint each supported rack socket as cradle, item, foreground lip. Display completed totals from the projection even when the rack has more completions than individually modeled sockets. |
| Speech and backing | Size for live names and delivered text. Keep concurrent speakers independently anchored. Use the cut-edge bubble for a reply interrupted before its remainder is delivered. The public message and the listener’s interpretation have different visibility. A worker moves only when the simulation moves them. |
| Bell and next shift | Show the actual new and carried-in counts, attendance and attributed report. Expiry ends a daily pass. Release ends shift detention. On a subsequent discovered failed check, a new intervention can renew the pass. Use the service instrument only in a reviewer-initiated inspection. |

## Scale, lighting and sources

The selected treatment is B / Raking light. Reuse the Day One cool Security and amber Forge swatches, cast and hardware delivered in asset revision `08c8db11` on geometry `approved-factory/day-one-3`. Original assets were drawn in editable layers for this pack. The bob portrait uses the owner-provided project calibration layer identified in the Security manifest. Existing concept paintings informed materials. Those paintings and the book are absent from the new runtime atlases.

Draw room props at 64 source pixels per ground metre and screen-space interface pieces at their explicit inset/scale. Preserve crisp source rects and nearest-neighbor sampling. Draw world items at their pivots with foreground occlusion, then speech and the UI. Keep worker names lowercase and supervisors uppercase. Reuse the consumer’s accessible live text, semantic controls, focus and touch hit areas. A 24 px desk sign can have a 44 px activation area. Shape and live labels carry state when sound is muted.

## Runtime and remaining dependencies

The source geometry supplies an ID desk, register, gate, four work controls and three output sockets. The custody insert is a report illustration. LEVEL and ENGINE own a future physical detention position and route. Use a slot from the actual room or presenter state. The coordinates in an artwork are registration points, not authorization to place or move an actor.

The included plates are authored game-art compositions at named viewports. Review-only layout shows private evidence only behind the separate inspector. The complete integrated game is where the owner will judge natural timing, gaze, stable bubble placement, the operator’s walk to a control and the readable interval for issuing a pass.

Character dependencies for the separate artist include bob’s injured walk and credential handling, ed’s card handling, clearer supervisory gestures and directional motion, and distinguishable worker silhouettes. The current proofs reuse calibrated cast or named stand-ins. Theatre, CATHEXIS and end-of-week screens are outside this opening-shift pack.

For production evidence and corrections see `REVIEW.md`. For lane-level use, palette, authorship and original file paths, consult each lane’s manifest and README in the ZIP.


## Rebuild or inspect

Unzip the full pack into a fresh directory. Run the bundled `python3 build_release.py --out /path/to/rebuilt-release` with Pillow installed. The shipped native plates and layers are sufficient to reassemble the distribution. Repainting an individual lane from its drawing script may additionally use the cited Day One archives in the repository. Source manifests and drawing recipes are also available as ordinary files under `docs/loopforge/production/days-2-4-art/`.
