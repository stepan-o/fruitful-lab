import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = {
  title: "Privacy",
  description: "How Fruitful Lab handles basic website, contact, booking, and marketing information.",
  alternates: {
    canonical: "/privacy/",
  },
};

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        description="How Fruitful Lab handles basic website, contact, and marketing information."
      />
      <Section>
        <SectionInner className="max-w-3xl space-y-8">
          <section>
            <h2 className="text-2xl font-normal text-[var(--heading)]">Information we collect</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Fruitful Lab may collect information you choose to send through email, booking forms, or future contact forms, such as your name, email address, website, business details, and project notes.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-normal text-[var(--heading)]">How we use it</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              We use this information to respond to inquiries, prepare for calls, provide services, improve the website, and understand which resources or pages are useful.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-normal text-[var(--heading)]">Contact</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Questions about privacy can be sent to <a className="font-semibold text-[var(--heading)]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </section>
        </SectionInner>
      </Section>
    </div>
  );
}
