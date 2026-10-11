# Lobby: the wage-claim hall

10 October 2026. Visual brief and recommended first calibration slice. Room layout is accepted; this document does not claim a rebuilt lobby has shipped. Technical companion: [Webview rendering and assets](WEBVIEW_RENDERING_AND_ASSETS.md).

## What the room says

The factory counts everything. A worker still has to sit down and prove what it owes them.

Owner direction: robot workers receive pay and need money; their economic circumstances can influence feelings and outcomes. Lobby desks are autonomous worker workspaces for filing hours/pay claims. They are among the objects the player can modify in this support room. This is not a seventh supervisor-managed production room or a compulsory per-claim player minigame.

The original art already contains the right vocabulary: small worn desks under vast paperwork boards, CRTs, desk lamps, stools, clipped forms, overhead number panels, oppressive brass pipework, a luminous doorway and the Loopforge floor emblem. The current study has a generic counter, charging docks and a typed floor stencil; these are scale placeholders, not a faithful lobby reconstruction. The pay function is new owner direction, not a feature inferred to be implemented in the old art or code.

## Source and visual anchors

Original: old Loopforge repository, `frontend/loopforge-webview/public/assets/concept_art/rooms/01_loopforge_factory_rooms_lobby.png`. A selected source copy already exists at `apps/lab/assets/sources/loopforge-focused/lobby-room.png`, with optimized runtime variants in the immutable `loopforge-focused` pack. The Webview chapter uses that existing artwork.

- Soot-black iron, dirty olive enamel, aged brass, yellowed paper; restrained phosphor green. Keep bright cyan for meaningful electronics, not a universal trim.
- Fine engraved/inked texture and uneven wear; weight at joints and feet. Avoid uniformly noisy surfaces, exaggerated cartoon bevels and mirror-shiny metal.
- Small pools of dirty gold task light, cooler recesses and a few legible silhouettes. Detail density gathers around work; the central route remains readable.
- The floor emblem, wall forms and pipe-framed threshold are the three identifying anchors. Exact wording and numbers are separately authored text, not unreliable generated lettering or invented live statistics.

## Composition within the approved hall

The Lobby stays 72 × 48 m, with a 15 m structural height. Preserve the current Lobby → Dispatch doorway and sealed northern connection. The painting is a close working corner, not a measured blueprint of the entire hall. Reproduce that corner at worker scale, then extend its architectural grammar around the perimeter. Do not stretch one desk, poster or floor texture across the hall to fill it.

Use the existing 23 × 23 m local working frame near Dispatch for the first calibration. Put two or three desk bays along a readable rear wall and a short inward-facing row, with the emblem in the arrival sightline and a clear route to Dispatch. Treat exact prop positions as candidates to check against door and queue clearance. Keep the centre legible; peripheral filing bays, dark service recesses and repeated structural modules make the full hall feel occupied without overwhelming the opening camera.

Keep desks approximately 1.8–2.2 m wide, 0.8–1.1 m deep and 0.9–1.1 m high as initial modeling targets for the existing 1.9 m robots. Check seated hand/foot contact and camera readability before finalizing them. Furniture remains human/robot scale beneath the common roof datum.

## What gets built

| Element | Treatment | Why |
| --- | --- | --- |
| Walls, pilasters, door arch, large trunk pipes | Simple beveled 3D modules with authored materials | Define the hall, silhouette, occlusion and parallax |
| Forms, scratches, grime, small fixed wiring | Atlased wall surfaces/decals; shallow normal relief where useful | Carry the concept's visual density efficiently |
| Prominent pipe crossing a lamp beam | Actual tube geometry and a restrained shadow caster | Its depth and shadow must agree when the light moves |
| Pay-claim desk | Reusable modeled chassis, drawers, inset screen and removable attachments | Modifiable object with its own identity, footprint and worker contacts |
| Stool, lamp, terminal, stamp/printer mechanism | Shared 3D kit; articulate only parts that need movement | Worker contact and localized motion sell operation |
| Papers | Painted stack body; one or two separate sheets for handling | Avoid simulating every sheet or drawing flat paperwork on the viewport |
| Floor emblem and safety lines | Authored floor texture/decal with correct perspective and wear | Preserve the actual identity artwork |
| Number boards and terminal display | Textured housing plus small dynamic display surfaces | Real values stay truthful and legible; update on change |
| Worker and queue | Real worker entities and reusable poses/animation | Behaviour can communicate delay, fatigue and resentment |

A shallow normal map can make a rivet catch light; it cannot give a large pipe a convincing silhouette or hide a robot behind it. The material must not contain a strong baked highlight/shadow that fights the live lamp. Use authored maps or offline geometric bakes, not automatic brightness-to-depth conversion of the complete concept painting.

## Desk kit and state vocabulary

The first reusable desk kit needs an idle/writing pose, paper intake/output, one screen, one lamp and an optional stamp or feed mechanism. Use sockets for seat, hands, paper path, lamp and queue entrance. The player modifies equipment/capacity through the relevant management/build interface; workers use the desk without individual player clicks.

Proposed visible states: vacant; worker preparing/filing; waiting for a response; accepted; returned for correction; unavailable. A returned claim may send a worker back with the same paper, while a long queue gives the room a different emotional tone. These are visual options, not approved rules that claim rejection or automatic stress changes already exist.

Candidate attachments: larger writing surface, additional terminal, paper feeder, better task lamp or an assisted verification module. Their aesthetic and mounting points can be designed now; price, capacity, accuracy and policy implications remain open. Additions must physically alter the desk. Keep modification distinct from repair, which remains engineer-gated in the established progression.

## Movement, light and sound

Concentrate motion around purposeful actions: a hand writes, a form advances, a stamp falls, a stool shifts and a worker leaves or returns. Subtle screen scan and occasional steam sustain atmosphere between actions. Do not make every pipe breathe or every lamp flicker at once.

Use warm task pools over paper and cooler, quieter upper services. Bake the steady room atmosphere; render nearby worker contact and meaningful light changes live. Foreground clutter and wall forms must remain readable at the normal work camera. Source, obstacle and receiver share actual space.

Proposed SFX are dry paper feed, heavy stamp, stool scrape, subdued terminal relay and the distant conveyor through Dispatch. Pay confirmation should sound distinct from simple form submission. These sounds need selection/production and user-activated playback; none is claimed delivered here.

## The future economy connection

Keep actual worked hours, hours claimed, approved entitlement and money paid separate. Cash belongs to individual worker records as well as factory accounting; do not conflate a claim acknowledgment with a transfer. Payer, wage formula, timing, disputes, deductions, consumption and the exact effect on feelings are still design questions.

When implemented, the engine owns task assignment, queue slots, claims and settlement; the renderer consumes their public projection. Visual loading or a finished animation cannot affect pay. A calibration scene may demonstrate poses with clearly staged events, but cannot pretend to implement an economy. This preserves the foundation for truthful feedback and imperfect interpretation later.

## Execution sequence and acceptance

1. Capture the original and current lobby from comparable working angles. Confirm the three identifying anchors and desk/robot scale.
2. Produce a wall/material sheet and one desk kit with clean texture maps, pivots and attachments. Use original-art-conditioned generation for painted surfaces when useful, then correct/author production textures. A generated perspective painting is not a ready-to-use material set or 3D model.
3. Implement one working bay in the actual Babylon factory, sharing its navigation, room bounds and lighting convention. Keep modifications separate from permanent architecture.
4. Compare a still frame, slow orbit, close desk view, staged worker interaction and light sweep. Check seams, flat-looking large details, paper legibility, floating feet and stale shadows after swapping an attachment.
5. Measure the renderer with 10 and 100 workers; inspect phone working views and room transitions. Extend the kit only when the result resembles the source without relying on one flattering screenshot.

No user-supplied new art is required to begin. New wall/material and desk production assets still need to be authored. This pass records that work; it does not substitute documentation for its visual acceptance.
