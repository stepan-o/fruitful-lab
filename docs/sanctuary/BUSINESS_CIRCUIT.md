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

Original SVG cutaway vignettes sit on a single engraved foundation: cabinet
assembly, an operator’s workshop, a bar and its players. Modern selections
replace the stations with a development desk, a storefront/catalog, computing
or network equipment, and the audience’s room. The architecture is an ordinary
workshop/interior vocabulary; Sanctuary’s brass edges, teal depth, ink cuts,
muted materials and focal lamps connect it to the earlier illustrations.

Names are HTML controls, not tiny text embedded in the artwork. Teal upper paths
connect the provision of work, equipment and access. Brass lower paths identify
three payments; selection highlights one and reveals its explanation. Selecting
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

CSS owns the small screen flickers, lamp changes, reels/fans and selected money
trace. `useLivingPlate` stops them offscreen, in a hidden document, with global
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
