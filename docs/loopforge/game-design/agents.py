"""Current character review entry point; legacy engineering work is separated."""
from pathlib import Path
from html import escape as e
import json


def render_agents():
    root = Path(__file__).resolve().parents[3]
    packs = {name: json.loads((root / f'apps/lab/lib/assets/generated/{name}.json').read_text())['assets']
             for name in ['loopforge', 'loopforge-console', 'loopforge-supervisors']}

    def pic(pack, key, label):
        variants = packs[pack][key]['variants']
        first = variants[0]
        sources = ', '.join(f'{v["src"]} {v["width"]}w' for v in variants)
        return f'<figure><a href="{variants[-1]["src"]}" target="_blank" rel="noopener"><img src="{first["src"]}" srcset="{sources}" sizes="(max-width:700px) 90vw, 520px" width="{first["width"]}" height="{first["height"]}" loading="lazy" decoding="async" alt="{e(label)}"></a><figcaption>{e(label)} · original concept reference</figcaption></figure>'

    out = ['''<header class="section-head"><span class="kicker">15 October · current character pipeline</span>
    <h2>Characters you can recognize in motion.</h2>
    <p>The prebuilt factory needs readable people: workers carrying the consequences of a shift, and supervisors whose posture, tools and actions reveal who they are.</p></header>
    <div class="callout"><h3>Start with the current model library.</h3>
    <p><a href="/stepanoskin/loopforge/play/asset-review">Open the character &amp; motion players →</a></p>
    <p>LIMEN, Worker 01 and STILETTO use the new Meshy bodies. CATHEXIS adds original/corrected Hot Walk and Happy Sway plus a separate mask-fitting view. Inspect one character or candidate part at a time under factory lighting. Drag to orbit, scroll or pinch to zoom, reset the view, and switch to fixed CCTV angles.</p></div>
    <p><a href="/stepanoskin/loopforge/design#model-briefs">Model briefs: input art, copyable stages and downloadable rebuild kits →</a></p>
    <h3>What is available now</h3><div class="principle-grid">''']
    current = [
        ('LIMEN', '/stepanoskin/loopforge/play/agent-test/limen', 'Body, emitter and living energy',
         'The accepted body and forearm mount, walk/run clips and authored emitter-adjustment idle. Cyan strands move, flicker and power down as he works the controls.',
         'Next: paired gate inspection and worker contact.', 'LIMEN_MESHY_REVIEW.md'),
        ('Worker 01', '/stepanoskin/loopforge/play/asset-review/worker', 'Nineteen motions on one rig',
         'Idle, scratch, locomotion, carry, gestures and incident reactions. Hot Walk is retained as Cathexis’s future default gait, demonstrated on this worker stand-in.',
         'Audited, not corrected. Next: gait clearance, natural arm/wrist posture and a finger-rig feasibility check; afraid recoil and precise machine work still need authoring.', 'WORKER_MOTION_REVIEW.md'),
        ('STILETTO', '/stepanoskin/loopforge/play/asset-review/stiletto', 'Blades, active welders and red visor',
         'Owner accepts the blade appearance and acting. The same motion player now offers twin welders and mixed tools, blue-white flame flow and a red visor. Eighteen source motions plus five corrected alternatives remain available.',
         'Next: module-specific clearance, remaining leg contacts, blends and machine-contact acting. Blade audit counts do not certify welders.', 'STILETTO_MOTION_REVIEW.md'),
        ('CATHEXIS', '/stepanoskin/loopforge/play/asset-review/cathexis', 'Hot Walk, sway and Grace coverage',
         'Compare original/corrected Hot Walk and Happy Sway. A broader waist transition removes the hard upper fold; reduced rear flare, separate foot/knee paths and front panels following their own thigh preserve her theatrical acting and hip/temple hand contacts. Six baked skirt controls, grounded soles and closed loop endpoints preserve neutral geometry; 1,907 corrected poses pass the sampled lower-skirt/leg and leg/leg crossing tests. Full/half Grace and illuminated eyes remain in separate static fitting.',
         'Next: owner motion review, moving Grace fit, normal map, blends and paired contacts. No live cloth simulation. Stage 2 remains closed; no new expression masks or facial rig.', 'CATHEXIS_MOTION_REVIEW.md'),
    ]
    for name, route, title, current_text, next_text, record in current:
        out.append(f'<article class="principle"><span class="kicker">{name} / current review</span><h3>{title}</h3><p>{current_text}</p><p><strong>{next_text}</strong></p><p><a href="{route}">Inspect {name} →</a> · <a href="production/{record}">Review record ↗</a></p></article>')
    out.append('''</div><p>These players review the new assets. Main play still uses placeholder bodies; coordinated encounters and crowd performance with the new cast remain to implement. Passing an isolated motion check does not approve animation blends, machinery contact or a complete shift.</p>
    <h3>STILETTO: what the motion says</h3>
    <p>With both blades fitted, the source Idle reads as alert and source Alert as idle. The player labels now follow those readings and retain the original aliases.</p>
    <div class="principle-grid"><article class="principle"><span class="kicker">THREATEN / source Argument</span><h3>Make a worker yield.</h3><p>The blade display reads as coercion. Proposed responses: comply, freeze, retreat or refuse. Output might recover while fear and resentment accumulate; fear/recoil acting still needs authoring.</p></article>
    <article class="principle"><span class="kicker">ATTACK / source Reprimand</span><h3>Commit to a strike.</h3><p>The corrected gesture reads as a physical attack. It needs a target, a timed contact and a matching worker reaction. It is a separate intention; a threat can end without violence.</p></article></div>
    <p>These are accepted visual meanings and proposed encounter uses, not implemented combat. The engine chooses and logs the action and outcome. Animation makes them visible. Different motives can produce the same threat; belief and intention traces explain why.</p>
    <h3>One review process for every character</h3>
    <div class="scale-lenses"><article><span class="kicker">01–02 / IDENTITY</span><h4>Body, equipment and effects.</h4><p>Preserve the concept silhouette and materials. Inspect each tool’s mount and the cues that identify the character in a dark room.</p></article>
    <article><span class="kicker">03–04 / ACTING</span><h4>Motion and physical contact.</h4><p>Read the action without captions. Scrub feet, limbs and tools; compare source and corrected motion with its exact asset revision.</p></article>
    <article><span class="kicker">05–06 / DELIVERY</span><h4>CCTV and performance.</h4><p>Review actual camera scale and room lighting. Measure the intended scene and device; keep unmeasured crowd costs explicit.</p></article></div>
    <p>Each player records accepted details, candidates, remaining work and unmeasured checks. Character-specific controls fit this shared structure. <a href="production/CHARACTER_REVIEW_STRUCTURE.md">Intake and acceptance contract ↗</a></p>
    <h3>The cast’s visual anchors</h3><p>Original art sets silhouette, material and acting direction. CATHEXIS has body/mask fitting and two source/corrected motion candidates. Rivet Witch and Thrum still have reference art and pending entries; their models have not arrived yet.</p><div class="agent-gallery">''')
    cast = [
        ('Worker 01', 'thrum-conveyor', 'loopforge-supervisors', 'Worn metal. Exposed joints. A working body.', 'Weight, fatigue, hesitation and fear must read in the posture. Keep workers smaller and less ornate than supervisors.'),
        ('LIMEN', 'limen', 'loopforge', 'Heavy armour. One asymmetric cyan blade.', 'The blade is his dark-CCTV identity cue. A planted stance holds a worker and the queue behind them. The emitter-check idle gives that tool a physical routine.'),
        ('STILETTO', 'stiletto-portrait', 'loopforge-console', 'Black chrome. Long limbs. Twin blade forearms.', 'Decisive turns and impatient directives. Her equipment needs its own clearance envelope. A welder module is an asset option; it does not grant unimplemented engineering ability.'),
        ('CATHEXIS / costume & motion', 'cathexis', 'loopforge', 'Cracked porcelain. Warm eyes. Controlled attention.', 'Hot Walk is her only travel gait; she never runs and has no alert state. Gentle theatrical presence, full/half Grace over her original mechanical face and grime variants are documented in Model briefs. The accepted clean body supports mask coverage changes and warm eye lights. Her first two rigged motion candidates are available; paired acting remains open; face articulation is outside the current scope.'),
        ('RIVET WITCH / awaiting model', 'witch', 'loopforge', 'Hood. Green goggles. A practical working kit.', 'Brace, inspect, wrench and test at real machine contacts. Frustration with unfinished damage should be readable before dialogue.'),
        ('THRUM / awaiting model', 'thrum', 'loopforge', 'Speaker head. Chest resonator. Deliberate rhythm.', 'Workers visibly settle around him. Stress relief and slipping discipline need distinct responses, with a real throughput cost.'),
    ]
    for name, key, pack, shape, motion in cast:
        out.append(f'<article>{pic(pack, key, name)}<div><span class="kicker">{name}</span><h3>{shape}</h3><p>{motion}</p></div></article>')
    out.append('''</div><h3>Next integration gate: one complete encounter</h3>
    <p>The next production slice joins the new bodies to real action timing. Start with a worker and LIMEN at Security, then a cradle transfer and a supervisor response. These encounters are not yet demonstrated with the new cast.</p><div class="principle-grid">
    <article class="principle"><span class="kicker">APPROACH</span><h3>Reach and reserve.</h3><p>The worker reaches a real queue slot, stops and faces LIMEN. The same identity and position persist through every camera.</p></article>
    <article class="principle"><span class="kicker">CONTACT</span><h3>Inspect this worker.</h3><p>Both actors and the scanner are reserved. Tools meet their targets; refusal or interruption changes the action.</p></article>
    <article class="principle"><span class="kicker">CONSEQUENCE</span><h3>Release or hold.</h3><p>The engine commits the outcome. Animation expresses it, and the queue and throughput respond.</p></article></div>
    <p>Agents are defined by beliefs, desires and intentions; LLM use remains optional. The engine owns eligibility, reservations and outcomes. Camera movement, cosmetic energy and playback quality never decide those outcomes.</p>
    <p><a href="AGENT_CHARACTER_AND_ANIMATION_DIRECTION.md">Character and action architecture ↗</a> · <a href="/stepanoskin/loopforge/architecture/webview">Rendering and asset delivery ↗</a> · <a href="LIMEN_BLADE_DESIGN.md">LIMEN’s blade direction ↗</a></p>
    <details><summary>Earlier engineering prototype · rejected placeholder cast</summary>
    <p>The 12 October test used older spherical robots. It exercises deterministic reservations, prop ownership, fixed-tick replay and skeletal/baked comparisons. It does not demonstrate the new character art, contact accuracy or crowd performance.</p>
    <p><a href="production/AGENT_PRODUCTION_TEST.md">Historical engineering record ↗</a> · <a href="/stepanoskin/loopforge/play/agent-test">Open the legacy fixture ↗</a></p></details>''')
    return ''.join(out)
