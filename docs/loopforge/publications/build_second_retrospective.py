"""Build static readers from the selected, byte-preserved public manuscripts."""
from pathlib import Path
from html import escape
import re,json,hashlib,posixpath

HERE=Path(__file__).resolve().parent
# In the repository this lives in docs/loopforge/publications. The assembly
# supplies its isolated public root explicitly; no network or dependencies.
import argparse
parser=argparse.ArgumentParser();parser.add_argument('--public',type=Path,required=True)
public=parser.parse_args().public.resolve()
url='/loopforge-dev-blog/retrospectives/2026-10-25-second-retrospective'
root=public/url.lstrip('/');source=root/'source'
roles=['engine','level','animator','director','systems','writer','visual','3d','critic']
labels=['Engine Master','Level Designer','Animator','Scene Director','Systems Designer','Writer','Visual Artist','3D Artist','Critic']
readers={'producer-reflection.md':'index.html','interview-overview.md':'interviews/index.html','statistics.md':'statistics.html','root-account.md':'root-account.html','independent-assessment.md':'independent-assessment.html','provenance-clarification.md':'provenance-clarification.html',**{f'interviews/{r}.md':f'interviews/{r}.html' for r in roles}}
checks=[]
def href(raw,doc):
 if raw.startswith(('https://','http://','/','#','mailto:')):return raw
 path,sep,anchor=raw.partition('#')
 key=posixpath.normpath(posixpath.join(posixpath.dirname(doc),path))
 return url+'/'+readers.get(key,'source/'+key)+(sep+anchor if sep else '')
def inline(text,doc):
 # Tokenize before escaping so author prose cannot inject HTML.
 pattern=r'`([^`]+)`|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*'
 parts=[];end=0
 for m in re.finditer(pattern,text):
  parts.append(escape(text[end:m.start()]));end=m.end()
  if m[1] is not None:parts.append('<code>'+escape(m[1])+'</code>')
  elif m[2] is not None:parts.append('<a href="'+escape(href(m[3],doc),quote=True)+'">'+escape(m[2])+'</a>')
  elif m[4] is not None:parts.append('<strong>'+escape(m[4])+'</strong>')
  else:parts.append('<em>'+escape(m[5])+'</em>')
 parts.append(escape(text[end:]));return ''.join(parts)
def render(text,doc):
 blocks=re.split(r'\n\s*\n',text.strip());out=[];toc=[];seen=set();i=0
 while i<len(blocks):
  b=blocks[i];i+=1
  if b.startswith('#'):
   m=re.fullmatch(r'(#{1,6}) (.+)',b);assert m,(doc,b)
   level=len(m[1]);label=m[2];ident=re.sub(r'[^a-z0-9]+','-',label.lower()).strip('-')
   if re.match(r'Q[1-7](?:\b|\s)',label):ident=label[:2].lower()
   assert ident not in seen,(doc,ident);seen.add(ident)
   out.append(f'<h{level} id="{ident}">{inline(label,doc)}</h{level}>')
   if level==2:toc.append((ident,label))
  elif b.startswith('!['):
   m=re.fullmatch(r'!\[([^\]]*)\]\(([^)]+)\)',b);assert m,(doc,b)
   image=source/posixpath.normpath(posixpath.join(posixpath.dirname(doc),m[2]));raw=image.read_bytes();assert raw[:8]==b'\x89PNG\r\n\x1a\n'
   w,h=int.from_bytes(raw[16:20],'big'),int.from_bytes(raw[20:24],'big')
   caption=blocks[i];assert caption.startswith('*') and caption.endswith('*');i+=1
   u=escape(href(m[2],doc),quote=True)
   out.append(f'<figure style="max-width:{w}px"><a href="{u}"><img src="{u}" width="{w}" height="{h}" alt="{escape(m[1],quote=True)}" loading="lazy" decoding="async"></a><figcaption>'+inline(caption[1:-1],doc)+'</figcaption></figure>')
  elif b.startswith('|'):
   rows=[[c.strip() for c in line.strip().strip('|').split('|')] for line in b.splitlines()]
   assert len(rows)>=3 and all(re.fullmatch(r':?-+:?',x) for x in rows[1]),(doc,b)
   out.append('<div class="table-scroll" role="region" aria-label="'+escape(rows[0][0],quote=True)+'" tabindex="0"><table><thead><tr>'+''.join('<th scope="col">'+inline(x,doc)+'</th>' for x in rows[0])+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+inline(x,doc)+'</td>' for x in row)+'</tr>' for row in rows[2:])+'</tbody></table></div>')
  elif b.startswith('- '):
   lines=b.splitlines();assert all(x.startswith('- ') for x in lines),(doc,b)
   out.append('<ul>'+''.join('<li>'+inline(x[2:],doc)+'</li>' for x in lines)+'</ul>')
  else:
   assert not b.startswith(('```','>','<')),(doc,b)
   out.append('<p>'+inline(b,doc)+'</p>')
  checks.append({'source':doc,'block':i,'consumed':True})
 return ''.join(out),toc
nav=[('index.html','Producer reflection'),('root-account.html','Root account'),('independent-assessment.html','Independent assessment'),('provenance-clarification.html','Provenance clarification'),('interviews/index.html','Nine interviews'),('statistics.html','Cycle statistics')]
css='''
.reader{max-width:76ch;margin:48px auto}.reader h1{font-size:clamp(36px,6vw,64px)}.reader h2{font-size:clamp(26px,3vw,36px);margin-top:2em}.reader p,.reader li{color:var(--muted)}.reader figure{margin:32px auto}.reader figcaption{color:var(--muted)}.reader img{object-fit:contain}.reader blockquote{margin:24px 0;padding-left:20px;border-left:2px solid var(--gold)}.reader-nav{display:flex;flex-wrap:wrap;gap:4px 20px;border-bottom:1px solid var(--line);padding:12px 0}.reader-nav a{display:flex;align-items:center;min-height:44px}.reader-nav a[aria-current]{font-weight:bold;color:var(--ink)}.contents{margin:24px 0;padding:18px;border:1px solid var(--line)}.contents ol{padding-left:24px}.contents a{display:inline-flex;align-items:center;min-height:44px}.table-scroll{max-width:100%;overflow-x:auto;margin:26px 0}.table-scroll table{border-collapse:collapse;min-width:100%;font-size:14px}.table-scroll th,.table-scroll td{text-align:left;vertical-align:top;border-bottom:1px solid var(--line);padding:10px 14px;min-width:6ch}.table-scroll td:first-child{min-width:12ch}.manuscript{margin-top:40px;border-top:1px solid var(--line);padding-top:20px}.interview-links{display:flex;flex-wrap:wrap;gap:4px 20px}.interview-links a{display:flex;align-items:center;min-height:44px} @media(max-width:600px){.reader{margin-top:28px}.table-scroll{font-size:13px}.reader-nav{gap:0 14px}.topbar{gap:12px}.reader h1{overflow-wrap:anywhere}} @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
'''
(root/'reader.css').write_text(css)
for doc,target in readers.items():
 text=(source/doc).read_text();title=text.splitlines()[0][2:];body,toc=render(text,doc)
 author='Root coordinator' if doc in ['root-account.md','provenance-clarification.md'] else 'Separate independent agentic-systems critic' if doc=='independent-assessment.md' else 'Producer' if doc in ['producer-reflection.md','interview-overview.md','statistics.md'] else labels[roles.index(Path(doc).stem)]
 navigation=''.join('<a href="'+url+'/'+path+'"'+(' aria-current="page"' if path==target else '')+'>'+label+'</a>' for path,label in nav)
 contents='<nav class="contents" aria-label="On this page"><ol>'+''.join('<li><a href="#'+i+'">'+escape(t)+'</a></li>' for i,t in toc)+'</ol></nav>' if toc else ''
 interview_links='<nav class="interview-links" aria-label="Craft interviews">'+''.join('<a href="'+url+'/interviews/'+r+'.html">'+label+'</a>' for r,label in zip(roles,labels))+'</nav>'
 # The full authored H1 remains in body. Contents and role navigation are separate controls.
 intro='<p class="eyebrow">25 October 2026 · Second retrospective · '+escape(author)+'</p>'
 related='<p class="note"><a href="'+url+'/provenance-clarification.html">Read Root’s provenance clarification</a></p>' if doc in ['producer-reflection.md','root-account.md','statistics.md','independent-assessment.md'] else ''
 page='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>'+escape(title)+' — Loopforge</title><link rel="stylesheet" href="/loopforge-dev-blog/styles.css"><link rel="stylesheet" href="'+url+'/reader.css"></head><body><a class="skip" href="#main">Skip to content</a><div class="shell"><header class="topbar"><a class="brand" href="/loopforge-dev-blog/index.html">LOOPFORGE<small>DEV BLOG / SECOND RETROSPECTIVE</small></a><a href="/stepanoskin/loopforge">The project ↗</a></header><nav class="reader-nav" aria-label="Second retrospective">'+navigation+'</nav><nav class="reader-nav" aria-label="Project links"><a href="/loopforge-dev-blog/posts/2026-10-25-day-one-reaches-night/index.html">Day 1 reaches night</a><a href="/stepanoskin/loopforge/play/scene-studies">Play Day 1</a><a href="/stepanoskin/loopforge/design">Game design</a><a href="/loopforge-dev-blog/retrospectives/2026-10-22-first-retrospective/index.html">First retrospective</a></nav><main id="main" class="reader">'+intro+contents+('<div>'+interview_links+'</div>' if doc.startswith('interviews/') or doc=='interview-overview.md' else '')+'<article>'+body+'</article>'+related+'<p class="manuscript"><a href="'+url+'/source/'+doc+'">Read the original Markdown</a>'+(' · <a href="'+url+'/source/statistics.json">Statistics JSON</a>' if doc=='statistics.md' else '')+'</p></main><footer><a href="#main">Back to top</a> · <a href="/loopforge-dev-blog/index.html">All development posts</a></footer></div></body></html>'
 if doc in ['independent-assessment.md','provenance-clarification.md']:
  page=page.replace('href="'+url+'/source/'+doc+'">Read the original Markdown', 'href="'+url+'/source/'+doc+'" download>Download the original Markdown')
 dest=root/target;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(page)
 if doc.startswith('interviews/'):
  assert [i for i,_ in toc]==['q'+str(i) for i in range(1,8)],doc
print(json.dumps({'readers':len(readers),'interviews':len(roles),'questions':63,'consumedBlocks':len(checks),'externalAssessment':'Exact selected independent assessment and separate Root provenance clarification included'}))
