1. Summary

Conclusion: Partially safe. Global scrollbar styling from frontend/app/globals.css is loaded app‑wide via the root layout and will apply to all WebKit/Blink scrollbars (Chrome, Safari, Edge) globally, including nested scroll containers. However, on Firefox, the current selectors only apply scrollbar-color/scrollbar-width to the html element, not to nested scroll containers (e.g., BottomSheet panel). Action needed: extend the Firefox selectors to cover nested scrollable elements.

Top risks:
- Firefox nested scroll containers aren’t styled (BottomSheet panel uses overflow-auto on an inner div). The current rule html { scrollbar-color ... } doesn’t cascade to that panel. Fix required.
- Any future component introducing its own overflow container (e.g., data grids, side panels) will bypass Firefox styling until selectors are broadened.
- If future CSS files import after globals.css and override ::-webkit-scrollbar, they could change appearance. No such files exist now, but note this risk.

2. Global CSS Application

Evidence of global import (root layout):
- File: frontend/app/layout.tsx
  Excerpt:
  import "./globals.css";
  export default function RootLayout(...) {
    return (
      <html ...>
        <body className={`${headingFont.variable} ${bodyFont.variable} font-body antialiased`}>
          {children}
        </body>
      </html>
    );
  }

Root layout usage: This is the true app root for all route groups ((site), (flow), (admin), (contractor)). Each group defines a nested layout, but all render under RootLayout.

Other global CSS imports that might override scrollbar rules: None found.
- Searched for tailwind/postcss or other global CSS includes; no tailwind.config* is present; postcss.config.mjs exists but adds no scrollbar plugin. No layout imports a second globals.css.

Finding: Pass (globals.css is global and loaded once).

3. Scroll Container Map

| Route Group | Layout file | Scroll container element | Overflow rules (relevant) | Risk |
| --- | --- | --- | --- | --- |
| (site) | frontend/app/(site)/layout.tsx | body/html (page scroll); container div is flex column | Container: `<div ... class="min-h-screen flex flex-col ...">`; no overflow set on container or main | Low |
| (flow) | frontend/app/(flow)/layout.tsx | body/html (page scroll) | Container: `<div ... class="min-h-screen ...">`; main has spacing only; no overflow utilities | Low |
| (contractor) | frontend/app/(contractor)/layout.tsx | body/html (page scroll) | Container: `<div ... class="min-h-screen ...">`; main no overflow | Low |
| (admin) | frontend/app/(admin)/admin/layout.tsx | body/html (page scroll) | Root div: min-h-screen flex flex-col; inner `<section ... class="min-w-0">` but no overflow set | Low |
| BottomSheet panel (modal) | frontend/components/ui/BottomSheet.tsx | Panel div (nested scroll container) | className includes "max-h-[85vh] overflow-auto" on panel | Medium (Firefox only) |

Notes:
- None of the group layouts set overflow-hidden or overflow-auto on the layout/root wrappers; normal page scrolling remains on the body/html.
- The BottomSheet panel is intentionally a nested scroll container when open; see Section 4 and 5 for implications.

Finding: Pass for route group layouts; Needs fix for nested containers in Firefox.

4. Scroll-Lock & Overflow Overrides

Search patterns: overflow-hidden, overflow: hidden, document.body.style.overflow, document.documentElement.style.overflow, style.overflowY, no-scroll, scroll-lock, lockScroll, disableScroll, data-scroll-locked.

Findings:

- File: frontend/components/ui/BottomSheet.tsx
  Excerpt (scroll lock):
  // Prevent background scroll while open
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  Excerpt (nested scroll container):
  The panel element (role="dialog") uses className including `max-h-[85vh] overflow-auto`, making it the scroll container while open.

  Assessment: Safe
  - When open, body scrolling is disabled and restored on cleanup (saves previous value, then restores). Targets body only; html is untouched. The panel itself scrolls.
  - This is correct and localized to the modal component.

- Other matches: Various UI elements use overflow-hidden for decorative wrappers (e.g., progress bars, cards) but not on page containers. No global scroll lock utilities or data attributes found.

Finding: Pass (scroll lock mechanisms are scoped and restored). No change required.

5. Scrollbar Selector Coverage

Current selectors in frontend/app/globals.css (excerpts):

- Firefox base (only html):
  html {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  }

- WebKit (applies to all scroll containers via universal selector):
  *::-webkit-scrollbar { width: var(--scrollbar-size); height: var(--scrollbar-size); }
  *::-webkit-scrollbar-track { background: var(--scrollbar-track); border-radius: var(--scrollbar-radius); }
  *::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: var(--scrollbar-radius); border: 3px solid transparent; background-clip: content-box; min-height: 24px; }
  *::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-thumb-hover); }
  *::-webkit-scrollbar-corner { background: transparent; }

Cross-check against actual scroll containers:
- Route layouts scroll on body/html: Covered on WebKit and Firefox (html rule applies).
- BottomSheet panel scrolls on a nested div: Covered on WebKit (universal *::-webkit-scrollbar). Not covered on Firefox (no scrollbar-color on that element).

Finding: Fail (Firefox nested containers not styled).

Minimal fix options:
- Option A (global, simplest): Also apply Firefox properties to all elements.
  In frontend/app/globals.css, add below the existing html rule:
  /* Firefox: style nested scroll containers too */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  }

- Option B (scoped utility + targeted usage): Define a utility class and apply it where needed (e.g., BottomSheet panel).
  In globals.css:
  .fp-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  }
  Then update frontend/components/ui/BottomSheet.tsx to add fp-scrollbar to the panel div className.

Recommendation: Option A ensures app‑wide consistency for any future nested scroll containers without per‑component work. It only affects scrollbar visuals, not layout.

6. Conflicts / Overrides

- Tailwind or third‑party scrollbar styling: None detected.
  - No tailwind.config.* present in frontend/; search yielded none.
  - postcss.config.mjs exists but includes no scrollbar plugin.
  - No other global CSS imports found in layouts.

Finding: Pass (no conflicting libraries overriding scrollbars).

7. Action Items

Required changes (to fully meet “apply everywhere”):

- Fix: Extend Firefox coverage to nested scroll containers.
  - File: frontend/app/globals.css
  - Change: Add the following rule beneath the existing html scrollbar block:
    /* Firefox: style nested scroll containers too */
    * {
      scrollbar-width: thin;
      scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
    }

Optional alternative (scoped):
- If you prefer not to use the universal selector, add a utility and apply it where nested scrolling occurs.
  - File: frontend/app/globals.css
    .fp-scrollbar { scrollbar-width: thin; scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track); }
  - File: frontend/components/ui/BottomSheet.tsx
    Add fp-scrollbar to the panel div’s className (the element with max-h-[85vh] overflow-auto).

Regression verification checklist:
- Open any long page in Chrome/Safari/Edge → scrollbars use themed track/thumb.
- Open the BottomSheet in Chrome/Safari/Edge → inner panel scrollbar uses themed styles.
- Open the same in Firefox → verify the page scrollbar and the BottomSheet panel scrollbar both use themed styles.
- Toggle prefers-reduced-motion and theme modes → scrollbars retain the same colors (tokens in :root and [data-theme="dark"] are used globally).
