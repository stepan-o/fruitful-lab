"use client";

// frontend/components/tools/pinterestPotential/usePinterestPotentialDraft.ts
import { useCallback, useEffect, useRef, useState } from "react";
import type { Answers, Lead } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import { Q2 as SPEC_Q2, Q3 as SPEC_Q3, Q9 as SPEC_Q9 } from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";

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

// Canonical validation: checkbox answers must be arrays of known option IDs (small integers)
function getAllowedIdsForQuestion(q: { options: { id: number }[] }): number[] {
  return Array.isArray(q?.options) ? q.options.map((o) => o.id) : [];
}

const ALLOWED_Q2_IDS = getAllowedIdsForQuestion(SPEC_Q2);
const ALLOWED_Q3_IDS = getAllowedIdsForQuestion(SPEC_Q3);
const ALLOWED_Q9_IDS = getAllowedIdsForQuestion(SPEC_Q9);

function isValidCheckboxIds(ids: unknown, allowedIds: number[]): boolean {
  if (!Array.isArray(ids)) return false;
  return ids.every((id) => Number.isInteger(id) && allowedIds.includes(id));
}

function isCanonicalAnswers(answers: unknown): answers is Answers {
  if (!isObject(answers)) return false;
  const a = answers as Answers;
  // Only validate checkbox questions that are present in the draft
  if (a.Q2 !== undefined && !isValidCheckboxIds(a.Q2 as unknown, ALLOWED_Q2_IDS)) return false;
  if (a.Q3 !== undefined && !isValidCheckboxIds(a.Q3 as unknown, ALLOWED_Q3_IDS)) return false;
  if (a.Q9 !== undefined && !isValidCheckboxIds(a.Q9 as unknown, ALLOWED_Q9_IDS)) return false;
  return true;
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
      if (isDraftShape(parsed) && isCanonicalAnswers((parsed as any).answers)) {
        setDraft((prev) => ({ ...prev, ...parsed }));
      } else {
        // Bad or legacy/invalid shape → clear entirely (no backward compatibility)
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
