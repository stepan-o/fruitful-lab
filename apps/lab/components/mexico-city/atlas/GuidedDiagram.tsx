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
        "La lluvia cae sobre las montañas que rodean la cuenca. El corte esquemático permite seguir su recorrido hacia las tierras bajas.",
        "Rain falls on the mountains surrounding the basin. This schematic section follows its course toward low ground.",
      ),
      "drainageWorks",
    ),
    panel(
      c("2. Las laderas", "2. Slopes"),
      c(
        "El agua escurre por las laderas hacia el interior. Las flechas muestran cómo el relieve la conduce hasta las depresiones.",
        "Water runs down the slopes toward the interior. The arrows show how the terrain channels it into depressions.",
      ),
      "drainageWorks",
    ),
    panel(
      c("3. Las partes bajas", "3. Low ground"),
      c(
        "El agua se reúne en las partes bajas de una cuenca sin salida natural al mar. Siglos después, las obras de desagüe abrirían rutas artificiales al exterior.",
        "Water collects in the low ground of a basin with no natural outlet to the sea. Centuries later, drainage works would open artificial routes outward.",
      ),
      "drainageWorks",
    ),
  ],
  lakes: [
    panel(
      c("El conjunto", "The system"),
      c(
        "Zumpango y Xaltocan al norte, Texcoco en el centro, Xochimilco y Chalco al sur. Las siluetas esquemáticas sitúan los cinco lagos; sus orillas cambiaban con el nivel del agua.",
        "Zumpango and Xaltocan to the north, Texcoco in the center, Xochimilco and Chalco to the south. These schematic shapes locate the five lakes, whose shores shifted with water levels.",
      ),
      "basin",
    ),
    panel(
      c("Norte", "North"),
      c(
        "Zumpango y Xaltocan ocupaban el norte del sistema lacustre, por encima de Texcoco en esta vista del conjunto.",
        "Zumpango and Xaltocan occupied the north of the lake system, above Texcoco in this overview.",
      ),
      "basin",
    ),
    panel(
      c("Centro", "Center"),
      c(
        "Texcoco reunía aguas de mayor salinidad en la zona central. Esa diferencia condicionaba los usos del agua y las obras para separarla de las aguas dulces.",
        "Texcoco held more saline water in the central area. That difference shaped how water was used and the works built to separate it from fresh water.",
      ),
      "basin",
    ),
    panel(
      c("Sur", "South"),
      c(
        "Los lagos de Xochimilco y Chalco ocupaban el sur. Sus aguas dulces alimentaron los paisajes agrícolas que veremos en el capítulo de las chinampas.",
        "Lakes Xochimilco and Chalco lay to the south. Their fresh water sustained the agricultural landscapes of the chinampa chapter.",
      ),
      "basin",
      "chinampas",
    ),
  ],
  chinampa: [
    panel(
      c("Suelo construido", "Built soil"),
      c(
        "Sedimentos y materia orgánica forman una parcela fija, elevada sobre el agua. En ese suelo construido crecen los cultivos.",
        "Sediment and organic material form a fixed plot raised above the water. Crops grow in that constructed soil.",
      ),
      "chinampas",
      "chinampaStudy",
    ),
    panel(
      c("Canales", "Canals"),
      c(
        "Los canales rodean las parcelas, permiten el paso de canoas y aportan lodo para preparar los almácigos. Por ellos circulan también cosechas y materiales.",
        "Canals surround the plots, provide passage for canoes and supply mud for seedbeds. Harvests and materials travel along them too.",
      ),
      "chapin",
      "chinampas",
    ),
    panel(
      c("Bordes vivos", "Living edges"),
      c(
        "Los ahuejotes crecen en los bordes de las parcelas. Sus raíces ayudan a sujetar la tierra junto a los canales.",
        "Ahuejote willows grow along the edges of the plots. Their roots help hold the soil beside the canals.",
      ),
      "chinampas",
    ),
  ],
  cities: [
    panel(
      c("Cuicuilco", "Cuicuilco"),
      c(
        "Cuicuilco creció en el sur de la cuenca durante el Preclásico. Su basamento circular se alza en un territorio que conoció lagos, asentamientos y transformaciones volcánicas.",
        "Cuicuilco grew in the southern basin during the Preclassic. Its circular platform stands in terrain shaped by lakes, settlements and volcanic change.",
      ),
      "cuicuilcoMuseum",
      "cuicuilcoLandscape",
    ),
    panel(
      c("Teotihuacan", "Teotihuacan"),
      c(
        "Teotihuacan alcanzó su auge al noreste de la cuenca durante el Clásico. Sus barrios y conexiones de larga distancia formaban parte de un mundo urbano anterior al mexica.",
        "Teotihuacan flourished in the northeastern basin during the Classic. Its neighborhoods and long-distance connections belonged to an urban world preceding the Mexica.",
      ),
      "teotihuacanCity",
    ),
    panel(
      c("Tula", "Tula"),
      c(
        "Tula se encuentra al norte de la cuenca. Su apogeo en el Posclásico temprano corresponde a una etapa posterior al auge de Teotihuacan.",
        "Tula lies north of the basin. Its Early Postclassic prominence belongs to a period after Teotihuacan’s height.",
      ),
      "tula",
    ),
  ],
  alliance: [
    panel(
      c("Tenochtitlan", "Tenochtitlan"),
      c(
        "En 1428, Tenochtitlan pasó de la subordinación a Azcapotzalco a integrar la alianza que derrotó al poder tepaneca.",
        "In 1428, Tenochtitlan moved from subordination to Azcapotzalco into the alliance that defeated Tepanec power.",
      ),
      "alliance",
    ),
    panel(
      c("Texcoco", "Texcoco"),
      c(
        "Texcoco fue uno de los tres centros de la alianza que se impuso en 1428. El esquema vincula las capitales que compartieron aquel acuerdo político.",
        "Texcoco was one of the three centers of the alliance that prevailed in 1428. The diagram links the capitals joined by that political agreement.",
      ),
      "alliance",
    ),
    panel(
      c("Tlacopan", "Tlacopan"),
      c(
        "Tlacopan, hoy Tacuba, completa el triángulo de la alianza. Las líneas representan vínculos políticos entre los tres centros.",
        "Tlacopan, today Tacuba, completes the alliance’s triangle. The lines represent political connections among the three centers.",
      ),
      "alliance",
    ),
  ],
  waterworks: [
    panel(
      c("Calzadas", "Causeways"),
      c(
        "Las calzadas enlazaban la isla con Tlacopan al poniente, Tepeyac al norte e Iztapalapa hacia el sur. El esquema muestra la dirección de esas conexiones.",
        "Causeways linked the island to Tlacopan in the west, Tepeyac in the north and Iztapalapa toward the south. The diagram shows the direction of those connections.",
      ),
      "causeways",
    ),
    panel(
      c("Albarradón", "Dike"),
      c(
        "Al oriente de la ciudad, el albarradón separaba aguas de distinta salinidad. Sus compuertas permitían intervenir también en la circulación y los niveles.",
        "East of the city, the dike separated waters of different salinity. Its gates also allowed control of circulation and levels.",
      ),
      "hydraulicCity",
    ),
    panel(
      c("Acueducto", "Aqueduct"),
      c(
        "El acueducto llevaba agua dulce de Chapultepec hasta la isla. El abastecimiento requería una conducción propia entre el manantial y la ciudad.",
        "The aqueduct carried fresh water from Chapultepec to the island. Supply required a dedicated conduit between the spring and the city.",
      ),
      "hydraulicCity",
    ),
  ],
  siege: [
    panel(
      c("Por tierra", "By land"),
      c(
        "Las calzadas, por donde entraban personas y mercancías, se convirtieron en frentes de ataque y bloqueo durante el asedio.",
        "The causeways that carried people and goods into the city became fronts of attack and blockade during the siege.",
      ),
      "siege",
    ),
    panel(
      c("Por agua", "By water"),
      c(
        "Los bergantines preparados en Texcoco permitieron a la coalición operar sobre el lago y apoyar el cerco de la ciudad.",
        "Brigantines prepared at Texcoco allowed the coalition to operate on the lake and support the city’s encirclement.",
      ),
      "siege",
    ),
    panel(
      c("Abastecimiento", "Supply"),
      c(
        "El bloqueo de las rutas y la interrupción del acueducto dificultaron la llegada de alimentos y agua dulce. El dibujo esquematiza las conexiones de las que dependía la isla.",
        "Blocked routes and the severed aqueduct restricted the arrival of food and fresh water. The drawing outlines the connections on which the island depended.",
      ),
      "siege",
      "epidemic",
    ),
  ],
  drainage: [
    panel(
      c("1607", "1607"),
      c(
        "En Huehuetoca comenzaron las obras para desviar parte del agua hacia fuera de la cuenca, abriendo una salida artificial en el territorio que la encerraba.",
        "At Huehuetoca, work began to divert part of the water outside the basin, opening an artificial outlet through the surrounding terrain.",
      ),
      "firstDrain",
    ),
    panel(
      c("1629", "1629"),
      c(
        "La gran inundación de 1629 dejó la ciudad anegada durante años, mientras continuaban los problemas de las obras de desagüe.",
        "The great flood of 1629 left the city inundated for years as problems with the drainage works continued.",
      ),
      "water",
    ),
    panel(
      c("1900", "1900"),
      c(
        "La inauguración del Gran Canal del Desagüe marcó otra etapa de las obras para evacuar agua. Otros canales, como La Viga, seguían ligados a la circulación y al abastecimiento.",
        "The opening of the Grand Drainage Canal marked another stage in efforts to discharge water. Other canals, including La Viga, remained part of transport and supply.",
      ),
      "drainageWorks",
      "viga",
    ),
  ],
  growth: [
    panel(
      c("Abastecer", "Supply"),
      c(
        "La demanda de una metrópoli en expansión extendió el abastecimiento fuera de la cuenca y aumentó la presión sobre las aguas subterráneas.",
        "Demand from an expanding metropolis extended supply outside the basin and increased pressure on groundwater.",
      ),
      "rivers",
    ),
    panel(
      c("Moverse", "Move"),
      c(
        "El Metro abrió en 1969. Sus recorridos se incorporaron a los trayectos de una ciudad que seguía extendiéndose.",
        "The Metro opened in 1969. Its routes became part of daily journeys across a city that continued to expand.",
      ),
      "metroHistory",
    ),
    panel(
      c("Desaguar", "Drain"),
      c(
        "El Drenaje Profundo se inauguró en 1975 para evacuar agua de la metrópoli. Su recorrido subterráneo añadió otra red a las que sostenían la ciudad.",
        "The Deep Drainage system opened in 1975 to discharge water from the metropolis. Its underground course added another network to those sustaining the city.",
      ),
      "water",
    ),
  ],
  subsoil: [
    panel(
      c("Depósitos", "Deposits"),
      c(
        "Bajo parte de la ciudad se encuentran sedimentos lacustres compresibles. Su distribución ayuda a explicar las diferencias de hundimiento entre zonas.",
        "Compressible lake sediments lie beneath parts of the city. Their distribution helps explain differences in subsidence across areas.",
      ),
      "subsidence",
    ),
    panel(
      c("Extracción", "Extraction"),
      c(
        "El agua subterránea ocupa poros y formaciones del subsuelo. Su extracción puede favorecer la compactación de los sedimentos.",
        "Groundwater occupies pores and formations below ground. Its extraction can promote sediment compaction.",
      ),
      "subsidence",
    ),
    panel(
      c("Compactación", "Compaction"),
      c(
        "La compactación puede hacer descender el terreno de forma desigual. Este corte es conceptual; las condiciones del subsuelo varían según el lugar.",
        "Compaction can cause the ground to sink unevenly. This section is conceptual; ground conditions vary by location.",
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
            "Esquema editorial con posiciones aproximadas y procesos simplificados.",
            "Editorial diagram with approximate positions and simplified processes.",
          )}
        </small>
      </figcaption>
    </figure>
  );
}
