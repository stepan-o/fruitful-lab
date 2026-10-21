"""Storyboard opening for the episode reader; prose remains in OPENING_EPISODE.md."""
import html
import json

E = html.escape
STYLE = """
.episode-page header,.episode-page main,.episode-page footer{max-width:1440px}
.episode-page main{display:block}.episode-page article{max-width:none}
.episode-storyboard{margin:0 0 32px}.episode-storyboard img{width:100%;height:auto;display:block}
.episode-tools{display:flex;flex-wrap:wrap;gap:12px;margin:16px 0}
.episode-tools a{display:inline-block;min-height:44px;padding:10px 16px;border:1px solid var(--line);text-decoration:none}
.episode-panels{border-block:1px solid var(--line);margin:24px 0 40px;padding:12px 0}
.episode-panels>summary{min-height:44px;padding:10px 0;margin:0}
.episode-panel-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}
.episode-panel-grid figure{margin:16px 0}
.episode-insert{max-width:1100px;margin:40px auto}.episode-insert figure{margin:16px 0}.episode-insert h2{margin-top:0}
.episode-script{max-width:76ch;margin:48px auto 0;scroll-margin-top:24px}
.episode-script h2{scroll-margin-top:24px}
@media(max-width:700px){.episode-page header,.episode-page main,.episode-page footer{padding:20px}.episode-panel-grid{grid-template-columns:1fr}.episode-storyboard figcaption{font-size:13px}}
"""

def image(ref, hero=False, wide=False):
    variants = ref['variants']
    default = variants[0]
    srcset = ', '.join(f'{v["src"]} {v["width"]}w' for v in variants)
    sizes = '(max-width:700px) calc(100vw - 40px), (max-width:1440px) calc(100vw - 64px), 1376px' if hero else '(max-width:700px) calc(100vw - 40px), 660px'
    if wide: sizes = '(max-width:700px) calc(100vw - 40px), (max-width:1164px) calc(100vw - 64px), 1100px'
    load = 'fetchpriority="high"' if hero else 'loading="lazy"'
    return f'<a href="{E(variants[-1]["src"])}" target="_blank" rel="noopener" aria-label="Open {E(ref["title"])} at full size"><img src="{default["src"]}" srcset="{srcset}" sizes="{sizes}" width="{default["width"]}" height="{default["height"]}" alt="{E(ref["alt"])}" decoding="async" {load}></a>'

def render_episode(docs, prose):
    data = json.loads((docs/'game-design/episode-art.json').read_text())
    overview, *panels = data['images']
    hero = '<figure class="episode-storyboard">' + image(overview, True) + '<figcaption>The first morning, in four frames. Read across, then down. ed and gus complete their checks between the strike and STILETTO’s arrival; bob is still on the floor when she passes.</figcaption></figure>'
    hero += f'<div class="episode-tools"><a href="{E(overview["variants"][-1]["src"])}" download>Download storyboard</a><a href="#episode-script">Read the scene ↓</a></div>'
    hero += '<details class="episode-panels"><summary>Inspect the four panels separately</summary><div class="episode-panel-grid">'
    for ref in panels:
        hero += '<figure>' + image(ref) + f'<figcaption><strong>{E(ref["title"])}</strong><br>{E(ref["alt"])}</figcaption></figure>'
    hero += '</div></details>'
    for ref in data.get('inserts', []):
        hero += f'<section class="episode-insert" aria-labelledby="{E(ref["id"])}"><h2 id="{E(ref["id"])}">{E(ref["title"])}</h2><figure>' + image(ref, wide=True) + f'<figcaption>{E(ref["caption"])}</figcaption></figure><div class="episode-tools"><a href="{E(ref["variants"][-1]["src"])}" download>Download this card</a><a href="narrative-card-arc.html">bob’s missing card →</a></div></section>'
    return hero + '<div id="episode-script" class="episode-script">' + prose + '</div>'
