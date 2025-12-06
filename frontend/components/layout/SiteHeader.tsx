import Link from "next/link";

function NavLinks() {
  return (
    <nav className="hidden items-center gap-6 text-sm text-slate-700 md:flex">
      <Link href="#services" className="hover:text-slate-900">
        Services
      </Link>
      <Link href="#case-studies" className="hover:text-slate-900">
        Case Studies
      </Link>
      <Link href="#process" className="hover:text-slate-900">
        About
      </Link>
      <Link href="/hub" className="hover:text-slate-900">
        Resources
      </Link>
    </nav>
  );
}

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="font-semibold tracking-tight text-slate-900">
          Fruitful Lab
        </Link>

        {/* Center nav (desktop) */}
        <NavLinks />

        {/* CTAs */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="/hub"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Explore the Knowledge Hub
          </a>
          <a
            href="https://calendly.com/fruitfulab/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-sky-700 px-3 py-2 text-sm font-medium text-white shadow hover:bg-sky-800"
          >
            Book a Call
          </a>
        </div>

        {/* Mobile menu */}
        <details className="md:hidden">
          <summary className="cursor-pointer rounded-md px-2 py-1 text-slate-700 ring-slate-300 marker:hidden">
            Menu
          </summary>
          <div className="absolute left-0 right-0 z-10 mt-2 border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-col gap-3 text-sm text-slate-700">
              <Link href="#services" className="hover:text-slate-900">
                Services
              </Link>
              <Link href="#case-studies" className="hover:text-slate-900">
                Case Studies
              </Link>
              <Link href="#process" className="hover:text-slate-900">
                About
              </Link>
              <Link href="/hub" className="hover:text-slate-900">
                Resources
              </Link>
              <a
                href="/hub"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-center text-slate-700 hover:bg-slate-50"
              >
                Explore the Knowledge Hub
              </a>
              <a
                href="https://calendly.com/fruitfulab/15min"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-sky-700 px-3 py-2 text-center font-medium text-white hover:bg-sky-800"
              >
                Book a Call
              </a>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
