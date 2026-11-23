"""Illustrated cast reader, sourced from the canonical portraits and art manifest."""
import html,json,re
E=html.escape

def picture(ref,alt,sizes):
    variants=ref['variants'][:2] if ref['id'].startswith('ensemble') else ref['variants']
    default=variants[0];srcset=', '.join(f'{v["src"]} {v["width"]}w' for v in variants)
    return f'<a href="{E(ref["input"]["src"])}" target="_blank" rel="noopener" aria-label="Open {E(alt)} at full size"><img src="{default["src"]}" srcset="{srcset}" sizes="{sizes}" width="{default["width"]}" height="{default["height"]}" alt="{E(alt)}" decoding="async" loading="lazy"></a>'

def render_cast(docs, inline):
    data=json.loads((docs/'game-design/cast-art.json').read_text())
    source=(docs/'OPENING_CAST.md').read_text()
    sections={}
    for match in re.finditer(r'^## ([^\n]+)\n\n(.+?)(?=^## |\Z)',source,re.M|re.S):sections[match[1]]=match[2].strip()
    title=source.splitlines()[0].removeprefix('# ')
    header=f'<header class="section-head"><h2>{E(title)}</h2></header>'
    hero='<div class="cast-hero" aria-label="Approved ensemble illustrations">'
    for ref in data['ensembles']:
        hero+='<figure>'+picture(ref,ref['name'],'(max-width:700px) calc(100vw - 38px), (max-width:800px) 46vw, (max-width:1500px) 36vw, 650px')+f'<figcaption><b>{E(ref["name"])}</b>{E(ref["description"])}</figcaption></figure>'
    hero+='</div><div class="cast-intro"><p>Ten workers arrive for the same shift. bob is the person we follow; the others have their own company to seek, work to enjoy and reasons to dislike being kept at the door. The supervisors are harder to avoid.</p><p class="cast-meta">All ten worker concepts and both ensemble illustrations are approved. bob’s paragraph is unchanged. The other prose portraits are revised drafts.</p></div>'
    hero+='<nav class="cast-index" aria-label="Cast members">'+''.join(f'<a href="#cast-{x["id"]}">{E(x["name"])}</a>' for x in data['portraits'])+'</nav>'
    def card(ref,featured=False):
        name=ref['name'];ident=ref['id'];sup=name.isupper()
        figure='<figure>'+picture(ref,name+' · approved reference','(max-width:700px) calc(100vw - 40px), 540px')+'</figure>'
        para=''.join('<p>'+inline(x)+'</p>' for x in sections[name].split('\n\n'))
        viewer=f'<a href="/stepanoskin/loopforge/play/{"agent-test/limen" if ident=="limen" else "asset-review/"+ident}">Animation viewer →</a>' if sup else ''
        detail=f'<details><summary>Visual direction &amp; rebuild brief</summary><p>{E(ref["identity"])}</p><div class="cast-links"><a href="/stepanoskin/loopforge/design?model={ident}#model-briefs">Model &amp; animation brief →</a>{viewer}<a href="{E(ref["input"]["src"])}" download>Download reference</a></div></details>'
        return f'<section id="cast-{ident}" class="cast-card'+(' cast-featured' if featured else '')+(' supervisor' if sup else '')+'">'+figure+f'<div class="portrait-copy"><h3>{E(name)}</h3>'+para+detail+'</div></section>'
    hero+=card(data['portraits'][0],True)+'<div class="cast-grid">'+''.join(card(x) for x in data['portraits'][1:10])+'</div><h3 class="cast-section-title">The supervisors</h3><div class="cast-grid">'+''.join(card(x) for x in data['portraits'][10:])+'</div>'
    hero+='<div class="cast-notes">'
    for label in ['When they meet','From the portrait to the performance']:
        hero+='<h3>'+E(label)+'</h3>'+''.join('<p>'+inline(x)+'</p>' for x in sections[label].split('\n\n'))
    return (header+'<div class="cast-reader">'+hero+'</div>'
            '<p><a href="/loopforge-design/OPENING_CAST.md" download>Download the cast document</a></p></div>')
