"use client";

import { useState } from "react";
import { storyById, type StoryId } from "@/lib/mexico-city/content";
import GameDialog from "./GameDialog";
import Artwork from "./Artwork";

export default function StoryReader({
  id,
  collected,
  collect,
  close,
  fieldwork,
}: {
  id: StoryId;
  collected: boolean;
  collect: () => void;
  close: () => void;
  fieldwork: () => void;
}) {
  const story = storyById(id);
  const [step, setStep] = useState(0);
  const [touchX, setTouchX] = useState<number | null>(null);
  const scenes = [
    {
      eyebrow: "01 / A place you might pass",
      title: story.title,
      body: story.today,
      image: id,
      caption: "Present-day artist’s interpretation",
    },
    {
      eyebrow: `02 / Rewind to ${story.date}`,
      title: "Before you arrived…",
      body: story.history,
      image: `${id}-past`,
      caption: "Illustrated reconstruction · details are interpretive",
    },
    {
      eyebrow: "03 / The little surprise",
      title: story.short,
      body: story.twist,
      image: `${id}-past`,
      caption: "Illustrated reconstruction · details are interpretive",
    },
    {
      eyebrow: "04 / Your turn to look",
      title: "Make it your discovery.",
      body: story.prompt,
      image: id,
      caption: "Present-day artist’s interpretation",
    },
  ];
  const scene = scenes[step];
  return (
    <GameDialog
      label={story.place + " story"}
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
            otra vista<span>✳</span>
          </span>
          <span>{story.place}</span>
        </header>
        <div
          className="ov-story-progress"
          aria-label={`Chapter ${step + 1} of 4`}
        >
          {scenes.map((s, i) => (
            <button
              key={s.eyebrow}
              onClick={() => setStep(i)}
              aria-label={`Chapter ${i + 1}`}
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
            {step === 3 ? (
              <>
                <p className="ov-practical">{story.practical}</p>
                <button
                  className="ov-primary"
                  onClick={collected ? fieldwork : collect}
                >
                  {collected ? "Add a visit or photo" : "Collect this story"}
                  <span>{collected ? "↗" : "+10"}</span>
                </button>
                {collected ? (
                  <span className="ov-collected">✓ In your field journal</span>
                ) : null}
              </>
            ) : (
              <button
                className="ov-primary"
                onClick={() => setStep((s) => s + 1)}
              >
                Turn the page <span>→</span>
              </button>
            )}
            <div className="ov-story-bottom">
              <button
                onClick={() => setStep((s) => s - 1)}
                disabled={step === 0}
                aria-label="Previous chapter"
              >
                ←
              </button>
              <span>
                {String(step + 1).padStart(2, "0")} <i>/ 04</i>
              </span>
              <a href={story.source.url} target="_blank" rel="noreferrer">
                History source ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </GameDialog>
  );
}
