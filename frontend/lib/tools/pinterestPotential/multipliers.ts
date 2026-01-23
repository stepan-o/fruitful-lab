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
 */

import type {
    GrowthMode,
    OfferClarity,
    SiteExperience,
    VisualStrength,
    VolumeBucket,
    GoalKey,
} from "./pinterestPotentialSpec";
import type { IndexLevel } from "./benchmarks";

/** Simple 0–1 range type for assumptions. */
export type Range01 = { low: number; high: number };

/** Product-seller revenue modeling: typical order value buckets shown in results (no question asked). */
export type AovBucket = "lt_50" | "50_100" | "100_250" | "250_plus";

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
 * Guidance for compute (v1.1 contract):
 * - distribution_capacity = volume_bucket * visual_strength * growth_mode
 * - conversion_readiness = site_experience * offer_clarity
 * - optionally apply seasonality/competition lightly to distribution_capacity
 *
 * Then:
 * - likely_sessions = demand_base_sessions * distribution_capacity * (optional indices)
 * - product_seller_purchase_intent_sessions = likely_sessions * PURCHASE_INTENT_SHARE_OF_SESSIONS
 * - purchases_by_aov = product_seller_purchase_intent_sessions * ECOM_CONVERSION_RATE_BY_AOV[aov] * conversion_readiness
 * - service_provider_calls = likely_sessions * DISCOVERY_CALL_BOOK_RATE_FROM_SESSIONS * conversion_readiness
 */

/** Fail-loud validation: no NaN / Infinity in config. */
function assertFiniteConfig(label: string, n: number) {
    if (!Number.isFinite(n)) throw new Error(`Multipliers config error: ${label} must be finite, got ${String(n)}`);
}
(function validateMultipliers() {
    const walk = (prefix: string, obj: Record<string, unknown>) => {
        for (const [k, v] of Object.entries(obj)) {
            const key = `${prefix}.${k}`;
            if (typeof v === "number") assertFiniteConfig(key, v);
        }
    };
    walk("volume_bucket", MULTIPLIERS.volume_bucket as unknown as Record<string, unknown>);
    walk("visual_strength", MULTIPLIERS.visual_strength as unknown as Record<string, unknown>);
    walk("site_experience", MULTIPLIERS.site_experience as unknown as Record<string, unknown>);
    walk("offer_clarity", MULTIPLIERS.offer_clarity as unknown as Record<string, unknown>);
    walk("growth_mode", MULTIPLIERS.growth_mode as unknown as Record<string, unknown>);
    walk("seasonality", MULTIPLIERS.seasonality as unknown as Record<string, unknown>);
    walk("competition", MULTIPLIERS.competition as unknown as Record<string, unknown>);
    walk("goal_micro_adjust", MULTIPLIERS.goal_micro_adjust as unknown as Record<string, unknown>);
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
