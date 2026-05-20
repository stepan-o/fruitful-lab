// frontend/lib/tools/pinterestPotential/nicheUiAdapter.ts
/**
 * Pinterest Potential — Spec → UI Adapter (Q2 Niche enrichment)
 *
 * v1.1 alignment (2026-01-23):
 * - Benchmarks no longer expose "audience_base". Canonical macro unit is SESSIONS:
 *   `BenchmarkRow.demand_base_sessions` (range).
 * - Q2 badges must be derived from demand_base_sessions (not invented in UI).
 *
 * Invariants:
 * - Spec remains canonical source of truth for IDs + labels + ordering.
 * - This adapter enriches spec options with UI-only metadata (includes, keywords, icon keys, badges, helper copy),
 *   and surfaces benchmark-derived signals for UI consumption.
 * - UI components (Q2Niche, BottomSheet usage) must not invent niche logic.
 *
 * Dependencies allowed:
 * - Spec (types + getNicheOptions)
 * - Benchmarks (for demand preview tiers + income + inferred indices)
 *
 * Forbidden:
 * - Spec importing this module
 * - This module importing UI step components
 * - This module importing Lucide/React icon components (UI maps iconKey → icon component)
 */

import type { BenchmarkRow, IndexLevel, Range } from "./benchmarks";
import { getBenchmark, PRACTICAL_SESSIONS_USCA_POOL } from "./benchmarks";
import type { NicheSlug, Segment } from "./pinterestPotentialSpec";
import { getNicheOptions } from "./pinterestPotentialSpec";

// -----------------------------
// Demand preview (Q2 badges)
// -----------------------------

export type DemandPreviewLevel = "Focused" | "Medium" | "Broad";

export type DemandPreviewMeta = {
    /** What the UI badge displays after “Demand:” (or equivalent label). */
    badgeLabel: string;
    /** Tooltip/help copy shown to the user. */
    helperCopy: string;
};

export const DEMAND_PREVIEW_META: Record<DemandPreviewLevel, DemandPreviewMeta> = {
    Focused: {
        badgeLabel: "Focused",
        helperCopy: "Smaller monthly demand → easier to stand out, but less total volume.",
    },
    Medium: {
        badgeLabel: "Balanced",
        helperCopy: "Balanced monthly demand → good mix of volume + focus.",
    },
    Broad: {
        badgeLabel: "Huge",
        helperCopy: "Big monthly demand → more upside, and usually more competition.",
    },
};

/**
 * Thresholds derive from the macro US/CA practical session pool,
 * so tiers stay stable if we tune the macro anchors.
 *
 * Rule: tiering uses HIGH end of the range as a ceiling signal (preview only).
 */
export const DEMAND_PREVIEW_THRESHOLDS = {
    // ~20% of macro pool = "Broad"
    broad_min_high: Math.round(PRACTICAL_SESSIONS_USCA_POOL * 0.2),
    // ~7% of macro pool = "Medium"
    medium_min_high: Math.round(PRACTICAL_SESSIONS_USCA_POOL * 0.07),
} as const;

/**
 * Convert benchmark demand range (sessions/month) into a stable preview tier.
 * Canonical for Q2 badges.
 */
export function demandPreviewFromSessionsRange(r: Range): DemandPreviewLevel {
    const high = r.high;
    if (high >= DEMAND_PREVIEW_THRESHOLDS.broad_min_high) return "Broad";
    if (high >= DEMAND_PREVIEW_THRESHOLDS.medium_min_high) return "Medium";
    return "Focused";
}

export function getDemandPreviewLevel(segment: Segment, niche: NicheSlug): DemandPreviewLevel {
    const row = getBenchmark(segment, niche);
    return demandPreviewFromSessionsRange(row.demand_base_sessions);
}

// -----------------------------
// Segment hint copy
// -----------------------------

export function getSegmentHint(seg: Segment): string {
    if (seg === "content_creator") return "Pick what you publish about most.";
    if (seg === "product_seller") return "Pick the category you sell into.";
    return "Pick the industry you serve.";
}

// -----------------------------
// Benchmark UI payload (single source for Q2)
// -----------------------------

export type NicheBenchmarkUi = {
    demand_base_sessions: Range;
    demand_preview: {
        level: DemandPreviewLevel;
        badgeLabel: string;
        helperCopy: string;
    };
    income: Range;
    inferred: {
        seasonality: IndexLevel;
        competition: IndexLevel;
        notes?: Partial<Record<"seasonality" | "competition", string>>;
        tags?: string[];
    };
};

export function getNicheBenchmarkUi(segment: Segment, niche: NicheSlug): NicheBenchmarkUi {
    const row = getBenchmark(segment, niche);
    const level = demandPreviewFromSessionsRange(row.demand_base_sessions);
    const meta = DEMAND_PREVIEW_META[level];

    return {
        demand_base_sessions: row.demand_base_sessions,
        demand_preview: {
            level,
            badgeLabel: meta.badgeLabel,
            helperCopy: meta.helperCopy,
        },
        income: row.income,
        inferred: row.inferred,
    };
}

// -----------------------------
// Q2 UI option shape (adapter output)
// -----------------------------

/**
 * Q2 UI option shape expected by the Q2 step.
 * - `id` is the canonical niche slug
 * - `iconKey` is a stable string identifier (UI maps this to a Lucide icon component)
 * - `benchmark` is the canonical (benchmarks-derived) signal bundle for Q2 UI
 */
export type NicheUiOption = {
    id: NicheSlug;
    label: string;
    includes?: string;
    keywords?: string[];
    iconKey: string;
    benchmark: NicheBenchmarkUi;
};

type NicheMeta = {
    includes?: string;
    keywords?: string[];
};

/**
 * UI-only niche metadata (includes + keywords) keyed by segment+niche.
 * IMPORTANT: labels + order come from spec; only enrichment lives here.
 */
const NICHE_META: Record<Segment, Partial<Record<NicheSlug, NicheMeta>>> = {
    content_creator: {
        food: { includes: "recipes, meal prep, baking", keywords: ["cooking", "baking", "meal prep"] },
        travel: { includes: "guides, itineraries, tips", keywords: ["itinerary", "guide", "destinations"] },
        home_diy: { includes: "decor, projects, renovation", keywords: ["decor", "renovation", "projects"] },
        lifestyle: { includes: "habits, routines, ideas", keywords: ["routine", "habits", "aesthetic"] },
        wellness: { includes: "fitness, self-care, wellness", keywords: ["fitness", "mindfulness", "self care"] },
        parenting: { includes: "kids, baby, family life", keywords: ["kids", "baby", "family"] },
        beauty_fashion: { includes: "outfits, makeup, style", keywords: ["outfits", "makeup", "style"] },
        finance: { includes: "budgeting, saving, planning", keywords: ["budget", "saving", "investing"] },
        crafts: { includes: "DIY crafts, printables, handmade", keywords: ["printables", "crochet", "handmade"] },
        other: { includes: "your specific topic", keywords: ["misc"] },
    },
    product_seller: {
        baby_family: { includes: "nursery, registry, kids", keywords: ["nursery", "baby registry"] },
        home_decor: { includes: "decor, furniture, styling", keywords: ["interior", "furniture", "decor"] },
        beauty: { includes: "skincare, hair, makeup", keywords: ["skincare", "makeup", "hair"] },
        fashion: { includes: "apparel, jewelry, bags", keywords: ["jewelry", "bags", "outfits"] },
        wellness: { includes: "wellbeing, lifestyle, products", keywords: ["supplements", "wellbeing"] },
        food_bev: { includes: "snacks, coffee, pantry", keywords: ["snacks", "coffee", "tea"] },
        pets: { includes: "pet care, accessories, treats", keywords: ["dog", "cat", "pet care"] },
        digital_crafts: { includes: "templates, downloads, DIY", keywords: ["templates", "svg", "download"] },
        travel_gear: { includes: "packing, luggage, gear", keywords: ["luggage", "packing"] },
        other: { includes: "your specific category", keywords: ["misc"] },
    },
    service_provider: {
        coach: { includes: "offers, programs, advice", keywords: ["business coach", "mentor"] },
        designer: { includes: "brand, web, visuals", keywords: ["brand", "web", "graphic"] },
        educator: { includes: "courses, teaching, training", keywords: ["course", "teacher"] },
        wellness_practitioner: { includes: "therapy, yoga, healing", keywords: ["therapist", "healer", "yoga"] },
        agency: { includes: "strategy, creative, campaigns", keywords: ["studio", "marketing", "creative"] },
        photo_video: { includes: "photo, video, content", keywords: ["photo", "video", "content"] },
        real_estate_home: { includes: "realtor, staging, home", keywords: ["realtor", "staging", "home"] },
        events: { includes: "weddings, planning, events", keywords: ["wedding", "planner"] },
        finance: { includes: "accounting, bookkeeping", keywords: ["accounting", "bookkeeping"] },
        other: { includes: "your specific service", keywords: ["misc"] },
    },
};

/**
 * Canonical icon key mapping (moved out of UI).
 * NOTE: These keys must match the ICONS map in Q2Niche.tsx (or whatever replaces it).
 */
export function getNicheIconKey(segment: Segment, niche: NicheSlug): string {
    // common
    if (niche === "other") return "Shapes";
    if (niche === "wellness") return "HeartPulse";

    // finance appears in multiple segments.
    // Use PiggyBank generally, but Calculator for service_provider.
    if (niche === "finance") return segment === "service_provider" ? "Calculator" : "PiggyBank";

    if (segment === "content_creator") {
        if (niche === "food") return "Utensils";
        if (niche === "travel") return "Plane";
        if (niche === "home_diy") return "Hammer";
        if (niche === "lifestyle") return "Sparkles";
        if (niche === "parenting") return "Baby";
        if (niche === "beauty_fashion") return "Shirt";
        if (niche === "crafts") return "Scissors";
    }

    if (segment === "product_seller") {
        if (niche === "baby_family") return "Baby";
        if (niche === "home_decor") return "Sofa";
        if (niche === "beauty") return "Droplets";
        if (niche === "fashion") return "ShoppingBag";
        if (niche === "food_bev") return "Coffee";
        if (niche === "pets") return "PawPrint";
        if (niche === "digital_crafts") return "FileDown";
        if (niche === "travel_gear") return "Backpack";
    }

    if (segment === "service_provider") {
        if (niche === "coach") return "Speech";
        if (niche === "designer") return "Palette";
        if (niche === "educator") return "GraduationCap";
        if (niche === "wellness_practitioner") return "Leaf";
        if (niche === "agency") return "Briefcase";
        if (niche === "photo_video") return "Camera";
        if (niche === "real_estate_home") return "Home";
        if (niche === "events") return "PartyPopper";
        // finance handled above
    }

    return "Sparkles";
}

export function getNicheUiOptions(segment: Segment): NicheUiOption[] {
    const spec = getNicheOptions(segment); // canonical label + order
    const meta = NICHE_META[segment] ?? {};

    return spec.map((o) => {
        const m = meta[o.id] ?? {};
        return {
            id: o.id,
            label: o.label,
            includes: m.includes,
            keywords: m.keywords,
            iconKey: getNicheIconKey(segment, o.id),
            benchmark: getNicheBenchmarkUi(segment, o.id),
        };
    });
}

/**
 * Convenience helper — primary = first 6 non-"other", preserving adapter order.
 */
export function getPrimaryNicheUiOptions(segment: Segment): NicheUiOption[] {
    const all = getNicheUiOptions(segment);
    const withoutOther = all.filter((x) => x.id !== "other");
    return withoutOther.slice(0, 6);
}

// -----------------------------
// Search suggestions (canonical; derived from adapter data)
// -----------------------------

export type NicheSearchSuggestion = {
    /** The text we display to the user (chip label / placeholder token). */
    label: string;
    /** The search query we inject (can be same as label). */
    query: string;
    /** Optional mapping back to a real niche (useful for debugging). */
    niche?: NicheSlug;
};

/**
 * Canonical suggestions for Q2 search hinting.
 *
 * Boundary rule:
 * - UI must not invent these strings.
 * - Suggestions are derived from real spec+adapter data, so they stay valid when niches/meta change.
 */
export function getNicheSearchSuggestions(segment: Segment, limit = 4): NicheSearchSuggestion[] {
    const opts = getNicheUiOptions(segment);

    const out: NicheSearchSuggestion[] = [];
    const seen = new Set<string>();

    function add(label: string, niche?: NicheSlug) {
        const q = label.trim();
        if (!q) return;
        const key = q.toLowerCase();
        if (seen.has(key)) return;
        seen.add(key);
        out.push({ label: q, query: q, niche });
    }

    // Primary strategy: harvest from per-niche keywords (highest-signal “search-like” terms).
    for (const o of opts) {
        if (o.id === "other") continue;

        const ks = o.keywords ?? [];
        for (const k of ks) {
            add(k, o.id);
            if (out.length >= limit) return out;
        }
    }

    // Fallback: use niche labels (still “real”).
    for (const o of opts) {
        if (o.id === "other") continue;
        add(o.label, o.id);
        if (out.length >= limit) break;
    }

    return out;
}

/**
 * Convenience: single placeholder string derived from canonical suggestions.
 */
export function getNicheSearchPlaceholder(segment: Segment): string {
    const s = getNicheSearchSuggestions(segment, 4);
    if (s.length === 0) return "Search…";
    return `Try: ${s.map((x) => x.label).join(", ")}…`;
}
