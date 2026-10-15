/** Exercise the production attachment against the delivered GLBs in Babylon (Node 22.15+). */
import {registerHooks} from 'node:module';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import ts from 'typescript';
import {NullEngine} from '@babylonjs/core/Engines/nullEngine.js';
import {Scene} from '@babylonjs/core/scene.js';
import {Vector3,Matrix} from '@babylonjs/core/Maths/math.vector.js';
const app=new URL('../../',import.meta.url);
// Import the real TypeScript adapters; no copied attachment implementation in this test.
const hooks=registerHooks({
 resolve(s,c,next){if(s.startsWith('@/'))s=new URL(s.slice(2),app).href;try{return next(s,c)}catch(e){for(const ext of ['.ts','.js','.json'])try{return next(s+ext,c)}catch{}throw e;}},
 load(url,c,next){if(url.endsWith('.ts'))return {format:'module',source:ts.transpileModule(readFileSync(new URL(url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText,shortCircuit:true};if(url.endsWith('.json')&&url.startsWith('file:'))return {format:'module',source:'export default '+readFileSync(new URL(url),'utf8'),shortCircuit:true};return next(url,c);}
});
const {loadMotionModel}=await import('../../components/loopforge/agents/motion-model.ts');
const {loadInspectionModel}=await import('../../components/loopforge/agents/inspection-model.ts');
const {cathexisFits,bodyEyePatch}=await import('../../lib/loopforge/agents/cathexis-fit.ts');
const manifest=name=>JSON.parse(readFileSync(new URL('lib/assets/generated/'+name+'.json',app),'utf8')).assets;
const assets=manifest('loopforge-cathexis-review'),file=manifest('loopforge-cathexis-motion')['cathexis-motion'].variants[0];
const originalFetch=globalThis.fetch;
globalThis.fetch=async(src,options)=>{options.signal.throwIfAborted();const bytes=readFileSync(new URL('public'+src,app));assert.equal('sha256-'+createHash('sha256').update(bytes).digest('base64'),options.integrity);return new Response(bytes);};
const engine=new NullEngine(),scene=new Scene(engine),casters=new Set();
const stage={scene,shadow:{addShadowCaster(m){casters.add(m)},removeShadowCaster(m){casters.delete(m)}},refresh(){},gate(){}};
const clips=[{id:'Hot_Walk',duration:5.833333492279053},{id:'Happy_Sway',duration:10.041666984558105}];
let count=0,maxError=0;
try{
 const model=await loadMotionModel(stage,{file,joints:23,extraJoints:6,clips},new AbortController().signal,()=>{});
 const source=scene.meshes.find(m=>m.name==='Source_Body'),corrected=scene.meshes.find(m=>m.name==='Corrected_Body');
 const sourcePositions=source.getVerticesData('position').slice(),sourceIndices=source.getIndices().slice();
 const bone=source.skeleton.bones.find(b=>b.name==='mixamorig:Head'),head=bone.getTransformNode();
 for(const key of ['grace-3k','grace-8k'])for(const coverage of ['full','half-left','half-right']){
  await model.face(assets[key].variants[0],cathexisFits[key],coverage);
  const mask=scene.meshes.find(m=>m.name===key),points=mask.getVerticesData('position');
  assert.ok(mask);assert.equal(scene.transformNodes.filter(n=>n.name==='CATHEXIS replaceable face seat').length,1);
  if(coverage!=='full')for(let i=0;i<points.length;i+=3)assert.ok((coverage==='half-left'?points[i]:-points[i])>=-1e-6,'correct porcelain half');
  for(const version of ['Source','Corrected'])for(const clip of clips){
   model.motion.select(clip.id,version);const steps=Math.ceil(clip.duration*120);
   assert.equal(source.isEnabled(),version==='Source');assert.equal(corrected.isEnabled(),version==='Corrected');
   for(let k=0;k<=steps;k++){
    model.motion.seek(k/steps);head.computeWorldMatrix(true);mask.computeWorldMatrix(true);
    // Independent skin-space prediction from the raw mask vertex and source inverse bind.
    const raw=Vector3.FromArray(points),fit=cathexisFits[key];
    const bodyPoint=raw.multiply(new Vector3(...fit.scale)).add(new Vector3(...fit.position)).scale(1.7/1.9);
    const expected=Vector3.TransformCoordinates(Vector3.TransformCoordinates(bodyPoint,bone.getAbsoluteInverseBindMatrix()),head.getWorldMatrix());
    const actual=Vector3.TransformCoordinates(raw,mask.getWorldMatrix());
    const error=Vector3.Distance(actual,expected);maxError=Math.max(maxError,error);assert.ok(error<.00001,'mask follows exported head bind space');
    assert.ok(Vector3.Distance(mask.getAbsolutePosition(),head.getAbsolutePosition())<.25,'mask remains head-sized and near face');count++;
   }
  }
  model.room('conveyor');model.turn(90);model.motion.seek(.43);
  const relative=mask.getWorldMatrix().multiply(Matrix.Invert(head.getWorldMatrix()));
  model.room('security');model.turn(0);mask.computeWorldMatrix(true);head.computeWorldMatrix(true);
  const next=mask.getWorldMatrix().multiply(Matrix.Invert(head.getWorldMatrix()));
  assert.ok(Array.from(relative.m).every((v,i)=>Math.abs(v-next.m[i])<.002),'room/turn preserve attachment');
  model.eyes(false);assert.ok(scene.meshes.filter(m=>m.name==='CATHEXIS warm eye lenses').every(m=>!m.isEnabled()));model.eyes(true);
 }
 assert.deepEqual(source.getVerticesData('position'),sourcePositions);assert.deepEqual(source.getIndices(),sourceIndices);
 // Rapid changes must cancel stale loads; clearing a face must remove its drawables/casters.
 const first=model.face(assets['grace-8k'].variants[0],cathexisFits['grace-8k']);
 const last=model.face(assets['grace-3k'].variants[0],cathexisFits['grace-3k'],'half-right');
 const settled=await Promise.allSettled([first,last]);assert.equal(settled[1].status,'fulfilled');
 assert.ok(!scene.meshes.some(m=>m.name==='grace-8k'));await model.face(null);assert.equal(casters.size,2);
 model.dispose();assert.equal(scene.meshes.length,0);assert.equal(scene.transformNodes.length,0);assert.equal(casters.size,0);
 // Static review shares the same clipping/eye code and still owns one intact body.
 const staticModel=await loadInspectionModel(stage,assets.body.variants[0],new AbortController().signal,true,bodyEyePatch);
 await staticModel.face(assets['grace-8k'].variants[0],cathexisFits['grace-8k'],'half-left');
 assert.equal(scene.meshes.filter(m=>m.name==='body').length,1);staticModel.dispose();assert.equal(scene.meshes.length,0);assert.equal(casters.size,0);
 console.log(JSON.stringify({motion:file.sha256,poseChecks:count,maxAttachmentErrorMetres:maxError,variants:'3k/8k × full/left/right × original/corrected × Hot Walk/Happy Sway',bodyUnchanged:true,cleanup:true},null,2));
}finally{globalThis.fetch=originalFetch;scene.dispose();engine.dispose();hooks.deregister();}
