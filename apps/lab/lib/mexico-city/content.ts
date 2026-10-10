export type StoryId = "zocalo" | "ehecatl" | "revolucion" | "chapultepec";
export type ZoneId = "centro" | "tabacalera" | "bosque";
export type Point = readonly [number, number];
export type Bounds = readonly [number, number, number, number];
export type View =
  | { level: "city" }
  | { level: "borough"; id: string }
  | { level: "zone"; id: ZoneId }
  | { level: "place"; id: StoryId };

export const STORIES: ReadonlyArray<{
  id: StoryId;
  title: string;
  short: string;
  place: string;
  zone: ZoneId;
  borough: string;
  coordinate: Point;
  date: string;
  color: string;
  teaser: string;
  today: string;
  history: string;
  twist: string;
  prompt: string;
  practical: string;
  source: { name: string; url: string };
  coordinateSource: string;
}> = [
  {
    id: "zocalo",
    title: "The monument that never was.",
    short: "A very famous absence",
    place: "Zócalo",
    zone: "centro",
    borough: "09015",
    coordinate: [-99.13306, 19.43278],
    date: "1843",
    color: "#d56542",
    teaser:
      "Mexico’s most famous square owes its nickname to something that was never finished.",
    today:
      "Look across the enormous open plaza. The cathedral, the façades, the flag: there is a lot to take in. But this story begins with something missing from the middle.",
    history:
      "In 1843, work began on the base of a proposed monument to Independence. The monument itself never rose above it. The base—a zócalo—remained in the square and lent the place its familiar nickname.",
    twist:
      "Archaeologists investigated the buried base during the plaza’s 2017 rehabilitation. An unfinished project became a name that outlasted the project itself.",
    prompt:
      "Make a photograph about absence. Frame the open center of the square, then write what you would never have noticed without this story.",
    practical:
      "Outdoor plaza. Events can change access. The buried base is not an exposed exhibit.",
    source: {
      name: "INAH · El Zócalo de la Ciudad de México. Historia y evidencias arqueológicas",
      url: "https://www.revistas.inah.gob.mx/index.php/boletinmonumentos/article/view/17405",
    },
    coordinateSource: "https://en.wikipedia.org/wiki/Z%C3%B3calo",
  },
  {
    id: "ehecatl",
    title: "Change trains. Meet a wind god.",
    short: "The temple between trains",
    place: "Ehécatl at Pino Suárez",
    zone: "centro",
    borough: "09015",
    coordinate: [-99.132708, 19.425283],
    date: "1969",
    color: "#5489a3",
    teaser:
      "An ordinary Metro journey has an extraordinary archaeological neighbor.",
    today:
      "At Pino Suárez, a small circular shrine sits within the world of commuters, stairs and station corridors. Two very different versions of the city occupy the same place.",
    history:
      "During the construction of Metro Pino Suárez in 1969, archaeologists found a round temple on a rectangular platform, associated with Ehécatl-Quetzalcóatl, the wind deity. The discovery became part of the station’s identity.",
    twist:
      "This is a small shrine, not a towering pyramid. Its size is part of the surprise: a piece of the older city survives inside everyday infrastructure.",
    prompt:
      "Find a composition that holds both times at once: ancient masonry and the present-day station. Keep other passengers out of your frame where possible.",
    practical:
      "Inside a working Metro station. Follow station access and photography rules; keep circulation clear.",
    source: {
      name: "Museo Nacional de Antropología · Ehécatl and the Pino Suárez discovery",
      url: "https://mna.inah.gob.mx/detalle_pieza_mes.php?id=285",
    },
    coordinateSource:
      "https://es.wikipedia.org/wiki/Adoratorio_de_Eh%C3%A9catl",
  },
  {
    id: "revolucion",
    title: "A palace changed its mind.",
    short: "The palace that became a monument",
    place: "Monumento a la Revolución",
    zone: "tabacalera",
    borough: "09015",
    coordinate: [-99.15464, 19.4362],
    date: "1910 → 1933",
    color: "#bd713c",
    teaser:
      "A surviving dome found a second life commemorating the upheaval that interrupted its first.",
    today:
      "Four enormous arches lift a copper-colored dome above the plaza. It feels like a structure designed to stand alone. That was not the original plan.",
    history:
      "The structure began as part of a proposed Federal Legislative Palace. Construction was interrupted during the revolutionary period. Its surviving central framework later became the starting point for a different monument.",
    twist:
      "Architect Carlos Obregón Santacilia proposed turning the abandoned structure into a monument to the Revolution. Work on that transformation began in 1933. The intended palace became a memorial to a changed country.",
    prompt:
      "Stand back and frame an arch. Can your photograph suggest the much larger building that might once have surrounded it?",
    practical:
      "The exterior is visible from Plaza de la República. Interior, museum and viewing access are separate visits.",
    source: {
      name: "Mexico City tourism · Monumento a la Revolución",
      url: "https://www.mexicocity.cdmx.gob.mx/venues/monument-to-the-revolution/",
    },
    coordinateSource:
      "https://en.wikipedia.org/wiki/Monumento_a_la_Revoluci%C3%B3n",
  },
  {
    id: "chapultepec",
    title: "The emperor didn’t bathe here.",
    short: "A royal name, a different story",
    place: "Baños de Moctezuma",
    zone: "bosque",
    borough: "09016",
    coordinate: [-99.1814396, 19.4176342],
    date: "1870",
    color: "#4c8166",
    teaser:
      "An old water reservoir, fashionable public baths, and a wonderfully persistent name.",
    today:
      "Among Chapultepec’s trees, a modest stone water container carries a grand name: the Baths of Moctezuma. The name invites you to imagine a private royal pool.",
    history:
      "INAH research distinguishes this pre-Hispanic water container from nineteenth-century public baths built opposite it. The reservoir supplied water; it was not Moctezuma’s private bath. The nearby Casa Baños de Chapultepec opened in 1870.",
    twist:
      "The public baths later disappeared, while the older water container remained. Over time, the royal name attached to the surviving site, blending different histories into one memorable legend.",
    prompt:
      "Look for the logic of water: a channel, a change of level, the basin’s edge. Photograph one detail that tells a more useful story than the name alone.",
    practical:
      "Park paths and archaeological access can change. Observe from the public path; the illustration is not a route guide.",
    source: {
      name: "INAH · Baños de Chapultepec and the Moctezuma legend, 7 September 2023",
      url: "https://www.inah.gob.mx/boletines/banos-de-chapultepec-las-albercas-de-aguas-curativas-del-siglo-xix-que-alimentaron-la-leyenda-de-los-banos-de-moctezuma",
    },
    coordinateSource: "https://www.openstreetmap.org/way/1266261143",
  },
];

export const ZONES: ReadonlyArray<{
  id: ZoneId;
  name: string;
  borough: string;
  tagline: string;
  image: StoryId;
  coordinate: Point;
  bounds: Bounds;
}> = [
  {
    id: "centro",
    name: "Centro Histórico",
    borough: "09015",
    tagline: "One city, many lives.",
    image: "zocalo",
    coordinate: [-99.133, 19.429],
    bounds: [-99.142, 19.42, -99.124, 19.438],
  },
  {
    id: "tabacalera",
    name: "Tabacalera",
    borough: "09015",
    tagline: "Plans change. Stories remain.",
    image: "revolucion",
    coordinate: [-99.15464, 19.4362],
    bounds: [-99.162, 19.43, -99.147, 19.442],
  },
  {
    id: "bosque",
    name: "Chapultepec",
    borough: "09016",
    tagline: "Follow the water into the trees.",
    image: "chapultepec",
    coordinate: [-99.18144, 19.41763],
    bounds: [-99.19, 19.412, -99.172, 19.427],
  },
];

export const storyById = (id: StoryId) =>
  STORIES.find((story) => story.id === id)!;
export const zoneById = (id: ZoneId) => ZONES.find((zone) => zone.id === id)!;
export const project = ([lng, lat]: Point): [number, number] => [
  (lng + 99.38) * 1900 * Math.cos((19.3 * Math.PI) / 180),
  (19.62 - lat) * 1900,
];
export function projectBounds(bounds: Bounds): Bounds {
  const a = project([bounds[0], bounds[3]]),
    b = project([bounds[2], bounds[1]]);
  return [a[0], a[1], b[0], b[1]];
}
export function parentView(view: View): View {
  if (view.level === "place")
    return { level: "zone", id: storyById(view.id)!.zone };
  if (view.level === "zone")
    return { level: "borough", id: zoneById(view.id)!.borough };
  return { level: "city" };
}
