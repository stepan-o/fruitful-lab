# Loopforge — Dispatch and Foundry production asset history

Built-in imagegen only. No repository edits.

## Selected outputs

- Dispatch clean backplate: /home/stpn/.codex/generated_images/01a11cdb-b03e-71b2-a6f8-340714142a83/exec-9982b2f3-47bf-46d9-9212-58d02981cd5d.png
- Foundry clean backplate: /home/stpn/.codex/generated_images/01a11cdb-b03e-71b2-a6f8-340714142a83/exec-01682ffe-bdb5-4d02-a230-8e11a9f94e73.png
- Dispatch leadership-handset overlay: /home/stpn/.codex/generated_images/01a11cdb-b03e-71b2-a6f8-340714142a83/exec-7241e07d-32e3-451a-b49b-b0805eab45c6.png
- Foundry leadership-handset overlay: /home/stpn/.codex/generated_images/01a11cdb-b03e-71b2-a6f8-340714142a83/exec-170c26d7-d8af-4876-98b8-1149f7425efc.png

## Verification

All assets are 1672 x 941. Backplates are RGB. Handsets are RGBA with alpha extrema 0 and 255.
Dispatch substantive alpha bbox (alpha > 8): (897, 440, 1643, 731).
Foundry substantive alpha bbox (alpha > 8): (52, 600, 609, 801).
Both overlays have some alpha=1 pixels outside those substantive bounds; clip to the handset rectangle during fitting.
IMPORTANT: imagegen preserved style and angle but enlarged the extracted handsets somewhat; do not assume a full-canvas untransformed overlay perfectly aligns with the backplate. Fit the substantive receiver bounds to the source handset. No pixel-accurate cutout claim is made.

## Earlier dispatch concept prompt history

/tmp/loopforge-dispatch-prompts.md

## Exact dispatch clean-backplate prompt

Use case: precise-object-edit
Purpose: faithful clean production backplate for runtime game UI, not a new concept or alternate design.
Make a narrowly targeted cleanup of the reference. Keep the source image's exact 16:9 canvas, crop, composition, perspective, object silhouettes and positions. Preserve its art style and material rendering exactly. Do not add objects or reorganize the interface.
All SIX existing camera screens must become perfectly BLACK EMPTY GLASS. Remove all room art, diagrams and pictures from them. Keep their exact frame boundaries and size. No text, numbers, symbols, portraits, logos, slogans or writing anywhere in the finished image. Erase only ink/engraving/lettering from all title plates, control plaques, tapes, paper, dial faces and quota forms; retain the physical blank substrates, clean edges and material. Retain tape labels as blank tape surfaces where these are static labels.
Turn every beacon and call indicator OFF: dark unlit glass with only subtle neutral material reflections, no illuminated core, no amber glow, no flare and no emissive light spill. Remove the previously emitted spill from nearby objects while preserving ordinary environmental shading.
Remove temporary HOLD seals/tape spanning interactive controls and locking crossbars that block moving controls, so every control is available after acknowledgment. Keep the actual handles, mechanical selector, knobs, bezels, cages/side supports and the main handset silhouettes and positions unchanged. Do not remove the handset: it MUST remain visibly seated in the base.
Clean blank quota/instrument plates. No incidental outer room or newly added background scenery; preserve the tight console framing and existing structural composition. Finished image is ONLY the functional console backplate without labels, live screens or active lights. No graphic annotations, no examples, no transparency for this backplate.
Specific reference/style: the red/cream/black graphic woodcut-and-gouache mechanical dispatch office. Preserve the existing illustrated marks, limited palette and asymmetry. The one large upper-left screen and five tiny stacked strip screens to its right must all be black empty glass, with EXACTLY the same borders and geometry. The huge oxblood leadership phone stays at bottom-right, its giant handset stays in exactly the same angle and position. Remove the cream HOLD tape across the five left-hand levers entirely, leaving the five levers unchanged. Keep blank cream plates but erase LEADERSHIP, LIFT RECEIVER, QUOTA, LOCKED, LOOPFORGE, DAY 01 and ALL other writing. Papers stay but all lines/writing become blank. Right-shoulder beacon must be dark amber-brown unlit glass; remove the orange painted spill on the wall/ledge/receiver and its bright outline. The former wall area behind the beacon becomes a quiet flat soot-black structural console backing surface in place, without expanding the crop or moving the beacon. Do not turn this illustration into photorealism.

## Exact foundry clean-backplate prompt

Use case: precise-object-edit
Purpose: faithful clean production backplate for runtime game UI, not a new concept or alternate design.
Make a narrowly targeted cleanup of the reference. Keep the source image's exact 16:9 canvas, crop, composition, perspective, object silhouettes and positions. Preserve its art style and material rendering exactly. Do not add objects or reorganize the interface.
All SIX existing camera screens must become perfectly BLACK EMPTY GLASS. Remove all room art, diagrams and pictures from them. Keep their exact frame boundaries and size. No text, numbers, symbols, portraits, logos, slogans or writing anywhere in the finished image. Erase only ink/engraving/lettering from all title plates, control plaques, tapes, paper, dial faces and quota forms; retain the physical blank substrates, clean edges and material. Retain tape labels as blank tape surfaces where these are static labels.
Turn every beacon and call indicator OFF: dark unlit glass with only subtle neutral material reflections, no illuminated core, no amber glow, no flare and no emissive light spill. Remove the previously emitted spill from nearby objects while preserving ordinary environmental shading.
Remove temporary HOLD seals/tape spanning interactive controls and locking crossbars that block moving controls, so every control is available after acknowledgment. Keep the actual handles, mechanical selector, knobs, bezels, cages/side supports and the main handset silhouettes and positions unchanged. Do not remove the handset: it MUST remain visibly seated in the base.
Clean blank quota/instrument plates. No incidental outer room or newly added background scenery; preserve the tight console framing and existing structural composition. Finished image is ONLY the functional console backplate without labels, live screens or active lights. No graphic annotations, no examples, no transparency for this backplate.
Specific reference/style: the cinematic worn soot-and-brass foundry console. Keep this EXACT cinematic painted industrial style and dense bounded patina. The contiguous upper display has six panes in a 3-column by 2-row layout; make ALL six black empty glass with exact existing separators. Remove every camera title including handwriting on four tape surfaces; the tapes remain physically present and blank. Remove the LOOPFORGE title and all other text and robot silhouettes in the five supervisor portrait windows; those windows become empty dark inset plates. Preserve the ivory handset in its original bottom-left cradle. Preserve the central intercom selector and right red production handle. Remove the horizontal restraint bar that crosses the central selector and the horizontal obstruction bar in front of the red production handle, keeping the actual selector, red handle and their side supports. The top-right beacon and the phone's small front indicator are off, no orange emitted light. Keep warm metal coloring from normal reflected illumination but no active emission. Quota paper remains clean blank paper with sprocket holes. No outer room background and no reframing.

## Exact foundry clean-backplate cleanup prompt

Use case: precise-object-edit
Image 1 is the chosen clean production backplate. Image 2 is the original concept, supplied ONLY as a positional reference for four small tape labels.
Preserve Image 1 completely with ONLY these tiny cleanup corrections:
1. Reinstate the four original small physical masking-tape rectangles at their exact Image 2 locations inside the screen panes: lower-right of top-right pane; lower-right of bottom-left pane; lower-right of bottom-middle pane; lower-right of bottom-right pane. They must be plain blank beige/gray tape, absolutely NO writing, letters, numbers or marks. Match original perspective, sizes and torn edges.
2. The five small supervisor portrait windows directly above the center rotary selector must be completely empty dark glass. Remove all ghosted silhouettes or residual robot heads; no pictures or symbols.
All six large screen panes remain black empty glass, every label and quota paper remains blank, every light remains OFF, and the mechanical controls remain available with removed obstruction crossbars. Preserve the ivory handset and exact source composition, 16:9 framing, perspective, wear and cinematic soot/brass art style. No other changes.

## Exact dispatch first handset extraction prompt

Use case: background-extraction
Edit target: supplied mechanical dispatch clean backplate. Create a PRECISE TRANSPARENT OVERLAY of ONLY the giant oxblood telephone HANDSET/RECEIVER, extracted from this image without redesigning it.
The output canvas must retain the exact full reference image dimensions, aspect ratio 16:9 and coordinate system. Keep the receiver at the EXACT SAME POSITION, SAME SIZE and SAME ANGLE as in the source, in the lower-right of the full canvas, approximately spanning x=57% to 99%, y=47% to 77%. Do not recenter it, do not enlarge it, do not move or straighten it.
Keep the complete arched red receiver body and its two thick black earpiece/mouthpiece end cups, with the same original painted chips, gouache/woodcut marks, planar shading and silhouette. Preserve the right end if it approaches the image edge. Keep the entire dark underside that belongs to the handheld receiver.
Remove EVERYTHING else to true alpha transparency: no telephone base, no silver/cream cradle hooks, no coiled cable, no desk, no monitors, no beacon, no labels, no shadows outside the receiver contour, no checkered pattern. The empty gap under the receiver arch is transparent. Holes and spaces between receiver and background must be transparent. Preserve the receiver's self-shading only. No added lighting or glowing effects. This layer will be composited directly over the reference image in exactly the same place and animated slightly on hover, so exact silhouette, coordinates and style fidelity are critical.
Transparent background required. Only ONE receiver, no other objects.

## Exact foundry handset extraction prompt

Use case: background-extraction
This is precision cutout work. Extract ONLY the existing ivory leadership telephone receiver from the supplied clean foundry console image onto true transparent alpha.
Keep the EXACT ORIGINAL source camera angle, perspective, silhouette, ivory enamel and dark end cups, original wear, original reflections and source scale. Do not reinterpret, repaint, redesign, recenter or invent the handset. The handed receiver itself is a broad curved ivory bridge with the two dark metallic circular end-cups beneath it. Keep the receiver self-shading, remove external cast shadows.
The PNG canvas remains the same full 16:9 image dimensions and coordinate system as the input. The receiver stays exactly in its existing bottom-left position and exact existing size: roughly x=2% to 31%, y=64% to 82%. Every other pixel is alpha transparent. The rest of the canvas is empty transparency. This full-canvas output must align over the source without moving or scaling the receiver.
Remove telephone base, ALL cord, metallic cradle-support hooks, desk, display, lights and everything else. The space under the arch of the handset is transparent. Only the portable receiver and its two attached end cups remain. No separate hooks or supports, no cutout mat, no background, no solid black/white/checkerboard pixels behind it. True transparent background required. One receiver only.

## Exact dispatch handset correction prompt

Use case: background-extraction
Image 1 is the exact clean console source. Image 2 is a previous attempted transparent receiver cutout that is NOT aligned precisely enough.
Create a corrected transparent cutout from Image 1. Use Image 1 as the sole authority for the handset's exact pixels, size, angle, position and silhouette. Do NOT use the size or shape of Image 2.
Output the same full 16:9 canvas as Image 1, with all background pixels removed to true alpha transparency. Retain ONLY the giant oxblood receiver at its exact source coordinates at the bottom-right. Do not shift it left, stretch, enlarge, straighten or recenter it. Treat this as a precision alpha-mask extraction from Image 1, not an illustration of a similar receiver. Its left black cup must stay where it sits in Image 1, its red arch must retain Image 1's curvature and thickness, and its right cup must exactly match Image 1's tilt and position.
Preserve the original graphic gouache/woodcut marks, dark red coloring and scratches of that existing receiver. Remove the entire phone base, curled cable, both pale metallic cradle posts, desk and everything else. The gap below the receiver arch is transparent, including the locations previously occupied by the cradle posts. The receiver's formerly occluded surface may be filled only inside its exact contour, with the same existing style.
One handset only on genuinely transparent full canvas. No labels, no external shadow, no background pixels, no added objects.
