// frontend/app/api/debug/growthbook/route.ts
// Dev-only diagnostics for GrowthBook SDK health. No secrets are returned.
import { NextResponse } from "next/server";
import { growthbookDebugState } from "@/lib/growthbook/flags";

type GrowthbookPingResult = {
  ok: boolean;
  status: number | null;
  error: string | null;
};

export async function GET() {
  const clientKey = process.env.GROWTHBOOK_CLIENT_KEY;
  const apiHost =
    process.env.GROWTHBOOK_API_HOST ?? "https://cdn.growthbook.io";

  let ping: GrowthbookPingResult;

  if (!clientKey || !apiHost) {
    ping = { ok: false, status: null, error: "missing-env" };
  } else {
    const url = `${apiHost.replace(/\/$/, "")}/api/features/${clientKey}`;
    try {
      const res = await fetch(url, { method: "GET" });
      ping = {
        ok: res.ok,
        status: res.status,
        error: res.ok ? null : `HTTP ${res.status}`,
      };
    } catch (err) {
      ping = {
        ok: false,
        status: null,
        error: err instanceof Error ? err.message : "unknown-error",
      };
    }
  }

  return NextResponse.json({
    envConfigured: growthbookDebugState.envConfigured,
    initialized: growthbookDebugState.initialized,
    lastError: growthbookDebugState.lastError
      ? {
          name: growthbookDebugState.lastError.name,
          message: growthbookDebugState.lastError.message,
        }
      : null,
    nodeEnv: process.env.NODE_ENV,
    ping,
  });
}
