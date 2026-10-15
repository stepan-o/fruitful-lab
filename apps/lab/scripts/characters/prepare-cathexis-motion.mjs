import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {NodeIO}=require('@gltf-transform/core'),{ALL_EXTENSIONS}=require('@gltf-transform/extensions'),sharp=require('sharp'),{validateBytes}=require('gltf-validator');
// Usage: node prepare-cathexis-motion.mjs raw.glb <matching-FBX-texture-directory> output.glb
const dir=process.argv[3];if(!dir||!process.argv[4])throw Error('Pass raw GLB, matching texture directory and output GLB.');
const bytes=await readFile(process.argv[2]);
const sourceValidation=await validateBytes(bytes,{maxIssues:100});
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS),doc=await io.readBinary(bytes),root=doc.getRoot();
for(const m of root.listMaterials()){
 m.setEmissiveTexture(null).setEmissiveFactor([0,0,0]);
 for(const e of m.listExtensions())m.setExtension(e.extensionName,null);
}
for(const t of root.listTextures())t.setImage(await sharp(t.getImage()).resize(2048,2048,{fit:'inside'}).removeAlpha().jpeg({quality:94}).toBuffer()).setMimeType('image/jpeg');
const stem=dir+'/Meshy_AI_Cathexis_Body_v2_Rigg_biped_texture_0';
const rough=await sharp(await readFile(stem+'_roughness.png')).resize(2048,2048).greyscale().raw().toBuffer(),metal=await sharp(await readFile(stem+'_metallic.png')).resize(2048,2048).greyscale().raw().toBuffer();
const rgb=Buffer.alloc(2048*2048*3);for(let i=0;i<rough.length;i++){rgb[i*3]=255;rgb[i*3+1]=rough[i];rgb[i*3+2]=metal[i];}
const mr=root.listMaterials()[0];mr.setMetallicRoughnessTexture(doc.createTexture('Supplied FBX metallic + roughness').setImage(await sharp(rgb,{raw:{width:2048,height:2048,channels:3}}).jpeg({quality:96}).toBuffer()).setMimeType('image/jpeg')).setMetallicFactor(1).setRoughnessFactor(1);
// Material pass preserves the supplied source/corrected geometry and motion bank.
const out=await io.writeBinary(doc);await writeFile(process.argv[4],out);
const validation=await validateBytes(out,{maxIssues:100});
const clips=root.listAnimations().map(a=>({name:a.getName(),duration:Math.max(...a.listSamplers().map(s=>s.getInput().getMax([])[0])),channels:a.listChannels().length}));
const report={sourceBytes:bytes.length,reviewBytes:out.length,sourceValidation:sourceValidation.issues,reviewValidation:validation.issues,joints:root.listSkins()[0].listJoints().map(n=>n.getName()),triangles:root.listMeshes()[0].listPrimitives()[0].getIndices().getCount()/3,clips,materialNotes:'Source incorrectly uses base color as whole-body emission and omits metallic/roughness maps. Local derivative clears this emission and uses matching maps from FBX ZIP (identical base color SHA). Normal map still absent. Source files unchanged.'};
await writeFile(process.argv[4]+'.validation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
