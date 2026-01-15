/**
 * Fruitful Lab — Pinterest Potential Calculator (v0.2 Locked)
 * Canonical spec: Questions (Q1–Q8), answer types, copy maps, option sets, and validation.
 *
 * v0.2 changes (breaking, no draft/back-compat):
 * - Flow is now 8 questions total (Q1–Q8), generalized beyond baby/family.
 * - Answers are stored as stable string slugs (not numeric weights).
 * - Q2 (niche), Q6 (offer prompt), and Q7 (goals) are segment-dependent.
 * - Lead gating is no longer a "question" in the spec; it's a flow capability.
 *
 * NOTE:
 * - Compute is config-driven and lives in compute.ts + benchmarks/multipliers configs.
 * - UI enrichment (badges, includes, keywords, icons, "popular" derivations) MUST live in the spec→UI adapter.
 * - This file defines only: schema + copy + option sets + validation.
 */

// -------------------------------------
// IDs / Core enums
// -------------------------------------

export const QUESTION_COUNT = 8 as const;

export type QuestionId = `Q${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;

export type Segment = "content_creator" | "product_seller" | "service_provider";

export type LeadMode = "hard_lock" | "soft_lock";
export type LeadState = "known" | "new";

// -------------------------------------
// Answer types (slug-based)
// -------------------------------------

export type VolumeBucket = "0-2" | "3-5" | "6-10" | "11-20" | "20+";
export type VisualStrength = "limited" | "decent" | "strong" | "very_strong";
export type SiteExperience = "a" | "b" | "c" | "d";
export type OfferClarity = "no" | "somewhat" | "yes";
export type GrowthMode = "organic" | "later" | "ads";

/**
 * Goals are segment-specific but stored in one union.
 * Keep these stable; telemetry and compute config will key on them.
 */
export type PrimaryGoal =
// Content creator goals
    | "traffic"
    | "email_subscribers"
    | "affiliate_revenue"
    | "course_product_sales"
    // Product seller goals
    | "sales"
    | "retargeting_pool"
    | "new_customer_discovery"
    // Service provider goals
    | "leads_calls"
    | "webinar_signups"
    | "authority_visibility";

export type Answers = {
    Q1?: Segment;
    Q2?: NicheSlug; // depends on segment; validated via getNicheOptions()
    Q3?: VolumeBucket;
    Q4?: VisualStrength;
    Q5?: SiteExperience;
    Q6?: OfferClarity;
    Q7?: PrimaryGoal; // depends on segment; validated via getPrimaryGoalOptions()
    Q8?: GrowthMode;
};

// -------------------------------------
// Lead payload (gating / submission)
// -------------------------------------

export type Lead = {
    email: string;
    name?: string; // optional in v0.2
};

export type ValidationResult = {
    ok: boolean;
    errors: Record<string, string>;
};

// -------------------------------------
// Question model (UI-facing)
// -------------------------------------

export type QuestionType = "single_select" | "dynamic_single_select";

export type Option<T extends string> = {
    id: T;
    label: string;
    /** Optional short helper label for UI (e.g., descriptors under segment cards). */
    metaLabel?: string;
};

export type BaseQuestion = {
    id: QuestionId;
    type: QuestionType;
    prompt: string;
    helperText?: string;
    required: true;
};

export type SingleSelectQuestion<T extends string> = BaseQuestion & {
    type: "single_select";
    options: Array<Option<T>>;
};

export type DynamicSingleSelectQuestion = BaseQuestion & {
    type: "dynamic_single_select";
    /**
     * Options depend on segment. UI should call getOptions(segment).
     * Validation will also use this.
     */
    getOptions: (segment: Segment) => Array<Option<string>>;
};

export type Question =
    | SingleSelectQuestion<Segment>
    | DynamicSingleSelectQuestion
    | SingleSelectQuestion<VolumeBucket>
    | SingleSelectQuestion<VisualStrength>
    | SingleSelectQuestion<SiteExperience>
    | DynamicSingleSelectQuestion
    | DynamicSingleSelectQuestion
    | SingleSelectQuestion<GrowthMode>;

// -------------------------------------
// Q2: Niche sets (segment-specific)
// (IMPORTANT: This is canonical. UI meta belongs in nicheUiAdapter.ts)
// -------------------------------------

export type ContentCreatorNiche =
    | "food"
    | "travel"
    | "home_diy"
    | "lifestyle"
    | "finance"
    | "wellness"
    | "parenting"
    | "beauty_fashion"
    | "crafts"
    | "other";

export type ProductSellerNiche =
    | "baby_family"
    | "home_decor"
    | "beauty"
    | "fashion"
    | "wellness"
    | "food_bev"
    | "digital_crafts"
    | "pets"
    | "travel_gear"
    | "other";

export type ServiceProviderNiche =
    | "agency"
    | "coach"
    | "designer"
    | "photo_video"
    | "wellness_practitioner"
    | "finance"
    | "real_estate_home"
    | "educator"
    | "events"
    | "other";

export type NicheSlug = ContentCreatorNiche | ProductSellerNiche | ServiceProviderNiche;

export const NICHE_OPTIONS: Record<Segment, Array<Option<NicheSlug>>> = {
    content_creator: [
        { id: "food", label: "Food & Recipes" },
        { id: "travel", label: "Travel" },
        { id: "home_diy", label: "Home & DIY" },
        { id: "lifestyle", label: "Lifestyle & Inspiration" },
        { id: "finance", label: "Personal Finance" },
        { id: "wellness", label: "Health & Wellness" },
        { id: "parenting", label: "Parenting & Family" },
        { id: "beauty_fashion", label: "Beauty & Fashion" },
        { id: "crafts", label: "Crafts & Hobbies" },
        { id: "other", label: "Other" },
    ],
    product_seller: [
        { id: "baby_family", label: "Baby & Family Products" },
        { id: "home_decor", label: "Home & Decor" },
        { id: "beauty", label: "Beauty & Skincare" },
        { id: "fashion", label: "Fashion & Accessories" },
        { id: "wellness", label: "Health & Wellness" },
        { id: "food_bev", label: "Food & Beverage (CPG)" },
        { id: "digital_crafts", label: "Crafts & Digital Products" },
        { id: "pets", label: "Pets" },
        { id: "travel_gear", label: "Travel Gear & Accessories" },
        { id: "other", label: "Other" },
    ],
    service_provider: [
        { id: "agency", label: "Marketing / Creative Agency" },
        { id: "coach", label: "Coach / Consultant" },
        { id: "designer", label: "Designer (interior/graphic/web)" },
        { id: "photo_video", label: "Photographer / Videographer" },
        { id: "wellness_practitioner", label: "Wellness Practitioner" },
        { id: "finance", label: "Finance / Accounting / Bookkeeping" },
        { id: "real_estate_home", label: "Real Estate / Home Services" },
        { id: "educator", label: "Educator / Course Creator" },
        { id: "events", label: "Event / Wedding Services" },
        { id: "other", label: "Other" },
    ],
} as const;

export function getNicheOptions(segment: Segment): Array<Option<NicheSlug>> {
    return NICHE_OPTIONS[segment];
}

// -------------------------------------
// Q7: Primary goal sets (segment-specific)
// -------------------------------------

export const PRIMARY_GOAL_OPTIONS: Record<Segment, Array<Option<PrimaryGoal>>> = {
    content_creator: [
        { id: "traffic", label: "Traffic" },
        { id: "email_subscribers", label: "Email subscribers" },
        { id: "affiliate_revenue", label: "Affiliate revenue" },
        { id: "course_product_sales", label: "Course/product sales" },
    ],
    product_seller: [
        { id: "sales", label: "Sales" },
        { id: "email_subscribers", label: "Email subscribers" },
        { id: "retargeting_pool", label: "Retargeting pool" },
        { id: "new_customer_discovery", label: "New customer discovery" },
    ],
    service_provider: [
        { id: "leads_calls", label: "Leads/calls" },
        { id: "email_subscribers", label: "Email subscribers" },
        { id: "webinar_signups", label: "Webinar signups" },
        { id: "authority_visibility", label: "Authority/visibility" },
    ],
} as const;

export function getPrimaryGoalOptions(segment: Segment): Array<Option<PrimaryGoal>> {
    return PRIMARY_GOAL_OPTIONS[segment];
}

// -------------------------------------
// Segment-dependent prompts (Q3/Q6) — copy helpers
// -------------------------------------

export function getQ3Prompt(segment: Segment): string {
    if (segment === "content_creator") return "How many pieces of content do you publish per month?";
    if (segment === "product_seller") return "How many promos/new arrivals/collections do you run per month?";
    return "How often do you publish marketing content per month?";
}

export function getQ6Prompt(segment: Segment): string {
    if (segment === "content_creator") return "Do you have a clear lead magnet or newsletter offer?";
    if (segment === "product_seller") return "Do you have a hero product / best-seller to push?";
    return "Do you have a clear offer + booking flow?";
}

export const Q2_PROMPT = "What’s your primary niche?" as const;
export const Q7_PROMPT = "What’s your primary goal from Pinterest?" as const;

// -------------------------------------
// Canonical questions (Q1–Q8)
// -------------------------------------

export const Q1: SingleSelectQuestion<Segment> = {
    id: "Q1",
    type: "single_select",
    prompt: "Which best describes your business?",
    required: true,
    options: [
        { id: "content_creator", label: "Primarily a Content Creator", metaLabel: "Traffic / Subscribers" },
        { id: "product_seller", label: "Primarily a Product Seller", metaLabel: "Sales" },
        { id: "service_provider", label: "Primarily a Service Provider", metaLabel: "Leads" },
    ],
};

export const Q2: DynamicSingleSelectQuestion = {
    id: "Q2",
    type: "dynamic_single_select",
    prompt: Q2_PROMPT,
    required: true,
    getOptions: (segment: Segment) => getNicheOptions(segment),
};

export const Q3: SingleSelectQuestion<VolumeBucket> = {
    id: "Q3",
    type: "single_select",
    prompt: "Monthly output volume", // UI should prefer getQ3Prompt(segment)
    required: true,
    options: [
        { id: "0-2", label: "0–2" },
        { id: "3-5", label: "3–5" },
        { id: "6-10", label: "6–10" },
        { id: "11-20", label: "11–20" },
        { id: "20+", label: "20+" },
    ],
};

export const Q4: SingleSelectQuestion<VisualStrength> = {
    id: "Q4",
    type: "single_select",
    prompt: "How strong is your visual content library right now?",
    required: true,
    options: [
        { id: "limited", label: "Limited" },
        { id: "decent", label: "Decent" },
        { id: "strong", label: "Strong" },
        { id: "very_strong", label: "Very strong" },
    ],
};

export const Q5: SingleSelectQuestion<SiteExperience> = {
    id: "Q5",
    type: "single_select",
    prompt: "Which best describes your website right now?",
    helperText: "On mobile, can someone tell what to do in 5 seconds?",
    required: true,
    options: [
        { id: "a", label: "It’s slow / confusing on mobile (unclear what to click)." },
        { id: "b", label: "It’s okay, but could be clearer (CTA exists, not super obvious)." },
        { id: "c", label: "It’s solid (loads fairly fast + clear CTA above the fold)." },
        { id: "d", label: "It’s optimized (fast, clear CTA, and I’ve tested/improved it)." },
    ],
};

export const Q6: DynamicSingleSelectQuestion = {
    id: "Q6",
    type: "dynamic_single_select",
    prompt: "Offer clarity", // UI should prefer getQ6Prompt(segment)
    required: true,
    getOptions: (_segment: Segment) => [
        { id: "no", label: "No" },
        { id: "somewhat", label: "Somewhat" },
        { id: "yes", label: "Yes" },
    ],
};

export const Q7: DynamicSingleSelectQuestion = {
    id: "Q7",
    type: "dynamic_single_select",
    prompt: Q7_PROMPT,
    required: true,
    getOptions: (segment: Segment) => getPrimaryGoalOptions(segment),
};

export const Q8: SingleSelectQuestion<GrowthMode> = {
    id: "Q8",
    type: "single_select",
    prompt: "Are you planning to use Pinterest ads, or organic only?",
    required: true,
    options: [
        { id: "organic", label: "Organic only" },
        { id: "later", label: "Maybe later" },
        { id: "ads", label: "Yes (ads)" },
    ],
};

export const QUESTIONS: Question[] = [Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8];

export const QUESTION_ORDER: QuestionId[] = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8"];

// -------------------------------------
// Validation helpers
// -------------------------------------

export function validateEmail(email: string): boolean {
    const re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return re.test(email);
}

export function isSegment(x: unknown): x is Segment {
    return x === "content_creator" || x === "product_seller" || x === "service_provider";
}

export function isVolumeBucket(x: unknown): x is VolumeBucket {
    return x === "0-2" || x === "3-5" || x === "6-10" || x === "11-20" || x === "20+";
}

export function isVisualStrength(x: unknown): x is VisualStrength {
    return x === "limited" || x === "decent" || x === "strong" || x === "very_strong";
}

export function isSiteExperience(x: unknown): x is SiteExperience {
    return x === "a" || x === "b" || x === "c" || x === "d";
}

export function isOfferClarity(x: unknown): x is OfferClarity {
    return x === "no" || x === "somewhat" || x === "yes";
}

export function isGrowthMode(x: unknown): x is GrowthMode {
    return x === "organic" || x === "later" || x === "ads";
}

export function isPrimaryGoalForSegment(segment: Segment, goal: unknown): goal is PrimaryGoal {
    return getPrimaryGoalOptions(segment).some((o) => o.id === goal);
}

export function isNicheForSegment(segment: Segment, niche: unknown): niche is NicheSlug {
    return getNicheOptions(segment).some((o) => o.id === niche);
}

/**
 * Full-form validation (v0.2).
 * Wizard may also validate per-step; this is the canonical "all required present" validator.
 */
export function validateAnswers(answers: Answers): ValidationResult {
    const errors: Record<string, string> = {};

    // Q1
    if (!answers.Q1) errors["Q1"] = "This question is required.";
    else if (!isSegment(answers.Q1)) errors["Q1"] = "Invalid selection.";

    const segment = answers.Q1;

    // Q2 depends on Q1
    if (!answers.Q2) errors["Q2"] = "This question is required.";
    else if (!segment) errors["Q2"] = "Select your business type first.";
    else if (!isNicheForSegment(segment, answers.Q2)) errors["Q2"] = "Invalid selection.";

    // Q3
    if (!answers.Q3) errors["Q3"] = "This question is required.";
    else if (!isVolumeBucket(answers.Q3)) errors["Q3"] = "Invalid selection.";

    // Q4
    if (!answers.Q4) errors["Q4"] = "This question is required.";
    else if (!isVisualStrength(answers.Q4)) errors["Q4"] = "Invalid selection.";

    // Q5
    if (!answers.Q5) errors["Q5"] = "This question is required.";
    else if (!isSiteExperience(answers.Q5)) errors["Q5"] = "Invalid selection.";

    // Q6
    if (!answers.Q6) errors["Q6"] = "This question is required.";
    else if (!isOfferClarity(answers.Q6)) errors["Q6"] = "Invalid selection.";

    // Q7 depends on Q1
    if (!answers.Q7) errors["Q7"] = "This question is required.";
    else if (!segment) errors["Q7"] = "Select your business type first.";
    else if (!isPrimaryGoalForSegment(segment, answers.Q7)) errors["Q7"] = "Invalid selection.";

    // Q8
    if (!answers.Q8) errors["Q8"] = "This question is required.";
    else if (!isGrowthMode(answers.Q8)) errors["Q8"] = "Invalid selection.";

    return { ok: Object.keys(errors).length === 0, errors };
}

/**
 * Lead validation for submission.
 * - Email is required if the user is submitting the lead form (hard lock or soft lock "email me results").
 * - Name is optional in v0.2.
 */
export function validateLead(lead: Lead): ValidationResult {
    const errors: Record<string, string> = {};
    if (!lead.email || !validateEmail(lead.email)) errors["LEAD.email"] = "A valid email is required.";
    // name optional; validate only if present but blank-ish
    if (lead.name !== undefined && !lead.name.trim()) errors["LEAD.name"] = "Name cannot be empty.";
    return { ok: Object.keys(errors).length === 0, errors };
}
