import { BOROUGHS, VOCABULARY, c, type Copy } from "./content";
export type Track = "layout" | "history" | "zones" | "nahuatl";
export const TRACKS: { id: Track; title: Copy; detail: Copy; color: string }[] =
  [
    {
      id: "layout",
      title: c("Arma tu mapa mental", "Build your mental map"),
      detail: c(
        "Direcciones, escalas y conexiones",
        "Directions, scales and connections",
      ),
      color: "#467b94",
    },
    {
      id: "history",
      title: c("Sigue las huellas", "Follow the traces"),
      detail: c("Causas, cambios y evidencias", "Causes, changes and evidence"),
      color: "#b65b42",
    },
    {
      id: "zones",
      title: c("Reconoce el territorio", "Recognize the territory"),
      detail: c(
        "16 alcaldías, sin etiquetas en el mapa",
        "16 boroughs, without map labels",
      ),
      color: "#628267",
    },
    {
      id: "nahuatl",
      title: c("Palabras que abren lugares", "Words that open up places"),
      detail: c(
        "Agua, tierra, cerros y nombres",
        "Water, earth, hills and names",
      ),
      color: "#946493",
    },
  ];
export type Question = {
  id: string;
  prompt: Copy;
  options: { id: string; label: Copy }[];
  correct: string;
  explanation: Copy;
  sources: string[];
  map?: boolean;
};
const q = (
  id: string,
  prompt: Copy,
  labels: Copy[],
  answer: number,
  explanation: Copy,
  sources: string[],
): Question => ({
  id,
  prompt,
  options: labels.map((label, i) => ({ id: String(i), label })),
  correct: String(answer),
  explanation,
  sources,
});
const mapQ = (
  id: string,
  prompt: Copy,
  correct: string,
  explanation: Copy,
): Question => ({
  id,
  prompt,
  correct,
  explanation,
  map: true,
  options: BOROUGHS.map((b) => ({ id: b.id, label: c(b.name, b.name) })),
  sources: ["zones"],
});
export const QUESTIONS: Record<Track, Question[]> = {
  layout: [
    mapQ(
      "layout-center",
      c(
        "Ubica Cuauhtémoc: contiene el Zócalo y queda al norte de Benito Juárez.",
        "Locate Cuauhtémoc: it contains the Zócalo and lies north of Benito Juárez.",
      ),
      "09015",
      c(
        "El Centro es un ancla histórica. No es el centro geométrico de toda CDMX.",
        "Centro is a historical anchor, not the geometric center of all Mexico City.",
      ),
    ),
    mapQ(
      "layout-south",
      c(
        "Busca Milpa Alta, en el extremo sur de la ciudad.",
        "Find Milpa Alta at the far south of the city.",
      ),
      "09009",
      c(
        "La ciudad continúa más allá de la red del Metro: pueblos, campos y bosque también son CDMX.",
        "The city continues beyond Metro: towns, fields and forest are Mexico City too.",
      ),
    ),
    mapQ(
      "layout-west",
      c(
        "Chapultepec está al poniente del centro. ¿Qué alcaldía lo contiene?",
        "Chapultepec is west of the center. Which borough contains it?",
      ),
      "09016",
      c(
        "Miguel Hidalgo. Tacuba y Tacubaya ayudan a recordar sus conexiones hacia el norte y el sur.",
        "Miguel Hidalgo. Tacuba and Tacubaya help you remember connections north and south.",
      ),
    ),
    mapQ(
      "layout-water",
      c(
        "Al sur de Coyoacán y al oeste de Tláhuac: busca Xochimilco.",
        "South of Coyoacán and west of Tláhuac: find Xochimilco.",
      ),
      "09013",
      c(
        "Relaciona su posición con canales, chinampas y pueblos.",
        "Connect its position with canals, chinampas and towns.",
      ),
    ),
    q(
      "layout-scale",
      c(
        "¿Qué par compara piezas de la misma escala administrativa?",
        "Which pair compares places at the same administrative scale?",
      ),
      [
        c("Roma y CDMX", "Roma and Mexico City"),
        c("Cuauhtémoc y Coyoacán", "Cuauhtémoc and Coyoacán"),
        c("Chapultepec y la cuenca", "Chapultepec and the basin"),
      ],
      1,
      c(
        "Ambas son alcaldías. Colonias, alcaldías y cuenca responden a escalas distintas.",
        "Both are boroughs. Neighborhoods, boroughs and the basin belong to different scales.",
      ),
      ["zones"],
    ),
    q(
      "layout-causeway",
      c(
        "Sales de la isla hacia Tlacopan. ¿Qué dirección sigues?",
        "Leaving the island toward Tlacopan, which direction do you follow?",
      ),
      [c("Norte", "North"), c("Sur", "South"), c("Poniente", "West")],
      2,
      c(
        "Tlacopan al poniente, Tepeyac al norte, Iztapalapa al sur: recuerda relaciones, no sólo nombres.",
        "Tlacopan west, Tepeyac north, Iztapalapa south: remember relationships, not just names.",
      ),
      ["causeways"],
    ),
    q(
      "layout-light",
      c(
        "Llegas a Tasqueña y vas a Xochimilco. ¿Qué conexión estás aprendiendo?",
        "You reach Tasqueña and are heading to Xochimilco. Which connection are you learning?",
      ),
      [
        c("Metro 2 → Tren Ligero", "Metro 2 → light rail"),
        c("Metro 2 → Cablebús 1", "Metro 2 → Cablebús 1"),
        c(
          "Metro directo a todos los embarcaderos",
          "Direct Metro to every boat landing",
        ),
      ],
      0,
      c(
        "El Tren Ligero continúa al sur; todavía debes ubicar tu destino y el tramo final.",
        "Light rail continues south; you still need to locate your destination and the final leg.",
      ),
      ["light"],
    ),
    q(
      "layout-airport",
      c(
        "Tu vuelo sale de T2 del AICM. ¿Qué no debes asumir?",
        "Your flight leaves from AICM T2. What should you not assume?",
      ),
      [
        c("Que MEX identifica el AICM", "That MEX identifies AICM"),
        c(
          "Que Terminal Aérea te deja directamente en T2",
          "That Terminal Aérea takes you directly to T2",
        ),
        c(
          "Que debes revisar el acceso a tu terminal",
          "That you should check access to your terminal",
        ),
      ],
      1,
      c(
        "Terminal Aérea sirve a T1. Verifica la conexión específica a T2 con el aeropuerto.",
        "Terminal Aérea serves T1. Check the airport’s specific connection to T2.",
      ),
      ["aicm"],
    ),
  ],
  history: [
    q(
      "history-cuicuilco",
      c(
        "¿Qué lugar rompe la idea de que la historia de la ciudad empieza con los mexicas?",
        "Which place challenges the idea that the city’s history begins with the Mexica?",
      ),
      [
        c("Monumento a la Revolución", "Monumento a la Revolución"),
        c("Cuicuilco", "Cuicuilco"),
        c("AICM", "AICM"),
      ],
      1,
      c(
        "Cuicuilco tuvo arquitectura monumental mucho antes de Tenochtitlan.",
        "Cuicuilco had monumental architecture long before Tenochtitlan.",
      ),
      ["cuicuilcoMuseum"],
    ),
    q(
      "history-water",
      c(
        "¿Qué explica mejor la transformación de los lagos?",
        "What best explains the transformation of the lakes?",
      ),
      [
        c(
          "Una sola obra vació toda la cuenca de golpe",
          "One project emptied the whole basin at once",
        ),
        c(
          "Nunca hubo poblaciones en las orillas",
          "There were never settlements on the shores",
        ),
        c(
          "Siglos de obras, crecimiento y cambios en el agua",
          "Centuries of engineering, growth and changes in water",
        ),
      ],
      2,
      c(
        "La transformación fue prolongada. El agua sigue siendo parte de la historia urbana.",
        "The transformation was prolonged. Water remains part of urban history.",
      ),
      ["water"],
    ),
    q(
      "history-uppsala",
      c(
        "Un mapa de hacia 1550, ¿muestra una Tenochtitlan intacta anterior a la conquista?",
        "Does a map from around 1550 show an untouched Tenochtitlan before the conquest?",
      ),
      [
        c(
          "No: ya pertenece al mundo colonial temprano",
          "No: it belongs to the early colonial world",
        ),
        c(
          "Sí: todos los mapas antiguos muestran lo mismo",
          "Yes: all old maps show the same thing",
        ),
        c("Sí: es una fotografía aérea", "Yes: it is an aerial photograph"),
      ],
      0,
      c(
        "Fecha, autor y propósito importan. El mapa de Uppsala es posterior a la conquista.",
        "Date, author and purpose matter. The Uppsala map follows the conquest.",
      ),
      ["uppsala"],
    ),
    q(
      "history-viga",
      c(
        "¿Por qué La Viga ayuda a entender la posición de Iztacalco?",
        "Why does La Viga help explain Iztacalco’s position?",
      ),
      [
        c(
          "Porque era una terminal aérea",
          "Because it was an airport terminal",
        ),
        c(
          "Porque conectaba el sur lacustre con mercados de la ciudad",
          "Because it connected southern lake country with city markets",
        ),
        c(
          "Porque marcaba todas las fronteras actuales",
          "Because it marked all current boundaries",
        ),
      ],
      1,
      c(
        "El canal era una conexión de personas y mercancías. La ubicación se entiende como parte de una red.",
        "The canal connected people and goods. The location makes sense as part of a network.",
      ),
      ["viga"],
    ),
    q(
      "history-conde",
      c(
        "Un plano se levantó en 1793 y se publicó en 1807. ¿Qué fecha usarías para describir su levantamiento?",
        "A plan was surveyed in 1793 and published in 1807. Which date describes its survey?",
      ),
      [c("1807", "1807"), c("2026", "2026"), c("1793", "1793")],
      2,
      c(
        "El levantamiento y la publicación pueden tener fechas distintas. Así ocurre con el plano de García Conde.",
        "Survey and publication can have different dates, as with García Conde’s plan.",
      ),
      ["conde"],
    ),
    q(
      "history-aerial",
      c(
        "¿Qué permite comprobar una fotografía aérea fechada?",
        "What can a dated aerial photograph establish?",
      ),
      [
        c(
          "Lo visible en un lugar y momento concretos",
          "What is visible at a particular place and time",
        ),
        c("Toda la historia de una comunidad", "A community’s entire history"),
        c(
          "Una costa exacta de cualquier siglo",
          "An exact shoreline from any century",
        ),
      ],
      0,
      c(
        "Una imagen es evidencia situada. Para explicar cambios necesitas comparar fuentes.",
        "An image is evidence from a particular setting. Explaining change requires comparing sources.",
      ),
      ["aerial"],
    ),
    q(
      "history-language",
      c(
        "¿Cómo presenta el atlas el náhuatl de Milpa Alta?",
        "How does the atlas present Nahuatl in Milpa Alta?",
      ),
      [
        c(
          "Como una lengua que sólo existe en museos",
          "As a language existing only in museums",
        ),
        c(
          "Como parte de la vida contemporánea",
          "As part of contemporary life",
        ),
        c(
          "Como una única forma idéntica en todas partes",
          "As a single identical form everywhere",
        ),
      ],
      1,
      c(
        "Hay hablantes y variedades vivas. Nuestro vocabulario histórico es una introducción limitada.",
        "There are living speakers and varieties. Our historical vocabulary is a limited introduction.",
      ),
      ["living"],
    ),
    q(
      "history-boundaries",
      c(
        "¿Qué representan las 16 formas del mapa de alcaldías?",
        "What do the 16 shapes on the borough map represent?",
      ),
      [
        c("Reinos prehispánicos exactos", "Exact pre-Hispanic kingdoms"),
        c("Islas del lago original", "Islands in the original lake"),
        c(
          "Divisiones administrativas actuales",
          "Current administrative divisions",
        ),
      ],
      2,
      c(
        "Los límites actuales ayudan a orientarnos hoy. No deben proyectarse como fronteras antiguas.",
        "Current boundaries help us navigate today. They must not be projected backward as ancient borders.",
      ),
      ["zones"],
    ),
  ],
  zones: BOROUGHS.map((b, i) => ({
    ...mapQ(
      `zone-${b.id}`,
      c(
        `Pista ${i + 1}: ${b.hook.es} Busca la alcaldía de ${b.anchors.map((a) => a.name).join(", ")}.`,
        `Clue ${i + 1}: ${b.hook.en} Find the borough containing ${b.anchors.map((a) => a.name).join(", ")}.`,
      ),
      b.id,
      b.memory,
    ),
    sources: [b.source, ...(b.extra ? [b.extra] : [])],
  })),
  nahuatl: VOCABULARY.map((word, i) => {
    const candidates = [
      word,
      VOCABULARY[(i + 2) % VOCABULARY.length],
      VOCABULARY[(i + 4) % VOCABULARY.length],
    ];
    const answer = i % 3;
    [candidates[0], candidates[answer]] = [candidates[answer], candidates[0]];
    return q(
      `word-${word.word}`,
      c(
        `¿Qué significa «${word.word}» en las fuentes de este atlas?`,
        `What does “${word.word}” mean in this atlas’s sources?`,
      ),
      candidates.map((w) => w.meaning),
      answer,
      c(
        `${word.word}: ${word.meaning.es}. ${word.hint.es}`,
        `${word.word}: ${word.meaning.en}. ${word.hint.en}`,
      ),
      [word.source],
    );
  }),
};
/** A correct answer may show one reward per question in this practice run. No account or storage side effects. */
export function rewardFor(
  question: Question,
  answer: string,
  alreadyRewarded: boolean,
) {
  return answer === question.correct && !alreadyRewarded ? 25 : 0;
}
