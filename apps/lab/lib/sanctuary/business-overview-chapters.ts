import type { Chapter } from "./types";

export const businessOverviewChapters: Omit<Chapter,"visual">[] = [
  {
    "id": "platform-business",
    "part": 0,
    "title": "The work behind a purchase",
    "lede": "A popular game can earn money for several businesses before its creator can afford another one.",
    "paragraphs": [
      "Epic’s publishing offer reveals two different moments at which money can reach a developer. Funding pays for work before there is a finished game to sell. Later receipts first recover the agreed costs; profit sharing follows. A successful launch can therefore be repaying an investment rather than producing money the team is free to spend on its next project. Development can be funded while the financial outcome of the release remains unsettled.",
      "The example is useful because “publisher” does not tell us the agreement. Funding, ownership, promotion and the division of proceeds are separate terms. Even permission to use the setting may belong to another party. A film studio adapting Dune has production work to pay for and underlying rights to obtain. A game based on someone else’s world faces the same distinction. One apparently unified work can carry several claims on what it earns.",
      "Nor does finishing the work finish the expense. Testing, translation, release preparation and publicity connect a production to people who might buy it. A storefront performs another part of that work. Steam delivers purchases and processes payments; Valve’s documentation explains how refunds, taxes and other adjustments enter settlement. The number at the checkout is therefore not the amount a development team can spend on its next project. To assess that team’s prospects, we need to know which costs and agreements stand between the two.",
      "Cinema shows how a work can earn through several different invitations. A distributor brings a film to an exhibitor, which operates the theater and sells admission to a particular showing. Netflix can instead license or commission a work for a subscription catalog. The same film may participate in several release channels. What changes is the transaction around it: a ticket for tonight, or one reason to keep access to a larger collection.",
      "That changes how a hit becomes visible to the people who made it. A cinema release has ticket receipts associated with the title. Inside a subscription, viewers pay for the collection, so success needs another account. In 2023, the Writers Guild of America negotiated a viewing-based bonus for qualifying streaming productions and access to viewing data. The dispute was partly about turning the value of a work within a service into compensation for its creators. A larger audience did not automatically produce that result.",
      "Games bring together these arrangements. A title can sell individual copies, enter a subscription catalog and offer paid additions. A platform can own studios as well as the store and the device. Sony’s gaming accounts for the year ending March 2026 reported about ¥1.36 trillion from add-on content and ¥0.94 trillion from console hardware. These are different reported revenue categories, not a typical player’s bill or comparable profit margins. They nevertheless show why counting boxes or consoles alone misses much of the business.",
      "A company supplying several layers can pursue a game for more than its direct sales. It might help sell a device, distinguish a catalog or draw people into a store where other purchases follow. That can finance work which would face a different calculation on its own. It also makes evaluation harder: a profitable platform can contain expensive games, and a popular game can earn too little for the team that made it. The same need to recover different costs extends to the equipment. Cloud services offer a particularly clear view of what changes when the player stops buying the machine."
    ],
    "paragraphCitations": {
      "0": [
        "epic-publishing"
      ],
      "1": [
        "epic-publishing",
        "chain-dune"
      ],
      "2": [
        "steam-settlement"
      ],
      "3": [
        "chain-cinema",
        "chain-netflix"
      ],
      "4": [
        "wga-streaming-2023"
      ],
      "5": [
        "sony-revenue"
      ]
    },
    "sections": [
      {
        "at": 2,
        "title": "The checkout is not the studio’s budget"
      },
      {
        "at": 3,
        "title": "A ticket, a catalog and the value of a hit"
      },
      {
        "at": 5,
        "title": "Several businesses under one roof"
      }
    ],
    "figures": [],
    "sources": [
      "epic-publishing",
      "chain-dune",
      "steam-settlement",
      "chain-cinema",
      "chain-netflix",
      "wga-streaming-2023",
      "sony-revenue"
    ],
    "evidence": "Epic’s 2020 public terms are one publishing offer, not a universal contract. The WGA passage concerns the historical 2023 agreement and qualifying productions, not all streaming compensation. Sony’s figures are reported segment revenue, including differing accounting treatments; they are neither gross consumer spending nor profit margins or cloud revenue. The final paragraph identifies possible strategic contributions, not a private valuation of any named game. This chapter uses no assumed commissions, recoupment balances or catalog fees.",
    "takeaway": "The commercial success of a work and the money available to its creator are related, but they are not the same number.",
    "exhibits": [
      {
        "afterParagraph": 0,
        "kind": "business-layers"
      },
      {
        "afterParagraph": 3,
        "kind": "audience-economy"
      },
      {
        "afterParagraph": 5,
        "kind": "platform-revenue"
      }
    ]
  },
  {
    "id": "cloud-gaming",
    "part": 0,
    "title": "A game you buy, a machine you hire",
    "lede": "The most expensive object needed for the evening can be somewhere else. Someone still has to supply it.",
    "paragraphs": [
      "The remote computer introduced earlier still has to be bought, powered and kept available. A player with a PC pays for a machine that remains on the desk between sessions. A cloud provider can use its equipment to serve different people, but it has to provide enough capacity when they arrive. NVIDIA warns that GeForce NOW memberships can sell out. The obstacle has moved from owning a capable machine to obtaining access to one.",
      "Keep the Cyberpunk 2077 purchase from chapter 2 unchanged and switch only the machine running it. Steam still handles the supported game purchase; a paid GeForce NOW membership pays NVIDIA for computing. Valve’s publisher payments do not change. That gives us a useful comparison: access to the creative work stays constant while the cost, availability and performance of its delivery can change. Catalog membership adds a separate choice about access to the game.",
      "For the player, the trade is between a machine they buy and capacity they access under a provider’s terms. Paying for a powerful PC creates a large expense before the first game runs. A cloud plan can reduce that initial commitment while adding a continuing one. It also leaves the player dependent on supported titles, available service and the connection. There is no universal cheaper option: the answer depends on what someone wants to play, for how long and with what equipment already at home.",
      "The connection becomes part of how the controls feel. Bandwidth is how much data it carries; latency is the delay. A detailed stream needs sufficient bandwidth, but an action can still feel late if the round trip takes too long. The requirements chart separates those ideas from NVIDIA’s reported membership milestones. Millions of registrations establish reach, not how many people pay, play regularly or receive an experience they prefer to a local machine.",
      "For a studio, cloud support can put its work in front of people who would otherwise need new hardware. It also creates release and support work. A session may run on a different remote computer the next time, so progress has to survive that change through cloud saves or supported persistent storage. Publisher permission still matters. And customers playing locally remain part of the audience. A new route to powerful hardware changes the production calculation; it does not abolish the old machines the game must also serve.",
      "Streaming rights have become valuable enough to negotiate separately from ownership of a studio. When the UK approved Microsoft’s restructured Activision Blizzard acquisition in 2023, Ubisoft received covered cloud-streaming rights outside the European Economic Area, including rights for new releases over the following fifteen years. Microsoft could own the maker while another company controlled this route to the audience. Supplying the computer and securing permission to run the work are different tasks.",
      "The meter has not vanished either. As checked in October 2026, standard GeForce NOW Performance and Ultimate plans include 100 premium hours a month, with paid additional hours and specified exceptions. That allowance concerns use of equipment, not a character’s health or strength. Keeping the distinction clear lets us ask a better question of a charge: which work does it fund, and which part of the player’s experience changes when the allowance ends?",
      "Moving the computer can change who reaches a world and what the evening costs. It leaves another demanding task intact: someone still has to make a place worth entering. That work includes the scenery, but also every response that turns a picture on a screen into something a player can act within."
    ],
    "paragraphCitations": {
      "0": [
        "gfn-service"
      ],
      "1": [
        "chain-cyberpunk",
        "gfn-cyberpunk",
        "steam-cloud",
        "gfn-game-pass"
      ],
      "3": [
        "gfn-requirements",
        "gfn-reach-2021",
        "gfn-reach-2023"
      ],
      "4": [
        "steam-cloud",
        "gfn-service"
      ],
      "5": [
        "cloud-rights"
      ],
      "6": [
        "gfn-service"
      ]
    },
    "sections": [
      {
        "at": 2,
        "title": "A different entrance cost"
      },
      {
        "at": 4,
        "title": "The work moves with the computer"
      }
    ],
    "figures": [
      {
        "asset": "cyberpunk-night-city",
        "alt": "Cyberpunk 2077: illuminated towers and stacked streets in Night City",
        "caption": "Night City in Cyberpunk 2077. Its dense streets and lighting have to be rendered somewhere—on the player’s machine or a provider’s.",
        "credit": "CD PROJEKT RED S.A.",
        "afterParagraph": 1
      }
    ],
    "sources": [
      "gfn-service",
      "gfn-requirements",
      "chain-cyberpunk",
      "gfn-cyberpunk",
      "steam-cloud",
      "gfn-game-pass",
      "gfn-reach-2021",
      "gfn-reach-2023",
      "cloud-rights"
    ],
    "evidence": "The example holds a supported Steam game purchase constant while changing the computer running it. It does not treat NVIDIA as the game seller or generalize its offer to all cloud services. Requirements are published conditions, not measured performance. Membership milestones do not count active or paying players. Storage, regional availability, publisher support and plan exceptions vary; terms were checked 8 October 2026. The Ubisoft arrangement concerns the covered rights and territories, not ownership of Activision Blizzard or a universal right to all its games. No claim is made about how many studios changed production targets because of cloud access.",
    "takeaway": "Cloud play can move the hardware barrier without changing how the game itself is sold.",
    "exhibits": [
      {
        "afterParagraph": 3,
        "kind": "cloud-figures"
      }
    ]
  }
];
