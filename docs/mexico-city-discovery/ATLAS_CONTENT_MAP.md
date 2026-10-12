# Mexico city discovery game — illustrated atlas

Editorial and implementation specification, 12 October 2026. The game name remains a working reference. This is the learning experience for preparing to explore the city; `/mexico-city/play` remains the default real-world game field.

## Experience map

The game HUD opens **Atlas** at `/mexico-city/atlas`. Its five destinations are **Explorar / Explore**, **Aprender / Learn**, **Tiempo / Time**, **Retos / Challenges**, and **Náhuatl**. The return control leads to the game; guest/demo entry context is carried in an allowlisted query parameter. The atlas is public, requires neither a Google Maps key nor login, and does not invent a player identity.

- Explore: city → one of 16 boroughs → one of its three reference places → an available place story. Camera transitions retain spatial continuity. Pan, zoom, recenter, Metro/Cablebús overlays and a borough-name key support exploration. A searchable directory provides an accessible alternative to small map regions. At local scales the existing sourced street and neighborhood overlay is reused where coverage exists.
- Learn: six chapters, three scenes each. Each scene combines a short bilingual narrative, an illustrated interactive map, a noticing prompt and source links. A chapter ends by opening its related practice track.
- Time: seven dated windows, manual scrub/selection, optional playback, reference-water/connections/current-boundaries layers, three local comparisons and archival evidence drawers.
- Challenges: 40 questions across four tracks. Layout and borough recognition use an unlabeled numbered map plus named answer buttons. History and vocabulary use choices with explanatory feedback.
- Náhuatl: eight revealable vocabulary cards and two word-building games, with a living-language context and source links.

Spanish is the initial language. All authored learning text, navigation, questions, feedback, context, and story copy have English versions. Place names remain local names. Atlas navigation has browser-back support and validated deep links (`view`, `borough`, `anchor`, `chapter`, `quiz`); old `zone`/`place` links retain a useful destination.

## Learning sequence

| Chapter | Three scenes | Reader should be able to… | Interaction / practice |
| --- | --- | --- | --- |
| 01 Antes del asfalto | Basin and high ground; connected lakes; Cuicuilco before the Mexica | Relate terrain and water to settlement, distinguish Texcoco from the entire basin, recognize a longer chronology | Water/current-city comparison, southern borough map → layout |
| 02 Una cuenca, muchos pueblos | Multiple centers; island–shore connections; authorship of historical maps | Orient west to Tlacopan, north to Tepeyac, south to Iztapalapa; distinguish early colonial evidence from pre-conquest reconstruction | Select a causeway direction; open the 1524 archival map → history |
| 03 ¿A dónde se fue el agua? | Centuries of drainage; La Viga as transport; water beneath today’s city | Explain gradual transformation and the difference between water supply and drainage | Compare water references and borough locations → history |
| 04 Cuando los pueblos se volvieron ciudad | García Conde survey/publication; aerial evidence; an unfinished palace transformed | Compare sources at compatible scales and recognize changes without inventing missing imagery | Borough map; 1912/2018 photo pair → history |
| 05 Encuentra las piezas | Basin/borough/neighborhood; geographic anchors; the southern city | Identify boroughs through position, landscape and history rather than labels alone | Current borough map → all-16 recognition |
| 06 Muévete con sentido | Geographic Metro versus schematic diagram; Cablebús/light rail; airport distinctions | Connect major areas and distinguish network interchange from actual destination access | Select Metro lines, Cablebús corridors and airport connections → layout |

## Borough content inventory

Every profile contains position, a memory hook, contemporary context, a transport connection, three mapped reference places and sources. Numbers refer to this atlas’s directory, not official administrative codes.

| # | Borough | Three anchors | Recognition idea |
| --- | --- | --- | --- |
| 01 | Cuauhtémoc | Zócalo, Tlatelolco, Tabacalera | Historical island and successive city layers |
| 02 | Miguel Hidalgo | Chapultepec, Tacuba, Tacubaya | Western hill, water and routes |
| 03 | Azcapotzalco | Jardín Hidalgo, Tezozómoc, Vallejo | Tepanec center and industry in the northwest |
| 04 | Gustavo A. Madero | Tepeyac, Indios Verdes, Cuautepec | Northern hill country and connections |
| 05 | Venustiano Carranza | Peñón de los Baños, AICM T1, Jamaica | Airport, springs and markets east of center |
| 06 | Iztacalco | San Matías, Santa Anita, Ciudad Deportiva | Small borough, major canal connections |
| 07 | Iztapalapa | Cerro de la Estrella, Culhuacán, Santa Marta | Old communities and eastern relief |
| 08 | Benito Juárez | Mixcoac, Portales, Del Valle | Older centers inside established neighborhoods |
| 09 | Coyoacán | Jardín Centenario, Churubusco, Ciudad Universitaria | Old town and volcanic campus landscape |
| 10 | Álvaro Obregón | San Ángel, El Carmen, Chimalistac | Western plazas and water memories |
| 11 | Cuajimalpa de Morelos | Cuajimalpa centro, Desierto de los Leones, Santa Fe | Mountainous west; forests cross borough boundaries |
| 12 | La Magdalena Contreras | Los Dinamos, La Magdalena, San Jerónimo Lídice | River, forest and water-powered industry |
| 13 | Tlalpan | Cuicuilco, Tlalpan centro, Ajusco | Early urbanism, volcanic landscape and mountains |
| 14 | Xochimilco | San Bernardino, chinampa zone, Xochitepec | Working agricultural water landscape |
| 15 | Tláhuac | San Pedro, Mixquic, Ixtayopan | Lake communities and the urban/rural southeast |
| 16 | Milpa Alta | Villa Milpa Alta, Oztotepec, Atocpan | Southern towns, agriculture and living Náhuatl |

Mapped anchors are approximate learning references, not entrances, safe walking routes, property boundaries or navigation instructions. Named regions such as Santa Fe and the Desierto de los Leones can cross administrative boundaries. No profile treats a borough as culturally uniform.

## Story shelf

Retained and integrated: Zócalo’s unfinished monument; the Ehécatl shrine inside Pino Suárez; the legislative palace that became the Monumento a la Revolución; the reservoir behind the “Baños de Moctezuma” legend. Their credited Spanish excerpts and English renderings remain attached to the sources.

New stories:

| Story | Historical question | Evidence | Future observation |
| --- | --- | --- | --- |
| Aquí antes se llegaba en canoa | Why does La Viga explain Iztacalco’s position? | Araceli Peralta Flores, INAH/UNAM; INAH Iztacalco photography exhibition | Find a street-name trace of water; separate observation from imagination |
| El cerro junto al aeropuerto | What did the Peñón mean before the airport dominated the view? | UNAM study/podcast with maps, photographs and bathing advertisements | Observe the neighborhood’s own names and facades |
| La ciudad antes de Tenochtitlan | How does Cuicuilco widen the city’s timescale? | INAH site museum; Ramírez/Pastrana, 2024 | Connect rock, architectural form and modern surroundings |
| El sur también habla | What changes when Náhuatl is understood as contemporary? | INPI Milpa Alta monograph and language atlas | Learn respectfully from people and places without treating conversation as owed proof |

Each reader includes a hook, short narrative, source disclosure and a later real-world observation. No atlas reading is represented as a verified field discovery.

## Timeline and evidence boundaries

The full sequence is pre-Mexica → around 1500 → around 1550 → 1793 survey / 1807 publication → around 1900 → aerial-photography period 1932–1994 → 2026 reference frame. Local three-step comparisons cover La Viga, Chapultepec and Cuicuilco.

This is a narrated historical comparison, **not a measured urban-growth simulation**. Reference lake silhouettes remain fixed and labeled schematic. Lines explain relationships, not reconstructed engineering alignments. Modern borough geometry is always identified as current. No interpolated historical coastline, building footprint, continuous population surface or fake satellite timelapse is supplied. The UI explicitly describes these limits beside the controls. Automatic stepping is opt-in, stops on a hidden document and respects reduced-motion preferences.

The Uppsala map is early colonial evidence, not an untouched pre-conquest view. García Conde’s survey date and publication date are distinct. Cuicuilco/Xitle chronology remains under study; the manuscript deliberately avoids a single unsupported eruption/destruction date.

## Quiz and reward contract

| Track | Questions | Skill |
| --- | ---: | --- |
| Layout | 8 | Borough position, direction, administrative scale, transit and airport distinctions |
| History | 8 | Causality, transformations, dating evidence, living language and modern boundaries |
| Zone recognition | 16 | One clue per borough, answered on a map or from the equivalent accessible list |
| Náhuatl | 8 | Match a documented word to its meaning |
| Place-name building | 2 games | Order xochi/mil/co and xochi/tepe/c against meaning clues |

Correct answers display **+25 puntos / points**. Wrong answers award nothing and provide an explanatory retry. A question cannot emit a second reward after it is completed within that run. A new practice run can be played again. Completion reports questions completed, not an account balance. No new localStorage, cookie, backend, ledger, account-points or analytics mutation records quiz rewards. Existing field-game scoring is untouched. Language preference alone reuses the existing language setting.

Vocabulary: **atl, tepetl, xochitl, milli, ehecatl, tlalli, calli, metl**. Historical dictionary spellings are presented as such; no generic invented audio or claim to teach all contemporary variants. The two compounds illustrate specific attested names, not a formula for inventing arbitrary place names.

## Source and imagery policy

`lib/mexico-city/atlas/content.ts` holds the source register and borough profiles; `chapters.ts`, `stories.ts`, and `quizzes.ts` contain their evidence references. Core research uses UNAM, INAH, INPI, SEDEMA, official CDMX guides and transport operators. Detailed original-language documents remain linked rather than silently converted into archive assets.

The atlas extends the immutable Mexico City art pack with four original interpretive sketches: Cuicuilco, La Viga, Milpa Alta and Peñón de los Baños. They use the built-in image generator, with exact prompts and provenance retained in `apps/lab/assets/sources/mexico-city/provenance.json`. The Peñón bath courtyard is explicitly a composite, not an identified building. Generated illustrations remain visibly interpretive. Available real evidence is the public-domain 1524 map, Guillermo Kahlo’s 1912 construction photograph and CarlosGalvanMex’s 2018 monument photograph (CC BY-SA 4.0). Their source/author/date/license/transformations remain in the existing media rights register and photo drawers. ICA and additional INAH archives are research links only; linking a catalog does not imply permission to reproduce its images.

Transit is a dated learning layer, not live operation. Metro/Cablebús coverage comes from the existing sourced geographic overlay; the chapter identifies interchanges, Tren Ligero and three different airports. Operator links are provided for service changes. No fares, arrival times or live closure promises are added.

## Technical scope and verification

This change is scoped to `apps/lab` and Mexico City documentation. No account, authentication, backend schema or real-game scoring changes. Optional readers and practice screens are loaded on demand. Controls have keyboard equivalents and large targets; the map has a text alternative; stories use the existing native-dialog focus handling. Future work can add reviewed historical GIS layers, licensed aerial image pairs and learning progress persistence without changing the current field-proof rules.

See `ATLAS_VERIFICATION.md` for executed checks and preview evidence.
