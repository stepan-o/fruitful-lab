"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  AnswerId,
  calculateQuizOutcome,
  emailCaptureCopy,
  intentTags,
  questions,
  quizConfig,
  results,
  safetyNotes,
  sourceNotes,
} from "@/lib/flowerMessageQuiz";
import { answers } from "@/lib/flowerMessageQuiz";
import styles from "./FlowerMessageQuizPreview.module.css";

function formatScoreId(id: string) {
  return id.replaceAll("_", " ");
}

function ResultContent({ resultId }: { resultId: keyof typeof results }) {
  const result = results[resultId];

  return (
    <div className={styles.resultGrid}>
      <section className={styles.resultSection}>
        <h3>Why this flower is speaking to you</h3>
        <p className={styles.body}>{result.resultPage.why}</p>
      </section>
      <section className={styles.resultSection}>
        <h3>What it symbolizes</h3>
        <p className={styles.body}>{result.resultPage.symbolism}</p>
      </section>
      <section className={styles.resultSection}>
        <h3>The Bloom Whispers message</h3>
        <p className={styles.body}>{result.resultPage.bloomWhispersMessage}</p>
      </section>
      <section className={styles.resultSection}>
        <h3>A gentle reflection</h3>
        <p className={styles.body}>{result.resultPage.gentleReflection}</p>
      </section>
      <section className={styles.resultSection}>
        <h3>A tiny ritual</h3>
        <p className={styles.body}>{result.resultPage.tinyRitual}</p>
      </section>
      <section className={styles.resultSection}>
        <h3>Explore next</h3>
        <ul>
          {result.resultPage.exploreNext.map((item) => (
            <li key={`${result.id}-${item}`}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function LocalDiagnostics({ summary }: { summary: ReturnType<typeof calculateQuizOutcome> }) {
  return (
    <details className={styles.debug}>
      <summary>Local preview diagnostics</summary>
      <div className={styles.debugColumns}>
        <div>
          <h4>Result scores</h4>
          <ol>
            {summary.topResults.map((item) => (
              <li key={item.id}>
                {results[item.id].flowerName}: {item.score}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h4>Segment scores</h4>
          <ol>
            {summary.topSegments.map((item) => (
              <li key={item.id}>
                {formatScoreId(item.id)}: {item.score}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h4>Intent scores</h4>
          <ol>
            {summary.topIntentTags.map((item) => (
              <li key={item.id}>
                {intentTags[item.id].label}: {item.score}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h4>Outcome</h4>
          <p className={styles.small}>
            {summary.outcome.kind === "power_duo"
              ? `Power Duo: ${summary.outcome.flowerName}`
              : `Single flower: ${summary.outcome.flowerName}`}
          </p>
        </div>
      </div>
    </details>
  );
}

function ResultMetadata({ resultIds }: { resultIds: readonly (keyof typeof results)[] }) {
  const sourceIds = Array.from(new Set(resultIds.flatMap((resultId) => results[resultId].sourceNoteIds)));
  const safetyIds = Array.from(new Set(resultIds.flatMap((resultId) => results[resultId].safetyNoteIds)));

  return (
    <details className={styles.debug}>
      <summary>Source and safety metadata</summary>
      <div className={styles.debugColumns}>
        <div>
          <h4>Sources</h4>
          <ul>
            {sourceIds.map((sourceId) => (
              <li key={sourceId}>{sourceNotes[sourceId].label}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Internal safety notes</h4>
          <ul>
            {safetyIds.map((safetyId) => (
              <li key={safetyId}>{safetyNotes[safetyId].note}</li>
            ))}
          </ul>
        </div>
      </div>
    </details>
  );
}

export function FlowerMessageQuizPreview() {
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedAnswerIds, setSelectedAnswerIds] = useState<AnswerId[]>([]);
  const [email, setEmail] = useState("");
  const [capturedEmail, setCapturedEmail] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const currentQuestion = questions[selectedAnswerIds.length];
  const isComplete = selectedAnswerIds.length === questions.length;
  const scoreSummary = useMemo(() => calculateQuizOutcome(selectedAnswerIds), [selectedAnswerIds]);

  function resetQuiz() {
    setHasStarted(false);
    setSelectedAnswerIds([]);
    setEmail("");
    setCapturedEmail("");
    setIsUnlocked(false);
  }

  function selectAnswer(answerId: AnswerId) {
    if (isComplete) {
      return;
    }

    setSelectedAnswerIds((current) => [...current, answerId]);
  }

  function goBack() {
    setSelectedAnswerIds((current) => current.slice(0, -1));
    setEmail("");
    setCapturedEmail("");
    setIsUnlocked(false);
  }

  function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCapturedEmail(email);
    setIsUnlocked(true);
  }

  if (!hasStarted) {
    return (
      <section className={styles.shell}>
        <div className={styles.wrap}>
          <div className={styles.panel}>
            <p className={styles.eyebrow}>Local quiz preview</p>
            <h1 className={styles.title}>{quizConfig.title}</h1>
            <p className={styles.lede}>
              A working preview for testing question flow, scoring, intent capture, result preview, and the email
              soft gate.
            </p>
            <p className={styles.instruction}>{quizConfig.instruction}</p>
            <div className={styles.controls}>
              <button className={styles.primaryButton} type="button" onClick={() => setHasStarted(true)}>
                Start the quiz
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!isComplete && currentQuestion) {
    return (
      <section className={styles.shell}>
        <div className={styles.wrap}>
          <div className={styles.panel}>
            <p className={styles.progress}>
              Question {selectedAnswerIds.length + 1} of {questions.length}
            </p>
            <h1 className={styles.questionTitle}>{currentQuestion.prompt}</h1>
            {selectedAnswerIds.length === 0 ? <p className={styles.instruction}>{quizConfig.instruction}</p> : null}
            <div className={styles.answersGrid}>
              {currentQuestion.answerIds.map((answerId) => (
                <button
                  className={styles.answerButton}
                  key={answerId}
                  type="button"
                  onClick={() => selectAnswer(answerId)}
                >
                  {answers[answerId].label}
                </button>
              ))}
            </div>
            <div className={styles.controls}>
              {selectedAnswerIds.length > 0 ? (
                <button className={styles.secondaryButton} type="button" onClick={goBack}>
                  Back
                </button>
              ) : null}
              <button className={styles.secondaryButton} type="button" onClick={resetQuiz}>
                Restart
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const outcome = scoreSummary.outcome;
  const resultIds =
    outcome.kind === "power_duo" ? outcome.resultIds : ([outcome.resultId] as readonly (keyof typeof results)[]);

  return (
    <section className={styles.shell}>
      <div className={styles.wrap}>
        <div className={styles.panel}>
          <p className={styles.eyebrow}>{emailCaptureCopy.previewHeading}</p>
          <div className={styles.previewBox}>
            <h1 className={styles.flowerName}>{outcome.flowerName}</h1>
            <p className={styles.messageTitle}>{outcome.messageTitle}</p>
            <p className={styles.body}>{outcome.previewTeaser}</p>
          </div>

          {!isUnlocked ? (
            <>
              <h2 className={styles.questionTitle}>{emailCaptureCopy.prompt}</h2>
              <p className={styles.body}>{emailCaptureCopy.supportCopy}</p>
              <form className={styles.gateForm} onSubmit={submitEmail}>
                <input
                  aria-label={emailCaptureCopy.fields.email.label}
                  className={styles.emailInput}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={emailCaptureCopy.fields.email.label}
                  required={emailCaptureCopy.fields.email.required}
                  type="email"
                  value={email}
                />
                <div className={styles.controls}>
                  <button className={styles.primaryButton} type="submit">
                    {emailCaptureCopy.cta}
                  </button>
                  <button className={styles.linkButton} type="button" onClick={() => setIsUnlocked(true)}>
                    {emailCaptureCopy.secondaryLink}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <p className={styles.eyebrow}>{capturedEmail ? `Local email capture: ${capturedEmail}` : "Unlocked locally"}</p>
              {outcome.kind === "power_duo" ? (
                <div className={styles.duoGrid}>
                  {outcome.resultIds.map((resultId) => (
                    <section key={resultId} className={styles.resultSection}>
                      <h2 className={styles.flowerName}>{results[resultId].flowerName}</h2>
                      <p className={styles.messageTitle}>{results[resultId].messageTitle}</p>
                      <ResultContent resultId={resultId} />
                    </section>
                  ))}
                </div>
              ) : (
                <ResultContent resultId={outcome.resultId} />
              )}
              <ResultMetadata resultIds={resultIds} />
            </>
          )}

          <LocalDiagnostics summary={scoreSummary} />
          <div className={styles.controls}>
            {selectedAnswerIds.length > 0 ? (
              <button className={styles.secondaryButton} type="button" onClick={goBack}>
                Back
              </button>
            ) : null}
            <button className={styles.secondaryButton} type="button" onClick={resetQuiz}>
              Restart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
