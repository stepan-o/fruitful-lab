# Front Page Spec - Tech / Tools Hub

## 1. Page purpose & behavior
**URL:** `/` on the Tech / Tools domain (fruitfulab.net).

**Jobs of this page (for v1):**
**1. Explain where the user has landed** in one glance:
   * “This is Fruitful Lab, the tools & dashboards hub behind Fruitful Pin.”
**2. Aggressively nudge them to the main agency site** unless they clearly came for tools.
   * Primary visual focus = “Visit Fruitful Pin (Agency Site)”.
**3. Provide clear paths to:**
   * Agency marketing site (WordPress).
   * Tools index (`/tools`), starting with the Pinterest Potential Calculator.
   * Case studies index (`/case-studies`).
   * Login (`/login`) for internal/admin users.
**4. Auth behavior:**
   * If **NOT logged in** → show this page.
   * If **logged in (cookie exists)** → redirect to `/dashboard` (admin hub).

**Auth logic (high-level):**
* Check cookie `fruitful_access_token` in `app/page.tsx`:
   * If present → redirect("`/dashboard`").
   * If absent → render public hub page.
* No extra backend calls needed on this page.

---

## 2. Brand & visual system (applied here)
Follow the **global style summary** you gave; this page must feel like the same family as the marketing site.

### 2.1 Colors
* **Page background:** pure **White (#FFFFFF)**.
* **Hero “surface”:** still white; we can use:
  * a very subtle **Alabaster Grey (#DFDFDF)** band behind the main content or
  * a faint, off-center rounded “card” area with an Alabaster outline.
* **Headings: Prussian Blue (#0B132B).**
* **Body text: Ink Black (#171A21).**
* **Primary CTA (“Visit Fruitful Pin”):**
  * Background: **Dark Raspberry (#950952)**, white text.
* **Secondary CTAs (“Explore Lab Tools”, “View Case Studies”):**
  * Background: white
  * Border/text: **Prussian Blue (#0B132B).**
* **Accents only (micro):**
  * Bronze (#D58936) and Rust (#A44200) for:
    * Thin underlines / small icons.
    * Tiny animated “spark” near the primary CTA, not big areas.

---

### 2.2 Typography
* **Headings (H1/H2):** Alatsi, Prussian Blue.
* **Body text & CTAs:** Raleway, Ink Black for body, white or Prussian Blue for buttons.
* **Sizes (desktop):**
  * H1: ~40px, line-height ~1.2.
  * H2: ~26–32px, line-height ~1.25.
  * Body: 16px, line-height 1.5.
* **No all-caps globally;** if we want small caps for labels (“Lab tools”, “Main site”), do it per element.

---

### 2.3 Layout
* **Max content width:** 1200px.
  * Inner text width ~720–800px for readability.
* **Vertical spacing:**
  * Top & bottom padding of the main hero section: ~80px desktop / 60px tablet / 40px mobile.
* **Responsive behavior:**
  * On desktop → single central hero with horizontal CTA row.
  * On mobile → hero content stacked, CTAs vertical.

---

## 3. Content & copy (v1)
You’ll tweak wording later, but here’s a solid first pass.
### 3.1 Header bar
* Left: wordmark text — `Fruitful Lab`.
* Right: `Log in` link.

Copy:
* Log in → /login?next=/admin/dashboard.

### 3.2 Hero
**H1:**
> **Welcome to Fruitful Lab**

**Subheading (one sentence):**
Option A (default):
> _The tools, dashboards, and experiments that power Fruitful Pin’s Pinterest strategies live here._

Alt option (more explicit):
> _This is the technical hub behind Fruitful Pin — where we build custom tools, analytics, and automations for Pinterest marketing._

**Microline under subheading:**

> _If you’re looking for services, pricing, or how we work, you’ll want our main agency site._

---

### 3.3 CTA group (3 buttons)
Order and visual emphasis:
**1. Primary CTA – main site (most visual weight)**  
Label: `Visit Fruitful Pin (Agency Site)`
    * Link: canonical marketing domain (e.g., https://fruitfulpin.com).
    * This should be the **visual focal point**.
2. **Secondary CTA – tools**  
Label: `Explore Lab Tools`
    * Link: /tools.
3. **Secondary CTA – case studies**  
Label: `View Case Studies`
   * Link: `/case-studies`.

Below the CTA row, a short reassurance line:
> `Want internal dashboards or admin tools?` **Log in** (link → `/login?next=/dashboard`).

---

## 4. Interaction design & React flair
Goal: feel like a real React app, not a static marketing page, **without** going off-brand or tacky.

### 4.1 Overall motion
* Implement an animated but subtle “lab” background:
  * Example: a few thin, Bronze (#D58936) and Rust (#A44200) lines or dots that gently drift or pulse in opacity behind the hero, within the white/Alabaster environment.
* Could be done with:
  * CSS keyframe animation on SVG lines or
  * a lightweight Framer Motion component for micro-parallax when the mouse moves.

Key constraints:
* No heavy gradients covering the whole screen.
* White remains clearly the base; accents are small.

---

### 4.2 Primary CTA emphasis
We want to **pull the eye** to “Visit Fruitful Pin (Agency Site)” right away.

Ideas (combine 2–3 of these, not all):
* Slight initial **scale-in** animation (e.g., from 0.95 → 1) when the page loads.
* A **soft animated glow or ring** behind the button using Dark Raspberry with low opacity (e.g., a circle that gently pulses 1.0 → 1.03 scale).
* Micro label above the button in Bronze:
> `Start here` (small Raleway uppercase, Bronze).
* On hover:
  * Flip colors: white background, Dark Raspberry text, thin Dark Raspberry border.
  * Slight elevation (box shadow) and scale to ~1.02.

This should clearly communicate:
> “If you don’t know where to go, click this one.”

---

### 4.3 Secondary CTA behavior
* Hover:
  * Background → Alabaster Grey (#DFDFDF).
  * Border & text stay Prussian Blue.
  * Smooth transition.
* No pulsing or glow; just classic, solid interactions.

---

### 4.4 Tool preview (optional strip for extra flair)

Under the main CTAs, add a narrow **“lab cards” strip** for visual richness:
* A 2–3 card horizontal row (on mobile → stacked) with small cards:
  1. `Pinterest Potential Calculator`
    * Tag: `Public tool`.
  2. `Pinterest Performance Dashboard`
    * Tag: `Admin-only`.
  3. `Funnel Blueprint Engine`
    * Tag: `In development`.
* Cards:
  * Background: White.
  * Border: 1px Alabaster Grey.
  * Small Bronze tag chips.
* React flair:
  * Cards fade/slide up on first viewport, one after another.
  * Slight hover translation and shadow.

These cards all link to either:

the real route (e.g., `/tools/pinterest-potential`), or

placeholders for now (e.g., `/dashboard` for admin-only, `/tools` for “in development”).

---

## 5. Auth & routing behavior (precise)

---

### 5.1 Root `/` logic
In `app/page.tsx` (server component):
* Read cookies using `cookies()` from `next/headers`.
* If cookie `fruitful_access_token` exists:
  * `redirect("/dashboard")`.
* Else:
  * Render the public hub layout described here.

This keeps middleware unchanged and respects existing auth.

---

### 5.2 Header login link
* `href="/login?next=/dashboard"`.
No special casing; relies on existing `/api/auth/login` behavior.

---

### 5.3 Link targets
* **Primary CTA**:  
`href="https://fruitfulab.com"` (or chosen main URL).
* **Explore tools**:  
`href="/tools"`.
* **View case studies**:  
`href="/case-studies"`.
* **Login text links**:  
`href="/login?next=/admin/dashboard"`.

---

## 6. Component structure (for implementation)
Recommended components (App Router):
* `app/page.tsx`
  * Handles cookie check + either redirect or renders `<LabPublicLanding />`.
* `components/layout/LabPublicLayout.tsx`
  * Sets up max width (1200px), vertical padding, white background.
  * Provides header bar (logo + login).
* `components/home/LabHero.tsx`
  * H1, subheading, microline, CTA group.
* `components/home/LabPrimaryCTA.tsx`
  * Primary button with pulsing halo animation.
* `components/home/LabSecondaryCTAGroup.tsx`
  * Secondary buttons.
* `components/home/LabToolPreviewStrip.tsx` (optional v1)
  * Row of “tool cards”.
* `components/ui/Button.tsx`
  * Variants: `primary`, `secondary`, `ghost` that encode the brand colors + border radius (~6px).
* `components/ui/AnimatedBackdrop.tsx`
  * Handles subtle line/dot animations in Bronze/Rust; sits behind hero content.

All styling must adhere to:
* White base, light sections.
* Prussian Blue headings.
* Dark Raspberry primary CTAs.
* Raleway/Alatsi typography.
* Consistent spacing (80/60/40) and max width 1200px.

---

This is now the canonical spec for v1 of the Tech / Tools Hub homepage, aligned with:
* our current FastAPI + JWT backend,
* existing Next.js auth + middleware,
* the Fruitful global brand system,
* and the “React flair but not tacky” requirement with a very clear “go to main agency site” CTA.