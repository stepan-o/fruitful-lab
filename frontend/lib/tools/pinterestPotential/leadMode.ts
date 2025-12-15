// frontend/lib/tools/pinterestPotential/leadMode.ts
// Sprint 4 — Lead mode resolution utilities

export type LeadMode = "gate_before_results" | "optional_after_results" | "prefilled_or_skip";

export function normalizeLeadMode(value?: string): LeadMode | undefined {
  if (!value) return undefined;
  const v = value.toLowerCase();
  if (v === "gate_before_results" || v === "gate" || v === "before") return "gate_before_results";
  if (v === "optional_after_results" || v === "optional" || v === "after") return "optional_after_results";
  if (v === "prefilled_or_skip" || v === "prefilled" || v === "skip") return "prefilled_or_skip";
  return undefined;
}

export function resolveLeadMode({
  requested,
  cookieValue,
  isKnownLead,
}: {
  requested?: string;
  cookieValue?: string;
  isKnownLead?: boolean;
}): LeadMode {
  const req = normalizeLeadMode(requested);
  if (req) return req;

  const cookie = normalizeLeadMode(cookieValue);
  if (cookie) return cookie;

  // If we already know the lead (logged-in user or valid token), prefer skip-mode
  if (isKnownLead) return "prefilled_or_skip";

  // Default — gated before results like Outgrow
  return "gate_before_results";
}
