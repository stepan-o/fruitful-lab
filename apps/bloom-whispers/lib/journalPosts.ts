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
  title: string;
  seoTitle: string;
  description: string;
  category: string;
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

export const journalPosts: JournalPost[] = [
  {
    slug: "hibiscus-flower-meaning",
    title: "The Story of the Hibiscus Flower: Meaning, Symbolism, and Benefits",
    seoTitle: "Hibiscus Flower Meaning, Symbolism, Uses, and Benefits",
    description:
      "Discover hibiscus flower meaning, symbolism, cultural stories, traditional uses, and everyday ways to enjoy this bright, ruby-hearted bloom.",
    category: "Flower Meanings",
    date: "Oct 28, 2025",
    updated: "Oct 28, 2025",
    datePublished: "2025-10-28",
    dateModified: "2025-10-28",
    readTime: "8 min read",
    author: "Susycid",
    sourceUrl: "https://bloomwhispers.com/hibiscus-flower-meaning/",
    heroImage: "https://bloomwhispers.com/wp-content/uploads/2025/10/Hibiscus-meaning-e1761614297165.jpg",
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
      {
        question: "Is hibiscus a romantic flower?",
        answer:
          "It can be. Hibiscus is often associated with attraction, passion, devotion, and vivid affection, especially because of its bold color and fleeting bloom.",
      },
      {
        question: "Can hibiscus be used in recipes?",
        answer:
          "Yes. Dried hibiscus is used in teas, syrups, sauces, agua fresca, mocktails, jams, and sweet-tart condiments like hibiscus chamoy.",
      },
    ],
    related: [
      {
        title: "10 Ways the World Uses the Hibiscus Flower",
        href: "https://bloomwhispers.com/hibiscus-flower-uses/",
        label: "Flower Uses",
      },
      {
        title: "Flower Recipes: 7 Ways to Use Dried Hibiscus Flowers",
        href: "https://bloomwhispers.com/hibiscusflower-recipe/",
        label: "Floral Food & Drink",
      },
      {
        title: "Spider Lily Colors & Meanings",
        href: "https://bloomwhispers.com/spider-lily-colors-meanings/",
        label: "Flower Meanings",
      },
    ],
  },
];

export function getAllJournalPosts() {
  return journalPosts;
}

export function getJournalPost(slug: string) {
  return journalPosts.find((post) => post.slug === slug);
}
