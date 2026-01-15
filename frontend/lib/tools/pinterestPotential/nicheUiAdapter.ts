// frontend/lib/tools/pinterestPotential/nicheUiAdapter.ts
/**
 * Pinterest Potential — Spec → UI Adapter (Q2 Niche enrichment)
 *
 * Invariants:
 * - Spec remains canonical source of truth for IDs + labels + ordering.
 * - This adapter enriches spec options with UI-only metadata (includes, keywords, icon keys, badges, helper copy).
 * - UI components (Q2Niche, BottomSheet usage) must not invent niche logic.
 *
 * Dependencies allowed:
 * - Spec (types + getNicheOptions)
 * - Benchmarks (for audience preview tiers)
 *
 * Forbidden:
 * - Spec importing this module
 * - This module importing UI step components
 * - This module importing Lucide/React icon components (UI maps iconKey → icon component)
 */

import type { Range } from "./benchmarks";
import { getBenchmark } from "./benchmarks";
import type { NicheSlug, Segment } from "./pinterestPotentialSpec";
import { getNicheOptions } from "./pinterestPotentialSpec";

export type AudiencePreviewLevel = "Focused" | "Medium" | "Broad";

export type AudiencePreviewMeta = {
    /** What the UI badge displays after “Audience:” */
    badgeLabel: "Specific" | "Medium" | "Huge";
    /** Tooltip/help copy shown to the user */
    helperCopy: string;
};

export const AUDIENCE_PREVIEW_META: Record<AudiencePreviewLevel, AudiencePreviewMeta> = {
    Focused: {
        badgeLabel: "Specific",
        helperCopy: "More specific audience → usually easier targeting + clearer messaging.",
    },
    Medium: {
        badgeLabel: "Medium",
        helperCopy: "Balanced audience size → good mix of reach + relevance.",
    },
    Broad: {
        badgeLabel: "Huge",
        helperCopy: "Big audience → more competition, but more upside if you commit.",
    },
};

/**
 * Convert benchmark audience range into a stable preview tier.
 * Canonical for Q2 badges.
 */
export function audiencePreviewFromRange(r: Range): AudiencePreviewLevel {
    // Keep current behavior: use HIGH end as ceiling signal.
    const high = r.high;

    // Thresholds preserved from prior audiencePreview.ts
    if (high >= 20_000_000) return "Broad";
    if (high >= 10_000_000) return "Medium";
    return "Focused";
}

export function getAudiencePreviewLevel(segment: Segment, niche: NicheSlug): AudiencePreviewLevel {
    const row = getBenchmark(segment, niche);
    return audiencePreviewFromRange(row.audience_base);
}

export function getSegmentHint(seg: Segment): string {
    if (seg === "content_creator") return "Pick what you publish about most.";
    if (seg === "product_seller") return "Pick the category you sell into.";
    return "Pick the industry you serve.";
}

/**
 * Q2 UI option shape expected by Q2Niche.tsx
 * - `value` is the canonical niche slug
 * - `iconKey` is a stable string identifier (UI maps this to a Lucide icon component)
 * - `audienceLevel` is the canonical tier for Q2 badges
 */
export type NicheUiOption = {
    value: NicheSlug;
    label: string;
    includes?: string;
    keywords?: string[];
    iconKey: string;
    audienceLevel: AudiencePreviewLevel;
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
 * NOTE: These keys must match the ICONS map in Q2Niche.tsx.
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
        // finance handled above (so TS doesn't narrow it out before we need it)
    }

    return "Sparkles";
}

export function getNicheUiOptions(segment: Segment): NicheUiOption[] {
    const spec = getNicheOptions(segment); // canonical label + order
    const meta = NICHE_META[segment] ?? {};

    return spec.map((o) => {
        const m = meta[o.id] ?? {};
        return {
            value: o.id,
            label: o.label,
            includes: m.includes,
            keywords: m.keywords,
            iconKey: getNicheIconKey(segment, o.id),
            audienceLevel: getAudiencePreviewLevel(segment, o.id),
        };
    });
}

/**
 * Convenience helper (kept) — primary = first 6 non-"other", preserving adapter order.
 * (Q2Niche currently re-derives this itself, but keeping this export is harmless and may be used elsewhere.)
 */
export function getPrimaryNicheUiOptions(segment: Segment): NicheUiOption[] {
    const all = getNicheUiOptions(segment);
    const withoutOther = all.filter((x) => x.value !== "other");
    return withoutOther.slice(0, 6);
}

/* ------------------------------------------------------------------ */
/* Search suggestions — canonical hint copy for Q2 search input        */
/* ------------------------------------------------------------------ */

export type NicheSearchSuggestion = {
    /** The text we display to the user (chip label / placeholder token) */
    label: string;
    /** The search query we inject (can be same as label) */
    query: string;
    /** Optional mapping back to a real niche (useful for debugging) */
    niche?: NicheSlug;
};

/**
 * Canonical suggestions for Q2 search hinting.
 *
 * Boundary rule:
 * - UI must not invent these strings.
 * - Suggestions must be derived from real spec+adapter data, so they stay valid when niches/meta change.
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
        if (o.value === "other") continue;

        const ks = o.keywords ?? [];
        for (const k of ks) {
            add(k, o.value);
            if (out.length >= limit) return out;
        }
    }

    // Fallback: use niche labels (still “real”).
    for (const o of opts) {
        if (o.value === "other") continue;
        add(o.label, o.value);
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
