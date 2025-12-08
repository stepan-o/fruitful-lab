0. Context + Guardrails

Audience:

Founders / marketing leads at baby, family, lifestyle, CPG brands.

Some sophisticated creators with budget.
They’re busy, slightly suspicious of “Pinterest fluff”, and need to see:

“These people know data, paid + organic, and can handle complexity so I don’t have to.”

Non-negotiables:

No login required anywhere on this page.

Looks and behaves like an app, not a brochure.

One primary CTA: “Book a Call” (or “Talk to a Strategist”) always present.

Sub-CTA: “Explore the Knowledge Hub” (Layer 2 teaser – even if 90% is “coming soon”).

1. Global Frame (Layout, Header, Footer)
   1.1 Layout

app/(public)/layout.tsx wraps all public pages.

Things that live here:

Top nav (with responsive behavior).

Global fonts, container widths, background color.

Global Toaster / notifications if we use any later (e.g., form submit success).

Visually: wide but calm. Think: Pinterest’s clean whites + your raspberry accent, not dribbble gradient hell.

1.2 Header / Nav

Desktop:

Left: Fruitful Lab logo (wordmark).

Center/right nav items:

“Services”

“Case Studies”

“Resources”

“About”

Far right:

Primary CTA button: Book a Call

Secondary text link: Login (this goes to /login → Layer 2/3)

Mobile:

Logo + hamburger.

Slide-over panel with the same nav + CTA at the bottom.

Behavior:

Sticky on scroll, but:

Initial state: solid background, subtle drop shadow.

On scroll: shrink height slightly, keep CTA visible.

CTA style: high contrast, not massive. Looks like something a CMO wouldn’t be embarrassed to click.

2. Million-Dollar Home / Landing (Layer 1)

Route: / (public home)

2.1 Hero: “We Turn Pinterest Into a Revenue Channel”

Goals:

In 3 seconds:

Who you are.

What you do.

For whom.

What outcome.

Content:

Compact eyebrow:

Pinterest Strategy · Baby & Family · CPG · Lifestyle

H1 (example direction):

Pinterest that actually moves your revenue, not just your impressions.

Subcopy:

Fruitful Lab is a full-funnel Pinterest studio for baby, family, and specialty brands. We blend search-driven content, performance ads, and AI-powered analysis to turn saves into sales.

Primary hero CTA:

[Book a Call] (same as nav, large)

Secondary CTA (ghost button / link):

[See What We’ve Done for Brands Like Yours] → scrolls to case studies section.

Right side / visual:

Not a generic stock image.

Concept: “Pinterest journey as a dashboard card stack”:

Minimal fake UI with tiles: Impressions → Clicks → Leads → Revenue.

One tile hints at AI features (“AI Playbook Insights” badge).

Subtle animation:

On load: tiles slide up / fade, tiny metric counters tick up once.

No infinite motion. It should feel “product-y” and stable.

2.2 “Who We’re For” Strip

Quick segmentation so visitors self-identify (and you pre-qualify):

Three cards:

Baby & Family Brands

One line: “DTC brands selling baby gear, nursery decor, feeding, or gifts.”

CPG & Specialty Food

“Organic, premium, and ‘better-for-you’ brands planning seasonal campaigns.”

Established Creators & Educators

“Creators with proven offers who want predictable Pinterest growth, not experiments.”

Each card has a small “What we usually optimize:” list (Traffic / Email signups / ROAS).

2.3 “What We Actually Do” (Services Snapshot)

Not a full services page yet, but enough clarity.

Three columns:

Organic Pinterest Growth

Bullet list:

Account & board architecture

SEO-driven content plan

Pin design & publishing workflows

Microcopy: “For brands ready to turn Pinterest into a steady traffic channel.”

Pinterest Ads Engine

Bullet list:

Full-funnel campaign strategy

Creative testing & audience refinement

Conversion tracking & reporting

Microcopy: “For brands with ad budgets who want more efficient acquisition.”

Full-Funnel + AI Insights

Bullet list:

Combining organic + ads

Funnel diagnostics

AI-assisted insight reports (Pinterest + site behavior)

Microcopy: “For teams who want ‘what should we do next?’ answered for them.”

At the bottom: micro CTA:

Not sure which one you need? Book a 15-minute fit check → (same call booking link).

2.4 “Proof, Not Vibes” (Case Study Highlight)

This is critical for the million-dollar feeling.

Layout: 2–3 case tiles, with one hero case.

Hero case: Mimi’s Organic Eats / Paulina on the Road / Laundry Moms style.

Badge: “Food Blog · Organic · North America”

Result headline:

From 69 to 3,000+ monthly visitors from Pinterest in 6 months.

Mini-metrics:

+X% outbound clicks

+Y% saves

Traffic chart preview image (static PNG or tasteful line chart, not a live thing yet).

Below: [View full case study] → route reserved, can be a simple static page initially.

Two smaller side cards:

Baby brand / CPG brand:

“X% increase in Pinterest-driven sales”

“Launched with Pinterest as a primary discovery channel”
If some are anonymized, label as “Premium CPG Client (NDA)”.

2.5 “How Working With Fruitful Lab Actually Feels”

You’re selling relief and competence, not pins.

Timeline style:

01 – Discovery & Pinterest Potential Scan

“We analyze your niche, search demand, and existing Pinterest footprint.”

02 – Strategy & Funnel Map

“We design how Pinterest plugs into your funnel: content, ads, and email list growth.”

03 – Implementation & Creative

“We handle the boards, creatives, ad setup, and ongoing optimization.”

04 – Reporting & Decisions

“You get clear dashboards and ‘here’s what we’ll do next’ insights.”

Small note:

You meet monthly with the same strategist (not a rotating account manager).

2.6 “Why Fruitful Lab vs. Another Pinterest Person?”

A single section doing positioning work.

Left column: “Most Pinterest Management”

“Focuses on vanity metrics (impressions, saves)”

“Static monthly reports”

“Limited support outside pin scheduling”

Right column: “Fruitful Lab”

“Full-funnel view across your Pinterest, site, and email”

“Organic + ads under one roof”

“AI-assisted insight reports and scenario planning”

“Strategy partner, not just ‘the Pinterest person’”

This is where you subtly talk about the Lab and AI without making it sci-fi.

2.7 “Knowledge Hub (Future Layer 2 Teaser)”

This is the first explicit bridge to Layer 2.

Layout:

Title: Fruitful Lab Knowledge Hub (coming soon)

Copy:

A curated library of Pinterest playbooks, templates, and experiments for brands who want to understand the “why” behind the strategy.

Three future modules (even if not built yet):

“Quarterly Pinterest Playbooks”

“Campaign Blueprints for Baby & Family Brands”

“Benchmarks & AI-Generated Insights”

CTA:

For now: [Get early access updates] → simple email form (no login).

Later: this becomes “Login to Knowledge Hub” for non-admin users.

2.8 Social Proof & Trust

Row including:

Logos of brands (or “As seen on / clients include” as allowed).

2–3 quote blocks:

Example:

“I had no idea Pinterest could be this strategic. Susy made the data, strategy, and creative all work together.”
— Client Name, Role, Brand

Keep this section restrained, visually: muted background, nice typography.

2.9 Final CTA / Footer

Final section before the footer:

Headline:

Ready to make Pinterest part of your growth engine?

Subtext:

Tell us about your brand, timing, and goals. We’ll map whether Pinterest fits and what it would take.

Button: [Book a Call] (same as everywhere else).

Footer:

Left: Logo + one-liner: “Pinterest marketing studio for baby, family, and specialty brands.”

Center/right:

Links: Services · Case Studies · Resources · About · Privacy · Terms

Social links (LinkedIn, Pinterest, maybe Threads).

Tiny text: “Powered by Fruitful Lab · Built on React & Next.js” (soft flex).

3. “Flair, but Not Dumb Flair”

Places where the app-ness quietly shows:

Soft scroll snapping / section anchors

Clicking nav items scrolls smoothly to sections (hero, services, case studies, etc.).

URL updates with hashes (#services, #proof) for shareability.

Micro-interactions

Cards lift slightly on hover, subtle shadow.

Metric numbers count up once as they come into view (IntersectionObserver).

Case study chart has a small “hover to highlight” effect, nothing wild.

Performance & polish

Images optimized via Next Image.

Layout stable (no CLS jank).

Mobile experience considered first: all sections stack gracefully.

Security boundary visibly clear

Public page never calls protected stats endpoint.

“Login” and “Dashboard” language clearly separated.

No accidental hints of internal URLs or dev debug.

4. How This Ties to Layers 2 & 3

Even though we’re only building Layer 1 now, the million-dollar spec keeps hooks:

Login link in header points to /login → where non-admin / admin login begins.

Knowledge Hub teaser sets expectation that:

Non-admin users will have somewhere meaningful to go later.

Copy about AI and Lab already justifies the existence of Layer 3:

“AI-assisted insight reports”

“Lab console” as something real for internal operations (no need to show UI yet).