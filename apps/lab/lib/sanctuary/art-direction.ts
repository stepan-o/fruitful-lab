/** Recognition comes from a game's design vocabulary, never traced publisher art. */
export const artDirection: Record<
  string,
  {
 title: string; reference?: string; read: string; motifs?: string[]; alt?: string }
> = {
"several-histories":{"title": "A dungeon within reach", "read": "The original game combines a directed descent with changing encounters and equipment.", "reference": "Diablo · a history of play and production", "alt": "A dungeon within reach. An original isometric engraving of the historical relationship, not a game screenshot."},
"diablo-second-life":{"title": "The road can be travelled again", "read": "An authored journey can sustain many builds and a shared restart without selling another run.", "reference": "Diablo · a history of play and production", "alt": "The road can be travelled again. An original isometric engraving of the historical relationship, not a game screenshot."},
"diablo-market":{"title": "Two routes to the same equipment", "read": "A market can supply equipment while weakening the activity that made obtaining it satisfying.", "reference": "Diablo · a history of play and production", "alt": "Two routes to the same equipment. An original isometric engraving of the historical relationship, not a game screenshot."},
"diablo-service":{"title": "An adventure, and a production calendar", "read": "The campaign belongs to a larger program of seasons, expansions, services and optional offers.", "reference": "Diablo · a history of play and production", "alt": "An adventure, and a production calendar. An original isometric engraving of the historical relationship, not a game screenshot."},

  "making-worlds": {title:"The work of making a world",read:"Specific visual citations lead to an original instrument separating simulated consequences from a character’s account."},
  "platform-business": {title:"The work behind the offer",read:"Follow production, rights and settlement through different entertainment businesses."},
  "cloud-gaming": {title:"A game you own, a machine you hire",read:"Cloud streaming changes who supplies computing while the supported game purchase remains separate."},
  "valve-platform": {title:"Valve: the studio becomes the store",read:"One company can supply several different parts of the evening. Select a role to follow the relationship."},
  "epic-infrastructure": {title:"Epic: selling the means to make and sell",read:"One company can supply several different parts of the evening. Select a role to follow the relationship."},
  "rockstar-world": {title:"Rockstar: a release becomes a world",read:"One company can supply several different parts of the evening. Select a role to follow the relationship."},
  "studio-to-screen": {title:"From work to play",read:"Production, permission, distribution and operation connect a creative work with its audience. The paths represent roles, not measured cash flows."},
  "how-many-lives": {title:"The coin slot and the dungeon",read:"The cabinet holds a paid adventure and the controls that shape it."},
  "insert-coin": {
    title: "The coin slot and the dungeon",
    read: "The commercial machine and the adventure share a boundary. The original cutaway below makes both sides available to inspect.",
    alt: "An original engraved arcade cabinet with four adventurers in its screen and a coin slot below.",
  },
  "the-fork": {
    title: "The shape of a playthrough",
    read: "An adventure can reach its resolution while a world continues to offer new occasions to play. Diablo IV contains both: its campaign and its seasonal program. For a player expecting to finish the work they bought, the next season can arrive before the current journey feels complete. The picture holds that tension; the diagrams below examine what each invitation asks of the studio and the player.",
    alt: "An engraved diptych. On the left, a traveler follows a winding mountain road toward a sunlit gate. On the right, several travelers inhabit a city encircled by a returning path.",
  },
  "six-games": {
    title: "The cabinet of different promises",
    reference: "Six RPGs · six product structures",
    read: "A party, a fallen crown, an expedition, a hunt, a neon city and a dungeon share one cabinet—not one promise.",
    motifs: ["Party silhouettes", "Journey emblems", "Six independent windows"],
  },
  "the-reset": {
    title: "The shape of a playthrough",
    reference: "Diablo IV · campaign and seasons",
    read: "The campaign gives an adventure a resolution; a season gathers players around a fresh set of possibilities. Both belong to Diablo IV, and a seasonal character can follow the campaign. Their overlap raises the next question: which parts of an earlier adventure accompany the player into a new one?",
    alt: "An engraved diptych. A traveler follows a mountain road toward a sunlit gate; several travelers inhabit a city encircled by a returning path.",
  },
  concord: {
    title: "The arena needs somebody else",
    reference: "Concord · multiplayer population dependency",
    read: "Two industrial spawn bays face an empty combat floor. A beautiful arena cannot supply its own opponents.",
    motifs: [
      "Opposing team bays",
      "Futuristic cover",
      "Vacant player positions",
    ],
  },
  "what-decides": {
    title: "The observatory of useful questions",
    reference: "Outer Wilds · signalscope and investigation",
    read: "A handmade brass receiver follows a signal through a small orbital system. The useful reward is a better question.",
    motifs: [
      "Directional instrument",
      "Campfire-scale exploration",
      "Clues across a repeating world",
    ],
  },
  "shape-of-money": {
    title: "Somebody has to feed the furnace",
    reference: "Diablo IV · continuing service obligations",
    read: "The shop, workshop and inhabited world connect through pipes. Keeping the promise requires more than lighting the till.",
    motifs: [
      "Recurring storefront",
      "Content workshop",
      "A world kept running",
    ],
  },
  "why-people-play": {
    title: "Three people, one campfire",
    reference: "Diablo IV social play · motivation theory",
    read: "One traveler practices, one chooses a route, one waits for company. A shared location hides different reasons.",
    motifs: [
      "Party campfire",
      "Distinct intentions",
      "Connection without a scoreboard",
    ],
  },
  "play-beyond-score": {
    title: "The counter beside the confession",
    reference: "INDIKA · prayer, score, belief and doubt",
    read: "A bowed figure and a fractured chapel sit beside a loudly illuminated counter. Counting and meaning occupy different planes.",
    motifs: [
      "Held ritual gesture",
      "Fractured red space",
      "An ambiguous reward counter",
    ],
  },
  "anatomy-of-loop": {
    title: "The dungeon inside the calendar",
    reference: "Diablo IV · nested play rhythms",
    read: "An attack sits inside an encounter, inside a route, inside a larger project. Each scale needs its own reason.",
    motifs: [
      "Elevated dungeon view",
      "Encounter pockets",
      "Several timescales",
    ],
  },
  "loot-table": {
    title: "The improbable inventory",
    reference: "Diablo II · equipment, rarity and item properties",
    read: "One sought-after relic rises out of a field of ordinary possibilities. The inventory makes an abstract distribution tangible.",
    motifs: [
      "Slotted inventory",
      "A rare equipment silhouette",
      "Properties beyond appearance",
    ],
  },
  "the-checklist": {
    title: "The clockwork taskmaster",
    reference: "Diablo IV seasonal ranks · continuing-pass comparisons",
    read: "A seasonal track is bolted to a great clock. The gate at the end asks whether rewards must disappear when the clock turns.",
    motifs: ["Reward track", "Visible deadline", "A return route"],
  },
  "familiar-verbs": {
    title: "Same sword. Different problem.",
    reference: "Diablo II ↔ Diablo IV · encounter comparison",
    read: "Two tactical floors share an attack silhouette. Cover, threats and escape routes change the decision around it.",
    motifs: [
      "Elevated combat camera",
      "Health and resource orbs",
      "Changed encounter geometry",
    ],
  },
  access: {
    title: "The receipt is not the destination",
    reference: "Diablo IV campaign selection · expansion locks",
    read: "A paid key opens the outer door. A path and a second requirement can still remain inside.",
    motifs: ["Campaign doors", "Ownership locks", "Work after payment"],
  },
  identity: {
    title: "The wardrobe with no damage stat",
    reference: "Diablo IV · cosmetic storefront",
    read: "Three invented ceremonial armors display different selves. Their silhouettes change while the mechanical scale stays still.",
    motifs: [
      "Full-body armor presentation",
      "Set collections",
      "Appearance as value",
    ],
  },
  time: {
    title: "The long road and the side entrance",
    reference: "Warframe crafting/trade · Path of Exile storage",
    read: "Materials wind through a forge, an exchange crosses a bridge, and a trade booth joins the routes. All have conditions.",
    motifs: [
      "Crafting furnace",
      "Inventory drawers",
      "Parallel acquisition routes",
    ],
  },
  power: {
    title: "The monster or the market?",
    reference: "Diablo III auction-house design problem · Diablo II items",
    read: "The same imagined sword can come from an encounter or an exchange. The market changes the reason to face the monster.",
    motifs: [
      "Loot-bearing encounter",
      "Item exchange",
      "One outcome, competing activities",
    ],
  },
  "what-things-cost": {
    title: "The currency transmutation engine",
    reference: "Diablo IV · Platinum packs and CAD store",
    read: "Cash enters one hopper, tokens enter another chamber, and the item leaves a remainder behind.",
    motifs: ["Currency packs", "Item price", "Unspent token balance"],
  },
  "two-key-lock": {
    title: "The vault wants both keys",
    reference: "Diablo IV · 2025 Reliquary structure",
    read: "One key admits the player to the catalog. Another, earned through play, pays for the claim.",
    motifs: [
      "Catalog access",
      "Earned Favor",
      "A reservoir that can be refilled",
    ],
  },
  "abstraction-and-surface": {
    title: "Terms scattered across the altar",
    reference: "Diablo IV · purchase-path comprehension",
    read: "An imposing reward occupies the center while ownership, effort, time and cash sit on separate plates.",
    motifs: [
      "Reward preview",
      "Separated conditions",
      "A complete decision assembled",
    ],
  },
  "does-it-work": {
    title: "The instruments missed the person",
    reference: "Returning-player case · Diablo IV character selection",
    read: "A traveler stands between a cabinet of measurements and an open garden. The instruments describe parts of the return.",
    motifs: [
      "Returning character",
      "Competing measures",
      "Experience beyond the counter",
    ],
  },
};
