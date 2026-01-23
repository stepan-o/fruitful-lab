// frontend/lib/tools/pinterestPotential/benchmarks.ts
/**
 * v1.0 (Locked) — Benchmarks (segment + niche)
 * Source of truth for:
 * - audience_base (range)
 * - income (range)
 * - opportunity (range; type depends on segment)
 * - inferred indices (seasonality + competition) + optional notes/tags
 *
 * NOTE: Numbers are intentionally “range-y” and tunable.
 * Keep these as a config surface, not hard-coded in compute.
 *
 * ---------------------------------------------------------------------
 * Audience model (US & Canada only) — UPDATED (2026-01-22)
 * ---------------------------------------------------------------------
 * We previously used “big” audience ranges (millions) as a loose proxy for niche size.
 * For this calculator, we’re now grounding audience_base in a *quotable platform ceiling*
 * and applying explicit “reality” discounts.
 *
 * 1) Platform ceiling (quotable)
 *    - Pinterest Investor Relations (Q1 2025): Avg. US & Canada MAU = 102M
 *      https://investor.pinterestinc.com/news-and-events/press-releases/press-releases-details/2025/Pinterest-Announces-First-Quarter-2025-Results-Delivers-16-Revenue-Growth-and-Record-Users/default.aspx
 *    - Cross-check: Pinterest Q4 2024 results (SEC/8-K): US & Canada MAU ~101M
 *      https://www.sec.gov/Archives/edgar/data/1506293/000150629325000022/pins-20241231.htm
 *
 * 2) Practical reach discount (conservative “non-major publisher” territory)
 *    - We treat MAU as a “ceiling” that includes very light/rare activity.
 *    - We apply a conservative practical reach factor = 0.3% of MAU.
 *      Rationale (non-exhaustive):
 *      - Organic distribution is volatile and limited by creative volume, intent match, and account trust.
 *      - “Reach” is further constrained by competition, freshness, and rank position.
 *      - This keeps outputs grounded for small/medium brands without heavy paid spend.
 *    - Resulting practical reach ceiling (all niches combined): 102,000,000 * 0.003 = 306,000
 *
 * 3) Niche “penetration” (monthly)
 *    - Public sources rarely provide a clean % breakdown of Pinterest MAU by category.
 *      So we model niche penetration as:
 *        “% of active pinners who meaningfully engage with content in this niche in a typical month”
 *      This is *not* a partition; sums across niches can exceed 100% (one person can engage in multiple).
 *
 *    Inputs used to anchor *which* niches are “large” on Pinterest:
 *    - Pinterest Newsroom trend reporting repeatedly highlights the big verticals:
 *      fashion, beauty, home decor, food, hobbies.
 *      https://newsroom.pinterest.com/news/the-pinterest-fall-2024-trend-report/
 *    - External ecosystem summaries consistently list dominant Pinterest niches:
 *      home decor, DIY/crafts, food & drink, travel, fashion & beauty.
 *      (Less authoritative than Pinterest itself; used as a directional corroboration.)
 *      https://influencermarketinghub.com/top-20-pinterest-influencers/
 *
 *    We keep penetration ranges wide and tunable by design.
 *
 * 4) Segment multipliers (applied on top of niche penetration)
 *    - Even within the same niche, addressable reach depends on what the business *is*:
 *      content creator vs product seller vs service provider.
 *    - We model this as a multiplier range per segment (still tunable):
 *        content_creator: ~1.0 (baseline)
 *        product_seller: ~0.75 (slightly narrower than pure content, but still strong on Pinterest)
 *        service_provider: ~0.35 (meaningfully narrower; intent exists but is a smaller slice)
 *
 *    Supporting Pinterest signal for “discovery/consideration” behavior:
 *    - Pinterest for Business stat: “97% of top searches are unbranded”
 *      (We use this to justify that discovery is broad; great for content + products.
 *       Services are still viable, but the buyer-intent slice is smaller.)
 *      https://business.pinterest.com/es/blog/drive-automotive-sales-with-pinterest-ads/
 */

import type { NicheSlug, Segment } from "./pinterestPotentialSpec";

export type IndexLevel = "low" | "medium" | "high";

export type Range = { low: number; high: number };

export type OpportunityType = "traffic" | "revenue" | "leads";

export type BenchmarkRow = {
    segment: Segment;
    niche: NicheSlug;

    /**
     * Monthly addressable audience range (unique users),
     * already grounded in US/CA practical reach + niche penetration + segment multiplier.
     */
    audience_base: Range;

    /** Annual household income range (USD). */
    income: Range;

    /** Segment-specific opportunity range (monthly). */
    opportunity: {
        type: OpportunityType;
        low: number;
        high: number;
    };

    inferred: {
        seasonality: IndexLevel;
        competition: IndexLevel;

        /** Optional short notes used by insight.ts for nicer copy. */
        notes?: Partial<Record<"seasonality" | "competition", string>>;

        /** Optional tags for later segmentation/email sequencing. */
        tags?: string[];
    };
};

export type BenchmarkKey = `${Segment}:${string}`;

export function benchmarkKey(segment: Segment, niche: NicheSlug): BenchmarkKey {
    return `${segment}:${niche}`;
}

// -----------------------------
// Global audience anchors (US/CA)
// -----------------------------

/**
 * Avg. monthly active users in US & Canada (Pinterest IR Q1 2025).
 * Keep as a “quotable” ceiling; do not tune casually.
 */
export const PINTEREST_USCA_MAU_CEILING = 102_000_000;

/**
 * Practical reachable fraction of MAU for “non-major publisher / no heavy paid spend” territory.
 * Tunable, but keep conservative by default.
 */
export const PRACTICAL_REACH_FRACTION = 0.003; // 0.3%

/**
 * Practical reach ceiling across all niches (unique users / month), before niche & segment slicing.
 */
export const PRACTICAL_REACH_USCA_CEILING = Math.round(PINTEREST_USCA_MAU_CEILING * PRACTICAL_REACH_FRACTION); // 306,000

// -----------------------------
// Niche penetration (monthly)
// -----------------------------

/**
 * Niche penetration = % of active pinners likely to engage with this niche in a typical month.
 * Not a partition; users can count toward multiple niches.
 *
 * IMPORTANT: These are intentionally wide ranges.
 * If we later want higher-fidelity, Ads Manager audience estimates (by interest/keyword) are the
 * strongest Pinterest-native method — but too labor intensive for a generalized calculator.
 */
export const NICHE_PENETRATION: Record<NicheSlug, { low: number; high: number }> = {
    // Content creator niches
    food: { low: 0.35, high: 0.55 }, // consistently one of Pinterest’s biggest planning categories
    travel: { low: 0.15, high: 0.30 },
    home_diy: { low: 0.25, high: 0.40 },
    lifestyle: { low: 0.20, high: 0.35 },
    finance: { low: 0.08, high: 0.15 },
    wellness: { low: 0.20, high: 0.35 },
    parenting: { low: 0.15, high: 0.25 },
    beauty_fashion: { low: 0.25, high: 0.40 },
    crafts: { low: 0.15, high: 0.25 },

    // Product seller niches
    baby_family: { low: 0.12, high: 0.22 },
    home_decor: { low: 0.25, high: 0.40 },
    beauty: { low: 0.18, high: 0.32 },
    fashion: { low: 0.18, high: 0.32 },
    food_bev: { low: 0.20, high: 0.35 },
    digital_crafts: { low: 0.12, high: 0.22 },
    pets: { low: 0.10, high: 0.18 },
    travel_gear: { low: 0.06, high: 0.12 },

    // Service provider niches (hiring intent slice tends to be smaller)
    agency: { low: 0.03, high: 0.08 },
    coach: { low: 0.04, high: 0.10 },
    designer: { low: 0.06, high: 0.14 },
    photo_video: { low: 0.06, high: 0.14 },
    wellness_practitioner: { low: 0.06, high: 0.12 },
    real_estate_home: { low: 0.08, high: 0.16 },
    educator: { low: 0.08, high: 0.18 },
    events: { low: 0.08, high: 0.18 },

    // Shared catch-all
    other: { low: 0.05, high: 0.12 },
};

// -----------------------------
// Segment multipliers
// -----------------------------

/**
 * Segment multiplier = additional discount based on business type.
 * This captures how often a niche user is addressable *for this kind of business*.
 *
 * - content_creator: baseline (broad discovery content fits Pinterest behavior)
 * - product_seller: slightly narrower (still strong because Pinterest is shopping/planning oriented)
 * - service_provider: narrower (lead intent exists but is a smaller slice)
 *
 * Keep wide: local/intent niches (real estate/events) can skew higher; generic B2B can skew lower.
 */
export const SEGMENT_MULTIPLIER: Record<Segment, { low: number; high: number }> = {
    content_creator: { low: 0.8, high: 1.15 },
    product_seller: { low: 0.55, high: 0.95 },
    service_provider: { low: 0.2, high: 0.6 },
};

// -----------------------------
// Helpers
// -----------------------------

function clampInt(n: number): number {
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.round(n));
}

/**
 * Compute an audience_base range from:
 * - practical reach ceiling (US/CA)
 * - niche penetration range
 * - segment multiplier range
 */
export function audienceBaseFor(segment: Segment, niche: NicheSlug): Range {
    const pen = NICHE_PENETRATION[niche];
    const seg = SEGMENT_MULTIPLIER[segment];

    // Low = conservative * conservative. High = optimistic * optimistic.
    // (We intentionally avoid “mixing” low/high to keep interpretation straightforward.)
    return {
        low: clampInt(PRACTICAL_REACH_USCA_CEILING * pen.low * seg.low),
        high: clampInt(PRACTICAL_REACH_USCA_CEILING * pen.high * seg.high),
    };
}

// -----------------------------
// Canonical benchmark table
// -----------------------------

export const BENCHMARKS: BenchmarkRow[] = [
    // -----------------------------
    // Content creator
    // -----------------------------
    {
        segment: "content_creator",
        niche: "food",
        audience_base: audienceBaseFor("content_creator", "food"),
        income: { low: 55_000, high: 110_000 },
        opportunity: { type: "traffic", low: 5_000, high: 20_000 },
        inferred: {
            seasonality: "medium",
            competition: "high",
            notes: {
                seasonality: "Spikes around holidays + seasonal recipes—batch content early.",
                competition: "Crowded niche—strong SEO angles and fresh visuals win distribution.",
            },
            tags: ["evergreen", "seasonal", "competitive"],
        },
    },
    {
        segment: "content_creator",
        niche: "travel",
        audience_base: audienceBaseFor("content_creator", "travel"),
        income: { low: 65_000, high: 120_000 },
        opportunity: { type: "traffic", low: 4_000, high: 18_000 },
        inferred: {
            seasonality: "high",
            competition: "high",
            notes: {
                seasonality: "Planning spikes around holidays and peak travel seasons.",
                competition: "High saturation—fresh angles + intent-matched landing pages matter.",
            },
            tags: ["seasonal", "competitive"],
        },
    },
    {
        segment: "content_creator",
        niche: "home_diy",
        audience_base: audienceBaseFor("content_creator", "home_diy"),
        income: { low: 60_000, high: 115_000 },
        opportunity: { type: "traffic", low: 4_000, high: 16_000 },
        inferred: {
            seasonality: "medium",
            competition: "medium",
            notes: {
                seasonality: "Renovation and refresh seasons (spring/fall) tend to lift demand.",
                competition: "Moderate competition—clear tutorials and before/after creative help.",
            },
            tags: ["evergreen"],
        },
    },
    {
        segment: "content_creator",
        niche: "lifestyle",
        audience_base: audienceBaseFor("content_creator", "lifestyle"),
        income: { low: 55_000, high: 105_000 },
        opportunity: { type: "traffic", low: 3_000, high: 14_000 },
        inferred: {
            seasonality: "low",
            competition: "high",
            notes: {
                seasonality: "Less seasonal overall—consistent posting compounds results.",
                competition: "Broad niche—sharp positioning and keyword clusters help you stand out.",
            },
            tags: ["broad"],
        },
    },
    {
        segment: "content_creator",
        niche: "finance",
        audience_base: audienceBaseFor("content_creator", "finance"),
        income: { low: 70_000, high: 140_000 },
        opportunity: { type: "traffic", low: 2_000, high: 10_000 },
        inferred: {
            seasonality: "low",
            competition: "medium",
            notes: {
                seasonality: "Peaks around tax season and major life events—plan ahead for those windows.",
                competition: "Moderate competition—trust signals and clear steps increase clicks.",
            },
            tags: ["evergreen", "high-intent"],
        },
    },
    {
        segment: "content_creator",
        niche: "wellness",
        audience_base: audienceBaseFor("content_creator", "wellness"),
        income: { low: 55_000, high: 115_000 },
        opportunity: { type: "traffic", low: 3_000, high: 13_000 },
        inferred: {
            seasonality: "medium",
            competition: "high",
            notes: {
                seasonality: "New-year resets + summer prep tend to lift searches.",
                competition: "Crowded space—specific problems + friendly visuals perform best.",
            },
            tags: ["seasonal", "competitive"],
        },
    },
    {
        segment: "content_creator",
        niche: "parenting",
        audience_base: audienceBaseFor("content_creator", "parenting"),
        income: { low: 55_000, high: 115_000 },
        opportunity: { type: "traffic", low: 3_000, high: 12_000 },
        inferred: {
            seasonality: "medium",
            competition: "high",
            notes: {
                seasonality: "Back-to-school and holidays create predictable planning surges.",
                competition: "High competition—practical checklists and “how-to” pins drive clicks.",
            },
            tags: ["seasonal", "competitive"],
        },
    },
    {
        segment: "content_creator",
        niche: "beauty_fashion",
        audience_base: audienceBaseFor("content_creator", "beauty_fashion"),
        income: { low: 55_000, high: 115_000 },
        opportunity: { type: "traffic", low: 4_000, high: 17_000 },
        inferred: {
            seasonality: "high",
            competition: "high",
            notes: {
                seasonality: "Trends + event seasons (weddings/holidays) drive spikes.",
                competition: "Highly saturated—trend keywords + clean visuals are key.",
            },
            tags: ["trend", "seasonal", "competitive"],
        },
    },
    {
        segment: "content_creator",
        niche: "crafts",
        audience_base: audienceBaseFor("content_creator", "crafts"),
        income: { low: 50_000, high: 105_000 },
        opportunity: { type: "traffic", low: 2_000, high: 11_000 },
        inferred: {
            seasonality: "high",
            competition: "medium",
            notes: {
                seasonality: "Holiday projects + seasonal decor drive predictable surges.",
                competition: "Moderate—step-by-step visuals and supply lists increase saves/clicks.",
            },
            tags: ["seasonal", "how-to"],
        },
    },
    {
        segment: "content_creator",
        niche: "other",
        audience_base: audienceBaseFor("content_creator", "other"),
        income: { low: 50_000, high: 105_000 },
        opportunity: { type: "traffic", low: 2_000, high: 9_000 },
        inferred: {
            seasonality: "medium",
            competition: "medium",
            notes: {
                seasonality: "Most niches have predictable planning windows—use your editorial calendar.",
                competition: "Positioning + SEO clusters matter more than volume alone.",
            },
            tags: ["other"],
        },
    },

    // -----------------------------
    // Product seller
    // -----------------------------
    {
        segment: "product_seller",
        niche: "baby_family",
        audience_base: audienceBaseFor("product_seller", "baby_family"),
        income: { low: 60_000, high: 120_000 },
        opportunity: { type: "revenue", low: 8_000, high: 35_000 },
        inferred: {
            seasonality: "medium",
            competition: "high",
            notes: {
                seasonality: "Registries, milestones, and gifting seasons create planning spikes.",
                competition: "Crowded category—product education + trust signals improve conversion.",
            },
            tags: ["gifting", "competitive"],
        },
    },
    {
        segment: "product_seller",
        niche: "home_decor",
        audience_base: audienceBaseFor("product_seller", "home_decor"),
        income: { low: 60_000, high: 130_000 },
        opportunity: { type: "revenue", low: 10_000, high: 45_000 },
        inferred: {
            seasonality: "high",
            competition: "high",
            notes: {
                seasonality: "Refresh seasons + holidays drive planning (spring/fall + Q4).",
                competition: "High saturation—strong creative variety and landing-page clarity matter.",
            },
            tags: ["seasonal", "competitive"],
        },
    },
    {
        segment: "product_seller",
        niche: "beauty",
        audience_base: audienceBaseFor("product_seller", "beauty"),
        income: { low: 55_000, high: 125_000 },
        opportunity: { type: "revenue", low: 9_000, high: 40_000 },
        inferred: {
            seasonality: "high",
            competition: "high",
            notes: {
                seasonality: "Event seasons and gifting windows lift demand.",
                competition: "Very competitive—benefit-led creatives and reviews help.",
            },
            tags: ["trend", "competitive"],
        },
    },
    {
        segment: "product_seller",
        niche: "fashion",
        audience_base: audienceBaseFor("product_seller", "fashion"),
        income: { low: 55_000, high: 125_000 },
        opportunity: { type: "revenue", low: 12_000, high: 55_000 },
        inferred: {
            seasonality: "high",
            competition: "high",
            notes: {
                seasonality: "Season changes + events drive spikes—launch early.",
                competition: "Highly saturated—trend keywords + strong merchandising matter.",
            },
            tags: ["seasonal", "competitive"],
        },
    },
    {
        segment: "product_seller",
        niche: "wellness",
        audience_base: audienceBaseFor("product_seller", "wellness"),
        income: { low: 55_000, high: 120_000 },
        opportunity: { type: "revenue", low: 8_000, high: 38_000 },
        inferred: {
            seasonality: "medium",
            competition: "high",
            notes: {
                seasonality: "New-year and summer prep windows lift search.",
                competition: "Competitive—clear outcomes + simple landing pages help.",
            },
            tags: ["seasonal", "competitive"],
        },
    },
    {
        segment: "product_seller",
        niche: "food_bev",
        audience_base: audienceBaseFor("product_seller", "food_bev"),
        income: { low: 50_000, high: 110_000 },
        opportunity: { type: "revenue", low: 7_000, high: 32_000 },
        inferred: {
            seasonality: "high",
            competition: "medium",
            notes: {
                seasonality: "Holidays and entertaining seasons drive planning spikes.",
                competition: "Moderate—recipes + UGC-style visuals can lift CTR.",
            },
            tags: ["seasonal"],
        },
    },
    {
        segment: "product_seller",
        niche: "digital_crafts",
        audience_base: audienceBaseFor("product_seller", "digital_crafts"),
        income: { low: 50_000, high: 110_000 },
        opportunity: { type: "revenue", low: 5_000, high: 25_000 },
        inferred: {
            seasonality: "high",
            competition: "medium",
            notes: {
                seasonality: "Holiday projects and planning moments lift demand.",
                competition: "Moderate—bundles and clear previews improve conversion.",
            },
            tags: ["digital", "seasonal"],
        },
    },
    {
        segment: "product_seller",
        niche: "pets",
        audience_base: audienceBaseFor("product_seller", "pets"),
        income: { low: 55_000, high: 120_000 },
        opportunity: { type: "revenue", low: 6_000, high: 28_000 },
        inferred: {
            seasonality: "low",
            competition: "medium",
            notes: {
                seasonality: "Less seasonal overall—consistent creative testing works well.",
                competition: "Moderate—education and problem/solution pins perform strongly.",
            },
            tags: ["evergreen"],
        },
    },
    {
        segment: "product_seller",
        niche: "travel_gear",
        audience_base: audienceBaseFor("product_seller", "travel_gear"),
        income: { low: 60_000, high: 130_000 },
        opportunity: { type: "revenue", low: 5_000, high: 24_000 },
        inferred: {
            seasonality: "high",
            competition: "high",
            notes: {
                seasonality: "Peaks around holiday travel and summer—launch early.",
                competition: "Competitive—clear differentiation and proof points help.",
            },
            tags: ["seasonal", "competitive"],
        },
    },
    {
        segment: "product_seller",
        niche: "other",
        audience_base: audienceBaseFor("product_seller", "other"),
        income: { low: 50_000, high: 115_000 },
        opportunity: { type: "revenue", low: 4_000, high: 20_000 },
        inferred: {
            seasonality: "medium",
            competition: "medium",
            tags: ["other"],
        },
    },

    // -----------------------------
    // Service provider
    // -----------------------------
    {
        segment: "service_provider",
        niche: "agency",
        audience_base: audienceBaseFor("service_provider", "agency"),
        income: { low: 70_000, high: 150_000 },
        opportunity: { type: "leads", low: 25, high: 140 },
        inferred: {
            seasonality: "low",
            competition: "high",
            notes: {
                seasonality: "Less seasonal—consistency and authority content compound.",
                competition: "High competition—proof (case studies) and clear CTA matter.",
            },
            tags: ["high-intent", "competitive"],
        },
    },
    {
        segment: "service_provider",
        niche: "coach",
        audience_base: audienceBaseFor("service_provider", "coach"),
        income: { low: 65_000, high: 140_000 },
        opportunity: { type: "leads", low: 20, high: 120 },
        inferred: {
            seasonality: "medium",
            competition: "high",
            notes: {
                seasonality: "New-year and “fresh start” moments lift interest.",
                competition: "Competitive—specific outcomes and positioning help conversion.",
            },
            tags: ["authority", "competitive"],
        },
    },
    {
        segment: "service_provider",
        niche: "designer",
        audience_base: audienceBaseFor("service_provider", "designer"),
        income: { low: 65_000, high: 145_000 },
        opportunity: { type: "leads", low: 22, high: 130 },
        inferred: {
            seasonality: "medium",
            competition: "medium",
            notes: {
                seasonality: "Peaks around home refresh seasons and major life events.",
                competition: "Moderate—portfolio pins + clear package offers work well.",
            },
            tags: ["portfolio"],
        },
    },
    {
        segment: "service_provider",
        niche: "photo_video",
        audience_base: audienceBaseFor("service_provider", "photo_video"),
        income: { low: 60_000, high: 140_000 },
        opportunity: { type: "leads", low: 18, high: 110 },
        inferred: {
            seasonality: "high",
            competition: "high",
            notes: {
                seasonality: "Wedding and event seasons create strong surges—publish early.",
                competition: "Competitive—style differentiation + proof points help.",
            },
            tags: ["seasonal", "competitive"],
        },
    },
    {
        segment: "service_provider",
        niche: "wellness_practitioner",
        audience_base: audienceBaseFor("service_provider", "wellness_practitioner"),
        income: { low: 55_000, high: 125_000 },
        opportunity: { type: "leads", low: 18, high: 120 },
        inferred: {
            seasonality: "medium",
            competition: "high",
            tags: ["competitive"],
        },
    },
    {
        segment: "service_provider",
        niche: "finance",
        audience_base: audienceBaseFor("service_provider", "finance"),
        income: { low: 70_000, high: 160_000 },
        opportunity: { type: "leads", low: 15, high: 90 },
        inferred: {
            seasonality: "high",
            competition: "medium",
            notes: {
                seasonality: "Tax season and year-end planning can spike interest.",
            },
            tags: ["high-intent"],
        },
    },
    {
        segment: "service_provider",
        niche: "real_estate_home",
        audience_base: audienceBaseFor("service_provider", "real_estate_home"),
        income: { low: 70_000, high: 160_000 },
        opportunity: { type: "leads", low: 25, high: 160 },
        inferred: {
            seasonality: "high",
            competition: "high",
            notes: {
                seasonality: "Spring/summer cycles create predictable surges—plan content early.",
                competition: "Competitive—local relevance and clear next step are key.",
            },
            tags: ["local", "seasonal", "competitive"],
        },
    },
    {
        segment: "service_provider",
        niche: "educator",
        audience_base: audienceBaseFor("service_provider", "educator"),
        income: { low: 60_000, high: 140_000 },
        opportunity: { type: "leads", low: 22, high: 150 },
        inferred: {
            seasonality: "high",
            competition: "medium",
            notes: {
                seasonality: "Back-to-school and new-year planning windows lift demand.",
            },
            tags: ["seasonal"],
        },
    },
    {
        segment: "service_provider",
        niche: "events",
        audience_base: audienceBaseFor("service_provider", "events"),
        income: { low: 60_000, high: 140_000 },
        opportunity: { type: "leads", low: 18, high: 120 },
        inferred: {
            seasonality: "high",
            competition: "high",
            notes: {
                seasonality: "Event seasons create strong spikes—publish + run campaigns early.",
                competition: "Competitive—visual style + clear packages improve conversion.",
            },
            tags: ["seasonal", "competitive"],
        },
    },
    {
        segment: "service_provider",
        niche: "other",
        audience_base: audienceBaseFor("service_provider", "other"),
        income: { low: 55_000, high: 130_000 },
        opportunity: { type: "leads", low: 15, high: 90 },
        inferred: {
            seasonality: "medium",
            competition: "medium",
            tags: ["other"],
        },
    },
];

// -----------------------------
// Fast lookup map
// -----------------------------

export const BENCHMARK_MAP: Record<BenchmarkKey, BenchmarkRow> = Object.fromEntries(
    BENCHMARKS.map((row) => [benchmarkKey(row.segment, row.niche), row])
) as Record<BenchmarkKey, BenchmarkRow>;

export function getBenchmark(segment: Segment, niche: NicheSlug): BenchmarkRow {
    const key = benchmarkKey(segment, niche);
    const row = BENCHMARK_MAP[key];
    if (!row) {
        // Fail loud: compute must not silently guess.
        throw new Error(`Missing benchmark row for ${key}`);
    }
    return row;
}
