// frontend/lib/tools/pinterestPotential/benchmarks.ts
/**
 * v0.2 (Locked) — Benchmarks (segment + niche)
 * Source of truth for:
 * - audience_base (range)
 * - income (range)
 * - opportunity (range; type depends on segment)
 * - inferred indices (seasonality + competition) + optional notes/tags
 *
 * NOTE: Numbers are intentionally “range-y” and tunable.
 * Keep these as a config surface, not hard-coded in compute.
 */

import type { NicheSlug, Segment } from "./pinterestPotentialSpec";

export type IndexLevel = "low" | "medium" | "high";

export type Range = { low: number; high: number };

export type OpportunityType = "traffic" | "revenue" | "leads";

export type BenchmarkRow = {
    segment: Segment;
    niche: NicheSlug;

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
// Canonical benchmark table
// -----------------------------

export const BENCHMARKS: BenchmarkRow[] = [
    // -----------------------------
    // Content creator
    // -----------------------------
    {
        segment: "content_creator",
        niche: "food",
        audience_base: { low: 10_000_000, high: 35_000_000 },
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
        audience_base: { low: 7_000_000, high: 22_000_000 },
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
        audience_base: { low: 8_000_000, high: 25_000_000 },
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
        audience_base: { low: 6_000_000, high: 20_000_000 },
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
        audience_base: { low: 3_000_000, high: 12_000_000 },
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
        audience_base: { low: 6_000_000, high: 18_000_000 },
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
        audience_base: { low: 5_000_000, high: 16_000_000 },
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
        audience_base: { low: 9_000_000, high: 28_000_000 },
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
        audience_base: { low: 4_000_000, high: 14_000_000 },
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
        audience_base: { low: 3_000_000, high: 10_000_000 },
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
        audience_base: { low: 4_000_000, high: 14_000_000 },
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
        audience_base: { low: 8_000_000, high: 25_000_000 },
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
        audience_base: { low: 7_000_000, high: 22_000_000 },
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
        audience_base: { low: 9_000_000, high: 28_000_000 },
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
        audience_base: { low: 6_000_000, high: 18_000_000 },
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
        audience_base: { low: 5_000_000, high: 16_000_000 },
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
        audience_base: { low: 4_000_000, high: 14_000_000 },
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
        audience_base: { low: 4_000_000, high: 13_000_000 },
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
        audience_base: { low: 3_000_000, high: 10_000_000 },
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
        audience_base: { low: 3_000_000, high: 10_000_000 },
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
        audience_base: { low: 3_000_000, high: 12_000_000 },
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
        audience_base: { low: 2_000_000, high: 9_000_000 },
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
        audience_base: { low: 3_000_000, high: 11_000_000 },
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
        audience_base: { low: 2_000_000, high: 8_000_000 },
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
        audience_base: { low: 2_000_000, high: 9_000_000 },
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
        audience_base: { low: 2_000_000, high: 8_000_000 },
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
        audience_base: { low: 3_000_000, high: 12_000_000 },
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
        audience_base: { low: 3_000_000, high: 11_000_000 },
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
        audience_base: { low: 2_000_000, high: 8_000_000 },
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
        audience_base: { low: 2_000_000, high: 7_000_000 },
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