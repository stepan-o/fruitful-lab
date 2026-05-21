import Link from "next/link";
import { CONTACT_EMAIL, FOOTER_LINKS, SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 text-sm text-[var(--muted)] sm:px-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-lg font-semibold text-[var(--heading)]">{SITE_NAME}</p>
          <p className="mt-3 max-w-md leading-6">AI-aware marketing systems, funnels, email, paid media, and content strategy for brands that need clearer growth paths.</p>
          <p className="mt-4">{CONTACT_EMAIL}</p>
          <p className="mt-6">© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
        <nav className="grid grid-cols-2 gap-3 md:justify-self-end" aria-label="Footer">
          {FOOTER_LINKS.map((item) => (
            <Link key={item.href} className="hover:text-[var(--bronze)]" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
