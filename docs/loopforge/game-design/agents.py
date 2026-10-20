"""Character direction first; current players and supporting records follow."""
from pathlib import Path
from html import escape as e
import json
from readability import render_readability


def render_agents():
    root = Path(__file__).resolve().parents[3]
    packs = {name: json.loads((root / f'apps/lab/lib/assets/generated/{name}.json').read_text())['assets']
             for name in ['loopforge', 'loopforge-console', 'loopforge-supervisors', 'loopforge-focused']}

    def pic(pack, key, label):
        variants = packs[pack][key]['variants']
        first = variants[0]
        sources = ', '.join(f'{v["src"]} {v["width"]}w' for v in variants)
        return f'<figure><a href="{variants[-1]["src"]}" target="_blank" rel="noopener"><img src="{first["src"]}" srcset="{sources}" sizes="(max-width:700px) 90vw, 520px" width="{first["width"]}" height="{first["height"]}" loading="lazy" decoding="async" alt="{e(label)}"></a><figcaption>{e(label)} · original concept reference</figcaption></figure>'

    out = ['''<header class="section-head"><span class="kicker">Agents · next visual refinement · 18 October</span>
    <h2>Make the cast readable at a glance.</h2>
    <p>The close-ups work. In crowded room shots, supervisors disappear among the workers. The next pass changes three things: background contrast, body colour and relative size.</p></header>''', render_readability(),
    '''<div class="section-divider"></div><h3>Current models &amp; motion players</h3>
    <p>Inspect the existing assets, approved motions and fitted equipment. LIMEN and STILETTO show the accepted colour treatments; CATHEXIS retains her distinct ivory treatment.</p><div class="cast-player-list">''']
    current = [
        ('Worker 01', '/stepanoskin/loopforge/play/asset-review/worker', '19 approved motions · articulated hands', 'WORKER_MOTION_REVIEW.md'),
        ('LIMEN', '/stepanoskin/loopforge/play/agent-test/limen', '17 new source motions · cyan emitter · approved assembly', 'LIMEN_MESHY_REVIEW.md'),
        ('STILETTO', '/stepanoskin/loopforge/play/asset-review/stiletto', 'Twin blades or welders · red visor · motion bank', 'STILETTO_MOTION_REVIEW.md'),
        ('CATHEXIS', '/stepanoskin/loopforge/play/asset-review/cathexis', '4 approved motions · full or split Grace', 'CATHEXIS_MOTION_REVIEW.md'),
    ]
    for name, route, description, record in current:
        out.append(f'<div class="cast-player"><a href="{route}"><strong>{name} →</strong><span>{description}</span></a><a class="cast-record-link" href="/loopforge-design/production/{record}">Review record ↗</a></div>')
    out.append('''</div><p><a href="/stepanoskin/loopforge/design#model-briefs">Model briefs · reference art, Meshy prompts &amp; download kits →</a></p>
    <div class="callout"><span class="kicker">Character dramaturgy · opening cast proposal</span>
    <h3>Ten workers. One authority. Different choices.</h3>
    <p>Recognizable people emerge through appearance, movement, speech, <strong>actions and reactions</strong>. The new proposal gives ten workers distinct motives, silhouettes and relationships, then puts them under LIMEN’s pressure at Security.</p>
    <p>Review the cast and script before concept art and Meshy production. Visual approval comes before the systems that let these people act on their beliefs.</p>
    <p><a href="/loopforge-design/narrative.html">Character dramaturgy →</a> · <a href="/loopforge-design/narrative-reference.html">Back to the Dawn · illustrated case study →</a></p>
    <p><a href="/loopforge-design/narrative-cast.html">Meet the ten workers →</a> · <a href="/loopforge-design/narrative-episode.html">Read the opening episode →</a></p></div>
    <details><summary>Scene acting &amp; engine integration</summary>
    <p><strong>The first morning count.</strong> Ten timid workers enter the Lobby. LIMEN explains his rules, misreads a worker’s eager compliance and makes an example of him with the cyan blade. Twenty-one fixed lines, eight LIMEN motions, a fall and an injured return make the cost of order visible. <a href="/loopforge-design/production/DAY_ONE_ARRIVAL.md">Read the intro script and acting plan ↗</a></p>
    <p>Day one: both supervisors propose LIMEN at Security and STILETTO at Conveyor. LIMEN’s checks hold up workers; STILETTO approaches their shared doorway to demand them. Their conflict should read through posture, tools, queues and reactions. Speech adds motives.</p>
    <p>STILETTO’s source Idle reads as alert; source Alert reads as idle. Argument with blades reads as a threat, Reprimand as an attack. The player labels follow these accepted meanings. Paired targets, contact timing and worker reactions still need authoring.</p>
    <p>The same body, motions and equipment serve close-ups and the factory. The engine owns intentions, reservations and outcomes; animation shows them. Main play still uses placeholder bodies; the four scene rehearsals use the new cast. The opening now blends named performance cues. Complete shifts and machine contacts remain integration work.</p>
    <p><a href="/stepanoskin/loopforge/play/scene-studies">Play the scene rehearsals →</a> · <a href="/loopforge-design/FIRST_FIVE_DAYS_SHOW_PROPOSAL.md">First five days ↗</a> · <a href="/loopforge-design/production/SCENE_REHEARSALS.md">Action &amp; speech architecture ↗</a></p>
    </details>
    <details><summary>Performance &amp; acceptance checks</summary>
    <p>Review body and equipment, acting and contact, then CCTV readability and performance. Close-up approval does not certify crowds or interactions. Keep silhouettes, useful contrast and core emission when optional shadows and bloom are off.</p>
    <p>Compare graphics settings on the same scene, then run the longer acceptance test. Lower-detail model tiers and a whole-factory console view remain future work. A completed timing run is not a visual pass.</p>
    <p><a href="/stepanoskin/loopforge/play/performance-lab">Graphics comparison lab →</a> · <a href="/stepanoskin/loopforge/play/performance-test">Ten-minute acceptance test →</a></p>
    <p><a href="/loopforge-design/production/CHARACTER_REVIEW_STRUCTURE.md">Six review checks ↗</a> · <a href="/loopforge-design/production/GRAPHICS_AND_PERFORMANCE.md">Graphics architecture &amp; evidence ↗</a></p>
    </details>
    <details><summary>Original character &amp; room references</summary>
    <p>These establish the existing identities. They are not revised sheets for the new palette proposal.</p><div class="agent-gallery">''')
    for pack, key, label in [
        ('loopforge-supervisors', 'thrum-conveyor', 'Worker reference · worn industrial bodies'),
        ('loopforge', 'limen', 'LIMEN · heavy armour and one cyan blade'),
        ('loopforge-console', 'stiletto-portrait', 'STILETTO · black chrome and twin tool arms'),
        ('loopforge', 'cathexis', 'CATHEXIS · porcelain, dress and crown'),
        ('loopforge', 'witch', 'RIVET WITCH · future cast'),
        ('loopforge', 'thrum', 'THRUM · future cast'),
        ('loopforge-supervisors', 'limen-security', 'Security · clerks, desks and queues'),
        ('loopforge-supervisors', 'stiletto-conveyor-success-2', 'Conveyor · staffed work cells'),
        ('loopforge-focused', 'lobby-room', 'Lobby · paperwork and worker claims'),
    ]:
        out.append(pic(pack, key, label))
    out.append('''</div><p>Proposed occupied interiors: Security 18 × 16 m, Lobby 22 × 16 m, preserving the continuous building and service connections. This room rebuild is separate from the palette comparison.</p>
    <p><a href="/loopforge-design/production/ROOM_ASSET_BRIEFS.md">Room assets &amp; Meshy briefs ↗</a> · <a href="/loopforge-design/AGENT_CHARACTER_AND_ANIMATION_DIRECTION.md">Character &amp; action direction ↗</a></p></details>
    <details><summary>Earlier engineering prototype · historical reference</summary>
    <p>The 12 October fixture uses rejected placeholder robots to exercise reservations, prop ownership and replay. Use the current players above for character review.</p><p><a href="/loopforge-design/production/AGENT_PRODUCTION_TEST.md">Engineering record ↗</a> · <a href="/stepanoskin/loopforge/play/agent-test">Legacy fixture ↗</a></p></details>''')
    return ''.join(out)
