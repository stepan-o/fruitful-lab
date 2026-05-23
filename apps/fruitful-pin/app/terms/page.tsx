import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "Terms",
  description: "Basic terms context for Fruitful Pin Pinterest strategy, marketing support, and service inquiries.",
};

export default function TermsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Legal"
        title="Terms"
        description="Fruitful Pin provides Pinterest strategy, content systems, and marketing support through clearly scoped service engagements."
      />
      <Section>
        <SectionInner className="max-w-3xl">
          <div className="warm-panel rounded-md p-6">
            <h2 className="brand-display headline-card text-[var(--heading)]">Service questions</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              For questions about service scope, proposals, billing, or collaboration terms, contact Fruitful Pin at <a className="font-semibold text-[var(--raspberry)]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        </SectionInner>
      </Section>
    </div>
  );
}
