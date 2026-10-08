"use client";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import AssetImage from "@/components/media/AssetImage";
import type { ImageAsset } from "@/lib/assets/types";
import type {
  PlayerView,
  RoomId,
  SupervisorId,
} from "@/lib/loopforge/first-shift/contract";
import s from "./first-shift.module.css";
import l from "./living-console.module.css";

export type Media = Record<string, ImageAsset>;
export const name = (id: SupervisorId | null | undefined) =>
  id === "limen" ? "LIMEN" : id === "stiletto" ? "STILETTO" : "Unassigned";
export const roomName = (id: RoomId) =>
  id === "conveyor" ? "Lattice Forge" : "Security";
export const time = (tick: number) =>
  `${String(6 + Math.floor(tick / 4)).padStart(2, "0")}:${String((tick % 4) * 15).padStart(2, "0")}`;
export const ROOMS = [
  { id: "conveyor", title: "Lattice Forge", art: "forge" },
  { id: "security", title: "Security", art: "security" },
  { id: "theatre", title: "Burn-in Theatre", art: "theatre" },
  { id: "brewery", title: "Cognitive Substrate Brewery", art: "brewery" },
  { id: "weaving", title: "Weaving Gallery", art: "weaving" },
  { id: "cortex", title: "Cortex Assembly", art: "cortex" },
] as const;
export type CameraId = (typeof ROOMS)[number]["id"];
export const sealedRooms = ROOMS.slice(2).map((r) => r.title);
export function materialStyle(media: Media): CSSProperties {
  return Object.fromEntries(
    [
      "monitor-frame",
      "instrument-plate",
      "gunmetal",
      "glass",
      "grain",
      "button-rest",
      "button-hover",
      "button-pressed",
      "tape",
      "speech",
    ]
      .filter((id) => media[id])
      .map((id) => [`--${id}`, `url("${media[id].variants.at(-1)!.src}")`]),
  ) as CSSProperties;
}
export function Art({
  media,
  id,
  className,
  sizes = "(max-width: 900px) 90vw, 45vw",
  priority = false,
}: {
  media: Media;
  id: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <AssetImage
      asset={media[id]}
      alt=""
      className={className}
      sizes={sizes}
      preload={priority}
    />
  );
}
export function Control({
  children,
  className = "",
  tone,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "danger" }) {
  return (
    <button
      type="button"
      {...props}
      data-tone={tone}
      className={`${s.control} ${className}`}
    >
      {children}
    </button>
  );
}
export function Kicker({ children }: { children: ReactNode }) {
  return <span className={s.kicker}>{children}</span>;
}
export function Tape({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <span className={`${s.tape} ${className}`}>{children}</span>;
}
export function Speech({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <blockquote className={`${s.speech} ${className}`}>{children}</blockquote>
  );
}

export function Token({
  media,
  person,
  large = false,
  active = false,
  empty = false,
  sheet,
}: {
  media: Media;
  person?: SupervisorId;
  large?: boolean;
  active?: boolean;
  empty?: boolean;
  sheet?: "cathexis" | "witch" | "thrum";
}) {
  return (
    <span
      className={s.token}
      data-large={large}
      data-selected={active}
      data-empty={empty}
      aria-hidden="true"
    >
      {(person || sheet) && (
        <span className={s.tokenFace} data-sheet={sheet}>
          <Art
            media={media}
            id={sheet || `${person}-portrait`}
            sizes={
              sheet ? (large ? "1080px" : "480px") : large
                ? "(max-width:900px) 170px, 330px"
                : "(max-width:900px) 90px, 150px"
            }
          />
        </span>
      )}
      <span className={s.tokenSocket} />
    </span>
  );
}

/** A whole authored housing retains its proportions; content uses its calibrated opening. */
export function Monitor({
  media,
  view,
  room,
  index = 0,
  onOpen,
  operator,
  fullFloor = false,
  focus = false,
  proposal = false,
}: {
  media: Media;
  view: PlayerView;
  room: CameraId;
  index?: number;
  onOpen?: () => void;
  operator?: SupervisorId;
  fullFloor?: boolean;
  focus?: boolean;
  proposal?: boolean;
}) {
  const spec = ROOMS.find((r) => r.id === room)!;
  const open = fullFloor || room === "conveyor" || room === "security";
  const incident = view.pending?.room === room;
  const roomReceipts = open ? view.events.filter(e => e.room === room &&
    (e.kind === "production" || e.kind === "resolution")) : [];
  const recentOrder = roomReceipts.findLast(e => e.kind === "resolution" && view.shiftTick - e.shiftTick < 5);
  const receipt = recentOrder ?? roomReceipts.at(-1);
  const strain = room === "conveyor" && view.condition < 75;
  const person =
    operator ??
    (open && (room === "conveyor" || room === "security")
      ? view.assignments?.[room]
      : undefined);
  const content = (
    <>
      <span className={`${s.monitorGlass} ${l.glass}`} data-powered={open} data-strain={strain}>
        {open && (
          <Art
            media={media}
            id={spec.art}
            className={`${s.feedPicture} ${l.picture}`}
            sizes={
              focus
                ? "(max-width:900px) 94vw, 72vw"
                : "(max-width:900px) 43vw, 30vw"
            }
            priority={index < 2}
          />
        )}
        <span className={s.glassReflection} />
        {open && (
          <>
            <span className={`${s.feedGrain} ${l.noise}`} aria-hidden="true" />
            <span className={l.phosphor} aria-hidden="true" />
            <span className={l.tracking} aria-hidden="true" />
            {!proposal && <span className={l.inspectCue} aria-hidden="true">Inspect ↗</span>}
            {receipt && !incident && <span key={receipt.id} className={l.feedReceipt} data-kind={receipt.kind}>
              <small>{receipt.kind === "production" ? "OUTTAKE CONFIRMED" : `${receipt.actor === "director" ? "DIRECTOR" : receipt.actor === "factory" ? "FACTORY" : name(receipt.actor)} · ORDER FILED`}</small>
              <b>{receipt.title}</b>
            </span>}
            <span className={s.feedReadout}>
              <span>
                <i /> {view.phase === "running" ? "REC" : "LIVE"} · 0{index + 1}
              </span>
              <span>{time(view.shiftTick)}</span>
            </span>
            {incident && (
              <span className={s.feedAttention}>Response required</span>
            )}
            {!incident && (
              <span className={s.feedState}>
                {proposal
                  ? "Proposed placement"
                  : person
                    ? `${name(person)}${person === view.adviser ? " · delegated" : ""}`
                    : "No supervisor assigned"}
              </span>
            )}
          </>
        )}
      </span>
      <span className={`${s.monitorHousing} ${l.housing}`} />
      <Tape className={s.roomTape}>{spec.title}</Tape>
      {open && !focus && (
        <span className={s.monitorSocket}>
          <Token media={media} person={person} empty={!person} />
        </span>
      )}
    </>
  );
  return onOpen && open ? (
    <button
      className={`${s.monitor} ${l.monitor}`}
      onClick={onOpen}
      data-open={open}
      data-attention={incident}
      data-focus={focus}
      style={{ "--feed-delay": `${index * -5.7}s` } as CSSProperties}
      aria-label={`${spec.title} · ${proposal ? "change proposed assignment" : "open camera"}`}
    >
      <span className={s.monitorStage} data-light-frame>{content}</span>
    </button>
  ) : (
    <div
      className={`${s.monitor} ${l.monitor}`}
      data-open={open}
      data-attention={incident}
      data-focus={focus}
      style={{ "--feed-delay": `${index * -5.7}s` } as CSSProperties}
      role="img"
      aria-label={
        open ? `${spec.title} camera` : `${spec.title}, unpowered camera`
      }
    >
      <span className={s.monitorStage} data-light-frame>{content}</span>
    </div>
  );
}

export function Instruments({
  media,
  view,
  onInspect,
}: {
  media: Media;
  view: PlayerView;
  onInspect?: (id: string) => void;
}) {
  const items = [
    {
      id: "funds",
      icon: "funds-relief",
      title: "Funds",
      value: `¤ ${view.cash}`,
    },
    {
      id: "workers",
      icon: "workers-relief",
      title: "Workers",
      value: String(view.workers),
    },
    {
      id: "condition",
      icon: "condition-relief",
      title: "Line",
      value: `${view.condition}%`,
    },
    {
      id: "quota",
      icon: "delivery-relief",
      title: "Weekly quota",
      value: `${view.committed} / ${view.quota}`,
    },
  ];
  return (
    <div className={s.instruments} aria-label="Confirmed factory facts">
      {items.map((item) => (
        <button
          key={item.id}
          className={s.instrument}
          data-instrument={item.id}
          onClick={() => onInspect?.(item.id)}
          aria-label={`${item.title}: ${item.value}. Inspect`}
        >
          <Art
            media={media}
            id={item.icon}
            sizes="(max-width:900px) 28px, 52px"
          />
          <span>
            <small>{item.title}</small>
            <strong key={item.value}>{item.value}</strong>
            {item.id === "quota" && (
              <span className={s.quotaRail} aria-hidden="true">
                <i
                  style={{
                    width: `${Math.min(100, (view.committed / view.quota) * 100)}%`,
                  }}
                />
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
