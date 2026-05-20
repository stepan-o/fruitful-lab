// LEGACY: old marketing home section, not used in the current tech/tools hub.
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:py-20">
        {/* Left: text */}
        <div className="flex flex-col justify-center gap-5">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-600">
            Pinterest & Funnel Studio
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Pinterest that feeds your funnel, not your vanity metrics.
          </h1>
          <p className="max-w-xl text-slate-700">
            Full-funnel Pinterest across organic and ads, built for baby, family,
            lifestyle, and CPG brands. We handle the complexity—so you get
            consistent traffic and qualified leads.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="https://calendly.com/fruitfulab/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-sky-700 px-4 py-2 text-sm font-medium text-white shadow hover:bg-sky-800"
            >
              Book a Call
            </a>
            <Link
              href="#services"
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
            >
              See how we grow brands on Pinterest
            </Link>
          </div>
        </div>

        {/* Right: static mini dashboard card */}
        <div className="flex items-center">
          <div className="w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-900">Pinterest Overview</p>
              <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-700">
                Last 30 days
              </span>
            </div>
            <dl className="grid grid-cols-3 gap-4">
              <div>
                <dt className="text-xs text-slate-500">Impressions</dt>
                <dd className="text-lg font-semibold text-slate-900">128k</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Saves</dt>
                <dd className="text-lg font-semibold text-slate-900">2,345</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Outbound</dt>
                <dd className="text-lg font-semibold text-slate-900">4,210</dd>
              </div>
            </dl>
            <div className="mt-5 h-16 w-full rounded-md bg-gradient-to-r from-sky-100 via-sky-200 to-sky-100">
              {/* decorative sparkline mimic */}
              <div className="h-full w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,rgba(2,132,199,0.15)_8px,rgba(2,132,199,0.15)_9px)]"></div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Sample data for illustration only.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
