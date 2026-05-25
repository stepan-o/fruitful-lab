# Fruitful Pin Next.js Migration Spec

Status: planning reference created 2026-05-20; B1 content workflow updated 2026-05-24.

This document captures the corrected implementation direction for migrating the Fruitful Bean / Fruitful Pin marketing site at `fruitfulpin.com` away from the current WordPress/Kadence-style frontend into a coded Next.js site.

Important 2026-05-24 update:

- The original version of this spec assumed WordPress on prepaid A2 would remain as the phase-one headless CMS/editor.
- Susy has since chosen a simpler B1 direction: code-managed content and a Codex-assisted publishing workflow.
- WordPress/A2 can remain available as the old-site source/archive during migration, but it should not be assumed as the B1 CMS.
- Existing WordPress posts and required media should be migrated into the Next.js app for launch.
- Headless WordPress may be revisited later only if Susy explicitly decides the CMS workflow is worth the added complexity.

## Core Context

- Fruitful Lab is the broader parent/builder brand for AI, marketing, data, tools, and systems.
- Fruitful Bean / Fruitful Pin is the Pinterest-specific service brand and the scope of this migration.
- Fruitful Lab should remain as-is for now.
- The Pinterest assessment/tooling may be reused or linked into the Fruitful Pin customer journey, but this migration is not a Fruitful Lab rebuild.
- The current domain `fruitfulpin.com` is registered with GoDaddy.
- The current site is hosted on A2.
- The current A2 hosting is prepaid until 2027; renewal is expected to be about `$600` for 3 years, or about `$200/year`.
- Kadence should be removed from future cost comparison because Susy does not plan to keep using it.
- WordPress itself is free in the current setup; no paid plugins are assumed.
- The original first-phase migration path kept WordPress on A2 as the CMS/editor, but this is now superseded for B1.
- The current B1 path is code-managed content: approved blog posts, page content, SEO fields, and optimized media live in the Next.js app and are updated through Codex-assisted repo changes.
- A later iteration may revisit WordPress, Sanity, or another CMS if the code-managed workflow becomes too cumbersome.
- Susy already has the primary offer, claims, services, copy, and migration scope defined.
- Susy is tech-savvy and comfortable using Codex/AI-assisted editing for site changes, but a familiar CMS-style editing experience is still valuable for normal content.
- Stepan is expected to be comfortable with AI-assisted implementation.

## Goal

Rebuild `fruitfulpin.com` as a faster, cleaner, more conversion-focused Pinterest marketing site that:

- preserves the Fruitful Bean / Fruitful Pin brand and already-defined offer,
- supports normal marketing pages and blog content,
- integrates the Pinterest assessment path as a lead/conversion asset,
- reduces dependence on WordPress themes,
- can be maintained through a Codex-assisted code-managed content workflow in phase one,
- can be maintained with AI-assisted workflows,
- and can launch without taking the current A2/WordPress site offline during the build.

## Recommended Architecture

Fruitful Pin should be implemented as a separate app in the brand/app monorepo, not as routes inside the Fruitful Lab app.

Target app path after the monorepo structure PR:

```txt
apps/fruitful-pin/
```

See `docs/BRAND_APP_MONOREPO_ARCHITECTURE.md` for the broader repo structure and future brand expansion model.

### Frontend

- Use Next.js for the public site.
- Host the public Next.js frontend on Cloudflare first if practical, because cost matters for a business under roughly `$30K/year`.
- Use Vercel only if Cloudflare compatibility creates enough friction to justify the higher monthly cost.
- Keep the public frontend in code with reusable React components and page templates.

### Chosen B1 Target

Use this as the implementation target unless Susy explicitly changes direction:

```txt
GoDaddy domain
-> Cloudflare hosts the public Next.js site
-> Content is managed in the Next.js repo through Codex-assisted updates
-> MailerLite handles email/list capture once integration credentials are available
```

This means:

- visitors see the Cloudflare-hosted Next.js site,
- approved blog posts, metadata, and optimized images live in `apps/fruitful-pin`,
- Susy can draft and organize posts in ClickUp, Drive, or another editorial workspace,
- Codex migrates/publishes approved content into the site repo and runs validation before launch,
- WordPress/Kadence no longer controls the public frontend,
- A2 can remain available as the old WordPress source/archive while the content is migrated,
- the CMS decision can be revisited before the 2027 A2 renewal window if the code-managed workflow feels limiting.

### Hosting Preference

Primary option:

- Cloudflare Pages for mostly static marketing/blog pages.
- Cloudflare Workers only if dynamic server behavior is needed.

Expected hosting cost:

- Best case: `$0/year` on Cloudflare for a static/mostly static marketing site.
- More realistic dynamic case: about `$5/month`, or `$60/year`, if Workers Paid is needed.

Comparison against current future A2-only cost after the prepaid period:

- Current likely future A2 renewal cost without Kadence: about `$600` over 3 years.
- Cloudflare likely range: `$0-$180` over 3 years.
- Expected future savings after dropping A2: about `$420-$600` over 3 years, depending on whether paid Workers are needed.
- Phase one does not require A2 as a CMS if content/media are migrated into the Next.js app. A2 can remain available because it is prepaid, but the launch target should avoid depending on it.

### Content Editing

Use code-managed content for B1. Do not add headless WordPress, Sanity, or another CMS unless Susy explicitly reopens that decision.

Phased options:

1. B1: Code-managed content
   - Susy can draft content in ClickUp, Drive, Docs, or another editorial workspace.
   - Codex migrates approved copy, SEO fields, images, and internal links into `apps/fruitful-pin`.
   - Published content is committed in the website repo and deployed through the normal build pipeline.
   - This keeps the launch simpler, faster, and less dependent on WordPress hosting.

2. Later option: Headless WordPress on A2
   - Susy keeps the WordPress editor, posts, media library, categories, tags, drafts, and publishing workflow.
   - WordPress becomes the content database and editor UI only.
   - Kadence no longer controls the public site.
   - The Next.js frontend fetches content from WordPress and renders it in custom page templates.
   - This preserves familiarity and uses the already prepaid A2 hosting period, but adds API/media/domain complexity.

3. Later iteration: Sanity or a similar headless CMS
   - Susy uses a modern CMS dashboard instead of WordPress.
   - Content is modeled as structured fields and rich text blocks.
   - Likely cleaner for service pages, testimonials, case studies, FAQs, CTAs, and SEO fields.
   - May be free at the current scale, depending on usage and seats.
   - Avoids long-term WordPress hosting if all content migrates before A2 renewal.

- Use AI-assisted repo edits as the first-class workflow for B1 layout, blog posts, assessment, global CTA, SEO, and sitewide changes.

## What Headless CMS Would Mean If Reopened Later

This is no longer the B1 launch path, but it remains useful context if Susy later decides she wants a CMS dashboard.

In the current WordPress model:

```txt
WordPress dashboard -> Kadence/theme frontend -> public website
```

In the headless model:

```txt
WordPress dashboard on A2 -> API -> Next.js frontend -> Cloudflare hosting -> public website
```

The CMS stores and edits content. The coded Next.js frontend controls the public design and experience.

Susy should not need to edit HTML. She should edit normal fields and rich text such as:

- title,
- introduction,
- service copy,
- blog body,
- CTA label,
- CTA URL,
- FAQs,
- testimonials,
- case study results,
- images,
- SEO title,
- SEO description,
- slug.

The frontend renders those fields through coded components such as:

```tsx
<ServiceHero title={page.heroTitle} body={page.heroCopy} cta={page.cta} />
<FAQList items={page.faqs} />
```

## Domain And Launch Model

The current site does not need to be disconnected during the build.

Current:

- GoDaddy owns the domain registration.
- DNS likely points to A2.
- A2 hosts the current WordPress/Kadence public site.

During build:

- The new site is built separately.
- It can live on a preview URL such as:
  - `fruitfulpin.pages.dev`
  - `fruitfulpin-new.vercel.app`
  - `preview.fruitfulpin.com`
  - `staging.fruitfulpin.com`
- The current `fruitfulpin.com` remains live on A2.

At launch in B1:

- DNS is updated at GoDaddy, or DNS is moved to Cloudflare and then pointed to the new Cloudflare-hosted frontend.
- `fruitfulpin.com` and `www.fruitfulpin.com` point to the new site.
- WordPress may remain available on A2 as the old-site source/archive, but the public B1 site should not depend on WordPress media or API calls.
- SSL, redirects, sitemap, analytics, and Search Console are verified.

After launch:

- Keep A2/WordPress only as long as it is useful for archive/source access or another site need.
- Publish new Fruitful Pin posts through the code-managed workflow unless Susy explicitly changes the publishing model.
- Before A2 renewal, decide whether WordPress can be cancelled because Fruitful Pin no longer depends on it.

## Site Scope

Core pages:

- Homepage
- Pinterest services page or service pages
- About
- Contact or booking CTA page
- Blog index
- Blog post template
- Case studies/results page or reusable case study template if content is ready
- Assessment landing page or assessment CTA path
- Existing legal pages if present, such as privacy/terms

Reusable content models:

- Blog post
- Service page
- FAQ block
- Testimonial
- Case study/result
- CTA block
- Author/profile
- SEO metadata
- Homepage sections

Assessment integration:

- Prominent CTA from homepage, service pages, and relevant blog posts.
- Dedicated landing page or content path for the Pinterest assessment.
- Assessment may be embedded, proxied, or linked depending on technical ownership.
- Track assessment CTA clicks, starts, completions, and booking clicks.

## Roadmap

### Phase 0: Monorepo Structure Preparation

Status: completed by the structure migration PR.

Estimated time: 1 PR.

Tasks:

- Current Fruitful Lab app now lives in `apps/lab/`.
- Update commands, workflows, docs, and path references.
- Keep Fruitful Lab rendering and behavior unchanged.
- Update the Fruitful Lab Vercel project so it builds from `apps/lab/`.
- Validate local tests/build and Vercel preview/production rendering.

Deliverable:

- Repo is ready for multiple app work, with Fruitful Lab preserved as the sandbox/prototype app.

### Phase 1: Discovery And Export

Estimated time: 1-2 days.

Tasks:

- Crawl current `fruitfulpin.com`.
- Export current page list, posts, URLs, metadata, images, and assets.
- Identify URLs to preserve exactly.
- Identify URLs to redirect.
- Confirm which content is migrated, rewritten, removed, or consolidated.
- Confirm current forms, booking links, analytics, Search Console, email, and domain dependencies.

Deliverables:

- Content inventory.
- URL migration map.
- Redirect plan.

### Phase 2: Technical Foundation

Estimated time: 1-3 days.

Tasks:

- Create new app/repo or workspace for Fruitful Pin.
- Set up Next.js.
- Set up Cloudflare Pages/Workers preview deployment.
- Add layout shell, navigation, footer, design tokens, and base styles.
- Add SEO helpers.
- Add analytics/event framework.
- Connect a CMS prototype or structured content source.

Deliverable:

- Private preview site live on temporary URL.

### Phase 3: Code-Managed Blog And Content Mapping

Estimated time: 2-4 days.

Tasks:

- Map existing WordPress/source content to the Next.js content contract:
  - blog posts,
  - service pages,
  - FAQs,
  - testimonials,
  - case studies,
  - homepage sections,
  - CTAs,
  - SEO fields.
- Decide which existing posts are included in B1 and which are deferred.
- Add a clear blog post intake checklist for title, slug, excerpt, meta title, meta description, featured image, inline images, alt text, internal links, and CTA placement.
- Use ClickUp/Drive/Docs as editorial intake if useful, but publish final content from the repo.
- Keep headless WordPress out of B1 unless Susy explicitly reopens it.

Deliverable:

- Working code-managed content workflow and migrated B1 blog/content set rendered by Next.js.

### Phase 4: Page Build

Estimated time: 4-8 days.

Tasks:

- Build homepage.
- Build service page/template.
- Build blog index and blog post template.
- Build about/contact pages.
- Build case study/proof modules.
- Build assessment landing/CTA path.
- Add responsive polish.

Deliverable:

- Full site assembled in preview.

### Phase 5: Content Migration

Estimated time: 3-7 days.

Tasks:

- Move approved content into the Next.js content structure.
- Migrate images and media into the app or another approved permanent asset location.
- Clean formatting.
- Add SEO titles and descriptions.
- Add internal links.
- Remove placeholders, typos, duplicate headings, and outdated claims.
- Implement redirects for removed or changed URLs.

Deliverable:

- Content-complete preview site.

### Phase 6: QA, SEO, And Launch Prep

Estimated time: 2-4 days.

Tasks:

- Mobile QA.
- Accessibility sanity check.
- Performance check.
- Form and booking CTA test.
- Analytics test.
- Assessment path test.
- Search Console and sitemap prep.
- Redirect test.
- 404 page.
- `www` and non-`www` behavior.
- Backup old WordPress site before DNS changes or major content cleanup.

Deliverable:

- Launch-ready site.

### Phase 7: DNS Launch

Estimated time: 1 day.

Tasks:

- Lower DNS TTL before launch if possible.
- Point `fruitfulpin.com` and `www.fruitfulpin.com` to the new host.
- Verify SSL.
- Verify redirects.
- Submit sitemap.
- Monitor analytics and Search Console.

Deliverable:

- New Fruitful Pin site live.

### Phase 8: Post-Launch Monitoring

Estimated time: 1-2 weeks of light monitoring.

Tasks:

- Watch indexing and Search Console.
- Fix missed redirects.
- Check form submissions and booking links.
- Review top landing pages.
- Compare speed and conversion behavior.
- Decide whether Fruitful Pin still needs A2/WordPress before the 2027 renewal window.

Deliverable:

- Stable post-launch site and hosting renewal decision.

## Timeline

Lean version:

- 1-2 weeks.
- Mostly same content, cleaner frontend, basic blog/service templates, analytics, redirects, and launch.

Recommended version:

- 2-4 weeks.
- Sharper homepage, services, blog architecture, case study/proof sections, SEO cleanup, assessment integration, and a tested editing workflow.

Advanced version:

- 4-6+ weeks.
- Adds deeper resource hub, multiple lead magnets, segmented funnels, more tooling/calculators, and A/B testing.

Recommended planning assumption:

- Use the 2-4 week version. The strategy and content are already defined, so the main work is controlled implementation, migration, QA, and launch.

## Cost Direction

Do not include Kadence in the future cost comparison because Susy does not plan to keep using it.

Current future setup if staying on A2 after prepaid period:

- A2 hosting renewal: about `$600` over 3 years.
- Kadence: `$0`.
- WordPress: `$0`.
- Paid plugins: assumed `$0`.
- Approximate 3-year cost: `$600`.

Cloudflare-based Next.js setup:

- Cloudflare Pages: potentially `$0`.
- Cloudflare Workers Paid if needed: about `$5/month`, or `$180` over 3 years.
- CMS in B1: none; content is code-managed in the Next.js app.
- A2 in B1: `$0` incremental cost until 2027 because it is prepaid, but Fruitful Pin should avoid depending on it if content/media are migrated.
- A2 later: `$0` only after WordPress is no longer needed for archives, other sites, or any reopened CMS workflow.
- Kadence: `$0`.
- Approximate post-A2 3-year cost after CMS replacement: `$0-$180`, excluding domain/email and any optional CMS upgrades.

Vercel fallback:

- Vercel Pro: about `$20/month`, or `$720` over 3 years.
- This is likely more expensive than renewing A2, but may be operationally smoother for Next.js.
- Use only if the implementation benefits justify the extra cost.

## Decision Recommendation

Proceed with a controlled Fruitful Pin-only migration if Susy and Stepan want better speed, conversion control, assessment integration, and AI-assisted maintainability.

Recommended path:

1. Keep current A2/WordPress site live.
2. Build new Next.js site privately.
3. Prefer Cloudflare hosting for cost.
4. Use code-managed content for B1; migrate approved posts/media into `apps/fruitful-pin`.
5. Preserve and redirect SEO-relevant URLs.
6. Launch by DNS switch only after preview approval.
7. Revisit CMS needs before the 2027 A2 renewal window.
8. Cancel A2 only after Fruitful Pin no longer needs WordPress for source/archive or another explicit workflow.
