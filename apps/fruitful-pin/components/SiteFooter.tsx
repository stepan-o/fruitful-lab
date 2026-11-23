import Link from "next/link";
import { CERTIFICATION_BADGES } from "@/lib/content";
import { BOOKING_URL, CONTACT_EMAIL, FIT_CALL_LABEL, FOOTER_LINKS, SITE_NAME } from "@/lib/site";

const footerGroups = [
  { title: "Explore", labels: ["Blog", "Services", "Resources", "About"] },
  { title: "Proof and contact", labels: ["Case Studies", "Contact"] },
  { title: "Legal", labels: ["Privacy", "Terms"] },
] as const;

function getFooterLink(label: (typeof FOOTER_LINKS)[number]["label"]) {
  const link = FOOTER_LINKS.find((item) => item.label === label);

  if (!link) {
    throw new Error(`Missing footer link: ${label}`);
  }

  return link;
}

export function SiteFooter() {
  return (
    <footer
      className="site-footer"
      style={{
        background: "radial-gradient(circle at 82% 16%, rgba(149, 9, 82, 0.22), transparent 22rem), linear-gradient(135deg, #0b132b, #080d20 72%)",
        color: "rgba(255, 255, 255, 0.76)",
      }}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 text-sm sm:px-8 lg:grid-cols-[1.15fr_0.85fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md bg-[var(--brand-pink)] text-sm font-bold text-white">FP</span>
            <p className="site-footer-brand text-lg font-semibold">{SITE_NAME}</p>
          </div>
          <p className="mt-4 max-w-md leading-6">Warm Pinterest strategy for product brands and content-led businesses that want more than pretty pins.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {CERTIFICATION_BADGES.map((badge, index) => (
              <span key={badge.label} className="certification-badge">
                <span className="certification-provider">Pinterest</span>
                <span className="certification-mark" aria-hidden="true">P</span>
                <span className="certification-title">{index === 0 ? "Certified Media Buyer" : "Certified Media Planner"}</span>
              </span>
            ))}
          </div>
          <a className="site-footer-email mt-5 inline-flex text-sm font-semibold" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          <p className="mt-6 text-xs">(c) {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
        <nav className="site-footer-nav" aria-label="Footer">
          {footerGroups.map((group) => (
            <div key={group.title} className="site-footer-nav-group">
              <p>{group.title}</p>
              <div>
                {group.labels.map((label) => {
                  const item = getFooterLink(label);

                  return (
                    <Link key={item.href} className="hover:text-white" href={item.href}>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="site-footer-card p-5">
          <p className="font-semibold">Not sure where Pinterest fits?</p>
          <p className="mt-2 leading-6">Start with a fit call and we will sort the Pinterest path before anyone touches a pin.</p>
          <Link className="button-primary mt-4 inline-flex min-h-10 items-center justify-center rounded-md px-4 text-sm font-semibold" href={BOOKING_URL}>
            {FIT_CALL_LABEL}
          </Link>
        </div>
      </div>
    </footer>
  );
}
