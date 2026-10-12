"use client";
import { useEffect, useRef, useState } from "react";
import Artwork from "../Artwork";
import { Minus, Plus, RotateCcw } from "lucide-react";
import geography from "@/lib/mexico-city/geography.json";
import { project } from "@/lib/mexico-city/content";
import {
  BOROUGHS,
  borough,
  type Anchor,
} from "@/lib/mexico-city/atlas/content";
import { useLocale } from "@/lib/mexico-city/locale";
import { MapDetails, type LayerSettings } from "../MapDetails";
export type AtlasFocus = { borough?: string; anchor?: number };
const COLORS = [
  "#e8be93",
  "#bad0bb",
  "#dad3a4",
  "#c6c0d8",
  "#e7bcb6",
  "#b5d5dc",
  "#d3cb95",
  "#f0d5a3",
];
export default function AtlasMap({
  focus = {},
  onBorough,
  onAnchor,
  quiz = false,
  answer,
  compact = false,
}: {
  focus?: AtlasFocus;
  onBorough: (id: string) => void;
  onAnchor?: (index: number) => void;
  quiz?: boolean;
  answer?: string;
  compact?: boolean;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const root = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 700, height: 650 });
  const [layers, setLayers] = useState<LayerSettings>({
    metro: false,
    cable: false,
    areas: true,
    streets: true,
  });
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [dragging, setDragging] = useState(false);
  const focusKey = `${focus.borough ?? "city"}:${focus.anchor ?? ""}`;
  const [previousFocus, setPreviousFocus] = useState(focusKey);
  if (previousFocus !== focusKey) {
    setPreviousFocus(focusKey);
    setCamera({ x: 0, y: 0, zoom: 1 });
  }
  const drag = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
    moved: boolean;
  } | null>(null);
  useEffect(() => {
    const r = root.current;
    if (!r) return;
    const o = new ResizeObserver(([e]) =>
      setSize({ width: e.contentRect.width, height: e.contentRect.height }),
    );
    o.observe(r);
    return () => o.disconnect();
  }, []);
  const current = focus.borough ? borough(focus.borough) : undefined;
  const anchor =
    current && focus.anchor !== undefined
      ? current.anchors[focus.anchor]
      : undefined;
  const geometry = geography.boroughs.find((b) => b.id === focus.borough);
  let bounds = geometry?.bounds ?? geography.bounds;
  if (anchor) {
    const [x, y] = project(anchor.coordinate);
    bounds = [x - 18, y - 18, x + 18, y + 18];
  }
  const base =
    Math.min(
      size.width / (bounds[2] - bounds[0]),
      size.height / (bounds[3] - bounds[1]),
    ) * (current ? 0.67 : 0.74);
  const scale = base * camera.zoom;
  const tx = size.width / 2 - ((bounds[0] + bounds[2]) / 2) * scale + camera.x;
  const ty = size.height / 2 - ((bounds[1] + bounds[3]) / 2) * scale + camera.y;
  const pos = (point: readonly number[]) => ({
    x: point[0] * scale + tx,
    y: point[1] * scale + ty,
  });
  const choose = (id: string) => {
    if (drag.current?.moved) return;
    setCamera({ x: 0, y: 0, zoom: 1 });
    onBorough(id);
  };
  const anchorPoint = (a: Anchor) => pos(project(a.coordinate));
  const pins: {
    x: number;
    y: number;
    originalX: number;
    originalY: number;
    a: Anchor;
    i: number;
  }[] = [];
  for (const [i, a] of (current?.anchors ?? []).entries()) {
    const p = anchorPoint(a);
    if (p.x < 0 || p.x > size.width || p.y < 0 || p.y > size.height) continue;
    const x = Math.max(83, Math.min(size.width - 83, p.x));
    let y = Math.max(90, Math.min(size.height - 90, p.y));
    for (const offset of [0, -60, 60, -120, 120]) {
      const candidate = Math.max(90, Math.min(size.height - 90, p.y + offset));
      if (
        !pins.some(
          (pin) =>
            Math.abs(pin.x - x) < 165 && Math.abs(pin.y - candidate) < 52,
        )
      ) {
        y = candidate;
        break;
      }
    }
    pins.push({ x, y, originalX: p.x, originalY: p.y, a, i });
  }
  return (
    <div
      className={`at-map ${compact ? "at-map-compact" : ""} ${quiz ? "at-map-quiz" : ""}`}
      ref={root}
    >
      <svg
        width="100%"
        height="100%"
        className="at-map-surface"
        role="group"
        aria-label={say("Mapa de las 16 alcaldías", "Map of the 16 boroughs")}
        onPointerDown={(e) => {
          if (quiz) return;
          drag.current = {
            x: e.clientX,
            y: e.clientY,
            px: camera.x,
            py: camera.y,
            moved: false,
          };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d || quiz) return;
          if (Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 8)
            d.moved = true;
          if (d.moved) setDragging(true);
          if (d.moved)
            setCamera((v) => ({
              ...v,
              x: d.px + e.clientX - d.x,
              y: d.py + e.clientY - d.y,
            }));
        }}
        onPointerUp={(e) => {
          if (e.currentTarget.hasPointerCapture(e.pointerId))
            e.currentTarget.releasePointerCapture(e.pointerId);
          const moved = drag.current?.moved;
          setDragging(false);
          drag.current = null;
          if (!moved) {
            const hit = document
              .elementFromPoint(e.clientX, e.clientY)
              ?.closest("[data-borough]")
              ?.getAttribute("data-borough");
            if (hit) choose(hit);
          }
        }}
        onPointerCancel={() => {
          setDragging(false);
          drag.current = null;
        }}
      >
        <defs>
          <pattern
            id="at-paper"
            width="18"
            height="18"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r=".65" fill="#657769" opacity=".14" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#at-paper)" />
        <g
          className={dragging ? "" : "at-map-camera"}
          transform={`translate(${tx} ${ty}) scale(${scale})`}
        >
          {geography.boroughs.map((b) => {
            const index = BOROUGHS.findIndex((x) => x.id === b.id);
            return (
              <path
                key={b.id}
                d={b.path}
                data-borough={b.id}
                role="button"
                tabIndex={0}
                aria-label={
                  quiz ? `${say("Zona", "Area")} ${index + 1}` : b.name
                }
                aria-pressed={answer === b.id || focus.borough === b.id}
                onClick={(e) => {
                  if (quiz || e.detail === 0) choose(b.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    choose(b.id);
                  }
                }}
                fill={
                  answer === b.id ? "#ffc452" : COLORS[index % COLORS.length]
                }
                opacity={current && current.id !== b.id ? 0.27 : 0.86}
                stroke="#fff"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>
        {!quiz && (
          <MapDetails
            view={
              current ? { level: "borough", id: current.id } : { level: "city" }
            }
            settings={layers}
            scale={scale}
            tx={tx}
            ty={ty}
            width={size.width}
            height={size.height}
            obstacles={pins.map((p) => ({
              x: p.x - 70,
              y: p.y - 22,
              width: 140,
              height: 45,
            }))}
          />
        )}
        {!quiz &&
          pins.map((p) => (
            <g key={p.a.name} pointerEvents="none">
              <path
                d={`M${p.originalX} ${p.originalY}L${p.x} ${p.y}`}
                stroke="#759078"
                strokeWidth="1"
              />
              <circle cx={p.originalX} cy={p.originalY} r="3" fill="#43684e" />
            </g>
          ))}
        {!current &&
          geography.boroughs.map((b) => {
            const p = pos(b.center);
            const i = BOROUGHS.findIndex((x) => x.id === b.id);
            return (
              <g key={b.id} pointerEvents="none">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={quiz ? 11 : 9}
                  fill="#fff"
                  stroke="#64786e"
                  strokeWidth=".7"
                />
                <text
                  x={p.x}
                  y={p.y + 3.5}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill="#293f35"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
        <g transform={`translate(${size.width - 32} 36)`} aria-hidden="true">
          <path d="M0 -12l-5 14 5-3 5 3Z" fill="#344d3c" />
          <text y="17" textAnchor="middle" fontSize="10" fill="#344d3c">
            N
          </text>
        </g>
      </svg>
      {!quiz && (
        <>
          <div
            className="at-map-layers"
            aria-label={say("Capas del mapa", "Map layers")}
          >
            {(["metro", "cable"] as const).map((key) => (
              <button
                key={key}
                aria-pressed={layers[key]}
                onClick={() => setLayers((v) => ({ ...v, [key]: !v[key] }))}
              >
                {key === "metro" ? "Metro" : "Cablebús"}
              </button>
            ))}
          </div>
          {!current && (
            <div className="at-map-caption">
              <span>CDMX</span>
              <small>{say("16 maneras de empezar", "16 ways to begin")}</small>
            </div>
          )}
          {anchor?.story && (
            <figure className="at-anchor-art" aria-hidden="true">
              <Artwork
                id={
                  ["viga", "penon", "cuicuilco", "milpa"].includes(anchor.story)
                    ? `atlas-${anchor.story}`
                    : anchor.story
                }
                sizes="200px"
              />
              <figcaption>
                {say("Viñeta interpretativa", "Interpretive vignette")}
              </figcaption>
            </figure>
          )}
          {pins.map(({ a, i, x, y }) => (
            <button
              key={a.name}
              className={`at-place-pin ${focus.anchor === i ? "is-active" : ""}`}
              style={{ left: x, top: y }}
              onClick={() => {
                setCamera({ x: 0, y: 0, zoom: 1 });
                onAnchor?.(i);
              }}
            >
              <span>{i + 1}</span>
              {a.name}
            </button>
          ))}
          {!current && (
            <details className="at-city-key">
              <summary>
                {say("Nombres de las alcaldías", "Borough names")}
              </summary>
              <div>
                {BOROUGHS.map((b, i) => (
                  <button key={b.id} onClick={() => choose(b.id)}>
                    <small>{i + 1}</small>
                    {b.name}
                  </button>
                ))}
              </div>
            </details>
          )}
          <div className="at-map-tools">
            <button
              aria-label={say("Acercar", "Zoom in")}
              onClick={() =>
                setCamera((v) => ({ ...v, zoom: Math.min(5, v.zoom * 1.35) }))
              }
            >
              <Plus size={18} />
            </button>
            <button
              aria-label={say("Alejar", "Zoom out")}
              onClick={() =>
                setCamera((v) => ({ ...v, zoom: Math.max(0.7, v.zoom / 1.35) }))
              }
            >
              <Minus size={18} />
            </button>
            <button
              aria-label={say("Centrar mapa", "Recenter map")}
              onClick={() => setCamera({ x: 0, y: 0, zoom: 1 })}
            >
              <RotateCcw size={16} />
            </button>
          </div>
          <span className="at-map-footnote">
            {say(
              "Límites actuales · puntos de referencia, no rutas",
              "Current boundaries · reference points, not routes",
            )}
          </span>
        </>
      )}
    </div>
  );
}
