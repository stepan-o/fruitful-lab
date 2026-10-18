import {DEFAULT_GRAPHICS,REFERENCE_GRAPHICS,parseGraphics,presetSettings,resolveGraphics,createResolutionGovernor} from './settings';
import {COMPARISON_CASES,fixedGraphics,createComparisonRecorder} from '../performance/comparison';
test('invalid persisted preferences cannot enable unbounded rendering',()=>{
 expect(parseGraphics({version:9})).toBe(DEFAULT_GRAPHICS);
 expect(parseGraphics({...DEFAULT_GRAPHICS,resolution:Infinity})).toBe(DEFAULT_GRAPHICS);
 expect(parseGraphics({...DEFAULT_GRAPHICS,targetFps:120})).toBe(DEFAULT_GRAPHICS);
 expect(parseGraphics(JSON.parse(JSON.stringify(presetSettings('performance'))))).toEqual(presetSettings('performance'));
});
test('context budgets preserve manual choices and showcase detail',()=>{
 expect(resolveGraphics(DEFAULT_GRAPHICS,'showcase').scale).toBe(1);
 expect(resolveGraphics(DEFAULT_GRAPHICS,'room').shadows).toBe('low');
 expect(resolveGraphics(DEFAULT_GRAPHICS,'overview').shadows).toBe('off');
 expect(resolveGraphics(REFERENCE_GRAPHICS,'room')).toEqual(resolveGraphics(REFERENCE_GRAPHICS,'showcase'));
 expect(resolveGraphics(fixedGraphics(DEFAULT_GRAPHICS),'room')).toEqual({...resolveGraphics(DEFAULT_GRAPHICS,'room'),adaptive:false});
});
test('automatic resolution requires sustained pressure and recovers slowly within bounds',()=>{
 const g=createResolutionGovernor(.85,.85);expect(g.sample(50,30)).toBe(.85);expect(g.sample(50,30)).toBe(.85);expect(g.sample(50,30)).toBe(.75);
 for(let i=0;i<100;i++)g.sample(50,30);expect(g.sample(50,30)).toBe(.5);
 for(let i=0;i<100;i++)g.sample(1,30);expect(g.sample(1,30)).toBe(.85);
});
test('isolated comparison cases change one factor; reference repeat matches',()=>{
 const reference=COMPARISON_CASES[0];
 for(const item of COMPARISON_CASES.slice(1,6)){
  const differences=['workers','workerPoses'].filter(key=>item[key as 'workers']!==reference[key as 'workers']).length+Object.keys(reference.settings).filter(key=>key!=='preset'&&item.settings[key as keyof typeof reference.settings]!==reference.settings[key as keyof typeof reference.settings]).length;
  expect(differences).toBe(1);
 }
 expect(COMPARISON_CASES.at(-1)?.settings).toEqual(reference.settings);
});
test('recorder retains stalls and missing GPU observations; phases include six angles',()=>{
 const r=createComparisonRecorder(),sample={cpuMs:12,gpuMs:null,workerPoseMs:3,drawCalls:40,triangles:100};
 r.frame(0,0,sample);r.frame(200,200,sample);r.frame(10200,10200,{...sample,gpuMs:9});r.frame(10300,10300,sample);
 const result=r.result();expect(result.gpuMs?.samples).toBe(1);expect(result.gpuMs?.mean).toBe(9);expect(result.frames.stallsOver100).toBe(2);expect(result.angles).toHaveLength(6);
 expect(createComparisonRecorder().result().gpuMs).toBeNull();
});
