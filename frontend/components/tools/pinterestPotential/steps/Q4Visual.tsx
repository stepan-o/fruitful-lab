"use client";

import React, { useId, useMemo } from "react";
import type { VisualStrength, StepBaseProps } from "./ppcV2Types";

type Opt = {
    v: VisualStrength;
    title: string;
    subtitle: string;
    level: 1 | 2 | 3 | 4;
    badge: string;
};

function LevelPips({
                       level,
                       total = 4,
                       selected,
                   }: {
    level: number;
    total?: number;
    selected: boolean;
}) {
    return (
        <div className="flex items-center gap-1" aria-hidden="true" title={`${level} of ${total}`}>
            {Array.from({ length: total }).map((_, i) => {
                const n = i + 1;
                const on = n <= level;
                return (
                    <span
                        key={n}
                        className={[
                            "h-2.5 w-2.5 rounded-full border transition",
                            "border-[var(--border)]",
                            on ? "bg-[var(--brand-bronze)]" : "bg-[var(--card)]",
                            selected && on ? "shadow-[0_0_0_1px_rgba(0,0,0,0.18)_inset]" : "",
                        ].join(" ")}
                    />
                );
            })}
        </div>
    );
}

function SelectedChip() {
    return (
        <span
            className={[
                "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs",
                "border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)] text-[var(--foreground)]",
            ].join(" ")}
        >
      <span className="h-2.5 w-2.5 rounded-full bg-[var(--brand-raspberry)] shadow-[0_0_0_2px_rgba(0,0,0,0.25)_inset]" />
      Selected
    </span>
    );
}

type PinKind = "photo" | "video" | "carousel" | "product";

function KindBadge({ kind }: { kind: PinKind }) {
    const label =
        kind === "photo" ? "Photo" : kind === "video" ? "Video" : kind === "carousel" ? "Carousel" : "Product";
    return (
        <span
            className={[
                "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]",
                "border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)] text-[var(--foreground-muted)]",
            ].join(" ")}
            aria-hidden="true"
        >
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-bronze)]" />
            {label}
    </span>
    );
}

function IconMark({ kind }: { kind: PinKind }) {
    // tiny inline SVG marks; no deps
    if (kind === "video") {
        return (
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="opacity-90">
                <path
                    d="M10 8.8v6.4c0 .6.7 1 1.2.6l5-3.2c.5-.3.5-1 0-1.3l-5-3.2c-.5-.3-1.2 0-1.2.7Z"
                    fill="currentColor"
                />
            </svg>
        );
    }
    if (kind === "carousel") {
        return (
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="opacity-90">
                <path
                    d="M7 7h10a2 2 0 0 1 2 2v10H9a2 2 0 0 1-2-2V7Z"
                    fill="currentColor"
                    opacity="0.85"
                />
                <path d="M5 5h10a2 2 0 0 1 2 2H7a2 2 0 0 1-2-2V5Z" fill="currentColor" opacity="0.35" />
            </svg>
        );
    }
    if (kind === "product") {
        return (
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="opacity-90">
                <path
                    d="M7 8h10l-1 12H8L7 8Zm3-4h4l1 4H9l1-4Z"
                    fill="currentColor"
                    opacity="0.9"
                />
            </svg>
        );
    }
    // photo
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="opacity-90">
            <path
                d="M7 7h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
                fill="currentColor"
                opacity="0.9"
            />
            <path d="M8 16l3-3 2 2 3-4 2 5H8Z" fill="currentColor" opacity="0.25" />
        </svg>
    );
}

function PinCard({
                     kind,
                     tint,
                     selected,
                     active,
                     style,
                 }: {
    kind: PinKind;
    tint: "raspberry" | "bronze" | "mix";
    selected: boolean;
    active: boolean;
    style?: React.CSSProperties;
}) {
    const bg =
        tint === "raspberry"
            ? "linear-gradient(135deg, rgba(149,9,82,0.22), rgba(255,255,255,0.02))"
            : tint === "bronze"
                ? "linear-gradient(135deg, rgba(213,137,54,0.22), rgba(255,255,255,0.02))"
                : "linear-gradient(135deg, rgba(149,9,82,0.18), rgba(213,137,54,0.16))";

    return (
        <div
            className={[
                "relative overflow-hidden rounded-xl border",
                "border-[var(--border)] bg-[var(--background)]",
                "shadow-[0_10px_24px_rgba(0,0,0,0.32)]",
            ].join(" ")}
            style={{
                ...style,
                opacity: active ? 1 : 0.38,
                filter: active ? "saturate(1.05)" : "saturate(0.7)",
            }}
            aria-hidden="true"
        >
            {/* main “image” wash */}
            <div className="absolute inset-0" style={{ background: bg }} />

            {/* subtle texture + vignette */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(120px 70px at 18% 20%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(160px 90px at 90% 80%, rgba(255,255,255,0.06), transparent 55%)",
                    opacity: active ? 1 : 0.7,
                }}
            />

            {/* animated sheen (only meaningful when selected/hovered) */}
            <div
                className={[
                    "absolute inset-0 pointer-events-none",
                    selected ? "opacity-100" : "opacity-0 group-hover:opacity-70",
                ].join(" ")}
                style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
                    transform: "translateX(-60%)",
                    animation: selected ? "ppcSheen 2.6s ease-in-out infinite" : undefined,
                }}
            />

            {/* top bar */}
            <div className="relative flex items-center justify-between px-3 py-2">
                <div className="inline-flex items-center gap-2 text-[10px] text-[var(--foreground-muted)]">
          <span className="grid h-5 w-5 place-items-center rounded-full border border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)] text-[var(--foreground)]">
            <IconMark kind={kind} />
          </span>
                    <KindBadge kind={kind} />
                </div>

                <span className="h-2 w-10 rounded-full bg-[var(--card)] opacity-60" />
            </div>

            {/* bottom “caption” lines */}
            <div className="relative px-3 pb-3">
                <div className="h-2 w-2/3 rounded bg-[var(--card)] opacity-70" />
                <div className="mt-2 h-2 w-1/2 rounded bg-[var(--card)] opacity-50" />
            </div>

            {/* glow edge when selected */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    boxShadow: selected ? "0 0 0 1px rgba(149,9,82,0.50) inset" : "0 0 0 1px rgba(255,255,255,0.04) inset",
                    opacity: selected ? 1 : 0.9,
                }}
            />
        </div>
    );
}

/**
 * “AAA visual library” preview: stacked mini Pin cards with depth + motion.
 * Richness/variety increases with level.
 */
function VisualStack({
                         level,
                         selected,
                     }: {
    level: 1 | 2 | 3 | 4;
    selected: boolean;
}) {
    const spec = useMemo(() => {
        // deterministic sets per level (no randomness)
        const base: Array<{ kind: PinKind; tint: "raspberry" | "bronze" | "mix" }> =
            level === 1
                ? [{ kind: "photo", tint: "raspberry" }]
                : level === 2
                    ? [
                        { kind: "photo", tint: "raspberry" },
                        { kind: "carousel", tint: "mix" },
                    ]
                    : level === 3
                        ? [
                            { kind: "photo", tint: "raspberry" },
                            { kind: "video", tint: "mix" },
                            { kind: "carousel", tint: "bronze" },
                        ]
                        : [
                            { kind: "photo", tint: "raspberry" },
                            { kind: "video", tint: "mix" },
                            { kind: "carousel", tint: "bronze" },
                            { kind: "product", tint: "mix" },
                        ];

        return base;
    }, [level]);

    // Card placements (consistent, looks intentional)
    const placements = useMemo(() => {
        const p = [
            { x: 0, y: 0, r: -2, s: 1.0, w: 168, h: 86 },
            { x: 56, y: 6, r: 2, s: 0.98, w: 168, h: 86 },
            { x: 112, y: 12, r: -1, s: 0.96, w: 168, h: 86 },
            { x: 22, y: 30, r: 1.5, s: 0.96, w: 168, h: 86 },
        ];
        return p;
    }, []);

    return (
        <div
            className={[
                "relative mt-3 h-[96px] w-full overflow-visible",
                "rounded-xl border border-[var(--border)] bg-[var(--card)] p-3",
            ].join(" ")}
            aria-hidden="true"
        >
            {/* background glow (subtle) */}
            <div
                className="absolute inset-0 rounded-xl"
                style={{
                    background:
                        "radial-gradient(260px 120px at 18% 35%, rgba(149,9,82,0.14), transparent 60%), radial-gradient(260px 140px at 80% 70%, rgba(213,137,54,0.12), transparent 62%)",
                    opacity: selected ? 1 : 0.75,
                }}
            />

            {/* stacked cards */}
            <div className="absolute inset-0">
                {placements.slice(0, spec.length).map((pos, idx) => {
                    const active = idx < spec.length;
                    const z = 10 + idx;
                    // gentle float only when selected/hovered
                    const floatAnim = selected ? `ppcFloat${idx}` : undefined;

                    return (
                        <div
                            key={idx}
                            className="group absolute"
                            style={{
                                left: pos.x,
                                top: pos.y,
                                zIndex: z,
                                transform: `rotate(${pos.r}deg) scale(${pos.s})`,
                                animation: floatAnim ? `${floatAnim} 5.6s ease-in-out infinite` : undefined,
                            }}
                        >
                            <PinCard
                                kind={spec[idx].kind}
                                tint={spec[idx].tint}
                                selected={selected}
                                active={active}
                                style={{ width: pos.w, height: pos.h }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* “more variety” micro cue */}
            <div className="absolute right-3 top-3 flex items-center gap-2">
        <span className="text-[10px] text-[var(--foreground-muted)]">
          {level >= 4 ? "Variety" : level >= 3 ? "Mix" : level >= 2 ? "Some" : "Starter"}
        </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-bronze)] opacity-80" />
            </div>
        </div>
    );
}

function HelpDetails() {
    return (
        <details className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
            <summary
                className={[
                    "cursor-pointer select-none list-none text-sm text-[var(--foreground)]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)]",
                    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                    "flex items-center justify-between gap-3",
                ].join(" ")}
            >
        <span className="inline-flex items-center gap-2">
          <span
              aria-hidden="true"
              className={[
                  "grid h-7 w-7 place-items-center rounded-full border",
                  "border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)]",
              ].join(" ")}
          >
            <span className="h-2 w-2 rounded-full bg-[var(--brand-bronze)]" />
          </span>
          What counts as “visual content”?
        </span>

                <span
                    aria-hidden="true"
                    className={[
                        "text-xs text-[var(--foreground-muted)] transition-transform",
                        "group-open:rotate-180",
                    ].join(" ")}
                >
          ▼
        </span>
            </summary>

            <div className="mt-2 text-sm text-[var(--foreground-muted)]">
                Photos, short-form videos, product shots, before/after, UGC, graphics, templates — anything you can turn into
                Pins without starting from zero every time.
            </div>
        </details>
    );
}

export default function Q4Visual({
                                     value,
                                     onChange,
                                     onAutoAdvance,
                                 }: StepBaseProps & {
    value?: VisualStrength;
    onChange: (v: VisualStrength) => void;
}) {
    const listId = useId();

    const opts: Opt[] = [
        { v: "limited", title: "Limited", subtitle: "Starter library", level: 1, badge: "Starter" },
        { v: "decent", title: "Decent", subtitle: "Some solid assets", level: 2, badge: "Baseline" },
        { v: "strong", title: "Strong", subtitle: "Consistent + reusable", level: 3, badge: "Reliable" },
        { v: "very_strong", title: "Very strong", subtitle: "Deep library + variety", level: 4, badge: "Stacked" },
    ];

    return (
        <div className="grid gap-4">
            {/* local keyframes (kept inside component file, no globals needed) */}
            <style>{`
        @keyframes ppcSheen {
          0% { transform: translateX(-60%); opacity: 0.0; }
          30% { opacity: 0.9; }
          60% { opacity: 0.35; }
          100% { transform: translateX(120%); opacity: 0.0; }
        }
        @keyframes ppcFloat0 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-2px); } }
        @keyframes ppcFloat1 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-3px); } }
        @keyframes ppcFloat2 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-2.5px); } }
        @keyframes ppcFloat3 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-3.2px); } }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

            {/* Framing (tight; no “score/rail”) */}
            <div className="grid gap-1">
                <div className="text-sm text-[var(--foreground-muted)]">Pick the closest match — don’t overthink it.</div>
            </div>

            {/* Options */}
            <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-labelledby={listId}>
        <span id={listId} className="sr-only">
          Visual content strength
        </span>

                {opts.map((o) => {
                    const selected = value === o.v;

                    return (
                        <button
                            key={o.v}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => {
                                onChange(o.v);
                                onAutoAdvance?.();
                            }}
                            className={[
                                "group relative w-full rounded-2xl border p-4 text-left transition",
                                "border-[var(--border)] bg-[var(--background)]",
                                "hover:bg-[var(--card-hover)]",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                                selected
                                    ? [
                                        "border-[var(--brand-raspberry)]/60",
                                        "ring-2 ring-[var(--brand-raspberry)]/70",
                                        "shadow-[0_12px_30px_rgba(0,0,0,0.40)]",
                                        "translate-y-[-1px]",
                                    ].join(" ")
                                    : "",
                            ].join(" ")}
                        >
                            {/* Premium wash */}
                            <span
                                aria-hidden="true"
                                className={[
                                    "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity",
                                    selected ? "opacity-100" : "group-hover:opacity-20",
                                ].join(" ")}
                                style={{
                                    background:
                                        "radial-gradient(520px 240px at 18% 10%, rgba(255,255,255,0.07), transparent 58%), linear-gradient(90deg, color-mix(in srgb, var(--brand-raspberry) 30%, transparent), color-mix(in srgb, var(--brand-bronze) 20%, transparent))",
                                }}
                            />

                            {/* Inner crisp stroke */}
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]"
                            />

                            <div className="relative flex items-start justify-between gap-4">
                                {/* Left: hierarchy */}
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-lg font-semibold tracking-tight text-[var(--foreground)]">{o.title}</div>

                                        <span
                                            className={[
                                                "inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs",
                                                "border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)] text-[var(--foreground-muted)]",
                                            ].join(" ")}
                                        >
                      <span
                          className={[
                              "h-1.5 w-1.5 rounded-full",
                              selected ? "bg-[var(--brand-raspberry)]" : "bg-[var(--border)] opacity-70",
                          ].join(" ")}
                          aria-hidden="true"
                      />
                                            {o.badge}
                    </span>
                                    </div>

                                    <div className="mt-1 text-sm text-[var(--foreground-muted)]">{o.subtitle}</div>

                                    {/* THE visual moment */}
                                    <VisualStack level={o.level} selected={selected} />
                                </div>

                                {/* Right: single indicator (clean) */}
                                <div className="flex flex-col items-end gap-2 pt-1">
                                    <LevelPips level={o.level} selected={selected} />
                                    <div className="text-xs text-[var(--foreground-muted)]">{o.level}/4</div>
                                    {selected ? <SelectedChip /> : <span className="h-7" aria-hidden="true" />}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <HelpDetails />
        </div>
    );
}
