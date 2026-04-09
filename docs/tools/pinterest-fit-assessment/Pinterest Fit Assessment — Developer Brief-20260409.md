# Revised Brief

# Pinterest Fit Assessment — Developer Brief for Stepan
## Purpose
This brief outlines the changes needed to turn the current broader Pinterest potential tool into a tighter **Pinterest Fit Assessment** for **product-based brands**.
The goal of this version is to:
*   quickly assess whether Pinterest is worth exploring for a product-based brand
*   give a clear outcome
*   surface the top reasons behind that outcome
*   move the right leads toward a **Fit Call**
This is a **rework of the existing React build**, not a rebuild.
* * *
## Key strategic change
We are narrowing the tool from a broader multi-audience Pinterest tool into a **brand-specific assessment**.
### Old direction
*   multiple audience types inside one tool
*   creator / product seller / service provider branching
*   “Pinterest Potential Calculator” framing
*   modeled ranges / potential-style outputs
### New direction
*   product-based brands only
*   no internal audience branching for this version
*   “Pinterest Fit Assessment” framing
*   fit / readiness / role-based results
*   CTA = **Book a Fit Call**
* * *
## Important implementation note
Because this version will initially be promoted through **targeted outreach to chosen product brands**, we should **remove the pre-screen question from the main flow** for now.
### Reason
If traffic is intentionally sent only to product brands, the pre-screen adds unnecessary friction and makes the tool longer.
### Recommendation
*   remove pre-screen from the main V1 experience
*   keep the code modular enough that a pre-screen can be reintroduced later if this becomes a public tool
* * *
# Final V1 flow
## Screen order
1. Intro screen
2. Q1 Category fit
3. Q2 Product/collection proof
4. Q3 Content asset strength
5. Q4 Website readiness
6. Q5 Primary desired outcome from Pinterest
7. Q6 Readiness to invest in expert support
8. Q7 Openness to paid Pinterest ads
9. Result screen
No creator path.
No service-provider path.
No pre-screen in this outreach-first version.
* * *
# Global changes
## Remove
*   creator / service provider / product seller selector
*   all branching logic tied to audience type
*   all creator-specific or service-specific questions
*   “Pinterest Potential Calculator” wording
*   “growth snapshot” / modeled traffic / revenue emphasis
*   broad multi-audience positioning
## Replace with
*   **Pinterest Fit Assessment** naming
*   product-brand-only framing
*   fixed 7-question flow
*   results focused on fit, readiness, and likely Pinterest role
*   fit-call CTA
* * *
# Screen-by-screen spec
## 1) Intro screen
### Purpose
Frame the tool clearly and set expectations.
### Copy
**Title**
Is Pinterest Actually a Fit for Your Brand?
**Subtitle**
Take this short assessment to see whether Pinterest makes sense for your brand, what role it could play, and whether it’s worth exploring further.
**Support line**
Built for product-based brands.
**Primary button**
Start the Assessment
**Small note**
Takes about 2 minutes.
### Notes
*   Keep this screen clean and short.
*   No extra explanation needed.
*   No audience selector here.
* * *
## 2) Q1 — Category fit
### Question
Which category best fits your brand?
### Options + score
*   Home & Decor = 4
*   DIY / Home Improvement = 4
*   Beauty & Skincare = 4
*   Food & Beverage / CPG = 4
*   Baby & Family Products = 4
*   Fashion & Accessories = 3
*   Gifts / Stationery / Party = 3
*   Jewelry / Handmade Goods = 3
*   Health / Wellness Products = 2
*   Other = 1
### Stored fields
*   `q1_category_fit`
* * *
## 3) Q2 — Product/collection proof
### Question
How proven is the product or collection you’d want Pinterest to support?
### Options + score
*   Very proven — it already sells and we know people want it = 4
*   Somewhat proven — we’ve seen traction, but it’s not a standout yet = 3
*   Early — it’s live, but still pretty new or untested = 1
*   Not proven yet — we’re still figuring out what will land best = 0
### Stored fields
*   `q2_offer_proven`
* * *
## 4) Q3 — Content assets
### Question
How strong are your content assets right now — both visual and educational?
### Options + score
*   Strong — we have plenty of product/lifestyle visuals and helpful content like blogs, guides, tutorials, or emails = 4
*   Decent — we have enough visuals and some supporting content, but there are gaps = 3
*   Limited — we have a few usable visuals or some content, but not enough depth yet = 1
*   Weak — we’d need to build most of this first = 0
### Stored fields
*   `q3_assets`
* * *
## 5) Q4 — Website readiness
### Question
If Pinterest started sending people to your website, how ready would it feel?
### Options + score
*   Ready — clear, credible, easy to shop = 4
*   Mostly ready — solid overall, with a few gaps = 3
*   Somewhat ready — workable, but not very polished = 1
*   Not ready — confusing, weak, or not conversion-friendly = 0
### Stored fields
*   `q4_website`
* * *
## 6) Q5 — Desired outcome
### Question
What would you want to get out of Pinterest the most?
### Options + score/type
*   Get the brand in front of new people = score 3 / type `discovery`
*   Drive traffic to product or collection pages = score 3 / type `traffic`
*   Support launches, seasonal pushes, or promotions = score 3 / type `launches`
*   Build a warm audience we can retarget later = score 3 / type `retargeting`
*   Help drive sales sooner rather than later = score 2 / type `sales`
### Stored fields
*   `q5_goal_fit`
*   `q5_goal_type`
* * *
## 7) Q6 — Readiness to invest in expert support
### Question
How ready are you to invest in expert Pinterest support if it looks like a fit?
### Options + score
*   Ready now = 3
*   Open, but we’d want to start lean = 2
*   Maybe later = 1
*   Just exploring = 0
### Stored fields
*   `q6_support_readiness`
* * *
## 8) Q7 — Openness to ads
### Question
How open are you to using paid Pinterest ads if they make strategic sense for your brand?
### Options + score
*   Very open — we’d consider ads as part of the strategy = 3
*   Somewhat open — maybe later, once the foundation is there = 2
*   Unsure — we’d need to understand the case first = 1
*   Not open — we only want organic = 0
### Stored fields
*   `q7_ads_openness`
* * *
## 9) Result screen
### Result types
*   Strong fit
*   Possible fit
*   Not the right fit right now
### Result page should contain
1. outcome label
2. short intro paragraph
3. top 3 reasons
4. “Best role for Pinterest” block
5. CTA
### CTA labels
*   Strong fit → **Book a Fit Call**
*   Possible fit → **Book a Fit Call**
*   Not the right fit right now → **Still want to talk it through?**
### CTA subtext
**Strong fit**
Your brand looks like it could be a strong candidate for Pinterest. Let’s talk through what that could look like.
**Possible fit**
There may be real potential here, but it depends on a few strategic factors. A fit call can help clarify that.
**Not right now**
If you want a second opinion on whether Pinterest is worth exploring later, you can still reach out.
* * *
# Scoring logic
## Base total
`totalScore = q1 + q2 + q3 + q4 + q5 + q6 + q7`
### Max score
25
### Base outcome bands
*   18–25 = `strong_fit`
*   10–17 = `possible_fit`
*   0–9 = `not_right_now`
* * *
# Guardrail logic
Apply after base outcome.
## Guardrail A
If:
*   `q5_goal_type = sales`
*   `q6_support_readiness <= 1`
*   `q7_ads_openness <= 1`
Then:
*   if base outcome is `strong_fit`, downgrade to `possible_fit`
## Guardrail B
If:
*   `q3_assets = 0`
*   `q4_website = 0`
Then:
*   final outcome = `not_right_now`
## Guardrail C
If:
*   `q1_category_fit = 1`
*   `q2_offer_proven <= 1`
Then:
*   final outcome = `not_right_now`
* * *
# Reason selection logic
Show exactly **3 reasons**.
## Reason keys
### Category
*   `reason_category_strong`
*   `reason_category_good`
*   `reason_category_maybe`
*   `reason_category_weak`
### Offer
*   `reason_offer_proven`
*   `reason_offer_some_traction`
*   `reason_offer_early`
*   `reason_offer_unproven`
### Assets
*   `reason_assets_strong`
*   `reason_assets_decent`
*   `reason_assets_limited`
*   `reason_assets_weak`
### Website
*   `reason_site_ready`
*   `reason_site_solid`
*   `reason_site_friction`
*   `reason_site_not_ready`
### Goal
*   `reason_goal_discovery`
*   `reason_goal_traffic`
*   `reason_goal_launches`
*   `reason_goal_retargeting`
*   `reason_goal_sales_caution`
### Support readiness
*   `reason_support_ready`
*   `reason_support_open`
*   `reason_support_cautious`
*   `reason_support_not_committed`
### Ads openness
*   `reason_ads_open`
*   `reason_ads_later`
*   `reason_ads_unsure`
*   `reason_ads_not_open`
* * *
## Trigger rules
### Category
*   q1=4 → `reason_category_strong`
*   q1=3 → `reason_category_good`
*   q1=2 → `reason_category_maybe`
*   q1=1 → `reason_category_weak`
### Offer
*   q2=4 → `reason_offer_proven`
*   q2=3 → `reason_offer_some_traction`
*   q2=1 → `reason_offer_early`
*   q2=0 → `reason_offer_unproven`
### Assets
*   q3=4 → `reason_assets_strong`
*   q3=3 → `reason_assets_decent`
*   q3=1 → `reason_assets_limited`
*   q3=0 → `reason_assets_weak`
### Website
*   q4=4 → `reason_site_ready`
*   q4=3 → `reason_site_solid`
*   q4=1 → `reason_site_friction`
*   q4=0 → `reason_site_not_ready`
### Goal
*   discovery → `reason_goal_discovery`
*   traffic → `reason_goal_traffic`
*   launches → `reason_goal_launches`
*   retargeting → `reason_goal_retargeting`
*   sales → `reason_goal_sales_caution`
### Support readiness
*   q6=3 → `reason_support_ready`
*   q6=2 → `reason_support_open`
*   q6=1 → `reason_support_cautious`
*   q6=0 → `reason_support_not_committed`
### Ads openness
*   q7=3 → `reason_ads_open`
*   q7=2 → `reason_ads_later`
*   q7=1 → `reason_ads_unsure`
*   q7=0 → `reason_ads_not_open`
* * *
## Reason selection by outcome
Show exactly **3 reasons** in a fixed order.
### Deterministic priority lists
#### Positive priority order
1. category
2. offer
3. assets
4. website
5. support readiness
6. ads openness
7. goal
#### Blocker / caution priority order
1. website
2. assets
3. offer
4. support readiness
5. ads openness
6. category
7. goal
* * *
## Reason selection rules
### If final outcome = strong\_fit
Use exactly:
1. category reason
2. best foundation reason among offer / assets / website
3. best readiness / intent reason among support / ads / goal
#### Strong-fit tiebreakers
*   Foundation tiebreaker order: offer > assets > website
*   Readiness/intent tiebreaker order: support > ads > goal
* * *
### If final outcome = possible\_fit
Use exactly:
1. highest-priority positive reason from the positive priority list
2. next highest-priority positive reason from the positive priority list
3. highest-priority blocker/caution reason from the blocker/caution priority list
#### Positive eligibility
A reason counts as positive if:
*   category fit >= 3
*   offer >= 3
*   assets >= 3
*   website >= 3
*   support readiness >= 2
*   ads openness >= 2
*   goal type is discovery / traffic / launches / retargeting
#### Blocker / caution eligibility
A reason counts as blocker/caution if:
*   website <= 1
*   assets <= 1
*   offer <= 1
*   support readiness <= 1
*   ads openness <= 1
*   category fit <= 2
*   goal type = sales
If only one positive reason exists, fill the second slot with the highest-priority moderate reason using the same positive priority order.
* * *
### If final outcome = not\_right\_now
Use the top 3 reasons from the blocker/caution priority order.
Eligibility:
*   website <= 1
*   assets <= 1
*   offer <= 1
*   support readiness <= 1
*   ads openness <= 1
*   category fit <= 2
*   goal type = sales
If fewer than 3 blocker/caution reasons qualify, use the next-lowest scored signals until 3 reasons are filled.
* * *
# Best role for Pinterest logic
Assign exactly one role block.
## Role keys
*   `discovery_traffic`
*   `organic_first_ads_later`
*   `sales_with_ads_support`
*   `warm_audience_support`
*   `foundation_first`
*   `not_priority_yet`
## Role rules
### `not_priority_yet`
Use if:
*   `final outcome = not_right_now`
### `sales_with_ads_support`
Use if:
*   `q5_goal_type = sales`
*   `q2_offer_proven >= 3`
*   `q4_website >= 3`
*   `q7_ads_openness >= 2`
### `warm_audience_support`
Use if:
*   `q5_goal_type = retargeting`
*   `final outcome != not_right_now`
### `discovery_traffic`
Use if:
*   `q1_category_fit >= 3`
*   `q3_assets >= 3`
*   `q4_website >= 3`
*   `q5_goal_type in [discovery, traffic]`
### `organic_first_ads_later`
Use if:
*   `q1_category_fit >= 3`
*   `q3_assets >= 1`
*   `q4_website >= 1`
*   `q5_goal_type in [discovery, traffic, launches]`
### `foundation_first`
Use if:
*   `final outcome = possible_fit`
*   and no higher-priority role matches
## Role priority order
1. `not_priority_yet`
2. `sales_with_ads_support`
3. `warm_audience_support`
4. `discovery_traffic`
5. `organic_first_ads_later`
6. `foundation_first`
Acceptance requirement:
*   Every valid answer set must resolve to exactly one role key.
* * *
# Copy bank
## Result headlines
### Strong fit
Your brand looks like a strong fit for Pinterest.
### Possible fit
Your brand could be a fit for Pinterest — but a few things may need tightening first.
### Not right now
Pinterest does not look like the right next move for your brand right now.
* * *
## Standard result intros
### Strong fit
Based on your answers, Pinterest looks like a channel that could make strategic sense for your brand.
### Possible fit
There may be real potential here, but whether Pinterest is worth prioritizing depends on a few important factors.
### Not right now
Based on your current foundation, Pinterest likely is not the best next priority right now.
* * *
## Reason copy
### Category
*   `reason_category_strong` → Your category is a strong natural fit for Pinterest.
*   `reason_category_good` → Your category can work well on Pinterest with the right strategy and assets.
*   `reason_category_maybe` → Your category may have potential on Pinterest, but it needs stronger positioning to stand out.
*   `reason_category_weak` → Your category is not the most natural Pinterest fit, so the case needs to be stronger elsewhere.
### Offer
*   `reason_offer_proven` → You already have a proven product or collection, which makes Pinterest easier to test strategically.
*   `reason_offer_some_traction` → You have some product traction already, which gives Pinterest something solid to support.
*   `reason_offer_early` → Your product is still early, which makes Pinterest harder to evaluate as a channel right now.
*   `reason_offer_unproven` → Your offer is not proven enough yet, so Pinterest would likely be premature.
### Assets
*   `reason_assets_strong` → You already have strong visual and supporting content assets, which is a big advantage on Pinterest.
*   `reason_assets_decent` → You have enough content to start, even if your asset library still has some gaps.
*   `reason_assets_limited` → Your current content depth is limited, which may make Pinterest harder to sustain well.
*   `reason_assets_weak` → You would need to build much stronger content assets before Pinterest becomes a smart priority.
### Website
*   `reason_site_ready` → Your website looks ready to support Pinterest traffic.
*   `reason_site_solid` → Your site is in solid shape overall, which gives Pinterest a workable landing point.
*   `reason_site_friction` → Your website may still create friction if Pinterest starts driving traffic.
*   `reason_site_not_ready` → Your website is not ready enough yet to make Pinterest traffic worth pursuing.
### Goal
*   `reason_goal_discovery` → Your goals match one of Pinterest’s biggest strengths: helping new people discover your brand.
*   `reason_goal_traffic` → Pinterest can be a strong fit when the goal is driving qualified traffic to products or collections.
*   `reason_goal_launches` → Pinterest can support launches and seasonal moments well when the assets and timing are there.
*   `reason_goal_retargeting` → Using Pinterest to build a warmer audience can make strategic sense, especially as part of a broader funnel.
*   `reason_goal_sales_caution` → Your sales goals may be possible, but Pinterest usually works best with the right foundation and expectations.
### Support readiness
*   `reason_support_ready` → You seem ready to invest if the opportunity is there, which makes testing Pinterest much more realistic.
*   `reason_support_open` → You’re open to testing Pinterest in a lean way, which is often enough to start well.
*   `reason_support_cautious` → Your current readiness is cautious, which may slow momentum even if the fit is there.
*   `reason_support_not_committed` → Right now, there does not seem to be enough commitment behind exploring Pinterest seriously.
### Ads
*   `reason_ads_open` → You’re open to ads if they make sense, which gives Pinterest more room to become a meaningful channel.
*   `reason_ads_later` → You’re open to ads later, which can work well once the foundation is clearer.
*   `reason_ads_unsure` → You’re still unsure about ads, so Pinterest may need to start as a slower organic test.
*   `reason_ads_not_open` → If ads are fully off the table, Pinterest may need to play a narrower role for your brand.
* * *
## Role copy
*   `discovery_traffic` → Pinterest looks most promising for your brand as a discovery and traffic channel — helping more of your ideal audience find you.
*   `organic_first_ads_later` → The smartest path here may be to start with organic, then layer in ads once the foundation is stronger.
*   `sales_with_ads_support` → Pinterest could support sales for your brand, especially if you pair a strong organic foundation with paid promotion.
*   `warm_audience_support` → Pinterest could play a strong supporting role by helping your brand attract and warm up future buyers over time.
*   `foundation_first` → There may be potential here, but the smartest move is to strengthen the foundation before expecting Pinterest to do heavy lifting.
*   `not_priority_yet` → Right now, Pinterest looks more like a later move than a now move — your foundation likely needs tightening first.
* * *
# CTA rules
All three result states must include:
*   explicit button label
*   destination URL
*   subtext
*   tracking event
## CTA labels
*   `strong_fit` → section copy may vary, button label = `Book a Fit Call`
*   `possible_fit` → section copy may vary, button label = `Book a Fit Call`
*   `not_right_now` → section copy may vary, button label = `Book a Fit Call`
## CTA destination
*   All three states use the same Fit Call booking URL unless explicitly changed later.
## CTA tracking
*   All three states fire `cta_fit_call_clicked`
*   Include result variant in payload, e.g. `result_variant = strong_fit | possible_fit | not_right_now`
* * *
# Tracking events
Recommended minimum events:
*   `assessment_started`
*   `assessment_question_completed`
*   `assessment_completed`
*   `result_strong_fit`
*   `result_possible_fit`
*   `result_not_right_now`
*   `cta_fit_call_clicked`
Optional richer events:
*   `assessment_q1_answered`
*   `assessment_q5_goal_selected`
*   `assessment_q7_ads_selected`
* * *
# QA scenarios
## Scenario 1 — clear strong fit
*   q1=4
*   q2=4
*   q3=4
*   q4=4
*   q5=discovery
*   q6=3
*   q7=3
*   Expected: `strong_fit`
## Scenario 2 — strong category but weak foundation
*   q1=4
*   q2=1
*   q3=0
*   q4=0
*   q5=traffic
*   q6=2
*   q7=2
*   Expected: `possible_fit`
## Scenario 3 — sales expectation but low readiness
*   q1=4
*   q2=4
*   q3=4
*   q4=4
*   q5=sales
*   q6=1
*   q7=1
*   Expected: downgraded to `possible_fit`
## Scenario 4 — unclear niche + unproven offer
*   q1=1
*   q2=1
*   q3=3
*   q4=3
*   q5=discovery
*   q6=2
*   q7=2
*   Expected: `not_right_now`
## Scenario 5 — moderate fit
*   q1=3
*   q2=3
*   q3=3
*   q4=1
*   q5=launches
*   q6=2
*   q7=2
*   Expected: `possible_fit`
## Scenario 6 — low commitment
*   q1=4
*   q2=3
*   q3=3
*   q4=3
*   q5=retargeting
*   q6=0
*   q7=0
*   Expected: `possible_fit`
*   Expected role: `warm_audience_support`
*   Expected reasons:
*   `reason_category_strong`
*   `reason_offer_some_traction`
*   `reason_support_not_committed`
## Scenario 7 — weak assets + weak website
*   q1=4
*   q2=4
*   q3=0
*   q4=0
*   q5=traffic
*   q6=3
*   q7=3
*   Expected: `not_right_now`
*   Expected role: `not_priority_yet`
*   Expected reasons:
*   `reason_site_not_ready`
*   `reason_assets_weak`
*   `reason_goal_traffic`
## Scenario 8 — strong sales-oriented respondent
*   q1=4
*   q2=4
*   q3=4
*   q4=4
*   q5=sales
*   q6=3
*   q7=3
*   Expected: `strong_fit`
*   Expected role: `sales_with_ads_support`
*   Expected reasons:
*   `reason_category_strong`
*   `reason_offer_proven`
*   `reason_ads_open`
* * *
# What “done” means
The new version is ready when:
*   the tool is product-brand specific
*   the old audience branching is removed
*   the new 7-question flow is live
*   results are based on fit logic rather than potential-style forecasting
*   the CTA points to the fit call
*   tracking is in place
*   QA scenarios behave as expected
* * *