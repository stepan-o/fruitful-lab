import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { BOOKING_URL, CONTACT_EMAIL } from "@/lib/site";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your Pinterest strategy."
        description="Whether you are getting started or ready to scale, this is where we figure out if Fruitful Pin is the right partner for your next stage."
      />
      <Section>
        <SectionInner className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-2xl font-semibold text-[var(--heading)]">Book a discovery call</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">On the call, we will look at where you are with Pinterest, talk through goals and constraints, and outline what a practical plan could look like.</p>
            <ul className="mt-5 space-y-2 text-sm leading-6 text-[var(--foreground)]">
              <li>- Current Pinterest or content situation</li>
              <li>- Goals, timelines, and capacity</li>
              <li>- Best-fit service path or next step</li>
            </ul>
            <a className="mt-6 inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--raspberry)] px-6 text-sm font-semibold text-white" href={BOOKING_URL}>
              Book a discovery call
            </a>
          </div>
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-2xl font-semibold text-[var(--heading)]">Prefer email first?</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">For collaboration ideas, podcast invitations, speaking, or general questions, email us and include your site, offer, and what you are hoping Pinterest can support.</p>
            <p className="mt-5 text-lg font-semibold text-[var(--heading)]">{CONTACT_EMAIL}</p>
            <div className="mt-8 border-t border-[var(--border)] pt-6">
              <h3 className="text-lg font-semibold text-[var(--heading)]">Usually a good fit</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Content creators, product brands, and educators with offers already in place who want long-term growth instead of overnight hacks.</p>
            </div>
          </div>
        </SectionInner>
      </Section>
    </div>
  );
}
