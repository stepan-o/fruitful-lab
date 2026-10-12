"""Design-only synopsis of FACTORY_FLOOR_VISUAL_SCALE_PLAN.md; no game runtime."""
from html import escape
import json
from pathlib import Path


def render_floor_scale():
    root = Path(__file__).resolve().parents[3]
    pack = json.loads((root / 'apps/lab/lib/assets/generated/loopforge-focused.json').read_text())
    vs = pack['assets']['lobby-room']['variants']
    v = vs[0]
    srcset = ', '.join(f'{x["src"]} {x["width"]}w' for x in vs)
    art = f'<img src="{v["src"]}" srcset="{srcset}" sizes="(max-width:600px) calc(100vw - 38px), 640px" width="{v["width"]}" height="{v["height"]}" alt="Original Loopforge lobby: large pipe-framed doorway, paperwork walls and desk lamps form readable masses beneath the engraved detail" loading="lazy" decoding="async">'
    def rows(items):
        return '<table class="pairs"><tbody>'+''.join(f'<tr><th scope="row">{escape(k)}</th><td>{escape(v)}</td></tr>' for k,v in items)+'</tbody></table>'
    views = [
        ('01', 'Observe', 'Producer console · selected room', 'Read one room through three authored CCTV angles. Spot the constraint and choose where to act.', 'Same workers and events in every feed.'),
        ('02', 'Act', 'Focused workspace', 'Adjust the process, authorize a response or commit resources. See the concrete tradeoff.', 'An intention becomes an accepted command.'),
        ('03', 'Read the result', 'Return to the console', 'Restore the same room and angle. See the queue, machinery or worker consequence of your choice.', 'Use the result to decide the next move.'),
    ]
    sequence = [
        ('Freeze the contract', 'Capture the current renderer, real device profiles, actor pixels, frame intervals and memory.'),
        ('Find the composition', 'Three authored angles for Lobby, Security and Forge; primary/alternate framing, focused action and console return. Read work before adding grain.'),
        ('Calibrate the finish', 'World-scale materials, far/work/close responses and separate lighting, antialiasing and bloom comparisons.'),
        ('Prove motion', 'One worker and complete local task; stride, hands and machine progress agree with the simulation.'),
        ('Prove depth', 'Static atmosphere, contact and a bounded beacon impulse whose shadows align.'),
        ('Prove delivery', 'Versioned prefabs, visibility chunks, detail tiers, asset fallback and bounded disposal.'),
        ('Run the combined slice', 'Console → room → process adjustment → physical response → console. Prove agency and the total three-camera budget on desktop; one active feed on a real phone.'),
        ('Expand only after it passes', 'Apply the approved visual grammar to later rooms and recheck the worst transitions.'),
    ]
    return '''<div class="floor-scale-plan"><header class="section-head"><span class="kicker">Prebuilt-world calibration · 12 October 2026 · before the next build</span><h2>Observe the room.<br>Act on the factory.</h2><p>The factory keeps its scale. The producer console is the default observation hub: one selected room, three CCTV angles. Focused controls carry the active choices, then return you to see what changed.</p></header>
<div class="callout"><strong>Proposed build contract.</strong> These are targets for the next implementation. The previous lobby is a calibration kit, not a finished visual standard. Every visual, interaction and performance gate must pass together.</div>
<figure class="scale-reference">'''+art+'''<figcaption>Original lobby art — the doorway, desks and warm work pools read first. Fine engraved texture supports those forms. This is the artistic reference, not the current renderer.</figcaption></figure>
<h3>The player is the actor.</h3><p>CCTV supplies evidence and payoff. The core loop is choosing, adjusting and committing—not waiting for the next popup. Related actions can stay in their workspace; returning restores the console room, angle and unfinished context.</p>
<div class="scale-lenses">'''+''.join(f'<article><span class="phase-number">{n}</span><small>{escape(mode)}</small><h4>{escape(title)}</h4><p>{escape(question)}</p><strong>{escape(target)}</strong></article>' for n,title,mode,question,target in views)+'''</div>
<p class="scale-continuity">One simulation → one room → three viewpoints. The camera never decides the outcome.</p>
<h3>Three angles. Different information.</h3><p>Author the cameras around each room’s real equipment and connections. These are physical viewpoints, not three zoom levels.</p>'''+rows([
        ('A · Flow / arrival', 'Read the incoming work and the operating cluster. Do not squeeze the entire hall into a tiny frame.'),
        ('B · Work / contact', 'See workers at the key mechanism: effort, unsafe behaviour, waiting or a task response.'),
        ('C · Exit / threshold', 'Reveal downstream accumulation, departure or a connected-room encounter the other angles obscure.'),
        ('Desktop · proposed', 'One large feed and two smaller live alternatives; promote any angle. Compare this with equal panes during calibration.'),
        ('Phone / short screen', 'One legible live feed and three angle selectors. Room selection is separate. Do not render invisible feeds.'),
    ])+'''<div class="callout"><strong>Agency test:</strong> see a queue → open the relevant operating controls → adjust an available process constraint → see its response → return to the room feeds. If play amounts to Start shift and wait, this slice has failed. Quiet successful operation still needs no compulsory clicks.</div>
<h3>Observation does not change authority</h3><p>The adviser still resolves incidents in their assigned room automatically. A feed shows the receipt; it cannot undo the act. Elsewhere, permitted responses can be accepted or overridden. Direct controls must obey those same rules. The prebuilt opening uses the same console route.</p>
<h3>Readability is a separate axis</h3><p>Small alternate feeds show flow and silhouettes. A primary feed or operating workspace targets roughly 56–90 CSS pixels per worker; close inspection starts at 120–220. Measure inside the actual console. Any CCTV angle can be promoted; these size tiers do not define where its camera sits.</p>
<h3>The grain problem has three layers</h3>'''+rows([
        ('Shape', 'Large machinery, bodies and openings need readable silhouettes and contact. Fix these before texture.'),
        ('Surface finish', 'Wear and engraved strokes need consistent world scale and quieter distant variants. Paper, stone, brass and enamel cannot all compete at the same contrast.'),
        ('Camera noise', 'Optional final texture, independently controlled. It cannot rescue flat materials or cover a decision target.'),
    ])+'''<h3>The room must contain an action</h3><p>For the lobby: arrival → waiting space → desk and clerk → response → departure toward Dispatch. Calibrate a roughly 10–14 m local cluster inside the accepted 72 × 48 m hall. Keep the actual doorway, circulation space and 15 m roof height. Each CCTV angle frames a useful part of that action. On phones, promote one angle rather than shrinking three feeds and the whole hall.</p>
<h3>Movement must agree with the day</h3><p>The fixture moves workers about 1.1–1.44 m/s, while a minute represents an 18-hour shift. Multiplying walking speed by the calendar compression would destroy the feel. Schedule and preposition the crew during handover; keep live transfers authoritative, local handoffs visible and long journeys costly. Derive gait from distance and machine animation from task progress.</p>
<div class="callout">An accident or returned form needs a readable physical consequence in the primary feed. An alternate angle can reveal another part of the event; close inspection adds detail. All depict the same logged outcome.</div>
<h3>How the work is built</h3><ol class="scale-sequence">'''+''.join(f'<li><h4>{escape(a)}</h4><p>{escape(b)}</p></li>' for a,b in sequence)+'''</ol>
<h3>Passing means both feel and speed</h3>'''+rows([
        ('Visual', 'Recognisable Loopforge without grain; workers, material differences and action states read on desktop and phone. No sliding contacts, crawling texture or toy motion. Owner review decides the feel.'),
        ('Performance', 'Target 30 fps on the modest tier and 60 on capable desktops for the entire console, including all visible camera passes. One engine, one room graph and one pose update. Measure frame intervals, input, loading and memory after switches. The existing 30 fps samples are a baseline, not certification.'),
        ('Agency', 'Most substantive play is forming intentions and changing the factory. Observation supports those choices; no forced emergencies, navigation chores or repetitive acknowledgement.'),
        ('Truth', '10 and 100 workers retain identity, position and outcomes across views and quality tiers. Renderer, asset loading and animation do not create gameplay state.'),
        ('Expansion gate', 'One combined lobby / Security / conveyor slice passes every requirement before the remaining rooms get produced.'),
    ])+'''<p>The complete plan includes provisional pixel, frame-time, load and memory budgets; asset deliverables; renderer boundaries; failure responses; and the evidence checklist. A real phone profile still needs measurement.</p>
<p class="document-links"><a href="FACTORY_FLOOR_VISUAL_SCALE_PLAN.md">Read the complete build plan ↗</a> · <a href="/stepanoskin/loopforge/architecture/webview">Engine: webview & delivery ↗</a></p>
<details><summary>Research behind the choices</summary><p><a href="https://www.factorio.com/blog/post/fff-146" target="_blank" rel="noreferrer">Factorio’s art workflow</a> revisits assets in game and deliberately clarifies shape and contrast. <a href="https://www.factorio.com/blog/post/fff-144" target="_blank" rel="noreferrer">Its resolution work</a> shows why larger renders can require redesign. Our inference: author for the playing distance, not just for a source image.</p><p><a href="https://doc.babylonjs.com/features/featuresDeepDive/mesh/LOD/" target="_blank" rel="noreferrer">Babylon screen-coverage detail</a> and <a href="https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/thinInstances/" target="_blank" rel="noreferrer">instance visibility tradeoffs</a> support work-area partitioning. <a href="https://www.factorio.com/blog/post/fff-264" target="_blank" rel="noreferrer">Texture residency and overdraw</a> must be profiled. These sources do not establish our performance numbers.</p></details></div>'''
