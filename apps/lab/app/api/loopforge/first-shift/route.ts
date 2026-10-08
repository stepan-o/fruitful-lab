import { readBoundedJson } from "@/lib/loopforge/protocol";
import { respond } from "@/lib/loopforge/first-shift/server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    return Response.json(respond(await readBoundedJson(request, 16000)), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const mismatch =
      error instanceof Error && error.message === "baseline_mismatch";
    return Response.json(
      {
        error: mismatch ? "baseline_mismatch" : "invalid_command",
        message: mismatch
          ? "The viewer needs a fresh baseline. Your recorded choices can be replayed."
          : "That action could not be applied. The last confirmed state is unchanged.",
      },
      {
        status: mismatch ? 409 : 400,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
