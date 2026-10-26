import {containRect} from '@/lib/loopforge/encounters/presentation-layout';
import {DAY_ONE_NIGHT_ART} from '@/lib/loopforge/encounters/day-one-night';
import {presentedSpeech,presentationName,paintTurnFrame,turnArt} from './turn-presentation';
import {REACTION_ART,reactionOpacity} from '@/lib/loopforge/encounters/dialogue-turn';
import {SPEECH_INK,speechAccent,speechWords} from '@/lib/loopforge/encounters/speech-delivery';
import {dialoguePlacement} from './dialogue-placement';
import type { View } from '@/lib/loopforge/encounters/contract';
import {isStrikeSpeech,strikeSpeechOrder,strikeSpeechLane,placeStrikeSpeech,type SpeechRect} from './strike-speech-placement';
type Anchor = { id: string; x: number; y: number; visible: boolean };

/** Composite the exact rendered frame and its public dialogue; no private evidence enters the PNG. */
export function storyboard(source: HTMLCanvasElement, view: View, anchors: Anchor[], expressive=true,clock?:SpeechRect) {
  const image = document.createElement('canvas');
  image.width = source.width; image.height = source.height + 64;
  const ctx = image.getContext('2d');
  if (!ctx) throw Error('Image export is unavailable in this browser.');
  const scale = Math.max(.8, image.width / Math.max(1, source.clientWidth));
  const padding=24*scale;
  const night=view.dayOne?.stage==='night';
  const plans=[],strikeBounds:SpeechRect[]=[];let offscreenHeight=0;const reaction=!night&&view.turn?.turn.kind==='reaction-only'?view.turn:undefined,reactionHeight=reaction?193*scale:0;
  for(const speech of (night?[]:presentedSpeech(view)).sort((a,b)=>strikeSpeechOrder(view.framing,a.speaker)-strikeSpeechOrder(view.framing,b.speaker))){
    const anchor=anchors.find(a=>a.id===speech.speaker),detached=dialoguePlacement(view.framing,source.clientWidth,anchor,{pageWidth:window.innerWidth,canvasHeight:source.clientHeight,actorState:'unknown'})==='rail';
    const tone=expressive?speech.delivery?.tone??'plain':'plain',accent=speechAccent(tone);
    const font=18*scale,line=25*scale;
    const strike=!detached&&isStrikeSpeech(view.framing,speech.speaker);
    const viewport={width:source.width/scale,height:source.height/scale};
    const point={x:(anchor?.x??50)*viewport.width/100,y:(anchor?.y??50)*viewport.height/100};
    const preferredWidth=296;
    const width=detached?Math.min(296*scale,image.width-24*scale):strike?strikeSpeechLane(viewport.width,point.x,preferredWidth).width*scale:Math.min(296*scale,image.width-20*scale),textWidth=width-2*padding;
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
    const x=detached?(image.width-width)/2:placement?placement.x*scale:Math.max(10*scale,Math.min(image.width-width-10*scale,(anchor?.x??50)*source.width/100-width/2));
    const y=detached?source.height+offscreenHeight+32*scale:placement?placement.y*scale:Math.max(40*scale,Math.min(source.height-height-15*scale,(anchor?.y??50)*source.height/100-height-20*scale));
    if(detached)offscreenHeight+=height+48*scale;
    plans.push({speech,detached,tone,accent,font,line,width,lines,height,placement,x,y,face});
  }
  const nightHeight=night?120*scale:0;
  image.height=source.height+offscreenHeight+reactionHeight+nightHeight+64;
  if(night){const art=turnArt(DAY_ONE_NIGHT_ART.src),box=containRect(source.width,source.height,art.naturalWidth,art.naturalHeight);ctx.fillStyle='#080f16';ctx.fillRect(0,0,source.width,source.height);ctx.drawImage(art,box.x,box.y,box.width,box.height);}else ctx.drawImage(source,0,0);
  ctx.fillStyle='#091210';ctx.fillRect(0,source.height,image.width,image.height-source.height);
  for(const {speech,detached,accent,line,width,lines,height,placement,x,y,face} of plans){
    const actor=view.actors.find(a=>a.id===speech.speaker);paintTurnFrame(ctx,actor?.character??'worker',x,y,width,height,scale);
    if(!detached){const tail=turnArt('/loopforge/turn-art/'+(placement?'tail-side.svg':'tail-down.svg'));ctx.drawImage(tail,placement?x-20*scale:x+width/2-14*scale,placement?y+placement.tailY*scale-14*scale:y+height-1,28*scale,18*scale);}
    const name=presentationName(speech,actor?.name??speech.speaker);
    ctx.font=`bold ${13*scale}px sans-serif`;const tabWidth=ctx.measureText(name).width+26*scale;
    ctx.fillStyle=accent;ctx.fillRect(x+12*scale,y-21*scale,tabWidth,23*scale);
    ctx.textBaseline='top';ctx.fillStyle='#fff6df';ctx.fillText(name,x+25*scale,y-15*scale);
    lines.forEach((words,i)=>{let left=x+padding;for(const word of words){ctx.font=face(word.stress);ctx.fillStyle=word.stress?accent:SPEECH_INK.text;ctx.fillText(word.text,left,y+padding+i*line);left+=word.width;}});
  }
  if(reaction&&reaction.turn.kind==='reaction-only'){const art=REACTION_ART[reaction.turn.reaction.visualId];if(art){const actor=view.actors.find(a=>a.id===reaction.turn.actorId),x=(image.width-184*scale)/2,y=source.height+offscreenHeight+12*scale;ctx.save();ctx.globalAlpha=reactionOpacity(reaction,false,window.matchMedia('(prefers-reduced-motion: reduce)').matches);paintTurnFrame(ctx,actor?.character??'worker',x,y,184*scale,169*scale,scale);ctx.fillStyle='#17252a';ctx.font=`bold ${13*scale}px sans-serif`;ctx.fillText(actor?.name??reaction.turn.actorId,x+24*scale,y+24*scale);ctx.drawImage(turnArt(art.src),x+32*scale,y+49*scale,120*scale,96*scale);ctx.restore();}}
  if(night&&view.dayOne){ctx.fillStyle='#fff6df';ctx.font=`bold ${22*scale}px sans-serif`;ctx.fillText('Day 1 complete',24*scale,source.height+20*scale);ctx.font=`${16*scale}px sans-serif`;ctx.fillText('The shift has left. Production output: '+view.dayOne.productionOutputs,24*scale,source.height+58*scale);}
  const footerY=source.height+offscreenHeight+reactionHeight+nightHeight;
  ctx.fillStyle = '#091210'; ctx.fillRect(0, footerY, image.width, 64);
  ctx.fillStyle = '#e2e1ca'; ctx.font = '14px sans-serif'; ctx.textBaseline = 'top';
  ctx.fillText(view.phase, 16, footerY + 12, image.width - 32);
  ctx.fillStyle = '#b9ad77'; ctx.font = '11px monospace';
  ctx.fillText(`LOOPFORGE / ISOLATED REHEARSAL / ${(view.tick / 20).toFixed(2)} s`, 16, footerY + 38);
  return image;
}
