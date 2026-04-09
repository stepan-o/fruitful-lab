"use client";

import { PINTEREST_FIT_CALL_URL, type AssessmentResult } from "@/lib/tools/pinterestFit";

type ResultsScreenProps = {
    result: AssessmentResult;
    onRestart: () => void;
};

function isPlaceholderFitCallUrl(url: string) {
    return url === PINTEREST_FIT_CALL_URL || url.includes("TODO_ADD_REAL_FIT_CALL_URL");
}

export function ResultsScreen({ result, onRestart }: ResultsScreenProps) {
    const bookingUrlPending = isPlaceholderFitCallUrl(result.cta.url);

    return (
        <section className="ppc-hero-frame relative overflow-hidden">
            <div aria-hidden="true" className="ppc-hero-sheen" />
            <div aria-hidden="true" className="ppc-hero-noise" />

            <div className="relative z-10 p-6 sm:p-8">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="ppc-chip inline-flex items-center px-3 py-1 text-xs text-[var(--foreground-muted)]">
                        {result.label}
                    </span>
                    <span className="text-xs text-[var(--foreground-muted)]">
                        Score {result.score} of {result.maxScore}
                    </span>
                </div>

                <div className="mt-6 max-w-3xl">
                    <h2 className="font-heading text-3xl leading-tight text-[var(--foreground)] sm:text-4xl">
                        {result.headline}
                    </h2>
                    <p className="mt-4 text-base leading-7 text-[var(--foreground-muted)]">{result.intro}</p>
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                        <h3 className="font-heading text-xl text-[var(--foreground)]">Top reasons</h3>
                        <ul className="mt-4 space-y-3">
                            {result.reasons.map((reason) => (
                                <li key={reason} className="flex items-start gap-3">
                                    <span
                                        aria-hidden="true"
                                        className="mt-2 inline-block h-2.5 w-2.5 rounded-full"
                                        style={{ background: "var(--brand-raspberry)" }}
                                    />
                                    <span className="text-sm leading-6 text-[var(--foreground)]">{reason}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
                        <h3 className="font-heading text-xl text-[var(--foreground)]">Best role for Pinterest</h3>
                        <p className="mt-4 text-sm leading-6 text-[var(--foreground)]">{result.roleCopy}</p>

                        <div className="mt-6">
                            {result.cta.caption ? (
                                <p className="text-sm font-medium text-[var(--foreground)]">{result.cta.caption}</p>
                            ) : null}
                            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">{result.cta.subtext}</p>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            {bookingUrlPending ? (
                                <button
                                    type="button"
                                    disabled
                                    className="rounded-xl bg-[var(--brand-raspberry)] px-5 py-3 text-sm font-semibold text-white opacity-60"
                                >
                                    {result.cta.label}
                                </button>
                            ) : (
                                <a
                                    href={result.cta.url}
                                    className="ppc-primary-btn inline-flex items-center rounded-xl bg-[var(--brand-raspberry)] px-5 py-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                                >
                                    {result.cta.label}
                                </a>
                            )}

                            <button
                                type="button"
                                onClick={onRestart}
                                className="fp-tap rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] transition hover:bg-[var(--card-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                            >
                                Restart
                            </button>
                        </div>

                        {bookingUrlPending ? (
                            <p className="mt-3 text-xs text-[var(--foreground-muted)]">
                                Booking URL placeholder is still pending in config.
                            </p>
                        ) : null}
                    </div>
                </div>
            </div>
        </section>
    );
}
