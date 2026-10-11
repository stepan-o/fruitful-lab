"use client";
import {
  BookOpen,
  Camera,
  ChevronRight,
  Compass,
  Crosshair,
  Map,
  Paintbrush,
  Search,
  Sparkles,
  Swords,
} from "lucide-react";
import { useLocale } from "@/lib/mexico-city/locale";
import {
  CATEGORIES,
  type Category,
  type Challenge,
  type Mode,
  type GOALS,
} from "@/lib/mexico-city/field-game";
import Artwork from "./Artwork";

type Props = {
  name: string;
  mode: Mode;
  points: number;
  groupName?: string;
  goal?: (typeof GOALS)[number];
  action?: { challenge: Challenge; kind: "invitation" | "review" | "outing" };
  now: number;
  pending: number;
  communityProgress: Set<Category>;
  kind: "account" | "guest" | "demo";
  draft: boolean;
  navigate: (mode: Mode) => void;
  account: () => void;
  journal: () => void;
  search: () => void;
  capture: () => void;
  locateGoal: () => void;
};

/** A small play HUD; the map remains mounted underneath every focused task. */
export default function FieldHUD(props: Props) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const { mode, points, goal, action, navigate } = props;
  const challenge = action?.challenge;
  const minutesLeft = challenge?.deadline
    ? Math.min(challenge.duration, Math.max(0, Math.ceil((challenge.deadline - props.now) / 60000)))
    : null;
  const timeLeft = minutesLeft !== null && minutesLeft >= 60
    ? `${Math.floor(minutesLeft / 60)} h ${minutesLeft % 60} min`
    : `${minutesLeft ?? 0} min`;
  const solo = mode === "home" || mode === "solo";
  const destinations = [
    { mode: "home" as const, label: say("Mapa", "Map"), Icon: Map },
    {
      mode: "solo" as const,
      label: say("Aventura", "Adventure"),
      Icon: Compass,
    },
    { mode: "friends" as const, label: say("Amigos", "Friends"), Icon: Swords },
    {
      mode: "community" as const,
      label: say("Comunidad", "Community"),
      Icon: Paintbrush,
    },
  ];
  const scoreLabel =
    mode === "community"
      ? say("tus aportes", "your contributions")
      : mode === "friends"
        ? say("pts · grupo", "pts · group")
        : say("pts · aventura", "pts · adventure");
  return (
    <>
      <header
        className="mc-play-hud"
        aria-label={say("Tu jugador", "Your player")}
      >
        <button
          className="mc-player-token"
          onClick={props.account}
          aria-label={say("Cuenta y puntuación", "Account and score")}
        >
          <span className="mc-player-portrait" aria-hidden="true">
            {props.name.slice(0, 1)}
          </span>
          <span className="mc-player-readout">
            <span className="mc-player-name">
              {mode === "friends"
                ? props.groupName || say("Tu grupo", "Your group")
                : props.name.split(" ")[0]}
            </span>
            <span className="mc-score-line">
              <Sparkles size={15} aria-hidden="true" />
              <strong key={`${mode}:${points}`} aria-live="polite">
                {points}
              </strong>
              <small>{scoreLabel}</small>
            </span>
          </span>
        </button>
        <div className="mc-hud-shortcuts">
          <button
            onClick={props.journal}
            aria-label={say("Abrir bitácora", "Open logbook")}
          >
            <BookOpen size={21} />
          </button>
          <button onClick={props.search} aria-label={say("Buscar", "Search")}>
            <Search size={21} />
          </button>
        </div>
      </header>
      {props.kind !== "account" && (
        <button className="mc-session-tag" onClick={props.account}>
          {props.kind === "demo"
            ? say("Demo · sin guardar", "Demo · not saved")
            : say("Salida de prueba · sin guardar", "Trial outing · not saved")}
        </button>
      )}
      <aside
        className={`mc-mission-tracker ${goal && solo ? "has-mission" : ""}`}
        aria-label={say("Tu siguiente paso", "Your next step")}
      >
        <button
          className="mc-mission-summary"
          onClick={() => navigate(solo ? "solo" : mode)}
        >
          <span className="mc-mission-art" aria-hidden="true">
            {solo && goal ? (
              <Artwork id={goal.art} sizes="52px" />
            ) : mode === "friends" ? (
              <Swords size={23} />
            ) : mode === "community" ? (
              <Paintbrush size={23} />
            ) : (
              <Compass size={26} />
            )}
          </span>
          <span className="mc-mission-copy">
            <small>
              {solo
                ? goal
                  ? say("SALIDA ACTIVA · +30 PTS", "ACTIVE OUTING · +30 PTS")
                  : say("LA CIUDAD TE ESPERA", "THE CITY IS WAITING")
                : mode === "friends"
                  ? say("RETOS ENTRE AMIGOS", "FRIEND CHALLENGES")
                  : say("PINTEMOS LA CIUDAD", "PAINT THE CITY")}
            </small>
            <strong>
              {solo
                ? goal
                  ? goal.title[locale === "es" ? 0 : 1]
                  : say("Elige tu próxima salida", "Choose your next outing")
                : mode === "friends"
                  ? challenge?.title ||
                    say("Lanza el siguiente reto", "Send the next challenge")
                  : say("Cinco maneras de descubrir", "Five ways to discover")}
            </strong>
            {solo && goal && (
              <span>
                {goal.point
                  ? say(
                      "Punto de partida en el mapa",
                      "Starting point on the map",
                    )
                  : say(
                      "Tú eliges dónde · foto + lugar",
                      "You choose where · photo + place",
                    )}
              </span>
            )}
            {mode === "friends" && (
              <span>
                {action?.kind === "outing" && minutesLeft !== null
                  ? say(
                      `${timeLeft} · +${challenge!.reward} / −${challenge!.loss} pts`,
                      `${timeLeft} · +${challenge!.reward} / −${challenge!.loss} pts`,
                    )
                  : action?.kind === "review"
                    ? say(
                        "Hay una foto por revisar",
                        "A photo is ready for review",
                      )
                    : props.pending
                      ? say(
                          `${props.pending} pendientes · abrir retos`,
                          `${props.pending} pending · open challenges`,
                        )
                      : say(
                          "Tu grupo, sus reglas, sus hallazgos",
                          "Your group, your rules, your discoveries",
                        )}
              </span>
            )}
            {mode === "community" && (
              <span
                className="mc-paint-progress"
                aria-label={say(
                  `${props.communityProgress.size} de 5 categorías`,
                  `${props.communityProgress.size} of 5 categories`,
                )}
              >
                {CATEGORIES.map((c) => (
                  <i
                    key={c.id}
                    style={{
                      background: props.communityProgress.has(c.id)
                        ? c.color
                        : undefined,
                    }}
                  />
                ))}
                <b>{props.communityProgress.size}/5</b>
              </span>
            )}
          </span>
          {!(solo && goal?.point) && (
            <ChevronRight size={18} aria-hidden="true" />
          )}
        </button>
        {solo && goal?.point && (
          <button
            className="mc-goal-locate"
            onClick={props.locateGoal}
            aria-label={say(
              "Mostrar mi objetivo en el mapa",
              "Show my goal on the map",
            )}
          >
            <Crosshair size={23} />
          </button>
        )}
      </aside>
      <nav
        className="mc-play-dock"
        aria-label={say("Modos del juego", "Game modes")}
      >
        {destinations.map(({ mode: destination, label, Icon }, index) => (
          <button
            key={destination}
            style={{ gridColumn: index < 2 ? index + 1 : index + 2 }}
            aria-current={mode === destination ? "page" : undefined}
            onClick={() => navigate(destination)}
          >
            <span>
              <Icon size={22} strokeWidth={mode === destination ? 2.5 : 1.8} />
              {destination === "friends" && props.pending > 0 && (
                <i
                  aria-label={say(
                    `${props.pending} pendientes`,
                    `${props.pending} pending`,
                  )}
                >
                  {props.pending}
                </i>
              )}
            </span>
            <small>{label}</small>
          </button>
        ))}
        <button
          className="mc-shutter"
          onClick={props.capture}
          aria-label={
            props.draft
              ? say("Continuar hallazgo", "Continue discovery")
              : say("Guardar un hallazgo", "Keep a discovery")
          }
        >
          <Camera size={26} />
          <small>{say("Hallazgo", "Discover")}</small>
          {props.draft && <i />}
        </button>
      </nav>
    </>
  );
}
