"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { CHAPTERS, type Scene } from "@/lib/mexico-city/atlas/chapters";
import { BOROUGHS } from "@/lib/mexico-city/atlas/content";
import { useLocale } from "@/lib/mexico-city/locale";
import { AIRPORTS } from "@/lib/mexico-city/learning";
import type { Track } from "@/lib/mexico-city/atlas/quizzes";
import LearningMap from "../LearningMap";
import PhotoReferences from "../PhotoReferences";
import AtlasMap from "./AtlasMap";
import Sources from "./Sources";
function LessonMap({
  scene,
  explore,
}: {
  scene: Scene;
  explore: (id: string) => void;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [blend, setBlend] = useState(0),
    [selected, setSelected] = useState(
      scene.map === 5
        ? "MEX"
        : scene.map === 4
          ? "1"
          : scene.map === 3
            ? "3"
            : scene.map === 1
              ? "west"
              : "09015",
    );
  const options =
    scene.map === 1
      ? [
          { id: "west", label: "Tlacopan · O / W" },
          { id: "north", label: "Tepeyac · N" },
          { id: "south", label: "Iztapalapa · S" },
        ]
      : scene.map === 3
        ? ["1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "12"].map(
            (id) => ({ id, label: id }),
          )
        : scene.map === 4
          ? ["1", "2", "3"].map((id) => ({ id, label: `C${id}` }))
          : scene.map === 5
            ? AIRPORTS.map((a) => ({ id: a.id, label: a.name }))
            : [];
  return (
    <div className="at-lesson-map">
      {scene.map === 2 ? (
        <>
          <AtlasMap compact onBorough={setSelected} answer={selected} />
          <p className="at-map-selected">
            {BOROUGHS.find((b) => b.id === selected)?.name} ·{" "}
            {BOROUGHS.find((b) => b.id === selected)?.hook[locale]}
          </p>
          <button className="at-text-button" onClick={() => explore(selected)}>
            {say("Explorar esta alcaldía", "Explore this borough")} →
          </button>
        </>
      ) : (
        <LearningMap
          stage={scene.map}
          blend={blend}
          selected={selected}
          onSelect={setSelected}
        />
      )}
      {scene.map === 0 && (
        <label className="at-blend">
          {say(
            "Agua como referencia ↔ límites actuales",
            "Water as reference ↔ current boundaries",
          )}
          <input
            type="range"
            min="0"
            max="100"
            value={blend}
            aria-label={say("Comparar agua y ciudad", "Compare water and city")}
            onChange={(e) => setBlend(Number(e.target.value))}
          />
        </label>
      )}
      {options.length > 0 && (
        <div
          className="at-chips"
          aria-label={say("Elegir conexión", "Choose connection")}
        >
          {options.map((o) => (
            <button
              key={o.id}
              aria-pressed={selected === o.id}
              onClick={() => setSelected(o.id)}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
      {scene.map === 4 && (
        <p className="at-map-selected">
          {selected === "1"
            ? "Indios Verdes · Metro 3 ↔ Cuautepec"
            : selected === "2"
              ? "Constitución de 1917 · Metro 8 ↔ Santa Marta · Metro A"
              : "Los Pinos / Constituyentes · Metro 7 ↔ Vasco de Quiroga"}
        </p>
      )}
      {scene.map === 5 && (
        <p className="at-map-selected">
          {AIRPORTS.find((a) => a.id === selected)?.detail[locale]}
        </p>
      )}
    </div>
  );
}
export default function ChapterReader({
  id,
  practice,
  back,
  explore,
}: {
  id: string;
  practice: (track: Track) => void;
  back: () => void;
  explore: (id: string) => void;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const chapter = CHAPTERS.find((c) => c.id === id) ?? CHAPTERS[0];
  const [step, setStep] = useState(0);
  const scene = chapter.scenes[step];
  return (
    <section className="at-chapter-reader">
      <button className="at-text-button" onClick={back}>
        <ArrowLeft size={16} />
        {say("Todos los capítulos", "All chapters")}
      </button>
      <header className="at-section-heading">
        <p className="at-eyebrow">
          {chapter.title[locale]} · {step + 1} / {chapter.scenes.length}
        </p>
        <h1 data-page-heading tabIndex={-1}>
          {scene.title[locale]}
        </h1>
      </header>
      <div className="at-lesson-layout">
        <LessonMap scene={scene} key={scene.title.es} explore={explore} />
        <div className="at-lesson-copy">
          <p className="at-lead">{scene.text[locale]}</p>
          <div className="at-observe">
            <span>↗</span>
            <p>{scene.notice[locale]}</p>
          </div>
          {chapter.id === "peoples" && step === 2 && (
            <PhotoReferences kind="map" />
          )}
          {chapter.id === "growth" && step === 2 && (
            <PhotoReferences kind="revolucion" />
          )}
          <Sources ids={scene.sources} />
          <div className="at-lesson-nav">
            <button
              disabled={step === 0}
              className="at-round"
              aria-label={say("Paso anterior", "Previous step")}
              onClick={() => setStep((s) => s - 1)}
            >
              <ArrowLeft size={19} />
            </button>
            {step < chapter.scenes.length - 1 ? (
              <button
                className="at-primary"
                onClick={() => {
                  setStep((s) => s + 1);
                  document
                    .querySelector<HTMLElement>("[data-page-heading]")
                    ?.focus();
                  window.scrollTo({ top: 0, behavior: "instant" });
                }}
              >
                {say("Seguir la pista", "Follow the clue")}
                <ArrowRight size={17} />
              </button>
            ) : (
              <button
                className="at-primary"
                onClick={() => practice(chapter.track)}
              >
                <Sparkles size={18} />
                {say("Probar lo aprendido", "Try what you learned")}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
