import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EmailSignupForm } from "@/components/EmailSignupForm";
import styles from "./ShopPage.module.css";

const shopCategories = [
  {
    title: "Candles",
    body: "Hand-poured scents inspired by petals, moonlight, and quiet rituals.",
    image: "/assets/shop-home-decor.png",
  },
  {
    title: "Jewelry",
    body: "Wearable flower symbols and little reminders of what is blooming in you.",
    image: "/assets/shop-jewelry.png",
  },
  {
    title: "Printables",
    body: "Art prints, cards, prompts, and digital treasures for the flower-minded.",
    image: "/assets/shop-printables.png",
  },
  {
    title: "Starter Kits",
    body: "Seeds, growing notes, and tiny tools for bringing more flowers home.",
    image: "/assets/shop-seeds-growing-kits.png",
  },
] as const;

export const metadata: Metadata = {
  title: "Shop Coming Soon",
  description:
    "Join the Bloom Whispers shop waitlist for flower-inspired goods, ritual pieces, printables, jewelry, and meaningful gifts.",
};

export default function ShopPage() {
  return (
    <article className={styles.shopPage}>
      <section className={styles.hero} aria-labelledby="shop-heading">
        <Image
          className={styles.leftFloral}
          src="/assets/shop-floral-left-frame.png"
          alt=""
          width={900}
          height={900}
          priority
        />
        <Image
          className={styles.rightFloral}
          src="/assets/shop-floral-right-frame.png"
          alt=""
          width={900}
          height={900}
          priority
        />
        <div className={styles.glitterField} aria-hidden="true">
          {Array.from({ length: 18 }).map((_, index) => (
            <span className={styles[`glitter${index + 1}`]} key={index} />
          ))}
        </div>

        <div className={styles.panel}>
          <div className={styles.copyColumn}>
            <p className={styles.eyebrow}>The Bloom Shop</p>
            <h1 id="shop-heading">Something beautiful is growing</h1>
            <span className={styles.divider} aria-hidden="true">
              ✦
            </span>
            <p>
              Join the waitlist for first access to the Bloom Whispers shop, a curated collection of
              flower-inspired goods, ritual pieces, and meaningful gifts.
            </p>

            <ul className={styles.promiseList}>
              <li>Thoughtful, flower-inspired creations</li>
              <li>Rooted in nature and meaning</li>
              <li>Made for slow living and simple rituals</li>
              <li>Perfect for gifting or keeping</li>
            </ul>

            <EmailSignupForm
              buttonChildren={
                <>
                  Join the waitlist
                  <span aria-hidden="true">✦</span>
                </>
              }
              buttonLabel="Join the waitlist"
              className={styles.waitlistForm}
              group="shop-waitlist"
              inputIcon={<span aria-hidden="true">✉</span>}
              inputId="shop-page-email"
              inputWrapClassName={styles.inputWrap}
              source="shop_page_waitlist"
            />

            <p className={styles.note}>We will never share your email. Unsubscribe anytime.</p>
          </div>

          <div className={styles.moodboard} aria-label="Bloom shop product preview">
            <p className={styles.collectionLabel}>A curated collection</p>
            <p className={styles.collectionLine}>For the flower lovers & dreamers</p>
            <div className={styles.productStack}>
              {shopCategories.map((category, index) => (
                <Link
                  className={`${styles.productCard} ${styles[`productCard${index + 1}`]}`}
                  href="#shop-waitlist"
                  key={category.title}
                  data-shop-interest={category.title}
                >
                  <Image src={category.image} alt="" width={720} height={520} sizes="(max-width: 900px) 44vw, 280px" />
                  <span>{category.title}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.categoryRail} id="shop-waitlist">
            {shopCategories.map((category) => (
              <a href="#shop-page-email" className={styles.railItem} key={category.title} data-shop-interest={category.title}>
                <span aria-hidden="true">✦</span>
                <strong>{category.title}</strong>
                <small>{category.body}</small>
              </a>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
