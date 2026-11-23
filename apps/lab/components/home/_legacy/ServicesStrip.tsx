// LEGACY: old marketing home section, not used in the current tech/tools hub.
// no imports needed

function Card({ title, bullets }: { title: string; bullets: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
      <div className="mt-4">
        <a
          href="https://calendly.com/fruitfulab/15min"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-sky-700 hover:underline"
        >
          Learn more →
        </a>
      </div>
    </div>
  );
}

export default function ServicesStrip() {
  return (
    <section id="services" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Services designed for full-funnel growth
        </h2>
        <p className="mt-2 max-w-2xl text-slate-700">
          Organic + ads + analytics working together—so Pinterest becomes a
          dependable engine, not an experiment.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Pinterest Management"
            bullets={["Organic growth", "SEO + publishing", "Weekly cadence"]}
          />
          <Card
            title="Pinterest Ads & Funnels"
            bullets={[
              "CBO + creative testing",
              "Conversion tracking",
              "Offer + landing alignment",
            ]}
          />
          <Card
            title="Full-Funnel Growth Retainers"
            bullets={[
              "Organic + ads + analytics",
              "Landing page feedback",
              "Quarterly planning",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
