import type { Copy } from "./content";
export type Passage = { text: Copy; sources: string[] };
export type Section = {
  id: string;
  title: Copy;
  paragraphs: Passage[];
  diagram?:
    | "basin"
    | "lakes"
    | "chinampa"
    | "cities"
    | "alliance"
    | "waterworks"
    | "siege"
    | "drainage"
    | "growth"
    | "subsoil";
  archive?:
    | "valley"
    | "viga"
    | "island"
    | "palace"
    | "monument"
    | "chinampas"
    | "mendoza"
    | "epidemic"
    | "teotihuacan";
};
export type ChapterQuestion = {
  prompt: Copy;
  options: Copy[];
  correct: number;
  explanation: Copy;
  sources: string[];
};
export type Chapter = {
  id: string;
  title: Copy;
  subtitle: Copy;
  period: Copy;
  art: string;
  sections: Section[];
  quiz: ChapterQuestion[];
};

// Each factual passage, figure, and answer resolves to the visible source registry.
export const CHAPTERS: Omit<Chapter, "sections" | "quiz">[] = [
  {
    id: "basin",
    title: {
      es: "Un mundo entre lagos",
      en: "A world between lakes",
    },
    subtitle: {
      es: "Montañas, cinco lagos y muchas maneras de vivir junto al agua.",
      en: "Mountains, five lakes and many ways of living with water.",
    },
    period: {
      es: "El territorio antes de la ciudad",
      en: "The landscape before the city",
    },
    art: "archive-valley-1847",
  },
  {
    id: "chinampas",
    title: {
      es: "Construir tierra, cuidar agua",
      en: "Building land, tending water",
    },
    subtitle: {
      es: "El paisaje agrícola que sostiene mucho más que una cosecha.",
      en: "An agricultural landscape sustaining much more than a harvest.",
    },
    period: {
      es: "El sistema chinampero, pasado y presente",
      en: "The chinampa system, past and present",
    },
    art: "archive-chinampas",
  },
  {
    id: "peoples",
    title: {
      es: "Antes de los mexicas",
      en: "Before the Mexica",
    },
    subtitle: {
      es: "Cuicuilco, Teotihuacan y un valle que nunca estuvo vacío.",
      en: "Cuicuilco, Teotihuacan and a valley that was never empty.",
    },
    period: {
      es: "Del Preclásico al siglo XIV",
      en: "From the Preclassic to the fourteenth century",
    },
    art: "archive-teotihuacan",
  },
  {
    id: "empire",
    title: {
      es: "La isla que se volvió capital",
      en: "The island that became a capital",
    },
    subtitle: {
      es: "Alianzas, tributo y la construcción de México-Tenochtitlan.",
      en: "Alliances, tribute and the making of Mexico-Tenochtitlan.",
    },
    period: {
      es: "Siglos XIV–XVI · hasta 1519",
      en: "Fourteenth–sixteenth centuries · to 1519",
    },
    art: "archive-mendoza",
  },
  {
    id: "conquest",
    title: {
      es: "La conquista y la ciudad inundada",
      en: "Conquest and the flooded city",
    },
    subtitle: {
      es: "Guerra, traducción y el comienzo de una larga lucha por sacar el agua.",
      en: "War, translation and the beginning of a long struggle to send water away.",
    },
    period: {
      es: "1519–1629",
      en: "1519–1629",
    },
    art: "archive-epidemic",
  },
  {
    id: "drainage",
    title: {
      es: "Canales, mapas y promesas de tierra firme",
      en: "Canals, maps and promises of dry land",
    },
    subtitle: {
      es: "La capital cambia de régimen; el problema del agua atraviesa los siglos.",
      en: "The capital changes political order; water carries across the centuries.",
    },
    period: {
      es: "1630–1910",
      en: "1630–1910",
    },
    art: "archive-viga-briquet",
  },
  {
    id: "growth",
    title: {
      es: "La capital se desborda",
      en: "The capital spreads out",
    },
    subtitle: {
      es: "De la ciudad monumental a una metrópoli de barrios, obras y trayectos.",
      en: "From a monumental capital to a metropolis of neighborhoods, works and journeys.",
    },
    period: {
      es: "1910–1985",
      en: "1910–1985",
    },
    art: "archive-legislativo",
  },
  {
    id: "living-basin",
    title: {
      es: "La cuenca sigue viva",
      en: "The basin is still alive",
    },
    subtitle: {
      es: "Lo que permanece, lo que cambia y las preguntas que llevarás a la calle.",
      en: "What remains, what changes and the questions to take into the city.",
    },
    period: {
      es: "De 1985 al presente",
      en: "From 1985 to the present",
    },
    art: "photo-revolucion",
  },
];

export function loadChapter(id: string): Promise<Chapter> {
  switch (id) {
    case "basin":
      return import("./history/basin").then((m) => m.default);
    case "chinampas":
      return import("./history/chinampas").then((m) => m.default);
    case "peoples":
      return import("./history/peoples").then((m) => m.default);
    case "empire":
      return import("./history/empire").then((m) => m.default);
    case "conquest":
      return import("./history/conquest").then((m) => m.default);
    case "drainage":
      return import("./history/drainage").then((m) => m.default);
    case "growth":
      return import("./history/growth").then((m) => m.default);
    case "living-basin":
      return import("./history/living-basin").then((m) => m.default);
    default:
      return import("./history/basin").then((m) => m.default);
  }
}
