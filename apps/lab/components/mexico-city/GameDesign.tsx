"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Artwork from "./Artwork";
import { LocaleProvider, useLocale } from "@/lib/mexico-city/locale";
import {
  appSurfaces,
  challengeScenes,
  deliverySteps,
  designNavigation,
  fieldLoop,
  mapScales,
  openDecisions,
  playKinds,
  playRules,
  references,
  visualRules,
  type DesignCopy,
} from "@/lib/mexico-city/game-design";
import styles from "./game-design.module.css";

function useCopy() {
  const { locale } = useLocale();
  return (copy: DesignCopy) => copy[locale === "es" ? 0 : 1];
}

function SectionHeading({
  number,
  title,
  children,
}: {
  number: string;
  title: DesignCopy;
  children?: ReactNode;
}) {
  const say = useCopy();
  return (
    <div className={styles.sectionHeading}>
      <span className={styles.sectionNumber} aria-hidden="true">
        {number}
      </span>
      <div>
        <h2>{say(title)}</h2>
        {children}
      </div>
    </div>
  );
}

function ChallengeWalkthrough() {
  const say = useCopy();
  const [sceneIndex, setSceneIndex] = useState(0);
  const scene = challengeScenes[sceneIndex];
  return (
    <div className={styles.walkthrough}>
      <div className={styles.challengeCard}>
        <p className={styles.eyebrow}>
          {say(["Susy → Stepan · ejemplo", "Susy → Stepan · example"])}
        </p>
        <span className={styles.cardStar} aria-hidden="true">
          ✳
        </span>
        <h3>
          {say([
            "Encuentra un rótulo que merezca otra mirada.",
            "Find a hand-painted sign worth a second look.",
          ])}
        </h3>
        <p>
          {say([
            "Fotografía un detalle y guarda dónde lo viste. Sin compra obligatoria.",
            "Photograph a detail and record where you found it. No purchase required.",
          ])}
        </p>
        <div className={styles.stakes}>
          <span>
            +100 <small>{say(["al confirmar", "when confirmed"])}</small>
          </span>
          <span>
            −100 <small>{say(["si no se cumple", "if uncompleted"])}</small>
          </span>
        </div>
        <p className={styles.cardNote}>
          {say([
            "Plazo ilustrativo: un día · valores por probar",
            "Illustrative deadline: one day · values to test",
          ])}
        </p>
      </div>
      <div className={styles.scenario}>
        <p className={styles.eyebrow}>
          {say(["Explora los resultados", "Explore the outcomes"])}
        </p>
        <p className={styles.small}>
          {say([
            "Simulación de diseño. No activa retos ni cambia tu marcador.",
            "Design simulation. It does not activate challenges or change your score.",
          ])}
        </p>
        <div
          className={styles.scenarioButtons}
          role="group"
          aria-label={say(["Escenario del reto", "Challenge scenario"])}
        >
          {challengeScenes.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={index === sceneIndex}
              onClick={() => setSceneIndex(index)}
            >
              {say(item.label)}
            </button>
          ))}
        </div>
        <div
          className={styles.scenarioResult}
          aria-live="polite"
          aria-atomic="true"
        >
          <div className={styles.resultScore} data-outcome={scene.id}>
            <strong>{scene.score}</strong>
            <span>{say(scene.scoreLabel)}</span>
          </div>
          <h3>{say(scene.title)}</h3>
          <p>{say(scene.body)}</p>
        </div>
      </div>
    </div>
  );
}

function MapNarrative() {
  const say = useCopy();
  const [scaleIndex, setScaleIndex] = useState(0);
  const scale = mapScales[scaleIndex];
  return (
    <div className={styles.mapNarrative}>
      <div
        className={styles.scaleControls}
        role="group"
        aria-label={say(["Escala de exploración", "Exploration scale"])}
      >
        {mapScales.map((item, index) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={index === scaleIndex}
            onClick={() => setScaleIndex(index)}
          >
            {say(item.kicker)}
          </button>
        ))}
      </div>
      <div className={styles.scaleScene}>
        <figure key={scale.id} className={styles.scaleArt}>
          <Artwork
            id={scale.asset}
            sizes="(max-width: 700px) 90vw, 480px"
            alt={say(scale.title)}
          />
          <figcaption>
            {say([
              "Ilustración generada · interpretación, no imagen documental",
              "Generated illustration · interpretation, not a documentary image",
            ])}
          </figcaption>
        </figure>
        <div className={styles.scaleCopy} aria-live="polite" aria-atomic="true">
          <p className={styles.eyebrow}>{say(scale.kicker)}</p>
          <h3>{say(scale.title)}</h3>
          <p>{say(scale.body)}</p>
        </div>
      </div>
    </div>
  );
}

function DesignContent() {
  const { locale, setLocale } = useLocale();
  const say = useCopy();
  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#design-content">
        {say(["Ir al diseño", "Skip to the design"])}
      </a>
      <header className={styles.header}>
        <Link href="/mexico-city" className={styles.brand}>
          <span lang="en">
            Mexico city
            <br />
            discovery game
          </span>
          <span className={styles.brandMark} aria-hidden="true">
            ✳
          </span>
        </Link>
        <span className={styles.headerLabel}>
          {say(["Cuaderno de diseño / 01", "Design notebook / 01"])}
        </span>
        <div
          className={styles.language}
          role="group"
          aria-label={say(["Idioma", "Language"])}
        >
          <button
            type="button"
            lang="es"
            aria-label="Español"
            aria-pressed={locale === "es"}
            onClick={() => setLocale("es")}
          >
            ES
          </button>
          <button
            type="button"
            lang="en"
            aria-label="English"
            aria-pressed={locale === "en"}
            onClick={() => setLocale("en")}
          >
            EN
          </button>
        </div>
      </header>
      <main id="design-content">
        <section className={styles.hero} aria-labelledby="design-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>
              {say([
                "Diseño del juego · Ciudad de México",
                "Game design · Mexico City",
              ])}
            </p>
            <h1 id="design-title">
              {say(["El juego sucede", "The game happens"])}
              <br />
              <em>{say(["allá afuera.", "out there."])}</em>
            </h1>
            <p className={styles.lead}>
              {say([
                "Una excusa para salir, mirar distinto y retarse en buena compañía. El teléfono guarda la historia; la ciudad pone la aventura.",
                "A reason to go outside, look again and challenge each other. The phone keeps the story; the city provides the adventure.",
              ])}
            </p>
            <div className={styles.heroActions}>
              <a className={styles.primary} href="#juego">
                {say(["Así queremos jugar", "How we want to play"])}{" "}
                <span aria-hidden="true">↗</span>
              </a>
              <Link className={styles.textLink} href="/mexico-city">
                {say(["Abrir prototipo", "Open prototype"])}{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <p className={styles.dateline}>
              {say([
                "Conversaciones al 10 de octubre de 2026",
                "Discussion through October 10, 2026",
              ])}
            </p>
          </div>
          <figure className={styles.heroArt}>
            <Artwork
              id="zocalo"
              preload
              sizes="(max-width: 700px) 90vw, (max-width: 1100px) 46vw, 560px"
              alt={say([
                "El Zócalo ilustrado con trazos de tinta y acuarela",
                "Zócalo illustrated in ink and watercolor",
              ])}
            />
            <div className={styles.fieldStamp}>
              <span>{say(["Primera partida", "First game"])}</span>
              <strong>Susy + Stepan</strong>
              <span>CDMX · 19° N</span>
            </div>
            <figcaption>
              {say([
                "Ilustración generada para el prototipo",
                "Illustration generated for the prototype",
              ])}
            </figcaption>
          </figure>
        </section>
        <nav
          className={styles.index}
          aria-label={say(["Capítulos del diseño", "Design chapters"])}
        >
          {designNavigation.map((item) => (
            <a key={item.id} href={`#${item.id}`}>
              {say(item.label)}
            </a>
          ))}
        </nav>

        <section className={styles.section} id="principio">
          <SectionHeading
            number="01"
            title={["Una ciudad. Dos miradas.", "One city. Two perspectives."]}
          >
            <p>
              {say([
                "Primero, un juego que Susy y Stepan quieran sacar a la calle. Todo lo demás crece a partir de eso.",
                "First, a game Susy and Stepan want to take into the city. Everything else grows from there.",
              ])}
            </p>
          </SectionHeading>
          <div className={styles.manifesto}>
            <p>
              {say(["Un minuto en la app.", "A minute in the app."])}
              <br />
              <em>{say(["Una hora de historias.", "An hour of stories."])}</em>
            </p>
            <div>
              <span className={styles.badge}>
                {say(["Dirección acordada", "Agreed direction"])}
              </span>
              <p>
                {say([
                  "El valor está en lo que hiciste: una taquería que no conocías, un rótulo en el que nunca te habías fijado, una charla, una librería fuera de tu ruta. La app propone, registra y conecta esos momentos.",
                  "The value is what you did: a taco stand you had never tried, a sign you had never noticed, a conversation, a bookstore outside your usual route. The app prompts, records and connects those moments.",
                ])}
              </p>
            </div>
          </div>
          <ol className={styles.loop}>
            {fieldLoop.map((item, index) => (
              <li key={item.title[0]}>
                <span aria-hidden="true">
                  0{index + 1} <i>↗</i>
                </span>
                <h3>{say(item.title)}</h3>
                <p>{say(item.body)}</p>
              </li>
            ))}
          </ol>
          <div className={styles.statusStrip}>
            <strong>
              {say(["Cómo leer este cuaderno", "How to read this notebook"])}
            </strong>
            <span>
              {say([
                "Acordado = dirección compartida",
                "Agreed = shared direction",
              ])}
            </span>
            <span>{say(["Propuesta = por probar", "Proposal = to test"])}</span>
            <span>
              {say([
                "Después = fuera del primer juego",
                "Later = beyond the first game",
              ])}
            </span>
          </div>
        </section>

        <section className={styles.section} id="juego">
          <SectionHeading
            number="02"
            title={[
              "Un reto cambia tu camino.",
              "A challenge changes your path.",
            ]}
          >
            <p>
              {say([
                "La prioridad es competir entre dos, con sorpresas que den ganas de hacer algo distinto. Estas mecánicas describen la próxima versión; aún no están conectadas al prototipo.",
                "The priority is a two-person competition, with surprises that make something different worth trying. These mechanics describe the next version; they are not yet connected to the prototype.",
              ])}
            </p>
          </SectionHeading>
          <div className={styles.threeColumns}>
            {playKinds.map((item) => (
              <article key={item.mark} className={styles.kind}>
                <span className={styles.eyebrow}>
                  {item.mark} / {say(item.tag)}
                </span>
                <h3>{say(item.title)}</h3>
                <p>{say(item.body)}</p>
              </article>
            ))}
          </div>
          <ChallengeWalkthrough />
          <div className={styles.ruleHeading}>
            <span className={styles.badge}>
              {say([
                "Reglas propuestas para la primera prueba",
                "Proposed rules for the first trial",
              ])}
            </span>
          </div>
          <div className={styles.threeColumns}>
            {playRules.map((item) => (
              <article key={item.title[0]}>
                <h3>{say(item.title)}</h3>
                <p>{say(item.body)}</p>
              </article>
            ))}
          </div>
          <aside className={styles.note}>
            <strong>
              {say([
                "La evidencia la revisa la otra persona.",
                "The other player reviews the evidence.",
              ])}
            </strong>{" "}
            {say([
              "Una foto y un lugar cuentan lo que hiciste; no prueban automáticamente presencia. Nadie se aprueba a sí mismo. Pedir un detalle mantiene la entrega pendiente; esperar una revisión no se convierte en derrota.",
              "A photo and place record your account; they do not automatically prove presence. Nobody approves their own entry. Asking for a detail keeps the submission pending; waiting for review does not turn into a loss.",
            ])}
          </aside>
        </section>

        <section className={styles.section} id="mapa">
          <SectionHeading
            number="03"
            title={["La ciudad tiene memoria.", "The city has a memory."]}
          >
            <p>
              {say([
                "El mapa sigue siendo el escenario principal. La historia ayuda a entender lo que tienes enfrente y a elegir qué hacer ahí.",
                "The map remains the main stage. History helps you understand what is in front of you and choose what to do there.",
              ])}
            </p>
          </SectionHeading>
          <MapNarrative />
          <div className={styles.twoColumns}>
            <article>
              <p className={styles.eyebrow}>
                {say(["Aprender mirando", "Learn by looking"])}
              </p>
              <h3>
                {say([
                  "Del lago a tus trayectos de hoy",
                  "From the lake to today’s journeys",
                ])}
              </h3>
              <p>
                {say([
                  "Comparar lago y ciudad, seguir las calzadas, reconocer alcaldías por su posición y sus hitos, aislar una línea del Metro. La interacción refuerza la explicación. Las capas históricas son esquemas interpretativos; la movilidad es una referencia estática.",
                  "Compare lake and city, follow causeways, recognize boroughs by position and landmarks, isolate a Metro line. Interaction reinforces the explanation. Historical layers are interpretive diagrams; mobility is a static reference.",
                ])}
              </p>
              <a
                className={styles.textLink}
                href="https://ciencia.unam.mx/leer/848/la-ciudad-que-seco-sus-lagos-y-hoy-enfrenta-la-escasez-de-agua-"
              >
                {say(["Fuente: Ciencia UNAM", "Source: Ciencia UNAM"])} ↗
              </a>
            </article>
            <article>
              <p className={styles.eyebrow}>Náhuatl</p>
              <h3>
                {say([
                  "Palabras que viven en el mapa",
                  "Words that live on the map",
                ])}
              </h3>
              <p>
                {say([
                  "atl, tepetl, xochitl, milli, ehecatl. Relacionar palabras y sentidos, y reconocer partes de Xochimilco y Xochitepec. Las grafías vienen de fuentes históricas; las variantes vivas merecen su propio contexto. Su papel en la competencia sigue abierto.",
                  "atl, tepetl, xochitl, milli, ehecatl. Match words and meanings, and recognize parts of Xochimilco and Xochitepec. Spellings come from historical sources; living varieties deserve their own context. Their role in competition remains open.",
                ])}
              </p>
              <a
                className={styles.textLink}
                href="https://gdn.iib.unam.mx/diccionario/xochitl"
              >
                {say([
                  "Fuente: Gran Diccionario Náhuatl, UNAM",
                  "Source: UNAM Gran Diccionario Náhuatl",
                ])}{" "}
                ↗
              </a>
            </article>
          </div>
        </section>

        <section className={styles.section} id="identidad">
          <SectionHeading
            number="04"
            title={[
              "Ligero de llevar. Difícil de olvidar.",
              "Light to carry. Hard to forget.",
            ]}
          >
            <p>
              {say([
                "Una identidad en construcción: aire, dibujo, curiosidad y una ciudad llena de color. “Mexico city discovery game” es nuestra referencia de trabajo, no un nombre definitivo.",
                "An identity taking shape: space, drawing, curiosity and a city full of color. “Mexico city discovery game” is our working reference, not a final name.",
              ])}
            </p>
          </SectionHeading>
          <div className={styles.styleBoard}>
            <div className={styles.typeSample}>
              <p className={styles.eyebrow}>
                {say([
                  "Tipografía / referencia del prototipo",
                  "Typography / prototype reference",
                ])}
              </p>
              <p className={styles.typeDisplay}>
                {say(["Mira otra vez.", "Look again."])}
              </p>
              <p className={styles.typeAlphabet}>Aa Bb Cc · 0123</p>
              <p className={styles.small}>Georgia · Arial / Helvetica</p>
            </div>
            <div
              className={styles.swatches}
              aria-label={say(["Paleta de referencia", "Reference palette"])}
            >
              {[
                { color: "#FFFFFF", name: ["Papel", "Paper"] as DesignCopy },
                { color: "#263B36", name: ["Tinta", "Ink"] as DesignCopy },
                { color: "#E97954", name: ["Acento", "Accent"] as DesignCopy },
                { color: "#DCE7E4", name: ["Agua", "Water"] as DesignCopy },
              ].map((swatch) => (
                <div key={swatch.color}>
                  <span style={{ backgroundColor: swatch.color }} />
                  <strong>{say(swatch.name)}</strong>
                  <small>{swatch.color}</small>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.twoColumns}>
            {visualRules.map((item) => (
              <article key={item.title[0]}>
                <h3>{say(item.title)}</h3>
                <p>{say(item.body)}</p>
              </article>
            ))}
          </div>
          <div className={styles.mediaTriptych}>
            <figure>
              <Artwork
                id="revolucion-past"
                sizes="(max-width: 700px) 90vw, 360px"
                alt={say([
                  "Interpretación dibujada del antiguo Palacio Legislativo",
                  "Drawn interpretation of the former Legislative Palace",
                ])}
              />
              <figcaption>
                <strong>
                  {say(["Interpretación generada", "Generated interpretation"])}
                </strong>
                {say([
                  "Una familia visual para narrar. No es una fotografía de archivo.",
                  "One visual family for storytelling. This is not an archival photograph.",
                ])}
              </figcaption>
            </figure>
            <figure>
              <Artwork
                id="archive-legislativo"
                sizes="(max-width: 700px) 90vw, 360px"
                alt={say([
                  "Construcción del Palacio Legislativo, fotografía de 1912",
                  "Legislative Palace under construction, 1912 photograph",
                ])}
              />
              <figcaption>
                <strong>{say(["Archivo · 1912", "Archive · 1912"])}</strong>
                <a href="https://commons.wikimedia.org/wiki/File:Construcci%C3%B3n_del_Palacio_Legislativo.jpg">
                  Guillermo Kahlo ↗
                </a>
                <span>
                  {say([
                    "Dominio público · copia reducida en WebP",
                    "Public domain · resized WebP copy",
                  ])}
                </span>
              </figcaption>
            </figure>
            <figure>
              <Artwork
                id="photo-revolucion"
                sizes="(max-width: 700px) 90vw, 360px"
                alt={say([
                  "Monumento a la Revolución fotografiado en 2018",
                  "Monumento a la Revolución photographed in 2018",
                ])}
              />
              <figcaption>
                <strong>
                  {say(["Fotografía · 2018", "Photograph · 2018"])}
                </strong>
                <a href="https://commons.wikimedia.org/wiki/File:MONUMENTO_A_LA_REVOLUCION_CON_CIELO_AZUL.jpg">
                  CarlosGalvanMex ↗
                </a>
                <span>
                  <a href="https://creativecommons.org/licenses/by-sa/4.0/">
                    CC BY-SA 4.0
                  </a>{" "}
                  · {say(["copia reducida en WebP", "resized WebP copy"])}
                </span>
              </figcaption>
            </figure>
          </div>
          <aside className={styles.voice}>
            <span className={styles.eyebrow}>
              {say(["La voz", "The voice"])}
            </span>
            <blockquote>
              {say(["“¿Qué te llamó la atención?”", "“What caught your eye?”"])}
            </blockquote>
            <p>
              {say([
                "Español por defecto, natural y con sabor local. Inglés con la misma intención, también en errores y estados. Relatos con detalles sabrosos y fuentes mexicanas; las notas de cada quien conservan su idioma. Curiosidad, invitación y un poco de picardía, sin regañar a nadie por su rutina.",
                "Spanish by default, natural and full of local flavor. English carries the same intent, including errors and states. Vivid stories with Mexican sources; personal notes keep their original language. Curiosity, invitation and a little mischief, without judging anyone’s routine.",
              ])}
            </p>
          </aside>
        </section>

        <section className={styles.section} id="estructura">
          <SectionHeading
            number="05"
            title={[
              "Una app que te deja salir.",
              "An app that lets you get going.",
            ]}
          >
            <p>
              {say([
                "Cuatro superficies para acompañar la salida. La cuenta y el idioma quedan a un lado; registrar un hallazgo siempre está a mano.",
                "Four surfaces to support an outing. Account and language stay secondary; recording a discovery is always within reach.",
              ])}
            </p>
          </SectionHeading>
          <div className={styles.surfaceList}>
            {appSurfaces.map((item, index) => (
              <article key={item.title[0]}>
                <span aria-hidden="true">0{index + 1}</span>
                <h3>{say(item.title)}</h3>
                <p>{say(item.body)}</p>
              </article>
            ))}
          </div>
          <div className={styles.twoColumns}>
            <article>
              <h3>
                {say([
                  "Una cuenta, tus recuerdos",
                  "One account, your memories",
                ])}
              </h3>
              <p>
                {say([
                  "Reutilizar el registro y acceso por correo y contraseña de Fruitful Lab, con la misma base de usuarios. Los hallazgos y fotos tendrán dueño y persistencia. Compartir con la partida solo la evidencia elegida; las notas privadas siguen privadas.",
                  "Reuse Fruitful Lab’s email/password registration and sign-in with the same user database. Discoveries and photos will have ownership and persistence. Share only selected evidence with the battle; private notes stay private.",
                ])}
              </p>
            </article>
            <article>
              <h3>
                {say([
                  "Volver sin perder lo que hiciste",
                  "Return without losing your work",
                ])}
              </h3>
              <p>
                {say([
                  "Distinguir borrador, entrega recibida y resultado confirmado. Si falla la subida o expira la sesión, conservar foto y texto para reintentar sin duplicados. Guardar la recepción por separado de la fecha de actividad. La sincronización sin conexión aún es futura.",
                  "Distinguish a draft, a received submission and a confirmed outcome. If upload fails or a session expires, preserve the photo and text for a duplicate-free retry. Keep receipt time separate from activity date. Offline synchronization remains future work.",
                ])}
              </p>
            </article>
          </div>
          <div className={styles.implementation}>
            <div>
              <span className={styles.badge}>
                {say(["Prototipo actual", "Current prototype"])}
              </span>
              <h3>
                {say([
                  "Lo que ya puedes recorrer",
                  "What you can explore today",
                ])}
              </h3>
              <p>
                {say([
                  "Mapa de 16 alcaldías, 3 zonas, 4 historias bilingües, capas de Metro y Cablebús, capítulo de orientación y juegos de náhuatl. Dos perfiles locales, bitácora, fotos y puntos en este navegador.",
                  "A map of 16 boroughs, 3 zones, 4 bilingual stories, Metro and Cablebús layers, an orientation chapter and Náhuatl games. Two local profiles, a journal, photos and points in this browser.",
                ])}
              </p>
              <p className={styles.small}>
                {say([
                  "Puntaje actual: 10 por historia, 25 por visita y 15 por foto; hasta 225 de aprendizaje. Son reglas del prototipo, no puntos confiables de una competencia entre cuentas.",
                  "Current scoring: 10 per story, 25 per visit and 15 per photo; up to 225 from learning. These are prototype rules, not trusted scores for an account-based battle.",
                ])}
              </p>
              <Link className={styles.textLink} href="/mexico-city">
                {say(["Recorrer el prototipo", "Explore the prototype"])} →
              </Link>
            </div>
            <div>
              <span className={styles.badge}>
                {say(["Próxima implementación", "Next implementation"])}
              </span>
              <h3>
                {say(["Lo que falta conectar", "What still needs connecting"])}
              </h3>
              <p>
                {say([
                  "Cuentas dentro del juego, fotos compartidas con acceso controlado, hallazgos fuera de los cuatro puntos, retos con tiempo, revisión mutua, comodines y resultados persistentes. El selector Susy / Stepan de hoy no es autenticación.",
                  "In-game accounts, shared photos with access control, discoveries beyond the four pins, timed challenges, peer review, wildcards and persistent outcomes. Today’s Susy / Stepan selector is not authentication.",
                ])}
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section} id="futuro">
          <SectionHeading
            number="06"
            title={[
              "Primero nosotros. Después, veremos.",
              "First, us. Then, we’ll see.",
            ]}
          >
            <p>
              {say([
                "Dos posibilidades que vale la pena guardar. Ninguna amplía el alcance de la primera partida entre Susy y Stepan.",
                "Two possibilities worth keeping. Neither expands the scope of the first game between Susy and Stepan.",
              ])}
            </p>
          </SectionHeading>
          <div className={styles.futureModes}>
            <article>
              <span className={styles.badge}>
                {say(["Después / a solas", "Later / solo"])}
              </span>
              <h3>
                {say([
                  "Tu propia colección de ciudad",
                  "Your own collection of the city",
                ])}
              </h3>
              <p>
                {say([
                  "El sistema ofrece metas para esta salida o este día. Una sesión de invitado puede ser completa sin registro ni progreso guardado; una cuenta permite conservarlo. Sin rival ni revisión obligatoria.",
                  "The system offers goals for this outing or day. A guest session can be complete without registration or saved progress; an account can retain it. No opponent or required review.",
                ])}
              </p>
              <p>
                {say([
                  "Con registros suficientes, mostrar patrones reales: “Tus últimos seis hallazgos fueron librerías. ¿Se te antoja probar un mercado?” Se vale seguir con librerías. Contar lo registrado, sin inventar el resto de la vida de la persona.",
                  "With enough records, reflect actual patterns: “Your last six discoveries were bookstores. Fancy trying a market?” More bookstores is a valid choice. Describe logged activity without inventing the rest of someone’s life.",
                ])}
              </p>
            </article>
            <article>
              <span className={styles.badge}>
                {say(["Después / comunidad", "Later / community"])}
              </span>
              <h3>
                {say([
                  "Una ciudad que aparece entre todos",
                  "A city revealed together",
                ])}
              </h3>
              <p>
                {say([
                  "Un mapa va tomando color con aportaciones a una bitácora colectiva. Metas compartidas y nuevas invitaciones donde hay menos registros. Puedes hacer un reto sin registrarte ni reportarlo; también cuenta como experiencia.",
                  "A map gains color as people contribute to a shared logbook. Collective goals and new prompts where there are fewer records. You can do a quest without registering or reporting it; the experience still counts.",
                ])}
              </p>
              <p>
                {say([
                  "Gris significa “aún no representado”, nunca “sin valor”. Propuesta: contribuciones moderadas y conexión a través de lugares, sin ubicaciones de personas en vivo. Conocer gente puede surgir; no es una condición para participar.",
                  "Gray means “not yet represented,” never “worthless.” Proposal: moderated contributions and connections through places, without live player locations. Meeting people may follow; it is not a condition of participation.",
                ])}
              </p>
            </article>
          </div>
          <details className={styles.reading}>
            <summary>
              {say([
                "Lecturas para pensar el experimento colectivo",
                "Reading for the collective experiment",
              ])}
            </summary>
            <p>
              {say([
                "Referencias para hacer mejores preguntas; no demuestran que esta idea vaya a funcionar. Probar si la salida gusta, si contribuir se siente valioso y si ver otros hallazgos invita a volver.",
                "References for better questions; they do not prove this idea will work. Test whether the outing is enjoyable, contributing feels worthwhile, and others’ discoveries encourage a return.",
              ])}
            </p>
            <ul>
              <li>
                <a href="https://participatorymuseum.org/chapter3/">
                  Nina Simon · The Participatory Museum ↗
                </a>
                <span>
                  {say([
                    "De lo individual a lo colectivo. Seguir con el capítulo 10 sobre evaluación.",
                    "From individual to collective. Continue with chapter 10 on evaluation.",
                  ])}
                </span>
              </li>
              <li>
                <a href="https://www.gmfus.org/download/article/21466">
                  Mapatón CDMX ↗
                </a>
                <span>
                  {say([
                    "Mapeo colectivo con premios y reclutamiento organizado; no prueba participación espontánea sin incentivos.",
                    "Collective mapping with prizes and organized recruitment; not proof of spontaneous participation without incentives.",
                  ])}
                </span>
              </li>
              <li>
                <a href="https://www.blasttheory.co.uk/projects/rider-spoke/">
                  Blast Theory · Rider Spoke ↗
                </a>
                <span>
                  {say([
                    "Conexión asíncrona mediante historias ligadas a lugares.",
                    "Asynchronous connection through place-based stories.",
                  ])}
                </span>
              </li>
              <li>
                <a href="https://mitpress.mit.edu/9780262528917/building-successful-online-communities/">
                  Kraut & Resnick · Building Successful Online Communities ↗
                </a>
                <span>
                  {say([
                    "Qué sostiene la contribución y el regreso.",
                    "What sustains contribution and return visits.",
                  ])}
                </span>
              </li>
            </ul>
          </details>
        </section>

        <section className={styles.section} id="decisiones">
          <SectionHeading
            number="07"
            title={[
              "Lo que todavía vamos a descubrir.",
              "What we still need to discover.",
            ]}
          >
            <p>
              {say([
                "Este cuaderno conserva tanto los acuerdos como las diferencias. Tener una idea escrita no la vuelve una decisión tomada.",
                "This notebook preserves agreements and differences alike. Writing an idea down does not make it a settled decision.",
              ])}
            </p>
          </SectionHeading>
          <div className={styles.questions}>
            {openDecisions.map((item) => (
              <article key={item.title[0]}>
                <span aria-hidden="true">?</span>
                <div>
                  <h3>{say(item.title)}</h3>
                  <p>{say(item.body)}</p>
                </div>
              </article>
            ))}
          </div>
          <ol className={styles.roadmap}>
            {deliverySteps.map((item, index) => (
              <li key={item.title[0]}>
                <span aria-hidden="true">0{index + 1}</span>
                <h3>{say(item.title)}</h3>
                <p>{say(item.body)}</p>
              </li>
            ))}
          </ol>
        </section>
        <section
          className={styles.references}
          aria-labelledby="reference-title"
        >
          <p className={styles.eyebrow}>
            {say(["Referencias de diseño", "Design references"])}
          </p>
          <h2 id="reference-title">
            {say(["Ideas que nos ayudan a mirar.", "Ideas that help us look."])}
          </h2>
          <p>
            {say([
              "Puntos de partida para nuestras decisiones de interfaz; no usamos assets de estos juegos.",
              "Starting points for our interface decisions; we do not use assets from these games.",
            ])}
          </p>
          <div>
            {references.map((item) => (
              <a key={item.name} href={item.url}>
                <strong>
                  {item.name} <span aria-hidden="true">↗</span>
                </strong>
                <span>{say(item.title)}</span>
                <small>{say(item.body)}</small>
              </a>
            ))}
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <div>
          <strong lang="en">Mexico city discovery game</strong>
          <p>
            {say([
              "Referencia de trabajo · una ciudad, muchas posibilidades",
              "Working reference · one city, many possibilities",
            ])}
          </p>
        </div>
        <Link className={styles.textLink} href="/mexico-city">
          {say(["Volver a la ciudad", "Back to the city"])} ↗
        </Link>
        <a className={styles.textLink} href="#design-title">
          {say(["Volver arriba", "Back to top"])} ↑
        </a>
      </footer>
    </div>
  );
}

export default function GameDesign() {
  return (
    <LocaleProvider>
      <DesignContent />
    </LocaleProvider>
  );
}
