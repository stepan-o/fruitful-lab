// frontend/lib/tools/pinterestPotential/multipliers.ts
/**
 * v0.2 (Locked) — Multipliers
 * Config-driven adjustment layers for ranges.
 *
 * Notes:
 * - Keep effects subtle and bounded. Spec guidance: ±10–15% max in spirit.
 * - These are applied in compute.ts (not here).
 */

import type {
    GrowthMode,
    OfferClarity,
    SiteExperience,
    VisualStrength,
    VolumeBucket,
} from "./pinterestPotentialSpec";
import type { IndexLevel } from "./benchmarks";

export type MultipliersConfig = {
    volume_bucket: Record<VolumeBucket, number>;
    visual_strength: Record<VisualStrength, number>;
    site_experience: Record<SiteExperience, number>;
    offer_clarity: Record<OfferClarity, number>;
    growth_mode: Record<GrowthMode, number>;

    seasonality: Record<IndexLevel, number>;
    competition: Record<IndexLevel, number>;

    /**
     * Optional tiny goal-based adjustment (v0.2 says "optional").
     * Keep off by default (1.0) unless you decide to turn it on later.
     */
    goal_micro_adjust?: Record<string, number>;
};

export const MULTIPLIERS: MultipliersConfig = {
    volume_bucket: {
        "0-2": 0.7,
        "3-5": 0.9,
        "6-10": 1.0,
        "11-20": 1.15,
        "20+": 1.3,
    },
    visual_strength: {
        limited: 0.8,
        decent: 0.95,
        strong: 1.1,
        very_strong: 1.2,
    },
    site_experience: {
        a: 0.75,
        b: 0.9,
        c: 1.05,
        d: 1.15,
    },
    offer_clarity: {
        no: 0.85,
        somewhat: 0.95,
        yes: 1.1,
    },
    growth_mode: {
        organic: 1.0,
        later: 1.05,
        ads: 1.12,
    },
    seasonality: {
        low: 1.05,
        medium: 1.0,
        high: 0.92,
    },
    competition: {
        low: 1.05,
        medium: 1.0,
        high: 0.9,
    },

    // Optional (disabled default): keep all at 1.0 until you explicitly turn it on.
    // Example keys you might use later:
    // "product_seller:discovery" -> 1.03
    // "product_seller:sales" -> 0.97
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

/** Utility: keep compute.ts clean. */
export function safeMultiplier(map: Record<string, number>, key: string, fallback = 1.0): number {
    const v = map[key];
    return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}