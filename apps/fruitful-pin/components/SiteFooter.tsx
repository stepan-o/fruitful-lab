import Image from "next/image";
import Link from "next/link";
import { BRAND_ASSETS } from "@/lib/brandAssets";
import { CONTACT_EMAIL, FOOTER_LINKS, SITE_NAME } from "@/lib/site";

const footerGroups = [
  { title: "Explore", labels: ["Blog", "Services", "Resources", "About"] },
  { title: "Contact", labels: ["Contact"] },
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
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 text-sm sm:px-8 lg:grid-cols-[1.05fr_1.15fr]">
        <div>
          <div className="site-footer-brand-row">
            <Image
              src={BRAND_ASSETS.logoRaspberry}
              alt={SITE_NAME}
              width={860}
              height={390}
              className="site-footer-logo"
            />
          </div>
          <p className="mt-4 max-w-md leading-6">Strategic Pinterest growth for product brands with something people need to find, understand, and choose.</p>
          <div className="footer-certification-image mt-5">
            <Image
              src={BRAND_ASSETS.pinterestCertifications}
              alt="Pinterest Certified Media Buyer and Pinterest Certified Media Planner badges"
              width={760}
              height={430}
            />
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
      </div>
    </footer>
  );
}
