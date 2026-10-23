"""Illustrated cast reader, sourced from the canonical portraits and art manifest."""
import html,json,re
E=html.escape
STYLE="""
.cast-page header,.cast-page main,.cast-page footer{max-width:1440px}.cast-page main{display:block}.cast-page article{max-width:none}.cast-page h1{margin-bottom:24px}.cast-hero{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.cast-hero figure{margin:0}.cast-hero figcaption b{display:block;color:var(--ink);font-size:18px;font-weight:500}.cast-intro{max-width:74ch;margin:36px 0}.cast-index{position:sticky;top:0;z-index:2;background:var(--bg);border-block:1px solid var(--line);padding:10px 0;display:flex;flex-wrap:wrap;gap:4px}.cast-index a{padding:10px 13px;text-decoration:none;min-height:44px}.cast-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:32px}.cast-card{scroll-margin-top:100px;padding:0 0 24px;border-bottom:1px solid var(--line)}.cast-card figure{margin:0 0 20px;background:#171b1c}.cast-card figure img{height:350px;object-fit:contain;border:0}.cast-card h2{border:0;padding:0;margin:0 0 12px;font-size:30px}.cast-card p{max-width:62ch}.cast-card details{font-size:13px;color:var(--muted)}.cast-card summary{min-height:44px;padding:10px 0;margin:0}.cast-card .cast-links{display:flex;flex-wrap:wrap;gap:18px}.cast-card .cast-links a{padding:8px 0;display:inline-block;min-height:44px}.cast-featured{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:40px;margin:40px 0}.cast-featured figure img{height:460px}.cast-featured .portrait-copy{align-self:center}.cast-notes{max-width:76ch;margin-top:48px}.cast-card.supervisor figure img{height:auto;aspect-ratio:16/9}.cast-section-title{margin:48px 0 28px}.cast-meta{font-size:13px;color:var(--muted)}
@media(max-width:700px){.cast-hero,.cast-grid,.cast-featured{grid-template-columns:1fr}.cast-hero{gap:24px}.cast-page header,.cast-page main,.cast-page footer{padding:20px}.cast-featured{gap:16px}.cast-featured figure img{height:350px}.cast-card figure img{height:340px}.cast-index{position:static}.cast-card{scroll-margin-top:24px}.cast-card p{font-size:17px}.cast-page h1{margin-bottom:20px}}
@media print{.cast-index{display:none}.cast-card{break-inside:avoid}.cast-hero,.cast-grid{grid-template-columns:repeat(2,1fr)}}
"""

def picture(ref,alt,sizes,lazy=True):
    variants=ref['variants'][:2] if ref['id'].startswith('ensemble') else ref['variants']
    default=variants[0];srcset=', '.join(f'{v["src"]} {v["width"]}w' for v in variants)
    return f'<a href="{E(ref["input"]["src"])}" target="_blank" rel="noopener" aria-label="Open {E(alt)} at full size"><img src="{default["src"]}" srcset="{srcset}" sizes="{sizes}" width="{default["width"]}" height="{default["height"]}" alt="{E(alt)}" decoding="async" '+('loading="lazy"' if lazy else 'fetchpriority="high"')+'></a>'

def render_cast(docs, inline):
    data=json.loads((docs/'game-design/cast-art.json').read_text())
    source=(docs/'OPENING_CAST.md').read_text()
    sections={}
    for match in re.finditer(r'^## ([^\n]+)\n\n(.+?)(?=^## |\Z)',source,re.M|re.S):sections[match[1]]=match[2].strip()
    hero='<div class="cast-hero" aria-label="Approved ensemble illustrations">'
    for i,ref in enumerate(data['ensembles']):
        hero+='<figure>'+picture(ref,ref['name'],'(max-width:700px) calc(100vw - 40px), (max-width:1440px) calc((100vw - 84px) / 2), 678px',i!=0)+f'<figcaption><b>{E(ref["name"])}</b>{E(ref["description"])}</figcaption></figure>'
    hero+='</div><div class="cast-intro"><p>Ten workers arrive for the same shift. bob is the person we follow; the others have their own company to seek, work to enjoy and reasons to dislike being kept at the door. The supervisors are harder to avoid.</p><p class="cast-meta">All ten worker concepts and both ensemble illustrations are approved. bob’s paragraph is unchanged. The other prose portraits are revised drafts.</p></div>'
    hero+='<nav class="cast-index" aria-label="Cast members">'+''.join(f'<a href="#{x["id"]}">{E(x["name"])}</a>' for x in data['portraits'])+'</nav>'
    def card(ref,featured=False):
        name=ref['name'];ident=ref['id'];sup=name.isupper()
        figure='<figure>'+picture(ref,name+' · approved reference','(max-width:700px) calc(100vw - 40px), 540px')+'</figure>'
        para=''.join('<p>'+inline(x)+'</p>' for x in sections[name].split('\n\n'))
        viewer=f'<a href="/stepanoskin/loopforge/play/{"agent-test/limen" if ident=="limen" else "asset-review/"+ident}">Animation viewer →</a>' if sup else ''
        detail=f'<details><summary>Visual direction &amp; rebuild brief</summary><p>{E(ref["identity"])}</p><div class="cast-links"><a href="/stepanoskin/loopforge/design?model={ident}#model-briefs">Model &amp; animation brief →</a>{viewer}<a href="{E(ref["input"]["src"])}" download>Download reference</a></div></details>'
        return f'<section id="{ident}" class="cast-card'+(' cast-featured' if featured else '')+(' supervisor' if sup else '')+'">'+figure+f'<div class="portrait-copy"><h2>{E(name)}</h2>'+para+detail+'</div></section>'
    hero+=card(data['portraits'][0],True)+'<div class="cast-grid">'+''.join(card(x) for x in data['portraits'][1:10])+'</div><h2 class="cast-section-title">The supervisors</h2><div class="cast-grid">'+''.join(card(x) for x in data['portraits'][10:])+'</div>'
    hero+='<div class="cast-notes">'
    for label in ['When they meet','From the portrait to the performance']:
        hero+='<h2>'+E(label)+'</h2>'+''.join('<p>'+inline(x)+'</p>' for x in sections[label].split('\n\n'))
    return hero+'</div>'
