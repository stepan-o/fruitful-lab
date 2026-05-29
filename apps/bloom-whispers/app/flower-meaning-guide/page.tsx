import type { Metadata } from "next";
import Image from "next/image";
import { GlitterField } from "@/components/GlitterField";
import styles from "./FlowerMeaningGuidePage.module.css";

const occasions = [
  { label: "Valentine's / Romance", image: "/assets/red-rose-bloom.png" },
  { label: "Mother's Day / Gratitude", image: "/assets/flower-white-bloom1.png" },
  { label: "Birthday", image: "/assets/purple-bloom-cluster.png" },
  { label: "Sympathy", image: "/assets/quiz-result-snowdrop.png" },
  { label: "Housewarming", image: "/assets/quiz-result-camellia.png" },
  { label: "Newborn / Baby Shower", image: "/assets/quiz-result-bluebell.png" },
] as const;

const guideFeatures = [
  {
    title: "Flower meaning chart",
    body: "A quick-reference chart of popular flowers and their meanings.",
    icon: "book",
  },
  {
    title: "Common flowers",
    body: "Profiles of classic blooms and what they represent.",
    icon: "flower",
  },
  {
    title: "Occasion guidance",
    body: "Tips for choosing the perfect flowers for life's moments.",
    icon: "gift",
  },
  {
    title: "Human-researched sources",
    body: "Meaningful insights gathered from trusted florists and references.",
    icon: "search",
  },
  {
    title: "Easy-to-save PDF",
    body: "Beautifully designed. Easy to save, share, and return to.",
    icon: "pdf",
  },
] as const;

export const metadata: Metadata = {
  title: "Flower Meaning Guide",
  description:
    "Get the Bloom Whispers Flower Meaning Guide, a free guide for choosing the right flowers for gifts, occasions, moods, and everyday meaning.",
};

function FeatureIcon({ type }: { type: (typeof guideFeatures)[number]["icon"] }) {
  if (type === "book") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M7 7.2h7.1a4 4 0 0 1 4 4v13.4H11a4 4 0 0 0-4 4V7.2Z" />
        <path d="M25 7.2h-7.1a4 4 0 0 0-4 4v13.4H21a4 4 0 0 1 4 4V7.2Z" />
      </svg>
    );
  }

  if (type === "flower") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 17.8c4.6-4 4.6-9.3 0-13.3c-4.6 4-4.6 9.3 0 13.3Z" />
        <path d="M15.5 17.2c-5.8-1.4-9.8 1.3-11.2 6.9c5.9 1.4 9.9-1.2 11.2-6.9Z" />
        <path d="M16.5 17.2c5.8-1.4 9.8 1.3 11.2 6.9c-5.9 1.4-9.9-1.2-11.2-6.9Z" />
        <path d="M16 17.8v9.4" />
      </svg>
    );
  }

  if (type === "gift") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6.8 13.2h18.4v13.2H6.8z" />
        <path d="M5 9.2h22v4H5z" />
        <path d="M16 9.2v17.2" />
        <path d="M16 9.2c-3.8-.3-6.1-1.5-6.1-3.2c0-1.4 1.3-2.4 2.8-2.4c2.1 0 3.3 2.4 3.3 5.6Z" />
        <path d="M16 9.2c3.8-.3 6.1-1.5 6.1-3.2c0-1.4-1.3-2.4-2.8-2.4c-2.1 0-3.3 2.4-3.3 5.6Z" />
      </svg>
    );
  }

  if (type === "search") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="14" cy="14" r="7.2" />
        <path d="m19.2 19.2 6.1 6.1" />
        <path d="M14 9.8v8.4" />
        <path d="M9.8 14h8.4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M8 4.8h11.2L24 9.6v17.6H8z" />
      <path d="M19.2 4.8v4.8H24" />
      <path d="M11.8 17.2h8.4" />
      <path d="M11.8 21.2h5.8" />
    </svg>
  );
}

export default function FlowerMeaningGuidePage() {
  return (
    <article className={styles.guidePage}>
      <section className={styles.hero}>
        <GlitterField className="site-glitter--section" />
        <Image className={styles.heroGarden} src="/assets/hero-midnight-garden.png" alt="" fill priority sizes="100vw" />
        <Image className={styles.heroWhiteBloom} src="/assets/flower-white-bloom1.png" alt="" width={800} height={1000} priority />

        <div className={styles.heroShell}>
          <div className={styles.copyColumn}>
            <h1>Flowers say something. Here&apos;s the shortcut to saying the right thing.</h1>
            <p>
              Our free guide helps you choose the right flower for the right moment, with meaning, confidence, and a
              little magic.
            </p>

            <div className={styles.occasionHeader}>
              <span />
              <strong>Perfect for moments like...</strong>
              <span />
            </div>

            <div className={styles.occasionGrid}>
              {occasions.map((occasion) => (
                <article className={styles.occasionCard} key={occasion.label}>
                  <Image src={occasion.image} alt="" width={280} height={220} />
                  <p>{occasion.label}</p>
                </article>
              ))}
            </div>

            <p className={styles.alsoHelpful}>
              Also helpful for: <span>Easter / Spring hosting</span> <span>Thank you</span>{" "}
              <span>Congratulations / New job</span> <span>Get well</span> <span>Apology</span>{" "}
              <span>Just because</span>
            </p>
          </div>

          <aside className={styles.signupCard} aria-labelledby="guide-signup-heading">
            <GlitterField className="site-glitter--section" />
            <div className={styles.signupCopy}>
              <p className={styles.eyebrow}>Free Guide</p>
              <h2 id="guide-signup-heading">Get the Flower Meaning Guide</h2>
              <p>A beautifully illustrated PDF to help you choose flowers with meaning.</p>
            </div>
            <Image
              className={styles.guideCover}
              src="/assets/flower-meaning-guide-cover1.png"
              alt="The Flower Meaning Guide cover"
              width={700}
              height={900}
              priority
            />
            <form className={styles.guideForm} aria-label="Get the Flower Meaning Guide">
              <label htmlFor="guide-first-name">First name</label>
              <input id="guide-first-name" name="first-name" type="text" placeholder="Your first name" />
              <label htmlFor="guide-email">Email address</label>
              <input id="guide-email" name="email" type="email" placeholder="you@example.com" required />
              <button type="button">
                Get the Flower Meaning Guide
                <span aria-hidden="true">✦</span>
              </button>
            </form>
            <p className={styles.formNote}>Free PDF. Delivery will connect in the next pass. We&apos;ll never share your information.</p>
          </aside>
        </div>
      </section>

      <section className={styles.insideSection} aria-labelledby="inside-guide-heading">
        <Image className={styles.bottomPurple} src="/assets/purple-bloom-cluster.png" alt="" width={760} height={760} />
        <Image className={styles.bottomRose} src="/assets/red-rose-bloom.png" alt="" width={760} height={760} />
        <div className={styles.insideShell}>
          <div className={styles.insideHeader}>
            <span />
            <h2 id="inside-guide-heading">What&apos;s inside the guide</h2>
            <span />
          </div>
          <div className={styles.featureGrid}>
            {guideFeatures.map((feature) => (
              <article className={styles.featureCard} key={feature.title}>
                <span className={styles.featureIcon}>
                  <FeatureIcon type={feature.icon} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
