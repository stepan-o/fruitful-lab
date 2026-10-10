Fruitful Lab accounts and signed-in game (2026-10-10): `/admin/users` now manages ordinary shared users (search, create pending player, edit name/game directory label, pause/restore and private one-time setup/reset links). Game entry and `/login` expose login/create/recovery; Spanish is default. Backend `/admin/users*` is admin-only; legacy `/auth/register` now requires admin authority because it accepts role groups. Public `/discovery/register` stays ordinary-only and adds the `mexico-city` directory label. `/auth/password/forgot` and `/auth/password/reset` provide generic-response recovery and single-use password reset. Backend Resend settings (`RESEND_API_KEY`, `ACCOUNT_EMAIL_FROM`, trusted `ACCOUNT_PUBLIC_ORIGIN`) are required for email; private administrator links work without them. New head `3acct101026` follows `2cdmx101026`, adding hashed access tokens and `users.session_version` for session revocation. Railway config includes migration before startup. Reset document `/account/reset` excludes analytics and third-party scripts, strips its fragment token and uses CSP/no-store/no-referrer. See `docs/user_management.md` for rollout, CLI bootstrap and limitations; production delivery remains to be configured and verified.

Signed-in game presentation now waits for server state before rendering scores; shows actual identity/email, discovery/learning totals, per-group competition, contributions and pending challenge/review actions. Home suggestions favour less-explored categories. Matching solo evidence records `goalId` and completes the selected outing; unrelated/challenge photos preserve it. Historical records are not retroactively marked as completed goals. The explicit guest/demo modes remain temporary and do not enter an authenticated player's state.

Mexico city discovery game — field prototype (2026-10-10): `/mexico-city` is now the public landing; `/mexico-city/play` is the account game with Inicio/Aventura/Amigos/Comunidad, Spanish default and English throughout. `?guest=1` is an in-memory solo outing; `?demo=1` is a separately labeled, in-memory Susy/Stepan rehearsal with all modes. `/mexico-city/game-design` renders `ExperienceDesign.tsx` and the current full experience proposal; `docs/mexico-city-discovery/EXPERIENCE_SPEC.md` supersedes earlier scope proposals. The old illustrated map, learning and local journals remain at `/mexico-city/atlas`; old borough/zone/place links redirect there. Working reference everywhere: “Mexico city discovery game”; legacy storage keys stay unchanged.

Account game contract: reuse `fruitful_access_token` and backend `/auth/me`; login accepts `/mexico-city/play` for all roles. `/api/mexico-city/[...path]` proxies an allowlisted set of `/discovery/*` endpoints. `/discovery/register` creates ordinary users only; the legacy group-capable `/auth/register` is now administrator-only. Profiles, bounded private groups, normalized photos and records persist in Postgres using additive migration `2cdmx101026`; backend deployment + migration are required for shared play. Database query parameters are hidden from logs. Personal records earn 30; group scores derive only from confirmed challenge rewards or expired/forfeited stakes; public rankings derive only from approved contributions. Server authorization, row locks, stable record IDs and immutable settled evidence guard outcomes. On-time evidence does not expire while awaiting review; cooperative activities require both submissions before expiry. Publishing is separate from saving/group review and requires explicit consent plus admin moderation by someone other than the author. Prototype photos are bounded JPEGs in Postgres; object storage, abuse controls, revocable invites and retention/deletion remain follow-up work before broad public use.

Map contract: Google vector Maps JavaScript + Advanced Markers when both `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` and `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` are configured; browser-visible config protected by website/API restrictions, not server secrets. Missing/failed configuration uses a genuinely pan/zoom-capable, dated geographic fallback. Custom photo/illustrated pins, boroughs, neighborhood labels, Metro/Cablebús and historical reference remain available. GPS is explicit and manual pins work without it. Transit overlays are dated reference, not live operations; directions open Google Maps and in-app search is currently game content only. Existing historical stories, source credits, six-part city chapter and Náhuatl games remain optional; no quiz gates or competitive multipliers. Sources/media rights remain in `docs/mexico-city-discovery/SOURCES.md`; setup in `GOOGLE_MAPS_SETUP.md`; implementation evidence in `FIELD_VERIFICATION.md`.

Loopforge live status feedback (2026-10-08): `/stepanoskin/loopforge/play` now connects active camera readouts, supervisor portrait statements and instrument details to the public event record. The pure `first-shift/feedback.ts` adapter separates Confirmed / Observed / Statement, routes inspection to existing actions and never imports hidden state. Evidence dialogs pause advances; debrief tokens reconcile permanent allocation and known wear. Load resolutions and actual losses have immediate authored remarks; the adviser channel shows the current response after plan approval. No kernel, command, balance or wire-schema change. Later arcs and information propagation remain unimplemented. See `docs/loopforge/STATUS_FEEDBACK_IMPLEMENTATION.md`.

Loopforge expression and core-loop research (2026-10-08): the design board now starts with `#player-desires`, then `#loop-study`, then the long arc. Sources of truth are `docs/loopforge/game-design/player-desires.json` and `core-loop-study.json`; generated records are `PLAYER_DESIRES_AND_SCENARIOS.md` and `CORE_LOOP_STUDY.md`. Seven expression anchors lead into conditional scenarios; nine loop patterns, five credited editorial gameplay figures and counterexamples inform the synthesis. Part 01 now proposes 4–5 complete days (roughly 6–8 minutes), subject to readiness/investment rather than a calendar unlock. All five Act 1 stages specify player commitment, direct status, observable indirect signs, hidden state and next choice. Status tokens project permitted evidence; author traces retain causal history for later discoveries. These are design proposals and review materials, not implemented multi-day balance or proof of fun. Competitor screenshots are editorial-only; `core-loop-media.v1.json` records owners, sources and publication basis.

Loopforge daily pacing (2026-10-08, owner direction): the one-second console loop is a good baseline. The one-minute loop is the entire game day, including adviser choice, brief/plan, production, warranted decisions and permanent output allocation: about 60 seconds routine, two to three minutes at most for heavier days. The previous three-shifts-per-thirty-minutes proposal is discarded. `docs/loopforge/ONE_MINUTE_LOOP.md` inventories flow, interface ownership, existing code and remaining choices; the Core loops design tab carries the revised cadence. This is design direction, not a runtime timing or balance change.

Sanctuary platform financial comparison (2026-10-08): chapter 2’s existing
`sony-history` exhibit / `#playstation-history` anchor now offers PlayStation,
Xbox and NVIDIA cases. Sony controls remain; Microsoft FY2017–FY2026 and NVIDIA
FY2020–FY2026 add revenue/YoY histories, selected-year details and sourced
milestones. Xbox category growth is available from FY2021, with no inferred
category dollar split. NVIDIA Gaming is explicitly broader than GeForce NOW;
undisclosed cloud revenue/profit stays absent. Fiscal calendars and revenue
scopes differ. `publisher-ecosystem` is a separate copy-count figure after the
Xbox/NVIDIA comparison prose. Sources and placement:
`docs/sanctuary/PLATFORM_FINANCIAL_CASES.md`.

Sanctuary PlayStation history (2026-10-08): chapter 2 adds the typed `sony-history`
exhibit after the PS5 opening and FY2025 revenue-scale paragraph (paragraph 1). Original interactive charts show Sony G&NS
revenue by broad category and operating profit for FY2016–FY2025, with separately
labeled scales, source-backed milestones, fiscal/accounting boundaries and exact
data. Selecting a category isolates and rescales its revenue; All revenue restores
the stack. Revenue and profit display USD converted with each year’s own annual
average JPY/USD rate. A second view groups category YoY changes around zero on
one shared percentage scale; FY2016 is a base year. Chart annotations mark PS5
news, launch and supply constraints, with sourced year details. Raw JPY and FX
remain in the disclosure table. The year readout includes a solid 100% revenue
stack, dashed prior-year proportions and bracketed share shifts in percentage
points, preserving the full total under filtering. Its detail stack reads top to
bottom with the category list; direct percentages and hover/focus/tap tooltips
identify each segment and its prior-year comparison. A separate FY2025 first-party/other-publisher comparison uses copies
sold, with the unavailable money split and gross digital revenue basis explicit.
No new asset pack or runtime dependency. Dataset and methodology:
`docs/sanctuary/SONY_FINANCIAL_HISTORY.md`. The accompanying prose moves from PlayStation’s scale into Microsoft earning as publisher on Sony’s console, Call of Duty’s competing purchase/catalog offers, and NVIDIA’s computing business. These concrete choices connect the three ecosystems to later monetization analysis and the economic bridge to Valve. Add-on definitions and revenue/profit boundaries remain with the chart; the early Sony-history detour is omitted from the reading passage.

Sanctuary chapter 2 editorial revision (2026-10-08): the current narrative follows
one creative work supporting connected businesses, through Sony’s early PS5
hardware losses and CD PROJEKT’s Cyberpunk catalog deal. Both diagrams open their
modern examples on Cyberpunk; the first retains separate studio and publisher
roles across PC, PlayStation, Xbox and NVIDIA. Console purchase/catalog choices
do not imply a PC catalog entitlement for NVIDIA. The approved first chapter is
unchanged. Current copy and evidence boundaries: `docs/sanctuary/CHAPTER_TWO_MANUSCRIPT.md`.

Loopforge integrated producer consoles (2026-10-08, current implementation): `/stepanoskin/loopforge/play` now offers only four skins: Foundry desk, Broadcast control, Dispatch office and Obedience organ. Each has a distinct wide composition and a newly authored portrait plate. Start shift lands at the console; Answer leadership is the first gameplay action. Acknowledge quota unlocks the internal selector and dedicated adviser/brief/placement screens; early dismissal stays locked. This is an in-memory presentation gate, not an engine command. Appearance switching pre-decodes both orientations and focused equipment without resetting the run or unfinished choices. `ResizeObserver` selects six-camera wide/tall-portrait arrangements or a single-camera channel selector for narrow/short space, including a camera-left/control-right landscape mode. Camera selection survives resizing. The native beacon uses bounded local impulses; room art, labels, facts and commands remain independent of the painted shell. The previous six themes remain historical/internal equipment only. No kernel or API change. Current authority: `docs/loopforge/PRODUCER_CONSOLE_DIRECTION.md`; execution/verification: `PRODUCER_CONSOLE_IMPLEMENTATION_PLAN.md`. Review gallery: `/stepanoskin/loopforge/design#producer-console`. Sources/prompts/provenance: `apps/lab/assets/sources/loopforge-producer/` and `loopforge-producer-runtime/`; immutable packs `loopforge-producer-studies` and `loopforge-producer-runtime`. Technical/visual checks do not imply owner acceptance.


Loopforge focused console (2026-10-08, historical pre-integrated checkpoint): the material-only action-column composition is superseded. Start shift opens a six-camera wall with two active feeds, four unpowered glass screens carrying only handwritten room names, and speaking supervisor tokens. Intercom, placements, room focus, dispatch, debrief, development and records each use a focused workspace; incidents/help/instruments/settings are native dialogs. All six kits now have monitor, socket and three control-state assets. Original dispatch/logistics/lobby art provides separate interface settings without adding managed rooms. The read-only `/stepanoskin/loopforge/play/console-study` compares first-turn and six-feed density. Navigation and theme/menu changes retain draft choices above the unchanged deterministic KVP run controller. Source contract: `docs/loopforge/FOCUSED_CONSOLE_REBUILD.md`; production assets/provenance: `apps/lab/assets/sources/loopforge-focused/`. Technical/visual checks are recorded separately from owner acceptance.

## Loopforge interface ownership — 8 October 2026

Current continuation on `codex/loopforge-director-console` / PR #99: factory overview owns six cameras and compact facts/action access; Choose adviser opens a separate scalable roster (two available, five channels on first day). Appointment precedes a dedicated brief and placements. Opening weekly leadership call uses new full-screen original art and an alpha soot vignette, with lower captions/mandate; routine chrome and beacon are hidden. New cadence is 12-second quiet entry / 18-second repeat with bounded impulses. No kernel, worker-state or KVP/HTTP contract change. Read `docs/loopforge/LIVING_CONSOLE_DIRECTION.md` and `CINEMATIC_INTERFACE_DIRECTION.md`; review verification status there before treating this as owner-approved.


Loopforge equipment and impulse light (2026-10-08, preceding checkpoint): all six style directions are implemented as selectable runtime material kits in the game start menu and in-run Settings. No winner is selected. A controlled author workbench combines monitor/socket and complete control-state families; source masters, prompts and crop recipes are under `apps/lab/assets/sources/loopforge-themes/`. Immutable theme manifests are pinned at build time. Switching is transactional and preserves the active run and local uncommitted choices. Theme preference persists; the first-day run remains in-memory only. The shared, almost flat overhead beacon is dark between brief cyan-idle, green-production, red-accident and amber-attention impulses, with bounded screen-space occlusion. No kernel/API contract changes. The Themes & assets board tab and `UI_THEME_ASSET_SYSTEM.md` / `CONSOLE_LIGHT_FEEDBACK.md` document ownership, asset delivery and feedback. The broader six-camera/focused-interface composition remains pending owner review; this material comparison does not clear that gate.

Loopforge style review (2026-10-08, historical checkpoint): `/stepanoskin/loopforge/design#ui-styles` presents the accepted baseline plus five agent-generated material alternatives, with enlargement and two-sheet comparison. At that checkpoint no direction was selected and the playable skin was unchanged. `CAMERA_CONSOLE_ART_DIRECTION.md` fixes the black powered-off monitors, handwritten room tapes and speaking supervisor tokens; `ONBOARDING_DESIGN.md` separates general guidance from the current day's choices. That checkpoint awaited owner selection or requested competing compositions; the six-preset update above supersedes it. Sources/prompts remain in `apps/lab/assets/sources/loopforge-camera/`; review derivatives use the immutable `loopforge-ui-studies` pack.

Loopforge interface review (2026-10-08, prior rejection): the owner rejected PR #99's game-interface composition and visual coherence. Its technical checks remain a baseline, not visual acceptance. `docs/loopforge/INTERFACE_JOB_STUDY.md` records the reference study required before new layouts, asset generation and implementation. Design for the complete first floor: all six camera feeds visible from turn one, two rooms initially available, four sealed; the current progression target is all rooms unlocked through mastery within roughly 10–20 minutes. Engine and runtime code are unchanged by this research pass.

Loopforge director console (2026-10-08): the first-day interface is rebuilt around the original sim-sim metal/glass materials, authored control states and new identity-preserving LIMEN/STILETTO portraits. `/stepanoskin/loopforge/play` opens directly in the paused factory console with confirmed facts, weekly quota and no assignments. Adviser choice, illustrated briefing, plan override, continuous shift, delegated actions, other-room decisions, irreversible dispatch, debrief and causal records share that console. Phone layout places the decision before secondary camera controls. The immutable `loopforge-console` pack records sources and prompts. Engine/schema/command authority is unchanged. See `docs/loopforge/UI_REBUILD_PLAN.md` for gates and `UI_REBUILD_VALIDATION.md` for evidence; agent verification is not owner enjoyment approval. The live tick-fed 3D view remains future work; original Sim4 is Pixi isometric, and Babylon.js remains a research candidate.

Loopforge first-turn prototype (2026-10-08): `/stepanoskin/loopforge/play` now serves the adviser-first day: direct console entry, LIMEN or Stiletto briefing, placements, continuous camera shift, authority-sensitive decisions, permanent daily output allocation and causal records. The previous teaching console remains at `/stepanoskin/loopforge/play/teaching`. `/stepanoskin/loopforge/design` rewrites to the migrated static design board; authored `docs/loopforge/game-design/design-data.json` was preserved during migration and remains the source for subsequent revisions. `/stepanoskin/loopforge/engine-notes` explains implementation boundaries.

`POST /api/loopforge/first-shift` owns bounded deterministic replay through `lib/loopforge/first-shift/`. The pure integer kernel uses per-robot identities and component tables from the opening; counts are derived. Ten-, 24- and 100-worker scenarios share the same systems. The private player projection, versioned HTTP snapshots/ordered operations and viewer reconstruction are separate. This is a new KVP application profile, not legacy wire compatibility. No LLM calls, repair, daily cash settlement, cloud save or account integrity in this one-day slice. Original immutable artwork and optional recorded/procedural SFX support the console. The `loopforge-sfx` pack supplies cropped CC0 menu, RESET and shift mechanism cues; slow/failed sample loads retain the procedural fallback. `/stepanoskin/loopforge/design#sound-library` provides six user-activated previews, crop/source notes and remaining sound needs. Its gate and ambience are audition-only. Source inventory and reproduction recipes live in `apps/lab/assets/sources/loopforge-sfx/`; no simulation contract changes. `docs/loopforge/EXPERIENCE_DIRECTION.md` establishes the landing conveyor's physical behavior as the guiding UI/audio principle. Read `FIRST_SHIFT_ENGINE.md` and `FIRST_SHIFT_VALIDATION.md` before extending this path.

Sanctuary opening split (2026-10-08): chapter 2, `studio-to-screen`, now contains the business-chain illustration and market map with a short connecting argument. Chapter 3, `three-ecosystems`, holds the Sony/Microsoft/NVIDIA financial comparison, credited acquisition portfolio, Cyberpunk catalog deal and subscription emphasis. Old chapter-2 links to `#playstation-history`, `#publisher-ecosystem` and `#acquired-worlds` redirect to the new chapter; `#market-map` remains in chapter 2. King/mobile follows as chapter 4 and Valve as chapter 5, making 35 chapters. Existing downstream IDs remain valid. Editorial use records and chapter-scoped embedded assets follow the moved media. Current manuscripts: `CHAPTER_TWO_MANUSCRIPT.md`, `CHAPTER_THREE_MANUSCRIPT.md`, `MOBILE_FREEMIUM_MANUSCRIPT.md` in `docs/sanctuary/`.

Sanctuary complete narrative rebuild (2026-10-08): the reader now has 35 chapters
in seven acts. The approved Pong opening is preserved. The business chain leads
through Sony/Microsoft/NVIDIA, King/mobile freemium, Valve, Epic, Rockstar, BG3/Diablo IV, production economics, cloud delivery,
world creation and Concord. Four consecutive Diablo history chapters establish
the original game, D2, D3 and D4 before Gauntlet opens the system analysis.
All downstream prose has been rebuilt around player experience, production
commitments, the next offer and the evidence needed to assess it. Existing IDs
remain valid; diablo-second-life, diablo-market and diablo-service are new.
Inline exhibits use typed chapter metadata. Four original history illustrations,
an interactive history comparison and a Valve handheld study augment sourced
art. New media uses the existing immutable manifest/file and short-pointer
pipeline, with per-work provenance and editorial-use records. English editorial
prose remains English; the existing six-language navigation contract is unchanged.
The full manuscript is docs/sanctuary/COMPLETE_MANUSCRIPT_2026-10-08.md;
the implemented sequence and evidence boundaries are in NARRATIVE_SPINE_2026-10-08.md.

Earlier implementation notes below are historical checkpoints; the complete
edition above supersedes their chapter counts and pending-rewrite status.

Sanctuary company chapters (2026-10-08, local): Valve → Epic → Rockstar now
occupy chapters 3–5, followed by platform agreements, cloud and purchase history.
Chapter 2 hints at Valve’s move into hardware; chapter 3 explains the existing
library/device relationship, lists its game catalog with credit/status boundaries,
and replaces the generic equipment shop with an original Steam Deck study.
Epic opens with Unreal’s 1998 origin and technology becoming a creator product.
Rockstar develops durable worlds/franchises through core loop and theme. Shared
1997–1998 game milestones are not claims of identical company founding dates.
Chapter IDs, chapter count, chapter 1 and asset/cache contracts are unchanged.

Sanctuary chapter 2 editorial pass (2026-10-08, local): eight paragraphs connect
creative choices to production funding and to the hardware an audience can use.
The operator-owned cabinet → household computer/console → provider-owned cloud
machine thread is explicit, including the separate game purchase/catalog choice.
Hardware cost and capability affect reach; streaming retains device and network
requirements. Valve’s hardware survey supplies an additional primary citation.
CD PROJEKT’s catalog decision and the bridge to Steam remain. The market map
follows paragraph 3; the Cyberpunk promo follows paragraph 4. Manuscript and
editorial guide preserve this hardware layer for the later history. Diagram
behavior and chapter 1 are unchanged. See CHAPTER_TWO_MANUSCRIPT.md.


Sanctuary Cyberpunk worked example (2026-10-07, local): after chapter 2’s
market map, the essay explains console catalog access, NVIDIA’s separate PC
computing service, and the published Sony-deal rationale. Xbox’s Cyberpunk
catalog route now appears in the map for console/Xbox cloud only. No private
contract amounts or PC-exclusion motive are inferred. The worked example uses Sony’s dated Cyberpunk / PlayStation Plus catalog
promotion, with optimized derivatives and a specific rights-use record. Night
City art remains in the dedicated cloud chapter. Manuscript and citations align.

Sanctuary cloud access comparison (2026-10-07, local): chapter 2 now holds
Forza Horizon 5, Playground Games, Xbox Game Studios and GeForce NOW fixed
between Steam purchase and PC Game Pass access. Store art, prose and citations
match. The dedicated cloud chapter still compares Cyberpunk local/cloud play
with a fixed Steam purchase. No new assets or animation work. This supersedes
the overview’s previous Cyberpunk purchase / Forza catalog pairing.

Sanctuary console access options (2026-10-07, local): PlayStation, Xbox and
Cloud play share Purchased game / Catalog membership controls. Console examples
hold Spider-Man 2 + PS5 and Forza Horizon 5 + Xbox constant; access, payment,
publisher readout and illustrated storefront change together. Hardware remains a
separate purchase. PlayStation, Xbox and Cloud play now open on Purchased game as a common
comparison point; catalog access remains an explicit alternative (8 October). Availability and scope are recorded in
`docs/sanctuary/BUSINESS_CIRCUIT.md`. No asset/cache contract changes.

Sanctuary cloud circuit correction (2026-10-07, local): all video-game routes
now show five separate roles, including CD PROJEKT RED as both studio and
publisher. Purchased and catalog cloud access each reach the player directly;
NVIDIA supplies computing on a parallel branch, with no store-to-NVIDIA resale
edge. The dedicated Cyberpunk local/cloud comparison retains the same five
roles. Sources, paired selection tests and layout are aligned. See
`docs/sanctuary/BUSINESS_CIRCUIT.md`. This supersedes earlier four-box cloud notes.

Sanctuary market routes (2026-10-07, local): chapter 2 closes with a game-first
interactive map before the Valve bridge. Developer/publisher stay fixed; access
and computing choices preserve compatible selections. Diablo IV, Cyberpunk,
Forza Horizon 5, Fortnite and Spider-Man 2 expose cross-company purchase, catalog,
local/cloud and bundled/free routes. Sony/Microsoft presets retain integrated
studio-to-console or studio-to-cloud examples. Alternate connections stay visible.
This replaces the earlier company-footprint map. Sources and compatibility scope
are documented in `docs/sanctuary/MARKET_MAP.md`. No media/cache contract changed.

Sanctuary business-act revision (2026-10-07, local): 29 chapters. Chapter 2
uses the business circuit to distinguish the game purchase/catalog bill from
hardware purchase/computing access. Tabs: Arcade → PC purchase → PlayStation →
Xbox → Cloud play → Netflix. Cloud defaults to a bought Steam copy + paid
GeForce NOW; an optional PC Game Pass route shows two recurring bills. These
are selected offers, not exclusive platform identities. Valve immediately
follows chapter 2, then platform agreements → cloud → history → Epic → Rockstar
→ Concord. Gauntlet opens the next act, followed by `the-fork`. Stable IDs and
chapter-scoped versioned media remain intact. Valve/Steam marks and the credited
Counter-Strike 1.6 menu join the Half-Life citation; public rights records state
an editorial rationale rather than publisher clearance. PlayStation’s original
store illustration has a distinct source-informed web composition. See
`docs/sanctuary/BUSINESS_ACT.md` and the two chapter manuscripts. Chapter 1 is
unchanged; this supersedes older order/count notes below.

Sanctuary visual provenance (2026-10-05): the reader's collapsed “Visual sources
& use” index links only the active chapter's cited images, embedded marks and
referenced cover works to their source and stable rights-register anchors.
`lib/sanctuary/visual-sources.ts` derives that list; `Reader.visualSources` carries
only compact link records. `/stepanoskin/game-monetization/credits` retains named
credits, source, license/use basis, review date, treatment, analytical purpose and
provenance limits. It no longer publishes the original-art atlas. Descriptions,
composition and motion rationale remain internal in `graphic-descriptions.json`,
`visual-notes.ts` and `docs/sanctuary/VISUAL_ATLAS.md`. Do not repeat captions or
explain our graphics in public source records. Chapter 1's approved prose is unchanged.
Arcade screen loops are CSS transforms gated by `useLivingPlate`; they are
original demonstrations, not game emulation. Sanctuary has its own dark viewport
metadata/safe-area treatment and a menu-return link on its cover and chapters.

Sanctuary arcade imagery (2026-10-04): the opening adds five sourced Pong/Gauntlet
images in the reproducible `sanctuary-arcade` pack. `lib/sanctuary/media.ts` combines
reviewed inventories server-side; only the current chapter’s metadata reaches the
reader. `arcade-media.json` feeds the public source register, including the Pong
photograph’s CC BY 2.0 attribution. Static optional screenshot outlines separate
score, health, drop-in slots and the coin exchange. Full originals stay non-public;
responsive derivatives retain the existing immutable-file/pointer cache contract.

Sanctuary editorial authority (2026-10-04): `docs/sanctuary/NARRATIVE_SPINE.md`
supersedes the earlier evening/venue implementation map below. The first chapter
opens with creative production and funding, then develops Gauntlet through
cooperation, operator settings and its ending. No autobiographical setup. The
complete reading manuscript is `docs/sanctuary/OPENING_MANUSCRIPT.md`. Opening art
precedes prose; captions/controls do not restate the essay, and takeaways are
optional. Later chapters remain under editorial review; the previous inventory
is not a quality sign-off. Routes and media contracts are unchanged.

Sanctuary evening/venue revision (2026-10-03): the current narrative authority is
`docs/sanctuary/EVENING_NARRATIVE_MAP.md`. The opening is now “Insert coin. Join
in.”: an imagined venue and documented Pong setting precede Gauntlet and the
operator controls. The room/world comparison returns in chapter three. Seventeen
chapters connect player purpose, provision, payment and consequences; the five
remaining case-study arguments were reviewed and retained. This refines the
arcade-first sequence below without adding routes or changing media contracts.

The study entry is now hero + one CTA only. The financial inscriptions pair spectral future sales, an abyss for the gap, and subscription invitation/renewal as one mechanism; controls and credits remain inside the chapters.

Sanctuary arcade-first revision (2026-10-03, local): the 22-chapter reader now
starts at `insert-coin` (Gauntlet), continues to `several-histories` (the purchased
copy and later offers), then `the-fork` (creative economics and BG3/D4) and Concord.
All previous stable URLs remain. The new SVG cabinet compares player/operator
perspectives without continuous work; `Figure.afterParagraph` positions existing
immutable evidence images inline. The overview, metadata, counts and navigation
follow the new order. Cinema/catalog artwork and the later diptych are preserved.
This supersedes the opening order recorded below; later chapters remain iterative.
See `docs/sanctuary/NARRATIVE_REBUILD.md` for research boundaries and scope.

Stepanoskin landing design brief (2026-10-03, revised after visual feedback): `docs/stepanoskin/DESIGN_GUIDELINES.md` is the landing-specific authority. Almost empty white, centered solid block typography with level baselines and coherent extruded depth. Stepan Oskin sits at the top with slight emphasis. DATA SCIENCE is the dark primary choice, with professional CV floating beneath/behind it; GAME MONETIZATION, GAME ENGINES AND LLMs, and ABOUT are equal gray peers. Refined faces, small shadows, idle float, hover lift and the shared selection clang; performance is paramount. This supersedes the pastel/card and strongly rotated pixel-grid drafts.

Sanctuary context visuals (2026-10-03, local): the opening now uses the economics of creative work and audience attachment as its lens, with a cinema/Netflix comparison and the 2013 Adobe transition. `sanctuary-context` is a separate immutable asset pack; `lib/sanctuary/context-media.json` feeds its source records into the public credits page. The original SVG master and responsive logo derivatives are stored with the project; bounded CSS atmosphere pauses offscreen and with motion preferences; no new dependencies. See `docs/sanctuary/NARRATIVE_REBUILD.md`.

# Project Memory - Fruitful Lab

Sanctuary public editorial edition, 2026-10-03: selected publisher imagery is now
part of the normal presentation alongside original plates and diagrams. The
`sanctuary-editorial` immutable pack publishes the 24 images used by the manuscript;
`editorial-media.json` records source, owner and per-image analytical purpose.
Only active-chapter metadata reaches the client. Large inspection images mount
on demand; 480px variants supplement the existing optimized WebPs. The optional
private archive and gated research endpoint remain for source work, not a second
reading edition. No flag is needed to see the selected screenshots. Public
`/stepanoskin/game-monetization/credits` includes dated source excerpts and
ownership notices. This is an editorial publication decision, not legal clearance.
See `docs/sanctuary/EDITORIAL_MEDIA_RIGHTS.md`. Publisher assets are not licensed
for reuse in Loopforge. Preserve the original animated opening diptych.

All Fruitful Lab projects inherit `docs/DESIGN_AND_PERFORMANCE_STANDARDS.md`:
rich visuals, efficient delivery/motion and excellent mobile behavior are one
acceptance requirement. Field Web Vitals are targets until actually measured.

Sanctuary audience revision, 2026-10-03: do not assume readers play games or know
Diablo. Keep the industry depth, introduce key games/studios/systems in context,
and make directly linked chapters understandable without a gaming primer.
`docs/sanctuary/AUDIENCE_AND_CONTEXT.md` records the researched wider economic
and social frame, bounded non-gaming comparisons and 21-chapter introduction
audit. This supersedes the earlier veteran/D2 audience assumption. The brief
guides the ongoing local copy pass; it is not a completed manuscript revision.

Sanctuary design system, 2026-10-02: `docs/sanctuary/DESIGN_SYSTEM.md` is the
canonical design reference for the reader and its Stepanoskin relationship.
`docs/sanctuary/design-system/index.html` is an offline visual specimen with
scoped palettes, type, controls and an optimized capture of the approved
original opening. The opening's woodblock terrain, architecture, pines and
living atmosphere are the latest illustration quality reference; later
chapters still need that detail/coherence pass. The document maps accepted
editorial and visual rules to current code and motion/media budgets. This is
a local design capture during copy editing, not a deployment status update.
Opening reconstruction, 2026-10-03 (local editorial draft):
`docs/sanctuary/NARRATIVE_REBUILD.md` supersedes the earlier opening sequence.
The stable `the-fork` chapter is now “The business of keeping a world alive”:
lasting enjoyment and the next sale → connected products → games → BG3/D4
as a contemporary preview → history. First mentions are deliberately limited;
class/build, reset rules and transaction details belong later. The opening
keeps the publisher image pair and a new original three-track AfterPurchase
exhibit (player, studio, payment). It has no ambient illustration ahead of prose.
The approved animated diptych moves to Where progress lives; FundingDiagram
moves to The shape of the money. Media remain immutable and chapter-scoped.
Reading order begins opening → Several histories at once → Concord; all 21
stable IDs and seven parts remain. The two early part labels now describe that
local arrangement. This is a section-by-section reconstruction: only chapter one
has been rebuilt. Subsequent history/Concord revisions and dedicated Diablo
origin/franchise chapters remain to be authored; later order is transitional.
The new local branch is codex/sanctuary-stage-setting; the preceding public
edition was merged through PR #51. Local review comes before another PR.

Replayability and duration never establish a payment model. BG3's updates and
paid editions prevent a false frozen-product comparison; D4 seasonal play does
not require cosmetic purchases, and seasonal characters can follow the campaign.
Historical plans remain dated, including D4's August 2022 commercial design.
Date D2 seasonal ladder characters to patch 1.10 (28 October 2003), not the first
leaderboard. D1's Tristram Cathedral and D2's Rogue Monastery are different places.
No cinematic budget, private financing history or inevitable evolution is claimed.

Sanctuary reader, 2026-10-01: `/stepanoskin/game-monetization` serves the
illustrated overview; `?chapter=<stable-id>` directly addresses any of 21
chapters in seven parts. Server rendering sends only the selected chapter and
its image metadata. The English editorial edition includes primary-source notes,
21 individually composed original plates, 20 interactive exhibits and a documented
timeline, plus native contents/inspection dialogs. The plates draw on Loopforge’s
console materials and controlled mischief; see `docs/sanctuary/VISUAL_DIRECTION.md`. The public editorial pack now adds 24 selected publisher images and native zoom.
The ignored archive is only a source-work convenience; its separate endpoint
cannot be enabled in production/Vercel or by browser parameters. The cover uses an
original procedural devil; ambient fire, embers and shared clang/motion controls
restore the presentation atmosphere. Navigation uses the six existing locales; body prose is explicitly
labeled English pending editorial approval and translation. Unknown chapter IDs
return 404. See `docs/sanctuary/README.md` for content and provenance boundaries.

Versioned media, 2026-10-01: Lab owns the asset pipeline in
`apps/lab/scripts/assets.mjs` and catalogs in `apps/lab/assets/`. Optimized files
and manifests under `/media/files/` and `/media/manifests/` use content hashes
and one-year immutable caching. `/media/pointers/<pack>.json` refreshes after
30 seconds in the browser / 60 seconds at Vercel's edge (30-second edge SWR).
`AssetImage` uses prebuilt responsive WebP variants; Stepanoskin's logo,
textures and exact click MP3 are the first pack. First render pins a generated
manifest; optional scene loaders discover newer releases with integrity checks
and last-good fallback. Normal builds retain all old files. Asset rollback is
a pointer change in a new deployment that retains forward-version files, not
a whole-deployment rewind. See `apps/lab/assets/README.md` for publishing,
budgets, rollback and the boundary between Git assets and future object storage.

Route-group update, 2026-09-30: `apps/lab/app/(stepanoskin)/` is a top-level
Lab sandbox group with a pass-through layout. It inherits the root layout and
serves the public `/stepanoskin` landing page without login. Its page lives at
`(stepanoskin)/stepanoskin/page.tsx`.

As of 2026-10-03, `/stepanoskin` is a lightweight project directory linking Data
Science & Production Systems, Sanctuary Economics (game monetization), Loopforge,
and an About placeholder at `/stepanoskin/about`. The factory-style entrance
has moved to `/stepanoskin/loopforge`, with its art, conveyor, sound and motion
preferences preserved. Its three destinations are the game overview, engine
architecture and playable prototype. Loopforge reader/play branding returns to
this entrance; its Stepan Oskin link returns to the project directory.
Native dictionaries cover English (default), French, Spanish, Russian, Mandarin
Chinese and Thai. The `stepanoskin_locale_v1` cookie is shared by the directory,
About placeholder, Loopforge entrance and Sanctuary controls. Both entrances
render the saved language on the server; deck content remains English.

Status: current working memory as of 2026-05-21 after adding the Fruitful Lab customer site foundation.

Use this file as the durable architectural memory for future Codex/LLM work on this repo. It records the structure, layers, contracts, and working patterns that should be assumed going forward unless code proves otherwise.

## What This Project Is

Fruitful Lab is becoming a brand/app monorepo for multiple separately deployed web properties and shared tool infrastructure. The current implementation is still a Next.js + FastAPI platform that hosts Fruitful Pin/Fruitful Lab public tools, gated admin workflows, contractor placeholders, analytics plumbing, and Pinterest account stats ingestion.

Related planning note:

- `docs/BRAND_APP_MONOREPO_ARCHITECTURE.md` is the current target architecture reference. It defines the shift from a single-app layout toward separate apps under `apps/*`, beginning with `apps/lab` for Fruitful Lab and later `apps/fruitful-pin` for the Fruitful Pin migration. Future brand apps may include Bloom Whispers and Bricoli.
- `docs/BRAND_APP_MONOREPO_EXECUTION_PLAN.md` is the active PR-gated execution plan for the monorepo migration. It defines PR 1 as docs/architecture baseline, PR 2 as the completed structure-only `frontend/` to `apps/lab/` move, PR 3 as Fruitful Pin app foundation, and later PRs for inventory, content contracts, templates, CMS integration, and launch prep.
- `docs/fruitful-pin-nextjs-migration-spec-2026-05-20.md` is the current planning reference for a Fruitful Bean / Fruitful Pin-only migration of `fruitfulpin.com` to a coded Next.js marketing site. It explicitly does not propose rebuilding Fruitful Lab, removes Kadence from future cost comparisons, assumes GoDaddy domain registration and prepaid A2 hosting until 2027, prefers Cloudflare hosting for the public Next.js frontend, and keeps WordPress on A2 as the phase-one headless CMS/editor to avoid a CMS learning curve during migration.

The current Fruitful Lab app is not just a marketing site. It is a tool-and-analytics system with:

- public lead/value tools,
- role-gated internal/admin areas,
- contractor-gated work areas,
- GTM data-layer event instrumentation,
- GrowthBook experiment infrastructure,
- a FastAPI/Postgres backend for auth and Pinterest stats.

## Target Monorepo Direction

The target repo shape is:

- `apps/lab/` - current Fruitful Lab Next.js app; hosted on Vercel as a sandbox/prototype platform.
- `apps/fruitful-pin/` - Fruitful Pin commercial marketing site foundation; static-first Next.js app with Cloudflare Pages as the preferred public frontend host.
- `apps/fruitful-lab-site/` - Fruitful Lab customer-facing umbrella marketing site foundation for `fruitfulab.com`; separate from the sandbox app on `fruitfulab.net`.
- `apps/bloom-whispers/` - future separate brand/site example.
- `apps/bricoli/` - future separate brand/site example.
- `packages/*` - shared code extracted only after real cross-app reuse exists.
- `backend/` - current FastAPI backend, used where needed and not assumed by every future brand app.

Current Fruitful Lab code lives in `apps/lab/`.

Working pattern:

- Keep separate brands as separate apps and deployments.
- Do not import directly across apps.
- Promote reusable code into `packages/*` before sharing it across apps.
- Keep hosting assumptions per app: Fruitful Lab sandbox on Vercel, Fruitful Pin public frontend on Cloudflare in the current plan, and Fruitful Lab customer site following the same Cloudflare/static-first direction as Fruitful Pin.
- Use Fruitful Lab as the prototype/sandbox space and promote mature tools into commercial brand apps through shared packages.

## Top-Level Layout Today

- `apps/lab/` - current Next.js App Router app for Fruitful Lab.
- `apps/fruitful-pin/` - separate Next.js App Router foundation for Fruitful Pin.
- `apps/fruitful-lab-site/` - separate Next.js App Router foundation for the public Fruitful Lab customer site at `fruitfulab.com`.
- `backend/` - FastAPI app with SQLAlchemy, Alembic, JWT auth, and Postgres.
- `docs/` - current memory, audits, implementation notes, guides, and archived plans.
- `prompts/` - LLM architect prompts and sprint plans.
- `Makefile` - root convenience commands for backend and Lab app tests/builds.
- `repo-tree.txt` - static repo tree snapshot.


## Fruitful Pin App Foundation

`apps/fruitful-pin/` is now the separate Fruitful Pin app foundation. It is intentionally not a production launch and does not change `fruitfulpin.com`, GoDaddy, A2, WordPress, or Cloudflare settings.

Current foundation:

- static-first Next.js App Router app,
- `output: "export"` for Cloudflare Pages compatibility,
- first-pass public routes for `/`, `/pinterest-services`, `/resources`, `/pinterest-fit-check`, `/blog`, root-level blog posts, `/case-studies`, `/about`, `/contact`, `/privacy`, `/privacy-policy`, `/terms`, and legacy `/services`,
- brand/site constants in `apps/fruitful-pin/lib/site.ts`,
- content boundary in `apps/fruitful-pin/lib/content.ts`,
- WordPress connection placeholder in `apps/fruitful-pin/lib/wordpress.ts`,
- local tests in `apps/fruitful-pin/__tests__/`.

First-pass checkpoint memory:

- Fruitful Pin should feel airy, breezy, editorial, warm, and Pinterest-specific rather than corporate, generic, or boxy.
- Primary CTAs use solid `#950952` pink. Gradients are for text highlights and occasional intentional accents, not CTA buttons.
- Top navigation should stay intentionally lean: Home, Blog, Services, Resources, and About. Case Studies, Contact, Privacy, and Terms can live in the footer and contextual page CTAs.
- Resources is a soft-conversion hub. It features the native Pinterest Fit Check and keeps guide/resource/blog paths underneath.
- Pinterest Fit Check is the Fruitful Pin-native diagnostic tool at `/pinterest-fit-check`; it lives inside `apps/fruitful-pin` rather than importing from `apps/lab`.
- Blog templates should support a sidebar, featured images, table of contents, key takeaways, pin graphic slots, pull quotes, comparison tables, FAQs, and reader navigation.
- Contact is the fit-call page: embedded TidyCal first, then the general inquiry form/email option. Do not wire new email automation, CRM, or form backend integrations without explicit approval.
- Case studies/proof is currently a first-pass holding structure until Susy is ready to build real visual case studies and proof packets.

Use `npm run build` from `apps/fruitful-pin/` or `make fruitful-pin-build` from the repo root to verify the static export. Cloudflare Pages should use `apps/fruitful-pin` as the root, `npm run build` as the build command, and `out` as the build output directory. If later WordPress preview, SSR, or dynamic route needs exceed static export, switch this app to the Cloudflare Workers/OpenNext path in a dedicated PR.

Local preview note for Codex:

- Request network permission before starting `next dev` or any local preview server. Fresh-thread testing on 2026-05-20 confirmed that Codex cannot bind `127.0.0.1:4173` without network permission and fails with `listen EPERM`; after permission is granted, the Fruitful Pin dev server renders locally.
- Confirmed local preview command target: `make fruitful-pin-dev` from the repo root, or `npm run dev:local` from `apps/fruitful-pin/`. Use `http://127.0.0.1:4173/` for browser review.

## Fruitful Lab Customer Site Foundation

`apps/fruitful-lab-site/` is the separate public customer-facing Fruitful Lab site foundation for `https://fruitfulab.com`.

Domain split:

- `fruitfulab.net` remains the sandbox/tools/experiments app in `apps/lab/`.
- `fruitfulab.com` is the public umbrella marketing site in `apps/fruitful-lab-site/`.
- `fruitfulpin.com` remains the Pinterest-specific commercial brand in `apps/fruitful-pin/`.
- Do not use `fruitfullab.com`; Susy confirmed the only correct .com domain is `fruitfulab.com`.

Current foundation:

- static-first Next.js App Router app,
- `output: "export"` for Cloudflare Pages compatibility,
- first-pass public routes for `/`, `/services`, `/blog`, `/blog/[slug]`, `/resources`, `/about`, `/contact`, `/privacy`, and `/terms`,
- brand/site constants in `apps/fruitful-lab-site/lib/site.ts`,
- content boundary in `apps/fruitful-lab-site/lib/content.ts`,
- WordPress connection placeholder in `apps/fruitful-lab-site/lib/wordpress.ts`,
- sitemap and robots metadata routes,
- local tests in `apps/fruitful-lab-site/__tests__/`.

Brand and offer direction memory:

- Fruitful Lab is the bigger umbrella brand where Susi and Esteban can combine AI marketing, funnels, paid media, email, content systems, and workflow expertise.
- Fruitful Lab is the parent-company style home for Fruitful Pin, Bloom Whispers, Bricoli Studio, and future brands.
- Fruitful Pin and Fruitful Lab can share a family resemblance, but Fruitful Lab should lean more navy/gold and less pink while Fruitful Pin stays more pink/yellow and Pinterest-specific.
- Initial site scope includes Home, About, Services, Blog, Resources, Contact, Privacy, and Terms.
- Case studies and tools/experiments are intentionally out of the first skeleton.
- Contact path uses `hello@fruitfulab.com` and a TidyCal booking destination. `NEXT_PUBLIC_TIDYCAL_URL` can override the default fallback.
- Phase-one CMS direction is WordPress as headless CMS/editor on the existing prepaid hosting model, following the Fruitful Pin approach.
- Cloudflare/static-first is the preferred public frontend hosting direction when launch work begins.

Use `npm run build` from `apps/fruitful-lab-site/` to verify the static export. Cloudflare Pages should use `apps/fruitful-lab-site` as the root, `npm run build` as the build command, and `out` as the build output directory. Do not point `fruitfulab.com` at this app until preview, content, analytics, redirects, and launch checks are explicitly approved.

## Frontend Layers

### App Router

`apps/lab/app/` owns Fruitful Lab routes, layouts, and Next route handlers.

Current route groups:

- `(site)` - public site shell with `SiteHeader`, `FlashBanner`, `SiteFooter`.
- `(flow)` - tool flow shell for public tool experiences.
- `(admin)` - admin-only area under `/admin`.
- `(contractor)` - contractor/admin-only area under `/contractor`.

Public routes:

- `/` - public hub when logged out. Logged-in users redirect by role.
- `/tools` - public tools index.
- `/tools/pinterest-fit-assessment` - public Pinterest Fit Assessment.
- `/tools/pinterest-potential` - public Pinterest Potential Calculator.
- `/case-studies` - coming-soon public page.
- `/hub` - knowledge hub preview.
- `/login` - login screen.

Protected routes:

- `/admin`, `/admin/*`
- `/contractor`, `/contractor/*`

### Layouts and Shared UI

- `apps/lab/app/layout.tsx` - root HTML/body and GTM injection when `NEXT_PUBLIC_GTM_ID` is present.
- `apps/lab/app/globals.css` - Tailwind import plus project tokens, light/dark variables, scrollbars, and PPC-specific visual tokens.
- `apps/lab/components/layout/*` - headers, footers, flash banner, logout, book-call button, flow shell/header.
- `apps/lab/lib/nav.ts` - shared public and contractor navigation config.


Working pattern:

- Server components by default.
- Client components only for interaction, browser APIs, or analytics event pushes.
- Shared visual tokens live in CSS variables, not scattered hard-coded palettes.
- Do not duplicate route paths in many places when `apps/lab/lib/nav.ts` can own them.

## Tool System

Public tools are explicit flows with typed config/data/compute layers under `apps/lab/lib/tools/*` and UI components under `apps/lab/components/tools/*`. These remain inside `apps/lab/` until a second app needs them; then stable reusable logic should move to `packages/tools` and reusable UI may move to `packages/tool-ui`.

### Pinterest Potential Calculator

Route:

- `apps/lab/app/(flow)/tools/pinterest-potential/page.tsx`

Key UI:

- `PinterestPotentialV1` - `welcome` variant.
- `PinterestPotentialV2` - `no_welcome` variant shell.
- `PinterestPotentialWizard` - core wizard.
- Step components under `apps/lab/components/tools/pinterestPotential/steps/`.
- View components under `apps/lab/components/tools/pinterestPotential/views/`.

Key logic:

- `apps/lab/lib/tools/pinterestPotentialConfig.ts` - variant constants and A/B enable flag.
- `apps/lab/lib/tools/pinterestPotential/compute.ts` - calculation logic.
- `apps/lab/lib/tools/pinterestPotential/pinterestPotentialSpec.ts` - typed spec/contracts.
- `apps/lab/lib/tools/pinterestPotential/leadMode.ts` - lead gating mode resolver.
- `apps/lab/lib/tools/pinterestPotential/leadGatingConfig.ts` - lead gating config.
- `apps/lab/lib/tools/pinterestPotential/leadToken.ts` - current lead-token stub/QA decoder.

Current variant contract:

- Variant type: `welcome | no_welcome`.
- Default: `welcome`.
- Cookie: `pp_variant`.
- `ENABLE_AB_SPLIT` is currently `false`.
- In non-production only, `?variant=` can override for QA.
- Page resolution order is query override, then cookie if A/B split is enabled, then default.

Current lead contract:

- Lead modes: `hard_lock | soft_lock`.
- Known leads come from authenticated user or token-derived lead.
- `resolveLeadFromToken()` is currently a stub/demo decoder, not server-signed verification.
- Optional `ppc_lead_mode` cookie exists as a future override input.

### Pinterest Fit Assessment

Route:

- `apps/lab/app/(flow)/tools/pinterest-fit-assessment/page.tsx`

Key UI:

- `apps/lab/components/tools/pinterestFit/PinterestFitAssessment.tsx`
- `IntroScreen`, `QuestionScreen`, `ResultsScreen`

Key logic:

- `apps/lab/lib/tools/pinterestFit/questions.ts`
- `apps/lab/lib/tools/pinterestFit/engine.ts`
- `apps/lab/lib/tools/pinterestFit/results.ts`
- `apps/lab/lib/tools/pinterestFit/tracking.ts`
- `apps/lab/lib/tools/pinterestFit/types.ts`

Current behavior:

- Client-side seven-question assessment.
- Generates a run id.
- Tracks start, question completion, final completion, result shown, and CTA click.
- Scores deterministically with typed answer/result contracts and guardrails.

## Authentication and Authorization

Authentication is JWT-based, with the frontend storing the backend access token in an HTTP-only cookie.

Cookie:

- `fruitful_access_token`

Frontend auth files:

- `apps/lab/lib/auth.ts`
- `apps/lab/middleware.ts`
- `apps/lab/app/api/auth/login/route.ts`
- `apps/lab/app/api/auth/logout/route.ts`
- `apps/lab/app/login/LoginPageClient.tsx`

Backend auth files:

- `backend/routers/auth.py`
- `backend/security.py`
- `backend/models.py`
- `backend/schemas.py`

Backend endpoints:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Login flow:

1. Browser submits email/password to Next route `/api/auth/login`.
2. Next route posts OAuth2 form fields to FastAPI `/auth/login`.
3. FastAPI returns JWT access token.
4. Next route calls FastAPI `/auth/me` with the new token.
5. Next route computes role: admin, contractor, or general.
6. Next route sets `fruitful_access_token` and returns a role-safe `redirectTo`.
7. Login client navigates to `redirectTo`.

Authorization model:

- Admin: `user.is_admin === true`.
- Contractor: `groups` includes `"contractor"`.
- General: authenticated but not admin/contractor.

Protected route enforcement:

- Middleware protects `/admin` and `/contractor`.
- Middleware calls backend `/auth/me` to validate token and role before render.
- Admin layout calls `getCurrentUser()` and fail-closes to login/tools/contractor.
- Contractor layout calls `getCurrentUser()` and fail-closes to login/tools.
- Backend admin APIs use `get_current_admin_user`.
- Backend contractor dependency exists as `get_current_contractor_user`, though current contractor pages are frontend placeholders.

Working pattern:

- Do not rely on UI-only gating.
- Keep role decisions explicit.
- Keep the backend `/auth/me` response as the source of session truth.
- Preserve safe `next` handling in login redirects.

## Experiments and Feature Flags

Experiment config:

- `apps/lab/lib/experiments/config.ts`

GrowthBook integration:

- `apps/lab/lib/growthbook/middleware.ts` - Edge-safe middleware assignment.
- `apps/lab/lib/growthbook/edgeAdapter.ts` - Edge-safe adapter import.
- `apps/lab/lib/growthbook/flags.ts` - server-side adapter with tracking callback.
- `apps/lab/app/api/debug/growthbook/route.ts` - debug/health endpoint.
- `apps/lab/app/api/experiment-events/route.ts` - dev-friendly event intake.

Current registered experiment:

- Key: `pinterest_potential_variant`
- GrowthBook key: `pinterest_potential_variant`
- Variants: `welcome`, `no_welcome`
- Default: `welcome`

Assignment pattern:

- Middleware is the assignment layer.
- Pages should read cookie/query state and render; they should not call GrowthBook directly.
- Middleware ensures stable anonymous id cookie `fp_anon_id` when assignment is enabled.
- Middleware persists variant cookie `pp_variant`.
- GrowthBook is attempted first; local weighted fallback is used if GrowthBook is unavailable.

Current important reality:

- `ENABLE_AB_SPLIT` is set to `false`, so the live resolver defaults to `welcome` unless a non-production query override is used.

## Analytics

GTM/Data Layer:

- Root GTM injection lives in `apps/lab/app/layout.tsx`.
- Data-layer helpers live in `apps/lab/lib/gtm.ts`.
- `window.dataLayer` typing lives in `apps/lab/types/global.d.ts`.

Generic helper pattern:

- `pushEvent(eventName, params)` is the primitive.
- Generic tool helpers wrap `tool_view`, `tool_start`, `lead_submit`, and `cta_click`.
- `useToolAnalytics()` fires `tool_view` once and exposes `trackToolStart`.

Pinterest Potential events:

- `ppc_view_start`
- `ppc_start`
- `ppc_answer`
- `ppc_complete`
- `ppc_cta_click`
- `ppc_lead_view`
- `ppc_lead_submit`
- `ppc_lead_skip`
- `ppc_back`

Pinterest Fit events:

- `assessment_started`
- `assessment_question_completed`
- `assessment_completed`
- `result_strong_fit`
- `result_possible_fit`
- `result_not_right_now`
- `cta_fit_call_clicked`

Working pattern:

- Emit events to `window.dataLayer`.
- Let GTM decide destinations.
- Do not add direct `gtag()` calls.
- Keep event schemas stable and flat enough for GTM/GA4.
- For new tools, define tracking close to the tool library and call through `pushEvent`.

## Backend Layers

Backend entry:

- `backend/main.py`

Routers:

- `backend/routers/auth.py`
- `backend/routers/stats.py`
- `backend/routers/admin_pinterest_stats.py`

Core modules:

- `backend/config.py` - env config for OpenAI and JWT.
- `backend/db.py` - SQLAlchemy engine/session/Base, requires `DATABASE_URL`.
- `backend/security.py` - password hashing, JWT, current-user/admin/contractor dependencies.
- `backend/models.py` - SQLAlchemy models.
- `backend/schemas.py` - Pydantic schemas.
- `backend/utils.py` - parsing helpers for stats ingestion.

Models:

- `User`
  - `email`, `full_name`, `hashed_password`
  - `is_active`
  - `is_admin`
  - `groups` JSON list
  - timestamps
- `PinterestAccountStatsMonthly`
  - `account_name`
  - `calendar_month`
  - `impressions`
  - `engagements`
  - `outbound_clicks`
  - `saves`
  - `uploaded_at`
  - timestamps
  - unique `(account_name, calendar_month)`

Migrations:

- Current migration head: `backend/migrations/versions/3acct101026_account_access.py` (initial `0f1db0936876` → game `2cdmx101026` → accounts `3acct101026`)
- Legacy migrations live under `backend/migrations/_legacy_versions/`.

## Frontend/Backend Contract

Required frontend env:

- `API_BASE_URL` - server-side origin used by middleware, auth, and Next API proxies.
- `NEXT_PUBLIC_API_BASE_URL` - browser/server helper fallback used by legacy dashboard stats fetch.
- `NEXT_PUBLIC_GTM_ID` - optional GTM container id.
- `GROWTHBOOK_CLIENT_KEY` and optional `GROWTHBOOK_API_HOST` - optional experiment SDK config.

Backend required env:

- `DATABASE_URL`
- `JWT_SECRET_KEY`
- optional `JWT_ACCESS_TOKEN_EXPIRE_MINUTES`
- optional `OPENAI_API_KEY`

Primary contracts:

- Frontend `/api/auth/login` proxies backend `/auth/login` and `/auth/me`.
- Frontend `getCurrentUser()` calls backend `/auth/me`.
- Middleware calls backend `/auth/me`.
- Admin frontend proxies under `/api/admin/pinterest-stats/*` forward to backend `/admin/pinterest-stats/*`.
- Legacy dashboard helper calls backend `/pinterest-stats/monthly` directly with bearer token.

Admin Pinterest stats contract:

- Backend `/admin/pinterest-stats/upload` accepts multipart form data with `account_name` and `file`.
- CSV header detection expects normalized fields including `date_range`, `impressions`, `engagements`, `outbound_clicks`, and `saves`.
- Upload upserts by `account_name + calendar_month`.
- Backend `/admin/pinterest-stats/accounts` returns a string array.
- Backend `/admin/pinterest-stats/monthly?account_name=...` returns rows for that account.

## Known Drift / Watch Points

- `docs/SYSTEM_IMPLEMENTATION_AUDIT-2026-01-10.md` is historical and stale in several areas. Use the 2026-05-15 audit for current work.
- Some comments and older prompts still describe contractor route examples or dashboard redirects from prior iterations. Verify against `apps/lab/app/` and `apps/lab/middleware.ts`.
- `apps/lab/app/(admin)/admin/analytics/page.tsx` currently expects accounts as `{ accounts: Account[] }` in one code path, while the proxy/backend returns a raw string array. This looks like a runtime bug or unfinished refactor; verify before relying on that UI.
- `backend/routers/stats.py` still contains older `/pinterest-stats/upload-csv` behavior that constructs monthly stats without `account_name`, even though the model now requires it. Treat `/admin/pinterest-stats/*` as the current admin ingestion path.
- `resolveLeadFromToken()` is not secure verification; it is a stub/demo decoder.

## Testing and Verification

Root commands:

- `make backend-test`
- `make lab-test`
- `make lab-build`
- `make test`
- `make all`

Direct commands:

- `cd backend && uv run pytest -q`
- `cd apps/lab && npm test`
- `cd apps/lab && npm run build`
- `cd apps/lab && npm run ci`

Test surface:

- Backend tests cover auth, auth protection, config, DB schema, health endpoints, Pinterest stats API, security, and Pinterest Fit spec/scenarios.
- Frontend tests cover routes, middleware auth, dashboard, auth helpers, GrowthBook/experiment helpers, Pinterest Potential compute, Pinterest Fit engine/components, public landing, and layout components.

## How To Work With This Project Going Forward

1. Start by reading `docs/REPO_GROUNDING_PACK.md` and this file.
2. Verify current code before trusting old prompts, archived docs, or dated audits.
3. For route or auth changes, inspect `apps/lab/app`, `apps/lab/middleware.ts`, `apps/lab/lib/auth.ts`, and backend auth dependencies together.
4. For tool changes, keep UI, typed config, compute/scoring, and tracking contracts aligned.
5. For analytics changes, update `apps/lab/lib/gtm.ts` or tool-specific tracking helpers and document event schema changes here.
6. For experiment changes, update `apps/lab/lib/experiments/config.ts`, middleware assignment logic, and the tool page resolver together.
7. For API/data changes, update backend model/schema/router, migrations, frontend proxy/helper, and tests together.
8. When architectural contracts change, update this file and add or refresh a dated implementation audit.


### Sanctuary narrative and atmosphere · 2026-10-01

- The 21-chapter Sanctuary reader now includes an integrated literature pass;
  `Chapter.sections` and `Chapter.paragraphCitations` supply optional headings
  and paragraph-level source links. Source numbering follows each chapter’s
  source list, including evidence needed by its retained exhibits.
- Separate soot/shadow and flame passes share a bounded native WebGL canvas.
  Fire uses a transported, cooling heat field and five procedural depth slices;
  no fixed flame columns. The original Canvas2D embers remain independent.
  Both obey manual motion,
  reduced motion and hidden-page suspension. WebGL failure leaves reading and
  embers usable. New lifecycle tests cover suspension, restoration and cleanup.
- The access exhibit separates ownership from readiness in either order. It
  does not imply that an expansion must be bought before its gameplay
  prerequisites can be completed.
- Historical state for this atmosphere change: original-only public media was
  retained then; the 3 October editorial selection above supersedes that rule. ESLint excludes generated `.next-research` output alongside
  `.next`; source files in research routes remain linted.
- Editorial sources, interpretation boundaries and methods are summarized in
  `docs/sanctuary/LITERATURE_PASS.md`.

### Sanctuary reading restraint · 2026-10-02

- Only the subdued upper fringe of the fire appears at the true document end;
  a final in-flow marker follows all reader content and expanded evidence.
  Leaving the bottom hides fire and skips its simulation/shading passes.
  Shadows and embers keep their independent ambient behavior.
- The cover devil has brighter eye cores and a wider warm halo, with a steady
  glow when motion is disabled. Rounded SVG numbers prevent engine-dependent
  hydration differences in the procedural mosaic.


## Loopforge learning prototype — 2026-10-03

The Stepanoskin group now includes two English Loopforge readers (8 overview and
16 architecture chapters) and an eight-shift director console at
`/stepanoskin/loopforge`. Routes/components/logic are scoped to `apps/lab`; owned
art uses the versioned `loopforge` asset pack. See `docs/loopforge/README.md`,
`DELIVERY_CHECKLIST.md`, `ARCHITECTURE_DECISIONS.md`, `BDI_AND_PROTOCOL_REVIEW.md`
and `OPERATIONS_AND_EVALS.md` in that directory.

`POST /api/loopforge/run` validates a bounded seed/command history and reconstructs
server state with `lf-teaching-1`; the public demo allows forks and has no account,
scarce currency or shared-world claim. The pure TS kernel has explicit integer
rules and seeded replay. A small deterministic BDI advisor recommends one-shift
doctrine; persistent autonomous BDI and LLM intention admission remain future work.

`GET/POST /api/loopforge/narrative` is a separate slow lane. It derives evidence
from the kernel, validates structured OpenAI output, and cannot mutate mechanics.
The paid path requires server credentials, a private gate and a durable Redis
reservation budget. It fails closed without configuration. Narration artifacts
retain source hash, model/prompt, usage and latency. Twelve real responses across
two prompt versions and cached retrieval are verified within the owner-approved
$1 allocation. `docs/loopforge/LIVE_EVALUATION.md` records costs, latency and
remaining semantic defects; envelope acceptance is not a human quality score.

Original Stepanoskin landing now links to both decks, the console, Sanctuary
and the Production Systems profile, preserving its translated menu labels.
The broader front-page redesign is deferred. Current Sanctuary work and the
reference Loopforge repository remain separate.

## Production systems profile · 2026-10-03

Public `/stepanoskin/production-systems` is a professional profile and methodology
presentation for Stepan Oskin, linked from the six-language `/stepanoskin` menu.
The profile is in English and sets its own language scope. It presents abstract
current-role context at Prodigy Education, publicly verifiable work, an original
production-loop diagram, four illustrative applications, primary-source notes,
and LinkedIn/print actions. It discloses no internal project details or results.
Static server content and scoped CSS contain most of the page; small client
components handle domain selection and printing. Profile actions reuse `cta_click`.
No auth, API, experiment assignment, dependencies, or other apps change.
See `docs/brands/lab/production-systems-profile.md` for the brief, sources and checks.


### Production profile procedural scenes · 2026-10-03

`/stepanoskin/production-systems` now has eight server-rendered SVG studies based
on Mechanical Turk engravings. `ProfileMotion` owns one visibility observer and
CSS-motion lifecycle, with the independent persistent preference
`production_systems_motion_v1`; reduced motion and hidden/offscreen states stop
movement. No JavaScript retains complete still illustrations. Fine figure paths
are generated offline from the credited public-domain Racknitz plate; no runtime
raster references, fonts, dependencies or per-frame React updates are added.
Professional facts, APIs, analytics and experiment contracts are unchanged.
See `docs/brands/lab/production-systems-design/DESIGN_GUIDELINES.md` for provenance
and `docs/brands/lab/production-systems-evidence/engraving-verification.md` for checks.

Opening lighting refinement (2026-10-04): `turk-lighting.ts` defines the shared
orthographic key and receiver planes. Server-rendered floor/overhang penumbrae,
pierced gear shadows and projected hand shadows replace independent offsets.
There are now 47 synchronized hero animations; Slow/Medium/Fast remain
0.55/1.1/3×. Figure silhouette reuse avoids duplicate vector data. Design
Guidelines v1.9 and `production-systems-evidence/turk-lighting-verification.md`
record the contract and production checks. No new client boundary or frame loop.

Operator composition (2026-10-05): Figure 1 is accepted as complete. Design
Guidelines v2.5 capture its shared quality bar while requiring each later figure
to own its composition. `TurkOperator.tsx` supplies a side cutaway with a sectioned
front wall concealing the lower body, complete engraved Turk above, connected
controls and matching public/indicator/private boards. One 12-second e2–e4
move coordinates operator hands, input lever, Turk arm, both pawns and indicators. The visible candle at
(222, 200) casts a 1.4× silhouette; shared light keyframes move it opposite the
flame while keeping source/caster/receiver aligned. HNF reconstruction evidence
is distinguished from Racknitz's credited character studies. Nine meshing display gears
in two planes and finished walnut joinery inherit Figure 1's material language.
Thirty-one local CSS animations use the existing lifecycle; no new client code
or filters. The upper board now sits within a shorter 68/62-unit articulated
reach; its underside indicators derive from the same board geometry. A tapered
waist, seated lap, shorter resting arm and cloth folds balance the complete figure.
The owner rejected moving the operator's arm behind him. Preserve the original
raised hand and forward lever (grip 334,182; pivot 340,244). The hand pulls toward
the body through 14 degrees; a rigid link and roof rocker transfer the movement.
Only the downstream shaft and its recessed supports belong on the far wall.
See guidelines v2.5 and `production-systems-evidence/operator-restored-verification.md`.


### Sanctuary cinema/catalog plates · 2026-10-03 · local draft

- `AudienceEconomy` now contains a full-width original cinema and three inspectable
  catalog-cover parodies. `cover-references.ts` shares source/creator metadata
  between the drawings and public credits; the Netflix logo retains its manifest.
- `useLivingPlate` gates CSS atmosphere by intersection, document visibility and
  both motion preferences. Native cover dialogs mount enlarged artwork on demand.
- Pass history and delivery constraints: `docs/sanctuary/CINEMA_CATALOG_ART_PASSES.md`.
  This draft is being submitted for PR review; later chapters remain iterative.

## Loopforge entrance conveyor · 2026-10-04

The entrance preserves the restored Canvas2D factory illustration. It now fills
one responsive stage with a compact horizontal text menu and menu-side reset
station. The full conveyor stays visible in the initial desktop/phone viewport;
short landscape uses a compact composition. Brain folds retain illustrated
material shading, seeded variants, damaged cases and cyan braided fibres.

`factory-light.ts` projects a continuous vertical-shaft beacon revolution.
Its housing stays upright below the belt. Cached soft fans, projected cargo
silhouettes, local metal reflections and a viewer-facing flare share its phase;
subtle amber becomes red on a jam. The held line periodically takes up slack,
strains and releases without advancing. The nearby handle tugs and its instruction
is linked to the button. Pointer pull, click and keyboard share one restart action.

There are no new dependencies or runtime image assets. Decorative state remains
separate from simulation/model calls. Cached sprites and a reduced-resolution
light layer run within the shared 30fps, 1800×1100 buffer and 1.25× resolution
limits. Manual/OS preferences, offscreen and hidden-document suspension remain;
pause reuses the renderer. Compact reader/play conveyors are unchanged, and
chapter 01 still has no Working Exhibit. Implementation and measured evidence:
`docs/loopforge/ILLUSTRATED_STAGE.md`. Field/physical-phone performance remains
unmeasured; owner visual acceptance is separate from implementation checks.


### Sanctuary opening sequence — 5 October 2026

The `apps/lab` Sanctuary reader has 24 chapters. Stable opening routes are
`insert-coin` (Pong / the occasion), `studio-to-screen` (business chain and
source-backed platform/cloud charts), and `how-many-lives` (the existing Gauntlet
case). Earlier routes remain valid; navigation derives from the chapter catalog.
Only active-chapter media/notes are serialized; new comparison/charts load for the
business chapter. No backend, auth, asset cache contract or other app changed.
See `docs/sanctuary/BUSINESS_OVERVIEW.md` for data definitions and validation.


### Loopforge prehistory story workshop — 5 October 2026

`/stepanoskin/loopforge/overview/before-the-factory` is a dedicated concept-art
review gallery within The Game. It is linked from the opening chapter and game
chapter navigation, without renumbering the eight overview chapters. Twelve
original paintings explore six alternative social histories, explicitly outside
established canon. The server-rendered gallery uses its own `loopforge-prehistory`
immutable media pack and on-demand native image dialogs; existing chapters do not
import the gallery manifest or content. Brief, provenance and verification:
`docs/loopforge/PREHISTORY_GALLERY.md`.

### Loopforge supervisor scenes — 6 October 2026

The existing `overview/the-cast` chapter is now titled “The supervisors.” Its
scene browser maps 62 owner-supplied paintings to five characters, 30 room
assignments and ten pairings. `supervisor-content.json` separates original
Python rules, art studies and proposed refusal paths. The new
`loopforge-supervisors` media pack uses the existing immutable contract; its
manifest reaches only this chapter and inspectors mount on demand.
`docs/loopforge/SUPERVISOR_ATLAS.md` records provenance and validation;
`STORY_BIBLE.md` preserves the edited global opening and first-shift bridge.
Do not expose the replacement-plan revelation at first-shift entry or describe
independent refusal as implemented in the website’s teaching prototype.


### Sanctuary world-building chapter · 7 October 2026 · local draft

The reader now has 30 chapters. `making-worlds` follows `rockstar-world` and precedes `concord` within the first act. It compares production approaches, explains CDPR’s Unreal partnership, and introduces the author’s Loopforge experiment. The chapter manuscript is `docs/sanctuary/WORLD_BUILDING_MANUSCRIPT.md`. A separate `sanctuary-worlds` asset pack holds three bounded game citations and one owner-authorized Loopforge concept painting. Per-image rights records are in `world-media.json`; the public register distinguishes policy scope from criticism/review rationale. `WorldWorkshop` switches captured fourth-shift outcomes from the actual Loopforge teaching engine (seed 42, same three prior shifts); changing the authored account does not alter the event. It makes no live model request. Wider character agency remains a design ambition. Chapter 1 and other project worktrees are preserved.


### Sanctuary chapter 2 historical opening · 9 October 2026

The current 35-chapter reader opens `studio-to-screen` with `BusinessHistory`: separate continuing arcade, PC and console lanes. Twelve sourced milestones distinguish packaged software from platform competition, then stores, catalogs and cloud routes. Both PC and console histories reach cloud play; PS Now’s 2016 Windows app makes the ecosystem/device crossover explicit. The arcade rail preserves pay-per-play continuity without claiming unchanged hardware. Desktop shows all lanes; mobile selects one lane and wraps its milestones into two columns. The instruction precedes the controls. Original compact SVGs retain bounded, visibility-gated motion; Steam reuses its 5,030-byte unchanged official mark through chapter-scoped assets and the public rights register. The catalog is a collection of original covers with a membership band, not a TV screen. `business-map` remains after the introduction and `market-map` after the access/computing comparison. Composition, references and performance are recorded in `docs/sanctuary/TIMELINE_CRAFT_PASSES.md`. Chapter 1, chapter 3 and the asset/cache, backend and auth contracts are unchanged.

- Chapter 2 cloud-history evidence now distinguishes OnLive on PC/Mac (2010), PS Now on PS4 (2014) and Windows (2016), and Xbox cloud on Android (2020) and PC browsers (2021). The prose connects Sony’s quoted invitation to earning from its library beyond console owners; the market map follows that account.
