import { readBoundedJson, resolveRun } from "@/lib/loopforge/protocol";
import {
  authorizeNarration,
  evidenceFor,
  generateNarrative,
  narrationAvailable,
} from "@/lib/loopforge/narrative-server";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function GET() {
  return Response.json(
    { available: narrationAvailable(), provider: "OpenAI" },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: Request) {
  if (!narrationAvailable())
    return Response.json(
      {
        error: "not_configured",
        message:
          "Live narration is not configured. The simulation is fully playable.",
      },
      { status: 503 },
    );
  if (!authorizeNarration(request.headers.get("authorization")))
    return Response.json(
      {
        error: "access_required",
        message: "Enter the private demo access code to request narration.",
      },
      { status: 401 },
    );
  try {
    const body = await readBoundedJson(request);
    const run = resolveRun(body);
    const sample = (body as { sample?: number }).sample ?? 0;
    const evidence = evidenceFor(run.request, run.state);
    const artifact = await generateNarrative(evidence, sample);
    return Response.json(artifact, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "unavailable";
    const known = [
      "budget_exhausted",
      "already_requested",
      "invalid_run",
      "no_event",
    ].includes(code)
      ? code
      : "narration_unavailable";
    return Response.json(
      {
        error: known,
        message:
          known === "budget_exhausted"
            ? "The demo’s narration budget has been used. The factory can continue."
            : known === "already_requested"
              ? "This beat was already requested. No second paid call was made."
              : "Narration could not be delivered. The committed shift is unchanged.",
      },
      { status: known === "budget_exhausted" ? 429 : 503 },
    );
  }
}
