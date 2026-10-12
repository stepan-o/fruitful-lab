import { c, type Copy } from "./content";
export type Scene = {
  title: Copy;
  text: Copy;
  notice: Copy;
  map: number;
  sources: string[];
};
export type Chapter = {
  id: string;
  title: Copy;
  subtitle: Copy;
  art: string;
  track: "layout" | "history" | "zones";
  scenes: Scene[];
};
export const CHAPTERS: Chapter[] = [
  {
    id: "basin",
    title: c("Antes del asfalto", "Before the asphalt"),
    subtitle: c(
      "Primero, aprende a ver la cuenca.",
      "First, learn to see the basin.",
    ),
    art: "tenochtitlan-island",
    track: "layout",
    scenes: [
      {
        title: c(
          "El mapa empieza en las montañas",
          "The map starts in the mountains",
        ),
        text: c(
          "Imagina que quitas las avenidas. Queda una cuenca rodeada de elevaciones: el agua se reunía en sus partes bajas. Texcoco era una pieza de un sistema lacustre, no el nombre de toda la Ciudad de México.",
          "Imagine removing the avenues. A basin ringed by high ground remains: water gathered in its low areas. Texcoco was part of a lake system, not a name for all of Mexico City.",
        ),
        notice: c(
          "Mueve el control para comparar agua y límites actuales. La forma del agua es esquemática.",
          "Move the control to compare water and current boundaries. The water shapes are schematic.",
        ),
        map: 0,
        sources: ["basin"],
      },
      {
        title: c("No era una sola orilla", "There was more than one shore"),
        text: c(
          "Zumpango y Xaltocan al norte; Texcoco hacia el centro; Xochimilco y Chalco al sur. Las orillas variaban. Los lagos del sur y sus cultivos ayudan a entender por qué el agua sigue siendo una clave para reconocer esa parte de la ciudad.",
          "Zumpango and Xaltocan to the north; Texcoco toward the center; Xochimilco and Chalco to the south. Shores shifted. Southern lakes and farming help explain why water remains a clue to recognizing that part of the city.",
        ),
        notice: c(
          "Sigue los nombres de norte a sur. No memorices las siluetas: no son costas medidas.",
          "Follow the names north to south. Do not memorize the silhouettes: they are not surveyed shores.",
        ),
        map: 0,
        sources: ["basin", "island"],
      },
      {
        title: c(
          "Una ciudad anterior a los mexicas",
          "A city before the Mexica",
        ),
        text: c(
          "Cuicuilco ya tenía arquitectura monumental mucho antes de Tenochtitlan. La lava del Xitle transformó el paisaje del sur. La arqueología sigue discutiendo su cronología: no hace falta inventar una sola fecha para reconocer una historia mucho más larga.",
          "Cuicuilco had monumental architecture long before Tenochtitlan. Xitle’s lava transformed the southern landscape. Archaeologists continue to debate its chronology: we need not invent a single date to recognize a much longer history.",
        ),
        notice: c(
          "Busca Tlalpan en el mapa de alcaldías y abre Cuicuilco para seguir esta pista.",
          "Find Tlalpan on the borough map and open Cuicuilco to follow this clue.",
        ),
        map: 2,
        sources: ["cuicuilco", "cuicuilcoMuseum"],
      },
    ],
  },
  {
    id: "peoples",
    title: c("Una cuenca, muchos pueblos", "One basin, many peoples"),
    subtitle: c(
      "La isla era un nodo de una red.",
      "The island was a node in a network.",
    ),
    art: "ehecatl-past",
    track: "history",
    scenes: [
      {
        title: c(
          "No empieces toda la historia en el Zócalo",
          "Not every story starts at the Zócalo",
        ),
        text: c(
          "Azcapotzalco, Culhuacán, Coyoacán y los pueblos del sur tenían sus propias trayectorias. Tenochtitlan y Tlatelolco fueron grandes centros mexicas dentro de un territorio habitado, conectado y disputado.",
          "Azcapotzalco, Culhuacán, Coyoacán and the southern towns had histories of their own. Tenochtitlan and Tlatelolco were major Mexica centers within a populated, connected and contested territory.",
        ),
        notice: c(
          "Usa el Centro como referencia, no como el origen de todo.",
          "Use Centro as a reference, not as the origin of everything.",
        ),
        map: 1,
        sources: ["island", "zones"],
      },
      {
        title: c(
          "Tres direcciones para no perderte",
          "Three directions to get your bearings",
        ),
        text: c(
          "Desde la isla, las calzadas enlazaban Tlacopan al poniente, Tepeyac al norte e Iztapalapa al sur. Las canoas completaban esa red. Aprende las direcciones antes de intentar recordar todos los nombres.",
          "Causeways linked the island with Tlacopan to the west, Tepeyac to the north and Iztapalapa to the south. Canoes completed the network. Learn the directions before trying to remember every name.",
        ),
        notice: c(
          "Toca una conexión. La línea explica la relación, no el trazo exacto de la calzada.",
          "Tap a connection. The line explains the relationship, not the exact course of the causeway.",
        ),
        map: 1,
        sources: ["causeways"],
      },
      {
        title: c("Un mapa también tiene autor", "A map also has an author"),
        text: c(
          "El mapa publicado en Núremberg en 1524 llegó a lectores europeos después de la conquista. El de Uppsala, hacia 1550, muestra ya un mundo colonial temprano. Ninguno es una fotografía neutral de 1500.",
          "The map published in Nuremberg in 1524 reached European readers after the conquest. The Uppsala map, around 1550, already shows an early colonial world. Neither is a neutral photograph of 1500.",
        ),
        notice: c(
          "Abre el documento de archivo. Compara qué resalta y qué simplifica.",
          "Open the archival document. Compare what it emphasizes and simplifies.",
        ),
        map: 1,
        sources: ["uppsala"],
      },
    ],
  },
  {
    id: "water",
    title: c("¿A dónde se fue el agua?", "Where did the water go?"),
    subtitle: c(
      "Desaguar cambió la cuenca; no borró el agua.",
      "Drainage changed the basin; it did not erase water.",
    ),
    art: "atlas-viga",
    track: "history",
    scenes: [
      {
        title: c(
          "Una transformación de siglos",
          "A transformation over centuries",
        ),
        text: c(
          "Después de la conquista, la ciudad se reconstruyó y creció en el mismo paisaje. Las inundaciones impulsaron obras de desagüe. No hubo un día en que se vació un lago y apareció la ciudad terminada.",
          "After the conquest, the city was rebuilt and grew within the same landscape. Flooding drove drainage works. There was no single day when a lake was emptied and a finished city appeared.",
        ),
        notice: c(
          "En la máquina del tiempo, compara etapas; no son fotogramas de un proceso medido.",
          "In the time machine, compare stages; they are not frames of a measured process.",
        ),
        map: 0,
        sources: ["drainage"],
      },
      {
        title: c("La Viga era camino de agua", "La Viga was a water road"),
        text: c(
          "Por La Viga circulaban personas y mercancías entre el sur lacustre y los mercados de la ciudad. Iztacalco y Santa Anita formaban parte de ese recorrido. Una calle puede guardar el nombre de una conexión que ya no ves.",
          "La Viga carried people and goods between the southern lake country and city markets. Iztacalco and Santa Anita were part of that journey. A street can preserve the name of a connection you can no longer see.",
        ),
        notice: c(
          "Después busca Iztacalco: es una pieza pequeña con una historia de grandes conexiones.",
          "Then find Iztacalco: a small piece with a history of major connections.",
        ),
        map: 2,
        sources: ["viga"],
      },
      {
        title: c(
          "El agua sigue dando forma a la ciudad",
          "Water still shapes the city",
        ),
        text: c(
          "Extraer agua del subsuelo contribuye al hundimiento. Desagüe y abastecimiento son problemas distintos que se cruzan. El antiguo paisaje lacustre ayuda a formular mejores preguntas sobre la ciudad de hoy.",
          "Groundwater extraction contributes to subsidence. Drainage and water supply are different, intersecting problems. The former lake landscape helps us ask better questions about today’s city.",
        ),
        notice: c(
          "Pregunta qué hay debajo del pavimento, no sólo qué edificio tienes enfrente.",
          "Ask what lies beneath the pavement, not only which building stands in front of you.",
        ),
        map: 0,
        sources: ["subsidence"],
      },
    ],
  },
  {
    id: "growth",
    title: c(
      "Cuando los pueblos se volvieron ciudad",
      "When towns became city",
    ),
    subtitle: c(
      "Muchos centros quedaron dentro de la metrópoli.",
      "Many centers became part of the metropolis.",
    ),
    art: "revolucion-past",
    track: "history",
    scenes: [
      {
        title: c(
          "La ciudad no creció como una mancha perfecta",
          "The city did not grow as a perfect circle",
        ),
        text: c(
          "Compara el plano levantado por García Conde en 1793, publicado en 1807, con las alcaldías actuales. Cambian las escalas: un plano de calles del núcleo urbano no equivale a un mapa de toda la cuenca.",
          "Compare García Conde’s survey of 1793, published in 1807, with today’s boroughs. The scales differ: a street plan of the urban core is not a map of the entire basin.",
        ),
        notice: c(
          "Abre la fuente del plano y busca su fecha de levantamiento, además de la publicación.",
          "Open the plan’s source and look for its survey date as well as its publication date.",
        ),
        map: 2,
        sources: ["conde"],
      },
      {
        title: c(
          "Las fotos desde arriba cambian la pregunta",
          "Aerial photographs change the question",
        ),
        text: c(
          "El acervo de Fundación ICA reúne fotografía aérea de 1932 a 1994. Sirve para investigar cómo caminos, industria y vivienda conectaron zonas antes separadas. Cada vuelo documenta un momento, no toda la historia.",
          "Fundación ICA’s collection includes aerial photography from 1932 to 1994. It helps investigate how roads, industry and housing connected previously separate areas. Each flight records one moment, not the entire history.",
        ),
        notice: c(
          "Aquí enlazamos el archivo; no reproducimos fotografías sin comprobar sus derechos.",
          "We link the archive here; photographs are not reproduced without checking their rights.",
        ),
        map: 2,
        sources: ["aerial"],
      },
      {
        title: c(
          "Un edificio también puede cambiar de futuro",
          "A building can change its future",
        ),
        text: c(
          "El Monumento a la Revolución conserva parte del proyecto de un palacio que quedó inconcluso. Mira las fotos de 1912 y 2018: la comparación permite leer una transformación concreta sin imaginar lo que falta.",
          "The Monumento a la Revolución preserves part of an unfinished palace project. Look at the 1912 and 2018 photographs: the comparison reveals a specific transformation without inventing missing evidence.",
        ),
        notice: c(
          "Busca la estructura central en ambas fotos. Después abre la historia de Tabacalera.",
          "Find the central structure in both photographs. Then open the Tabacalera story.",
        ),
        map: 2,
        sources: [
          "https://www.mexicocity.cdmx.gob.mx/venues/monument-to-the-revolution/",
        ],
      },
    ],
  },
  {
    id: "pieces",
    title: c("Encuentra las piezas", "Find the pieces"),
    subtitle: c(
      "Posición + paisaje + una historia.",
      "Position + landscape + a story.",
    ),
    art: "atlas-milpa",
    track: "zones",
    scenes: [
      {
        title: c(
          "Tres escalas, tres preguntas",
          "Three scales, three questions",
        ),
        text: c(
          "La cuenca rebasa la Ciudad de México. Las 16 alcaldías son divisiones administrativas actuales. Dentro de ellas hay colonias, barrios y pueblos. Roma es una colonia; Cuauhtémoc, una alcaldía. No son piezas del mismo tamaño.",
          "The basin extends beyond Mexico City. Its 16 boroughs are current administrative divisions. Inside them are neighborhoods and towns. Roma is a neighborhood; Cuauhtémoc is a borough. They are not pieces at the same scale.",
        ),
        notice: c(
          "El mapa ilustrado usa límites actuales, incluso cuando cuenta historias antiguas.",
          "The illustrated map uses current boundaries, even when telling older stories.",
        ),
        map: 2,
        sources: ["zones"],
      },
      {
        title: c(
          "Ponle anclas a tu mapa mental",
          "Give your mental map some anchors",
        ),
        text: c(
          "Chapultepec al poniente del centro; Tepeyac al norte; Iztapalapa al oriente; Xochimilco hacia el sur lacustre. Son referencias para empezar, no etiquetas que agotan la vida de cada zona.",
          "Chapultepec west of the center; Tepeyac north; Iztapalapa east; Xochimilco toward the southern lake country. These are starting references, not labels that capture all of each area’s life.",
        ),
        notice: c(
          "Toca las alcaldías y después intenta reconocerlas sin nombres en el reto.",
          "Tap the boroughs, then try recognizing them without names in the challenge.",
        ),
        map: 2,
        sources: ["zones"],
      },
      {
        title: c("No dejes fuera el sur", "Do not leave out the south"),
        text: c(
          "Tlalpan, Xochimilco, Tláhuac y Milpa Alta no son sólo el final del mapa. Montañas, agricultura, pueblos y lenguas vivas ayudan a entender por qué CDMX no equivale únicamente a edificios y avenidas.",
          "Tlalpan, Xochimilco, Tláhuac and Milpa Alta are more than the edge of the map. Mountains, farming, towns and living languages explain why Mexico City is not simply buildings and avenues.",
        ),
        notice: c(
          "Reconoce Milpa Alta por su posición y su vida contemporánea, no como un museo del pasado.",
          "Recognize Milpa Alta by its position and contemporary life, not as a museum of the past.",
        ),
        map: 2,
        sources: ["milpa", "living"],
      },
    ],
  },
  {
    id: "move",
    title: c("Muévete con sentido", "Move with understanding"),
    subtitle: c(
      "Aprende conexiones, no sólo estaciones.",
      "Learn connections, not just stations.",
    ),
    art: "ehecatl",
    track: "layout",
    scenes: [
      {
        title: c(
          "Geografía y diagrama se complementan",
          "Geography and diagrams work together",
        ),
        text: c(
          "El plano del Metro simplifica curvas; este mapa conserva la posición de las líneas. Sigue la 3 de norte a sur o la 8 hacia Iztapalapa. Un transbordo importa más para viajar que la distancia entre dos puntos en el diagrama.",
          "Metro diagrams simplify bends; this map preserves line positions. Follow line 3 north to south, or line 8 toward Iztapalapa. An interchange matters more for a journey than the distance between dots on a diagram.",
        ),
        notice: c(
          "Elige una línea. Esta capa enseña conexiones; no informa cierres en tiempo real.",
          "Choose a line. This layer teaches connections; it does not report live closures.",
        ),
        map: 3,
        sources: ["metro"],
      },
      {
        title: c("Por aire y hacia el sur", "By air and toward the south"),
        text: c(
          "Cablebús complementa al Metro en las laderas: C1 en el norte, C2 en Iztapalapa, C3 por Chapultepec. Desde Tasqueña, el Tren Ligero sigue a Xochimilco. Cambiar de sistema también es parte del viaje.",
          "Cablebús complements Metro across hillsides: C1 in the north, C2 in Iztapalapa, C3 through Chapultepec. From Tasqueña, light rail continues to Xochimilco. Changing systems is part of the journey.",
        ),
        notice: c(
          "Compara cada corredor con su conexión al Metro.",
          "Compare each corridor with its Metro connection.",
        ),
        map: 4,
        sources: ["cable", "light"],
      },
      {
        title: c(
          "Tres aeropuertos no son tres terminales",
          "Three airports are not three terminals",
        ),
        text: c(
          "AICM está al oriente del centro: Terminal Aérea sirve a T1. AIFA está al norte de CDMX y tiene conexión ferroviaria desde Buenavista. Toluca queda al poniente y requiere revisar el acceso terrestre. Comprueba el código de tu aeropuerto antes de trazar la ruta.",
          "AICM is east of the center: Terminal Aérea serves T1. AIFA is north of Mexico City and has a rail connection from Buenavista. Toluca lies west and requires checking ground access. Check your airport code before planning the route.",
        ),
        notice: c(
          "MEX, NLU y TLC. Referencias revisadas en octubre de 2026; abre al operador para horarios y servicio vigente.",
          "MEX, NLU and TLC. References reviewed in October 2026; open the operator for current schedules and service.",
        ),
        map: 5,
        sources: ["aicm", "aifa", "toluca"],
      },
    ],
  },
];
export const ERAS = [
  {
    label: c("Antes de los mexicas", "Before the Mexica"),
    date: c("Antes del siglo XIV", "Before the 14th century"),
    title: c("La cuenca ya tenía historia", "The basin already had a history"),
    text: c(
      "Agua, suelos volcánicos y asentamientos anteriores a Tenochtitlan. Cuicuilco evita que confundamos historia mexica con toda la historia.",
      "Water, volcanic ground and settlements older than Tenochtitlan. Cuicuilco keeps us from confusing Mexica history with all history.",
    ),
    sources: ["cuicuilco", "basin"],
  },
  {
    label: c("Isla y orillas", "Island and shores"),
    date: "c. 1500",
    title: c(
      "Conectar era navegar y caminar",
      "Connections by canoe and on foot",
    ),
    text: c(
      "Tenochtitlan y Tlatelolco se relacionan con centros de las orillas. El dibujo muestra conexiones, no costas ni fronteras reconstruidas.",
      "Tenochtitlan and Tlatelolco connect with centers on the shores. The drawing shows relationships, not reconstructed shorelines or borders.",
    ),
    sources: ["island", "causeways"],
  },
  {
    label: c("Ciudad colonial", "Colonial city"),
    date: "c. 1550",
    title: c("El mundo del mapa de Uppsala", "The world of the Uppsala map"),
    text: c(
      "Una mirada indígena y colonial temprana a la ciudad y sus contornos. Es posterior a la conquista; no lo uses como una vista intacta de 1500.",
      "An Indigenous and early colonial view of the city and its surroundings. It follows the conquest; do not treat it as an untouched view of 1500.",
    ),
    sources: ["uppsala"],
  },
  {
    label: c("Calles y cuarteles", "Streets and quarters"),
    date: "1793 / 1807",
    title: c("Medir otra ciudad", "Surveying a changed city"),
    text: c(
      "García Conde levanta el plano en 1793; se publica en 1807. La fuente es un plano urbano, no un inventario del agua en toda la cuenca.",
      "García Conde surveys the plan in 1793; it is published in 1807. The source is an urban plan, not a basin-wide water inventory.",
    ),
    sources: ["conde"],
  },
  {
    label: c("Canales y desagüe", "Canals and drainage"),
    date: "c. 1900",
    title: c("Dos movimientos del agua", "Two movements of water"),
    text: c(
      "Canales de transporte y obras para sacar agua coexistieron. La Viga permite seguir el abasto hacia el centro; el Gran Canal abre otra historia de desagüe.",
      "Transport canals and works to drain water coexisted. La Viga reveals supply routes toward the center; the Grand Canal tells a drainage story.",
    ),
    sources: ["viga", "water"],
  },
  {
    label: c("Vista desde arriba", "Seen from above"),
    date: "1932–1994",
    title: c(
      "Conectar, construir, extenderse",
      "Connecting, building, expanding",
    ),
    text: c(
      "La fotografía aérea permite estudiar la expansión. Las conexiones que aparecen aquí son una síntesis didáctica; no una huella urbana calculada a partir de vuelos.",
      "Aerial photography allows us to study expansion. Connections shown here are an educational synthesis, not an urban footprint calculated from flights.",
    ),
    sources: ["aerial"],
  },
  {
    label: c("La ciudad de hoy", "The city today"),
    date: "2026",
    title: c("El pasado no se quedó atrás", "The past did not stay behind"),
    text: c(
      "Límites administrativos, redes de transporte, pueblos, bosques y agricultura comparten el mapa. Las huellas del agua ayudan a relacionarlos.",
      "Administrative boundaries, transport networks, towns, forests and farming share the map. Traces of water help connect them.",
    ),
    sources: ["metro", "living", "forest"],
  },
];
export const LOCAL_TIMELINES = [
  {
    id: "viga",
    name: "La Viga · Iztacalco",
    stages: [
      c(
        "Canal: conexión del sur con mercados del centro.",
        "Canal: connecting the south with central markets.",
      ),
      c(
        "Archivo 1880–1950: canoas, barrios y cambios del paisaje.",
        "1880–1950 archive: canoes, neighborhoods and a changing landscape.",
      ),
      c(
        "Hoy: calles y nombres para seguir la pista del agua.",
        "Today: streets and names preserve clues to water.",
      ),
    ],
    sources: ["viga", "vigaPhotos"],
  },
  {
    id: "chapultepec",
    name: "Chapultepec",
    stages: [
      c(
        "Depósito prehispánico para abastecer de agua.",
        "A pre-Hispanic reservoir for water supply.",
      ),
      c(
        "1870: abren baños públicos frente al depósito.",
        "1870: public baths open opposite the reservoir.",
      ),
      c(
        "Hoy: sobrevive el depósito; el nombre mezcla historias.",
        "Today: the reservoir survives; its name blends histories.",
      ),
    ],
    sources: [],
  },
  {
    id: "cuicuilco",
    name: "Cuicuilco · Tlalpan",
    stages: [
      c(
        "Centro monumental anterior a Tenochtitlan.",
        "A monumental center older than Tenochtitlan.",
      ),
      c(
        "La actividad del Xitle transforma el paisaje; la cronología sigue en estudio.",
        "Xitle’s activity transforms the landscape; chronology remains under study.",
      ),
      c(
        "Hoy: arqueología junto al sur urbanizado.",
        "Today: archaeology beside the urbanized south.",
      ),
    ],
    sources: ["cuicuilco", "cuicuilcoMuseum"],
  },
];
