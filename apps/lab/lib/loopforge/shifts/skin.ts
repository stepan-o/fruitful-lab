import {selectShiftArt, commandPayload, drawAsset} from '../../../public/loopforge-design/days-2-4-art/v1/binding/shift-art.mjs';
import type {Command, Room} from './contract';
import type {Frame} from './wire';

export type ArtView = ReturnType<typeof selectShiftArt>;
type Entry = {atlas:string; rect:number[]; size:number[]; pivot?:number[]; insets?:number[]};
type Manifest = {groundPixelsPerMetre:number; atlases:Record<string,{file:string}>; assets:Record<string,Entry>};
type Offline = {manifest:Manifest; images:Record<string,string>};
declare global {interface Window {shiftArtOffline?:Offline}}


export function select(frame:Frame, room:Room, openCase:string, previewLead:string) {
  const view = selectShiftArt(frame, {room, openCase, previewLead, bubbleTicks:57});
  const {world,events} = frame.scene;
  // Pushed is a further speed-up of an admitted rushed operation.
  for (const hand of view.handoffs) {
    if (hand.seq && events.some(e => e.seq === hand.seq && e.kind === 'handoff.started' && e.text === 'pushed')) {
      hand.asset = 'fl-handoff-rushed';
    }
  }
  return view;
}

export function payload(frame:Frame, room:Room, openCase:string, action:Command['action'], target:string, id:string) {
  const payload=commandPayload(frame,{room,openCase},action,action==='issue-pass'?'bob':target,id);
  if(payload&&action==='issue-pass')payload.cmd.target=frame.scene.world.caseSubject;
  return payload;
}

export async function loadSkin(root='../loopforge-design/days-2-4-art/v1/') {
  const offline = window.shiftArtOffline;
  const manifest:Manifest = offline?.manifest ?? await fetch(root+'manifest.json').then(r => {
    if (!r.ok) throw Error('Art manifest '+r.status);
    return r.json();
  });
  const images:Record<string,HTMLImageElement> = {};
  await Promise.all(Object.values(manifest.atlases).map(async ({file}) => {
    const image = new Image();
    image.src = offline?.images[file] ?? root+file;
    await image.decode();
    images[file] = image;
  }));
  const cssImages = new Map<string,string>();
  const draw = (ctx:CanvasRenderingContext2D,id:string,x:number,y:number,options:{scale?:number;width?:number;height?:number}={}) =>
    drawAsset(ctx,manifest,images,id,Math.round(x),Math.round(y),options);
  const world = (ctx:CanvasRenderingContext2D,id:string,x:number,y:number,metre:number) => {
    const scale = metre / manifest.groundPixelsPerMetre;
    const [px,py] = manifest.assets[id].pivot!;
    draw(ctx,id,x-px*scale,y-py*scale,{scale});
  };
  // DOM panels retain native buttons and live type. Cache one source crop per
  // used UI part; CSS nine-slicing handles all panel sizes without repainting.
  function decorate(node:HTMLElement,id:string) {
    if (node.dataset.art===id) return;
    const entry=manifest.assets[id];
    let url=cssImages.get(id);
    if (!url) {
      const crop=document.createElement('canvas');
      [crop.width,crop.height]=entry.size;
      draw(crop.getContext('2d')!,id,0,0);
      url='url('+crop.toDataURL()+')';
      cssImages.set(id,url);
    }
    node.dataset.art=id;
    node.style.setProperty('--art-image',url);
    if (entry.insets) {
      const [left,top,right,bottom]=entry.insets;
      node.style.setProperty('--art-slice',[top,right,bottom,left].join(' '));
      node.style.setProperty('--art-border',[top,right,bottom,left].map(n=>n+'px').join(' '));
    }
  }
  return {draw,world,decorate};
}
export type Skin = Awaited<ReturnType<typeof loadSkin>>;
