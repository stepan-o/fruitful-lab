import type { Chapter } from "../history";
const chapter: Chapter = {
  id: "living-basin",
  title: {
    es: "La cuenca sigue viva",
    en: "The basin is still alive",
  },
  period: {
    es: "De 1985 al presente",
    en: "From 1985 to the present",
  },
  art: "photo-revolucion",
  subtitle: {
    es: "Lo que permanece, lo que cambia y las preguntas que llevarás a la calle.",
    en: "What remains, what changes and the questions to take into the city.",
  },
  sections: [
    {
      id: "under-streets",
      title: {
        es: "Tres capas debajo de una frase",
        en: "Three layers beneath one phrase",
      },
      diagram: "subsoil",
      paragraphs: [
        {
          text: {
            es: "Bajo parte de la ciudad hay sedimentos lacustres compresibles. La extracción de agua subterránea contribuye a la compactación y al hundimiento. No es correcto imaginar toda la metrópoli bajando a la misma velocidad, ni dibujar un lago líquido justo debajo de cada calle. La geología y la extracción ayudan a explicar diferencias entre zonas y daños en infraestructura.",
            en: "Compressible lake sediments lie beneath parts of the city. Groundwater extraction contributes to compaction and subsidence. It is misleading to imagine the whole metropolis sinking at one rate, or a liquid lake directly beneath every street. Geology and extraction help explain differences between areas and damage to infrastructure.",
          },
          sources: ["subsidence"],
        },
        {
          text: {
            es: "La frase antes todo esto era un lago puede abrir una conversación, pero no terminarla. Hay que distinguir antiguos depósitos, agua subterránea y cuerpos de agua actuales. También hay suelos volcánicos y elevaciones que no se entienden con la misma imagen de fondo lacustre. El corte del diagrama es conceptual: separa procesos y materiales; no ofrece un perfil geológico de tu calle ni predice riesgos de un edificio.",
            en: "The phrase this all used to be a lake can begin a conversation but should not end it. Distinguish old deposits, groundwater and present water bodies. Volcanic ground and high areas also resist a single lake-floor image. The diagram’s section is conceptual: it separates processes and materials, not a geological profile of your street or a prediction about a building.",
          },
          sources: ["subsidence", "earthquake"],
        },
        {
          text: {
            es: "La urbanización también modifica el clima local. La investigación divulgada por la UNAM relaciona cambios de uso del suelo y crecimiento urbano con islas de calor; no describe simplemente un único punto caliente en el centro. Para comprender las diferencias actuales, la memoria del agua necesita conversar con vegetación, pavimentos y formas de ocupar el territorio. Ninguna capa histórica explica por sí sola todas las experiencias de la ciudad.",
            en: "Urbanization also changes local climate. Research shared by UNAM links land-use change and growth to heat islands rather than one hot spot downtown. Understanding current differences requires connecting water’s history with vegetation, paving and settlement patterns. No historical layer alone explains every experience of the city.",
          },
          sources: ["urbanClimate"],
        },
      ],
    },
    {
      id: "surface-water",
      title: {
        es: "Conservar agua es conservar relaciones",
        en: "Preserving water means preserving relationships",
      },
      paragraphs: [
        {
          text: {
            es: "También persisten paisajes de agua en la superficie. Las chinampas de Xochimilco continúan vinculadas a productores y comunidades. Hacia el oriente, el área protegida Lago de Texcoco, decretada en 2022, conserva humedales y funciones de regulación hídrica en el Estado de México. “Desapareció el lago” es una frase demasiado cómoda para un territorio que todavía necesita espacio para el agua.",
            en: "Water landscapes also remain at the surface. Xochimilco’s chinampas are still connected to growers and communities. To the east, the Lago de Texcoco protected area, decreed in 2022, preserves wetlands and water-regulation functions in the State of Mexico. “The lake disappeared” is too convenient a phrase for a territory that still needs room for water.",
          },
          sources: ["chinampas", "texcocoProtected"],
        },
        {
          text: {
            es: "El reconocimiento de las chinampas como patrimonio agrícola por la FAO en 2017 no las convirtió en un paisaje del pasado. Señala el valor de un sistema vivo. Los proyectos de restauración vinculados a productores y científicos, como Chinampa Refugio, permiten pensar la conservación con quienes trabajan allí. No se trata de escoger entre historia y presente: la continuidad de una práctica depende de las condiciones actuales que la hacen posible.",
            en: "FAO’s recognition of chinampas as agricultural heritage in 2017 did not turn them into a landscape of the past. It recognizes a living system. Restoration involving growers and scientists, such as Chinampa Refugio, allows conservation to be considered with the people working there. History and the present are not alternatives: continuity depends on present conditions making a practice possible.",
          },
          sources: ["chinampas", "chinampaRefuge"],
        },
        {
          text: {
            es: "En Texcoco, el decreto de protección de 2022 y su programa de manejo obligan a ampliar el mapa más allá de la CDMX. El humedal se encuentra en el Estado de México y sus funciones ecológicas no se detienen en una frontera administrativa. El recorrido vuelve así al punto inicial del libro: la cuenca es una unidad útil para pensar el agua, aunque las decisiones se repartan entre territorios y autoridades diferentes.",
            en: "At Texcoco, the 2022 protection decree and management program require looking beyond CDMX. The wetland lies in the State of Mexico, and its ecological functions do not stop at an administrative border. Our journey returns to the book’s starting point: the basin is useful for thinking about water even when decisions are divided among territories and authorities.",
          },
          sources: ["texcocoProtected"],
        },
      ],
    },
    {
      id: "read-the-city",
      title: {
        es: "Salir con preguntas mejores",
        en: "Going out with better questions",
      },
      archive: "monument",
      paragraphs: [
        {
          text: {
            es: "Compara la fotografía actual del Monumento a la Revolución con la estructura de 1912 del capítulo anterior. Es el mismo argumento en dos documentos: las ciudades conservan materia y cambian significados. Pero evita trasladar esa certeza a cualquier parecido. Para conectar una calle con una calzada antigua, o una depresión con un canal, necesitamos evidencia específica. Una semejanza visual puede ser una pista; no es todavía una conclusión.",
            en: "Compare the modern Monument to the Revolution photograph with the 1912 frame in the previous chapter. Two documents support one argument: cities preserve material and change meanings. But do not transfer that certainty to every resemblance. Connecting a street with an old causeway or a depression with a canal requires specific evidence. Visual similarity may be a clue, not yet a conclusion.",
          },
          sources: ["palace", "archiveMonument"],
        },
        {
          text: {
            es: "Ésta será tu primera tarea al llegar: busca una huella y formula una pregunta. En La Viga, relaciona un nombre con la fotografía; en Xochimilco, distingue una parcela de un canal; en el centro, pregunta por el abastecimiento y el desagüe antes de atribuir cualquier desnivel al antiguo lago. Una observación útil separa lo que ves de lo que todavía necesitas comprobar.",
            en: "Here is your first task when you arrive: find a trace and ask a question. At La Viga, connect a name with the photograph; in Xochimilco, distinguish a plot from a canal; in the center, ask about supply and drainage before attributing every uneven surface to the old lake. A useful observation separates what you see from what you still need to verify.",
          },
          sources: ["viga", "chinampas", "subsidence"],
        },
        {
          text: {
            es: "Las fuentes también son parte del paseo. Una fotografía tiene fecha y encuadre; un códice reúne convenciones y memorias; una investigación arqueológica puede revisar una cronología. En este libro los enlaces acompañan la información para que puedas volver al documento y distinguir una observación de una interpretación. No hay un mapa final que contenga toda la ciudad. Hay formas cada vez mejores de preguntar cómo llegó a ser lo que vemos.",
            en: "Sources belong to the journey too. A photograph has a date and frame; a codex brings conventions and memories; archaeological research may revise a chronology. Links accompany information throughout this book so you can return to documents and distinguish observation from interpretation. No final map contains the whole city. There are increasingly useful ways to ask how it became what we see.",
          },
          sources: ["archiveViga", "archiveMendoza", "cuicuilco"],
        },
        {
          text: {
            es: "Para tu primera exploración, elige una sola relación: una parcela y su canal, un monumento y su fotografía, una montaña y las tierras bajas. Registra lo que observas, conserva la fuente que te llevó allí y anota lo que todavía no sabes. Ésta es una propuesta de actividad del juego, no una obligación para visitar la ciudad ni una invitación a entrar en predios sin permiso. La curiosidad funciona mejor cuando deja espacio a quienes viven en el lugar.",
            en: "For your first exploration, choose one relationship: a field and its canal, a monument and its photograph, a mountain and the low ground. Record what you observe, keep the source that brought you there and note what remains unknown. This is a suggested game activity, not a requirement for visiting or an invitation to enter property without permission. Curiosity works best when it makes room for the people living there.",
          },
          sources: ["chinampaRefuge"],
        },
      ],
    },
  ],
  quiz: [
    {
      prompt: {
        es: "¿Cuál es la mejor conclusión para explorar la ciudad?",
        en: "Which is the best conclusion for exploring the city?",
      },
      options: [
        {
          es: "Todo desnivel demuestra que debajo hay un lago",
          en: "Every uneven surface proves there is a lake underneath",
        },
        {
          es: "El agua dejó huellas diferentes que hay que contrastar con evidencia",
          en: "Water left different traces that need to be checked against evidence",
        },
        {
          es: "El agua dejó de importar cuando llegaron las avenidas",
          en: "Water stopped mattering when avenues arrived",
        },
      ],
      correct: 1,
      explanation: {
        es: "Conecta paisaje, historia y fuentes. Una pista invita a investigar; no sustituye la evidencia.",
        en: "Connect landscape, history and sources. A clue invites investigation; it does not replace evidence.",
      },
      sources: ["subsidence", "texcocoProtected"],
    },
    {
      prompt: {
        es: "¿Por qué mirar Texcoco más allá de la CDMX?",
        en: "Why look beyond CDMX at Texcoco?",
      },
      options: [
        {
          es: "Porque la cuenca y sus procesos cruzan límites administrativos",
          en: "Because the basin and its processes cross administrative boundaries",
        },
        {
          es: "Porque todo el Estado de México es un lago",
          en: "Because the entire State of Mexico is a lake",
        },
        {
          es: "Porque las alcaldías no tienen historia",
          en: "Because boroughs have no history",
        },
      ],
      correct: 0,
      explanation: {
        es: "El área protegida está en el Estado de México; el agua y los hábitats requieren una mirada territorial más amplia.",
        en: "The protected area lies in the State of Mexico; water and habitats require a broader territorial view.",
      },
      sources: ["texcocoProtected"],
    },
    {
      prompt: {
        es: "¿Qué hace más útil una observación en la calle?",
        en: "What makes a street observation more useful?",
      },
      options: [
        {
          es: "Afirmar una causa sin comprobarla",
          en: "Claiming a cause without checking",
        },
        {
          es: "Separar lo observado, la fuente y lo que falta investigar",
          en: "Separating observation, source and what remains to investigate",
        },
        {
          es: "Usar cualquier imagen antigua como prueba de cualquier época",
          en: "Using any old image as proof for any period",
        },
      ],
      correct: 1,
      explanation: {
        es: "La fecha, el lugar y el propósito del documento ayudan a poner límites a una interpretación.",
        en: "A document’s date, place and purpose help define the limits of an interpretation.",
      },
      sources: ["archive1847", "cuicuilco"],
    },
  ],
};
export default chapter;
