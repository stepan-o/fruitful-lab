"use client";
import GameName from "./GameName";
import {
  useLocale,
  LanguageSwitch,
  LocaleProvider,
} from "@/lib/mexico-city/locale";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  parentView,
  STORIES,
  storyById,
  ZONES,
  zoneById,
  type StoryId,
  type View,
} from "@/lib/mexico-city/content";
import geography from "@/lib/mexico-city/geography.json";
import {
  blankEntry,
  blankJournal,
  mergeJournals,
  parseJournal,
  PLAYERS,
  points,
  STORAGE_KEY,
  type Entry,
  type Journal,
  type Player,
} from "@/lib/mexico-city/journal";
import MapCanvas from "./MapCanvas";
import GameDialog from "./GameDialog";
import { LEARNING_REWARDS, type LearningId } from "@/lib/mexico-city/rewards";
const StoryReader = dynamic(() => import("./StoryReader"));
const OverviewChapter = dynamic(() => import("./OverviewChapter"));
const NahuatlGames = dynamic(() => import("./NahuatlGames"));
const FieldJournal = dynamic(() => import("./FieldJournal"));
function viewFromUrl(): View {
  const query = new URLSearchParams(window.location.search);
  const place = query.get("place");
  const zone = query.get("zone");
  const borough = query.get("borough");
  if (STORIES.some((s) => s.id === place))
    return { level: "place", id: place as StoryId };
  if (ZONES.some((z) => z.id === zone))
    return { level: "zone", id: zone as (typeof ZONES)[number]["id"] };
  if (geography.boroughs.some((b) => b.id === borough))
    return { level: "borough", id: borough! };
  return { level: "city" };
}
export default function CityGame() {
  return (
    <LocaleProvider>
      <Game />
    </LocaleProvider>
  );
}
function Game() {
  const { locale, t } = useLocale();
  const [view, setView] = useState<View>({ level: "city" });
  const [journal, setJournal] = useState<Journal>(blankJournal);
  const currentJournal = useRef(journal);
  const [ready, setReady] = useState(false);
  const [player, setActivePlayer] = useState<Player>("Susy");
  const [story, setStory] = useState<StoryId | null>(null);
  const [book, setBook] = useState(false);
  const [chapter, setChapter] = useState(false);
  const [nahuatl, setNahuatl] = useState(false);
  const [about, setAbout] = useState(false);
  const [message, setMessage] = useState("");
  const [rewardNotice, setRewardNotice] = useState(0);
  useEffect(() => {
    let stored: Journal | null = null;
    let lastPlayer: Player = "Susy";
    let storageNotice = "";
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) stored = parseJournal(JSON.parse(raw));
      if (localStorage.getItem("otra-vista-player-v1") === "Stepan")
        lastPlayer = "Stepan";
    } catch {
      storageNotice =
        "Your saved journal could not be read. You can import a backup in the field journal.";
    }
    // Hydrate browser-owned state after the server's deterministic first render.
    queueMicrotask(() => {
      if (stored) {
        currentJournal.current = stored;
        setJournal(stored);
      }
      setActivePlayer(lastPlayer);
      if (storageNotice) setMessage(storageNotice);
      setView(viewFromUrl());
      setReady(true);
    });
    const onPop = () => {
      setView(viewFromUrl());
      setStory(null);
      setBook(false);
      setChapter(false);
      setNahuatl(false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  function setPlayer(next: Player) {
    setActivePlayer(next);
    try {
      localStorage.setItem("otra-vista-player-v1", next);
    } catch {
      /* The journal's save path reports storage failures. */
    }
  }
  function save(next: Journal) {
    currentJournal.current = next;
    setJournal(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      setMessage(
        "This browser could not save your journal. Export it from the field journal to keep your discoveries.",
      );
    }
  }
  function update(
    id: StoryId,
    changes: Partial<Entry>,
    owner: Player = player,
  ) {
    const latest = currentJournal.current;
    const next = {
      ...latest,
      players: {
        ...latest.players,
        [owner]: {
          ...latest.players[owner],
          [id]: { ...(latest.players[owner][id] ?? blankEntry()), ...changes },
        },
      },
    };
    save(next);
  }
  function award(id: LearningId) {
    const latest = currentJournal.current;
    if (latest.learning?.[player][id]) return;
    save({
      ...latest,
      learning: {
        Susy: { ...latest.learning?.Susy },
        Stepan: { ...latest.learning?.Stepan },
        [player]: { ...latest.learning?.[player], [id]: true },
      },
    });
    setRewardNotice(LEARNING_REWARDS[id]);
    setMessage("+{points} discovery points");
  }
  function go(next: View) {
    setView(next);
    setStory(null);
    setBook(false);
    setChapter(false);
    setNahuatl(false);
    const url = new URL(window.location.href);
    url.search =
      next.level === "city"
        ? ""
        : new URLSearchParams({ [next.level]: next.id }).toString();
    window.history.pushState(null, "", url);
  }
  const boroughId =
    view.level === "borough"
      ? view.id
      : view.level === "zone"
        ? zoneById(view.id).borough
        : view.level === "place"
          ? storyById(view.id, locale).borough
          : null;
  const borough = geography.boroughs.find((b) => b.id === boroughId);
  const zone =
    view.level === "zone"
      ? zoneById(view.id)
      : view.level === "place"
        ? zoneById(storyById(view.id, locale).zone)
        : null;
  const place = view.level === "place" ? storyById(view.id, locale) : null;
  const choices =
    view.level === "borough" ? ZONES.filter((z) => z.borough === view.id) : [];
  const title =
    view.level === "city" ? (
      <>
        <span className="ov-desktop-title">
          {t("A city.")}
          <br />
          {t("A thousand")}
          <br />
        </span>
        <span className="ov-phone-title">
          {t("A city of")}
          <br />
        </span>
        <em>{t("little surprises.")}</em>
      </>
    ) : view.level === "borough" ? (
      <>
        {borough?.name}
        <em>{t(" awaits.")}</em>
      </>
    ) : view.level === "zone" ? (
      <>
        {zone?.name}
        <em>{t("Up close.")}</em>
      </>
    ) : (
      place?.title
    );
  const rival = player === "Susy" ? "Stepan" : "Susy";
  const score = points(journal.players[player], journal.learning?.[player]);
  const difference =
    score - points(journal.players[rival], journal.learning?.[rival]);
  return (
    <main
      lang={locale === "es" ? "es-MX" : "en"}
      className="ov-game"
      data-level={view.level}
    >
      <a href="#ov-explore" className="ov-skip">
        {t("Skip to discoveries")}
      </a>
      <header className="ov-header">
        <button
          className="ov-wordmark"
          aria-label={t("Mexico city discovery game, return to city")}
          onClick={() => go({ level: "city" })}
        >
          <GameName />
          <span aria-hidden="true">✳</span>
          <small>{t("MEXICO CITY, RESEEN")}</small>
        </button>
        <LanguageSwitch />
        <div className="ov-scoreboard" aria-label={t("Discovery points")}>
          {PLAYERS.map((p) => (
            <button
              key={p}
              onClick={() => setPlayer(p)}
              aria-pressed={player === p}
              aria-label={t("Play as {player}, {points} points", {
                player: p,
                points: points(journal.players[p], journal.learning?.[p]),
              })}
            >
              <span className={`ov-avatar ov-avatar--${p.toLowerCase()}`}>
                {p[0]}
              </span>
              <span className="ov-player-name">{p}</span>
              <strong>
                {points(journal.players[p], journal.learning?.[p])}
              </strong>
              <small>pts</small>
            </button>
          ))}
        </div>
        <button
          className="ov-journal-toggle"
          onClick={() => setBook(true)}
          disabled={!ready}
        >
          <span aria-hidden="true">▤</span>
          <span>{t("Field journal")}</span>
          <i>↗</i>
        </button>
      </header>
      <nav className="ov-breadcrumb" aria-label={t("Map scale")}>
        <button
          onClick={() => go({ level: "city" })}
          aria-current={view.level === "city" ? "page" : undefined}
        >
          {t("The city")}
        </button>
        {borough ? (
          <>
            <span>/</span>
            <button
              onClick={() => go({ level: "borough", id: borough.id })}
              aria-current={view.level === "borough" ? "page" : undefined}
            >
              {borough.name}
            </button>
          </>
        ) : (
          <span className="ov-breadcrumb-hint">
            {t("/ a field guide for the curious")}
          </span>
        )}
        {zone ? (
          <>
            <span>/</span>
            <button
              onClick={() => go({ level: "zone", id: zone.id })}
              aria-current={view.level === "zone" ? "page" : undefined}
            >
              {zone.name}
            </button>
          </>
        ) : null}
        {place ? (
          <>
            <span>/</span>
            <span className="ov-breadcrumb-place">{t("A discovery")}</span>
          </>
        ) : null}
      </nav>
      <div className="ov-chapter-rail">
        <button
          className="ov-chapter-entry"
          onClick={() => setChapter(true)}
          disabled={!ready}
        >
          <span className="ov-chapter-number">01</span>
          <span>
            <small>{t("City layout, landmarks and history")}</small>
            <strong>
              {locale === "es"
                ? "La ciudad que nació del agua"
                : "The city that grew from water"}
            </strong>
          </span>
          <b>{journal.learning?.[player].orientation ? "✓" : "+135"} ↗</b>
        </button>
        <button
          className="ov-nahuatl-entry"
          onClick={() => setNahuatl(true)}
          disabled={!ready}
        >
          <span lang="nci">atl</span>
          <span>
            Náhuatl
            <small>
              {locale === "es" ? "Palabras y juegos" : "Words & games"}
            </small>
          </span>
          <b>↗</b>
        </button>
      </div>
      <div className="ov-world">
        <section
          className="ov-intro"
          id="ov-explore"
          tabIndex={-1}
          key={view.level === "city" ? "city" : view.id}
        >
          <div className="ov-kicker">
            <span />
            {view.level === "city"
              ? t("YOUR NEXT ADVENTURE IS AROUND THE CORNER")
              : view.level === "borough"
                ? t("01 / PICK A LITTLE PART OF THE CITY")
                : view.level === "zone"
                  ? t("02 / FOLLOW YOUR CURIOSITY")
                  : t("03 / YOU\u2019VE FOUND SOMETHING")}
          </div>
          <h1>{title}</h1>
          <p className="ov-intro-description">
            {view.level === "city" ? (
              <>
                <span className="ov-desktop-title">
                  {t(
                    "Wander a little. Notice a little more. Uncover the stories hiding in plain sight, with someone you love exploring with.",
                  )}
                </span>
                <span className="ov-phone-title">
                  {t("Find the stories hiding in plain sight.")}
                </span>
              </>
            ) : view.level === "borough" ? (
              choices.length ? (
                t(
                  "Start with a neighbourhood. Let one discovery lead to another.",
                )
              ) : (
                t(
                  "A whole district of untold stories. Our first field notes begin in Cuauht\u00E9moc and Miguel Hidalgo.",
                )
              )
            ) : view.level === "zone" ? (
              zone ? (
                t(zone.tagline)
              ) : (
                ""
              )
            ) : (
              place?.teaser
            )}
          </p>
          {view.level === "city" ? (
            <button
              className="ov-primary"
              onClick={() => go({ level: "borough", id: "09015" })}
            >
              {t("Let\u2019s get a little lost")}
              <span>↗</span>
            </button>
          ) : view.level === "borough" ? (
            choices.length ? (
              <div className="ov-choices">
                {choices.map((z, i) => (
                  <button
                    key={z.id}
                    onClick={() => go({ level: "zone", id: z.id })}
                  >
                    <small>0{i + 1}</small>
                    <span>{z.name}</span>
                    <b>↗</b>
                  </button>
                ))}
              </div>
            ) : (
              <button
                className="ov-primary"
                onClick={() => go({ level: "city" })}
              >
                {t("Find our first stories")}
                <span>↗</span>
              </button>
            )
          ) : view.level === "zone" ? (
            <div className="ov-choices">
              {STORIES.filter((s) => s.zone === view.id).map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => go({ level: "place", id: s.id })}
                >
                  <small>0{i + 1}</small>
                  <span>{storyById(s.id, locale).place}</span>
                  <b>{journal.players[player][s.id]?.read ? "✓" : "↗"}</b>
                </button>
              ))}
            </div>
          ) : place ? (
            <div className="ov-place-actions">
              <button
                className="ov-primary"
                onClick={() => setStory(place.id)}
                disabled={!ready}
              >
                {t("Open the story")}
                <span>↗</span>
              </button>
              <button
                className="ov-save-place"
                onClick={() =>
                  update(place.id, {
                    saved: !journal.players[player][place.id]?.saved,
                  })
                }
                disabled={!ready}
                aria-pressed={!!journal.players[player][place.id]?.saved}
              >
                {journal.players[player][place.id]?.saved
                  ? t("\u2665 Saved for a wander")
                  : t("\u2661 Save for a wander")}
              </button>
            </div>
          ) : null}
          <div className="ov-intro-footnote">
            {view.level === "city" ? (
              <>
                <span className="ov-spark">✳</span>
                <p>
                  {t("Made for Susy & Stepan.")}
                  <br />
                  <strong>{t("Four stories. A beginning.")}</strong>
                </p>
              </>
            ) : (
              <button className="ov-back" onClick={() => go(parentView(view))}>
                {t("\u2190 Pull back a little")}
              </button>
            )}
          </div>
        </section>
        <MapCanvas view={view} go={go} />
        <div className="ov-scale">
          <span>
            {view.level === "city"
              ? t("16 boroughs / infinite curiosity")
              : view.level === "borough"
                ? t("A borough, one step closer")
                : view.level === "zone"
                  ? t("A neighbourhood to wander")
                  : t("One place. Another perspective.")}
          </span>
          <div aria-hidden="true">
            {["city", "borough", "zone", "place"].map((level, i) => (
              <i
                key={level}
                className={view.level === level ? "is-active" : ""}
              >
                {String(i + 1).padStart(2, "0")}
              </i>
            ))}
          </div>
        </div>
      </div>
      <section className="ov-points-trail" aria-label={t("Discovery points")}>
        <div>
          <span className="ov-eyebrow">{t("Your discovery trail")}</span>
          <strong>
            {score} <small>pts</small>
          </strong>
          <p>
            {difference === 0
              ? t("Tied with {rival}", { rival })
              : difference > 0
                ? t("{count} points ahead of {rival}", {
                    count: difference,
                    rival,
                  })
                : t("{count} points to catch {rival}", {
                    count: -difference,
                    rival,
                  })}
          </p>
        </div>
        <div className="ov-points-actions">
          <span>
            {t("Story")} <b>+10</b>
          </span>
          <span>
            {t("Visit")} <b>+25</b>
          </span>
          <span>
            {t("Photo")} <b>+15</b>
          </span>
          <button onClick={() => setChapter(true)}>
            {t("Quiz")} <b>+20 ↗</b>
          </button>
          <button onClick={() => setNahuatl(true)}>
            Náhuatl <b>+10 / +20 ↗</b>
          </button>
          <small>{t("Prototype scoring · each reward counts once")}</small>
        </div>
      </section>
      <footer className="ov-bottom">
        <span>
          <i />
          {t("Playing as")} <strong>{player}</strong>
          <span className="ov-bottom-extra">
            {t(" · {rival} is exploring too", { rival })}
          </span>
        </span>
        <button onClick={() => setAbout(true)}>
          {t("A note about this world \u2197")}
        </button>
      </footer>
      {message ? (
        <div className="ov-toast" role="status">
          <span>{t(message, { points: rewardNotice })}</span>
          <button
            onClick={() => setMessage("")}
            aria-label={t("Dismiss notification")}
          >
            ×
          </button>
        </div>
      ) : null}
      {chapter ? (
        <OverviewChapter
          close={() => setChapter(false)}
          learning={journal.learning?.[player] ?? {}}
          award={award}
          player={player}
          total={score}
          nahuatl={() => {
            setChapter(false);
            setNahuatl(true);
          }}
        />
      ) : null}
      {nahuatl ? (
        <NahuatlGames
          close={() => setNahuatl(false)}
          learning={journal.learning?.[player] ?? {}}
          award={award}
          player={player}
          total={score}
        />
      ) : null}
      {story ? (
        <StoryReader
          key={story}
          id={story}
          close={() => setStory(null)}
          collected={!!journal.players[player][story]?.read}
          collect={() => {
            update(story, { read: true });
          }}
          fieldwork={() => {
            setStory(null);
            setBook(true);
          }}
        />
      ) : null}
      {book ? (
        <FieldJournal
          journal={journal}
          player={player}
          setPlayer={setPlayer}
          update={update}
          replace={(incoming) =>
            save(mergeJournals(currentJournal.current, incoming))
          }
          close={() => setBook(false)}
          initialStory={place?.id}
          explore={(id) => go({ level: "place", id })}
        />
      ) : null}
      {about ? (
        <GameDialog
          label={t("About this world")}
          close={() => setAbout(false)}
          className="ov-about"
        >
          <span className="ov-eyebrow">{t("A work in progress, for two")}</span>
          <h2>
            {t("A real city.")}
            <br />
            <em>{t("A curious eye.")}</em>
          </h2>
          <p>
            {t(
              "Mexico city discovery game is an illustrated field guide and a friendly discovery game for Susy and Stepan. Explore four researched stories across three zones, keep a list, then bring your own photographs back.",
            )}
          </p>
          <p>
            <a href="/mexico-city/game-design" className="ov-design-link">
              {t("Game design and future direction")} ↗
            </a>
          </p>
          <h3>{t("How discoveries count")}</h3>
          <p>
            {t(
              "Collect a story for 10 points, record a visit for 25, and add your own photograph for 15. Each counts once per place, per person. Visits are on your honour. Both profiles live in this browser; use journal export and import to exchange discoveries between devices.",
            )}
          </p>
          <p>
            {t(
              "An overview earns 15 points; each correct challenge earns 20, once per person. Practice never subtracts points.",
            )}
          </p>
          <h3>{t("A map made for curiosity")}</h3>
          <p>
            {t("The sixteen borough outlines come from")}{" "}
            <a
              href="https://serviciosatlas.sgirpc.cdmx.gob.mx/arcgis/rest/services/AtlasCapasPublicas/Limites/FeatureServer/2"
              target="_blank"
              rel="noreferrer"
            >
              {t("Mexico City\u2019s SGIRPC")}
            </a>
            {t(
              ". Places have geographic anchors; the drawings are enlarged, and exploration zones are curated, approximate areas. This map is not a walking-directions tool.",
            )}
          </p>
          <h3>{t("History, with its sources")}</h3>
          <p>
            {t(
              "The illustrations were generated for this prototype. Historical scenes are interpretations. Archive and modern reference photographs are labeled separately, with credits and licenses. Every story links to its historical source.",
            )}
          </p>
          <ul>
            {STORIES.map((s) => (
              <li key={s.id}>
                <a href={s.source.url} target="_blank" rel="noreferrer">
                  {storyById(s.id, locale).place} — {t(s.source.name)} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="ov-storage-note">
            {t("Prototype 01 \u00B7 Mexico City \u00B7 October 2026")}
          </p>
        </GameDialog>
      ) : null}
    </main>
  );
}
