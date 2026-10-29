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
        title="Guides, templates, and practical assets for clearer product discovery."
        description="This page can become the home for lead magnets, worksheets, search/content maps, reporting prompts, AI workflow maps, and future client-facing tools."
      />
      <Section>
        <SectionInner>
          <div className="grid gap-5 md:grid-cols-3">
            {RESOURCE_ITEMS.map((item) => (
              <article key={item.title} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
                <p className="text-sm font-black text-[var(--cobalt)]">{item.type}</p>
                <h2 className="mt-3 text-xl font-semibold text-[var(--heading)]">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.description}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-2xl font-semibold text-[var(--heading)]">Need the system built with you?</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Resources can support the thinking. Services are for turning that thinking into a search path, content ecosystem, funnel, reporting rhythm, campaign, email path, or workflow.
            </p>
            <Link className="btn btn-primary mt-5 min-h-11 px-5 py-2 text-sm" href="/services">
              Explore services
            </Link>
          </div>
        </SectionInner>
      </Section>
    </div>
  );
}
