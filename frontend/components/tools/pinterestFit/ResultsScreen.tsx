"use client";

import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type SVGProps } from "react";

import {
    PINTEREST_FIT_LEAD_SOURCE,
    RESULT_EMAIL_GATE_COPY,
    createPinterestFitResultViewModel,
    type AssessmentResult,
    type PinterestFitBreakdownCardViewModel,
} from "@/lib/tools/pinterestFit";

type ResultsScreenProps = {
    result: AssessmentResult;
    onRestart: () => void;
    onCtaClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

type FitCallButtonProps = {
    href: string;
    label: string;
    isPending: boolean;
    variant: "primary" | "secondary";
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
    className?: string;
};

function isValidEmail(value: string) {
    return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
}

function maskPreviewText(value: string) {
    return value.replace(/[A-Za-z0-9]/g, "•");
}

function SparkleIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M12 3.5l1.8 4.7L18.5 10l-4.7 1.8L12 16.5l-1.8-4.7L5.5 10l4.7-1.8L12 3.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M18.5 3.5l.8 2.1 2.2.9-2.2.8-.8 2.2-.9-2.2-2.1-.8 2.1-.9.9-2.1Z"
                fill="currentColor"
            />
        </svg>
    );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path
                d="M5.5 8l6.5 5L18.5 8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function LockIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <rect x="5.5" y="10.5" width="13" height="9" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path
                d="M8.5 10.5V8.8a3.5 3.5 0 017 0v1.7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="14.8" r="1.1" fill="currentColor" />
        </svg>
    );
}

function CalendarIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="M7.5 3.8v3.3M16.5 3.8v3.3M3.5 9.5h17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M5 12h14m0 0-4.5-4.5M19 12l-4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function StarIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M12 4.5l2.2 4.6 5.1.8-3.7 3.6.9 5.1-4.5-2.4-4.5 2.4.9-5.1-3.7-3.6 5.1-.8L12 4.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function PersonIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.8" />
            <path
                d="M5 18.5c1.5-3 4.1-4.5 7-4.5s5.5 1.5 7 4.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

function RocketIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
            <path
                d="M14.5 4.5c2.9 0 5 2.1 5 5 0 4.4-3.6 8-8 8H8.2l-3.7 2 .9-3.6V12.5c0-4.4 3.6-8 8-8h1.1Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="14.6" cy="9.4" r="1.4" fill="currentColor" />
        </svg>
    );
}

function FitCallButton({ href, label, isPending, variant, onClick, className = "" }: FitCallButtonProps) {
    const buttonClassName =
        variant === "primary"
            ? "assessment-primary-cta w-full px-5 py-3.5 text-base font-semibold sm:w-auto sm:min-w-[16rem] sm:text-lg"
            : "assessment-secondary-cta w-full px-5 py-3.5 text-base font-semibold sm:w-auto sm:min-w-[16rem] sm:text-lg";

    const content = (
        <>
            <CalendarIcon className="h-5 w-5 shrink-0" />
            <span>{label}</span>
            <ArrowRightIcon className="h-5 w-5 shrink-0" />
        </>
    );

    if (isPending) {
        return (
            <button type="button" disabled className={`${buttonClassName} ${className} opacity-60`}>
                {content}
            </button>
        );
    }

    return (
        <a href={href} onClick={onClick} className={`${buttonClassName} ${className}`}>
            {content}
        </a>
    );
}

function cardIcon(card: PinterestFitBreakdownCardViewModel) {
    switch (card.id) {
        case "reasons":
            return {
                Icon: StarIcon,
                badgeClassName:
                    "bg-[color-mix(in_srgb,var(--brand-raspberry)_18%,transparent)] text-[color-mix(in_srgb,var(--brand-raspberry)_72%,white)]",
            };
        case "role":
            return {
                Icon: PersonIcon,
                badgeClassName:
                    "bg-[color-mix(in_srgb,var(--brand-bronze)_18%,transparent)] text-[color-mix(in_srgb,var(--brand-bronze)_78%,white)]",
            };
        case "next_step":
            return {
                Icon: RocketIcon,
                badgeClassName:
                    "bg-[color-mix(in_srgb,#6d28d9_18%,transparent)] text-[color-mix(in_srgb,#d78bff_82%,white)]",
            };
    }
}

function BreakdownCard({ card, isUnlocked }: { card: PinterestFitBreakdownCardViewModel; isUnlocked: boolean }) {
    const { Icon, badgeClassName } = cardIcon(card);

    const renderUnlockedContent = () => {
        if (card.kind === "list") {
            return (
                <ol className="mt-4 space-y-2.5">
                    {card.items.map((item, index) => (
                        <li key={item} className="flex items-start gap-3">
                            <span
                                aria-hidden="true"
                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--brand-raspberry)_18%,transparent)] text-sm font-semibold text-[color-mix(in_srgb,var(--brand-raspberry)_76%,white)]"
                            >
                                {index + 1}
                            </span>
                            <span className="pt-0.5 text-[0.98rem] leading-7 text-[var(--foreground)]">{item}</span>
                        </li>
                    ))}
                </ol>
            );
        }

        if (card.kind === "callout") {
            return (
                <div className="mt-4 space-y-2.5">
                    <p className="text-[1.02rem] font-semibold leading-7 text-[var(--foreground)]">{card.heading}</p>
                    <p className="text-[0.98rem] leading-7 text-[var(--assessment-copy-soft)]">{card.body}</p>
                </div>
            );
        }

        return <p className="mt-4 text-[0.98rem] leading-7 text-[var(--assessment-copy-soft)]">{card.body}</p>;
    };

    const renderLockedContent = () => {
        if (card.kind === "list") {
            return (
                <ol className="assessment-preview-mask mt-4 space-y-2.5" aria-hidden="true">
                    {card.items.map((item, index) => (
                        <li key={`${card.id}-${index}`} className="flex items-start gap-3">
                            <span
                                aria-hidden="true"
                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--brand-raspberry)_18%,transparent)] text-sm font-semibold text-[color-mix(in_srgb,var(--brand-raspberry)_76%,white)]"
                            >
                                {index + 1}
                            </span>
                            <span className="pt-0.5 text-[0.98rem] leading-7 text-[var(--assessment-copy-soft)]">
                                {maskPreviewText(item)}
                            </span>
                        </li>
                    ))}
                </ol>
            );
        }

        if (card.kind === "callout") {
            return (
                <div className="assessment-preview-mask mt-4 space-y-2.5" aria-hidden="true">
                    <p className="text-[1.02rem] font-semibold leading-7 text-[var(--foreground)]">{maskPreviewText(card.heading)}</p>
                    <p className="text-[0.98rem] leading-7 text-[var(--assessment-copy-soft)]">{maskPreviewText(card.body)}</p>
                </div>
            );
        }

        return (
            <p className="assessment-preview-mask mt-4 text-[0.98rem] leading-7 text-[var(--assessment-copy-soft)]" aria-hidden="true">
                {maskPreviewText(card.body)}
            </p>
        );
    };

    return (
        <article className="assessment-preview-card assessment-card relative rounded-[1.4rem] p-4 sm:p-5">
            <div className="relative z-10 flex items-start gap-4">
                <span
                    aria-hidden="true"
                    className={`assessment-icon-badge h-14 w-14 shrink-0 ${badgeClassName}`}
                >
                    <Icon className="h-6 w-6" />
                </span>

                <div className="min-w-0 flex-1">
                    <h4 className="font-heading text-[1.42rem] leading-[0.98] text-[var(--foreground)] sm:text-[1.58rem]">
                        {card.title}
                    </h4>
                    {isUnlocked ? renderUnlockedContent() : renderLockedContent()}
                </div>
            </div>

            {isUnlocked ? null : (
                <>
                    <div className="assessment-preview-overlay" />
                    <div className="absolute inset-x-4 bottom-4 z-20 flex justify-center sm:inset-x-5 sm:bottom-5">
                        <span className="assessment-lock-badge px-4 py-2 text-sm font-medium text-[var(--foreground)]">
                            <LockIcon className="h-4 w-4" />
                            Unlock to view
                        </span>
                    </div>
                </>
            )}
        </article>
    );
}

export function ResultsScreen({ result, onRestart, onCtaClick }: ResultsScreenProps) {
    const viewModel = createPinterestFitResultViewModel(result);
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
    const breakdownRef = useRef<HTMLDivElement | null>(null);

    const emailHeading = isUnlocked ? RESULT_EMAIL_GATE_COPY.unlockedHeading : RESULT_EMAIL_GATE_COPY.heading;

    useEffect(() => {
        if (!isUnlocked || !breakdownRef.current) {
            return;
        }

        const prefersReducedMotion =
            typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        breakdownRef.current.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
        });
    }, [isUnlocked]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedEmail = email.trim();
        if (!isValidEmail(trimmedEmail)) {
            setEmailError(RESULT_EMAIL_GATE_COPY.validationMessage);
            return;
        }

        setIsSubmittingEmail(true);

        try {
            const response = await fetch("/api/tools/pinterest-fit-assessment/lead", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: trimmedEmail,
                    result: viewModel.label,
                    source: PINTEREST_FIT_LEAD_SOURCE,
                }),
            });

            if (!response.ok) {
                throw new Error("Email capture failed");
            }

            setEmail(trimmedEmail);
            setEmailError(null);
            setIsUnlocked(true);
        } catch {
            setEmailError(RESULT_EMAIL_GATE_COPY.submitErrorMessage);
        } finally {
            setIsSubmittingEmail(false);
        }
    };

    return (
        <section className="assessment-results-stage pfa-screen-enter space-y-4 sm:space-y-5">
            <div className="assessment-results-hero assessment-card relative px-4 py-5 sm:px-6 sm:py-6">
                <div className="relative z-10">
                    <span className="assessment-chip px-4 py-2 text-base font-medium text-[var(--foreground)] sm:px-5 sm:py-2.5 sm:text-lg">
                        <SparkleIcon className="h-5 w-5 text-[color-mix(in_srgb,var(--brand-bronze)_78%,white)]" />
                        {viewModel.label}
                    </span>

                    <div className="mt-5 max-w-[46rem]">
                        <h2 className="font-heading text-[2.82rem] leading-[0.94] tracking-[-0.03em] text-[var(--foreground)] sm:text-[4rem]">
                            {viewModel.headline}
                        </h2>
                        <p className="mt-4 max-w-[38rem] text-[1rem] leading-7 text-[var(--assessment-copy-soft)] sm:text-[1.22rem] sm:leading-[1.75]">
                            {viewModel.intro}
                        </p>
                    </div>

                    <div className="mt-6 sm:mt-7">
                        <FitCallButton
                            href={viewModel.ctaUrl}
                            label={viewModel.ctaLabel}
                            isPending={viewModel.bookingUrlPending}
                            onClick={onCtaClick}
                            variant="primary"
                        />
                    </div>
                </div>
            </div>

            <div className="assessment-card px-4 py-5 sm:px-6 sm:py-6">
                <form className="relative z-10 space-y-4" onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <span
                            aria-hidden="true"
                            className="assessment-icon-badge h-16 w-16 shrink-0 bg-[color-mix(in_srgb,var(--brand-raspberry)_16%,transparent)] text-[color-mix(in_srgb,var(--brand-raspberry)_78%,white)] sm:h-20 sm:w-20"
                        >
                            <MailIcon className="h-9 w-9" />
                        </span>

                        <div className="max-w-[38rem]">
                            <h3 className="font-heading text-[2rem] leading-[0.95] text-[var(--foreground)] sm:text-[2.6rem]">
                                {emailHeading}
                            </h3>
                            <p className="mt-2.5 max-w-[36rem] text-[1rem] leading-7 text-[var(--assessment-copy-soft)] sm:text-[1.08rem]">
                                {RESULT_EMAIL_GATE_COPY.body}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <label htmlFor="pfa-email" className="sr-only">
                            Email
                        </label>
                        <input
                            id="pfa-email"
                            type="email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                if (emailError) {
                                    setEmailError(null);
                                }
                            }}
                            placeholder={RESULT_EMAIL_GATE_COPY.placeholder}
                            autoComplete="email"
                            inputMode="email"
                            disabled={isSubmittingEmail || isUnlocked}
                            className="assessment-input px-4 py-3.5 text-[1rem] text-[var(--foreground)] outline-none transition focus:border-[color-mix(in_srgb,var(--brand-raspberry)_48%,var(--border))] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--brand-raspberry)_16%,transparent)] sm:text-[1.05rem]"
                            aria-invalid={emailError ? "true" : "false"}
                            aria-describedby={emailError ? "pfa-email-error" : undefined}
                            required
                        />

                        {emailError ? (
                            <p id="pfa-email-error" className="text-sm text-[var(--brand-rust)]">
                                {emailError}
                            </p>
                        ) : null}
                    </div>

                    <div className="space-y-2.5">
                        <button
                            type="submit"
                            disabled={isSubmittingEmail || isUnlocked}
                            className="assessment-primary-cta w-full px-5 py-3.5 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-70 sm:text-lg"
                        >
                            <LockIcon className="h-5 w-5 shrink-0" />
                            <span>{isSubmittingEmail ? "Unlocking..." : RESULT_EMAIL_GATE_COPY.buttonLabel}</span>
                        </button>

                        <p className="flex items-center gap-2 text-sm leading-6 text-[var(--assessment-copy-strong)]">
                            <LockIcon className="h-4 w-4 shrink-0" />
                            <span>{RESULT_EMAIL_GATE_COPY.trustNote}</span>
                        </p>
                    </div>
                </form>
            </div>

            <div ref={breakdownRef} className="assessment-card px-4 py-5 sm:px-6 sm:py-6">
                <div className="relative z-10">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="assessment-kicker">
                                <SparkleIcon className="h-4 w-4" />
                                {isUnlocked ? "Unlocked" : viewModel.breakdownUnlockLabel}
                            </div>
                            <h3 className="mt-2.5 font-heading text-[2.02rem] leading-[0.96] text-[var(--foreground)] sm:text-[2.6rem]">
                                {viewModel.breakdownTitle}
                            </h3>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
                        {viewModel.breakdownCards.map((card) => (
                            <BreakdownCard key={card.id} card={card} isUnlocked={isUnlocked} />
                        ))}
                    </div>

                    <div className="mt-5">
                        <FitCallButton
                            href={viewModel.ctaUrl}
                            label={viewModel.ctaLabel}
                            isPending={viewModel.bookingUrlPending}
                            onClick={onCtaClick}
                            variant="secondary"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 px-1">
                <p className="max-w-[38rem] text-sm leading-6 text-[var(--assessment-copy-strong)]">
                    {isUnlocked
                        ? "Your personalized breakdown is fully unlocked."
                        : "Unlock the full breakdown to reveal the personalized details behind your result."}
                </p>

                <button
                    type="button"
                    onClick={onRestart}
                    className="fp-tap rounded-xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--background)_70%,transparent)] px-4 py-2.5 text-base text-[var(--foreground)] transition hover:bg-[var(--card-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                >
                    {viewModel.restartLabel}
                </button>
            </div>
        </section>
    );
}
