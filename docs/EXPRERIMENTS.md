# Experiments & GrowthBook Setup

This app uses **GrowthBook** + **Next.js middleware** for feature experiments.

## Core ideas

- **GrowthBook decides the variant.**
- **Middleware assigns and persists it** via cookies before the page renders.
- **Pages just read the cookie** (or a `?variant=` override) and render the right version.
- **Events are tracked centrally** so GrowthBook can analyze exposure + conversion.

---

## Current experiments

### `pinterest_potential_variant`

- **Feature key in GrowthBook:** `pinterest_potential_variant`
- **Experiment key in GrowthBook:** `pinterest_potential_variant`
- **Variants:** `"v1"`, `"v2"`
- **Cookie:** `pp_variant`
- **Routes covered:** `/tools/pinterest-potential`

---

## How assignment works (request flow)

1. **Request hits middleware**

   File: `frontend/middleware.ts`  
   Helper: `lib/growthbook/middleware.ts`

    - If path matches a configured experiment (e.g. `/tools/pinterest-potential`):
        - If `pp_variant` cookie is **missing/invalid**:
            - Calls `runServerExperiment({ key: "pinterest_potential_variant", attributes })`.
            - Writes `pp_variant=<variant>` cookie.
        - If cookie is **present and valid**:
            - Keeps the same value; only refreshes expiry.
    - If path does **not** match any experiment → middleware is auth-only.

2. **Server evaluates experiment**

   File: `lib/growthbook/experiments.ts`

    - Asks GrowthBook for the variant (using the shared `identify()` attributes).
    - If GrowthBook is down or no value is returned, chooses a variant locally using weights.
    - If the GrowthBook *feature flag* for this experiment is disabled, returns the default variant.

3. **Page render**

   File: `app/tools/pinterest-potential/page.tsx`

   Variant resolution order:

    1. `?variant=v2` (explicit override for debugging)
    2. `pp_variant` cookie (set by middleware)
    3. `DEFAULT_VARIANT` from `lib/tools/pinterestPotentialConfig.ts`

   The page does **not** talk to GrowthBook directly.

---

## Tracking & analytics

### Exposure tracking

- GrowthBook’s SDK `setTrackingCallback` is configured in:
    - `lib/growthbook/flags.ts`
- When GrowthBook evaluates an experiment, the callback calls our internal helper:
    - `logExperimentEvent("exposure", { experimentKey, variant, ... })`
- That helper POSTs to:
    - `POST /api/experiment-events`
- The endpoint is intentionally simple:
    - In dev: logs payloads so you can see them.
    - In prod: can be wired to a real sink (GrowthBook events API, data warehouse, etc).

### Conversion tracking

- Helper: `trackConversion(eventName, props?)` (in `lib/growthbook/events.ts` or similar).
- Call it from:
    - Server routes that handle form submissions.
    - Client components (via `fetch("/api/experiment-events", { method: "POST", body: ... })`).
- Common examples for the calculator:
    - `pinterest_potential_completed`
    - `pinterest_potential_book_call_click`

Make sure the **event names** used in code are also configured in GrowthBook under the experiment’s metrics.

---

## How to add a new experiment

1. **Create a feature in GrowthBook**
    - Example key: `new-feature-x`
    - Value type: `string` or `boolean` depending on your needs.

2. **Create an experiment for that feature**
    - Experiment key: e.g. `new_feature_x_variant`
    - Assignment attribute: `id`
    - Variants: `"control"`, `"variant_a"` (or whatever you want).
    - Map each variation to the feature value you want GrowthBook to send.

3. **Add it to the local experiment config**

   File: `lib/experiments/config.ts`

    - Add a new `ExperimentDefinition` with:
        - `key`
        - `gbKey`
        - `variants`
        - Optional `weights`
    - Add it to `EXPERIMENTS_BY_KEY` / `ALL_EXPERIMENT_KEYS`.

4. **Wire the middleware**

    - In `lib/growthbook/middleware.ts`, add a config entry:
        - Path matcher(s) for the experiment.
        - Cookie name for the variant.
    - Make sure `applyExperimentCookies` includes your experiment in its loop.

5. **Update the page or feature code**

    - The page should:
        - Respect `?variant=` override.
        - Read the variant cookie.
        - Render the correct component/branch per variant.

6. **Add metrics in GrowthBook**

    - Decide on exposure / conversion events.
    - Configure them in the experiment.
    - Use `trackConversion()` in your code where conversions happen.

7. **Run tests**

    - `npm test`
    - Add or update Jest tests so the new experiment is covered.

---

## Debugging

- Check GrowthBook SDK health:

```bash
curl http://localhost:3000/api/debug/growthbook
```

You should see:
```json
{
  "envConfigured": true,
  "initialized": true,
  "ping": { "ok": true, "status": 200, "error": null },
  ...
}
```

To force a specific variant locally, append `?variant=<key>` to the URL, e.g.:

```url
http://localhost:3000/tools/pinterest-potential?variant=v2
```
* If experiments look “stuck”:
  * Clear cookies for the site (especially pp_variant and any anonymous ID cookie).
  * Confirm the experiment is enabled in GrowthBook and the environment is dev.

---

## Required env vars

Set in `.env.local`:
* `GROWTHBOOK_CLIENT_KEY`
* `GROWTHBOOK_API_HOST` (usually https://cdn.growthbook.io)
* `GROWTHBOOK_APP_ORIGIN` (GrowthBook app URL; used only for debug / linking)

Edge config vars are **optional** and not used yet.