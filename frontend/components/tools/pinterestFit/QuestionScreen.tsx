"use client";

import type { SVGProps } from "react";

import { QUESTION_COUNT, type AssessmentAnswerValue, type AssessmentQuestion } from "@/lib/tools/pinterestFit";

type QuestionScreenProps = {
    question: AssessmentQuestion;
    selectedValue?: AssessmentAnswerValue;
    onBack: () => void;
    onSelect: (value: AssessmentAnswerValue) => void;
};

function getProgressPercent(step: number) {
    return Math.round((step / QUESTION_COUNT) * 100);
}

function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
            <path
                d="M12.5 4.5 7 10l5.5 5.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function BoltIcon(props: SVGProps<SVGSVGElement>) {
    return (
        <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
            <path
                d="M11.2 2.8 5.8 10h3.4L8.8 17.2l5.4-7.2h-3.4l.4-7.2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function QuestionScreen({ question, selectedValue, onBack, onSelect }: QuestionScreenProps) {
    const progressPercent = getProgressPercent(question.step);

    return (
        <section className="assessment-stage-card assessment-stage-card--question pfa-screen-enter relative">
            <div aria-hidden="true" className="assessment-stage-noise" />

            <div
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-0 h-56 w-56 rounded-full opacity-20 blur-3xl"
                style={{ background: "color-mix(in srgb, var(--brand-bronze) 36%, transparent)" }}
            />

            <div className="assessment-stage-grid">
                <div className="assessment-progress-wrap">
                    <div className="assessment-progress-meta">
                        <span className="assessment-stage-chip px-4 py-2 text-sm font-medium text-[var(--foreground)] sm:text-base">
                            Question {question.step} of {QUESTION_COUNT}
                        </span>
                        <span className="text-sm font-medium tabular-nums text-[var(--foreground-muted)] sm:text-base">
                            {progressPercent}%
                        </span>
                    </div>

                    <div
                        className="assessment-progress-track"
                        role="progressbar"
                        aria-label={`Question ${question.step} of ${QUESTION_COUNT}`}
                        aria-valuemin={1}
                        aria-valuemax={QUESTION_COUNT}
                        aria-valuenow={question.step}
                    >
                        <div
                            className="assessment-progress-fill pfa-progress-fill transition-[width] duration-500 motion-reduce:transition-none"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <div className="mt-7 max-w-4xl">
                    <p className="text-sm font-medium uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--brand-bronze)_66%,white)] sm:text-base">
                        Choose the option that fits best
                    </p>
                    <h2 className="mt-4 font-heading text-[3rem] leading-[0.96] tracking-[-0.03em] text-white sm:text-[4rem]">
                        {question.prompt}
                    </h2>
                </div>

                <div className="mt-7 grid gap-3.5 sm:mt-8">
                    {question.options.map((option, index) => {
                        const isSelected = option.value === selectedValue;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => onSelect(option.value)}
                                aria-pressed={isSelected}
                                className={[
                                    "assessment-answer-card pfa-option fp-tap group p-4 text-left sm:p-5",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)]",
                                    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                                    isSelected ? "assessment-answer-card-selected pfa-option-selected" : "",
                                ].join(" ")}
                            >
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <span
                                        aria-hidden="true"
                                        className={[
                                            "assessment-answer-index mt-0.5 shrink-0 text-sm font-semibold transition",
                                            isSelected ? "assessment-answer-index-selected" : "",
                                        ].join(" ")}
                                    >
                                        {index + 1}
                                    </span>

                                    <div className="min-w-0 flex-1">
                                        <div className="text-[1.02rem] leading-7 text-[var(--foreground)] sm:text-[1.2rem] sm:leading-8">
                                            {option.label}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center sm:justify-between">
                    <button
                        type="button"
                        onClick={onBack}
                        className="assessment-ghost-button fp-tap px-4 py-3 text-base font-medium text-[var(--foreground)]"
                    >
                        <ChevronLeftIcon className="h-4 w-4 shrink-0" />
                        <span>Back</span>
                    </button>

                    <div className="assessment-muted-panel inline-flex items-center gap-2 px-4 py-3 text-sm text-[var(--foreground-muted)] sm:text-base">
                        <BoltIcon className="h-4 w-4 shrink-0 text-[color-mix(in_srgb,var(--brand-bronze)_74%,white)]" />
                        <span>Select an answer to continue.</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
