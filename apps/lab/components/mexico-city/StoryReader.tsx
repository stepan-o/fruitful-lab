"use client";
import GameName from "./GameName";
import { useLocale } from "@/lib/mexico-city/locale";
import { useState } from "react";
import {
  storyById,
  STORY_QUOTES,
  type StoryId,
} from "@/lib/mexico-city/content";
import GameDialog from "./GameDialog";
import Artwork from "./Artwork";
import PhotoReferences from "./PhotoReferences";
export default function StoryReader({
  id,
  collected,
  collect,
  close,
  fieldwork,
  outdoor = false,
}: {
  id: StoryId;
  collected: boolean;
  collect: () => void;
  close: () => void;
  fieldwork: () => void;
  outdoor?: boolean;
}) {
  const { locale, t } = useLocale();
  const story = storyById(id, locale);
  const quote = STORY_QUOTES[id];
  const [step, setStep] = useState(0);
  const [touchX, setTouchX] = useState<number | null>(null);
  const scenes = [
    {
      eyebrow: t("01 / A place you might pass"),
      title: story.title,
      body: story.today,
      image: id,
      caption: t("Present-day artist\u2019s interpretation"),
    },
    {
      eyebrow: t("02 / Rewind to {date}", { date: story.date }),
      title: t("Before you arrived\u2026"),
      body: story.history,
      image: `${id}-past`,
      caption: t("Illustrated reconstruction \u00B7 details are interpretive"),
    },
    {
      eyebrow: t("03 / The little surprise"),
      title: story.short,
      body: story.twist,
      image: `${id}-past`,
      caption: t("Illustrated reconstruction \u00B7 details are interpretive"),
    },
    {
      eyebrow: t("04 / Your turn to look"),
      title: t("Make it your discovery."),
      body: story.prompt,
      image: id,
      caption: t("Present-day artist\u2019s interpretation"),
    },
  ];
  const scene = scenes[step];
  return (
    <GameDialog
      label={t("{place} story", { place: story.place })}
      close={close}
      className="ov-story-dialog"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          setStep((s) => Math.min(3, s + 1));
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setStep((s) => Math.max(0, s - 1));
        }
      }}
    >
      <div
        className="ov-story"
        onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (
            touchX !== null &&
            Math.abs(e.changedTouches[0].clientX - touchX) > 70
          )
            setStep((s) =>
              Math.max(
                0,
                Math.min(
                  3,
                  s + (e.changedTouches[0].clientX < touchX ? 1 : -1),
                ),
              ),
            );
          setTouchX(null);
        }}
      >
        <header className="ov-story-header">
          <span className="ov-wordmark">
            <GameName />
            <span aria-hidden="true">✳</span>
          </span>
          <span>{story.place}</span>
        </header>
        <div
          className="ov-story-progress"
          aria-label={t("Chapter {number} of 4", { number: step + 1 })}
        >
          {scenes.map((s, i) => (
            <button
              key={s.eyebrow}
              onClick={() => setStep(i)}
              aria-label={t("Chapter {number}", { number: i + 1 })}
              aria-current={step === i ? "step" : undefined}
            >
              <span className={i <= step ? "is-read" : ""} />
            </button>
          ))}
        </div>
        <div className="ov-story-layout">
          <figure className="ov-story-art" key={scene.image}>
            <Artwork
              id={scene.image}
              sizes="(max-width: 700px) 100vw, 60vw"
              preload
            />
            <figcaption>{scene.caption}</figcaption>
          </figure>
          <div className="ov-story-copy">
            <span className="ov-eyebrow">{scene.eyebrow}</span>
            <h2>{scene.title}</h2>
            <p>{scene.body}</p>
            {step === 2 ? (
              <blockquote className="ov-story-quote">
                <small>{t("In the source’s own words")}</small>
                <p lang="es">“{quote.text}”</p>
                {locale === "en" ? (
                  <p className="ov-quote-translation">
                    {t("Translation")}: {quote.translation}
                  </p>
                ) : null}
                <cite>
                  <a href={quote.url} target="_blank" rel="noreferrer">
                    {quote.credit} ↗
                  </a>
                </cite>
              </blockquote>
            ) : null}
            {step === 3 && id === "ehecatl" ? (
              <p className="ov-word-aside">
                <span lang="nci">ehecatl</span> ·{" "}
                {locale === "es"
                  ? "viento · Una palabra para reconocer la ciudad."
                  : "wind · A word to recognize the city by."}
              </p>
            ) : null}
            {step === 3 ? (
              <>
                <p className="ov-practical">{story.practical}</p>
                <button
                  className="ov-primary"
                  onClick={collected ? fieldwork : collect}
                >
                  {outdoor ? (locale === "es" ? "Salir a mirar · guardar una foto" : "Go look · keep a photo") : collected
                    ? t("Add a visit or photo")
                    : t("Collect this story")}
                  <span>{outdoor || collected ? "↗" : "+10"}</span>
                </button>
                {collected ? (
                  <span className="ov-collected">
                    {t("\u2713 In your field journal")}
                  </span>
                ) : null}
              </>
            ) : (
              <button
                className="ov-primary"
                onClick={() => setStep((s) => s + 1)}
              >
                {t("Turn the page")}
                <span>→</span>
              </button>
            )}
            {id === "revolucion" && (step === 1 || step === 2) ? (
              <PhotoReferences kind="revolucion" />
            ) : null}
            <div className="ov-story-bottom">
              <button
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 0}
                aria-label={t("Previous chapter")}
              >
                ←
              </button>
              <span>
                {String(step + 1).padStart(2, "0")} <i>/ 04</i>
              </span>
              <a href={story.source.url} target="_blank" rel="noreferrer">
                {t("History source \u2197")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </GameDialog>
  );
}
