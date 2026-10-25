import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import ts from 'typescript';
import {Vector3,Quaternion} from '@babylonjs/core/Maths/math.vector.js';
const app=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const source=await readFile(path.join(app,'components/loopforge/agents/performance-sampler.ts'),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText
  .replaceAll("'@babylonjs/core/Maths/math.vector'",JSON.stringify(pathToFileURL(path.join(app,'node_modules/@babylonjs/core/Maths/math.vector.js')).href))
  .replaceAll("'./max-leg-transition.mjs'",JSON.stringify(pathToFileURL(path.join(app,'components/loopforge/agents/max-leg-transition.mjs')).href));
const {createPerformanceSampler}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
function fixture(mode){
 const hips={uniqueId:1,name:'Hips',position:new Vector3(0,10,0),rotationQuaternion:Quaternion.Identity()},hand={uniqueId:2,name:'RightHand',position:Vector3.Zero(),rotationQuaternion:Quaternion.Identity()};
 const track=(target,property,value)=>({target,animation:{framePerSecond:30,targetProperty:property,evaluate:()=>value.clone()}});
 const groups=[{name:'move',from:0,to:30,targetedAnimations:[track(hips,'position',new Vector3(2,12,3)),track(hand,'rotationQuaternion',Quaternion.FromEulerAngles(.5,0,0))]},{name:'rest',from:0,to:30,targetedAnimations:[track(hips,'position',new Vector3(0,10,0))]}];
 return {hips,hand,sampler:createPerformanceSampler(groups,'',mode)};
}
for(const [mode,expected]of [['source',[2,12,3]],['y-up',[0,12,0]],['z-up',[0,0,3]]]){
 const {hips,hand,sampler}=fixture(mode);sampler.sample({clip:'move'},.5);assert.deepEqual(hips.position.asArray(),expected);
 sampler.sample({clip:'rest'},0);assert(hand.rotationQuaternion.equalsWithEpsilon(Quaternion.Identity()));
 sampler.sample({clip:'move'},.5);sampler.sample({clip:'rest'},0,{cue:{clip:'move'},seconds:.5,yaw:0},0);assert.deepEqual(hips.position.asArray(),expected);
 sampler.sample({clip:'rest'},0,{cue:{clip:'move'},seconds:.5,yaw:0},1);assert(hand.rotationQuaternion.equalsWithEpsilon(Quaternion.Identity()));
}
console.log('Shared sampling verified: Y-up and Z-up pelvis height, source travel, missing-channel reset and transition endpoints.');

const target={uniqueId:8,name:'Hips',position:Vector3.Zero(),rotationQuaternion:Quaternion.Identity()};
const group=(name,height)=>({name,from:0,to:30,targetedAnimations:[{target,animation:{targetProperty:'position',framePerSecond:30,evaluate:()=>new Vector3(0,height,0)}}]});
for(const groups of [[group('walk',1),group('walk__corrected',2)],[group('walk__corrected',2),group('walk',1)]]){createPerformanceSampler(groups,'','y-up').sample({clip:'walk'},0);assert.equal(target.position.y,2);}
console.log('STILETTO corrected motion selection is independent of asset group ordering.');

// A paired interaction retains its small local balance shift. Blending and seeking
// must evaluate the old cue with its own policy, not the incoming cue's policy.
{
 const {hips,sampler}=fixture('y-up');
 sampler.sample({clip:'move',rootMotion:'preserve'},.5);assert.deepEqual(hips.position.asArray(),[2,12,3]);
 sampler.sample({clip:'rest'},0,{cue:{clip:'move',rootMotion:'preserve'},seconds:.5},0);assert.deepEqual(hips.position.asArray(),[2,12,3]);
 sampler.sample({clip:'rest'},0,{cue:{clip:'move',rootMotion:'preserve'},seconds:.5},.5);assert.deepEqual(hips.position.asArray(),[1,11,1.5]);
 sampler.sample({clip:'move'},.5);assert.deepEqual(hips.position.asArray(),[0,12,0]);
 sampler.sample({clip:'move',rootMotion:'preserve'},.5);assert.deepEqual(hips.position.asArray(),[2,12,3]);
}
console.log('Paired balance shifts survive seeking and blend into encounter-owned travel.');

// Quiet_Wait must preserve its planted contact pose under seeks and blended entry.
// Cache the fixed pose, but keep the original restrained upper-body expression.
{
 const leg={uniqueId:101,name:'LeftUpLeg',position:Vector3.Zero(),rotationQuaternion:Quaternion.Identity()},head={uniqueId:102,name:'Head',position:Vector3.Zero(),rotationQuaternion:Quaternion.Identity()};let legSamples=0;
 const turn=frame=>Quaternion.FromEulerAngles(frame*.01,frame*.002,0);
 const tracks=[{target:leg,animation:{framePerSecond:30,targetProperty:'rotationQuaternion',evaluate:frame=>{legSamples++;return turn(frame);}}},{target:head,animation:{framePerSecond:30,targetProperty:'rotationQuaternion',evaluate:turn}}];
 const sampler=createPerformanceSampler([{name:'idle',from:0,to:30,targetedAnimations:tracks}]);
 for(const seconds of [.1,.9,.4,1.4,.1]){sampler.sample({clip:'Quiet_Wait',loop:true},seconds);assert(leg.rotationQuaternion.equalsWithEpsilon(turn(6)));assert(head.rotationQuaternion.equalsWithEpsilon(Quaternion.Slerp(turn(6),turn(seconds%1*30),.18)));}
 assert.equal(legSamples,1,'the fixed leg curve is sampled once, not every frame');
}
console.log('Quiet crowd pose remains seekable, planted and expressive with cached contact curves.');
