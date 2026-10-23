import {EMOTIONS,SPEECH_INK,speechAccent,speechWords} from '@/lib/loopforge/encounters/speech-delivery';
import type { View } from '@/lib/loopforge/encounters/contract';
type Anchor = { id: string; x: number; y: number; visible: boolean };

/** Composite the exact rendered frame and its public dialogue; no private evidence enters the PNG. */
export function storyboard(source: HTMLCanvasElement, view: View, anchors: Anchor[], expressive=true) {
  const image = document.createElement('canvas');
  image.width = source.width; image.height = source.height + 64;
  const ctx = image.getContext('2d');
  if (!ctx) throw Error('Image export is unavailable in this browser.');
  ctx.drawImage(source, 0, 0);
  const scale = Math.max(.8, image.width / Math.max(1, source.clientWidth));
  const padding=14*scale;
  for(const speech of view.bubbles){
    const anchor=anchors.find(a=>a.id===speech.speaker&&a.visible);if(!anchor)continue;
    const tone=expressive?speech.delivery?.tone??'plain':'plain',accent=speechAccent(tone);
    const font=(tone==='outburst'?20:tone==='command'?18:16)*scale,line=font*1.4;
    const width=Math.min(248*scale,image.width-20*scale),textWidth=width-2*padding;
    const tokens=speechWords(speech.text,expressive?speech.delivery:undefined);
    const lines:{text:string;stress:boolean;width:number}[][]=[[]];let used=0;
    function face(stress:boolean){return `${tone==='aside'?'italic ':''}${stress||tone==='command'||tone==='outburst'?'bold ':''}${font}px sans-serif`;}
    for(const token of tokens){
      ctx.font=face(token.stress);const w=ctx.measureText(token.text).width;
      if(used+w>textWidth&&used>0){lines.push([]);used=0;}
      lines.at(-1)!.push({...token,width:w});used+=w;
    }
    const height=lines.length*line+2*padding;
    const x=Math.max(10*scale,Math.min(image.width-width-10*scale,anchor.x*source.width/100-width/2));
    const y=Math.max(40*scale,Math.min(source.height-height-15*scale,anchor.y*source.height/100-height-20*scale));
    ctx.lineWidth=2*scale;ctx.strokeStyle='#26383a';ctx.fillStyle=SPEECH_INK.paper;
    ctx.beginPath();ctx.roundRect(x,y,width,height,tone==='outburst'?3*scale:10*scale);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(x+width/2-8*scale,y+height-1);ctx.lineTo(x+width/2,y+height+10*scale);ctx.lineTo(x+width/2+8*scale,y+height-1);ctx.fill();ctx.stroke();
    const name=view.actors.find(a=>a.id===speech.speaker)?.name??speech.speaker;
    ctx.font=`bold ${10*scale}px sans-serif`;const tabWidth=ctx.measureText(name).width+26*scale;
    ctx.fillStyle=accent;ctx.fillRect(x+12*scale,y-21*scale,tabWidth,23*scale);
    ctx.textBaseline='top';ctx.fillStyle='#fff6df';ctx.fillText(name,x+25*scale,y-15*scale);
    const emotion=expressive&&speech.delivery?.emotion?EMOTIONS[speech.delivery.emotion]:undefined;
    if(emotion){ctx.font=`${23*scale}px sans-serif`;ctx.fillText(emotion.glyph,x+tabWidth+14*scale,y-31*scale);}
    lines.forEach((words,i)=>{let left=x+padding;for(const word of words){ctx.font=face(word.stress);ctx.fillStyle=word.stress?accent:SPEECH_INK.text;ctx.fillText(word.text,left,y+padding+i*line);left+=word.width;}});
  }
  ctx.fillStyle = '#091210'; ctx.fillRect(0, source.height, image.width, 64);
  ctx.fillStyle = '#e2e1ca'; ctx.font = '14px sans-serif'; ctx.textBaseline = 'top';
  ctx.fillText(view.phase, 16, source.height + 12, image.width - 32);
  ctx.fillStyle = '#b9ad77'; ctx.font = '11px monospace';
  ctx.fillText(`LOOPFORGE / ISOLATED REHEARSAL / ${(view.tick / 20).toFixed(2)} s`, 16, source.height + 38);
  return image;
}
