# Loopforge verification record

Reviewed 2026-10-03 in the Codex browser against a local production build.
Reference: Sanctuary's serif reading rhythm, illustrated scenes, instrument-like
exhibits, restrained motion and explicit evidence. Loopforge uses its own teal,
brass, gunmetal and original factory artwork.

## Visual coverage

All 24 chapter openings were inspected at the browser's desktop size (about
1270 × 714) and 390 × 844. No horizontal page overflow was found. Composition,
image crops, title wrapping and reading contrast were reviewed in screenshots.
The final build additionally checked every chapter at 320 and 768 CSS pixels:
48 route/width combinations, no document overflow or missing heading. Small
phone navigation, motion and artwork controls were enlarged to at least 44 px.
At 390 CSS px (DPR 1), the opening selected the 131,486-byte entrance variant
`7abeb9e0…webp`; the 1270 px desktop (DPR 1) selected `44c8d979…webp`, 384,686 bytes.
Both are below the shared initial-image budgets. Browser cache can retain a larger
variant after resizing; these are actual selections, not predicted transfer costs.
Field Core Web Vitals remain unmeasured.
Early captures taken before asynchronous image decode were recaptured after load;
the assets themselves were available. This was not treated as a broken-image defect.

Representative cast, room directory, pipeline, BDI, replay, ownership, three-clock,
evaluation and cost controls were exercised. The same seed reconstructs the same
241-unit run; seed 42 changes that example to 227 units. Evaluation cases make the
difference between structural and semantic rejection visible. Cost calculations
are illustrative inputs, not measured model scores.

Corrections from review: center the native art dialog, scope the reader scrollbar
colors, preserve cargo phase offsets in reduced motion, add spaces to multiline
accessible headings, and add mobile anchors to staffing, order and ledger areas.
Escape closes the inspector and restores focus. The entrance's new menu reaches
all three Loopforge areas and retains Sanctuary Economics. The broader entrance
design is intentionally deferred by the owner.

Time-separated browser observations showed conveyor translation advancing from
4.96 to 18.79 px while enabled, then remaining at 1.60 px in separate observations
after pause. Both visible belts agreed. Offscreen, document visibility and OS
reduced-motion lifecycle are covered by the component test; an OS preference was
not changed on the owner's machine. No measured FPS or GPU-budget claim is made.

## Playable flow

A complete browser run reached 241 units and 42 strain after eight shifts, exactly
matching the golden headless fixture. Restart and supervisor swapping worked.
The narrow console successfully committed a pressure shift through the real HTTP
handler; its order controls fit without horizontal overflow. Narration remained
visibly unavailable because paid configuration is absent. No canned text was
presented as live generation.

## Automated and HTTP checks

- Required `API_BASE_URL=http://localhost:8000 npm run ci`: 37 suites, 168 tests,
  asset checks and production build passed.
  This includes the newly published Sanctuary baseline (`463e1cb`).
- Focused Loopforge checks: 19 tests cover kernel fixtures/invariants, command
  isolation, BDI staleness, body limits, narrative envelopes, provenance, quota
  and provider failures, and motion lifecycle. Provider/store calls are mocked.
- Scoped ESLint and evaluation-script syntax checks passed. The paid runner exits
  before networking when configuration is missing.
- HTTP checks: submitted output is ignored and reconstructed, malformed runs
  return 400, invalid chapter routes return 404, deck roots redirect correctly,
  and narration availability returns false without secrets.
- No browser error/warning messages were recorded during the final local flow.

Real OpenAI/Redis integration and the hosted preview were subsequently verified:
the browser completed the 241-unit/42-strain run and rejected an incorrect private
code without changing its committed shift. Twelve fresh responses and six cached
retrievals are documented in `LIVE_EVALUATION.md`. Human narrative judgments and
production promotion remain separate from this preview's technical verification.

Selected review images are stored in `review/`; the broader temporary screenshot
set is `/tmp/loopforge-visual-review` on the implementation host.

## Project-directory routing follow-up · 3 October 2026

After the first delivery, the owner requested a separate Loopforge entrance.
The original factory menu now lives at `/stepanoskin/loopforge`; `/stepanoskin`
is a lightweight directory with production systems, Sanctuary Economics,
Loopforge and an About placeholder. The factory keeps its three Loopforge
destinations, existing artwork, conveyor, activation sound and preferences.

Verified the new directory at 1440, 768, 390 and 320 CSS-pixel widths, and the
factory entrance at desktop and 320px. No horizontal overflow was observed.
Factory header controls now meet a 44px minimum target. Corrected inherited
white scrollbar gutters on both entrances; colors are scoped by page presence.
The directory loads no raster artwork or animated factory effects.

Browser navigation covered all four directory destinations, all three factory
destinations, reader/prototype branding, the overview main-menu link and returns
from the existing profile and Sanctuary reader. Language selection survives a
reload and is shared with the localized About placeholder. All six directory
languages render, with narrow-layout checks for the longer translations. No
browser errors were recorded during this flow. Screenshot evidence is saved at
`/tmp/stepanoskin-directory-review` on the implementation host.

Required frontend CI passed: 37 suites / 169 tests, asset-pipeline tests and
production build. Scoped ESLint passed; a second production build verified the
final CSS refinements. No model calls or paid evaluation were needed.
