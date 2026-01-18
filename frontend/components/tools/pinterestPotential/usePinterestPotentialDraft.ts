"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
    stepIndex: number; // 1..8
    started: boolean; // Whether user left welcome and entered Q1 (for welcome variant)
    answers: AnswersV2;
    variant?: "welcome" | "no_welcome";
};

function isObject(v: unknown): v is Record<string, unknown> {
    return typeof v === "object" && v !== null;
}

function isValidStepIndex(n: unknown): n is number {
    return typeof n === "number" && Number.isFinite(n) && n >= 1 && n <= 8;
}

function isVariant(v: unknown): v is DraftStateV2["variant"] {
    return v === undefined || v === "welcome" || v === "no_welcome";
}

function isDraftShape(v: unknown): v is DraftStateV2 {
    if (!isObject(v)) return false;

    const rec = v;

    const stepIndex = rec["stepIndex"];
    const started = rec["started"];
    const answers = rec["answers"];
    const variant = rec["variant"];

    const stepOk = isValidStepIndex(stepIndex);
    const startedOk = typeof started === "boolean";
    const answersOk = isObject(answers);
    const variantOk = isVariant(variant);

    return stepOk && startedOk && answersOk && variantOk;
}

function safeReadSession(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
        return window.sessionStorage.getItem(key);
    } catch {
        return null;
    }
}

function safeWriteSession(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try {
        window.sessionStorage.setItem(key, value);
    } catch {
        // ignore
    }
}

function safeRemoveSession(key: string): void {
    if (typeof window === "undefined") return;
    try {
        window.sessionStorage.removeItem(key);
    } catch {
        // ignore
    }
}

export function usePinterestPotentialDraft(initial: DraftStateV2) {
    const initialDraft = useMemo<DraftStateV2>(() => {
        const raw = safeReadSession(DRAFT_STORAGE_KEY);
        if (!raw) return initial;

        try {
            const parsed: unknown = JSON.parse(raw);
            if (isDraftShape(parsed)) {
                return { ...initial, ...parsed }; // Merge initial state with persisted state
            }
            safeRemoveSession(DRAFT_STORAGE_KEY);
            return initial;
        } catch {
            safeRemoveSession(DRAFT_STORAGE_KEY);
            return initial;
        }
    }, []);

    const [draft, setDraft] = useState<DraftStateV2>(initialDraft);

    const hydratedRef = useRef(false);

    // Persist to sessionStorage after mount
    useEffect(() => {
        if (!hydratedRef.current) hydratedRef.current = true;

        // Avoid overwriting updated state with old draft values
        safeWriteSession(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    }, [draft]);

    const updateDraft = useCallback((patch: Partial<DraftStateV2>) => {
        setDraft((prev) => ({ ...prev, ...patch }));
    }, []);

    const clearDraft = useCallback(() => {
        safeRemoveSession(DRAFT_STORAGE_KEY);
    }, []);

    return { draft, setDraft, updateDraft, clearDraft } as const;
}
