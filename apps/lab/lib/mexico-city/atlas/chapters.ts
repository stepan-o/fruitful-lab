import { c } from "./content";
export { CHAPTERS } from "./history";
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
    sources: [
      "https://www.inah.gob.mx/boletines/banos-de-chapultepec-las-albercas-de-aguas-curativas-del-siglo-xix-que-alimentaron-la-leyenda-de-los-banos-de-moctezuma",
    ],
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
