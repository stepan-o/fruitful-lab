import Link from "next/link";
import { CONTACT_EMAIL, FOOTER_LINKS, SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--navy)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 text-sm text-white sm:px-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-lg font-extrabold text-white">{SITE_NAME}</p>
          <p className="mt-3 max-w-md leading-6 text-white/86">Marketing systems, funnels, email, paid media, AI workflows, and content strategy for brands that need clearer growth paths.</p>
          <p className="mt-4 text-[var(--amber)]">{CONTACT_EMAIL}</p>
          <p className="mt-6 text-white/68">© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
        <nav className="grid grid-cols-2 gap-3 text-white/86 md:justify-self-end" aria-label="Footer">
          {FOOTER_LINKS.map((item) => (
            <Link key={item.href} className="transition hover:text-[var(--amber)]" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
