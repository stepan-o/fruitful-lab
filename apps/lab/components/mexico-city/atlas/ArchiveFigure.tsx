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
      "1865–1866. La escalera y el perfil escalonado de un edificio aparecen entre la tierra removida. Léon Méhédin dibujó la excavación, dejando constancia de cómo se acercaba el siglo XIX a la arquitectura de Teotihuacan.",
      "1865–1866. A stairway and stepped building profile emerge from the excavated earth. Léon Méhédin’s drawing records the excavation and a nineteenth-century encounter with Teotihuacan’s architecture.",
    ),
    detail: c("Escalera y perfil", "Stair and profile"),
    position: "45% 72%",
    scale: 1.6,
  },
  valley: {
    id: "archive-valley-1847",
    title: c("El valle en un mapa de guerra", "The valley on a wartime map"),
    note: c(
      "Los caminos se abren paso entre las aguas del valle en este mapa de 1847, preparado durante la invasión estadounidense. Las posiciones militares sitúan el paisaje en las operaciones de aquella guerra.",
      "Roads thread their way between the valley’s waters on this 1847 map, prepared during the United States invasion. Military positions place the landscape within the operations of that war.",
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
      "Ca. 1885–1899. Canoas cargadas circulan entre orillas arboladas y construcciones: La Viga aún forma parte de los caminos por los que llegan personas y mercancías a la capital.",
      "Ca. 1885–1899. Loaded canoes move between tree-lined banks and buildings, with La Viga still among the routes bringing people and goods into the capital.",
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
      "Las conexiones entre la isla y las orillas dan forma a esta imagen de Tenochtitlan, publicada en Núremberg en 1524, después de la conquista. El impreso emplea convenciones europeas para representar la ciudad; su orientación requiere una lectura distinta de la de un mapa actual.",
      "Connections between the island and the shores shape this image of Tenochtitlan, published in Nuremberg in 1524, after the conquest. The print uses European conventions to represent the city, with an orientation that differs from a modern map.",
    ),
    detail: c("Ver el detalle central", "See central detail"),
    position: "50% 50%",
    scale: 1.65,
  },
  palace: {
    id: "archive-legislativo",
    title: c("Un palacio antes del monumento", "A palace before the monument"),
    note: c(
      "Guillermo Kahlo fotografió en 1912 la estructura del Palacio Legislativo inconcluso. Parte de ese armazón encontraría un destino imprevisto en el Monumento a la Revolución.",
      "Guillermo Kahlo photographed the unfinished Legislative Palace’s frame in 1912. Part of that structure would find an unexpected use in the Monument to the Revolution.",
    ),
    detail: c("La estructura", "The structure"),
    position: "50% 45%",
    scale: 1.7,
  },
  monument: {
    id: "photo-revolucion",
    title: c("Del palacio al monumento", "From palace to monument"),
    note: c(
      "En esta fotografía de 2018, la cúpula del Monumento a la Revolución ocupa el lugar de la estructura que Kahlo fotografió en 1912. Entre ambas imágenes cambió el proyecto, y con él la historia que se buscaba conmemorar.",
      "In this 2018 photograph, the dome of the Monument to the Revolution stands where Kahlo photographed the frame in 1912. Between the two images, the project changed, along with the history it was intended to commemorate.",
    ),
    detail: c("La cúpula", "The dome"),
    position: "50% 35%",
    scale: 1.7,
  },
  chinampas: {
    id: "archive-chinampas",
    title: c("Entre la parcela y el canal", "Between field and canal"),
    note: c(
      "Una embarcación pasa entre la vegetación y los bordes cultivados. La imagen apareció publicada en 1912, aunque la fecha de la toma sigue sin confirmarse; documenta un paisaje chinampero ya separado por siglos de sus antecedentes prehispánicos.",
      "A boat passes between vegetation and cultivated banks. The image was published in 1912, though the camera date remains unconfirmed; it records a chinampa landscape already separated by centuries from its pre-Hispanic predecessors.",
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
      "El centro y las divisiones azules organizan el relato de la fundación de Tenochtitlan. Este folio 2r del Códice Mendoza, elaborado hacia 1541, recoge la memoria de la ciudad en un manuscrito del periodo colonial.",
      "The center and blue divisions organize the account of Tenochtitlan’s foundation. Folio 2r of the Codex Mendoza, made around 1541, records the city’s memory in a colonial-period manuscript.",
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
      "La epidemia de 1520 quedó representada en este detalle del libro XII, folio 53v, del Códice Florentino. El manuscrito se terminó en 1577 con participación nahua, varias décadas después de la enfermedad que describe.",
      "The epidemic of 1520 is represented in this detail from Book XII, folio 53v, of the Florentine Codex. The manuscript was completed in 1577 with Nahua participation, several decades after the illness it describes.",
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
        {say("ARCHIVO", "ARCHIVE")}
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
