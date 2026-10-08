"""Four implemented producer skins, with source-art comparison and honest validation status."""
import html
import json


def render_producer_console(root, manifest_path, runtime_manifest_path):
    e = html.escape
    data = json.loads((root / 'producer-studies.json').read_text())
    manifest = json.loads(manifest_path.read_text())
    runtime = json.loads(runtime_manifest_path.read_text())
    cards, payload = [], []
    for index, study in enumerate(data['studies'], 1):
        asset = manifest['assets'][study['id']]
        variants = asset['variants']
        large = variants[-1]
        portrait = runtime['assets'][study['id'] + '-mobile']
        portrait_thumb, portrait_large = portrait['variants'][0], portrait['variants'][-1]
        wide_id, portrait_id = study['id'] + '-wide', study['id'] + '-portrait'
        title = f'{index:02} / {study["name"]}'
        sources = ', '.join(f'{v["src"]} {v["width"]}w' for v in variants)
        payload.extend([
            {**study, 'id': wide_id, 'title': title + ' · Wide concept', 'src': large['src'],
             'width': large['width'], 'height': large['height']},
            {**study, 'id': portrait_id, 'title': title + ' · Portrait runtime plate',
             'src': portrait_large['src'], 'width': portrait_large['width'], 'height': portrait_large['height'],
             'alt': study['portraitAlt'],
             'watch': 'Implemented portrait plate; visual QA is underway. Empty glass and label surfaces receive original room feeds, live facts and native controls in play. ' + study['mobile']},
        ])
        cards.append(f'''<article class="style-card producer-card">
          <a class="style-image" href="{large['src']}" data-producer-study="{wide_id}" aria-label="Enlarge {e(study['name'])} wide concept">
            <img src="{variants[0]['src']}" srcset="{sources}" sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1200px) calc((100vw - 310px) / 2), 490px" width="{large['width']}" height="{large['height']}" loading="lazy" decoding="async" alt="{e(study['alt'])}">
            <span>Wide concept · inspect ↗</span></a>
          <div class="style-copy"><span class="kicker">{e(study['by'])} · {e(study['medium'])}</span><h3>{e(title)}</h3>
          <p class="producer-layout">{e(study['layout'])}</p><p>{e(study['summary'])}</p>
          <p><strong>What works.</strong> {e(study['strength'])}</p>
          <div class="producer-portrait-review"><a class="producer-portrait-image" href="{portrait_large['src']}" data-producer-study="{portrait_id}" aria-label="Enlarge {e(study['name'])} portrait runtime plate"><img src="{portrait_thumb['src']}" width="{portrait_thumb['width']}" height="{portrait_thumb['height']}" loading="lazy" decoding="async" alt="{e(study['portraitAlt'])}"><span>Portrait plate ↗</span></a><div><h4>Portrait runtime art</h4><p>Authored 2×3 glass and control bay. Live rooms, facts and controls are added in play. Implemented; visual QA underway.</p><button type="button" data-producer-pair="{study['id']}">Compare wide + portrait</button></div></div>
          <p><a href="/stepanoskin/loopforge/play?console={study['id']}" target="_blank" rel="noopener">Play {e(study['name'])} ↗</a></p>
          <details><summary>Runtime treatment and checks underway</summary><p>{e(study['watch'])}</p><h4>Phone composition</h4><p>{e(study['mobile'])}</p><h4>Registered hardware and overlays</h4><p>{e(study['layers'])}</p></details></div></article>''')
    options = ''.join(f'<option value="{s["id"]}">{e(s["title"])}</option>' for s in payload)
    controls = ''.join(f'<label>{label}<select id="producer-{side}" aria-label="{label}">{options}</select></label>' for side, label in [('left', 'Left image'), ('right', 'Right image')])
    beats = ''.join(f'<li><span class="phase-number">{i:02}</span><h4>{e(beat["title"])}</h4><p>{e(beat["text"])}</p><p class="producer-signal">{e(beat["signal"])}</p></li>' for i, beat in enumerate(data['beats'], 1))
    return f'''<header class="section-head"><span class="kicker">Producer console / four implemented skins</span><h2>Four machines. One first shift.</h2><p>{e(data['intro'])}</p></header>
      <div class="producer-review-bar"><span class="status">{e(data['status'])}</span><button type="button" id="open-producer-comparison">Compare console art</button></div>
      <div class="style-gallery producer-gallery">{''.join(cards)}</div>
      <div class="callout"><strong>Four runtime skins; verification underway.</strong> Play links open the integrated consoles. Wide images are source concepts; portrait images are implemented clean runtime plates. Neither is a runtime screenshot: original Loopforge room feeds, live facts and semantic controls are added in play. Only these four skins are selectable; the old six remain historical studies and internal focused-screen materials. Hardware motion uses registered fragments cropped via CSS from each clean plate, not separately generated transparent handsets.</div>
      <h3>Same opening. Different physical expression.</h3>
      <p>Start → producer console → Answer leadership → cinematic call → Acknowledge quota → console → Choose adviser. Early close cannot bypass acknowledgement. Settings, skin changes and menu/resume preserve acknowledgement and unconfirmed choices. Adviser appointment remains the first strategic choice.</p>
      <ol class="producer-beats">{beats}</ol>
      <div class="two-col producer-principles"><div><h3>One believable console</h3><p>Shared glass and one chassis replace six repeated housings. Foundry, Broadcast and porcelain Obedience use six-pane profiles; Dispatch office uses one primary camera plus five channels. Receiver, internal selector and production control have distinct jobs. Four off screens reveal only reflected glass and handwritten names.</p><p>The native beacon uses local glare around its registered source. Amber asks for attention; green confirms output; red marks accidents; cyan supplies sparse idle motion. Most time remains dark. Source alignment and cast-shadow quality are part of the current calibration.</p></div><div><h3>Adaptive layout, authored portrait art</h3><p>Wide view keeps the full console and six cameras. Tall portrait uses native portrait artwork with 2×3 glass and a control bay. Small/short layouts show one camera plus six channels; compact landscape places the large camera left and controls right. Resize preserves selected camera, run and pending decision.</p><p>All four portrait plates are implemented and catalogued. Desktop/phone interaction, keyboard, motion/sound-off, state preservation and full-shift checks remain underway. Cropped hardware must move without duplicate edges. No winner selection blocks delivery; owner feedback remains decisive.</p></div></div>
      <p class="document-links"><a href="PRODUCER_CONSOLE_DIRECTION.md" download>Read the console contract</a> · <a href="PRODUCER_CONCEPT_PROMPTS.md" download>Exact source-art prompts</a> · <a href="index.html#ui-styles">Historical material studies</a> · <a href="/stepanoskin/loopforge/play?console=foundry-desk">Play Foundry desk ↗</a></p>
      <dialog id="producer-viewer" aria-labelledby="producer-viewer-title"><header><h2 id="producer-viewer-title">Producer console art</h2><button type="button" id="close-producer-viewer" autofocus>Close ×</button></header>
      <div id="producer-comparison-controls" class="producer-comparison-controls" hidden>{controls}</div>
      <div id="producer-viewer-images"></div><footer><p id="producer-viewer-note"></p><button type="button" id="producer-zoom" aria-pressed="false">View full detail</button></footer></dialog>
      <script id="producer-review-data" type="application/json">{json.dumps(payload, ensure_ascii=False).replace('</', r'<\/')}</script>'''
