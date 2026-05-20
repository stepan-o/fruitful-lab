export type ServicePackage = {
  title: string;
  kicker: string;
  description: string;
  bestFor: string;
  includes: string[];
  cta: string;
};

export type CaseStudy = {
  brand: string;
  context: string;
  result: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  keyTakeaways: string[];
  sections: Array<{ heading: string; body: string }>;
};

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    title: "Full-Funnel Pinterest Growth",
    kicker: "Organic + ads with one plan",
    description:
      "For brands that want Pinterest connected to visibility, traffic, list growth, and sales instead of scattered pin activity.",
    bestFor: "Brands with offers, content, and enough traction to connect Pinterest to a real funnel.",
    includes: [
      "Pinterest strategy mapped to offers and landing pages",
      "Organic pin creation, board structure, and search-led publishing",
      "Ads planning and optimization when the funnel is ready",
      "Monthly reporting focused on clicks, saves, traffic, and conversion signals",
    ],
    cta: "Inquire About Growth",
  },
  {
    title: "Organic Pinterest Management",
    kicker: "Search-led content that compounds",
    description:
      "Done-for-you Pinterest management for brands that want consistent pin creation, scheduling, and optimization without turning Pinterest into another weekly chore.",
    bestFor: "Content creators, educators, and product brands with useful content or collections to send traffic toward.",
    includes: [
      "Keyword and board strategy",
      "Monthly pin design and scheduling",
      "Fresh content angles for search and seasonal planning",
      "Performance review with next-step recommendations",
    ],
    cta: "Explore Organic Support",
  },
  {
    title: "Pinterest Ads Management",
    kicker: "Paid distribution without wasted guesses",
    description:
      "Pinterest ad support for brands that need faster learning, launch support, or a way to amplify content that already has a clear job.",
    bestFor: "Product brands and lead-generation funnels with clear offers, tracking, and landing pages ready for traffic.",
    includes: [
      "Campaign structure and audience planning",
      "Creative testing plan tied to funnel goals",
      "Launch, monitoring, and optimization",
      "Readable reporting that connects spend to useful signals",
    ],
    cta: "Book Ads Strategy Call",
  },
];

export const A_LA_CARTE = [
  {
    title: "Pinterest Account Audit",
    price: "USD $497",
    description: "A professional diagnosis for underperforming accounts.",
    includes: [
      "Profile, board, and pin review",
      "SEO and visual consistency assessment",
      "Three to five priority issues or opportunities",
      "Actionable next steps via Loom walkthrough",
    ],
  },
  {
    title: "Pinterest Keyword Bank + Board Strategy",
    price: "USD $397",
    description: "A search-led foundation for discoverability and growth.",
    includes: [
      "Keyword research and interest mapping",
      "Board titles and descriptions rewritten for SEO",
      "Board structure mapped to the account's content lanes",
      "Strategy doc for maintaining the system",
    ],
  },
  {
    title: "Custom Pin Template Pack",
    price: "USD $125",
    description: "Canva templates designed to make consistent pins easier to ship.",
    includes: [
      "Eight to ten customizable pin templates",
      "Mobile-friendly vertical formats",
      "Style guide and pin-design best practices",
      "One revision round and a quick Loom walkthrough",
    ],
  },
  {
    title: "Pinterest Strategy Session",
    price: "USD $247",
    description: "A focused session for strategic clarity and next-step momentum.",
    includes: [
      "90-minute strategy call",
      "Pre-call intake form",
      "Account or funnel walkthrough",
      "Prioritized action plan delivered after the call",
    ],
  },
] as const;

export const CASE_STUDIES: CaseStudy[] = [
  {
    brand: "Organic Prairie",
    context: "Ads + organic Pinterest support",
    result: "4x ROAS on Pinterest ads with steady growth in product-page traffic.",
  },
  {
    brand: "Visit Southern Spain",
    context: "Organic strategy for a travel publisher",
    result: "Pinterest became a top traffic driver and a more durable discovery channel.",
  },
  {
    brand: "Armstrong-Clark",
    context: "Seasonal Pinterest campaign support",
    result: "Visibility and engaged audience lifted during peak seasonal demand.",
  },
];

export const PROCESS_STEPS = [
  {
    title: "Kickoff Call",
    description:
      "We get to know the brand, goals, content, offers, and constraints before mapping a Pinterest plan.",
    points: ["Brand and content deep dive", "Pinterest setup review", "Funnel-first strategy"],
  },
  {
    title: "Build the System",
    description:
      "You focus on the business while we handle the pinning, posting, testing, and tracking.",
    points: ["Pin design and scheduling", "Organic and ads support", "Search-led content mapping"],
  },
  {
    title: "Optimize Toward Results",
    description:
      "Reporting focuses on decisions: what to keep, what to improve, and where Pinterest is creating leverage.",
    points: ["Clear monthly reports", "Strategy check-ins", "Continuous optimization"],
  },
] as const;

export const FIT_SIGNALS = {
  good: [
    "You sell physical or digital products online.",
    "You create useful content in niches like food, travel, wellness, home, gardening, or lifestyle.",
    "You want search-based visibility that compounds over time.",
    "You have offers, pages, or content worth sending traffic toward.",
  ],
  notYet: [
    "You need overnight results or viral spikes.",
    "You want someone to post pretty pins without a funnel plan.",
    "You do not have an offer, content engine, or website experience ready yet.",
  ],
} as const;

export const RESOURCE_ITEMS = [
  {
    title: "Pin-Ready Blueprint",
    type: "Mini course",
    description: "A starting point for checking whether the business is Pinterest-bound and Pinterest-ready.",
  },
  {
    title: "Pinterest Content Checklist",
    type: "Download",
    description: "A practical list for posting with purpose instead of pinning at random.",
  },
  {
    title: "Client-Attracting Pin Ideas Prompt Sheet",
    type: "Prompt sheet",
    description: "Content prompts for turning browsers into buyers with clearer pin angles.",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "pinterest-marketing-for-gardening-brands",
    title: "Pinterest Marketing for Gardening: How to Show Up in Real Searches",
    category: "Pinterest Marketing",
    date: "February 5, 2026",
    excerpt:
      "For gardening brands and bloggers, Pinterest works best when content matches the projects, problems, and plans people are already searching for.",
    keyTakeaways: [
      "Pinterest is search and saving, not daily posting for its own sake.",
      "Gardening searches cluster around projects, problems, and seasonal plans.",
      "Pins should send people to the page that fulfills the promise, not a generic homepage.",
    ],
    sections: [
      {
        heading: "What Pinterest is for in gardening",
        body:
          "Gardeners use Pinterest to plan what to plant, build, solve, and buy. Pretty photos help, but each pin needs a clear job: teach, answer, show a plan, solve a problem, or help someone decide the next step.",
      },
      {
        heading: "How to use Pinterest keywords",
        body:
          "Use the language people already type into Pinterest in board names, pin titles, descriptions, overlays, and landing-page copy. The system works best when the search phrase, pin promise, and destination page match.",
      },
      {
        heading: "A realistic timeline",
        body:
          "The first weeks build signals. Around three months, early winners can appear. By six months, compounding becomes more visible if boards, keywords, and landing pages stay aligned.",
      },
    ],
  },
  {
    slug: "pinterest-organic-vs-ads",
    title: "Pinterest Organic vs Ads: What Each One Is Actually For",
    category: "Pinterest Ads",
    date: "January 17, 2026",
    excerpt:
      "Organic Pinterest and Pinterest ads do different jobs. Organic builds the library; ads buy speed and distribution when the funnel is ready.",
    keyTakeaways: [
      "Organic builds compounding discovery over time.",
      "Ads create faster traffic and faster learning.",
      "The strongest path is often organic winners amplified by ads.",
    ],
    sections: [
      {
        heading: "Organic is the long game",
        body:
          "Organic Pinterest builds searchable assets that can resurface as people search, save, and return. It needs consistency and a useful destination for each click.",
      },
      {
        heading: "Ads are the speed layer",
        body:
          "Pinterest ads help test offers, distribute content, and support launches faster, but they amplify whatever the funnel already is. Weak landing pages still create weak outcomes.",
      },
      {
        heading: "Use the combo on purpose",
        body:
          "A practical path is to build the organic library, identify strong topics and creative, then use ads to send more of the right people to the strongest next step.",
      },
    ],
  },
  {
    slug: "pinterest-in-2026-for-product-brands",
    title: "Pinterest in 2026 for Product Brands: Pretty Pins Don't Win. Strategy Does.",
    category: "E-commerce Marketing",
    date: "January 2026",
    excerpt:
      "Product brands need more than attractive pins. Pinterest works when search intent, creative, product pages, and measurement are connected.",
    keyTakeaways: [
      "Pretty pins are not a strategy by themselves.",
      "Product content needs a clear search and shopping job.",
      "The real opportunity is connecting discovery to pages that help people decide.",
    ],
    sections: [
      {
        heading: "Search intent comes first",
        body:
          "Pinterest users are planning, comparing, and saving. Product brands need to show up for the specific problems, projects, and product moments people are already researching.",
      },
      {
        heading: "Creative has to connect to the offer",
        body:
          "Pins should make a promise the landing page can keep. The creative, title, description, and product or collection page should feel like one continuous path.",
      },
      {
        heading: "Measurement keeps the system honest",
        body:
          "Useful reporting looks past vanity metrics and asks which searches, pins, products, and pages are creating saves, outbound clicks, signups, and sales signals.",
      },
    ],
  },
];

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
