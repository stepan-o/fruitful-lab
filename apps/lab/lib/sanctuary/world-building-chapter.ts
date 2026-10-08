import type { Chapter, EvidenceSource } from "./types";

export const worldBuildingSources: EvidenceSource[] = [
  {
    "id": "world-cdpr-design",
    "title": "CD PROJEKT RED — level design, AnsweRED episode 30, 2 July 2026",
    "url": "https://www.cdprojektred.com/en/blog/188/answered-podcast-episode-30-paths-and-possibilities-the-art-of-level-design-transcript-included",
    "note": "Miles Tost and Marta Dobińska on the first world maps, agency, response costs and memorable consequences. The comparison of production emphases is our analysis, not a studio ranking."
  },
  {
    "id": "world-rockstar",
    "title": "Rob Nelson — Red Dead Redemption 2 interview, Everyeye, 2018",
    "url": "https://www.everyeye.it/articoli/intervista-rdr-2-storia-approccio-creativo-nel-nuovo-western-rockstar-38635.html",
    "note": "Primary developer interview, published in Italian. Horse familiarity, equipment and immersion are paraphrased, not quoted as an English transcript."
  },
  {
    "id": "world-zelda",
    "title": "Nintendo — Ask the Developer: Tears of the Kingdom, part 5, 9 May 2023",
    "url": "https://www.nintendo.com/en-ca/whatsnew/ask-the-developer-vol-9-the-legend-of-zelda-tears-of-the-kingdom-part-5/",
    "note": "The team describes letting players invent solutions and making object behavior legible. Not a claim that every possible combination is supported."
  },
  {
    "id": "world-rimworld",
    "title": "Ludeon — RimWorld official description",
    "url": "https://store.steampowered.com/app/294100/RimWorld/",
    "note": "Developer description of colonists, relationships and event direction. The AI storyteller is a game system; this is not evidence of LLM use."
  },
  {
    "id": "world-dwarf",
    "title": "Bay 12 — Dwarf Fortress features",
    "url": "https://bay12games.com/dwarves/features.html",
    "note": "Generated civilization history, individual thoughts and persistent changes. The comparison does not equate graphical simplicity with low development effort."
  },
  {
    "id": "world-cdpr-epic",
    "title": "CD PROJEKT — Unreal agreement, current report 7/2022",
    "url": "https://www.cdprojekt.com/en/investors/regulatory-announcements/current-report-no-7-2022/",
    "note": "Initial 15-year term, unlimited games and dedicated support. Financial terms are not disclosed here; standard Unreal royalties must not be imputed to this private agreement."
  },
  {
    "id": "world-redengine",
    "title": "CD PROJEKT — new Witcher saga and Unreal partnership, 21 March 2022",
    "url": "https://www.cdprojekt.com/en/media/news/new-witcher-saga-announced-cd-projekt-red-begins-development-on-unreal-engine-5-as-part-of-a-strategic-partnership-with-epic-games/",
    "note": "Announcement distinguishes future Witcher work from continued REDengine use for the upcoming Cyberpunk expansion at that time."
  },
  {
    "id": "world-witcher-demo",
    "title": "CD PROJEKT RED — Witcher 4 technology demonstration, 3 June 2025",
    "url": "https://press.cdprojektred.com/en/news/1778/cd-projekt-red-and-epic-games-present-the-witcher-4-unreal-engine-5-tech-demo-at-the-state-of-unreal-2025",
    "note": "PS5 demonstration of joint open-world tools, crowds and environments. A technical demonstration is not a finished-game performance guarantee."
  },
  {
    "id": "world-unreal",
    "title": "Epic — Unreal Engine licensing, checked 7 October 2026",
    "url": "https://www.unrealengine.com/license",
    "note": "Standard royalty and seat arrangements have conditions and exceptions. No undisclosed CDPR fee or comparative total production cost is estimated."
  },
  {
    "id": "world-unity",
    "title": "Unity — plans, checked 7 October 2026",
    "url": "https://unity.com/products",
    "note": "Free Personal and paid tiers with eligibility conditions. No current price comparison or obsolete Runtime Fee is used."
  },
  {
    "id": "world-godot",
    "title": "Godot — MIT licence",
    "url": "https://godotengine.org/license/",
    "note": "Engine permissions and notice conditions. No engine royalty does not imply a cost-free production."
  },
  {
    "id": "world-loopforge",
    "title": "Stepan Oskin — Loopforge architecture",
    "url": "https://www.fruitfulab.net/stepanoskin/loopforge/architecture/the-thesis",
    "note": "Author’s own project, not an independent endorsement. Local source inspected 7 October 2026: source simulation 3267ea7; presentation 54c234b. The eight-shift teaching model differs from the fuller Python factory model and the developing story."
  },
  {
    "id": "world-loopforge-narration",
    "title": "Stepan Oskin — Loopforge narrative boundary",
    "url": "https://www.fruitfulab.net/stepanoskin/loopforge/architecture/the-narrative-sidecar",
    "note": "Local implementation separates recorded events from generated speech. Checks constrain structure, speaker and event reference; they do not prove semantic truth. No new live model calls were made for this chapter."
  }
];

export const worldBuildingChapter: Omit<Chapter,"visual"> = {
  "id": "making-worlds",
  "part": 0,
  "title": "What it takes to make a world",
  "lede": "A convincing place has to answer the player. Every answer has work behind it.",
  "paragraphs": [
    "One of Miles Tost’s first assignments on The Witcher 3 was to put ideas on a map. An internal tool let designers mark places, add descriptions and attach reference pictures. Years later, he remembered how many of those early markers survived into the finished game. Before the world became a landscape its players could remember, it was a collection of decisions about what might belong there.",
    "Turning one marker into an encounter brings several crafts together. A writer gives someone a reason to speak. An artist makes a place and the person inside it. A performer supplies a voice; an animator makes the body answer; a designer decides what the player can do. Programmers connect those actions to consequences. Translation, accessibility work and testing must survive the variations. An additional choice can be inexpensive to propose and expensive to make coherent.",
    "CD PROJEKT RED’s designers describe that trade directly. In their 2026 discussion, Tost and Marta Dobińska ask where freedom produces a consequence worth the work. Some choices require another line; others require a different space or an entire branch of a story. The player also has to notice having made the choice. A response can be beautifully implemented yet too obscure to contribute what its makers intended.",
    "Rockstar gives the life around a mission practical consequences. In Red Dead Redemption 2, its western adventure, caring for a horse improves how the animal responds; equipment carried on it makes that relationship useful. Nintendo’s Tears of the Kingdom invests in objects players can join into contraptions, making their own solutions part of the spectacle. These are different emphases rather than rival schools. A carefully staged scene and a reusable behavior can both help a place feel responsive.",
    "RimWorld, Ludeon’s colony-management game, makes the interaction between circumstances especially visible. Inhabitants have needs, injuries and relationships while events place pressure on the settlement. Bay 12’s Dwarf Fortress gives generated civilizations and individual lives a history of their own. Here, much of what a player recounts was not written as that exact sequence. The work went into conditions capable of meeting in interesting ways—and into making the resulting trouble understandable.",
    "An engine supplies common machinery beneath these choices: drawing images, handling sound, moving objects, and helping teams assemble and inspect a game. It does not decide which conversation matters or make a system worth learning. Those remain production and design judgments. A studio can spend effort maintaining its own machinery or build its particular world on tools maintained by someone else.",
    "CD PROJEKT RED’s 2022 agreement with Epic shows the scale of that choice. Its move toward Unreal for future work included an initial fifteen-year term, unlimited games and dedicated technical support, with collaboration on open-world technology. CTO Paweł Zawodny pointed to the effort spent adapting REDengine for successive games and said the partnership should make development more predictable. That was management’s expectation, not a measured saving. The studio was committing to a working relationship as well as software. It did not move the existing Cyberpunk 2077 into Unreal. The announced partnership changed the foundations of future projects while older work still needed care.",
    "The 2025 Witcher 4 technology demonstration made the collaboration visible through crowds and environments running on a PlayStation 5. It demonstrated tools under development, not guaranteed performance for the eventual game. Unreal, Unity and the open-source Godot offer other teams different terms for shared machinery. None makes production free. The useful comparison is what a team can build, understand and sustain, including the cost of adapting to someone else’s tools.",
    "Loopforge is my own experiment with a narrower part of this problem: a factory simulation and the narrative engine around it. The factory produces artificial minds. Its supervisors have different priorities, so an instruction to raise output can become a disagreement about how the work should be done. The ambition is to let a production decision change a relationship without scripting every possible conversation in advance.",
    "The implementation keeps the event separate from the account of it. The simulation resolves an instruction and records what changed. A narrative process receives that evidence and a character’s voice; its response cannot rewrite the outcome. A supervisor may be proud, suspicious or unfair about an event while the event itself remains inspectable. “Truth stays clean. Story gets messy.” That boundary makes the engine interesting: consistent mechanics can support characters who disagree about their meaning.",
    "The small teaching prototype lets us inspect the idea over eight shifts. Hold the early decisions constant, then change one production policy: output and strain change according to the model’s rules. The exhibit’s dialogue is authored, not a live model response. The larger story’s planned loyalties and refusals remain work to build. This distinction matters because an attractive concept is easier to produce than a system that reliably delivers it.",
    "The next test is whether those consequences become meaningful to someone playing. Can they explain what changed, tell the supervisors’ priorities apart and remember the dispute? Those observations belong beside response time, contradictions and the cost of an acceptable line. A tool earns its place by making useful creative work possible. More generated words or more simulated detail is not yet a better world.",
    "The shared constraint is attention: the team’s care has to become something a player can experience. That may be one unforgettable scene, an elegant rule or an unplanned disaster worth telling a friend about. Better tools can change which of those possibilities a team can afford. They cannot guarantee an audience. Concord makes the next uncertainty painfully concrete: a world can be built, supported by a major publisher and released with plans to grow, then lose that future almost immediately."
  ],
  "sections": [
    {
      "at": 3,
      "title": "Different ways to answer a player"
    },
    {
      "at": 5,
      "title": "Building the tools or buying the relationship"
    },
    {
      "at": 8,
      "title": "Loopforge: consequences with a voice"
    },
    {
      "at": 11,
      "title": "What would make the engine worth using?"
    }
  ],
  "paragraphCitations": {
    "0": [
      "world-cdpr-design"
    ],
    "1": [
      "world-production-roles"
    ],
    "2": [
      "world-cdpr-design"
    ],
    "3": [
      "world-rockstar",
      "world-zelda"
    ],
    "4": [
      "world-rimworld",
      "world-dwarf"
    ],
    "6": [
      "world-cdpr-epic",
      "world-redengine"
    ],
    "7": [
      "world-witcher-demo",
      "world-unreal",
      "world-unity",
      "world-godot"
    ],
    "8": [
      "world-loopforge"
    ],
    "9": [
      "world-loopforge-narration"
    ],
    "10": [
      "world-loopforge"
    ],
    "11": [
      "world-loopforge-narration"
    ]
  },
  "sources": [
    "world-cdpr-design",
    "world-rockstar",
    "world-zelda",
    "world-rimworld",
    "world-dwarf",
    "world-cdpr-epic",
    "world-redengine",
    "world-witcher-demo",
    "world-unreal",
    "world-unity",
    "world-godot",
    "world-loopforge",
    "world-loopforge-narration",
    "world-production-roles"
  ],
  "figures": [
    {
      "asset": "witcher-world",
      "alt": "Geralt faces a griffin above a forested valley in The Witcher 3",
      "caption": "The Witcher 3 · CD PROJEKT RED. A landscape becomes an encounter through the placement of creatures, routes and reasons to travel.",
      "credit": "CD PROJEKT RED S.A.",
      "placement": "opening"
    },
    {
      "asset": "rdr-world",
      "alt": "Two people paddle a canoe toward lamplit buildings across a moonlit waterway in Red Dead Redemption 2",
      "caption": "Red Dead Redemption 2 · Rockstar Games. Travel and the spaces between missions help establish a place worth inhabiting.",
      "credit": "Rockstar Games / Take-Two Interactive",
      "placement": "opening"
    },
    {
      "asset": "rimworld-colony",
      "alt": "RimWorld colony screenshot with an injured colonist’s health panel and several urgent colony alerts",
      "label": "RimWorld · conditions become a history",
      "caption": "The body, the household and the colony all have a state. This official gallery frame makes their competing demands visible at once; it does not establish how the pictured crisis began.",
      "credit": "Ludeon Studios Inc.",
      "presentation": "pixels",
      "afterParagraph": 4,
      "details": [
        {
          "label": "An individual body",
          "text": "The selected colonist has specific injuries and capacities. The management problem concerns a particular person, not only a colony-wide resource total.",
          "rect": [
            0,
            37,
            28,
            55
          ]
        },
        {
          "label": "Competing demands",
          "text": "Rescue, fire, mood and other alerts coexist. Their interaction can produce a history that was not written as one fixed scene. This image alone does not identify the causes.",
          "rect": [
            83,
            56,
            17,
            26
          ]
        }
      ]
    },
    {
      "asset": "loopforge-rivalry",
      "alt": "Original Loopforge concept painting of Rivet Witch and Stiletto disputing a brain-factory conveyor in front of workers",
      "label": "Loopforge · original concept art",
      "caption": "Rivet Witch and Stiletto: two specialists with different priorities, facing the same production line. An existing concept painting from the author’s project, not a screenshot of the teaching prototype.",
      "credit": "Stepan Oskin / Loopforge",
      "afterParagraph": 8
    }
  ],
  "evidence": "The production comparison is critical interpretation, not a ranking or a claim that each studio uses only one method. Developer accounts describe intentions and work, not measured player effects. CD PROJEKT’s private Unreal agreement is not assigned standard public royalty terms. The Witcher 4 demonstration is not a finished-game benchmark. Loopforge is the author’s project. Its implemented teaching model, authored exhibit dialogue, concept art and developing story are distinct. The comparison uses recorded outcomes from the same starting state with one changed decision; it does not establish workplace effects, production savings or narrative-model reliability.",
  "takeaway": "The cost of a world is partly the cost of making its consequences worth noticing.",
  "exhibits": [
    {
      "afterParagraph": 10,
      "kind": "world-workshop"
    }
  ]
};
