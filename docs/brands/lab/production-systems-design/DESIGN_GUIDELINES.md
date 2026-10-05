# Production systems profile — design guidelines

Version 2.1 · 5 October 2026 · Mechanical Turk direction

Applies to `/stepanoskin/production-systems`. **Figure 1 is complete and accepted
by the owner**, including the casework, conveyor, pace/results, palette and coherent
lighting through PR #77. It is the quality bar, not a template to copy. Preserve
it while bringing each subsequent scene to the same construction and finish
standard. Figure 2 is the first focused composition pass under this system;
Figures 3–8 remain initial studies. A shipped pass is not owner acceptance.

This revision preserves the shared system and refines Figure 2's original
cutaway with deliberate lower-body occlusion, a cropped automaton above, and
source-coupled candlelight and a synchronized move on two boards, informed by museum reconstruction evidence. It changes neither the
professional claims nor the accepted opening.

[Visual reference sheet](reference.html) · [Profile brief and implementation evidence](../production-systems-profile.md)

## 1. The character

**A finely made cabinet of instruments, opened to explain how it works.**

Learned, deliberate, tactile, quietly theatrical. The professional profile reads
like the accompanying folio: a clear name, a precise proposition, evidence and
sources, generous margins. A sequence of highlight scenes supplies curiosity and personality. Each scene
reveals one relationship that matters to its section; together they inhabit the
same coherent apparatus and workshop.

The reference is Wolfgang von Kempelen's chess-playing Mechanical Turk, first
shown in 1770. Its cabinet, chessboard, figure, doors and mechanisms made an
intellectual performance into a physical object. A concealed human player supplied
its chess intelligence. The Computer History Museum describes the source as
“a human chess player hidden inside.” [S1]

Our interpretation makes human judgment visible: specification, evaluation,
review and release decisions belong in the explanation. Historical intrigue
informs the atmosphere; technical claims remain explicit and verifiable.

Priority order: **professional credibility → readable argument → material craft
→ theatrical detail.** The reference must strengthen the first two.

## Accepted system · what carries across figures

| Shared requirement | Freedom within each scene | Review at reading size |
| --- | --- | --- |
| One coherent object and projection | Front section, oblique board, close still life or shallow panorama | Follow every supporting edge to its parent; no floating parts or intersecting solids |
| One readable focal action | Feed, consider, connect, move, inspect, release, consult, rest | The relationship reads before individual incisions; props do not compete with the action |
| Warm walnut, ivory, restrained brass, deep green | Change the relative areas and depth, not the pigment family | Green remains the page highlight; brass marks working joints; paper stays quiet |
| Outer contour → construction → fine engraving | Grain follows wood; incisions follow fabric and turned metal | Read the silhouette on a phone, then discover detail at desktop scale |
| Declared light and receiving surfaces | Broad workshop key or a visible local candle | Source, obstacle and shadow agree; bright edges face the light; contact stays attached |
| Motion with a purpose and one lifecycle | Each figure owns its tempo; stillness is a valid state | Attached parts move together; pause, offscreen, hidden-tab and reduced-motion rules hold |
| Procedural, server-rendered SVG | Bounded paths, reusable silhouettes and local CSS | No raster dependency, new client loop, large blur or ornament added to fill empty space |
| Explicit provenance and a professional reading flow | Historical anatomy can anchor an original composition | Evidence and inference are distinguished; captions connect art to the section's argument |

**Originality is mandatory.** Figure 1 is an outward, busy production engine.
Figure 2 is an inward, intimate moment of judgment. Figure 3 should be an
architectural explanation; Figure 4 a precise geometric decision; the remaining
scenes become progressively quieter. Do not transplant the hero's gear train,
conveyor, smoke, controls or lighting setup into every scene.

Construction order: block the whole silhouette and usable space; place the actor
and working surfaces; connect the mechanism; assign light and receivers; add
material detail; only then add motion. Check all three scales: whole page,
normal section width and phone. Enlarged engraving cannot rescue bad composition.

## Light and depth contract · accepted opening

Use one broad key above and in front of the machine, toward the viewer's left.
Its direction must govern the lit bevels, face shading and every cast shadow.
Do not tune shadow offsets independently to make individual parts look deeper.
The hero uses an analytic orthographic approximation, not a full physical renderer.

- **Shared space:** world height rises from the floor at SVG y=523. One depth unit
  projects (+1/√3, −1), matching the accepted belt and case returns. The incoming
  key ray is (x .06, depth .30, height −1). Project a ray from each caster onto
  its receiving plane; reject intersections behind the caster.
- **Explicit receivers:** floor, cabinet front, recessed movement wall, paper
  face and belt are distinct surfaces. Clip to the receiving face. The floor
  silhouette includes the cabinet, belt overhang and opened door. Foot contact
  shading stays at the actual soles; it does not drift with a decorative offset.
- **Softness follows distance:** seven small area-direction samples provide a
  bounded penumbra on the floor and under the overhang. Samples converge at
  contact and spread with separation. This adapts the area-light principle in
  PBRT [S15] to low-cost engraving; it is not numerical path tracing.
- **Moving occluders:** pierced gear silhouettes turn with their physical wheels
  and cast through their openings onto the back wall. Hand shadows use the same
  stamp animation and project onto the horizontal belt. No detached drop-shadow
  rings. The 47 hero animations share the existing pace/pause controller.
- **Material response:** favor narrow, stationary light-facing bevel arcs, warm
  walnut faces and a cooler, darker right return. Engraved marks turn with the
  material; the directional key does not turn with a wheel. Avoid broad glossy
  washes, large blur filters, bright halos or lost gear detail.
- **Delivery:** all geometry is computed on the server. No new client boundary,
  per-frame JavaScript, raster texture, canvas, WebGL or filter. Preserve still,
  reduced-motion, offscreen and print behavior. Verify mobile scale and measure
  production payload and animation cost before publication.

Later scenes inherit this reasoning and material restraint. Their light position
may change when a visible candle motivates it, but every source–caster–receiver
relationship within a scene must agree. Figure 2 uses its own candle source; the opening remains unchanged. Subsequent
scenes need the same source–caster–receiver reasoning within their own viewpoint.

## 2. The visual anchors

Historical plates are evidence of how the object was represented. Racknitz's
interior plates are an explanatory reconstruction, not an authenticated working
drawing of Kempelen's original mechanism. Scan tint is not evidence of original
material color. [S1–S4]

| Anchor and reference | What to study | Translation for this page |
| --- | --- | --- |
| Windisch exterior engraving, 1783 [S2] | Broad cabinet, projecting top, framed openings, drawers, modest feet; a tall focal figure over a horizontal base | Give the hero apparatus a grounded base and a clear silhouette. Use frames with construction logic, visible edges and joints. |
| Open cabinet in the same plate [S2] | Different depths revealed by doors and a pulled-out drawer; dense mechanism beside a quiet compartment | Let an illustration reveal one meaningful inner relationship. Use recessed regions to distinguish mechanism from explanation. |
| Racknitz interior plate III, 1789 [S3] | The relationship between the visible performance and the person/mechanism beneath | Keep source, inference and human decision identifiable. Future interactive inspection should expose useful evidence, not just move ornament. |
| Mechanism detail reproduced by Deutsches Museum [S4] | Fine parallel hatching, darker recesses, pale mechanical edges, rods and linkages with attachment points | Build depth through contours, occlusion and selective hatching. Every shaft, belt or lever has a credible connection. |
| Chessboard and perspective floor in the historical plates [S2–S3] | Exact repeated units; a stable plane on which choices occur | Use alignment and measured subdivisions in comparisons. A small checker or inlay motif can belong to an object; leave reading backgrounds quiet. |
| Engraved captions and plate lettering [S2–S3] | Formal serif labeling, small reference letters, restrained italic annotation | Keep Georgia headings; introduce short italic figure captions and modest plate numbers. Essential explanations remain readable HTML. |

The seated figure, turban, robe and pipe identify the historical object in the
reference plates. The owner's chosen scene language also includes the human
operator inside the cabinet. Draw that person as a capable, attentive practitioner;
the gesture, working posture, light and connection to the mechanism tell the
story. Stepan's professional identity stays in the real name and factual prose.
The illustrations can be expressive without becoming a fictional résumé.

## 3. A highlight scene for every section

Confirmed owner direction: use the conveyor machine, the geometry of a chessboard,
and a person operating the Turk from inside the cabinet by candlelight as central
scenes. Extend that world across the page. These are original editorial scenes
about contemporary data-science work, not literal depictions of Prodigy's systems
or claims about the exact historical construction.

The sequence moves from the whole apparatus to the operator, its layers, its
choices, its tests, its release process and its evidence. Keep the same cabinet
joinery, material family, mechanisms and lighting logic across viewpoints.

| Section | Scene and focal action | What it explains | Composition and intensity |
| --- | --- | --- | --- |
| Opening / identity | **The Turk’s experiment conveyor.** A recognizable automaton sits behind the cabinet and stamps briskly; paired A/B specimens move continuously and emerge as uncertain effects. The paper register advances with each test and its verdict exhales as smoke. | Repeated item-level experiments form one learning system guided by human judgment. | One figure over one broad case, one shared work surface, one connected drive. 680×550 master; no detached gauges or floating process symbols. |
| Background / experience | **The operator by candlelight.** A cutaway reveals a person seated inside the cabinet, studying the position and guiding the mechanism. One hand works a linkage or control; the other attends to the decision. | Human judgment is part of production infrastructure. | The most intimate scene. A small warm pool of light on face, hands and working surface; credible seated anatomy and usable space; deep local recess, paper caption. |
| Capabilities / whole stack | **The opened cabinet.** A three-quarter sectional view connects the board above, the transmission beneath and the operating position. | Interfaces, measurement, data and services must work together. | Architectural plate with coherent supports and attachment points; two or three clearly separated depths; no cloud architecture labels painted onto furniture. |
| Applications / catalog decisions | **The chessboard.** A close, oblique view makes individual squares and the whole position visible. One considered move connects the foreground unit to the wider arrangement. | Local decisions must be evaluated against global objectives and constraints. | A precise geometric scene: convincing perspective, one focal piece or hand, long quiet diagonals. Explanation must work for readers who do not know chess. |
| Method / trustworthy evidence | **The inspection bench.** A focused lamp and comparator examine two candidate pieces beside a reference. | Baselines, careful observation and uncertainty precede a decision. | A closer, calmer vignette. Honest measuring geometry, a visible reference and room for the eye to rest. No fabricated performance readings. |
| Production perspective | **The release bench.** Candidate trays, a review station and an outgoing drawer make the transition from created work to approved release tangible. | Generation is one stage; validation, versioning and delivery complete the process. | A lateral workshop view, distinct from the opening conveyor. Three meaningful states, one focal release action, minimal ornamental tooling. |
| References / evidence | **The open folio.** Source pages and annotated plates rest beside a measuring tool; an index tab connects the illustration to the real source list. | Claims have a traceable basis and an inspectable record. | A light still life and a quiet caption. Real citations stay in readable HTML, not fictional text in the artwork. |
| Contact / closing | **The worktable at rest.** An open cabinet, a place to sit and a carefully set-down instrument leave the work ready to continue. | An invitation to collaborate on a real system. | A small closing vignette or shallow panorama, lower in contrast and detail. It must support the LinkedIn action, not compete with it. |

### Figure 2 · the operator by candlelight

**Composition:** an original side cutaway, with the person in the right-hand
working bay and the small board extending toward the left. The head, hand and
control form the focal triangle. The lower body is deliberately concealed by a
retained front wall with a stepped cut edge, visible wood thickness and finished
joinery. Do not reintroduce schematic legs. The private board remains a separate
working surface above the cut edge; the visible cushion supports the coat.
Shallow display gears stay at the left margin. A cropped lower green robe, seat
and output pedestal above the case hint at the larger automaton outside the plate.
The robe is supported by the seat; it does not grow from the tabletop.

**Research distinction:** HNF documents a pantograph, magnetic indicators and an
internal board in its reconstruction [S16–S17]. It explicitly identifies scale
and seating-direction errors in Racknitz [S17]. Retain Racknitz's engraved
character as an artistic source, not a layout authority. HNF also notes the lack
of complete original construction plans [S16]. This drawing makes no restoration
claim. The camera, sectioned wall, casework, simplified controls and candle
are our composition; the museum replica uses an electric headlamp [S17]. Both
figure studies retain their existing Racknitz attribution.

**Working relationship:** show a human decision travelling through an attached
mechanism. The operator's raised hand pulls a pivoted input lever; a telescoping
link, roof transmission and driven arbor connect toward the automaton's arm.
His board hand and the Turk's articulated sleeve/pinching hand repeat the same
move. Both 8×8 boards have a light h1 corner, matching file/rank orientation,
turned ivory/dark pieces, board-bound shadows and one sparse legal position:
White king a1 and pawn e2, Black king h8 and pawn c7. The unobstructed initial
pawn advance e2–e4 follows FIDE article 3.7.2 [S18]. Coordinates come from each
board's projection; do not move pieces by arbitrary screen offsets.

The 12-second demonstration has distinct approach/grip, lift, travel, placement,
release and withdrawal phases, then a quiet hold. The pawn dissolves for the
loop reset; it never visibly makes an illegal backwards move. Both boards,
hands, input lever and output arm use the same phase model. Overhead indicators
respond to occupied squares as the main pawn leaves and lands. The Turk's two
arm segments retain fixed lengths and meet at a computed elbow; the operator's
source forearm receives a small projected rotation/foreshortening. Keep the
face and candle clear. The simplified machinery is an original interpretation,
not a measured replica of HNF's pantograph.

**Material and light:** the walnut frame, sectioned wall and recessed right return
inherit the accepted opening's finish. The cavity is muted green. A brass bracket
bolted to the left partition holds the candle in open space at (222, 200), clear
of gears, board and hands. Ivory wax, a layered flame and two bounded radial
halos make the source legible at reading size. Warm falloff touches the wall,
face and hands without washing out the engraving.

The cast silhouette uses one parallel-plane point-light approximation:
source-to-caster depth 50, source-to-receiver depth 70, giving 1.4× enlargement.
For source L and caster P, the wall hit is L + 1.4(P − L). Flame motion ΔL moves
the shadow by −0.4ΔL. Flame, light pools and shadow use the same irregular
keyframe times and easing, so alignment also holds between keyframes. Keep the
receiver and person clips fixed. Three nearby silhouette samples soften the
edge without filters. This is an analytic engraving model, not full ray tracing.

**Motion and cost:** the two wheels retain 24/15-second opposite rotations,
1.5-unit module, pitch radii 24/15 and 39-unit center spacing. Five light layers
share a quiet 6.4-second irregular cycle. Together with the linked chess gesture,
24 animated SVG groups use the existing pause/offscreen/reduced-motion lifecycle; Figure 1's pace does not drive this
scene. Only the working forearms move; the head and body remain attentive and still.
No new observer, client boundary, dependency,
filter or per-frame code. The initial server render is a complete still. Crop
source scan-line geometry on the server, rather than shipping hidden detail.
Reuse the original engraved character via SVG references for its segmented arms
and animated silhouette. Sample joint geometry once on the server at 1% cycle
intervals; the browser only interpolates CSS transforms/opacity.

[Figure 2 linked-move and candle verification](../production-systems-evidence/operator-linked-verification.md)
· [Earlier composition pass](../production-systems-evidence/operator-composition-verification.md)

### Rhythm and content ownership

A scene for each section does not mean eight competing hero panels. Use the
opening, operator and chessboard as major visual moments. The cutaway is a
medium explanatory plate; inspection, release, folio and closing are smaller
vignettes. Vary viewpoint and scale, not the underlying world.

Place the scene with its heading or opening proposition, before the dense prose
when practical. On phones, preserve a legible whole composition. Later scenes
keep a caption immediately below; the opening deliberately has no bottom text.
Its p-values and verdicts belong to the rising outfeed vapor, with methodology
and source context in the page’s artwork notes. Original art has useful alt text;
decorative extensions stay out of the reading order. Never place long prose over the scene.

Caption pattern: **the section's conceptual point, in one sentence.** For example,
“A local move changes the position of the whole board.” The picture attracts
attention; the caption and body connect it to the actual data-science problem.
The historical concealment is a narrative reference, not a claim that professional
systems should conceal human involvement.

## 4. Materials and color

The accepted machine supplies the page's material family. **Muted deep green is
the principal highlight**, with a darker shade for headings, warm charcoal for
prose and warm gray for supporting text. Walnut and brass support the instrument;
they do not compete for the page's primary accent. Keep the reading surface light,
untextured and spacious. This is our digital interpretation, not a sampled
historical restoration; a source scan's tint is not material evidence.

| Role / token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F4F2EB` | Reading surface and quiet space around the machine |
| `--ink` | `#403B31` | Warm charcoal body text |
| `--muted` | `#6B6458` | Supporting text, metadata and captions |
| `--accent` | `#4D6353` | Deep muted green: links, navigation, identifiers, primary action, selected pace and focus |
| `--accent-deep` | `#344A3C` | Principal and section headings; primary-action hover |
| `--sage` | `#7D866B` | Small decorative marks, borders and secondary pigment |
| `--walnut` | `#68483A` | Casework family, with darker recesses inside the illustration |
| `--ivory` | `#E7DCC1` | Inlay, paper register and readable text on the dark application section |
| `--metal` | `#AE9365` | Small brass edges and fittings, not small text on paper |
| `--brass` | `#78602C` | Readable supporting brass where needed; never the primary page accent |
| `--dark` | `#2F3A2E` | Olive-green application section, with a related `#3B4535` inset surface |
| `--line` | `#CEC7B6` | Quiet rules and separators |
| Positive / negative lift | `#52694D` / `#87564B` | Subtle green / muted red-brown, always accompanied by a signed percentage |

Solid sRGB contrast: ink/paper **9.93:1**, muted/paper **5.22:1**,
accent/paper **5.81:1**, deep accent/paper **8.56:1**, ivory/dark **8.73:1**.
Positive and negative lift inks have **5.38:1** and **5.41:1** contrast against
paper before animation opacity. Sage/paper is **3.41:1**: reserve it for decoration
and boundaries, not normal text. Light brass is also decorative on paper.
Check actual composited backgrounds and fading states. W3C's normal text threshold
is 4.5:1; token contrast alone is not a full accessibility review. [S5]

Material hierarchy:

1. Paper carries prose; green supplies editorial emphasis and orientation.
2. Wood establishes a case, frame or supporting base, with board-directed grain.
3. Ivory identifies a surface to read or inspect.
4. Brass belongs to joints, bearings, controls and thin finished edges.
5. Directional result color belongs to evidence; it does not certify a decision.

Keep wear minimal and surfaces matte. Build depth with a lit edge, an occluding
surface and a darker recess. Avoid repeated shiny bevels, broad brass plates,
unrelated accent colors or noisy texture behind the prose.

## 5. Illustration grammar

The opening must read as a **Mechanical Turk operating an A/B experiment
conveyor**, from the picture alone. The owner rejected a generic press with
loosely associated mechanisms. This requirement supersedes the earlier
600×420 press/gate composition: the historical silhouette is now essential.

Use Racknitz's seated posture and Windisch's broad cabinet proportions as the
anchors. The conveyor is the chessboard work surface itself, supported by the
same cabinet and brackets. Paired specimens keep A and B together as one unit;
the outfeed reveals the uneven evidence they produce. Most estimates cluster near
zero, with noise, some losses and a rare large positive effect. The hand
works an attached lever with a brisk stamping gesture every 2.18 seconds at the default Medium pace; the
belt, rollers and meshing drive run continuously through that gesture. Layer
the chair and torso behind the tabletop, with only the forearms and hands
crossing it. The body must never appear to emerge from the moving work surface.
Keep the cabinet door, hinges, recessed transmission and feet legible at phone
size. The pale paper register balances the dense
mechanism. No floating gauge, disconnected return arrow or stand-alone glyph
should compete with this action.

The result register is a physical paper roll attached to the case, not a
floating dashboard. It presents synthetic estimates, approximate 95% intervals
and two-sided normal-model p-values. Display effects as relative percentage lift;
the internal plot coordinates use tenths of a percentage point. Scaling estimate
and standard error equally preserves every p-value and interval position. Small gray
annotations stay secondary to the distribution around zero. Most results are
near zero, with noisy overlap and two negative results; one large positive breaks
the pattern. The paper advances one row for each test: the result leaving the
outfeed, entering the register and appearing in the smoke share one outcome.
Use mild gray, oxblood and green row washes with matching interval marks,
respectively; keep the paper and plot geometry dominant. Ten outcomes repeat
every 21.82 seconds at Medium (24 seconds of shared animation time). This mix is an editorial choice, not an estimated industry
success rate.

Each plume carries **signed percentage lift → p-value → verdict**, so its first
line reads as a test result without statistical training. Lift is 18 SVG units in
Georgia, with green positive and red-brown negative ink. The sign and value remain
explicit: color never substitutes for meaning. P-values are 12.5 units in warm
gray `#746C5F`; verdicts are 13 units in `#665F51`. Their independent wisps stay
faint. Direction is not significance: a small green estimate can remain null, and
an apparent positive can be the explicitly fictional false-positive example.

At Medium, text reaches 96% opacity within 218 ms, stays there through 1.96 seconds
and then gradually dissolves. Emissions are about 2.18 seconds apart, with at most three
visible plumes, more vertical space and distinct baselines for all three lines.
The owner rejected text that began already dissolved. Preserve this readable
window as the entire machine speeds up or slows down. No bottom caption, legend
or outcome notes. Reduced motion shows three complete still plumes. Essential
meaning remains in the SVG description and readable artwork notes.

Keep initial evidence separate from later value. Two smoke examples show
`p = .020` with an apparent lift later identified as a false positive, and
`p = .237` with an inconclusive idea dropped too early. Their fictional underlying
effects are 0% and +6.1% respectively; these hindsight labels are authored story
facts, not deductions from p-values or the fact of a failed replication. The
source fixture uses estimate ± 1.96 SE and p = 2 Φ(−|estimate / SE|). No number
represents Stepan's or Prodigy's results. The page identifies synthetic data and
cites the ASA distinction between significance, effect size and practical value.
[S7]

### Conveyor construction · 4 October 2026

The conveyor is a complete, supported assembly. The open clockwork cabinet
movement below now meets the coupling boundary established by this pass. Loopforge supplies a light reference for substantial
rails, bracing, inspection openings and fasteners. Retain this page’s engraved
wood/iron/brass treatment rather than adopting the factory’s lighting or materials.

- Paired cards ride jointed checker-inlaid slats on one oblique upper plane.
  Use the exact (+36.95, −64) depth vector across its bed, drums and cabinet.
  The rear tail corner is (68.95, 249), directly behind (32, 313). Rear shaft
  bearings, a thin guide-cap top, contact shadow and moving front slat end faces
  distinguish fixed supports from the moving surface without thickening the frame.
  Both end drums use that same depth vector. The lower return moves left while
  the loaded run moves right; the frame, bearings and adjustment screw stay fixed.
- A continuous side loop wraps the drums. Separate stationary rails carry split
  bearing blocks, visible collars, a slotted tail adjustment and a tension screw.
  The short left-facing knee now mounts to the solid central stile at x=381–391,
  y=353–385, with visible bolts at (386, 359) and (386, 379). Its upper cleat meets
  the stationary rail at x=352–392; the continuous frame and crown pads carry the
  outboard tail. The former diagonal over the open door is removed. Keep the
  hinge jamb and door swing visually clear; the door carries no conveyor load.
- The existing right cabinet shaft at (322, 415) supplies a narrow vertical chain
  to a compound jackshaft at (322, 332). A second guarded chain, visible through
  three inspection openings, drives the right end drum at (591.05, 332).
  Equal sprockets preserve direction and speed. The clockwork pass retains these
  centers and the same output speed.
- Drum and chain motion match the existing shaft’s 288 degrees per 2.4 seconds.
  An effective drum pitch radius of 17.507 SVG units corresponds to 88 units of
  belt travel. Ten-tooth radius-seven sprockets advance eight links per period.
  Repeated geometry closes at the animation boundary; no stop/start indexing.
- Contemporary functional references: the drive/idler ends, mounting brackets,
  return rollers and bearings in Dorner’s end-drive manual [S8]. This is an
  original period-material illustration, not a manufacturer drawing, fabrication
  plan or authenticated historical reconstruction.

### Open clockwork cabinet · 4 October 2026

Owner correction: the watch reference became too literal. Broad silver supports
covered too much of the compartment; five wheels of similar scale made the
motion uniform. The current direction is an exposed, layered gear train, with
small rear bearings and much more variation in wheel size and motion. This
supersedes the first watch-bridge treatment in PR #68.

- Let gears occupy the view. One large, eight-spoke flywheel anchors the left;
  medium brass wheels and smaller dark steel pinions form a denser, asymmetric
  train. Keep the material family of the wooden Turk cabinet and its engraving.
- Eleven wheels occupy two planes. The five-wheel main train drives the conveyor;
  four smaller branch wheels mesh with it. A small foreground pinion shares the
  centre arbor and drives a separate reduction wheel. Overlap has a physical
  explanation, with an exposed spacer and open spokes revealing the deeper train.
- Use a 74-tooth, radius-37 flywheel and pinions down to 18 teeth, radius 9.
  At Medium, rotation periods range from 1.36 to approximately 5.61 seconds
  (the geometry module uses a 1.5–6.17-second logical timebase). Neighboring
  gears counter-rotate, compound wheels share an angular speed, and the separate
  reduction adds a slower counter-rotation. A small eccentric marks a fast pinion.
- Recess bearings into the dark back of the case. Thin mounting rails remain
  behind the wheels. Remove broad shaped bridges, pearl-patterned plates, bright
  jewel settings and front braces. The only foreground collar belongs to the
  conveyor takeoff; keep it small enough to expose the driving wheel’s teeth.
- Preserve the precise connection at (322, 415): 288° clockwise per 2.4 seconds,
  with the same vertical chain, jackshaft and head-drive chain as the accepted
  conveyor. The entire mechanism uses the existing pause, visibility and reduced
  motion lifecycle, with complete stills and no per-frame JS.
- Geometry remains deliberate: common module-one teeth, tangent pitch circles,
  phased contacts, matched pitch-line velocities and clearance between non-mating
  wheels in the same plane. These are illustration constraints, not toleranced CAD.
  KHK’s spur-gear reference [S11] informs these relationships.
- Patek Philippe [S9–S10] remains a study of fine metal finishing, not a template
  for the composition. Translate its care into thin rim highlights, hub detailing
  and crisp tooth profiles. Do not reproduce a watch caliber or brand marks.
- At phone size, the dominant flywheel, small gears, layered motion and continuous
  conveyor drive should read before the engraved surface detail.

### Finished cabinet casework · 4 October 2026

The final opening-illustration pass brings the enclosing furniture up to the
accepted conveyor and open clockwork. Windisch's 1783 plate [S2], inspected again
for this pass, supplies projecting edges, framed compartments, paneled doors and
strong recesses. Its pulled drawer is a depth reference; our case has a continuous
structural apron. This is original casework, not a historical restoration.

- Keep the broad, grounded silhouette. Layer a restrained cornice beneath the
  conveyor, a rebated mechanical opening, a slender fluted central stile and a
  continuous apron over a stepped plinth. Small turned feet finish the corners.
- Project the right side with the conveyor's exact (+36.95, −64) depth vector.
  Every base molding must meet its front counterpart and wrap around the corner.
  A recessed side panel, bevels, miter seams and thin edge highlights explain
  construction at normal reading size.
- The open door has thickness, a framed raised panel, subtle figured veneer,
  two brass pin hinges, a small keyhole escutcheon and a hanging pull. Place the
  hinges on the fixed jamb. The conveyor brace has its own base on the central
  stile, separate from the hinge jamb and open door. Draw the door in front of the base.
- Grain follows each board. Long fibres run up stiles and around the side; the
  apron runs horizontally. Nested cathedral cuts belong to the door panel.
  Keep grain quieter than contours and reserve dark shading for actual recesses.
  A restrained walnut tonal range gives depth without a glossy rendered finish.
- Pale stringing and edge lines belong to casework; brass belongs to working
  fittings. Avoid broad gold plates, unrelated filigree or carved decoration
  competing with the motion. Both hinges and the base should still read on a
  phone even when individual incisions disappear.
- Keep all eleven gears exposed within the existing (158, 354)–(369, 469) chamber.
  Preserve the revised fixed-stile conveyor mount, (322, 415) output, paper
  register, stamp and smoke.
  The shell is static, server-rendered SVG: no new client code, animation, image,
  font or dependency.

[Cabinet production captures and verification](../production-systems-evidence/turk-cabinet-verification.md)

### Applying the accepted opening to the remaining scenes

Start each next pass from this construction standard: one coherent projection,
visible load-bearing joints, contours stronger than grain, selective recess
hatching and enough quiet surface to read the object. Continue the same walnut,
ivory, brass and green family across viewpoints. Light must attach to a source;
motion must express an actual linkage or a meaningful change of state. The
operator, board and cutaway deserve new compositions, not copies of the hero's
gear cluster. No floating supports, decorative gears without a drive, arbitrary
perspective changes or extra hardware used only to fill space. Review at normal
reading size and on a phone before rewarding enlargement-level detail.

[Current instrument, palette and pace verification](../production-systems-evidence/instrument-finish-verification.md)

The conveyor and its transmission are our editorial invention. Racknitz's
figure is source-derived vector geometry, with a clipped forearm used for the
working gesture. This is not an authenticated reconstruction of the Turk.

- Compose at thumbnail size first: one principal apparatus, one focal mechanism,
  one connected mechanical action. Leave air around its silhouette.
- Use a consistent three-quarter or front elevation within one drawing. Align
  top planes, door edges and feet to the same perspective.
- Design outer contour, internal construction and shading as three levels. For
  a 600px-wide SVG, begin around 1.5–2px, 0.9–1.2px and 0.5–0.7px respectively;
  assess the actual 280–330px phone rendering before accepting the detail.
- Crosshatch only undersides and recesses. Preserve broad quiet material faces.
  Keep decisive contours visible after decorative detail becomes imperceptible.
- Use doors, hinges, rails, handles, linkages and shafts where their construction
  or behavior makes sense. Gears must mesh or share a justified drive connection.
- Put essential labels and explanations outside the artwork. Reference numerals
  can connect a feature to the HTML legend. No tiny embossed text as the only
  explanation; no invented readings on decorative meters.
- Distinguish conceptual mechanism, measured data and historical reference in
  the artwork notes and accessible description. The profile’s apparatus remains
  an original conceptual metaphor.

## 6. Type and editorial rhythm

Keep the current system font families. The historical reference informs the
hierarchy and captions; it does not require a new font download or archaic prose.

| Role | Guideline |
| --- | --- |
| Name / principal heading | Georgia, normal weight, current 42–66px responsive range; confident whitespace |
| Section heading | Georgia, 28–36px, approximately 1.15–1.25 line height |
| Figure caption | Georgia, 22–29px; a short italic phrase is an optional accent |
| Main prose | Arial/Helvetica, 16–18px, 1.6–1.75 line height; aim for 60–72 characters per line |
| Controls | Arial/Helvetica, 13–14px; clear verbs or domain names |
| References / figure labels | 11–12px, 1.5 line height; reserve uppercase tracking for short labels |
| Technical identifiers | Existing monospace family, used only when the notation benefits from it |

Treat these as the next-pass target, not an assertion that current 9–10px trim
already meets it. Avoid highly compressed letter spacing in small labels. Use
italic serif sparingly, never for long instructions. Preserve plain language and
the owner's factual, abstract professional framing.

Keep the current maximum width and two-column opening as a baseline. Major
sections have generous 56–80px vertical space on desktop and 36–48px on phones.
Use fine rules and aligned baselines as the default separators. The casework
motif should not turn every experience entry or paragraph into a bordered card.

## 7. Controls and demonstration

Controls should feel like named selectors on an instrument: flat, precise and
quiet, with an inset edge or small inlay. A selected state must be obvious without
reading an ornamental dial.

| State | Treatment |
| --- | --- |
| Rest | Paper surface, ink label, readable structural border |
| Hover | Slight warm surface change; no layout shift |
| Selected | Muted green face with paper label, or a green/brass knob; clear marker beyond color |
| Focus | Separate 2px deep-green outline on paper; ivory outline on dark surfaces |
| Pressed | Subtle inset change, at most 1px displacement |
| Disabled | Native disabled semantics and clearly subdued appearance |

Retain native radio semantics for the domain comparison. A future inspection
control can open an explanation or show a useful cutaway; the related text must
remain available without animation. Provide at least a 44×44px touch area per
the repository standard, visible keyboard focus and logical reading order.

### Experiment pace

The opening has a small three-detent brass rail with a green knob: **Slow / Medium /
Fast**, default Medium on every page load. Native radios provide keyboard and
screen-reader semantics; every label has at least a 44×44px target. Keep it in the
plate's quiet upper-left area, away from the figure and rising results. The nearby
information disclosure explains the methodological trade-off and cites sources.

The CSS machine retains one 2.4-second logical test period. Playback rates are
0.55 / 1.1 / 3, giving approximately **4.36 / 2.18 / 0.80 seconds per test**.
Owner speed tuning: the original Fast pace is now Medium; the new Fast is
approximately 2.73 times faster than Medium. Slow remains the inspection pace.
Apply the rate to all 47 hero animations together: stamp, belt, slat edges, gears,
chains, specimens, paper, smoke and moving cast shadows. Preserve phase and paused state; never restart
parts or change their individual periods. `Animation.updatePlaybackRate` preserves
the current position [S14]. One scheduled update per selection/preference change
is sufficient; there is no per-frame JavaScript loop.

The metaphor needs careful wording. At fixed traffic, shorter tests collect less
evidence per decision; uncertainty depends on sample size, variability and design
[S12]. More comparisons require a testing policy that handles multiplicity [S13].
**Speed alone does not determine FDR**, and a p-value is not the probability that
one result is false [S7]. The switch changes animation pace only; it does not
manufacture accuracy rates, change the fixed examples or simulate an experiment.
Keep this explanation readable in the disclosure and public artwork notes.

Pause, offscreen suspension and hidden-tab behavior retain authority. A speed
change while paused must not resume or seek. Reduced motion disables the speed
fieldset and keeps the explanation available; turning reduced motion off reapplies
the chosen rate, as does returning from print. Without JavaScript the inactive switch is hidden and the complete
still remains. Print omits the controls and illustrations.

The owner requested living, procedural engravings. The initial server-rendered
state is a complete still; motion begins only after the lifecycle controller
confirms visibility and preferences. Candlelight stays attached to its source.
A persistent “Pause illustrations” control governs all scenes. Offscreen, hidden
tab and reduced-motion states suspend motion. If a later pass adds a deliberate reveal,
use one action → one short mechanical response, approximately 180–320ms, with no
looping flourish. Reduced motion changes state immediately. This duration is our
design choice; the ability to disable nonessential interaction-triggered motion
is informed by W3C guidance. [S6]

## 8. Application across the page

| Area / current code | Next polish direction | What establishes success |
| --- | --- | --- |
| Header and identity in `page.tsx` | A small engraved nameplate, disciplined type and spacing | Name and navigation remain the first readable facts |
| `LoopBlueprint.tsx` | Seated Turk operating a cabinet-integrated A/B conveyor | Figure, paired specimens and physical feed action read as one apparatus |
| Background and capabilities | Folio typography, aligned roles/dates, fine rules | Professional experience is easy to scan |
| `ScenarioExplorer.tsx` | A bounded demonstration surface with precise selectors and clearly labeled outcomes | A selection reveals one useful comparison; no imitation dashboard data |
| Method and sources | Marginal-style numbering, calm notes, generous source spacing | Readers can trace claims to evidence without losing their place |
| Contact / `ProfileActions.tsx` | A restrained closing colophon and decisive primary link | LinkedIn and printing stay obvious |
| `profile.module.css` | Implemented: local green emphasis, warm charcoal prose, paper, ivory and olive-green application surface | No global token changes or spillover to Sanctuary/Loopforge |

## 9. The focused passes

1. **Direction — this document.** Establish sources, material roles, type and
   behavior. The accompanying visual sheet records the references; the first
   procedural scene implementation is recorded below.
2. **Scene master and hero craft.** Establish the Turk operating an A/B conveyor: silhouette,
   connected feed action, joinery, hatching and caption. Use that grammar to stage
   the operator and chessboard compositions before extending to the quieter
   section scenes. Compare full-page desktop and phone captures.
3. **Editorial finish.** Refine identity, whitespace, small labels, reading widths,
   rules and section transitions against the accepted hero.
4. **Instrument controls.** Apply the material hierarchy to the domain selector
   and example surface; verify all selected/focus/keyboard/touch states.
5. **Final consistency.** Sources, contact, two-page print, responsive details and
   performance. Judge the whole reading sequence, not an isolated component.

Each pass should have one visual problem, one coherent change and a before/after
review. Do not expand a polish pass into employer claims, new project facts or
an unrelated redesign.

## 10. Acceptance and boundaries

A successful pass feels constructed, reads calmly and stays fast. Review 320,
390, 768 and 1440 CSS pixels; inspect primary actions, keyboard/touch states,
reduced motion and print as relevant. Keep the two-page profile usable. Label
laboratory timings as laboratory observations; field performance is unmeasured.
The shared [design/performance standard](../../../DESIGN_AND_PERFORMANCE_STANDARDS.md)
continues to govern media, motion and delivery.

SVG geometry is the required runtime medium. The owner explicitly selected
procedural, moving engravings over raster illustrations. Keep strokes crisp,
batch repeated geometry, and animate only attached mechanisms and small light
layers. The public page fetches no raster reference image and no new font.

The two human figure studies use an offline procedural scan-line reconstruction
of the inspected public-domain Racknitz plate III. Silhouette masks retain the
source posture; two density fields preserve its fine anatomical and fabric
incisions as vector strokes. This is source-derived geometry, not wholly original
figure drawing. The surrounding cabinetry, chess geometry, conveyor, instruments
and motion are original procedural compositions. Public artwork credits make
that distinction explicit. Source scans stay out of the runtime deployment.

Reproduction: `apps/lab/scripts/profile-engraving.py` accepts the 2678×2439
Racknitz III JPEG linked in S3 and emits
`apps/lab/lib/production-systems/figure-studies.json`. It requires Pillow for this
offline authoring step; the application has no new dependency. The input SHA-256 is
`1c3b42fd555ec947d6cc141368b6975e9483c6dd7dd22a8a01f14266410e51c1`.
The original work is dated 1789; the Commons record identifies the faithful
reproduction as public domain. The scan's color is not treated as restoration
evidence. Fine figure geometry is rendered on the server and is not regenerated
per frame in the browser.

Any later raster publication uses the repository's versioned media pipeline and
records provenance for that exact asset.

Avoid generic cog borders, steam pipes added without purpose, glowing dashboards,
blanket sepia filters, noisy parchment, Victorian type everywhere, a fictional
professional persona or a chess motif repeated across every section. These would
obscure the reference's strongest qualities: proportion, craft, intellectual
focus and the act of inspection.

## Sources and observed evidence

Checked 3–5 October 2026. Historical observations above and our design choices are
separated deliberately. The visual sheet embeds source-hosted reference images;
its material and type specimens are our original design interpretation.

- **S1 — Computer History Museum, “Engraving of The Turk.”** Racknitz, 1789;
  courtesy of the Library Company of Philadelphia; accession L062302012.
  History and a view of the concealed operator. Eight-word quote above.
  https://www.computerhistory.org/chess/stl-431e1a07e7e40/
- **S2 — Windisch, 1783, exterior/open-cabinet engraving.** Reproduction cataloged
  on Wikimedia Commons; the file record identifies the source book and carries
  a public-domain mark. Visually reviewed the exterior, doors, drawer and caption.
  https://commons.wikimedia.org/wiki/File:Tuerkischer_schachspieler_windisch4.jpg
- **S3 — Racknitz, _Ueber den Schachspieler des Herrn von Kempelen und dessen
  Nachbildung_, Breitkopf, 1789.** Digitized source at Humboldt University Library,
  plate III (image 65); Commons identifies its corresponding image as a proposed
  explanation/reconstruction. Consult the plate as a historical representation.
  https://www.digi-hub.de/viewer/image/BV041097321/65/
  https://commons.wikimedia.org/wiki/File:Racknitz_-_The_Turk_3.jpg
- **S4 — Deutsches Museum, Carola Dahlke, “Schach, die Mensch-Maschine und die
  Anfänge der KI,” 4 April 2024.** Visually reviewed its cropped mechanism plate.
  Use the caption's 1789 attribution; the page's image alt text says 1798.
  https://blog.deutsches-museum.de/2024/04/05/schachblog
- **S5 — W3C, Understanding SC 1.4.3, Contrast (Minimum).** Basis for the
  calculated text/background checks, not a claim of full-page conformance.
  https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- **S6 — W3C, Understanding SC 2.3.3, Animation from Interactions.** Level AAA
  guidance used as a motion-design principle, not a certification claim.
  https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html

- **S7 — American Statistical Association, “Statement on Statistical Significance
  and P-Values,” 7 March 2016.** Principles 2, 3 and 5 inform the separation of
  p-value, effect size, decision and hindsight. The profile quotes the 14-word
  fragment about effect size and importance from principle 5.
  https://www.amstat.org/asa/files/pdfs/p-valuestatement.pdf

- **S8 — Dorner, 2200 Series End Drive Conveyors, installation, maintenance and
  parts manual, 851-452 Rev. J.** Consulted 4 October 2026, especially the component
  list (p. 5), mounts/returns (pp. 8–9), and tension/bearings (pp. 13–17). The manual
  identifies the functional relationships; no source diagram is reproduced.
  https://www.dornerconveyors.com/wp-content/uploads/2017/09/851-452j.pdf

- **S9 — Patek Philippe, caliber 30-255.** Consulted 4 October 2026; visually
  inspected the official movement photograph in the browser, including its
  separate sculpted bridges, bearing settings and visible brass wheel train.
  https://www.patek.com/en/collection/movements/30-255
- **S10 — Patek Philippe, “Hand finishing.”** Consulted 4 October 2026; beveling,
  circular satin finish, sinks and perlage are the relevant sections. Original
  procedural interpretation; no source photography shipped with the page.
  https://www.patek.com/en/manufacture/artisans-of-time/hand-finishing
- **S11 — KHK, “Calculation of Gear Dimensions.”** Standard spur-gear module,
  reference diameter and center-distance relationships; consulted 4 October 2026.
  https://khkgears.net/new/gear_knowledge/gear_technical_reference/calculation_gear_dimensions.html

- **S12 — NIST/SEMATECH, “How do we determine the required sample size?”**
  Sample-size relationships for precision, power and error rates. Consulted
  4 October 2026; basis for the fixed-traffic evidence caveat.
  https://www.itl.nist.gov/div898/handbook/prc/section2/prc222.htm
- **S13 — Microsoft Research / ExP, “Treatment effect assessment at scale:
  accounting for correlated metrics and metric relevance in modern
  experimentation,” 15 July 2026.** FDR is the expected proportion of false
  discoveries among discoveries, handled by the testing procedure. It is not a
  per-result probability or a quantity derived from illustration speed.
  https://www.microsoft.com/en-us/research/articles/treatment-effect-assessment-at-scale-accounting-for-correlated-metrics-and-metric-relevance-in-modern-experimentation/
- **S14 — MDN, `Animation.updatePlaybackRate()`.** Asynchronous rate changes keep
  the current position rather than jumping the animation. Consulted 4 October 2026.
  https://developer.mozilla.org/en-US/docs/Web/API/Animation/updatePlaybackRate

- **S15 — Pharr, Jakob and Humphreys, _Physically Based Rendering_, 4th edition,
  “Area Lights.”** Consulted 4 October 2026. Extended emitters motivate soft
  penumbrae; the opening uses a deliberately bounded vector approximation.
  https://www.pbr-book.org/4ed/Light_Sources/Area_Lights

- **S16 — Heinz Nixdorf MuseumsForum, “The reconstruction of the HNF’s Chess
  Turk.”** Consulted 5 October 2026. Primary account of the reconstruction and
  uncertainty about the original. Board sensing and pantograph inform the
  functional relationships, not an exact cabinet blueprint.
  https://www.hnf.de/en/permanent-exhibition/exhibition-areas/the-mechanization-of-information-technology/early-automatons-miracles-of-technology/the-reconstruction-of-the-hnfs-chess-turk.html
- **S17 — HNF, “Zwanzig Jahre HNF-Schachtürke,” 22 March 2024.** Consulted
  5 October 2026; visually inspected the pantograph, uncovered tabletop and
  display-clockwork photographs. Corrects the Racknitz layout. Photographs are
  research references only; none is redistributed or fetched by the public page.
  https://blog.hnf.de/zwanzig-jahre-hnf-schachtuerke/

Local references: Sanctuary's `docs/sanctuary/DESIGN_SYSTEM.md`, Loopforge's
`docs/loopforge/VISUAL_REVIEW.md`, and this profile's revised opening. Their
compositional care remains the quality benchmark; this profile keeps its own
material and editorial identity.

## Implemented scene system · 3 October 2026

- Eight plates: conveyor, operator, open cabinet, board, comparator, release bench,
  folio and worktable. Major scenes have room beside the prose; later vignettes
  are quieter. Figures collapse naturally above their section prose on phones.
- Programmatic board cells, turned pieces, gear teeth, wood grain, hatch fields,
  fasteners and source-derived figure strokes share one material palette.
- CSS transform/opacity motion: rollers, flywheel, conveyor sheets, press, candle,
  comparator and one knight move. Two small conveyor chain paths use dash-offset
  motion to expose power transmission through their inspection openings. A single observer starts only visible plates.
  No per-frame React updates, large blur filters, canvas loop or audio.
- `production_systems_motion_v1` is an independent, persistent profile preference.
  OS reduced motion takes precedence. No JavaScript leaves complete still plates
  and hides the inactive motion control; the existing static scenario remains.
- Scene art is omitted from the compact two-page printed profile. Artwork source
  notes are available beside the methodology bibliography.
- Sanctuary's approved opening was visually inspected and its engraving/motion
  components were read as references. No Sanctuary or Loopforge code was changed.


**S18 · FIDE, Laws of Chess, article 3.7.2 and Appendix C.**
<https://handbook.fide.com/chapter/e012023>
Checked 5 October 2026. A pawn's initial two-square advance requires an empty
intermediate and destination square; file/rank notation is described in Appendix
C. Used to make Figure 2's repeated e2–e4 demonstration a legal chess action.
