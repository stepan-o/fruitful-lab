import { c } from "./content";
export const NEW_STORIES = [
  {
    id: "viga",
    borough: "09006",
    title: c(
      "Aquí antes se llegaba en canoa",
      "People once arrived here by canoe",
    ),
    place: "La Viga · Iztacalco",
    date: "1877 → 2026",
    lead: c(
      "Antes de buscar un lugar para estacionarte, aquí habrías buscado dónde desembarcar.",
      "Before looking for somewhere to park, here you would have looked for somewhere to land.",
    ),
    paragraphs: [
      c(
        "El canal de la Viga enlazaba el sur lacustre con el abasto de la ciudad. En un plano de 1877 aparecen pueblos, puentes y garitas: el agua era una vía de circulación, también sometida a controles.",
        "La Viga linked the southern lake country with city supply. A plan from 1877 shows towns, bridges and checkpoints: water was a transport corridor, subject to controls too.",
      ),
      c(
        "Iztacalco y Santa Anita estaban en esa red. Cuando veas La Viga en un mapa actual, prueba cambiar mentalmente los autos por canoas. No para idealizar el pasado: para entender por qué ese corredor importaba.",
        "Iztacalco and Santa Anita belonged to that network. When you see La Viga on a current map, mentally replace cars with canoes. Not to romanticize the past, but to understand why the corridor mattered.",
      ),
    ],
    prompt: c(
      "Cuando vayas: fotografía un nombre de calle que conserve una pista del agua. Anota qué viste y qué imaginaste por separado.",
      "When you visit: photograph a street name preserving a clue to water. Record what you saw separately from what you imagined.",
    ),
    sources: ["viga", "vigaPhotos"],
  },
  {
    id: "penon",
    borough: "09017",
    title: c("El cerro junto al aeropuerto", "The hill beside the airport"),
    place: "Peñón de los Baños",
    date: c("Siglos de agua termal", "Centuries of thermal water"),
    lead: c(
      "Entre pistas y avenidas, un nombre te avisa que aquí hubo otra forma de llegar al agua.",
      "Among runways and avenues, a name hints at another way people once sought water.",
    ),
    paragraphs: [
      c(
        "La historia del Peñón incluye manantiales termales, baños y distintas ideas sobre salud e higiene. La investigación de la UNAM reúne mapas, fotografías y publicidad para seguir esos cambios.",
        "The Peñón’s history includes thermal springs, bathing and changing ideas about health and hygiene. UNAM research brings together maps, photographs and advertisements to trace those changes.",
      ),
      c(
        "No imagines un cerro vacío junto a un aeropuerto: mira un barrio con memoria propia. Un anuncio de baños habla de lo que se prometía al visitante; no demuestra que una cura funcionara.",
        "Do not picture an empty hill beside an airport: see a neighborhood with its own memory. A bathing advertisement tells us what visitors were promised; it does not prove a treatment worked.",
      ),
    ],
    prompt: c(
      "Cuando vayas: busca un nombre o una fachada que conecte barrio y baños. Pide permiso antes de retratar personas.",
      "When you visit: find a name or facade connecting the neighborhood with its baths. Ask before photographing people.",
    ),
    sources: ["penon"],
  },
  {
    id: "cuicuilco",
    borough: "09012",
    title: c("La ciudad antes de Tenochtitlan", "The city before Tenochtitlan"),
    place: "Cuicuilco",
    date: c(
      "Preclásico · mucho antes de 1325",
      "Preclassic · long before 1325",
    ),
    lead: c(
      "La gran pista es redonda. Y su historia no empieza con los mexicas.",
      "The great clue is round. And its story does not start with the Mexica.",
    ),
    paragraphs: [
      c(
        "Cuicuilco fue un centro importante del sur de la cuenca. Su arquitectura monumental y el paisaje volcánico obligan a ampliar la escala del tiempo cuando pensamos en la Ciudad de México.",
        "Cuicuilco was an important center in the southern basin. Its monumental architecture and volcanic landscape force us to widen the timescale when thinking about Mexico City.",
      ),
      c(
        "La erupción del Xitle es parte de esa historia, pero reducirla a una fecha espectacular borra preguntas arqueológicas. La investigación reciente revisa la cronología y la ocupación: el atlas conserva esa incertidumbre.",
        "Xitle’s eruption is part of that history, but reducing it to one spectacular date erases archaeological questions. Recent research revisits chronology and occupation; the atlas preserves that uncertainty.",
      ),
    ],
    prompt: c(
      "Cuando vayas: observa una relación entre roca, forma arquitectónica y ciudad actual. Sigue los recorridos autorizados del sitio.",
      "When you visit: notice a relationship between rock, architectural form and today’s city. Follow the site’s authorized paths.",
    ),
    sources: ["cuicuilco", "cuicuilcoMuseum"],
  },
  {
    id: "milpa",
    borough: "09009",
    title: c("El sur también habla", "The south has a living voice"),
    place: "Milpa Alta",
    date: c("Una historia en presente", "A history in the present tense"),
    lead: c(
      "Si el mapa termina donde termina el Metro, te estás perdiendo una parte enorme de la ciudad.",
      "If your map ends where Metro ends, you are missing a large part of the city.",
    ),
    paragraphs: [
      c(
        "Milpa Alta reúne pueblos, agricultura y bosque. El náhuatl forma parte de su vida contemporánea: no sólo sirve para descifrar el nombre de una avenida antigua.",
        "Milpa Alta brings together towns, farming and forest. Nahuatl is part of contemporary life here, not just a tool for decoding old avenue names.",
      ),
      c(
        "El INPI documenta lengua, territorio y organización comunitaria. Las palabras del atlas vienen de fuentes históricas; no sustituyen aprender con hablantes de una variante concreta. Escuchar también significa reconocer quién puede contar una historia.",
        "INPI documents language, territory and community organization. The atlas’s words come from historical sources; they do not replace learning with speakers of a particular variety. Listening also means recognizing who can tell a story.",
      ),
    ],
    prompt: c(
      "Cuando vayas: aprende el nombre del lugar y de quien te enseña algo, si quiere compartirlo. Una conversación no es una prueba que te deban dar.",
      "When you visit: learn the place’s name and, if offered, the name of someone who teaches you something. A conversation is not evidence someone owes you.",
    ),
    sources: ["milpa", "living"],
  },
];
