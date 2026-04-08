// frontend/lib/tools/pinterestPotential/insight.ts
/**
 * v0.2 (Locked) — Insight line generator
 * Produces a short, planning-advantage framed insight based on inferred indices.
 *
 * Rules:
 * - Max 1–2 lines on mobile (enforced via conservative length cap).
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

const MAX_CHARS = 140; // conservative to stay ~1–2 lines on mobile

function clampText(s: string, max = MAX_CHARS): string {
    const t = s.replace(/\s+/g, " ").trim();
    if (t.length <= max) return t;
    // Trim to last "nice" breakpoint
    const cut = t.slice(0, max - 1);
    const i = Math.max(cut.lastIndexOf("."), cut.lastIndexOf(";"), cut.lastIndexOf(","), cut.lastIndexOf(" "));
    const out = (i > 40 ? cut.slice(0, i) : cut).trim();
    return `${out}…`;
}

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
    if (level === "medium") return "publish a bit ahead of predictable mini-peaks";
    return "stay consistent—steady publishing compounds";
}

function actionForCompetition(level: IndexLevel): string {
    if (level === "high") return "refresh creative angles and tighten keywords to stand out";
    if (level === "medium") return "test 2–3 creative angles to find your winners";
    return "lean into clarity—simple visuals and strong CTAs can win quickly";
}

function pickPrimaryAction(input: InsightInput): string {
    // If either index is high, prioritize the "high" action.
    if (input.competition === "high" && input.seasonality !== "high") return actionForCompetition(input.competition);
    if (input.seasonality === "high" && input.competition !== "high") return actionForSeasonality(input.seasonality);

    // If both high: special-cased elsewhere.
    // Otherwise: prefer seasonality as the planning-oriented action.
    return actionForSeasonality(input.seasonality);
}

/**
 * Primary generator for the Results “Insight:” line.
 * If benchmark notes exist, prefer them (more niche-specific), but keep them short.
 */
export function buildInsightLine(input: InsightInput): string | null {
    const row = getBenchmark(input.segment, input.niche);

    const seasonalNote = row.inferred.notes?.seasonality;
    const compNote = row.inferred.notes?.competition;

    // If both indices are medium, we can choose to omit insight (spec says "recommended", not required).
    // Keeping it: it still adds value, but stays short.
    // If you want to omit, uncomment below:
    // if (input.seasonality === "medium" && input.competition === "medium") return null;

    // Prefer combined note when both are high (but cap length).
    if (input.seasonality === "high" && input.competition === "high") {
        const a = seasonalNote ?? "Predictable planning spikes.";
        const b = compNote ?? "Competitive—creative variety and SEO matter.";
        return clampText(`Insight: ${a} ${b}`);
    }

    // Otherwise: describe both indices, but give only ONE action (keeps it short).
    const s = phraseSeasonality(input.seasonality);
    const c = phraseCompetition(input.competition);
    const action = pickPrimaryAction(input);

    // Use notes if present, but only one (shorter).
    const note =
        input.seasonality === "high"
            ? seasonalNote
            : input.competition === "high"
                ? compNote
                : undefined;

    if (note) {
        return clampText(`Insight: ${note}`);
    }

    return clampText(`Insight: ${s} and ${c}—${action}.`);
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
