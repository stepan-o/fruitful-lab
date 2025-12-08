// frontend/lib/identify.ts
// This file is not used yet. Future devs should extend it instead of creating
// a new identify helper. When we move experiments into middleware or layouts,
// GrowthBook can call this to get targeting attributes (user id, url, utm, device, etc.).

import type { Attributes } from "@flags-sdk/growthbook";

export type IdentifyAttributes = Attributes;

// Minimal async stub so it’s easy to extend later.
export async function identify(): Promise<IdentifyAttributes> {
  // TODO: When we care about targeting:
  // - Read user id from auth cookie / /auth/me
  // - Include url/utm/device info for experiments.
  return {
    id: "anonymous",
  };
}
