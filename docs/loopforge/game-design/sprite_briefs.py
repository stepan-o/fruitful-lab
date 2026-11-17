"""Publish the Day 1 sprite commission, downloadable handoff and measured bindings."""
from pathlib import Path
import hashlib, html, json, subprocess, zipfile
from narrative import render

E=html.escape
ROOT=Path(__file__).resolve().parent
SOURCE=ROOT.parent/'production/sprite-briefs'

def encoded(data):
    return (json.dumps(data,ensure_ascii=False,indent=2)+'\n').encode()

def table(headers,rows):
    return '<div class="sb-table"><table><thead><tr>'+''.join('<th scope="col">'+E(h)+'</th>' for h in headers)+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+E(str(c))+'</td>' for c in row)+'</tr>' for row in rows)+'</tbody></table></div>'

def asset_markdown(a, common):
    lines=['# '+a['name']+' — '+a['id'],'',a['brief'],'']
    for label,key in [('Group','group'),('Delivery priority','priority'),('Quantity','quantity'),('Parts and source layers','parts'),('States and variants','states'),('Assembly and sockets','assembly'),('Acceptance','accept')]:
        lines += ['## '+label,'',a[key],'']
    for title,clips in [('Common animation coverage',common if a['group']=='Characters' else []),('Bespoke animation coverage',a['clips'])]:
        if clips:
            lines += ['## '+title,'','| Clip | Coverage | Performance |','| --- | --- | --- |']
            lines += ['| '+' | '.join(row)+' |' for row in clips]
            lines += ['']
    lines += ['## Delivery contract','','Read HANDOFF.md and manifest.template.json in the complete pack. Status: briefed; this document does not contain finished sprite art.','']
    lines += ['- ['+r['label']+']('+r['url']+')' for r in a['references']]
    return '\n'.join(lines).rstrip()+'\n'

def build_sprite_briefs(out):
    data=json.loads((SOURCE/'briefs.json').read_text())
    assets=data['assets']; ids={a['id'] for a in assets}
    assert len(ids)==len(assets)
    cast_art=json.loads((ROOT/'cast-art.json').read_text())
    portraits={a['id']:a for a in cast_art['portraits']}
    common=data['commonClips']
    # Execute the same canonical score used by the rehearsal; do not retype coordinates.
    code='''import fs from 'node:fs';
import {makeSequence} from './day-one-sequence.mjs';
import {makeBuildMarkers} from './day-one-build-markers.mjs';
const floor=JSON.parse(fs.readFileSync('./day-one-geometry.json','utf8'));
const text=fs.readFileSync('../DAY_ONE_INTRO.md','utf8');
const dialogue=[...text.matchAll(/^\\*\\*(\\w+)\\*\\*\\s+(.+)$/gm)].map(m=>({speaker:m[1],text:m[2]}));
const score=makeSequence(floor,dialogue);
console.log(JSON.stringify({floor,markers:makeBuildMarkers(floor,score),actors:Object.keys(score.cast),duration:score.duration,exitPace:score.exitPace,dialogueCount:dialogue.length}));'''
    measured=json.loads(subprocess.check_output(['node','--input-type=module','-e',code],cwd=ROOT,text=True))
    mapping={
      'S1':'sec-rails','S2':'sec-rails','S3':'sec-desks','S4':'sec-drain','S5':'sec-desks','S6':'sec-boom',
      'S7':'env-wayfinding','S8':'env-wayfinding','S9':'fx-blade','S10':'prop-credential','S11':'env-floor-kit',
      'C1':'mach-intake','C2':'mach-wash','C3':'mach-belt','C4':'mach-forge','C5':'mach-output',
      'H1':'hall-stillages','H2':'hall-accumulator','H3':'hall-transfer','H4':'hall-drive-shop','H5':'hall-tooling','H6':'hall-water','H7':'hall-return','H8':'hall-crane','H9':'env-floor-kit',
      'E1':'env-yard-entrance','E2':'env-yard-entrance'}
    assert set(mapping)=={m['id'] for m in measured['markers']}
    assert set(mapping.values())<=ids
    active={'lobby-dispatch','dispatch-security','security-conveyor','dispatch-conveyor'}
    bindings={'schemaVersion':1,'status':'proposed-bindings-not-runtime-delivery','revision':data['revision'],
        'coordinates':{'unit':'metres','x':'east','y':'south','sourcePixelsPerMetre':64},
        'actors':[{'entityId':c,'assetId':'char-'+c.lower()} for c in measured['actors']],
        'buildMarkers':[{**m,'assetId':mapping[m['id']]} for m in measured['markers']],
        'fixtures':[{**f,'assetId':{'register':'sec-desks','checks':'sec-desks','grate':'sec-drain','west-rail':'sec-rails','east-rail':'sec-rails','intake':'mach-intake','wash':'mach-wash','belt':'mach-belt','forge':'mach-forge','output':'mach-output'}[f['id']]} for f in measured['floor']['fixtures']],
        'portals':[{**p,'assetId':'env-wall-portal-kit','initialAccess':'controlled' if p['id']=='security-conveyor' else 'open' if p['id'] in active else 'locked'} for p in measured['floor']['portals']],
        'floor':measured['floor'],
        'regression':{k:measured[k] for k in ['duration','exitPace','dialogueCount']}}
    template={'schemaVersion':1,'status':'template-not-delivered','assetId':'char-bob','revision':None,
      'files':[],'dependencies':['prop-credential'],
      'sprite':{'sourceSize':[256,256],'pivotPx':[128,208],'trimRect':None,'sortAnchorPx':[128,208],'groundFootprintMetres':None,'layer':'actor','sockets':{}},
      'clips':[{'id':'walk','facing':'NE','frames':[],'loopRange':None,'entryFrame':None,'holdFrame':None,'exitFrame':None,'compatibleNext':['idle','hurry','start-stop'],'interruptPolicy':'plant-foot-before-stop','markers':[]}],
      'requiredFileFields':['path','sha256','bytes','width','height'],
      'requiredFrameFields':['fileIndex','atlasRect','sourceSize','trimRect','pivotPx','durationMs','sockets'],
      'requiredMarkerFields':['name','frame','cosmeticOnly'],
      'note':'Replace all nulls and empty delivery arrays with validated export data. Frames are not authored by this brief. Gameplay events come from ENGINE, not markers.'}
    files={'briefs.json':encoded(data),'scene-bindings.json':encoded(bindings),'manifest.template.json':encoded(template),'HANDOFF.md':(SOURCE/'HANDOFF.md').read_bytes()}
    for a in assets: files['briefs/'+a['id']+'.md']=asset_markdown(a,common).encode()
    for name in ['day-one-geometry.json','day-one-sequence.mjs','day-one-build-markers.mjs']:
        files['reference/'+name]=(ROOT/name).read_bytes()
    files['reference/DAY_ONE_INTRO.md']=(ROOT.parent/'DAY_ONE_INTRO.md').read_bytes()
    files['reference/cast-art.json']=(ROOT/'cast-art.json').read_bytes()
    files['reference/CAST_READABILITY_STANDARD.md']=(ROOT.parent/'production/CAST_READABILITY_STANDARD.md').read_bytes()
    files['README.md']=('''# Day 1 2D asset production pack

Start with HANDOFF.md. briefs.json commissions every required asset; briefs/ contains one artist brief per asset. scene-bindings.json maps approved geometry/build markers to these IDs. manifest.template.json is an export contract example, not delivered art. reference/ preserves approved script, geometry, staging and cast provenance.

P0 = first contact and line dependencies. P1 = required completion. All records start at briefed. Artwork, importer and live sprite implementation remain to produce. This ZIP includes reference links and metadata, not copies of every high-resolution concept image. Open root-relative links against https://www.fruitfulab.net or the deployment hosting this pack.
''').encode()
    files['checksums.json']=encoded({name:hashlib.sha256(raw).hexdigest() for name,raw in sorted(files.items())})
    dest=out/'sprite-briefs';dest.mkdir(exist_ok=True)
    urls={}
    for name,raw in files.items():
        leaf=Path(name);h=hashlib.sha256(raw).hexdigest()[:16]
        filename=leaf.stem+'.'+h+leaf.suffix
        target=dest/leaf.parent/filename;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(raw)
        urls[name]='/loopforge-design/sprite-briefs/'+str(leaf.parent/filename)
    # Reproducible ZIP: fixed timestamp, ordering and permissions.
    import io
    buffer=io.BytesIO()
    with zipfile.ZipFile(buffer,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
        for name,raw in sorted(files.items()):
            info=zipfile.ZipInfo('loopforge-day-one-2d/'+name,(2026,11,17,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16
            z.writestr(info,raw)
    raw=buffer.getvalue();zipname='day-one-2d.'+hashlib.sha256(raw).hexdigest()[:16]+'.zip';(dest/zipname).write_bytes(raw)
    zipurl='/loopforge-design/sprite-briefs/'+zipname
    groups=list(dict.fromkeys(a['group'] for a in assets))
    counts={g:sum(a['group']==g for a in assets) for g in groups}
    hero=next(x for x in cast_art['ensembles'] if x['id']=='ensemble-badass')['variants'][0]
    heading='<header class="sb-head"><span class="sb-eyebrow">ARTIST + ENGINE HANDOFF · DAY ONE · R1</span><h1>Day 1 sprite production</h1><p>The approved floor becomes a live 2D scene: distinct workers, precise contacts, a working line, and an exit that keeps moving.</p></header>'
    intro='<section class="sb-overview"><div>'+heading+'<div class="sb-stats"><span><b>12</b>characters</span><span><b>5</b>line stations</span><span><b>53</b>asset briefs</span></div></div><figure><a href="'+E(next(x for x in cast_art['ensembles'] if x['id']=='ensemble-badass')['input']['src'])+'" target="_blank" rel="noopener"><img src="'+E(hero['src'])+'" width="'+str(hero['width'])+'" height="'+str(hero['height'])+'" alt="Approved blue worker ensemble, the identity reference for the sprite cast"></a><figcaption>Approved cast reference. Sprite sheets still to produce.</figcaption></figure></section>'
    intro+='<div class="sb-downloads"><a class="sb-primary" download href="'+zipurl+'">Download complete handoff · '+str(round(len(raw)/1024))+' KB ZIP</a><a download href="'+urls['briefs.json']+'">Asset manifest</a><a download href="'+urls['scene-bindings.json']+'">Scene bindings</a><a download href="'+urls['HANDOFF.md']+'">ENGINE handoff · MD</a></div>'
    intro+='<p class="sb-status"><strong>Level approved · assets briefed.</strong> '+E(data['status'])+'</p>'
    nav='<nav class="sb-nav" aria-label="2D brief sections"><a href="#asset-catalogue">Asset briefs</a><a href="#common-animation">Common animation</a><a href="#engine-handoff">ENGINE handoff</a><a href="#source-references">Source references</a></nav>'
    controls='<div class="sb-filters"><label>Find an asset<input id="sb-search" type="search" placeholder="Name, ID, prop or action…"></label><label>Department<select id="sb-group"><option value="">All departments · 53</option>'+''.join('<option value="'+E(g)+'">'+E(g)+' · '+str(counts[g])+'</option>' for g in groups)+'</select></label><label>Build stage<select id="sb-priority"><option value="">All required assets</option><option value="P0">P0 · first dependencies</option><option value="P1">P1 · complete the shift</option></select></label></div><p id="sb-count" class="sb-muted" role="status" aria-live="polite">53 briefs · all required for the complete prototype</p>'
    cards=[]
    for a in assets:
        preview=''
        if a['group']=='Characters':
            v=portraits[a['id'][5:]]['variants'][0]
            preview='<img loading="lazy" decoding="async" src="'+E(v['src'])+'" width="'+str(v['width'])+'" height="'+str(v['height'])+'" alt="'+E(a['name'])+' approved concept">'
        body='<p class="sb-brief">'+E(a['brief'])+'</p><dl>'+''.join('<div><dt>'+label+'</dt><dd>'+E(a[key])+'</dd></div>' for label,key in [('Deliver','parts'),('States & variants','states'),('Assembly & sockets','assembly'),('Acceptance','accept')])+'</dl>'
        if a['clips']: body+='<h4>Bespoke animation coverage</h4><p class="sb-muted">Add the seven common clip families below. Facings and frame counts are proposed minimums.</p>'+table(['Clip','Coverage','Performance'],a['clips'])
        body+='<div class="sb-links"><a download href="'+urls['briefs/'+a['id']+'.md']+'">Download this brief</a>'+''.join('<a href="'+E(r['url'])+'" target="_blank" rel="noopener">'+E(r['label'])+' ↗</a>' for r in a['references'])+'</div>'
        hay=' '.join([a['id'],a['name'],a['group'],a['brief'],a['parts'],a['states'],a['assembly'],' '.join(' '.join(c) for c in a['clips'])]).lower()
        cards.append('<details class="sb-card" id="'+a['id']+'" data-group="'+E(a['group'])+'" data-priority="'+a['priority']+'" data-search="'+E(hay,quote=True)+'"><summary>'+preview+'<span class="sb-card-title"><small>'+E(a['id'])+' · '+E(a['group'])+'</small><strong>'+E(a['name'])+'</strong><span>'+E(a['quantity'])+'</span></span><span class="sb-priority">'+a['priority']+'</span></summary><div class="sb-card-body">'+body+'</div></details>')
    catalogue='<section id="asset-catalogue"><div class="sb-section-head"><span class="sb-eyebrow">THE COMMISSION</span><h2>Asset catalogue</h2><p>Open a brief for layers, states, contacts and acceptance. P0 builds the first proof; P1 completes the approved shift. Both are required.</p></div>'+controls+'<div id="sb-cards">'+''.join(cards)+'</div><p id="sb-empty" hidden>No matching assets. Clear the search or change the department.</p></section>'
    animation='<section id="common-animation"><span class="sb-eyebrow">SHARED COVERAGE · UNIQUE BODIES</span><h2>Seven common clip families.</h2><p>Deliver each for all 12 characters in their own proportions. Character briefs add bespoke actions; all movement remains in place, with ENGINE owning the route.</p>'+table(['Clip','Coverage','Performance'],common)+'</section>'
    _,handbook,_=render((SOURCE/'HANDOFF.md').read_text(),{})
    handoff='<section id="engine-handoff"><span class="sb-eyebrow">ASSEMBLY CONTRACT</span><h2>ENGINE assembly guide</h2><div class="sb-handbook">'+handbook+'</div></section>'
    sources='<section id="source-references"><h2>Source references</h2><p>The approved sequence and cast outrank earlier prototype experiments. Technical export defaults in this handoff remain proposals.</p><ul>'+''.join('<li><a href="'+E(r['url'])+'" target="_blank" rel="noopener">'+E(r['label'])+' ↗</a></li>' for r in data['sources'])+'</ul><p><a download href="'+urls['manifest.template.json']+'">Export descriptor template</a> · <a download href="'+urls['checksums.json']+'">Pack checksums</a></p></section>'
    css=(ROOT/'sprite-briefs.css').read_bytes();js=(ROOT/'sprite-briefs.js').read_bytes()
    cssname='sprite-briefs.'+hashlib.sha256(css).hexdigest()[:12]+'.css';jsname='sprite-briefs.'+hashlib.sha256(js).hexdigest()[:12]+'.js'
    (out/cssname).write_bytes(css);(out/jsname).write_bytes(js)
    page='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>Day 1 · 2D asset briefs · Loopforge</title><link rel="stylesheet" href="'+cssname+'"></head><body><main class="sb-page">'+intro+nav+catalogue+animation+handoff+sources+'</main><script src="'+jsname+'"></script></body></html>'
    (out/'sprite-briefs.html').write_text(page)

if __name__ == '__main__':
    build_sprite_briefs(ROOT.parents[2] / 'apps/lab/public/loopforge-design')
