import { PageHeader } from "@/components/PageHeader";
import { Section, SectionInner } from "@/components/Section";
import { BOOKING_URL, CONTACT_EMAIL } from "@/lib/site";

export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Contact"
        title="Book a conversation about the system behind your growth."
        description="Use TidyCal for a call, or email Fruitful Lab directly for collaborations, projects, questions, and early-stage conversations."
      />
      <Section>
        <SectionInner className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="lab-panel contact-panel p-6">
            <h2 className="text-2xl font-semibold text-[var(--heading)]">Book through TidyCal</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              A first call is for sorting the current stage: offer, funnel, ads, content, AI workflows, email, and what should be built first.
            </p>
            <ul className="mt-5 space-y-2 text-sm leading-6 text-[var(--foreground)]">
              <li>- Current marketing and growth path</li>
              <li>- Goals, constraints, and bottlenecks</li>
              <li>- Best-fit next step or project shape</li>
            </ul>
            <a className="btn btn-primary mt-6" href={BOOKING_URL}>
              Open TidyCal
            </a>
          </div>
          <div className="lab-panel contact-panel p-6">
            <h2 className="text-2xl font-semibold text-[var(--heading)]">Prefer email first?</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Send a note with your website, offer, and what feels unclear or heavy in the current marketing system.
            </p>
            <a className="mt-5 block text-lg font-semibold text-[var(--heading)]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            <div className="mt-8 border-t border-[var(--border)] pt-6">
              <h3 className="text-lg font-semibold text-[var(--heading)]">Good starting questions</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                What is the offer? Where does traffic come from? What happens after someone shows interest? Which workflow feels too manual, slow, or hard to repeat?
              </p>
            </div>
          </div>
        </SectionInner>
      </Section>
    </div>
  );
}
