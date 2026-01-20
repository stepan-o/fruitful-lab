// frontend/components/tools/pinterestPotential/steps/Q7Goal.tsx
"use client";

import React, { useEffect, useId, useMemo, useRef } from "react";
import type { Segment, StepBaseProps } from "./ppcV2Types";

/**
 * Q7 segment-specific goal thumbs (served from Next.js /public)
 *
 * Repo path:
 *   public/tools/pinterestPotential/thumbs/
 *
 * Assumed new assets (vertical):
 *   - content-creator-goal-1.jpg ... goal-4.jpg
 *   - product-seller-goal-1.jpg ... goal-4.jpg
 *   - service-provider-goal-1.jpg ... goal-4.jpg
 *
 * Naming pattern:
 *   {segment}-goal-x.jpg
 *   segment in ['content-creator','product-seller','service-provider']
 */
const THUMB_BASE = "/tools/pinterestPotential/thumbs";
const HELP_ID = "ppc-q7-help";

type GoalValue =
    | "traffic"
    | "subscribers"
    | "affiliate"
    | "sales"
    | "retargeting"
    | "discovery"
    | "leads"
    | "webinar"
    | "authority";

type Opt = {
    v: GoalValue;
    title: string;
    subtitle: string; // pill
    level: 1 | 2 | 3 | 4; // used for asset index + pips
    blurb: string; // ultra short
};

function segmentAssetPrefix(seg: Segment): "content-creator" | "product-seller" | "service-provider" {
    if (seg === "content_creator") return "content-creator";
    if (seg === "product_seller") return "product-seller";
    return "service-provider";
}

function goalThumbSrc(seg: Segment, level: 1 | 2 | 3 | 4) {
    return `${THUMB_BASE}/${segmentAssetPrefix(seg)}-goal-${level}.jpg`;
}

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
          className={["h-1.5 w-1.5 rounded-full", tone.dot, selected ? "opacity-100" : "opacity-80"].join(" ")}
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
                    "ppc-goalThumb",
                    selected ? "ppc-goalThumb-selected" : "",
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

function helpBulletsBySegment(seg: Segment) {
    const common = [
        "Pick the outcome you want first — we’ll tailor the “potential” math to that.",
        "If two feel true, choose what you want in the next 60–90 days.",
    ];

    if (seg === "content_creator") {
        return {
            traffic: ["Optimizes for website sessions and top-of-funnel reads.", "Best if your monetization happens on-site.", "Think: blog posts, SEO pages, long-form content."],
            subscribers: ["Optimizes for email list growth (lead magnets + opt-ins).", "Best if you sell later via email.", "Think: freebies, newsletters, challenges."],
            affiliate: ["Optimizes for revenue via affiliate clicks and intent pages.", "Best if you have buyer-intent content.", "Think: roundups, “best of”, comparisons."],
            sales: ["Optimizes for direct offer conversions.", "Best if you have a clear product/course + landing page.", "Think: evergreen funnel, launch pages, checkout."],
            common,
        };
    }

    if (seg === "product_seller") {
        return {
            sales: ["Optimizes for purchase intent and product discovery.", "Best if your product pages convert on mobile.", "Think: collections, best-sellers, bundles."],
            subscribers: ["Optimizes for list growth (promos, VIP, waitlists).", "Best if email is your conversion engine.", "Think: discounts, early access, drops."],
            retargeting: ["Optimizes for building a warm audience to re-market to.", "Best if you’ll run conversion ads later.", "Think: catalog views, product engagement."],
            discovery: ["Optimizes for reaching new audiences and new-to-brand demand.", "Best if you’re expanding beyond current buyers.", "Think: category entry points + hero products."],
            common,
        };
    }

    return {
        leads: ["Optimizes for inquiries, consult calls, and form fills.", "Best if your offer is high-value + high-intent.", "Think: application pages, booking pages."],
        subscribers: ["Optimizes for lead capture (content → nurture).", "Best if you educate + build trust before selling.", "Think: guides, checklists, email sequences."],
        webinar: ["Optimizes for event signups (live or evergreen).", "Best if your webinar is your main conversion lever.", "Think: registration page + reminders."],
        authority: ["Optimizes for credibility + top-of-funnel visibility.", "Best if you sell via trust + expertise over time.", "Think: proof, case studies, “how it works”."],
        common,
    };
}

function HelpDetails({ segment, opts }: { segment: Segment; opts: Opt[] }) {
    const bullets = useMemo(() => helpBulletsBySegment(segment), [segment]);

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
          How do I choose the right goal (fast)?
        </span>

                <span
                    aria-hidden="true"
                    className={["text-xs text-[var(--foreground-muted)] transition-transform", "group-open:rotate-180"].join(" ")}
                >
          ▼
        </span>
            </summary>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {opts.map((o) => {
                    const perGoal = (bullets as any)[o.v] as string[] | undefined;
                    const common = (bullets as any).common as string[] | undefined;

                    const rows = [...(perGoal ?? []), ...(common ?? [])].slice(0, 6);

                    return (
                        <div key={o.v} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="text-sm font-semibold text-[var(--foreground)]">{o.title}</div>
                                        <LevelBadge level={o.level} subtitle={o.subtitle} selected={false} />
                                    </div>
                                    <div className="mt-1 text-xs text-[var(--foreground-muted)]">{o.blurb}</div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <LevelPips level={o.level} selected={false} />
                                    <div className="text-[11px] text-[var(--foreground-muted)]">{o.level}/4</div>
                                </div>
                            </div>

                            <ul className="mt-2 grid gap-1.5 text-xs text-[var(--foreground-muted)]">
                                {rows.map((b) => (
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
                You’re not locking yourself in forever — this just tells the calculator what outcome to optimize for when it estimates your range.
            </div>
        </details>
    );
}

// --- IMPORTANT ---
// StepBaseProps' onAutoAdvance is currently typed as 0-arg in some places,
// but the wizard expects a patch-shaped call.
// We override the prop type here to match the wizard contract and remove IDE TS2554 errors.
type Q7AutoAdvancePatch = { primary_goal?: string };
type Q7AutoAdvanceFn = (patch?: Q7AutoAdvancePatch) => void;

type Q7Props = Omit<StepBaseProps, "onAutoAdvance"> & {
    segment: Segment;
    value?: string;
    onChange: (v: string) => void;
    onAutoAdvance?: Q7AutoAdvanceFn;
};

export default function Q7Goal({ segment, value, onChange, onAutoAdvance }: Q7Props) {
    const listId = useId();

    const lastClickRef = useRef<string | null>(null);
    const localTimerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (localTimerRef.current !== null) {
                window.clearTimeout(localTimerRef.current);
                localTimerRef.current = null;
            }
        };
    }, []);

    const opts: Opt[] = useMemo(() => {
        const base: Record<Segment, Opt[]> = {
            content_creator: [
                { v: "traffic", title: "Traffic", subtitle: "Website visits", level: 1, blurb: "Send more people to your content." },
                { v: "subscribers", title: "Email subscribers", subtitle: "List growth", level: 2, blurb: "Grow a warm audience you own." },
                { v: "affiliate", title: "Affiliate revenue", subtitle: "Buyer intent", level: 3, blurb: "Earn from clicks that convert." },
                { v: "sales", title: "Course/product sales", subtitle: "Direct sales", level: 4, blurb: "Move people to your offer." },
            ],
            product_seller: [
                { v: "sales", title: "Sales", subtitle: "Purchases", level: 1, blurb: "Drive product buys from Pinterest." },
                { v: "subscribers", title: "Email subscribers", subtitle: "VIP list", level: 2, blurb: "Build a list for promos + drops." },
                { v: "retargeting", title: "Retargeting pool", subtitle: "Warm audience", level: 3, blurb: "Build an audience to re-market to." },
                { v: "discovery", title: "New customer discovery", subtitle: "New-to-brand", level: 4, blurb: "Reach people who don’t know you yet." },
            ],
            service_provider: [
                { v: "leads", title: "Leads/calls", subtitle: "Inquiries", level: 1, blurb: "Get booked (forms + consult calls)." },
                { v: "subscribers", title: "Email subscribers", subtitle: "Nurture", level: 2, blurb: "Capture leads and build trust." },
                { v: "webinar", title: "Webinar signups", subtitle: "Events", level: 3, blurb: "Fill a webinar (live or evergreen)." },
                { v: "authority", title: "Authority/visibility", subtitle: "Credibility", level: 4, blurb: "Be the obvious expert in your niche." },
            ],
        };

        return base[segment];
    }, [segment]);

    const scrollToHelp = () => {
        const el = document.getElementById(HELP_ID);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    function triggerAutoAdvance(clicked: string, goalValue: string) {
        const prevValue = value;

        // Always update selection for UI consistency
        onChange(goalValue);

        // Normal change path: send patch directly.
        if (prevValue !== goalValue) {
            lastClickRef.current = goalValue;
            onAutoAdvance?.({ primary_goal: goalValue });
            return;
        }

        // Reselect same (back-navigation confirm):
        // Wizard ignores no-op patches; force a *real* patch by flipping undefined -> value.
        if (lastClickRef.current === goalValue) return;
        lastClickRef.current = goalValue;

        onAutoAdvance?.({ primary_goal: undefined });

        if (localTimerRef.current !== null) window.clearTimeout(localTimerRef.current);
        localTimerRef.current = window.setTimeout(() => {
            onAutoAdvance?.({ primary_goal: goalValue });
        }, 0);
    }

    return (
        <div className="grid gap-4">
            <style>{`
        .ppc-goalThumb {
          transform: scale(1.03);
          filter: contrast(1.03) saturate(1.06);
          transition: transform 520ms ease, filter 520ms ease;
          will-change: transform;
        }
        .ppc-goalThumb-selected {
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

                <div className="text-xs text-[var(--foreground-muted)]">
                    Want help picking?{" "}
                    <button
                        type="button"
                        onClick={scrollToHelp}
                        className="underline decoration-[rgba(255,255,255,0.18)] underline-offset-4 hover:text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                        Quick guide below ↓
                    </button>
                </div>

                <span id={listId} className="sr-only">
          Primary goal options
        </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="radiogroup" aria-labelledby={listId}>
                {opts.map((o) => {
                    const selected = value === o.v;
                    const src = goalThumbSrc(segment, o.level);

                    return (
                        <button
                            key={o.v}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            data-selected={selected ? "true" : "false"}
                            data-level={String(o.level)}
                            onClick={() => triggerAutoAdvance(o.v, o.v)}
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
                                    <Thumb src={src} selected={selected} />

                                    <div className="pointer-events-none absolute right-2 top-2 flex items-center gap-2 rounded-full border border-[var(--ppc-chip-border)] bg-[color-mix(in_srgb,var(--ppc-chip-bg)_85%,transparent)] px-2 py-1">
                                        <LevelPips level={o.level} selected={selected} />
                                        <span className="text-[11px] text-[var(--foreground-muted)]">{o.level}/4</span>
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
