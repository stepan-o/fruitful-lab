import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stripTypeScriptTypes} from 'node:module';
import {NullEngine} from '@babylonjs/core/Engines/nullEngine.js';
import {Scene} from '@babylonjs/core/scene.js';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode.js';
import {Animation} from '@babylonjs/core/Animations/animation.js';
import {AnimationGroup} from '@babylonjs/core/Animations/animationGroup.js';
import {Vector3} from '@babylonjs/core/Maths/math.vector.js';
const src=readFileSync(new URL('../../components/loopforge/agents/performance-sampler.ts',import.meta.url),'utf8');
const js=stripTypeScriptTypes(src).replaceAll("'@babylonjs/core/Maths/math.vector'",JSON.stringify(import.meta.resolve('@babylonjs/core/Maths/math.vector.js')));
const {createPerformanceSampler}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const engine=new NullEngine(),scene=new Scene(engine);
try{
 const parent=new TransformNode('CentimetresToMetres',scene),hips=new TransformNode('Hips',scene);hips.parent=parent;
 const make=(name,target,values)=>{const g=new AnimationGroup(name,scene),a=new Animation(name,'position',30,Animation.ANIMATIONTYPE_VECTOR3,Animation.ANIMATIONLOOPMODE_CONSTANT);a.setKeys(values.map((v,i)=>({frame:i*30,value:Vector3.FromArray(v)})));g.addTargetedAnimation(a,target);return g;};
 const fall=make('fall',parent,[[0,.1,0],[0,.1,0]]),recover=make('recover',hips,[[0,0,.2],[0,0,1]]),sampler=createPerformanceSampler([fall,recover]);
 sampler.sample({clip:'fall'},1);assert.equal(parent.position.y,.1);
 sampler.sample({clip:'recover'},.5);assert.equal(parent.position.y,0);const sought=hips.position.clone();
 sampler.sample({clip:'fall'},0);sampler.sample({clip:'recover'},.5);assert(hips.position.equals(sought));
 sampler.sample({clip:'recover'},.5,{cue:{clip:'fall'},seconds:1},.5);assert(Math.abs(parent.position.y-.05)<1e-6);
 sampler.sample({clip:'recover'},9);assert.equal(hips.position.z,1);
 sampler.sample({clip:'recover',loop:true},1.5);assert(Math.abs(hips.position.z-sought.z)<1e-6);
 console.log('Performance sampler: missing parent channels reset, random seeks match, crossfade preserves parent continuity, hold/loop verified.');
}finally{scene.dispose();engine.dispose();}
