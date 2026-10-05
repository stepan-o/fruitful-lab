import type { Chapter, EvidenceSource } from "./types";
import { chapterVisuals } from "./visual-content";
import { chainSources } from "./business-chains";

export const parts = [
  "Play, payment and the next purchase",
  "Studios, games and players",
  "Why people play",
  "How play takes shape",
  "What money buys",
  "The purchase path",
  "What counts as success",
];
export const revision = "2026-10-05";
export const sources: EvidenceSource[] = [
  {"id": "alcorn-oral", "title": "Al Alcorn — oral history, Computer History Museum, 2008, p. 13", "url": "https://archive.computerhistory.org/resources/access/text/2012/09/102658257-05-01-acc.pdf", "note": "Collection rounds, rear coin access and the several-customers observation. Recollection recorded in 2008; our closing interpretation is separate."},
  {"id": "epic-publishing", "title": "Epic Games Publishing — announced terms, 2020", "url": "https://store.epicgames.com/news/epic-games-publishing-announcement?lang=en-US", "note": "Full funding, developer IP ownership and a profit share after recoupment. A specific public offer, not a universal publishing contract."},
  {"id": "steam-cloud", "title": "Valve — Steam Cloud Play (Beta)", "url": "https://partner.steamgames.com/doc/features/cloudgaming", "note": "Separate purchase and streaming-service relationship; publisher opt-in, cloud saves and unchanged Steam payouts."},
  {"id": "steam-discovery", "title": "Valve — Marketing tools", "url": "https://partner.steamgames.com/doc/marketing/tools", "note": "Steam does not sell advertising placement. Distinguishes store discovery from paid campaigns elsewhere."},
  {"id": "sony-revenue", "title": "Sony — FY2025 Q4 supplement, p. 12", "url": "https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/25q4_supplement.pdf", "note": "Reported Game & Network Services segment sales. Network Services includes PlayStation Plus and advertising; physical software includes royalties. Figures are not consumer spending or cloud revenue."},
  {"id": "sony-accounting", "title": "Sony — FY2024 Form 20-F, revenue accounting", "url": "https://www.sony.com/en/SonyInfo/IR/library/FY2024_20F_PDF.pdf", "note": "The report distinguishes sales of products, licensing revenue and recognition of subscription fees over time."},
  {"id": "gfn-requirements", "title": "NVIDIA — GeForce NOW Windows requirements, accessed 5 Oct 2026", "url": "https://www.nvidia.com/en-us/geforce-now/system-reqs./", "note": "Selected published stream bandwidth requirements, not measured throughput. The sub-80 ms criterion is network latency to a data center, not total input-to-display latency. Plan and client support vary."},
  {"id": "gfn-service", "title": "NVIDIA — GeForce NOW FAQ, accessed 5 Oct 2026", "url": "https://www.nvidia.com/en-us/geforce-now/faq/", "note": "Membership, premium playtime allowance and Founders exception. Terms describe NVIDIA-operated service; alliance partners can differ."},
  {"id": "cloud-rights", "title": "UK CMA — restructured Microsoft acquisition cleared, 13 Oct 2023", "url": "https://www.gov.uk/government/news/microsoft-concession-a-gamechanger-that-will-promote-competition", "note": "Final approval and Ubisoft cloud-rights arrangement outside the EEA; do not confuse this with the earlier blocked proposal."},
  {"id": "gfn-reach-2021", "title": "NVIDIA — Q1 FY2022 Form 10-Q", "url": "https://www.sec.gov/Archives/edgar/data/1045810/000104581021000064/nvda-20210502.htm", "note": "Over 10 million GeForce NOW members reported for the quarter ended 2 May 2021. Not a paying-user or monthly-active-user measure."},
  {"id": "gfn-reach-2023", "title": "NVIDIA — GeForce NOW third anniversary, 2 Feb 2023", "url": "https://blogs.nvidia.com/blog/geforce-now-thursday-feb-2/", "note": "More than 25 million members. Historical reported reach; no current user count, growth rate or revenue per member is inferred."},
  {...chainSources["amc"], id:"chain-cinema"},
  {...chainSources["netflix"], id:"chain-netflix"},
  {...chainSources["steam-bg3"], id:"chain-bg3"},
  {...chainSources["diablo"], id:"chain-xbox"},
  {...chainSources["hasbro"], id:"chain-hasbro"},
  {...chainSources["microsoft"], id:"chain-microsoft"},

  {id:"arcade-route",title:"Play Meter — Operator survey, 1 November 1984, p. 42",url:"https://elibrary.arcade-museum.com/magazines/pm/PlayMeter-1984-11-01/PlayMeter-1984-11-01-042.pdf",note:"Documents operator/location collection splits. The comparative instrument distinguishes these arrangements from owner-operated venues; neither is attributed to the Pong prototype’s tavern without evidence."},

  {id:"atari-history",title:"Atari — Company history (accessed 5 October 2026)",url:"https://atari.com/pages/history",note:"Atari was founded by Nolan Bushnell and Ted Dabney in 1972; Al Alcorn built Pong. The Atari name later passed through different owners and corporate structures. Infogrames adopted the name Atari SA in 2009. This is a history of a brand and its businesses, not an unchanged studio operating since 1972."},
  {id:"atari-today",title:"Atari — The business today (accessed 5 October 2026)",url:"https://atari.com/pages/about",note:"Atari remains active in 2026. Its business includes video-game publishing, consumer hardware and licensing. Its studios include Nightdive, which restores classic games such as System Shock, and Digital Eclipse, which makes interactive game-history collections. Its wider portfolio includes RollerCoaster Tycoon. This is the company’s description of its current activities, not evidence of continuous profitability since Pong."},
  {"id":"pong-tavern","title":"Computer History Museum — 50 Years of Fun With Pong (2022)","url":"https://computerhistory.org/blog/50-years-of-fun-with-pong/","note":"The museum preserves the prototype and documents its 1972 installation at Andy Capp’s Tavern. Used for the setting and game description, not as evidence of the venue owner’s motives or additional beverage sales."},
  {"id":"alone-together","title":"Ducheneaut, Yee, Nickell & Moore — Alone Together? (CHI 2006)","url":"https://www.nickyee.com/pubs/Ducheneaut,%20Yee,%20Nickell,%20Moore%20-%20Alone%20Together%20(2006).pdf","note":"Observational study of World of Warcraft distinguishes grouping from other players’ roles as audience and social presence. Its findings and interpretations concern that game and period, not all online worlds or Diablo IV specifically."},
  { id: "gauntlet-logg", title: "Ed Logg — Gauntlet postmortem, GDC 2012 (PDF pp. 6, 8, 15–16, 31, 40)", url: "https://media.gdcvault.com/gdc2012/slides/Design%20Track/Logg_Ed_Gauntlet_Postmortem.pdf", note: "The designer’s retrospective connects quarter-price resistance to simultaneous and drop-in play, records marketing’s doubt about four strangers playing together, distinguishes cabinet sales from coin collections, and explains the ending decision. Dungeons & Dragons and Dandy were also creative inspirations (p. 10). A retrospective, not an audited financial account." },
  { id: "computer-space", title: "The Strong — Computer Space (museum collection history)", url: "https://www.museumofplay.org/games/computer-space/", note: "The museum traces the 1971 commercial machine to the existing coin-operated amusement business. Used to place Gauntlet within an older commercial history." },
  { id: "pong-origins", title: "Computer History Museum — Pong", url: "https://www.computerhistory.org/revolution/computer-games/16/183", note: "Museum account and Al Alcorn’s recollection of the 1972 bar prototype; documents a paid-play business at the early commercialization of video games." },
  {"id": "netflix-engagement", "title": "Netflix — Q2 2024 shareholder letter, pp. 3–4 (18 July 2024)", "url": "https://ir.netflix.net/files/doc_financials/2024/q2/FINAL-Q2-24-Shareholder-Letter.pdf", "note": "Management connects viewing with member satisfaction, retention and acquisition, and explains its investment in varied programming. A stated business rationale, not an independent measure of audience wellbeing."},
  {"id": "wga-streaming-2023", "title": "Writers Guild of America — Summary of the 2023 agreement", "url": "https://www.wgacontract2023.org/the-campaign/summary-of-the-2023-wga-mba", "note": "Historical agreement adds a viewership-based bonus for qualifying high-budget subscription streaming productions and provides the Guild with confidential viewing data. Used as a concrete change in compensation, not a claim about every production or current contract terms."},
  {"id": "bg3-patch8", "title": "Larian — The Final Patch (15 April 2025)", "url": "https://baldursgate3.game/news/the-final-patch-new-subclasses-photo-mode-and-cross-play_138", "note": "Documents added subclasses and cross-play, and the studio’s stated end to major content updates so it can work on another project. Minor fixes and paid editions are separate questions."},
  {"id": "bg-lineage", "title": "BioWare — Games: Baldur’s Gate (1998)", "url": "https://www.bioware.com/games/", "note": "Original developer record of the 1998 game and its Advanced Dungeons & Dragons foundation. The modern BG3 was made by Larian; the studios are not interchangeable."},
  {"id": "digital-economics", "title": "Goldfarb & Tucker — Digital Economics (2017 / 2019)", "url": "https://www.nber.org/papers/w23684", "note": "Research review organized around lower search, replication, transport, tracking and verification costs. The application to the game industry is our synthesis, not a game-specific causal estimate."},
  {"id": "netflix-2007", "title": "Netflix — Instant watching added to subscriptions (16 January 2007)", "url": "https://about.netflix.com/en/news/netflix-offers-subscribers-the-option-of-instantly-watching-movies-on-their", "note": "Original announcement adds streaming to existing DVD subscriptions. Separates changing delivery from inventing a recurring payment model."},
  {"id": "adobe-2013", "title": "Adobe — FY2013 annual report, p. 39", "url": "https://www.adobe.com/content/dam/cc/en/investor-relations/pdfs/ADBE-10K-FY13-FINAL.pdf", "note": "Documents the May 2013 move to deliver new creative features through Creative Cloud, with CS6 the final major perpetual-license release. A bounded cross-industry comparison, not Diablo’s payment model."},
  {"id": "third-places", "title": "Steinkuehler & Williams — Online Games as Third Places (2006)", "url": "https://onlinelibrary.wiley.com/doi/full/10.1111/j.1083-6101.2006.00300.x", "note": "Research combining studies of Lineage and Asheron’s Call examines informal sociability and social relationships. Does not establish the same experience in all games or a universal welfare effect."},

  {
    id: "expedition",
    title: "Sandfall Interactive — Clair Obscur: Expedition 33",
    url: "https://www.expedition33.com/",
    note: "Official description of the RPG, available editions and free Thank You Update (December 2025).",
  },
  {
    id: "koster",
    title: "Raph Koster — A Theory of Fun, authorized excerpt",
    url: "https://www.theoryoffun.com/excerpt.shtml",
    note: "A design argument connecting fun with learning and understanding patterns; not a universal empirical law.",
  },
  {
    id: "yee",
    title: "Nick Yee — Motivations for Play in Online Games (2006)",
    url: "https://www.nickyee.com/pubs/Yee%20-%20Motivations%20%282006%29.pdf",
    note: "A survey-based model of achievement, social and immersion motivations in MMORPG play. Its population and genre limit generalization.",
  },
  {
    id: "mda",
    title: "Hunicke, LeBlanc & Zubek — MDA (2004)",
    url: "https://www.cs.northwestern.edu/~hunicke/MDA.pdf",
    note: "A framework connecting rules, play behavior and intended experience; not a causal revenue model.",
  },
  {
    id: "sdt",
    title:
      "Ryan, Rigby & Przybylski — The Motivational Pull of Video Games (2006)",
    url: "https://selfdeterminationtheory.org/SDT/documents/2006_RyanRigbyPrzybylski_MandE.pdf",
    note: "Four studies examine need satisfaction, enjoyment, preference, well-being and future play.",
  },
  {
    id: "juul",
    title: "Jesper Juul — The Open and the Closed (2002)",
    url: "https://jesperjuul.net/text/openandtheclosed.html",
    note: "Emergence and authored progression can coexist within a game.",
  },
  {
    id: "outer",
    title: "Mobius Digital — Separating the Signal from the Noise (2016)",
    url: "https://www.mobiusdigitalgames.com/news/separating-the-signal-from-the-noise",
    note: "The developer describes signalscope revisions that make clues easier to interpret. Images are prototypes.",
  },
  {
    id: "season",
    title: "Blizzard — Season of the Malignant (2023)",
    url: "https://news.blizzard.com/en-us/article/23976339/season-of-the-malignant-now-live",
    note: "Historical explanation of Seasonal and Eternal realms. Current character-creation text is shown separately.",
  },
  {
    id: "d4-season-philosophy",
    title: "Joe Shely, Joe Piepiora & Kegan Clark — Diablo IV Quarterly Update (August 2022)",
    url: "https://news.blizzard.com/en-us/article/23816415/diablo-iv-quarterly-updateaugust-2022",
    note: "Named developers explain the intended seasonal experience and optional purchases before launch. Evidence of design intent, not current rules, player motives or financial outcomes. Seasons and Battle Pass sections.",
  },
  {
    id: "diablo-story",
    title: "Blizzard — Diablo II: The story so far (2021)",
    url: "https://news.blizzard.com/en-us/article/23725427/diablo-ii-the-story-so-far",
    note: "Publisher account connecting the original descent beneath Tristram Cathedral, its ending and the Dark Wanderer in Diablo II. The Rogue Monastery in Diablo II is a different location.",
  },
  {
    id: "diablo-hellfire",
    title: "GOG — Diablo + Hellfire",
    url: "https://www.gog.com/en/game/diablo",
    note: "The authorized distributor documents Hellfire’s 1997 release, additional class and areas, and separate Synergistic Software development. Its side story is not treated here as the canonical bridge to Diablo II.",
  },
  {
    id: "d4-anniversary",
    title: "Blizzard — Season of Hell’s Legacy: Diablo’s 30th anniversary (2026)",
    url: "https://news.blizzard.com/en-us/article/24295394/celebrate-30-years-of-diablo-in-season-of-hell-s-legacy",
    note: "September 2026 seasonal material revisits Tristram Cathedral and the Prime Evils through memories and echoes. Supports the concrete nostalgia example, not a claim of identical mechanics, canonical resurrection or unchanged business terms. Also documents Rebirth as an alternative to creating a new seasonal character.",
  },
  {
    id: "d2-postmortem",
    title: "Erich Schaefer — Postmortem: Blizzard’s Diablo II (2000)",
    url: "https://www.gamedeveloper.com/design/postmortem-blizzard-s-i-diablo-ii-i-",
    note: "A contemporary designer account of the acts, cinematics, skill trees, replayability and cost of keeping Battle.net free. Originally published in October 2000; online formatting restored in 2024. Supports design intent, not a cinematic budget or revenue breakdown.",
  },
  {
    id: "d2-retrospective",
    title: "Blizzard — Diablo II continues to inspire Blizzard 20 years later (2020)",
    url: "https://news.blizzard.com/en-gb/article/23460551/diablo-ii-continues-to-inspire-blizzard-20-years-later",
    note: "Publisher retrospective on distinct acts, five original classes, skill trees and the two classes added by Lord of Destruction. Refers to the original releases, not the later Resurrected catalog.",
  },
  {
    id: "d2-expansion",
    title: "Blizzard — The Arreat Summit: Lord of Destruction FAQ",
    url: "https://classic.battle.net/diablo2exp/faq/expansion.shtml",
    note: "Documents the separately owned expansion’s fifth act, two classes, equipment and changes to the existing game. Buying the original game included its contents, not all future expansions.",
  },
  {
    id: "d2-ladder",
    title: "Blizzard — The Arreat Summit: Diablo II Realm Character Types",
    url: "https://classic.battle.net/diablo2exp/basics/charactertypes.shtml",
    note: "Legacy Diablo II documentation of fresh ladder characters, a separate economy and transfer to non-ladder after a season. Establishes that shared restarts predate Diablo IV; not a date-of-invention claim or current Resurrected policy.",
  },
  {
    id: "d2-difficulties",
    title: "Blizzard — The Arreat Summit: Diablo II Difficulty Levels",
    url: "https://classic.battle.net/diablo2exp/basics/difficulty.shtml",
    note: "Legacy Diablo II expansion documentation: each character unlocks Nightmare and Hell by completing the preceding difficulty. Supports the repeated act structure, not a claim that all play consisted of replaying the story.",
  },
  {
    id: "d2-ladder-ranking",
    title: "Blizzard — The Arreat Summit: Ladder FAQ",
    url: "https://classic.battle.net/diablo2exp/faq/ladder.shtml",
    note: "Explains ladder listings and experience-based ranking. This legacy FAQ is separate from the evidence dating seasonal ladder characters to patch 1.10.",
  },
  {
    id: "d2-110-launch",
    title: "GameSpot — Diablo II patch released (28 October 2003)",
    url: "https://www.gamespot.com/articles/diablo-ii-patch-released/1100-6077473/",
    note: "Contemporaneous reporting quotes Blizzard announcing patch 1.10 and seasonal ladder characters. Used to date that release, not to date the first Diablo II leaderboard. Season operation is documented by Blizzard’s own guides.",
  },
  {
    id: "reliquary",
    title: "Blizzard — Belial’s Return / Reliquaries (2025)",
    url: "https://news.blizzard.com/en-us/article/24189530/combat-deception-in-season-8-belials-return",
    note: "Historical April 2025 launch rules.",
  },
  {
    id: "auction",
    title: "Blizzard — Diablo III Auction House Update (2013)",
    url: "https://news.blizzard.com/en-gb/article/10974978/diablo-iii-auction-house-update",
    note: "Blizzard said the auction houses undermined the core loot experience and announced their March 2014 removal.",
  },
  {
    id: "concord",
    title: "PlayStation — An Important Update on Concord (2024)",
    url: "https://blog.playstation.com/2024/09/03/an-important-update-on-concord/",
    note: "Launch on August 23; September 3 notice announces September 6 shutdown and refunds. Does not establish development cost or total sales.",
  },
  {
    id: "concord-reveal",
    title: "PlayStation — Concord gameplay revealed (2024)",
    url: "https://blog.playstation.com/2024/05/30/concord-gameplay-revealed-launching-august-23-2024-on-ps5-and-pc/",
    note: "Publisher gameplay reveal and provenance for the PS5 capture available only in the local research edition. A historical image, not a currently playable service.",
  },
  {
    id: "sony",
    title: "Sony — Game & Network Services investor presentation (2022)",
    url: "https://www.sony.com/en/SonyInfo/IR/library/presen/irday/pdf/2022/GNS_E.pdf",
    note: "Historical portfolio plans, including a forecast for live-service franchises. A forecast is not a delivered outcome.",
  },
  {
    id: "halo",
    title: "Halo — Season 2: Lone Wolves launch (2022)",
    url: "https://www.halowaypoint.com/news/season-2-lone-wolves-launch",
    note: "Documents continuing access to premium passes; free-track access has different rules.",
  },
  {
    id: "drg",
    title: "Ghost Ship Games — Reactivating seasons Q&A (2024)",
    url: "https://steamcommunity.com/games/DeepRockGalactic/announcements/detail/4195740093438639601",
    note: "Announced season selection and retained track progress. The illustrated proposal is explicitly work in progress.",
  },
  {
    id: "warframe",
    title: "Digital Extremes — Collect and Customize guide",
    url: "https://www.warframe.com/en/news/collect-and-customize-guide",
    note: "Explains collecting equipment, blueprints, crafting, purchasing and inventory slots.",
  },
  {
    id: "trade",
    title: "Digital Extremes — Trading FAQ",
    url: "https://support.warframe.com/hc/en-us/articles/200092259-Trading-FAQ-Safe-Trading-Tips",
    note: "Documents tradeable Platinum and restrictions, including non-tradeable promotional currency.",
  },
  {
    id: "poe",
    title: "Grinding Gear Games — Premium stash tabs",
    url: "https://www.pathofexile.com/forum/view-thread/3227486",
    note: "Public tabs and pricing connect storage convenience to trade. This does not mean all trading requires a paid tab.",
  },
  {
    id: "experiment",
    title:
      "Microsoft Research — Pitfalls of Long-Term Online Controlled Experiments (2016)",
    url: "https://www.microsoft.com/en-us/research/publication/pitfalls-of-long-term-online-controlled-experiments/",
    note: "Discusses threats to interpreting long-running experiments and changes in effects over time.",
  },
  {
    id: "goods",
    title: "Lehdonvirta — Virtual Item Sales as a Revenue Model (2009)",
    url: "https://vili.lehdonvirta.com/files/Lehdonvirta%202009%20Virtual%20Item%20Sales%20as%20a%20Revenue%20Model.pdf",
    note: "Functional, hedonic and social attributes of virtual goods. The four-goods taxonomy here is our analytical lens.",
  },
  {
    id: "gauntlet",
    title: "Atari — Gauntlet operator manual (1985)",
    url: "https://files.stardustarcade.com/PDF_Arcade_Atari_Kee/Gauntlet/Gauntlet_TM-284_1st_Printing.pdf",
    note: "Original operator documentation, hosted by a public archive. Printed pages 2-2, 2-3 and 3-4 describe health, continuing a run, earnings guidance and operator settings.",
  },
  {
    id: "tf2",
    title: "Valve — Team Fortress 2 becomes free to play (2011)",
    url: "https://www.teamfortress.com/post.php?id=5721",
    note: "A documented business-model transition, not an invention claim.",
  },
  {
    id: "dota",
    title: "Valve — The International Compendium (2013)",
    url: "https://www.dota2.com/international2013/compendium/?l=english",
    note: "Tournament participation, rewards and prize-pool funding preceded many later pass designs.",
  },
  {
    id: "crossy",
    title: "Hall & Sum — Crossy Road, GDC (2015)",
    url: "https://media.gdcvault.com/gdc2015/presentations/Hall_Matthew_Crossy_Road_Whale.pdf",
    note: "Developer retrospective on optional rewarded video and character purchases; a historical design example.",
  },
  {
    id: "bg3",
    title: "Larian — Baldur’s Gate 3",
    url: "https://baldursgate3.game/",
    note: "Official product description explicitly states no microtransactions.",
  },
  {
    id: "elden",
    title: "Bandai Namco — Shadow of the Erdtree",
    url: "https://www.bandainamcoent.com/games/elden-ring/shadow-of-the-erdtree",
    note: "An expansion requiring the Elden Ring base game.",
  },
  {
    id: "witcher",
    title: "CD PROJEKT RED — The Witcher 3 Complete Edition (2022)",
    url: "https://press.cdprojektred.com/en/news/1130/the-witcher-3-wild-hunt-complete-edition-slays-its-way-onto-next-gen",
    note: "Historical bundle with Hearts of Stone, Blood and Wine and 16 DLC releases. Not a claim about every later edition.",
  },
  {
    id: "cyberpunk",
    title: "CD PROJEKT — Phantom Liberty expenditure disclosure (2023)",
    url: "https://www.cdprojekt.com/en/investors/regulatory-announcements/current-report-no-38-2023/",
    note: "Separates expansion production and marketing expenditure. Neither figure is a budget for repairing the base game.",
  },
  {
    id: "hist-season-design",
    title: "Blizzard — First-season rules and design rationale (2023)",
    url: "https://news.blizzard.com/en-us/article/23967322/malignance-runs-rampant-in-the-first-season-of-diablo-iv",
    note: "2023 first-season rules and design rationale; current transfer wording checked separately against the owner capture.",
  },
  {
    id: "d4-postlaunch",
    title: "Blizzard — Diablo IV’s post-launch design (2023)",
    url: "https://news.blizzard.com/en-us/article/23952500/what-you-can-expect-from-diablo-ivs-post-launch-experiences",
    note: "The launch-era description separates seasonal gameplay, optional paid rewards and shop cosmetics. Used for that structure, not current prices or pass rules.",
  },
  {
    id: "d4-expansion-structure",
    title: "Blizzard — Lord of Hatred content and access breakdown (2026)",
    url: "https://news.blizzard.com/en-us/article/24267729/prepare-for-the-reckoning-lord-of-hatred-draws-near",
    note: "The April 2026 announcement distinguishes expansion ownership, permanent updates and seasonal content, and documents campaigns on either realm with eligible campaign skipping. It is not a current-season catalog or a financial disclosure.",
  },
  {
    id: "hist-outer-product",
    title: "Mobius Digital — Outer Wilds",
    url: "https://www.mobiusdigitalgames.com/outer-wilds.html",
    note: "Developer description of the repeating solar system, investigation and tools. Used to distinguish progress in understanding from saved character attributes.",
  },
  {
    id: "hist-outer-demake",
    title: "Alex Beachum / Mobius Digital — Demaking Outer Wilds (2015)",
    url: "https://www.mobiusdigitalgames.com/news/demaking-outer-wilds",
    note: "Firsthand account of paper and text prototypes. Testers taking notes informed the role of the onboard discovery log; this is development evidence, not a player-population study.",
  },
  {
    id: "hist-expedition-update",
    title: "Sandfall Interactive — Thank You update (12 December 2025)",
    url: "https://www.expedition33.com/post/thank-you-update-available-now-thank-you-for-an-amazing-year",
    note: "A dated free update to an authored campaign, illustrating that post-launch additions and ongoing payment are separate choices.",
  },
  {
    id: "hist-bartle",
    title: "Richard Bartle — MUD Advanced Project Report",
    url: "https://mud.co.uk/richard/mapr.htm",
    note: "Historical designer report, especially its charging discussion: hourly access, network fees and a proposed fixed payment for an access period. Proposed tariffs are not evidence of adoption.",
  },
  {
    id: "hist-matchmaking",
    title: "Activision — The Role of Skill in Matchmaking (2024)",
    url: "https://www.activision.com/cdn/research/CallofDuty_Matchmaking_Series_2.pdf",
    note: "Developer white paper describing Call of Duty matchmaking factors and constraint tradeoffs. Used as a separate mechanism example, not to diagnose Concord.",
  },
  {
    id: "hist-valorant",
    title:
      "Keith Gunning / Riot Games — Scalability and Load Testing for VALORANT (2020)",
    url: "https://www.riotgames.com/en/news/scalability-and-load-testing-valorant",
    note: "Firsthand engineering account of the services and end-to-end load testing behind an operated game. No inference about another studio’s costs or architecture.",
  },
  {
    id: "lit-outer-pathing",
    title: "Mobius Digital — The Intentionality of Wandering (2016)",
    url: "https://www.mobiusdigitalgames.com/news/the-intentionality-of-wandering",
    note: "Alex Beachum describes revising path clues so players can choose destinations intentionally. A development account, not a description of every final-game location.",
  },
  {
    id: "lit-indika-official",
    title: "11 bit studios — INDIKA",
    url: "https://11bitstudios.com/games/indika/",
    note: "Publisher premise: a young nun, belief, harsh reality and a journey with the devil. The chapter’s reading of counters and prayer is based on the supplied captures and remains interpretation.",
  },
  {
    id: "lit-loot-reborn",
    title: "Blizzard — Galvanize your Legend in Season 4: Loot Reborn (2024)",
    url: "https://news.blizzard.com/en-us/article/24077223/galvanize-your-legend-in-season-4-loot-reborn",
    note: "Historical developer account of reducing item affixes and drop quantity while shifting customization into crafting. Stated goals are not measured effects or current-season rules.",
  },
  {
    id: "lit-life-fit",
    title:
      "Ballou et al. — Perceived value of video games, but not hours played, predicts mental well-being in casual adult Nintendo players (2025)",
    url: "https://doi.org/10.1098/rsos.241174",
    note: "Primary study of 703 casually engaged US adults. Observational associations, an exploratory draft life-fit measure and inconclusive equivalence tests constrain inference; the study does not establish a causal design benefit.",
  },
  {
    id: "lit-experimentation",
    title: "Kohavi et al. — Online Experimentation at Microsoft (2009)",
    url: "https://www.microsoft.com/en-us/research/publication/online-experimentation-at-microsoft/",
    note: "Randomization and appropriate design support causal inference about measured outcomes. The reference is methodological, not a game-economy experiment.",
  },
  {
    id: "txn-erdtree-entry",
    title: "Bandai Namco — How to enter the Realm of Shadow (2024)",
    url: "https://en.bandainamcoent.eu/elden-ring/news/elden-ring-how-enter-the-realm-of-shadow",
    note: "June 2024 publisher guide documenting the Radahn and Mohg prerequisites; ownership and character readiness are analyzed separately.",
  },
  {
    id: "txn-proteus",
    title: "Yee & Bailenson — The Proteus Effect (2007)",
    url: "https://www.nickyee.com/pubs/Yee%20%26%20Bailenson%20-%20Proteus%20Effect%20%28in%20press%29.pdf",
    note: "Two brief VR experiments with assigned appearances; not a study of cosmetic purchases or long-term game behavior.",
  },
  {
    id: "txn-trade-manifesto",
    title: "Grinding Gear Games — Trade Manifesto (2017)",
    url: "https://www.pathofexile.com/forum/view-thread/2025870",
    note: "Historical developer argument about trade, item value and upgrade frequency; design reasoning rather than experimental evidence.",
  },
  {
    id: "txn-payment-form",
    title: "Raghubir & Srivastava — Monopoly Money (2008)",
    url: "https://www.apa.org/pubs/journals/releases/xap143213.pdf",
    note: "Four consumer experiments on payment form and salience. Full paper also read via its archived copy; results are not a Diablo spending estimate.",
  },
  {
    id: "txn-medium",
    title: "Hsee, Yu, Zhang & Zhang — Medium Maximization (2003)",
    url: "https://bear.warrington.ufl.edu/brenner/mar7588/Papers/hsee-medium-jcr2003.pdf",
    note: "Experiments on intermediate tokens and outcomes; the ice-cream pilot was a questionnaire choice, not observed completion of tasks.",
  },
  {
    id: "txn-dark-patterns",
    title: "Luguri & Strahilevitz — Shining a Light on Dark Patterns (2021)",
    url: "https://academic.oup.com/jla/article/13/1/43/6180579",
    note: "Randomized service-enrollment experiments; effects varied by presentation. Cited for empirical findings only, without legal conclusions.",
  },
];

const manuscript: Omit<Chapter, "visual">[] = [
  {
    "id": "insert-coin",
    "part": 0,
    "title": "Insert coin. Join in.",
    "lede": "An evening out, a game in the corner—and a new business taking shape.",
    "paragraphs": [
      "Books, films and music all face the problem of making the success of one work pay for the time and uncertainty of making another. A game can give someone years of enjoyment after a single purchase. Its studio still has salaries to cover and another release to finance.",
      "To understand how that need can shape the experience of playing, start with the arcade cabinet. It collected money one turn at a time. In 1972, Atari, a newly founded American game company, tested Pong—a two-player paddle-and-ball game built by engineer Al Alcorn—at Andy Capp’s Tavern in California. The game had to make another turn worth buying; the cabinet had to justify its price and its place in the room. Manufacturers sold cabinets. Their buyers earned from play, either running a venue themselves or supplying another owner’s bar for a share of the takings.",
      "Pong’s first famous failure was a sign of success. Called back to the tavern to fix the prototype, Alcorn discovered that its coin container had filled up. Atari had put a new game in front of people to see whether they would pay to play it. The answer arrived as a broken machine, holding more money than it could handle. Long before elaborate virtual worlds, a game could change the life of a room.",
      "Collecting the takings taught Alcorn something that playing Pong never would. The coins were reached from the back, so emptying a cabinet meant moving it—a nuisance he experienced himself on collection stops on his way home. “There are several customers when you make a product,” he recalled. He meant the player, the distributor buying the machine, and the people operating it. Each needed something different from the same cabinet: a game worth playing, a product worth selling, and equipment that could earn its keep without becoming a headache.",
      "The arcade cabinet lets us see, in miniature, the arrangement that makes playing possible—and that arrangement has changed enormously even when the pleasure of playing remains familiar.",
      "Someone makes the game, someone brings it to an audience, someone provides the equipment, and someone collects the payment. Moving from a tavern to a living room to a cloud service changes who does those jobs, who carries their costs and what the player buys."
    ],
    "paragraphCitations": {
      "1": [
        "pong-tavern",
        "arcade-route",
        "atari-history",
        "atari-today"
      ],
      "2": [
        "pong-tavern"
      ],
      "3": [
        "alcorn-oral"
      ]
    },
    "sources": [
      "pong-tavern",
      "arcade-route",
      "atari-history",
      "atari-today",
      "alcorn-oral"
    ],
    "figures": [
      {
        "asset": "pong-cabinet",
        "label": "Pong · the production cabinet",
        "presentation": "archive",
        "alt": "Yellow Pong cabinet with a shared screen, two rotary controls and a coin slot",
        "caption": "The controls ask very little of a newcomer. Each player turns one knob; the other person supplies the opposition. This is the production cabinet that followed the tavern prototype.",
        "credit": "Photo © Rob Boudon · adapted by Ubcule · CC BY 2.0",
        "afterParagraph": 1
      },
      {
        "asset": "pong-doubles-social-1973",
        "label": "Pong Doubles · a familiar invitation, 1973",
        "presentation": "archive",
        "alt": "Two people in tennis clothes pose with rackets beside a Pong Doubles cabinet in a 1973 German advertisement",
        "caption": "The four-player follow-up borrowed tennis’s social world to introduce an electronic one. Rackets and sportswear make the invitation familiar before anyone touches a control. A staged promotional photograph, from the German brochure.",
        "credit": "© Atari / Löwen Automaten · International Arcade Museum",
        "afterParagraph": 1
      }
    ],
    "evidence": "Pong’s prototype installation and overflowing coin container are documented by the Computer History Museum. Alcorn’s 2008 oral history, printed page 13, supplies the collection-round anecdote and the short quotation. The argument about the work behind an enjoyable occasion is our interpretation. The illustrated bar is an imagined contemporary setting, not a reconstruction of Andy Capp’s Tavern. Operator/location arrangements varied; no revenue split or drink-sales effect is assigned to that venue. Atari’s later corporate history is distinguished from the original company."
  },
  {
    "id": "studio-to-screen",
    "part": 0,
    "title": "From studio to screen",
    "lede": "The game reaches us through a chain of other businesses. Each sells something different. Each leaves a mark on what can be made and how we get to play.",
    "paragraphs": [
      "A player buys a game, but a great deal has already been bought to bring it to that point: people’s time, production tools, permission to use a fictional world, a route to market. After release, somebody must still provide the equipment and services on which it runs. The company whose name appears on the box may do several of these jobs. It may also depend on businesses the player never sees.",
      "Cinema makes the separation easier to recognize. A production company makes a film; a distributor arranges its release and campaign; an exhibitor runs the cinema. The audience buys admission from the exhibitor, which settles with the distributor under its exhibition agreement. Netflix rearranges that chain: it commissions or licenses work and operates the service through which subscribers find and watch it. Advertising can introduce another customer, buying access to that audience. A screen at the end of the chain does not imply the same business behind it.",
      "Games add another movable part. Their worlds have to be computed as someone plays. The cabinet operator once supplied that machinery. At home, the player usually buys it. A cloud service can supply it again from a data center. Keep that distinction separate from access to the game: buying a copy, subscribing to a catalog and renting remote computing are different transactions, even when one company packages them together.",
      "The comparison below holds those questions steady across eight routes. Follow Baldur’s Gate 3, Larian Studios’ party-based fantasy role-playing game, through a local PC, GeForce NOW and PlayStation. The adventure remains recognizable while the surrounding bills change. Then compare buying Diablo IV on Xbox with accessing its base game through Game Pass. The subscription changes the entry offer; it does not turn every additional purchase inside the game into an included benefit.",
      "Before any of those sales, someone has to carry the production risk. A studio can use its own funds, raise investment or agree with a publisher to finance the work. These arrangements grant different claims on its eventual success. Epic’s 2020 publishing offer provides a concrete example: it announced full development funding, developer ownership of the intellectual property, and at least half the profits for the developer after costs were recovered. Funding a game, owning its fictional world and receiving its sales revenue are separable rights.",
      "Publishing also brings work that a player rarely calls game design: localization, testing, release planning, platform submissions and promotion. A licensed setting adds another relationship. Larian develops and publishes Baldur’s Gate 3; its Dungeons & Dragons setting belongs to Wizards of the Coast, part of Hasbro. Hasbro reports digital licensing revenue from the game. A purchase can therefore support both the people making this particular work and the owner of the world on which it draws.",
      "Being available is only the beginning of distribution. Storefront recommendations, trailers, reviews, creators and friends help a game find its audience. These channels have different economics. Steam says it does not sell paid placement in its store; a publisher can still buy advertising elsewhere. The cost of reaching a buyer should not be confused with the store’s share of a sale. Nor does a conspicuous launch tell us what its campaign cost.",
      "A platform can occupy several places at once. Sony sells PlayStation hardware, operates its store and membership service, and publishes games through its own studios. Microsoft owns both Xbox and Blizzard, Diablo IV’s developer. A first-party title belongs to the platform holder’s own business; a third-party title comes from another company. The distinction matters when following receipts: an external publishing payment and an internal investment in a studio are not the same transaction.",
      "Sony’s reported revenue makes that range tangible. Consoles are only one part of its Game & Network Services segment. Full-game downloads, add-on content and network services form distinct businesses beside them. These are company accounts, not a breakdown of an average player’s spending: for example, the physical-software category includes royalties from other publishers’ discs. The categories tell us what Sony earns from, without telling us what any one game ought to sell.",
      "Cloud gaming moves the rendering machine away from the player. With GeForce NOW, an eligible PC game can run on NVIDIA’s hardware while the player’s device sends inputs and receives a video stream. Steam’s Cloud Play documentation says game purchases and publisher payouts remain on their existing terms. A paid GeForce NOW membership adds a computing service around that purchase. A free tier also exists. This is a different offer from a catalog subscription that grants access to games.",
      "The potential audience changes with that move. Someone without a powerful gaming PC may be able to use a compatible lighter device instead. But the demanding work has moved rather than vanished. The provider must provision rendering capacity; the connection must carry the stream quickly and reliably. NVIDIA’s requirements make that exchange visible: higher resolutions and frame rates ask for more bandwidth, while network delay remains a separate constraint.",
      "For a studio, this creates another route to players, not permission to ignore every other machine. A PC game offered both locally and through GeForce NOW still needs to serve its local customers. The streamed version must also handle accounts, saved progress, input devices and the service’s supported configuration. Valve’s onboarding guidance requires publisher opt-in and attention to cloud saves. A game designed exclusively around remote infrastructure could make different assumptions; adding an existing PC game to a streaming service does not by itself make it that kind of game.",
      "Permission to stream is itself a business layer. In the restructured Microsoft–Activision Blizzard acquisition approved in October 2023, Ubisoft obtained cloud streaming rights outside the European Economic Area for the relevant existing games and new releases over the following fifteen years. Ownership of a studio did not automatically settle who could supply its games to cloud services. The route to the player was valuable enough to be negotiated separately.",
      "Usage now has a cost even when the player has already bought the work. NVIDIA’s standard Performance and Ultimate memberships include 100 premium hours per month, with options for extra time; the base Founders membership has different terms. This limit concerns access to remote machinery. It does not refill a character’s health. That distinction will matter when we return to Gauntlet: payment can govern the circumstances in which a world is available, or become a rule inside the world itself."
    ],
    "sections": [
      {
        "at": 4,
        "title": "Before the first copy is sold"
      },
      {
        "at": 6,
        "title": "The road to an audience"
      },
      {
        "at": 9,
        "title": "The machine moves out of the room"
      },
      {
        "at": 12,
        "title": "A new right to sell"
      }
    ],
    "paragraphCitations": {
      "1": [
        "chain-cinema",
        "chain-netflix"
      ],
      "3": [
        "chain-bg3",
        "chain-xbox"
      ],
      "4": [
        "epic-publishing"
      ],
      "5": [
        "chain-bg3",
        "chain-hasbro"
      ],
      "6": [
        "steam-discovery"
      ],
      "7": [
        "chain-microsoft"
      ],
      "8": [
        "sony-revenue"
      ],
      "9": [
        "steam-cloud"
      ],
      "10": [
        "gfn-requirements"
      ],
      "11": [
        "steam-cloud"
      ],
      "12": [
        "cloud-rights"
      ],
      "13": [
        "gfn-service"
      ]
    },
    "sources": [
      "chain-cinema",
      "chain-netflix",
      "chain-bg3",
      "chain-xbox",
      "epic-publishing",
      "chain-hasbro",
      "steam-discovery",
      "chain-microsoft",
      "sony-revenue",
      "sony-accounting",
      "steam-cloud",
      "gfn-requirements",
      "cloud-rights",
      "gfn-service",
      "gfn-reach-2021",
      "gfn-reach-2023"
    ],
    "figures": [
      {
        "asset": "bg3-official-key-art",
        "alt": "Baldur’s Gate 3 companions beneath a mind flayer ship",
        "caption": "The same creative work can pass through several commercial routes. Larian’s game uses Wizards of the Coast’s Dungeons & Dragons world; a PC purchase and a cloud-computing membership pay for different parts of the experience.",
        "credit": "© Wizards of the Coast / Larian Studios",
        "afterParagraph": 5
      }
    ],
    "evidence": "The chain is an analytical model of selected offers, not a universal contractual structure. Private royalties, commissions, recoupment and per-title subscription payments are not estimated. Epic’s public 2020 terms are a dated example, not the terms of every publishing deal. Sony figures use its FY2025 Q4 supplement (printed p. 12); FY24 and FY25 end 31 March 2025 and 2026. Amounts are reported segment sales, include intersegment activity and follow Sony’s revenue-recognition rules, not gross player spending. GeForce NOW bandwidth values are selected Windows-client modes checked 5 October 2026. Member milestones are historical company claims, not active or paying users; they cannot establish a market share, profit or causal effect on game sales. Cloud-rights geography follows the final CMA announcement. Our production implications are an inference from the documented delivery architecture, not a claim that studios have abandoned local hardware targets."
  },
  {
    "id": "how-many-lives",
    "part": 0,
    "title": "How many lives does a coin buy?",
    "lede": "In Gauntlet, the business outside the cabinet reaches into the rules of the world.",
    "paragraphs": [
      "Gauntlet, released in 1985, let its players explore monster-filled mazes as fantasy adventurers. Each had a health counter. Time and injuries wore it down; food replenished it. So did money. Put in another coin and your character could stay alive longer. The machine sold a resource that existed only inside its fiction, helping determine how long you could take part.",
      "Call it selling “air,” if you like. Yet buying another stretch of imaginary life could mean getting farther with the people beside you. A cinema ticket also buys something that is over at the end of the evening. We understand the value of being there while it happens. The unusual thing about Gauntlet is how directly it made that participation a resource inside the adventure.",
      "Four-player cooperation had a business argument behind it. Designer Ed Logg recalled resistance to charging more than the customary quarter. More players at once offered another route to higher earnings, especially if they could join and leave without interrupting everyone else. Marketing was unconvinced: “Marketing believed I could not get four strangers to play together.” Making the gathering work promised both a distinctive pleasure for players and a better-earning cabinet.",
      "The operator could make further design choices after the cabinet arrived. Atari’s manual placed these under the heading “Maximizing Earnings.” For US quarter play, it recommends more health when average play falls below 90 seconds. Above 180 seconds, it recommends harder difficulty first: more frequent monsters, before a reduction in the visible health allowance that might discourage players. The price at the coin slot stays the same. The conditions under which the purchased health must last have changed.",
      "A harder fight might be exactly what a player enjoys. A turn that feels over before it has begun might send them elsewhere. The operator is adjusting a commercial offer through the rules of the world; players encounter the adjustment as monsters, danger and a dwindling chance of survival. Keeping the machine earning and making the evening worth coming out for are related ambitions. They are not interchangeable measures of success.",
      "The most revealing decision concerned the ending. Logg recalled that the team considered a final monster, then rejected it: “we did not want players coins lost with a game over.” Someone could reach the end with purchased health still remaining. Instead, the levels recirculated. The game could continue taking money, but it also continued honoring money already taken. The purchase reached all the way into the shape of the adventure.",
      "There is something strikingly contemporary in that old cabinet. An imaginary resource for sale; a design built to accommodate repeated payments; a shared experience whose appeal makes those payments possible. These negotiations were already under way near the beginning of commercial video games. They helped shape features we might remember fondly, as well as terms we might question. The interesting history lies in how those arrangements changed—and how much could change while the familiar pleasures of playing survived.",
      "Take the game home in a box and a different bargain becomes possible. A character can die, an adventure can end, and its owner can begin again without buying another turn. A studio can earn from new buyers or from making something else its existing audience wants to buy. An evening can become years of play without those years being sold one turn at a time."
    ],
    "paragraphCitations": {
      "0": [
        "gauntlet"
      ],
      "2": [
        "gauntlet-logg"
      ],
      "3": [
        "gauntlet"
      ],
      "5": [
        "gauntlet-logg"
      ]
    },
    "sources": [
      "gauntlet",
      "gauntlet-logg"
    ],
    "figures": [
      {
        "asset": "gauntlet-gameplay-1985",
        "label": "Gauntlet · inside the paid adventure",
        "presentation": "pixels",
        "alt": "Gauntlet arcade gameplay with Warrior score and health, three INSERT COIN prompts, and 1 COIN 700 HEALTH",
        "caption": "The dungeon and the offer occupy the same screen. Look at the right-hand column: it records the adventure already under way while leaving room for someone else to join.",
        "credit": "© Atari Games · Atarimuseum.de",
        "afterParagraph": 0,
        "details": [
          {
            "label": "Score & health",
            "text": "Score records achievement; health is the reserve that permits continued play. Money replenishes the latter. The two counters keep those roles distinct.",
            "rect": [
              70,
              13,
              29,
              17
            ]
          },
          {
            "label": "Room to join",
            "text": "The Warrior is already playing. The other three character positions still invite a coin, so joining does not require waiting for the current run to finish.",
            "rect": [
              70,
              30,
              29,
              50
            ]
          },
          {
            "label": "The exchange rate",
            "text": "This capture offers 700 health for one coin. The operator could change that allowance; 700 is a visible setting here, not a fixed price across every cabinet.",
            "rect": [
              68,
              82,
              31,
              12
            ]
          }
        ]
      },
      {
        "asset": "gauntlet-flyer-front-1985",
        "label": "The invitation · Atari Games, 1985",
        "presentation": "archive",
        "alt": "Gauntlet sales flyer with fantasy lettering and a cabinet with four color-coded player positions",
        "caption": "Four control positions turn the cabinet into a small gathering place. The fantasy belongs on its sides as well as its screen: the machine advertises the adventure across the room.",
        "credit": "© Atari Games · International Arcade Museum",
        "afterParagraph": 2
      },
      {
        "asset": "gauntlet-flyer-back-1985",
        "label": "The offer to the operator · 1985",
        "presentation": "archive",
        "alt": "Reverse of the Gauntlet sales flyer showing people playing and headings Four quarters at once and More options, more profits",
        "caption": "“Four quarters at once!” is the manufacturer’s own heading. The same sheet promotes cooperation, joining a game in progress and adjustable health allowances. Social play and the earnings pitch arrive together.",
        "credit": "© Atari Games · International Arcade Museum",
        "afterParagraph": 2
      },
      {
        "asset": "gauntlet-options-manual-p3-4",
        "alt": "Gauntlet operator manual: difficulty and health per coin in the same settings table",
        "caption": "The operator’s controls, 1985. Health per coin ranges from 100 to 2,000; difficulty has a separate setting. Enlarge to inspect the original table.",
        "credit": "Atari Games · manual preserved by Stardust Arcade",
        "afterParagraph": 4
      }
    ],
    "evidence": "Gauntlet is a later case, not the first commercial video game. Atari’s manual supplies health/food/continuation rules (printed 2–2), earnings guidance for US 25¢ play (2–3), and settings (3–4); its recommendations do not establish a universal optimum or guarantee duration. Ed Logg’s GDC 2012 retrospective describes the sales chain (PDF pp. 6, 8), price resistance and simultaneous/drop-in play (15–16), marketing’s doubt (31), and the final-monster decision (40). His creative inspirations also included Dungeons & Dragons and Dandy (10); the essay does not assign cooperation a solely financial origin. Roles could overlap or share receipts. These are a designer’s recollections, not audited financial findings. The implications for creative form and audience value are the essay’s analysis. Original explanatory art is not a reconstruction of a historical venue or licensed cabinet."
  },
  {
    "id": "several-histories",
    "part": 0,
    "title": "The next attempt is already paid for",
    "lede": "Buying a copy changes the bargain. A character can die and a story can end without the player having to buy another turn.",
    "paragraphs": [
      "Bring the game home and the room around it changes. The purchaser supplies a screen, a place to sit and occasions to play. Friends may still join in; someone may prefer an evening alone. A bought copy can furnish either sort of occasion repeatedly. Its commercial promise concerns access to the work, while the life people build around it remains their own.",
      "Blizzard Entertainment released Diablo II in 2000. An action role-playing game, it lets the player guide a hero through a dark fantasy adventure while developing abilities and finding equipment. It expanded the original Diablo’s descent beneath a cathedral into four acts, the major sections of its journey. Cinematic sequences connected the places and conflicts. The adventure had a destination, but reaching it did not exhaust the game.",
      "Five character classes offered different abilities, with choices within each class. Randomized maps, equipment and harder versions of the adventure supported repeated play. Designer Erich Schaefer described the appeal of “strategies that can be debated and experimented with.” You could try another class or build the same one differently. Replayability belonged to the product you had bought.",
      "That purchase included the classes, acts and item systems of the release. Equipment came through play and trade; Battle.net, Blizzard’s online service, charged no subscription. A purchased product could therefore include a place to connect with others. Lord of Destruction added a fifth act and two classes in 2001 for another purchase. The smaller box sold additional work, while repeated play of what was already owned remained part of the earlier bargain.",
      "Three endings have come apart. A death may end an attempt. A final encounter may resolve the story. Neither necessarily ends the paid opportunity to play. A reader can finish a book and reread it; a player can finish an adventure and explore a different way through. A work with an ending can still occupy someone for years.",
      "Even a deliberately renewed competition need not collect a new payment. A ladder ranks online characters by experience earned through play. Diablo II’s patch 1.10, released on 28 October 2003, introduced seasonal ladder characters: new heroes in a separate economy, without their owners’ accumulated equipment. The fresh start renewed the race. Returning to it and buying something from Blizzard were different events.",
      "Online play brings some responsibility for the meeting place back to a provider. Early text-based worlds already faced connection costs: Richard Bartle’s MUD Advanced Project Report compared hourly charges with a fixed fee for unlimited access over a period. Diablo II’s free Battle.net illustrates a different offer. A service has work to fund even when it has no separate subscription bill; the player’s price does not describe the provider’s whole business.",
      "Internet distribution made some commercial relationships easier to maintain. Economists Avi Goldfarb and Catherine Tucker describe falling costs of searching, copying, transporting, tracking and verifying information. In games, those changes help explain how a studio can deliver updates and offers directly to people already playing. Creating worthwhile new work still takes resources.",
      "Netflix offers a useful parallel. It already mailed physical DVDs to subscribers when it added internet viewing in January 2007. Delivery changed within an existing subscription. Watching at home had not removed the business relationship around the film. In games too, the place where people play, the service that connects them and the thing they purchase can change independently.",
      "The next offer also need not sell access. Valve made its team shooter Team Fortress 2 free to enter in 2011, alongside an item economy. Its 2013 Dota 2 Compendium sold a companion to a tournament, with predictions, rewards and a contribution to the prize pool. These gave existing players another thing to buy without first taking away the ability to play.",
      "Advertising adds a different payer. Crossy Road, a mobile game about crossing roads and other hazards, combined character sales with optional rewarded video: the player could watch an advertisement for a benefit in the game. An advertiser paid to reach the audience. Looking only at what the player paid would miss part of the exchange.",
      "A cabinet can sell turns; a copy can support years of play; a connected game can add offers inside an activity already under way. None of these tells us what makes the activity worthwhile. They tell us where to look for the exchange. Now the scale of the question expands: who keeps making and maintaining the things that give people a reason to spend their time here?"
    ],
    "sections": [
      {
        "at": 4,
        "title": "Three different endings"
      },
      {
        "at": 6,
        "title": "Connection is not a payment model"
      },
      {
        "at": 9,
        "title": "Another offer inside the same activity"
      }
    ],
    "paragraphCitations": {
      "1": [
        "diablo-story",
        "d2-postmortem"
      ],
      "2": [
        "d2-postmortem",
        "d2-retrospective"
      ],
      "3": [
        "d2-postmortem",
        "d2-expansion"
      ],
      "5": [
        "d2-ladder-ranking",
        "d2-110-launch",
        "d2-ladder"
      ],
      "6": [
        "hist-bartle"
      ],
      "7": [
        "digital-economics"
      ],
      "8": [
        "netflix-2007"
      ],
      "9": [
        "tf2",
        "dota"
      ],
      "10": [
        "crossy"
      ]
    },
    "sources": [
      "diablo-story",
      "d2-postmortem",
      "d2-retrospective",
      "d2-expansion",
      "d2-ladder-ranking",
      "d2-110-launch",
      "d2-ladder",
      "hist-bartle",
      "digital-economics",
      "netflix-2007",
      "tf2",
      "dota",
      "crossy",
      "gauntlet",
      "reliquary"
    ],
    "figures": [
      {
        "asset": "legacy-d2-heroes",
        "alt": "Diablo II’s five original character classes gathered around a campfire",
        "caption": "Five classes inside one purchase. Their different abilities—and the choices within each class—gave the same owner reasons to begin again.",
        "credit": "Blizzard Entertainment",
        "afterParagraph": 2
      }
    ],
    "takeaway": "Returning to a game is not the same event as buying something from its creator.",
    "evidence": "These examples compare overlapping arrangements; they are not stages every game passed through. The original Diablo II purchase is distinguished from its expansion and later Resurrected editions. Patch 1.10 dates seasonal ladder characters, not the first leaderboard. A purchased game is not a guarantee of perpetual online availability. Goldfarb and Tucker supply a general economic framework; its application to games is our synthesis. Netflix’s 2007 announcement separates delivery from an existing DVD subscription. Valve and Crossy Road examples are dated historical offers. The exhibit compares these documented examples; it is not an invention timeline or a complete history."
  },
  {
    "id": "the-fork",
    "part": 0,
    "title": "The business of keeping a world alive",
    "lede": "A game can supply an adventure and become a place in someone’s life. Keeping that place worthwhile takes work. The business has to decide which work it will keep doing—and what it will sell.",
    "figures": [
      {
        "asset": "bg3-official-key-art",
        "alt": "Baldur’s Gate 3 official key art: companions gathered beneath a mind flayer ship",
        "caption": "Baldur’s Gate 3 · Larian Studios. A fantasy adventure in which a group of companions faces decisions that change their story.",
        "credit": "© Wizards of the Coast / Larian Studios",
        "sourceUrl": "https://baldursgate3.game/",
        "placement": "opening"
      },
      {
        "asset": "legacy-d4-key",
        "alt": "Diablo IV key art: Lilith above the game’s title in a field of red",
        "caption": "Diablo IV · Blizzard Entertainment. A dark fantasy world built around fighting monsters, finding equipment and developing a character.",
        "credit": "© Blizzard Entertainment",
        "placement": "opening"
      }
    ],
    "paragraphs": [
      "At the arcade cabinet, making the game and running the venue were different jobs. An online studio can inherit parts of both. It creates encounters and characters, but may also maintain the connection through which people arrange an evening together. The audience may keep enjoying a purchased game for years. The studio’s wages fall due while its next work is still taking shape. Someone has to finance the gap.",
      "What survives a purchase is attachment: a remembered story, a character we have learned to play, a familiar place or people we meet there. It can give the next release an audience and an older work new buyers. Earlier earnings and financing against future sales can also pay for production. Affection matters to the business, but affection is not a payment schedule. The next offer still has to earn its place in that relationship.",
      "Cinema makes the distinction familiar. A ticket admits someone to a showing, while the value of going might include the occasion: company, a large screen, time set aside for a film. In a subscription service such as Netflix, a work also helps make a catalog worth keeping. Netflix’s July 2024 shareholder letter connects viewing with satisfaction and retention. Viewing is something it can count; what a particular film means in someone’s life takes more explaining.",
      "That changes the terms under which creative work is valued and paid for. In 2023, the Writers Guild of America negotiated a new bonus for qualifying streaming films and series that reached a specified share of a service’s subscribers. It also secured access to viewing data. A hit inside a subscription catalog needed a way to become visible in its writers’ compensation.",
      "The tools used to make that work offer another comparison. Adobe, the company behind Photoshop, announced in 2013 that new creative features would go to Creative Cloud subscribers; Creative Suite 6 would be its last major release for perpetual licenses. Editing a photograph remained a familiar activity. Access to the newest releases became a continuing purchase. These are different ways of selling ongoing work, rather than a single destination that every digital product must reach.",
      "Some online games become gathering places themselves. Steinkuehler and Williams used the idea of “third places”—informal settings beyond home and work—to examine sociability in particular online worlds. Another 2006 study, by Ducheneaut and colleagues, found extensive solo activity in World of Warcraft. Other players could still supply an audience and a sense of a populated world. Shared space, friendship and playing in a group are different experiences.",
      "That range gives the creator more to maintain than a stream of new rewards. Can friends find an activity they can enter together? Can someone pursue a private project among others? Does returning after a break make sense? The studio also chooses where to put its next creative work: another game, an expansion, or a continuing program in this one. Those decisions connect the place people value to the business’s next offer.",
      "Baldur’s Gate 3 and Diablo IV bring that production choice into view. Both are role-playing games: players develop characters whose abilities and equipment change what they can do. Larian Studios builds BG3 around companions, conversations with consequences and battles fought in turns. Blizzard Entertainment’s Diablo IV puts a character under the player’s direct control, fighting crowds of monsters in search of better equipment. Each offers a campaign—the main story adventure—and reasons to play again.",
      "In Baldur’s Gate 3, the purchase opens a substantial adventure with many possible routes through it. Larian’s stated offer includes no in-game purchases. The studio continued adding features after release, then announced its final major content update in April 2025. It could keep working on the game indefinitely, the announcement explained: “But then we’d never be able to create something new.” Players could continue exploring its possibilities while the studio turned to another project.",
      "Blizzard described a different future for Diablo IV in its August 2022 development update: “Diablo IV will be supported by an army of developers for years to come.” Alongside the purchased adventure, it planned seasons: recurring cycles of new activities and changes to play. Optional sales of character appearances and paid reward tracks would accompany that continuing program. A dedicated team would keep creating reasons to return and further things to buy. Unlike the coin in Gauntlet, buying a cosmetic appearance would not replenish a resource needed to stay in the game. Continuing to play and accepting the next offer remained separate choices.",
      "Here is the fork: what will the studio keep making, and what will the audience next be asked to buy? Larian described turning from major BG3 additions toward another project. Blizzard planned continuing production and further offers inside Diablo IV. This is a choice about the organization of work and sales. It does not divide social games from solitary ones, or replayable games from finished ones. A completed release can sustain a friendship; a seasonal game can be someone’s private pastime.",
      "Diablo IV holds several expectations in the same world. One player wants to finish the campaign, its main story adventure. Another wants a fresh seasonal run with friends. A third is still attached to an older character. A new season can coordinate a welcome reunion, yet leave someone else unsure where their unfinished adventure belongs. The tension appears when the program the studio is maintaining and the evening the player intended stop fitting together.",
      "An ongoing game also makes promises that no amount of finished scenery can fulfill on its own. The connection must work. In games that depend on other participants, suitable people must turn up. The audience helps produce the experience being offered to the audience. Concord shows how abruptly that arrangement can fail—and why a studio’s anxiety reaches far beyond selling the next cosmetic."
    ],
    "sections": [
      {
        "at": 2,
        "title": "What the next payment buys"
      },
      {
        "at": 5,
        "title": "When the audience inhabits the work"
      },
      {
        "at": 7,
        "title": "Two worlds, different futures"
      },
      {
        "at": 12,
        "title": "A promise that needs an audience"
      }
    ],
    "paragraphCitations": {
      "2": [
        "netflix-engagement"
      ],
      "3": [
        "wga-streaming-2023"
      ],
      "4": [
        "adobe-2013",
        "digital-economics"
      ],
      "5": [
        "third-places",
        "alone-together"
      ],
      "7": [
        "bg3",
        "d4-expansion-structure"
      ],
      "8": [
        "bg3",
        "bg3-patch8"
      ],
      "9": [
        "d4-season-philosophy"
      ],
      "11": [
        "d4-expansion-structure",
        "d4-season-philosophy"
      ]
    },
    "sources": [
      "netflix-engagement",
      "netflix-2007",
      "wga-streaming-2023",
      "adobe-2013",
      "digital-economics",
      "third-places",
      "bg3",
      "bg3-patch8",
      "d4-season-philosophy",
      "d4-expansion-structure",
      "alone-together"
    ],
    "takeaway": "The studio makes an offer inside a relationship people already have with the game. Its next work can strengthen that relationship, change it or ask too much of it.",
    "evidence": "The opening offers an interpretive lens, not a reconstruction of private studio finances. Attachment names what a work means to people; it is not equated with viewing hours, time played, spending or wellbeing. Netflix’s July 2024 letter explains its own use of viewing as a proxy, not proof that more viewing always means greater satisfaction. The cinema/catalog illustration compares two payment relationships, not mutually exclusive industries: films have multiple release and licensing channels, and streaming did not invent subscriptions. Netflix’s 2007 announcement added streaming to an existing DVD subscription. The WGA passage describes the historical 2023 agreement and qualifying high-budget subscription streaming productions, not all writers or current contract terms. Adobe’s 2013 transition concerns access to new creative releases, not removal of previously purchased perpetual licenses. Digital Economics supplies the broader cost framework; the cross-industry argument is our synthesis. Online social relationships vary across games and players. Larian’s April 2025 statement concerns major content updates, not the end of support. Blizzard’s August 2022 plan records pre-launch intent, not today’s catalog or prices. D4 seasons and optional purchases remain separate choices; neither game is a Netflix-style subscription. The exhibits are qualitative, not financial forecasts."
  },
  {
    id: "concord",
    part: 0,
    title: "Concord",
    lede: "For a multiplayer world, other players are part of what the product has to deliver.",
    paragraphs: [
      "Concord was a team shooting game made by Firewalk Studios and published by Sony’s PlayStation business. Two teams of five players competed using characters with different abilities. Its 2024 reveal promised further maps and modes alongside weekly story scenes: an evolving world to learn and inhabit. The game launched on 23 August. On 3 September, Firewalk announced that it would go offline on 6 September, with sales stopped and refunds offered.",
      "A continuing world asks people to bring more than the entry price. They learn its rules, make time for it and may persuade friends to come along. Concord’s shutdown turned that invitation into a refund process within weeks. The dates establish the rupture without a speculative budget attached. Returning the purchase price addressed one commitment; the anticipated evenings and the work of assembling a group were another.",
      "The bar in our opening could have conversation, music and other reasons to stay after someone stopped playing. A team shooting game depends more tightly on the activity it organizes. Its designers can build the arena and supply the rules, but players supply opponents and teammates. A local sports club faces a similar dependency: the ground can be ready while the match cannot begin.",
      "Activision’s 2024 matchmaking paper makes the underlying tradeoffs explicit for Call of Duty, its military shooting series. Matchmaking is the process of finding participants for a match. Its system considers connection quality and time to match alongside skill, playlists, input and platform. The paper describes loosening some constraints as it gathers players before a match. These particulars belong to Call of Duty. It explains why “how many people?” needs companions: where, when, in which mode and under which matching rules?",
      "Consider a hypothetical launch test that attracts a busy weekend crowd. It can demonstrate that matches form under those conditions. It leaves another question open: what happens when those people spread across ordinary working days, regions and preferred modes? The promotional peak and the routine evening are different operating conditions. A useful launch plan needs to know how much those conditions differ.",
      "The shutdown statement says parts of the game and launch did not land as intended. It does not isolate price, art direction, timing, differentiation or execution as the decisive cause. Treating the failure as proof of whichever complaint we already preferred would turn a striking case into weak evidence. The useful problem is more specific: how can a project discover whether its promised experience remains available when the audience behaves like real people?",
      "This is the practical anxiety behind the promise of a living world. A studio needs to learn whether it can repeatedly provide the experience it is inviting people to organize their time around. Testing that dependency early leaves room to change the plan. Once the world is presented as somebody’s future meeting place, failure reaches beyond a disappointing feature."
    ],
    takeaway:
      "Test the ordinary conditions in which players must find one another, as well as the launch event.",
    figures: [
      {
        asset: "concord-shutdown-announcement-art",
        alt: "Concord promotional artwork with a group of characters",
        caption:
          "Key art accompanying the shutdown announcement. The linked statement, rather than this artwork, establishes the dates and refund policy.",
        credit: "Firewalk / PlayStation · September 2024",
      },
    ],
    sources: ["concord-reveal", "concord", "hist-matchmaking"],
    evidence:
      "The launch/closure chronology comes from Firewalk’s announcements. Matchmaking mechanisms come from a separate Call of Duty developer paper. The launch-test example is hypothetical. No budget, total-sales estimate, minimum population or single-factor explanation for Concord is asserted.",
    paragraphCitations: {
      "0": ["concord-reveal", "concord"],
      "3": ["hist-matchmaking"],
      "5": ["concord"],
    },
  },
  {
    id: "what-decides",
    part: 1,
    title: "What a studio can learn in time",
    lede: "The useful prototype is the one that catches your beautiful idea lying to you.",
    paragraphs: [
      "Outer Wilds is a space-exploration game in which following clues changes what the player understands. Its developer, Mobius Digital, described a revealing design problem in 2016. The signalscope, a handheld receiver for locating distant sounds, was meant to turn a sound into a destination. Players instead mistook signals from far away for noises coming from the rock in front of them. The team added clearer aiming feedback, separated frequencies and supplied distance information. A tool intended to produce curiosity had been producing a misunderstanding about space.",
      "A venue owner can see a busy corner and still misunderstand why people are there. A studio has a similar problem with a usage chart. Imagine measuring only how often the signalscope was opened: a confused player might open it repeatedly, while an informed one locates a destination and puts it away. Mobius needed to know what the player believed the sound meant and where that belief sent them. The desired experience gave the observation its meaning.",
      "Mobius described a related problem in its pathing. At forks, players were choosing routes without enough information to become curious about a destination. The response was to give paths suggestive clues. This protected the game’s larger promise—following your own questions—by improving a small decision on the ground. The developer account makes the revision legible: an intended experience, an observed obstacle, a change that addressed it.",
      "There is a production discipline hiding inside that little instrument. Before polishing the brass, decide what would make you rebuild the receiver. For a combat prototype, it might be that players cannot explain why they died. For a purchase screen, it might be that they mistake access to a catalog for ownership of its contents. For a cooperative service, it might be that the proposed audience cannot reliably find a match. Each uncertainty needs its own encounter with reality.",
      "A playable hour can reveal a confusing encounter. It cannot contain a year of obligations to friends, shifting tastes or unfinished rewards. Conversely, a large audience survey can establish interest in a premise without showing whether the thing feels good under a thumb. The tempting mistake is to promote whichever evidence is available into permission for every commitment that follows.",
      "Ask a sharper question at the milestone: what can still change because of what we learned? If the answer is only the tutorial text, the expensive parts of the design have already become immune to the test. Keep the promise clear and its implementation negotiable. A studio that intends to keep selling new reasons to return will need that freedom repeatedly; the financial plan inherits the same obligation to keep learning."
    ],
    takeaway:
      "Give every important test a decision it is still allowed to change.",
    panel: {
      title: "A decision can remain reversible",
      flow: true,
      items: [
        { label: "Promise", text: "What experience is being offered?" },
        {
          label: "Evidence",
          text: "Which observation could disprove the plan?",
        },
        {
          label: "Decision",
          text: "What can still change after that observation?",
        },
      ],
    },
    sources: ["outer", "lit-outer-pathing"],
    evidence:
      "Mobius’s 2016 development accounts establish the signalscope and pathing revisions. The dashboard counterexample and production-review cases are original hypothetical analysis; they do not reconstruct another studio’s decisions.",
    paragraphCitations: {
      "0": ["outer"],
      "2": ["lit-outer-pathing"],
    },
  },
  {
    id: "shape-of-money",
    part: 1,
    title: "The shape of the money",
    lede: "A lasting game needs work, and that work needs funding. The next sale can come from a new player, an expansion or someone already inside the world.",
    paragraphs: [
      "A worthwhile evening needs someone to provide its conditions. In a bar that includes a room, equipment and staff; in an online game it can include software, connections, support and new creative work. Some costs arrive before anybody plays, and others recur while the service operates. The cabinet’s manufacturer and its operator had different accounts. A studio running an ongoing game must understand the several jobs within its own.",
      "A purchased book can keep earning because new readers discover it. Games have that possibility too. Returning players can recommend an older release without each replay generating another payment. Expansions sell additional work to existing owners. A studio may also draw on other games, reserves or outside funding. If its next project takes eight years, it needs a way to finance that interval; the release dates alone cannot tell us which source paid the bills.",
      "Software offers a useful parallel. Adobe’s 2013 annual report described moving new creative features into Creative Cloud subscriptions, with CS6 its last major perpetual-license release. People still edited images and designed pages, but updates and payment now belonged to a continuing arrangement. Diablo IV uses a different mixture of sales. The comparison concerns a familiar activity inside a changed commercial relationship, not identical pricing.",
      "Larian’s April 2025 BG3 update explained a different decision: major additions would end so the team could make something new. Blizzard’s 2022 D4 plan committed to an ongoing seasonal team alongside optional purchases. These statements expose different production commitments. They do not reveal either project’s complete finances, and they do not tell us that every proposed feature was chosen because of its likely revenue.",
      "Sony’s 2022 investor presentation placed more of its planned PlayStation Studios investment into live-service games. It shows a publisher seeking ongoing business alongside individual releases. The continuing work is concrete. Riot Games’ engineering account of VALORANT, its team shooting game, describes the systems for grouping players, finding matches, running them in data centers, recording results and handling purchases. Those systems must work together whenever players arrive.",
      "New adventures have their own costs. CD PROJEKT’s 2023 disclosure separated production of Cyberpunk 2077’s Phantom Liberty expansion from its marketing campaign. Developing content, reaching an audience and operating a service are different demands on money. A purchase may help support several at once. We should not draw a direct line from one cosmetic sale to one feature without evidence of the actual allocation.",
      "Consider a hypothetical choice between helping friends return together and producing a purchasable collection. The collection has a visible sales line. Reworking an invitation flow or explaining an old character’s status may create value through fewer failed evenings, lower support costs or later recommendations. Those benefits need evidence too. If immediate sales are the only accepted measure, the team can neglect conditions that make any future sale welcome.",
      "The funding question is therefore also a question about care: which parts of the experience can the business afford to maintain, and which can it recognize as worth maintaining? A good answer must connect the players’ reasons to be there with the costs of providing the place. The next comparisons separate those reasons from the packages in which games sell them."
    ],
    takeaway:
      "Examine the continuing work and player value that must support the continuing offer.",
    panel: {
      title: "Two schematic cost profiles",
      items: [
        {
          label: "Release-led",
          text: "Production → launch → support and future releases",
        },
        {
          label: "Service-led",
          text: "Production → ongoing content, operations and acquisition",
        },
      ],
    },
    sources: ["adobe-2013", "bg3-patch8", "d4-season-philosophy", "sony", "hist-valorant", "cyberpunk"],
    evidence: "The eight-year interval and staffing choice are illustrative scenarios, not Blizzard financial history. Adobe documents a different industry’s 2013 subscription transition; D4 is not described as the same model. Larian and Blizzard provide dated production intentions. Sony’s investment figures are forecasts, Riot supplies a specific operating example, and CD PROJEKT separates production and marketing costs. No audited revenue allocation or inevitable relationship between payment and artistic decisions is asserted.",
    paragraphCitations: {
      "2": ["adobe-2013"],
      "3": ["bg3-patch8", "d4-season-philosophy"],
      "4": ["sony", "hist-valorant"],
      "5": ["cyberpunk"],
    },
  },
  {
    id: "six-games",
    part: 1,
    title: "Six games, different promises",
    lede: "Similar pleasures can sit inside very different packages. The useful comparison is what each game invites us to do—and what the purchase includes.",
    paragraphs: [
      "A game can be a private adventure, a project with friends or a familiar place to spend an hour. The same title can serve different purposes on different evenings. These six role-playing games connect an adventure to a developing character, but package their work differently. An expansion adds to an existing game; an edition bundles a particular set of content. Comparing those packages helps us see what a purchase promises without pretending it explains every reason to play.",
      "Baldur’s Gate 3 asks players to guide a group of companions through a story shaped by their choices. Its purchase includes different paths through that campaign. The analogy to a novel is useful at the checkout: revisiting the work does not require another purchase. During play, the analogy becomes less exact. We can make choices that were absent from our first experience.",
      "Elden Ring, FromSoftware’s fantasy action role-playing game, emphasizes exploration and demanding combat. CD PROJEKT RED’s Cyberpunk 2077 places its character in a futuristic city of jobs and conflicting loyalties. Their Shadow of the Erdtree and Phantom Liberty expansions offer another substantial adventure for another purchase. Like a new volume, each has a named scope; unlike an independent book, an expansion can require the original game and progress within it.",
      "The Witcher 3 follows a professional monster hunter through a world of authored quests. Its 2022 Complete Edition bundled the main game with Hearts of Stone, Blood and Wine and earlier additions. A collected edition of novels works similarly: material sold at different times becomes one package for a later reader. The world has not changed simply because the contents of the box have.",
      "Clair Obscur: Expedition 33, from Sandfall Interactive, follows a group on a fantasy expedition. Its battles combine taking turns with actions timed by the player. The studio released a free Thank You update in December 2025. An adventure sold as a release can receive additional material; an update schedule does not, by itself, create a recurring payment obligation.",
      "Diablo IV combines its campaign with a seasonal program and a shop. Its 2025 Reliquary system added reward catalogs: collections whose premium access could be bought, while their contents required a resource earned by playing. We will examine that transaction later. Here it establishes a different kind of offer from an expansion: permission to pursue specified rewards within the game already being played.",
      "Compare three things separately: the experience someone wants, what the game enables and what the purchase includes. A friendship can grow around a completed adventure. A new update need not ask for payment. A sold addition can be worthwhile without becoming a permanent destination. When the world changes, the next question is what parts of someone’s earlier investment still have a place in it."
    ],
    takeaway:
      "Compare the reason to return, the next purchase and the progress that remains usable.",
    table: {
      caption:
        "Selected product structures, with historical scope where specified. This is not a current price or complete DLC catalog.",
      headers: ["Game", "Design emphasis", "Commercial example"],
      rows: [
        [
          "Baldur’s Gate 3",
          "Authored campaign and branching choices",
          "Base game; Larian states no microtransactions",
        ],
        [
          "Elden Ring",
          "Exploration, combat and build mastery",
          "Base game + Shadow of the Erdtree",
        ],
        [
          "Clair Obscur: Expedition 33",
          "Authored RPG campaign",
          "Premium game; no sales or budget estimate used here",
        ],
        [
          "The Witcher 3",
          "Authored quests in an open world",
          "2022 Complete Edition bundles two story expansions",
        ],
        [
          "Cyberpunk 2077",
          "Authored open-world RPG",
          "Phantom Liberty as a separately produced expansion",
        ],
        [
          "Diablo IV",
          "Campaign plus repeatable progression",
          "Base game, expansions, shop and seasonal catalogs",
        ],
      ],
    },
    sources: [
      "bg3",
      "elden",
      "cyberpunk",
      "witcher",
      "expedition",
      "hist-expedition-update",
      "hist-season-design",
      "reliquary",
    ],
    evidence:
      "The comparison uses selected official product descriptions, a dated bundle announcement and expansion disclosure. It is not a financial ranking, a complete DLC catalog or a guarantee of permanent offline availability.",
    paragraphCitations: {
      "1": ["bg3"],
      "2": ["elden", "cyberpunk"],
      "3": ["witcher"],
      "4": ["expedition", "hist-expedition-update"],
      "5": ["hist-season-design", "reliquary"],
    },
  },
  {
    id: "the-reset",
    part: 1,
    title: "Where progress lives",
    lede: "The character can be saved while the occasion for playing it changes.",
    paragraphs: [
      "Diablo IV combines a campaign, its main story adventure, with seasons: recurring periods of new activities and changes to character development. The campaign reaches a resolution; a season offers a fresh run through a changing set of possibilities. These structures overlap, since a seasonal character can also follow the campaign. Before examining their rewards, it helps to distinguish what a new beginning preserves.",
      "Diablo IV lets characters take part in a season, a period of shared changes and goals, or continue outside that cycle in the Eternal Realm. Realm here means the version of the game world to which the character belongs. Blizzard’s first-season explanation in 2023 said seasonal characters and their progress would move to Eternal afterward, while season-specific features could disappear. The newer character-selection capture also describes that transfer. Beginning another season does not mean the previous character has been deleted.",
      "Several things can survive in different places. The saved character holds equipment, completed tasks and levels—stages of development reached by earning experience through play. The account records purchased access and other shared benefits. Knowledge and skill belong to the person: recognizing a useful item, understanding an enemy or timing a move. A new sports season provides a useful comparison. The standings can start over; the competitors have still learned from last year.",
      "That is why two nominally fresh characters can begin from very different positions. Imagine a veteran who recognizes a useful modifier immediately and a newcomer who must read every item. Give them identical starting equipment and their decisions will still diverge. The reset has equalized part of the saved state. It has left the history of learning intact. The shared starting line preserves a considerable difference in preparation.",
      "Outer Wilds, a space-exploration game by Mobius Digital, puts learning at the center of progress. Its solar system repeats while discoveries change where the player wants to go. In the developer’s account of an early prototype, testers began keeping notes, reinforcing the need for a ship computer that recorded discoveries. Saving a clue and understanding it are different achievements.",
      "Blizzard described seasons as room to experiment with temporary mechanics without balancing every new theme against all earlier ones forever. For players, a restart can also serve as an invitation with a date: begin together again. Yet synchronizing the occasion does not synchronize people’s lives. One friend may be ready for a new project while another still values the character they were building. The game must make both intentions legible.",
      "The commercial consequence appears when rewards and purchases follow different luggage rules. An account appearance may travel differently from a seasonal power; a catalog may have its own period of availability. The design must explain the relevant boundaries at the moment of commitment. “You keep your progress” is inadequate if the listener and the designer mean different kinds of progress.",
      "The transfer exhibit below keeps the categories separate. End the season and watch where the character goes, then consider what the player brings to a new beginning. Deciding what to preserve depends on understanding what that person values. The following chapters examine those reasons for playing."
    ],
    takeaway:
      "Ask where each kind of progress survives and in which activity it can still be used.",
    panel: {
      title: "Four places change accumulates",
      items: [
        { label: "Knowledge", text: "What the player understands" },
        { label: "Skill", text: "What the player can execute" },
        { label: "Character", text: "Levels, equipment and quest state" },
        { label: "Account", text: "Owned access and cosmetics" },
      ],
    },
    figures: [
      {
        asset: "d4-seasonal-tooltip",
        alt: "Diablo IV Seasonal Character tooltip states that the character becomes Eternal at the end of the season",
        caption:
          "The Seasonal tooltip explicitly describes transfer to Eternal. Owner reports the current season and version at capture, 1 October 2026.",
        credit: "Blizzard",
      },
      {
        asset: "outer-wilds-signalscope-prototype",
        alt: "Early Outer Wilds signalscope interface facing Riebeck",
        caption:
          "The signalscope directs curiosity toward a place to investigate. This image is a 2016 prototype, not the released interface.",
        credit: "Mobius Digital · 2016 design article",
      },
    ],
    sources: [
      "d4-expansion-structure",
      "hist-season-design",
      "hist-outer-product",
      "hist-outer-demake",
      "outer",
    ],
    evidence:
      "The detailed season rationale is attributed to Blizzard’s 2023 announcement, not projected onto current-season rules. The present capture supports transfer wording only. No undocumented Rebirth preservation rules are asserted.",
    paragraphCitations: {
      "0": ["d4-expansion-structure"],
      "1": ["hist-season-design"],
      "4": ["hist-outer-product", "hist-outer-demake"],
      "5": ["hist-season-design"],
    },
  },
  {
    id: "why-people-play",
    part: 2,
    title: "What players want",
    lede: "Three people can finish the same dungeon and take home three different things.",
    paragraphs: [
      "Picture three players returning from a dungeon, an area of enemies and challenges they tackled together. One has learned to anticipate the final enemy’s attack. Another spent the run talking with an old friend. A third found equipment that completes a character they have been imagining for weeks. The game records a completed activity, possessions and time spent. The group leaves with a new skill, an evening together and a more convincing fiction.",
      "Ryan, Rigby and Przybylski’s 2006 studies offer a useful vocabulary for this difference. Self-determination theory examines autonomy, competence and relatedness: willing participation, effective action and connection with others. Their game research linked perceived need satisfaction with enjoyment and future play, while also examining well-being. These are qualities of an experience. Counting available choices, awarded levels or names on a friends list does not directly measure them.",
      "The first question is therefore what the person came to do. A difficult fight can be welcome when learning it is tonight’s project. The same fight can be an obstacle when the plan was to show a new friend the world. A menu that offers twenty activities may still leave that pair searching for one they can enjoy together. Variety has to become usable possibility somewhere.",
      "Nick Yee’s survey of roughly 3,000 players of massively multiplayer online role-playing games offers another lens. These are games where many people share a persistent world. The study grouped reported motives into achievement, social and immersion components, which could overlap. Someone perfecting a character may care deeply about friends; someone drawn to the fiction may enjoy winning. The useful unit is a person with several reasons to play, rather than a permanent marketing label.",
      "Learning adds another complication. In the opening of A Theory of Fun, Raph Koster describes his children losing interest in tic-tac-toe as its patterns became familiar. His design argument helps explain why increasing a counter can eventually cease to feel like progress. It also suggests a productive question for an RPG: is the next session changing what the player can notice or do, or mainly extending an already settled routine?",
      "The meeting-place comparison also has limits. Steinkuehler and Williams examined informal sociability in particular online worlds. Ducheneaut and colleagues showed that a populated world could matter even during solo play. Being among people, relying on teammates and sustaining a friendship place different demands on design. A friends-list count cannot stand in for all three.",
      "Settled routines can be wanted. Our imaginary friends may prefer an easy route precisely because it leaves room to talk. The collector may enjoy careful repetition. The task is to discover which purpose the repetition serves and whether the surrounding rewards preserve it. If a deadline sends the group into separate activities, the economy has changed the evening even when everyone completes more objectives.",
      "A useful offer begins with the purpose it could serve. It might help someone express a character, share a challenge or make time for a demanding hobby. It can also compete with what that person had intended to do. We need an account of those intentions before choosing what to sell or what to count. Even then, some works deliberately make us question the value of their counters."
    ],
    takeaway:
      "Follow the purpose of the session before treating its events as evidence of value.",
    panel: {
      title: "Three questions about the same session",
      items: [
        { label: "Autonomy", text: "Did I want to do this?" },
        {
          label: "Competence",
          text: "Could I understand and affect the outcome?",
        },
        { label: "Relatedness", text: "Did I feel connected to someone?" },
      ],
    },
    sources: [
      "sdt",
      "yee",
      "koster",
      "third-places",
      "alone-together"
    ],
    evidence:
      "The opening party is an invented example. SDT findings, Yee’s genre-specific motivation study and Koster’s design argument are distinct kinds of evidence; the chapter does not turn them into a universal player taxonomy or a diagnostic questionnaire.",
    paragraphCitations: {
      "1": [
        "sdt"
      ],
      "3": [
        "yee"
      ],
      "4": [
        "koster"
      ],
      "5": [
        "third-places",
        "alone-together"
      ]
    },
  },
  {
    id: "play-beyond-score",
    part: 2,
    title: "Play beyond the score",
    lede: "INDIKA puts a bright little accounting system inside a world that gives us reasons to question it.",
    paragraphs: [
      "INDIKA, made by Odd Meter and published by 11 bit studios, is a story-driven game about a young nun. In one reference screenshot, she stands before a scene torn open by red light, with an instruction to hold a control to pray. Beside it sits a precise score: 1330 / 1470. A second image puts a luminous reward symbol above worn fabric, wood and a candle. The contrast invites us to ask what this accounting is doing inside the story.",
      "The publisher describes a journey through religious belief and harsh reality, with the devil accompanying the protagonist. Against that premise, the numerical display invites a particular reading. Prayer has entered a system that accepts an input and makes progress legible. We can ask whether the count measures anything the character actually needs, whether its authority is trustworthy, and why we are so ready to understand the next threshold as a desirable destination.",
      "This reading depends on the relationship between the elements. Remove the score and the scene still contains a figure, a threat and an instruction. Remove the figure and the counter could belong to a harmless collection task. Together, they put an ordinary game habit under pressure: the willingness to treat a sign of advancement as proof that advancing is worthwhile. The cheerful arithmetic becomes a small, suspicious witness.",
      "A screenshot cannot tell us how the input feels over time or how every player interprets the sequence. It can support a close reading of the invitation on screen. Holding a control assigns the player a part in the ritual; observing a character pray would assign a different part. The interface brings the action under a hand, while the story supplies reasons to question the action’s meaning. The reading here rests on that tension between action, measurement and meaning.",
      "An evening can be worthwhile because a work unsettles us. A difficult novel or film may leave an argument to think about rather than an appetite for an immediate repeat. Games can do this too. INDIKA’s score belongs inside an authored experience that questions what is being counted. Completion, pleasure, admiration and a wish to return need separate descriptions.",
      "When we inspect an economy, we need to describe what its signals mean within the work. A coveted sword, a souvenir from friends and a deliberately dubious score can all produce an acquisition event. Their roles are different enough that substituting one for another would change the game’s argument. An acquisition loop can leave behind understanding—including understanding that its counter deserves a raised eyebrow."
    ],
    takeaway: "Read the reward signal in the context of the work that uses it.",
    figures: [
      {
        asset: "legacy-indika-pray",
        alt: "INDIKA shows a Hold LT to pray prompt in a red-lit scene",
        caption:
          "A held input makes prayer an action the player performs. The screenshot establishes the prompt, not the complete experience of holding it.",
        credit: "Odd Meter / 11 bit studios",
      },
      {
        asset: "legacy-indika-points",
        alt: "INDIKA shows a glowing reward symbol and a numerical score",
        caption:
          "The visible score invites a reading of what is being counted and why. Its expressive role is discussed here as interpretation.",
        credit: "Odd Meter / 11 bit studios",
      },
    ],
    sources: ["lit-indika-official"],
    evidence:
      "Original close reading of the owner-supplied prayer and points captures, with the premise checked against the publisher. No unseen ending, invented playthrough, universal emotional response or blanket claim about the usefulness of INDIKA’s points is asserted.",
    paragraphCitations: {
      "0": ["lit-indika-official"],
      "1": ["lit-indika-official"],
    },
  },
  {
    id: "anatomy-of-loop",
    part: 3,
    title: "Anatomy of a loop",
    lede: "The arrow back to the beginning conceals the important question: what is different when we get there?",
    paragraphs: [
      "Fight, collect equipment, improve a character, then fight again: this repeated sequence is a core loop. It describes a mechanism inside Diablo, rather as a description of Pong’s paddles describes the machine in the bar. It leaves out the occasion around the activity. The same loop can support a hard-won lesson, an easy conversation with a friend or an evening of repetition someone regrets. We need to follow how the rules become that experience.",
      "Hunicke, LeBlanc and Zubek’s MDA framework helps unpack that shortcut. It distinguishes mechanics, the rules and implementation; dynamics, the behavior that develops as the system is played; and aesthetics, the experience the design seeks to produce. The value of the distinction is the work it demands between those layers. A rule on a design sheet still has to become a situation someone can read, act within and care about.",
      "Consider an invented dungeon with a slow, heavy attack. Its recovery time is a mechanical constraint. A narrow doorway and two enemies can turn that constraint into a decision about when to commit. Reading the opening, risking the swing and surviving can produce a feeling of control earned under pressure. Increase the damage until every enemy dies before that decision matters and the animation survives, while the encounter’s question disappears.",
      "Now move outward. The player may leave the room with a better weapon, a clearer reading of the enemy, or a story about a spectacularly mistimed swing. Over the session, those changes can become a new route or a revised build, the combination of equipment and abilities they use. Across weeks, they can become a personal project shared with friends. These timescales are our explanatory model, rather than a fixed anatomy every game must possess. Their purpose is to make the transfers visible.",
      "Diablo IV’s campaign and seasonal characters put these timescales to different uses. In the campaign, growing strength helps carry a character through an unfolding adventure. A new skill or weapon matters in the next encounter; that encounter also matters because of where the story is taking the player. Progress has a destination in the campaign, even though the character can have further goals after its ending.",
      "A fresh seasonal character makes the climb itself available again. Equipment that an established character has outgrown can become a useful early upgrade; another combination of abilities becomes a project to assemble and test. Blizzard’s original season rationale emphasized experimenting with classes and builds, temporary mechanics and a shared starting point. The design task is to give familiar actions worthwhile consequences again. The account of character transfer earlier in this essay explains how that fresh start can coexist with preserving the previous character.",
      "A reward schedule can support those transfers. A new tool might invite a tactic the player has never tried. It can also sit beside them like an unrelated meter, recording hours without opening another decision. The distinction becomes especially useful when tuning an economy: if a change makes the player repeat the dungeon twice as often, what happens inside those additional runs? More experiments, more conversations and more identical chores are all compatible with that count.",
      "The MDA paper itself uses Monopoly’s accumulating advantage to show how rules can change the course and tension of play. That example suggests a way to inspect our imaginary dungeon: follow the feedback. Does success broaden the player’s options? Does failure supply information? Does the next reward make yesterday’s learning useful or bypass it? These questions reach the experience through the workings of the system.",
      "The loop earns its next turn when something worth carrying forward comes out of the previous one. That can be modest: a clean dodge, an amusing mishap, a small improvement to a cherished character. Random loot makes the transfer more complicated, because effort and the desired object no longer arrive on the same schedule. The machine can keep turning while one player is still waiting."
    ],
    takeaway:
      "Inspect what changes between repetitions: capability, knowledge, relationships and usable choices.",
    panel: {
      title: "Nested reasons to continue",
      flow: true,
      items: [
        { label: "Moment", text: "Act → perceive the result" },
        { label: "Encounter", text: "Read a situation → adapt" },
        { label: "Session", text: "Choose and complete a goal" },
        {
          label: "Longer project",
          text: "Learn, explore, build or coordinate",
        },
      ],
    },
    sources: ["mda", "season"],
    evidence:
      "MDA supplies the three-level framework and Monopoly example. The dungeon, timescales and proposed review questions are original explanatory models, not measurements of Diablo IV or validated causal claims. The campaign/season comparison interprets the game’s progression structure using Blizzard’s 2023 account of seasonal design; it does not infer that repeat play requires repeat payment.",
    sections: [
      {
        at: 3,
        title: "What survives the turn",
      },
      { at: 4, title: "The campaign and the seasonal climb" },
      { at: 6, title: "What the next reward changes" },
    ],
    paragraphCitations: {
      "1": ["mda"],
      "5": ["season"],
      "7": ["mda"],
    },
  },
  {
    id: "loot-table",
    part: 3,
    title: "The loot table",
    lede: "A one-in-twenty chance does not promise a reward on the twentieth attempt.",
    paragraphs: [
      "Loot is the equipment and other items found through play. When a monster leaves an item behind—a drop—the player stops to inspect it, compare it with what they have and imagine a use for it. A loot table defines possible rewards and their chances. Finding a rare object and deciding whether it suits the character are different pieces of the experience.",
      "Blizzard’s 2024 Loot Reborn announcement makes that relationship unusually explicit. The stated aim was to make dropped upgrades easier to recognize, reduce the quantity of items to sort and move some complexity into Tempering and Masterworking, systems for modifying and improving equipment. This was a historical redesign of where item decisions happened. Changing the number of drops was only one part of changing the player’s work around them.",
      "The simplest possible loot model strips that work away so we can inspect one problem clearly. Suppose every attempt has a fixed 5% chance of awarding our imaginary target, independently of previous attempts. After twenty attempts, the probability of at least one success is about 64.2%. More than a third of otherwise identical players would still have nothing. Twenty attempts is also the mean waiting time in this model; it is emphatically not a delivery guarantee.",
      "Our unfortunate player can complete twenty more attempts without receiving credit for the first twenty in the next roll. The probability of the next success remains 5%. A designer looking at aggregate item output and a player looking at an empty slot can therefore both describe the same system accurately. One sees its rate of production. The other experiences the uncertain length of a personal project.",
      "Now give the player alternatives in a hypothetical redesign. A guaranteed award after a fixed number of attempts puts a ceiling on this particular wait. A material earned on every failure can turn an unwanted result into partial progress. A trade route allows effort elsewhere to purchase the object. A targetable source lets the player narrow the search. Each change redistributes uncertainty, choice and commitment; none can be described adequately by the rarity label alone.",
      "The stakes also depend on what happens during the search. An enjoyable encounter with friends and a compulsory payment for each attempt have different costs, even if a probability calculation looks identical. Our model knows nothing about enjoyment, prices, changing odds, duplicates or the rest of an inventory. It is here to make the unlucky tail visible, not to diagnose players from a curve.",
      "Randomness therefore allocates more than equipment. It can change how long a personal project takes and whether friends remain on the same route. The probability model shows variation in attempts; it cannot tell us whether those attempts are welcome. Ask what people can choose while they wait, what a run offers without the target drop, and whether the search still fits the time they intended to give it."
    ],
    takeaway:
      "Judge a reward system by the unlucky route through it, as well as its average output.",
    interactive: "probability",
    sources: ["lit-loot-reborn"],
    evidence:
      "The 2024 itemization example is dated developer documentation. The calculator and 5% example use independent, fixed hypothetical odds: 1 − (1 − p)ⁿ. No Diablo drop rates, paid-draw equivalence or psychological effect is inferred.",
    sections: [
      {
        at: 2,
        title: "The player in the tail",
      },
    ],
    paragraphCitations: {
      "1": ["lit-loot-reborn"],
    },
  },
  {
    id: "the-checklist",
    part: 3,
    title: "The checklist",
    lede: "A list can help you enter a world. Add a deadline and it also begins arranging your week.",
    paragraphs: [
      "In a game that leaves many places and activities open, “what shall we do tonight?” can be a tiring question. A checklist gives the group a route: complete these objectives, then claim this reward. A reward track arranges such rewards along a series of milestones. That structure can guide newcomers or fit an activity into the time friends have available. Add a deadline, however, and the game also starts arranging their week.",
      "The bargain changes when the list expires. The objective now has two properties: what it asks someone to do and the date by which they must do it. A player choosing between an interesting side path and an expiring task is weighing a consequence outside the immediate adventure. Even a purely cosmetic reward can organize that choice if it matters enough to the person who wants it.",
      "Imagine a four-week track, with a desired item near the end. In one version, unfinished progress stays available. In another, the track closes. Missing week three leaves different options in the two versions, although the tasks and reward are identical. This is the point of the exhibit: remove one week of participation and inspect the remaining path. The clock is a rule with consequences, not decoration around the reward.",
      "Halo Infinite, a science-fiction shooting game, separated two policies in its May 2022 Season 2 article. Purchased premium passes remained available, and players could switch between them; returning to an earlier free pass required its premium entitlement. The policy separates the arrival of a new season from a purchased track’s expiry, while preserving a meaningful difference between the free and paid conditions. That exact scope matters when comparing the promise.",
      "Ghost Ship Games makes Deep Rock Galactic, a cooperative game about miners exploring hostile caves. Its April 2024 proposal went further toward treating seasons as a selectable library. It described reactivating older passes and branching collections of appearance rewards with previous progress intact, while people with different seasons selected could still play together. Some season-specific assignments would not return.",
      "Keeping a track available does not automatically make its tasks interesting. Expiration is also only one source of commitment: friends, a competitive event or a shared launch can give a date a real purpose. The design review should identify what the deadline contributes to this experience. Does it make a collective occasion possible? Does it keep the activity coherent? Does it mainly make postponement costly? Different answers justify different clocks.",
      "A shared date can make an evening possible: everyone knows when to return. A personal deadline can also make the same evening harder to share, if friends need different activities to finish their rewards. Evaluate the calendar against the occasion it organizes. After a missed week, can people still play together, understand what remains and leave comfortably when their time is up? Those are different questions from whether the checklist increased completed tasks."
    ],
    takeaway:
      "Take a week out of the schedule and inspect the player’s remaining choices.",
    figures: [
      {
        asset: "legacy-season-rank",
        alt: "Diablo IV Death Awakening season ranks interface with a time remaining indicator",
        caption:
          "A historical Death Awakening season screen makes ranks and remaining time visible. It is not evidence of the current season’s objective requirements.",
        credit: "Blizzard",
      },
      {
        asset: "drg-season-selection-proposal-2024",
        alt: "Deep Rock Galactic proposed season selection menu marked work in progress",
        caption:
          "Ghost Ship’s April 2024 season-selection proposal, visibly marked WORK IN PROGRESS. Use the developer’s documented policy separately from the mockup’s exact UI.",
        credit: "Ghost Ship Games · 2024 proposal",
      },
      {
        asset: "halo-premium-pass-rewards-2022",
        alt: "Halo Infinite Season 2 promotional reward lineup",
        caption:
          "A 2022 promotional reward lineup. The accompanying launch article documents ongoing premium-pass access; the artwork itself does not establish that policy or the free track’s rules.",
        credit: "343 Industries / Xbox · 2022 promotional art",
      },
    ],
    sources: ["halo", "drg"],
    evidence:
      "Halo’s policy is scoped to its documented 2022 premium/free distinction. Deep Rock Galactic is described through the April 2024 proposal and its stated exceptions. The four-week track is hypothetical, not a reconstruction of either game’s progression.",
    sections: [
      {
        at: 3,
        title: "A release date and an expiry date",
      },
    ],
    paragraphCitations: {
      "3": ["halo"],
      "4": ["drg"],
    },
  },
  {
    id: "familiar-verbs",
    part: 3,
    title: "Familiar verbs, changing decisions",
    lede: "Attack, move, dodge: a short vocabulary can still support a long conversation.",
    paragraphs: [
      "In Diablo II and Diablo IV, a player moves a character through danger, attacks enemies and inspects equipment. Designers often call actions such as moving, attacking and dodging the game’s verbs. The family resemblance is visible even in a screenshot. As in chess, a small set of familiar moves can support very different situations; the important comparison is what decisions those moves make possible.",
      "To see what a screenshot leaves out, build a deliberately small example. The player faces an enemy across an open floor, with room to approach and retreat. Put a hazard behind the player and backing away becomes dangerous. Put cover between the two figures and the direct approach closes; the player has to go around it. The attack button remains exactly where it was. The floor has changed what must happen before and after the press.",
      "We have added no new verb to the player’s move set. We have changed the information needed before acting, the cost of a mistake and the alternatives after it. Try the three layouts in the tactical exhibit. Its deliberately spare geometry makes the changed decision visible before textures, animation and spectacle can distract us from it.",
      "Jesper Juul’s account of emergence and progression gives the comparison a useful foundation. Games can combine rules that generate varied situations with sequences of authored challenges. His analysis of EverQuest, an online role-playing world, shows both structures in one world: a general system of character abilities and cooperation alongside individually specified quests. Reusing an action within a new relationship between rules can produce a different problem, while adding more destinations can leave an old problem largely intact.",
      "That distinction also prevents novelty from becoming its own bureaucratic target. A new button may add a decision; it may add another step to the same answer. A familiar enemy can become interesting through terrain, scarcity or an unexpected companion. For any claimed improvement, describe a situation in which the player notices different information and makes a consequential choice. If no such situation can be found, the change may belong mainly to presentation, content volume or convenience.",
      "The fair comparison between Diablo generations would therefore follow actual encounters: what the player could anticipate, what a build made possible, how failure taught the next attempt, and which choices disappeared once the character became powerful. The combat screenshots in this study’s reference archive begin that inquiry by showing continuity in the visual language. They cannot finish it, and they cannot identify monetization as the cause of continuity.",
      "The familiar action is only the beginning of the comparison. A purchase can change which places a group can enter, how an item is acquired or which encounter a character can handle. Each reaches a different part of the activity people came for. Following those consequences gives us a practical way to examine what a game sells, starting with access."
    ],
    takeaway:
      "Compare the information, commitments and consequences around an action.",
    figures: [
      {
        asset: "legacy-d2-combat",
        alt: "Diablo II combat near the Cairn Stones with Rakanishu",
        caption:
          "Diablo II: a historical combat interface. The image demonstrates visual vocabulary, not the complete combat system.",
        credit: "Blizzard",
      },
      {
        asset: "legacy-d4-corridor",
        alt: "Diablo IV character in the Hell-Touched Corridors with health and resource displays",
        caption:
          "Diablo IV: familiar framing and resources. Understanding the differences requires observing play, builds and encounters.",
        credit: "Blizzard",
      },
    ],
    sources: ["juul"],
    evidence:
      "The combat comparison begins with owner-provided historical captures. The sword-swing encounter is an invented teaching model. Juul supplies the emergence/progression distinction; no unseen Diablo mechanics or causal account of genre development is asserted.",
    paragraphCitations: {
      "3": ["juul"],
    },
  },
  {
    id: "access",
    part: 4,
    title: "Access",
    lede: "You can own the expansion and still be standing outside its door.",
    paragraphs: [
      "Shadow of the Erdtree adds an adventure to Elden Ring, a fantasy game built around exploration and demanding combat. Buying the expansion is only one requirement for entering it. Publisher Bandai Namco’s June 2024 guide also requires defeating two major enemies, Starscourge Radahn and Mohg. Payment adds the destination; progress through the game makes it reachable.",
      "Booking an advanced course does not supply the preparation it requires. An expansion can make a similar distinction between paying for access and being ready to use it. Its prerequisites may connect the new adventure to the old one or ensure that the player has learned enough to proceed. They can also frustrate someone who expected to join friends immediately. The offer needs to explain the remaining work before the buyer commits.",
      "The exhibit separates ownership from readiness. Open the first gate and the second remains closed. This is a small piece of accounting that shop language often compresses into one inviting verb: unlock. The word can mean receiving a finished object, receiving permission to attempt an activity, or receiving access to a collection whose objects require further work. Those are different purchases even when their confirmation buttons look identical.",
      "For a worked example, imagine buying entry to a new fortress. One offer opens its campaign immediately. A second opens a challenge whose equipment must be earned. A third opens a reward catalog, with a deadline for claiming its contents. Each can contain appealing work. Yet a player deciding whether to spend needs to picture a different future: an evening of exploration, a demanding project, or a schedule that now has an expiry date attached.",
      "This is where the distinction between content and commitment becomes useful. A list of included maps tells us what the studio produced. It tells us less about what the buyer must bring: a suitable character, knowledge of earlier systems, other players, repeated sessions. If those requirements remain invisible until after checkout, the game has sold a destination while leaving the journey to be discovered as an administrative surprise.",
      "A stronger offer lets the player rehearse that journey before paying. Show where the entrance is, what condition is still unmet and whether waiting changes anything. The appeal can survive this clarity. A difficult door is often exactly what an experienced player wants to buy. They need to recognize the door they are choosing, including the work on the other side.",
    ],
    takeaway:
      "Ownership and readiness are separate states; the offer should make both visible.",
    figures: [
      {
        asset: "d4-campaign-state",
        alt: "Diablo IV campaign selection with an Endgame recommendation and locked expansion entries",
        caption:
          "Campaign selection captured on 1 October 2026. The owner reports the current version/season; locked entries show this account’s access state.",
        credit: "Blizzard",
      },
    ],
    sources: ["txn-erdtree-entry"],
    evidence:
      "The Erdtree prerequisites are documented in a June 2024 publisher guide. The fortress offers are invented comparisons, not claims about Diablo IV expansion gating or current prices.",
    sections: [
      {
        at: 2,
        title: "What does “unlock” unlock?",
      },
    ],
    paragraphCitations: {
      "0": ["txn-erdtree-entry"],
    },
  },
  {
    id: "identity",
    part: 4,
    title: "Identity",
    lede: "A helmet can change nothing on the damage sheet and still change the character you want to inhabit.",
    paragraphs: [
      "A cosmetic changes a character’s appearance without changing its combat abilities. Imagine two versions of one character at a campfire: one in plain iron, another wearing a crown that looks confiscated from a cathedral. Their attacks are identical, but they suggest different people. Clothing, team shirts and souvenirs work through similar meanings outside games. The appearance can matter even when its audience is only the person wearing it.",
      "Vili Lehdonvirta’s 2009 study gives that intuition more useful language than the usual functional-versus-cosmetic split. His exploratory analysis of fourteen virtual-goods platforms distinguishes practical utility, aesthetic pleasure and social meaning. Several can inhabit one object. The point is to ask what makes this particular object desirable, rather than treating everything without a damage bonus as the same kind of purchase.",
      "Research on avatars, the figures that represent people in virtual spaces, also gives us a reason to take representation seriously. In Yee and Bailenson’s 2007 experiments, participants were assigned different virtual appearances; changes in attractiveness or height were associated with differences in social interaction and negotiation. These were short laboratory encounters, not a study of buying armor in Diablo. They establish a narrower possibility worth carrying into design: the figure representing us can participate in how we act, as well as how we are seen.",
      "The wardrobe below holds mechanical capability steady while changing appearance. Try looking at the same outfit as a collector, a role-player and a member of a group. A collector may care about completing a visual set. A role-player may reject the most elaborate option because it contradicts the character. A group may choose something recognizably shared. A single sales event would flatten those intentions into one identical row in a purchase log.",
      "The same question extends beyond this simplified wardrobe: how much authorship remains after purchase? Imagine a system that lets someone change the crown’s finish, removing its brightest ornament, or pairing it with the plainest coat in the inventory. The buyer begins arranging a character rather than simply equipping a complete advertisement. A rigid matching set and a flexible collection can contain equally elaborate art while allowing very different degrees of personal composition.",
      "The earned wardrobe therefore deserves as much care as the paid one. Learning the world and making a character should already give someone a convincing identity within it. A purchased appearance can add authorship, pleasure or a way to mark belonging. Its value grows within a world the player has reasons to inhabit. Making the unpaid character feel inadequate would change that relationship as well as the next offer."
    ],
    takeaway:
      "Judge an appearance by the fantasy and expression it supports, alongside its mechanical effects.",
    figures: [
      {
        asset: "legacy-d4-shop-grid",
        alt: "Diablo IV shop with cosmetic bundles, a refresh countdown and an Ancient Hydra preview",
        caption:
          "A historical shop screen groups appearance items and displays a refresh timer. Its offers and prices are not presented as current.",
        credit: "Blizzard",
      },
    ],
    sources: ["goods", "txn-proteus"],
    evidence:
      "The virtual-goods study is exploratory; the Proteus experiments examine assigned avatars in brief VR interactions. Neither measures Diablo IV cosmetic purchases. The campfire, crown and wardrobe interpretations are original thought experiments.",
    sections: [
      {
        at: 3,
        title: "The story attached to the object",
      },
    ],
    paragraphCitations: {
      "1": ["goods"],
      "2": ["txn-proteus"],
    },
  },
  {
    id: "time",
    part: 4,
    title: "Time",
    lede: "The thing for sale may be a weapon. The practical purchase is a different route to having it.",
    paragraphs: [
      "Warframe is Digital Extremes’ science-fiction action game. Its Foundry is a workshop where players build equipment from blueprints and collected resources. The developer’s guide describes that route alongside buying finished equipment with Platinum, a purchasable currency. Making and buying lead toward the same object through different experiences. For one person, assembling it is the project; for another, the unfinished project stands between tonight’s plans and the equipment they want to use.",
      "A sentence such as ‘you can earn it’ leaves most of that difference unresolved. Where are the required materials? Can the player deliberately seek them? Does the activity teach something useful or merely need repeating? What happens during a crafting wait? The complete route includes information, inventory decisions and interruptions as well as minutes. A stopwatch records duration while missing much of the experience that makes that duration welcome or unwelcome.",
      "Trade adds a third route. Warframe’s support rules allow eligible Platinum to move between players, including currency previously received through trade; starting and promotional Platinum have restrictions. That means the person using Platinum need not be the person who originally paid for it. A player can turn desirable finds into purchasing capacity. This creates another form of work: knowing what others want, finding a counterpart and deciding what to part with.",
      "The routes in the exhibit therefore end at a shared destination but carry different obligations. Purchasing can remove a search or a wait. Crafting can make the item the culmination of an expedition. Trading can turn an unwanted drop into progress toward a chosen build. None of those descriptions tells us which route a particular person enjoys. It tells us what must be compared before calling a payment a harmless shortcut or a necessary escape.",
      "Path of Exile, Grinding Gear Games’ action role-playing game, provides another example. A stash tab is a page of storage for the player’s items. In a January 2022 support reply, the developer explained how a public premium stash tab lets its owner price items individually or price the tab’s contents together. The purchase changes an interface used to offer goods to other players. More storage and easier selling can overlap. This is a specific convenience, not evidence that all trading requires a paid tab.",
      "Convenience deserves close attention precisely because it can be valuable. Removing repetitive sorting may leave more room for experimenting with a build. Removing an entire acquisition journey may remove the reason to use that build tomorrow. The design question is which friction carries the game’s meaning and which friction merely consumes the evening. Once a studio sells relief, it has two versions of that evening to maintain. Inspect both: what the paying player skips, and what everyone else is still being asked to enjoy.",
    ],
    takeaway:
      "Trace every route to the reward, including the work that a convenience purchase removes.",
    panel: {
      title: "One item, several commitments",
      items: [
        {
          label: "Play and craft",
          text: "Time, materials, knowledge and inventory capacity",
        },
        { label: "Purchase", text: "Currency and any remaining prerequisites" },
        {
          label: "Trade",
          text: "Another player, eligible goods and transaction rules",
        },
      ],
    },
    sources: ["warframe", "trade", "poe"],
    evidence:
      "Warframe and the dated Path of Exile support reply establish specific acquisition and listing features. No matched-item completion time, current price, universal trade eligibility or required purchase for all trading is claimed.",
    paragraphCitations: {
      "0": ["warframe"],
      "2": ["trade"],
      "4": ["poe"],
    },
  },
  {
    id: "power",
    part: 4,
    title: "Power",
    lede: "The sword’s statistics tell us what it can do. Its acquisition route tells us what the game has rewarded.",
    paragraphs: [
      "An auction house is a market where players list items for others to buy. Picture someone searching it for a weapon before choosing a dungeon to explore. They compare prices and acquire an upgrade. The dungeon may still be enjoyable, but buying now competes with finding for the practical job of improving the character. The question is how that market changes the activity that gives the equipment its appeal.",
      "Blizzard confronted that conflict publicly in September 2013. John Hight’s Diablo III announcement said the auction houses had been intended to make trading convenient and secure, yet were undermining the core experience of killing monsters for desirable loot. Both the gold and real-money houses were scheduled for removal in March 2014. Including the gold house matters: the stated design problem extended beyond the presence of a cash payment.",
      "The useful question is what an efficient player learns to do next. In the imagined dungeon route, a disappointing drop leaves a problem of encounter choice, build adjustment or another attempt. In the market route, it may leave a pricing problem. The sword arrives with the same combat properties, but the sequence that produced it trains attention elsewhere. A game can support that economy deliberately. It needs to understand that the economy is now one of its main activities.",
      "Grinding Gear Games, the developer of Path of Exile, addressed a related tension in its 2017 Trade Manifesto. The studio defended trade as part of what made items valuable while arguing that very easy exchange could compress the number of upgrades on the way to a final build. This is a developer’s historical design argument, not an experimental demonstration that every faster market damages enjoyment. It is useful because it identifies the scarce resource under discussion: the journey between an inadequate item and an excellent one.",
      "Power itself also needs a context. An increase in damage can shorten a private encounter, help a cooperative group or alter a competitive ranking. Access to a new option may matter more than a percentage bonus if it bypasses a constraint the encounter relies on. To compare purchases, hold the situation still: same opponent, same rules, same skill, then ask which possibilities changed and who else experiences the consequence.",
      "A route can succeed at delivering an upgrade and still weaken the activity that was supposed to make the upgrade satisfying. Evaluating the sale therefore requires following the player after acquisition. Do they have a new problem they are eager to tackle, or have they purchased their way past the most interesting problem the game had left?",
    ],
    takeaway:
      "A powerful item also rewards the route used to acquire it; examine what that route teaches the player to prioritize.",
    panel: {
      title: "Two routes to the same reward",
      items: [
        { label: "Play route", text: "Encounter → uncertainty → acquisition" },
        { label: "Market route", text: "Search → exchange → acquisition" },
      ],
    },
    sources: ["auction", "txn-trade-manifesto"],
    evidence:
      "Blizzard’s closure announcement and GGG’s 2017 manifesto are primary statements of design intent and diagnosis, not controlled causal studies. No deliberate drop-rate manipulation or universal judgment about player markets is asserted.",
    sections: [
      {
        at: 2,
        title: "The market becomes an activity",
      },
    ],
    paragraphCitations: {
      "1": ["auction"],
      "3": ["txn-trade-manifesto"],
    },
  },
  {
    id: "what-things-cost",
    part: 5,
    title: "What things actually cost",
    lede: "The item has a token price. Your bank account encounters a different number.",
    paragraphs: [
      "Platinum is Diablo IV’s purchased virtual currency. It works like a prepaid balance: cash buys a quantity that can then be spent in the game. A historical Canadian store capture lists 1,000 Platinum for CAD 13.49. Imagine an item costing 900 Platinum and a player starting with none. Buying that single pack requires CAD 13.49 now and leaves 100 Platinum after the item purchase. The displayed item price and the cash needed to obtain it answer different questions.",
      "It is tempting to multiply 900 by the pack’s per-token rate and call the result the item’s price. That yields an allocation of the pack’s cost, useful for some comparisons. It still cannot be paid on its own in this example. The player must choose the full pack. Conversely, charging the entire pack to this one item ignores the remaining currency’s possible future use. The arithmetic needs two visible lines: cash committed today, currency remaining tomorrow.",
      "The calculator keeps the situation deliberately small: one selected pack, one hypothetical item and no starting balance. Change the pack and watch how affordability and remainder move together. A more favorable token rate can require a larger cash commitment. Whether that is useful depends on purchases the player actually intended to make, rather than on the size of the discount alone.",
      "Research gives us reasons to study the representation of payment, while leaving the size of any game-specific effect open. Raghubir and Srivastava’s 2008 experiments compared cash with other payment forms, including stored-value certificates. They found differences in spending under their tested conditions; making the parting with money more salient could reduce some differences. These were consumer experiments, not measurements of Diablo’s Platinum shop. Their relevance is the mechanism to investigate, not a percentage to paste onto game revenue.",
      "A prepaid balance also changes the next decision’s starting point. In this example, the next item is encountered by someone already holding 100 Platinum. The balance can be useful toward a purchase they wanted anyway. It can also make the question ‘Do I want another item?’ arrive tangled with ‘What should I do with this remainder?’ We cannot infer which thought wins from the existence of the balance. We can design the interface so that both the new cash outlay and the resulting balance are easy to inspect.",
      "Arcade tokens and Platinum both put an internal unit between money and an activity. Their actual terms still need separate inspection: what the unit buys, how it is acquired and what happens to the remainder. The calculator keeps the cash commitment and leftover balance visible together. The game can make its currency feel like treasure while giving the person paying a receipt they can understand."
    ],
    takeaway:
      "Show today’s cash outlay and tomorrow’s remaining currency as separate quantities.",
    interactive: "price",
    figures: [
      {
        asset: "legacy-d4-platinum",
        alt: "Diablo IV Platinum packs with cash prices from the owner’s Canadian-dollar store",
        caption:
          "Diablo IV’s Platinum packs, priced in CAD. Historical prices.",
        credit: "Blizzard",
      },
    ],
    sources: ["txn-payment-form"],
    evidence:
      "Prices come from the owner-supplied historical CAD capture; capture date is unknown. The 900-Platinum item is invented. The model assumes zero starting balance and one pack, without tax or combination optimization. Payment research is not a game-specific spending estimate.",
    paragraphCitations: {
      "3": ["txn-payment-form"],
    },
  },
  {
    id: "two-key-lock",
    part: 5,
    title: "The two-key lock",
    lede: "One key opens the catalog. Another pays for what you take from it.",
    paragraphs: [
      "Diablo IV introduced Reliquaries, catalogs of cosmetic rewards, in April 2025. Premium catalogs required access bought with Platinum, its purchased currency. Claiming their contents required Favor, tokens earned by playing. Paying opened the catalog; it did not automatically deliver every object inside. The distinction resembles enrolling in a course: the payment opens an opportunity whose completion still asks something of the participant.",
      "The 99-token limit constrained the balance held at once. Spending created room to earn again; up to 99 could carry forward. Think of a reservoir: its capacity and the total water passing through it answer different questions.",
      "Try an invented arithmetic example. Use the earning control to fill the reservoir to 99, unlock access, then claim something costing 30; the balance becomes 69. Earn another 25 and it rises to 94, while cumulative earnings reach 124. The balance stays below the cap while the total passing through it exceeds the cap. In the exhibit, watch held and lifetime-earned values separately as the machine refills. The example illustrates capacity and flow, without asserting an actual item price or earning speed.",
      "Claim order was flexible; completion unlocked bonuses, while unclaimed rewards expired. A person seeking one object could prioritize it. A completionist had to plan for the set.",
      "The two keys are therefore not independent in the player’s life. Buying access today can make a future evening feel differently allocated: there is now a paid opportunity waiting to be used. Whether that becomes satisfying direction or an unwelcome appointment depends on the person’s intentions, the remaining work and the time available. A completed catalog alone cannot distinguish those experiences. Ask what the player had hoped to do and whether the route left room to do it.",
      "For a designer, the practical unit of explanation is the complete journey to the desired reward. Begin with the item a person actually wants, then work backwards through catalog eligibility, required play, any completion condition and the deadline. This may reveal a perfectly reasonable project. It may reveal that a modest-looking purchase recruits several future sessions. Either way, the player should be able to see that future before turning the first key.",
    ],
    takeaway:
      "Treat the offer as a purchase plus a future play commitment; distinguish balance capacity from total earnings.",
    panel: {
      title: "Documented 2025 structure",
      flow: true,
      items: [
        { label: "Platinum", text: "Unlock eligible premium catalog access" },
        { label: "Play", text: "Earn Favor, up to the held-balance limit" },
        {
          label: "Favor",
          text: "Claim accessible rewards; spending makes room to earn again",
        },
      ],
    },
    figures: [
      {
        asset: "legacy-favor-tutorial",
        alt: "Favor Tokens tutorial explains that players can hold 99 tokens, spend them and earn more",
        caption:
          "The tutorial distinguishes the maximum held balance from how much can be earned over time. This is a historical capture.",
        credit: "Blizzard",
      },
    ],
    sources: ["reliquary"],
    evidence:
      "Historical April 2025 mechanics. The 99→69→94 sequence uses illustrative earning and claim amounts; earning speed and current offers are not estimated.",
    sections: [
      {
        at: 1,
        title: "Capacity is not a quota",
      },
    ],
    paragraphCitations: {
      "0": ["reliquary"],
      "1": ["reliquary"],
      "3": ["reliquary"],
    },
  },
  {
    id: "abstraction-and-surface",
    part: 5,
    title: "Abstraction and surface",
    lede: "A beautiful offer can be easy to want and surprisingly difficult to explain.",
    paragraphs: [
      "Imagine an online purchase that sends you to separate screens for the item, its price, eligibility and the deadline. A game’s reward shop can distribute the decision in exactly that way. One screen shows armor; another sells currency; a catalog panel explains access; a smaller view supplies the claim requirements. Each piece may be legible. The buyer still has to assemble the whole commitment in memory.",
      "Abstraction is part of the attraction of a game. We want a coin to feel like treasure and an unlocked vault to feel like an event. Trouble arises when the same theatrical shorthand has to carry an ordinary purchasing decision. ‘Unlock’ compresses several possible meanings. A shining token can represent money already spent, effort already supplied or permission still missing. Keeping the visual language coherent does not make those meanings interchangeable.",
      "Hsee and colleagues’ 2003 research on medium maximization supplies a particularly strange lens. In one questionnaire study, participants chose between tasks leading to different ice-cream flavors. Introducing points between task and reward changed choices toward the longer task, even though the points had no independent use. It is a small experimental setting, far from a persistent game economy. Its useful provocation is precise: people may evaluate the intermediate score as though improving it were the final objective.",
      "That helps formulate a question for the reward altar below. With the terms scattered, which fact becomes easiest to attend to: the largest number, the rarest-looking object or the shortest route to the glowing button? Gather the same terms together and ask again. No offer has become cheaper. No reward has changed. The exhibit changes the work required to understand the relationship among them. That difference deserves testing on its own.",
      "Interface experiments also caution against diagnosing effects by appearance alone. Luguri and Strahilevitz’s 2021 studies of online service enrollment found that some manipulative presentations changed choices, while their countdown-timer condition did not significantly increase purchases. An angry-looking clock is not a measurement of pressure, just as a quiet button is not proof of neutrality. Their results come from a particular enrollment task; a game needs evidence from its own decision path.",
      "A useful review gives someone a concrete intention—obtain this appearance, within this budget, without committing to another week—and lets them inspect the offer. Before confirmation, ask them to describe what payment delivers, what remains to be done and what happens if they stop. Then compare their account with the actual rules. A fast checkout with a wrong explanation is a failure of understanding, even when the proportion completing a purchase—its conversion rate—rises. This is where the interface’s craft becomes consequential: the same precision that makes a sword feel heavy can make a decision feel graspable.",
    ],
    takeaway:
      "Test the player’s explanation of the whole commitment, alongside their ability to complete checkout.",
    panel: {
      title: "Before confirming",
      items: [
        { label: "Ownership", text: "What exactly will become mine?" },
        {
          label: "Remaining effort",
          text: "What must I still earn or complete?",
        },
        { label: "Time", text: "What expires, and when?" },
        {
          label: "Balance",
          text: "What cash leaves, and what currency remains?",
        },
      ],
    },
    sources: ["txn-medium", "txn-dark-patterns"],
    evidence:
      "The shop path and review task are original analytical examples. Medium-maximization and service-enrollment experiments support specific questions about representation, not a diagnosis of Diablo players or a universal timer effect. No legal conclusion is drawn.",
    sections: [
      {
        at: 3,
        title: "Bring the terms into one view",
      },
    ],
    paragraphCitations: {
      "2": ["txn-medium"],
      "4": ["txn-dark-patterns"],
    },
  },
  {
    id: "does-it-work",
    part: 6,
    title: "Does any of it work?",
    lede: "The coin box, the activity log and the receipt can all be full. We still need to know whether the evening was worth having.",
    paragraphs: [
      "Return to the small question that began this study: what did someone hope to do with their evening? Stepan’s level-eight Barbarian, funduck, supplies one concrete case. A Barbarian is a close-combat character in Diablo IV; this one belongs to the Eternal Realm, outside the seasonal restart. Its owner comes back to an unfinished adventure in a game also offering another fresh beginning. Before asking which route retains the player longer, ask which route they intended to take.",
      "This one case cannot stand in for a population. It can expose a question worth investigating. Ask returning players what they intend to do, watch how they interpret the available routes, and ask what they believe will happen to their character. Then look at where the session actually goes. A fast route into play may help; a fast route into the wrong activity can merely postpone the confusion.",
      "The wider literature gives us reason to keep experience beside behavior. Ballou and colleagues’ 2025 study combined Nintendo play records with surveys from 703 casually engaged US adults. Their estimates did not establish a relationship between hours played and well-being, but were too uncertain to demonstrate its absence. Players’ assessments of how gaming fitted into their lives were associated with well-being. The study is observational and its population specific; it supports asking richer questions, without proving a particular design will improve anyone’s life.",
      "A studio needs several accounts of the same evening. Behavior tells it whether people returned or bought something. Experience tells it what they understood, enjoyed or regretted. Operations tells it whether connections, invitations and activities worked. The business account asks whether the work can be funded again. These answers can support one another, but none can safely substitute for all the others.",
      "Controlled experiments can help determine whether a particular change caused a measured difference. They require sound assignment, measurement and interpretation. Microsoft’s research on long-running experiments warns about selection, survivorship and changing populations over time; simply leaving a test running does not settle those problems. An increase in the chosen outcome also needs a reason to count as improvement. The experiment estimates an effect. The team remains responsible for deciding which effects it values.",
      "Consider a test of a clearer returning-player screen. Define success before launch: people can identify a suitable realm and activity, understand what persists and begin the session they intended. Include someone returning alone and friends returning together. Observe wrong turns, failed attempts to join, support needs and what people say afterward. Follow revenue and costs too. The point is to find a workable relationship among these outcomes, with room to learn when they disagree.",
      "We began with a cabinet in a room. The manufacturer sold a machine, the operator sold turns and the venue could offer an evening worth coming out for. Online, parts of those jobs can meet inside one product. The old commercial question survives, surrounded by new creative possibilities and new obligations. What do people value here, what does providing it require, and how can payment help sustain it?",
      "That is the standard this study proposes. A game may leave us with a skill, a story, an object, a friendship or simply a good hour. A viable business can keep making those possibilities available. Its offers deserve to be judged by how they fit the experience they draw their value from. The next sale matters. So does the life around it."
    ],
    takeaway:
      "What makes the experience worth having—and can the way it is funded keep that value intact?",
    panel: {
      title: "Four kinds of evidence",
      items: [
        { label: "Behavior", text: "What did people do?" },
        { label: "Experience", text: "How did they describe it?" },
        { label: "Business", text: "What value and costs resulted?" },
        { label: "Causality", text: "Which change produced which effect?" },
      ],
    },
    figures: [
      {
        asset: "legacy-d4-char-select",
        alt: "Diablo IV Season Info popup over the owner’s character selection screen",
        caption:
          "The Season Info prompt distinguishes a new seasonal character from continuing in Eternal. This is not the missing Rebirth confirmation.",
        credit: "Blizzard",
      },
    ],
    sources: ["lit-life-fit", "lit-experimentation", "experiment"],
    evidence:
      "funduck and the return uncertainty come from Stepan’s supplied handoff. The proposed onboarding evaluation is hypothetical. Ballou et al. (2025) is observational, uses a specific adult sample and has inconclusive equivalence tests; it establishes no causal design benefit. Experiment-method references supply methodological limits, not a Diablo result.",
    sections: [
      {
        at: 4,
        title: "Let the result change the decision",
      },
    ],
    paragraphCitations: {
      "2": ["lit-life-fit"],
      "4": ["lit-experimentation", "experiment"],
    },
  },
];

// Every chapter has a scene, a conceptual diagram, and a reference screenshot.
export const chapters: Chapter[] = manuscript.map((chapter) => {
  const visual = chapterVisuals[chapter.id];
  return {
    ...chapter,
    visual,
    figures: [
      chapter.figures?.find((figure) => figure.asset === visual.screenshot.asset) ?? visual.screenshot,
      ...(chapter.figures ?? []).filter(
        (figure) => figure.asset !== visual.screenshot.asset,
      ),
    ].sort((a,b)=>(a.placement === "opening" ? -1 : a.afterParagraph ?? Infinity) - (b.placement === "opening" ? -1 : b.afterParagraph ?? Infinity)),
  };
});

export const appendix = [
  "Describe the player’s desired experience before choosing the metric.",
  "Name what is bought, earned, retained and allowed to expire.",
  "Separate character state from player knowledge and account ownership.",
  "Compare the full paid and unpaid routes to the same outcome.",
  "Show cash outlay and leftover currency together.",
  "Treat a holding cap separately from a total earning limit.",
  "Test whether a break from the game remains a comfortable choice.",
  "Match each prototype or experiment to the uncertainty it can reduce.",
  "Keep historical policy, current interface and interpretation visibly distinct.",
  "Measure experience alongside behavior, and costs alongside revenue.",
];
