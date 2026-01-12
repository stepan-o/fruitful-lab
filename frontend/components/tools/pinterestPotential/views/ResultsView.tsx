// frontend/components/tools/pinterestPotential/views/ResultsView.tsx
"use client";

import React from "react";
import type { ResultsBundle } from "@/lib/tools/pinterestPotential/compute";

export type ResultsRecapItem = {
    label: string;
    value: string;
};

export type ResultsViewProps = {
    results: ResultsBundle;

    // Cards (pre-formatted strings so this stays pure UI)
    audienceRangeLabel: string;
    opportunityLabel: string;
    opportunityRangeLabel: string;
    incomeRangeLabel: string;

    // Meta
    showHardLockGate: boolean;
    showSoftLockGate: boolean;
    privacyMicrocopy: string;

    // Lead capture (controlled)
    leadName: string;
    leadEmail: string;

    requireName: boolean;

    errors: Record<string, string>;
    optionalLeadEmailError: string | null;
    optionalLeadSubmitted: boolean;

    onLeadNameChange: (next: string) => void;
    onLeadEmailChange: (next: string) => void;

    onUnlock: () => void; // hard lock
    onEmailResults: () => void; // soft lock

    // Recap + actions
    recap: ResultsRecapItem[];

    onStartOver: () => void;
    onEditAnswers: () => void;
};

export default function ResultsView({
                                        results,
                                        audienceRangeLabel,
                                        opportunityLabel,
                                        opportunityRangeLabel,
                                        incomeRangeLabel,
                                        showHardLockGate,
                                        showSoftLockGate,
                                        privacyMicrocopy,
                                        leadName,
                                        leadEmail,
                                        requireName,
                                        errors,
                                        optionalLeadEmailError,
                                        optionalLeadSubmitted,
                                        onLeadNameChange,
                                        onLeadEmailChange,
                                        onUnlock,
                                        onEmailResults,
                                        recap,
                                        onStartOver,
                                        onEditAnswers,
                                    }: ResultsViewProps) {
    const ResultsCards = (
        <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-xs text-[var(--foreground-muted)]">Monthly Pinterest audience</div>
                <div className="mt-1 font-heading text-2xl">{audienceRangeLabel}</div>
            </div>

            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-xs text-[var(--foreground-muted)]">{opportunityLabel}</div>
                <div className="mt-1 font-heading text-2xl">{opportunityRangeLabel}</div>
            </div>

            <div className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                <div className="text-xs text-[var(--foreground-muted)]">Audience income range (USD)</div>
                <div className="mt-1 font-heading text-2xl">{incomeRangeLabel}</div>
            </div>
        </div>
    );

    const LeadCaptureHardLock = showHardLockGate ? (
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <div>
                    <h3 className="font-heading text-lg text-[var(--foreground)]">Unlock your results</h3>
                    <p className="mt-1 text-sm text-[var(--foreground-muted)]">Enter your email to view the full snapshot.</p>
                    <p className="mt-2 text-xs text-[var(--foreground-muted)]">{privacyMicrocopy}</p>
                </div>

                <div className="mt-3 sm:mt-0 sm:col-span-2">
                    <div className="grid gap-3 sm:grid-cols-2">
                        {requireName ? (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Your name"
                                    value={leadName}
                                    onChange={(e) => onLeadNameChange(e.target.value)}
                                    className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                                />
                                {errors["LEAD.name"] ? <div className="mt-1 text-xs text-red-500">{errors["LEAD.name"]}</div> : null}
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    placeholder="Your name (optional)"
                                    value={leadName}
                                    onChange={(e) => onLeadNameChange(e.target.value)}
                                    className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                                />
                            </div>
                        )}

                        <div>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={leadEmail}
                                onChange={(e) => onLeadEmailChange(e.target.value)}
                                className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                            />
                            {errors["LEAD.email"] ? <div className="mt-1 text-xs text-red-500">{errors["LEAD.email"]}</div> : null}
                        </div>
                    </div>

                    <div className="mt-3">
                        <button
                            type="button"
                            onClick={onUnlock}
                            className="rounded-md bg-[var(--brand-raspberry)] px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                        >
                            Unlock
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;

    const LeadCaptureSoftLock = showSoftLockGate ? (
        <div className="mt-4 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
            <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                <div>
                    <h3 className="font-heading text-lg text-[var(--foreground)]">Want a copy of your results?</h3>
                    <p className="mt-1 text-sm text-[var(--foreground-muted)]">Leave your email and we’ll send this snapshot.</p>
                    <p className="mt-2 text-xs text-[var(--foreground-muted)]">{privacyMicrocopy}</p>
                </div>

                <div className="mt-3 sm:mt-0 sm:col-span-2">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <input
                                type="text"
                                placeholder="Your name (optional)"
                                value={leadName}
                                onChange={(e) => onLeadNameChange(e.target.value)}
                                className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                            />
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={leadEmail}
                                onChange={(e) => onLeadEmailChange(e.target.value)}
                                className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-[var(--foreground)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                            />
                            {optionalLeadEmailError ? <div className="mt-1 text-xs text-red-500">{optionalLeadEmailError}</div> : null}
                        </div>
                    </div>

                    <div className="mt-3">
                        <button
                            type="button"
                            disabled={optionalLeadSubmitted}
                            onClick={onEmailResults}
                            className="rounded-md bg-[var(--brand-raspberry)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        >
                            {optionalLeadSubmitted ? "Sent" : "Email me my results"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    ) : null;

    return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="mb-2 text-sm text-[var(--foreground-muted)]">Pinterest Potential — Results</div>

            {LeadCaptureHardLock}

            <div className={showHardLockGate ? "mt-4 opacity-40 blur-[2px] pointer-events-none select-none" : "mt-4"}>
                {ResultsCards}

                {results.insight_line ? (
                    <div className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--background)] p-4 text-sm text-[var(--foreground)]">
                        {results.insight_line}
                    </div>
                ) : null}

                <div className="mt-3 text-xs text-[var(--foreground-muted)]">
                    Seasonality: <span className="text-[var(--foreground)]">{results.inferred.seasonality_index}</span> •
                    Competition: <span className="text-[var(--foreground)]">{results.inferred.competition_index}</span>
                </div>

                {LeadCaptureSoftLock}
            </div>

            {/* Recap */}
            <div className="mt-6 border-t border-[var(--border)] pt-4">
                <div className="mb-2 font-heading text-lg text-[var(--foreground)]">Your answers</div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {recap.map((it, idx) => (
                        <div key={`${idx}-${it.label}`} className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4">
                            <div className="text-xs text-[var(--foreground-muted)]">{it.label}</div>
                            <div className="mt-1 text-sm text-[var(--foreground)]">{it.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
                <button
                    type="button"
                    onClick={onStartOver}
                    className="rounded-md border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] hover:bg-[var(--card-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                >
                    Start over
                </button>

                <button
                    type="button"
                    onClick={onEditAnswers}
                    className="rounded-md bg-[var(--brand-raspberry)] px-4 py-2 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                >
                    Edit answers
                </button>
            </div>

            <div className="mt-4 text-sm text-[var(--foreground-muted)]">You can refresh the page; your draft is saved in this session.</div>
        </div>
    );
}
