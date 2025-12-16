// frontend/lib/tools/pinterestPotential/compute.ts
// Sprint 1 — Deterministic compute engine for Pinterest Potential
// Sprint 5 — Results bundle (basic Outgrow-style outputs)

import { Answers, Lead, validateAnswers } from "./pinterestPotentialSpec";

export function sum(arr: number[]): number {
    return arr.reduce((acc, n) => acc + n, 0);
}

export function round(n: number, decimals: number): number {
    if (decimals === 0) return Math.round(n);
    const f = Math.pow(10, decimals);
    return Math.round(n * f) / f;
}

/**
 * Implements the exact documented formula from the spec:
 * round(
 *   sum(Q3) *
 *   sum(Q2) *
 *   Q1 *
 *   Q4 *
 *   Q5 *
 *   Q6 *
 *   (1.175 - 0.175 * Q7) *
 *   (1.15  - 0.15  * Q8),
 *   0
 * )
 */
export function computeScore(answers: Required<Answers>): number {
    const q2 = sum(answers.Q2);
    const q3 = sum(answers.Q3);

    const seasonalFactor = 1.175 - 0.175 * answers.Q7; // Q7 in [1..5]
    const competitionFactor = 1.15 - 0.15 * answers.Q8; // Q8 in [1..5]

    const result =
        q3 *
        q2 *
        answers.Q1 *
        answers.Q4 *
        answers.Q5 *
        answers.Q6 *
        seasonalFactor *
        competitionFactor;

    return round(result, 0);
}

/**
 * Sprint 5: Basic results bundle (Outgrow-parity, but streamlined/ballpark ok).
 */
export type ResultsBundle = {
    monthlyAudience: number;      // Result 1
    avgHouseholdIncome: number;   // Result 2
    avgCartSize: number;          // Result 3
};

type ComputeOk = { ok: true; score: number; results: ResultsBundle };
type ComputeErr = { ok: false; errors: Record<string, string> };
export type ComputeResult = ComputeOk | ComputeErr;

/**
 * Result 2 (Income): Outgrow mapping (ported into a table).
 * In Outgrow Q2 looked single-select; in our UI it’s multi-select.
 * We support multi-select by averaging the selected regions’ incomes.
 */
const REGION_INCOME: Record<number, number> = {
    141000000: 30000, // Global
    27000000: 75000,  // USA
    28000000: 70000,  // (Outgrow had this; not currently in our spec)
    59000000: 60000,  // (Outgrow had this; not currently in our spec)
    31000000: 45000,  // Europe
    19000000: 15000,  // Latin America
    3000000: 20000,   // (Outgrow had this; not currently in our spec)
    // Fallthrough handled below
};

function computeAvgHouseholdIncome(q2Regions: number[] | undefined): number {
    if (!Array.isArray(q2Regions) || q2Regions.length === 0) return 30000;
    const incomes = q2Regions.map((v) => REGION_INCOME[v] ?? 30000);
    const avg = sum(incomes) / Math.max(1, incomes.length);
    return round(avg, 0);
}

/**
 * Result 3 (Avg cart size): streamlined port of Outgrow logic.
 *
 * Outgrow formula (simplified):
 * baseAvg = sum(per-category cart value for selected) / count(selected)
 * regionMultiplier = depends on Q2 region selection
 * final = round(baseAvg * regionMultiplier * 1.20, 0)
 *
 * Note: Our Q3 option "value" is a *weight* and has duplicates (0.08 appears twice),
 * so we can’t perfectly infer which of the two 0.08 categories was selected.
 * Ballpark approach:
 * - Map weight -> typical cart value
 * - For ambiguous duplicates (0.08), use an averaged cart value.
 */
const Q3_WEIGHT_TO_CART_VALUE: Record<number, number> = {
    0.20: 500, // Nursery & Home
    0.18: 600, // Travel & Mobility
    0.17: 160, // Clothing & Accessories
    0.15: 200, // Toys...
    0.10: 140, // Feeding & Care
    0.07: 120, // Bath & Changing
    0.08: 370, // Ambiguous: average of (240, 500) to stay in ballpark
};

const REGION_CART_MULTIPLIER: Record<number, number> = {
    27000000: 1.15, // USA
    28000000: 1.10, // Outgrow legacy
    59000000: 1.05, // Outgrow legacy
    31000000: 0.95, // Europe
    19000000: 0.85, // Latin America
    3000000: 0.90,  // Outgrow legacy
    // default 1.00
};

function computeRegionCartMultiplier(q2Regions: number[] | undefined): number {
    if (!Array.isArray(q2Regions) || q2Regions.length === 0) return 1.0;
    // Multi-select: choose the "strongest" (highest) multiplier to stay optimistic / ballpark.
    const mults = q2Regions.map((v) => REGION_CART_MULTIPLIER[v] ?? 1.0);
    return Math.max(1.0, ...mults);
}

function computeAvgCartSize(q3Weights: number[] | undefined, q2Regions: number[] | undefined): number {
    if (!Array.isArray(q3Weights) || q3Weights.length === 0) return 0;

    const cartVals = q3Weights.map((w) => Q3_WEIGHT_TO_CART_VALUE[w] ?? 200);
    const baseAvg = sum(cartVals) / Math.max(1, cartVals.length);

    const regionMult = computeRegionCartMultiplier(q2Regions);
    const final = baseAvg * regionMult * 1.2;

    return round(final, 0);
}

/**
 * Sprint 5: Compute all basic results.
 * - We treat computeScore output as "monthlyAudience" (Result 1)
 * - Results 2/3 derived from Q2/Q3
 */
export function computeResults(answers: Required<Answers>): ResultsBundle {
    const monthlyAudience = computeScore(answers);
    const avgHouseholdIncome = computeAvgHouseholdIncome(answers.Q2);
    const avgCartSize = computeAvgCartSize(answers.Q3, answers.Q2);

    return {
        monthlyAudience,
        avgHouseholdIncome,
        avgCartSize,
    };
}

/**
 * Validates using the Sprint 0 spec; only computes when valid.
 * NOTE: This path expects lead when your spec requires it (gate_before_results).
 * Optional/skip lead modes should compute via computeScore/computeResults directly.
 */
export function computeResult(answers: Answers, lead?: Lead): ComputeResult {
    const validation = validateAnswers(answers, lead);
    if (!validation.ok) {
        return { ok: false, errors: validation.errors };
    }

    // TypeScript: after validation, values should be present. Cast to Required<Answers>.
    const a = answers as Required<Answers>;
    const results = computeResults(a);

    // Keep existing field name for backward compatibility with Wizard usage.
    return { ok: true, score: results.monthlyAudience, results };
}
