// frontend/lib/tools/pinterestPotential/compute.ts
/**
 * v0.3 (Locked) — Canonical compute engine (config-driven, range outputs)
 *
 * NEW RESULTS CONTRACT (no backwards compatibility):
 *
 * 1) Demand (macro + micro + final)
 *    - addressable_niche_demand_est (MACRO):
 *        Comes directly from benchmarks.ts (segment+niche slice of the US+CA “practical ceiling”).
 *        IMPORTANT: no execution multipliers are applied to this number.
 *
 *    - distribution_capacity_m (MICRO):
 *        A single multiplier derived from Q3–Q8 + inferred indices (seasonality/competition),
 *        using multipliers.ts as the only tuning surface.
 *
 *    - likely_slice_of_niche_demand_est (FINAL):
 *        addressable_niche_demand_est * distribution_capacity_m
 *
 * 2) Segment outcome (more concrete language)
 *    - content_creator: Monthly Pinterest sessions range
 *    - product_seller: Monthly Pinterest sessions + purchase-intent visitors + revenue potential by AOV bucket
 *    - service_provider: Monthly discovery calls range
 *
 * 3) Demographic context (non-niche-specific)
 *    - We keep this benchmark-driven (benchmarks.ts can set it globally or per-row identically).
 *
 * Notes:
 * - No “safety harness” (no softening, no clamps). The tables must be compute-safe.
 * - We still fail-loud on missing/invalid config, because that’s not a “harness”—it’s correctness.
 * - Inferred seasonality/competition come from benchmark row (not asked).
 * - Lead gating is NOT handled here (compute must work pre-email).
 */

import type { Answers } from "./pinterestPotentialSpec";
import { validateAnswers } from "./pinterestPotentialSpec";
import { getBenchmark, type Range } from "./benchmarks";
import { buildInsightFromBenchmark } from "./insight";

// Import multipliers as a namespace so we can read optional exports without compile breaks.
import * as M from "./multipliers";

/** 0–1 range (probabilities/shares). */
export type Range01 = { low: number; high: number };

/** AOV buckets used for “Revenue potential” display. */
export type AovBucket = "lt_50" | "50_100" | "100_250" | "250_plus";

/**
 * Canonical AOV bucket metadata (dollars).
 * If multipliers.ts exports AOV_BUCKETS, we’ll prefer that.
 * Otherwise, we fall back to this (kept identical to our expected UI buckets).
 */
const DEFAULT_AOV_BUCKETS: Array<{ id: AovBucket; label: string; low: number; high: number }> = [
    { id: "lt_50", label: "<$50", low: 25, high: 50 },
    { id: "50_100", label: "$50–$100", low: 50, high: 100 },
    { id: "100_250", label: "$100–$250", low: 100, high: 250 },
    { id: "250_plus", label: "$250+", low: 250, high: 500 },
];

/**
 * Purchase-intent visitors is a subset of sessions.
 * Keep conservative by default; you can tune in multipliers.ts later.
 */
const DEFAULT_PURCHASE_INTENT_SHARE: Range01 = { low: 0.20, high: 0.45 };

/**
 * E-commerce conversion rate by AOV bucket (probability).
 * Defaults are intentionally conservative; tune in multipliers.ts.
 */
const DEFAULT_ECOM_CONVERSION_RATE_BY_AOV: Record<AovBucket, Range01> = {
    lt_50: { low: 0.015, high: 0.035 }, // 1.5%–3.5%
    "50_100": { low: 0.012, high: 0.03 }, // 1.2%–3.0%
    "100_250": { low: 0.008, high: 0.022 }, // 0.8%–2.2%
    "250_plus": { low: 0.004, high: 0.015 }, // 0.4%–1.5%
};

export type DemandBundle = {
    /** Macro: niche demand slice (no execution applied). */
    addressable_niche_demand_est: Range;

    /** Micro: execution/distribution capacity derived from Q3–Q8 + inferred indices. */
    distribution_capacity_m: number;

    /** Final: your likely slice of niche demand (macro * micro). */
    likely_slice_of_niche_demand_est: Range;
};

export type SegmentOutcome =
    | {
    kind: "content_creator";
    monthly_pinterest_sessions_est: Range;
}
    | {
    kind: "service_provider";
    monthly_discovery_calls_est: Range;
}
    | {
    kind: "product_seller";
    monthly_pinterest_sessions_est: Range;
    monthly_purchase_intent_visitors_est: Range;

    /**
     * Revenue potential by AOV bucket:
     * purchase_intent_visitors * CR_by_AOV * AOV_range
     */
    revenue_by_aov_est: Record<AovBucket, Range>;

    /** Assumptions surfaced for explainability on the results page. */
    assumptions: {
        purchase_intent_share: Range01;
        ecommerce_cr_by_aov: Record<AovBucket, Range01>;
        aov_buckets: Array<{ id: AovBucket; label: string; low: number; high: number }>;
    };
};

export type ResultsBundle = {
    demand: DemandBundle;

    segment_outcome: SegmentOutcome;

    /** Non-niche-specific demographic context (kept benchmark-driven). */
    demographics: {
        /** Annual household income (USD) context. */
        household_income_usd: Range;
        notes?: string[];
    };

    inferred: {
        seasonality_index: "low" | "medium" | "high";
        competition_index: "low" | "medium" | "high";
        tags?: string[];
    };

    insight_line?: string | null;
};

type ComputeOk = { ok: true; results: ResultsBundle };
type ComputeErr = { ok: false; errors: Record<string, string> };
export type ComputeResult = ComputeOk | ComputeErr;

// -----------------------------
// Helpers (fail-loud + ranges)
// -----------------------------

function roundInt(n: number): number {
    return Math.round(n);
}

function applyRange(r: Range, m: number): Range {
    return { low: roundInt(r.low * m), high: roundInt(r.high * m) };
}

function applyRate(r: Range, rate: Range01): Range {
    return { low: roundInt(r.low * rate.low), high: roundInt(r.high * rate.high) };
}

function mustFiniteNumber(v: unknown, label: string): number {
    if (typeof v !== "number" || !Number.isFinite(v)) {
        throw new Error(`Compute config error: ${label} must be a finite number, got ${String(v)}`);
    }
    return v;
}

function mulAll(values: Array<{ v: unknown; label: string }>): number {
    return values.reduce((acc, { v, label }) => acc * mustFiniteNumber(v, label), 1.0);
}

// -----------------------------
// Optional config sourced from multipliers.ts
// -----------------------------

const MULTIPLIERS = (M as any).MULTIPLIERS as {
    volume_bucket: Record<string, number>;
    visual_strength: Record<string, number>;
    site_experience: Record<string, number>;
    offer_clarity: Record<string, number>;
    growth_mode: Record<string, number>;
    seasonality: Record<string, number>;
    competition: Record<string, number>;
    goal_micro_adjust?: Record<string, number>;
};

// Prefer exports if present; otherwise use defaults.
const AOV_BUCKETS: Array<{ id: AovBucket; label: string; low: number; high: number }> =
    ((M as any).AOV_BUCKETS as any) ?? DEFAULT_AOV_BUCKETS;

const PURCHASE_INTENT_VISITOR_SHARE: Range01 =
    ((M as any).PURCHASE_INTENT_VISITOR_SHARE as any) ??
    ((M as any).PURCHASE_INTENT_SHARE as any) ??
    DEFAULT_PURCHASE_INTENT_SHARE;

const ECOM_CONVERSION_RATE_BY_AOV: Record<AovBucket, Range01> =
    ((M as any).ECOM_CONVERSION_RATE_BY_AOV as any) ?? DEFAULT_ECOM_CONVERSION_RATE_BY_AOV;

// -----------------------------
// Core multiplier logic (no clamps)
// -----------------------------

/**
 * distribution_capacity_m (MICRO)
 * We intentionally treat Q3–Q8 + inferred indices as the execution/distribution capacity layer.
 * This is the “what you can realistically capture” layer applied to:
 * - your likely slice of niche demand
 * - sessions/calls (and downstream purchase-intent + revenue for product sellers)
 *
 * IMPORTANT: Because we removed clamping/softening, multipliers.ts must be compute-safe:
 * - ideally these are <= 1.0 if you want “slice of demand” semantics strictly
 * - or, if you allow > 1.0, you are implicitly saying “baseline benchmark is conservative”
 */
function computeDistributionCapacityMultiplier(a: Required<Answers>, inferred: { seasonality: string; competition: string }): number {
    const goalKey = `${a.Q1}:${a.Q7}`;
    const goalMicroRaw = (MULTIPLIERS.goal_micro_adjust && MULTIPLIERS.goal_micro_adjust[goalKey]) ?? 1.0;

    return mulAll([
        { v: MULTIPLIERS.volume_bucket[a.Q3], label: `MULTIPLIERS.volume_bucket[${a.Q3}]` },
        { v: MULTIPLIERS.visual_strength[a.Q4], label: `MULTIPLIERS.visual_strength[${a.Q4}]` },
        { v: MULTIPLIERS.site_experience[a.Q5], label: `MULTIPLIERS.site_experience[${a.Q5}]` },
        { v: MULTIPLIERS.offer_clarity[a.Q6], label: `MULTIPLIERS.offer_clarity[${a.Q6}]` },
        { v: MULTIPLIERS.growth_mode[a.Q8], label: `MULTIPLIERS.growth_mode[${a.Q8}]` },
        { v: MULTIPLIERS.seasonality[inferred.seasonality], label: `MULTIPLIERS.seasonality[${inferred.seasonality}]` },
        { v: MULTIPLIERS.competition[inferred.competition], label: `MULTIPLIERS.competition[${inferred.competition}]` },
        { v: goalMicroRaw, label: `MULTIPLIERS.goal_micro_adjust[${goalKey}]` },
    ]);
}

// -----------------------------
// Product seller computations
// -----------------------------

function computeRevenueByAov(
    purchaseIntentVisitors: Range,
    crByAov: Record<AovBucket, Range01>,
    aovBuckets: Array<{ id: AovBucket; label: string; low: number; high: number }>
): Record<AovBucket, Range> {
    const out = {} as Record<AovBucket, Range>;

    for (const bucket of aovBuckets) {
        const id = bucket.id;
        const cr = crByAov[id];

        // Low = low visitors * low CR * low AOV
        const low = purchaseIntentVisitors.low * cr.low * bucket.low;

        // High = high visitors * high CR * high AOV
        const high = purchaseIntentVisitors.high * cr.high * bucket.high;

        out[id] = { low: roundInt(low), high: roundInt(high) };
    }

    return out;
}

// -----------------------------
// Public API
// -----------------------------

/**
 * Canonical compute (no lead required; lead gating handled by UI/flow).
 * - Validates answers per spec
 * - Applies benchmark (macro) + execution (micro)
 * - Returns new results bundle (v0.3 contract)
 */
export function computeResults(answers: Answers): ComputeResult {
    const v = validateAnswers(answers);
    if (!v.ok) return { ok: false, errors: v.errors };

    const a = answers as Required<Answers>;
    const row = getBenchmark(a.Q1, a.Q2);

    const inferred = {
        seasonality: row.inferred.seasonality,
        competition: row.inferred.competition,
    };

    const distribution_capacity_m = computeDistributionCapacityMultiplier(a, inferred);

    // -----------------------------
    // 1) Demand (macro + micro + final)
    // -----------------------------
    const addressable_niche_demand_est: Range = row.audience_base;
    const likely_slice_of_niche_demand_est: Range = applyRange(addressable_niche_demand_est, distribution_capacity_m);

    // -----------------------------
    // 2) Segment outcome (sessions / calls / revenue)
    // Benchmarks provide the base “monthly outcome” range for the segment+niche.
    // We apply the same micro multiplier to reflect execution capacity.
    // -----------------------------

    // Runtime contract checks without type fights:
    const benchOppType = row.opportunity.type as unknown;

    let segment_outcome: SegmentOutcome;

    if (a.Q1 === "content_creator") {
        if (benchOppType !== "sessions") {
            throw new Error(
                `Benchmark contract mismatch: content_creator expects opportunity.type="sessions", got "${String(
                    row.opportunity.type
                )}"`
            );
        }

        const baseSessions: Range = { low: row.opportunity.low, high: row.opportunity.high };
        segment_outcome = {
            kind: "content_creator",
            monthly_pinterest_sessions_est: applyRange(baseSessions, distribution_capacity_m),
        };
    } else if (a.Q1 === "service_provider") {
        if (benchOppType !== "calls") {
            throw new Error(
                `Benchmark contract mismatch: service_provider expects opportunity.type="calls", got "${String(
                    row.opportunity.type
                )}"`
            );
        }

        const baseCalls: Range = { low: row.opportunity.low, high: row.opportunity.high };
        segment_outcome = {
            kind: "service_provider",
            monthly_discovery_calls_est: applyRange(baseCalls, distribution_capacity_m),
        };
    } else {
        // product_seller
        if (benchOppType !== "sessions") {
            throw new Error(
                `Benchmark contract mismatch: product_seller expects opportunity.type="sessions", got "${String(
                    row.opportunity.type
                )}"`
            );
        }

        const baseSessions: Range = { low: row.opportunity.low, high: row.opportunity.high };
        const monthly_pinterest_sessions_est = applyRange(baseSessions, distribution_capacity_m);

        const monthly_purchase_intent_visitors_est = applyRate(monthly_pinterest_sessions_est, PURCHASE_INTENT_VISITOR_SHARE);

        const revenue_by_aov_est = computeRevenueByAov(
            monthly_purchase_intent_visitors_est,
            ECOM_CONVERSION_RATE_BY_AOV,
            AOV_BUCKETS
        );

        segment_outcome = {
            kind: "product_seller",
            monthly_pinterest_sessions_est,
            monthly_purchase_intent_visitors_est,
            revenue_by_aov_est,
            assumptions: {
                purchase_intent_share: PURCHASE_INTENT_VISITOR_SHARE,
                ecommerce_cr_by_aov: ECOM_CONVERSION_RATE_BY_AOV,
                aov_buckets: AOV_BUCKETS,
            },
        };
    }

    // -----------------------------
    // 3) Demographic context (kept benchmark-driven)
    // -----------------------------
    const demographics = {
        household_income_usd: row.income,
        notes: [
            "Context only: this does not predict your buyer income.",
            "Used to frame US+CA Pinterest audience demographics at a high level.",
        ],
    };

    return {
        ok: true,
        results: {
            demand: {
                addressable_niche_demand_est,
                distribution_capacity_m,
                likely_slice_of_niche_demand_est,
            },
            segment_outcome,
            demographics,
            inferred: {
                seasonality_index: row.inferred.seasonality,
                competition_index: row.inferred.competition,
                tags: row.inferred.tags,
            },
            insight_line: buildInsightFromBenchmark({ segment: a.Q1, niche: a.Q2 }),
        },
    };
}

/**
 * Convenience: throws on invalid answers (useful for UI that already step-validates).
 * Prefer `computeResults()` when you want explicit errors.
 */
export function computeResultsUnsafe(answers: Answers): ResultsBundle {
    const r = computeResults(answers);
    if (!r.ok) throw new Error(`Invalid answers: ${JSON.stringify(r.errors)}`);
    return r.results;
}
