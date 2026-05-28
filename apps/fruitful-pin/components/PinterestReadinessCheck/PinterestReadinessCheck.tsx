"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  INTRO_COPY,
  PINTEREST_READINESS_CHECK_LEAD_SOURCE,
  PINTEREST_READINESS_CHECK_NAME,
  PINTEREST_READINESS_QUESTIONS,
  QUESTION_COUNT,
  QUESTION_ORDER,
  RESULT_EMAIL_GATE_COPY,
  createPinterestReadinessRunId,
  createPinterestReadinessViewModel,
  scorePinterestReadinessCheck,
  type AssessmentAnswerValue,
  type AssessmentAnswers,
  type AssessmentQuestion,
  type AssessmentResult,
  type PartialAssessmentAnswers,
  type PinterestReadinessBreakdownCard,
  type QuestionId,
} from "@/lib/pinterestReadinessCheck";

type ScreenState =
  | { kind: "intro" }
  | { kind: "question"; questionIndex: number }
  | { kind: "results" };

function isCompleteAssessmentAnswers(answers: PartialAssessmentAnswers): answers is AssessmentAnswers {
  return QUESTION_ORDER.every((questionId) => answers[questionId] !== undefined);
}

function getAnswerForQuestion(answers: PartialAssessmentAnswers, questionId: QuestionId): AssessmentAnswerValue | undefined {
  return answers[questionId];
}

function getProgressPercent(step: number) {
  return Math.round((step / QUESTION_COUNT) * 100);
}

function isValidEmail(value: string) {
  return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(value);
}

function maskPreviewText(value: string) {
  return value.replace(/[A-Za-z0-9]/g, "•");
}

function trackReadinessEvent(eventName: string, params: Record<string, string | number | boolean | undefined> = {}) {
  trackEvent(eventName, {
    check_name: PINTEREST_READINESS_CHECK_NAME,
    page_path: typeof window === "undefined" ? undefined : window.location.pathname,
    ...params,
  });
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="readiness-card readiness-card-hero reveal-on-scroll" aria-labelledby="readiness-check-intro-title">
      <p className="readiness-chip">{PINTEREST_READINESS_CHECK_NAME}</p>
      <p className="eyebrow mt-7">{INTRO_COPY.supportLine}</p>
      <h2 id="readiness-check-intro-title" className="brand-display mt-3 readiness-title text-[var(--heading)]">
        Could Pinterest Be a <span className="text-gradient">Bigger Opportunity</span> for Your Brand Than You Think?
      </h2>
      <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">{INTRO_COPY.subtitle}</p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button className="button-primary inline-flex min-h-12 items-center justify-center px-6" type="button" onClick={onStart}>
          {INTRO_COPY.primaryButtonLabel}
        </button>
        <p className="readiness-duration-note">{INTRO_COPY.durationNote}</p>
      </div>
    </section>
  );
}

function QuestionScreen({
  question,
  selectedValue,
  onBack,
  onSelect,
}: {
  question: AssessmentQuestion;
  selectedValue?: AssessmentAnswerValue;
  onBack: () => void;
  onSelect: (value: AssessmentAnswerValue) => void;
}) {
  const progressPercent = getProgressPercent(question.step);

  return (
    <section className="readiness-card readiness-question-card reveal-on-scroll" aria-labelledby="readiness-question-title">
      <div className="readiness-progress-row">
        <p className="readiness-chip">
          Question {question.step} of {QUESTION_COUNT}
        </p>
        <span>{progressPercent}%</span>
      </div>
      <div
        className="readiness-progress-track"
        role="progressbar"
        aria-label={`Question ${question.step} of ${QUESTION_COUNT}`}
        aria-valuemin={1}
        aria-valuemax={QUESTION_COUNT}
        aria-valuenow={question.step}
      >
        <span style={{ width: `${progressPercent}%` }} />
      </div>

      <h2 id="readiness-question-title" className="brand-display mt-7 readiness-question-title text-[var(--heading)]">
        {question.prompt}
      </h2>

      <div className="mt-7 grid gap-3">
        {question.options.map((option, index) => {
          const isSelected = option.value === selectedValue;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              className={`readiness-option ${isSelected ? "is-selected" : ""}`}
              onClick={() => onSelect(option.value)}
            >
              <span aria-hidden="true">{index + 1}</span>
              <strong>{option.label}</strong>
            </button>
          );
        })}
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button className="button-outline min-h-11 px-5" type="button" onClick={onBack}>
          Back
        </button>
        <p className="readiness-duration-note">Select an answer to continue.</p>
      </div>
    </section>
  );
}

function BreakdownCard({ card, isUnlocked }: { card: PinterestReadinessBreakdownCard; isUnlocked: boolean }) {
  const renderUnlockedContent = () => {
    if (card.kind === "list") {
      return (
        <ol className="mt-4 space-y-3">
          {card.items.map((item, index) => (
            <li key={item} className="readiness-reason-item">
              <span aria-hidden="true">{index + 1}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      );
    }

    if (card.kind === "callout") {
      return (
        <div className="mt-4 space-y-2">
          <p className="font-bold text-[var(--heading)]">{card.heading}</p>
          <p>{card.body}</p>
        </div>
      );
    }

    return <p className="mt-4">{card.body}</p>;
  };

  const renderLockedContent = () => {
    if (card.kind === "list") {
      return (
        <ol className="readiness-preview-mask mt-4 space-y-3" aria-hidden="true">
          {card.items.map((item, index) => (
            <li key={`${card.id}-${index}`} className="readiness-reason-item">
              <span aria-hidden="true">{index + 1}</span>
              <p>{maskPreviewText(item)}</p>
            </li>
          ))}
        </ol>
      );
    }

    if (card.kind === "callout") {
      return (
        <div className="readiness-preview-mask mt-4 space-y-2" aria-hidden="true">
          <p className="font-bold text-[var(--heading)]">{maskPreviewText(card.heading)}</p>
          <p>{maskPreviewText(card.body)}</p>
        </div>
      );
    }

    return (
      <p className="readiness-preview-mask mt-4" aria-hidden="true">
        {maskPreviewText(card.body)}
      </p>
    );
  };

  return (
    <article className={`readiness-breakdown-card ${isUnlocked ? "" : "is-locked"}`}>
      <div className="relative z-10">
        <p className="readiness-card-kicker">{card.id.replace("_", " ")}</p>
        <h4 className="brand-display mt-2 headline-card text-[var(--heading)]">{card.title}</h4>
        {isUnlocked ? renderUnlockedContent() : renderLockedContent()}
      </div>
      {!isUnlocked ? <span className="readiness-lock-badge">Email to view</span> : null}
    </article>
  );
}

function ResultsScreen({ result, onRestart, onCtaClick }: { result: AssessmentResult; onRestart: () => void; onCtaClick: (event: MouseEvent<HTMLAnchorElement>) => void }) {
  const viewModel = createPinterestReadinessViewModel(result);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
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

  function renderResultHeadline() {
    if (result.finalOutcome === "strong_fit") {
      return (
        <>
          Pinterest Could Be a <span className="text-gradient">Real Growth Opportunity</span> for Your Brand
        </>
      );
    }

    if (result.finalOutcome === "possible_fit") {
      return (
        <>
          Pinterest Could Work for Your Brand — <span className="text-gradient">With the Right Strategy</span>
        </>
      );
    }

    return (
      <>
        Pinterest May Be <span className="text-gradient">Premature</span> for Your Brand Right Now
      </>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      setEmailError(RESULT_EMAIL_GATE_COPY.validationMessage);
      return;
    }

    setIsSubmittingEmail(true);
    setEmailError(null);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          formType: "readiness-check",
          email: trimmedEmail,
          company,
          signupPage: window.location.pathname,
          leadSource: PINTEREST_READINESS_CHECK_LEAD_SOURCE,
          resourceInterest: `${PINTEREST_READINESS_CHECK_NAME} - ${result.label} (${result.score}/${result.maxScore})`,
          fields: {
            pinterest_readiness_result: result.label,
            readiness_score: String(result.score),
            readiness_max_score: String(result.maxScore),
            readiness_outcome: result.finalOutcome,
            readiness_role_key: result.roleKey,
            top_reason_1: result.reasons[0],
            top_reason_2: result.reasons[1],
            top_reason_3: result.reasons[2],
            pinterest_role: result.roleCopy,
            recommended_next_step: result.cta.caption ?? result.cta.label,
          },
        }),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || RESULT_EMAIL_GATE_COPY.submitErrorMessage);
      }

      setIsUnlocked(true);
      trackReadinessEvent("readiness_check_email_unlocked", {
        readiness_result: result.label,
        readiness_score: result.score,
      });
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : RESULT_EMAIL_GATE_COPY.submitErrorMessage);
    } finally {
      setIsSubmittingEmail(false);
    }
  }

  return (
    <section className="readiness-results-stage space-y-5">
      <div className="readiness-card readiness-results-hero reveal-on-scroll">
        <div className="readiness-reveal-bloom" aria-hidden="true" />
        <div className="readiness-reveal-particles" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="readiness-score" aria-label={`Score ${result.score} out of ${result.maxScore}`}>
          <span>{result.score}</span>
          <small>/{result.maxScore}</small>
        </div>
        <p className="readiness-chip">{viewModel.label}</p>
        <h2 className="brand-display mt-5 readiness-title text-[var(--heading)]">{renderResultHeadline()}</h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted)]">{viewModel.intro}</p>
        <a className="button-primary mt-7 inline-flex min-h-12 items-center justify-center px-6" href={viewModel.ctaUrl} onClick={onCtaClick}>
          {viewModel.ctaLabel}
        </a>
      </div>

      <div className="readiness-card reveal-on-scroll">
        <form className="readiness-email-form" onSubmit={handleSubmit} noValidate>
          <input
            className="hidden"
            type="text"
            name="company"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
          <div>
            <p className="eyebrow">Get the full picture</p>
            <h3 className="brand-display mt-3 headline-section text-[var(--heading)]">{emailHeading}</h3>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">{RESULT_EMAIL_GATE_COPY.body}</p>
          </div>
          <div className="readiness-email-row">
            <label htmlFor="readiness-email" className="sr-only">
              Email
            </label>
            <input
              id="readiness-email"
              className="blog-form-input"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (emailError) setEmailError(null);
              }}
              placeholder={RESULT_EMAIL_GATE_COPY.placeholder}
              autoComplete="email"
              inputMode="email"
              disabled={isSubmittingEmail || isUnlocked}
              aria-invalid={emailError ? "true" : "false"}
              aria-describedby={emailError ? "readiness-email-error" : undefined}
              required
            />
            <button className="button-primary min-h-12 px-6" type="submit" disabled={isSubmittingEmail || isUnlocked}>
              {isSubmittingEmail ? "Sending..." : RESULT_EMAIL_GATE_COPY.buttonLabel}
            </button>
          </div>
          {emailError ? (
            <p id="readiness-email-error" className="form-status-message is-error" role="status" aria-live="polite">
              {emailError}
            </p>
          ) : null}
          <p className="text-sm leading-6 text-[var(--muted)]">{RESULT_EMAIL_GATE_COPY.trustNote}</p>
        </form>
      </div>

      <div ref={breakdownRef} className="readiness-card reveal-on-scroll">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{isUnlocked ? "Ready" : viewModel.breakdownUnlockLabel}</p>
            <h3 className="brand-display mt-3 headline-section text-[var(--heading)]">{viewModel.breakdownTitle}</h3>
          </div>
          <button className="button-outline min-h-11 px-5" type="button" onClick={onRestart}>
            {viewModel.restartLabel}
          </button>
        </div>
        <div className="readiness-breakdown-grid mt-7">
          {viewModel.breakdownCards.map((card) => (
            <BreakdownCard key={card.id} card={card} isUnlocked={isUnlocked} />
          ))}
        </div>
        <div className="mt-7">
          <a className="button-outline min-h-11 px-5" href={viewModel.ctaUrl} onClick={onCtaClick}>
            {viewModel.ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}

export function PinterestReadinessCheck() {
  const [screen, setScreen] = useState<ScreenState>({ kind: "intro" });
  const [answers, setAnswers] = useState<PartialAssessmentAnswers>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const trackedCompletionRunIdRef = useRef<string | null>(null);

  const currentQuestion = useMemo(() => {
    if (screen.kind !== "question") {
      return null;
    }

    return PINTEREST_READINESS_QUESTIONS[screen.questionIndex] ?? null;
  }, [screen]);

  useEffect(() => {
    if (screen.kind !== "results" || !result || !runId || trackedCompletionRunIdRef.current === runId) {
      return;
    }

    trackReadinessEvent("readiness_check_completed", {
      run_id: runId,
      readiness_result: result.label,
      readiness_outcome: result.finalOutcome,
      readiness_score: result.score,
      role_key: result.roleKey,
    });
    trackedCompletionRunIdRef.current = runId;
  }, [result, runId, screen]);

  function startAssessment() {
    const nextRunId = runId ?? createPinterestReadinessRunId();

    if (!runId) {
      setRunId(nextRunId);
      trackReadinessEvent("readiness_check_started", { run_id: nextRunId });
    }

    setScreen({ kind: "question", questionIndex: 0 });
  }

  function restartAssessment() {
    setAnswers({});
    setResult(null);
    setRunId(null);
    trackedCompletionRunIdRef.current = null;
    setScreen({ kind: "intro" });
  }

  function handleBack() {
    if (screen.kind !== "question") {
      return;
    }

    if (screen.questionIndex === 0) {
      setScreen({ kind: "intro" });
      return;
    }

    setScreen({ kind: "question", questionIndex: screen.questionIndex - 1 });
  }

  function handleSelectAnswer(question: AssessmentQuestion, value: AssessmentAnswerValue) {
    const activeRunId = runId ?? createPinterestReadinessRunId();

    if (!runId) {
      setRunId(activeRunId);
      trackReadinessEvent("readiness_check_started", { run_id: activeRunId });
    }

    const nextAnswers = {
      ...answers,
      [question.id]: value,
    } satisfies PartialAssessmentAnswers;

    setAnswers(nextAnswers);
    trackReadinessEvent("readiness_check_question_completed", {
      run_id: activeRunId,
      question_id: question.id,
      selected_answer: value,
      step_number: question.step,
    });

    const selectedQuestionIndex = QUESTION_ORDER.indexOf(question.id);
    const isLastQuestion = selectedQuestionIndex === QUESTION_COUNT - 1;

    if (isLastQuestion) {
      if (!isCompleteAssessmentAnswers(nextAnswers)) {
        throw new Error("Pinterest Readiness Check cannot score until all seven answers are present.");
      }

      setResult(scorePinterestReadinessCheck(nextAnswers));
      setScreen({ kind: "results" });
      return;
    }

    setScreen({ kind: "question", questionIndex: selectedQuestionIndex + 1 });
  }

  return (
    <div className="readiness-shell">
      {screen.kind === "intro" ? <IntroScreen onStart={startAssessment} /> : null}

      {screen.kind === "question" && currentQuestion ? (
        <QuestionScreen
          question={currentQuestion}
          selectedValue={getAnswerForQuestion(answers, currentQuestion.id)}
          onBack={handleBack}
          onSelect={(value) => handleSelectAnswer(currentQuestion, value)}
        />
      ) : null}

      {screen.kind === "results" && result ? (
        <ResultsScreen
          result={result}
          onRestart={restartAssessment}
          onCtaClick={() => {
            if (!runId) {
              return;
            }

            trackEvent("fit_call_click", {
              source: "pinterest_readiness_check",
              readiness_result: result.label,
              readiness_score: result.score,
              page_path: window.location.pathname,
            });
          }}
        />
      ) : null}
    </div>
  );
}
