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
        es: "La guerra contra Azcapotzalco",
        en: "The war against Azcapotzalco",
      },
      archive: "mendoza",
      paragraphs: [
        {
          text: {
            es: "La tradición sitúa la fundación de México-Tenochtitlan en 1325, en una isla del sistema lacustre. Durante sus primeras décadas, sus gobernantes actuaron dentro del orden político dominado por los tepanecas de Azcapotzalco y participaron en las guerras de ese poder regional. La futura capital imperial comenzó, por tanto, con una posición subordinada. Su historia temprana se hizo entre obligaciones militares y relaciones con vecinos cuya fuerza condicionaba las posibilidades de la nueva ciudad.",
            en: "Tradition places the founding of Mexico-Tenochtitlan in 1325, on an island within the lake system. During its first decades, its rulers operated within the political order dominated by Azcapotzalco's Tepanecs and took part in that regional power's wars. The future imperial capital thus began in a subordinate position. Its early history unfolded through military obligations and relationships with neighbors whose strength shaped the new city's possibilities.",
          },
          sources: ["alliance", "island"],
        },
        {
          text: {
            es: "La guerra de 1428 cambió esa posición. Tenochtitlan, Texcoco y Tlacopan reunieron fuerzas contra Azcapotzalco, y la victoria abrió una etapa de expansión militar y reorganización del tributo. Esa Triple Alianza es la estructura a la que nos referimos aquí al hablar del imperio azteca. Tenochtitlan adquirió un protagonismo creciente dentro de ella, mientras las relaciones de sometimiento y las entregas exigidas a distintas poblaciones extendían el alcance de su poder.",
            en: "The war of 1428 changed that position. Tenochtitlan, Texcoco and Tlacopan joined forces against Azcapotzalco, and victory opened a period of military expansion and a reorganization of tribute. This Triple Alliance is the structure meant here by the Aztec empire. Tenochtitlan became increasingly prominent within it, while subjugation and deliveries demanded from different communities extended the reach of its power.",
          },
          sources: ["alliance"],
        },
        {
          text: {
            es: "El Códice Mendoza representa la fundación de Tenochtitlan mediante signos, nombres y divisiones azules que ordenan el espacio alrededor de un centro. Elaborado hacia 1541, ya bajo dominio colonial, conserva una narración pictórica de aquel origen. La distancia entre la fundación y la elaboración del manuscrito forma parte de su interés: en sus páginas, el pasado de la ciudad recibe una forma que permite contarlo y transmitirlo en circunstancias políticas muy distintas.",
            en: "The Codex Mendoza depicts Tenochtitlan's foundation through signs, names and blue divisions arranging space around a center. Made around 1541, already under colonial rule, it preserves a pictorial account of that origin. The distance between the foundation and the manuscript's creation is part of its interest: the city's past takes a form through which it can be told and transmitted under very different political circumstances.",
          },
          sources: ["archiveMendoza"],
        },
      ],
    },
    {
      id: "capital-network",
      title: {
        es: "El abasto de una capital",
        en: "Supplying a capital",
      },
      diagram: "alliance",
      paragraphs: [
        {
          text: {
            es: "A la capital llegaban alimentos, materias primas y objetos de otros lugares. Parte se adquiría mediante intercambios comerciales; parte se exigía como tributo a poblaciones sometidas. Esa diferencia pesaba sobre quienes los entregaban: una obligación política podía sostener el abasto de los centros dominantes con el trabajo de pueblos distantes. Los materiales conservados en el Museo del Templo Mayor permiten seguir ambas vías por las que la ciudad reunía riqueza, desde la producción hasta la llegada de los bienes a la capital.",
            en: "Food, raw materials and objects reached the capital from elsewhere. Some were acquired through trade; others were demanded as tribute from subject communities. The distinction mattered to those delivering them: a political obligation could supply the dominant centers through the labor of distant peoples. Materials preserved at the Templo Mayor Museum help trace both routes by which wealth reached the city, from the work of production to the goods’ arrival in the capital.",
          },
          sources: ["tribute"],
        },
        {
          text: {
            es: "Al norte de Tenochtitlan, Tlatelolco tenía su propio centro ceremonial y un mercado de enorme importancia. Su incorporación al dominio tenochca en 1473 llevó a la expansión de la capital un conflicto entre ciudades vecinas. La proximidad física había permitido relaciones intensas, pero también rivalidades. El lugar que después quedaría unido a Tenochtitlan en las descripciones de la gran ciudad conservaba una trayectoria propia, inseparable de la historia de su mercado y de su centro político.",
            en: "North of Tenochtitlan, Tlatelolco had its own ceremonial center and a market of enormous importance. Its incorporation under Tenochca rule in 1473 brought conflict between neighboring cities into the capital's expansion. Physical proximity had allowed intense connections as well as rivalry. The place later joined with Tenochtitlan in descriptions of the great city retained a history of its own, inseparable from its market and political center.",
          },
          sources: ["tlatelolco"],
        },
        {
          text: {
            es: "La posición insular de México-Tenochtitlan, en el sector occidental del lago, hacía del transporte una tarea cotidiana de abastecimiento. Los canales recorrían la ciudad y las calzadas enlazaban sus accesos con las riberas. Mantener esa circulación permitía que los productos llegaran a los mercados y que las personas cruzaran entre tierra firme e isla. La construcción urbana avanzó junto a la necesidad de conservar esos pasos y de asegurar el agua que sus habitantes podían beber.",
            en: "Mexico-Tenochtitlan's island position, in the western part of the lake, made transport a daily task of supply. Canals ran through the city and causeways connected its entrances with the shores. Keeping that circulation working allowed goods to reach markets and people to cross between mainland and island. Urban construction went alongside the need to maintain these passages and secure water the inhabitants could drink.",
          },
          sources: ["island", "causeways", "hydraulicCity"],
        },
      ],
    },
    {
      id: "hydraulic-capital",
      title: {
        es: "Las obras que sostenían la isla",
        en: "The works sustaining the island",
      },
      diagram: "waterworks",
      archive: "island",
      paragraphs: [
        {
          text: {
            es: "Al oriente de la ciudad, el albarradón asociado con Nezahualcóyotl dividía las aguas de la laguna de México y las de Texcoco. El dique permitía separar aguas de distinta salinidad, y sus compuertas intervenían en la circulación y los niveles. Mantener la obra significaba conservar esa capacidad de regulación: reparar las estructuras y manejar los pasos de agua formaba parte del trabajo necesario para sostener una ciudad junto al lago salino.",
            en: "East of the city, the dike associated with Nezahualcóyotl divided the Mexico lagoon from Texcoco. It separated waters of different salinity, while its gates helped control circulation and levels. Maintaining the work meant keeping that regulation possible: repairing structures and managing water passages belonged to the labor of sustaining a city beside a saline lake.",
          },
          sources: ["hydraulicCity"],
        },
        {
          text: {
            es: "El abastecimiento de agua dulce seguía otro recorrido, desde Chapultepec hasta la ciudad por medio de un acueducto. Esa conducción se sumaba a las obras que hacían habitable la isla. Las calzadas facilitaban el cruce, el albarradón regulaba las aguas y el acueducto llevaba el suministro a la población; algunas construcciones podían combinar funciones. La vida urbana dependía de que esas tareas continuaran, con sus necesidades distintas de trabajo y conservación.",
            en: "Fresh-water supply followed another route, from Chapultepec to the city through an aqueduct. That conduit joined the works making the island habitable. Causeways supported crossings, the dike regulated the waters and the aqueduct brought supplies to the population; some structures could combine functions. Urban life depended on these tasks continuing, each with its particular demands for labor and upkeep.",
          },
          sources: ["hydraulicCity"],
        },
        {
          text: {
            es: "Las calzadas orientaban la ciudad hacia lugares concretos de la ribera: Tlacopan al poniente, Tepeyac al norte e Iztapalapa hacia el sur. En el mapa publicado en Núremberg en 1524, las conexiones de la isla ocupan un lugar destacado dentro de una imagen realizada con convenciones europeas después de la conquista. La estampa conserva la fuerza visual de una ciudad rodeada de agua y vinculada por pasos largos a los asentamientos de sus orillas.",
            en: "Causeways oriented the city toward specific places on the lakeshore: Tlacopan to the west, Tepeyac to the north and Iztapalapa toward the south. In the map published in Nuremberg in 1524, the island's connections feature prominently in an image made through European conventions after the conquest. The print preserves the visual force of a city surrounded by water and linked by long crossings to settlements along its shores.",
          },
          sources: ["causeways", "archive1524"],
        },
        {
          text: {
            es: "Esas conexiones iban a adquirir otro significado durante el sitio de 1521. Un paso que llevaba personas y productos podía bloquearse; una conducción de agua dulce, romperse. La misma red que permitía abastecer a una gran población concentraba puntos de los que dependía su supervivencia. La guerra llevaría los ataques hasta esas obras y convertiría el acceso a la isla en una lucha por mantener abiertas las rutas del alimento y del agua.",
            en: "Those connections would acquire another meaning during the siege of 1521. A passage carrying people and produce could be blocked; a fresh-water conduit could be broken. The network supplying a large population concentrated places on which its survival depended. War would bring attacks to those works and turn access to the island into a struggle to keep the routes of food and water open.",
          },
          sources: ["hydraulicCity", "siege"],
        },
      ],
    },
  ],
  quiz: [
    {
      prompt: {
        es: "¿Qué ciudades formaron la Triple Alianza tras la derrota de Azcapotzalco?",
        en: "Which cities formed the Triple Alliance after Azcapotzalco’s defeat?",
      },
      options: [
        {
          es: "Tenochtitlan, Teotihuacan y Cuicuilco",
          en: "Tenochtitlan, Teotihuacan and Cuicuilco",
        },
        {
          es: "Tenochtitlan, Texcoco y Tlacopan",
          en: "Tenochtitlan, Texcoco and Tlacopan",
        },
        {
          es: "Azcapotzalco, Chalco y Tula",
          en: "Azcapotzalco, Chalco and Tula",
        },
      ],
      correct: 1,
      explanation: {
        es: "Tenochtitlan, Texcoco y Tlacopan integraron la alianza que se impuso en 1428. Desde esas relaciones de poder se extendieron las conquistas y las exigencias de tributo.",
        en: "Tenochtitlan, Texcoco and Tlacopan formed the alliance that prevailed in 1428. Those political relationships underpinned further conquests and tribute demands.",
      },
      sources: ["alliance"],
    },
    {
      prompt: {
        es: "¿Qué obra llevaba agua dulce desde Chapultepec a Tenochtitlan?",
        en: "Which work carried fresh water from Chapultepec to Tenochtitlan?",
      },
      options: [
        {
          es: "El acueducto",
          en: "The aqueduct",
        },
        {
          es: "El albarradón oriental",
          en: "The eastern dike",
        },
        {
          es: "El desagüe de Huehuetoca",
          en: "The Huehuetoca drainage works",
        },
      ],
      correct: 0,
      explanation: {
        es: "El acueducto conducía el agua de Chapultepec hacia la isla. El albarradón cumplía otra tarea: separar aguas y ayudar a regular sus niveles.",
        en: "The aqueduct carried Chapultepec’s water toward the island. The dike had a different task: separating waters and helping regulate their levels.",
      },
      sources: ["hydraulicCity"],
    },
    {
      prompt: {
        es: "Cuando un pueblo entregaba bienes como tributo, ¿qué relación había detrás?",
        en: "When a community delivered goods as tribute, what relationship lay behind the delivery?",
      },
      options: [
        {
          es: "Una obligación política impuesta dentro de una relación de dominio",
          en: "A political obligation within a relationship of domination",
        },
        {
          es: "Una venta negociada libremente en el mercado",
          en: "A freely negotiated market sale",
        },
        {
          es: "Un préstamo que la capital debía devolver con los mismos bienes",
          en: "A loan the capital had to repay with the same goods",
        },
      ],
      correct: 0,
      explanation: {
        es: "El tributo era una exigencia política que sostenía a los centros dominantes. El intercambio comercial también abastecía la ciudad, pero se organizaba mediante otras relaciones entre quienes entregaban y recibían bienes.",
        en: "Tribute was a political demand supporting the dominant centers. Trade also supplied the city, through different relationships between those giving and receiving goods.",
      },
      sources: ["tribute"],
    },
  ],
};
export default chapter;
