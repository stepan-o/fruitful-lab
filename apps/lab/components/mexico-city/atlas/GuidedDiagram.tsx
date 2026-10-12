"use client";
import { useState } from "react";
import { c, type Copy } from "@/lib/mexico-city/atlas/content";
import type { Section } from "@/lib/mexico-city/atlas/history";
import { useLocale } from "@/lib/mexico-city/locale";
import Sources from "./Sources";
type Panel = { label: Copy; text: Copy; sources: string[] };
const panel = (label: Copy, text: Copy, ...sources: string[]): Panel => ({
  label,
  text,
  sources,
});
const PANELS: Record<NonNullable<Section["diagram"]>, Panel[]> = {
  basin: [
    panel(
      c("1. La lluvia", "1. Rain"),
      c(
        "El agua cae sobre un territorio rodeado de elevaciones. El corte muestra una relación entre alturas, no el perfil de una calle.",
        "Rain falls on terrain surrounded by high ground. This section shows a relationship between elevations, not a street profile.",
      ),
      "drainageWorks",
    ),
    panel(
      c("2. Las laderas", "2. Slopes"),
      c(
        "Los escurrimientos bajan hacia las depresiones. Sigue las flechas hacia el interior de la cuenca.",
        "Runoff moves toward depressions. Follow the arrows toward the basin’s interior.",
      ),
      "drainageWorks",
    ),
    panel(
      c("3. Las partes bajas", "3. Low ground"),
      c(
        "En la cuenca naturalmente cerrada se reunía el agua. Las salidas artificiales pertenecen a una historia posterior.",
        "Water gathered inside the naturally closed basin. Artificial outlets belong to a later history.",
      ),
      "drainageWorks",
    ),
  ],
  lakes: [
    panel(
      c("El conjunto", "The system"),
      c(
        "Cinco lagos principales; relaciones de posición. Las siluetas son didácticas, no costas medidas para una fecha.",
        "Five main lakes in relative positions. These teaching shapes are not surveyed shorelines for a date.",
      ),
      "basin",
    ),
    panel(
      c("Norte", "North"),
      c(
        "Zumpango y Xaltocan: busca la pareja septentrional antes de seguir hacia Texcoco.",
        "Zumpango and Xaltocan: locate the northern pair before moving toward Texcoco.",
      ),
      "basin",
    ),
    panel(
      c("Centro", "Center"),
      c(
        "Texcoco ocupa el sector central del esquema. Su salinidad ayuda a explicar diferencias de usos respecto a las aguas del sur.",
        "Texcoco occupies the central part of the diagram. Its salinity helps explain different uses from the southern waters.",
      ),
      "basin",
    ),
    panel(
      c("Sur", "South"),
      c(
        "Xochimilco y Chalco: agua dulce y paisajes agrícolas. El próximo capítulo se detiene en las chinampas.",
        "Xochimilco and Chalco: fresh water and agricultural landscapes. The next chapter examines chinampas.",
      ),
      "basin",
      "chinampas",
    ),
  ],
  chinampa: [
    panel(
      c("Suelo construido", "Built soil"),
      c(
        "Una parcela elevada: sedimentos y materia orgánica forman suelo cultivable. No es una balsa que navega.",
        "A raised plot: sediments and organic material create cultivable soil. It is not a moving raft.",
      ),
      "chinampas",
      "chinampaStudy",
    ),
    panel(
      c("Canales", "Canals"),
      c(
        "El agua rodea la parcela. Los canales permiten circulación y aportan lodo para preparar almácigos en la técnica descrita.",
        "Water surrounds the plot. Canals allow movement and provide mud for preparing seedbeds in the technique described.",
      ),
      "chapin",
      "chinampas",
    ),
    panel(
      c("Bordes vivos", "Living edges"),
      c(
        "Los ahuejotes acompañan los bordes. Parcela, vegetación y agua necesitan cuidado; el dibujo separa piezas de un mismo sistema.",
        "Ahuejote willows line the edges. Field, vegetation and water require care; the drawing separates parts of one system.",
      ),
      "chinampas",
    ),
  ],
  cities: [
    panel(
      c("Cuicuilco", "Cuicuilco"),
      c(
        "Sur de la cuenca · Preclásico. Su basamento circular y su entorno lacustre pertenecen a una historia anterior a Tenochtitlan.",
        "Southern basin · Preclassic. Its circular platform and lake environment belong to a history before Tenochtitlan.",
      ),
      "cuicuilcoMuseum",
      "cuicuilcoLandscape",
    ),
    panel(
      c("Teotihuacan", "Teotihuacan"),
      c(
        "Noreste de la cuenca · Clásico. Una gran ciudad con barrios y conexiones lejanas, anterior al imperio mexica.",
        "Northeastern basin · Classic. A major city with neighborhoods and distant connections, preceding the Mexica empire.",
      ),
      "teotihuacanCity",
    ),
    panel(
      c("Tula", "Tula"),
      c(
        "Al norte de la cuenca · apogeo en el Posclásico temprano. Es otro centro y otra trayectoria, no un barrio de Teotihuacan.",
        "North of the basin · Early Postclassic prominence. Another center and trajectory, not a Teotihuacan neighborhood.",
      ),
      "tula",
    ),
  ],
  alliance: [
    panel(
      c("Tenochtitlan", "Tenochtitlan"),
      c(
        "La capital mexica pasa de la subordinación tepaneca a formar parte de una alianza victoriosa en 1428.",
        "The Mexica capital moves from Tepanec subordination to membership in a victorious alliance in 1428.",
      ),
      "alliance",
    ),
    panel(
      c("Texcoco", "Texcoco"),
      c(
        "Texcoco fue otro de los centros de la Triple Alianza. La historia del imperio no se reduce a una sola ciudad.",
        "Texcoco was another center of the Triple Alliance. Imperial history is not reducible to a single city.",
      ),
      "alliance",
    ),
    panel(
      c("Tlacopan", "Tlacopan"),
      c(
        "Tlacopan, hoy Tacuba, completa la alianza. Las líneas indican relación política, no fronteras ni rutas medidas.",
        "Tlacopan, today Tacuba, completes the alliance. Lines indicate political relations, not borders or surveyed routes.",
      ),
      "alliance",
    ),
  ],
  waterworks: [
    panel(
      c("Calzadas", "Causeways"),
      c(
        "Conectar: Tlacopan al poniente, Tepeyac al norte e Iztapalapa hacia el sur. Mostramos relaciones, no el trazo preciso de calles actuales.",
        "Connect: Tlacopan westward, Tepeyac northward and Iztapalapa southward. These are relationships, not exact modern street alignments.",
      ),
      "causeways",
    ),
    panel(
      c("Albarradón", "Dike"),
      c(
        "Regular: el dique al oriente de la ciudad separaba aguas y ayudaba a manejar niveles mediante compuertas.",
        "Regulate: the dike east of the city separated waters and helped manage levels through gates.",
      ),
      "hydraulicCity",
    ),
    panel(
      c("Acueducto", "Aqueduct"),
      c(
        "Abastecer: el agua de Chapultepec llegaba mediante el acueducto. Tener un lago alrededor no resolvía el suministro de agua dulce.",
        "Supply: Chapultepec water arrived through the aqueduct. A surrounding lake did not solve fresh-water supply.",
      ),
      "hydraulicCity",
    ),
  ],
  siege: [
    panel(
      c("Por tierra", "By land"),
      c(
        "Los accesos sobre las calzadas se convirtieron en frentes de ataque y bloqueo. La circulación cotidiana pasó a ser un problema militar.",
        "Causeway access became a focus of attack and blockade. Everyday circulation became a military problem.",
      ),
      "siege",
    ),
    panel(
      c("Por agua", "By water"),
      c(
        "Los bergantines preparados en Texcoco apoyaron operaciones sobre el lago. El asedio combinó fuerzas y vías distintas.",
        "Brigantines prepared at Texcoco supported lake operations. The siege combined different forces and approaches.",
      ),
      "siege",
    ),
    panel(
      c("Abastecimiento", "Supply"),
      c(
        "Interrumpir conexiones presionaba a quienes habitaban la isla. Este esquema explica funciones; no reconstruye posiciones de tropas.",
        "Severing connections put pressure on island inhabitants. This schematic explains functions, not troop positions.",
      ),
      "siege",
      "epidemic",
    ),
  ],
  drainage: [
    panel(
      c("1607", "1607"),
      c(
        "Huehuetoca: comienza un proyecto para enviar agua fuera de la cuenca. Cambia la estrategia de intervención.",
        "Huehuetoca: a project begins to send water outside the basin, changing the intervention strategy.",
      ),
      "firstDrain",
    ),
    panel(
      c("1629", "1629"),
      c(
        "Una gran inundación deja la ciudad anegada durante años. El inicio de una obra no equivale a una solución inmediata.",
        "A major flood leaves the city inundated for years. Beginning a project is not the same as an immediate solution.",
      ),
      "water",
    ),
    panel(
      c("1900", "1900"),
      c(
        "Se inaugura el Gran Canal del Desagüe. El hito no representa la desaparición instantánea de todos los canales.",
        "The Grand Drainage Canal opens. This milestone does not mark the instant disappearance of every canal.",
      ),
      "drainageWorks",
      "viga",
    ),
  ],
  growth: [
    panel(
      c("Abastecer", "Supply"),
      c(
        "El abastecimiento se extendió fuera de la cuenca mientras aumentaba la presión sobre aguas subterráneas.",
        "Supply extended outside the basin while pressure on groundwater increased.",
      ),
      "rivers",
    ),
    panel(
      c("Moverse", "Move"),
      c(
        "1969: inauguración del Metro. La red conecta partes de una metrópoli que ya se estaba expandiendo.",
        "1969: the Metro opens, connecting parts of an already expanding metropolis.",
      ),
      "metroHistory",
    ),
    panel(
      c("Desaguar", "Drain"),
      c(
        "1975: Drenaje Profundo. Una red para evacuar agua; una función diferente del abastecimiento y del transporte.",
        "1975: Deep Drainage. A network discharging water, with a different function from supply and transport.",
      ),
      "water",
    ),
  ],
  subsoil: [
    panel(
      c("Depósitos", "Deposits"),
      c(
        "Sedimentos lacustres compresibles bajo parte de la ciudad. No todo el territorio tiene el mismo suelo.",
        "Compressible lake sediments beneath part of the city. Ground conditions vary across the territory.",
      ),
      "subsidence",
    ),
    panel(
      c("Extracción", "Extraction"),
      c(
        "Extraer agua subterránea puede contribuir a la compactación. El agua ocupa poros y formaciones; no dibujamos un lago abierto bajo una calle.",
        "Groundwater extraction can contribute to compaction. Water occupies pores and formations; this is not an open lake beneath a street.",
      ),
      "subsidence",
    ),
    panel(
      c("Compactación", "Compaction"),
      c(
        "El hundimiento es desigual. Este corte conceptual no representa una calle concreta ni permite evaluar un edificio.",
        "Subsidence varies by location. This conceptual section is not a particular street or a building assessment.",
      ),
      "subsidence",
    ),
  ],
};
function Caption({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fill="#263e38"
      fontSize="18"
      fontWeight="600"
    >
      {children}
    </text>
  );
}
export default function GuidedDiagram({
  kind,
  chapter,
}: {
  kind: NonNullable<Section["diagram"]>;
  chapter: string;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [step, setStep] = useState(0);
  const options =
    kind === "drainage" && chapter === "conquest"
      ? PANELS[kind].slice(0, 2)
      : PANELS[kind];
  const selected = options[step];
  const opacity = (n: number) => (step === n ? 1 : 0.24);
  const lakes = [
    { name: "Zumpango", x: 170, y: 57, rx: 57, ry: 25, group: 1 },
    { name: "Xaltocan", x: 238, y: 120, rx: 58, ry: 28, group: 1 },
    { name: "Texcoco", x: 290, y: 210, rx: 100, ry: 54, group: 2 },
    { name: "Xochimilco", x: 147, y: 315, rx: 67, ry: 29, group: 3 },
    { name: "Chalco", x: 305, y: 317, rx: 66, ry: 31, group: 3 },
  ];
  return (
    <figure className={`at-guided at-guided-${kind}`}>
      <div className="at-guided-heading">
        <span>{say("MIRA CÓMO SE RELACIONA", "SEE THE RELATIONSHIP")}</span>
        <small>{say("Diagrama explicativo", "Explanatory diagram")}</small>
      </div>
      <div
        className="at-guided-controls"
        role="group"
        aria-label={say("Vistas del diagrama", "Diagram views")}
      >
        {options.map((p, i) => (
          <button key={i} aria-pressed={i === step} onClick={() => setStep(i)}>
            {p.label[locale]}
          </button>
        ))}
      </div>
      <svg
        viewBox={`0 0 460 ${kind === "lakes" ? 390 : 320}`}
        role="img"
        aria-label={selected.text[locale]}
      >
        {kind === "basin" && (
          <>
            <path
              d="M0 260 65 100 145 227 195 255 278 255 344 98 460 250V320H0Z"
              fill="#dfe8d4"
            />
            <path
              d="m0 260 65-160 80 127 50 28h83l66-157 116 152"
              fill="none"
              stroke="#85987b"
              strokeWidth="3"
            />
            <path
              d="M154 235Q227 239 303 235L278 256H195Z"
              fill="#54bacc"
              opacity={step === 2 ? 1 : 0.4}
            />
            <g fill="#fff" stroke="#a7cbd3" strokeWidth="2">
              <path d="M121 45c0-28 38-38 53-13 25-15 46 8 35 25h-85Z" />
              <path d="M280 48c-9-28 31-42 48-17 29-10 46 22 21 30h-64Z" />
            </g>
            <g opacity={opacity(0)} stroke="#3b9eb2" strokeWidth="3">
              {[130, 154, 184, 292, 315, 338].map((x) => (
                <path key={x} d={`M${x} 72l-9 29`} />
              ))}
            </g>
            <g
              opacity={opacity(1)}
              stroke="#db8746"
              fill="none"
              strokeWidth="4"
            >
              <path d="m103 152 64 80-22-7m22 7-2-22M324 150l-35 80 19-11m-19 11-2-23" />
            </g>
            <Caption x={75} y={291}>
              {say("Ladera", "Slope")}
            </Caption>
            <Caption x={236} y={291}>
              {say("Lago", "Lake")}
            </Caption>
            <Caption x={380} y={291}>
              {say("Ladera", "Slope")}
            </Caption>
          </>
        )}
        {kind === "lakes" && (
          <>
            <path
              d="M100 27Q310-20 390 112T370 350Q243 395 90 340T100 27Z"
              fill="#f0ecda"
            />
            <path
              d="M183 82 230 100M242 145 279 160M256 259 161 290M300 266 308 289"
              stroke="#aad7df"
              strokeWidth="8"
              strokeDasharray="4 6"
            />
            {lakes.map((l) => (
              <g
                key={l.name}
                opacity={step === 0 || step === l.group ? 1 : 0.27}
              >
                <ellipse
                  cx={l.x}
                  cy={l.y}
                  rx={l.rx}
                  ry={l.ry}
                  fill={l.group === 2 ? "#73bacb" : "#a0d5d8"}
                  stroke="#3e8d9a"
                  strokeWidth="2"
                />
                <Caption x={l.x} y={l.y + 6}>
                  {l.name}
                </Caption>
              </g>
            ))}
            <path
              d="M420 66V22l-6 12m6-12 6 12"
              fill="none"
              stroke="#374b46"
              strokeWidth="2"
            />
            <Caption x={420} y={89}>
              N
            </Caption>
          </>
        )}
        {kind === "chinampa" && (
          <>
            <path
              d="M25 187H435V280H25Z"
              fill="#97d4de"
              opacity={step === 1 ? 1 : 0.6}
            />
            <path
              d="M119 165H341V275H119Z"
              fill="#bd9874"
              opacity={step === 0 ? 1 : 0.55}
            />
            <path d="M119 165H341V184H119Z" fill="#698a4d" />
            <path
              d="M129 208H331M129 235H331M129 259H331"
              stroke="#8e694b"
              strokeWidth="3"
              strokeDasharray="8 7"
              opacity={opacity(0)}
            />
            <g stroke="#557345" strokeWidth="4" fill="none">
              {[172, 205, 238, 271, 305].map((x) => (
                <path key={x} d={`M${x} 169v-40m0 21-14-14m14 6 12-16`} />
              ))}
            </g>
            {[126, 338].map((x) => (
              <g key={x} opacity={step === 2 ? 1 : 0.55}>
                <path d={`M${x} 169V67`} stroke="#786744" strokeWidth="6" />
                <ellipse cx={x} cy="78" rx="24" ry="53" fill="#74976b" />
                <path
                  d={`M${x} 172l-10 27m10-27 12 24`}
                  stroke="#786744"
                  strokeWidth="3"
                />
              </g>
            ))}
            <path d="M33 220h64l-12 12H46Z" fill="#7f5c3c" />
            <path d="m74 223 19-47" stroke="#7f5c3c" strokeWidth="3" />
            <Caption x={63} y={302}>
              {say("Canal", "Canal")}
            </Caption>
            <Caption x={230} y={302}>
              {say("Parcela", "Field")}
            </Caption>
            <Caption x={391} y={302}>
              {say("Canal", "Canal")}
            </Caption>
          </>
        )}
        {kind === "cities" && (
          <>
            <path d="M65 251H394" stroke="#d2c9b6" strokeWidth="4" />
            {[75, 230, 385].map((x, i) => (
              <g key={x} opacity={opacity(i)}>
                <circle cx={x} cy="251" r="9" fill="#c57649" />
                {i === 0 ? (
                  <>
                    <ellipse cx={x} cy="190" rx="60" ry="25" fill="#c49e79" />
                    <ellipse cx={x} cy="174" rx="43" ry="17" fill="#ddbd9a" />
                    <path d={`M${x - 8} 166h16v48h-16Z`} fill="#f0d6b4" />
                  </>
                ) : i === 1 ? (
                  <path
                    d="M164 211h132l-18-31h-19v-31h-20v-29h-20v29h-20v31h-17Z"
                    fill="#bd9a79"
                  />
                ) : (
                  <>
                    <path d="M345 215h80v-25h-80Z" fill="#bd9a79" />
                    {[365, 391, 413].map((cx) => (
                      <path
                        key={cx}
                        d={`M${cx} 190V139m-5-5h10v-16h-10Z`}
                        stroke="#927c5e"
                        strokeWidth="11"
                      />
                    ))}
                  </>
                )}
              </g>
            ))}
            <Caption x={230} y={48}>
              {options[step].label[locale]}
            </Caption>
            <Caption x={230} y={79}>
              {
                [
                  say("Sur · Preclásico", "South · Preclassic"),
                  say("Noreste · Clásico", "Northeast · Classic"),
                  say("Norte · Posclásico", "North · Postclassic"),
                ][step]
              }
            </Caption>
          </>
        )}
        {kind === "alliance" && (
          <>
            <path
              d="M85 110 375 110 230 246Z"
              fill="#eff2da"
              stroke="#95aca1"
              strokeWidth="3"
              strokeDasharray="6 6"
            />
            {[
              { x: 230, y: 246, i: 0, label: "Tenochtitlan" },
              { x: 375, y: 110, i: 1, label: "Texcoco" },
              { x: 85, y: 110, i: 2, label: "Tlacopan" },
            ].map((n) => (
              <g key={n.i}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={step === n.i ? 27 : 17}
                  fill={step === n.i ? "#dd9563" : "#c0d7c7"}
                />
                <Caption x={n.x} y={n.y + 49}>
                  {n.label}
                </Caption>
              </g>
            ))}
            <Caption x={230} y={45}>
              1428
            </Caption>
          </>
        )}
        {(kind === "waterworks" || kind === "siege") && (
          <>
            <path
              d="M106 27Q319-12 397 86T371 280Q230 325 109 248T106 27Z"
              fill="#b4dee4"
            />
            <ellipse
              cx="217"
              cy="155"
              rx="45"
              ry="43"
              fill="#f3dda8"
              stroke="#bf9957"
            />
            <path
              d="M173 153H53M217 112V37M221 198l49 79"
              stroke={
                kind === "waterworks" && step === 0 ? "#d78049" : "#a89773"
              }
              strokeWidth="9"
              opacity={kind === "waterworks" ? (step === 0 ? 1 : 0.35) : 1}
            />
            <path
              d="M312 61 326 108l-10 45 20 44-23 57"
              stroke="#bd638b"
              strokeWidth="6"
              fill="none"
              strokeDasharray="18 6"
              opacity={kind === "waterworks" ? opacity(1) : 0.15}
            />
            <path
              d="M58 231 175 175"
              stroke="#398fba"
              strokeWidth="6"
              opacity={
                kind === "waterworks" ? opacity(2) : step === 2 ? 1 : 0.2
              }
            />
            <path d="M35 243 58 197l23 46Z" fill="#91ab71" />
            {kind === "siege" && (
              <g stroke="#b45a43" strokeWidth="5" fill="none">
                {step === 0 ? (
                  <path d="m102 133 25 38m-25 0 25-38m91-59 20 22m-20 0 20-22" />
                ) : step === 1 ? (
                  <>
                    <path d="m361 188-73-7 14-10m-14 10 14 13m49 26-54-3 10-10" />
                    <path d="M367 167v-29l18 29Z" />
                  </>
                ) : (
                  <path d="m102 192 22 24m-24 0 25-24" />
                )}
              </g>
            )}
            <Caption x={220} y={162}>
              {say("Isla", "Island")}
            </Caption>
            <Caption x={63} y={124}>
              Tlacopan
            </Caption>
            <Caption x={217} y={24}>
              Tepeyac
            </Caption>
            <Caption x={272} y={307}>
              Iztapalapa
            </Caption>
            <Caption x={72} y={274}>
              Chapultepec
            </Caption>
            <Caption x={374} y={45}>
              Texcoco
            </Caption>
          </>
        )}
        {kind === "drainage" && (
          <>
            <path
              d="M0 148 65 71 139 173 312 173 365 80 460 153V320H0Z"
              fill="#e5e6d3"
            />
            <path
              d={
                step === 1
                  ? "M113 139H334L312 174H139Z"
                  : "M135 163H320L312 174H139Z"
              }
              fill="#73c4d7"
            />
            {step !== 1 && (
              <path
                d="M194 166H95L59 105H9m0 0 17-10M9 105l17 11"
                stroke="#398fba"
                strokeWidth="5"
                fill="none"
                strokeDasharray={step === 0 ? "6 5" : undefined}
              />
            )}
            <path
              d="M210 160v-43h26v43m8 0v-31h22v31m9 0v-55h25v55"
              fill="#d5ad86"
              stroke="#a58264"
              strokeWidth="2"
            />
            <Caption x={230} y={235}>
              {options[step].label[locale]}
            </Caption>
            <Caption x={230} y={268}>
              {step === 1
                ? say("La ciudad se inunda", "The city floods")
                : say(
                    "Agua hacia una salida artificial",
                    "Water toward an artificial outlet",
                  )}
            </Caption>
          </>
        )}
        {kind === "growth" && (
          <>
            <circle cx="231" cy="162" r="62" fill="#ead6ad" />
            <Caption x={231} y={168}>
              {say("Metrópoli", "Metropolis")}
            </Caption>
            <g fill="none" strokeWidth="7" strokeLinecap="round">
              <path
                d="M50 67Q151 47 194 104"
                stroke="#4c9db6"
                opacity={opacity(0)}
              />
              <path
                d="M55 258Q194 287 222 225M291 175 410 247"
                stroke="#bd765a"
                opacity={opacity(1)}
              />
              <path
                d="M280 118Q352 61 418 87"
                stroke="#889477"
                opacity={opacity(2)}
              />
            </g>
            <Caption x={95} y={43}>
              {say("Agua entra", "Water enters")}
            </Caption>
            <Caption x={130} y={300}>
              {say("Personas", "People")}
            </Caption>
            <Caption x={367} y={43}>
              {say("Agua sale", "Water leaves")}
            </Caption>
          </>
        )}
        {kind === "subsoil" && (
          <>
            <path d="M30 140H430V202H30Z" fill="#ceb393" />
            <path d="M30 202H430V290H30Z" fill="#b5c2a2" />
            <g fill="#8ab7c2" opacity=".7">
              {Array.from({ length: 30 }, (_, i) => (
                <circle
                  key={i}
                  cx={45 + (i % 10) * 40}
                  cy={216 + Math.floor(i / 10) * 24}
                  r="5"
                />
              ))}
            </g>
            <g transform={step === 2 ? "translate(0 15)" : ""}>
              <path
                d="M35 139H325M90 137V74h49v63m36 0V52h63v85m27 0V89h35v48"
                stroke="#687e77"
                strokeWidth="4"
                fill="#e7eddf"
              />
            </g>
            <path
              d="M374 258V62h38"
              stroke="#4e8598"
              strokeWidth="8"
              fill="none"
              opacity={opacity(1)}
            />
            {step === 2 && (
              <path
                d="M183 181v27l-7-10m7 10 7-10M265 181v27l-7-10m7 10 7-10"
                stroke="#b56b46"
                strokeWidth="4"
                fill="none"
              />
            )}
            <Caption x={222} y={184}>
              {say("Sedimentos", "Sediments")}
            </Caption>
            <Caption x={223} y={315}>
              {say(
                "Corte conceptual · sin escala",
                "Conceptual section · not to scale",
              )}
            </Caption>
          </>
        )}
      </svg>
      <figcaption aria-live="polite">
        <strong>{selected.label[locale]}</strong>
        <p>{selected.text[locale]}</p>
        <Sources ids={selected.sources} compact />
        <small>
          {say(
            "Dibujo editorial de relaciones y procesos; no es una reconstrucción topográfica.",
            "Editorial drawing of relationships and processes; not a topographic reconstruction.",
          )}
        </small>
      </figcaption>
    </figure>
  );
}
