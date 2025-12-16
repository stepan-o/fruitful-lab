"use client";

// frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx
// Sprint 2 — stepper skeleton with reducer state, per-step validation, and sessionStorage draft persistence
// Sprint 5 — swap-in results UI (3 results) + recap, while keeping lead-mode behavior exactly as-is
//
// NOTE (bugfix): Spec changed Q2/Q3/Q9 to store OPTION IDS, not option values.
// The previous compute.ts version sums raw arrays (treating them as values), which makes Result 1 wrong.
// This wizard now computes Result 1/2/3 using the spec as source-of-truth.

import { useEffect, useMemo, useReducer } from "react";
import { useSearchParams } from "next/navigation";
import {
    type Answers,
    type Lead,
    type Question,
    QUESTIONS,
    Q2 as SPEC_Q2,
    Q3 as SPEC_Q3,
    Q9 as SPEC_Q9,
    LEAD,
    validateEmail,
    validateAnswers,
    computeAvgHouseholdIncomeFromAnswers,
    computeAvgCartSizeFromAnswers,
} from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";
import { usePinterestPotentialDraft } from "./usePinterestPotentialDraft";
import RadioPillGroup from "@/components/ui/forms/RadioPillGroup";
import CheckboxCardGrid from "@/components/ui/forms/CheckboxCardGrid";
import SliderWithTicks from "@/components/ui/forms/SliderWithTicks";
import FieldError from "@/components/ui/forms/FieldError";
import HelperText from "@/components/ui/forms/HelperText";
import {
    type LeadMode,
    normalizeLeadMode,
} from "@/lib/tools/pinterestPotential/leadMode";

type ResultsBundle = {
    monthlyAudience: number; // Result 1
    avgHouseholdIncome: number; // Result 2
    avgCartSize: number; // Result 3
};

type State = {
    stepIndex: number; // 0..9
    answers: Answers;
    leadDraft: Partial<Lead>;
    errors: Record<string, string>;
    finalScore?: number; // kept for the existing "results gate" check
    finalResults?: ResultsBundle; // Sprint 5
};

type Action =
    | { type: "SET_STEP"; index: number }
    | { type: "UPDATE_ANSWER"; questionId: string; value: any }
    | { type: "UPDATE_LEAD"; field: keyof Lead; value: string }
    | { type: "SET_ERRORS"; errors: Record<string, string> }
    | { type: "SET_SCORE"; score: number }
    | { type: "SET_RESULTS"; results: ResultsBundle }
    | { type: "RESET_ERRORS" };

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case "SET_STEP":
            return { ...state, stepIndex: action.index };
        case "UPDATE_ANSWER": {
            const answers = {
                ...state.answers,
                [action.questionId]: action.value,
            } as Answers;
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
        case "SET_RESULTS":
            return {
                ...state,
                finalResults: action.results,
                finalScore: action.results.monthlyAudience, // preserve old gate behavior
            };
        default:
            return state;
    }
}

const TOTAL_STEPS = 10; // Q1..Q9 + LEAD

function validateStepLocal(
    stepIdx: number,
    answers: Answers,
    leadDraft: Partial<Lead>
): Record<string, string> {
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
        if (!email || !validateEmail(email))
            errors["LEAD.email"] = "A valid email is required.";
    }

    return errors;
}

function round(n: number, decimals: number): number {
    if (decimals === 0) return Math.round(n);
    const f = Math.pow(10, decimals);
    return Math.round(n * f) / f;
}

function sum(arr: number[]): number {
    return arr.reduce((acc, n) => acc + n, 0);
}

// ---- Sprint 5 compute (wizard-local, spec-aligned) ----
function findQuestion(id: string): Question | undefined {
    return QUESTIONS.find((q) => (q as any).id === id);
}

function sumCheckboxOptionValues(questionId: "Q2" | "Q3", selectedIds: number[]): number {
    const q = findQuestion(questionId);
    if (!q || q.type !== "checkbox") return 0;
    const valueById = new Map(q.options.map((o) => [o.id, o.value]));
    const values = selectedIds.map((id) => valueById.get(id)).filter((v): v is number => typeof v === "number");
    return sum(values);
}

function computeMonthlyAudienceFromAnswers(a: Required<Answers>): number {
    // Formula (spec): sum(Q3 values) * sum(Q2 values) * Q1 * Q4 * Q5 * Q6 * seasonalFactor * competitionFactor
    // Note: Answers store ids for Q2/Q3, so we translate ids -> option.value here.
    const q2 = sumCheckboxOptionValues("Q2", a.Q2);
    const q3 = sumCheckboxOptionValues("Q3", a.Q3);

    const seasonalFactor = 1.175 - 0.175 * a.Q7; // Q7 in [1..5]
    const competitionFactor = 1.15 - 0.15 * a.Q8; // Q8 in [1..5]

    const result =
        q3 *
        q2 *
        a.Q1 *
        a.Q4 *
        a.Q5 *
        a.Q6 *
        seasonalFactor *
        competitionFactor;

    return round(result, 0);
}

function computeResultsFromAnswers(a: Required<Answers>): ResultsBundle {
    const monthlyAudience = computeMonthlyAudienceFromAnswers(a);
    const avgHouseholdIncome = computeAvgHouseholdIncomeFromAnswers(a);
    const avgCartSize = computeAvgCartSizeFromAnswers(a);

    return { monthlyAudience, avgHouseholdIncome, avgCartSize };
}

// ---- Recap helpers ----
function formatSliderAnswer(qid: "Q7" | "Q8", v: number): string {
    if (qid === "Q7") {
        const label = v === 1 ? "Not seasonal" : v === 5 ? "Very seasonal" : "Moderately seasonal";
        return `${v}/5 (${label})`;
    }
    const label = v === 1 ? "Low competition" : v === 5 ? "High competition" : "Moderate competition";
    return `${v}/5 (${label})`;
}

function getRadioLabel(q: Extract<Question, { type: "radio" }>, value: number | undefined): string {
    if (value === undefined || value === null) return "—";
    const opt = q.options.find((o) => o.value === value);
    return opt?.label ?? String(value);
}

function getCheckboxLabels(q: Extract<Question, { type: "checkbox" }>, selectedIds: number[] | undefined): string {
    const ids = Array.isArray(selectedIds) ? selectedIds : [];
    if (ids.length === 0) return "—";
    const labelById = new Map(q.options.map((o) => [o.id, o.label]));
    return ids.map((id) => labelById.get(id) ?? String(id)).join(", ");
}

export default function PinterestPotentialWizard({
                                                     leadMode = "gate_before_results",
                                                     initialLead,
                                                 }: {
    leadMode?: LeadMode;
    initialLead?: Lead;
}) {
    // Query-param seatbelt: allow runtime override even if upstream wiring is off.
    const searchParams = useSearchParams();
    const qpLeadMode =
        (searchParams as any)?.get?.("leadMode") ??
        (searchParams as any)?.get?.("leadmode") ??
        undefined;

    const effectiveLeadMode: LeadMode = normalizeLeadMode(qpLeadMode) ?? leadMode;

    // Draft persistence (sessionStorage v1)
    const { draft, updateDraft } = usePinterestPotentialDraft({
        stepIndex: 0,
        answers: {},
        leadDraft: {},
    });

    const [state, dispatch] = useReducer(reducer, {
        stepIndex: draft.stepIndex ?? 0,
        answers: draft.answers ?? {},
        leadDraft:
            draft.leadDraft && Object.keys(draft.leadDraft).length > 0
                ? draft.leadDraft
                : initialLead ?? {},
        errors: {},
    } as State);

    // Keep storage draft in sync when relevant state changes
    useEffect(() => {
        updateDraft({
            stepIndex: state.stepIndex,
            answers: state.answers,
            leadDraft: state.leadDraft,
        });
    }, [state.stepIndex, state.answers, state.leadDraft, updateDraft]);

    // Build dynamic step order based on lead mode
    const includeLead = useMemo(() => {
        if (effectiveLeadMode === "optional_after_results") return false;
        if (effectiveLeadMode === "prefilled_or_skip") return false;
        return true; // gate_before_results only
    }, [effectiveLeadMode]);

    const steps = useMemo(() => {
        const base = QUESTIONS.filter((q) => q.type !== "lead");
        return includeLead ? [...base, LEAD] : base;
    }, [includeLead]);

    const TOTAL_STEPS = steps.length;
    const current = steps[state.stepIndex];
    const isLastStep = state.stepIndex === TOTAL_STEPS - 1;

    const progressText = useMemo(
        () => `Step ${state.stepIndex + 1} of ${TOTAL_STEPS}`,
        [state.stepIndex, TOTAL_STEPS]
    );

    function validateAllNonLead(
        answers: Answers,
        leadDraft: Partial<Lead>
    ): Record<string, string> {
        const nonLeadErrors: Record<string, string> = {};
        for (const q of QUESTIONS) {
            if (q.type === "lead") continue;
            const idx = QUESTIONS.indexOf(q);
            const e = validateStepLocal(idx, answers, leadDraft);
            Object.assign(nonLeadErrors, e);
        }
        return nonLeadErrors;
    }

    function handlePrev() {
        dispatch({ type: "RESET_ERRORS" });
        if (state.stepIndex > 0) {
            dispatch({ type: "SET_STEP", index: state.stepIndex - 1 });
        }
    }

    function handleNext() {
        dispatch({ type: "RESET_ERRORS" });

        const stepQuestion = current;
        if (!stepQuestion) return;

        const errs: Record<string, string> = {};
        if (stepQuestion.type === "radio") {
            const v = (state.answers as any)[stepQuestion.id];
            if (stepQuestion.required && (v === undefined || v === null)) {
                errs[stepQuestion.id] = "This question is required.";
            }
        } else if (stepQuestion.type === "checkbox") {
            const arr = (state.answers as any)[stepQuestion.id] as any;
            if (stepQuestion.required && (!Array.isArray(arr) || arr.length === 0)) {
                errs[stepQuestion.id] = "Please select at least one option.";
            }
        } else if (stepQuestion.type === "slider") {
            const v = (state.answers as any)[stepQuestion.id];
            if (stepQuestion.required && (v === undefined || v === null)) {
                errs[stepQuestion.id] = "This question is required.";
            } else if (v !== undefined && (v < stepQuestion.min || v > stepQuestion.max)) {
                errs[stepQuestion.id] = `Value must be between ${stepQuestion.min} and ${stepQuestion.max}.`;
            }
        } else if (stepQuestion.type === "lead") {
            const name = state.leadDraft.name ?? "";
            const email = state.leadDraft.email ?? "";
            if (!name.trim()) errs["LEAD.name"] = "Name is required.";
            if (!email || !validateEmail(email)) errs["LEAD.email"] = "A valid email is required.";
        }

        if (Object.keys(errs).length > 0) {
            dispatch({ type: "SET_ERRORS", errors: errs });
            return;
        }

        if (isLastStep) {
            // Dev-only invariant: ensure checkbox answers are canonical (IDs only)
            if (process.env.NODE_ENV !== "production") {
                const allowedQ2 = new Set(SPEC_Q2.options.map((o) => o.id));
                const allowedQ3 = new Set(SPEC_Q3.options.map((o) => o.id));
                const allowedQ9 = new Set(SPEC_Q9.options.map((o) => o.id));
                const isIdsArray = (arr: any, allowed: Set<number>) =>
                    Array.isArray(arr) && arr.every((x) => Number.isInteger(x) && allowed.has(x));

                const a = state.answers as Answers;
                const badQ2 = a.Q2 !== undefined && !isIdsArray(a.Q2, allowedQ2);
                const badQ3 = a.Q3 !== undefined && !isIdsArray(a.Q3, allowedQ3);
                const badQ9 = a.Q9 !== undefined && !isIdsArray(a.Q9, allowedQ9);
                if (badQ2 || badQ3 || badQ9) {
                    // Make violations loud during development
                    // eslint-disable-next-line no-console
                    console.error("PinterestPotential: Non-canonical draft detected (checkboxes must be IDs)", {
                        Q2: a.Q2,
                        Q3: a.Q3,
                        Q9: a.Q9,
                    });
                    throw new Error("PinterestPotential invariant: checkbox answers must be option IDs in development");
                }
            }

            if (effectiveLeadMode === "gate_before_results") {
                const lead: Lead | undefined =
                    state.leadDraft?.name && state.leadDraft?.email
                        ? { name: state.leadDraft.name!, email: state.leadDraft.email! }
                        : undefined;

                const validation = validateAnswers(state.answers, lead);
                if (!validation.ok) {
                    dispatch({ type: "SET_ERRORS", errors: validation.errors });
                    return;
                }

                const results = computeResultsFromAnswers(state.answers as Required<Answers>);
                dispatch({ type: "SET_RESULTS", results });
            } else {
                const nonLeadErrors = validateAllNonLead(state.answers, state.leadDraft);
                if (Object.keys(nonLeadErrors).length > 0) {
                    dispatch({ type: "SET_ERRORS", errors: nonLeadErrors });
                    return;
                }

                const results = computeResultsFromAnswers(state.answers as Required<Answers>);
                dispatch({ type: "SET_RESULTS", results });
            }
            return;
        }

        dispatch({ type: "SET_STEP", index: state.stepIndex + 1 });
    }

    function renderQuestion() {
        if (!current) return null;

        if (current.type === "lead") {
            return (
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-[var(--foreground)]">
                        {current.label}
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <input
                                type="text"
                                placeholder="Your name"
                                value={state.leadDraft.name ?? ""}
                                aria-describedby={state.errors["LEAD.name"] ? "LEAD.name-error" : undefined}
                                onChange={(e) =>
                                    dispatch({ type: "UPDATE_LEAD", field: "name", value: e.target.value })
                                }
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
                                onChange={(e) =>
                                    dispatch({ type: "UPDATE_LEAD", field: "email", value: e.target.value })
                                }
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
            const describedBy =
                [current.helperText ? helperId : undefined, state.errors[current.id] ? errorId : undefined]
                    .filter(Boolean)
                    .join(" ") || undefined;

            return (
                <div>
                    {current.helperText ? <HelperText id={helperId}>{current.helperText}</HelperText> : null}
                    <div className="mt-2">
                        <RadioPillGroup
                            name={current.id}
                            value={(state.answers as any)[current.id]}
                            options={current.options}
                            onChange={(val) =>
                                dispatch({ type: "UPDATE_ANSWER", questionId: current.id, value: val })
                            }
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
            const describedBy =
                [current.helperText ? helperId : undefined, state.errors[current.id] ? errorId : undefined]
                    .filter(Boolean)
                    .join(" ") || undefined;

            return (
                <div>
                    {current.helperText ? <HelperText id={helperId}>{current.helperText}</HelperText> : null}
                    <div className="mt-2">
                        <CheckboxCardGrid
                            values={values}
                            options={current.options}
                            onChange={(vals) =>
                                dispatch({ type: "UPDATE_ANSWER", questionId: current.id, value: vals })
                            }
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
                            onChange={(nv) =>
                                dispatch({ type: "UPDATE_ANSWER", questionId: current.id, value: nv })
                            }
                            leftLabel={
                                current.id === "Q7" ? "Not seasonal" : current.id === "Q8" ? "Low competition" : undefined
                            }
                            rightLabel={
                                current.id === "Q7" ? "Very seasonal" : current.id === "Q8" ? "High competition" : undefined
                            }
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
        const r = state.finalResults;

        const recapItems = QUESTIONS.filter((q) => q.type !== "lead").map((q) => {
            const id = q.id as keyof Answers;
            if (q.type === "radio") {
                return { label: q.label, value: getRadioLabel(q, state.answers[id] as number | undefined) };
            }
            if (q.type === "checkbox") {
                return { label: q.label, value: getCheckboxLabels(q, state.answers[id] as number[] | undefined) };
            }
            // slider
            const v = state.answers[id] as number | undefined;
            const shown = typeof v === "number" ? formatSliderAnswer(q.id as "Q7" | "Q8", v) : "—";
            return { label: q.label, value: shown };
        });

        // Show optional email capture at the top of results (optional_after_results, no email yet)
        const showOptionalEmail =
            effectiveLeadMode === "optional_after_results" && !state.leadDraft?.email;
        const OptionalEmailCapture = showOptionalEmail ? (
            <div className="mt-6 border-t border-[var(--border)] pt-4">
                <h3 className="font-heading text-lg text-[var(--foreground)]">Want a copy of your results?</h3>
                <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                    Leave your email and we’ll send this score.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                        <input
                            type="text"
                            placeholder="Your name (optional)"
                            value={state.leadDraft.name ?? ""}
                            onChange={(e) =>
                                dispatch({ type: "UPDATE_LEAD", field: "name", value: e.target.value })
                            }
                            className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={state.leadDraft.email ?? ""}
                            onChange={(e) =>
                                dispatch({ type: "UPDATE_LEAD", field: "email", value: e.target.value })
                            }
                            className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                        />
                    </div>
                </div>
            </div>
        ) : null;

        return (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                <div className="mb-4 text-sm text-[var(--foreground-muted)]">
                    Pinterest Potential — Results (temporary)
                </div>

                {OptionalEmailCapture}

                {r ? (
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                            <div className="text-xs text-[var(--foreground-muted)]">Monthly Pinterest Audience</div>
                            <div className="mt-1 font-heading text-2xl">{r.monthlyAudience.toLocaleString()}</div>
                        </div>

                        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                            <div className="text-xs text-[var(--foreground-muted)]">Avg Household Income</div>
                            <div className="mt-1 font-heading text-2xl">${r.avgHouseholdIncome.toLocaleString()}</div>
                        </div>

                        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                            <div className="text-xs text-[var(--foreground-muted)]">Avg Cart Size</div>
                            <div className="mt-1 font-heading text-2xl">${r.avgCartSize.toLocaleString()}</div>
                        </div>
                    </div>
                ) : (
                    <div className="font-heading text-3xl">Score: {state.finalScore}</div>
                )}

                {/* Recap */}
                <div className="mt-6 border-t border-[var(--border)] pt-4">
                    <div className="mb-2 font-heading text-lg text-[var(--foreground)]">Your answers</div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {recapItems.map((it, idx) => (
                            <div
                                key={`${idx}-${it.label}`}
                                className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4"
                            >
                                <div className="text-xs text-[var(--foreground-muted)]">{it.label}</div>
                                <div className="mt-1 text-sm text-[var(--foreground)]">{it.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 text-sm text-[var(--foreground-muted)]">
                    You can refresh the page; your draft is saved in this session.
                </div>
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
