from pathlib import Path
import html,json,re
P=Path(__file__).resolve().parent
A='2026-10-22-a-studio-needs-a-shorter-path'
FIRST='2026-10-22-what-i-mistook-for-progress'
def esc(x):return html.escape(str(x),quote=True)
def cite(body):
 def replace(m):
  first=int(m[1]);last=int(m[2]) if m[2] else first
  assert 1<=first<=last<=12
  target=f'source-S{first}' if first==last else f'source-range-S{first}-S{last}'
  return '<a class="citation" href="#'+target+'">'+m[0]+'</a>'
 return re.sub(r'\bS(1[0-2]|[1-9])(?:[–-]S?(1[0-2]|[1-9]))?\b',replace,body)
def legend():
 defs=json.loads((P/'public-inputs/assessment-source-map.json').read_text())
 def event(*ids):return [(f'../../history/index.html#event-{x}',x) for x in ids]
 def answers(role,*qs):return [(f'../../interviews/index.html#interview-{role}-q{q}',f'{role} Q{q}') for q in qs]
 stats=lambda section:('../../statistics.html#section-'+str(section),'Statistics appendix')
 hist=lambda anchor:('../../history/index.html#'+anchor,'Full history: '+anchor)
 links={
  'S1':[(f'../{FIRST}/index.html','Producer reflection'),('../../interviews/index.html','All54 answers')],
  'S2':[hist('P01'),hist('run')]+answers('level',1,2,3,4,5)+[stats(6)],
  'S3':[stats(2),('https://developers.openai.com/api/docs/models/gpt-6-astra','Supplied official model specification')],
  'S4':[hist('P07')]+answers('animator',1,2,3)+answers('3d-artist',1,2,3)+event('E0283','E0329'),
  'S5':event('E0268','E0277','E0303','E0329','E0364','E0365'),
  'S6':[stats(4),hist('history-effort')]+event('E0365'),
  'S7':event('E0331','E0349','E0360')+answers('engine',3,4,5,6)+[hist('P07')],
  'S8':answers('director',1,3,6)+answers('critic',1,6)+answers('writer',1,3,5)+answers('visual',1,3)+[stats(6)],
  'S9':[stats(3)],
  'S10':[('#assessment-usage','This assessment’s usage table and scope qualifications')],
  'S11':[stats(4)]+answers('systems',3,4)+[hist('P02'),hist('P04')],
  'S12':event('E0078','E0082')+answers('critic',2,3)+answers('writer',2)+[hist('P03')]
 }
 out='<section id="public-sources" class="public-sources"><h2>Public source legend</h2><p>Safe references to the accompanying public material. Original operational sources remain private.</p>'
 for x in defs:
  out+='<details id="source-'+x['id']+'"><summary>'+esc(x['id']+' · '+x['claim'])+'</summary><ul>'+''.join('<li>'+esc(v)+'</li>' for v in x['sources'])+'</ul><p>'+ ' · '.join('<a href="'+esc(url)+'">'+esc(label)+'</a>' for url,label in links[x['id']])+'</p></details>'
 for first,last in [(9,10),(4,6),(9,11)]:
  out+=f'<p id="source-range-S{first}-S{last}">Sources S{first}–S{last}: '+', '.join(f'<a href="#source-S{i}">S{i}</a>' for i in range(first,last+1))+'</p>'
 return out+'</section>'
def credits():
 d=json.loads((P/'content/credits.json').read_text())
 return '<div class="gallery-credit"><p>'+esc(d['credit'])+'</p><p>'+' · '.join('<a href="'+esc(d['links'][label])+'">'+esc(label)+'</a>' for label in ['Munder Difflin','Modern Interiors by LimeZu'])+'</p></div>'
