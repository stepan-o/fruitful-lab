"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
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

const posts: JournalPost[] = [
  {
    title: "12 Spider Lily Floral Arrangement Ideas That Feel Like Autumn Magic",
    href: "https://bloomwhispers.com/spider-lily-floral-arrangement-ideas/",
    date: "Mar 23, 2026",
    category: "guides",
    label: "Guides & Rituals",
    excerpt:
      "A practical guide to styling spider lilies with space, drama, and a little autumn spellwork for the eye.",
    image: "https://bloomwhispers.com/wp-content/uploads/2026/03/Spider-lily-arrangement.jpg",
  },
  {
    title: "Spider Lily in Anime & Pop Culture",
    href: "https://bloomwhispers.com/spider-lily-in-anime/",
    date: "Mar 23, 2026",
    category: "stories",
    label: "Folklore & Stories",
    excerpt:
      "Why Higanbana appears so often in visual stories, from farewells to memory, mystery, and beautiful warning.",
    image: "https://bloomwhispers.com/wp-content/uploads/2026/03/Spider-Lily-in-Anime.jpg",
  },
  {
    title: "Spider Lily Colors & Meanings",
    href: "https://bloomwhispers.com/spider-lily-colors-meanings/",
    date: "Mar 23, 2026",
    category: "meanings",
    label: "Flower Meanings",
    excerpt:
      "Red, white, pink, and yellow spider lilies, and how each color shifts the message the flower carries.",
    image: "https://bloomwhispers.com/wp-content/uploads/2026/03/Spider-Lily-Colors.jpg",
  },
  {
    title: "Higanbana in Japan: Red Spider Lily Symbolism",
    href: "https://bloomwhispers.com/red-spider-lily-symbolism/",
    date: "Mar 19, 2026",
    category: "stories",
    label: "Folklore & Stories",
    excerpt:
      "A look at Ohigan, memory, autumn bloom magic, and the red spider lily's place in Japanese symbolism.",
    image: "https://bloomwhispers.com/wp-content/uploads/2026/03/Red-Spider-Lily-Symbolism.jpg",
  },
  {
    title: "10 Ways the World Uses the Hibiscus Flower",
    href: "https://bloomwhispers.com/hibiscus-flower-uses/",
    date: "Oct 29, 2025",
    category: "profiles",
    label: "Flower Profiles",
    excerpt:
      "Hibiscus as color, food, ritual, beauty, and everyday energy across cultures and kitchens.",
    image: "https://bloomwhispers.com/wp-content/uploads/2025/10/10-Hibiscus-flower-Uses-e1761777237347.jpg",
  },
  {
    title: "Flower Recipes: 7 Ways to Use Dried Hibiscus Flowers",
    href: "https://bloomwhispers.com/hibiscusflower-recipe/",
    date: "Oct 28, 2025",
    category: "food",
    label: "Floral Food & Drink",
    excerpt:
      "Tart, ruby-toned hibiscus ideas for drinks, sweets, sauces, and simple flower-bright kitchen experiments.",
    image: "https://bloomwhispers.com/wp-content/uploads/2025/10/hibiscus-flower-recipes-e1761616059362.jpg",
  },
  {
    title: "The Story of the Hibiscus Flower",
    href: "/journal/hibiscus-flower-meaning",
    date: "Oct 28, 2025",
    category: "meanings",
    label: "Flower Meanings",
    excerpt:
      "Meaning, symbolism, cultural uses, and the many lives of one radiant bloom.",
    image: "https://bloomwhispers.com/wp-content/uploads/2025/10/Hibiscus-meaning-e1761614297165.jpg",
  },
  {
    title: "5 Min Hibiscus Chamoy Recipe",
    href: "https://bloomwhispers.com/5-min-hibiscus-chamoy-recipe/",
    date: "Oct 27, 2025",
    category: "food",
    label: "Floral Food & Drink",
    excerpt:
      "A sweet-heat hibiscus sauce for bringing floral brightness into everyday flavor.",
    image: "https://bloomwhispers.com/wp-content/uploads/2025/10/Hibiscus-Chamoy.jpg",
  },
  {
    title: "7 Benefits of the Hibiscus Flower for Hair and Skin",
    href: "https://bloomwhispers.com/hibiscus-flower-benefits/",
    date: "Oct 27, 2025",
    category: "profiles",
    label: "Flower Profiles",
    excerpt:
      "A botanical beauty note on hibiscus in hair, skin, traditional care, and modern flower curiosity.",
    image: "https://bloomwhispers.com/wp-content/uploads/2025/10/Hibiscus-flower-benefits-1.jpg",
  },
  {
    title: "20+ Edible Flowers for Cake Decoration",
    href: "https://bloomwhispers.com/edible-flowers-for-cakes/",
    date: "Feb 19, 2025",
    category: "food",
    label: "Floral Food & Drink",
    excerpt:
      "Pressed, dried, and edible flowers for cakes that feel decorative, seasonal, and naturally beautiful.",
    image: "https://bloomwhispers.com/wp-content/uploads/2025/02/Edible-flowers.jpg",
  },
  {
    title: "Forest Therapy with Elizabeth Mintun",
    href: "https://bloomwhispers.com/the-healing-power-of-forest-therapy/",
    date: "Sep 24, 2024",
    category: "podcast",
    label: "Podcast",
    excerpt:
      "A conversation about nature, restoration, and what happens when the forest becomes a place to listen.",
    image: "https://bloomwhispers.com/wp-content/uploads/2024/09/Forest-Therapy-e1727154772145.jpg",
  },
  {
    title: "Flower Therapy: The Healing Power of Flowers",
    href: "https://bloomwhispers.com/flower-therapy-healing-power-of-flowers/",
    date: "Sep 24, 2024",
    category: "podcast",
    label: "Podcast",
    excerpt:
      "A Bloom Whispers conversation on how flowers can shape memory, mood, ritual, and gentle attention.",
    image: "https://bloomwhispers.com/wp-content/uploads/2024/09/Flower-Therapy-e1727150554942.jpg",
  },
  {
    title: "Understanding the Essence of Flowers",
    href: "https://bloomwhispers.com/what-are-flowers/",
    date: "Sep 24, 2024",
    category: "podcast",
    label: "Podcast",
    excerpt:
      "Botanist Roxana Khoshravesh explores what flowers are, how they work, and why we keep returning to them.",
    image: "https://bloomwhispers.com/wp-content/uploads/2024/09/What-are-flowers-e1727147957670.jpg",
  },
  {
    title: "Flower Frequencies with Laura Ashley",
    href: "https://bloomwhispers.com/flower-energy/",
    date: "Sep 23, 2024",
    category: "podcast",
    label: "Podcast",
    excerpt:
      "A conversation about flower energy, intuition, and the emotional language people build around blooms.",
    image:
      "https://bloomwhispers.com/wp-content/uploads/2024/09/The-Healing-Power-of-Flowers-Insights-from-Laura-Ashley-e1727116543848.jpg",
  },
  {
    title: "Exploring the Healing Properties of Flowers",
    href: "https://bloomwhispers.com/healing-properties-of-flowers/",
    date: "Apr 5, 2024",
    category: "podcast",
    label: "Podcast",
    excerpt:
      "A reflective episode note on flowers, care, meaning, and the gentle ways blooms move through a life.",
    image: "https://bloomwhispers.com/wp-content/uploads/2024/04/Healing-Properties-of-Flowers-e1727116647246.jpg",
  },
  {
    title: "The Lotus Flower Meaning: Healing & Creativity",
    href: "https://bloomwhispers.com/lotus-flower-meaning/",
    date: "May 30, 2021",
    category: "podcast",
    label: "Podcast",
    excerpt:
      "Lotus symbolism, creativity, renewal, and the way one flower can become a whole inner landscape.",
    image: "https://bloomwhispers.com/wp-content/uploads/2024/04/Lotus-flower-meaning-e1727116714135.jpg",
  },
];

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

  function submitPlaceholder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmail("");
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
