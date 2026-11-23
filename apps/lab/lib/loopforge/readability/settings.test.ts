import {READABILITY_DEFAULT as defaults,parseReadability,treatment,heightScale} from './settings';
test('saved art settings reject unknown versions and invalid colours, and bound unsafe sizes',()=>{
 expect(parseReadability({version:2,worker:'#ff0000'})).toEqual(defaults);
 expect(parseReadability({version:1,worker:'url(javascript:bad)',limenHeight:999,stilettoHeight:-1,distance:NaN,detail:150})).toMatchObject({worker:defaults.worker,limenHeight:1.5,stilettoHeight:1,distance:25,detail:100});
});
test('original comparison preserves camera, shot size, overlays and selected treatment for switching back',()=>{
 const saved={...defaults,original:true,camera:'rear' as const,size:'console' as const,neutralLight:75,labels:true};
 expect(treatment(saved)).toMatchObject({background:'current',workerPaint:0,limenPaint:0,stilettoPaint:0,cathexisPaint:0,neutralLight:0,camera:'rear',size:'console',labels:true});
 expect(saved.neutralLight).toBe(75);expect(saved.workerPaint).toBe(85);
 expect(treatment({...saved,original:false}).neutralLight).toBe(75);
});
test('supervisor ratios normalize different source body sizes, while original leaves scale intact',()=>{
 expect(heightScale(false,2,1.8,1.25)*2).toBeCloseTo(2.25);
 expect(heightScale(false,1.6,1.8,1.2)*1.6).toBeCloseTo(2.16);
 expect(heightScale(true,2,1.8,1.25)).toBe(1);
 expect(()=>heightScale(false,0,1.8,1.25)).toThrow();
});

import {READABILITY_POSES} from './settings';
import stilettoReview from '../agents/stiletto-review.json';
test('the frozen STILETTO pose exists in the delivered motion bank',()=>{
 expect(stilettoReview.clips.some(clip=>clip.id===READABILITY_POSES.stiletto.clip)).toBe(true);
});

test('older two-supervisor saves retain their choices and acquire CATHEXIS defaults',()=>{
 const saved=parseReadability({version:1,limenHeight:1.5,stiletto:'#bc3344',stilettoPaint:91,camera:'rear',labels:true});
 expect(saved).toMatchObject({limenHeight:1.5,stiletto:'#bc3344',stilettoPaint:91,camera:'rear',labels:true,cathexis:defaults.cathexis,cathexisHeight:1.3,cathexisVisible:true,cathexisFace:'full'});
 const candidate={...saved,cathexis:'#d0c8a4',cathexisPaint:70,cathexisFace:'half-left' as const,cathexisVisible:false};
 expect(parseReadability(JSON.parse(JSON.stringify(candidate)))).toEqual(candidate);
 expect(treatment({...candidate,original:true})).toMatchObject({cathexisPaint:0,cathexisFace:'half-left',cathexisVisible:false});
 expect(candidate.cathexisPaint).toBe(70);
});
test('CATHEXIS settings reject unsupported masks, unsafe colour and non-finite dimensions',()=>{
 expect(parseReadability({version:1,cathexis:'red',cathexisHeight:Infinity,cathexisPaint:-20,cathexisFace:'grimace',cathexisVisible:'false'})).toMatchObject({cathexis:defaults.cathexis,cathexisHeight:1.3,cathexisPaint:0,cathexisFace:'full',cathexisVisible:true});
 expect(parseReadability({version:1,cathexisHeight:9,cathexisPaint:120,cathexisFace:'none'})).toMatchObject({cathexisHeight:1.5,cathexisPaint:100,cathexisFace:'none'});
});

import {changeReadabilityRoom} from './room-settings';
test('Security retains its own approved floor when switching rooms and editing conveyor',()=>{
 const security=changeReadabilityRoom(defaults,{room:'security'});expect(security.floor).toBe('#A7B2D3');
 const conveyor=changeReadabilityRoom(security,{room:'conveyor'});expect(conveyor.floor).toBe('#666860');
 const edited=changeReadabilityRoom(conveyor,{floor:'#445566'});expect(changeReadabilityRoom(edited,{room:'security'}).floor).toBe('#A7B2D3');
 expect(changeReadabilityRoom(changeReadabilityRoom(edited,{room:'security'}),{room:'conveyor'}).floor).toBe('#445566');
 expect(parseReadability(JSON.parse(JSON.stringify(edited)))).toEqual(edited);
});
