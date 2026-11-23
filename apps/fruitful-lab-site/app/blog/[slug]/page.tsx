import Link from "next/link";
import { notFound } from "next/navigation";
import { Section, SectionInner } from "@/components/Section";
import { BLOG_POSTS, getPostBySlug } from "@/lib/content";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

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

  return (
    <article>
      <section className="page-header">
        <div className="relative z-10 mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-20">
          <p className="eyebrow">{post.category}</p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight text-[var(--heading)] sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-sm text-[var(--muted)]">{post.date}</p>
          <p className="mt-6 text-lg leading-8 text-[var(--muted)]">{post.excerpt}</p>
        </div>
      </section>
      <Section>
        <SectionInner className="max-w-3xl">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold text-[var(--heading)]">Key takeaways</h2>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--foreground)]">
              {post.keyTakeaways.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div className="mt-10 space-y-9">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-semibold text-[var(--heading)]">{section.heading}</h2>
                <p className="mt-4 text-base leading-8 text-[var(--muted)]">{section.body}</p>
              </section>
            ))}
          </div>
          <div className="mt-12 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-xl font-semibold text-[var(--heading)]">Want to turn this into a working system?</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Book a conversation and we can look at the offer, funnel, content, and workflow pieces together.</p>
            <Link className="btn btn-primary mt-5 min-h-11 px-5 py-2 text-sm" href="/contact">
              Book a call
            </Link>
          </div>
        </SectionInner>
      </Section>
    </article>
  );
}
