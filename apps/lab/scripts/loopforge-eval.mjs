import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
const corpus = JSON.parse(
  await fs.readFile(
    new URL("../lib/loopforge/eval-corpus.json", import.meta.url),
    "utf8",
  ),
);
const base = process.env.LOOPFORGE_EVAL_BASE_URL;
const code = process.env.LOOPFORGE_DEMO_ACCESS_CODE;
const samples = Number(process.env.LOOPFORGE_EVAL_SAMPLES ?? 1);
const output = process.argv[2];
if (
  !base ||
  !code ||
  !output ||
  !Number.isInteger(samples) ||
  samples < 1 ||
  samples > 3
) {
  console.error(
    "Set LOOPFORGE_EVAL_BASE_URL and LOOPFORGE_DEMO_ACCESS_CODE, optionally LOOPFORGE_EVAL_SAMPLES=1..3. Supply an output .json path. This invokes the budget-gated narration endpoint and can incur approved charges.",
  );
  process.exit(1);
}
const target = new URL(base);
if (
  target.protocol !== "https:" &&
  !(
    target.protocol === "http:" &&
    ["localhost", "127.0.0.1"].includes(target.hostname)
  )
)
  throw new Error("Use HTTPS or a local test server");
const ids = ["limen", "stiletto", "cathexis", "witch", "thrum"],
  results = [];
cases: for (const fixture of corpus.cases)
  for (let sample = 0; sample < samples; sample++) {
    const assignments = ids.map(
      (_, i) => ids[(i + fixture.rotate) % ids.length],
    );
    const request = {
      version: corpus.engineVersion,
      seed: fixture.seed,
      commands: fixture.doctrines.map((doctrine) => ({
        type: "resolve",
        doctrine,
        assignments,
      })),
      sample,
    };
    const start = performance.now();
    let result;
    try {
      const response = await fetch(
        new URL("/api/loopforge/narrative", target),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${code}`,
          },
          body: JSON.stringify(request),
          signal: AbortSignal.timeout(35000),
        },
      );
      result = { accepted: response.ok, response: await response.json() };
    } catch (error) {
      result = { accepted: false, response: { error: error.name } };
    }
    results.push({
      caseId: fixture.id,
      sample,
      review: fixture.review,
      request,
      clientLatencyMs: Math.round(performance.now() - start),
      ...result,
      humanReview: {
        faithful: null,
        voiceDistinct: null,
        consequenceRecognized: null,
        preference: null,
        notes: "",
      },
    });
    console.log(
      `${fixture.id}/${sample}: ${result.accepted ? "accepted for review" : "rejected or unavailable"}`,
    );
    await fs.writeFile(
      output,
      JSON.stringify(
        {
          corpusVersion: corpus.version,
          generatedAt: new Date().toISOString(),
          results,
        },
        null,
        2,
      ) + "\n",
    );
    if (
      ["not_configured", "access_required", "budget_exhausted"].includes(
        result.response.error,
      )
    ) {
      console.error(
        "Stopped: configuration, access or budget requires attention.",
      );
      break cases;
    }
  }
console.log(
  `Saved ${results.length} records for blinded human review to ${fileURLToPath(new URL(output, `file://${process.cwd()}/`))}. Cached artifacts are not independent samples.`,
);
