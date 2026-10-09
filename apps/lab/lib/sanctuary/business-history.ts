import type { EvidenceSource } from "./types";

export const businessHistorySources: EvidenceSource[] = [
  {
    "id": "home-cartridge-history",
    "title": "Computer History Museum — Atari’s Roller-Coaster Ride",
    "url": "https://www.computerhistory.org/revolution/computer-games/16/185",
    "note": "The 1977 VCS, interchangeable cartridge library and long commercial life. It was not the first home console or the first cartridge console. The record-player comparison is our explanation of a reusable device and separately acquired works."
  },
  {
    "id": "halo-bungie-acquisition",
    "title": "Microsoft — agreement to acquire Bungie, 19 June 2000",
    "url": "https://news.microsoft.com/source/2000/06/19/microsoft-to-acquire-bungie-software/",
    "note": "Contemporaneous announcement connects the acquisition and Halo to the forthcoming Xbox platform. No purchase price or single private motive is inferred."
  },
  {
    "id": "halo-macworld-recollection",
    "title": "Marcus Lehto, interviewed by Jen Lennon — Kent State Magazine, November 2025",
    "url": "https://www.kent.edu/magazine/issue/2025/11/entering-mind-master-chief",
    "note": "Lehto recalls the Macworld presentation with Steve Jobs and Microsoft’s subsequent interest. “Steve Jobs can’t have that” is his retrospective characterization, not a verified contemporaneous Microsoft quotation. The article records Halo’s 2001 Xbox debut."
  },
  {
    "id": "halo-playstation-release",
    "title": "Halo Studios — Campaign Evolved release notes, 28 July 2026",
    "url": "https://support.halowaypoint.com/hc/en-us/articles/51174525772564-Halo-Campaign-Evolved-Release-Notes",
    "note": "Records the remake’s release and Xbox, PlayStation and PC purchase routes. This is a new release in the franchise, not the unchanged 2001 executable. It illustrates a wider audience strategy; it does not measure the profitability of exclusivity."
  },
  {
    "id": "netflix-streaming-launch",
    "title": "Netflix — instant watching launch, 16 January 2007",
    "url": "https://about.netflix.com/en/news/netflix-offers-subscribers-the-option-of-instantly-watching-movies-on-their",
    "note": "Streaming began as a feature of an existing DVD-by-mail membership, with about 1,000 titles and a phased rollout. Neither streaming nor entertainment subscriptions were invented by this launch."
  },
  {
    "id": "game-pass-release-history",
    "title": "Phil Spencer — Xbox Game Pass expands to new releases, 23 January 2018",
    "url": "https://news.xbox.com/en-us/2018/01/23/xbox-game-pass-expands/",
    "note": "Dates Game Pass to June 2017 and announces Microsoft Studios releases entering on launch day. A historical commitment, not a description of every current tier or title. Catalog access is separate from cloud execution."
  }
];

export const businessHistory = [
  {
    "id": "coin",
    "date": "1972",
    "label": "Pay per play",
    "example": "Pong · the arcade cabinet",
    "body": "The player buys a turn. The operator buys the machine, which earns its keep one game at a time.",
    "stake": "A game can make a venue more inviting—and give the equipment owner something to sell.",
    "sources": [
      "pong-tavern",
      "alcorn-oral"
    ]
  },
  {
    "id": "cartridge",
    "date": "1977",
    "label": "One console, many games",
    "example": "Atari VCS · interchangeable cartridges",
    "body": "One machine can play many separately purchased games. The player supplies the equipment; publishers compete for a place in the household’s collection.",
    "stake": "A successful console creates an audience for the next game, including games made by other companies.",
    "sources": [
      "home-cartridge-history"
    ]
  },
  {
    "id": "platform",
    "date": "1990s–2001",
    "label": "Games sell consoles",
    "example": "PlayStation · then Halo and Xbox",
    "body": "Sony’s early PlayStation business benefits from hits by Square and Namco. Microsoft acquires Bungie before Halo becomes an Xbox launch title.",
    "stake": "The value of a game includes the customers it can bring to someone’s platform.",
    "sources": [
      "sony-ps1-creators",
      "halo-bungie-acquisition",
      "halo-macworld-recollection"
    ]
  },
  {
    "id": "online",
    "date": "2003–2007",
    "label": "Downloads and streaming",
    "example": "Steam · Netflix streaming",
    "body": "Steam launches in 2003; Netflix adds streaming to its existing membership in 2007. The network becomes a way to deliver entertainment as well as promote it.",
    "stake": "An online library can sell individual works or access to a catalog. Digital delivery does not decide the business model.",
    "sources": [
      "valve-deck-booklet",
      "netflix-streaming-launch"
    ]
  },
  {
    "id": "catalog",
    "date": "2017–2018",
    "label": "Subscribe to a catalog",
    "example": "Xbox Game Pass · launch-day releases",
    "body": "Game Pass launches in 2017. In 2018, Microsoft commits its new studio releases to the catalog on launch day, giving membership an attraction that once required another purchase.",
    "stake": "A new game can help sell the next month of access, as well as another copy.",
    "sources": [
      "game-pass-release-history"
    ]
  },
  {
    "id": "cloud",
    "date": "2020–2026",
    "label": "Rent a remote PC",
    "example": "GeForce NOW · Halo on PlayStation",
    "body": "GeForce NOW adds a remote-computing service to supported store libraries. Halo’s 2026 remake reaches PlayStation: even a platform’s emblem can become a product on a rival’s shelf.",
    "stake": "Equipment, game purchases and memberships can come from different businesses—or several arms of the same one.",
    "sources": [
      "gfn-reach-2023",
      "gfn-membership-terms",
      "halo-playstation-release"
    ]
  }
];
