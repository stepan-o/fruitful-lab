/** Production-pack coverage and real DOM behavior, without starting a browser/server. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { spawnSync } from 'node:child_process';
import { makeSequence } from '../../../docs/loopforge/game-design/day-one-sequence.mjs';
import { makeBuildMarkers } from '../../../docs/loopforge/game-design/day-one-build-markers.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source='docs/loopforge/production/sprite-briefs/';
const publicRoot=path.join(root,'apps/lab/public');
const data=JSON.parse(read(source+'briefs.json'));
assert.equal(data.assets.length,53);
assert.equal(new Set(data.assets.map(a=>a.id)).size,53);
assert.equal(data.assets.filter(a=>a.group==='Characters').length,12);
const html=read('apps/lab/public/loopforge-design/sprite-briefs.html');
const dom=new JSDOM(html,{url:'https://example.test/loopforge-design/sprite-briefs.html',runScripts:'outside-only'});
const document=dom.window.document;
for(const el of document.querySelectorAll('[src],a[href]')){
 const url=el.getAttribute('src')||el.getAttribute('href');
 if(url.startsWith('#')){assert(document.getElementById(url.slice(1)),url);continue;}
 if(url.startsWith('/stepanoskin/'))continue;
 const target=path.join(publicRoot,url.startsWith('/')?url.slice(1):'loopforge-design/'+url);
 const tracked = !fs.existsSync(target) && spawnSync('git',['cat-file','-e','HEAD:'+path.relative(root,target)],{cwd:root}).status===0;
 assert(fs.existsSync(target)||tracked,'Missing published resource: '+url);
}
const bindingURL=[...document.querySelectorAll('a')].find(a=>a.textContent==='Scene bindings').getAttribute('href');
const bindings=JSON.parse(fs.readFileSync(path.join(publicRoot,bindingURL),'utf8'));
const floor=JSON.parse(read('docs/loopforge/game-design/day-one-geometry.json'));
const script=[...read('docs/loopforge/DAY_ONE_INTRO.md').matchAll(/^\*\*(\w+)\*\*\s+(.+)$/gm)].map(m=>({speaker:m[1],text:m[2]}));
const score=makeSequence(floor,script);
const ids=new Set(data.assets.map(a=>a.id));
assert.deepEqual(bindings.floor,floor);
assert.deepEqual(bindings.buildMarkers.map(({assetId,...m})=>m),makeBuildMarkers(floor,score));
for(const e of [...bindings.actors,...bindings.fixtures,...bindings.portals,...bindings.buildMarkers])assert(ids.has(e.assetId),e.assetId);
assert.equal(bindings.regression.dialogueCount,46);
assert.equal(bindings.regression.duration,score.duration);
assert.equal(bindings.regression.exitPace,2.4);
dom.window.HTMLElement.prototype.scrollIntoView=function(){};
dom.window.eval(read('docs/loopforge/game-design/sprite-briefs.js'));
const input=document.getElementById('sb-search');input.value='palm';input.dispatchEvent(new dom.window.Event('input'));
const visible=()=>[...document.querySelectorAll('.sb-card')].filter(c=>!c.hidden);
assert(visible().some(c=>c.id==='char-bob'));
assert(!visible().some(c=>c.id==='char-ben'));
input.value='';input.dispatchEvent(new dom.window.Event('input'));
const group=document.getElementById('sb-group');group.value='Characters';group.dispatchEvent(new dom.window.Event('change'));
assert.equal(visible().length,12);
const priority=document.getElementById('sb-priority');priority.value='P0';priority.dispatchEvent(new dom.window.Event('change'));
assert.equal(visible().length,4);
input.value='does-not-exist';input.dispatchEvent(new dom.window.Event('input'));
assert.equal(visible().length,0);assert.equal(document.getElementById('sb-empty').hidden,false);
dom.window.location.hash='#char-ed';dom.window.dispatchEvent(new dom.window.HashChangeEvent('hashchange'));
assert.equal(document.getElementById('char-ed').open,true);assert.equal(visible().length,53);
const board=new JSDOM(read('apps/lab/public/loopforge-design/index.html'),{url:'https://example.test/stepanoskin/loopforge/design',runScripts:'outside-only'});
board.window.ResizeObserver=class{observe(){}disconnect(){}};
board.window.HTMLElement.prototype.scrollIntoView=function(){};
board.window.eval(read('docs/loopforge/game-design/board.js'));
const nav=[...board.window.document.querySelectorAll('.nav [data-panel]')].map(b=>b.dataset.panel);
assert.equal(nav[nav.indexOf('floor-layout')+1],'sprite-briefs');
const frame=board.window.document.getElementById('sprite-briefs-frame');assert.equal(frame.hasAttribute('src'),false);
board.window.document.querySelector('.nav [data-panel="sprite-briefs"]').click();
assert.equal(frame.getAttribute('src'),'/loopforge-design/sprite-briefs.html');
assert.equal(board.window.document.getElementById('sprite-briefs').hidden,false);
assert.equal(board.window.location.hash,'#sprite-briefs');
assert.equal(board.window.document.querySelector('.nav [data-panel="sprite-briefs"]').getAttribute('aria-current'),'true');
console.log('PASS: 53 briefs, 12 actors, 27 build markers, geometry/script bindings, published links, filters, deep links, tab order and lazy loading.');


assert.deepEqual(bindings.portals.map(({assetId,...portal})=>portal),floor.portals);
const zipHref=document.querySelector('a[download][href$=".zip"]').getAttribute('href');
const archiveCheck=spawnSync('python3',['-c',`
import hashlib,json,sys,zipfile,pathlib
with zipfile.ZipFile(sys.argv[1]) as pack:
    read=lambda name:pack.read('loopforge-day-one-2d/'+name)
    for name,digest in json.loads(read('checksums.json')).items():
        assert hashlib.sha256(read(name)).hexdigest()==digest, name
    for name,path in [('day-one-geometry.json','docs/loopforge/game-design/day-one-geometry.json'),
                      ('approved-factory.json','apps/lab/lib/loopforge/spatial/approved-factory.json'),
                      ('factory-floor-plan.svg','docs/loopforge/maps/factory-floor-plan.svg')]:
        assert read('reference/'+name)==pathlib.Path(path).read_bytes()
    assert read('scene-bindings.json')==pathlib.Path(sys.argv[2]).read_bytes()
`,path.join(publicRoot,zipHref),path.join(publicRoot,bindingURL)],{cwd:root,encoding:'utf8'});
assert.equal(archiveCheck.status,0,archiveCheck.stderr);
const plate=read('docs/loopforge/maps/factory-floor-plan.svg');
const shell=plate.split('<g id="shell">')[1].split('</g>')[0];
assert(read('apps/lab/public/loopforge-design/factory-layout-proposal.html').includes(shell));
assert(read('apps/lab/public/loopforge-design/day-one-rehearsal.html').includes(plate));
console.log('Passed map identity, portal permissions and every downloadable pack checksum.');
dom.window.close();board.window.close();
