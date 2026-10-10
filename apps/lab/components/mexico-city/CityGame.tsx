"use client";

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

const StoryReader = dynamic(() => import("./StoryReader"));
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
  const [view, setView] = useState<View>({ level: "city" });
  const [journal, setJournal] = useState<Journal>(blankJournal);
  const currentJournal = useRef(journal);
  const [ready, setReady] = useState(false);
  const [player, setActivePlayer] = useState<Player>("Susy");
  const [story, setStory] = useState<StoryId | null>(null);
  const [book, setBook] = useState(false);
  const [about, setAbout] = useState(false);
  const [message, setMessage] = useState("");
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
  function go(next: View) {
    setView(next);
    setStory(null);
    setBook(false);
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
          ? storyById(view.id).borough
          : null;
  const borough = geography.boroughs.find((b) => b.id === boroughId);
  const zone =
    view.level === "zone"
      ? zoneById(view.id)
      : view.level === "place"
        ? zoneById(storyById(view.id).zone)
        : null;
  const place = view.level === "place" ? storyById(view.id) : null;
  const choices =
    view.level === "borough" ? ZONES.filter((z) => z.borough === view.id) : [];
  const title =
    view.level === "city" ? (
      <>
        <span className="ov-desktop-title">
          A city.
          <br />A thousand
          <br />
        </span>
        <span className="ov-phone-title">
          A city of
          <br />
        </span>
        <em>little surprises.</em>
      </>
    ) : view.level === "borough" ? (
      <>
        {borough?.name}
        <em> awaits.</em>
      </>
    ) : view.level === "zone" ? (
      <>
        {zone?.name}
        <em>Up close.</em>
      </>
    ) : (
      place?.title
    );
  const rival = player === "Susy" ? "Stepan" : "Susy";

  return (
    <main className="ov-game" data-level={view.level}>
      <a href="#ov-explore" className="ov-skip">
        Skip to discoveries
      </a>
      <header className="ov-header">
        <button
          className="ov-wordmark"
          aria-label="Otra Vista, return to city"
          onClick={() => go({ level: "city" })}
        >
          otra vista<span>✳</span>
          <small>MEXICO CITY, RESEEN</small>
        </button>
        <div className="ov-scoreboard" aria-label="Discovery points">
          {PLAYERS.map((p) => (
            <button
              key={p}
              onClick={() => setPlayer(p)}
              aria-pressed={player === p}
              aria-label={`Play as ${p}, ${points(journal.players[p])} points`}
            >
              <span className={`ov-avatar ov-avatar--${p.toLowerCase()}`}>
                {p[0]}
              </span>
              <span className="ov-player-name">{p}</span>
              <strong>{points(journal.players[p])}</strong>
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
          <span>Field journal</span>
          <i>↗</i>
        </button>
      </header>
      <nav className="ov-breadcrumb" aria-label="Map scale">
        <button
          onClick={() => go({ level: "city" })}
          aria-current={view.level === "city" ? "page" : undefined}
        >
          The city
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
            / a field guide for the curious
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
            <span className="ov-breadcrumb-place">A discovery</span>
          </>
        ) : null}
      </nav>
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
              ? "YOUR NEXT ADVENTURE IS AROUND THE CORNER"
              : view.level === "borough"
                ? "01 / PICK A LITTLE PART OF THE CITY"
                : view.level === "zone"
                  ? "02 / FOLLOW YOUR CURIOSITY"
                  : "03 / YOU’VE FOUND SOMETHING"}
          </div>
          <h1>{title}</h1>
          <p className="ov-intro-description">
            {view.level === "city" ? (
              <>
                <span className="ov-desktop-title">
                  Wander a little. Notice a little more. Uncover the stories
                  hiding in plain sight, with someone you love exploring with.
                </span>
                <span className="ov-phone-title">
                  Find the stories hiding in plain sight.
                </span>
              </>
            ) : view.level === "borough" ? (
              choices.length ? (
                "Start with a neighbourhood. Let one discovery lead to another."
              ) : (
                "A whole district of untold stories. Our first field notes begin in Cuauhtémoc and Miguel Hidalgo."
              )
            ) : view.level === "zone" ? (
              zone?.tagline
            ) : (
              place?.teaser
            )}
          </p>
          {view.level === "city" ? (
            <button
              className="ov-primary"
              onClick={() => go({ level: "borough", id: "09015" })}
            >
              Let’s get a little lost <span>↗</span>
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
                Find our first stories <span>↗</span>
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
                  <span>{s.place}</span>
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
                Open the story <span>↗</span>
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
                  ? "♥ Saved for a wander"
                  : "♡ Save for a wander"}
              </button>
            </div>
          ) : null}
          <div className="ov-intro-footnote">
            {view.level === "city" ? (
              <>
                <span className="ov-spark">✳</span>
                <p>
                  Made for Susy & Stepan.
                  <br />
                  <strong>Four stories. A beginning.</strong>
                </p>
              </>
            ) : (
              <button className="ov-back" onClick={() => go(parentView(view))}>
                ← Pull back a little
              </button>
            )}
          </div>
        </section>
        <MapCanvas view={view} go={go} />
        <div className="ov-scale">
          <span>
            {view.level === "city"
              ? "16 boroughs / infinite curiosity"
              : view.level === "borough"
                ? "A borough, one step closer"
                : view.level === "zone"
                  ? "A neighbourhood to wander"
                  : "One place. Another perspective."}
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
      <footer className="ov-bottom">
        <span>
          <i />
          Playing as <strong>{player}</strong>
          <span className="ov-bottom-extra"> · {rival} is exploring too</span>
        </span>
        <button onClick={() => setAbout(true)}>
          A note about this world ↗
        </button>
      </footer>
      {message ? (
        <div className="ov-toast" role="status">
          <span>{message}</span>
          <button
            onClick={() => setMessage("")}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
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
          label="About this world"
          close={() => setAbout(false)}
          className="ov-about"
        >
          <span className="ov-eyebrow">A work in progress, for two</span>
          <h2>
            A real city.
            <br />
            <em>A curious eye.</em>
          </h2>
          <p>
            Otra Vista is an illustrated field guide and a friendly discovery
            game for Susy and Stepan. Explore four researched stories across
            three zones, keep a list, then bring your own photographs back.
          </p>
          <h3>How discoveries count</h3>
          <p>
            Collect a story for 10 points, record a visit for 25, and add your
            own photograph for 15. Each counts once per place, per person.
            Visits are on your honour. Both profiles live in this browser; use
            journal export and import to exchange discoveries between devices.
          </p>
          <h3>A map made for curiosity</h3>
          <p>
            The sixteen borough outlines come from{" "}
            <a
              href="https://serviciosatlas.sgirpc.cdmx.gob.mx/arcgis/rest/services/AtlasCapasPublicas/Limites/FeatureServer/2"
              target="_blank"
              rel="noreferrer"
            >
              Mexico City’s SGIRPC
            </a>
            . Places have geographic anchors; the drawings are enlarged, and
            exploration zones are curated, approximate areas. This map is not a
            walking-directions tool.
          </p>
          <h3>History, with its sources</h3>
          <p>
            All eight drawings were generated for this prototype. Historical
            scenes are interpretations, not archival photographs. Every story
            links to its historical source.
          </p>
          <ul>
            {STORIES.map((s) => (
              <li key={s.id}>
                <a href={s.source.url} target="_blank" rel="noreferrer">
                  {s.place} — {s.source.name} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="ov-storage-note">
            Prototype 01 · Mexico City · October 2026
          </p>
        </GameDialog>
      ) : null}
    </main>
  );
}
