// frontend/components/tools/pinterestPotential/views/ResultsView.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * ResultsView — v1.2
 * - Keep current draft's results contract + lead-gating behavior
 * - Restore the previous layout: 3 main results + 2 hero CTAs + animated gradient heroes
 * - No other CTAs/links on page
 */

/* ----------------------------- Types (v1.2) ----------------------------- */

type Range = { low: number; high: number };

export type ResultsBundle = {
    demand: {
        demand_base_sessions_est: Range;
        likely_pinterest_sessions_est?: Range; // optional in UI (some builds may omit)
        distribution_capacity_m?: number; // optional in UI
    };
    traffic?: {
        website_sessions_est?: Range; // non-product segments
        purchase_intent_sessions_est?: Range; // product segment
    };
    segment_outcome: {
        kind: "content_creator" | "product_seller" | "service_provider";
        // v1.2 compute may include more fields (goal_outcome, assumptions, etc.)
        // UI does not need them for the simplified layout.
    };
};

export type ResultsRecapItem = {
    label: string;
    value: string;
};

export type ResultsViewProps = {
    results: ResultsBundle;

    // Pre-formatted strings (kept for compatibility with existing orchestrator)
    demandBaseSessionsRangeLabel: string; // optional usage (we can compute from results)
    step2Label?: string;
    step2ValueLabel?: string;
    likelySessionsRangeLabel?: string; // optional usage
    distributionCapacityLabel?: string; // optional usage

    primaryOutcomeLabel: string; // segment+goal specific label (pre-formatted)
    primaryOutcomeRangeLabel: string; // segment+goal specific range label (pre-formatted)
    purchaseIntentRangeLabel?: string; // product seller only (optional)

    // Context (kept, but not rendered in this simplified layout)
    incomeRangeLabel: string;
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

    // Recap + actions (kept for compatibility, not rendered here)
    recap: ResultsRecapItem[];
    onStartOver: () => void;
    onEditAnswers: () => void;
};

/* ----------------------------- Utilities ----------------------------- */

type HeroVariant = "locked" | "ready" | "unlocked" | "emailed";

const BOOK_URL = "https://cal.com/fruitfullab/pinterest-strategy";

function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
}

function formatNumber(num: number): string {
    if (num >= 1_000_000) return `${Math.round(num / 100_000) / 10}M`;
    if (num >= 1_000) return `${Math.round(num / 100) / 10}K`;
    return Math.round(num).toString();
}

function formatRange(low: number, high: number): string {
    return `${formatNumber(low)}–${formatNumber(high)}`;
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

/* ----------------------------- UI Atoms ----------------------------- */

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
            <div className="relative rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                <div className="mb-1 text-xs font-semibold text-[var(--foreground-muted)]">{step}</div>
                <div className="mb-2 text-sm text-[var(--foreground)]">{label}</div>
                <div className="mb-2 font-heading text-3xl text-[var(--foreground)] sm:text-4xl">{value}</div>
                {sublabel ? <div className="text-xs text-[var(--foreground-muted)]">{sublabel}</div> : null}
            </div>
        </div>
    );
}

function FunnelArrow() {
    return (
        <div className="flex justify-center py-2">
            <svg className="h-6 w-6 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        </div>
    );
}

/* ----------------------------- Celebration Overlay ----------------------------- */

type CandyBurstOverlayProps = {
    open: boolean;
    onClose: () => void;
    durationMs?: number;
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

            const left =
                originX +
                (spread / (window.innerWidth || 1)) * 100 * 0.85 +
                (Math.random() * 8 - 4);
            const top = originY + (Math.random() * 36 - 18);

            const size = (lvl === 3 ? 10 : lvl === 2 ? 11 : 12) + Math.random() * (lvl === 3 ? 18 : 16);
            const radius =
                Math.random() < 0.45 ? size * 0.9 : Math.random() < 0.75 ? size * 0.35 : size * 0.15;

            const dur = 3400 + Math.random() * (lvl === 3 ? 2200 : 2000);
            const delay = Math.random() * (lvl === 3 ? 520 : 420);

            const spin = (Math.random() < 0.5 ? -1 : 1) * (520 + Math.random() * 980);
            const sway = (Math.random() < 0.5 ? -1 : 1) * (18 + Math.random() * 44);

            return {
                id: `candy-${Date.now()}-${i}`,
                leftPct: clamp(left, -5, 105),
                topPx: clamp(top, 0, window.innerHeight),
                dxPx: spread,
                upPx: lift,
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
                {headline ? <div className="font-heading text-3xl text-white drop-shadow sm:text-4xl">{headline}</div> : null}
                {subhead ? <div className="mt-2 text-sm text-white/80 sm:text-base">{subhead}</div> : null}

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

/* ----------------------------- Heroes ----------------------------- */

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
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
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
                        href={BOOK_URL}
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

/* ----------------------------- View ----------------------------- */

export default function ResultsView(props: ResultsViewProps) {
    const {
        results,
        demandBaseSessionsRangeLabel,
        step2Label: step2LabelProp,
        step2ValueLabel,
        likelySessionsRangeLabel,
        primaryOutcomeLabel,
        primaryOutcomeRangeLabel,
        purchaseIntentRangeLabel,
        showHardLockGate,
        showSoftLockGate,
        privacyMicrocopy,
        leadName,
        leadEmail,
        requireName,
        errors,
        optionalLeadEmailError,
        optionalLeadSubmitted,
        onLeadNameChange,
        onLeadEmailChange,
        onUnlock,
        onEmailResults,
    } = props;

    const locked = showHardLockGate;
    const emailed = optionalLeadSubmitted;
    const heroVariant: HeroVariant = emailed ? "emailed" : locked ? "locked" : showSoftLockGate ? "ready" : "unlocked";

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

    const ResultsCards = useMemo(() => {
        const kind = results.segment_outcome.kind;

        // Step 1 (Demand) — prefer passed label, fall back to computed
        const demand = results.demand.demand_base_sessions_est;
        const demandValue =
            demandBaseSessionsRangeLabel?.trim() ? demandBaseSessionsRangeLabel : formatRange(demand.low, demand.high);

        // Step 2 (Traffic / Intent) — product: purchase intent; others: website sessions; fallback to likely sessions
        const purchaseIntent = results.traffic?.purchase_intent_sessions_est;
        const website = results.traffic?.website_sessions_est;
        const likely = results.demand.likely_pinterest_sessions_est;

        const step2Label =
            step2LabelProp?.trim()
                ? step2LabelProp
                : kind === "product_seller"
                ? "Monthly purchase-intent sessions (in your niche)"
                : "Monthly website sessions you could earn from Pinterest";

        const step2Value =
            step2ValueLabel?.trim()
                ? step2ValueLabel
                : kind === "product_seller"
                ? (purchaseIntentRangeLabel?.trim()
                    ? purchaseIntentRangeLabel
                    : purchaseIntent
                        ? formatRange(purchaseIntent.low, purchaseIntent.high)
                        : likely
                            ? formatRange(likely.low, likely.high)
                            : "—")
                : website
                    ? formatRange(website.low, website.high)
                    : likelySessionsRangeLabel?.trim()
                        ? likelySessionsRangeLabel
                        : likely
                            ? formatRange(likely.low, likely.high)
                            : "—";

        // Step 3 (Primary outcome) — always use the pre-formatted segment+goal-specific output
        const step3Label = primaryOutcomeLabel;
        const step3Value = primaryOutcomeRangeLabel;

        return (
            <div className="space-y-2">
                <FunnelCard
                    step="STEP 1"
                    label="Monthly Pinterest demand in your niche (US/CA)"
                    value={demandValue}
                    sublabel="This is the estimated monthly session pool for your niche — not your personal traffic."
                    width="full"
                />

                <FunnelArrow />

                <FunnelCard
                    step="STEP 2"
                    label={step2Label}
                    value={step2Value}
                    sublabel={kind === "product_seller" ? "Shoppers actively browsing with buying intent." : "Modeled traffic you could capture with consistent execution."}
                    width="medium"
                />

                <FunnelArrow />

                <FunnelCard
                    step="STEP 3"
                    label={step3Label}
                    value={step3Value}
                    sublabel="Your goal-specific modeled outcome based on your answers."
                    width="narrow"
                />
            </div>
        );
    }, [
        results,
        demandBaseSessionsRangeLabel,
        step2LabelProp,
        step2ValueLabel,
        likelySessionsRangeLabel,
        purchaseIntentRangeLabel,
        primaryOutcomeLabel,
        primaryOutcomeRangeLabel,
    ]);

    const LeadCaptureHardLock = showHardLockGate ? (
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <div>
                    <h3 className="font-heading text-lg text-[var(--foreground)]">Reveal your full snapshot</h3>
                    <p className="mt-1 text-sm text-[var(--foreground-muted)]">Enter your email to view your results (and keep a copy).</p>
                    <p className="mt-2 text-xs text-[var(--foreground-muted)]">{privacyMicrocopy}</p>
                </div>

                <div className="mt-3 sm:col-span-2 sm:mt-0">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {requireName ? (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={leadName}
                                    onChange={(e) => onLeadNameChange(e.target.value)}
                                    className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                                />
                                {errors["LEAD.name"] ? <div className="mt-1 text-xs text-red-500">{errors["LEAD.name"]}</div> : null}
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Your name (optional)"
                                    value={leadName}
                                    onChange={(e) => onLeadNameChange(e.target.value)}
                                    className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                                />
                            </div>
                        )}

                        <div>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={leadEmail}
                                onChange={(e) => onLeadEmailChange(e.target.value)}
                                className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                            />
                            {errors["LEAD.email"] ? <div className="mt-1 text-xs text-red-500">{errors["LEAD.email"]}</div> : null}
                        </div>
                    </div>

                    <div className="mt-3">
                        <button
                            type="button"
                            onClick={onUnlock}
                            className="rounded-md bg-[var(--brand-raspberry)] px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                        >
                            Reveal results
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;

    const LeadCaptureSoftLock = showSoftLockGate ? (
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <div>
                    <h3 className="font-heading text-lg text-[var(--foreground)]">
                        {optionalLeadSubmitted ? "Results sent ✅" : "Want a copy of your results?"}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                        {optionalLeadSubmitted ? "Check your inbox for the snapshot." : "Leave your email and we’ll send this snapshot."}
                    </p>
                    <p className="mt-2 text-xs text-[var(--foreground-muted)]">{privacyMicrocopy}</p>
                </div>

                <div className="mt-3 sm:col-span-2 sm:mt-0">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <input
                                type="text"
                                placeholder="Your name (optional)"
                                value={leadName}
                                onChange={(e) => onLeadNameChange(e.target.value)}
                                className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={leadEmail}
                                onChange={(e) => onLeadEmailChange(e.target.value)}
                                className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                            />
                            {optionalLeadEmailError ? <div className="mt-1 text-xs text-red-500">{optionalLeadEmailError}</div> : null}
                        </div>
                    </div>

                    <div className="mt-3">
                        <button
                            type="button"
                            disabled={optionalLeadSubmitted}
                            onClick={onEmailResults}
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
        <>
            <CandyBurstOverlay
                open={celebrate}
                onClose={() => setCelebrate(false)}
                durationMs={celebrateCfg?.durationMs ?? 4200}
                intensity={celebrateCfg?.intensity ?? 2}
                headline={celebrateCfg?.headline}
                subhead={celebrateCfg?.subhead}
            />

            <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                <div className="mb-4 text-sm text-[var(--foreground-muted)]">Pinterest Potential — Results</div>

                {/* HERO #1 */}
                <ResultsHero variant={heroVariant} />

                {LeadCaptureHardLock}

                {/* Results (blurred behind hard-lock) */}
                <div className={showHardLockGate ? "mt-4 opacity-90 blur-[6px] pointer-events-none select-none" : "mt-4"}>
                    {ResultsCards}
                    {LeadCaptureSoftLock}
                </div>

                {/* HERO #2 */}
                <div className="mt-6 overflow-hidden rounded-xl border border-[var(--border)]">
                    <div className="ppc-hero-glow relative p-8 sm:p-10">
                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="font-heading text-2xl text-[var(--foreground)] sm:text-3xl">
                                    Want a clear action plan for your niche + goals?
                                </div>
                                <div className="mt-2 text-base text-[var(--foreground-muted)]">
                                    Turn this snapshot into a prioritized roadmap (and skip the guesswork).
                                </div>
                            </div>

                            <a
                                href={BOOK_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-full items-center justify-center rounded-md bg-[var(--brand-raspberry)] px-10 py-5 text-base font-semibold text-white shadow-sm hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:w-auto"
                            >
                                Book a Strategy Call →
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated gradient background for hero sections */}
            <style jsx global>{`
                .ppc-hero-glow {
                    position: relative;
                    overflow: hidden;
                    isolation: isolate;
                }

                .ppc-hero-glow::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background: linear-gradient(
                        120deg,
                        rgba(255, 77, 141, 0.2),
                        rgba(255, 209, 102, 0.16),
                        rgba(77, 220, 255, 0.14),
                        rgba(255, 77, 141, 0.18)
                    );
                    background-size: 240% 240%;
                    animation: ppcHeroGlow 6.5s ease-in-out infinite;
                    opacity: 0.95;
                    z-index: 0;
                }

                .ppc-hero-glow::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background: radial-gradient(
                        900px 260px at 20% 10%,
                        rgba(255, 255, 255, 0.14),
                        rgba(255, 255, 255, 0) 60%
                    );
                    opacity: 0.55;
                    z-index: 0;
                }

                @keyframes ppcHeroGlow {
                    0% {
                        background-position: 0% 30%;
                    }
                    50% {
                        background-position: 100% 70%;
                    }
                    100% {
                        background-position: 0% 30%;
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .ppc-hero-glow::before {
                        animation: none;
                    }
                }
            `}</style>
        </>
    );
}
