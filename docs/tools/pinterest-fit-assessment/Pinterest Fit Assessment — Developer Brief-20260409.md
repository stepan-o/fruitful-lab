# Pinterest Fit Assessment — Developer Brief

# Pinterest Fit Assessment
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
Could Pinterest Be a Bigger Opportunity for Your Brand Than You Think?
**Subtitle**
In less than 2 minutes, find out whether Pinterest is a real opportunity for your brand — or just a distraction.
**Support line**
Built for product-based brands.
**Primary button**
See If It’s a Fit
**Small note**
Takes less than 2 minutes.
### Notes
*   Keep this screen clean and short.
*   No extra explanation needed.
*   No audience selector here.
* * *
## 2) Q1 — Category fit
### Question
Which category best describes what you sell?
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
How much traction does the product or collection you’d promote already have?
### Options + score
*   We already know it sells well = 4
*   We’ve seen some traction = 3
*   It’s launched, but still early = 1
*   It’s not really proven yet = 0
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
*   We’d feel good sending traffic there now = 4
*   It’s decent, but could use tightening = 3
*   It works, but the experience has gaps = 1
*   It’s not really ready for traffic yet= 0
### Stored fields
*   `q4_website`
* * *
## 6) Q5 — Desired outcome
### Question
If Pinterest worked well for your brand, what would you want it to do first?
### Options + score/type
*   Get my brand in front of new people = score 3 / type `discovery`
*   Drive traffic to my product or collection pages = score 3 / type `traffic`
*   Support my launches, seasonal pushes, or promotions = score 3 / type `launches`
*   Build a warm audience we can retarget later = score 3 / type `retargeting`
*   Help drive sales sooner rather than later = score 2 / type `sales`
### Stored fields
*   `q5_goal_fit`
*   `q5_goal_type`
* * *
## 7) Q6 — Readiness to invest in expert support
### Question
How ready would you be to bring in expert Pinterest support if the opportunity looked real?
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
How willing would you be to use Pinterest ads as part of the right strategy?
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
*   Pinterest Could Be a Strong Growth Channel for Your Brand
*   Pinterest Could Work for Your Brand — With the Right Strategy
*   Pinterest May Be Premature for Your Brand Right Now
### Result page should contain
1. outcome label
2. short intro paragraph
3. top 3 reasons
4. “Best role for Pinterest” block
5. CTA
### CTA labels
*   Strong fit → **Want to talk through what this could look like for your brand? Book a Fit Call**
*   Possible fit →**Want help figuring out whether Pinterest is worth pursuing for your brand?** **Book a Fit Call**
*   Not the right fit right now → **Still want to talk it through or get a second opinion?**
### CTA subtext
**Strong fit**
Based on your answers, Pinterest looks like a channel your brand should be taking seriously.
**Possible fit**
There may be real potential here, but whether Pinterest is worth pursuing depends on a few strategic factors.
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
*   if base outcome is `strong_fit`, downgrade to `possible_fit`
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
### If final outcome = strong\_fit
Pick:
1. category reason
2. strongest foundation reason from offer/assets/website
3. strongest readiness or goal reason from support/ads/goal
### If final outcome = possible\_fit
Pick:
1. strongest positive reason
2. second-best positive or moderate reason
3. biggest limiting reason
### If final outcome = not\_right\_now
Pick:
1. biggest blocker
2. second-biggest blocker
3. third blocker or caution
* * *
# Best role for Pinterest logic
Assign one role block.
## Role keys
*   `discovery_traffic`
*   `organic_first_ads_later`
*   `seasonal_campaign_support`
*   `warm_audience_support`
*   `not_priority_yet`
## Role rules
### `discovery_traffic`
Use if:
*   q1 >= 3
*   q3 >= 3
*   q4 >= 3
*   q5\_goal\_type in \[discovery, traffic\]
### `organic_first_ads_later`
Use if:
*   q1 >= 3
*   q3 >= 1
*   q4 >= 1
*   q7 in \[1,2\]
*   q5\_goal\_type in \[discovery, traffic, launches\]
### `seasonal_campaign_support`
Use if:
*   q5\_goal\_type = launches
*   q2 >= 3
*   q3 >= 3
### `warm_audience_support`
Use if:
*   q5\_goal\_type = retargeting
*   q6 >= 1
*   q7 >= 1
### `not_priority_yet`
Use if any:
*   q2 <= 1
*   q3 <= 1 and q4 <= 1
*   q6 = 0
*   final outcome = not\_right\_now
## Role priority order
If multiple match, use:
1. `not_priority_yet`
2. `seasonal_campaign_support`
3. `warm_audience_support`
4. `discovery_traffic`
5. `organic_first_ads_later`
* * *
# Copy bank
## Result headlines
### Strong fit
Pinterest Could Be a Strong Growth Channel for Your Brand
### Possible fit
Pinterest Could Work for Your Brand — With the Right Strategy
### Not right now
Pinterest May Be Premature for Your Brand Right Now
* * *
## Standard result intros
### Strong fit
Your answers suggest Pinterest could be a real growth opportunity for your brand — not just a nice-to-have.
### Possible fit
There’s real potential here, but whether Pinterest pays off for your brand depends on how you approach it.
### Not right now
**Pinterest doesn’t look like the smartest next move for your brand right now — at least not** with your current setup.
* * *
## Reason copy
### Category
*   `reason_category_strong` → Your niche has strong Pinterest potential — millions of people are actively looking for products and solutions like yours.
*   `reason_category_good` → Your product category can work well on Pinterest, especially with the right positioning and creative strategy.
*   `reason_category_maybe` → There may be room for your brand on Pinterest, but it will take sharper positioning to stand out.
*   `reason_category_weak` → Your category is not the most obvious Pinterest fit, so the channel has more to prove in your case.
### Offer
*   `reason_offer_proven` → You already have a product or collection with real traction, which gives Pinterest something strong to amplify.
*   `reason_offer_some_traction` → You’re not starting from zero — there’s already enough traction here to make Pinterest worth considering.
*   `reason_offer_early` → Your product is still early, which makes Pinterest harder to evaluate as a channel right now.
*   `reason_offer_unproven` → Your offer still needs stronger proof of demand before Pinterest becomes a smart next move.
### Assets
*   `reason_assets_strong` → You already have the kind of visual and supporting content that turns Pinterest traffic into potential customers.
*   `reason_assets_decent` → You have enough content to start getting discovered in front of the right audience, even if there are still some gaps.
*   `reason_assets_limited` → Your content library feels a bit thin right now, which means Pinterest may work more slowly.
*   `reason_assets_weak` → Right now, your brand would need a much stronger content foundation before Pinterest makes sense to prioritize.
### Website
*   `reason_site_ready` → Your website looks ready to turn Pinterest visitors into potential customers.
*   `reason_site_solid` → Your site is in decent shape, which gives Pinterest a workable place to send traffic.
*   `reason_site_friction` → Your website may still create friction if Pinterest starts driving traffic.
*   `reason_site_not_ready` → Your website is not ready enough yet to make Pinterest traffic worth pursuing.
### Goal
*   `reason_goal_discovery` → Your goal lines up with one of Pinterest’s biggest strengths: getting your brand discovered by the right people.
*   `reason_goal_traffic` → Pinterest can be a strong fit when the goal is driving qualified traffic to products or collections.
*   `reason_goal_launches` → Pinterest can work well for launches and seasonal pushes when there’s a clear offer and enough creative support behind it.
*   `reason_goal_retargeting` → Using Pinterest to build a warmer audience can make strategic sense, especially as part of a broader funnel.
*   `reason_goal_sales_caution` → Pinterest can support sales, but it usually works best when the foundation is strong — and it can be especially powerful when paired with ads.
### Support readiness
*   `reason_support_ready` → You’re ready to take action if the opportunity is there, which makes Pinterest much more realistic to test now.
*   `reason_support_open` → You’re open enough to explore this seriously, even if you’d want to start lean.
*   `reason_support_cautious` → There’s interest here, but the hesitation could slow momentum if Pinterest does look promising.
*   `reason_support_not_committed` → Right now, there doesn’t seem to be enough commitment behind seriously exploring Pinterest.
### Ads
*   `reason_ads_open` → You’re open to ads if they make sense, which gives Pinterest more room to become a meaningful channel.
*   `reason_ads_later` → You’re open to ads later, which gives Pinterest a clearer path if the organic foundation looks promising.
*   `reason_ads_unsure` → You’re still unsure about ads, so Pinterest may need to start as a slower organic test.
*   `reason_ads_not_open` → If ads are fully off the table, Pinterest may need to play a narrower role for your brand.
* * *
## Role copy
*   `discovery_traffic` → Pinterest looks most promising here as a discovery and traffic channel for your brand.
*   `organic_first_ads_later` → Pinterest may make the most sense as an organic-first channel, with room to layer ads later if the foundation proves strong.
*   `seasonal_campaign_support` →Pinterest may be most useful for your brand if you build the foundation first, then use it to support launches, promotions, and seasonal moments more strategically.
*   `warm_audience_support` → Pinterest could play a strong supporting role by helping your brand attract and warm up future buyers over time.
*   `not_priority_yet` → Pinterest does not look like the right priority right now. Your foundation likely needs more work before this channel becomes worth serious attention.
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
*   Expected: likely `possible_fit` or `not_right_now` depending on total
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