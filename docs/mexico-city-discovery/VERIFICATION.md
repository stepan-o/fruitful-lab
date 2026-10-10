# Otra Vista verification — 9 October 2026

Scope: the new `/mexico-city` route in `apps/lab`, branch `codex/mexico-city-discovery`, based on `origin/master` at `75c5469`. No backend, authentication, marketing-site or other app changes. This is technical verification for owner playtesting, not owner acceptance of the visual direction or game balance.

## Build and tests

- `npm run assets:test`: passed, one asset-release test.
- `API_BASE_URL=http://localhost:8000 npm run ci:test -- --runInBand`: **76 suites, 398 tests, one snapshot passed**. Includes four journal tests covering independent scoring, idempotent import, conservative merging and malicious/unsupported import payloads.
- Final targeted journal rerun: four tests passed.
- Scoped ESLint across the new page, components and logic: passed without warnings.
- Final `API_BASE_URL=http://localhost:8000 npm run build`: passed, including TypeScript, 46 retained asset-release checks and static generation of `/mexico-city`.
- `git diff --check`: passed.
- All four geographic anchors were checked against the source borough polygons: the first three lie in Cuauhtémoc, and the reservoir lies in Miguel Hidalgo. The retained-source map generator rebuilt all 16 boroughs and 1,836 street ways.

The initial combined CI process was terminated by the local runner; its steps were then completed separately with one Jest worker. A first test invocation without the required API setting failed three unrelated auth/route suites; the correctly configured full run above passed. Build output retains the repository's existing middleware-convention warning and missing optional GrowthBook client-key notice. These do not prevent this route from building or running.

## Production browser verification

The reproducible [browser script](verify.mjs) ran against `next start` serving the optimized build, with a supervised server. Chromium, Linux desktop host; phones are emulated viewport/touch/DPR configurations, not physical-device tests.

| Viewport | DPR | Full flow | Initial image body bytes | Cold LCP | Cold CLS | Warm LCP |
| --- | --- | --- | --- | --- | --- | --- |
| 320 × 844 | 2 | Pass | 32,626 | 552 ms | 0.0153 | 96 ms |
| 390 × 844 | 2 | Pass | 32,626 | 216 ms | 0.0132 | 136 ms |
| 768 × 960 | 1 | Pass | 32,626 | 252 ms | 0.0065 | 116 ms |
| 1440 × 960 | 1 | Pass | 32,626 | 404 ms | 0.0022 | 132 ms |

Each cold context requested two 256px WebPs: `94d6dc…00b3` (18,446 bytes) and `1e6c90…9634` (14,180 bytes). Combined cold transfer including Resource Timing's header allowance was 33,226 bytes. Both were served from browser cache on warm reload, with zero transferred bytes. All sizes are comfortably below the repository's initial-image budgets. Full filenames, chosen images, and cold/warm observations are in [the machine-readable report](evidence/browser-report.json).

These are unthrottled localhost observations with one cold/warm sample per viewport. They do not establish real-device, cellular, regional-CDN or 75th-percentile field performance. Field LCP/INP/CLS are **unmeasured**; INP was not instrumented in this run. No claim of offline/PWA support is made.

At all four widths the script checked:

- Sixteen selectable boroughs, all four map scales, illustration/label hit targets, no horizontal page overflow, and minimum 44px HTML button targets.
- Keyboard activation of map landmarks; native touch taps on phones; story arrows and phone swipe gestures.
- Story collection, saved places, visits, notes and local photo resizing; no external upload of the fixture image.
- Independent Susy and Stepan progress, active-player persistence and saved notes after reload.
- Journal export into a file, import into a fresh browser, rejection of external-image payloads, and preservation of existing valid data after rejection.
- Escape dismissal, trigger-focus restoration and browser Back to the previous map scale.
- All other historical scenes and source links, the honest empty-state for unseeded boroughs, invalid deep-link fallback, and reduced-motion transition duration of zero.
- No browser page errors.

An early phone run stopped when its separately launched local server was terminated. The final supervised run passed every viewport. Test photographs are generated-art fixtures in isolated browser contexts; they are not claims of real-world visits or user photographs.

## Reviewed screenshots

| Scene | Evidence |
| --- | --- |
| City overview | [Desktop](evidence/city-1440.webp), [tablet](evidence/city-768.webp), [390px phone](evidence/city-390.webp), [320px phone](evidence/city-320.webp) |
| Borough → neighbourhood → place | [Borough on phone](evidence/borough-390.webp), [Centro on desktop](evidence/zone-1440.webp), [Centro on phone](evidence/zone-390.webp), [320px labels](evidence/zone-320.webp), [place focus](evidence/place-1440.webp) |
| Stories | [Present-day Zócalo](evidence/story-today-1440.webp), [1843 reconstruction](evidence/story-past-390.webp), [Metro discovery](evidence/ehecatl-past-390.webp), [unfinished palace framework](evidence/revolucion-past-390.webp), [Chapultepec baths](evidence/chapultepec-past-390.webp) |
| Fieldwork | [Journal with scoring and a generated test-photo fixture](evidence/journal-1440.webp) |
| Before the separate style pass | [Initial desktop](evidence/before-city-desktop.webp), [initial phone](evidence/before-city-phone.webp), [initial close-up](evidence/before-zone-desktop.webp) |

The second pass corrected the initial phone heading and excessive introduction height, reduced overcrowded labels, made room for both Centro discoveries, added real streets, and kept the phone close control fixed during journal scrolling. Motion is bounded and stops completely under reduced motion. The artwork remains explicitly labeled as generated interpretation.

## Release boundary

Open as a draft PR for review. Do not merge or promote to production without owner approval. Preview deployment status is reported on the PR and in the delivery response. Scores and photographs remain local browser state with manual file transfer; this is not an authenticated multiplayer release.
