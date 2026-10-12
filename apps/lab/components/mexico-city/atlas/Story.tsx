"use client";
import {
  STORIES,
  storyById,
  STORY_QUOTES,
  type StoryId,
} from "@/lib/mexico-city/content";
import { NEW_STORIES } from "@/lib/mexico-city/atlas/stories";
import { useLocale } from "@/lib/mexico-city/locale";
import GameDialog from "../GameDialog";
import Artwork from "../Artwork";
import PhotoReferences from "../PhotoReferences";
import Sources from "./Sources";
export default function Story({
  id,
  close,
  quiz,
}: {
  id: string;
  close: () => void;
  quiz: () => void;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const old = STORIES.some((s) => s.id === id)
    ? storyById(id as StoryId, locale)
    : null;
  const fresh = NEW_STORIES.find((s) => s.id === id);
  if (!old && !fresh) return null;
  const quote = old ? STORY_QUOTES[old.id] : null;
  const title = old?.title ?? fresh!.title[locale];
  return (
    <GameDialog
      label={title}
      close={close}
      className="at-story-dialog"
      pageKey={id}
    >
      <article className="at-story">
        <p className="at-eyebrow">
          {old?.place ?? fresh!.place} ·{" "}
          {old?.date ??
            (typeof fresh!.date === "string"
              ? fresh!.date
              : fresh!.date[locale])}
        </p>
        <h1 tabIndex={-1} data-page-heading>
          {title}
        </h1>
        {(old || fresh) && (
          <figure className="at-story-art">
            <Artwork
              id={old ? `${old.id}-past` : `atlas-${fresh!.id}`}
              sizes="(max-width: 700px) 88vw, 650px"
            />
            <figcaption>
              {say(
                fresh?.id === "penon"
                  ? "Ilustración temática. El patio de baños es una composición, no un edificio identificado."
                  : "Ilustración interpretativa; no es una fotografía de archivo.",
                fresh?.id === "penon"
                  ? "Thematic illustration. The bath courtyard is a composite, not an identified building."
                  : "Interpretive illustration; not an archival photograph.",
              )}
            </figcaption>
          </figure>
        )}
        <p className="at-story-lead">{old?.teaser ?? fresh!.lead[locale]}</p>
        {(old
          ? [old.today, old.history, old.twist]
          : fresh!.paragraphs.map((p) => p[locale])
        ).map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        {quote && (
          <blockquote lang="es">
            “{quote.text}”
            {locale === "en" && <p lang="en">{quote.translation}</p>}
            <cite>
              <a href={quote.url} target="_blank" rel="noreferrer">
                {quote.credit} ↗
              </a>
            </cite>
          </blockquote>
        )}
        {id === "revolucion" && <PhotoReferences kind="revolucion" />}
        {id === "zocalo" && <PhotoReferences kind="map" />}
        <aside className="at-observe">
          <span>↗</span>
          <div>
            <strong>
              {say(
                "Una pista para cuando estés ahí",
                "A clue for when you are there",
              )}
            </strong>
            <p>{old?.prompt ?? fresh!.prompt[locale]}</p>
            {old && <small>{old.practical}</small>}
          </div>
        </aside>
        <Sources ids={old ? [old.source.url] : fresh!.sources} />
        <button className="at-primary" onClick={quiz}>
          {say("Jugar con la historia", "Play with history")} →
        </button>
      </article>
    </GameDialog>
  );
}
