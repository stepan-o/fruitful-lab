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
  {
    slug: "search-is-not-one-channel-anymore",
    title: "Search Is Not One Channel Anymore",
    category: "Search Ecosystem",
    date: "May 2026",
    excerpt:
      "Product discovery now happens across Google, Pinterest-style discovery, AI answers, marketplaces, social search, and saved recommendations. The strategy has to connect those behaviors instead of treating search like one box.",
    keyTakeaways: [
      "Search behavior is spreading across several discovery environments.",
      "Product pages and content need to answer more than one kind of intent.",
      "The best search system connects discovery, education, trust, and action.",
    ],
    sections: [
      {
        heading: "Discovery is more fragmented",
        body:
          "Customers do not only search in one place. They compare, save, ask, browse, and return through several surfaces before they feel ready to buy. That means product discovery needs a broader map.",
      },
      {
        heading: "The content has to carry the context",
        body:
          "A strong product path answers what the product is, who it is for, when it matters, how it compares, and what step makes sense next.",
      },
      {
        heading: "Build the signal loop",
        body:
          "The goal is not to chase every channel. The goal is to understand where people look, what they need to trust, and which pieces make the next decision clearer.",
      },
    ],
  },
  {
    slug: "what-a-growth-formula-diagnostic-can-show",
    title: "What a Growth Formula Diagnostic Can Show",
    category: "Data + Testing",
    date: "May 2026",
    excerpt:
      "A useful diagnostic does not hand the brand a pile of tactics. It shows which part of the discovery system is weak, which first build is worth shipping, and what signal should guide the next move.",
    keyTakeaways: [
      "Diagnostics are most useful when they lead to a decision.",
      "The first build should match the current bottleneck.",
      "A clear signal plan keeps the system from getting busier without getting better.",
    ],
    sections: [
      {
        heading: "Look for the constraint",
        body:
          "The highest-leverage move might be search visibility, offer clarity, content structure, email follow-up, reporting, or the workflow behind production. The diagnostic is where those pieces get compared.",
      },
      {
        heading: "Turn the map into a build",
        body:
          "A good map should lead to a practical next asset: a page, sequence, report, campaign, content path, or workflow that can actually ship.",
      },
      {
        heading: "Decide how the work will be judged",
        body:
          "Before expanding the system, define the signal that would make the next decision clearer. That is what turns strategy into a working formula.",
      },
    ],
  },
  {
    slug: "where-ai-belongs-in-the-marketing-workbench",
    title: "Where AI Belongs in the Marketing Workbench",
    category: "AI Workflows",
    date: "May 2026",
    excerpt:
      "AI is strongest when it sits inside a workflow with source material, review points, and a clear job. It should make the work calmer, not flatten the brand into generic output.",
    keyTakeaways: [
      "AI needs source material and rules to protect voice.",
      "The workflow should define what the human still decides.",
      "Useful AI systems reduce friction instead of creating more content to manage.",
    ],
    sections: [
      {
        heading: "Start with the job",
        body:
          "Research, repurposing, QA, reporting notes, and first-pass outlines can all benefit from AI support, but only when the job is clear.",
      },
      {
        heading: "Keep judgment in the loop",
        body:
          "The brand still needs human taste, context, and decision-making. The workflow should make that judgment easier to apply.",
      },
      {
        heading: "Make the system reusable",
        body:
          "A useful AI workflow can be repeated and improved. It has inputs, rules, examples, review steps, and a definition of done.",
      },
    ],
  },
  {
    slug: "email-paths-are-part-of-product-discovery",
    title: "Email Paths Are Part of Product Discovery",
    category: "Lifecycle",
    date: "May 2026",
    excerpt:
      "Follow-up is part of the product path. Email gives interested people a calm way back to the offer, the use case, and the next decision when they are not ready on the first visit.",
    keyTakeaways: [
      "Lifecycle paths keep discovery from going cold after the first click.",
      "Useful email systems connect back to product questions, objections, and use cases.",
      "The best follow-up path helps people decide without forcing urgency too early.",
    ],
    sections: [
      {
        heading: "Treat follow-up as product discovery",
        body:
          "A person may understand the product in pieces: one article, one search, one product page, one saved resource, then a later email. The follow-up path should make that return easier.",
      },
      {
        heading: "Answer the next question",
        body:
          "Good lifecycle content does not only announce offers. It answers what the product does, when it matters, who it is for, what makes it trustworthy, and what step is reasonable now.",
      },
      {
        heading: "Keep the sequence useful",
        body:
          "A lighter sequence with clear jobs can often do more than a complicated automation. The goal is to keep the path warm, helpful, and connected to real decisions.",
      },
    ],
  },
];

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
