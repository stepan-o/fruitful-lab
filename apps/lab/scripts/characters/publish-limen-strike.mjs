/** Package the reviewed strike without retaining superseded binary animation buffers. */
import {readFile,writeFile,mkdtemp} from 'node:fs/promises';
import path from 'node:path';import {tmpdir} from 'node:os';
import {NodeIO} from '@gltf-transform/core';import {prune,dedup} from '@gltf-transform/functions';import {validateBytes} from 'gltf-validator';import {buildPack} from '../assets.mjs';
const input=process.argv[2];if(!input)throw Error('Pass the retargeted LIMEN bank.');
const io=new NodeIO(),doc=await io.read(input);await doc.transform(prune({keepLeaves:true,keepAttributes:true}),dedup());
const bytes=await io.writeBinary(doc),validation=await validateBytes(bytes,{maxIssues:10});if(validation.issues.numErrors||validation.issues.numWarnings)throw Error(JSON.stringify(validation.issues));
const dir=await mkdtemp(path.join(tmpdir(),'loopforge-limen-strike-')),source=path.join(dir,'motions.glb'),catalog=path.join(dir,'catalog.json');await writeFile(source,bytes);await writeFile(catalog,JSON.stringify({pack:'loopforge-limen-motions',assets:{motions:{kind:'model',source,maxBytes:11000000}}}));console.log({bytes:bytes.length,clips:doc.getRoot().listAnimations().length});console.log(await buildPack(catalog));
