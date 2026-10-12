import type { Chapter } from "../history";
const chapter: Chapter = {
  id: "empire",
  title: {
    es: "La isla que se volvió capital",
    en: "The island that became a capital",
  },
  period: {
    es: "Siglos XIV–XVI · hasta 1519",
    en: "Fourteenth–sixteenth centuries · to 1519",
  },
  art: "archive-mendoza",
  subtitle: {
    es: "Alianzas, tributo y la construcción de México-Tenochtitlan.",
    en: "Alliances, tribute and the making of Mexico-Tenochtitlan.",
  },
  sections: [
    {
      id: "island-power",
      title: {
        es: "De subordinados a aliados victoriosos",
        en: "From subordinates to victorious allies",
      },
      archive: "mendoza",
      paragraphs: [
        {
          text: {
            es: "La fecha tradicional de fundación de México-Tenochtitlan es 1325. Conviene distinguir esa referencia de la idea de un imperio que nace terminado. Los primeros gobernantes mexicas actuaron dentro de un orden dominado por los tepanecas de Azcapotzalco; participaron en sus guerras antes de desafiar ese poder. La ubicación insular no explica por sí sola el ascenso. También importaron decisiones, conflictos y alianzas que pudieron tener otros desenlaces.",
            en: "The traditional founding date of Mexico-Tenochtitlan is 1325. Distinguish that reference from the idea of an empire born complete. Early Mexica rulers operated within an order dominated by Azcapotzalco’s Tepanecs, participating in their wars before challenging their power. Island geography alone does not explain the rise. Decisions, conflicts and alliances mattered, and could have ended differently.",
          },
          sources: ["alliance"],
        },
        {
          text: {
            es: "La guerra de 1428 cambió esa relación. Tenochtitlan, Texcoco y Tlacopan formaron la alianza que permitió derrotar a Azcapotzalco y reorganizar el poder regional. Cuando hablamos de imperio azteca, aquí seguimos principalmente esa estructura militar y tributaria, con un protagonismo creciente de Tenochtitlan. No imaginemos un país moderno de fronteras uniformes: someter poblaciones y recibir tributos no equivale a administrar cada lugar de la misma manera.",
            en: "The war of 1428 changed that relationship. Tenochtitlan, Texcoco and Tlacopan formed the alliance that defeated Azcapotzalco and reorganized regional power. When we speak of the Aztec empire here, we chiefly follow that military and tributary structure, with Tenochtitlan increasingly prominent. Do not imagine a modern country with uniform borders: subjugating communities and receiving tribute did not mean administering every place identically.",
          },
          sources: ["alliance"],
        },
        {
          text: {
            es: "El Códice Mendoza muestra cómo podía narrarse una fundación mediante signos, nombres y una organización pictórica del espacio. Fue elaborado ya en época colonial: es evidencia de una memoria indígena representada bajo nuevas condiciones, no una instantánea tomada en 1325. Mira las divisiones azules y el centro de la imagen; después compara ese modo de ordenar la ciudad con el diagrama de alianzas. Una imagen puede expresar legitimidad además de ubicación.",
            en: "The Codex Mendoza shows how a foundation could be narrated through signs, names and a pictorial organization of space. Made in the colonial period, it records Indigenous memory under new conditions, not a snapshot taken in 1325. Notice the blue divisions and the image’s center, then compare that ordering with the alliance diagram. An image can express legitimacy as well as location.",
          },
          sources: ["archiveMendoza"],
        },
      ],
    },
    {
      id: "capital-network",
      title: {
        es: "Una capital se alimenta de relaciones",
        en: "A capital feeds on relationships",
      },
      diagram: "alliance",
      paragraphs: [
        {
          text: {
            es: "El tributo y el comercio hicieron llegar alimentos, materias primas, objetos y trabajo a la capital. Eran mecanismos distintos: una mercancía intercambiada en un mercado no cuenta la misma historia que una entrega exigida a un pueblo sometido. El Museo del Templo Mayor invita a leer ambos para entender la riqueza mexica. Cuando un objeto procede de lejos, la pregunta no termina en qué tan bonito es: también importa qué relación política o económica hizo posible su llegada.",
            en: "Tribute and trade brought food, raw materials, objects and labor to the capital. These were different mechanisms: a market exchange tells a different story from a delivery demanded of a subject community. The Templo Mayor Museum uses both to explain Mexica wealth. When an object comes from far away, ask not only how beautiful it is but what political or economic relationship brought it there.",
          },
          sources: ["tribute"],
        },
        {
          text: {
            es: "Tlatelolco, al norte de Tenochtitlan, tenía su propio centro ceremonial y un mercado de enorme importancia. Su incorporación al dominio tenochca en 1473 recuerda que la gran capital también se construyó mediante conflictos cercanos. No borremos esa historia diciendo que siempre fue un simple barrio. La imagen de una ciudad unida, ordenada y próspera resulta incompleta si no permite ver rivalidades, desigualdad y el trabajo de quienes la abastecían.",
            en: "Tlatelolco, north of Tenochtitlan, had its own ceremonial center and a major market. Its incorporation under Tenochca rule in 1473 reminds us that the great capital was also made through nearby conflicts. Calling it always a mere neighborhood erases that history. An image of a united, orderly, prosperous city is incomplete unless it also reveals rivalries, inequality and the labor of its suppliers.",
          },
          sources: ["tlatelolco"],
        },
        {
          text: {
            es: "México-Tenochtitlan se desarrolló sobre una isla del sector occidental del lago. Canales y calzadas organizaban sus conexiones con las riberas. La ubicación no eliminaba las dificultades: había que construir, abastecerse y mantener esos pasos. El agua era parte de la infraestructura cotidiana, no sólo el paisaje que se veía desde un templo.",
            en: "Mexico-Tenochtitlan developed on an island in the western part of the lake. Canals and causeways organized connections with the shores. Its location did not remove practical difficulties: people had to build, obtain supplies and maintain those passages. Water formed part of everyday infrastructure, not just scenery seen from a temple.",
          },
          sources: ["island", "causeways"],
        },
      ],
    },
    {
      id: "hydraulic-capital",
      title: {
        es: "Cruzar, regular, abastecer",
        en: "Crossing, regulating, supplying",
      },
      diagram: "waterworks",
      archive: "island",
      paragraphs: [
        {
          text: {
            es: "El albarradón asociado con Nezahualcóyotl dividía el agua al oriente de la ciudad. Era un dique con compuertas: ayudaba a regular niveles y a separar las aguas de la laguna de México de las de Texcoco. No hacía desaparecer el lago. La solución consistía en intervenir sus relaciones, una tarea que exigía conservación y decisiones colectivas.",
            en: "The dike associated with Nezahualcóyotl divided the water east of the city. Equipped with gates, it helped regulate levels and separate the waters of the Mexico lagoon from those of Texcoco. It did not make the lake disappear. The solution was to manage relationships within it, requiring maintenance and collective decisions.",
          },
          sources: ["hydraulicCity"],
        },
        {
          text: {
            es: "Abastecer a la población era otra tarea. El acueducto llevaba agua de Chapultepec hacia la ciudad. Una calzada podía conectar lugares; un dique, regular el agua; un acueducto, conducirla para el abastecimiento. Algunas obras combinaban funciones, pero no conviene confundirlas. En el esquema, enciende cada una y observa qué problema intenta resolver.",
            en: "Supplying residents was a different task. The aqueduct brought water from Chapultepec to the city. A causeway could connect places; a dike could regulate water; an aqueduct could carry it for supply. Some works combined functions, but the distinctions matter. Switch on each in the diagram and notice which problem it addresses.",
          },
          sources: ["hydraulicCity"],
        },
        {
          text: {
            es: "Las direcciones siguen siendo buenas pistas: Tlacopan al poniente, Tepeyac al norte, Iztapalapa hacia el sur. No son tres avenidas modernas dibujadas sobre una foto antigua. Son relaciones espaciales que ayudan a entender por qué ciertos corredores importaban. El dibujo publicado en Núremberg en 1524 convierte esas conexiones en una imagen poderosa; sus convenciones europeas y su fecha posterior a la conquista también forman parte del documento.",
            en: "The directions remain useful clues: Tlacopan westward, Tepeyac northward, Iztapalapa to the south. These are not three modern avenues drawn on an old photograph. They are spatial relationships that explain why certain corridors mattered. The drawing published in Nuremberg in 1524 turns such connections into a powerful image; its European conventions and post-conquest date are part of the document too.",
          },
          sources: ["causeways", "archive1524"],
        },
        {
          text: {
            es: "Ese conjunto de obras no es prueba de una ciudad invulnerable. Mantener conexiones y abastecimiento era precisamente lo que permitía vivir allí. En una guerra, las mismas relaciones podían convertirse en puntos débiles. Antes de pasar al siguiente capítulo, sigue mentalmente un camino de entrada, una vía de agua dulce y un trayecto en canoa. Comprender cómo funcionaban permitirá entender qué significó interrumpirlos durante el sitio.",
            en: "These works do not prove the city was invulnerable. Maintaining connections and supply was precisely what made life there possible. In war, the same relationships could become weaknesses. Before the next chapter, trace an access route, a fresh-water supply and a canoe journey. Understanding their functions will explain the consequences of interrupting them during the siege.",
          },
          sources: ["hydraulicCity", "siege"],
        },
      ],
    },
  ],
  quiz: [
    {
      prompt: {
        es: "¿Qué tres centros formaron la Triple Alianza?",
        en: "Which three centers formed the Triple Alliance?",
      },
      options: [
        {
          es: "Cuicuilco, Tula y Teotihuacan",
          en: "Cuicuilco, Tula and Teotihuacan",
        },
        {
          es: "Tenochtitlan, Texcoco y Tlacopan",
          en: "Tenochtitlan, Texcoco and Tlacopan",
        },
        {
          es: "Chalco, Toluca y Veracruz",
          en: "Chalco, Toluca and Veracruz",
        },
      ],
      correct: 1,
      explanation: {
        es: "La alianza cambió el orden regional tras la guerra contra Azcapotzalco.",
        en: "The alliance changed the regional order after the war against Azcapotzalco.",
      },
      sources: ["alliance"],
    },
    {
      prompt: {
        es: "¿Qué obra explica mejor el abastecimiento desde Chapultepec?",
        en: "Which work best explains supply from Chapultepec?",
      },
      options: [
        {
          es: "El acueducto",
          en: "The aqueduct",
        },
        {
          es: "Cualquier calzada, por sí sola",
          en: "Any causeway on its own",
        },
        {
          es: "Una división entre alcaldías",
          en: "A borough boundary",
        },
      ],
      correct: 0,
      explanation: {
        es: "El acueducto conduce agua. No equivale a un camino ni a una frontera administrativa.",
        en: "An aqueduct conveys water. It is not the same as a road or an administrative boundary.",
      },
      sources: ["hydraulicCity"],
    },
    {
      prompt: {
        es: "¿Por qué no son lo mismo tributo y comercio?",
        en: "Why are tribute and trade different?",
      },
      options: [
        {
          es: "Uno puede ser una entrega exigida por dominación; el otro, un intercambio",
          en: "One can be a delivery demanded through domination; the other, an exchange",
        },
        {
          es: "Ambos son nombres de lagos",
          en: "Both are lake names",
        },
        {
          es: "Sólo existieron después de 1521",
          en: "They existed only after 1521",
        },
      ],
      correct: 0,
      explanation: {
        es: "Distinguirlos permite preguntar cómo llegaban los recursos a la capital y quién sostenía su riqueza.",
        en: "Distinguishing them helps explain how resources reached the capital and who sustained its wealth.",
      },
      sources: ["tribute"],
    },
  ],
};
export default chapter;
