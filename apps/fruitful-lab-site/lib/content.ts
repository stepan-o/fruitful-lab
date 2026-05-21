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
      "A focused first conversation to understand the offer, current growth path, bottlenecks, and whether Fruitful Lab is the right partner for the next move.",
    bestFor: "Founders and small teams that know the marketing system needs work, but do not yet know which piece should move first.",
    includes: [
      "Current offer and audience context",
      "Quick read on traffic, funnel, content, and follow-up",
      "Fit and readiness conversation",
      "Recommended next step when there is a match",
    ],
    cta: "Book the fit call",
  },
  {
    title: "Growth Systems Diagnostic",
    kicker: "Lead product",
    description:
      "A paid strategy map that turns the messy middle into a clear build plan: offer path, landing page, email, paid media, content, AI workflows, and reporting.",
    bestFor: "Brands that need clarity before investing in a larger funnel, campaign, automation, content engine, or AI workflow project.",
    includes: [
      "Funnel and customer-path review",
      "Channel, content, and email opportunity map",
      "AI workflow and operations opportunities",
      "Prioritized roadmap for the first build",
    ],
    cta: "Start with a diagnostic",
  },
  {
    title: "Implementation Sprint",
    kicker: "Build the first useful system",
    description:
      "A scoped build for the highest-leverage piece: a landing page, lead path, email sequence, campaign structure, content engine, or practical AI workflow.",
    bestFor: "Teams ready to turn the diagnostic into a working asset without trying to rebuild the whole business at once.",
    includes: [
      "Build plan and production timeline",
      "Copy, structure, and implementation support",
      "Tracking or reporting requirements",
      "Launch-ready handoff and next-test plan",
    ],
    cta: "Plan an implementation sprint",
  },
  {
    title: "Scale Partnership",
    kicker: "Bigger projects and ongoing systems",
    description:
      "Longer support for brands that need the system improved over time across paid media, funnels, email, content, reporting, and AI-assisted operations.",
    bestFor: "Businesses with a validated direction that want a strategic implementation partner across several connected marketing pieces.",
    includes: [
      "Campaign and funnel iteration",
      "Email, content, and resource systems",
      "AI workflow libraries and team enablement",
      "Decision dashboards and growth experiments",
    ],
    cta: "Discuss the bigger system",
  },
];

export const PROCESS_STEPS = [
  {
    title: "Find the fit",
    description:
      "Start with a conversation about the offer, audience, current systems, constraints, and whether there is a strong reason to keep exploring together.",
  },
  {
    title: "Map the system",
    description:
      "Use the diagnostic to decide what should be built first, what can wait, and how the work should connect across channels.",
  },
  {
    title: "Build and expand",
    description:
      "Ship the first useful system, then use signals from the work to choose the next campaign, workflow, email path, or growth experiment.",
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
    title: "Funnel Clarity Checklist",
    type: "Guide",
    description: "A simple way to see where the current path from attention to inquiry is leaking momentum.",
  },
  {
    title: "AI Workflow Starter Map",
    type: "Template",
    description: "A practical planning asset for deciding which parts of content, research, and reporting should become repeatable.",
  },
  {
    title: "Content-to-Email Planner",
    type: "Worksheet",
    description: "A lightweight structure for turning expertise into resources, nurture, and conversion moments.",
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "which-growth-system-to-build-first",
    title: "How to Know Which Growth System to Build First",
    category: "Growth Systems",
    date: "May 2026",
    excerpt:
      "A useful marketing system starts with the bottleneck, not the trend. The first job is knowing whether the offer, funnel, traffic, content, or follow-up needs attention.",
    keyTakeaways: [
      "The best first system is usually the one closest to the current revenue constraint.",
      "Traffic does not fix an unclear offer or a weak conversion path.",
      "Small, useful systems are easier to improve than big unfinished rebuilds.",
    ],
    sections: [
      {
        heading: "Start with the current bottleneck",
        body:
          "Before choosing a channel or tactic, look at what already happens when someone discovers the brand. If people are clicking but not inquiring, the page or offer may need work. If people love the offer but do not hear from you again, email follow-up may matter more than new traffic.",
      },
      {
        heading: "Build the smallest useful version",
        body:
          "A first system does not need to be fancy. It can be a clearer services page, a better inquiry form, a simple lead magnet, a three-email follow-up, or a campaign test with clean reporting.",
      },
      {
        heading: "Let the signal choose the next move",
        body:
          "Once the first version is live, performance should guide the next improvement. The goal is not to make every channel busy. The goal is to make the path easier to understand and easier to trust.",
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
    title: "Your Content Needs a Conversion Path",
    category: "Content Strategy",
    date: "May 2026",
    excerpt:
      "Content becomes more useful when each piece has a job: attract the right person, answer the right question, and point to a reasonable next step.",
    keyTakeaways: [
      "Content should connect to an offer, resource, email path, or decision moment.",
      "The next step should match the reader's level of readiness.",
      "A content engine is easier to maintain when the jobs are clear.",
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
