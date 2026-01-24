"use client";

/**
 * Pinterest Potential Calculator — Wizard (v0.3 Locked)
 *
 * CLEAN CONTRACT (enforced):
 * - Query params (canonical only):
 *   - ?variant=welcome|no_welcome
 *   - ?leadMode=hard_lock|soft_lock
 *   - ?leadToken=...
 * - Variant resolution (no randomization):
 *   1) query param (?variant)
 *   2) experiment cookie (PINTEREST_POTENTIAL_VARIANT_COOKIE)
 *   3) default = "welcome"
 * - Answers contract:
 *   - Step components must emit canonical spec IDs for:
 *     - Q1 segment
 *     - Q2 niche
 *     - Q7 primary_goal
 *   - Wizard verifies Q2/Q7 are valid for the selected segment; otherwise treated as missing.
 *
 * RESULTS CONTRACT (v1.1 — sessions-based):
 * - computeResults() returns ResultsBundle with:
 *   - demand:
 *       - demand_base_sessions_est
 *       - distribution_capacity_m
 *       - conversion_readiness_m
 *       - likely_pinterest_sessions_est
 *   - segment_outcome:
 *       - content_creator: monthly_pinterest_sessions_est
 *       - product_seller:
 *           monthly_pinterest_sessions_est
 *           monthly_purchase_intent_sessions_est
 *           revenue_by_aov_est
 *           assumptions
 *       - service_provider:
 *           monthly_discovery_calls_est
 *           assumptions
 *   - demographics: household_income_usd (+ notes)
 *   - inferred: seasonality_index, competition_index, tags
 *   - insight_line
 *
 * RUNTIME GUARDRAILS (kept from locked version):
 * - Hydration gate to prevent SSR/client mismatch.
 * - Auto-advance determinism:
 *   - ignore undefined/no-op patches
 *   - cancel pending timers on navigation
 *   - sequence guard + step guard to prevent late/double advances
 *   - refs to avoid stale closures
 * - Q2 fallback: if Q2Niche fails to provide patch via onAutoAdvance (observed undefined),
 *   wizard triggers autoAdvance({ niche: v }) on real onChange.
 * - Segment-dependent invalidation: changing segment clears niche + primary_goal.
 * - Repeat-click confirm: clicking the same selection again advances to next step.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { computeResults, type ResultsBundle } from "@/lib/tools/pinterestPotential/compute";
import {
    type Answers as SpecAnswers,
    type Lead,
    type LeadMode,
    type NicheSlug,
    type PrimaryGoal,
    type Segment as SpecSegment,
    validateAnswers,
    validateLead,
    getNicheOptions,
    getPrimaryGoalOptions,
    getQ3Prompt,
    getQ6Prompt,
} from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";

import { resolveLeadGatingContext, normalizeLeadMode } from "@/lib/tools/pinterestPotential/leadMode";
import { LEAD_GATING_CONFIG } from "@/lib/tools/pinterestPotential/leadGatingConfig";
import { resolveLeadFromToken } from "@/lib/tools/pinterestPotential/leadToken";
import { PRIVACY_MICROCOPY } from "@/lib/tools/pinterestPotential/copy";
import { trackLeadSubmit } from "@/lib/gtm";

import { PINTEREST_POTENTIAL_VARIANT_COOKIE } from "@/lib/tools/pinterestPotentialConfig";

import { usePinterestPotentialDraft } from "./usePinterestPotentialDraft";

// V2 step components
import Q1Segment from "./steps/Q1Segment";
import Q2Niche from "./steps/Q2Niche";
import Q3Volume from "./steps/Q3Volume";
import Q4Visual from "./steps/Q4Visual";
import Q5Site from "./steps/Q5Site";
import Q6Offer from "./steps/Q6Offer";
import Q7Goal from "./steps/Q7Goal";
import Q8GrowthMode from "./steps/Q8GrowthMode";

import type {
    AnswersV2,
    GrowthMode,
    OfferClarity,
    SiteExperience,
    VisualStrength,
    VolumeBucket,
} from "./steps/ppcV2Types";

// Pure UI views
import WelcomeView from "./views/WelcomeView";
import ResultsView from "./views/ResultsView";
import WizardView from "./views/WizardView";

// -----------------------------
// Helpers
// -----------------------------
type PPCVariant = "welcome" | "no_welcome";

function getCookieValue(name: string): string | null {
    if (typeof document === "undefined") return null;
    const parts = document.cookie.split(";").map((s) => s.trim());
    for (const p of parts) {
        if (p.startsWith(name + "=")) return decodeURIComponent(p.slice(name.length + 1));
    }
    return null;
}

function normalizeVariant(raw?: string | null): PPCVariant | undefined {
    if (!raw) return undefined;
    return raw === "welcome" || raw === "no_welcome" ? raw : undefined;
}

function readVariantCookie(): PPCVariant | undefined {
    if (typeof document === "undefined") return undefined;
    return normalizeVariant(getCookieValue(PINTEREST_POTENTIAL_VARIANT_COOKIE));
}

function formatRange(low: number, high: number): string {
    return `${low.toLocaleString()}–${high.toLocaleString()}`;
}

function segmentLabel(seg?: SpecSegment): string {
    if (seg === "content_creator") return "Content Creator";
    if (seg === "product_seller") return "Product Seller";
    if (seg === "service_provider") return "Service Provider";
    return "—";
}

function valueLabelFromOptions<T extends string>(opts: Array<{ id: T; label: string }>, v?: string): string {
    if (!v) return "—";
    return opts.find((o) => o.id === v)?.label ?? "—";
}

/**
 * Step header copy.
 * NOTE: Step 3 and Step 6 are segment-dependent and must use spec helper prompts.
 */
function getStepTitle(stepIndex: number, segment?: SpecSegment): string {
    const titles: Record<number, string> = {
        1: "Which best describes your business?",
        2: "What’s your primary niche?",
        3: segment ? getQ3Prompt(segment) : "Monthly output volume",
        4: "How strong is your visual content library right now?",
        5: "Which best describes your website right now?",
        6: segment ? getQ6Prompt(segment) : "Do you have a clear offer + booking flow?",
        7: "What’s your primary goal from Pinterest?",
        8: "Would you like to use Pinterest ads?",
    };
    return titles[stepIndex] ?? "Pinterest Potential";
}

function getErrorKeyForStep(stepIndex: number, errors: Record<string, string>, resultsErrors: Record<string, string>) {
    const keyByStep: Record<number, string[]> = {
        1: ["Q1"],
        2: ["Q2", "Q1"],
        3: ["Q3"],
        4: ["Q4"],
        5: ["Q5"],
        6: ["Q6"],
        7: ["Q7", "Q1"],
        8: ["Q8"],
    };
    const keys = keyByStep[stepIndex] ?? [];
    return keys.find((k) => errors[k]) ?? keys.find((k) => resultsErrors[k]) ?? null;
}

function shallowEqualAnswers(a: AnswersV2, b: AnswersV2): boolean {
    if (a === b) return true;
    const aKeys = Object.keys(a) as Array<keyof AnswersV2>;
    const bKeys = Object.keys(b) as Array<keyof AnswersV2>;
    if (aKeys.length !== bKeys.length) return false;
    for (const k of aKeys) {
        if (a[k] !== b[k]) return false;
    }
    return true;
}

function patchIsNoop(base: AnswersV2, patch: Partial<AnswersV2>): boolean {
    const keys = Object.keys(patch) as Array<keyof AnswersV2>;
    for (const k of keys) {
        if (base[k] !== patch[k]) return false;
    }
    return true;
}

function applySegmentInvalidation(base: AnswersV2, next: AnswersV2): AnswersV2 {
    // Q2 (niche) + Q7 (primary_goal) depend on Q1 (segment).
    if (base.segment && next.segment && base.segment !== next.segment) {
        const updated: AnswersV2 = { ...next };
        delete updated.niche;
        delete updated.primary_goal;
        return updated;
    }
    return next;
}

// -----------------------------
// Component
// -----------------------------
export default function PinterestPotentialWizard({
                                                     leadMode = LEAD_GATING_CONFIG.lead_gating.default_mode,
                                                     initialLead,
                                                     onPhaseChangeAction,
                                                     onStartAction,
                                                 }: {
    leadMode?: LeadMode;
    initialLead?: Lead;

    /**
     * NOTE: Name ends with "Action" to satisfy Next's client-boundary serialization rule.
     * If you need client-to-client callbacks, use events or keep the parent as a client boundary too.
     */
    onPhaseChangeAction?: (phase: "wizard" | "results") => void | Promise<void>;
    onStartAction?: () => void | Promise<void>; // analytics: tool_start
}) {
    const searchParams = useSearchParams();

    const TOTAL = 8;

    // ✅ Hydration gate (prevents SSR/client branch mismatch on reload)
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);

    const INITIAL_DRAFT = useMemo(
        () => ({
            stepIndex: 1,
            started: false,
            answers: {} as AnswersV2,
            variant: undefined as PPCVariant | undefined,
        }),
        [],
    );

    // ---- Canonical query params (contract) ----
    const requestedVariant = normalizeVariant(searchParams.get("variant"));
    const qpLeadMode = searchParams.get("leadMode") ?? undefined;
    const qpLeadToken = searchParams.get("leadToken") ?? undefined;

    // Optional cookie override for lead mode (keep only canonical)
    const cookieLeadMode = typeof document !== "undefined" ? getCookieValue("pp_lead_mode") : null;

    // ---- Draft persistence ----
    const { draft, setDraft, updateDraft, clearDraft } = usePinterestPotentialDraft(INITIAL_DRAFT);

    // Local answers state (backed by draft)
    const [answers, setAnswers] = useState<AnswersV2>(draft.answers ?? {});
    const [stepIndex, setStepIndex] = useState<number>(() => {
        const n = draft.stepIndex;
        return n >= 1 && n <= TOTAL ? n : 1;
    });

    // Refs to avoid stale closure overwrites (auto-advance + timers)
    const answersRef = useRef<AnswersV2>(answers);
    const stepIndexRef = useRef<number>(stepIndex);
    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);
    useEffect(() => {
        stepIndexRef.current = stepIndex;
    }, [stepIndex]);

    // ---- Auto-advance guardrails ----
    const autoAdvanceSeqRef = useRef(0);
    const autoAdvanceTimerRef = useRef<number | null>(null);
    const lastAutoAdvanceSigRef = useRef<string>("");

    function cancelPendingAutoAdvance() {
        if (autoAdvanceTimerRef.current !== null) {
            window.clearTimeout(autoAdvanceTimerRef.current);
            autoAdvanceTimerRef.current = null;
        }
    }

    // ---- Errors ----
    const [errors, setErrors] = useState<Record<string, string>>({});

    // ---- Results state ----
    const [results, setResults] = useState<ResultsBundle | null>(null);
    const [resultsErrors, setResultsErrors] = useState<Record<string, string>>({});
    const [optionalLeadEmailError, setOptionalLeadEmailError] = useState<string | null>(null);
    const [optionalLeadSubmitted, setOptionalLeadSubmitted] = useState(false);

    // ---- Known lead resolution ----
    const [knownLead, setKnownLead] = useState<Lead | undefined>(initialLead);
    const [leadDraft, setLeadDraft] = useState<Partial<Lead>>(initialLead ?? {});
    const [leadSubmitted, setLeadSubmitted] = useState<boolean>(!!initialLead?.email);

    const isKnownLead = !!knownLead?.email;

    // ---- Analytics: tool_start (once) ----
    const hasStartedRef = useRef(false);
    function fireToolStartOnce() {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;
        try {
            void onStartAction?.();
        } catch {
            // ignore
        }
    }

    // ---- Variant resolution (no randomization) ----
    const cookieVariant = useMemo(() => readVariantCookie(), []);
    useEffect(() => {
        // Highest precedence: explicit query param
        if (requestedVariant) {
            if (draft.variant !== requestedVariant) {
                updateDraft({
                    variant: requestedVariant,
                    started: requestedVariant === "no_welcome" ? true : draft.started,
                });
            }
            return;
        }

        // If draft already has a variant, keep it session-stable
        if (draft.variant) return;

        // Else use cookie, else default welcome.
        const resolved: PPCVariant = cookieVariant ?? "welcome";
        updateDraft({
            variant: resolved,
            started: resolved === "no_welcome" ? true : draft.started,
        });
    }, [requestedVariant, cookieVariant, draft.variant, draft.started, updateDraft]);

    const variant: PPCVariant = (requestedVariant ?? draft.variant ?? cookieVariant ?? "welcome") as PPCVariant;

    // If variant is no_welcome, force started.
    const started = variant === "no_welcome" ? true : draft.started;

    // Persist step + answers back to draft
    useEffect(() => {
        updateDraft({
            stepIndex,
            started,
            answers,
            variant,
        });
    }, [answers, stepIndex, started, variant, updateDraft]);

    // Inform parent phase on mount (wizard)
    useEffect(() => {
        void onPhaseChangeAction?.("wizard");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Resolve known lead from token
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const fromToken = await resolveLeadFromToken(qpLeadToken);
                if (!alive) return;
                if (fromToken?.email) {
                    setKnownLead(fromToken);
                    setLeadDraft((prev) => ({
                        name: prev.name ?? fromToken.name,
                        email: prev.email ?? fromToken.email,
                    }));
                    setLeadSubmitted(true);
                }
            } catch {
                // ignore
            }
        })();

        return () => {
            alive = false;
        };
    }, [qpLeadToken]);

    // Lead gating context
    const gating = useMemo(() => {
        const requested = normalizeLeadMode(qpLeadMode) ?? normalizeLeadMode(leadMode);
        return resolveLeadGatingContext({
            requested: qpLeadMode ?? (requested ? String(requested) : null),
            cookieValue: cookieLeadMode,
            isKnownLead,
        });
    }, [qpLeadMode, cookieLeadMode, isKnownLead, leadMode]);

    const effectiveLeadMode: LeadMode = gating.lead_mode;
    const leadState = gating.lead_state;

    // ---- Derived wizard values ----
    const isLastStep = stepIndex === TOTAL;
    const progressText = useMemo(() => `Step ${stepIndex} of ${TOTAL}`, [stepIndex]);
    const progressPct = useMemo(() => Math.round((stepIndex / TOTAL) * 100), [stepIndex]);
    const currentErrorKey = useMemo(
        () => getErrorKeyForStep(stepIndex, errors, resultsErrors),
        [errors, resultsErrors, stepIndex],
    );

    // Segment-aware headers (Q3 + Q6)
    const header = useMemo(
        () => getStepTitle(stepIndex, answers.segment as SpecSegment | undefined),
        [stepIndex, answers.segment],
    );

    function resetErrors() {
        setErrors({});
    }

    function validateStep(si: number, a: AnswersV2): Record<string, string> {
        const e: Record<string, string> = {};

        if (si === 1) {
            if (!a.segment) e["Q1"] = "This question is required.";
        } else if (si === 2) {
            const seg = a.segment;
            const segOk = seg === "content_creator" || seg === "product_seller" || seg === "service_provider";

            if (!segOk) e["Q1"] = "Select your business type first.";

            if (!a.niche) {
                e["Q2"] = "This question is required.";
            } else if (segOk) {
                const nicheOk = getNicheOptions(seg).some((o) => o.id === (a.niche as NicheSlug));
                if (!nicheOk) e["Q2"] = "This question is required.";
            }
        } else if (si === 3) {
            if (!a.volume_bucket) e["Q3"] = "This question is required.";
        } else if (si === 4) {
            if (!a.visual_strength) e["Q4"] = "This question is required.";
        } else if (si === 5) {
            if (!a.site_experience) e["Q5"] = "This question is required.";
        } else if (si === 6) {
            if (!a.offer_clarity) e["Q6"] = "This question is required.";
        } else if (si === 7) {
            const seg = a.segment;
            const segOk = seg === "content_creator" || seg === "product_seller" || seg === "service_provider";

            if (!segOk) e["Q1"] = "Select your business type first.";

            if (!a.primary_goal) {
                e["Q7"] = "This question is required.";
            } else if (segOk) {
                const goalOk = getPrimaryGoalOptions(seg).some((o) => o.id === (a.primary_goal as PrimaryGoal));
                if (!goalOk) e["Q7"] = "This question is required.";
            }
        } else if (si === 8) {
            if (!a.growth_mode) e["Q8"] = "This question is required.";
        }

        return e;
    }

    const canContinue = useMemo(() => {
        const stepErrs = validateStep(stepIndex, answers);
        return Object.keys(stepErrs).length === 0;
    }, [stepIndex, answers]);

    /**
     * Build spec answers while enforcing segment-dependent option validity for Q2/Q7.
     * Invalid values become undefined so validateAnswers() fails loudly and routes user correctly.
     */
    function buildSpecAnswers(a: AnswersV2): SpecAnswers {
        const seg = a.segment as SpecSegment | undefined;

        const nicheOk = !!seg && !!a.niche && getNicheOptions(seg).some((o) => o.id === (a.niche as NicheSlug));
        const goalOk =
            !!seg &&
            !!a.primary_goal &&
            getPrimaryGoalOptions(seg).some((o) => o.id === (a.primary_goal as PrimaryGoal));

        return {
            Q1: seg,
            Q2: nicheOk ? (a.niche as NicheSlug) : undefined,
            Q3: (a.volume_bucket as VolumeBucket | undefined) ?? undefined,
            Q4: (a.visual_strength as VisualStrength | undefined) ?? undefined,
            Q5: (a.site_experience as SiteExperience | undefined) ?? undefined,
            Q6: (a.offer_clarity as OfferClarity | undefined) ?? undefined,
            Q7: goalOk ? (a.primary_goal as PrimaryGoal) : undefined,
            Q8: (a.growth_mode as GrowthMode | undefined) ?? undefined,
        };
    }

    function computeAndShowResults() {
        const specAnswers = buildSpecAnswers(answersRef.current);

        const v = validateAnswers(specAnswers);
        if (!v.ok) {
            setResultsErrors(v.errors);
            setErrors(v.errors);

            const order: Array<keyof SpecAnswers> = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8"];
            const first = order.find((k) => v.errors[String(k)]);
            if (first) {
                const idx = Number(String(first).slice(1));
                if (idx >= 1 && idx <= TOTAL) setStepIndex(idx);
            }
            return;
        }

        const computed = computeResults(specAnswers);
        if (!computed.ok) {
            setResultsErrors(computed.errors);
            setErrors(computed.errors);

            const order = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8"];
            const first = order.find((k) => computed.errors[k]);
            if (first) {
                const idx = Number(first.slice(1));
                if (idx >= 1 && idx <= TOTAL) setStepIndex(idx);
            }
            return;
        }

        setResultsErrors({});
        setResults(computed.results);
        void onPhaseChangeAction?.("results");
    }

    function setAnswerField<K extends keyof AnswersV2>(key: K, value: AnswersV2[K]) {
        setAnswers((prev) => {
            if (prev[key] === value) return prev;
            return { ...prev, [key]: value };
        });
    }

    function goNext(nextAnswers?: AnswersV2) {
        cancelPendingAutoAdvance();
        resetErrors();

        const currentStep = stepIndexRef.current;
        const baseAnswers = answersRef.current;
        const a = nextAnswers ?? baseAnswers;

        const stepErrs = validateStep(currentStep, a);
        if (Object.keys(stepErrs).length > 0) {
            setErrors(stepErrs);
            return;
        }

        // Only commit if there is an actual change (prevents redundant overwrites)
        if (nextAnswers && !shallowEqualAnswers(baseAnswers, nextAnswers)) {
            setAnswers(nextAnswers);
        }

        fireToolStartOnce();

        if (currentStep === TOTAL) {
            computeAndShowResults();
            return;
        }

        setStepIndex((s) => Math.min(TOTAL, s + 1));
    }

    function autoAdvance(patch?: Partial<AnswersV2>) {
        // Some components may call onAutoAdvance() with no args: ignore.
        if (!patch) return;

        const currentStepAtCall = stepIndexRef.current;
        const base = answersRef.current;

        // No-op patch? ignore.
        if (patchIsNoop(base, patch)) return;

        let next = { ...base, ...patch } as AnswersV2;

        // Segment change invalidates segment-dependent answers.
        if (Object.prototype.hasOwnProperty.call(patch, "segment")) {
            next = applySegmentInvalidation(base, next);
        }

        // Dedupe identical emissions for same step+answers payload.
        const sig = `${currentStepAtCall}:${JSON.stringify(next)}`;
        if (lastAutoAdvanceSigRef.current === sig) return;
        lastAutoAdvanceSigRef.current = sig;

        // Commit answers immediately so selection persists.
        setAnswers(next);

        // Cancel pending and schedule guarded advance.
        cancelPendingAutoAdvance();
        const seq = ++autoAdvanceSeqRef.current;

        autoAdvanceTimerRef.current = window.setTimeout(() => {
            if (seq !== autoAdvanceSeqRef.current) return; // newer auto-advance happened
            if (stepIndexRef.current !== currentStepAtCall) return; // user navigated
            goNext(next);
        }, 140);
    }

    function goPrev() {
        cancelPendingAutoAdvance();
        resetErrors();

        if (!started && variant === "welcome") return;

        // Allow going back to welcome if welcome variant and stepIndex is 1
        if (variant === "welcome" && started && stepIndex === 1) {
            updateDraft({ started: false });
            return;
        }

        if (stepIndex > 1) setStepIndex((s) => s - 1);
    }

    // ✅ Hydration gate render
    if (!hydrated) {
        return (
            <WizardView
                progressText="Loading…"
                progressPct={0}
                header="Pinterest Potential Calculator"
                stepContent={<div className="text-sm text-[var(--foreground-muted)]">Loading your saved session…</div>}
                errorMessage={null}
                backDisabled={true}
                continueDisabled={true}
                continueLabel="Continue"
                onBack={() => {}}
                onContinue={() => {}}
            />
        );
    }

    // -----------------------------
    // Welcome view
    // -----------------------------
    if (!started && variant === "welcome") {
        return (
            <WelcomeView
                onStart={() => {
                    cancelPendingAutoAdvance();
                    updateDraft({ started: true, stepIndex: 1 });
                    fireToolStartOnce();
                }}
                onReset={() => {
                    cancelPendingAutoAdvance();
                    lastAutoAdvanceSigRef.current = "";
                    autoAdvanceSeqRef.current += 1;

                    clearDraft();
                    setDraft(INITIAL_DRAFT);

                    setAnswers({});
                    setStepIndex(1);
                    setErrors({});
                    setResultsErrors({});
                    setResults(null);
                    setOptionalLeadSubmitted(false);
                    setOptionalLeadEmailError(null);
                }}
            />
        );
    }

    // -----------------------------
    // Results view
    // -----------------------------
    if (results) {
        // ---- Compile-time contract asserts (prevents silent drift) ----
        // If compute.ts changes these keys, this file should fail to typecheck.
        const _demandKeys = {
            demand_base_sessions_est: true,
            distribution_capacity_m: true,
            conversion_readiness_m: true,
            likely_pinterest_sessions_est: true,
        } satisfies Record<keyof ResultsBundle["demand"], true>;
        void _demandKeys;

        const unlocked =
            leadState === "known" ||
            effectiveLeadMode === "soft_lock" ||
            (effectiveLeadMode === "hard_lock" && (leadSubmitted || isKnownLead));

        const showHardLockGate = effectiveLeadMode === "hard_lock" && leadState === "new" && !unlocked;
        const showSoftLockGate = effectiveLeadMode === "soft_lock" && leadState === "new";

        const seg = (answers.segment as SpecSegment | undefined) ?? undefined;
        const nicheOpts = seg ? getNicheOptions(seg) : [];
        const goalOpts = seg ? getPrimaryGoalOptions(seg) : [];

        const recap = [
            { label: "Business type", value: segmentLabel(seg) },
            { label: "Niche", value: valueLabelFromOptions(nicheOpts, answers.niche) },
            { label: "Monthly volume", value: answers.volume_bucket ?? "—" },
            { label: "Visual library", value: answers.visual_strength ? answers.visual_strength.replace(/_/g, " ") : "—" },
            { label: "Website experience", value: answers.site_experience ? answers.site_experience.toUpperCase() : "—" },
            { label: "Offer clarity", value: answers.offer_clarity ? answers.offer_clarity.replace(/_/g, " ") : "—" },
            { label: "Primary goal", value: valueLabelFromOptions(goalOpts, answers.primary_goal) },
            { label: "Ads plan", value: answers.growth_mode ? answers.growth_mode.replace(/_/g, " ") : "—" },
        ];

        // v1.1 headline labels (sessions-based)
        const demandBaseSessionsRangeLabel = formatRange(
            results.demand.demand_base_sessions_est.low,
            results.demand.demand_base_sessions_est.high,
        );

        const likelySessionsRangeLabel = formatRange(
            results.demand.likely_pinterest_sessions_est.low,
            results.demand.likely_pinterest_sessions_est.high,
        );

        const distributionCapacityLabel = `${results.demand.distribution_capacity_m.toFixed(2)}×`;

        const incomeRangeLabel = formatRange(
            results.demographics.household_income_usd.low,
            results.demographics.household_income_usd.high,
        );

        // Segment outcome headline
        const outcome = results.segment_outcome;
        let primaryOutcomeLabel: string;
        let primaryOutcomeRangeLabel: string;
        let purchaseIntentRangeLabel: string | undefined = undefined;

        if (outcome.kind === "content_creator") {
            primaryOutcomeLabel = "Monthly Pinterest sessions";
            primaryOutcomeRangeLabel = formatRange(
                outcome.monthly_pinterest_sessions_est.low,
                outcome.monthly_pinterest_sessions_est.high,
            );
        } else if (outcome.kind === "service_provider") {
            primaryOutcomeLabel = "Monthly discovery calls";
            primaryOutcomeRangeLabel = formatRange(
                outcome.monthly_discovery_calls_est.low,
                outcome.monthly_discovery_calls_est.high,
            );
        } else {
            // product_seller
            primaryOutcomeLabel = "Monthly Pinterest sessions";
            primaryOutcomeRangeLabel = formatRange(
                outcome.monthly_pinterest_sessions_est.low,
                outcome.monthly_pinterest_sessions_est.high,
            );
            purchaseIntentRangeLabel = formatRange(
                outcome.monthly_purchase_intent_sessions_est.low,
                outcome.monthly_purchase_intent_sessions_est.high,
            );
        }

        return (
            <ResultsView
                results={results}
                demandBaseSessionsRangeLabel={demandBaseSessionsRangeLabel}
                likelySessionsRangeLabel={likelySessionsRangeLabel}
                distributionCapacityLabel={distributionCapacityLabel}
                primaryOutcomeLabel={primaryOutcomeLabel}
                primaryOutcomeRangeLabel={primaryOutcomeRangeLabel}
                purchaseIntentRangeLabel={purchaseIntentRangeLabel}
                incomeRangeLabel={incomeRangeLabel}
                insightLine={results.insight_line ?? null}
                showHardLockGate={showHardLockGate}
                showSoftLockGate={showSoftLockGate}
                privacyMicrocopy={PRIVACY_MICROCOPY}
                leadName={leadDraft.name ?? ""}
                leadEmail={leadDraft.email ?? ""}
                requireName={!!LEAD_GATING_CONFIG.lead_gating.capture_fields.name.required}
                errors={errors}
                optionalLeadEmailError={optionalLeadEmailError}
                optionalLeadSubmitted={optionalLeadSubmitted}
                onLeadNameChange={(next) => setLeadDraft((p) => ({ ...p, name: next }))}
                onLeadEmailChange={(next) => setLeadDraft((p) => ({ ...p, email: next }))}
                onUnlock={() => {
                    resetErrors();
                    const lead: Lead = {
                        email: (leadDraft.email ?? "").trim(),
                        name: leadDraft.name?.trim() || undefined,
                    };

                    const v = validateLead(lead);
                    if (!v.ok) {
                        setErrors(v.errors);
                        return;
                    }

                    try {
                        trackLeadSubmit({
                            location: typeof window !== "undefined" ? window.location.pathname : "",
                            tool_name: "pinterest_potential",
                            button_label: "Unlock results",
                        });
                    } catch {
                        // ignore
                    }

                    setLeadSubmitted(true);
                }}
                onEmailResults={() => {
                    const email = (leadDraft.email ?? "").trim();
                    if (!email) {
                        setOptionalLeadEmailError("Please enter a valid email.");
                        return;
                    }

                    const v = validateLead({ email, name: leadDraft.name?.trim() || undefined });
                    if (!v.ok) {
                        setOptionalLeadEmailError("Please enter a valid email.");
                        return;
                    }

                    setOptionalLeadEmailError(null);

                    try {
                        trackLeadSubmit({
                            location: typeof window !== "undefined" ? window.location.pathname : "",
                            tool_name: "pinterest_potential",
                            button_label: "Email me my results",
                        });
                    } catch {
                        // ignore
                    }

                    setOptionalLeadSubmitted(true);
                }}
                recap={recap}
                onStartOver={() => {
                    cancelPendingAutoAdvance();
                    lastAutoAdvanceSigRef.current = "";
                    autoAdvanceSeqRef.current += 1;

                    clearDraft();
                    setDraft(INITIAL_DRAFT);

                    setAnswers({});
                    setStepIndex(1);
                    setResults(null);
                    setErrors({});
                    setResultsErrors({});
                    setOptionalLeadSubmitted(false);
                    setOptionalLeadEmailError(null);
                    void onPhaseChangeAction?.("wizard");
                }}
                onEditAnswers={() => {
                    cancelPendingAutoAdvance();
                    setResults(null);
                    setStepIndex(8);
                    void onPhaseChangeAction?.("wizard");
                }}
            />
        );
    }

    // -----------------------------
    // Wizard view (Q1–Q8)
    // -----------------------------
    const stepContent = (
        <>
            {stepIndex === 1 ? (
                <Q1Segment
                    value={answers.segment}
                    onChangeAction={(v) => {
                        const prevSeg = answersRef.current.segment;

                        // Repeat click = explicit confirm → advance
                        if (prevSeg === v && v) {
                            setErrors((prev) => {
                                if (!prev["Q1"]) return prev;
                                const n = { ...prev };
                                delete n["Q1"];
                                return n;
                            });
                            goNext(answersRef.current);
                            return;
                        }

                        // Normal change + invalidation
                        setAnswers((p) => {
                            if (p.segment === v) return p;
                            const next: AnswersV2 = { ...p, segment: v };
                            return applySegmentInvalidation(p, next);
                        });

                        // Clear Q1; if segment changed, Q2/Q7 are now invalid, clear their errors too.
                        setErrors((prev) => {
                            const n = { ...prev };
                            delete n["Q1"];
                            if (prevSeg && prevSeg !== v) {
                                delete n["Q2"];
                                delete n["Q7"];
                            }
                            return n;
                        });
                    }}
                    onAutoAdvanceAction={(seg) => autoAdvance({ segment: seg })}
                />
            ) : null}

            {stepIndex === 2 ? (
                answers.segment ? (
                    <Q2Niche
                        segment={answers.segment}
                        value={answers.niche}
                        onChange={(v) => {
                            const prev = answersRef.current.niche;

                            // Repeat click confirm
                            if (prev === v && v) {
                                setErrors((prevErrs) => {
                                    if (!prevErrs["Q2"]) return prevErrs;
                                    const n = { ...prevErrs };
                                    delete n["Q2"];
                                    return n;
                                });
                                goNext(answersRef.current);
                                return;
                            }

                            setAnswerField("niche", v);

                            setErrors((prevErrs) => {
                                if (!prevErrs["Q2"]) return prevErrs;
                                const n = { ...prevErrs };
                                delete n["Q2"];
                                return n;
                            });

                            // Deterministic fallback: Q2Niche has been observed calling onAutoAdvance(undefined).
                            autoAdvance({ niche: v });
                        }}
                        onAutoAdvance={autoAdvance}
                    />
                ) : (
                    <div className="text-sm text-[var(--foreground-muted)]">Select your business type first.</div>
                )
            ) : null}

            {stepIndex === 3 ? (
                answers.segment ? (
                    <Q3Volume
                        segment={answers.segment}
                        value={answers.volume_bucket}
                        onChange={(v) => {
                            const prev = answersRef.current.volume_bucket;

                            // Repeat click confirm
                            if (prev === v && v) {
                                setErrors((prevErrs) => {
                                    if (!prevErrs["Q3"]) return prevErrs;
                                    const n = { ...prevErrs };
                                    delete n["Q3"];
                                    return n;
                                });
                                goNext(answersRef.current);
                                return;
                            }

                            setAnswerField("volume_bucket", v);

                            setErrors((prevErrs) => {
                                if (!prevErrs["Q3"]) return prevErrs;
                                const n = { ...prevErrs };
                                delete n["Q3"];
                                return n;
                            });

                            // Deterministic fallback if component doesn't emit patch
                            autoAdvance({ volume_bucket: v });
                        }}
                        onAutoAdvance={autoAdvance}
                    />
                ) : (
                    <div className="text-sm text-[var(--foreground-muted)]">Select your business type first.</div>
                )
            ) : null}

            {stepIndex === 4 ? (
                <Q4Visual
                    value={answers.visual_strength}
                    onChange={(v) => {
                        const prev = answersRef.current.visual_strength;

                        // Repeat click confirm
                        if (prev === v && v) {
                            setErrors((prevErrs) => {
                                if (!prevErrs["Q4"]) return prevErrs;
                                const n = { ...prevErrs };
                                delete n["Q4"];
                                return n;
                            });
                            goNext(answersRef.current);
                            return;
                        }

                        setAnswerField("visual_strength", v);

                        setErrors((prevErrs) => {
                            if (!prevErrs["Q4"]) return prevErrs;
                            const n = { ...prevErrs };
                            delete n["Q4"];
                            return n;
                        });

                        // Deterministic fallback if component doesn't emit patch
                        autoAdvance({ visual_strength: v });
                    }}
                    onAutoAdvance={autoAdvance}
                />
            ) : null}

            {stepIndex === 5 ? (
                <Q5Site
                    value={answers.site_experience}
                    onChange={(v) => {
                        const prev = answersRef.current.site_experience;

                        if (prev === v && v) {
                            setErrors((prevErrs) => {
                                if (!prevErrs["Q5"]) return prevErrs;
                                const n = { ...prevErrs };
                                delete n["Q5"];
                                return n;
                            });
                            goNext(answersRef.current);
                            return;
                        }

                        setAnswerField("site_experience", v);
                        setErrors((prevErrs) => {
                            if (!prevErrs["Q5"]) return prevErrs;
                            const n = { ...prevErrs };
                            delete n["Q5"];
                            return n;
                        });
                    }}
                    onAutoAdvance={autoAdvance}
                />
            ) : null}

            {stepIndex === 6 ? (
                answers.segment ? (
                    <Q6Offer
                        segment={answers.segment}
                        value={answers.offer_clarity}
                        onChange={(v) => {
                            const prev = answersRef.current.offer_clarity;

                            if (prev === v && v) {
                                setErrors((prevErrs) => {
                                    if (!prevErrs["Q6"]) return prevErrs;
                                    const n = { ...prevErrs };
                                    delete n["Q6"];
                                    return n;
                                });
                                goNext(answersRef.current);
                                return;
                            }

                            setAnswerField("offer_clarity", v);
                            setErrors((prevErrs) => {
                                if (!prevErrs["Q6"]) return prevErrs;
                                const n = { ...prevErrs };
                                delete n["Q6"];
                                return n;
                            });
                        }}
                        onAutoAdvance={autoAdvance}
                    />
                ) : (
                    <div className="text-sm text-[var(--foreground-muted)]">Select your business type first.</div>
                )
            ) : null}

            {stepIndex === 7 ? (
                answers.segment ? (
                    <Q7Goal
                        segment={answers.segment}
                        value={answers.primary_goal}
                        onChange={(v) => {
                            const prev = answersRef.current.primary_goal;

                            if (prev === v && v) {
                                setErrors((prevErrs) => {
                                    if (!prevErrs["Q7"]) return prevErrs;
                                    const n = { ...prevErrs };
                                    delete n["Q7"];
                                    return n;
                                });
                                goNext(answersRef.current);
                                return;
                            }

                            setAnswerField("primary_goal", v);
                            setErrors((prevErrs) => {
                                if (!prevErrs["Q7"]) return prevErrs;
                                const n = { ...prevErrs };
                                delete n["Q7"];
                                return n;
                            });
                        }}
                        onAutoAdvance={autoAdvance}
                    />
                ) : (
                    <div className="text-sm text-[var(--foreground-muted)]">Select your business type first.</div>
                )
            ) : null}

            {stepIndex === 8 ? (
                <Q8GrowthMode
                    value={answers.growth_mode}
                    onChange={(v) => {
                        const prev = answersRef.current.growth_mode;

                        if (prev === v && v) {
                            setErrors((prevErrs) => {
                                if (!prevErrs["Q8"]) return prevErrs;
                                const n = { ...prevErrs };
                                delete n["Q8"];
                                return n;
                            });
                            goNext(answersRef.current);
                            return;
                        }

                        setAnswerField("growth_mode", v);
                        setErrors((prevErrs) => {
                            if (!prevErrs["Q8"]) return prevErrs;
                            const n = { ...prevErrs };
                            delete n["Q8"];
                            return n;
                        });
                    }}
                    onAutoAdvance={autoAdvance}
                />
            ) : null}
        </>
    );

    const errorMessage = currentErrorKey ? errors[currentErrorKey] ?? resultsErrors[currentErrorKey] : null;

    const backDisabled = variant === "welcome" ? (!started ? true : stepIndex === 1) : stepIndex === 1;
    const continueLabel = isLastStep ? "Calculate" : "Continue";

    return (
        <WizardView
            progressText={progressText}
            progressPct={progressPct}
            header={header}
            stepContent={stepContent}
            errorMessage={errorMessage}
            backDisabled={backDisabled}
            continueDisabled={!canContinue}
            continueLabel={continueLabel}
            onBack={goPrev}
            onContinue={() => goNext()}
        />
    );
}
