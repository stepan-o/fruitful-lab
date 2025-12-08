import Link from "next/link";
import { PUBLIC_NAV_LINKS } from "@/lib/nav";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-500 space-y-4">
        {/* Top row: tagline + hub mini-nav driven by shared config */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-slate-600">
            Pinterest &amp; funnel studio for baby, family, and lifestyle brands.
          </p>

          <nav className="flex flex-wrap items-center gap-4">
            {PUBLIC_NAV_LINKS.map((item) =>
              item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-700"
                >
                  {item.label}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className="hover:text-slate-700">
                  {item.label}
                </Link>
              )
            )}
          </nav>
        </div>

        {/* Bottom row: legal links + copyright */}
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap items-center gap-4">
            <a href="#" className="hover:text-slate-700">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-700">
              Imprint
            </a>
            <a href="mailto:hello@fruitfulab.com" className="hover:text-slate-700">
              Contact
            </a>
          </nav>
          <p>© {year} Fruitful Lab</p>
        </div>
      </div>
    </footer>
  );
}
