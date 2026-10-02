import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { BLOG_POSTS, RESOURCE_ITEMS, type BlogPost } from "@/lib/content";

export const metadata = { title: "Blog" };

function BlogVisual({ post, variant }: { post: BlogPost; variant: "featured" | "list" }) {
  const className = variant === "featured" ? "blog-featured-visual" : "blog-list-visual";

  return (
    <Link className={className} href={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
      <span className="blog-visual-label">{post.category}</span>
    </Link>
  );
}

export default function BlogPage() {
  const [featuredPost, ...recentPosts] = BLOG_POSTS;
  const popularPosts = BLOG_POSTS.slice(0, 3);

  return (
    <div>
      <PageHeader
        eyebrow="Blog"
        title="Notes on product discovery, search, content ecosystems, data, and AI-supported workflows."
        description="A starting editorial home for the bigger Fruitful Lab point of view while the final content strategy gets sharper."
      />

      <section className="section-plain">
        <div className="blog-index-layout mx-auto max-w-6xl px-5 py-14 sm:px-8 lg:py-18">
          <main className="blog-feed" aria-label="Blog articles">
            {featuredPost ? (
              <article className="blog-featured-card">
                <BlogVisual post={featuredPost} variant="featured" />
                <div className="blog-featured-body">
                  <p className="eyebrow">{featuredPost.category}</p>
                  <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[var(--heading)] sm:text-4xl">
                    <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                  </h2>
                  <p className="mt-3 text-sm font-black text-[var(--gold)]">By Fruitful Lab · {featuredPost.date}</p>
                  <p className="mt-5 text-base leading-7 text-[var(--muted)]">{featuredPost.excerpt}</p>
                  <Link className="btn btn-primary mt-7 min-h-11 px-5 py-2 text-sm" href={`/blog/${featuredPost.slug}`}>
                    Read article
                  </Link>
                </div>
              </article>
            ) : null}

            <div className="mt-8 grid gap-5">
              {recentPosts.map((post) => (
                <article key={post.slug} className="blog-list-card">
                  <BlogVisual post={post} variant="list" />
                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[var(--cobalt)]">{post.category}</p>
                    <h2 className="mt-2 text-2xl font-extrabold leading-tight text-[var(--heading)]">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="mt-2 text-sm font-black text-[var(--gold)]">By Fruitful Lab · {post.date}</p>
                    <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{post.excerpt}</p>
                    <Link className="mt-5 inline-flex text-sm font-black text-[var(--cobalt)]" href={`/blog/${post.slug}`}>
                      Continue reading
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </main>

          <aside className="blog-sidebar" aria-label="Blog sidebar">
            <div className="blog-sidebar-inner">
              <section className="blog-sidebar-card">
                <label className="text-xs font-black uppercase tracking-[0.14em] text-[var(--gold)]" htmlFor="blog-search">
                  Search
                </label>
                <div className="blog-search-field">
                  <svg className="blog-search-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m16 16 4 4" />
                  </svg>
                  <input id="blog-search" className="blog-search-input" type="search" placeholder="Search, content, data..." />
                </div>
              </section>

              <section className="blog-sidebar-card">
                <div className="blog-about-mark">FL</div>
                <h2 className="mt-5 text-2xl font-extrabold leading-tight text-[var(--heading)]">Fruitful Lab is the strategy and systems brain behind the bigger brand family.</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  Susy and Stepan bring together product discovery, search, content, data, reporting, testing, paid media, email, and practical AI workflows.
                </p>
                <Link className="mt-5 inline-flex text-sm font-black text-[var(--cobalt)]" href="/about">
                  About the studio
                </Link>
              </section>

              <section className="blog-sidebar-card blog-optin-card">
                <div className="blog-optin-visual">
                  <span className="blog-visual-label">Product Discovery Map</span>
                </div>
                <p className="eyebrow mt-5">Start here</p>
                <h2 className="mt-3 text-2xl font-extrabold leading-tight text-[var(--heading)]">Want a clearer first move?</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                  The future lead magnet can live here: a product discovery checklist, search/content map, reporting worksheet, or diagnostic preview.
                </p>
                <form className="mt-5 grid gap-3">
                  <input className="blog-form-input" type="text" name="name" placeholder="Your name" />
                  <input className="blog-form-input" type="email" name="email" placeholder="Email address" />
                  <button className="btn btn-primary min-h-11 px-5 py-2 text-sm" type="button">
                    Send me the map
                  </button>
                </form>
              </section>

              <section className="blog-sidebar-card">
                <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[var(--gold)]">Popular reads</h2>
                <div className="mt-4 grid gap-4">
                  {popularPosts.map((post) => (
                    <Link key={post.slug} className="blog-popular-link" href={`/blog/${post.slug}`}>
                      <span>{post.category}</span>
                      {post.title}
                    </Link>
                  ))}
                </div>
              </section>

              <section className="blog-sidebar-card blog-resource-card">
                <h2 className="text-2xl font-extrabold leading-tight">Explore the resource library.</h2>
                <p className="mt-3 text-sm leading-6">
                  Find checklists, planning tools, and future diagnostics when you want a softer next step than a call.
                </p>
                <div className="mt-5 grid gap-3">
                  {RESOURCE_ITEMS.slice(0, 3).map((item) => (
                    <Link key={item.title} className="text-sm font-black text-[var(--amber)]" href="/resources">
                      {item.title}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
