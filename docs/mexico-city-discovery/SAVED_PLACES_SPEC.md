# Saved city places — Mexico city discovery game

Working feature specification · 12 October 2026

## Player experience

The map remains the main game screen. Its one former Atlas shortcut becomes **Explorar / Explore**, opening `/mexico-city/explore`. This editorial landing introduces Atlas, Activities and Housing. Further expansions belong here, rather than adding more permanent HUD controls.

Activities (`/mexico-city/activities`) and Housing (`/mexico-city/housing`) use the same Fruitful Lab accounts and embedded login/create/recovery form. Atlas remains public. Saved places require an account; the temporary solo demo does not create persistent saved places.

A player saves a link into a collection, chooses Activity / Rent / Purchase, and immediately receives a saved card. Its preparation continues independently of the browser. The card progresses through reading, extraction, location and completion. Unreadable sources remain editable. Missing prices, addresses and dates stay unknown. No guessed building locations or hockey fees are presented as facts.

Players can read the source, correct details, place a point on the map, mark location accuracy, take private notes, shortlist or plan a visit, compare up to four items, and save a photo-backed visit through the existing discovery record system. Saving a URL earns no field points. A real visit uses the existing photo/location validation and scoring.

Housing shows advertised price, explicit price period, maintenance, deposit, bedrooms, bathrooms, surface and surface basis, furnishings and availability when known. Rent plus maintenance is calculated only when both amounts and a monthly price period are explicit. Purchase values never enter that calculation. Housing also shows the player’s saved activities within 5 km, ordered by straight-line distance; this is not a travel-time estimate.

Activities support dates, recurring schedule notes, category, price and availability. Search, date/price/bedroom filters, private/shared collections, map/list views and explicit load-more pagination are available. Filters apply to the loaded records; load more to include further records. Current prototype limits: 50 owned collections, 500 items per collection, 30 new imports per hour per account.

## Sharing

Collections are private by default. The owner may share a collection with an existing game group as view-only or contributor access, or return it to private. Contributors can save links; an item’s creator and the collection owner can edit/delete it. Only the item creator can move it to another writable collection. The backend reevaluates membership on every read, detail, marker and image request. Marker data is cleared if refresh fails. Visible browser views refresh on focus and periodically (30 seconds; three seconds while processing).

Notes, statuses and visit links belong to each viewer and are not exposed to other group members. Source facts and corrections belong to the shared item. Group sharing currently has no anonymous/public URL. Global publishing, public directory moderation and comments are future work.

## Map behavior

Saved activities, rentals and purchase listings are optional layers in the existing map layer panel. No additional top-level HUD button. The map requests authorized markers for the current viewport, at most 300; a limit notice asks the player to zoom in. Dense markers cluster, and a cluster opens a chooser. A saved marker opens its dedicated detail sheet without replacing the game map. Price labels are shown for housing. Approximate coordinates have a distinct marker treatment and explicit detail copy.

The collection map uses the same Google/fallback renderer and can focus a saved location. A point picker supports corrections. Google-derived positions appear only on Google Maps; independent source, OpenStreetMap and user positions can appear on either renderer. The existing map camera, goals and discovery controls remain in place.

## Import and storage contract

`POST /discovery/saved/imports` validates and canonicalizes the link, checks collection access, deduplicates within the collection, and transactionally creates the item and durable job. The response is 202. Browser polling reads saved state; it never performs the extraction.

The worker runs in a separate process from HTTP. Postgres row locks, leases and completion tokens allow recovery after a process exits and prevent stale workers overwriting a newer attempt. Retryable source failures get up to three attempts. Failed imports retain their URL and can be manually completed or retried. Refreshing source facts preserves user corrections. Recent source revisions are bounded to ten per item. Optimistic revision checks reject conflicting edits with 409.

Flexible JSON is the prototype schema: `extracted` holds source facts and per-field evidence, `overrides` holds user corrections, and revision snapshots hold previous source facts. Typed SQL columns are limited to ownership, collection access, job state, coordinates for viewport queries, timestamps and versioning. The additive tables use the existing durable database to make live accounts work; housing/activity fields remain free to evolve. A finalized domain schema can later replace these documents behind the same API.

Sources are untrusted. The fetcher only follows HTTP(S), standard ports, and public DNS results; every redirect is revalidated and its address pinned while preserving TLS verification. Reads are size/time bounded. No source scripts execute, private network addresses are blocked, and cookies/credentials are never forwarded to sources. Images use the authenticated proxy, size bounds and metadata-stripping re-encoding. The model cannot invent coordinates and only adds fields with verbatim source evidence. No model or geocoding configuration is necessary for basic source/manual imports.

Optional Railway variables:
- `OPENAI_API_KEY`: structured extraction of otherwise unstructured page text; existing server key can be reused. Private notes and account identity are not sent.
- `SAVED_CITY_AI_MODEL`: defaults to `gpt-4.1-mini`.
- `SAVED_CITY_GOOGLE_API_KEY`: separate server key with Geocoding API enabled. Do not reuse a referrer-restricted browser Maps key. Ambiguous/partial matches stay unlocated. Provider coordinates expire after 28 days and the worker removes expired values.

The browser still uses the existing Maps JavaScript API key/map ID. No new browser secret is needed.

## API surface

All endpoints below require the shared bearer identity and are allowlisted through `/api/mexico-city/saved…` on the frontend. Responses are private/no-store; mutations enforce same-origin browser requests.

| Operation | Endpoint |
| --- | --- |
| Browse, collections, groups | `GET /discovery/saved` |
| Authorized viewport markers | `GET /discovery/saved/map` |
| Create / rename / share collection | `POST /collections`, `PATCH /collections/{id}` |
| Save URL | `POST /imports` |
| Detail / optimistic edit / delete | `GET`, `PATCH`, `DELETE /items/{id}` |
| Personal note, status and visit link | `PATCH /items/{id}/personal` |
| Re-read source | `POST /items/{id}/refresh` |
| Authorized source image | `GET /items/{id}/image` |

## Researched examples

Reviewed 12 October 2026. `backend/saved_city/reviewed_sources.json` contains small, explicitly dated research snapshots for exactly these four URLs. They support the requested trial when the origin refuses automated reading. A snapshot is identified as research, not a successful current source fetch. Unknown URLs receive no fabricated fallback. Fresh source fields take priority; manual corrections take priority over both.

- [Santa Fe hockey club](https://pistadehielosantafe.com/clubes-y-servicios/hockey/): México City Jr. Kings at Centro Santa Fe. Adult practice options and fees are unconfirmed. The rink’s published street number conflicts with other listings; the starter uses an approximate [mall location](https://www.openstreetmap.org/way/30291947).
- [ISK8 hockey](https://isk8.mx/hockey/): youth/adult programs. [Official address](https://isk8.mx/contacto/): Paseo Interlomas, Huixquilucan, Estado de México. Approximate [mall location](https://www.openstreetmap.org/way/187677332).
- [Ice Station Buenavista](https://www.ice-station.com.mx/): hockey academy advertised at Forum Buenavista. The source certificate failed direct verification during the trial; archived/indexed official text was reviewed separately. No current schedule or hockey fee is asserted. Approximate [mall location](https://www.openstreetmap.org/node/4829767292).
- [Requested apartment](https://propiedades.com/inmuebles/departamento-en-renta-sin-nombre-de-calle-san-pedro-de-los-pinos-df-31353003): advertised 22,000 MXN, two bedrooms, two bathrooms, 75 m². The source names San Pedro de los Pinos, Benito Juárez, but no usable street address. The card intentionally has no map point until the player locates it. Maintenance, deposit and price period remain unknown.

OpenStreetMap positions credit contributors and link to ODbL. They represent mall locations, not verified rink entrances. The activity library offers an explicit “Save all three rinks” action, which submits the same durable import requests as any other saved link.

## Delivery and verification

Scope: `apps/lab` Mexico City experience, related Railway backend and project memory. Other apps are excluded. Branch `codex/city-saved-places`.

Railway’s existing migration command remains `uv run --group dev alembic upgrade head`. New head: `4city121026` after `3acct101026`. The start command becomes `uv run python start_service.py`, supervising HTTP and the independent worker. Either child exiting triggers a service restart. A separate worker service can later run `uv run python -m saved_city.worker` with the same database and keep uvicorn as the HTTP service.

Local source checks include real fetch failures, not only fixture success. Isolated backend tests cover persistence, URL deduplication, edits across refreshes, private notes, contributor/read-only access, revoked sharing, image access, unknown/zero prices, SSRF boundaries, retries/leases and source provenance. Migration checks exercise fresh and legacy upgrades without modifying the live database. Browser and hosted evidence is recorded in `SAVED_PLACES_VERIFICATION.md`.

Production proof requires deploying this backend revision as well as the frontend. A frontend preview against the old backend cannot verify persistence. Do not claim a live-account trial until the live saved-place API is available and an authenticated account has completed save → process → detail → reload → map.
