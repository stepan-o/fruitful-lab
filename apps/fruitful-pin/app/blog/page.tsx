import Image from "next/image";
import Link from "next/link";
import { BLOG_POSTS, type BlogPost } from "@/lib/content";
import { BOOKING_URL, FIT_CALL_LABEL } from "@/lib/site";

export const metadata = {
  title: "Blog",
  description: "Pinterest strategy articles for product brands, content creators, and businesses building long-term discovery.",
};

const HEADSHOT = "https://fruitfulpin.com/wp-content/uploads/2025/12/Cid-headshot.webp";

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
          sizes={variant === "featured" ? "(min-width: 1024px) 34vw, 92vw" : "(min-width: 1024px) 18vw, 92vw"}
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
            <h1 className="brand-display mt-4 text-4xl leading-tight text-[var(--heading)] sm:text-5xl lg:text-6xl">
              Strategy notes for Pinterest that keeps <span className="text-gradient">working after publish day.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Search-led articles on organic Pinterest, ads, content systems, and the small strategic choices that make pins worth clicking.
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
                  <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
                    <Link href={`/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>
                  <p className="mt-3 text-sm font-semibold text-[var(--brand-rust)]">By Susy Cid · {featuredPost.date}</p>
                  <p className="mt-5 text-base leading-7 text-[var(--muted)]">{featuredPost.excerpt}</p>
                  <Link className="button-primary mt-7 inline-flex min-h-11 items-center justify-center rounded-md px-5 text-sm font-semibold" href={`/${featuredPost.slug}`}>
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
                    <h2 className="brand-display mt-2 text-2xl leading-tight text-[var(--heading)]">
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
                  <input id="blog-search" className="blog-search-input" type="search" placeholder="Pinterest ads, SEO, product pins..." />
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
                    alt="Pinterest strategy guide preview"
                    width={768}
                    height={419}
                    className="h-full w-full object-cover"
                    sizes="(min-width: 1024px) 20vw, 86vw"
                  />
                </div>
                <p className="eyebrow mt-5">Start here</p>
                <h2 className="brand-display mt-3 text-2xl leading-tight text-[var(--heading)]">Want more Pinterest strategies in your inbox?</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Get sustainable Pinterest tips, case studies, and tools for turning content into a longer-lasting traffic path.
                </p>
                <form className="mt-5 grid gap-3">
                  <input className="blog-form-input" type="text" name="name" placeholder="Your name" />
                  <input className="blog-form-input" type="email" name="email" placeholder="Email address" />
                  <button className="button-primary min-h-11 rounded-md px-5 text-sm font-semibold" type="button">
                    Send me the tips
                  </button>
                </form>
              </section>

              <section className="blog-sidebar-card">
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

              <section className="blog-sidebar-card blog-resource-card">
                <h2 className="brand-display text-2xl leading-tight text-[var(--heading)]">Explore the resource library.</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Find checklists, tools, and deeper Pinterest planning resources when you want a softer next step.</p>
                <Link className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md border border-[var(--brand-navy)] bg-white px-5 text-sm font-semibold text-[var(--brand-navy)]" href="/resources">
                  Visit resources
                </Link>
              </section>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-white px-5 pb-16 sm:px-8 lg:pb-20">
        <div className="cta-wave mx-auto max-w-6xl">
          <h2 className="brand-display max-w-3xl text-3xl leading-tight text-[var(--heading)] sm:text-5xl">Want this mapped to your brand?</h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-[var(--muted)]">
            Start with a fit call and we&apos;ll look at your content, offer, and Pinterest opportunity without guessing.
          </p>
          <Link className="button-primary mt-7 inline-flex min-h-12 items-center justify-center rounded-md px-6 text-sm font-semibold" href={BOOKING_URL}>
            {FIT_CALL_LABEL}
          </Link>
        </div>
      </section>
    </div>
  );
}
