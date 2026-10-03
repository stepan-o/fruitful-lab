import Link from "next/link";
import { notFound } from "next/navigation";
import { decks, deckNames, type Deck } from "@/lib/loopforge/content";
import Chrome from "@/components/loopforge/Chrome";
import Art from "@/components/loopforge/Art";
import Conveyor from "@/components/loopforge/Conveyor";
import Exhibits from "@/components/loopforge/Exhibits";
import styles from "@/components/loopforge/loopforge.module.css";
export function generateStaticParams() {
  return Object.entries(decks).flatMap(([deck, chapters]) =>
    chapters.map((c) => ({ deck, chapter: c.id })),
  );
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ deck: string; chapter: string }>;
}) {
  const p = await params;
  const chapter =
    p.deck === "overview" || p.deck === "architecture"
      ? decks[p.deck].find((c) => c.id === p.chapter)
      : undefined;
  return {
    title: chapter ? `${chapter.title} · Loopforge` : "Loopforge",
    description: chapter?.lead,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ deck: string; chapter: string }>;
}) {
  const p = await params;
  if (p.deck !== "overview" && p.deck !== "architecture") notFound();
  const deck = p.deck as Deck;
  const chapters = decks[deck];
  const index = chapters.findIndex((c) => c.id === p.chapter);
  if (index < 0) notFound();
  const chapter = chapters[index];
  const url = (id: string) => `/stepanoskin/loopforge/${deck}/${id}`;
  return (
    <div className={styles.page}>
      <a href="#chapter" className={styles.skip}>
        Skip to chapter
      </a>
      <Chrome deck={deck} />
      <div className={styles.reader}>
        <aside className={styles.sidebar}>
          <p className={styles.eyebrow}>
            {deck === "overview" ? "01 / FIELD GUIDE" : "02 / ENGINEERING"}
          </p>
          <h2>{deckNames[deck]}</h2>
          <nav aria-label="Chapters">
            {chapters.map((c, i) => (
              <Link
                key={c.id}
                href={url(c.id)}
                aria-current={i === index ? "page" : undefined}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {c.title}
                <i />
              </Link>
            ))}
          </nav>
          <div className={styles.sidebarFoot}>
            <span>RESEARCH → PLAY</span>
            <p>
              A factory for learning
              <br />
              how worlds become stories.
            </p>
            <Link href="/stepanoskin/loopforge/play">
              Open the prototype ↗
            </Link>
          </div>
        </aside>
        <main id="chapter" className={styles.chapter} key={chapter.id}>
          <div className={styles.chapterMeta}>
            <span>{deckNames[deck]}</span>
            <span>
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(chapters.length).padStart(2, "0")}
            </span>
          </div>
          <section className={styles.hero}>
            <Art id={chapter.art} caption={chapter.caption} hero />
            <div className={styles.heroShade} />
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{chapter.kicker}</p>
              <h1>
                {chapter.heading.split("\n").map((line, i) => (
                  <span
                    key={line}
                    className={i === 1 ? styles.accent : undefined}
                  >
                    {line}{" "}
                  </span>
                ))}
              </h1>
              <p className={styles.lead}>{chapter.lead}</p>
            </div>
            <span className={styles.heroStamp}>
              LF / {deck === "overview" ? "WORLD" : "SYSTEM"} /{" "}
              {String(index + 1).padStart(2, "0")}
            </span>
          </section>
          <Conveyor />
          <div className={styles.chapterBody}>
            <div className={styles.sectionHeading}>
              <span className={styles.eyebrow}>WORKING EXHIBIT</span>
              <span>Explore the idea ↓</span>
            </div>
            <Exhibits kind={chapter.exhibit} />
            <div className={styles.essay}>
              {chapter.sections.map((s, i) => (
                <section key={s.title}>
                  <span className={styles.sectionNumber}>0{i + 1}</span>
                  <h2>{s.title}</h2>
                  <p>{s.body}</p>
                </section>
              ))}
            </div>
            <blockquote className={styles.principle}>
              <span>DESIGN PRINCIPLE</span>
              {chapter.principle}
            </blockquote>
            <details className={styles.notes}>
              <summary>Provenance & engineering notes</summary>
              <p>
                Owner-supplied Loopforge concept art. This is a redesigned
                eight-shift teaching prototype. The archived Python system,
                current slice and future production pipeline are distinguished
                in the text. Character lines in exhibits are authored
                illustrations; they are not live model output.
              </p>
              {chapter.sources?.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noreferrer">
                  {s.label} ↗
                </a>
              ))}
            </details>
            <nav className={styles.chapterPager} aria-label="Continue reading">
              {index > 0 ? (
                <Link href={url(chapters[index - 1].id)}>
                  <small>← PREVIOUS</small>
                  {chapters[index - 1].title}
                </Link>
              ) : (
                <Link href="/stepanoskin/loopforge">
                  <small>← ENTRANCE</small>Main menu
                </Link>
              )}
              {index < chapters.length - 1 ? (
                <Link href={url(chapters[index + 1].id)}>
                  <small>NEXT CHAPTER →</small>
                  {chapters[index + 1].title}
                </Link>
              ) : (
                <Link
                  href={
                    deck === "overview"
                      ? "/stepanoskin/loopforge/architecture/the-thesis"
                      : "/stepanoskin/loopforge/play"
                  }
                >
                  <small>CONTINUE →</small>
                  {deck === "overview"
                    ? "Inside the engine"
                    : "Enter the factory"}
                </Link>
              )}
            </nav>
          </div>
        </main>
      </div>
      <footer className={styles.footer}>
        <span>LOOPFORGE / A WORKING STUDY</span>
        <span>Truth stays clean. Story gets messy.</span>
      </footer>
      <div className={styles.perimeter}>
        <Conveyor quiet />
      </div>
    </div>
  );
}
