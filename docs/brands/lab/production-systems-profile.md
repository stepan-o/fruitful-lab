# Stepan Oskin — production systems profile

## Brief and plan · 3 October 2026

Add `/stepanoskin/production-systems` as another presentation in the existing
`/stepanoskin` menu on `https://www.fruitfulab.net`. Scope: `apps/lab` and route
documentation only. Other apps, backend contracts, Sanctuary, and ongoing
Loopforge work are outside this change. Branch: `codex/professional-systems-profile`.

Audience: technical hiring managers, founders, and product leaders assessing
data-science judgment and full-stack implementation capability. The owner
confirmed current work at Prodigy Education, building in-house production
experimentation over a substantial math-education catalog with concurrent
item-level tests and custom success metrics. Keep this abstract. Do not publish
internal architecture, catalog details, metric definitions, or performance results.
Do not invent job dates, formal titles, employers, credentials, or client outcomes.

Sequence: professional identity and original loop diagram; current role and public
work; capabilities across measurement, generation, implementation, and operations;
an interactive comparison of four application domains; experimental method;
production process; primary sources and LinkedIn/print actions.

Visual direction: warm paper, graphite, restrained brass, SO monogram, and a quiet
technical drawing. No ambient motion, sound, image generation, or new fonts. This
follows the shared design/performance instructions provided from the main checkout.
Server-render the document. Limit client JavaScript to the scenario comparison and
profile actions. Preserve keyboard navigation, 44px controls, visible focus, English
language semantics, and a readable print layout.

## Research and boundaries

Checked 3 October 2026:
- LinkedIn: https://ca.linkedin.com/in/stepan-oskin-871b8a65
  Search-indexed public profile matches name and employer. Direct fetch was rate
  limited. The owner confirmed the current role; older profile material is not
  assumed current and no historical job titles/dates were imported.
- Publication: https://www.jtlu.org/index.php/jtlu/article/view/1905
  Publisher confirms Raghav, Oskin and Miller (2022), DOI 10.5198/jtlu.2022.1905.
- Google: https://developers.google.com/machine-learning/guides/rules-of-ml
  Rules 2/4/5/13/39 inform instrumentation, baselines, infrastructure tests, and
  the distinction between model objectives and product health. Six-word quote.
- Microsoft: https://www.microsoft.com/en-us/research/articles/patterns-of-trustworthy-experimentation-during-experiment-stage/
  Overall/local/data-quality/guardrail metrics, stable segments, sample ratio
  checks and repeated looks. Eleven-word quotation attributed to the original
  Kohavi/Tang/Xu work as quoted in the article. Concurrent-test interaction is
  presented as a design consideration, not proof about the employer's system.
- Duolingo: https://investors.duolingo.com/node/10901/pdf
  AI and shared-content course production, announced 30 April 2025.
- Roblox: https://about.roblox.com/newsroom/2026/02/accelerating-creation-powered-roblox-cube-foundation-model
  Interactive 3D generation; broader full-scene ambitions remain future work.
- Adobe: https://experienceleague.adobe.com/en/docs/genstudio-for-performance-marketing/user-guide/insights/overview
  Performance analysis connected to generation of creative variations.
- Implementation: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Accessibility: https://www.w3.org/WAI/tutorials/page-structure/
- Performance targets: https://web.dev/articles/vitals

External companies are methodological references, not clients or endorsements.
Application scenarios are qualitative proposed designs, not employer details or
measured results. Local attribution alone is not causal evidence; completion does
not establish learning; engagement does not establish satisfaction. No estimated
business uplift appears. The visible skill inventory is supported by repository
implementations, not a claim about Prodigy's technology choices.

## Implementation contract

The page lives in the existing public route group and requires no auth or backend
call. Existing menu entries retain their routes. The new entry has native text in
all six existing menu dictionaries, explicitly noting the English presentation.
The profile itself has `lang="en"` regardless of a saved menu locale. Canonical and
social metadata identify the new route. No new dependencies or global CSS changes.
Profile action telemetry reuses the existing GTM `cta_click` helper/schema.

Print uses browser printing with a concise profile layout: identity, background,
capabilities, LinkedIn, and a link to the complete presentation and references.
The longer methodology and example explorer remain in the online presentation.

## Validation

- Full integrated Lab CI: 34 Jest suites / 149 tests passed; asset release tests,
  retained-release integrity checks, TypeScript and production build passed.
  The route is statically prerendered. Scoped ESLint passed.
- Chromium production-browser verification: 320, 390, 768 and 1440 CSS pixels;
  no horizontal page overflow, framework overlays or browser console/page errors.
- Axe WCAG A/AA and best-practice checks: no reported violations at those four
  widths. This is an automated check, not a claim of complete WCAG conformance.
- Keyboard: skip link focuses main; radio arrow keys change applications. All
  four examples update. Touch verified at 390px/DPR 2; scenario targets are ≥44px.
- Navigation: presentation menu → profile → menu; both entries remain available;
  all six localized labels fit at 320px. The public tools destination renders.
- No JavaScript: identity, experience, default example and all five references
  render on the server; inactive comparison/print controls are hidden.
- Reduced motion: the new page has no running animations.
- Print: two A4 pages (identity/background, capabilities/contact), with a link to
  the full online presentation and references. The longer sections stay visible
  on screen. Checked for heading spacing, readable content, and page breaks.
- Media: zero raster content-image payload on the profile; the original
  explanatory SVG is inline. No new fonts or runtime packages. The menu retains
  its existing versioned logo pipeline.
- Local desktop cold/warm timings are diagnostic only, on an unthrottled local
  production server with Chromium. See observations below. No field LCP, INP or
  CLS claim is made.

Review captures (production rendering):

![Desktop profile](production-systems-evidence/desktop.webp)

![Phone profile](production-systems-evidence/mobile.webp)

Cold observation: LCP 516 ms; CLS 0.000; document encoded size 14,910 bytes; resource transfer 298,718 bytes.
Warm observation: LCP 192 ms; CLS 0.000; document encoded size 14,910 bytes; resource transfer 27,822 bytes.
