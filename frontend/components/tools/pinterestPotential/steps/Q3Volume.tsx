"use client";

import { useEffect, useId, useRef } from "react";
import type { Segment, VolumeBucket, StepBaseProps } from "./ppcV2Types";

type Option = {
    label: string;
    value: VolumeBucket;
    hint: string;
};

export default function Q3Volume({
                                     segment,
                                     value,
                                     onChange,
                                     onAutoAdvance,
                                 }: StepBaseProps & {
    segment: Segment;
    value?: VolumeBucket;
    onChange: (v: VolumeBucket) => void;
}) {
    const groupId = useId();
    const advanceTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (advanceTimeoutRef.current !== null) {
                window.clearTimeout(advanceTimeoutRef.current);
            }
        };
    }, []);

    const prompt =
        segment === "content_creator"
            ? "How many pieces of content do you publish per month?"
            : segment === "product_seller"
                ? "How many promos/new arrivals/collections do you run per month?"
                : "How often do you publish marketing content per month?";

    const options: Option[] = [
        { label: "0–2", value: "0-2", hint: "Low cadence" },
        { label: "3–5", value: "3-5", hint: "Steady cadence" },
        { label: "6–10", value: "6-10", hint: "Consistent cadence" },
        { label: "11–20", value: "11-20", hint: "High cadence" },
        { label: "20+", value: "20+", hint: "Very high cadence" },
    ];

    function commit(next: VolumeBucket) {
        // Clear any pending auto-advance so rapid changes don't jump weirdly.
        if (advanceTimeoutRef.current !== null) {
            window.clearTimeout(advanceTimeoutRef.current);
            advanceTimeoutRef.current = null;
        }

        onChange(next);

        // Micro-beat so selection feels “locked in” before advancing.
        if (onAutoAdvance) {
            advanceTimeoutRef.current = window.setTimeout(() => {
                onAutoAdvance();
            }, 140);
        }
    }

    return (
        <fieldset className="grid gap-4">
            <legend className="sr-only">Monthly output volume</legend>

            {/* Prompt + helper */}
            <div className="grid gap-1.5">
                <div className="text-sm text-[var(--foreground)]">{prompt}</div>
                <div className="text-xs text-[var(--foreground-muted)]">
                    Pick the closest match — don’t overthink it.
                </div>
            </div>

            {/* Subtle “Low → High” scale (visual rhythm, no logic) */}
            <div className="flex items-center justify-between text-[11px] text-[var(--foreground-muted)]">
                <span>Lower</span>
                <span>Higher</span>
            </div>

            {/* Premium choice cards */}
            <div
                role="radiogroup"
                aria-label="Monthly output volume"
                className="grid gap-2 sm:grid-cols-2"
            >
                {options.map((opt, idx) => {
                    const inputId = `${groupId}-${idx}`;
                    const checked = value === opt.value;

                    // Make the last option span full width on desktop for nicer rhythm (5 items).
                    const spanClass = idx === options.length - 1 ? "sm:col-span-2" : "";

                    return (
                        <label
                            key={opt.value}
                            htmlFor={inputId}
                            className={[
                                "group fp-tap relative cursor-pointer select-none rounded-2xl border px-4 py-3",
                                "bg-[var(--card)] hover:bg-[var(--card-hover)]",
                                "border-[var(--border)]",
                                "focus-within:outline-none focus-within:ring-2 focus-within:ring-[var(--brand-raspberry)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--background)]",
                                spanClass,
                            ].join(" ")}
                        >
                            <input
                                id={inputId}
                                type="radio"
                                name="volume_bucket"
                                value={opt.value}
                                checked={checked}
                                onChange={() => commit(opt.value)}
                                className="sr-only"
                            />

                            {/* Ambient selection glow */}
                            <span
                                aria-hidden="true"
                                className={[
                                    "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity",
                                    checked ? "opacity-100" : "group-hover:opacity-60",
                                ].join(" ")}
                                style={{
                                    background:
                                        "radial-gradient(600px 120px at 18% 15%, var(--ppc-accent-stroke) 0%, transparent 55%), radial-gradient(600px 120px at 82% 85%, var(--ppc-accent-stroke-2) 0%, transparent 58%)",
                                }}
                            />

                            {/* Inner content */}
                            <div className="relative flex items-start justify-between gap-3">
                                <div className="grid gap-0.5">
                                    <div className="font-heading text-[15px] text-[var(--foreground)]">
                                        {opt.label}
                                    </div>
                                    <div className="text-xs text-[var(--foreground-muted)]">
                                        {opt.hint}
                                    </div>
                                </div>

                                {/* Selected indicator */}
                                <div className="mt-0.5 flex items-center gap-2">
                  <span
                      className={[
                          "inline-flex h-5 w-5 items-center justify-center rounded-full border transition-all",
                          checked
                              ? "border-[var(--brand-raspberry)] bg-[color-mix(in_srgb,var(--brand-raspberry)_18%,transparent)]"
                              : "border-[color-mix(in_srgb,var(--border)_70%,transparent)] bg-transparent",
                      ].join(" ")}
                      aria-hidden="true"
                  >
                    <span
                        className={[
                            "h-2.5 w-2.5 rounded-full transition-opacity",
                            checked
                                ? "opacity-100 bg-[var(--brand-raspberry)]"
                                : "opacity-0 bg-[var(--brand-raspberry)]",
                        ].join(" ")}
                    />
                  </span>

                                    {checked ? (
                                        <span className="ppc-chip px-2 py-0.5 text-[11px] text-[var(--foreground)]">
                      Selected
                    </span>
                                    ) : null}
                                </div>
                            </div>

                            {/* Branded ring when checked */}
                            <span
                                aria-hidden="true"
                                className={[
                                    "pointer-events-none absolute inset-0 rounded-2xl transition-opacity",
                                    checked ? "opacity-100" : "opacity-0",
                                ].join(" ")}
                                style={{
                                    boxShadow:
                                        "inset 0 0 0 2px var(--ppc-accent-stroke), 0 10px 30px rgba(0,0,0,0.18)",
                                }}
                            />
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}
