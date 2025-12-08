# Sprint Goal: v1 Tech / Tools Hub Home

**Outcome:**  
`/` on the Tech domain is a branded, React-y “Lab lobby” that:
* Explains what Fruitful Lab is
* Pushes most visitors to the main agency site
* Lets people access /tools, /case-studies, and /login
* Redirects authenticated users straight to /dashboard
* Respects existing backend auth & cookie structure

---

## High-Level Deliverables
**1. New root page (`app/page.tsx`) with:**
    * Auth-aware redirect using `fruitful_access_token` cookie
    * New hero layout, CTAs, and microcopy per spec
    * Subtle animated backdrop & hover interactions
**2. Shared layout + UI primitives:**
    * Global colors & fonts wired (Alatsi + Raleway)
    * Button component with `primary` / `secondary` variants
    * Public layout wrapper for all logged-out/public pages
**3. Skeleton public sections:**
    * `/tools` index page
    * `/case-studies` index page
    * Both reuse the same public layout & global styles
**4. Basic tests + sanity checks:**
    * At least one test asserting the hub page renders and main CTA is present
    * Manual QA checklist (auth behavior, links, responsive layout)

---

## Constraints & Non-Goals (for this sprint)
* **Do not change:**
  * Backend endpoints (`/auth/login`, `/auth/me`, `/pinterest-stats/*`)
  * Cookie name (`fruitful_access_token`)
  * Middleware config (still only guarding `/dashboard`).
* No client dashboards or tools logic yet (beyond skeletal routes).
* No major design system refactor outside what’s needed for this page + shared layout.

---

## Task Breakdown (step-by-step)
### Task 0 – Repo & env sanity check
**Purpose:** Make sure Junie operates in the right environment.
* Confirm project structure:
  * `backend/` FastAPI
  * `frontend/` Next.js app-router
* Ensure `NEXT_PUBLIC_API_BASE_URL` is set correctly in `.env.local` for dev.
* Run:
  * `cd frontend && npm install`
  * `npm run dev`
* Confirm:
  * `https://api.fruitfulab.net/health` is reachable from the browser (or dev server).
  * Current `/login` and `/dashboard` work in dev with an existing admin user.

**Acceptance:** Dev env is running, Junie can hit `/login` and see existing login screen.

---

### Task 1 – Global design foundation (fonts + colors)
**Goal:** Align Next.js frontend with Fruitful brand system.
1. Fonts via `next/font`:
   * In `app/layout.tsx`, import:
     * `Alatsi` for headings.
     * `Raleway` for body.
   * Attach them as CSS custom properties or class names on `<body>` (e.g., `className={${raleway.variable} ${alatsi.variable} ...}`).
2. Brand colors in CSS:
   * In `globals.css`, define CSS vars on :root:
```css
:root {
    --color-raspberry: #950952;   /* primary CTA */
    --color-prussian:  #0b132b;   /* headings, borders */
    --color-ink:       #171a21;   /* body text */
    --color-alabaster: #dfdfdf;   /* light bg / borders */
    --color-bronze:    #d58936;   /* micro accents */
    --color-rust:      #a44200;   /* micro accents */
    --color-white:     #ffffff;
}
```
* Set base body styles:
   * `font-family: Raleway`
   * `color: var(--color-ink)`
   * `background: var(--color-white)`
3. Heading defaults:
   * global style for `h1`, `h2`, `h3` using Alatsi + Prussian Blue.

**Acceptance:**  
* Any new page shows Raleway body text, Alatsi headings, proper colors.
* No random new color tokens introduced.

---

## Task 2 – Shared public layout component
**Goal:** Reusable layout for **all public pages** (hub, tools, case studies).

Implementation:
* Create `components/layout/LabPublicLayout.tsx`:
  * Props: `{ children: React.ReactNode }`.
  * Render:
    * Full-page white background.
    * Centered container with `max-width: 1200px; margin: 0 auto; padding: 80px 16px 80px;` on desktop (responsive down to 60/40).
    * Header:
      * Left: `Fruitful Lab` (Alatsi, small).
      * Right: `Log in` link (/login?next=/dashboard).
  * Use flexbox to arrange header, then main content.
* Use this layout in:
  * `app/page.tsx` (public state).
  * `app/tools/page.tsx`.
  * `app/case-studies/page.tsx`.

**Acceptance:**
* All three pages share identical header and max-width behavior.
* Vertical padding matches the global guideline (80/60/40).

---

## Task 3 – UI primitives (Buttons & small text styles)
**Goal:** Centralize CTA styling.

**Implementation:**
* Create `components/ui/Button.tsx`:
  * Props: `variant: "primary" | "secondary"`, `href?`, `onClick?`, `children`, `className?`.
  * For href, wrap Next `<Link>`; for plain button, `<button>`.
  * **Primary:**
    * Background: `var(--color-raspberry)`.
    * Text: white.
    * No border.
    * Border-radius: ~6px.
    * Padding: ~`0.8rem 1.6rem`.
    * Hover: white bg, raspberry text, 1px raspberry border, subtle shadow.
  * **Secondary:**
    * Background: white.
    * Text & border: var(--color-prussian).
    * Hover: background var(--color-alabaster), same text color.
* Add a small “tag” style as a utility class or component (`components/ui/Tag.tsx`) using Bronze or Rust for future tool cards (optional but handy).

**Acceptance:**
* `<Button variant="primary">` & `secondary` render correctly and match spec.
* No inline one-off button styles in the new pages; they use the Button component.

---

## Task 4 – Animated backdrop for hero
**Goal:** Subtle “lab” motion without overpowering white, content-first feel.

**Implementation idea:**
* Create `components/home/LabAnimatedBackdrop.tsx`:
  * Absolutely positioned behind hero content (e.g., `position: absolute; inset: 0; pointer-events: none;`).
  * Contain:
    * A few small circles/lines in Bronze/Rust and Alabaster, with low opacity.
  * Animate with CSS keyframes or Framer Motion:
    * Very slow drift or float (e.g., translateY/translateX by a few pixels).
    * Maybe gentle opacity pulsing.
* In `app/page.tsx` hero, wrap content in a relatively positioned container and render `LabAnimatedBackdrop` behind it.

**Acceptance:**
* Motion is visible but soft; text is fully readable.
* Performance is acceptable on mobile (no heavy canvas/WebGL).

---

## Task 5 – Implement root page logic & hero layout (app/page.tsx)

Goal: Auth-aware landing page with full hero, CTAs, and copy.

Implementation steps:

Auth gate:

In app/page.tsx (server component):

Use cookies() from next/headers.

If cookie fruitful_access_token exists → redirect("/dashboard").

Else → render <LabPublicLayout> with hero content.

Hero content:

New component components/home/LabHero.tsx or inline inside app/page.tsx.

Inside LabPublicLayout:

H1: “Welcome to Fruitful Lab”.

Subheading line (from spec).

Microline: “If you’re looking for services … main agency site”.

CTA row using Button:

Primary: Visit Fruitful Pin (Agency Site) → external URL.

Secondary 1: Explore Lab Tools → /tools.

Secondary 2: View Case Studies → /case-studies.

Under the buttons, small sentence:

Want internal dashboards or admin tools? Log in (link /login?next=/dashboard).

Primary button emphasis:

Wrap primary button in a small container with:

Bronze Start here label above (tiny Raleway, uppercase).

Pseudo-element or extra <span> that creates a subtle Dark Raspberry glow behind the button with a slow scale/pulse animation.

Acceptance:

Logged-out visit to / shows the new hero and CTAs.

Logged-in visit (cookie manually set) redirects to /dashboard.

Primary CTA is visually dominant and animated; user attention naturally goes there.

Task 6 – Tool preview strip (optional but recommended for flair)

Goal: Add a little “lab-ness” and show what lives here.

Implementation:

Create components/home/LabToolPreviewStrip.tsx:

Row of 2–3 cards (stacked on mobile).

Each card:

White background, 1px Alabaster border, 6px radius.

Title, 1-line description, small tag (Bronze).

Links:

Pinterest Potential Calculator → /tools/pinterest-potential (for now can point to /tools if page doesn’t exist yet).

Pinterest Performance Dashboard → /dashboard (tagged “Admin-only”).

Funnel Blueprint Engine → /tools or # (tagged “In development”).

Use Framer Motion or CSS:

Cards fade/slide up on initial render.

Hover: tiny translation + shadow.

Place this strip under the hero CTA row within LabPublicLayout.

Acceptance:

Cards render nicely on desktop & mobile.

They use existing Button/Tag styles; no off-brand styling.

They don’t overshadow the main CTA, just add context.

Task 7 – /tools and /case-studies skeleton pages

Goal: Ensure hub buttons don’t 404 and maintain consistent look.

Implementation:

app/tools/page.tsx:

Use LabPublicLayout.

H1: Lab Tools.

Short paragraph explaining:

“This is where we’ll list public tools like the Pinterest Potential Calculator…”

For now, single list item linking back to the calculator (or “coming soon”).

app/case-studies/page.tsx:

Use LabPublicLayout.

H1: Case Studies.

Short blurb:

“Here you’ll find deeper technical breakdowns of Pinterest strategies and experiments.”

For now, a “Coming soon” card.

Acceptance:

Clicking from hub buttons lands on these pages.

Layout/header/spacing consistent with root page.

Task 8 – Tests & QA

Automated tests (minimal but useful):

New test file, e.g. __tests__/homePage.test.tsx:

Render the hub component (not the redirect logic) directly.

Assert:

H1 contains “Welcome to Fruitful Lab”.

Primary CTA button with text “Visit Fruitful Pin (Agency Site)” exists.

Buttons have correct href attributes.

If feasible, also unit-test the cookie redirect function in isolation (extract logic if needed).

If there is an existing Jest setup, reuse it (there is, per repo).

Manual QA checklist:

Logged-out:

Visit /:

See hero, animated accents, and three CTAs.

Primary CTA visually stands out.

Click “Visit Fruitful Pin (Agency Site)” → opens correct domain.

Click “Explore Lab Tools” → /tools.

Click “View Case Studies” → /case-studies.

Click “Log in” in header → /login?next=/dashboard.

Logged-in:

Log in via /login using admin credentials.

Visit / manually:

Confirm you’re redirected to /dashboard.

Responsive:

Narrow viewport:

Buttons stack vertically.

Text remains readable.

Animated backdrop doesn’t break layout.

Acceptance: All tests pass, manual QA checklist passes on dev build.

That’s the sprint plan.

Next step (as you said): we translate portions of this into focused Junie prompts like:

“Implement Task 1 & 2”

“Implement Task 5 only”

etc.

When you’re ready, we’ll chunk this into those concrete prompts.