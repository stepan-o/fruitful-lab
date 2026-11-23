import { readBoundedJson, resolveRun } from "@/lib/loopforge/protocol";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const { state } = resolveRun(await readBoundedJson(request));
    return Response.json(
      { state },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      {
        error: "invalid_run",
        message: "The run request is invalid. No shift was applied.",
      },
      { status: 400 },
    );
  }
}
