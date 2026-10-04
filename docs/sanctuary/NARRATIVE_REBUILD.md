# Current reconstruction: the life around the game

The evening/venue revision supersedes the framing below. Read
[The full narrative impact map](EVENING_NARRATIVE_MAP.md) for the argument,
chapter-by-chapter implementation, source boundaries and visual decisions.
The first chapter is now **Insert coin. Join in.**; stable IDs and the
arcade → copy → ongoing world → Concord sequence remain.

# Sanctuary Economics — narrative reconstruction

## Current sequence · 3 October 2026 · arcade-first revision

The owner’s Russian discussion, “Объяснение презентации монетизации игр,”
changes the narrative spine: **what has the player paid for, what can end, and
what prompts the next payment?** The contemporary fork is a conclusion reached
through those relationships, rather than an opening division between finite
adventures and repeatable services.

1. **Insert coin. Stay alive.** (`insert-coin`): introduce paid participation
   before naming Gauntlet. Computer Space/Pong place coin-operated commerce near
   the industry’s beginnings; Gauntlet’s 1985 manual makes the shared game and
   business controls explicit. “Air” means an intangible resource, not worthless
   play. The player’s evening and the operator’s work both count.
2. **The next attempt is already paid for** (`several-histories`): Diablo II
   separates the end of an attempt, a story and paid access. Deep replayability
   and free Battle.net did not require another Blizzard sale. Ladder, connection
   costs, digital delivery and later offers extend the argument. Netflix’s 2007
   DVD/streaming announcement separates delivery from payment.
3. **The business of keeping a world alive** (`the-fork`): retain the creative
   financing and audience lens, cinema/catalog artwork, Adobe and BG3/D4. The
   fork asks what the studio produces and sells after the initial purchase.
4. **Concord**: continuing-world obligations and the cost of an audience that
   does not materialize. Its dedicated chapter remains in place.
5. Continue into studio learning, funding and the design/case-study chapters.
   Dedicated Diablo-origin/franchise chapters remain the next editorial work;
   this revision does not claim those have been written.

There are now **22 chapters**, seven parts and one new stable URL. All previous
chapter IDs resolve. Overview entry, contents, sequential navigation, counts and
credits return link follow the new order. The original diptych, cinema, covers,
Netflix accent and BG3/D4 imagery are preserved.

### Evidence and presentation

- Gauntlet’s manual was re-read at printed 2–2, 2–3 and 3–4. Its recommendations
  assume US 25¢ play, not a present-day exchange rate. Health settings do not
  guarantee time or revenue. Gauntlet is neither the first commercial video game
  nor a claimed direct ancestor of Diablo.
- Ed Logg’s GDC 2012 slides (PDF pages 6 and 40) distinguish Atari’s machine
  sales from operator coin income, and recall rejecting a final monster to
  avoid ending play funded by coins already deposited. This is a dated designer
  recollection; no earnings anecdote becomes an industry statistic.
- The new original cutaway lets readers view a cabinet as player or operator.
  Its selected health settings (100, 600, 2,000) are documented; no rate of play,
  difficulty response curve or earnings simulation is fabricated. No timers,
  animation loops, new assets or dependencies are added.
- The existing optimized manual page follows the operator argument. D2’s class
  image follows its explanation. `Figure.afterParagraph` keeps evidence beside
  the claim without duplicating its image at the bottom. Inspection remains
  on-demand; the same retained immutable files and source register are used.
- Paid survival, a purchased copy, subscriptions, ads and optional cosmetics
  remain distinct. Historical continuity is not a verdict that offers are
  equivalent, harmless or inevitable. There is no golden age of noncommercial
  games and no villain inferred from a business model.

### Validation of the arcade-first revision

- Scoped lint and whitespace checks pass. The reader/exhibit suites pass all
  19 tests, including chapter order, inline figure placement without duplication,
  and the documented health settings.
- All 42 application test suites passed across the full run and a targeted
  retry. The initial run lacked `API_BASE_URL` for three auth suites and hit a
  five-second timeout in the Pinterest Fit component suite. Those four suites
  passed with the required environment and a 30-second test timeout; no product
  code was changed to accommodate the retry.
- The final production build passes compilation, TypeScript and route generation.
- Asset pipeline tests and integrity checks pass for four retained releases.
  The public edition works without the optional local research archive.
- Browser checks covered desktop and requested widths of 768, 390 and 320 px:
  no horizontal overflow, usable player/operator controls, keyboard health
  selection, lazy manual loading, inspection/Escape with restored focus, and
  forward navigation through all three revised chapters. The phone view's
  perspective buttons measure 55 px tall. The new diagram has no motion loop;
  the reader's existing Motion control still works. No browser errors were seen.
- This is functional and responsive verification, not a field Core Web Vitals
  measurement. The local review entry is port 3106, chapter `insert-coin`;
  older local servers may still show a previous build.

## Previous opening record (superseded sequence)

Owner-approved direction, 3 October 2026. Rebuild section by section; preserve the
approved visual quality and the public edition’s asset/credit pipeline. Review
new prose in the local preview before the next publication PR.

## The opening’s job

Set the broader economic and social context, explain why it matters inside a
game, and glimpse the contemporary split through BG3 and Diablo IV. The guiding
question is: how does the business of sustaining a game change the experience
of playing it?

Begin with the financing gap: people making the next work need to be paid before
the audience buys it. Earlier earnings, new customers and outside financing can
bridge that gap; no claim about a particular studio’s private accounts follows.
The continuing lens is **the economics of creative work and the audience’s
attachment to it**. Attachment includes meaning, memory, identity and shared
life. It is not interchangeable with time spent, spending, retention or wellbeing.

Use cinema admissions and Netflix’s catalog to make the next payment concrete.
Netflix’s July 2024 letter explicitly treats viewing as a proxy for satisfaction
and connects it to retention. The 2023 WGA streaming bonus gives one documented
example of changes reaching creators’ compensation. Adobe’s 2013 transition
provides a second, bounded parallel. Streaming did not invent subscriptions;
cinema, licensing and catalog distribution coexist. D4 is not a subscription
catalog. These comparisons establish questions, not an identical model.

Then bring the relationship inside games, where updates can change someone’s
activities, accumulated learning and social world. Introduce Larian, Blizzard,
role-playing games, campaign and season only at the point of use. In subsequent
chapters, ask what the audience values, what work sustains it, who pays next,
and which observable behavior the business treats as evidence of success.

The contemporary comparison previews the destination. Replayability, duration,
continued development and repeat purchasing are independent. Neither game is
an artistic ranking or a complete category of business models. Larian’s April
2025 announcement and Blizzard’s August 2022 plan document different production
intentions at specified dates; they are not a current pricing comparison.

## Full narrative direction

1. The wider setting and the contemporary fork.
2. Industry history: overlapping development in design, distribution, audiences,
   social participation and ways of paying. Establish the long arc.
3. Concord: introduce the intended experience, then explain the anxiety of
   committing to an ongoing world whose audience must materialize. Separate
   documented events from hypotheses about its failure.
4. Diablo’s beginning: the landscape the first game entered, its influences,
   the innovation in its combination of ideas, and what playing it felt like.
   Use the original pitch and David Brevik’s GDC postmortem as primary research.
5. Follow the franchise’s changes from that starting point. Distinguish the
   inherited core activities from changes to playthroughs, online operation,
   social organization, ownership/access and further sales. Introduce systems
   when they enter the story.
6. Unpack engagement, design and monetization, using the now-familiar franchise
   alongside the other case studies. The six-game comparison belongs after the
   reader has enough context to appreciate its distinctions.

Historical precedents prevent a false progression from complete boxes to
incomplete services. D2’s replayability and free online play remain essential
counterexamples to equating return visits with recurring payments. A commercial
model influences design; it does not explain every creative decision.

## First chapter implementation

Local draft title: **The business of keeping a world alive**. The stable route
remains `?chapter=the-fork`.

- Thirteen paragraphs: financing gap → audience attachment → film/streaming and
  creative software → consequences for games → contemporary examples → history.
- The official BG3/D4 image pair opens the page and introduces the products.
  Its captions establish identities; the images do not prove payment terms.
- An original three-track exhibit distinguishes continued play, the studio’s
  next work and the next sale. Its three selectable arrangements are qualitative,
  not numerical forecasts or exclusive game categories. No timers or per-frame
  work are added.
- A cinema/catalog visual follows the first Netflix comparison, before the
  writing-compensation example. Original theater and catalog drawings accompany
  the official Netflix wordmark and a short primary-source quotation. Two small
  image variants (1,926 / 3,908 bytes) use the immutable `sanctuary-context` pack;
  the procedural illustrations use CSS atmosphere gated by visibility and motion preferences, with no new animation library. Its source and
  editorial rationale appear in the public credits register.
- The animated landscape is preserved in **Where progress lives**, with a brief
  campaign/season introduction. Its claim concerns playthroughs, not payment.
- The detailed funding exhibit now belongs in **The shape of the money**.
- The local reading order begins opening → history → Concord. The current
  six-game and progress chapters move beyond that opening sequence. IDs and
  chapter count remain stable.

Only the opening has received this reconstruction. The existing history,
Concord and later manuscript remain working material for subsequent section
passes; the new Diablo origin/franchise sequence is not yet authored. Their
current ordering beyond Concord is transitional, not the final contents plan.

## Visual and prose discipline

Each visual must answer a specific question, establish the subject or provide
evidence. An approved illustration can move to a more suitable chapter without
losing its craft. Do not force its metaphor to carry the entire economic thesis.

Introduce things through what they are, what someone does with them and why they
matter in this passage. Save build systems, reset rules, reward catalogs, purchase
currencies and financial models for the chapters where the reader needs them.
Use primary-source voices briefly and precisely. Keep qualifications in the
relevant sentence or evidence notes rather than repeatedly interrupting the story.

## Verification

Record the local build and browser review in the delivery note. This document
records editorial scope, not a deployment or a claim that the full deck has been
rebuilt.

Local verification, 3 October 2026: all 34 suites / 149 tests passed, the asset
pipeline check passed, and the final production build passed. Scoped ESLint and
`git diff --check` passed. Browser review covered the opening, all three exhibit
states, overview entry, next navigation into history (then Concord), and the
relocated diptych. Checked 320, 390 and 768 CSS-pixel layouts plus the normal
desktop viewport; no horizontal page overflow or browser errors observed. At
320px, the new controls stack into full-width 55px targets. The new exhibit adds
no media requests, timers or animation loops. No field performance claim is made.

Active local review URL: `http://127.0.0.1:3104/stepanoskin/game-monetization?chapter=the-fork`.
This pass is a local draft; it has not been pushed or published.

Follow-up verification, 3 October 2026: revised creative-economics opening and cinema/catalog visual pass the production build, all 34 suites / 149 tests, media integrity/provenance checks and scoped ESLint. The final targeted reader rerun passes all nine tests. An additional whole-repository `tsc --noEmit` check reports existing test-fixture issues in Pinterest environment assignments, a Sanctuary exhibit matcher option and GrowthBook mocks; none is in the changed production code. Browser review at 320, 390 and 768 CSS pixels shows no page overflow; the official wordmark loads its 1,926-byte variant at 154 CSS pixels on the tested 1× viewport. This is local evidence, not a field performance claim. The previous preview process had stopped; a fresh development server now serves the same port 3104.

The final subscription accent also passes the production build and nine reader tests. It was visually checked at 320px and desktop; no browser errors or horizontal overflow were observed. The Netflix credit link resolves to its public source record. Preview now runs independently of a tool session; its PID/log are recorded at `/tmp/fruitful-sanctuary-3104.pid` and `/tmp/fruitful-sanctuary-3104.log`.

Publication preparation, 3 October 2026: the owner requested a PR for the accumulated opening rewrite and targeted cinema/catalog passes. The final local run passes 35 suites / 152 tests, asset integrity checks and the production build. Jest emitted one worker-shutdown warning after all tests passed; the three new motion/dialog tests also pass in isolation. Scoped ESLint passes. Details of the visual pass and browser verification are in `CINEMA_CATALOG_ART_PASSES.md`.

## Evening/venue revision verification — 4 October 2026

The current implementation follows `EVENING_NARRATIVE_MAP.md`. It also reduces
the study landing to the mural/hero and entry CTA and adds the three financial
inscriptions documented in `DESIGN_SYSTEM.md`. The subscription inscription and
catalog payment strip connect the sales invitation to recurring billing.

- Integrated main through `d596a5d`; only Sanctuary app files and its memory
  documents differ from that base. Final full run: **43 suites / 191 tests pass**.
  The pre-integration run also passed all 42 suites / 186 tests.
- Scoped ESLint, production build and the asset-pipeline test pass. The build
  verifies all four retained releases and the public editorial selection.
  Existing optional GrowthBook configuration and middleware-convention notices
  remain; neither prevents the build.
- Browser review covers desktop, 768, 390 and 320 CSS-pixel viewport requests.
  No horizontal page overflow. On the narrow layout, perspective controls are
  at least 44 pixels high; captions stack below the original SVG scenes.
- Production checks: hero has one link and no extra navigation; entry, next
  chapter and the first three chapters' order work. Keyboard view selection,
  the 2,000-health setting, manual image inspection, Escape dismissal and focus
  restoration work. No browser errors were logged in the production tab.
- Financial inscriptions report playing while visible and stop offscreen.
  Manual pause persists; the shared living-plate gate and CSS also retain OS
  reduced-motion handling. No new frame timers, image assets or dependencies
  are introduced by this Sanctuary revision.
- At the tested 390-pixel / 1× phone viewport, the opening manual chooses the
  480×626 WebP (53,688 bytes, lazy), while the BG3/D4 opening pair choose 480-pixel
  files totaling **42,044 bytes**. The landing mural is procedural. These are
  selected-image measurements, not total page weight or field speed.
- Two consecutive local production requests returned 200: landing 22,551 bytes
  gzip, opening 20,078, fork 36,790. Observed times were 58–146 ms on this host.
  The server had already served browser requests; this is warm local response
  evidence, not a cold-cache, throttled-mobile or CDN benchmark. Fresh-tab and
  reload rendering were inspected; field Core Web Vitals remain unmeasured.

Local visual captures are under
`/home/stpn/Documents/Codex/2026-09-30/is-x20/outputs/sanctuary-evening/`:
`landing-desktop.png`, `landing-phone.png`, `room-phone.png`,
`world-desktop.png` and `financial-inscriptions-desktop.png`. The local preview
uses the production build on port 3106; PID and log are recorded in
`/tmp/sanctuary-evening-production.pid` and `.log`.
