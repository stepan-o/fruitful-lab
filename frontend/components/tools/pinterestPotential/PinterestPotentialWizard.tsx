"use client";

// frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx
// Sprint 2 — stepper skeleton with reducer state, per-step validation, and sessionStorage draft persistence

import { useEffect, useMemo, useReducer } from "react";
import {
  type Answers,
  type Lead,
  QUESTIONS,
  LEAD,
  validateEmail,
} from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import { computeResult } from "@/lib/tools/pinterestPotential/compute";
import { usePinterestPotentialDraft } from "./usePinterestPotentialDraft";

type State = {
  stepIndex: number; // 0..9
  answers: Answers;
  leadDraft: Partial<Lead>;
  errors: Record<string, string>;
  finalScore?: number;
};

type Action =
  | { type: "SET_STEP"; index: number }
  | { type: "UPDATE_ANSWER"; questionId: string; value: any }
  | { type: "UPDATE_LEAD"; field: keyof Lead; value: string }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "SET_SCORE"; score: number }
  | { type: "RESET_ERRORS" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, stepIndex: action.index };
    case "UPDATE_ANSWER": {
      const answers = { ...state.answers, [action.questionId]: action.value } as Answers;
      return { ...state, answers };
    }
    case "UPDATE_LEAD": {
      const leadDraft = { ...state.leadDraft, [action.field]: action.value };
      return { ...state, leadDraft };
    }
    case "SET_ERRORS":
      return { ...state, errors: action.errors };
    case "RESET_ERRORS":
      return { ...state, errors: {} };
    case "SET_SCORE":
      return { ...state, finalScore: action.score };
    default:
      return state;
  }
}

const TOTAL_STEPS = 10; // Q1..Q9 + LEAD

function validateStepLocal(stepIdx: number, answers: Answers, leadDraft: Partial<Lead>): Record<string, string> {
  const q = QUESTIONS[stepIdx];
  const errors: Record<string, string> = {};
  if (!q) return errors;

  if (q.type === "radio") {
    const v = (answers as any)[q.id];
    if (q.required && (v === undefined || v === null)) {
      errors[q.id] = "This question is required.";
    }
  } else if (q.type === "checkbox") {
    const arr = (answers as any)[q.id] as any;
    if (q.required && (!Array.isArray(arr) || arr.length === 0)) {
      errors[q.id] = "Please select at least one option.";
    }
  } else if (q.type === "slider") {
    const v = (answers as any)[q.id];
    if (q.required && (v === undefined || v === null)) {
      errors[q.id] = "This question is required.";
    } else if (v !== undefined && (v < q.min || v > q.max)) {
      errors[q.id] = `Value must be between ${q.min} and ${q.max}.`;
    }
  } else if (q.type === "lead") {
    const name = leadDraft.name ?? "";
    const email = leadDraft.email ?? "";
    if (!name.trim()) errors["LEAD.name"] = "Name is required.";
    if (!email || !validateEmail(email)) errors["LEAD.email"] = "A valid email is required.";
  }

  return errors;
}

export default function PinterestPotentialWizard() {
  // Draft persistence (sessionStorage v1)
  const { draft, updateDraft } = usePinterestPotentialDraft({ stepIndex: 0, answers: {}, leadDraft: {} });

  const [state, dispatch] = useReducer(reducer, {
    stepIndex: draft.stepIndex ?? 0,
    answers: draft.answers ?? {},
    leadDraft: draft.leadDraft ?? {},
    errors: {},
  } as State);

  // Keep storage draft in sync when relevant state changes
  useEffect(() => {
    updateDraft({ stepIndex: state.stepIndex, answers: state.answers, leadDraft: state.leadDraft });
  }, [state.stepIndex, state.answers, state.leadDraft, updateDraft]);

  const current = QUESTIONS[state.stepIndex];
  const isLead = current?.id === LEAD.id;
  const isLastStep = state.stepIndex === TOTAL_STEPS - 1;

  const progressText = useMemo(() => `Step ${state.stepIndex + 1} of ${TOTAL_STEPS}`,[state.stepIndex]);

  function handlePrev() {
    dispatch({ type: "RESET_ERRORS" });
    if (state.stepIndex > 0) {
      dispatch({ type: "SET_STEP", index: state.stepIndex - 1 });
    }
  }

  function handleNext() {
    dispatch({ type: "RESET_ERRORS" });
    const errs = validateStepLocal(state.stepIndex, state.answers, state.leadDraft);
    if (Object.keys(errs).length > 0) {
      dispatch({ type: "SET_ERRORS", errors: errs });
      return;
    }

    if (isLastStep) {
      // Final compute
      const lead: Lead | undefined = state.leadDraft?.name && state.leadDraft?.email ? { name: state.leadDraft.name!, email: state.leadDraft.email! } : undefined;
      const result = computeResult(state.answers, lead);
      if (result.ok) {
        dispatch({ type: "SET_SCORE", score: result.score });
      } else {
        dispatch({ type: "SET_ERRORS", errors: result.errors });
      }
      return;
    }

    dispatch({ type: "SET_STEP", index: state.stepIndex + 1 });
  }

  // Render helpers
  function renderQuestion() {
    if (!current) return null;
    if (current.type === "lead") {
      return (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--foreground)]">{current.label}</label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <input
                type="text"
                placeholder="Your name"
                value={state.leadDraft.name ?? ""}
                onChange={(e) => dispatch({ type: "UPDATE_LEAD", field: "name", value: e.target.value })}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              />
              {state.errors["LEAD.name"] && (
                <p className="mt-1 text-xs text-red-600">{state.errors["LEAD.name"]}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="you@example.com"
                value={state.leadDraft.email ?? ""}
                onChange={(e) => dispatch({ type: "UPDATE_LEAD", field: "email", value: e.target.value })}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              />
              {state.errors["LEAD.email"] && (
                <p className="mt-1 text-xs text-red-600">{state.errors["LEAD.email"]}</p>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (current.type === "radio") {
      return (
        <div className="space-y-3">
          {(current.options || []).map((opt, i) => {
            const checked = (state.answers as any)[current.id] === opt.value;
            return (
              <label
                key={`${current.id}:${opt.label}:${i}`}
                className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--card)] p-3 hover:bg-[var(--card-hover)]"
              >
                <input
                  type="radio"
                  name={current.id}
                  checked={!!checked}
                  onChange={() => dispatch({ type: "UPDATE_ANSWER", questionId: current.id, value: opt.value })}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
          {state.errors[current.id] && (
            <p className="mt-1 text-xs text-red-600">{state.errors[current.id]}</p>
          )}
        </div>
      );
    }

    if (current.type === "checkbox") {
      const values = ((state.answers as any)[current.id] as number[]) || [];
      function toggle(val: number) {
        const set = new Set(values);
        if (set.has(val)) set.delete(val); else set.add(val);
        dispatch({ type: "UPDATE_ANSWER", questionId: current.id, value: Array.from(set) });
      }
      return (
        <div className="space-y-3">
          {(current.options || []).map((opt, i) => (
            <label
              key={`${current.id}:${opt.label}:${i}`}
              className="flex items-center gap-3 rounded-md border border-[var(--border)] bg-[var(--card)] p-3 hover:bg-[var(--card-hover)]"
            >
              <input
                type="checkbox"
                checked={values.includes(opt.value)}
                onChange={() => toggle(opt.value)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
          {state.errors[current.id] && (
            <p className="mt-1 text-xs text-red-600">{state.errors[current.id]}</p>
          )}
        </div>
      );
    }

    if (current.type === "slider") {
      const v = (state.answers as any)[current.id] ?? current.default ?? current.min;
      return (
        <div className="space-y-2">
          <input
            type="range"
            min={current.min}
            max={current.max}
            step={current.step}
            value={v}
            onChange={(e) => dispatch({ type: "UPDATE_ANSWER", questionId: current.id, value: Number(e.target.value) })}
            className="w-full"
          />
          <div className="text-sm text-[var(--foreground-muted)]">Selected: {v}</div>
          {state.errors[current.id] && (
            <p className="mt-1 text-xs text-red-600">{state.errors[current.id]}</p>
          )}
        </div>
      );
    }

    return null;
  }

  if (state.finalScore !== undefined) {
    // Temporary results placeholder per acceptance criteria
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
        <div className="mb-4 text-sm text-[var(--foreground-muted)]">Pinterest Potential — Results (temporary)</div>
        <div className="font-heading text-3xl">Score: {state.finalScore}</div>
        <div className="mt-6 text-sm text-[var(--foreground-muted)]">You can refresh the page; your draft is saved in this session.</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
      {/* Progress */}
      <div className="mb-4 flex items-center justify-between text-sm">
        <div className="text-[var(--foreground-muted)]">{progressText}</div>
      </div>

      {/* Question */}
      {current && (
        <div>
          <h2 className="font-heading text-xl text-[var(--foreground)]">{current.label}</h2>
          <div className="mt-4">{renderQuestion()}</div>
        </div>
      )}

      {/* Nav */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          className="rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--card-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          disabled={state.stepIndex === 0}
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="rounded-md bg-[var(--brand-raspberry)] px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        >
          {isLastStep ? "Calculate" : "Continue"}
        </button>
      </div>
    </div>
  );
}
