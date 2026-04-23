"use client";

import type { SVGProps } from "react";

import { INTRO_COPY } from "@/lib/tools/pinterestFit";

type IntroScreenProps = {
    onStart: () => void;
};

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

function ArrowIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
            <path
                d="M4.5 10h10m0 0-4-4m4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function ClockIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
            <circle cx="10" cy="10" r="6.8" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10 6.8v3.6l2.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
    );
}

export function IntroScreen({ onStart }: IntroScreenProps) {
    return (
        <section className="assessment-stage-card assessment-stage-card--hero pfa-screen-enter relative">
            <div aria-hidden="true" className="assessment-stage-noise" />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full opacity-30 blur-3xl"
                style={{ background: "color-mix(in srgb, var(--brand-bronze) 48%, transparent)" }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full opacity-24 blur-3xl"
                style={{ background: "color-mix(in srgb, var(--brand-raspberry) 54%, transparent)" }}
            />

            <div className="assessment-stage-grid">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="assessment-stage-chip px-4 py-2 text-sm font-medium text-[var(--foreground)] sm:text-base">
                        <SparkleIcon className="h-4 w-4 text-[color-mix(in_srgb,var(--brand-bronze)_78%,white)]" />
                        Pinterest Fit Assessment
                    </span>
                </div>

                <div className="mt-7 max-w-4xl">
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-[color-mix(in_srgb,var(--brand-bronze)_70%,white)] sm:text-base">
                        {INTRO_COPY.supportLine}
                    </p>
                    <h1 className="mt-4 font-heading text-[3.4rem] leading-[0.94] tracking-[-0.03em] text-white sm:text-[4.8rem]">
                        {INTRO_COPY.title}
                    </h1>
                    <p className="mt-5 max-w-3xl text-[1.08rem] leading-8 text-[color-mix(in_srgb,var(--foreground-muted)_88%,white_12%)] sm:text-[1.32rem]">
                        {INTRO_COPY.subtitle}
                    </p>
                </div>

                <div className="mt-8 flex flex-col items-start gap-4 sm:mt-10">
                    <button
                        type="button"
                        onClick={onStart}
                        className="assessment-primary-cta w-full px-5 py-4 text-lg font-semibold text-white sm:w-auto sm:min-w-[18rem]"
                    >
                        <span>{INTRO_COPY.primaryButtonLabel}</span>
                        <ArrowIcon className="h-5 w-5 shrink-0" />
                    </button>

                    <div className="assessment-hero-note assessment-muted-panel px-4 py-2.5 text-sm sm:text-base">
                        <ClockIcon className="h-4 w-4 shrink-0" />
                        <span>{INTRO_COPY.durationNote}</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
