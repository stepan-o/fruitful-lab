"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, RotateCcw, Sparkles } from "lucide-react";
import {
  QUESTIONS,
  TRACKS,
  rewardFor,
  type Track,
} from "@/lib/mexico-city/atlas/quizzes";
import { useLocale } from "@/lib/mexico-city/locale";
import AtlasMap from "./AtlasMap";
import Sources from "./Sources";
export default function Quiz({
  track,
  onExit,
}: {
  track: Track;
  onExit: () => void;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [step, setStep] = useState(0),
    [answer, setAnswer] = useState<string | null>(null),
    [reward, setReward] = useState(0);
  const rewarded = useRef(new Set<string>());
  const feedback = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (answer !== null)
      feedback.current?.scrollIntoView?.({
        block: "nearest",
        behavior: "instant",
      });
  }, [answer]);
  const questions = QUESTIONS[track],
    question = questions[step];
  const title = TRACKS.find((t) => t.id === track)!.title[locale];
  function submit(id: string) {
    if (!question || rewarded.current.has(question.id)) return;
    setAnswer(id);
    const points = rewardFor(question, id, rewarded.current.has(question.id));
    setReward(points);
    if (points) rewarded.current.add(question.id);
  }
  if (!question)
    return (
      <section className="at-quiz-complete">
        <Sparkles size={42} />
        <p className="at-eyebrow">{title}</p>
        <h2>{say("Ya tienes nuevas pistas.", "You have new clues.")}</h2>
        <p>
          {say(
            `Completaste ${questions.length} preguntas. Ahora vuelve al mapa y relaciona las piezas.`,
            `You completed ${questions.length} questions. Return to the map and connect the pieces.`,
          )}
        </p>
        <p className="at-muted">
          {say(
            "Los puntos de esta práctica sólo se muestran en pantalla. No se guardan ni modifican tu cuenta.",
            "Practice points are only shown on screen. They are not saved or added to your account.",
          )}
        </p>
        <button className="at-primary" onClick={onExit}>
          {say("Volver a los retos", "Back to challenges")}
        </button>
        <button
          className="at-text-button"
          onClick={() => {
            rewarded.current.clear();
            setStep(0);
            setAnswer(null);
            setReward(0);
          }}
        >
          <RotateCcw size={16} />
          {say("Practicar de nuevo", "Practice again")}
        </button>
      </section>
    );
  const correct = answer === question.correct;
  return (
    <section className="at-quiz" aria-label={title}>
      <div className="at-quiz-progress">
        <span>{title}</span>
        <span>
          {step + 1} / {questions.length}
        </span>
      </div>
      <progress
        value={step}
        max={questions.length}
        aria-label={say("Preguntas completadas", "Questions completed")}
      />
      <h2 tabIndex={-1} data-page-heading>
        {question.prompt[locale]}
      </h2>
      {question.map && (
        <AtlasMap
          key={question.id}
          quiz
          compact
          answer={answer ?? undefined}
          onBorough={submit}
        />
      )}
      <div
        className={question.map ? "at-map-answers" : "at-answer-list"}
        aria-label={say("Respuestas", "Answers")}
      >
        {question.options.map((option, i) => (
          <button
            key={option.id}
            disabled={correct}
            aria-pressed={answer === option.id}
            className={
              answer === option.id ? (correct ? "is-correct" : "is-wrong") : ""
            }
            onClick={() => submit(option.id)}
          >
            {question.map && <small>{i + 1}</small>}
            {option.label[locale]}
            {answer === option.id && correct && <Check size={18} />}
          </button>
        ))}
      </div>
      {answer !== null && (
        <div
          className={`at-feedback ${correct ? "is-correct" : ""}`}
          ref={feedback}
          role="status"
        >
          {correct ? (
            <>
              <strong className="at-reward" key={question.id}>
                <Sparkles size={20} /> +{reward} {say("puntos", "points")}
              </strong>
              <p>{question.explanation[locale]}</p>
            </>
          ) : (
            <>
              <strong>{say("Otra pista…", "Another clue…")}</strong>
              <p>{question.explanation[locale]}</p>
              <span>
                {say(
                  "Inténtalo de nuevo. Aún no hay puntos.",
                  "Try again. No points yet.",
                )}
              </span>
            </>
          )}
        </div>
      )}
      <div className="at-quiz-actions">
        <span>
          {say("Práctica · puntos sin guardar", "Practice · points not saved")}
        </span>
        {correct && (
          <button
            className="at-primary"
            onClick={() => {
              setStep((v) => v + 1);
              setAnswer(null);
              setReward(0);
              document
                .querySelector<HTMLElement>("[data-page-heading]")
                ?.focus();
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          >
            {say(
              step === questions.length - 1 ? "Terminar" : "Siguiente",
              step === questions.length - 1 ? "Finish" : "Next",
            )}
            <ArrowRight size={18} />
          </button>
        )}
      </div>
      <Sources ids={question.sources} />
    </section>
  );
}
