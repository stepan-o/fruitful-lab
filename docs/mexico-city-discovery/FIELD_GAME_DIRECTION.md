# Otra Vista city exploration game

Updated 10 October 2026. Product direction from the owner discussion: **play happens in the city**. Otra Vista helps a person choose something to do, document an experience, remember it and optionally compete with friends. A worthwhile session can involve a minute with the app and an hour outside.

This principle governs subsequent mechanics, navigation and interface work. **The immediate priority is the private multiplayer game for Susy and Stepan.** Build and refine something they enjoy playing together outside. The solo reflections and broader community concepts are later possibilities, not requirements for the first playable battle. The [collective discovery roadmap](COMMUNITY_ROADMAP.md) preserves the separate public experiment without expanding the current implementation scope.

The current preview remains the public, browser-local map and learning prototype described in [README.md](README.md); accounts, shared photo storage and peer review are not implemented by this document.

## The central action

**Choose an intention → do something in the city → record a photo and place → remember or share the discovery → choose another outing.**

The player can start with a prepared challenge, something they saved, or an unplanned discovery. Recording must work for any place or experience, including locations absent from the authored map. A bookstore, taco stand, workshop, conversation, product or unexpected detail can become part of a personal collection. Returning to a familiar place can create another meaningful memory.

The central object is a dated discovery belonging to an account. Its minimum completed form is a photograph, a specified place and a category. A place can be a name plus neighborhood, an address or a manually placed pin; GPS is optional. A short note answers “¿Qué te llamó la atención?” and remains optional. Offer the camera and existing photo library so someone can finish a record after returning home. Let them correct the activity date; distinguish it from the upload date.

A photo records the player's account of an experience. Neither a photo nor a location field establishes that the person was physically present at a particular time. Peer review is the agreed validation method for the friendly competition. Generated illustrations belong in editorial content and never stand in for a player's evidence.

## Friendly battles and the later solo mode

| Moment | Solo exploration | Battle between Susy and Stepan |
| --- | --- | --- |
| Start | Choose a prompt, follow an interest or record something spontaneous. | Both join a challenge with dates, qualifying actions and scoring shown before starting. |
| Act | Visit, notice, try, make or meet something in the city. | Do the qualifying activity during the challenge. |
| Record | Save a photo, place, category and activity date; optionally add a note. | Create the same personal record, then choose to submit relevant evidence to the battle. |
| Validate | A successful save completes the record. No approval queue. | The other participant reviews the submitted photo, place and challenge criteria. Nobody approves their own entry. |
| Reward | Show personal progress and preserve the memory immediately after saving. | Show pending entries separately; award battle points only after confirmation. |
| Return | Browse collections and reflections, then choose another outing. | See confirmed standings and shared discoveries; choose another challenge. |

The immediate experience is the friendly battle in the right-hand column. The left-hand column preserves a later solo direction, which should eventually stand on its own without a fictional rival or compulsory leaderboard. A pending or unsuccessful battle submission does not erase the private memory.

### The first battle

Example: **“Taquerías por descubrir”**. During an agreed week, find taco stands or taquerías that are new to you. Record the place and a photo showing what caught your attention. Buying food is optional. Each distinct qualifying place counts once per player in that battle; both players may discover the same place. Public places do not become exclusive territory.

For the two-person test, the opponent chooses **“Confirmar hallazgo”** or **“Pedir un detalle”**, with a short reason for the latter. The submitter can add detail and resubmit, or withdraw. Changing confirmed evidence returns that submission to review and reverses its battle award until confirmed again. Retrying requests, approving twice or adding another image of the same place must not multiply points.

Show a review deadline after the activity deadline. Eligibility follows the declared activity date and challenge rules. Unresolved entries remain pending; do not automatically approve them or declare a final winner while they could change the result. This first rule assumes a cooperative pair. Larger groups and disputed adjudication need a subsequent design pass.

The system checks completeness, membership, reviewer identity, eligibility and duplicate awards. The reviewer judges whether the evidence meets the challenge. Call this **confirmed by the other player**, without implying automated presence verification.

## Points that support the activity

Keep visible progress, with provisional values configured in one place. Separate personal exploration, learning and each battle's score so the player understands how they earned each one. A simple trial rule could give 10 battle points per confirmed distinct place; the numerical balance remains open.

Reading, city-layout quizzes and Náhuatl games still earn learning points. A taco challenge's standings count its qualifying activities. Repeat visits can be meaningful memories even when a distinct-place challenge gives no additional reward.

Account rewards must come from deduplicated server records. Retain submission, review and award history so pending, confirmed and corrected scores are explainable. Current browser scores and imported learning flags are prototype progress; they must not silently become trusted competition results.

## Later reflections that help a person explore

Start with summaries of dated records: new places, categories, neighborhoods, return visits and discoveries outside the recent pattern. Describe the logged sample explicitly. “Registraste cuatro librerías nuevas este mes” says what the app knows; missing records do not establish what the person did with their life.

With enough records across a meaningful period, offer an invitation: **“Tus últimos seis hallazgos fueron librerías. ¿Se te antoja probar algo distinto? Hay un reto de mercados, uno de murales y otro de talleres.”** Let the person choose a suggestion, keep exploring bookstores or dismiss it. An account being eight weeks old is not evidence of eight weeks of activity. With little history, show starter prompts instead of invented patterns.

A recurring interest is also a valuable collection. Novelty is an invitation, not an obligation or a judgment. Early summaries can use transparent counts and comparisons without an AI personality assessment.

## Interface built for an outing

Retain the airy white composition, expressive type, colorful sketch assets and transitions across map scales. The main view becomes a field companion: the map sits behind the current intention and an always reachable **“Registrar hallazgo”** action. Selecting an area answers “what could I do here?” and reveals personal memories alongside authored places.

| Surface | Purpose | Spanish example |
| --- | --- | --- |
| Explorar | Choose an intention through the map, saved places or prepared prompts. | “¿Qué se te antoja descubrir hoy?” |
| Registrar hallazgo | Take or choose a photo, specify a place, select a category and save. | “¿Dónde fue?” · “¿Qué te llamó la atención?” |
| Mi ciudad | Revisit a photo collection, personal map, lists and monthly reflections. | “Así has descubierto la ciudad” |
| Retos | Find prepared activities, join the private battle and review submissions. | “Un hallazgo por revisar” |

Account and language controls stay secondary. Spanish remains the default; English covers the same actions, validation states, errors and content. Preserve personal notes in their original language.

An active outing needs a short prompt, a place, useful access context and a record button. Long stories remain available when wanted. Motion should orient the person, acknowledge a saved memory or explain a historical relationship, then settle. Design for daylight, one-handed use, large touch areas and returning from the camera. Avoid timers, streak pressure and animation that demands attention while walking.

Distinguish drafts from saved records. Upload failure or session expiry must preserve the selected photo and text for recovery and explain that the account has not received the record yet. Retry must not create a duplicate. A durable offline queue is a later capability until tested on the supported phones.

## Prepared challenges and historical context

Prepared challenges offer a starting point with a concrete action. Keep cost, time and physical demands clear, with alternatives for inaccessible activities. A player can also explore without a challenge.

| Challenge seed | Action outside | Record | Optional context |
| --- | --- | --- | --- |
| Una librería fuera de tu ruta | Find an unfamiliar bookstore and notice an unexpected book or display. | Place and photo of a permitted detail. | Sourced local printing or literary history. |
| Mira hacia arriba | Notice an architectural detail on an ordinary street. | Place and a detail or facade photo. | A short explanation of the period or design. |
| La ciudad que fue lago | At a checked, accessible location, compare a historical image with today's streetscape. | Present-day photo, place and optional observation. | Basin, causeways and changes to the city. |
| Una palabra en la calle | Find a sign containing an authored Náhuatl-derived place name. | Sign photo and location. | Sourced name breakdown and optional word game. |
| Algo que nunca habías probado | Try a new activity, or observe and learn about it without a purchase. | Photo of an object, setting or result and its place. | A note about what surprised you. |

These are templates rather than verified venue recommendations. Exact routes, access and historical claims require the source checks used for existing stories before publication.

The city-layout chapter provides orientation before or after an outing. Metro and Cablebús explain how areas connect. Historical and modern photographs suggest things to notice outside; quizzes help remember them. These screens are optional when recording a discovery. Retain citations and clear distinctions between archival images and generated interpretations.

## Accounts and implementation boundaries

Reuse Fruitful Lab's users table and email/password session. Connect ownership to user IDs instead of the Susy/Stepan browser selector. Every active user can play, independently of admin or contractor status. After signing in, return to the intended game action.

Current code provides the foundation and identifies the required work:

- [Backend authentication](../../backend/routers/auth.py) implements `/auth/login`, `/auth/me` and `/auth/register`; [models](../../backend/models.py) contain the shared users table.
- [The session helper](../../apps/lab/lib/auth.ts) and [login proxy](../../apps/lab/app/api/auth/login/route.ts) use `fruitful_access_token` and backend `/auth/me` as the authority. The return-path allowlist currently excludes `/mexico-city`; add a safe game destination for eligible roles while preserving protected-route behavior.
- Registration is currently described as internal, accepts `groups` and `is_active` through its schema, and has no public registration screen. Before game signup, enforce ordinary account defaults on the backend. The browser must not choose roles or activation policy. Keep server, middleware and API authorization aligned.
- [The journal](../../apps/lab/lib/mexico-city/journal.ts) stores browser-local flags, notes and resized photo data for four fixed story IDs. It has no arbitrary discoveries, dates, account ownership, shared uploads, battles or reviews. Existing backend uploads handle CSV ingestion rather than photo storage.

Proposed data: a discovery owned by a user, private photo media, a challenge with participants and fixed rules, an evidence submission referencing a discovery revision, a review and a deduplicated reward event. Store activity time separately from creation time, category, place label, optional coordinates and optional story association. A repeat visit gets its own record. Place identity supports distinct-place counts without merging separate business branches.

Keep personal records private. Battle submission shares the selected photo, place and relevant detail with participants; private notes and contact details stay private. An encounter can be recorded through an object or setting rather than requiring a person's portrait. Store user photos in authenticated durable storage, separately from public editorial assets. Decode and resize uploads on the server, cap their size and remove embedded location metadata. Store the location the player knowingly supplies.

GPS can later suggest a pin with permission and a visible accuracy indication. Allow correction and manual entry. It helps recording and navigation; it is neither a participation condition nor proof of presence. Live navigation is a separate capability from the illustrated map.

## First implementation sequence

1. **One complete friendly battle.** Connect the existing Fruitful Lab accounts and game return paths, then let Susy and Stepan join the same prepared challenge, record a photo and manual location, submit discoveries, review each other and see pending versus confirmed points. Account-owned records and durable uploads are parts of this complete loop. Keep invitations inside the app. Verify membership, no self-approval, evidence revisions, recovery after sign-in and once-only rewards. Preserve local journals; any import is explicit and never assigns both local profiles to whoever signs in.
2. **Refine their game through real outings.** Make recording quick, show useful challenge progress, improve prepared prompts and integrate map, historical and language context around the shared activity. Judge changes by whether both people want to go out and play again. Add GPS or stronger offline support when their experience demonstrates the need.
3. **Later possibilities.** Revisit standalone solo collections and behavioral reflections, and separately consider the optional-account community experiment in [the roadmap](COMMUNITY_ROADMAP.md). Neither is a dependency of the two-person game; no public community launch is implied.

Success is a shared challenge that both players enjoy enough to go out and play again. The first acceptance exercise is for each player to sign in on their own phone, join the same challenge, document an unscripted discovery outside, retrieve it after signing in again and submit it for the other to review. Confirm that private memories remain available while a submission is pending, failed uploads preserve drafts, another account cannot read private media, and retries cannot inflate points. Test both languages, camera and library input, denied location permission, mobile layouts, keyboard access and reduced motion. More screen time is not a success criterion.
