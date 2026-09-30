# Stepanoskin route group

This top-level App Router group holds public Stepanoskin pages in the Lab sandbox.
Its layout inherits the app root layout and renders children without adding a shell.

The public landing page is at `/stepanoskin`, implemented in
`stepanoskin/page.tsx`. It is accessible without login. Parenthesized groups
do not add a URL segment. Do not add a group-level `page.tsx`, which would
conflict with the existing `/` page.
