import {snapshotMotion} from './motion-snapshot';
import {fixture,testSource,vector} from './motion-test-fixture';

it('copies live matrices and loaded samples without changing any local pose',()=>{
 const {input,nodes}=fixture();const before=JSON.stringify(input);
 const result=snapshotMotion(input,testSource);
 expect(JSON.stringify(input)).toBe(before);
 expect(result.tracks.find(t=>t.path==='position')).toMatchObject({rawValue:[4,2,5],expectedUnblendedValue:[0,2,0],liveValue:[0,2,0],error:0});
 const copied=result.joints[0].worldMatrix.slice();nodes[0].getWorldMatrix().m[12]=99;
 nodes[0].position.asArray()[0]=99;
 expect(result.joints[0].worldMatrix).toEqual(copied);expect(result.joints[0].localPosition).toEqual([0,2,0]);
 expect(result.asset.sha256).toBe(input.file.sha256);expect(result.frame).toBeCloseTo(12,10);
});
it('evaluates the actual held source instant and marks blended comparisons inconclusive',()=>{
 const {input,tracks}=fixture('bob');input.groups[0].name='Electrocuted_Fall';input.view.cue={clip:'Electrocuted_Fall',start:6.333,rate:0};input.view.seconds=20;
 const held=snapshotMotion(input,testSource);expect(held.sampledSourceSeconds).toBe(6.333);expect(tracks[0].animation.evaluate.mock.calls.at(-1)?.[0]).toBeCloseTo(189.99,8);
 input.view.previous={cue:{clip:'walk'},seconds:1};input.view.blend=.5;
 expect(snapshotMotion(input,testSource).tracks.every(t=>!t.comparable&&t.error===null)).toBe(true);
});
it('uses the same quiet contact frame and y-up pelvis policy as the sampler',()=>{
 const {input,tracks}=fixture();input.groups[0].name='idle';input.view.cue={clip:'Quiet_Wait',loop:true};
 snapshotMotion(input,testSource);expect(tracks[0].animation.evaluate).toHaveBeenCalledWith(6);
 input.view.cue.rootMotion='preserve';
 expect(snapshotMotion(input,testSource).tracks.find(t=>t.path==='position')?.expectedUnblendedValue).toEqual([4,2,5]);
});
it.each(['missing joint','duplicate joint','missing track','duplicate track','zero quaternion','NaN matrix','bad projection','bad FPS'])('rejects %s without changing pose',problem=>{
 const {input,nodes,tracks}=fixture();
 if(problem==='missing joint')input.nodes=nodes.slice(1);
 if(problem==='duplicate joint')input.nodes=[...nodes,nodes[0]];
 if(problem==='missing track')input.groups[0].targetedAnimations=tracks.slice(1);
 if(problem==='duplicate track')input.groups[0].targetedAnimations=[...tracks,tracks[0]];
 if(problem==='zero quaternion')nodes[0].rotationQuaternion=vector([0,0,0,0]);
 if(problem==='NaN matrix')nodes[0].getWorldMatrix().m[0]=NaN;
 if(problem==='bad projection')input.scene.getTransformMatrix=()=>({m:Array(16).fill(0)});
 if(problem==='bad FPS')tracks[0].animation.framePerSecond=0;
 const before=JSON.stringify(input);expect(()=>snapshotMotion(input,testSource)).toThrow('A3');expect(JSON.stringify(input)).toBe(before);
});
