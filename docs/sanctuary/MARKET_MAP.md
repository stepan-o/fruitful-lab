# Chapter 2 closing market map

7 October 2026. Local iteration, before the Valve bridge.

## Purpose

Follow one game through alternative businesses. The developer and publisher are
facts about that release; changing a store must never replace them. Game access
and computing can come from different companies, or a membership may bundle both.
This supersedes the first company-footprint implementation, which changed every
stage together and failed to show the combinations the owner intended.

Diablo IV starts with Blizzard → Steam → NVIDIA → player. The first two roles
are both Blizzard for a factual reason, not a global company selection. Switching
Steam to Battle.net preserves NVIDIA. Switching to PlayStation changes to a
supported local console route and announces why. A computing selection leaves
access untouched; incompatible options are disabled. The alternate-routes board
lets the reader choose a complete pair deliberately, including a different store.

Five games expose selected major arrangements:

- Diablo IV: Steam/Battle.net purchases, linked PC Game Pass, PlayStation/Xbox
  purchases and Ultimate catalog access; supported PC copies can use NVIDIA.
- Cyberpunk 2077: PC purchases through Steam, Epic or GOG with local/NVIDIA
  computing; Sony purchase or catalog with local/PS cloud; Xbox purchase with
  local/Xbox cloud, plus the verified Game Pass Ultimate console/cloud catalog
  route. That catalog does not supply a PC entitlement for NVIDIA. Sony Premium and an eligible Xbox cloud plan still apply to
  bought games. NVIDIA removed Cyberpunk from its Free tier in April 2026.
- Forza Horizon 5: Valve can sell a Microsoft-published game that runs on NVIDIA.
  Xbox Play Anywhere purchase supports Windows/console; Steam/PS licenses remain
  separate. PC Game Pass + NVIDIA illustrates separate access/computing services;
  Ultimate + Xbox cloud illustrates a bundle.
- Fortnite: free game entry and free Xbox cloud access demonstrate why a cloud
  path need not imply two subscriptions or even one. Optional sales remain.

- Spider-Man 2: Sony studio, publication, catalog and console/cloud; separate
  Steam/Epic PC editions preserve Nixxes port credits and the PC publishing label.

Company-led presets coexist with the game-first choices. Sony and Microsoft each
have catalog + bought console and catalog + cloud presets. Their four mapped jobs
light together, with actual studio/publisher names and a parent-company label.
Local-console presets explicitly follow direct hardware purchases (PlayStation
Direct or Microsoft Store) so the receipt does not misattribute retailer revenue.
Console purchase and membership remain separate bills; cloud catalog presets can
bundle both services in one membership. Any manual choice exits the preset and
returns to the cross-company route. Marvel's licensed IP is acknowledged as an
input outside Sony's four displayed roles; the scene does not imply self-sufficiency.

This is a curated, dated map of evidenced combinations, not a claim to exhaust
all platforms or offers. Missing links mean not mapped, not proved impossible.
Do not infer Diablo IV Sony/Xbox cloud eligibility from a console store listing.
Nintendo, mobile stores, physical retail, Amazon Luna and other routes are outside
this view. Editions, expansions, catalog churn, plan/device/region restrictions
prevent a universal all-to-all cart. Cross-progression is not cross-buy.

## Visual and interaction design

Original engraved role scenes retain the deck's muted teal, brass, ink cuts and
shared dimetric floor. The computing scene switches between local equipment and
remote servers. Fixed development/publication labels differ from native access
and computing controls. All enabled alternate connections remain visible below
the chosen chain; dashed cloud chips and explicit local/cloud text distinguish
them without relying on color. Selected access/compute scenes illuminate together.
Teal provision paths and gold payment categories meet at the player. The receipt
states the actual payees and whether the fees are separate, bundled or absent.

Native selectors and route buttons support keyboard use, visible focus and 44px
minimum touch areas. Only selected scenes animate via the existing useLivingPlate
lifecycle (offscreen, hidden, global pause and reduced motion). No per-frame React
updates, new dependency or media payload. The chapter-only dynamic import stays.
On mobile the chain becomes numbered rows, routes wrap, and the topology is
restated in text rather than squeezing wire labels into unreadable widths.

## Evidence

Official sources live alongside the game/access records in
`apps/lab/lib/sanctuary/market-map.ts` and appear in the public disclosure. Reviewed
7 October 2026: Blizzard platform listings via Xbox and PlayStation; NVIDIA's
Diablo Steam/Battle.net support and linked Game Pass instructions; Sony's current
Cyberpunk listing (Extra catalog, Premium PS5/Portal streaming); Xbox's supported
owned-game announcement naming Cyberpunk and current cloud rules; official Forza
platform/Play Anywhere listing and NVIDIA PC-store support; Epic's Fortnite cloud
support and Xbox's free-account exception. Historical announcements establish
onboarding; current platform listings/FAQs establish the stated offer boundaries.

Private publisher settlement rates, internal transfer prices, market share and
an exhaustive count of possible routes are deliberately not claimed. No new
third-party visual assets or copyright basis introduced.

## Verification

- Required full CI passed for the route replacement: 60 suites, 291 tests,
  asset-pipeline checks, 15 retained releases and the production build.
- After the company-preset addition: scoped ESLint, all 8 route tests and another
  production build passed. No unrelated files were changed for this addition.
- Browser verified independent store/computing changes, compatibility fallback,
  keyboard game selection, Sony direct-console preset, Microsoft cloud preset,
  cross-company paths and the visible alternative-route board. No console errors.
- 320, 390 and 768 CSS-pixel checks: no page overflow; selectors and route buttons
  meet 44px height. Tablet uses two columns, phone uses illustrated rows.
- Manual motion pause stops the diagram; restoring it resumes selected activity.
  Existing lifecycle tests cover offscreen/visibility/reduced-motion behavior.
- Production map chunk: 37,335 bytes / 11,487 gzip. No added image requests or
  dependencies. This is the component chunk, not whole-page transfer. Field Core
  Web Vitals remain unmeasured.
- Desktop, integrated-route, 320, 390 and 768 proof screenshots are in the task's
  sanctuary-business-circuit output folder, named `market-routes-*.png`.
- Local production preview rebuilt and restarted on port 3106. No PR/publish
  action requested during this iteration.

## Iconography pass · 7 October 2026

`MarketIconography.tsx` separates the original role illustrations from the route
state. All five scenes retain a shallow brass-edged dimetric floor and the same
teal, parchment, ink and aged-metal palette. Bold silhouettes carry identification
at the small desktop scale; fine cuts supply detail when enlarged on tablet.

- Development: a wall-mounted level plan, editor monitor, drawing sheet and
  articulated task lamp make this a software production bench.
- Publishing: a release calendar, game box, promotional megaphone, paperwork and
  coins distinguish scheduling, promotion and funding from development. These are
  role symbols, not a claim that every publisher finances every release.
- Access: an original storefront illustration changes with the selected service.
  Steam uses a feature panel and thumbnail strip; Epic and Sony use cover cards;
  Xbox catalog variants use their own heading and feature treatment. Names identify
  the referenced products; the illustrative covers are original fantasy, city and
  racing scenes, not copied game art or exact interfaces.
- Computing: an owned PC, the curved PS5 shell and Xbox tower have distinct
  silhouettes. Remote computing uses a rack with server trays and a connection
  to the receiver. The Sony cloud variant shows a Portal-shaped receiver, rather
  than implying PC browser compatibility. Server construction is schematic, not a
  literal drawing of proprietary data-center equipment.
- Player: a rear-facing figure reaches a desk screen from a supported gaming chair.
  Local console/Sony cloud variants use a controller; PC routes show mouse input.
  The scene represents the recipient of access and computing, not another vendor.

Alternate-route buttons now use an original, consistent vector glyph set for the
six computing choices. PC, PS5 and Xbox remain distinguishable in silhouette;
remote variants show server-to-device connections. The explicit local/cloud text
remains, so neither color nor icon interpretation is required to choose a route.

Selected roles have restrained cursor movement, server indicators or signal
pulses. Transforms and opacity use the existing visibility/motion lifecycle. No
animated blur, per-frame React updates, image requests or new dependencies.
References are the established BusinessCircuit dioramas and Sanctuary materials,
with commonplace device/form-factor cues. No new third-party artwork is embedded.

The 8 October editorial revision places this instrument after paragraph 3. The
preceding prose motivates the comparison through the choices a studio can afford
and the ways earlier work can support a continuing business. The map carries
the detailed combinations. Cyberpunk’s catalog agreement then gives the publisher’s perspective,
with the official promotional citation after paragraph 4. The closing connects
the commercial life of existing work to Steam’s distribution role; Valve’s history
remains in its own chapter. See CHAPTER_TWO_MANUSCRIPT.md.

### Verification of this pass

Full required CI passed: 60 suites / 292 tests, asset checks and production build.
After the lamp/motion adjustment, all 8 route tests, scoped ESLint and the
production build passed again. Browser checks covered Sony console/cloud variants,
Steam with local PC, automatic compatible selection preservation, 320/390/768px
layouts and manual motion pause/resume. No console warnings/errors were reported.
At 320px, all diagram controls retained at least 44px height with no horizontal
overflow. The final route component is 46,486 bytes / 14,315 gzip, approximately
2.8 KB gzip above the preceding map. No new image requests. This measures the map
chunk, not total page transfer or field Core Web Vitals. Proof files are
`market-icons-desktop.png`, `market-icons-320.png`, `market-icons-390.png` and
`chapter-two-valve-closing.png` in the task's sanctuary-business-circuit output
folder. Local production preview was refreshed on port 3106; no PR update made.

## Worked example after the map

Chapter 2 now follows this instrument with Cyberpunk’s console catalog offers
and separate NVIDIA computing service. Sources and full prose live in
CHAPTER_TWO_MANUSCRIPT.md and the shared evidence register. The Xbox catalog
route was added to the map so readers can inspect the combination discussed.
PC Game Pass and NVIDIA remain unavailable for that catalog offer; a purchased
PC copy still supports NVIDIA. Tests verify both the valid route and blocked
entitlement transfer. Existing Night City derivatives are reused and lazy loaded.
