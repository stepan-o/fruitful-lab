// LEGACY: old marketing home section, not used in the current tech/tools hub.
export default function ProcessStrip() {
  const steps = [
    {
      title: "Discovery & Audit",
      body:
        "30–45 min call to understand goals, quick account + funnel review.",
    },
    {
      title: "Strategy & Setup",
      body:
        "Boards, keywords, tracking, and funnels prioritized for your offers.",
    },
    {
      title: "Launch & Learn",
      body: "Campaigns + creatives live; test and optimize what converts.",
    },
    {
      title: "Scale or Systemize",
      body: "Scale ad spend or lock in evergreen publishing ops.",
    },
  ];
  return (
    <section id="process" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          What working together looks like
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div
              key={s.title}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-slate-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-slate-700">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
