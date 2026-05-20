// LEGACY: old marketing home section, not used in the current tech/tools hub.
export default function FinalCTASection() {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          You bring the product. We bring the Pinterest engine.
        </h2>
        <p className="mx-auto mt-3 max-w-prose text-slate-700">
          Clean, measurable growth—organic and paid—without adding chaos to your
          week.
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="https://calendly.com/fruitfulab/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-sky-700 px-4 py-2 text-sm font-medium text-white shadow hover:bg-sky-800"
          >
            Book a Call
          </a>
          <a href="/hub" className="text-sm font-medium text-sky-700 hover:underline">
            Not ready yet? Explore the Knowledge Hub →
          </a>
        </div>
      </div>
    </section>
  );
}
