# Fruitful Lab Customer Site Launch Readiness Audit

Date: 2026-05-26
App: `apps/fruitful-lab-site/`
Domain target: `https://fruitfulab.com`

Superseded note: the newer pre-final audit is `docs/brands/fruitful-lab-site/pre-final-launch-audit-2026-05-27.md`. Use that for current launch readiness decisions.


## Current V1 Route Status

First-pass acceptable for launch prep:

- `/` Home
- `/services/`
- `/how-we-work/`
- `/blog/`
- `/blog/[slug]/` post template
- `/resources/` as a coming-soon page
- `/about/`
- `/contact/` as a ClickUp-ready intake page with TidyCal/email fallback
- `/privacy/`
- `/terms/`

## Validation Run

Passed locally from `apps/fruitful-lab-site/`:

- `npm run lint`
- `npm test -- --runInBand`
- `npm run build`
- Exported internal route and asset href check across 19 HTML files
- Exported font/CSS check confirming the then-current heading/body font assets and V1 typography lock in the generated CSS. Superseded on 2026-05-30 by the approved Comfortaa 700/Raleway pairing

## Typography Standardization

The shared stylesheet now has a late `Fruitful Lab V1 type-scale lock` section. It keeps:

- Comfortaa 700 for display/headings
- Raleway for body, navigation, forms, buttons, labels, and interface text
- one hero headline scale across the site
- one major section headline scale across the site
- one card/module heading scale across the site
- a smaller legal/body heading scale for privacy and terms content

The design-system note was updated so future pages use this hierarchy instead of one-off page-local sizing.

## Launch Blockers Before Public DNS

These need a decision or final asset before `fruitfulab.com` points here:

- Set `NEXT_PUBLIC_CLICKUP_FORM_URL` to the published ClickUp Form URL so contact intake creates ClickUp tasks. Until then, the local fallback form opens an email draft and the page still offers TidyCal/email paths.
- Blog newsletter capture is frontend-only and does not send to an email platform yet.
- TidyCal currently uses the fallback `https://tidycal.com/susycid` unless `NEXT_PUBLIC_TIDYCAL_URL` is set for the deployment.
- Founder photos, founder/team imagery, blog vertical graphics, and final proof assets are placeholders.
- Blog posts are code-managed placeholder/editorial V1 content, not final copy.
- Privacy and terms are simple placeholders and should receive final legal/business review.
- Analytics/consent setup for the customer site has not been connected yet.
- Cloudflare Pages project, environment variables, DNS, redirects, and domain launch checklist still need to be executed.

## Non-Blocking Cleanup / B1 Polish

Useful before launch, but not structural blockers:

- Final copy pass across every page after the skeleton is locked.
- Real testimonials/proof language if approved.
- Open Graph/social image asset.
- Favicon/app icon pass.
- Redirect map from any old WordPress/public URLs if needed.
