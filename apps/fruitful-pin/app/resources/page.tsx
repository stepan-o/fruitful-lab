import Image from "next/image";
import Link from "next/link";
import { CursorGlowPanel } from "@/components/CursorGlowPanel";
import { PinterestFitAssessmentEmbed } from "@/components/PinterestFitAssessmentEmbed";
import { BLOG_POSTS, RESOURCE_ITEMS, TOOL_STACK } from "@/lib/content";
import { BOOKING_URL, FIT_CALL_LABEL, PINTEREST_FIT_CHECK_URL } from "@/lib/site";

export const metadata = {
  title: "Resources",
  description: "Free Pinterest resources, the Pinterest Fit Check, practical guides, helpful tools, and strategy articles from Fruitful Pin.",
};

const featuredPosts = BLOG_POSTS.slice(0, 3);

export default function ResourcesPage() {
  return (
    <div className="bg-white">
      <section className="resources-hero" id="pinterest-fit-check">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="eyebrow">Free Pinterest resources</p>
            <h1 className="brand-display mt-4 headline-hero text-[var(--heading)]">
              Start with the <span className="text-gradient">Pinterest Fit Check</span>, then choose the right resource.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
              Not every brand needs the same next step. Take the quick Fit Check first, then use your result to choose the guide, article, checklist, or tool that matches where your business is right now.
            </p>
            <ul className="resource-hero-promises mt-7">
              <li>See whether Pinterest looks strong, promising, or better saved for later.</li>
              <li>Use your result to choose the next guide, article, or service path.</li>
              <li>Keep learning if you are not ready for a Fit Call yet.</li>
            </ul>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a className="button-primary inline-flex min-h-12 items-center justify-center px-6" href="#pinterest-fit-check-card">
                Start the Fit Check
              </a>
              <Link className="resource-hero-link inline-flex text-sm font-bold text-[var(--brand-pink)]" href={PINTEREST_FIT_CHECK_URL}>
                Take the Fit Check on its own page
              </Link>
            </div>
          </div>

          <div id="pinterest-fit-check-card" className="zoom-on-scroll">
            <PinterestFitAssessmentEmbed />
          </div>
        </div>
      </section>

      <section id="resource-library" className="resource-library-section bg-white">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow">Resource library</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              Find the thing that matches your <span className="text-gradient">next question.</span>
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Use this page like a small Pinterest starting shelf: a guide when you need direction, a checklist when you need clarity, a keyword tool when you need better search language, and blog articles when you want more context.
            </p>
          </div>
          <div className="resource-path-grid mt-9">
            {RESOURCE_ITEMS.map((item) => (
              <article key={item.title} className="resource-path-card reveal-on-scroll">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-pink)]">{item.type}</p>
                  <p className="resource-status-badge">{item.status}</p>
                </div>
                <h3 className="brand-display mt-4 headline-card text-[var(--heading)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
                <Link className="mt-6 inline-flex text-sm font-bold text-[var(--brand-pink)]" href={item.ctaHref}>
                  {item.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="resources-tools-section section-swell bg-[var(--surface-soft)]">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="resource-stack-panel">
            <div>
              <p className="eyebrow">Helpful tools</p>
              <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
                Tools that make Pinterest work <span className="text-gradient">easier to manage.</span>
              </h2>
              <p className="mt-4 text-base leading-7 text-[var(--muted)]">
                Pinterest gets easier when your content ideas, publishing rhythm, email capture, and reporting have a place to live. These are tools I use or recommend for keeping the work organized.
              </p>
              <p className="resource-disclosure mt-5">
                Some links may be affiliate links, which means I may earn a commission if you choose to use them. I only share tools I would actually recommend.
              </p>
            </div>
            <div className="grid gap-4">
              {TOOL_STACK.map((tool) => (
                <article key={tool.name} className="resource-tool-card reveal-on-scroll">
                  <h3 className="headline-compact text-[var(--heading)]">{tool.name}</h3>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-rust)]">{tool.bestFor}</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{tool.description}</p>
                  <a className="mt-5 inline-flex text-sm font-bold text-[var(--brand-pink)]" href={tool.ctaHref} target="_blank" rel="noreferrer">
                    View tool
                  </a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="resources-blog-section bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="eyebrow">From the blog</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              Want more context before you choose a next step?
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              The blog is where the longer Pinterest breakdowns live: organic strategy, ads, product discovery, content planning, and the small decisions that help people find and choose your brand.
            </p>
            <Link className="button-outline mt-7" href="/blog">
              Read the blog
            </Link>
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
                      sizes="(min-width: 1024px) 38rem, 92vw"
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

      <section className="resource-final-cta-section bg-white px-5 sm:px-8">
        <CursorGlowPanel className="cta-wave resource-final-cta-panel mx-auto max-w-6xl reveal-on-scroll">
          <div className="max-w-3xl">
            <p className="eyebrow">Start here</p>
            <h2 className="brand-display mt-3 headline-section text-[var(--heading)]">
              Not sure which resource fits? <span className="text-gradient">Start with the Fit Check.</span>
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">
              Answer seven quick questions and get a simple direction based on your offer, content, website, and goals. You can save your result by email and come back to it later.
            </p>
            <p className="resource-human-note mt-4">
              Not sure where to start? The Fit Check gives you a simple first direction before you choose a guide, article, or call.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary inline-flex min-h-12 items-center justify-center px-6" href={PINTEREST_FIT_CHECK_URL}>
                Start the Fit Check
              </Link>
              <Link className="button-outline" href={BOOKING_URL}>
                {FIT_CALL_LABEL}
              </Link>
            </div>
          </div>
        </CursorGlowPanel>
      </section>
    </div>
  );
}
