"use client";
import { useState } from "react";
import { useLocale } from "@/lib/mexico-city/locale";
import Artwork from "./Artwork";

const REFERENCES = {
  map: [
    {
      id: "archive-tenochtitlan",
      date: "1524",
      title: {
        es: "Tenochtitlan y el golfo de México",
        en: "Tenochtitlan and the Gulf of Mexico",
      },
      credit: "Friedrich Peypus · Nuremberg · Newberry Library",
      source:
        "https://commons.wikimedia.org/wiki/File:Map_of_Tenochtitlan_and_Gulf_of_Mexico,_1524.jpg",
      license: "Public domain",
      licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
      note: {
        es: "Mapa publicado en Europa tras la conquista. Su orientación y convenciones no coinciden con un mapa actual; no es un plano topográfico exacto de la ciudad prehispánica.",
        en: "A map published in Europe after the conquest. Its orientation and conventions differ from a modern map; it is not an exact survey of the pre-Hispanic city.",
      },
    },
  ],
  revolucion: [
    {
      id: "archive-legislativo",
      date: "1912",
      title: {
        es: "Construcción del Palacio Legislativo",
        en: "Construction of the Legislative Palace",
      },
      credit: "Guillermo Kahlo · Wikimedia Commons",
      source:
        "https://commons.wikimedia.org/wiki/File:Construcci%C3%B3n_del_Palacio_Legislativo.jpg",
      license: "Public domain",
      licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/",
      note: {
        es: "La estructura del proyecto inconcluso. Fotografía de archivo, sin reconstrucción generada.",
        en: "The structure of the unfinished project. An archival photograph, not a generated reconstruction.",
      },
    },
    {
      id: "photo-revolucion",
      date: "2018",
      title: {
        es: "Monumento a la Revolución",
        en: "Monumento a la Revolución",
      },
      credit: "CarlosGalvanMex · Wikimedia Commons",
      source:
        "https://commons.wikimedia.org/wiki/File:MONUMENTO_A_LA_REVOLUCION_CON_CIELO_AZUL.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      note: {
        es: "Fotografía moderna de referencia. Versión reducida y convertida a WebP; encuadre conservado.",
        en: "Modern reference photograph. Resized and converted to WebP; original framing retained.",
      },
    },
  ],
};
export default function PhotoReferences({
  kind,
}: {
  kind: keyof typeof REFERENCES;
}) {
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  return (
    <details
      className="ov-photo-reference"
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary>
        {locale === "es"
          ? kind === "map"
            ? "Abrir el mapa de archivo · 1524"
            : "Ver las fotografías · 1912 / 2018"
          : kind === "map"
            ? "Open the archive map · 1524"
            : "View the photographs · 1912 / 2018"}
      </summary>
      {open
        ? REFERENCES[kind].map((r) => (
            <figure key={r.id}>
              <Artwork
                id={r.id}
                alt={r.title[locale]}
                sizes="(max-width: 700px) 85vw, 430px"
              />
              <figcaption>
                <strong>
                  {r.title[locale]} · {r.date}
                </strong>
                <br />
                {r.credit} ·{" "}
                <a href={r.licenseUrl} target="_blank" rel="noreferrer">
                  {r.license === "Public domain" && locale === "es"
                    ? "Dominio público"
                    : r.license}
                </a>
                <br />
                {r.note[locale]}{" "}
                <a href={r.source} target="_blank" rel="noreferrer">
                  {locale === "es" ? "Fuente y ficha ↗" : "Source record ↗"}
                </a>
              </figcaption>
            </figure>
          ))
        : null}
    </details>
  );
}
