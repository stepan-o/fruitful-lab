"use client";

import layers from "@/lib/mexico-city/map-layers.json";
import { useLocale } from "@/lib/mexico-city/locale";
import type { View } from "@/lib/mexico-city/content";

export type LayerSettings = {
  metro: boolean;
  areas: boolean;
  streets: boolean;
  cable: boolean;
};
type Box = { x: number; y: number; width: number; height: number };
export function MapDetails({
  view,
  settings,
  scale,
  tx,
  ty,
  width,
  height,
  obstacles,
}: {
  view: View;
  settings: LayerSettings;
  scale: number;
  tx: number;
  ty: number;
  width: number;
  height: number;
  obstacles: Box[];
}) {
  const { t } = useLocale();
  const screen = (p: number[]) => ({
    x: p[0] * scale + tx,
    y: p[1] * scale + ty,
  });
  const visible = (p: { x: number; y: number }, margin = 20) =>
    p.x > margin && p.x < width - margin && p.y > 65 && p.y < height - 55;
  const occupied = [...obstacles];
  const fits = (point: { x: number; y: number }, text: string, font = 10) => {
    const box = {
      x: point.x - text.length * font * 0.28 - 5,
      y: point.y - 12,
      width: text.length * font * 0.56 + 10,
      height: 23,
    };
    if (
      !visible(point) ||
      box.x < 6 ||
      box.x + box.width > width - 6 ||
      occupied.some(
        (b) =>
          box.x < b.x + b.width &&
          box.x + box.width > b.x &&
          box.y < b.y + b.height &&
          box.y + box.height > b.y,
      )
    )
      return false;
    occupied.push(box);
    return true;
  };
  const stations =
    settings.metro && view.level !== "city"
      ? layers.stations.filter((s) => visible(screen(s.point)))
      : [];
  // Reserve some space for area names before transit captions fill the map.
  let areaCount = 0;
  const areas =
    settings.areas && view.level !== "city"
      ? layers.areas.filter((a) => {
          if (
            areaCount >= (width < 500 ? 2 : 6) ||
            !fits(screen(a.point), a.name, 11)
          )
            return false;
          areaCount++;
          return true;
        })
      : [];
  const streetLabels =
    settings.streets && view.level !== "city"
      ? layers.streets.flatMap((s) => {
          const candidates = s.points.map(screen).filter((p) => visible(p, 45));
          if (!candidates.length) return [];
          // Try several positions on the real road; do not displace a street caption off its road.
          const sorted = [
            candidates[Math.floor(candidates.length / 2)],
            candidates[0],
            candidates[candidates.length - 1],
            ...candidates,
          ];
          const p = sorted.find((p) => fits(p, s.name));
          return p ? [{ ...p, name: s.name }] : [];
        })
      : [];
  const seen = new Set<string>();
  const stationLabels = stations.flatMap((s) => {
    if (seen.has(s.name)) return [];
    seen.add(s.name);
    const p = screen(s.point);
    const label = [
      { x: p.x, y: p.y - 13 },
      { x: p.x, y: p.y + 22 },
      { x: p.x + s.name.length * 3.2 + 12, y: p.y + 4 },
      { x: p.x - s.name.length * 3.2 - 12, y: p.y + 4 },
    ].find((candidate) => fits(candidate, s.name, 11));
    return label ? [{ ...s, label }] : [];
  });
  return (
    <g
      className="ov-map-details"
      aria-label={t("Map layers")}
      pointerEvents="none"
    >
      <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
        {settings.areas && view.level !== "city"
          ? layers.areas.map((a) => (
              <path
                key={a.id}
                d={a.path}
                fill="none"
                stroke="#bacab9"
                strokeWidth=".65"
                strokeDasharray="3 4"
                vectorEffect="non-scaling-stroke"
              />
            ))
          : null}
        {settings.streets && view.level !== "city"
          ? layers.streets.map((s) => (
              <path
                key={s.name}
                className="ov-key-street"
                d={s.path}
                fill="none"
                stroke="#d59d55"
                strokeWidth="2.8"
                strokeOpacity=".7"
                vectorEffect="non-scaling-stroke"
              />
            ))
          : null}
        {settings.metro
          ? layers.lines.map((l) => (
              <path
                key={l.id}
                data-metro-line={l.id}
                d={l.path}
                fill="none"
                stroke={l.color}
                strokeWidth={view.level === "city" ? 2 : 3.5}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
              >
                <title>
                  {t("Line {line}", { line: l.id })} · {l.route}
                </title>
              </path>
            ))
          : null}
        {settings.cable
          ? layers.cable.map((l) => (
              <path
                key={l.id}
                data-cable-line={l.line}
                d={l.path}
                fill="none"
                stroke="#2c91a8"
                strokeWidth="3"
                strokeDasharray="5 4"
                vectorEffect="non-scaling-stroke"
              />
            ))
          : null}
      </g>
      {stations.map((s) => {
        const p = screen(s.point);
        return (
          <circle
            key={s.id}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill="white"
            stroke="#263b36"
            strokeWidth="1.3"
          >
            <title>
              {s.name} · {t("Line {line}", { line: s.line })}
            </title>
          </circle>
        );
      })}
      {areas.map((a) => {
        const p = screen(a.point);
        return (
          <text
            key={a.id}
            x={p.x}
            y={p.y}
            className="ov-area-caption"
            textAnchor="middle"
          >
            {a.name}
          </text>
        );
      })}
      {streetLabels.map((s) => (
        <text
          key={s.name}
          x={s.x}
          y={s.y}
          className="ov-street-caption"
          textAnchor="middle"
        >
          {s.name}
        </text>
      ))}
      {stationLabels.map((s) => {
        const p = screen(s.point);
        return (
          <g key={s.id}>
            <path
              d={`M${p.x},${p.y} L${s.label.x},${s.label.y - 4}`}
              stroke="#29483e"
              strokeWidth=".6"
              opacity=".4"
            />
            <text
              x={s.label.x}
              y={s.label.y}
              textAnchor="middle"
              className="ov-station-caption"
            >
              {s.name}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function LayerControls({
  settings,
  setSettings,
}: {
  settings: LayerSettings;
  setSettings: (settings: LayerSettings) => void;
}) {
  const { t } = useLocale();
  return (
    <div
      className="ov-layer-controls"
      role="group"
      aria-label={t("Map layers")}
    >
      {(
        [
          ["areas", "Areas"],
          ["streets", "Key streets"],
          ["metro", "Metro"],
          ["cable", "Cablebús"],
        ] as const
      ).map(([key, label]) => (
        <button
          key={key}
          aria-pressed={settings[key]}
          onClick={() => setSettings({ ...settings, [key]: !settings[key] })}
        >
          <span aria-hidden="true">{settings[key] ? "●" : "○"}</span> {t(label)}
        </button>
      ))}
    </div>
  );
}
