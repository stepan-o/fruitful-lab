# Accounts and authenticated game — verification

10 October 2026. Scope: Fruitful Lab frontend/shared account backend and the signed-in Mexico city discovery game. All mutable checks used disposable local accounts and SQLite; no real user was created, reset, paused or emailed.

## Verified

- Backend suite: **44 tests passed**, including real JWT login, ordinary/admin permissions, anonymous denial, public signup restrictions, pending setup, duplicate email casing, token digest storage, reissue/expiry/single use, session revocation, paused recovery rejection, protected administrators, search and group-label preservation, mocked mail delivery/cooldown/throttling, and game goal completion/persistence.
- Complete migration chain upgrades a fresh SQLite database through `3acct101026`. PostgreSQL migration SQL compiles offline. Live PostgreSQL migration/concurrent-request behavior was not exercised.
- Final frontend suite: **81 suites, 416 tests and one snapshot passed**, run serially after correcting the new pure-state test environment. An initial concurrent run hit an unrelated Sanctuary timeout; the serial rerun passed it. Production build passed, including Next.js production type checking and all retained-asset checks. Account/form/state and proxy regression tests are included in this count.
- Changed-source lint: zero errors; three existing warnings for dynamic discovery-photo `<img>` elements. Standalone repo-wide `tsc --noEmit` also reports pre-existing test-file typing issues; the production build has its own passing type check.
- Browser: 390×844 mobile game login, wrong-password prompt, preserved-email recovery, truthful unconfigured-email response, successful sign-in, server-loading boundary, persisted goal after reload, account profile, logout and switching to a second identity without retained private state.
- Local frontend → proxy → backend → database: saved a photo against a selected bookshop outing, persisted its completion, awarded 30 personal points plus 10 learning points, created/joined a private group and received/accepted a 100-point challenge. Browser showed 40 adventure points, one saved discovery, one completed outing, an actual challenge action and a separate zero group score before peer validation.
- Administrator page opened from the game profile. Creating a pending player returned its private setup link. Checked account layout at 320, 390 and 1280 pixels, with no horizontal overflow on the narrow phone. Spanish/English switching works. Private tokens are excluded from screenshots.
- Recovery document: English translation, invalid-link state, restrictive CSP/no-referrer/no-store, and no third-party scripts. Password submission/token consumption is covered through backend/proxy tests; no real user's credential was changed in the browser.

Local screenshots (test identities): `/tmp/cdmx-account-game-mobile.jpg`, `/tmp/cdmx-account-profile-mobile.jpg`, `/tmp/cdmx-accounts-admin-mobile.jpg`, `/tmp/cdmx-accounts-admin-desktop.jpg`.

## Release boundary

The new backend routes and migration must be deployed before the website controls work against production. Email reset additionally needs backend Resend configuration and a verified sender; DNS/provider acceptance/inbox delivery have not been tested. Administrator-issued private setup links work without an email provider. See `../user_management.md` for exact settings and rollout order. No production deployment or merge is performed by this change.

Recovery throttling is process-local plus a database cooldown; shared limits and durable delivery are follow-up work for wider release. A preview pointing at the old production backend can verify frontend rendering but cannot prove the new account lifecycle. Google Maps preview keys scoped to the previous branch are separate configuration; the geographic fallback remains usable.
