# Saved places verification

12 October 2026 · `codex/city-saved-places` · Mexico city discovery game

## Verified locally

The browser used a production Next.js build, the actual frontend account cookie/proxy, a local PostgreSQL database migrated through `4city121026`, the FastAPI service, and its independent import worker. Two isolated accounts were used; no production account data was changed.

| Flow | Evidence |
| --- | --- |
| Login and entry | Existing account login opened Activities. Explore links to Atlas, Activities and Housing; the main game has one Explore shortcut. |
| Save and process | The three researched hockey URLs and the requested apartment returned queued cards, were processed by the worker, and remained after browser reload. |
| Source limitations | Santa Fe and Propiedades refused/timed out on direct reads; Buenavista failed TLS verification. These use explicitly dated research snapshots. ISK8 was readable. Unknown URLs do not receive synthetic snapshots. |
| Housing | The apartment showed 22,000 MXN, two bedrooms, two bathrooms and 75 m²; absent expenses stayed unknown. Its researched card has no building coordinates. |
| Location editing | A deliberately named test copy was positioned approximately through the map picker. This test point is not part of the researched apartment data. |
| Main map | Saved markers opened details. Layers opened independently of Explore; turning Activities off removed the rink marker. |
| Nearby activities | The manually positioned housing test displayed Buenavista 1.9 km away and opened its details. This is straight-line distance, not a route. |
| Private notes | A rink note survived closing/reopening details and was absent from the second account's response. |
| Group sharing | Actual authenticated API calls created/joined a local group. View-only sharing allowed the companion to read, rejected edits with 403, and revocation changed detail access to 404 and removed markers. |
| Responsive interface | Browser reviewed at 320×740, 390×844 and 1440×1000. Narrow housing/save forms fit without horizontal overflow. Spanish and English navigation checked. |

## Automated checks

- Final optimized frontend build: passed, including TypeScript and route generation.
- Frontend full suite: 94 suites / 493 tests and one snapshot passed with serial execution. A concurrent run had unrelated timeout failures under local memory pressure.
- Focused saved-place helper and HUD checks: two suites / eight tests passed after the new coverage was added.
- Focused backend account, discovery, saved-place and migration checks: 59 passed / 14 skipped. PostgreSQL-dependent cases were separately run against a disposable local PostgreSQL instance: 26 passed / one skipped.
- Saved-place coverage includes URL deduplication, retry/lease recovery, stale-worker protection, source evidence, manual edits surviving refresh, failed-refresh cooldown, successful source data surviving a research fallback, group revocation, private notes, image authorization, source URL restrictions and expired provider coordinate deletion (including hidden copies).
- Scoped frontend lint: zero errors; one standard Next image warning for the authenticated source-image proxy.
- Diff whitespace check: passed.

The whole backend suite also contains tests requiring external admin/OpenAI configuration; those were not made green by supplying production credentials. The isolated feature/account/discovery tests and migration matrix above are the relevant passing checks.

## Hosted verification boundary

The production backend does not yet contain these routes. Local success does not prove a production migration, worker startup, account access, or Google Maps marker rendering. The local browser used the geographic fallback because no browser Maps key was configured locally. The Google marker path passed compilation but still needs the hosted account trial.

After this PR is merged and both deployments succeed:

1. Confirm Railway applied `4city121026` and starts HTTP plus `saved_city.worker` through `start_service.py`.
2. Sign into `/mexico-city/activities` with an existing Fruitful Lab account; save the three hockey rinks using the visible starter action.
3. Save the supplied Propiedades link from Housing. Wait for completion, reload, and confirm the original URL, facts, source date and missing-location state.
4. Open the game map, enable saved layers, and open a rink. Confirm Google attribution and approximate-location treatment.
5. Share a collection with a real game group, verify the second account's visibility/private notes, then restore the intended sharing scope.

Optional model extraction and server geocoding require their separate documented server configuration. Basic extraction, dated starter snapshots, manual corrections, persistence and sharing work without those keys. No production/live-account completion is claimed here.
