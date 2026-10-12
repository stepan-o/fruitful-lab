"use client";
import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { ERAS, LOCAL_TIMELINES } from "@/lib/mexico-city/atlas/chapters";
import { useLocale } from "@/lib/mexico-city/locale";
import geography from "@/lib/mexico-city/geography.json";
import { project, STORIES } from "@/lib/mexico-city/content";
import Sources from "./Sources";
import PhotoReferences from "../PhotoReferences";
const nodes = [
  { name: "Cuicuilco", p: [-99.183, 19.301] as const, dx: -52, dy: 18 },
  { name: "Tenochtitlan", p: [-99.133, 19.433] as const, dx: -78, dy: 2 },
  { name: "Tlacopan", p: [-99.188, 19.459] as const, dx: -66, dy: -4 },
  { name: "Tepeyac", p: [-99.117, 19.484] as const, dx: -4, dy: -18 },
  { name: "Iztapalapa", p: [-99.092, 19.359] as const, dx: 10, dy: 8 },
  { name: "Xochimilco", p: [-99.104, 19.258] as const, dx: -18, dy: 22 },
];
export default function Timeline({ story }: { story: (id: string) => void }) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [era, setEra] = useState(0),
    [playing, setPlaying] = useState(false),
    [local, setLocal] = useState<string | null>(null);
  const [layers, setLayers] = useState({
    water: true,
    connections: true,
    boundaries: false,
  });
  const selected = ERAS[era];
  useEffect(() => {
    if (!playing) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const id = window.setInterval(() => {
      const next = Math.min(era + 1, ERAS.length - 1);
      setEra(next);
      if (next === ERAS.length - 1) setPlaying(false);
    }, 4200);
    const stop = () => {
      if (document.hidden) setPlaying(false);
    };
    const changed = () => {
      if (media.matches) setPlaying(false);
    };
    document.addEventListener("visibilitychange", stop);
    media.addEventListener("change", changed);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", stop);
      media.removeEventListener("change", changed);
    };
  }, [playing, era]);
  const pos = (p: readonly [number, number]) => {
    const [x, y] = project(p);
    return { x: x * 0.45 + 90, y: y * 0.45 + 180 };
  };
  const island = pos(nodes[1].p);
  const localItem = LOCAL_TIMELINES.find((t) => t.id === local);
  return (
    <section className="at-time">
      <header className="at-section-heading">
        <p className="at-eyebrow">
          {say("MÁQUINA DEL TIEMPO", "TIME MACHINE")}
        </p>
        <h1>
          {say(
            "Mismo lugar. Otras conexiones.",
            "Same place. Different connections.",
          )}
        </h1>
        <p>
          {say(
            "Siete ventanas para leer el cambio. Conserva tus puntos de referencia mientras cambia la historia.",
            "Seven windows onto change. Keep your landmarks while the story changes.",
          )}
        </p>
      </header>
      <div className="at-time-layout">
        <div className="at-time-visual">
          <svg
            viewBox="0 0 620 710"
            role="img"
            aria-label={say(
              "Esquema de la cuenca, con agua y asentamientos como referencias",
              "Basin diagram, with water and settlements as reference points",
            )}
          >
            <defs>
              <pattern
                id="at-time-water"
                width="16"
                height="16"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M0 8q4-4 8 0t8 0"
                  stroke="#79a8b7"
                  fill="none"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <g fill="none" stroke="#bbc8af" strokeWidth="2">
              <path d="M66 450l26-65 26 51 23-66 34 35M60 358l31-81 32 45M164 587l28-73 29 45 32-76 38 67 24-38 29 65M430 170l29 65 19-27 32 73" />
            </g>
            <text x="30" y="256" className="at-svg-note">
              {say("SIERRAS DEL PONIENTE", "WESTERN HIGHLANDS")}
            </text>
            {layers.water && (
              <g
                fill="#dbeef0"
                stroke="#8ebbc2"
                strokeWidth="1.3"
                className="at-time-water"
              >
                <ellipse cx="345" cy="75" rx="40" ry="24" />
                <ellipse cx="350" cy="153" rx="37" ry="35" />
                <ellipse cx="369" cy="275" rx="107" ry="76" />
                <ellipse cx="328" cy="473" rx="44" ry="22" />
                <ellipse cx="411" cy="473" rx="49" ry="25" />
                <ellipse
                  cx="369"
                  cy="275"
                  rx="107"
                  ry="76"
                  fill="url(#at-time-water)"
                />
              </g>
            )}
            {layers.water && (
              <g fill="#517983" fontSize="11" textAnchor="middle">
                <text x="345" y="79">
                  Zumpango
                </text>
                <text x="350" y="157">
                  Xaltocan
                </text>
                <text x="405" y="267">
                  Texcoco
                </text>
                <text x="327" y="513">
                  Xochimilco
                </text>
                <text x="414" y="514">
                  Chalco
                </text>
              </g>
            )}
            {layers.boundaries && (
              <g transform="translate(90 180) scale(.45)">
                {geography.boroughs.map((b) => (
                  <path
                    key={b.id}
                    d={b.path}
                    fill="none"
                    stroke="#6c736a"
                    strokeWidth="1.2"
                    strokeDasharray="5 4"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </g>
            )}
            {layers.connections && era >= 1 && era <= 4 && (
              <g
                stroke={era < 4 ? "#cc8761" : "#b69a73"}
                strokeWidth="3"
                strokeDasharray="5 6"
                fill="none"
              >
                {nodes.slice(2, 5).map((n) => {
                  const p = pos(n.p);
                  return (
                    <path
                      key={n.name}
                      d={`M${island.x} ${island.y}L${p.x} ${p.y}`}
                    />
                  );
                })}
                {era >= 4 && (
                  <path d={`M${island.x} ${island.y}Q330 385 328 447`} />
                )}
              </g>
            )}
            {layers.connections && era >= 5 && (
              <g
                stroke="#8c9985"
                strokeWidth="3"
                fill="none"
                strokeDasharray="3 7"
              >
                <path
                  d={`M${pos(nodes[3].p).x} ${pos(nodes[3].p).y}L${island.x} ${island.y}L${pos(nodes[0].p).x} ${pos(nodes[0].p).y}`}
                />
                <path
                  d={`M${pos(nodes[2].p).x} ${pos(nodes[2].p).y}L${island.x} ${island.y}L${pos(nodes[4].p).x} ${pos(nodes[4].p).y}`}
                />
                <path
                  d={`M${pos(nodes[0].p).x} ${pos(nodes[0].p).y}L${pos(nodes[5].p).x} ${pos(nodes[5].p).y}`}
                />
              </g>
            )}
            {nodes.map((n, i) => {
              if (era === 0 && i !== 0) return null;
              const p = pos(n.p);
              return (
                <g key={n.name}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={i === 1 ? 7 : 5}
                    fill={i === 0 ? "#b86b4e" : "#456e5a"}
                  />
                  <text
                    x={p.x + n.dx}
                    y={p.y + n.dy}
                    fontSize="11"
                    fill="#364c42"
                  >
                    {n.name}
                  </text>
                </g>
              );
            })}
            <g transform="translate(542 74)" fill="#455746">
              <path d="M0-17l-7 22 7-4 7 4Z" />
              <text x="0" y="24" textAnchor="middle" fontSize="12">
                N
              </text>
            </g>
            <text x="32" y="630" className="at-svg-date">
              {typeof selected.date === "string"
                ? selected.date
                : selected.date[locale]}
            </text>
            <text x="32" y="659" className="at-svg-note">
              {say(
                "REFERENCIAS FIJAS · CONEXIONES ESQUEMÁTICAS",
                "FIXED REFERENCES · SCHEMATIC CONNECTIONS",
              )}
            </text>
          </svg>
          <div className="at-time-layer-controls">
            {Object.keys(layers).map((k) => {
              const key = k as keyof typeof layers;
              return (
                <button
                  key={key}
                  aria-pressed={layers[key]}
                  onClick={() => setLayers((v) => ({ ...v, [key]: !v[key] }))}
                >
                  {key === "water"
                    ? say("Lagos de referencia", "Reference lakes")
                    : key === "connections"
                      ? say("Conexiones", "Connections")
                      : say("Límites actuales", "Current boundaries")}
                </button>
              );
            })}
          </div>
        </div>
        <div className="at-era-content">
          <p className="at-eyebrow">
            {era + 1} / 7 · {selected.label[locale]}
          </p>
          <h2>{selected.title[locale]}</h2>
          <p>{selected.text[locale]}</p>
          <div className="at-timeline-controls">
            <button
              className="at-round"
              aria-label={
                playing
                  ? say("Pausar recorrido", "Pause sequence")
                  : say("Reproducir recorrido", "Play sequence")
              }
              onClick={() => {
                if (
                  window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ) {
                  setEra((v) => (v + 1) % ERAS.length);
                  return;
                }
                if (era === ERAS.length - 1) setEra(0);
                setPlaying((v) => !v);
              }}
            >
              {playing ? <Pause size={19} /> : <Play size={19} />}
            </button>
            <label>
              {say("Época", "Era")}
              <input
                aria-label={say("Elegir época", "Choose era")}
                type="range"
                min="0"
                max={ERAS.length - 1}
                value={era}
                onChange={(e) => {
                  setPlaying(false);
                  setEra(Number(e.target.value));
                }}
              />
            </label>
          </div>
          <div className="at-era-buttons">
            {ERAS.map((e, i) => (
              <button
                key={i}
                aria-pressed={i === era}
                onClick={() => {
                  setPlaying(false);
                  setEra(i);
                }}
              >
                {typeof e.date === "string" ? e.date : e.date[locale]}
              </button>
            ))}
          </div>
          <p className="at-map-disclosure">
            {say(
              "El agua permanece como referencia histórica: estas siluetas no miden costas ni superficies urbanas. El recorrido anima conexiones documentadas, no una simulación de crecimiento. Las 16 alcaldías siempre son límites actuales.",
              "Water remains a historical reference: these silhouettes do not measure shorelines or urban areas. The sequence animates documented connections, not a growth simulation. The 16 boroughs always show current boundaries.",
            )}
          </p>
          <Sources ids={selected.sources} />
          {era === 1 || era === 2 ? (
            <PhotoReferences kind="map" />
          ) : era === 5 ? (
            <PhotoReferences kind="revolucion" />
          ) : null}
        </div>
      </div>
      <section className="at-local-times">
        <h2>
          {say("Acércate a una transformación", "Zoom into a transformation")}
        </h2>
        <div className="at-chips">
          {LOCAL_TIMELINES.map((t) => (
            <button
              key={t.id}
              aria-pressed={local === t.id}
              onClick={() => setLocal(t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>
        {localItem && (
          <div>
            <ol className="at-local-stages">
              {localItem.stages.map((s, i) => (
                <li key={i}>
                  <span>0{i + 1}</span>
                  <p>{s[locale]}</p>
                </li>
              ))}
            </ol>
            <button className="at-primary" onClick={() => story(localItem.id)}>
              {say("Abrir la historia", "Open the story")} ↗
            </button>
            <Sources
              ids={
                localItem.sources.length
                  ? localItem.sources
                  : [STORIES.find((s) => s.id === "chapultepec")!.source.url]
              }
            />
          </div>
        )}
      </section>
    </section>
  );
}
