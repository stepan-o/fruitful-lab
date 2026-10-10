"use client";

import { useRef, useState } from "react";
import { STORIES, storyById, type StoryId } from "@/lib/mexico-city/content";
import {
  blankEntry,
  parseJournal,
  PLAYERS,
  points,
  preparePhoto,
  type Entry,
  type Journal,
  type Player,
} from "@/lib/mexico-city/journal";
import Artwork from "./Artwork";
import GameDialog from "./GameDialog";

export default function FieldJournal({
  journal,
  player,
  setPlayer,
  update,
  replace,
  close,
  initialStory,
  explore,
}: {
  journal: Journal;
  player: Player;
  setPlayer: (p: Player) => void;
  update: (id: StoryId, changes: Partial<Entry>, owner?: Player) => void;
  replace: (journal: Journal) => void;
  close: () => void;
  initialStory?: StoryId;
  explore: (id: StoryId) => void;
}) {
  const [selected, setSelected] = useState<StoryId>(initialStory ?? "zocalo");
  const [savedOnly, setSavedOnly] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const importInput = useRef<HTMLInputElement>(null);
  const entry = journal.players[player][selected] ?? blankEntry();
  const story = storyById(selected);
  const rival = player === "Susy" ? "Stepan" : "Susy";
  const score = points(journal.players[player]);
  const difference = score - points(journal.players[rival]);
  function exportJournal() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(journal, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `otra-vista-journal-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage(
      "Journal exported. Import it on another device to combine discoveries.",
    );
  }
  return (
    <GameDialog
      label="Field journal"
      close={close}
      className="ov-journal-dialog"
    >
      <header className="ov-journal-heading">
        <span className="ov-eyebrow">Little adventures, kept forever</span>
        <h2>
          The field journal<span>✳</span>
        </h2>
        <p>Two curious people. One very big city.</p>
      </header>
      <div className="ov-players">
        {PLAYERS.map((p) => (
          <button
            key={p}
            onClick={() => setPlayer(p)}
            aria-pressed={player === p}
          >
            <span className={`ov-avatar ov-avatar--${p.toLowerCase()}`}>
              {p[0]}
            </span>
            <span>
              {p}
              <small>{player === p ? "Your journal" : "Switch explorer"}</small>
            </span>
            <strong>
              {points(journal.players[p])}
              <small>pts</small>
            </strong>
          </button>
        ))}
      </div>
      <p className="ov-rivalry">
        {difference === 0
          ? "A beautiful tie. The next discovery is yours."
          : difference > 0
            ? `You’re ${difference} points ahead of ${rival}. Keep looking.`
            : `${rival} is ${-difference} points ahead. There’s a city to catch up in.`}
      </p>
      <div className="ov-journal-layout">
        <nav className="ov-journal-index" aria-label="Journal discoveries">
          <div className="ov-filter">
            <button
              aria-pressed={!savedOnly}
              onClick={() => setSavedOnly(false)}
            >
              All discoveries
            </button>
            <button aria-pressed={savedOnly} onClick={() => setSavedOnly(true)}>
              Want to go
            </button>
          </div>
          {STORIES.filter(
            (s) => !savedOnly || journal.players[player][s.id]?.saved,
          ).map((s) => (
            <button
              className={`ov-entry-link ${selected === s.id ? "is-active" : ""}`}
              key={s.id}
              onClick={() => setSelected(s.id)}
              aria-pressed={selected === s.id}
            >
              <Artwork id={s.id} sizes="90px" />
              <span>
                {s.place}
                <small>
                  {journal.players[player][s.id]?.visited
                    ? "Visited ✓"
                    : journal.players[player][s.id]?.read
                      ? "Story collected"
                      : "A story waiting"}
                </small>
              </span>
            </button>
          ))}
          {savedOnly &&
          !STORIES.some((s) => journal.players[player][s.id]?.saved) ? (
            <p className="ov-empty">
              Your next little adventure starts with a saved place.
            </p>
          ) : null}
        </nav>
        <section className="ov-journal-entry" aria-label={story.place}>
          <span className="ov-eyebrow">{story.place}</span>
          <h3>{story.short}</h3>
          <p>{story.prompt}</p>
          <div className="ov-entry-actions">
            <button
              onClick={() => update(selected, { saved: !entry.saved })}
              aria-pressed={entry.saved}
            >
              {entry.saved ? "♥ On your list" : "♡ Want to go"}
            </button>
            <button onClick={() => explore(selected)}>Find on map ↗</button>
          </div>
          <div className="ov-rewards">
            <span className={entry.read ? "is-done" : ""}>
              Story <b>{entry.read ? "✓" : "+10"}</b>
            </span>
            <span className={entry.visited ? "is-done" : ""}>
              Visit <b>{entry.visited ? "✓" : "+25"}</b>
            </span>
            <span className={entry.photo ? "is-done" : ""}>
              Photo <b>{entry.photo ? "✓" : "+15"}</b>
            </span>
          </div>
          <label className="ov-visit">
            <input
              type="checkbox"
              checked={entry.visited}
              onChange={(e) => update(selected, { visited: e.target.checked })}
            />
            <span>
              I went here<small>On your honour. No location tracking.</small>
            </span>
          </label>
          <label className="ov-note">
            A detail I noticed
            <textarea
              key={`${player}-${selected}`}
              maxLength={500}
              value={entry.note}
              placeholder="The thing you’d have walked right past…"
              onChange={(e) => update(selected, { note: e.target.value })}
            />
          </label>
          {entry.photo ? (
            <figure className="ov-your-photo">
              {/* Already resized and encoded locally; this private data URL never reaches an image server. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.photo}
                alt={`${player}’s observation at ${story.place}`}
              />
              <figcaption>
                Your field photograph{" "}
                <button onClick={() => update(selected, { photo: "" })}>
                  Remove
                </button>
              </figcaption>
            </figure>
          ) : null}
          <label className={`ov-photo-button ${busy ? "is-busy" : ""}`}>
            {busy
              ? "Preparing your photograph…"
              : entry.photo
                ? "↻ Replace photograph"
                : "＋ Add a field photograph"}
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              onChange={async (e) => {
                const file = e.currentTarget.files?.[0];
                e.currentTarget.value = "";
                if (!file) return;
                const owner = player;
                const id = selected;
                setBusy(true);
                try {
                  const photo = await preparePhoto(file);
                  update(id, { photo }, owner);
                  setMessage(
                    "Photograph added. A new way to remember this place.",
                  );
                } catch (error) {
                  setMessage(
                    error instanceof Error
                      ? error.message
                      : "Could not read this photograph.",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            />
          </label>
          <small className="ov-storage-note">
            Photos and notes stay in this browser. Points count once per place.
          </small>
        </section>
      </div>
      <footer className="ov-journal-footer">
        <p>
          <strong>Saved on this device</strong>
          <br />
          Export your journal before clearing browser data. Import a journal to
          combine both players’ discoveries; existing notes and photos are kept.
        </p>
        <div>
          <button onClick={exportJournal}>Export journal ↓</button>
          <button onClick={() => importInput.current?.click()}>
            Import journal ↑
          </button>
        </div>
        <input
          ref={importInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={async (e) => {
            const file = e.currentTarget.files?.[0];
            e.currentTarget.value = "";
            if (!file) return;
            try {
              if (file.size > 3_000_000)
                throw new Error("Please choose a journal under 3 MB.");
              const imported = parseJournal(JSON.parse(await file.text()));
              replace(imported);
              setMessage(
                "Journals combined. Your existing notes and photos were kept.",
              );
            } catch (error) {
              setMessage(
                error instanceof Error
                  ? error.message
                  : "This journal could not be imported.",
              );
            }
          }}
        />
      </footer>
      <p role="status" className="ov-journal-message">
        {message}
      </p>
    </GameDialog>
  );
}
