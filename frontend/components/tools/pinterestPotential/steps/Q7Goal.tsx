"use client";

import React from "react";
import type { Segment, StepBaseProps } from "./ppcV2Types";

const GOALS: Record<Segment, Array<{ label: string; value: string }>> = {
    content_creator: [
        { label: "Traffic", value: "traffic" },
        { label: "Email subscribers", value: "subscribers" },
        { label: "Affiliate revenue", value: "affiliate" },
        { label: "Course/product sales", value: "sales" },
    ],
    product_seller: [
        { label: "Sales", value: "sales" },
        { label: "Email subscribers", value: "subscribers" },
        { label: "Retargeting pool", value: "retargeting" },
        { label: "New customer discovery", value: "discovery" },
    ],
    service_provider: [
        { label: "Leads/calls", value: "leads" },
        { label: "Email subscribers", value: "subscribers" },
        { label: "Webinar signups", value: "webinar" },
        { label: "Authority/visibility", value: "authority" },
    ],
};

export default function Q7Goal({
                                   segment,
                                   value,
                                   onChange,
                                   onAutoAdvance,
                               }: StepBaseProps & {
    segment: Segment;
    value?: string;
    onChange: (v: string) => void;
}) {
    const opts = GOALS[segment];

    return (
        <div className="grid gap-3">
            <div className="text-sm text-[var(--foreground-muted)]">Pick the closest match</div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {opts.map((o) => {
                    const active = value === o.value;
                    return (
                        <button
                            key={o.value}
                            type="button"
                            onClick={() => {
                                onChange(o.value);
                                onAutoAdvance?.();
                            }}
                            className={[
                                "rounded-xl border p-4 text-left transition-colors",
                                "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--card-hover)]",
                                active ? "ring-1 ring-[var(--brand-raspberry)]" : "",
                            ].join(" ")}
                        >
                            <div className="text-sm text-[var(--foreground)]">{o.label}</div>
                            {active ? (
                                <div className="mt-1 text-xs text-[var(--foreground-muted)]">
                                    We’ll prioritize: <span className="text-[var(--foreground)]">{o.label}</span>
                                </div>
                            ) : null}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
