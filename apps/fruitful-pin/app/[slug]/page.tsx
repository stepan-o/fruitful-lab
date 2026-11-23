import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getPostBySlug, type BlogPost } from "@/lib/content";
import { BOOKING_URL, FIT_CALL_LABEL } from "@/lib/site";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

const HEADSHOT = "https://fruitfulpin.com/wp-content/uploads/2025/12/Cid-headshot.webp";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function BlogPostVisual({ post }: { post: BlogPost }) {
  return (
    <div className="blog-post-featured-media">
      {post.featuredImage ? (
        <Image
          src={post.featuredImage.src}
          alt={post.featuredImage.alt}
          fill
          className="blog-visual-image"
          sizes="(min-width: 1024px) 52rem, 92vw"
          priority
        />
      ) : (
        <span>{post.category}</span>
      )}
    </div>
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

  return {
    title: post.title,
    description: post.excerpt,
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
  const tocItems = [
    { label: "Key takeaways", href: "#key-takeaways" },
    ...post.sections.map((section) => ({ label: section.heading, href: `#${slugify(section.heading)}` })),
    ...(post.faqs ? [{ label: "Frequently asked questions", href: "#faq" }] : []),
  ];

  return (
    <article className="bg-white">
      <section className="blog-post-hero">
        <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:px-8 lg:py-20">
          <h1 className="brand-display mx-auto max-w-4xl text-4xl leading-tight text-[var(--heading)] sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">{post.excerpt}</p>
          <p className="mt-6 text-sm font-semibold text-[var(--brand-rust)]">By Susy Cid · {post.date}</p>
        </div>
      </section>

      <section className="bg-white">
        <div className="blog-post-layout mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-18">
          <main className="blog-post-main">
            <BlogPostVisual post={post} />

            <section className="blog-takeaway-card reveal-on-scroll" aria-labelledby="key-takeaways">
              <p className="eyebrow">Key takeaways</p>
              <h2 id="key-takeaways" className="brand-display mt-2 text-2xl leading-tight text-[var(--heading)]">
                The short version before you keep reading.
              </h2>
              <ul className="blog-takeaway-list mt-5">
                {post.keyTakeaways.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <p className="blog-intro-bridge">
              Use this as a practical map, not a rigid rulebook. The sections below walk through what each Pinterest path is best at, where each one can fall short, and how to decide which one belongs in your current growth plan.
            </p>

            <nav className="blog-table-of-contents reveal-on-scroll" aria-labelledby="table-of-contents">
              <p className="eyebrow">Table of contents</p>
              <h2 id="table-of-contents" className="brand-display mt-2 text-2xl leading-tight text-[var(--heading)]">
                Jump to what you need.
              </h2>
              <ol className="mt-5">
                {tocItems.map((item) => (
                  <li key={item.href}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="blog-article-prose">
              {post.sections.map((section, index) => (
                <section key={section.heading} id={slugify(section.heading)}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>

                  {index === 0 ? (
                    <aside className="blog-inline-optin reveal-on-scroll">
                      <p className="eyebrow">Start here</p>
                      <h3 className="brand-display mt-2 text-2xl leading-tight text-[var(--heading)]">Want Pinterest ideas you can actually use?</h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                        Join the list for practical Pinterest strategy notes, case studies, and future resources for content-led brands.
                      </p>
                      <form className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
                        <input className="blog-form-input" type="email" name="email" placeholder="Email address" />
                        <button className="button-primary min-h-11 rounded-md px-5 text-sm font-semibold" type="button">
                          Send me the notes
                        </button>
                      </form>
                    </aside>
                  ) : null}

                  {index === 0 && post.featuredPinGraphic ? (
                    <aside className="pin-graphic-feature reveal-on-scroll" aria-label="Pinterest graphic">
                      <span>Pin graphic</span>
                      <strong>{post.featuredPinGraphic.title}</strong>
                      <small>{post.featuredPinGraphic.description}</small>
                    </aside>
                  ) : null}

                  {index === post.sections.length - 1 && post.pinGraphics ? (
                    <aside className="pin-graphics-block reveal-on-scroll">
                      <p className="eyebrow">Pinterest graphics</p>
                      <h3 className="brand-display mt-2 text-2xl leading-tight text-[var(--heading)]">Saveable Pinterest graphics for later.</h3>
                      <div className="pin-graphics-grid mt-5">
                        {post.pinGraphics.map((graphic) => (
                          <div key={graphic.title} className="pin-graphic-placeholder">
                            <span>Pin graphic</span>
                            <strong>{graphic.title}</strong>
                            <small>{graphic.description}</small>
                          </div>
                        ))}
                      </div>
                    </aside>
                  ) : null}

                  {index === 1 && post.pullQuote ? (
                    <blockquote className="blog-pull-quote reveal-on-scroll">
                      <p>{post.pullQuote}</p>
                    </blockquote>
                  ) : null}

                  {index === 1 && post.comparisonTable ? (
                    <aside className="blog-comparison-block reveal-on-scroll">
                      <p className="eyebrow">Comparison</p>
                      <h3 className="brand-display mt-2 text-2xl leading-tight text-[var(--heading)]">{post.comparisonTable.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{post.comparisonTable.description}</p>
                      <div className="blog-comparison-table-wrap mt-5">
                        <table className="blog-comparison-table">
                          <thead>
                            <tr>
                              {post.comparisonTable.columns.map((column) => (
                                <th key={column}>{column}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {post.comparisonTable.rows.map((row) => (
                              <tr key={row.join("-")}>
                                {row.map((cell) => (
                                  <td key={cell}>{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </aside>
                  ) : null}
                </section>
              ))}
            </div>

            {post.faqs ? (
              <section id="faq" className="blog-faq-section">
                <p className="eyebrow">Frequently asked questions</p>
                <h2 className="brand-display mt-2 text-3xl leading-tight text-[var(--heading)]">Quick answers before you choose a path.</h2>
                <div className="mt-6 grid gap-4">
                  {post.faqs.map((item) => (
                    <details key={item.question} className="blog-faq-item">
                      <summary>{item.question}</summary>
                      <p>{item.answer}</p>
                    </details>
                  ))}
                </div>
              </section>
            ) : null}

            <nav className="blog-prev-next" aria-label="Previous and next articles">
              {previousPost ? (
                <Link href={`/${previousPost.slug}`}>
                  <span>Previous</span>
                  {previousPost.title}
                </Link>
              ) : <span />}
              {nextPost ? (
                <Link href={`/${nextPost.slug}`}>
                  <span>Next</span>
                  {nextPost.title}
                </Link>
              ) : <span />}
            </nav>

            <section className="blog-next-actions">
              <p className="eyebrow">Where to go next</p>
              <h2 className="brand-display mt-2 text-3xl leading-tight text-[var(--heading)]">Choose the next step that fits your stage.</h2>
              <div className="blog-next-action-grid mt-6">
                <Link className="blog-next-action-card" href="/blog">
                  <span>Keep reading</span>
                  <strong>Browse the Pinterest strategy library</strong>
                  <small>Find more articles by topic, offer stage, or Pinterest question.</small>
                </Link>
                <Link className="blog-next-action-card" href="/resources">
                  <span>Get practical</span>
                  <strong>Open the resource library</strong>
                  <small>Use guides, tools, and future lead magnets when you need a softer next step.</small>
                </Link>
                <Link className="blog-next-action-card" href="/pinterest-services">
                  <span>Want support?</span>
                  <strong>See the Pinterest service paths</strong>
                  <small>Compare strategy, organic, ads, and full-funnel support before a fit call.</small>
                </Link>
              </div>
            </section>

            <section className="blog-post-final-cta">
              <h2 className="brand-display max-w-3xl text-3xl leading-tight text-[var(--heading)] sm:text-5xl">Want this mapped to your brand?</h2>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)]">
                Start with a fit call and we&apos;ll look at your content, offer, and Pinterest opportunity without guessing.
              </p>
              <Link className="button-primary mt-7 inline-flex min-h-12 items-center justify-center rounded-md px-6 text-sm font-semibold" href={BOOKING_URL}>
                {FIT_CALL_LABEL}
              </Link>
            </section>
          </main>

          <aside className="blog-post-sidebar" aria-label="Article sidebar">
            <div className="blog-post-sidebar-inner">
              <section className="blog-sidebar-card blog-search-card">
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-rust)]" htmlFor="blog-post-search">
                  Search
                </label>
                <div className="blog-search-field">
                  <svg className="blog-search-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m16 16 4 4" />
                  </svg>
                  <input id="blog-post-search" className="blog-search-input" type="search" placeholder="Pinterest ads, SEO, product pins..." />
                </div>
              </section>

              <section className="blog-sidebar-card blog-about-card">
                <div className="blog-about-photo">
                  <Image
                    src={HEADSHOT}
                    alt="Susy Cid, Pinterest strategist"
                    width={240}
                    height={240}
                    className="h-full w-full object-cover"
                    sizes="(min-width: 1024px) 16vw, 48vw"
                  />
                </div>
                <h2 className="brand-display mt-5 text-2xl leading-tight text-[var(--heading)]">I&apos;m Susy, your Pinterest strategy brain.</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  I help content creators and specialty brands build long-term traffic and sales without turning Pinterest into another noisy chore.
                </p>
                <Link className="mt-5 inline-flex text-sm font-bold text-[var(--brand-pink)]" href="/about">
                  Learn more
                </Link>
              </section>

              <section className="blog-sidebar-card blog-optin-card">
                <div className="blog-optin-visual">
                  <Image
                    src="/images/pinterest-growth-workbench.webp"
                    alt="Free Pinterest strategy guide preview"
                    width={768}
                    height={419}
                    className="h-full w-full object-cover"
                    sizes="(min-width: 1024px) 20vw, 86vw"
                  />
                </div>
                <p className="eyebrow mt-5">Free guide</p>
                <h2 className="brand-display mt-3 text-2xl leading-tight text-[var(--heading)]">Grab the free Pinterest strategy guide.</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Get a low-pressure starting point for choosing the Pinterest path that fits your content, offer, and stage.
                </p>
                <form className="mt-5 grid gap-3">
                  <input className="blog-form-input" type="text" name="name" placeholder="Your name" />
                  <input className="blog-form-input" type="email" name="email" placeholder="Email address" />
                  <button className="button-primary min-h-11 rounded-md px-5 text-sm font-semibold" type="button">
                    Send me the guide
                  </button>
                </form>
              </section>

              <section className="blog-post-side-card">
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--brand-rust)]">More to explore</h2>
                <div className="mt-4 grid gap-3">
                  <Link className="blog-post-side-link" href="/blog">
                    Blog archive
                  </Link>
                  <Link className="blog-post-side-link" href="/resources">
                    Resource library
                  </Link>
                  <Link className="blog-post-side-link" href="/pinterest-services">
                    Pinterest services
                  </Link>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </section>
    </article>
  );
}
