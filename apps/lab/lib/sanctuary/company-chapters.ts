import type { Chapter, EvidenceSource } from "./types";

export const companySources: EvidenceSource[] = [
  {
    "id": "valve-cs2",
    "title": "Valve — Counter-Strike 2: franchise continuity and current offer",
    "url": "https://store.steampowered.com/app/730/CounterStrike_2/",
    "note": "Describes more than two decades of Counter-Strike. Current offer is free to play with paid Prime Status; this does not establish that one unchanged game or payment model survived all that time."
  },
  {
    "id": "valve-half-life25",
    "title": "Valve — Half-Life 25th anniversary update, 2023",
    "url": "https://www.half-life.com/en/halflife/25th",
    "note": "New multiplayer maps, Steam networking, restored CD extras and Steam Deck support document continuing work on the 1998 game."
  },
  {
    "id": "rockstar-credits",
    "title": "Steam — Grand Theft Auto V Legacy, developer and publisher credits",
    "url": "https://store.steampowered.com/app/271590/",
    "note": "The original PC release credits Rockstar North and Rockstar Games separately. The current page also markets GTA Online content; it is not an archive of the 2013 launch."
  },
  {
    "id": "take-two-labels",
    "title": "Take-Two — FY2025 annual report, Rockstar Games publishing label",
    "url": "https://ir.take2games.com/static-files/1e8d3004-75ab-48d7-b705-7b44fe45694e",
    "note": "Identifies Rockstar as an owned publishing label, mainly internal development, and a strategy combining durable releases with ongoing offers. No private studio budget or royalty split is inferred."
  },
  {
    "id": "rockstar-launch",
    "title": "Rockstar — GTA V launch announcement, 17 September 2013",
    "url": "https://ir.take2games.com/static-files/dd93d264-3d54-404a-ab30-bc6c0fa07ed2",
    "note": "Original console launch and the announced 1 October GTA Online launch. These dates are distinct from the 2015 PC release."
  },
  {
    "id": "cdpr-business",
    "title": "CD PROJEKT RED — core business",
    "url": "https://www.cdprojekt.com/en/core-business/",
    "note": "Identifies development and publishing within CD PROJEKT RED; combining roles does not remove either function."
  },
  {
    "id": "valve-history",
    "title": "Valve — 2012 employee handbook, timeline, PDF pp. 15–17",
    "url": "https://media.steampowered.com/apps/valve/Valve_Handbook_LowRes.pdf",
    "note": "Company account of TeamFortress acquisition, Steam release and third-party expansion. The current Steam listing’s publisher field should not be read as the original 1998 retail arrangement."
  },
  {
    "id": "valve-about",
    "title": "Valve — games, Steam and hardware",
    "url": "https://www.valvesoftware.com/en/about",
    "note": "Company description of three businesses. It does not disclose their profits or justify attributing acquisitions to a particular cash source."
  },
  {
    "id": "valve-half-life",
    "title": "Valve — Half-Life official Steam listing",
    "url": "https://store.steampowered.com/app/70/HalfLife/",
    "note": "Introduces Valve’s 1998 debut game; the screenshot is from the currently supplied gallery, not a dated launch capture."
  },
  {
    "id": "epic-about",
    "title": "Epic Games — company overview",
    "url": "https://www.epicgames.com/site/en-US/about",
    "note": "Games, engine technology and services are separate products even when supplied by one company."
  },
  {
    "id": "epic-store-history",
    "title": "Epic Games Store — 2022 review",
    "url": "https://store.epicgames.com/en-US/news/epic-games-store-2022-year-in-review",
    "note": "Dates the store’s launch to 2018; no historical store terms are presented as current."
  },
  {
    "id": "epic-store-2025",
    "title": "Epic Games Store — 2025 review, published 3 February 2026",
    "url": "https://store.epicgames.com/news/epic-games-store-2025-year-in-review?lang=en-US",
    "note": "Reports $1.16bn total and $400m third-party PC consumer spend, inclusive of tax. Excludes developer-processed in-game purchases. These are not Epic revenue or profit."
  },
  {
    "id": "epic-store-terms",
    "title": "Epic — store revenue-share change, 3 June 2025",
    "url": "https://store.epicgames.com/en-US/news/epic-games-store-updates-revenue-share-keep-100-of-the-first-1m-per-product-per-year",
    "note": "Standard store terms: first $1m annual net revenue per product at 100% developer share, then 88/12. Separate optional programs and engine agreements can alter the applicable terms."
  },
  {
    "id": "epic-engine-license",
    "title": "Epic — Unreal Engine licensing, accessed 6 October 2026",
    "url": "https://www.unrealengine.com/license",
    "note": "Engine royalties and store distribution fees have different bases and conditions. No blanket combined percentage is inferred."
  },
  {
    "id": "epic-psyonix",
    "title": "Psyonix — joining Epic, 1 May 2019",
    "url": "https://www.rocketleague.com/en/news/psyonix-is-joining-the-epic-family-",
    "note": "Contemporaneous acquisition announcement and the developer’s expectations. Does not disclose the funding source for the acquisition."
  },
  {
    "id": "valve-deck-software",
    "title": "Valve — Steam Deck software and the existing Steam library",
    "url": "https://www.steamdeck.com/en/software",
    "note": "Checked 8 October 2026. Documents SteamOS, the existing account/library and the integrated store. The mutual commercial value of library and device is our analysis, not a disclosed hardware margin or measured sales effect."
  },
  {
    "id": "valve-deck-verified",
    "title": "Valve — Deck Verified compatibility review",
    "url": "https://www.steamdeck.com/en/verified",
    "note": "Controls, display, launch experience and software support are reviewed. Library visibility does not guarantee every purchased game runs on Deck."
  },
  {
    "id": "valve-deck-faq",
    "title": "Valve — Steam Deck FAQ",
    "url": "https://www.steamdeck.com/en/faq",
    "note": "Confirms support for non-Steam games; integration with Steam is not exclusive access to software from that store."
  },
  {
    "id": "valve-catalog",
    "title": "Valve — Steam developer catalog",
    "url": "https://store.steampowered.com/search/?developer=Valve",
    "note": "Developer-credit inventory checked 8 October 2026 against individual store records. Distinct releases, episodes and playable shorts are listed; bundles, soundtracks, routine updates, benchmark tools and cancelled projects are not additional games. Community collaborations and unreleased Deadlock are separate. Historical launch announcements take precedence over later package dates."
  },
  {
    "id": "valve-deadlock",
    "title": "Valve — Deadlock development status",
    "url": "https://store.steampowered.com/app/1422450/",
    "note": "Checked 8 October 2026: early development, limited friend-invite playtest, release date to be announced."
  },
  {
    "id": "epic-unreal-origin",
    "title": "GT Interactive / Epic / Digital Extremes — Unreal goes gold, 19 May 1998",
    "url": "https://www.zx.net.nz/mirror/www.unreal.com/press/unreal_gold_pr.html",
    "note": "Archived mirror of the original publisher announcement. Credits Epic MegaGames and Digital Extremes and dates the 1998 release; not a current sales offer."
  },
  {
    "id": "epic-unreal-tools",
    "title": "Tim Sweeney — Welcome to Unreal Engine 4, 2014",
    "url": "https://www.unrealengine.com/blog/welcome-to-unreal-engine-4?lang=en-US",
    "note": "Epic founder explains offering the engine, tools and source access to other creators. Historical commercial terms are not used as current pricing."
  },
  {
    "id": "gta-origin",
    "title": "Take-Two — FY1999 annual report, original GTA release",
    "url": "https://ir.take2games.com/static-files/863edafe-3083-474b-935c-265b19554be6",
    "note": "Release table lists Grand Theft Auto in November 1997 internationally. Used for the series origin, not a claim that the Rockstar label existed at its first release or that all three companies were founded together."
  },
  {
    "id": "rockstar-red-dead",
    "title": "Rockstar — Red Dead Redemption 2 official store listing",
    "url": "https://store.steampowered.com/app/1174180/",
    "note": "Identifies Rockstar’s western setting, outlaw story and online world. The comparison of theme and repeated actions is our critical reading, not a measured retention mechanism."
  }
];

export const companyChapters: Omit<Chapter,"visual">[] = [
  {
    "id": "valve-platform",
    "part": 0,
    "title": "Valve: the studio becomes the store",
    "lede": "A maker of boxed PC games became part of the machinery through which other games reach their buyers.",
    "paragraphs": [
      "Valve released its first game, Half-Life, in 1998. Nearly three decades later, it still makes games, but it also operates a store through which thousands of other creators reach their audience. That expansion gives us another way to understand the economics of creative work: a company can build its future around selling the next work, or around helping many others sell theirs. Valve’s history brings us from the boxed PC game to the library, community and marketplace that grew around it.",
      "Half-Life put the player inside a research facility after an experiment goes wrong. It was a PC game with a story to follow and multiplayer matches to return to. Valve came from the world of retail software: when Half-Life 2 arrived in 2004, it was sold both in shops and through the company’s new online service, Steam.",
      "The audience could outlive the release by decades. Counter-Strike grew out of the community modifying Half-Life and became a game built around repeated team matches. Its continuing series gives returning players familiar objectives and opponents who make each round different. Half-Life itself received new multiplayer maps in its 25th-anniversary update. A purchased game could become a lasting gathering place; that did not make every visit another sale.",
      "Serving that audience created work beyond designing the next game. Valve’s history describes Steam as tools and services originally built for its own titles, including Half-Life and Counter-Strike. Steam launched in 2003; third-party commercial releases followed in 2005. The important expansion was in who could use the service. Infrastructure around Valve’s games became a route to market for other developers.",
      "At the checkout, Valve now had two different relationships with players. A sale of its own game paid for work it had made. A sale of another publisher’s game paid for distribution through Steam, with the store collecting the money and settling with its partner under their agreement. The developer, publisher and store could remain separate businesses. Valve did not have to acquire a studio to become part of its commercial life.",
      "For the buyer, Steam also became the place where purchases accumulated: a library, updates, friends and the next game to consider. Developers encountered the other side of that gathering—people they hoped would discover their work. Recommendations and discovery tools help connect those interests. Valve says it does not sell paid advertising placement in the Steam store; appearing there should not automatically be treated as an advertising purchase.",
      "The games business continued alongside the store. Counter-Strike 2 is free to play and sells a Prime Status upgrade, so the franchise’s longevity is not a story of one unchanged box sale lasting forever.",
      "Valve also began making some of the equipment. Steam Controller and Steam Link explored ways to play PC games away from a conventional desk setup. Steam Deck takes another step: it is a handheld PC with the controls, screen and computer in one device. Players sign into their existing Steam account and find the library they have already built. Compatible games can travel with them without another purchase of the same title.",
      "That gives past purchases a new significance. A library accumulated over years can help make a new device worth buying; the device gives those games another place to be played and the store another place to sell. Valve now shapes the machine, its SteamOS operating system and the shop inside it. The hardware also brings work around games Valve did not create: its Deck Verified program checks controls, display and software compatibility. Steam remains the built-in store, but the device can run non-Steam games too.",
      "Valve’s expansion connects three products that can support one another: games people want, a store where their libraries grow, and equipment on which to enjoy them. NVIDIA can supply the computer without taking over the Steam sale; Valve can also supply its own computer. A developer has gained several ways to participate in the lives of other developers’ games. Epic took another route out of the same era: the technology behind a game became something other studios could build with."
    ],
    "sections": [
      {
        "at": 4,
        "title": "The customer on each side of the store"
      },
      {
        "at": 6,
        "title": "The old business keeps changing"
      },
      {
        "at": 7,
        "title": "Selling the machine, too"
      }
    ],
    "paragraphCitations": {
      "0": [
        "valve-history",
        "valve-about"
      ],
      "1": [
        "valve-half-life",
        "valve-history"
      ],
      "2": [
        "valve-history",
        "valve-cs2",
        "valve-half-life25"
      ],
      "3": [
        "valve-history"
      ],
      "4": [
        "steam-settlement"
      ],
      "5": [
        "steam-discovery",
        "valve-about"
      ],
      "6": [
        "valve-cs2",
        "valve-about"
      ],
      "7": [
        "valve-about",
        "valve-deck-software",
        "valve-deck-verified"
      ],
      "8": [
        "valve-deck-software",
        "valve-deck-verified",
        "valve-deck-faq"
      ],
      "9": [
        "steam-cloud",
        "valve-deck-software",
        "epic-unreal-tools"
      ]
    },
    "sources": [
      "valve-half-life",
      "valve-history",
      "valve-cs2",
      "valve-half-life25",
      "steam-settlement",
      "steam-discovery",
      "valve-about",
      "steam-cloud",
      "valve-deck-software",
      "valve-deck-verified",
      "valve-deck-faq",
      "valve-catalog",
      "valve-deadlock",
      "epic-unreal-tools"
    ],
    "figures": [
      {
        "asset": "valve-half-life",
        "alt": "Half-Life combat inside an industrial research facility",
        "caption": "Half-Life, Valve’s 1998 debut. Its later anniversary update added multiplayer maps and support for the company’s own handheld PC.",
        "credit": "Valve",
        "afterParagraph": 0
      },
      {
        "asset": "counter-strike-menu",
        "alt": "Counter-Strike 1.6 main menu with New Game, Find Servers and Steam branding",
        "label": "Counter-Strike 1.6 · Windows",
        "caption": "Find Servers takes the player toward another match, rather than another chapter in a campaign. The Steam mark is already present in this 1.6 menu: this is the original Counter-Strike, not a pre-Steam capture.",
        "credit": "Valve Corporation · Yearman / MobyGames",
        "presentation": "pixels",
        "afterParagraph": 2,
        "details": [
          {
            "label": "Find Servers",
            "text": "The invitation is to join a running match. The people and servers available become part of what lets the same game remain a place to return to.",
            "rect": [
              2,
              74,
              28,
              6
            ]
          },
          {
            "label": "Steam is already here",
            "text": "The Steam mark dates the context of this image: Counter-Strike 1.6 belongs to the service’s early era. It cannot illustrate the earlier, pre-Steam menu unchanged.",
            "rect": [
              79,
              88,
              20,
              9
            ]
          }
        ]
      },
      {
        "asset": "valve-wordmark",
        "alt": "Valve company wordmark",
        "label": "The company",
        "caption": "Valve · the maker behind Half-Life and Counter-Strike.",
        "credit": "Valve Corporation",
        "presentation": "identity",
        "placement": "identity"
      },
      {
        "asset": "steam-symbol",
        "alt": "Steam service symbol",
        "label": "Its distribution service",
        "caption": "Steam® · a store and library for games from many makers.",
        "credit": "Valve Corporation",
        "presentation": "identity",
        "placement": "identity"
      }
    ],
    "evidence": "Valve’s handbook records the retail/Steam overlap for Half-Life 2, services built for its own games, Steam’s 2003 release and third-party expansion in 2005. Counter-Strike’s continuing franchise and Half-Life’s anniversary support establish longevity, not a claim that Valve outlasted every competing shooter or that its business model stayed unchanged. The economic reading is ours. No profit estimate, acquisition-funding claim or private distribution commission is inferred. Steam Deck is a worked hardware example, not a complete hardware history. The library/device relationship is an economic interpretation; no sales uplift, subsidy, margin or exclusive-store requirement is claimed. Existing library membership does not establish universal Deck compatibility. The developer panel distinguishes released games, community collaborations and an unreleased playtest."
  },
  {
    "id": "epic-infrastructure",
    "part": 0,
    "title": "Epic: the studio becomes the engine",
    "lede": "A game can leave behind more than a world people want to revisit. Its makers may have built tools that other worlds need.",
    "paragraphs": [
      "Unreal arrived in 1998, the same year as Half-Life. Epic MegaGames, now Epic Games, developed it with Digital Extremes. The first-person action game took players into an alien world; the software behind it gave its creators a way to construct and run that world. Unreal even shipped with a level editor, inviting players to make spaces of their own. The game and its tools already offered different reasons to open the box.",
      "An engine is part machinery, part workshop. It handles jobs such as drawing a scene and responding to the player, while its editing tools help a team assemble characters, spaces and events. Reusing that foundation lets a studio begin further along. In 2014, Epic made Unreal Engine 4, its editor and the underlying source code available through a public subscription. Another team could work with technology used in Epic’s own productions, adapting it to ambitions Epic had never planned.",
      "Fortnite shows how making the tools and using them can reinforce each other. Epic’s online game allows players to build and destroy structures: lighting must respond as the world changes, and the action must remain smooth. For its December 2022 chapter, the team put new Unreal Engine features through those production demands. Epic’s engineers describe improvements to lighting, shadows and world-building tools that became available to other developers. The work of maintaining one game could improve the starting point for many more.",
      "That makes the next customer a studio with a production to finish. It may spend years learning the tools, training staff and building material around them. Unreal’s standard game license generally charges a 5% royalty on attributable lifetime gross product revenue above US$1 million, with exclusions and other programs that can change the obligation. Epic-store sales are exempt from that engine royalty. A new world built by someone else can therefore support the company that supplied its machinery. Useful technology becomes an ongoing responsibility: other people’s schedules, budgets and creative decisions now depend on it.",
      "Epic later expanded toward the audience too. Its store opened in 2018; its publishing operation, announced in 2020, offered funding and release support for selected projects. That publishing offer left the intellectual property with developers and promised them at least half the profit after costs were recovered. A studio could use Epic’s engine, sell through its store or accept its publishing investment. Each involved a different contribution to the work and a different agreement about its proceeds.",
      "These relationships also give Epic several ways to compete for a developer’s business. Its store terms changed in June 2025: developers kept the first $1 million in annual net revenue per product processed through Epic’s payments, before the standard 88/12 split applied. Engine licensing has its own revenue basis and exclusions. A favorable store offer can influence where a game is sold; an engine decision reaches much further back, into how the game will be made.",
      "The store’s results need to be read on those terms. Epic reported $1.16 billion in PC consumer spending in 2025, including $400 million on third-party games. These figures include taxes and exclude in-game purchases handled by developers’ own payment systems. They show spending through a particular channel, rather than Epic’s revenue or profit. The third-party portion helps us examine the store’s role in selling other creators’ work; it cannot tell us how the engine business performed.",
      "Epic now also supplies web shops that developers can use to sell under their own games’ identities. Its presence can sit behind both the world and the checkout. This is one route from making a successful game to supporting many other people’s creative businesses. Our next example follows the value that remains attached to a particular world: the characters, places and expectations an audience carries from one release to the next. Rockstar has made that accumulated attachment central to some of gaming’s longest-lived franchises."
    ],
    "sections": [
      {
        "at": 2,
        "title": "The game tests the machinery"
      },
      {
        "at": 4,
        "title": "From making the world to selling it"
      },
      {
        "at": 6,
        "title": "What the store’s numbers can show"
      }
    ],
    "paragraphCitations": {
      "0": [
        "epic-unreal-origin"
      ],
      "1": [
        "epic-unreal-tools"
      ],
      "2": [
        "epic-fortnite-engine"
      ],
      "3": [
        "epic-engine-license"
      ],
      "4": [
        "epic-store-history",
        "epic-publishing"
      ],
      "5": [
        "epic-store-terms",
        "epic-engine-license"
      ],
      "6": [
        "epic-store-2025"
      ],
      "7": [
        "epic-store-2025"
      ]
    },
    "sources": [
      "epic-unreal-origin",
      "epic-unreal-tools",
      "epic-fortnite-engine",
      "epic-engine-license",
      "epic-store-history",
      "epic-publishing",
      "epic-store-terms",
      "epic-store-2025"
    ],
    "figures": [
      {
        "asset": "epic-web-shop",
        "alt": "Epic’s official web-shop mockup on desktop and phone",
        "caption": "Epic’s web-shop mockup: the infrastructure supplier can sit behind another game’s storefront. This is a promotional interface illustration, not a record of a completed purchase.",
        "credit": "Epic Games",
        "afterParagraph": 7
      }
    ],
    "evidence": "The 1998 launch announcement credits Epic MegaGames and Digital Extremes and describes the included level editor. Engine access in 2014 is a historical subscription offer, not current pricing. The Fortnite example concerns its December 2022 release and Epic’s January 2023 technical account; particular visual features depended on platform support. The longer-term dependence of studios on their tools is our production-economics interpretation. Publishing terms are the 2020 public offer; store terms are the June 2025 standard-terms announcement. Engine royalties and store distribution charges have different bases, exclusions and optional programs. The chart reports 2025 consumer spending, inclusive of tax, not revenue, profit or overall company performance. The comparison establishes several businesses built around creative work; it does not rank Valve and Epic, infer funding sources or declare Epic a failed company.",
    "exhibits": [
      {
        "afterParagraph": 6,
        "kind": "epic-spending"
      }
    ]
  },
  {
    "id": "rockstar-world",
    "part": 0,
    "title": "Rockstar: worlds built to last",
    "lede": "A recognizable world can give players reasons to return and a studio something to build on for decades.",
    "paragraphs": [
      "Grand Theft Auto arrived in 1997, a year before Half-Life and Unreal. The series that became central to Rockstar belongs to the same generation of games, yet it points toward a different way of building a durable business. Valve made a route to other studios’ audiences. Epic supplied tools for creating their worlds. Rockstar built franchises around worlds and ways of playing that an audience could recognize from one release to the next.",
      "In Grand Theft Auto, the city and the repeated actions make sense together: drive across town, take a criminal job, earn money, escape the police, then choose what to do next. That recurring pattern is a core loop. The setting gives the actions a meaning; the actions let the player do more than look at the setting. A written mission can direct the evening, while traffic, pursuit and the freedom to take a detour allow it to unfold differently. Our argument is that the franchise’s identity lives in that combination, as much as in a name or a cast of characters.",
      "Grand Theft Auto V brought that combination to a fictional Southern California and a story following three criminals. Its original console release arrived on 17 September 2013. GTA Online followed on 1 October, with access included in that launch offer. The same release invited players to follow a story and to share an online setting. Those were different ways to use the world Rockstar had built; neither required abandoning its recognizable theme and actions.",
      "A franchise can carry an audience from one release to the next. An ongoing online game adds a different possibility: produce new occasions inside a world people already know. Take-Two’s FY2025 report describes Rockstar’s strategy in terms of long-lived titles and further opportunities through virtual currency, add-on content and in-game purchases. The creative continuity and the commercial continuity can support each other, but they are not identical. Someone replaying a favorite mission has returned without necessarily buying anything.",
      "Red Dead Redemption develops a different promise through the American western: travel, hunting, conflict and the life of an outlaw give its landscapes a particular character. The point is not that every successful franchise should repeat GTA’s formula. It is that a world becomes distinctive through what people do there, how those actions feel and the stories they make possible. Building on that identity can mean another complete game, an online extension or new material for an existing release. Each asks for further production and a way to pay for it.",
      "These companies have not simply survived by selling the same thing for longer. Games helped Valve build a store, helped Epic build a tools business, and helped Rockstar build enduring franchises and continuing worlds. All three still make games; their accumulated work now supports different kinds of future production. The question now comes back to the world a player enters: what will its creators keep making, and what will the player be asked to buy next? Blizzard’s Diablo IV and Larian’s Baldur’s Gate 3 put two different answers beside each other."
    ],
    "sections": [
      {
        "at": 1,
        "title": "A world expressed through play"
      },
      {
        "at": 3,
        "title": "What carries from one release to the next"
      }
    ],
    "paragraphCitations": {
      "0": [
        "gta-origin",
        "valve-history",
        "epic-unreal-origin"
      ],
      "1": [
        "rockstar-credits"
      ],
      "2": [
        "rockstar-launch"
      ],
      "3": [
        "take-two-labels"
      ],
      "4": [
        "rockstar-red-dead"
      ],
      "5": [
        "valve-about",
        "epic-about",
        "take-two-labels"
      ]
    },
    "sources": [
      "rockstar-credits",
      "rockstar-launch",
      "take-two-labels",
      "gta-origin",
      "valve-history",
      "epic-unreal-origin",
      "rockstar-red-dead",
      "valve-about",
      "epic-about"
    ],
    "figures": [
      {
        "asset": "rockstar-los-santos",
        "alt": "GTA Online Doomsday Heist promotional image with flying vehicles and an aircraft",
        "caption": "The Doomsday Heist gives an existing world another spectacle and another reason to gather. This official GTA Online promotional frame is a later addition, not an image of the 2013 campaign launch.",
        "credit": "Rockstar Games / Take-Two Interactive",
        "afterParagraph": 2
      }
    ],
    "evidence": "The 1997 GTA origin, 1998 Half-Life/Unreal releases, 2013 GTA V/Online launch and Take-Two’s FY2025 strategy are sourced separately. These are franchise milestones, not identical company founding dates. The links between theme, recurring actions and franchise identity are our critical interpretation, not measured causes of retention or revenue. Repeated play is not assumed to produce repeated payment. The three company chapters compare business emphases; each company has multiple activities."
  }
];
