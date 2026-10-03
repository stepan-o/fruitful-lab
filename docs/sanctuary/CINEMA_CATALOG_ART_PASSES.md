# Cinema and catalog — 3 October 2026

Local visual iteration for the opening chapter. The approved journey/world diptych
is the craft reference: coherent spatial construction, etched material detail,
quiet living atmosphere, and a small number of luminous focal points.

## Pass record

Each stage below was rendered and visually reviewed in the local reader before
moving to the next. These are changes to original procedural art, not generated
publisher-image derivatives.

1. **Cinema composition:** expanded the cramped side-by-side comparison into two
   full-width scenes. Built a symmetrical auditorium with a recessed stage,
   proscenium, fluted columns, wall sconces and a central aisle. Corrected the
   mirrored exit sign during the next pass.
2. **Drapes:** separate hanging velvet, gathered ties, gravity-led pleats,
   tassels and upper swags. Highlights follow the folds; the fabric stays still.
3. **Audience:** three perspective rows, 24 occupied seats, varied hair and
   shoulder silhouettes, armrests and screen-facing rim light. People remain
   still instead of sharing a synthetic breathing loop.
4. **Screen:** original coastal film scene with a lighthouse, cut rock faces,
   sailboat, birds, graphic cloud banks and reflected light. Motion is limited
   to clouds, boat drift, water glints, low projector variation and airborne dust.
5. **Stranger Returns draft:** cyclists below a small town and a supernatural sky;
   portrait composition and original title established.
6. **Stranger Returns finesse:** fractured light, telephone wires, town windows,
   bark cuts, bicycle detail, headlights and drifting motes. Restrained ochre,
   clay red and teal replace the reference's saturated blue/red lighting.
7. **Renew’s Day draft:** cellist and rose window framed by gothic architecture.
8. **Renew’s Day finesse:** stained-glass divisions, masonry joints, braided hair,
   face, dress pleats, cello strings and sound holes, books, candlelight and dust.
   The cooler palette stays within Sanctuary's stone and paper colors.
9. **One More Round draft:** interlocking stair flights, doorways, a contestant
   and a foreground masked sentry.
10. **One More Round finesse:** tread planes, cut edges, wall joints, additional
    figures, geometric rank marks, mask mesh, hood seams, pockets and zipper.
    Rose walls are toned to clay; green becomes aged teal. Door light breathes.
11. **Catalog layout:** recognizable logo/profile/header cadence, three portrait
    covers, source links, native horizontal scroll/snap on phones, and tap or
    keyboard access to a larger cover with its reference context.
12. **Subscription inscription:** replaced the simple glow/underline with an
    engraved iron mount, beveled brass edges, warm lettering, a slowly travelling
    hot seam and a sparse ember cycle.

## References and attribution

- [Stranger Things prop archive](https://www.netflix.com/tudum/features/stranger-things-props-archive):
  bicycles and the familiar town/uncanny-world contrast. The Duffer Brothers / Netflix.
- [Wednesday production feature](https://www.netflix.com/tudum/articles/wednesday-tim-burton-behind-the-scenes):
  gothic architecture, costume silhouette and cello. Wednesday's production team /
  MGM Television / Netflix; characters created by Charles Addams.
- [Squid Game production design](https://www.netflix.com/tudum/articles/squid-game-season-2-production-design):
  interconnected stairs and the juxtaposition of playful geometry with coercion.
  Hwang Dong-hyuk; production design by Chae Kyoung-sun / Netflix.

Official production images were inspected as references. The runtime drawings use
original geometry, scenes, character designs and invented titles. Reference links
sit beside the covers and in the public credits register. “Original” describes
our rendering; it does not claim the referenced properties are ours or invent a
blanket legal clearance. The official Netflix wordmark keeps its existing asset
manifest, original proportions, and separate editorial source record.

## Motion and delivery

- No new remote runtime media, raster illustrations, shaders or dependencies.
- Static geometry remains readable with motion off, JavaScript motion unavailable,
  reduced motion, or print. Build-generated hashed JavaScript/CSS carries these
  procedural drawings; the Netflix bitmap continues through the media manifest.
- `useLivingPlate` gates CSS motion using intersection, page visibility, the
  system preference and the existing global motion switch. It schedules no
  JavaScript animation frames and cleans up its observers and listeners.
- Only small light/atmosphere layers animate. The auditorium, drapes, audience,
  cover architecture and characters stay fixed. The catalog behind an open cover
  inspector is paused; the larger scene is mounted only while being inspected.
- Cover inspection uses a native modal dialog, explicit close button, Escape
  cancellation, and native focus restoration. Source links remain ordinary links.

## Verification

Browser review covers each pass, desktop and narrow layouts, moving versus still
frames, cover inspection and source attribution. Automated checks exercise motion
suspension/cleanup and all three cover dialogs. Final check results are recorded
in the accompanying delivery notes; this file does not claim field performance
on devices that have not been measured.

Final local validation: 35 suites / 152 tests pass, as do the media integrity checks, production build, scoped ESLint and whitespace checks. The full Jest run reports a worker-shutdown warning after its passing results; the new motion/dialog suite passes separately without that warning. Browser checks cover 320, 390 and 768 CSS pixels plus desktop, visible movement across separate frames, the global still-mode switch, cover enlargement, Escape/close dismissal and focus restoration. No horizontal page overflow was observed. The final browser capture session was interrupted; prior pass captures and responsive checks are the visual evidence.
