export type ArticleSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  snippet?: {
    title: string;
    text: string;
  };
};

export type JournalFaq = {
  question: string;
  answer: string;
};

export type RelatedJournalPost = {
  title: string;
  href: string;
  label: string;
};

export type JournalPost = {
  slug: string;
  legacyPaths: string[];
  title: string;
  seoTitle: string;
  description: string;
  category: string;
  categoryId: "meanings" | "profiles" | "stories" | "food" | "podcast" | "guides";
  date: string;
  updated: string;
  datePublished: string;
  dateModified: string;
  readTime: string;
  author: string;
  sourceUrl: string;
  heroImage: string;
  heroImageAlt: string;
  quickAnswer: string;
  inShort: string[];
  keyTakeaways: string[];
  sections: ArticleSection[];
  faqs: JournalFaq[];
  related: RelatedJournalPost[];
};

const author = "Susycid";

const fallbackRelated: RelatedJournalPost[] = [
  {
    title: "The Story of the Hibiscus Flower",
    href: "/2025/10/28/hibiscus-flower-meaning/",
    label: "Flower Meanings",
  },
  {
    title: "Spider Lily Colors & Meanings",
    href: "/spider-lily-colors-meanings/",
    label: "Flower Meanings",
  },
  {
    title: "Flower Therapy: The Healing Power of Flowers",
    href: "/flower-therapy-healing-power-of-flowers/",
    label: "Podcast",
  },
];

function source(path: string) {
  return `https://bloomwhispers.com${path}`;
}

function image(path: string) {
  return `https://bloomwhispers.com/wp-content/uploads/${path}`;
}

function makePost(post: JournalPost): JournalPost {
  return post;
}

export const journalPosts: JournalPost[] = [
  makePost({
    slug: "spider-lily-floral-arrangement-ideas",
    legacyPaths: ["/spider-lily-floral-arrangement-ideas/"],
    title: "12 Spider Lily Floral Arrangement Ideas That Feel Like Autumn Magic",
    seoTitle: "12 Spider Lily Floral Arrangement Ideas That Feel Like Autumn Magic",
    description:
      "Explore spider lily arrangement ideas for dramatic autumn florals, symbolic bouquets, and moody seasonal styling.",
    category: "Guides & Rituals",
    categoryId: "guides",
    date: "Mar 23, 2026",
    updated: "Mar 23, 2026",
    datePublished: "2026-03-23",
    dateModified: "2026-03-23",
    readTime: "7 min read",
    author,
    sourceUrl: source("/spider-lily-floral-arrangement-ideas/"),
    heroImage: image("2026/03/Spider-lily-arrangement.jpg"),
    heroImageAlt: "Spider lily arrangement ideas editorial graphic",
    quickAnswer:
      "Spider lilies work beautifully in arrangements that leave room around their sculptural stems. Pair them with branches, grasses, deep foliage, or quiet vessels so their shape can speak.",
    inShort: [
      "Spider lilies feel strongest when the arrangement gives them space.",
      "They pair well with autumn foliage, moss, branches, and dark ceramic vessels.",
      "Use them when you want a floral design that feels symbolic, dramatic, and a little mysterious.",
      "Keep the styling simple so the flower’s unusual shape remains the focus.",
    ],
    keyTakeaways: [
      "Spider lilies are best treated as statement flowers, not filler.",
      "Low bowls, ikebana-inspired vessels, and narrow neck vases help their stems feel intentional.",
      "Red spider lilies create a strong autumn mood; white ones feel softer and more memorial.",
      "Their symbolism makes them especially suited to seasonal altars, entryways, and reflective displays.",
    ],
    sections: [
      {
        id: "style",
        title: "How to style spider lilies beautifully",
        paragraphs: [
          "Spider lilies have a shape that already feels designed. Their long filaments, bare stems, and sudden burst of color can become messy if the arrangement is overfilled.",
          "Let the flower have negative space. A few stems in a dark vase can feel more memorable than a crowded bouquet.",
        ],
        snippet: {
          title: "Bloom Whispers note",
          text: "Spider lilies do not need many companions. They already know how to make an entrance.",
        },
      },
      {
        id: "ideas",
        title: "Spider lily arrangement ideas",
        bullets: [
          "A single red spider lily in a narrow black vase.",
          "Spider lilies with dried grasses and curved branches.",
          "A low autumn bowl with moss, stones, and three sculptural stems.",
          "White spider lilies with eucalyptus for a quieter memorial mood.",
          "Red spider lilies beside candles for a seasonal table or entryway.",
        ],
      },
      {
        id: "occasions",
        title: "Where spider lilies fit best",
        paragraphs: [
          "These flowers are best for arrangements that want atmosphere. They suit autumn gatherings, story-rich displays, creative photoshoots, symbolic altars, and quiet corners where one bloom can hold attention.",
          "Because spider lilies carry strong cultural associations, they are better used thoughtfully than casually.",
        ],
      },
    ],
    faqs: [
      {
        question: "Are spider lilies good for bouquets?",
        answer:
          "Yes, but they work best in sparse, sculptural bouquets where their unusual shape can stand out.",
      },
      {
        question: "What should I pair with red spider lilies?",
        answer:
          "Try dark foliage, branches, dried grasses, moss, or simple greenery rather than many competing flowers.",
      },
      {
        question: "Do spider lilies have strong symbolism?",
        answer:
          "Yes. They are often linked with memory, farewell, transition, and autumn, especially in Japanese symbolism.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "spider-lily-in-anime",
    legacyPaths: ["/spider-lily-in-anime/"],
    title: "Spider Lily in Anime & Pop Culture",
    seoTitle: "Spider Lily in Anime: Meaning, Symbolism, and Pop Culture",
    description:
      "Discover why the red spider lily appears so often in anime, manga, games, and visual storytelling.",
    category: "Folklore & Stories",
    categoryId: "stories",
    date: "Mar 23, 2026",
    updated: "Mar 23, 2026",
    datePublished: "2026-03-23",
    dateModified: "2026-03-23",
    readTime: "8 min read",
    author,
    sourceUrl: source("/spider-lily-in-anime/"),
    heroImage: image("2026/03/Spider-Lily-in-Anime.jpg"),
    heroImageAlt: "Spider lily in anime editorial graphic",
    quickAnswer:
      "In anime, spider lilies usually signal farewell, death, memory, rebirth, or a turning point. They are visually dramatic and culturally loaded, which makes them powerful shorthand for emotional scenes.",
    inShort: [
      "Red spider lilies are often used to foreshadow loss, danger, or transition.",
      "Their Japanese name, higanbana, connects them with the autumn equinox and the boundary between worlds.",
      "Anime uses the flower because it is instantly recognizable and emotionally charged.",
      "The flower can mean death, but it can also mean memory, devotion, and transformation.",
    ],
    keyTakeaways: [
      "Spider lilies work as visual symbolism because their color and shape feel unforgettable.",
      "They commonly appear near farewell scenes, graves, battlefields, and supernatural thresholds.",
      "The meaning depends on the story: grief, warning, rebirth, beauty, or memory.",
      "Pop culture has turned the red spider lily into one of the most recognizable symbolic flowers.",
    ],
    sections: [
      {
        id: "anime-meaning",
        title: "What spider lilies mean in anime",
        paragraphs: [
          "When a red spider lily appears in an anime scene, it usually asks the viewer to pay attention. The flower can suggest that something is ending, that a character is crossing into a new state, or that a memory has become impossible to ignore.",
          "Because the bloom is so vivid, it can hold a whole emotional sentence without dialogue.",
        ],
      },
      {
        id: "higanbana",
        title: "The higanbana connection",
        paragraphs: [
          "In Japan, the red spider lily is called higanbana. It blooms around the autumn equinox, a season traditionally associated with ancestors, remembrance, and the far shore.",
          "That seasonal meaning is part of why the flower feels so natural in stories about spirits, grief, farewell, and return.",
        ],
      },
      {
        id: "pop-culture",
        title: "Why pop culture keeps returning to it",
        paragraphs: [
          "Spider lilies are visually useful. They can make a scene feel beautiful and uneasy at the same time. Their red color reads as blood, passion, warning, or sacred intensity depending on the story around them.",
          "That combination makes them perfect for anime, manga, game art, and music videos that want a symbol people can feel quickly.",
        ],
        snippet: {
          title: "In short",
          text: "The spider lily is not just a flower in the frame. It is often the frame telling you what kind of moment you are entering.",
        },
      },
    ],
    faqs: [
      {
        question: "Why are red spider lilies used in anime?",
        answer:
          "They are often used because they carry associations with death, farewell, memory, transition, and supernatural thresholds.",
      },
      {
        question: "Does the spider lily always mean death?",
        answer:
          "No. It can also suggest rebirth, remembrance, devotion, beauty, longing, or an important emotional turning point.",
      },
      {
        question: "What is higanbana?",
        answer:
          "Higanbana is the Japanese name for the red spider lily, a flower associated with the autumn equinox and remembrance.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "spider-lily-colors-meanings",
    legacyPaths: ["/spider-lily-colors-meanings/"],
    title: "Spider Lily Colors & Meanings",
    seoTitle: "Spider Lily Colors and Meanings: Red, White, Yellow, and Pink",
    description:
      "Explore the meanings behind red, white, yellow, and pink spider lilies and how color changes the flower’s message.",
    category: "Flower Meanings",
    categoryId: "meanings",
    date: "Mar 23, 2026",
    updated: "Mar 23, 2026",
    datePublished: "2026-03-23",
    dateModified: "2026-03-23",
    readTime: "7 min read",
    author,
    sourceUrl: source("/spider-lily-colors-meanings/"),
    heroImage: image("2026/03/Spider-Lily-Colors.jpg"),
    heroImageAlt: "Spider lily colors and meanings editorial graphic",
    quickAnswer:
      "Spider lily colors shift the flower’s message. Red often points to farewell and memory, white to purity and remembrance, yellow to renewal, and pink to tenderness or delicate affection.",
    inShort: [
      "Red spider lilies are the most culturally recognizable and dramatic.",
      "White spider lilies feel softer, spiritual, and memorial.",
      "Yellow spider lilies bring a lighter message of renewal and brightness.",
      "Pink spider lilies soften the symbolism into affection and delicate beauty.",
    ],
    keyTakeaways: [
      "Color changes how a spider lily is read emotionally.",
      "Red spider lilies carry the strongest associations with parting, memory, and the afterlife.",
      "White spider lilies can feel peaceful, reverent, or cleansing.",
      "Use spider lily meanings thoughtfully because the flower can carry intense associations.",
    ],
    sections: [
      {
        id: "red",
        title: "Red spider lily meaning",
        paragraphs: [
          "The red spider lily is the flower most people recognize from anime, Japanese symbolism, and autumn imagery. It often means farewell, memory, transition, and the beauty of something that cannot be held forever.",
        ],
      },
      {
        id: "white",
        title: "White spider lily meaning",
        paragraphs: [
          "White spider lilies soften the symbolism. They can suggest peace, remembrance, spiritual quiet, and a gentler kind of farewell.",
        ],
      },
      {
        id: "yellow-pink",
        title: "Yellow and pink spider lily meanings",
        paragraphs: [
          "Yellow spider lilies feel brighter and more renewing. Pink spider lilies carry a softer emotional register, often reading as tenderness, affection, or a delicate kind of devotion.",
        ],
      },
    ],
    faqs: [
      {
        question: "What does a red spider lily symbolize?",
        answer:
          "Red spider lilies often symbolize farewell, memory, death, transition, and intense beauty.",
      },
      {
        question: "What does a white spider lily mean?",
        answer:
          "White spider lilies can symbolize peace, remembrance, purity, and spiritual quiet.",
      },
      {
        question: "Are spider lilies romantic?",
        answer:
          "They can be, especially pink ones, but their symbolism is often more dramatic than traditionally romantic.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "red-spider-lily-symbolism",
    legacyPaths: ["/red-spider-lily-symbolism/"],
    title: "Higanbana in Japan: Red Spider Lily Symbolism",
    seoTitle: "Red Spider Lily Symbolism in Japan: Higanbana Meaning",
    description:
      "Learn about higanbana, the red spider lily in Japan, and its ties to autumn, memory, farewell, and the far shore.",
    category: "Folklore & Stories",
    categoryId: "stories",
    date: "Mar 19, 2026",
    updated: "Mar 19, 2026",
    datePublished: "2026-03-19",
    dateModified: "2026-03-19",
    readTime: "8 min read",
    author,
    sourceUrl: source("/red-spider-lily-symbolism/"),
    heroImage: image("2026/03/Red-Spider-Lily-Symbolism.jpg"),
    heroImageAlt: "Red spider lily symbolism in Japan editorial graphic",
    quickAnswer:
      "In Japan, the red spider lily is known as higanbana and is closely tied to the autumn equinox, remembrance, the boundary between worlds, and the beauty of farewell.",
    inShort: [
      "Higanbana blooms around the autumn equinox.",
      "It is often planted near graves, fields, and pathways.",
      "The flower is associated with memory, parting, and the far shore.",
      "Its symbolism is powerful, but not only dark: it can also mean protection and remembrance.",
    ],
    keyTakeaways: [
      "Higanbana is one of the most culturally symbolic flowers in Japan.",
      "Its bloom time gives it a strong connection to ancestral remembrance.",
      "Its toxicity and graveyard associations helped shape its folklore.",
      "Modern stories often use it to signal emotional thresholds.",
    ],
    sections: [
      {
        id: "higanbana",
        title: "What higanbana means",
        paragraphs: [
          "Higanbana is the Japanese name for the red spider lily. The word connects the flower to higan, the far shore, and to the season of the autumn equinox.",
          "Because it blooms at a threshold time, the flower became linked with ancestors, memory, parting, and the unseen edge of life.",
        ],
      },
      {
        id: "graveyards",
        title: "Why red spider lilies appear near graves and fields",
        paragraphs: [
          "Spider lilies were often planted near graves and fields. Their toxicity helped deter animals, and over time their presence gathered emotional and spiritual meaning.",
          "This practical history and symbolic atmosphere now sit together in the way people read the flower.",
        ],
      },
      {
        id: "today",
        title: "What the red spider lily can mean today",
        paragraphs: [
          "Today, the red spider lily can mean farewell, beauty, warning, memory, or devotion. In art and storytelling, it often appears when something important has been lost, remembered, or transformed.",
        ],
      },
    ],
    faqs: [
      {
        question: "What does higanbana mean?",
        answer:
          "Higanbana is the Japanese name for red spider lily and is associated with the autumn equinox, memory, and the far shore.",
      },
      {
        question: "Why are spider lilies planted near graves?",
        answer:
          "Historically, their toxicity helped protect grave sites and fields from animals, which contributed to their symbolism.",
      },
      {
        question: "Is the red spider lily unlucky?",
        answer:
          "It can be read as ominous in some contexts, but it also carries meanings of remembrance, protection, and transition.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "hibiscus-flower-uses",
    legacyPaths: ["/hibiscus-flower-uses/", "/2025/10/29/hibiscus-flower-uses/"],
    title: "10 Ways the World Uses the Hibiscus Flower",
    seoTitle: "10 Ways the World Uses the Hibiscus Flower",
    description:
      "Discover how hibiscus is used around the world in tea, food, beauty, rituals, natural color, and everyday flower traditions.",
    category: "Flower Profiles",
    categoryId: "profiles",
    date: "Oct 29, 2025",
    updated: "Oct 29, 2025",
    datePublished: "2025-10-29",
    dateModified: "2025-10-29",
    readTime: "8 min read",
    author,
    sourceUrl: source("/2025/10/29/hibiscus-flower-uses/"),
    heroImage: image("2025/10/10-Hibiscus-flower-Uses-e1761777237347.jpg"),
    heroImageAlt: "Hibiscus flower uses editorial graphic",
    quickAnswer:
      "Hibiscus is used for tea, refreshing drinks, food color, syrups, hair care, skin care, natural dye, rituals, garden beauty, and symbolic gifting.",
    inShort: [
      "Hibiscus is both beautiful and practical.",
      "The dried roselle calyx is widely used for ruby-colored drinks.",
      "Hibiscus appears in beauty traditions, natural dyes, and celebratory recipes.",
      "Its meaning often follows its color: bright, generous, and alive.",
    ],
    keyTakeaways: [
      "Hibiscus is one of the most useful edible and symbolic flowers.",
      "Many cultures turn hibiscus into cooling drinks and celebratory beverages.",
      "Its natural color makes it popular in syrups, sauces, and dyes.",
      "The flower’s everyday uses make its symbolism feel especially grounded.",
    ],
    sections: [
      {
        id: "uses",
        title: "Everyday hibiscus uses",
        bullets: [
          "Brewed into tea, agua de Jamaica, sorrel, and karkadeh.",
          "Used in syrups, jams, sauces, and mocktails.",
          "Added to hair rinses, oils, and skin-care traditions.",
          "Used as a natural dye for fabric, food, and creative projects.",
          "Given or displayed as a symbol of passion, beauty, and vitality.",
        ],
      },
      {
        id: "meaning",
        title: "Why hibiscus feels meaningful",
        paragraphs: [
          "Hibiscus has a rare combination of visual beauty and daily usefulness. It can be held as a bloom, brewed into a cup, folded into a recipe, or remembered as a bright garden presence.",
          "That is why its meaning feels so alive. It is not a distant symbol; it is a flower people actually use.",
        ],
      },
      {
        id: "try",
        title: "A simple way to bring hibiscus in",
        paragraphs: [
          "Start with a cup of hibiscus tea or a small jar of dried hibiscus. Let the flower be practical first, then symbolic. Notice what its color and tartness wake up in you.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is hibiscus used for?",
        answer:
          "Hibiscus is used for drinks, food, natural color, beauty care, hair care, rituals, garden design, and symbolic gifting.",
      },
      {
        question: "Can you eat hibiscus?",
        answer:
          "Certain hibiscus varieties, especially roselle, are used in food and drinks. Always verify the variety before consuming.",
      },
      {
        question: "What does hibiscus symbolize?",
        answer:
          "Hibiscus often symbolizes vitality, passion, beauty, renewal, and open-hearted energy.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "hibiscusflower-recipe",
    legacyPaths: ["/hibiscusflower-recipe/", "/2025/10/28/hibiscusflower-recipe/"],
    title: "Flower Recipes: 7 Ways to Use Dried Hibiscus Flowers",
    seoTitle: "7 Ways to Use Dried Hibiscus Flowers in Recipes",
    description:
      "Use dried hibiscus flowers in teas, syrups, sauces, desserts, mocktails, and bright floral kitchen experiments.",
    category: "Floral Food & Drink",
    categoryId: "food",
    date: "Oct 28, 2025",
    updated: "Oct 28, 2025",
    datePublished: "2025-10-28",
    dateModified: "2025-10-28",
    readTime: "7 min read",
    author,
    sourceUrl: source("/2025/10/28/hibiscusflower-recipe/"),
    heroImage: image("2025/10/hibiscus-flower-recipes-e1761616059362.jpg"),
    heroImageAlt: "Dried hibiscus flower recipes editorial graphic",
    quickAnswer:
      "Dried hibiscus flowers can be brewed, steeped, reduced, blended, or infused into drinks, syrups, sauces, desserts, and sweet-tart condiments.",
    inShort: [
      "Dried hibiscus brings tartness, ruby color, and floral brightness.",
      "It works especially well in drinks, syrups, sauces, and desserts.",
      "A little hibiscus goes a long way because the flavor is vivid.",
      "Use food-safe dried hibiscus from a trusted source.",
    ],
    keyTakeaways: [
      "Hibiscus is excellent for ruby-colored teas and agua fresca.",
      "It can become simple syrup for mocktails, cakes, and fruit.",
      "Its tart flavor balances sweetness and spice.",
      "It is best steeped and strained before adding to many recipes.",
    ],
    sections: [
      {
        id: "recipes",
        title: "Ways to use dried hibiscus flowers",
        bullets: [
          "Brew hibiscus tea and serve it hot or iced.",
          "Make hibiscus simple syrup for drinks and desserts.",
          "Simmer hibiscus into a sweet-tart sauce.",
          "Add steeped hibiscus to mocktails or agua fresca.",
          "Fold hibiscus flavor into jams, glazes, or fruit compotes.",
          "Use hibiscus to tint frostings or dessert sauces.",
          "Blend hibiscus into spicy-sweet condiments like chamoy.",
        ],
      },
      {
        id: "tips",
        title: "Recipe tips",
        paragraphs: [
          "Start small. Dried hibiscus is bold, tart, and colorful. Steep it first, taste, then decide whether you want more intensity.",
          "Hibiscus loves citrus, ginger, berries, honey, cinnamon, mint, and chile.",
        ],
      },
      {
        id: "meaning",
        title: "The flower meaning in the kitchen",
        paragraphs: [
          "Cooking with hibiscus is one of the loveliest ways to make flower meaning practical. It turns symbolism into flavor: vivid, generous, and a little surprising.",
        ],
      },
    ],
    faqs: [
      {
        question: "What can I make with dried hibiscus flowers?",
        answer:
          "You can make tea, syrup, sauces, agua fresca, mocktails, jams, glazes, desserts, and sweet-tart condiments.",
      },
      {
        question: "Does hibiscus taste floral?",
        answer:
          "It tastes tart, bright, berry-like, and lightly floral rather than perfume-heavy.",
      },
      {
        question: "Do I need food-grade hibiscus?",
        answer:
          "Yes. Use food-safe dried hibiscus from a trusted source if you plan to eat or drink it.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "hibiscus-flower-meaning",
    legacyPaths: ["/hibiscus-flower-meaning/", "/2025/10/28/hibiscus-flower-meaning/"],
    title: "The Story of the Hibiscus Flower: Meaning, Symbolism, and Benefits",
    seoTitle: "Hibiscus Flower Meaning, Symbolism, Uses, and Benefits",
    description:
      "Discover hibiscus flower meaning, symbolism, cultural stories, traditional uses, and everyday ways to enjoy this bright, ruby-hearted bloom.",
    category: "Flower Meanings",
    categoryId: "meanings",
    date: "Oct 28, 2025",
    updated: "Oct 28, 2025",
    datePublished: "2025-10-28",
    dateModified: "2025-10-28",
    readTime: "8 min read",
    author,
    sourceUrl: source("/2025/10/28/hibiscus-flower-meaning/"),
    heroImage: image("2025/10/Hibiscus-meaning-e1761614297165.jpg"),
    heroImageAlt: "Hibiscus flower meaning editorial graphic",
    quickAnswer:
      "The hibiscus flower often symbolizes vitality, beauty, passion, renewal, and open-hearted energy. Around the world, hibiscus also appears in teas, rituals, beauty traditions, and bright everyday recipes.",
    inShort: [
      "Hibiscus is often connected with beauty, renewal, passion, and devotion.",
      "The red calyx of roselle is the part most often dried for hibiscus tea.",
      "Many cultures use hibiscus as a cooling drink, natural color, ritual flower, or beauty ingredient.",
      "Bloom Whispers treats hibiscus as a flower of vivid feeling: bold, generous, and hard to ignore.",
    ],
    keyTakeaways: [
      "Hibiscus meaning changes by culture, but vitality and renewal show up again and again.",
      "Flor de Jamaica and karkadeh are both beloved hibiscus drinks made from roselle calyces.",
      "The flower carries both practical and poetic uses: tea, dye, beauty care, ritual, and celebration.",
      "For gifting or symbolism, hibiscus reads as passion, warmth, courage, and bright attention.",
    ],
    sections: [
      {
        id: "meaning",
        title: "What does the hibiscus flower mean?",
        paragraphs: [
          "Hibiscus is a flower that announces itself. It is bright, lush, and short-lived, which is why its meaning often gathers around vitality, beauty, passion, and the courage to be seen.",
          "In love and relationships, hibiscus can suggest devotion, attraction, and the kind of feeling that arrives in full color. Spiritually, it is often read as a flower of cleansing, renewal, and open-hearted energy.",
        ],
        snippet: {
          title: "Bloom Whispers note",
          text: "If hibiscus had a message, it might say: let your aliveness be visible, even if the bloom only lasts for a day.",
        },
      },
      {
        id: "quick-facts",
        title: "Hibiscus quick facts",
        bullets: [
          "Scientific name often used for edible hibiscus: Hibiscus sabdariffa.",
          "Common names include roselle, flor de Jamaica, and karkadeh.",
          "Plant family: Malvaceae.",
          "The part commonly brewed for tea is the red calyx, not the showy petal.",
          "Traditional uses include cooling drinks, natural dye, hair care, and celebratory recipes.",
        ],
      },
      {
        id: "culture",
        title: "Hibiscus symbolism by culture",
        paragraphs: [
          "In many tropical and island settings, hibiscus is associated with beauty, warmth, hospitality, and romantic expression. In India, red hibiscus is often connected with devotion and feminine power through offerings to Goddess Kali.",
          "Across Africa, the Caribbean, Latin America, and the Middle East, hibiscus drinks also carry a social meaning. They are offered at gatherings, poured for guests, and remembered by their deep ruby color.",
        ],
      },
      {
        id: "uses",
        title: "Traditional and modern uses of hibiscus",
        paragraphs: [
          "Hibiscus moves easily between kitchen, garden, beauty shelf, and ritual table. Dried roselle calyces become tea, agua de Jamaica, syrups, sauces, and the tart floral note behind some hibiscus chamoy recipes.",
          "In beauty traditions, hibiscus is used in hair oils, rinses, and skin care preparations. In creative homes, the flower also becomes a natural dye and a visual shorthand for warmth, color, and care.",
        ],
        snippet: {
          title: "In short",
          text: "Hibiscus is not just pretty. It is a flower people cook with, drink, offer, wear, and remember.",
        },
      },
      {
        id: "everyday",
        title: "Ways to bring hibiscus into everyday life",
        bullets: [
          "Brew a tart hibiscus tea and serve it hot or chilled.",
          "Use dried hibiscus in syrups, sauces, or mocktails.",
          "Choose hibiscus as a gift symbol for passion, vitality, or bright encouragement.",
          "Let the flower inspire a small ritual: write down one place where you want more color, energy, or courage.",
        ],
      },
      {
        id: "closing",
        title: "A closing note from the garden",
        paragraphs: [
          "Every petal of the hibiscus tells a story of color, care, and courage. It reminds us that beauty and usefulness can live in the same bloom.",
          "If this flower spoke to you, another one probably will too. The garden has more meanings waiting.",
        ],
      },
    ],
    faqs: [
      {
        question: "What does the hibiscus flower symbolize?",
        answer:
          "Hibiscus often symbolizes vitality, beauty, passion, renewal, devotion, and open-hearted energy. Its exact meaning shifts by culture, color, and use.",
      },
      {
        question: "Is hibiscus the same as flor de Jamaica?",
        answer:
          "Flor de Jamaica usually refers to dried roselle hibiscus calyces used to make the tart ruby drink agua de Jamaica.",
      },
      {
        question: "What part of hibiscus is used for tea?",
        answer:
          "The red calyx of Hibiscus sabdariffa, not the showy petal, is the part most often dried and brewed for hibiscus tea.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "5-min-hibiscus-chamoy-recipe",
    legacyPaths: ["/5-min-hibiscus-chamoy-recipe/"],
    title: "5 Min Hibiscus Chamoy Recipe",
    seoTitle: "5 Minute Hibiscus Chamoy Recipe",
    description:
      "Make a sweet, tart, and gently spicy hibiscus chamoy using dried hibiscus for a floral twist on a beloved condiment.",
    category: "Floral Food & Drink",
    categoryId: "food",
    date: "Oct 27, 2025",
    updated: "Oct 27, 2025",
    datePublished: "2025-10-27",
    dateModified: "2025-10-27",
    readTime: "5 min read",
    author,
    sourceUrl: source("/5-min-hibiscus-chamoy-recipe/"),
    heroImage: image("2025/10/Hibiscus-Chamoy.jpg"),
    heroImageAlt: "Hibiscus chamoy recipe editorial graphic",
    quickAnswer:
      "Hibiscus chamoy is a quick sweet-sour-spicy sauce made by pairing tart hibiscus with chile, lime, and fruit sweetness.",
    inShort: [
      "Hibiscus adds ruby color and a tart floral note.",
      "Chamoy is flexible: adjust sweetness, chile, and lime to taste.",
      "Use it on fruit, drinks, snacks, desserts, or rims.",
      "It is a simple way to make flower flavor feel playful.",
    ],
    keyTakeaways: [
      "The hibiscus brings brightness and color.",
      "Lime and chile keep the sauce lively.",
      "A quick version can be made with pantry ingredients.",
      "Taste and adjust: chamoy should feel balanced, not flat.",
    ],
    sections: [
      {
        id: "what",
        title: "What makes hibiscus chamoy special?",
        paragraphs: [
          "Hibiscus chamoy takes a familiar sweet, sour, salty, spicy sauce and gives it a floral ruby edge. The flower brings tartness and color without making the flavor feel perfume-like.",
        ],
      },
      {
        id: "ways",
        title: "Ways to use it",
        bullets: [
          "Drizzle over mango, pineapple, watermelon, or cucumber.",
          "Use it on the rim of mocktails or aguas frescas.",
          "Spoon it over sorbet or fruit pops.",
          "Pair it with salty snacks for a sweet-tart finish.",
        ],
      },
      {
        id: "note",
        title: "A small kitchen note",
        paragraphs: [
          "This is a recipe that wants your own taste. Add more lime for brightness, more chile for warmth, or more sweetness if you want the hibiscus to feel softer.",
        ],
      },
    ],
    faqs: [
      {
        question: "What does hibiscus chamoy taste like?",
        answer:
          "It tastes tart, fruity, lightly floral, sweet, spicy, and tangy.",
      },
      {
        question: "Can I use dried hibiscus flowers?",
        answer:
          "Yes, food-grade dried hibiscus is the easiest way to add hibiscus flavor and color.",
      },
      {
        question: "What can I put hibiscus chamoy on?",
        answer:
          "Try fruit, mocktails, sorbet, popsicles, salty snacks, or drink rims.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "hibiscus-flower-benefits",
    legacyPaths: ["/hibiscus-flower-benefits/", "/2025/10/27/hibiscus-flower-benefits/"],
    title: "7 Benefits of the Hibiscus Flower for Hair and Skin",
    seoTitle: "7 Hibiscus Flower Benefits for Hair and Skin",
    description:
      "Explore traditional and modern beauty uses of hibiscus for hair, skin, rinses, oils, and botanical self-care.",
    category: "Flower Profiles",
    categoryId: "profiles",
    date: "Oct 27, 2025",
    updated: "Oct 27, 2025",
    datePublished: "2025-10-27",
    dateModified: "2025-10-27",
    readTime: "7 min read",
    author,
    sourceUrl: source("/2025/10/27/hibiscus-flower-benefits/"),
    heroImage: image("2025/10/Hibiscus-flower-benefits-1.jpg"),
    heroImageAlt: "Hibiscus flower benefits editorial graphic",
    quickAnswer:
      "Hibiscus is traditionally used in hair and skin care for its color, acidity, mucilage, and botanical richness. Many people use it in rinses, masks, oils, and gentle beauty rituals.",
    inShort: [
      "Hibiscus appears in many traditional hair-care practices.",
      "It is often used in rinses, masks, oils, and infused waters.",
      "The flower is valued for shine, softness, and vivid botanical color.",
      "Beauty uses should stay gentle and patch-tested.",
    ],
    keyTakeaways: [
      "Hibiscus beauty traditions are especially strong in hair care.",
      "The flower can be steeped into rinses or infused into oils.",
      "It is popular for shine, scalp care, and softening rituals.",
      "Use cosmetic caution: patch test and avoid irritation.",
    ],
    sections: [
      {
        id: "hair",
        title: "Hibiscus for hair",
        paragraphs: [
          "Hibiscus is often used in hair care as a rinse, paste, or infused oil. People turn to it for softness, shine, and the feeling of botanical attention.",
          "Its bright color and slippery texture make it feel especially alive in homemade beauty rituals.",
        ],
      },
      {
        id: "skin",
        title: "Hibiscus for skin",
        paragraphs: [
          "For skin, hibiscus is usually approached gently: as a botanical infusion, a soft mask ingredient, or an inspiration for flower-based care.",
          "Because skin is personal, any DIY use should be patch-tested and kept simple.",
        ],
      },
      {
        id: "ritual",
        title: "A beauty ritual with meaning",
        paragraphs: [
          "The symbolic side of hibiscus makes beauty care feel less mechanical. It carries a message of color, renewal, and letting yourself be seen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is hibiscus good for hair?",
        answer:
          "Hibiscus is traditionally used in hair care for shine, softness, and scalp-focused rituals, though results vary by person.",
      },
      {
        question: "Can hibiscus be used on skin?",
        answer:
          "Some people use hibiscus in gentle skin preparations, but it should be patch-tested and avoided if irritation occurs.",
      },
      {
        question: "Is hibiscus beauty care scientific or traditional?",
        answer:
          "Bloom Whispers treats it primarily as traditional botanical knowledge and gentle ritual inspiration, not medical advice.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "edible-flowers-for-cakes",
    legacyPaths: ["/edible-flowers-for-cakes/", "/2025/02/19/edible-flowers-for-cakes/"],
    title: "20+ Edible Flowers for Cake Decoration",
    seoTitle: "20+ Edible Flowers for Cake Decoration",
    description:
      "A gentle guide to edible flowers for cakes, from fresh blooms and pressed petals to safe decorating tips.",
    category: "Floral Food & Drink",
    categoryId: "food",
    date: "Feb 19, 2025",
    updated: "Feb 19, 2025",
    datePublished: "2025-02-19",
    dateModified: "2025-02-19",
    readTime: "9 min read",
    author,
    sourceUrl: source("/2025/02/19/edible-flowers-for-cakes/"),
    heroImage: image("2025/02/Edible-flowers.jpg"),
    heroImageAlt: "Edible flowers for cake decoration editorial graphic",
    quickAnswer:
      "Edible flowers can make cakes feel seasonal and magical, but only food-safe blooms should be used. Popular choices include pansies, violas, calendula, rose petals, lavender, and chamomile.",
    inShort: [
      "Only use flowers confirmed as edible and food-safe.",
      "Avoid florist flowers unless they are specifically grown for eating.",
      "Pressed flowers create a delicate, flat decoration.",
      "Fresh flowers look lush but need careful placement and handling.",
    ],
    keyTakeaways: [
      "Food safety comes before beauty.",
      "Pansies, violas, roses, calendula, lavender, and chamomile are common cake-friendly options.",
      "Pressed edible flowers work well on buttercream and fondant.",
      "Use sparingly so the cake still feels elegant.",
    ],
    sections: [
      {
        id: "flowers",
        title: "Edible flowers to consider",
        bullets: [
          "Pansies and violas for bright, pressed-flower looks.",
          "Rose petals for romance and softness.",
          "Calendula for warm golden color.",
          "Lavender for a tiny fragrant accent.",
          "Chamomile for a meadow-like finish.",
          "Nasturtium for a peppery, vivid note.",
        ],
      },
      {
        id: "safety",
        title: "Safety notes before decorating",
        paragraphs: [
          "Not every beautiful flower belongs on a cake. Use edible flowers grown for food, wash them gently, and avoid anything treated with pesticides or floral chemicals.",
          "When in doubt, keep flowers decorative but separated from the edible surface.",
        ],
      },
      {
        id: "style",
        title: "How to make floral cakes feel refined",
        paragraphs: [
          "Choose a small palette and repeat it. A few carefully placed petals often look more premium than a crowded surface.",
        ],
      },
    ],
    faqs: [
      {
        question: "Which flowers are safe for cake decoration?",
        answer:
          "Common edible options include pansies, violas, rose petals, calendula, lavender, chamomile, and nasturtiums when grown for food use.",
      },
      {
        question: "Can I use florist flowers on cakes?",
        answer:
          "No, not unless they are explicitly grown and sold as edible. Florist flowers may be treated with chemicals.",
      },
      {
        question: "Are dried flowers safe on cakes?",
        answer:
          "Only if they are food-grade and edible. Decorative dried flowers are not automatically safe to eat.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "the-healing-power-of-forest-therapy",
    legacyPaths: ["/the-healing-power-of-forest-therapy/"],
    title: "Forest Therapy with Elizabeth Mintun",
    seoTitle: "Forest Therapy with Elizabeth Mintun",
    description:
      "A Bloom Whispers podcast note on forest therapy, slow attention, and the healing feeling of being held by nature.",
    category: "Podcast",
    categoryId: "podcast",
    date: "Sep 24, 2024",
    updated: "Sep 24, 2024",
    datePublished: "2024-09-24",
    dateModified: "2024-09-24",
    readTime: "6 min read",
    author,
    sourceUrl: source("/the-healing-power-of-forest-therapy/"),
    heroImage: image("2024/09/Forest-Therapy-e1727154772145.jpg"),
    heroImageAlt: "Forest therapy podcast editorial graphic",
    quickAnswer:
      "Forest therapy is the practice of slowing down with the natural world, letting attention soften, and allowing trees, plants, scent, sound, and silence to become part of restoration.",
    inShort: [
      "Forest therapy is about presence, not performance.",
      "It invites the senses to lead.",
      "A walk can become a listening practice.",
      "The forest offers a kind of quiet companionship.",
    ],
    keyTakeaways: [
      "Nature connection can be simple and accessible.",
      "Slow noticing is part of the practice.",
      "Forest therapy pairs beautifully with flower-focused reflection.",
      "The point is not to accomplish the walk, but to meet it.",
    ],
    sections: [
      {
        id: "conversation",
        title: "A conversation from the trees",
        paragraphs: [
          "This Bloom Whispers episode explores forest therapy as a gentle way to return to the body, the senses, and the living world nearby.",
          "Rather than treating nature as scenery, the conversation invites the forest to become a companion.",
        ],
      },
      {
        id: "practice",
        title: "What forest therapy can look like",
        bullets: [
          "Walking slowly without rushing toward a destination.",
          "Noticing scent, texture, sound, temperature, and light.",
          "Pausing with one tree, leaf, path, or patch of moss.",
          "Letting the nervous system settle without forcing insight.",
        ],
      },
      {
        id: "flower-note",
        title: "A Bloom Whispers note",
        paragraphs: [
          "Flowers often ask us to look closely. Forest therapy asks something similar: stay long enough for the world to become more than a backdrop.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is forest therapy the same as hiking?",
        answer:
          "Not exactly. Hiking often focuses on movement and destination; forest therapy focuses on slow sensory presence.",
      },
      {
        question: "Do I need a forest to try it?",
        answer:
          "No. A garden, park, tree-lined street, or quiet plant-filled corner can be enough for a small practice.",
      },
      {
        question: "Is this medical advice?",
        answer:
          "No. Bloom Whispers shares it as reflective nature inspiration, not medical care.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "flower-therapy-healing-power-of-flowers",
    legacyPaths: ["/flower-therapy-healing-power-of-flowers/", "/post/flower-therapy-harnessing-the-healing-power-of-flowers"],
    title: "Flower Therapy: The Healing Power of Flowers",
    seoTitle: "Flower Therapy: The Healing Power of Flowers",
    description:
      "A Bloom Whispers podcast note on how flowers can shape memory, mood, ritual, and gentle attention.",
    category: "Podcast",
    categoryId: "podcast",
    date: "Sep 24, 2024",
    updated: "Sep 24, 2024",
    datePublished: "2024-09-24",
    dateModified: "2024-09-24",
    readTime: "6 min read",
    author,
    sourceUrl: source("/flower-therapy-healing-power-of-flowers/"),
    heroImage: image("2024/09/Flower-Therapy-e1727150554942.jpg"),
    heroImageAlt: "Flower therapy podcast editorial graphic",
    quickAnswer:
      "Flower therapy, in the Bloom Whispers sense, is about using flowers as gentle prompts for memory, emotion, ritual, attention, and meaning.",
    inShort: [
      "Flowers can become emotional anchors.",
      "Their colors, scents, and stories can shift a room or a mood.",
      "A flower ritual does not need to be complicated.",
      "The healing feeling often comes from attention and meaning.",
    ],
    keyTakeaways: [
      "Flowers can support reflection without needing to promise a cure.",
      "A single bloom can mark a season, memory, or intention.",
      "Flower therapy pairs beauty with emotional language.",
      "The practice works best when it stays gentle and personal.",
    ],
    sections: [
      {
        id: "meaning",
        title: "What flower therapy means here",
        paragraphs: [
          "Bloom Whispers treats flower therapy as a poetic and practical way of relating to flowers. It is not about turning blooms into medical claims; it is about noticing what beauty helps us feel, remember, and name.",
        ],
      },
      {
        id: "ritual",
        title: "A simple flower therapy ritual",
        bullets: [
          "Choose one flower that catches your attention.",
          "Look at it for a full minute without multitasking.",
          "Name the feeling it brings up.",
          "Write one sentence you want to carry from it.",
        ],
      },
      {
        id: "daily",
        title: "How flowers change daily life",
        paragraphs: [
          "A flower on a table can become a small interruption of hurry. It can soften the room, mark the day, or remind you that care can be visible.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is flower therapy?",
        answer:
          "Here, it means using flowers as gentle prompts for reflection, mood, memory, ritual, and symbolic meaning.",
      },
      {
        question: "Is flower therapy scientific?",
        answer:
          "This article frames it as reflective and symbolic inspiration, not medical or scientific treatment.",
      },
      {
        question: "How can I start?",
        answer:
          "Start with one bloom, one quiet minute, and one sentence about what it brings up for you.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "what-are-flowers",
    legacyPaths: ["/what-are-flowers/"],
    title: "Understanding the Essence of Flowers",
    seoTitle: "What Are Flowers? Understanding the Essence of Flowers",
    description:
      "A Bloom Whispers podcast note exploring what flowers are, how they work, and why they hold so much meaning.",
    category: "Podcast",
    categoryId: "podcast",
    date: "Sep 24, 2024",
    updated: "Sep 24, 2024",
    datePublished: "2024-09-24",
    dateModified: "2024-09-24",
    readTime: "6 min read",
    author,
    sourceUrl: source("/what-are-flowers/"),
    heroImage: image("2024/09/What-are-flowers-e1727147957670.jpg"),
    heroImageAlt: "What are flowers podcast editorial graphic",
    quickAnswer:
      "Flowers are reproductive structures for flowering plants, but they are also cultural symbols, gifts, rituals, ingredients, and emotional messengers.",
    inShort: [
      "Botanically, flowers help plants reproduce.",
      "Culturally, they carry meaning across ceremonies and everyday life.",
      "Their beauty often makes science feel intimate.",
      "Bloom Whispers studies both the botanical and the symbolic side.",
    ],
    keyTakeaways: [
      "A flower can be understood through botany, story, culture, and feeling.",
      "Pollination is part of the flower’s practical purpose.",
      "Humans have turned flowers into messages for centuries.",
      "The most interesting flower stories often live where science and symbolism meet.",
    ],
    sections: [
      {
        id: "botany",
        title: "What flowers are botanically",
        paragraphs: [
          "A flower is part of a flowering plant’s reproductive system. Petals, pollen, nectar, scent, and color can all play a role in attracting pollinators and supporting the plant’s life cycle.",
        ],
      },
      {
        id: "culture",
        title: "What flowers become culturally",
        paragraphs: [
          "Humans rarely stop at botany. We give flowers at weddings and funerals, place them on tables, press them into books, and use them to say what plain words sometimes cannot.",
        ],
      },
      {
        id: "essence",
        title: "The essence of flowers",
        paragraphs: [
          "The essence of a flower lives in both its function and its feeling. It is a living structure and a message, a biological event and a little piece of language.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is a flower?",
        answer:
          "A flower is the reproductive structure of a flowering plant, often involved in pollination and seed production.",
      },
      {
        question: "Why do flowers have meanings?",
        answer:
          "People have connected flowers with emotions, ceremonies, seasons, stories, and cultural symbols for centuries.",
      },
      {
        question: "Are flower meanings universal?",
        answer:
          "No. Flower meanings can change by culture, color, occasion, and personal experience.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "flower-energy",
    legacyPaths: ["/flower-energy/"],
    title: "Flower Frequencies with Laura Ashley",
    seoTitle: "Flower Frequencies with Laura Ashley",
    description:
      "A Bloom Whispers podcast note on flower energy, intuition, and the emotional language people build around blooms.",
    category: "Podcast",
    categoryId: "podcast",
    date: "Sep 23, 2024",
    updated: "Sep 23, 2024",
    datePublished: "2024-09-23",
    dateModified: "2024-09-23",
    readTime: "6 min read",
    author,
    sourceUrl: source("/flower-energy/"),
    heroImage: image("2024/09/The-Healing-Power-of-Flowers-Insights-from-Laura-Ashley-e1727116543848.jpg"),
    heroImageAlt: "Flower energy podcast editorial graphic",
    quickAnswer:
      "Flower energy is a gentle way of talking about how flowers affect mood, memory, symbolism, intuition, and the atmosphere of a place.",
    inShort: [
      "Flowers can shift how a room feels.",
      "Different blooms often carry different emotional associations.",
      "Flower energy is best held as poetic language, not a rigid rule.",
      "The most useful meaning is the one that helps you notice your season clearly.",
    ],
    keyTakeaways: [
      "Flower energy is a language of attention and feeling.",
      "Color, scent, season, and memory all shape how a bloom lands.",
      "The practice can be intuitive without becoming complicated.",
      "A flower can become a small mirror for what you need.",
    ],
    sections: [
      {
        id: "energy",
        title: "What flower energy can mean",
        paragraphs: [
          "In Bloom Whispers language, flower energy is not about hard rules. It is about how a bloom changes the emotional weather around it.",
          "A rose might feel like devotion. Lavender might feel like rest. Hibiscus might feel like visible aliveness.",
        ],
      },
      {
        id: "intuition",
        title: "Choosing by intuition",
        paragraphs: [
          "Sometimes the flower you notice first is enough. You do not need to overexplain it. Let attraction, memory, color, and timing become part of the message.",
        ],
      },
      {
        id: "practice",
        title: "A simple practice",
        bullets: [
          "Choose one flower image or fresh bloom.",
          "Ask: what feeling does this bring closer?",
          "Ask: what feeling does this help me release?",
          "Write one small action inspired by the answer.",
        ],
      },
    ],
    faqs: [
      {
        question: "What is flower energy?",
        answer:
          "It is a poetic way to describe the mood, memory, symbolism, and feeling a flower can bring.",
      },
      {
        question: "Do flowers have fixed meanings?",
        answer:
          "Some meanings are traditional, but personal context and culture matter too.",
      },
      {
        question: "How do I choose a flower intuitively?",
        answer:
          "Notice which bloom you keep returning to, then ask what it seems to be naming in your current season.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "healing-properties-of-flowers",
    legacyPaths: ["/healing-properties-of-flowers/"],
    title: "Exploring the Healing Properties of Flowers",
    seoTitle: "Exploring the Healing Properties of Flowers",
    description:
      "A Bloom Whispers podcast note on flowers, care, meaning, and the gentle ways blooms move through a life.",
    category: "Podcast",
    categoryId: "podcast",
    date: "Apr 5, 2024",
    updated: "Apr 5, 2024",
    datePublished: "2024-04-05",
    dateModified: "2024-04-05",
    readTime: "6 min read",
    author,
    sourceUrl: source("/healing-properties-of-flowers/"),
    heroImage: image("2024/04/Healing-Properties-of-Flowers-e1727116647246.jpg"),
    heroImageAlt: "Healing properties of flowers editorial graphic",
    quickAnswer:
      "Flowers can feel healing because they invite attention, beauty, memory, ritual, scent, color, and care into ordinary life.",
    inShort: [
      "Flowers can support emotional presence and ritual.",
      "Their beauty can help mark care, grief, celebration, or renewal.",
      "Healing here means gentle support, not medical treatment.",
      "The simplest practice is to notice one bloom slowly.",
    ],
    keyTakeaways: [
      "Flowers can act as emotional anchors.",
      "Ritual, color, scent, and meaning all contribute to their impact.",
      "A flower’s power often comes from how intentionally we meet it.",
      "Bloom Whispers keeps this language gentle, not clinical.",
    ],
    sections: [
      {
        id: "healing",
        title: "How flowers can feel healing",
        paragraphs: [
          "Flowers often enter our lives during meaningful moments: grief, love, celebration, apology, illness, and return. They help make feeling visible.",
          "Their healing quality can come from attention itself. A flower asks you to slow down and look.",
        ],
      },
      {
        id: "ritual",
        title: "Small flower rituals",
        bullets: [
          "Place one bloom near your desk and give it a daily sentence.",
          "Press a petal from a meaningful bouquet.",
          "Choose a flower for a season you are entering.",
          "Light a candle beside a bloom and name what you are releasing.",
        ],
      },
      {
        id: "care",
        title: "A note on care",
        paragraphs: [
          "Flowers do not need to solve everything to matter. Sometimes they simply soften the room enough for us to breathe differently.",
        ],
      },
    ],
    faqs: [
      {
        question: "Can flowers be healing?",
        answer:
          "They can feel emotionally supportive through beauty, memory, scent, color, ritual, and attention, but they are not a substitute for medical care.",
      },
      {
        question: "What flower is associated with healing?",
        answer:
          "Many flowers are associated with healing, including lavender, calendula, chamomile, rose, lotus, and hibiscus depending on context.",
      },
      {
        question: "How can I use flowers for reflection?",
        answer:
          "Choose one flower, sit with it for a few minutes, and write down the message or feeling it brings forward.",
      },
    ],
    related: fallbackRelated,
  }),
  makePost({
    slug: "lotus-flower-meaning",
    legacyPaths: ["/lotus-flower-meaning/"],
    title: "The Lotus Flower Meaning: Healing & Creativity",
    seoTitle: "Lotus Flower Meaning: Healing, Creativity, and Renewal",
    description:
      "Explore lotus flower meaning through healing, creativity, renewal, resilience, and the beauty of rising from muddy water.",
    category: "Podcast",
    categoryId: "podcast",
    date: "May 30, 2021",
    updated: "May 30, 2021",
    datePublished: "2021-05-30",
    dateModified: "2021-05-30",
    readTime: "6 min read",
    author,
    sourceUrl: source("/lotus-flower-meaning/"),
    heroImage: image("2024/04/Lotus-flower-meaning-e1727116714135.jpg"),
    heroImageAlt: "Lotus flower meaning editorial graphic",
    quickAnswer:
      "The lotus flower often symbolizes renewal, spiritual growth, resilience, creativity, and the ability to rise beautifully from difficult conditions.",
    inShort: [
      "Lotus symbolism centers on rising, renewal, and resilience.",
      "The flower grows from muddy water and blooms cleanly above the surface.",
      "It appears in spiritual, artistic, and healing traditions.",
      "For creativity, lotus can mean making beauty from what was hidden.",
    ],
    keyTakeaways: [
      "Lotus is one of the strongest symbols of renewal.",
      "Its growth pattern shapes its meaning.",
      "The flower can speak to healing, creativity, and spiritual unfolding.",
      "Its message is soft but powerful: rise anyway.",
    ],
    sections: [
      {
        id: "meaning",
        title: "What does the lotus flower mean?",
        paragraphs: [
          "The lotus is famous for rising from muddy water and blooming above the surface. That image gives the flower its enduring meaning: renewal, resilience, purity, and becoming.",
        ],
      },
      {
        id: "creativity",
        title: "Lotus as a creativity symbol",
        paragraphs: [
          "Creatively, lotus can represent the work that grows from hidden places. It reminds us that beauty is not always born in perfect conditions.",
        ],
      },
      {
        id: "ritual",
        title: "A lotus-inspired reflection",
        bullets: [
          "Name one muddy place that has shaped you.",
          "Name one bloom that came from it.",
          "Choose one creative act that honors both.",
        ],
      },
    ],
    faqs: [
      {
        question: "What does the lotus symbolize?",
        answer:
          "The lotus often symbolizes renewal, resilience, spiritual growth, purity, healing, and creativity.",
      },
      {
        question: "Why is lotus connected to healing?",
        answer:
          "Its ability to rise from muddy water makes it a powerful image for recovery, resilience, and transformation.",
      },
      {
        question: "Is lotus a good creative symbol?",
        answer:
          "Yes. It can symbolize making beauty from difficulty and letting hidden work bloom.",
      },
    ],
    related: fallbackRelated,
  }),
];

export function getAllJournalPosts() {
  return journalPosts;
}

export function getJournalPost(slug: string) {
  return journalPosts.find((post) => post.slug === slug);
}

export function getPrimaryJournalPath(post: JournalPost) {
  return post.legacyPaths[0] ?? `/journal/${post.slug}`;
}

export function normalizePath(path: string) {
  const withoutQuery = path.split("?")[0].split("#")[0];
  return withoutQuery.startsWith("/") ? withoutQuery : `/${withoutQuery}`;
}

export function getJournalPostByLegacyPath(path: string) {
  const normalized = normalizePath(path);
  const withSlash = normalized.endsWith("/") ? normalized : `${normalized}/`;
  const withoutSlash = normalized.endsWith("/") ? normalized.slice(0, -1) : normalized;

  return journalPosts.find((post) =>
    post.legacyPaths.some((legacyPath) => legacyPath === withSlash || legacyPath === withoutSlash),
  );
}
