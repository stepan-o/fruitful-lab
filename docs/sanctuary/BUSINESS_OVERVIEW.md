# Business overview — evidence and implementation

5 October 2026. Scope: Sanctuary only, `apps/lab` and its design documentation.

## Sequence and editorial intent

1. **Insert coin. Join in.** A brief historical detour, the imagined room, two Pong images, the prototype’s coin-container failure, and Al Alcorn learning about other customers while collecting takings. The closing leads from an enjoyable occasion to its supporting work. No family anecdote or Gauntlet detail remains here.
2. **From studio to screen.** Creative work, rights, production finance, publishing, promotion, distribution/settlement, equipment/rendering, operations and audience payments. Cross-industry and repeated-game comparisons hold the questions steady.
3. **How many lives does a coin buy?** The existing Gauntlet case and complete cabinet instrument are preserved at their own stable route. Further narrative iteration follows the owner’s review of the opening pair.

## Comparative instrument

Eight selected routes, six questions, three column-pair tabs. Filters compare screen entertainment (Gauntlet / Dune Part Two / Stranger Things), BG3 (Steam local / Steam + paid GeForce NOW / PS5 download), and Diablo IV (Xbox purchase / eligible Game Pass download). Roles are not necessarily separate companies. The source register dates and bounds each example. Private royalty, revenue-share and subscription settlement rates are not invented.

The business atlas adds seven selectable layers, each naming counterparties, what is sold and the analytical question. Its arrows are schematic direction, never a Sankey flow or implied percentage. They do not imply all receipts must pass through every depicted role.

## Numbers and interpretation

- Sony Game & Network Services FY24/FY25 sales: FY2025 Q4 supplement, printed p. 12. Source values stored as ¥million; display divides by 1,000 for ¥billion. Share = category / reported segment total × 100. Totals 4,670,044 and 4,685,651. FY25 detail sums to 4,685,650 (¥1m rounding difference). Years end March 2025/2026. Network Services includes PS Plus AND ads. These are reported revenues including royalties and intersegment activity, not gross consumer receipts; not a cloud-revenue estimate. https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/25q4_supplement.pdf
- GeForce NOW selected Windows bandwidth requirements, checked 5 Oct 2026: 720p60 = 15 Mbps; 1080p60 = 25; QHD120 = 35; 4K120 = 45. The separate <80ms requirement is network latency to the data center, not total motion-to-photon delay. These are requirements, not observed throughput. https://www.nvidia.com/en-us/geforce-now/system-reqs./
- GeForce NOW historical membership: over 10m, quarter ended 2 May 2021 (NVIDIA 10-Q); over 25m, 2 Feb 2023 anniversary. Lower bounds are shown with hatched ends. Do not calculate an exact 2.5× growth rate from lower bounds or call these active/paid users. This does not measure cloud’s causal impact on sales or its current market share.

Cloud can broaden access while adding rendering capacity, network, integration and rights constraints. It does not eliminate local hardware targets for a game still sold to local players. Steam Cloud Play explicitly preserves game purchases and partner payouts. Service subscriptions, catalog subscriptions and online game backends remain distinct.

## Visual documentation and performance

Each map/chart has a detailed entry in `visual-notes.ts`, alongside primary references and limits. All source values are local, immutable within the application build. No runtime third-party fetch, new raster image, chart library, per-frame React state or animation is added. Chapter-specific components are dynamically imported. Mobile rearranges the original map into labeled stations and stacks comparison cells; charts retain real zero baselines and readable values.

## Validation — 5 October 2026

- Full Lab CI: 50 test suites / 225 tests passed, eight retained asset releases verified, production Next.js build passed. Scoped lint and `git diff --check` passed.
- Served the production build at `127.0.0.1:3106`. Verified the new opening, chapter navigation to the overview and separate Gauntlet chapter, and the actual Alcorn closing in the browser. No browser console errors observed.
- Browser checks at 320, 390, 768 and 1280px: no horizontal document overflow. Verified the mobile station layout, stacked comparison, BG3 filter, keyboard End selection of the final comparison tab, layer selection and revenue-share toggle. Cloud mode selection was also checked at 390px.
- Evidence screenshots: `outputs/sanctuary-business-overview/business-atlas-desktop.png` and `outputs/sanctuary-business-overview/revenue-tablet.png` in the local task output directory.
- No new raster payloads or continuous visual effects were introduced. Field Core Web Vitals and controlled cold/warm network measurements remain unmeasured for this revision.
