# Fruitful Lab Tech Hub – v1.0 Implementation Snapshot

---

## 0. High-level shape

- **Frontend:** Next.js App Router (TypeScript), under `frontend/`.
- **Backend:** FastAPI (`main:app`) with Postgres + SQLAlchemy + JWT auth,
  under `backend/`.
- **Experiment engine:** GrowthBook SDK wired into frontend
  for feature flags, A/B assignment, and tracking.

**Primary purpose of this repo**

- Internal **Tech & Tools hub** behind Fruitful Pin:
    - Public hub at `/` (entry to tools, case studies, main site).
    - Auth-gated dashboards under `/dashboard` (admin-only).
    - Public tools under `/tools/*` (e.g. Pinterest Potential calculator).

- Shared design system + navigation across:
    - Header
    - Hub landing
    - Footer

---

## 1. Frontend structure

---

### 1.1 Layout & global styling

**Key files**

- `frontend/app/layout.tsx`
    - Sets brand fonts (`--font-heading`, `--font-body`).
    - Wraps every page in `<SiteHeader />` and `<SiteFooter />`.
    - Imports `growthbookAdapter` from `@/lib/growthbook/flags`
      so the SDK can lazily initialize on first render.

- `frontend/app/globals.css`
    - Color tokens:
        - `--brand-heading`, `--brand-raspberry`, `--brand-alabaster`,
          `--brand-bronze`, `--brand-rust`, plus `--background` / `--foreground`.
    - Utility font classes: `.font-heading`, `.font-body`.

**Animations**

- Kept:
    - `@keyframes hubPulse` – halo behind primary “Start” CTA.
    - `@keyframes start-here-pulse` – animated “Start here” chip.
- Removed:
    - Old lab drift / opacity debug keyframes; comment notes that
      all motion now lives in `LabBackdropClient.tsx`.

**Implications for future devs**

- New UI should reuse existing tokens – avoid random hex colors.
- New global animations should include a short comment:
    - What uses them.
    - Where they’re referenced.

---

### 1.2 Shared navigation model

**Config**

- File: `frontend/lib/nav.ts`

```ts
export type PublicNavLink = {
  href: string;
  label: string;
  external?: boolean;
};

export const PUBLIC_NAV_LINKS: PublicNavLink[] = [
  { href: "/tools", label: "Tools & Calculators" },
  { href: "/case-studies", label: "Case Studies" },
  {
    href: "https://fruitfulpin.com",
    label: "Main Agency Site",
    external: true,
  },
];
```

`PUBLIC_NAV_LINKS` includes:
* `/tools` – “Tools & Calculators”
* `/case-studies` – “Case Studies”
* External https://fruitfulpin.com – “Main Agency Site”

**Consumers**

- `frontend/components/layout/SiteHeader.tsx`
  - Header nav links.
- `frontend/components/ui/PublicHubLanding.tsx`
  - Public entry cards at bottom of hub page.
- `frontend/components/layout/SiteFooter.tsx`
  - Footer hub mini-nav.

Changing PUBLIC_NAV_LINKS updates header, footer, and hub cards
without touching individual components.

---

### 1.3 Header & auth-aware CTAs

**File:** `frontend/components/layout/SiteHeader.tsx`

- Async **server component** using `getCurrentUser()` from `@/lib/auth`.
- Computes `isLoggedIn = !!user`.

**Structure**

- Left: “Fruitful Lab” logo → `/`.
- Center: mapped `PUBLIC_NAV_LINKS`:
  - Internal routes via `<Link>`.
  - External site opens in new tab.
- Right (desktop):
  - Always: **Book a Call** (Calendly).
  - If logged out: **Login** → `/login?next=/dashboard`.
  - If logged in: `<LogoutButton />`.

**Mobile**

- `<details>/<summary>` menu with:
  - Same nav links + Book a Call.
  - Login vs Logout based on `isLoggedIn`.

**LogoutButton**

- File: `frontend/components/layout/LogoutButton.tsx`
- `"use client"` component:
  - `fetch("/api/auth/logout", { method: "POST" })`.
  - Then `router.push("/")` and `router.refresh()`.

**Implications**

- Any future auth-sensitive global link should use `getCurrentUser()` here.
- Logout behavior is centralized; don’t duplicate it elsewhere.

---

### 1.4 Hub landing & animated backdrop

**File:** `frontend/components/ui/PublicHubLanding.tsx`

**Hero**

- Height: `min-h-[calc(100vh-72px)]` (accounts for header).
- Background: `<LabAnimatedBackdrop />`.
- Foreground:
  - Pill: “Fruitful Lab · Tech & Tools”.
  - H1: “The engine room behind Fruitful Pin.”
  - Body text explaining purpose of the hub.
  - CTAs:
    - Primary: “Go to Fruitful Pin site” (external).
    - Secondary: “Browse public tools” → `/tools`.
  - “Start here” chip using hub pulse animations.

**Explainer strip**

- Section under hero with three pillars:
  - Internal dashboards
  - Smart tools & calculators
  - Deep-dive case studies

**Public entry cards**

- Uses `getNavLink(href)` from nav config to hydrate:
  - Tools & Calculators card.
  - Case Studies card.
  - Main Agency Site card.
- Card content:
  - Title from `label`.
  - Custom description.
  - CTA text (“Go →”, “Browse →”, “Visit →”).

**Backdrop implementation**

- `LabAnimatedBackdrop.tsx` – server wrapper.
- `LabBackdropClient.tsx` – `"use client"` component:
  - Manages circle state via `useRef`.
  - Uses `requestAnimationFrame` + clamped delta time.
  - Uses `ResizeObserver` to react to container size.
  - Spawns 4 colored circles (brand palette) clustered
    in the lower-right area; circles bounce off edges.

- Shell: `frontend/components/home/LabAnimatedBackdrop.tsx` (server).
- Client logic: `frontend/components/home/LabBackdropClient.tsx`.

**LabBackdropClient key points**

- `"use client"`; owns the physics loop.
- Uses:
  - `requestAnimationFrame` with delta-time.
  - `ResizeObserver` to track container size.
  - Delta clamp: `dt <= 0.05` to avoid jumps when tab is hidden.
- State:
  - Circles are stored in `useRef<Circle[]>`.
  - Dummy `setFrame` tick just triggers re-render.

**Circle behavior**

- 4 circles, with brand color tokens:
  - Alabaster, Raspberry, Bronze, Rust.
- Each circle:
  - `id`, `x`, `y`, `vx`, `vy`, `radius`, `color`, `opacity`.
- Initial spawn:
  - Clustered in **bottom-right** region via cluster center + jitter.
- Motion:
  - Basic drift plus wall bounces.
  - No circle–circle collisions yet.

**Implication**

- All backdrop experiments (colors, count, physics) should be done
  **only** in `LabBackdropClient.tsx`.

---

### 1.5 Footer & legacy UI

**File:** `frontend/components/layout/SiteFooter.tsx`

- Top row:
  - Tagline describing Fruitful Lab / Fruitful Pin.
  - Mini-nav mapping `PUBLIC_NAV_LINKS` (same behavior
    as header).
- Bottom row:
  - Legal links (`Privacy`, `Imprint`, `Contact` mailto).
  - `© {year} Fruitful Lab`.

**Legacy components**

- Folder: `frontend/components/home/_legacy`
  - Old marketing sections (`HeroSection`, `ServicesStrip`, etc.).
  - Not imported anywhere; safe to delete once confirmed.

**Frontend tests**

- `SiteHeader.test.tsx`:
  - Mocks logged-in vs logged-out.
  - Asserts nav items and CTAs (desktop + mobile).
- `publicHubLanding.test.tsx`:
  - Asserts hero heading, primary CTAs, and explainer strip.

---

### 1.6 Legacy components

**Folder:** `frontend/components/home/_legacy`

- Contains old marketing-site sections:
    - `HeroSection.tsx`
    - `ServicesStrip.tsx`
    - `ProcessStrip.tsx`
    - `CaseStudyTeaser.tsx`
    - `ClientStrip.tsx`
    - `FinalCTASection.tsx`
- No imports in active code; marked as legacy.

Implication: safe to delete later once you’re sure you won’t reuse them.

### 1.7 Frontend tests

**Key files**

- `frontend/components/layout/__tests__/SiteHeader.test.tsx`
    - Mocks auth states:
        - Asserts nav items from `PUBLIC_NAV_LINKS`.
        - Verifies desktop + mobile CTAs for:
            - Logged out (Login visible).
            - Logged in (LogoutButton visible).
    - Handles duplicate elements via `getAllByRole`.

- `__tests__/publicHubLanding.test.tsx`
    - Asserts:
        - Main heading renders.
        - Hero CTAs:
            - Fruitful Pin external link.
            - `/tools` button.
        - **No** login CTA in hero.
        - Explainer strip headings appear below hero.



## 2. Experiments & GrowthBook infrastructure

---

### 2.1 GrowthBook adapter & debug

**Env vars (frontend)**

- `GROWTHBOOK_CLIENT_KEY`
- `GROWTHBOOK_API_HOST` (e.g. `https://cdn.growthbook.io`)
- `GROWTHBOOK_APP_ORIGIN` (UI URL, used for docs/debug links).

**Adapter**

- File: `frontend/lib/growthbook/flags.ts`
  - Creates a singleton `growthbookAdapter`.
  - Registers a **tracking callback** used for exposure events.
  - Maintains a `growthbookDebugState` object:
    - `envConfigured`, `initialized`, `lastError`, `nodeEnv`.

**Debug endpoint**

- File: `frontend/app/api/debug/growthbook/route.ts`
  - Returns JSON:
    - `envConfigured`, `initialized`, `lastError`, `nodeEnv`.
    - `ping` result from calling
      `${GROWTHBOOK_API_HOST}/api/features/${CLIENT_KEY}`.
  - Used by local QA and `/EXPERIMENTS.md` checklist.

---

### 2.2 Canonical experiment config & server runner

**Experiment config**

- File: `frontend/lib/experiments/config.ts`
  - `ExperimentKey` union, currently includes:
    - `"pinterest_potential_variant"`.
  - `ExperimentDefinition`:
    - `key` (local key)
    - `gbKey` (GrowthBook key – matches feature/experiment)
    - `variants` (e.g. `["v1", "v2"]`)
    - Optional `weights` for local fallback.
    - Default variant constant.

- Exports:
  - `PINTEREST_POTENTIAL_EXPERIMENT`
  - `ALL_EXPERIMENT_KEYS`
  - `getExperimentDefinitionByKey(key)` helper.

**Server-side evaluation helper**

- File: `frontend/lib/growthbook/experiments.ts`
  - `runServerExperiment({ key, attributes })`:
    - Ensures GB adapter is initialized.
    - Checks an `enable_*` flag if defined.
    - Tries to evaluate via GrowthBook (source `"growthbook"`).
    - On error / no value:
      - Chooses variant via local weighted random
        (source `"fallback"`).
  - Returns `{ variant, source }`.

---

### 2.3 Identity & middleware-based assignment

**Identity helper**

- File: `frontend/lib/identify.ts`
  - Builds GrowthBook `Attributes` object:
    - `id`: user id (if logged in) or anonymous cookie id.
    - Basic context: URL, path, maybe device hints.
  - Used by `runServerExperiment` and middleware.

**Middleware**

- Files:
  - `frontend/lib/growthbook/middleware.ts`
    - `applyExperimentCookies(req, res)` helper.
  - `frontend/middleware.ts`
    - Next.js middleware entry.

**Behavior**

- For targeted paths (currently `/tools/pinterest-potential`):
  - If `pp_variant` cookie missing/invalid:
    - Calls `runServerExperiment` with experiment definition
      and middleware-friendly attributes.
    - Sets `pp_variant` cookie to chosen variant
      with reasonable expiry.
  - If cookie already present:
    - Keeps same value and refreshes expiry.
- Auth redirects for `/dashboard` remain unchanged;
  experiments do **not** interfere with login flow.

---
  
### 2.4 Pinterest Potential calculator behavior

**Route**

- File: `frontend/app/tools/pinterest-potential/page.tsx`

**Variant resolution**

- Precedence:
  1. `?variant=` query override (for manual QA).
  2. `pp_variant` cookie set by middleware.
  3. Default variant from experiment definition.

- The page **does not** call GrowthBook directly:
  - It simply trusts the cookie / override.
  - Keeps rendering logic simple and deterministic.

**Rendering**

- Uses variant key (`"v1"` or `"v2"`) to decide:
  - Layout variations.
  - Copy / CTA variants.
- Unit tests assert:
  - Correct precedence of query vs cookie vs default.
  - Correct conditional rendering based on variant key.

---

### 2.5 Tracking pipeline: exposure + conversion

**Central endpoint**

- File: `frontend/app/api/experiment-events/route.ts`
  - Receives `POST` with JSON:
    - `type`: `"exposure"` or `"conversion"`.
    - `experimentKey`, `variant`.
    - Optional `eventName`, `userId`, `attributes`.
  - In dev: primarily logs / validates payload.
  - In future: hook to analytics warehouse or queue.

**Tracking helpers**

- In GrowthBook adapter:
  - `setTrackingCallback` wired to call
    `logExperimentEvent("exposure", ...)`
    whenever GrowthBook evaluates an experiment.
- `trackConversion(eventName, props?)` helper:
  - Wraps a `POST` to `/api/experiment-events`
    with `type: "conversion"`.
  - Intended to be called from:
    - Server routes handling real submissions.
    - Client components (e.g. calculator CTA) via `fetch`.

GrowthBook experiment is configured to use these events
for exposure + conversion analysis.

---

### 2.6 Experiments documentation & QA

**Docs**

- `EXPERIMENTS.md` (repo root or `/docs`):
  - Explains:
    - How to add a new experiment:
      - Create in GrowthBook.
      - Add `ExperimentDefinition`.
      - Wire middleware matcher + cookie name.
      - Optionally add UI variant handling.
    - How assignment works (middleware + cookies +
      `runServerExperiment`).
    - How to debug using `/api/debug/growthbook`.

**Manual QA checklist**

- Separate section (or file) with a step-by-step flow:
  - Verify `debug/growthbook` shows `envConfigured` + `initialized`.
  - First-time user gets a single `pp_variant` that sticks.
  - `?variant=` overrides render only (not cookie).
  - Toggling feature off forces default variant.
  - `POST /api/experiment-events` fires for exposure
    and simulated conversions.
  - GrowthBook dashboard shows live traffic.

This gives future-us a repeatable “open checklist → verify”
process before turning on any new experiment.

---

## 3. Backend snapshot (unchanged core)

**Stack**

- Declared in `backend/pyproject.toml`:
  - `fastapi`, `uvicorn[standard]`, `sqlalchemy`, `psycopg[binary]`.
  - `python-jose[cryptography]` for JWT.
  - `passlib` for hashing.
  - `python-multipart` for uploads / forms.

**Makefile**

- `backend/Makefile`:

```make
.PHONY: test run

test:
	uv run pytest -q

run: test
	uv run uvicorn main:app --host 0.0.0.0 --port $${PORT:-8000}
```
**Auth flow (as used by frontend)**

- `GET /auth/me`:
  - Wrapped by `getCurrentUser()` in `frontend/lib/auth.ts`.
  - Used by header and root routing.

- `POST /api/auth/logout`:
  - Called by `LogoutButton`.

**Routing contract**

- `/`:
  - If admin → redirect `/dashboard`.
  - If logged-in non-admin → redirect `/tools`.
  - If logged out → show public landing.

- `/dashboard`:
  - Server-guarded with `getCurrentUser()` and role check.
  - Unauthed → `/login?next=/dashboard`.
  - Non-admin → `/tools`.

**Implications**

- New auth-gated areas:
  - Use `getCurrentUser()` in the server component.
  - Enforce roles there, not in random client components.

---

## 3. Gap check & recommendations

- ✅ Shared nav config drives header, hub cards, and footer.
- ✅ Backdrop physics isolated in `LabBackdropClient.tsx`.
- ✅ Header / auth CTAs tested for both auth states.
- ✅ GrowthBook SDK wired with:
  - Env + debug endpoint.
  - Canonical experiment config.
  - Server-side evaluation helper.
  - Middleware-based assignment + sticky cookies.
  - Central tracking endpoint + helpers.
- ✅ Pinterest Potential calculator is “experiment-ready”
  without coupling UI to GrowthBook details.

**For future architects**

- To add a new tool or experiment:
  - Add route under `/tools/*`.
  - Define `ExperimentDefinition`.
  - Extend middleware matcher + cookie naming.
  - Use the same patterns as `pinterest_potential_variant`.

- Single sources of truth:
  - Navigation → `frontend/lib/nav.ts`.
  - Layout frame → `SiteHeader`, `SiteFooter`,
    `PublicHubLanding`.
  - Experiments → `lib/experiments/config.ts` +
    `lib/growthbook/*`.
  - Motion → `LabBackdropClient.tsx` + two keyframes in `globals.css`.

- Auth flow:
  - Backed by FastAPI JWT endpoints.
  - Surfaced via `getCurrentUser()` and `LogoutButton` only.

This snapshot should be enough context to safely evolve both
new tools and new experiments without reverse-engineering
the whole stack every time.