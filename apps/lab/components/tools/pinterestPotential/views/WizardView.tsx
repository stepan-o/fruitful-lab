// frontend/components/tools/pinterestPotential/views/WizardView.tsx
"use client";

import React, { type ReactNode, useMemo } from "react";

export type WizardViewProps = {
    progressText: string;
    progressPct: number;
    header: string;

    stepContent: ReactNode;

    errorMessage?: string | null;

    backDisabled: boolean;
    continueDisabled: boolean;
    continueLabel: string;

    onBack: () => void;
    onContinue: () => void;
};

function clampPct(n: number) {
    if (!Number.isFinite(n)) return 0;
    return Math.min(100, Math.max(0, Math.round(n)));
}

export default function WizardView({
                                       progressText,
                                       progressPct,
                                       header,
                                       stepContent,
                                       errorMessage,
                                       backDisabled,
                                       continueDisabled,
                                       continueLabel,
                                       onBack,
                                       onContinue,
                                   }: WizardViewProps) {
    const pct = useMemo(() => clampPct(progressPct), [progressPct]);

    return (
        <section className="ppc-hero-frame relative">
            {/* Subtle panel polish (purely decorative) */}
            <div className="ppc-hero-sheen" aria-hidden="true" />
            <div className="ppc-hero-noise" aria-hidden="true" />

            <div className="relative z-10 p-6">
                {/* Progress */}
                <div className="mb-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
            <span className="ppc-chip inline-flex items-center px-3 py-1 text-xs text-[var(--foreground-muted)]">
              {progressText}
            </span>

                        <span className="text-xs tabular-nums text-[var(--foreground-muted)]">
              {pct}%
            </span>
                    </div>

                    <div
                        className="h-2 w-full overflow-hidden rounded-full bg-[var(--background)]"
                        role="progressbar"
                        aria-label="Progress"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={pct}
                    >
                        <div
                            className="h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none"
                            style={{
                                width: `${pct}%`,
                                background: "linear-gradient(90deg, var(--brand-raspberry), var(--brand-bronze))",
                            }}
                        />
                    </div>
                </div>

                {/* Header + Content */}
                <div>
                    <h2 className="font-heading text-xl text-[var(--foreground)]">{header}</h2>

                    <div className="mt-4">
                        {stepContent}

                        {errorMessage ? (
                            <div
                                className="mt-4 inline-flex max-w-full items-start gap-2 rounded-lg border border-[color-mix(in_srgb,var(--brand-rust)_35%,transparent)] bg-[color-mix(in_srgb,var(--brand-rust)_10%,transparent)] px-3 py-2 text-sm text-[var(--foreground)]"
                                role="alert"
                                aria-live="polite"
                            >
                <span
                    className="mt-1 inline-block h-2 w-2 flex-none rounded-full"
                    style={{ background: "var(--brand-rust)" }}
                    aria-hidden="true"
                />
                                <span className="leading-snug">{errorMessage}</span>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* Nav */}
                <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={backDisabled}
                        className="fp-tap rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] transition hover:bg-[var(--card-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100"
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={onContinue}
                        disabled={continueDisabled}
                        className={[
                            "ppc-primary-btn fp-tap",
                            "rounded-lg px-5 py-2.5 text-sm font-semibold text-white",
                            "transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                            "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
                        ].join(" ")}
                        style={{ background: "var(--brand-raspberry)" }}
                    >
                        {continueLabel}
                    </button>
                </div>
            </div>
        </section>
    );
}
