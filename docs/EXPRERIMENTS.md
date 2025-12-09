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

---

## Manual QA Checklist—Pinterest Potential (Example)

This is a step-by-step checklist to verify the Pinterest Potential experiment end-to-end.

---

### 0. Before you start

- **Env:** `npm run dev` running at `http://localhost:3000`.
- **GrowthBook (dev env):**
    - Experiment `pinterest_potential_variant` **running**.
    - Feature / toggle for `pinterest_potential_variant` **enabled for dev**.
- **Handy URLs:**
    - Calculator: `http://localhost:3000/tools/pinterest-potential`
    - Debug: `http://localhost:3000/api/debug/growthbook`
- Use an **Incognito / private window** so you can clear cookies
  without affecting anything else.

---

### 1. Infra sanity check

1. Open `http://localhost:3000/api/debug/growthbook`.
2. Expected JSON includes:
    - `"envConfigured": true`
    - `"initialized": true`
    - `"ping": { "ok": true, "status": 200, ... }`
3. In GrowthBook’s SDK wizard, status should be **Connected**.
4. If any of the above fails:
    - **Stop here** and fix env or adapter before testing variants.

---

### 2. First-time user: assignment + cookie + stickiness

#### 2.1 Fresh anonymous user

1. In DevTools → **Application → Storage → Cookies**,
   clear all cookies for `localhost:3000`.
2. Visit `http://localhost:3000/tools/pinterest-potential`.
3. In DevTools → **Network**, confirm the page request went through.
4. In **Cookies** panel, confirm:
    - `pp_variant` cookie exists.
    - Value is `"v1"` or `"v2"`.
5. Check the UI:
    - Layout / copy / CTA matches the expected variant
      for that cookie value.

#### 2.2 Stickiness on reload

1. Hard-refresh the page 2–3 times.
2. Expected:
    - `pp_variant` value **does not change**.
    - UI stays consistent with that variant.
3. If the cookie flips between `"v1"` and `"v2"`,
   middleware is not respecting stickiness.

---

### 3. Variant override behavior (`?variant=`)

Goal: query param overrides **rendering only**, not the assignment cookie.

#### 3.1 Override to `v2`

1. With an existing cookie (e.g. `pp_variant=v1`), visit  
   `http://localhost:3000/tools/pinterest-potential?variant=v2`.
2. Expected:
    - UI reflects **V2**.
    - `pp_variant` cookie remains `v1`.

#### 3.2 Override to `v1`

1. Visit  
   `http://localhost:3000/tools/pinterest-potential?variant=v1`.
2. Expected:
    - UI reflects **V1**.
    - `pp_variant` cookie still unchanged.

**Precedence confirmed:** `?variant=` → cookie → default.  
Overrides do not permanently change bucket assignment.

---

### 4. Flag “off” / emergency stop scenario

Goal: turning the experiment **off** forces the **default variant**.

1. In GrowthBook **dev** env, either:
    - Pause `pinterest_potential_variant`, **or**
    - Turn off the enable flag for the calculator.
2. Clear cookies for `localhost:3000`.
3. Reload `http://localhost:3000/api/debug/growthbook`
   to confirm SDK is still connected.
4. Visit `http://localhost:3000/tools/pinterest-potential`.
5. Expected:
    - `pp_variant` is set to the **DEFAULT_VARIANT** (likely `"v1"`).
    - UI always shows that variant, even after multiple refreshes.
6. Turn the flag / experiment back **on**, clear cookies again,
   and repeat the fresh-user flow to confirm randomization returns.

---

### 5. Exposure event pipeline

Goal: each evaluation sends an **exposure** to `/api/experiment-events`.

1. In DevTools → **Network**, filter by `experiment-events`.
2. Clear cookies and reload  
   `http://localhost:3000/tools/pinterest-potential`.
3. Expected on first load:
    - `POST /api/experiment-events` appears.
    - Request JSON includes:
        - `type: "exposure"`
        - `experimentKey: "pinterest_potential_variant"`
        - `variant: "v1"` or `"v2"` (matches `pp_variant`)
        - Optional user/anonymous ID and attributes.
4. Hard-refresh a few times:
    - Either no more exposures (deduped),
      or more with the **same** variant.
5. After a few minutes, check GrowthBook → experiment →
   **Live data / diagnostics**:
    - Exposure counts should start to move.
6. If there are **no** `experiment-events` calls,
   tracking callback wiring needs fixing.

---

### 6. Conversion event smoke test

Even without a real submit flow,
we can simulate a conversion via the console.

---

#### 6.1 Get current variant

On the calculator page, DevTools → **Console**:

```ts
document.cookie
  .split("; ")
  .find((c) => c.startsWith("pp_variant="))
  ?.split("=")[1];
```

Copy the value ("v1" or "v2").

---

#### 6.2 Fire fake conversion
Run:
```ts
const variant =
  document.cookie
    .split("; ")
    .find((c) => c.startsWith("pp_variant="))
    ?.split("=")[1] || "v1";

fetch("/api/experiment-events", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "conversion",
    experimentKey: "pinterest_potential_variant",
    variant,
    eventName: "pinterest_potential_completed",
  }),
}).then((r) => r.json()).then(console.log);
```

Expected: Network shows `POST /api/experiment-events`  
and response `{ ok: true }`.  
Later, map `pinterest_potential_completed`  
as a conversion metric in GrowthBook.

---

### 7. Multi-device sanity (optional)

Goal: verify cookies / anonymous IDs behave per device.

1. Repeat the **First-time user** flow on:
   - Another browser (Safari / Firefox).
   - A mobile device hitting your dev machine
     (e.g. `http://10.0.0.220:3000`).
2. Expected on each device:
   - New `pp_variant` cookie on first load.
   - Stickiness within that device.
   - Exposure events visible from multiple IDs.

---

### 8. “Everything is fine” recap

You’re good if all of these are true:

- ✅ `/api/debug/growthbook` → `envConfigured: true`,
  `initialized: true`, `ping.ok: true`.
- ✅ New user gets exactly one `pp_variant` and it **sticks**.
- ✅ `?variant=` overrides **rendering only**, not assignment.
- ✅ Turning feature/experiment **off** forces the default variant.
- ✅ `POST /api/experiment-events` fires for exposures
  (and conversions when triggered).
- ✅ GrowthBook experiment dashboard shows traffic + conversions.

At this point you have a **production-grade experiment engine**
for the calculator, reusable for any future “which layout/offer
works best?” idea without rebuilding the plumbing.