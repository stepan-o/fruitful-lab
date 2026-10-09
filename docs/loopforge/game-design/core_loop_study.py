"""Editorial loop research; one source for the board and complete records."""
import html
e=html.escape
def p(t): return '<p>'+e(t)+'</p>'
def fields(rows): return '<dl>'+''.join('<div class="definition"><dt>'+e(k)+'</dt><dd>'+e(v)+'</dd></div>' for k,v in rows)+'</dl>'
def links(rows): return '<p class="study-sources">'+' · '.join('<a href="'+e(u,quote=True)+'" target="_blank" rel="noopener">'+e(k)+' ↗</a>' for k,u in rows)+'</p>'
def detail(t,b): return '<details><summary>'+e(t)+'</summary>'+b+'</details>'
def cycle(items): return '<ol class="study-cycle">'+''.join('<li>'+e(t)+'</li>' for t in items)+'</ol>'
def arc_rows(a): return [('Player agency',a['agency']),('Direct status',a['direct']),('Indirect evidence',a['indirect']),('Still hidden',a['hidden']),('Reason for the next choice',a['return'])]
def family_rows(f): return [('Notable examples',f['examples']),('Counterexample / limit',f['counter']),('Room for expression',f['expression']),('Loopforge inference',f['loopforge'])]
def figure(f,m,interactive,full_width=False):
    vs=m['variants'];v=vs[0];large=vs[-1]
    prefix='data-study-' if interactive else ''
    sizes='(max-width: 800px) calc(100vw - 70px), (max-width: 1100px) calc(100vw - 340px), 720px' if full_width else '(max-width: 600px) calc(100vw - 70px), (max-width: 800px) calc(50vw - 45px), 460px'
    img='<img '+prefix+'src="'+v['src']+'" '+prefix+'srcset="'+', '.join(x['src']+' '+str(x['width'])+'w' for x in vs[:2])+'" sizes="'+sizes+'" width="'+str(v['width'])+'" height="'+str(v['height'])+'" alt="'+e(f['alt'],quote=True)+'" loading="lazy" decoding="async">'
    if interactive:
        imglink='<button class="study-inspect" data-study-inspect data-large="'+large['src']+'" aria-label="Inspect '+e(f['alt'],quote=True)+'">'+img+'<span>Inspect screenshot ↗</span></button>'
    else: imglink='<a class="study-inspect" href="'+large['src']+'" target="_blank" rel="noopener">'+img+'<span>Inspect screenshot ↗</span></a>'
    return '<figure class="study-figure">'+imglink+'<figcaption>'+p(f['caption'])+'<small>'+e(m['game']+' · '+m['credit'])+'</small>'+links([('Official source',m['sourcePage'])])+'</figcaption></figure>'

def render_core_loop_study(d,media,interactive=True):
    out='<div class="loop-study"><header class="section-head"><span class="kicker">Core loop study · decisions, returns and expression</span><h2>'+e(d['thesis'])+'</h2>'+p(d['intro'])+'</header>'
    out+='<div class="study-thesis"><b>Loopforge’s proposed centre</b>'+p('Make the machine work. Choose how to lead. Inherit the response.')+cycle(['Read the facts','Back an adviser','Commit and operate','Allocate output','Meet the consequences'])+'</div>'
    out+=detail('What we mean by a loop',p(d['status'])+fields(d['definitions'])+''.join('<h4>'+e(s['title'])+'</h4>'+p(s['text'])+links([('Primary reference',s['url'])]) for s in d['methods']))
    out+='<h3>Nine useful patterns</h3>'+p('Select a pattern for examples, a counterexample and its relevance to Loopforge. These overlap; the counterexamples challenge a rule, not the quality of a game.')+'<div class="study-families">'
    for i,f in enumerate(d['families'],1):
        out+='<details class="study-family"><summary><span class="kicker">'+str(i).zfill(2)+'</span><strong>'+e(f['name'])+'</strong><span class="study-desire">'+e(f['desire'])+'</span></summary>'+cycle(f['cycle'])+fields(family_rows(f))+links(f['sources'])+'</details>'
    out+='</div><div class="section-divider"></div><h3>Three visual lessons</h3>'+p('Five authentic gameplay stills. Look at what each interface foregrounds, what stays visible, and how a decision returns as feedback. These are structural comparisons, not a prescription to copy their art style.')
    for i,v in enumerate(d['visuals'],1):
        out+='<section class="study-case"><span class="kicker">Visual study '+str(i).zfill(2)+' · '+e(v['subtitle'])+'</span><h4>'+e(v['title'])+'</h4><div class="study-images'+(' study-single' if len(v['figures'])==1 else '')+'">'+''.join(figure(f,media['figures'][f['id']],interactive,len(v['figures'])==1) for f in v['figures'])+'</div><div class="study-lesson">'+p(v['lesson'])+'</div></section>'
    out+=detail('What does not fit neatly into a type',fields(d['boundaries']))
    out+='<div class="section-divider"></div><h3>Conclusions for Loopforge</h3>'+fields(d['conclusions'])
    em=d['emergence'];out+='<section class="study-emergence"><span class="kicker">Agency → evidence → another choice</span><h3>'+e(em['title'])+'</h3>'+p(em['intro'])+cycle(em['chain'])+fields(em['signals'])
    out+='<h4>A status-token contract for every arc</h4>'+p('These are design obligations, not claims about the current one-day prototype. Tokens reveal observable state and give access to action; they do not expose private engine variables.')
    for a in em['arcs']:
        tokens='<div class="study-tokens" aria-label="Illustrative status tokens">'+''.join('<div><small>'+e(who)+'</small><b>'+e(state)+'</b><span>'+e(basis)+'</span></div>' for who,state,basis in a['tokenExamples'])+'</div>'
        out+=detail(a['stage'],p('Illustrative token vocabulary; authored examples, not live state or a compulsory event sequence.')+tokens+fields(arc_rows(a)))
    out+=detail('UI and engine contract',fields(em['contract']))+'</section>'
    out+=detail('What must pass in playtesting',fields(d['gates']))
    rights=p(d['rights'])+p(d['rightsNote'])+links([('U.S. Copyright Office · case-by-case fair-use guidance','https://www.copyright.gov/fair-use/'),('Figure provenance and publication basis','/loopforge-design/references/core-loop-media.v1.json')])
    for key,m in media['figures'].items():rights+='<h4>'+e(key)+'</h4>'+p(m['credit']+' '+m['publicationBasis']+' '+m['versionNote'])+links([('Source page',m['sourcePage']),('Publication basis',m['basisUrl'])])
    out+=detail('Image credits and reuse boundaries',rights)+links([('Download the complete study','/loopforge-design/CORE_LOOP_STUDY.md')])+'</div>'
    return out

def core_loop_markdown(d,media):
    out=['# '+d['title'],d['date'],'*Generated from game-design/core-loop-study.json and core-loop-media.v1.json.*','## '+d['thesis'],d['intro'],d['status']]
    def rows(items):out.extend('**'+k+'.** '+v for k,v in items)
    def sources(items):out.append(' · '.join('['+k+']('+u+')' for k,u in items))
    out.append('## What we mean by a loop');rows(d['definitions'])
    for m in d['methods']:out.extend(['### '+m['title'],m['text']]);sources([('Primary reference',m['url'])])
    out.append('## Nine useful patterns')
    for f in d['families']:
        out.extend(['### '+f['name'],'*'+f['desire']+'*',' → '.join(f['cycle'])]);rows(family_rows(f));sources(f['sources'])
    out.append('## Three visual lessons')
    for v in d['visuals']:
        out.extend(['### '+v['title'],v['subtitle']])
        for f in v['figures']:
            m=media['figures'][f['id']];out.extend(['!['+f['alt']+']('+m['variants'][1]['src']+')',f['caption'],m['game']+' · '+m['credit']]);sources([('Official source',m['sourcePage'])])
        out.append(v['lesson'])
    out.append('## Boundaries of the taxonomy');rows(d['boundaries'])
    out.append('## Conclusions for Loopforge');rows(d['conclusions'])
    em=d['emergence'];out.extend(['## '+em['title'],em['intro'],' → '.join(em['chain'])]);rows(em['signals'])
    out.append('### A status-token contract for every arc')
    for a in em['arcs']:
        out.append('#### '+a['stage']);rows(arc_rows(a));out.append('Illustrative token vocabulary (not live state):');out.extend('- '+who+' · '+state+' · '+basis for who,state,basis in a['tokenExamples'])
    out.append('### UI and engine contract');rows(em['contract'])
    out.append('## What must pass in playtesting');rows(d['gates'])
    out.extend(['## Image credits and reuse boundaries',d['rights'],d['rightsNote']]);sources([('U.S. Copyright Office · case-by-case guidance','https://www.copyright.gov/fair-use/'),('Figure manifest','/loopforge-design/references/core-loop-media.v1.json')])
    for key,m in media['figures'].items():
        out.extend(['### '+key,m['credit'],m['publicationBasis'],m['versionNote']]);sources([('Source page',m['sourcePage']),('Publication basis',m['basisUrl'])])
    return '\n\n'.join(out)+'\n'
