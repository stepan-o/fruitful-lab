"use client";

import React from "react";
import type { Segment } from "./ppcV2Types";

export default function Q1Segment({
                                      value,
                                      onChange,
                                      onAutoAdvance,
                                  }: {
    value?: Segment;
    onChange: (v: Segment) => void;
    onAutoAdvance?: (segment: Segment) => void;
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

            <div className="grid gap-3">
                {options.map((opt) => {
                    const selected = value === opt.value;

                    return (
                        <button
                            key={opt.value}
                            type="button"
                            aria-pressed={selected}
                            onClick={() => {
                                onChange(opt.value);
                                onAutoAdvance?.(opt.value);
                            }}
                            className={[
                                "group w-full rounded-2xl border px-4 py-4 text-left transition",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                                "active:scale-[0.99]",
                                selected
                                    ? "border-[var(--brand-raspberry)] bg-[var(--card)] shadow-sm"
                                    : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--card-hover)]",
                            ].join(" ")}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={[
                                            "flex h-10 w-10 items-center justify-center rounded-xl border",
                                            selected
                                                ? "border-[var(--brand-raspberry)] text-[var(--brand-raspberry)]"
                                                : "border-[var(--border)] text-[var(--foreground-muted)] group-hover:text-[var(--brand-raspberry)]",
                                        ].join(" ")}
                                    >
                                        {opt.icon}
                                    </div>

                                    <div>
                                        <div className="font-heading text-base text-[var(--foreground)]">{opt.title}</div>
                                        <div className="text-sm text-[var(--foreground-muted)]">{opt.desc}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {selected ? (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--background)] px-2 py-1 text-xs text-[var(--foreground)]">
                      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="currentColor" d="M9.0 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
                      </svg>
                      Selected
                    </span>
                                    ) : (
                                        <span className="text-xs text-[var(--foreground-muted)] opacity-0 transition group-hover:opacity-100">
                      Tap to choose
                    </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="text-xs text-[var(--foreground-muted)]">
                This sets how we tailor the estimate (traffic vs sales vs leads).
            </div>
        </div>
    );
}
