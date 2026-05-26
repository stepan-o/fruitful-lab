import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubscribeForm } from "@/components/SubscribeForm";
import { BRAND_ASSETS } from "@/lib/brandAssets";
import { BLOG_POSTS, getPostBySlug, type BlogPost } from "@/lib/content";
import { BOOKING_URL, CANONICAL_URL, FIT_CALL_LABEL, SITE_NAME } from "@/lib/site";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

const HEADSHOT = BRAND_ASSETS.founderExpert;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getSectionId(section: BlogPost["sections"][number]) {
  return section.id ?? slugify(section.heading);
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
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function buildJsonLd(post: BlogPost) {
  const postUrl = absoluteUrl(`/${post.slug}/`);
  const publishedDate = isoDate(post.date);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    ...(post.featuredImage ? { image: [absoluteUrl(post.featuredImage.src)] } : {}),
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      "@type": "Person",
      name: "Susy Cid",
      url: absoluteUrl("/about/"),
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
  const faqSchema = post.faqs
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : undefined;

  return [articleSchema, breadcrumbSchema, faqSchema].filter(Boolean);
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
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
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
    ...(post.quickAnswer ? [{ label: "Quick answer", href: "#quick-answer" }] : []),
    { label: "Key takeaways", href: "#key-takeaways" },
    ...post.sections.map((section) => ({ label: section.heading, href: `#${getSectionId(section)}` })),
    ...(post.faqs ? [{ label: "Frequently asked questions", href: "#faq" }] : []),
  ];
  const jsonLdItems = buildJsonLd(post);

  return (
    <article className="bg-white">
      {jsonLdItems.map((item) => (
        <script
          key={(item as { "@type": string })["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(item) }}
        />
      ))}

      <section className="blog-post-hero">
        <div className="mx-auto max-w-5xl px-5 py-16 text-center sm:px-8 lg:py-20">
          <h1 className="brand-display mx-auto max-w-4xl headline-hero text-[var(--heading)]">
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

            {post.quickAnswer ? (
              <section id="quick-answer" className="blog-quick-answer reveal-on-scroll" aria-labelledby="quick-answer-heading">
                <p className="eyebrow">Quick answer</p>
                <h2 id="quick-answer-heading" className="brand-display mt-2 headline-card text-[var(--heading)]">
                  {post.quickAnswer.heading}
                </h2>
                <p>{post.quickAnswer.body}</p>
              </section>
            ) : null}

            <section className="blog-takeaway-card reveal-on-scroll" aria-labelledby="key-takeaways">
              <p className="eyebrow">Key takeaways</p>
              <h2 id="key-takeaways" className="brand-display mt-2 headline-card text-[var(--heading)]">
                The short version before you keep reading.
              </h2>
              <ul className="blog-takeaway-list mt-5">
                {post.keyTakeaways.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <p className="blog-intro-bridge">
              {post.introBridge ?? "Use this as a practical map, not a rigid rulebook. The sections below walk through what each Pinterest path is best at, where each one can fall short, and how to decide which one belongs in your current growth plan."}
            </p>

            <nav className="blog-table-of-contents reveal-on-scroll" aria-labelledby="table-of-contents">
              <p className="eyebrow">Table of contents</p>
              <h2 id="table-of-contents" className="brand-display mt-2 headline-card text-[var(--heading)]">
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

            {post.comparisonTable ? (
              <aside className="blog-comparison-block blog-comparison-block-featured reveal-on-scroll">
                <p className="eyebrow">Comparison</p>
                <h2 className="brand-display mt-2 headline-card text-[var(--heading)]">{post.comparisonTable.title}</h2>
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

            <div className="blog-article-prose">
              {post.sections.map((section, index) => (
                <section key={section.heading} id={getSectionId(section)}>
                  <h2>{section.heading}</h2>
                  {section.body ? <p>{section.body}</p> : null}
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets ? (
                    <ul>
                      {section.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {section.subsections?.map((subsection) => (
                    <div key={subsection.heading} className="blog-article-subsection">
                      <h3>{subsection.heading}</h3>
                      {subsection.paragraphs?.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                      {subsection.bullets ? (
                        <ul>
                          {subsection.bullets.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ))}
                  {section.numberedItems ? (
                    <div className="blog-numbered-group">
                      {section.numberedItems.map((item, itemIndex) => (
                        <div key={item.title} className="blog-numbered-item">
                          <span>{itemIndex + 1}</span>
                          <div>
                            <h3>{item.title}</h3>
                            {item.paragraphs?.map((paragraph) => (
                              <p key={paragraph}>{paragraph}</p>
                            ))}
                            {item.bullets ? (
                              <ul>
                                {item.bullets.map((bullet) => (
                                  <li key={bullet}>{bullet}</li>
                                ))}
                              </ul>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {section.answerSnippet ? (
                    <aside className="blog-answer-snippet reveal-on-scroll">
                      <span>{section.answerSnippet.label}</span>
                      <p>{section.answerSnippet.body}</p>
                    </aside>
                  ) : null}

                  {index === 0 ? (
                    <aside className="blog-inline-optin reveal-on-scroll">
                      <p className="eyebrow">Start here</p>
                      <h3 className="brand-display mt-2 headline-card text-[var(--heading)]">Want Pinterest ideas you can actually use?</h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                        Join the list for practical Pinterest strategy notes, case studies, and resource drops for content-led brands.
                      </p>
                      <SubscribeForm
                        formType="newsletter"
                        buttonLabel="Send me the notes"
                        successMessage="You're on the list. Pinterest notes will head your way."
                        className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]"
                        buttonClassName="button-primary min-h-11 rounded-md px-5 text-sm font-semibold"
                      />
                    </aside>
                  ) : null}

                  {index === 0 && post.featuredPinGraphic?.image ? (
                    <figure className="article-body-graphic reveal-on-scroll">
                      <div className="article-body-graphic-frame">
                        <Image
                          src={post.featuredPinGraphic.image.src}
                          alt={post.featuredPinGraphic.image.alt}
                          fill
                          className="article-pin-image"
                          sizes="(min-width: 1024px) 34rem, 88vw"
                          data-pin-description={post.featuredPinGraphic.description}
                        />
                      </div>
                    </figure>
                  ) : null}

                  {post.bodyGraphics
                    ?.filter((graphic) => graphic.afterSectionId === section.id)
                    .map((graphic) => (
                      <figure key={graphic.title} className="article-body-graphic reveal-on-scroll">
                        <div className="article-body-graphic-frame">
                          <Image
                            src={graphic.image.src}
                            alt={graphic.image.alt}
                            fill
                            className="article-pin-image"
                            sizes="(min-width: 1024px) 34rem, 88vw"
                            data-pin-description={graphic.description}
                          />
                        </div>
                      </figure>
                    ))}

                  {index === post.sections.length - 1 && post.pinGraphics ? (
                    <aside className="pin-graphics-section reveal-on-scroll" aria-labelledby="pin-graphics-heading">
                      <p className="eyebrow">Save for later</p>
                      <h3 id="pin-graphics-heading" className="brand-display mt-2 headline-card text-[var(--heading)]">
                        Pin these strategy takeaways.
                      </h3>
                      <div className="pin-graphics-image-grid mt-5">
                        {post.pinGraphics.slice(0, 2).map((graphic) => (
                          <figure key={graphic.title} className="pin-graphic-image-card">
                            {graphic.image ? (
                              <Image
                                src={graphic.image.src}
                                alt={graphic.image.alt}
                                fill
                                className="pin-graphic-clean-image"
                                sizes="(min-width: 1024px) 16rem, 82vw"
                                data-pin-description={graphic.description}
                              />
                            ) : null}
                          </figure>
                        ))}
                      </div>
                    </aside>
                  ) : null}

                  {index === 1 && post.pullQuote ? (
                    <blockquote className="blog-pull-quote reveal-on-scroll">
                      <p>{post.pullQuote}</p>
                    </blockquote>
                  ) : null}

                </section>
              ))}
            </div>

            {post.faqs ? (
              <section id="faq" className="blog-faq-section">
                <p className="eyebrow">Frequently asked questions</p>
                <h2 className="brand-display mt-2 headline-section text-[var(--heading)]">Quick answers before you choose a path.</h2>
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
              <h2 className="brand-display mt-2 headline-section text-[var(--heading)]">Choose the next step that fits your stage.</h2>
              <div className="blog-next-action-grid mt-6">
                <Link className="blog-next-action-card" href="/blog">
                  <span>Keep reading</span>
                  <strong>Browse the Pinterest strategy library</strong>
                  <small>Find more articles by topic, offer stage, or Pinterest question.</small>
                </Link>
                <Link className="blog-next-action-card" href="/resources">
                  <span>Get practical</span>
                  <strong>Open the resource library</strong>
                  <small>Use guides, tools, and gentle next steps when you need a softer path.</small>
                </Link>
                <Link className="blog-next-action-card" href="/pinterest-services">
                  <span>Want support?</span>
                  <strong>See the Pinterest service paths</strong>
                  <small>Compare strategy, organic, ads, and implementation support before a Fit Call.</small>
                </Link>
              </div>
            </section>

            <section className="blog-post-final-cta">
              <h2 className="brand-display max-w-3xl headline-section text-[var(--heading)]">Want this mapped to your brand?</h2>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)]">
                Start with a Fit Call and we&apos;ll look at your content, offer, and Pinterest opportunity without guessing.
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
                <h2 className="brand-display mt-5 headline-card text-[var(--heading)]">I&apos;m Susy, your Pinterest strategy brain.</h2>
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
                <h2 className="brand-display mt-3 headline-card text-[var(--heading)]">Grab the free Pinterest strategy guide.</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Get a low-pressure starting point for choosing the Pinterest path that fits your content, offer, and stage.
                </p>
                <SubscribeForm
                  formType="resource-interest"
                  buttonLabel="Send me the guide"
                  successMessage="You're on the resource list. I'll send the next useful guide when it's ready."
                  resourceInterest="Pinterest strategy guide"
                  includeName
                  className="mt-5 grid gap-3"
                  buttonClassName="button-primary min-h-11 rounded-md px-5 text-sm font-semibold"
                />
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
