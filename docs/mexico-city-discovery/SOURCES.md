# Otra Vista — editorial and map sources

Reviewed 10 October 2026. The prototype separates geographic observations, historical interpretation, and present-day operator information. Link titles and short quotations belong to their credited sources; authored Spanish and English narratives synthesize the research.

## City shape and historical layers

- [Ciencia UNAM: La ciudad que secó sus lagos](https://ciencia.unam.mx/leer/848/la-ciudad-que-seco-sus-lagos-y-hoy-enfrenta-la-escasez-de-agua-): drainage and the transformed closed basin. The short in-app quotation and translation each use 9 words.
- [UNAM CCH: México-Tenochtitlan](https://e1.portalacademico.cch.unam.mx/alumno/historiademexico1/unidad2/culturamexica/mexicotenochtitlan): the island and traditional five-lake grouping. Lake groupings vary between accounts; the schematic uses Zumpango, Xaltocan, Texcoco, Xochimilco and Chalco, not five surveyed shorelines.
- [Noticonquista UNAM: El espectáculo en México-Tenochtitlan](https://www.noticonquista.unam.mx/amoxtli/2076/2073): causeway directions and surviving urban axes. The in-app quotation uses 13 Spanish words and 11 in its English rendering. Drawn straight links are explanatory, not reconstructed engineering alignments.
- [Noticonquista UNAM: landscape and the lake basin](https://www.noticonquista.unam.mx/amoxtli/1809/1798) and [Gaceta UNAM: Lagos regulaban clima de la capital mexicana](https://www.gaceta.unam.mx/lagos-regulaban-clima-de-la-capital-mexicana/): environmental context.
- [CDMX tourism zone guides](https://www.mexicocity.cdmx.gob.mx/e/guias-completas-de-rutas-de-la-ciudad-de-mexico/) and [Xochimilco borough history](https://www.xochimilco.cdmx.gob.mx/historia/): current area anchors and the southern water/agriculture story. Modern borough boundaries are shown as modern administration, never pre-Hispanic borders.

## Story quotations

The product shows the original Spanish, with a short translated quote when English is selected. Each source's combined quoted wording stays below 25 words.

| Story | Excerpt topic | Primary source/context |
| --- | --- | --- |
| Zócalo | Unbuilt column and statue | [INAH communiqué republished by Arqueología Mexicana](https://arqueologiamexicana.mx/node/2692); [INAH study](https://www.revistas.inah.gob.mx/index.php/boletinmonumentos/article/view/17405). The 1843 base was documented in 2017 and protected again; it is not an exposed visitor attraction. |
| Pino Suárez | Onion-layer comparison | [Museo Nacional de Antropología](https://mna.inah.gob.mx/detalle_pieza_mes.php?id=285), explaining successive temple construction. Its possible whirlwind association is presented as an interpretation. |
| Revolución | The unfinished palace’s metal frame | [SCT El Mirador](https://elmirador.sct.gob.mx/reportajes-especiales/la-scop-sct-en-tiempos-de-lazaro-cardenas), construction/transformation chronology and Carranza's 1942 transfer; [CDMX tourism](https://www.mexicocity.cdmx.gob.mx/venues/monument-to-the-revolution/). |
| Chapultepec | Not the ruler’s private bath | [INAH, 7 September 2023](https://inah.gob.mx/boletines/banos-de-chapultepec-las-albercas-de-aguas-curativas-del-siglo-xix-que-alimentaron-la-leyenda-de-los-banos-de-moctezuma): distinguish the reservoir from the 1870 public baths opposite it and the three pools found in 2018. |

Some official sites intermittently refuse automated direct requests; indexed official excerpts were cross-checked with the accessible official material. No fabricated archival quotation is attributed to a source.

## Contemporary map data

Retained originals are in `apps/lab/assets/sources/mexico-city/`. Build with `python3 apps/lab/scripts/mexico-city-layers.py`; it also rebuilds the underlying geography with the original offline generator. Coordinate projection and simplified paths preserve relative geographic positions, not official navigational accuracy.

Base service: `https://serviciosatlas.sgirpc.cdmx.gob.mx/arcgis/rest/services/AtlasCapasPublicas/`.

| Dataset | Service/layer | Coverage/processing |
| --- | --- | --- |
| Boroughs | `Limites/FeatureServer/2` | All 16; previous retained snapshot, 9 October. |
| Neighborhoods | `Limites/FeatureServer/10` | Cuauhtémoc and Miguel Hidalgo. Query `cve_col LIKE '%15-%' OR cve_col LIKE '%16-%'`: 151 records, one empty geometry omitted, 150 rendered boundaries/centroids. `cve_alc` was not reliable in this service. Source subdivision names retained. |
| Metro stations | `Movilidad_Integrada_CDMX/FeatureServer/0` | 195 **line-station records**, not a claim of 195 unique interchange sites. |
| Metro lines/colors | `Movilidad_Integrada_CDMX/FeatureServer/1` | 12 line geometries and service `drawingInfo` colors. |
| Cablebús stations/lines | `Movilidad_Integrada_CDMX/FeatureServer/10`, `/11` | 19 station records retained; four line geometry segments (1 with spur, 2 and 3). Only line geometry is currently rendered. |
| Key streets | OpenStreetMap contributors, [ODbL](https://www.openstreetmap.org/copyright) | Twelve named streets from the retained 1,836-way bounded central-area query described in the README. A later pedestrian-street request failed; no invented Madero geometry was added. |

Static source snapshot: 10 October 2026. Station labels are collision-filtered at closer scales; not every station name appears simultaneously. `map-layers.json` is the compact runtime derivative, not an authoritative transit service feed. The controls stay available across scales even where a particular layer has no local coverage.

## Transit and airports

- [STC official map with streets](https://www.metro.cdmx.gob.mx/la-red/mapa-de-la-red-con-calles): line identifiers and interchange context. Operator source is linked beside the overlay.
- [STE Cablebús](https://www.ste.cdmx.gob.mx/cablebus): Lines 1, 2, 3; [Los Pinos/Constituyentes connection](https://www.mexicocity.cdmx.gob.mx/venues/estacion-los-los-pinos-constituyentes/). The chapter describes links to Metro 3, 8, A and 7 as relevant, not an integrated journey planner.
- [CDMX Tren Ligero guide](https://www.mexicocity.cdmx.gob.mx/e/getting-around/viajar-en-tren-ligero/): southern access from Tasqueña toward Xochimilco.
- [AICM Metro guidance](https://www.aicm.com.mx/pasajeros/servicios/prestadores-de-servicios/transportes/metro) and [Metrobús guidance](https://www.aicm.com.mx/pasajeros/servicios/prestadores-de-servicios/transportes/metrobus): Terminal Aérea on Line 5 serves Terminal 1, not Terminal 2 directly. The lesson gives a reference connection from B through Oceanía, with separate terminal-transfer/operator information.
- [FONADIN: Tren Suburbano Lechería–AIFA](https://www.fonadin.gob.mx/fni2/fp103/): official record of service opening on 26 April 2026. The lesson uses B → Buenavista → Tren Felipe Ángeles → AIFA, not a Metro station at the airport. [Presidency inauguration record](https://www.gob.mx/presidencia/prensa/cumplimos-con-el-pueblo-de-mexico-presidenta-claudia-sheinbaum-inaugura-el-tren-felipe-angeles-buenavista-aifa?idiom=es-MX).
- [Aeropuerto Internacional de Toluca FAQ](https://aeropuertodetoluca.com.mx/preguntas-frecuentes/): ground access options including Observatorio. The lesson distinguishes Metro to an urban connection from the separate ground journey; it does not promise direct Metro access to TLC.

The three airports have geographic anchors; dashed airport links are connection diagrams, not actual rail/road alignments. No live timetables, closures, fares, transfer walking distances, or journey durations are promised.

## Náhuatl

- **atl**: [UNAM Estudios de Cultura Náhuatl](https://nahuatl.historicas.unam.mx/index.php/ecn/article/view/78098).
- **tepetl**: [INAH Xochipilli glossary](https://xochipilliuniversomexica.inah.gob.mx/glosario.html).
- **xochitl**, **milli**, **ehecatl**: UNAM Gran Diccionario Náhuatl entries for [xochitl](https://gdn.iib.unam.mx/diccionario/xochitl), [milli](https://gdn.iib.unam.mx/diccionario/milli/26330), and [ehecatl](https://gdn.iib.unam.mx/diccionario/ehecatl/278403).
- **Xochimilco**: [SECTUR borough diagnosis, 2015](https://www.turismo.cdmx.gob.mx/storage/app/media/Estadisticas/Diagnosticos%20Turisticos%20Delegacionales/Delegacion%20Xochimilco%202015.pdf), xochitl + milli + co. The puzzle uses compound stems xochi/mil/co and explicitly explains the changes.
- **Xochitepec**: [Xochimilco pueblos y barrios](https://www.xochimilco.cdmx.gob.mx/pueblos-y-barrios/), flower/hill place name. The puzzle is a specific example, not a generative grammar rule.
- [INPI: Nahuas de Milpa Alta](https://www.inpi.gob.mx/2021/dmdocuments/nahuas_milpa_alta.pdf) supports the living-language context. These five historically sourced spellings are not a course representing every contemporary variety. Pronunciation requires a future named community/speaker source.

## Archive and modern imagery

The [rights register](../../apps/lab/assets/sources/mexico-city/references.json) records the source page, author, date, license and transformation of every non-generated image. Public-domain 1524 Newberry/Nuremberg map; public-domain Guillermo Kahlo construction photograph (1912); CarlosGalvanMex modern monument photograph (2018), CC BY-SA 4.0, including the distributed WebP variants. All are visibly credited in the interface. The modern photograph was not used as a generation reference. The new island vignette used only the public-domain map for historical context and the existing generated artwork for stylistic continuity. The illustration is labeled interpretive.
