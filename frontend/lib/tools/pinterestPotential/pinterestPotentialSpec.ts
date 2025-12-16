/**
 * Fruitful Lab — Pinterest Potential Calculator
 * Canonical spec + light helper maps for results (Sprint 5 ready)
 *
 * Key update:
 * - Options now have a stable `id` (1..N) in addition to `value`.
 * - For checkboxes, Answers should store option ids (not values).
 *   This makes “income” and “cart size” deterministic and maintainable.
 *
 * NOTE: We do not preserve backwards compatibility with old drafts.
 */

// -----------------------------
// Types
// -----------------------------

export type QuestionType = "radio" | "checkbox" | "slider" | "lead";

export type Option = {
    /** Stable option id for UI + downstream result mapping (1..N). */
    id: number;
    label: string;

    /**
     * Numeric weight used by the audience score formula (computeScore).
     * For radios/sliders it’s a scalar multiplier; for checkbox questions it’s included in sum().
     */
    value: number;
};

export type BaseQuestion = {
    id: `Q${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`;
    type: QuestionType;
    label: string;
    helperText?: string;
    required: boolean;
};

export type RadioQuestion = BaseQuestion & {
    type: "radio";
    options: Option[];
};

export type CheckboxQuestion = BaseQuestion & {
    type: "checkbox";
    options: Option[];
};

export type SliderQuestion = BaseQuestion & {
    type: "slider";
    min: number;
    max: number;
    step: number;
    default?: number;
};

export type LeadQuestion = {
    id: "LEAD";
    type: "lead";
    label: string;
    required: true;
};

export type Question = RadioQuestion | CheckboxQuestion | SliderQuestion | LeadQuestion;

// -----------------------------
// Answers model (updated)
// -----------------------------

/**
 * IMPORTANT:
 * - Q2/Q3/Q9 store SELECTED OPTION IDS (number[]), not option values.
 * - Compute layer should look up values from the spec when doing sums.
 */
export type Answers = {
    Q1?: number;     // radio → scalar value
    Q2?: number[];   // checkbox → selected option ids
    Q3?: number[];   // checkbox → selected option ids
    Q4?: number;     // radio
    Q5?: number;     // radio
    Q6?: number;     // radio
    Q7?: number;     // slider (1..5)
    Q8?: number;     // slider (1..5)
    Q9?: number[];   // checkbox → selected option ids
};

export type Lead = {
    name: string;
    email: string;
};

export type ValidationResult = {
    ok: boolean;
    errors: Record<string, string>;
};

// -----------------------------
// Validation helpers
// -----------------------------

export function clampToSliderRange(v: number, min = 1, max = 5): number {
    return Math.min(max, Math.max(min, Math.round(v)));
}

export function validateEmail(email: string): boolean {
    const re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return re.test(email);
}

/**
 * Validation rules:
 * - Required questions cannot be skipped
 * - Checkbox questions must have ≥1 selection
 * - Sliders must be within [min,max]
 * - Lead: name + syntactically valid email (when lead is required by the flow)
 *
 * NOTE: Lead gating is controlled by leadMode in the wizard;
 * validateAnswers treats LEAD as required if lead is passed as "required".
 */
export function validateAnswers(answers: Answers, lead?: Lead): ValidationResult {
    const errors: Record<string, string> = {};

    for (const q of QUESTIONS) {
        if (q.type === "lead") continue;

        const id = q.id;
        if (q.type === "radio") {
            const v = answers[id as keyof Answers] as number | undefined;
            if (q.required && (v === undefined || v === null)) {
                errors[id] = "This question is required.";
            }
        } else if (q.type === "checkbox") {
            const arr = answers[id as keyof Answers] as number[] | undefined;
            if (q.required && (!Array.isArray(arr) || arr.length === 0)) {
                errors[id] = "Please select at least one option.";
            }
        } else if (q.type === "slider") {
            const v = answers[id as keyof Answers] as number | undefined;
            if (q.required && (v === undefined || v === null)) {
                errors[id] = "This question is required.";
            } else if (v !== undefined && (v < q.min || v > q.max)) {
                errors[id] = `Value must be between ${q.min} and ${q.max}.`;
            }
        }
    }

    if (!lead) {
        // Leave as-is: caller decides if lead is required (gate_before_results) or optional.
        // If lead is required, caller should pass lead and validateEmail/name will run below.
    } else {
        if (!lead.name || !lead.name.trim()) errors["LEAD.name"] = "Name is required.";
        if (!lead.email || !validateEmail(lead.email)) errors["LEAD.email"] = "A valid email is required.";
    }

    return { ok: Object.keys(errors).length === 0, errors };
}

// -----------------------------
// Canonical questions (Q1–Q9 + Lead)
// -----------------------------

export const Q1: RadioQuestion = {
    id: "Q1",
    type: "radio",
    label: "Do you have a Pinterest Business account ?",
    required: true,
    options: [
        { id: 1, label: "Yes", value: 1 },
        { id: 2, label: "No", value: 0.7 },
    ],
};

export const Q2: CheckboxQuestion = {
    id: "Q2",
    type: "checkbox",
    label: "Select your target market/region (all that apply)",
    required: true,
    options: [
        { id: 1, label: "Global", value: 141000000 },
        { id: 2, label: "USA", value: 27000000 },
        { id: 3, label: "Canada", value: 1600000 },
        { id: 4, label: "Europe", value: 31000000 },
        { id: 5, label: "Latin America", value: 19000000 },
        { id: 6, label: "Asia-Pacific", value: 3900000 },
        { id: 7, label: "Rest of the world", value: 7000000 },
    ],
};

export const Q3: CheckboxQuestion = {
    id: "Q3",
    type: "checkbox",
    label: "What types of products do you offer? (Select all that apply)",
    required: true,
    options: [
        { id: 1, label: "Travel & Mobility", value: 0.18 },
        { id: 2, label: "Nursery & Home", value: 0.2 },
        { id: 3, label: "Clothing & Accessories", value: 0.17 },
        { id: 4, label: "Toys, Play, & Learning & school supplies", value: 0.15 },
        { id: 5, label: "Feeding & Care", value: 0.1 },
        { id: 6, label: "Bath & Changing", value: 0.07 },
        { id: 7, label: "Lifestyle, Special Occasions, product safety", value: 0.08 },
        { id: 8, label: "Technology & Digital Products", value: 0.08 },
    ],
};

export const Q4: RadioQuestion = {
    id: "Q4",
    type: "radio",
    label: "Could you allocate an ad spend budget for Pinterest?",
    required: true,
    options: [
        { id: 1, label: "Yes", value: 0.35 },
        { id: 2, label: "No", value: 0.1 },
        { id: 3, label: "No, but could consider it", value: 0.2 },
    ],
};

export const Q5: RadioQuestion = {
    id: "Q5",
    type: "radio",
    label: "Do you have a blog?",
    required: true,
    options: [
        { id: 1, label: "Yes, my brand has a blog", value: 1.15 },
        { id: 2, label: "Not a blog, but we create user guides etc.", value: 1.05 },
        { id: 3, label: "No, but can create", value: 1 },
        { id: 4, label: "No and not planning to", value: 0.8 },
    ],
};

export const Q6: RadioQuestion = {
    id: "Q6",
    type: "radio",
    label: "Could your product be positioned for gifting occasions?",
    required: true,
    options: [
        { id: 1, label: "Yes", value: 1.3 },
        { id: 2, label: "No", value: 0.9 },
        { id: 3, label: "Not sure", value: 1 },
    ],
};

export const Q7: SliderQuestion = {
    id: "Q7",
    type: "slider",
    label: "How seasonal is your product or brand? (1 = not seasonal, 5 = very seasonal)",
    required: true,
    min: 1,
    max: 5,
    step: 1,
    default: 1,
};

export const Q8: SliderQuestion = {
    id: "Q8",
    type: "slider",
    label: "On a scale of 1 (low competition) to 5 (high competition), how competitive is your product category?",
    required: true,
    min: 1,
    max: 5,
    step: 1,
    default: 1,
};

export const Q9: CheckboxQuestion = {
    id: "Q9",
    type: "checkbox",
    label: "Which platform is most important for your marketing?",
    required: true,
    options: [
        { id: 1, label: "Instagram", value: 0 },
        { id: 2, label: "Facebook", value: 0 },
        { id: 3, label: "Tiktok", value: 0 },
        { id: 4, label: "Youtube", value: 4 },
        { id: 5, label: "Google/SEO", value: 5 },
        { id: 6, label: "Email", value: 6 },
    ],
};

export const LEAD: LeadQuestion = {
    id: "LEAD",
    type: "lead",
    label: "Where can we send your results?",
    required: true,
};

export const QUESTIONS: Question[] = [Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q9, LEAD];

// -----------------------------
// Sprint 5 helper maps (results 2 & 3)
// -----------------------------

/**
 * For results, we interpret the “primary region” as:
 * - first selected region option id (if multiple selected)
 * - otherwise undefined → falls back to "Global"
 */
export function getPrimaryRegionId(answers: Answers): number | undefined {
    const ids = answers.Q2;
    return Array.isArray(ids) && ids.length > 0 ? ids[0] : undefined;
}

export const REGION_META = {
    // ids correspond to Q2 option ids
    1: { label: "Global", avgHouseholdIncome: 30000, cartMultiplier: 1.0 },
    2: { label: "USA", avgHouseholdIncome: 75000, cartMultiplier: 1.15 },
    3: { label: "Canada", avgHouseholdIncome: 70000, cartMultiplier: 1.10 }, // streamlined (ballpark)
    4: { label: "Europe", avgHouseholdIncome: 45000, cartMultiplier: 0.95 },
    5: { label: "Latin America", avgHouseholdIncome: 15000, cartMultiplier: 0.85 },
    6: { label: "Asia-Pacific", avgHouseholdIncome: 20000, cartMultiplier: 0.90 },
    7: { label: "Rest of the world", avgHouseholdIncome: 30000, cartMultiplier: 1.0 },
} as const;

export function computeAvgHouseholdIncomeFromAnswers(answers: Answers): number {
    const primary = getPrimaryRegionId(answers) ?? 1;
    return REGION_META[primary as keyof typeof REGION_META]?.avgHouseholdIncome ?? 30000;
}

/**
 * Avg cart size model (ballpark, inspired by Outgrow):
 * - Each selected product category contributes a base cart value
 * - We average across selected categories (so multi-category brands don’t explode)
 * - Apply region multiplier
 * - Apply final bump factor (1.20) and round
 */
export const PRODUCT_CART_BASE = {
    // ids correspond to Q3 option ids
    1: 600,
    2: 500,
    3: 160,
    4: 200,
    5: 140,
    6: 120,
    7: 240,
    8: 500,
} as const;

export function computeAvgCartSizeFromAnswers(answers: Answers): number {
    const selected = Array.isArray(answers.Q3) ? answers.Q3 : [];
    // Map selected category IDs to cart base values; ensure a plain number[] for math
    const bases = selected
        .map((id) => PRODUCT_CART_BASE[id as keyof typeof PRODUCT_CART_BASE])
        .filter((v) => typeof v === "number" && v > 0) as number[];

    const avgBase = bases.length > 0 ? bases.reduce((a, b) => a + b, 0) / bases.length : 0;

    const primaryRegionId = getPrimaryRegionId(answers) ?? 1;
    const regionMult =
        REGION_META[primaryRegionId as keyof typeof REGION_META]?.cartMultiplier ?? 1.0;

    return Math.round(avgBase * regionMult * 1.2);
}

// -----------------------------
// Weights snapshot (dev sanity helper)
// -----------------------------

export const WEIGHTS_SNAPSHOT = {
    Q1: Q1.options.map(({ label, value }) => ({ label, value })),
    Q2: Q2.options.map(({ label, value }) => ({ label, value })),
    Q3: Q3.options.map(({ label, value }) => ({ label, value })),
    Q4: Q4.options.map(({ label, value }) => ({ label, value })),
    Q5: Q5.options.map(({ label, value }) => ({ label, value })),
    Q6: Q6.options.map(({ label, value }) => ({ label, value })),
    Q9: Q9.options.map(({ label, value }) => ({ label, value })),
} as const;
