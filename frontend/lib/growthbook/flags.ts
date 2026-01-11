// frontend/lib/growthbook/flags.ts
// Single source of truth for server-side GrowthBook usage.
// NOTE: Do not import `@flags-sdk/growthbook` directly in other modules.
// Import and use this adapter instead so tracking and configuration remain centralized.
// For now we only log to console via a non-blocking callback; real analytics wiring is a TODO.

import { growthbookAdapter } from "@flags-sdk/growthbook";
import { after } from "next/server";
import { logExperimentEvent } from "@/lib/experiments/track";

type GrowthbookExperimentLike = {
    key?: unknown;
};

type GrowthbookResultLike = {
    value?: unknown; // IMPORTANT: prefer this for canonical variant values ("welcome" | "no_welcome")
    key?: unknown;
    variationId?: unknown; // often "0"/"1" etc — keep as last resort fallback only
    attributes?: unknown;
};

function toStringSafe(v: unknown): string {
    return typeof v === "string" ? v : v == null ? "" : String(v);
}

function toAttributesSafe(v: unknown): Record<string, unknown> | undefined {
    if (v && typeof v === "object" && !Array.isArray(v)) {
        return v as Record<string, unknown>;
    }
    return undefined;
}

// Tracking callback → send exposure events through central pipe
growthbookAdapter.setTrackingCallback(
    (experiment: GrowthbookExperimentLike, result: GrowthbookResultLike) => {
        after(async () => {
            try {
                const expKey = toStringSafe(experiment?.key);

                // Canonical variant value ordering:
                // 1) result.value (should be "welcome" | "no_welcome")
                // 2) result.key
                // 3) result.variationId (often numeric-ish; last resort only)
                const variant = toStringSafe(
                    result?.value ?? result?.key ?? result?.variationId ?? "",
                );

                await logExperimentEvent({
                    type: "exposure",
                    experimentKey: expKey,
                    variant,
                    attributes: toAttributesSafe(result?.attributes),
                    source: "growthbook",
                });

                if (process.env.NODE_ENV === "development") {
                    // eslint-disable-next-line no-console
                    console.log("[growthbook exposure]", expKey, { variant });
                }
            } catch (err) {
                if (process.env.NODE_ENV === "development") {
                    // eslint-disable-next-line no-console
                    console.error("[growthbook exposure] failed to log", err);
                }
            }
        });
    },
);

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
