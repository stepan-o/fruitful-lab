# Otra Vista — Mexico City discovery prototype

9 October 2026. Public Lab route: `/mexico-city`. Working name: **Otra Vista** (another view). First players: Susy and Stepan.

## The experience

The city is the game board. Start with the sixteen real borough outlines, enter Cuauhtémoc or Miguel Hidalgo, choose a curated neighbourhood, approach a drawn landmark, and open its story. The camera and landmark sizes change together. The desktop composition pairs an open map with a short editorial invitation; phones use a compact invitation, a large map, and a floating field-journal control.

A story has four moments: the place today, its earlier life, the surprising fact, and something to notice or photograph in person. Present-day and historical illustrations share graphite, ink and restrained watercolor. White space is part of the map, not a panel background. Historical drawings are explicitly interpretive reconstructions. They are not archival photographs or archaeological evidence.

The game loop is **discover → read → save → visit → photograph → compare**. Each player can earn 10 points for collecting a story, 25 for a self-reported visit, and 15 for a photograph. Each activity counts once per place; four complete discoveries total 200 points. Removing a visit or photograph removes those points. Saving and writing notes have no point value. There are no speed bonuses, territory claims, repeat-reading rewards or fabricated rival activity.

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
- All eight artworks were made with the built-in image generator. [Provenance and prompt records](../../apps/lab/assets/sources/mexico-city/provenance.json) record generation outputs, historical prompts and the correction that removed an invented carving from a draft shrine.
- Masters are source WebPs. `apps/lab/assets/mexico-city.json` generates 256/512/960/1280px immutable variants. Source masters are not referenced by the route. Only the current map drawings or story scene mount; there is no runtime image-generation call and no external map SDK.

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

This is a local, two-profile prototype. `otra-vista-journal-v1` and `otra-vista-player-v1` are browser storage keys. There is no account authentication, server competition, social feed, automatic sync, GPS verification or background tracking. Native file selection allows an existing or new photograph depending on the device. Photos are decoded locally, resized to at most 960px, flattened to JPEG and capped at 260,000 data-URL characters. Notes are capped at 500 characters. The export contains both players' notes and photographs; it is a user-controlled file, not an upload to a service. Import unions activity flags and preserves existing nonempty local notes/photos. Imports cannot contain external image URLs or executable SVGs.

For a later shared test, keep this UI and add authenticated memberships, a shared visit/photo store, immutable point events, and server-side deduplication. That will need a separate backend contract; browser scores must not be treated as authoritative multiplayer results.

## Separate style pass

After the full interaction path worked, the second pass shortened the phone opening, moved the map higher, corrected cramped headings and overlapping place labels, added understated real streets, and made landmark sizes and positions transition continuously across scales. It also strengthened small-text contrast, raised controls to 44px targets, preserved keyboard focus while paging, added a collected-story stamp, and disabled all motion under reduced-motion preferences. Original before-pass captures and final production captures are recorded with the verification evidence.

See [verification](VERIFICATION.md) for test results, screenshots, delivery measurements and limitations. This prototype is ready for owner playtesting; technical checks are not a claim that the game balance or visual direction has been accepted.
