"use client";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import AssetImage from "@/components/media/AssetImage";
import type { ImageAsset } from "@/lib/assets/types";
import type {
  PlayerView,
  RoomId,
  SupervisorId,
} from "@/lib/loopforge/first-shift/contract";
import s from "./first-shift.module.css";

export type Media = Record<string, ImageAsset>;
export const name = (id: SupervisorId | null | undefined) =>
  id === "limen" ? "LIMEN" : id === "stiletto" ? "STILETTO" : "Unassigned";
export const roomName = (id: RoomId) =>
  id === "conveyor" ? "Lattice Forge" : "Security";
export const time = (tick: number) =>
  `${String(6 + Math.floor(tick / 4)).padStart(2, "0")}:${String((tick % 4) * 15).padStart(2, "0")}`;

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
    ].map((id) => [`--${id}`, `url("${media[id].variants.at(-1)!.src}")`]),
  ) as CSSProperties;
}
export function Art({
  media,
  id,
  className,
  sizes = "(max-width: 760px) 90vw, 45vw",
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

export function Instruments({
  media,
  view,
}: {
  media: Media;
  view: PlayerView;
}) {
  return (
    <dl className={s.instruments} aria-label="Confirmed factory facts">
      {[
        {
          id: "funds-icon",
          title: "Funds",
          value: `¤ ${view.cash}`,
          note: "Development reserve",
        },
        {
          id: "worker-icon",
          title: "Workforce",
          value: view.workers,
          note: "Basic workers",
        },
        {
          id: "condition-icon",
          title: "Line condition",
          value: `${view.condition}%`,
          note: view.condition < 75 ? "Wear accumulating" : "Operational",
        },
      ].map((f) => (
        <div key={f.id} className={s.instrument}>
          <Art media={media} id={f.id} sizes="44px" />
          <div>
            <dt>{f.title}</dt>
            <dd key={String(f.value)}>{f.value}</dd>
            <small>{f.note}</small>
          </div>
        </div>
      ))}
      <div className={`${s.instrument} ${s.quota}`}>
        <div>
          <dt>Weekly delivery</dt>
          <dd>
            {view.committed}
            <span> / {view.quota}</span>
          </dd>
          <small>Due at the end of day 7</small>
        </div>
        <div
          className={s.quotaTrack}
          role="progressbar"
          aria-label="Weekly quota committed"
          aria-valuenow={view.committed}
          aria-valuemin={0}
          aria-valuemax={view.quota}
        >
          <i
            style={{
              transform: `scaleX(${Math.min(1, view.committed / view.quota)})`,
            }}
          />
        </div>
      </div>
    </dl>
  );
}

/** Only known room/operator context chooses the illustration. It does not predict outcomes. */
export function Camera({
  media,
  view,
  room,
}: {
  media: Media;
  view: PlayerView;
  room: RoomId;
}) {
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = frame.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      node.dataset.onScreen = String(entry.isIntersecting);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  const operator = view.assignments?.[room];
  // Use the neutral room scene during operation. Character art belongs to the
  // intercom; a legacy "success" painting is not proof of a successful shift.
  const image = room === "conveyor" ? "forge" : "security";
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const incoming = media[image];
  const imagePending = loadedImage !== image;
  const incident = view.pending?.room === room;
  const latest = view.events
    .filter((e) => e.room === room && e.kind === "resolution")
    .at(-1);
  return (
    <div ref={frame} className={s.camera} data-alert={incident} data-light-frame>
      {loadedImage && (
        <div className={s.cameraPicture} key={loadedImage}>
          <Art
            media={media}
            id={loadedImage}
            sizes="(max-width: 760px) 96vw, (max-width: 1100px) 48vw, 51vw"
          />
        </div>
      )}
      {imagePending && (
        <>
          {/* Load the requested scene before replacing the last available image. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`${image}-${attempt}`}
            className={s.incomingImage}
            src={incoming.variants.at(-1)!.src}
            srcSet={incoming.variants
              .map((file) => `${file.src} ${file.width}w`)
              .join(", ")}
            sizes="(max-width: 760px) 96vw, (max-width: 1100px) 48vw, 51vw"
            width={incoming.width}
            height={incoming.height}
            alt=""
            loading="eager"
            decoding="async"
            fetchPriority={loadedImage ? "auto" : "high"}
            onLoad={() => {
              setLoadedImage(image);
              setFailedImage(null);
            }}
            onError={() => setFailedImage(image)}
          />
          <div className={s.imagePending} role="status">
            {failedImage === image ? (
              <>
                <span>Camera image unavailable.</span>
                <button
                  onClick={() => {
                    setFailedImage(null);
                    setAttempt((n) => n + 1);
                  }}
                >
                  Retry image
                </button>
              </>
            ) : (
              `Connecting ${roomName(room)} camera…`
            )}
          </div>
        </>
      )}
      <div className={s.glass} aria-hidden="true" />
      <div className={s.scan} aria-hidden="true" />
      <div className={s.cameraTop}>
        <span>
          <i className={s.rec} /> CAM {room === "conveyor" ? "01" : "02"} ·{" "}
          {view.phase === "running" ? "REC" : "STANDBY"}
        </span>
        <span>{time(view.shiftTick)}</span>
      </div>
      <div className={s.cameraCrosshair} aria-hidden="true" />
      <div className={s.cameraCaption}>
        <Kicker>
          {room === "conveyor"
            ? "Floor 01 / production"
            : "Floor 01 / access control"}
        </Kicker>
        <h2>{roomName(room)}</h2>
        <span>
          {operator
            ? `${name(operator)} · ${operator === view.adviser ? "adviser has authority here" : "room supervisor"}`
            : "No supervisor assigned"}
        </span>
      </div>
      {incident && <div className={s.cameraAlert}>● RESPONSE REQUIRED</div>}
      {!incident && latest && (
        <div className={s.cameraReceipt} key={latest.id}>
          <Kicker>
            {latest.actor === "director"
              ? "Your order carried out"
              : `${name(latest.actor === "factory" ? null : latest.actor)} acted automatically`}
          </Kicker>
          <span>{latest.title}</span>
        </div>
      )}
    </div>
  );
}

export const sealedRooms = [
  "Burn-in Theatre",
  "Substrate Brewery",
  "Weaving Gallery",
  "Cortex Assembly",
];
export function Channels({
  view,
  room,
  onRoom,
}: {
  view: PlayerView;
  room: RoomId;
  onRoom: (id: RoomId) => void;
}) {
  return (
    <div className={s.channels} aria-label="Factory room cameras">
      {(["conveyor", "security"] as const).map((id, i) => (
        <button
          type="button"
          key={id}
          className={s.channel}
          aria-pressed={room === id}
          onClick={() => onRoom(id)}
        >
          <span>
            0{i + 1}
            <i />
          </span>
          <b>{id === "conveyor" ? "Conveyor" : "Security"}</b>
          <small>{name(view.assignments?.[id])}</small>
        </button>
      ))}
      {sealedRooms.map((title, i) => (
        <div
          className={`${s.channel} ${s.sealed}`}
          key={title}
          aria-label={`${title}, sealed`}
        >
          <span>0{i + 3}</span>
          <b>{title}</b>
          <small>SEALED</small>
        </div>
      ))}
    </div>
  );
}

export function Speaker({
  media,
  view,
  compact = false,
}: {
  media: Media;
  view: PlayerView;
  compact?: boolean;
}) {
  if (!view.adviser) return null;
  const person = view.people.find((p) => p.id === view.adviser)!;
  return (
    <div
      className={`${s.speaker} ${compact ? s.compactSpeaker : ""}`}
      data-person={view.adviser}
    >
      <div className={s.speakerPortrait}>
        <Art
          media={media}
          id={`${view.adviser}-portrait`}
          sizes={compact ? "80px" : "(max-width: 760px) 28vw, 180px"}
        />
      </div>
      <div>
        <Kicker>Today’s adviser</Kicker>
        <h3>{name(view.adviser)}</h3>
        <p>“{person.remark}”</p>
      </div>
    </div>
  );
}
