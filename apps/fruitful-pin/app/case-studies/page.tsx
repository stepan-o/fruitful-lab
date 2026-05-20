import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { CASE_STUDIES } from "@/lib/content";

export const metadata = { title: "Case Studies" };

export default function CaseStudiesPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Case studies"
        title="Pinterest results from organic strategy, ads, and seasonal campaigns."
        description="This page is ready for deeper proof stories once final case-study copy, images, and client permissions are confirmed."
      />
      <Section>
        <SectionInner className="grid gap-5 md:grid-cols-3">
          {CASE_STUDIES.map((study) => (
            <article key={study.brand} className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
              <h2 className="text-xl font-semibold text-[var(--heading)]">{study.brand}</h2>
              <p className="mt-2 text-sm text-[var(--sage)]">{study.context}</p>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{study.result}</p>
            </article>
          ))}
        </SectionInner>
      </Section>
      <Section surface="surface">
        <SectionInner>
          <div className="max-w-3xl">
            <h2 className="text-3xl font-semibold text-[var(--heading)]">Next proof layer</h2>
            <p className="mt-4 text-base leading-7 text-[var(--muted)]">The migration should later replace these snapshots with approved stories, screenshots, baseline metrics, methodology, and client-safe claims.</p>
            <Link className="mt-6 inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--heading)] px-5 text-sm font-semibold text-white" href="/contact">
              Talk about your goals
            </Link>
          </div>
        </SectionInner>
      </Section>
    </div>
  );
}
