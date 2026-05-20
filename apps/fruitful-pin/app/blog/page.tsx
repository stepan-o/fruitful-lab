import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { BLOG_POSTS } from "@/lib/content";

export const metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Blog"
        title="Pinterest strategy for brands that want useful traffic."
        description="Search-led articles on organic Pinterest, ads, content systems, and how to build a channel that compounds."
      />
      <Section>
        <SectionInner className="grid gap-5 md:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="flex flex-col rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
              <p className="text-sm font-semibold text-[var(--raspberry)]">{post.category}</p>
              <h2 className="mt-3 text-xl font-semibold leading-snug text-[var(--heading)]">
                <Link href={`/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-2 text-sm text-[var(--sage)]">{post.date}</p>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{post.excerpt}</p>
              <Link className="mt-6 text-sm font-semibold text-[var(--raspberry)]" href={`/${post.slug}`}>
                Read article
              </Link>
            </article>
          ))}
        </SectionInner>
      </Section>
    </div>
  );
}
