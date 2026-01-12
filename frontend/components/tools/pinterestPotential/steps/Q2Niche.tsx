"use client";

import React, { useMemo, useState } from "react";
import { BottomSheet } from "@/components/ui/BottomSheet";
import type { Segment, StepBaseProps } from "./ppcV2Types";

type NicheOpt = { label: string; value: string; preview: "Focused" | "Medium" | "Broad" };

const NICHES: Record<Segment, NicheOpt[]> = {
    content_creator: [
        { label: "Food & Recipes", value: "food", preview: "Broad" },
        { label: "Travel", value: "travel", preview: "Broad" },
        { label: "Home & DIY", value: "home_diy", preview: "Broad" },
        { label: "Lifestyle & Inspiration", value: "lifestyle", preview: "Broad" },
        { label: "Personal Finance", value: "finance", preview: "Medium" },
        { label: "Health & Wellness", value: "wellness", preview: "Broad" },
        { label: "Parenting & Family", value: "parenting", preview: "Broad" },
        { label: "Beauty & Fashion", value: "beauty_fashion", preview: "Broad" },
        { label: "Crafts & Hobbies", value: "crafts", preview: "Medium" },
        { label: "Other", value: "other", preview: "Focused" },
    ],
    product_seller: [
        { label: "Baby & Family Products", value: "baby_family", preview: "Broad" },
        { label: "Home & Decor", value: "home_decor", preview: "Broad" },
        { label: "Beauty & Skincare", value: "beauty", preview: "Broad" },
        { label: "Fashion & Accessories", value: "fashion", preview: "Broad" },
        { label: "Health & Wellness", value: "wellness", preview: "Broad" },
        { label: "Food & Beverage (CPG)", value: "food_bev", preview: "Broad" },
        { label: "Crafts & Digital Products", value: "digital_crafts", preview: "Medium" },
        { label: "Pets", value: "pets", preview: "Broad" },
        { label: "Travel Gear & Accessories", value: "travel_gear", preview: "Medium" },
        { label: "Other", value: "other", preview: "Focused" },
    ],
    service_provider: [
        { label: "Marketing / Creative Agency", value: "agency", preview: "Medium" },
        { label: "Coach / Consultant", value: "coach", preview: "Broad" },
        { label: "Designer", value: "designer", preview: "Broad" },
        { label: "Photographer / Videographer", value: "photo_video", preview: "Medium" },
        { label: "Wellness Practitioner", value: "wellness_practitioner", preview: "Broad" },
        { label: "Finance / Bookkeeping", value: "finance", preview: "Focused" },
        { label: "Real Estate / Home Services", value: "real_estate_home", preview: "Medium" },
        { label: "Educator / Course Creator", value: "educator", preview: "Broad" },
        { label: "Event / Wedding Services", value: "events", preview: "Medium" },
        { label: "Other", value: "other", preview: "Focused" },
    ],
};

function PreviewMeter({ level }: { level: "Focused" | "Medium" | "Broad" }) {
    const idx = level === "Focused" ? 1 : level === "Medium" ? 2 : 3;
    return (
        <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-3">
            <div className="text-xs text-[var(--foreground-muted)]">Typical Pinterest audience size</div>
            <div className="mt-2 flex items-center gap-2">
                {[1, 2, 3].map((n) => (
                    <div
                        key={n}
                        className={[
                            "h-2 flex-1 rounded-full border border-[var(--border)]",
                            n <= idx ? "bg-[var(--brand-bronze)]" : "bg-[var(--card)]",
                        ].join(" ")}
                    />
                ))}
            </div>
            <div className="mt-2 text-sm text-[var(--foreground)]">{level}</div>
        </div>
    );
}

export default function Q2Niche({
                                    segment,
                                    value,
                                    onChange,
                                    onAutoAdvance,
                                }: StepBaseProps & {
    segment: Segment;
    value?: string;
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);

    const all = NICHES[segment];
    const inline = useMemo(() => all.slice(0, 7), [all]); // 6–10 target, keep it tight
    const selected = all.find((o) => o.value === value);

    function select(v: string) {
        onChange(v);
        setOpen(false);
        onAutoAdvance?.();
    }

    return (
        <div className="grid gap-3">
            <div className="text-sm text-[var(--foreground-muted)]">Pick the closest match</div>

            <div className="flex flex-wrap gap-2">
                {inline.map((opt) => {
                    const active = opt.value === value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => select(opt.value)}
                            className={[
                                "rounded-full border px-3 py-2 text-sm transition-colors",
                                "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--card-hover)]",
                                active ? "ring-1 ring-[var(--brand-raspberry)]" : "",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                            ].join(" ")}
                        >
                            {opt.label}
                        </button>
                    );
                })}

                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className={[
                        "rounded-full border px-3 py-2 text-sm",
                        "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                    ].join(" ")}
                >
                    More
                </button>
            </div>

            {selected ? <PreviewMeter level={selected.preview} /> : null}

            <BottomSheet
                open={open}
                onClose={() => setOpen(false)}
                title="Choose a niche"
            >
                <div className="grid gap-2">
                    {all.map((opt) => {
                        const active = opt.value === value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => select(opt.value)}
                                className={[
                                    "w-full rounded-lg border p-3 text-left transition-colors",
                                    "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--card-hover)]",
                                    active ? "ring-1 ring-[var(--brand-raspberry)]" : "",
                                ].join(" ")}
                            >
                                <div className="text-sm text-[var(--foreground)]">{opt.label}</div>
                                <div className="mt-1 text-xs text-[var(--foreground-muted)]">
                                    Audience: {opt.preview}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </BottomSheet>
        </div>
    );
}
