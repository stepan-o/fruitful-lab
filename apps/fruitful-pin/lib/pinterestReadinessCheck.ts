export const QUESTION_IDS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"] as const;
export type QuestionId = (typeof QUESTION_IDS)[number];

export const QUESTION_COUNT = 7 as const;
export const MAX_SCORE = 25 as const;
export const QUESTION_ORDER = QUESTION_IDS satisfies readonly QuestionId[];

export const PINTEREST_READINESS_CHECK_SLUG = "pinterest-readiness-check" as const;
export const PINTEREST_READINESS_CHECK_NAME = "Pinterest Readiness Check" as const;
export const PINTEREST_READINESS_CHECK_LEAD_SOURCE = "Pinterest Readiness Check" as const;

export type CategoryFitValue =
  | "home_decor"
  | "diy_home_improvement"
  | "beauty_skincare"
  | "food_beverage_cpg"
  | "baby_family_products"
  | "fashion_accessories"
  | "gifts_stationery_party"
  | "jewelry_handmade_goods"
  | "health_wellness_products"
  | "other";

export type OfferProvenValue = "very_proven" | "somewhat_proven" | "early" | "not_proven_yet";
export type AssetsValue = "strong" | "decent" | "limited" | "weak";
export type WebsiteReadinessValue = "ready" | "mostly_ready" | "somewhat_ready" | "not_ready";
export type GoalType = "discovery" | "traffic" | "launches" | "retargeting" | "sales";
export type GoalFitValue = GoalType;
export type SupportReadinessValue = "ready_now" | "open_start_lean" | "maybe_later" | "just_exploring";
export type AdsOpennessValue = "very_open" | "somewhat_open" | "unsure" | "not_open";

export type QuestionValueMap = {
  q1: CategoryFitValue;
  q2: OfferProvenValue;
  q3: AssetsValue;
  q4: WebsiteReadinessValue;
  q5: GoalFitValue;
  q6: SupportReadinessValue;
  q7: AdsOpennessValue;
};

export type AssessmentAnswerValue = QuestionValueMap[keyof QuestionValueMap];
export type AssessmentAnswers = { [K in QuestionId]: QuestionValueMap[K] };
export type PartialAssessmentAnswers = Partial<AssessmentAnswers>;
export type ScoreValue = 0 | 1 | 2 | 3 | 4;

export type StoredAssessmentAnswers = {
  q1_category_fit: ScoreValue;
  q2_offer_proven: ScoreValue;
  q3_assets: ScoreValue;
  q4_website: ScoreValue;
  q5_goal_fit: ScoreValue;
  q5_goal_type: GoalType;
  q6_support_readiness: ScoreValue;
  q7_ads_openness: ScoreValue;
};

export type OutcomeKey = "strong_fit" | "possible_fit" | "not_right_now";

export type RoleKey =
  | "discovery_traffic"
  | "organic_first_ads_later"
  | "sales_with_ads_support"
  | "warm_audience_support"
  | "selective_test_channel"
  | "foundation_first"
  | "not_priority_yet";

export type ReasonKey =
  | "reason_category_strong"
  | "reason_category_good"
  | "reason_category_maybe"
  | "reason_category_weak"
  | "reason_offer_proven"
  | "reason_offer_some_traction"
  | "reason_offer_early"
  | "reason_offer_unproven"
  | "reason_assets_strong"
  | "reason_assets_decent"
  | "reason_assets_limited"
  | "reason_assets_weak"
  | "reason_site_ready"
  | "reason_site_solid"
  | "reason_site_friction"
  | "reason_site_not_ready"
  | "reason_goal_discovery"
  | "reason_goal_traffic"
  | "reason_goal_launches"
  | "reason_goal_retargeting"
  | "reason_goal_sales_caution"
  | "reason_support_ready"
  | "reason_support_open"
  | "reason_support_cautious"
  | "reason_support_not_committed"
  | "reason_ads_open"
  | "reason_ads_later"
  | "reason_ads_unsure"
  | "reason_ads_not_open";

export type AssessmentSignalKey = "category" | "offer" | "assets" | "website" | "goal" | "support_readiness" | "ads_openness";
export type GuardrailKey = "guardrail_a" | "guardrail_b" | "guardrail_c";
export type ResultReasonKeys = readonly [ReasonKey, ReasonKey, ReasonKey];
export type ResultReasons = readonly [string, string, string];

export type AssessmentQuestionOption<TValue extends AssessmentAnswerValue = AssessmentAnswerValue> = Readonly<{
  value: TValue;
  label: string;
  score: ScoreValue;
  goalType?: GoalType;
}>;

export type AssessmentQuestion<TId extends QuestionId = QuestionId> = Readonly<{
  id: TId;
  step: number;
  prompt: string;
  signal: AssessmentSignalKey;
  options: readonly AssessmentQuestionOption<QuestionValueMap[TId]>[];
}>;

export type AssessmentResultDebug = Readonly<{
  normalizedAnswers: StoredAssessmentAnswers;
  triggeredGuardrails: readonly GuardrailKey[];
  signalScores: Readonly<Record<AssessmentSignalKey, number>>;
  signalReasonKeys: Readonly<Record<AssessmentSignalKey, ReasonKey>>;
  positiveSignals: readonly AssessmentSignalKey[];
  blockerSignals: readonly AssessmentSignalKey[];
  moderateSignals: readonly AssessmentSignalKey[];
  selectedReasonSignals: readonly AssessmentSignalKey[];
  matchedRole: RoleKey;
}>;

export type AssessmentResult = Readonly<{
  score: number;
  maxScore: number;
  baseOutcome: OutcomeKey;
  finalOutcome: OutcomeKey;
  label: string;
  headline: string;
  intro: string;
  reasonKeys: ResultReasonKeys;
  reasons: ResultReasons;
  roleKey: RoleKey;
  roleCopy: string;
  cta: {
    label: "Book a Fit Call";
    url: string;
    subtext: string;
    caption?: string;
  };
  debug?: AssessmentResultDebug;
}>;

type SignalEvaluation = Readonly<{
  signal: AssessmentSignalKey;
  score: number;
  reasonKey: ReasonKey;
  isPositive: boolean;
  isBlocker: boolean;
  isModerate: boolean;
}>;

type SignalEvaluationMap = Readonly<Record<AssessmentSignalKey, SignalEvaluation>>;

export const INTRO_COPY = {
  title: "Could Pinterest Be a Bigger Opportunity for Your Brand Than You Think?",
  subtitle:
    "In under 2 minutes, find out whether Pinterest is a real opportunity for your brand — or just a distraction.",
  supportLine: "Built for product-based brands",
  primaryButtonLabel: "Find Out If Your Brand Is Ready",
  durationNote: "Takes about 2 minutes",
} as const;

export const RESULT_COPY_BY_OUTCOME = {
  strong_fit: {
    label: "Strong Pinterest Fit",
    headline: "Pinterest Could Be a Real Growth Opportunity for Your Brand",
    intro: "Your answers suggest Pinterest could be a meaningful growth channel for your brand — not just a nice-to-have.",
  },
  possible_fit: {
    label: "Possible Pinterest Fit",
    headline: "Pinterest Could Work for Your Brand — With the Right Strategy",
    intro: "There’s real potential here, but whether Pinterest pays off for your brand depends on how you approach it.",
  },
  not_right_now: {
    label: "Not the Right Fit Right Now",
    headline: "Pinterest May Be Premature for Your Brand Right Now",
    intro: "Pinterest doesn’t look like the smartest next move for your brand right now — at least not with your current setup.",
  },
} as const satisfies Record<OutcomeKey, { label: string; headline: string; intro: string }>;

export const RESULT_EMAIL_GATE_COPY = {
  heading: "Want the full picture?",
  body: "Enter your email and we’ll show your full readout: your top 3 reasons, best Pinterest role, and recommended next step.",
  placeholder: "Your email address",
  buttonLabel: "Get My Full Readout",
  trustNote: "We’ll also send a copy of your result to your inbox. No spam, ever.",
  unlockedHeading: "Your full readout is ready",
  validationMessage: "Enter a valid email to get your full readout.",
  submitErrorMessage: "Something went wrong. Please try again in a moment.",
} as const;

const REASON_COPY_BY_KEY = {
  reason_category_strong:
    "Your niche has strong Pinterest potential — millions of people are actively looking for products and solutions like yours.",
  reason_category_good:
    "Your product category can work well on Pinterest, especially with the right positioning and creative strategy.",
  reason_category_maybe: "There may be room for your brand on Pinterest, but it will take sharper positioning to stand out.",
  reason_category_weak:
    "Your category is not the most obvious Pinterest fit, so the channel has more to prove in your case.",
  reason_offer_proven:
    "You already have a product or collection with real traction, which gives Pinterest something strong to amplify.",
  reason_offer_some_traction:
    "You’re not starting from zero — there’s already enough traction here to make Pinterest worth considering.",
  reason_offer_early: "Your product is still early, which makes Pinterest harder to evaluate as a channel right now.",
  reason_offer_unproven: "Your offer still needs stronger proof of demand before Pinterest becomes a smart next move.",
  reason_assets_strong:
    "You already have the kind of visual and supporting content that turns Pinterest traffic into potential customers.",
  reason_assets_decent:
    "You have enough content to start getting discovered in front of the right audience, even if there are still some gaps.",
  reason_assets_limited: "Your content library feels a bit thin right now, which means Pinterest may work more slowly.",
  reason_assets_weak:
    "Right now, your brand would need a much stronger content foundation before Pinterest makes sense to prioritize.",
  reason_site_ready: "Your website looks ready to turn Pinterest visitors into potential customers.",
  reason_site_solid: "Your site is in decent shape, which gives Pinterest a workable place to send traffic.",
  reason_site_friction: "Your website may still create friction if Pinterest starts driving traffic.",
  reason_site_not_ready: "Your website is not ready enough yet to make Pinterest traffic worth pursuing.",
  reason_goal_discovery:
    "Your goal lines up with one of Pinterest’s biggest strengths: getting your brand discovered by the right people.",
  reason_goal_traffic: "Pinterest can be a strong fit when the goal is driving qualified traffic to products or collections.",
  reason_goal_launches:
    "Pinterest can work well for launches and seasonal pushes when there’s a clear offer and enough creative support behind it.",
  reason_goal_retargeting:
    "Using Pinterest to build a warmer audience can make strategic sense, especially as part of a broader funnel.",
  reason_goal_sales_caution:
    "Pinterest can support sales, but it usually works best when the foundation is strong — and it can be especially powerful when paired with ads.",
  reason_support_ready:
    "You’re ready to take action if the opportunity is there, which makes Pinterest much more realistic to test now.",
  reason_support_open: "You’re open enough to explore this seriously, even if you’d want to start lean.",
  reason_support_cautious: "There’s interest here, but the hesitation could slow momentum if Pinterest does look promising.",
  reason_support_not_committed:
    "Right now, there doesn’t seem to be enough commitment behind seriously exploring Pinterest.",
  reason_ads_open: "You’re open to ads if they make sense, which gives Pinterest more room to become a meaningful channel.",
  reason_ads_later: "You’re open to ads later, which gives Pinterest a clearer path if the organic foundation looks promising.",
  reason_ads_unsure: "You’re still unsure about ads, so Pinterest may need to start as a slower organic test.",
  reason_ads_not_open: "If ads are fully off the table, Pinterest may need to play a narrower role for your brand.",
} as const satisfies Record<ReasonKey, string>;

const ROLE_COPY_BY_KEY = {
  discovery_traffic: "Pinterest looks most promising here as a discovery and traffic channel for your brand.",
  organic_first_ads_later:
    "Pinterest may make the most sense as an organic-first channel, with room to layer ads later if the foundation proves strong.",
  sales_with_ads_support:
    "Pinterest could support sales for your brand, especially if you pair a strong organic foundation with paid promotion.",
  warm_audience_support:
    "Pinterest could play a strong supporting role by helping your brand attract and warm up future buyers over time.",
  selective_test_channel:
    "Pinterest may be worth testing for your brand as a selective discovery channel, but it will likely need sharper positioning and stronger creative to prove out than a more natural-fit category.",
  foundation_first:
    "There may be real potential here, but one or more important prerequisites still need tightening before Pinterest should do heavy lifting.",
  not_priority_yet:
    "Pinterest does not look like the right priority right now. Your foundation likely needs more work before this channel becomes worth serious attention.",
} as const satisfies Record<RoleKey, string>;

const CTA_BY_OUTCOME = {
  strong_fit: {
    label: "Book a Fit Call",
    url: "/contact",
    caption: "Want to talk through what this could look like for your brand?",
    subtext: "Based on your answers, Pinterest looks like a channel your brand should be taking seriously.",
  },
  possible_fit: {
    label: "Book a Fit Call",
    url: "/contact",
    caption: "Want help figuring out whether Pinterest is worth pursuing for your brand?",
    subtext: "There may be real potential here, but whether Pinterest is worth pursuing depends on a few strategic factors.",
  },
  not_right_now: {
    label: "Book a Fit Call",
    url: "/contact",
    caption: "Still want to talk it through or get a second opinion?",
    subtext: "If you want a second opinion on whether Pinterest is worth exploring later, you can still reach out.",
  },
} as const satisfies Record<OutcomeKey, AssessmentResult["cta"]>;

const Q5_GOAL_TYPE_BY_VALUE = {
  discovery: "discovery",
  traffic: "traffic",
  launches: "launches",
  retargeting: "retargeting",
  sales: "sales",
} as const satisfies Record<GoalFitValue, GoalType>;

export const PINTEREST_READINESS_QUESTIONS = [
  {
    id: "q1",
    step: 1,
    prompt: "Which category best describes what you sell?",
    signal: "category",
    options: [
      { value: "home_decor", label: "Home & Decor", score: 4 },
      { value: "diy_home_improvement", label: "DIY / Home Improvement", score: 4 },
      { value: "beauty_skincare", label: "Beauty & Skincare", score: 4 },
      { value: "food_beverage_cpg", label: "Food & Beverage / CPG", score: 4 },
      { value: "baby_family_products", label: "Baby & Family Products", score: 4 },
      { value: "fashion_accessories", label: "Fashion & Accessories", score: 3 },
      { value: "gifts_stationery_party", label: "Gifts / Stationery / Party", score: 3 },
      { value: "jewelry_handmade_goods", label: "Jewelry / Handmade Goods", score: 3 },
      { value: "health_wellness_products", label: "Health / Wellness Products", score: 2 },
      { value: "other", label: "Other", score: 1 },
    ],
  },
  {
    id: "q2",
    step: 2,
    prompt: "How much traction does the product or collection you’d promote already have?",
    signal: "offer",
    options: [
      { value: "very_proven", label: "We already know it sells well", score: 4 },
      { value: "somewhat_proven", label: "We’ve seen some traction", score: 3 },
      { value: "early", label: "It’s launched, but still early", score: 1 },
      { value: "not_proven_yet", label: "It’s not really proven yet", score: 0 },
    ],
  },
  {
    id: "q3",
    step: 3,
    prompt: "How strong are your content assets right now — both visual and educational?",
    signal: "assets",
    options: [
      {
        value: "strong",
        label:
          "Strong — we have plenty of product/lifestyle visuals and helpful content like blogs, guides, tutorials, or emails",
        score: 4,
      },
      {
        value: "decent",
        label: "Decent — we have enough visuals and some supporting content, but there are gaps",
        score: 3,
      },
      {
        value: "limited",
        label: "Limited — we have a few usable visuals or some content, but not enough depth yet",
        score: 1,
      },
      { value: "weak", label: "Weak — we’d need to build most of this first", score: 0 },
    ],
  },
  {
    id: "q4",
    step: 4,
    prompt: "If Pinterest started sending people to your website, how ready would it feel?",
    signal: "website",
    options: [
      { value: "ready", label: "We’d feel good sending traffic there now", score: 4 },
      { value: "mostly_ready", label: "It’s decent, but could use tightening", score: 3 },
      { value: "somewhat_ready", label: "It works, but the experience has gaps", score: 1 },
      { value: "not_ready", label: "It’s not really ready for traffic yet", score: 0 },
    ],
  },
  {
    id: "q5",
    step: 5,
    prompt: "If Pinterest worked well for your brand, what would you want it to do first?",
    signal: "goal",
    options: [
      { value: "discovery", label: "Get my brand in front of new people", score: 3, goalType: Q5_GOAL_TYPE_BY_VALUE.discovery },
      { value: "traffic", label: "Drive traffic to my product or collection pages", score: 3, goalType: Q5_GOAL_TYPE_BY_VALUE.traffic },
      { value: "launches", label: "Support launches, seasonal pushes, or promotions", score: 3, goalType: Q5_GOAL_TYPE_BY_VALUE.launches },
      { value: "retargeting", label: "Build a warm audience we can retarget later", score: 3, goalType: Q5_GOAL_TYPE_BY_VALUE.retargeting },
      { value: "sales", label: "Help drive sales sooner rather than later", score: 2, goalType: Q5_GOAL_TYPE_BY_VALUE.sales },
    ],
  },
  {
    id: "q6",
    step: 6,
    prompt: "How ready would you be to bring in expert Pinterest support if the opportunity looked real?",
    signal: "support_readiness",
    options: [
      { value: "ready_now", label: "Ready now", score: 3 },
      { value: "open_start_lean", label: "Open, but we'd want to start lean", score: 2 },
      { value: "maybe_later", label: "Maybe later", score: 1 },
      { value: "just_exploring", label: "Just exploring", score: 0 },
    ],
  },
  {
    id: "q7",
    step: 7,
    prompt: "How willing would you be to use Pinterest ads as part of the right strategy?",
    signal: "ads_openness",
    options: [
      { value: "very_open", label: "Very open — we’d consider ads as part of the strategy", score: 3 },
      { value: "somewhat_open", label: "Somewhat open — maybe later, once the foundation is there", score: 2 },
      { value: "unsure", label: "Unsure — we’d need to understand the case first", score: 1 },
      { value: "not_open", label: "Not open — we only want organic", score: 0 },
    ],
  },
] as const satisfies readonly AssessmentQuestion[];

export const PINTEREST_READINESS_QUESTIONS_BY_ID = Object.fromEntries(
  PINTEREST_READINESS_QUESTIONS.map((question) => [question.id, question]),
) as unknown as { [K in QuestionId]: AssessmentQuestion<K> };

const OUTCOME_SCORE_BANDS = [
  { outcome: "strong_fit", minScore: 18, maxScore: 25 },
  { outcome: "possible_fit", minScore: 10, maxScore: 17 },
  { outcome: "not_right_now", minScore: 0, maxScore: 9 },
] as const satisfies readonly Readonly<{ outcome: OutcomeKey; minScore: number; maxScore: number }>[];

const POSITIVE_REASON_PRIORITY = [
  "category",
  "offer",
  "assets",
  "website",
  "support_readiness",
  "ads_openness",
  "goal",
] as const satisfies readonly AssessmentSignalKey[];

const BLOCKER_REASON_PRIORITY = [
  "website",
  "assets",
  "offer",
  "support_readiness",
  "ads_openness",
  "category",
  "goal",
] as const satisfies readonly AssessmentSignalKey[];

const NOT_RIGHT_NOW_FALLBACK_PRIORITY = [
  "goal",
  "support_readiness",
  "ads_openness",
  "category",
  "offer",
  "assets",
  "website",
] as const satisfies readonly AssessmentSignalKey[];

const ROLE_PRIORITY_ORDER = [
  "not_priority_yet",
  "sales_with_ads_support",
  "warm_audience_support",
  "discovery_traffic",
  "selective_test_channel",
  "organic_first_ads_later",
  "foundation_first",
] as const satisfies readonly RoleKey[];

function getSelectedOption<TValue extends AssessmentAnswerValue>(
  questionId: keyof typeof PINTEREST_READINESS_QUESTIONS_BY_ID,
  value: TValue,
): AssessmentQuestionOption<TValue> {
  const option = PINTEREST_READINESS_QUESTIONS_BY_ID[questionId].options.find((candidate) => candidate.value === value);

  if (!option) {
    throw new Error(`Unknown Pinterest Readiness Check answer value "${value}" for ${questionId}.`);
  }

  return option as AssessmentQuestionOption<TValue>;
}

export function normalizePinterestReadinessAnswers(answers: AssessmentAnswers): StoredAssessmentAnswers {
  const q1 = getSelectedOption<CategoryFitValue>("q1", answers.q1);
  const q2 = getSelectedOption<OfferProvenValue>("q2", answers.q2);
  const q3 = getSelectedOption<AssetsValue>("q3", answers.q3);
  const q4 = getSelectedOption<WebsiteReadinessValue>("q4", answers.q4);
  const q5 = getSelectedOption<GoalFitValue>("q5", answers.q5);
  const q6 = getSelectedOption<SupportReadinessValue>("q6", answers.q6);
  const q7 = getSelectedOption<AdsOpennessValue>("q7", answers.q7);

  if (!q5.goalType) {
    throw new Error(`Pinterest Readiness Check goal answer "${answers.q5}" is missing a goalType mapping.`);
  }

  return {
    q1_category_fit: q1.score,
    q2_offer_proven: q2.score,
    q3_assets: q3.score,
    q4_website: q4.score,
    q5_goal_fit: q5.score,
    q5_goal_type: q5.goalType,
    q6_support_readiness: q6.score,
    q7_ads_openness: q7.score,
  };
}

function calculateTotalScore(normalizedAnswers: StoredAssessmentAnswers): number {
  return (
    normalizedAnswers.q1_category_fit +
    normalizedAnswers.q2_offer_proven +
    normalizedAnswers.q3_assets +
    normalizedAnswers.q4_website +
    normalizedAnswers.q5_goal_fit +
    normalizedAnswers.q6_support_readiness +
    normalizedAnswers.q7_ads_openness
  );
}

function resolveBaseOutcome(score: number): OutcomeKey {
  const matchingBand = OUTCOME_SCORE_BANDS.find((band) => score >= band.minScore && score <= band.maxScore);

  if (!matchingBand) {
    throw new Error(`Pinterest Readiness Check score "${score}" fell outside configured outcome bands.`);
  }

  return matchingBand.outcome;
}

function applyGuardrails(normalizedAnswers: StoredAssessmentAnswers, baseOutcome: OutcomeKey) {
  const triggeredGuardrails: GuardrailKey[] = [];
  let finalOutcome = baseOutcome;

  if (normalizedAnswers.q5_goal_type === "sales" && normalizedAnswers.q6_support_readiness <= 1 && normalizedAnswers.q7_ads_openness <= 1) {
    triggeredGuardrails.push("guardrail_a");
    if (finalOutcome === "strong_fit") {
      finalOutcome = "possible_fit";
    }
  }

  if (normalizedAnswers.q3_assets === 0 && normalizedAnswers.q4_website === 0) {
    triggeredGuardrails.push("guardrail_b");
    finalOutcome = "not_right_now";
  }

  if (normalizedAnswers.q1_category_fit === 1 && normalizedAnswers.q2_offer_proven <= 1) {
    triggeredGuardrails.push("guardrail_c");
    finalOutcome = "not_right_now";
  }

  return { finalOutcome, triggeredGuardrails };
}

function getSignalScore(signal: AssessmentSignalKey, normalizedAnswers: StoredAssessmentAnswers): number {
  switch (signal) {
    case "category":
      return normalizedAnswers.q1_category_fit;
    case "offer":
      return normalizedAnswers.q2_offer_proven;
    case "assets":
      return normalizedAnswers.q3_assets;
    case "website":
      return normalizedAnswers.q4_website;
    case "goal":
      return normalizedAnswers.q5_goal_fit;
    case "support_readiness":
      return normalizedAnswers.q6_support_readiness;
    case "ads_openness":
      return normalizedAnswers.q7_ads_openness;
  }
}

function getGoalReasonKey(goalType: GoalType): ReasonKey {
  switch (goalType) {
    case "discovery":
      return "reason_goal_discovery";
    case "traffic":
      return "reason_goal_traffic";
    case "launches":
      return "reason_goal_launches";
    case "retargeting":
      return "reason_goal_retargeting";
    case "sales":
      return "reason_goal_sales_caution";
  }
}

function getSignalReasonKey(signal: AssessmentSignalKey, normalizedAnswers: StoredAssessmentAnswers): ReasonKey {
  switch (signal) {
    case "category":
      if (normalizedAnswers.q1_category_fit === 4) return "reason_category_strong";
      if (normalizedAnswers.q1_category_fit === 3) return "reason_category_good";
      if (normalizedAnswers.q1_category_fit === 2) return "reason_category_maybe";
      return "reason_category_weak";
    case "offer":
      if (normalizedAnswers.q2_offer_proven === 4) return "reason_offer_proven";
      if (normalizedAnswers.q2_offer_proven === 3) return "reason_offer_some_traction";
      if (normalizedAnswers.q2_offer_proven === 1) return "reason_offer_early";
      return "reason_offer_unproven";
    case "assets":
      if (normalizedAnswers.q3_assets === 4) return "reason_assets_strong";
      if (normalizedAnswers.q3_assets === 3) return "reason_assets_decent";
      if (normalizedAnswers.q3_assets === 1) return "reason_assets_limited";
      return "reason_assets_weak";
    case "website":
      if (normalizedAnswers.q4_website === 4) return "reason_site_ready";
      if (normalizedAnswers.q4_website === 3) return "reason_site_solid";
      if (normalizedAnswers.q4_website === 1) return "reason_site_friction";
      return "reason_site_not_ready";
    case "goal":
      return getGoalReasonKey(normalizedAnswers.q5_goal_type);
    case "support_readiness":
      if (normalizedAnswers.q6_support_readiness === 3) return "reason_support_ready";
      if (normalizedAnswers.q6_support_readiness === 2) return "reason_support_open";
      if (normalizedAnswers.q6_support_readiness === 1) return "reason_support_cautious";
      return "reason_support_not_committed";
    case "ads_openness":
      if (normalizedAnswers.q7_ads_openness === 3) return "reason_ads_open";
      if (normalizedAnswers.q7_ads_openness === 2) return "reason_ads_later";
      if (normalizedAnswers.q7_ads_openness === 1) return "reason_ads_unsure";
      return "reason_ads_not_open";
  }
}

function isPositiveSignal(signal: AssessmentSignalKey, normalizedAnswers: StoredAssessmentAnswers): boolean {
  switch (signal) {
    case "category":
      return normalizedAnswers.q1_category_fit >= 3;
    case "offer":
      return normalizedAnswers.q2_offer_proven >= 3;
    case "assets":
      return normalizedAnswers.q3_assets >= 3;
    case "website":
      return normalizedAnswers.q4_website >= 3;
    case "goal":
      return normalizedAnswers.q5_goal_type !== "sales";
    case "support_readiness":
      return normalizedAnswers.q6_support_readiness >= 2;
    case "ads_openness":
      return normalizedAnswers.q7_ads_openness >= 2;
  }
}

function isBlockerSignal(signal: AssessmentSignalKey, normalizedAnswers: StoredAssessmentAnswers): boolean {
  switch (signal) {
    case "category":
      return normalizedAnswers.q1_category_fit <= 2;
    case "offer":
      return normalizedAnswers.q2_offer_proven <= 1;
    case "assets":
      return normalizedAnswers.q3_assets <= 1;
    case "website":
      return normalizedAnswers.q4_website <= 1;
    case "goal":
      return normalizedAnswers.q5_goal_type === "sales";
    case "support_readiness":
      return normalizedAnswers.q6_support_readiness <= 1;
    case "ads_openness":
      return normalizedAnswers.q7_ads_openness <= 1;
  }
}

function buildSignalEvaluations(normalizedAnswers: StoredAssessmentAnswers): SignalEvaluationMap {
  return POSITIVE_REASON_PRIORITY.reduce<Record<AssessmentSignalKey, SignalEvaluation>>((accumulator, signal) => {
    const isPositive = isPositiveSignal(signal, normalizedAnswers);
    const isBlocker = isBlockerSignal(signal, normalizedAnswers);

    accumulator[signal] = {
      signal,
      score: getSignalScore(signal, normalizedAnswers),
      reasonKey: getSignalReasonKey(signal, normalizedAnswers),
      isPositive,
      isBlocker,
      isModerate: !isPositive && !isBlocker,
    };

    return accumulator;
  }, {} as Record<AssessmentSignalKey, SignalEvaluation>);
}

function selectHighestScoringSignal(evaluations: SignalEvaluationMap, priorityOrder: readonly AssessmentSignalKey[]) {
  return priorityOrder.reduce<AssessmentSignalKey>((bestSignal, signal) => {
    if (evaluations[signal].score > evaluations[bestSignal].score) {
      return signal;
    }

    return bestSignal;
  }, priorityOrder[0]);
}

function selectStrongFitReasonSignals(evaluations: SignalEvaluationMap) {
  const foundationSignals = ["offer", "assets", "website"] as const satisfies readonly AssessmentSignalKey[];
  const readinessIntentSignals = ["support_readiness", "ads_openness", "goal"] as const satisfies readonly AssessmentSignalKey[];

  return [
    "category",
    selectHighestScoringSignal(evaluations, foundationSignals),
    selectHighestScoringSignal(evaluations, readinessIntentSignals),
  ] as const;
}

function selectPossibleFitReasonSignals(evaluations: SignalEvaluationMap) {
  const selectedSignals: AssessmentSignalKey[] = [];
  const positiveSignals = POSITIVE_REASON_PRIORITY.filter((signal) => evaluations[signal].isPositive);
  const moderateSignals = POSITIVE_REASON_PRIORITY.filter((signal) => evaluations[signal].isModerate);

  for (const signal of positiveSignals) {
    if (selectedSignals.length === 2) break;
    selectedSignals.push(signal);
  }

  for (const signal of moderateSignals) {
    if (selectedSignals.length === 2) break;
    if (!selectedSignals.includes(signal)) selectedSignals.push(signal);
  }

  for (const signal of POSITIVE_REASON_PRIORITY) {
    if (selectedSignals.length === 2) break;
    if (!selectedSignals.includes(signal)) selectedSignals.push(signal);
  }

  const blockerSignal = BLOCKER_REASON_PRIORITY.find((signal) => evaluations[signal].isBlocker && !selectedSignals.includes(signal));

  if (blockerSignal) {
    selectedSignals.push(blockerSignal);
  } else {
    const fallbackSignal = BLOCKER_REASON_PRIORITY.find((signal) => !selectedSignals.includes(signal));
    if (!fallbackSignal) throw new Error("Pinterest Readiness Check reason selection could not resolve a third reason.");
    selectedSignals.push(fallbackSignal);
  }

  return selectedSignals as readonly AssessmentSignalKey[];
}

function selectNotRightNowReasonSignals(evaluations: SignalEvaluationMap) {
  const selectedSignals = BLOCKER_REASON_PRIORITY.filter((signal) => evaluations[signal].isBlocker).slice(0, 3);

  if (selectedSignals.length < 3) {
    const fallbackIndexBySignal = NOT_RIGHT_NOW_FALLBACK_PRIORITY.reduce<Record<AssessmentSignalKey, number>>(
      (accumulator, signal, index) => {
        accumulator[signal] = index;
        return accumulator;
      },
      {} as Record<AssessmentSignalKey, number>,
    );

    const remainingSignals = POSITIVE_REASON_PRIORITY.filter((signal) => !selectedSignals.includes(signal)).sort((left, right) => {
      const scoreDifference = evaluations[left].score - evaluations[right].score;
      if (scoreDifference !== 0) return scoreDifference;
      return fallbackIndexBySignal[left] - fallbackIndexBySignal[right];
    });

    for (const signal of remainingSignals) {
      if (selectedSignals.length === 3) break;
      selectedSignals.push(signal);
    }
  }

  if (selectedSignals.length !== 3) {
    throw new Error("Pinterest Readiness Check not-right-now reason selection did not resolve exactly three reasons.");
  }

  return selectedSignals as readonly AssessmentSignalKey[];
}

function selectReasonSignals(finalOutcome: OutcomeKey, evaluations: SignalEvaluationMap) {
  if (finalOutcome === "strong_fit") return selectStrongFitReasonSignals(evaluations);
  if (finalOutcome === "possible_fit") return selectPossibleFitReasonSignals(evaluations);
  return selectNotRightNowReasonSignals(evaluations);
}

function mapReasonKeys(selectedSignals: readonly AssessmentSignalKey[], evaluations: SignalEvaluationMap): ResultReasonKeys {
  if (selectedSignals.length !== 3) {
    throw new Error("Pinterest Readiness Check reason selection must resolve exactly three signals.");
  }

  return [
    evaluations[selectedSignals[0]].reasonKey,
    evaluations[selectedSignals[1]].reasonKey,
    evaluations[selectedSignals[2]].reasonKey,
  ];
}

function mapReasonCopy(reasonKeys: ResultReasonKeys): ResultReasons {
  return [
    REASON_COPY_BY_KEY[reasonKeys[0]],
    REASON_COPY_BY_KEY[reasonKeys[1]],
    REASON_COPY_BY_KEY[reasonKeys[2]],
  ];
}

function matchesRole(role: RoleKey, normalizedAnswers: StoredAssessmentAnswers, finalOutcome: OutcomeKey): boolean {
  switch (role) {
    case "not_priority_yet":
      return finalOutcome === "not_right_now";
    case "sales_with_ads_support":
      return (
        normalizedAnswers.q5_goal_type === "sales" &&
        normalizedAnswers.q2_offer_proven >= 3 &&
        normalizedAnswers.q4_website >= 3 &&
        normalizedAnswers.q7_ads_openness >= 2
      );
    case "warm_audience_support":
      return normalizedAnswers.q5_goal_type === "retargeting" && finalOutcome !== "not_right_now";
    case "discovery_traffic":
      return (
        normalizedAnswers.q1_category_fit >= 3 &&
        normalizedAnswers.q3_assets >= 3 &&
        normalizedAnswers.q4_website >= 3 &&
        (normalizedAnswers.q5_goal_type === "discovery" || normalizedAnswers.q5_goal_type === "traffic")
      );
    case "selective_test_channel":
      return (
        normalizedAnswers.q1_category_fit <= 2 &&
        normalizedAnswers.q2_offer_proven >= 3 &&
        normalizedAnswers.q3_assets >= 3 &&
        normalizedAnswers.q4_website >= 3 &&
        (normalizedAnswers.q5_goal_type === "discovery" ||
          normalizedAnswers.q5_goal_type === "traffic" ||
          normalizedAnswers.q5_goal_type === "launches") &&
        finalOutcome !== "not_right_now"
      );
    case "organic_first_ads_later":
      return (
        normalizedAnswers.q1_category_fit >= 3 &&
        normalizedAnswers.q3_assets >= 1 &&
        normalizedAnswers.q4_website >= 1 &&
        (normalizedAnswers.q5_goal_type === "discovery" ||
          normalizedAnswers.q5_goal_type === "traffic" ||
          normalizedAnswers.q5_goal_type === "launches")
      );
    case "foundation_first":
      return finalOutcome !== "not_right_now";
  }
}

function resolveRole(normalizedAnswers: StoredAssessmentAnswers, finalOutcome: OutcomeKey): RoleKey {
  const matchedRole = ROLE_PRIORITY_ORDER.find((role) => matchesRole(role, normalizedAnswers, finalOutcome));

  if (!matchedRole) {
    throw new Error("Pinterest Readiness Check role resolution failed to match a role.");
  }

  return matchedRole;
}

export function scorePinterestReadinessCheck(answers: AssessmentAnswers): AssessmentResult {
  const normalizedAnswers = normalizePinterestReadinessAnswers(answers);
  const score = calculateTotalScore(normalizedAnswers);
  const baseOutcome = resolveBaseOutcome(score);
  const { finalOutcome, triggeredGuardrails } = applyGuardrails(normalizedAnswers, baseOutcome);
  const evaluations = buildSignalEvaluations(normalizedAnswers);
  const selectedReasonSignals = selectReasonSignals(finalOutcome, evaluations);
  const reasonKeys = mapReasonKeys(selectedReasonSignals, evaluations);
  const reasons = mapReasonCopy(reasonKeys);
  const roleKey = resolveRole(normalizedAnswers, finalOutcome);
  const outcomeCopy = RESULT_COPY_BY_OUTCOME[finalOutcome];

  return {
    score,
    maxScore: MAX_SCORE,
    baseOutcome,
    finalOutcome,
    label: outcomeCopy.label,
    headline: outcomeCopy.headline,
    intro: outcomeCopy.intro,
    reasonKeys,
    reasons,
    roleKey,
    roleCopy: ROLE_COPY_BY_KEY[roleKey],
    cta: CTA_BY_OUTCOME[finalOutcome],
    debug: {
      normalizedAnswers,
      triggeredGuardrails,
      signalScores: POSITIVE_REASON_PRIORITY.reduce<Record<AssessmentSignalKey, number>>((accumulator, signal) => {
        accumulator[signal] = evaluations[signal].score;
        return accumulator;
      }, {} as Record<AssessmentSignalKey, number>),
      signalReasonKeys: POSITIVE_REASON_PRIORITY.reduce<Record<AssessmentSignalKey, ReasonKey>>((accumulator, signal) => {
        accumulator[signal] = evaluations[signal].reasonKey;
        return accumulator;
      }, {} as Record<AssessmentSignalKey, ReasonKey>),
      positiveSignals: POSITIVE_REASON_PRIORITY.filter((signal) => evaluations[signal].isPositive),
      blockerSignals: BLOCKER_REASON_PRIORITY.filter((signal) => evaluations[signal].isBlocker),
      moderateSignals: POSITIVE_REASON_PRIORITY.filter((signal) => evaluations[signal].isModerate),
      selectedReasonSignals,
      matchedRole: roleKey,
    },
  };
}

export type PinterestReadinessBreakdownCard =
  | Readonly<{ id: "reasons"; title: "Top 3 reasons"; kind: "list"; items: readonly string[] }>
  | Readonly<{ id: "role"; title: "Best role for Pinterest"; kind: "text"; body: string }>
  | Readonly<{ id: "next_step"; title: "Recommended next step"; kind: "callout"; heading: string; body: string }>;

export function createPinterestReadinessViewModel(result: AssessmentResult) {
  return {
    label: result.label,
    headline: result.headline,
    intro: result.intro,
    breakdownTitle: "Your Personalized Readout",
    breakdownUnlockLabel: "Full readout by email",
    breakdownCards: [
      {
        id: "reasons",
        title: "Top 3 reasons",
        kind: "list",
        items: result.reasons,
      },
      {
        id: "role",
        title: "Best role for Pinterest",
        kind: "text",
        body: result.roleCopy,
      },
      {
        id: "next_step",
        title: "Recommended next step",
        kind: "callout",
        heading: result.cta.caption ?? result.cta.label,
        body: result.cta.subtext,
      },
    ] satisfies readonly PinterestReadinessBreakdownCard[],
    ctaLabel: result.cta.label,
    ctaUrl: result.cta.url,
    restartLabel: "Restart",
  };
}

export function createPinterestReadinessRunId() {
  const cryptoObject = globalThis.crypto as { randomUUID?: () => string } | undefined;

  if (cryptoObject?.randomUUID) {
    return cryptoObject.randomUUID();
  }

  return `prc_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}
