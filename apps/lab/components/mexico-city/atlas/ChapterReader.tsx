"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, BookOpen } from "lucide-react";
import {
  CHAPTERS,
  loadChapter,
  type Chapter,
} from "@/lib/mexico-city/atlas/history";
import { useLocale } from "@/lib/mexico-city/locale";
import Sources from "./Sources";
import GuidedDiagram from "./GuidedDiagram";
import ArchiveFigure from "./ArchiveFigure";

function ChapterQuiz({
  chapter,
  next,
  back,
}: {
  chapter: Chapter;
  next?: () => void;
  back: () => void;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const correct = chapter.quiz.filter(
    (q, i) => answers[i] === q.correct,
  ).length;
  const result = useRef<HTMLDivElement>(null);
  return (
    <section
      className="at-book-quiz"
      id="chapter-quiz"
      aria-labelledby="chapter-quiz-title"
    >
      <p className="at-eyebrow">
        {say("AL FINAL DEL CAPÍTULO", "AT THE END OF THE CHAPTER")}
      </p>
      <h2 id="chapter-quiz-title" tabIndex={-1}>
        {say(
          "Tres preguntas para volver sobre la historia",
          "Three questions to return to the story",
        )}
      </h2>
      <p>
        {say(
          "Tres preguntas sobre lo que acabas de leer. Puedes volver al texto antes de responder.",
          "Three questions about what you have just read. You can revisit the text before answering.",
        )}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
          requestAnimationFrame(() => {
            result.current?.focus();
          });
        }}
      >
        {chapter.quiz.map((q, i) => (
          <fieldset key={i} disabled={submitted}>
            <legend>
              <span>{i + 1}.</span> {q.prompt[locale]}
            </legend>
            {q.options.map((o, j) => (
              <label
                className={submitted && j === q.correct ? "is-correct" : ""}
                key={j}
              >
                <input
                  type="radio"
                  name={`question-${i}`}
                  checked={answers[i] === j}
                  onChange={() => setAnswers((a) => ({ ...a, [i]: j }))}
                  required
                />
                {o[locale]}
                {submitted && j === q.correct && (
                  <Check size={18} aria-label={say("Correcta", "Correct")} />
                )}
              </label>
            ))}
            {submitted && (
              <div className="at-book-answer">
                <strong>
                  {answers[i] === q.correct
                    ? say("+25 puntos", "+25 points")
                    : say("La explicación", "The explanation")}
                </strong>
                <p>{q.explanation[locale]}</p>
                <Sources ids={q.sources} compact />
              </div>
            )}
          </fieldset>
        ))}
        {!submitted && (
          <button
            className="at-primary"
            type="submit"
            disabled={Object.keys(answers).length !== chapter.quiz.length}
          >
            {say("Comprobar respuestas", "Check answers")}{" "}
            <ArrowRight size={18} />
          </button>
        )}
      </form>
      {submitted && (
        <div
          ref={result}
          tabIndex={-1}
          className="at-book-result"
          role="status"
        >
          <BookOpen size={28} />
          <h3>{say("Capítulo completado", "Chapter completed")}</h3>
          <p>
            {correct} / {chapter.quiz.length}{" "}
            {say("respuestas correctas", "correct answers")} ·{" "}
            <strong>
              +{correct * 25} {say("puntos", "points")}
            </strong>
          </p>
          <small>
            {say(
              "Puntos de práctica: sólo se muestran aquí. No se guardan ni cambian tu cuenta.",
              "Practice points: displayed here only. They are not saved and do not change your account.",
            )}
          </small>
          <button className="at-primary" onClick={next ?? back}>
            {next
              ? say("Leer el siguiente capítulo", "Read the next chapter")
              : say("Volver al índice", "Back to contents")}{" "}
            <ArrowRight size={18} />
          </button>
          <button
            className="at-text-button"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
              document.getElementById("chapter-quiz-title")?.focus();
            }}
          >
            {say("Volver a practicar", "Practice again")}
          </button>
        </div>
      )}
    </section>
  );
}
type ReaderProps = {
  id: string;
  back: () => void;
  openChapter: (id: string) => void;
};
export default function ChapterReader(props: ReaderProps) {
  const { locale } = useLocale();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let current = true;
    loadChapter(props.id)
      .then((value) => {
        if (current) {
          setChapter(value);
          setFailed(false);
        }
      })
      .catch(() => {
        if (current) setFailed(true);
      });
    return () => {
      current = false;
    };
  }, [props.id, attempt]);
  if (!chapter || chapter.id !== props.id)
    return (
      <div className="at-book" role="status">
        <button className="at-text-button" onClick={props.back}>
          {locale === "es" ? "Todos los capítulos" : "All chapters"}
        </button>
        <p>
          {failed
            ? locale === "es"
              ? "No pudimos cargar el capítulo. Revisa tu conexión y vuelve a intentar."
              : "The chapter could not load. Check your connection and try again."
            : locale === "es"
              ? "Abriendo el capítulo…"
              : "Opening the chapter…"}
        </p>
        {failed && (
          <button
            className="at-primary"
            onClick={() => {
              setFailed(false);
              setAttempt((a) => a + 1);
            }}
          >
            {locale === "es" ? "Reintentar" : "Try again"}
          </button>
        )}
      </div>
    );
  return (
    <Book
      key={chapter.id}
      chapter={chapter}
      back={props.back}
      openChapter={props.openChapter}
    />
  );
}
function Book({
  chapter,
  back,
  openChapter,
}: Omit<ReaderProps, "id"> & { chapter: Chapter }) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const index = CHAPTERS.findIndex((c) => c.id === chapter.id);
  const [active, setActive] = useState("");
  const minutes = Math.max(
    1,
    Math.ceil(
      chapter.sections
        .flatMap((s) => s.paragraphs)
        .reduce((n, p) => n + p.text[locale].split(/\s+/).length, 0) / 180,
    ),
  );
  function jump(value: string) {
    setActive(value);
    const el = document.getElementById(value);
    el?.scrollIntoView({ behavior: "auto", block: "start" });
    el?.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
  }
  return (
    <article className="at-book">
      <button className="at-text-button at-book-back" onClick={back}>
        <ArrowLeft size={17} />
        {say("Todos los capítulos", "All chapters")}
      </button>
      <header className="at-book-heading">
        <p className="at-eyebrow">
          {say("CAPÍTULO", "CHAPTER")} {String(index + 1).padStart(2, "0")} /{" "}
          {String(CHAPTERS.length).padStart(2, "0")}· {chapter.period[locale]}
        </p>
        <h1 tabIndex={-1}>{chapter.title[locale]}</h1>
        <p className="at-book-deck">{chapter.subtitle[locale]}</p>
        <div className="at-book-meta">
          <span>
            {minutes} {say("min de lectura", "min read")}
          </span>
          <span>
            {say(
              "Documentos · diagramas · quiz",
              "Documents · diagrams · quiz",
            )}
          </span>
        </div>
      </header>
      <div className="at-book-layout">
        <nav
          className="at-book-contents"
          aria-label={say("En este capítulo", "In this chapter")}
        >
          <label htmlFor="chapter-section">
            {say("EN ESTE CAPÍTULO", "IN THIS CHAPTER")}
          </label>
          <select
            id="chapter-section"
            value={active}
            onChange={(e) => jump(e.target.value)}
          >
            <option value="">
              {say("Ir a una sección…", "Go to a section…")}
            </option>
            {chapter.sections.map((s, i) => (
              <option key={s.id} value={`section-${s.id}`}>
                {i + 1}. {s.title[locale]}
              </option>
            ))}
            <option value="chapter-quiz">
              {say("Quiz del capítulo", "Chapter quiz")}
            </option>
          </select>
          <ol>
            {chapter.sections.map((s, i) => (
              <li key={s.id}>
                <button
                  aria-current={
                    active === `section-${s.id}` ? "location" : undefined
                  }
                  onClick={() => jump(`section-${s.id}`)}
                >
                  <span>0{i + 1}</span>
                  {s.title[locale]}
                </button>
              </li>
            ))}
            <li>
              <button onClick={() => jump("chapter-quiz")}>
                <span>↗</span>
                {say("Quiz del capítulo", "Chapter quiz")}
              </button>
            </li>
          </ol>
        </nav>
        <div className="at-book-reading">
          {chapter.sections.map((s, i) => (
            <section
              className="at-book-section"
              id={`section-${s.id}`}
              key={s.id}
            >
              <div className="at-book-section-heading">
                <span>0{i + 1}</span>
                <h2 tabIndex={-1}>{s.title[locale]}</h2>
              </div>
              {s.paragraphs.map((p, j) => (
                <div key={j}>
                  <div className="at-book-passage">
                    <p>{p.text[locale]}</p>
                    <Sources ids={p.sources} compact />
                  </div>
                  {j === 0 && s.diagram && (
                    <GuidedDiagram kind={s.diagram} chapter={chapter.id} />
                  )}
                  {j === 1 && s.archive && <ArchiveFigure kind={s.archive} />}
                </div>
              ))}
            </section>
          ))}
          <ChapterQuiz
            key={chapter.id}
            chapter={chapter}
            next={
              CHAPTERS[index + 1]
                ? () => openChapter(CHAPTERS[index + 1].id)
                : undefined
            }
            back={back}
          />
          <nav
            className="at-book-pagination"
            aria-label={say("Capítulos", "Chapters")}
          >
            {index > 0 && (
              <button onClick={() => openChapter(CHAPTERS[index - 1].id)}>
                <ArrowLeft size={18} />
                <span>
                  <small>{say("Anterior", "Previous")}</small>
                  {CHAPTERS[index - 1].title[locale]}
                </span>
              </button>
            )}
            {index < CHAPTERS.length - 1 && (
              <button onClick={() => openChapter(CHAPTERS[index + 1].id)}>
                <span>
                  <small>{say("Siguiente", "Next")}</small>
                  {CHAPTERS[index + 1].title[locale]}
                </span>
                <ArrowRight size={18} />
              </button>
            )}
          </nav>
        </div>
      </div>
    </article>
  );
}
