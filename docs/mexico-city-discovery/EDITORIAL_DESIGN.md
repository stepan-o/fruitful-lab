# Mexico city discovery game — editorial design

12 October 2026 · Active project writing and presentation guide.

Read this before writing or revising the landing, Atlas, chapters, borough profiles, map captions or game prompts. The working reference remains **Mexico city discovery game**. This guide sits alongside [EXPERIENCE_SPEC.md](EXPERIENCE_SPEC.md), [ATLAS_CONTENT_MAP.md](ATLAS_CONTENT_MAP.md), [SOURCES.md](SOURCES.md) and the repository [design/performance standards](../DESIGN_AND_PERFORMANCE_STANDARDS.md).

## Editorial purpose

Help someone understand the city they will explore. Give them a concrete question, explain the relationships behind it, and offer a clear next step. Geography, people, work, water and history belong in the same account. The Atlas prepares curiosity for an actual outing; the field game records that outing.

The voice is informed, inviting and conversational. Write with the care of an illustrated history book and the clarity of a companion who knows where to begin. Make a place interesting through particular details, not promotional adjectives. Readers should finish a passage with something they can recognize, explain or ask about outside.

## Language and voice

- Compose in natural Mexican Spanish first; Spanish is the default. Use tú and concise invitations: “Empieza”, “Selecciona”, “Conoce”, “Observa”. Avoid classroom scolding, forced slang, tourist exoticism and claims to speak for local communities.
- Write English as an idiomatic adaptation with the same meaning, promise and action. Preserve place names and accents; use “borough” for alcaldía, “neighborhood” for colonia/barrio when appropriate. Spanish náhuatl / English Nahuatl refer to a living language; variants and source spellings need context.
- A heading may ask a genuine question (“¿Por qué la ciudad tiene esta forma?”). The following paragraph must establish how the section helps answer it. Do not add a rhetorical question to every card.
- Prefer named places and observable relationships: “El río Magdalena y los bosques de Los Dinamos.” Avoid empty mystery (“Descubre sus secretos”), forced praise (“Ninguna de relleno”) and vague metaphors (“El sur también habla”).
- Explain cause and change through people and processes. Avoid framing all history as preparation for the Mexica or conquest. Chinampas, farming communities and Indigenous languages belong to the present as well as the past.
- Keep the human scale: distinguish a borough from one famous neighborhood, a place from a transit stop, a photograph from a reconstruction. Names, maps and community life need not share administrative boundaries.
- Do not sacrifice accuracy for a striking line. “El agua no está” erases surviving waterways and wetlands. State the particular transformation instead.
- Use curiosity rather than pressure: no FOMO, mandatory learning gates, invented urgency, inflated quiz rewards or shame about what a reader does not know.

## Page composition and copy hierarchy

1. **Opening:** one useful question and a short paragraph establishing the journey. Identify the Atlas plainly; avoid decorative coordinates in the introduction.
2. **First chapter:** chapter number, concrete topic, one short explanation, an explicit reading action and a separate route to all chapters. “El valle y sus lagos” is the entry invitation for chapter 01; its book title remains “Un mundo entre lagos”.
3. **Map introduction:** invite a place choice, explain what selecting a borough reveals, then give the illustrated map room. Map selection opens its profile; no extra confirmation step.
4. **Historical comparison:** explain the timeline's purpose. A selected period can lead to its related history chapter. Do not advertise a measured historical simulation; the existing timeline is a sourced schematic.
5. **Borough directory:** use clear names, positional labels and recognizable places. Short card descriptions are orientation clues, not complete cultural identities. Search says what it searches.
6. **Navigation:** verbs and destinations should be recognizable and stable. Preserve selected state, accessible labels and browser history.

Each section has its own job. Avoid repeating the map instruction inside the history panel, or repeating the opening's broad promise on every card. Remove decorative eyebrow text when it adds no information.

## Approved Atlas landing choices

Owner selection: 1 B; 2 A; 3 B title with A body; 4 A; 5 A; 6 A; 7 B. Map-note options from the earlier proposal were rejected; the replacement below was authored for this implementation.

| Section | Spanish | English |
| --- | --- | --- |
| Opening | ¿Por qué la ciudad tiene esta forma? | Why does the city look this way? |
| Opening body | Empieza por el valle y sus lagos. Sigue a los pueblos que lo transformaron y encuentra sus huellas en la ciudad de hoy. | Begin with the valley and its lakes. Follow the people who transformed them, and find their traces in today’s city. |
| First chapter | Capítulo 01 · El valle y sus lagos | Chapter 01 · The valley and its lakes |
| Chapter invitation | Conoce el paisaje donde comienza esta historia: montañas, agua y distintas maneras de vivir entre ambas. | Meet the landscape where this story begins: mountains, water, and different ways of living between them. |
| Chapter actions | Leer el primer capítulo / Ver todos los capítulos | Read the first chapter / Browse all chapters |
| Map title | Empieza por un lugar. | Start with a place. |
| Map introduction | Selecciona una alcaldía para conocer sus lugares de referencia, su historia y cómo se conecta con otras partes de la ciudad. | Choose a borough to explore its landmarks, history, and connections with the rest of the city. |
| History title | Cómo cambió la ciudad | How the city changed |
| History introduction | Recorre los momentos que transformaron el valle. Observa qué cambió entre una época y otra y encuentra el capítulo que cuenta esa parte de la historia. | Explore turning points in the valley’s history. See what changed between periods, then find the chapter that tells that story. |
| History action | Explorar la línea del tiempo | Explore the timeline |
| Directory title | Conoce las 16 alcaldías. | Meet the 16 boroughs. |
| Directory introduction | Ubica cada una por sus lugares, su paisaje y su historia. Elige una para empezar. | Get to know each through its landmarks, landscape, and history. Choose one to begin. |
| Search | Buscar alcaldía o lugar | Find a borough or place |
| Navigation | Explorar · Leer · En el tiempo · Ponte a prueba · Náhuatl | Explore · Read · Through time · Test yourself · Nahuatl |
| Game return | Ir al mapa del juego | Open the game map |

All 16 borough cards use the selected place-based descriptions in `apps/lab/lib/mexico-city/atlas/content.ts`. These names refer to the places and landscapes documented in each existing, sourced profile. Directory numbers are ordering aids, not official borough codes. The source register remains the authority for historical claims.

## Map notes and visual captions

A map note should help the reader interpret what they see. Relate the visible geography to the editorial journey; do not repeat the interaction instruction or append a generic legal-sounding warning.

Current landing note:

> Las alcaldías dibujan la ciudad de hoy. Sus historias nos llevan más atrás.
>
> Today’s boroughs give us our bearings. Their stories take us further back.

The first sentence anchors the graphic in present-day administrative geography. The second leads toward history. Place it below the map in readable editorial type, outside the controls and mapped places. Give it enough space to wrap naturally on a phone.

This voice does not remove necessary evidence limits. A figure that approximates a coastline, omits a route, or depicts a disputed event needs a precise explanation at that figure. Transit overlays are reference material rather than live service status. Put those limitations beside the relevant data or layer, with sources/dates, rather than disguising them as a general landing slogan.

Historical images need author, date (distinguish publication from camera date), archive/provenance, reproduction basis and a reason to look. Identify an interpretive illustration directly: “Ilustración interpretativa de Tenochtitlan.” Never present generated artwork as archival evidence.

## Visual expression

Use the Atlas's light paper/white surfaces, green ink, quiet ochre accents, serif headings and captions, and readable sans-serif explanations/controls. Let the map, source image or diagram establish the place; let typography organize the questions. Decoration must not obscure meaning.

Use open spacing, restrained dividers and editorial rows. The first-chapter invitation can have a pale paper tint, while borough descriptions remain plain, scannable entries. A caption belongs beside its image or below its map, not floating over important geography. Headlines can wrap naturally; do not shrink meaningful text to preserve a desktop layout on a phone.

Atlas reading uses guided buttons and page scrolling. Keep freely pannable live play in the field map. Keep control targets at least 44 px, text navigation legible across both languages, focus visible and motion optional. Existing sketches and archival assets keep their documented attribution and delivery pipeline; this copy pass adds no media or font downloads.

## Editorial review before publishing

- Does the opening name a concrete question and the section fulfill its promise?
- Is the next action explicit, available and connected to the intended destination?
- Does each card teach a usable place association rather than offer generic atmosphere?
- Are dates, people, places and causal claims backed by visible sources in the relevant chapter/profile? Distinguish author interpretation from evidence.
- Are communities and languages described as living, varied and contemporary?
- Does English read naturally while preserving Spanish's meaning and action?
- Can the longest copy and navigation labels fit at 320 and 390 px without clipped controls or horizontal overflow?
- Do map notes clarify the figure, and do archive captions identify the evidence accurately?

For implementation and preview evidence see [ATLAS_VERIFICATION.md](ATLAS_VERIFICATION.md). This guide records the writing direction; it does not imply that every older screen has already received an editorial revision.
