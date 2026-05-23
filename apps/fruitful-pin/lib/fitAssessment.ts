export type PinterestFitAssessmentOption = {
  id: string;
  label: string;
  helper: string;
  points: number;
  signal?: string;
};

export type PinterestFitAssessmentQuestion = {
  id: string;
  question: string;
  options: PinterestFitAssessmentOption[];
};

export type PinterestFitAssessmentAnswers = Partial<Record<string, string>>;

export type PinterestFitAssessmentOutcome = {
  id: "strong-fit" | "possible-fit" | "later-fit";
  label: string;
  headline: string;
  summary: string;
  nextStep: string;
};

export type PinterestFitAssessmentResult = {
  totalScore: number;
  maxScore: number;
  answeredCount: number;
  outcome: PinterestFitAssessmentOutcome;
  signals: string[];
};

export const PINTEREST_FIT_ASSESSMENT_QUESTIONS: PinterestFitAssessmentQuestion[] = [
  {
    id: "destination",
    question: "What would you mainly send Pinterest traffic toward?",
    options: [
      {
        id: "products",
        label: "Product or collection pages",
        helper: "Products people can compare, save, plan around, or buy online.",
        points: 4,
        signal: "You have a concrete destination for Pinterest traffic.",
      },
      {
        id: "content",
        label: "Blog posts, guides, recipes, or tutorials",
        helper: "Useful content that can answer searches and keep working after publish day.",
        points: 4,
        signal: "Your content can become a searchable Pinterest library.",
      },
      {
        id: "service",
        label: "A service, lead magnet, or booking path",
        helper: "A softer conversion path where the click needs more context before a sale.",
        points: 3,
        signal: "Pinterest can support a warmer service or list-building path.",
      },
      {
        id: "new-idea",
        label: "A new idea that still needs proof",
        helper: "The offer or content direction is still being tested.",
        points: 1,
      },
    ],
  },
  {
    id: "proof",
    question: "How proven is the thing you would promote?",
    options: [
      {
        id: "known-winner",
        label: "We already know it sells, converts, or gets strong attention",
        helper: "There is enough signal to build around with more confidence.",
        points: 4,
        signal: "There is existing proof for Pinterest to amplify.",
      },
      {
        id: "some-traction",
        label: "There is some traction, but it is still growing",
        helper: "The offer or content has signs of demand, even if the path is not perfect.",
        points: 3,
        signal: "There is a real starting point to test and refine.",
      },
      {
        id: "early",
        label: "It is launched, but still early",
        helper: "There may be potential, but Pinterest would also be validating the basics.",
        points: 1,
      },
      {
        id: "not-proven",
        label: "It is not really proven yet",
        helper: "Pinterest may be premature until the offer or content has clearer demand.",
        points: 0,
      },
    ],
  },
  {
    id: "assets",
    question: "How much useful content or visual material do you already have?",
    options: [
      {
        id: "strong",
        label: "A strong library",
        helper: "Photos, articles, products, tutorials, or ideas that can become many pins.",
        points: 4,
        signal: "You have enough material to create fresh Pinterest angles.",
      },
      {
        id: "decent",
        label: "A decent starting library",
        helper: "There is useful material, but it needs organizing and stronger angles.",
        points: 3,
        signal: "You have material to work with once the strategy is focused.",
      },
      {
        id: "thin",
        label: "A thin library",
        helper: "A few usable pieces, but not enough for a steady Pinterest system yet.",
        points: 1,
      },
      {
        id: "bare",
        label: "Almost nothing yet",
        helper: "The content or visual foundation would need to be built first.",
        points: 0,
      },
    ],
  },
  {
    id: "website",
    question: "If Pinterest sent people to your site, how ready would that page feel?",
    options: [
      {
        id: "ready",
        label: "Ready enough to send traffic now",
        helper: "The page is clear, helpful, and gives visitors a sensible next step.",
        points: 4,
        signal: "The post-click path is ready enough to learn from traffic.",
      },
      {
        id: "needs-tightening",
        label: "Good, but it needs tightening",
        helper: "The page works, but stronger copy, images, or calls to action would help.",
        points: 3,
        signal: "A few page improvements could make Pinterest traffic more useful.",
      },
      {
        id: "gaps",
        label: "It works, but there are gaps",
        helper: "The click path exists, but visitors may need a clearer reason to keep going.",
        points: 1,
      },
      {
        id: "not-ready",
        label: "Not ready for traffic yet",
        helper: "The destination needs more work before visibility would be useful.",
        points: 0,
      },
    ],
  },
  {
    id: "goal",
    question: "What would you want Pinterest to do first?",
    options: [
      {
        id: "discovery",
        label: "Help new people discover the brand",
        helper: "A visibility and awareness role.",
        points: 3,
        signal: "Your first job for Pinterest is stronger discovery.",
      },
      {
        id: "traffic",
        label: "Send better traffic to useful pages",
        helper: "A search and click-through role.",
        points: 3,
        signal: "Your first job for Pinterest is qualified traffic.",
      },
      {
        id: "list",
        label: "Grow an email list or warm audience",
        helper: "A relationship-building role before the sale.",
        points: 3,
        signal: "Your first job for Pinterest is list or audience growth.",
      },
      {
        id: "sales-now",
        label: "Drive sales as quickly as possible",
        helper: "A more direct conversion role that needs a strong page and offer.",
        points: 2,
      },
    ],
  },
  {
    id: "support",
    question: "How ready are you to bring in Pinterest support if the fit looks real?",
    options: [
      {
        id: "ready-now",
        label: "Ready now",
        helper: "If the path makes sense, you would want help building it.",
        points: 3,
        signal: "You are ready to turn the assessment into a real plan.",
      },
      {
        id: "lean-start",
        label: "Open, but I would want to start lean",
        helper: "You may want a focused strategy step before management.",
        points: 2,
        signal: "A focused first step may fit better than jumping straight into management.",
      },
      {
        id: "later",
        label: "Maybe later",
        helper: "You are gathering information before making a support decision.",
        points: 1,
      },
      {
        id: "learning",
        label: "Just learning right now",
        helper: "You want clarity, but not a service conversation yet.",
        points: 0,
      },
    ],
  },
  {
    id: "ads",
    question: "How open are you to Pinterest ads if they fit the strategy?",
    options: [
      {
        id: "very-open",
        label: "Very open",
        helper: "Ads could support launches, testing, or faster learning when the funnel is ready.",
        points: 3,
        signal: "Paid distribution could become part of the plan when the foundation is ready.",
      },
      {
        id: "later",
        label: "Open later, after the foundation is stronger",
        helper: "Organic and page readiness should come first.",
        points: 2,
        signal: "Organic foundation may be the best first layer.",
      },
      {
        id: "unsure",
        label: "Unsure",
        helper: "You would need to understand the case before deciding.",
        points: 1,
      },
      {
        id: "organic-only",
        label: "Not open right now",
        helper: "You only want an organic Pinterest path at this stage.",
        points: 0,
      },
    ],
  },
];

export const PINTEREST_FIT_ASSESSMENT_MAX_SCORE = PINTEREST_FIT_ASSESSMENT_QUESTIONS.reduce(
  (total, question) => total + Math.max(...question.options.map((option) => option.points)),
  0,
);

const OUTCOMES: Record<PinterestFitAssessmentOutcome["id"], PinterestFitAssessmentOutcome> = {
  "strong-fit": {
    id: "strong-fit",
    label: "Strong Pinterest fit",
    headline: "Pinterest looks like a real growth path for this stage.",
    summary:
      "You likely have enough offer, content, and page readiness for Pinterest to support discovery, traffic, or list growth in a meaningful way.",
    nextStep: "A Pinterest Fit Call or The Fruitful Path can help clarify what to fix, build, or prioritize first.",
  },
  "possible-fit": {
    id: "possible-fit",
    label: "Promising Pinterest fit",
    headline: "Pinterest could work, but the path needs focus first.",
    summary:
      "There are useful signals here, but the strategy should start by tightening the offer, content library, or page experience before scaling activity.",
    nextStep: "A Pinterest Fit Call or The Fruitful Path can help clarify what to fix, build, or prioritize first.",
  },
  "later-fit": {
    id: "later-fit",
    label: "Probably later",
    headline: "Pinterest may be a later move, not the next move.",
    summary:
      "Pinterest can still become useful, but it may be better to strengthen the offer, content, visuals, or website before investing in a bigger channel plan.",
    nextStep: "A Pinterest Fit Call or The Fruitful Path can help clarify what to fix, build, or prioritize first.",
  },
};

const DEFAULT_SIGNALS: Record<PinterestFitAssessmentOutcome["id"], string[]> = {
  "strong-fit": [
    "There are enough useful pieces for Pinterest to work with.",
    "The next step is choosing the right role for Pinterest, not doing random pinning.",
  ],
  "possible-fit": [
    "There is potential, but the foundation needs a cleaner plan.",
    "The next step is deciding what Pinterest should do first.",
  ],
  "later-fit": [
    "The channel may need to wait until the offer, content, or page is stronger.",
    "The resource library is a better first stop than a full Pinterest buildout.",
  ],
};

export function scorePinterestFitAssessment(answers: PinterestFitAssessmentAnswers): PinterestFitAssessmentResult {
  const selectedOptions = PINTEREST_FIT_ASSESSMENT_QUESTIONS.flatMap((question) => {
    const selectedId = answers[question.id];
    const selectedOption = question.options.find((option) => option.id === selectedId);

    return selectedOption ? [selectedOption] : [];
  });

  const totalScore = selectedOptions.reduce((total, option) => total + option.points, 0);
  const outcomeId: PinterestFitAssessmentOutcome["id"] =
    totalScore >= 18 ? "strong-fit" : totalScore >= 10 ? "possible-fit" : "later-fit";
  const selectedSignals = selectedOptions.flatMap((option) => (option.signal ? [option.signal] : []));
  const signals = Array.from(new Set([...selectedSignals, ...DEFAULT_SIGNALS[outcomeId]])).slice(0, 4);

  return {
    totalScore,
    maxScore: PINTEREST_FIT_ASSESSMENT_MAX_SCORE,
    answeredCount: selectedOptions.length,
    outcome: OUTCOMES[outcomeId],
    signals,
  };
}
