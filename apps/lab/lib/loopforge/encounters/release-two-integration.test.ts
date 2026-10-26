import {arrival} from './arrival';
import {replay} from './rehearsals';
import {OPENING_SHOTS,dayOneWorkload,createOpeningRecorder} from '../performance/opening-acceptance';
import pairs from '../agents/opening-worker-pairs.json';
const take=arrival(),phases=Object.values(take.registry).flatMap(a=>a.phases);
function start(name:string){const index=phases.findIndex(p=>p.id===name);if(index<0)throw Error('Missing named phase: '+name);return 1+phases.slice(0,index).reduce((n,p)=>n+p.ticks,0);}
it('finishes Sam support release before Bob recovery while STILETTO enters',()=>{
 const release=phases.find(p=>p.id==='sam releases as ed steps back')!,rise=phases.find(p=>p.id==='bob gets up as STILETTO arrives')!;
 const cue=release.perform.find(p=>p.agent==='sam')!.cue!;
 expect(release.ticks/20*(cue.rate??1)).toBeCloseTo(pairs['sam-bob'].riseDuration,8);expect(cue.rootMotion).toBe('preserve');expect(phases.indexOf(rise)).toBe(phases.indexOf(release)+1);
 expect(rise.perform.find(p=>p.agent==='sam')?.cue?.clip).toBe('Quiet_Wait');expect(rise.perform.find(p=>p.agent==='bob')?.motion).toBe('recover');expect(rise.perform.find(p=>p.agent==='stiletto')?.motion).toBe('walk');
});
function missingShot(omit:string){const required=[...new Set(phases.map(p=>p.framing!))],workload=dayOneWorkload(take.total,6,required),rec=createOpeningRecorder('day-one',workload),shots=required.filter(s=>s!==omit);for(let t=0;t<=workload.durationMs+20;t+=20)rec.frame(t,shots[Math.floor(t/20000)%shots.length]);rec.probe(20);const resources={meshes:1,materials:1,textures:1,skeletons:1,geometries:1,animationGroups:1};return rec.result(resources,resources,2,null);}
it('covers the current directed compositions and rejects omitted checkpoint evidence',()=>{
 expect(new Set(phases.map(p=>p.framing))).toEqual(new Set(OPENING_SHOTS));expect(OPENING_SHOTS).toEqual(expect.arrayContaining(['doorway-pressure','security-check-reverse','limen-emphasis','workers-reverse','conveyor-entrance']));
 const result=missingShot('checkpoint');expect(result.status).toBe('FAIL');expect(result.checks.allShots).toBe(false);
});
it('checks Sam after the counted tutorial and Jo third without fabricated card transfers',()=>{
 const check=start('sam’s credential record is checked'),before=replay(take,check),after=replay(take,check+12);
 expect(before.facts['line.tutorial-output']).toBe(1);expect(before.facts['line.output']).toBe(1);expect(before.facts['checkpoint.card-checked.sam']).toBeUndefined();expect(after.facts['checkpoint.card-checked.sam']).toBe(true);expect(after.facts['checkpoint.workers-passed']).toBe(2);
 expect(after.props?.['sam:id'].location).toMatchObject({kind:'stowed',agent:'sam'});expect(after.props?.['bob:id'].location).toMatchObject({kind:'stowed',agent:'ed'});
 expect(take.registry['sam-second'].phases.flatMap(p=>p.transfers??[])).toEqual([]);
 const joCheck=phases.find(p=>p.effects?.some(e=>'fact'in e&&e.fact==='checkpoint.cleared.jo'))!;const joStart=start(joCheck.id),joBefore=replay(take,joStart),joAfter=replay(take,joStart+joCheck.ticks);
 expect(joBefore.facts['checkpoint.cleared.jo']).toBeUndefined();expect(joAfter.facts['checkpoint.workers-passed']).toBe(3);expect(joAfter.facts['line.output']).toBe(1);
 const end=replay(take,take.total);expect(end.facts['conveyor.admitted']).toBe(8);expect(end.facts['checkpoint.workers-passed']).toBe(8);expect(end.facts['line.output']).toBe(3);
});
it('holds Sam inspection framing through the temporary check and preserves truthful status',()=>{
 for(const id of ['sam comes when called','sam starts reporting','Sam credential status — awaiting validation','Sam waits through the credential check','sam’s credential record is checked'])expect(phases.find(p=>p.id===id)?.framing).toBe('sam-inspection');
 expect(phases.find(p=>p.id==='sam finally clears')?.framing).toBe('checkpoint');expect(phases.find(p=>p.id==='One worker for a whole line')?.framing).toBe('conveyor-entrance');
 const forbidden=take.registry['sam-second'].phases.flatMap(p=>p.perform.filter(v=>v.agent==='sam'&&['Draw_ID','Stow_ID'].includes(v.cue?.clip??'')));expect(forbidden).toEqual([]);
});
it('fails performance evidence that omits the inspection composition',()=>{const result=missingShot('sam-inspection');expect(result.status).toBe('FAIL');expect(result.checks.allShots).toBe(false);});
