"use client";

import React, { useId } from "react";
import type { VisualStrength, StepBaseProps } from "./ppcV2Types";

type Opt = {
    v: VisualStrength;
    label: string;
    subtitle: string;
    score: number; // 1..4
};

function ScoreRail({ activeScore }: { activeScore?: number }) {
    return (
        <div className="mt-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-3">
            <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
                <span>Lower</span>
                <span>Higher</span>
            </div>

            <div className="mt-2 flex items-center gap-2" aria-hidden="true">
                <div className="h-px flex-1 bg-[var(--border)] opacity-80" />
                <div className="h-px flex-1 bg-[var(--border)] opacity-80" />
                <div className="h-px flex-1 bg-[var(--border)] opacity-80" />
            </div>

            <div className="mt-2 flex items-center justify-between" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, i) => {
                    const n = i + 1;
                    const isActive = activeScore === n;

                    return (
                        <span
                            key={n}
                            className={[
                                "relative grid place-items-center",
                                "h-6 w-6 rounded-full border",
                                "border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)]",
                                isActive ? "shadow-[0_0_0_2px_var(--brand-raspberry)_inset]" : "",
                            ].join(" ")}
                        >
              <span
                  className={[
                      "h-2.5 w-2.5 rounded-full",
                      isActive
                          ? "bg-[var(--brand-raspberry)] shadow-[0_0_0_2px_rgba(0,0,0,0.25)_inset]"
                          : "bg-[var(--border)] opacity-70",
                  ].join(" ")}
              />
            </span>
                    );
                })}
            </div>
        </div>
    );
}

function Meter({
                   filled,
                   total = 4,
                   selected,
               }: {
    filled: number;
    total?: number;
    selected: boolean;
}) {
    return (
        <div className="flex items-center gap-1" aria-hidden="true" title={`${filled} of ${total}`}>
            {Array.from({ length: total }).map((_, i) => {
                const n = i + 1;
                const isOn = n <= filled;

                return (
                    <span
                        key={n}
                        className={[
                            "h-2.5 w-2.5 rounded-full border transition-colors",
                            "border-[var(--border)]",
                            isOn ? "bg-[var(--brand-bronze)]" : "bg-[var(--card)]",
                            selected && isOn ? "shadow-[0_0_0_1px_rgba(0,0,0,0.18)_inset]" : "",
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
                Photos, short-form videos, product shots, before/after, UGC, graphics, templates — anything you can
                turn into Pins without starting from zero every time.
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
        { v: "limited", label: "Limited", subtitle: "Starter library", score: 1 },
        { v: "decent", label: "Decent", subtitle: "Some solid assets", score: 2 },
        { v: "strong", label: "Strong", subtitle: "Consistent + reusable", score: 3 },
        { v: "very_strong", label: "Very strong", subtitle: "Deep library + variety", score: 4 },
    ];

    const selectedOpt = opts.find((o) => o.v === value);
    const activeScore = selectedOpt?.score;

    return (
        <div className="grid gap-4">
            {/* Framing */}
            <div className="grid gap-2">
                <div className="text-sm text-[var(--foreground-muted)]">
                    Pick the closest match — don’t overthink it.
                </div>

                <div className="flex items-center justify-between">
                    <div className="text-xs uppercase tracking-wide text-[var(--foreground-muted)]">
                        Visual library score
                    </div>

                    {/* Optional tiny state on the right (kept subtle) */}
                    <div className="text-xs text-[var(--foreground-muted)]">
                        {activeScore ? `${activeScore}/4 selected` : " "}
                    </div>
                </div>

                {/* Scale rail ties the step together */}
                <ScoreRail activeScore={activeScore} />
            </div>

            {/* Options (2-column on desktop, stacked on mobile) */}
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
                                // Premium selected: double stroke + slight lift
                                selected
                                    ? [
                                        "border-[var(--brand-raspberry)]/60",
                                        "ring-2 ring-[var(--brand-raspberry)]/70",
                                        "shadow-[0_10px_26px_rgba(0,0,0,0.35)]",
                                        "translate-y-[-1px]",
                                    ].join(" ")
                                    : "",
                            ].join(" ")}
                        >
                            {/* Sheen + wash */}
                            <span
                                aria-hidden="true"
                                className={[
                                    "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity",
                                    selected ? "opacity-100" : "group-hover:opacity-35",
                                ].join(" ")}
                                style={{
                                    background:
                                        "radial-gradient(520px 220px at 18% 10%, rgba(255,255,255,0.08), transparent 58%), linear-gradient(90deg, color-mix(in srgb, var(--brand-raspberry) 34%, transparent), color-mix(in srgb, var(--brand-bronze) 24%, transparent))",
                                }}
                            />

                            {/* Inner stroke to get the “boutique” crispness */}
                            <span
                                aria-hidden="true"
                                className={[
                                    "pointer-events-none absolute inset-0 rounded-2xl",
                                    selected
                                        ? "shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset]"
                                        : "shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]",
                                ].join(" ")}
                            />

                            <div className="relative flex h-full items-start justify-between gap-4">
                                {/* Left content */}
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <div className={["text-sm font-medium", selected ? "text-[var(--foreground)]" : "text-[var(--foreground)]"].join(" ")}>
                                            {o.label}
                                        </div>

                                        {/* Subtle score badge (less “dashboard”, more “premium”) */}
                                        <span
                                            className={[
                                                "inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs",
                                                "border-[var(--ppc-chip-border)] bg-[var(--ppc-chip-bg)] text-[var(--foreground-muted)]",
                                            ].join(" ")}
                                        >
                      <span
                          className={[
                              "h-2 w-2 rounded-full",
                              selected ? "bg-[var(--brand-raspberry)]" : "bg-[var(--border)] opacity-70",
                          ].join(" ")}
                          aria-hidden="true"
                      />
                                            {o.score}/4
                    </span>
                                    </div>

                                    <div className="mt-1 text-sm text-[var(--foreground-muted)]">{o.subtitle}</div>
                                </div>

                                {/* Right signal */}
                                <div className="flex flex-col items-end gap-2">
                                    <Meter filled={o.score} selected={selected} />
                                    {selected ? <SelectedChip /> : <span className="h-7" aria-hidden="true" />}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Helper */}
            <HelpDetails />
        </div>
    );
}
