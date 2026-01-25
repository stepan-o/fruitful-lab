// THIS IS AN ARCHIVED VERSION OF THE RESULTS VIEW SAVED FOR POTENTIAL FUTURE USE
// DO NOT IMPORT INTO THE MAIN PINTEREST POTENTIAL CALCULATOR
// USE frontend/components/tools/pinterestPotential/views/ResultsView.tsx INSTEAD
// frontend/components/tools/pinterestPotential/views/archive/ResultsView.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ResultsBundle } from "@/lib/tools/pinterestPotential/compute";

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

function clamp(n: number, a: number, b: number) {
    return Math.max(a, Math.min(b, n));
}

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

        // Create “piñata candy” pieces once per open. (No per-frame JS.)
        const lvl = clamp(intensity, 1, 3);
        const count = lvl === 3 ? 140 : lvl === 2 ? 110 : 85;

        // Burst origin (roughly where the message sits).
        const originX = 50; // %
        const originY = Math.round(window.innerHeight * 0.52); // px

        const palette = [
            { a: "255,77,141", b: "255,209,102" }, // raspberry/gold
            { a: "77,220,255", b: "184,255,77" }, // cyan/lime
            { a: "255,255,255", b: "255,77,141" }, // white/raspberry
            { a: "255,209,102", b: "77,220,255" }, // gold/cyan
            { a: "184,255,77", b: "255,255,255" }, // lime/white
        ];

        const makeBg = () => {
            const p = palette[Math.floor(Math.random() * palette.length)]!;
            const mode = Math.random();
            // Candy textures: stripes / gummy sheen / sprinkle dot
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
            // spread around origin with a wide cone
            const spread = (Math.random() * 2 - 1) * (lvl === 3 ? 520 : lvl === 2 ? 440 : 360);
            const lift = 80 + Math.random() * (lvl === 3 ? 220 : 180);

            const dx = spread;
            const up = lift;

            const left =
                originX +
                (spread / (window.innerWidth || 1)) * 100 * 0.85 +
                (Math.random() * 8 - 4);
            const top = originY + (Math.random() * 36 - 18);

            const size = (lvl === 3 ? 10 : lvl === 2 ? 11 : 12) + Math.random() * (lvl === 3 ? 18 : 16);
            const radius =
                Math.random() < 0.45 ? size * 0.9 : Math.random() < 0.75 ? size * 0.35 : size * 0.15;

            // slower overall feel: 3.4s – 5.6s
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

        setPieces(next);

        const auto = window.setTimeout(() => onClose(), durationMs);
        return () => window.clearTimeout(auto);
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

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center"
            onClick={onClose}
            role="presentation"
        >
            {/* Darkened premium backdrop + soft color bloom */}
            <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                    background:
                        "radial-gradient(1000px 600px at 50% 45%, rgba(255,77,141,0.20), rgba(0,0,0,0.86) 68%), radial-gradient(800px 520px at 65% 25%, rgba(77,220,255,0.10), rgba(0,0,0,0) 60%)",
                }}
            />

            {/* Candy pieces */}
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

            {/* Message */}
            <div className="relative mx-6 max-w-xl text-center">
                {headline ? (
                    <div className="font-heading text-3xl sm:text-4xl text-white drop-shadow">{headline}</div>
                ) : null}
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
}

function ResultsHero({ 
    variant,
    onEditAnswers,
    onStartOver,
}: { 
    variant: HeroVariant;
    onEditAnswers: () => void;
    onStartOver: () => void;
}) {
    const copy = useMemo(() => {
        if (variant === "locked") {
            return {
                eyebrow: "Completed",
                title: "All set — your snapshot is ready.",
                body: "Enter your email to reveal the full results (and keep a copy).",
            };
        }
        if (variant === "ready") {
            return {
                eyebrow: "Completed",
                title: "Snapshot complete.",
                body: "Your results are ready. Want a copy emailed to you?",
            };
        }
        if (variant === "emailed") {
            return {
                eyebrow: "Sent",
                title: "Done — check your inbox.",
                body: "We just emailed your snapshot. You can keep this tab open too.",
            };
        }
        return {
            eyebrow: "Unlocked",
            title: "Your full snapshot is live.",
            body: "Use this as a benchmark + a priority map (not a promise).",
        };
    }, [variant]);

    return (
        <div className="relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background)] p-5 sm:p-6">
            <div
                className="pointer-events-none absolute inset-0 opacity-80"
                aria-hidden="true"
                style={{
                    background:
                        "radial-gradient(900px 320px at 15% 20%, rgba(255,77,141,0.22), transparent 60%), radial-gradient(900px 320px at 85% 10%, rgba(255,209,102,0.16), transparent 60%)",
                }}
            />
            <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden="true">
                <div className="ppc-sheen" />
            </div>

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

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <a
                        href="https://cal.com/fruitfullab/pinterest-strategy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block rounded-md bg-[var(--brand-raspberry)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)]"
                    >
                        Book a Strategy Call →
                    </a>

                    <button
                        type="button"
                        onClick={onEditAnswers}
                        className="rounded-md border border-[var(--border)] bg-[var(--background)]/50 px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--background)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)]"
                    >
                        Edit answers
                    </button>

                    <button
                        type="button"
                        onClick={onStartOver}
                        className="rounded-md px-3 py-2 text-sm text-[var(--foreground-muted)] hover:text-[var(--foreground)] focus:outline-none"
                    >
                        Start over
                    </button>
                </div>
            </div>

            <style jsx>{`
                .ppc-sheen {
                    position: absolute;
                    inset: -40%;
                    background: linear-gradient(
                            110deg,
                            rgba(255, 255, 255, 0) 35%,
                            rgba(255, 255, 255, 0.12) 50%,
                            rgba(255, 255, 255, 0) 65%
                    );
                    transform: translateX(-30%);
                    animation: ppcSheen 3.8s ease-in-out infinite;
                }
                @keyframes ppcSheen {
                    0% {
                        transform: translateX(-35%);
                    }
                    50% {
                        transform: translateX(35%);
                    }
                    100% {
                        transform: translateX(-35%);
                    }
                }
                @media (prefers-reduced-motion: reduce) {
                    .ppc-sheen {
                        animation: none;
                    }
                }
            `}</style>
        </div>
    );
}

function MetricCard({
                        label,
                        value,
                        sublabel,
                    }: {
    label: string;
    value: string;
    sublabel?: string;
}) {
    return (
        <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <div className="text-xs text-[var(--foreground-muted)]">{label}</div>
            <div className="mt-1 font-heading text-2xl text-[var(--foreground)]">{value}</div>
            {sublabel ? <div className="mt-1 text-xs text-[var(--foreground-muted)]">{sublabel}</div> : null}
        </div>
    );
}

export default function ResultsView({
                                        results,
                                        demandBaseSessionsRangeLabel,
                                        likelySessionsRangeLabel,
                                        distributionCapacityLabel,
                                        primaryOutcomeLabel,
                                        primaryOutcomeRangeLabel,
                                        purchaseIntentRangeLabel,
                                        incomeRangeLabel,
                                        insightLine,
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
                                        recap,
                                        onStartOver,
                                        onEditAnswers,
                                    }: ResultsViewProps) {
    const locked = showHardLockGate;
    const emailed = optionalLeadSubmitted;

    const heroVariant: HeroVariant = emailed
        ? "emailed"
        : locked
            ? "locked"
            : showSoftLockGate
                ? "ready"
                : "unlocked";

    const [celebrate, setCelebrate] = useState(false);
    const [celebrateCfg, setCelebrateCfg] = useState<{
        durationMs: number;
        intensity: number;
        headline: string;
        subhead: string;
    } | null>(null);

    const prevLockedRef = useRef<boolean>(locked);
    const prevEmailedRef = useRef<boolean>(emailed);

    // Trigger celebration on hard-lock unlock
    useEffect(() => {
        if (prevLockedRef.current && !locked) {
            setCelebrateCfg({
                durationMs: 4300, // ✅ slower
                intensity: 3,
                headline: "Unlocked.",
                subhead: "Your full Pinterest Potential snapshot is ready.",
            });
            setCelebrate(true);
        }
        prevLockedRef.current = locked;
    }, [locked]);

    // Trigger celebration on optional “email me” submit
    useEffect(() => {
        if (!prevEmailedRef.current && emailed) {
            setCelebrateCfg({
                durationMs: 3200, // ✅ slower
                intensity: 2,
                headline: "Sent.",
                subhead: "Snapshot delivered to your inbox.",
            });
            setCelebrate(true);
        }
        prevEmailedRef.current = emailed;
    }, [emailed]);

    const conversionReadinessLabel = useMemo(() => {
        const m = results?.demand?.conversion_readiness_m;
        if (typeof m !== "number" || !Number.isFinite(m)) return "—";
        return `${m.toFixed(2)}×`;
    }, [results]);

    const insight = (insightLine ?? results.insight_line ?? null) as string | null;

    // Helper to format numbers with K/M suffix
    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return `${Math.round(num / 100000) / 10}M`;
        }
        if (num >= 1000) {
            return `${Math.round(num / 100) / 10}K`;
        }
        return num.toString();
    };

    const formatRange = (low: number, high: number): string => {
        return `${formatNumber(low)}–${formatNumber(high)}`;
    };

    // Influenced by pill component
    const InfluencedByPill = ({ label, impact }: { label: string; impact: "positive" | "neutral" | "negative" }) => {
        const colorClass = impact === "positive" ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400" : 
                           impact === "negative" ? "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400" : 
                           "border-[var(--border)] bg-[var(--background)]/50 text-[var(--foreground-muted)]";
        
        const icon = impact === "positive" ? "↗" : impact === "negative" ? "↘" : "→";
        
        return (
            <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${colorClass}`}>
                <span>{label}</span>
                <span className="text-sm">{icon}</span>
            </span>
        );
    };

    // Funnel card component
    const FunnelCard = ({
        step,
        label,
        value,
        sublabel,
        width = "full",
        influencedBy,
    }: {
        step: string;
        label: string;
        value: string;
        sublabel?: string;
        width?: "full" | "medium" | "narrow";
        influencedBy?: Array<{ label: string; impact: "positive" | "neutral" | "negative" }>;
    }) => {
        const widthClass = width === "full" ? "w-full" : width === "medium" ? "sm:w-[85%]" : "sm:w-[70%]";
        
        return (
            <div className={`${widthClass} mx-auto`}>
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 relative">
                    <div className="text-xs font-semibold text-[var(--foreground-muted)] mb-1">{step}</div>
                    <div className="text-sm text-[var(--foreground)] mb-2">{label}</div>
                    <div className="font-heading text-3xl sm:text-4xl text-[var(--foreground)] mb-3">{value}</div>
                    {sublabel && <div className="text-xs text-[var(--foreground-muted)] mb-3">{sublabel}</div>}
                    
                    {/* Influenced by pills */}
                    {influencedBy && influencedBy.length > 0 && (
                        <div className="pt-3 border-t border-[var(--border)]">
                            <div className="text-xs text-[var(--foreground-muted)] mb-2">Influenced by:</div>
                            <div className="flex flex-wrap gap-1.5">
                                {influencedBy.map((item, idx) => (
                                    <InfluencedByPill key={idx} label={item.label} impact={item.impact} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Arrow between funnel steps
    const FunnelArrow = () => (
        <div className="flex justify-center py-2">
            <svg className="w-6 h-6 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
        </div>
    );

    const ResultsCards = useMemo(() => {
        const kind = results.segment_outcome.kind;
        const sessions = results.demand.likely_pinterest_sessions_est;
        const distCapacity = results.demand.distribution_capacity_m;
        const convReadiness = results.demand.conversion_readiness_m;
        
        // Determine impact for pills
        const getImpact = (multiplier: number): "positive" | "neutral" | "negative" => {
            if (multiplier > 1.05) return "positive";
            if (multiplier < 0.95) return "negative";
            return "neutral";
        };
        
        const distImpact = getImpact(distCapacity);
        const convImpact = getImpact(convReadiness);
        
        if (kind === "content_creator") {
            const websiteVisitsLow = Math.round(sessions.low * 0.15);
            const websiteVisitsHigh = Math.round(sessions.high * 0.35);
            
            return (
                <div className="space-y-2">
                    {/* Step 1: Pinterest Sessions */}
                    <FunnelCard
                        step="STEP 1: REACH"
                        label="Pinterest monthly reach"
                        value={formatRange(sessions.low, sessions.high)}
                        sublabel="People who could see your content"
                        width="full"
                        influencedBy={[
                            { label: "Publishing volume", impact: distImpact },
                            { label: "Visual library", impact: distImpact },
                            { label: "Niche demand", impact: "neutral" },
                        ]}
                    />
                    
                    <FunnelArrow />
                    
                    {/* Step 2: Website Visits - PRIMARY OUTCOME */}
                    <FunnelCard
                        step="STEP 2: TRAFFIC"
                        label="Potential website visits"
                        value={formatRange(websiteVisitsLow, websiteVisitsHigh)}
                        sublabel="Based on 15-35% click-through rate"
                        width="medium"
                        influencedBy={[
                            { label: "Pin quality", impact: "neutral" },
                            { label: "CTR optimization", impact: "neutral" },
                        ]}
                    />
                    
                    <FunnelArrow />
                    
                    {/* Step 3: Conversions */}
                    <FunnelCard
                        step="STEP 3: CONVERSIONS"
                        label="Email signups / sales"
                        value="Depends on your setup"
                        sublabel="Influenced by offer clarity + site experience"
                        width="narrow"
                        influencedBy={[
                            { label: "Website quality", impact: convImpact },
                            { label: "Offer clarity", impact: convImpact },
                        ]}
                    />
                </div>
            );
        }
        
        if (kind === "product_seller") {
            const purchaseIntent = results.segment_outcome.monthly_purchase_intent_sessions_est;
            const revenue = results.segment_outcome.revenue_by_aov_est;
            const midAov = revenue["100_250"] || revenue["50_100"];
            
            return (
                <div className="space-y-2">
                    {/* Step 1: Pinterest Sessions */}
                    <FunnelCard
                        step="STEP 1: REACH"
                        label="Pinterest monthly reach"
                        value={formatRange(sessions.low, sessions.high)}
                        sublabel="People who could see your products"
                        width="full"
                        influencedBy={[
                            { label: "Publishing volume", impact: distImpact },
                            { label: "Visual library", impact: distImpact },
                            { label: "Niche demand", impact: "neutral" },
                        ]}
                    />
                    
                    <FunnelArrow />
                    
                    {/* Step 2: Purchase-Intent Sessions */}
                    <FunnelCard
                        step="STEP 2: SHOPPING INTENT"
                        label="Purchase-intent sessions"
                        value={formatRange(purchaseIntent.low, purchaseIntent.high)}
                        sublabel="Visitors actively looking to buy"
                        width="medium"
                        influencedBy={[
                            { label: "Product appeal", impact: "neutral" },
                            { label: "Niche buying intent", impact: "neutral" },
                        ]}
                    />
                    
                    <FunnelArrow />
                    
                    {/* Step 3: Revenue - PRIMARY OUTCOME */}
                    <FunnelCard
                        step="STEP 3: REVENUE"
                        label="Monthly revenue potential"
                        value={midAov ? `$${formatRange(midAov.low, midAov.high)}` : "—"}
                        sublabel="Typical order value: $100–$250"
                        width="narrow"
                        influencedBy={[
                            { label: "Website quality", impact: convImpact },
                            { label: "Offer clarity", impact: convImpact },
                            { label: "AOV range", impact: "neutral" },
                        ]}
                    />
                </div>
            );
        }
        
        if (kind === "service_provider") {
            const websiteVisitsLow = Math.round(sessions.low * 0.15);
            const websiteVisitsHigh = Math.round(sessions.high * 0.35);
            const calls = results.segment_outcome.monthly_discovery_calls_est;
            
            return (
                <div className="space-y-2">
                    {/* Step 1: Pinterest Sessions */}
                    <FunnelCard
                        step="STEP 1: REACH"
                        label="Pinterest monthly reach"
                        value={formatRange(sessions.low, sessions.high)}
                        sublabel="People who could discover your services"
                        width="full"
                        influencedBy={[
                            { label: "Publishing volume", impact: distImpact },
                            { label: "Visual library", impact: distImpact },
                            { label: "Niche demand", impact: "neutral" },
                        ]}
                    />
                    
                    <FunnelArrow />
                    
                    {/* Step 2: Website Visits */}
                    <FunnelCard
                        step="STEP 2: TRAFFIC"
                        label="Potential website visits"
                        value={formatRange(websiteVisitsLow, websiteVisitsHigh)}
                        sublabel="Based on 15-35% click-through rate"
                        width="medium"
                        influencedBy={[
                            { label: "Pin quality", impact: "neutral" },
                            { label: "CTR optimization", impact: "neutral" },
                        ]}
                    />
                    
                    <FunnelArrow />
                    
                    {/* Step 3: Discovery Calls - PRIMARY OUTCOME */}
                    <FunnelCard
                        step="STEP 3: QUALIFIED LEADS"
                        label="Monthly discovery calls"
                        value={formatRange(calls.low, calls.high)}
                        sublabel="Qualified leads booking calls with you"
                        width="narrow"
                        influencedBy={[
                            { label: "Website quality", impact: convImpact },
                            { label: "Offer clarity", impact: convImpact },
                            { label: "Booking flow", impact: "neutral" },
                        ]}
                    />
                </div>
            );
        }
        
        return null;
    }, [results]);

    // "What drove this" section with interactive pills including question numbers
    const WhatDroveThis = useMemo(() => {
        const distCapacity = results.demand.distribution_capacity_m;
        const convReadiness = results.demand.conversion_readiness_m;
        
        const FactorPill = ({ label, question, value, impact }: { label: string; question: string; value: string; impact: "boost" | "neutral" | "limit" }) => {
            const colorClass = impact === "boost" ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400" : 
                               impact === "limit" ? "border-orange-500/30 bg-orange-500/10 text-orange-700 dark:text-orange-400" : 
                               "border-[var(--border)] bg-[var(--background)] text-[var(--foreground-muted)]";
            
            const icon = impact === "boost" ? "↗" : impact === "limit" ? "↘" : "→";
            
            return (
                <div 
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-all hover:scale-105 ${colorClass}`}
                    title={`${question}: ${value}`}
                >
                    <span className="font-medium">{label}</span>
                    <span className="opacity-60 text-[10px]">{question}</span>
                    <span className="opacity-70">{value}</span>
                    <span className="text-base">{icon}</span>
                </div>
            );
        };
        
        const volumeAnswer = recap.find(r => r.label.toLowerCase().includes("content") || r.label.toLowerCase().includes("publish") || r.label.toLowerCase().includes("promos"))?.value ?? "—";
        const visualAnswer = recap.find(r => r.label.toLowerCase().includes("visual"))?.value ?? "—";
        const siteAnswer = recap.find(r => r.label.toLowerCase().includes("website"))?.value ?? "—";
        const offerAnswer = recap.find(r => r.label.toLowerCase().includes("offer") || r.label.toLowerCase().includes("magnet"))?.value ?? "—";
        const adsAnswer = recap.find(r => r.label.toLowerCase().includes("ads"))?.value ?? "—";
        
        return (
            <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                <div className="text-sm font-semibold text-[var(--foreground)] mb-3">What drove this</div>
                
                <div className="space-y-3">
                    <div>
                        <div className="text-xs text-[var(--foreground-muted)] mb-2">Distribution (reach)</div>
                        <div className="flex flex-wrap gap-2">
                            <FactorPill 
                                label="Publishing volume" 
                                question="Q3"
                                value={volumeAnswer}
                                impact={distCapacity > 1.05 ? "boost" : distCapacity < 0.95 ? "limit" : "neutral"}
                            />
                            <FactorPill 
                                label="Visual library" 
                                question="Q4"
                                value={visualAnswer}
                                impact={distCapacity > 1.05 ? "boost" : distCapacity < 0.95 ? "limit" : "neutral"}
                            />
                            <FactorPill 
                                label="Growth mode" 
                                question="Q8"
                                value={adsAnswer}
                                impact={adsAnswer.toLowerCase().includes("ads") || adsAnswer.toLowerCase().includes("yes") ? "boost" : "neutral"}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <div className="text-xs text-[var(--foreground-muted)] mb-2">Conversion (outcomes)</div>
                        <div className="flex flex-wrap gap-2">
                            <FactorPill 
                                label="Website quality" 
                                question="Q5"
                                value={siteAnswer}
                                impact={convReadiness > 1.05 ? "boost" : convReadiness < 0.95 ? "limit" : "neutral"}
                            />
                            <FactorPill 
                                label="Offer clarity" 
                                question="Q6"
                                value={offerAnswer}
                                impact={convReadiness > 1.05 ? "boost" : convReadiness < 0.95 ? "limit" : "neutral"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [results, recap]);

    const ProductExtras = null; // Revenue now shown in SegmentFunnel

    const LeadCaptureHardLock = showHardLockGate ? (
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <div>
                    <h3 className="font-heading text-lg text-[var(--foreground)]">Reveal your full snapshot</h3>
                    <p className="mt-1 text-sm text-[var(--foreground-muted)]">
                        Enter your email to view your results (and keep a copy).
                    </p>
                    <p className="mt-2 text-xs text-[var(--foreground-muted)]">{privacyMicrocopy}</p>
                </div>

                <div className="mt-3 sm:mt-0 sm:col-span-2">
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
                                {errors["LEAD.name"] ? (
                                    <div className="mt-1 text-xs text-red-500">{errors["LEAD.name"]}</div>
                                ) : null}
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
                            {errors["LEAD.email"] ? (
                                <div className="mt-1 text-xs text-red-500">{errors["LEAD.email"]}</div>
                            ) : null}
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

                <div className="mt-3 sm:mt-0 sm:col-span-2">
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
                            {optionalLeadEmailError ? (
                                <div className="mt-1 text-xs text-red-500">{optionalLeadEmailError}</div>
                            ) : null}
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

    const tags = results?.inferred?.tags ?? [];
    const showTags = Array.isArray(tags) && tags.length > 0;

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
                <div className="mb-3 text-sm text-[var(--foreground-muted)]">Pinterest Potential — Results</div>

                <ResultsHero variant={heroVariant} onEditAnswers={onEditAnswers} onStartOver={onStartOver} />

                {LeadCaptureHardLock}

                <div className={showHardLockGate ? "mt-4 opacity-40 blur-[2px] pointer-events-none select-none" : "mt-4"}>
                    {ResultsCards}

                    {/* Product seller: AOV revenue breakdown */}
                    {results.segment_outcome.kind === "product_seller" && (
                        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-5">
                            <div className="text-sm font-semibold text-[var(--foreground)] mb-3">Revenue by price point</div>
                            
                            {(() => {
                                const revenue = results.segment_outcome.revenue_by_aov_est ?? {};
                                const buckets = results.segment_outcome.assumptions?.aov_buckets ?? [];
                                
                                return (
                                    <div className="space-y-2">
                                        {buckets.map((bucket) => {
                                            const r = revenue[bucket.id];
                                            if (!r) return null;
                                            
                                            return (
                                                <div key={bucket.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] hover:border-[var(--brand-raspberry)]/30 transition-colors">
                                                    <div className="text-sm text-[var(--foreground)]">{bucket.label}</div>
                                                    <div className="font-heading text-lg text-[var(--foreground)]">
                                                        ${formatNumber(r.low)}–${formatNumber(r.high)}/mo
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {WhatDroveThis}

                    {/* Niche context cards with fixed hover tooltips */}
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                        <div className="group relative rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 transition-all hover:border-[var(--brand-raspberry)]/30 hover:shadow-sm">
                            <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                                <span>Seasonality</span>
                                <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="mt-1 text-sm font-semibold text-[var(--foreground)] capitalize">
                                {results.inferred.seasonality_index}
                            </div>
                            <div className="mt-1 text-xs text-[var(--foreground-muted)]">
                                {results.inferred.seasonality_index === "low" ? "Steady demand year-round" : 
                                 results.inferred.seasonality_index === "medium" ? "Some seasonal variation" : 
                                 "Strong seasonal peaks"}
                            </div>
                            {/* Hover tooltip - fixed opacity */}
                            <div className="pointer-events-none absolute left-0 top-full z-10 mt-2 hidden w-64 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-xs shadow-xl opacity-0 group-hover:block group-hover:opacity-100 transition-opacity">
                                <div className="font-semibold text-[var(--foreground)] mb-1">Based on:</div>
                                <div className="text-[var(--foreground-muted)]">
                                    Historical Pinterest search patterns for your niche ({recap.find(r => r.label.toLowerCase().includes("niche"))?.value || "your niche"})
                                </div>
                            </div>
                        </div>

                        <div className="group relative rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 transition-all hover:border-[var(--brand-raspberry)]/30 hover:shadow-sm">
                            <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                                <span>Competition</span>
                                <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="mt-1 text-sm font-semibold text-[var(--foreground)] capitalize">
                                {results.inferred.competition_index}
                            </div>
                            <div className="mt-1 text-xs text-[var(--foreground-muted)]">
                                {results.inferred.competition_index === "low" ? "Less crowded niche" : 
                                 results.inferred.competition_index === "medium" ? "Moderate competition" : 
                                 "Highly competitive niche"}
                            </div>
                            {/* Hover tooltip - fixed opacity */}
                            <div className="pointer-events-none absolute left-0 top-full z-10 mt-2 hidden w-64 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-xs shadow-xl opacity-0 group-hover:block group-hover:opacity-100 transition-opacity">
                                <div className="font-semibold text-[var(--foreground)] mb-1">Based on:</div>
                                <div className="text-[var(--foreground-muted)]">
                                    Number of active publishers and content saturation in your niche category
                                </div>
                            </div>
                        </div>

                        <div className="group relative rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 transition-all hover:border-[var(--brand-raspberry)]/30 hover:shadow-sm">
                            <div className="flex items-center gap-2 text-xs text-[var(--foreground-muted)]">
                                <span>Audience income</span>
                                <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="mt-1 text-sm font-semibold text-[var(--foreground)]">{incomeRangeLabel}</div>
                            <div className="mt-1 text-xs text-[var(--foreground-muted)]">Context, not prediction</div>
                            {/* Hover tooltip - fixed opacity */}
                            <div className="pointer-events-none absolute left-0 top-full z-10 mt-2 hidden w-64 rounded-lg border border-[var(--border)] bg-[var(--card)] p-3 text-xs shadow-xl opacity-0 group-hover:block group-hover:opacity-100 transition-opacity">
                                <div className="font-semibold text-[var(--foreground)] mb-1">Based on:</div>
                                <div className="text-[var(--foreground-muted)]">
                                    Typical household income of Pinterest users engaged with this niche (US/Canada). This doesn't predict your specific buyer income.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Strategic insight - moved below main results */}
                    {insight ? (
                        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-5">
                            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-raspberry)] mb-2">
                                Strategic Insight
                            </div>
                            <div className="text-sm text-[var(--foreground)] leading-relaxed">
                                {insight}
                            </div>
                        </div>
                    ) : null}

                    {/* Expanded methodology with more details */}
                    <details className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                        <summary className="cursor-pointer px-6 py-4 hover:bg-[var(--background)] transition-colors flex items-center justify-between">
                            <div className="text-sm font-semibold text-[var(--foreground)]">How we calculated this</div>
                            <svg className="w-4 h-4 text-[var(--foreground-muted)] transition-transform details-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>
                        
                        <div className="px-6 pb-6 space-y-4 border-t border-[var(--border)] bg-[var(--background)]">
                            {/* Foundation */}
                            <div>
                                <div className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-2">
                                    Foundation
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-[var(--foreground-muted)]">Platform size: </span>
                                        <span className="text-[var(--foreground)]">
                                            ~102M monthly users in US/Canada{" "}
                                            <a 
                                                href="https://investor.pinterestinc.com/news-and-events/press-releases/" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-[var(--brand-raspberry)] hover:underline"
                                            >
                                                (source)
                                            </a>
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-[var(--foreground-muted)]">Your niche reach: </span>
                                        <span className="text-[var(--foreground)]">{demandBaseSessionsRangeLabel} sessions/month</span>
                                    </div>
                                    <div className="text-xs text-[var(--foreground-muted)] italic">
                                        This is calculated as a percentage of total platform activity focused on {recap.find(r => r.label.toLowerCase().includes("niche"))?.value || "your niche"}, based on Pinterest search trends and category data.
                                    </div>
                                </div>
                            </div>

                            {/* How answers affect results */}
                            <div>
                                <div className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-2">
                                    How Your Answers Affect Results
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="text-[var(--foreground-muted)]">
                                        <strong className="text-[var(--foreground)]">Distribution (Reach):</strong> Your publishing volume, visual quality, and whether you use ads all influence how many people see your content. Consistent publishing + strong visuals + ads = maximum reach.
                                    </div>
                                    <div className="text-[var(--foreground-muted)]">
                                        <strong className="text-[var(--foreground)]">Conversion (Outcomes):</strong> Website speed, clarity, and offer attractiveness determine what percentage of visitors take action. A fast, clear site with compelling offers converts better.
                                    </div>
                                    <div className="text-[var(--foreground-muted)]">
                                        <strong className="text-[var(--foreground)]">Niche factors:</strong> Seasonality and competition are estimated from historical Pinterest data for your category. These create natural ceilings or boost factors independent of your execution.
                                    </div>
                                </div>
                            </div>

                            {/* Assumptions */}
                            <div>
                                <div className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wide mb-2">
                                    Key Assumptions
                                </div>
                                <ul className="space-y-1.5 text-sm text-[var(--foreground-muted)]">
                                    <li>• Click-through rates: 15-35% (industry benchmarks)</li>
                                    <li>• Conversion rates: Vary by segment and offer quality</li>
                                    {results.segment_outcome.kind === "product_seller" && (
                                        <li>• Purchase intent: ~25% of sessions for product categories</li>
                                    )}
                                    <li>• US & Canada only (international traffic not included)</li>
                                    <li>• Organic reach prioritized (ads provide incremental boost)</li>
                                </ul>
                            </div>

                            {/* Disclaimer */}
                            <div className="pt-3 border-t border-[var(--border)]">
                                <div className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                                    <strong>Important:</strong> These are modeled estimates based on platform data, niche benchmarks, and your inputs. 
                                    Actual results depend on content quality, consistency, SEO optimization, and market timing. This is not a guarantee of results.
                                </div>
                            </div>
                        </div>
                    </details>

                    {LeadCaptureSoftLock}
                </div>

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

                <div className="mt-4 text-sm text-[var(--foreground-muted)]">
                    You can refresh the page; your draft is saved in this session.
                </div>
            </div>
        </>
    );
}
