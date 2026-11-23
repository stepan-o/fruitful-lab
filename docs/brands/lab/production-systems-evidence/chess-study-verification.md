# Figure IV — candlelit position study

5 October 2026. Scope: Fruitful Lab `/stepanoskin/production-systems#applications`.
Dedicated worktree: `professional-systems-profile/fruitful-lab`.
Branch: `codex/profile-candlelit-chess`, based on merged Figure III PR #86.

## Result and references

The original sad horse contour, lowered eye and long muzzle are preserved. The
board now has one coherent plane, 64 inlays, mitred walnut rails, continuous edge
moulding, small turned feet and quiet file lettering. Ivory and deep-green pieces
occupy square centres. The knight lifts from c3 to e4, rests and returns.
Detached under-board hatching and floating measurement ornaments were removed.
A brass candlestick behind the army provides a visible, warm source.

Loopforge's current landing was inspected in code and in the browser. Its
reference contribution is source-driven material illumination with occlusion
applied to that illumination; no factory art, red siren, glare streaks or dark
palette were transferred. Sources: `factory-renderer.ts`, `factory-optics.ts` and
`factory-light.ts` from merged PR #85. The existing page materials remain the
visual authority.

[PBRT, Area Lights](https://pbr-book.org/4ed/Light_Sources/Area_Lights), reread
5 October 2026, motivates the bounded finite-source approximation. Three lateral
samples are an illustrative penumbra, not Monte Carlo integration or ray tracing.

## Light and geometry

One orthographic world projects `(x − .26d, 378 − .58d − h)`. The candle source is
`(518, 305, 148)`. Rays intersect the board at height 38 and working surface at
height 0. Shared source movement drives flame, piece shadows and case shadow;
the flame bends about its wick. Contacts remain attached. Wax casts a bounded
shadow around the holder, and the case masks the illumination beneath it.

Static silhouettes use affine shears derived from lateral source displacement.
The moving knight uses two sets of precomputed shadow path poses, instanced in
three visibility masks per receiving surface. Overlapping opaque silhouettes
union within each sample before the illumination is averaged. Lit grain is
masked with the same field. A soft stage mask removes rectangular light-field
boundaries. Curved pieces use sampled contours; in-between poses are interpolated.
This remains a 2.5D editorial approximation, not full mutual 3D ray tracing.

## Validation

- Asset-pipeline tests passed; all 11 retained asset releases verified.
- Full Jest suite: **58 suites, 268 tests passed**. Run in one worker due to host
  memory pressure; this covers the same suite as `npm run ci`.
- Four new geometry tests cover square placement, c3–e4 displacement, ray/source/
  caster collinearity for all sampled poses, receiver intersections, opposite
  flame/shadow response, contact and board/candle construction.
- `API_BASE_URL=http://localhost:8000 CI=1 npm run build` passed, including
  TypeScript and optimized static page generation. Existing middleware naming
  deprecation remains unrelated.
- React review: server components, deterministic geometry, no new client boundary,
  data fetch, event listener, per-frame JavaScript, asset or dependency.

## Browser evidence

Production-build main route inspected at 1440 × 1000, 768 × 1024, 390 × 844,
320 × 760 and the normal 1280-pixel browser width. No horizontal overflow, clipped
scene, broken SVG references or duplicate scene IDs. Reading-size screenshots
show the full board, candle, moving knight and caption. The scenario control
switches Education → Games (`A playable encounter`) and back.

- **420 SVG descendants; 61 animated elements.** The knight and its changing
  shadow shapes were observed at different positions.
- Manual pause: 0 running elements. Keyboard Enter resumes all 61.
- Offscreen at References: 0 running elements. No console errors before the
  local server ended.
- Reduced motion and hidden-document handling are preserved by the shared
  `ProfileMotion` controller and existing lifecycle tests; the new CSS also
  disables animation under reduced motion and print. OS-level reduced-motion
  emulation was not available in the browser interface.
- The early development preview stalled during host memory/swap exhaustion.
  After releasing development/compiler processes, the production page loaded
  and all responsive/interaction checks above completed. The temporary local
  server later ended with SIGTERM before reload, as in the previous task.
  Hosted initial/repeat-load verification is recorded in the PR after deployment.

[Desktop](chess-study-desktop.webp) · [Phone](chess-study-390.webp) ·
[Detail](chess-study-detail.webp) · [DOM/animation report](chess-study-browser-report.json)

## Delivery cost and limits

Production profile HTML: **2,236,455 bytes raw / 454,485 bytes gzip level 6**.
Previous cabinet pass: 1,844,245 / 392,235; change: +392,210 raw / +62,250 gzip.
This deliberate SVG/keyframe cost pays for two receiving planes, finite-source
visibility masks, moving silhouettes and detailed joinery. No new raster bytes,
font, client bundle, canvas, WebGL or animated blur/turbulence filter. Masks and
path interpolation still require paint work; this is not a claim of zero GPU cost.
The scene shares the existing offscreen/hidden/pause lifecycle. Phone frame rates
and field Core Web Vitals are unmeasured; viewport checks are laboratory evidence.
