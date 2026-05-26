"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  PINTEREST_FIT_ASSESSMENT_QUESTIONS,
  scorePinterestFitAssessment,
  type PinterestFitAssessmentAnswers,
} from "@/lib/fitAssessment";
import { SubscribeForm } from "@/components/SubscribeForm";
import { BOOKING_URL, FIT_CALL_LABEL } from "@/lib/site";

type PinterestFitAssessmentEmbedProps = {
  intro?: "full" | "buttonOnly";
};

export function PinterestFitAssessmentEmbed({ intro = "full" }: PinterestFitAssessmentEmbedProps) {
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

  function getAnswerLabel(questionId: string) {
    const selectedId = answers[questionId];
    const question = PINTEREST_FIT_ASSESSMENT_QUESTIONS.find((item) => item.id === questionId);
    const option = question?.options.find((item) => item.id === selectedId);

    return option?.label ?? "";
  }

  if (!started && intro === "buttonOnly") {
    return (
      <section className="fit-assessment-card zoom-on-scroll" aria-labelledby="fit-assessment-start-title">
        <p className="eyebrow">Start the check</p>
        <h2 id="fit-assessment-start-title" className="brand-display mt-3 headline-card text-[var(--heading)]">
          Take the Pinterest Fit Check
        </h2>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          Seven quick questions. An immediate result. The option to save it by email after you see it.
        </p>
        <button className="button-primary mt-6 inline-flex min-h-12 items-center justify-center px-6" type="button" onClick={() => setStarted(true)}>
          Start the Fit Check
        </button>
      </section>
    );
  }

  if (!started) {
    return (
      <section className="fit-assessment-card zoom-on-scroll" aria-labelledby="fit-assessment-title">
        <p className="eyebrow">Pinterest Fit Check</p>
        <h2 id="fit-assessment-title" className="brand-display mt-3 headline-card text-[var(--heading)]">
          See if Pinterest is worth building around right now.
        </h2>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          Answer seven quick questions about your offer, content, website, and goals. You&apos;ll get an immediate direction, with the option to send your result to your inbox.
        </p>
        <div className="fit-assessment-mini-list mt-5" aria-label="Assessment details">
          <span>Takes about 2 minutes</span>
          <span>Immediate result</span>
          <span>Option to save by email</span>
        </div>
        <button className="button-primary mt-6 inline-flex min-h-12 items-center justify-center px-6" type="button" onClick={() => setStarted(true)}>
          Start the Fit Check
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
        <h2 id="fit-result-title" className="brand-display mt-3 headline-card text-[var(--heading)]">
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
        <div className="fit-assessment-email-save mt-6">
          <h3 className="headline-compact text-[var(--heading)]">Want to keep this result?</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            I&apos;ll send your Pinterest Fit Check result to your inbox, along with a simple next-step note so you can revisit whether Pinterest is worth building, fixing, or saving for later.
          </p>
          <SubscribeForm
            formType="fit-check"
            buttonLabel="Send my result"
            successMessage="Saved. Your result is on the list for Fruitful Pin follow-up."
            includeWebsite
            emailPlaceholder="Email address"
            className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
            buttonClassName="button-primary min-h-11 px-5"
            fields={{
              fit_result: result.outcome.label,
              fit_score: result.totalScore,
              fit_max_score: result.maxScore,
              fit_goal: getAnswerLabel("goal"),
              fit_offer_readiness: getAnswerLabel("proof"),
              fit_content_readiness: getAnswerLabel("assets"),
              fit_website_readiness: getAnswerLabel("website"),
              fit_support_interest: getAnswerLabel("support"),
              fit_ads_interest: getAnswerLabel("ads"),
            }}
          />
          <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
            You&apos;ll also get occasional Pinterest strategy notes from Fruitful Pin. Unsubscribe anytime.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="button-primary inline-flex min-h-11 items-center justify-center px-5" href={BOOKING_URL}>
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
      <h2 id="fit-question-title" className="brand-display mt-5 headline-card text-[var(--heading)]">
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
        <button className="button-primary inline-flex min-h-11 items-center justify-center px-5" type="button" onClick={goNext} disabled={!selectedOptionId}>
          {questionIndex === PINTEREST_FIT_ASSESSMENT_QUESTIONS.length - 1 ? "See result" : "Next"}
        </button>
      </div>
    </section>
  );
}
