// frontend/components/tools/pinterestPotential/steps/Q1Segment.tsx
"use client";

import React from "react";
import type { Segment } from "./ppcV2Types";

type Option = {
    value: Segment;
    headline: string; // primary anchor
    goal: string; // highlighted “Main goal”
    bullets: [string, string];
    icon: React.ReactNode;
};

type Props = {
    value?: Segment;

    // NOTE: Next TS plugin (TS71007) wants function props in a "use client" entry
    // to look like Server Actions. Suffixing with "Action" silences the warning.
    onChangeAction: (v: Segment) => void;
    onAutoAdvanceAction?: (segment: Segment) => void;
};

export default function Q1Segment({
                                      value,
                                      onChangeAction,
                                      onAutoAdvanceAction,
                                  }: Props) {
    const groupId = React.useId();

    const options: Option[] = [
        {
            value: "content_creator",
            headline: "I’m a Content Creator",
            goal: "Traffic + subscribers",
            bullets: [
                "You publish content (blog / YouTube / podcast).",
                "You want clicks that turn into email sign-ups.",
            ],
            icon: (
                <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M6 3h8l4 4v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm8 1v3h3l-3-3Z"
                    />
                    <path
                        fill="currentColor"
                        d="M8 11h8v2H8v-2Zm0 4h8v2H8v-2Z"
                        opacity="0.7"
                    />
                </svg>
            ),
        },
        {
            value: "product_seller",
            headline: "I’m a Product Seller",
            goal: "Sales",
            bullets: [
                "You sell products (Shopify / Woo / Etsy).",
                "You want Pinterest to drive purchases (not just saves).",
            ],
            icon: (
                <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M7 6h14l-2 9a2 2 0 0 1-2 1H10a2 2 0 0 1-2-1L6 4H3V2h4l1 4Z"
                    />
                    <path
                        fill="currentColor"
                        d="M10 22a2 2 0 1 0 0-4a2 2 0 0 0 0 4Zm8 0a2 2 0 1 0 0-4a2 2 0 0 0 0 4Z"
                        opacity="0.7"
                    />
                </svg>
            ),
        },
        {
            value: "service_provider",
            headline: "I’m a Service Provider",
            goal: "Leads",
            bullets: [
                "You book clients (calls / consults).",
                "You want qualified inquiries (not random clicks).",
            ],
            icon: (
                <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4Z" />
                    <path
                        fill="currentColor"
                        d="M4 20v-1c0-3.3 3.6-5 8-5s8 1.7 8 5v1H4Z"
                        opacity="0.75"
                    />
                </svg>
            ),
        },
    ];

    const selectedIndexRaw = options.findIndex((o) => o.value === value);
    const selectedIndex = selectedIndexRaw >= 0 ? selectedIndexRaw : 0;

    function select(v: Segment) {
        onChangeAction(v);
        onAutoAdvanceAction?.(v);
    }

    function move(delta: number) {
        const next = (selectedIndex + delta + options.length) % options.length;
        select(options[next]!.value);
    }

    return (
        <div className="grid gap-4">
            {/* Common instruction row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm text-[var(--foreground-muted)]">
                    Pick the closest match — this sets how we tailor your results.
                </div>

                {/* Two info pieces, visually separated / different styles */}
                <div className="flex flex-wrap items-center gap-2">
          <span className="ppc-chip inline-flex items-center px-2.5 py-1 text-xs text-[var(--foreground)]">
            Step 1 sets the calculator mode
          </span>

                    <span
                        className="inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs"
                        style={{
                            background: "color-mix(in srgb, var(--brand-raspberry) 10%, transparent)",
                            border: "1px solid color-mix(in srgb, var(--brand-raspberry) 24%, transparent)",
                            color: "var(--foreground)",
                        }}
                    >
            <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{
                    background: "color-mix(in srgb, var(--brand-raspberry) 70%, transparent)",
                }}
            />
            Tap to select
          </span>
                </div>
            </div>

            <div role="radiogroup" aria-labelledby={`${groupId}-label`}>
        <span id={`${groupId}-label`} className="sr-only">
          Business type
        </span>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
                    {options.map((opt, idx) => {
                        const selected = value === opt.value;

                        return (
                            <button
                                key={opt.value}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                tabIndex={selected || (!value && idx === 0) ? 0 : -1}
                                onClick={() => select(opt.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                                        e.preventDefault();
                                        move(1);
                                    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                                        e.preventDefault();
                                        move(-1);
                                    } else if (e.key === " " || e.key === "Enter") {
                                        e.preventDefault();
                                        select(opt.value);
                                    }
                                }}
                                className={[
                                    "group relative h-full w-full rounded-2xl border p-5 text-left transition",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                                    "active:scale-[0.99]",
                                    selected
                                        ? "bg-[var(--card)] shadow-[0_18px_60px_rgba(0,0,0,0.22)]"
                                        : "bg-[color-mix(in srgb, var(--card) 55%, transparent)] hover:bg-[var(--card-hover)]",
                                ].join(" ")}
                                style={{
                                    borderColor: selected
                                        ? "color-mix(in srgb, var(--brand-raspberry) 55%, var(--border))"
                                        : "var(--border)",
                                }}
                            >
                                {/* Accent wash */}
                                <div
                                    aria-hidden="true"
                                    className={[
                                        "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition",
                                        selected ? "opacity-100" : "group-hover:opacity-70",
                                    ].join(" ")}
                                    style={{
                                        background:
                                            "radial-gradient(780px 260px at 18% 8%, color-mix(in srgb, var(--brand-raspberry) 18%, transparent) 0%, transparent 60%), radial-gradient(700px 240px at 88% 90%, color-mix(in srgb, var(--brand-bronze) 14%, transparent) 0%, transparent 62%)",
                                    }}
                                />

                                <div className="relative z-10 flex h-full flex-col gap-4">
                                    {/* Top row: persona icon + selected badge */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div
                                            className="flex h-14 w-14 flex-none items-center justify-center rounded-2xl border"
                                            style={{
                                                borderColor: selected
                                                    ? "color-mix(in srgb, var(--brand-raspberry) 45%, var(--border))"
                                                    : "var(--border)",
                                                background: selected
                                                    ? "color-mix(in srgb, var(--brand-raspberry) 10%, transparent)"
                                                    : "color-mix(in srgb, var(--card) 70%, transparent)",
                                                color: selected ? "var(--brand-raspberry)" : "var(--foreground-muted)",
                                            }}
                                        >
                                            {opt.icon}
                                        </div>

                                        {selected ? (
                                            <span
                                                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium"
                                                style={{
                                                    background: "color-mix(in srgb, var(--brand-raspberry) 14%, transparent)",
                                                    border: "1px solid color-mix(in srgb, var(--brand-raspberry) 35%, transparent)",
                                                    color: "var(--foreground)",
                                                }}
                                            >
                        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                              fill="currentColor"
                              d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"
                          />
                        </svg>
                        Selected
                      </span>
                                        ) : null}
                                    </div>

                                    {/* Hierarchy */}
                                    <div className="min-w-0">
                                        <div className="font-heading text-xl leading-tight text-[var(--foreground)] md:text-2xl">
                                            {opt.headline}
                                        </div>

                                        <div className="mt-3">
                      <span
                          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide"
                          style={{
                              background: "color-mix(in srgb, var(--brand-bronze) 16%, transparent)",
                              border: "1px solid color-mix(in srgb, var(--brand-bronze) 32%, transparent)",
                              color: "var(--foreground)",
                          }}
                      >
                        Main goal: {opt.goal}
                      </span>
                                        </div>

                                        <ul className="mt-4 grid gap-2.5 text-sm leading-snug text-[var(--foreground-muted)]">
                                            <li className="flex gap-2">
                        <span
                            aria-hidden="true"
                            className="mt-[0.45rem] inline-block h-1.5 w-1.5 rounded-full"
                            style={{
                                background: "color-mix(in srgb, var(--brand-raspberry) 60%, transparent)",
                            }}
                        />
                                                <span>{opt.bullets[0]}</span>
                                            </li>
                                            <li className="flex gap-2">
                        <span
                            aria-hidden="true"
                            className="mt-[0.45rem] inline-block h-1.5 w-1.5 rounded-full"
                            style={{
                                background: "color-mix(in srgb, var(--brand-bronze) 60%, transparent)",
                            }}
                        />
                                                <span>{opt.bullets[1]}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
