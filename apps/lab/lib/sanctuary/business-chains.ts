/** Primary-source comparison, checked 5 October 2026. No private rates inferred. */
export type ChainCell = { text:string; sources:string[] };
export type ChainModel = { id:string; label:string; example:string; tag:string; group:string; cells:ChainCell[]; stays:string; changes:string; boundary:string };
export type ChainSource = { id:string; title:string; url:string; note:string };
export type ChainPhase = { id:string; label:string; columns:string[]; fields:number[]; note:string };
export const chainSources: Record<string,ChainSource> = {
  "gauntlet": {
    "id": "gauntlet",
    "title": "Ed Logg · Gauntlet postmortem (2012)",
    "url": "https://media.gdcvault.com/gdc2012/slides/Design%20Track/Logg_Ed_Gauntlet_Postmortem.pdf",
    "note": "Cabinet sales, coin collections and design decisions. A retrospective, not a ledger of one venue."
  },
  "route": {
    "id": "route",
    "title": "Betson · Owning equipment and route operators",
    "url": "https://www.betson.com/are-arcades-profitable/",
    "note": "Explains owner-operated and revenue-share arrangements. Current practice; not evidence of a particular 1985 contract."
  },
  "meter": {
    "id": "meter",
    "title": "Play Meter · Operator survey, 1 November 1984, p. 42",
    "url": "https://elibrary.arcade-museum.com/magazines/pm/PlayMeter-1984-11-01/PlayMeter-1984-11-01-042.pdf",
    "note": "Contemporary evidence of commission splits between operators and locations."
  },
  "dune": {
    "id": "dune",
    "title": "Legendary · Dune: Part Two production announcement",
    "url": "https://www.legendary.com/warner-bros-pictures-and-legendary-pictures-return-to-arrakis-for-denis-villeneuves-dune-part-two/",
    "note": "Production credits and source novel. The announcement’s planned release date is not used as the eventual release date."
  },
  "wb": {
    "id": "wb",
    "title": "Warner Bros. · Dune: Part Two campaign materials",
    "url": "https://wbpinewmedia.warnerbros.com/duneparttwo/index.html",
    "note": "Documents the distributor’s trailer, social and advertising campaign; no campaign spend is inferred."
  },
  "amc": {
    "id": "amc",
    "title": "AMC · 2025 annual report",
    "url": "https://investor.amctheatres.com/sec-filings/all-sec-filings/content/0001411579-26-000016/amc-20251231x10k.htm",
    "note": "Exhibitor admissions, film-rental settlement, concessions and advertising. Describes the exhibition model, not Dune’s private settlement."
  },
  "stranger": {
    "id": "stranger",
    "title": "Netflix · Stranger Things production and promotion",
    "url": "https://about.netflix.com/en/news/netflix-opens-the-rift-to-a-treasure-trove-of-all-new-stranger-things-must-haves",
    "note": "Duffer Brothers, Upside Down Pictures and 21 Laps credits; publicity and brand collaborations."
  },
  "netflix": {
    "id": "netflix",
    "title": "Netflix · Investor questions",
    "url": "https://ir.netflix.net/ir-overview/top-investor-questions/default.aspx",
    "note": "Commissions, owned and licensed work, subscriptions and advertising. Individual production contracts are not disclosed here."
  },
  "recommend": {
    "id": "recommend",
    "title": "Netflix · How recommendations work",
    "url": "https://help.netflix.com/en/node/100639/",
    "note": "Personalized discovery inside the service; not a claim that producers pay for placement."
  },
  "steam-bg3": {
    "id": "steam-bg3",
    "title": "Larian · Baldur’s Gate 3 on Steam",
    "url": "https://store.steampowered.com/app/1086940/Baldur_s_Gate_3/",
    "note": "Larian as developer/publisher, purchase and edition information, Dungeons & Dragons setting."
  },
  "hasbro": {
    "id": "hasbro",
    "title": "Hasbro · 2023 annual report",
    "url": "https://investor.hasbro.com/static-files/0e548540-ae0c-49a2-83ed-053cd009623a",
    "note": "Baldur’s Gate 3 contributes to digital licensing revenue. The Larian royalty rate is not asserted."
  },
  "steam-pay": {
    "id": "steam-pay",
    "title": "Valve · Reporting and payments",
    "url": "https://partner.steamgames.com/doc/finance/payments_salesreporting/faq",
    "note": "Monthly revenue-share payments after applicable adjustments, under the publisher’s agreement. No uniform commission is assumed."
  },
  "steam-reach": {
    "id": "steam-reach",
    "title": "Valve · Marketing tools",
    "url": "https://partner.steamgames.com/doc/marketing/tools",
    "note": "Store visibility is not sold as advertising space. External marketing and advertising are distinct channels."
  },
  "gfn-bg3": {
    "id": "gfn-bg3",
    "title": "NVIDIA · Baldur’s Gate 3, local or GeForce NOW",
    "url": "https://www.nvidia.com/en-us/geforce/news/baldurs-gate-3-and-even-more-dlss-games-this-august/",
    "note": "Confirms the same game can run locally or through GeForce NOW. Historical GPU performance claims are not reused."
  },
  "gfn": {
    "id": "gfn",
    "title": "NVIDIA · How to play on GeForce NOW",
    "url": "https://www.nvidia.com/en-us/geforce-now/how-to-play/",
    "note": "Membership and verification of game-store ownership are separate steps."
  },
  "gfn-plans": {
    "id": "gfn-plans",
    "title": "NVIDIA · GeForce NOW FAQ",
    "url": "https://www.nvidia.com/en-us/geforce-now/faq/",
    "note": "Free and paid options; this comparison selects a paid membership, without quoting prices or implying all cloud access is paid."
  },
  "ps-bg3": {
    "id": "ps-bg3",
    "title": "PlayStation Store · Baldur’s Gate 3",
    "url": "https://store.playstation.com/en-us/product/UP3526-PPSA14001_00-0507384846053057/",
    "note": "Larian’s PS5 edition; PS Plus for online multiplayer. A Premium trial is not the full game in a subscription catalog."
  },
  "sony": {
    "id": "sony",
    "title": "Sony · FY2025 Q3 supplemental information",
    "url": "https://www.sony.com/en/SonyInfo/IR/library/presen/er/pdf/25q3_supplement.pdf",
    "note": "Separates console hardware, digital software, add-ons and network-service revenue. Larian’s store settlement is not public here."
  },
  "diablo": {
    "id": "diablo",
    "title": "Xbox Store · Diablo IV",
    "url": "https://www.xbox.com/en-US/games/store/diablo-iv/9nqrcd3w41l3",
    "note": "Blizzard credits; purchase, Premium/Ultimate catalog inclusion, separate add-ons, required internet and Battle.net account. US listing checked 5 October 2026."
  },
  "xbox": {
    "id": "xbox",
    "title": "Xbox · Diablo IV, ways to play",
    "url": "https://www.xbox.com/en-US/games/diablo-iv",
    "note": "First-party promotion and purchase/subscription routes. Extra console multiplayer requirements remain distinct from owning the base game."
  },
  "microsoft": {
    "id": "microsoft",
    "title": "Microsoft · Acquisition completion and reporting",
    "url": "https://news.microsoft.com/source/2024/01/30/microsoft-cloud-strength-drives-second-quarter-results-4/",
    "note": "Acquisition completed 13 October 2023; Activision Blizzard results consolidated into Microsoft. Does not disclose per-title internal allocations."
  }
};
export const chainModels: ChainModel[] = [
  {
    "id": "arcade",
    "label": "Arcade machine",
    "example": "Gauntlet · route-operated cabinet",
    "tag": "A turn",
    "group": "screen",
    "cells": [
      {
        "text": "Atari Games’ team makes the game and cabinet. Production spending pays for development, components and manufacture; cabinet sales are the manufacturer’s product.",
        "sources": [
          "gauntlet"
        ]
      },
      {
        "text": "An operator buys the cabinet, directly or through a distributor, then places it in a venue. A bar that buys its own machine also takes the operator’s role.",
        "sources": [
          "gauntlet",
          "route"
        ]
      },
      {
        "text": "Atari’s sales material addresses cabinet buyers. Cabinet artwork, its screen and the surrounding venue address players. Trade promotion and attracting a customer to the room serve different buyers.",
        "sources": [
          "gauntlet"
        ]
      },
      {
        "text": "The operator maintains the machine; the venue supplies space, power and a place to gather. Their agreement determines responsibilities and the collection split.",
        "sources": [
          "route",
          "meter"
        ]
      },
      {
        "text": "Player → coin slot: money buys play or additional health. Bar customer → bar: drinks are a separate purchase. One person can make both payments.",
        "sources": [
          "gauntlet",
          "route"
        ]
      },
      {
        "text": "Collections → operator + venue under their agreement. Cabinet purchase → distributor/manufacturer. The manufacturer’s cabinet sale is distinct from the operator’s continuing coin income.",
        "sources": [
          "gauntlet",
          "meter"
        ]
      }
    ],
    "stays": "Creative work has to reach an audience through equipment and a place to use it.",
    "changes": "Payment can alter the current attempt; the cabinet buyer and the player are different customers.",
    "boundary": "Illustrative route arrangement. It does not claim that every arcade, or the Pong prototype’s tavern, used this contract."
  },
  {
    "id": "cinema",
    "label": "Cinema",
    "example": "Dune: Part Two · theatrical showing",
    "tag": "An admission",
    "group": "screen",
    "cells": [
      {
        "text": "Legendary / Warner Bros. assemble a production: Denis Villeneuve and a paid cast, crew and suppliers turn Frank Herbert’s novel into a film. Financing and rights precede ticket sales.",
        "sources": [
          "dune"
        ]
      },
      {
        "text": "Warner Bros. distributes the film. A cinema books exhibition rights for showings; it does not buy ownership of the film. The projector and building are separate investments.",
        "sources": [
          "dune",
          "amc"
        ]
      },
      {
        "text": "Distributor trailers, publicity and advertising promote the release; cinema listings sell a local showtime. Advertising channels can earn campaign fees without receiving a share of each ticket.",
        "sources": [
          "wb",
          "amc"
        ]
      },
      {
        "text": "The exhibitor operates the auditorium and pays staff, rent and equipment costs. The audience travels to a shared screen. Film supply and venue operation are separate jobs.",
        "sources": [
          "amc"
        ]
      },
      {
        "text": "Viewer → cinema: a ticket for a showing. Snacks and drinks are extra transactions. Advertisers can also pay for access to the audience in the theatre.",
        "sources": [
          "amc"
        ]
      },
      {
        "text": "Cinema → film distributor: film-rental payments tied to box-office receipts. Upstream financing, rights and participation contracts determine further settlement; Dune’s exact splits are not shown.",
        "sources": [
          "amc",
          "dune"
        ]
      }
    ],
    "stays": "An attraction brings people into an operated venue, with additional purchases around it.",
    "changes": "The admission buys a scheduled showing; the exhibitor does not tune the film’s difficulty or ending per customer.",
    "boundary": "The 2024 theatrical release is the example. AMC documents the exhibitor model; it does not disclose this film’s individual deal."
  },
  {
    "id": "netflix",
    "label": "Netflix",
    "example": "Stranger Things · subscription viewing",
    "tag": "A catalog",
    "group": "screen",
    "cells": [
      {
        "text": "The Duffer Brothers create the series; Upside Down Pictures and 21 Laps produce it for Netflix. Production agreements pay for the work before viewers decide what to watch.",
        "sources": [
          "stranger",
          "netflix"
        ]
      },
      {
        "text": "Netflix commissions and licenses programming for its service. Streaming rights and production agreements replace the sale of a cabinet or the booking of individual cinema showings.",
        "sources": [
          "netflix"
        ]
      },
      {
        "text": "Trailers, publicity and brand collaborations reach people outside Netflix; personalized rows and recommendations introduce titles inside it. A recommendation is not automatically a paid advertisement.",
        "sources": [
          "stranger",
          "recommend"
        ]
      },
      {
        "text": "Netflix operates the streaming service and content delivery. The household supplies its screen and internet access. Production, distribution and the audience relationship partly converge at Netflix.",
        "sources": [
          "netflix"
        ]
      },
      {
        "text": "Household → Netflix: recurring catalog access, not a ticket per episode. On ad-supported plans, advertisers also pay Netflix to reach viewers.",
        "sources": [
          "netflix"
        ]
      },
      {
        "text": "Netflix → producers and rights holders under production/licensing agreements; those budgets pay creative labor and suppliers. There is no public, universal “one view = this royalty” rule for this series.",
        "sources": [
          "netflix",
          "stranger"
        ]
      }
    ],
    "stays": "Someone commissions creative work and assembles an audience around it.",
    "changes": "One title contributes to the value of a continuing catalog payment; its checkout price is not measured episode by episode.",
    "boundary": "This maps subscription viewing. Merchandise, live shows and other franchise businesses exist but are outside this route."
  },
  {
    "id": "pc",
    "label": "PC · local",
    "example": "Baldur’s Gate 3 · Steam purchase",
    "tag": "A game licence",
    "group": "bg3",
    "cells": [
      {
        "text": "Larian develops and publishes BG3, paying for its team and production. Wizards of the Coast / Hasbro supplies the licensed Dungeons & Dragons world; Hasbro reports digital licensing income.",
        "sources": [
          "steam-bg3",
          "hasbro"
        ]
      },
      {
        "text": "Larian supplies the game to Valve for sale through Steam under a distribution agreement. The customer buys a personal game licence; Steam is not buying a cabinet to resell turns.",
        "sources": [
          "steam-bg3",
          "steam-pay"
        ]
      },
      {
        "text": "Larian’s publicity and community work bring attention; Steam adds search, recommendations, reviews and promotions. Valve says it does not sell store advertising space. External campaigns are separate spending.",
        "sources": [
          "steam-reach",
          "steam-bg3"
        ]
      },
      {
        "text": "Valve delivers files, updates and store services. The player supplies a PC and runs the game locally; hardware, electricity and internet have their own suppliers and bills.",
        "sources": [
          "steam-bg3"
        ]
      },
      {
        "text": "Player → Steam checkout: payment for BG3. Replaying that purchased edition creates no new base-game charge. Optional editions/add-ons remain separate offers.",
        "sources": [
          "steam-bg3"
        ]
      },
      {
        "text": "Valve → Larian: sales proceeds after adjustments and Valve’s agreed share. Larian separately pays production costs and its IP-licensing obligations. The actual BG3 platform and royalty rates are not assumed.",
        "sources": [
          "steam-pay",
          "hasbro"
        ]
      }
    ],
    "stays": "A producer supplies a work and a distributor helps sell it to an audience.",
    "changes": "The player owns the operating equipment. Another hour of the purchased game need not produce another sale.",
    "boundary": "Digital Steam purchase, running locally. “Licence” describes access to the game, not ownership of its copyright."
  },
  {
    "id": "cloud",
    "label": "PC · cloud",
    "example": "Baldur’s Gate 3 · Steam + GeForce NOW",
    "tag": "Game + machine time",
    "group": "bg3",
    "cells": [
      {
        "text": "Larian develops and publishes BG3, paying for its team and production. Wizards of the Coast / Hasbro supplies the licensed Dungeons & Dragons world; Hasbro reports digital licensing income.",
        "sources": [
          "steam-bg3",
          "hasbro"
        ]
      },
      {
        "text": "The Steam game licence follows the same purchase route as local PC play. A paid GeForce NOW membership supplies access to remote gaming hardware; it does not include a BG3 purchase.",
        "sources": [
          "gfn",
          "gfn-bg3"
        ]
      },
      {
        "text": "Larian and Steam still introduce the game. NVIDIA also promotes supported titles to attract customers to its streaming service: the game becomes a reason to buy access to the equipment.",
        "sources": [
          "steam-reach",
          "gfn-bg3"
        ]
      },
      {
        "text": "NVIDIA runs the remote machine and streams its output. The player supplies a receiving device and internet. NVIDIA bears the cloud operation costs that local players otherwise carry as PC costs.",
        "sources": [
          "gfn",
          "gfn-plans"
        ]
      },
      {
        "text": "Player → Steam: the game purchase. Player → NVIDIA: the selected paid membership. Two payments buy two different things: permission to play the work and a service that runs it.",
        "sources": [
          "gfn",
          "gfn-plans"
        ]
      },
      {
        "text": "Steam settles the game sale with Larian; NVIDIA collects the service fee and funds its operation. No undisclosed per-session payment from NVIDIA to Larian is inferred.",
        "sources": [
          "steam-pay",
          "gfn"
        ]
      }
    ],
    "stays": "The same BG3 work and Steam licence can support local or cloud play.",
    "changes": "A specialist operator returns between the player and the machine. Recurring payment can pay for computing without changing the game into a seasonal service.",
    "boundary": "Paid NVIDIA-operated GeForce NOW route, using a supported Steam copy. Free tiers, partner-operated regions and other stores are outside this example."
  },
  {
    "id": "ps5",
    "label": "PlayStation",
    "example": "Baldur’s Gate 3 · PS5 download",
    "tag": "Game + optional network",
    "group": "bg3",
    "cells": [
      {
        "text": "Larian develops and publishes BG3, paying for its team and production. Wizards of the Coast / Hasbro supplies the licensed Dungeons & Dragons world; Hasbro reports digital licensing income.",
        "sources": [
          "steam-bg3",
          "hasbro"
        ]
      },
      {
        "text": "Larian publishes the PS5 edition through PlayStation Store. The player buys a game licence from Sony’s storefront and separately buys or already has a PS5.",
        "sources": [
          "ps-bg3",
          "sony"
        ]
      },
      {
        "text": "Larian’s publicity meets PlayStation’s storefront, trailers and platform promotion. These are discovery channels; this record does not disclose a paid placement deal or campaign fee.",
        "sources": [
          "ps-bg3"
        ]
      },
      {
        "text": "The player’s console runs BG3. Sony operates downloads and network services; Larian supplies the game and updates. Sony is both hardware supplier and platform operator.",
        "sources": [
          "ps-bg3",
          "sony"
        ]
      },
      {
        "text": "Player → PlayStation Store: BG3 purchase. Online multiplayer additionally requires PS Plus; local single-player does not. Hardware is another transaction. A Premium trial is not catalog ownership.",
        "sources": [
          "ps-bg3"
        ]
      },
      {
        "text": "Sony receives the store payment and settles with Larian under their publishing agreement; Larian has separate production and IP costs. Sony also earns hardware and network-service revenue. Exact BG3 settlement terms are not public here.",
        "sources": [
          "sony",
          "ps-bg3",
          "hasbro"
        ]
      }
    ],
    "stays": "The same producer and adventure can be sold through a different storefront.",
    "changes": "The platform combines hardware, distribution and paid network access. A subscription can sit beside a purchased game without replacing its purchase.",
    "boundary": "Downloaded PS5 edition. Cloud streaming and disc resale would form different routes."
  },
  {
    "id": "xbox-buy",
    "label": "Xbox · purchase",
    "example": "Diablo IV · downloaded base game",
    "tag": "Game + further offers",
    "group": "diablo",
    "cells": [
      {
        "text": "Blizzard develops and publishes Diablo IV. Since the October 2023 acquisition, Blizzard and Xbox are within Microsoft: the studio and platform have distinct jobs inside one corporate group.",
        "sources": [
          "diablo",
          "microsoft"
        ]
      },
      {
        "text": "The Xbox Store sells a base-game licence. The player supplies an Xbox console; expansion packs and Platinum are separate offers rather than ownership of the whole future catalog.",
        "sources": [
          "diablo"
        ]
      },
      {
        "text": "Blizzard’s game campaigns and seasonal announcements meet Xbox’s storefront and platform promotion. Promotion can direct the same audience toward a purchase or a subscription.",
        "sources": [
          "xbox"
        ]
      },
      {
        "text": "The Xbox runs the local client; Blizzard runs the required online game service. Internet and a Battle.net account are required. Buying the game does not make it an offline product.",
        "sources": [
          "diablo"
        ]
      },
      {
        "text": "Player → Xbox Store: base-game purchase; further payments can buy expansions or Platinum. Console online multiplayer has a separate Game Pass requirement. These are distinct from a mandatory monthly Diablo subscription.",
        "sources": [
          "diablo",
          "xbox"
        ]
      },
      {
        "text": "The purchase enters Microsoft’s gaming business. Studio, platform and service costs still exist, but an assumed third-party storefront commission would misdescribe this first-party relationship. Internal allocations are not disclosed.",
        "sources": [
          "microsoft"
        ]
      }
    ],
    "stays": "A player can pay for a named game, while the producer funds ongoing work.",
    "changes": "The purchased work relies on a continuing online operation and carries further offers. Several commercial roles now sit inside one group.",
    "boundary": "Digital Xbox base-game purchase. Extra content, multiplayer entitlement and the base licence are separate questions."
  },
  {
    "id": "xbox-pass",
    "label": "Xbox · Game Pass",
    "example": "Diablo IV · catalog access",
    "tag": "A catalog + extras",
    "group": "diablo",
    "cells": [
      {
        "text": "Blizzard develops and publishes Diablo IV. Since the October 2023 acquisition, Blizzard and Xbox are within Microsoft: the studio and platform have distinct jobs inside one corporate group.",
        "sources": [
          "diablo",
          "microsoft"
        ]
      },
      {
        "text": "An eligible Game Pass plan supplies access to Diablo IV through a catalog. The current US listing includes Premium and Ultimate. Access depends on the subscription and catalog terms, rather than a separate base-game purchase.",
        "sources": [
          "diablo"
        ]
      },
      {
        "text": "The Game Pass library and Xbox promotion present Diablo IV as one reason to subscribe. Blizzard’s game promotion also serves the title’s separate purchase and add-on offers.",
        "sources": [
          "xbox"
        ]
      },
      {
        "text": "In this route, the subscriber downloads the game to an Xbox. Blizzard’s online service is still required. Subscription access does not, by itself, mean the game runs in the cloud.",
        "sources": [
          "diablo"
        ]
      },
      {
        "text": "Subscriber → Microsoft: recurring Game Pass payment. Expansion and Platinum purchases can continue alongside it. A catalog subscription does not automatically include every paid add-on.",
        "sources": [
          "diablo",
          "xbox"
        ]
      },
      {
        "text": "Microsoft collects the subscription for the catalog; there is no public per-player allocation to Diablo IV. Blizzard is first-party here. Do not substitute a hypothetical external-publisher licensing fee for an internal budget.",
        "sources": [
          "microsoft",
          "diablo"
        ]
      }
    ],
    "stays": "The same Diablo IV service still needs development and operation.",
    "changes": "The base-game entry payment becomes a catalog relationship. The producer’s group can collect both the recurring membership and separate game-related purchases.",
    "boundary": "Downloaded Xbox version on an eligible plan, US offer checked 5 October 2026. This is not a claim about third-party Game Pass compensation."
  }
];
export const chainPhases: ChainPhase[] = [
  {
    "id": "production",
    "label": "Make & supply",
    "columns": [
      "Who makes the work — and who pays for it",
      "Who acquires what — from whom"
    ],
    "fields": [
      0,
      1
    ],
    "note": "The first buyer may be an operator, a distributor, a commissioning service or the eventual player. A cabinet, an exhibition licence and a personal game licence are different purchases."
  },
  {
    "id": "audience",
    "label": "Reach & run",
    "columns": [
      "How the audience finds it",
      "Who operates the experience"
    ],
    "fields": [
      2,
      3
    ],
    "note": "Distribution, promotion and operation can belong to different companies. A storefront recommendation, an advertising campaign and a running game server are different services."
  },
  {
    "id": "money",
    "label": "Collect & settle",
    "columns": [
      "Who pays at the audience end",
      "Where the receipts go next"
    ],
    "fields": [
      4,
      5
    ],
    "note": "Follow each payment separately. Game ownership, catalog access, multiplayer access and remote computing can sit beside one another; a recurring fee does not tell you which one it buys."
  }
];
