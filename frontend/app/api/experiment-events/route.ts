// frontend/app/api/experiment-events/route.ts
// Dev-friendly experiment events ingestion (exposure + conversion).
// Safe diagnostics only; no secrets returned or logged. POST-only.

import { NextResponse } from "next/server";

type ExperimentEventPayload = {
  type: "exposure" | "conversion";
  experimentKey?: string;
  variant?: string;
  eventName?: string; // for conversions, e.g. "pp_complete"
  attributes?: Record<string, unknown>;
  source?: string; // e.g. "growthbook" | "manual"
};

export async function POST(request: Request) {
  let payload: ExperimentEventPayload | null = null;
  try {
    payload = (await request.json()) as ExperimentEventPayload;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!payload || (payload.type !== "exposure" && payload.type !== "conversion")) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log("[experiment-events]", payload);
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  // Method not allowed – POST only
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
