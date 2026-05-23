import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description: "How Fruitful Pin handles inquiry information, email communication, and privacy questions.",
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="Fruitful Pin values clear communication, consent-based marketing, and careful handling of inquiry information."
      />
      <Section>
        <SectionInner className="max-w-3xl">
          <div className="warm-panel rounded-md p-6">
            <h2 className="brand-display headline-card text-[var(--heading)]">Privacy questions</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              For questions about personal information, email communication, or data handling, contact Fruitful Pin at <a className="font-semibold text-[var(--raspberry)]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        </SectionInner>
      </Section>
    </div>
  );
}
