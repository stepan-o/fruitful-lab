import Link from "next/link";
import { FOOTER_LINKS, SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-[var(--muted)] sm:px-8 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {SITE_NAME}</p>
        <nav className="flex flex-wrap gap-4" aria-label="Footer">
          {FOOTER_LINKS.map((item) => (
            <Link key={item.href} className="hover:text-[var(--raspberry)]" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
