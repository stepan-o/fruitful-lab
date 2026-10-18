"""Author-facing synopsis of the cast readability standard; no runtime changes."""


def render_readability():
    return '''<div class="section-divider"></div>
    <span class="kicker">18 October · occupied-scene requirement · implementation pending</span>
    <h3>Recognize the cast before reading the dialogue.</h3>
    <p>The crowded factory test loses LIMEN and STILETTO among the workers. Their close-up models are approved; recognition at room distance still needs work. Speech should explain what a character thinks. Body, equipment and movement should establish who is speaking.</p>
    <div class="scale-lenses">
      <article><span class="kicker">01 / IDENTITY</span><h4>Who is there?</h4><p>Larger supervisor bodies, silhouette, broad colour areas and equipment persist when motion pauses or the actor turns away. Keep two independent cues, including one that works without colour or movement.</p></article>
      <article><span class="kicker">02 / ACTION</span><h4>What are they doing?</h4><p>Make the actor, recipient and contact readable together. A worker in trouble takes visual priority over a supervisor continuing a routine.</p></article>
      <article><span class="kicker">03 / CONSEQUENCE</span><h4>What changed?</h4><p>The queue stays held, a worker retreats, the conveyor starts. Dialogue adds motives and reactions to an event the player can already see.</p></article>
    </div>
    <div class="principle-grid">
      <article class="principle"><span class="kicker">Worker 01</span><h3>A distinct workforce.</h3><p>Smaller industrial bodies, exposed joints, repeated task rhythms and a proposed blue armour family in several persistent shades. Hands, hesitation and fatigue become prominent when a worker is the subject. Routine does not mean invisible.</p></article>
      <article class="principle"><span class="kicker">LIMEN</span><h3>Mass. Stillness. Cyan asymmetry.</h3><p>A larger body, broad light-steel armour and a planted stance frame one living forearm blade. Preserve its coherent core without bloom. The body and emitter housing still identify him when the energy powers down.</p></article>
      <article class="principle"><span class="kicker">STILETTO</span><h3>Black chrome. Twin edges. Intent.</h3><p>A taller slender outline, readable metallic highlights and space around both blades. Audition broad red body accents that also read from behind. Purposeful pacing and decisive threats reinforce identity; the red visor is a secondary cue. The same body remains recognizable with welders fitted.</p></article>
      <article class="principle"><span class="kicker">CATHEXIS</span><h3>Pale fabric. Crown. Theatre.</h3><p>A larger body, pale dress, hair and crown read from the back. Hot Walk and expressive poses carry attitude. Grace, grime and warm eyes add state; small facial details cannot carry distant recognition alone.</p></article>
    </div>
    <h4>Sheet audition · scale and colour proposals</h4>
    <p>All supervisors should be generally larger than workers. Start the shared-scale lineup at Worker 1.00, LIMEN 1.25, STILETTO 1.20 and CATHEXIS 1.22, measured foot to skull. These are audition ratios, not approved runtime dimensions.</p>
    <div class="principle-grid">
      <article class="principle"><h4>Worker family · industrial blue</h4><p><span style="display:inline-block;width:2em;height:1em;background:#335E8A" aria-hidden="true"></span> Dark #335E8A · <span style="display:inline-block;width:2em;height:1em;background:#467BA4" aria-hidden="true"></span> Standard #467BA4 · <span style="display:inline-block;width:2em;height:1em;background:#6A94B5" aria-hidden="true"></span> Light #6A94B5</p><p>Broad painted armour regions, neutral joints and persistent shade/wear variants within one workforce family.</p></article>
      <article class="principle"><h4>Supervisor body families</h4><p><span style="display:inline-block;width:2em;height:1em;background:#AAB9BD" aria-hidden="true"></span> LIMEN · light steel + cyan equipment</p><p><span style="display:inline-block;width:2em;height:1em;background:#C5443C" aria-hidden="true"></span> STILETTO · black chrome + candidate red body areas</p><p><span style="display:inline-block;width:2em;height:1em;background:#D8CBAF" aria-hidden="true"></span> CATHEXIS · aged ivory + antique gold</p></article>
    </div>
    <p>Regenerate matching front/side/back A-pose sheets as needed, preserving character identity. Compare the lineup, silhouettes and alternate equipment at small scale before replacing a model. Changed size or geometry requires fresh rig, stride, contact and clearance checks.</p>
    <p><a href="/loopforge-design/production/CAST_SHEET_REVISION_BRIEF.md">Read or save the character-sheet revision brief ↗</a></p>
    <div class="callout"><strong>Attention follows the event.</strong> First the active cause, recipient and consequence; then relevant reactions; then routine workers and machinery; finally architectural texture. Supervisors stay findable without always dominating the frame.</div>
    <div class="callout"><h4>The background is part of the hierarchy.</h4><p>The current room colour suppresses bodies and movement. Audition a quieter neutral mid-value floor and lower-chroma walls, preserving industrial green and patina in selected structures. Keep seams, grime and machinery highlights from competing with feet, hands and blades. A uniform green light wash must not merge the cast’s colours.</p><p><span style="display:inline-block;width:2em;height:1em;background:#666860" aria-hidden="true"></span> Floor proposal · neutral #666860 &nbsp; <span style="display:inline-block;width:2em;height:1em;background:#343D38" aria-hidden="true"></span> Wall proposal · charcoal-green #343D38</p><p>Compare the same occupied scene against current, neutral diagnostic and proposed room backgrounds. Hold camera, acting and lighting fixed, then test lighting separately. These swatches are art references; actual rendered contrast still needs review.</p></div>
    <details><summary>Compose the room and preserve identity at low quality</summary>
      <p>Place workers at real stations and queues. Give supervisor routes and confrontations clear silhouettes. Separate body and tool contours from the background through framing, material values and controlled room lighting. Physical clearance and visual separation are different checks.</p>
      <p>Portraits reveal craft and faces. Room cameras must reveal identity and action. Small operator-console views must still distinguish larger supervisors from the blue workforce and from each other; close room views reveal contact and expression. Measure useful actor size in the actual display and render resolution.</p>
      <p>Keep silhouette, equipment, core emission and useful contrast through Performance settings. Optional bloom and shadows can disappear without taking identity with them. Do not add a shadow-casting lamp per robot, alter world positions to face the camera, or show an inactive tool as powered on.</p>
    </details>
    <details><summary>The recognition gate · speech and names hidden</summary>
      <p>After a cast introduction, ask the reviewer to locate each visible supervisor in about three seconds from a paused room shot, then read an action and its result during playback. Repeat at actual room and operator-console display sizes across all three room cameras, side/rear views and Performance/Balanced settings. Check bloom off, shadows off, reduced motion and a grayscale still.</p>
      <p>Record exact scene, assets, camera, actor pixel height, settings, answers and timing measurements. Test emitter-off and alternate tools/masks too. A failed important view stays Needs work. Newcomer playtests and physical-device measurements follow separately.</p>
      <p>This is a review protocol to implement. The current performance lab has no dedicated names/bubbles-off recognition mode. A completed timing run is not a visual pass.</p>
    </details>
    <p><a href="/loopforge-design/production/CAST_READABILITY_STANDARD.md">Read or save the complete cast readability standard ↗</a></p>
    '''
