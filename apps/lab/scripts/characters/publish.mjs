import {readFile,writeFile,mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {buildPack} from '../assets.mjs';
const source=process.argv[2]??'/tmp/loopforge-agent-export';
const report=JSON.parse(await readFile(path.join(source,'report.json')));
const assets={};for(const model of report){assets[model.kind]={kind:'model',source:path.join(source,model.kind+'.glb'),maxBytes:2500000};assets[model.kind+'-rig']={kind:'data',source:path.join(source,model.kind+'.json')};}
assets['worker-baked']={kind:'data',source:path.join(source,'worker-baked.json')};
const dir=await mkdtemp(path.join(tmpdir(),'loopforge-pack-')),catalog=path.join(dir,'catalog.json');await writeFile(catalog,JSON.stringify({pack:'loopforge-agents',assets}));console.log(await buildPack(catalog));
