"use client";
import { useState } from "react";
import {
  Camera,
  MapPin,
  ArrowUpRight,
  Check,
  Swords,
  Clock3,
} from "lucide-react";
import { useLocale } from "@/lib/mexico-city/locale";
import {
  CATEGORIES,
  ERRORS,
  type Category,
  type Challenge,
  type Command,
  type Discovery,
  type Group,
} from "@/lib/mexico-city/field-game";
import { preparePhoto } from "@/lib/mexico-city/photo";
import { directions, type Coordinate } from "@/lib/mexico-city/map-engine";
export type Draft = {
  id: string;
  title: string;
  category: Category;
  note: string;
  place: string;
  point: Coordinate | null;
  photo: string;
  publish: boolean;
  challengeId?: string;
  groupId?: string;
};
export const newDraft = (): Draft => ({
  id: crypto.randomUUID(),
  title: "",
  category: "art",
  note: "",
  place: "",
  point: null,
  photo: "",
  publish: false,
});
export type Send = (
  command: Omit<Command, "id"> & { id?: string },
) => Promise<boolean>;
export function Capture({
  draft,
  change,
  pick,
  submit,
  busy,
  guest,
  challenge,
}: {
  draft: Draft;
  change: (draft: Draft) => void;
  pick: () => void;
  submit: () => void;
  busy: boolean;
  guest: boolean;
  challenge?: Challenge;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [processing, setProcessing] = useState(false),
    [error, setError] = useState("");
  return (
    <>
      <p className="mc-eyebrow">
        {say(
          "No se trata de llegar. Se trata de mirar.",
          "It’s about what you notice.",
        )}
      </p>
      <h2>{say("Esto lo encontré yo.", "I found this.")}</h2>
      <p>
        {say(
          "Una foto, un lugar y algo que quieras recordar.",
          "A photo, a place and something you want to remember.",
        )}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.photo || !draft.point) {
            setError(
              say(
                "Agrega una foto y coloca el pin.",
                "Add a photo and place the pin.",
              ),
            );
            return;
          }
          submit();
        }}
      >
        <label className={`mc-photo-input ${draft.photo ? "has-photo" : ""}`}>
          {draft.photo ? (
            <img
              src={draft.photo}
              alt={say("Tu foto seleccionada", "Your selected photo")}
            />
          ) : (
            <Camera size={38} />
          )}
          <span>
            {processing
              ? say("Preparando foto…", "Preparing photo…")
              : draft.photo
                ? say("Cambiar foto", "Change photo")
                : say("Tomar o elegir foto", "Take or choose a photo")}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={processing || busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setProcessing(true);
              setError("");
              try {
                change({ ...draft, photo: await preparePhoto(file) });
              } catch (error) {
                setError(
                  (ERRORS[
                    error instanceof Error ? error.message : "photo_invalid"
                  ] || ERRORS.photo_invalid)[locale === "es" ? 0 : 1],
                );
              } finally {
                setProcessing(false);
              }
            }}
          />
        </label>
        <label>
          {say("¿Qué encontraste?", "What did you find?")}
          <input
            required
            maxLength={100}
            value={draft.title}
            onChange={(e) => change({ ...draft, title: e.target.value })}
            placeholder={say(
              "Ese mural de la esquina…",
              "That mural on the corner…",
            )}
          />
        </label>
        <label>
          {say("Categoría", "Category")}
          <select
            value={draft.category}
            disabled={!!challenge}
            onChange={(e) =>
              change({ ...draft, category: e.target.value as Category })
            }
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name[locale === "es" ? 0 : 1]}
              </option>
            ))}
          </select>
        </label>
        <label>
          {say("Nombre del lugar o calle", "Place or street name")}
          <input
            required
            maxLength={120}
            value={draft.place}
            onChange={(e) => change({ ...draft, place: e.target.value })}
          />
        </label>
        <button type="button" className="mc-secondary" onClick={pick}>
          <MapPin size={18} />
          {draft.point
            ? say("Pin colocado · ajustar", "Pin placed · adjust")
            : say("Colocar el pin en el mapa", "Place the pin on the map")}
        </button>
        <label>
          {say("Lo que no quieres olvidar", "What you want to remember")}
          <textarea
            maxLength={1000}
            rows={3}
            value={draft.note}
            onChange={(e) => change({ ...draft, note: e.target.value })}
            placeholder={say(
              "Un detalle, una conversación, algo que te sorprendió…",
              "A detail, a conversation, something that surprised you…",
            )}
          />
        </label>
        {challenge && (
          <div className="mc-note">
            <Swords size={18} />
            <div>
              <strong>{challenge.title}</strong>
              <p>
                {say(
                  "Tu foto irá a revisión de la otra persona. Los puntos del reto llegan después de confirmarla.",
                  "Your photo goes to the other person for review. Challenge points arrive after confirmation.",
                )}
              </p>
            </div>
          </div>
        )}
        {challenge && (
          <button
            type="button"
            className="mc-text-button"
            onClick={() =>
              change({ ...draft, challengeId: undefined, groupId: undefined })
            }
          >
            {say("Guardar solo en mi bitácora", "Save only to my logbook")}
          </button>
        )}
        {!guest && (
          <label className="mc-check">
            <input
              type="checkbox"
              checked={draft.publish}
              onChange={(e) => change({ ...draft, publish: e.target.checked })}
            />
            <span>
              {say(
                "También proponer para Toda CDMX",
                "Also propose for All CDMX",
              )}
              <small>
                {say(
                  "Tu nombre, foto, texto y pin serían públicos tras revisión. Déjalo apagado para conservarlo en privado o en tu reto.",
                  "Your name, photo, text and pin would be public after review. Leave off to keep it private or within your challenge.",
                )}
              </small>
            </span>
          </label>
        )}
        {error && (
          <p className="mc-error" role="alert">
            {error}
          </p>
        )}
        <button className="mc-primary" disabled={busy || processing}>
          <Check size={18} />
          {busy
            ? say("Guardando…", "Saving…")
            : say("Guardar hallazgo · +30", "Keep discovery · +30")}
        </button>
        <small>
          {guest
            ? say(
                "Solo en esta sesión. Se pierde al recargar o cerrar.",
                "Only in this session. Reloading or closing loses it.",
              )
            : say(
                "Se guardará en tu bitácora. La foto conserva la evidencia, no sus metadatos.",
                "Saved to your logbook. The photo keeps your evidence, without its metadata.",
              )}
        </small>
      </form>
    </>
  );
}
export function ChallengeComposer({
  group,
  me,
  send,
  busy,
  done,
}: {
  group: Group;
  me: string;
  send: Send;
  busy: boolean;
  done: () => void;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [together, setTogether] = useState(false),
    [card, setCard] = useState(false);
  const others = group.members.filter((m) => m.id !== me);
  return (
    <>
      <p className="mc-eyebrow">
        {say("Una excusa para cambiar de ruta", "A reason to change routes")}
      </p>
      <h2>{say("Ponle un reto.", "Send a challenge.")}</h2>
      {!others.length ? (
        <p>
          {say(
            "Invita a alguien al grupo para empezar.",
            "Invite someone to the group to begin.",
          )}
        </p>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const result = await send({
              kind: card ? "block" : "challenge",
              groupId: group.id,
              target: String(data.get("target")),
              category: data.get("category") as Category,
              ...(card
                ? {}
                : {
                    title: String(data.get("title")),
                    duration: Number(data.get("duration")),
                    reward: Number(data.get("reward")),
                    loss: together ? 0 : Number(data.get("loss")),
                    together,
                  }),
            });
            if (result) done();
          }}
        >
          <div className="mc-segment">
            <button
              type="button"
              aria-pressed={!card}
              onClick={() => setCard(false)}
            >
              {say("Reto", "Challenge")}
            </button>
            <button
              type="button"
              aria-pressed={card}
              onClick={() => setCard(true)}
            >
              {say("Carta de cambio", "Change-of-plan card")}
            </button>
          </div>
          <label>
            {say("Para", "For")}
            <select name="target">
              {others.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {card
              ? say("Pausar esta categoría", "Pause this category")
              : say("Qué van a explorar", "What to explore")}
            <select name="category">
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name[locale === "es" ? 0 : 1]}
                </option>
              ))}
            </select>
          </label>
          {card ? (
            <p className="mc-note">
              {say(
                "Una carta por persona, durante 24 h. Impide aceptar nuevos retos de esa categoría; nunca cancela retos aceptados ni bloquea tu bitácora personal.",
                "One active card per sender, for 24 hours. It prevents accepting new challenges in that category; it never cancels accepted challenges or blocks the personal logbook.",
              )}
            </p>
          ) : (
            <>
              <label>
                {say("Tu propuesta", "Your proposal")}
                <input
                  required
                  name="title"
                  maxLength={100}
                  placeholder={say(
                    "Encuentra un rótulo pintado a mano",
                    "Find a hand-painted sign",
                  )}
                />
              </label>
              <label className="mc-check">
                <input
                  type="checkbox"
                  checked={together}
                  onChange={(e) => setTogether(e.target.checked)}
                />
                <span>{say("Hagámoslo juntos", "Let’s do it together")}</span>
              </label>
              <label>
                {say("Tiempo desde que acepta", "Time from acceptance")}
                <select name="duration">
                  <option value="10">10 min</option>
                  <option value="60">1 h</option>
                  <option value="1440">24 h</option>
                </select>
              </label>
              <div className="mc-two-columns">
                <label>
                  {say("Al completar", "On completion")}
                  <select name="reward" defaultValue="100">
                    {[50, 100, 150].map((n) => (
                      <option key={n} value={n}>
                        +{n}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  {say("Si vence o abandona", "If expired or forfeited")}
                  <select name="loss" disabled={together} defaultValue="0">
                    {[0, 25, 50].map((n) => (
                      <option key={n} value={n}>
                        {n ? `−${n}` : "0"}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="mc-muted">
                {together
                  ? say(
                      "Cada quien entrega su foto a tiempo y confirma la del otro. Ambos ganan; no hay penalización.",
                      "Each person submits their own photo on time and confirms the other’s. Both earn points; no penalty.",
                    )
                  : say(
                      "El reloj empieza al aceptar. Declinar una propuesta no quita puntos. Una entrega a tiempo espera revisión sin penalización.",
                      "The clock starts on acceptance. Declining an offer costs nothing. On-time evidence waits for review without penalty.",
                    )}
              </p>
            </>
          )}
          <button className="mc-primary" disabled={busy}>
            <Swords size={18} />
            {card
              ? say("Jugar carta · 24 h", "Play card · 24 h")
              : say("Enviar propuesta", "Send proposal")}
          </button>
        </form>
      )}
    </>
  );
}
export function RecordDetails({
  record,
  own,
  send,
  busy,
}: {
  record: Discovery;
  own: boolean;
  send: Send;
  busy: boolean;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  return (
    <>
      <img className="mc-record-photo" src={record.photo} alt={record.title} />
      <p className="mc-eyebrow">
        {record.name} ·{" "}
        {new Date(record.createdAt).toLocaleDateString(
          locale === "es" ? "es-MX" : "en",
        )}
      </p>
      <h2>{record.title}</h2>
      <p>
        <MapPin size={16} /> {record.place}
      </p>
      <p className="mc-preserve">{record.note}</p>
      <div className="mc-button-pair">
        <a
          className="mc-secondary"
          href={directions(record, "walking")}
          target="_blank"
          rel="noreferrer"
        >
          {say("Cómo llegar a pie", "Walking directions")}
          <ArrowUpRight size={17} />
        </a>
        <a
          className="mc-secondary"
          href={directions(record, "transit")}
          target="_blank"
          rel="noreferrer"
        >
          {say("En transporte", "By transit")}
          <ArrowUpRight size={17} />
        </a>
      </div>
      <p className="mc-note">
        {record.publication === "approved"
          ? say("Publicado en Toda CDMX", "Published in All CDMX")
          : record.publication === "pending"
            ? say(
                "Propuesto para Toda CDMX · en revisión",
                "Proposed for All CDMX · awaiting review",
              )
            : record.groupId
              ? say(
                  "Compartido solo con tu grupo",
                  "Shared only with your group",
                )
              : say("En tu bitácora privada", "In your private logbook")}
      </p>
      {own && ["private", "rejected"].includes(record.publication) && (
        <details>
          <summary>
            {say("Proponer para Toda CDMX", "Propose for All CDMX")}
          </summary>
          <p>
            {say(
              "Tu nombre, esta foto, el texto y el pin serán públicos si se aprueba. Tus retos y los datos de tu grupo siguen siendo privados.",
              "Your name, this photo, text and pin will be public if approved. Your challenges and group details remain private.",
            )}
          </p>
          <button
            className="mc-secondary"
            disabled={busy}
            onClick={() => void send({ kind: "publish", recordId: record.id })}
          >
            {say("Enviar a revisión pública", "Submit for public review")}
          </button>
        </details>
      )}
    </>
  );
}
export function ChallengeCard({
  challenge: c,
  group,
  me,
  records,
  send,
  busy,
  capture,
  now,
}: {
  challenge: Challenge;
  group: Group;
  me: string;
  records: Discovery[];
  send: Send;
  busy: boolean;
  capture: () => void;
  now: number;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [review, setReview] = useState<string | null>(null),
    [feedback, setFeedback] = useState(""),
    [forfeit, setForfeit] = useState(false);
  const name = (id: string) =>
    group.members.find((m) => m.id === id)?.name ||
    say("Explorador", "Explorer");
  const statuses = {
    offered: ["Propuesta", "Proposal"],
    active: ["En la calle", "Out exploring"],
    submitted: ["Evidencia en revisión", "Evidence under review"],
    clarification: ["Falta un detalle", "Needs a detail"],
    confirmed: ["Reto confirmado", "Challenge confirmed"],
    declined: ["Declinado", "Declined"],
    expired: ["Tiempo terminado", "Time expired"],
    forfeited: ["Abandonado", "Forfeited"],
    incomplete: ["Salida incompleta", "Incomplete outing"],
  };
  const pending = ["active", "submitted", "clarification"].includes(c.status);
  const canSubmit =
    pending &&
    (c.target === me || (c.together && c.sender === me)) &&
    (!c.evidence[me] || c.evidence[me].status === "clarification");
  const reviewable = Object.entries(c.evidence).filter(
    ([id, ev]) =>
      id !== me &&
      ev.status !== "confirmed" &&
      (c.sender === me || (c.together && c.target === me)),
  );
  const remaining = Math.max(0, Math.ceil(((c.deadline || now) - now) / 60000));
  return (
    <article
      className={`mc-challenge ${c.status === "confirmed" ? "is-won" : ""}`}
    >
      <div className="mc-row">
        <span className="mc-eyebrow">
          {statuses[c.status][locale === "es" ? 0 : 1]}
        </span>
        <strong className="mc-reward">+{c.reward}</strong>
      </div>
      <h3>{c.title}</h3>
      <p className="mc-muted">
        {name(c.sender)} → {name(c.target)}
        {c.together ? say(" · juntos", " · together") : ""}
      </p>
      <div className="mc-challenge-meta">
        <span>
          <Clock3 size={14} />
          {c.status === "offered"
            ? `${c.duration >= 60 ? c.duration / 60 + " h" : c.duration + " min"}`
            : pending && !c.evidence[me]
              ? `${remaining} min`
              : pending
                ? say("Entrega protegida", "Submission protected")
                : statuses[c.status][locale === "es" ? 0 : 1]}
        </span>
        <span>
          {say("En juego", "At stake")} {c.loss ? `−${c.loss}` : "0"}
        </span>
      </div>
      {c.target === me && c.status === "offered" && (
        <div className="mc-button-pair">
          <button
            className="mc-primary"
            disabled={busy}
            onClick={() =>
              void send({
                kind: "accept",
                groupId: group.id,
                challengeId: c.id,
              })
            }
          >
            {say("Aceptar y salir", "Accept and head out")}
          </button>
          <button
            className="mc-text-button"
            disabled={busy}
            onClick={() =>
              void send({
                kind: "decline",
                groupId: group.id,
                challengeId: c.id,
              })
            }
          >
            {say("Ahora no", "Not now")}
          </button>
        </div>
      )}
      {c.evidence[me]?.status === "clarification" && (
        <p className="mc-note">
          {c.evidence[me].feedback ||
            say(
              "La otra persona pidió una foto más clara.",
              "The other person requested a clearer photo.",
            )}
        </p>
      )}
      {canSubmit && (
        <button className="mc-primary" onClick={capture}>
          <Camera size={17} />
          {say("Ya lo encontré", "I found it")}
        </button>
      )}
      {reviewable.map(([id, evidence]) => {
        const record = records.find((r) => r.id === evidence.recordId);
        return (
          <div className="mc-evidence" key={id}>
            {record && (
              <>
                <img src={record.photo} alt={record.title} />
                <strong>{record.title}</strong>
                <small>{record.place}</small>
                <p>{record.note}</p>
              </>
            )}
            <button
              className="mc-secondary"
              onClick={() => setReview(review === id ? null : id)}
            >
              {say("Revisar evidencia de", "Review evidence from")} {name(id)}
            </button>
            {review === id && (
              <>
                <label>
                  {say(
                    "Un comentario para tu compañero",
                    "A note for your friend",
                  )}
                  <input
                    value={feedback}
                    maxLength={1000}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </label>
                <div className="mc-button-pair">
                  <button
                    className="mc-primary"
                    disabled={busy}
                    onClick={() =>
                      void send({
                        kind: "review",
                        groupId: group.id,
                        challengeId: c.id,
                        target: id,
                        decision: "confirm",
                        note: feedback,
                      })
                    }
                  >
                    {say("Confirmar hallazgo", "Confirm discovery")}
                  </button>
                  <button
                    className="mc-secondary"
                    disabled={busy}
                    onClick={() =>
                      void send({
                        kind: "review",
                        groupId: group.id,
                        challengeId: c.id,
                        target: id,
                        decision: "clarify",
                        note: feedback,
                      })
                    }
                  >
                    {say("Pedir un detalle", "Ask for a detail")}
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
      {c.target === me && c.status === "active" && (
        <>
          {forfeit ? (
            <div className="mc-note">
              <p>
                {say(
                  `Abandonar resta ${c.loss} puntos. ¿Lo dejamos aquí?`,
                  `Forfeiting costs ${c.loss} points. Stop here?`,
                )}
              </p>
              <button
                className="mc-text-button"
                disabled={busy}
                onClick={() =>
                  void send({
                    kind: "forfeit",
                    groupId: group.id,
                    challengeId: c.id,
                  })
                }
              >
                {say("Sí, abandonar", "Yes, forfeit")}
              </button>
              <button
                className="mc-text-button"
                onClick={() => setForfeit(false)}
              >
                {say("Seguir jugando", "Keep playing")}
              </button>
            </div>
          ) : (
            <button
              className="mc-text-button mc-subtle"
              onClick={() => setForfeit(true)}
            >
              {say("Abandonar reto", "Forfeit challenge")}
            </button>
          )}
        </>
      )}
    </article>
  );
}
