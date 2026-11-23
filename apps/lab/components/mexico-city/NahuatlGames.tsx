"use client";
import GameName from "./GameName";
import { useState } from "react";
import { useLocale } from "@/lib/mexico-city/locale";
import { WORDS, PLACE_PUZZLES } from "@/lib/mexico-city/nahuatl";
import type { Learning, LearningId } from "@/lib/mexico-city/rewards";
import GameDialog from "./GameDialog";

export default function NahuatlGames({
  close,
  learning,
  award,
  player,
  total,
}: {
  close: () => void;
  learning: Learning;
  award: (id: LearningId) => void | Promise<boolean>;
  player: string;
  total: number;
}) {
  const { locale, t } = useLocale();
  const [mode, setMode] = useState<"learn" | "match" | "build">("learn");
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [pieces, setPieces] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [reward, setReward] = useState(0);
  const word = WORDS[index % WORDS.length],
    puzzle = PLACE_PUZZLES[index % PLACE_PUZZLES.length];
  const correct =
    mode === "match"
      ? answer === index
      : pieces.join("|") === puzzle.pieces.join("|");
  const id =
    mode === "match" ? (`nahuatl-${word.word}` as LearningId) : puzzle.id;
  const next = () => {
    setIndex((i) => i + 1);
    setAnswer(null);
    setPieces([]);
    setChecked(false);
    setReward(0);
  };
  async function earn(id: LearningId, amount: number) {
    const saved = await award(id);
    setReward(saved === false || learning[id] ? 0 : amount);
  }
  function switchMode(next: "learn" | "match" | "build") {
    setMode(next);
    setIndex(0);
    setAnswer(null);
    setPieces([]);
    setChecked(false);
    setReward(0);
  }
  const count = Object.keys(learning).filter(
    (id) => id.startsWith("nahuatl-") && learning[id as LearningId],
  ).length;
  return (
    <GameDialog
      close={close}
      label="Náhuatl"
      className="ov-nahuatl-dialog"
      pageKey={`${mode}-${index}`}
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
      <p className="ov-eyebrow">
        {locale === "es"
          ? "PALABRAS QUE VIVEN EN EL MAPA"
          : "WORDS THAT LIVE ON THE MAP"}{" "}
        · {count}/7
      </p>
      <h2 tabIndex={-1} data-page-heading>
        {locale === "es"
          ? "La ciudad también se lee."
          : "The city speaks through its names."}
      </h2>
      <p className="ov-language-note">
        {locale === "es"
          ? "Primer acercamiento al náhuatl histórico del centro de México, con grafías de las fuentes. El náhuatl sigue vivo y tiene muchas variantes: estas tarjetas no representan la pronunciación de todas las comunidades."
          : "An introduction to historical Nahuatl of central Mexico, using spellings from the sources. Nahuatl is a living language with many varieties; these cards do not represent every community’s pronunciation."}
      </p>
      <nav className="ov-learning-tabs" aria-label="Náhuatl">
        <button
          aria-pressed={mode === "learn"}
          onClick={() => switchMode("learn")}
        >
          {locale === "es" ? "Palabras" : "Words"}
        </button>
        <button
          aria-pressed={mode === "match"}
          onClick={() => switchMode("match")}
        >
          {locale === "es" ? "Encuentra la pareja" : "Find the match"}{" "}
          <span>+10</span>
        </button>
        <button
          aria-pressed={mode === "build"}
          onClick={() => switchMode("build")}
        >
          {locale === "es" ? "Arma el nombre" : "Build the name"}{" "}
          <span>+20</span>
        </button>
      </nav>
      {mode === "learn" ? (
        <>
          <div className="ov-word-cards">
            {WORDS.map((w, i) => (
              <article key={w.word}>
                <span className="ov-word-mark" aria-hidden="true">
                  {["≈", "△", "✳", "▥", "〰"][i]}
                </span>
                <h3 lang="nci">{w.word}</h3>
                <strong>{w.meaning[locale]}</strong>
                <p>{w.hint[locale]}</p>
                <a href={w.source} target="_blank" rel="noreferrer">
                  {t("Read the source ↗")}
                </a>
              </article>
            ))}
          </div>
          <button className="ov-primary" onClick={() => switchMode("match")}>
            {locale === "es" ? "Vamos a jugar" : "Let’s play"} →
          </button>
        </>
      ) : (mode === "match" && index >= WORDS.length) ||
        (mode === "build" && index >= PLACE_PUZZLES.length) ? (
        <div className="ov-learning-finish">
          <span className="ov-finish-spark">✳</span>
          <h3>
            {locale === "es"
              ? "Ya lees el mapa con otros ojos."
              : "You’re reading the map with new eyes."}
          </h3>
          <p>
            {locale === "es"
              ? "Vuelve a practicar: los premios se suman una vez por persona."
              : "Practice again: each reward counts once per person."}
          </p>
          <button
            className="ov-primary"
            onClick={() => switchMode(mode === "match" ? "build" : "match")}
          >
            {locale === "es" ? "Probar el otro juego" : "Try the other game"} →
          </button>
        </div>
      ) : mode === "match" ? (
        <div className="ov-word-game">
          <div className="ov-word-prompt">
            <p className="ov-eyebrow">
              {index + 1} / {WORDS.length}
            </p>
            <h3 lang="nci">{word.word}</h3>
            <p>
              {locale === "es"
                ? "¿Con qué significado va?"
                : "Which meaning matches?"}
            </p>
          </div>
          <div>
            <div className="ov-quiz-answers">
              {[...WORDS.keys()]
                .sort((a, b) => ((a + index + 2) % 5) - ((b + index + 2) % 5))
                .map((i) => (
                  <button
                    key={i}
                    disabled={answer !== null}
                    className={
                      answer !== null && i === index
                        ? "is-correct"
                        : answer === i
                          ? "is-wrong"
                          : ""
                    }
                    onClick={() => {
                      setAnswer(i);
                      if (i === index) earn(id, 10);
                    }}
                  >
                    {WORDS[i].meaning[locale]}
                    <span>{answer === i ? (correct ? "✓" : "×") : "↗"}</span>
                  </button>
                ))}
            </div>
            {answer !== null ? (
              <div className="ov-answer-feedback" role="status">
                <strong>
                  {t(correct ? "That’s it!" : "Almost. Here’s the clue.")}{" "}
                  {reward ? `+${reward} pts` : ""}
                </strong>
                <p>{word.hint[locale]}</p>
                {correct ? (
                  <button className="ov-primary" onClick={next}>
                    {t("Next challenge")} →
                  </button>
                ) : (
                  <button
                    className="ov-primary"
                    onClick={() => setAnswer(null)}
                  >
                    {t("Try again")}
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="ov-name-game">
          <p className="ov-eyebrow">
            {index + 1} / 2 ·{" "}
            {locale === "es"
              ? "ELIGE LAS PIEZAS EN ORDEN"
              : "CHOOSE THE PIECES IN ORDER"}
          </p>
          <h3>{puzzle.name}</h3>
          <p>
            {locale === "es"
              ? "Toca las piezas para reconstruir este nombre. Puedes tocar una casilla para quitarla."
              : "Tap the pieces to rebuild this name. Tap a filled slot to remove it."}
          </p>
          <div className="ov-name-slots">
            {puzzle.pieces.map((_, i) => (
              <button
                key={i}
                disabled={checked && correct}
                aria-label={
                  locale === "es"
                    ? `Pieza ${i + 1}: ${pieces[i] ?? "vacía"}`
                    : `Piece ${i + 1}: ${pieces[i] ?? "empty"}`
                }
                onClick={() => {
                  setPieces((p) => p.filter((_, j) => j !== i));
                  setChecked(false);
                }}
              >
                <span lang="nci">{pieces[i] ?? "＋"}</span>
                <small>{puzzle.meanings[i][locale]}</small>
              </button>
            ))}
          </div>
          <div className="ov-name-tiles">
            {puzzle.choices.map((piece) => (
              <button
                key={piece}
                lang="nci"
                disabled={
                  pieces.includes(piece) ||
                  pieces.length === 3 ||
                  (checked && correct)
                }
                onClick={() => {
                  setPieces((p) => [...p, piece]);
                  setChecked(false);
                }}
              >
                {piece}
              </button>
            ))}
          </div>
          {checked ? (
            <div className="ov-answer-feedback" role="status">
              <strong>
                {t(correct ? "That’s it!" : "Almost. Here’s the clue.")}{" "}
                {reward ? `+${reward} pts` : ""}
              </strong>
              <p>{puzzle.explanation[locale]}</p>
              <a href={puzzle.source} target="_blank" rel="noreferrer">
                {t("Read the source ↗")}
              </a>
            </div>
          ) : null}
          <button
            className="ov-primary"
            disabled={pieces.length !== 3}
            onClick={() => {
              if (checked && correct) {
                next();
                return;
              }
              setChecked(true);
              if (pieces.join("|") === puzzle.pieces.join("|"))
                earn(puzzle.id, 20);
            }}
          >
            {checked && correct
              ? t("Next challenge")
              : locale === "es"
                ? "Comprobar"
                : "Check"}{" "}
            →
          </button>
        </div>
      )}
    </GameDialog>
  );
}
