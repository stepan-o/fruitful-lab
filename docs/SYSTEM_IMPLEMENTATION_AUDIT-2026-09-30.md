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
