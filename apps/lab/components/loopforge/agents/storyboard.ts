import {EMOTIONS,SPEECH_INK,speechAccent,speechWords} from '@/lib/loopforge/encounters/speech-delivery';
import {offscreenHeldSpeech} from './held-speech';
import type {AttentionStep} from '@/lib/loopforge/encounters/attention';
import type { View } from '@/lib/loopforge/encounters/contract';
import {isStrikeSpeech,strikeSpeechOrder,strikeSpeechLane,placeStrikeSpeech,type SpeechRect} from './strike-speech-placement';
type Anchor = { id: string; x: number; y: number; visible: boolean };

/** Composite the exact rendered frame and its public dialogue; no private evidence enters the PNG. */
export function storyboard(source: HTMLCanvasElement, view: View, anchors: Anchor[], expressive=true, reading?:AttentionStep,clock?:SpeechRect) {
  const image = document.createElement('canvas');
  image.width = source.width; image.height = source.height + 64;
  const ctx = image.getContext('2d');
  if (!ctx) throw Error('Image export is unavailable in this browser.');
  const scale = Math.max(.8, image.width / Math.max(1, source.clientWidth));
  const padding=14*scale,offscreen=offscreenHeldSpeech(view,reading,anchors);
  const plans=[],strikeBounds:SpeechRect[]=[];let offscreenHeight=0;
  for(const speech of [...view.bubbles].sort((a,b)=>strikeSpeechOrder(view.framing,a.speaker)-strikeSpeechOrder(view.framing,b.speaker))){
    const anchor=anchors.find(a=>a.id===speech.speaker),detached=offscreen?.id===speech.id;
    if(!anchor||(!anchor.visible&&!detached))continue;
    const tone=expressive?speech.delivery?.tone??'plain':'plain',accent=speechAccent(tone);
    const font=(tone==='outburst'?20:tone==='command'?18:16)*scale,line=font*1.4;
    const strike=!detached&&isStrikeSpeech(view.framing,speech.speaker);
    const viewport={width:source.width/scale,height:source.height/scale};
    const point={x:anchor.x*viewport.width/100,y:anchor.y*viewport.height/100};
    const preferredWidth=viewport.width<=480?204:248;
    const width=detached?image.width-20*scale:strike?strikeSpeechLane(viewport.width,point.x,preferredWidth).width*scale:Math.min(248*scale,image.width-20*scale),textWidth=width-2*padding;
    const tokens=speechWords(speech.text,expressive?speech.delivery:undefined);
    const lines:{text:string;stress:boolean;width:number}[][]=[[]];let used=0;
    function face(stress:boolean){return `${tone==='aside'?'italic ':''}${stress||tone==='command'||tone==='outburst'?'bold ':''}${font}px sans-serif`;}
    for(const token of tokens){
      ctx.font=face(token.stress);const w=ctx.measureText(token.text).width;
      if(used+w>textWidth&&used>0){lines.push([]);used=0;}
      lines.at(-1)!.push({...token,width:w});used+=w;
    }
    const height=lines.length*line+2*padding;
    const placement=strike?placeStrikeSpeech({viewport,anchor:point,preferredWidth,bodyHeight:height/scale,clock,occupied:strikeBounds}):undefined;
    if(placement)strikeBounds.push(placement.bounds);
    const x=detached?10*scale:placement?placement.x*scale:Math.max(10*scale,Math.min(image.width-width-10*scale,anchor.x*source.width/100-width/2));
    const y=detached?source.height+32*scale:placement?placement.y*scale:Math.max(40*scale,Math.min(source.height-height-15*scale,anchor.y*source.height/100-height-20*scale));
    if(detached)offscreenHeight=height+48*scale;
    plans.push({speech,detached,tone,accent,font,line,width,lines,height,placement,x,y,face});
  }
  image.height=source.height+offscreenHeight+64;
  ctx.drawImage(source,0,0);
  ctx.fillStyle='#091210';ctx.fillRect(0,source.height,image.width,image.height-source.height);
  for(const {speech,detached,tone,accent,line,width,lines,height,placement,x,y,face} of plans){
    ctx.lineWidth=2*scale;ctx.strokeStyle='#26383a';ctx.fillStyle=SPEECH_INK.paper;
    ctx.beginPath();ctx.roundRect(x,y,width,height,tone==='outburst'?3*scale:10*scale);ctx.fill();ctx.stroke();
    if(!detached){ctx.beginPath();
    if(placement){const tailY=y+placement.tailY*scale;ctx.moveTo(x+1,tailY-8*scale);ctx.lineTo(x-10*scale,tailY);ctx.lineTo(x+1,tailY+8*scale);}
    else{ctx.moveTo(x+width/2-8*scale,y+height-1);ctx.lineTo(x+width/2,y+height+10*scale);ctx.lineTo(x+width/2+8*scale,y+height-1);}
    ctx.fill();ctx.stroke();}
    const name=(view.actors.find(a=>a.id===speech.speaker)?.name??speech.speaker)+(detached?' · offscreen':'');
    ctx.font=`bold ${10*scale}px sans-serif`;const tabWidth=ctx.measureText(name).width+26*scale;
    ctx.fillStyle=accent;ctx.fillRect(x+12*scale,y-21*scale,tabWidth,23*scale);
    ctx.textBaseline='top';ctx.fillStyle='#fff6df';ctx.fillText(name,x+25*scale,y-15*scale);
    const emotion=expressive&&speech.delivery?.emotion?EMOTIONS[speech.delivery.emotion]:undefined;
    if(emotion){ctx.font=`${23*scale}px sans-serif`;ctx.fillText(emotion.glyph,x+tabWidth+14*scale,y-31*scale);}
    lines.forEach((words,i)=>{let left=x+padding;for(const word of words){ctx.font=face(word.stress);ctx.fillStyle=word.stress?accent:SPEECH_INK.text;ctx.fillText(word.text,left,y+padding+i*line);left+=word.width;}});
  }
  const footerY=source.height+offscreenHeight;
  ctx.fillStyle = '#091210'; ctx.fillRect(0, footerY, image.width, 64);
  ctx.fillStyle = '#e2e1ca'; ctx.font = '14px sans-serif'; ctx.textBaseline = 'top';
  ctx.fillText(view.phase, 16, footerY + 12, image.width - 32);
  ctx.fillStyle = '#b9ad77'; ctx.font = '11px monospace';
  ctx.fillText(`LOOPFORGE / ISOLATED REHEARSAL / ${(view.tick / 20).toFixed(2)} s`, 16, footerY + 38);
  return image;
}
