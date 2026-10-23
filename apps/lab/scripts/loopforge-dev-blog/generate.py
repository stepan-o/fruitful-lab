#!/usr/bin/env python3
from pathlib import Path
import json,html,re,hashlib,shutil
from urllib.parse import urlsplit
import history_source,paired_source,retrospective_source
P=Path(__file__).resolve().parent;SITE=P.parents[1]/'public/loopforge-dev-blog';INPUT=P/'public-inputs';FINAL=False
def esc(s):return html.escape(str(s),quote=True)
def amendments():
 f=P/'content/amendments.json'
 return json.loads(f.read_text())['overrides'] if f.exists() else {}
def approved_manifest():
 m=json.loads((P/'inputs/publicManifest.json').read_text())
 for rel,item in amendments().items():
  assert rel in ('statistics.md','statistics.json') and rel in m['files']
  m['files'][rel]={'sha256':item['sha256'],'bytes':item['bytes']}
 for rel,item in additions().items():
  assert rel not in m['files']
  m['files'][rel]={'sha256':item['sha256'],'bytes':item['bytes']}
 return m
def additions():
 f=P/'content/additions.json'
 return json.loads(f.read_text())['files'] if f.exists() else {}
def source(rel):
 item=amendments().get(rel) or additions().get(rel)
 return P/item['source'] if item else INPUT/rel
def studio_gallery():
 config=json.loads((P/'content/gallery.json').read_text());out='<section id="studio-gallery"><h2>The studio in Munder</h2><p>Two owner-supplied documentary views. Classic speech bubbles are interface decoration, not interview testimony.</p><div class="studio-gallery">'
 for item in config['images']:
  filename=item['targetFilename'];assert re.fullmatch(r'studio-(pro|classic)\.png',filename)
  asset=SITE/'media'/filename;available=asset.exists();out+='<figure><p class="figure-label">'+esc(item['view'])+' view</p>'
  if available:
   assert not asset.is_symlink();data=asset.read_bytes();assert len(data)==item['bytes'] and hashlib.sha256(data).hexdigest()==item['sha256']
   assert history_source.dimensions(asset)==(item['width'],item['height'])
   dst=SITE/'media'/filename;dst.parent.mkdir(exist_ok=True);dst.write_bytes(data)
   out+='<a href="media/'+filename+'"><img src="media/'+filename+'" width="'+str(item['width'])+'" height="'+str(item['height'])+'" alt="'+esc(item['alt'])+'" loading="lazy" decoding="async"></a>'
  else:
   if FINAL:raise ValueError('Final publication requires both exact owner images')
   out+='<div class="gallery-pending" role="note"><strong>'+esc(item['view'])+' screenshot reserved</strong><span>Exact owner image pending final integration.</span></div>'
  out+='<figcaption>'+('' if available else '<span class="note">Reserved caption: </span>')+esc(item['caption'])+'</figcaption></figure>'
 return out+'</div>'+paired_source.credits()+'</section>'

def inline(text,link_prefix=''):
 pattern=r'\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*\n]+)\*'
 out=[];last=0
 for m in re.finditer(pattern,text):
  out.append(esc(text[last:m.start()]));last=m.end()
  if m.group(1):
   url=m.group(2);assert urlsplit(url).scheme in ('','https') and not url.startswith(('//','\\')),'Unsafe source link'
   if url.startswith('#interview-'):url=link_prefix+url
   out.append(f'<a href="{esc(url)}">{esc(m.group(1))}</a>')
  elif m.group(3):out.append('<code>'+esc(m.group(3))+'</code>')
  elif m.group(4):out.append('<strong>'+esc(m.group(4))+'</strong>')
  else:out.append('<em>'+esc(m.group(5))+'</em>')
 out.append(esc(text[last:]));return ''.join(out)
def markdown(source,link_prefix=''):
 lines=source.splitlines();i=0;out=[];heading=0
 while i<len(lines):
  line=lines[i].strip()
  if not line:i+=1;continue
  h=re.match(r'^(#{1,6}) (.*)',line)
  if h:
   heading+=1;level=len(h[1]);out.append(f'<h{level} id="section-{heading}">{inline(h[2],link_prefix)}</h{level}>');i+=1;continue
  if line.startswith('|'):
   rows=[]
   while i<len(lines) and lines[i].strip().startswith('|'):
    cells=[x.strip() for x in lines[i].strip().strip('|').split('|')];i+=1
    if all(re.fullmatch(r':?-+:?',x) for x in cells):continue
    rows.append(cells)
   assert len({len(x) for x in rows})==1
   table='<div class="table-scroll" tabindex="0" role="region" aria-label="Scrollable data table"><table><thead><tr>'+''.join('<th scope="col">'+inline(x,link_prefix)+'</th>' for x in rows[0])+'</tr></thead><tbody>'
   for row in rows[1:]:table+='<tr>'+''.join('<td>'+inline(x,link_prefix)+'</td>' for x in row)+'</tr>'
   out.append(table+'</tbody></table></div>');continue
  if line.startswith(('- ','* ')):
   items=[]
   while i<len(lines) and lines[i].strip().startswith(('- ','* ')):
    items.append('<li>'+inline(lines[i].strip()[2:],link_prefix)+'</li>');i+=1
   out.append('<ul>'+''.join(items)+'</ul>');continue
  block=[line];i+=1
  while i<len(lines) and lines[i].strip() and not re.match(r'^(#{1,6} |\||[-*] )',lines[i].strip()):block.append(lines[i].strip());i+=1
  out.append('<p>'+inline(' '.join(block),link_prefix)+'</p>')
 return '\n'.join(out)
def clean_shell(doc):
 return re.sub(r'<p class="candidate">.*?</p>','',doc) if FINAL else doc
def nav(prefix,current):
 links=[('index.html','All posts'),('posts/2026-10-22-what-i-mistook-for-progress/index.html','First post'),('posts/2026-10-22-a-studio-needs-a-shorter-path/index.html','Independent assessment'),('history/index.html#history','Full history'),('interviews/index.html','Nine interviews'),('statistics.html','Statistics')]
 return '<nav class="blog-nav" aria-label="Dev blog">'+''.join(f'<a href="{prefix+u}"'+(' aria-current="page"' if label==current else '')+'>'+label+'</a>' for u,label in links)+'</nav>'
def shell(title,body,prefix='',current=''):
 if FINAL:
  body=body.replace('Final gallery, browser review and combined publication remain pending.','').replace('Both frozen articles are presented together; final package review and publication approval remain open.','Both frozen articles are presented together.')
 return clean_shell('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Loopforge dev blog: first-person production reflections, craft interviews and the retained studio record."><title>'+esc(title)+' — Loopforge dev blog</title><link rel="stylesheet" href="'+prefix+'styles.css"><script src="'+prefix+'reveal.js" defer></script></head><body><a class="skip" href="#main">Skip to content</a><div class="shell"><header class="topbar"><a class="brand" href="'+prefix+'index.html">LOOPFORGE<small>DEV BLOG / FIELD NOTES</small></a><a href="https://www.fruitfulab.net/stepanoskin/loopforge">The project ↗</a></header>'+nav(prefix,current)+'<main id="main"><p class="candidate">Paired review candidate · final gallery, browser review and publication approval pending</p>'+body+'</main><footer><p>Loopforge dev blog · retained work, unresolved outcomes and first-person accounts.</p><a href="#main">Back to top</a></footer></div></body></html>')
def write(rel,text):
 f=SITE/rel;f.parent.mkdir(parents=True,exist_ok=True);f.write_text(text)
def generate(final_publication=False):
 global FINAL;FINAL=final_publication
 manifest=approved_manifest();SITE.mkdir(parents=True,exist_ok=True);history_source.SITE=SITE/'history'
 for rel,r in manifest['files'].items():
  assert '..' not in Path(rel).parts and not Path(rel).is_absolute();b=source(rel).read_bytes();assert hashlib.sha256(b).hexdigest()==r['sha256'];dst=SITE/rel;dst.parent.mkdir(parents=True,exist_ok=True);dst.write_bytes(b)
 posts=json.loads((P/'content/posts.json').read_text())['posts'];cards='';seen=set()
 for post_ref in posts:
  assert post_ref['metadata'] in manifest['files'],'Unapproved post metadata'
  meta=json.loads(source(post_ref['metadata']).read_text());assert meta['body'] in manifest['files'],'Unapproved post body';slug=meta['slug'];assert re.fullmatch(r'\d{4}-\d{2}-\d{2}-[a-z0-9-]+',slug)
  assert slug not in seen,'Duplicate permanent post slug';seen.add(slug)
  title=meta['title'];body=markdown(source(meta['body']).read_text(),'../../interviews/index.html')
  assessment=meta.get('kind')=='independent-assessment'
  if assessment:
   body=paired_source.cite(body).replace('<p>The usage figures make coordination itself impossible to overlook:', '<p id="assessment-usage">The usage figures make coordination itself impossible to overlook:')
  content='<article class="prose post-body">'+body+'</article>'
  other=paired_source.FIRST if assessment else paired_source.A
  other_label='Producer reflection' if assessment else 'Independent systems assessment'
  content+='<aside class="assessment"><h2>Read the other account</h2><p><a href="../'+other+'/index.html">'+other_label+'</a></p><p>Separate authorship and judgment. Both frozen articles are presented together; final package review and publication approval remain open.</p></aside>'
  content+='<p><a href="../../'+esc(meta['body'])+'">Exact frozen manuscript</a> · <a href="../../interviews/index.html">All nine interviews</a> · <a href="../../statistics.html">Counted appendix</a> · <a href="../../history/index.html#history">Full history</a></p>'
  if assessment:content+=paired_source.legend()
  write('posts/'+slug+'/index.html',shell(title,content,'../../','Independent assessment' if assessment else 'First post'))
  cards+='<article class="post-card"><p class="eyebrow"><time datetime="'+esc(meta['date'])+'">'+esc(meta['date'])+'</time> · '+esc(meta['author'])+' · '+esc(meta['authorKind'])+'</p><h2><a href="posts/'+slug+'/index.html">'+esc(title)+'</a></h2><p>'+esc(meta['summary'])+'</p><a class="read-link" href="posts/'+slug+'/index.html">Read the post →</a></article>'
 cards=retrospective_source.index_card()+cards
 index='<header class="hero"><p class="eyebrow">Notes from inside the studio</p><h1>Loopforge<br>dev blog</h1><p class="lede">First-person accounts of the work, with the interviews and retained record alongside them.</p></header>'+cards+'<aside class="assessment"><h2>Two accounts, separate authors</h2><p>The Producer reflection and the independent Codex systems assessment are both frozen. The assessment was written in a separate session outside Munder after the reflection. Final gallery, browser review and combined publication remain pending.</p></aside><section class="blog-resources"><h2>Read the supporting record</h2><p><a href="interviews/index.html">Nine interviews, 54 answers</a> · <a href="statistics.html">Statistics and accounting</a> · <a href="history/index.html#history">420 events across nine phases</a></p><p>The opening goal was dropped unfinished. This blog is a separate deliverable.</p></section>'
 write('index.html',shell('Dev blog',index+studio_gallery(),current='All posts'))
 interviews=json.loads((INPUT/'interviews.json').read_text());ib='<header class="hero"><p class="eyebrow">Asked by Producer · nine crafts</p><h1>The interviews</h1><p>Full testimony, separate from the selected quotations in the Producer post. These are craft interviews, not an independent systems assessment.</p></header><nav class="craft-nav" aria-label="Interview crafts">'+''.join('<a href="#'+x['interviewId']+'">'+esc(x['craft'])+'</a>' for x in interviews['interviews'])+'</nav>'
 for person in interviews['interviews']:
  qs={q['id']:q['text'] for q in person['questions']}
  ib+='<section class="interview" id="'+person['interviewId']+'"><header><p class="eyebrow">'+esc(person['interviewId'])+'</p><h2>'+esc(person['craft'])+'</h2><p>By '+esc(person['author'])+' · interviewed by '+esc(person['interviewer'])+'</p><p class="note">Recorded answer interval: '+esc(person['actualStart'])+' – '+esc(person['actualEnd'])+'</p></header>'
  for answer in person['answers']:
   ib+='<details class="answer" id="'+answer['anchor']+'"><summary>'+esc(answer['questionId'])+' · '+esc(qs[answer['questionId']])+'</summary><div class="answer-prose prose">'+''.join('<p>'+esc(x)+'</p>' for x in answer['answer'].split('\n\n'))+'</div><p class="note">'+esc(answer['change'])+'</p><a href="#'+answer['anchor']+'">Link to this answer</a></details>'
  ib+='<p class="note">'+esc(person['scope'])+'</p></section>'
 ib+='<p><a href="../interviews.json">Full public interview data</a></p>';write('interviews/index.html',shell('Nine craft interviews',ib,'../','Nine interviews'))
 stats=markdown(source('statistics.md').read_text());write('statistics.html',shell('Statistics and accounting','<article class="prose statistics">'+stats+'</article><p><a href="statistics.json">Public statistics data and initial counters</a></p>',current='Statistics'))
 history_source.generate(final_publication=FINAL)
 for n in ['styles.css','history.js','reveal.js']:shutil.copyfile(P/'src'/n,SITE/n)
 retrospective_source.generate(P,SITE,markdown,shell,esc)
 return {'publicInputs':len(manifest['files']),'posts':len(posts),'interviews':len(interviews['interviews']),'answers':sum(len(x['answers']) for x in interviews['interviews'])}
if __name__=='__main__':
 import argparse
 a=argparse.ArgumentParser();a.add_argument('--final-publication',action='store_true');args=a.parse_args();print(json.dumps(generate(args.final_publication)))
