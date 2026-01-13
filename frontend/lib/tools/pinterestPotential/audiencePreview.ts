// frontend/lib/tools/pinterestPotential/audiencePreview.ts
import type { Range } from "./benchmarks";
import { getBenchmark } from "./benchmarks";
import type { NicheSlug, Segment } from "./pinterestPotentialSpec";

// Keep the same vocabulary your UI already uses:
export type AudiencePreviewLevel = "Focused" | "Medium" | "Broad";

/**
 * Convert the benchmark audience_base range into a stable preview tier.
 * This is the canonical source for Q2 “Audience: …” badges.
 *
 * Tune thresholds whenever you tune BENCHMARKS ranges.
 */
export function audiencePreviewFromRange(r: Range): AudiencePreviewLevel {
    // Use the HIGH end as “potential ceiling” signal (simple + stable).
    const high = r.high;

    // Example thresholds (tune to taste):
    if (high >= 20_000_000) return "Broad";
    if (high >= 10_000_000) return "Medium";
    return "Focused";
}

export function getAudiencePreviewLevel(segment: Segment, niche: NicheSlug): AudiencePreviewLevel {
    const row = getBenchmark(segment, niche);
    return audiencePreviewFromRange(row.audience_base);
}
