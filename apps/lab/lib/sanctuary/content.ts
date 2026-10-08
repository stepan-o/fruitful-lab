import {narrativeSources} from "./narrative-sources";
import {diabloHistoryChapters} from "./diablo-history-chapters";
import type { Chapter, EvidenceSource } from "./types";
import { worldBuildingChapter, worldBuildingSources } from "./world-building-chapter";
import { companyChapters, companySources } from "./company-chapters";
import { businessOverviewChapters } from "./business-overview-chapters";
import { chapterVisuals } from "./visual-content";
import { chainSources } from "./business-chains";

export const parts = [
  "The businesses around a game",
  "How Sanctuary changed",
  "Keeping the world alive",
  "What makes play worthwhile",
  "What the purchase changes",
  "The offer in front of the player",
  "Evidence of a better evening"
];
export const revision = "2026-10-08";
export const sources: EvidenceSource[] = [
  {"id": "microsoft-ecosystem", "title": "Microsoft — 2025 annual report, Gaming", "url": "https://www.microsoft.com/investor/reports/ar25/", "note": "Describes owned studios and publishing, third-party content, Xbox hardware, Game Pass, cloud gaming and advertising. Used to identify functions within one group, not private internal settlements or a uniform subscription offer."},
  ...narrativeSources,
  {"id": "steam-hardware-survey", "title": "Valve — Steam Hardware & Software Survey, September 2026", "url": "https://store.steampowered.com/hwsurvey/", "note": "Checked 8 October 2026. Valve states that its optional, anonymous hardware survey informs technology investment and product decisions. Cited for that stated purpose, not for any hardware-market percentage or a measured causal effect on game design. The page updates monthly."},
  {"id": "cyberpunk-plus-entry", "title": "PlayStation — Cyberpunk joins the Game Catalog, 9 July 2025", "url": "https://blog.playstation.com/2025/07/09/playstation-plus-game-catalog-for-july-cyberpunk-2077-abiotic-factor-banishers-ghosts-of-new-eden-and-more/", "note": "Base-game inclusion in Extra and Premium; Phantom Liberty was a separate discounted purchase. The historical promotional discount is not presented as current."},
  {"id": "cyberpunk-pass-entry", "title": "Xbox — Cyberpunk joins Game Pass, March 2026", "url": "https://news.xbox.com/en-us/2026/03/03/xbox-game-pass-march-2026-wave-1/", "note": "Lists Cyberpunk for Cloud and Console from 10 March, under Premium and Ultimate. It does not list PC access; no reason for that negotiated scope is disclosed."},
  {"id": "cyberpunk-ps-offer", "title": "PlayStation — Cyberpunk purchase, catalog and cloud offers", "url": "https://www.playstation.com/en-us/games/cyberpunk-2077/", "note": "US offer checked 7 October 2026: Extra catalog access; Premium required for supported PS5 and Portal cloud play. Base game and expansion are distinct offers."},
  {"id": "cyberpunk-xbox-offer", "title": "Xbox — Cyberpunk supported platforms and catalog offers", "url": "https://www.xbox.com/en-us/games/store/game/BX3M8L83BBRW", "note": "US listing checked 7 October 2026: Xbox One, Xbox Series and Xbox Cloud Gaming; Premium/Ultimate catalog inclusion. These console offers do not grant a Windows PC licence."},
  {"id": "cdpr-catalog-economics", "title": "CD PROJEKT — Q3 2025 earnings call, questions 1, 4 and 5", "url": "https://www.cdprojekt.com/en/wp-content/uploads-en/2025/11/transcript-q3-2025-earnings.pdf", "note": "PDF pages 5–6: management’s Sony-deal rationale, recognised revenue, undisclosed compensation and potential expansion sales. Chapter 2 quotes Nowakowski’s complete opening sentence in question 5 (page 6); the separate four-word life-cycle phrase, where used, comes from Nielubowicz’s answer to question 1. Management’s assessment is attributed; no amount, cash-payment schedule, independent causal estimate or Xbox contract terms are inferred."},
  {"id": "gfn-membership-terms", "title": "NVIDIA — GeForce NOW membership terms: virtual PC and content rights", "url": "https://www.nvidia.com/en-us/geforce-now/membership-terms/", "note": "The service rents virtual computing; the member needs sufficient rights to supported games. Store, device, region and publisher support can vary. Read alongside the PC Game Pass support article."},
  ...companySources,
  ...worldBuildingSources,
  {"id": "gfn-game-pass", "title": "NVIDIA — Microsoft games and PC Game Pass on GeForce NOW", "url": "https://nvidia.custhelp.com/app/answers/detail/a_id/5462/kw/basics", "note": "Supported Microsoft Store and PC Game Pass routes; not the whole Game Pass catalog or an included NVIDIA entitlement. Checked 7 October 2026."},
  {id:"steam-forza",title:"Steam — Forza Horizon 5: purchase, developer and publisher",url:"https://store.steampowered.com/app/1551360/Forza_Horizon_5/",note:"Purchase offer and Playground Games / Xbox Game Studios credits checked 7 October 2026. Used with NVIDIA’s support documentation to compare the same title through Steam and PC Game Pass on GeForce NOW."},
  {"id": "gfn-forza", "title": "NVIDIA — Forza Horizon on GeForce NOW, 14 December 2023", "url": "https://blogs.nvidia.com/blog/geforce-now-thursday-forza-horizon/", "note": "Specifically identifies Forza Horizon 5 via Steam, Xbox and PC Game Pass. Historical launch evidence, paired with current service and game offers; no current promotional bundle or price is assumed."},
  {id:"circuit-forza",title:"Xbox — Forza Horizon 5: game, credits and purchase/catalog offers",url:"https://www.xbox.com/en-US/games/forza-horizon-5",note:"Selected offer checked 6 October 2026. The diagram uses a local console download through an eligible Game Pass plan; separate purchase and cloud routes also exist."},
  {id:"circuit-game-pass",title:"Xbox — Game Pass access and membership terms",url:"https://www.xbox.com/en-US/xbox-game-pass",note:"Catalog access depends on the active subscription and title availability. No membership price, per-play compensation or private internal transfer is inferred."},
  {id:"circuit-spider-man",title:"PlayStation Store — Marvel’s Spider-Man 2 for PS5",url:"https://store.playstation.com/concept/10002456",note:"Selected US offer checked 6 October 2026: individual purchase, one-player game, and separate catalog/cloud options. The diagram follows purchase and local PS5 play."},
  {"id": "concord-offer", "title": "Firewalk — Concord pre-order offer, 6 June 2024", "url": "https://blog.playstation.com/2024/06/06/concord-is-now-available-to-pre-order-early-access-and-beta-detailed/", "note": "Historical US standard-edition list price and the promise of regular updates at no extra cost; not proof of why the release failed."},
  {"id": "concord-acquisition", "title": "Sony — Firewalk acquisition announcement, 20 April 2023", "url": "https://sonyinteractive.com/en/press-releases/2023/sony-interactive-entertainment-to-acquire-firewalk-studios-from-probablymonsters-inc/", "note": "Records the 2021 publishing partnership and the announced acquisition; price and terms were not disclosed."},
  {"id": "concord-closure", "title": "Sony — PlayStation Studios update, 29 October 2024", "url": "https://sonyinteractive.com/en/news/blog/an-update-from-playstation-studios/", "note": "Permanent sunset, studio closure and stated portfolio priorities. Management’s account is not an independent causal study."},

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
  {...chainSources["steam-pay"], id:"steam-settlement"},
  {...chainSources["amc"], id:"chain-cinema"},
  {...chainSources["netflix"], id:"chain-netflix"},
  {...chainSources["steam-cyberpunk"], id:"chain-cyberpunk"},
  {...chainSources["diablo"], id:"chain-xbox"},
  {...chainSources["dune"], id:"chain-dune"},
  {...chainSources["microsoft"], id:"chain-microsoft"},
  {...chainSources["gfn-cyberpunk"], id:"gfn-cyberpunk"},
  {id:"gfn-cyberpunk-tier",title:"NVIDIA — GeForce NOW tier compatibility, March 2026",url:"https://blogs.nvidia.com/blog/geforce-now-thursday-virtual-reality-update/",note:"Cyberpunk 2077 requires a paid tier from 1 April 2026; basic access after the premium-hours allowance is exhausted is not available for this title."},

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

const manuscript: Omit<Chapter,"visual">[] = [
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
    "lede": "A game can sell more than copies of itself.",
    "paragraphs": [
      "The game in the trailer may cost less than the machine you buy to play it. Later, it might appear in a subscription you already pay for. For the player, these look like questions of price and convenience. A game’s appeal can help sell other products. Someone buys a console because they want to play that game; someone else joins a subscription because it includes it. The publisher sells copies, while the hardware maker and catalog operator earn from different purchases connected to the same work.",
      "A promising prototype still needs a team, a budget and time. The development studio has to turn it into a game people will want to play. A publisher can back that work and take on the release: finding an audience, organizing promotion and arranging sales. In return, its contract sets out how the investment is recovered and the proceeds shared. A studio that publishes itself takes on both sets of decisions.",
      "Then the game has to get noticed among everything else on sale. Steam, Valve’s PC store, gathers releases from many publishers into a place where people discover, buy and keep games. The publisher gains a route to that audience; Valve earns an agreed share of sales. Their interests overlap without being identical. The publisher is selling its release; Valve can earn from the next purchase even if the player chooses somebody else’s.",
      "A studio’s grandest world is of little use to players whose machines cannot run it. Hardware suppliers sell the equipment that makes those ambitions reachable; cloud operators can sell access to a remote machine instead. Either way, the equipment shapes who can play and what the studio can build for them. Streaming also makes a suitable device and connection part of the bargain.",
      "Put several of these businesses under one roof, and a game can do more than earn back its own production budget. Sony’s PlayStation and Microsoft’s Xbox each combine studios, publishing, a store, consoles and subscriptions. They also carry other publishers’ games. A desirable release can help sell the machine; buying the machine brings a player within reach of its store and services. The game is part of the attraction of an entire ecosystem.",
      "NVIDIA’s GeForce NOW shows how the roles can stay separate. It runs supported Steam purchases on remote computers. Valve still handles the game sale; NVIDIA charges for computing on its paid plans. Renting the machine has not turned the purchased game into a rental. The opening diagram keeps selected arrangements apart so we can see their workings. The map below reconnects them: hold a game steady, then change where it is bought or accessed and whose machine runs it. Each route needs the appropriate agreements and technical support.",
      "A catalog asks something else of the game: help make the collection worth subscribing to. Its operator becomes another customer for the publisher, paying for permission to include the title. Players pay for access to the collection, which lasts only while they subscribe and the game remains included. The publisher has gained a buyer, but also given players an alternative to buying its game.",
      "When Cyberpunk 2077 joined Sony’s PlayStation Plus catalog in July 2025, its developer and publisher, CD PROJEKT RED, accepted that trade-off. Co-CEO Michał Nowakowski put it plainly: “So, there’s always a hit to current sales of the game when you launch on a subscription basis.”",
      "He judged the deal worthwhile anyway. Sony’s agreement added revenue, and the base game could bring new players to Phantom Liberty, the expansion left outside the catalog. The arrangement gave Sony another reason for people to subscribe and CD PROJEKT another chance to sell an addition to its game.",
      "Valve began on one side of this exchange, making games. Steam put it between other creators and their players. What could the company sell once its audience was coming for far more than Valve’s own releases? Eventually, it would make a machine for that library, too."
    ],
    "paragraphCitations": {
      "1": [
        "epic-publishing",
        "cdpr-business"
      ],
      "2": [
        "steam-visibility",
        "steam-settlement"
      ],
      "3": [
        "steam-hardware-survey",
        "gfn-membership-terms",
        "gfn-requirements"
      ],
      "4": [
        "sony-accounting",
        "microsoft-ecosystem"
      ],
      "5": [
        "steam-cloud",
        "gfn-membership-terms",
        "gfn-game-pass"
      ],
      "6": [
        "circuit-game-pass",
        "cyberpunk-plus-entry"
      ],
      "7": [
        "cyberpunk-plus-entry",
        "cdpr-catalog-economics"
      ],
      "8": [
        "cdpr-catalog-economics"
      ],
      "9": [
        "valve-history",
        "valve-about",
        "valve-deck-booklet"
      ]
    },
    "sections": [
      {
        "at": 4,
        "title": "When a game sells the machine"
      },
      {
        "at": 6,
        "title": "One game, different agreements"
      }
    ],
    "figures": [
      {
        "asset": "cyberpunk-catalog-promo",
        "label": "PlayStation Plus · July 2025",
        "alt": "PlayStation Plus promotional image featuring the Cyberpunk 2077 logo and key art alongside Game Catalog, Premium and Extra branding",
        "caption": "Cyberpunk 2077 in Sony’s July 2025 PlayStation Plus promotion. Catalog access covered the base game; the expansion remained a separate offer.",
        "credit": "Sony Interactive Entertainment / CD PROJEKT RED; other pictured games belong to their respective rights holders",
        "afterParagraph": 8
      }
    ],
    "sources": [
      "alcorn-oral",
      "steam-settlement",
      "circuit-game-pass",
      "steam-cloud",
      "gfn-membership-terms",
      "gfn-forza",
      "gfn-game-pass",
      "cyberpunk-ps-offer",
      "cyberpunk-xbox-offer",
      "cyberpunk-plus-entry",
      "cyberpunk-pass-entry",
      "cdpr-catalog-economics",
      "valve-about",
      "steam-hardware-survey",
      "gfn-requirements",
      "epic-publishing",
      "chain-cinema",
      "chain-netflix",
      "arcade-route",
      "sony-accounting",
      "chain-microsoft",
      "valve-history",
      "cdpr-business",
      "steam-visibility",
      "microsoft-ecosystem",
      "valve-deck-booklet"
    ],
    "evidence": "The opening describes possible purchase situations, not a particular player’s experience or a universal release sequence. The diagrams separate functions, not necessarily companies, and show selected arrangements and supported routes. Publisher funding, ownership and payment terms vary by agreement; Epic’s published offer is one example, not a standard contract. Store revenue sharing and the companies’ combined activities are documented; the different uses of a game for a publisher, store, hardware supplier or catalog are our economic reading, not measured effects on sales or creative decisions. Cloud delivery retains device, network, title, region and plan restrictions. The Steam purchase/GeForce NOW example does not describe all cloud services or require catalog membership. No private commission, internal transfer price or per-play publisher payment is inferred. Nowakowski’s quotation is the complete opening sentence of his answer to question 5 in CD PROJEKT’s Q3 2025 earnings transcript (PDF page 6). His judgment of the Sony deal and expansion opportunity is management’s assessment, not an independent estimate of displaced purchases or additional sales. The Sony agreement is not assigned to Microsoft or NVIDIA. Valve still makes games; its move into distribution is an expansion of roles.",
    "exhibits": [
      {
        "afterParagraph": 5,
        "kind": "market-map"
      }
    ]
  },
  {
    "id": "the-fork",
    "part": 0,
    "title": "The business of keeping a world alive",
    "lede": "Two adventures can occupy the same years of a player’s life while asking very different things of the people who make them.",
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
      "Baldur’s Gate 3 and Diablo IV arrived in 2023 carrying names that had belonged to role-playing games for decades. In an RPG, a character’s abilities and equipment develop as the player acts through them. Larian Studios builds BG3 around a party of companions, consequential conversations and battles fought in turns. Blizzard Entertainment’s Diablo IV puts one character under direct control, fighting monsters and searching for better equipment. Both sell an adventure; both give their owners reasons to begin it again.",
      "A long game is not necessarily a continuing sale. Another class, a different decision or a group of friends can make the same purchase worthwhile for years. Larian’s offer for BG3 includes no in-game purchases. The studio added substantial features after launch, then announced its final major content patch in April 2025. It could keep revising the game indefinitely, the announcement explained: “But then we’d never be able to create something new.” Finishing that work left players with possibilities still to explore.",
      "Diablo IV contains another shape of play alongside its campaign, the main story adventure. Seasons give players a shared starting point for fresh characters, alongside changing goals and rewards. The campaign moves through events toward a resolution; a season supplies a new occasion to develop a character and pursue a chosen ambition. These experiences coexist. A player can finish the story and join a season, return to an older character or leave satisfied. A fresh run is an invitation, not evidence that the previous adventure lacked replayability.",
      "The difference becomes clearer on the studio’s side of the screen. Before launch, Blizzard described a large team devoted to ongoing seasons, accompanied by optional cosmetic sales and paid reward tracks. “Diablo IV will be supported by an army of developers for years to come,” its 2022 update promised. The plan joined a purchased game to a continuing schedule of creative work and further offers. Playing another season and buying its paid rewards remained separate decisions.",
      "That is the fork. Where will the studio put its next years of work, and what will it next ask its audience to buy? A new game, an expansion and an ongoing program inside an existing world each require a different production commitment. They can also coexist within one company. Whatever the choice, wages arrive before the next release does. Earlier earnings, new customers and financing against future sales have to cover the gap. Affection for an old game can help a new offer find an audience; it cannot pay the team by itself.",
      "For the player, that affection has a different shape. It may belong to a story, an unfinished character or the friends who are available on Friday. Researchers studying online worlds have distinguished playing in a group from simply enjoying a populated place: other players can be company, an audience or a reassuring presence without becoming teammates. Maintaining such a world involves more than manufacturing rewards. It involves keeping different kinds of evenings possible.",
      "Diablo IV brings those expectations together. Someone returning to finish an adventure can meet a calendar organized around beginning again. For friends eager to try new characters together, that calendar can make the reunion easier. For someone attached to an older character, the same invitation can raise a question: where does my unfinished game belong? The tension is between the activity the studio is organizing and the experience a particular person came back for.",
      "A studio making those commitments needs more than a popular world. It needs agreements that turn the audience’s interest into money available for further work. Games share that problem with films, books and the services through which we encounter them. Looking across those arrangements will help us distinguish the success of a work from the business that can afford to keep making it."
    ],
    "sections": [
      {
        "at": 2,
        "title": "A campaign, a season, an unfinished character"
      },
      {
        "at": 4,
        "title": "What the studio makes next"
      }
    ],
    "paragraphCitations": {
      "0": [
        "bg3",
        "bg-lineage",
        "d4-expansion-structure"
      ],
      "1": [
        "bg3",
        "bg3-patch8"
      ],
      "2": [
        "d4-expansion-structure",
        "d4-season-philosophy"
      ],
      "3": [
        "d4-season-philosophy"
      ],
      "5": [
        "third-places",
        "alone-together"
      ]
    },
    "sources": [
      "bg3",
      "bg-lineage",
      "bg3-patch8",
      "d4-season-philosophy",
      "d4-expansion-structure",
      "third-places",
      "alone-together"
    ],
    "takeaway": "A world can remain valuable to its players after its makers move on. Continuing production makes a different promise—and requires a way to pay for it.",
    "evidence": "The comparison concerns production commitments and offers, not complete studio accounts or a claim that one model causes a particular experience. Larian’s April 2025 announcement ended major content updates, not all support. Blizzard’s August 2022 statement records its pre-launch plan, not current pass products or prices. Campaigns and seasonal play overlap; neither replayability nor sociability implies recurring payment. The returning-player examples are interpretive possibilities, not findings about the share of Diablo IV players who feel a particular way. The social research concerns other online games and is used to widen the questions, not to impute results to Diablo IV.",
    "exhibits": [
      {
        "afterParagraph": 2,
        "kind": "gathering-place"
      },
      {
        "afterParagraph": 4,
        "kind": "chapter-diagram"
      }
    ]
  },
  {
    "id": "concord",
    "part": 0,
    "title": "Concord: the future that did not arrive",
    "lede": "The equipment, the publisher and the production were in place. The launch did not secure the future planned around them.",
    "paragraphs": [
      "Concord reached PlayStation 5 and PC on 23 August 2024 with a clear offer. For a US standard-edition list price of $39.99, players received Firewalk Studios’ team shooting game and the promise of regular additions at no extra charge. Sony supplied the publishing support. The release was intended to open a continuing relationship: players would learn the world, gather there with others and return as it grew.",
      "Sony had announced a publishing partnership with Firewalk in 2021, then an agreement to acquire it in 2023. A company selling consoles, operating a store and running subscription services was bringing another developer inside the group. It had several ways to benefit from a successful game and the means to bring one to market. Concord shows why occupying those positions cannot, by itself, secure the result.",
      "The scarce thing was an evening people wanted to spend there. A new multiplayer release competes with games that already contain someone’s friends, practiced skills and familiar routines. Its price is only part of the invitation. Trying a new place may mean persuading a group to leave another one, then giving them reasons to stay. This is our reading of the business challenge, not a finding that identifies why any particular player declined Concord.",
      "On 3 September, Firewalk announced that sales would stop and the game would go offline on 6 September. Refunds followed. Two weeks separated the standard launch from the shutdown. The offer changed from access to a developing world into the return of the purchase price. The refund could reverse a transaction. It could not supply the future evenings that transaction had anticipated.",
      "Sony announced the permanent closure of the game and Firewalk on 29 October. It said Concord had missed its targets in a competitive market and described sustainable finances as essential to continuing experimentation. The same statement reaffirmed its pursuit of online experiences. A failed release did not settle the business model for the whole industry. It settled which team and which world would no longer receive further investment.",
      "The distinction matters when we look back from the result. A shutdown is evidence that the business failed to continue; it is not an experiment isolating price, promotion, release timing or the quality of particular mechanics. Public announcements do not provide a reliable production budget or a complete account of the decisions. Treating one visible weakness as the explanation can conceal the harder problem: several individually plausible commitments can depend on an audience that never becomes large or durable enough.",
      "Successful worlds make those commitments look natural in retrospect. We see the familiar characters and the years of additions, less often the earlier decision to employ a team before the audience existed. Diablo is one of the worlds that survived long enough to accumulate that history. Before inspecting its current economy, we need to understand what people first found there—and what the studio had to preserve or change as its audience, technology and business grew."
    ],
    "paragraphCitations": {
      "0": [
        "concord-offer",
        "concord"
      ],
      "1": [
        "concord-acquisition"
      ],
      "3": [
        "concord"
      ],
      "4": [
        "concord-closure"
      ]
    },
    "sections": [
      {
        "at": 2,
        "title": "A place in an evening"
      },
      {
        "at": 5,
        "title": "What the failure can tell us"
      }
    ],
    "figures": [
      {
        "asset": "concord-gameplay-reveal-2024",
        "alt": "Concord gameplay screenshot from the May 2024 PlayStation reveal",
        "caption": "Firewalk’s May 2024 gameplay reveal. It shows the announced game before launch; the closure timeline is sourced separately.",
        "credit": "Firewalk / Sony Interactive Entertainment · PlayStation Blog, 30 May 2024",
        "afterParagraph": 3
      },
      {
        "asset": "concord-shutdown-announcement-art",
        "alt": "Concord promotional artwork with a group of characters",
        "caption": "Artwork accompanying the shutdown notice. The launch had offered a continuing world; the notice offered refunds.",
        "credit": "Firewalk / PlayStation · September 2024",
        "afterParagraph": 3
      }
    ],
    "sources": [
      "concord-offer",
      "concord",
      "concord-acquisition",
      "concord-closure",
      "concord-reveal"
    ],
    "evidence": "Launch terms and the acquisition, withdrawal and closure dates come from contemporary Sony and Firewalk statements. Two weeks is the elapsed time from the standard launch to shutdown, excluding early access. The chapter makes no production-budget, sales-volume or profitability estimate. Audience switching costs and the counterfactual comparison with surviving franchises are analytical framing; they do not establish a cause of Concord’s failure. Management’s explanation is attributed rather than treated as an independent causal finding.",
    "takeaway": "A plan to keep making a world commits resources before it establishes a lasting place in people’s lives."
  },
  {
    "id": "several-histories",
    "part": 1,
    "title": "The cathedral and the computer",
    "lede": "Diablo made an old kind of adventure feel immediate. Its dungeon could keep surprising you, even after you knew where the story ended.",
    "paragraphs": [
      "Before Diablo was a franchise, it was a proposal for a game about going downstairs. Condor, the small California studio that became Blizzard North, imagined a town above a dungeon, one adventurer below it, and a confrontation with the devil at the bottom. The 1994 pitch already put replayability beside that destination. A story could have an ending while the machine kept making new routes through it.",
      "That possibility had a history. In Rogue, developed for university computers around 1980, letters and symbols represented an adventurer and the dungeon around them. Its creators wanted an adventure they could enjoy themselves without already knowing its puzzles. Glenn Wichman recalled their decision to let the program “build the dungeon.” The computer could arrange unfamiliar situations from familiar ingredients. A designer could make rules that produced surprises, rather than author every surprise separately.",
      "Diablo brought that tradition into an atmospheric world a player could reach through the mouse. A warrior, rogue or sorcerer descended beneath Tristram, a village overshadowed by its cathedral. Rooms, monsters and treasure varied between games; the route downward still led toward a recognizable confrontation. Darkness concealed what lay ahead. Finding better equipment changed what the character could attempt. The repeated actions belonged to a place, with a sound and an atmosphere worth remembering.",
      "The proposal had been turn-based: the player would act, then the creatures would respond. During development, that became real-time combat. The released game joined character growth and unpredictable discovery to the immediacy of moving, striking and retreating while enemies kept coming. Its achievement was the combination and the ease of entering it. The ingredients did not need to be unprecedented for the experience to feel new.",
      "The room around the player was changing too. Diablo arrived at the turn of 1996–97 with Battle.net, Blizzard’s integrated online service, which let owners meet and play together without a separate subscription. The computer supplied the images and action; the network helped supply the company. A purchased game could become a social occasion at home without returning to the arcade’s payment for each attempt. Hellfire, a 1997 expansion developed separately by Synergistic Software, also shows that the franchise was never the work of one unchanging team. It added areas and a class to an adventure people already owned.",
      "One page of the original proposal complicates any story of a commercially innocent past. Condor considered small expansion disks containing collectible additions, inspired by the card game Magic: The Gathering. They might sit beside shop registers at about $4.95 each. This was a proposal, not the business that the released Diablo actually delivered. But the desire to sell a player another contribution to an existing game was present before that game existed.",
      "The distinction matters. A design offers possibilities; a release chooses among them. Diablo’s lasting invention was a relationship between familiar actions, uncertain discoveries and a character becoming more capable. That relationship could support another expedition, another class, another evening with friends. The sequel would enlarge almost everything around it—and show how much work it could take to preserve the same pleasure."
    ],
    "sections": [
      {
        "at": 3,
        "title": "A different rhythm for the same ingredients"
      },
      {
        "at": 5,
        "title": "An older idea of the next sale"
      }
    ],
    "paragraphCitations": {
      "0": [
        "d1-pitch",
        "d2-postmortem"
      ],
      "1": [
        "rogue-wichman"
      ],
      "2": [
        "d1-return",
        "diablo-story"
      ],
      "3": [
        "d1-pitch",
        "d1-brevik"
      ],
      "4": [
        "d1-gog-release",
        "blizzard-bnet-history",
        "diablo-hellfire"
      ],
      "5": [
        "d1-pitch"
      ]
    },
    "sources": [
      "d1-pitch",
      "d2-postmortem",
      "rogue-wichman",
      "d1-return",
      "diablo-story",
      "d1-brevik",
      "d1-gog-release",
      "blizzard-bnet-history",
      "diablo-hellfire"
    ],
    "figures": [
      {
        "asset": "diablo-original-combat",
        "alt": "Diablo: a warrior inside a crowded stone dungeon, above the health and mana interface",
        "caption": "The original Diablo: danger, equipment and the character’s resources share one view. The cathedral’s changing rooms lead toward a fixed confrontation.",
        "credit": "Blizzard Entertainment · authorized GOG gallery",
        "afterParagraph": 2
      }
    ],
    "takeaway": "Returning to a game is not the same event as buying something from its creator.",
    "evidence": "The 1994 Condor proposal is evidence of intended design and contemplated marketing, not a description of the shipped game. Brevik’s retrospective establishes the turn-based-to-real-time development change. Wichman describes Rogue’s own procedural-design intent; this is an antecedent comparison rather than a claim that Diablo invented randomized dungeons or all action RPG conventions. Blizzard’s retrospective dates Diablo to 31 December 1996, while other Blizzard pages call it a 1997 release; the prose deliberately says the turn of 1996–97. Battle.net was free to users, not costless to operate."
  },
  {
    "id": "how-many-lives",
    "part": 2,
    "title": "How many lives does a coin buy?",
    "lede": "Long before a seasonal shop, a purchase could change the rules inside the adventure.",
    "paragraphs": [
      "Before looking inside Diablo IV’s offers, return to an older dungeon. Atari’s Gauntlet, released in 1985, let up to four people fight through mazes as fantasy adventurers. Their health diminished with time and injury. Food restored it; another coin did too. A player bought a resource in the imagined world, and that resource helped determine how long they could remain in it.",
      "Selling “air” was already a workable business. But the coin could also buy more time alongside the people at the next controls. Designer Ed Logg recalled resistance to charging more than a quarter for play. Having several people pay at once offered another way for the cabinet to earn, while letting them join and leave independently kept the gathering going. The commercial constraint helped give the game a distinctive social form.",
      "Atari also gave the operator instructions for adjusting the bargain. Under “Maximizing Earnings,” the manual recommended increasing the health allowance when US quarter play averaged less than 90 seconds. Above 180 seconds, it advised making the game harder first, increasing monster activity before cutting the visible amount of health. The amount at the coin slot could stay unchanged while the purchased reserve lasted for a different time.",
      "That is a small but consequential piece of analytics. Average playtime becomes a reading from the machine; the operator has settings that can change it. Yet the same average can contain quite different evenings: a skilled player advancing confidently, a beginner losing quickly, friends buying time to stay together. The measure makes an adjustment possible. It does not, by itself, tell the operator whether the experience became more satisfying or merely shorter.",
      "One decision reached beyond difficulty to the possibility of an ending. Logg said the team considered a final monster but rejected it because “we did not want players coins lost with a game over.” Levels instead recirculated. A player could arrive at the conclusion with purchased health still unused; the design avoided taking that remainder away. Repeated payment supported a continuing adventure, but the obligation to honor payment also helped prevent the adventure from ending.",
      "The relationships are more interesting than a verdict on whether the coin was good or bad. A player might welcome another dangerous room, resent a turn that ended too quickly or simply want to stay with friends. An operator needed the cabinet to earn its place. Those interests met in the health counter, but no one number represented all of them. Raising earnings and improving the evening could coincide; an analyst would still need to establish both.",
      "Modern games spread this negotiation across more systems. Some purchases open additional adventures. Others change an appearance or grant access to rewards that still have to be earned. We should not assign them Gauntlet’s function merely because all are paid. What the old cabinet supplies is the right starting question: what does this purchase actually change for the person playing—and what evidence would show whether that change makes the relationship worth continuing?"
    ],
    "paragraphCitations": {
      "0": [
        "gauntlet"
      ],
      "1": [
        "gauntlet-logg"
      ],
      "2": [
        "gauntlet"
      ],
      "4": [
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
        "afterParagraph": 1
      },
      {
        "asset": "gauntlet-flyer-back-1985",
        "label": "The offer to the operator · 1985",
        "presentation": "archive",
        "alt": "Reverse of the Gauntlet sales flyer showing people playing and headings Four quarters at once and More options, more profits",
        "caption": "“Four quarters at once!” is the manufacturer’s own heading. The same sheet promotes cooperation, joining a game in progress and adjustable health allowances. Social play and the earnings pitch arrive together.",
        "credit": "© Atari Games · International Arcade Museum",
        "afterParagraph": 1
      },
      {
        "asset": "gauntlet-options-manual-p3-4",
        "alt": "Gauntlet operator manual: difficulty and health per coin in the same settings table",
        "caption": "The operator’s controls, 1985. Health per coin ranges from 100 to 2,000; difficulty has a separate setting. Enlarge to inspect the original table.",
        "credit": "Atari Games · manual preserved by Stardust Arcade",
        "afterParagraph": 2
      }
    ],
    "evidence": "The manual describes operator controls and earnings advice; it is not a measured result showing how a particular setting affected revenue or satisfaction. Logg’s 2012 retrospective supplies the commercial design account and ending decision. The reading of average playtime is original analysis, not a reconstructed cabinet dataset. Health purchases in Gauntlet are distinguished from Diablo IV’s other paid goods; the historical comparison does not imply identical mechanics or claim Gauntlet invented paid play.",
    "sections": [
      {
        "at": 2,
        "title": "The operator gets a design control"
      },
      {
        "at": 4,
        "title": "A purchase can change the ending"
      }
    ],
    "takeaway": "A payment can alter a resource, a rhythm or the shape of an adventure. Its value has to be judged through the change it makes."
  },
  {
    "id": "shape-of-money",
    "part": 2,
    "title": "Paying for the years between releases",
    "lede": "A successful release buys a studio time. What it promises next determines how much work that time must support.",
    "paragraphs": [
      "An expansion has a beginning as a production project and an ending as something ready to sell. An operated game also has work that must happen next Tuesday. People need to connect, recover an account, find their friends and receive what they bought. Diablo IV combines these obligations: another adventure to make, a seasonal program to maintain and a service that must keep functioning while both are under construction.",
      "The costs do not all follow the same calendar. CD PROJEKT reported roughly PLN 275 million in direct production expenditure on Phantom Liberty, Cyberpunk 2077’s expansion, and another PLN 95 million for its own global launch campaign. The disclosure gives us two separate investments before considering what later sales return. Making additional creative work and persuading people to buy it each require financing.",
      "Operating costs bring a different rhythm. Riot’s engineering account of VALORANT, its team shooting game, describes services for parties, matchmaking, results and purchases. It notes that players join parties much more often than they buy things, so those services need different amounts of capacity. The busiest machinery in the business need not be its checkout. Much of the work keeps an evening possible without producing a sale at that moment.",
      "A long-lived game can pay for that work in several ways. New customers keep buying an older release; existing customers buy additions; platform agreements supply other income. A studio can also draw on reserves, investors or other products. Years of repeat play do not tell us which arrangement funded them. Nor does a studio’s need for another sale establish that every hour already purchased should become another transaction.",
      "An ongoing game also has several kinds of work competing for that income. Keeping accounts and connections reliable preserves access to what has already been sold. A new season gives existing players another project. An expansion makes additional work available for another purchase. Those demands belong in the same budget, but success looks different in each: a quiet, reliable service can be valuable without producing an announcement or a new item in the shop.",
      "This is the pressure behind the next offer: a business needs another source of income before its existing money runs out. The offer still needs a purpose for the person receiving it. A new place to explore, a character to imagine differently and a project to finish are not interchangeable reasons to spend. The useful next step is to examine exactly what additional work each purchase puts into the player’s hands."
    ],
    "takeaway": "Separate the work a sale pays for from the reason a player wants to buy it.",
    "sources": [
      "cyberpunk",
      "hist-valorant",
      "bg3-patch8",
      "d4-season-philosophy"
    ],
    "evidence": "The CD PROJEKT figures are direct expenditure disclosed in October 2023, in PLN, not total project profitability or the budget for repairing the base game. Riot documents its own 2020 service architecture. Larian and Blizzard provide dated production commitments. Funding alternatives are explanatory possibilities, not a reconstruction of either studio’s accounts.",
    "paragraphCitations": {
      "1": [
        "cyberpunk"
      ],
      "2": [
        "hist-valorant"
      ],
      "4": []
    },
    "figures": [
      {
        "asset": "legacy-d4-shop-grid",
        "alt": "Diablo IV cosmetic storefront with bundles and a refresh timer",
        "caption": "Diablo IV’s cosmetic shop. A historical offer within a game that also sells its base release and expansions.",
        "credit": "Blizzard",
        "afterParagraph": 3
      }
    ],
    "sections": [
      {
        "at": 2,
        "title": "The work between purchases"
      }
    ],
    "exhibits": [
      {
        "afterParagraph": 1,
        "kind": "funding"
      }
    ]
  },
  {
    "id": "six-games",
    "part": 2,
    "title": "What the next purchase adds",
    "lede": "Six role-playing games put different boundaries around the work they sell.",
    "paragraphs": [
      "A player who enjoyed an adventure may want another hundred hours in its world. That desire leaves the studio with a choice. It can make a sequel, extend the existing game, offer a new way to inhabit the same world or simply let the original keep finding new buyers. These six games help separate those decisions. They share an interest in characters and adventures; their products draw the next purchase around different things.",
      "Baldur’s Gate 3 puts many possible playthroughs inside one campaign purchase. A different party or decision can reveal material the player missed without requiring another sale. Elden Ring and Cyberpunk 2077 illustrate a further offer: their Shadow of the Erdtree and Phantom Liberty expansions add substantial adventures to a game the customer already owns. Replaying and expanding are different uses of that continuing interest.",
      "Packaging changes the boundary again. The Witcher 3’s 2022 Complete Edition collected its main adventure, two expansions and earlier additions into one purchase. A later customer could buy together what earlier customers had bought at different times. A collected edition of books works much the same way: the bundle tells us what is included at the checkout, not when each part was made.",
      "Additional work can also arrive without an additional charge. Sandfall Interactive’s December 2025 Thank You update added material to Clair Obscur: Expedition 33, its fantasy role-playing game. This matters to the comparison because neither an update nor continued play, by itself, proves a recurring-payment model. We need to inspect the offer rather than infer it from the fact that a game changes.",
      "Diablo IV puts several kinds of offer beside one another. Its expansion sells an addition to the adventure; its shop can sell an appearance; its historical Reliquary system sold premium access to collections whose rewards still had to be earned. An expansion asks whether someone wants the additional work. A reward catalog also asks whether they want a new project within the game they already play.",
      "The distinction reaches beyond price. A purchase can add possibilities now or create an intention that occupies future evenings. Before deciding whether either is good value, we need to know what survives when the player’s circumstances change. A finished campaign, an unfinished character and an expiring reward collection leave different things waiting for someone who comes back."
    ],
    "takeaway": "The contents of a purchase and the future it asks the player to plan are both part of its value.",
    "table": {
      "caption": "Selected product structures, with historical scope where specified. This is not a current price or complete DLC catalog.",
      "headers": [
        "Game",
        "Design emphasis",
        "Commercial example"
      ],
      "rows": [
        [
          "Baldur’s Gate 3",
          "Authored campaign and branching choices",
          "Base game; Larian states no microtransactions"
        ],
        [
          "Elden Ring",
          "Exploration, combat and build mastery",
          "Base game + Shadow of the Erdtree"
        ],
        [
          "Clair Obscur: Expedition 33",
          "Authored RPG campaign",
          "Premium game; no sales or budget estimate used here"
        ],
        [
          "The Witcher 3",
          "Authored quests in an open world",
          "2022 Complete Edition bundles two story expansions"
        ],
        [
          "Cyberpunk 2077",
          "Authored open-world RPG",
          "Phantom Liberty as a separately produced expansion"
        ],
        [
          "Diablo IV",
          "Campaign plus repeatable progression",
          "Base game, expansions, shop and seasonal catalogs"
        ]
      ]
    },
    "sources": [
      "bg3",
      "elden",
      "cyberpunk",
      "witcher",
      "expedition",
      "hist-expedition-update",
      "reliquary",
      "d4-expansion-structure"
    ],
    "evidence": "Selected official products illustrate distinct package boundaries, not a complete catalog, financial ranking or equivalence of their gameplay. The Witcher bundle and Expedition update are dated examples. Reliquaries refer to the April 2025 design. Conclusions about future commitments are the essay’s comparison.",
    "paragraphCitations": {
      "1": [
        "bg3",
        "elden",
        "cyberpunk"
      ],
      "2": [
        "witcher"
      ],
      "3": [
        "expedition",
        "hist-expedition-update"
      ],
      "4": [
        "reliquary",
        "d4-expansion-structure"
      ]
    },
    "figures": [
      {
        "asset": "legacy-d4-corridor",
        "alt": "Diablo IV character in the Hell-Touched Corridors",
        "caption": "Diablo IV, Hell-Touched Corridors. One encounter sits inside a game with several distinct kinds of paid addition.",
        "credit": "Blizzard",
        "afterParagraph": 3
      }
    ],
    "sections": []
  },
  {
    "id": "the-reset",
    "part": 2,
    "title": "What a new season keeps",
    "lede": "A fresh character begins with little. The person controlling it may bring years.",
    "paragraphs": [
      "A Diablo IV season invites players to begin new characters under a shared set of changes. The Eternal Realm holds characters outside that seasonal cycle; “realm” names the version of the game in which they can participate. Blizzard’s first-season explanation said characters would move to Eternal when the season ended. A restart therefore creates another beginning without simply erasing the earlier character.",
      "What has been preserved is more complicated than a save file. Equipment and levels belong to a character. Purchased access and some shared benefits belong to an account. Recognizing a dangerous attack belongs to the player. Friends may share a history that none of those records captures. When someone says they do not want to start again, any of these investments could be what they are trying to protect.",
      "Consider two people creating the same class. One has already learned which abilities work together; the other must discover what the descriptions mean. Their starting characters can be identical while their practical starting points remain far apart. Resetting recorded strength does not reset understanding. This is one reason a familiar climb can become a new experience without every encounter being newly produced.",
      "Blizzard’s 2023 account also presented seasonal mechanics as experiments that need not remain forever. That gives the studio room to alter a run without supporting every earlier addition indefinitely. The production advantage and the player’s investment meet at the boundary: what will transfer, what will disappear and what will still be useful? Those are material terms of the invitation to begin.",
      "A sports season offers a partial analogy. The standings restart, but the competitors retain what they learned. A game adds possessions and purchased access to the question, often with different transfer rules. Saying that progress is “kept” is insufficient if a character remains available but cannot join the activity friends have chosen, or if an appearance survives while the power associated with a season does not.",
      "The transfer diagram separates these kinds of continuity. Its important consequence is social as well as technical: preserving a character and preserving a reason to use it are different achievements. The player may want to continue an unfinished adventure, learn another class or join a shared restart. To judge the invitation, we first need to understand which of those evenings they hoped to have."
    ],
    "takeaway": "Preserving a saved character does not automatically preserve its place in a player’s plans.",
    "figures": [
      {
        "asset": "d4-seasonal-tooltip",
        "alt": "Diablo IV Seasonal Character tooltip states that the character becomes Eternal at the end of the season",
        "caption": "Diablo IV character selection, 1 October 2026. The tooltip says seasonal characters move to Eternal after the season.",
        "credit": "Blizzard",
        "afterParagraph": 3
      }
    ],
    "sources": [
      "hist-season-design",
      "season"
    ],
    "evidence": "The transfer and temporary-mechanics account is anchored to Blizzard’s 2023 seasonal explanation. It does not promise that every historical seasonal feature, item or benefit follows the same rules today. The two-player comparison and sports analogy are explanatory models; the owner-supplied tooltip provides a separate captured interface example.",
    "paragraphCitations": {
      "0": [
        "hist-season-design"
      ],
      "3": [
        "hist-season-design"
      ]
    },
    "sections": [
      {
        "at": 2,
        "title": "The part of progress outside the save file"
      }
    ]
  },
  {
    "id": "why-people-play",
    "part": 3,
    "title": "A reason to be here",
    "lede": "The activity log can record a completed dungeon. It cannot say what made that evening matter.",
    "paragraphs": [
      "Imagine three friends finishing a Diablo dungeon, an area of enemies and challenges. One finally reads a difficult attack correctly. Another mostly wanted an hour together. The third finds an item for a character they have been imagining all week. The group completed one activity, but its members valued different parts of it. A design that improves the evening for one could interfere with what another came to do.",
      "Game research gives us ways to ask about those differences. Ryan, Rigby and Przybylski’s 2006 studies applied self-determination theory: autonomy, competence and relatedness concern willing participation, effective action and connection with others. The studies linked perceived need satisfaction with enjoyment and future play. These are qualities people experience, so a count of menu choices, character levels or friends is not a direct measure of them.",
      "A menu with twenty activities may still leave our group unable to find one they want to share. A hard encounter may offer one person a welcome lesson and prevent another from accompanying a less experienced friend. The relevant question is how the available possibilities fit the people present. Difficulty and variety acquire their meaning within that occasion.",
      "Nick Yee’s survey of roughly 3,000 online role-playing-game players found overlapping motives involving achievement, social life and immersion. The overlap is useful: the person studying equipment statistics can also care about the fiction and the company. A marketing label such as “collector” can help organize a question, but becomes misleading when treated as a permanent description of everything that person wants.",
      "Repetition has the same ambiguity. Raph Koster’s account of his children learning the patterns of tic-tac-toe helps explain why a once-interesting problem can lose its pull. Yet our friends might deliberately choose familiar, undemanding play so they can talk. More novelty is not always the right response to a routine. We need to know whether the routine has become empty or is making room for something else.",
      "This changes how we assess a reward system. A deadline that sends friends into separate tasks may increase completed objectives while damaging the evening they arranged. A cosmetic might earn little use in combat and still make a character feel more personal. The purpose of the session supplies the missing context. Even a score, the most apparently unambiguous sign of success, needs to be read in the world that gives it meaning."
    ],
    "takeaway": "Ask what the player came to do before treating completed activities as evidence that the design succeeded.",
    "sources": [
      "sdt",
      "yee",
      "koster"
    ],
    "evidence": "The three friends are an invented scenario. SDT supplies a theory and empirical studies; Yee supplies a genre-specific motivation survey; Koster offers a design argument. These do not establish a universal player taxonomy or identify the motives of Diablo IV’s audience.",
    "paragraphCitations": {
      "1": [
        "sdt"
      ],
      "3": [
        "yee"
      ],
      "4": [
        "koster"
      ]
    },
    "figures": [
      {
        "asset": "legacy-social",
        "alt": "Diablo IV social interface",
        "caption": "Diablo IV’s social interface. An invitation begins the practical work of turning separate players into a shared evening.",
        "credit": "Blizzard",
        "afterParagraph": 3
      }
    ],
    "sections": []
  },
  {
    "id": "play-beyond-score",
    "part": 3,
    "title": "Do the points mean progress?",
    "lede": "INDIKA places familiar game arithmetic inside a story that gives us reasons to distrust it.",
    "paragraphs": [
      "In INDIKA, a story-driven game made by Odd Meter and published by 11 bit studios, the protagonist is a young nun accompanied by the devil. One supplied screenshot places a prompt to pray beside a precise numerical score. The setting is distressed, the imagery threatening, and the counter reassuringly familiar. We know how to read a number getting closer to a threshold before we know whether that threshold deserves our faith.",
      "That contrast supports a reading of the interface as part of the story’s argument. Prayer becomes an action performed through a control; the score offers an apparently orderly account of progress. The publisher describes a conflict between belief and harsh reality. Within that premise, numerical certainty looks suspicious. What could these points actually establish about the person earning them?",
      "The image alone cannot settle the game’s complete argument. It does let us inspect how action and accounting sit together. Watching a character pray and holding a button to make her pray assign the audience different roles. Adding a score recruits another familiar habit: pursuing the next increment. The player is asked to participate in a system that the surrounding fiction makes questionable.",
      "This is a useful interruption to the language of engagement. An authored work may be worthwhile because it disturbs a habit, complicates a belief or leaves an uncomfortable question. A difficult film need not make its audience immediately want another screening to have succeeded. A game can likewise earn admiration through an experience someone is glad to have completed.",
      "The point carries back to Diablo without making the two games interchangeable. A reward can be a useful tool, a sign of belonging, a personal ambition or a deliberate provocation. Its collection event does not tell us which role it played. Before adding another reward to keep a loop moving, we need to understand what the existing activity means—and how its rules produce that experience."
    ],
    "takeaway": "A score can be part of an artwork’s argument; increasing it need not be the player’s ultimate achievement.",
    "figures": [
      {
        "asset": "legacy-indika-pray",
        "alt": "INDIKA shows a Hold LT to pray prompt in a red-lit scene",
        "caption": "INDIKA pairs a prayer prompt with a score. The player performs the ritual through a held input.",
        "credit": "Odd Meter / 11 bit studios",
        "afterParagraph": 2
      },
      {
        "asset": "legacy-indika-points",
        "alt": "INDIKA shows a glowing reward symbol and a numerical score",
        "caption": "INDIKA’s numerical progression sits beside imagery of belief and doubt.",
        "credit": "Odd Meter / 11 bit studios",
        "afterParagraph": 2
      }
    ],
    "sources": [
      "sys-indika-product"
    ],
    "evidence": "This is a close reading of the two supplied screenshots in the context of the publisher’s premise. It does not claim an unseen ending, universal player response or verified causal effect of the counter. The interpretation is the author’s, not a quotation of the developer’s intent.",
    "paragraphCitations": {
      "0": [
        "sys-indika-product"
      ],
      "1": [
        "sys-indika-product"
      ]
    },
    "sections": []
  },
  {
    "id": "familiar-verbs",
    "part": 3,
    "title": "The same attack, a different decision",
    "lede": "A game can keep its familiar controls while changing what it asks a player to notice.",
    "paragraphs": [
      "Across Diablo generations, we still move a character into danger, attack and inspect what falls. That continuity can make a new game look deceptively close to an old one. The comparison needs more than a list of actions. Chess has kept a small vocabulary of moves for centuries; the position supplies the problem. In a combat game, space, enemies and resources can do similar work around a familiar button.",
      "Take the spare encounter in the diagram. On an open floor, the player can approach and retreat. Place a hazard behind them and the retreat becomes a commitment. Add cover between the figures and the direct attack needs another route. Nothing new has appeared on the controller. What changed is the information needed before pressing a button and the consequences afterward.",
      "This distinguishes another decision from another piece of content. A differently dressed enemy can demand exactly the same response. An old enemy in unfamiliar terrain can demand a new one. Neither result is automatically better: recognition can be pleasurable, and a comfortable encounter may be welcome. But counting enemies or abilities will not tell us how much the player’s actual problem has changed.",
      "Jesper Juul describes a related distinction between emergence, where rules generate situations, and progression through specifically arranged challenges. His analysis allows both within a game. An authored quest can guide a character into a situation whose outcome still depends on abilities, cooperation and improvisation. The question is what these structures enable together, rather than which single label belongs on the box.",
      "This gives us a more precise way to compare the old Diablo screenshot with the new one. What can the player anticipate? Which choices does their equipment open or close? What does a failed attempt teach? Familiar framing is evidence of a shared visual language; answering those questions requires observing encounters. The next layer follows what an encounter leaves behind, and why someone would choose to begin another."
    ],
    "takeaway": "Compare the decisions an action creates, rather than counting the buttons available to perform it.",
    "figures": [
      {
        "asset": "legacy-d2-combat",
        "alt": "Diablo II combat near the Cairn Stones with Rakanishu",
        "caption": "Diablo II, near the Cairn Stones and Rakanishu. Enemies and terrain give familiar attacks their immediate context.",
        "credit": "Blizzard",
        "afterParagraph": 2
      },
      {
        "asset": "legacy-d4-corridor",
        "alt": "Diablo IV character in the Hell-Touched Corridors with health and resource displays",
        "caption": "Diablo IV, Hell-Touched Corridors. The visual family resemblance leaves the encounter’s decisions to be compared through play.",
        "credit": "Blizzard",
        "afterParagraph": 2
      }
    ],
    "sources": [
      "juul"
    ],
    "evidence": "The tactical layouts are original teaching models. Juul provides the emergence/progression distinction; the historical screenshots establish visible resemblance, not identical systems or a causal effect of monetization on design.",
    "paragraphCitations": {
      "3": [
        "juul"
      ]
    },
    "sections": []
  },
  {
    "id": "anatomy-of-loop",
    "part": 3,
    "title": "What comes back through the loop",
    "lede": "Fight, find, improve, repeat. The appeal depends on what is different the next time around.",
    "paragraphs": [
      "“Fight monsters, collect equipment, become stronger” describes Diablo’s core loop: a sequence of actions and consequences that returns the player to another encounter. It is a useful sketch of the machinery, but a poor description of why someone loves it. The pleasure might be the impact of an attack, recognizing a valuable item or discovering a combination that transforms an awkward character. The same arrows can carry very different evenings.",
      "The MDA framework, developed by Robin Hunicke, Marc LeBlanc and Robert Zubek, separates mechanics, dynamics and aesthetics. Mechanics are the implemented rules; dynamics are what happens as people play with them; aesthetics concern the experience those interactions produce. The framework asks a designer to connect a numerical rule to a lived situation. Increasing damage is easy to specify. Understanding what that increase does to an encounter requires another step.",
      "Imagine a heavy attack with a long recovery. A player learns to wait for an opening before committing. A stronger weapon might let them take a calculated risk against two enemies. Make it powerful enough to end every fight immediately and the old decision disappears. The statistic went up in both cases; the opportunities created by the increase were different.",
      "An encounter can leave several things behind. Equipment changes the character’s capability. Failure can teach the player to recognize a warning. A ridiculous escape can become a story friends retell. Across a session, these consequences can support a larger project: assembling a build, the combination of abilities and equipment that makes a character work in a particular way. That project gives later encounters a purpose before they begin.",
      "A seasonal restart rearranges these relationships. An ordinary early weapon becomes useful again, and knowledge from the previous run can guide a different build. Blizzard’s first-season explanation explicitly connected fresh characters with trying classes and combinations. The production challenge is to make familiar actions produce worthwhile decisions again, without needing to replace every action or location.",
      "This is where tuning reaches beyond pacing. If a change doubles the number of runs needed for an item, it creates more encounters but does not establish their value. The extra runs may support experimentation, company or a settled routine. A useful assessment follows what changes during them. Random rewards make that question especially urgent, because the run that completes one person’s project may leave another still at the beginning."
    ],
    "takeaway": "A repetition can add capability, understanding or company. Count those consequences as well as the repetitions.",
    "sources": [
      "mda",
      "season"
    ],
    "evidence": "MDA is a design framework, not a demonstrated revenue model. The heavy-attack example and session timescales are original analytical constructions. The seasonal rationale is attributed to Blizzard’s 2023 explanation. No actual damage balance or causal claim about D4 retention is inferred.",
    "sections": [
      {
        "at": 3,
        "title": "From an encounter to a project"
      }
    ],
    "paragraphCitations": {
      "1": [
        "mda"
      ],
      "4": [
        "season"
      ]
    },
    "figures": [
      {
        "asset": "legacy-d4-corridor",
        "alt": "Diablo IV character in the Hell-Touched Corridors",
        "caption": "Diablo IV, Hell-Touched Corridors. The encounter connects immediate combat to a character’s longer development.",
        "credit": "Blizzard",
        "afterParagraph": 3
      }
    ]
  },
  {
    "id": "loot-table",
    "part": 3,
    "title": "The player who is still waiting",
    "lede": "An average reward rate can conceal a very long evening for the unlucky player.",
    "paragraphs": [
      "A desirable drop can make the previous fight feel different in retrospect. The player stops, reads the item and imagines what it might let their character do. A loot table governs which objects can appear and with what probabilities. Its output is therefore both a supply of equipment and a timetable for personal ambitions—one whose uncertainty falls differently on different players.",
      "Diablo IV’s 2024 Loot Reborn redesign addressed more than rarity. Blizzard described reducing the items and attributes players had to inspect while moving customization into Tempering and Masterworking, systems for modifying equipment. The intended change concerned where the interesting decision happened: recognizing an upgrade on the ground, then shaping it. More objects were not automatically more useful choices.",
      "Our calculator removes those decisions to isolate the wait. Give an imaginary item a fixed, independent 5% chance on each attempt. After twenty attempts, about 64.2% of players would have found at least one. More than a third would still be waiting. Twenty is the mean waiting time in this model; it is not a promise that the twentieth attempt delivers. Reaching a 90% chance takes 45 attempts—more than twice that average wait.",
      "The next roll still has a 5% chance, however long the earlier wait. A designer can see the expected number of items entering the economy while a particular player sees an unfinished project. Both are observing the same system accurately. The average becomes misleading when used to describe what a typical commitment guarantees.",
      "Different rules distribute that uncertainty differently. A guaranteed award after a set number of failures puts a ceiling on the wait. A material awarded every run preserves partial progress. A targeted source narrows the search; trade lets activity elsewhere contribute to the purchase. These options change which decisions remain available when the desired object fails to appear.",
      "The proper comparison also includes what each unsuccessful run contains. A good encounter with friends can be worthwhile without the target item. A run undertaken only to complete an overdue build has another cost. Before adjusting a drop rate, inspect the long tail of attempts and the alternatives along it. The number tells us how uneven the wait can become; players must tell us what that wait is doing to their evenings."
    ],
    "takeaway": "Inspect the unlucky route through the system, including what remains worthwhile before the item arrives.",
    "interactive": "probability",
    "sources": [
      "lit-loot-reborn"
    ],
    "evidence": "Loot Reborn is a dated 2024 design announcement, not a measured outcome. All displayed odds are hypothetical, fixed and independent: 1 − (1 − p)^n. At p=.05 and n=20 the result is about .6415; the geometric mean wait is 20. No D4 drop rates, paid-draw equivalence or psychological diagnosis is asserted. The smallest integer n with 1 − .95^n ≥ .9 is 45.",
    "sections": [
      {
        "at": 2,
        "title": "Twenty attempts is not a guarantee"
      }
    ],
    "paragraphCitations": {
      "1": [
        "lit-loot-reborn"
      ]
    },
    "figures": [
      {
        "asset": "legacy-d2-item",
        "alt": "Diablo II item tooltip",
        "caption": "A Diablo II item tooltip. The useful object is a combination of properties, not simply a rarity label.",
        "credit": "Blizzard",
        "afterParagraph": 3
      }
    ]
  },
  {
    "id": "the-checklist",
    "part": 3,
    "title": "When the game enters the calendar",
    "lede": "A reward track can give an evening direction. Its expiry date can give the rest of the week a deadline.",
    "paragraphs": [
      "An open world offers possibilities, but choosing among them takes effort. A checklist can turn “what shall we do?” into an achievable plan. A reward track places prizes along that plan, making progress easy to see. For someone learning a game or coordinating friends, this direction can be part of the service they value.",
      "An expiry date adds another rule. The choice is now between activities with different consequences for waiting. A side quest may remain available next week while a desired appearance will not. Even if the reward changes no combat statistic, the calendar can change tonight’s route. The system is allocating attention as well as distributing objects.",
      "Remove one week from the hypothetical schedule in the diagram. Keep the tasks and reward identical, then compare an expiring track with one that remains available. The difference appears after the interruption: how much time is left, what can still be finished and whether catching up displaces other plans. A total number of completed tasks cannot show those consequences on its own.",
      "Other games demonstrate that a season’s arrival and a pass’s expiry are separate design decisions. Halo Infinite’s May 2022 announcement said purchased premium passes would remain available and could be switched between. Returning to an older free pass required its premium entitlement. The distinction preserves an ongoing purchase without extending the same promise to every free reward.",
      "Ghost Ship Games proposed another arrangement for Deep Rock Galactic, its cooperative mining game. Its April 2024 season-selection account described returning to earlier reward tracks with retained progress, while people choosing different seasons could still play together. Some season-specific assignments were excluded. The useful idea is a library of projects that does not require friends to share the same unfinished one.",
      "Deadlines can still do useful work. A tournament needs a common occasion; a seasonal launch can help friends arrange a return. The question is what a particular clock contributes and who bears the cost of missing it. Evaluate a track after an interruption, not only along its intended schedule. A game made to last for years will repeatedly meet people whose lives have changed since last week."
    ],
    "takeaway": "An interruption is part of a long-term player relationship; test what the schedule permits afterward.",
    "figures": [
      {
        "asset": "legacy-season-rank",
        "alt": "Diablo IV Death Awakening season ranks interface with a time remaining indicator",
        "caption": "Diablo IV’s historical Death Awakening season screen places remaining time beside progression.",
        "credit": "Blizzard",
        "afterParagraph": 3
      },
      {
        "asset": "drg-season-selection-proposal-2024",
        "alt": "Deep Rock Galactic proposed season selection menu marked work in progress",
        "caption": "Deep Rock Galactic’s April 2024 season-selection proposal. The published mockup is marked work in progress.",
        "credit": "Ghost Ship Games · 2024 proposal",
        "afterParagraph": 3
      },
      {
        "asset": "halo-premium-pass-rewards-2022",
        "alt": "Halo Infinite Season 2 promotional reward lineup",
        "caption": "Halo Infinite’s 2022 premium reward lineup. Purchased passes remained available after the season; free access followed different rules.",
        "credit": "343 Industries / Xbox · 2022 promotional art",
        "afterParagraph": 3
      }
    ],
    "sources": [
      "halo",
      "drg"
    ],
    "evidence": "Halo’s rules are scoped to the May 2022 premium/free distinction. Deep Rock Galactic is described through its April 2024 developer proposal, including exceptions. The missed-week comparison is hypothetical and supplies no claim of measured pressure, retention or revenue.",
    "sections": [
      {
        "at": 3,
        "title": "A season need not erase the unfinished project"
      }
    ],
    "paragraphCitations": {
      "3": [
        "halo"
      ],
      "4": [
        "drg"
      ]
    }
  },
  {
    "id": "access",
    "part": 4,
    "title": "Buying the door",
    "lede": "A receipt can grant access to an adventure without making the character ready to enter it.",
    "paragraphs": [
      "Buying Shadow of the Erdtree, Elden Ring’s expansion, did not by itself open its entrance. Bandai Namco’s June 2024 guide required players to defeat two major enemies, Radahn and Mohg. Money granted access to the product; progress satisfied a condition inside the game. The distinction can be welcome to someone seeking a hard new challenge and surprising to someone expecting to join friends immediately.",
      "That is why “unlock” is an inadequate description of a purchase on its own. It may mean receiving an object now, obtaining permission to begin an adventure or becoming eligible to pursue rewards. Each can be a worthwhile offer. They leave the buyer with different things to do after payment.",
      "The two gates in the diagram separate ownership from readiness. Opening the first does not operate the second. This is familiar elsewhere: paying for an advanced course does not provide the preparation it requires. In a game, the necessary preparation may be a character, knowledge, earlier progress or companions. The purchase page needs to make those demands visible while there is still a choice about committing.",
      "A list of included maps describes production from the studio’s side. A prospective player also needs to picture the route from their current position to the first useful evening. Can they enter with the character they have? Is the new activity designed for the people they want to play with? What remains available if they postpone it? These details can matter more than the volume of additional content.",
      "Clear requirements need not weaken an enticing invitation. A difficult entrance may be part of the appeal. They make the invitation more specific: this is the adventure, this is what ownership supplies, and this is what the player still needs to bring. Once inside, another kind of purchase changes the character’s place in that world without opening a new destination at all."
    ],
    "takeaway": "Describe the route from payment to participation, including the conditions the purchase does not satisfy.",
    "figures": [
      {
        "asset": "d4-campaign-state",
        "alt": "Diablo IV campaign selection with an Endgame recommendation and locked expansion entries",
        "caption": "Diablo IV campaign selection, 1 October 2026. Locked entries reflect this account’s expansion access.",
        "credit": "Blizzard",
        "afterParagraph": 2
      }
    ],
    "sources": [
      "txn-erdtree-entry"
    ],
    "evidence": "The two Erdtree prerequisites are documented in a June 2024 publisher guide. The course analogy and decision questions are analysis. The D4 campaign-selection figure records the photographed account’s access state; it is not evidence that D4 uses the same boss gates.",
    "sections": [],
    "paragraphCitations": {
      "0": [
        "txn-erdtree-entry"
      ]
    }
  },
  {
    "id": "identity",
    "part": 4,
    "title": "A character worth inhabiting",
    "lede": "An appearance can leave combat unchanged while giving someone another reason to care about the character.",
    "paragraphs": [
      "Put the same character in plain iron and then in a crown that looks stolen from a cathedral. Keep every combat statistic identical. The two figures suggest different people, even if nobody but the player sees them. This is the value a cosmetic can offer: an appearance through which someone inhabits the fiction. Clothing, souvenirs and team shirts carry comparable meanings outside games.",
      "Vili Lehdonvirta’s exploratory study of virtual-goods businesses distinguishes practical utility, aesthetic pleasure and social attributes. These qualities can coexist in one object. The distinction improves on calling everything without a damage bonus “just cosmetic.” An item can be mechanically optional and still matter greatly to its owner’s pleasure or sense of belonging.",
      "Representation can also affect an interaction. In Yee and Bailenson’s 2007 experiments, people assigned different virtual appearances behaved differently in brief social encounters. These were laboratory studies, not evidence that buying a particular armor set changes a Diablo player’s personality. They give us a reason to study what an avatar, the figure representing a person, enables them to feel or do rather than treating it as inert decoration.",
      "A wardrobe’s design determines how much of that representation the player can author. A collector might want a complete set. Someone inhabiting a particular role might prefer to combine a worn coat with an elaborate helmet. Friends might choose a shared detail. Selling a fixed ensemble and offering pieces that mix well can involve equally elaborate art but allow different kinds of expression.",
      "The earned wardrobe belongs in the comparison. Progress through the world already teaches a player who their character could become; its visual rewards help make that development tangible. Paid additions can enlarge the possibilities, but the assessment should include the unpaid character too. Does playing already produce a convincing inhabitant of this world, and what does the purchase add to that experience?",
      "A sale records that the buyer accepted an offer. It does not explain whether they wanted personal authorship, recognition or a souvenir of a shared occasion. Understanding that value matters when deciding what to make next. It also helps separate selling a new appearance from selling relief from an inconvenient route to the equipment itself."
    ],
    "takeaway": "Mechanical optionality does not make an appearance emotionally trivial; inspect the expression it makes possible.",
    "figures": [
      {
        "asset": "legacy-d4-shop-grid",
        "alt": "Diablo IV shop with cosmetic bundles, a refresh countdown and an Ancient Hydra preview",
        "caption": "Diablo IV appearance bundles and a shop-refresh countdown. Historical offers and prices.",
        "credit": "Blizzard",
        "afterParagraph": 3
      }
    ],
    "sources": [
      "goods",
      "txn-proteus"
    ],
    "evidence": "The crown and wardrobe scenarios are invented. Lehdonvirta’s study is exploratory; the Proteus studies involve assigned appearances in brief virtual interactions. Neither estimates D4 cosmetic demand or effects of purchasing. The earned/paid wardrobe comparison is a proposed design assessment.",
    "sections": [],
    "paragraphCitations": {
      "1": [
        "goods"
      ],
      "2": [
        "txn-proteus"
      ]
    }
  },
  {
    "id": "time",
    "part": 4,
    "title": "Buying a different route",
    "lede": "The item at the end can be identical while the purchase changes the evening required to reach it.",
    "paragraphs": [
      "Warframe, Digital Extremes’ science-fiction action game, offers equipment through several routes. Its Foundry lets players build from blueprints and collected resources; its market also sells finished equipment for Platinum, a purchasable currency. For someone planning an expedition to assemble an item, acquiring the parts is the project. For someone hoping to use that item with friends tonight, the same unfinished work can stand in the way.",
      "Calling the purchase a shortcut leaves the interesting question unanswered: what is being skipped? Searching for a material might reveal a new location, teach an encounter or simply repeat a task whose decisions are settled. Crafting can involve knowledge, inventory limits and waiting as well as active play. A number of saved hours cannot tell us whether the removed activity was the game’s pleasure or an obstacle around it.",
      "Trade adds another route. Warframe allows eligible goods to be exchanged for purchased Platinum. The person eventually spending that currency need not be the person who paid money for it. Valuable finds can become purchasing capacity, but earning that capacity involves its own work: recognizing demand, finding another player and agreeing an exchange. The game contains a market as well as missions.",
      "Convenience can operate on that market too. Path of Exile, Grinding Gear Games’ action role-playing game, sells premium stash tabs: pages of item storage that can also be made public for sale listings. A developer support explanation describes setting prices for individual items or the tab’s contents. The purchase changes how someone organizes and offers their inventory; it does not establish that every form of trading requires a paid tab.",
      "These cases expose a difficult production choice. Removing repetitive sorting may preserve more time for experimenting with equipment. Removing the whole acquisition journey may remove the project that made the equipment desirable. A convenience feature should be judged against the specific friction it changes, with the experience of people who do not buy it still in view.",
      "Once two routes are offered, they become part of one design. Players compare them, and the attractive route teaches them where to direct effort next. A market can be so effective at supplying equipment that it begins competing with the monsters for that role. Diablo III made this conflict unusually explicit."
    ],
    "takeaway": "Assess the activity removed by a convenience purchase, and the route left for people who do not take it.",
    "sources": [
      "warframe",
      "sys-warframe-trade",
      "poe"
    ],
    "evidence": "Official Warframe sources establish crafting, direct purchase and eligible currency trading, with transaction restrictions. The Path of Exile example is a dated developer support explanation of public premium stash tabs. No current prices, matched acquisition times or necessary purchase for every trade are asserted.",
    "paragraphCitations": {
      "0": [
        "warframe"
      ],
      "2": [
        "sys-warframe-trade"
      ],
      "3": [
        "poe"
      ]
    },
    "figures": [
      {
        "asset": "legacy-poe-store",
        "alt": "Path of Exile store showing purchasable offerings",
        "caption": "Path of Exile’s store. Its paid conveniences operate alongside the game’s equipment and trading systems.",
        "credit": "Grinding Gear Games",
        "afterParagraph": 3
      }
    ],
    "sections": []
  },
  {
    "id": "power",
    "part": 4,
    "title": "When the market replaces the hunt",
    "lede": "An efficient way to acquire equipment can compete with the activity that made the equipment desirable.",
    "paragraphs": [
      "The Diablo III auction-house episode now has a place in the series’ history. It also gives us a concrete design problem to examine. Imagine wanting a stronger weapon and discovering that searching listings is the most promising next step. The market has solved acquisition. It may have done so by moving attention away from the encounters that were supposed to supply the upgrade.",
      "Blizzard’s September 2013 removal announcement described this conflict in those terms: the auction houses had been intended to make trading convenient and secure, but were undermining the core loot experience. It scheduled both its real-money and gold houses for removal in March 2014. Including the gold market is essential to the analysis. Payment by cash was not the only way an acquisition system could compete with finding loot.",
      "The two routes in the diagram end with an improved character but reward different judgments along the way. A player searching a dungeon studies enemies, build choices and reward sources. A player searching a market studies prices and available supply. Trading can be an absorbing game of its own. The designer needs to decide how that activity relates to the one the product originally invited its audience to enjoy.",
      "Grinding Gear Games expressed a related concern in its 2017 Path of Exile Trade Manifesto. The studio valued exchange while arguing that very easy trade could reduce the sequence of incremental upgrades: a player could move quickly toward the desired final item. This is a developer’s design argument, not a controlled experiment. Its useful distinction is between the value of possessing equipment and the value of gradually becoming the character who uses it.",
      "Stronger equipment also has consequences beyond its owner. It may let friends attempt another challenge, trivialize an encounter or alter competitive standing. “Power” needs that context. Compare the same situation before and after acquisition: which constraints disappeared, what decisions remain and who else experiences the change?",
      "A transaction can work flawlessly and still weaken a larger design. The item arrives, the character improves, and a formerly meaningful activity becomes unnecessary. Evaluating monetization therefore extends past the receipt to the player’s next ambition. The next question is how clearly the receipt itself describes what was paid."
    ],
    "takeaway": "An acquisition system changes what players learn to pursue, even when the resulting item stays the same.",
    "sources": [
      "auction",
      "txn-trade-manifesto"
    ],
    "evidence": "Blizzard and Grinding Gear Games supply historical design diagnoses, not controlled causal results. The imagined acquisition routes explain their relevance. No deliberate loot manipulation, universal harm from trading or claim that D4 sells the same power is made.",
    "sections": [
      {
        "at": 2,
        "title": "What the efficient player does next"
      }
    ],
    "paragraphCitations": {
      "1": [
        "auction"
      ],
      "3": [
        "txn-trade-manifesto"
      ]
    },
    "figures": [
      {
        "asset": "diablo-three-items",
        "alt": "Diablo III rare and legendary boots shown in equipment comparison panels",
        "caption": "Diablo III equipment comparison, reproduced from Blizzard’s 2016 retrospective. The stats describe the object; finding it and buying it can produce different experiences.",
        "credit": "Blizzard Entertainment · Nevalistis, 2016",
        "afterParagraph": 2
      }
    ]
  },
  {
    "id": "what-things-cost",
    "part": 5,
    "title": "The price on the screen",
    "lede": "A token price and the money needed at checkout can be different numbers.",
    "paragraphs": [
      "Diablo IV’s Platinum is a purchased virtual currency: money buys a balance, and that balance can buy eligible items in the game. A supplied Canadian store capture offers 1,000 Platinum for CAD 13.49. Suppose a player with no balance wants an imaginary item priced at 900 Platinum. That pack requires CAD 13.49 now and leaves 100 Platinum afterward. The item price describes the deduction; the pack price describes the immediate cash commitment.",
      "Multiplying 900 by the pack’s exchange rate gives an allocated cost of CAD 12.14, rounded to cents. That is a useful accounting number, but it is not an amount the player can pay by itself in this example. Calling the item CAD 13.49 is incomplete in another way: some of that purchase remains in the account. The two quantities belong together, without pretending they answer the same question.",
      "The calculator deliberately keeps one pack, one item and a zero starting balance. Larger packs may offer more currency per dollar while requiring more dollars today. Whether that is a better purchase depends on what the player actually intends to use. A favorable unit rate does not establish that the extra balance is useful to its buyer.",
      "Payment research suggests why the representation deserves attention. Raghubir and Srivastava’s 2008 experiments found differences in spending across payment forms under their tested conditions, including cash and stored-value instruments. Making the cash sacrifice more salient could reduce some differences. The study does not tell us how much Platinum changes Diablo spending; it identifies a question that can be tested in the game’s own purchasing path.",
      "A remaining balance also becomes part of the next offer. The player may welcome it toward something already wanted, or begin browsing for a way to use it. We cannot tell which from the balance alone. An interface can at least make the decision inspectable: cash required now, existing currency used and currency remaining afterward.",
      "The arcade token and the virtual coin both place another unit between money and an experience. Each system still has its own terms. Understanding a Platinum purchase is only the first step when that currency buys access to a reward catalog rather than the reward itself."
    ],
    "takeaway": "Show the cash required and the balance left behind; a per-token rate is only one part of the purchase.",
    "interactive": "price",
    "figures": [
      {
        "asset": "legacy-d4-platinum",
        "alt": "Diablo IV Platinum packs with cash prices from the owner’s Canadian-dollar store",
        "caption": "Historical Diablo IV Platinum packs, priced in Canadian dollars.",
        "credit": "Blizzard",
        "afterParagraph": 3
      }
    ],
    "sources": [
      "txn-payment-form"
    ],
    "evidence": "The CAD pack price is from an owner-supplied historical capture with unknown date, not a current quote. The item is hypothetical. The model has zero starting balance, one selected pack, no tax and no optimization across pack combinations. Payment-form research supplies no D4-specific effect size.",
    "paragraphCitations": {
      "3": [
        "txn-payment-form"
      ]
    },
    "sections": []
  },
  {
    "id": "two-key-lock",
    "part": 5,
    "title": "Pay to begin earning",
    "lede": "One purchase opens a collection. Playing supplies another currency used to claim its contents.",
    "paragraphs": [
      "Diablo IV’s April 2025 Reliquary design combined two transactions. Platinum opened premium reward catalogs. Favor, earned through play, claimed their contents. Paying for access therefore left work to do before the player possessed every desired appearance. The product was an opportunity to pursue rewards as well as a collection of art.",
      "Favor also had a held-balance limit of 99, with up to 99 transferable to future seasons. Spending created room to earn again. That is a capacity limit, not a ceiling on everything a player could earn across a season. Confusing the two produces a mistaken picture of both the required effort and the amount of reward passing through the system.",
      "The reservoir makes the arithmetic visible. In our invented example, earn 99, spend 30 and earn another 25. The balance moves from 99 to 69 to 94; total earnings reach 124. Nothing exceeded the capacity of 99 at one moment. A screenshot of the final balance would conceal part of the activity that produced it.",
      "The historical catalogs allowed flexible claim order, attached some bonuses to completing a collection and limited the period in which rewards were available. A player interested in one object and someone seeking the full set therefore faced different projects. The most attractive object on the screen might carry requirements beyond its own displayed token cost.",
      "The purchase changes the significance of future play. An activity the player already enjoys can now advance an additional project, which may make the offer appealing. An interrupted schedule can leave a paid opportunity unused. Neither outcome follows automatically from the design. What matters is whether the proposed commitment matches the player’s intention and remains understandable after payment.",
      "Start the evaluation with the reward someone actually wants. Work backward through access, earning, claim conditions and time remaining. This is the complete offer they are deciding about. Its several parts can be reasonable individually while difficult to hold together when spread across different screens."
    ],
    "takeaway": "A premium catalog sells eligibility; evaluate the remaining play commitment as part of the same offer.",
    "figures": [
      {
        "asset": "legacy-favor-tutorial",
        "alt": "Favor Tokens tutorial explains that players can hold 99 tokens, spend them and earn more",
        "caption": "The Favor tutorial explains a held-balance limit of 99. Spending makes room to earn again.",
        "credit": "Blizzard",
        "afterParagraph": 3
      }
    ],
    "sources": [
      "reliquary"
    ],
    "evidence": "Historical April 2025 Reliquary rules, not a current-season guide. The 99→69→94 example invents the spending and earning amounts and makes no claim about earning speed. References to value, intention and interruption are analytical questions, not measured D4 player outcomes.",
    "sections": [
      {
        "at": 1,
        "title": "A balance is not the amount that passed through it"
      }
    ],
    "paragraphCitations": {
      "0": [
        "reliquary"
      ],
      "1": [
        "reliquary"
      ],
      "3": [
        "reliquary"
      ]
    }
  },
  {
    "id": "abstraction-and-surface",
    "part": 5,
    "title": "A purchase you can explain",
    "lede": "The art can make an offer irresistible. The interface still has to make its terms understandable.",
    "paragraphs": [
      "Picture the complete path to an appearance: one screen presents the armor, another sells currency, a third opens the catalog and a fourth explains how to claim the item. Every screen can be readable while the whole purchase remains difficult to describe. The buyer has to reconstruct the relationship among them from memory.",
      "Theatrical shorthand makes this harder. “Unlock” can announce an item received, access purchased or a requirement satisfied. A glowing token can represent money already spent or effort still needed. Games need abstractions to make an invented world feel natural. At the point of purchase, those abstractions also need an ordinary explanation of what the person is agreeing to do.",
      "In a 2003 study, Christopher Hsee and colleagues examined choices in which intermediate points stood between effort and a final reward. One questionnaire example involved tasks leading to different ice-cream flavors. Adding points changed choices even though the points had no separate use. The setting is distant from Diablo, but the question travels well: are people evaluating the outcome they want, or a more prominent number on the way to it?",
      "The offer in the diagram can be inspected with its terms scattered or gathered. Its price and rewards do not change. What changes is the work of understanding them together. A useful test would ask someone to obtain a particular appearance within a budget, then explain what payment supplies, what remains to be earned and what happens if they stop.",
      "Appearance alone cannot establish the effect. Luguri and Strahilevitz’s service-enrollment experiments found that some obstructive or misleading presentations changed choices, while their scarcity countdown did not significantly raise purchases. The lesson is to investigate the actual decision path. A timer is a feature to examine, not a result already measured in every setting.",
      "Conversion, the proportion who complete a purchase, is one outcome of that test. Correct understanding is another. A faster checkout accompanied by mistaken expectations can look successful until customers try to use what they bought. The work of evaluation begins before payment, but it has to continue after the interface has handed the person back to the game."
    ],
    "takeaway": "Measure whether the buyer can explain the commitment, as well as whether they can complete checkout.",
    "sources": [
      "txn-medium",
      "txn-dark-patterns"
    ],
    "evidence": "The purchase path and proposed comprehension task are original analytical examples. The medium-maximization pilot used questionnaire choices, not observed completion of the described tasks. Service-enrollment findings are not D4 findings or a legal diagnosis. No game-specific effect size is inferred.",
    "sections": [
      {
        "at": 3,
        "title": "Put the whole offer within reach"
      }
    ],
    "paragraphCitations": {
      "2": [
        "txn-medium"
      ],
      "4": [
        "txn-dark-patterns"
      ]
    },
    "figures": [
      {
        "asset": "legacy-d4-confirm",
        "alt": "Diablo IV purchase confirmation interface",
        "caption": "This Diablo IV confirmation marks the appearance FREE, names a weapon-type restriction and displays the remaining Platinum balance.",
        "credit": "Blizzard",
        "afterParagraph": 3
      }
    ]
  },
  {
    "id": "what-decides",
    "part": 6,
    "title": "What the instrument missed",
    "lede": "Outer Wilds offers a small lesson in why activity can look healthy while the intended experience is failing.",
    "paragraphs": [
      "The signalscope in Outer Wilds, Mobius Digital’s space-exploration game, is meant to turn a distant sound into a question worth pursuing. During development, players sometimes pointed it at a nearby rock and believed the sound came from that rock. It could actually be coming from the other side of the planet. The instrument was receiving a signal. The player was receiving the wrong idea.",
      "Mobius’s 2016 account describes adding distance information, clearer aiming feedback and separated frequencies. These revisions helped connect an audible clue with its location. The problem had required the team to understand what players thought the tool was telling them, not merely whether they used it.",
      "Imagine a dashboard that counted how often the signalscope opened. Confusion might increase that number: the player checks repeatedly because the result makes no sense. Understanding might reduce it: the player identifies a destination and puts the instrument away. Either movement in the metric could accompany improvement, depending on what was happening in the experience.",
      "The same mistake is possible in an economy. Repeatedly visiting a catalog might mean anticipation, comparison or uncertainty about whether its contents are owned. A longer session might include a satisfying challenge or an avoidable struggle to join friends. The event record becomes evidence of success only after the intended experience has been defined and the competing explanations investigated.",
      "Mobius described another revision to the clues along paths, so players could choose a direction for a reason instead of guessing at a fork. Together, these accounts show how a design promise becomes testable: identify the intended decision, observe what obstructs it, then change a part of the game that could remove that obstacle.",
      "This discipline matters most while a consequential choice can still change. A polished prototype cannot answer every question about years of play, but it can reveal whether people understand an encounter or an offer. A large usage dataset cannot replace that observation; it can show how widely a problem occurs once we know what to look for. To assess Diablo IV’s systems, we need both the close account of an evening and a sound way to compare many of them."
    ],
    "takeaway": "Define the intended experience before deciding which change in a usage metric counts as improvement.",
    "sources": [
      "outer",
      "lit-outer-pathing"
    ],
    "evidence": "The signalscope and path-clue revisions are documented 2016 development accounts. The hypothetical usage metric and reward-catalog examples are original explanations of measurement ambiguity. No actual D4 telemetry or Outer Wilds A/B-test result is claimed.",
    "paragraphCitations": {
      "0": [
        "outer"
      ],
      "1": [
        "outer"
      ],
      "4": [
        "lit-outer-pathing"
      ]
    },
    "figures": [
      {
        "asset": "outer-wilds-signalscope-prototype",
        "alt": "Outer Wilds early signalscope facing Riebeck",
        "caption": "Outer Wilds signalscope during development, 2016. Mobius added distance information to distinguish a nearby object from a signal beyond it.",
        "credit": "Mobius Digital · 2016 design article",
        "afterParagraph": 3
      }
    ],
    "sections": []
  },
  {
    "id": "does-it-work",
    "part": 6,
    "title": "An evening worth sustaining",
    "lede": "The business needs another sale. Its audience needs a reason to welcome the next invitation.",
    "paragraphs": [
      "Consider the returning player in the supplied Diablo IV captures: an unfinished level-eight Barbarian, a close-combat character, and a menu offering new seasonal beginnings. The character survives outside the seasonal cycle in Eternal. The immediate question is modest: how does someone resume the evening they intended to have? Before deciding which route keeps them longer, we need to know whether the available routes make sense to them.",
      "One return cannot represent an audience. It can identify a useful test. Ask people arriving after a break what they want to do, observe the route they choose and check what they believe will happen to their existing progress. Then inspect wrong turns, failed attempts to join friends and whether the session they planned becomes possible. These observations connect the interface to an actual purpose.",
      "Population research gives another reason to keep purpose beside duration. Ballou and colleagues’ 2025 study combined Nintendo play records with surveys from 703 casually engaged US adults. Hours played did not show a clear relationship with well-being in their estimates; the uncertainty also prevented a confident claim that no relationship existed. Players’ assessments of how gaming fitted into their lives were associated with well-being. It is an observational result about a particular population, not a recipe for improving everyone’s life by changing a game.",
      "A studio still needs business evidence. Revenue pays for work; refunds, support and service costs affect what remains to fund it. Retention measures whether a defined group returns within a specified period. Neither quantity tells us, alone, whether the return was satisfying. A sensible evaluation puts commercial outcomes beside comprehension, enjoyment and operational reliability, and makes disagreements visible.",
      "Controlled experiments can help estimate whether a particular change caused a difference in those measured outcomes. They need appropriate random assignment, reliable measurement and a comparison that survives scrutiny. Microsoft’s research on long-running tests shows why duration alone is insufficient: selection, survivorship and changing populations can distort the apparent effect. A test also cannot choose the values of the team conducting it. A measured increase still needs a reason to count as improvement.",
      "For the returning-player screen, define the intended improvement before launch: people can find a suitable activity, understand what persists and begin the session they wanted. Follow short-term comprehension and errors, then later return, regret and spending, with costs alongside them. If money rises while understanding falls, the disagreement is part of the result. It should not disappear inside a single success score.",
      "Pong’s coin container answered one early question: people would pay for another turn. The rest of this study has followed what grew around that answer—studios, stores, machines, worlds and increasingly elaborate offers within them. Their success makes creative work possible. It also depends on experiences whose value is larger than a transaction: a lesson learned, a story finished, a character made one’s own or an evening shared. Keeping a world alive means finding an arrangement that can continue paying for those possibilities while giving people reasons to keep wanting them."
    ],
    "takeaway": "A sustainable offer needs both a viable business and an experience people remain glad to have chosen.",
    "figures": [
      {
        "asset": "legacy-d4-char-select",
        "alt": "Diablo IV Season Info popup over the owner’s character selection screen",
        "caption": "Diablo IV’s character selection introduces the seasonal route beside an existing character.",
        "credit": "Blizzard",
        "afterParagraph": 3
      }
    ],
    "sources": [
      "lit-life-fit",
      "lit-experimentation",
      "experiment"
    ],
    "evidence": "The returning character is an owner-supplied observation, not a representative sample or verified onboarding defect. The proposed evaluation is hypothetical. Ballou et al. is observational, population-specific and inconclusive on equivalence; it supports no causal design benefit. Experimental-method references establish conditions for inference, not results from D4. No private profit or player-outcome data is available.",
    "sections": [
      {
        "at": 3,
        "title": "What would count as an improvement?"
      }
    ],
    "paragraphCitations": {
      "2": [
        "lit-life-fit"
      ],
      "4": [
        "lit-experimentation",
        "experiment"
      ]
    }
  }
];

// Stable IDs survive editorial reordering; overview chapters use only explicitly placed figures.
const openingOrder = ["insert-coin", "studio-to-screen", "valve-platform", "epic-infrastructure", "rockstar-world", "the-fork", "platform-business", "cloud-gaming", "making-worlds", "concord", "several-histories", "diablo-second-life", "diablo-market", "diablo-service", "how-many-lives", "shape-of-money", "six-games", "the-reset", "why-people-play", "play-beyond-score", "familiar-verbs", "anatomy-of-loop", "loot-table", "the-checklist", "access", "identity", "time", "power", "what-things-cost", "two-key-lock", "abstraction-and-surface", "what-decides", "does-it-work"];
const allChapters = [...diabloHistoryChapters, ...manuscript, ...businessOverviewChapters, ...companyChapters, worldBuildingChapter];
const orderedChapters = [...openingOrder.map(id=>allChapters.find(chapter=>chapter.id===id)!), ...allChapters.filter(chapter=>!openingOrder.includes(chapter.id))];
export const chapters: Chapter[] = orderedChapters.map((chapter) => {
  const visual = chapterVisuals[chapter.id];
  return {
    ...chapter,
    part: chapter.part,
    visual,
    figures: ["studio-to-screen","platform-business"].includes(chapter.id) ? chapter.figures ?? [] : [
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
