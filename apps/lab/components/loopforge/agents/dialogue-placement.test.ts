import {dialoguePlacement,type PlacementEvidence} from './dialogue-placement';
const anchor={id:'limen',x:50,y:18,visible:true};
const measured:PlacementEvidence={pageWidth:1056,canvasHeight:434,actorState:'in-frame',heads:[{x:480,y:110,width:140,height:150}],fullGroup:{x:720,y:180,width:248,height:150},strikeFits:true};
it('routes a visible nominal point to the rail without verified head/group evidence',()=>{
 expect(dialoguePlacement('limen-emphasis',1056,anchor)).toBe('rail');
 expect(dialoguePlacement('assembly',1056,anchor)).toBe('rail');
});
it.each([320,390])('preserves speech on a %ipx page with a960px enlarged feed',pageWidth=>{
 expect(dialoguePlacement('assembly',960,anchor,{...measured,pageWidth})).toBe('rail');
});
it('rejects failed strike fit and every missing or unknown actor extent',()=>{
 expect(dialoguePlacement('impact',1056,anchor,{...measured,strikeFits:false})).toBe('rail');
 expect(dialoguePlacement('assembly',1056,anchor,{...measured,actorState:'unknown'})).toBe('rail');
 expect(dialoguePlacement('assembly',1056,anchor,{...measured,heads:[]})).toBe('rail');
});
it('checks complete transformed groups against safe frame, heads and other chrome',()=>{
 expect(dialoguePlacement('impact',1056,anchor,{...measured,fullGroup:{x:720,y:350,width:248,height:150}})).toBe('rail');
 expect(dialoguePlacement('assembly',1056,anchor,{...measured,fullGroup:{x:500,y:100,width:248,height:150}})).toBe('rail');
 expect(dialoguePlacement('assembly',1056,anchor,{...measured,reserved:[{x:740,y:170,width:100,height:80}]})).toBe('rail');
});
it('permits the existing right lane only with a complete valid measured envelope',()=>{
 expect(dialoguePlacement('impact',1056,anchor,measured)).toBe('anchor');
});
