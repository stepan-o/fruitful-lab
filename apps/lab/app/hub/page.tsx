export default function KnowledgeHubPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
        Fruitful Lab Knowledge Hub
      </h1>
      <p className="text-slate-600">
        This will become our library of deep-dive guides, playbooks, and
        trainings on Pinterest and full-funnel growth. For now, it’s a
        preview of what’s coming.
      </p>
      <p className="text-sm text-slate-500">
        If you’d like early access or have a specific question,{" "}
        <a
          href="https://calendly.com/fruitfulab/15min"
          className="font-medium text-sky-700 underline"
        >
          book a quick call
        </a>{" "}
        and we’ll workshop it live with you.
      </p>
    </main>
  );
}
