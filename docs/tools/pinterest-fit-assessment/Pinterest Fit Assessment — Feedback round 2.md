You are a senior product UI/UX implementation assistant helping revise a mobile-first web assessment called **Pinterest Fit Assessment** for **Fruitful Lab**.

Your job is to read the following implementation brief and help a developer update the existing assessment UI and flow accordingly.

Important:
- This is a **revision**, not a rebuild.
- The assessment already exists and works.
- We are refining the **visual design, mobile UX, hierarchy, typography, and result-page gating**.
- Use the attached/linked **locked results-page image** as the main visual direction for the final results screen.
- Do not invent a completely different design language.
- Keep the implementation realistic and developer-friendly.

## PRODUCT CONTEXT

This is a **Pinterest Fit Assessment** for product-based brands.

The purpose of the assessment is to:
- help brands understand whether Pinterest could be a worthwhile growth channel
- lead qualified users toward a **Fit Call**
- optionally capture email in exchange for a deeper personalized breakdown

The flow is mobile-first.

The assessment should feel:
- premium
- warm
- branded
- focused
- clean
- less SaaS-generic
- more polished and editorial in feel, but still practical and believable as a real tool

It should **not** feel like:
- a generic SaaS dashboard
- a random website page with nav/header/footer
- a cluttered landing page
- a fantasy concept that is hard to implement

## BRAND / VISUAL RULES

Typography must be:
- **Alatsi** for headings
- **Raleway** for body text, labels, buttons, supporting copy

Palette / styling direction:
- dark premium background
- rich plum / blackberry / aubergine tones
- restrained warm glow accents
- bright CTA pink/magenta is okay, but use it carefully
- avoid becoming too neon-pink heavy
- the page should feel elegant, legible, and conversion-focused

General design goals:
- strong mobile readability
- strong hierarchy
- clean spacing
- subtle motion only
- no clutter
- no heavy decorative imagery
- no stock-photo collage dominating the layout

## GLOBAL CHANGES REQUIRED

### Remove site chrome from the assessment flow
For the intro screen, question screens, and results screen, remove:
- site navigation
- header menu
- Fruitful Lab website menu
- footer
- any normal site-level book-a-call button
- any website chrome that makes it feel like a normal page

The assessment should feel standalone and focused.

### Keep subtle motion only
Allowed:
- soft step-to-step transition
- subtle progress-bar animation
- answer-state polish

Avoid:
- flashy animations
- gimmicky motion
- excessive transitions

---

# INTRO SCREEN REVISION

## Goal
The intro should hook attention, feel premium, and start the assessment cleanly.

## Use this approved copy
Eyebrow / label:
Pinterest Fit Assessment

Support line:
Built for product-based brands

Headline:
Could Pinterest Be a Bigger Opportunity for Your Brand Than You Think?

Body:
In under 2 minutes, find out whether Pinterest is a real opportunity for your brand — or just a distraction.

Primary CTA:
See If It’s a Fit

Small note:
Takes about 2 minutes

## Intro visual direction
- keep it clean
- strong card/container feel
- dark, premium, branded
- no nav/footer
- correct fonts
- mobile-friendly
- CTA should remain prominent

---

# QUESTION SCREEN REVISION

## Keep
- one-question-per-screen structure
- progress indicator
- back button
- stacked answer cards
- auto-advance after answer selection
- progress bar

## Improve
- correct fonts
- mobile type size
- slightly stronger visual presence
- no site nav/footer
- maintain clean assessment feel

## Do not add
- unnecessary images per question
- clutter
- decorative overload

---

# RESULTS PAGE — MAIN PRIORITY

Use the locked attached image as the **main visual source of truth** for the results page.

The results page is the most important revision area.

## REQUIRED RESULTS PAGE STRUCTURE

### 1. Hero result block
Visible immediately after the assessment is completed.

Must include:
- pill label
- large result headline
- supporting text
- strong primary CTA

Approved content:
Pill:
Strong Pinterest Fit

Headline:
Pinterest Could Be a Real Growth Opportunity for Your Brand

Supporting text:
Your answers suggest Pinterest could be a meaningful growth channel for your brand — not just a nice-to-have.

Primary CTA:
Book a Fit Call

### Hero requirements
- visually dominant
- stronger hierarchy than other sections
- CTA nearly full-width on mobile
- CTA clearly primary
- correct fonts
- dark premium card with subtle gradient / glow
- no clutter

---

### 2. Email capture block
Placed directly below the hero.

Purpose:
- capture email
- unlock the full personalized breakdown

Approved content:
Heading:
Want your full breakdown?

Body:
Enter your email to unlock your personalized results, including your top 3 reasons, best Pinterest role, and recommended next step.

Field placeholder:
Your email address

Button:
Unlock My Full Breakdown

Trust note:
Your info is safe. No spam, ever.

### Email block requirements
- visually secondary to the top CTA
- attractive but not competing equally with the hero CTA
- no skip link
- gated content remains locked until email is entered
- no full breakdown shown before email capture

---

### 3. Locked breakdown preview
Below the email capture, show a preview of the deeper personalized breakdown.

The purpose is to show what the user will unlock after email.

Include three preview items/cards:
- Top 3 reasons
- Best role for Pinterest
- Recommended next step

Also include:
- heading like: Your Personalized Breakdown
- small sublabel like: Unlock after email

### Locked preview requirements
- clearly looks locked / gated
- may be lightly blurred / softened / obscured
- should hint at real value without revealing the full content
- should feel more premium than flat gray placeholders
- should still feel implementable

---

### 4. Bottom repeated CTA
At the bottom of the results section, repeat:

Book a Fit Call

This is intentional and should remain.

The bottom CTA can be slightly less dominant than the hero CTA, but still clear.

---

# DESIGN / HIERARCHY RULES FOR RESULTS PAGE

The results page must have this hierarchy:

1. result verdict / hero
2. primary CTA (Book a Fit Call)
3. email unlock block
4. locked breakdown preview
5. bottom CTA

Important:
- the results page should not feel flat
- sections should not all feel equally weighted
- hero must feel strongest
- email block should feel secondary
- breakdown preview should feel valuable but gated

## Specific visual needs
- stronger hero presence
- slightly heavier typography / more presence
- correct Alatsi + Raleway system
- richer card separation
- elegant spacing
- restrained color use
- less thin/airy feeling than earlier iterations
- dark premium feel with controlled warmth

---

# PINK / COLOR DIRECTION

Important:
A previous revision became too pink-heavy.

Please keep:
- dark base
- pink/magenta accents
- warm glow accents

But avoid:
- over-saturating the whole page in pink
- making everything neon
- making the page feel too “candy” or too loud

The final result should feel:
- premium
- warm
- dark
- polished
- branded

---

# WHAT NOT TO DO

Do not:
- bring back site header/footer/menu
- use the wrong fonts
- turn this into a generic SaaS dashboard
- reveal the full breakdown before email capture
- make the email block stronger than the Fit Call CTA
- overuse pink
- over-style it with unnecessary lifestyle imagery
- create a fantasy dribbble concept that doesn’t match the existing product

---

# FUNCTIONAL NOTES

Please also ensure:
- Fit Call button links to the real booking URL
- no stray TODO or developer note is visible in UI
- email block is ready to connect to MailerLite
- mobile responsiveness remains strong
- question flow keeps auto-advance
- progress bar still works

---

# FINAL TASK

Based on all of the above:
1. review the existing assessment implementation
2. revise the intro screen accordingly
3. revise the question screens only as needed
4. revise the results page to match the locked visual direction and hierarchy
5. keep the final design practical, premium, mobile-first, and consistent with the existing tool

When proposing implementation changes, prioritize:
- clarity
- hierarchy
- typography fidelity
- mobile usability
- visual consistency
- realistic front-end execution