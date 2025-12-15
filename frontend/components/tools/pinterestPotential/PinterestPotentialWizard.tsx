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
import { computeResult, computeScore } from "@/lib/tools/pinterestPotential/compute";
import { usePinterestPotentialDraft } from "./usePinterestPotentialDraft";
import RadioPillGroup from "@/components/ui/forms/RadioPillGroup";
import CheckboxCardGrid from "@/components/ui/forms/CheckboxCardGrid";
import SliderWithTicks from "@/components/ui/forms/SliderWithTicks";
import FieldError from "@/components/ui/forms/FieldError";
import HelperText from "@/components/ui/forms/HelperText";
import type { LeadMode } from "@/lib/tools/pinterestPotential/leadMode";

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

export default function PinterestPotentialWizard({
  leadMode = "gate_before_results",
  initialLead,
}: {
  leadMode?: LeadMode;
  initialLead?: Lead;
}) {
  // Draft persistence (sessionStorage v1)
  const { draft, updateDraft } = usePinterestPotentialDraft({ stepIndex: 0, answers: {}, leadDraft: {} });

  const [state, dispatch] = useReducer(reducer, {
    stepIndex: draft.stepIndex ?? 0,
    answers: draft.answers ?? {},
    leadDraft: (draft.leadDraft && Object.keys(draft.leadDraft).length > 0) ? draft.leadDraft : (initialLead ?? {}),
    errors: {},
  } as State);

  // Keep storage draft in sync when relevant state changes
  useEffect(() => {
    updateDraft({ stepIndex: state.stepIndex, answers: state.answers, leadDraft: state.leadDraft });
  }, [state.stepIndex, state.answers, state.leadDraft, updateDraft]);

  // Build dynamic step order based on lead mode
  const includeLead = useMemo(() => {
    if (leadMode === "optional_after_results") return false; // shown after results optionally
    if (leadMode === "prefilled_or_skip" && (state.leadDraft?.email || initialLead?.email)) return false;
    return true; // gate_before_results or need to collect
  }, [leadMode, state.leadDraft?.email, initialLead?.email]);

  const steps = useMemo(() => {
    const base = QUESTIONS.filter((q) => q.type !== "lead");
    return includeLead ? [...base, LEAD] : base;
  }, [includeLead]);

  const TOTAL_STEPS = steps.length;
  const current = steps[state.stepIndex];
  const isLead = current?.id === LEAD.id;
  const isLastStep = state.stepIndex === TOTAL_STEPS - 1;

  const progressText = useMemo(() => `Step ${state.stepIndex + 1} of ${TOTAL_STEPS}`,[state.stepIndex, TOTAL_STEPS]);

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
      // Final compute depending on lead mode
      if (includeLead) {
        const lead: Lead | undefined = state.leadDraft?.name && state.leadDraft?.email ? { name: state.leadDraft.name!, email: state.leadDraft.email! } : undefined;
        const result = computeResult(state.answers, lead);
        if (result.ok) {
          dispatch({ type: "SET_SCORE", score: result.score });
        } else {
          dispatch({ type: "SET_ERRORS", errors: result.errors });
        }
      } else {
        // optional-after-results or skip: validate non-lead inputs globally and compute directly
        const nonLeadErrors: Record<string, string> = {};
        for (const q of QUESTIONS) {
          if (q.type === "lead") continue;
          const e = validateStepLocal(QUESTIONS.indexOf(q), state.answers, state.leadDraft);
          Object.assign(nonLeadErrors, e);
        }
        if (Object.keys(nonLeadErrors).length > 0) {
          dispatch({ type: "SET_ERRORS", errors: nonLeadErrors });
        } else {
          const score = computeScore(state.answers as Required<Answers>);
          dispatch({ type: "SET_SCORE", score });
        }
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
                aria-describedby={state.errors["LEAD.name"] ? "LEAD.name-error" : undefined}
                onChange={(e) => dispatch({ type: "UPDATE_LEAD", field: "name", value: e.target.value })}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              />
              <FieldError id="LEAD.name-error" message={state.errors["LEAD.name"]} />
            </div>
            <div>
              <input
                type="email"
                placeholder="you@example.com"
                value={state.leadDraft.email ?? ""}
                aria-describedby={state.errors["LEAD.email"] ? "LEAD.email-error" : undefined}
                onChange={(e) => dispatch({ type: "UPDATE_LEAD", field: "email", value: e.target.value })}
                className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              />
              <FieldError id="LEAD.email-error" message={state.errors["LEAD.email"]} />
            </div>
          </div>
        </div>
      );
    }

    if (current.type === "radio") {
      const helperId = `${current.id}-helper`;
      const errorId = `${current.id}-error`;
      const describedBy = [current.helperText ? helperId : undefined, state.errors[current.id] ? errorId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;
      return (
        <div>
          {current.helperText ? (
            <HelperText id={helperId}>{current.helperText}</HelperText>
          ) : null}
          <div className="mt-2">
            <RadioPillGroup
              name={current.id}
              value={(state.answers as any)[current.id]}
              options={current.options}
              onChange={(val) => dispatch({ type: "UPDATE_ANSWER", questionId: current.id, value: val })}
              errorId={state.errors[current.id] ? errorId : undefined}
              describedBy={describedBy}
            />
            <FieldError id={errorId} message={state.errors[current.id]} />
          </div>
        </div>
      );
    }

    if (current.type === "checkbox") {
      const values = ((state.answers as any)[current.id] as number[]) || [];
      const helperId = `${current.id}-helper`;
      const errorId = `${current.id}-error`;
      const describedBy = [current.helperText ? helperId : undefined, state.errors[current.id] ? errorId : undefined]
        .filter(Boolean)
        .join(" ") || undefined;
      return (
        <div>
          {current.helperText ? (
            <HelperText id={helperId}>{current.helperText}</HelperText>
          ) : null}
          <div className="mt-2">
            <CheckboxCardGrid
              values={values}
              options={current.options}
              onChange={(vals) => dispatch({ type: "UPDATE_ANSWER", questionId: current.id, value: vals })}
              describedBy={describedBy}
            />
            <FieldError id={errorId} message={state.errors[current.id]} />
          </div>
        </div>
      );
    }

    if (current.type === "slider") {
      const v = (state.answers as any)[current.id] ?? current.default ?? current.min;
      const errorId = `${current.id}-error`;
      return (
        <div>
          <div className="mt-2">
            <SliderWithTicks
              value={v}
              min={current.min}
              max={current.max}
              step={current.step}
              onChange={(nv) => dispatch({ type: "UPDATE_ANSWER", questionId: current.id, value: nv })}
              leftLabel={current.id === "Q7" ? "Not seasonal" : current.id === "Q8" ? "Low competition" : undefined}
              rightLabel={current.id === "Q7" ? "Very seasonal" : current.id === "Q8" ? "High competition" : undefined}
              errorId={state.errors[current.id] ? errorId : undefined}
            />
            <FieldError id={errorId} message={state.errors[current.id]} />
          </div>
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

        {leadMode === "optional_after_results" && !state.leadDraft?.email && (
          <div className="mt-6 border-t border-[var(--border)] pt-4">
            <h3 className="font-heading text-lg text-[var(--foreground)]">Want a copy of your results?</h3>
            <p className="mt-1 text-sm text-[var(--foreground-muted)]">Leave your email and we’ll send this score.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={state.leadDraft.name ?? ""}
                  onChange={(e) => dispatch({ type: "UPDATE_LEAD", field: "name", value: e.target.value })}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={state.leadDraft.email ?? ""}
                  onChange={(e) => dispatch({ type: "UPDATE_LEAD", field: "email", value: e.target.value })}
                  className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                />
              </div>
            </div>
          </div>
        )}
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
