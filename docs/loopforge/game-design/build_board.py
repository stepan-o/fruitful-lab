from core_loop_study import render_core_loop_study, core_loop_markdown
from player_desires import render_player_desires, player_desires_markdown
from producer_console import render_producer_console
from cinematic_console import render_cinematic_console
from focused_console import render_focused_console
from theme_system import render_theme_system
from pathlib import Path
import html, json, re, shutil, subprocess, hashlib
from style_review import render_style_review

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parents[2]/'apps/lab/public/loopforge-design'
OUT.mkdir(parents=True, exist_ok=True)
d = json.loads((ROOT/'design-data.json').read_text())
art = json.loads((ROOT/'art.json').read_text())
daily = d['dailyLoop']
desire_data = json.loads((ROOT/'player-desires.json').read_text())
desires = render_player_desires(desire_data)
desire_record = player_desires_markdown(desire_data)
(ROOT.parent/'PLAYER_DESIRES_AND_SCENARIOS.md').write_text(desire_record)
(OUT/'PLAYER_DESIRES_AND_SCENARIOS.md').write_text(desire_record)
loop_study_data = json.loads((ROOT/'core-loop-study.json').read_text())
loop_study_media = json.loads((ROOT/'core-loop-media.v1.json').read_text())
loop_study = render_core_loop_study(loop_study_data, loop_study_media)
loop_study_full = render_core_loop_study(loop_study_data, loop_study_media, interactive=False)
loop_study_record = core_loop_markdown(loop_study_data, loop_study_media)
(ROOT.parent/'CORE_LOOP_STUDY.md').write_text(loop_study_record)
(OUT/'CORE_LOOP_STUDY.md').write_text(loop_study_record)
e = html.escape
def p(t): return '<p>'+e(t)+'</p>'
def ul(items): return '<ul>'+''.join('<li>'+e(t)+'</li>' for t in items)+'</ul>'
def status(t):
    cls='agreed' if t.startswith('Agreed') else 'source' if t.startswith('Source') else ''
    return f'<span class="status {cls}">{e(t)}</span>'
def defs(items): return '<dl>'+''.join(f'<div class="definition"><dt>{e(k)}</dt><dd>{e(v)}</dd></div>' for k,v in items)+'</dl>'
def pic(id,alt,cls='',lazy=True):
    vs=art[id]['variants'];v=vs[-1]
    srcset=', '.join(f'{x["src"]} {x["width"]}w' for x in vs)
    return f'<img class="{cls}" src="{v["src"]}" srcset="{srcset}" sizes="(max-width:600px) calc(100vw - 38px), 480px" width="{v["width"]}" height="{v["height"]}" alt="{e(alt)}" decoding="async" '+('loading="lazy"' if lazy else 'fetchpriority="high"')+'>'
def heading(kicker,title,desc=''):
    return f'<header class="section-head"><span class="kicker">{e(kicker)}</span><h2>{e(title)}</h2>{p(desc) if desc else ""}</header>'
def table(rows):return '<table class="pairs"><tbody>'+''.join(f'<tr><th scope="row">{e(k)}</th><td>{e(v)}</td></tr>' for k,v in rows)+'</tbody></table>'
def detail(title,body):return f'<details><summary>{e(title)}</summary>{body}</details>'
def fork(f):
    return status(f['status'])+f'<h3>{e(f["title"])}</h3>'+p(f['text'])+'<div class="fork-list">'+''.join('<article class="fork-option"><h3>'+e(x['name'])+'</h3>'+defs([('Gain',x['gain']),('Lasting liability',x['cost']),('Downstream response',x['response'])])+'</article>' for x in f['paths'])+'</div>'
def person(c):return '<article><h3>'+e(c['name'])+'</h3>'+p(c['grounding'])+defs([('Role',c['role']),('Strength',c['strength']),('Failure mode',c['failure']),('Advice',c['advisor']),('Relationship',c['relationship']),('Under threat',c['underThreat'])])+'</article>'
def trajectory(r):return '<article>'+status(r['status'])+'<h3>'+e(r['name'])+'</h3>'+p(r['premise'])+'<ol class="journey">'+''.join(f'<li><h4>{e(d["stages"][i]["room"])}</h4>{p(t)}</li>' for i,t in enumerate(r['beats']))+'</ol>'+defs([('Pitfall',r['pitfall']),('Recovery',r['recovery']),('Act 2 inheritance',r['inheritance']),('Design test',r['test'])])+'</article>'
def stage(s):return '<article>'+status(s['status'])+'<h3>'+e(s['room'])+'</h3>'+('<figure>'+pic(s['art'],s['room']+' original concept art')+'<figcaption>'+e(s['caption'])+'</figcaption></figure>' if s.get('artReference') else '')+defs([('Arrival',s['arrivals']),('Visible operation',s['visible']),('Learning',s['learn']),('Decision',s['choice']),('Friction',s['friction']),('Proposed gate',s['gate']),('Hidden development',s['hidden']),('Carried forward',s['carry'])])+'</article>'

world = '<div class="world-list">'+''.join('<article><h4>'+e(x['title'])+'</h4>'+p(x['text'])+'</article>' for x in d['world'])+'</div>'
a=d['actTwo']
act2=f'<div class="next-act"><span class="kicker">Act 2 · the inherited society</span><h3>{e(a["title"])}</h3>{p(a["text"])}<div class="two-col"><div><h4>What carries forward</h4>{ul(a["inherits"])}</div><div><h4>What becomes possible</h4>{ul(a["changes"])}</div></div><div class="callout">{e(a["boundary"])}</div></div>'
arc=heading('The whole run','Build the factory. Inherit its society.','Choose how to run this factory, then inherit what that choice does to its people. Workers accumulate an inner history before Brain 2.0 makes it visible.')
early=d['earlyAct']
early_rules=detail(early['title'],table(early['rules']))
early_combinations=detail('How supervisor combinations change the next stage',table(early['combinations'])+p(early['boundary']))
arc+='<button class="link-button" data-panel="player-desires">Start with player desires and playable situations →</button>'
arc+=detail('The world behind the factory',world)
arc+=early_rules
arc+=detail('Part 01: when the third room should enter',status(daily['partOne']['status'])+p(daily['partOne']['principle'])+p(daily['partOne']['target'])+table(daily['partOne']['days'])+p(daily['partOne']['gate'])+p(daily['partOne']['week'])+table(daily['partOne']['mustDeliver'])+p(daily['partOne']['test'])+p(daily['partOne']['boundary']))
arc+='<div class="phase-strip" role="group" aria-label="Explore Act 1 stages">'+''.join(f'<button class="phase-button" data-stage="{s["id"]}" aria-pressed="{str(i==0).lower()}"><span class="phase-number">{i+1:02}</span><b>{e(s["name"])}</b><small>{e(s["arrivals"])}</small></button>' for i,s in enumerate(d['stages']))+'</div><div id="stage-detail"></div>'
arc+='<p class="small" style="color:var(--muted);margin-top:16px">Stages indicate demonstrated capability, not numbered shifts. Select a stage to inspect its pressure and lasting effects.</p>'+act2
arc+='<button class="link-button" data-panel="trajectories">Explore possible trajectories through this arc →</button>'

routes=heading('Paths to review','Different ways to reach Brain 2.0','Four proposed trajectories follow the same progression. These are examples of commitments and consequences, not locked classes, exhaustive branches or predetermined endings.')
routes+='<div class="choice-row" role="group" aria-label="Choose a trajectory">'+''.join(f'<button class="choice" data-route="{r["id"]}" aria-pressed="{str(i==0).lower()}"><b>{e(r["name"])}</b><small>{e(r["short"])}</small></button>' for i,r in enumerate(d['trajectories']))+'</div><div id="route-detail"></div>'
routes+=early_combinations
routes+=detail('Compare all four inheritances',table([(r['name'],r['inheritance']) for r in d['trajectories']]))
routes+='<button class="link-button" data-panel="commitments">Inspect the commitments behind these paths →</button>'

commit=heading('Decisions with a lasting cost','The major Act 1 forks','Cathexis and the accident aftermath are central arcs. Operating authority shapes exposure; the succession threat changes how their consequences are reported. Exact branches remain proposals.')
commit+='<div class="fork-intro"><figure>'+pic('cathexis-theatre-success-1','Cathexis leads a theatre session beneath obedience propaganda')+'<figcaption>Obedience and conformity: collective conviction serves the programme.</figcaption></figure><figure>'+pic('cathexis-theatre-revolution','Cathexis addresses the same audience beneath her own imagery')+'<figcaption>Revolution: the same audience and apparatus can carry a different authority. This is an interpretation of the original art.</figcaption></figure></div>'
commit+=fork(next(x for x in d['forks'] if x['id']=='cathexis'))
commit+='<h3>Why switching back and forth fails</h3><ul class="rules-list"><li><strong>Beliefs outlast assignments.</strong>The audience remembers the message after Cathexis leaves the room.</li><li><strong>Humiliation is not a reset.</strong>Damaging respect can reduce influence while making her less loyal.</li><li><strong>Contradictory promises accumulate.</strong>Reassurance loses force when repeated actions contradict it.</li><li><strong>Conversation still matters.</strong>It can negotiate a concession or repair a specific breach. It cannot erase an incompatible operating policy.</li></ul>'
commit+='<div class="section-divider"></div>'+fork(next(x for x in d['forks'] if x['id']=='accident'))+'<button class="link-button" data-panel="bdi">Trace the supervisor’s decision after an accident →</button>'
commit+=detail('Operating authority and succession',fork(next(x for x in d['forks'] if x['id']=='operation'))+fork(next(x for x in d['forks'] if x['id']=='succession')))
commit+='<div class="section-divider"></div><h3>Consequences that redirect the run</h3>'+p('Recovery should preserve the price paid and narrow or change the next set of choices. These incidents illustrate the intended structure; their triggers and available remedies are not yet specified.')
commit+=''.join(detail(x['event'],defs([('Immediate loss',x['cost']),('Possible recovery',x['route']),('What remains',x['remains'])])) for x in d['recoveries'])
commit+='<div class="callout"><strong>Outright failure.</strong> '+e(d['failure'])+'</div>'

inf=d['information']
people=heading('People and imperfect knowledge','Supervisors as actors and advisers','Choosing the daily adviser sets whose assessment, priorities and responses guide the shift. Their assigned room is under automatic authority; elsewhere the player can accept or override their recommendations.')
people+='<div class="people-picker" role="group" aria-label="Choose a supervisor">'+''.join(f'<button data-person="{c["id"]}" aria-pressed="{str(i==0).lower()}">{e(c["name"])}</button>' for i,c in enumerate(d['characters']))+'</div><div id="person-detail"></div>'
people+='<div class="section-divider"></div><h3>From an incident to a public account</h3><div class="information-flow">'+''.join('<div class="information-step"><h4>'+e(k)+'</h4>'+p(v)+'</div>' for k,v in inf['layers'])+'</div>'
people+=p(inf['consultation'])+'<div class="callout"><strong>Conversation design proposal.</strong> '+e(inf['proposal'])+'</div>'
ex=inf['example']
people+=detail('Example: the repair stoppage',p(ex['record'])+'<blockquote class="quote">'+e(ex['statement'])+'</blockquote>'+defs([('Belief or concealment',ex['belief']),('Player response',ex['response'])]))
people+=detail('When supervisors fear replacement',ul(inf['scapegoating']))
people+=detail('Keep these relationships distinct',table(inf['traits']))
people+=detail('The supervisor relationships',table(d['relationships']))
people+='<div class="callout">Exact supervisor loyalty may remain hidden in Act 1. That is a candidate design. Their behaviour and the origins of their reports must still give the player evidence to reason with.</div><button class="link-button" data-panel="stress">Trace stress, news and Thrum’s relief →</button>'

ap=d['advisedPlanning']
def adviser_case(c):
    return '<article class="advice-case" data-adviser-case="'+c['id']+'"'+(' hidden' if c['id']!='limen' else '')+'><span class="kicker">'+e(c['name'])+' proposes</span><h4>'+e(c['label'])+'</h4>'+defs([('Assessment of yesterday',c['assessment']),('Additional context',c['context']),('Priority they choose',c['priority'])])+'<blockquote class="quote">'+e(c['quote'])+'</blockquote>'+table(c['changes'])+'<div class="callout"><strong>The operating tradeoff.</strong> '+e(c['tradeoff'])+'</div>'+detail('Author view: why '+c['name']+' proposes this',p('This internal trace is for design review. The player sees the proposal, spoken explanation and permitted evidence.')+table(c['trace']))+'</article>'
advice_head='<div class="advice-section">'+status(ap['status'])+'<h3>'+e(ap['title'])+'</h3>'+p(ap['intro'])+'<ol class="advice-loop">'+''.join('<li><span class="phase-number">'+str(i+1).zfill(2)+'</span>'+e(label)+'</li>' for i,(label,body) in enumerate(ap['loop']))+'</ol><div class="consequence-grid adviser-authority">'+''.join('<div><h4>'+e(label)+'</h4>'+p(body)+'</div>' for label,body in ap['authoritySummary'])+'</div>'+detail('The planning loop and its limits',table(ap['loop'])+table(ap['rules']))+detail('How the player learns whom to choose',table(ap['choiceGuidance'])+table(ap['learning']))+'<h4 class="advice-example-title">Same pressure, different advice</h4>'+p(ap['scenario'])
advice_picker='<div class="adviser-picker" role="group" aria-label="Compare authored staffing advice">'+''.join('<button class="choice" data-adviser="'+c['id']+'" aria-pressed="'+str(i==0).lower()+'"><b>'+e(c['name'])+'</b><small>'+e(c['label'])+'</small></button>' for i,c in enumerate(ap['cases']))+'</div>'
advice_cases=''.join(adviser_case(c) for c in ap['cases'])
advice_tail=detail('Authority and supervisor reactions through the day',table(ap['dayAuthority']))+detail(ap['eventExample']['title'],p(ap['eventExample']['note'])+table(ap['eventExample']['steps']))+detail('The daily choice in the interface',table(ap['ui']))+detail('What the internal decision record contains',table(ap['trace']))+detail('Optimization, BDI and model boundaries',table(ap['engine']))+detail('Where generated prose earns its cost',table(ap['modelBudget']))+detail('How this avoids replacing one kind of fatigue with another',ul(ap['guardrails']))+detail('First playable test and open decisions',p(ap['test'])+ul(ap['open']))+'</div>'
advice_html=advice_head+advice_picker+advice_cases+advice_tail
advice_full=advice_head+advice_cases.replace(' hidden>','>')+advice_tail
people=people.replace('<div class="people-picker"',advice_html+'<div class="section-divider"></div><h3>The supervisors behind the advice</h3><div class="people-picker"',1)

st=d['stress'];th=st['thrum']
stress=heading('Pressure and its transmission',st['title'],st['intro'])+status(st['status'])
ac=d['accident']
accident_html='<div class="inheritance"><span class="kicker">Major Act 1 arc</span><h3>'+e(ac['title'])+'</h3>'+p(ac['premise'])+'</div>'+detail('From operating risk to a lasting fork',table(ac['causes'])+p(ac['disclosure'])+p(ac['feedback'])+p(ac['guardrail'])+p(ac['visibility']))
stress+=accident_html+'<button class="link-button" data-panel="bdi">Follow the accident into beliefs and intentions →</button><div class="section-divider"></div><h3>Information travels through the factory</h3>'
stress+='<div class="information-flow">'+''.join('<div class="information-step"><h4>'+e(k)+'</h4>'+p(v)+'</div>' for k,v in st['chain'])+'</div>'
stress+='<div class="choice-row rumor-choices" role="group" aria-label="Compare information scenarios">'+''.join(f'<button class="choice" data-rumor="{x["id"]}" aria-pressed="{str(i==0).lower()}"><b>{e(x["name"])}</b><small>{e(x["short"])}</small></button>' for i,x in enumerate(st['cases']))+'</div><div id="rumor-detail"></div>'
stress+=detail('What creates stress and what remains separate',table(st['sources'])+ul(st['separations']))
stress+=detail('The player’s influence over information',table(st['levers']))
stress+='<div class="section-divider"></div><span class="status agreed">Agreed direction</span><h3>Thrum can actually make them feel better</h3>'+p(th['thesis'])
stress+='<div class="fork-intro"><figure>'+pic('thrum-conveyor','Thrum plays music while conveyor workers dance')+'<figcaption>The workers gain relief; the conveyor loses productive attention.</figcaption></figure><figure>'+pic('thrum-brewery','Thrum and workers share glowing drinks at the substrate vat')+'<figcaption>The Brewery becomes a gathering. Chemistry and discipline give way.</figcaption></figure></div>'+p(th['art'])+p(th['tradeoff'])
stress+=table(th['neighbours'])+'<div class="inheritance"><span class="kicker">A role worth protecting</span>'+p(th['route'])+'</div>'
stress+='<div class="callout">'+e(th['limit'])+'</div>'+p(th['early'])
stress+=detail('How this layer develops across the run',table(st['arcLinks']))
stress+=detail('IXION reference and design boundary',p(st['reference']['text'])+'<a href="'+st['reference']['url']+'" target="_blank" rel="noopener">'+e(st['reference']['title'])+' ↗</a>')
stress+=detail('Open design questions',ul(st['open']))

b=d['bdi'];be=b['example'];bd=b['determinism']
def bdi_case(x):
    return '<article class="bdi-case"><h3>'+e(x['name'])+'</h3><blockquote class="quote">'+e(x['short'])+'</blockquote>'+defs([('Belief formed',x['belief']),('Concern prioritized',x['desire']),('Intention adopted',x['intention']),('Next action',x['action']),('Later echo',x['echo']),('Causal explanation',x['trace'])])+'</article>'
bdi=heading('How interpretation becomes action',b['title'],b['intro'])+status(b['status'])
bdi+='<div class="bdi-triad">'+''.join('<article><span class="phase-number">'+e(x[0])+'</span><h3>'+e(x[1])+'</h3>'+p(x[2])+'</article>' for x in b['triad'])+'</div>'+p(b['state'])
bdi+='<div class="information-flow">'+''.join('<div class="information-step"><h4>'+str(i+1)+' · '+e(k)+'</h4>'+p(v)+'</div>' for i,(k,v) in enumerate(b['loop']))+'</div><div class="callout">'+e(b['ambiguity'])+'</div>'
bdi+=detail('Commitment, initiative and breakdown',p(b['persistence'])+table(b['modes']))
bdi+='<div class="section-divider"></div><h3>'+e(be['title'])+'</h3>'+p(be['setup'])+'<p class="small">'+e(be['note'])+'</p>'
bdi+='<div class="choice-row rumor-choices" role="group" aria-label="Compare responses to the accident">'+''.join('<button class="choice" data-bdi="'+x['id']+'" aria-pressed="'+str(i==0).lower()+'"><b>'+e(x['name'])+'</b><small>'+e(x['short'])+'</small></button>' for i,x in enumerate(be['cases']))+'</div><div id="bdi-detail"></div>'
bdi+=detail('Three connected systems',table(b['compact'])+table(b['boundaries']))
bdi+=detail('Determinism and the model boundary',p(bd['contract'])+p(bd['randomness'])+p(bd['model'])+'<div class="callout">'+e(bd['honesty'])+'</div>'+p(bd['fallback']))
bdi+=detail('What the causal record must contain',ul(bd['log'])+p(bd['reason']))
bdi+=detail('Visual evidence and player understanding',p(b['art'])+p(b['readability']))
bdi+=detail('Design checks before balancing',ul(b['checks']))
bdi+=detail('BDI references',p('The original Loopforge Agent Vision proposes a perception–plan–act–reflect loop. The Cognitive Architecture Spec kept psychology read-only. This new design makes interpretation affect action through explicit, validated decisions; it is not yet implemented.')+''.join('<p>'+e(x['text'])+' <a href="'+x['url']+'" target="_blank" rel="noopener">'+e(x['title'])+' ↗</a></p>' for x in b['references']))

ep=d['episodes']
def episode_beat(x):
    return '<article><h3>'+e(x['name'])+'</h3><figure>'+pic(x['art'],x['caption'])+'<figcaption>'+e(x['caption'])+'</figcaption></figure>'+defs([('Factory condition',x['condition']),('Different interpretations',x['minds']),('Action',x['action']),('What changes',x['change']),('Pressure carried forward',x['next']),('Trace to inspect',x['trace'])])+'</article>'
episodes=heading('The Producer Vision',ep['title'],ep['intro'])+'<blockquote class="quote">'+e(ep['northStar'])+'</blockquote><p class="small"><a href="sources/producer.md" target="_blank" rel="noopener">Original Producer Vision ↗</a></p>'+p(ep['collision'])
episodes+='<div class="information-flow">'+''.join('<div class="information-step"><h4>'+e(k)+'</h4>'+p(v)+'</div>' for k,v in ep['contract'])+'</div>'
episodes+='<div class="section-divider"></div><h3>'+e(ep['exampleTitle'])+'</h3><div class="callout">'+e(ep['exampleNote'])+'</div>'
episodes+='<div class="episode-choices" role="group" aria-label="Inspect a proposed episode beat">'+''.join('<button class="choice" data-beat="'+x['id']+'" aria-pressed="'+str(i==0).lower()+'"><span class="phase-number">'+str(i+1).zfill(2)+'</span><b>'+e(x['name'])+'</b></button>' for i,x in enumerate(ep['beats']))+'</div><div id="episode-detail"></div>'
episodes+=detail('Four views of the same history',table(ep['views'])+p(ep['access']))
episodes+=detail('How an arc is assembled',ul(ep['assembly']))
episodes+=detail('The quality bar',p(ep['quality'])+ul(ep['checks']))
episodes+=detail('What carries forward from the old documents',p(ep['sourceBoundary'])+'<p><a href="sources/stage-layers.md" target="_blank" rel="noopener">Stagemaker layering model ↗</a> · <a href="sources/emotional-arc.md" target="_blank" rel="noopener">Emotional Arc Engine ↗</a></p>')
episodes+='<button class="link-button" data-panel="bdi">Inspect the beliefs and commitments behind an action →</button>'

x=d['experience'];xr=x['renderer'];en=d['engineBoundary']
def flow_cards(items,cls='information-flow'):
    return '<div class="'+cls+'">'+''.join('<article class="information-step"><span class="phase-number">'+str(i+1).zfill(2)+'</span><h4>'+e(k)+'</h4>'+p(v)+'</article>' for i,(k,v) in enumerate(items))+'</div>'
experience=heading('The player experience',x['title'],x['intro'])+status(x['rhythmStatus'])
experience+='<h3>Playable interfaces now. Live 3D later.</h3>'+table(x['scope'])
experience+=flow_cards(x['rhythm'],'shift-flow')
experience+='<h3>The whole-day pacing contract</h3>'+p(daily['cadence'])+detail('Required flow and optional depth',table(daily['interfaces']))
experience+='<div class="section-divider"></div><h3>Three views of one history</h3>'+flow_cards(x['views'])+p(x['shared'])
experience+=detail('Example: a jam becomes a decision',defs(x['example']))
experience+=detail('Three clocks, one authoritative sequence',table(x['clocks'])+p(x['pauseBoundary']))
experience+=detail('Mobile and accessible controls',p(x['mobile']))
experience+=detail('What we can migrate from the old viewer',table(x['migration'])+'<p class="small">Code inspection: <code>simSimScene.ts</code>, <code>simSimStore.ts</code>, <code>roomArt.ts</code> and <code>pixiScene.ts</code> in the original web viewer at 3267ea7. This is a migration assessment, not a completed port.</p>')
experience+=detail('Asset-driven interface and future geometry',table(x['art']))
experience+='<div class="section-divider"></div>'+status(xr['status'])+'<h3>'+e(xr['title'])+'</h3>'+p(xr['why'])
experience+='<div class="renderer-list">'+''.join('<article><div><h4>'+e(name)+'</h4><span class="status">'+e(fit)+'</span></div><div>'+p(body)+'<a href="'+url+'" target="_blank" rel="noopener">Official reference ↗</a></div></article>' for name,fit,body,url in xr['rows'])+'</div>'
experience+='<div class="callout">'+e(xr['boundary'])+'</div>'
experience+=detail('Visual quality and performance',p(xr['performance']))
experience+=detail('The future 3D scene must prove these things',ul(xr['spike']))
experience+=detail('Further renderer references',''.join('<p><a href="'+url+'" target="_blank" rel="noopener">'+e(title)+' ↗</a></p>' for title,url in xr['references']))
experience+='<button class="link-button" data-panel="engine-boundary">Inspect the independent engine boundary →</button>'

engine=heading('Handoff to the engine design',en['title'],en['intro'])+status(en['status'])
engine+='<div class="architecture-map"><div class="architecture-core"><span class="kicker">Authoritative state</span><h3>Simulation kernel</h3>'+p(en['planes'][0][1])+'</div><div class="architecture-seams"><article><span class="kicker">KVP · snapshots, diffs and commands</span><h4>Replaceable viewers</h4>'+p(en['planes'][2][1])+'</article><article><span class="kicker">Context out · validated proposals in</span><h4>Replaceable model services</h4>'+p(en['planes'][3][1])+'</article></div></div>'
engine+='<h3>Rust-native means enforceable discipline</h3>'+table(en['rust'])
engine+=detail('The KVP boundary',table(en['kvp']))
engine+=detail('Decoupling the LLM ecosystem',table(en['llm']))
engine+='<div class="inheritance"><span class="kicker">What makes a replay deterministic</span>'+p(en['determinism'])+'</div>'+p(en['timing'])
engine+=detail('A concrete prototype without premature infrastructure',p(en['prototype']))
engine+=detail('How we prove the boundaries',ul(en['proof']))
engine+=detail('Original doctrine and implementation limits',p(en['sourceBoundary'])+'<p><a href="sources/kvp.md" target="_blank" rel="noopener">KVP-0001 ↗</a> · <a href="sources/kvp-hashing.md" target="_blank" rel="noopener">Canonicalization ↗</a> · <a href="sources/rust-engine.md" target="_blank" rel="noopener">Rust-aligned Sim4 specification ↗</a> · <a href="sources/live-contract.md" target="_blank" rel="noopener">Existing live contract ↗</a></p>')
engine+='<button class="link-button" data-panel="experience">Return to the player experience →</button>'

lp=d['loops'];ui=d['uiDesign']
def loop_scale(s):
    return '<article class="loop-detail"><span class="kicker">'+e(s['time'])+'</span><h3>'+e(s['name'])+'</h3><blockquote class="quote">'+e(s['question'])+'</blockquote>'+defs([('Player activity',s['player']),('World activity',s['system']),('Feedback',s['feedback']),('Payoff',s['reward']),('Carried outward',s['carry']),('Example',s['example']),('Design trap',s['failure'])])+'</article>'
def mechanic(m):
    return '<article class="mechanic-detail"><span class="status">'+e(m['stage'])+'</span><h3>'+e(m['name'])+'</h3>'+defs([('Player perceives',m['see']),('Player can influence',m['do']),('Engine resolves',m['engine']),('History carried forward',m['carry']),('Interface demand',m['uiCost'])])+'</article>'
loops=heading('Core loop and session design',lp['title'],lp['intro'])+status(lp['status'])
loops+='<div class="horizon-picker" role="group" aria-label="Explore attention horizons">'+''.join('<button class="choice" data-horizon="'+s['id']+'" aria-pressed="'+str(i==1).lower()+'"><span class="horizon-time">'+e(s['time'])+'</span><b>'+e(s['name'])+'</b></button>' for i,s in enumerate(lp['scales']))+'</div><div id="loop-detail"></div>'
loops+='<div class="callout">'+e(lp['boundary'])+'</div>'
loops+=detail('The shared decision cycle',defs(lp['cycle']))
loops+='<div class="section-divider"></div><h3>One day: review to next shift</h3>'+flow_cards(daily['flow'],'shift-flow')+'<div class="inheritance"><span class="kicker">Agreed daily cadence</span>'+p(daily['cadence'])+'</div>'+p(lp['shift']['density'])
loops+=detail('Interfaces and their jobs',table(daily['interfaces']))
loops+=detail('Requirements for a satisfying short day',ul(daily['requirements']))
loops+=detail('What exists and what the next pass must prove',table(daily['gaps'])+ul(daily['checks'])+p(daily['boundary']))
loops+='<h3>Part 01 sets the requirements for this loop</h3>'+status(daily['partOne']['status'])+p(daily['partOne']['principle'])+p(daily['partOne']['target'])+flow_cards(daily['partOne']['days'],'shift-flow')
loops+=detail('Readiness, weekly quota and required interface delivery',p(daily['partOne']['gate'])+p(daily['partOne']['week'])+table(daily['partOne']['mustDeliver'])+p(daily['partOne']['test'])+p(daily['partOne']['boundary']))
loops+=detail('The player’s recurring levers',table(lp['controls']))
loops+=detail('Six connected layers','<div class="layer-list">'+''.join('<article><h4>'+e(name)+'</h4><p><strong>'+e(question)+'</strong></p>'+p(body)+p(reveal)+'</article>' for name,question,body,reveal in lp['layers'])+'</div>'+p(lp['coupling']))
loops+=detail('Feedback loops that produce the pressure',table(lp['feedbacks']))
op=lp['opening']
loops+='<div class="section-divider"></div><h3>'+e(op['title'])+'</h3>'+p(op['note'])+defs(op['beats'])
loops+='<div class="fork-list">'+''.join('<article class="fork-option"><span class="kicker">'+e(b0['short'])+'</span><h3>'+e(b0['name'])+'</h3>'+defs([('Choice',b0['choice']),('Gain',b0['gain']),('Cost',b0['cost']),('Later echo',b0['echo']),('Design check',b0['test'])])+'</article>' for b0 in op['branches'])+'</div>'
loops+=detail('The whole day shares a minute',p('Illustrative pacing budget; not a forced countdown. Heavier days, weekly calls and introductions can use two to three minutes in total.')+table(lp['shift']['dayBudget'])+'<p><a href="ONE_MINUTE_LOOP.md">Read the flow, interface inventory and implementation gaps →</a></p>')
loops+=detail('How later Act 1 sessions deepen the same loop',table(lp['laterSessions']))
loops+=detail('Where the model contributes',p(lp['llm']))
loops+=detail('Avoiding busywork and disconnected drama',ul(lp['guardrails']))
loops+=detail('What to test before increasing scope',ul(lp['tests']))
loops+='<button class="link-button" data-panel="ui-mechanics">Connect each mechanic to its UI and engine →</button>'

ui_html=heading('The player and the underlying world',ui['title'],ui['intro'])+status(ui['status'])
ui_html+='<div class="callout">'+e(daily['cadence'])+'</div>'+detail('Daily-loop requirements',ul(daily['requirements']))
ui_html+='<p class="document-links"><a href="UI_DESIGN.html" target="_blank" rel="noopener">Read the complete UI design ↗</a> · <a href="UI_DESIGN.md" download>Download UI design</a></p>'
ui_html+='<div class="complexity-axes">'+''.join('<article><h4>'+e(k)+'</h4>'+p(v)+'</article>' for k,v in ui['axes'])+'</div><div class="callout">'+e(ui['principle'])+'</div>'
ui_html+=detail(ui['playability']['title'],p(ui['playability']['intro'])+table(ui['playability']['rules'])+p(ui['playability']['review']))
ui_html+='<h3>Assets define the interface</h3>'+table(ui['visualContract'])
ui_html+='<h3>Mechanic to interface to engine</h3>'+p('Select a mechanic to inspect what the player sees and does, what the simulation resolves, and what survives into the next decision. These are proposed contracts, not implemented controls.')
ui_html+='<div class="mechanic-picker" role="group" aria-label="Inspect a mechanic">'+''.join('<button class="choice" data-mechanic="'+m['id']+'" aria-pressed="'+str(i==0).lower()+'">'+e(m['name'])+'</button>' for i,m in enumerate(ui['mechanics']))+'</div><div id="mechanic-detail"></div>'
ui_html+=detail('What the player is allowed to know',table(ui['knowledge']))
ui_html+=detail('The proposed interface surfaces',table(ui['surfaces']))
ui_html+=detail('One order through the world and back to the player',defs(ui['trace']))
ui_html+=detail('The engine and projection contract',table(ui['contract']))
ui_html+=detail('Progression along independent axes',table(ui['progression']))
ui_html+=detail('The first playable slice must prove this',ul(ui['slice']))
ui_html+=detail('Legacy UI documents and what changes',p(ui['legacy'])+'<p><a href="sources/legacy-ux.md" target="_blank" rel="noopener">Original UX specification ↗</a> · <a href="sources/legacy-ui.md" target="_blank" rel="noopener">Original Director Console UI specification ↗</a></p>')
ui_html+=detail('Decisions still open',ul(ui['open']))
ui_html+='<button class="link-button" data-panel="loops">Return to the second, minute and session loops →</button>'

f=d['factory']
factory=heading('Production and population','One chain, several kinds of consequence',f['intro'])
factory+='<div class="material-map">'+''.join('<div class="flow"><h4>'+e(k)+'</h4>'+p(v)+'</div>' for k,v in f['flows'])+'</div>'
factory+='<div class="two-col"><div><h3>The small economy</h3>'+ul(f['economy'])+'</div><div><h3>The workers beneath the count</h3>'+ul(f['workers'])+'</div></div>'
factory+='<div class="section-divider"></div><h3>Room outcomes are distributions</h3>'+p('A supervisor can excel, regularly fail or produce a real gamble in different rooms. Outcomes also depend on the conditions inherited from earlier decisions. The old tables offer useful character-grounded contrasts; their exact probabilities are not adopted here.')
factory+=table([('Limen on the conveyor','Slow, safer operation in the old rules; a different operating method from Stiletto.'),('Stiletto on the conveyor','Higher output with wear and possible casualties. A production success need not be safe.'),('Cathexis in the Theatre','Strong conditioning and growing confidence. Her poor conveyor fit can erode loyalty and, in the new design, worker respect.'),('Witch at the Brewery','Repair-first work and potentially exceptional substrate output. Her work elsewhere can sacrifice today for tomorrow.'),('Thrum in Weaving','Preparation and restoration in the old rules. The exact relationship to new continuous advanced production needs redesign.')])
factory+=detail('Production questions to resolve before balancing',ul(f['constraints']))
factory+=detail('First floor after the transition',p('Act 2 should make the first floor mostly autonomous while preserving material and social feedback. Candidate delegation rules cover staffing, maintenance, dispatch priorities and when a supervisor escalates an exception. How that arrangement is earned remains open.'))

foundations=heading('The robot asylum doctrines','What the game must preserve','The original documents establish a drama of artificial minds under pressure. The new game keeps their clean truth boundary while developing playable authority, relationships and consequential interpretation.')
foundations+='<div class="principle-grid">'+''.join('<article class="principle">'+status(x['status'])+'<h3>'+e(x['title'])+'</h3>'+p(x['text'])+(f'<a href="sources/{x["source"]}.'+('json' if x['source']=='config' else 'md')+'" target="_blank" rel="noopener">Source document ↗</a>' if 'source' in x else '')+'</article>' for x in d['principles'])+'</div>'
l=d['llm']
foundations+='<div class="section-divider"></div><h3>Where LLMs and BDI belong</h3>'+p(l['role'])+p(l['bdi'])+ul(l['boundaries'])+'<div class="callout"><strong>A real distinction in the old documents.</strong> '+e(l['sourceTension'])+'</div>'
foundations+=detail('When model reasoning improves the game',table(l['proof']))
foundations+=p('The system preserves Rust-native discipline through explicit state, typed boundaries and controlled effects in any implementation language. OpenAI is the initial model provider. The engine boundary records provider portability, replay and evaluation requirements; the player experience section compares rendering options. The renderer recommendation does not bind the simulation.')+'<button class="link-button" data-panel="engine-boundary">Read the engine boundary →</button>'
foundations+=detail('Source library and evidence boundaries','<p>Original Loopforge repository at commit <code>3267ea7</code>. These local copies preserve the source context. Historical prompts are reference material, not instructions for this design. Source rules do not establish that the new game is implemented.</p><div class="source-list">'+''.join('<article class="source-item"><h4>'+e(s['title'])+'</h4>'+p(s['use'])+('<blockquote>'+e(s['quote'])+'</blockquote>' if s.get('quote') else '')+f'<a href="sources/{s["id"]}.{Path(s["path"]).suffix[1:]}" target="_blank" rel="noopener">Read source ↗</a></article>' for s in d['sources'])+'</div><p class="small">The board also draws on the current story bible, the supervisor atlas and the owner’s game-design discussion. Original factory and character artwork is reused from the approved local media library; new producer-console source art has separate prompt and provenance records.</p>')

decisions=heading('Before implementing a shift','Decisions still worth making','The long arcs now connect to a proposed player experience. Paused planning, continuous shifts and decision pauses are agreed; balance, intervention details and the final interface still need design.')
decisions+='<div class="decisions-grid">'+''.join('<article class="decision"><span class="status open">Open</span><h3>'+e(x['title'])+'</h3>'+p(x['text'])+'</article>' for x in d['decisions'])+'</div>'
decisions+='<div class="section-divider"></div><h3>Continuity changes to preserve</h3>'+ul(d['continuity'])
decisions+='<div class="section-divider"></div><h3>Review the trajectories against these questions</h3><ul class="review-list">'+''.join('<li>'+e(q)+'</li>' for q in d['reviewQuestions'])+'</ul>'


us=d['uiStructure'];ud=us['development']
def structure_screen(sc):
    return '<article class="structure-screen" data-screen-detail="'+sc['id']+'"'+(' hidden' if sc['id']!='factory' else '')+'><div class="structure-caption"><h3>'+e(sc['name'])+'</h3>'+p(sc['summary'])+'</div><figure class="console-map" aria-label="'+e(sc['name'])+' screen structure"><div class="console-hud"><span class="kicker">Persistent HUD</span><span>Day / phase · money · workers · weekly quota + deadline</span><strong>Clock + pending decision</strong></div><div class="console-body"><div class="console-workspace"><span class="kicker">'+e(sc['canvasLabel'])+'</span><h4>'+e(sc['canvasTitle'])+'</h4>'+ul(sc['canvasItems'])+'</div><div class="console-inspector"><span class="kicker">Selection opens</span><h4>'+e(sc['inspectorTitle'])+'</h4>'+ul(sc['inspectorItems'])+'</div></div><div class="console-bottom"><h4>'+e(sc['bottomTitle'])+'</h4>'+p(sc['bottomText'])+'</div><figcaption><strong>Action area.</strong> '+e(sc['primary'])+'</figcaption></figure><div class="structure-clock"><span class="kicker">What happens to time</span>'+p(sc['time'])+'</div>'+detail('Views and contextual panels',table(sc['views'])+table(sc['panels']))+detail('Mobile behaviour and engine contract',defs([('On a small screen',sc['mobile']),('World authority',sc['engine'])]))+'</article>'
structure=heading('Interface hierarchy',us['title'],us['intro'])+status(us['status'])
structure+='<h3>Daily flow and interface ownership</h3>'+p(daily['cadence'])+table(daily['interfaces'])
structure+=detail('What Part 01 requires from each interface',table(daily['partOne']['mustDeliver'])+p(daily['partOne']['boundary']))
structure+='<h3>Where the first shift begins</h3>'+table(us['entry'])
structure+='<div class="structure-root"><span>One run instance</span><span aria-hidden="true">→</span><span>Web director’s console</span><span aria-hidden="true">→</span><strong>Three main screens</strong></div>'
structure+='<div class="screen-picker" role="group" aria-label="Explore proposed game screens">'+''.join('<button class="choice" data-screen="'+sc['id']+'" aria-controls="screen-diagrams" aria-pressed="'+str(i==0).lower()+'"><span class="phase-number">'+str(i+1).zfill(2)+'</span><b>'+e(sc['name'])+'</b><small>'+e(sc['verb'])+'</small></button>' for i,sc in enumerate(us['screens']))+'</div><div id="screen-diagrams">'+''.join(structure_screen(sc) for sc in us['screens'])+'</div>'
structure+='<div class="section-divider"></div><h3>What stays in the shared console</h3>'+table(us['shared'])
structure+=detail('Instance, interface, screen and view',table(us['identity']))
structure+='<div class="section-divider"></div><span class="kicker">Progression and investment</span><h3>A development map grounded in the factory</h3>'+p(ud['intro'])
structure+='<ol class="development-order">'+''.join('<li><span class="phase-number">'+str(i+1).zfill(2)+'</span>'+e(name)+'</li>' for i,name in enumerate(ud['order']))+'</ol><p class="small">'+e(ud['orderNote'])+'</p>'+flow_cards(ud['types'])
structure+=detail('What every project must explain',ul(ud['node'])+p(ud['states'])+p(ud['example']))+'<div class="callout">'+e(ud['knowledge'])+'</div>'
structure+='<div class="section-divider"></div><h3>Panels and overlays have specific jobs</h3>'+p('A decision gate is a state of the game. A modal is a state of the interface. They do not have to coincide.')+table(us['components'])
structure+=detail('Pause, dismissal, focus and command rules',table(us['interactionRules']))
structure+=detail('Five paths through the interface',table(us['journeys']))
structure+=detail('How this grows across the two acts',table(us['progression']))
structure+='<div class="inheritance"><span class="kicker">Same world across every screen</span>'+p(us['boundary'])+'</div>'
structure+=detail('Proposals still to settle',ul(us['open']))
structure+='<button class="link-button" data-panel="ui-mechanics">Connect these screens to each game mechanic →</button><p class="document-links"><a href="UI_DESIGN.html" target="_blank" rel="noopener">Complete UI design document ↗</a></p>'
ui_html+='<button class="link-button" data-panel="ui-structure">Explore the proposed screen and panel structure →</button>'

sound_data=json.loads((ROOT/'sound-library.json').read_text())
sound_inventory=json.loads((OUT.parents[1]/'assets/sources/loopforge-sfx/provenance.json').read_text())
sound_manifest=json.loads((OUT.parents[1]/'lib/assets/generated/loopforge-sfx.json').read_text())
sound_edits={x['id']:x for x in sound_inventory['edits']}
def sound_meta(c):
    edit=sound_edits[c['id']]
    source=sound_inventory['sources'][edit['source']]
    file=sound_manifest['assets'][c['id']]['variants'][0]
    assert file['sha256']==edit['sha256'], 'Sound edit and media pack differ: '+c['id']
    return edit,source,file
def sound_card(c):
    edit,source,file=sound_meta(c)
    cut='–'.join(f'{t:.3f}' for t in edit['intervalSeconds'])+' s of the original'
    meta=defs([('Source',source['title']+' · '+source['author']),('Crop',cut),('Edit',c['edit']),('Prepared level',str(edit['decodedPeakDbfs'])+' dBFS decoded sample peak. Gentle 30 Hz high-pass; mono for mechanisms, stereo for atmosphere.')])
    loop=' loop' if edit['crossfadeMs'] else ''
    return '<article class="sound-card">'+status(c['status'])+'<h3>'+e(c['name'])+'</h3>'+p(c['role'])+'<div class="sound-measure"><span>'+f'{edit["decodedSeconds"]:.2f} SEC'+'</span><span>'+f'{file["bytes"]/1000:.1f} KB'+'</span><span>'+('STEREO LOOP' if loop else 'MONO ONE-SHOT')+'</span><span>CC0</span></div><audio controls preload="none" data-sound-preview aria-label="'+e('Audition '+c['name'])+'"'+loop+' src="'+file['src']+'"></audio><p data-sound-status role="status"></p><div class="sound-links"><a href="'+file['src']+'" download="'+edit['output']+'">Download edit</a><a href="'+source['url']+'" target="_blank" rel="noopener">Original on Freesound ↗</a></div><p class="sound-review"><b>Listen for</b>'+e(c['review'])+'</p>'+detail('Source and crop notes',meta)+'</article>'
sounds=heading('Sound library · first recorded pass',sound_data['title'],sound_data['intro'])
sounds+='<p class="document-links"><a href="SOUND_LIBRARY.md" download>Download the sound register</a> · <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener">CC0 terms ↗</a></p>'
sounds+='<div class="callout">'+e(sound_data['reviewNote'])+'</div>'
sounds+='<div class="sound-grid">'+''.join(sound_card(c) for c in sound_data['clips'])+'</div>'
sounds+=p(sound_data['licenseNote'])+detail('Direction and playback rules',table(sound_data['direction']))+'<h3>What the library still needs</h3>'+table(sound_data['gaps'])
sound_script='<script src="sound-library.js?v='+hashlib.sha256((ROOT/'sound-library.js').read_bytes()).hexdigest()[:12]+'"></script>'

theme_system=render_theme_system(ROOT)
focused_console=render_focused_console()
style_review=render_style_review(ROOT, OUT.parents[1]/'lib/assets/generated/loopforge-ui-studies.json')
style_script='<script src="style-review.js?v='+hashlib.sha256((ROOT/'style-review.js').read_bytes()).hexdigest()[:12]+'"></script>'

producer_review=render_producer_console(ROOT, OUT.parents[1]/'lib/assets/generated/loopforge-producer-studies.json', OUT.parents[1]/'lib/assets/generated/loopforge-producer-runtime.json')
producer_script='<script src="producer-review.js?v='+hashlib.sha256((ROOT/'producer-review.js').read_bytes()).hexdigest()[:12]+'"></script>'

for_panel_link='<button class="link-button" data-panel="player-desires">Research, self-expression and scenario requirements →</button>'
loops+=for_panel_link
experience+=for_panel_link
engine+=for_panel_link
ui_html+=for_panel_link

loop_study_link='<button class="link-button" data-panel="loop-study">Core loop patterns, visual references and arc feedback →</button>'
desires+=loop_study_link
loops+=loop_study_link
engine+=loop_study_link
ui_html+=loop_study_link
arc+=loop_study_link
panels=[('player-desires','Player desires & scenarios',desires),('loop-study','Core loop study',loop_study),('arc','Long arc',arc),('loops','Core loops and sessions',loops),('trajectories','Player trajectories',routes),('commitments','Act 1 forks',commit),('people','Supervisors and reports',people),('stress','Stress and rumours',stress),('bdi','BDI and agency',bdi),('episodes','Episode arcs and traces',episodes),('experience','Player experience',experience),('producer-console','Producer console',producer_review),('ui-styles','UI style studies',style_review),('focused-console','Focused console',focused_console),('interface-hierarchy','Interface hierarchy',render_cinematic_console()),('themes-assets','Themes & assets',theme_system),('ui-structure','UI structure',structure),('ui-mechanics','UI and mechanics',ui_html),('sound-library','Sound library',sounds),('engine-boundary','Engine boundary',engine),('factory','Production and workers',factory),('foundations','Principles and sources',foundations),('decisions','Open decisions',decisions)]
head='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#101412"><meta name="color-scheme" content="dark"><meta name="robots" content="noindex,nofollow"><title>Loopforge — Game design</title><link rel="stylesheet" href="styles.css"></head><body>'
head=head.replace('href="styles.css"','href="styles.css?v='+hashlib.sha256((ROOT/'styles.css').read_bytes()).hexdigest()[:12]+'"')
head=head.replace('</head>','<link rel="stylesheet" href="style-review.css?v='+hashlib.sha256((ROOT/'style-review.css').read_bytes()).hexdigest()[:12]+'"></head>')
head=head.replace('</head>','<link rel="stylesheet" href="producer-review.css?v='+hashlib.sha256((ROOT/'producer-review.css').read_bytes()).hexdigest()[:12]+'"></head>')
study_script='<script src="loop-study.js?v='+hashlib.sha256((ROOT/'loop-study.js').read_bytes()).hexdigest()[:12]+'"></script>'
head=head.replace('</head>','<link rel="stylesheet" href="loop-study.css?v='+hashlib.sha256((ROOT/'loop-study.css').read_bytes()).hexdigest()[:12]+'"></head>')
nav='<nav class="nav" aria-label="Design board sections">'+''.join(f'<button data-panel="{id}" aria-current="{str(i==0).lower()}">{e(title)}</button>' for i,(id,title,_) in enumerate(panels))+'</nav>'
legend='<div class="legend"><p><span class="status agreed">Agreed direction</span><br>Owner’s stated design.</p><p><span class="status">Proposed</span><br>Paths and mechanisms to review.</p><p><span class="status open">Open</span><br>A decision still to make.</p><p>Design reference. No balance values or playable game UI are implemented here.</p></div>'
payload=json.dumps(d,ensure_ascii=False).replace('</',r'<\/')
artpayload=json.dumps(art).replace('</',r'<\/')
page=head+'<a class="skip" href="#main">Skip to design content</a><div class="shell"><div class="masthead"><span class="wordmark">LOOPFORGE / DESIGN</span><div class="mast-links"><a href="/stepanoskin/loopforge/play">Play the first shift ↗</a><span class="meta">'+e(d['version']).upper()+'</span><a href="full-record.html" target="_blank" rel="noopener">Full reading copy ↗</a></div></div><header class="hero"><div><span class="kicker">Author reference · contains story spoilers</span><h1>Game design</h1><p>'+e(d['premise'])+'</p></div><figure class="hero-image">'+pic('factory','Loopforge factory overview',lazy=False)+'</figure></header><div class="layout"><aside class="sidebar">'+nav+legend+'</aside><main class="main" id="main">'+''.join(f'<section class="panel" id="{id}" aria-label="{e(title)}"'+(' hidden' if i else '')+'>'+body+'</section>' for i,(id,title,body) in enumerate(panels))+'</main></div><footer class="footer"><span>Design record · '+e(d['version'])+'</span><a href="GAME_DESIGN.md" download>Download the design record</a></footer></div><div id="announcement" class="sr-only" aria-live="polite"></div><noscript><div class="noscript">The interactive board requires JavaScript. <a href="full-record.html">Read the complete design record.</a></div></noscript><script id="design-data" type="application/json">'+payload+'</script><script id="art-data" type="application/json">'+artpayload+'</script><script src="board.js"></script></body></html>'
page=page.replace('src="board.js"','src="board.js?v='+hashlib.sha256((ROOT/'board.js').read_bytes()).hexdigest()[:12]+'"')
page=page.replace('</body>',sound_script+style_script+producer_script+study_script+'</body>')
(OUT/'index.html').write_text(page)

# A complete, static copy has every path and character, including text that the board reveals on selection.
full=head+'<main class="record"><a href="index.html">← Interactive design board</a><header class="hero" style="display:block"><span class="kicker">Author reference · contains story spoilers</span><h1>'+e(d['title'])+'</h1>'+p(d['version'])+p(d['purpose'])+p(d['statusNote'])+'</header>'
full+='<section>'+loop_study_full+'</section>'
full+='<section><h2>World and story grounding</h2>'+world+'</section><section><h2>Act 1 progression</h2>'+early_rules+''.join(stage(s) for s in d['stages'])+act2+'</section>'
full+='<section><h2>Proposed trajectories</h2>'+p('Illustrative paths through the shared progression, not locked classes or predetermined endings.')+early_combinations+''.join(trajectory(r) for r in d['trajectories'])+'</section>'
full+='<section><h2>Commitments and recovery</h2>'+commit+'</section><section><h2>Supervisors and information</h2>'+advice_full+''.join(person(c) for c in d['characters'])+people[people.index('<div class="section-divider"></div><h3>From an incident to a public account'): ]+'</section>'
stress_full=stress.replace('<div id="rumor-detail"></div>',''.join('<article><h3>'+e(x['name'])+'</h3>'+defs([('Physical truth',x['truth']),('Who learns what',x['reach']),('What they believe',x['interpretation']),('Player response',x['choice']),('Consequences',x['aftermath']),('Thrum’s role',x['thrum'])])+'</article>' for x in st['cases']))
# Scenario controls have no purpose in the static complete record.
start=stress_full.index('<div class="choice-row rumor-choices"');end=stress_full.index('</div>',start)+6
stress_full=stress_full[:start]+stress_full[end:]
bdi_full=bdi.replace('<div id="bdi-detail"></div>',''.join(bdi_case(x) for x in be['cases']))
start=bdi_full.index('<div class="choice-row rumor-choices"');end=bdi_full.index('</div>',start)+6
bdi_full=bdi_full[:start]+bdi_full[end:]
episodes_full=episodes.replace('<div id="episode-detail"></div>',''.join(episode_beat(x) for x in ep['beats']))
start=episodes_full.index('<div class="episode-choices"');end=episodes_full.index('</div>',start)+6
episodes_full=episodes_full[:start]+episodes_full[end:]
def remove_picker(body,cls):
    start=body.index('<div class="'+cls+'"');end=body.index('</div>',start)+6
    return body[:start]+body[end:]
loops_full=remove_picker(loops.replace('<div id="loop-detail"></div>',''.join(loop_scale(s) for s in lp['scales'])),'horizon-picker')
ui_full=remove_picker(ui_html.replace('<div id="mechanic-detail"></div>',''.join(mechanic(m) for m in ui['mechanics'])),'mechanic-picker')
structure_full=remove_picker(structure,'screen-picker').replace(' hidden>','>')
full+='<section>'+desires+'</section><section>'+loops_full+'</section><section>'+stress_full+'</section><section>'+bdi_full+'</section><section>'+episodes_full+'</section><section>'+experience+'</section><section>'+structure_full+'</section><section>'+ui_full+'</section><section>'+engine+'</section><section>'+factory+'</section><section>'+foundations+'</section><section>'+decisions+'</section></main></body></html>'
# Keep the full reading copy complete without requiring disclosure interactions.
full=full.replace('<details>','<details open>')
full=re.sub(r'<button class="link-button" data-panel="([^"]+)">(.*?)</button>', r'<a class="link-button" href="index.html#\1">\2</a>', full)
full=full.replace('</main>','<section>'+sounds+'</section><section>'+style_review+'</section><section>'+producer_review+'</section><section>'+focused_console+'</section><section>'+theme_system+'</section></main>').replace('</body>',sound_script+style_script+producer_script+'</body>')
(OUT/'full-record.html').write_text(full)
ui_record=head.replace('<title>Loopforge — Game design</title>','<title>Loopforge — UI design</title>')+'<main class="record"><a href="index.html#ui-mechanics">← Interactive UI and mechanics board</a><header class="hero" style="display:block"><span class="kicker">Design direction · 8 October 2026</span><h1>Loopforge UI design</h1>'+p('Four integrated console skins are implemented: Foundry desk, Broadcast control, Dispatch office and Obedience organ. Only those four appear in Settings; the old six studies remain historical and their focused-screen materials remain internal. Start at the console, Answer leadership, Acknowledge quota, then Choose adviser. Hardware uses registered CSS fragments cropped from clean plates, not separate alpha handsets. Local visual and full-flow checks passed; the hosted first shift was also completed. All four dedicated portrait plates are generated, catalogued and implemented. Owner review remains pending. Adaptive wide, portrait, small/short and compact-landscape modes preserve the selected camera, run and pending decision through resize. A live cinematic 3D factory remains later work.')+'</header>'+early_rules+structure_full+ui_full+advice_full+'<p><a href="index.html#ui-styles">View the historical six material studies →</a></p><section><h2>Delivery scope</h2>'+table(d['experience']['scope'])+'</section><section><h2>Approved shift rhythm</h2>'+table(d['experience']['rhythm'])+'</section><section><h2>Attention horizons</h2>'+table([(s['time'],s['question']) for s in lp['scales']])+p(lp['boundary'])+'<a href="index.html#loops">Inspect the core loops and session design →</a></section><section><h2>Mobile and art</h2>'+p(d['experience']['mobile'])+table(d['experience']['art'])+'</section></main></body></html>'
ui_record=ui_record.replace('</main>', '<section>'+loop_study_full+'</section><section>'+desires+'</section><section>'+producer_review+'</section><section>'+focused_console+'</section><section>'+theme_system+'</section></main>')
ui_record=ui_record.replace('<details>','<details open>')
ui_record=re.sub(r'<button class="link-button" data-panel="([^"]+)">(.*?)</button>',r'<a class="link-button" href="index.html#\1">\2</a>',ui_record)
ui_record=ui_record.replace('</body>',producer_script+'</body>')
(OUT/'UI_DESIGN.html').write_text(ui_record)

# Human-editable companion record. It intentionally contains all design content, not a summary of the board.
md=['# '+d['title'],d['version'],d['purpose'],d['statusNote']]
def mh(title,level=2):md.append('#'*level+' '+title)
def mp(t):md.append(t)
def ml(items):md.append('\n'.join('- '+t for t in items))
def fields(items):
    for k,v in items:mp('**'+k+'.** '+v)
mh('World and story grounding')
for x in d['world']:mh(x['title'],3);mp(x['text'])
mh('Core loops and sessions');mp(lp['intro']);mp('*'+lp['status']+'*');mp(lp['boundary']);fields(lp['cycle'])
for s in lp['scales']:
    mh(s['time']+' · '+s['name'],3);mp(s['question']);fields([('Player activity',s['player']),('World activity',s['system']),('Feedback',s['feedback']),('Payoff',s['reward']),('Carried outward',s['carry']),('Example',s['example']),('Design trap',s['failure'])])
mh('One day: flow and interface ownership',3);mp(daily['cadence']);fields(daily['flow']);fields(daily['interfaces']);mh('Daily-loop requirements',3);ml(daily['requirements']);mh('Part 01: when the third room should enter',3);mp(daily['partOne']['status']);mp(daily['partOne']['principle']);mp(daily['partOne']['target']);fields(daily['partOne']['days']);mp(daily['partOne']['gate']);mp(daily['partOne']['week']);fields(daily['partOne']['mustDeliver']);mp(daily['partOne']['test']);mp(daily['partOne']['boundary']);mh('Current implementation and remaining work',3);fields(daily['gaps']);mp(daily['boundary']);mh('Illustrative seconds budget',3);fields(lp['shift']['dayBudget']);mp('Proposed split for testing, not an agreed timer.');
mh('The shift inside the session',3);mp(lp['shift']['intro']);fields(lp['shift']['beats']);mp(lp['shift']['target']);mp(lp['shift']['density']);mh('Recurring levers',3);fields(lp['controls'])
mh('Connected layers',3)
for name,question,body,reveal in lp['layers']:mh(name,4);mp(question);mp(body);mp(reveal)
mp(lp['coupling']);mh('Feedback loops',3);fields(lp['feedbacks']);mh(op['title'],3);mp(op['note']);fields(op['beats'])
for b0 in op['branches']:mh(b0['name'],4);fields([('Choice',b0['choice']),('Gain',b0['gain']),('Cost',b0['cost']),('Later echo',b0['echo']),('Design check',b0['test'])])
mh('Later Act 1 sessions',3);fields(lp['laterSessions']);mp(lp['llm']);mh('Guardrails',3);ml(lp['guardrails']);mh('Session tests',3);ml(lp['tests'])
mh('Foundational principles')
for x in d['principles']:
    mh(x['title'],3);mp('*'+x['status']+'*');mp(x['text'])
    if x.get('source'):mp('[Source](sources/'+x['source']+'.md)')
mh('Act 1 progression');mh(early['title'],3);fields(early['rules'])
for s in d['stages']:
    mh(s['room'],3);mp('*'+s['status']+'*');fields([('Arrival',s['arrivals']),('Visible operation',s['visible']),('Learning',s['learn']),('Decision',s['choice']),('Friction',s['friction']),('Proposed gate',s['gate']),('Hidden development',s['hidden']),('Carried forward',s['carry'])])
    if s.get('artReference'):
        mp('!['+s['room']+' original concept art]('+art[s['art']]['variants'][-1]['src']+')');mp(s['caption']);mp(s['artReference'])
mh('Act 2 transition');mp(a['text']);mh('Inherited state',3);ml(a['inherits']);mh('New capabilities',3);ml(a['changes']);mp(a['boundary'])
mh('Major commitments')
for f0 in d['forks']:
    mh(f0['title'],3);mp('*'+f0['status']+' · '+f0['timing']+'*');mp(f0['text'])
    for x in f0['paths']:mh(x['name'],4);fields([('Gain',x['gain']),('Liability',x['cost']),('Response',x['response'])])
mh('Why assignment oscillation and reassurance cannot solve the Cathexis fork',3)
ml(['Beliefs and personal allegiance outlast assignments.','Public humiliation damages standing and can increase resentment; it does not restore loyalty.','Repeated contradictory promises make reassurance ineffective.','Conversation can negotiate real terms or repair a particular breach; it cannot erase an incompatible operating policy.'])
mh('Proposed trajectories');mp('These are illustrative paths, not exhaustive branches, locked classes or predetermined endings.');mh('Supervisor combinations',3);fields(early['combinations']);mp(early['boundary'])
for r in d['trajectories']:
    mh(r['name'],3);mp('*'+r['status']+'*');mp(r['premise'])
    for i,t in enumerate(r['beats']):mp('**'+d['stages'][i]['room']+'.** '+t)
    fields([('Pitfall',r['pitfall']),('Recovery',r['recovery']),('Act 2 inheritance',r['inheritance']),('Design test',r['test'])])
mh('Supervisors')
for c in d['characters']:
    mh(c['name'],3);mp(c['grounding']);fields([('Role',c['role']),('Strength',c['strength']),('Failure mode',c['failure']),('Advice',c['advisor']),('Relationship',c['relationship']),('Under threat',c['underThreat'])])
mh('Supervisor relationships');fields(d['relationships'])
mh('Information and the daily consultation');fields(inf['layers']);mp(inf['consultation']);mp(inf['proposal']);mh('Repair stoppage example',3);fields(list(ex.items()));mh('Scapegoating and protection',3);ml(inf['scapegoating']);mh('Distinct relationships',3);fields(inf['traits'])
mh('The accident and its aftermath');mp(ac['premise']);fields(ac['causes']);mp(ac['disclosure']);mp(ac['feedback']);mp(ac['guardrail']);mp(ac['visibility'])
mh('Stress and information propagation');mp(st['intro']);mp('*'+st['status']+'*');mh('Sources of stress',3);fields(st['sources']);mh('Distinct effects',3);ml(st['separations']);mh('How a claim travels',3);fields(st['chain'])
for x in st['cases']:mh(x['name'],3);fields([('Physical truth',x['truth']),('Who learns what',x['reach']),('What they believe',x['interpretation']),('Player response',x['choice']),('Consequences',x['aftermath']),('Thrum’s role',x['thrum'])])
mh('Player influence',3);fields(st['levers']);mh('Thrum’s relief',3);mp(th['thesis']);mp(th['art']);mp(th['tradeoff']);fields(th['neighbours']);mp(th['route']);mp(th['limit']);mp(th['early']);mh('Across the run',3);fields(st['arcLinks']);mh('IXION reference',3);mp(st['reference']['text']);mp('['+st['reference']['title']+']('+st['reference']['url']+')');ml(st['open'])
mh('BDI and supervisor agency');mp(b['intro']);mp('*'+b['status']+'*')
for label,title,body in b['triad']:mh(label+' · '+title,3);mp(body)
mp(b['state']);fields(b['loop']);mp(b['persistence']);mp(b['ambiguity']);mh('Sources of action',3);fields(b['modes'])
mh(be['title'],3);mp(be['setup']);mp(be['note'])
for x in be['cases']:mh(x['name'],4);mp(x['short']);fields([('Belief formed',x['belief']),('Concern prioritized',x['desire']),('Intention adopted',x['intention']),('Next action',x['action']),('Later echo',x['echo']),('Causal explanation',x['trace'])])
mh('Three connected systems',3);fields(b['compact']);fields(b['boundaries']);mh('Determinism and the model boundary',3)
for key in ['contract','randomness','model','honesty','fallback']:mp(bd[key])
ml(bd['log']);mp(bd['reason']);mh('Visual evidence and player understanding',3);mp(b['art']);mp(b['readability']);mh('Design checks before balancing',3);ml(b['checks'])
for x in b['references']:mp(x['text']+' ['+x['title']+']('+x['url']+')')
mh('Episodes and inspectable traces');mp(ep['intro']);mp('> '+ep['northStar']);mp(ep['collision']);fields(ep['contract']);mh(ep['exampleTitle'],3);mp(ep['exampleNote'])
for x in ep['beats']:mh(x['name'],4);fields([('Factory condition',x['condition']),('Different interpretations',x['minds']),('Action',x['action']),('What changes',x['change']),('Pressure carried forward',x['next']),('Trace to inspect',x['trace']),('Visual grounding',x['caption'])])
mh('Four views of the same history',3);fields(ep['views']);mp(ep['access']);mh('How an arc is assembled',3);ml(ep['assembly']);mp(ep['quality']);ml(ep['checks']);mp(ep['sourceBoundary'])
x=d['experience']
mh('Player experience');mp(x['intro']);mp('*'+x['rhythmStatus']+'*');mh('Playable interfaces now. Live 3D later.',3);fields(x['scope']);fields(x['rhythm']);mh('Three views of one history',3);fields(x['views']);mp(x['shared'])
mh('A jam becomes a decision',3);fields(x['example']);mh('Three clocks',3);fields(x['clocks']);mp(x['pauseBoundary']);mp(x['mobile'])
mh('Migration from the old viewer',3);fields(x['migration']);mh('Art and placeholders',3);fields(x['art'])
mh(xr['title'],3);mp('*'+xr['status']+'*');mp(xr['why'])
for name,fit,body,url in xr['rows']:mp('**'+name+' — '+fit+'.** '+body+' [Official reference]('+url+')')
mp(xr['boundary']);mp(xr['performance']);mh('Future 3D scene proof',3);ml(xr['spike'])
for title,url in xr['references']:mp('['+title+']('+url+')')
mh('Engine boundary');mp(en['intro']);mp('*'+en['status']+'*');fields(en['planes']);mh('Rust-native discipline',3);fields(en['rust']);mh('KVP boundary',3);fields(en['kvp']);mh('Decoupled model services',3);fields(en['llm']);mh('Replay and timing',3);mp(en['determinism']);mp(en['timing']);mp(en['prototype']);mh('Boundary checks',3);ml(en['proof']);mp(en['sourceBoundary'])
ui_start=len(md)
mp(desire_record)
mp(loop_study_record)
mh(early['title']);fields(early['rules'])
mh('UI structure');mp(daily['cadence']);fields(daily['interfaces']);ml(daily['requirements']);mh('Part 01 interface obligations',3);fields(daily['partOne']['mustDeliver']);mp(daily['partOne']['boundary']);mp(us['intro']);mp('*'+us['status']+'*');mh('Where the first shift begins',3);fields(us['entry']);mh('Instance and interface hierarchy',3);fields(us['identity']);mh('Shared director’s console',3);fields(us['shared'])
for sc in us['screens']:
    mh(sc['name']+' — '+sc['verb'],3);mp(sc['summary']);mh('Workspace',4);mp(sc['canvasTitle']);ml(sc['canvasItems']);mh(sc['inspectorTitle'],4);ml(sc['inspectorItems']);mh(sc['bottomTitle'],4);mp(sc['bottomText']);mp(sc['primary']);mh('Views and panels',4);fields(sc['views']);fields(sc['panels']);fields([('Clock behaviour',sc['time']),('Mobile',sc['mobile']),('Engine contract',sc['engine'])])
mh('Development and base currencies',3);mp(ud['intro']);fields(ud['types']);mp(' → '.join(ud['order']));mp(ud['orderNote']);mh('Every project must explain',4);ml(ud['node']);mp(ud['states']);mp(ud['example']);mp(ud['knowledge'])
mh('Component vocabulary',3);fields(us['components']);mh('Interaction rules',3);fields(us['interactionRules']);mh('Five interface journeys',3);fields(us['journeys']);mh('Growth across the acts',3);fields(us['progression']);mp(us['boundary']);mh('Open structure decisions',3);ml(us['open'])
mh('UI and simulation complexity');mp(ui['intro']);mp('*'+ui['status']+'*');fields(ui['axes']);mp(ui['principle']);mh('Knowledge policy',3);fields(ui['knowledge']);mh('Interface surfaces',3);fields(ui['surfaces'])
mh('Assets define the interface',3);fields(ui['visualContract'])
mh('Mechanic to UI to engine',3)
for m in ui['mechanics']:mh(m['name'],4);mp('*'+m['stage']+'*');fields([('Player perceives',m['see']),('Player can influence',m['do']),('Engine resolves',m['engine']),('History carried forward',m['carry']),('Interface demand',m['uiCost'])])
mh('One order through the world',3);fields(ui['trace']);mh('Projection contract',3);fields(ui['contract']);mh('Progression',3);fields(ui['progression']);mh('Playable slice checks',3);ml(ui['slice']);mh('Legacy and new direction',3);mp(ui['legacy']);mp('[Original UX](sources/legacy-ux.md) · [Original UI](sources/legacy-ui.md)');mh('Open UI decisions',3);ml(ui['open'])
mh(ap['title']);mp(ap['intro']);mp('*'+ap['status']+'*');mh('Planning loop',3);fields(ap['loop']);mh('Interaction rules',3);fields(ap['rules']);mh('Interface',3);fields(ap['ui']);mh('Choosing and learning',3);fields(ap['choiceGuidance']);fields(ap['learning']);mh('Authority during the day',3);fields(ap['authoritySummary']);fields(ap['dayAuthority']);mh(ap['eventExample']['title'],3);mp(ap['eventExample']['note']);fields(ap['eventExample']['steps']);mh('Same pressure, different advice',3);mp(ap['scenario'])
for c in ap['cases']:
    mh(c['name']+' — '+c['label'],4);fields([('Assessment of yesterday',c['assessment']),('Additional context',c['context']),('Priority they choose',c['priority'])]);mp('> '+c['quote']);fields(c['changes']);mp('**Operating tradeoff.** '+c['tradeoff']);mp('**Author-only causal interpretation.**');fields(c['trace'])
mh('Internal decision record',3);fields(ap['trace']);mh('Optimization and engine boundary',3);fields(ap['engine']);mh('Generated prose and budget',3);fields(ap['modelBudget']);mh('Guardrails',3);ml(ap['guardrails']);mh('First playable test',3);mp(ap['test']);mh('Open decisions',3);ml(ap['open'])
mh(ui['playability']['title']);mp(ui['playability']['intro']);fields(ui['playability']['rules']);mp(ui['playability']['review'])
ui_md=['# Loopforge UI design' ,d['version'],'Four integrated console skins are implemented: Foundry desk, Broadcast control, Dispatch office and Obedience organ. Only those four appear in Settings; the old six studies remain historical and their focused-screen materials remain internal. Start at the console, Answer leadership, Acknowledge quota, then Choose adviser. Hardware uses registered CSS fragments cropped from clean plates, not separate alpha handsets. Local visual and full-flow checks passed; the hosted first shift was also completed. All four dedicated portrait plates are generated, catalogued and implemented. Owner review remains pending. Adaptive wide, portrait, small/short and compact-landscape modes preserve the selected camera, run and pending decision through resize. A live cinematic 3D factory remains later work.']+md[ui_start:]
ui_md+=['## Delivery scope']+['**'+k+'.** '+v for k,v in d['experience']['scope']]
ui_md+=['## Approved shift rhythm']+['**'+k+'.** '+v for k,v in d['experience']['rhythm']]
ui_md+=['## Attention horizons']+['**'+s['time']+'.** '+s['question'] for s in lp['scales']]+[lp['boundary'],'[Core loops and sessions](GAME_DESIGN.md#core-loops-and-sessions)','## Mobile and art',d['experience']['mobile']]+['**'+k+'.** '+v for k,v in d['experience']['art']]
(OUT/'UI_DESIGN.md').write_text('\n\n'.join(ui_md)+'\n')
mh('Production and population');mp(f['intro']);fields(f['flows']);mh('Economy',3);ml(f['economy']);mh('Workers',3);ml(f['workers']);mh('Constraints to resolve',3);ml(f['constraints'])
mp('First-floor delegation is an agreed Act 2 direction. Candidate policies include staffing, maintenance, dispatch priorities and exception escalation. Exact requirements remain open.')
mh('Recovery and failure')
for x in d['recoveries']:mh(x['event'],3);fields([('Loss',x['cost']),('Recovery',x['route']),('Persistent consequence',x['remains'])])
mp(d['failure'])
mh('LLMs and BDI');mp(l['role']);mp(l['bdi']);ml(l['boundaries']);mp(l['sourceTension']);mh('When model reasoning improves the game',3);fields(l['proof'])
mp('The engine boundary above records Rust-native discipline, provider portability, model admission and replay requirements. The player experience section compares rendering options; its recommendation does not bind the simulation.')
mh('Open decisions')
for x in d['decisions']:mh(x['title'],3);mp(x['text'])
mh('Continuity changes');ml(d['continuity']);mh('Concept review questions');ml(d['reviewQuestions'])
mh('Source library');mp('Original repository: stepan-o/loopforge at 3267ea7. Copies are historical reference material, not current implementation claims or agent instructions.')
for s in d['sources']:mh(s['title'],3);mp(s['use']);mp('[Local source](sources/'+s['id']+Path(s['path']).suffix+') · `'+s['path']+'`')
mp('Current story and cast references: the existing Loopforge story bible and supervisor atlas. The owner’s discussion establishes the new direction. Concept art retains its original source identity in art-provenance.json.')
sound_start=len(md)
mh('Sound library');mp(sound_data['intro']);mp(sound_data['reviewNote']);mp(sound_data['licenseNote'])
mp('[Playable sound library](/stepanoskin/loopforge/design#sound-library) · [CC0 terms](https://creativecommons.org/publicdomain/zero/1.0/)')
for c in sound_data['clips']:
    edit,source,file=sound_meta(c)
    mh(c['name'],3);mp('*'+c['status']+'*');mp(c['role'])
    fields([('Edit',c['edit']),('Source interval',str(edit['intervalSeconds'][0])+'–'+str(edit['intervalSeconds'][1])+' seconds'),('Result',str(edit['decodedSeconds'])+' seconds · '+str(file['bytes'])+' bytes · '+str(edit['decodedPeakDbfs'])+' dBFS decoded sample peak'),('Listen for',c['review'])])
    mp('[Play / download edit]('+file['src']+') · ['+source['title']+' — '+source['author']+']('+source['url']+') · CC0')
mh('Sound direction',3);fields(sound_data['direction']);mh('Remaining sounds',3);fields(sound_data['gaps'])
(OUT/'SOUND_LIBRARY.md').write_text('\n\n'.join(md[sound_start:])+'\n')
(OUT/'GAME_DESIGN.md').write_text('\n\n'.join(md)+'\n')


# Make relative resources work behind the app route as well as the static reading copies.
for path in OUT.glob('*.html'):
    content = path.read_text()
    content = re.sub(r'(href|src)="(?![a-z]+:|/|#)([^" ]+)"', lambda m: m[1]+'="/loopforge-design/'+m[2]+'"', content)
    path.write_text(content)
for name in ['loop-study.css','loop-study.js','styles.css','board.js','sound-library.js','style-review.js','style-review.css','producer-review.js','producer-review.css','art-provenance.json']:
    shutil.copyfile(ROOT/name,OUT/name)
print('Generated app design board and complete reading copies; original sources retained.')

# The implementation contract is available with both static and interactive UI records.
theme_contract=(ROOT.parent/"UI_THEME_ASSET_SYSTEM.md").read_text()
(OUT/"UI_THEME_ASSET_SYSTEM.md").write_text(theme_contract)
with (OUT/"UI_DESIGN.md").open("a") as f: f.write("\n\n"+theme_contract)

(OUT/"CONSOLE_LIGHT_FEEDBACK.md").write_text((ROOT.parent/"CONSOLE_LIGHT_FEEDBACK.md").read_text())
with (OUT/"UI_DESIGN.md").open("a") as f: f.write("\n\n"+(ROOT.parent/"CONSOLE_LIGHT_FEEDBACK.md").read_text())

focused_contract=(ROOT.parent/"FOCUSED_CONSOLE_REBUILD.md").read_text()
(OUT/"FOCUSED_CONSOLE_REBUILD.md").write_text(focused_contract)
for name in ["UI_DESIGN.md","GAME_DESIGN.md"]:
    target=OUT/name
    if target.exists():
        with target.open("a") as f: f.write("\n\n"+focused_contract)

for contract_name in ["LIVING_CONSOLE_DIRECTION.md","CINEMATIC_INTERFACE_DIRECTION.md","LEADERSHIP_CALL_ART.md","PRODUCER_CONSOLE_DIRECTION.md"]:
    content=(ROOT.parent/contract_name).read_text()
    (OUT/contract_name).write_text(content)
    for name in ["UI_DESIGN.md","GAME_DESIGN.md"]:
        with (OUT/name).open("a") as f: f.write("\n\n"+content)

# Preserve exact authored prompts alongside review-size art; no image bytes in this record.
prompt_root=OUT.parents[1]/'assets/sources/loopforge-producer'
(OUT/'PRODUCER_CONCEPT_PROMPTS.md').write_text('# Producer console — exact generation prompts\n\nBuilt-in imagegen; four concept treatments, reviewed 8 October 2026.\n\n'+'\n\n---\n\n'.join(p.read_text() for p in sorted(prompt_root.glob('*-prompts.md'))))

# Current daily-loop working brief; the authored source remains beside the design docs.
(OUT/"ONE_MINUTE_LOOP.md").write_text((ROOT.parent/"ONE_MINUTE_LOOP.md").read_text())
