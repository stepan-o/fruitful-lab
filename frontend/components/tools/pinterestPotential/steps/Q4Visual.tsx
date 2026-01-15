"use client";

import React, { useId, useMemo } from "react";
import type { VisualStrength, StepBaseProps } from "./ppcV2Types";

type Opt = {
    v: VisualStrength;
    title: string;
    subtitle: string;
    level: 1 | 2 | 3 | 4;
    badge: string;
    guidance: string;
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

type PinKind = "photo" | "video" | "carousel" | "product" | "before_after" | "ugc";

function KindGlyph({ kind }: { kind: PinKind }) {
    const base =
        "grid h-7 w-7 place-items-center rounded-full border border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)] text-[var(--foreground-muted)] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]";
    const icon =
        kind === "video" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="opacity-90">
                <path
                    d="M10 8.8v6.4c0 .6.7 1 1.2.6l5-3.2c.5-.3.5-1 0-1.3l-5-3.2c-.5-.3-1.2 0-1.2.7Z"
                    fill="currentColor"
                />
            </svg>
        ) : kind === "carousel" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="opacity-90">
                <path
                    d="M7 7h10a2 2 0 0 1 2 2v10H9a2 2 0 0 1-2-2V7Z"
                    fill="currentColor"
                    opacity="0.8"
                />
                <path d="M5 5h10a2 2 0 0 1 2 2H7a2 2 0 0 1-2-2V5Z" fill="currentColor" opacity="0.35" />
            </svg>
        ) : kind === "product" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="opacity-90">
                <path d="M7 8h10l-1 12H8L7 8Zm3-4h4l1 4H9l1-4Z" fill="currentColor" opacity="0.9" />
            </svg>
        ) : kind === "before_after" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="opacity-90">
                <path d="M5 6h6v12H5V6Z" fill="currentColor" opacity="0.35" />
                <path d="M13 6h6v12h-6V6Z" fill="currentColor" opacity="0.85" />
                <path d="M12 6v12" stroke="currentColor" strokeWidth="2" opacity="0.7" />
            </svg>
        ) : kind === "ugc" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="opacity-90">
                <path
                    d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 9a7 7 0 0 1 14 0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.85"
                />
            </svg>
        ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="opacity-90">
                <path
                    d="M7 7h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
                    fill="currentColor"
                    opacity="0.9"
                />
                <path d="M8 16l3-3 2 2 3-4 2 5H8Z" fill="currentColor" opacity="0.22" />
            </svg>
        );

    return <span className={base}>{icon}</span>;
}

function CaptionLines({ strength }: { strength: 1 | 2 | 3 }) {
    const w1 = strength === 1 ? "w-1/2" : strength === 2 ? "w-2/3" : "w-3/4";
    const w2 = strength === 1 ? "w-1/3" : strength === 2 ? "w-1/2" : "w-2/3";
    const w3 = strength === 1 ? "w-2/5" : strength === 2 ? "w-3/5" : "w-4/5";

    return (
        <div className="mt-2 space-y-1.5">
            <div className={["h-2 rounded bg-[var(--card)] opacity-70", w1].join(" ")} />
            <div className={["h-2 rounded bg-[var(--card)] opacity-45", w2].join(" ")} />
            <div className={["h-2 rounded bg-[var(--card)] opacity-25", w3].join(" ")} />
        </div>
    );
}

function MediaArea({
                       kind,
                       selected,
                       intensity,
                   }: {
    kind: PinKind;
    selected: boolean;
    intensity: 1 | 2 | 3;
}) {
    const overlay =
        kind === "video"
            ? "radial-gradient(120px 60px at 68% 40%, rgba(255,255,255,0.12), transparent 60%)"
            : kind === "product"
                ? "radial-gradient(140px 70px at 60% 35%, rgba(255,255,255,0.10), transparent 60%)"
                : kind === "carousel"
                    ? "radial-gradient(140px 70px at 35% 30%, rgba(255,255,255,0.12), transparent 60%)"
                    : kind === "before_after"
                        ? "linear-gradient(90deg, rgba(255,255,255,0.10), transparent 55%)"
                        : kind === "ugc"
                            ? "radial-gradient(120px 70px at 35% 35%, rgba(255,255,255,0.10), transparent 62%)"
                            : "radial-gradient(140px 70px at 30% 35%, rgba(255,255,255,0.12), transparent 62%)";

    return (
        <div className="relative overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)]">
            <div className="absolute inset-0 ppc-media" />

            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(0,0,0,0.00), rgba(0,0,0,0.22)), radial-gradient(220px 110px at 20% 25%, rgba(149,9,82,0.20), transparent 60%), radial-gradient(260px 140px at 85% 75%, rgba(213,137,54,0.18), transparent 62%)",
                    opacity: 0.95,
                }}
            />

            <div className="absolute inset-0" style={{ background: overlay, opacity: 0.9 }} />

            {/* sheen */}
            <div
                className={[
                    "absolute inset-0 pointer-events-none opacity-0 transition-opacity",
                    selected ? "opacity-100" : "group-hover:opacity-70",
                ].join(" ")}
                style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
                    transform: "translateX(-65%)",
                    animation: selected ? "ppcSheen 2.6s ease-in-out infinite" : undefined,
                }}
            />

            {kind === "video" ? (
                <div className="absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)] text-[var(--foreground)] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset]">
                    <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="opacity-90">
                        <path
                            d="M10 8.8v6.4c0 .6.7 1 1.2.6l5-3.2c.5-.3.5-1 0-1.3l-5-3.2c-.5-.3-1.2 0-1.2.7Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>
            ) : null}

            {kind === "carousel" ? (
                <div className="absolute right-3 top-3 flex items-center gap-1">
                    {[1, 2, 3].map((n) => (
                        <span
                            key={n}
                            className={[
                                "h-1.5 w-1.5 rounded-full",
                                n === 2 ? "bg-[var(--brand-bronze)]" : "bg-[var(--card)]",
                                "opacity-80",
                            ].join(" ")}
                        />
                    ))}
                </div>
            ) : null}

            {kind === "product" ? (
                <div className="absolute right-3 bottom-3 rounded-full border border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)] px-2 py-1 text-[10px] text-[var(--foreground-muted)]">
                    $$
                </div>
            ) : null}

            <div
                className="absolute inset-0"
                style={{
                    background:
                        intensity === 1
                            ? "linear-gradient(transparent 90%, rgba(255,255,255,0.04))"
                            : intensity === 2
                                ? "linear-gradient(transparent 82%, rgba(255,255,255,0.05))"
                                : "linear-gradient(transparent 74%, rgba(255,255,255,0.06))",
                    opacity: 0.7,
                }}
            />
        </div>
    );
}

function PinCard({
                     kind,
                     selected,
                     active,
                     density,
                     style,
                 }: {
    kind: PinKind;
    selected: boolean;
    active: boolean;
    density: 1 | 2 | 3;
    style?: React.CSSProperties;
}) {
    return (
        <div
            className={[
                "ppc-pinCard relative overflow-hidden rounded-xl border",
                "border-[var(--border)] bg-[var(--background)]",
                "shadow-[0_12px_30px_rgba(0,0,0,0.38)]",
            ].join(" ")}
            style={{
                ...style,
                opacity: active ? 1 : 0.35,
                filter: active ? "saturate(1.05)" : "saturate(0.7)",
            }}
            aria-hidden="true"
        >
            <div className="absolute inset-0 p-2">
                <MediaArea kind={kind} selected={selected} intensity={density} />
            </div>

            <div className="relative flex items-center justify-between px-3 pt-3">
                <KindGlyph kind={kind} />
                <span className="h-2 w-10 rounded-full bg-[var(--card)] opacity-55" />
            </div>

            <div className="relative px-3 pb-3 pt-2">
                <CaptionLines strength={density} />
            </div>

            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    boxShadow: selected
                        ? "0 0 0 1px rgba(149,9,82,0.55) inset, 0 0 0 1px rgba(255,255,255,0.06)"
                        : "0 0 0 1px rgba(255,255,255,0.04) inset",
                    opacity: selected ? 1 : 0.95,
                }}
            />
        </div>
    );
}

/**
 * Borderless, “inside the option” guidance.
 * - No extra border/card.
 * - Designed to take minimal vertical space when wrapped under the preview.
 */
function GuidanceBlock({ guidance }: { guidance: string }) {
    return (
        <div className="pt-1">
            <div className="text-[10px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                How to interpret
            </div>
            <div className="mt-1 text-sm leading-snug text-[var(--foreground)]">{guidance}</div>

            <div className="mt-3 flex items-center justify-between gap-3">
                <div className="text-xs text-[var(--foreground-muted)]">Depth</div>
                <div className="flex items-center gap-2">
                    <span className="h-1 w-10 rounded-full bg-[var(--card)]" />
                    <span className="h-1 w-14 rounded-full bg-[var(--card)] opacity-80" />
                    <span className="h-1 w-18 rounded-full bg-[var(--card)] opacity-60" />
                </div>
            </div>
        </div>
    );
}

/**
 * Composition rule (per option):
 * 1) Preview is primary + should only take the space it needs (no flex-1 row eating).
 * 2) Guidance text sits to the right INSIDE the option border, no extra border.
 * 3) If there isn't enough space, guidance wraps below and expands full-width on that row.
 */
function VisualStack({
                         level,
                         selected,
                         guidance,
                     }: {
    level: 1 | 2 | 3 | 4;
    selected: boolean;
    guidance: string;
}) {
    const spec = useMemo(() => {
        const base: PinKind[] =
            level === 1
                ? ["photo"]
                : level === 2
                    ? ["photo", "carousel"]
                    : level === 3
                        ? ["photo", "video", "before_after"]
                        : ["photo", "video", "carousel", "product", "ugc"];
        return base;
    }, [level]);

    const placements = useMemo(() => {
        const p =
            level === 1
                ? [{ x: 8, y: 12, r: -1.5, s: 1.0, w: 182, h: 100 }]
                : level === 2
                    ? [
                        { x: 6, y: 12, r: -2.0, s: 1.0, w: 170, h: 96 },
                        { x: 58, y: 22, r: 2.0, s: 0.98, w: 170, h: 96 },
                    ]
                    : level === 3
                        ? [
                            { x: 6, y: 12, r: -2.0, s: 1.0, w: 162, h: 94 },
                            { x: 50, y: 22, r: 1.2, s: 0.98, w: 162, h: 94 },
                            { x: 94, y: 32, r: -1.2, s: 0.96, w: 162, h: 94 },
                        ]
                        : [
                            { x: 6, y: 12, r: -2.0, s: 1.0, w: 156, h: 92 },
                            { x: 46, y: 22, r: 1.4, s: 0.99, w: 156, h: 92 },
                            { x: 86, y: 32, r: -1.4, s: 0.98, w: 156, h: 92 },
                            { x: 24, y: 44, r: 1.8, s: 0.97, w: 156, h: 92 },
                        ];
        return p;
    }, [level]);

    const density: 1 | 2 | 3 = level === 1 ? 1 : level === 2 ? 2 : 3;

    const panelSize = useMemo(() => {
        // Make the preview container hug its contents (no row-eating),
        // while staying safe inside the option tile.
        const used = placements.slice(0, spec.length);
        const maxX = Math.max(...used.map((p) => p.x + p.w));
        const maxY = Math.max(...used.map((p) => p.y + p.h));
        const pad = 16; // breathing room + fade + chip
        const w = Math.ceil(maxX + pad);
        const h = Math.ceil(maxY + pad);

        // Clamp to a sane range so it doesn't balloon on weird tweaks.
        return {
            w: Math.max(230, Math.min(520, w)),
            h: Math.max(132, Math.min(210, h)),
        };
    }, [placements, spec.length]);

    return (
        <div className="mt-3">
            <div className="flex flex-wrap items-start gap-4">
                {/* PREVIEW: hugs its own width (no flex-1) */}
                <div
                    className={[
                        "relative rounded-xl border",
                        "border-[var(--border)] bg-[var(--card)] p-3",
                        "overflow-hidden isolate",
                        // key: do NOT grow; only take what you need.
                        "flex-none",
                    ].join(" ")}
                    style={{
                        width: `min(${panelSize.w}px, 100%)`,
                        height: panelSize.h,
                    }}
                    aria-hidden="true"
                >
                    {/* background glow */}
                    <div
                        className="absolute inset-0 rounded-xl"
                        style={{
                            background:
                                "radial-gradient(320px 150px at 18% 35%, rgba(149,9,82,0.18), transparent 62%), radial-gradient(340px 170px at 82% 70%, rgba(213,137,54,0.16), transparent 64%)",
                            opacity: selected ? 1 : 0.72,
                        }}
                    />

                    {/* subtle texture */}
                    <div
                        className="absolute inset-0 rounded-xl opacity-60"
                        style={{
                            background:
                                "radial-gradient(1px 1px at 12px 10px, rgba(255,255,255,0.06), transparent 70%), radial-gradient(1px 1px at 34px 26px, rgba(255,255,255,0.05), transparent 70%), radial-gradient(1px 1px at 58px 18px, rgba(255,255,255,0.04), transparent 70%)",
                        }}
                    />

                    {/* right-edge fade */}
                    <div
                        className="pointer-events-none absolute inset-y-0 right-0 w-10"
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.55))",
                            opacity: 0.8,
                        }}
                    />

                    {/* stacked cards */}
                    <div className="absolute inset-0 pointer-events-none">
                        {placements.slice(0, spec.length).map((pos, idx) => {
                            const floatAnim = selected ? `ppcFloat${idx}` : undefined;
                            const popAnim = selected ? "ppcPopIn 420ms ease-out both" : undefined;

                            return (
                                <div
                                    key={`${level}-${idx}`}
                                    className="absolute"
                                    style={{
                                        left: pos.x,
                                        top: pos.y,
                                        zIndex: 10 + idx,
                                        transform: `rotate(${pos.r}deg) scale(${pos.s})`,
                                        animation: [floatAnim ? `${floatAnim} 6.2s ease-in-out infinite` : "", popAnim || ""]
                                            .filter(Boolean)
                                            .join(", "),
                                    }}
                                >
                                    <PinCard
                                        kind={spec[idx]}
                                        selected={selected}
                                        active={true}
                                        density={density}
                                        style={{ width: pos.w, height: pos.h }}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* micro cue */}
                    <div className="absolute right-3 top-3 z-20 flex items-center gap-2">
                        <span className="text-[10px] text-[var(--foreground-muted)]">{spec.length} formats</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-bronze)] opacity-80" />
                    </div>
                </div>

                {/* GUIDANCE: no border; grows to fill remaining space; if wrapped, it expands full width */}
                <div className="min-w-[240px] flex-1">
                    <GuidanceBlock guidance={guidance} />
                </div>
            </div>
        </div>
    );
}

function HelpDetails() {
    const examples: Array<{ label: string; desc: string; kind: PinKind }> = [
        { label: "Product photos", desc: "angles, lifestyle, detail shots", kind: "photo" },
        { label: "Short videos", desc: "demo, tutorial, unboxing", kind: "video" },
        { label: "Before / After", desc: "transformations, results", kind: "before_after" },
        { label: "Carousel sets", desc: "steps, ingredients, tips", kind: "carousel" },
        { label: "UGC", desc: "reviews, customer photos", kind: "ugc" },
        { label: "Templates", desc: "reusable layouts + text styles", kind: "product" },
    ];

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
                    className={["text-xs text-[var(--foreground-muted)] transition-transform", "group-open:rotate-180"].join(" ")}
                >
          ▼
        </span>
            </summary>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {examples.map((x) => (
                    <div key={x.label} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                        <div className="flex items-start gap-3">
                            <KindGlyph kind={x.kind} />
                            <div className="min-w-0">
                                <div className="text-sm font-medium text-[var(--foreground)]">{x.label}</div>
                                <div className="mt-0.5 text-xs text-[var(--foreground-muted)]">{x.desc}</div>
                            </div>
                        </div>

                        <div className="mt-3 h-16 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--background)]">
                            <div className="h-full w-full ppc-exampleThumb" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 text-xs text-[var(--foreground-muted)]">
                Rule of thumb: if you can turn it into a Pin without starting from zero every time, it counts.
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
        {
            v: "limited",
            title: "Limited",
            subtitle: "Starter library",
            level: 1,
            badge: "Starter",
            guidance: "A few usable assets, but not enough variety to pin consistently without repeating yourself.",
        },
        {
            v: "decent",
            title: "Decent",
            subtitle: "Some solid assets",
            level: 2,
            badge: "Baseline",
            guidance: "You’ve got a foundation — enough to start, but you’ll need to create new visuals often.",
        },
        {
            v: "strong",
            title: "Strong",
            subtitle: "Consistent + reusable",
            level: 3,
            badge: "Reliable",
            guidance: "Multiple formats + repeatable assets. You can publish regularly without scrambling every week.",
        },
        {
            v: "very_strong",
            title: "Very strong",
            subtitle: "Deep library + variety",
            level: 4,
            badge: "Stacked",
            guidance: "A deep, diverse library (photos, video, UGC, before/after, templates). You can scale content fast.",
        },
    ];

    return (
        <div className="grid gap-4">
            <style>{`
        @keyframes ppcSheen {
          0% { transform: translateX(-65%); opacity: 0.0; }
          28% { opacity: 0.9; }
          60% { opacity: 0.35; }
          100% { transform: translateX(130%); opacity: 0.0; }
        }
        @keyframes ppcPopIn {
          0% { transform: translateY(2px) scale(0.995); opacity: 0.0; }
          100% { transform: translateY(0px) scale(1); opacity: 1; }
        }
        @keyframes ppcFloat0 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-2px); } }
        @keyframes ppcFloat1 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-3px); } }
        @keyframes ppcFloat2 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-2.5px); } }
        @keyframes ppcFloat3 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-3.2px); } }
        @keyframes ppcFloat4 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-2.2px); } }

        .ppc-media {
          background:
            radial-gradient(240px 120px at 18% 22%, rgba(255,255,255,0.08), transparent 60%),
            radial-gradient(260px 140px at 80% 80%, rgba(255,255,255,0.06), transparent 62%),
            linear-gradient(135deg, rgba(149,9,82,0.12), rgba(0,0,0,0.00) 55%),
            linear-gradient(135deg, rgba(213,137,54,0.12), rgba(0,0,0,0.00) 55%);
          filter: contrast(1.05) saturate(1.05);
          transform: scale(1);
          transition: transform 420ms ease, filter 420ms ease;
        }

        .ppc-exampleThumb {
          background:
            radial-gradient(200px 90px at 25% 25%, rgba(149,9,82,0.22), transparent 60%),
            radial-gradient(220px 110px at 85% 80%, rgba(213,137,54,0.20), transparent 64%),
            linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.18));
        }

        .ppc-pinCard {
          transition: transform 280ms ease, filter 280ms ease, opacity 280ms ease;
          will-change: transform;
        }
        .ppc-opt:hover .ppc-pinCard { transform: translateY(-2px); }
        .ppc-opt[data-selected="true"] .ppc-pinCard { transform: translateY(-2px); }

        .ppc-opt:hover .ppc-media { transform: scale(1.04); filter: contrast(1.08) saturate(1.10); }
        .ppc-opt[data-selected="true"] .ppc-media { transform: scale(1.06); filter: contrast(1.10) saturate(1.12); }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

            <div className="grid gap-1">
                <div className="text-sm text-[var(--foreground-muted)]">Pick the closest match — don’t overthink it.</div>
            </div>

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
                            data-selected={selected ? "true" : "false"}
                            onClick={() => {
                                onChange(o.v);
                                onAutoAdvance?.();
                            }}
                            className={[
                                "ppc-opt group relative w-full rounded-2xl border p-4 text-left transition",
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

                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]"
                            />

                            <div className="relative flex items-start justify-between gap-4">
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

                                    <VisualStack level={o.level} selected={selected} guidance={o.guidance} />
                                </div>

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
