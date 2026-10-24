import {createOpeningRecorder,OPENING_ACCEPTANCE,OPENING_SHOTS,DAY_ONE_ACCEPTANCE,dayOneWorkload} from './opening-acceptance';
import type {Resources} from './acceptance';
import type {DayOneState} from '../encounters/day-one-state';
const resources:Resources={meshes:12,materials:16,textures:40,skeletons:12,geometries:12,animationGroups:0};
function run(step:number){const recorder=createOpeningRecorder(),shots=OPENING_SHOTS;for(let t=0;t<=OPENING_ACCEPTANCE.durationMs;t+=step)recorder.frame(t,shots[Math.floor(t/20000)%shots.length]);return recorder;}
test('passes only a complete run with all compositions, input and repeated episodes',()=>{const recorder=run(20);recorder.probe(40);expect(recorder.result(resources,resources,2,null).status).toBe('PASS');});
test('a smooth but unfinished or hidden run is invalid',()=>{const recorder=createOpeningRecorder();recorder.frame(0,'approach');recorder.frame(20,'approach');expect(recorder.result(resources,resources,2,null).status).toBe('INVALID');const full=run(20);full.probe(40);expect(full.result(resources,resources,2,'Page hidden during run').status).toBe('INVALID');});
test('slow full runs fail without hiding their measured result',()=>{const recorder=run(40);recorder.probe(40);const result=recorder.result(resources,resources,2,null);expect(result.status).toBe('FAIL');expect(result.frames.fps).toBe(25);expect(result.checks.frameRate).toBe(false);});
test('a stalled dramatic shot fails despite a fast overall average',()=>{const recorder=createOpeningRecorder();let t=0;recorder.frame(0,'approach');while(t<600000){const shot=t<10000?'impact':['approach','assembly','passage'][Math.floor(t/20000)%3];t+=shot==='impact'?80:10;recorder.frame(t,shot);}recorder.probe(20);const result=recorder.result(resources,resources,2,null);expect(result.frames.fps).toBeGreaterThan(30);expect(result.checks.everyShot).toBe(false);expect(result.status).toBe('FAIL');});
test('missing response, incomplete repetitions and resource growth fail separately',()=>{const recorder=run(20);const result=recorder.result(resources,{...resources,meshes:13},1,null);expect(result.checks.input).toBe(false);expect(result.checks.episodes).toBe(false);expect(result.checks.resources).toBe(false);expect(result.status).toBe('FAIL');});

test('the extended edit requires its card, threshold and aftermath shots',()=>{const recorder=createOpeningRecorder();for(let t=0;t<=600000;t+=20)recorder.frame(t,['approach','assembly','impact','passage'][Math.floor(t/20000)%4]);recorder.probe(20);const result=recorder.result(resources,resources,2,null);expect(result.checks.allShots).toBe(false);expect(result.status).toBe('FAIL');});

it('requires every Day 1 stage and a fully staffed line without relaxing cadence limits',()=>{
 const stages=['entry','tutorial','staffing','production','output','departure','night'] as const;
 const counts={meshes:12,materials:12,textures:12,skeletons:12,geometries:12,animationGroups:12};
 const day:DayOneState={stage:'production' as const,crew:8,stationOperators:{intake:'bob',wash:'sam',belt:'jo',forge:'max'},stationOccupancy:{intake:'bob',wash:'sam',belt:'jo',forge:'max'},tutorialOutputs:1,pairedOutputs:0,staffedOutputs:0,productionOutputs:0,departed:0,totalCast:12};
 const full=createOpeningRecorder('day-one');for(let t=0;t<=DAY_ONE_ACCEPTANCE.durationMs;t+=20)full.frame(t,OPENING_SHOTS[Math.floor(t/20000)%OPENING_SHOTS.length],'fixture',{...day,stage:stages[Math.floor(t/20000)%stages.length]});full.probe(20);expect(full.result(counts,counts,2,null).status).toBe('PASS');
 const missing=createOpeningRecorder('day-one');for(let t=0;t<=DAY_ONE_ACCEPTANCE.durationMs;t+=20)missing.frame(t,OPENING_SHOTS[Math.floor(t/20000)%OPENING_SHOTS.length],'fixture',day);missing.probe(20);expect(missing.result(counts,counts,2,null).checks.fullDayStages).toBe(false);
 const under=createOpeningRecorder('staffed');for(let t=0;t<=600000;t+=20)under.frame(t,['conveyor-wide','intake','wash','belt','forge'][Math.floor(t/20000)%5],'fixture',{...day,crew:7});under.probe(20);expect(under.result(counts,counts,2,null).checks.staffed).toBe(false);
});

 test('two complete ordinary cycles include six control dwells and the night image',()=>{const w=dayOneWorkload(14680,6,OPENING_SHOTS);expect(w.durationMs).toBe(1502000);expect(w.maxActualStartMs).toBe(1652000);expect(w.warmupMs).toBe(30000);expect(()=>dayOneWorkload(0,6,OPENING_SHOTS)).toThrow();const recorder=createOpeningRecorder('day-one',w);recorder.frame(0,'approach');recorder.frame(1200000,'approach');expect(recorder.result(resources,resources,2,null).status).toBe('INVALID');});
