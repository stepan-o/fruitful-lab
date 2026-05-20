// frontend/lib/tools/pinterestPotential/benchmarks.ts
/**
 * v1.1 (Locked) — Benchmarks (segment + niche) — NEW CONTRACT
 *
 * ✅ Source of truth for:
 * - demand_base_sessions (range; MACRO)  ← canonical “demand” unit is SESSIONS (NOT users)
 * - income (range)
 * - inferred indices (seasonality + competition) + optional notes/tags
 *
 * ❌ Removed (no backwards compatibility):
 * - audience_base
 * - opportunity (and OpportunityType)
 *
 * NOTE:
 * - Numbers are intentionally “range-y” and tunable *where it matters* (niche + segment ranges).
 * - The MAU → session-pool transition uses SINGLE fixed scalars (no additional ranges),
 *   otherwise everything becomes meaningless.
 * - Keep these as a config surface, not hard-coded in compute.
 * - This module must fail-loud on invalid config (no soft fallbacks).
 *
 * ---------------------------------------------------------------------
 * Demand model (US & Canada only) — UPDATED (2026-01-23)
 * ---------------------------------------------------------------------
 * We anchor a *macro monthly session pool* from a quotable platform ceiling (MAU),
 * then apply conservative “practical reach” discounts and tunable niche/segment ranges.
 *
 * 1) Platform ceiling (quotable)
 *    - Pinterest Investor Relations (Q1 2025): Avg. US & Canada MAU = 102M
 *      https://investor.pinterestinc.com/news-and-events/press-releases/press-releases-details/2025/Pinterest-Announces-First-Quarter-2025-Results-Delivers-16-Revenue-Growth-and-Record-Users/default.aspx
 *    - Cross-check: Pinterest FY2024 / Q4 results (SEC/10-K): US & Canada MAU ~101M
 *      https://www.sec.gov/Archives/edgar/data/1506293/000150629325000022/pins-20241231.htm
 *
 * 2) Practical addressable USER pool discount (conservative “non-major publisher” territory)
 *    - We treat MAU as a ceiling that includes very light/rare activity.
 *    - We apply a conservative practical fraction to form a macro monthly *user* pool.
 *      This is a modeling knob (NOT a claim about Pinterest internals).
 *    - Default: 0.3% of MAU → 102,000,000 * 0.003 = 306,000 practical users/month.
 *
 * 3) Convert practical users → practical sessions (single scalar; NO ranges)
 *    - We apply ONE fixed average sessions-per-user-per-month value.
 *    - This avoids compounding ranges on top of ranges.
 *    - Default: 4 sessions/user/month → 306,000 * 4 = 1,224,000 sessions/month (macro pool).
 *
 * 4) Niche “penetration” (monthly)
 *    - “% of the macro session pool likely to be associated with this niche in a typical month”
 *      Not a partition; one user can create sessions across multiple niches.
 *
 * 5) Segment multipliers (applied on top of niche penetration)
 *    - Even within the same niche, addressable sessions depend on what the business *is*:
 *      content creator vs product seller vs service provider.
 */

import type { NicheSlug, Segment } from "./pinterestPotentialSpec";

export type IndexLevel = "low" | "medium" | "high";
export type Range = { low: number; high: number };

export type BenchmarkRow = {
    segment: Segment;
    niche: NicheSlug;

    /**
     * Monthly addressable demand (SESSIONS) range (MACRO),
     * already grounded in US/CA macro pool + niche penetration + segment multiplier.
     *
     * IMPORTANT:
     * - No execution multipliers are applied to this number.
     * - Compute will apply micro multipliers (Q3–Q8 + indices) downstream.
     */
    demand_base_sessions: Range;

    /** Annual household income range (USD). */
    income: Range;

    inferred: {
        seasonality: IndexLevel;
        competition: IndexLevel;

        /** Optional short notes used by insight.ts for nicer copy. */
        notes?: Partial<Record<"seasonality" | "competition", string>>;

        /** Optional tags for later segmentation/email sequencing. */
        tags?: string[];
    };
};

export type BenchmarkKey = `${Segment}:${NicheSlug}`;

export function benchmarkKey(segment: Segment, niche: NicheSlug): BenchmarkKey {
    return `${segment}:${niche}`;
}

// -----------------------------
// Global anchors (US/CA)
// -----------------------------

/**
 * Avg. monthly active users in US & Canada (Pinterest IR Q1 2025).
 * Keep as a “quotable” ceiling; do not tune casually.
 */
export const PINTEREST_USCA_MAU_CEILING = 102_000_000;

/**
 * Practical fraction of MAU used to form a conservative macro monthly *user* pool
 * for “non-major publisher / no heavy paid spend” territory.
 *
 * Tunable, but keep conservative by default.
 */
export const PRACTICAL_ACTIVE_USER_FRACTION = 0.003; // 0.3%

/**
 * Fixed average sessions per practical active user per month.
 *
 * IMPORTANT:
 * - Single scalar only (no ranges), to avoid turning everything into meaningless compounding ranges.
 * - This is a modeling knob, not a claim about Pinterest internals.
 */
export const AVG_SESSIONS_PER_PRACTICAL_USER_PER_MONTH = 4;

/**
 * Macro monthly practical user pool (US/CA), before niche & segment slicing.
 */
export const PRACTICAL_USERS_USCA_POOL = Math.round(
    PINTEREST_USCA_MAU_CEILING * PRACTICAL_ACTIVE_USER_FRACTION
); // 306,000

/**
 * Macro monthly session pool across all niches (SESSIONS/month), before niche & segment slicing.
 */
export const PRACTICAL_SESSIONS_USCA_POOL = Math.round(
    PRACTICAL_USERS_USCA_POOL * AVG_SESSIONS_PER_PRACTICAL_USER_PER_MONTH
); // 1,224,000

// -----------------------------
// Niche penetration (monthly)
// -----------------------------

/**
 * Niche penetration = % of the macro monthly session pool likely associated with this niche.
 * Not a partition; users (and sessions) can count toward multiple niches.
 *
 * IMPORTANT: These are intentionally wide ranges.
 * If we later want higher-fidelity, Ads Manager audience estimates (by interest/keyword) are the
 * strongest Pinterest-native method — but too labor intensive for a generalized calculator.
 */
export const NICHE_PENETRATION: Record<NicheSlug, { low: number; high: number }> = {
    // Content creator niches
    food: { low: 0.35, high: 0.55 },
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

    // Service provider niches
    agency: { low: 0.03, high: 0.08 },
    coach: { low: 0.04, high: 0.10 },
    designer: { low: 0.06, high: 0.14 },
    photo_video: { low: 0.06, high: 0.14 },
    wellness_practitioner: { low: 0.06, high: 0.12 },
    real_estate_home: { low: 0.08, high: 0.16 },
    educator: { low: 0.08, high: 0.18 },
    events: { low: 0.08, high: 0.18 },

    // Catch-all
    other: { low: 0.05, high: 0.12 },
};

// -----------------------------
// Segment multipliers
// -----------------------------

/**
 * Segment multiplier = discount based on business type.
 * Captures how often a niche session is addressable *for this kind of business*.
 */
export const SEGMENT_MULTIPLIER: Record<Segment, { low: number; high: number }> = {
    content_creator: { low: 0.8, high: 1.15 },
    product_seller: { low: 0.55, high: 0.95 },
    service_provider: { low: 0.2, high: 0.6 },
};

// -----------------------------
// Helpers (fail-loud)
// -----------------------------

function mustFinite(n: number, label: string): number {
    if (!Number.isFinite(n)) throw new Error(`Benchmarks config error: ${label} must be finite, got ${String(n)}`);
    return n;
}

function mustFiniteNonNegInt(n: number, label: string): number {
    mustFinite(n, label);
    if (n < 0) throw new Error(`Benchmarks config error: ${label} must be >= 0, got ${String(n)}`);
    return Math.round(n);
}

/**
 * Compute demand_base_sessions range from:
 * - macro session pool (US/CA)
 * - niche penetration range
 * - segment multiplier range
 */
export function demandBaseSessionsFor(segment: Segment, niche: NicheSlug): Range {
    const pen = NICHE_PENETRATION[niche];
    const seg = SEGMENT_MULTIPLIER[segment];

    // Low = conservative * conservative. High = optimistic * optimistic.
    const low = PRACTICAL_SESSIONS_USCA_POOL * pen.low * seg.low;
    const high = PRACTICAL_SESSIONS_USCA_POOL * pen.high * seg.high;

    return {
        low: mustFiniteNonNegInt(low, `demandBaseSessionsFor(${segment},${niche}).low`),
        high: mustFiniteNonNegInt(high, `demandBaseSessionsFor(${segment},${niche}).high`),
    };
}

// -----------------------------
// Canonical benchmark table
// -----------------------------

export const BENCHMARKS = [
    // -----------------------------
    // Content creator
    // -----------------------------
    {
        segment: "content_creator",
        niche: "food",
        demand_base_sessions: demandBaseSessionsFor("content_creator", "food"),
        income: { low: 55_000, high: 110_000 },
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
        demand_base_sessions: demandBaseSessionsFor("content_creator", "travel"),
        income: { low: 65_000, high: 120_000 },
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
        demand_base_sessions: demandBaseSessionsFor("content_creator", "home_diy"),
        income: { low: 60_000, high: 115_000 },
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
        demand_base_sessions: demandBaseSessionsFor("content_creator", "lifestyle"),
        income: { low: 55_000, high: 105_000 },
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
        demand_base_sessions: demandBaseSessionsFor("content_creator", "finance"),
        income: { low: 70_000, high: 140_000 },
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
        demand_base_sessions: demandBaseSessionsFor("content_creator", "wellness"),
        income: { low: 55_000, high: 115_000 },
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
        demand_base_sessions: demandBaseSessionsFor("content_creator", "parenting"),
        income: { low: 55_000, high: 115_000 },
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
        demand_base_sessions: demandBaseSessionsFor("content_creator", "beauty_fashion"),
        income: { low: 55_000, high: 115_000 },
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
        demand_base_sessions: demandBaseSessionsFor("content_creator", "crafts"),
        income: { low: 50_000, high: 105_000 },
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
        demand_base_sessions: demandBaseSessionsFor("content_creator", "other"),
        income: { low: 50_000, high: 105_000 },
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
        demand_base_sessions: demandBaseSessionsFor("product_seller", "baby_family"),
        income: { low: 60_000, high: 120_000 },
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
        demand_base_sessions: demandBaseSessionsFor("product_seller", "home_decor"),
        income: { low: 60_000, high: 130_000 },
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
        demand_base_sessions: demandBaseSessionsFor("product_seller", "beauty"),
        income: { low: 55_000, high: 125_000 },
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
        demand_base_sessions: demandBaseSessionsFor("product_seller", "fashion"),
        income: { low: 55_000, high: 125_000 },
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
        demand_base_sessions: demandBaseSessionsFor("product_seller", "wellness"),
        income: { low: 55_000, high: 120_000 },
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
        demand_base_sessions: demandBaseSessionsFor("product_seller", "food_bev"),
        income: { low: 50_000, high: 110_000 },
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
        demand_base_sessions: demandBaseSessionsFor("product_seller", "digital_crafts"),
        income: { low: 50_000, high: 110_000 },
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
        demand_base_sessions: demandBaseSessionsFor("product_seller", "pets"),
        income: { low: 55_000, high: 120_000 },
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
        demand_base_sessions: demandBaseSessionsFor("product_seller", "travel_gear"),
        income: { low: 60_000, high: 130_000 },
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
        demand_base_sessions: demandBaseSessionsFor("product_seller", "other"),
        income: { low: 50_000, high: 115_000 },
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
        demand_base_sessions: demandBaseSessionsFor("service_provider", "agency"),
        income: { low: 70_000, high: 150_000 },
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
        demand_base_sessions: demandBaseSessionsFor("service_provider", "coach"),
        income: { low: 65_000, high: 140_000 },
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
        demand_base_sessions: demandBaseSessionsFor("service_provider", "designer"),
        income: { low: 65_000, high: 145_000 },
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
        demand_base_sessions: demandBaseSessionsFor("service_provider", "photo_video"),
        income: { low: 60_000, high: 140_000 },
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
        demand_base_sessions: demandBaseSessionsFor("service_provider", "wellness_practitioner"),
        income: { low: 55_000, high: 125_000 },
        inferred: {
            seasonality: "medium",
            competition: "high",
            tags: ["competitive"],
        },
    },
    {
        segment: "service_provider",
        niche: "finance",
        demand_base_sessions: demandBaseSessionsFor("service_provider", "finance"),
        income: { low: 70_000, high: 160_000 },
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
        demand_base_sessions: demandBaseSessionsFor("service_provider", "real_estate_home"),
        income: { low: 70_000, high: 160_000 },
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
        demand_base_sessions: demandBaseSessionsFor("service_provider", "educator"),
        income: { low: 60_000, high: 140_000 },
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
        demand_base_sessions: demandBaseSessionsFor("service_provider", "events"),
        income: { low: 60_000, high: 140_000 },
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
        demand_base_sessions: demandBaseSessionsFor("service_provider", "other"),
        income: { low: 55_000, high: 130_000 },
        inferred: {
            seasonality: "medium",
            competition: "medium",
            tags: ["other"],
        },
    },
] as const satisfies ReadonlyArray<BenchmarkRow>;

// -----------------------------
// Fast lookup map (fail-loud)
// -----------------------------

const _map = new Map<BenchmarkKey, BenchmarkRow>();
for (const row of BENCHMARKS) {
    const key = benchmarkKey(row.segment, row.niche);
    if (_map.has(key)) throw new Error(`Duplicate benchmark row for ${key}`);
    _map.set(key, row);
}

export const BENCHMARK_MAP = Object.fromEntries(_map.entries()) as Record<BenchmarkKey, BenchmarkRow>;

export function getBenchmark(segment: Segment, niche: NicheSlug): BenchmarkRow {
    const key = benchmarkKey(segment, niche);
    const row = BENCHMARK_MAP[key];
    if (!row) throw new Error(`Missing benchmark row for ${key}`);
    return row;
}
