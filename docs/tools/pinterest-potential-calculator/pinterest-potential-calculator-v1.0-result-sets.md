# Pinterest Potential Calculator — Result Sets

**All 3 segments have their own goal set (Q7)**, and the results structure needs to be **goal-keyed for every segment**.

Below is the revised proposal: **Result 1–3 are consistent across all segments**, and **Result 3 always matches the segment’s selected goal** (with the special case: content_creator + `traffic` shows email subs for Result 3 so it’s not blank).

---

## Proposed ResultsBundle v1.2

### 1) Demand (shared, non-duplicated)

`results.demand` (same concepts as today)

* `demand_base_sessions_est: Range` ✅ **Result 1**
* `distribution_capacity_m: number`
* `conversion_readiness_m: number`
* `likely_pinterest_sessions_est: Range` (still computed; becomes the canonical source for “website sessions from Pinterest”)

---

### 2) Traffic (shared, non-duplicated)

`results.traffic`

* `website_sessions_est: Range`
  **= demand.likely_pinterest_sessions_est** ✅ **default Result 2**
* `purchase_intent_sessions_est?: Range`
  Present when relevant (at minimum: `segment === product_seller`)
  Used as **Result 2** when it’s the right “traffic lens” (see Result 2 rule below)

This removes the need for `segment_outcome.monthly_pinterest_sessions_est` entirely.

---

### 3) Segment outcome (goal-driven for ALL segments)

Replace current `SegmentOutcome` with **goal-keyed variants for all segments**:

`results.segment_outcome: SegmentOutcomeV2`

Each segment variant includes:

* `kind: "content_creator" | "product_seller" | "service_provider"`
* `goal_key: GoalKey` (still `${Q1}:${Q7}`)
* `primary_goal: PrimaryGoal` (the Q7 slug)
* `goal_outcome: <segment-specific goal outcome union>`
* `assumptions: ...` (goal-specific explainability)

✅ **No more duplicate sessions fields inside segment_outcome.**
Segment outcomes only hold *goal outcomes* (Result 3) + explainability.

---

## Result 1–3 wiring rules

### Result 1 (ALL segments)

* **Always**: `results.demand.demand_base_sessions_est`
  (“General niche demand on Pinterest”)

### Result 2 (ALL segments, goal-aware traffic lens)

* Default: `results.traffic.website_sessions_est`
  (“Website sessions you can get from Pinterest”)
* Product seller + goal `sales`: use `results.traffic.purchase_intent_sessions_est`
  (“High-intent sessions to product pages”)

(You can extend this later with other lenses if needed, but this is the minimal clean rule.)

### Result 3 (ALL segments, must match selected goal)

* Always comes from `results.segment_outcome.goal_outcome` and is goal-specific.

---

## Goal outcomes by segment (Result 3)

### A) Content creator goals (Q7 options shown in UI)

`traffic | email_subscribers | affiliate_revenue | course_product_sales`

`ContentCreatorGoalOutcomeV2` (key point: no blank)

* `traffic` → **Result 3 shows email subscribers** (explicitly modeled for this goal)

    * `monthly_email_subscribers_est: Range`
    * `note: "Traffic is Result 2; Result 3 shows list growth potential."` (or a boolean flag)
* `email_subscribers`

    * `monthly_email_subscribers_est: Range`
* `affiliate_revenue`

    * `monthly_affiliate_revenue_usd_est: Range`
* `course_product_sales`

    * `monthly_course_intent_sessions_est: Range`
    * `revenue_by_course_price_est: Record<CoursePriceBucket, Range>`

### B) Product seller goals

`sales | email_subscribers | retargeting_pool | new_customer_discovery`

`ProductSellerGoalOutcomeV2`

* `sales`

    * `revenue_by_aov_est: Record<AovBucket, Range>` (same math you already have)
* `email_subscribers`

    * `monthly_email_subscribers_est: Range` (opt-in model, goal-keyed)
* `retargeting_pool`

    * `monthly_retargetable_visitors_est: Range` (requires a configured rate/share model)
* `new_customer_discovery`

    * `monthly_new_to_brand_sessions_est: Range` (requires a configured share model)

### C) Service provider goals

`leads_calls | email_subscribers | webinar_signups | authority_visibility`

`ServiceProviderGoalOutcomeV2`

* `leads_calls`

    * `monthly_discovery_calls_est: Range` (your existing model)
* `email_subscribers`

    * `monthly_email_subscribers_est: Range`
* `webinar_signups`

    * `monthly_webinar_signups_est: Range` (configured signup rate model)
* `authority_visibility`

    * `monthly_visibility_reach_est: Range` (configured “reach per session” or “visibility actions” model)

---

## What this fixes vs current compute.ts

1. **Sessions duplication goes away**

* Remove:

    * `segment_outcome.monthly_pinterest_sessions_est` (content_creator + product_seller)
    * `segment_outcome.monthly_purchase_intent_sessions_est` (move to `results.traffic`)

2. **Q7 goal selection becomes real for product_seller + service_provider**

* Today: Q7 is ignored for those segments.
* Proposed: every segment uses `${Q1}:${Q7}` to select an outcome model, like content creators do now.

3. **Result 3 always exists and matches the goal**

* Including explicit special handling for `content_creator:traffic` (Result 3 becomes email subs by design, not a blank).
