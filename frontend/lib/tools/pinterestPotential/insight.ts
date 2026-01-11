// frontend/lib/tools/pinterestPotential/insight.ts
/**
 * v0.2 (Locked) — Insight line generator
 * Produces a short, planning-advantage framed insight based on inferred indices.
 *
 * Rules:
 * - Max 1–2 lines (we keep it to one sentence by default).
 * - Not negative; framed as an advantage (“plan early”, “refresh creative”, etc.).
 * - Powered by inferred indices stored on the benchmark row.
 */

import type { NicheSlug, Segment } from "./pinterestPotentialSpec";
import { getBenchmark, type IndexLevel } from "./benchmarks";

export type InsightInput = {
    segment: Segment;
    niche: NicheSlug;
    seasonality: IndexLevel;
    competition: IndexLevel;
};

function phraseSeasonality(level: IndexLevel): string {
    if (level === "high") return "highly seasonal";
    if (level === "medium") return "moderately seasonal";
    return "low seasonality";
}

function phraseCompetition(level: IndexLevel): string {
    if (level === "high") return "highly competitive";
    if (level === "medium") return "moderately competitive";
    return "lower competition";
}

function actionForSeasonality(level: IndexLevel): string {
    if (level === "high") return "plan content early to catch demand before it peaks";
    if (level === "medium") return "use a simple calendar to publish ahead of your mini-peaks";
    return "stay consistent—steady publishing compounds over time";
}

function actionForCompetition(level: IndexLevel): string {
    if (level === "high") return "refresh creative angles and tighten keywords to stand out";
    if (level === "medium") return "test 2–3 creative angles per URL to find your winners";
    return "lean into clarity—simple visuals and strong CTAs can win quickly";
}

/**
 * Primary generator for the Results “Insight:” line.
 * If benchmark notes exist, prefer them (more niche-specific).
 */
export function buildInsightLine(input: InsightInput): string | null {
    // If both indices are medium, we can choose to omit insight to keep results minimal.
    // But spec says "recommended"; returning a line is fine either way.
    const row = getBenchmark(input.segment, input.niche);

    const seasonalNote = row.inferred.notes?.seasonality;
    const compNote = row.inferred.notes?.competition;

    // Prefer a combined insight when both are “high”
    if (input.seasonality === "high" && input.competition === "high") {
        const a = seasonalNote ?? "This niche has predictable planning spikes.";
        const b = compNote ?? "It’s competitive—creative variety and SEO matter.";
        // Keep it short: stitch into one sentence.
        return `Insight: ${a} ${b}`.replace(/\s+/g, " ").trim();
    }

    // Otherwise use a compact, action-forward template
    const seasonalityPart = phraseSeasonality(input.seasonality);
    const competitionPart = phraseCompetition(input.competition);

    const actionA = actionForSeasonality(input.seasonality);
    const actionB = actionForCompetition(input.competition);

    return `Insight: ${seasonalityPart} and ${competitionPart}—${actionA}, and ${actionB}.`;
}

/**
 * Convenience helper: compute can call this using segment+niche
 * without separately threading notes.
 */
export function buildInsightFromBenchmark(params: { segment: Segment; niche: NicheSlug }): string | null {
    const row = getBenchmark(params.segment, params.niche);
    return buildInsightLine({
        segment: params.segment,
        niche: params.niche,
        seasonality: row.inferred.seasonality,
        competition: row.inferred.competition,
    });
}