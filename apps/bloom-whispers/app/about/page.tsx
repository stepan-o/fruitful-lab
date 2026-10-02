import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GlitterField } from "@/components/GlitterField";
import { GuestInterestForm } from "@/components/GuestInterestForm";
import styles from "./AboutPage.module.css";

const findItems = [
  {
    title: "Flower Meanings & Symbolism",
    body: "Explore the language of flowers and what each bloom can hold.",
    icon: "✽",
  },
  {
    title: "Stories & Folklore",
    body: "Timeless tales, cultural traditions, and the magic behind the blooms.",
    icon: "▱",
  },
  {
    title: "Inspired Living",
    body: "Simple ideas for a more beautiful, intentional, and nature-connected life.",
    icon: "♧",
  },
  {
    title: "Gentle Encouragement",
    body: "Thoughtful reflections and reminders to bloom in your own way.",
    icon: "✉",
  },
];

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Bloom Whispers, a personal flower-focused editorial world for meanings, folklore, stories, and quiet botanical beauty.",
};

export default function AboutPage() {
  return (
    <article className={styles.aboutPage}>
      <section className={styles.gardenMasthead} aria-hidden="true">
        <GlitterField className="site-glitter--section" />
        <Image className={styles.mastheadBloom} src="/assets/flower-white-bloom.png" alt="" width={600} height={760} priority />
        <Image
          className={styles.mastheadFloral}
          src="/assets/journal-right-floral-edge.png"
          alt=""
          width={900}
          height={900}
          priority
        />
        <span className={styles.mastheadStar}>✦</span>
      </section>

      <section className={styles.introSection}>
        <div className={styles.sectionShell}>
          <p className={styles.kicker}>About Bloom Whispers</p>
          <h1>About Bloom Whispers</h1>
          <p className={styles.poeticLine}>
            To help you discover the quiet magic of flowers through their meanings, their stories, and the beauty they
            bring to everyday life.
          </p>

          <div className={styles.meaningGrid}>
            <div className={styles.flowerFrame}>
              <Image src="/assets/flower-white-bloom.png" alt="" width={900} height={1125} />
              <span className={styles.floatStarOne}>✦</span>
              <span className={styles.floatStarTwo}>✦</span>
            </div>

            <div className={styles.meaningCopy}>
              <p className={styles.eyebrow}>What Bloom Whispers Is</p>
              <h2>A space for floral meaning, storytelling, and everyday beauty.</h2>
              <p>
                Bloom Whispers is a floral lifestyle destination for dreamers, gardeners, creatives, and flower lovers.
                Here, we explore the symbolism, folklore, and hidden language of flowers, rooted in nature and
                imagination.
              </p>
              <p>
                Whether you are looking for the perfect bloom to express a feeling, a thoughtful story to brighten your
                day, or inspiration to live a more meaningful, nature-connected life, you are in the right place.
              </p>
              <p className={styles.boldNote}>This is where every flower tells a story, and so can you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.susySection}>
        <div className={`${styles.sectionShell} ${styles.susyGrid}`}>
          <div className={styles.susyCopy}>
            <p className={styles.eyebrow}>Meet Susy</p>
            <h2>The heart behind Bloom Whispers.</h2>
            <p>
              Hi, I&apos;m Susy, a flower lover, storyteller, and believer in the little things that bring beauty to our
              days.
            </p>
            <p>
              I created Bloom Whispers as a gentle corner of the internet where we can slow down, be inspired by nature,
              and connect through the quiet power of flowers.
            </p>
            <p>
              When I&apos;m not writing or researching floral folklore, you&apos;ll find me with a notebook in the
              garden, a cup of tea in hand, and a bouquet somewhere nearby.
            </p>
          </div>

          <figure className={styles.portraitCard}>
            <Image src="/assets/about-susy-portrait.png" alt="Illustrated portrait of Susy in the Bloom Whispers garden" width={1122} height={1402} />
            <Image className={styles.portraitRose} src="/assets/flower-pink-rose.png" alt="" width={600} height={600} />
          </figure>
        </div>
      </section>

      <section className={styles.findSection}>
        <div className={styles.sectionShell}>
          <p className={styles.eyebrow}>What You&apos;ll Find Here</p>
          <h2>Inspiration rooted in nature and story.</h2>

          <div className={styles.findGrid}>
            {findItems.map((item) => (
              <article className={styles.findItem} key={item.title}>
                <span aria-hidden="true">{item.icon}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaStack}>
        <div className={`${styles.sectionShell} ${styles.bannerStack}`}>
          <section className={styles.guestBanner} aria-labelledby="guest-heading">
            <Image src="/assets/flower-white-bloom.png" alt="" width={600} height={760} />
            <div>
              <h2 id="guest-heading">Be a Guest on Bloom Whispers</h2>
              <p>Do you have a story to share, floral wisdom to offer, or a creative heart that loves flowers too?</p>
            </div>
            <GuestInterestForm className={styles.guestForm} />
          </section>

          <Link className={styles.bottomRibbon} href="/flower-message-quiz">
            <span>Rooted in nature</span>
            <span aria-hidden="true">✦</span>
            <span>Guided by story</span>
            <span aria-hidden="true">✦</span>
            <span>Inspired by beauty</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
