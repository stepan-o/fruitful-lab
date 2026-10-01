# Stepanoskin Route Group Audit

Scope: incremental route-structure update to the Lab sandbox on 2026-09-30.
Use the existing system audit and current project memory for other contracts.

- Added `apps/lab/app/(stepanoskin)/layout.tsx` as a top-level route group.
- The server layout passes children through and inherits the existing root layout.
- Public `/stepanoskin` is implemented at `(stepanoskin)/stepanoskin/page.tsx`.
- The existing middleware gates only admin/contractor paths, so this page requires no login.
- The landing page uses the Loopforge main logo plus gunmetal, glare, and noise assets copied into `apps/lab/public/stepanoskin/`.
- Its client-side native locale dictionary supports English, French, Spanish, Russian, Mandarin Chinese, and Thai, with English as the default.
- Locale choice persists in the versioned `stepanoskin_locale_v1` cookie so server rendering does not flash the wrong language on return visits.
- Game Monetization is the only current menu item; the list is data-driven and styled to accommodate three to five choices.


## Addendum: Sanctuary Economics reader (2026-10-01)

The module placeholder is replaced by a public server-rendered overview and 21
addressable chapter views under `/stepanoskin/game-monetization`. Content lives in
`apps/lab/lib/sanctuary`; the client receives only the active chapter, navigation
titles, cited sources and relevant media metadata. The English editorial draft
has six-language controls and an explicit language notice. No auth/backend change.

The `sanctuary` pack adds 17 selected images (38 WebP variants, 5,066,276 bytes
across the whole library). Native responsive srcset reports exact variant widths;
only the cover image is prioritized. Chapter imagery is lazy; full-resolution
zoom mounts on demand. Contents and image dialogs use native modal behavior.
Read `docs/sanctuary/README.md` for factual boundaries and archival provenance.
