# Otra Vista — Mexico City discovery prototype

Updated 10 October 2026. Public Lab route: `/mexico-city`. Working name: **Otra Vista** (another view). First players: Susy and Stepan.

## Product direction

The owner discussion on 10 October establishes **play in the actual city** as the guiding rule, with **the private multiplayer game for Susy and Stepan as the immediate priority**. The first complete loop is a shared challenge, an outing, a photo and place, peer confirmation and visible points. [City exploration game direction](FIELD_GAME_DIRECTION.md) defines that flow and account integration. Standalone solo reflections are later possibilities. [The community roadmap](COMMUNITY_ROADMAP.md) separately records the future idea of an optional-account collective map and logbook, with research references. Neither later direction expands the first battle's scope. These remain design changes; the current preview still behaves as described below.

## Current prototype experience

The city is the game board. Start with the sixteen real borough outlines, enter Cuauhtémoc or Miguel Hidalgo, choose a curated neighbourhood, approach a drawn landmark, and open its story. The camera and landmark sizes change together. The desktop composition pairs an open map with a short editorial invitation; phones use a compact invitation, a large map, and a floating field-journal control.

A story has four moments: the place today, its earlier life, the surprising fact, and something to notice or photograph in person. Present-day and historical illustrations share graphite, ink and restrained watercolor. White space is part of the map, not a panel background. Historical drawings are explicitly interpretive reconstructions. They are not archival photographs or archaeological evidence.

The game loop is **discover → read → save → visit → photograph → compare**. Each player can earn 10 points for collecting a story, 25 for a self-reported visit, and 15 for a photograph. Each activity counts once per place; four complete discoveries total 200 points. Learning adds up to 225 points per person (15 for finishing the six-part orientation, six city challenges at 20 each, five Náhuatl word matches at 10 each, and two place-name puzzles at 20 each). Maximum authored prototype score: 425. Wrong answers and repeat practice add zero. Removing a visit or photograph removes those points. Saving and writing notes have no point value. There are no speed bonuses, territory claims, repeat-reading rewards or fabricated rival activity.

## References and decisions

These are interface references, not assets reused in our game. The applications below are distinct from our implementation; the final column records design inferences.

| Reference | Observed design | Adaptation for this prototype |
| --- | --- | --- |
| [Ingress missions](https://support.ingress.com/hc/en-us/articles/41140422789147-Discover-Share-Missions) and [mission authoring](https://support.ingress.com/hc/en-us/articles/41140412990619-Creating-Missions) | Nearby cultural waypoints, mission details, sequential or any-order visits | A neighbourhood groups a small set of discoveries; players can choose either Centro story first. |
| [TOEM](https://www.somethingwemade.se/toem/) | A hand-drawn photographic adventure built around observation and distinct regions | A photograph answers an observation prompt, rather than proving that a generic pin was checked off. |
| [Carto — publisher introduction](https://blog.playstation.com/2020/07/01/introducing-carto-a-charming-innovative-puzzle-adventure-coming-to-ps4/) | The map is a tactile part of the fictional world | Make the drawings the entry points. Keep Mexico City's actual geography fixed. |
| [Assassin’s Creed Discovery Tour](https://www.ubisoft.com/en-us/game/assassins-creed/discovery-tour) and [Ancient Greece launch](https://news.ubisoft.com/en-ca/article/1SyQNzNyG0y0byP86Vg6nZ/open-world-museum-mode-comes-to-assassins-creed-odyssey-on-september-10) | Historical exploration through short authored tours; map, timeline and subject entry points | Separate a short narrative from the live map; always offer a historical source and a return to place. |
| [Pokémon GO map view](https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/84-what-is-the-map-view/?ticket_form_id=3) | The real-world map is the central play surface | Keep player identity and progress at the edge of the map, with no feed or dashboard replacing it. |

## First four stories

| Place / zone | Historical seed | Source and geographic anchor |
| --- | --- | --- |
| Zócalo / Centro Histórico | The square's nickname comes from the base of an unfinished Independence monument begun in 1843. Archaeological investigation during the 2017 rehabilitation revisited its remains. | [INAH study](https://www.revistas.inah.gob.mx/index.php/boletinmonumentos/article/view/17405). Anchor 19.43278, −99.13306; [coordinate reference](https://en.wikipedia.org/wiki/Z%C3%B3calo). The buried base is not represented as an exposed attraction. |
| Ehécatl at Pino Suárez / Centro Histórico | Metro construction in 1969 revealed the small round shrine on a rectangular platform associated with the wind deity. | [Museo Nacional de Antropología](https://mna.inah.gob.mx/detalle_pieza_mes.php?id=285). Anchor 19.425283, −99.132708; [coordinate reference](https://es.wikipedia.org/wiki/Adoratorio_de_Eh%C3%A9catl). The image is a small shrine, not a monumental pyramid. |
| Monumento a la Revolución / Tabacalera | The intended Legislative Palace was interrupted. Its surviving central structure became a monument through the proposal of Carlos Obregón Santacilia; transformation began in 1933. | [Official Mexico City tourism](https://www.mexicocity.cdmx.gob.mx/venues/monument-to-the-revolution/). Anchor 19.43620, −99.15464; [coordinate reference](https://en.wikipedia.org/wiki/Monumento_a_la_Revoluci%C3%B3n). |
| Baños de Moctezuma / Chapultepec | INAH distinguishes the surviving pre-Hispanic reservoir from nineteenth-century public baths opposite it, which opened in 1870. The surviving basin was not Moctezuma's private bath. | [INAH research account, 7 September 2023](https://www.inah.gob.mx/boletines/banos-de-chapultepec-las-albercas-de-aguas-curativas-del-siglo-xix-que-alimentaron-la-leyenda-de-los-banos-de-moctezuma). Anchor 19.4176342, −99.1814396 from [OSM way 1266261143](https://www.openstreetmap.org/way/1266261143). Distinct from the similarly named El Estanque de Moctezuma. |

Research was reviewed on 9 October 2026. No admission prices, opening times or live access claims are baked into the stories. A preproduction tourism website explicitly marked as containing non-real data was rejected as a source.

Next editorial seeds, not yet implemented: [Casa de la Primera Imprenta](https://cultura.uam.mx/casa-de-la-primera-imprenta/), [Kiosco Morisco](https://catalogonacionalmhi.inah.gob.mx/consulta_publica/detalle/12790), [Reloj Chino archival image](https://mediateca.inah.gob.mx/repositorio/islandora/object/fotografia%3A454598), and [Xochimilco's chinampas](https://www.fao.org/giahs/giahs-around-the-world/mexico-chinampas-agricultural-system/en). Each needs its own checked anchor, current access research and visual review before joining the game.

## Map and media

- Borough geometry: [SGIRPC CDMX public boundary service, layer 2](https://serviciosatlas.sgirpc.cdmx.gob.mx/arcgis/rest/services/AtlasCapasPublicas/Limites/FeatureServer/2), requested in EPSG:4326 on 9 October 2026. Sixteen polygons retained; boundaries are simplified for screen rendering.
- Streets: OpenStreetMap contributors, [ODbL attribution](https://www.openstreetmap.org/copyright). A bounded Overpass query collected primary, secondary and tertiary roads around the first three zones: `(19.411,-99.195,19.446,-99.121)`. The successful endpoint was `https://overpass.kumi.systems/api/interpreter`; query: `[out:json][timeout:25];way["highway"~"primary|secondary|tertiary"](19.411,-99.195,19.446,-99.121);out geom;`.
- Coordinates are locally projected with a longitude cosine correction at 19.3° N. The map is an illustrated exploration surface, not navigation. Neighbourhood extents are curated approximate bounds, not administrative borders. Landmark illustrations have geographic anchors and may be displaced with leader lines to keep their labels readable.
- Source geography is retained in `apps/lab/assets/sources/mexico-city/`. Regenerate the runtime geometry with `python3 apps/lab/scripts/mexico-city-map.py` from the repository root.
- Nine illustrations were made with the built-in image generator; three separately labeled archive/modern references accompany the stories. [Provenance and prompt records](../../apps/lab/assets/sources/mexico-city/provenance.json) record generation outputs, historical prompts and the correction that removed an invented carving from a draft shrine.
- Masters are source WebPs. `apps/lab/assets/mexico-city.json` generates 256/512/960/1280px immutable variants. Source masters are not referenced by the route. Only the current map drawings or story scene mount; there is no runtime image-generation call and no external map SDK.


## Opening chapter, layers, and language games

The six-part opening chapter teaches **why the city has this shape**: the lake basin and island settlement; causeways and their surviving directions; present-day boroughs; geographic Metro corridors; Cablebús connections; and the different positions/access patterns of MEX, NLU and TLC. A lake/city slider, animated causeway selection, borough highlights, line isolation, and selectable airport connection diagrams reinforce each lesson. Six challenges test causal understanding, position, and useful connections. Every successful challenge awards points once per player; practice remains available.

The lake silhouettes and causeway/airport links are explicitly **interpretive diagrams**. Contemporary borough boundaries, Metro routes/stations, and Cablebús lines use SGIRPC coordinates. Administrative boroughs are not presented as ancient boundaries. An archival 1524 map can be opened for comparison, with a warning about its orientation and European conventions. Transit references were checked on 10 October 2026; this is a static learning map without live service, travel-time or fare claims. Airport access links lead to the relevant operators.

Map controls persist while moving between city, borough, zone and place. Metro and Cablebús can appear at all scales; station captions, neighborhood boundaries/names and twelve highlighted streets appear at closer scales where visible. Street and neighborhood coverage is bounded to the initial central exploration areas, not the entire metropolis. Retained SGIRPC neighborhood data contains administrative subdivisions such as Centro VII; labels preserve those names. Rendered captions avoid each other and illustrated landmarks. [Layer and editorial sources](SOURCES.md) describe coverage and limitations.

Náhuatl is introduced through five sourced words (**atl, tepetl, xochitl, milli, ehecatl**), a meaning-matching game and two compound-name games (**Xochimilco, Xochitepec**). This is an introduction to historical central Nahuatl using source spellings, not a claim of uniform modern pronunciation. Compound stems are explained as specific examples. No synthetic or unverified pronunciation audio is included.

Both language versions include richer local stories, short original Spanish quotations and English translations, source links, observation prompts and practical access wording. The Revolución story includes Guillermo Kahlo’s 1912 archive photograph and a credited 2018 reference photograph. The artwork and real photographs are clearly distinguished. [Image rights and transformations](../../apps/lab/assets/sources/mexico-city/references.json) are retained alongside [generated-art provenance](../../apps/lab/assets/sources/mexico-city/provenance.json).

New modules: `MapDetails.tsx` (layers/labels), `OverviewChapter.tsx` and `LearningMap.tsx` (chapter/challenges), `NahuatlGames.tsx`, `PhotoReferences.tsx`, and `locale.tsx` (Spanish-default copy and preference). `learning.ts`, `nahuatl.ts`, and `rewards.ts` hold the authored material and reward contract. The native dialog resets its scroll and heading focus when changing lesson/game pages. All chapter graphics have equivalent named HTML controls; reduced-motion preferences disable route animation and transitions.

## Application structure

| File / area | Responsibility |
| --- | --- |
| `app/(discovery)/mexico-city/page.tsx` | Route metadata and independent game shell; no marketing header/footer. |
| `components/mexico-city/CityGame.tsx` | Current player, scene navigation, URL history, journal persistence and modal ownership. |
| `MapCanvas.tsx` | Projected borough/street geometry, scaled camera, accessible illustrated landmarks. |
| `StoryReader.tsx` | Four authored scenes, touch/keyboard paging, sources, collection and fieldwork handoff. |
| `FieldJournal.tsx` | Rivalry, saved places, notes, visits, photographs and export/import. |
| `GameDialog.tsx` | Native modal focus containment, Escape dismissal and trigger-focus restoration. |
| `lib/mexico-city/content.ts` | Typed stories, source links, coordinates, zones and parent navigation. |
| `lib/mexico-city/journal.ts` | Versioned journal validation, deduplicated scoring, conservative merge and local photo encoding. |

Deep links use `?borough=09015`, `?zone=centro`, or `?place=zocalo`. Invalid values return to the city. Browser Back restores the previous map scale. Other boroughs are selectable and honestly show that their stories are not yet authored.

This is a local, two-profile prototype. `otra-vista-journal-v1`, `otra-vista-player-v1`, and `otra-vista-language-v1` are browser storage keys. Journal version 1 now accepts optional, per-player `learning` flags; older exports remain valid. Unknown reward keys and non-boolean flags are discarded, and imports union earned rewards. Spanish is the default, with a persistent English option on the map and inside every dialog. There is no account authentication, server competition, social feed, automatic sync, GPS verification or background tracking. Native file selection allows an existing or new photograph depending on the device. Photos are decoded locally, resized to at most 960px, flattened to JPEG and capped at 260,000 data-URL characters. Notes are capped at 500 characters. The export contains both players' notes and photographs; it is a user-controlled file, not an upload to a service. Import unions activity flags and preserves existing nonempty local notes/photos. Imports cannot contain external image URLs or executable SVGs.

The next shared test follows [the city exploration direction](FIELD_GAME_DIRECTION.md): an account-owned record for any real-world discovery, durable photos, optional peer-reviewed battle submissions and an interface centered on outings. Authored stories become supporting context. This requires a new backend contract; browser scores must not become authoritative multiplayer results.

## Separate style pass

After the full interaction path worked, the second pass shortened the phone opening, moved the map higher, corrected cramped headings and overlapping place labels, added understated real streets, and made landmark sizes and positions transition continuously across scales. It also strengthened small-text contrast, raised controls to 44px targets, preserved keyboard focus while paging, added a collected-story stamp, and disabled all motion under reduced-motion preferences. Original before-pass captures and final production captures are recorded with the verification evidence.

See [verification](VERIFICATION.md) for test results, screenshots, delivery measurements and limitations. This prototype is ready for owner playtesting; technical checks are not a claim that the game balance or visual direction has been accepted.
