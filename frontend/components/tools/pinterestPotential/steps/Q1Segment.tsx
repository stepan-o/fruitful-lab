"use client";

import React from "react";
import type { Segment, StepBaseProps } from "./ppcV2Types";

export default function Q1Segment({
                                      value,
                                      onChange,
                                      onAutoAdvance,
                                  }: StepBaseProps & {
    value?: Segment;
    onChange: (v: Segment) => void;
}) {
    const options: Array<{
        value: Segment;
        title: string;
        desc: string;
        icon: React.ReactNode;
    }> = [
        {
            value: "content_creator",
            title: "Content Creator",
            desc: "Traffic / Subscribers",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M4 6a2 2 0 0 1 2-2h8l4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zm10 0v2h2l-2-2z"
                    />
                </svg>
            ),
        },
        {
            value: "product_seller",
            title: "Product Seller",
            desc: "Sales",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M7 4h-2l-1 2v2h2l3.6 7.59L8.25 19A2 2 0 0 0 10 22h10v-2H10l1.1-2h7.45a2 2 0 0 0 1.8-1.1L23 8H7.42L7 7h-2V5h2l0-1z"
                    />
                </svg>
            ),
        },
        {
            value: "service_provider",
            title: "Service Provider",
            desc: "Leads",
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        fill="currentColor"
                        d="M12 12a4 4 0 1 0-4-4a4 4 0 0 0 4 4Zm0 2c-4.42 0-8 2-8 4v2h16v-2c0-2-3.58-4-8-4Z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <div className="grid gap-3">
            <div className="text-sm text-[var(--foreground-muted)]">Pick the closest match</div>

            <div className="grid gap-2">
                {options.map((opt) => {
                    const selected = value === opt.value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                                onChange(opt.value);
                                onAutoAdvance?.();
                            }}
                            className={[
                                "w-full rounded-xl border p-4 text-left transition-colors",
                                "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--card-hover)]",
                                selected ? "ring-1 ring-[var(--brand-raspberry)]" : "",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                            ].join(" ")}
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-[var(--brand-raspberry)]">{opt.icon}</div>
                                <div>
                                    <div className="font-heading text-base text-[var(--foreground)]">{opt.title}</div>
                                    <div className="text-sm text-[var(--foreground-muted)]">{opt.desc}</div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
