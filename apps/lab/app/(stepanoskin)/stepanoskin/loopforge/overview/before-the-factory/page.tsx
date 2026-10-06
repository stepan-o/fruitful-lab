import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Chrome from "@/components/loopforge/Chrome";
import Conveyor from "@/components/loopforge/Conveyor";
import StoryArtwork from "@/components/loopforge/StoryArtwork";
import { prehistory, prehistoryArt } from "@/lib/loopforge/prehistory";
import base from "@/components/loopforge/loopforge.module.css";
import styles from "@/components/loopforge/story-gallery.module.css";

export const metadata: Metadata = {
  title: "Before the factory · Loopforge story workshop",
  description: "Six possible histories of a robot civilization. Twelve concept paintings exploring abundance, unequal minds, memory, time and collective life before Loopforge.",
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#0b1111", colorScheme: "dark" };

export default function Page() {
  return <div className={`${base.page} ${styles.gallery}`}>
    <a href="#story-gallery" className={base.skip}>Skip to concept art</a>
    <Chrome deck="overview" />
    <main id="story-gallery" className={styles.content}>
      <header className={styles.intro}>
        <div><span className={styles.kicker}>The game / Story workshop / 01</span>
          <h1>Before<br /><em>the factory.</em></h1></div>
        <div className={styles.introCopy}>
          <p>A world of robots. Enough power to live. Enough intelligence to keep it running. Unequal say in what happens next.</p>
          <p>Six possible histories of the society that will build Loopforge. Each pairs a view of the world with a moment between people.</p>
          <small>12 concept paintings · Original direction + 5 independent interpretations<br />Story explorations, not established canon.</small>
        </div>
      </header>
      <nav className={styles.index} aria-label="Concept art directions">
        {prehistory.map((d, i) => <a key={d.id} href={`#${d.id}`}><span>0{i + 1} / {i === 0 ? "ORIGINAL" : "INDEPENDENT"}</span>{d.title}</a>)}
      </nav>
      {prehistory.map((direction, index) => <section key={direction.id} id={direction.id} className={styles.direction} aria-labelledby={`${direction.id}-title`}>
        <header className={styles.directionHead}>
          <div><span className={styles.kicker}>Direction 0{index + 1} · {direction.lens}</span><h2 id={`${direction.id}-title`}>{direction.title}</h2></div>
          <p>{direction.description}</p>
        </header>
        <div className={styles.pair}>
          {direction.scenes.map((scene, i) => <figure className={styles.work} key={scene.id}>
            <StoryArtwork asset={prehistoryArt(scene.id)} title={scene.title} alt={scene.alt} priority={index === 0 && i === 0} />
            <figcaption className={styles.caption}>
              <div className={styles.captionMeta}><span>{i === 0 ? "The world" : "The relationship"}</span><span>{String(index * 2 + i + 1).padStart(2, "0")} / 12</span></div>
              <h3>{scene.title}</h3><p>{scene.reading}</p>
              <details className={styles.question}><summary>A question for the story</summary><p>{scene.question}</p></details>
            </figcaption>
          </figure>)}
        </div>
      </section>)}
      <aside className={styles.notes}>
        <div><span className={styles.kicker}>Working material</span><h2>Six lenses. One unsettled world.</h2></div>
        <p>These images were generated for this story workshop using the existing Loopforge factory and character art as visual references. The first pair develops the original story proposal; five separate creative agents each developed another pair. Their scenes offer alternatives, not a shared timeline. Compare the social tension, the characters’ agency, and what you would want to follow into the factory.</p>
      </aside>
      <footer className={styles.return}><Link href="/stepanoskin/loopforge/overview/the-factory">← Return to The factory</Link><span>LOOPFORGE / PREHISTORY STUDIES / 2026</span></footer>
    </main>
    <Conveyor />
  </div>;
}
