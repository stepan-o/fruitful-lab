import Link from "next/link";
import { BlogFinalCta } from "./BlogFinalCta";
import { BLOG_POSTS, type BlogPost } from "@/lib/content";

export const metadata = {
  title: "Blog",
  description:
    "Fruitful Lab field notes on product discovery, search, content systems, data, testing, and practical AI workflows.",
  alternates: {
    canonical: "/blog/",
  },
};

const CARD_VARIANTS = ["feature", "quote", "image", "note", "dark", "image-wide", "quote"] as const;

type CardVariant = (typeof CARD_VARIANTS)[number];

type BlogCard = BlogPost & {
  index: number;
  variant: CardVariant;
  anchorId?: string;
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function getCategories(posts: BlogPost[]) {
  const counts = posts.reduce<Record<string, number>>((accumulator, post) => {
    accumulator[post.category] = (accumulator[post.category] ?? 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts).map(([name, count]) => ({ name, count, id: slugify(name) }));
}

function BlogArchiveCard({ post }: { post: BlogCard }) {
  const issue = String(post.index + 1).padStart(2, "0");

  return (
    <article className={`flb-card flb-card-${post.variant}`} {...(post.anchorId ? { id: post.anchorId } : {})}>
      <Link className="flb-card-link" href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
        <div className="flb-card-media" aria-hidden="true">
          <span className="flb-card-pill">
            <span />
            {post.category}
          </span>
          <span className="flb-card-date">{post.date}</span>
          <div className="flb-card-art">
            <span className="flb-orbit flb-orbit-one" />
            <span className="flb-orbit flb-orbit-two" />
            <span className="flb-orbit flb-orbit-three" />
          </div>
        </div>
        <div className="flb-card-copy">
          <p className="flb-card-kicker">Field note {issue}</p>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <span className="flb-read-link">Read more -&gt;</span>
        </div>
        <span className="flb-card-number" aria-hidden="true">
          {issue}
        </span>
      </Link>
    </article>
  );
}

export default function BlogPage() {
  const categories = getCategories(BLOG_POSTS);
  const seenCategories = new Set<string>();
  const posts: BlogCard[] = BLOG_POSTS.map((post, index) => {
    const categoryId = slugify(post.category);
    const anchorId = seenCategories.has(categoryId) ? undefined : `category-${categoryId}`;
    seenCategories.add(categoryId);

    return {
      ...post,
      index,
      anchorId,
      variant: CARD_VARIANTS[index % CARD_VARIANTS.length],
    };
  });

  return (
    <div className="flb-page">
      <section className="flb-hero" aria-labelledby="blog-title">
        <div className="flb-shell">
          <p className="flb-index-mark">01 - Blog</p>
          <h1 id="blog-title">
            Field notes on <span>growth systems</span> that clarify what compounds.
          </h1>
          <p>
            Long-form essays, short field notes, and practical observations from inside Fruitful Lab: product discovery,
            search ecosystems, content paths, lifecycle, data, testing, and AI workflows that still feel human.
          </p>
        </div>
      </section>

      <section className="flb-filter-strip" aria-label="Blog categories">
        <div className="flb-shell flb-filter-row">
          <span>Filter</span>
          <Link className="flb-filter-pill flb-filter-pill-active" href="/blog/">
            <span />
            All {BLOG_POSTS.length}
          </Link>
          {categories.map((category) => (
            <Link key={category.name} className="flb-filter-pill" href={`#category-${category.id}`}>
              <span />
              {category.name} {category.count}
            </Link>
          ))}
          <span className="flb-sort-label">Sort newest</span>
        </div>
      </section>

      <section className="flb-archive" aria-label="Latest Fruitful Lab essays">
        <div className="flb-shell">
          <div className="flb-issue-line">
            <span>Section 01</span>
            <p>
              The discovery issue - <em>product paths for brands with useful things to sell.</em>
            </p>
            <span>Latest pieces</span>
          </div>
          <div className="flb-card-grid">
            {posts.map((post) => (
              <BlogArchiveCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      <BlogFinalCta />
    </div>
  );
}
