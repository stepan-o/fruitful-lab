# Mexico city discovery game — complete experience specification

Version: 10 October 2026. Working reference only; the final title is undecided.
Canonical entry: https://www.fruitfulab.net/mexico-city.

This specification supersedes earlier notes that put solo and community outside navigation. The first playtest remains Susy and Stepan competing privately. All three modes belong in the app from the outset. Implementation status and deployment prerequisites are recorded separately in FIELD_VERIFICATION.md; this document does not certify a working external service.

## 1. Product promise

The city is where play happens. The phone supplies a reason to leave, helps orient the player, records an experience and resolves its consequences. The fundamental loop is choose → go outside → notice something → photograph and locate → record → review when required → receive points and map progress. Spontaneous discoveries are first-class actions; a player never has to accept a mission to keep a memory.

Spanish is the default, with complete English interface/content coverage. Place names retain their original names. The game reuses Fruitful Lab's email/password identity, users database, HTTP-only session cookie and backend /auth/me. No parallel game identity database.

## 2. Routes and entry

- /mexico-city: public landing. One clear promise, illustrated city, Enter/Continue, Try without an account, Game design, ES/EN. It is not the logged-in application dashboard.
- /mexico-city/game-design: public living design document; later becomes About. Include this spec's decisions, illustrative rules and implementation/service status.
- /mexico-city/play: persistent game shell. Unauthenticated visitors see the in-game login surface; mode/invitation destination survives login. Existing authenticated sessions enter directly.
- /mexico-city/play?guest=1: complete, temporary solo outing. Records/photos/scores remain in memory, disappear on reload/exit and never impersonate an account. Explicit finish screen; registration is optional, not an exit requirement. Automatic guest-to-account import is outside this prototype.
- /mexico-city/play?demo=1: explicitly labeled interface rehearsal with sample Susy/Stepan identities, separate from the guest product. Demonstrates multiplayer and community without claiming shared persistence. Resettable, no backend writes.
- /mexico-city/atlas: preserved illustrated learning experience and legacy local journal. Do not silently migrate old browser scores into authenticated competitive scores. Old borough/zone/place entry links continue to resolve into the atlas.

Use query state for active mode, selected story and invitation where appropriate. Browser Back first dismisses the current task/detail and returns to the prior map context. The map stays mounted when changing mode/sheet; page reloads retain account progress and intended destination but may reacquire GPS.

## 3. App navigation

Four persistent bottom destinations: Inicio, Aventura, Amigos, Comunidad. English: Home, Adventure, Friends, Community. The full multiplayer label is Retos entre amigos / Challenges with friends. A camera/Registrar hallazgo action is always within reach on the exploration surface; it is an action, not a fifth destination. The personal Bitácora is accessible from the header. Settings include language, account/logout, source/service information and reduced motion.

Inicio is a launch/resume surface: one useful next action, active challenge status and pending review count. Avoid a wall of dashboards. Empty state offers a short solo mission, create/join a group and a community mission. Returning players resume rather than repeat onboarding.

Aventura owns saved personal discoveries, system-authored short goals, optional history and Náhuatl learning, collections and a journal. A signed-in account owns durable progress; a guest owns only the current outing. Solo photo/location is a record, not peer-verification theater. Pattern-aware suggestions are a later extension once enough authentic history exists; no fabricated behavioral analysis.

Amigos owns private group membership, invitations, offers/active challenges, peer reviews, group scores and limited interaction cards. The same group powers Comunidad → Mi grupo. No duplicate membership or global ranking mixed into the group battle.

Comunidad has Mi grupo / Toda CDMX. My group displays the group's shared discoveries and geographic progress; All CDMX displays approved public contributions, small public missions, city logbook and a secondary global leaderboard. Guests may browse the public view; attributed publication and durable rewards require an account. Anonymous publishing remains a later policy decision, not silently treated as agreed.

## 4. Map contract

Preferred foundation: Google Maps JavaScript API with vector map ID, cloud styling and Advanced Markers. Our application owns all game controls, bottom sheets, selected-state UI, photographic pins, illustrated landmarks, history layers, coverage and scoring. Google supplies the maintained basemap/camera and, when explicitly integrated, Places and routing. Its complete consumer app is not embedded automatically.

The map reacts directly to touch: one finger pans; pinch zooms; no decorative layer steals background gestures. Explore at city, borough, neighborhood and street scales in one continuous geography. Area taps fit bounds with bottom-sheet padding; zoom-dependent density avoids label piles. Keep location/compass, layers and zoom controls usable by touch and keyboard. Recenter is explicit after the user pans away. Default north-up; elaborate tilt is optional rather than a navigation prerequisite.

Three spatial mission types: exact destination, search area without revealed answers, spontaneous discovery at a new point. Street names, neighborhood captions, parks, landmarks and subway connections provide orientation. Metro and Cablebús toggles persist at every scale and become more detailed with zoom. Airports and the surrounding metropolitan region remain reachable rather than clipping exploration at the city boundary.

Use current location only on explicit request; show accuracy/denied/unavailable states. A fixed crosshair in a place-selection task lets the player pan to correct a location. Manual placement always works. A GPS reading is evidence context, not automatic proof of attendance. Never expose live player locations to the public or other group members by default.

Map data freshness, GPS freshness and game-state freshness are separate. Display a dated source disclosure for our reference transit/history layers. Do not claim live station closures, arrival times, open businesses or operational airport connections from static geometry. The backend updates game records; the provider updates streets independently.

Without a configured/working Google service, use a genuinely draggable/zoomable local geographic reference map, retained official borough/Metro geometry and sourced central streets. It must clearly say reference map/date, preserve custom marks and allow manual placement. Never quietly label that fallback Google or live. Google load/auth failures produce a recoverable state, not a blank map. A map provider key/map ID and working authorized-domain configuration are deployment prerequisites.

For this prototype, walking/transit directions open a provider directions link and preserve the game task on return. Integrated search and route drawing are optional capabilities of the map adapter and must be marked unavailable if not enabled, not represented by fake results. Landmark/our-discovery search is always local and usable.

## 5. Map-based storytelling and identity

White background, airy composition, dark green ink, coral action accents, warm yellow rewards and botanical green progress. Editorial serif headlines paired with clear compact sans-serif controls. Illustrated landmarks and collectible photo cards, not generic dashboard tiles. Existing generated drawings and credited archive/modern photographs remain in use; images are never used as player evidence.

At broad scale prioritize city structure and illustrated anchors; at street scale prioritize accurate geography and legibility. Paint the city means accepted contributions reveal meaningful progress, not hiding streets or claiming an entire borough is complete after one photograph. This prototype counts discoveries/represented neighborhoods without claiming comprehensive territorial completion.

Stories begin from a place and open as focused optional photo narratives. The orientation chapter covers pre-Hispanic settlement, lake Texcoco, causeways, modern zones and transit relationships. Preserve sources and distinguish reconstruction from archival evidence. Náhuatl learning has its own short games; do not claim a general language course from a small historical word set. Learning rewards are modest and once per exercise. Quizzes are not mandatory gates or huge score multipliers: that design remains disputed.

Motion connects states: short geographic camera transitions, marker selection, sheet movement and a brief earned-reward response. Honor reduced motion. No looping decorative work while hidden, and no sound without opt-in.

## 6. Discovery record and evidence

Required: authored title, category, photo, coordinates and place description. Optional: note and selected mission. Capture/upload produces a bounded compressed raster; reject unsupported/oversized files and show a retryable error. Photo previews retain layout dimensions. Store normalized photos separately from metadata; use protected access for private/group evidence. Preserve the record if public publication is declined.

One underlying record belongs to its author. Separate explicit actions attach it to an eligible group challenge or propose publication. Default private. Sending group evidence does not grant public permission. Public data includes only intentionally shared fields; account email and raw device/photo metadata are never public. Strip photo metadata on normalization.

Record statuses: private saved; group submitted / clarification requested / confirmed; public pending / approved / rejected. These are independent. Pending scores are visibly separate from earned points. Empty/error/saving/uploading/offline states must be designed, not silent success.

## 7. Rules used by the prototype

Numbers are provisional and visible before commitment. Personal discovery: +30 once per record. Duel examples: +100 confirmed, −25 if accepted then forfeited/expired without submission. Reward/loss and 10-minute/one-hour/one-day windows are selected from bounded choices. A proposal has no countdown penalty until accepted; offers can be declined without loss. This is a balancing recommendation for the prototype, not retroactive agreement about automatic hostile challenges.

Lifecycle: offered → accepted/active → submitted → confirmed. Alternate branches: declined; active → expired/forfeited; submitted → clarification → resubmitted → confirmed. The server clock governs account play. On-time submitted or disputed evidence never expires while waiting for review. Expiry/confirmation settles at most once. A reviewer cannot confirm their own evidence. Duplicate/retried commands do not duplicate records or rewards.

Group score derives from resolved challenges, separately from lifetime personal learning/discovery points. Global rank derives only from approved public contributions. One discovery can satisfy several explicitly eligible goals, but each outcome has a unique settlement key; there is no automatic triple award for opening three modes.

Together challenges award the announced cooperative bonus after each participant has supplied evidence and the other has confirmed it. They do not award both players from a single upload. Category blocks are visible, bounded, temporary group cards: at most one active card per sender, no stacking, no deleting memories/earned points, and no retroactive invalidation of an already accepted conflicting challenge. Limit spam rather than enabling unbounded punishment. Final balancing, play windows and shields remain playtest decisions.

Group membership uses a shareable invitation that the player explicitly copies. No automatic messages or emails are sent. Joining requires a signed-in account. Only members see evidence and issue/review eligible challenges. Public review is a separate moderation permission. Sample/demo identities have no authority over real account records.

## 8. Persistence and service boundaries

Authentication reuses the existing /api/auth/login → backend /auth/login → /auth/me contract and cookie. Add a narrowly allowed /mexico-city/play return destination for every authenticated role without changing existing role defaults. Signup must create ordinary active users with no caller-supplied roles/groups/admin flags. Do not expose the existing internal UserCreate registration contract as-is.

Account records, memberships, challenges, review decisions, learning completions and photos live in the FastAPI/Postgres backend. Schema changes require an additive Alembic migration. Authorize every backend read/write and photo read, independent of visible UI. Server calculations own points, deadlines and reviewer identity. Retried mutations use stable IDs; concurrent group mutations lock/recheck state. Frontend cookie proxies must not expose bearer tokens or cache personalized responses.

Photo storage in Postgres is acceptable only as a bounded two-player prototype implementation; document per-photo and per-user limits. Production object storage, scanning, retention/export/deletion policy and scalable media delivery are follow-up work. Never pretend browser-local storage is cross-device account persistence.

Guest/demo state is separate and memory-only. No credentials or photos in analytics, URLs or logs. Game analytics use existing dataLayer helpers only if added. No location telemetry by default.

## 9. Complete screen/state checklist

Landing; returning-account entry; login; signup; invalid credentials; service unavailable; guest welcome/finish; game home; solo goal selection/detail; continuous map; layer controls; denied GPS/manual pin; local place search; discovery capture/retry; personal journal/detail; group create/join/invite; empty group; challenge compose/offer/accept/decline; countdown/expiry; evidence submission; reviewer confirm/clarify; cooperative activity; category card; group score; group map/logbook; public goals/map/logbook/ranking; publication review; story; orientation quizzes; Náhuatl games; settings/logout; explicit demo controls/reset.

Avoid dead-end placeholder buttons. When a capability depends on unavailable external configuration, provide an honest fallback and a precise service-status explanation. Existing learning assets remain accessible throughout the prototype.

## 10. Acceptance and verification

Test phone widths 320/390, tablet 768 and desktop 1440; portrait/landscape, browser Back, keyboard, reduced motion and safe-area navigation. No page overflow, overlapping tap targets or modal focus loss. Map pan/pinch/zoom and place selection remain responsive underneath game artwork. Preserve camera state between modes. Measure initial image transfer against the project's 350 KB mobile / 800 KB desktop budget; keep Google service payload separately reported.

Exercise real local account flow with two isolated browser sessions: signup/login → create/join group → issue/accept → upload photo + pin → peer review → reload/cross-device score consistency. Test self-review rejection, nonmember/other-user photo access, public/private separation, invalid upload, duplicate command/review, expired challenge and submitted-before-expiry behavior. Guest refresh must clear records and never write account state.

Run frontend CI and backend tests. Verify an actual production build, not just component previews. Check preview deployment routes and record service/migration/key prerequisites. Google adapter contract tests and fallback browser checks do not constitute a real authorized Google Maps test; separately record that result. Physical outdoor usability, battery/network behavior and genuine enjoyment require owner playtesting and remain unmeasured until done.

## 11. External references

- Google map interaction: https://developers.google.com/maps/documentation/javascript/interaction
- Advanced Markers: https://developers.google.com/maps/documentation/javascript/advanced-markers/overview
- Styling: https://developers.google.com/maps/documentation/javascript/cloud-customization
- WebGL overlays: https://developers.google.com/maps/documentation/javascript/webgl/webgl-overlay-view
- Directions links: https://developers.google.com/maps/documentation/urls/get-started
- Google Places storage/display boundaries: https://developers.google.com/maps/documentation/places/web-service/policies
- CDMX static GTFS: https://datos.cdmx.gob.mx/dataset/gtfs (inspect feed dates, not just portal modification date).
- Existing geographic, historical and photographic provenance: SOURCES.md and assets/sources/mexico-city/references.json.
