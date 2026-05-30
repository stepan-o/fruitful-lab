import type { Metadata } from "next";
import Image from "next/image";
import { ContactSubmissionForm } from "@/components/ContactSubmissionForm";
import { GlitterField } from "@/components/GlitterField";
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

            <ContactSubmissionForm
              buttonLabel="Send Your Note"
              className={styles.contactForm}
              messageLabel="Your message"
              messagePlaceholder="Your message"
              note="Your note is safe with us. We'll get back to you as soon as we can."
              noteClassName={styles.formNote}
              showTopic
              twoFieldsClassName={styles.twoFields}
              type="contact"
            />
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

            <ContactSubmissionForm
              buttonClassName={styles.guestButton}
              buttonLabel="Pitch a Guest Idea"
              className={styles.contactForm}
              defaultTopic="Guest pitch"
              messageLabel="Why you'd be a lovely fit"
              messagePlaceholder="Tell us about your story, expertise, or flower-connected idea"
              note="We review every pitch personally and will be in touch if it feels like a match."
              noteClassName={styles.formNote}
              twoFieldsClassName={styles.twoFields}
              type="guest"
            />
          </section>
        </div>
      </section>
    </article>
  );
}
