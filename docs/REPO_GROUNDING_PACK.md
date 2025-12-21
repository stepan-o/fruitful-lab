# Repo Grounding Pack — “Where Truth Lives” (Fruitful Lab)

This appendix anchors the locked LLM Architect System Prompt to exact, real repo locations. Scope is system-level and reality-first. Each item includes: path, what it is, why it matters (invariants), and what to check.

---

## 1) Repo Map (High-Signal)

- Path: frontend/app/
  - What: Next.js App Router (routes, layouts, server components)
  - Why: Canonical source for public pages, tool entry points, and admin dashboard routing
  - What to check:
    - Root layout at frontend/app/layout.tsx; landing at frontend/app/page.tsx
    - Tool routes at frontend/app/(flow)/tools/*; public pages at frontend/app/(site)/*

- Path: frontend/middleware.ts
  - What: Middleware for auth gating and experiment cookie assignment
  - Why: Enforces access to /dashboard and runs pre-render variant assignment for tools
  - What to check:
    - PROTECTED_PATHS includes "/dashboard"; applyExperimentCookies for Pinterest Potential

- Path: frontend/lib/gtm.ts
  - What: Single utility for window.dataLayer event pushes
  - Why: Canonical analytics emission layer (tool_view, tool_start, lead_submit, cta_click)
  - What to check:
    - pushEvent uses window.dataLayer; payloads are flat

- Path: frontend/lib/growthbook/ (flags.ts, middleware.ts, experiments.ts)
  - What: GrowthBook integration (SDK adapter, cookie assignment, server runner)
  - Why: Canonical experiment plumbing and exposure tracking
  - What to check:
    - Adapter tracking callback; applyExperimentCookies; runServerExperiment

- Path: frontend/components/tools/pinterestPotential/
  - What: Pinterest Potential wizard + variant components
  - Why: Reference wizard pattern used by public tools
  - What to check:
    - Wizard.tsx manages steps; V1.tsx wires analytics

- Path: backend/
  - What: FastAPI app (auth, stats, security, models, schemas)
  - Why: Canonical API and authorization gates
  - What to check:
    - Routers in backend/routers; security in backend/security.py

- Path: docs/SYSTEM_IMPLEMENTATION_AUDIT.md
  - What: Reality-first system audit document (ground truth snapshot)
  - Why: Authority source when prompts and code comments disagree
  - What to check:
    - Coverage of routing, analytics, experiments, auth, and known gaps

---

## 2) Access Enforcement Anchors

- Path: frontend/middleware.ts
  - What: Gate /dashboard; assign experiment cookie on tool routes
  - Why: Prevents unauthenticated access before render; sets variant early
  - What to check:
    - Missing fruitful_access_token → redirect to /login?next=...
    - Matcher includes /dashboard and /tools/pinterest-potential*

- Path: frontend/app/dashboard/page.tsx
  - What: Server-side admin check (fail-closed)
  - Why: Ensures only admins see dashboard even if middleware is bypassed
  - What to check:
    - Redirect to /login if no user; redirect non-admins to /tools

- Path: frontend/lib/auth.ts
  - What: Server helper for current user via /auth/me
  - Why: Canonical read of auth state from cookie/token
  - What to check:
    - Cookie name fruitful_access_token; Bearer call to /auth/me

---

## 3) Analytics / GTM Anchors

- Path: frontend/lib/gtm.ts
  - What: Centralized dataLayer push helpers
  - Why: Consistent event names and flat payloads for GTM
  - What to check:
    - pushEvent merges into { event, ...params }; helpers for tool/CTA/lead

- Path: frontend/app/layout.tsx
  - What: GTM snippet injection when NEXT_PUBLIC_GTM_ID is set
  - Why: Initializes window.dataLayer; single container insertion
  - What to check:
    - Next Script id="gtm"; no direct gtag() calls elsewhere

---

## 4) Experiments / GrowthBook Anchors

- Path: frontend/lib/experiments/config.ts
  - What: Experiment registry (keys, variants, defaults)
  - Why: Single source for experiment keys and allowed variants
  - What to check:
    - pinterest_potential_variant aligns with tool variants ("v1","v2")

- Path: frontend/lib/growthbook/experiments.ts
  - What: Server-side runner (GB-first, fallback weights)
  - Why: Canonical assignment path used by middleware
  - What to check:
    - Returns { variant, source }; handles GB errors

- Path: frontend/app/(flow)/tools/pinterest-potential/page.tsx
  - What: Page reads cookie/query; does not assign
  - Why: Verifies “assignment before render” and precedence
  - What to check:
    - ?variant → cookie → DEFAULT_VARIANT using PINTEREST_POTENTIAL_VARIANT_COOKIE

---

## 5) Tool Wizard Pattern Anchors

- Path: frontend/components/tools/pinterestPotential/PinterestPotentialWizard.tsx
  - What: Canonical wizard component (steps, validation, transitions)
  - Why: Reference wizard contract used by public tools
  - What to check:
    - Props: leadMode, initialLead, onPhaseChange, onStart

- Path: frontend/components/tools/pinterestPotential/PinterestPotentialV1.tsx
  - What: V1 tool that composes the wizard and analytics
  - Why: Demonstrates Start vs Results phases and event wiring
  - What to check:
    - useToolAnalytics({ toolName: "pinterest_potential" }); onStart → trackToolStart

---

## 6) Schema / Spec Anchors (if present)

- Path: backend/schemas.py
  - What: Pydantic schemas for auth and Pinterest stats
  - Why: Canonical API response shapes consumed by frontend
  - What to check:
    - UserOut and PinterestAccountStatsMonthlyOut fields

- Path: backend/models.py
  - What: SQLAlchemy models (users, pinterest_account_stats_monthly)
  - Why: Canonical database entities backing API schemas
  - What to check:
    - User.is_admin field; monthly stats columns and types

---

## 7) Gaps / Ambiguities to record in SYSTEM_IMPLEMENTATION_AUDIT.md

- Path: (frontend) /login (referenced, not found)
  - What: Login page/UI is referenced by redirects but missing in repo
  - Why: Onboarding and access enforcement assume a login UI exists
  - What to check:
    - Redirects to /login from middleware and dashboard; no corresponding route found

- Path: frontend/app/(site)/case-studies (referenced in nav, not found)
  - What: /case-studies link present in navigation but route missing
  - Why: Public nav should not 404; treat as known gap
  - What to check:
    - PUBLIC_NAV_LINKS includes /case-studies; no matching route implementation

- Path: Lead persistence
  - What: Lead capture behavior implied by leadMode; storage endpoints unclear
  - Why: Wizard analytics may assume lead_submit exists
  - What to check:
    - Presence/usage of trackLeadSubmit in actual components (not confirmed)
