"""Render the first frozen team retrospective using the blog's existing presentation."""
from pathlib import Path
import json,re,shutil
SLUG='retrospectives/2026-10-22-first-retrospective'
def index_card():
 return '<article class="post-card"><p class="eyebrow"><time datetime="2026-10-22">2026-10-22</time> · Loopforge Studio team · synthesized by Producer</p><h2><a href="'+SLUG+'/index.html">First retrospective</a></h2><p>Nine fresh craft contributions, 36 answers and Producer’s synthesis: disagreements, domain criteria and three priorities for the next authorized cycle.</p><a class="read-link" href="'+SLUG+'/index.html">Read the retrospective →</a></article>'
def generate(P,SITE,markdown,shell,esc):
 root=P/'public-inputs'/SLUG/'data'
 read=lambda name:json.loads((root/name).read_text())
 data=read('contributions.json');facts=read('milestone-facts.json');part=read('participation.json')
 def md(text,prefix):return re.sub(r'id="section-(\d+)"',lambda m:'id="'+prefix+'-'+m[1]+'"',markdown(text))
 def value(x):return 'Unknown' if x is None else str(x)
 def pair(label,v):return '<div><dt>'+esc(label)+'</dt><dd>'+esc(value(v))+'</dd></div>'
 links=[('summary-2','Findings'),('summary-3','Discussion'),('summary-4','Domain criteria'),('summary-5','Three priorities'),('contributions','Full contributions'),('participation','Participation')]
 body='<div class="retrospective-page"><nav class="craft-nav" aria-label="Retrospective sections">'+''.join('<a href="#'+a+'">'+b+'</a>' for a,b in links)+'</nav><p class="cutoff">Factual cutoff: <time datetime="'+esc(facts['cutoff'])+'">'+esc(facts['cutoff'])+'</time></p>'
 narrative=md((root/'retrospective.md').read_text(),'summary')
 fact='<aside class="milestone-record" id="milestone-state"><h3>Milestone state at this review</h3><p>'+esc(facts['candidate'])+'</p><dl>'+pair('Game',facts['game'])+pair('Root validation receipt',facts['rootValidationReceiptAt'])
 tests=facts['rootReportedTests'];fact+=pair('Root-reported suites / tests / snapshots',str(tests['suites'])+' / '+str(tests['tests'])+' / '+str(tests['snapshots']))+pair('Reported test result',tests['result'])+pair('Asset checks / asset-pipeline test',tests['assetChecks']+' / '+tests['assetPipelineTest'])
 for label,key in [('Project copied files','projectCopiedFiles'),('Project copied bytes','projectCopiedBytes'),('Initial studio archive files','initialStudioArchiveFiles'),('Initial studio archive bytes','initialStudioArchiveBytes'),('Local intermediate files','localIntermediateFiles'),('Local intermediate bytes','localIntermediateBytes')]:fact+=pair(label,facts[key])
 fact+='</dl><p class="note">'+esc(facts['limits'])+'</p><a href="data/milestone-facts.json">Exact milestone facts</a></aside>'
 narrative=narrative.replace('<h2 id="summary-3">',fact+'<h2 id="summary-3">',1)
 body+='<article class="prose retrospective-narrative">'+narrative+'</article><section id="contributions"><h2>All nine fresh contributions</h2><p>Each question opens its complete answer. Source groups and direct answer links remain available without JavaScript.</p><nav class="craft-nav" aria-label="Contributors">'+''.join('<a href="#'+esc(c['anchor'])+'">'+esc(c['role'])+'</a>' for c in data['contributors'])+'<a href="#'+esc(data['producer']['anchor'])+'">Producer</a></nav>'
 for c in data['contributors']:
  body+='<section class="interview" id="'+esc(c['anchor'])+'"><header><h3>'+esc(c['role'])+'</h3><p><a href="data/'+esc(c['sourceMarkdown'])+'">Exact published contribution</a></p></header>'
  for a in c['answers']:
   body+='<details class="answer" id="'+esc(a['anchor'])+'"><summary>'+esc(a['id']+' · '+a['question'])+'</summary><div class="answer-prose prose">'+md(a['markdown'],a['anchor']+'-heading')+'</div><a href="#'+esc(a['anchor'])+'">Link to this answer</a></details>'
  body+='<aside class="retro-sources" id="'+esc(c['sourcesAnchor'])+'"><h4>'+esc(c['role'])+' sources</h4><ul>'+''.join('<li><a href="'+esc(x['href'])+'">'+esc(x['label']+' · '+x['title'])+'</a></li>' for x in c['sources'])+'</ul></aside></section>'
 producer=data['producer'];pb=md(producer['markdown'],'producer');pb=pb.replace('<h1 ','<h2 ').replace('</h1>','</h2>')
 body+='</section><section id="'+esc(producer['anchor'])+'" class="prose interview">'+pb+'<p class="note">'+esc(producer['authorship'])+'</p><a href="data/producer-contribution.md">Exact Producer contribution</a></section>'
 body+='<section id="participation"><h2>Participation observations</h2><p>Nine contributions · 36 answers · seven peer responses · at most two craft assignments active.</p><p>Per contribution: '+str(part['perContributionLimit']['activeMinutes'])+' active minutes; '+str(part['perContributionLimit']['additionalCachedInclusiveTokens'])+' cached-inclusive tokens; checkpoint '+str(part['perContributionLimit']['checkpointAdditionalTokens'])+'.</p><p class="note">'+esc(part['limits'])+'</p><div class="participation-grid">'
 for row in part['rows']:
  body+='<article class="participation-record"><h3>'+esc(row['role'])+'</h3><dl>'
  for label,key in [('Start UTC','startUtc'),('Answer finalized UTC','answerFinalizedUtc'),('Contribution wall interval (seconds)','wallIntervalSeconds'),('Observed tokens before closeout','observedAdditionalCachedInclusiveTokensBeforeCloseout'),('Exact final task tokens','exactFinalTaskTokens')]:body+=pair(label,row[key])
  body+='</dl><p class="note">'+esc(row['tokenNote'])+'</p></article>'
 body+='</div><dl class="retro-totals">'+pair('Exact total retrospective tokens',part['exactTotalRetrospectiveTokens'])+pair('Billed cost',part['billedCost'])+'</dl><p><a href="data/participation.json">Exact participation observations</a> · <a href="data/contributions.json">Full contribution data</a> · <a href="data/retrospective.md">Exact synthesis manuscript</a></p></section></div>'
 html=shell('First retrospective',body,'../../')
 html=html.replace('</head>','<link rel="stylesheet" href="retrospective.css"></head>')
 out=SITE/SLUG;out.mkdir(parents=True,exist_ok=True);(out/'index.html').write_text(html);shutil.copyfile(P/'src/retrospective.css',out/'retrospective.css')
 return {'contributors':len(data['contributors']),'answers':sum(len(c['answers']) for c in data['contributors'])}
