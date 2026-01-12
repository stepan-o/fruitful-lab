"use client";

import React from "react";
import RadioPillGroup from "@/components/ui/forms/RadioPillGroup";
import type { Segment, OfferClarity, StepBaseProps } from "./ppcV2Types";

export default function Q6Offer({
                                    segment,
                                    value,
                                    onChange,
                                    onAutoAdvance,
                                }: StepBaseProps & {
    segment: Segment;
    value?: OfferClarity;
    onChange: (v: OfferClarity) => void;
}) {
    const prompt =
        segment === "content_creator"
            ? "Do you have a clear lead magnet or newsletter offer?"
            : segment === "product_seller"
                ? "Do you have a hero product / best-seller to push?"
                : "Do you have a clear offer + booking flow?";

    const options = [
        { label: "No", value: "no" as const },
        { label: "Somewhat", value: "somewhat" as const },
        { label: "Yes", value: "yes" as const },
    ];

    return (
        <div className="grid gap-3">
            <div className="text-sm text-[var(--foreground)]">{prompt}</div>
            <div className="text-sm text-[var(--foreground-muted)]">Pick the closest match</div>

            <RadioPillGroup
                name="offer_clarity"
                value={value}
                options={options}
                onChange={(v) => {
                    onChange(v as OfferClarity);
                    onAutoAdvance?.();
                }}
            />
        </div>
    );
}
