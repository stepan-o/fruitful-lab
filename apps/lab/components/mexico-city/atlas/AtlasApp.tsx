"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Compass,
  History,
  Map,
  Sparkles,
  Sprout,
  X,
} from "lucide-react";
import {
  LocaleProvider,
  LanguageSwitch,
  useLocale,
} from "@/lib/mexico-city/locale";
import { BOROUGHS, borough } from "@/lib/mexico-city/atlas/content";
import { CHAPTERS } from "@/lib/mexico-city/atlas/chapters";
import { TRACKS, QUESTIONS, type Track } from "@/lib/mexico-city/atlas/quizzes";
import { STORIES, ZONES, storyById } from "@/lib/mexico-city/content";
import { NEW_STORIES } from "@/lib/mexico-city/atlas/stories";
import Artwork from "../Artwork";
import AtlasMap from "./AtlasMap";
import Sources from "./Sources";
const Timeline = dynamic(() => import("./Timeline"));
const Words = dynamic(() => import("./Words"));
const Quiz = dynamic(() => import("./Quiz"));
const ChapterReader = dynamic(() => import("./ChapterReader"));
const Story = dynamic(() => import("./Story"));
type Screen = "explore" | "chapters" | "time" | "quizzes" | "words";
type Location = {
  screen: Screen;
  borough?: string;
  anchor?: number;
  chapter?: string;
  track?: Track;
};
const screens: Screen[] = ["explore", "chapters", "time", "quizzes", "words"];
function Atlas() {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [location, setLocation] = useState<Location>({ screen: "explore" });
  const [story, setStory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [from, setFrom] = useState("");
  const initialized = useRef(false);
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    const sync = () => {
      const p = new URLSearchParams(window.location.search);
      const screen = p.get("view");
      const b = p.get("borough");
      const chapter = p.get("chapter");
      const track = p.get("quiz");
      const legacy = p.get("place");
      const zone = ZONES.find((z) => z.id === p.get("zone"));
      const a = Number(p.get("anchor"));
      setLocation({
        screen: screens.includes(screen as Screen)
          ? (screen as Screen)
          : chapter
            ? "chapters"
            : track
              ? "quizzes"
              : "explore",
        borough: b && borough(b) ? b : zone?.borough,
        anchor:
          p.has("anchor") && Number.isInteger(a) && a >= 0 && a < 3
            ? a
            : undefined,
        chapter: CHAPTERS.some((c) => c.id === chapter) ? chapter! : undefined,
        track: TRACKS.some((t) => t.id === track)
          ? (track as Track)
          : undefined,
      });
      setStory(null);
      if (
        legacy &&
        (STORIES.some((s) => s.id === legacy) ||
          NEW_STORIES.some((s) => s.id === legacy))
      )
        setStory(legacy);
      setFrom(
        ["guest", "demo"].includes(p.get("from") ?? "") ? p.get("from")! : "",
      );
      initialized.current = true;
    };
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  function openStory(id: string) {
    setStory(id);
    const url = new URL(window.location.href);
    url.searchParams.set("place", id);
    history.pushState(null, "", url);
  }
  function go(next: Location) {
    setStory(null);
    setLocation(next);
    const params = new URLSearchParams();
    if (next.screen !== "explore") params.set("view", next.screen);
    if (next.borough) params.set("borough", next.borough);
    if (next.anchor !== undefined) params.set("anchor", String(next.anchor));
    if (next.chapter) params.set("chapter", next.chapter);
    if (next.track) params.set("quiz", next.track);
    if (from) params.set("from", from);
    history.pushState(
      null,
      "",
      `/mexico-city/atlas${params.size ? `?${params}` : ""}`,
    );
  }
  useEffect(() => {
    if (!initialized.current) return;
    main.current
      ?.querySelector<HTMLElement>("h1")
      ?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.screen, location.chapter, location.track]);
  const current = location.borough ? borough(location.borough) : undefined;
  const anchor =
    current && location.anchor !== undefined
      ? current.anchors[location.anchor]
      : undefined;
  const nav = [
    { id: "explore" as const, title: say("Explorar", "Explore"), Icon: Map },
    {
      id: "chapters" as const,
      title: say("Aprender", "Learn"),
      Icon: BookOpen,
    },
    { id: "time" as const, title: say("Tiempo", "Time"), Icon: History },
    {
      id: "quizzes" as const,
      title: say("Retos", "Challenges"),
      Icon: Sparkles,
    },
    { id: "words" as const, title: "Náhuatl", Icon: Sprout },
  ];
  const practice = (track: Track) => go({ screen: "quizzes", track });
  return (
    <div className="at-app" lang={locale === "es" ? "es-MX" : "en"}>
      <a href="#atlas-main" className="at-skip">
        {say("Saltar al contenido", "Skip to content")}
      </a>
      <header className="at-topbar">
        <Link
          href={`/mexico-city/play${from ? `?${from}=1` : ""}`}
          className="at-return"
        >
          <ArrowLeft size={18} />
          <span>{say("Al juego", "Back to game")}</span>
        </Link>
        <Link href="/mexico-city" className="at-brand">
          Mexico city
          <br />
          discovery game
        </Link>
        <LanguageSwitch />
      </header>
      <main id="atlas-main" ref={main}>
        {location.screen === "explore" && (
          <>
            <div className="at-explore-header">
              <div>
                <p className="at-eyebrow">
                  {say("ATLAS DE LA CIUDAD", "CITY ATLAS")} · 19° N / 99° O
                </p>
                <h1 tabIndex={-1}>
                  {current
                    ? current.name
                    : say(
                        "Antes de salir,\nempieza a mirar.",
                        "Before you go,\nstart noticing.",
                      )}
                </h1>
              </div>
              {!current && (
                <button
                  className="at-start"
                  onClick={() => go({ screen: "chapters", chapter: "basin" })}
                >
                  <span>01</span>
                  <div>
                    {say("Empieza por el agua", "Start with the water")}
                    <small>
                      {say(
                        "Un viaje por la forma de la ciudad",
                        "A journey through the city’s shape",
                      )}
                    </small>
                  </div>
                  <ArrowRight size={20} />
                </button>
              )}
            </div>
            {current && (
              <div className="at-breadcrumb">
                <button onClick={() => go({ screen: "explore" })}>CDMX</button>
                <span>/</span>
                <button
                  onClick={() => go({ screen: "explore", borough: current.id })}
                >
                  {current.name}
                </button>
                {anchor && (
                  <>
                    <span>/</span>
                    <span>{anchor.name}</span>
                  </>
                )}
              </div>
            )}
            <div
              className={`at-explore-layout ${current ? "has-selection" : ""}`}
            >
              <AtlasMap
                focus={location}
                onBorough={(id) => go({ screen: "explore", borough: id })}
                onAnchor={(index) =>
                  go({ screen: "explore", borough: current!.id, anchor: index })
                }
              />
              {current ? (
                <section className="at-borough-panel" aria-label={current.name}>
                  <p className="at-eyebrow">{current.region[locale]}</p>
                  <h2>{anchor ? anchor.name : current.hook[locale]}</h2>
                  <p className="at-lead">
                    {anchor ? anchor.note[locale] : current.memory[locale]}
                  </p>
                  <p>{current.today[locale]}</p>
                  {anchor?.story && (
                    <button
                      className="at-primary"
                      onClick={() => openStory(anchor.story!)}
                    >
                      {say("Abrir la historia", "Open the story")}
                      <ArrowRight size={18} />
                    </button>
                  )}
                  <ol className="at-anchor-list">
                    {current.anchors.map((a, i) => (
                      <li key={a.name}>
                        <button
                          aria-pressed={location.anchor === i}
                          onClick={() =>
                            go({
                              screen: "explore",
                              borough: current.id,
                              anchor: i,
                            })
                          }
                        >
                          <span>0{i + 1}</span>
                          <div>
                            <strong>{a.name}</strong>
                            <small>{a.note[locale]}</small>
                          </div>
                          <ArrowRight size={15} />
                        </button>
                      </li>
                    ))}
                  </ol>
                  <div className="at-transit-note">
                    <Compass size={22} />
                    <div>
                      <strong>
                        {say("Cómo se conecta", "How it connects")}
                      </strong>
                      <p>{current.transit[locale]}</p>
                    </div>
                  </div>
                  <Sources
                    ids={[
                      current.source,
                      ...(current.extra ? [current.extra] : []),
                      "metro",
                    ]}
                  />
                  <button
                    className="at-text-button"
                    onClick={() => practice("zones")}
                  >
                    <Sparkles size={17} />
                    {say("Reconocer sin etiquetas", "Recognize without labels")}
                  </button>
                </section>
              ) : (
                <aside className="at-explore-note">
                  <Artwork
                    id="tenochtitlan-island"
                    sizes="(max-width: 760px) 240px, 340px"
                  />
                  <p className="at-eyebrow">
                    {say("UNA CIUDAD, MUCHAS CAPAS", "ONE CITY, MANY LAYERS")}
                  </p>
                  <h2>
                    {say(
                      "El agua no está.\nLas pistas, sí.",
                      "The water has gone.\nThe clues remain.",
                    )}
                  </h2>
                  <p>
                    {say(
                      "Toca una alcaldía. Acércate a sus lugares y descubre por qué están donde están.",
                      "Choose a borough. Zoom into its places and discover why they are where they are.",
                    )}
                  </p>
                  <small>
                    {say(
                      "Ilustración interpretativa de la ciudad lacustre.",
                      "Interpretive illustration of the lake city.",
                    )}
                  </small>
                  <button
                    className="at-text-button"
                    onClick={() => go({ screen: "time" })}
                  >
                    {say("Viajar en el tiempo", "Travel through time")}
                    <ArrowRight size={18} />
                  </button>
                </aside>
              )}
            </div>
            <section className="at-borough-directory">
              <div className="at-directory-heading">
                <div>
                  <p className="at-eyebrow">
                    {say("LAS PIEZAS DE HOY", "TODAY’S PIECES")}
                  </p>
                  <h2>
                    {say(
                      "16 alcaldías. Ninguna de relleno.",
                      "16 boroughs. Each with a story.",
                    )}
                  </h2>
                </div>
                <label>
                  {say("Busca un nombre o lugar", "Find a name or place")}
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={say(
                      "Ej. Cuicuilco, Tláhuac…",
                      "E.g. Cuicuilco, Tláhuac…",
                    )}
                  />
                </label>
              </div>
              <div className="at-borough-grid">
                {BOROUGHS.filter((b) =>
                  `${b.name} ${b.anchors.map((a) => a.name).join(" ")}`
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .includes(
                      query
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase(),
                    ),
                ).map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      go({ screen: "explore", borough: b.id });
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                  >
                    <span>
                      {String(BOROUGHS.indexOf(b) + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <small>{b.region[locale]}</small>
                      <strong>{b.name}</strong>
                      <p>{b.hook[locale]}</p>
                    </div>
                    <ArrowRight size={17} />
                  </button>
                ))}
              </div>
              {query &&
                !BOROUGHS.some((b) =>
                  `${b.name} ${b.anchors.map((a) => a.name).join(" ")}`
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .includes(
                      query
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toLowerCase(),
                    ),
                ) && (
                  <p role="status">
                    {say(
                      "No encontramos ese nombre. Prueba con una alcaldía o un lugar.",
                      "No match. Try a borough or place name.",
                    )}
                  </p>
                )}
            </section>
          </>
        )}
        {location.screen === "chapters" &&
          (location.chapter ? (
            <ChapterReader
              openChapter={(id) => go({ screen: "chapters", chapter: id })}
              key={location.chapter}
              id={location.chapter}
              back={() => go({ screen: "chapters" })}
            />
          ) : (
            <section>
              <header className="at-section-heading">
                <p className="at-eyebrow">
                  {say(
                    "EL VIAJE ANTES DEL VIAJE",
                    "THE JOURNEY BEFORE THE JOURNEY",
                  )}
                </p>
                <h1 tabIndex={-1}>
                  {say(
                    "Entender antes\nde memorizar.",
                    "Understand before\nyou memorize.",
                  )}
                </h1>
                <p>
                  {say(
                    "Ocho capítulos para seguir la historia del valle. Cada uno termina con su propio quiz.",
                    "Eight chapters tracing the valley’s history. Each ends with its own quiz.",
                  )}
                </p>
              </header>
              <div className="at-chapter-grid">
                {CHAPTERS.map((c, i) => (
                  <button
                    className="at-chapter-card"
                    key={c.id}
                    onClick={() => go({ screen: "chapters", chapter: c.id })}
                  >
                    <div className="at-chapter-art">
                      <Artwork
                        id={c.art}
                        sizes="(max-width: 600px) 85vw, 340px"
                      />
                    </div>
                    <span className="at-chapter-number">0{i + 1}</span>
                    <div className="at-chapter-caption">
                      <h2>{c.title[locale]}</h2>
                      <p>{c.subtitle[locale]}</p>
                      <span>
                        {c.period[locale]} ·{" "}
                        {say("Leer y practicar", "Read and practice")}
                        <ArrowRight size={18} />
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <section className="at-story-index">
                <h2>
                  {say("Historias a ras de calle", "Stories at street level")}
                </h2>
                <div className="at-story-links">
                  {[
                    ...STORIES.map((s) => ({
                      id: s.id,
                      place: storyById(s.id, locale).place,
                    })),
                    ...NEW_STORIES,
                  ].map((s) => (
                    <button key={s.id} onClick={() => openStory(s.id)}>
                      {s.place}
                      <ArrowRight size={16} />
                    </button>
                  ))}
                </div>
              </section>
            </section>
          ))}
        {location.screen === "time" && <Timeline story={openStory} />}
        {location.screen === "words" && (
          <Words practice={() => practice("nahuatl")} />
        )}
        {location.screen === "quizzes" &&
          (location.track ? (
            <>
              <button
                className="at-text-button"
                onClick={() => go({ screen: "quizzes" })}
              >
                <X size={17} />
                {say("Salir de la práctica", "Leave practice")}
              </button>
              <Quiz
                key={location.track}
                track={location.track}
                onExit={() => go({ screen: "quizzes" })}
              />
            </>
          ) : (
            <section>
              <header className="at-section-heading">
                <p className="at-eyebrow">
                  {say("PON A PRUEBA TUS PISTAS", "PUT YOUR CLUES TO THE TEST")}
                </p>
                <h1 tabIndex={-1}>
                  {say("¿Ya te ubicas?", "Getting your bearings?")}
                </h1>
                <p>
                  {say(
                    "Reconoce posiciones, explica cambios y encuentra palabras. Cada respuesta correcta muestra +25 puntos.",
                    "Recognize positions, explain changes and discover words. Each correct answer displays +25 points.",
                  )}
                </p>
              </header>
              <div className="at-track-grid">
                {TRACKS.map((t, i) => (
                  <button
                    key={t.id}
                    style={{ "--track-color": t.color } as React.CSSProperties}
                    onClick={() => practice(t.id)}
                  >
                    <span className="at-track-number">0{i + 1}</span>
                    <h2>{t.title[locale]}</h2>
                    <p>{t.detail[locale]}</p>
                    <span>
                      {QUESTIONS[t.id].length} {say("preguntas", "questions")}
                      <ArrowRight size={20} />
                    </span>
                  </button>
                ))}
              </div>
              <p className="at-practice-note">
                {say(
                  "Por ahora los puntos son una celebración en pantalla: no se acumulan, no se guardan y no cambian la puntuación de tu cuenta.",
                  "For now, points are an on-screen celebration: they do not accumulate, persist or change your account score.",
                )}
              </p>
            </section>
          ))}
      </main>
      <nav
        className="at-bottom-nav"
        aria-label={say("Secciones del atlas", "Atlas sections")}
      >
        {nav.map((n) => (
          <button
            key={n.id}
            aria-current={location.screen === n.id ? "page" : undefined}
            onClick={() => go({ screen: n.id })}
          >
            <n.Icon size={21} />
            <span>{n.title}</span>
          </button>
        ))}
      </nav>
      {story && (
        <Story
          id={story}
          close={() => {
            setStory(null);
            const url = new URL(window.location.href);
            url.searchParams.delete("place");
            history.replaceState(null, "", url);
          }}
          quiz={() => practice("history")}
        />
      )}
    </div>
  );
}
export default function AtlasApp() {
  return (
    <LocaleProvider>
      <Atlas />
    </LocaleProvider>
  );
}
