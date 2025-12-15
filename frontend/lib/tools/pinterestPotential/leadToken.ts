// frontend/lib/tools/pinterestPotential/leadToken.ts
// Minimal token resolver for known-lead mode. In production, replace with
// a secure verification (server fetch or signature validation).

import type { Lead } from "./pinterestPotentialSpec";

export async function resolveLeadFromToken(token?: string): Promise<Lead | undefined> {
  if (!token) return undefined;
  try {
    // Extremely minimal stub: if token === "demo", return a demo lead.
    if (token === "demo") {
      return { name: "Demo User", email: "demo@example.com" };
    }

    // Optionally support base64-encoded email tokens like btoa("email:name")
    if (/^[A-Za-z0-9+/=]+$/.test(token)) {
      const decoded = Buffer.from(token, "base64").toString("utf8");
      const [email, name] = decoded.split(":");
      if (email && /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email)) {
        return { email, name: name || "" } as Lead;
      }
    }
  } catch {
    // ignore
  }
  return undefined;
}
