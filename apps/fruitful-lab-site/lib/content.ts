export type ServicePackage = {
  title: string;
  kicker: string;
  description: string;
  bestFor: string;
  includes: string[];
  cta: string;
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
    title: "Fit Call",
    kicker: "First filter",
    description:
      "A focused first conversation to understand the product, current visibility path, data signals, bottlenecks, and whether Fruitful Lab is the right partner for the next move.",
    bestFor: "Founders and small teams that know the discovery ecosystem around the product needs work, but do not yet know which piece should move first.",
    includes: [
      "Current product, audience, and channel context",
      "Quick read on search, content, funnel, data, and follow-up",
      "Fit and readiness conversation",
      "Recommended next step when there is a match",
    ],
    cta: "Book the fit call",
  },
  {
    title: "Growth Systems Diagnostic",
    kicker: "Lead product",
    description:
      "A paid strategy map that turns the messy middle into a clearer product-discovery plan: story, search, content angles, email path, paid traffic readiness, data, testing, and AI-supported workflows.",
    bestFor: "Brands that need clarity before investing in a larger funnel, campaign, content ecosystem, reporting workflow, or AI-assisted build.",
    includes: [
      "Product discovery and customer-path review",
      "Search, content, and email opportunity map",
      "Analytics, reporting, and testing opportunities",
      "Prioritized roadmap for the first build",
    ],
    cta: "Start with a diagnostic",
  },
  {
    title: "Implementation Sprint",
    kicker: "Build the first useful system",
    description:
      "A scoped build for the highest-leverage piece: a search-informed page, product content path, email sequence, campaign structure, reporting loop, or practical AI workflow.",
    bestFor: "Teams ready to turn the diagnostic into a working asset without trying to rebuild the whole marketing ecosystem at once.",
    includes: [
      "Build plan and production timeline",
      "Copy, structure, and implementation support",
      "Tracking, reporting, or experiment requirements",
      "Launch-ready handoff and next-test plan",
    ],
    cta: "Plan an implementation sprint",
  },
  {
    title: "Scale Partnership",
    kicker: "Bigger projects and ongoing systems",
    description:
      "Longer support for brands that need the ecosystem improved over time across search, content, email, paid media, analytics, reporting, testing, and AI-assisted operations.",
    bestFor: "Businesses with a validated direction that want a strategic implementation partner across several connected growth pieces.",
    includes: [
      "Campaign and funnel iteration",
      "Email, content, search, and resource systems",
      "AI workflow libraries and team enablement",
      "Decision dashboards, reporting rhythms, and growth experiments",
    ],
    cta: "Discuss the bigger system",
  },
];

export const PROCESS_STEPS = [
  {
    title: "Find the fit",
    description:
      "Start with a conversation about the product, audience, current channels, constraints, and whether there is a strong reason to keep exploring together.",
  },
  {
    title: "Map the ecosystem",
    description:
      "Use the diagnostic to decide what should be built first, what can wait, and how search, content, email, paid traffic, data, and workflows should connect.",
  },
  {
    title: "Build, test, expand",
    description:
      "Ship the first useful asset, then use real signals to choose the next campaign, workflow, email path, report, or growth experiment.",
  },
] as const;

export const ECOSYSTEM_ITEMS = [
  {
    name: "Fruitful Pin",
    role: "Pinterest-specific commercial brand",
    description: "The focused Pinterest strategy and growth brand inside the wider Fruitful Lab ecosystem.",
  },
  {
    name: "Bloom Whispers",
    role: "Future brand property",
    description: "A separate brand space that can grow with its own identity, content, and offers.",
  },
  {
    name: "Bricoli Studio",
    role: "Future creative or studio property",
    description: "A distinct brand that can live beside the marketing systems work without being folded into one website.",
  },
] as const;

export const RESOURCE_ITEMS = [
  {
    title: "Product Discovery Checklist",
    type: "Guide",
    description: "A simple way to see where the path from product story to search, content, trust, and purchase is leaking momentum.",
  },
  {
    title: "Search + Content Angle Map",
    type: "Template",
    description: "A practical planning asset for turning product features, use cases, routines, objections, and buying moments into content.",
  },
  {
    title: "Data-to-Decision Planner",
    type: "Worksheet",
    description: "A lightweight structure for turning analytics, reporting, and test ideas into clearer next moves.",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "which-growth-system-to-build-first",
    title: "How to Know Which Product Discovery Piece to Build First",
    category: "Product Discovery",
    date: "May 2026",
    excerpt:
      "A useful growth ecosystem starts with the bottleneck, not the trend. The first job is knowing whether search, product story, content, funnel, email, or reporting needs attention.",
    keyTakeaways: [
      "The best first piece is usually the one closest to the current growth constraint.",
      "Traffic does not fix unclear product angles or a weak path to trust.",
      "Small, useful systems are easier to test than big unfinished rebuilds.",
    ],
    sections: [
      {
        heading: "Start with the current bottleneck",
        body:
          "Before choosing a channel or tactic, look at what already happens when someone discovers the product. If people are clicking but not buying, the page, product angles, or trust signals may need work. If people show interest but do not hear from you again, email follow-up may matter more than new traffic.",
      },
      {
        heading: "Build the smallest useful version",
        body:
          "A first system does not need to be fancy. It can be a clearer product page, a better use-case content path, a simple lead magnet, a three-email follow-up, or a campaign test with clean reporting.",
      },
      {
        heading: "Let the signal choose the next move",
        body:
          "Once the first version is live, performance should guide the next improvement. The goal is not to make every channel busy. The goal is to make the product easier to understand, easier to trust, and easier to choose.",
      },
    ],
  },
  {
    slug: "ai-workflows-that-keep-your-brand-human",
    title: "AI Workflows That Keep Your Brand Human",
    category: "AI Workflows",
    date: "May 2026",
    excerpt:
      "AI works best when it supports judgment, saves time, and protects the brand voice instead of replacing the thinking that makes the work valuable.",
    keyTakeaways: [
      "Good AI workflows define the human decision points.",
      "Brand voice improves when examples, rules, and review steps are clear.",
      "The goal is a calmer system, not more content noise.",
    ],
    sections: [
      {
        heading: "Use AI where repetition is expensive",
        body:
          "Research summaries, first-pass outlines, repurposing, QA checks, and reporting notes can often move faster with AI support. The human still owns positioning, judgment, and final decisions.",
      },
      {
        heading: "Protect the voice with source material",
        body:
          "The strongest workflows start with real examples: client language, best-performing content, offer notes, and phrases that sound like the brand. AI needs boundaries to be useful.",
      },
      {
        heading: "Make review part of the system",
        body:
          "A workflow is only useful if it includes review, approvals, and a clear definition of done. That is what keeps speed from becoming sloppiness.",
      },
    ],
  },
  {
    slug: "content-needs-a-conversion-path",
    title: "Your Content Needs a Product Path",
    category: "Content Ecosystem",
    date: "May 2026",
    excerpt:
      "Content becomes more useful when each piece has a job: attract the right person, answer the right question, show the right use case, and point to a reasonable next step.",
    keyTakeaways: [
      "Content should connect to a product, resource, email path, or decision moment.",
      "The next step should match the reader's level of readiness.",
      "A content ecosystem is easier to maintain when the jobs are clear.",
    ],
    sections: [
      {
        heading: "Every piece needs a job",
        body:
          "Some content earns trust. Some answers search questions. Some supports sales conversations. Some sends readers to a resource. Naming the job makes the content easier to create and easier to measure.",
      },
      {
        heading: "Match the next step to readiness",
        body:
          "A cold reader may need a useful guide or a clear article path. A warmer reader may need a services page, a case example, or a call. The path should feel natural, not forced.",
      },
      {
        heading: "Keep the system light enough to ship",
        body:
          "The best content plan is one the business can actually maintain. A smaller rhythm with clear repurposing and email follow-up often beats an ambitious calendar that never goes live.",
      },
    ],
  },
];

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
