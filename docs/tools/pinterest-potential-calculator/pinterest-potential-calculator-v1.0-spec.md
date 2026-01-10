# Pinterest Potential Calculator vNext (Generalized) — Full Product + Tech Spec (v0.2 Locked)

**Owner:** Susy / Fruitful  
**Implementation:** Stepan (Fruitful Tech Hub)  
**Status:** Locked for build (v0.2)  
**Platform:** Mobile-first React frontend inside existing Fruitful Tech Hub  
**Primary Objective:** Broaden the calculator beyond baby/family so paid campaigns can capture a wider audience and drive **booked consult calls**.

## 1) Goals, KPIs, and Principles

### Goals
1. Generalize calculator to support **3 business types** + **segment-specific niches**
2. Keep flow **short (≤ 8 questions)** and optimized for mobile completion
3. Output **minimal-but-impactful** results (3 cards) + single CTA (book call)
4. Make UI feel **dynamic and engaging** (but lightweight)
5. Keep logic **config-driven** (easy to expand niches, edit benchmarks, tune multipliers)
6. Add **inferred logic** for **seasonality** and **competitiveness** (not asked)

### KPIs
- Primary: `ppc_complete` (results viewed / completion rate)
- Secondary: `ppc_cta_click` (book consult clicks)
- Support: drop-off by question, segment, niche, A/B variant

### Principles
- Mobile-first, thumb-friendly tap targets (≥44px)
- Avoid “self-rating” questions that users can’t assess; use **descriptive choices**
- Use **ranges** (avoid fake precision)
- React UI dynamics should be **SVG + CSS-first**, no heavy libraries required

## 2) A/B Test: Start Experience

### Variants
- **Variant A (welcome):** Welcome → Start → Q1
- **Variant B (no welcome):** Directly to Q1

### Welcome Screen Content (Variant A)
- Headline: “See your Pinterest growth potential in 60 seconds”
- Subhead: “Answer a few questions. Get your audience + opportunity snapshot.”
- Badge/pill: “8 questions • ~60 seconds”
- CTA: “Start”

### Dynamic UI suggestions (Welcome)
- Subtle CSS shimmer/underline animation on headline
- Small lightweight SVG hero (pins floating into a chart icon)
- Tap feedback on CTA button

### Events
- `ppc_view_start` (welcome viewed OR Q1 viewed for no-welcome)
- `ppc_start` (Start clicked OR first interaction on Q1)

## 3) Data Inputs: Segmentation + Questions (8 Total)

### Q1 — Business type (required)
**Prompt:** “Which best describes your business?”  
**Options:**
1) Primarily a **Content Creator**
2) Primarily a **Product Seller**
3) Primarily a **Service Provider**

**Store:**
- `segment = content_creator | product_seller | service_provider`

**Dynamic UI**
- 3 large tappable cards with SVG icons + one-line descriptor:
    - Creator → “Traffic / Subscribers”
    - Seller → “Sales”
    - Service → “Leads”
- Selection highlight + haptic (optional)

**Tracking**
- `ppc_answer` (Q1)

### Q2 — Niche (dynamic based on Q1)
**Prompt:** “What’s your primary niche?”  
**Goal:** 6–10 options + `Other` (not exhaustive)

#### If `segment = content_creator`
- Food & Recipes (`food`)
- Travel (`travel`)
- Home & DIY (`home_diy`)
- Lifestyle & Inspiration (`lifestyle`)
- Personal Finance (`finance`)
- Health & Wellness (`wellness`)
- Parenting & Family (`parenting`)
- Beauty & Fashion (`beauty_fashion`)
- Crafts & Hobbies (`crafts`)
- Other (`other`)

#### If `segment = product_seller`
- Baby & Family Products (`baby_family`)
- Home & Decor (`home_decor`)
- Beauty & Skincare (`beauty`)
- Fashion & Accessories (`fashion`)
- Health & Wellness (`wellness`)
- Food & Beverage (CPG) (`food_bev`)
- Crafts & Digital Products (`digital_crafts`)
- Pets (`pets`)
- Travel Gear & Accessories (`travel_gear`)
- Other (`other`)

#### If `segment = service_provider`
- Marketing / Creative Agency (`agency`)
- Coach / Consultant (`coach`)
- Designer (interior/graphic/web) (`designer`)
- Photographer / Videographer (`photo_video`)
- Wellness Practitioner (`wellness_practitioner`)
- Finance / Accounting / Bookkeeping (`finance`)
- Real Estate / Home Services (`real_estate_home`)
- Educator / Course Creator (`educator`)
- Event / Wedding Services (`events`)
- Other (`other`)

**Store:**
- `niche = <slug>`

**Dynamic UI**
- Chip-style picker (tap-to-select)
- “More” opens bottom sheet (mobile-friendly)
- After selection show a tiny **non-numeric** preview meter:
    - “Typical Pinterest audience size: Focused / Medium / Broad”

**Tracking**
- `ppc_answer` (Q2)

## 4) Questions Q3 – Q8 (Shared structure + segment-specific copy)

### Global UI (applies Q3–Q8)
- Sticky progress bar: “Step X of 8”
- Auto-advance after selection (configurable, ~250–400ms)
- Back chevron (internal state, not browser back)
- Helper microcopy: “Pick the closest match”

### Q3 — Monthly output volume (all segments; copy varies)
**Options:** `0–2 | 3–5 | 6–10 | 11–20 | 20+`  
**Store:** `volume_bucket`

**Segment copy examples**
- Creator: “How many pieces of content do you publish per month?”
- Seller: “How many promos/new arrivals/collections do you run per month?”
- Service: “How often do you publish marketing content per month?”

**Dynamic UI**
- Discrete segmented control (slider-like)
- Tiny sparkline icon grows with higher volume

**Tracking**
- `ppc_answer` (Q3)

### Q4 — Visual asset readiness (all segments)
**Prompt:** “How strong is your visual content library right now?”  
**Options:** `Limited | Decent | Strong | Very strong`  
**Store:** `visual_strength`

**Dynamic UI**
- 4 cards with mini grid SVG (1 tile → 4 tiles), “snap-in” animation

**Tracking**
- `ppc_answer` (Q4)

### Q5 — Website experience (clarity + speed) (all segments) ✅
**Prompt:** “Which best describes your website right now?”  
**Options:**
- **A** “It’s slow / confusing on mobile (unclear what to click).”
- **B** “It’s okay, but could be clearer (CTA exists, not super obvious).”
- **C** “It’s solid (loads fairly fast + clear CTA above the fold).”
- **D** “It’s optimized (fast, clear CTA, and I’ve tested/improved it).”

**Store:**
- `site_experience = a | b | c | d`

**Helper line (small)**
- “On mobile, can someone tell what to do in 5 seconds?”

**Dynamic UI**
- Mini phone-frame SVG changes per selection (spinner → clear CTA → check)

**Tracking**
- `ppc_answer` (Q5)

### Q6 — Offer clarity (segment-specific copy)
**Options:** `No | Somewhat | Yes`  
**Store:** `offer_clarity`

**Segment prompts**
- Creator: “Do you have a clear lead magnet or newsletter offer?”
- Seller: “Do you have a hero product / best-seller to push?”
- Service: “Do you have a clear offer + booking flow?”

**Dynamic UI**
- Fill-meter icon (empty → half → full + check)

**Tracking**
- `ppc_answer` (Q6)

### Q7 — Primary goal from Pinterest (segment-specific options)
**Store:** `primary_goal`

**Creator goals**
- Traffic
- Email subscribers
- Affiliate revenue
- Course/product sales

**Seller goals**
- Sales
- Email subscribers
- Retargeting pool
- New customer discovery

**Service goals**
- Leads/calls
- Email subscribers
- Webinar signups
- Authority/visibility

**Dynamic UI**
- 2×2 grid buttons (thumb-friendly)
- On select, show “We’ll prioritize: [goal]” preview line

**Tracking**
- `ppc_answer` (Q7)

### Q8 — Organic vs Ads posture (all segments)
**Prompt:** “Are you planning to use Pinterest ads, or organic only?”  
**Options:**
- Organic only
- Maybe later
- Yes (ads)

**Store:**
- `growth_mode = organic | later | ads`

**Dynamic UI**
- 3-state toggle selector
- Optional tiny rocket icon appears on Ads

**Tracking**
- `ppc_answer` (Q8)

## 5) Results Page (Minimal + High Impact)

### Structure (3 stacked cards on mobile)

#### Card 1 — Potential Pinterest Audience (always)
- Big range number: `X–Y`
- Lightweight SVG meter: Focused → Broad

#### Card 2 — Primary opportunity metric (segment-based)
- Product Seller → **Estimated monthly revenue potential**
- Service Provider → **Estimated monthly leads**
- Content Creator → **Estimated monthly website sessions**
- Visual: tiny SVG chart (3 bars: low/mid/high OR line with 3 dots)

#### Card 3 — Household income (always)
- Range + label: “$75k–$125k (above average)”
- Income band chips (Low/Mid/High) with highlight

### Optional “Insight” line (recommended; short)
Under the cards (or under Card 2):

- Example: “Insight: This niche is **highly seasonal** and **highly competitive**—plan content early.”

**Rules**
- Max 1–2 lines
- Not negative; framed as planning advantage
- Powered by inferred indices (seasonality + competition)

### CTA (single)
- Button: “Book a free consult to unpack your results”
- Subtext: “We’ll translate this into a plan for your brand.”

### Dynamic reveal
- Stagger card slide-up (100–150ms)
- Subtle number count-up (≤600ms)
- Micro loading state 300–500ms: “Crunching your Pinterest potential…”

### Events
- `ppc_complete` (results viewed)
- `ppc_cta_click` (CTA clicked)

## 6) Analytics / Telemetry Requirements

### Events (must-have)
- `ppc_view_start` (welcome or Q1)
- `ppc_start` (start click or first Q1 interaction)
- `ppc_answer` (question_id, answer_id)
- `ppc_complete` (segment, niche, primary_goal, variant, inferred indices)
- `ppc_cta_click`

### Optional but useful
- `ppc_back` (question_id)
- `ppc_dropoff` (last_question_id on unload if feasible)

### Dimensions to include in `ppc_complete`
- `variant = welcome | no_welcome`
- `segment`
- `niche`
- `primary_goal`
- `seasonality_index`
- `competition_index`

## 7) Core Computation Model (Config-driven)

### Outputs (always ranges)
- `audience_size_est` (low/high)
- `opportunity_est` (low/high; depends on segment)
- `income_est` (low/high or index)

### Input sources
1) Benchmark row keyed by `segment + niche`
2) Multipliers derived from Q3–Q8 answers
3) **Inferred indices** derived from `segment + niche`:
    - `seasonality_index`
    - `competition_index`
4) Optional micro-adjust based on `primary_goal` (tiny)

### Important: Avoid false precision
- Use small multipliers; keep effect subtle (±10–15% max)
- Return ranges only; no single “exact” number

## 8) Inferred Logic (Not Asked): Seasonality + Competitiveness

### Inferred variables
- `seasonality_index = low | medium | high`
- `competition_index = low | medium | high`

### Source of truth
- Stored on each benchmark row (`segment + niche`) in config (no user question)

### How it affects results
Add multiplier layers:
- `seasonality_multiplier`
- `competition_multiplier`

**Suggested defaults (tunable)**
- `seasonality`: low `1.05`, medium `1.00`, high `0.92`
- `competition`: low `1.05`, medium `1.00`, high `0.90`

**Suggested application**
- Apply both to `opportunity_est` (always)
- Optionally apply a very light competition modifier to audience (optional; keep tiny)

### User-facing optional insight (recommended)
- 1–2 lines derived from indices (planning advantage framing)

### Store for future email sequencing (not built now)
- `seasonality_index`, `competition_index`
- Optional `inferred.notes` and `inferred.tags` (see schema)

## 9) Config Schema (Suggested)

### Benchmarks table (per segment + niche)
Each entry includes:
- `segment`
- `niche`
- `audience_base.low/high`
- `income.low/high` OR `income_index`
- `opportunity.type` + `opportunity.low/high`
- `inferred.seasonality`
- `inferred.competition`
- Optional: `inferred.notes` + `inferred.tags`

#### Example benchmark row
```json
{
  "segment": "content_creator",
  "niche": "travel",
  "audience_base": { "low": 7000000, "high": 22000000 },
  "income": { "low": 65000, "high": 120000 },
  "opportunity": { "type": "traffic", "low": 4000, "high": 18000 },
  "inferred": {
    "seasonality": "high",
    "competition": "high",
    "notes": {
      "seasonality": "Planning spikes around holidays and peak travel seasons.",
      "competition": "High saturation—strong angles + SEO matter."
    },
    "tags": ["seasonal", "competitive"]
  }
}
```

### Multipliers config
```json
{
  "volume_bucket": { "0-2": 0.7, "3-5": 0.9, "6-10": 1.0, "11-20": 1.15, "20+": 1.3 },
  "visual_strength": { "limited": 0.8, "decent": 0.95, "strong": 1.1, "very_strong": 1.2 },
  "site_experience": { "a": 0.75, "b": 0.9, "c": 1.05, "d": 1.15 },
  "offer_clarity": { "no": 0.85, "somewhat": 0.95, "yes": 1.1 },
  "growth_mode": { "organic": 1.0, "later": 1.05, "ads": 1.12 },

  "seasonality": { "low": 1.05, "medium": 1.0, "high": 0.92 },
  "competition": { "low": 1.05, "medium": 1.0, "high": 0.90 }
}
```

### Optional micro-adjust by goal (keep tiny)
(Example idea; optional for v0.2)

- Seller:
  - `discovery` → `+3%` (top-of-funnel tends to be easier)
  - `sales` → `-3%` (harder conversion)
- Service:
  - `authority` → `+3%`
  - `leads/calls` → `-3%`

> Keep this small so it never dominates. Can be added later if needed.

## 10) UI/Frontend Dynamics (Lightweight, React-friendly)

### Must-have “dynamic wins” (v0.2 baseline)
1) Sticky progress bar + step counter
2) Card/chip selectors (Q1/Q2) + bottom sheet for “More”
3) Results: SVG meters + stagger reveal + subtle count-up

### Recommended approach
- Prefer **inline SVG** over images
- Avoid heavy chart libs; build micro charts with SVG
- CSS transitions (Framer Motion optional; keep minimal)
- Keep copy short; avoid blocks of text

## 11) Deliverables / Build Checklist

### Functional
- [ ] A/B test: welcome vs no-welcome
- [ ] Q1 segment selection drives Q2 niche list
- [ ] 8 total questions (Q1–Q8)
- [ ] Config-driven benchmark/multiplier system
- [ ] Inferred seasonality + competition included in computation
- [ ] Results page: 3 cards + single CTA
- [ ] Store inferred indices + optional insight note in results payload

### Analytics
- [ ] Track required events
- [ ] Include `segment/niche/variant/goal + inferred indices` in `ppc_complete`

### UI
- [ ] Mobile-friendly tap targets
- [ ] Progress indicator
- [ ] Lightweight SVG visuals per key screen
- [ ] Results reveal animations

## 12) Acceptance Criteria (Final)

1) Supports **3 segments** and segment-specific **niche selection**  
2) Total questions **≤ 8**  
3) Results page shows **3 stacked cards** + **single CTA**  
4) Welcome A/B test exists and is trackable  
5) Tracking events implemented: view/start/answer/complete/CTA  
6) Benchmarks + multipliers are **config-driven** (no hard-coded baby-only logic)  
7) Each benchmark row includes `seasonality` and `competition` indices  
8) Opportunity estimates incorporate seasonality + competition multipliers (subtle)  
9) Results payload includes inferred indices and optional insight note  