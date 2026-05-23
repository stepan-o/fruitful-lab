export type ServicePackage = {
  title: string;
  kicker: string;
  description: string;
  bestFor: string;
  outcome: string;
  timeline: string;
  includes: string[];
  cta: string;
};

export type CaseStudy = {
  brand: string;
  context: string;
  result: string;
  metricLabel: string;
  metricValue: string;
  permissionStatus: "approved snapshot" | "needs final proof packet";
};

export type TrustLogo = {
  name: string;
};

export type Testimonial = {
  brand: string;
  role: string;
  quote: string;
  outcome: string;
  initials: string;
};

export type CertificationBadge = {
  label: string;
  detail: string;
};

export type NiceWord = {
  name: string;
  role: string;
  quote: string;
  detail: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  date: string;
  featuredImage?: {
    src: string;
    alt: string;
  };
  excerpt: string;
  keyTakeaways: string[];
  sections: Array<{ heading: string; body: string }>;
  pullQuote?: string;
  featuredPinGraphic?: {
    title: string;
    description: string;
  };
  pinGraphics?: Array<{
    title: string;
    description: string;
  }>;
  comparisonTable?: {
    title: string;
    description: string;
    columns: string[];
    rows: string[][];
  };
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
};

export type ResourceItem = {
  title: string;
  type: string;
  status: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export const PIN_SYSTEM_PILLARS = [
  {
    title: "Search, but make it human",
    description:
      "We use the words people actually search for, then turn them into pin ideas, boards, and pages that still sound like your brand.",
  },
  {
    title: "Pretty pins need somewhere to go",
    description:
      "Every pin needs a next step that makes sense: a guide, product page, opt-in, collection, service page, or booking path.",
  },
  {
    title: "Creative with a little backbone",
    description:
      "The visuals can be bright and fun, but the idea underneath has to do something useful for a real person.",
  },
  {
    title: "Numbers without the fog machine",
    description:
      "We read saves, clicks, spend, traffic quality, and conversion signals as clues for what to keep, fix, scale, or stop.",
  },
] as const;

export const AUDIENCE_PATHS = [
  {
    title: "Product brands",
    signal: "For the shop with products people already dream about, compare, save, and plan around",
    description:
      "Build a Pinterest path from search intent to product education, collection pages, buying guides, and traffic that has somewhere useful to land.",
    examples: ["Shopify or catalog-led brands", "Food, home, wellness, garden, and lifestyle products", "Brands with strong visuals and clear product stories"],
  },
  {
    title: "Content-led businesses",
    signal: "For the brand sitting on genuinely helpful content that should not disappear in 24 hours",
    description:
      "Turn articles, guides, recipes, tutorials, and opt-ins into a searchable Pinterest library that keeps working after the publish day glow fades.",
    examples: ["Bloggers and educators", "Course or template sellers", "Service brands with strong educational content"],
  },
  {
    title: "Pinterest-ready funnels",
    signal: "For the business that has a clear offer and wants Pinterest to support the next move",
    description:
      "Use organic content, ads, or both when the offer path is ready enough to learn from traffic instead of guessing in the dark.",
    examples: ["Opt-in pages", "Product launches", "Evergreen service or sales pages"],
  },
] as const;

export const SERVICE_PACKAGES: ServicePackage[] = [
  {
    title: "Full-Funnel Pinterest Growth",
    kicker: "Organic + ads, same brain",
    description:
      "For brands that want Pinterest connected to visibility, traffic, list growth, and sales instead of living in a lonely little pinning corner.",
    bestFor: "Brands with offers, content, and enough traction to connect Pinterest to a real customer path.",
    outcome: "A Pinterest system where organic content, paid amplification, landing pages, and reporting talk to each other.",
    timeline: "Best reviewed in 90-day strategy cycles.",
    includes: [
      "Pinterest strategy mapped to offers and landing pages",
      "Organic pin creation, board structure, and keyword-informed publishing",
      "Ads planning and optimization when the funnel is ready",
      "Monthly reporting focused on clicks, saves, traffic, and conversion signals",
    ],
    cta: "Book a Fit Call",
  },
  {
    title: "Organic Pinterest Management",
    kicker: "Slow-burn traffic, built on purpose",
    description:
      "Done-for-you Pinterest management for brands that want consistent pin creation, scheduling, and optimization without adding another recurring chore to the pile.",
    bestFor: "Content creators, educators, and product brands with useful content or collections to send traffic toward.",
    outcome: "A growing library of search-aligned pins, boards, and content paths that can keep working beyond the publish date.",
    timeline: "Usually evaluated over 3 to 6 months.",
    includes: [
      "Keyword and board strategy",
      "Monthly pin design and scheduling",
      "Fresh content angles for search and seasonal planning",
      "Performance review with next-step recommendations",
    ],
    cta: "Book a Fit Call",
  },
  {
    title: "Pinterest Ads Management",
    kicker: "Paid reach with fewer mystery decisions",
    description:
      "Pinterest ad support for brands that need faster learning, launch support, or a way to amplify content that already has a clear job.",
    bestFor: "Product brands and lead-generation funnels with clear offers, tracking, and landing pages ready for traffic.",
    outcome: "Campaigns structured around learning, signal quality, creative tests, and the page experience after the click.",
    timeline: "Launch and learning cycles vary by budget, tracking quality, and funnel readiness.",
    includes: [
      "Campaign structure and audience planning",
      "Creative testing plan tied to funnel goals",
      "Launch, monitoring, and optimization",
      "Readable reporting that connects spend to useful signals",
    ],
    cta: "Book a Fit Call",
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
    description: "A clearer keyword and board foundation for being found by the right people.",
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
    result: "Pinterest ads and organic content worked together to support product-page traffic and purchase intent.",
    metricLabel: "Reported ROAS",
    metricValue: "4x",
    permissionStatus: "approved snapshot",
  },
  {
    brand: "Visit Southern Spain",
    context: "Organic strategy for a travel publisher",
    result: "Pinterest became a more durable discovery channel for evergreen travel planning content.",
    metricLabel: "Channel role",
    metricValue: "Top driver",
    permissionStatus: "needs final proof packet",
  },
  {
    brand: "Armstrong-Clark",
    context: "Seasonal Pinterest campaign support",
    result: "Seasonal content and campaign planning lifted visibility during the period when demand mattered most.",
    metricLabel: "Campaign focus",
    metricValue: "Seasonal lift",
    permissionStatus: "needs final proof packet",
  },
];

export const TRUST_LOGOS: TrustLogo[] = [
  { name: "Quickies" },
  { name: "Mimi Organic Seeds" },
  { name: "Organic Prairie" },
  { name: "Secret Weight Loss Recipe" },
  { name: "Armstrong-Clark" },
] as const;

export const TESTIMONIALS: Testimonial[] = [
  {
    brand: "Organic Prairie",
    role: "Marketing Director",
    quote: "Pinterest became a real growth channel for us, supporting stronger ROAS and steady organic traffic.",
    outcome: "4x ROAS, steady organic growth",
    initials: "OP",
  },
  {
    brand: "Visit Southern Spain",
    role: "Full-time Travel Blogger",
    quote: "We stopped chasing trends and finally invested in Pinterest as one of our strongest platforms.",
    outcome: "Pinterest became a top traffic driver",
    initials: "VS",
  },
  {
    brand: "Armstrong-Clark",
    role: "Founder",
    quote: "Seasonal Pinterest campaigns helped us reach new audiences and lift visibility when demand mattered most.",
    outcome: "Increased visibility during peak season",
    initials: "AC",
  },
] as const;

export const CERTIFICATION_BADGES: CertificationBadge[] = [
  {
    label: "Pinterest certification",
    detail: "Badge artwork to be replaced with Susy's official asset",
  },
  {
    label: "Pinterest ads certification",
    detail: "Badge artwork to be replaced with Susy's official asset",
  },
] as const;

export const NICE_WORDS: NiceWord[] = [
  {
    name: "Paulina W.",
    role: "Content Manager, Visit Southern Spain",
    quote:
      "Susy's expertise and strategic approach significantly boosted traffic to my websites. Her hands-off strategy let me focus on other parts of my business.",
    detail: "Pinterest Marketing Strategist",
  },
  {
    name: "Adrian Gentilcore",
    role: "Pinterest Manager",
    quote:
      "I've appreciated Susy's depth of Pinterest knowledge. She has been very helpful when I've had puzzling issues on client accounts.",
    detail: "Peer recommendation",
  },
  {
    name: "Becky Davidson",
    role: "Pipeline Conversion Strategist",
    quote:
      "Susy is a rockstar at helping clients understand, utilize, and maximize the power of Pinterest as a search engine.",
    detail: "Business recommendation",
  },
  {
    name: "Eangelica Germano Aton",
    role: "Co-Founder & CEO, Tapas",
    quote:
      "Susana is collaborative and strategic, focusing on participant experience while delivering metrics with empathy, growth, and impact.",
    detail: "Collaboration recommendation",
  },
] as const;

export const PROCESS_STEPS = [
  {
    title: "Find the fit",
    description:
      "We look at the offer, current content, landing pages, Pinterest account, search demand, and what Pinterest should actually do for the business.",
    points: ["Brand and content deep dive", "Pinterest setup review", "Funnel-first strategy"],
  },
  {
    title: "Build the pin path",
    description:
      "The work becomes repeatable: boards, keywords, creative patterns, publishing rhythm, campaign structure, and pages that can carry the click.",
    points: ["Pin design and scheduling", "Organic and ads support", "Search-led content mapping"],
  },
  {
    title: "Read the signals",
    description:
      "Reporting turns the messy middle into decisions: what to keep, what to improve, what to amplify, and what is just making noise.",
    points: ["Clear monthly reports", "Strategy check-ins", "Continuous optimization"],
  },
] as const;

export const FIT_SIGNALS = {
  good: [
    "You sell products people research, compare, save, gift, style, or plan around.",
    "You publish useful content in niches like food, travel, home, wellness, education, gardening, or lifestyle.",
    "You want visibility that can keep working beyond one post, launch, or campaign.",
    "You have offers, pages, or content worth sending traffic toward.",
  ],
  notYet: [
    "You need overnight results, viral spikes, or instant sales from Pinterest.",
    "You only want someone to post pretty pins without looking at the bigger business picture.",
    "You do not have an offer, content library, product page, or website experience ready yet.",
  ],
} as const;

export const RESOURCE_ITEMS: ResourceItem[] = [
  {
    title: "Pinterest Fit Check",
    type: "Quiz",
    status: "Ready now",
    description:
      "A quick questionnaire to help you see whether Pinterest is worth building around right now, based on your offer, content, website, and goals.",
    ctaLabel: "Start the Fit Check",
    ctaHref: "/pinterest-fit-check",
  },
  {
    title: "Pinterest Opportunity Guide",
    type: "Guide",
    status: "Waitlist",
    description:
      "A simple guide for understanding when Pinterest makes sense, what needs to be ready first, and what kind of business benefits most.",
    ctaLabel: "Join the list",
    ctaHref: "/contact",
  },
  {
    title: "Pinterest Page Readiness Checklist",
    type: "Checklist",
    status: "Waitlist",
    description:
      "A practical checklist for seeing whether your product page, blog post, offer, or opt-in is ready to receive Pinterest traffic.",
    ctaLabel: "Join the list",
    ctaHref: "/contact",
  },
  {
    title: "Pinterest Keyword Starter Kit",
    type: "Keyword Kit",
    status: "Waitlist",
    description:
      "A beginner-friendly keyword guide for finding the words people may already use when they search, plan, compare, and save.",
    ctaLabel: "Join the list",
    ctaHref: "/contact",
  },
  {
    title: "Pin Ideas for Product Brands",
    type: "Prompt Sheet",
    status: "Waitlist",
    description:
      "Prompt-style idea starters for turning products, use cases, FAQs, seasonal moments, and customer questions into pins people may actually save and click.",
    ctaLabel: "Join the list",
    ctaHref: "/contact",
  },
  {
    title: "Pinterest articles",
    type: "Blog",
    status: "Ready now",
    description:
      "Plain-English articles on Pinterest strategy, organic growth, ads, product discovery, and what a pin is supposed to help people do.",
    ctaLabel: "Read the blog",
    ctaHref: "/blog",
  },
];

export const TOOL_STACK = [
  {
    name: "ClickUp",
    bestFor: "Content planning and production tracking",
    description: "Use it to keep blog posts, pins, client tasks, approvals, and recurring workflows from living in scattered notes.",
    ctaHref: "https://clickup.com/",
  },
  {
    name: "Metricool",
    bestFor: "Scheduling, reporting, and channel visibility",
    description: "Useful for planning and scheduling content, reviewing performance, and keeping social publishing less chaotic.",
    ctaHref: "https://metricool.com/",
  },
  {
    name: "MailerLite",
    bestFor: "Email capture and nurture sequences",
    description: "Useful for turning Pinterest traffic into subscribers through forms, automations, and simple email follow-up.",
    ctaHref: "https://www.mailerlite.com/",
  },
] as const;

export const FAQS = [
  {
    question: "Do I need Pinterest ads right away?",
    answer:
      "Not always. Ads make more sense when the offer, landing page, tracking, and creative direction are ready enough to learn from paid traffic. Organic work can build the search foundation first.",
  },
  {
    question: "Can Pinterest work if I am not posting every day?",
    answer:
      "Pinterest does not need to be treated like a daily social feed. It needs useful content, search alignment, strong destinations, and enough consistency for the account to build signals over time.",
  },
  {
    question: "What should be ready before we work together?",
    answer:
      "At minimum, you need a real offer, a website or landing page worth sending people to, and a willingness to make the post-click experience stronger if the data shows that is the bottleneck.",
  },
] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "pinterest-marketing-for-gardening-brands",
    title: "Pinterest Marketing for Gardening: How to Show Up in Real Searches",
    category: "Pinterest Marketing",
    date: "February 5, 2026",
    excerpt:
      "For gardening brands and bloggers, Pinterest works best when your ideas show up while people are planning what to plant, buy, fix, or try next.",
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
      "Organic Pinterest and Pinterest ads can both help, but they solve different problems. Learn when to build the base, when to test paid reach, and what needs to be ready first.",
    keyTakeaways: [
      "Organic builds compounding discovery over time.",
      "Ads create faster traffic and faster learning.",
      "The strongest path is often organic winners amplified by ads.",
    ],
    pullQuote:
      "Organic Pinterest builds the library. Ads buy speed. The strongest strategy knows which job each one is supposed to do.",
    featuredPinGraphic: {
      title: "Pinterest Organic vs Ads",
      description: "A saveable vertical Pinterest graphic summarizing the main decision inside the article.",
    },
    pinGraphics: [
      {
        title: "Organic vs Ads: the simple split",
        description: "A vertical pin graphic that summarizes organic as the search library and ads as the speed layer.",
      },
      {
        title: "When to use Pinterest ads",
        description: "A checklist-style pin graphic for offers, landing pages, tracking, and creative readiness.",
      },
    ],
    comparisonTable: {
      title: "Organic Pinterest vs Pinterest Ads",
      description: "A quick way to compare the job each channel is better suited to do.",
      columns: ["Organic Pinterest", "Pinterest Ads"],
      rows: [
        ["Builds compounding search visibility over time.", "Creates faster traffic and faster learning."],
        ["Best when you have useful content and consistent destinations.", "Best when the offer, page, and tracking are ready."],
        ["Useful for long-term saves, clicks, and content discovery.", "Useful for launches, tests, and scaling proven angles."],
      ],
    },
    faqs: [
      {
        question: "Should I start with organic Pinterest or ads?",
        answer:
          "Start with the channel that matches your readiness. Organic is usually stronger when you need a search foundation; ads make more sense when the funnel is ready to learn from paid traffic.",
      },
      {
        question: "Can organic Pinterest and Pinterest ads work together?",
        answer:
          "Yes. Organic content can reveal strong topics and creative angles, while ads can amplify what already has a clear job and destination.",
      },
      {
        question: "Do Pinterest ads replace organic Pinterest?",
        answer:
          "No. Ads can speed up distribution, but organic Pinterest still builds a searchable library and gives the account more long-term context.",
      },
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
      "For product brands, Pinterest works better when pretty creative connects to the questions people ask before they buy, compare, save, or choose.",
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
