"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const DRAFT_STORAGE_KEY = "pinterestPotential:draft:v2";

export type Segment = "content_creator" | "product_seller" | "service_provider";

export type VolumeBucket = "0-2" | "3-5" | "6-10" | "11-20" | "20+";
export type VisualStrength = "limited" | "decent" | "strong" | "very_strong";
export type SiteExperience = "a" | "b" | "c" | "d";
export type OfferClarity = "no" | "somewhat" | "yes";
export type GrowthMode = "organic" | "later" | "ads";

export type AnswersV2 = {
    segment?: Segment;
    niche?: string;

    volume_bucket?: VolumeBucket;
    visual_strength?: VisualStrength;
    site_experience?: SiteExperience;
    offer_clarity?: OfferClarity;
    primary_goal?: string;
    growth_mode?: GrowthMode;
};

export type DraftStateV2 = {
    /** 1..8 */
    stepIndex: number;
    /** Whether user left welcome and entered Q1 (for welcome variant) */
    started: boolean;
    answers: AnswersV2;
    /** A/B */
    variant?: "welcome" | "no_welcome";
};

function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null;
}

function isValidStepIndex(n: unknown): n is number {
    return typeof n === "number" && Number.isFinite(n) && n >= 1 && n <= 8;
}

function isDraftShape(v: unknown): v is DraftStateV2 {
    if (!isObject(v)) return false;
    const stepIndex = (v as any).stepIndex;
    const started = (v as any).started;
    const answers = (v as any).answers;
    const variant = (v as any).variant;

    const stepOk = isValidStepIndex(stepIndex);
    const startedOk = typeof started === "boolean";
    const answersOk = isObject(answers);
    const variantOk =
        variant === undefined || variant === "welcome" || variant === "no_welcome";

    return stepOk && startedOk && answersOk && variantOk;
}

export function usePinterestPotentialDraft(initial: DraftStateV2) {
    const [draft, setDraft] = useState<DraftStateV2>(initial);
    const loadedRef = useRef(false);

    // Load once on mount
    useEffect(() => {
        if (loadedRef.current) return;
        loadedRef.current = true;

        try {
            const raw =
                typeof window !== "undefined"
                    ? window.sessionStorage.getItem(DRAFT_STORAGE_KEY)
                    : null;
            if (!raw) return;

            const parsed = JSON.parse(raw);
            if (isDraftShape(parsed)) {
                setDraft((prev) => ({ ...prev, ...parsed }));
            } else {
                window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
            }
        } catch {
            try {
                window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
            } catch {}
        }
    }, []);

    // Persist on changes
    useEffect(() => {
        try {
            window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
        } catch {}
    }, [draft]);

    const updateDraft = useCallback((patch: Partial<DraftStateV2>) => {
        setDraft((prev) => ({ ...prev, ...patch }));
    }, []);

    const clearDraft = useCallback(() => {
        try {
            window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch {}
    }, []);

    return { draft, setDraft, updateDraft, clearDraft } as const;
}
