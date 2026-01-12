// frontend/components/tools/pinterestPotential/views/WelcomeView.tsx
"use client";

import React from "react";

export type WelcomeViewProps = {
    onStart: () => void;
    onReset: () => void;
};

export default function WelcomeView({ onStart, onReset }: WelcomeViewProps) {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            {/* Animated gradient layer (CSS in globals.css) */}
            <div aria-hidden="true" className="ppc-welcome-gradient absolute inset-0" />

            {/* Glows */}
            <div
                aria-hidden="true"
                className="ppc-welcome-glow-1 pointer-events-none absolute -top-24 right-[-140px] h-72 w-72 rounded-full opacity-25 blur-3xl"
                style={{ background: "var(--brand-raspberry)" }}
            />
            <div
                aria-hidden="true"
                className="ppc-welcome-glow-2 pointer-events-none absolute -bottom-24 left-[-140px] h-72 w-72 rounded-full opacity-15 blur-3xl"
                style={{ background: "var(--brand-raspberry)" }}
            />

            {/* Content */}
            <div className="relative p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)] px-3 py-1 text-xs text-[var(--foreground-muted)]">
                    <span className="h-2 w-2 rounded-full" style={{ background: "var(--brand-raspberry)" }} />
                    8 questions • ~60 seconds • saved this session
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                        <div className="text-sm text-[var(--foreground-muted)]">Pinterest Potential</div>
                        <h2 className="mt-1 font-heading text-2xl sm:text-3xl text-[var(--foreground)]">
                            See your growth snapshot
                        </h2>
                        <p className="mt-2 max-w-prose text-sm text-[var(--foreground-muted)]">
                            Answer a few quick questions and we’ll estimate your monthly audience + opportunity.
                        </p>
                    </div>

                    {/* lightweight hero */}
                    <div className="hidden sm:block text-[var(--foreground)]">
                        <svg width="150" height="96" viewBox="0 0 150 96" aria-hidden="true">
                            <rect x="10" y="54" width="16" height="32" rx="4" fill="currentColor" opacity="0.22" />
                            <rect x="36" y="42" width="16" height="44" rx="4" fill="currentColor" opacity="0.32" />
                            <rect x="62" y="30" width="16" height="56" rx="4" fill="currentColor" opacity="0.42" />
                            <path
                                d="M18 36 C42 22, 74 22, 108 14"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                opacity="0.35"
                            />
                            <circle cx="116" cy="13" r="5" fill="currentColor" opacity="0.55" />
                        </svg>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onStart}
                        className={[
                            "rounded-lg bg-[var(--brand-raspberry)] px-5 py-2.5 text-sm font-semibold text-white transition",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                            "active:scale-[0.98]",
                        ].join(" ")}
                    >
                        Start
                    </button>

                    <button
                        type="button"
                        onClick={onReset}
                        className={[
                            "rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] transition",
                            "hover:bg-[var(--card-hover)] active:scale-[0.98]",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                        ].join(" ")}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
