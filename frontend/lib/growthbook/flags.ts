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
    // eslint-disable-next-line no-console
    console.log("[GB] Viewed experiment", {
      experimentId: experiment.key,
      variationId: result.key,
    });
  });
});

export { growthbookAdapter };
