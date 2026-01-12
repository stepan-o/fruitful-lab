"use client";

import React from "react";
import RadioPillGroup from "@/components/ui/forms/RadioPillGroup";
import type { Segment, VolumeBucket, StepBaseProps } from "./ppcV2Types";

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
    const prompt =
        segment === "content_creator"
            ? "How many pieces of content do you publish per month?"
            : segment === "product_seller"
                ? "How many promos/new arrivals/collections do you run per month?"
                : "How often do you publish marketing content per month?";

    const options = [
        { label: "0–2", value: "0-2" as const },
        { label: "3–5", value: "3-5" as const },
        { label: "6–10", value: "6-10" as const },
        { label: "11–20", value: "11-20" as const },
        { label: "20+", value: "20+" as const },
    ];

    return (
        <div className="grid gap-3">
            <div className="text-sm text-[var(--foreground)]">{prompt}</div>
            <div className="text-sm text-[var(--foreground-muted)]">Pick the closest match</div>

            <RadioPillGroup
                name="volume_bucket"
                value={value}
                options={options}
                onChange={(v) => {
                    onChange(v as VolumeBucket);
                    onAutoAdvance?.();
                }}
            />
        </div>
    );
}
