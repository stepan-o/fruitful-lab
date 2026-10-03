# Sanctuary Economics — narrative reconstruction

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
