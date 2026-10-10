# Google Maps setup for Mexico city discovery game

The prototype uses Maps JavaScript API, a browser API key and a JavaScript **Vector** map ID. It does not require an OAuth client, Google sign-in, Places API or Routes API. Fruitful Lab email/password authentication remains the account flow. Directions currently open the Google Maps app/site through Maps URLs.

1. Select the intended Google Cloud project; its project name does not have to match the game name. Link billing if required.
2. APIs & Services → Library → **Maps JavaScript API** → Enable.
3. APIs & Services → Credentials → Create credentials → **API key**. Restrict its application to **Websites** and its API access to **Maps JavaScript API**. Allow the exact production and preview origins used for this app, e.g. `https://www.fruitfulab.net/*`, `https://fruitfulab.net/*` and the current preview hostname with `/*`. Never authorize every `vercel.app` project. Add local test origins separately if needed.
4. Google Maps Platform → Map Management → Create map ID. Select **JavaScript → Vector**; name it “Mexico city discovery game”. Leave **tilt and rotation disabled** for the initial north-up experience; these can be changed later. Optional cloud map style can be associated later.
5. In the Fruitful Lab Vercel project, Settings → Environment Variables, add to Preview for branch **`codex/mexico-city-field-game`**:
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: browser key.
   - `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`: vector map ID.
6. Create a new preview build after adding/changing either value. Authorize its exact hostname in Google. Add Production environment values only when enabling the production release.

Both values are browser-visible configuration. A map ID is a public identifier; the JavaScript API key must be delivered to the browser to load the SDK. Vercel “secret/sensitive” storage does not make a `NEXT_PUBLIC_` build value private. Protect the browser key with website + API restrictions. Keep its value out of source control. Server-only API credentials and OAuth client secrets, if introduced later, must use separate private variables without `NEXT_PUBLIC_`.

The app retains an interactive, dated geographic fallback when either value is missing or Google fails to load. The overlay network is independently dated reference data, even when the basemap is Google. No live Metro/Cablebús service-status claim is made.

For cloud styling: use light warm land, subtle road hierarchy, muted parks and water, low visual priority for generic POIs, and readable neighborhood/transit labels. Keep Google attribution and legal controls unobscured. The game owns illustrated/photo markers, territory colour, sheets and controls; these do not require a cloud style to work.

Sources checked 10 October 2026:
- https://developers.google.com/maps/documentation/javascript/get-api-key
- https://developers.google.com/maps/documentation/javascript/map-ids/get-map-id
- https://developers.google.com/maps/api-security-best-practices
- https://developers.google.com/maps/documentation/javascript/cloud-customization
