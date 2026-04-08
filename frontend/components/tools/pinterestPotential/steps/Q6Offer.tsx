// frontend/components/tools/pinterestPotential/steps/Q6Offer.tsx
"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import type { Segment, OfferClarity, StepBaseProps } from "./ppcV2Types";

/**
 * Q6 thumbs (served from Next.js /public)
 *
 * Repo path:
 *   public/tools/pinterestPotential/thumbs/
 *
 * Theme-aware assets (ONLY):
 *   - offer-1-light.jpg ... offer-3-light.jpg
 *   - offer-1-dark.jpg  ... offer-3-dark.jpg
 *
 * No legacy filenames / fallbacks exist.
 */
const THUMB_BASE = "/tools/pinterestPotential/thumbs";
const HELP_ID = "ppc-q6-help";

type Opt = {
    v: OfferClarity;
    title: string;
    subtitle: string; // pill (always on next line under title)
    level: 1 | 2 | 3; // 1..3 (clarity)
    blurb: string; // ultra short (scan in 5s)
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
    level: 1 | 2 | 3;
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
          className={["h-1.5 w-1.5 rounded-full", tone.dot, selected ? "opacity-100" : "opacity-80"].join(" ")}
          aria-hidden="true"
      />
      <span className={[tone.text, "whitespace-nowrap"].join(" ")}>{subtitle}</span>
    </span>
    );
}

function LevelPips({
                       level,
                       total = 3,
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

function offerThumbSrcForLevel(level: 1 | 2 | 3, isDark: boolean) {
    return `${THUMB_BASE}/offer-${level}-${isDark ? "dark" : "light"}.jpg`;
}

function Thumb({ src, selected, isDark }: { src: string; selected: boolean; isDark: boolean }) {
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
                    "ppc-offerThumb",
                    selected ? "ppc-offerThumb-selected" : "",
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
                                "linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.38)), radial-gradient(260px 140px at 18% 22%, rgba(149,9,82,0.14), transparent 62%), radial-gradient(320px 180px at 82% 82%, rgba(213,137,54,0.12), transparent 64%)",
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

function segmentPrompt(segment: Segment) {
    return segment === "content_creator"
        ? "Do you have a clear lead magnet or newsletter offer?"
        : segment === "product_seller"
            ? "Do you have a clear hero product / best-seller to push?"
            : "Do you have a clear offer + booking flow?";
}

function segmentHelpCopy(segment: Segment) {
    if (segment === "content_creator") {
        return {
            no: [
                "No clear opt-in (or it’s buried).",
                "Too many topics — unclear why to subscribe.",
                "Weak “what you get” promise (frequency, format, benefit).",
            ],
            somewhat: [
                "Offer exists, but the promise is a little fuzzy.",
                "Opt-in is visible, but not compelling yet.",
                "Email follow-up is inconsistent or unclear.",
            ],
            yes: [
                "One obvious opt-in that matches your Pinterest content.",
                "Clear promise (what + who + why + when).",
                "Simple next step: Pin → page → subscribe.",
            ],
        };
    }

    if (segment === "product_seller") {
        return {
            no: [
                "No clear “main product” — everything is equal.",
                "Landing pages don’t guide to one next action.",
                "Hard to tell who it’s for / why it’s special.",
            ],
            somewhat: [
                "You have a favorite product, but it’s not positioned as the hero.",
                "Bundles/collections exist but aren’t structured for conversion.",
                "Messaging is decent, but not sharp.",
            ],
            yes: [
                "One hero product or collection is the obvious next step.",
                "Benefits + proof are easy to spot (reviews, guarantees, FAQs).",
                "From Pinterest, the path to purchase is clear.",
            ],
        };
    }

    // service_provider
    return {
        no: [
            "Services are listed, but the package / outcome is unclear.",
            "No obvious booking CTA or next step.",
            "Client proof is missing or hard to find.",
        ],
        somewhat: [
            "Offer is there, but it’s not packaged cleanly.",
            "CTA exists, but the flow feels a bit scattered.",
            "Some proof exists, but not enough to reduce doubt.",
        ],
        yes: [
            "Clear signature offer (who it’s for + outcome + what’s included).",
            "One obvious CTA (book / apply / inquiry) with a clean flow.",
            "Strong proof: results, testimonials, examples, FAQs.",
        ],
    };
}

function HelpDetails({ segment, opts }: { segment: Segment; opts: Opt[] }) {
    const help = useMemo(() => segmentHelpCopy(segment), [segment]);

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
          How do I judge “offer clarity” (fast)?
        </span>

                <span
                    aria-hidden="true"
                    className={["text-xs text-[var(--foreground-muted)] transition-transform", "group-open:rotate-180"].join(" ")}
                >
          ▼
        </span>
            </summary>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {opts.map((o) => {
                    const bullets = o.v === "no" ? help.no : o.v === "somewhat" ? help.somewhat : help.yes;

                    return (
                        <div key={o.v} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-[var(--foreground)]">{o.title}</div>
                                    <div className="mt-1">
                                        <LevelBadge level={o.level} subtitle={o.subtitle} selected={false} />
                                    </div>
                                    <div className="mt-1 text-xs text-[var(--foreground-muted)]">{o.blurb}</div>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <LevelPips level={o.level} selected={false} />
                                    <div className="text-[11px] text-[var(--foreground-muted)]">{o.level}/3</div>
                                </div>
                            </div>

                            <ul className="mt-2 grid gap-1.5 text-xs text-[var(--foreground-muted)]">
                                {bullets.map((b) => (
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
                    );
                })}
            </div>

            <div className="mt-3 text-xs text-[var(--foreground-muted)]">
                Rule of thumb: a new visitor should understand{" "}
                <span className="text-[var(--foreground)]">what you’re offering</span> and{" "}
                <span className="text-[var(--foreground)]">what to do next</span> without hunting.
            </div>
        </details>
    );
}

// Match wizard contract (patch-shaped) and keep IDE happy if StepBaseProps is 0-arg typed.
type Q6AutoAdvancePatch = { offer_clarity?: OfferClarity };
type Q6AutoAdvanceFn = (patch?: Q6AutoAdvancePatch) => void;

type Q6Props = Omit<StepBaseProps, "onAutoAdvance"> & {
    segment: Segment;
    value?: OfferClarity;
    onChange: (v: OfferClarity) => void;
    onAutoAdvance?: Q6AutoAdvanceFn;
};

export default function Q6Offer({ segment, value, onChange, onAutoAdvance }: Q6Props) {
    const listId = useId();
    const isDark = useResolvedIsDark();

    const lastClickRef = useRef<OfferClarity | null>(null);
    const localTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (localTimerRef.current !== null) {
                window.clearTimeout(localTimerRef.current);
                localTimerRef.current = null;
            }
        };
    }, []);

    const prompt = useMemo(() => segmentPrompt(segment), [segment]);

    const opts: Opt[] = useMemo(
        () => [
            { v: "no", title: "No", subtitle: "Not clear yet", level: 1, blurb: "Visitors aren’t sure what you offer." },
            { v: "somewhat", title: "Somewhat", subtitle: "Getting there", level: 2, blurb: "Offer exists — needs sharpening." },
            { v: "yes", title: "Yes", subtitle: "Clear + obvious", level: 3, blurb: "Next step is clear and easy." },
        ],
        [],
    );

    const scrollToHelp = () => {
        const el = document.getElementById(HELP_ID);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    function triggerAutoAdvance(clicked: OfferClarity) {
        const prevValue = value;

        onChange(clicked);

        if (prevValue !== clicked) {
            lastClickRef.current = clicked;
            onAutoAdvance?.({ offer_clarity: clicked });
            return;
        }

        if (lastClickRef.current === clicked) return;
        lastClickRef.current = clicked;

        onAutoAdvance?.({ offer_clarity: undefined });

        if (localTimerRef.current !== null) window.clearTimeout(localTimerRef.current);
        localTimerRef.current = window.setTimeout(() => {
            onAutoAdvance?.({ offer_clarity: clicked });
        }, 0);
    }

    return (
        <div className="grid gap-4" data-theme={isDark ? "dark" : "light"}>
            <style>{`
        .ppc-offerThumb {
          transform: scale(1.03);
          transition: transform 520ms ease, filter 520ms ease, opacity 220ms ease;
          will-change: transform;
        }
        .ppc-offerThumb-selected {
          transform: scale(1.08);
        }

        /* Theme-aware image tuning (gentle) */
        [data-theme="light"] .ppc-offerThumb {
          filter: contrast(1.02) saturate(1.02) brightness(1.04);
        }
        [data-theme="light"] .ppc-offerThumb-selected {
          filter: contrast(1.03) saturate(1.04) brightness(1.05);
        }

        [data-theme="dark"] .ppc-offerThumb {
          filter: contrast(1.03) saturate(1.06);
        }
        [data-theme="dark"] .ppc-offerThumb-selected {
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
                <div className="text-sm text-[var(--foreground)]">{prompt}</div>

                <div className="text-sm text-[var(--foreground-muted)]">
                    Pick the closest match — <span className="text-[var(--foreground)]">don’t overthink it</span>.
                </div>

                <div className="text-xs text-[var(--foreground-muted)]">
                    Need examples?{" "}
                    <button
                        type="button"
                        onClick={scrollToHelp}
                        className="underline decoration-[rgba(255,255,255,0.18)] underline-offset-4 hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                        Quick guide below ↓
                    </button>
                </div>

                <span id={listId} className="sr-only">
          Offer clarity
        </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-labelledby={listId}>
                {opts.map((o) => {
                    const selected = value === o.v;
                    const src = offerThumbSrcForLevel(o.level, isDark);

                    return (
                        <button
                            key={o.v}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            data-selected={selected ? "true" : "false"}
                            data-level={String(o.level)}
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
                          "radial-gradient(520px 240px at 18% 10%, rgba(255,255,255,0.07), transparent 58%), linear-gradient(90deg, color-mix(in srgb, var(--brand-raspberry) 30%, transparent), color-mix(in srgb, var(--brand-bronze) 20%, transparent))",
                  }}
              />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]"
                            />

                            <div className="relative grid gap-3">
                                <div className="relative">
                                    <Thumb src={src} selected={selected} isDark={isDark} />

                                    <div className="pointer-events-none absolute right-2 top-2 flex items-center gap-2 rounded-full border border-[var(--ppc-chip-border)] bg-[color-mix(in_srgb,var(--ppc-chip-bg)_85%,transparent)] px-2 py-1">
                                        <LevelPips level={o.level} selected={selected} />
                                        <span className="text-[11px] text-[var(--foreground-muted)]">{o.level}/3</span>
                                    </div>
                                </div>

                                <div className="grid gap-1">
                                    <div className="text-base font-semibold tracking-tight text-[var(--foreground)]">{o.title}</div>

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

            <HelpDetails segment={segment} opts={opts} />
        </div>
    );
}
