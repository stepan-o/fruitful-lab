# Sanctuary complete edition — validation

8 October 2026. Scope: the Sanctuary reader, its media and editorial documentation in `apps/lab`; merged with master at `2f73a7926729e6409c445fe38576fca23a2f4deb`.

## Delivered

- 33 chapters in seven acts; the approved Pong opening is preserved.
- The business chain leads through Valve, Epic, Rockstar, competing production commitments, contracts, cloud delivery, world creation and Concord.
- Four consecutive Diablo history chapters precede Gauntlet and the analysis of engagement, offers and efficacy. Existing chapter URLs remain valid; three historical chapter IDs are added.
- Original history scenes and comparison controls, the Valve hardware study, company portraits, market-route selector and Loopforge production example accompany sourced visual citations.
- Typed inline-exhibit positions replace paragraph-index conditions in the reader. Only the current chapter and its asset metadata cross the server/client boundary.

## Checks completed

- Repository-required `API_BASE_URL=http://localhost:8000 npm run ci`: passed. Asset tests, 65 Jest suites / 335 tests, media integrity checks and the Next.js production build all passed.
- Sanctuary component/data/test ESLint: passed without findings.
- All 33 chapter routes, overview and credits: HTTP 200 on the production server.
- 170 unique evidence sources; chapter citation IDs and paragraph/visual insertion positions resolve.
- Browser: desktop 1280px; phone widths 390px and 320px. Tested history comparison lenses, Valve equipment selection and the market map’s Microsoft catalog/cloud route. No horizontal document overflow in these checked views; visible images loaded.
- Original-history motion was observed active in view and paused after scrolling away. Existing reduced-motion and global preferences remain in the shared motion gate.
- Immutable history file response: `public, max-age=31536000, immutable`. Manifest pointer: `public, max-age=30, must-revalidate` (CDN policy remains separately configured).
- New Diablo stills provide 400/800/1200px WebP variants. Mobile derivatives are 17–29 KB; largest derivatives are 104–177 KB. Full resolution is requested through the existing on-demand viewer. This is an asset-size check, not a claim about field Core Web Vitals.

## Known verification limits

The optional standalone `tsc --noEmit --incremental false` check still reports four existing test-only errors in `__tests__/routes/pinterestPotentialPage.test.tsx` and `lib/growthbook/__tests__/middleware.apply.test.ts`. Those files are unchanged from master; no Sanctuary errors remain. The required CI and production TypeScript/build check pass.

Navigation supports the existing six languages; the researched essay remains explicitly labeled an English editorial edition. Current catalog offers, prices and policies are dated evidence, not promises of continued availability. Source/use records describe the purpose and basis of each visual citation without claiming blanket permission. Interactive models illustrate mechanisms; they do not estimate unpublished game revenue or retention.

The hosted preview and PR are verified separately after push. Production promotion remains the normal merge/review step.
