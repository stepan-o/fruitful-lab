import Image from "next/image";
import Link from "next/link";
import type { JournalPost } from "@/lib/journalPosts";
import styles from "./JournalPostTemplate.module.css";

export function JournalPostTemplate({ post }: { post: JournalPost }) {
  const onThisPage = [
    { href: "#quick-answer", label: "Quick Answer" },
    { href: "#in-short", label: "In Short" },
    ...post.sections.map((section) => ({ href: `#${section.id}`, label: section.title })),
    { href: "#faq", label: "FAQs" },
  ];

  return (
    <article className={styles.articlePage}>
      <section className={styles.storyMasthead} aria-hidden="true">
        <Image
          className={styles.mastheadFlowerRight}
          src="/assets/journal-right-floral-edge.png"
          alt=""
          width={900}
          height={900}
          priority
        />
        <div className={styles.mastheadStars}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <div className={styles.articleShell}>
        <div className={styles.storyGrid}>
          <header className={styles.heroCopy}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
              <Link href="/">Home</Link>
              <span aria-hidden="true">›</span>
              <Link href="/journal">Journal</Link>
              <span aria-hidden="true">›</span>
              <span>{post.category}</span>
            </nav>

            <p className={styles.categoryPill}>
              {post.category}
              <span aria-hidden="true">✦</span>
            </p>

            <h1>{post.title}</h1>
            <p className={styles.description}>{post.description}</p>

            <div className={styles.metaLine} aria-label="Article details">
              <span>By {post.author}</span>
              <span aria-hidden="true">·</span>
              <time>{post.date}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readTime}</span>
              <span aria-hidden="true">·</span>
              <span>Updated {post.updated}</span>
            </div>

            <section className={styles.quickAnswer} id="quick-answer" aria-labelledby="quick-answer-heading">
              <div className={styles.quickIcon} aria-hidden="true">
                ✦
              </div>
              <div>
                <h2 id="quick-answer-heading">Quick Answer</h2>
                <p>{post.quickAnswer}</p>
              </div>
              <Image src="/assets/flower-pink-rose.png" alt="" width={600} height={600} />
            </section>

            <section className={styles.onThisPage} aria-labelledby="on-this-page-heading">
              <h2 id="on-this-page-heading">On This Page</h2>
              <div>
                {onThisPage.map((item) => (
                  <a href={item.href} key={item.href}>
                    <span aria-hidden="true">✦</span>
                    {item.label}
                  </a>
                ))}
              </div>
            </section>

            <section className={styles.inShort} id="in-short" aria-labelledby="in-short-heading">
              <p className={styles.sectionEyebrow}>In Short</p>
              <h2 id="in-short-heading">The story, gathered simply</h2>
              <ul>
                {post.inShort.map((item) => (
                  <li key={item}>
                    <span aria-hidden="true">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </header>

          <aside className={styles.articleSidebar} aria-label="More from Bloom Whispers">
            <div className={styles.featureCard}>
              <Image src={post.heroImage} alt={post.heroImageAlt} width={1000} height={1500} unoptimized priority />
            </div>

            <section className={styles.takeaways} aria-labelledby="takeaways-heading">
              <h2 id="takeaways-heading">
                <span aria-hidden="true">✦</span>
                Key Takeaways
              </h2>
              <ul>
                {post.keyTakeaways.map((takeaway) => (
                  <li key={takeaway}>
                    <span aria-hidden="true">✧</span>
                    {takeaway}
                  </li>
                ))}
              </ul>
            </section>

            <section className={`${styles.sidebarCard} ${styles.aboutCard}`}>
              <div className={styles.sidebarHeading}>
                <h2>About Bloom Whispers</h2>
                <span aria-hidden="true">✦</span>
              </div>
              <div className={styles.aboutContent}>
                <Image src="/assets/journal-arch.png" alt="" width={900} height={1200} />
                <p>
                  Bloom Whispers is a flower-focused editorial world for meanings, folklore, gentle rituals, podcast
                  notes, and floral curiosities.
                </p>
              </div>
              <Link className={styles.sidebarLink} href="/about">
                Learn more about us
                <span aria-hidden="true">→</span>
              </Link>
            </section>

            <section className={`${styles.sidebarCard} ${styles.quizCard}`}>
              <h2>Get your flower message</h2>
              <p>Take the gentle quiz and receive one bloom, one reflection, and one small ritual for your season.</p>
              <Link className={styles.darkButton} href="/flower-message-quiz">
                Take the Flower Quiz
                <span aria-hidden="true">✦</span>
              </Link>
            </section>

            <section className={`${styles.sidebarCard} ${styles.letterCard}`} id="bloom-letter">
              <div>
                <p className={styles.sidebarEyebrow}>Bloom Letter</p>
                <h2>A little bloom in your inbox</h2>
                <p>Flower meanings, curious stories, and gentle notes from the garden.</p>
              </div>
              <Image src="/assets/bloom-letter-signup-art.png" alt="" width={1200} height={900} />
              <form className={styles.sidebarForm}>
                <label className={styles.visuallyHidden} htmlFor="article-letter-email">
                  Email address
                </label>
                <input id="article-letter-email" placeholder="Your email address" type="email" />
                <button type="button">Subscribe</button>
              </form>
            </section>

            <section className={styles.sidebarCard}>
              <div className={styles.sidebarHeading}>
                <h2>Popular in the Garden</h2>
                <span aria-hidden="true">✦</span>
              </div>
              <div className={styles.relatedList}>
                {post.related.map((item) =>
                  item.href.startsWith("http") ? (
                    <a href={item.href} key={item.href}>
                      <span>{item.label}</span>
                      <strong>{item.title}</strong>
                    </a>
                  ) : (
                    <Link href={item.href} key={item.href}>
                      <span>{item.label}</span>
                      <strong>{item.title}</strong>
                    </Link>
                  ),
                )}
              </div>
            </section>
          </aside>

          <div className={styles.articleBody}>
            {post.sections.map((section) => (
              <section className={styles.articleSection} id={section.id} key={section.id}>
                <h2>{section.title}</h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets ? (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
                {section.snippet ? (
                  <aside className={styles.snippetBox}>
                    <strong>{section.snippet.title}</strong>
                    <p>{section.snippet.text}</p>
                  </aside>
                ) : null}
              </section>
            ))}

            <section className={styles.faqSection} id="faq" aria-labelledby="faq-heading">
              <p className={styles.sectionEyebrow}>Frequently Asked Questions</p>
              <h2 id="faq-heading">Questions from the garden</h2>
              <div>
                {post.faqs.map((faq) => (
                  <details key={faq.question}>
                    <summary>{faq.question}</summary>
                    <p>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
    </article>
  );
}
