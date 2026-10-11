import { copy } from "./learning";
export const WORDS = [
  {
    word: "atl",
    meaning: copy("agua", "water"),
    hint: copy(
      "Piensa en los lagos que dieron forma a la cuenca.",
      "Think of the lakes that shaped the basin.",
    ),
    source:
      "https://nahuatl.historicas.unam.mx/index.php/ecn/article/view/78098",
  },
  {
    word: "tepetl",
    meaning: copy("cerro o montaña", "hill or mountain"),
    hint: copy(
      "Las elevaciones también guardan memoria en los nombres.",
      "High ground also leaves traces in place names.",
    ),
    source: "https://xochipilliuniversomexica.inah.gob.mx/glosario.html",
  },
  {
    word: "xochitl",
    meaning: copy("flor", "flower"),
    hint: copy(
      "Esta raíz aparece en Xochimilco.",
      "This root appears in Xochimilco.",
    ),
    source: "https://gdn.iib.unam.mx/diccionario/xochitl",
  },
  {
    word: "milli",
    meaning: copy("campo cultivado", "cultivated field"),
    hint: copy(
      "La milpa y los cultivos te dan una pista.",
      "Cultivation and the milpa give you a clue.",
    ),
    source: "https://gdn.iib.unam.mx/diccionario/milli/26330",
  },
  {
    word: "ehecatl",
    meaning: copy("viento", "wind"),
    hint: copy(
      "Recuerda al dios del adoratorio de Pino Suárez.",
      "Remember the deity of the Pino Suárez shrine.",
    ),
    source: "https://gdn.iib.unam.mx/diccionario/ehecatl/278403",
  },
] as const;
export const PLACE_PUZZLES = [
  {
    id: "nahuatl-xochimilco" as const,
    name: "Xochimilco",
    pieces: ["xochi", "mil", "co"],
    choices: ["co", "atl", "mil", "xochi"],
    meanings: [
      copy("flor", "flower"),
      copy("campo cultivado", "cultivated field"),
      copy("en", "in"),
    ],
    explanation: copy(
      "Xochitl + milli + co: «en el campo de flores». Los nombres no se forman pegando siempre palabras enteras: aquí ves las formas que toman al combinarse.",
      "Xochitl + milli + co: “in the field of flowers.” Names are not always made by joining whole words: these are the forms they take in this compound.",
    ),
    source:
      "https://www.turismo.cdmx.gob.mx/storage/app/media/Estadisticas/Diagnosticos%20Turisticos%20Delegacionales/Delegacion%20Xochimilco%202015.pdf",
  },
  {
    id: "nahuatl-xochitepec" as const,
    name: "Xochitepec",
    pieces: ["xochi", "tepe", "c"],
    choices: ["tepe", "mil", "c", "xochi"],
    meanings: [copy("flor", "flower"), copy("cerro", "hill"), copy("en", "at")],
    explanation: copy(
      "Xochitl + tepetl, con la terminación locativa: «en el cerro de las flores». Xochitepec es un pueblo de Xochimilco. Este juego muestra una composición concreta, no una regla para inventar cualquier topónimo.",
      "Xochitl + tepetl, with a locative ending: “at the hill of flowers.” Xochitepec is a community in Xochimilco. This puzzle shows one specific compound, not a rule for inventing place names.",
    ),
    source: "https://www.xochimilco.cdmx.gob.mx/pueblos-y-barrios/",
  },
];
