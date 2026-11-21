"""Publish the standalone review and its small design-board entry."""
import json
from html import escape
from pathlib import Path
import sys

HERE = Path(__file__).resolve().parent
OUT = HERE.parents[3] / 'apps/lab/public/loopforge-design'
PANEL = 'Forge UI study'
STATES = [
    ('wide','Wide view','Intake and Forge both have a waiting load. On the wide camera, find max and LIMEN before selecting Forge. On phone the larger station keys beneath the overview perform the same selection.'),
    ('wait','First still','Keep the same camera for all three stills. Max looks across the room. His foot is clear of the treadle and there is space between the die and carrier C2. The previous Belt call is still on screen in its reading window.'),
    ('call','Second still','The producer has pressed Clear. LIMEN says “Forge, all clear. max.” The treadle and die remain raised. Intake still holds C3, but LIMEN can serve only one call at a time.'),
    ('stroke','Third still','Max has received the call, turned to the die and planted his foot. The die travels to C2. LIMEN’s plate still carries the same line through its reading window. The rack count increases later.'),
]
sys.path.insert(0, str(HERE.parent))
from forge_study_entry import FORGE_PANEL

def publish_review():
    figs = []
    for i,(state,title,note) in enumerate(STATES):
        imgs = []
        for dev,w,h in [('desktop',1120,640),('phone',390,620)]:
            imgs.append(f'<a class="plate {dev}" href="{dev}-{state}.webp" aria-label="Open {dev} {title.lower()} at native size"><img alt="{escape(note,quote=True)}" width="{w}" height="{h}" src="{dev}-{state}.webp" decoding="async" loading="{"eager" if i==0 else "lazy"}"></a>')
        figs.append(f'<figure class="frame" id="frame-{state}">{"".join(imgs)}<figcaption><strong>{title}.</strong> {note}</figcaption></figure>')
    nav = ''.join(f'<button type="button" data-frame="{i}" aria-pressed="{str(i==0).lower()}">{title}</button>' for i,(_,title,_) in enumerate(STATES))
    pairs = []
    measured = json.loads((OUT/'forge-study/hosted.json').read_text())
    canvas_sizes = [(dev, round(measured[dev][0]['bounds']['width']), round(measured[dev][0]['bounds']['height'])) for dev in ('desktop', 'phone')]
    for state,_,_ in STATES[1:]:
        pair = ''.join(f'<figure><a href="audit-{dev}-{state}.webp"><img src="audit-{dev}-{state}.webp" alt="Production room renderer, {dev} camera, {state}" width="{w}" height="{h}" loading="lazy"></a><figcaption>{dev.title()} · {w} × {h} room canvas</figcaption></figure>' for dev,w,h in canvas_sizes)
        pairs.append(f'<details class="baseline"><summary>{dict(wait="Waiting at Forge",call="While LIMEN calls",stroke="When the press moves")[state]}</summary><div class="pair">{pair}</div></details>')
    hosted = []
    for state, title in [('wait','Before Clear'),('sent','As the command is sent'),('after','After max receives the call')]:
        views = []
        for dev,w,h in [('desktop',1280,820),('phone',390,844)]:
            markers = [(65,46),(45,29),(84,93)] if dev=='desktop' else [(53,48),(7,37),(76,96)]
            badges = ''.join(f'<span class="marker" style="left:{x}%;top:{y}%" aria-hidden="true">{i}</span>' for i,(x,y) in enumerate(markers,1))
            views.append(f'<figure><a class="marked" href="hosted-{dev}-{state}.webp"><img src="hosted-{dev}-{state}.webp" loading="lazy" width="{w}" height="{h}" alt="{title}, hosted {dev} player. Mark 1 is at max, mark 2 is by the voice, mark 3 is at the station control.">{badges}</a><figcaption>{dev.title()} · {w} × {h}</figcaption></figure>')
        hosted.append(f'<details class="baseline" {"open" if state=="sent" else ""}><summary>{title}</summary><div class="pair">{"".join(views)}</div></details>')
    html = (HERE/'review.html').read_text().replace('<!--FRAMES-->',''.join(figs)).replace('<!--FRAME-NAV-->',nav).replace('<!--AUDIT-PAIRS-->',''.join(pairs)).replace('<!--HOSTED-PAIRS-->',''.join(hosted))
    target=OUT/'forge-study'
    (target/'index.html').write_text(html)
    for name in ('study.css','study.js'):
        (target/name).write_bytes((HERE/name).read_bytes())

def update_existing_board():
    target=OUT/'index.html'
    board=target.read_text()
    if 'id="forge-study"' in board:
        return
    nav='<button data-panel="supervisor-rooms"'
    section='<section class="panel" id="supervisor-rooms"'
    assert board.count(nav)==board.count(section)==1
    board=board.replace(nav,f'<button data-panel="forge-study" aria-current="false">{PANEL}</button>'+nav)
    board=board.replace(section,f'<section class="panel" id="forge-study" aria-label="{PANEL}" hidden>{FORGE_PANEL}</section>'+section)
    target.write_text(board)

if __name__=='__main__':
    publish_review()
    update_existing_board()
