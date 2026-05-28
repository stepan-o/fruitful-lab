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
          <div className="warm-panel rounded-md p-6 text-sm leading-6 text-[var(--muted)]">
            <h2 className="brand-display headline-card text-[var(--heading)]">Information we collect</h2>
            <p className="mt-4">
              Fruitful Pin may collect information you choose to share through forms, email signup, the Pinterest Fit Check, contact messages, and booking links.
            </p>
            <p className="mt-4">
              This site also uses analytics and performance tools, including Google Analytics, Cloudflare Web Analytics, Pinterest Tag, and Microsoft Clarity, to understand site traffic, form activity, page performance, and how visitors interact with the website.
            </p>
            <p className="mt-4">
              Microsoft Clarity may capture behavioral usage data such as clicks, scrolls, heatmaps, and session recordings so Fruitful Pin can improve the website experience. These tools are used for site learning and optimization, not to sell personal information.
            </p>
            <h2 className="brand-display mt-8 headline-card text-[var(--heading)]">Privacy questions</h2>
            <p className="mt-4">
              For questions about personal information, email communication, analytics, or data handling, contact Fruitful Pin at <a className="font-semibold text-[var(--raspberry)]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
        </SectionInner>
      </Section>
    </div>
  );
}
