"use client";

import { useMemo, useState, type FormEvent, type MouseEvent } from "react";

import { createPinterestFitResultViewModel, type AssessmentResult } from "@/lib/tools/pinterestFit";

type ResultsScreenProps = {
    result: AssessmentResult;
    onRestart: () => void;
    onCtaClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

type LeadDraft = {
    email: string;
    firstName: string;
};

function isValidEmail(value: string) {
    return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
}

export function ResultsScreen({ result, onRestart, onCtaClick }: ResultsScreenProps) {
    const viewModel = createPinterestFitResultViewModel(result);
    const [leadDraft, setLeadDraft] = useState<LeadDraft>({ email: "", firstName: "" });
    const [emailError, setEmailError] = useState<string | null>(null);
    const [isUnlocked, setIsUnlocked] = useState(false);

    const emailHeading = useMemo(() => {
        if (isUnlocked) {
            return "Your full breakdown is unlocked";
        }

        return "Want your full breakdown sent to your inbox?";
    }, [isUnlocked]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedEmail = leadDraft.email.trim();
        if (!isValidEmail(trimmedEmail)) {
            setEmailError("Enter a valid email to unlock your full result.");
            return;
        }

        setLeadDraft((current) => ({ ...current, email: trimmedEmail, firstName: current.firstName.trim() }));
        setEmailError(null);
        setIsUnlocked(true);
    };

    const ctaClassName =
        "ppc-primary-btn inline-flex items-center justify-center rounded-xl bg-[var(--brand-raspberry)] px-5 py-3.5 text-base font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]";

    return (
        <section className="pfa-screen-enter space-y-5">
            <div className="ppc-hero-frame relative overflow-hidden">
                <div aria-hidden="true" className="ppc-hero-sheen" />
                <div aria-hidden="true" className="ppc-hero-noise" />

                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-44 opacity-90"
                    style={{
                        background:
                            "linear-gradient(180deg, color-mix(in srgb, var(--brand-raspberry) 16%, transparent) 0%, transparent 100%)",
                    }}
                />

                <div className="relative z-10 p-7 sm:p-9">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="ppc-chip inline-flex items-center px-3 py-1 text-sm text-[var(--foreground-muted)]">
                            {viewModel.label}
                        </span>
                    </div>

                    <div className="mt-6 max-w-3xl">
                        <h2 className="font-heading text-4xl leading-tight text-[var(--foreground)] sm:text-5xl">
                            {viewModel.headline}
                        </h2>
                        <p className="mt-4 text-lg leading-8 text-[var(--foreground-muted)]">{viewModel.intro}</p>
                    </div>

                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        {viewModel.bookingUrlPending ? (
                            <button type="button" disabled className={`${ctaClassName} opacity-60`}>
                                {viewModel.ctaLabel}
                            </button>
                        ) : (
                            <a href={viewModel.ctaUrl} onClick={onCtaClick} className={ctaClassName}>
                                {viewModel.ctaLabel}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="rounded-[1.35rem] border border-[var(--border)] bg-[color-mix(in_srgb,var(--card)_72%,white)] p-6 sm:p-7">
                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                    <div className="max-w-3xl">
                        <h3 className="font-heading text-2xl text-[var(--foreground)] sm:text-3xl">{emailHeading}</h3>
                        <p className="mt-3 text-base leading-7 text-[var(--foreground-muted)] sm:text-lg">
                            Enter your email to unlock your full result, including your top 3 reasons and what
                            Pinterest’s best role could be for your brand.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-[var(--foreground)]">Email</span>
                            <input
                                type="email"
                                value={leadDraft.email}
                                onChange={(event) => {
                                    setLeadDraft((current) => ({ ...current, email: event.target.value }));
                                    if (emailError) {
                                        setEmailError(null);
                                    }
                                }}
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[color-mix(in_srgb,var(--brand-raspberry)_45%,var(--border))] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand-raspberry)_15%,transparent)]"
                                aria-invalid={emailError ? "true" : "false"}
                                aria-describedby={emailError ? "pfa-email-error" : undefined}
                                required
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-[var(--foreground)]">First name</span>
                            <input
                                type="text"
                                value={leadDraft.firstName}
                                onChange={(event) =>
                                    setLeadDraft((current) => ({ ...current, firstName: event.target.value }))
                                }
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-base text-[var(--foreground)] outline-none transition focus:border-[color-mix(in_srgb,var(--brand-raspberry)_45%,var(--border))] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand-raspberry)_15%,transparent)]"
                            />
                        </label>
                    </div>

                    {emailError ? (
                        <p id="pfa-email-error" className="text-sm text-[var(--brand-rust)]">
                            {emailError}
                        </p>
                    ) : null}

                    <div className="flex flex-wrap items-center gap-3">
                        <button type="submit" className={ctaClassName}>
                            Unlock My Full Result
                        </button>
                        <p className="text-sm text-[var(--foreground-muted)]">We’ll send you a copy of your result too. No spam.</p>
                    </div>
                </form>
            </div>

            {isUnlocked ? (
                <div className="pfa-section-reveal grid gap-5">
                    <div className="rounded-[1.35rem] border border-[color-mix(in_srgb,var(--brand-bronze)_26%,var(--border))] bg-[color-mix(in_srgb,var(--brand-bronze)_10%,var(--card))] p-6 sm:p-7">
                        <div className="max-w-3xl">
                            <h3 className="font-heading text-2xl text-[var(--foreground)] sm:text-3xl">{viewModel.ctaTitle}</h3>

                            {viewModel.ctaCaption ? (
                                <p className="mt-3 text-lg font-medium leading-7 text-[var(--foreground)]">{viewModel.ctaCaption}</p>
                            ) : null}

                            <p className="mt-3 text-base leading-7 text-[var(--foreground-muted)] sm:text-lg">{viewModel.ctaSubtext}</p>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            {viewModel.bookingUrlPending ? (
                                <button type="button" disabled className={`${ctaClassName} opacity-60`}>
                                    {viewModel.ctaLabel}
                                </button>
                            ) : (
                                <a href={viewModel.ctaUrl} onClick={onCtaClick} className={ctaClassName}>
                                    {viewModel.ctaLabel}
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-7">
                        <h3 className="font-heading text-2xl text-[var(--foreground)] sm:text-3xl">Top 3 reasons</h3>
                        <div className="mt-5 grid gap-3">
                            {viewModel.reasons.map((reason, index) => (
                                <div
                                    key={reason}
                                    className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_78%,transparent)] p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <span
                                            aria-hidden="true"
                                            className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full text-sm font-semibold text-white"
                                            style={{ background: "linear-gradient(135deg, var(--brand-raspberry), var(--brand-bronze))" }}
                                        >
                                            {index + 1}
                                        </span>
                                        <p className="text-base leading-7 text-[var(--foreground)] sm:text-lg">{reason}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[1.35rem] border border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_76%,transparent)] p-6 sm:p-7">
                        <h3 className="font-heading text-2xl text-[var(--foreground)] sm:text-3xl">{viewModel.roleTitle}</h3>
                        <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--foreground-muted)] sm:text-lg">
                            {viewModel.roleCopy}
                        </p>
                    </div>
                </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <p className="text-sm text-[var(--foreground-muted)]">
                    {isUnlocked ? "Your detailed breakdown is ready below." : "Unlock the full breakdown to see your top reasons and best-fit role."}
                </p>

                <button
                    type="button"
                    onClick={onRestart}
                    className="fp-tap rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-base text-[var(--foreground)] transition hover:bg-[var(--card-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                >
                    {viewModel.restartLabel}
                </button>
            </div>
        </section>
    );
}
