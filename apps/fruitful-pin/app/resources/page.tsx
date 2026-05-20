import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { RESOURCE_ITEMS } from "@/lib/content";

export const metadata = { title: "Resources" };

export default function ResourcesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Resources"
        title="Pinterest tools and templates that help you move with more clarity."
        description="This page preserves the current resources hub as a future home for free tools, downloads, mini-courses, and recommended platforms."
      />
      <Section>
        <SectionInner>
          <div className="grid gap-5 md:grid-cols-3">
            {RESOURCE_ITEMS.map((item) => (
              <article key={item.title} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
                <p className="text-sm font-semibold text-[var(--raspberry)]">{item.type}</p>
                <h2 className="mt-3 text-xl font-semibold text-[var(--heading)]">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-2xl font-semibold text-[var(--heading)]">Want strategic support instead?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">The resource hub can stay lightweight while the service pages carry the main sales path. Use this page for lead magnets and practical trust-building assets.</p>
            <Link className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--heading)] px-5 text-sm font-semibold text-white" href="/pinterest-services">
              Explore services
            </Link>
          </div>
        </SectionInner>
      </Section>
    </div>
  );
}
