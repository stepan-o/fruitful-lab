"use client";

import type { SVGProps } from "react";

import { INTRO_COPY } from "@/lib/tools/pinterestFit";

type IntroScreenProps = {
    onStart: () => void;
};

function ArrowIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
            <path
                d="M7.5 4.5h8m0 0v8m0-8L5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
            />
        </svg>
    );
}

export function IntroScreen({ onStart }: IntroScreenProps) {
    return (
        <section className="ppc-hero-frame pfa-screen-enter relative overflow-hidden">
            <div aria-hidden="true" className="ppc-hero-sheen" />
            <div aria-hidden="true" className="ppc-hero-noise" />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full blur-3xl opacity-20"
                style={{ background: "var(--brand-raspberry)" }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-24 left-0 h-56 w-56 rounded-full blur-3xl opacity-15"
                style={{ background: "var(--brand-bronze)" }}
            />

            <div className="relative z-10 p-7 sm:p-9">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="ppc-chip inline-flex items-center px-3 py-1 text-xs text-[var(--foreground-muted)]">
                        Pinterest Fit Assessment
                    </span>
                </div>

                <div className="mt-6 max-w-2xl">
                    <p className="text-base text-[var(--foreground-muted)] sm:text-lg">{INTRO_COPY.supportLine}</p>
                    <h1 className="mt-3 font-heading text-4xl leading-tight text-[var(--foreground)] sm:text-5xl">
                        {INTRO_COPY.title}
                    </h1>
                    <p className="mt-5 max-w-[62ch] text-lg leading-8 text-[var(--foreground-muted)] sm:text-xl">
                        {INTRO_COPY.subtitle}
                    </p>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                    <span className="ppc-cta-wrap ppc-cta-pulse fp-tap">
                        <button
                            type="button"
                            onClick={onStart}
                            className={[
                                "ppc-primary-btn inline-flex items-center gap-2 rounded-xl bg-[var(--brand-raspberry)]",
                                "px-6 py-3.5 text-base font-semibold text-white",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)]",
                                "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                            ].join(" ")}
                        >
                            {INTRO_COPY.primaryButtonLabel}
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-white/10">
                                <ArrowIcon className="h-4 w-4" />
                            </span>
                        </button>
                    </span>

                    <p className="text-base text-[var(--foreground-muted)]">{INTRO_COPY.durationNote}</p>
                </div>
            </div>
        </section>
    );
}
