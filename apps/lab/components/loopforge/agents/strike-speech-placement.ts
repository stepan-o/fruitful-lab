/** CSS-pixel geometry shared by the DOM overlay and the scene export. */
export type SpeechRect = {x:number;y:number;width:number;height:number};
export const isStrikeSpeech = (framing:string|undefined,speaker:string) => framing==='impact' && (speaker==='limen'||speaker==='bob');
export const strikeSpeechOrder = (framing:string|undefined,speaker:string) => isStrikeSpeech(framing,speaker)?speaker==='limen'?0:1:2;

/** Use the clear right lane in the strike shot; allow full readable width on phones. */
export function strikeSpeechLane(viewportWidth:number,anchorX:number,preferredWidth:number) {
  const inset=20,minimumWidth=Math.min(134,viewportWidth-2*inset);
  const x=viewportWidth<=480?Math.max(inset,viewportWidth-inset-preferredWidth):Math.max(inset,Math.min(viewportWidth-inset-minimumWidth,Math.max(viewportWidth*.55,anchorX+viewportWidth*.12)));
  return {x,width:Math.min(preferredWidth,viewportWidth-inset-x)};
}

export function placeStrikeSpeech(input:{viewport:{width:number;height:number};anchor:{x:number;y:number};preferredWidth:number;bodyHeight:number;headerHeight?:number;clock?:SpeechRect;occupied?:SpeechRect[]}) {
  const {viewport,anchor,preferredWidth,bodyHeight,clock,occupied=[]}=input;
  const lane=strikeSpeechLane(viewport.width,anchor.x,preferredWidth);
  // Name, emotion overhang and expressive transform stay inside the reserved group.
  const headerHeight=Math.max(52,input.headerHeight??0),motion=12,bottom=20,gap=10;
  const overlapsX=(box:SpeechRect)=>lane.x-motion<box.x+box.width+gap&&lane.x+lane.width+motion>box.x-gap;
  let y=headerHeight+12;
  for(const box of [clock,...occupied].filter((box):box is SpeechRect=>!!box)) {
    if(overlapsX(box)&&y-headerHeight<box.y+box.height+gap&&y+bodyHeight+bottom>box.y-gap)y=box.y+box.height+gap+headerHeight;
  }
  const bounds={x:lane.x-motion,y:y-headerHeight,width:lane.width+2*motion,height:headerHeight+bodyHeight+bottom};
  // Do not silently clamp a second panel back over the first. The caller's exact
  // viewport/text fixtures and subsequent pixel review must establish available room.
  const fits=bounds.y+bounds.height<=viewport.height-8;
  return {...lane,y,height:bodyHeight,bounds,fits,tailY:Math.max(12,Math.min(bodyHeight-12,anchor.y-y))};
}
