"use client";

import React, { useId, useMemo } from "react";
import type { SiteExperience, StepBaseProps } from "./ppcV2Types";

/**
 * Q5 thumbs (served from Next.js /public)
 *
 * Repo path:
 *   public/tools/pinterestPotential/thumbs/
 *
 * Assumed new assets (vertical):
 *   - site-1.jpg
 *   - site-2.jpg
 *   - site-3.jpg
 *   - site-4.jpg
 *
 * If your filenames differ, update siteThumbSrcForLevel().
 */
const THUMB_BASE = "/tools/pinterestPotential/thumbs";
const HELP_ID = "ppc-q5-help";

type Opt = {
    v: SiteExperience;
    title: string;
    subtitle: string; // pill
    level: 1 | 2 | 3 | 4;
    blurb: string; // keep ultra short (scan in 5s)
};

function SelectedChip() {
    return (
        <span
            className={[
                "inline-flex items-center gap-2.5 rounded-full border",
                "px-3.5 py-1.5 text-xs font-semibold leading-none whitespace-nowrap",
                "border-[color-mix(in_srgb,var(--brand-raspberry)_55%,var(--ppc-chip-border))]",
                "bg-[color-mix(in_srgb,var(--brand-raspberry)_12%,var(--ppc-chip-bg))]",
                "text-[var(--foreground)]",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_10px_24px_rgba(0,0,0,0.35)]",
            ].join(" ")}
        >
      <span
          className={[
              "h-2.5 w-2.5 rounded-full",
              "bg-[var(--brand-raspberry)]",
              "shadow-[0_0_0_2px_rgba(0,0,0,0.30)_inset,0_0_0_1px_rgba(255,255,255,0.12)]",
          ].join(" ")}
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

function siteThumbSrcForLevel(level: 1 | 2 | 3 | 4) {
    return `${THUMB_BASE}/site-${level}.jpg`;
}

function Thumb({ src, selected }: { src: string; selected: boolean }) {
    return (
        <div
            className={[
                "relative w-full overflow-hidden rounded-2xl border",
                "border-[var(--border)] bg-[var(--background)]",
                "aspect-[3/4]",
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
                    "ppc-siteThumb",
                    selected ? "ppc-siteThumb-selected" : "",
                ].join(" ")}
                onError={(e) => {
                    const img = e.currentTarget;
                    const fallback = `${THUMB_BASE}/photo-1.jpg`;
                    if (img.src.endsWith("/photo-1.jpg")) return;
                    img.src = fallback;
                }}
            />
            <div className="pointer-events-none absolute inset-0 ppc-film" />
            <div className="pointer-events-none absolute inset-0 ppc-vignette" />
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.38)), radial-gradient(260px 140px at 18% 22%, rgba(149,9,82,0.16), transparent 62%), radial-gradient(320px 180px at 82% 82%, rgba(213,137,54,0.14), transparent 64%)",
                    opacity: 0.95,
                }}
            />
        </div>
    );
}

function HelpDetails({ opts }: { opts: Opt[] }) {
    const cards = useMemo(() => {
        const byLevel: Record<1 | 2 | 3 | 4, string[]> = {
            1: [
                "Feels slow or jumpy (layout shifts).",
                "Message isn’t clear (what you do + who it’s for).",
                "Next step is hard to find (CTA buried or inconsistent).",
            ],
            2: [
                "It works, but visitors have to think too hard.",
                "CTA exists, but doesn’t stand out or feels generic.",
                "Trust signals are light (proof, policies, FAQs, examples).",
            ],
            3: [
                "Loads quickly + reads cleanly on mobile and desktop.",
                "One primary CTA is obvious above the fold.",
                "Offer + next step are clear (buy, book, subscribe, download).",
            ],
            4: [
                "You’ve tested headlines/CTAs/layout and kept what converts.",
                "Strong proof throughout (results, reviews, guarantees, FAQs).",
                "Low friction: clean checkout/booking + fast pages.",
            ],
        };

        return opts.map((o) => ({ ...o, bullets: byLevel[o.level] }));
    }, [opts]);

    return (
        <details
            id={HELP_ID}
            className="group rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
        >
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
          How do I judge my website quality (fast)?
        </span>

                <span
                    aria-hidden="true"
                    className={["text-xs text-[var(--foreground-muted)] transition-transform", "group-open:rotate-180"].join(" ")}
                >
          ▼
        </span>
            </summary>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {cards.map((c) => (
                    <div key={c.v} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="text-sm font-semibold text-[var(--foreground)]">{c.title}</div>
                                    <LevelBadge level={c.level} subtitle={c.subtitle} selected={false} />
                                </div>
                                <div className="mt-1 text-xs text-[var(--foreground-muted)]">{c.blurb}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <LevelPips level={c.level} selected={false} />
                                <div className="text-[11px] text-[var(--foreground-muted)]">{c.level}/4</div>
                            </div>
                        </div>

                        <ul className="mt-2 grid gap-1.5 text-xs text-[var(--foreground-muted)]">
                            {c.bullets.map((b) => (
                                <li key={b} className="flex gap-2">
                  <span
                      className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-bronze)] opacity-70"
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
                Rule of thumb: if a new visitor can tell <span className="text-[var(--foreground)]">what this is</span> and{" "}
                <span className="text-[var(--foreground)]">what to do next</span> quickly (mobile <em>and</em> desktop), you’re in a good place.
            </div>
        </details>
    );
}

export default function Q5Site({
                                   value,
                                   onChange,
                                   onAutoAdvance,
                               }: StepBaseProps & {
    value?: SiteExperience;
    onChange: (v: SiteExperience) => void;
}) {
    const listId = useId();

    const opts: Opt[] = useMemo(
        () => [
            { v: "a", title: "Rough", subtitle: "Hard to use", level: 1, blurb: "Feels slow, unclear, or chaotic." },
            { v: "b", title: "Getting there", subtitle: "Usable, but fuzzy", level: 2, blurb: "Works, but visitors think too hard." },
            { v: "c", title: "Solid", subtitle: "Clear + credible", level: 3, blurb: "Easy to understand — action is obvious." },
            { v: "d", title: "Dialed-in", subtitle: "Tested + improved", level: 4, blurb: "Built for conversion — refined by data." },
        ],
        [],
    );

    const scrollToHelp = () => {
        const el = document.getElementById(HELP_ID);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        // Hint: don’t force-open; user can open if needed.
    };

    return (
        <div className="grid gap-4">
            <style>{`
        .ppc-siteThumb {
          transform: scale(1.03);
          filter: contrast(1.03) saturate(1.06);
          transition: transform 520ms ease, filter 520ms ease;
          will-change: transform;
        }
        .ppc-siteThumb-selected {
          transform: scale(1.08);
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

                {/* Nudge that there’s help below */}
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
          Website quality level
        </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="radiogroup" aria-labelledby={listId}>
                {opts.map((o) => {
                    const selected = value === o.v;
                    const src = siteThumbSrcForLevel(o.level);

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
                  className={["pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity", selected ? "opacity-100" : "group-hover:opacity-20"].join(" ")}
                  style={{
                      background:
                          "radial-gradient(520px 240px at 18% 10%, rgba(255,255,255,0.07), transparent 58%), linear-gradient(90deg, color-mix(in srgb, var(--brand-raspberry) 30%, transparent), color-mix(in srgb, var(--brand-bronze) 20%, transparent))",
                  }}
              />
                            <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]" />

                            <div className="relative grid gap-3">
                                <div className="relative">
                                    <Thumb src={src} selected={selected} />

                                    <div className="pointer-events-none absolute right-2 top-2 flex items-center gap-2 rounded-full border border-[var(--ppc-chip-border)] bg-[color-mix(in_srgb,var(--ppc-chip-bg)_85%,transparent)] px-2 py-1">
                                        <LevelPips level={o.level} selected={selected} />
                                        <span className="text-[11px] text-[var(--foreground-muted)]">{o.level}/4</span>
                                    </div>
                                </div>

                                <div className="grid gap-1">
                                    {/* Title line only (no pills here) */}
                                    <div className="text-base font-semibold tracking-tight text-[var(--foreground)]">{o.title}</div>

                                    {/* Pills ALWAYS on next line */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <LevelBadge level={o.level} subtitle={o.subtitle} selected={selected} />
                                        {selected ? <SelectedChip /> : null}
                                    </div>

                                    <div className="text-sm text-[var(--foreground-muted)]">{o.blurb}</div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <HelpDetails opts={opts} />
        </div>
    );
}
