"use client";

import GameName from "./GameName";
import { useState } from "react";
import { useLocale } from "@/lib/mexico-city/locale";
import {
  AIRPORTS,
  BOROUGH_ANCHORS,
  CHAPTER,
  CITY_QUIZ,
} from "@/lib/mexico-city/learning";
import {
  LEARNING_REWARDS,
  type Learning,
  type LearningId,
} from "@/lib/mexico-city/rewards";
import layers from "@/lib/mexico-city/map-layers.json";
import GameDialog from "./GameDialog";
import LearningMap from "./LearningMap";
import PhotoReferences from "./PhotoReferences";

export default function OverviewChapter({
  close,
  learning,
  award,
  player,
  total,
  nahuatl,
}: {
  close: () => void;
  learning: Learning;
  award: (id: LearningId) => void;
  player: string;
  total: number;
  nahuatl: () => void;
}) {
  const { locale, t } = useLocale();
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<"learn" | "quiz" | "complete">("learn");
  const [blend, setBlend] = useState(25);
  const [selected, setSelected] = useState("west");
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [reward, setReward] = useState(0);
  const chapter = CHAPTER[step],
    q = CITY_QUIZ[question];
  const correct = answer === q.correct;
  const airport = AIRPORTS.find((a) => a.id === selected) ?? AIRPORTS[0];
  const borough =
    BOROUGH_ANCHORS.find((a) => a.id === selected) ?? BOROUGH_ANCHORS[0];
  const earned = Object.keys(learning).filter(
    (id) => id.startsWith("city-") && learning[id as LearningId],
  ).length;
  function changeStep(next: number) {
    setStep(next);
    setSelected(["west", "west", "09015", "2", "1", "MEX"][next]);
  }
  function choose(index: number) {
    if (answer !== null) return;
    setAnswer(index);
    setReward(
      index === q.correct && !learning[q.id] ? LEARNING_REWARDS[q.id] : 0,
    );
    if (index === q.correct) award(q.id);
  }
  const mapStage = mode === "quiz" ? [0, 1, 2, 3, 4, 5][question] : step;
  const mapSelection =
    mode === "quiz"
      ? [
          "west",
          "north",
          answer === null ? "" : correct ? "09013" : "09016",
          "8",
          "1",
          "NLU",
        ][question]
      : selected;
  return (
    <GameDialog
      close={close}
      label={t("City overview")}
      className="ov-chapter-dialog"
      pageKey={`${mode}-${step}-${question}`}
    >
      <header className="ov-learning-header">
        <span className="ov-wordmark">
          <GameName />
          <span aria-hidden="true">✳</span>
        </span>
        <span className="ov-live-score">
          {player} <strong>{total}</strong> pts
        </span>
      </header>
      <nav className="ov-learning-tabs" aria-label={t("City overview")}>
        <button
          aria-pressed={mode === "learn"}
          onClick={() => setMode("learn")}
        >
          {t("Learn")}
        </button>
        <button
          aria-pressed={mode !== "learn"}
          onClick={() => {
            setMode("quiz");
            setQuestion(0);
            setAnswer(null);
          }}
        >
          {t("Challenge")} <span>+120</span>
        </button>
        <button onClick={nahuatl}>Náhuatl ↗</button>
      </nav>
      {mode === "complete" ? (
        <div className="ov-learning-finish">
          <span className="ov-finish-spark">✳</span>
          <p className="ov-eyebrow">
            {t("{count} of 6 challenges solved", { count: earned })}
          </p>
          <h2 tabIndex={-1} data-page-heading>
            {t("You’ve got your bearings.")}
          </h2>
          <p>
            {locale === "es"
              ? "Ya no son piezas sueltas: agua, caminos, barrios y conexiones. Ahora sal a buscar sus huellas."
              : "The pieces now connect: water, roads, neighborhoods and transport. Go find their traces."}
          </p>
          <button className="ov-primary" onClick={close}>
            {t("Back to the map")} ↗
          </button>
          <button
            className="ov-text-button"
            onClick={() => {
              setQuestion(0);
              setAnswer(null);
              setMode("quiz");
            }}
          >
            {t("Practice again")}
          </button>
        </div>
      ) : (
        <div className="ov-learning-layout">
          <div className="ov-learning-visual">
            <LearningMap
              stage={mapStage}
              blend={blend}
              selected={mapSelection}
              quiz={mode === "quiz" && question === 2}
              onSelect={(id) => {
                if (mode === "learn") setSelected(id);
                else if (question === 2) choose(id === "09013" ? 1 : 0);
              }}
            />
            {mode === "learn" && step === 0 ? (
              <label className="ov-time-scrubber">
                <span>
                  {locale === "es"
                    ? "El agua bajo la ciudad"
                    : "The water beneath the city"}
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={blend}
                  onChange={(e) => setBlend(Number(e.target.value))}
                  aria-valuetext={
                    locale === "es"
                      ? `${blend}% de ciudad actual`
                      : `${blend}% present-day city`
                  }
                />
                <span>
                  <small>
                    {locale === "es"
                      ? "Imagina los lagos"
                      : "Imagine the lakes"}
                  </small>
                  <small>
                    {locale === "es" ? "Mira la ciudad" : "See the city"}
                  </small>
                </span>
              </label>
            ) : null}
            {mode === "learn" && step === 1 ? (
              <div className="ov-map-picks">
                {[
                  ["west", "Poniente · Tlacopan", "West · Tlacopan"],
                  ["north", "Norte · Tepeyac", "North · Tepeyac"],
                  ["south", "Sur · Iztapalapa", "South · Iztapalapa"],
                ].map(([id, es, en]) => (
                  <button
                    key={id}
                    aria-pressed={selected === id}
                    onClick={() => setSelected(id)}
                  >
                    {locale === "es" ? es : en}
                  </button>
                ))}
              </div>
            ) : null}
            {mode === "learn" && step === 2 ? (
              <div className="ov-map-picks">
                {BOROUGH_ANCHORS.map((b, i) => (
                  <button
                    key={b.id}
                    aria-pressed={selected === b.id}
                    onClick={() => setSelected(b.id)}
                  >
                    {i + 1} · {b.name}
                  </button>
                ))}
              </div>
            ) : null}
            {mode === "learn" && step === 3 ? (
              <div className="ov-line-picks" aria-label={t("Metro network")}>
                {layers.lines.map((l) => (
                  <button
                    key={l.id}
                    style={{ borderColor: l.color }}
                    aria-pressed={selected === l.id}
                    aria-label={t("Line {line}", { line: l.id })}
                    onClick={() => setSelected(l.id)}
                  >
                    {l.id}
                  </button>
                ))}
              </div>
            ) : null}
            {mode === "learn" && step === 4 ? (
              <div className="ov-map-picks">
                {["1", "2", "3"].map((id) => (
                  <button
                    key={id}
                    aria-pressed={selected === id}
                    onClick={() => setSelected(id)}
                  >
                    Cablebús {id}
                  </button>
                ))}
              </div>
            ) : null}
            {mode === "learn" && step === 5 ? (
              <div className="ov-map-picks">
                {AIRPORTS.map((a) => (
                  <button
                    key={a.id}
                    aria-pressed={selected === a.id}
                    onClick={() => setSelected(a.id)}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div className="ov-learning-copy">
            {mode === "learn" ? (
              <>
                <p className="ov-eyebrow">{chapter.tag[locale]}</p>
                <h2 tabIndex={-1} data-page-heading>
                  {chapter.title[locale]}
                </h2>
                <p>{chapter.body[locale]}</p>
                <p className="ov-interaction-hint">
                  ↖ {chapter.interaction[locale]}
                </p>
                <div className="ov-chapter-detail" aria-live="polite">
                  {step === 1 ? (
                    <p>
                      {selected === "north"
                        ? locale === "es"
                          ? "Hacia Tepeyac: recuerda la dirección de Calzada de Guadalupe."
                          : "Toward Tepeyac: remember the direction of Calzada de Guadalupe."
                        : selected === "south"
                          ? locale === "es"
                            ? "Hacia Iztapalapa: el eje de San Antonio Abad te orienta hacia el sur."
                            : "Toward Iztapalapa: the San Antonio Abad axis points south."
                          : locale === "es"
                            ? "Hacia Tlacopan: Ribera de San Cosme conserva la dirección al poniente."
                            : "Toward Tlacopan: Ribera de San Cosme retains the westward direction."}
                    </p>
                  ) : step === 2 ? (
                    <p>
                      <strong>{borough.name}</strong>
                      <br />
                      {borough.detail[locale]}
                    </p>
                  ) : step === 3 ? (
                    <p>
                      <strong>{t("Line {line}", { line: selected })}</strong>
                      <br />
                      {layers.lines.find((l) => l.id === selected)?.route}
                    </p>
                  ) : step === 5 ? (
                    <p>
                      <strong>{airport.name}</strong>
                      <br />
                      {airport.detail[locale]}
                      <br />
                      <a href={airport.source} target="_blank" rel="noreferrer">
                        {t("Read the source ↗")}
                      </a>
                      {airport.extra ? (
                        <>
                          {" "}
                          ·
                          <a
                            href={airport.extra}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Metrobús 4 ↗
                          </a>
                        </>
                      ) : null}
                    </p>
                  ) : null}
                  <p>{chapter.detail[locale]}</p>
                </div>
                {chapter.quote ? (
                  <blockquote lang="es">
                    “{chapter.quote}”
                    {locale === "en" ? (
                      <p lang="en">“{chapter.quoteTranslation}”</p>
                    ) : null}
                    <cite>{chapter.credit}</cite>
                  </blockquote>
                ) : null}
                <a
                  className="ov-source-link"
                  href={chapter.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  {chapter.credit} ↗
                </a>
                {step < 2 ? <PhotoReferences kind="map" /> : null}
                <div className="ov-chapter-actions">
                  <button
                    className="ov-text-button"
                    disabled={step === 0}
                    onClick={() => changeStep(step - 1)}
                    aria-label={t("Previous chapter")}
                  >
                    ←
                  </button>
                  <span>{String(step + 1).padStart(2, "0")} / 06</span>
                  <button
                    className="ov-primary"
                    onClick={() => {
                      if (step < 5) changeStep(step + 1);
                      else {
                        award("orientation");
                        setMode("quiz");
                        setAnswer(null);
                      }
                    }}
                  >
                    {step === 5
                      ? t("Start the challenges")
                      : locale === "es"
                        ? "Sigue el recorrido"
                        : "Continue the journey"}{" "}
                    <span>
                      {step === 5 && !learning.orientation ? "+15" : "→"}
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="ov-eyebrow">
                  {t("Challenge {number} of {total}", {
                    number: question + 1,
                    total: 6,
                  })}{" "}
                  · {q.kind[locale]}
                </p>
                <h2 className="ov-question" tabIndex={-1} data-page-heading>
                  {q.question[locale]}
                </h2>
                {question === 2 ? (
                  <p>
                    {t("Choose a place on the map, or use its name below.")}
                  </p>
                ) : null}
                <div className="ov-quiz-answers">
                  {q.choices.map((c, i) => (
                    <button
                      key={i}
                      disabled={answer !== null}
                      className={
                        answer !== null && i === q.correct
                          ? "is-correct"
                          : answer === i
                            ? "is-wrong"
                            : ""
                      }
                      onClick={() => choose(i)}
                    >
                      <small>{String.fromCharCode(65 + i)}</small>
                      {c[locale]}
                      <span>{answer === i ? (correct ? "✓" : "×") : "↗"}</span>
                    </button>
                  ))}
                </div>
                {answer !== null ? (
                  <div
                    className={`ov-answer-feedback ${correct ? "is-correct" : "is-wrong"}`}
                    role="status"
                  >
                    <strong>
                      {t(correct ? "That’s it!" : "Almost. Here’s the clue.")}{" "}
                      {reward ? `+${reward}` : ""}
                    </strong>
                    <p>{q.explanation[locale]}</p>
                    {correct ? (
                      <small>{t("Already earned · practice freely")}</small>
                    ) : null}
                  </div>
                ) : (
                  <p className="ov-reward-hint">
                    {learning[q.id]
                      ? t("Already earned · practice freely")
                      : `+${LEARNING_REWARDS[q.id]} pts`}
                  </p>
                )}
                {answer !== null ? (
                  <button
                    className="ov-primary"
                    onClick={() => {
                      if (!correct) {
                        setAnswer(null);
                        return;
                      }
                      if (question === 5) setMode("complete");
                      else {
                        setQuestion(question + 1);
                        setAnswer(null);
                      }
                    }}
                  >
                    {t(
                      !correct
                        ? "Try again"
                        : question === 5
                          ? "See my discoveries"
                          : "Next challenge",
                    )}{" "}
                    →
                  </button>
                ) : null}
              </>
            )}
          </div>
        </div>
      )}
    </GameDialog>
  );
}
