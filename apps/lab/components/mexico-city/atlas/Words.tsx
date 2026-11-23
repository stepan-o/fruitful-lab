"use client";
import { useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { VOCABULARY, PLACE_PUZZLES } from "@/lib/mexico-city/atlas/content";
import { useLocale } from "@/lib/mexico-city/locale";
import Sources from "./Sources";
export default function Words({ practice }: { practice: () => void }) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [revealed, setRevealed] = useState<string[]>([]);
  const [puzzle, setPuzzle] = useState(0),
    [pieces, setPieces] = useState<string[]>([]),
    [checked, setChecked] = useState(false);
  const p = PLACE_PUZZLES[puzzle];
  const correct = pieces.join("|") === p.pieces.join("|");
  return (
    <section className="at-words">
      <header className="at-section-heading">
        <p className="at-eyebrow">NÁHUATL</p>
        <h1>
          {say("La ciudad también se lee.", "The city can be read, too.")}
        </h1>
        <p>
          {say(
            "Ocho palabras para empezar a reconocer agua, tierra y vida en los nombres.",
            "Eight words to start recognizing water, earth and life in names.",
          )}
        </p>
      </header>
      <div className="at-language-context">
        <strong>
          {say(
            "Una lengua viva, muchas variedades",
            "A living language, many varieties",
          )}
        </strong>
        <p>
          {say(
            "Estas grafías proceden de fuentes históricas. No representan todas las variedades actuales ni enseñan una pronunciación única. Milpa Alta tiene comunidades hablantes hoy; aprender con ellas es otra etapa.",
            "These spellings come from historical sources. They do not represent every current variety or teach a single pronunciation. Milpa Alta has speaking communities today; learning with them is another stage.",
          )}
        </p>
        <Sources ids={["living", "milpa"]} />
      </div>
      <div className="at-word-grid">
        {VOCABULARY.map((w, i) => {
          const open = revealed.includes(w.word);
          return (
            <article key={w.word} className={open ? "is-open" : ""}>
              <button
                aria-expanded={open}
                onClick={() =>
                  setRevealed((v) =>
                    v.includes(w.word)
                      ? v.filter((x) => x !== w.word)
                      : [...v, w.word],
                  )
                }
              >
                <small>0{i + 1}</small>
                <span>{w.word}</span>
                <em>
                  {open
                    ? w.meaning[locale]
                    : say("Toca para descubrir", "Tap to reveal")}
                </em>
              </button>
              {open && (
                <div>
                  <p>{w.hint[locale]}</p>
                  <Sources ids={[w.source]} />
                </div>
              )}
            </article>
          );
        })}
      </div>
      <button className="at-primary" onClick={practice}>
        <Sparkles size={18} />
        {say("Jugar con las palabras", "Play with the words")}
      </button>
      <section className="at-word-builder">
        <p className="at-eyebrow">{say("ARMA UN NOMBRE", "BUILD A NAME")}</p>
        <h2>{p.name}</h2>
        <p>
          {say(
            "Ordena las piezas usando las pistas de significado.",
            "Order the pieces using the meaning clues.",
          )}
        </p>
        <div className="at-chips">
          {PLACE_PUZZLES.map((p, i) => (
            <button
              key={p.id}
              aria-pressed={puzzle === i}
              onClick={() => {
                setPuzzle(i);
                setPieces([]);
                setChecked(false);
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
        <div className="at-word-slots">
          {p.meanings.map((m, i) => (
            <div key={i}>
              <small>{m[locale]}</small>
              <strong>{pieces[i] ?? "…"}</strong>
            </div>
          ))}
        </div>
        <div className="at-chips">
          {p.choices.map((piece) => (
            <button
              key={piece}
              disabled={
                pieces.includes(piece) ||
                pieces.length >= 3 ||
                (checked && correct)
              }
              onClick={() => {
                setPieces((v) => [...v, piece]);
                setChecked(false);
              }}
            >
              {piece}
            </button>
          ))}
        </div>
        <div className="at-builder-actions">
          <button
            className="at-primary"
            disabled={pieces.length !== 3 || (checked && correct)}
            onClick={() => setChecked(true)}
          >
            {say("Comprobar", "Check")}
          </button>
          <button
            className="at-round"
            aria-label={say("Borrar las piezas", "Clear pieces")}
            onClick={() => {
              setPieces([]);
              setChecked(false);
            }}
          >
            <RotateCcw size={18} />
          </button>
        </div>
        {checked && (
          <div className="at-feedback" role="status">
            {correct ? (
              <>
                <strong className="at-reward">
                  <Sparkles size={20} /> +25 {say("puntos", "points")}
                </strong>
                <p>{p.explanation[locale]}</p>
                <small>
                  {say(
                    "Práctica · puntos sin guardar",
                    "Practice · points not saved",
                  )}
                </small>
              </>
            ) : (
              <>
                <strong>
                  {say("Casi. Revisa el orden.", "Nearly. Check the order.")}
                </strong>
                <p>
                  {say(
                    "Borra las piezas y relaciona cada una con su significado. Todavía no hay puntos.",
                    "Clear the pieces and match each one with its meaning. No points yet.",
                  )}
                </p>
              </>
            )}
          </div>
        )}
        <Sources ids={[p.source]} />
      </section>
    </section>
  );
}
