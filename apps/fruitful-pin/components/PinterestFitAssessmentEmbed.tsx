"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  PINTEREST_FIT_ASSESSMENT_QUESTIONS,
  scorePinterestFitAssessment,
  type PinterestFitAssessmentAnswers,
} from "@/lib/fitAssessment";
import { BOOKING_URL, FIT_CALL_LABEL } from "@/lib/site";

export function PinterestFitAssessmentEmbed() {
  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<PinterestFitAssessmentAnswers>({});

  const result = useMemo(() => scorePinterestFitAssessment(answers), [answers]);
  const currentQuestion = PINTEREST_FIT_ASSESSMENT_QUESTIONS[questionIndex];
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isComplete = questionIndex >= PINTEREST_FIT_ASSESSMENT_QUESTIONS.length;
  const progress = Math.round((result.answeredCount / PINTEREST_FIT_ASSESSMENT_QUESTIONS.length) * 100);

  function chooseAnswer(questionId: string, optionId: string) {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [questionId]: optionId }));
  }

  function goNext() {
    if (!selectedOptionId) {
      return;
    }

    setQuestionIndex((current) => Math.min(current + 1, PINTEREST_FIT_ASSESSMENT_QUESTIONS.length));
  }

  function restart() {
    setStarted(false);
    setQuestionIndex(0);
    setAnswers({});
  }

  if (!started) {
    return (
      <section className="fit-assessment-card zoom-on-scroll" aria-labelledby="fit-assessment-title">
        <p className="eyebrow">Pinterest Fit Check</p>
        <h2 id="fit-assessment-title" className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)]">
          See if Pinterest is worth building around right now.
        </h2>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          Answer seven quick questions about your offer, content, website, and goals. You will get a simple direction before you choose the next Pinterest move.
        </p>
        <div className="fit-assessment-mini-list mt-5" aria-label="Assessment details">
          <span>Immediate result</span>
          <span>No email required</span>
          <span>Built for real business paths</span>
        </div>
        <button className="button-primary mt-6 inline-flex min-h-12 items-center justify-center rounded-md px-6 text-sm font-semibold" type="button" onClick={() => setStarted(true)}>
          Start the fit check
        </button>
      </section>
    );
  }

  if (isComplete) {
    return (
      <section className="fit-assessment-card fit-assessment-result-card zoom-on-scroll" aria-labelledby="fit-result-title">
        <div className="fit-assessment-score">
          <span>{result.totalScore}</span>
          <small>/{result.maxScore}</small>
        </div>
        <p className="eyebrow">{result.outcome.label}</p>
        <h2 id="fit-result-title" className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)]">
          {result.outcome.headline}
        </h2>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{result.outcome.summary}</p>
        <ul className="fit-assessment-signals mt-5">
          {result.signals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
        <div className="fit-assessment-next-step mt-6">
          <span>Best next step</span>
          <p>{result.outcome.nextStep}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="button-primary inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold" href={BOOKING_URL}>
            {FIT_CALL_LABEL}
          </Link>
          <button className="fit-assessment-secondary-button" type="button" onClick={restart}>
            Retake
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="fit-assessment-card zoom-on-scroll" aria-labelledby="fit-question-title">
      <div className="fit-assessment-progress-row">
        <p className="eyebrow">
          Question {questionIndex + 1} of {PINTEREST_FIT_ASSESSMENT_QUESTIONS.length}
        </p>
        <span>{progress}%</span>
      </div>
      <div className="fit-assessment-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <h2 id="fit-question-title" className="brand-display mt-5 text-2xl leading-tight text-[var(--heading)]">
        {currentQuestion.question}
      </h2>
      <div className="fit-assessment-options mt-5">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            className={`fit-assessment-option${selectedOptionId === option.id ? " is-selected" : ""}`}
            type="button"
            aria-pressed={selectedOptionId === option.id}
            onClick={() => chooseAnswer(currentQuestion.id, option.id)}
          >
            <strong>{option.label}</strong>
            <span>{option.helper}</span>
          </button>
        ))}
      </div>
      <div className="fit-assessment-controls mt-6">
        <div className="fit-assessment-control-group">
          <button
            className="fit-assessment-secondary-button"
            type="button"
            onClick={() => setQuestionIndex((current) => Math.max(current - 1, 0))}
            disabled={questionIndex === 0}
          >
            Back
          </button>
          <button className="fit-assessment-text-button" type="button" onClick={restart}>
            Start over
          </button>
        </div>
        <button className="button-primary inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold" type="button" onClick={goNext} disabled={!selectedOptionId}>
          {questionIndex === PINTEREST_FIT_ASSESSMENT_QUESTIONS.length - 1 ? "See result" : "Next"}
        </button>
      </div>
    </section>
  );
}
