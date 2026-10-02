import type { Metadata } from "next";
import Image from "next/image";
import { GlitterField } from "@/components/GlitterField";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import styles from "../LegalPage.module.css";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: "Plain-language affiliate disclosure for Bloom Whispers.",
};

export default function AffiliateDisclosurePage() {
  return (
    <article className={styles.legalPage}>
      <section className={styles.legalHero}>
        <GlitterField className="site-glitter--section" />
        <Image className={styles.heroBloom} src="/assets/flower-white-bloom.png" alt="" width={700} height={875} priority />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Bloom Whispers</p>
          <h1>Affiliate Disclosure</h1>
          <p>A simple note about affiliate links, recommendations, and how Bloom Whispers may earn from purchases.</p>
        </div>
      </section>

      <div className={styles.contentShell}>
        <div className={styles.legalCard}>
          <p className={styles.updated}>Last updated August 13, 2026</p>

          <section>
            <h2>Our affiliate note</h2>
            <p>
              Some pages on {SITE_NAME} may include affiliate links. If you click one of those links and make a
              purchase, Bloom Whispers may earn a commission at no extra cost to you.
            </p>
          </section>

          <section>
            <h2>Amazon Associates disclosure</h2>
            <p className={styles.plainNote}>As an Amazon Associate I earn from qualifying purchases.</p>
          </section>

          <section>
            <h2>How recommendations work</h2>
            <p>
              Bloom Whispers shares flower-focused editorial content, gift ideas, books, decor, jewelry, tools, and
              other botanical finds that may fit the story or guide you are reading. Affiliate relationships do not
              change the price you pay and do not guarantee that a product is right for every reader.
            </p>
          </section>

          <section>
            <h2>Product details</h2>
            <p>
              Product prices, availability, ratings, and details can change. Please review the current seller listing,
              ingredients, materials, shipping details, and safety information before buying or using any product.
            </p>
          </section>

          <section>
            <h2>Questions</h2>
            <p className={styles.plainNote}>
              Questions can be sent to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </section>
        </div>
      </div>
    </article>
  );
}
