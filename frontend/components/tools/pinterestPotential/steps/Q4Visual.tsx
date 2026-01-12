"use client";

import React from "react";
import type { VisualStrength, StepBaseProps } from "./ppcV2Types";

export default function Q4Visual({
                                     value,
                                     onChange,
                                     onAutoAdvance,
                                 }: StepBaseProps & {
    value?: VisualStrength;
    onChange: (v: VisualStrength) => void;
}) {
    const opts: Array<{ v: VisualStrength; label: string; tiles: number }> = [
        { v: "limited", label: "Limited", tiles: 1 },
        { v: "decent", label: "Decent", tiles: 2 },
        { v: "strong", label: "Strong", tiles: 3 },
        { v: "very_strong", label: "Very strong", tiles: 4 },
    ];

    return (
        <div className="grid gap-3">
            <div className="text-sm text-[var(--foreground-muted)]">Pick the closest match</div>

            <div className="grid gap-2">
                {opts.map((o) => {
                    const selected = value === o.v;
                    return (
                        <button
                            key={o.v}
                            type="button"
                            onClick={() => {
                                onChange(o.v);
                                onAutoAdvance?.();
                            }}
                            className={[
                                "flex items-center justify-between rounded-xl border p-4 text-left transition-colors",
                                "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--card-hover)]",
                                selected ? "ring-1 ring-[var(--brand-raspberry)]" : "",
                            ].join(" ")}
                        >
                            <div className="text-sm text-[var(--foreground)]">{o.label}</div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4].map((n) => (
                                    <div
                                        key={n}
                                        className={[
                                            "h-3 w-3 rounded-sm border border-[var(--border)]",
                                            n <= o.tiles ? "bg-[var(--brand-bronze)]" : "bg-[var(--card)]",
                                        ].join(" ")}
                                    />
                                ))}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
