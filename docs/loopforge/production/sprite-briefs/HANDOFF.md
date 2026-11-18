# Day 1 — 2D sprite production handoff

## Approved factory placement · revision 3

Build the room polygons, wall runs and portal spans from `scene-bindings.json`. Use the measured footprint under each asset brief for placement and scale. The entrance opens onto the Lobby, and Dispatch feeds the enclosed inspection pen. The boom and Forge staff doorway face each other across a 4.25 m cleared apron. For the fourth check, LIMEN keeps max at the ID desk. STILETTO crosses from the Forge and stops just beyond the boom. mae, kit, lou and ben hurry to their stations as each card is stamped. The north row runs Weaving, Brewery, Cortex. Theatre receives the Forge outfeed on the east and discharges south to Logistics. All four future workroom doors stay locked during the intro.

The layout inspector groups Security equipment into three room objects. Its S1 groups the rails (build markers S1 and S2), S2 groups the desks (S3 and S5), and S3 locates the boom (S6). Use the build-marker IDs in `scene-bindings.json` when assembling the individual sprites.

The pack includes the measured SVG, editable geometry and the same route score used by the rehearsal. The older Sim4 and compact 3D scene coordinates are historical reference frames.

Revision day-one-2d-r3 · 18 November 2026

The owner approved the floor design and selected a sprite-based first implementation. This pack commissions the assets needed to replace the 2D flow sketch with a controllable, replayable prototype. The approved floor, cast identities, dialogue and staging are the source. The sprite projection, resolutions, frame counts and file contract below are proposed production defaults for ENGINE and the artists to implement together. They are not claims that sprite artwork, importers or the live game already exist.

This direction supersedes the earlier 3D-first recommendation **for this first prototype**. The existing Model briefs tab remains the character-construction and 3D source archive. Do not commission new meshes, rigs or paid model generations for this pack. Artists may render existing approved models offline and paint over them, provided every result passes the same sprite and contact checks.

## 1. What this pack must make playable

Ten workers arrive through the south entrance, Lobby and Dispatch. Security performs the injury, card theft, unequal passage and volunteer count. The conveyor makes three persistent cortexes: bob alone, bob with sam, then the full crew. The bell starts departure; STILETTO briefly catches the moving workers, receives four overlapping replies, and dismisses their backs. ed counts eight line workers, is ignored, pockets his pen beside bob’s card, and joins the final yard exchange. Factory lights go out.

The eight line workers are **bob, sam, jo, max, mae, kit, lou and ben**. **ed and gus** staff Security. **LIMEN and STILETTO** are the two supervisors. Supervisor display names always use CAPS; worker names use lower case. Stable technical IDs may use lower case for filenames.

The whole factory outline remains available in the overview. The five inactive zones require shell art and locked thresholds, not five more fully operating rooms. CATHEXIS, THRUM, RIVET WITCH, new vehicles, general construction gameplay, future accidents and all later supervisor-room combinations are outside this first asset order.

ENGINE’s minimum interactive slice is a proposed implementation target: start/pause/resume/restart the scene; select an actor or station; request the four tutorial actions and the palm unjam when their preconditions are met; run the same sequence automatically for review. Existing scripted story results remain the reference. This pack does not silently add alternate outcomes or a new player character. Input timing may extend a task wait, but must not insert automatic empty gaps into the approved ending.

## 2. Visual and camera contract

**Fixed north-up ground plan, with cutaway sprite art.** Preserve the sketch’s x-east/y-south ground projection. The ground has no isometric diamond transform or perspective vanishing point. Draw bodies and tall machinery from one consistent elevated south-facing art camera so their fronts, heads and contact surfaces are readable. Height projects upward from a ground anchor; it never changes the authoritative ground coordinate. No free camera rotation is required. Eight character facings serve navigation and acting; the camera changes framing and zoom only.

Use industrial painted shapes, worn enamel and broad controlled values. This is not an instruction to invent a pixel-art redesign. Workers remain a blue family with their approved individual silhouettes. LIMEN retains pale steel/deep teal/cyan; STILETTO black chrome/red shoulders/T visor. The latest palette approvals outrank old concept sheets with outdated accents. Security’s #A7B2D3 and Lobby/Conveyor’s #666860 are starting palette references, not a guarantee of rendered contrast. Inspect against occupied scenes.

| Item | Proposed source convention | Why |
| --- | --- | --- |
| Ground scale | 64 source pixels per world metre; 4 m floor tile = 256 × 256 px | One measured scale across fixtures; modular floor avoids an enormous atlas |
| Character canvas | 256 × 256 transparent canvas; neutral ground pivot (128, 208) | Stable pivot leaves head/tool clearance; trim only during atlas packing |
| Body calibration | A neutral 1.8 m worker reference is about 115 px head-to-foot; preserve individual proportions | The 1.8 m calibration is a production proposal, not a newly approved height for every worker |
| Supervisors | Begin LIMEN at 1.25× and STILETTO at 1.20× neutral worker height, then validate names-hidden recognition | These relative sizes are proposals; do not promote old slider defaults to owner approval |
| Large gestures | 384 × 384 or 512 × 512 source canvas with explicit pivot, only when necessary | Blades, falls and paired actions must not clip; larger canvas is not larger world scale |
| Facings | N, NE, E, SE, S, SW, W, NW; facing means the direction the actor looks/moves on the plan | Eight authored views; no arbitrary sprite rotation in lieu of directional art |
| Static machines | Ground footprint stays exact; elevated silhouette may extend above it | Collision and actor sorting must not be inferred from transparent image bounds |
| Camera delivery | Overview, Security contact, Forge line and yard framing profiles | Use close framing for card/palm contacts; keep all four replies above the floor |
| Proof sizes | 1280 × 720 room shot, 390 × 844 phone, plus 320 px narrow layout | Record actual displayed actor height; inspect at gameplay size, not only zoomed art |

Before producing all directions, finish a small calibration sheet: bob, sam, LIMEN, STILETTO, one credential, rail, Intake corner and press handle, shown on both room floors. Prove neutral, walking and one contact pose with the intended camera. This is a first production milestone, not a request to reconsider the approved level.

## 3. Animation contract

All 12 characters require the seven common clip families in the catalogue. The per-character list adds story-specific actions. Frame counts are a quoteable starting minimum; artists may add in-betweens where a contact is otherwise unclear. Supply a coverage CSV with every **asset × clip × facing** delivered. Do not claim one generic worker sheet covers all ten bodies. Shared animation timing is allowed; shared indistinguishable bodies are not.

Common loops default to 12 fps at authoring time. Sharp contact clips can use 16–20 fps. The manifest records individual frame durations in milliseconds. ENGINE samples elapsed action time and can hold, seek, blend or interrupt at declared boundaries. An animation’s export length does not own story time. The injury, output, clearance and prop transfer happen on authoritative action events; frame markers trigger cosmetic sound/FX only.

Common idle/walk/hurry/talk/listen use all eight facings. Start-stop includes a start and stop for each facing and a held planted-foot pose. Turn coverage includes **16 adjacent transitions** (clockwise and counterclockwise from each facing). Bespoke directions are listed individually. If staging changes to an uncommissioned direction, ENGINE uses a declared existing facing or requests that export; it must not silently mirror the injured leg, pocket, pipe or blade arrangement.

Every clip declares entry pose, action phases, contact marker, safe hold, exit pose, loop range, interruption rules and the next compatible clip. A contact action must be interruptible before ownership changes, or finish/resolve its committed phase before cancellation. Supplied socket tracks include every frame, including held poses. Root motion is visual only: ENGINE owns paths and ground position. Footplant/stride metadata lets it match gait cadence to path speed.

For dialogue during locomotion, supply torso/head/arm overlays compatible with the lower-body walk/hurry. Fully flattened sequences are also allowed for brief complex contacts. Do not use broad cross-fades between a card in one hand and a card somewhere else; prop state has one owner and changes exactly once.

### Preserve the approved ending

| Beat | Implementation and art obligation |
| --- | --- |
| Bell | At score.bell, show BELL / RIIIIING! and ring the physical bell. mae cuts feed, kit stops drive, six others begin leaving |
| Moving crowd | All eight line workers are on their way before the shout; each retains its own path/spacing |
| Catch | STILETTO shouts after approximately three seconds; each worker brakes into a mid-step hold for about 1.1 s |
| Replies | Resume walking as the four replies begin. jo, max, lou and sam coexist in the top rail; lou’s aside remains directed to ben |
| Dismissal | “ALRIGHT, SHIFT’S OVER. FUCK OFF.” is delivered into their backs, not to a re-formed lineup |
| Clearance | Preserve the approved 2.4× exit acceleration and individual eight checkouts; match the hurry animation to feet instead of merely speeding a walk sheet |
| Closing exchanges | No long waits for a character to cross an empty map. Use the approved travel cuts; keep the under-one-second gaps between dismissal, ed’s count and the yard exchange |
| Blackout | ed laughs first; factory lamps and windows go out behind the crew. Do not blank the dialogue layer |

The current edited rehearsal is about 3:25 total, with roughly 26 seconds from bell to blackout. These are regression references, not fresh balance targets. The bundled sequence module is the exact timing authority. It carries world time and edited time separately: ENGINE must preserve the cuts or the physical long walk will reopen the gaps that were removed.

## 4. Contacts, layering and object ownership

| Assembly | Artist supplies | ENGINE supplies |
| --- | --- | --- |
| Character | Ground pivot, body bounds, footplants, per-frame hand/look/tool/pocket sockets, emission and shadow masks | Entity ID, ground path, facing, action phase, appearance/injury state |
| Pair | Two independent sprite sets, matching support/grip targets, actor-relative offset, contact/hold/release phases | Atomic reservation of both actors, legal approach, paired progress, cancellation and final state |
| Prop | Canonical pivot, grip/rest sockets, state variants, occlusion slices | One logical identity, one owner, hand/desk/floor/rack attachment and transfer tick |
| Machine | Static and moving parts, operator-side contacts, handle/valve/seat sockets, front/back slices | Fixture footprint, slot occupancy, process state, power, permission, result |
| Effect | Mask/frames, origin and bounded lifetime | Confirmed cue and cosmetic suppression; no gameplay consequences from particle completion |
| UI | Scalable skins, icons, focus/disabled states and layout tokens | Text, commands, accessible names, localization, selection, public facts and input validation |

Draw order is ground → ground decals/shadows → rear fixture slices → depth-sorted actors/props/front fixture slices → overhead masks/effects → interface. For the depth-sorted group, use the **ground contact y**, then a stable entity-ID tie-break; never sprite top edge. Long machines and rails need multiple occlusion segments where an actor can stand both in front and behind. A single giant foreground rectangle will hide the story.

Required paired/contact proofs:

- LIMEN blade → bob leg → fall; then sam support → bob’s supported rise. The impacted leg and support side remain consistent across facing changes.
- bob card → floor/skid → ed boot → ed pocket. bob does not get it back on clearance or restart into a later scene.
- bob’s hands → loader lever; pelvis → motor housing; hand → rail during stand. Machine art must accommodate the seated pose.
- sam/mae hands → tray grips; carrier → station dock; brain → cradle. Carrying, placing and pushing are different actions.
- bob/jo → clamp and start paddle; bob/max → press control; bob palm → jammed door; kit fingers → drive housing.
- LIMEN → card/photo/register/stamp/gate post; ed → book/pen; gus → second-desk cards.
- STILETTO blades → threat targets without unintended body contact; max’s duck clears blade; STILETTO steps over bob’s extended leg.

Art collision annotations are **reference polygons**, not permission to change navigation. ENGINE imports the approved fixture/portal geometry as authority. Reconcile visible silhouette and the footprint before acceptance; never shrink an obstructing object invisibly to make a failed route pass.

## 5. Delivery folder and manifest

Deliver a layered editable master for every unique asset, clean transparent PNG frames, a contact sheet, a short review animation, coverage CSV, and one JSON descriptor. Sources may be PSD, Aseprite, Krita or Blender plus render setup; use a format the assigned artist can reopen. Include software version, font/license records and the approved reference link. Keep source masters and review videos outside the runtime package.

Use stable lowercase IDs and paths: `characters/bob/walk/NE/000.png`, `machines/forge/door/jammed/000.png`, `effects/wash/dirty/000.png`. Do not bake dialogue or numbers into sprites. Provide full untrimmed canvases plus packed atlas output. Hash runtime files; revision the manifest when content changes.

PNG contract: RGBA, straight alpha, sRGB colour, no matte/fringe, no baked shadow, consistent untrimmed dimensions/pivot per clip. Atlas pages maximum 2048 × 2048, no rotated packing, 2 px edge extrusion and 2 px outer spacing. Trim is allowed only with source rectangle and pivot reconstruction preserved. Runtime lossless WebP is optional after ENGINE verifies its decoder; PNG is the interchange requirement. Filtering and mip behavior must be tested on the actual renderer; the art pack does not force an engine migration.

The download includes `manifest.template.json`. It is deliberately marked **template** with no invented atlas filename or checksum. Every asset in `briefs.json` is a required commission record, not a delivered runtime file. ENGINE rejects a delivery with missing clips/facings, unresolved dependencies, duplicate IDs, nonfinite pivots/sockets, absent hashes or mismatched image dimensions. After ingestion, output a separate accepted runtime manifest recording actual bytes, atlas pages and asset versions.

Per-sprite runtime descriptor needs: `assetId`, revision, file/hash/dimensions, sourceSize, trimRect, pivotPx, groundFootprintMetres, sortAnchorPx, layer, appearance states, sockets and dependencies. Per-clip needs: ID, facing, frames and durationMs, loop range, event markers, entry/hold/exit frames, compatible transitions and interruption policy. Each marker says cosmetic-only. The action ID and simulation result are supplied separately by ENGINE.

For sound: 48 kHz/24-bit WAV source, separate mono positional one-shots and stereo ambience, cue names and loop/tail boundaries. ENGINE chooses compressed delivery after testing target browsers. No soundtrack is required to complete this slice; existing original music may be reused only with its provenance retained. Dialogue remains fully functional without voiceover.

## 6. Scene manifest and assembly order

`scene-bindings.json` is a generated snapshot of the approved geometry and build markers, with an asset ID for every S1–S11, C1–C5, H1–H9 and E1–E2 marker, every actor, every fixture and each portal. The source geometry, sequence and build-marker modules are included under `reference/` in the ZIP. This is a binding proposal; it is not an importable saved game. Portal state and action reservations belong to ENGINE.

| Build stage | What to assemble | Gate before continuing |
| --- | --- | --- |
| A · calibration | Four lead silhouettes, floor swatches, rail/credential/handle contact test; use placeholders for all remaining assets | Same projection/scale, names-hidden identity, ground pivots and one hand contact survive room view |
| B · Security slice | Ten workers + LIMEN/STILETTO, rails, desks, boom, card custody, paired injury/help, morning four replies | No duplicates/teleports; complete common locomotion and gate/prop state contract |
| C · conveyor slice | Five machines, carrier/product state chain, bob tutorial, sam pairing, jam and complete crew | Three persistent outputs, continuous shot, all contact ownership and machine states correct |
| D · complete shift | Yard/entrance and hall dressing, all exit overlays, bell, fast departures, count, laugh and blackout | Approved pacing preserved; 8 checked-out line workers, ed/gus separate; no long dialogue gaps |
| E · delivery pass | UI skins, sound/effects, accessibility, atlas streaming and diagnostics | Full replay and user-controlled run pass desktop/phone and seek/restart tests |

P0 identifies the first contact/locomotion and conveyor dependencies. P1 remains required for the finished Day 1 prototype; it is not permission to omit the supporting cast, ending or world context. All 53 catalogue entries need an assigned owner and a status. Suggested statuses: briefed → source ready → exported → integrated → accepted. Existing concept approval is not sprite acceptance.

## 7. Acceptance and runtime budgets

Review the full game-scale scene, not just isolated GIFs. Put the three largest bodies and the two supervisors in a crowded Security shot; hide names. Locate both supervisors and distinguish sam/gus/ben by shape. Make bob’s eyes, max’s jaw and lou’s neck survive the room camera. Repeat against the Forge floor. If a contact cannot be read, adjust framing or simplify the art; do not solve it by adding a paragraph of UI.

ENGINE’s regression checklist:

- Every approved speaking/action beat has an animation or intentional held pose and an identified asset owner. All 46 dialogue entries survive import verbatim.
- Three products keep entity identity through the line; bob’s card stays with ed; gate operation, machine contacts and the eight-worker exit count remain deterministic. The exit count is eight, regardless of UI language.
- Play, pause, resume, restart, jump to every chapter and seek across each contact. No duplicated props, sounds, strikes, outputs or stale held poses. The same seed/input transcript produces the same logical result at 30/60 fps.
- Eight line workers freeze only momentarily, answer while moving, and clear quickly. Rendering, voice duration or animation length cannot add hidden waits to the ending.
- Four reply cards coexist without obscuring the floor, including at 320 px width and increased text size. Keyboard focus and touch controls remain reachable. All required information survives muted sound and reduced motion.
- Missing or loading art uses a named silhouette and explicit retry state; it cannot block legal simulation updates or fabricate success. P0 export failure is a visible commissioning gap.
- Confirm rights/provenance and no missing font or source dependencies. Import all runtime assets using content hashes; retain the source version that produced them.

Proposed budget: 30 fps baseline on an ordinary phone; 60 fps desktop target. Initial scene art ≤4 MiB compressed, active resident sprite textures ≤128 MiB, transient peak ≤192 MiB; measure after the calibration slice. A 2048² RGBA atlas is 16 MiB decoded before mipmaps, whatever its download size. Stream scene-specific acting banks (Security, Forge, exit), share common locomotion, and release unused banks only at safe transitions. Count the real pages and loading peak before authorizing bulk exports; if the calibration exceeds budget, reduce duplicate frames and trim/pack or lower source resolution while preserving contacts. These are production targets, not measured current performance.

Do not preload every source sheet or all future room art. Pause presentation work when hidden; simulation/replay authority follows the game’s explicit pause policy. Reduced motion removes camera shake, flashes and unnecessary particles but retains key poses, reaction, ownership and output. Sound is independently muted and starts only after user activation.

## 8. Artist quote and delivery checklist

Quote per catalogue asset and animation/facing matrix, separating reusable modules from unique performances. Include one calibration revision and one in-scene contact correction pass. Deliver the first P0 calibration before authoring hundreds of frames against an untested camera. For each delivery, supply a manifest, reference links, a list of deviations and the clips still missing. Do not label the pack complete because its thumbnails look consistent.

The new tab and downloads are the production handoff. Artist assignment, finished sprite sheets, implementation of the importer/renderer, recorded device performance and final integrated acceptance are subsequent production work.
