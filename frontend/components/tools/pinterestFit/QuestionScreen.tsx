"use client";

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

export function QuestionScreen({ question, selectedValue, onBack, onSelect }: QuestionScreenProps) {
    const progressPercent = getProgressPercent(question.step);

    return (
        <section className="ppc-hero-frame relative">
            <div aria-hidden="true" className="ppc-hero-sheen" />
            <div aria-hidden="true" className="ppc-hero-noise" />

            <div className="relative z-10 p-6 sm:p-8">
                <div className="mb-6">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <span className="ppc-chip inline-flex items-center px-3 py-1 text-xs text-[var(--foreground-muted)]">
                            Question {question.step} of {QUESTION_COUNT}
                        </span>
                        <span className="text-xs tabular-nums text-[var(--foreground-muted)]">{progressPercent}%</span>
                    </div>

                    <div
                        className="h-2 w-full overflow-hidden rounded-full bg-[var(--background)]"
                        role="progressbar"
                        aria-label={`Question ${question.step} of ${QUESTION_COUNT}`}
                        aria-valuemin={1}
                        aria-valuemax={QUESTION_COUNT}
                        aria-valuenow={question.step}
                    >
                        <div
                            className="h-full rounded-full transition-[width] duration-300 motion-reduce:transition-none"
                            style={{
                                width: `${progressPercent}%`,
                                background: "linear-gradient(90deg, var(--brand-raspberry), var(--brand-bronze))",
                            }}
                        />
                    </div>
                </div>

                <div className="max-w-3xl">
                    <p className="text-sm text-[var(--foreground-muted)]">Choose the option that fits best.</p>
                    <h2 className="mt-2 font-heading text-2xl leading-tight text-[var(--foreground)] sm:text-3xl">
                        {question.prompt}
                    </h2>
                </div>

                <div className="mt-6 grid gap-3">
                    {question.options.map((option, index) => {
                        const isSelected = option.value === selectedValue;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => onSelect(option.value)}
                                aria-pressed={isSelected}
                                className={[
                                    "fp-tap group w-full rounded-2xl border p-4 text-left transition",
                                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)]",
                                    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                                    isSelected
                                        ? [
                                              "border-[color-mix(in_srgb,var(--brand-raspberry)_55%,var(--border))]",
                                              "bg-[color-mix(in_srgb,var(--brand-raspberry)_10%,var(--card))]",
                                              "shadow-[0_0_0_1px_color-mix(in_srgb,var(--brand-raspberry)_18%,transparent)_inset]",
                                          ].join(" ")
                                        : "border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)]",
                                ].join(" ")}
                            >
                                <div className="flex items-start gap-3">
                                    <span
                                        aria-hidden="true"
                                        className={[
                                            "mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full border text-xs font-semibold",
                                            isSelected
                                                ? "border-[var(--brand-raspberry)] bg-[var(--brand-raspberry)] text-white"
                                                : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground-muted)]",
                                        ].join(" ")}
                                    >
                                        {index + 1}
                                    </span>

                                    <div className="flex-1">
                                        <div className="text-sm leading-6 text-[var(--foreground)] sm:text-base">
                                            {option.label}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        className="fp-tap rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm text-[var(--foreground)] transition hover:bg-[var(--card-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-raspberry)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
                    >
                        Back
                    </button>

                    <p className="text-sm text-[var(--foreground-muted)]">Select an answer to continue.</p>
                </div>
            </div>
        </section>
    );
}
