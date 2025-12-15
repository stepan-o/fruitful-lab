"use client";

// frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts
import { useCallback, useEffect, useRef, useState } from "react";
import type { Answers, Lead } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";

export const DRAFT_STORAGE_KEY = "pinterestPotential:draft:v1";

export type DraftState = {
  stepIndex: number;
  answers: Answers;
  leadDraft?: Partial<Lead>;
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isDraftShape(v: unknown): v is DraftState {
  if (!isObject(v)) return false;
  const stepIndex = (v as any).stepIndex;
  const answers = (v as any).answers;
  const leadDraft = (v as any).leadDraft;
  const stepOk = typeof stepIndex === "number" && stepIndex >= 0 && stepIndex < 11; // 0..10 safe bound
  const answersOk = isObject(answers);
  const leadOk = leadDraft === undefined || isObject(leadDraft);
  return stepOk && answersOk && leadOk;
}

export function usePinterestPotentialDraft(initial: DraftState) {
  const [draft, setDraft] = useState<DraftState>(initial);
  const loadedRef = useRef(false);

  // Load once on mount
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    try {
      const raw = typeof window !== "undefined" ? window.sessionStorage.getItem(DRAFT_STORAGE_KEY) : null;
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (isDraftShape(parsed)) {
        setDraft((prev) => ({ ...prev, ...parsed }));
      } else {
        // Bad shape → clear
        window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    } catch {
      try {
        window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {}
    }
  }, []);

  // Persist on any draft change
  useEffect(() => {
    try {
      window.sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch {}
  }, [draft]);

  const updateDraft = useCallback((patch: Partial<DraftState>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const clearDraft = useCallback(() => {
    try {
      window.sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {}
  }, []);

  return { draft, setDraft, updateDraft, clearDraft } as const;
}
