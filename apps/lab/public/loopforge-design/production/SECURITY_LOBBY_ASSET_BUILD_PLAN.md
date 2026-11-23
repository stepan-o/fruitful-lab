# Before the factory lets you in

21 October 2026 · approved visual plan for Lobby and Security · opening scene v1

The entrance ought to make bob look small without making him hard to find. A great brass Loopforge sign hangs above the doors. Beyond it, clerks have covered the walls with numbers, assignments and notices. The workers have barely taken in the place when LIMEN stops them. Security gives his refusal a physical form: a reader, a desk, a gate and a wall showing which doors he can keep shut.

This proposal extends the approved Conveyor kit within the cumulative 1,000-credit Meshy ceiling. It does not certify assets as generated, fitted or performant. The current scene and click-through tutorial remain in production.

## What the original art establishes

References live in the old Loopforge repository under `frontend/loopforge-webview/public/assets/concept_art/`.

| Reference | Keep for the room build |
| --- | --- |
| `world/loopforge_factory_entrance_1.png`, `_2.png`, `_3.png` | Monumental brass-and-iron sign, lightbulb crest, heavy paired doors, pipes framing the entrance, wet approach and a much larger industrial world behind it. Version 2 offers a particularly clear entrance silhouette. |
| `rooms/01_loopforge_factory_rooms_lobby.png` | Numbered assignment wall, pinned papers, working desks under lamps, brass floor emblem and a tall inset doorway. Lobby has the ceremony of an institution that is already worn out. |
| `rooms/03_loopforge_rooms_access_control_1.png` through `_3.png` | Deep door reveals, controlled lanes, reader panels, floor-edge lamps, wire partitions and service access. The first two provide spatial references; the third gives the clearest unoccupied threshold composition. |
| `characters/security_operations/limen_security.png`; also room image `_5.png` | Documents presented at chest height, thick reader pedestals, chained tags, a helper pointing at a worker. Clearance is labour performed by several workers under LIMEN. |
| `rooms/03_loopforge_rooms_access_control_6.png` and `_7.png` | Door-status array, chained permits, oversized console, explicit refusal and the physical gesture of pointing at a rule. |
| `characters/security_operations/limen_security_lockdown.png`; room images `_8.png`, `_9.png` | A heavy override lever changes the condition of the room. Red is an exceptional alarm state, not its everyday lighting. |
| `characters/security_operations/stiletto_security.png` and `characters/interactions/argue_limen_stiletto_security.png` | The very same checkpoint can become a fast passage or a confrontation. Leave room for STILETTO's blades, stride and the displaced crowd. |
| `characters/security_operations/cathexis_security.png` and `characters/interactions/argue_limen_cathexis_security.png` | Papers can become an expressive prop; the exit and Conveyor direction remain legible. |
| `characters/security_operations/rivet_witch_security.png`, `thrum_security_success.png`, `thrum_security_fiasco.png` | Repairable hardware, changes of access state, an abandoned workstation and a poorly supervised passage. These are later uses of the same room kit. |

All nine Access Control images, the Lobby image, three entrance images, seven Security operation images and both Security arguments were inspected for this proposal. Older character designs, generated lettering and depicted extra destinations do not override the approved cast, current room layout or script. Copy the material and staging vocabulary; author accurate labels and actual destinations ourselves.

## The opening composition

**Approach.** Follow the workers from behind and slightly to one side as they walk towards the lit entrance. bob's flat head and large eyes become identifiable when he turns to sam; nobody walks towards the camera while supposedly entering the factory. The sign sits above their destination. A cropped facade and distant industrial silhouettes can establish scale without a fully modelled city.

**Lobby.** Make a broad gathering space immediately inside the entrance, with a high wall of assignments and desks along its edges. Give the central floor a quieter, worn surface and an inset Loopforge emblem. Keep enough space for ten distinct bodies and their reactions, but avoid the present impression of a long empty hangar. Choose the dimensions from the cast blocking and two-room camera tests, not from the concept image alone.

**Security threshold.** From Lobby, the colder inspection light reveals LIMEN in a substantial doorway. Place ed's records desk on one side and gus's reader station on the other, behind the threshold. A strip of low lights leads towards Conveyor. Keep one clearly visible route through it all. Barriers can define the checkpoint itself; they must not pen the entire waiting crowd into a fenced enclosure.

**Action space.** Leave the floor clear for bob's strike and fall, sam's approach, and ed's card pickup. Reserve an unobstructed camera line to the fallen card. Keep loose white paperwork away from that patch until the pickup is complete. Give LIMEN a real retreat pocket when STILETTO enters. Her route uses an already open passage; a visually locked gate cannot be crossed without an unlocking action.

**Continuity.** Entrance, assignment wall and checkpoint remain stable landmarks across camera cuts. Use a strong establishing angle, a worker-level confrontation angle, the deliberate card close-up, and a lateral shot for STILETTO's passage. Changes of angle serve a change of action. Do not cut on every bubble.

## What to make in Meshy

Six distinctive asset families give these rooms most of their identity. Two are already in the approved Conveyor/room kit; four are additional proposed generations. Each request is for a usable rigid shell, with moving and readable parts completed separately.

| Asset family | Visual brief | Use and completion | Initial floor-detail target |
| --- | --- | --- | --- |
| Entrance surround and crest — new | Aged brass casting, heavy iron frame, bulb crown and restrained mechanical skull ornament, following entrance version 2. Leave a clean sign seat. | The opening landmark. Exact Loopforge lettering is authored; paired door leaves, hinges and light lens are separate. Reuse the trim language inside Lobby. | 8–12k triangles |
| Assignment-board cabinet — new | Tall numbered bays, battered paper pockets, metal clips and deep brass framing from Lobby art. No generated writing. | A repeated wall module showing assignments and notices. Numbers, papers and states are runtime graphics; one module can form the whole bank. | 3–5k per module, repeated |
| Inspection / records desk — already budgeted | Squat iron cabinet, brass edges, worn working surface, a recessed ID tray and small terminal seat. | ed's records position and Lobby clerks share the shell. Separate drawer, stamp, register, lamp and card slots. Keep worker hands and faces visible over it. | 6–10k |
| Checkpoint portal and reader housing — already budgeted | Deep riveted reveal, chunky reader pedestal and heavy gate hardware from LIMEN's checkpoint. | Separate gate leaves and simple barrier arms; independent card reader and status screen. Match passage width to the largest approved cast member plus moving blades. | 6–10k total before repeated pieces |
| Door-status / override console housing — new | Old industrial control cabinet with a large guarded lever seat and a repeated round indicator panel. | Generate the distinctive cabinet; build the exact status grid and lever mechanism ourselves. Readable states include held, cleared, sealed and override. | 4–6k |
| Surveillance wall unit — new | A projecting round inspection lens, protective metal brow and an old speaker grille on a compact wall bracket. | Repeat sparingly to make surveillance part of the architecture. Lens, indicator and mount can turn or change state; no need for a light or camera render per unit. | 1–2k per unit, repeated |

Meshy supplies the distinctive casting, wear and silhouette. Blender/engine work supplies dimensions, contact surfaces, articulation and readable state. A generation containing a desk, gate, worker and papers fused together is not a deliverable kit.

Build floor panels, railings, straight pipes, cable trays, simple gate arms and repeating wall bays as exact modular geometry. Author cards, permits, warning plates, logos and paperwork as shared graphics. Reuse the existing ID prop and preserve its custody in the scene. ed taking bob's card does not automatically put it in a new desk drawer; any later transfer must be an explicit story/world event.

## A room whose behaviour can change

The first scene needs working entry/exit gates, reader feedback, the two helper work positions and a place for records. Later supervisors reuse them:

- LIMEN holds the lane, checks the document, sends it to a helper, stamps and releases one worker. Queues and paperwork accumulate as consequences of those actions.
- STILETTO holds the passage open and prioritises throughput. The empty reader and workers passing it show what she has chosen to ignore.
- A lockdown changes actual door states, the board and warning lights together. The lever has a separate pivot and reachable hand target.
- Future repair or abandonment can be shown through an exposed service panel, an unattended desk or disabled reader. Those are supported asset states, not claims that the full future behaviour exists yet.

For every interactable, record metric bounds, collision, approach and standing spots, hand/card targets, movable pivots and state names. Couple the visible state to the engine's access and item-custody state. Screens do not invent admissions and a green light does not silently move a worker. The wall clock mirrors factory time: while the player reads, that time holds and quiet character animation continues.

## Light, colour and performance

Retain the approved Security floor base colour **#A7B2D3**. Place grime at seams and edges, with broad quiet floor areas behind actors. Use dark graphite and aged brass on the walls. Cool inspection lamps can establish Security without bathing blue workers in saturated cyan. LIMEN's cyan blade and STILETTO's red markings remain stronger signals than ambient fixtures.

Lobby uses warm practical lamps, dull brass and a lighter neutral walking surface. Brightness gathers at the entrance sign and the checkpoint threshold; it does not compete equally across every notice and pipe. Reserve red room lighting for a real alarm. No continuous paper storm, flashing monitors or heavy fog during quiet dialogue.

Put visual density on perimeter walls and large silhouettes. Bake fine bolts and wear into shared material maps; instance repeated panels and indicators. Use simple opaque screen faces, authored wetness and bounded steam rather than live reflections, many transparent layers or simulated fluids. Close-up props get higher detail only when the shot needs it. Floors, cast and the card must remain readable with effects reduced.

Start with approximately 60–90k visible environment triangles across a connected Lobby/Security shot, excluding cast and an unseen exterior. This is a working ceiling to measure, not a promise of frame rate. Test room-only and occupied views on the HD620, including draw calls, texture memory, frame-time tails, dialogue reading holds and camera changes. Near-wall hiding must preserve the player's view without altering collision or access.

## Spend and build order

The cumulative cap remains **1,000 Meshy credits**, with **480 recorded spent** and **520 remaining**. The earlier approved kit already includes the desk and checkpoint. Do not charge them twice in planning.

At the project's recent 30-credit textured-job planning rate, the four additional families would use about **120 credits**. Pricing must be checked for each actual request. The original room allocation was 150 for the approved Conveyor pilot, 360 for the remaining original kit plus these four additions, and 90 held for iteration. The pilot has now used 80, leaving 70 + 360 + 90 = 520. This reallocates reserve; it does not raise the cap. No jobs were submitted merely to prepare this visual proposal.

Build the existing procedural room blockout and camera compositions first. Fit the checkpoint and desk to bob, LIMEN, STILETTO, ed and gus. Generate the entrance landmark next, then the board, console and surveillance unit as the shots justify them. Judge the first two rooms together, with the full opening and reduced graphics, before adding decorative density.

The acceptance question is concrete: without labels or dialogue, can the player recognise an arrival hall, a controlled checkpoint, bob's predicament and the route STILETTO is forcing through? The detail must strengthen that reading.
