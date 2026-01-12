// frontend/lib/experiments/track.ts
// Centralized helpers for experiment exposure/conversion tracking.
// These helpers are server/client safe and post to a local API endpoint.

export type ExperimentEventPayload = {
  type: "exposure" | "conversion";
  experimentKey?: string;
  variant?: string;
  eventName?: string;
  attributes?: Record<string, unknown>;
  source?: string;
};

const EVENTS_ENDPOINT = "/api/experiment-events";

export async function logExperimentEvent(
  payload: ExperimentEventPayload,
): Promise<void> {
  try {
    await fetch(EVENTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Note: works in both server and client runtime in Next.js
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[experiment-events] failed to send", err);
    }
  }
}

/** Convenience helper for business-facing conversions, e.g. "pp_complete" */
export async function trackConversion(
  eventName: string,
  props?: Record<string, unknown>,
): Promise<void> {
  return logExperimentEvent({
    type: "conversion",
    eventName,
    attributes: props,
    source: "manual",
  });
}
