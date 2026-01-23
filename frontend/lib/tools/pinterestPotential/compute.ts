// frontend/lib/tools/pinterestPotential/compute.ts
/**
 * v1.1 (Locked) — Canonical compute engine (config-driven, range outputs)
 *
 * NEW CONTRACT (NO BACKWARDS COMPATIBILITY):
 *
 * 1) Demand is modeled in SESSIONS (not users).
 *    - demand_base_sessions_est (MACRO):
 *        Comes directly from benchmarks.ts (segment+niche slice of US+CA demand).
 *        No execution multipliers are applied to this number.
 *
 *    - distribution_capacity_m (MICRO):
 *        A single multiplier derived from Q3/Q4/Q8 + inferred indices (seasonality/competition)
 *        + optional goal micro-adjust (explicitly keyed; no defaults).
 *
 *    - likely_pinterest_sessions_est (FINAL):
 *        demand_base_sessions_est * distribution_capacity_m
 *
 * 2) Post-click outcomes use a separate micro layer:
 *    - conversion_readiness_m (MICRO):
 *        Derived from Q5/Q6 (site experience + offer clarity).
 *
 * 3) Segment outcomes:
 *    - content_creator: monthly Pinterest sessions range
 *    - product_seller: monthly sessions + purchase-intent sessions + revenue potential by AOV bucket
 *    - service_provider: monthly discovery calls range (from sessions * booking-rate * conversion readiness)
 *
 * Hard rules:
 * - 0 fallbacks, 0 defaults, 0 optional imports.
 * - Missing config must fail immediately (compile-time preferred; runtime only for dynamic keys).
 * - Lead gating is NOT handled here.
 */

import type { Answers } from "./pinterestPotentialSpec";
import { validateAnswers } from "./pinterestPotentialSpec";
import type { GoalKey } from "./pinterestPotentialSpec";
import { getBenchmark, type Range, type IndexLevel } from "./benchmarks";
import { buildInsightFromBenchmark } from "./insight";

import {
    AOV_BUCKETS,
    DISCOVERY_CALL_BOOK_RATE_FROM_SESSIONS,
    ECOM_CONVERSION_RATE_BY_AOV,
    MULTIPLIERS,
    PURCHASE_INTENT_SHARE_OF_SESSIONS,
    type AovBucket,
    type Range01,
} from "./multipliers";

export type DemandBundle = {
    /** Macro: niche demand slice in SESSIONS/month (no execution applied). */
    demand_base_sessions_est: Range;

    /** Micro: execution/distribution capacity derived from Q3/Q4/Q8 + inferred indices + goal micro-adjust. */
    distribution_capacity_m: number;

    /** Micro: post-click readiness derived from Q5/Q6. */
    conversion_readiness_m: number;

    /** Final: your likely Pinterest sessions (macro * distribution capacity). */
    likely_pinterest_sessions_est: Range;
};

export type SegmentOutcome =
    | {
    kind: "content_creator";
    monthly_pinterest_sessions_est: Range;
}
    | {
    kind: "service_provider";
    monthly_discovery_calls_est: Range;
    assumptions: {
        call_book_rate_from_sessions: Range01;
        conversion_readiness_m: number;
    };
}
    | {
    kind: "product_seller";
    monthly_pinterest_sessions_est: Range;
    monthly_purchase_intent_sessions_est: Range;

    /**
     * Revenue potential by AOV bucket:
     * purchase_intent_sessions * ecommerce_cr_by_aov * conversion_readiness_m * aov_range
     */
    revenue_by_aov_est: Record<AovBucket, Range>;

    /** Assumptions surfaced for explainability on the results page. */
    assumptions: {
        purchase_intent_share_of_sessions: Range01;
        ecommerce_cr_by_aov: Record<AovBucket, Range01>;
        aov_buckets: ReadonlyArray<{ id: AovBucket; label: string; low: number; high: number }>;
        conversion_readiness_m: number;
    };
};

export type ResultsBundle = {
    demand: DemandBundle;

    segment_outcome: SegmentOutcome;

    /** Non-niche-specific demographic context (benchmark-driven). */
    demographics: {
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

function applyRateAndScalar(r: Range, rate: Range01, scalar: number): Range {
    return { low: roundInt(r.low * rate.low * scalar), high: roundInt(r.high * rate.high * scalar) };
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
// Core multiplier logic (NO CLAMPS / NO DEFAULTS)
// -----------------------------

function mustGoalKey(a: Required<Answers>): GoalKey {
    const k = `${a.Q1}:${a.Q7}` as GoalKey;
    // Fail loud if spec and multipliers diverge.
    if (!(k in MULTIPLIERS.goal_micro_adjust)) {
        throw new Error(`Missing goal micro-adjust for key "${k}"`);
    }
    return k;
}

/**
 * distribution_capacity_m (MICRO)
 * - Q3 (volume) * Q4 (visual strength) * Q8 (growth mode)
 * - lightly adjusted by inferred indices (seasonality/competition)
 * - optionally adjusted by goal_micro_adjust (explicit keys only)
 */
function computeDistributionCapacityMultiplier(
    a: Required<Answers>,
    inferred: { seasonality: IndexLevel; competition: IndexLevel }
): number {
    const goalKey = mustGoalKey(a);
    const goalMicro = MULTIPLIERS.goal_micro_adjust[goalKey];

    return mulAll([
        { v: MULTIPLIERS.volume_bucket[a.Q3], label: `MULTIPLIERS.volume_bucket[${a.Q3}]` },
        { v: MULTIPLIERS.visual_strength[a.Q4], label: `MULTIPLIERS.visual_strength[${a.Q4}]` },
        { v: MULTIPLIERS.growth_mode[a.Q8], label: `MULTIPLIERS.growth_mode[${a.Q8}]` },
        { v: MULTIPLIERS.seasonality[inferred.seasonality], label: `MULTIPLIERS.seasonality[${inferred.seasonality}]` },
        { v: MULTIPLIERS.competition[inferred.competition], label: `MULTIPLIERS.competition[${inferred.competition}]` },
        { v: goalMicro, label: `MULTIPLIERS.goal_micro_adjust[${goalKey}]` },
    ]);
}

/**
 * conversion_readiness_m (MICRO)
 * - Q5 (site experience) * Q6 (offer clarity)
 */
function computeConversionReadinessMultiplier(a: Required<Answers>): number {
    return mulAll([
        { v: MULTIPLIERS.site_experience[a.Q5], label: `MULTIPLIERS.site_experience[${a.Q5}]` },
        { v: MULTIPLIERS.offer_clarity[a.Q6], label: `MULTIPLIERS.offer_clarity[${a.Q6}]` },
    ]);
}

// -----------------------------
// Product seller computations
// -----------------------------

function computeRevenueByAov(
    purchaseIntentSessions: Range,
    conversionReadinessM: number
): Record<AovBucket, Range> {
    const out = {} as Record<AovBucket, Range>;

    for (const bucket of AOV_BUCKETS) {
        const id = bucket.id;
        const cr = ECOM_CONVERSION_RATE_BY_AOV[id];

        // Low = low sessions * low CR * conversion readiness * low AOV
        const low = purchaseIntentSessions.low * cr.low * conversionReadinessM * bucket.low;

        // High = high sessions * high CR * conversion readiness * high AOV
        const high = purchaseIntentSessions.high * cr.high * conversionReadinessM * bucket.high;

        out[id] = { low: roundInt(low), high: roundInt(high) };
    }

    return out;
}

// -----------------------------
// Public API
// -----------------------------

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
    const conversion_readiness_m = computeConversionReadinessMultiplier(a);

    // -----------------------------
    // 1) Demand (macro + micro + final) — SESSIONS
    // -----------------------------
    const demand_base_sessions_est: Range = row.demand_base_sessions;
    const likely_pinterest_sessions_est: Range = applyRange(demand_base_sessions_est, distribution_capacity_m);

    // -----------------------------
    // 2) Segment outcomes
    // -----------------------------
    let segment_outcome: SegmentOutcome;

    if (a.Q1 === "content_creator") {
        segment_outcome = {
            kind: "content_creator",
            monthly_pinterest_sessions_est: likely_pinterest_sessions_est,
        };
    } else if (a.Q1 === "product_seller") {
        const monthly_purchase_intent_sessions_est = applyRate(
            likely_pinterest_sessions_est,
            PURCHASE_INTENT_SHARE_OF_SESSIONS
        );

        const revenue_by_aov_est = computeRevenueByAov(monthly_purchase_intent_sessions_est, conversion_readiness_m);

        segment_outcome = {
            kind: "product_seller",
            monthly_pinterest_sessions_est: likely_pinterest_sessions_est,
            monthly_purchase_intent_sessions_est,
            revenue_by_aov_est,
            assumptions: {
                purchase_intent_share_of_sessions: PURCHASE_INTENT_SHARE_OF_SESSIONS,
                ecommerce_cr_by_aov: ECOM_CONVERSION_RATE_BY_AOV,
                aov_buckets: AOV_BUCKETS,
                conversion_readiness_m,
            },
        };
    } else {
        // service_provider
        const monthly_discovery_calls_est = applyRateAndScalar(
            likely_pinterest_sessions_est,
            DISCOVERY_CALL_BOOK_RATE_FROM_SESSIONS,
            conversion_readiness_m
        );

        segment_outcome = {
            kind: "service_provider",
            monthly_discovery_calls_est,
            assumptions: {
                call_book_rate_from_sessions: DISCOVERY_CALL_BOOK_RATE_FROM_SESSIONS,
                conversion_readiness_m,
            },
        };
    }

    // -----------------------------
    // 3) Demographic context (benchmark-driven)
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
                demand_base_sessions_est,
                distribution_capacity_m,
                conversion_readiness_m,
                likely_pinterest_sessions_est,
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

export function computeResultsUnsafe(answers: Answers): ResultsBundle {
    const r = computeResults(answers);
    if (!r.ok) throw new Error(`Invalid answers: ${JSON.stringify(r.errors)}`);
    return r.results;
}
