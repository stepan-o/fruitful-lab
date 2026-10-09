"""Authored conveyor study; shared content for the board and reading copies."""
import html

e = html.escape

def p(text):
    return '<p>' + e(text) + '</p>'

def rows(items):
    return '<dl class="cv-facts">' + ''.join('<div><dt>' + e(k) + '</dt><dd>' + e(v) + '</dd></div>' for k, v in items) + '</dl>'

def layout_rows(layout):
    return [(label, layout[key]) for key, label in [('gain', 'What it buys'), ('cost', 'What it costs'), ('see', 'What the player sees'), ('response', 'Useful response'), ('supervisor', 'Who changes it'), ('carry', 'What carries forward')]]

def diagram(kind, prefix):
    """Original topology schematics, not game assets or measured simulation results."""
    key = prefix + '-' + kind
    def machine(x, y, label, w=112):
        return f'<g><rect class="cv-machine" x="{x}" y="{y}" width="{w}" height="52" rx="3"/><text x="{x+w/2}" y="{y+31}" text-anchor="middle">{label}</text></g>'
    def path(d, cls='cv-belt'):
        return f'<path class="{cls}" d="{d}"/>'
    def worker(x,y):
        return f'<g class="cv-worker"><circle cx="{x}" cy="{y}" r="7"/><path d="M{x-10} {y+17}v-4q10-10 20 0v4"/></g>'
    descriptions = {
      'compact': 'A straight belt links intake, assembly and outtake. A worker route crosses the belt between assembly and outtake. The crossing is the exposed area.',
      'separated': 'A straight belt links the same three stations. A protected worker aisle runs below all stations, with short service approaches and no belt crossing.',
      'expanded': 'Intake splits to two parallel assembly cells and merges again before a single outtake. Work can accumulate at that merge. The lower worker aisle reaches Cell B directly; reaching Cell A crosses the lower material branch.'
    }
    out=f'<div class="cv-map-scroll" tabindex="0" role="region" aria-label="Scrollable layout schematic"><svg class="cv-map" viewBox="0 0 640 310" role="img" aria-labelledby="{key}-title {key}-desc"><title id="{key}-title">{e(kind.title())} conveyor layout</title><desc id="{key}-desc">{e(descriptions[kind])}</desc><defs><pattern id="{key}-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="#d8b77c" stroke-opacity=".08"/></pattern></defs><rect x="0" y="0" width="640" height="310" fill="#111916"/><rect x="16" y="16" width="608" height="278" fill="url(#{key}-grid)" stroke="#455044"/><text class="cv-map-label" x="34" y="44">LATTICE FORGE / FLOOR STUDY</text>'
    if kind=='expanded':
        out+=path('M34 156H186M186 156V98H238M186 156V204H238M350 98H421V156H472M350 204H421V156M584 156H608')
        out+=machine(60,130,'INTAKE')+machine(238,72,'CELL A')+machine(238,178,'CELL B')+machine(472,130,'OUTTAKE')
        out+=path('M34 272H593M117 272V194M286 272V245M369 272V137H306M534 272V194','cv-walk')
        out+='<rect class="cv-risk" x="395" y="139" width="54" height="35" rx="6"/><text class="cv-note" x="405" y="63">MERGE QUEUE</text><path class="cv-leader" d="M449 71L429 137"/>'
        out+='<rect class="cv-risk" x="357" y="190" width="25" height="28" rx="3"/><text class="cv-note" x="420" y="239">SERVICE</text><text class="cv-note" x="420" y="256">CROSSING</text><path class="cv-leader" d="M410 232L378 211"/>'
        out+=worker(112,240)+worker(295,250)+worker(368,165)+worker(535,237)
    else:
        out+=path('M34 128H608')+machine(62,102,'INTAKE')+machine(257,102,'ASSEMBLY')+machine(467,102,'OUTTAKE')
        if kind=='compact':
            out+=path('M34 242H420V73H590M117 242V175M311 242V175M529 73V90','cv-walk')
            out+='<rect class="cv-risk" x="397" y="104" width="46" height="50" rx="5"/><text class="cv-note" x="327" y="284">SHARED CROSSING</text><path class="cv-leader" d="M421 266V174"/>'
            out+=worker(116,210)+worker(310,212)+worker(420,175)
        else:
            out+=path('M34 242H594M117 242V184M311 242V184M522 242V184','cv-walk')
            out+='<path class="cv-guard" d="M45 164H594"/><text class="cv-note" x="234" y="284">PROTECTED WORKER AISLE</text>'
            out+=worker(116,209)+worker(310,209)+worker(520,209)
    out+='</svg></div><div class="cv-map-legend"><span><i class="cv-key-belt"></i>Material path</span><span><i class="cv-key-worker"></i>Worker route</span><span><i class="cv-key-risk"></i>Pressure point</span></div><p class="cv-caption">Original schematic · not to scale · compare the connections, not numerical performance. On a narrow screen, scroll the floor horizontally.</p>'
    return out

def research_html(item):
    sources = [(item['source'], item['url'])]
    if item.get('extraUrl'):
        sources.append((item['extraSource'], item['extraUrl']))
    links = ' · '.join('<a href="'+e(url, quote=True)+'" target="_blank" rel="noopener">'+e(name)+' ↗</a>' for name,url in sources)
    return p(item['lesson'])+'<p class="cv-source">'+links+'</p>'+rows([('Borrow for Loopforge',item['map']),('Boundary / counterexample',item['limit'])])

def render_conveyor(d, interactive=True):
    out='<div class="conveyor-study"><header class="section-head"><span class="kicker">Room puzzle 01 · '+e(d['date'])+'</span><h2>'+e(d['title'])+'</h2>'+p(d['summary'])+'</header><span class="status">'+e(d['status'])+'</span><div class="cv-direction">'+p(d['direction'])+'</div><div class="cv-thesis"><span class="kicker">Recommended first experiment</span>'+p(d['recommendation'])+'</div>'
    out+='<p><a class="link-button" href="/stepanoskin/loopforge/play/factory-study">Open the procedural commissioning study →</a></p>'
    if d.get('timeArt'):
        out+='<details class="cv-section"><summary>Time transitions · town-scale art direction</summary>'+p('Three-second automatic interludes. Titles are rendered by the UI; the factory itself remains procedural.')+'<div class="cv-time-art">'
        for art in d['timeArt']:
            out+='<figure><a href="'+e(art['src'],quote=True)+'" target="_blank" rel="noopener"><img loading="lazy" src="'+e(art['src'],quote=True)+'" alt="'+e(art['caption'],quote=True)+'" /></a><figcaption><strong>'+e(art['name'])+'</strong> · '+e(art['caption'])+'</figcaption></figure>'
        out+='</div></details>'
    out+='<h3>Where the fun comes from</h3><div class="cv-fun">'+''.join('<article><h4>'+e(k)+'</h4>'+p(v)+'</article>' for k,v in d['fun'])+'</div>'
    out+='<h3>Two flows share one floor</h3><ol class="cv-chain">'+''.join('<li><strong>'+e(k)+'</strong>'+p(v)+'</li>' for k,v in d['chain'])+'</ol>'
    out+='<section class="cv-layouts"><span class="kicker">Compare three possible arrangements</span><h3>There is no best floor in isolation.</h3>'+p('These authored examples expose different constraints. Selecting one changes the design explanation; it does not run a simulation or choose a production theme.')
    if interactive:
        out+='<div class="cv-choices" role="group" aria-label="Compare conveyor layouts">'+''.join('<button type="button" data-conveyor-choice="'+x['id']+'" aria-controls="conveyor-layout-'+x['id']+'" aria-pressed="'+str(i==0).lower()+'">'+e(x['name'])+'</button>' for i,x in enumerate(d['layouts']))+'</div>'
    for i,x in enumerate(d['layouts']):
        attrs=' id="conveyor-layout-'+x['id']+'" data-conveyor-layout="'+x['id']+'"'+(' hidden' if i and interactive else '')
        out+='<article'+attrs+'><h4>'+e(x['tag'])+'</h4>'+diagram(x['id'],'cv-board' if interactive else 'cv-record')+rows(layout_rows(x))+'</article>'
    if interactive:
        out+='<p class="sr-only" aria-live="polite" data-conveyor-announcement></p>'
    out+='</section><h3>The proposal, in detail</h3>'
    for i,s in enumerate(d['sections'],1):
        body=p(s['intro'])+rows(s['rows'])
        if interactive:
            out+='<details class="cv-section"'+(' open' if i==1 else '')+'><summary><span>'+str(i).zfill(2)+'</span>'+e(s['title'])+'</summary>'+body+'</details>'
        else:
            out+='<section class="cv-section"><h3>'+e(s['title'])+'</h3>'+body+'</section>'
    out+='<h3>What the reference games teach us</h3>'+p(d['researchBoundary'])
    for r in d['research']:
        out+=('<details class="cv-section"><summary>'+e(r['game'])+'</summary>'+research_html(r)+'</details>') if interactive else '<section><h4>'+e(r['game'])+'</h4>'+research_html(r)+'</section>'
    out+='<p><a href="/loopforge-design/CONVEYOR_MINIGAME_PROPOSAL.md">Download the complete proposal ↗</a></p></div>'
    return out

def conveyor_markdown(d):
    out=['# Conveyor mini-game proposal',d['date'],'*Generated from game-design/conveyor-proposal.json.*',d['status'],'## '+d['title'],d['summary'],d['direction'],'**Recommendation.** '+d['recommendation'],'## Where the fun comes from']
    def add(items):
        out.extend('**'+k+'.** '+v for k,v in items)
    add(d['fun']);out.append('## Two flows share one floor');add(d['chain'])
    out.append('## Three possible layouts')
    for layout in d['layouts']:
        out.extend(['### '+layout['name'],layout['tag']]);add(layout_rows(layout))
    for s in d['sections']:
        out.extend(['## '+s['title'],s['intro']]);add(s['rows'])
    out.extend(['## Reference study',d['researchBoundary']])
    for r in d['research']:
        out.extend(['### '+r['game'],r['lesson'],'['+r['source']+']('+r['url']+')'])
        if r.get('extraUrl'):out.append('['+r['extraSource']+']('+r['extraUrl']+')')
        add([('Borrow for Loopforge',r['map']),('Boundary / counterexample',r['limit'])])
    return '\n\n'.join(out)+'\n'
