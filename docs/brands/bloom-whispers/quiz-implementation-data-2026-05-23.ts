// Bloom Whispers quiz implementation data draft.
// Scope: structured content/config only. This is not wired into the app.

type ResultId =
  | "hellebore"
  | "snowdrop"
  | "foxglove"
  | "iris"
  | "camellia"
  | "love_in_a_mist"
  | "heliotrope"
  | "bluebell"
  | "amaranth";

type SegmentId =
  | "restoration"
  | "renewal"
  | "protection"
  | "expression"
  | "creativity"
  | "devotion"
  | "resilience";

type IntentTagId =
  | "intent_meaning_seeker"
  | "intent_story_lover"
  | "intent_ritual_reflection"
  | "intent_gifter_occasion"
  | "intent_maker_creative"
  | "intent_grower_garden"
  | "intent_floral_finds";

type ScoreMap<T extends string> = Partial<Record<T, number>>;

export const quizConfig = {
  id: "flower_message_quiz",
  title: "What Flower Message Do You Need Right Now?",
  frameTemplate: "Your flower message is: {{flowerName}}",
  instruction:
    "Answer from instinct, not logic. Choose the image, feeling, or phrase that feels closest right now.",
  resultMode: "single_result_default",
  softGate: {
    enabled: true,
    previewBeforeEmail: true,
    showFullResultAfterEmailSubmit: true,
    allowReadHereInstead: true,
  },
  resultIds: [
    "hellebore",
    "snowdrop",
    "foxglove",
    "iris",
    "camellia",
    "love_in_a_mist",
    "heliotrope",
    "bluebell",
    "amaranth",
  ] satisfies ResultId[],
  questionIds: [
    "q1_garden_reason",
    "q2_quiet_signal",
    "q3_closest_door",
    "q4_drawn_to",
    "q5_flower_note",
    "q6_trusted_sign",
    "q7_save_for_later",
    "q8_useful_beauty",
  ],
  scoring: {
    resultScoreSource: "answer_scoring.results",
    segmentScoreSource: "answer_scoring.segments",
    intentScoreSource: "answer_scoring.intents",
    tieBreakNote:
      "Use result points for the flower result. Use segment points for analytics/content context. Use intent points for hidden email/content segmentation only.",
  },
} as const;

export const intentTags = {
  intent_meaning_seeker: {
    id: "intent_meaning_seeker",
    label: "Meaning seeker",
    description:
      "Wants to understand what flowers mean, symbolize, or represent.",
    futureInterests: [
      "flower meaning articles",
      "flower symbolism guides",
      "flower meanings by mood",
      "Flower Meanings & Occasions Guide",
      "printable flower meaning cards",
    ],
  },
  intent_story_lover: {
    id: "intent_story_lover",
    label: "Story lover",
    description:
      "Wants folklore, cultural stories, strange histories, botanical legends, or editorial flower writing.",
    futureInterests: [
      "Journal posts",
      "podcast episodes",
      "folklore emails",
      "flower history articles",
      "books or cultural references",
    ],
  },
  intent_ritual_reflection: {
    id: "intent_ritual_reflection",
    label: "Ritual and reflection",
    description:
      "Wants flower meanings as a reflection tool or gentle ritual.",
    futureInterests: [
      "flower rituals",
      "journaling prompts",
      "quiz results",
      "ritual cards",
      "ASMR/sensory flower content",
    ],
  },
  intent_gifter_occasion: {
    id: "intent_gifter_occasion",
    label: "Gifter and occasion planner",
    description:
      "Wants to choose the right flower for someone or a specific moment.",
    futureInterests: [
      "gifting guides",
      "occasion-based flower meanings",
      "sympathy, friendship, birthday, romance, and new beginning posts",
      "affiliate flower delivery or gift guides",
    ],
  },
  intent_maker_creative: {
    id: "intent_maker_creative",
    label: "Maker and creative",
    description: "Wants creative inspiration from flowers.",
    futureInterests: [
      "creative prompts",
      "pottery or ceramic flower objects",
      "art inspiration",
      "t-shirts",
      "visual/design content",
      "DIY-style content",
    ],
  },
  intent_grower_garden: {
    id: "intent_grower_garden",
    label: "Grower and garden seeker",
    description:
      "Wants to grow, plant, care for, or experience flowers in the real world.",
    futureInterests: [
      "seed kits",
      "beginner growing content",
      "garden guides",
      "seasonal planting",
      "flower care",
      "seed/garden affiliate partnerships",
    ],
  },
  intent_floral_finds: {
    id: "intent_floral_finds",
    label: "Floral finds seeker",
    description: "Likes curated unique flower things.",
    futureInterests: [
      "floral books",
      "botanical places",
      "flower streets/gardens/museums",
      "unique flower products",
      "curated finds",
      "shop/waitlist smoke tests",
    ],
  },
} as const;

export const sourceNotes = {
  greenaway_language_of_flowers: {
    id: "greenaway_language_of_flowers",
    label: "Kate Greenaway, Language of Flowers",
    url: "https://www.gutenberg.org/cache/epub/31591/pg31591-images.html",
    note:
      "Primary public-domain floriography source for the result flower meanings.",
  },
  dumont_language_of_flowers: {
    id: "dumont_language_of_flowers",
    label: "Henrietta Dumont, The Language of Flowers / The Floral Offering",
    url: "https://www.gutenberg.org/cache/epub/71779/pg71779-images.html",
    note:
      "Supporting public-domain flower-language source for Heliotrope, Camellia, and Amaranth meanings.",
  },
  smithsonian_language_of_flowers: {
    id: "smithsonian_language_of_flowers",
    label: "Smithsonian Gardens, The Language of Flowers",
    url: "https://gardens.si.edu/learn/blog/the-language-of-flowers/",
    note:
      "General context for Victorian flower language and symbolic flower exchange.",
  },
  cornell_greenaway_feature: {
    id: "cornell_greenaway_feature",
    label: "Cornell University Library, Language of Flowers - Kate Greenaway",
    url: "https://exhibits.library.cornell.edu/written-in-petals/feature/language-of-flowers-kate-greenaway",
    note:
      "Library context for Kate Greenaway's flower-language book and the genre.",
  },
  chicago_botanic_hellebores: {
    id: "chicago_botanic_hellebores",
    label: "Chicago Botanic Garden, Hellebores",
    url: "https://www.chicagobotanic.org/plant-information/plant-profiles/hellebores2",
    note:
      "Botanical and safety context for hellebores, including winter/early spring bloom and toxicity.",
  },
  cambridge_foxglove: {
    id: "cambridge_foxglove",
    label: "Cambridge University Botanic Garden, Foxglove",
    url: "https://www.botanic.cam.ac.uk/learning/trails/medicines/foxglove-digitalis-purpurea/",
    note:
      "Botanical and safety context for foxglove, including Digitalis/digoxin and toxicity.",
  },
  missouri_nigella: {
    id: "missouri_nigella",
    label: "Missouri Botanical Garden, Nigella damascena",
    url: "https://www.missouribotanicalgarden.org/PlantFinder/PlantFinderDetails.aspx?kempercode=b744",
    note:
      "Botanical description for Love-in-a-Mist, including fine foliage, blue flowers, and unusual seed capsules.",
  },
  missouri_iris: {
    id: "missouri_iris",
    label: "Missouri Botanical Garden, Iris fact sheet",
    url: "https://www.missouribotanicalgarden.org/Portals/0/Gardening/Gardening%20Help/Factsheets/Iris22.pdf",
    note:
      "Botanical and cultural context for Iris, including the name's connection with the Greek messenger Iris.",
  },
  woodland_trust_bluebell: {
    id: "woodland_trust_bluebell",
    label: "Woodland Trust, Bluebell",
    url: "https://www.woodlandtrust.org.uk/trees-woods-and-wildlife/plants/wild-flowers/bluebell/",
    note:
      "Bluebell folklore and symbolic associations such as humility, gratitude, constancy, and everlasting love.",
  },
} as const;

export const safetyNotes = {
  symbolic_meanings_not_universal: {
    id: "symbolic_meanings_not_universal",
    note:
      "Present flower meanings as historical or interpretive associations, not universal facts.",
  },
  symbolic_rituals_only: {
    id: "symbolic_rituals_only",
    note:
      "Quiz rituals are symbolic reflection practices only and should not suggest ingesting, applying, harvesting, or preparing plants.",
  },
  hellebore_toxic: {
    id: "hellebore_toxic",
    note:
      "Hellebore is toxic. Do not suggest ingestion, skin application, harvesting, teas, tinctures, oils, or remedies.",
  },
  foxglove_toxic: {
    id: "foxglove_toxic",
    note:
      "Foxglove is toxic and medicinally active. Do not suggest ingestion, skin application, harvesting, teas, tinctures, oils, or remedies.",
  },
  nigella_no_medicinal_claims: {
    id: "nigella_no_medicinal_claims",
    note:
      "Keep Love-in-a-Mist references ornamental/creative. Avoid edible or medicinal claims, and distinguish from other Nigella uses if needed.",
  },
} as const;

export const results = {
  hellebore: {
    id: "hellebore",
    flowerName: "Hellebore",
    segmentId: "restoration" satisfies SegmentId,
    segmentLabel: "Restoration",
    messageTitle: "You are allowed to rest here.",
    frame: "Your flower message is: Hellebore",
    intentAffinityIds: [
      "intent_ritual_reflection",
      "intent_meaning_seeker",
      "intent_floral_finds",
    ] satisfies IntentTagId[],
    preview: {
      flowerName: "Hellebore",
      messageTitle: "You are allowed to rest here.",
      teaser:
        "A winter bloom for the part of you that has been holding itself together too tightly.",
    },
    resultPage: {
      why:
        "You may be waiting for life to feel tidy before you let yourself breathe. Hellebore whispers that rest can begin in the middle of the cold, not only after everything is fixed.",
      symbolism:
        "Hellebore has long been tied to winter bloom and relief. Here, it becomes a reminder that softness can return before the season changes.",
      bloomWhispersMessage: "Let the night hold you for a while.",
      gentleReflection:
        "What would change if rest did not need a reason?",
      tinyRitual:
        "Put one unfinished thing down for tonight. Let it wait without asking for an apology.",
      exploreNext: [
        "Hellebore meaning",
        "winter rest ritual",
        "flowers that bloom in the cold",
      ],
    },
    email: {
      subject: "Your flower message: Hellebore",
      intro:
        "Your message is Hellebore, a winter flower for the part of you that needs a softer evening.",
      coreMessage: "You do not have to earn a softer evening.",
      symbolism:
        "Hellebore carries old associations with relief and winter bloom.",
      reflection: "Where are you treating rest like a reward?",
      tinyRitual: "Put one unfinished thing down for tonight.",
      cta: "Read the meaning behind your winter flower",
      expectation:
        "You will also receive occasional Bloom Whispers letters with meanings, folklore, rituals, seasonal notes, and floral finds.",
    },
    sourceNoteIds: [
      "greenaway_language_of_flowers",
      "chicago_botanic_hellebores",
    ],
    safetyNoteIds: [
      "symbolic_meanings_not_universal",
      "symbolic_rituals_only",
      "hellebore_toxic",
    ],
  },
  snowdrop: {
    id: "snowdrop",
    flowerName: "Snowdrop",
    segmentId: "renewal" satisfies SegmentId,
    segmentLabel: "Renewal",
    messageTitle: "Begin again, softly.",
    frame: "Your flower message is: Snowdrop",
    intentAffinityIds: [
      "intent_ritual_reflection",
      "intent_grower_garden",
      "intent_meaning_seeker",
    ] satisfies IntentTagId[],
    preview: {
      flowerName: "Snowdrop",
      messageTitle: "Begin again, softly.",
      teaser:
        "A small white bloom for the hope that arrives quietly and still counts.",
    },
    resultPage: {
      why:
        "Something in you may be starting over in a way no one else can see yet. Snowdrop whispers that a beginning can be tiny and still be real.",
      symbolism:
        "Snowdrop is often linked with hope and first signs of spring. Here, it carries the feeling of a small yes returning.",
      bloomWhispersMessage:
        "Start with the smallest sign of green.",
      gentleReflection:
        "Where has a little hope already found you?",
      tinyRitual:
        "Name one small thing that is different from before. Let that be enough for today.",
      exploreNext: [
        "Snowdrop meaning",
        "first spring flowers",
        "tiny rituals for new chapters",
      ],
    },
    email: {
      subject: "Your flower message: Snowdrop",
      intro: "Your message is Snowdrop, a small signal of hope returning.",
      coreMessage: "A small beginning is still a beginning.",
      symbolism: "Snowdrop is often linked with hope and first signs of spring.",
      reflection: "Where has hope already found a little opening?",
      tinyRitual: "Name one small thing that is different from before.",
      cta: "Explore more flowers for gentle beginnings",
      expectation:
        "Bloom Letters will arrive occasionally, softly, and with room to unsubscribe.",
    },
    sourceNoteIds: ["greenaway_language_of_flowers"],
    safetyNoteIds: ["symbolic_meanings_not_universal"],
  },
  foxglove: {
    id: "foxglove",
    flowerName: "Foxglove",
    segmentId: "protection" satisfies SegmentId,
    segmentLabel: "Protection",
    messageTitle: "Keep the tender thing guarded.",
    frame: "Your flower message is: Foxglove",
    intentAffinityIds: [
      "intent_story_lover",
      "intent_meaning_seeker",
      "intent_ritual_reflection",
    ] satisfies IntentTagId[],
    preview: {
      flowerName: "Foxglove",
      messageTitle: "Keep the tender thing guarded.",
      teaser:
        "A beautiful bell for the part of you learning where the boundary belongs.",
    },
    resultPage: {
      why:
        "You may be holding something delicate that needs a better edge around it. Foxglove whispers that protection does not have to make you hard. It can make you clear.",
      symbolism:
        "Foxglove carries old associations with warning and hidden signals. Here, it becomes a reminder to trust the quiet no before it has to get louder.",
      bloomWhispersMessage:
        "Your yes gets stronger when your no is allowed to exist.",
      gentleReflection:
        "Where have you been explaining a boundary that already knows itself?",
      tinyRitual:
        'Write one sentence that begins, "I am allowed to keep this protected."',
      exploreNext: [
        "Foxglove meaning",
        "fairy-bell folklore",
        "flowers with warnings",
      ],
    },
    email: {
      subject: "Your flower message: Foxglove",
      intro: "Your message is Foxglove, a beautiful bell with a boundary.",
      coreMessage: "The tender thing deserves a good gate.",
      symbolism:
        "Foxglove carries old associations with warning and hidden signals.",
      reflection: "Where does your quiet no already know itself?",
      tinyRitual:
        'Write "I am allowed to keep this protected" and let the sentence stand.',
      cta: "Keep exploring flowers with hidden messages",
      expectation:
        "Expect occasional flower meanings, stories, rituals, and finds.",
    },
    sourceNoteIds: ["greenaway_language_of_flowers", "cambridge_foxglove"],
    safetyNoteIds: [
      "symbolic_meanings_not_universal",
      "symbolic_rituals_only",
      "foxglove_toxic",
    ],
  },
  iris: {
    id: "iris",
    flowerName: "Iris",
    segmentId: "expression" satisfies SegmentId,
    segmentLabel: "Expression / voice",
    messageTitle: "Say the thing simply.",
    frame: "Your flower message is: Iris",
    intentAffinityIds: [
      "intent_meaning_seeker",
      "intent_maker_creative",
      "intent_ritual_reflection",
    ] satisfies IntentTagId[],
    preview: {
      flowerName: "Iris",
      messageTitle: "Say the thing simply.",
      teaser:
        "A messenger flower for the truth that wants a doorway, not a performance.",
    },
    resultPage: {
      why:
        "There may be a message in you that keeps getting dressed up, softened, or delayed. Iris whispers: let it come through cleanly. It does not need to arrive perfectly to arrive.",
      symbolism:
        "Iris has old ties to message and flame. Here, it is the flower of saying what wants to be said, with color and courage.",
      bloomWhispersMessage:
        "Let the message find its doorway.",
      gentleReflection:
        "What sentence keeps asking to be spoken plainly?",
      tinyRitual:
        "Write one clear sentence. Do not decorate it. Do not apologize for it.",
      exploreNext: [
        "Iris meaning",
        "flowers for voice",
        "writing prompts for the true thing",
      ],
    },
    email: {
      subject: "Your flower message: Iris",
      intro: "Your message is Iris, the flower of the message.",
      coreMessage: "Your message does not need a costume.",
      symbolism: "Iris is linked with message and flame.",
      reflection: "What clear sentence wants a doorway?",
      tinyRitual: "Write one clear sentence without decorating it.",
      cta: "Read more flower messages for voice and expression",
      expectation:
        "Bloom Letters bring gentle flower notes, not inbox clutter.",
    },
    sourceNoteIds: ["greenaway_language_of_flowers", "missouri_iris"],
    safetyNoteIds: ["symbolic_meanings_not_universal"],
  },
  camellia: {
    id: "camellia",
    flowerName: "Camellia",
    segmentId: "expression" satisfies SegmentId,
    segmentLabel: "Quiet visibility",
    messageTitle: "Let quiet beauty be enough.",
    frame: "Your flower message is: Camellia",
    intentAffinityIds: [
      "intent_floral_finds",
      "intent_maker_creative",
      "intent_meaning_seeker",
    ] satisfies IntentTagId[],
    preview: {
      flowerName: "Camellia",
      messageTitle: "Let quiet beauty be enough.",
      teaser:
        "A refined flower for being seen without becoming louder than yourself.",
    },
    resultPage: {
      why:
        "You may be ready to let something be visible without turning it into a performance. Camellia whispers that what is already lovely does not need to prove itself.",
      symbolism:
        "Camellia is linked with quiet excellence and loveliness. Here, it becomes a reminder to let good work stand without overexplaining it.",
      bloomWhispersMessage:
        "Let the graceful thing stand on its own.",
      gentleReflection:
        "Where are you adding explanations to something that is already enough?",
      tinyRitual:
        "Share, place, or finish one small thing without adding an apology.",
      exploreNext: [
        "Camellia meaning",
        "quiet excellence",
        "visibility without performance",
      ],
    },
    email: {
      subject: "Your flower message: Camellia",
      intro: "Your message is Camellia, a flower of quiet excellence.",
      coreMessage: "You do not have to become louder to be seen.",
      symbolism:
        "Camellia has been linked with quiet excellence and loveliness.",
      reflection: "Where are you explaining what can already stand?",
      tinyRitual: "Let one small good thing stand without apology.",
      cta: "Visit the garden of quiet confidence",
      expectation:
        "You will receive occasional Bloom Whispers notes and curated finds.",
    },
    sourceNoteIds: [
      "greenaway_language_of_flowers",
      "dumont_language_of_flowers",
    ],
    safetyNoteIds: ["symbolic_meanings_not_universal"],
  },
  love_in_a_mist: {
    id: "love_in_a_mist",
    flowerName: "Love-in-a-Mist",
    segmentId: "creativity" satisfies SegmentId,
    segmentLabel: "Creativity",
    messageTitle: "Follow the strange little spark.",
    frame: "Your flower message is: Love-in-a-Mist",
    intentAffinityIds: [
      "intent_maker_creative",
      "intent_story_lover",
      "intent_grower_garden",
    ] satisfies IntentTagId[],
    preview: {
      flowerName: "Love-in-a-Mist",
      messageTitle: "Follow the strange little spark.",
      teaser:
        "A blue tangle for the idea that does not make sense yet, but keeps glowing.",
    },
    resultPage: {
      why:
        "Something odd may be tugging at your attention before you know what it is for. Love-in-a-Mist whispers: follow the texture first. The meaning can arrive later.",
      symbolism:
        "Love-in-a-Mist is tied to perplexity and curious beauty. Here, it becomes permission to stay with the interesting thing before it becomes useful.",
      bloomWhispersMessage:
        "Let the odd little glimmer keep its mystery.",
      gentleReflection:
        "What keeps interesting you even though you cannot explain why?",
      tinyRitual:
        "Save three colors, words, or images that pull at you for no practical reason.",
      exploreNext: [
        "Love-in-a-Mist meaning",
        "unusual flowers",
        "creative spark ritual",
      ],
    },
    email: {
      subject: "Your flower message: Love-in-a-Mist",
      intro:
        "Your message is Love-in-a-Mist, a strange blue spark in fine green threads.",
      coreMessage: "Not every spark has to explain itself first.",
      symbolism:
        "Love-in-a-Mist has been linked with perplexity and curious beauty.",
      reflection: "What keeps interesting you for no obvious reason?",
      tinyRitual: "Save three beautiful fragments for no practical reason.",
      cta: "Find more strange little flower sparks",
      expectation:
        "Bloom Letters may include meanings, stories, rituals, and creative floral ideas.",
    },
    sourceNoteIds: ["greenaway_language_of_flowers", "missouri_nigella"],
    safetyNoteIds: [
      "symbolic_meanings_not_universal",
      "nigella_no_medicinal_claims",
    ],
  },
  heliotrope: {
    id: "heliotrope",
    flowerName: "Heliotrope",
    segmentId: "devotion" satisfies SegmentId,
    segmentLabel: "Chosen devotion",
    messageTitle: "Turn toward what warms you back.",
    frame: "Your flower message is: Heliotrope",
    intentAffinityIds: [
      "intent_gifter_occasion",
      "intent_meaning_seeker",
      "intent_ritual_reflection",
    ] satisfies IntentTagId[],
    preview: {
      flowerName: "Heliotrope",
      messageTitle: "Turn toward what warms you back.",
      teaser:
        "A flower of devotion for the care that wants to go where it can be received.",
    },
    resultPage: {
      why:
        "Your care may be reaching in many directions. Heliotrope whispers: notice what you keep turning toward, and notice what turns gently back.",
      symbolism:
        "Heliotrope is linked with devotion and faithful attention. Here, it asks where your care feels both given and received.",
      bloomWhispersMessage:
        "Let your care turn toward warmth.",
      gentleReflection:
        "What receives your attention with tenderness instead of taking it for granted?",
      tinyRitual:
        "Write two short lists: where my care goes, and where warmth returns.",
      exploreNext: [
        "Heliotrope meaning",
        "flowers for loyalty",
        "non-rose devotion flowers",
      ],
    },
    email: {
      subject: "Your flower message: Heliotrope",
      intro: "Your message is Heliotrope, a flower of faithful attention.",
      coreMessage: "Your devotion deserves somewhere warm to land.",
      symbolism: "Heliotrope is linked with devotion and faithful attention.",
      reflection: "What turns gently back toward your care?",
      tinyRitual:
        "Name one place your care goes and one place warmth returns.",
      cta: "Explore flowers for devotion and chosen care",
      expectation:
        "Occasional Bloom Letters will bring flower meanings, stories, rituals, and finds.",
    },
    sourceNoteIds: [
      "greenaway_language_of_flowers",
      "dumont_language_of_flowers",
    ],
    safetyNoteIds: [
      "symbolic_meanings_not_universal",
      "symbolic_rituals_only",
    ],
  },
  bluebell: {
    id: "bluebell",
    flowerName: "Bluebell",
    segmentId: "devotion" satisfies SegmentId,
    segmentLabel: "Quiet loyalty",
    messageTitle: "Stay true to the quiet thing.",
    frame: "Your flower message is: Bluebell",
    intentAffinityIds: [
      "intent_story_lover",
      "intent_gifter_occasion",
      "intent_ritual_reflection",
    ] satisfies IntentTagId[],
    preview: {
      flowerName: "Bluebell",
      messageTitle: "Stay true to the quiet thing.",
      teaser:
        "A woodland bloom for loyalty, gratitude, and love that does not need a spotlight.",
    },
    resultPage: {
      why:
        "Something quiet may be asking for your faithfulness. Bluebell whispers that what is real does not always announce itself. Some bonds bloom softly and still matter deeply.",
      symbolism:
        "Bluebell is often linked with constancy, humility, and gratitude. Here, it carries the beauty of staying tender with what is true.",
      bloomWhispersMessage: "Keep faith with the small true thing.",
      gentleReflection: "What quiet loyalty deserves more tenderness?",
      tinyRitual:
        "Write one sentence of gratitude. Send it only if that feels right.",
      exploreNext: [
        "Bluebell meaning",
        "woodland folklore",
        "flowers for friendship",
      ],
    },
    email: {
      subject: "Your flower message: Bluebell",
      intro: "Your message is Bluebell, a woodland note of constancy.",
      coreMessage: "The quiet true thing still counts.",
      symbolism: "Bluebell is linked with constancy, humility, and gratitude.",
      reflection: "What quiet bond deserves a little more tenderness?",
      tinyRitual: "Write one sentence of gratitude.",
      cta: "Read more about quiet loyalty in flower language",
      expectation:
        "Bloom Letters arrive occasionally with meaningful floral notes.",
    },
    sourceNoteIds: ["greenaway_language_of_flowers", "woodland_trust_bluebell"],
    safetyNoteIds: ["symbolic_meanings_not_universal"],
  },
  amaranth: {
    id: "amaranth",
    flowerName: "Amaranth",
    segmentId: "resilience" satisfies SegmentId,
    segmentLabel: "Resilience",
    messageTitle: "Let what matters endure.",
    frame: "Your flower message is: Amaranth",
    intentAffinityIds: [
      "intent_meaning_seeker",
      "intent_ritual_reflection",
      "intent_floral_finds",
    ] satisfies IntentTagId[],
    preview: {
      flowerName: "Amaranth",
      messageTitle: "Let what matters endure.",
      teaser: "An unfading flower for the strength that can stay tender.",
    },
    resultPage: {
      why:
        "You may be carrying something that has survived more than it shows. Amaranth whispers that endurance does not have to be harsh. Some things last because they stay tender.",
      symbolism:
        "Amaranth is linked with what is unfading. Here, it becomes a reminder that what matters can endure without turning cold.",
      bloomWhispersMessage:
        "The tender thing that survives belongs to your future.",
      gentleReflection:
        "What part of you has lasted longer than you give it credit for?",
      tinyRitual:
        "Choose one small object as a witness to what has endured. Keep it near you today.",
      exploreNext: [
        "Amaranth meaning",
        "dried flowers",
        "flowers for resilience",
      ],
    },
    email: {
      subject: "Your flower message: Amaranth",
      intro: "Your message is Amaranth, the unfading flower.",
      coreMessage: "What matters in you is still here.",
      symbolism:
        "Amaranth is linked with what is unfading and lasting.",
      reflection: "What has lasted in you longer than you noticed?",
      tinyRitual: "Keep one small object nearby as a witness.",
      cta: "Explore flowers for what endures",
      expectation:
        "You will receive occasional Bloom Whispers letters with meanings, rituals, seasonal notes, and unique floral finds.",
    },
    sourceNoteIds: [
      "greenaway_language_of_flowers",
      "dumont_language_of_flowers",
    ],
    safetyNoteIds: ["symbolic_meanings_not_universal"],
  },
} as const;

export const questions = [
  {
    id: "q1_garden_reason",
    prompt: "What brought you into the garden today?",
    answerIds: [
      "q1_meaning",
      "q1_story",
      "q1_ritual",
      "q1_gift",
      "q1_creative",
      "q1_grow",
      "q1_finds",
    ],
  },
  {
    id: "q2_quiet_signal",
    prompt: "What quiet signal has been finding you lately?",
    answerIds: [
      "q2_cold_room",
      "q2_green_point",
      "q2_bell_path",
      "q2_violet_flame",
      "q2_library_window",
      "q2_blue_threads",
      "q2_dried_color",
    ],
  },
  {
    id: "q3_closest_door",
    prompt: "Which doorway feels closest right now?",
    answerIds: [
      "q3_quieter_evening",
      "q3_spring_light",
      "q3_close_without_explaining",
      "q3_sentence_clean",
      "q3_work_speaks",
      "q3_odd_music",
      "q3_beloved_return",
    ],
  },
  {
    id: "q4_drawn_to",
    prompt: "What are you reaching for right now?",
    answerIds: [
      "q4_moonlit_softness",
      "q4_first_flowers",
      "q4_warning_inside",
      "q4_message_color",
      "q4_quiet_elegance",
      "q4_weird_flowers",
      "q4_woodland_bells",
      "q4_dried_petals",
    ],
  },
  {
    id: "q5_flower_note",
    prompt: "If a flower left a note for you tonight, what would you hope it said?",
    answerIds: [
      "q5_rest_before_mended",
      "q5_small_beginnings",
      "q5_good_gate",
      "q5_clear_thing",
      "q5_work_without_apology",
      "q5_odd_glimmer",
      "q5_hold_your_care",
      "q5_quiet_true",
      "q5_matters_last",
    ],
  },
  {
    id: "q6_trusted_sign",
    prompt: "Which small sign would you trust if it appeared today?",
    answerIds: [
      "q6_candle_lower",
      "q6_white_flower",
      "q6_narrow_path",
      "q6_honest_letter",
      "q6_finished_object",
      "q6_unexplained_color",
      "q6_familiar_name",
      "q6_pressed_flower",
    ],
  },
  {
    id: "q7_save_for_later",
    prompt: "Which note would you tuck away for later?",
    answerIds: [
      "q7_meaning_guide",
      "q7_strange_story",
      "q7_tiny_ritual",
      "q7_gifting_guide",
      "q7_garden_note",
      "q7_creative_prompt",
      "q7_floral_finds",
    ],
  },
  {
    id: "q8_useful_beauty",
    prompt: "What kind of beauty would help you today?",
    answerIds: [
      "q8_quieter_room",
      "q8_tomorrow_possible",
      "q8_discernment",
      "q8_unsaid_language",
      "q8_stand_on_own",
      "q8_invites_play",
      "q8_turn_face",
      "q8_survives_season",
    ],
  },
] as const;

export const answers = {
  q1_meaning: {
    id: "q1_meaning",
    questionId: "q1_garden_reason",
    label: "I wanted a flower to mean something back to me.",
  },
  q1_story: {
    id: "q1_story",
    questionId: "q1_garden_reason",
    label: "I came for old stories and hidden meanings.",
  },
  q1_ritual: {
    id: "q1_ritual",
    questionId: "q1_garden_reason",
    label: "I wanted a small ritual to hold onto.",
  },
  q1_gift: {
    id: "q1_gift",
    questionId: "q1_garden_reason",
    label: "I am choosing something beautiful for someone else.",
  },
  q1_creative: {
    id: "q1_creative",
    questionId: "q1_garden_reason",
    label: "I needed color, shape, or a little creative spark.",
  },
  q1_grow: {
    id: "q1_grow",
    questionId: "q1_garden_reason",
    label: "I want to grow, tend, or learn from flowers.",
  },
  q1_finds: {
    id: "q1_finds",
    questionId: "q1_garden_reason",
    label: "I just wanted more flower magic in my day.",
  },
  q2_cold_room: {
    id: "q2_cold_room",
    questionId: "q2_quiet_signal",
    label: "A pale bloom in a room that finally got quiet.",
  },
  q2_green_point: {
    id: "q2_green_point",
    questionId: "q2_quiet_signal",
    label: "A green point pushing through old weather.",
  },
  q2_bell_path: {
    id: "q2_bell_path",
    questionId: "q2_quiet_signal",
    label: "A bell-shaped flower at the edge of the path.",
  },
  q2_violet_flame: {
    id: "q2_violet_flame",
    questionId: "q2_quiet_signal",
    label: "A violet-blue spark of something unsaid.",
  },
  q2_library_window: {
    id: "q2_library_window",
    questionId: "q2_quiet_signal",
    label: "A polished bloom glowing in a dark window.",
  },
  q2_blue_threads: {
    id: "q2_blue_threads",
    questionId: "q2_quiet_signal",
    label: "A strange blue flower tangled in fine green threads.",
  },
  q2_dried_color: {
    id: "q2_dried_color",
    questionId: "q2_quiet_signal",
    label: "A dried flower still keeping its color.",
  },
  q3_quieter_evening: {
    id: "q3_quieter_evening",
    questionId: "q3_closest_door",
    label: "The one that leads to a quieter evening.",
  },
  q3_spring_light: {
    id: "q3_spring_light",
    questionId: "q3_closest_door",
    label: "The one with a little spring light under it.",
  },
  q3_close_without_explaining: {
    id: "q3_close_without_explaining",
    questionId: "q3_closest_door",
    label: "The one I can close without explaining why.",
  },
  q3_sentence_clean: {
    id: "q3_sentence_clean",
    questionId: "q3_closest_door",
    label: "The one where the sentence finally comes out clean.",
  },
  q3_work_speaks: {
    id: "q3_work_speaks",
    questionId: "q3_closest_door",
    label: "The one where the work speaks before I do.",
  },
  q3_odd_music: {
    id: "q3_odd_music",
    questionId: "q3_closest_door",
    label: "The one with odd music behind it.",
  },
  q3_beloved_return: {
    id: "q3_beloved_return",
    questionId: "q3_closest_door",
    label: "The one leading back to something quietly beloved.",
  },
  q4_moonlit_softness: {
    id: "q4_moonlit_softness",
    questionId: "q4_drawn_to",
    label: "Moonlit softness and room to exhale.",
  },
  q4_first_flowers: {
    id: "q4_first_flowers",
    questionId: "q4_drawn_to",
    label: "First flowers and a gentle beginning.",
  },
  q4_warning_inside: {
    id: "q4_warning_inside",
    questionId: "q4_drawn_to",
    label: "Beauty with a warning tucked inside.",
  },
  q4_message_color: {
    id: "q4_message_color",
    questionId: "q4_drawn_to",
    label: "Color that feels like a message arriving.",
  },
  q4_quiet_elegance: {
    id: "q4_quiet_elegance",
    questionId: "q4_drawn_to",
    label: "Quiet elegance that does not ask permission.",
  },
  q4_weird_flowers: {
    id: "q4_weird_flowers",
    questionId: "q4_drawn_to",
    label: "Odd flowers, seed pods, and strange little ideas.",
  },
  q4_woodland_bells: {
    id: "q4_woodland_bells",
    questionId: "q4_drawn_to",
    label: "Woodland bells, gratitude notes, and loyal things.",
  },
  q4_dried_petals: {
    id: "q4_dried_petals",
    questionId: "q4_drawn_to",
    label: "Dried petals, lasting color, and what remains.",
  },
  q5_rest_before_mended: {
    id: "q5_rest_before_mended",
    questionId: "q5_flower_note",
    label: "You may rest before everything is mended.",
  },
  q5_small_beginnings: {
    id: "q5_small_beginnings",
    questionId: "q5_flower_note",
    label: "Small beginnings still count.",
  },
  q5_good_gate: {
    id: "q5_good_gate",
    questionId: "q5_flower_note",
    label: "Keep the tender thing behind a good gate.",
  },
  q5_clear_thing: {
    id: "q5_clear_thing",
    questionId: "q5_flower_note",
    label: "Say the clear thing while it is still warm.",
  },
  q5_work_without_apology: {
    id: "q5_work_without_apology",
    questionId: "q5_flower_note",
    label: "Let the beautiful work stand without apology.",
  },
  q5_odd_glimmer: {
    id: "q5_odd_glimmer",
    questionId: "q5_flower_note",
    label: "Follow the odd little glimmer.",
  },
  q5_hold_your_care: {
    id: "q5_hold_your_care",
    questionId: "q5_flower_note",
    label: "Turn toward what can hold your care.",
  },
  q5_quiet_true: {
    id: "q5_quiet_true",
    questionId: "q5_flower_note",
    label: "What is quiet can still be true.",
  },
  q5_matters_last: {
    id: "q5_matters_last",
    questionId: "q5_flower_note",
    label: "What matters can last softly.",
  },
  q6_candle_lower: {
    id: "q6_candle_lower",
    questionId: "q6_trusted_sign",
    label: "A candle burning lower, not brighter.",
  },
  q6_white_flower: {
    id: "q6_white_flower",
    questionId: "q6_trusted_sign",
    label: "One white flower where there was only ground.",
  },
  q6_narrow_path: {
    id: "q6_narrow_path",
    questionId: "q6_trusted_sign",
    label: "A path becoming narrower in a helpful way.",
  },
  q6_honest_letter: {
    id: "q6_honest_letter",
    questionId: "q6_trusted_sign",
    label: "A letter with the first honest line already written.",
  },
  q6_finished_object: {
    id: "q6_finished_object",
    questionId: "q6_trusted_sign",
    label: "A finished object waiting quietly on the table.",
  },
  q6_unexplained_color: {
    id: "q6_unexplained_color",
    questionId: "q6_trusted_sign",
    label: "A color combination I cannot explain.",
  },
  q6_familiar_name: {
    id: "q6_familiar_name",
    questionId: "q6_trusted_sign",
    label: "A familiar name arriving gently.",
  },
  q6_pressed_flower: {
    id: "q6_pressed_flower",
    questionId: "q6_trusted_sign",
    label: "A pressed flower keeping its shape.",
  },
  q7_meaning_guide: {
    id: "q7_meaning_guide",
    questionId: "q7_save_for_later",
    label: "A flower meaning for a mood or moment.",
  },
  q7_strange_story: {
    id: "q7_strange_story",
    questionId: "q7_save_for_later",
    label: "A strange old flower story.",
  },
  q7_tiny_ritual: {
    id: "q7_tiny_ritual",
    questionId: "q7_save_for_later",
    label: "A tiny ritual with a journaling prompt.",
  },
  q7_gifting_guide: {
    id: "q7_gifting_guide",
    questionId: "q7_save_for_later",
    label: "A guide to choosing flowers for someone else.",
  },
  q7_garden_note: {
    id: "q7_garden_note",
    questionId: "q7_save_for_later",
    label: "A seed, garden, or seasonal flower note.",
  },
  q7_creative_prompt: {
    id: "q7_creative_prompt",
    questionId: "q7_save_for_later",
    label: "A creative prompt from an unusual bloom.",
  },
  q7_floral_finds: {
    id: "q7_floral_finds",
    questionId: "q7_save_for_later",
    label: "A list of floral books, places, objects, or finds.",
  },
  q8_quieter_room: {
    id: "q8_quieter_room",
    questionId: "q8_useful_beauty",
    label: "Beauty that lets the room get quieter.",
  },
  q8_tomorrow_possible: {
    id: "q8_tomorrow_possible",
    questionId: "q8_useful_beauty",
    label: "Beauty that makes tomorrow feel possible.",
  },
  q8_discernment: {
    id: "q8_discernment",
    questionId: "q8_useful_beauty",
    label: "Beauty that teaches me what to protect.",
  },
  q8_unsaid_language: {
    id: "q8_unsaid_language",
    questionId: "q8_useful_beauty",
    label: "Beauty that gives language to the unsaid.",
  },
  q8_stand_on_own: {
    id: "q8_stand_on_own",
    questionId: "q8_useful_beauty",
    label: "Beauty that can stand on its own.",
  },
  q8_invites_play: {
    id: "q8_invites_play",
    questionId: "q8_useful_beauty",
    label: "Beauty that invites a little play.",
  },
  q8_turn_face: {
    id: "q8_turn_face",
    questionId: "q8_useful_beauty",
    label: "Beauty that knows where to turn its face.",
  },
  q8_survives_season: {
    id: "q8_survives_season",
    questionId: "q8_useful_beauty",
    label: "Beauty that survives the season.",
  },
} as const;

export const scoring = {
  q1_meaning: { intents: { intent_meaning_seeker: 3 } },
  q1_story: { intents: { intent_story_lover: 3 } },
  q1_ritual: { intents: { intent_ritual_reflection: 3 } },
  q1_gift: { intents: { intent_gifter_occasion: 3 } },
  q1_creative: { intents: { intent_maker_creative: 3 } },
  q1_grow: { intents: { intent_grower_garden: 3 } },
  q1_finds: { intents: { intent_floral_finds: 3 } },
  q2_cold_room: {
    results: { hellebore: 2, snowdrop: 1 },
    segments: { restoration: 2, renewal: 1 },
  },
  q2_green_point: {
    results: { snowdrop: 2, amaranth: 1 },
    segments: { renewal: 2, resilience: 1 },
  },
  q2_bell_path: {
    results: { foxglove: 2, bluebell: 1 },
    segments: { protection: 2, devotion: 1 },
  },
  q2_violet_flame: {
    results: { iris: 2, love_in_a_mist: 1 },
    segments: { expression: 2, creativity: 1 },
  },
  q2_library_window: {
    results: { camellia: 2 },
    segments: { expression: 2 },
    intents: { intent_floral_finds: 1 },
  },
  q2_blue_threads: {
    results: { love_in_a_mist: 2 },
    segments: { creativity: 2 },
    intents: { intent_maker_creative: 1 },
  },
  q2_dried_color: {
    results: { amaranth: 2, hellebore: 1 },
    segments: { resilience: 2, restoration: 1 },
  },
  q3_quieter_evening: {
    results: { hellebore: 2, foxglove: 1 },
    segments: { restoration: 2, protection: 1 },
  },
  q3_spring_light: {
    results: { snowdrop: 2 },
    segments: { renewal: 2 },
  },
  q3_close_without_explaining: {
    results: { foxglove: 2 },
    segments: { protection: 2 },
  },
  q3_sentence_clean: {
    results: { iris: 2, heliotrope: 1 },
    segments: { expression: 2, devotion: 1 },
  },
  q3_work_speaks: {
    results: { camellia: 2, iris: 1 },
    segments: { expression: 2 },
  },
  q3_odd_music: {
    results: { love_in_a_mist: 2 },
    segments: { creativity: 2 },
  },
  q3_beloved_return: {
    results: { bluebell: 2, heliotrope: 1 },
    segments: { devotion: 2 },
  },
  q4_moonlit_softness: {
    results: { hellebore: 2 },
    segments: { restoration: 2 },
    intents: { intent_ritual_reflection: 1 },
  },
  q4_first_flowers: {
    results: { snowdrop: 2 },
    segments: { renewal: 2 },
    intents: { intent_grower_garden: 1 },
  },
  q4_warning_inside: {
    results: { foxglove: 2 },
    segments: { protection: 2 },
    intents: { intent_story_lover: 1 },
  },
  q4_message_color: {
    results: { iris: 2 },
    segments: { expression: 2 },
    intents: { intent_meaning_seeker: 1 },
  },
  q4_quiet_elegance: {
    results: { camellia: 2 },
    segments: { expression: 2 },
    intents: { intent_floral_finds: 1 },
  },
  q4_weird_flowers: {
    results: { love_in_a_mist: 2 },
    segments: { creativity: 2 },
    intents: { intent_maker_creative: 2 },
  },
  q4_woodland_bells: {
    results: { bluebell: 2 },
    segments: { devotion: 2 },
    intents: { intent_story_lover: 1 },
  },
  q4_dried_petals: {
    results: { amaranth: 2 },
    segments: { resilience: 2 },
  },
  q5_rest_before_mended: {
    results: { hellebore: 2 },
    segments: { restoration: 2 },
  },
  q5_small_beginnings: {
    results: { snowdrop: 2 },
    segments: { renewal: 2 },
  },
  q5_good_gate: {
    results: { foxglove: 2 },
    segments: { protection: 2 },
  },
  q5_clear_thing: {
    results: { iris: 2 },
    segments: { expression: 2 },
  },
  q5_work_without_apology: {
    results: { camellia: 2 },
    segments: { expression: 2 },
  },
  q5_odd_glimmer: {
    results: { love_in_a_mist: 2 },
    segments: { creativity: 2 },
  },
  q5_hold_your_care: {
    results: { heliotrope: 2 },
    segments: { devotion: 2 },
  },
  q5_quiet_true: {
    results: { bluebell: 2 },
    segments: { devotion: 2 },
  },
  q5_matters_last: {
    results: { amaranth: 2 },
    segments: { resilience: 2 },
  },
  q6_candle_lower: {
    results: { hellebore: 2 },
    segments: { restoration: 2 },
  },
  q6_white_flower: {
    results: { snowdrop: 2 },
    segments: { renewal: 2 },
  },
  q6_narrow_path: {
    results: { foxglove: 2 },
    segments: { protection: 2 },
  },
  q6_honest_letter: {
    results: { iris: 2, heliotrope: 1 },
    segments: { expression: 2 },
  },
  q6_finished_object: {
    results: { camellia: 2 },
    segments: { expression: 2 },
    intents: { intent_maker_creative: 1 },
  },
  q6_unexplained_color: {
    results: { love_in_a_mist: 2 },
    segments: { creativity: 2 },
  },
  q6_familiar_name: {
    results: { bluebell: 2, heliotrope: 1 },
    segments: { devotion: 2 },
  },
  q6_pressed_flower: {
    results: { amaranth: 2 },
    segments: { resilience: 2 },
  },
  q7_meaning_guide: { intents: { intent_meaning_seeker: 3 } },
  q7_strange_story: { intents: { intent_story_lover: 3 } },
  q7_tiny_ritual: { intents: { intent_ritual_reflection: 3 } },
  q7_gifting_guide: { intents: { intent_gifter_occasion: 3 } },
  q7_garden_note: { intents: { intent_grower_garden: 3 } },
  q7_creative_prompt: { intents: { intent_maker_creative: 3 } },
  q7_floral_finds: { intents: { intent_floral_finds: 3 } },
  q8_quieter_room: {
    results: { hellebore: 2 },
    segments: { restoration: 2 },
  },
  q8_tomorrow_possible: {
    results: { snowdrop: 2, amaranth: 1 },
    segments: { renewal: 2 },
  },
  q8_discernment: {
    results: { foxglove: 2 },
    segments: { protection: 2 },
  },
  q8_unsaid_language: {
    results: { iris: 2 },
    segments: { expression: 2 },
  },
  q8_stand_on_own: {
    results: { camellia: 2 },
    segments: { expression: 2 },
  },
  q8_invites_play: {
    results: { love_in_a_mist: 2 },
    segments: { creativity: 2 },
  },
  q8_turn_face: {
    results: { heliotrope: 2, bluebell: 1 },
    segments: { devotion: 2 },
  },
  q8_survives_season: {
    results: { amaranth: 2 },
    segments: { resilience: 2 },
  },
} satisfies Record<
  keyof typeof answers,
  {
    results?: ScoreMap<ResultId>;
    segments?: ScoreMap<SegmentId>;
    intents?: ScoreMap<IntentTagId>;
  }
>;

export const powerDuos = [
  {
    id: "hellebore_foxglove",
    resultIds: ["hellebore", "foxglove"] satisfies [ResultId, ResultId],
    messageTitle: "Rest is easier when your edges are honored.",
    previewTeaser:
      "A winter flower and a warning bell for the part of you that needs both softness and a good gate.",
    trigger: {
      maxPointGap: 1,
      minEachResultScore: 5,
      approvedPairing: true,
      intentTagsCannotTrigger: true,
      liveAdjustment:
        "If Power Duos appear in more than 15% of testing or live results, raise minEachResultScore to 6.",
    },
  },
  {
    id: "snowdrop_amaranth",
    resultIds: ["snowdrop", "amaranth"] satisfies [ResultId, ResultId],
    messageTitle: "Start small. What matters can still last.",
    previewTeaser:
      "A first flower and an unfading flower for the beginning that wants to stay tender.",
    trigger: {
      maxPointGap: 1,
      minEachResultScore: 5,
      approvedPairing: true,
      intentTagsCannotTrigger: true,
      liveAdjustment:
        "If Power Duos appear in more than 15% of testing or live results, raise minEachResultScore to 6.",
    },
  },
  {
    id: "iris_heliotrope",
    resultIds: ["iris", "heliotrope"] satisfies [ResultId, ResultId],
    messageTitle: "Let your devotion have a voice.",
    previewTeaser:
      "A messenger flower and a flower of faithful attention for the care that wants clear words.",
    trigger: {
      maxPointGap: 1,
      minEachResultScore: 5,
      approvedPairing: true,
      intentTagsCannotTrigger: true,
      liveAdjustment:
        "If Power Duos appear in more than 15% of testing or live results, raise minEachResultScore to 6.",
    },
  },
  {
    id: "camellia_love_in_a_mist",
    resultIds: ["camellia", "love_in_a_mist"] satisfies [ResultId, ResultId],
    messageTitle: "Let the strange refined thing stand on its own.",
    previewTeaser:
      "A polished bloom and a strange little spark for the work that is ready to be seen.",
    trigger: {
      maxPointGap: 1,
      minEachResultScore: 5,
      approvedPairing: true,
      intentTagsCannotTrigger: true,
      requiredIntentMinimums: { intent_maker_creative: 4 },
      liveAdjustment:
        "If Power Duos appear in more than 15% of testing or live results, raise minEachResultScore to 6.",
    },
  },
] as const;

export const emailCaptureCopy = {
  previewHeading: "Your flower message is ready",
  prompt: "Where should the garden send your full note?",
  supportCopy:
    "We will send your complete flower message, reflection prompt, and tiny ritual. You will also receive occasional Bloom Whispers letters with flower meanings, folklore, rituals, seasonal notes, and unique floral finds. No spam, no pressure.",
  cta: "Send my flower message",
  secondaryLink: "Keep reading here",
  fields: {
    email: {
      id: "email",
      label: "Email address",
      required: true,
    },
  },
} as const;

export const implementationNotes = {
  resultSelection:
    "Choose the highest result score by default. If a Power Duo trigger qualifies, show the approved duo instead of a single result.",
  powerDuoFrequency:
    "Power Duos should be rare. Test with at least 20-30 fake paths before launch. If they appear more than 15% of the time, raise minEachResultScore from 5 to 6.",
  intentTags:
    "Intent tags are hidden from the user and should be used for email/content segmentation only.",
  answerCopy:
    "Use answers[id].label for visible UI. Do not expose scoring, intent tags, source notes, or safety notes in the quiz UI.",
  safety:
    "Keep toxic or medicinally active flower rituals symbolic only.",
} as const;
