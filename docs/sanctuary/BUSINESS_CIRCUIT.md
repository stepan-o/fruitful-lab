# The businesses behind an evening of play

5 October 2026. Chapter 2, `studio-to-screen`. Local visual revision following
PR #87’s editorial pass; not an owner sign-off on the illustration.

## Argument

How entertainment reaches its audience helps determine how it must earn its
living. The opening instrument makes that statement concrete: who pays for
which work, who receives a payment, and what each business needs to sell next.
Equipment location alone cannot carry the chapter’s argument.

Four selected arrangements share a stage. The arcade comes first, continuing
chapter 1. PC purchase and cloud play keep Larian’s game and Steam distribution
constant. Netflix offers a cross-industry comparison. This is not a chronology
in which one model replaces another.

## Composition and treatment

Original SVG cutaway vignettes sit on a single engraved foundation: a cabinet
design shop, an operator’s workshop, a bar and its players. Modern selections
replace the stations with a development desk, a storefront/catalog, computing
or network equipment, and the audience’s room. The architecture is an ordinary
workshop/interior vocabulary; Sanctuary’s brass edges, teal depth, ink cuts,
muted materials and focal lamps connect it to the earlier illustrations.

Names are HTML controls, not tiny text embedded in the artwork. Teal upper paths
connect the provision of work, equipment and access. Brass lower paths identify
three payments. Selecting a supply or payment highlights both sides of its
exchange and reveals the payment explanation. Selecting
a participant exposes its costs, receipts and commercial incentive. A player’s
benefit is explicitly labeled “Receives,” rather than being treated as revenue.

The two desktop rows (outward provision and returning payments) are schematic.
Their order does not imply contemporaneous settlement or a required chain through
all parties. PC suppliers and internet providers serve the audience alongside
the content store. The phone layout uses two columns of the same illustrations
and explicit payer-to-recipient labels on every payment button, avoiding a
scaled-down wire diagram. The former seven-layer reading is retained in a native
disclosure below the opening illustration.

## Evidence and limits

- Arcade: Al Alcorn’s oral history, Computer History Museum, printed p. 13:
  https://archive.computerhistory.org/resources/access/text/2012/09/102658257-05-01-acc.pdf
  Cabinet sale and the player’s coins are separate transactions. The operator/
  venue allocation is an illustrative route agreement, not the Pong prototype’s
  particular contract. Play Meter, 1 November 1984, p. 42 supplies contemporary
  evidence of operator/location splits:
  https://elibrary.arcade-museum.com/magazines/pm/PlayMeter-1984-11-01/PlayMeter-1984-11-01-042.pdf
  Betson documents the same distinction in current operation:
  https://www.betson.com/are-arcades-profitable/
- PC: Larian’s official Steam listing establishes developer and publisher;
  Steam’s reporting/payment documentation defines settlement. Private royalty
  or store-share percentages are not inferred.
- Cloud: Valve’s Cloud Play documentation preserves the game purchase and
  publisher payout; NVIDIA’s membership FAQ establishes separate service
  options. The diagram deliberately selects a paid membership without claiming
  all cloud access is paid.
- Netflix: official investor questions and recommendations documentation
  support commissions/licenses, membership and discovery. The selected plan is
  ad-free. Production payments are not rendered as a per-view royalty. The
  separate household broadband purchase serves many uses.

Source links travel with each selected example in the instrument. Analytical
incentives are our interpretation of these arrangements, not claims about a
particular person’s motives, a title’s private profit or a proven design effect.
Line width and animation speed encode no quantity. The original geometry uses
imaginary interiors and screen scenery; it does not reproduce a game screenshot,
logo, official interface or photographic venue. Composition notes remain here
and in `visual-notes.ts`, outside the public visual-rights index.

## Implementation and performance

`business-circuit.ts` owns the four typed examples. `BusinessCircuit.tsx` owns
selection and the paths; `BusinessCircuitScene.tsx` owns memoized deterministic
geometry. `BusinessMap.tsx` retains the deeper layer explanations. No new
libraries, raster downloads, fetches or external fonts are introduced.

CSS owns the small screen flickers, lamp changes, reels/fans and selected supply
and payment traces. `useLivingPlate` stops them offscreen, in a hidden document, with global
motion off and under OS reduced motion. Still paths, names and explanations
retain the entire argument. There are no animation-frame React updates or large
animated filter surfaces. SVG definition IDs are instance-scoped.

## Verification

- Focused interaction tests cover cabinet-sale versus collection income,
  unchanged game purchases across the local/cloud switch, correct cloud-service
  payee, and Netflix production payment without a per-view royalty.
- Existing seven-layer controls remain covered through their disclosure.
- Standalone procedural stills were rendered and inspected. The bar figure was
  moved behind the counter and film-reel motion was anchored within its local
  transform group following that review.
- Production build, lint, full CI and responsive browser outcomes are recorded
  below when completed. Field performance remains unmeasured.

### Initial local verification (5 October)

- Full Lab CI passed: 56 suites / 252 tests, all 11 retained asset releases,
  and production build. A final production build and 16 focused tests include
  the last participant/payment alignment and scene-geometry corrections.
- Scoped ESLint and `git diff --check` passed. Standalone SVG compositions were
  rendered without the earlier React SVG-title warning and inspected as stills.
- The production JS chunk containing the illustration, its data and retained
  layer explanations is 38,133 bytes / 12,687 bytes gzip. This is the whole
  chunk size, not an incremental transfer measurement. No new raster media.
- The local production server is on port 3106. Browser automation disconnected
  and then reported no available browser, so actual responsive screenshots,
  keyboard/touch verification, animation timing and cold/warm browser loading
  are **pending**. Source-level responsive and lifecycle behavior must not be
  reported as visual verification. The existing lifecycle hook has automated
  offscreen, document-hidden, global-pause and reduced-motion coverage.
- This remains a local review revision. Owner feedback and the pending browser
  checks should precede visual sign-off. Chapter 1 and chapter 2 prose are intact.

### 6 October geometry pass

All rooms and objects now share a dimetric projection: two horizontal room axes
and one vertical height. Floorboards terminate on the room boundary; walls,
skirting, slab thickness and edge fasteners use the same projected corners.
Tables have four supported legs and consistent apron depths. Cabinets, counters,
chairs, screens and equipment racks are built from projected footprints instead
of unrelated screen-space polygons. Screens and their contents share one plane;
the local and cloud examples still show exactly the same game scene.

The pass also restores a consistent human-to-cabinet scale, places two players
at the two control positions, and corrects painter order at cabinet bases.
Desktop stations retain their existing frame and phone scenes retain the same
210 × 212 viewBox, so the correction introduces no layout or asset contract.
No new assets, filters, animation loops or dependencies are introduced.

Verification for this pass:

- Production build and scoped lint passed; all 11 retained asset releases verified.
- Four focused suites / 19 tests passed, covering selection, the retained deeper
  layers, exhibit integration and the existing motion lifecycle.
- Inspected all four arrangements in the production browser preview. At 1280,
  768, 390 and 320 CSS-pixel viewport widths there was no horizontal overflow.
  At 320px, arrangement buttons remain 44px tall; payment buttons are at least
  54px tall. Phone cards retain individual room illustrations.
- Keyboard Tab/Enter selection worked. The global motion control removed the
  scene animations when paused and was restored to its original enabled state.
  No browser warnings/errors were captured in the reviewed session.
- The illustration/data/layer chunk is 40,095 bytes / 13,238 bytes gzip, an
  increase of 551 compressed bytes from the previous local version. This is a
  bundle measurement, not a field-performance or cold/warm navigation result.
- Actual browser capture: `outputs/sanctuary-business-circuit/perspective-preview.png`
  in the task workspace. The earlier disconnected-browser limitation has been
  resolved for responsive review and control checks; field performance remains
  unmeasured. Existing automated coverage supplies the reduced-motion and
  offscreen/hidden-document lifecycle checks.
- Local preview refreshed on port 3106. Prose and business/payment data remain
  unchanged by this geometry pass. This was the local review state before PR preparation.

### PR validation (6 October)

Prepared on `codex/sanctuary-business-circuit` in the Sanctuary worktree, based
on updated `origin/master` after the chapter-two editorial PR merged.
`API_BASE_URL=http://localhost:8000 npm run ci` passed: 59 suites / 271 tests,
asset checks for all 11 retained releases, and the production build. Scoped
ESLint and `git diff --check` also passed. No app dependencies were added.

[Browser preview evidence](evidence/business-circuit-desktop.webp) records the
reviewed desktop composition. The 66,618-byte WebP is a documentation artifact;
it is not loaded by the presentation. The responsive and motion checks above
apply to the same illustration code. Production publication follows PR review
and merge; the PR requests no production promotion.

### 6 October route readability pass

The upper teal routes now have their own “What they supply” legend and HTML
labels naming both participants. Larger arrowheads and non-scaling strokes
keep the direction visible as the illustration shrinks. PC and Netflix use
two separated route heights so their branching relationships remain legible.
Below the participants, “Who pays whom” identifies the brass payment routes;
their existing selection behavior and financial meaning are unchanged.

At widths of 700px and below, the supply labels become three full-width rows
with explicit source-to-recipient text instead of compressing the wires and
labels. This introduces no media, dependencies or animation loops. Chapter
prose and the comparison's underlying business data remain unchanged.

Scoped lint, the production build and three focused suites / 16 tests passed.
Browser review covered 320, 390, 768 and 1280 CSS-pixel widths with no horizontal
overflow. The longer Netflix labels no longer collide at tablet width after
increasing the separation between the two route heights. Phone supply labels
remain 16px. The local production preview was refreshed on port 3106.

Browser evidence: `outputs/sanctuary-business-circuit/readable-routes.png` in
the task workspace. This readability revision remains local pending review.

### 6 October linked supply and payment selection

Each supply now explicitly references its corresponding payment. The links are
not inferred from order or reversed endpoints: the cloud example's supported
store copy belongs to the Steam game purchase, while remote computing belongs
to NVIDIA's membership. Selecting a supply label, payment or participant updates
one shared selection. Supply labels are keyboard-operable pressed buttons on
desktop and phones.

Both rows use the same trace and arrowhead components, dim inactive routes and
animate the selected route with the same sparse moving dashes. Teal identifies
supply; brass identifies money. The existing visibility, motion and reduced-motion
gates govern both traces. No new JavaScript frame loop or dependency is added.

Scoped lint and three focused suites / 19 tests passed. The interaction coverage
checks selection from both sides of all twelve supply/payment pairs, including
the non-reversed cloud relationship. The production build passed, including all
12 retained asset releases. In the refreshed browser preview, supply selection
and keyboard Enter activation updated both paths; global motion pause removed
both animations while preserving the selected still paths. No browser warnings
or errors were captured. At 320, 390, 768 and 1280 CSS-pixel widths there was no
horizontal overflow; the longer Netflix labels retained their separated lanes
on tablet and at least 50px-tall buttons on phones. The temporary viewport was
reset after verification.

Browser evidence: `outputs/sanctuary-business-circuit/linked-routes.png` in the
task workspace. This remains a local revision for review.

### 6 October distinct rooms and grounded activity

The Atari station now reads as a design shop: an inclined drafting board with
paper, ruler and pencil; a wall board with cabinet elevations, a game-screen
sketch and wiring blocks; and a separate small circuit drawing. All drawings
follow their wall or tabletop plane. These are invented design-shop details,
not archival plans or a reconstruction of Atari's actual premises.

The operator retains storage racks, an open cabinet and tools. The bar instead
has a framed mirror, low bottle credenza, chalkboard and counter-mounted taps.
The player corner has an original sunburst/saxophone music poster. These changes
differentiate manufacture/design, upkeep, hospitality and play through the room
furnishings, while retaining the same dimetric projection, materials and scale.

Small CSS motions belong to the four activities: an 11.4-second workshop-light
cycle with occasional brief dips; two short repair-spark bursts in an 8.3-second
cycle; a 7.6-second glass slide along the bar, with its forearm extending on the
same timing; and two staggered 5.8-second joystick pulls. The forearms rotate
around fixed elbows and the joystick tips follow matching small arcs. Controls
on the unattended cabinets remain still. Paused/reduced-motion states hide the
repair flash and sparks, restore neutral poses and preserve the lit workshop.
All new animations share the existing offscreen/document/preference lifecycle.

Lower paths now attach to participant centers. Neighbor exchanges share a
baseline; longer returns use a second lane. Receipts are numbered and ordered
by their position in the diagram, with markers aligned above the corresponding
cards. The selected path renders last so a shared stem cannot obscure it.
Selection still refers to the underlying transaction, independent of its display
position; financial descriptions and chapter prose are unchanged.

Verification: scoped ESLint and the production build passed, including all 12
retained asset releases. The three focused suites / 19 tests passed for the room
pass; the seven circuit interaction tests passed again after receipt ordering.
Browser review covered desktop, 768px, 390px and 320px with no horizontal overflow.
Phone payment controls are at least 54px tall. Time-separated frames and computed
transforms confirmed motion and matching glass/hand movement; the global pause
removed all new animations and left the sparks hidden. No browser warnings or
errors were captured. The temporary viewport override was reset.

The illustration/data/layer chunk is now 50,144 bytes / 16,237 bytes gzip (whole
chunk, including the earlier paired-arrow changes). No image payload, dependency
or JavaScript animation loop was added; this is a bundle measurement, not field
performance. React review retained memoized deterministic scene geometry and
small event-driven state. Local preview remains on port 3106.

Evidence in the task workspace:
- `outputs/sanctuary-business-circuit/room-craft-desktop.png`
- `outputs/sanctuary-business-circuit/room-craft-phone.png`
- `outputs/sanctuary-business-circuit/room-motion-a.png` and `room-motion-b.png`
  record the earlier motion/composition check before final receipt alignment.


### 6 October selection spotlight

Each highlighted participant has a warm radial halo, a fine illuminated room
outline and a brighter name/role panel. The scene itself is an accessible
button on desktop; phones keep the entire illustrated participant card as the
hit target. Selecting a room or caption highlights that participant; selecting a
supply or payment highlights both endpoints of that particular connection.
Pointer hover and keyboard focus preview the same single-room or paired-room
highlight without changing the committed payment/readout, then restore the
selection when the preview ends.
Keyboard focus takes precedence over a stationary pointer. Changing arrangements
clears previews from the previous example.

Activity becomes deliberately more visible in the highlighted room: a broader
lamp pool and more pronounced workshop flicker; larger, longer repair sparks;
a glass slide three times the idle distance; and wider, faster paired joystick
and forearm arcs. Other rooms retain their quiet idle activity. Selected screen,
fan and network-signal cycles also gain emphasis in the modern arrangements.
Motion amplitudes and frequencies are expressive, not quantitative encodings.

The upper row now explicitly identifies products/services and supplier-to-recipient
direction. The lower row identifies purchases, fees and revenue shares and
payer-to-recipient direction. These notes describe how to read the model, rather
than explaining the decorative artwork, and are associated with the control
groups for assistive technology.

The halo uses a small static SVG gradient with an opacity transition, not an
animated blur. Existing CSS motion gates still govern selected and idle activity;
OS reduced motion also removes the new selection transition. Memoized scene
geometry is retained, with event-driven state only and no new assets or runtime
dependencies.

Verification: scoped ESLint, production build and `git diff --check` passed.
The three focused suites passed all 21 tests; the nine circuit tests passed again
with the keyboard-priority regression covered. Browser review confirmed selection
through the scene, caption, supply and payment controls; Tab previews the next
room despite the pointer remaining over the previous one, and Enter commits it.
Time-separated player frames show the larger control/forearm poses. Selected
repair sparks and the strengthened outer halo were captured in the final desktop
frame. The motion toggle removes the animations, and was restored to on.

Responsive review covered 320px, 390px, 768px and the normal desktop viewport,
with no horizontal overflow. At 320px visible controls remain at least 44px tall
and the annotations remain 12px. The final halo was also inspected on a 390px
phone layout; the viewport override was reset. No browser warnings or errors
were captured. Existing automated tests cover offscreen, document-hidden and
reduced-motion gating.

The illustration/data/layer chunk is 53,111 bytes / 16,903 bytes gzip, 666
compressed bytes above the preceding room-craft version. This is a whole-chunk
bundle measurement, not field performance. Local production preview is refreshed
on port 3106. This iteration remains local, without a new PR or deployment.

Evidence in the task workspace:
- `outputs/sanctuary-business-circuit/spotlight-desktop.png`
- `outputs/sanctuary-business-circuit/spotlight-phone.png`
- `outputs/sanctuary-business-circuit/spotlight-players-a.png` and
  `spotlight-players-b.png` capture the unchanged motion before the final
  halo and keyboard-priority refinements.


### Connection endpoint selection (6 October)

Selection now records whether the reader chose a room, a supply or a payment,
plus its index. The readout and linked payment are derived from that selection.
Both endpoints of the chosen connection receive the same room glow, brighter
caption and stronger animation, on desktop and phone layouts. Both participant
controls expose their selected state to assistive technology. Room inspection
continues to select one participant; hover/focus previews restore the committed
selection afterward.

Endpoints come from the selected connection, rather than being inferred from the
linked payment. For example, the cloud “Supported store copy” connects Steam and
NVIDIA, while its linked game purchase connects the player and Steam. The existing
paired supply/payment traces are retained. No new visual assets, CSS animations
or dependencies are introduced.


Validation: scoped ESLint, all ten circuit interaction tests and the production
build passed, including all 12 retained asset releases. The tests verify both
endpoints from all 24 supply/payment selections, the non-reversed cloud case,
preview restoration, and individual room inspection. Browser checks confirmed
paired selection through upper and lower controls, keyboard Tab/Enter, and
390px phone cards without overflow. Both rooms retain the existing highlight
and animation treatment. No console warnings/errors were captured. The normal
viewport was restored and the localhost:3106 preview refreshed. Evidence:
`outputs/sanctuary-business-circuit/paired-connection-desktop.png` and
`paired-connection-phone.png` in the task workspace.


### Electrical contact motion (6 October)

This pass supersedes the soft workshop-light dip and expanding radial spark
shape described in the earlier activity pass. Atari's lamp now uses abrupt,
irregular contact chatter: brief cutouts, partial reignition and occasional
longer weak contact, separated by steady light. The selected 4.73-second sequence
contains approximately 52–90ms short interruptions. The idle/highlight refinement
below now reserves this full pattern for highlighted rooms. The bulb, beam and small surface reflection
share one parent opacity so their lighting agrees. The selected scene's static
halo and surrounding reading surface remain steady.

The operator's discharge originates at the exposed lower cabinet contact. A
small branched arc and local flash precede three unequal packets of 8, 5 and 3
sparks over a 5.23-second period. Each particle has its own launch offset,
velocity, gravity curvature and tapered streak length. The streak rotates with
its trajectory, with continuous angles through the leftward apex; its white-hot
core fades before the amber tail. Flight lasts approximately half a second, with
quiet intervals between bursts. The idle/highlight refinement below replaces
unselected bursts with a faint contact glint; selection reveals the full trajectory. These are expressive illustration units,
not a measurement or reconstruction of a real electrical fault.

Sixteen trajectories are deterministically calculated once when the module loads;
CSS plays their transform/opacity tracks and cooling. No per-frame JavaScript,
random hydration state, new media, animated filter or dependency is introduced.
The new particle, core, arc and flash classes share the existing visibility,
manual-pause and reduced-motion gates. Still states leave the lamp lit and all
transient discharge geometry hidden.


Validation: scoped ESLint, 13 existing circuit/lifecycle tests and the production
build passed, including 12 retained asset releases. A 24-frame browser sequence
over 4.87 seconds recorded abrupt lamp-opacity states (including 0.035, 0.08,
0.38 and 1), separate spark packets and differing particle transforms as their
trajectories fell and faded. These samples are approximately 0.2 seconds apart;
they confirm the progression but do not resolve every 52ms interruption. CSS uses
stepped interpolation for the contact chatter and flash, with linear trajectory
segments and cooling opacity for particles.

Manual pause was verified in the actual reader: motion gating became false,
the lamp animation was removed, and all spark/arc/flash elements were hidden.
Motion was restored afterward. The 390px phone rendering retained both selected
room highlights without horizontal overflow; the normal viewport was restored.
The existing lifecycle tests cover document visibility, offscreen suspension
and reduced-motion preference changes. No new frame loop or media payload exists.
The whole illustration/data/layer chunk is 55,353 bytes / 17,680 bytes gzip;
field performance remains unmeasured. Local preview is refreshed on port 3106.

Evidence in the task workspace: `outputs/sanctuary-business-circuit/` contains
`electrical-launch.png`, `electrical-flight.png`, `electrical-cutout.png`,
`electrical-phone.png` and timestamped `electrical-frame-samples.json`.


### Animation belongs to the highlight (6 October)

Unhighlighted rooms now have a distinct ambient state, not a scaled copy of the
full activity. Atari's lamp stays lit except for a faint, brief flutter roughly
once every 13 seconds. The operator has one dim contact glint over a similar
interval; its arcs, flying sparks and cooling tracks have no active animation
until the room is highlighted. Deselecting removes the transient particles,
rather than leaving a burst frozen in place. Highlighted electrical motion
retains the contact chatter and three unequal spark packets from the prior pass.

The same hierarchy applies throughout the other scenes: idle glass movement is
one-sixth of the selected travel, control pulls use four degrees rather than
38, and these gestures have longer rests. Idle screens have a narrow brightness
range, fans turn slowly, and cabinet play runs at a quieter pace. Existing room
glow and caption emphasis remain tied to the same highlight state, including
both endpoints of a selected connection and pointer/keyboard previews.

This is a CSS-only motion refinement: no extra media, dependencies, React state
or frame loop. Offscreen, hidden-tab, manual-pause and reduced-motion gates
still take precedence over selection.

Validation: all 13 existing circuit/lifecycle tests and the production build
passed, including checks for all 12 retained asset releases. Eighteen browser
samples over 3.15 seconds confirmed selected lamp cutouts and separate spark
packets while the bar/player gestures used their longer idle periods. After
selecting Bar–Players, twelve samples over 1.97 seconds confirmed zero flying
sparks, the idle lamp track, and the stronger bar/player gestures. Manual pause
removed every diagram animation and hid all transient discharge geometry.
The 390px phone cards also use the same selected/idle split without overflow.
No browser warnings/errors were captured; normal viewport and motion playback
were restored. The local production preview on port 3106 is refreshed.

Evidence in the task workspace: `outputs/sanctuary-business-circuit/` contains
`idle-highlight-desktop.png`, `idle-highlight-phone.png` and timestamped
`idle-highlight-samples.json`. This refinement remains local.


### Readable player gestures and cabinet-facing posture (6 October)

The highlighted players now move through their upper bodies, rather than relying
on tiny wrist motion. Two offset 3.2-second phrases rock the shoulders and heads
through a 12-degree forward lean and 9-degree return, with grounded feet and
52-degree joystick pulls. Idle posture is limited to about one degree over the
existing 8.9-second period. This remains driven by the shared scene highlight,
including both endpoints of a selected supply/payment and hover/focus previews.

Dedicated player silhouettes show the back of the head, nape, jacket collar and
back seams. Their attention and hands face the cabinet. The far arm is layered
behind the body; the near arm remains visible around its side. Other figures in
the diagram retain their previous art. A deterministic two-joint rig calculates
fixed-length arms for a small set of poses once, with the hands anchored to the
actual joystick tips and buttons. Sampled easing limits gaps between interpolated
segments while allowing a readable change of weight. CSS animates transforms
only; no per-frame solver, React update, animated filter or new dependency.
All new pose elements share offscreen, hidden-tab, manual-pause and reduced-motion
gating; their unanimated fallback is the complete neutral pose.

Validation: scoped lint, the 13 existing circuit/lifecycle tests and the
production build passed. A numerical sweep through the sampled rigid transforms
kept the largest joint interpolation discrepancy below 0.30 illustration units.
Twenty real-browser samples over 4.48 seconds showed distinct, staggered poses
through a complete selected cycle. Deselecting restored the 8.9-second idle track;
manual pause removed pose animations and retained the connected neutral figure.
Desktop and 390px phone views were inspected, with no horizontal overflow or
browser warnings/errors. Motion playback and the normal viewport were restored;
local preview on port 3106 is current.

Evidence: `outputs/sanctuary-business-circuit/players-facing-cabinet.png`,
`players-facing-cabinet-phone.png` and `players-motion-samples.json` in the task
workspace. This iteration remains local.


### Mounted controls and restrained player motion (6 October)

This corrects the preceding player pass. Highlighted torso movement is halved
to +6 / −4.5 degrees, and joystick travel to ±26 degrees. Idle motion and timing
remain as before. The two-player cabinet now has individual control plates
sitting on the actual panel plane, with small fasteners, fixed joystick collars
and inset button bases. Shorter shafts pivot inside those collars. The player's
fingers are smaller than the joystick ball so the grip does not hide all the
hardware. Other cabinets retain their existing static controls.

The hardware and arm rig now derive their positions from one `controlStation`
helper, including the button surface; the old offhand target was offset from its
visible button. Joysticks also use the same sampled pose table and phase as the
arms, removing the duplicate CSS angle definitions. This keeps the grip and
shaft in step when selection changes or motion is paused. No new media or
continuous JavaScript work is introduced.

Validation: scoped lint, 13 circuit/lifecycle tests and the production build
passed. Twenty browser samples across 3.81 seconds confirmed fixed mounting
centers, a −4.5 to +6 degree torso range, and less than 0.01 CSS pixel of measured
grip-to-ball-center separation in this desktop sample. Deselecting restored the
quiet 8.9-second idle track; manual pause removed all pose animations. The 390px
phone layout was inspected without overflow. No browser warnings/errors were
captured. Normal viewport and motion playback were restored; local preview on
port 3106 is refreshed.

Evidence: `outputs/sanctuary-business-circuit/mounted-controls-desktop.png`,
`mounted-controls-phone.png` and `mounted-controls-samples.json` in the task
workspace. This correction remains local.


### Foreshortened player arms (6 October)

The rear view now uses a single narrow sleeve stroke per arm instead of a
visible two-joint construction. Players stand closer to the cabinet; their
bodies hide the far reach, leaving short strokes near the controls. Hand markers
remain unscaled and follow the shared joystick/button anchors. The half-strength
body motion, mounted hardware and quiet idle state are retained. Removing the
elbow construction also reduces pose geometry and calculations.

Validation: scoped lint, 13 existing tests and the production build passed.
Desktop motion samples across a full cycle retained the half-strength torso
range and less than 0.05 CSS pixel of grip-to-stick separation. The 390px phone
view has no overflow; no console warnings/errors were captured. Normal viewport
was restored and localhost:3106 refreshed. Evidence: `short-arm-strokes-desktop.png`
and `short-arm-strokes-phone.png` in the task's business-circuit output folder.
