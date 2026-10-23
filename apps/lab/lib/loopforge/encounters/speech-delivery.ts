import type {Delivery} from './contract';

export const EMOTIONS={
 anger:{glyph:'💢',label:'angry'},nerves:{glyph:'😰',label:'nervous'},
 doubt:{glyph:'🤨',label:'sceptical'},relief:{glyph:'😌',label:'relieved'},care:{glyph:'🤝',label:'reassuring'},
} as const;
export const SPEECH_INK={paper:'#f2ead5',text:'#17252a',command:'#824026',aside:'#335d70',plain:'#1e5964'};
export function speechAccent(tone:Delivery['tone']='plain'){
 return tone==='outburst'||tone==='command'?SPEECH_INK.command:tone==='aside'||tone==='hesitant'?SPEECH_INK.aside:SPEECH_INK.plain;
}
/** Plain text remains canonical for hearing/transcripts. Cues never inject HTML. */
export function speechWords(text:string,delivery?:Delivery){
 const ranges=(delivery?.emphasis??[]).flatMap(phrase=>{
  if(!phrase)return [];
  const matches:{start:number;end:number}[]=[];let start=0;
  while((start=text.indexOf(phrase,start))!==-1){matches.push({start,end:start+phrase.length});start+=phrase.length;}
  return matches;
 });
 let at=0;
 const words=Array.from(text.matchAll(/\S+\s*/g),match=>{
  const start=match.index!,end=start+match[0].trimEnd().length;
  const word={text:match[0],stress:ranges.some(r=>start<r.end&&end>r.start),at};
  at+=Math.min(.14,match[0].length*.012)+(/[.!?…][\s]*$/.test(match[0])?.14:0);
  return word;
 });
 const duration=delivery?.tone==='outburst'?.32:delivery?.tone==='command'?.65:1.3;
 const scale=at>duration?duration/at:1;
 return words.map(word=>({...word,at:word.at*scale}));
}
