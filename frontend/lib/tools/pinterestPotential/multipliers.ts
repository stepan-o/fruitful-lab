// frontend/lib/tools/pinterestPotential/multipliers.ts
/**
 * v0.2 → v0.3 direction (Locked intent) — Multipliers + modeling assumptions
 *
 * What changed conceptually (aligned to the new results you described):
 * - We now think in TWO layers after segment+niche benchmarks:
 *   1) "Distribution capacity" (micro): how much of niche demand you can realistically capture on Pinterest
 *      driven mostly by: volume (Q3) + creative library strength (Q4) + using ads (Q8).
 *   2) "Conversion readiness" (micro): what happens after the click / visit
 *      driven mostly by: site experience (Q5) + offer clarity (Q6).
 *
 * This file is the ONLY source of truth for those relative nudges + a few model assumptions
 * (e.g., ecommerce conversion ranges by AOV bucket). Compute should apply these directly
 * (i.e., you can remove softening/clamps once compute is updated to the new outputs).
 *
 * -------------------------
 * Grounding / sources used
 * -------------------------
 * We’re not going to find a single quotable “Pinterest says Q3 should be 1.10” source.
 * But we can anchor the *direction* of each factor to reputable guidance:
 *
 * - Volume / consistency matters:
 *   Pinterest Business (content guide) emphasizes posting consistently (e.g., weekly) to build momentum.
 *   https://business.pinterest.com/en-in/blog/beginner-pinterest-content-guide/
 *
 * - Visual quality & format matters:
 *   Pinterest Help Center pin specs + recommendations (aspect ratio, clarity, etc.).
 *   https://help.pinterest.com/fr/business/article/pin-image-specifications
 *
 * - Site speed/UX affects drop-off + conversions:
 *   Think with Google "Mobile Site Speed Playbook" (e.g., speed impacts bounce/conversions).
 *   https://www.thinkwithgoogle.com/_qs/documents/8713/MobileSiteSpeedPlaybook.pdf
 *
 * - Conversion benchmarks (general web):
 *   Unbounce Conversion Benchmark Report page (median conversion rate context).
 *   https://unbounce.com/conversion-benchmark-report/
 *
 * - Ecommerce conversion rate benchmarks (general web):
 *   Adobe ecommerce conversion rate benchmark ranges (1%–4% typical; ~3.65% average cited).
 *   https://business.adobe.com/blog/basics/ecommerce-conversion-rate-benchmarks
 *
 * NOTE:
 * - We keep seasonality/competition in here as small “friction” multipliers because those indices
 *   still come from benchmarks.ts rows and are useful for adjusting “capacity” modestly.
 * - Values are intentionally conservative to avoid “casino math” once compute removes clamps.
 */

import type {
    GrowthMode,
    OfferClarity,
    SiteExperience,
    VisualStrength,
    VolumeBucket,
} from "./pinterestPotentialSpec";
import type { IndexLevel } from "./benchmarks";

/**
 * MultipliersConfig is still shaped to work with current compute.ts imports.
 * Once compute is updated to the new “macro demand + micro capacity” structure,
 * you can optionally split this into separate objects (distribution vs conversion).
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
     * - primarily conversion readiness (turn visits into leads/sales)
     * - also affects “effective sessions” (people bounce fast if slow/confusing).
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
     * - distribution capacity: ads can buy incremental reach beyond organic limits.
     */
    growth_mode: Record<GrowthMode, number>;

    /**
     * Benchmark-driven inferred indices (not asked, but useful friction knobs).
     * Intended use:
     * - apply lightly (we keep these close to 1.0 to avoid over-penalizing “hard” niches).
     */
    seasonality: Record<IndexLevel, number>;
    competition: Record<IndexLevel, number>;

    /**
     * Optional tiny goal-based adjustment.
     * With the new results model, goals are mostly “framing” rather than a numeric lever,
     * so keep this at 1.0 unless you *explicitly* want to bias.
     */
    goal_micro_adjust?: Record<string, number>;
};

/**
 * Core multiplier table (safe without compute clamps).
 *
 * Design constraints (so you can remove compute safety harness later):
 * - Single factor ranges are modest (mostly 0.80–1.20).
 * - “Worst case” combined execution multiplier stays in a plausible band (~0.35–0.55),
 *   and “best case” stays below ~2.0.
 * - Ads is the largest single positive lever because it’s literally buying distribution.
 */
export const MULTIPLIERS: MultipliersConfig = {
    // -----------------------------
    // Q3 — Output volume (inventory)
    // -----------------------------
    volume_bucket: {
        /**
         * 0–2/mo: low inventory → fewer entry points into search/homefeed.
         * We do NOT nuke them; Pinterest can still surface a small library, but growth is slower.
         */
        "0-2": 0.82,

        /**
         * 3–5/mo: still light, but consistent enough to build some momentum.
         */
        "3-5": 0.93,

        /**
         * 6–10/mo: baseline “steady” cadence.
         */
        "6-10": 1.0,

        /**
         * 11–20/mo: strong cadence; more tests, more freshness, more surface area.
         */
        "11-20": 1.1,

        /**
         * 20+/mo: high cadence; diminishing returns exist, so we cap the boost modestly.
         */
        "20+": 1.18,
    },

    // -----------------------------
    // Q4 — Visual library strength
    // -----------------------------
    visual_strength: {
        /**
         * Limited: fewer strong creatives, weaker save/click signals.
         */
        limited: 0.85,

        /**
         * Decent: baseline.
         */
        decent: 0.95,

        /**
         * Strong: consistent “Pinterest-native” creative quality & variety.
         */
        strong: 1.07,

        /**
         * Very strong: high variety + strong packaging (clear promise, format fit).
         * Keep the upside moderate to avoid implying “great creative = guaranteed virality.”
         */
        very_strong: 1.15,
    },

    // -----------------------------
    // Q5 — Website experience
    // -----------------------------
    site_experience: {
        /**
         * Slow/confusing on mobile: biggest drag on any downstream result.
         * Think with Google guidance: speed/UX changes materially impact drop-off + conversions.
         */
        a: 0.80,

        /**
         * Okay but could be clearer: minor drag.
         */
        b: 0.92,

        /**
         * Solid: baseline-plus.
         */
        c: 1.05,

        /**
         * Optimized: modest upside (still bounded; great sites don’t magically double demand).
         */
        d: 1.12,
    },

    // -----------------------------
    // Q6 — Offer clarity
    // -----------------------------
    offer_clarity: {
        /**
         * No clear offer: friction. People may browse, but fewer actions.
         */
        no: 0.90,

        /**
         * Somewhat: close to baseline.
         */
        somewhat: 0.97,

        /**
         * Yes: modest upside via reduced ambiguity (clear “what happens next”).
         *
         * This aligns directionally with CRO literature and benchmark reports
         * (e.g., Unbounce conversion benchmarking), without pretending we can predict
         * an exact lift from “clarity.”
         */
        yes: 1.06,
    },

    // -----------------------------
    // Q8 — Growth mode (ads vs organic)
    // -----------------------------
    growth_mode: {
        /**
         * Organic only: baseline.
         */
        organic: 1.0,

        /**
         * Maybe later: user intent to invest often correlates with willingness to test & optimize.
         * Keep tiny (we’re not modeling spend here).
         */
        later: 1.03,

        /**
         * Yes (ads): the largest single lever because it purchases incremental distribution.
         * Still capped: “ads” ≠ “unlimited reach” without budget + creative fit.
         *
         * Directional grounding: Pinterest performance products are explicitly designed
         * to maximize/expand delivery within your constraints.
         */
        ads: 1.15,
    },

    // -----------------------------
    // Inferred niche indices
    // -----------------------------
    seasonality: {
        /**
         * Low seasonality: steadier baseline demand month-to-month → slightly easier planning.
         */
        low: 1.02,

        /**
         * Medium: baseline.
         */
        medium: 1.0,

        /**
         * High seasonality: demand is spikier; if you miss the window, that month underperforms.
         * (We treat this as a small “execution friction” penalty, not a punishment.)
         */
        high: 0.96,
    },
    competition: {
        low: 1.03,
        medium: 1.0,
        high: 0.95,
    },

    // Keep goals neutral unless you explicitly want to bias the model later.
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
} as const;

/**
 * NEW MODELING ASSUMPTIONS (for the updated results page)
 * ------------------------------------------------------
 * These are not “multipliers for answers” — they’re assumptions used to translate
 * “Pinterest sessions / visitors” into “calls / purchases / revenue potential.”
 *
 * Put them here so product math is centrally configurable and auditable.
 */

/** Product-seller revenue modeling: typical order value buckets shown in results (no question asked). */
export type AovBucket = "lt_50" | "50_100" | "100_250" | "250_plus";

export const AOV_BUCKETS: Array<{ id: AovBucket; label: string; low: number; high: number }> = [
    { id: "lt_50", label: "<$50", low: 20, high: 49 },
    { id: "50_100", label: "$50–$100", low: 50, high: 100 },
    { id: "100_250", label: "$100–$250", low: 100, high: 250 },
    { id: "250_plus", label: "$250+", low: 250, high: 400 }, // cap display; you can raise if needed
];

/**
 * Ecommerce conversion rate assumptions (for cold / mixed-intent traffic):
 * - Adobe notes typical ecommerce conversion rates often land in ~1%–4% depending on context.
 *   https://business.adobe.com/blog/basics/ecommerce-conversion-rate-benchmarks
 *
 * We map higher AOV → lower expected conversion rate (more decision friction),
 * while keeping everything within a realistic band.
 */
export const ECOM_CONVERSION_RATE_BY_AOV: Record<AovBucket, Range01> = {
    ["lt_50"]: { low: 0.015, high: 0.035 },
    ["50_100"]: { low: 0.012, high: 0.03 },
    ["100_250"]: { low: 0.008, high: 0.022 },
    ["250_plus"]: { low: 0.004, high: 0.015 },
};

/**
 * “Purchase-intent visitors” is a subset of sessions.
 * We keep this conservative because Pinterest includes both inspiration + shopping intent.
 * This can be tuned per niche later if you want (e.g., higher for Beauty/CPG, lower for decor browsing).
 */
export const PURCHASE_INTENT_SHARE_OF_SESSIONS: Range01 = { low: 0.25, high: 0.55 };

/**
 * Service-provider discovery call booking rate (from Pinterest sessions):
 * - For cold traffic, booking a call is usually lower than a basic lead form benchmark.
 * - We keep this conservative and rely on Q5/Q6 multipliers (site + offer) to nudge it.
 *
 * If you later want a citable public benchmark, you can align the *upper bound* with
 * general lead-gen conversion medians (e.g., Unbounce), but call bookings typically trail forms.
 * https://unbounce.com/conversion-benchmark-report/
 */
export const DISCOVERY_CALL_BOOK_RATE_FROM_SESSIONS: Range01 = { low: 0.005, high: 0.02 }; // 0.5%–2.0%

/** Simple 0–1 range type for assumptions. */
export type Range01 = { low: number; high: number };

/**
 * Guidance for compute (v0.3+):
 * - distribution_capacity = volume_bucket * visual_strength * growth_mode
 * - conversion_readiness = site_experience * offer_clarity
 * - (optional) apply seasonality/competition lightly to distribution_capacity
 *
 * Then:
 * - likely_slice_of_niche_demand = niche_demand_macro * distribution_capacity
 * - content_creator_sessions ~= likely_slice_of_niche_demand (or map users→sessions if you add a ratio)
 * - product_seller_purchase_intent_visitors = sessions * PURCHASE_INTENT_SHARE_OF_SESSIONS * conversion_readiness
 * - revenue_by_aov = purchase_intent_visitors * ECOM_CONVERSION_RATE_BY_AOV[aov] * aov_value
 * - service_provider_calls = sessions * DISCOVERY_CALL_BOOK_RATE_FROM_SESSIONS * conversion_readiness
 */

/**
 * Bounds: helpful when you remove compute clamps (so you know worst/best case).
 * These are computed from the tables above.
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
    /**
     * Intended “micro distribution capacity” band.
     * (If you apply seasonality/competition to distribution, include them here too.)
     */
    distribution_capacity: {
        worst: VOL.min * VIS.min * GROW.min,
        best: VOL.max * VIS.max * GROW.max,
        // optional “with friction indices” band:
        worst_with_indices: VOL.min * VIS.min * GROW.min * SEAS.min * COMP.min,
        best_with_indices: VOL.max * VIS.max * GROW.max * SEAS.max * COMP.max,
    },

    /** Intended “micro conversion readiness” band. */
    conversion_readiness: {
        worst: SITE.min * OFFER.min,
        best: SITE.max * OFFER.max,
    },

    /** Combined “execution” band if you multiply all Q3–Q8 factors together. */
    execution_total_all_factors: {
        worst: VOL.min * VIS.min * SITE.min * OFFER.min * GROW.min * SEAS.min * COMP.min,
        best: VOL.max * VIS.max * SITE.max * OFFER.max * GROW.max * SEAS.max * COMP.max,
    },
} as const;

/**
 * ------------------------------------------------------------------
 * Back-compat exports (so current compute.ts still compiles today)
 * ------------------------------------------------------------------
 * You said you likely want to remove the safety harness in compute.ts.
 * For now:
 * - set intensities to 1.0 (so softening is effectively disabled),
 * - keep softenMultiplier + safeMultiplier so existing imports don’t break.
 *
 * Once compute.ts is updated, you can delete MULTIPLIER_INTENSITY + softenMultiplier entirely.
 */
export const MULTIPLIER_INTENSITY = {
    audience: 1.0,
    opportunity: 1.0,
    goal_micro: 1.0,
} as const;

/** Kept for compatibility; compute should stop using this once clamps are removed. */
export function softenMultiplier(raw: number, strength: number): number {
    if (!Number.isFinite(raw)) return 1.0;
    if (!Number.isFinite(strength)) return raw;
    const s = Math.max(0, Math.min(1, strength));
    return 1 + (raw - 1) * s;
}

/** Utility: keep compute.ts clean (still fine to keep long-term). */
export function safeMultiplier(map: Record<string, number>, key: string, fallback = 1.0): number {
    const v = map[key];
    return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}
