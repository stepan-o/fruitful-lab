// frontend/lib/growthbook/flags.ts
// Single source of truth for server-side GrowthBook usage.
// NOTE: Do not import `@flags-sdk/growthbook` directly in other modules.
// Import and use this adapter instead so tracking and configuration remain centralized.
// For now we only log to console via a non-blocking callback; real analytics wiring is a TODO.

import { growthbookAdapter } from "@flags-sdk/growthbook";
import { after } from "next/server";

// Very light tracking callback stub (no real analytics yet)
growthbookAdapter.setTrackingCallback((experiment, result) => {
  // NOTE: This is a future-us hook for analytics.
  // In production we’ll send this to GA/Amplitude or our backend.
  after(async () => {
    // Fire-and-forget logging so we don’t block rendering.
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("[GrowthBook] Viewed experiment (stub)", {
        experimentId: experiment.key,
        variationId: result.key,
      });
    }
  });
});

// --- Debug/health snapshot (dev-only utility) ---
// Inspect via the /api/debug/growthbook endpoint.
export const growthbookDebugState = {
  envConfigured: false,
  initialized: false,
  lastError: null as Error | null,
};

// Evaluate env configuration once on import
const clientKey = process.env.GROWTHBOOK_CLIENT_KEY;
const apiHost = process.env.GROWTHBOOK_API_HOST ?? "https://cdn.growthbook.io";
growthbookDebugState.envConfigured = !!clientKey;

// Initialize the adapter so the SDK connection sees traffic — but only when
// env vars are present. Errors are captured in debug state and logged in dev.
if (growthbookDebugState.envConfigured) {
  void growthbookAdapter
    .initialize()
    .then(() => {
      growthbookDebugState.initialized = true;
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.log("[GrowthBook] adapter initialized", { apiHost });
      }
    })
    .catch((err: unknown) => {
      const error = err instanceof Error ? err : new Error(String(err));
      growthbookDebugState.lastError = error;
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("[GrowthBook] adapter failed to initialize", error);
      }
    });
} else if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line no-console
  console.warn("[GrowthBook] env not configured; skipping initialize()", {
    clientKeyPresent: !!clientKey,
    apiHost,
  });
}

// Debug usage (dev only):
// - Start `npm run dev`
// - Hit /api/debug/growthbook in the browser
// - envConfigured=true and initialized=true means SDK has fetched flags at least once

export { growthbookAdapter };
