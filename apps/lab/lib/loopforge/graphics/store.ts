import {DEFAULT_GRAPHICS,parseGraphics,type GraphicsSettings} from './settings';
const KEY='loopforge.graphics.v1';
let value=DEFAULT_GRAPHICS,initialized=false;
const listeners=new Set<()=>void>();
function initialize(){
 if(initialized||typeof window==='undefined')return;initialized=true;
 try{value=parseGraphics(JSON.parse(localStorage.getItem(KEY)??'null'));}catch{value=DEFAULT_GRAPHICS;}
}
export function graphicsSnapshot(){initialize();return value;}
export function graphicsServerSnapshot(){return DEFAULT_GRAPHICS;}
export function saveGraphics(next:GraphicsSettings){
 initialize();value=parseGraphics(next);
 try{localStorage.setItem(KEY,JSON.stringify(value));}catch{/* Private/full storage: retain the in-session setting. */}
 listeners.forEach(fn=>fn());
}
function storageChanged(event:StorageEvent){if(event.key!==KEY&&event.key!==null)return;try{value=parseGraphics(JSON.parse(event.newValue??'null'));}catch{value=DEFAULT_GRAPHICS;}listeners.forEach(fn=>fn());}
export function subscribeGraphics(listener:()=>void){
 initialize();if(!listeners.size)window.addEventListener('storage',storageChanged);listeners.add(listener);
 return ()=>{listeners.delete(listener);if(!listeners.size)window.removeEventListener('storage',storageChanged);};
}
