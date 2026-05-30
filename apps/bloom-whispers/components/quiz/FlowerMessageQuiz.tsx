"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { GlitterField } from "@/components/GlitterField";
import {
  calculateQuizOutcome,
  emailCaptureCopy,
  questions,
  quizConfig,
  results,
} from "@/lib/flowerMessageQuiz";
import type { AnswerId } from "@/lib/flowerMessageQuiz";
import { answers } from "@/lib/flowerMessageQuiz";
import styles from "./FlowerMessageQuiz.module.css";

type ResultKey = keyof typeof results;

const resultArtwork: Record<ResultKey, string> = {
  amaranth: "/assets/quiz-result-amaranth.png",
  bluebell: "/assets/quiz-result-bluebell.png",
  camellia: "/assets/quiz-result-camellia.png",
  foxglove: "/assets/quiz-result-foxglove.png",
  heliotrope: "/assets/quiz-result-heliotrope.png",
  hellebore: "/assets/quiz-result-hellebore.png",
  iris: "/assets/quiz-result-iris.png",
  love_in_a_mist: "/assets/quiz-result-love-in-a-mist.png",
  snowdrop: "/assets/quiz-result-snowdrop.png",
};

const resultMeaningTags: Record<ResultKey, readonly [string, string, string]> = {
  amaranth: ["Endurance", "Unfading love", "What remains"],
  bluebell: ["Constancy", "Gratitude", "Quiet loyalty"],
  camellia: ["Quiet excellence", "Grace", "Enoughness"],
  foxglove: ["Discernment", "Boundaries", "The quiet no"],
  heliotrope: ["Devotion", "Faithfulness", "Warm return"],
  hellebore: ["Rest", "Relief", "Winter bloom"],
  iris: ["Message", "Voice", "Clear words"],
  love_in_a_mist: ["Mystery", "Creativity", "Odd little sparks"],
  snowdrop: ["Hope", "Renewal", "Soft beginnings"],
};

function ResultDetail({ resultId }: { resultId: ResultKey }) {
  const result = results[resultId];

  return (
    <article className={styles.resultDetail}>
      <p className={styles.resultFlower}>{result.flowerName}</p>
      <h3>{result.messageTitle}</h3>
      <p>{result.resultPage.why}</p>
      <div className={styles.resultGrid}>
        <section>
          <h4>What it symbolizes</h4>
          <p>{result.resultPage.symbolism}</p>
        </section>
        <section>
          <h4>A tiny ritual</h4>
          <p>{result.resultPage.tinyRitual}</p>
        </section>
      </div>
    </article>
  );
}

export function FlowerMessageQuiz() {
  const [selectedAnswerIds, setSelectedAnswerIds] = useState<AnswerId[]>([]);
  const [email, setEmail] = useState("");
  const [capturedEmail, setCapturedEmail] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const shellRef = useRef<HTMLElement>(null);

  const currentQuestion = questions[selectedAnswerIds.length];
  const isComplete = selectedAnswerIds.length === questions.length;
  const scoreSummary = useMemo(() => calculateQuizOutcome(selectedAnswerIds), [selectedAnswerIds]);
  const visibleQuestionNumber = Math.min(selectedAnswerIds.length + 1, questions.length);
  const progressPercent = isComplete ? 100 : (visibleQuestionNumber / questions.length) * 100;
  const outcome = scoreSummary.outcome;
  const resultIds =
    outcome.kind === "power_duo" ? outcome.resultIds : ([outcome.resultId] as readonly ResultKey[]);
  const primaryResultId = resultIds[0];
  const primaryResult = results[primaryResultId];
  const primaryMeaningTags = resultMeaningTags[primaryResultId];
  const resultAlt =
    outcome.kind === "power_duo"
      ? `${primaryResult.flowerName} flower illustration for your Bloom Whispers quiz result`
      : `${outcome.flowerName} flower illustration for your Bloom Whispers quiz result`;

  useEffect(() => {
    if (isComplete) {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      shellRef.current?.scrollIntoView({
        block: "start",
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  }, [isComplete]);

  function resetQuiz() {
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

  return (
    <section className={styles.shell} ref={shellRef}>
      <Image
        className={styles.background}
        src="/assets/quiz-midnight-garden-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.starfield} aria-hidden="true">
        <span className={`${styles.star} ${styles.starOne}`} />
        <span className={`${styles.star} ${styles.starTwo}`} />
        <span className={`${styles.star} ${styles.starThree}`} />
        <span className={`${styles.star} ${styles.starFour}`} />
        <span className={`${styles.star} ${styles.starFive}`} />
      </div>
      <GlitterField className="site-glitter--section" />
      <Image
        className={`${styles.frameFlower} ${styles.frameFlowerLeft}`}
        src="/assets/shop-floral-left-frame.png"
        alt=""
        width={1755}
        height={2194}
        sizes="(max-width: 900px) 240px, 360px"
      />
      <Image
        className={`${styles.frameFlower} ${styles.frameFlowerRight}`}
        src="/assets/shop-floral-right-frame.png"
        alt=""
        width={1755}
        height={2194}
        sizes="(max-width: 900px) 240px, 420px"
      />

      <div className={`${styles.inner} ${isComplete ? styles.resultInner : ""}`}>
        <aside className={`${styles.intro} ${isComplete ? styles.resultIntro : ""}`}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true">✦</span>
            Flowers speak. You listen.
          </p>
          <h1>{quizConfig.title}</h1>
          <span className={styles.divider} aria-hidden="true" />
          <p>
            Answer a few intuitive questions and receive the flower message your current season may be asking you to
            hear.
          </p>
          <div className={styles.metaRow} aria-label="Quiz details">
            <span>
              <i aria-hidden="true">✧</i>
              Takes about 2 minutes
            </span>
            <span>
              <i aria-hidden="true">♧</i>
              Gentle quiz
            </span>
          </div>
        </aside>

        <div className={`${styles.card} ${isComplete ? styles.resultCard : ""}`} aria-live="polite">
          <span className={styles.cardStar} aria-hidden="true">
            ✦
          </span>
          <Image
            className={styles.cardBloomWhite}
            src="/assets/flower-white-bloom.png"
            alt=""
            width={1200}
            height={1200}
            sizes="180px"
          />
          <Image
            className={styles.cardBloomPink}
            src="/assets/flower-pink-rose.png"
            alt=""
            width={1200}
            height={1200}
            sizes="180px"
          />

          {!isComplete && currentQuestion ? (
            <div className={styles.cardContent}>
              <p className={styles.progressLabel}>
                Question {visibleQuestionNumber} of {questions.length}
              </p>
              <div
                className={styles.progressTrack}
                aria-label={`Question ${visibleQuestionNumber} of ${questions.length}`}
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={questions.length}
                aria-valuenow={visibleQuestionNumber}
              >
                <span style={{ width: `${progressPercent}%` }} />
              </div>
              <h2>{currentQuestion.prompt}</h2>
              <div className={styles.answerList}>
                {currentQuestion.answerIds.map((answerId) => (
                  <button
                    className={styles.answerButton}
                    key={answerId}
                    type="button"
                    onClick={() => selectAnswer(answerId)}
                  >
                    <span aria-hidden="true">✦</span>
                    {answers[answerId].label}
                  </button>
                ))}
              </div>
              <div className={styles.cardFooter}>
                <p>Follow your instinct. There are no wrong answers.</p>
                <div className={styles.footerControls}>
                  {selectedAnswerIds.length > 0 ? (
                    <button type="button" onClick={goBack}>
                      Back
                    </button>
                  ) : null}
                  <button type="button" onClick={resetQuiz}>
                    Restart
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${styles.cardContent} ${styles.resultContent}`}>
              <div className={styles.resultLayout}>
                <div className={styles.resultArtworkPanel}>
                  <div className={styles.resultBadge}>
                    <span aria-hidden="true">✦</span>
                    Your bloom
                  </div>
                  <Image
                    className={styles.resultArtwork}
                    src={resultArtwork[primaryResultId]}
                    alt={resultAlt}
                    width={1080}
                    height={1350}
                    sizes="(max-width: 800px) 72vw, 390px"
                  />
                  <div className={styles.resultArtworkCaption}>
                    <span aria-hidden="true" />
                    <p>{primaryResult.resultPage.bloomWhispersMessage}</p>
                    <span aria-hidden="true" />
                  </div>
                </div>

                <article className={styles.resultReading} aria-labelledby="quiz-result-title">
                  <p className={styles.resultKicker}>
                    Your quiz result <span aria-hidden="true">✦</span>
                  </p>
                  <h2 id="quiz-result-title">{outcome.flowerName}</h2>
                  <p className={styles.resultTags}>{primaryMeaningTags.join(" • ")}</p>

                  <section className={styles.reflectSection}>
                    <h3>What this flower reflects</h3>
                    <ul>
                      <li>{primaryResult.email.coreMessage}</li>
                      <li>{primaryResult.resultPage.gentleReflection}</li>
                      <li>{primaryResult.resultPage.tinyRitual}</li>
                    </ul>
                  </section>

                  <span className={styles.resultDivider} aria-hidden="true" />

                  <section className={styles.messageSection}>
                    <h3>A message for you</h3>
                    <p>{primaryResult.resultPage.why}</p>
                  </section>

                  {!isUnlocked ? (
                    <form className={styles.resultEmailGate} onSubmit={submitEmail}>
                      <div>
                        <h3>Send your full flower message to your inbox</h3>
                        <p>Keep this result close with the reflection, tiny ritual, and next garden paths.</p>
                      </div>
                      <label htmlFor="flower-message-email">{emailCaptureCopy.fields.email.label}</label>
                      <div className={styles.resultEmailRow}>
                        <input
                          id="flower-message-email"
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder={emailCaptureCopy.fields.email.label}
                          required={emailCaptureCopy.fields.email.required}
                          type="email"
                          value={email}
                        />
                        <button type="submit">Send my flower message</button>
                      </div>
                      <button className={styles.readHereButton} type="button" onClick={() => setIsUnlocked(true)}>
                        Keep reading here
                      </button>
                    </form>
                  ) : (
                    <div className={styles.fullResult}>
                      {capturedEmail ? (
                        <p className={styles.captureNote}>Saved locally for preview: {capturedEmail}</p>
                      ) : null}
                      {resultIds.map((resultId) => (
                        <ResultDetail key={resultId} resultId={resultId} />
                      ))}
                    </div>
                  )}

                  <section className={styles.tryNextSection}>
                    <h3>Try this next</h3>
                    <div className={styles.tryNextGrid}>
                      <Link href="/post/flower-therapy-harnessing-the-healing-power-of-flowers">
                        Flower healing energy
                      </Link>
                      <Link href="/flower-meaning-guide">Get the flower guide</Link>
                      <Link href="/shop">Visit the Bloom shop</Link>
                    </div>
                    <Link className={styles.keepExploringLink} href="/podcast">
                      <span aria-hidden="true">✦</span>
                      Listen to the Podcast
                      <span aria-hidden="true">✦</span>
                    </Link>
                    <button className={styles.retakeButton} type="button" onClick={resetQuiz}>
                      Retake the quiz ↻
                    </button>
                  </section>
                </article>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
