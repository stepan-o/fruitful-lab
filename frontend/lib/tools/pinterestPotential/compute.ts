// frontend/lib/tools/pinterestPotential/compute.ts
// v0.2 (Locked) — Canonical compute engine (config-driven, range outputs)
//
// Spec compliance:
// - Q1–Q8 only (slug-based answers)
// - Results are ranges (avoid false precision)
// - Benchmarks are keyed by segment + niche
// - Multipliers are config-driven + subtle (ENFORCED via softening + clamps)
// - Inferred seasonality + competition come from benchmark row (not asked)
// - Lead gating is NOT handled here (compute must work pre-email)

import type { Answers } from "./pinterestPotentialSpec";
import { validateAnswers } from "./pinterestPotentialSpec";
import { getBenchmark, type Range, type OpportunityType } from "./benchmarks";
import {
    MULTIPLIERS,
    MULTIPLIER_INTENSITY,
    safeMultiplier,
    softenMultiplier,
} from "./multipliers";
import { buildInsightFromBenchmark } from "./insight";

export type ResultsBundle = {
    /** Card 1 */
    audience_est: Range;

    /** Card 2 (segment-dependent via benchmark row) */
    opportunity_est: { type: OpportunityType; low: number; high: number };

    /** Card 3 */
    income_est: Range;

    /** Required telemetry dimensions + optional tags for future sequencing */
    inferred: {
        seasonality_index: "low" | "medium" | "high";
        competition_index: "low" | "medium" | "high";
        tags?: string[];
    };

    /** Optional 1–2 line planning-advantage insight */
    insight_line?: string | null;
};

type ComputeOk = { ok: true; results: ResultsBundle };
type ComputeErr = { ok: false; errors: Record<string, string> };
export type ComputeResult = ComputeOk | ComputeErr;

function clamp(n: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, n));
}

function roundInt(n: number): number {
    return Math.round(n);
}

function applyRange(r: Range, m: number): Range {
    return { low: roundInt(r.low * m), high: roundInt(r.high * m) };
}

function mulSoft(values: number[], strength: number): number {
    // Soften each factor toward 1.0, then multiply.
    return values.reduce((acc, raw) => acc * softenMultiplier(raw, strength), 1.0);
}

/**
 * Audience: keep subtle; primarily driven by volume + visuals + site.
 * We intentionally do NOT apply seasonality/competition here (spec suggests it's optional).
 */
function computeAudienceMultiplier(a: Required<Answers>): number {
    const rawFactors = [
        MULTIPLIERS.volume_bucket[a.Q3],
        MULTIPLIERS.visual_strength[a.Q4],
        MULTIPLIERS.site_experience[a.Q5],
    ];

    const m = mulSoft(rawFactors, MULTIPLIER_INTENSITY.audience);

    // Subtle band (≈ ±15%).
    return clamp(m, 0.85, 1.15);
}

function computeOpportunityMultiplier(
    a: Required<Answers>,
    inferred: { seasonality: "low" | "medium" | "high"; competition: "low" | "medium" | "high" }
): number {
    const rawFactors = [
        MULTIPLIERS.volume_bucket[a.Q3],
        MULTIPLIERS.visual_strength[a.Q4],
        MULTIPLIERS.site_experience[a.Q5],
        MULTIPLIERS.offer_clarity[a.Q6],
        MULTIPLIERS.growth_mode[a.Q8],
        MULTIPLIERS.seasonality[inferred.seasonality],
        MULTIPLIERS.competition[inferred.competition],
    ];

    const base = mulSoft(rawFactors, MULTIPLIER_INTENSITY.opportunity);

    // Optional tiny goal-based adjustment (kept tiny by default; also softened)
    const goalKey = `${a.Q1}:${a.Q7}`;
    const goalRaw = safeMultiplier(MULTIPLIERS.goal_micro_adjust ?? {}, goalKey, 1.0);
    const goalMicro = softenMultiplier(goalRaw, MULTIPLIER_INTENSITY.goal_micro);

    // Subtle band (slightly wider than audience because opportunity includes more factors).
    return clamp(base * goalMicro, 0.80, 1.20);
}

function computeIncomeMultiplier(_a: Required<Answers>): number {
    // v0.2: keep income benchmark-driven (no fake precision).
    return 1.0;
}

/**
 * Canonical compute (no lead required; lead gating is handled by the flow/UI).
 * - Validates answers per spec
 * - Applies benchmark + multipliers
 * - Returns range outputs + inferred indices + optional insight line
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

    const audM = computeAudienceMultiplier(a);
    const oppM = computeOpportunityMultiplier(a, inferred);
    const incM = computeIncomeMultiplier(a);

    const audience_est = applyRange(row.audience_base, audM);
    const income_est = applyRange(row.income, incM);

    const opportunity_est = {
        type: row.opportunity.type,
        low: roundInt(row.opportunity.low * oppM),
        high: roundInt(row.opportunity.high * oppM),
    };

    return {
        ok: true,
        results: {
            audience_est,
            opportunity_est,
            income_est,
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
