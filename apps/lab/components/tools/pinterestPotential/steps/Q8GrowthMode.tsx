// frontend/components/tools/pinterestPotential/steps/Q8GrowthMode.tsx
"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import type { GrowthMode, StepBaseProps } from "./ppcV2Types";

/**
 * Q8 thumbs (served from Next.js /public)
 *
 * Repo path:
 *   public/tools/pinterestPotential/thumbs/
 *
 * Theme-aware assets (ONLY):
 *   - growth-1-light.jpg / growth-1-dark.jpg
 *   - growth-2-light.jpg / growth-2-dark.jpg
 *   - growth-3-light.jpg / growth-3-dark.jpg
 *
 * Naming pattern:
 *   growth-{level}-{light|dark}.jpg
 *
 * No legacy filenames / fallbacks exist.
 */
const THUMB_BASE = "/tools/pinterestPotential/thumbs";
const HELP_ID = "ppc-q8-help";

type Opt = {
    v: GrowthMode;
    title: string;
    subtitle: string; // pill
    level: 1 | 2 | 3;
    blurb: string; // ultra short
};

/** Resolve effective theme (explicit data-theme wins, else OS preference) */
function useResolvedIsDark() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const root = document.documentElement;
        const mql = window.matchMedia?.("(prefers-color-scheme: dark)");

        const compute = () => {
            const explicit = root.getAttribute("data-theme");
            if (explicit === "dark") return true;
            if (explicit === "light") return false;
            return Boolean(mql?.matches);
        };

        const apply = () => setIsDark(compute());
        apply();

        const onMql = () => apply();
        if (mql) {
            if ("addEventListener" in mql) (mql as any).addEventListener("change", onMql);
            else (mql as any).addListener(onMql);
        }

        const obs = new MutationObserver(() => apply());
        obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

        return () => {
            obs.disconnect();
            if (mql) {
                if ("removeEventListener" in mql) (mql as any).removeEventListener("change", onMql);
                else (mql as any).removeListener(onMql);
            }
        };
    }, []);

    return isDark;
}

/**
 * Hierarchical pill colors (low → mid → high).
 * Uses only existing brand tokens + neutral; avoids introducing new CSS vars.
 *
 * - Level 1 (Organic): neutral/soft (not “important”)
 * - Level 2 (Maybe): bronze (middle)
 * - Level 3 (Ads): raspberry (highest emphasis)
 */
function pillClasses(level: 1 | 2 | 3, selected: boolean) {
    const base =
        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs whitespace-nowrap transition-colors";

    if (level === 1) {
        return [
            base,
            selected
                ? "border-[color-mix(in_srgb,rgba(255,255,255,0.22)_70%,var(--ppc-chip-border))] bg-[color-mix(in_srgb,rgba(255,255,255,0.10)_70%,var(--ppc-chip-bg))] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]"
                : "border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)]",
        ].join(" ");
    }

    if (level === 2) {
        return [
            base,
            selected
                ? "border-[color-mix(in_srgb,var(--brand-bronze)_50%,var(--ppc-chip-border))] bg-[color-mix(in_srgb,var(--brand-bronze)_12%,var(--ppc-chip-bg))] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]"
                : "border-[color-mix(in_srgb,var(--brand-bronze)_30%,var(--ppc-chip-border))] bg-[var(--ppc-chip-bg)]",
        ].join(" ");
    }

    return [
        base,
        selected
            ? "border-[color-mix(in_srgb,var(--brand-raspberry)_55%,var(--ppc-chip-border))] bg-[color-mix(in_srgb,var(--brand-raspberry)_12%,var(--ppc-chip-bg))] shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset]"
            : "border-[color-mix(in_srgb,var(--brand-raspberry)_28%,var(--ppc-chip-border))] bg-[var(--ppc-chip-bg)]",
    ].join(" ");
}

function dotClasses(level: 1 | 2 | 3, selected: boolean, isDark: boolean) {
    const base = "h-1.5 w-1.5 rounded-full";
    if (level === 1) {
        // neutral dot should be visible in both themes
        if (isDark) {
            return [base, selected ? "bg-[rgba(255,255,255,0.75)]" : "bg-[rgba(255,255,255,0.42)]"].join(" ");
        }
        return [base, selected ? "bg-[rgba(0,0,0,0.55)]" : "bg-[rgba(0,0,0,0.28)]"].join(" ");
    }
    if (level === 2) {
        return [base, selected ? "bg-[var(--brand-bronze)]" : "bg-[var(--brand-bronze)] opacity-70"].join(" ");
    }
    return [base, selected ? "bg-[var(--brand-raspberry)]" : "bg-[var(--brand-raspberry)] opacity-65"].join(" ");
}

function SelectedChip({ level }: { level: 1 | 2 | 3 }) {
    const ring =
        level === 3
            ? "border-[color-mix(in_srgb,var(--brand-raspberry)_55%,var(--ppc-chip-border))] bg-[color-mix(in_srgb,var(--brand-raspberry)_12%,var(--ppc-chip-bg))]"
            : level === 2
                ? "border-[color-mix(in_srgb,var(--brand-bronze)_50%,var(--ppc-chip-border))] bg-[color-mix(in_srgb,var(--brand-bronze)_10%,var(--ppc-chip-bg))]"
                : "border-[color-mix(in_srgb,rgba(255,255,255,0.22)_70%,var(--ppc-chip-border))] bg-[color-mix(in_srgb,rgba(255,255,255,0.10)_70%,var(--ppc-chip-bg))]";

    const dot =
        level === 3 ? "bg-[var(--brand-raspberry)]" : level === 2 ? "bg-[var(--brand-bronze)]" : "bg-[rgba(255,255,255,0.70)]";

    return (
        <span
            className={[
                "inline-flex items-center gap-2.5 rounded-full border",
                "px-3.5 py-1.5 text-xs font-semibold leading-none whitespace-nowrap",
                ring,
                "text-[var(--foreground)]",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_10px_24px_rgba(0,0,0,0.35)]",
            ].join(" ")}
        >
      <span
          className={[
              "h-2.5 w-2.5 rounded-full",
              dot,
              "shadow-[0_0_0_2px_rgba(0,0,0,0.30)_inset,0_0_0_1px_rgba(255,255,255,0.12)]",
          ].join(" ")}
          aria-hidden="true"
      />
      Selected
    </span>
    );
}

/** Hierarchical pills (per-level color hierarchy) */
function Badge({
                   subtitle,
                   selected,
                   level,
                   isDark,
               }: {
    subtitle: string;
    selected: boolean;
    level: 1 | 2 | 3;
    isDark: boolean;
}) {
    return (
        <span className={pillClasses(level, selected)} title={subtitle}>
      <span className={dotClasses(level, selected, isDark)} aria-hidden="true" />
      <span className={selected ? "text-[var(--foreground)]" : "text-[var(--foreground-muted)]"}>{subtitle}</span>
    </span>
    );
}

function growthThumbSrcForLevel(level: 1 | 2 | 3, isDark: boolean) {
    return `${THUMB_BASE}/growth-${level}-${isDark ? "dark" : "light"}.jpg`;
}

function Thumb({ src, selected, isDark }: { src: string; selected: boolean; isDark: boolean }) {
    return (
        <div
            className={[
                "relative w-full overflow-hidden rounded-2xl border",
                "border-[var(--border)] bg-[var(--background)]",
                "aspect-square",
            ].join(" ")}
        >
            <img
                src={src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className={[
                    "absolute inset-0 h-full w-full object-cover",
                    "ppc-growthThumb",
                    selected ? "ppc-growthThumb-selected" : "",
                ].join(" ")}
                onError={(e) => {
                    // No fallbacks; if this 404s, hide image (keeps layout stable).
                    const img = e.currentTarget;
                    img.style.opacity = "0";
                }}
            />

            {/* DARK: cinematic treatment */}
            {isDark ? (
                <>
                    <div className="pointer-events-none absolute inset-0 ppc-film" />
                    <div className="pointer-events-none absolute inset-0 ppc-vignette" />
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.34)), radial-gradient(240px 160px at 18% 22%, rgba(149,9,82,0.14), transparent 62%), radial-gradient(300px 220px at 82% 82%, rgba(213,137,54,0.12), transparent 64%)",
                            opacity: 0.95,
                        }}
                    />
                </>
            ) : (
                /* LIGHT: clean, no dark wash */
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(520px 260px at 20% 12%, rgba(255,255,255,0.55), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.16), rgba(0,0,0,0.06))",
                        opacity: 0.55,
                    }}
                />
            )}
        </div>
    );
}

function HelpDetails({ isDark }: { isDark: boolean }) {
    const bullets: Record<GrowthMode, string[]> = {
        organic: [
            "You’ll focus on SEO + fresh pin volume + saves over time.",
            "Best if you’re building sustainably (and can wait for compounding).",
            "You can add ads later once you have winners.",
        ],
        later: [
            "You’ll start organic, then layer ads once your funnel proves out.",
            "Best if you want optional acceleration but not yet.",
            "A great default if you’re unsure.",
        ],
        ads: [
            "You’ll use ads to accelerate results (and test faster).",
            "Best if your site + offer are ready to convert.",
            "Expect tracking + landing page polish to matter more.",
        ],
    };

    const cards = (["organic", "later", "ads"] as GrowthMode[]).map((v, i) => ({
        v,
        title: v === "organic" ? "Organic only" : v === "later" ? "Maybe later" : "Yes — ads",
        subtitle: v === "organic" ? "No ad spend" : v === "later" ? "Add later" : "Accelerate",
        level: (i + 1) as 1 | 2 | 3,
        bullets: bullets[v],
    }));

    return (
        <details id={HELP_ID} className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
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
          Quick guide: organic vs ads
        </span>

                <span
                    aria-hidden="true"
                    className={["text-xs text-[var(--foreground-muted)] transition-transform", "group-open:rotate-180"].join(" ")}
                >
          ▼
        </span>
            </summary>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {cards.map((c) => (
                    <div key={c.v} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="text-sm font-semibold text-[var(--foreground)]">{c.title}</div>
                                    <Badge subtitle={c.subtitle} selected={false} level={c.level} isDark={isDark} />
                                </div>
                            </div>
                            <div className="text-[11px] text-[var(--foreground-muted)]">{c.level}/3</div>
                        </div>

                        <ul className="mt-2 grid gap-1.5 text-xs text-[var(--foreground-muted)]">
                            {c.bullets.map((b) => (
                                <li key={b} className="flex gap-2">
                  <span
                      className={[
                          "mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full",
                          c.level === 3
                              ? "bg-[var(--brand-raspberry)] opacity-70"
                              : c.level === 2
                                  ? "bg-[var(--brand-bronze)] opacity-70"
                                  : isDark
                                      ? "bg-[rgba(255,255,255,0.40)]"
                                      : "bg-[rgba(0,0,0,0.28)]",
                      ].join(" ")}
                      aria-hidden="true"
                  />
                                    <span className="min-w-0">{b}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-3 text-xs text-[var(--foreground-muted)]">
                If you’re unsure, <span className="text-[var(--foreground)]">Maybe later</span> is the safe default — it keeps the plan realistic while still
                leaving room to scale.
            </div>
        </details>
    );
}

// --- IMPORTANT ---
// StepBaseProps' onAutoAdvance is currently typed as 0-arg in some places,
// but the wizard expects a patch-shaped call.
// We override the prop type here to match the wizard contract and remove IDE TS2554 errors.
type Q8AutoAdvancePatch = { growth_mode?: GrowthMode };
type Q8AutoAdvanceFn = (patch?: Q8AutoAdvancePatch) => void;

type Q8Props = Omit<StepBaseProps, "onAutoAdvance"> & {
    value?: GrowthMode;
    onChange: (v: GrowthMode) => void;
    onAutoAdvance?: Q8AutoAdvanceFn;
};

export default function Q8GrowthMode({ value, onChange, onAutoAdvance }: Q8Props) {
    const listId = useId();
    const isDark = useResolvedIsDark();

    const lastClickRef = useRef<GrowthMode | null>(null);
    const localTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (localTimerRef.current !== null) {
                window.clearTimeout(localTimerRef.current);
                localTimerRef.current = null;
            }
        };
    }, []);

    const opts: Opt[] = useMemo(
        () => [
            { v: "organic", title: "Organic only", subtitle: "No ad spend", level: 1, blurb: "Build compounding growth over time." },
            { v: "later", title: "Maybe later", subtitle: "Add later", level: 2, blurb: "Start organic, layer ads when ready." },
            { v: "ads", title: "Yes (ads)", subtitle: "Accelerate", level: 3, blurb: "Speed up testing + results." },
        ],
        [],
    );

    const scrollToHelp = () => {
        const el = document.getElementById(HELP_ID);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    function triggerAutoAdvance(clicked: GrowthMode) {
        const prevValue = value;

        // Always update selection for UI consistency
        onChange(clicked);

        // Normal change path: send patch directly.
        if (prevValue !== clicked) {
            lastClickRef.current = clicked;
            onAutoAdvance?.({ growth_mode: clicked });
            return;
        }

        // Reselect same (back-navigation confirm): force a real patch.
        if (lastClickRef.current === clicked) return;
        lastClickRef.current = clicked;

        onAutoAdvance?.({ growth_mode: undefined });

        if (localTimerRef.current !== null) window.clearTimeout(localTimerRef.current);
        localTimerRef.current = window.setTimeout(() => {
            onAutoAdvance?.({ growth_mode: clicked });
        }, 0);
    }

    return (
        <div className="grid gap-4" data-theme={isDark ? "dark" : "light"}>
            <style>{`
        .ppc-growthThumb {
          transform: scale(1.02);
          transition: transform 520ms ease, filter 520ms ease, opacity 220ms ease;
          will-change: transform;
        }
        .ppc-growthThumb-selected {
          transform: scale(1.06);
        }

        /* Theme-aware image tuning (gentle) */
        [data-theme="light"] .ppc-growthThumb {
          filter: contrast(1.02) saturate(1.02) brightness(1.04);
        }
        [data-theme="light"] .ppc-growthThumb-selected {
          filter: contrast(1.03) saturate(1.04) brightness(1.05);
        }

        [data-theme="dark"] .ppc-growthThumb {
          filter: contrast(1.03) saturate(1.06);
        }
        [data-theme="dark"] .ppc-growthThumb-selected {
          filter: contrast(1.06) saturate(1.12);
        }

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

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>

            <div className="grid gap-1">
                <div className="text-sm text-[var(--foreground-muted)]">
                    Pick the closest match — <span className="text-[var(--foreground)]">don’t overthink it</span>.
                </div>

                <div className="text-xs text-[var(--foreground-muted)]">
                    Not sure?{" "}
                    <button
                        type="button"
                        onClick={scrollToHelp}
                        className="underline decoration-[rgba(255,255,255,0.18)] underline-offset-4 hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                        Quick guide below ↓
                    </button>
                </div>

                <span id={listId} className="sr-only">
          Growth mode options
        </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-labelledby={listId}>
                {opts.map((o) => {
                    const selected = value === o.v;
                    const src = growthThumbSrcForLevel(o.level, isDark);

                    return (
                        <button
                            key={o.v}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            data-selected={selected ? "true" : "false"}
                            onClick={() => triggerAutoAdvance(o.v)}
                            className={[
                                "group relative w-full rounded-2xl border p-3 text-left transition",
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
                          "radial-gradient(420px 220px at 18% 10%, rgba(255,255,255,0.07), transparent 58%), linear-gradient(90deg, color-mix(in srgb, var(--brand-raspberry) 30%, transparent), color-mix(in srgb, var(--brand-bronze) 20%, transparent))",
                  }}
              />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]"
                            />

                            <div className="relative grid gap-3">
                                <Thumb src={src} selected={selected} isDark={isDark} />

                                <div className="grid gap-1">
                                    <div className="text-base font-semibold tracking-tight text-[var(--foreground)]">{o.title}</div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge subtitle={o.subtitle} selected={selected} level={o.level} isDark={isDark} />
                                        {selected ? <SelectedChip level={o.level} /> : null}
                                    </div>

                                    <div className="text-sm text-[var(--foreground-muted)]">{o.blurb}</div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-sm font-semibold text-[var(--foreground)]">How this affects your plan</div>
                <div className="mt-1 text-sm text-[var(--foreground-muted)]">
                    Organic builds compounding reach. Ads accelerate testing + conversion (but need tracking + a solid landing page). We’ll tailor the recommendations
                    based on what you pick.
                </div>
            </div>

            <HelpDetails isDark={isDark} />
        </div>
    );
}
