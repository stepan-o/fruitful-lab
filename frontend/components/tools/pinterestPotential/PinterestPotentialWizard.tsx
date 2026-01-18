"use client";

// frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx
// v0.2 (Locked) — V2 wizard wired to new step components (Q1–Q8) + compute engine + lead gating.
//
// Fix (2026-01-12): Remove random A/B assignment.
// - Variant precedence:
//   1) Query param (?variant=welcome|no_welcome) / (?pp_variant=...) / (?ppcVariant=...)
//   2) Existing persisted draft.variant (sessionStorage v2)
//   3) Experiment cookie (best-effort; set by middleware/GrowthBook)
//   4) Default = "welcome" (no randomization)
//
// Also fixes a subtle reset bug:
// - clearDraft() removed sessionStorage, but draft state would immediately repersist old values.
// - Resets now also setDraft(INITIAL_DRAFT) to truly clear session draft.
//
// Fix (2026-01-13): Hydration gate for reload on Q1.
// - Prevent SSR/client branch mismatch (Welcome vs Wizard) by rendering a stable shell
//   until the component hydrates on the client.
//
// Fix (2026-01-17): Auto-advance determinism + redundant update prevention.
// - Only update answers when the new value actually differs.
// - Only auto-advance when a real patch change is provided (ignore undefined / no-op patches).
// - Prevent duplicate goNext from multiple autoAdvance calls (cancel timers + sequence guard).
// - Ensure auto-advance uses latest answers/step via refs (no stale closure overwrites).
// - Prevent Q2 double-trigger by removing inline autoAdvance in Q2 onChange; rely on Q2Niche onAutoAdvance.
//
// Fix (2026-01-18): Restore Q2 auto-advance deterministically.
// - Q2Niche currently calls onAutoAdvance(undefined) (seen in logs), so wizard must trigger autoAdvance({ niche: v })
//   on real selection changes. Dedupe guard already prevents double-advance if Q2Niche later starts passing patches.
//
// Fix (2026-01-18): Segment-dependent invalidation.
// - Q2 niche options depend on Q1 segment, so changing segment must clear niche (and segment-dependent goal).

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
} from "@/lib/tools/pinterestPotential/pinterestPotentialSpec";

import { resolveLeadGatingContext, normalizeLeadMode } from "@/lib/tools/pinterestPotential/leadMode";
import { LEAD_GATING_CONFIG } from "@/lib/tools/pinterestPotential/leadGatingConfig";
import { resolveLeadFromToken } from "@/lib/tools/pinterestPotential/leadToken";
import { PRIVACY_MICROCOPY } from "@/lib/tools/pinterestPotential/copy";
import { trackLeadSubmit } from "@/lib/gtm";

// Experiment cookie name (set in middleware)
import { PINTEREST_POTENTIAL_VARIANT_COOKIE } from "@/lib/tools/pinterestPotentialConfig";

import { usePinterestPotentialDraft } from "./usePinterestPotentialDraft";

// New V2 step components
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

// New pure UI views
import WelcomeView from "./views/WelcomeView";
import ResultsView from "./views/ResultsView";
import WizardView from "./views/WizardView";

// -----------------------------
// Small helpers
// -----------------------------
function getCookieValue(name: string): string | null {
    if (typeof document === "undefined") return null;
    const parts = document.cookie.split(";").map((s) => s.trim());
    for (const p of parts) {
        if (p.startsWith(name + "=")) return decodeURIComponent(p.slice(name.length + 1));
    }
    return null;
}

type PPCVariant = "welcome" | "no_welcome";

function normalizeVariant(raw?: string | null): PPCVariant | undefined {
    if (!raw) return undefined;
    return raw === "welcome" || raw === "no_welcome" ? (raw as PPCVariant) : undefined;
}

function readVariantCookie(): PPCVariant | undefined {
    if (typeof document === "undefined") return undefined;

    // Primary (canonical) cookie name used by middleware
    const primary = normalizeVariant(getCookieValue(PINTEREST_POTENTIAL_VARIANT_COOKIE));

    // Back-compat / future-proof fallbacks (harmless if absent)
    const fallback =
        normalizeVariant(getCookieValue("pp_variant")) ??
        normalizeVariant(getCookieValue("ppc_variant")) ??
        normalizeVariant(getCookieValue("pinterest_potential_variant"));

    return primary ?? fallback;
}

function formatRange(low: number, high: number): string {
    return `${low.toLocaleString()}–${high.toLocaleString()}`;
}

function opportunityLabel(type: ResultsBundle["opportunity_est"]["type"]): string {
    if (type === "traffic") return "Monthly traffic opportunity";
    if (type === "revenue") return "Monthly revenue opportunity";
    return "Monthly lead opportunity";
}

function mapGoalToSpec(segment: SpecSegment, raw?: string): PrimaryGoal | undefined {
    if (!raw) return undefined;

    // If UI ever starts sending spec slugs directly, accept them.
    const allowed = new Set(getPrimaryGoalOptions(segment).map((o) => o.id));
    if (allowed.has(raw as PrimaryGoal)) return raw as PrimaryGoal;

    // Current UI slugs (from Q7Goal.tsx) → spec slugs
    const map: Record<SpecSegment, Record<string, PrimaryGoal>> = {
        content_creator: {
            traffic: "traffic",
            subscribers: "email_subscribers",
            affiliate: "affiliate_revenue",
            sales: "course_product_sales",
        },
        product_seller: {
            sales: "sales",
            subscribers: "email_subscribers",
            retargeting: "retargeting_pool",
            discovery: "new_customer_discovery",
        },
        service_provider: {
            leads: "leads_calls",
            subscribers: "email_subscribers",
            webinar: "webinar_signups",
            authority: "authority_visibility",
        },
    };

    return map[segment]?.[raw];
}

function segmentLabel(seg?: SpecSegment): string {
    if (seg === "content_creator") return "Content Creator";
    if (seg === "product_seller") return "Product Seller";
    if (seg === "service_provider") return "Service Provider";
    return "—";
}

function valueLabelFromOptions<T extends string>(opts: Array<{ id: T; label: string }>, v?: string): string {
    if (!v) return "—";
    return opts.find((o) => o.id === v)?.label ?? v;
}

function getStepTitle(stepIndex: number): string {
    const titles: Record<number, string> = {
        1: "Which best describes your business?",
        2: "What’s your primary niche?",
        3: "Monthly output volume",
        4: "How strong is your visual content library right now?",
        5: "Which best describes your website right now?",
        6: "Offer clarity",
        7: "What’s your primary goal from Pinterest?",
        8: "Ads plan",
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
    const prevSeg = base.segment;
    const nextSeg = next.segment;

    // If segment changed, clear segment-dependent answers.
    if (prevSeg && nextSeg && prevSeg !== nextSeg) {
        const updated: AnswersV2 = { ...next };
        // Q2 depends on segment:
        delete updated.niche;
        // Q7 depends on segment:
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
     * If you need client-to-client callbacks, listen via events or ensure the parent is also a client component boundary.
     */
    onPhaseChangeAction?: (phase: "wizard" | "results") => void | Promise<void>;
    onStartAction?: () => void | Promise<void>; // analytics: tool_start
}) {
    const searchParams = useSearchParams();

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

    // ---- A/B variant (welcome vs no_welcome) ----
    const qpVariant =
        searchParams.get("variant") ?? searchParams.get("pp_variant") ?? searchParams.get("ppcVariant") ?? undefined;

    const requestedVariant = normalizeVariant(qpVariant);

    // ---- Lead gating overrides ----
    const qpLeadMode =
        searchParams.get("leadMode") ?? searchParams.get("lead_mode") ?? searchParams.get("leadmode") ?? undefined;

    const qpLeadToken = searchParams.get("leadToken") ?? searchParams.get("lead_token") ?? searchParams.get("token") ?? undefined;

    // Optional cookie override (best-effort; safe if absent)
    const cookieLeadMode =
        typeof document !== "undefined"
            ? getCookieValue("pp_lead_mode") ?? getCookieValue("pinterest_potential_lead_mode") ?? null
            : null;

    // ---- Draft persistence (sessionStorage v2) ----
    const { draft, setDraft, updateDraft, clearDraft } = usePinterestPotentialDraft(INITIAL_DRAFT);

    // Local answers state (backed by draft)
    const [answers, setAnswers] = useState<AnswersV2>(draft.answers ?? {});
    const [stepIndex, setStepIndex] = useState<number>(() => {
        const n = draft.stepIndex;
        return n >= 1 && n <= 8 ? n : 1;
    });

    // Keep latest state in refs to avoid stale closure overwrites (auto-advance + timers)
    const answersRef = useRef<AnswersV2>(answers);
    const stepIndexRef = useRef<number>(stepIndex);
    useEffect(() => {
        answersRef.current = answers;
    }, [answers]);
    useEffect(() => {
        stepIndexRef.current = stepIndex;
    }, [stepIndex]);

    // ---- Auto-advance guardrails (dedupe/cancel) ----
    const autoAdvanceSeqRef = useRef(0);
    const autoAdvanceTimerRef = useRef<number | null>(null);
    const lastAutoAdvanceSigRef = useRef<string>("");

    function cancelPendingAutoAdvance() {
        if (autoAdvanceTimerRef.current !== null) {
            window.clearTimeout(autoAdvanceTimerRef.current);
            autoAdvanceTimerRef.current = null;
        }
    }

    // ---- Wizard errors (per-step) ----
    const [errors, setErrors] = useState<Record<string, string>>({});

    // ---- Results state ----
    const [results, setResults] = useState<ResultsBundle | null>(null);
    const [resultsErrors, setResultsErrors] = useState<Record<string, string>>({});
    const [optionalLeadEmailError, setOptionalLeadEmailError] = useState<string | null>(null);
    const [optionalLeadSubmitted, setOptionalLeadSubmitted] = useState(false);

    // ---- Known lead resolution (initialLead OR leadToken) ----
    const [knownLead, setKnownLead] = useState<Lead | undefined>(initialLead);
    const [leadDraft, setLeadDraft] = useState<Partial<Lead>>(initialLead ?? {});
    const [leadSubmitted, setLeadSubmitted] = useState<boolean>(!!initialLead?.email);

    // ---- Analytics: tool_start (once) ----
    const hasStartedRef = useRef(false);

    // ---- Variant from cookie (best-effort) ----
    const cookieVariant = useMemo(() => readVariantCookie(), []);

    // ---- Variant persistence (NO RANDOMIZATION) ----
    useEffect(() => {
        // Highest precedence: explicit query param
        if (requestedVariant) {
            if (draft.variant !== requestedVariant) {
                updateDraft({
                    variant: requestedVariant,
                    // no_welcome implies started
                    started: requestedVariant === "no_welcome" ? true : draft.started,
                });
            }
            return;
        }

        // If draft already has a variant, keep it (session-stable)
        if (draft.variant) return;

        // Else try experiment cookie; else default welcome.
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
        // intentionally only on mount
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

    const isKnownLead = !!knownLead?.email;

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

    // ---- Derived wizard values (HOOKS MUST ALWAYS RUN) ----
    const TOTAL = 8;
    const isLastStep = stepIndex === TOTAL;

    const progressText = useMemo(() => `Step ${stepIndex} of ${TOTAL}`, [stepIndex]);
    const progressPct = useMemo(() => Math.round((stepIndex / TOTAL) * 100), [stepIndex]);

    const currentErrorKey = useMemo(
        () => getErrorKeyForStep(stepIndex, errors, resultsErrors),
        [errors, resultsErrors, stepIndex],
    );

    const header = useMemo(() => getStepTitle(stepIndex), [stepIndex]);

    function resetErrors() {
        setErrors({});
    }

    function fireToolStartOnce() {
        if (hasStartedRef.current) return;
        hasStartedRef.current = true;
        try {
            void onStartAction?.();
        } catch {
            // ignore
        }
    }

    function validateStep(si: number, a: AnswersV2): Record<string, string> {
        const e: Record<string, string> = {};

        if (si === 1) {
            if (!a.segment) e["Q1"] = "This question is required.";
        } else if (si === 2) {
            if (!a.segment) e["Q1"] = "Select your business type first.";
            if (!a.niche) e["Q2"] = "This question is required.";
        } else if (si === 3) {
            if (!a.volume_bucket) e["Q3"] = "This question is required.";
        } else if (si === 4) {
            if (!a.visual_strength) e["Q4"] = "This question is required.";
        } else if (si === 5) {
            if (!a.site_experience) e["Q5"] = "This question is required.";
        } else if (si === 6) {
            if (!a.offer_clarity) e["Q6"] = "This question is required.";
        } else if (si === 7) {
            if (!a.segment) e["Q1"] = "Select your business type first.";
            if (!a.primary_goal) e["Q7"] = "This question is required.";
        } else if (si === 8) {
            if (!a.growth_mode) e["Q8"] = "This question is required.";
        }

        return e;
    }

    const canContinue = useMemo(() => {
        const stepErrs = validateStep(stepIndex, answers);
        return Object.keys(stepErrs).length === 0;
    }, [stepIndex, answers]);

    function buildSpecAnswers(a: AnswersV2): SpecAnswers {
        const seg = a.segment as SpecSegment | undefined;
        return {
            Q1: seg,
            Q2: (a.niche as NicheSlug | undefined) ?? undefined,
            Q3: (a.volume_bucket as VolumeBucket | undefined) ?? undefined,
            Q4: (a.visual_strength as VisualStrength | undefined) ?? undefined,
            Q5: (a.site_experience as SiteExperience | undefined) ?? undefined,
            Q6: (a.offer_clarity as OfferClarity | undefined) ?? undefined,
            Q7: seg ? mapGoalToSpec(seg, a.primary_goal) : undefined,
            Q8: (a.growth_mode as GrowthMode | undefined) ?? undefined,
        };
    }

    function computeAndShowResults() {
        const specAnswers = buildSpecAnswers(answersRef.current);

        // Canonical validation (spec-level)
        const v = validateAnswers(specAnswers);
        if (!v.ok) {
            setResultsErrors(v.errors);
            setErrors(v.errors);

            const order: Array<keyof SpecAnswers> = ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8"];
            const first = order.find((k) => v.errors[String(k)]);
            if (first) {
                const idx = Number(String(first).slice(1)); // Q1 -> 1
                if (idx >= 1 && idx <= 8) setStepIndex(idx);
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
                if (idx >= 1 && idx <= 8) setStepIndex(idx);
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
        console.log("goNext triggered with nextAnswers:", nextAnswers);
        // Any manual navigation should cancel pending auto-advance.
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

        // Only commit if there is an actual change (prevents redundant writes / overwrites)
        if (nextAnswers && !shallowEqualAnswers(baseAnswers, nextAnswers)) {
            console.log("Updated answers in goNext:", nextAnswers);
            setAnswers(nextAnswers);
        }

        fireToolStartOnce();

        if (currentStep === TOTAL) {
            computeAndShowResults();
            return;
        }

        setStepIndex((s) => Math.min(TOTAL, s + 1));
        console.log("Step index updated after goNext:", stepIndex);
    }

    function autoAdvance(patch?: Partial<AnswersV2>) {
        console.log("autoAdvance called with patch:", patch);

        // Ignore undefined patches (some components call onAutoAdvance() with no args)
        if (!patch) return;

        const currentStepAtCall = stepIndexRef.current;
        const base = answersRef.current;

        // No-op patch? Do nothing
        if (patchIsNoop(base, patch)) return;

        let next = { ...base, ...patch } as AnswersV2;

        // ✅ Segment change invalidates segment-dependent answers (niche + goal)
        if (Object.prototype.hasOwnProperty.call(patch, "segment")) {
            next = applySegmentInvalidation(base, next);
        }

        // Dedupe repeated auto-advance calls for the same step+answers payload
        const sig = `${currentStepAtCall}:${JSON.stringify(next)}`;
        if (lastAutoAdvanceSigRef.current === sig) return;
        lastAutoAdvanceSigRef.current = sig;

        // Commit answers immediately so UI selection persists when revisiting the step.
        setAnswers(next);
        console.log("Answers after auto-advance patch:", next);

        // Cancel any pending auto-advance and schedule a single advance guarded by sequence.
        cancelPendingAutoAdvance();
        const seq = ++autoAdvanceSeqRef.current;

        autoAdvanceTimerRef.current = window.setTimeout(() => {
            // Ignore stale timers (newer auto-advance happened) or step changed (user navigated)
            if (seq !== autoAdvanceSeqRef.current) return;
            if (stepIndexRef.current !== currentStepAtCall) return;

            console.log("Advancing to next step after auto-advance");
            goNext(next);
        }, 140);
    }

    function goPrev() {
        // Going back must cancel pending auto-advance (prevents late goNext from previous step).
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
        const unlocked =
            leadState === "known" ||
            effectiveLeadMode === "soft_lock" ||
            (effectiveLeadMode === "hard_lock" && (leadSubmitted || isKnownLead));

        const showHardLockGate = effectiveLeadMode === "hard_lock" && leadState === "new" && !unlocked;

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
            {
                label: "Primary goal",
                value: seg ? valueLabelFromOptions(goalOpts, mapGoalToSpec(seg, answers.primary_goal)) : answers.primary_goal ?? "—",
            },
            { label: "Ads plan", value: answers.growth_mode ? answers.growth_mode.replace(/_/g, " ") : "—" },
        ];

        const showSoftLockGate = effectiveLeadMode === "soft_lock" && leadState === "new";

        return (
            <ResultsView
                results={results}
                audienceRangeLabel={formatRange(results.audience_est.low, results.audience_est.high)}
                opportunityLabel={opportunityLabel(results.opportunity_est.type)}
                opportunityRangeLabel={formatRange(results.opportunity_est.low, results.opportunity_est.high)}
                incomeRangeLabel={formatRange(results.income_est.low, results.income_est.high)}
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

                        // ✅ Repeat click = explicit confirm → advance
                        if (prevSeg === v && v) {
                            setErrors((prev) => {
                                if (!prev["Q1"]) return prev;
                                const n = { ...prev };
                                delete n["Q1"];
                                return n;
                            });

                            // Important: do NOT go through autoAdvance (it will noop). Just goNext.
                            goNext(answersRef.current);
                            return;
                        }

                        // normal change path (+ invalidation if segment changed)
                        setAnswers((p) => {
                            if (p.segment === v) return p;
                            const next: AnswersV2 = { ...p, segment: v };
                            const nextApplied = applySegmentInvalidation(p, next);
                            return nextApplied;
                        });

                        // Clear errors. If segment changed, clear Q2/Q7 too (those answers are now invalid).
                        setErrors((prev) => {
                            const hadAny = !!prev["Q1"] || (!!prevSeg && prevSeg !== v && (!!prev["Q2"] || !!prev["Q7"]));
                            if (!hadAny) return prev;
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
                            console.log("Q2Niche selected:", v);

                            const prev = answersRef.current.niche;

                            // ✅ Repeat click = explicit confirm → advance
                            if (prev === v && v) {
                                setErrors((prevErrs) => {
                                    if (!prevErrs["Q2"]) return prevErrs;
                                    const updatedErrors = { ...prevErrs };
                                    delete updatedErrors["Q2"];
                                    return updatedErrors;
                                });

                                goNext(answersRef.current);
                                return;
                            }

                            // normal change path
                            setAnswerField("niche", v);

                            setErrors((prevErrs) => {
                                if (!prevErrs["Q2"]) return prevErrs;
                                const updatedErrors = { ...prevErrs };
                                delete updatedErrors["Q2"];
                                return updatedErrors;
                            });

                            // Keep this (Q2Niche still calls onAutoAdvance(undefined) in some paths)
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
                        onChange={(v) => setAnswerField("volume_bucket", v)}
                        onAutoAdvance={autoAdvance}
                    />
                ) : (
                    <div className="text-sm text-[var(--foreground-muted)]">Select your business type first.</div>
                )
            ) : null}

            {stepIndex === 4 ? (
                <Q4Visual value={answers.visual_strength} onChange={(v) => setAnswerField("visual_strength", v)} onAutoAdvance={autoAdvance} />
            ) : null}

            {stepIndex === 5 ? (
                <Q5Site value={answers.site_experience} onChange={(v) => setAnswerField("site_experience", v)} onAutoAdvance={autoAdvance} />
            ) : null}

            {stepIndex === 6 ? (
                answers.segment ? (
                    <Q6Offer
                        segment={answers.segment}
                        value={answers.offer_clarity}
                        onChange={(v) => setAnswerField("offer_clarity", v)}
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
                        onChange={(v) => setAnswerField("primary_goal", v)}
                        onAutoAdvance={autoAdvance}
                    />
                ) : (
                    <div className="text-sm text-[var(--foreground-muted)]">Select your business type first.</div>
                )
            ) : null}

            {stepIndex === 8 ? (
                <Q8GrowthMode value={answers.growth_mode} onChange={(v) => setAnswerField("growth_mode", v)} onAutoAdvance={autoAdvance} />
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
