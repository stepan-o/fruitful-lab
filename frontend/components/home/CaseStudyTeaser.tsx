export default function CaseStudyTeaser() {
  return (
    <section id="case-studies" className="border-b border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            From “Pinterest is dead” to a traffic engine.
          </h2>
          <p className="mt-3 max-w-prose text-slate-700">
            A specialty brand came in skeptical. Six months later Pinterest was
            their dependable source of qualified traffic and low-cost opt-ins.
          </p>
          <p className="mt-4 text-xs text-slate-500">
            Case study details available on request.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Outbound clicks</span>
              <span className="font-semibold text-slate-900">+320% in 6 months</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Opt-in cost vs Meta</span>
              <span className="font-semibold text-slate-900">3× cheaper</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-600">Traffic pattern</span>
              <span className="font-semibold text-slate-900">Evergreen from search</span>
            </li>
          </ul>
          <div className="mt-5 h-24 w-full rounded-md bg-gradient-to-br from-emerald-100 to-emerald-200"></div>
        </div>
      </div>
    </section>
  );
}
