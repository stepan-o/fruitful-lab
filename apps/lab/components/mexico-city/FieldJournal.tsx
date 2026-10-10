"use client";
import { journalError, useLocale } from "@/lib/mexico-city/locale";
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
  const { locale, t } = useLocale();
  const [selected, setSelected] = useState<StoryId>(initialStory ?? "zocalo");
  const [savedOnly, setSavedOnly] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const importInput = useRef<HTMLInputElement>(null);
  const entry = journal.players[player][selected] ?? blankEntry();
  const story = storyById(selected, locale);
  const rival = player === "Susy" ? "Stepan" : "Susy";
  const score = points(journal.players[player], journal.learning?.[player]);
  const difference =
    score - points(journal.players[rival], journal.learning?.[rival]);
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
      label={t("Field journal")}
      close={close}
      className="ov-journal-dialog"
    >
      <header className="ov-journal-heading">
        <span className="ov-eyebrow">
          {t("Little adventures, kept forever")}
        </span>
        <h2>
          {t("The field journal")}
          <span>✳</span>
        </h2>
        <p>{t("Two curious people. One very big city.")}</p>
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
              <small>
                {player === p ? t("Your journal") : t("Switch explorer")}
              </small>
            </span>
            <strong>
              {points(journal.players[p], journal.learning?.[p])}
              <small>pts</small>
            </strong>
          </button>
        ))}
      </div>
      <p className="ov-rivalry">
        {difference === 0
          ? t("A beautiful tie. The next discovery is yours.")
          : difference > 0
            ? t("You’re {difference} points ahead of {rival}. Keep looking.", {
                difference,
                rival,
              })
            : t(
                "{rival} is {difference} points ahead. There’s a city to catch up in.",
                { difference: -difference, rival },
              )}
      </p>
      <div className="ov-journal-layout">
        <nav className="ov-journal-index" aria-label={t("Journal discoveries")}>
          <div className="ov-filter">
            <button
              aria-pressed={!savedOnly}
              onClick={() => setSavedOnly(false)}
            >
              {t("All discoveries")}
            </button>
            <button aria-pressed={savedOnly} onClick={() => setSavedOnly(true)}>
              {t("Want to go")}
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
                {storyById(s.id, locale).place}
                <small>
                  {journal.players[player][s.id]?.visited
                    ? t("Visited \u2713")
                    : journal.players[player][s.id]?.read
                      ? t("Story collected")
                      : t("A story waiting")}
                </small>
              </span>
            </button>
          ))}
          {savedOnly &&
          !STORIES.some((s) => journal.players[player][s.id]?.saved) ? (
            <p className="ov-empty">
              {t("Your next little adventure starts with a saved place.")}
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
              {entry.saved ? t("\u2665 On your list") : t("\u2661 Want to go")}
            </button>
            <button onClick={() => explore(selected)}>
              {t("Find on map \u2197")}
            </button>
          </div>
          <div className="ov-rewards">
            <span className={entry.read ? "is-done" : ""}>
              {t("Story")}
              <b>{entry.read ? "✓" : "+10"}</b>
            </span>
            <span className={entry.visited ? "is-done" : ""}>
              {t("Visit")}
              <b>{entry.visited ? "✓" : "+25"}</b>
            </span>
            <span className={entry.photo ? "is-done" : ""}>
              {t("Photo")}
              <b>{entry.photo ? "✓" : "+15"}</b>
            </span>
          </div>
          <label className="ov-visit">
            <input
              type="checkbox"
              checked={entry.visited}
              onChange={(e) => update(selected, { visited: e.target.checked })}
            />
            <span>
              {t("I went here")}
              <small>{t("On your honour. No location tracking.")}</small>
            </span>
          </label>
          <label className="ov-note">
            {t("A detail I noticed")}
            <textarea
              key={`${player}-${selected}`}
              maxLength={500}
              value={entry.note}
              placeholder={t(
                "The thing you\u2019d have walked right past\u2026",
              )}
              onChange={(e) => update(selected, { note: e.target.value })}
            />
          </label>
          {entry.photo ? (
            <figure className="ov-your-photo">
              {/* Already resized and encoded locally; this private data URL never reaches an image server. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={entry.photo}
                alt={t("{player}’s observation at {place}", {
                  player,
                  place: story.place,
                })}
              />
              <figcaption>
                {t("Your field photograph")}{" "}
                <button onClick={() => update(selected, { photo: "" })}>
                  {t("Remove")}
                </button>
              </figcaption>
            </figure>
          ) : null}
          <label className={`ov-photo-button ${busy ? "is-busy" : ""}`}>
            {busy
              ? t("Preparing your photograph\u2026")
              : entry.photo
                ? t("\u21BB Replace photograph")
                : t("\uFF0B Add a field photograph")}
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
                    journalError(error, "Could not read this photograph."),
                  );
                } finally {
                  setBusy(false);
                }
              }}
            />
          </label>
          <small className="ov-storage-note">
            {t(
              "Photos and notes stay in this browser. Points count once per place.",
            )}
          </small>
        </section>
      </div>
      <footer className="ov-journal-footer">
        <p>
          <strong>{t("Saved on this device")}</strong>
          <br />
          {t(
            "Export your journal before clearing browser data. Import a journal to combine both players\u2019 discoveries; existing notes and photos are kept.",
          )}
        </p>
        <div>
          <button onClick={exportJournal}>{t("Export journal \u2193")}</button>
          <button onClick={() => importInput.current?.click()}>
            {t("Import journal \u2191")}
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
              if (file.size > 3000000)
                throw new Error("Please choose a journal under 3 MB.");
              const imported = parseJournal(JSON.parse(await file.text()));
              replace(imported);
              setMessage(
                "Journals combined. Your existing notes and photos were kept.",
              );
            } catch (error) {
              setMessage(
                journalError(error, "This journal could not be imported."),
              );
            }
          }}
        />
      </footer>
      <p role="status" className="ov-journal-message">
        {t(message)}
      </p>
    </GameDialog>
  );
}
