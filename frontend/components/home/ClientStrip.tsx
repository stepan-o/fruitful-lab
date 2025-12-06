export default function ClientStrip() {
  const badges = [
    "Organic Food",
    "Baby Gear",
    "DIY Retailer",
    "Language Blog",
    "Clean Beauty",
  ];
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="mb-4 text-sm font-medium tracking-tight text-slate-700">
          Trusted by data-obsessed founders and specialty brands.
        </h2>
        <div className="flex gap-3 overflow-x-auto py-1 [scrollbar-width:none] [*::-webkit-scrollbar]:hidden">
          {badges.map((label) => (
            <span
              key={label}
              className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
