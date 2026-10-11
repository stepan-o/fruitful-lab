"use client";

import geography from "@/lib/mexico-city/geography.json";
import layers from "@/lib/mexico-city/map-layers.json";
import { project, projectBounds, type Point } from "@/lib/mexico-city/content";
import { AIRPORTS, BOROUGH_ANCHORS } from "@/lib/mexico-city/learning";
import { useLocale } from "@/lib/mexico-city/locale";
import Artwork from "./Artwork";

function lakeShape(x: number, y: number, rx: number, ry: number) {
  return `M${x - rx * 0.7},${y - ry * 0.5} C${x - rx * 0.9},${y - ry},${x + rx * 0.2},${y - ry * 0.8},${x + rx * 0.4},${y - ry} C${x + rx * 0.9},${y - ry * 0.85},${x + rx * 0.95},${y - ry * 0.1},${x + rx * 0.78},${y + ry * 0.32} C${x + rx * 0.9},${y + ry * 0.75},${x + rx * 0.05},${y + ry},${x - rx * 0.25},${y + ry * 0.65} C${x - rx * 0.5},${y + ry * 0.9},${x - rx},${y + ry * 0.3},${x - rx * 0.8},${y} Z`;
}

// Explanatory lake silhouettes, deliberately schematic: not historical shoreline data.
const lakes = [
  { name: "Zumpango", point: [-99.09, 19.78] as Point, rx: 51, ry: 37 },
  { name: "Xaltocan", point: [-99.075, 19.655] as Point, rx: 50, ry: 49 },
  { name: "Texcoco", point: [-99.065, 19.473] as Point, rx: 210, ry: 151 },
  { name: "Xochimilco", point: [-99.1, 19.274] as Point, rx: 95, ry: 33 },
  { name: "Chalco", point: [-98.964, 19.272] as Point, rx: 100, ry: 43 },
];
const causeways = [
  { id: "west", name: "Tlacopan", point: [-99.188, 19.459] as Point },
  { id: "north", name: "Tepeyac", point: [-99.117, 19.484] as Point },
  { id: "south", name: "Iztapalapa", point: [-99.092, 19.359] as Point },
];
export default function LearningMap({
  stage,
  blend,
  selected,
  onSelect,
  quiz = false,
}: {
  stage: number;
  blend: number;
  selected: string;
  onSelect: (id: string) => void;
  quiz?: boolean;
}) {
  const { locale, t } = useLocale();
  const [w, n, e, s] = projectBounds(
    stage === 5
      ? [-99.68, 19.14, -98.82, 19.84]
      : stage === 1
        ? [-99.29, 19.28, -98.94, 19.62]
        : stage > 1
          ? [-99.37, 19.04, -98.92, 19.64]
          : [-99.4, 19.04, -98.85, 19.84],
  );
  const scale = Math.min(510 / (e - w), 465 / (s - n));
  const tx = 280 - ((w + e) / 2) * scale,
    ty = 270 - ((n + s) / 2) * scale;
  const pos = (point: Point) => {
    const p = project(point);
    return { x: p[0] * scale + tx, y: p[1] * scale + ty };
  };
  const center = pos([-99.133, 19.433]);
  const lakeOpacity = stage === 0 ? 1 - blend / 110 : stage === 1 ? 0.3 : 0;
  const airport = AIRPORTS.find((a) => a.id === selected) ?? AIRPORTS[0];
  const ac = pos(airport.point),
    hub = pos(airport.hub);
  const lineStations = layers.stations.filter((s) => s.line === selected);
  const terminals = lineStations.length
    ? [lineStations[0], lineStations[lineStations.length - 1]]
    : [];
  return (
    <div className={`ov-learning-map ov-learning-map--${stage}`}>
      <svg viewBox="0 0 560 550" role="group" aria-label={t("City overview")}>
        <defs>
          <pattern
            id="ov-water-hatch"
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M2 7q3-3 6 0t6 0"
              fill="none"
              stroke="#659ca8"
              strokeWidth=".6"
              opacity=".4"
            />
          </pattern>
        </defs>
        <g
          className="ov-learning-geography"
          transform={`translate(${tx} ${ty}) scale(${scale})`}
        >
          {geography.boroughs.map((b) => (
            <path
              key={b.id}
              d={b.path}
              fill={stage === 2 && selected === b.id ? "#eab767" : "#e9eddf"}
              stroke="white"
              strokeWidth="1.2"
              vectorEffect="non-scaling-stroke"
              opacity={stage === 0 ? 0.3 + blend / 140 : 0.9}
              className="ov-learning-borough"
            />
          ))}
          <g className="ov-lake-layer" opacity={lakeOpacity}>
            {lakes.map((l) => {
              const p = project(l.point);
              return (
                <g key={l.name}>
                  <path d={lakeShape(p[0], p[1], l.rx, l.ry)} fill="#a9d4d5" />
                  <path
                    d={lakeShape(p[0], p[1], l.rx, l.ry)}
                    fill="url(#ov-water-hatch)"
                  />
                </g>
              );
            })}
          </g>
          {stage >= 3
            ? layers.lines.map((l) => (
                <path
                  key={l.id}
                  d={l.path}
                  fill="none"
                  stroke={l.color}
                  strokeWidth={selected === l.id && stage === 3 ? 4 : 2}
                  opacity={stage === 3 && selected !== l.id ? 0.2 : 0.8}
                  className="ov-learning-route"
                  vectorEffect="non-scaling-stroke"
                />
              ))
            : null}
          {stage === 4
            ? layers.cable.map((l) => (
                <path
                  key={l.id}
                  d={l.path}
                  fill="none"
                  stroke={l.line === selected ? "#007f9b" : "#6e9fa5"}
                  strokeWidth={l.line === selected ? 5 : 2}
                  opacity={l.line === selected ? 1 : 0.4}
                  strokeDasharray="5 4"
                  vectorEffect="non-scaling-stroke"
                  className="ov-learning-route"
                />
              ))
            : null}
        </g>
        {stage < 2 ? (
          <>
            {lakes.map((l) => {
              const p = pos(l.point);
              return (
                <text
                  key={l.name}
                  x={p.x}
                  y={p.y - 8}
                  textAnchor="middle"
                  className="ov-lake-name"
                  opacity={Math.max(0.35, lakeOpacity)}
                >
                  {l.name}
                </text>
              );
            })}
            <circle
              cx={center.x}
              cy={center.y}
              r="7"
              fill="#d47852"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={center.x + (stage === 0 ? 10 : -12)}
              y={center.y + 24}
              textAnchor={stage === 0 ? "start" : "end"}
              className="ov-learning-label"
            >
              Tenochtitlan
            </text>
            {stage === 1
              ? causeways.map((c) => {
                  const p = pos(c.point);
                  return (
                    <g key={c.id}>
                      <path
                        key={`${c.id}-${selected}`}
                        d={`M${center.x},${center.y} L${p.x},${p.y}`}
                        pathLength="1"
                        stroke={selected === c.id ? "#bc593a" : "#9b8972"}
                        strokeWidth={selected === c.id ? 4 : 1.5}
                        className={
                          selected === c.id
                            ? "ov-causeway is-traced"
                            : "ov-causeway"
                        }
                        fill="none"
                      />
                      <circle cx={p.x} cy={p.y} r="4" fill="#bc593a" />
                      <text
                        x={p.x + (c.id === "west" ? -8 : 8)}
                        y={p.y - 9}
                        textAnchor={c.id === "west" ? "end" : "start"}
                        className="ov-learning-label"
                      >
                        {c.name}
                      </text>
                    </g>
                  );
                })
              : null}
          </>
        ) : null}
        {stage === 2
          ? BOROUGH_ANCHORS.map((a, i) => {
              const p = pos(a.point);
              const active = selected === a.id;
              return (
                <g
                  key={a.id}
                  role="button"
                  tabIndex={0}
                  aria-label={a.name}
                  aria-pressed={active}
                  onClick={() => onSelect(a.id)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      onSelect(a.id);
                    }
                  }}
                  className="ov-borough-target"
                >
                  <circle cx={p.x} cy={p.y} r="22" fill="transparent" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={active ? 12 : 9}
                    fill={active ? "#bd593a" : "#365846"}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={p.x}
                    y={p.y + 4}
                    textAnchor="middle"
                    fill="white"
                    fontSize="10"
                  >
                    {i + 1}
                  </text>
                  {!quiz ? (
                    <text
                      x={p.x + (i === 1 ? -17 : 17)}
                      y={p.y + (i === 0 ? 18 : 4)}
                      textAnchor={i === 1 ? "end" : "start"}
                      className="ov-learning-label"
                    >
                      {a.name}
                    </text>
                  ) : null}
                </g>
              );
            })
          : null}
        {stage === 3
          ? terminals.map((s) => {
              const p = {
                x: s.point[0] * scale + tx,
                y: s.point[1] * scale + ty,
              };
              return (
                <g key={s.id}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="white"
                    stroke="#263b36"
                  />
                  <text x={p.x + 8} y={p.y - 9} className="ov-learning-label">
                    {s.name}
                  </text>
                </g>
              );
            })
          : null}
        {stage === 4
          ? [
              {
                line: "1",
                name: "Indios Verdes · M3",
                p: [-99.119, 19.496] as Point,
              },
              {
                line: "2",
                name: "Constitución de 1917 · M8",
                p: [-99.064, 19.345] as Point,
              },
              {
                line: "2",
                name: "Santa Martha · MA",
                p: [-98.995, 19.36] as Point,
              },
              {
                line: "3",
                name: "Constituyentes · M7",
                p: [-99.191, 19.412] as Point,
              },
            ]
              .filter((a) => a.line === selected)
              .map((a) => {
                const p = pos(a.p);
                return (
                  <g key={a.name}>
                    <circle cx={p.x} cy={p.y} r="5" fill="#16849a" />
                    <text
                      x={p.x + 8}
                      y={p.y + 18}
                      className="ov-learning-label"
                    >
                      {a.name}
                    </text>
                  </g>
                );
              })
          : null}
        {stage === 5 ? (
          <>
            <path
              key={selected}
              d={`M${hub.x},${hub.y} Q${(hub.x + ac.x) / 2},${Math.min(ac.y, hub.y) - 30} ${ac.x},${ac.y}`}
              stroke="#bd593a"
              strokeWidth="2"
              fill="none"
              strokeDasharray="5 5"
              className="ov-airport-route"
            />
            <circle cx={hub.x} cy={hub.y} r="4" fill="#365846" />
            <text
              x={hub.x - 8}
              y={hub.y + 20}
              textAnchor="end"
              className="ov-learning-label"
            >
              {airport.hubName}
            </text>
            {AIRPORTS.map((a) => {
              const p = pos(a.point);
              return (
                <g
                  key={a.id}
                  role="button"
                  tabIndex={0}
                  aria-label={a.name}
                  aria-pressed={selected === a.id}
                  onClick={() => onSelect(a.id)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      onSelect(a.id);
                    }
                  }}
                  className="ov-borough-target"
                >
                  <circle cx={p.x} cy={p.y} r="24" fill="transparent" />
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="13"
                    fill={a.id === selected ? "#bd593a" : "#365846"}
                  />
                  <text
                    x={p.x}
                    y={p.y + 5}
                    textAnchor="middle"
                    fill="white"
                    fontSize="17"
                  >
                    ✈
                  </text>
                  <text
                    x={p.x}
                    y={p.y - 23}
                    textAnchor="middle"
                    className="ov-learning-label"
                  >
                    {a.name}
                  </text>
                </g>
              );
            })}
          </>
        ) : null}
        <text x="30" y="35" className="ov-map-north">
          N ↑
        </text>
        <text x="30" y="510" className="ov-learning-note">
          {locale === "es"
            ? "Ciudad de México y su entorno"
            : "Mexico City and its surroundings"}
        </text>
        <text x="30" y="529" className="ov-learning-note">
          {locale === "es"
            ? stage < 2
              ? "Lagos y calzadas: esquema interpretativo"
              : "Límites y transporte: SGIRPC CDMX"
            : stage < 2
              ? "Lakes and causeways: interpretive diagram"
              : "Boundaries and transport: SGIRPC CDMX"}
        </text>
      </svg>
      {stage === 0 && !quiz ? (
        <figure
          className="ov-island-vignette"
          style={{ opacity: Math.max(0.2, 1 - blend / 100) }}
        >
          <Artwork
            id="tenochtitlan-island"
            sizes="(max-width:700px) 120px, 210px"
          />
          <figcaption>
            {locale === "es"
              ? "Tenochtitlan · interpretación"
              : "Tenochtitlan · interpretation"}
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}
