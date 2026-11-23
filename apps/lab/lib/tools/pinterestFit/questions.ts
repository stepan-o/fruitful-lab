import type {
    AdsOpennessValue,
    AssessmentQuestion,
    AssessmentQuestionOption,
    AssetsValue,
    CategoryFitValue,
    GoalFitValue,
    GoalType,
    OfferProvenValue,
    QuestionId,
    SupportReadinessValue,
    WebsiteReadinessValue,
} from "./types";

export const Q5_GOAL_TYPE_BY_VALUE = {
    discovery: "discovery",
    traffic: "traffic",
    launches: "launches",
    retargeting: "retargeting",
    sales: "sales",
} as const satisfies Record<GoalFitValue, GoalType>;

export const CATEGORY_FIT_OPTIONS = [
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
] as const satisfies readonly AssessmentQuestionOption<CategoryFitValue>[];

export const PRODUCT_PROOF_OPTIONS = [
    { value: "very_proven", label: "We already know it sells well", score: 4 },
    { value: "somewhat_proven", label: "We’ve seen some traction", score: 3 },
    { value: "early", label: "It’s launched, but still early", score: 1 },
    { value: "not_proven_yet", label: "It’s not really proven yet", score: 0 },
] as const satisfies readonly AssessmentQuestionOption<OfferProvenValue>[];

export const CONTENT_ASSET_OPTIONS = [
    {
        value: "strong",
        label: "Strong — we have plenty of product/lifestyle visuals and helpful content like blogs, guides, tutorials, or emails",
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
] as const satisfies readonly AssessmentQuestionOption<AssetsValue>[];

export const WEBSITE_READINESS_OPTIONS = [
    { value: "ready", label: "We’d feel good sending traffic there now", score: 4 },
    { value: "mostly_ready", label: "It’s decent, but could use tightening", score: 3 },
    { value: "somewhat_ready", label: "It works, but the experience has gaps", score: 1 },
    { value: "not_ready", label: "It’s not really ready for traffic yet", score: 0 },
] as const satisfies readonly AssessmentQuestionOption<WebsiteReadinessValue>[];

export const GOAL_OPTIONS = [
    {
        value: "discovery",
        label: "Get my brand in front of new people",
        score: 3,
        goalType: Q5_GOAL_TYPE_BY_VALUE.discovery,
    },
    {
        value: "traffic",
        label: "Drive traffic to my product or collection pages",
        score: 3,
        goalType: Q5_GOAL_TYPE_BY_VALUE.traffic,
    },
    {
        value: "launches",
        label: "Support launches, seasonal pushes, or promotions",
        score: 3,
        goalType: Q5_GOAL_TYPE_BY_VALUE.launches,
    },
    {
        value: "retargeting",
        label: "Build a warm audience we can retarget later",
        score: 3,
        goalType: Q5_GOAL_TYPE_BY_VALUE.retargeting,
    },
    {
        value: "sales",
        label: "Help drive sales sooner rather than later",
        score: 2,
        goalType: Q5_GOAL_TYPE_BY_VALUE.sales,
    },
] as const satisfies readonly AssessmentQuestionOption<GoalFitValue>[];

export const SUPPORT_READINESS_OPTIONS = [
    { value: "ready_now", label: "Ready now", score: 3 },
    { value: "open_start_lean", label: "Open, but we'd want to start lean", score: 2 },
    { value: "maybe_later", label: "Maybe later", score: 1 },
    { value: "just_exploring", label: "Just exploring", score: 0 },
] as const satisfies readonly AssessmentQuestionOption<SupportReadinessValue>[];

export const ADS_OPENNESS_OPTIONS = [
    { value: "very_open", label: "Very open — we’d consider ads as part of the strategy", score: 3 },
    { value: "somewhat_open", label: "Somewhat open — maybe later, once the foundation is there", score: 2 },
    { value: "unsure", label: "Unsure — we’d need to understand the case first", score: 1 },
    { value: "not_open", label: "Not open — we only want organic", score: 0 },
] as const satisfies readonly AssessmentQuestionOption<AdsOpennessValue>[];

export const CATEGORY_FIT_QUESTION = {
    id: "q1",
    step: 1,
    prompt: "Which category best describes what you sell?",
    signal: "category",
    storedScoreField: "q1_category_fit",
    options: CATEGORY_FIT_OPTIONS,
} as const satisfies AssessmentQuestion<"q1">;

export const PRODUCT_PROOF_QUESTION = {
    id: "q2",
    step: 2,
    prompt: "How much traction does the product or collection you’d promote already have?",
    signal: "offer",
    storedScoreField: "q2_offer_proven",
    options: PRODUCT_PROOF_OPTIONS,
} as const satisfies AssessmentQuestion<"q2">;

export const CONTENT_ASSET_QUESTION = {
    id: "q3",
    step: 3,
    prompt: "How strong are your content assets right now — both visual and educational?",
    signal: "assets",
    storedScoreField: "q3_assets",
    options: CONTENT_ASSET_OPTIONS,
} as const satisfies AssessmentQuestion<"q3">;

export const WEBSITE_READINESS_QUESTION = {
    id: "q4",
    step: 4,
    prompt: "If Pinterest started sending people to your website, how ready would it feel?",
    signal: "website",
    storedScoreField: "q4_website",
    options: WEBSITE_READINESS_OPTIONS,
} as const satisfies AssessmentQuestion<"q4">;

export const GOAL_QUESTION = {
    id: "q5",
    step: 5,
    prompt: "If Pinterest worked well for your brand, what would you want it to do first?",
    signal: "goal",
    storedScoreField: "q5_goal_fit",
    storedGoalTypeField: "q5_goal_type",
    options: GOAL_OPTIONS,
} as const satisfies AssessmentQuestion<"q5">;

export const SUPPORT_READINESS_QUESTION = {
    id: "q6",
    step: 6,
    prompt: "How ready would you be to bring in expert Pinterest support if the opportunity looked real?",
    signal: "support_readiness",
    storedScoreField: "q6_support_readiness",
    options: SUPPORT_READINESS_OPTIONS,
} as const satisfies AssessmentQuestion<"q6">;

export const ADS_OPENNESS_QUESTION = {
    id: "q7",
    step: 7,
    prompt: "How willing would you be to use Pinterest ads as part of the right strategy?",
    signal: "ads_openness",
    storedScoreField: "q7_ads_openness",
    options: ADS_OPENNESS_OPTIONS,
} as const satisfies AssessmentQuestion<"q7">;

export const PINTEREST_FIT_QUESTIONS_BY_ID = {
    q1: CATEGORY_FIT_QUESTION,
    q2: PRODUCT_PROOF_QUESTION,
    q3: CONTENT_ASSET_QUESTION,
    q4: WEBSITE_READINESS_QUESTION,
    q5: GOAL_QUESTION,
    q6: SUPPORT_READINESS_QUESTION,
    q7: ADS_OPENNESS_QUESTION,
} as const satisfies { [K in QuestionId]: AssessmentQuestion<K> };

export const PINTEREST_FIT_QUESTIONS = [
    CATEGORY_FIT_QUESTION,
    PRODUCT_PROOF_QUESTION,
    CONTENT_ASSET_QUESTION,
    WEBSITE_READINESS_QUESTION,
    GOAL_QUESTION,
    SUPPORT_READINESS_QUESTION,
    ADS_OPENNESS_QUESTION,
] as const satisfies readonly AssessmentQuestion[];
