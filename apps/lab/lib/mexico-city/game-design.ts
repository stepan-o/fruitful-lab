// Spanish first. Paired copy keeps this design reference complete in both languages.
export type DesignCopy = readonly [es: string, en: string];
type Entry = { title: DesignCopy; body: DesignCopy };

export const designNavigation: { id: string; label: DesignCopy }[] = [
  { id: "principio", label: ["La idea", "The idea"] },
  { id: "juego", label: ["El juego", "The game"] },
  { id: "mapa", label: ["La ciudad", "The city"] },
  { id: "identidad", label: ["Identidad", "Identity"] },
  { id: "estructura", label: ["La app", "The app"] },
  { id: "futuro", label: ["Después", "Later"] },
  { id: "decisiones", label: ["Por decidir", "Open questions"] },
];

export const fieldLoop: Entry[] = [
  {
    title: ["Recibe un reto", "Get a challenge"],
    body: [
      "Tu rival te propone algo que hacer. Ves la tarea, el tiempo y lo que está en juego.",
      "Your opponent gives you something to do. The task, deadline and stakes are clear.",
    ],
  },
  {
    title: ["Sal a descubrir", "Go explore"],
    body: [
      "Mira, prueba, visita, conversa. Puede ser un lugar del mapa o un hallazgo inesperado.",
      "Notice, try, visit, talk. Follow a map prompt or make an unexpected discovery.",
    ],
  },
  {
    title: ["Guarda el hallazgo", "Keep the discovery"],
    body: [
      "Una foto, un lugar, una categoría y la fecha. Si quieres, cuenta qué te llamó la atención.",
      "A photo, a place, a category and a date. Add what caught your eye if you like.",
    ],
  },
  {
    title: ["Confirmen y sumen", "Review and score"],
    body: [
      "La otra persona revisa la evidencia. El resultado mueve el marcador; el recuerdo se queda contigo.",
      "The other player reviews the evidence. The outcome changes the score; the memory stays yours.",
    ],
  },
];

export const playKinds: (Entry & { mark: string; tag: DesignCopy })[] = [
  {
    mark: "01",
    tag: ["Una dirección", "A direction"],
    title: ["Meta", "Goal"],
    body: [
      "Le da sentido a la salida o a la ronda: descubrir una cara nueva del barrio. Los puntos responden a objetivos; subir una foto, por sí solo, no da puntos.",
      "Gives the outing or round a purpose: discover another side of a neighborhood. Points follow objectives; uploading a photo alone earns nothing.",
    ],
  },
  {
    mark: "02",
    tag: ["Una apuesta", "Something at stake"],
    title: ["Reto", "Challenge"],
    body: [
      "Tu rival elige una tarea o un conjunto de opciones, con plazo, premio y posible pérdida. Puedes completarla o decidir sacrificar los puntos.",
      "Your opponent chooses a task or a set of alternatives, with a deadline, reward and possible loss. Complete it or choose to sacrifice the points.",
    ],
  },
  {
    mark: "03",
    tag: ["Un giro", "A twist"],
    title: ["Comodín", "Wildcard"],
    body: [
      "Cambia temporalmente lo que puede puntuar. Por ejemplo: hoy no cuentan nuevos retos de librerías. Los recuerdos se pueden seguir guardando.",
      "Temporarily changes what can score. For example: no new bookstore scoring challenges today. You can still keep those memories.",
    ],
  },
];

export const challengeScenes: (Entry & {
  id: string;
  label: DesignCopy;
  score: string;
  scoreLabel: DesignCopy;
})[] = [
  {
    id: "offer",
    label: ["Oferta", "Offer"],
    title: ["Todavía no corre el reloj.", "The clock has not started."],
    body: [
      "Propuesta para probar: fuera de una ventana de juego acordada, el reto espera como oferta. Recibirlo o iniciar sesión no activa una penalización.",
      "Trial proposal: outside an agreed play window, the challenge waits as an offer. Receiving it or signing in does not trigger a penalty.",
    ],
    score: "0",
    scoreLabel: ["Sin compromiso activo", "No active commitment"],
  },
  {
    id: "active",
    label: ["En juego", "Active"],
    title: ["Ya sabes qué te estás jugando.", "You know what is at stake."],
    body: [
      "Dentro de la ventana acordada, el reto puede activarse con sus reglas fijas. Se muestran el plazo para hacerlo, el límite de entrega y cualquier margen para subir la foto.",
      "Within the agreed window, the challenge can activate with fixed rules. Show the action deadline, evidence cutoff and any upload grace period.",
    ],
    score: "0",
    scoreLabel: ["+100 o −100 al resolver", "+100 or −100 on settlement"],
  },
  {
    id: "submitted",
    label: ["Por confirmar", "Awaiting review"],
    title: [
      "Entregaste a tiempo. Ahora toca revisar.",
      "Submitted on time. Review comes next.",
    ],
    body: [
      "La foto y el lugar llegaron antes del límite. Esperar la respuesta de tu rival no te resta puntos. Si hay una duda, el resultado sigue pendiente hasta resolverla.",
      "The photo and place arrived before the cutoff. Waiting for your opponent cannot cost you points. A disputed result stays pending until it is resolved.",
    ],
    score: "0",
    scoreLabel: ["Pendiente, sin penalización", "Pending, no penalty"],
  },
  {
    id: "confirmed",
    label: ["Confirmado", "Confirmed"],
    title: ["Un hallazgo. Un resultado.", "One discovery. One outcome."],
    body: [
      "Tu rival confirma que la evidencia cumple el reto. Se suman 100 puntos una sola vez. Repetir la confirmación o agregar otra foto no duplica el premio.",
      "Your opponent confirms that the evidence meets the challenge. Add 100 points once. Repeating the approval or adding a photo cannot duplicate the reward.",
    ],
    score: "+100",
    scoreLabel: ["Resultado confirmado", "Confirmed outcome"],
  },
  {
    id: "expired",
    label: ["Sin entrega", "No submission"],
    title: [
      "También puedes dejar pasar un reto.",
      "You can also let a challenge go.",
    ],
    body: [
      "Si el reto activo termina sin una entrega válida, o decides abandonarlo, se aplica la pérdida anunciada una sola vez. Es una decisión de juego; el emisor no recibe esos puntos automáticamente.",
      "If an active challenge ends without eligible evidence, or you forfeit, apply its stated loss once. It is a game choice; the sender does not automatically receive those points.",
    ],
    score: "−100",
    scoreLabel: ["Pérdida de ejemplo", "Example loss"],
  },
];

export const playRules: Entry[] = [
  {
    title: ["Picar la curiosidad", "Nudge curiosity"],
    body: [
      "Los bloqueos rompen la rutina: otra categoría, otro tipo de hallazgo. Propuesta: un bloqueo a la vez, con vencimiento visible; nunca borra puntos ni invalida un reto ya activo.",
      "Blocks interrupt routine: a different category, a different discovery. Proposal: one block at a time, with a visible expiry; it never erases points or invalidates an active challenge.",
    ],
  },
  {
    title: ["Darle la vuelta", "Play a counter"],
    body: [
      "Para probar: pocas cartas por ronda, un reto competitivo activo por persona y un cambio de reto o escudo limitado. Mantener la sorpresa sin que mandar retos imposibles sea la mejor estrategia.",
      "For testing: a few cards per round, one active competitive challenge per player and a limited reroll or shield. Keep the surprise without making impossible-task spam the winning strategy.",
    ],
  },
  {
    title: ["Salir juntos también cuenta", "Going together counts too"],
    body: [
      "Un reto cooperativo puede premiar a ambos: vayan a un lugar nuevo para los dos. Primera variante propuesta: invitación con bono, sin castigo. Confeti breve, y a seguir afuera.",
      "A cooperative challenge can reward both: visit somewhere new to you both. First proposed variant: a bonus invitation with no penalty. A little confetti, then back outside.",
    ],
  },
];

export const mapScales: (Entry & {
  id: string;
  asset: string;
  kicker: DesignCopy;
})[] = [
  {
    id: "city",
    asset: "tenochtitlan-island",
    kicker: ["01 / Ciudad", "01 / City"],
    title: [
      "Entender la forma, no memorizarla.",
      "Understand its shape, not just its names.",
    ],
    body: [
      "El primer capítulo empieza en la cuenca y el lago de Texcoco, pasa por México-Tenochtitlan y sus calzadas, y conecta esa historia con las zonas y alcaldías actuales. Las fronteras de hoy no son las de la ciudad prehispánica.",
      "The opening chapter begins with the basin and Lake Texcoco, moves through Mexico-Tenochtitlan and its causeways, and connects that history to today’s areas and boroughs. Modern boundaries are not pre-Hispanic ones.",
    ],
  },
  {
    id: "borough",
    asset: "zocalo",
    kicker: ["02 / Alcaldía y zona", "02 / Borough and area"],
    title: [
      "Ubicar las piezas por sus relaciones.",
      "Locate places through their connections.",
    ],
    body: [
      "Dieciséis alcaldías como base real. Acercarse revela colonias, nombres y calles clave; el Metro se puede activar a distintas escalas. Cablebús y las conexiones a MEX, NLU y TLC ayudan a orientarse, sin prometer rutas ni servicio en vivo.",
      "Sixteen boroughs form the geographic base. Zooming reveals neighborhoods, names and key streets; Metro layers work across scales. Cablebús and connections to MEX, NLU and TLC support orientation, without claiming live routing or service.",
    ],
  },
  {
    id: "place",
    asset: "ehecatl",
    kicker: ["03 / Lugar", "03 / Place"],
    title: [
      "Una pista para mirar distinto.",
      "A clue that changes what you notice.",
    ],
    body: [
      "Cada lugar ofrece una historia y algo concreto que observar afuera. Los primeros puntos son Zócalo, Ehécatl en Pino Suárez, Monumento a la Revolución y Baños de Moctezuma. Las exploraciones propias podrán vivir fuera de estos puntos.",
      "Each place offers a story and something concrete to notice outside. The first pins are Zócalo, Ehécatl at Pino Suárez, Monumento a la Revolución and Baños de Moctezuma. Personal discoveries will extend beyond these authored pins.",
    ],
  },
  {
    id: "story",
    asset: "revolucion-past",
    kicker: [
      "04 / Historia y regreso a la calle",
      "04 / Story and back to the street",
    ],
    title: [
      "El detalle que te dan ganas de buscar.",
      "The detail you want to go find.",
    ],
    body: [
      "Hoy → antes → el giro de la historia → qué mirar o fotografiar. Relatos breves, sabrosos y con fuentes mexicanas, citas cortas y fotos de archivo y actuales. Los dibujos interpretan; las fotografías documentales llevan su crédito.",
      "Today → then → the surprising turn → what to notice or photograph. Short, lively stories with Mexican sources, brief quotes, and archival and modern photos. Drawings interpret; documentary images carry their credits.",
    ],
  },
];

export const visualRules: Entry[] = [
  {
    title: ["Aire y carácter", "Space and character"],
    body: [
      "Blanco como espacio de juego. Titulares editoriales grandes, serif con personalidad y texto de interfaz directo. Referencia actual: Georgia + Arial. Jerarquía y contraste antes que adornos.",
      "White space as part of the play surface. Large editorial headings, a distinctive serif and direct interface copy. Current reference: Georgia + Arial. Hierarchy and contrast before decoration.",
    ],
  },
  {
    title: ["Una ciudad dibujada", "A drawn city"],
    body: [
      "Grafito, tinta y acuarela de color contenido; siluetas reconocibles sobre geografía real. Los nueve dibujos generados pertenecen al mundo editorial y se identifican como interpretaciones.",
      "Graphite, ink and restrained watercolor; recognizable silhouettes anchored to real geography. The nine generated drawings belong to the editorial world and are identified as interpretations.",
    ],
  },
  {
    title: ["Movimiento con motivo", "Motion with a purpose"],
    body: [
      "La cámara cambia de escala; una carta llega; el resultado se confirma. La animación explica ese cambio y se detiene. Con movimiento reducido, la misma información sigue disponible.",
      "The camera changes scale; a card arrives; a result settles. Animation explains the change and stops. Reduced motion preserves the same information.",
    ],
  },
  {
    title: ["Para usar en la banqueta", "Made for the sidewalk"],
    body: [
      "Composición de juego, navegación breve y acciones al alcance de una mano. Texto legible bajo el sol, controles de al menos 44 px y un regreso sencillo desde la cámara. Leer más siempre es opcional al registrar.",
      "Game-like composition, short navigation paths and actions within one-handed reach. Daylight-readable text, controls at least 44 px across and an easy return from the camera. Recording never requires extra reading.",
    ],
  },
];

export const appSurfaces: Entry[] = [
  {
    title: ["Explorar", "Explore"],
    body: [
      "El mapa es la vista principal. Cerca de él: el reto activo, los puntos en juego, el plazo, los comodines y los resultados pendientes.",
      "The map is the main view. Beside it: the active challenge, stakes, deadline, wildcards and pending outcomes.",
    ],
  },
  {
    title: ["Registrar hallazgo", "Record a discovery"],
    body: [
      "Acción siempre a mano. Cámara o galería, lugar escrito o pin, categoría, fecha y nota opcional. GPS puede sugerir; no se exige ni demuestra presencia.",
      "Always within reach. Camera or library, a written place or pin, category, date and optional note. GPS may suggest a location; it is neither required nor proof of presence.",
    ],
  },
  {
    title: ["Retos", "Challenges"],
    body: [
      "Lanzar un reto, responder, jugar una carta, proponer algo juntos y revisar evidencia. Puntos confirmados separados de lo pendiente.",
      "Issue a challenge, respond, play a card, suggest a shared activity and review evidence. Confirmed scores stay separate from pending results.",
    ],
  },
  {
    title: ["Mi ciudad", "My city"],
    body: [
      "Bitácora visual, listas y mapa personal de lugares, experiencias, productos y encuentros. Un recuerdo permanece aunque no puntúe en la competencia.",
      "A visual journal, lists and a personal map of places, experiences, products and encounters. A memory remains even when it earns no battle points.",
    ],
  },
];

export const deliverySteps: Entry[] = [
  {
    title: ["Ahora · hacer real una partida", "Now · make one battle real"],
    body: [
      "Cuentas de Fruitful Lab, fotos guardadas por cuenta, reto con plazo, entrega, revisión mutua y puntos positivos o negativos una sola vez. Probar un bloqueo, una respuesta y un bono juntos.",
      "Fruitful Lab accounts, account-owned photos, a timed challenge, submission, peer review and once-only positive or negative outcomes. Test one block, one counter and one shared bonus.",
    ],
  },
  {
    title: ["Luego · salir a probarlo", "Next · take it outside"],
    body: [
      "Susy y Stepan juegan desde sus teléfonos. Afinar los retos, el registro y las reglas con salidas reales. La pregunta: ¿nos dieron ganas de descubrir algo y volver a jugar?",
      "Susy and Stepan play on their own phones. Refine challenges, recording and rules through real outings. The question: did this make us want to discover something and play again?",
    ],
  },
  {
    title: ["Después · abrir posibilidades", "Later · open possibilities"],
    body: [
      "Solo, comunidad, reflexiones personales, GPS y mejores recursos sin conexión según lo que aprendamos. Ninguno es requisito para disfrutar la primera partida de dos.",
      "Solo, community, personal reflections, GPS and stronger offline support as we learn. None is a requirement for enjoying the first two-person battle.",
    ],
  },
];

export const openDecisions: Entry[] = [
  {
    title: ["Quizzes y multiplicadores", "Quizzes and multipliers"],
    body: [
      "Stepan propone lectura y quizzes antes de algunas actividades, con multiplicadores grandes. A Susy no le gusta esa dinámica. Sigue abierto: reto de conocimiento opcional, pista, bono limitado o pregunta después de la salida. No hay acuerdo sobre requisitos ni multiplicadores.",
      "Stepan proposes reading and quizzes before some activities, with large multipliers. Susy dislikes that dynamic. Options remain open: an optional knowledge challenge, a clue, a capped bonus or a question after the outing. Prerequisites and multipliers are not agreed.",
    ],
  },
  {
    title: ["Equilibrio de la competencia", "Balancing the competition"],
    body: [
      "Cuánto se gana o pierde, cuánto dura un reto, cuántas cartas hay y qué contrajugadas se permiten. +100 / −100 es un ejemplo, no la economía final. Las reglas de desacuerdo necesitan una prueba con ambos.",
      "Rewards, losses, challenge length, card budgets and available counters. +100 / −100 is an example, not the final economy. Dispute rules need a trial with both players.",
    ],
  },
  {
    title: ["Nombre y «Atlas»", "Name and “Atlas”"],
    body: [
      "Mexico city discovery game es un nombre de trabajo. La dirección sigue siendo /mexico-city aunque cambie la marca. «Atlas» apareció al final de la conversación; falta aclarar qué significa antes de asignarle una función.",
      "Mexico city discovery game is a working name. The route stays /mexico-city even if the brand changes. “Atlas” came up at the end of the conversation; its meaning needs clarification before assigning it a feature.",
    ],
  },
];

export const references: (Entry & { url: string; name: string })[] = [
  {
    name: "Ingress",
    url: "https://support.ingress.com/hc/en-us/articles/41140422789147-Discover-Share-Missions",
    title: ["Misiones en lugares reales", "Missions in real places"],
    body: [
      "Referencia para agrupar paradas culturales y dar una intención a la salida.",
      "A reference for grouping cultural stops and giving an outing a purpose.",
    ],
  },
  {
    name: "TOEM",
    url: "https://www.somethingwemade.se/toem/",
    title: ["Observar y fotografiar", "Observe and photograph"],
    body: [
      "Referencia para hacer de la foto una respuesta a algo que notaste.",
      "A reference for making a photo a response to something you noticed.",
    ],
  },
  {
    name: "Carto",
    url: "https://blog.playstation.com/2020/07/01/introducing-carto-a-charming-innovative-puzzle-adventure-coming-to-ps4/",
    title: ["Un mapa que se siente vivo", "A map that feels alive"],
    body: [
      "Referencia de tactilidad. Aquí la geografía de la ciudad permanece real.",
      "A reference for tactility. Here, the city’s geography stays real.",
    ],
  },
  {
    name: "Discovery Tour",
    url: "https://www.ubisoft.com/en-us/game/assassins-creed/discovery-tour",
    title: ["Contexto en pequeñas dosis", "Context in small doses"],
    body: [
      "Referencia para relatos cortos con fuentes y un regreso claro al lugar.",
      "A reference for short sourced stories and a clear return to the place.",
    ],
  },
  {
    name: "Pokémon GO",
    url: "https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/84-what-is-the-map-view/?ticket_form_id=3",
    title: ["El mapa al centro", "The map at the center"],
    body: [
      "Referencia para situar identidad y progreso alrededor de la exploración.",
      "A reference for placing identity and progress around exploration.",
    ],
  },
];
