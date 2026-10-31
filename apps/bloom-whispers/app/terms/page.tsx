import type { Metadata } from "next";
import Image from "next/image";
import { GlitterField } from "@/components/GlitterField";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import styles from "../LegalPage.module.css";

export const metadata: Metadata = {
  title: "Terms",
  description: "Plain-language terms for Bloom Whispers.",
};

export default function TermsPage() {
  return (
    <article className={styles.legalPage}>
      <section className={styles.legalHero}>
        <GlitterField className="site-glitter--section" />
        <Image className={styles.heroBloom} src="/assets/flower-white-bloom.png" alt="" width={700} height={875} priority />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Bloom Whispers</p>
          <h1>Terms</h1>
          <p>A simple note about using this site, reading our content, and joining future Bloom Whispers updates.</p>
        </div>
      </section>

      <div className={styles.contentShell}>
        <div className={styles.legalCard}>
          <p className={styles.updated}>Last updated May 28, 2026</p>

          <section>
            <h2>Using Bloom Whispers</h2>
            <p>
              By using {SITE_NAME}, you agree to enjoy the site respectfully and to avoid interfering with the site,
              copying it in a misleading way, or using it for anything unlawful.
            </p>
          </section>

          <section>
            <h2>Editorial content</h2>
            <p>
              Bloom Whispers shares flower meanings, folklore, stories, rituals, podcast notes, and creative inspiration.
              This content is for editorial and educational enjoyment. It is not medical, legal, financial, or other
              professional advice.
            </p>
          </section>

          <section>
            <h2>Future products and waitlists</h2>
            <p>
              The Bloom Shop is currently a coming-soon experience. Category clicks, waitlists, and product language may
              be used to understand interest before final products are created. Product details, pricing, and availability
              may change before launch.
            </p>
          </section>

          <section>
            <h2>Intellectual property</h2>
            <p>
              Unless otherwise noted, the writing, design direction, brand elements, and original Bloom Whispers
              materials belong to Bloom Whispers. Please do not copy, resell, or republish them as your own.
            </p>
          </section>

          <section>
            <h2>Links and outside platforms</h2>
            <p>
              This site may link to outside platforms such as podcast players, social media, email tools, or future shop
              systems. Those platforms have their own policies and terms.
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
