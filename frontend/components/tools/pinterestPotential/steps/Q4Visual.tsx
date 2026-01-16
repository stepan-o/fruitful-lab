"use client";

import React, { useId, useMemo } from "react";
import type { VisualStrength, StepBaseProps } from "./ppcV2Types";

/**
 * Q4 thumbs (served from Next.js /public)
 *
 * Repo path:
 *   public/tools/pinterestPotential/thumbs/
 *     - before-after-1.jpg
 *     - carousel-1.jpg
 *     - photo-1.jpg
 *     - photo-2.jpg
 *     - photo-3.jpg
 *     - video-1.jpg
 *     - video-1.mp4
 *     - video-2.jpg
 *     - video-2.mp4
 *
 * Public URLs MUST therefore be:
 *   /tools/pinterestPotential/thumbs/<filename>
 */
const THUMB_BASE = "/tools/pinterestPotential/thumbs";

type Opt = {
    v: VisualStrength;
    title: string;
    subtitle: string; // lives inside the pill
    level: 1 | 2 | 3 | 4;
    guidance: string;
};

function SelectedChip() {
    return (
        <span
            className={[
                "inline-flex items-center gap-2 rounded-full border px-2.5 py-1",
                "text-[10px] leading-none whitespace-nowrap",
                "border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)] text-[var(--foreground)]",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]",
            ].join(" ")}
        >
      <span
          className="h-2 w-2 rounded-full bg-[var(--brand-raspberry)] shadow-[0_0_0_2px_rgba(0,0,0,0.25)_inset]"
          aria-hidden="true"
      />
      Selected
    </span>
    );
}

function LevelBadge({
                        level,
                        subtitle,
                        selected,
                    }: {
    level: 1 | 2 | 3 | 4;
    subtitle: string;
    selected: boolean;
}) {
    const tone =
        level === 1
            ? {
                dot: "bg-[var(--card)]",
                ring: "border-[var(--border)]",
                text: "text-[var(--foreground-muted)]",
                bg: "bg-[var(--ppc-chip-bg)]",
            }
            : level === 2
                ? {
                    dot: "bg-[var(--brand-bronze)]",
                    ring: "border-[color-mix(in_srgb,var(--brand-bronze)_45%,transparent)]",
                    text: "text-[var(--foreground)]",
                    bg: "bg-[color-mix(in_srgb,var(--brand-bronze)_10%,var(--ppc-chip-bg))]",
                }
                : level === 3
                    ? {
                        dot: "bg-[var(--brand-rust)]",
                        ring: "border-[color-mix(in_srgb,var(--brand-rust)_50%,transparent)]",
                        text: "text-[var(--foreground)]",
                        bg: "bg-[color-mix(in_srgb,var(--brand-rust)_10%,var(--ppc-chip-bg))]",
                    }
                    : {
                        dot: "bg-[var(--brand-raspberry)]",
                        ring: "border-[color-mix(in_srgb,var(--brand-raspberry)_55%,transparent)]",
                        text: "text-[var(--foreground)]",
                        bg: "bg-[color-mix(in_srgb,var(--brand-raspberry)_12%,var(--ppc-chip-bg))]",
                    };

    return (
        <span
            className={[
                "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs",
                "whitespace-nowrap",
                tone.ring,
                tone.bg,
                selected ? "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]" : "",
            ].join(" ")}
            title={subtitle}
        >
      <span
          className={[
              "h-1.5 w-1.5 rounded-full",
              tone.dot,
              selected ? "opacity-100" : "opacity-80",
          ].join(" ")}
          aria-hidden="true"
      />
      <span className={[tone.text, "whitespace-nowrap"].join(" ")}>{subtitle}</span>
    </span>
    );
}

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

type PinKind = "photo" | "video" | "carousel" | "product" | "before_after" | "ugc";

/**
 * Level-specific video asset selection:
 * - Level 3 uses video-1.*
 * - Level 4 uses video-2.* (the “another level” asset)
 */
function videoAssetFor(level: 1 | 2 | 3 | 4) {
    return level >= 4 ? { mp4: "video-2.mp4", poster: "video-2.jpg" } : { mp4: "video-1.mp4", poster: "video-1.jpg" };
}

function videoMp4Src(level: 1 | 2 | 3 | 4) {
    return `${THUMB_BASE}/${videoAssetFor(level).mp4}`;
}

function thumbSrcFor(kind: PinKind, level: 1 | 2 | 3 | 4) {
    const photoN = Math.min(level, 3);

    if (kind === "photo") return `${THUMB_BASE}/photo-${photoN}.jpg`;
    if (kind === "carousel") return `${THUMB_BASE}/carousel-1.jpg`;
    if (kind === "before_after") return `${THUMB_BASE}/before-after-1.jpg`;

    // Video poster depends on level (lvl4 uses video-2.jpg)
    if (kind === "video") return `${THUMB_BASE}/${videoAssetFor(level).poster}`;

    // No dedicated thumbs yet: reuse strong photos so nothing breaks.
    if (kind === "product") return `${THUMB_BASE}/photo-2.jpg`;
    // ugc
    return `${THUMB_BASE}/photo-1.jpg`;
}

function Thumb({
                   src,
                   kind,
                   level,
                   selected,
               }: {
    src: string;
    kind: PinKind;
    level: 1 | 2 | 3 | 4;
    selected: boolean;
}) {
    const pan =
        kind === "carousel"
            ? "ppc-pan-x"
            : kind === "before_after"
                ? "ppc-pan-y"
                : kind === "video"
                    ? "ppc-pan-zoom"
                    : "ppc-pan-soft";

    // Loop video for stronger options (levels 3 & 4)
    const useLoopVideo = kind === "video" && level >= 3;

    return (
        <div className="absolute inset-0 overflow-hidden">
            {useLoopVideo ? (
                <video
                    src={videoMp4Src(level)}
                    poster={src}
                    muted
                    loop
                    autoPlay
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                    className={["h-full w-full object-cover", "ppc-thumb", pan, selected ? "ppc-thumb-selected" : ""].join(" ")}
                    onError={(e) => {
                        const el = e.currentTarget;
                        const img = document.createElement("img");
                        img.src = src || `${THUMB_BASE}/photo-1.jpg`;
                        img.alt = "";
                        img.setAttribute("aria-hidden", "true");
                        img.decoding = "async";
                        img.loading = "lazy";
                        img.className = ["h-full w-full object-cover", "ppc-thumb", pan, selected ? "ppc-thumb-selected" : ""].join(" ");
                        el.parentElement?.replaceChild(img, el);
                    }}
                />
            ) : (
                <img
                    src={src}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className={["h-full w-full object-cover", "ppc-thumb", pan, selected ? "ppc-thumb-selected" : ""].join(" ")}
                    onError={(e) => {
                        const img = e.currentTarget;
                        const fallback = `${THUMB_BASE}/photo-1.jpg`;
                        if (img.src.endsWith("/photo-1.jpg")) return;
                        img.src = fallback;
                    }}
                />
            )}

            <div className="pointer-events-none absolute inset-0 ppc-film" />
            <div className="pointer-events-none absolute inset-0 ppc-vignette" />
        </div>
    );
}

function PinCard({
                     kind,
                     level,
                     selected,
                     active,
                     style,
                 }: {
    kind: PinKind;
    level: 1 | 2 | 3 | 4;
    selected: boolean;
    active: boolean;
    style?: React.CSSProperties;
}) {
    const meta =
        kind === "video"
            ? { badge: "Video", badgeTone: "bg-[color-mix(in_srgb,var(--brand-raspberry)_14%,transparent)]" }
            : kind === "carousel"
                ? { badge: "Carousel", badgeTone: "bg-[color-mix(in_srgb,var(--brand-bronze)_12%,transparent)]" }
                : kind === "product"
                    ? { badge: "Shop", badgeTone: "bg-[color-mix(in_srgb,var(--brand-bronze)_14%,transparent)]" }
                    : kind === "before_after"
                        ? { badge: "Before/After", badgeTone: "bg-[color-mix(in_srgb,var(--brand-rust)_14%,transparent)]" }
                        : kind === "ugc"
                            ? { badge: "UGC", badgeTone: "bg-[color-mix(in_srgb,var(--brand-raspberry)_12%,transparent)]" }
                            : { badge: "Photo", badgeTone: "bg-[color-mix(in_srgb,var(--card)_70%,transparent)]" };

    const titleStrength: 1 | 2 | 3 = level === 1 ? 1 : level === 2 ? 2 : 3;
    const t1 = titleStrength === 1 ? "w-3/5" : titleStrength === 2 ? "w-4/5" : "w-[92%]";
    const t2 = titleStrength === 1 ? "w-2/5" : titleStrength === 2 ? "w-3/5" : "w-4/5";

    const src = thumbSrcFor(kind, level);

    return (
        <div
            className={[
                "ppc-pinCard relative overflow-hidden rounded-xl border",
                "border-[var(--border)] bg-[var(--background)]",
                "shadow-[0_14px_34px_rgba(0,0,0,0.42)]",
            ].join(" ")}
            style={{
                ...style,
                opacity: active ? 1 : 0.33,
                filter: active ? "saturate(1.06)" : "saturate(0.75)",
            }}
            aria-hidden="true"
            data-kind={kind}
            data-level={level}
            data-selected={selected ? "true" : "false"}
        >
            <div className="relative h-[58%] border-b border-[var(--border)]">
                <Thumb src={src} kind={kind} level={level} selected={selected} />

                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(180deg, rgba(0,0,0,0.00), rgba(0,0,0,0.26)), radial-gradient(240px 120px at 18% 25%, rgba(149,9,82,0.18), transparent 60%), radial-gradient(260px 140px at 85% 78%, rgba(213,137,54,0.14), transparent 62%)",
                        opacity: 0.95,
                    }}
                />

                {kind === "video" ? (
                    <div className="absolute left-3 top-3 rounded-md border border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)] px-2 py-1 text-[10px] text-[var(--foreground-muted)]">
                        ▶ Play
                    </div>
                ) : null}

                {kind === "carousel" ? (
                    <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md border border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)] px-2 py-1 text-[10px] text-[var(--foreground-muted)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-bronze)] opacity-80" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--card)] opacity-70" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--card)] opacity-55" />
                    </div>
                ) : null}

                {kind === "before_after" ? (
                    <div className="absolute inset-x-3 bottom-3 grid grid-cols-2 gap-2">
                        <div className="h-8 rounded-md border border-[var(--border)] bg-[rgba(0,0,0,0.28)]" />
                        <div className="h-8 rounded-md border border-[var(--border)] bg-[rgba(0,0,0,0.18)]" />
                    </div>
                ) : null}

                {kind === "product" ? (
                    <div className="absolute right-3 bottom-3 rounded-md border border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)] px-2 py-1 text-[10px] text-[var(--foreground-muted)]">
                        $ • In stock
                    </div>
                ) : null}

                {kind === "ugc" ? (
                    <div className="absolute left-3 bottom-3 inline-flex items-center gap-1 rounded-md border border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)] px-2 py-1 text-[10px] text-[var(--foreground-muted)]">
                        ★★★★☆
                    </div>
                ) : null}

                <div
                    className={["absolute inset-0 pointer-events-none opacity-0 transition-opacity", selected ? "opacity-100" : "group-hover:opacity-70"].join(" ")}
                    style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)",
                        transform: "translateX(-65%)",
                        animation: selected ? "ppcSheen 2.6s ease-in-out infinite" : undefined,
                    }}
                />
            </div>

            <div className="relative px-3 pb-3 pt-2">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className="h-5 w-5 rounded-full bg-[var(--card)] opacity-70" />
                        <span className="h-2 w-20 rounded bg-[var(--card)] opacity-55" />
                    </div>

                    <span
                        className={[
                            "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px]",
                            "border-[var(--ppc-chip-border)] text-[var(--foreground-muted)]",
                            meta.badgeTone,
                        ].join(" ")}
                    >
            {meta.badge}
          </span>
                </div>

                <div className="mt-2 space-y-1.5">
                    <div className={["h-2 rounded bg-[var(--card)] opacity-70", t1].join(" ")} />
                    <div className={["h-2 rounded bg-[var(--card)] opacity-45", t2].join(" ")} />
                </div>

                {level >= 3 ? (
                    <div className="mt-2 flex items-center justify-between text-[10px] text-[var(--foreground-muted)]">
                        <span className="h-2 w-12 rounded bg-[var(--card)] opacity-35" />
                        <span className="h-2 w-8 rounded bg-[var(--card)] opacity-25" />
                    </div>
                ) : null}
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

function GuidanceBlock({ guidance }: { guidance: string }) {
    return (
        <div className="w-full pt-1">
            <div className="text-[10px] font-medium uppercase tracking-wide text-[var(--foreground-muted)]">How to interpret</div>
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

function VisualStack({
                         level,
                         selected,
                         guidance,
                     }: {
    level: 1 | 2 | 3 | 4;
    selected: boolean;
    guidance: string;
}) {
    // Order matters. For lvl 3/4, we want VIDEO to be the hero/front card.
    const kinds = useMemo<PinKind[]>(() => {
        return level === 1
            ? ["photo"]
            : level === 2
                ? ["photo", "carousel"]
                : level === 3
                    ? ["photo", "before_after", "video"] // video last => highest z-index
                    : ["photo", "carousel", "product", "ugc", "video"]; // video last => highest z-index
    }, [level]);

    const PREVIEW_H = 188;
    const CARD_W = 172;
    const CARD_H = 112;

    const placements = useMemo(() => {
        // IMPORTANT: placements are ordered back -> front, because later items get higher z-index.
        const base =
            level === 1
                ? [{ x: 20, y: 22, r: -1.5, s: 1.0 }]
                : level === 2
                    ? [
                        { x: 12, y: 22, r: -2.0, s: 1.0 },
                        { x: 64, y: 34, r: 1.6, s: 0.99 },
                    ]
                    : level === 3
                        ? [
                            // back cards
                            { x: 10, y: 44, r: -2.2, s: 0.98 },
                            { x: 56, y: 30, r: 1.2, s: 0.99 },
                            // HERO (front)
                            { x: 104, y: 22, r: 0.6, s: 1.02 },
                        ]
                        : [
                            // more density for lvl4 to feel “a lot more content”
                            { x: 6, y: 58, r: -2.1, s: 0.95 },
                            { x: 26, y: 44, r: 1.7, s: 0.96 },
                            { x: 52, y: 30, r: -1.3, s: 0.97 },
                            { x: 86, y: 18, r: 2.2, s: 0.98 },
                            // HERO (front)
                            { x: 126, y: 18, r: 0.7, s: 1.04 },
                        ];

        return base;
    }, [level]);

    const motion = useMemo(() => {
        return {
            glow: level === 1 ? 0.55 : level === 2 ? 0.75 : level === 3 ? 0.95 : 1.15,
            lift: level === 1 ? 1.0 : level === 2 ? 1.25 : level === 3 ? 1.45 : 1.7,
            drift: level === 1 ? 1.8 : level === 2 ? 2.2 : level === 3 ? 2.6 : 3.2,
        };
    }, [level]);

    const heroIdx = kinds.length - 1;

    return (
        <div className="mt-3">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:gap-4 sm:flex-nowrap">
                <div
                    className={[
                        "relative rounded-xl border",
                        "border-[var(--border)] bg-[var(--card)] p-3",
                        "overflow-hidden isolate",
                        "flex-none shrink-0",
                    ].join(" ")}
                    style={{
                        width: 320,
                        maxWidth: "100%",
                        height: PREVIEW_H,
                        ["--ppcGlow" as any]: motion.glow,
                        ["--ppcLift" as any]: motion.lift,
                        ["--ppcDrift" as any]: motion.drift,
                    }}
                    aria-hidden="true"
                    data-level={level}
                    data-selected={selected ? "true" : "false"}
                >
                    <div
                        className="absolute inset-0 rounded-xl"
                        style={{
                            background:
                                "radial-gradient(360px 190px at 18% 30%, rgba(149,9,82,0.22), transparent 60%), radial-gradient(420px 220px at 85% 78%, rgba(213,137,54,0.20), transparent 64%)",
                            opacity: selected ? 1 : 0.72,
                        }}
                    />

                    <div
                        className="absolute inset-0 rounded-xl opacity-60"
                        style={{
                            background:
                                "radial-gradient(1px 1px at 12px 10px, rgba(255,255,255,0.06), transparent 70%), radial-gradient(1px 1px at 34px 26px, rgba(255,255,255,0.05), transparent 70%), radial-gradient(1px 1px at 58px 18px, rgba(255,255,255,0.04), transparent 70%)",
                        }}
                    />

                    <div
                        className="pointer-events-none absolute inset-y-0 right-0 w-10"
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.55))",
                            opacity: 0.8,
                        }}
                    />

                    <div className="absolute inset-0 pointer-events-none">
                        {placements.slice(0, kinds.length).map((pos, idx) => {
                            const floatAnim = selected ? `ppcDrift${idx}` : undefined;
                            const popAnim = selected ? "ppcPopIn 420ms ease-out both" : undefined;

                            const isHero = idx === heroIdx;
                            const heroBoost = isHero && level >= 3 ? 1 : 0;

                            return (
                                <div
                                    key={`${level}-${idx}`}
                                    className="absolute"
                                    style={{
                                        left: pos.x,
                                        top: pos.y,
                                        zIndex: 10 + idx,
                                        transform: `rotate(${pos.r}deg) scale(${pos.s})`,
                                        animation: [floatAnim ? `${floatAnim} 6.4s ease-in-out infinite` : "", popAnim || ""]
                                            .filter(Boolean)
                                            .join(", "),
                                        filter: heroBoost ? "drop-shadow(0 26px 52px rgba(0,0,0,0.62))" : undefined,
                                    }}
                                >
                                    <div className={isHero ? "ppc-heroCard" : undefined}>
                                        <PinCard
                                            kind={kinds[idx]}
                                            level={level}
                                            selected={selected}
                                            active={true}
                                            style={{ width: CARD_W, height: CARD_H }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div
                        className={[
                            "absolute inset-0 rounded-xl pointer-events-none opacity-0 transition-opacity",
                            selected ? "opacity-100" : "group-hover:opacity-40",
                        ].join(" ")}
                        style={{
                            boxShadow: "0 0 0 1px rgba(255,255,255,0.06) inset, 0 0 0 1px rgba(149,9,82,0.10)",
                            opacity: selected ? 1 : 0,
                        }}
                    />
                </div>

                <div className="min-w-0 flex-1">
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
                        <div className="min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <div className="text-sm font-medium text-[var(--foreground)]">{x.label}</div>
                                <span className="text-[10px] text-[var(--foreground-muted)]">{x.kind.replace("_", "/")}</span>
                            </div>
                            <div className="mt-0.5 text-xs text-[var(--foreground-muted)]">{x.desc}</div>
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
            guidance: "A few usable assets, but not enough variety to pin consistently without repeating yourself.",
        },
        {
            v: "decent",
            title: "Decent",
            subtitle: "Some solid assets",
            level: 2,
            guidance: "You’ve got a foundation — enough to start, but you’ll need to create new visuals often.",
        },
        {
            v: "strong",
            title: "Strong",
            subtitle: "Consistent + reusable",
            level: 3,
            guidance: "Multiple formats + repeatable assets. You can publish regularly without scrambling every week.",
        },
        {
            v: "very_strong",
            title: "Very strong",
            subtitle: "Deep library + variety",
            level: 4,
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

        @keyframes ppcDrift0 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(calc(-2px * var(--ppcDrift, 2.0))); } }
        @keyframes ppcDrift1 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(calc(-2.4px * var(--ppcDrift, 2.0))); } }
        @keyframes ppcDrift2 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(calc(-2.1px * var(--ppcDrift, 2.0))); } }
        @keyframes ppcDrift3 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(calc(-2.6px * var(--ppcDrift, 2.0))); } }
        @keyframes ppcDrift4 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(calc(-2.2px * var(--ppcDrift, 2.0))); } }

        .ppc-thumb {
          transform: scale(1.02);
          filter: contrast(1.02) saturate(1.05);
          transition: transform 520ms ease, filter 520ms ease;
          will-change: transform;
        }
        .ppc-thumb-selected {
          transform: scale(1.08);
          filter: contrast(1.06) saturate(1.12);
        }

        .ppc-pan-soft { transform: translateY(0px) scale(1.02); }
        .ppc-pan-x { transform: translateX(-1px) scale(1.03); }
        .ppc-pan-y { transform: translateY(-1px) scale(1.03); }
        .ppc-pan-zoom { transform: translateY(-1px) scale(1.04); }

        .ppc-opt:hover .ppc-thumb { transform: scale(1.08); filter: contrast(1.06) saturate(1.12); }
        .ppc-opt[data-selected="true"] .ppc-thumb { transform: scale(1.10); filter: contrast(1.08) saturate(1.14); }

        .ppc-film {
          background:
            radial-gradient(1px 1px at 12px 10px, rgba(255,255,255,0.06), transparent 70%),
            radial-gradient(1px 1px at 34px 26px, rgba(255,255,255,0.05), transparent 70%),
            radial-gradient(1px 1px at 58px 18px, rgba(255,255,255,0.04), transparent 70%),
            linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.10));
          opacity: 0.55;
          mix-blend-mode: overlay;
        }
        .ppc-vignette {
          background: radial-gradient(120% 90% at 50% 30%, transparent 35%, rgba(0,0,0,0.45) 100%);
          opacity: 0.55;
        }

        .ppc-exampleThumb {
          background:
            radial-gradient(200px 90px at 25% 25%, rgba(149,9,82,0.22), transparent 60%),
            radial-gradient(220px 110px at 85% 80%, rgba(213,137,54,0.20), transparent 64%),
            linear-gradient(180deg, rgba(255,255,255,0.05), rgba(0,0,0,0.18));
        }

        .ppc-pinCard {
          transition: transform 260ms ease, filter 260ms ease, opacity 260ms ease;
          will-change: transform;
        }

        .ppc-opt:hover .ppc-pinCard { transform: translateY(calc(-2px * var(--ppcLift, 1.0))); }
        .ppc-opt[data-selected="true"] .ppc-pinCard { transform: translateY(calc(-2.5px * var(--ppcLift, 1.0))); }

        .ppc-opt[data-level="4"]:hover .ppc-pinCard,
        .ppc-opt[data-level="4"][data-selected="true"] .ppc-pinCard {
          filter: saturate(1.12) contrast(1.04);
        }

        /* Hero emphasis */
        .ppc-heroCard .ppc-pinCard {
          transform: translateY(-1px) scale(1.01);
        }
        .ppc-opt:hover .ppc-heroCard .ppc-pinCard {
          transform: translateY(calc(-3px * var(--ppcLift, 1.0))) scale(1.02);
        }
        .ppc-opt[data-selected="true"] .ppc-heroCard .ppc-pinCard {
          transform: translateY(calc(-3.5px * var(--ppcLift, 1.0))) scale(1.03);
        }

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
                            data-level={String(o.level)}
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

                            {/* KEY LAYOUT FIX:
                  - Left column is flex-1 so VisualStack (and its guidance) can use all remaining width
                  - Right column is flex-none (only pips + 1/4)
                  - Selected chip moved up into the header row next to the subtitle pill
              */}
                            <div className="relative flex items-start gap-4">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-lg font-semibold tracking-tight text-[var(--foreground)]">{o.title}</div>
                                        <LevelBadge level={o.level} subtitle={o.subtitle} selected={selected} />
                                        {selected ? <SelectedChip /> : null}
                                    </div>

                                    <VisualStack level={o.level} selected={selected} guidance={o.guidance} />
                                </div>

                                <div className="flex flex-none flex-col items-end gap-2 pt-1">
                                    <LevelPips level={o.level} selected={selected} />
                                    <div className="text-xs text-[var(--foreground-muted)]">{o.level}/4</div>
                                    {/* keep vertical rhythm consistent */}
                                    <span className="h-6" aria-hidden="true" />
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
