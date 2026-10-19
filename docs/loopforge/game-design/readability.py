"""Concise art-direction decision; the linked standard holds the review protocol."""
from html import escape


def palette(colours):
    return '<span class="cast-swatches" aria-hidden="true">' + ''.join(
        f'<i style="background:{colour}"></i>' for colour in colours) + '</span>'


def render_readability():
    cast = [
        ('Worker 01', '1.00×', ['#335E8A', '#467BA4', '#6A94B5'], 'Industrial blue, several shades.',
         'Paint the broad armour plates; keep joints dark. The smallest, simplest bodies form a recognizable workforce.'),
        ('LIMEN', '1.25×', ['#AAB9BD', '#39434A', '#39D8DF'], 'Light steel. One cyan blade.',
         'Lift the value of his broad armour. Breadth and the asymmetric emitter must identify him even with the blade off.'),
        ('STILETTO', '1.20×', ['#24292E', '#C5443C', '#C6D0D3'], 'Black chrome. Red body accents.',
         'Try red on shoulders and upper back, keeping most of her body black. Long limbs and twin tools preserve her silhouette with blades or welders.'),
        ('CATHEXIS', '1.22×', ['#D8CBAF', '#A98A52', '#3B3937'], 'Aged ivory. Gold. A pale skirt.',
         'Preserve her approved dress, crown and hair. Increase her scale; keep enough pale fabric visible in dirty states to retain her identity.'),
    ]
    rows = ''.join(f'''<article class="cast-direction-row">
        <div><h4>{escape(name)}</h4><span class="cast-size">{size} body height</span></div>
        <div>{palette(colours)}<strong>{title}</strong><p>{change}</p></div>
        </article>''' for name, size, colours, title, change in cast)
    return '''<div class="cast-refinement">
    <section class="cast-step"><span class="kicker">01 / The room</span>
      <h3>Give the bodies a quieter background.</h3>
      <p>Try a neutral grey floor, muted charcoal-green walls and less busy floor texture. Keep industrial green and wear on selected machinery. Reduce the green light wash so the cast keeps its own colours.</p>
      <div class="cast-room-palette">''' + palette(['#666860', '#343D38']) + '''<span>Floor · neutral grey &nbsp; / &nbsp; Walls · muted green</span></div>
    </section>
    <section class="cast-step"><span class="kicker">02 / The cast</span>
      <h3>Separate the workforce from the supervisors.</h3>
      <p>Supervisors should be roughly 20–25% taller, with distinct body colours and silhouettes that survive a rear camera view.</p>
      <div class="cast-directions">''' + rows + '''</div>
      <p class="cast-note">Palette and height proposals for comparison, not approved model changes. Heights are measured foot to skull; tools and crowns add to the silhouette.</p>
    </section>
    <section class="cast-step cast-next"><span class="kicker">03 / Compare the shot</span>
      <h3>Test one crowded shot before remodelling.</h3>
      <p><a href="/stepanoskin/loopforge/play/readability" target="_top"><strong>Open the static readability studio →</strong></a></p>
      <ol>
        <li><strong>Fix the background first.</strong> Compare the existing room with a neutral background and the proposed palette. Keep camera, cast and lighting fixed; test lighting separately.</li>
        <li><strong>Try the cast treatment on existing models.</strong> Compare size and broad colour changes in the same shot, with names and speech bubbles hidden.</li>
        <li><strong>Approve at room and console sizes.</strong> Then revise only the sheets and model parts that still need work.</li>
      </ol>
      <p><strong>The test:</strong> after meeting the cast, can you find each supervisor in about three seconds, even when paused? Then, in motion, can you see who acts on whom and what changes?</p>
    </section>
    <p class="cast-note">The studio uses existing models with reversible colour and scale controls. Approve the treatment before changing the source models.</p>
    <div class="cast-reference-links"><a href="/loopforge-design/production/CAST_SHEET_REVISION_BRIEF.md">Sheet revision brief ↗</a><a href="/loopforge-design/production/CAST_READABILITY_STANDARD.md">Full visual standard &amp; review checks ↗</a></div>
    </div>'''
