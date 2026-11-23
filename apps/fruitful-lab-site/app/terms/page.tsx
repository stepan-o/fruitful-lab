import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Use"
        description="Basic terms for using the Fruitful Lab website and resources."
      />
      <Section>
        <SectionInner className="max-w-3xl space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-[var(--heading)]">Website content</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              The content on this website is provided for general education and business information. It is not a guarantee of specific marketing, revenue, or advertising results.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[var(--heading)]">Use of resources</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Free and paid resources from Fruitful Lab are for your business use unless a separate agreement says otherwise. Please do not resell, copy, or redistribute them as your own products.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold text-[var(--heading)]">Contact</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Questions about these terms can be sent to <a className="font-semibold text-[var(--heading)]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </section>
        </SectionInner>
      </Section>
    </div>
  );
}
