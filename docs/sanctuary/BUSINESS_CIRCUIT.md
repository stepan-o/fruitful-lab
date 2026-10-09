## 8 October: one work across the contemporary routes

Chapter 2 now follows the commercial reach of one work through Sony’s PS5
launch economics and CD PROJEKT’s Cyberpunk catalog agreement. These cases
replace the previous generic survey. See CHAPTER_TWO_MANUSCRIPT.md for the
continuous argument and its evidence boundaries.

The opening circuit keeps Cyberpunk 2077 and CD PROJEKT RED fixed across PC
purchase, PlayStation, Xbox and NVIDIA. Both consoles offer purchase/catalog
choices with separate studio and publisher responsibilities and a licensing
agreement with the independent publisher. NVIDIA retains a purchased PC copy:
Cyberpunk’s console catalog entitlement does not provide the PC edition.
The market map also opens on Cyberpunk and then permits broader comparisons.
This supersedes the older Forza, Spider-Man and Rockstar overview choices below.
Their historical implementation notes remain for context, not current behavior.

Original store, console and player illustrations now identify the same product.
No new image downloads, animation loops, dependencies or runtime requests were
added. Desktop and mobile selection, paired highlights, reduced-motion and
offscreen animation controls retain the existing contract.

## 7 October: hold the cloud game fixed

The overview’s Cloud play tab uses Forza Horizon 5 in both access modes:
Steam purchase or PC Game Pass catalog membership, each run through GeForce NOW.
Playground Games, Xbox Game Studios, the cloud provider and its computing fee
remain fixed. Only the access service and related funding/readouts change.
NVIDIA documents both routes; Steam confirms the title’s production credits.
The dedicated cloud chapter retains its separate Cyberpunk local/cloud
comparison, where the store purchase remains fixed and computing changes.
No account, licence or save-progress transfer is implied by the selector.

Cyberpunk was not retained for the overview toggle because its announced Game
Pass inclusion covers Xbox console and Xbox Cloud Gaming, not PC Game Pass.
That entitlement does not provide a PC copy for NVIDIA. Comparing its purchased
PC copy with its catalog offer would also change the computing provider.
Source: [Xbox’s 3 March 2026 announcement](https://news.xbox.com/en-us/2026/03/03/xbox-game-pass-march-2026-wave-1/),
read alongside NVIDIA’s PC entitlement rules linked below.

Sources: [NVIDIA’s Forza announcement](https://blogs.nvidia.com/blog/geforce-now-thursday-forza-horizon/),
[current PC Game Pass support](https://nvidia.custhelp.com/app/answers/detail/a_id/5462/kw/basics),
[Steam title and credits](https://store.steampowered.com/app/1551360/Forza_Horizon_5/).
Checked 7 October 2026. No new media; existing original racing art is reused.

## 6 October: publisher and act split

Current narrative authority: [Business act](BUSINESS_ACT.md). The overview now
contains this circuit and four paragraphs. The seven-layer detail, comparison
table and source-backed charts move into dedicated platform/cloud chapters.
The PC purchase route has five participants and four exchanges; all linked
selection mechanisms highlight both endpoints. Rockstar development funding
is internal, not an assumed independent royalty contract. On small screens,
five participants become legible cards with explicit relationship labels.
Original planning, release, store and player scenes use the same projection.

# The businesses behind an evening of play

5 October 2026. Chapter 2, `studio-to-screen`. Local visual revision following
PR #87’s editorial pass; not an owner sign-off on the illustration.

## Argument

How entertainment reaches its audience helps determine how it must earn its
living. The opening instrument makes that statement concrete: who pays for
which work, who receives a payment, and what each business needs to sell next.
Equipment location alone cannot carry the chapter’s argument.

Four selected arrangements share a stage. The arcade comes first, continuing
chapter 1. PC purchase and cloud play keep Cyberpunk 2077 and Steam distribution
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
- PC: Cyberpunk 2077’s official Steam listing establishes developer and publisher;
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

### PC purchase — scene craft pass (6 October)

The PC purchase arrangement receives four distinct compositions while retaining
its selected supply/payment relationships. The same Larian and Steam scenes are
also used in Cloud play, where those businesses and the game purchase remain
constant. The cloud player’s existing monitor now uses the same original game
scenery too. The purchased-PC room has its own `pc-home` scene key, so its local
tower is not silently added to the cloud receiving-device illustration.

**Larian / production.** A seated artist faces an editor viewport. A large concept
sheet, a branching design board and a strip of storyboard panels establish the
work surrounding the image on screen. Paper, a pencil and a mug sit on a supported
desk. The screen combines original fantasy scenery with editing guides and a
cursor; selection makes the cursor's travel and wireframe overlay more visible.
The rear-facing head and short keyboard/mouse gestures keep the person directed
toward the work. There is no claim to depict a particular Larian office or tool.

**Steam / distribution.** The store is an illustrated digital service, not another
desk or a purported Valve office. An original storefront has featured scenery,
three distinct miniature covers, navigation, a purchase affordance and a separate
download strip. Three delivery bays sit beneath the display. Selection brightens
the featured work and runs the download indicator; idle movement is limited.
This separates finding/buying a copy from the machinery delivering it. Neither
the drawn interface nor its invented catalog is represented as Steam's exact UI.

**PC supplier / equipment.** A technician works on a motherboard beside an open
case on an assembly bench. The case has a frame, front fans, a side motherboard,
expansion card, cable and mounting feet. Tools hang from a pegboard; a taped carton
on the floor suggests the separate physical sale. The screwdriver turns about its
contact point, while the chassis stays still. Selection increases tool activity
and fan speed. These illustrate assembly and testing, not a specific manufacturer,
benchmark or measured relationship between load and rotation speed.

**Player / use.** The same fantasy scene now fills a game viewport in a domestic
room. A rear-facing seated player uses a keyboard and mouse; headphones, a rug,
small task lamp, framed print, plant and night window distinguish the home from
production. A normally sized tower sits beneath the desk. Head turns and finger
taps are bounded; the cursor, tiny screen fire and slowly drifting shaped clouds
carry most of the life. Selecting the player increases activity without rocking
the entire body or moving the surrounding reading surface.

**References and limits.** Visual construction follows this document's approved
arcade rooms and the journey/world diptych: one projection, dark teal recesses,
brass edges, restrained paper/wood colors and small warm lights. The existing
Steam product and settlement sources above establish the business roles; the
geometry supplies an original illustration of them. Concept drawings, cover art,
room details and screen scenery are invented. No photograph, publisher screenshot,
logo, asset download or external font was added. Public provenance and prose do
not need another explanation of the visible artwork.

**Motion and delivery.** New activity uses CSS transforms/opacity beneath the
existing `useLivingPlate` gate. Selection changes shared room variables; there
is no JavaScript frame loop, animated filter, new dependency or recurring fetch.
Still states preserve each composition. Both desktop and mobile instances inherit
manual pause, offscreen/document visibility and reduced-motion behavior.

Validation: scoped ESLint, 13 circuit/lifecycle tests and the production build
passed; all 12 retained asset releases verified. The initial build caught a
chair-foot tuple typing error, corrected before the successful final build.
Desktop plus 320, 390 and 768px viewport checks found no page overflow. Visible
phone controls meet the existing 44px minimum. Keyboard focus previews the correct
pair, and manual pause removes all scene animation. The existing lifecycle tests
cover reduced motion and visibility; OS preference emulation was not performed.

Twelve browser samples over 7.78 seconds verified distinct editing/download poses
and restrained unselected activity. Three further production screenshots across
3.89 seconds show the selected assembly and player gestures. The hidden desktop
copy has no running animations on phones, and the hidden mobile copy has none on
desktop. Browser warnings/errors were empty. Normal viewport and motion-on state
were restored; the production preview is running on localhost:3106.

The production chunk containing this instrument, its data and the retained
business-layer explanations is 79,016 bytes / 24,136 bytes gzip. This is the whole
chunk, not an incremental payload or field speed measurement. No runtime media
was added; field performance remains unmeasured.

Evidence in the task workspace’s `outputs/sanctuary-business-circuit/`:
`pc-scenes-desktop.png`, `pc-scenes-phone.png`, `pc-motion-samples.json`,
`pc-focus-samples.json`, and `pc-selected-frame-{0,1,2}.png`. This pass remains
local for visual review.


### Participant roles, recognizable stores and active play (6 October)

This revision supersedes the PC craft-pass descriptions above where they differ.
The participant title has a separate business-role field, visible in each room
caption and detail heading, and included in the supply/payment endpoint labels
and accessible names. This applies to Arcade, PC purchase, Cloud play and Netflix.
The action beneath the name still explains what that participant does.

The opening now uses **Cyberpunk 2077** throughout chapter 2’s diagram, prose,
seven-layer disclosure and three-route comparison. Its first diagram caption
introduces it as a futuristic action adventure. CD PROJEKT RED is labeled as the
studio; Steam as the storefront; the PC store as the retailer; and the player as
the customer. Valve is introduced in the operating explanation, not the title.
The BG3 promotional figure is removed from this chapter; BG3’s later comparison
and its other assets remain in place. One bounded official Night City gallery image replaces it through the existing
context asset pack; its public source/use record explains its analytical role. A license’s role is explained using the chapter’s Dune adaptation
example, without inventing a current Cyberpunk royalty arrangement.

Sources checked for the substitution:

- [Steam listing](https://store.steampowered.com/app/1091500/Cyberpunk_2077/)
  identifies the game, developer and publisher.
- [NVIDIA’s launch support](https://www.nvidia.com/en-gb/geforce/news/cyberpunk-2077-rtx-dlss-out-now/)
  explicitly includes Steam copies alongside GOG and Epic.
- [NVIDIA’s March 2026 notice](https://blogs.nvidia.com/blog/geforce-now-thursday-virtual-reality-update/)
  excludes Cyberpunk from basic/free rigs from 1 April 2026. The final chapter
  paragraph now distinguishes this from the general fallback after premium hours.
- [PlayStation’s listing](https://store.playstation.com/en-us/product/UP4497-PPSA03974_00-0000000000000CP1/)
  identifies one-player use and distinct purchase/catalog offers. The previous
  BG3 multiplayer condition was not carried into the replacement.

**Steam.** A floating browser page replaces the room and equipment console.
Browser chrome, an address bar, navigation, search, featured game, cover tiles
and an Add to cart affordance identify a website. Original city scenery provides
a genre reference for the featured game; no game screenshot, Steam logo or exact
interface is reproduced. The name and address identify the analyzed storefront.
Selection brightens the featured panel and animates the small delivery strip.
The page is an illustrative arrangement, not a recorded price or current UI.

**Equipment retail.** Display monitors and a laptop, a modest desktop tower,
boxed stock and a counter with a payment terminal identify a computer store.
There is no technician, hand assembly or oversized cooler. The role is retail:
it pays for stock, premises, staff and support and earns on equipment sales.
Consoles can occupy the equivalent hardware layer, but this selected route buys
a PC; Sony and Microsoft’s additional platform roles are explained separately.

**Player.** The seated body remains stable. One elbow is the pivot for a short
mouse gesture; the forearm, hand and mouse are in the same transform group so
contact cannot drift apart. Rain streaks pass behind a clipped window pane;
the room and frame remain dry. Two staggered screen-local explosions grow,
throw a few flecks and cool out, with long quiet gaps. The original city scene
is shared between the editing viewport, store, local play and cloud screen.
It is a genre illustration, not claimed gameplay footage.

Motion strength follows selection. Rain, mouse travel and screen bursts remain
quiet at rest, stop with the existing visibility/motion gate and respect reduced
motion. All new animation uses transforms and opacity. No per-frame React state,
animated filter, external font or dependency is introduced. The one gallery image
is lazy loaded in three hashed WebP sizes; it is not part of the animated SVG.

**Verification.** Focused circuit, chain, living-plate, exhibit and visual-source
checks passed (5 suites, 29 tests), along with lint and the production build.
The asset check retained all 13 releases. The Night City derivatives are 14,046,
42,888 and 109,820 bytes. Browser review covered desktop, 320/390 px phones and
768 px tablet layout, selected/idle motion, the global motion pause, source
credits and image enlargement. Wider spacing between branched supply lanes
keeps long role labels separate on tablets. Local preview remains on port 3106.

**Player furniture refinement (6 October).** The small desk lamp now stands
clear of the monitor, with a rounded shade, articulated arm and weighted base.
The player has a racing-style bucket chair: high back, shoulder wings, headrest
openings, restrained rust upholstery, stitched bolsters, armrests and a five-leg
caster base. The studio keeps its ordinary office chair. Both refinements are
static geometry and add no animation work or media requests.
Rain is clipped to the exposed glass beneath the raised blind; the blind has an
opaque backing and is drawn in front of the weather. The sill and frame remain dry.

### Selected PC scene activity — 6 October 2026

The spotlight now reveals a distinct, larger action in each PC scene. It is
triggered by the same participant, delivery and payment selection state, including
both ends of an exchange. Bodies and furniture keep their established geometry.

- Studio: the editing playhead scrubs forward, backs up for a revision, and
  resumes. Review panels on the wall take turns lighting; the work screen spills
  a little light onto the desk. The original coastal driving scene also carries
  the editing wireframe, matching the other game's editing viewport.
- Publisher: staggered schedule bars fill beneath a moving date marker, then the
  campaign proof lights and its review marks appear. This is an illustrative
  release workflow, not a representation of a company's internal software.
- Storefront: the cursor moves from browsing to Add to cart; the button responds,
  the delivery bar fills, and a completion mark appears. The sequence is confined
  to the original website illustration. It does not depict current purchase UI
  or a measured download speed.
- Equipment retailer: showroom displays alternate their emphasis while running
  original demo scenes; the counter terminal briefly confirms a transaction.
- Player: road markings approach in perspective and the car makes a modest lane
  correction. Screen action casts a brief warm reflection across the desk. The
  existing connected mouse gesture and rain remain; no extra torso movement.

All new motion uses SVG with CSS transforms and opacity, without new media,
filters, runtime dependencies or per-frame React state. The large actions exist
only while highlighted; clearing the spotlight restores the complete static
composition. Offscreen/document-hidden scenes and the global motion preference
pause playback. OS reduced motion disables it, and responsive hidden duplicates
remain non-animated. These are visual illustrations, not measured process times.

Validation for this pass: lint, all 59 suites / 279 tests, asset checks and the
production build passed. The rebuilt local route returns HTTP 200. Final browser
motion sampling could not be completed: the in-app browser control connection
repeatedly timed out on both the existing tab and a fresh tab. Desktop/mobile
motion and screenshot review remain unverified for this pass.


## 6 October: console routes replace the self-publishing comparison

The overview now offers Arcade, PC purchase, Xbox, PlayStation, Cloud play and
Netflix (console tabs moved directly after PC purchase on 7 October 2026). Separate development/publishing boxes identify work, not a claim that
the two companies are independent. The dedicated cloud chapter keeps its
Cyberpunk local-versus-GeForce NOW comparison; it has no console tabs.

Xbox follows Forza Horizon 5: Playground Games develops, Xbox Game Studios
publishes, Game Pass supplies catalog access/downloads, a retailer sells the
console, and the subscriber plays on their Xbox. PlayStation follows Spider-Man
2: Insomniac develops, Sony publishes, PlayStation Store sells/delivers, a retailer
sells the console, and the customer plays on PS5. Studio, publisher and platform
are internal to Microsoft/Sony respectively. No private allocation, royalty or
store commission within either group is inferred.

The interface names access and computing separately. Both console tabs have
visible, source-linked cloud alternatives. Buying versus subscribing does not
determine where a game runs. These specific routes are checked against official
US product offers on 6 October 2026, not a universal catalog or plan comparison.

### Original console artwork

- Studios retain the development desk and editing timeline. A miniature hill
  road/racing car or a city/rope-swing scene identifies the selected genre.
- Publishers retain a release schedule and campaign proof, with matching
  original genre art. Neither workplace is a reconstruction of a real office.
- The Game Pass and PlayStation Store panels are simplified website
  illustrations, with distinct install/buy actions and selection-gated delivery
  animation. Official sites inform the business role, not an exact UI trace.
- Console stores use demonstration shelves, two product silhouettes, a gamepad,
  boxed hardware and a checkout counter. Series X top vents and PS5 pale curved
  plates make equipment recognizable in Sanctuary’s brass/teal material system.
- Console players sit on a sofa facing a wall television; short forearms meet a
  controller. Screen motion, thumb taps, indicator lights and rain enliven the
  selected room. Genre scenes are original geometry, not official game art.

References are carried by console-business-circuits.ts: Xbox’s Forza, Game Pass
and Series X pages; Microsoft acquisition history; PlayStation’s Spider-Man 2
product/store and PS5 pages; Sony’s Insomniac acquisition announcement; the
official Xbox Cloud Gaming and PlayStation cloud-streaming explainers. These
support product identification and business roles. They are not asset licences
or evidence of any private revenue allocation. No proprietary raster asset is
added by this pass.

The two new five-party arrangements inherit paired endpoint highlights, keyboard
controls and the mobile card layout. Screens animate with transform/opacity CSS;
useLivingPlate pauses motion offscreen/hidden and respects global/OS preferences.
Hidden responsive duplicates remain animation-free. No new animation loop,
image download, runtime library or external font is introduced.

### Console revision validation

Full frontend CI passed: 59 suites / 282 tests, asset-pipeline tests, validation
of 14 retained media releases, and the production build. ESLint and diff checks
passed. Tests cover every supply/payment endpoint pair on Xbox and PlayStation,
access-versus-compute labels, visible cloud references, and the two-route
Cyberpunk-only comparison. The local production preview was rebuilt/restarted.

All ten new/reused console vignettes were rendered directly from the SVG component
and inspected in a static contact sheet at
`outputs/sanctuary-business-circuit/console-art-still.png` in the task workspace.
This is artwork inspection, not a browser screenshot or animation verification.
The in-app browser inspection connection continued to time out on both the
existing tab and a fresh tab, so final responsive layout and live motion checks
for this console revision remain unverified. No claim of measured Web Vitals.


### Access and computing revision — 7 October 2026

The main order is Arcade, PC purchase, PlayStation, Xbox, Cloud play, Netflix.
Within Cloud play, Purchased game is the initial selection. Catalog membership
switches to supported Forza Horizon 5 via PC Game Pass + paid GeForce NOW.
A route switch resets both this sub-selection and the highlighted payment, so
five-party selections cannot leak into four-party routes. The dedicated cloud
chapter keeps its original same-game Cyberpunk local/remote comparison.

PlayStation has its own original storefront composition, referenced against
`https://store.playstation.com/en-us/pages/latest` on 7 October 2026: light layered
navigation, wide hero, separate title/action strip and game cards. Steam retains
its dark compact storefront. These are analytical miniatures, not live storefronts
or captured offers. Existing selection, viewport and reduced-motion gates apply.


### Comparable role descriptions — 7 October 2026

`business-role-copy.ts` supplies shared role, pays, earns and next descriptions
for the four video-game routes and their local/cloud variants. Identical roles
use identical wording: group-funded studios, purchase-funded publishers,
hardware retailers, storefront operations and the player's reason to return.
The combined studio/publisher retains both responsibilities in one box.

Differences in catalog revenue, store ownership, purchased versus catalog
access, and owned versus rented computing remain explicit. Company/game names,
route examples, transaction explanations and source limits retain their context.
This is an editorial consistency rule: a wording difference should indicate a
business difference, rather than variation for its own sake. Arcade and Netflix
are unchanged. No illustration, selection, payment-routing or media contract
changed. The chapter 2 edit also reaches the dedicated same-game cloud comparison
through the shared records.

Validation for this copy pass: edited data modules passed ESLint; all 16
existing circuit tests passed; asset integrity and production build passed.
Browser checked the studio and player readouts across all four game tabs, plus
the longest cloud-player copy at 390px without horizontal page overflow. Normal
viewport restored; no browser errors observed. Preview refreshed on port 3106.


### Cloud access and computing correction — 7 October 2026

All game arrangements now retain five roles: studio, publisher, store/catalog,
computing supplier and player. CD PROJEKT RED appears as both studio and
publisher, with a clear same-business funding explanation. The local Cyberpunk
comparison retains those roles; the catalog cloud version retains Playground
Games and Xbox Game Studios separately. This supersedes the earlier combined
studio/publisher and four-box cloud descriptions above.

The former Steam → NVIDIA “Supported store copy” edge mixed a technical
integration with a customer offer and misleadingly implied resale. It is removed.
Steam → player supplies game access; NVIDIA → player supplies remote computing.
The player pays each separately. PC Game Pass catalog access follows the same
two-branch structure. Developer opt-in, account sign-in and supported-game
conditions remain in the source/limits explanation, not a fictitious sale edge.

The upper route layout now derives its raised branch from the actual endpoints,
including both cloud modes. Payment defaults use each model's declared selection.
Paired highlights therefore illuminate Steam + player for game access and NVIDIA
+ player for computing. Tests cover both sides and switching catalog/purchase.

Verified against [Valve Cloud Play](https://partner.steamgames.com/doc/features/cloudgaming)
(purchases and publisher payouts unchanged) and
[NVIDIA FAQ](https://www.nvidia.com/en-us/geforce-now/faq/)
(games accessed through stores; ownership verified by sign-in). No private
provider/publisher payment is inferred. Existing scene artwork and motion gates
are reused; no media bytes, dependencies or new continuous effects were added.

Validation for this correction: focused circuit suite passed (17 tests); scoped ESLint passed; asset checks and production build passed. Rebuilt and restarted the local preview on port 3106. Browser inspection confirmed separate game-access and computing branches, the corresponding participant highlights, and the five roles in both purchased-game and catalog cloud routes. At 390 × 844, the labels stack without horizontal overflow. Screenshot: `/home/stpn/Documents/Codex/outputs/sanctuary-worlds/cloud-direct-access.jpg`. Local review only; no commit, push or PR.


## Console purchase and catalog alternatives — 7 October 2026

PlayStation and Xbox now have the same Game access selector as Cloud play.
Spider-Man 2 remains fixed across PlayStation Store purchase / PlayStation Plus
Extra catalog download; Forza Horizon 5 remains fixed across Xbox Store purchase /
Game Pass download. The console is owned hardware in both modes. Studio,
publisher and hardware roles remain fixed; publisher income, access provider,
player terms, supply labels and payment explanations change with the offer.
The miniature storefront switches its identity and action to match.

Catalog access lasts while membership is active and the game remains included.
Availability is title-, tier- and region-specific. Neither selector implies that
every game is in a subscription catalog. Forza's purchase retains separate
online-console-multiplayer requirements. Sony's Extra example uses a download;
the existing cloud link describes a different computing route. Internal content
funding is schematic, not an invented per-session royalty or transfer price.

Sources checked 7 October 2026:
- Sony's [US Spider-Man 2 listing](https://store.playstation.com/en-us/concept/10002456)
  offers purchase and PlayStation Plus Extra Game Catalog access.
- Microsoft's [Forza Horizon 5 page](https://www.xbox.com/en-US/games/forza-horizon-5)
  offers an individual purchase and inclusion in Game Pass, with console online
  multiplayer terms stated separately.

Tab order is preserved. As of 8 October, PlayStation, Xbox and Cloud play all
start with Purchased game. Changing tabs resets to that common comparison point;
Catalog membership is an explicit alternative on each. Dedicated Cyberpunk
local/cloud comparison remains focused on the purchased game. Assets and gated
animation geometry are reused; no continuous work or media is added.

Validation: 20 circuit tests passed; scoped ESLint, asset checks and production build passed. Browser verified both console access modes, keyboard activation, and 320/390/768-pixel layouts without horizontal overflow; access buttons remain at least 44 pixels tall. Store artwork and payment explanations switch with the offer. React review: static variant data, derived active model, memoized scene reuse, no added effects, requests or animation loops. Preview rebuilt on port 3106. Screenshots: `/home/stpn/Documents/Codex/outputs/sanctuary-worlds/console-access-desktop.jpg` and `console-access-mobile.jpg` in the same folder. Local review only; no commit, push or PR.

Terminology correction (7 October 2026): use “Published release” for the publisher-to-store/catalog supply in every game arrangement. The previous “Catalog release” label implied a different edition or production release. Purchase and catalog membership are different access offers for the same game; those differences belong in the access and payment labels. Joining a catalog can occur at a different date, but this diagram does not depict a separate build or launch.

Release-label validation: all 20 existing circuit tests and the production build passed. Browser confirmed Published release in PlayStation, Xbox and cloud catalog modes. Port 3106 restarted with the correction. Local review only.


### Reader orientation — 8 October 2026

The chapter-2 overview now has a compact introduction above its tabs. It states
what comparing arrangements reveals, how scene/exchange selection works, and
that the boxes separate roles which one company can combine. These are selected
offers; a native anchor links to the later game-first market map for compatible
combinations. This introduction is omitted from the dedicated local/cloud
comparison, where that second diagram does not exist. No interaction, animation
or asset-delivery contract changes. The chapter opening first establishes game
access and computing as separately supplied needs; Steam is introduced when its
store is used in the next paragraph. See CHAPTER_TWO_MANUSCRIPT.md.

### Consistent access defaults — 8 October 2026

Xbox now opens on the same Purchased game option as PlayStation and Cloud play.
Its earlier catalog default was a narrative choice, not a difference in available
models. Switching tabs resets to purchase; selecting Catalog membership updates
the store, publisher income and player terms together. The cloud catalog variant
now takes its production/funding data explicitly from Xbox’s catalog variant, so
a change to the console default cannot turn catalog funding into sales revenue.
