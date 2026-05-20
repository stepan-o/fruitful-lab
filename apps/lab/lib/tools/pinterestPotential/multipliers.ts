// frontend/lib/tools/pinterestPotential/multipliers.ts
/**
 * v1.1 (Locked) — Multipliers + modeling assumptions (NEW CONTRACT)
 *
 * Contract alignment:
 * - Benchmarks provide MACRO demand as `demand_base_sessions` (SESSIONS/month).
 * - This module provides MICRO execution multipliers (Q3–Q8) + light index friction.
 * - No fallbacks. No backwards compatibility. Missing keys must fail immediately.
 *
 * Mental model:
 * 1) Distribution capacity (micro): how much of macro demand you realistically capture on Pinterest
 *    driven mostly by: volume (Q3) + creative library strength (Q4) + growth mode (Q8).
 * 2) Conversion readiness (micro): what happens after the click / visit
 *    driven mostly by: site experience (Q5) + offer clarity (Q6).
 *
 * Compute must apply these directly, and must not invent defaults.
 *
 * v1.2+ STRICT CONTRACT CHANGE (breaking; NO back-compat, NO flexibility):
 * - Goal-driven outcome modeling is now REQUIRED for ALL segments.
 * - This module exports a canonical GOAL_OUTCOME_MODEL keyed by GoalKey (from the spec).
 * - content_creator + traffic now includes an opt-in assumption so Result 3 can output email subscribers.
 * - product_seller + service_provider goals now have explicit outcome assumptions (no compute defaults).
 * - Module-load validation hard-fails if ANY expected GoalKey is missing from GOAL_OUTCOME_MODEL or goal_micro_adjust.
 */

import type {
    GrowthMode,
    OfferClarity,
    SiteExperience,
    VisualStrength,
    VolumeBucket,
    GoalKey,
    Segment,
    PrimaryGoal,
} from "./pinterestPotentialSpec";
import { getPrimaryGoalOptions, makeGoalKey } from "./pinterestPotentialSpec";
import type { IndexLevel } from "./benchmarks";

/** Simple 0–1 range type for assumptions. */
export type Range01 = { low: number; high: number };

/** Product-seller revenue modeling: typical order value buckets shown in results (no question asked). */
export type AovBucket = "lt_50" | "50_100" | "100_250" | "250_plus";

/** Content-creator revenue modeling: typical price buckets shown in results (no question asked). */
export type CoursePriceBucket = "lt_50" | "50_200" | "200_1000" | "1000_plus";

type ContentCreatorGoalKey = Extract<
    GoalKey,
    | "content_creator:traffic"
    | "content_creator:email_subscribers"
    | "content_creator:affiliate_revenue"
    | "content_creator:course_product_sales"
>;

type ProductSellerGoalKey = Extract<
    GoalKey,
    | "product_seller:sales"
    | "product_seller:email_subscribers"
    | "product_seller:retargeting_pool"
    | "product_seller:new_customer_discovery"
>;

type ServiceProviderGoalKey = Extract<
    GoalKey,
    | "service_provider:leads_calls"
    | "service_provider:email_subscribers"
    | "service_provider:webinar_signups"
    | "service_provider:authority_visibility"
>;

/**
 * Compute-aligned content creator outcome model:
 * - traffic (v1.2+): MUST include opt-in assumption so Result 3 can output list growth (special case).
 * - email_subscribers uses `optin_rate_from_sessions`
 * - affiliate_revenue uses `rpm_usd` (USD per 1,000 sessions)
 * - course_product_sales uses `course_intent_share_of_sessions` and enroll rates per price bucket
 */
export type ContentCreatorOutcomeAssumption =
    | {
    kind: "traffic";
    /**
     * v1.2+ special-case modeling:
     * Even when the PRIMARY goal is "traffic", Result 3 must show email subscribers (not blank).
     * Compute uses this rate to estimate monthly_email_subscribers_est alongside traffic framing.
     */
    optin_rate_from_sessions: Range01;
}
    | {
    kind: "email_subscribers";
    /** Email opt-in rate from sessions (cold / mixed-intent). */
    optin_rate_from_sessions: Range01;
}
    | {
    kind: "affiliate_revenue";
    /**
     * RPM-style earnings per 1,000 sessions, in USD.
     * Compute applies conversion_readiness as a light multiplier.
     */
    rpm_usd: { low: number; high: number };
}
    | {
    kind: "course_product_sales";
    /**
     * Share of sessions that are course/product-intent (subset of sessions).
     * Then compute applies enroll rate by price bucket * conversion_readiness * price.
     */
    course_intent_share_of_sessions: Range01;
};

/**
 * v1.2+ product seller outcomes (goal-driven; NO compute defaults).
 *
 * Notes:
 * - `sales` reuses existing ecommerce modeling surfaces (purchase intent share + CR by AOV + AOV buckets),
 *   but is now explicitly scoped as a goal outcome via this model entry.
 */
export type ProductSellerOutcomeAssumption =
    | {
    kind: "sales";
    purchase_intent_share_of_sessions: Range01;
    conversion_rate_by_aov: Record<AovBucket, Range01>;
    aov_buckets: ReadonlyArray<{ id: AovBucket; label: string; low: number; high: number }>;
}
    | {
    kind: "email_subscribers";
    optin_rate_from_sessions: Range01;
}
    | {
    kind: "retargeting_pool";
    retargetable_share_of_sessions: Range01;
}
    | {
    kind: "new_customer_discovery";
    new_to_brand_share_of_sessions: Range01;
};

/**
 * v1.2+ service provider outcomes (goal-driven; NO compute defaults).
 *
 * Notes:
 * - `authority_visibility` intentionally uses a non-0..1 scalar: reach-per-session can exceed 1.
 */
export type ServiceProviderOutcomeAssumption =
    | {
    kind: "leads_calls";
    book_rate_from_sessions: Range01;
}
    | {
    kind: "email_subscribers";
    optin_rate_from_sessions: Range01;
}
    | {
    kind: "webinar_signups";
    webinar_signup_rate_from_sessions: Range01;
}
    | {
    kind: "authority_visibility";
    visibility_reach_per_session: { low: number; high: number };
};

/**
 * MultipliersConfig is shaped for the calculator contract:
 * - All keys are explicit enums / unions (no unknown string keys)
 * - No softening/clamps/fallbacks live here
 */
export type MultipliersConfig = {
    /**
     * Q3 — How much you publish (inventory / surface area).
     * Intended use:
     * - strong driver of distribution capacity (more inventory → more chances to enter search + homefeed).
     */
    volume_bucket: Record<VolumeBucket, number>;

    /**
     * Q4 — Creative library strength (format + clarity + variety).
     * Intended use:
     * - driver of distribution capacity (CTR/saves → more distribution loops)
     * - modest driver of downstream opportunity (better clicks & landing alignment).
     */
    visual_strength: Record<VisualStrength, number>;

    /**
     * Q5 — Website experience (speed + clarity).
     * Intended use:
     * - primarily conversion readiness (turn sessions into leads/sales)
     * - can also reduce “effective sessions” via bounce.
     */
    site_experience: Record<SiteExperience, number>;

    /**
     * Q6 — Offer clarity.
     * Intended use:
     * - conversion readiness (clear next step → higher form/cart completion)
     */
    offer_clarity: Record<OfferClarity, number>;

    /**
     * Q8 — Ads vs organic.
     * Intended use:
     * - distribution capacity: ads can buy incremental distribution beyond organic limits.
     */
    growth_mode: Record<GrowthMode, number>;

    /**
     * Benchmark-driven inferred indices (light friction knobs).
     * Intended use:
     * - apply lightly (keep close to 1.0 to avoid over-penalizing “hard” niches).
     */
    seasonality: Record<IndexLevel, number>;
    competition: Record<IndexLevel, number>;

    /**
     * Optional tiny goal-based adjustment.
     * With the new model, goals are mostly framing rather than a numeric lever;
     * we still keep this explicit (and neutral by default) so compute never guesses.
     */
    goal_micro_adjust: Record<GoalKey, number>;
};

/**
 * Core multiplier table (NO compute clamps, NO defaults).
 *
 * Design constraints:
 * - Single factor ranges are modest (mostly 0.80–1.20).
 * - “Worst case” combined execution stays plausible (~0.35–0.55),
 *   and “best case” stays bounded (no “casino math”).
 * - Ads is the largest single positive lever because it purchases incremental distribution.
 */
export const MULTIPLIERS = {
    // -----------------------------
    // Q3 — Output volume (inventory)
    // -----------------------------
    volume_bucket: {
        "0-2": 0.82,
        "3-5": 0.93,
        "6-10": 1.0,
        "11-20": 1.1,
        "20+": 1.18,
    },

    // -----------------------------
    // Q4 — Visual library strength
    // -----------------------------
    visual_strength: {
        limited: 0.85,
        decent: 0.95,
        strong: 1.07,
        very_strong: 1.15,
    },

    // -----------------------------
    // Q5 — Website experience
    // -----------------------------
    site_experience: {
        a: 0.8,
        b: 0.92,
        c: 1.05,
        d: 1.12,
    },

    // -----------------------------
    // Q6 — Offer clarity
    // -----------------------------
    offer_clarity: {
        no: 0.9,
        somewhat: 0.97,
        yes: 1.06,
    },

    // -----------------------------
    // Q8 — Growth mode (ads vs organic)
    // -----------------------------
    growth_mode: {
        organic: 1.0,
        later: 1.03,
        ads: 1.15,
    },

    // -----------------------------
    // Inferred indices (light friction)
    // -----------------------------
    seasonality: {
        low: 1.02,
        medium: 1.0,
        high: 0.96,
    },
    competition: {
        low: 1.03,
        medium: 1.0,
        high: 0.95,
    },

    // -----------------------------
    // Goal micro-adjust (explicit, neutral)
    // -----------------------------
    goal_micro_adjust: {
        // content_creator
        "content_creator:traffic": 1.0,
        "content_creator:email_subscribers": 1.0,
        "content_creator:affiliate_revenue": 1.0,
        "content_creator:course_product_sales": 1.0,

        // product_seller
        "product_seller:new_customer_discovery": 1.0,
        "product_seller:sales": 1.0,
        "product_seller:email_subscribers": 1.0,
        "product_seller:retargeting_pool": 1.0,

        // service_provider
        "service_provider:authority_visibility": 1.0,
        "service_provider:leads_calls": 1.0,
        "service_provider:email_subscribers": 1.0,
        "service_provider:webinar_signups": 1.0,
    },
} as const satisfies MultipliersConfig;

/**
 * NEW MODELING ASSUMPTIONS (used by compute/results)
 * --------------------------------------------------
 * These are not “answer multipliers” — they translate SESSIONS into purchases/leads.
 * Keep centrally configurable and auditable.
 */

export const AOV_BUCKETS: ReadonlyArray<{ id: AovBucket; label: string; low: number; high: number }> = [
    { id: "lt_50", label: "<$50", low: 20, high: 49 },
    { id: "50_100", label: "$50–$100", low: 50, high: 100 },
    { id: "100_250", label: "$100–$250", low: 100, high: 250 },
    { id: "250_plus", label: "$250+", low: 250, high: 400 }, // display cap; raise if needed
];

/**
 * Ecommerce conversion rate assumptions (cold / mixed-intent traffic).
 * Map higher AOV → lower expected conversion rate (more decision friction).
 */
export const ECOM_CONVERSION_RATE_BY_AOV: Record<AovBucket, Range01> = {
    lt_50: { low: 0.015, high: 0.035 },
    "50_100": { low: 0.012, high: 0.03 },
    "100_250": { low: 0.008, high: 0.022 },
    "250_plus": { low: 0.004, high: 0.015 },
};

/**
 * “Purchase-intent sessions” is a subset of sessions.
 * Keep conservative; can be tuned per niche later if desired.
 */
export const PURCHASE_INTENT_SHARE_OF_SESSIONS: Range01 = { low: 0.25, high: 0.55 };

/**
 * Service-provider discovery call booking rate from sessions (cold traffic).
 * Conservative; rely on Q5/Q6 (site + offer) to nudge.
 */
export const DISCOVERY_CALL_BOOK_RATE_FROM_SESSIONS: Range01 = { low: 0.005, high: 0.02 }; // 0.5%–2.0%

/**
 * Content-creator modeling assumptions (compute.ts is source of truth)
 * -------------------------------------------------------------------
 * Compute uses:
 * - traffic (v1.2+): sessions + framing for traffic, plus email subs via optin_rate_from_sessions (special case)
 * - email_subscribers: sessions * optin_rate_from_sessions * conversion_readiness
 * - affiliate_revenue: (sessions/1000) * rpm_usd * conversion_readiness
 * - course_product_sales:
 *     course_intent_sessions = sessions * course_intent_share_of_sessions
 *     revenue_by_price = course_intent_sessions * enroll_rate_by_price[bucket] * conversion_readiness * price_bucket
 */

export const COURSE_PRICE_BUCKETS: ReadonlyArray<{
    id: CoursePriceBucket;
    label: string;
    low: number;
    high: number;
}> = [
    { id: "lt_50", label: "<$50", low: 10, high: 49 },
    { id: "50_200", label: "$50–$200", low: 50, high: 200 },
    { id: "200_1000", label: "$200–$1,000", low: 200, high: 1000 },
    { id: "1000_plus", label: "$1,000+", low: 1000, high: 2500 }, // display cap; raise if needed
];

/**
 * Compute imports this exact symbol name:
 *   COURSE_ENROLL_RATE_BY_PRICE
 */
export const COURSE_ENROLL_RATE_BY_PRICE: Record<CoursePriceBucket, Range01> = {
    lt_50: { low: 0.003, high: 0.012 },
    "50_200": { low: 0.002, high: 0.008 },
    "200_1000": { low: 0.001, high: 0.005 },
    "1000_plus": { low: 0.0005, high: 0.003 },
};

export const CONTENT_CREATOR_OUTCOME_MODEL = {
    "content_creator:traffic": {
        kind: "traffic",
        // v1.2+ special-case: when goal is traffic, Result 3 still outputs email subscribers (not blank).
        optin_rate_from_sessions: { low: 0.005, high: 0.02 },
    },
    "content_creator:email_subscribers": {
        kind: "email_subscribers",
        optin_rate_from_sessions: { low: 0.01, high: 0.05 },
    },
    "content_creator:affiliate_revenue": {
        kind: "affiliate_revenue",
        rpm_usd: { low: 3, high: 18 },
    },
    "content_creator:course_product_sales": {
        kind: "course_product_sales",
        course_intent_share_of_sessions: { low: 0.1, high: 0.35 },
    },
} as const satisfies Record<ContentCreatorGoalKey, ContentCreatorOutcomeAssumption>;

export const PRODUCT_SELLER_OUTCOME_MODEL = {
    "product_seller:sales": {
        kind: "sales",
        // Explicitly scoped as the SALES goal outcome (v1.2+). Compute must not apply this for other goals.
        purchase_intent_share_of_sessions: PURCHASE_INTENT_SHARE_OF_SESSIONS,
        conversion_rate_by_aov: ECOM_CONVERSION_RATE_BY_AOV,
        aov_buckets: AOV_BUCKETS,
    },
    "product_seller:email_subscribers": {
        kind: "email_subscribers",
        optin_rate_from_sessions: { low: 0.01, high: 0.04 },
    },
    "product_seller:retargeting_pool": {
        kind: "retargeting_pool",
        retargetable_share_of_sessions: { low: 0.15, high: 0.45 },
    },
    "product_seller:new_customer_discovery": {
        kind: "new_customer_discovery",
        new_to_brand_share_of_sessions: { low: 0.4, high: 0.8 },
    },
} as const satisfies Record<ProductSellerGoalKey, ProductSellerOutcomeAssumption>;

export const SERVICE_PROVIDER_OUTCOME_MODEL = {
    "service_provider:leads_calls": {
        kind: "leads_calls",
        // Reuse the explicit booking-rate surface; model entry keeps it goal-scoped for v1.2+.
        book_rate_from_sessions: DISCOVERY_CALL_BOOK_RATE_FROM_SESSIONS,
    },
    "service_provider:email_subscribers": {
        kind: "email_subscribers",
        optin_rate_from_sessions: { low: 0.01, high: 0.05 },
    },
    "service_provider:webinar_signups": {
        kind: "webinar_signups",
        webinar_signup_rate_from_sessions: { low: 0.004, high: 0.02 },
    },
    "service_provider:authority_visibility": {
        kind: "authority_visibility",
        // Non-0..1 scalar: reach-per-session can exceed 1 (visibility is not a conversion rate).
        visibility_reach_per_session: { low: 1.2, high: 3.5 },
    },
} as const satisfies Record<ServiceProviderGoalKey, ServiceProviderOutcomeAssumption>;

/**
 * v1.2+ Canonical goal-outcome model (ALL segments; exhaustive; keyed by GoalKey).
 * Compute MUST use this table for goal-driven numeric outcomes (no invented rates).
 */
export type GoalOutcomeAssumptionV2 =
    | ContentCreatorOutcomeAssumption
    | ProductSellerOutcomeAssumption
    | ServiceProviderOutcomeAssumption;

export const GOAL_OUTCOME_MODEL = {
    ...CONTENT_CREATOR_OUTCOME_MODEL,
    ...PRODUCT_SELLER_OUTCOME_MODEL,
    ...SERVICE_PROVIDER_OUTCOME_MODEL,
} as const satisfies Record<GoalKey, GoalOutcomeAssumptionV2>;

/** Fail-loud validation: no NaN / Infinity in config. */
function assertFiniteConfig(label: string, n: number) {
    if (!Number.isFinite(n)) throw new Error(`Multipliers config error: ${label} must be finite, got ${String(n)}`);
}

function assertRange01(label: string, r: Range01) {
    assertFiniteConfig(`${label}.low`, r.low);
    assertFiniteConfig(`${label}.high`, r.high);
    if (r.low < 0 || r.high > 1 || r.low > r.high) {
        throw new Error(
            `Multipliers config error: ${label} must satisfy 0 ≤ low ≤ high ≤ 1, got low=${String(r.low)}, high=${String(
                r.high
            )}`
        );
    }
}

function assertRangeN(label: string, r: { low: number; high: number }) {
    assertFiniteConfig(`${label}.low`, r.low);
    assertFiniteConfig(`${label}.high`, r.high);
    if (r.low > r.high) {
        throw new Error(
            `Multipliers config error: ${label} must satisfy low ≤ high, got low=${String(r.low)}, high=${String(r.high)}`
        );
    }
}

function assertRangeNonNegativeN(label: string, r: { low: number; high: number }) {
    assertRangeN(label, r);
    if (r.low < 0) {
        throw new Error(`Multipliers config error: ${label} must satisfy low ≥ 0, got low=${String(r.low)}`);
    }
}

function assertBucketRange(label: string, low: number, high: number) {
    assertFiniteConfig(`${label}.low`, low);
    assertFiniteConfig(`${label}.high`, high);
    if (low > high) {
        throw new Error(
            `Multipliers config error: ${label} must satisfy low ≤ high, got low=${String(low)}, high=${String(high)}`
        );
    }
}

function hasOwn(obj: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

function expectedGoalKeysFromSpec(): GoalKey[] {
    const segments: ReadonlyArray<Segment> = ["content_creator", "product_seller", "service_provider"];
    const out: GoalKey[] = [];

    for (const seg of segments) {
        const opts = getPrimaryGoalOptions(seg);
        for (const o of opts) {
            // v1.2+ strict contract: GoalKey formation is locked to the spec helper (fail-loud).
            out.push(makeGoalKey(seg, o.id as PrimaryGoal));
        }
    }

    return out;
}

(function validateMultipliers() {
    const walk = (prefix: string, obj: Record<string, unknown>) => {
        for (const [k, v] of Object.entries(obj)) {
            const key = `${prefix}.${k}`;
            if (typeof v === "number") assertFiniteConfig(key, v);
        }
    };

    // core multiplier tables
    walk("volume_bucket", MULTIPLIERS.volume_bucket as unknown as Record<string, unknown>);
    walk("visual_strength", MULTIPLIERS.visual_strength as unknown as Record<string, unknown>);
    walk("site_experience", MULTIPLIERS.site_experience as unknown as Record<string, unknown>);
    walk("offer_clarity", MULTIPLIERS.offer_clarity as unknown as Record<string, unknown>);
    walk("growth_mode", MULTIPLIERS.growth_mode as unknown as Record<string, unknown>);
    walk("seasonality", MULTIPLIERS.seasonality as unknown as Record<string, unknown>);
    walk("competition", MULTIPLIERS.competition as unknown as Record<string, unknown>);
    walk("goal_micro_adjust", MULTIPLIERS.goal_micro_adjust as unknown as Record<string, unknown>);

    // modeling assumptions — product seller + service provider
    for (const b of AOV_BUCKETS) assertBucketRange(`AOV_BUCKETS.${b.id}`, b.low, b.high);
    for (const [k, r] of Object.entries(ECOM_CONVERSION_RATE_BY_AOV))
        assertRange01(`ECOM_CONVERSION_RATE_BY_AOV.${k}`, r);
    assertRange01("PURCHASE_INTENT_SHARE_OF_SESSIONS", PURCHASE_INTENT_SHARE_OF_SESSIONS);
    assertRange01("DISCOVERY_CALL_BOOK_RATE_FROM_SESSIONS", DISCOVERY_CALL_BOOK_RATE_FROM_SESSIONS);

    // modeling assumptions — content creator
    for (const b of COURSE_PRICE_BUCKETS) assertBucketRange(`COURSE_PRICE_BUCKETS.${b.id}`, b.low, b.high);
    for (const [k, r] of Object.entries(COURSE_ENROLL_RATE_BY_PRICE))
        assertRange01(`COURSE_ENROLL_RATE_BY_PRICE.${k}`, r);

    // v1.2+ strict exhaustiveness: ensure ALL spec goal keys exist in BOTH surfaces
    const expectedKeys = expectedGoalKeysFromSpec();
    const expectedSet = new Set<string>(expectedKeys);

    for (const k of expectedKeys) {
        if (!hasOwn(GOAL_OUTCOME_MODEL, k)) {
            throw new Error(`Multipliers config error: GOAL_OUTCOME_MODEL missing required key: ${k}`);
        }
        if (!hasOwn(MULTIPLIERS.goal_micro_adjust, k)) {
            throw new Error(`Multipliers config error: goal_micro_adjust missing required key: ${k}`);
        }
    }

    for (const k of Object.keys(GOAL_OUTCOME_MODEL)) {
        if (!expectedSet.has(k)) {
            throw new Error(`Multipliers config error: GOAL_OUTCOME_MODEL has unexpected key: ${k}`);
        }
    }
    for (const k of Object.keys(MULTIPLIERS.goal_micro_adjust)) {
        if (!expectedSet.has(k)) {
            throw new Error(`Multipliers config error: goal_micro_adjust has unexpected key: ${k}`);
        }
    }

    // v1.2+ validate goal outcome model surfaces (no silent missing/malformed rates)
    for (const [goalKey, model] of Object.entries(GOAL_OUTCOME_MODEL) as Array<[GoalKey, GoalOutcomeAssumptionV2]>) {
        if (model.kind === "traffic") {
            assertRange01(`GOAL_OUTCOME_MODEL.${goalKey}.optin_rate_from_sessions`, model.optin_rate_from_sessions);
        } else if (model.kind === "email_subscribers") {
            assertRange01(`GOAL_OUTCOME_MODEL.${goalKey}.optin_rate_from_sessions`, model.optin_rate_from_sessions);
        } else if (model.kind === "affiliate_revenue") {
            assertRangeN(`GOAL_OUTCOME_MODEL.${goalKey}.rpm_usd`, model.rpm_usd);
        } else if (model.kind === "course_product_sales") {
            assertRange01(
                `GOAL_OUTCOME_MODEL.${goalKey}.course_intent_share_of_sessions`,
                model.course_intent_share_of_sessions
            );
        } else if (model.kind === "sales") {
            assertRange01(
                `GOAL_OUTCOME_MODEL.${goalKey}.purchase_intent_share_of_sessions`,
                model.purchase_intent_share_of_sessions
            );

            // These are also validated globally; keep this check to ensure the goal model surface is sane.
            for (const b of model.aov_buckets) assertBucketRange(`GOAL_OUTCOME_MODEL.${goalKey}.aov_buckets.${b.id}`, b.low, b.high);
            for (const [k, r] of Object.entries(model.conversion_rate_by_aov))
                assertRange01(`GOAL_OUTCOME_MODEL.${goalKey}.conversion_rate_by_aov.${k}`, r);
        } else if (model.kind === "retargeting_pool") {
            assertRange01(
                `GOAL_OUTCOME_MODEL.${goalKey}.retargetable_share_of_sessions`,
                model.retargetable_share_of_sessions
            );
        } else if (model.kind === "new_customer_discovery") {
            assertRange01(
                `GOAL_OUTCOME_MODEL.${goalKey}.new_to_brand_share_of_sessions`,
                model.new_to_brand_share_of_sessions
            );
        } else if (model.kind === "leads_calls") {
            assertRange01(`GOAL_OUTCOME_MODEL.${goalKey}.book_rate_from_sessions`, model.book_rate_from_sessions);
        } else if (model.kind === "webinar_signups") {
            assertRange01(
                `GOAL_OUTCOME_MODEL.${goalKey}.webinar_signup_rate_from_sessions`,
                model.webinar_signup_rate_from_sessions
            );
        } else if (model.kind === "authority_visibility") {
            assertRangeNonNegativeN(
                `GOAL_OUTCOME_MODEL.${goalKey}.visibility_reach_per_session`,
                model.visibility_reach_per_session
            );
        } else {
            // Exhaustiveness guard: if a new kind is introduced, validation must be updated (strict contract).
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const _exhaustive: never = model;
        }
    }
})();

/**
 * Bounds: useful when compute removes clamps (so you know worst/best case).
 * These are derived from the tables above.
 */
function minMax(values: number[]): { min: number; max: number } {
    return { min: Math.min(...values), max: Math.max(...values) };
}

const VOL = minMax(Object.values(MULTIPLIERS.volume_bucket));
const VIS = minMax(Object.values(MULTIPLIERS.visual_strength));
const SITE = minMax(Object.values(MULTIPLIERS.site_experience));
const OFFER = minMax(Object.values(MULTIPLIERS.offer_clarity));
const GROW = minMax(Object.values(MULTIPLIERS.growth_mode));
const SEAS = minMax(Object.values(MULTIPLIERS.seasonality));
const COMP = minMax(Object.values(MULTIPLIERS.competition));

export const MULTIPLIER_BOUNDS = {
    distribution_capacity: {
        worst: VOL.min * VIS.min * GROW.min,
        best: VOL.max * VIS.max * GROW.max,
        worst_with_indices: VOL.min * VIS.min * GROW.min * SEAS.min * COMP.min,
        best_with_indices: VOL.max * VIS.max * GROW.max * SEAS.max * COMP.max,
    },
    conversion_readiness: {
        worst: SITE.min * OFFER.min,
        best: SITE.max * OFFER.max,
    },
    execution_total_all_factors: {
        worst: VOL.min * VIS.min * SITE.min * OFFER.min * GROW.min * SEAS.min * COMP.min,
        best: VOL.max * VIS.max * SITE.max * OFFER.max * GROW.max * SEAS.max * COMP.max,
    },
} as const;
