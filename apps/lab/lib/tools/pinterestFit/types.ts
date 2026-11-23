export const QUESTION_IDS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"] as const;
export type QuestionId = (typeof QUESTION_IDS)[number];

export const SCOREABLE_FIELD_KEYS = [
    "q1_category_fit",
    "q2_offer_proven",
    "q3_assets",
    "q4_website",
    "q5_goal_fit",
    "q6_support_readiness",
    "q7_ads_openness",
] as const;
export type ScoreableAnswerField = (typeof SCOREABLE_FIELD_KEYS)[number];

export const STORED_FIELD_KEYS = [...SCOREABLE_FIELD_KEYS, "q5_goal_type"] as const;
export type StoredAnswerField = (typeof STORED_FIELD_KEYS)[number];

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

export type AssessmentAnswers = {
    [K in QuestionId]: QuestionValueMap[K];
};

export type PartialAssessmentAnswers = Partial<AssessmentAnswers>;

export type ScoreValue = 0 | 1 | 2 | 3 | 4;

export type ScoreableAssessmentAnswers = {
    q1_category_fit: ScoreValue;
    q2_offer_proven: ScoreValue;
    q3_assets: ScoreValue;
    q4_website: ScoreValue;
    q5_goal_fit: ScoreValue;
    q6_support_readiness: ScoreValue;
    q7_ads_openness: ScoreValue;
};

export type StoredAssessmentAnswers = ScoreableAssessmentAnswers & {
    q5_goal_type: GoalType;
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

export type CTAEventKey = "cta_fit_call_clicked";

export type OutcomeCopy = Readonly<{
    label: string;
    headline: string;
    intro: string;
}>;

export type IntroCopy = Readonly<{
    title: string;
    subtitle: string;
    supportLine: string;
    primaryButtonLabel: string;
    durationNote: string;
}>;

export type CTAConfig = Readonly<{
    label: "Book a Fit Call";
    url: string;
    subtext: string;
    caption?: string;
    trackingEvent: CTAEventKey;
}>;

export type OutcomeScoreBand = Readonly<{
    outcome: OutcomeKey;
    minScore: number;
    maxScore: number;
}>;

export type ResultReasonKeys = readonly [ReasonKey, ReasonKey, ReasonKey];
export type ResultReasons = readonly [string, string, string];

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
    cta: CTAConfig;
    debug?: AssessmentResultDebug;
}>;

export type QuestionScoreFieldMap = {
    q1: "q1_category_fit";
    q2: "q2_offer_proven";
    q3: "q3_assets";
    q4: "q4_website";
    q5: "q5_goal_fit";
    q6: "q6_support_readiness";
    q7: "q7_ads_openness";
};

export type QuestionSignalMap = {
    q1: "category";
    q2: "offer";
    q3: "assets";
    q4: "website";
    q5: "goal";
    q6: "support_readiness";
    q7: "ads_openness";
};

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
    signal: QuestionSignalMap[TId];
    storedScoreField: QuestionScoreFieldMap[TId];
    storedGoalTypeField?: "q5_goal_type";
    options: readonly AssessmentQuestionOption<QuestionValueMap[TId]>[];
}>;
