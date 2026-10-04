# Watch-finished cabinet movement — verification

4 October 2026 · `/stepanoskin/production-systems`

## Scope and references

The opening’s left chamber now contains a five-wheel transmission with shaped
silver bridges, brass wheels, inset jewel bearings, a finished barrel and fine
plate graining. The barrel’s separate winding ratchet and sprung click occupy
the fixed front plane. A larger flange exposes the bearing around the existing
conveyor takeoff. The source-derived Turk, conveyor, paper register and outcome
emissions retain their accepted composition and behavior.

The official [Patek Philippe 30-255 movement](https://www.patek.com/en/collection/movements/30-255)
photograph was visually inspected for bridge shapes and the material hierarchy.
Its [hand-finishing reference](https://www.patek.com/en/manufacture/artisans-of-time/hand-finishing)
informs the engraved treatment. These are credited in the public artwork notes.
The layout is an original editorial mechanism, not a copied caliber, fabrication
plan or claim about an employer’s architecture. No manufacturer photography,
logo, font, dependency or texture image enters the runtime page.

## Construction and motion

- Five module-one wheels: **58 / 34 / 44 / 56 / 44 teeth**. Their centers derive
  from tangent pitch circles, and all tooth tips clear the cabinet opening.
  Non-mating wheels have clearance. Sampled involute flanks use a common 20°
  pressure angle; static phases put teeth opposite spaces at each contact.
- Four external meshes preserve clockwise output at **(322, 415)**. Tooth-count
  ratios give equal and opposite pitch-line velocities. The output completes
  288° per 2.4 seconds, matching the accepted chain and drum speed. The flange,
  lower sprocket, vertical chain, compound jackshaft and upper chain form one
  visible route to the conveyor’s right head drum.
- Individual CSS animations complete whole revolutions, so the differently
  shaped spokes do not jump at tray boundaries. Browser checks sample nine
  times from 0 to 24 seconds, including either side of the output’s 3-second
  revolution boundary. All five rendered rotation angles agree with the model.
- All **28** hero animations pause together. Reduced motion has **zero** running
  animations and leaves all five wheels visible. Offscreen suspension, persisted
  manual pause and keyboard control pass.
- All ten outgoing specimens still match the arriving register row and emitting
  smoke verdict. Top/return travel remains equal and opposite; emission opacity
  stays 0.96 at 240, 1000 and 2100 ms, then dissolves.

## Validation

- Required Lab CI passed: **45 suites / 195 tests**, asset pipeline checks,
  four retained releases, TypeScript and optimized production build. This
  includes three new geometry tests for contact/clearance, phase/velocity and
  output coupling. Final spoke-path correction received a fresh production
  build, focused ESLint and complete browser verification. Whitespace check passed.
- Production Chromium at **320, 390, 768 and 1440 CSS px**, DPR 1: eight scenes,
  no page overflow, duplicate IDs, browser errors or reported axe A/AA /
  best-practice violations. Automated checks do not establish full conformance.
- Keyboard and touch scenario selection, source disclosure, pause persistence,
  no-JS stills and print checked. No-JS retains all eight scenes and hides the
  inactive motion control. All source links remain ordinary readable HTML.
- Visual review covered the entire opening, an enlarged mechanism, phone still,
  stamping and rising-smoke phases. A malformed spoke curve found in the first
  browser log was corrected; the final report contains no errors.
- React review: deterministic server-rendered SVG, static geometry, existing
  motion controller, no per-frame JS or new hydration boundary. Verification
  used the installed Playwright/Chromium harness because agent-browser CLI is
  unavailable locally.

## Delivery observations

Unthrottled local production Chromium: cold LCP **1696 ms**, warm LCP **572 ms**,
CLS **0.000**. Local laboratory observations; actual-phone and field performance
are unmeasured. Compressed document **280,470 bytes**, up 13,788 bytes (5.2%) from
the conveyor pass’s 266,682. The extra server-rendered geometry replaces three
coarse gears with five detailed wheels and their fixed supports. Zero raster
content-image requests or added fonts. Encoded resource bodies total 295,793 bytes;
this is a body-size observation, not a cached-transfer measurement.

[Browser report](turk-clockwork-browser-report.json) ·
[Wheel phases and lifecycle](turk-clockwork-motion.json) ·
[Conveyor and outcome regression](turk-clockwork-conveyor-regression.json)

## Production captures

Desktop and phone show reduced-motion stills; the detail samples motion at 1.2 s.

![Desktop opening](turk-clockwork-desktop.webp)

![Phone opening](turk-clockwork-phone.webp)

![Five-wheel movement and conveyor takeoff](turk-clockwork-detail.webp)
