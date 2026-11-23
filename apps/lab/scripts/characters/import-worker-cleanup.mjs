/** Publish the corrected worker through the existing immutable asset contract. */
import {createRequire} from 'node:module';import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),workdir=process.argv[2];if(!workdir)throw Error('Usage: node scripts/characters/import-worker-cleanup.mjs <authoring-directory>');const rq=createRequire(root+'/package.json');const {NodeIO}=rq('@gltf-transform/core'),{ALL_EXTENSIONS}=rq('@gltf-transform/extensions'),{dedup,prune}=rq('@gltf-transform/functions');
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS),doc=await io.read(path.join(workdir,'worker-corrected.glb'));
// The offline baker simplifies only new tracks. Preserve source samplers byte-for-byte.
// Dedup/accessor packing does not alter data values.
await doc.transform(dedup(),prune());const bytes=await io.writeBinary(doc);await writeFile(path.join(workdir,'worker-runtime.glb'),bytes);console.log(bytes.length);
const {buildPack}=await import(root+'/scripts/assets.mjs');await writeFile(path.join(workdir,'catalog.json'),JSON.stringify({pack:'loopforge-worker-review',assets:{'worker-01':{kind:'model',source:root+'/public/media/files/299587fb5eefb1fa1dc725118d4edd17ae058ea4231610c19d079bde3c991933.glb',maxBytes:8000000},'worker-01-corrected':{kind:'model',source:path.join(workdir,'worker-runtime.glb'),maxBytes:12000000}}}));console.log(await buildPack(path.join(workdir,'catalog.json')));
