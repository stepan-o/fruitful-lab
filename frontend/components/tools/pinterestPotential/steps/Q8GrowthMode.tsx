"use client";

import React from "react";
import RadioPillGroup from "@/components/ui/forms/RadioPillGroup";
import type { GrowthMode, StepBaseProps } from "./ppcV2Types";

export default function Q8GrowthMode({
                                         value,
                                         onChange,
                                         onAutoAdvance,
                                     }: StepBaseProps & {
    value?: GrowthMode;
    onChange: (v: GrowthMode) => void;
}) {
    const options = [
        { label: "Organic only", value: "organic" as const },
        { label: "Maybe later", value: "later" as const },
        { label: "Yes (ads) 🚀", value: "ads" as const },
    ];

    return (
        <div className="grid gap-3">
            <div className="text-sm text-[var(--foreground-muted)]">Pick the closest match</div>

            <RadioPillGroup
                name="growth_mode"
                value={value}
                options={options}
                onChange={(v) => {
                    onChange(v as GrowthMode);
                    onAutoAdvance?.();
                }}
            />
        </div>
    );
}
