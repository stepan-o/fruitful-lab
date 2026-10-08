"""Author review with links to each implemented runtime preset."""
import html
import json

def render_style_review(root, manifest_path):
    e = html.escape
    data = json.loads((root/'ui-styles.json').read_text())
    manifest = json.loads(manifest_path.read_text())
    cards, payload = [], []
    for i, item in enumerate(data['styles'], 1):
        variants = manifest['assets'][item['id']]['variants']
        large = variants[-1]
        title = f'{i:02} / {item["name"]}'
        sources = ', '.join(f'{v["src"]} {v["width"]}w' for v in variants)
        payload.append({**item, 'title': title, 'src': large['src'], 'srcset': sources})
        cards.append(f'''<article class="style-card" id="study-{item['id']}">
          <a class="style-image" href="{large['src']}" data-study="{item['id']}" aria-label="Enlarge {e(item['name'])} style sheet">
            <img src="{variants[0]['src']}" srcset="{sources}" sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 1200px) calc((100vw - 310px) / 2), 490px" width="1536" height="1024" loading="lazy" decoding="async" alt="{e(item['alt'])}">
            <span>Inspect sheet ↗</span></a>
          <div class="style-copy"><span class="kicker">{e(item['inspiration'])}</span><h3>{e(title)}</h3><p>{e(item['summary'])}</p>
          <p><a href="/stepanoskin/loopforge/play?theme={item['id']}" target="_blank" rel="noopener">Try this theme in the game ↗</a></p><details><summary>Strength &amp; implementation concern</summary><p><b>Strength.</b> {e(item['strength'])}</p><p><b>Watch.</b> {e(item['watch'])}</p></details></div></article>''')
    options = ''.join(f'<option value="{x["id"]}">{e(x["title"])}</option>' for x in payload)
    controls = ''.join(f'<label>{label}<select id="style-{side}" aria-label="{label}">{options}</select></label>' for side,label in [('left','Left study'),('right','Right study')])
    body = f'''<header class="section-head"><span class="kicker">Art direction / review 01</span><h2>Which console belongs in Loopforge?</h2><p>{e(data['intro'])}</p></header>
      <div class="style-review-bar"><span class="status">{e(data['status'])}</span><button type="button" id="open-style-comparison">Compare two sheets</button></div>
      <div class="style-gallery">{''.join(cards)}</div>
      <div class="style-rules"><h3>What stays true in every direction</h3><div class="two-col">
      <div><h4>Physical, readable equipment</h4><p>All six camera positions are present. Closed rooms show only black, unpowered glass and their handwritten tape name. No room art, glowing status light or hidden-state gauge.</p><p>Supervisors keep their Loopforge identities. Their short current statements sit in attached speech bubbles. Selection, arrival and a new report can move the token; idle animation must not compete with a decision.</p></div>
      <div><h4>Clear choices, little clutter</h4><p>General help explains choices, commitments, authority and tradeoffs. Today's specifics come from the supervisor, proposal and outcome. The console carries no persistent instruction paragraph.</p><p>Choose for the complete floor and focused decision screens, not just turn one. These are material studies, not final layouts or a production sprite atlas. Fine lettering and icons will be authored separately.</p></div></div>
      <p class="style-next">All six presets are implemented. Try each in the game, or combine monitor and control families in Settings → Design workbench. The Themes & assets tab documents the contract and current coverage.</p></div>
      <dialog id="style-viewer" aria-labelledby="style-viewer-title"><header><h2 id="style-viewer-title">Style sheet</h2><button type="button" id="close-style-viewer" autofocus>Close ×</button></header>
      <div id="style-comparison-controls" class="style-comparison-controls" hidden>{controls}</div>
      <div id="style-viewer-images"></div><footer><p id="style-viewer-note"></p><button type="button" id="style-zoom" aria-pressed="false">View full detail</button></footer></dialog>
      <script id="style-review-data" type="application/json">{json.dumps(payload,ensure_ascii=False).replace('</',r'<\/')}</script>'''
    return body
