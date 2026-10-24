import {arrival,ARRIVAL_REVISION} from './arrival';
import {replay} from './rehearsals';
import {OPENING_ACCEPTANCE,OPENING_SHOTS,createOpeningRecorder} from '../performance/opening-acceptance';
import pairs from '../agents/opening-worker-pairs.json';
const take=arrival(),phases=Object.values(take.registry).flatMap(a=>a.phases);
it('finishes Sam support release before Bob recovery while STILETTO enters',()=>{
 const release=phases.find(p=>p.id==='sam releases the supporting hand')!,rise=phases.find(p=>p.id==='bob gets up as STILETTO arrives')!;
 const cue=release.perform.find(p=>p.agent==='sam')!.cue!;
 expect(release.ticks/20*(cue.rate??1)).toBeCloseTo(pairs['sam-bob'].riseDuration,8);
 expect(cue.rootMotion).toBe('preserve');expect(phases.indexOf(rise)).toBe(phases.indexOf(release)+1);
 expect(rise.perform.find(p=>p.agent==='sam')?.cue?.clip).toBe('Quiet_Wait');
 expect(rise.perform.find(p=>p.agent==='bob')?.motion).toBe('recover');
 expect(rise.perform.find(p=>p.agent==='stiletto')?.motion).toBe('walk');
});
it('freezes all thirteen actual compositions and rejects missing checkpoint samples',()=>{
 expect(new Set(phases.map(p=>p.framing))).toEqual(new Set(OPENING_SHOTS));expect(OPENING_SHOTS).toHaveLength(13);
 expect(ARRIVAL_REVISION).toBe('before-the-shift/17');expect(OPENING_ACCEPTANCE.version).toBe('opening-scene-4');
 const rec=createOpeningRecorder(),shots=OPENING_SHOTS.filter(s=>s!=='checkpoint');
 for(let t=0;t<=600000;t+=20)rec.frame(t,shots[Math.floor(t/20000)%shots.length]);rec.probe(20);
 const resources={meshes:1,materials:1,textures:1,skeletons:1,geometries:1,animationGroups:1};
 const result=rec.result(resources,resources,2,null);expect(result.status).toBe('FAIL');expect(result.checks.allShots).toBe(false);
});
it('retains the exact Sam custody markers and admission after first output before Jo',()=>{
 const start=(name:string)=>1+phases.slice(0,phases.findIndex(p=>p.id===name)).reduce((n,p)=>n+p.ticks,0);
 const check=start('sam’s card is checked'),output=start('sam stows his checked ID');
 const before=replay(take,check);expect(before.facts['line.output']).toBe(1);expect(before.facts['checkpoint.card-checked.sam']).toBeUndefined();
 const after=replay(take,output);expect(after.facts['checkpoint.card-checked.sam']).toBe(true);expect(after.props?.['bob:id'].location).toMatchObject({kind:'stowed',agent:'ed'});
 for(const [name,marker] of [['sam draws his ID',2],['sam stows his checked ID',1.6]] as const){const p=phases.find(p=>p.id===name)!,cue=p.perform.find(v=>v.agent==='sam')!.cue!;expect((cue.start??0)+p.ticks/20*(cue.rate??1)).toBeCloseTo(marker,8);expect(p.transfers).toHaveLength(1);}
 const end=replay(take,take.total);expect(end.facts['checkpoint.check-number']).toBe(3);expect(end.facts['conveyor.admitted']).toBe(2);
});
