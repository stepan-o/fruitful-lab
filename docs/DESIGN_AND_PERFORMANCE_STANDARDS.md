# Fruitful Lab — visual quality and performance

Shared requirement established by the owner, 3 October 2026. Applies to every
project under Fruitful Lab, including sandbox presentations, Stepanoskin,
Loopforge experiences and separate brand apps. Existing projects inherit this
acceptance standard when changed; this document does not claim they already pass.

## The requirement

Make the work strikingly beautiful, quick to appear, responsive to every action
and comfortable on a phone. Richness and speed are one design problem. A polished
desktop scene that overwhelms mobile hardware or interrupts reading is unfinished.
Each brand keeps its own visual identity; this is a shared quality bar, not a
requirement to reuse Sanctuary's dark palette or fantasy imagery.

## Design for meaning

Compose a recognizable first impression. Each illustration, animation and
interactive instrument must explain, establish a world or guide attention.
Captions add context that the image cannot supply by itself. Diagrams show a
specific relationship and state their assumptions; controls should reveal a
useful comparison. Keep reading surfaces steady and visual layers coherent.

Add visuals wherever they improve understanding or recognition. An authentic,
properly sourced logo can establish a familiar company faster than its name in
a paragraph. Use that recognition to introduce an argument, not to decorate
empty space. Compose original explanatory graphics around visual citations,
preserve the marks themselves and keep each addition within the delivery budget.

Authentic visual citations and original graphics can coexist. Identify source
material, preserve creator notices, record its publication basis and label
reconstructions. A new rendering or different style is not automatic legal
clearance. See the project-specific media review; do not inherit a publisher's
permission from an unrelated project. Keep copyrighted game assets out of our
own games unless that reuse has a separately established basis.

## Delivery contract

- Optimize before publication; keep source masters out of runtime deployments.
  Use responsive dimensions, modern formats, explicit image sizes and truthful
  `sizes` values. Keep a readable inspection variant for interfaces.
- Use content-hashed immutable files and versioned manifests. Publish files,
  verify integrity, then atomically move a short-cached pointer. Retain prior
  release files for active caches; remove disputed media through an explicit
  removal/purge plan, not routine garbage collection.
- Deliver only the active page/chapter's content and metadata. Preload only
  immediately visible critical media. Lazy-load later figures and mount large
  inspection images on demand. Do not preload an entire essay or media pack.
- For a new illustrated reader route, target ≤350 KB of initial image payload
  on a typical phone and ≤800 KB on desktop. These are project budgets, not web
  standards. Record the viewport, device-pixel ratio and actual chosen files.
  Larger exceptions need an explicit visual/readability reason and a measured
  tradeoff in the PR; no additional approval ritual is implied.
- Reserve media layout dimensions. Cache bytes, not personalized responses.
  Avoid unnecessary libraries, hydration, data serialization and duplicate
  image transforms. Measure compressed production delivery, not dev bundles.

## Motion and interaction

Use precomputed geometry and transform/opacity animation where suitable. Keep
continuous canvas effects within a shared frame/pixel budget (Sanctuary targets
30 fps and caps its drawing resolution). Stop work when offscreen or the document
is hidden. Respect reduced motion and a persistent manual pause; still states
must remain complete. Avoid per-frame React state updates and large animated
blur/filter surfaces. Sound requires user activation and has an independent mute.

## Mobile and accessibility

Review at 320, 390 and 768 CSS pixels as well as desktop. No accidental horizontal
page overflow, obscured controls or loss of meaning. Touch controls should have
at least a 44 × 44 CSS-pixel activation area. Support keyboard operation, visible
focus, semantic labels and dialog dismissal/focus restoration. An intentionally
scrollable image inspector is acceptable when clearly indicated; the surrounding
page must still fit. Keep prose readable, avoid autoplay audio and preserve
meaning in reduced-motion and sound-off modes.

## Evidence required in a visual PR

Record a production build, desktop and phone screenshots, representative keyboard
and touch interactions, reduced-motion behavior, responsive image selection and
cold/warm loading observations. Check the actual main route, not just an isolated
component. Test the whole reading/interaction path, including dialogs and links.
A Lighthouse score or fast localhost response alone does not establish field speed.

Target Core Web Vitals at the **75th percentile of real visits**, evaluated for
mobile and desktop separately: LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1. These are
[Google's good-experience thresholds](https://web.dev/articles/vitals), checked
3 October 2026. Report laboratory results as laboratory results. Until there is
sufficient field data, mark field performance unmeasured. Existing Speed Insights
can supply the production feedback; do not add parallel analytics integrations.
