import Image from "next/image";
import Link from "next/link";
import { CursorGlowPanel } from "@/components/CursorGlowPanel";
import { BRAND_ASSETS } from "@/lib/brandAssets";
import { BLOG_POSTS, type BlogPost } from "@/lib/content";
import { BOOKING_URL, FIT_CALL_LABEL, PINTEREST_FIT_CHECK_URL } from "@/lib/site";

export const metadata = {
  title: "Blog",
  description: "Simple Pinterest strategy notes for brands that want to get found, remembered, and chosen.",
};

const HEADSHOT = BRAND_ASSETS.founderExpert;

function BlogVisual({ post, variant }: { post: BlogPost; variant: "featured" | "list" }) {
  const className = variant === "featured" ? "blog-featured-visual" : "blog-list-visual";

  return (
    <Link className={className} href={`/${post.slug}`} aria-label={`Read ${post.title}`}>
      {post.featuredImage ? (
        <Image
          src={post.featuredImage.src}
          alt={post.featuredImage.alt}
          fill
          className="blog-visual-image"
          sizes={variant === "featured" ? "(min-width: 1024px) 56rem, 92vw" : "(min-width: 1024px) 42rem, 92vw"}
        />
      ) : (
        <span className="blog-visual-placeholder-label">{post.category}</span>
      )}
    </Link>
  );
}

export default function BlogPage() {
  const [featuredPost, ...recentPosts] = BLOG_POSTS;
  const popularPosts = BLOG_POSTS.slice(0, 3);

  return (
    <div className="bg-white">
      <section className="blog-hero">
        <div className="mx-auto max-w-6xl px-5 pb-14 pt-16 sm:px-8 lg:pb-16 lg:pt-20">
          <div className="max-w-4xl">
            <p className="eyebrow">Pinterest blog</p>
            <h1 className="brand-display mt-4 headline-hero text-[var(--heading)]">
              Learn how Pinterest can help the right people <span className="text-gradient">find your brand.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Read simple, strategic notes on Pinterest marketing, content, ads, and the path from being found to being remembered.
            </p>
          </div>

        </div>
      </section>

      <section className="bg-white">
        <div className="blog-index-layout mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-18">
          <main className="blog-feed" aria-label="Blog articles">
            {featuredPost ? (
              <article className="blog-featured-card reveal-on-scroll">
                <BlogVisual post={featuredPost} variant="featured" />
                <div className="blog-featured-body">
                  <p className="eyebrow">{featuredPost.category}</p>
                  <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
                    <Link href={`/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>
                  <p className="mt-3 text-sm font-semibold text-[var(--brand-rust)]">By Susy Cid · {featuredPost.date}</p>
                  <p className="mt-5 text-base leading-7 text-[var(--muted)]">{featuredPost.excerpt}</p>
                  <Link className="button-primary mt-7 inline-flex min-h-11 items-center justify-center px-5" href={`/${featuredPost.slug}`}>
                    Read article
                  </Link>
                </div>
              </article>
            ) : null}

            <div className="mt-8 grid gap-5">
              {recentPosts.map((post) => (
                <article key={post.slug} className="blog-list-card reveal-on-scroll">
                  <BlogVisual post={post} variant="list" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-pink)]">{post.category}</p>
                    <h2 className="brand-display mt-2 headline-card text-[var(--heading)]">
                      <Link href={`/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-[var(--brand-rust)]">By Susy Cid · {post.date}</p>
                    <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{post.excerpt}</p>
                    <Link className="mt-5 inline-flex text-sm font-bold text-[var(--brand-pink)]" href={`/${post.slug}`}>
                      Continue reading
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </main>

          <aside className="blog-sidebar" aria-label="Blog sidebar">
            <div className="blog-sidebar-inner">
              <section className="blog-sidebar-card blog-search-card">
                <label className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-rust)]" htmlFor="blog-search">
                  Search
                </label>
                <div className="blog-search-field">
                  <svg className="blog-search-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m16 16 4 4" />
                  </svg>
                  <input id="blog-search" className="blog-search-input" type="search" placeholder="Search articles, topics, or Pinterest questions..." />
                </div>
              </section>

              <section className="blog-sidebar-card blog-fit-check-card reveal-on-scroll">
                <p className="eyebrow">Start here</p>
                <h2 className="brand-display mt-3 headline-card text-[var(--heading)]">Not sure if Pinterest is worth building around?</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Take the Pinterest Fit Check and get a quick direction based on your offer, content, website, and goals.
                </p>
                <div className="blog-mini-badges mt-4" aria-label="Pinterest Fit Check details">
                  <span>2 minutes</span>
                  <span>Immediate result</span>
                </div>
                <Link className="button-primary mt-5 inline-flex min-h-11 items-center justify-center px-5" href={PINTEREST_FIT_CHECK_URL}>
                  Start the Fit Check
                </Link>
              </section>

              <section className="blog-sidebar-card blog-about-card reveal-on-scroll">
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
                <h2 className="brand-display mt-5 headline-card text-[var(--heading)]">I&apos;m Susy. I help brands make Pinterest make sense.</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  I work with product brands and content-led businesses that want more than pretty pins, random saves, or another marketing chore.
                </p>
                <Link className="mt-5 inline-flex text-sm font-bold text-[var(--brand-pink)]" href="/about">
                  Learn more
                </Link>
              </section>

              <section className="blog-sidebar-card blog-optin-card reveal-on-scroll">
                <div className="blog-optin-visual">
                  <Image
                    src="/images/pinterest-growth-workbench.webp"
                    alt="Pinterest strategy guide preview"
                    width={768}
                    height={419}
                    className="h-full w-full object-cover"
                    sizes="(min-width: 1024px) 20vw, 86vw"
                  />
                </div>
                <p className="eyebrow mt-5">Pinterest notes</p>
                <h2 className="brand-display mt-3 headline-card text-[var(--heading)]">Want Pinterest notes you can actually use?</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Get practical strategy notes on visibility, content, ads, and how to make Pinterest support the business behind the pins.
                </p>
                <form className="mt-5 grid gap-3">
                  <input className="blog-form-input" type="text" name="name" placeholder="Your name" />
                  <input className="blog-form-input" type="email" name="email" placeholder="Email address" />
                  <button className="button-primary min-h-11 px-5" type="button">
                    Send me the notes
                  </button>
                </form>
                <p className="mt-3 text-xs leading-5 text-[var(--muted)]">Occasional Pinterest strategy notes. Unsubscribe anytime.</p>
              </section>

              <section className="blog-sidebar-card reveal-on-scroll">
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--brand-rust)]">Popular reads</h2>
                <div className="mt-4 grid gap-4">
                  {popularPosts.map((post) => (
                    <Link key={post.slug} className="blog-popular-link" href={`/${post.slug}`}>
                      <span>{post.category}</span>
                      {post.title}
                    </Link>
                  ))}
                </div>
              </section>

              <section className="blog-sidebar-card blog-resource-card reveal-on-scroll">
                <h2 className="brand-display headline-card text-[var(--heading)]">Need a softer next step?</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Find checklists, tools, and planning resources to help you understand where Pinterest fits before booking a call.
                </p>
                <Link className="button-outline mt-5" href="/resources">
                  Visit resources
                </Link>
              </section>
            </div>
          </aside>
        </div>
      </section>

      <section className="blog-final-cta-section bg-white px-5 sm:px-8">
        <CursorGlowPanel className="cta-wave blog-final-cta-panel mx-auto max-w-6xl reveal-on-scroll">
          <h2 className="brand-display max-w-3xl headline-section text-[var(--heading)]">
            Want to know what this could look like for <span className="text-gradient">your brand?</span>
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)]">
            Start with a Fit Call and we&apos;ll look at your business, your goals, and whether Pinterest is worth building around right now.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link className="button-primary inline-flex min-h-12 items-center justify-center px-6" href={BOOKING_URL}>
              {FIT_CALL_LABEL}
            </Link>
            <Link className="button-outline" href={PINTEREST_FIT_CHECK_URL}>
              Start the Fit Check
            </Link>
          </div>
        </CursorGlowPanel>
      </section>
    </div>
  );
}
