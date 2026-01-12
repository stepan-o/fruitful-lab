"use client";

import React from "react";
import RadioPillGroup from "@/components/ui/forms/RadioPillGroup";
import type { SiteExperience, StepBaseProps } from "./ppcV2Types";

export default function Q5Site({
                                   value,
                                   onChange,
                                   onAutoAdvance,
                               }: StepBaseProps & {
    value?: SiteExperience;
    onChange: (v: SiteExperience) => void;
}) {
    const options = [
        { label: "A — Slow/confusing on mobile", value: "a" as const },
        { label: "B — Okay but could be clearer", value: "b" as const },
        { label: "C — Solid (fast + clear CTA)", value: "c" as const },
        { label: "D — Optimized (tested + improved)", value: "d" as const },
    ];

    return (
        <div className="grid gap-3">
            <div className="text-sm text-[var(--foreground-muted)]">
                On mobile, can someone tell what to do in 5 seconds?
            </div>

            <RadioPillGroup
                name="site_experience"
                value={value}
                options={options}
                onChange={(v) => {
                    onChange(v as SiteExperience);
                    onAutoAdvance?.();
                }}
            />
        </div>
    );
}
