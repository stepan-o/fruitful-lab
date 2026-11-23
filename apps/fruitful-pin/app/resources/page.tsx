import Image from "next/image";
import Link from "next/link";
import { PinterestFitAssessmentEmbed } from "@/components/PinterestFitAssessmentEmbed";
import { BLOG_POSTS, RESOURCE_ITEMS, TOOL_STACK } from "@/lib/content";
import { PINTEREST_FIT_CHECK_URL } from "@/lib/site";

export const metadata = {
  title: "Resources",
  description: "Free Pinterest resources, guides, checklists, prompt sheets, and strategy articles from Fruitful Pin.",
};

const featuredPosts = BLOG_POSTS.slice(0, 3);

export default function ResourcesPage() {
  return (
    <div className="bg-white">
      <section className="resources-hero" id="pinterest-fit-check">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Free Pinterest resources</p>
            <h1 className="brand-display mt-4 text-4xl leading-tight text-[var(--heading)] sm:text-5xl lg:text-6xl">
              Start with the <span className="text-gradient">Pinterest Fit Check</span>, then choose the right resource.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Before you download another checklist or build another content plan, get a quick read on whether Pinterest makes sense for your offer, content, and website right now.
            </p>
            <ul className="resource-hero-promises mt-7">
              <li>See whether Pinterest looks strong, promising, or better saved for later.</li>
              <li>Use the result to pick the guide, article, or service path that fits your stage.</li>
              <li>Keep browsing if you are not ready for a fit call yet.</li>
            </ul>
            <Link className="mt-6 inline-flex text-sm font-bold text-[var(--brand-pink)]" href={PINTEREST_FIT_CHECK_URL}>
              Open the dedicated Fit Check page
            </Link>
          </div>

          <PinterestFitAssessmentEmbed />
        </div>
      </section>

      <section id="resource-library" className="bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="eyebrow">Resource library</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
              Find the thing that matches your next question.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Use this page like a small Pinterest starting shelf: a guide when you need direction, a checklist when you need clarity, and blog articles when you want to understand the moving pieces.
            </p>
          </div>
          <div className="resource-path-grid mt-9">
            {RESOURCE_ITEMS.map((item) => (
              <article key={item.title} className="resource-path-card reveal-on-scroll">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-pink)]">{item.type}</p>
                  <p className="rounded-full bg-[var(--surface-warm)] px-3 py-1 text-xs font-bold text-[var(--brand-rust)]">{item.status}</p>
                </div>
                <h3 className="brand-display mt-4 text-2xl leading-tight text-[var(--heading)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
                <Link className="mt-6 inline-flex text-sm font-bold text-[var(--brand-pink)]" href={item.ctaHref}>
                  {item.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-swell bg-[var(--surface-soft)]">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="resource-stack-panel">
            <div>
              <p className="eyebrow">Helpful tools</p>
              <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">A few tools that keep the work from turning into a mess.</h2>
              <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                Pinterest gets easier when ideas, publishing, email capture, and reporting have a place to live. This is the kind of simple stack that keeps the work moving.
              </p>
            </div>
            <div className="grid gap-4">
              {TOOL_STACK.map((tool) => (
                <article key={tool.name} className="resource-tool-card">
                  <h3 className="text-lg font-semibold text-[var(--heading)]">{tool.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{tool.role}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:py-20">
          <div>
            <p className="eyebrow">From the blog</p>
            <h2 className="brand-display mt-3 text-3xl leading-tight text-[var(--heading)] sm:text-4xl">
              Read the fuller Pinterest picture when you want more context.
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              The blog is where the longer Pinterest articles live: organic strategy, ads, product discovery, and what your pins are supposed to do after someone clicks.
            </p>
          </div>
          <div className="grid gap-4">
            {featuredPosts.map((post) => (
              <Link key={post.slug} className="resource-read-card reveal-on-scroll" href={`/${post.slug}`}>
                <div className="resource-read-visual">
                  {post.featuredImage ? (
                    <Image
                      src={post.featuredImage.src}
                      alt={post.featuredImage.alt}
                      fill
                      className="blog-visual-image"
                      sizes="(min-width: 1024px) 24vw, 92vw"
                    />
                  ) : (
                    <span>{post.category}</span>
                  )}
                </div>
                <span>{post.category}</span>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
                <small>{post.date}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
