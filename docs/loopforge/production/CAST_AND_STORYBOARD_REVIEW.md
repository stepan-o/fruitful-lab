# Cast and opening storyboard review

21 October 2026 · Review preview checkpoint. The animated opening remains in production.

The cast reader opens with the approved graduation and ensemble images, then bob, the nine other workers and the three supervisors. The episode reader opens with the four-panel storyboard. Its third panel now uses a low view beside bob, with sam reaching in from the left and witnesses at different depths; it no longer repeats the greeting composition. The morning panel follows the workers towards the factory. LIMEN’s cyan blade remains on his right arm. STILETTO passes while bob is down, after ed and gus’s completed checks.

## Validation

- Production build passed, including TypeScript and route generation.
- Repository CI passed 106 suites and 566 tests; one unrelated Sanctuary navigation test exceeded its existing five-second limit. An isolated diagnostic run with a 20-second limit passed all 14 tests in that suite. The default CI run is therefore not reported as wholly passing. No test threshold was changed.
- Browser inspection used the real generated readers at 320, 390, 768 and desktop 1280 CSS pixels. Narrow widths were same-browser iframe layout checks, not physical mobile device tests. No horizontal document overflow was observed.
- Episode overview: 480px image on narrow layouts (62,512 bytes), 960px at tablet width (221,266 bytes), 1672px on desktop (526,050 bytes). The four individual panels stay unloaded while their disclosure is closed. Keyboard Enter opens the disclosure and exposes four full-size image links.
- Cast artwork stacks on narrow phones and presents the two ensemble images side by side at tablet and desktop widths. Portraits below use lazy loading.
- Original generation prompts and source records remain in the numbered model-brief convention. Responsive WebP derivatives are linked by the cast and episode media manifests.

These checks establish reader layout and delivery, not animation fidelity, recognition in a moving crowd or game frame-rate acceptance. The existing rehearsal still uses the earlier cast and script.
