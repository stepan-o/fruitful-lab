"use client";

import * as React from "react";

type ProgressBarProps = {
    step: number; // 1-based
    total: number;
    /** Optional label override (defaults to "Step X of Y") */
    label?: string;
    className?: string;
};

export function ProgressBar({ step, total, label, className = "" }: ProgressBarProps) {
    const safeTotal = Math.max(1, total);
    const safeStep = Math.min(Math.max(1, step), safeTotal);
    const pct = Math.round((safeStep / safeTotal) * 100);

    return (
        <div
            className={[
                "sticky top-0 z-40",
                "bg-white/90 backdrop-blur",
                "border-b border-black/5",
                className,
            ].join(" ")}
        >
            <div className="px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                    <div className="font-medium">
                        {label ?? `Step ${safeStep} of ${safeTotal}`}
                    </div>
                    <div className="text-black/50">{pct}%</div>
                </div>

                <div className="mt-2 h-2 w-full rounded-full bg-black/10 overflow-hidden">
                    <div
                        className="h-full rounded-full bg-black/80 transition-[width] duration-300 motion-reduce:transition-none"
                        style={{ width: `${pct}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
