// frontend/components/tools/pinterestPotential/views/ResultsView.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { ResultsBundle } from "@/lib/tools/pinterestPotential/compute";

export type ResultsRecapItem = {
    label: string;
    value: string;
};

export type ResultsViewProps = {
    results: ResultsBundle;

    // Cards (pre-formatted strings so this stays pure UI)
    audienceRangeLabel: string;
    opportunityLabel: string;
    opportunityRangeLabel: string;
    incomeRangeLabel: string;

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

            const left = originX + (spread / (window.innerWidth || 1)) * 100 * 0.85 + (Math.random() * 8 - 4);
            const top = originY + (Math.random() * 36 - 18);

            const size = (lvl === 3 ? 10 : lvl === 2 ? 11 : 12) + Math.random() * (lvl === 3 ? 18 : 16);
            const radius = Math.random() < 0.45 ? size * 0.9 : Math.random() < 0.75 ? size * 0.35 : size * 0.15;

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
}

function ResultsHero({ variant }: { variant: HeroVariant }) {
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

            <div className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="text-xs font-semibold tracking-wide text-[var(--foreground-muted)]">{copy.eyebrow}</div>
                    <div className="mt-1 font-heading text-2xl text-[var(--foreground)] sm:text-3xl">{copy.title}</div>
                    <div className="mt-2 max-w-2xl text-sm text-[var(--foreground-muted)]">{copy.body}</div>
                </div>

                <div className="shrink-0">
                    <CheckBadge text="Completed • 8/8" />
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

export default function ResultsView({
                                        results,
                                        audienceRangeLabel,
                                        opportunityLabel,
                                        opportunityRangeLabel,
                                        incomeRangeLabel,
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

    const ResultsCards = (
        <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-xs text-[var(--foreground-muted)]">Monthly Pinterest audience</div>
                <div className="mt-1 font-heading text-2xl text-[var(--foreground)]">{audienceRangeLabel}</div>
            </div>

            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-xs text-[var(--foreground-muted)]">{opportunityLabel}</div>
                <div className="mt-1 font-heading text-2xl text-[var(--foreground)]">{opportunityRangeLabel}</div>
            </div>

            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-xs text-[var(--foreground-muted)]">Audience income range (USD)</div>
                <div className="mt-1 font-heading text-2xl text-[var(--foreground)]">{incomeRangeLabel}</div>
            </div>
        </div>
    );

    const LeadCaptureHardLock = showHardLockGate ? (
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <div>
                    <h3 className="font-heading text-lg text-[var(--foreground)]">Reveal your full snapshot</h3>
                    <p className="mt-1 text-sm text-[var(--foreground-muted)]">Enter your email to view your results (and keep a copy).</p>
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
                <div className="mb-3 text-sm text-[var(--foreground-muted)]">Pinterest Potential — Results</div>

                <ResultsHero variant={heroVariant} />

                {LeadCaptureHardLock}

                <div className={showHardLockGate ? "mt-4 opacity-40 blur-[2px] pointer-events-none select-none" : "mt-4"}>
                    {ResultsCards}

                    {results.insight_line ? (
                        <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--foreground)]">
                            {results.insight_line}
                        </div>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--foreground-muted)]">
            <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2 py-1">
              Seasonality: <span className="text-[var(--foreground)]">{results.inferred.seasonality_index}</span>
            </span>
                        <span className="rounded-full border border-[var(--border)] bg-[var(--background)] px-2 py-1">
              Competition: <span className="text-[var(--foreground)]">{results.inferred.competition_index}</span>
            </span>
                    </div>

                    {LeadCaptureSoftLock}
                </div>

                <div className="mt-6 border-t border-[var(--border)] pt-4">
                    <div className="mb-2 font-heading text-lg text-[var(--foreground)]">Your answers</div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {recap.map((it, idx) => (
                            <div key={`${idx}-${it.label}`} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                                <div className="text-xs text-[var(--foreground-muted)]">{it.label}</div>
                                <div className="mt-1 text-sm text-[var(--foreground)]">{it.value}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onStartOver}
                        className="rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--card-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                        Start over
                    </button>

                    <button
                        type="button"
                        onClick={onEditAnswers}
                        className="rounded-md bg-[var(--brand-raspberry)] px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                        Edit answers
                    </button>
                </div>

                <div className="mt-4 text-sm text-[var(--foreground-muted)]">You can refresh the page; your draft is saved in this session.</div>
            </div>
        </>
    );
}
