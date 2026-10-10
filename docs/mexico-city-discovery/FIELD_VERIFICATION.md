# Field-game verification — 10 October 2026

Scope: Fruitful Lab `apps/lab`, the additive discovery backend and game/platform documentation. Branch: `codex/mexico-city-field-game`, based on `373332b` (merged PR #103). The previous illustrated atlas remains at `/mexico-city/atlas`; its older evidence is retained in `VERIFICATION.md`.

## Implemented and exercised

- Public landing, full bilingual design specification, in-app email/password signup/login, account and guest entry, four persistent mode destinations.
- Temporary solo outing: choose a goal, upload a photo, place a map pin, preserve the draft through pin placement, save +30, open the journal, use browser Back. Reload clears guest state. All modes remain navigable; account-only actions show the login entry.
- Two real disposable local accounts: create/join private group, issue/accept challenge, photo + manual location, peer confirmation, reload and shared group record. Production-browser test passes without runtime errors. Private evidence is not implicitly published.
- Bilingual mobile/game-design browser checks pass at 320, 390, 768 and 1440 CSS pixels with no horizontal overflow. Guest-language preference survives navigation; guest progress does not survive reload.
- Backend tests exercise self-review/nonmember denial, private photo access, separate public approval and payload, duplicate records/reviews, timeout settlement, on-time evidence protected from expiry, partial cooperative attempts, ordinary-account registration, required location/photo validation, bounded rewards, category cards and persistent personal records.
- Google vector adapter, custom markers, reference Metro/Cablebús/borough overlays and explicit GPS/manual placement are implemented. Browser verification currently uses the honest geographic fallback; configured Google service is a separate pending integration check.

## Automated checks

- Frontend complete suite: **78 suites, 406 tests, 1 snapshot passed**; retained asset integrity: **49 releases passed**.
- Production Next.js build: **passed**. A subsequent final build is recorded in the PR checks after the small ranking/session refinements.
- Scoped frontend lint: **0 errors, 9 image warnings**. Native image elements deliver already-normalized cookie-protected photos, in-memory guest images and fixed-size map pins; they intentionally bypass the public Next image optimizer.
- New game unit tests: **3 passed** (scoring, expiry/idempotence and projection).
- Backend complete suite before final refinements: **33 passed, 1 failed**. The unrelated existing `test_openai_api_key_is_present` requires `OPENAI_API_KEY`, unavailable in this local environment. Game code does not use OpenAI. After the final refinements, the targeted game suite passes **6 tests**, including successful cooperative completion requiring both photographs and both peer reviews.
- Alembic PostgreSQL offline SQL generation: **passed**. This validates migration generation, not an applied remote migration or PostgreSQL concurrency behavior.

Run the checked-in `verify-field-game.cjs`, `verify-field-mobile.cjs`, `verify-game-design.mjs` and `verify-learning.mjs` from the repository root. Supply `PLAYWRIGHT_MODULE` if using a supplied runtime, `TEST_BASE_URL=http://127.0.0.1:4182` for a local production server and `TEST_PHOTO=/path/to/disposable.jpg`. The account-flow script refuses non-local hosts. Start the frontend with `API_BASE_URL` pointing to a disposable local backend, whose database is separate from production. Scripts never need a real user's password or token.

## Deployment prerequisites and honest limits

1. Configure the browser map key and vector map ID for Vercel **Preview → codex/mexico-city-field-game**, restrict the key to Maps JavaScript API and actual site hostnames, then rebuild. See `GOOGLE_MAPS_SETUP.md`. OAuth configuration is unnecessary.
2. Deploy the matching FastAPI backend and apply additive Alembic revision `2cdmx101026` before account play. A frontend-only preview cannot provide these new endpoints. Guest and explicitly labeled full-interface demo remain usable; backend failure is shown and never represented as a saved account action.
3. The two-player photo prototype stores normalized JPEGs in Postgres (600 KB output limit; 200 records/user). It is deliberately bounded. Public publishing needs separate approval by an existing administrator other than the author; peer approval alone never publishes a photo. Production object storage/moderation operations are follow-up work.
4. The public map/logbook feed is bounded to 300 records. Global ranking aggregates all approved contributions and returns the top 100 contributors. Reference transit and history layers are dated static context, not live arrival/closure/navigation data. Directions hand off to Google Maps; arbitrary Places search and integrated route drawing are not claimed.
5. No physical outdoor playtest, real-user Core Web Vitals, battery test, offline sync or fairness/balance validation has been performed. Google loading, authenticated origin restrictions and real device GPS still need verification on the configured hosted preview.

The complete in-memory rehearsal is `/mexico-city/play?demo=1`; the actual unauthenticated solo product is `/mexico-city/play?guest=1`. Demo identities have no authority over account data and do not create backend writes.
