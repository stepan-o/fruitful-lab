# Fruitful Lab Tech Hub – v1 Implementation Snapshot

---

## 0. High-level shape

- **Frontend:** Next.js App Router (TypeScript), under `frontend/`.
- **Backend:** FastAPI (`main:app`) with Postgres + SQLAlchemy, JWT auth,
  run via `uv` / `uvicorn`, under `backend/`.

**Primary purpose of this repo**

- Internal **Tech & Tools hub** behind Fruitful Pin:
    - Public hub at `/` (entry to tools, case studies, pointer to main site).
    - Auth-gated dashboards under `/dashboard` (admin only).
- Shared design system + navigation across:
    - Header.
    - Hub landing.
    - Footer.

---

## 1. Frontend structure

---

### 1.1 Layout & global styling

**Key files**

- `frontend/app/layout.tsx` (standard Next app layout):
    - Sets fonts (`--font-heading`, `--font-body`).
    - Wraps pages with `<SiteHeader />` and `<SiteFooter />`.

- `frontend/app/globals.css`
    - Color tokens:
        - `--brand-heading`, `--brand-raspberry`,
          `--brand-alabaster`, `--brand-bronze`, `--brand-rust`,
          plus `--background` / `--foreground`.
    - Utility font classes:
        - `.font-heading`, `.font-body`.

**Animations still in use**

- `@keyframes hubPulse` – halo behind primary Start CTA.
- `@keyframes start-here-pulse` – “Start here” chip.

**Legacy debug animations removed**

- `labDriftX`, `labDriftY`, `labOpacityPulse` removed from CSS.
- Comment notes that motion is now handled entirely in
  `LabBackdropClient.tsx`.

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

**Consumers**

- `frontend/components/layout/SiteHeader.tsx`
  - Header nav links.
- `frontend/components/ui/PublicHubLanding.tsx`
  - Public entry cards at bottom of hub page.
- `frontend/components/layout/SiteFooter.tsx`
  - Footer hub mini-nav.

Changing any label / URL in `PUBLIC_NAV_LINKS` automatically updates:

- Header nav.
- Footer nav.
- Hub entry cards.

---

### 1.3 Header & auth-aware CTAs

**File:** `frontend/components/layout/SiteHeader.tsx`

- Async **server component** importing `getCurrentUser` from `@/lib/auth`.
- Computes `isLoggedIn = !!user`.

**Structure**

- **Left:** logo “Fruitful Lab” → `/`.
- **Center:** `<NavLinks />` mapping `PUBLIC_NAV_LINKS`:
  - Internal links → `<Link>`.
  - External main site → `<a target="_blank" rel="noopener noreferrer">`.

- **Right CTAs (desktop):**
  - Always:
    - **Book a Call** → Calendly external button.
  - Auth-aware:
    - Logged out → `Login` (`/login?next=/dashboard`).
    - Logged in → `<LogoutButton />`.

**Mobile menu**

- Implemented via `<details>` / `<summary>`.
- Inside dropdown:
  - Same mapping over `PUBLIC_NAV_LINKS`.
  - Same **Book a Call** button.
  - Login vs Logout based on `isLoggedIn`:
    - Logged out → `Login` link.
    - Logged in → `<LogoutButton />` in a small block.

**Logout button**

- File: `frontend/components/layout/LogoutButton.tsx`
- `"use client"` component:
  - `fetch("/api/auth/logout", { method: "POST" })`.
  - Then `router.push("/")` and `router.refresh()`.

**Implications**

- Any future auth-sensitive global link should use `getCurrentUser()` here.
- Logout behavior is centralized; don’t duplicate it elsewhere.

---

### 1.4 Hub landing page & backdrop

**File:** `frontend/components/ui/PublicHubLanding.tsx`

**Hero section**

- Full-height band: `min-h-[calc(100vh-72px)]` (header = 72px).
- Background: `<LabAnimatedBackdrop />`.
- Foreground content:
  - Pill: `Fruitful Lab · Tech & Tools`.
  - H1: “The engine room behind Fruitful Pin.”
  - Body: explains this as internal tools/dashboards hub.
  - CTAs:
    - Primary: **Go to Fruitful Pin site** (external).
    - Secondary: **Browse public tools** (`/tools`).
  - “Start here” chip using `start-here-pulse` and `hubPulse`.

**Explainer strip**

- Separate section below hero:
  - “Internal dashboards”.
  - “Smart tools & calculators”.
  - “Deep-dive case studies”.

---

### 1.4 Hub landing page & backdrop (cont.)

**Public entry cards**

- Section further down the page.
- Uses shared config via helper `getNavLink(href)`:

  - Tools & Calculators:
    - `toolsLink = getNavLink("/tools")`.
  - Case Studies:
    - `caseStudiesLink = getNavLink("/case-studies")`.
  - Main Agency Site:
    - `mainSiteLink = getNavLink("https://fruitfulpin.com")`.

- Each card:
  - Title from `.label`.
  - Custom description text.
  - CTA text (`Go →`, `Browse →`, `Visit →`).

**Animated backdrop**

- Shell: `frontend/components/home/LabAnimatedBackdrop.tsx` (server).
- Client logic: `frontend/components/home/LabBackdropClient.tsx`.

---

### 1.4 Hub landing page & backdrop (cont. 2)

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

### 1.5 Footer alignment

**File:** `frontend/components/layout/SiteFooter.tsx`

- **Top row**
  - Tagline:
    - “Effective Pinterest Marketing and Funnel Studio For Content Creators & Specialty Brands.”
  - Mini-nav mapping `PUBLIC_NAV_LINKS`:
    - Internal: `<Link>`.
    - External main site: `<a target="_blank">`.

- **Bottom row**
  - Legal links:
    - `Privacy`, `Imprint`, `Contact` (mailto).
  - `© {year} Fruitful Lab`.

**Implication**

- Footer is now structurally aligned with header + hub.
- Edits to `PUBLIC_NAV_LINKS` flow automatically into footer.

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

---

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

---

## 2. Backend snapshot

**Stack**

- Declared in `backend/pyproject.toml`:
  - `fastapi`, `uvicorn[standard]`, `sqlalchemy`, `psycopg[binary]`.
  - `python-jose[cryptography]` for JWT.
  - `passlib` for hashing.
  - `python-multipart` for uploads.

**Makefile**

- File: `backend/Makefile`

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
- ✅ Backdrop physics is isolated and documented.
- ✅ Header CTAs are auth-aware with tests.
- ✅ Legacy CSS animations removed.
- ✅ Old marketing sections quarantined in `_legacy`.

**Remaining nice-to-haves**

- When a `/resources` or “Knowledge Hub” page is added:
  - Add to `PUBLIC_NAV_LINKS`.
  - Hub cards / header / footer will pick it up.

---

## 4. What this gives future architects

- Clear “plug points”:
  - Public page → new route + entry in `PUBLIC_NAV_LINKS`.
  - Admin dashboard → new `/dashboard/*` route with `getCurrentUser()` guard.

- Single sources of truth:
  - Navigation → `frontend/lib/nav.ts`.
  - Layout frame → `SiteHeader`, `SiteFooter`, `PublicHubLanding`.
  - Motion → `LabBackdropClient.tsx` + two keyframes in `globals.css`.

- Auth flow:
  - Backed by FastAPI JWT endpoints.
  - Surfaced via `getCurrentUser()` and `LogoutButton` only.