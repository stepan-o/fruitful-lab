// frontend/lib/tools/pinterestPotential/compute.ts
// Sprint 1 — Deterministic compute engine for Pinterest Potential

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

export type ComputeOk = { ok: true; score: number };
export type ComputeErr = { ok: false; errors: Record<string, string> };
export type ComputeResult = ComputeOk | ComputeErr;

/**
 * Validates using the Sprint 0 spec; only computes when valid.
 */
export function computeResult(answers: Answers, lead?: Lead): ComputeResult {
  const validation = validateAnswers(answers, lead);
  if (!validation.ok) {
    return { ok: false, errors: validation.errors };
  }

  // TypeScript: after validation, values should be present. Cast to Required<Answers>.
  const a = answers as Required<Answers>;
  const score = computeScore(a);
  return { ok: true, score };
}
