import type {ActorView,View} from '@/lib/loopforge/encounters/contract';
import type {ProbeContext} from './motion-probe';
import {CORE_JOINTS,type MotionInput,type MotionSource} from './motion-snapshot';

export const testSource:MotionSource={baseTree:'43dd15590b9a7ab1666fae898c472bc3f6441885',sourceTree:'a'.repeat(40),revision:'fixture',sourceHashes:{helper:'b'.repeat(64)},deploymentCommit:null};
export function actor(id='max'):ActorView{return {id,name:id,character:'worker',position:[124000,125000],yaw:0,motion:'walk',seconds:.4,action:'morning',cue:{clip:'walk',loop:true}};}
export function vector(values:number[]){return {asArray:()=>values};}
export function fixture(id='max'){
 const identity=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
 const nodes=CORE_JOINTS.map((name,i)=>{
  const matrix=identity();matrix[12]=i;matrix[13]=name.endsWith('Hand')?1:3;
  return {name,uniqueId:i+1,parent:null,position:vector([0,2,0]),rotation:vector([0,0,0]),rotationQuaternion:vector([0,0,0,1]),scaling:vector([1,1,1]),computeWorldMatrix:jest.fn(),getWorldMatrix:()=>({m:matrix})};
 });
 const tracks=nodes.map(target=>({target,animation:{name:target.name+' rotation',targetProperty:'rotationQuaternion',framePerSecond:30,evaluate:jest.fn((frame:number)=>{void frame;return vector([0,0,0,1]);})}}));
 tracks.push({target:nodes[0],animation:{name:'Hips position',targetProperty:'position',framePerSecond:30,evaluate:jest.fn((frame:number)=>{void frame;return vector([4,2,5]);})}});
 const input:MotionInput={worker:id,file:{src:`/${id}.glb`,sha256:'c'.repeat(64)},root:nodes[0],nodes,groups:[{name:'walk',from:0,to:240,targetedAnimations:tracks}],scene:{activeCamera:{viewport:{toGlobal:(width,height)=>({x:0,y:0,width,height})}},getTransformMatrix:()=>({m:identity()}),getEngine:()=>({getRenderWidth:()=>1280,getRenderHeight:()=>720})},view:actor(id),standingHeight:1.8,sourceHeight:2};
 return {input,nodes,tracks};
}
export function rendered(actors:ActorView[]):View{return {tick:100,actors,bubbles:[],gateOpen:false,drive:0,phase:'The morning walk',finished:false};}
export function context(v:View):ProbeContext{return {source:testSource,userPaused:true,playing:false,readingActive:false,readingPaused:true,readSeconds:0,readingStep:null,authoritativeProjection:v,authorState:{tick:v.tick,events:[{kind:'heard',agent:'sam'}],props:{'bob:id':{holder:'ed'}}},activePhases:[{action:'morning',phase:v.phase,remainingTicks:1}],camera:{angle:1},canvasRect:{x:10,y:20,width:1280,height:720},render:{width:1280,height:720}};}
