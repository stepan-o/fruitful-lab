// frontend/components/tools/pinterestPotential/views/ResultsView.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * v1.2 STRICT UI CONTRACT (breaking; NO back-compat):
 * ResultsView must NOT import compute.ts.
 * This file defines the minimal ResultsBundle shape it expects from the upstream controller/adapter.
 *
 * If compute/result types drift, update this file + the upstream mapping (no fallbacks).
 */
type Range = { low: number; high: number };
type Range01 = Range;

type DemandBundle = {
    demand_base_sessions_est: Range;
    distribution_capacity_m: number;
    conversion_readiness_m: number;
    likely_pinterest_sessions_est: Range;
};

type TrafficBundle = {
    website_sessions_est: Range;
    purchase_intent_sessions_est?: Range;
};

type CoursePriceBucket = string;
type AovBucket = string;

type ContentCreatorGoalOutcomeV2 =
    | {
    kind: "traffic";
    monthly_email_subscribers_est: Range;
    note: string;
}
    | {
    kind: "email_subscribers";
    monthly_email_subscribers_est: Range;
}
    | {
    kind: "affiliate_revenue";
    monthly_affiliate_revenue_usd_est: Range;
}
    | {
    kind: "course_product_sales";
    monthly_course_intent_sessions_est: Range;
    revenue_by_course_price_est: Record<CoursePriceBucket, Range>;
};

type ProductSellerGoalOutcomeV2 =
    | {
    kind: "sales";
    revenue_by_aov_est: Record<AovBucket, Range>;
}
    | {
    kind: "email_subscribers";
    monthly_email_subscribers_est: Range;
}
    | {
    kind: "retargeting_pool";
    monthly_retargetable_visitors_est: Range;
}
    | {
    kind: "new_customer_discovery";
    monthly_new_to_brand_sessions_est: Range;
};

type ServiceProviderGoalOutcomeV2 =
    | {
    kind: "leads_calls";
    monthly_discovery_calls_est: Range;
}
    | {
    kind: "email_subscribers";
    monthly_email_subscribers_est: Range;
}
    | {
    kind: "webinar_signups";
    monthly_webinar_signups_est: Range;
}
    | {
    kind: "authority_visibility";
    monthly_visibility_reach_est: Range;
};

type ContentCreatorAssumptionsV2 =
    | {
    kind: "traffic" | "email_subscribers";
    optin_rate_from_sessions: Range01;
    conversion_readiness_m: number;
}
    | {
    kind: "affiliate_revenue";
    rpm_usd: Range;
    conversion_readiness_m: number;
}
    | {
    kind: "course_product_sales";
    course_intent_share_of_sessions: Range01;
    enroll_rate_by_price: Record<CoursePriceBucket, Range01>;
    course_price_buckets: ReadonlyArray<{ id: CoursePriceBucket; label: string; low: number; high: number }>;
    conversion_readiness_m: number;
};

type ProductSellerAssumptionsV2 =
    | {
    kind: "sales";
    purchase_intent_share_of_sessions: Range01;
    ecommerce_cr_by_aov: Record<AovBucket, Range01>;
    aov_buckets: ReadonlyArray<{ id: AovBucket; label: string; low: number; high: number }>;
    conversion_readiness_m: number;
}
    | {
    kind: "email_subscribers";
    optin_rate_from_sessions: Range01;
    conversion_readiness_m: number;
}
    | {
    kind: "retargeting_pool";
    retargetable_share_of_sessions: Range01;
}
    | {
    kind: "new_customer_discovery";
    new_to_brand_share_of_sessions: Range01;
};

type ServiceProviderAssumptionsV2 =
    | {
    kind: "leads_calls";
    call_book_rate_from_sessions: Range01;
    conversion_readiness_m: number;
}
    | {
    kind: "email_subscribers";
    optin_rate_from_sessions: Range01;
    conversion_readiness_m: number;
}
    | {
    kind: "webinar_signups";
    webinar_signup_rate_from_sessions: Range01;
    conversion_readiness_m: number;
}
    | {
    kind: "authority_visibility";
    visibility_reach_per_session: Range;
};

type SegmentOutcome =
    | {
    kind: "content_creator";
    goal_key: string;
    primary_goal: string;
    goal_outcome: ContentCreatorGoalOutcomeV2;
    assumptions: ContentCreatorAssumptionsV2;
}
    | {
    kind: "product_seller";
    goal_key: string;
    primary_goal: string;
    goal_outcome: ProductSellerGoalOutcomeV2;
    assumptions: ProductSellerAssumptionsV2;
}
    | {
    kind: "service_provider";
    goal_key: string;
    primary_goal: string;
    goal_outcome: ServiceProviderGoalOutcomeV2;
    assumptions: ServiceProviderAssumptionsV2;
};

export type ResultsBundle = {
    demand: DemandBundle;
    traffic: TrafficBundle;
    segment_outcome: SegmentOutcome;

    demographics: {
        household_income_usd: Range;
        notes?: string[];
    };

    inferred: {
        seasonality_index: "low" | "medium" | "high";
        competition_index: "low" | "medium" | "high";
        tags?: string[];
    };

    insight_line?: string | null;
};

export type ResultsRecapItem = {
    label: string;
    value: string;
};

export type ResultsViewProps = {
    results: ResultsBundle;

    // Headline cards (pre-formatted strings so this stays pure UI)
    demandBaseSessionsRangeLabel: string; // results.demand.demand_base_sessions_est (range label)
    likelySessionsRangeLabel: string; // results.demand.likely_pinterest_sessions_est (range label)
    distributionCapacityLabel: string; // results.demand.distribution_capacity_m (e.g. "1.42×")

    // Segment outcome headline (pre-formatted)
    primaryOutcomeLabel: string; // e.g. "Monthly Pinterest sessions" / "Monthly discovery calls"
    primaryOutcomeRangeLabel: string; // range label
    purchaseIntentRangeLabel?: string; // product_seller only

    // Context
    incomeRangeLabel: string; // demographics household income (range label)
    insightLine: string | null;

    // Meta
    showHardLockGate: boolean;
    showSoftLockGate: boolean;
    privacyMicrocopy: string;

    // Lead capture (controlled)
    leadName: string;
    leadEmail: string;
    requireName: boolean;

    errors: Record<string, string>;
    optionalLeadEmailError: string | null;
    optionalLeadSubmitted: boolean;

    onLeadNameChange: (next: string) => void;
    onLeadEmailChange: (next: string) => void;

    onUnlock: () => void; // hard lock
    onEmailResults: () => void; // soft lock

    // Recap + actions
    recap: ResultsRecapItem[];

    onStartOver: () => void;
    onEditAnswers: () => void;
};

type HeroVariant = "locked" | "ready" | "unlocked" | "emailed";

// -----------------------------
// Utilities
// -----------------------------

function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
}

function formatNumber(num: number): string {
    const n = Math.round(num);
    if (n >= 1_000_000) return `${Math.round(n / 100_000) / 10}M`;
    if (n >= 1_000) return `${Math.round(n / 100) / 10}K`;
    return n.toString();
}

function formatRange(low: number, high: number): string {
    return `${formatNumber(low)}–${formatNumber(high)}`;
}

function formatPercent(v: number): string {
    const p = v * 100;
    const rounded = Math.round(p * 10) / 10;
    return `${rounded}%`;
}

function formatPercentRange(r: { low: number; high: number }): string {
    return `${formatPercent(r.low)}–${formatPercent(r.high)}`;
}

function mustGetRecordValue<V>(rec: Record<string, V>, key: string, label: string): V {
    if (!(key in rec)) {
        throw new Error(`Results UI contract error: Missing ${label} for key "${key}"`);
    }
    return rec[key] as V;
}

function assertRange(r: Range, name: string): Range {
    if (!r || typeof r.low !== "number" || typeof r.high !== "number") {
        throw new Error(`Results UI contract error: ${name} must be a {low,high} range`);
    }
    if (!Number.isFinite(r.low) || !Number.isFinite(r.high)) {
        throw new Error(`Results UI contract error: ${name} must be finite`);
    }
    if (r.low < 0 || r.high < 0 || r.low > r.high) {
        throw new Error(`Results UI contract error: ${name} invalid bounds (${r.low}–${r.high})`);
    }
    return r;
}

function assertFiniteNumber(v: unknown, name: string): number {
    if (typeof v !== "number" || !Number.isFinite(v)) {
        throw new Error(`Results UI contract error: ${name} must be a finite number`);
    }
    return v;
}

function useReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined") return;
        const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        if (!mq) return;
        const onChange = () => setReduced(!!mq.matches);
        onChange();
        if (mq.addEventListener) mq.addEventListener("change", onChange);
        else mq.addListener(onChange);
        return () => {
            if (mq.removeEventListener) mq.removeEventListener("change", onChange);
            else mq.removeListener(onChange);
        };
    }, []);
    return reduced;
}

// -----------------------------
// UI bits
// -----------------------------

function CheckBadge({ text }: { text: string }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs text-[var(--foreground)]">
            <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full text-white"
                aria-hidden="true"
                style={{ background: "var(--brand-raspberry)" }}
            >
                ✓
            </span>
            {text}
        </span>
    );
}

type FunnelCardProps = {
    step: string;
    label: string;
    value: string;
    sublabel?: string;
    width?: "full" | "medium" | "narrow";
};

function FunnelCard({ step, label, value, sublabel, width = "full" }: FunnelCardProps) {
    const widthClass = width === "full" ? "w-full" : width === "medium" ? "sm:w-[85%]" : "sm:w-[70%]";

    return (
        <div className={`${widthClass} mx-auto`}>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 relative">
                <div className="text-xs font-semibold text-[var(--foreground-muted)] mb-1">{step}</div>
                <div className="text-sm text-[var(--foreground)] mb-2">{label}</div>
                <div className="font-heading text-3xl sm:text-4xl text-[var(--foreground)] mb-3">{value}</div>
                {sublabel ? <div className="text-xs text-[var(--foreground-muted)]">{sublabel}</div> : null}
            </div>
        </div>
    );
}

function FunnelArrow() {
    return (
        <div className="flex justify-center py-2">
            <svg className="w-6 h-6 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        </div>
    );
}

function SoftDivider() {
    return <div className="h-px w-full bg-[var(--border)]/70 my-4" />;
}

function StatRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="text-sm text-[var(--foreground-muted)]">{label}</div>
            <div className="text-sm font-semibold text-[var(--foreground)]">{value}</div>
        </div>
    );
}

function Pill({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs text-[var(--foreground)]">
            {label}
        </span>
    );
}

// -----------------------------
// Candy burst overlay (unchanged)
// -----------------------------

type CandyBurstOverlayProps = {
    open: boolean;
    onClose: () => void;
    durationMs?: number; // overlay life
    intensity?: number; // 1..3
    headline?: string;
    subhead?: string;
};

type CandyPiece = {
    id: string;
    leftPct: number;
    topPx: number;
    dxPx: number;
    upPx: number;
    delayMs: number;
    durMs: number;
    spinDeg: number;
    swayPx: number;
    sizePx: number;
    radiusPx: number;
    bg: string;
    opacity: number;
};

function CandyBurstOverlay({
                               open,
                               onClose,
                               durationMs = 4200,
                               intensity = 2,
                               headline,
                               subhead,
                           }: CandyBurstOverlayProps) {
    const reducedMotion = useReducedMotion();
    const [pieces, setPieces] = useState<CandyPiece[]>([]);

    useEffect(() => {
        if (!open) return;

        // Reduced motion: show overlay briefly then close.
        if (reducedMotion) {
            const t = window.setTimeout(() => onClose(), 650);
            return () => window.clearTimeout(t);
        }

        const lvl = clamp(intensity, 1, 3);
        const count = lvl === 3 ? 140 : lvl === 2 ? 110 : 85;

        const originX = 50; // %
        const originY = Math.round(window.innerHeight * 0.52); // px

        const palette = [
            { a: "255,77,141", b: "255,209,102" },
            { a: "77,220,255", b: "184,255,77" },
            { a: "255,255,255", b: "255,77,141" },
            { a: "255,209,102", b: "77,220,255" },
            { a: "184,255,77", b: "255,255,255" },
        ];

        const makeBg = () => {
            const p = palette[Math.floor(Math.random() * palette.length)]!;
            const mode = Math.random();
            if (mode < 0.45) {
                return `linear-gradient(90deg,
          rgba(${p.a},1) 0%,
          rgba(${p.a},1) 20%,
          rgba(${p.b},1) 20%,
          rgba(${p.b},1) 40%,
          rgba(${p.a},1) 40%,
          rgba(${p.a},1) 60%,
          rgba(${p.b},1) 60%,
          rgba(${p.b},1) 80%,
          rgba(${p.a},1) 80%,
          rgba(${p.a},1) 100%)`;
            }
            if (mode < 0.78) {
                return `radial-gradient(circle at 28% 28%, rgba(255,255,255,0.85), rgba(255,255,255,0) 46%),
                linear-gradient(135deg, rgba(${p.a},1), rgba(${p.b},1))`;
            }
            return `radial-gradient(circle at 40% 35%, rgba(255,255,255,0.9), rgba(255,255,255,0) 40%),
              radial-gradient(circle at 65% 65%, rgba(${p.b},0.9), rgba(${p.b},0) 52%),
              linear-gradient(135deg, rgba(${p.a},1), rgba(${p.a},1))`;
        };

        const next: CandyPiece[] = Array.from({ length: count }).map((_, i) => {
            const spread = (Math.random() * 2 - 1) * (lvl === 3 ? 520 : lvl === 2 ? 440 : 360);
            const lift = 80 + Math.random() * (lvl === 3 ? 220 : 180);

            const dx = spread;
            const up = lift;

            const left =
                originX + (spread / (window.innerWidth || 1)) * 100 * 0.85 + (Math.random() * 8 - 4);
            const top = originY + (Math.random() * 36 - 18);

            const size = (lvl === 3 ? 10 : lvl === 2 ? 11 : 12) + Math.random() * (lvl === 3 ? 18 : 16);
            const radius = Math.random() < 0.45 ? size * 0.9 : Math.random() < 0.75 ? size * 0.35 : size * 0.15;

            const dur = 3400 + Math.random() * (lvl === 3 ? 2200 : 2000);
            const delay = Math.random() * (lvl === 3 ? 520 : 420);

            const spin = (Math.random() < 0.5 ? -1 : 1) * (520 + Math.random() * 980);
            const sway = (Math.random() < 0.5 ? -1 : 1) * (18 + Math.random() * 44);

            return {
                id: `candy-${Date.now()}-${i}`,
                leftPct: clamp(left, -5, 105),
                topPx: clamp(top, 0, window.innerHeight),
                dxPx: dx,
                upPx: up,
                delayMs: delay,
                durMs: dur,
                spinDeg: spin,
                swayPx: sway,
                sizePx: size,
                radiusPx: radius,
                bg: makeBg(),
                opacity: 0.92 - Math.random() * 0.18,
            };
        });

        // ✅ avoid setState synchronously inside effect body
        let raf = 0;
        raf = window.requestAnimationFrame(() => setPieces(next));

        const auto = window.setTimeout(() => onClose(), durationMs);
        return () => {
            window.cancelAnimationFrame(raf);
            window.clearTimeout(auto);
        };
    }, [open, reducedMotion, onClose, durationMs, intensity]);

    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    const overlay = (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={onClose} role="presentation">
            <div className="absolute inset-0 ppc-celebrate-scrim" aria-hidden="true" />

            <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
                {pieces.map((p) => (
                    <div
                        key={p.id}
                        className="ppc-candy"
                        style={
                            {
                                left: `${p.leftPct}%`,
                                top: `${p.topPx}px`,
                                "--dx": `${Math.round(p.dxPx)}px`,
                                "--up": `${Math.round(p.upPx)}px`,
                                "--dur": `${Math.round(p.durMs)}ms`,
                                "--delay": `${Math.round(p.delayMs)}ms`,
                                "--spin": `${Math.round(p.spinDeg)}deg`,
                                "--sway": `${Math.round(p.swayPx)}px`,
                                "--fall": `calc(100vh + 140px)`,
                                opacity: p.opacity,
                            } as React.CSSProperties
                        }
                    >
                        <div className="ppc-candy-sway">
                            <div className="ppc-candy-spin">
                                <div
                                    className="ppc-candy-piece"
                                    style={{
                                        width: `${Math.round(p.sizePx)}px`,
                                        height: `${Math.round(p.sizePx)}px`,
                                        borderRadius: `${Math.round(p.radiusPx)}px`,
                                        backgroundImage: p.bg,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative mx-6 max-w-xl text-center">
                {headline ? <div className="font-heading text-3xl sm:text-4xl text-white drop-shadow">{headline}</div> : null}
                {subhead ? <div className="mt-2 text-sm sm:text-base text-white/80">{subhead}</div> : null}

                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                    className="mt-6 inline-flex items-center justify-center rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                    Skip
                </button>
            </div>

            <style jsx>{`
                .ppc-candy {
                    position: absolute;
                    transform: translate3d(0, 0, 0);
                    will-change: transform, opacity;
                    animation: ppcDrop var(--dur) cubic-bezier(0.18, 0.86, 0.22, 1) var(--delay) both;
                }

                .ppc-candy-sway {
                    will-change: transform;
                    animation: ppcSway calc(var(--dur) * 0.62) ease-in-out var(--delay) infinite;
                }

                .ppc-candy-spin {
                    will-change: transform;
                    animation: ppcSpin var(--dur) ease-in-out var(--delay) both;
                }

                .ppc-candy-piece {
                    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.22);
                    filter: saturate(1.15);
                }

                @keyframes ppcDrop {
                    0% {
                        transform: translate3d(0, 12px, 0) scale(0.88);
                        opacity: 0;
                    }
                    8% {
                        opacity: 1;
                    }
                    22% {
                        transform: translate3d(calc(var(--dx) * 0.52), calc(var(--up) * -1), 0) scale(1);
                    }
                    100% {
                        transform: translate3d(var(--dx), var(--fall), 0) scale(1);
                        opacity: 0;
                    }
                }

                @keyframes ppcSpin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(var(--spin));
                    }
                }

                @keyframes ppcSway {
                    0%,
                    100% {
                        transform: translate3d(0, 0, 0);
                    }
                    50% {
                        transform: translate3d(var(--sway), 0, 0);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .ppc-candy,
                    .ppc-candy-sway,
                    .ppc-candy-spin {
                        animation: none !important;
                    }
                }
            `}</style>
        </div>
    );

    if (typeof document === "undefined") return null;
    return createPortal(overlay, document.body);
}

// -----------------------------
// Hero
// -----------------------------

function ResultsHero({ variant }: { variant: HeroVariant }) {
    const copy = useMemo(() => {
        if (variant === "locked") {
            return {
                eyebrow: "Completed",
                title: "All set — your snapshot is ready.",
                body: "Want help turning this into a plan? Book a strategy call.",
            };
        }
        if (variant === "ready") {
            return {
                eyebrow: "Completed",
                title: "Snapshot complete.",
                body: "Want help turning this into a plan? Book a strategy call.",
            };
        }
        if (variant === "emailed") {
            return {
                eyebrow: "Sent",
                title: "Done — check your inbox.",
                body: "Want help turning this into a plan? Book a strategy call.",
            };
        }
        return {
            eyebrow: "Unlocked",
            title: "Your full snapshot is live.",
            body: "Use this as a benchmark + a priority map (not a promise).",
        };
    }, [variant]);

    return (
        <div className="ppc-hero-glow relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] p-6 sm:p-7">
            <div className="relative">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                    <div>
                        <div className="text-xs font-semibold tracking-wide text-[var(--foreground-muted)]">{copy.eyebrow}</div>
                        <div className="mt-1 font-heading text-2xl text-[var(--foreground)] sm:text-3xl">{copy.title}</div>
                        <div className="mt-2 max-w-2xl text-sm text-[var(--foreground-muted)]">{copy.body}</div>
                    </div>

                    <div className="shrink-0">
                        <CheckBadge text="Completed • 8/8" />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <a
                        href="https://cal.com/fruitfullab/pinterest-strategy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-md bg-[var(--brand-raspberry)] px-8 py-4 text-base font-semibold text-white shadow-sm hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                        Book a Strategy Call →
                    </a>
                </div>
            </div>
        </div>
    );
}

// -----------------------------
// Goal-driven breakdowns (v1.2; strict; no hard-coded bucket IDs)
// -----------------------------

function SalesRevenueBreakdown({ seg }: { seg: Extract<SegmentOutcome, { kind: "product_seller" }> }) {
    const g = seg.goal_outcome;
    const a = seg.assumptions;

    if (g.kind !== "sales") return null;
    if (a.kind !== "sales") {
        throw new Error("Results UI contract error: product_seller:sales requires assumptions.kind === sales");
    }

    if (!a.aov_buckets || a.aov_buckets.length === 0) {
        throw new Error("Results UI contract error: product_seller:sales must include aov_buckets");
    }

    return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
            <div className="font-heading text-lg text-[var(--foreground)]">Revenue breakdown by AOV</div>
            <div className="mt-1 text-xs text-[var(--foreground-muted)]">
                Modeled from purchase-intent sessions × conversion rate × AOV bucket (with conversion readiness applied).
            </div>

            <div className="mt-4 space-y-3">
                {a.aov_buckets.map((b) => {
                    const r = mustGetRecordValue(
                        g.revenue_by_aov_est as unknown as Record<string, Range>,
                        b.id,
                        `revenue_by_aov_est.${b.id}`
                    );
                    const rr = assertRange(r, `revenue_by_aov_est.${b.id}`);

                    return (
                        <div
                            key={b.id}
                            className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3"
                        >
                            <div className="text-sm text-[var(--foreground)]">
                                <div className="font-semibold">AOV: {b.label}</div>
                                <div className="text-xs text-[var(--foreground-muted)]">
                                    CR assumed: {formatPercentRange(mustGetRecordValue(a.ecommerce_cr_by_aov as unknown as Record<string, Range01>, b.id, `ecommerce_cr_by_aov.${b.id}`))}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-heading text-xl text-[var(--foreground)]">${formatRange(rr.low, rr.high)}</div>
                                <div className="text-xs text-[var(--foreground-muted)]">per month</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function CourseRevenueBreakdown({ seg }: { seg: Extract<SegmentOutcome, { kind: "content_creator" }> }) {
    const g = seg.goal_outcome;
    const a = seg.assumptions;

    if (g.kind !== "course_product_sales") return null;
    if (a.kind !== "course_product_sales") {
        throw new Error("Results UI contract error: content_creator:course_product_sales requires assumptions.kind === course_product_sales");
    }

    if (!a.course_price_buckets || a.course_price_buckets.length === 0) {
        throw new Error("Results UI contract error: course_product_sales must include course_price_buckets");
    }

    const intent = assertRange(g.monthly_course_intent_sessions_est, "monthly_course_intent_sessions_est");

    return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
            <div className="font-heading text-lg text-[var(--foreground)]">Course/product breakdown</div>
            <div className="mt-1 text-xs text-[var(--foreground-muted)]">
                Revenue is modeled from intent sessions × enroll-rate by price × conversion readiness.
            </div>

            <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
                <div className="text-xs font-semibold text-[var(--foreground-muted)] mb-1">Intent sessions</div>
                <div className="font-heading text-2xl text-[var(--foreground)]">{formatRange(intent.low, intent.high)}</div>
                <div className="text-xs text-[var(--foreground-muted)]">sessions/mo</div>
            </div>

            <div className="mt-4 space-y-3">
                {a.course_price_buckets.map((b) => {
                    const r = mustGetRecordValue(
                        g.revenue_by_course_price_est as unknown as Record<string, Range>,
                        b.id,
                        `revenue_by_course_price_est.${b.id}`
                    );
                    const rr = assertRange(r, `revenue_by_course_price_est.${b.id}`);

                    const enroll = mustGetRecordValue(
                        a.enroll_rate_by_price as unknown as Record<string, Range01>,
                        b.id,
                        `enroll_rate_by_price.${b.id}`
                    );

                    return (
                        <div
                            key={b.id}
                            className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3"
                        >
                            <div className="text-sm text-[var(--foreground)]">
                                <div className="font-semibold">Price: {b.label}</div>
                                <div className="text-xs text-[var(--foreground-muted)]">Enroll assumed: {formatPercentRange(enroll)}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-heading text-xl text-[var(--foreground)]">${formatRange(rr.low, rr.high)}</div>
                                <div className="text-xs text-[var(--foreground-muted)]">per month</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// -----------------------------
// Main view (layout preserved; results wiring updated to v1.2)
// -----------------------------

export default function ResultsView(props: ResultsViewProps) {
    const locked = props.showHardLockGate;
    const emailed = props.optionalLeadSubmitted;

    const heroVariant: HeroVariant = emailed ? "emailed" : locked ? "locked" : props.showSoftLockGate ? "ready" : "unlocked";

    const [celebrate, setCelebrate] = useState(false);
    const [celebrateCfg, setCelebrateCfg] = useState<{
        durationMs: number;
        intensity: number;
        headline: string;
        subhead: string;
    } | null>(null);

    const prevLockedRef = useRef<boolean>(locked);
    const prevEmailedRef = useRef<boolean>(emailed);

    useEffect(() => {
        let t: number | null = null;

        if (prevLockedRef.current && !locked) {
            t = window.setTimeout(() => {
                setCelebrateCfg({
                    durationMs: 4300,
                    intensity: 3,
                    headline: "Unlocked.",
                    subhead: "Your full Pinterest Potential snapshot is ready.",
                });
                setCelebrate(true);
            }, 0);
        }

        prevLockedRef.current = locked;

        return () => {
            if (t != null) window.clearTimeout(t);
        };
    }, [locked]);

    useEffect(() => {
        let t: number | null = null;

        if (!prevEmailedRef.current && emailed) {
            t = window.setTimeout(() => {
                setCelebrateCfg({
                    durationMs: 3200,
                    intensity: 2,
                    headline: "Sent.",
                    subhead: "Snapshot delivered to your inbox.",
                });
                setCelebrate(true);
            }, 0);
        }

        prevEmailedRef.current = emailed;

        return () => {
            if (t != null) window.clearTimeout(t);
        };
    }, [emailed]);

    // -----------------------------
    // Result 1–3 (v1.2 strict rules)
    // -----------------------------
    const ResultsCards = useMemo(() => {
        const results = props.results;
        const segment = results.segment_outcome;

        // Result 1: demand (macro)
        const demand = assertRange(results.demand.demand_base_sessions_est, "results.demand.demand_base_sessions_est");

        // Result 2: traffic lens (goal-aware)
        const websiteSessions = assertRange(results.traffic.website_sessions_est, "results.traffic.website_sessions_est");
        const likelySessions = assertRange(results.demand.likely_pinterest_sessions_est, "results.demand.likely_pinterest_sessions_est");

        // Strict non-duplication: traffic.website_sessions_est MUST mirror demand.likely_pinterest_sessions_est
        if (websiteSessions.low !== likelySessions.low || websiteSessions.high !== likelySessions.high) {
            throw new Error("Results UI contract error: traffic.website_sessions_est must mirror demand.likely_pinterest_sessions_est");
        }

        const isSalesLens = segment.kind === "product_seller" && segment.primary_goal === "sales";

        // Strict: purchase_intent_sessions_est must exist for product_seller (compute enforces "at minimum"),
        // but Result 2 only *uses* it for sales goal.
        if (segment.kind !== "product_seller") {
            if (results.traffic.purchase_intent_sessions_est !== undefined) {
                throw new Error(`Results UI contract error: purchase_intent_sessions_est must be absent for segment=${segment.kind}`);
            }
        } else {
            if (!results.traffic.purchase_intent_sessions_est) {
                throw new Error("Results UI contract error: purchase_intent_sessions_est required for product_seller");
            }
        }

        const trafficLens: Range = isSalesLens
            ? assertRange(results.traffic.purchase_intent_sessions_est as Range, "results.traffic.purchase_intent_sessions_est")
            : websiteSessions;

        const distributionM = assertFiniteNumber(results.demand.distribution_capacity_m, "results.demand.distribution_capacity_m");

        const trafficLabel = isSalesLens
            ? "High-intent sessions to product pages"
            : "Website sessions you can get from Pinterest";

        const trafficSublabel = isSalesLens
            ? "A focused slice of sessions modeled as purchase-intent (used for sales outcomes)."
            : `Modeled sessions landing on your site from Pinterest (includes distribution capacity x${distributionM.toFixed(2)}).`;

        // Result 3: must match selected goal (goal_outcome-driven for ALL segments)
        if (segment.kind === "content_creator") {
            const goal = segment.goal_outcome;
            const a = segment.assumptions;

            const Result3 = (() => {
                if (goal.kind === "traffic") {
                    if (a.kind !== "traffic") throw new Error("Results UI contract error: assumptions.kind must be traffic");
                    return (
                        <FunnelCard
                            step="RESULT 3: LIST GROWTH"
                            label="From that traffic: monthly email subscribers"
                            value={formatRange(goal.monthly_email_subscribers_est.low, goal.monthly_email_subscribers_est.high)}
                            sublabel={`${goal.note} Assumes opt-in rate ${formatPercentRange(a.optin_rate_from_sessions)} × conversion readiness.`}
                            width="narrow"
                        />
                    );
                }

                if (goal.kind === "email_subscribers") {
                    if (a.kind !== "email_subscribers")
                        throw new Error("Results UI contract error: assumptions.kind must be email_subscribers");
                    return (
                        <FunnelCard
                            step="RESULT 3: EMAIL"
                            label="Monthly email subscribers"
                            value={formatRange(goal.monthly_email_subscribers_est.low, goal.monthly_email_subscribers_est.high)}
                            sublabel={`Assumes opt-in rate ${formatPercentRange(a.optin_rate_from_sessions)} × conversion readiness.`}
                            width="narrow"
                        />
                    );
                }

                if (goal.kind === "affiliate_revenue") {
                    if (a.kind !== "affiliate_revenue")
                        throw new Error("Results UI contract error: assumptions.kind must be affiliate_revenue");
                    return (
                        <FunnelCard
                            step="RESULT 3: AFFILIATE"
                            label="Affiliate revenue potential"
                            value={`$${formatRange(goal.monthly_affiliate_revenue_usd_est.low, goal.monthly_affiliate_revenue_usd_est.high)}`}
                            sublabel={`Modeled via RPM ($ per 1,000 sessions): $${formatNumber(a.rpm_usd.low)}–$${formatNumber(a.rpm_usd.high)}, nudged by conversion readiness.`}
                            width="narrow"
                        />
                    );
                }

                // course_product_sales
                if (a.kind !== "course_product_sales")
                    throw new Error("Results UI contract error: assumptions.kind must be course_product_sales");

                // Strict: highlight the first bucket deterministically (no hard-coded IDs).
                if (!a.course_price_buckets || a.course_price_buckets.length === 0) {
                    throw new Error("Results UI contract error: Missing course_price_buckets");
                }

                const firstBucket = a.course_price_buckets[0]!;
                const firstRev = mustGetRecordValue(
                    goal.revenue_by_course_price_est as unknown as Record<string, Range>,
                    firstBucket.id,
                    "revenue_by_course_price_est"
                );

                return (
                    <FunnelCard
                        step="RESULT 3: REVENUE"
                        label={`Revenue potential (example: ${firstBucket.label})`}
                        value={`$${formatRange(firstRev.low, firstRev.high)}`}
                        sublabel="Full breakdown by price point below."
                        width="narrow"
                    />
                );
            })();

            return (
                <div className="space-y-2">
                    <FunnelCard
                        step="RESULT 1: DEMAND"
                        label="Monthly demand in your niche (US+CA)"
                        value={formatRange(demand.low, demand.high)}
                        sublabel="General niche demand ceiling on Pinterest (macro benchmark; no execution applied)."
                        width="full"
                    />

                    <FunnelArrow />

                    <FunnelCard
                        step="RESULT 2: TRAFFIC"
                        label={trafficLabel}
                        value={formatRange(trafficLens.low, trafficLens.high)}
                        sublabel={trafficSublabel}
                        width="medium"
                    />

                    <FunnelArrow />

                    {Result3}
                </div>
            );
        }

        if (segment.kind === "product_seller") {
            const goal = segment.goal_outcome;
            const a = segment.assumptions;

            const Result3 = (() => {
                if (goal.kind === "sales") {
                    if (a.kind !== "sales") throw new Error("Results UI contract error: assumptions.kind must be sales");

                    if (!a.aov_buckets || a.aov_buckets.length === 0) {
                        throw new Error("Results UI contract error: Missing aov_buckets");
                    }

                    // Strict: highlight the first bucket deterministically (no hard-coded IDs).
                    const firstBucket = a.aov_buckets[0]!;
                    const r = mustGetRecordValue(
                        goal.revenue_by_aov_est as unknown as Record<string, Range>,
                        firstBucket.id,
                        "revenue_by_aov_est"
                    );

                    return (
                        <FunnelCard
                            step="RESULT 3: REVENUE"
                            label={`Monthly revenue potential (example: ${firstBucket.label})`}
                            value={`$${formatRange(r.low, r.high)}`}
                            sublabel="Full breakdown by AOV below."
                            width="narrow"
                        />
                    );
                }

                if (goal.kind === "email_subscribers") {
                    if (a.kind !== "email_subscribers")
                        throw new Error("Results UI contract error: assumptions.kind must be email_subscribers");
                    return (
                        <FunnelCard
                            step="RESULT 3: EMAIL"
                            label="Monthly email subscribers"
                            value={formatRange(goal.monthly_email_subscribers_est.low, goal.monthly_email_subscribers_est.high)}
                            sublabel={`Assumes opt-in rate ${formatPercentRange(a.optin_rate_from_sessions)} × conversion readiness.`}
                            width="narrow"
                        />
                    );
                }

                if (goal.kind === "retargeting_pool") {
                    if (a.kind !== "retargeting_pool")
                        throw new Error("Results UI contract error: assumptions.kind must be retargeting_pool");
                    return (
                        <FunnelCard
                            step="RESULT 3: RETARGETING"
                            label="Monthly retargetable visitors"
                            value={formatRange(goal.monthly_retargetable_visitors_est.low, goal.monthly_retargetable_visitors_est.high)}
                            sublabel={`Assumes retargetable share ${formatPercentRange(a.retargetable_share_of_sessions)} of sessions.`}
                            width="narrow"
                        />
                    );
                }

                // new_customer_discovery
                if (a.kind !== "new_customer_discovery")
                    throw new Error("Results UI contract error: assumptions.kind must be new_customer_discovery");
                return (
                    <FunnelCard
                        step="RESULT 3: NEW TO BRAND"
                        label="Monthly new-to-brand sessions"
                        value={formatRange(goal.monthly_new_to_brand_sessions_est.low, goal.monthly_new_to_brand_sessions_est.high)}
                        sublabel={`Assumes new-to-brand share ${formatPercentRange(a.new_to_brand_share_of_sessions)} of sessions.`}
                        width="narrow"
                    />
                );
            })();

            return (
                <div className="space-y-2">
                    <FunnelCard
                        step="RESULT 1: DEMAND"
                        label="Monthly demand in your niche (US+CA)"
                        value={formatRange(demand.low, demand.high)}
                        sublabel="General niche demand ceiling on Pinterest (macro benchmark; no execution applied)."
                        width="full"
                    />

                    <FunnelArrow />

                    <FunnelCard
                        step="RESULT 2: TRAFFIC"
                        label={trafficLabel}
                        value={formatRange(trafficLens.low, trafficLens.high)}
                        sublabel={trafficSublabel}
                        width="medium"
                    />

                    <FunnelArrow />

                    {Result3}
                </div>
            );
        }

        if (segment.kind === "service_provider") {
            const goal = segment.goal_outcome;
            const a = segment.assumptions;

            const Result3 = (() => {
                if (goal.kind === "leads_calls") {
                    if (a.kind !== "leads_calls") throw new Error("Results UI contract error: assumptions.kind must be leads_calls");
                    return (
                        <FunnelCard
                            step="RESULT 3: LEADS"
                            label="Monthly discovery calls"
                            value={formatRange(goal.monthly_discovery_calls_est.low, goal.monthly_discovery_calls_est.high)}
                            sublabel={`Assumes booking rate ${formatPercentRange(a.call_book_rate_from_sessions)} × conversion readiness.`}
                            width="narrow"
                        />
                    );
                }

                if (goal.kind === "email_subscribers") {
                    if (a.kind !== "email_subscribers")
                        throw new Error("Results UI contract error: assumptions.kind must be email_subscribers");
                    return (
                        <FunnelCard
                            step="RESULT 3: EMAIL"
                            label="Monthly email subscribers"
                            value={formatRange(goal.monthly_email_subscribers_est.low, goal.monthly_email_subscribers_est.high)}
                            sublabel={`Assumes opt-in rate ${formatPercentRange(a.optin_rate_from_sessions)} × conversion readiness.`}
                            width="narrow"
                        />
                    );
                }

                if (goal.kind === "webinar_signups") {
                    if (a.kind !== "webinar_signups")
                        throw new Error("Results UI contract error: assumptions.kind must be webinar_signups");
                    return (
                        <FunnelCard
                            step="RESULT 3: WEBINAR"
                            label="Monthly webinar signups"
                            value={formatRange(goal.monthly_webinar_signups_est.low, goal.monthly_webinar_signups_est.high)}
                            sublabel={`Assumes signup rate ${formatPercentRange(a.webinar_signup_rate_from_sessions)} × conversion readiness.`}
                            width="narrow"
                        />
                    );
                }

                // authority_visibility
                if (a.kind !== "authority_visibility")
                    throw new Error("Results UI contract error: assumptions.kind must be authority_visibility");
                return (
                    <FunnelCard
                        step="RESULT 3: VISIBILITY"
                        label="Monthly visibility reach"
                        value={formatRange(goal.monthly_visibility_reach_est.low, goal.monthly_visibility_reach_est.high)}
                        sublabel={`Modeled via visibility reach per session: ${formatRange(a.visibility_reach_per_session.low, a.visibility_reach_per_session.high)}.`}
                        width="narrow"
                    />
                );
            })();

            return (
                <div className="space-y-2">
                    <FunnelCard
                        step="RESULT 1: DEMAND"
                        label="Monthly demand in your niche (US+CA)"
                        value={formatRange(demand.low, demand.high)}
                        sublabel="General niche demand ceiling on Pinterest (macro benchmark; no execution applied)."
                        width="full"
                    />

                    <FunnelArrow />

                    <FunnelCard
                        step="RESULT 2: TRAFFIC"
                        label={trafficLabel}
                        value={formatRange(trafficLens.low, trafficLens.high)}
                        sublabel={trafficSublabel}
                        width="medium"
                    />

                    <FunnelArrow />

                    {Result3}
                </div>
            );
        }

        const k = String((segment as unknown as { kind?: unknown }).kind);
        throw new Error(`Results UI contract error: Unexpected segment_outcome.kind: ${k}`);
    }, [props.results]);

    // -----------------------------
    // Gates (hard lock + soft lock) — layout preserved
    // -----------------------------

    const LeadCaptureHardLock = props.showHardLockGate ? (
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <div>
                    <h3 className="font-heading text-lg text-[var(--foreground)]">Reveal your full snapshot</h3>
                    <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                        Enter your email to view your results (and keep a copy).
                    </p>
                    <p className="mt-2 text-xs text-[var(--foreground-muted)]">{props.privacyMicrocopy}</p>
                </div>

                <div className="mt-3 sm:mt-0 sm:col-span-2">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <input
                                type="text"
                                placeholder={props.requireName ? "Your name" : "Your name (optional)"}
                                value={props.leadName}
                                onChange={(e) => props.onLeadNameChange(e.target.value)}
                                className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                            />
                            {props.errors["LEAD.name"] ? (
                                <div className="mt-1 text-xs text-red-500">{props.errors["LEAD.name"]}</div>
                            ) : null}
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={props.leadEmail}
                                onChange={(e) => props.onLeadEmailChange(e.target.value)}
                                className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                            />
                            {props.errors["LEAD.email"] ? (
                                <div className="mt-1 text-xs text-red-500">{props.errors["LEAD.email"]}</div>
                            ) : null}
                        </div>
                    </div>

                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <button
                            type="button"
                            onClick={props.onUnlock}
                            className="inline-flex w-full items-center justify-center rounded-md bg-[var(--brand-raspberry)] px-5 py-3 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:w-auto"
                        >
                            Unlock results →
                        </button>

                        <div className="text-xs text-[var(--foreground-muted)]">
                            We’ll send a copy. No spam. Unsubscribe anytime.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null;

    const LeadCaptureSoftLock = props.showSoftLockGate ? (
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <div className="sm:flex sm:items-start sm:justify-between sm:gap-6">
                <div>
                    <h3 className="font-heading text-lg text-[var(--foreground)]">Email yourself a copy</h3>
                    <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                        Want these results in your inbox? Drop your email below.
                    </p>
                    <p className="mt-2 text-xs text-[var(--foreground-muted)]">{props.privacyMicrocopy}</p>
                </div>

                <div className="mt-3 sm:mt-0 sm:w-[420px]">
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={props.leadEmail}
                            onChange={(e) => props.onLeadEmailChange(e.target.value)}
                            className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                        />
                        <button
                            type="button"
                            onClick={props.onEmailResults}
                            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--background)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                        >
                            Email me →
                        </button>
                    </div>

                    {props.optionalLeadEmailError ? (
                        <div className="mt-1 text-xs text-red-500">{props.optionalLeadEmailError}</div>
                    ) : null}

                    {props.optionalLeadSubmitted ? (
                        <div className="mt-2 text-xs text-[var(--foreground-muted)]">Sent — check your inbox.</div>
                    ) : null}
                </div>
            </div>
        </div>
    ) : null;

    // -----------------------------
    // Right-column context + recap (kept; now strictly uses v1.2 fields)
    // -----------------------------

    const ContextPanel = useMemo(() => {
        const r = props.results;

        const income = assertRange(r.demographics.household_income_usd, "results.demographics.household_income_usd");
        const dist = assertFiniteNumber(r.demand.distribution_capacity_m, "results.demand.distribution_capacity_m");
        const ready = assertFiniteNumber(r.demand.conversion_readiness_m, "results.demand.conversion_readiness_m");

        const seasonality = r.inferred.seasonality_index;
        const competition = r.inferred.competition_index;

        return (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
                <div className="font-heading text-lg text-[var(--foreground)]">Snapshot context</div>
                <div className="mt-1 text-xs text-[var(--foreground-muted)]">Benchmarks + multipliers used to model these ranges.</div>

                <div className="mt-4 space-y-3">
                    <StatRow label="Distribution capacity" value={`x${dist.toFixed(2)}`} />
                    <StatRow label="Conversion readiness" value={`x${ready.toFixed(2)}`} />
                    <StatRow label="US+CA audience income (benchmark)" value={`$${formatRange(income.low, income.high)}`} />
                </div>

                <SoftDivider />

                <div className="flex flex-wrap gap-2">
                    <Pill label={`Seasonality: ${seasonality}`} />
                    <Pill label={`Competition: ${competition}`} />
                    {(r.inferred.tags ?? []).map((t) => (
                        <Pill key={t} label={t} />
                    ))}
                </div>

                {r.insight_line ? (
                    <>
                        <SoftDivider />
                        <div className="text-sm text-[var(--foreground)]">
                            <div className="text-xs font-semibold text-[var(--foreground-muted)] mb-1">Insight</div>
                            {r.insight_line}
                        </div>
                    </>
                ) : null}

                {r.demographics.notes && r.demographics.notes.length > 0 ? (
                    <>
                        <SoftDivider />
                        <div className="text-xs text-[var(--foreground-muted)] space-y-1">
                            {r.demographics.notes.map((n, idx) => (
                                <div key={idx}>• {n}</div>
                            ))}
                        </div>
                    </>
                ) : null}
            </div>
        );
    }, [props.results]);

    const RecapPanel = useMemo(() => {
        if (!props.recap || props.recap.length === 0) return null;

        return (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
                <div className="font-heading text-lg text-[var(--foreground)]">Your answers (recap)</div>
                <div className="mt-1 text-xs text-[var(--foreground-muted)]">Useful for aligning the strategy recommendations.</div>

                <div className="mt-4 space-y-3">
                    {props.recap.map((item, idx) => (
                        <div key={`${item.label}-${idx}`} className="flex items-start justify-between gap-4">
                            <div className="text-sm text-[var(--foreground-muted)]">{item.label}</div>
                            <div className="text-sm font-semibold text-[var(--foreground)] text-right">{item.value}</div>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={props.onEditAnswers}
                        className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--background)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                        Edit answers
                    </button>

                    <button
                        type="button"
                        onClick={props.onStartOver}
                        className="inline-flex items-center justify-center rounded-md border border-[var(--border)] bg-transparent px-4 py-2 text-sm font-semibold text-[var(--foreground-muted)] hover:bg-[var(--background)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                        Start over
                    </button>
                </div>
            </div>
        );
    }, [props.recap, props.onEditAnswers, props.onStartOver]);

    // -----------------------------
    // Goal-specific supporting breakdowns (kept; updated to v1.2 unions)
    // -----------------------------

    const SupportingBreakdowns = useMemo(() => {
        const seg = props.results.segment_outcome;

        if (seg.kind === "content_creator") {
            return (
                <div className="space-y-4">
                    <CourseRevenueBreakdown seg={seg} />
                </div>
            );
        }

        if (seg.kind === "product_seller") {
            return (
                <div className="space-y-4">
                    <SalesRevenueBreakdown seg={seg} />
                </div>
            );
        }

        // service_provider has no bucketed breakdowns in v1.2
        return null;
    }, [props.results.segment_outcome]);

    // -----------------------------
    // Render (layout preserved)
    // -----------------------------

    const blurWrap = locked ? "relative" : "relative";
    const blurInner = locked ? "pointer-events-none select-none blur-[3px] opacity-60" : "";

    return (
        <div className="space-y-6">
            <ResultsHero variant={heroVariant} />

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Left: Funnel + gates + breakdown */}
                <div className="lg:col-span-7 space-y-4">
                    <div className={blurWrap}>
                        <div className={blurInner}>{ResultsCards}</div>

                        {locked ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="rounded-xl border border-[var(--border)] bg-[var(--background)]/95 px-5 py-4 text-center shadow-sm">
                                    <div className="font-heading text-lg text-[var(--foreground)]">Unlock to view</div>
                                    <div className="mt-1 text-xs text-[var(--foreground-muted)]">
                                        Enter your email below to reveal the full snapshot.
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    {LeadCaptureHardLock}
                    {LeadCaptureSoftLock}

                    {!locked ? SupportingBreakdowns : null}

                    <div className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
                        <div className="font-heading text-lg text-[var(--foreground)]">Notes</div>
                        <div className="mt-2 text-xs text-[var(--foreground-muted)] space-y-1">
                            <div>• All values are ranges per month (not guarantees).</div>
                            <div>• Result 1 is benchmark demand; Result 2 includes distribution capacity; Result 3 is goal-model driven.</div>
                            <div>• If your tracking is weak (cookies/pixels/slow pages), real outcomes may underperform these ranges.</div>
                        </div>
                    </div>
                </div>

                {/* Right: Context + recap */}
                <div className="lg:col-span-5 space-y-4">
                    {ContextPanel}
                    {RecapPanel}
                </div>
            </div>

            <CandyBurstOverlay
                open={celebrate}
                onClose={() => {
                    setCelebrate(false);
                    setCelebrateCfg(null);
                }}
                durationMs={celebrateCfg?.durationMs ?? 4200}
                intensity={celebrateCfg?.intensity ?? 2}
                headline={celebrateCfg?.headline}
                subhead={celebrateCfg?.subhead}
            />
        </div>
    );
}
