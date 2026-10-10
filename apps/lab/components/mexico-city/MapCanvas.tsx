"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import geography from "@/lib/mexico-city/geography.json";
import {
  project,
  projectBounds,
  STORIES,
  storyById,
  ZONES,
  zoneById,
  type View,
} from "@/lib/mexico-city/content";
import Artwork from "./Artwork";

const colors = [
  "#e9eee4",
  "#f2e4d9",
  "#e0e9df",
  "#eef0da",
  "#e0eae4",
  "#ece5de",
  "#f7dbce",
  "#e5e8ee",
  "#eee1dc",
  "#e2ece3",
  "#e9e7d9",
  "#dce9e2",
  "#e0e9ef",
  "#e9ecd9",
  "#efeadc",
  "#e9e1ea",
];

export default function MapCanvas({
  view,
  go,
}: {
  view: View;
  go: (view: View) => void;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 640, height: 640 });
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) =>
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      }),
    );
    if (container.current) observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  const selectedBorough =
    view.level === "borough"
      ? view.id
      : view.level === "zone"
        ? zoneById(view.id).borough
        : view.level === "place"
          ? storyById(view.id).borough
          : null;
  let bounds: readonly number[] = geography.bounds;
  if (view.level === "borough")
    bounds = geography.boroughs.find((b) => b.id === view.id)!.bounds;
  if (view.level === "zone") bounds = projectBounds(zoneById(view.id).bounds);
  if (view.level === "place") {
    const [x, y] = project(storyById(view.id).coordinate);
    bounds = [x - 5, y - 5, x + 5, y + 5];
  }
  const padding =
    view.level === "city" ? 0.81 : view.level === "borough" ? 0.68 : 0.76;
  const scale =
    Math.min(
      size.width / (bounds[2] - bounds[0]),
      size.height / (bounds[3] - bounds[1]),
    ) * padding;
  const tx = size.width / 2 - ((bounds[0] + bounds[2]) / 2) * scale;
  const ty = size.height / 2 - ((bounds[1] + bounds[3]) / 2) * scale;
  const position = (point: readonly number[]) => ({
    left: point[0] * scale + tx,
    top: point[1] * scale + ty,
  });
  const margin =
    view.level === "city"
      ? size.width < 500
        ? 70
        : 100
      : size.width < 500
        ? 90
        : 140;
  const callout = (point: readonly number[], offset: number[]) => ({
    left: Math.max(
      margin,
      Math.min(size.width - margin, position(point).left + offset[0]),
    ),
    top: position(point).top + offset[1],
  });
  const markers =
    view.level === "city"
      ? [
          {
            id: "cuauhtemoc",
            image: "revolucion",
            title: "Cuauhtémoc",
            sub: "3 stories · 2 zones",
            point: geography.boroughs.find((b) => b.id === "09015")!.center,
            target: { level: "borough", id: "09015" } as View,
            offset: [92, -38],
          },
          {
            id: "miguel",
            image: "chapultepec",
            title: "Miguel Hidalgo",
            sub: "1 story · the forest",
            point: geography.boroughs.find((b) => b.id === "09016")!.center,
            target: { level: "borough", id: "09016" } as View,
            offset: [-75, 48],
          },
        ]
      : view.level === "borough"
        ? ZONES.filter((z) => z.borough === view.id).map((z) => ({
            id: z.id,
            image: z.image,
            title: z.name,
            sub: `${STORIES.filter((s) => s.zone === z.id).length} discoveries`,
            point: project(z.coordinate),
            target: { level: "zone", id: z.id } as View,
            offset:
              size.width < 500 && view.id === "09015"
                ? z.id === "centro"
                  ? [32, 30]
                  : [-32, -30]
                : [0, 0],
          }))
        : STORIES.filter((s) =>
            view.level === "zone" ? s.zone === view.id : s.id === view.id,
          ).map((s) => ({
            id: s.id,
            image: s.id,
            title: s.place,
            sub: view.level === "place" ? "You’ve found a story" : s.short,
            point: project(s.coordinate),
            target: { level: "place", id: s.id } as View,
            offset:
              size.width < 500 && view.level === "zone" && view.id === "centro"
                ? [0, s.id === "zocalo" ? -38 : 38]
                : [0, 0],
          }));

  return (
    <div
      className={`ov-map ov-map--${view.level}`}
      ref={container}
      aria-label="Illustrated map of Mexico City"
    >
      <svg
        className="ov-geography"
        width="100%"
        height="100%"
        aria-label="Mexico City boroughs"
      >
        <g
          style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}
          className="ov-camera"
        >
          {geography.boroughs.map((b, index) => (
            <path
              key={b.id}
              d={b.path}
              fill={colors[index]}
              fillRule="evenodd"
              vectorEffect="non-scaling-stroke"
              className={`ov-borough ${selectedBorough === b.id ? "is-selected" : ""}`}
              opacity={selectedBorough && selectedBorough !== b.id ? 0.3 : 1}
              role="button"
              tabIndex={view.level === "city" ? 0 : -1}
              aria-label={`Explore ${b.name}`}
              onClick={() => go({ level: "borough", id: b.id })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  go({ level: "borough", id: b.id });
                }
              }}
            />
          ))}
          <path
            className="ov-streets"
            d={geography.roads}
            fill="none"
            stroke="#d7dfcf"
            strokeWidth="1.4"
            vectorEffect="non-scaling-stroke"
            opacity={view.level === "city" ? 0 : 0.8}
          />
        </g>
        {view.level === "city"
          ? geography.boroughs
              .filter((b) => !["09015", "09016"].includes(b.id))
              .map((b) => (
                <text
                  key={b.id}
                  x={position(b.center).left}
                  y={position(b.center).top}
                  className={`ov-borough-name ${["09004", "09006", "09008", "09010", "09014", "09017"].includes(b.id) ? "ov-borough-name--small" : ""}`}
                  textAnchor="middle"
                >
                  {b.name}
                </text>
              ))
          : null}
        {markers.map((m) => (
          <line
            key={m.id}
            x1={position(m.point).left}
            y1={position(m.point).top}
            x2={callout(m.point, m.offset).left}
            y2={callout(m.point, m.offset).top}
            stroke="#9caaa0"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
        ))}
      </svg>
      {markers.map((m, index) => (
        <button
          key={m.image}
          className="ov-landmark"
          style={
            {
              ...callout(m.point, m.offset),
              "--pin-x": "0px",
              "--pin-y": "0px",
            } as CSSProperties
          }
          onClick={() => go(m.target)}
          tabIndex={view.level === "place" ? -1 : 0}
          aria-label={`Explore ${m.title}`}
        >
          <Artwork
            id={m.image}
            sizes={
              view.level === "place"
                ? "(max-width: 700px) 86vw, (max-width: 1000px) 48vw, 540px"
                : view.level === "city"
                  ? "(max-width: 350px) 110px, (max-width: 700px) 124px, (max-width: 1000px) 150px, 175px"
                  : "(max-width: 700px) 165px, (max-width: 1000px) 190px, 245px"
            }
            preload={view.level === "city" && index === 0}
          />
          <span className="ov-pin-label">
            <strong>{m.title}</strong>
            <small>{m.sub}</small>
            <span className="ov-pin-dot" />
          </span>
        </button>
      ))}
      {view.level !== "city" ? (
        <div className="ov-map-watermark">
          {view.level === "place"
            ? "Look a little closer"
            : "Every corner has a story"}
        </div>
      ) : null}
      <div className="ov-north" aria-hidden="true">
        <span>N</span>
        <i />
      </div>
      <span className="ov-map-credit">
        Illustrated scale · SGIRPC CDMX ·{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noreferrer"
        >
          © OpenStreetMap
        </a>
      </span>
    </div>
  );
}
