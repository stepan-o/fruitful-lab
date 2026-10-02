import type { Chapter, EvidenceSource } from "./types";
import { chapterVisuals } from "./visual-content";

export const parts = [
  "The fork",
  "Why the industry built it",
  "Why people play",
  "The machine",
  "Four goods",
  "The purchase path",
  "What the instrument cannot read",
];
export const revision = "2026-10-01";
export const sources: EvidenceSource[] = [
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
    note: "Original operator documentation, hosted by a public archive. Printed pages 2-3 and 3-4 discuss earnings and health-per-coin settings.",
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
    id: "the-fork",
    part: 0,
    title: "The fork",
    lede: "Before the shop asks for money, the game has already asked you to care.",
    paragraphs: [
      "Imagine coming back to a game after a long absence. You have one free evening, an old character and a friend waiting in the new season. The character is still there. So are the boots you spent a weekend finding. Yet the route your friend is taking begins somewhere else. Before you fight a monster, you have a small administrative problem: which part of your previous life in this world counts tonight?",
      "Diablo IV makes that situation concrete. Its documented Seasonal-to-Eternal transfer keeps a character available after a season ends, while seasonal participation establishes another beginning. Preservation and continuity turn out to be different promises. A possession can survive while the activity, company or occasion that made it valuable moves on. That distinction will matter again when we reach reward tracks, catalog unlocks and currencies.",
      "This is where I want to begin the economics: with what a person carries out of play. Sometimes it is an object in a save file. Sometimes it is a practiced movement, an understanding, a story to tell or another person who now expects you on Thursday. These things are unevenly visible to the game. A database can preserve a sword rather more easily than it can preserve the evening that made you fond of it.",
      "A commercial design enters this relationship by choosing when to ask for another commitment. Buying a campaign asks for trust before much of it is known. Renewing access asks whether another period is worthwhile. An item shop can wait until the player has a character to dress. Rewarded advertising offers another exchange: the player spends a little attention, and an advertiser supplies some of the money. The timing changes what the offer can mean.",
      "Crossy Road is a useful early complication. In their 2015 talk, its creators described optional video rewards and character purchases alongside choices to omit an energy system, paid currency packs and a paid rescue button. The familiar label “free to play” did not specify the whole design. Someone still had to decide which interruptions, advantages and dependencies belonged in this particular game.",
      "The question running through this deck is therefore practical: what does the next transaction ask the player to put at stake, and what does the world give back? We will follow access, identity, time and power through concrete interfaces. We will also look for commitments that never appear on the receipt: starting over, learning a new economy, arriving before a deadline or keeping pace with a group.",
      "To see those choices clearly, we need worlds with different ambitions beside one another. A game that lets us leave satisfied, a game that offers another chapter and a game that wants to become part of the week can each make a credible promise. The interesting work starts when we examine how that promise is kept.",
    ],
    takeaway:
      "Follow what the player carries away, then examine the next commitment the game asks for.",
    panel: {
      title: "Three exchanges",
      items: [
        { label: "Purchase", text: "Money → access to an experience" },
        {
          label: "Ongoing service",
          text: "Repeated payment or purchases → continued value",
        },
        { label: "Advertising", text: "Attention → advertiser-funded play" },
      ],
    },
    figures: [
      {
        asset: "legacy-d4-key",
        alt: "Diablo IV promotional artwork showing Lilith against a red background",
        caption:
          "Diablo IV is the central case, with other games used to test individual mechanisms.",
        credit: "Blizzard · promotional art from the handoff",
      },
    ],
    sources: ["hist-season-design", "crossy"],
    evidence:
      "The opening return-to-play situation is hypothetical. The seasonal transfer and Crossy Road examples are dated developer descriptions. The framework connecting them is this essay’s analysis.",
    paragraphCitations: {
      "1": ["hist-season-design"],
      "4": ["crossy"],
    },
  },
  {
    id: "six-games",
    part: 0,
    title: "Six games, different promises",
    lede: "Six worlds share the language of progression. Their invitations to continue have different shapes.",
    paragraphs: [
      "Put six save files on the same shelf: Baldur’s Gate 3, Elden Ring, Clair Obscur: Expedition 33, The Witcher 3, Cyberpunk 2077 and Diablo IV. Each represents time that someone has already given. The useful comparison begins when that person considers coming back. Are they finishing an unresolved story, testing a more demanding build, entering a new region or joining a new cycle with everyone else?",
      "Baldur’s Gate 3 offers a particularly explicit commercial boundary: Larian says there are no in-game purchases or microtransactions. Its branching campaign supplies reasons to replay without turning each branch into another checkout. This leaves room for an ordinary but easily forgotten outcome: a player can finish, feel well served and stop. A completed relationship can still be a successful one.",
      "Elden Ring’s Shadow of the Erdtree and Cyberpunk 2077’s Phantom Liberty put a different proposition on the shelf: another authored expansion. Bandai Namco specifies that Shadow of the Erdtree requires the base game. CD PROJEKT reports Phantom Liberty as a separately produced and marketed expansion. These offers give the return a named destination. The purchase can be evaluated against that destination rather than against an indefinite promise of future activity.",
      "The Witcher 3’s 2022 Complete Edition shows how the same material can acquire another commercial shape over time. It brought the base adventure, Hearts of Stone, Blood and Wine and the earlier extra content into one bundle. For a newcomer, several release moments become one purchase decision. A catalog is an arrangement made for an audience arriving at a particular time; it is not an immutable property of the fictional world.",
      "Expedition 33 adds another wrinkle. Sandfall presents an authored quest built around turn-based combat with real-time actions, and released a free Thank You update in December 2025. A campaign can receive new attention and additional material without becoming a seasonal service. Release cadence, purchase cadence and the player’s sense of completion can move independently.",
      "Diablo IV sits at an intersection. A campaign offers authored progression; Seasonal and Eternal realms organize different continuities; a store and reward catalogs attach further transactions to an inhabited character world. The 2025 Reliquary design, for example, distinguished catalog access from rewards claimed through earned Favor. Calling all of this “more content” erases the difference between entering an adventure and accepting another set of conditions inside one.",
      "Each row in the comparison table names a reason to return and the purchase attached to it. Before accepting the invitation, we need to know what the visitor gets to bring along.",
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
    part: 0,
    title: "Where progress lives",
    lede: "The character can be saved while the occasion for playing it changes.",
    paragraphs: [
      "The word “reset” is too blunt for what a seasonal game does. It suggests a hand sweeping everything off the table. Diablo IV instead separates tables. Blizzard’s first-season explanation in 2023 said the seasonal character and its progress would move to the Eternal Realm; season-specific features could disappear. The owner’s newer character-creation capture also describes transfer to Eternal. A surviving character and a fresh seasonal climb can coexist.",
      "It helps to unpack the luggage. Character state includes equipment, levels and completed tasks. Account entitlements concern what the account owns or may access. Knowledge is the player’s understanding of the system; skill is their ability to act within it. Those last two travel in the person, with all the imperfections of memory and practice. A server cannot simply set them to zero alongside a level counter.",
      "That is why two nominally fresh characters can begin from very different positions. Imagine a veteran who recognizes a useful modifier immediately and a newcomer who must read every item. Give them identical starting equipment and their decisions will still diverge. The reset has equalized part of the saved state. It has left the history of learning intact. The shared starting line preserves a considerable difference in preparation.",
      "Outer Wilds pushes that distinction into the center of its design. The solar system repeats, while discoveries change where the player wants to go and what they can make sense of. Mobius’s account of a narrative prototype contains a lovely practical detail: testers started keeping notes, reinforcing the need for the ship computer to record discoveries. A log can preserve clues; the player still has to understand how they fit.",
      "Blizzard gave a different design rationale for seasons: temporary mechanics create room to experiment without balancing every new theme against all previous themes forever. A fresh cycle can also give a group a shared point of departure. Those are real design possibilities. Whether the cycle feels like a welcome reunion or an obligation depends partly on which continuity the player values: experimenting again, keeping one character, playing with friends or finishing an unfinished project.",
      "The commercial consequence appears when rewards and purchases follow different luggage rules. An account appearance may travel differently from a seasonal power; a catalog may have its own period of availability. The design must explain the relevant boundaries at the moment of commitment. “You keep your progress” is inadequate if the listener and the designer mean different kinds of progress.",
      "The transfer exhibit below deliberately keeps the categories separate. End the season and watch where the character goes, then consider what the player brings to a new beginning. Once that distinction is visible, a larger historical pattern becomes easier to recognize: games have long sold different relationships to time, and each relationship has shaped what an interruption costs.",
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
        credit: "Owner capture · platform/build number unconfirmed",
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
      "hist-season-design",
      "hist-outer-product",
      "hist-outer-demake",
      "outer",
    ],
    evidence:
      "The detailed season rationale is attributed to Blizzard’s 2023 announcement, not projected onto current-season rules. The present capture supports transfer wording only. No undocumented Rebirth preservation rules are asserted.",
    paragraphCitations: {
      "0": ["hist-season-design"],
      "3": ["hist-outer-product", "hist-outer-demake"],
      "4": ["hist-season-design"],
    },
  },
  {
    id: "several-histories",
    part: 1,
    title: "Several histories at once",
    lede: "The old arcade cabinet had a business model inside its difficulty settings.",
    paragraphs: [
      "Open the 1985 Gauntlet operator manual and the separation between game design and commerce becomes difficult to maintain. The operator can set health per coin. The manual also explains the commercial balance: play should last long enough to feel worthwhile and encourage another visit, but short enough to keep the cabinet earning. If sessions run too long, it recommends increasing difficulty before reducing health per coin, because the latter change is more obvious to players.",
      "That is an unusually candid artifact. It exposes a negotiation that the cabinet’s fantasy usually hides: how much experience fits into one payment? It also complicates the comforting history in which business arrived to corrupt games only after the download button. The operator wanted another coin and a returning customer. Those aims could reinforce each other, or pull against each other, depending on the setting.",
      "Text worlds posed a related problem across telephone lines. In his MUD Advanced Project Report, Richard Bartle considered charging by the hour against a fixed payment for unlimited access during a period. He noted that a known initial outlay could make participation possible for people deterred by uncertain charges. Network fees and the game operator’s income were already intertwined. This was a design discussion about access, infrastructure and the feeling of a bill that keeps running.",
      "Digital distribution later made a different boundary easy to move. Valve’s June 2011 announcement turned Team Fortress 2 into a free-to-play game after years of releases and updates. The door could become free while the world continued to support commercial activity. The old purchase and the new free entrance belong to the history of the same world.",
      "Dota 2’s 2013 Compendium joined several commitments together: following a tournament, predicting results, collecting player cards and receiving rewards. A portion of purchases enlarged the prize pool. Buying could therefore express participation in an event as well as acquiring something for oneself. Crossy Road’s creators described another mixture in 2015: optional rewarded video beside character purchases, with the interruption itself becoming a deliberate design choice.",
      "These histories overlap because they answer different questions. The coin meters another stretch of play. Period access offers a known interval. A purchased object gives the player something to value inside the world. An event companion connects the transaction to an occasion. Advertising brings in a payer whose reasons for participating differ from the player’s. A contemporary interface can combine several of these arrangements within a few screens.",
      "The consequences appear in the joins. A game may sell entry once, organize play around seasons and sell identity goods throughout. Each layer needs its own reason to exist. The timeline below is therefore a set of usable mechanisms, not a staircase. One of the most demanding combinations is a paid invitation into a world whose experience depends on other people showing up. Concord makes that dependency painfully concrete.",
    ],
    takeaway:
      "Inspect each layer of the exchange; several commercial histories may occupy the same game.",
    panel: {
      title: "Selected historical anchors",
      flow: true,
      items: [
        { label: "1985 · Gauntlet", text: "Coins, health and operator tuning" },
        {
          label: "2011 · Team Fortress 2",
          text: "A shipped game moves to free-to-play",
        },
        {
          label: "2013 · Dota 2",
          text: "Tournament companion, participation and rewards",
        },
        {
          label: "2015 · Crossy Road talk",
          text: "Optional video funds some play",
        },
        {
          label: "2022 · Halo policy",
          text: "Premium tracks remain accessible",
        },
        {
          label: "2025 · Diablo IV",
          text: "Reliquaries separate access from claiming",
        },
      ],
    },
    figures: [
      {
        asset: "gauntlet-options-manual-p3-4",
        alt: "Gauntlet operator manual table with game difficulty and health-per-coin switches",
        caption:
          "Health-per-coin settings in the 1985 Gauntlet operator manual, printed page 3-4. A commercial variable is exposed as a game rule.",
        credit: "Atari · manual preserved by Stardust Arcade",
      },
    ],
    sources: ["gauntlet", "hist-bartle", "tf2", "dota", "crossy", "reliquary"],
    evidence:
      "This is a selective set of primary historical anchors, not a claim about first invention or a complete global history. Gauntlet’s printed pages 2–3 and 3–4 provide the operator guidance; Bartle’s report is a historical proposal, not evidence that every suggested tariff was implemented.",
    paragraphCitations: {
      "0": ["gauntlet"],
      "2": ["hist-bartle"],
      "3": ["tf2"],
      "4": ["dota", "crossy"],
    },
  },
  {
    id: "concord",
    part: 1,
    title: "Concord",
    lede: "For a multiplayer world, other players are part of what the product has to deliver.",
    paragraphs: [
      "Concord’s reveal offered an expanding 5v5 world: a cast of Freegunners, maps and modes, weekly narrative vignettes and further updates. The invitation had a future tense. Players were being asked to learn a team game and begin a relationship with its world. Its launch was set for 23 August 2024. On 3 September, Firewalk announced that the game would go offline on 6 September, with sales stopped and refunds offered.",
      "Those dates are enough to establish the rupture. An invitation to invest in an evolving world became a refund process within weeks. The contrast matters without a speculative budget attached to it. Money can be returned through a payment system; an anticipated future with a game is a different sort of commitment, including the time spent learning and persuading friends to come along.",
      "A multiplayer product has a peculiar dependency. The studio supplies maps, rules and software, while players supply part of one another’s experience. An arena with nobody suitable to meet is missing something essential even when every texture has loaded correctly. That makes attracting an audience and sustaining playable conditions entangled problems. A large number in an announcement does not tell one player what their queue will feel like tonight.",
      "Activision’s 2024 matchmaking paper makes the underlying tradeoffs explicit for Call of Duty. Its system considers connection quality and time to match alongside skill, playlists, input and platform. The paper describes loosening some constraints as it assembles a lobby. These particulars belong to Call of Duty. It explains why “how many people?” needs companions: where, when, in which mode and under which matching rules?",
      "Consider a hypothetical launch test that attracts a busy weekend crowd. It can demonstrate that matches form under those conditions. It leaves another question open: what happens when those people spread across ordinary working days, regions and preferred modes? The promotional peak and the routine evening are different operating conditions. A useful launch plan needs to know how much those conditions differ.",
      "The shutdown statement says parts of the game and launch did not land as intended. It does not isolate price, art direction, timing, differentiation or execution as the decisive cause. Treating the failure as proof of whichever complaint we already preferred would turn a striking case into weak evidence. The useful problem is more specific: how can a project discover whether its promised experience remains available when the audience behaves like real people?",
      "That question belongs early enough in production for an answer to change the plan. It needs observations from actual play, a model of the service’s dependencies and decisions that remain open. The useful test must be small enough to run while the project can still change, and faithful enough to reveal the dependency that could sink it.",
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
      "Outer Wilds gives us an unusually precise example of a good idea failing at the point of contact. In Mobius Digital’s 2016 account, the signalscope was meant to turn an unfamiliar sound into a destination. Players instead mistook signals from far away for noises coming from the rock in front of them. The team added clearer aiming feedback, separated frequencies and supplied distance information. A tool intended to produce curiosity had been producing a misunderstanding about space.",
      "That distinction matters. Imagine measuring only how often the scope was opened. A confused player might use it repeatedly; an informed player might locate the source and put it away. The same dashboard could congratulate the worse version. The observation that rescued the design was more specific: what did the player believe the sound was telling them, and where did that belief send them next?",
      "Mobius described a related problem in its pathing. At forks, players were choosing routes without enough information to become curious about a destination. The response was to give paths suggestive clues. This protected the game’s larger promise—following your own questions—by improving a small decision on the ground. The developer account makes the revision legible: an intended experience, an observed obstacle, a change that addressed it.",
      "There is a production discipline hiding inside that little instrument. Before polishing the brass, decide what would make you rebuild the receiver. For a combat prototype, it might be that players cannot explain why they died. For a purchase screen, it might be that they mistake access to a catalog for ownership of its contents. For a cooperative service, it might be that the proposed audience cannot reliably find a match. Each uncertainty needs its own encounter with reality.",
      "A playable hour can reveal a confusing encounter. It cannot contain a year of obligations to friends, shifting tastes or unfinished rewards. Conversely, a large audience survey can establish interest in a premise without showing whether the thing feels good under a thumb. The tempting mistake is to promote whichever evidence is available into permission for every commitment that follows.",
      "Ask a sharper question at the milestone: what can still change because of what we learned? If the answer is only the tutorial text, the expensive parts of the design have already become immune to the test. Keep the promise clear and its implementation negotiable. A studio that intends to keep selling new reasons to return will need that freedom repeatedly; the financial plan inherits the same obligation to keep learning.",
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
    lede: "The shop can stay open only while someone keeps the world worth visiting.",
    paragraphs: [
      "The tempting picture of a service game is a line of future revenue continuing beyond launch. The less photogenic picture is the work calendar underneath it. Someone must keep accounts working, respond when a deployment fails, maintain the economy and deliver whatever new experience the game has taught its audience to expect. Repeated opportunities to charge arrive inside a relationship that must be renewed from both sides.",
      "Sony’s 2022 investor presentation makes the attraction legible. It projected a larger live-service portfolio and a rising share of PlayStation Studios investment devoted to that model. Read as a historical planning document, it shows why a publisher might want an ongoing relationship with an audience alongside its catalog of releases. Its forecasts describe an investment intention; they cannot be quietly converted into evidence that the planned returns arrived.",
      "For a view underneath the line, read Riot’s engineering account of VALORANT. The live platform handles parties, matchmaking, allocating matches to data centers, recording results, unlocks and purchases. The team tested the connected system with simulated players because separate services passing their own tests did not establish that a whole player journey would work under load. Even the apparently simple act of equipping something belongs to an operated system.",
      "This is one reason “the servers cost money” is an incomplete description of the obligation. Capacity, reliability and coordination require design and maintenance. Fresh content adds another production problem: it must give people a reason to return without making the existing world incoherent. More frequent selling can support that work, but frequency alone says nothing about whether the resulting experience is worth the next commitment.",
      "An expansion places a more visible boundary around a production effort. CD PROJEKT’s October 2023 disclosure separated Phantom Liberty’s direct production expenditure from its marketing campaign. That distinction is useful without turning either figure into a slogan about the whole company. Creating the thing, bringing it to an audience and keeping a broader product running are different demands on money. A receipt at the end of the chain does not explain their proportions.",
      "Now consider a hypothetical studio deciding whether to build a welcome feature for returning players or another purchasable collection. Both consume scarce staff time; either could help the business under the right conditions. A dashboard that only rewards immediate purchases would make one kind of result easier to defend. That is a risk in the decision process, not proof that every store crowds out care. The studio needs evidence about the experience it is preserving as well as the transaction it can count.",
      "The machinery below closes the circuit between offers, resources, upkeep and reasons to return. The question is whether the circuit keeps producing a world people choose to inhabit. To answer that, we must leave the publisher’s planning table for a while and ask what the person in front of the screen came here to do.",
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
    sources: ["sony", "hist-valorant", "cyberpunk"],
    evidence:
      "Sony’s figures are historical projections, not realized outcomes. Riot supplies one concrete engineering example. CD PROJEKT’s disclosure distinguishes production from marketing expenditure. The staffing choice is a hypothetical decision problem, with no inferred studio allocation or invented revenue curve.",
    paragraphCitations: {
      "1": ["sony"],
      "2": ["hist-valorant"],
      "3": ["hist-valorant"],
      "4": ["cyberpunk"],
    },
  },
  {
    id: "why-people-play",
    part: 2,
    title: "What players want",
    lede: "Three people can finish the same dungeon and take home three different things.",
    paragraphs: [
      "Picture a party returning to town. One player has finally learned to read the boss’s wind-up. Another spent the whole run talking with an old friend. A third got the missing piece for a character they have been imagining for weeks. The game records a completed dungeon, three inventories and a duration. Our imaginary party leaves with a new skill, an evening together and a more convincing fiction. Only some of that fits in the loot window.",
      "Ryan, Rigby and Przybylski’s 2006 studies offer a useful vocabulary for this difference. Self-determination theory examines autonomy, competence and relatedness: willing participation, effective action and connection with others. Their game research linked perceived need satisfaction with enjoyment and future play, while also examining well-being. These are qualities of an experience. Counting available choices, awarded levels or names on a friends list does not directly measure them.",
      "The first question is therefore what the person came to do. A difficult fight can be welcome when learning it is tonight’s project. The same fight can be an obstacle when the plan was to show a new friend the world. A menu that offers twenty activities may still leave that pair searching for one they can enjoy together. Variety has to become usable possibility somewhere.",
      "Nick Yee’s survey of roughly 3,000 MMORPG players adds a different lens. It grouped reported motives into achievement, social and immersion components, without making them exclusive character classes for human beings. An optimizer can care deeply about friends; a role-player can enjoy winning. A designer who treats each label as a separate audience risks cutting one person into three marketing segments and then wondering where the person went.",
      "Learning adds another complication. In the opening of A Theory of Fun, Raph Koster describes his children losing interest in tic-tac-toe as its patterns became familiar. His design argument helps explain why increasing a counter can eventually cease to feel like progress. It also suggests a productive question for an RPG: is the next session changing what the player can notice or do, or mainly extending an already settled routine?",
      "Settled routines can be wanted. Our imaginary friends may prefer an easy route precisely because it leaves room to talk. The collector may enjoy careful repetition. The task is to discover which purpose the repetition serves and whether the surrounding rewards preserve it. If a deadline sends the group into separate activities, the economy has changed the evening even when everyone completes more objectives.",
      "This is where monetization becomes a design question about the life around the purchase. What does the offer help someone express, attempt or share? What must they give up to use it? Those questions leave room for pleasure, effort and ambivalence in the same account. They also prepare us for a stranger possibility: a game can make its reward machinery visible so that we begin to distrust what it measures.",
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
    sources: ["sdt", "yee", "koster"],
    evidence:
      "The opening party is an invented example. SDT findings, Yee’s genre-specific motivation study and Koster’s design argument are distinct kinds of evidence; the chapter does not turn them into a universal player taxonomy or a diagnostic questionnaire.",
    paragraphCitations: {
      "1": ["sdt"],
      "3": ["yee"],
      "4": ["koster"],
    },
  },
  {
    id: "play-beyond-score",
    part: 2,
    title: "Play beyond the score",
    lede: "INDIKA puts a bright little accounting system inside a world that gives us reasons to question it.",
    paragraphs: [
      "In an INDIKA reference screenshot, a nun stands before a scene torn open by red light. Near her is the instruction to hold a trigger to pray. In the corner sits a crisp fraction: 1330 / 1470. A second reference screenshot places a luminous, pixel-edged reward symbol above worn fabric, wood and a small candle. The image almost carries two visual languages at once: a distressed physical world and the clean certainty of a counter.",
      "The publisher describes a journey through religious belief and harsh reality, with the devil accompanying the protagonist. Against that premise, the numerical display invites a particular reading. Prayer has entered a system that accepts an input and makes progress legible. We can ask whether the count measures anything the character actually needs, whether its authority is trustworthy, and why we are so ready to understand the next threshold as a desirable destination.",
      "This reading depends on the relationship between the elements. Remove the score and the scene still contains a figure, a threat and an instruction. Remove the figure and the counter could belong to a harmless collection task. Together, they put an ordinary game habit under pressure: the willingness to treat a sign of advancement as proof that advancing is worthwhile. The cheerful arithmetic becomes a small, suspicious witness.",
      "A screenshot cannot tell us how the input feels over time or how every player interprets the sequence. It can support a close reading of the invitation on screen. Holding a control assigns the player a part in the ritual; observing a character pray would assign a different part. The interface brings the action under a hand, while the story supplies reasons to question the action’s meaning. The reading here rests on that tension between action, measurement and meaning.",
      "It also exposes a limitation in the word reward. A game can award points while asking the player to reconsider the values behind them. The interesting consequence might arrive after the session, when a familiar symbol no longer looks innocent. A person can value an unsettling work, discuss it eagerly and never wish to repeat the same scene. Completion, enjoyment and admiration may separate without any of them becoming unreal.",
      "When we inspect an economy, we need to describe what its signals mean within the work. A coveted sword, a souvenir from friends and a deliberately dubious score can all produce an acquisition event. Their roles are different enough that substituting one for another would change the game’s argument. An acquisition loop can leave behind understanding—including understanding that its counter deserves a raised eyebrow.",
    ],
    takeaway: "Read the reward signal in the context of the work that uses it.",
    figures: [
      {
        asset: "legacy-indika-pray",
        alt: "INDIKA shows a Hold LT to pray prompt in a red-lit scene",
        caption:
          "A held input makes prayer an action the player performs. The screenshot establishes the prompt, not the complete experience of holding it.",
        credit: "Odd Meter / 11 bit studios · handoff capture, date unknown",
      },
      {
        asset: "legacy-indika-points",
        alt: "INDIKA shows a glowing reward symbol and a numerical score",
        caption:
          "The visible score invites a reading of what is being counted and why. Its expressive role is discussed here as interpretation.",
        credit: "Odd Meter / 11 bit studios · handoff capture, date unknown",
      },
    ],
    sources: ["lit-indika-official"],
    evidence:
      "Original close reading of the owner-supplied prayer and points captures, with the premise checked against the publisher. No unseen ending, invented playthrough, universal emotional response or blanket claim about the usefulness of INDIKA’s points is asserted.",
    paragraphCitations: {
      "1": ["lit-indika-official"],
    },
  },
  {
    id: "anatomy-of-loop",
    part: 3,
    title: "Anatomy of a loop",
    lede: "The arrow back to the beginning conceals the important question: what is different when we get there?",
    paragraphs: [
      "Draw attack, defeat, loot, upgrade and return on a page, then connect the last word to the first. You have a recognizable action-RPG loop. You also have a drawing broad enough to describe both a wonderful evening and a dreadful one. It leaves out what the player knew before the attack, why the object mattered, and whether the next encounter gives the upgrade anything interesting to do.",
      "Hunicke, LeBlanc and Zubek’s MDA framework helps unpack that shortcut. It distinguishes mechanics, the rules and implementation; dynamics, the behavior that develops as the system is played; and aesthetics, the experience the design seeks to produce. The value of the distinction is the work it demands between those layers. A rule on a design sheet still has to become a situation someone can read, act within and care about.",
      "Consider an invented dungeon with a slow, heavy attack. Its recovery time is a mechanical constraint. A narrow doorway and two enemies can turn that constraint into a decision about when to commit. Reading the opening, risking the swing and surviving can produce a feeling of control earned under pressure. Increase the damage until every enemy dies before that decision matters and the animation survives, while the encounter’s question disappears.",
      "Now move outward. The player may leave the room with a better weapon, a clearer reading of the enemy, or a story about a spectacularly mistimed swing. Over the session, those changes can become a new route or a revised build. Across weeks, they can become a personal project shared with friends. These timescales are our explanatory model, rather than a fixed anatomy every game must possess. Their purpose is to make the transfers visible.",
      "A reward schedule can support those transfers. A new tool might invite a tactic the player has never tried. It can also sit beside them like an unrelated meter, recording hours without opening another decision. The distinction becomes especially useful when tuning an economy: if a change makes the player repeat the dungeon twice as often, what happens inside those additional runs? More experiments, more conversations and more identical chores are all compatible with that count.",
      "The MDA paper itself uses Monopoly’s accumulating advantage to show how rules can change the course and tension of play. That example suggests a way to inspect our imaginary dungeon: follow the feedback. Does success broaden the player’s options? Does failure supply information? Does the next reward make yesterday’s learning useful or bypass it? These questions reach the experience through the workings of the system.",
      "The loop earns its next turn when something worth carrying forward comes out of the previous one. That can be modest: a clean dodge, an amusing mishap, a small improvement to a cherished character. Random loot makes the transfer more complicated, because effort and the desired object no longer arrive on the same schedule. The machine can keep turning while one player is still waiting.",
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
    sources: ["mda"],
    evidence:
      "MDA supplies the three-level framework and Monopoly example. The dungeon, timescales and proposed review questions are original explanatory models, not measurements of Diablo IV or validated causal claims.",
    sections: [
      {
        at: 3,
        title: "What survives the turn",
      },
    ],
    paragraphCitations: {
      "1": ["mda"],
      "5": ["mda"],
    },
  },
  {
    id: "loot-table",
    part: 3,
    title: "The loot table",
    lede: "A one-in-twenty chance does not promise a reward on the twentieth attempt.",
    paragraphs: [
      "The monster falls. Something flashes on the floor. Before the player knows whether it is useful, the object has already created a small interruption: stop, inspect, compare, imagine. In a loot game, finding an item and deciding what it means are separate pieces of play. A rare label supplies only the first part of that story. The item still needs a relationship with the character being built.",
      "Blizzard’s 2024 Loot Reborn announcement makes that relationship unusually explicit. The stated aim was to make dropped upgrades easier to recognize, reduce the quantity of items to sort and move some complexity into Tempering and Masterworking. This was a historical redesign of where item decisions happened. Changing the number of drops was only one part of changing the player’s work around them.",
      "The simplest possible loot model strips that work away so we can inspect one problem clearly. Suppose every attempt has a fixed 5% chance of awarding our imaginary target, independently of previous attempts. After twenty attempts, the probability of at least one success is about 64.2%. More than a third of otherwise identical players would still have nothing. Twenty attempts is also the mean waiting time in this model; it is emphatically not a delivery guarantee.",
      "Our unfortunate player can complete twenty more attempts without receiving credit for the first twenty in the next roll. The probability of the next success remains 5%. A designer looking at aggregate item output and a player looking at an empty slot can therefore both describe the same system accurately. One sees its rate of production. The other experiences the uncertain length of a personal project.",
      "Now give the player alternatives in a hypothetical redesign. A guaranteed award after a fixed number of attempts puts a ceiling on this particular wait. A material earned on every failure can turn an unwanted result into partial progress. A trade route allows effort elsewhere to purchase the object. A targetable source lets the player narrow the search. Each change redistributes uncertainty, choice and commitment; none can be described adequately by the rarity label alone.",
      "The stakes also depend on what happens during the search. An enjoyable encounter with friends and a compulsory payment for each attempt have different costs, even if a probability calculation looks identical. Our model knows nothing about enjoyment, prices, changing odds, duplicates or the rest of an inventory. It is here to make the unlucky tail visible, not to diagnose players from a curve.",
      "This leaves a useful question for the economy: what can someone carry forward after failing to get the thing? Knowledge, materials, a new tactic or a good evening may keep the attempt valuable. If the answer is merely another opportunity to wait, the design has concentrated more of the session’s value in the eventual prize. A checklist offers a different bargain: it promises to tell the player exactly which work will count.",
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
      "An open world can ask a surprisingly tiring question: what shall we do tonight? A checklist answers it. Three objectives fit the time available, the group has a route, and the distant reward gives the session a shape. The structure can be hospitable. It can teach an unfamiliar activity or make a daunting collection of systems approachable without requiring the player to plan everything from scratch.",
      "The bargain changes when the list expires. The objective now has two properties: what it asks someone to do and the date by which they must do it. A player choosing between an interesting side path and an expiring task is weighing a consequence outside the immediate adventure. Even a purely cosmetic reward can organize that choice if it matters enough to the person who wants it.",
      "Imagine a four-week track, with a desired item near the end. In one version, unfinished progress stays available. In another, the track closes. Missing week three leaves different options in the two versions, although the tasks and reward are identical. This is the point of the exhibit: remove one week of participation and inspect the remaining path. The clock is a rule with consequences, not decoration around the reward.",
      "Halo Infinite’s May 2022 Season 2 article documents a useful distinction. Purchased premium passes remained available, and players could switch between them; returning to an earlier free pass required its premium entitlement. The policy separates the arrival of a new season from a purchased track’s expiry, while preserving a meaningful difference between the free and paid conditions. That exact scope matters when comparing the promise.",
      "Ghost Ship’s April 2024 Deep Rock Galactic proposal went further toward treating seasons as a selectable library. It described reactivating older passes and cosmetic trees with previous progress intact, while people with different seasons selected could still play together. Some season-specific assignments would not return.",
      "Keeping a track available does not automatically make its tasks interesting. Expiration is also only one source of commitment: friends, a competitive event or a shared launch can give a date a real purpose. The design review should identify what the deadline contributes to this experience. Does it make a collective occasion possible? Does it keep the activity coherent? Does it mainly make postponement costly? Different answers justify different clocks.",
      "A comfortable return needs more than a welcome-back banner. It needs a comprehensible account of what remains, what changed and where earlier effort can still be used. The player should be able to fit the project back into life without first negotiating a small mountain of expired obligations. Once the calendar has stopped shouting, we can look more closely at the activity it was asking everyone to repeat.",
    ],
    takeaway:
      "Take a week out of the schedule and inspect the player’s remaining choices.",
    figures: [
      {
        asset: "legacy-season-rank",
        alt: "Diablo IV Death Awakening season ranks interface with a time remaining indicator",
        caption:
          "A historical Death Awakening season screen makes ranks and remaining time visible. It is not evidence of the current season’s objective requirements.",
        credit: "Blizzard · handoff capture, date unknown",
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
      "Compare the familiar combat framing of Diablo II and Diablo IV. The family resemblance is immediate: elevated view, a character surrounded by threats, equipment, resources, places to point violence. That continuity is useful. It lets a returning player recognize the kind of world they have entered. It also tempts a critic to decide, from the resemblance, that little of importance has changed.",
      "To see what a screenshot leaves out, build a deliberately small example. The player faces an enemy across an open floor, with room to approach and retreat. Put a hazard behind the player and backing away becomes dangerous. Put cover between the two figures and the direct approach closes; the player has to go around it. The attack button remains exactly where it was. The floor has changed what must happen before and after the press.",
      "We have added no new verb to the player’s move set. We have changed the information needed before acting, the cost of a mistake and the alternatives after it. Try the three layouts in the tactical exhibit. Its deliberately spare geometry makes the changed decision visible before textures, animation and spectacle can distract us from it.",
      "Jesper Juul’s account of emergence and progression gives the comparison a useful foundation. Games can combine rules that generate varied situations with sequences of authored challenges. His EverQuest analysis shows both structures in one world: a general system of character abilities and cooperation alongside individually specified quests. Reusing an action within a new relationship between rules can produce a different problem, while adding more destinations can leave an old problem largely intact.",
      "That distinction also prevents novelty from becoming its own bureaucratic target. A new button may add a decision; it may add another step to the same answer. A familiar enemy can become interesting through terrain, scarcity or an unexpected companion. For any claimed improvement, describe a situation in which the player notices different information and makes a consequential choice. If no such situation can be found, the change may belong mainly to presentation, content volume or convenience.",
      "The fair comparison between Diablo generations would therefore follow actual encounters: what the player could anticipate, what a build made possible, how failure taught the next attempt, and which choices disappeared once the character became powerful. The combat screenshots in this study’s reference archive begin that inquiry by showing continuity in the visual language. They cannot finish it, and they cannot identify monetization as the cause of continuity.",
      "This matters when evaluating what an economy sells. A purchase may open a new location, alter the route to an item, change a character’s appearance or remove a constraint from an encounter. Those effects reach different parts of the decision. To understand their value, we have to follow each one into the play it changes. The first transaction is the easiest to picture: a door, a key and whatever still waits beyond it.",
    ],
    takeaway:
      "Compare the information, commitments and consequences around an action.",
    figures: [
      {
        asset: "legacy-d2-combat",
        alt: "Diablo II combat near the Cairn Stones with Rakanishu",
        caption:
          "Diablo II: a historical combat interface. The image demonstrates visual vocabulary, not the complete combat system.",
        credit: "Blizzard · handoff capture, version/date unknown",
      },
      {
        asset: "legacy-d4-corridor",
        alt: "Diablo IV character in the Hell-Touched Corridors with health and resource displays",
        caption:
          "Diablo IV: familiar framing and resources. Understanding the differences requires observing play, builds and encounters.",
        credit: "Blizzard · handoff capture, version/date unknown",
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
      "Shadow of the Erdtree makes that distinction unusually literal. The expansion has a commercial entrance and a playable entrance. Bandai Namco’s June 2024 guide tells owners to defeat Starscourge Radahn and Mohg before entering the Realm of Shadow. The receipt cannot defeat either boss. A purchase has added a destination to the player’s world; the character still has to reach it.",
      "That arrangement carries a particular promise: more adventure for someone already committed to this kind of adventure. The prerequisite may prepare the player, preserve the fiction or connect the new journey to the old one. It can also become an unpleasant discovery for someone who bought the expansion expecting to join friends that evening. The same gate can serve the game and obstruct the purchaser. Its placement and explanation decide whether those commitments fit together.",
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
        credit: "Owner capture · build/platform unconfirmed",
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
      "Imagine two versions of the same character waiting at a campfire. One wears practical iron, scarred and undecorated. The other wears a crown that looks as though it was confiscated from a cathedral. Their statistics match. So do their attacks. Yet they invite different stories about who has arrived. The wardrobe has become part of the player’s authorship, even if tonight’s audience is one person sitting at a desk.",
      "Vili Lehdonvirta’s 2009 study gives that intuition more useful language than the usual functional-versus-cosmetic split. His exploratory analysis of fourteen virtual-goods platforms distinguishes practical utility, aesthetic pleasure and social meaning. Several can inhabit one object. The point is to ask what makes this particular object desirable, rather than treating everything without a damage bonus as the same kind of purchase.",
      "Avatar research also gives us a reason to take representation seriously. In Yee and Bailenson’s 2007 experiments, participants were assigned different virtual appearances; changes in attractiveness or height were associated with differences in social interaction and negotiation. These were short laboratory encounters, not a study of buying armor in Diablo. They establish a narrower possibility worth carrying into design: the figure representing us can participate in how we act, as well as how we are seen.",
      "The wardrobe below holds mechanical capability steady while changing appearance. Try looking at the same outfit as a collector, a role-player and a member of a group. A collector may care about completing a visual set. A role-player may reject the most elaborate option because it contradicts the character. A group may choose something recognizably shared. A single sales event would flatten those intentions into one identical row in a purchase log.",
      "The same question extends beyond this simplified wardrobe: how much authorship remains after purchase? Imagine a system that lets someone change the crown’s finish, removing its brightest ornament, or pairing it with the plainest coat in the inventory. The buyer begins arranging a character rather than simply equipping a complete advertisement. A rigid matching set and a flexible collection can contain equally elaborate art while allowing very different degrees of personal composition.",
      "That tension is why the earned wardrobe deserves as much design care as the paid one. A world becomes thinner when its most convincing identities all arrive through the storefront and the adventure supplies only temporary scaffolding. My standard is that the player should be able to become someone through play, while purchases offer further ways of expressing that person. The helmet’s commercial value grows inside that relationship; it cannot supply the relationship by itself.",
    ],
    takeaway:
      "Judge an appearance by the fantasy and expression it supports, alongside its mechanical effects.",
    figures: [
      {
        asset: "legacy-d4-shop-grid",
        alt: "Diablo IV shop with cosmetic bundles, a refresh countdown and an Ancient Hydra preview",
        caption:
          "A historical shop screen groups appearance items and displays a refresh timer. Its offers and prices are not presented as current.",
        credit: "Blizzard · handoff capture, date unknown",
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
      "Warframe’s Foundry makes a useful starting point because it turns acquisition into visible work. Digital Extremes’ collection guide describes buying blueprints with Credits and building equipment from resources, alongside Platinum purchases of completed equipment. Before comparing either route, pause at the blueprint. For one player it is a project to pursue; for another it is the sequence standing between tonight’s plans and the character they want to use.",
      "A sentence such as ‘you can earn it’ leaves most of that difference unresolved. Where are the required materials? Can the player deliberately seek them? Does the activity teach something useful or merely need repeating? What happens during a crafting wait? The complete route includes information, inventory decisions and interruptions as well as minutes. A stopwatch records duration while missing much of the experience that makes that duration welcome or unwelcome.",
      "Trade adds a third route. Warframe’s support rules allow eligible Platinum to move between players, including currency previously received through trade; starting and promotional Platinum have restrictions. That means the person using Platinum need not be the person who originally paid for it. A player can turn desirable finds into purchasing capacity. This creates another form of work: knowing what others want, finding a counterpart and deciding what to part with.",
      "The routes in the exhibit therefore end at a shared destination but carry different obligations. Purchasing can remove a search or a wait. Crafting can make the item the culmination of an expedition. Trading can turn an unwanted drop into progress toward a chosen build. None of those descriptions tells us which route a particular person enjoys. It tells us what must be compared before calling a payment a harmless shortcut or a necessary escape.",
      "Path of Exile places another useful detail on the table. In a January 2022 support reply, Grinding Gear Games explained how a public premium stash tab lets its owner price items individually or price the tab’s contents together. The purchase changes an interface used to offer goods to other players. More storage and easier selling can overlap. This is a specific convenience, not evidence that all trading requires a paid tab.",
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
      "Picture a player opening an auction search before choosing a dungeon. They specify the desired attributes, compare prices and find an upgrade. The dungeon may still be entertaining, but it now has a competitor for the practical job of improving the character. The decisive action might be reading the market accurately. That is a real form of play. The difficulty begins when the rest of the game was built around a different kind of discovery.",
      "Blizzard confronted that conflict publicly in September 2013. John Hight’s Diablo III announcement said the auction houses had been intended to make trading convenient and secure, yet were undermining the core experience of killing monsters for desirable loot. Both the gold and real-money houses were scheduled for removal in March 2014. Including the gold house matters: the stated design problem extended beyond the presence of a cash payment.",
      "The useful question is what an efficient player learns to do next. In the imagined dungeon route, a disappointing drop leaves a problem of encounter choice, build adjustment or another attempt. In the market route, it may leave a pricing problem. The sword arrives with the same combat properties, but the sequence that produced it trains attention elsewhere. A game can support that economy deliberately. It needs to understand that the economy is now one of its main activities.",
      "Grinding Gear Games addressed a related tension in its 2017 Trade Manifesto. The studio defended trade as part of what made items valuable while arguing that very easy exchange could compress the number of upgrades on the way to a final build. This is a developer’s historical design argument, not an experimental demonstration that every faster market damages enjoyment. It is useful because it identifies the scarce resource under discussion: the journey between an inadequate item and an excellent one.",
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
      "Use the historical Canadian store capture as a small accounting exercise. It lists 1,000 Platinum for CAD 13.49. Imagine an item priced at 900 Platinum and a player starting at zero. Selecting that single pack requires CAD 13.49 now and leaves 100 Platinum after the item is claimed. The 900 printed beneath the item answers one question. The amount that must leave the account answers another.",
      "It is tempting to multiply 900 by the pack’s per-token rate and call the result the item’s price. That yields an allocation of the pack’s cost, useful for some comparisons. It still cannot be paid on its own in this example. The player must choose the full pack. Conversely, charging the entire pack to this one item ignores the remaining currency’s possible future use. The arithmetic needs two visible lines: cash committed today, currency remaining tomorrow.",
      "The calculator keeps the situation deliberately small: one selected pack, one hypothetical item and no starting balance. Change the pack and watch how affordability and remainder move together. A more favorable token rate can require a larger cash commitment. Whether that is useful depends on purchases the player actually intended to make, rather than on the size of the discount alone.",
      "Research gives us reasons to study the representation of payment, while leaving the size of any game-specific effect open. Raghubir and Srivastava’s 2008 experiments compared cash with other payment forms, including stored-value certificates. They found differences in spending under their tested conditions; making the parting with money more salient could reduce some differences. These were consumer experiments, not measurements of Diablo’s Platinum shop. Their relevance is the mechanism to investigate, not a percentage to paste onto game revenue.",
      "A prepaid balance also changes the next decision’s starting point. In this example, the next item is encountered by someone already holding 100 Platinum. The balance can be useful toward a purchase they wanted anyway. It can also make the question ‘Do I want another item?’ arrive tangled with ‘What should I do with this remainder?’ We cannot infer which thought wins from the existence of the balance. We can design the interface so that both the new cash outlay and the resulting balance are easy to inspect.",
      "That is what the exchange machine is meant to expose. The token is an internal measuring unit, and the pack is a cash transaction. Keep their scales connected while allowing the reader to see both. A store can retain its fictional currency and its theatrical machinery; the receipt should still be boring enough to understand.",
    ],
    takeaway:
      "Show today’s cash outlay and tomorrow’s remaining currency as separate quantities.",
    interactive: "price",
    figures: [
      {
        asset: "legacy-d4-platinum",
        alt: "Diablo IV Platinum packs with cash prices from the owner’s Canadian-dollar store",
        caption:
          "Owner identifies the store currency as CAD. Capture date is unknown; use these figures only as a historical illustration.",
        credit: "Blizzard · owner-provided handoff capture",
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
      "Blizzard’s April 2025 rules sold premium catalog access for Platinum and let players claim its rewards with earned Favor.",
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
        credit: "Blizzard · handoff capture, date unknown",
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
      "Picture the path through an elaborate reward shop. The armor fills most of one screen. A second screen lists currency packs. A catalog panel explains access. A smaller detail view supplies the claim condition and the expiry date. Each piece may be readable when found. The player still has to carry it to the next screen and assemble the transaction in memory. The interface has distributed the explanation across the route.",
      "Abstraction is part of the attraction of a game. We want a coin to feel like treasure and an unlocked vault to feel like an event. Trouble arises when the same theatrical shorthand has to carry an ordinary purchasing decision. ‘Unlock’ compresses several possible meanings. A shining token can represent money already spent, effort already supplied or permission still missing. Keeping the visual language coherent does not make those meanings interchangeable.",
      "Hsee and colleagues’ 2003 research on medium maximization supplies a particularly strange lens. In one questionnaire study, participants chose between tasks leading to different ice-cream flavors. Introducing points between task and reward changed choices toward the longer task, even though the points had no independent use. It is a small experimental setting, far from a persistent game economy. Its useful provocation is precise: people may evaluate the intermediate score as though improving it were the final objective.",
      "That helps formulate a question for the reward altar below. With the terms scattered, which fact becomes easiest to attend to: the largest number, the rarest-looking object or the shortest route to the glowing button? Gather the same terms together and ask again. No offer has become cheaper. No reward has changed. The exhibit changes the work required to understand the relationship among them. That difference deserves testing on its own.",
      "Interface experiments also caution against diagnosing effects by appearance alone. Luguri and Strahilevitz’s 2021 studies of online service enrollment found that some manipulative presentations changed choices, while their countdown-timer condition did not significantly increase purchases. An angry-looking clock is not a measurement of pressure, just as a quiet button is not proof of neutrality. Their results come from a particular enrollment task; a game needs evidence from its own decision path.",
      "A useful review gives someone a concrete intention—obtain this appearance, within this budget, without committing to another week—and lets them inspect the offer. Before confirmation, ask them to describe what payment delivers, what remains to be done and what happens if they stop. Then compare their account with the actual rules. A fast checkout with a wrong explanation is a failure of understanding, even when its conversion graph looks healthy. This is where the interface’s craft becomes consequential: the same precision that makes a sword feel heavy can make a decision feel graspable.",
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
    lede: "The dashboard can record a return. It still needs help understanding what the person returned for.",
    paragraphs: [
      "This study began with a wonderfully unheroic figure from Stepan’s own game: funduck, a level-eight Eternal Barbarian, waiting at character selection. The uncertainty is how to get back into the game. A new season, an existing character and a world full of activities offer several plausible doors. Before the next purchase, build or reward, there is a simpler problem: which door leads to the evening the returning player wants?",
      "This one case cannot stand in for a population. It can expose a question worth investigating. Ask returning players what they intend to do, watch how they interpret the available routes, and ask what they believe will happen to their character. Then look at where the session actually goes. A fast route into play may help; a fast route into the wrong activity can merely postpone the confusion.",
      "The wider literature gives us reason to keep experience beside behavior. Ballou and colleagues’ 2025 study combined Nintendo play records with surveys from 703 casually engaged US adults. Their estimates did not establish a relationship between hours played and well-being, but were too uncertain to demonstrate its absence. Players’ assessments of how gaming fitted into their lives were associated with well-being. The study is observational and its population specific; it supports asking richer questions, without proving a particular design will improve anyone’s life.",
      "For a studio, those questions coexist with commercial ones. How much did the feature cost to make and maintain? Did it create purchases? Who used it, who left and who never understood the offer? A design can help one group while making another group’s evening worse. A single aggregate makes the bookkeeping simpler by concealing the disagreement we need to examine.",
      "Controlled experiments can help determine whether a particular change caused a measured difference. They require sound assignment, measurement and interpretation. Microsoft’s research on long-running experiments warns about selection, survivorship and changing populations over time; simply leaving a test running does not settle those problems. An increase in the chosen outcome also needs a reason to count as improvement. The experiment estimates an effect. The team remains responsible for deciding which effects it values.",
      "Consider testing a clearer returning-player screen. Define the desired result before launch: players can identify an appropriate realm and activity, understand what persists, and begin the session they intended. Observe mistakes as well as speed. Follow satisfaction as well as return visits. Check revenue and support cost without making either stand in for the other questions. These proposed measures describe one design problem closely enough that a disappointing result could teach us what to change.",
      "The deck began with the requests a business model makes of a player. It ends with what that player can carry away: a skill, an object, a friendship, a memory, perhaps the wish to return. Funding those experiences is necessary work. So is noticing when the machinery asks for more than it gives back. funduck does not need to become a perfect retention event. He needs a route into an evening worth having.",
    ],
    takeaway:
      "Define the experience the business intends to sustain, then measure whether the design delivers it.",
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
        credit: "Blizzard · owner-provided handoff capture",
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
      visual.screenshot,
      ...(chapter.figures ?? []).filter(
        (figure) => figure.asset !== visual.screenshot.asset,
      ),
    ],
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
