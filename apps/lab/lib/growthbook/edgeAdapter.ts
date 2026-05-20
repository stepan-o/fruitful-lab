// frontend/lib/growthbook/edgeAdapter.ts
// Edge-safe GrowthBook adapter wrapper.
//
// IMPORTANT:
// - This file MUST be safe to import from Next.js Edge Middleware.
// - Do NOT add `after()` usage here.
// - Do NOT set tracking callbacks here.
// - Do NOT auto-initialize here.
// - Keep it as a thin re-export only.

import { growthbookAdapter } from "@flags-sdk/growthbook";

export { growthbookAdapter };
