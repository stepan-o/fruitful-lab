// frontend/lib/tools/pinterestPotential/compute.ts
// Sprint 1 — Deterministic compute engine for Pinterest Potential (source of truth)
// Sprint 5 — Results bundle (basic Outgrow-style outputs)
//
// IMPORTANT: This module is the canonical compute engine.
// - Spec requires checkbox questions (Q2/Q3/Q9) to store OPTION IDS in Answers.
// - This module translates IDs → option values per spec when computing.
// - Callers (Wizard/UI) should NOT re-implement compute logic locally.

import {
    Answers,
    Lead,
    validateAnswers,
    Q2 as SPEC_Q2,
    Q3 as SPEC_Q3,
    computeAvgHouseholdIncomeFromAnswers,
    computeAvgCartSizeFromAnswers,
} from "./pinterestPotentialSpec";

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
function sumCheckboxOptionValuesById(
    selectedIds: number[] | undefined,
    opts: { id: number; value: number }[]
): number {
    if (!Array.isArray(selectedIds) || selectedIds.length === 0) return 0;
    const valueById = new Map(opts.map((o) => [o.id, o.value] as const));
    const values = selectedIds
        .map((id) => valueById.get(id))
        .filter((v): v is number => typeof v === "number");
    return sum(values);
}

export function computeScore(answers: Required<Answers>): number {
    // Translate checkbox IDs → option values per spec
    const q2 = sumCheckboxOptionValuesById(answers.Q2, SPEC_Q2.options);
    const q3 = sumCheckboxOptionValuesById(answers.Q3, SPEC_Q3.options);

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

// Results 2/3 now sourced from canonical spec helpers (IDs-aware)

/**
 * Sprint 5: Compute all basic results.
 * - We treat computeScore output as "monthlyAudience" (Result 1)
 * - Results 2/3 derived from Q2/Q3
 */
export function computeResults(answers: Required<Answers>): ResultsBundle {
    const monthlyAudience = computeScore(answers);
    const avgHouseholdIncome = computeAvgHouseholdIncomeFromAnswers(answers);
    const avgCartSize = computeAvgCartSizeFromAnswers(answers);

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
