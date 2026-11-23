# Loopforge mobile boundaries

5 October 2026. Scope: the Loopforge entrance only.

The supplied iPhone screenshot shows white browser areas above and below the
factory. The live page confirmed the underlying mismatch: `html` was #020504,
`body` was white, its color scheme was normal, and there was no theme-color or
viewport-fit declaration.

The entrance now declares a dark color scheme and #020504 theme color in its
server-rendered viewport metadata. Both document surfaces use #020504 while the
landing is mounted. `viewport-fit=cover` is paired with safe-area padding around
the interface; the conveyor clears the bottom safe area and footer. The scene,
artwork, motion schedule, frame budgets and game simulation are unchanged.

This follows [WebKit's safe-area guidance](https://webkit.org/blog/7929/designing-websites-for-iphone-x/).
Background CSS matters alongside theme metadata: Safari versions differ in how
they extend page colors under browser chrome; see the
[WebKit maintainer's explanation](https://bugs.webkit.org/show_bug.cgi?id=301756#c2).

Production verification: all 264 tests across 57 suites, all 11 retained asset
releases, scoped ESLint and the production build pass. Browser checks at
320x568, 390x844, 768x1024 and 1440x900 retain the layout without page overflow.
At 390x844, computed html/body colors are both rgb(2, 5, 4), color scheme is dark,
and server-rendered viewport/theme metadata matches. Reset works after a jam.
Navigating to the white Stepanoskin directory clears the Loopforge document
colors and metadata; navigating back restores them. Exact hosted verification
is recorded in the PR after publication. Responsive Chromium screenshots cannot certify iOS Safari's native
status/address bars. Their final appearance still needs a physical iPhone check.
No added JavaScript, media downloads or animation work. Field performance is
unmeasured.
