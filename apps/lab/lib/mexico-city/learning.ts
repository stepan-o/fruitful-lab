import type { Point } from "./content";
import type { LearningId } from "./rewards";
export type Copy = { es: string; en: string };
export const copy = (es: string, en: string): Copy => ({ es, en });
export const CHAPTER = [
  {
    title: copy("Antes de las calles, el agua.", "Before the streets, water."),
    tag: copy("01 / UNA CIUDAD EN UNA CUENCA", "01 / A CITY IN A BASIN"),
    body: copy(
      "Para entender la ciudad, primero quítale el asfalto. La cuenca estaba ocupada por un sistema de lagos: Zumpango, Xaltocan, Texcoco, Xochimilco y Chalco. Tenochtitlan creció en una isla. Las montañas, el agua y los pueblos de las orillas ya organizaban el territorio mucho antes de las alcaldías.",
      "To understand the city, peel away the asphalt. A lake system occupied the basin: Zumpango, Xaltocan, Texcoco, Xochimilco and Chalco. Tenochtitlan grew on an island. Mountains, water and shoreline communities organized this landscape long before today’s boroughs.",
    ),
    interaction: copy(
      "Mueve el control: el agua deja de verse, pero su historia sigue debajo.",
      "Move the slider: the water disappears from view, but its history stays underneath.",
    ),
    detail: copy(
      "Después de la conquista, sucesivas obras de desagüe transformaron la cuenca. No fue un lago que desapareció de golpe ni una ciudad que creció sola: absorbió y conectó otros asentamientos.",
      "After the conquest, successive drainage works transformed the basin. The lakes did not vanish all at once, and the city did not grow alone: it absorbed and connected other settlements.",
    ),
    source:
      "https://ciencia.unam.mx/leer/848/la-ciudad-que-seco-sus-lagos-y-hoy-enfrenta-la-escasez-de-agua-",
    credit: "Ciencia UNAM · La ciudad que secó sus lagos",
    quote: "la naturaleza cerrada de la cuenca se modificó",
    quoteTranslation: "the closed nature of the basin was altered",
  },
  {
    title: copy("Las rutas tienen memoria.", "Routes have long memories."),
    tag: copy("02 / DE LA ISLA A LAS ORILLAS", "02 / FROM ISLAND TO SHORE"),
    body: copy(
      "Tenochtitlan no estaba aislada: canoas y calzadas la unían con otros pueblos. Mira tres direcciones: al poniente hacia Tlacopan, al norte hacia Tepeyac y al sur hacia Iztapalapa. Algunas avenidas actuales conservan esos ejes. El pasado también se recorre en línea recta.",
      "Tenochtitlan was connected by canoes and causeways. Follow three directions: west toward Tlacopan, north toward Tepeyac, and south toward Iztapalapa. Some present-day avenues retain those axes. History can survive as a direction through the city.",
    ),
    interaction: copy(
      "Toca una dirección y descubre su huella actual.",
      "Choose a direction to reveal its present-day trace.",
    ),
    detail: copy(
      "Las líneas son un esquema de conexiones, no una reconstrucción exacta de las calzadas. El Centro Histórico nos sirve de ancla para comparar épocas.",
      "The lines explain connections; they are not exact causeway reconstructions. Centro Histórico is our anchor for comparing eras.",
    ),
    source: "https://www.noticonquista.unam.mx/amoxtli/2076/2073",
    credit: "Noticonquista · UNAM · El espectáculo en México-Tenochtitlan",
    quote:
      "Dichas calzadas son, todavía, los ejes principales de la moderna Ciudad de México",
    quoteTranslation:
      "Those causeways remain the main axes of modern Mexico City",
  },
  {
    title: copy("Una ciudad, muchos centros.", "One city, many centers."),
    tag: copy("03 / LAS PIEZAS DE HOY", "03 / TODAY’S PIECES"),
    body: copy(
      "Las 16 alcaldías son divisiones administrativas actuales; no son las fronteras de los pueblos prehispánicos. Usa el Centro como referencia, no como el centro geométrico. Hacia el sur persiste la memoria del agua; al poniente, el bosque y las laderas; al norte y al oriente, otros grandes núcleos de la ciudad.",
      "The 16 boroughs are modern administrative divisions, not the borders of pre-Hispanic communities. Use Centro as a reference, not the geographic midpoint. The south holds water’s memory; the west has forest and hillsides; the north and east have other major urban centers.",
    ),
    interaction: copy(
      "Toca una alcaldía. Relaciona su posición con una historia o un lugar.",
      "Choose a borough. Connect its position with a story or landmark.",
    ),
    detail: copy(
      "Centro, Roma y Condesa son zonas dentro de Cuauhtémoc. Chapultepec no es una alcaldía. Aprender esas escalas evita muchas confusiones al moverse.",
      "Centro, Roma and Condesa are areas within Cuauhtémoc. Chapultepec is not a borough. Understanding those scales makes navigation easier.",
    ),
    source:
      "https://www.mexicocity.cdmx.gob.mx/e/guias-completas-de-rutas-de-la-ciudad-de-mexico/",
    credit:
      "Secretaría de Turismo CDMX · Guías de zonas; SGIRPC · límites actuales",
  },
  {
    title: copy(
      "Cambia de línea, conecta las piezas.",
      "Change lines, connect the pieces.",
    ),
    tag: copy("04 / EL METRO COMO BRÚJULA", "04 / THE METRO AS YOUR COMPASS"),
    body: copy(
      "El Metro dibuja otra forma de entender la ciudad: corredores y transbordos. La Línea 2 enlaza el Centro con el noroeste y el sur; la 3 recorre un eje norte–sur; la 8 conecta el Centro con Iztapalapa. Aprende primero esos movimientos, después los nombres de cada estación.",
      "The Metro offers another way to read the city: corridors and interchanges. Line 2 connects Centro with the northwest and south; Line 3 follows a north–south axis; Line 8 connects Centro to Iztapalapa. Learn those movements before memorizing every station.",
    ),
    interaction: copy(
      "Elige una línea. Las demás se atenúan para que sigas su recorrido.",
      "Choose a line. The others fade so you can follow its path.",
    ),
    detail: copy(
      "Éste es un mapa geográfico: conserva las posiciones reales. Los planos del Metro simplifican las curvas para ayudarte a leer las conexiones. Ambos sirven, pero responden a preguntas distintas.",
      "This geographic map preserves real positions. Metro diagrams simplify bends to make connections easier to read. Both are useful, for different questions.",
    ),
    source: "https://www.metro.cdmx.gob.mx/la-red/mapa-de-la-red-con-calles",
    credit:
      "STC Metro · mapa de la red; SGIRPC · geometría de líneas y estaciones",
  },
  {
    title: copy(
      "Cuando la ciudad sube, tú también.",
      "When the city climbs, so can you.",
    ),
    tag: copy(
      "05 / CONEXIONES POR EL AIRE",
      "05 / CONNECTIONS THROUGH THE AIR",
    ),
    body: copy(
      "La ciudad también trepa cerros y cruza barrancas. El Cablebús complementa al Metro: la Línea 1 enlaza Indios Verdes con Cuautepec; la 2 recorre Iztapalapa entre Constitución de 1917 y Santa Martha; la 3 conecta Los Pinos/Constituyentes con Vasco de Quiroga, a través de Chapultepec.",
      "The city climbs hills and crosses ravines. Cablebús complements the Metro: Line 1 links Indios Verdes with Cuautepec; Line 2 crosses Iztapalapa between Constitución de 1917 and Santa Martha; Line 3 links Los Pinos/Constituyentes to Vasco de Quiroga through Chapultepec.",
    ),
    interaction: copy(
      "Sigue cada corredor y ubica su conexión con el Metro.",
      "Follow each corridor and find its Metro connection.",
    ),
    detail: copy(
      "C1: Metro 3 en Indios Verdes. C2: Metro 8 en Constitución de 1917 y A en Santa Martha. C3: acceso desde Metro 7, Constituyentes. Las conexiones pueden requerir salir y caminar.",
      "C1: Metro 3 at Indios Verdes. C2: Metro 8 at Constitución de 1917 and A at Santa Martha. C3: access from Metro 7 at Constituyentes. Connections can involve exiting and walking.",
    ),
    source: "https://www.ste.cdmx.gob.mx/cablebus",
    credit: "Servicio de Transportes Eléctricos · Cablebús, líneas 1–3",
  },
  {
    title: copy(
      "El aeropuerto no siempre está aquí cerquita.",
      "Your airport might be farther than you think.",
    ),
    tag: copy("06 / SALIR Y VOLVER A LA CUENCA", "06 / LEAVING AND RETURNING"),
    body: copy(
      "Revisa las letras del boleto: MEX, NLU y TLC son tres aeropuertos distintos. El AICM está al oriente de la ciudad; el AIFA, al norte, en el Estado de México; Toluca está al poniente, al otro lado de la sierra. Esa diferencia cambia todo el viaje.",
      "Check the code on your ticket: MEX, NLU and TLC are three different airports. AICM is in the east of the city; AIFA lies north in the State of Mexico; Toluca is west, across the mountains. That difference changes the whole journey.",
    ),
    interaction: copy(
      "Elige un aeropuerto para ver una conexión de referencia.",
      "Choose an airport to see a reference connection.",
    ),
    detail: copy(
      "Conexiones verificadas el 10 de octubre de 2026. Consulta al operador antes de salir: aquí no mostramos horarios, tarifas ni incidencias en tiempo real. Las líneas punteadas son esquemas, no rutas de navegación.",
      "Connections checked October 10, 2026. Check the operator before travel: this chapter has no live schedules, fares or disruptions. Dotted lines are connection sketches, not navigation routes.",
    ),
    source:
      "https://www.aicm.com.mx/pasajeros/servicios/prestadores-de-servicios/transportes/metro",
    credit: "AICM · FONADIN · Aeropuerto Internacional de Toluca",
  },
];
export const BOROUGH_ANCHORS = [
  {
    id: "09015",
    name: "Cuauhtémoc",
    point: [-99.14, 19.44] as Point,
    detail: copy(
      "Centro Histórico, al norte del centro geométrico de la CDMX: la antigua isla es tu punto de partida. Roma y Condesa quedan al suroeste de ese ancla.",
      "Centro Histórico sits north of CDMX’s geographic midpoint: the former island is your starting point. Roma and Condesa lie southwest of that anchor.",
    ),
  },
  {
    id: "09016",
    name: "Miguel Hidalgo",
    point: [-99.2, 19.43] as Point,
    detail: copy(
      "Al poniente del Centro: Chapultepec te da una referencia verde. Sus manantiales abastecieron a la ciudad; no es sólo un parque bonito.",
      "West of Centro, Chapultepec gives you a green anchor. Its springs supplied the city; it is more than a beautiful park.",
    ),
  },
  {
    id: "09005",
    name: "Gustavo A. Madero",
    point: [-99.12, 19.51] as Point,
    detail: copy(
      "Al norte: Tepeyac y la Basílica. Indios Verdes conecta el eje de la Línea 3 con Cablebús 1 hacia Cuautepec.",
      "To the north: Tepeyac and the Basilica. Indios Verdes connects the Line 3 axis with Cablebús 1 toward Cuautepec.",
    ),
  },
  {
    id: "09007",
    name: "Iztapalapa",
    point: [-99.05, 19.35] as Point,
    detail: copy(
      "Al oriente y sureste del Centro: un antiguo asentamiento ribereño, hoy una gran alcaldía. La Línea 8 y Cablebús 2 ayudan a conectar sus zonas.",
      "East and southeast of Centro: an old lakeshore settlement, now a major borough. Metro 8 and Cablebús 2 help connect its neighborhoods.",
    ),
  },
  {
    id: "09003",
    name: "Coyoacán",
    point: [-99.16, 19.34] as Point,
    detail: copy(
      "Al sur del Centro, antes de llegar a Xochimilco: un núcleo con historia propia. La Casa Azul y sus plazas te ayudan a reconocerlo.",
      "South of Centro, before Xochimilco: a center with its own history. Casa Azul and its plazas help you recognize it.",
    ),
  },
  {
    id: "09013",
    name: "Xochimilco",
    point: [-99.1, 19.25] as Point,
    detail: copy(
      "Al sur: canales y chinampas mantienen viva una relación productiva con el agua. No tiene Metro directo: la Línea 2 llega a Tasqueña, donde se conecta con el Tren Ligero.",
      "To the south, canals and chinampas keep a working relationship with water alive. There is no direct Metro: Line 2 reaches Tasqueña, with a connection to Tren Ligero.",
    ),
  },
];
export const AIRPORTS = [
  {
    id: "MEX",
    name: "AICM · MEX",
    point: [-99.072, 19.436] as Point,
    hub: [-99.096, 19.447] as Point,
    hubName: "Oceanía",
    detail: copy(
      "Metro B → Oceanía → Metro 5 → Terminal Aérea → acceso a T1. Para T2, consulta la conexión entre terminales o el servicio aeroportuario de Metrobús 4. Terminal Aérea sirve a T1, no llega directamente a T2.",
      "Metro B → Oceanía → Metro 5 → Terminal Aérea → T1 access. For T2, check the inter-terminal connection or the Metrobús 4 airport service. Terminal Aérea serves T1, not T2 directly.",
    ),
    source:
      "https://www.aicm.com.mx/pasajeros/servicios/prestadores-de-servicios/transportes/metro",
    extra:
      "https://www.aicm.com.mx/pasajeros/servicios/prestadores-de-servicios/transportes/metrobus",
  },
  {
    id: "NLU",
    name: "AIFA · NLU",
    point: [-99.025, 19.746] as Point,
    hub: [-99.152, 19.447] as Point,
    hubName: "Buenavista",
    detail: copy(
      "Metro B → Buenavista → Tren Felipe Ángeles → AIFA. El servicio Buenavista–AIFA comenzó el 26 de abril de 2026. Es un tren regional, no una prolongación del Metro; consulta su operación antes del viaje.",
      "Metro B → Buenavista → Tren Felipe Ángeles → AIFA. Buenavista–AIFA service began on April 26, 2026. This is a regional train, not a Metro extension; check its operation before travel.",
    ),
    source: "https://www.fonadin.gob.mx/fni2/fp103/",
  },
  {
    id: "TLC",
    name: "Toluca · TLC",
    point: [-99.566, 19.337] as Point,
    hub: [-99.2004, 19.3983] as Point,
    hubName: "Observatorio",
    detail: copy(
      "Metro 1 → Observatorio → transporte terrestre al AIT. El aeropuerto de Toluca publica servicios desde Observatorio. Confirma el punto de salida y la disponibilidad con el operador: el Metro no llega al aeropuerto.",
      "Metro 1 → Observatorio → ground transport to AIT. Toluca Airport lists services from Observatorio. Confirm the departure point and availability with the operator: the Metro does not reach the airport.",
    ),
    source: "https://aeropuertodetoluca.com.mx/preguntas-frecuentes/",
  },
];
export const CITY_QUIZ: {
  id: LearningId;
  kind: Copy;
  question: Copy;
  choices: Copy[];
  correct: number;
  explanation: Copy;
  mapBorough?: string;
}[] = [
  {
    id: "city-lake",
    kind: copy("Historia", "History"),
    question: copy(
      "¿Qué explica que el Centro Histórico sea un ancla tan importante?",
      "Why is Centro Histórico such an important anchor?",
    ),
    choices: [
      copy(
        "La antigua isla de Tenochtitlan estaba aquí",
        "The former island of Tenochtitlan was here",
      ),
      copy(
        "Es el centro geométrico exacto de la CDMX",
        "It is CDMX’s exact geographic midpoint",
      ),
      copy(
        "Aquí nacieron todas las líneas del Metro",
        "Every Metro line began here",
      ),
    ],
    correct: 0,
    explanation: copy(
      "La ciudad mexica se desarrolló en una isla del sistema lacustre de Texcoco. El centro histórico heredó esa posición, aunque la metrópoli creció mucho más allá.",
      "The Mexica city developed on an island in the Texcoco lake system. The historic center inherited that position while the metropolis grew far beyond it.",
    ),
  },
  {
    id: "city-causeway",
    kind: copy("Historia y orientación", "History and orientation"),
    question: copy(
      "Una avenida que sigue un eje antiguo hacia el norte: ¿qué conexión ayuda a recordar?",
      "An avenue following an old northward axis: which connection does it help you remember?",
    ),
    choices: [
      copy("Centro → Xochimilco", "Centro → Xochimilco"),
      copy("Centro → Toluca", "Centro → Toluca"),
      copy("Centro → Tepeyac", "Centro → Tepeyac"),
    ],
    correct: 2,
    explanation: copy(
      "Tepeyac queda al norte. Las calzadas conectaban la isla con las orillas; algunas direcciones sobreviven en avenidas de hoy.",
      "Tepeyac lies north. Causeways linked the island to the shores; some directions survive in today’s avenues.",
    ),
  },
  {
    id: "city-south",
    kind: copy("Ubicación e historia", "Position and history"),
    question: copy(
      "Busca la alcaldía al sur donde canales y chinampas ayudan a entender la antigua ciudad de agua.",
      "Find the southern borough where canals and chinampas help explain the old water-based city.",
    ),
    choices: [
      copy("Miguel Hidalgo", "Miguel Hidalgo"),
      copy("Xochimilco", "Xochimilco"),
      copy("Gustavo A. Madero", "Gustavo A. Madero"),
    ],
    correct: 1,
    mapBorough: "09013",
    explanation: copy(
      "Xochimilco está al sur. Sus chinampas son un paisaje agrícola vivo: el agua sigue siendo parte del trabajo y del territorio.",
      "Xochimilco lies south. Its chinampas are a living agricultural landscape: water remains part of work and territory.",
    ),
  },
  {
    id: "city-metro",
    kind: copy("Conexiones", "Connections"),
    question: copy(
      "Desde el Centro quieres dirigirte a Iztapalapa, hacia Constitución de 1917. ¿Qué corredor del Metro te orienta?",
      "From Centro, you want to head to Iztapalapa toward Constitución de 1917. Which Metro corridor helps?",
    ),
    choices: [
      copy("Línea 7", "Line 7"),
      copy("Línea 5", "Line 5"),
      copy("Línea 8", "Line 8"),
    ],
    correct: 2,
    explanation: copy(
      "La Línea 8 une Garibaldi/Lagunilla con Constitución de 1917. Ahí puedes conectar con Cablebús 2.",
      "Line 8 links Garibaldi/Lagunilla with Constitución de 1917, where you can connect to Cablebús 2.",
    ),
  },
  {
    id: "city-cable",
    kind: copy("Relieve y movilidad", "Terrain and mobility"),
    question: copy(
      "Estás en Indios Verdes y quieres seguir hacia Cuautepec. ¿Qué complementa al Metro?",
      "You’re at Indios Verdes and want to continue toward Cuautepec. What complements the Metro?",
    ),
    choices: [
      copy("Cablebús 1", "Cablebús 1"),
      copy("Cablebús 3", "Cablebús 3"),
      copy("Tren Ligero", "Tren Ligero"),
    ],
    correct: 0,
    explanation: copy(
      "Cablebús 1 conecta el norte de Gustavo A. Madero con Indios Verdes. La red se adapta a una ciudad que también sube por las laderas.",
      "Cablebús 1 connects northern Gustavo A. Madero with Indios Verdes. The network adapts to a city that also climbs hillsides.",
    ),
  },
  {
    id: "city-airport",
    kind: copy("Navegación", "Navigation"),
    question: copy(
      "Tu boleto dice NLU. ¿Qué conexión corresponde a ese aeropuerto?",
      "Your ticket says NLU. Which connection serves that airport?",
    ),
    choices: [
      copy("Terminal Aérea → AICM T1", "Terminal Aérea → AICM T1"),
      copy(
        "Buenavista → Tren Felipe Ángeles → AIFA",
        "Buenavista → Tren Felipe Ángeles → AIFA",
      ),
      copy(
        "Observatorio → transporte a Toluca",
        "Observatorio → ground transport to Toluca",
      ),
    ],
    correct: 1,
    explanation: copy(
      "NLU es el AIFA, al norte de la CDMX, en el Estado de México. MEX es el AICM y TLC es Toluca: son viajes distintos.",
      "NLU is AIFA, north of CDMX in the State of Mexico. MEX is AICM and TLC is Toluca: they are different journeys.",
    ),
  },
];
