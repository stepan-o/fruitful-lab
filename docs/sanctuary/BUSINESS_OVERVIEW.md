# Business overview — evidence and implementation

5 October 2026. Scope: Sanctuary only, `apps/lab` and its design documentation.

## Sequence and editorial intent

1. **Insert coin. Join in.** A brief historical detour, the imagined room, two Pong images, the prototype’s coin-container failure, and Al Alcorn learning about other customers while collecting takings. The closing leads from an enjoyable occasion to its supporting work. No family anecdote or Gauntlet detail remains here.
2. **From studio to screen.** Creative work, rights, production finance, publishing, promotion, distribution/settlement, equipment/rendering, operations and audience payments. Cross-industry and repeated-game comparisons hold the questions steady.
3. **How many lives does a coin buy?** The existing Gauntlet case and complete cabinet instrument are preserved at their own stable route. Further narrative iteration follows the owner’s review of the opening pair.

## Editorial pass — 5 October 2026, review draft

Chapter 2 now follows a concrete game through the surrounding businesses. BG3
introduces the difference between a game purchase and a computing service; the
chapter then follows production funding, ownership, publishing, discovery and
settlement. Cinema and Netflix clarify the objects bought at different points
in the chain. Sony shows several roles inside one company and provides an
observable revenue comparison. Cloud gaming returns to the opening example with
its production, connection, rights and operating-cost consequences.

The closing separates online game operation, catalog access and remote rendering
before moving to Gauntlet’s rules of play. Recurring revenue around a purchased
game is not silently attributed to the game’s developer. Historical membership
counts remain reach measures, not evidence of active use or extra game sales.

The continuous draft is mirrored in `OPENING_MANUSCRIPT.md`; Chapter 1 and the
Gauntlet chapter are unchanged. This is an editorial review draft, not owner
sign-off. Apply `EDITORIAL_STYLE_GUIDE.md` to later revisions. Chart headings and
interactive explanatory copy were edited for clarity; source data, controls,
geometry, assets and motion behavior were retained. Figure positions follow the
new paragraph sequence. No public production commentary was added.

Targeted primary-source recheck: Epic’s 26 March 2020 publishing offer; Valve’s
Steam payment, discovery and Cloud Play documentation; NVIDIA’s membership FAQ;
Netflix’s investor explanations of commissioning and licensing; Sony’s FY2025
Q4 supplement, page 12; and the CMA’s 13 October 2023 acquisition decision.
Steam’s settlement source now also appears beside the relevant narrative paragraph.

### Editorial-pass validation

- Full Lab CI passed: 55 suites / 249 tests, all 11 retained asset releases,
  and production build. Scoped lint passed. A final build includes the clarified
  introduction of Dungeons & Dragons as a tabletop role-playing game.
- The production preview on port 3106 was checked at 1280, 768, 390 and 320px.
  No horizontal overflow or browser console errors were observed. Verified the
  BG3 comparison filter, keyboard tab navigation, revised layer readouts, Sony
  revenue-unit controls, cloud mode selection and the next-chapter link.
- Source data and optimized image files are unchanged. Chapter 1 and the Gauntlet
  content objects were compared with the merged version and are unchanged.
  No new continuous effects, dependencies or runtime requests were added.
- Prepared for PR review at the owner’s request; Chapter 2 remains under editorial
  review. Screenshots are in the task output
  directory under `sanctuary-chapter-two-editorial`. Field performance was not
  remeasured for this copy revision.

## Comparative instrument

Eight selected routes, six questions, three column-pair tabs. Filters compare screen entertainment (Gauntlet / Dune Part Two / Stranger Things), BG3 (Steam local / Steam + paid GeForce NOW / PS5 download), and Diablo IV (Xbox purchase / eligible Game Pass download). Roles are not necessarily separate companies. The source register dates and bounds each example. Private royalty, revenue-share and subscription settlement rates are not invented.

The opening procedural circuit compares an arcade route, a purchased PC game, the same game through GeForce NOW, and Netflix. Its selectable participants identify costs, income and the next sale or renewal each business needs. Separate payment paths expose counterparties without implying amounts or timing. The seven-layer atlas remains available in a disclosure below it. See `BUSINESS_CIRCUIT.md` for composition, sources, behavior and verification.

## Numbers and interpretation

- Sony Game & Network Services FY24/FY25 sales: FY2025 Q4 supplement, printed p. 12. Source values stored as ¥million; display divides by 1,000 for ¥billion. Share = category / reported segment total × 100. Totals 4,670,044 and 4,685,651. FY25 detail sums to 4,685,650 (¥1m rounding difference). Years end March 2025/2026. Network Services includes PS Plus AND ads. These are reported revenues including royalties and intersegment activity, not gross consumer receipts; not a cloud-revenue estimate. https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/25q4_supplement.pdf
- GeForce NOW selected Windows bandwidth requirements, checked 5 Oct 2026: 720p60 = 15 Mbps; 1080p60 = 25; QHD120 = 35; 4K120 = 45. The separate <80ms requirement is network latency to the data center, not total motion-to-photon delay. These are requirements, not observed throughput. https://www.nvidia.com/en-us/geforce-now/system-reqs./
- GeForce NOW historical membership: over 10m, quarter ended 2 May 2021 (NVIDIA 10-Q); over 25m, 2 Feb 2023 anniversary. Lower bounds are shown with hatched ends. Do not calculate an exact 2.5× growth rate from lower bounds or call these active/paid users. This does not measure cloud’s causal impact on sales or its current market share.

Cloud can broaden access while adding rendering capacity, network, integration and rights constraints. It does not eliminate local hardware targets for a game still sold to local players. Steam Cloud Play explicitly preserves game purchases and partner payouts. Service subscriptions, catalog subscriptions and online game backends remain distinct.

## Visual documentation and performance

Each map/chart has a detailed entry in `visual-notes.ts`, alongside primary references and limits. All source values are local, immutable within the application build. No runtime third-party fetch, new raster image, chart library or per-frame React state is added. The opening circuit uses a few CSS-driven mechanical details gated by the existing motion lifecycle. Chapter-specific components are dynamically imported. Mobile rearranges the original map into labeled stations and stacks comparison cells; charts retain real zero baselines and readable values.

## Validation — 5 October 2026

- Full Lab CI: 50 test suites / 225 tests passed, eight retained asset releases verified, production Next.js build passed. Scoped lint and `git diff --check` passed.
- Served the production build at `127.0.0.1:3106`. Verified the new opening, chapter navigation to the overview and separate Gauntlet chapter, and the actual Alcorn closing in the browser. No browser console errors observed.
- Browser checks at 320, 390, 768 and 1280px: no horizontal document overflow. Verified the mobile station layout, stacked comparison, BG3 filter, keyboard End selection of the final comparison tab, layer selection and revenue-share toggle. Cloud mode selection was also checked at 390px.
- Evidence screenshots: `outputs/sanctuary-business-overview/business-atlas-desktop.png` and `outputs/sanctuary-business-overview/revenue-tablet.png` in the local task output directory.
- No new raster payloads or continuous visual effects were introduced. Field Core Web Vitals and controlled cold/warm network measurements remain unmeasured for this revision.
