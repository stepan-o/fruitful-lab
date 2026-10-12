import { WORDS, PLACE_PUZZLES } from "../nahuatl";
export type Copy = { es: string; en: string };
export const c = (es: string, en: string): Copy => ({ es, en });
export const REVIEWED = "2026-10-12";
export const SOURCES: Record<string, { title: string; url: string }> = {
  drainageEighteenth: {
    title:
      "Jorge Gurría Lacroix · El desagüe en el XVIII y principios del XIX, pp. 139–158 · UNAM (1978)",
    url: "https://historicas.unam.mx/publicaciones/publicadigital/libros/047/047_04_09_desague.pdf",
  },
  drainageWorks: {
    title: "SICT · El desagüe del Valle de México",
    url: "https://elmirador.sct.gob.mx/manos-a-la-obra/el-desague-del-valle-de-mexico",
  },
  hydraulicCity: {
    title:
      "Jorge Gurría Lacroix · La ciudad de México, pp. 19–36 · UNAM (1978)",
    url: "https://historicas.unam.mx/publicaciones/publicadigital/libros/047/047_04_02_ciudadmexico.pdf",
  },
  firstDrain: {
    title:
      "Carlos González Cabello · El primer desagüe colonial en los lagos de la cuenca de México · HistoriAgenda (2016)",
    url: "https://revistas.unam.mx/index.php/historiagenda/article/view/57072",
  },
  lakebed: {
    title:
      "Natalia V. Soto Coloballes · Terrenos desecados de Texcoco, 1912–1998 · UNAM (2019)",
    url: "https://moderna.historicas.unam.mx/index.php/ehm/article/view/70695",
  },
  chinampas: {
    title: "FAO · Chinampas Agricultural System in Mexico City · SIPAM (2017)",
    url: "https://www.fao.org/giahs/giahs-around-the-world/mexico-chinampas-agricultural-system/en",
  },
  chapin: {
    title: "Agricultura CDMX · El chapín, técnica de siembra ancestral",
    url: "https://www.gob.mx/agricultura/cdmx/articulos/el-chapin-tecnica-de-siembra-ancestral?idiom=es",
  },
  archive1847: {
    title:
      "M. L. Smith / E. L. F. Hardcastle · Map of the valley of Mexico · Library of Congress (1847)",
    url: "https://www.loc.gov/item/2018593099/",
  },
  archive1524: {
    title:
      "Friedrich Peypus, impresor · Tenochtitlan y Golfo de México · Newberry Library (1524)",
    url: "https://commons.wikimedia.org/wiki/File:Map_of_Tenochtitlan_and_Gulf_of_Mexico,_1524.jpg",
  },
  archiveViga: {
    title:
      "Abel Briquet · Canal de la Viga · DeGolyer Library, SMU (ca. 1885–1899)",
    url: "https://digitalcollections.smu.edu/cdm/ref/collection/mex/id/2838",
  },
  texcocoProtected: {
    title: "CONANP · Programa de Manejo, Lago de Texcoco (2024; decreto 2022)",
    url: "https://www.conanp.gob.mx/programademanejo/PMLagoDeTexcoco.pdf",
  },
  cuicuilcoLandscape: {
    title: "INAH · Zona arqueológica de Cuicuilco",
    url: "https://www.inah.gob.mx/zonas/zona-arqueologica-cuicuilco",
  },
  teotihuacan: {
    title: "INAH · Historia breve de Teotihuacan (2009)",
    url: "https://www.inah.gob.mx/boletines/historia-breve-de-teotihuacan",
  },
  teotihuacanCity: {
    title: "INAH · Ciudad prehispánica de Teotihuacan",
    url: "https://lugares.inah.gob.mx/es/node/6130",
  },
  teotihuacanEnd: {
    title: "INAH · La historia de un colapso: el fin de la gran Teotihuacán",
    url: "https://visitateotihuacan.inah.gob.mx/aprende/teotihuacan-colapso-final-fin/",
  },
  tula: {
    title: "INAH · Zona arqueológica de Tula",
    url: "https://lugares.inah.gob.mx/es/node/4360",
  },
  culhuacan: {
    title: "INAH · Centro Comunitario Culhuacán",
    url: "https://mediateca.inah.gob.mx/repositorio/islandora/object/museo%3A1518",
  },
  alliance: {
    title:
      "Marco Antonio Cervera Obregón · Los orígenes del Imperio Mexica · UNAM",
    url: "https://www.noticonquista.unam.mx/amoxtli/1012/961",
  },
  tlatelolco: {
    title: "INAH · Templo Mayor de Tlatelolco (2023)",
    url: "https://www.inah.gob.mx/foto-del-dia/templo-mayor-de-tlatelolco",
  },
  tribute: {
    title:
      "Museo del Templo Mayor, INAH · Travesía 1: Antecedentes arqueológicos",
    url: "https://www.templomayor.inah.gob.mx/images/home/tripticos/viajeros.pdf",
  },
  malintzin: {
    title: "Berenice Alcántara Rojas · Marina–Malina–Malintzin–Malinche · UNAM",
    url: "https://www.noticonquista.unam.mx/index.php/amoxtli/365/363",
  },
  siege: {
    title: "Iván Arriaga · El inicio del asedio de México Tenochtitlan · UNAM",
    url: "https://www.noticonquista.unam.mx/amoxtli/2746/2743",
  },
  coalition: {
    title:
      "UNAM, Noticonquista · Batallas, conquistas y rebeliones, la gran guerra de 1521",
    url: "https://www.noticonquista.unam.mx/portada/semanal/2592",
  },
  epidemic: {
    title: "Sandra Guevara · Pandemia en Tenochtitlan · UNAM (2020)",
    url: "https://www.noticonquista.unam.mx/sites/default/files/2020-03/guevara_-_pandemia_-_final.pdf",
  },
  urbanGrowth: {
    title:
      "Javier Delgado, coord. · La urbanización difusa de la Ciudad de México · UNAM (2008)",
    url: "https://publicaciones.geografia.unam.mx/index.php/ig/catalog/book/10",
  },
  rivers: {
    title: "PUEC, UNAM · Rescate de ríos urbanos (2012)",
    url: "https://www.puec.unam.mx/pdf/publicaciones_digitales/rescate_rios_digital.pdf",
  },
  capital1929: {
    title: "UNAM · La creación del Departamento del Distrito Federal",
    url: "https://librosoa.unam.mx/handle/123456789/2636",
  },
  metroHistory: {
    title: "AGN · Inauguración del Metro, vía El Nacional (archivo de 1969)",
    url: "https://www.gob.mx/agn/articulos/agn-recuerda-la-inauguracion-del-metro-via-el-nacional?idiom=es",
  },
  palace: {
    title: "AGN · El proyecto inconcluso del Palacio Legislativo",
    url: "https://www.gob.mx/agn/articulos/agnrecuerda-el-proyecto-inconcluso-del-palacio-legislativo-hoy-monumento-a-la-revolucion",
  },
  earthquake: {
    title: "UNAM · El sismo de 1985 y la investigación científica (2025)",
    url: "https://www.dgcs.unam.mx/boletin/bdboletin/2025_622.html",
  },
  urbanClimate: {
    title: "Gaceta UNAM · Urbanización cambia clima de Ciudad de México (2021)",
    url: "https://www.gaceta.unam.mx/urbanizacion-cambia-clima-de-ciudad-de-mexico/",
  },
  chinampaStudy: {
    title:
      "UNAM, Anales del Instituto de Biología · Chinampas y almácigos flotantes, 8(3), pp. 375–386",
    url: "https://anales.ib.unam.mx/index.php/anales/es/article/view/335",
  },
  chinampaHistory: {
    title: "UNAM, Decires · Historia de Xochimilco y sus chinampas",
    url: "https://decires.cepe.unam.mx/index.php/decires/article/download/127/108/219",
  },
  chinampaRefuge: {
    title:
      "Ciencia UNAM · Ajolotes y chinampas en el rescate de Xochimilco (2022)",
    url: "https://ciencia.unam.mx/leer/1251/ajolotes-y-chinampas-en-el-rescate-de-xochimilco",
  },
  axolotl: {
    title:
      "Liliana Morán / Elizabeth Cruz · Axolotes y chinampas: vida en equilibrio · UNAM (2025)",
    url: "https://ciencia.unam.mx/contenido/infografia/279/axolotes-y-chinampas-vida-en-equilibrio",
  },
  archiveChinampas: {
    title:
      "Karl Weule, Leitfaden der Völkerkunde · Chinampas (publicación de 1912)",
    url: "https://commons.wikimedia.org/wiki/File:Chinampas.jpg",
  },
  archiveMendoza: {
    title:
      "Bodleian Libraries · Códice Mendoza, MS. Arch. Selden. A. 1, folio 2r (ca. 1541)",
    url: "https://digital.bodleian.ox.ac.uk/objects/2fea788e-2aa2-4f08-b6d9-648c00486220/",
  },
  florentine: {
    title:
      "Códice Florentino · libro XII, folio 53v (1577) · Biblioteca Medicea Laurenziana / Getty",
    url: "https://florentinecodex.getty.edu/en/book/12/folio/53v/images/37bdcd20-4f02-47e3-a2b8-a1a52e844472",
  },
  conquestEnd: {
    title: "Iván Arriaga · Julio–agosto de 1521: la caída de Tlatelolco · UNAM",
    url: "https://www.noticonquista.unam.mx/index.php/amoxtli/2752/2750",
  },
  indigenousAfter: {
    title: "Federico Navarrete · ¿Conquista, invasión o rebelión? · UNAM",
    url: "https://www.noticonquista.unam.mx/amoxtli/2599/2592",
  },
  archiveMonument: {
    title: "CarlosGalvanMex · Monumento a la Revolución (2018), CC BY-SA 4.0",
    url: "https://commons.wikimedia.org/wiki/File:MONUMENTO_A_LA_REVOLUCION_CON_CIELO_AZUL.jpg",
  },
  subsidence: {
    title: "UNAM Geofísica · Hundimiento del suelo en la CDMX (2026)",
    url: "https://geogaceta.geofisica.unam.mx/index.php/2026/05/18/el-hundimiento-del-suelo-en-la-zona-metropolitana-de-la-cdmx-alcanza-hasta-42-centimetros-por-ano/",
  },
  drainage: {
    title: "UNAM · El desagüe del Valle de México durante la época novohispana",
    url: "https://historicas.unam.mx/publicaciones/publicadigital/libros/047/desague_valle.html",
  },
  basin: {
    title: "UNAM · La paradoja del agua",
    url: "https://www.noticonquista.unam.mx/index.php/amoxtli/1010/961",
  },
  water: {
    title: "Ciencia UNAM · La ciudad que secó sus lagos",
    url: "https://ciencia.unam.mx/leer/848/la-ciudad-que-seco-sus-lagos-y-hoy-enfrenta-la-escasez-de-agua-",
  },
  causeways: {
    title: "UNAM · El espectáculo en México-Tenochtitlan",
    url: "https://www.noticonquista.unam.mx/amoxtli/2076/2073",
  },
  island: {
    title: "UNAM CCH · México-Tenochtitlan",
    url: "https://e1.portalacademico.cch.unam.mx/alumno/historiademexico1/unidad2/culturamexica/mexicotenochtitlan",
  },
  cuicuilco: {
    title: "INAH · Reinterpretando Cuicuilco (2024)",
    url: "https://revistas.inah.gob.mx/index.php/arqueologia/article/view/21580/",
  },
  cuicuilcoMuseum: {
    title: "INAH · Museo de sitio de Cuicuilco",
    url: "https://www.inah.gob.mx/museos/museo-de-sitio-de-cuicuilco",
  },
  uppsala: {
    title: "UNAM · Mapa de México Tenochtitlan y sus contornos hacia 1550",
    url: "https://historicas.unam.mx/publicaciones/catalogo/ficha?id=674",
  },
  conde: {
    title: "UNAM · Plano de la Ciudad de México, García Conde",
    url: "https://hmpi.historicas.unam.mx/fuentes/mapas/plano-de-la-ciudad-de-mexico",
  },
  aerial: {
    title: "Fundación ICA · Acervo Aerofotográfico, 1932–1994",
    url: "https://www.fundacion-ica.org.mx/acervo",
  },
  viga: {
    title:
      "Araceli Peralta Flores · El canal, puente y garita de la Viga · INAH / UNAM",
    url: "https://historicas.unam.mx/publicaciones/publicadigital/libros/caminosymercados/cm023.pdf",
  },
  vigaPhotos: {
    title: "INAH · Fotografías de Iztacalco, 1880–1950",
    url: "https://inah.gob.mx/boletines/fotografias-historicas-del-inah-revelan-un-iztacalco-inedito-en-tres-sedes-culturales-de-esta-alcaldia-capitalina",
  },
  penon: {
    title: "UNAM · El Peñón de las Delicias",
    url: "https://historicas.unam.mx/index.php/comunicacion-publica/podcast/el-penon-de-las-delicias",
  },
  milpa: {
    title: "INPI · Nahuas de Milpa Alta",
    url: "https://www.inpi.gob.mx/2021/dmdocuments/nahuas_milpa_alta.pdf",
  },
  living: {
    title: "INPI · Nahuas del Distrito Federal: lengua",
    url: "https://atlas.inpi.gob.mx/nahuas-del-distrito-federal-lengua/",
  },
  forest: {
    title: "SEDEMA · Parque Nacional Desierto de los Leones",
    url: "https://proyectos.sedema.cdmx.gob.mx/anp/assets/pages/desierto.php",
  },
  metro: {
    title: "Metro CDMX · Red con calles",
    url: "https://metro.cdmx.gob.mx/la-red/mapa-de-la-red-con-calles",
  },
  cable: {
    title: "STE · Cablebús",
    url: "https://www.ste.cdmx.gob.mx/cablebus",
  },
  light: {
    title: "CDMX · Viajar en Tren Ligero",
    url: "https://www.mexicocity.cdmx.gob.mx/e/getting-around/viajar-en-tren-ligero/",
  },
  aicm: {
    title: "AICM · Metro y acceso a Terminal 1",
    url: "https://www.aicm.com.mx/pasajeros/servicios/prestadores-de-servicios/transportes/metro",
  },
  aifa: {
    title: "FONADIN · Tren Suburbano Lechería–AIFA",
    url: "https://www.fonadin.gob.mx/fni2/fp103/",
  },
  toluca: {
    title: "Aeropuerto de Toluca · Acceso terrestre",
    url: "https://aeropuertodetoluca.com.mx/preguntas-frecuentes/",
  },
  zones: {
    title: "CDMX · Guías por zonas",
    url: "https://www.mexicocity.cdmx.gob.mx/e/guias-completas-de-rutas-de-la-ciudad-de-mexico/",
  },
};
export type Anchor = {
  name: string;
  note: Copy;
  coordinate: readonly [number, number];
  story?: string;
};
export type Borough = {
  id: string;
  name: string;
  region: Copy;
  hook: Copy;
  memory: Copy;
  today: Copy;
  transit: Copy;
  anchors: Anchor[];
  source: string;
  extra?: string;
};
const a = (
  name: string,
  lng: number,
  lat: number,
  es: string,
  en: string,
  story?: string,
): Anchor => ({ name, coordinate: [lng, lat], note: c(es, en), story });
export const BOROUGHS: Borough[] = [
  {
    id: "09015",
    name: "Cuauhtémoc",
    region: c("Centro", "Center"),
    hook: c(
      "La isla sigue debajo de tus pasos.",
      "The island is still beneath your feet.",
    ),
    memory: c(
      "Ubica el Zócalo; al norte, Tlatelolco. Hacia el poniente aparecen Tabacalera y las colonias Roma y Condesa.",
      "Find the Zócalo, with Tlatelolco to its north. Tabacalera, Roma and Condesa extend westward.",
    ),
    today: c(
      "El centro reúne capas mexicas, virreinales y modernas. Una alcaldía contiene muchos barrios: Roma no es otra alcaldía.",
      "Mexica, colonial and modern layers meet here. One borough contains many neighborhoods: Roma is not a separate borough.",
    ),
    transit: c(
      "Pino Suárez enlaza las líneas 1 y 2; Bellas Artes, la 2 y la 8.",
      "Pino Suárez connects lines 1 and 2; Bellas Artes connects 2 and 8.",
    ),
    anchors: [
      a(
        "Zócalo",
        -99.13306,
        19.43278,
        "Una plaza, varios siglos.",
        "One square, many centuries.",
        "zocalo",
      ),
      a(
        "Tlatelolco",
        -99.1377,
        19.4515,
        "Otro gran centro mexica al norte.",
        "Another major Mexica center to the north.",
      ),
      a(
        "Tabacalera",
        -99.15464,
        19.4362,
        "Un palacio inconcluso se volvió monumento.",
        "An unfinished palace became a monument.",
        "revolucion",
      ),
    ],
    source: "https://mexicocity.cdmx.gob.mx/locations/cuauhtemoc/",
    extra: "island",
  },
  {
    id: "09016",
    name: "Miguel Hidalgo",
    region: c("Centro-poniente", "West of center"),
    hook: c(
      "El cerro, el agua y los caminos del poniente.",
      "The hill, water and western roads.",
    ),
    memory: c(
      "Chapultepec es tu ancla. Busca Tacuba al norte y Tacubaya al sur: tres nombres, tres lugares distintos.",
      "Use Chapultepec as your anchor. Find Tacuba to the north and Tacubaya to the south: three names, three different places.",
    ),
    today: c(
      "El bosque conserva infraestructura del agua junto a museos y avenidas. Polanco es una colonia de esta alcaldía.",
      "The forest holds water infrastructure alongside museums and avenues. Polanco is a neighborhood within this borough.",
    ),
    transit: c(
      "Tacuba conecta 2 y 7; Tacubaya, 1, 7 y 9.",
      "Tacuba connects 2 and 7; Tacubaya connects 1, 7 and 9.",
    ),
    anchors: [
      a(
        "Chapultepec",
        -99.18144,
        19.41763,
        "Un depósito con nombre de emperador.",
        "A reservoir with an emperor’s name.",
        "chapultepec",
      ),
      a(
        "Tacuba",
        -99.1885,
        19.4595,
        "El antiguo Tlacopan, al poniente.",
        "Old Tlacopan, to the west.",
      ),
      a(
        "Tacubaya",
        -99.1872,
        19.4022,
        "Un nodo al sur del bosque.",
        "A hub south of the forest.",
      ),
    ],
    source: "https://mexicocity.cdmx.gob.mx/locations/miguel-hidalgo/",
    extra: "causeways",
  },
  {
    id: "09002",
    name: "Azcapotzalco",
    region: c("Noroeste", "Northwest"),
    hook: c(
      "Antes de las fábricas, un poder tepaneca.",
      "Before the factories, a Tepanec power.",
    ),
    memory: c(
      "Al noroeste del centro. Une el antiguo pueblo, el paisaje industrial y un parque que representa la cuenca.",
      "Northwest of the center. Connect the old town, the industrial landscape and a park depicting the basin.",
    ),
    today: c(
      "La historia tepaneca convive con barrios obreros. Tezozómoc ofrece una pista poco común: mirar el valle en miniatura.",
      "Tepanec history coexists with workers’ neighborhoods. Tezozómoc offers an unusual clue: a miniature valley.",
    ),
    transit: c(
      "La línea 6 pasa por Azcapotzalco; la 7 llega a El Rosario.",
      "Line 6 passes through Azcapotzalco; line 7 reaches El Rosario.",
    ),
    anchors: [
      a(
        "Jardín Hidalgo",
        -99.1869,
        19.4814,
        "El corazón del antiguo pueblo.",
        "The heart of the old town.",
      ),
      a(
        "Parque Tezozómoc",
        -99.2105,
        19.4992,
        "La cuenca, hecha parque.",
        "The basin, turned into a park.",
      ),
      a("Vallejo", -99.156, 19.49, "Memoria industrial.", "Industrial memory."),
    ],
    source: "https://mexicocity.cdmx.gob.mx/locations/azcapotzalco/",
  },
  {
    id: "09005",
    name: "Gustavo A. Madero",
    region: c("Norte", "North"),
    hook: c(
      "El norte también sube al cerro.",
      "The north climbs the hills too.",
    ),
    memory: c(
      "Tepeyac orienta; la Sierra de Guadalupe explica el relieve del norte. Cuautepec está entre laderas.",
      "Tepeyac is a landmark; the Sierra de Guadalupe explains the northern terrain. Cuautepec lies among hillsides.",
    ),
    today: c(
      "La basílica y los barrios de las laderas cuentan historias distintas. No reduzcas toda la alcaldía a La Villa.",
      "The basilica and hillside neighborhoods tell different stories. La Villa is only one part of this borough.",
    ),
    transit: c(
      "Indios Verdes enlaza Metro 3 con Cablebús 1 hacia Cuautepec.",
      "Indios Verdes links Metro 3 with Cablebús 1 toward Cuautepec.",
    ),
    anchors: [
      a(
        "Tepeyac",
        -99.117,
        19.484,
        "Un cerro para orientarte.",
        "A hill to get your bearings.",
      ),
      a(
        "Indios Verdes",
        -99.119,
        19.495,
        "Puerta de intercambio al norte.",
        "A northern interchange.",
      ),
      a(
        "Cuautepec",
        -99.127,
        19.555,
        "Barrios entre laderas.",
        "Neighborhoods among hillsides.",
      ),
    ],
    source:
      "https://www.mexicocity.cdmx.gob.mx/venues/tepeyac-national-park/?lang=en",
    extra: "cable",
  },
  {
    id: "09017",
    name: "Venustiano Carranza",
    region: c("Oriente del centro", "East of center"),
    hook: c("Un cerro junto a las pistas.", "A hill beside the runways."),
    memory: c(
      "Del lado oriental del centro, ubica el aeropuerto y el Peñón de los Baños. Hacia el centro aparecen grandes mercados.",
      "East of the center, locate the airport and Peñón de los Baños. Major markets lie toward the city center.",
    ),
    today: c(
      "El Peñón guarda una historia de aguas termales. El paisaje del aeropuerto no borra la vida del barrio.",
      "The Peñón carries a history of thermal springs. The airport landscape does not erase neighborhood life.",
    ),
    transit: c(
      "Terminal Aérea, línea 5, sirve a la Terminal 1 del AICM. No es acceso directo a la Terminal 2.",
      "Terminal Aérea on line 5 serves AICM Terminal 1. It is not direct access to Terminal 2.",
    ),
    anchors: [
      a(
        "Peñón de los Baños",
        -99.0489,
        19.4434,
        "Aguas y memorias junto al aeropuerto.",
        "Springs and memories beside the airport.",
        "penon",
      ),
      a(
        "AICM · T1",
        -99.0721,
        19.4361,
        "Distingue aeropuerto y terminal.",
        "Distinguish airport from terminal.",
      ),
      a(
        "Mercado de Jamaica",
        -99.1229,
        19.4083,
        "Una referencia del lado sur.",
        "A landmark on the southern side.",
      ),
    ],
    source: "https://mexicocity.cdmx.gob.mx/locations/venustiano-carranza/",
    extra: "penon",
  },
  {
    id: "09006",
    name: "Iztacalco",
    region: c("Centro-oriente", "East-central"),
    hook: c(
      "Donde había canoas, hoy buscas calles.",
      "Where canoes passed, you now look for streets.",
    ),
    memory: c(
      "Es la pieza pequeña entre el centro y el oriente. Su escala no cuenta toda su historia: La Viga conectaba pueblos y mercados.",
      "It is the small piece between the center and the east. Its size hides a bigger story: La Viga connected towns and markets.",
    ),
    today: c(
      "San Matías y los barrios antiguos conviven con la Ciudad Deportiva. Busca la memoria del canal en la trama vial.",
      "San Matías and old neighborhoods coexist with Ciudad Deportiva. Look for the canal’s memory in the street pattern.",
    ),
    transit: c(
      "Iztacalco y Santa Anita son referencias de la línea 8; Santa Anita conecta con la 4.",
      "Iztacalco and Santa Anita are line 8 anchors; Santa Anita connects with line 4.",
    ),
    anchors: [
      a(
        "San Matías",
        -99.1098,
        19.3954,
        "El antiguo pueblo.",
        "The old town.",
        "viga",
      ),
      a(
        "Santa Anita",
        -99.1217,
        19.4038,
        "Un barrio ligado al canal.",
        "A neighborhood tied to the canal.",
      ),
      a(
        "Ciudad Deportiva",
        -99.0955,
        19.4086,
        "Una gran huella deportiva.",
        "A large sporting landmark.",
      ),
    ],
    source: "https://www.mexicocity.cdmx.gob.mx/locations/iztacalco/",
    extra: "viga",
  },
  {
    id: "09007",
    name: "Iztapalapa",
    region: c("Oriente", "East"),
    hook: c(
      "El oriente tiene cerros y pueblos antiguos.",
      "The east has hills and old towns.",
    ),
    memory: c(
      "Encuentra el Cerro de la Estrella; Culhuacán queda hacia su poniente. Esta alcaldía no es sólo expansión reciente.",
      "Find Cerro de la Estrella; Culhuacán lies to its west. This borough is more than recent urban growth.",
    ),
    today: c(
      "Los pueblos originarios siguen dentro de la metrópoli. Mirar sólo el tamaño de la mancha urbana los vuelve invisibles.",
      "Original communities remain within the metropolis. Looking only at the urban footprint makes them invisible.",
    ),
    transit: c(
      "Cablebús 2 une Constitución de 1917 (Metro 8) con Santa Marta (Metro A).",
      "Cablebús 2 connects Constitución de 1917 (Metro 8) with Santa Marta (Metro A).",
    ),
    anchors: [
      a(
        "Cerro de la Estrella",
        -99.09,
        19.343,
        "Relieve y memoria ceremonial.",
        "Terrain and ceremonial memory.",
      ),
      a(
        "Culhuacán",
        -99.109,
        19.34,
        "Un centro anterior al poder mexica.",
        "A center predating Mexica power.",
      ),
      a(
        "Santa Marta",
        -98.995,
        19.36,
        "Conexiones del oriente.",
        "Eastern connections.",
      ),
    ],
    source:
      "https://iztapalapa.cdmx.gob.mx/principal/semanasanta/pueblos_ori.html",
    extra: "cable",
  },
  {
    id: "09014",
    name: "Benito Juárez",
    region: c("Sur del centro", "South of center"),
    hook: c(
      "La ciudad también creció entre sus pueblos.",
      "The city grew between its towns too.",
    ),
    memory: c(
      "Al sur de Cuauhtémoc y al norte de Coyoacán. Mixcoac, Portales y Del Valle te ayudan a reconocerla.",
      "South of Cuauhtémoc, north of Coyoacán. Mixcoac, Portales and Del Valle help you recognize it.",
    ),
    today: c(
      "Plazas y antiguos núcleos quedaron entre colonias consolidadas. No todo lo antiguo está en el Centro Histórico.",
      "Squares and older settlements sit within established neighborhoods. Old places are not confined to the Historic Center.",
    ),
    transit: c(
      "Mixcoac conecta 7 y 12; Zapata, 3 y 12. Portales está en la 2.",
      "Mixcoac connects 7 and 12; Zapata connects 3 and 12. Portales is on line 2.",
    ),
    anchors: [
      a(
        "Mixcoac",
        -99.185,
        19.375,
        "Un pueblo dentro de la ciudad.",
        "A town within the city.",
      ),
      a(
        "Portales",
        -99.142,
        19.37,
        "El eje de Tlalpan como referencia.",
        "The Tlalpan corridor as a reference.",
      ),
      a(
        "Del Valle",
        -99.166,
        19.388,
        "Colonias entre viejos núcleos.",
        "Neighborhoods between older centers.",
      ),
    ],
    source: "https://mexicocity.cdmx.gob.mx/locations/benito-juarez/",
  },
  {
    id: "09003",
    name: "Coyoacán",
    region: c("Sur urbano", "Urban south"),
    hook: c("Del pueblo al Pedregal.", "From the old town to the Pedregal."),
    memory: c(
      "El centro de Coyoacán y Ciudad Universitaria no son el mismo sitio. Entre ambos cambia el paisaje.",
      "Coyoacán’s historic center and Ciudad Universitaria are not the same place. The landscape changes between them.",
    ),
    today: c(
      "Plazas, Churubusco y el campus sobre terreno volcánico ofrecen tres formas de reconocer el sur urbano.",
      "Squares, Churubusco and the campus on volcanic terrain offer three ways to recognize the urban south.",
    ),
    transit: c(
      "Metro 3 llega a Universidad; 2 a Tasqueña, enlace con el Tren Ligero.",
      "Metro 3 reaches Universidad; line 2 reaches Tasqueña, connecting with the light rail.",
    ),
    anchors: [
      a(
        "Jardín Centenario",
        -99.163,
        19.349,
        "El corazón del pueblo.",
        "The heart of the old town.",
      ),
      a(
        "Churubusco",
        -99.149,
        19.355,
        "Otra historia, otra plaza.",
        "Another history, another square.",
      ),
      a(
        "Ciudad Universitaria",
        -99.188,
        19.332,
        "Un campus en el paisaje volcánico.",
        "A campus in a volcanic landscape.",
      ),
    ],
    source: "https://mexicocity.cdmx.gob.mx/locations/coyoacan/",
  },
  {
    id: "09010",
    name: "Álvaro Obregón",
    region: c("Poniente", "West"),
    hook: c("Entre plazas y barrancas.", "Between squares and ravines."),
    memory: c(
      "San Ángel es una entrada, no toda la alcaldía. Sigue el terreno hacia las laderas del poniente.",
      "San Ángel is an entry point, not the whole borough. Follow the terrain into the western hillsides.",
    ),
    today: c(
      "El Carmen, San Jacinto y Chimalistac conservan otras escalas dentro de la ciudad que los rodeó.",
      "El Carmen, San Jacinto and Chimalistac preserve other scales within the city that grew around them.",
    ),
    transit: c(
      "Miguel Ángel de Quevedo (línea 3) es una referencia próxima a Chimalistac; el tramo final es por superficie.",
      "Miguel Ángel de Quevedo (line 3) is a reference near Chimalistac; the last leg is at street level.",
    ),
    anchors: [
      a(
        "San Ángel",
        -99.194,
        19.345,
        "Plaza San Jacinto.",
        "Plaza San Jacinto.",
      ),
      a(
        "El Carmen",
        -99.19,
        19.344,
        "Un antiguo conjunto conventual.",
        "A former convent complex.",
      ),
      a(
        "Chimalistac",
        -99.181,
        19.343,
        "Puentes y memoria del agua.",
        "Bridges and water memory.",
      ),
    ],
    source: "https://mexicocity.cdmx.gob.mx/locations/alvaro-obregon/",
  },
  {
    id: "09004",
    name: "Cuajimalpa de Morelos",
    region: c("Poniente montañoso", "Mountainous west"),
    hook: c(
      "El bosque también es Ciudad de México.",
      "The forest is Mexico City too.",
    ),
    memory: c(
      "En el borde poniente, la ciudad sube. Santa Fe no explica por sí sola los pueblos y bosques de Cuajimalpa.",
      "On the western edge, the city climbs. Santa Fe alone cannot explain Cuajimalpa’s towns and forests.",
    ),
    today: c(
      "El Desierto de los Leones se extiende por Cuajimalpa y Álvaro Obregón. Aquí «desierto» no significa un paisaje de arena.",
      "Desierto de los Leones spans Cuajimalpa and Álvaro Obregón. Here, “desert” does not mean a sandy landscape.",
    ),
    transit: c(
      "El Metro no llega a todos los bosques y pueblos. Ubica el enlace urbano y planea por separado el tramo por superficie.",
      "Metro does not reach every forest and town. Locate an urban connection and plan the surface leg separately.",
    ),
    anchors: [
      a(
        "Cuajimalpa centro",
        -99.291,
        19.357,
        "El pueblo, además de las torres.",
        "The town, beyond the towers.",
      ),
      a(
        "Desierto de los Leones",
        -99.313,
        19.313,
        "Bosque compartido por dos alcaldías.",
        "Forest shared by two boroughs.",
      ),
      a(
        "Santa Fe",
        -99.269,
        19.36,
        "Una zona que rebasa un límite administrativo.",
        "An area crossing an administrative boundary.",
      ),
    ],
    source:
      "https://proyectos.sedema.cdmx.gob.mx/anp/assets/pages/desierto.php",
    extra: "zones",
  },
  {
    id: "09008",
    name: "La Magdalena Contreras",
    region: c("Suroeste", "Southwest"),
    hook: c(
      "Un río entre fábricas y bosque.",
      "A river between mills and forest.",
    ),
    memory: c(
      "Busca el corredor del río Magdalena y Los Dinamos, al suroeste del mapa.",
      "Find the Magdalena river corridor and Los Dinamos in the southwest.",
    ),
    today: c(
      "La energía del agua alimentó actividad industrial. Los nombres y vestigios de Los Dinamos permiten leer ese vínculo.",
      "Water power supported industry. The names and remains at Los Dinamos make that connection visible.",
    ),
    transit: c(
      "La llegada requiere transporte de superficie. Un mapa del Metro por sí solo no explica este territorio.",
      "Getting here requires surface transport. A Metro map alone cannot explain this territory.",
    ),
    anchors: [
      a(
        "Los Dinamos",
        -99.258,
        19.281,
        "Agua, bosque e industria.",
        "Water, forest and industry.",
      ),
      a(
        "La Magdalena",
        -99.241,
        19.309,
        "Pueblo y corredor del río.",
        "Town and river corridor.",
      ),
      a(
        "San Jerónimo Lídice",
        -99.224,
        19.324,
        "Otra referencia del suroeste.",
        "Another southwestern reference.",
      ),
    ],
    source: "https://mexicocity.cdmx.gob.mx/locations/magdalena-contreras/",
  },
  {
    id: "09012",
    name: "Tlalpan",
    region: c("Sur y montaña", "South and mountains"),
    hook: c(
      "Una pirámide antes de Tenochtitlan.",
      "A pyramid before Tenochtitlan.",
    ),
    memory: c(
      "Cuicuilco y el centro de Tlalpan están en el extremo urbano norte de una alcaldía que se extiende hacia el Ajusco.",
      "Cuicuilco and Tlalpan’s center sit at the urban northern end of a borough extending toward the Ajusco.",
    ),
    today: c(
      "La arquitectura circular de Cuicuilco y la roca volcánica rompen la idea de que toda historia empieza con los mexicas.",
      "Cuicuilco’s circular architecture and volcanic rock challenge the idea that every story starts with the Mexica.",
    ),
    transit: c(
      "El Metro no llega al Ajusco. Distingue una conexión urbana del viaje posterior hacia la montaña.",
      "Metro does not reach the Ajusco. Distinguish an urban connection from the onward mountain journey.",
    ),
    anchors: [
      a(
        "Cuicuilco",
        -99.183,
        19.301,
        "Un centro urbano mucho más antiguo.",
        "A much earlier urban center.",
        "cuicuilco",
      ),
      a(
        "Tlalpan centro",
        -99.166,
        19.288,
        "El pueblo dentro de la alcaldía.",
        "The town within the borough.",
      ),
      a(
        "Ajusco",
        -99.258,
        19.207,
        "La ciudad también tiene montaña.",
        "The city includes mountains too.",
      ),
    ],
    source: "https://mexicocity.cdmx.gob.mx/locations/tlalpan/",
    extra: "cuicuilcoMuseum",
  },
  {
    id: "09013",
    name: "Xochimilco",
    region: c("Sur lacustre", "Lake country to the south"),
    hook: c(
      "El agua todavía se cultiva.",
      "Water still supports a working landscape.",
    ),
    memory: c(
      "Al sur de Coyoacán y al oeste de Tláhuac. Canales, chinampas y pueblos: recuerda las tres piezas.",
      "South of Coyoacán and west of Tláhuac. Canals, chinampas and towns: remember all three.",
    ),
    today: c(
      "Las chinampas son suelo cultivado, no jardines flotantes sueltos. Hay trabajo agrícola y vida comunitaria más allá del paseo en trajinera.",
      "Chinampas are cultivated ground, not loose floating gardens. Farming and community life extend beyond a trajinera trip.",
    ),
    transit: c(
      "Desde Tasqueña, el Tren Ligero continúa hacia Xochimilco. Es otro sistema, no otra línea del Metro.",
      "From Tasqueña, light rail continues toward Xochimilco. It is another system, not another Metro line.",
    ),
    anchors: [
      a(
        "San Bernardino",
        -99.104,
        19.258,
        "El centro y sus barrios.",
        "The center and its neighborhoods.",
      ),
      a(
        "Zona chinampera",
        -99.094,
        19.279,
        "Un paisaje de trabajo.",
        "A working landscape.",
      ),
      a(
        "Xochitepec",
        -99.134,
        19.255,
        "Un nombre que leeremos en náhuatl.",
        "A place name we will read in Nahuatl.",
      ),
    ],
    source: "https://www.mexicocity.cdmx.gob.mx/locations/xochimilco/?lang=en",
    extra: "light",
  },
  {
    id: "09011",
    name: "Tláhuac",
    region: c("Sureste lacustre", "Southeastern lake country"),
    hook: c(
      "La orilla se convirtió en ciudad, pero no sólo en ciudad.",
      "The shore became urban, but not entirely.",
    ),
    memory: c(
      "Al oriente de Xochimilco y al norte de Milpa Alta. Une San Pedro, Mixquic y los paisajes agrícolas.",
      "East of Xochimilco and north of Milpa Alta. Connect San Pedro, Mixquic and farming landscapes.",
    ),
    today: c(
      "Los pueblos lacustres no son una decoración del pasado. Mixquic tiene vida cotidiana todo el año, más allá del Día de Muertos.",
      "Lake communities are not decorations from the past. Mixquic has everyday life throughout the year, beyond Day of the Dead.",
    ),
    transit: c(
      "La línea 12 termina en Tláhuac. Eso no significa que llegue a todos sus pueblos: distingue estación y territorio.",
      "Line 12 ends at Tláhuac. It does not reach all its towns: distinguish the station from the territory.",
    ),
    anchors: [
      a(
        "San Pedro Tláhuac",
        -99.004,
        19.276,
        "El antiguo núcleo lacustre.",
        "The old lake settlement.",
      ),
      a(
        "San Andrés Mixquic",
        -98.965,
        19.225,
        "Un pueblo vivo todo el año.",
        "A living town year-round.",
      ),
      a(
        "San Juan Ixtayopan",
        -98.996,
        19.233,
        "Campo y pueblos del sureste.",
        "Fields and southeastern towns.",
      ),
    ],
    source: "https://www.mexicocity.cdmx.gob.mx/locations/tlahuac/?lang=en",
  },
  {
    id: "09009",
    name: "Milpa Alta",
    region: c("Extremo sur", "Far south"),
    hook: c("El sur también habla.", "The south has a living voice."),
    memory: c(
      "En el extremo sur: pueblos, campos y bosque. No confundas el borde del Metro con el borde de la ciudad.",
      "At the far south: towns, fields and forest. Do not confuse the edge of Metro with the edge of the city.",
    ),
    today: c(
      "El náhuatl pertenece también al presente. La agricultura, la organización comunitaria y la lengua forman parte de este territorio.",
      "Nahuatl belongs to the present too. Farming, community organization and language are part of this territory.",
    ),
    transit: c(
      "No hay Metro dentro de Milpa Alta. El enlace final es de superficie; verifica la ruta antes de salir.",
      "There is no Metro within Milpa Alta. The last leg is by surface transport; check your route before leaving.",
    ),
    anchors: [
      a(
        "Villa Milpa Alta",
        -99.024,
        19.192,
        "Un punto de entrada a los pueblos.",
        "An entry point to the towns.",
        "milpa",
      ),
      a(
        "San Pablo Oztotepec",
        -99.07,
        19.185,
        "Memoria zapatista.",
        "Zapatista memory.",
      ),
      a(
        "San Pedro Atocpan",
        -99.049,
        19.2,
        "Agricultura y vida de pueblo.",
        "Farming and town life.",
      ),
    ],
    source: "https://mexicocity.cdmx.gob.mx/locations/milpa-alta/",
    extra: "milpa",
  },
];
export const VOCABULARY = [
  ...WORDS,
  {
    word: "tlalli",
    meaning: c("tierra o suelo", "earth or soil"),
    hint: c(
      "El suelo que pisas también tiene nombre.",
      "The ground under your feet has a name too.",
    ),
    source: "https://gdn.iib.unam.mx/diccionario/tlalli",
  },
  {
    word: "calli",
    meaning: c("casa", "house"),
    hint: c(
      "Una palabra para mirar lo cotidiano.",
      "A word for noticing the everyday.",
    ),
    source: "https://gdn.iib.unam.mx/diccionario/calli/16740",
  },
  {
    word: "metl",
    meaning: c("maguey", "maguey"),
    hint: c(
      "Una planta, muchas relaciones con el paisaje.",
      "One plant, many connections to the landscape.",
    ),
    source: "https://gdn.iib.unam.mx/diccionario/metl/279022",
  },
];
export { PLACE_PUZZLES };
export const borough = (id: string) => BOROUGHS.find((b) => b.id === id);
