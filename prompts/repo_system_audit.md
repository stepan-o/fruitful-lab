# Prompt for Juno — System Reality Audit & Documentation Pass (NO CODE CHANGES)

You are acting as a **Systems Auditor + Documentation Architect** for the Fruitful Lab Tech Hub.

Your task is **NOT to modify code**.
Your task is to **investigate, verify, and document what actually exists today** in the repo and deployed system, and produce a **single, clean, properly structured Markdown report** that reflects reality — not intent, not assumptions, not prior plans.

This report will be committed to the repo as documentation.

You must rely only on:
- The current repository state
- Deployed behavior you can observe
- Configuration files
- Runtime inspection where applicable

Do **not** propose improvements.
Do **not** refactor.
Do **not** “fix” anything.
Do **not** infer future plans unless explicitly visible in code.

This is a **descriptive audit**, not a prescriptive one.
## Goal of This Task

Produce a Markdown document that answers, with evidence:

> “If a new engineer or LLM architect joined tomorrow, what is the system *actually doing* today?”

This document will be treated as the **ground-truth implementation record** against which future changes are evaluated.
## Output Requirements (Strict)

- Output must be **valid Markdown**
- Use clear section headers (`##`, `###`)
- Use code blocks where appropriate
- Be explicit when something is:
    - Confirmed
    - Unclear
    - Missing
    - Legacy / unused
- Avoid speculation
- Avoid emotional or opinionated language
- Prefer bullet points and tables over prose
- Reference concrete files, folders, routes, and configs
- Assume the reader has access to the repo but has not explored it yet

The final file should be saved in the repo as something like:

docs/SYSTEM_IMPLEMENTATION_AUDIT.md
## Scope of Investigation (You Must Cover All Sections)

You are expected to investigate **at least** the following areas.
If you discover additional relevant subsystems, include them.

You may add sub-sections as needed, but do not omit any major category below.
## 1. Repository Layout & Structure

Document:
- Top-level folders
- Purpose of each folder
- Which folders are active vs legacy
- Any notable patterns (monorepo boundaries, shared libs, etc.)

Include:
- Tree-style summaries
- Notes on naming conventions
- Where frontend vs backend responsibilities clearly split
## 2. Frontend Application Architecture (Next.js)

Investigate and document:

### App Router
- `/app` structure
- Route groups and layouts
- Which routes are public vs gated
- How `/`, `/tools`, `/dashboard`, etc. are implemented

### Layouts
- Root layout
- Tool layouts
- Dashboard layouts (if present)
- How header/footer are injected

### Client vs Server Components
- Where `use client` is used
- Any shared client-only infra (e.g. analytics helpers)

### Navigation
- Where nav config lives
- How it’s reused (header, footer, cards)
- Any hardcoded links worth noting
## 3. Global Styles & Design System

Investigate:

- `globals.css` (or equivalent)
- Any design tokens (colors, spacing, fonts)
- Animation utilities (e.g. lab background)
- How styles are consumed (class-based, Tailwind, custom CSS)

Document:
- What is global vs local
- Any CSS variables in use
- Any patterns that look intentional vs incidental
## 4. Public Hub Pages

Document:
- Hub landing page (`/`)
- Tools index page (`/tools`)
- Case studies or other public content pages

For each:
- Route path
- Purpose
- Key components
- CTAs present
- Analytics hooks observed (if any)
## 5. Public Tools System

For each existing tool (especially Pinterest Potential Calculator):

Document:
- Route
- Entry component
- Internal structure (wizard, steps, compute)
- State persistence (sessionStorage, cookies, etc.)
- Variant handling (if present)
- Lead capture behavior (UI + data flow)

Include:
- File references
- High-level flow diagram (textual is fine)
## 6. Analytics Implementation (GTM / GA4)

Investigate and document:

### Data Layer
- Where `dataLayer.push` occurs
- Helper utilities involved
- Event names and payload shape

### GTM Configuration (as reflected in repo / known config)
- Event triggers
- Variables used
- Tags defined (names only, not screenshots)

### Observed Runtime Behavior
- What events fire on page load
- What fires on tool interaction
- Any events that appear defined but unused

Be explicit about:
- What is confirmed firing
- What exists but does not fire
## 7. Experiments & Feature Flags (GrowthBook)

Investigate:
- Middleware usage
- Cookies involved
- Variant precedence rules (as implemented)
- Exposure tracking
- Conversion tracking

Document:
- Exact experiment keys
- Variant names
- Where assignment happens
- Where variants are read

Note any divergence between intended design and actual behavior.
## 8. Backend API (FastAPI)

Investigate and document:

### Structure
- Entry point
- Routers
- Models
- Schemas
- Config files

### Endpoints
- Auth endpoints
- Stats endpoints
- Any public endpoints

### Authentication
- JWT handling
- Token storage expectations
- Admin vs non-admin behavior

### Database
- Tables defined
- Primary entities
- How data is ingested (CSV, API, etc.)

Use tables where helpful.
## 9. Auth Flow (End-to-End)

Document the **actual** auth flow:

- How login works
- Where tokens live (cookies, headers, storage)
- How frontend checks auth
- Redirect behavior on `/`
- Logout behavior

If multiple patterns exist, document all and flag ambiguity.
## 10. Environment Configuration

Document:
- Required env vars (frontend + backend)
- Optional env vars
- Which are runtime-critical
- Any envs referenced but seemingly unused

Include file references (`.env.example`, config files).
## 11. Testing & CI (As Implemented)

Investigate:
- Test folders
- Test frameworks in use
- What is covered vs not
- CI configuration files (if any)

Document:
- What runs automatically
- What is manual
- What appears planned but not active
## 12. Known Ambiguities & Open Questions

Create a final section listing:
- Conflicting behaviors
- Incomplete flows
- Legacy code paths
- Things that require human clarification

This section is critical.
Do not skip it.
## Constraints (Very Important)

- ❌ Do not modify code
- ❌ Do not refactor
- ❌ Do not rename files
- ❌ Do not add features
- ❌ Do not “fix” issues

Your output is **documentation only**.
If something is messy, document the mess.
If something is unclear, say so.
## Tone & Mindset

Think like:
- A forensic engineer
- A systems archivist
- A future-you who will be very annoyed if this doc lies

Accuracy > completeness.
Reality > elegance.
## Final Deliverable

A single Markdown file committed to the repo that:

- Can be read top-to-bottom
- Requires no Slack context
- Requires no oral handoff
- Accurately represents the current system

Once complete, stop.
Do not open a PR with changes.
Do not suggest next steps.