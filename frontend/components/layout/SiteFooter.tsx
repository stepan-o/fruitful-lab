export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-slate-600">
          Pinterest & funnel studio for baby, family, and lifestyle brands.
        </p>
        <nav className="flex items-center gap-4">
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
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-6 text-xs text-slate-500">
        © {year} Fruitful Lab
      </div>
    </footer>
  );
}
