"use client";
import Link from "next/link";
import {
  LocaleProvider,
  LanguageSwitch,
  useLocale,
} from "@/lib/mexico-city/locale";
import GameName from "./GameName";
import Artwork from "./Artwork";
import type { Copy } from "@/lib/mexico-city/field-game";
const chapters: { title: Copy; paragraphs: Copy[] }[] = [
  {
    title: ["01 / El juego ocurre afuera", "01 / The game happens outside"],
    paragraphs: [
      [
        "La ciudad es el tablero. El teléfono da una excusa para salir, ayuda a orientarse y guarda lo que pasó. Una buena sesión termina con una experiencia real: una calle nueva, una foto, un sabor, una conversación. Leer y contestar quizzes es opcional.",
        "The city is the board. The phone provides a reason to head out, helps with orientation and keeps a record. A good session ends with a real experience: a new street, a photo, a flavour, a conversation. Reading and quizzes are optional.",
      ],
      [
        "La primera comunidad somos Susy y Stepan. La prioridad es que podamos retarnos, salir, revisar nuestras fotos y construir una bitácora juntos. Mexico city discovery game es una referencia de trabajo; todavía no es una marca definitiva.",
        "The first community is Susy and Stepan. The priority is to challenge each other, go outside, review our photos and build a logbook together. Mexico city discovery game is a working reference, not a final brand.",
      ],
    ],
  },
  {
    title: [
      "02 / De la puerta de entrada a la calle",
      "02 / From the front door to the street",
    ],
    paragraphs: [
      [
        "/mexico-city presenta la propuesta y ofrece Entrar al juego, Probar sin cuenta y este documento. /mexico-city/play contiene la experiencia del juego. La sesión de Fruitful Lab se reutiliza; el formulario de correo y contraseña vive dentro de la interfaz del juego. Una cuenta nueva pertenece a la misma base de usuarios, sin permisos internos.",
        "/mexico-city introduces the idea and offers Enter the game, Try without an account and this document. /mexico-city/play contains the game experience. It reuses the Fruitful Lab session; email/password forms live inside the game. New accounts use the same user database without internal privileges.",
      ],
      [
        "Inicio propone una salida concreta y da acceso a los retos pendientes. La navegación inferior siempre muestra Inicio, Aventura, Amigos y Comunidad. La bitácora y la cuenta están a un toque. Los detalles se abren sobre el mapa; al cerrar, conservas la posición y la escala.",
        "Home suggests a concrete outing and leads to pending challenges. Bottom navigation always shows Home, Adventure, Friends and Community. The logbook and account are one tap away. Details open over the map; closing them preserves its position and scale.",
      ],
      [
        "En móvil usamos pantalla completa del navegador, áreas seguras, controles grandes y un panel inferior ampliable. En escritorio, el panel pasa a un costado. No hace falta instalar una app. GPS se solicita al tocar Ubicarme; siempre puedes colocar el pin a mano.",
        "On mobile we use the browser viewport, safe areas, large controls and an expandable bottom panel. On desktop the panel moves to the side. No installation required. GPS is requested when you tap Locate me; manual pin placement is always available.",
      ],
    ],
  },
  {
    title: [
      "03 / Aventura: tu mirada de la ciudad",
      "03 / Adventure: your view of the city",
    ],
    paragraphs: [
      [
        "Con cuenta, guardas metas, hallazgos, fotos, puntos personales y aprendizaje. Puedes escoger una salida preparada o registrar algo inesperado. Las categorías iniciales son arte callejero, sabores, libros, naturaleza e historia. Una sugerencia responde a patrones visibles de tu bitácora sin fingir que conocemos meses de hábitos que todavía no hemos registrado.",
        "With an account, goals, discoveries, photos, personal points and learning persist. Choose a prepared outing or record an unexpected discovery. Initial categories are street art, food, books, nature and history. Suggestions respond to visible logbook patterns without pretending to know months of habits we haven’t recorded.",
      ],
      [
        "Probar sin cuenta es una salida individual completa: elegir, salir, tomar foto, ubicar, guardar y ver el cierre. Todo vive en memoria; al recargar o cerrar se pierde. Entrar después abre tu aventura guardada, sin subir automáticamente las fotos de la prueba.",
        "Try without an account is a complete solo outing: choose, head out, photograph, locate, record and finish. Everything is in memory; reloading or closing loses it. Signing in afterwards opens your saved adventure without automatically uploading trial photos.",
      ],
    ],
  },
  {
    title: ["04 / Retos entre amigos", "04 / Challenges with friends"],
    paragraphs: [
      [
        "Una persona crea un grupo privado y comparte un enlace o código. Cualquiera con esa invitación puede entrar; el prototipo permite hasta ocho personas. Los grupos tienen su propio marcador y su bitácora compartida. No compites automáticamente contra toda la ciudad.",
        "One person creates a private group and shares a link or code. Anyone holding the invitation can join; the prototype allows up to eight members. Groups have their own scoreboard and shared logbook. You don’t automatically compete against the whole city.",
      ],
      [
        "Tu rival propone una tarea, una categoría, un plazo y lo que está en juego. El reloj arranca al aceptar, no al recibirla. Declinar no cuesta puntos. Plazos de prueba: 10 minutos, una hora o 24 horas. Premios: 50, 100 o 150; pérdidas: 0, 25 o 50. Son valores para jugar y ajustar, no una economía definitiva.",
        "Your friend proposes a task, category, deadline and stakes. The clock starts on acceptance, not delivery. Declining costs nothing. Trial durations: 10 minutes, one hour or 24 hours. Rewards: 50, 100 or 150; losses: 0, 25 or 50. These are values to play with and tune, not a final economy.",
      ],
      [
        "Foto y lugar forman la evidencia. Quien propuso el reto confirma o pide un detalle. No puedes confirmarte a ti mismo. Una entrega recibida a tiempo espera revisión sin perder puntos por la demora del rival. Cada reto se liquida una sola vez; el servidor decide permisos y plazos.",
        "A photo and place form the evidence. The person who proposed the challenge confirms it or asks for a detail. You cannot confirm yourself. Evidence received on time waits for review without a penalty for the reviewer’s delay. Each challenge settles once; the server enforces permissions and deadlines.",
      ],
      [
        "Hagámoslo juntos exige una foto de cada persona, entregada a tiempo, y confirmación cruzada. Ambos ganan el premio. Si falta una entrega al vencer, la salida queda incompleta, sin penalización. La carta de cambio pausa nuevos retos de una categoría durante 24 horas; no cancela retos aceptados ni bloquea tu bitácora.",
        "Let’s do it together requires a photo from each person, submitted on time, and cross-confirmation. Both earn the reward. If a submission is missing at expiry, the outing is incomplete with no penalty. A change-of-plan card pauses new challenges in one category for 24 hours; it does not cancel accepted challenges or block your logbook.",
      ],
    ],
  },
  {
    title: ["05 / Pinta la ciudad", "05 / Paint the city"],
    paragraphs: [
      [
        "Mi grupo reúne los hallazgos vinculados a sus retos. Toda CDMX muestra contribuciones públicas aprobadas, una meta colectiva y una clasificación global propia. La bitácora de la ciudad es el nombre funcional del conjunto de hallazgos: fotos y experiencias de personas reales, no un directorio inventado.",
        "My group gathers discoveries attached to your challenges. All CDMX shows approved public contributions, a collective goal and its own global ranking. The city logbook is the functional name for the discoveries: photos and experiences from real people, not an invented directory.",
      ],
      [
        "Guardar, adjuntar a un reto y publicar son decisiones distintas. Una contribución pública incluye nombre, foto, texto y pin, y requiere una elección explícita y revisión. Confirmar un reto nunca publica su foto por sí solo. En esta prueba la revisión pública la hace una cuenta administradora distinta del autor.",
        "Saving, attaching to a challenge and publishing are separate decisions. A public contribution includes name, photo, text and pin, and requires an explicit choice and review. Confirming a challenge never publishes its photo automatically. In this prototype, public review is performed by an administrator other than the author.",
      ],
      [
        "La meta inicial invita a encontrar cinco miradas de CDMX, una por categoría. Las aportaciones colorean sus zonas y se reflejan en el progreso compartido. El experimento comunitario anónimo más amplio sigue en el horizonte; ahora puedes explorar las propuestas sin cuenta, pero publicar exige una cuenta.",
        "The first collective goal invites five perspectives on CDMX, one per category. Contributions colour their areas and add to shared progress. The broader anonymous community experiment remains a future direction; today you can explore prompts without an account, but publishing requires one.",
      ],
    ],
  },
  {
    title: [
      "06 / Un mapa que responde como esperas",
      "06 / A map that responds as expected",
    ],
    paragraphs: [
      [
        "La base recomendada es Google Maps JavaScript, en vector. Google mantiene el mapa base; nosotros controlamos la composición, los pines ilustrados, las fotos, los retos, las capas y los paneles. Deslizar mueve el mapa, pellizcar acerca, tocar un pin abre su lugar. Ciudad, alcaldía, colonia y lugar son escalas continuas, no pantallas inconexas.",
        "The recommended foundation is vector Google Maps JavaScript. Google maintains the basemap; we control composition, illustrated pins, photos, challenges, layers and panels. Drag to move, pinch to zoom, tap a pin to open its place. City, borough, neighborhood and place are continuous scales rather than disconnected screens.",
      ],
      [
        "Las capas del juego incluyen alcaldías, colonias, Metro, Cablebús e historia. La red de transporte conservada es una referencia fechada, no información de servicio en vivo. El plano histórico de 1524 se presenta como documento, sin simular una alineación exacta con calles actuales. La ubicación aparece con su precisión aproximada y deja de seguirte cuando exploras manualmente.",
        "Game layers include boroughs, neighborhoods, Metro, Cablebús and history. Retained transit data is a dated reference, not live service information. The 1524 historical map is presented as a document, without pretending it aligns precisely with today’s streets. Your position includes approximate accuracy and stops following when you explore manually.",
      ],
      [
        "Sin configuración de Google o si falla la carga, sigue funcionando un mapa geográfico propio con arrastre, zoom, etiquetas y pines. Se identifica como referencia de octubre de 2026. No afirma tener comercios actualizados, tráfico ni navegación en vivo. La búsqueda inicial encuentra historias y hallazgos del juego; Cómo llegar abre Google Maps a pie o en transporte.",
        "Without Google configuration, or if loading fails, our geographic map still supports dragging, zooming, labels and pins. It is identified as an October 2026 reference. It does not claim current businesses, traffic or live navigation. Initial search finds game stories and discoveries; Directions opens Google Maps for walking or transit.",
      ],
      [
        "MapLibre con un proveedor de cartografía ofrece gran libertad visual, pero exige contratar y coordinar búsqueda y rutas. Un mapa dibujado desde cero permite narrar, pero no reemplaza cobertura geográfica mantenida. Conservamos el atlas ilustrado para aprender; la exploración usa geografía real. Búsqueda global de lugares y rutas dibujadas dentro del juego son ampliaciones separadas, con sus propias APIs y condiciones.",
        "MapLibre with a map-data provider offers substantial visual freedom but requires separate search and routing services. A hand-drawn map can tell a story but does not replace maintained geographic coverage. We keep the illustrated atlas for learning; exploration uses real geography. Global place search and in-game route rendering are separate extensions with their own APIs and terms.",
      ],
    ],
  },
  {
    title: [
      "07 / Del lago a la ciudad que pisamos",
      "07 / From the lake to the city underfoot",
    ],
    paragraphs: [
      [
        "El primer capítulo explica la forma de la ciudad desde el sistema de lagos, Texcoco, Tenochtitlan y sus calzadas. Conecta el centro histórico con el poniente, el sur lacustre, las alcaldías y las redes de transporte. Incluye Metro, Cablebús y orientación para los aeropuertos, con fuentes de los operadores.",
        "The first chapter explains the city’s form through the lake system, Texcoco, Tenochtitlan and its causeways. It connects the historic centre with the west, the lake-linked south, boroughs and transit networks. It includes Metro, Cablebús and airport orientation, with operator sources.",
      ],
      [
        "Historias breves en cuatro escenas combinan ilustración, fotos de archivo, fotos modernas, citas y una invitación a mirar afuera. El Zócalo, Ehécatl, el Monumento a la Revolución y Chapultepec son los primeros lugares. Las imágenes generadas se identifican como interpretaciones; los documentos mantienen autoría, licencia y fuente.",
        "Short four-scene stories combine illustration, archive photos, modern photos, quotes and a prompt to look outside. The Zócalo, Ehécatl, the Monument to the Revolution and Chapultepec are the first places. Generated images are identified as interpretations; documentary images retain attribution, licence and source.",
      ],
      [
        "Aprender náhuatl acompaña la exploración: atl, tepetl, xochitl, milli y ehecatl, más juegos de reconocimiento y formación de topónimos. Los quizzes de ciudad y lengua dan puntos personales una vez por actividad. No son requisito para salir ni multiplican el marcador competitivo.",
        "Learning Nahuatl accompanies exploration: atl, tepetl, xochitl, milli and ehecatl, plus recognition and place-name building games. City and language quizzes award personal points once per activity. They are not a prerequisite for heading out and do not multiply competitive scores.",
      ],
    ],
  },
  {
    title: [
      "08 / Identidad, composición y movimiento",
      "08 / Identity, composition and motion",
    ],
    paragraphs: [
      [
        "Fondo blanco, tinta verde profunda, coral para las acciones y verdes suaves para el territorio. Tipografía editorial grande para invitar a salir; texto breve y claro para actuar bajo el sol. Ilustraciones de trazo y acuarela, fotos como recuerdos, sellos discretos y números legibles. Evitamos convertir el juego en una cuadrícula de tarjetas administrativas.",
        "White backgrounds, deep green ink, coral actions and soft greens for territory. Large editorial type invites exploration; short, clear text supports action outdoors. Sketch-and-watercolour illustrations, photos as keepsakes, quiet stamps and readable numbers. The game should not become a grid of administrative cards.",
      ],
      [
        "El mapa es la superficie continua. El panel se despliega sin reiniciar la cámara; registrar abre una tarea corta y colocar el pin vuelve al mismo mapa conservando el borrador. Movimiento breve comunica cambio de escala, selección y recompensa. Se respeta la preferencia de movimiento reducido. Los iconos tienen nombre accesible, los formularios etiquetas y los diálogos manejo de foco.",
        "The map is the continuous surface. Expanding the panel does not reset the camera; recording opens a short task and pin placement returns to the same map with the draft intact. Brief motion communicates scale, selection and reward. Reduced-motion preferences are respected. Icons have accessible names, forms have labels and dialogs manage focus.",
      ],
    ],
  },
  {
    title: [
      "09 / Qué guarda y qué cuenta",
      "09 / What persists and what counts",
    ],
    paragraphs: [
      [
        "La cuenta usa el token de Fruitful Lab y /auth/me como fuente de identidad. El backend guarda perfiles, grupos, retos y hallazgos. Las fotos se reducen, se convierten a JPEG y pierden sus metadatos. Para esta prueba acotada se guardan en la base de datos con acceso privado; para crecer, pasarán a almacenamiento de objetos.",
        "Accounts use the Fruitful Lab token and /auth/me as identity authority. The backend stores profiles, groups, challenges and discoveries. Photos are resized, converted to JPEG and stripped of metadata. This bounded prototype stores them privately in the database; expansion will require object storage.",
      ],
      [
        "Hay tres contadores distintos: +30 por hallazgo personal; premio o pérdida por reto en su grupo; +30 por contribución pública aprobada en la clasificación global. Leer el mapa no da puntos. Los quizzes suman una vez a la aventura. El cliente nunca envía un total de puntos: se calcula a partir de registros y resultados.",
        "There are three distinct counters: +30 per personal discovery; reward or loss per group challenge; +30 per approved public contribution in global rankings. Viewing the map gives no points. Quizzes add once to the adventure. The client never submits a point total: it is derived from records and outcomes.",
      ],
      [
        "La demo de todos los modos permite alternar entre Susy y Stepan para ensayar el flujo. Se etiqueta como ejemplo, vive en memoria y no escribe en cuentas reales. La prueba sin cuenta es otra modalidad: solo una salida personal, sin simular rivales ni persistencia.",
        "The all-modes demo lets you switch between Susy and Stepan to rehearse the flow. It is labelled as sample data, stays in memory and never writes to real accounts. The guest trial is separate: one personal outing, without pretending to provide opponents or persistence.",
      ],
    ],
  },
  {
    title: [
      "10 / Validación y siguientes decisiones",
      "10 / Verification and next decisions",
    ],
    paragraphs: [
      [
        "Para jugar entre dos dispositivos, deben desplegarse el backend y su migración. Google necesita Maps JavaScript API, una clave restringida a nuestros dominios y un map ID vectorial. Sin esas dependencias, la demo y el mapa de referencia siguen siendo utilizables; un error de conexión no se presenta como un guardado exitoso.",
        "Two-device play requires deployment of the backend and its migration. Google needs Maps JavaScript API, a domain-restricted key and a vector map ID. Without those dependencies, the demo and reference map remain usable; connection failures are never presented as successful saves.",
      ],
      [
        "La aceptación se comprueba con dos cuentas: crear grupo, invitar, aceptar, enviar foto y pin, revisar desde la otra cuenta, recargar y conservar el resultado. También probamos duplicados, vencimientos, privacidad, publicación, denegación de GPS y sesiones temporales. La calidad móvil se revisa en tamaños pequeños y grandes, con teclado y en ambos idiomas.",
        "Acceptance is checked with two accounts: create a group, invite, accept, submit a photo and pin, review from the other account, reload and retain the result. We also test duplicates, expiry, privacy, publication, denied GPS and temporary sessions. Mobile quality is reviewed at small and large sizes, with a keyboard and in both languages.",
      ],
      [
        "Antes de una comunidad abierta: moderación más amplia, denuncia y retirada, límites de abuso, política de retención, invitaciones revocables y eliminación de cuenta. Más adelante: rutas integradas, búsqueda de lugares del proveedor, recomendaciones más profundas, notificaciones, temporadas y el experimento colectivo anónimo. Ninguna de estas ampliaciones se confunde con lo que ya funciona en la prueba.",
        "Before an open community: broader moderation, reporting and removal, abuse limits, retention policy, revocable invitations and account deletion. Later: integrated routes, provider place search, deeper recommendations, notifications, seasons and the anonymous collective experiment. These extensions are kept distinct from what works in the prototype.",
      ],
    ],
  },
];
function Content() {
  const { locale } = useLocale();
  const copy = (s: Copy) => s[locale === "es" ? 0 : 1];
  return (
    <main
      className="mc-landing mc-design"
      lang={locale === "es" ? "es-MX" : "en"}
    >
      <header>
        <Link href="/mexico-city" className="mc-brand">
          <GameName />
        </Link>
        <LanguageSwitch />
      </header>
      <section className="mc-design-intro">
        <div>
          <p className="mc-eyebrow">
            {copy([
              "Especificación de experiencia · 10 octubre 2026",
              "Experience specification · 10 October 2026",
            ])}
          </p>
          <h1>{copy(["La ciudad es el juego.", "The city is the game."])}</h1>
          <p>
            {copy([
              "Una propuesta completa para salir, descubrir, retarnos y guardar nuestra propia ciudad.",
              "A complete proposal to head out, discover, challenge each other and keep our own city.",
            ])}
          </p>
          <div className="mc-button-pair">
            <Link className="mc-primary" href="/mexico-city/play?demo=1">
              {copy(["Jugar la demo completa", "Play the full demo"])} ↗
            </Link>
            <Link className="mc-secondary" href="/mexico-city/play">
              {copy(["Entrar con mi cuenta", "Sign in"])} ↗
            </Link>
          </div>
        </div>
        <Artwork id="chapultepec" sizes="(max-width:700px) 250px, 420px" />
      </section>
      <nav
        className="mc-design-toc"
        aria-label={copy(["Contenido del diseño", "Design contents"])}
      >
        {chapters.map((c, i) => (
          <a key={i} href={`#chapter-${i}`}>
            {copy(c.title)}
          </a>
        ))}
      </nav>
      <div className="mc-design-body">
        {chapters.map((c, i) => (
          <section id={`chapter-${i}`} key={i}>
            <h2>{copy(c.title)}</h2>
            {c.paragraphs.map((p, j) => (
              <p key={j}>{copy(p)}</p>
            ))}
          </section>
        ))}
      </div>
      <footer>
        <Link href="/mexico-city/atlas">
          {copy([
            "Atlas, fotografías y fuentes mexicanas",
            "Atlas, photographs and Mexican sources",
          ])}{" "}
          ↗
        </Link>
        <a href="https://developers.google.com/maps/documentation/javascript/advanced-markers/overview">
          Google Maps · Advanced Markers ↗
        </a>
        <a href="https://developers.google.com/maps/documentation/javascript/map-ids/get-map-id">
          Google Maps · Map IDs ↗
        </a>
      </footer>
    </main>
  );
}
export default function ExperienceDesign() {
  return (
    <LocaleProvider>
      <Content />
    </LocaleProvider>
  );
}
