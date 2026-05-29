import type { Metadata } from "next";
import Image from "next/image";
import { GlitterField } from "@/components/GlitterField";
import { CONTACT_EMAIL } from "@/lib/site";
import styles from "./ContactPage.module.css";

const guestInterests = [
  "Flower folklore & cultural stories",
  "History, traditions, and symbolism",
  "Fun flower facts or botanical knowledge",
  "Gardening, growing, and plant care",
  "Floral design, art, craft, or creative work",
  "Food, tea, scent, gifting, and everyday flower uses",
  "Rituals, meaning, and intentional living",
  "Podcast guest ideas or personal flower stories",
];

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Bloom Whispers for general inquiries, collaborations, guest ideas, flower stories, folklore, and botanical conversations.",
};

export default function ContactPage() {
  return (
    <article className={styles.contactPage}>
      <section className={styles.heroSection}>
        <GlitterField className="site-glitter--section" />
        <Image className={styles.heroWhiteBloom} src="/assets/flower-white-bloom.png" alt="" width={700} height={875} priority />
        <Image className={styles.heroRose} src="/assets/flower-pink-rose.png" alt="" width={600} height={600} priority />
        <div className={styles.heroContent}>
          <div className={styles.heroTabs} aria-label="Contact page sections">
            <a href="#general-contact">General Contact</a>
            <a href="#be-a-guest">Be a Guest</a>
          </div>
          <h1>Send a note to the garden</h1>
          <p>
            We&apos;d love to hear from you. Whether you&apos;re a reader, collaborator, or future guest, let&apos;s
            grow something meaningful together.
          </p>
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.contactGrid}>
          <section className={styles.contactCard} id="general-contact" aria-labelledby="general-heading">
            <p className={styles.starEyebrow}>✦</p>
            <h2 id="general-heading">General Contact</h2>
            <p>Questions, kind words, feedback, or collaborations. We&apos;re all ears in the garden.</p>

            <form action={`mailto:${CONTACT_EMAIL}`} className={styles.contactForm} encType="text/plain" method="post">
              <div className={styles.twoFields}>
                <label>
                  <span>Your name</span>
                  <input name="name" placeholder="Your name" type="text" />
                </label>
                <label>
                  <span>Your email</span>
                  <input name="email" placeholder="Your email" required type="email" />
                </label>
              </div>
              <label>
                <span>What&apos;s this about?</span>
                <select defaultValue="" name="topic" required>
                  <option disabled value="">
                    What&apos;s this about?
                  </option>
                  <option>General question</option>
                  <option>Collaboration</option>
                  <option>Flower meaning or story idea</option>
                  <option>Press or partnership</option>
                  <option>Something else</option>
                </select>
              </label>
              <label>
                <span>Your message</span>
                <textarea name="message" placeholder="Your message" required rows={5} />
              </label>
              <button type="submit">
                Send Your Note
                <span aria-hidden="true">✦</span>
              </button>
              <p className={styles.formNote}>Your note is safe with us. We&apos;ll get back to you as soon as we can.</p>
            </form>
          </section>

          <section className={styles.contactCard} id="be-a-guest" aria-labelledby="guest-heading">
            <p className={styles.starEyebrow}>✦</p>
            <h2 id="guest-heading">Be a Guest</h2>
            <p>We love welcoming thoughtful voices to the garden. Have a story, idea, or unique perspective to share?</p>

            <div className={styles.interestBox}>
              <Image src="/assets/flower-white-bloom.png" alt="" width={700} height={875} />
              <div>
                <p>We&apos;re especially interested in:</p>
                <ul>
                  {guestInterests.map((interest) => (
                    <li key={interest}>
                      <span aria-hidden="true">✦</span>
                      {interest}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <form action={`mailto:${CONTACT_EMAIL}`} className={styles.contactForm} encType="text/plain" method="post">
              <div className={styles.twoFields}>
                <label>
                  <span>Your name</span>
                  <input name="guest-name" placeholder="Your name" type="text" />
                </label>
                <label>
                  <span>Your email</span>
                  <input name="guest-email" placeholder="Your email" required type="email" />
                </label>
              </div>
              <label>
                <span>Why you&apos;d be a lovely fit</span>
                <textarea
                  name="guest-pitch"
                  placeholder="Tell us about your story, expertise, or flower-connected idea"
                  required
                  rows={4}
                />
              </label>
              <button className={styles.guestButton} type="submit">
                Pitch a Guest Idea
                <span aria-hidden="true">✦</span>
              </button>
              <p className={styles.formNote}>We review every pitch personally and will be in touch if it feels like a match.</p>
            </form>
          </section>
        </div>
      </section>
    </article>
  );
}
