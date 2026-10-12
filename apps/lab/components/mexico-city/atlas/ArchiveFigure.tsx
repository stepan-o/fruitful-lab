"use client";
import { useState } from "react";
import { useLocale } from "@/lib/mexico-city/locale";
import { c } from "@/lib/mexico-city/atlas/content";
import type { Section } from "@/lib/mexico-city/atlas/history";
import references from "@/assets/sources/mexico-city/references.json";
import Artwork from "../Artwork";
const ITEMS = {
  teotihuacan: {
    id: "archive-teotihuacan",
    title: c("Teotihuacan, bajo la tierra", "Teotihuacan, beneath the ground"),
    note: c(
      "1865–1866. Léon Méhédin dibujó un edificio en proceso de excavación. Sigue la escalera y el perfil escalonado que emerge del terreno: el dibujo registra una mirada del siglo XIX sobre una arquitectura mucho más antigua.",
      "1865–1866. Léon Méhédin drew a building being excavated. Follow the stair and stepped profile emerging from the ground: this is a nineteenth-century view of much older architecture.",
    ),
    detail: c("Escalera y perfil", "Stair and profile"),
    position: "45% 72%",
    scale: 1.6,
  },
  valley: {
    id: "archive-valley-1847",
    title: c("El valle en un mapa de guerra", "The valley on a wartime map"),
    note: c(
      "1847. Ubica las aguas alrededor de México y los caminos entre ellas. Las marcas militares explican el propósito del documento; no representa la cuenca de 1519.",
      "1847. Locate waters around Mexico and the roads between them. Military markings explain the document’s purpose; it does not depict the basin of 1519.",
    ),
    detail: c("México y Texcoco", "Mexico and Texcoco"),
    position: "55% 65%",
    scale: 2.1,
  },
  viga: {
    id: "archive-viga-briquet",
    title: c(
      "La Viga, todavía un camino de agua",
      "La Viga, still a water route",
    ),
    note: c(
      "Ca. 1885–1899. Observa las canoas cargadas, las orillas arboladas y las construcciones. La foto documenta este lugar; no permite deducir cómo estaba toda la cuenca.",
      "Ca. 1885–1899. Look at loaded boats, tree-lined banks and buildings. This photograph records one place, not the condition of the entire basin.",
    ),
    detail: c("Canoas y orillas", "Boats and banks"),
    position: "55% 60%",
    scale: 1.75,
  },
  island: {
    id: "archive-tenochtitlan",
    title: c(
      "Una ciudad vista desde un impreso europeo",
      "A city seen through a European print",
    ),
    note: c(
      "1524. Publicado en Núremberg después de la conquista. Observa las conexiones entre isla y orillas. Su orientación y sus convenciones difieren de las de un mapa actual.",
      "1524. Published in Nuremberg after the conquest. Look at connections between island and shores. Its orientation and conventions differ from a modern map.",
    ),
    detail: c("Ver el detalle central", "See central detail"),
    position: "50% 50%",
    scale: 1.65,
  },
  palace: {
    id: "archive-legislativo",
    title: c("Un palacio antes del monumento", "A palace before the monument"),
    note: c(
      "1912. Guillermo Kahlo fotografió la estructura del Palacio Legislativo inconcluso. Parte de ella sería incorporada al Monumento a la Revolución.",
      "1912. Guillermo Kahlo photographed the unfinished Legislative Palace’s frame. Part would be incorporated into the Monument to the Revolution.",
    ),
    detail: c("La estructura", "The structure"),
    position: "50% 45%",
    scale: 1.7,
  },
  monument: {
    id: "photo-revolucion",
    title: c(
      "La materia permanece; el significado cambia",
      "Material remains; meaning changes",
    ),
    note: c(
      "2018. Compara el monumento con la estructura de 1912 del capítulo anterior. Fotografía contemporánea; no es una reconstrucción generada.",
      "2018. Compare the monument with the 1912 frame in the previous chapter. A modern photograph, not a generated reconstruction.",
    ),
    detail: c("La cúpula", "The dome"),
    position: "50% 35%",
    scale: 1.7,
  },
  chinampas: {
    id: "archive-chinampas",
    title: c("Entre la parcela y el canal", "Between field and canal"),
    note: c(
      "Publicada en 1912; fecha de la toma no confirmada. Mira la embarcación entre vegetación y bordes cultivados. Es un testimonio posterior al periodo prehispánico, no una prueba de que nada hubiera cambiado.",
      "Published in 1912; camera date unconfirmed. Look at the boat between vegetation and cultivated banks. It is later evidence, not proof that nothing changed after the pre-Hispanic period.",
    ),
    detail: c("Embarcación y borde", "Boat and bank"),
    position: "57% 76%",
    scale: 1.6,
  },
  mendoza: {
    id: "archive-mendoza",
    title: c(
      "La fundación, contada con signos",
      "The foundation, told through signs",
    ),
    note: c(
      "Ca. 1541, folio 2r. Mira el centro y las divisiones azules: la imagen organiza una memoria política. El manuscrito colonial representa un pasado anterior.",
      "Ca. 1541, folio 2r. Look at the center and blue divisions: the image orders a political memory. The colonial manuscript represents an earlier past.",
    ),
    detail: c("El centro de la imagen", "The image’s center"),
    position: "50% 43%",
    scale: 1.9,
  },
  epidemic: {
    id: "archive-epidemic",
    title: c(
      "Enfermedad y cuidados, en el Códice Florentino",
      "Illness and care in the Florentine Codex",
    ),
    note: c(
      "Libro XII, folio 53v: detalle de un manuscrito terminado en 1577. Representa la epidemia de 1520 desde una elaboración posterior con participación nahua.",
      "Book XII, folio 53v: detail from a manuscript completed in 1577. It represents the epidemic of 1520 through a later work with Nahua participation.",
    ),
    detail: c("Acercar el dibujo", "Look closer"),
    position: "50% 50%",
    scale: 1.4,
  },
};
export default function ArchiveFigure({
  kind,
}: {
  kind: NonNullable<Section["archive"]>;
}) {
  const { locale } = useLocale();
  const say = (es: string, en: string) => (locale === "es" ? es : en);
  const [detail, setDetail] = useState(false);
  const item = ITEMS[kind];
  const record = references.references.find((r) => r.id === item.id)!;
  return (
    <figure className={`at-archive ${detail ? "is-detail" : ""}`}>
      <div className="at-archive-label">
        {say("DOCUMENTO PARA MIRAR", "A DOCUMENT TO EXAMINE")}
        <span>
          {detail
            ? say("Detalle ampliado", "Enlarged detail")
            : say("Reproducción", "Reproduction")}
        </span>
      </div>
      <div className="at-archive-image">
        <div
          style={{
            transform: detail ? `scale(${item.scale})` : undefined,
            transformOrigin: item.position,
          }}
        >
          <Artwork
            id={item.id}
            alt={`${item.title[locale]}. ${item.note[locale]}`}
            sizes={
              detail
                ? `(max-width: 760px) ${Math.round(90 * item.scale)}vw, ${Math.round(700 * item.scale)}px`
                : "(max-width: 760px) 90vw, 700px"
            }
          />
        </div>
      </div>
      <div
        className="at-guided-controls"
        role="group"
        aria-label={say("Vistas del documento", "Document views")}
      >
        <button aria-pressed={!detail} onClick={() => setDetail(false)}>
          {say("Ver la reproducción completa", "See full reproduction")}
        </button>
        <button aria-pressed={detail} onClick={() => setDetail(true)}>
          {item.detail[locale]}
        </button>
      </div>
      <figcaption>
        <h3>{item.title[locale]}</h3>
        <p>{item.note[locale]}</p>
        <div className="at-archive-credit">
          {record.credit}
          <br />
          <a href={record.licenseUrl} target="_blank" rel="noreferrer">
            {record.license === "Public domain"
              ? say("Dominio público", "Public domain")
              : record.license === "No known copyright restrictions"
                ? say(
                    "Sin restricciones de autor conocidas",
                    "No known copyright restrictions",
                  )
                : record.license}
          </a>{" "}
          ·{" "}
          {say("Reproducción reducida a WebP", "Reproduction resized to WebP")}
          <br />
          <a href={record.source} target="_blank" rel="noreferrer">
            {say("Procedencia y derechos", "Provenance and rights")} ↗
          </a>
          {"collection" in record && (
            <>
              {" "}
              ·{" "}
              <a href={record.collection} target="_blank" rel="noreferrer">
                {say("Consultar el archivo", "Consult the archive")} ↗
              </a>
            </>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
