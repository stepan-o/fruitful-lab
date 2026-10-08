# Business chapters — editorial revision, 8 October 2026

PR #98 contains chapters 2 and 3, their manuscript/source records, and the
Half-Life identification image. The latest revision rebuilds chapter 2 and its
diagram examples around one creative work supporting several connected
businesses. The approved chapter 1 is unchanged. All other 32 chapter records
are unchanged from the preceding PR head, 25619d3.

## Current chapter 2

Eight paragraphs, 574 words. Sony’s PS5 launch-quarter economics opens the
argument: hardware priced below manufacturing cost alongside higher gaming
division profit. The February 2021 earnings presentation supports that bounded
historical account; no current hardware margin or contribution from Cyberpunk
is inferred.

Cyberpunk then holds the work constant through publishing, stores, Sony’s
catalog agreement and NVIDIA’s separate computing service. CD PROJEKT’s
Nowakowski supplies an exact, attributed 18-word sentence from question 5 of
the Q3 2025 earnings transcript (PDF page 6). The deal’s return and expansion
opportunity are management’s assessment. No private rate, contract amount,
per-play payment or measured causal sales effect is invented.

The promotional image follows paragraph 4; the market map follows paragraph 5
(zero-based). Both manuscripts match every runtime paragraph and all citation
IDs resolve. The close leads into Valve’s expansion from making games into
distribution and hardware.

The four modern opening-diagram routes now use Cyberpunk and CD PROJEKT RED.
Sony/Microsoft catalog agreements are external publisher agreements. The
NVIDIA route requires a purchased supported PC edition; the console catalog
licence does not grant it. The wider market map also opens on Cyberpunk. The
first diagram retains its arcade opening as the continuation from chapter 1.

## Verification

- Full app CI passes: 65 suites, 335 tests, one snapshot, asset checks and the
  Next.js production build. All 22 retained asset releases verify.
- Scoped ESLint and whitespace checks pass. Updated interaction regressions
  verify fixed game/studio/publisher identity, store settlements, separate game
  and computing payments, console catalog switching, paired highlights and
  state reset. Reader coverage verifies figure order and the map’s initial game.
- Local production preview reviewed at 1280px and 390px. Purchase/catalog and
  cloud selections render the correct product and payment relationship. Prose,
  quotation, attribution, promotional image and figure order are readable;
  no horizontal page overflow or browser errors were found. Viewport overrides
  were reset after review.
- React review: static route data, lazy initial selection, memoized procedural
  art and existing motion lifecycle gates retained. No new animation scheduler,
  network request, image payload or dependency in this revision.

## Earlier changes retained in this PR

Valve’s chapter follows update distribution, third-party sales, libraries,
discovery, measurement and compatible hardware. Official Half-Life promotional
art replaces the gameplay screenshot: complete composition, responsive WebP
derivatives at 320px / 21,646 bytes and 616px / 54,838 bytes, immutable manifest
release and a specific source/use record. The Counter-Strike menu remains.

The established bounded editorial-use decision remains. Attribution and source
availability are not represented as a blanket licence. No new third-party art
was introduced by the latest chapter 2 revision. The retired Half-Life gameplay
record remains for provenance and is omitted from the chapter’s visual index.
