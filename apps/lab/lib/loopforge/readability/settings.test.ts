import {READABILITY_DEFAULT as defaults,parseReadability,treatment,heightScale} from './settings';
test('saved art settings reject unknown versions and invalid colours, and bound unsafe sizes',()=>{
 expect(parseReadability({version:2,worker:'#ff0000'})).toEqual(defaults);
 expect(parseReadability({version:1,worker:'url(javascript:bad)',limenHeight:999,stilettoHeight:-1,distance:NaN,detail:150})).toMatchObject({worker:defaults.worker,limenHeight:1.5,stilettoHeight:1,distance:25,detail:100});
});
test('original comparison preserves camera, shot size, overlays and selected treatment for switching back',()=>{
 const saved={...defaults,original:true,camera:'rear' as const,size:'console' as const,neutralLight:75,labels:true};
 expect(treatment(saved)).toMatchObject({background:'current',workerPaint:0,limenPaint:0,stilettoPaint:0,neutralLight:0,camera:'rear',size:'console',labels:true});
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
