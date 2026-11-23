# Fruitful Lab Customer Site Launch Checkpoint

Date: 2026-05-30
App: `apps/fruitful-lab-site/`
Domain target: `https://fruitfulab.com`
Worktree: `/private/tmp/fruitful-lab-services-design`
Branch: `codex/fruitful-lab-services-design-fix`

## Current Status

The Fruitful Lab customer site is technically ready for a Cloudflare Pages preview. The approved page set exports statically, SEO basics are present, internal links/assets scan cleanly, the internal font mockup route has been removed from the public export, and the approved typography pairing is now implemented and documented.

Public launch is not blocked by code structure. The remaining launch decisions are account/content choices: contact/newsletter destination, analytics/consent, final legal review, proof/testimonial permissions, and Cloudflare project/DNS setup.

## Work Completed In This Pass

- Removed the internal `/font-mockup/` comparison route from the app before launch.
- Removed comparison-only mockup font assets; kept the real approved Comfortaa 700 heading font asset.
- Kept the homepage copy unchanged during the launch QA pass.
- Kept the approved type pairing:
  - Comfortaa 700 for headers/display.
  - Raleway for body, buttons, navigation, labels, form controls, and interface text.
- Converted the blog/newsletter form from a fake signup state into an honest fallback that opens an email draft to `hello@fruitfulab.com` while MailerLite or another email platform is parked.
- Added the typography decision log to `docs/brands/fruitful-lab-site/design-system.md`.

## Validation Run

Run from `apps/fruitful-lab-site/`:

- `npm run lint` passed.
- `npm test -- --runInBand` passed: 1 suite, 3 tests.
- `npm run build` passed.
- Static export generated 21 app routes.
- Static export generated 19 route HTML files.
- Static export scan found 0 missing internal links/assets.
- `/font-mockup/` is no longer exported.
- `sitemap.xml` and `robots.txt` are present.

## Browser QA

Checked these routes on desktop `1280x900` and mobile `390x844`:

- `/`
- `/services/`
- `/how-we-work/`
- `/resources/`
- `/blog/`
- `/blog/which-growth-system-to-build-first/`
- `/about/`
- `/contact/`
- `/privacy/`
- `/terms/`

Results:

- No broken images detected.
- No document-level horizontal overflow detected.
- H1s compute as Comfortaa 700.
- Buttons/CTAs and navigation compute as Raleway.
- Some sections report internal scroll widths because of intentional ribbons, animated rails, arches, and overflow-hidden section shapes. These did not create document-level horizontal scrolling in the browser QA pass.

## SEO / Static Export Basics

Confirmed in exported HTML:

- Home, Services, How We Work, Resources, Blog, About, Contact, Privacy, Terms, and a sample blog post all have:
  - `<title>`
  - meta description
  - canonical URL
  - index/follow robots metadata
  - Open Graph title metadata
- Blog posts include canonical paths and structured article metadata from the template.
- `robots.txt` allows crawling and points to `https://fruitfulab.com/sitemap.xml`.
- `sitemap.xml` includes the public page set and all code-managed blog posts.

## Cloudflare Pages Readiness

Recommended Cloudflare Pages settings:

- Project root directory: `apps/fruitful-lab-site`
- Build command: `npm run build`
- Build output directory: `out`
- Framework preset: Next.js static export, or manual settings above
- Node version: use the version Cloudflare selects for this Next 16 app unless the build complains; then pin to the same local major used for the repo.

Optional environment variables:

- `NEXT_PUBLIC_TIDYCAL_URL`: set only if the final booking URL differs from the current fallback `https://tidycal.com/susycid`.
- `NEXT_PUBLIC_CLICKUP_FORM_URL`: parked. Set only if a ClickUp intake form becomes the V1 contact destination.

Not added yet:

- Analytics.
- Consent banner.
- MailerLite/newsletter integration.
- Cloudflare Function or custom form backend.
- Redirect map from any previous public URLs.

## Current Route Inventory

| Route | Launch state | Notes |
| - | - | - |
| `/` | V1 acceptable | Keep current homepage copy locked until Susy requests a copy pass. Founder assets are now present. Proof/case module remains structural. |
| `/services/` | V1 acceptable | Service structure is present. Real proof/case-study assets can come later. |
| `/how-we-work/` | V1 acceptable | Process page is present. Visual QA passed. |
| `/resources/` | V1 acceptable as coming soon | Intentional placeholder; not a blocker. |
| `/blog/` | V1 acceptable | Archive/grid design is accepted. Copy pass later. |
| `/blog/[slug]/` | V1 acceptable | Template, sidebar, related posts, vertical graphic slots, CTA, and fallback notes form are present. |
| `/about/` | V1 acceptable | Founder imagery is now present. Kind words/proof should be reviewed before public launch if testimonials are real. |
| `/contact/` | Usable fallback | TidyCal/email and local intake-to-email draft exist. Platform decision remains parked. |
| `/privacy/` | Needs human/legal review | Technically present; final legal review still needed. |
| `/terms/` | Needs human/legal review | Technically present; final legal review still needed. |

## Placeholder / Parked Items

Not blockers for Cloudflare preview:

- `/resources/` is intentionally coming soon.
- Blog posts are code-managed V1 content and can receive final editorial copy later.
- Blog vertical graphics are styled placeholders.
- Contact and newsletter paths use honest email fallbacks while platform decisions are parked.
- Branded OG/social image is parked because Susy chose to move forward with the provided logo; current metadata still has a fallback image.

Needs Susy or account setup before final public launch:

- Confirm whether Contact launches with TidyCal/email only, ClickUp Form, MailerLite, or a native Cloudflare form path.
- Decide analytics and consent minimum.
- Final legal review for Privacy and Terms based on actual tools used at launch.
- Review any testimonial/kind words copy for permission and exact phrasing.
- Decide whether current code-managed blog copy is good enough for launch or should wait for a copy pass.
- Create/approve Cloudflare Pages project and DNS/domain connection.

## Recommended Next Step

When Susy returns, the clean next step is Cloudflare Pages preview setup. After the preview exists, run the same QA against the Cloudflare preview URL, then decide the contact/newsletter/analytics/legal items before pointing `fruitfulab.com` at the site.
