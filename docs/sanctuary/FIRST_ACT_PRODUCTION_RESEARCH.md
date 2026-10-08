# Sanctuary Economics — production, engines and platform transitions

Editorial direction and primary-source research · 7 October 2026.
Research brief retained as the record of the proposed scope. On 7 October,
the continuous manuscript in WORLD_BUILDING_MANUSCRIPT.md was implemented as
`making-worlds`, between Rockstar and Concord. The local reader now has 30
chapters. On 8 October, the company sequence became Valve → Epic → Rockstar. The deeper
production/engine chapter remains before Concord. The approved chapter 1 is unchanged.
See WORLD_BUILDING_IMPLEMENTATION.md for the delivered scope and verification.

## The missing question

Chapter 2 follows a game from its maker to its player. It treats the studio as
one participant without opening up the work inside it. The production chapter
must answer: what actually goes into making one game, who supplies it, who pays
for it, and what remains to be paid for after release?

An engine comparison alone would miss that purpose. Begin with a playable scene,
then uncover the creative work, reusable technology, production tools and
services that make it possible. Unreal is the main case study; Unity and the
other examples establish different arrangements rather than a quality ranking.

Place this chapter late in the first act, before Concord closes the act. The
reader should understand the work and commitments behind a release before
confronting the commercial risk of failing to find an audience. Gauntlet then
opens the next act: payment can also become a rule inside the game.

Valve should lead directly to the Epic business chapter. The engine chapter
returns to Epic later, with a different question: the work and economics of
production, rather than the competition for distribution. Retain the platform,
cloud, purchased-copy history and Rockstar material between those company
chapters and the act's production/Concord closing as appropriate during the
continuous manuscript pass. Do not insert a second condensed engine survey in
Epic's chapter.

## Narrative progression

Open with one small, concrete piece of play: entering a room, noticing an enemy,
acting and seeing the world respond. Establish an original illustrative scene,
not an invented account of a named studio's production. Use it throughout the
chapter so that each new layer explains something the reader already recognizes.

1. **Deciding what to make.** A playable prototype tests the central idea;
   production planning connects its scope to people, time and funding. Explain
   iteration: trying a mechanic can force a change to the level, animation or
   controls. This is not an assembly line with a guaranteed result at the end.
2. **Making the particular world.** Level design, writing, environment and
   character art, animation, performance, music, sound, interfaces and gameplay
   programming. Distinguish responsibilities from headcount: one small team can
   combine roles, while a large production can use several studios and vendors.
3. **The machinery shared between worlds.** Introduce the engine as reusable
   software and editing tools for bringing a game's data and rules into action:
   rendering, input, animation, physics, sound and other systems. Separate the
   editor used during production from the runtime shipped with the game.
   Explain that an engine supports implementation; it does not supply a game's
   finished creative identity or decide whether its rules are enjoyable.
4. **Making the pieces work together.** Importing assets, revision control,
   repeatable builds, testing, profiling, accessibility, localization and platform
   release work. External art tools, audio middleware and online services can
   accompany the engine. Do not imply that each item is automatically included
   in an engine license or that a single vendor must supply the whole stack.
5. **Choosing what to build and what to obtain.** An internal engine requires
   continuing engineering work. Licensing shared technology changes where some
   work happens, introduces vendor dependencies and may change recruitment and
   training needs. Avoid an unsupported claim that either choice is always
   cheaper. CD PROJEKT RED supplies the concrete documented decision below.
6. **Following the obligations.** Labor and contractors, software seats,
   conditional royalties, purchased assets, platform distribution, support and
   hosting are different costs. Recurring costs to a studio do not by themselves
   prescribe a subscription for the player. A purchased game, an expansion,
   optional items and a catalog contract distribute recovery differently.
7. **After release.** Separate keeping software functional, operating online
   services and producing new material. All can require further work; they are
   not the same commitment. End with the exposure that leads into Concord:
   completing a working game does not guarantee enough demand to finance the
   work already done or the future that was planned around it.

Production roles: [ScreenSkills games roles](https://www.screenskills.com/job-profiles/browse/games/)
and [producer profile](https://www.screenskills.com/job-profiles/browse/games/production/games-producer-games/).
Use these for responsibilities, not representative budgets or a universal team
organization. The scene and arrangement above are our explanatory synthesis.

## Engine cases and the point each earns

| Example | Why it belongs | Evidence boundary |
| --- | --- | --- |
| id Software / Doom and Quake technology | Earlier history of reusable game technology, licensing and later source releases. | Verify dates and specific commercial relationships before publication; an open engine source release does not also release the game's art. |
| Valve / GoldSrc and Source | Connects the preceding Valve chapter to the production choices behind its own games. | Newell discusses technical priorities in terms of player experience; do not claim Valve stopped making engines when Steam appeared. |
| Epic / Unreal | Main case: tools used to make games also become a product for other developers. | Explain technology, license and store as separate relationships. Source access is not the same thing as an open-source license. |
| Crytek / CRYENGINE | Another commercial engine offered to external developers. | Do not infer present market share or equal adoption from inclusion in this survey. |
| EA / Frostbite | Shared technology financed within a publisher's group. | EA says its game teams may choose other engines; do not present Frostbite as mandatory across EA. |
| CD PROJEKT RED / REDengine to Unreal | Concrete make-or-license decision by a studio already introduced in the cloud comparison. | Cyberpunk 2077 remains a REDengine example; the announced Witcher partnership is not evidence of a retroactive conversion. |
| Unity | Widely available production tools with subscription-based paid editor plans, plus an instructive dispute over how to charge. | The proposed Runtime Fee was cancelled in 2024 and was not implemented. Keep current plan terms separate from the historical proposal. |
| Godot | An open-source engine changes the license bill and control over the code. | MIT licensing does not make staffing, integration, support, ports or online services costless. |

Read and verified sources:

- [id's Quake source release](https://github.com/id-Software/Quake): code/data
  distinction in the release instructions. Further period evidence is still
  needed for the historical licensing vignette.
- [EA's description of Frostbite](https://www.ea.com/frostbite/engine) and
  [its revised engine strategy](https://www.ea.com/ea-play/news/frostbite-rebrand-2024):
  shared workflows and the explicit statement that teams may choose an engine.
- [CD PROJEKT RED, 21 March 2022](https://www.cdprojekt.com/en/media/news/new-witcher-saga-announced-cd-projekt-red-begins-development-on-unreal-engine-5-as-part-of-a-strategic-partnership-with-epic-games/):
  CTO Paweł Zawodny connects the decision to effort spent adapting REDengine and
  expected gains in production predictability. This is management's rationale,
  not independently measured savings. Both companies describe joint development.
- [Unreal license](https://www.unrealengine.com/license) and
  [release programs](https://www.unrealengine.com/release), checked 7 October 2026:
  standard qualifying game royalties are 5% above the first US$1m in lifetime
  gross product revenue; exclusions and other conditions apply. Epic-store
  revenue is royalty-exempt; qualifying Launch Everywhere releases can use 3.5%.
  Custom agreements exist. Never add store and engine headline percentages as
  if they necessarily applied to identical revenue bases.
- [Unity's cancellation statement, 12 September 2024](https://unity.com/blog/unity-is-canceling-the-runtime-fee)
  and [current pricing explanations](https://unity.com/products/pricing-updates):
  distinguish free eligibility, paid seats and other services. Avoid stale seat
  prices and any claim Unity currently bills installations under that proposal.
- [CRYENGINE licensing](https://www.cryengine.com/support/view/licensing).
- [Godot license](https://godotengine.org/license/): commercial games may remain
  proprietary; applicable license notices still accompany the engine.

## Visual and analytical treatment

The opening should show the scene before prose. An exploded workshop view lets
the reader inspect geometry/materials, animation and sound, rules and runtime,
then the complete scene. Retain the same camera and geometry across states so
selection explains a contribution instead of replacing the subject. Use the
deck's warm metal, dark paper, controlled light and original procedural detail.
A gameplay image and an editor image from the same verified project would be
useful direct visual citations; source, rights rationale and optimization must
be completed before any new image is published.

A second view follows people and payments around that scene. Engine vendor,
asset/tool suppliers, studio, publisher/store, online services and player have
different customers. Show work flowing toward the game and payments to the
relevant suppliers. Selecting a route highlights both ends. An optional cost
view can separate production, conditional sales-based fees and continuing
operation; it must not invent industry-wide percentage shares.

For analytics, establish a measurement before drawing its chart. Useful questions
include iteration/build time, performance on target hardware, production spend
over time, receipts after applicable deductions and online-service cost. A worked
royalty example may use explicit hypothetical inputs and documented terms.
Do not portray an assumed budget as an observed game's accounts or compare
vendor revenues whose reporting categories differ.

## Valve released Steam: documented reflection and our metaphor

The name offers an intentional visual bridge for our essay: Valve, Steam and
the mechanics of distribution. No reliable statement has been located that
explains the naming as a plan to regulate industry flows. Keep that interpretation
ours. Avoid retroactively attributing today's platform position to a naming
decision made years earlier.

In [John Walker's 2007 Newell interview](https://www.rockpapershotgun.com/rps-exclusive-gabe-newell-interview)
([readable mirror](https://unvis.it/www.rockpapershotgun.com/rps-exclusive-gabe-newell-interview)),
Newell explicitly connects digital delivery to less physical inventory risk,
hardware information, feedback on play and direct ways to reach customers.
His short formulation, “On Steam there's no shelf-space restriction,” supplies
a concrete hinge. The economic interpretation is that distribution constraints
affect what creators can attempt; digital abundance then makes discovery a
different problem. Newell also describes allocating engine work according to
the intended experience rather than trying to improve every technical system.

In [Adam Doree's September 2007 interview](https://games.kikizo.com/features/gabenewell_valve_iv_sep07_p1.asp),
Newell explains how smaller releases and The Orange Box let Valve contain the
financial exposure of experimenting with Portal. The statement concerns that
release strategy; it is not a Steam naming explanation or evidence that Steam
alone enabled the game.

## The Epic follow-up must test its premise

Epic's newer store is not a younger company: Epic dates to 1991, Valve to 1996.
Unreal, Fortnite and the store serve different customers, and success in one
does not establish success in every other role.

- [Epic's 2018 store announcement](https://www.unrealengine.com/blog/announcing-the-epic-games-store?lang=en-US)
  makes the integration argument itself: Fortnite's payment scale, existing
  tools and launcher support a more favorable offer to developers. Use this
  before assessing the results; do not invent what management intended.
- [Epic's 2025 store review](https://store.epicgames.com/news/epic-games-store-2025-year-in-review?lang=en-US)
  reports US$400m third-party PC consumer spending, up 57%, within US$1.16bn total.
  Taxes are included; developer-processed in-game payments are excluded. These
  are not Epic's net revenue, profit, or a market-share comparison with Steam.
- [Sweeney's March 2026 layoff statement](https://www.epicgames.com/site/news/todays-layoffs)
  attributes more than 1,000 layoffs to spending exceeding income amid a
  Fortnite engagement downturn. This is a serious counterpoint to expansion,
  not proof that the store or engine business independently failed.
- [Valve's Cloud Play documentation](https://partner.steamgames.com/doc/features/cloudgaming)
  keeps Steam purchases and partner payouts intact when an opted-in game runs
  through GeForce NOW. NVIDIA also supports other stores. Cloud computing can
  complement an existing library without moving its checkout; we have not
  measured that Steam benefits more than players or shown NVIDIA pays Steam.

The bridge from Valve to Epic is a question about transferring a relationship:
can people who use your game or your tools become customers of your store?
Engine licensing adds another possibility: Epic may earn from a qualifying game
sold by a competing storefront. This makes the later production chapter central
to understanding the ecosystem, rather than a technical appendix.


## World-building comparison and the Loopforge invitation

The owner wants this comparison to make Loopforge worth investigating. See
[World building and Loopforge](WORLD_BUILDING_AND_LOOPFORGE.md) for the selected
headlines, peer examples, production economics and code-grounded limits on
current claims. The invitation should demonstrate simulation consequences and
character expression. It belongs within the production chapter; it does not
replace the broader analysis or present Loopforge as a general-purpose engine
with feature parity to Unreal. Runtime chapters have not yet changed.
