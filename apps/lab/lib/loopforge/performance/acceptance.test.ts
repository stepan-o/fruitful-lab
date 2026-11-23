import {ACCEPTANCE,createAcceptanceRecorder,frameStats} from './acceptance';
const r={meshes:1,materials:1,textures:1,skeletons:1,geometries:1,animationGroups:1};
it('preserves stalls and calculates time-weighted cadence across the full run',()=>{
 expect(frameStats([20,20,20,940])).toMatchObject({fps:4,p95Ms:940,stallsOver100:1});
});
it('cannot pass a short, backgrounded or unprobed run',()=>{
 const m=createAcceptanceRecorder();m.frame(0);m.frame(20);
 expect(m.result(r,r,null,0).status).toBe('INVALID');
 for(let t=40;t<=ACCEPTANCE.durationMs;t+=20)m.frame(t);
 expect(m.result(r,r,null,0).checks.input).toBe(false);
 expect(m.result(r,r,'Page hidden',0).status).toBe('INVALID');
});
it('requires every room/angle, all switches, an input probe and stable resources',()=>{
 const m=createAcceptanceRecorder();for(let t=0;t<=ACCEPTANCE.durationMs;t+=20)m.frame(t);
 for(let n=0;n<29;n++)m.switchResponse(50);m.inputResponse(50);
 expect(m.result(r,r,null,0).status).toBe('PASS');
 expect(m.result(r,{...r,textures:2},null,0).checks.resources).toBe(false);
 expect(m.result(r,r,null,1).checks.context).toBe(false);
});
it('does not let a fast room conceal a slow camera or a delayed switch',()=>{
 const m=createAcceptanceRecorder();m.frame(0);let t=0;while(t<600000){t+=t<20000?50:10;m.frame(t);}
 for(let n=0;n<29;n++)m.switchResponse(n===1?250:20);m.inputResponse(20);
 const result=m.result(r,r,null,0);expect(result.frames.fps).toBeGreaterThan(30);
 expect(result.checks.everyAngle).toBe(false);expect(result.checks.switches).toBe(false);
});
