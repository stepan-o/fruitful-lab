import type { Chapter, EvidenceSource } from "./types";

export const companySources: EvidenceSource[] = [
  {"id": "valve-deck-booklet", "title": "Valve — Steam Deck booklet, August 2022, printed pp. 10–11 and 26–29", "url": "https://cdn.cloudflare.steamstatic.com/steamdeck/images/press/book/steamDeck_booklet_EN.pdf", "note": "Valve’s retrospective explains unreliable update distribution, the need for matching multiplayer versions and Steam’s 2003 launch. Its hardware history connects Steam Input and the Steam Machines/Proton work to Deck. Historical claims are attributed to Valve; its 2022 audience counts and then-future promises are not used as current facts."},
  {"id": "steam-visibility", "title": "Valve — Visibility on Steam, checked 8 October 2026", "url": "https://partner.steamgames.com/doc/marketing/visibility", "note": "Official description of launch visibility, recommendation and sales/interest signals. Describes Valve’s stated system, not an independent audit, a guarantee of discovery or a measure of fairness."},
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
    "note": "Company account of TeamFortress acquisition, Steam release and third-party expansion; printed pp. 12–13 discuss measurement and customer communication. The current Steam listing’s publisher field should not be read as the original 1998 retail arrangement."
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
    "note": "Identifies Valve’s 1998 debut game. The promotional capsule is the currently supplied store artwork, not an archival scan of the launch box."
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
    "lede": "Steam began by delivering updates. Selling games changed whose success Valve could earn from.",
    "paragraphs": [
      "In 2002, Valve had a practical problem: its multiplayer games required players to use the same software version, but getting updates to everyone was unreliable. This was the studio behind Half-Life, released in 1998, and Counter-Strike, which had grown from a community-made modification of it. People wanted to keep playing. Valve needed a dependable way to keep their games working together. Its answer was Steam, launched in 2003 with automatic updates.",
      "The same connection could deliver a new game as well as a repair. Half-Life 2 went on sale through Steam and in shops in 2004; the first third-party games arrived on Steam in 2005. Valve had built another route to the customer, then offered it to other studios. In 2008, it opened the platform’s business and technical tools to developers through Steamworks. Selling through the service also meant being able to maintain a game through it.",
      "That changed Valve’s interest in somebody else’s next release. On a Steam sale, Valve collects the payment and pays the selling partner its agreed share after adjustments such as refunds and taxes. A player can finish one studio’s game and buy another studio’s game while remaining Valve’s customer. The store earns across those transitions. Its commercial relationship can continue even when the individual works it sells have endings.",
      "For players, those separate purchases accumulate into a library alongside friends, saved progress and familiar ways to install and update games. For a developer, the same service offers an audience already equipped to buy and play. Each side makes the other more valuable: more games give players reasons to use Steam; more prospective buyers give developers reasons to release there. A competing shop must persuade people to add another destination to habits and collections they have already built.",
      "Reaching the store is only part of reaching that audience. Steam’s recommendations, wishlists and release lists influence which games people encounter. Valve says it does not sell advertising placement there. Its visibility documentation instead describes exposure responding to player interest and sales. A developer gains distribution and still has to win attention; the platform’s decisions about what to show become part of that developer’s route to a customer.",
      "Valve also gained a way to observe what happened after release. Its 2012 handbook calls Steam “a conduit for constant communication between us and them,” referring to its customers, and describes testing assumptions about pricing, marketing and player behavior. Updates and offers could be changed and their results examined through the same service. The distributor was now involved in an ongoing process of learning how to sell and support the work.",
      "The move into hardware extended that relationship. Steam Deck, released in 2022, is a handheld PC that opens a player’s existing Steam library. The difficult part was making that library usable on a new kind of machine. Valve credits its earlier Steam Controller work with helping PC games accept handheld controls, and its Steam Machines project with lessons that led to Proton: software that lets many Windows games run on Linux, the foundation of SteamOS.",
      "A buyer therefore does not start with an empty shelf. Compatible games already purchased can help justify buying the device; the device supplies another place to use the library and shop for additions. That is our economic reading of the combination. Compatibility still requires work—Valve’s Deck Verified program checks it—and the machine can run non-Steam games. Valve combines hardware and distribution without making its store the only permitted source of software.",
      "It can also remain the store when somebody else supplies the machine. With supported Steam purchases played through GeForce NOW, NVIDIA runs the remote computer while Steam’s publisher payouts remain unchanged. Valve can participate in the sale without owning the hardware or making the game. That is the turn its history brings into view: work first undertaken around its own releases became a service for other creators. Epic would build a substantial business further upstream, supplying the engine with which those creators make their games."
    ],
    "sections": [
      {
        "at": 2,
        "title": "The next sale can belong to another studio"
      },
      {
        "at": 6,
        "title": "A machine for the library"
      }
    ],
    "paragraphCitations": {
      "0": [
        "valve-deck-booklet",
        "valve-history"
      ],
      "1": [
        "valve-history"
      ],
      "2": [
        "steam-settlement"
      ],
      "3": [
        "valve-deck-software",
        "valve-about"
      ],
      "4": [
        "steam-discovery",
        "steam-visibility"
      ],
      "5": [
        "valve-history"
      ],
      "6": [
        "valve-deck-booklet"
      ],
      "7": [
        "valve-deck-software",
        "valve-deck-verified",
        "valve-deck-faq"
      ],
      "8": [
        "steam-cloud",
        "epic-unreal-tools"
      ]
    },
    "sources": [
      "valve-half-life",
      "valve-catalog",
      "valve-deadlock",
      "valve-deck-booklet",
      "valve-history",
      "steam-settlement",
      "valve-deck-software",
      "valve-about",
      "steam-discovery",
      "steam-visibility",
      "valve-deck-verified",
      "valve-deck-faq",
      "steam-cloud",
      "epic-unreal-tools"
    ],
    "figures": [
      {
        "asset": "half-life-promo",
        "alt": "Official Half-Life promotional artwork with its lambda logo, title and Gordon Freeman",
        "caption": "Half-Life’s official store artwork. The first release preceded Steam by five years; its sequel was sold through Steam as well as retail shops.",
        "credit": "Valve Corporation",
        "afterParagraph": 0,
        "label": "Half-Life · Valve’s first release · 1998"
      },
      {
        "asset": "counter-strike-menu",
        "alt": "Counter-Strike 1.6 main menu with New Game, Find Servers and Steam branding",
        "label": "Counter-Strike 1.6 · Windows",
        "caption": "Counter-Strike 1.6’s menu places Find Servers and Steam in the same frame: reaching the next match already involved services around the game. This is a 1.6 capture, not the earlier pre-Steam interface.",
        "credit": "Valve Corporation · Yearman / MobyGames",
        "presentation": "pixels",
        "afterParagraph": 1,
        "details": [
          {
            "label": "Find Servers",
            "text": "A server hosts a multiplayer match. Finding one with compatible software is part of making an installed game playable with other people.",
            "rect": [
              2,
              74,
              28,
              6
            ]
          },
          {
            "label": "Steam is already here",
            "text": "The service appears inside the game’s familiar front door. Version 1.6 belongs to Steam’s early period; this capture was uploaded in 2011.",
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
    "evidence": "Valve’s 2022 Steam Deck booklet supplies its account of the update-distribution problem, Steam’s launch and the hardware projects leading to Steam Deck. The 2012 handbook dates Half-Life, Steam, third-party releases and Steamworks, and provides the short communication quotation in the context of measurement and testing. These are Valve’s accounts, not independent causal evaluations. The library’s value to players, the mutual appeal of creators and audiences, and the commercial logic of compatible hardware are our analysis; no switching-cost estimate, sales uplift, market share, profit or private commission is claimed. Steam’s payment documentation establishes revenue sharing, not a commission on every item in a library. The visibility account describes Valve’s stated system and does not establish equal exposure or a guarantee of success. Deck compatibility is title-dependent; non-Steam software is allowed. Cloud Play requires supported games and publisher participation. The developer catalog distinguishes releases, collaborations and an unreleased playtest. No game-plot summary or claim that Valve stopped making games is used to explain the business transition."
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
