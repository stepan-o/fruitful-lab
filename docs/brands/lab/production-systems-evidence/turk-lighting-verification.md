# Opening illustration — coherent lighting verification

4 October 2026 · `codex/profile-coherent-light` · base `d780c19`.
Scope: the production-systems opening and its design authority. No other scene,
page content, professional claim, speed preset or accepted support geometry changes.

## Visual review

- [Desktop, 1440px viewport / 2×](turk-lighting-desktop.webp)
- [Cabinet and receiving surfaces](turk-lighting-detail.webp)
- [Phone, 390px viewport / 2×](turk-lighting-390.webp)
- [Raw browser and performance evidence](turk-lighting-browser-report.json)

Inspected desktop and phone captures: the paper stays readable, the gear openings
remain visible, the fixed central-stile support is preserved, and the floor shadow
follows the opened door and overhanging frame. Cooler side shading and fixed bevel
arcs agree with the upper/front-left key. The geometric proxy is deliberately
simple: convex cabinet/belt solids, a planar door, parallel wheel planes and two
hand planes. It is not a complete physical simulation of the engraved figure.

## What changed

`turk-lighting.ts` shares the machine's orthographic depth basis and one incoming
light direction. Rays intersect actual receiver planes instead of using unrelated
screen-space offsets. Seven bounded samples soften floor and overhang shadows;
contact shading remains at the feet. Eleven pierced silhouettes rotate with the
gears, and the hand shadow shares the stamp's exact animation. A single figure
outline is reused for fill, clipping and shadows. No runtime images or SVG filters.

The design contract is [v1.9](../production-systems-design/DESIGN_GUIDELINES.md).
[PBRT's area-light discussion](https://www.pbr-book.org/4ed/Light_Sources/Area_Lights)
informs the soft-edge principle; our server-computed vector approximation uses
neither ray tracing at runtime nor a lighting dependency.

## Validation

- Asset-release test passes. Full Jest suite: **47 suites / 210 tests pass**.
  Five new geometry checks cover source/caster/receiver collinearity for all
  penumbra samples, contact convergence, increasing softness, receiver direction,
  and affine hand projection. Changed files pass ESLint; production build and
  TypeScript pass.
- Required `npm run ci` first hit five timing failures in unrelated Pinterest Fit
  and Loopforge tests under parallel load. Reran the complete suite with
  `npm run ci:test -- --runInBand`, then `API_BASE_URL=http://localhost:8000 CI=1
  npm run build`; both passed. No test timeout or product code was weakened.
- Chromium production checks: 1440 / 768 / 390 / 320px, eight scenes, no overflow,
  duplicate IDs, axe violations or page/console errors in the final full pass.
  The initial preview omitted the runtime API variable and produced a prefetched
  navigation error; restarting with the repository's API setting resolved it.
- All **47 animations** receive .55 / 1.1 / 3× together with zero phase spread.
  Gear/shadow transforms agree at 0, 1200, 1820 and 2280ms; both hand transforms
  agree. Pause remains paused through pace changes. Reduced motion removes all
  animations and disables pace; restoration and print restoration retain Fast.
- Keyboard and touch controls, persistent pause, offscreen suspension, scenario
  selection and source disclosures pass. No JS retains eight still scenes and
  hides the motion control. A4 print remains two pages.
- The agent-browser CLI is unavailable on this host; the installed Playwright
  driver and Chromium provide the browser verification fallback.

## Performance bounds

Production local-browser observations, **not field Core Web Vitals or hardware
certification**. The shared developer host had other work running. Page-load
measurements use DPR 1; artwork/frame probes use DPR 2. No throttling.

- Compressed HTML: **303,927 bytes**, versus 297,033 in the previous support pass:
  **+6,894 bytes / +2.32%**. No new client boundary, client logic, dependency,
  raster request, font, blur or per-frame JavaScript. The additional moving work
  is eleven small wheel shadows and one clipped hand silhouette.
- Observed cold LCP **1,048ms**, warm **552ms**, CLS **0**. Other loaded resource
  payload: 297,230 bytes. Different host load means earlier timing numbers are
  not a controlled speed comparison.
- Medium/Fast 180-frame samples at 1440 and 390px: median **16.7ms**, p95 **33.4ms**;
  3–7 intervals exceeded 34ms. Scene node count stayed at **1,613**.
- Paired Fast probe hides only the new shadow groups, then restores them, twice
  per viewport. Every 120-frame sample has a **16.7ms median**. Shadow-on p95 spans
  **16.7–33.4ms**, shadow-off **16.8–33.3ms**. Shadow-on samples have 0–2 intervals
  above 34ms, shadow-off 0–1. Main-thread task samples overlap substantially; this
  short run does not establish a precise incremental cost or a guaranteed 60fps.

Raw measurements retain the slower samples. Real low-end mobile hardware and
other browser engines have not been measured in this pass. The bounded SVG
approach keeps the added work small without claiming universal performance.
