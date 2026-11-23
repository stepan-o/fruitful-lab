import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogSubscribeForm } from "../BlogSubscribeForm";
import { BLOG_POSTS, getPostBySlug, type BlogPost } from "@/lib/content";
import { BOOKING_URL, CANONICAL_URL, SITE_NAME } from "@/lib/site";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getSectionId(section: BlogPost["sections"][number]) {
  return slugify(section.heading);
}

function absoluteUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${CANONICAL_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function isoDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed.toISOString().slice(0, 10);
}

function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\u003c");
}

function buildJsonLd(post: BlogPost) {
  const postUrl = absoluteUrl(`/blog/${post.slug}/`);
  const publishedDate = isoDate(post.date);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: CANONICAL_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: CANONICAL_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl,
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blog/"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl,
      },
    ],
  };

  return [articleSchema, breadcrumbSchema];
}

function BlogPostVisual({ post, index }: { post: BlogPost; index: number }) {
  const issue = String(index + 1).padStart(2, "0");

  return (
    <div className="flbp-featured-media" aria-label={`${post.category} article visual`}>
      <span className="flbp-media-pill">
        <span />
        {post.category}
      </span>
      <div className="flbp-media-system" aria-hidden="true">
        <span className="flbp-orbit flbp-orbit-one" />
        <span className="flbp-orbit flbp-orbit-two" />
        <span className="flbp-orbit flbp-orbit-three" />
        <span className="flbp-signal-line flbp-signal-line-one" />
        <span className="flbp-signal-line flbp-signal-line-two" />
      </div>
      <strong>{issue}</strong>
      <p>Field note</p>
    </div>
  );
}

function VerticalGraphicPlaceholder({ label, size, title }: { label: string; size: "large" | "small"; title: string }) {
  return (
    <figure className={`flbp-vertical-graphic flbp-vertical-graphic-${size}`}>
      <div className="flbp-vertical-graphic-frame">
        <span className="flbp-media-pill">
          <span />
          {label}
        </span>
        <div className="flbp-vertical-graphic-art" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <figcaption>{title}</figcaption>
      </div>
    </figure>
  );
}

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post" };
  }

  const canonicalPath = `/blog/${post.slug}/`;
  const publishedDate = isoDate(post.date);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalPath,
      type: "article",
      publishedTime: publishedDate,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const currentIndex = BLOG_POSTS.findIndex((item) => item.slug === post.slug);
  const previousPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : undefined;
  const nextPost = currentIndex >= 0 && currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : undefined;
  const relatedPosts = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3);
  const tocItems = [
    { label: "Quick answer", href: "#quick-answer" },
    { label: "Key takeaways", href: "#key-takeaways" },
    ...post.sections.map((section) => ({ label: section.heading, href: `#${getSectionId(section)}` })),
  ];
  const jsonLdItems = buildJsonLd(post);

  return (
    <article className="flbp-page">
      {jsonLdItems.map((item) => (
        <script
          key={(item as { "@type": string })["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(item) }}
        />
      ))}

      <section className="flbp-hero" aria-labelledby="blog-post-title">
        <div className="flbp-shell flbp-hero-inner">
          <p className="flbp-kicker">{post.category}</p>
          <h1 id="blog-post-title">{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="flbp-meta" aria-label="Article metadata">
            <span>By Fruitful Lab</span>
            <span>{post.date}</span>
            <span>Field note {String(currentIndex + 1).padStart(2, "0")}</span>
          </div>
        </div>
      </section>

      <section className="flbp-body-section">
        <div className="flbp-shell flbp-layout">
          <main className="flbp-main">
            <BlogPostVisual post={post} index={currentIndex} />

            <section id="quick-answer" className="flbp-quick-answer" aria-labelledby="quick-answer-heading">
              <p className="flbp-kicker">Quick answer</p>
              <h2 id="quick-answer-heading">Start with the real constraint, then build the smallest useful system.</h2>
              <p>
                {post.keyTakeaways[0] ??
                  "A useful growth system starts by naming the first decision, not by adding another disconnected tactic."}
              </p>
            </section>

            <section className="flbp-takeaway-card" aria-labelledby="key-takeaways">
              <p className="flbp-kicker">Key takeaways</p>
              <h2 id="key-takeaways">The short version before you keep reading.</h2>
              <ul>
                {post.keyTakeaways.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <p className="flbp-intro-bridge">
              Use this as a practical map, not a rigid rulebook. The sections below walk through what the system is
              trying to clarify, where the work can get scattered, and how to decide what should happen next.
            </p>

            <nav className="flbp-table-of-contents" aria-labelledby="table-of-contents">
              <p className="flbp-kicker">Table of contents</p>
              <h2 id="table-of-contents">Jump to what you need.</h2>
              <ol>
                {tocItems.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="flbp-article-prose">
              {post.sections.map((section, index) => (
                <section key={section.heading} id={getSectionId(section)}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>

                  {index === 0 ? (
                    <>
                      <aside className="flbp-inline-optin" aria-label="Fruitful Lab notes signup">
                        <p className="flbp-kicker">Start here</p>
                        <h3>Want growth notes you can actually use?</h3>
                        <p>
                          Get practical notes on product discovery, search, content paths, lifecycle, data, testing,
                          and AI workflows that still feel human.
                        </p>
                        <BlogSubscribeForm />
                      </aside>
                      <VerticalGraphicPlaceholder
                        label={post.category}
                        size="large"
                        title="Vertical strategy graphic placeholder"
                      />
                    </>
                  ) : null}

                  {index === 1 ? (
                    <blockquote className="flbp-pull-quote">
                      <p>Good growth work is not more noise. It is a clearer path around something worth finding.</p>
                    </blockquote>
                  ) : null}
                </section>
              ))}
            </div>

            <aside className="flbp-vertical-graphic-pair" aria-label="Future vertical blog graphics">
              <VerticalGraphicPlaceholder label="Lab note" size="small" title="Saveable takeaway graphic" />
              <VerticalGraphicPlaceholder label="Next step" size="small" title="Framework recap graphic" />
            </aside>

            <nav className="flbp-prev-next" aria-label="Previous and next articles">
              {previousPost ? (
                <Link href={`/blog/${previousPost.slug}/`}>
                  <span>Previous</span>
                  {previousPost.title}
                </Link>
              ) : (
                <span />
              )}
              {nextPost ? (
                <Link href={`/blog/${nextPost.slug}/`}>
                  <span>Next</span>
                  {nextPost.title}
                </Link>
              ) : (
                <span />
              )}
            </nav>

            <section className="flbp-next-actions">
              <p className="flbp-kicker">Where to go next</p>
              <h2>Choose the next step that fits your stage.</h2>
              <div className="flbp-next-action-grid">
                <Link className="flbp-next-action-card" href="/blog/">
                  <span>Keep reading</span>
                  <strong>Browse the Lab field notes</strong>
                  <small>Find more thinking on product discovery, search, content, data, and practical AI workflows.</small>
                </Link>
                <Link className="flbp-next-action-card" href="/resources/">
                  <span>Get practical</span>
                  <strong>Open the resource library</strong>
                  <small>Resources are coming soon, but this is where useful tools and checklists will live.</small>
                </Link>
                <Link className="flbp-next-action-card" href="/services/">
                  <span>Want support?</span>
                  <strong>See the service paths</strong>
                  <small>Compare diagnostics, implementation sprints, and larger growth-system support.</small>
                </Link>
              </div>
            </section>

            <section className="flbp-post-final-cta">
              <p className="flbp-kicker">Build with the lab</p>
              <h2>Want this mapped to your brand?</h2>
              <p>
                Start with a fit call and we will look at the product, the stage, the constraints, and the clearest
                first move before recommending what to build.
              </p>
              <a href={BOOKING_URL}>Book a fit call -&gt;</a>
            </section>
          </main>

          <aside className="flbp-sidebar" aria-label="Article sidebar">
            <div className="flbp-sidebar-inner">
              <section className="flbp-side-card flbp-search-card">
                <label htmlFor="blog-post-search">Search</label>
                <div className="flbp-search-field">
                  <svg className="flbp-search-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m16 16 4 4" />
                  </svg>
                  <input id="blog-post-search" type="search" placeholder="Search systems, content, AI, data..." />
                </div>
              </section>

              <section className="flbp-side-card flbp-about-card">
                <div className="flbp-about-mark" aria-hidden="true">
                  FL
                </div>
                <h2>Fruitful Lab connects the system around the product.</h2>
                <p>
                  We help specialty product brands make search, content, lifecycle, data, testing, and AI workflows
                  work from the same strategy instead of separate assumptions.
                </p>
                <Link href="/about/">Learn more</Link>
              </section>

              <section className="flbp-side-card flbp-resource-card">
                <div className="flbp-resource-visual" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <p className="flbp-kicker">Lab notes</p>
                <h2>Get the useful notes.</h2>
                <p>
                  Short, practical thinking on product discovery systems, content paths, signal loops, and calmer AI
                  workflows.
                </p>
                <BlogSubscribeForm compact />
              </section>

              <section className="flbp-side-card flbp-more-card">
                <h2>More to explore</h2>
                <div>
                  <Link href="/blog/">Blog archive</Link>
                  <Link href="/resources/">Resource library</Link>
                  <Link href="/services/">Services</Link>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </section>

      <section className="flbp-related-section" aria-labelledby="related-posts">
        <div className="flbp-shell">
          <p className="flbp-kicker">Related field notes</p>
          <h2 id="related-posts">Keep following the system.</h2>
          <div className="flbp-related-grid">
            {relatedPosts.map((item) => (
              <Link key={item.slug} className="flbp-related-card" href={`/blog/${item.slug}/`}>
                <span>{item.category}</span>
                <strong>{item.title}</strong>
                <small>{item.excerpt}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
