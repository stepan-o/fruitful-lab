from pathlib import Path
import hashlib,json,shutil

ROOT=Path(__file__).resolve().parents[3]
SOURCE=ROOT/'docs/loopforge/production/model-briefs'
PUBLIC=ROOT/'apps/lab/public'
OUT=PUBLIC/'loopforge-design/model-briefs'

def digest(data): return hashlib.sha256(data).hexdigest()
def encode(data): return (json.dumps(data,ensure_ascii=False,indent=2)+'\n').encode()

def publish_briefs():
    OUT.mkdir(parents=True,exist_ok=True)
    source=json.loads((SOURCE/'catalog.json').read_text())
    catalog={k:v for k,v in source.items() if k!='models'};catalog['models']=[]
    index=['# Loopforge model briefs', '', 'Download numbered stages and reference inputs below. For the visual library open [Model briefs](/stepanoskin/loopforge/design#model-briefs).', '']
    for entry in source['models']:
        entry=dict(entry);files=[]
        index.extend(['## '+entry['name'], '', entry['provenance'], ''])
        for image in entry['images']:
            for variant in [image['input'],*image['variants']]:
                raw=(PUBLIC/variant['src'].lstrip('/')).read_bytes()
                assert digest(raw)==variant['sha256'], variant['src']
                assert len(raw)==variant['bytes'], variant['src']
            asset=image['input'];image['archivePath']='images/'+Path(asset['src']).name
            index.append('- ['+image['label']+']('+asset['src']+') — '+image['role'])
            files.append({'name':'images/'+Path(asset['src']).name,**asset})
        for prompt in entry['prompts']:
            raw=(SOURCE/prompt['file']).read_bytes();prompt['text']=raw.decode();h=digest(raw)
            name=f"{entry['id']}-{Path(prompt['file']).stem}.{h[:16]}.txt"
            (OUT/name).write_bytes(raw);prompt['url']='/loopforge-design/model-briefs/'+name
            index.append('- ['+prompt['title']+']('+prompt['url']+')')
            files.append({'name':'prompts/'+Path(prompt['file']).name,'src':prompt['url'],'bytes':len(raw),'sha256':h})
        for source_file in sorted((SOURCE/entry['id']).iterdir()):
            if source_file.suffix not in ['.md','.json'] or source_file.is_dir():continue
            raw=source_file.read_bytes();h=digest(raw);name=f"{entry['id']}-{source_file.stem}.{h[:16]}{source_file.suffix}"
            (OUT/name).write_bytes(raw);files.append({'name':source_file.name,'src':'/loopforge-design/model-briefs/'+name,'bytes':len(raw),'sha256':h})
        entry['files']=files
        entry['downloadBytes']=sum(f['bytes'] for f in files)
        entry['packageManifest']={'schemaVersion':1,'id':entry['id'],'revision':entry['revision'],'provenance':entry['provenance'],'viewer':('https://www.fruitfulab.net'+entry['viewer']) if entry['viewer'] else None,'images':entry['images'],'files':files}
        raw=encode(entry);name=f"{entry['id']}.{digest(raw)[:16]}.json";(OUT/name).write_bytes(raw)
        catalog['models'].append({k:entry[k] for k in ['id','name','subtitle','status','downloadBytes'] }|{'src':'/loopforge-design/model-briefs/'+name})
    (OUT/'README.md').write_text('\n'.join(index)+'\n')
    shutil.copyfile(SOURCE/'cathexis/DESIGN.md',OUT/'CATHEXIS_DESIGN.md')
    raw=encode(catalog);name=f'catalog.{digest(raw)[:16]}.json';(OUT/name).write_bytes(raw)
    return '/loopforge-design/model-briefs/'+name

def render_model_briefs():
    src=publish_briefs()
    return '''<header class="section-head"><span class="kicker">Production archive · 21 October 2026</span><h2>Model briefs</h2><p>Reference images, copyable Meshy instructions and the resulting models. Rebuild a character without losing the decisions made after its first export.</p></header>
    <div class="callout"><h3>From readability study to character sheets</h3><p>The selected direction uses blue workers, pale-steel LIMEN and red-accented STILETTO. LIMEN’s kit now includes front, rear and side A-pose body inputs, the Set 1 concept revision and a separate horizontal protocol clipboard. The ten opening workers now have individual numbered body and animation briefs. All ten approved worker references are included. The approved ensemble leads model generation; individual sheets supply construction detail. Body, motion and opening-performance stages retain their own source and review records.</p><p><a href="/stepanoskin/loopforge/design#agents">Review the visual hierarchy →</a> · <a href="/loopforge-design/production/CAST_SHEET_REVISION_BRIEF.md">Character-sheet revision brief ↗</a> · <a href="/loopforge-design/production/CAST_READABILITY_STANDARD.md">Visual hierarchy and acceptance ↗</a></p></div>
    <div class="callout" id="model-briefs-current-status"><h3>Current delivery status</h3><p>The numbered body, motion and room briefs remain the source archive. The owner-approved Day1 demonstration now combines the worker cast and two supervisors with the Lobby/Security/Conveyor kit. Source approval, an exported model, an integrated appearance and a verified full interaction are separate records. Use the <a href="/stepanoskin/loopforge/design#agents">current Agents chapter</a> for the rendered review and open technical limits. No new paid model generation or Sam precision task is authorized by this archive update.</p></div>
    <div id="model-brief-library" data-catalog="'''+src+'''"><p>Choose this tab to load the character briefs.</p></div>
    <noscript><p>The interactive archive needs JavaScript. <a href="/loopforge-design/model-briefs/README.md">Read the library index and download individual briefs.</a></p></noscript>'''
