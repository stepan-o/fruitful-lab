import type { Chapter, EvidenceSource } from "./types";

export const mobileSources: EvidenceSource[] = [
  {
    "id": "king-launch",
    "title": "King — Candy Crush Saga Facebook launch, 12 April 2012",
    "url": "https://www.prnewswire.com/news-releases/kingcom-sweetens-facebook-with-launch-of-first-match-3-game-candy-crush-saga-147137785.html",
    "note": "Company-issued launch release: 65 levels, match-three mechanics, social invitations and purchasable assistance. Historical offer, not current level count."
  },
  {
    "id": "king-twenty",
    "title": "King — twentieth anniversary, 27 September 2023",
    "url": "https://www.king.com/corporate-and-media/posts/press-releases/celebrating-20-years-of-gaming-excellence-kings-milestone-journey/",
    "note": "Company reports over US$20bn lifetime Candy Crush franchise revenue and forthcoming level 15,000. Newest designers traditionally design milestone levels. Franchise cumulative revenue is neither annual King revenue nor profit; company-reported figures, not an independent market estimate."
  },
  {
    "id": "king-2014",
    "title": "King — full-year 2014 results, 12 February 2015",
    "url": "https://www.sec.gov/Archives/edgar/data/1580732/000119312515046699/d869997dex991.htm",
    "note": "Reported 2014 revenue US$2,260.2m and profit US$574.9m. Q4 averages: 356m monthly unique users and 8.344m monthly unique payers across King games. Their ratio is 2.34%; this is not Candy Crush-only, a lifetime payer rate or an estimate of individual spending."
  },
  {
    "id": "king-platform-costs",
    "title": "King — 2014 Form 20-F, revenue model and note 7",
    "url": "https://www.sec.gov/Archives/edgar/data/1580732/000119312515048504/d835904d20f.htm",
    "note": "Advertising discontinued in Q2 2013. Revenue came primarily from virtual items/currency; extra lives, boosters and content access were examples. Note 7 records US$684.804m payments to social/mobile platforms and US$422.140m marketing/advertising in 2014. Gross revenue is not what King retained. Platforms handled nearly all virtual-currency purchases. This historical description is not a claim that King never sold ads again."
  },
  {
    "id": "king-mobile-launch",
    "title": "King — IPO registration prospectus, 18 February 2014",
    "url": "https://www.sec.gov/Archives/edgar/data/1580732/000119312514056089/d564433df1.htm",
    "note": "Company history and Business sections: browser games from 2003; paid skill tournaments, company portal and partner portals; small prototype teams, testing and Saga adaptation; Candy Crush Saga mobile launch in November 2012. The buyer’s-remorse sentence is an exact, complete quotation from the company’s stated retention principles, not independent verification of every offer or player outcome."
  },
  {
    "id": "king-acquisition",
    "title": "Activision Blizzard — King acquisition completed, 23 February 2016",
    "url": "https://investor.activision.com/node/22586",
    "note": "Acquisition of all outstanding King shares for US$18 each, announced total equity value US$5.9bn. This is the release’s equity-value measure; later purchase-accounting figures differ. King was an established public company, not a game bought from Blizzard’s developers."
  },
  {
    "id": "microsoft-mobile-rationale",
    "title": "Phil Spencer — Gaming for everyone, everywhere, 1 September 2022",
    "url": "https://blogs.microsoft.com/on-the-issues/2022/09/01/gaming-everyone-everywhere/",
    "note": "Microsoft Gaming CEO explicitly connects the proposed deal to mobile reach and the acquired teams’ expertise. The console sentence is quoted complete (19 words). Stated acquisition rationale, not proof of later success or a valuation apportioned among franchises."
  },
  {
    "id": "candy-offer",
    "title": "King — Candy Crush Saga, official App Store listing",
    "url": "https://apps.apple.com/us/app/candy-crush-saga/id553834731",
    "note": "Publisher describes free entry, optional in-app purchases, boosters, extra moves, daily rewards and events. Store promotional captures can combine gameplay with advertising copy and effects; they are identified as promotions. Offers can vary."
  },
  {
    "id": "cod-origin",
    "title": "Activision — original Call of Duty announcement, 8 April 2003",
    "url": "https://investor.activision.com/news-releases/news-release-details/activision-introduces-call-duty-new-brand-first-person-action",
    "note": "Credits original developer Infinity Ward. This is separate from Treyarch and Raven Software’s lead development of Black Ops 6."
  },
  {
    "id": "cod-six-reveal",
    "title": "Activision — Black Ops 6 worldwide reveal, 9 June 2024",
    "url": "https://www.callofduty.com/blog/2024/06/call-of-duty-black-ops-6-worldwide-reveal-announcement",
    "note": "Credits Treyarch and Raven Software; official promotional art and pre-release gameplay/HUD image identify the particular release. Portrait of an annual premium release, not a claim that all Call of Duty products require purchase."
  },
  {
    "id": "king-later-model",
    "title": "Activision Blizzard — 2022 Form 10-K, King segment",
    "url": "https://www.sec.gov/Archives/edgar/data/718877/000162828023004842/atvi-20221231.htm",
    "note": "King’s later business includes both in-game sales and in-game advertising. Distinguishes the 2014 snapshot from the evolved model; no present-day ad share is inferred."
  },
  {
    "id": "king-evergreen-2026",
    "title": "Microsoft Game Dev — King and Mojang on evergreen games, 14 May 2026",
    "url": "https://developer.microsoft.com/en-us/games/articles/2026/05/art-and-science-of-evergreen-games-minecraft-candy-crush/",
    "note": "Report of the GDC panel with King’s Eva Ryott and Romain Jemma and Mojang’s Ryan Cooper. King describes two years of refactoring before the new 2×2 Fish mechanic, rebalancing roughly 18,000 levels and over 60,000 tweaks. This is the team’s retrospective account, not independently audited labor or cost data. Fish candies already existed: the change concerns a new combination, not the invention of fish in Candy Crush. The report quotes players calling the fish “drunk”."
  }
];

export const mobileChapter: Omit<Chapter,"visual"> = {
  "id": "mobile-freemium",
  "part": 0,
  "title": "Candy Crush: a business inside the game",
  "lede": "The next sale could come from the game someone already loved.",
  "paragraphs": [
    "When Candy Crush Saga arrived on Facebook in 2012, it offered 65 levels. Eleven years later, its maker King was preparing level 15,000. By company tradition, the newest designers got to make the milestone level. A game that fit into a few spare minutes had become a continuing production: new puzzles for people who had been playing for years, made by colleagues who had only just arrived.",
    "King began in 2003 with games played in a web browser. Its early business included paid skill tournaments: players entered competitions, and King kept a commission. It made games and ran its own portal, while also reaching customers through sites such as Yahoo. Several jobs from our business diagram already belonged to the same company, long before Microsoft acquired it.",
    "King’s method was to try many small ideas. Its 2014 prospectus described teams of three developing new games in about twenty weeks, then testing them with its existing audience. Promising games could become a Saga: a sequence of challenges, with progress to carry between sessions and friends whose progress they could follow. Candy Crush Saga reached Facebook and then phones in 2012.",
    "The phone gave that sequence somewhere to live throughout the day. Candy Crush is a match-three puzzle: line up sweets to clear them, pursuing a goal within a limited number of moves. Starting costs nothing. If a board proves difficult, extra moves or tools called boosters can be bought to help. This freemium offer lets the game establish its value through play before asking whether a particular purchase is worth making. The player has already met the challenge that gives the offer its meaning.",
    "Most of King’s audience did not pay in a typical month. In the final quarter of 2014, its average monthly figures were 356 million unique users and 8.3 million unique payers across its games—about 2.3%. Yet the company reported US$2.26 billion in annual revenue and US$575 million in profit. It had even stopped selling advertising the previous year. An audience could enjoy the work largely for free while a small paying share supported a substantial creative business.",
    "The scale matters because the sale now happened within the experience the studio was designing. A puzzle needed to be difficult enough to make solving it satisfying; that difficulty could also make help worth buying. Another level gave someone a reason to return, and another occasion on which a purchase might become useful. King could keep developing a successful game while continuing to earn from it. The same decisions about challenge and progress now served both the pleasure of playing and the value of the offer.",
    "King described the limit in plain terms: “We believe preventing buyer’s remorse drives long-term customer retention.” That was its stated principle, not proof that every player felt well served. But it identifies the problem a continuing business has to solve. A sale that leaves someone regretting their time with the game can cost more than the money it brings in.",
    "This was the business Activision Blizzard bought in 2016 for an announced equity value of US$5.9 billion. King joined the group behind Call of Duty and Diablo as an established mobile publisher. Microsoft acquired the larger group in 2023. By then, King said the Candy Crush franchise had earned more than US$20 billion over its lifetime. The acquisition brought Microsoft a game that could reach people who might never buy an Xbox, and a team that had spent years learning how to keep them playing.",
    "Keeping it alive had become an undertaking of its own. At a 2026 developer conference, King described spending two years rebuilding parts of its old code before it could add a new four-candy combination that creates a fish-shaped helper. The change then required rebalancing thousands of existing levels. Players complained that the fish chose the wrong targets; some called them “drunk”. A tiny new trick on the board reached back through years of work and expectations. The studio had to make an old game feel fresh without spoiling what its players already knew how to enjoy.",
    "This is why the candy belongs in Sanctuary Economics. Mobile freemium showed how continued play could support continued production, with the next purchase offered inside a game rather than reserved for its sequel. Diablo IV combines an upfront price with an ongoing audience for expansions, seasons and cosmetics. Its cosmetic shop does not sell help with a difficult fight; Candy Crush sells help with the puzzle itself. The common problem is how to keep earning from a game people care about. What is offered for sale—and what the game does to make it desirable—becomes a design decision with consequences for that relationship.",
    "King still had to pay to reach that audience. Its 2014 accounts recorded US$685 million paid to social and mobile platforms, alongside US$422 million spent on marketing and advertising. Apple, Google and Facebook handled nearly all its virtual-currency purchases that year. King could make the game, operate it and decide what to sell inside it, while another company owned the counter through which the money passed.",
    "That counter brings us to Valve. King built games that could earn repeatedly through other companies’ platforms. Valve built games, then opened a store through which other creators could sell theirs. Both found a business beyond waiting for their next major release. One kept making offers inside its own work; the other became part of the route by which thousands of works reached their audience."
  ],
  "sections": [
    {
      "at": 4,
      "title": "The next sale is already inside"
    },
    {
      "at": 7,
      "title": "Buying a relationship that lasted"
    },
    {
      "at": 10,
      "title": "Who owns the counter?"
    }
  ],
  "paragraphCitations": {
    "0": [
      "king-launch",
      "king-twenty"
    ],
    "1": [
      "king-mobile-launch"
    ],
    "2": [
      "king-mobile-launch",
      "king-launch"
    ],
    "3": [
      "candy-offer"
    ],
    "4": [
      "king-2014",
      "king-platform-costs"
    ],
    "6": [
      "king-mobile-launch"
    ],
    "7": [
      "king-acquisition",
      "microsoft-acquisition-scale",
      "king-twenty",
      "microsoft-mobile-rationale"
    ],
    "8": [
      "king-evergreen-2026"
    ],
    "9": [
      "d4-season-philosophy"
    ],
    "10": [
      "king-platform-costs"
    ],
    "11": [
      "valve-history",
      "valve-about"
    ]
  },
  "exhibits": [
    {
      "afterParagraph": 3,
      "kind": "freemium-offer"
    },
    {
      "afterParagraph": 7,
      "kind": "king-ownership"
    }
  ],
  "figures": [],
  "embeddedAssets": [
    "candy-poster",
    "candy-phone",
    "king-logo",
    "activision-logo"
  ],
  "sources": [
    "king-launch",
    "king-twenty",
    "king-mobile-launch",
    "candy-offer",
    "king-2014",
    "king-platform-costs",
    "king-acquisition",
    "microsoft-acquisition-scale",
    "microsoft-mobile-rationale",
    "king-evergreen-2026",
    "d4-season-philosophy",
    "valve-history",
    "valve-about"
  ],
  "evidence": "King’s portal history, small-team process and retention principle are its own 2014 account. The buyer’s-remorse quotation is the complete sentence; it does not establish that actual offers always met that principle. Browser/Facebook play preceded the mobile release: Candy Crush is not presented as mobile-born. Free-to-play, subscriptions, paid releases and arcade payments coexist; the reading order is not a chronology of one model replacing another. The 2014 financial and audience figures cover King’s portfolio, not Candy Crush alone. The monthly payer ratio is 8.344/356 (2.34%), using Q4 averages, not a lifetime payer rate or a count of unique humans. King’s 2016 US$5.9bn is announced equity value; Microsoft’s US$75.4bn is its reported 2023 purchase price for the parent group. The US$20bn milestone is cumulative franchise revenue reported by King in September 2023, not annual revenue, profit or a separate acquisition valuation. Level 15,000 was forthcoming in the 2023 announcement. The fish anecdote is King’s reported experience adding the new 2×2 combination, not the original introduction of fish candies or independently measured costs. Advertising stopped in 2013 and later returned; the historical snapshot does not define the whole present model. The connections to Diablo and Valve are our economic interpretation, not a claim that King invented repeated payments, that Diablo copied King, or that subscription adoption caused mobile freemium. Assistance, cosmetics, paid entry and expansions are distinct offers. The diagram is qualitative, preserves unpaid progress, and does not represent a mandatory purchase or a measured conversion rate."
};
