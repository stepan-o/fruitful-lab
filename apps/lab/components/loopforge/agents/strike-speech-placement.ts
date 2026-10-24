/** CSS-pixel geometry shared by the DOM overlay and the scene export. */
export type SpeechRect = {x:number;y:number;width:number;height:number};
export const isStrikeSpeech = (framing:string|undefined,speaker:string) => framing==='impact' && speaker==='limen';

/** Reserve the right-hand lane; retain readable type and wrap in narrow views. */
export function strikeSpeechLane(viewportWidth:number,anchorX:number,preferredWidth:number) {
  const inset=10, minimumWidth=Math.min(134,viewportWidth-2*inset);
  const x=Math.max(inset,Math.min(viewportWidth-inset-minimumWidth,Math.max(viewportWidth*.55,anchorX+viewportWidth*.12)));
  return {x,width:Math.min(preferredWidth,viewportWidth-inset-x)};
}

export function placeStrikeSpeech(input:{viewport:{width:number;height:number};anchor:{x:number;y:number};preferredWidth:number;bodyHeight:number;clock?:SpeechRect}) {
  const {viewport,anchor,preferredWidth,bodyHeight,clock}=input;
  const lane=strikeSpeechLane(viewport.width,anchor.x,preferredWidth);
  // The name/emotion extends 32px above the body. Leave space for it and the tail.
  let y=40;
  if(clock && lane.x<clock.x+clock.width+12 && lane.x+lane.width>clock.x-12) {
    y=Math.max(y,clock.y+clock.height+12+32);
  }
  y=Math.max(40,Math.min(y,viewport.height-bodyHeight-16));
  return {...lane,y,height:bodyHeight,tailY:Math.max(12,Math.min(bodyHeight-12,anchor.y-y))};
}
