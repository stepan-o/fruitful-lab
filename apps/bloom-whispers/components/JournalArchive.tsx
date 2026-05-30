"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { getAllJournalPosts } from "@/lib/journalPosts";
import styles from "./JournalArchive.module.css";

type CategoryId = "all" | "meanings" | "profiles" | "stories" | "food" | "podcast" | "guides";

type JournalPost = {
  title: string;
  href: string;
  date: string;
  category: CategoryId;
  label: string;
  excerpt: string;
  image: string;
};

const categories: { id: CategoryId; label: string }[] = [
  { id: "all", label: "All Posts" },
  { id: "meanings", label: "Flower Meanings" },
  { id: "profiles", label: "Flower Profiles" },
  { id: "stories", label: "Folklore & Stories" },
  { id: "food", label: "Floral Food & Drink" },
  { id: "podcast", label: "Podcast" },
  { id: "guides", label: "Guides & Rituals" },
];

const posts: JournalPost[] = getAllJournalPosts().map((post) => ({
  title: post.title,
  href: post.legacyPaths[0],
  date: post.date,
  category: post.categoryId,
  label: post.category,
  excerpt: post.description,
  image: post.heroImage,
}));

const popularPosts = [
  posts[11],
  posts[2],
  posts[6],
];

const POSTS_PER_PAGE = 5;

function filterPost(post: JournalPost, category: CategoryId, query: string) {
  const categoryMatch = category === "all" || post.category === category;
  const search = query.trim().toLowerCase();

  if (!search) {
    return categoryMatch;
  }

  const haystack = `${post.title} ${post.label} ${post.excerpt} ${post.date}`.toLowerCase();
  return categoryMatch && haystack.includes(search);
}

export function JournalArchive() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [emailMessage, setEmailMessage] = useState("");
  const [pageIndex, setPageIndex] = useState(0);

  const categoryCounts = useMemo(() => {
    return categories.reduce<Record<CategoryId, number>>(
      (counts, category) => {
        counts[category.id] =
          category.id === "all" ? posts.length : posts.filter((post) => post.category === category.id).length;
        return counts;
      },
      {
        all: 0,
        meanings: 0,
        profiles: 0,
        stories: 0,
        food: 0,
        podcast: 0,
        guides: 0,
      },
    );
  }, []);

  const visiblePosts = useMemo(
    () => posts.filter((post) => filterPost(post, activeCategory, query)),
    [activeCategory, query],
  );

  const pageCount = Math.max(1, Math.ceil(visiblePosts.length / POSTS_PER_PAGE));
  const currentPageIndex = Math.min(pageIndex, pageCount - 1);
  const pageStart = currentPageIndex * POSTS_PER_PAGE;
  const pageEnd = Math.min(pageStart + POSTS_PER_PAGE, visiblePosts.length);
  const pagedPosts = visiblePosts.slice(pageStart, pageEnd);

  async function submitPlaceholder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailStatus("submitting");
    setEmailMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          group: "bloom-letter",
          source: "journal_archive_sidebar",
        }),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We could not save that email yet.");
      }

      setEmailStatus("success");
      setEmailMessage(result.message || "You're in. Watch your inbox for a note from the garden.");
      setEmail("");
    } catch (error) {
      setEmailStatus("error");
      setEmailMessage(error instanceof Error ? error.message : "We could not save that email yet.");
    }
  }

  return (
    <div className={styles.journalPage}>
      <section className={styles.masthead}>
        <Image
          className={styles.mastheadFlower}
          src="/assets/journal-right-floral-edge.png"
          alt=""
          width={900}
          height={900}
          priority
        />
        <div className={styles.mastheadStars} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      </section>

      <section className={styles.archiveSection}>
        <div className={styles.archiveHeader}>
          <p className={styles.eyebrow}>
            <span aria-hidden="true">✦</span>
            From the Bloom Journal
            <span aria-hidden="true">✦</span>
          </p>
          <h1>The Bloom Journal</h1>
          <p>Stories, meanings, and moonlit flower notes from the Bloom Whispers garden.</p>
        </div>

        <div className={styles.archiveLayout}>
          <div className={styles.mainColumn}>
            <div className={styles.categoryTabs} aria-label="Browse journal categories">
              {categories.map((category) => (
                <button
                  aria-pressed={activeCategory === category.id}
                  className={activeCategory === category.id ? styles.activeTab : ""}
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setPageIndex(0);
                  }}
                  type="button"
                >
                  {category.label}
                  <span>{categoryCounts[category.id]}</span>
                </button>
              ))}
            </div>

            <div className={styles.postList} aria-live="polite">
              {visiblePosts.length > 0 ? (
                pagedPosts.map((post) => (
                  <article className={styles.postCard} key={post.href}>
                    <a className={styles.postImageLink} href={post.href}>
                      <Image src={post.image} alt="" width={1000} height={1500} unoptimized />
                    </a>
                    <div className={styles.postCopy}>
                      <div className={styles.postMeta}>
                        <span>{post.label}</span>
                        <i aria-hidden="true">✦</i>
                        <time>{post.date}</time>
                      </div>
                      <h2>
                        <a href={post.href}>{post.title}</a>
                      </h2>
                      <p>{post.excerpt}</p>
                      <a className={styles.readLink} href={post.href}>
                        Read the story
                        <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </article>
                ))
              ) : (
                <article className={styles.emptyState}>
                  <p className={styles.eyebrow}>No petals found</p>
                  <h2>Try a softer search.</h2>
                  <p>The journal is still small, but the garden is growing.</p>
                </article>
              )}
            </div>

            {visiblePosts.length > POSTS_PER_PAGE ? (
              <nav className={styles.pagination} aria-label="Journal pagination">
                <button
                  disabled={currentPageIndex === 0}
                  onClick={() => setPageIndex((current) => Math.max(0, current - 1))}
                  type="button"
                >
                  <span aria-hidden="true">←</span>
                  Previous
                </button>
                <span className={styles.paginationStatus}>
                  Showing {pageStart + 1}-{pageEnd} of {visiblePosts.length}
                </span>
                <button
                  disabled={currentPageIndex >= pageCount - 1}
                  onClick={() => setPageIndex((current) => Math.min(pageCount - 1, current + 1))}
                  type="button"
                >
                  Next
                  <span aria-hidden="true">→</span>
                </button>
              </nav>
            ) : null}
          </div>

          <aside className={styles.sidebar} aria-label="Journal sidebar">
            <section className={styles.sidebarCard}>
              <div className={styles.sidebarHeading}>
                <h2>Search the Journal</h2>
                <span aria-hidden="true">✦</span>
              </div>
              <label className={styles.visuallyHidden} htmlFor="journal-search">
                Search journal articles
              </label>
              <div className={styles.searchBox}>
                <input
                  id="journal-search"
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setPageIndex(0);
                  }}
                  placeholder="Search articles..."
                  type="search"
                  value={query}
                />
                <span aria-hidden="true">⌕</span>
              </div>
              <Image
                className={styles.sidebarFlower}
                src="/assets/flower-white-bloom.png"
                alt=""
                width={1200}
                height={1200}
              />
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
                <p className={styles.eyebrow}>Bloom Letter</p>
                <h2>A little bloom in your inbox</h2>
                <p>Flower meanings, curious stories, and gentle notes from the garden.</p>
              </div>
              <Image src="/assets/bloom-letter-signup-art.png" alt="" width={1200} height={900} />
              <form onSubmit={submitPlaceholder}>
                <label className={styles.visuallyHidden} htmlFor="journal-letter-email">
                  Email address
                </label>
                <input
                  id="journal-letter-email"
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  type="email"
                  value={email}
                />
                <button type="submit">Subscribe</button>
              </form>
              {emailMessage ? (
                <p
                  aria-live="polite"
                  className={`form-status ${emailStatus === "error" ? "form-status--error" : ""}`}
                >
                  {emailMessage}
                </p>
              ) : null}
            </section>

            <section className={styles.sidebarCard}>
              <div className={styles.sidebarHeading}>
                <h2>Popular in the Garden</h2>
                <span aria-hidden="true">✦</span>
              </div>
              <div className={styles.popularList}>
                {popularPosts.map((post) => (
                  <a href={post.href} key={post.href}>
                    <Image src={post.image} alt="" width={180} height={270} unoptimized />
                    <span>
                      <strong>{post.title}</strong>
                      <small>{post.date}</small>
                    </span>
                  </a>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </div>
  );
}
