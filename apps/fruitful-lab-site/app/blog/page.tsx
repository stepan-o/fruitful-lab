import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { BLOG_POSTS, RESOURCE_ITEMS } from "@/lib/content";

export const metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Blog"
        title="Notes on marketing systems, AI workflows, funnels, and content that has a job."
        description="A starting editorial home for the bigger Fruitful Lab point of view while the final content strategy gets sharper."
      />
      <Section>
        <SectionInner className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-5">
            {BLOG_POSTS.map((post) => (
              <article key={post.slug} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
                <p className="text-sm font-semibold text-[var(--bronze)]">{post.category}</p>
                <h2 className="mt-3 text-2xl font-semibold leading-snug text-[var(--heading)]">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-2 text-sm text-[var(--sage)]">{post.date}</p>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{post.excerpt}</p>
                <Link className="mt-6 inline-flex text-sm font-semibold text-[var(--bronze)]" href={`/blog/${post.slug}`}>
                  Read article
                </Link>
              </article>
            ))}
          </div>
          <aside className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 lg:sticky lg:top-28">
            <h2 className="text-lg font-semibold text-[var(--heading)]">Resource ideas</h2>
            <div className="mt-5 space-y-4">
              {RESOURCE_ITEMS.map((item) => (
                <div key={item.title}>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--bronze)]">{item.type}</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--heading)]">{item.title}</p>
                </div>
              ))}
            </div>
            <Link className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--heading)] px-5 text-sm font-semibold text-white" href="/resources">
              View resources
            </Link>
          </aside>
        </SectionInner>
      </Section>
    </div>
  );
}
