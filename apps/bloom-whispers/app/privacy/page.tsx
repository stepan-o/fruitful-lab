import type { Metadata } from "next";
import Image from "next/image";
import { GlitterField } from "@/components/GlitterField";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import styles from "../LegalPage.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Plain-language privacy policy for Bloom Whispers.",
};

export default function PrivacyPage() {
  return (
    <article className={styles.legalPage}>
      <section className={styles.legalHero}>
        <GlitterField className="site-glitter--section" />
        <Image className={styles.heroBloom} src="/assets/flower-white-bloom.png" alt="" width={700} height={875} priority />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Bloom Whispers</p>
          <h1>Privacy Policy</h1>
          <p>A simple note about what we collect, why we collect it, and how to reach us.</p>
        </div>
      </section>

      <div className={styles.contentShell}>
        <div className={styles.legalCard}>
          <p className={styles.updated}>Last updated May 28, 2026</p>

          <section>
            <h2>Our privacy promise</h2>
            <p>
              {SITE_NAME} is a flower-focused editorial website. We only ask for information when it helps us respond to
              you, send updates you requested, or understand what readers are interested in for future content and
              products.
            </p>
          </section>

          <section>
            <h2>Information you choose to share</h2>
            <p>Depending on how the site is connected at launch, you may choose to share:</p>
            <ul>
              <li>Your email address when joining the Bloom Letter or a shop waitlist.</li>
              <li>Your name, email, and message when using a contact or guest inquiry form.</li>
              <li>Quiz answers or product-category clicks that help us understand reader interests.</li>
            </ul>
          </section>

          <section>
            <h2>How we use it</h2>
            <ul>
              <li>To reply to your message or guest pitch.</li>
              <li>To send Bloom Letter notes or waitlist updates if you sign up.</li>
              <li>To improve the site, content, quiz experience, and future shop direction.</li>
              <li>To keep the site working, secure, and easier to use.</li>
            </ul>
          </section>

          <section>
            <h2>Notes on forms and tools</h2>
            <p>
              Some V1 forms may open your email app or act as visual placeholders until the final newsletter, analytics,
              and form tools are connected. Before public launch, any connected tools should be listed here clearly.
            </p>
          </section>

          <section>
            <h2>Questions</h2>
            <p className={styles.plainNote}>
              This page is a plain-language V1 draft and should be reviewed before public launch. Questions can be sent
              to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
