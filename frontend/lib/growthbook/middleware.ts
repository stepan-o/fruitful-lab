// frontend/lib/growthbook/middleware.ts
import type { NextRequest, NextResponse } from "next/server";

/**
 * Placeholder for future GrowthBook experiment logic in middleware.
 *
 * Current behavior: no-op – returns the response unchanged.
 * Future behavior: read/write experiment cookies (e.g., pp_variant),
 * possibly call GrowthBook Edge or our own assignment logic.
 */
export function applyExperimentCookies(
  _req: NextRequest,
  res: NextResponse,
): NextResponse {
  // TODO (future-us):
  // - If we move Pinterest Potential A/B assignment into middleware,
  //   we’ll set a stable cookie here (e.g. `pp_variant`).
  // - This keeps experiment concerns isolated from auth redirect logic.
  return res;
}
