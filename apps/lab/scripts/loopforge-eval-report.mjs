import fs from "node:fs/promises";
const paths = process.argv.slice(2);
if (!paths.length) throw new Error("Supply one or more evaluation JSON files");
for (const path of paths) {
  const report = JSON.parse(await fs.readFile(path, "utf8"));
  const rows = report.results;
  const passed = rows.filter((r) => r.accepted),
    fresh = passed.filter((r) => !r.response.cached);
  const times = fresh
    .map((r) => r.response.provenance.latencyMs)
    .sort((a, b) => a - b);
  const percentile = (p) =>
    times.length ? times[Math.max(0, Math.ceil(times.length * p) - 1)] : null;
  const n = rows.length,
    p = n ? passed.length / n : 0,
    z = 1.96,
    den = 1 + (z * z) / Math.max(n, 1),
    center = (p + (z * z) / (2 * Math.max(n, 1))) / den,
    margin =
      (z *
        Math.sqrt(
          (p * (1 - p)) / Math.max(n, 1) + (z * z) / (4 * Math.max(n, 1) ** 2),
        )) /
      den;
  const actualMicro = fresh.reduce((sum, r) => {
    const u = r.response.provenance.usage;
    return sum + (u.input - u.cached) * 0.4 + u.cached * 0.1 + u.output * 1.6;
  }, 0);
  console.log(
    JSON.stringify(
      {
        file: path,
        corpusVersion: report.corpusVersion,
        attempted: n,
        accepted: passed.length,
        acceptedRate: p,
        wilson95: n ? [center - margin, center + margin] : null,
        freshArtifacts: fresh.length,
        cachedArtifacts: passed.length - fresh.length,
        providerP50Ms: percentile(0.5),
        providerP95Ms: percentile(0.95),
        estimatedAcceptedArtifactCostUSD: actualMicro / 1e6,
        faithfulnessReviewed: rows.filter(
          (r) =>
            r.humanReview?.faithful !== null &&
            r.humanReview?.faithful !== undefined,
        ).length,
        note: "Small descriptive sample, not a model ranking. Failed-call costs are not known here; durable conservative reservations include failures. Rates apply only to the pinned GPT-4.1 mini adapter. Human judgments must be completed before promotion.",
      },
      null,
      2,
    ),
  );
}
