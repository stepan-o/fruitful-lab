#!/usr/bin/env python3
from pathlib import Path
import html,json,hashlib,shutil,struct,re
from urllib.parse import urlsplit
P=Path(__file__).resolve().parent;PUBLIC=P/'public-inputs/history';SITE=P/'site/history'
def esc(value):return html.escape(str(value),quote=True)
def link(url,label):
 assert url.startswith('#') or (not url.startswith(('/', '\\')) and not urlsplit(url).scheme) or urlsplit(url).scheme=='https'
 return f'<a href="{esc(url)}">{esc(label)}</a>'
def when(value):return esc(value.replace('T',' ').replace('+00:00',' UTC').replace('Z',' UTC'))
def refs(ids,kind='event'):
 return '<span class="references">'+', '.join(link('#'+kind+'-'+i,i) for i in ids)+'</span>' if ids else ''
def dimensions(path):
 data=path.read_bytes()
 if data[:8]==b'\x89PNG\r\n\x1a\n':return struct.unpack('>II',data[16:24])
 assert data[:2]==b'\xff\xd8';i=2
 while i<len(data):
  if data[i]!=255:i+=1;continue
  while data[i]==255:i+=1
  marker=data[i];i+=1
  if marker in (0xd8,0xd9):continue
  size=int.from_bytes(data[i:i+2],'big')
  if marker in [0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf]:return int.from_bytes(data[i+5:i+7],'big'),int.from_bytes(data[i+3:i+5],'big')
  i+=size
 raise ValueError('No image dimensions')
def generate(final_publication=False):
 SITE.mkdir(parents=True,exist_ok=True)
 c=json.loads((PUBLIC/'page-content.json').read_text());media=json.loads((PUBLIC/'data/media.json').read_text())['media'];roles={r['id']:r['name'] for r in c['team']['records']};roles.update({'external-bridge':'External owner-facing bridge','owner':'Owner','harness':'Studio application','unassigned':'Unassigned'})
 for e in c['events']:
  e['recipientRole']=e.get('recipient',e.get('recipientRole'))
  e.setdefault('taskLinkBasis','Recorded task association; source metadata does not establish acceptance or causation.')
 def role(r):return roles.get(r,r)
 def paragraphs(section):
  return ''.join(f'<p id="{esc(p["id"])}">{esc(p["text"])}</p>'+('<details class="paragraph-sources"><summary>Paragraph references</summary>'+refs(p['eventRefs'])+'</details>' if p['eventRefs'] else '') for p in section['paragraphs'])
 def event(e):
  involved=' '.join(dict.fromkeys([e['role']]+([e['recipientRole']] if e.get('recipientRole') else [])))
  return f'''<details class="inventory-row event-row" id="event-{esc(e['id'])}" data-role="{esc(involved)}" data-phase="{esc(e['phase'])}"><summary><span class="row-code">{esc(e['id'])} · {when(e['at'])}</span><span class="row-title">{esc(e['title'])}</span><span class="row-role">{esc(role(e['role']))}</span></summary><div class="row-body"><dl><div><dt>Record</dt><dd>{esc(e['kind'])}</dd></div><div><dt>Origin</dt><dd>{esc(e['origin'])}</dd></div><div><dt>Role</dt><dd>{link('#role-'+e['role'],role(e['role']))}</dd></div>'''+(f'<div><dt>Recipient</dt><dd>{link("#role-"+e["recipientRole"],role(e["recipientRole"]))}</dd></div>' if e.get('recipientRole') else '')+f'''<div><dt>Evidence level</dt><dd>{esc(e['evidenceLevel'])}</dd></div><div><dt>Tasks</dt><dd>{refs(e['tasks'],'task') or 'No recorded task association'}</dd></div><div><dt>Public sources</dt><dd>{refs(e['sourceIds'],'source')}</dd></div></dl><p class="note">{esc(e['taskLinkBasis'])} Retained subjects are metadata, not acceptance.</p><p>{link('#event-'+e['id'],'Link to this event')}</p></div></details>'''
 def picture(mid,label,alt):
  m=next(m for m in media if m['id']==mid);src=m.get('thumbnail',m['src']);w,h=dimensions(PUBLIC/src)
  return f'<figure id="image-{mid}"><div class="figure-label">{esc(label)}</div><a href="{esc(m["src"])}" aria-label="{esc(label+": open full image")}"><img src="{esc(src)}" width="{w}" height="{h}" loading="lazy" decoding="async" alt="{esc(alt)}"></a><figcaption><p>{esc(m["caption"])}</p><p class="note">{esc(m["credit"])} · Public media {mid}</p>{link(m["src"],"Open full image")}</figcaption></figure>'
 def visuals(phase):
  if phase=='P04':return picture('M04','Proposal · REVISE','Three-panel proposal for a card exchange at an industrial checkpoint.')
  if phase=='P05':return '<div class="comparison">'+picture('M01','Before · pre-correction export · 14.65 s','LIMEN strikes at the doorway; the speech bubble overlaps the head.')+picture('M02','After · corrected C1 export · 14.65 s','The strike speech bubble is placed to the right of LIMEN’s head.')+'</div><p class="note">Two identified browser exports. This is scoped placement evidence, not a claim of pixel-identical framing or accepted grounding/contact.</p>'
  if phase=='P08':return picture('M03','Worker preview · max · REVISE','max in the default idle preview at 2.95 seconds, with arms held away from the body.')
  return ''
 cards='<aside class="status-cards" aria-label="State at the record cutoff">'+''.join(f'<article id="status-{esc(x["id"])}"><h3>{esc(x["title"])}</h3><p>{esc(x["text"])}</p>{refs(x["eventRefs"])}</article>' for x in c['statusCards'])+'</aside>'
 team='<details class="team-list" id="team"><summary>Team growth · all 15 native roster records</summary><p>'+esc(c['team']['note'])+'</p>'
 for r in c['team']['records']:
  team+=f'<article class="team-record" id="role-{r["id"]}"><p class="eyebrow">{r["id"]} · {"Archived record" if r["archivedAtExtraction"] else "Native roster record"}</p><h3>{esc(r["name"])}</h3><p>{esc(r["responsibility"])}</p><p>{esc(r["note"])}</p><ul>'+''.join(f'<li>{"Session started" if x["action"]=="started" else "Archived"} · {when(x["at"])} {refs([x["eventRef"]])}</li>' for x in r['lifecycle'])+'</ul></article>'
 team+='</details><aside class="bridge-note" id="role-external-bridge"><h3>'+esc(c['team']['externalBridge']['label'])+'</h3><p>'+esc(c['team']['externalBridge']['scope'])+'</p></aside>'
 team+='<details><summary>Other public role categories</summary>'+''.join(f'<p id="role-{rid}"><strong>{esc(role(rid))}</strong> · event category, not an additional native roster record.</p>' for rid in ['owner','harness','unassigned'])+'</details>'
 run='<section id="run" class="tab-panel" aria-label="How we run Loopforge">'
 for i,s in enumerate(x for x in c['sections'] if x['tab']=='run'):
  run+=f'<section class="essay" id="{s["id"]}"><h2>{esc(s["title"])}</h2>{paragraphs(s)}</section>'
  if i==0:run+='<p class="historical-link">'+link(c['historicalReview']['url'],c['historicalReview']['label'])+'<br><small>'+esc(c['historicalReview']['status'])+'</small></p>'
  if s['id']=='run-ownership':run+=team
 run+='</section>'
 phases=c['phases'];events=sorted(c['events'],key=lambda e:(e['at'],e['id']))
 toc='<details class="chapter-nav" open><summary>Nine chapters</summary><ol>'+''.join(f'<li>{link("#"+x["id"],x["id"]+" · "+x["title"])}</li>' for x in phases)+'</ol></details>'
 filters='<form id="filters" class="filters" hidden><div><label for="phase-filter">Inventory phase</label><select id="phase-filter"><option value="">All phases</option>'+''.join(f'<option value="{x["id"]}">{x["id"]} · {esc(x["title"])}</option>' for x in phases)+'</select></div><div><label for="role-filter">Role involved</label><select id="role-filter"><option value="">All roles</option>'+''.join(f'<option value="{esc(rid)}">{esc(rid+" · "+name)}</option>' for rid,name in roles.items())+'</select></div><button type="reset">Clear filters</button><p class="note">Filters affect inventories only. Essays and unresolved findings stay visible.</p><output id="filter-count" aria-live="polite">420 events · 65 tasks</output><p id="filter-empty" hidden>No matching inventory rows. Clear filters to see the complete record.</p></form>'
 history='<section id="history" class="tab-panel" aria-label="How we got here"><header class="essay"><p class="eyebrow">The retained record</p><h2>How we got here</h2><p>'+esc(c['readingNote'])+'</p></header>'+toc+filters
 for s in (x for x in c['sections'] if x['tab']=='history' and x['phase']):
  phase=s['phase'];rows=[e for e in events if e['phase']==phase]
  history+=f'<section class="chapter" id="{phase}"><header><p class="eyebrow">Chapter {phase[1:]}</p><h3>{esc(s["title"])}</h3></header><div class="essay">{paragraphs(s)}</div>'+visuals(phase)
  history+=f'<details class="phase-events" data-event-phase="{phase}"><summary>Evidence and handoffs · <span class="phase-count">{len(rows)}</span> events</summary><p class="note">Chronological metadata. Assignment, delivery and acceptance remain separate.</p>'
  for v in c['visualSlots']:
   if v['chapter']==phase:history+=f'<p class="note">{esc(v["title"])}: {esc(v["caption"])} {refs(v["eventRefs"])}</p>'
  history+=''.join(event(e) for e in rows)+'</details></section>'
 history+='<details id="tasks" class="task-inventory"><summary>Task inventory · all 65 assignments</summary><p>Extraction-time labels are not acceptance. Dated result summaries carry the outcome.</p>'
 for t in c['tasks']:
  history+=f'<details class="inventory-row task-row" id="task-{t["id"]}" data-role="{esc(t["assignedRole"])}" data-phase="{esc(" ".join(t["chapterRefs"]))}"><summary><span class="row-code">{esc(t["id"])}</span><span class="row-title">{esc(t["title"])}</span><span class="row-role">{esc(role(t["assignedRole"]))}</span></summary><div class="row-body"><dl><div><dt>Scope / assignment</dt><dd>{esc(t["title"])} · {when(t["createdAt"])}</dd></div><div><dt>Role</dt><dd>{link("#role-"+t["assignedRole"],role(t["assignedRole"]))}</dd></div><div><dt>Dated result</dt><dd>{esc(t["summary"])} {refs(t["summaryEventRefs"])}</dd></div><div><dt>Ledger label</dt><dd>{esc(t["ledgerStatusAtExtraction"])} <span class="ledger-note">Extraction-time label; see dated evidence.</span><p class="note">{esc(t["ledgerStatusCaveat"])}</p></dd></div><div><dt>Recorded associations</dt><dd>{refs(t["recordedEventRefs"])}<p class="note">{esc(t["linkBasis"])}</p></dd></div></dl>{link("#task-"+t["id"],"Link to this task")}</div></details>'
 history+='</details>'
 effort=c['effort'];s=next(s for s in c['sections'] if s['id']=='history-effort');history+='<section id="history-effort" class="essay"><h3>'+esc(s['title'])+'</h3>'+paragraphs(s)+'</section>'
 labels={'input':'Non-cached input','output':'Output','cache_read':'Cached input','cache_creation':'Cache creation'}
 def usage(fields):return '<dl class="usage-fields">'+''.join(f'<div><dt>{label}</dt><dd>{fields[key]:,}</dd></div>' for key,label in labels.items())+'</dl>'
 history+='<section id="usage"><h3>Native usage fields, kept separate</h3><p class="status-line">Dollar cost unknown · external bridge excluded</p><p>'+esc(effort['method'])+'</p>'+usage(effort['observedAdjacentDeltas'])+'<p>'+esc(effort['fieldOverlap'])+'</p><p>'+esc(effort['initialSnapshotCaveat'])+'</p><details><summary>Observed windows and initial counters by role</summary>'
 for r in sorted(effort['byRole'],key=lambda x:(x['firstObservedAt'],x['role'])):
  history+='<article class="usage-record"><h4>'+esc(r['role']+' · '+role(r['role']))+'</h4><p>'+when(r['firstObservedAt'])+' – '+when(r['lastObservedAt'])+f' · {r["snapshotCount"]} snapshots</p><h5>Initial counter, excluded from adjacent differences</h5>'+usage(r['initialCounter'])+'<h5>Observed adjacent differences</h5>'+usage(r['observedAdjacentDeltas'])+'<p class="note">'+esc(r['scope'])+' · Dollar cost unknown.</p></article>'
 history+='</details><p>'+esc(effort['pricingCaveat'])+'</p></section></section>'
 connections='<section id="connections"><h2>Recorded connections</h2><details id="reply-links"><summary>78 explicit reply links</summary><p>Direction follows the recorded from/to relation; not inferred chronology.</p><ol>'
 for i,edge in enumerate(c['eventLinks'],1):
  connections+=f'<li id="reply-{i:03}">{refs([edge["from"]])} → {refs([edge["to"]])} · {esc(edge["relationship"])} · {esc(edge["basis"])}</li>'
 connections+='</ol></details><details id="conversation-groups"><summary>95 recorded conversation groups</summary>'
 event_titles={e['id']:e['title'] for e in c['events']}
 for group in c['conversations']:
  connections+=f'<details id="conversation-{group["id"]}" class="conversation"><summary>{esc(group["id"])} · {len(group["events"])} events · {esc(event_titles[group["events"][0]])}</summary><p>{esc(group["relationship"])}</p>{refs(group["events"])}</details>'
 connections+='</details></section>'
 cov=c['sourceCoverage'];coverage='<section id="coverage"><h2>Source coverage and gaps</h2><p class="essay">'+esc(cov.get('publicPrivacyNote','Public history contains curated metadata, not raw private messages or source directories.'))+'</p><ul>'+''.join('<li>'+esc(g)+'</li>' for g in cov['gaps'])+'</ul><details><summary>Coverage counts and retained source catalogue</summary><dl class="coverage-counts">'+''.join(f'<div><dt>{label}</dt><dd>{cov[key]:,}</dd></div>' for key,label in [('substantiveTimelineEvents','Events'),('uniqueRetainedMessages','Deduplicated messages'),('taskRows','Tasks'),('agentRegistryRows','Registry records'),('logRowsThroughCutoff','Log rows'),('costSnapshots','Cumulative snapshots'),('gitCommitsThroughCutoff','Hive commits')])+'</dl><p>Public source IDs refer to curated metadata. Raw private records are not downloads.</p>'
 for src in c['sourceCatalog']:
  coverage+=f'<details class="source-record" id="source-{esc(src["id"])}"><summary>{esc(src["id"])} · {esc(src["kind"])}</summary><p>{esc(src["access"])}</p><p>{src["bytes"]:,} source bytes · SHA256 <code>{esc(src["sha256"])}</code></p></details>'
 coverage+='</details><p>'+link('page-content.json','Full public history data')+' · '+link('manuscript.md','Full history manuscript')+' · '+link('../statistics.html','Statistics and method')+'</p></section>'
 doc='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="A dated account of how the Loopforge studio works: ownership, proposals, review, failures and the evidence behind the game."><title>How we run Loopforge — Studio record</title><link rel="stylesheet" href="../styles.css"><script src="../history.js" defer></script></head><body><a class="skip" href="#main">Skip to the record</a><div class="shell"><header class="topbar"><a class="brand" href="https://www.fruitfulab.net/stepanoskin/loopforge">LOOPFORGE<small>STUDIO / FIELD RECORD</small></a><a href="#coverage">Sources &amp; gaps</a></header><nav class="blog-nav" aria-label="Dev blog"><a href="../index.html">All posts</a><a href="../posts/2026-10-22-what-i-mistook-for-progress/index.html">First post</a><a href="../interviews/index.html">Nine interviews</a><a href="../statistics.html">Statistics</a><a href="index.html" aria-current="page">Full history</a></nav><main id="main"><header class="hero"><p class="eyebrow">How a studio learns to make the scene work</p><h1>How we got here</h1><p class="cutoff">Record through <time datetime="2026-10-22T22:09:57.919591+00:00">22 October 2026, 22:09:57 UTC</time></p><p class="candidate">Paired candidate · final gallery, browser review and publication approval pending</p></header><nav class="tab-links" aria-label="Studio essays"><a href="#run" data-tab="run">How we run Loopforge</a><a href="#history" data-tab="history">How we got here</a></nav><noscript><p class="note">Both essays and all records are below. Expand evidence with the native disclosure controls; filtering is available with JavaScript enabled.</p></noscript>'''+cards+run+history+connections+coverage+'''</main><footer><p>LOOPFORGE · A dated record, with unfinished work left visible.</p><p>History I2 · Writer W1-R1 base / Producer extension · Publication held</p><a href="#main">Back to the top</a></footer></div></body></html>'''
 if final_publication:
  doc=re.sub(r'<p class="candidate">.*?</p>','',doc).replace(' · Publication held','')
 (SITE/'index.html').write_text(doc)

 return {'events':len(c['events']),'tasks':len(c['tasks']),'roles':len(c['team']['records']),'paragraphs':sum(len(s['paragraphs']) for s in c['sections'])}
if __name__=='__main__':print(json.dumps(generate()))
