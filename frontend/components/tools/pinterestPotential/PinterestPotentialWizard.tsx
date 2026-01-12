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

function valueLabelFromOptions<T extends string>(
    opts: Array<{ id: T; label: string }>,
    v?: string,
): string {
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

function getErrorKeyForStep(
    stepIndex: number,
    errors: Record<string, string>,
    resultsErrors: Record<string, string>,
) {
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
        searchParams.get("variant") ??
        searchParams.get("pp_variant") ??
        searchParams.get("ppcVariant") ??
        undefined;

    const requestedVariant = normalizeVariant(qpVariant);

    // ---- Lead gating overrides ----
    const qpLeadMode =
        searchParams.get("leadMode") ?? searchParams.get("lead_mode") ?? searchParams.get("leadmode") ?? undefined;

    const qpLeadToken =
        searchParams.get("leadToken") ?? searchParams.get("lead_token") ?? searchParams.get("token") ?? undefined;

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
        const specAnswers = buildSpecAnswers(answers);

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

    /**
     * goNext accepts optional `nextAnswers` to fix the auto-advance race:
     * - step component triggers onChange + onAutoAdvance immediately
     * - React state might not commit by the time we validate
     * - passing `nextAnswers` guarantees validation uses the updated answers
     */
    function goNext(nextAnswers?: AnswersV2) {
        resetErrors();

        const a = nextAnswers ?? answers;
        const stepErrs = validateStep(stepIndex, a);
        if (Object.keys(stepErrs).length > 0) {
            setErrors(stepErrs);
            return;
        }

        if (nextAnswers) setAnswers(nextAnswers);

        fireToolStartOnce();

        if (isLastStep) {
            computeAndShowResults();
            return;
        }

        setStepIndex((s) => Math.min(TOTAL, s + 1));
    }

    function autoAdvance(patch?: Partial<AnswersV2>) {
        const next = patch ? ({ ...answers, ...patch } as AnswersV2) : answers;

        // Pre-commit patch so UI shows selected state immediately
        if (patch) setAnswers(next);

        window.setTimeout(() => {
            goNext(next);
        }, 140);
    }

    function goPrev() {
        resetErrors();

        if (!started && variant === "welcome") return;

        // Allow going back to welcome if welcome variant and stepIndex is 1
        if (variant === "welcome" && started && stepIndex === 1) {
            updateDraft({ started: false });
            return;
        }

        if (stepIndex > 1) setStepIndex((s) => s - 1);
    }

    // -----------------------------
    // Welcome view
    // -----------------------------
    if (!started && variant === "welcome") {
        return (
            <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                {/* Animated gradient layer */}
                <div aria-hidden="true" className="ppc-welcome-gradient absolute inset-0" />

                {/* Glows (now drifting) */}
                <div
                    aria-hidden="true"
                    className="ppc-welcome-glow-1 pointer-events-none absolute -top-24 right-[-140px] h-72 w-72 rounded-full opacity-25 blur-3xl"
                    style={{ background: "var(--brand-raspberry)" }}
                />
                <div
                    aria-hidden="true"
                    className="ppc-welcome-glow-2 pointer-events-none absolute -bottom-24 left-[-140px] h-72 w-72 rounded-full opacity-15 blur-3xl"
                    style={{ background: "var(--brand-raspberry)" }}
                />

                {/* Content */}
                <div className="relative p-6 sm:p-8">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs text-[var(--foreground-muted)]">
                        <span className="h-2 w-2 rounded-full" style={{ background: "var(--brand-raspberry)" }} />
                        8 questions • ~60 seconds • saved this session
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                        <div>
                            <div className="text-sm text-[var(--foreground-muted)]">Pinterest Potential</div>
                            <h2 className="mt-1 font-heading text-2xl sm:text-3xl text-[var(--foreground)]">
                                See your growth snapshot
                            </h2>
                            <p className="mt-2 max-w-prose text-sm text-[var(--foreground-muted)]">
                                Answer a few quick questions and we’ll estimate your monthly audience + opportunity.
                            </p>
                        </div>

                        {/* lightweight hero */}
                        <div className="hidden sm:block text-[var(--foreground)]">
                            <svg width="150" height="96" viewBox="0 0 150 96" aria-hidden="true">
                                <rect x="10" y="54" width="16" height="32" rx="4" fill="currentColor" opacity="0.22" />
                                <rect x="36" y="42" width="16" height="44" rx="4" fill="currentColor" opacity="0.32" />
                                <rect x="62" y="30" width="16" height="56" rx="4" fill="currentColor" opacity="0.42" />
                                <path
                                    d="M18 36 C42 22, 74 22, 108 14"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    fill="none"
                                    opacity="0.35"
                                />
                                <circle cx="116" cy="13" r="5" fill="currentColor" opacity="0.55" />
                            </svg>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => {
                                updateDraft({ started: true, stepIndex: 1 });
                                fireToolStartOnce();
                            }}
                            className={[
                                "rounded-lg bg-[var(--brand-raspberry)] px-5 py-2.5 text-sm font-semibold text-white transition",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                                "active:scale-[0.98]",
                            ].join(" ")}
                        >
                            Start
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                // True reset: clear storage + reset draft state to initial
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
                            className={[
                                "rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] transition",
                                "hover:bg-[var(--card-hover)] active:scale-[0.98]",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                            ].join(" ")}
                        >
                            Reset
                        </button>
                    </div>
                </div>
            </div>
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
                value: seg
                    ? valueLabelFromOptions(goalOpts, mapGoalToSpec(seg, answers.primary_goal))
                    : answers.primary_goal ?? "—",
            },
            { label: "Ads plan", value: answers.growth_mode ? answers.growth_mode.replace(/_/g, " ") : "—" },
        ];

        const ResultsCards = (
            <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="text-xs text-[var(--foreground-muted)]">Monthly Pinterest audience</div>
                    <div className="mt-1 font-heading text-2xl">
                        {formatRange(results.audience_est.low, results.audience_est.high)}
                    </div>
                </div>

                <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="text-xs text-[var(--foreground-muted)]">{opportunityLabel(results.opportunity_est.type)}</div>
                    <div className="mt-1 font-heading text-2xl">
                        {formatRange(results.opportunity_est.low, results.opportunity_est.high)}
                    </div>
                </div>

                <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="text-xs text-[var(--foreground-muted)]">Audience income range (USD)</div>
                    <div className="mt-1 font-heading text-2xl">
                        {formatRange(results.income_est.low, results.income_est.high)}
                    </div>
                </div>
            </div>
        );

        const LeadCaptureHardLock = showHardLockGate ? (
            <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                    <div>
                        <h3 className="font-heading text-lg text-[var(--foreground)]">Unlock your results</h3>
                        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                            Enter your email to view the full snapshot.
                        </p>
                        <p className="mt-2 text-xs text-[var(--foreground-muted)]">{PRIVACY_MICROCOPY}</p>
                    </div>

                    <div className="mt-3 sm:mt-0 sm:col-span-2">
                        <div className="grid gap-3 sm:grid-cols-2">
                            {LEAD_GATING_CONFIG.lead_gating.capture_fields.name.required ? (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        value={leadDraft.name ?? ""}
                                        onChange={(e) => setLeadDraft((p) => ({ ...p, name: e.target.value }))}
                                        className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                                    />
                                    {errors["LEAD.name"] ? (
                                        <div className="mt-1 text-xs text-red-500">{errors["LEAD.name"]}</div>
                                    ) : null}
                                </div>
                            ) : (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Your name (optional)"
                                        value={leadDraft.name ?? ""}
                                        onChange={(e) => setLeadDraft((p) => ({ ...p, name: e.target.value }))}
                                        className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                                    />
                                </div>
                            )}

                            <div>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={leadDraft.email ?? ""}
                                    onChange={(e) => setLeadDraft((p) => ({ ...p, email: e.target.value }))}
                                    className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                                />
                                {errors["LEAD.email"] ? (
                                    <div className="mt-1 text-xs text-red-500">{errors["LEAD.email"]}</div>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-3">
                            <button
                                type="button"
                                onClick={() => {
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

                                    // TODO: wire actual submit to backend when available
                                    setLeadSubmitted(true);
                                }}
                                className="rounded-md bg-[var(--brand-raspberry)] px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                            >
                                Unlock
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;

        const LeadCaptureSoftLock =
            effectiveLeadMode === "soft_lock" && leadState === "new" ? (
                <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                        <div>
                            <h3 className="font-heading text-lg text-[var(--foreground)]">Want a copy of your results?</h3>
                            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                                Leave your email and we’ll send this snapshot.
                            </p>
                            <p className="mt-2 text-xs text-[var(--foreground-muted)]">{PRIVACY_MICROCOPY}</p>
                        </div>

                        <div className="mt-3 sm:mt-0 sm:col-span-2">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Your name (optional)"
                                        value={leadDraft.name ?? ""}
                                        onChange={(e) => setLeadDraft((p) => ({ ...p, name: e.target.value }))}
                                        className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                                    />
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={leadDraft.email ?? ""}
                                        onChange={(e) => setLeadDraft((p) => ({ ...p, email: e.target.value }))}
                                        className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                                    />
                                    {optionalLeadEmailError ? (
                                        <div className="mt-1 text-xs text-red-500">{optionalLeadEmailError}</div>
                                    ) : null}
                                </div>
                            </div>

                            <div className="mt-3">
                                <button
                                    type="button"
                                    disabled={optionalLeadSubmitted}
                                    onClick={() => {
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

                                        // TODO: wire actual email send to backend when available.
                                        setOptionalLeadSubmitted(true);
                                    }}
                                    className="rounded-md bg-[var(--brand-raspberry)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                                >
                                    {optionalLeadSubmitted ? "Sent" : "Email me my results"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null;

        return (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                <div className="mb-2 text-sm text-[var(--foreground-muted)]">Pinterest Potential — Results</div>

                {LeadCaptureHardLock}

                <div className={showHardLockGate ? "mt-4 opacity-40 blur-[2px] pointer-events-none select-none" : "mt-4"}>
                    {ResultsCards}

                    {results.insight_line ? (
                        <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--foreground)]">
                            {results.insight_line}
                        </div>
                    ) : null}

                    <div className="mt-3 text-xs text-[var(--foreground-muted)]">
                        Seasonality:{" "}
                        <span className="text-[var(--foreground)]">{results.inferred.seasonality_index}</span> • Competition:{" "}
                        <span className="text-[var(--foreground)]">{results.inferred.competition_index}</span>
                    </div>

                    {LeadCaptureSoftLock}
                </div>

                {/* Recap */}
                <div className="mt-6 border-t border-[var(--border)] pt-4">
                    <div className="mb-2 font-heading text-lg text-[var(--foreground)]">Your answers</div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {recap.map((it, idx) => (
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

                <div className="mt-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => {
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
                        className="rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--card-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                        Start over
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setResults(null);
                            setStepIndex(8);
                            void onPhaseChangeAction?.("wizard");
                        }}
                        className="rounded-md bg-[var(--brand-raspberry)] px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                        Edit answers
                    </button>
                </div>

                <div className="mt-4 text-sm text-[var(--foreground-muted)]">
                    You can refresh the page; your draft is saved in this session.
                </div>
            </div>
        );
    }

    // -----------------------------
    // Wizard view (Q1–Q8)
    // -----------------------------
    return (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            {/* Progress (upgraded chrome) */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
                    <span>{progressText}</span>
                    <span>{progressPct}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-[var(--background)]">
                    <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(stepIndex / TOTAL) * 100}%`, background: "var(--brand-raspberry)" }}
                    />
                </div>
            </div>

            {/* Question */}
            <div>
                <h2 className="font-heading text-xl text-[var(--foreground)]">{header}</h2>

                <div className="mt-4">
                    {stepIndex === 1 ? (
                        <Q1Segment
                            value={answers.segment}
                            onChange={(v) => {
                                // keep state + clear only this step's visible error immediately
                                setAnswers((p) => ({ ...p, segment: v }));
                                setErrors((prev) => {
                                    if (!prev["Q1"]) return prev;
                                    const n = { ...prev };
                                    delete n["Q1"];
                                    return n;
                                });
                            }}
                            onAutoAdvance={(seg) => autoAdvance({ segment: seg })}
                        />
                    ) : null}

                    {stepIndex === 2 ? (
                        answers.segment ? (
                            <Q2Niche
                                segment={answers.segment}
                                value={answers.niche}
                                onChange={(v) => setAnswers((p) => ({ ...p, niche: v }))}
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
                                onChange={(v) => setAnswers((p) => ({ ...p, volume_bucket: v }))}
                                onAutoAdvance={autoAdvance}
                            />
                        ) : (
                            <div className="text-sm text-[var(--foreground-muted)]">Select your business type first.</div>
                        )
                    ) : null}

                    {stepIndex === 4 ? (
                        <Q4Visual
                            value={answers.visual_strength}
                            onChange={(v) => setAnswers((p) => ({ ...p, visual_strength: v }))}
                            onAutoAdvance={autoAdvance}
                        />
                    ) : null}

                    {stepIndex === 5 ? (
                        <Q5Site
                            value={answers.site_experience}
                            onChange={(v) => setAnswers((p) => ({ ...p, site_experience: v }))}
                            onAutoAdvance={autoAdvance}
                        />
                    ) : null}

                    {stepIndex === 6 ? (
                        answers.segment ? (
                            <Q6Offer
                                segment={answers.segment}
                                value={answers.offer_clarity}
                                onChange={(v) => setAnswers((p) => ({ ...p, offer_clarity: v }))}
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
                                onChange={(v) => setAnswers((p) => ({ ...p, primary_goal: v }))}
                                onAutoAdvance={autoAdvance}
                            />
                        ) : (
                            <div className="text-sm text-[var(--foreground-muted)]">Select your business type first.</div>
                        )
                    ) : null}

                    {stepIndex === 8 ? (
                        <Q8GrowthMode
                            value={answers.growth_mode}
                            onChange={(v) => setAnswers((p) => ({ ...p, growth_mode: v }))}
                            onAutoAdvance={autoAdvance}
                        />
                    ) : null}

                    {currentErrorKey ? (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                            <span className="inline-block h-2 w-2 rounded-full bg-red-400" aria-hidden="true" />
                            <span>{errors[currentErrorKey] ?? resultsErrors[currentErrorKey]}</span>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Nav */}
            <div className="mt-6 flex items-center justify-between">
                <button
                    type="button"
                    onClick={goPrev}
                    className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] transition hover:bg-[var(--card-hover)] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    disabled={variant === "welcome" ? (!started ? true : stepIndex === 1) : stepIndex === 1}
                >
                    Back
                </button>

                <button
                    type="button"
                    onClick={() => goNext()}
                    disabled={!canContinue}
                    className={[
                        "rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition",
                        "bg-[var(--brand-raspberry)]",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                        "active:scale-[0.98]",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                    ].join(" ")}
                >
                    {isLastStep ? "Calculate" : "Continue"}
                </button>
            </div>
        </div>
    );
}
