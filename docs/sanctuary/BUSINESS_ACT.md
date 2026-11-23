> Historical draft. Superseded by [the complete 8 October manuscript](COMPLETE_MANUSCRIPT_2026-10-08.md). Retained as editorial history.

# Sanctuary Economics — business act, 7 October 2026

The 8 October narrative authority is `NARRATIVE_SPINE_2026-10-08.md`.
The numbered list below records the earlier business-act organization; the
comparison now follows Rockstar and the existing history follows that comparison.
This is the earlier local editorial sequence. It supersedes the earlier
Chapter 2 → Gauntlet order. Chapter 1’s accepted manuscript is preserved.

## The business around the game

1. **Insert coin. Join in.** The approved historical invitation.
2. **From studio to screen.** The opening circuit distinguishes what is bought
   or subscribed to: the game/catalog and the computing. PC purchase → PlayStation
   purchase → Xbox purchase on owned hardware → bought Steam game on paid
   GeForce NOW. The cloud tab can also show PC Game Pass + paid computing. Define
   box price, separate the recipients of recurring fees and avoid asserting that
   equipment rental automatically makes the publisher’s income recurring. The
   full argument is in `CHAPTER_TWO_MANUSCRIPT.md`; no additional table or chart.
3. **Valve: the studio becomes the store.** Boxed games, durable multiplayer,
   services for Valve’s own games and third-party distribution. Games and hardware
   continue alongside the store. Full narrative in `VALVE_MANUSCRIPT.md`.
4. **Epic: the studio becomes the engine.** Unreal’s 1998 game introduces the
   engine as a product for other creators; games, publishing and storefronts
   remain distinct relationships. See `EPIC_MANUSCRIPT.md`.
5. **Rockstar: worlds built to last.** A recognizable core loop and theme connect
   durable worlds to franchises and ongoing production. See `ROCKSTAR_MANUSCRIPT.md`.
6. **Who gets paid before the maker?** Funding, rights, release and promotion,
   cinema/catalog comparisons, integrated platforms and Sony’s reported revenue.
7. **A game you own, a machine you hire.** Same-game local/cloud comparison,
   streaming requirements, production obligations and streaming rights.
8. **The next attempt is already paid for.** Purchased-copy history and further
   offers; replayability is not recurring revenue.
9. **The work of making a world.** Open the production box: creators, engines,
   systems and the Loopforge example. The detailed engine comparison stays here.
10. **Concord: the future that did not arrive.** The historical paid offer, Sony’s
   publishing and acquisition strategy, competition for evenings, refunds and
   closure. Close the act on commercial exposure. Do not substitute an encounter
   or matchmaking analysis for this market/business case, invent a budget or
   claim a single proven cause of failure.

## The business inside the game

10. **How many lives does a coin buy?** Gauntlet opens the next act. The explicit
    return to 1985 is intentional: the operator can set the paid resource inside
    the adventure. It follows Concord, not the overview.
11. **The business of keeping a world alive.** Existing creative-economy and
    contemporary BG3 / D4 comparison. Later design and player chapters follow.

The reader now has 29 chapters. Stable existing query IDs remain valid. Roman
numerals are generated rather than limited to 24. Titles/part assignments,
contents, previous/next links and chapter-scoped assets follow the same order.
The remaining historical/design material is still subject to the owner’s
section-by-section editorial review; this is not a quality sign-off of all prose.

## Source and graphic boundaries

- PC purchase separates Rockstar North (studio), Rockstar Games (publisher),
  Steam (storefront), PC store (retailer) and Player (customer). Studio/publisher
  funding is explicitly an internal allocation, not an invented invoice.
- The former self-published tab is removed. Rockstar and CD PROJEKT RED are
  not presented as an independent-publisher versus self-publishing contrast.
  The dedicated local/cloud comparison holds Cyberpunk 2077 constant.
- Xbox uses Forza Horizon 5 downloaded through Game Pass; PlayStation uses a
  Spider-Man 2 digital purchase run on PS5. These are selected routes, not
  exclusive descriptions of either platform. Both tabs identify cloud options.
  Access (purchase/subscription) and computing (local/remote) remain separate.
  Microsoft/Sony internal funding arrows do not assert private transfer prices.
- Rockstar’s original city art includes hills, palms, skyline, boulevard, car,
  mission-grid planning and a release board. It is explanatory geometry, not
  traced gameplay or a reconstruction of Rockstar’s workplace. Motion strengthens
  selection, pauses offscreen, and follows the global/reduced-motion preferences.
- The company role graphics reuse this isometric vocabulary. Interactions reveal
  customer, payment and continuing obligation. No automatic carousel or frame
  state updates were added.
- Half-Life, GTA Online Doomsday Heist and Epic’s web-shop mockup are bounded
  visual citations with full credit, source hash, treatment and purpose in
  context-media.json. They do not imply approval or permission. The GTA frame is
  a later Online promotion, not the 2013 launch; the Epic frame is a mockup.
- Context media use responsive content-hashed WebPs, immutable manifests and the
  existing short-cache pointer. Only active-chapter metadata reaches the reader;
  inspection mounts the largest variant on demand. Old releases are retained.

Implementation: business-overview-chapters.ts, company-chapters.ts, content.ts,
BusinessCircuit, CompanyEvolution, BusinessChains, BusinessCharts and Reader.
Internal visual notes move with their exhibits. The public source index remains
about referenced material, not explanations of our art.

## Local validation

- Full frontend CI: 59 suites, 279 tests passed, plus asset-pipeline tests and
  production build. Final artwork-assignment build also passed.
- Changed components passed ESLint; 14 retained media releases passed integrity
  validation. Chapter 1 compared byte-for-byte against the approved baseline.
- Browser verified the five-party GTA route, paired transaction highlights,
  interactive Rockstar roles, cloud-only comparison and Concord → Gauntlet
  navigation. Phone views at 390px and 320px showed readable cards and no
  horizontal overflow; the normal desktop viewport was restored.
- No browser error logs were observed. These local checks are not field Web
  Vitals or a production deployment. Preview remains on 127.0.0.1:3106.
- Largest delivered new source images: Epic mockup 35,632 bytes; Rockstar
  Doomsday promotion 39,118 bytes; Half-Life 48,714 bytes. Smaller variants serve
  compact layouts. The new procedural graphics require no image downloads.

### 7 October follow-up validation

- 284 frontend tests verified: 58 suites passed on the full run; the circuit
  suite passed all 16 tests after updating its old combined-payment label
  assertion. Asset-pipeline tests and the production build passed; 15 retained
  media releases passed integrity validation. Edited TSX/data modules passed ESLint.
- Actual production preview checked: main tab order, distinct PlayStation web
  composition, purchased-game versus catalog cloud switch, chapter 2 → Valve
  navigation, four loaded Valve images, keyboard menu overlays and public source
  register. No observed browser error logs. 320px circuit and 390px Valve views
  had no horizontal overflow; normal desktop viewport restored.
- The four Valve images total 135,602 bytes at their largest variants; responsive
  layouts request smaller files. No new continuous animation loop was added.
- Local build served on port 3106. These are local checks, not a deployment or
  field-performance measurement. Review images are in the task output folder
  `outputs/sanctuary-business-circuit/`: `playstation-distinct-store.png`,
  `valve-counter-strike-menu.png`, and `cloud-payments-320.png`.


## Next editorial pass — production and engines

Direction accepted in the 7 October discussion; not yet applied to the 29-chapter
reader. Epic should follow Valve as a study of whether success in games and
production tools transfers into a storefront business. Near the end of the act,
a dedicated production chapter opens the studio box: what goes into one game,
what an engine supplies, who provides the rest, and how those obligations connect
to monetization. Unreal is the main case, with historical and business contrasts
including id technology, Valve/Source, CRYENGINE, Frostbite, REDengine, Unity and
Godot. Concord remains the act's commercial-risk closing; Gauntlet opens the
next act.

See [Production and platform research](FIRST_ACT_PRODUCTION_RESEARCH.md) for the
continuous narrative brief, visual plan, verified primary sources and limits on
the Valve naming metaphor and Epic comparison. This section records direction,
not a claim that the new manuscript or graphics have shipped.


## 7 October — world-building chapter drafted

The local reader now has 30 chapters. `making-worlds` (The work of making a world)
follows Rockstar and precedes Concord, closing the production discussion before
the act's commercial-risk case. Epic's current position is unchanged; the
proposed further reordering above remains a separate editorial task. The new
chapter compares authored encounters, ambient systems, player invention and
simulated histories, explains CDPR's Unreal partnership, and gives the author's
Loopforge project a bounded interactive example. Chapter 1 remains untouched.
See [manuscript](WORLD_BUILDING_MANUSCRIPT.md) and
[implementation record](WORLD_BUILDING_IMPLEMENTATION.md).

## 8 October — one generation, different businesses

The company sequence is now Valve (3), Epic (4), Rockstar (5), followed by
agreements, cloud and purchase history. GTA (1997), Half-Life and Unreal (1998)
anchor a shared period of game history, not identical corporate founding dates.
The three businesses retain overlaps: the contrast is what their accumulated
work enabled them to build, not exclusive identities. Chapter 2 hints at Valve’s
hardware move; chapter 3 develops the library/device relationship and includes
the developer catalog and an original Steam Deck equipment illustration.
