// frontend/components/tools/pinterestPotential/views/WizardView.tsx
"use client";

import React, { type ReactNode } from "react";

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
    return (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            {/* Progress */}
            <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-[var(--foreground-muted)]">
                    <span>{progressText}</span>
                    <span>{progressPct}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-[var(--background)]">
                    <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%`, background: "var(--brand-raspberry)" }}
                    />
                </div>
            </div>

            {/* Question */}
            <div>
                <h2 className="font-heading text-xl text-[var(--foreground)]">{header}</h2>

                <div className="mt-4">
                    {stepContent}

                    {errorMessage ? (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                            <span className="inline-block h-2 w-2 rounded-full bg-red-400" aria-hidden="true" />
                            <span>{errorMessage}</span>
                        </div>
                    ) : null}
                </div>
            </div>

            {/* Nav */}
            <div className="mt-6 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={backDisabled}
                    className="rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] transition hover:bg-[var(--card-hover)] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                    Back
                </button>

                <button
                    type="button"
                    onClick={onContinue}
                    disabled={continueDisabled}
                    className={[
                        "rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition",
                        "bg-[var(--brand-raspberry)]",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                        "active:scale-[0.98]",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                    ].join(" ")}
                >
                    {continueLabel}
                </button>
            </div>
        </div>
    );
}
