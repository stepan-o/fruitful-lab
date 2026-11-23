'use client';
import {useEffect,useState,useSyncExternalStore,type RefObject} from 'react';

const subscribeToHydration=()=>()=>{};
const clientReady=()=>true;
const serverReady=()=>false;

/** Focus works while assets load, but is not advertised before handlers hydrate. */
export function useSceneFocus(initial:boolean,sceneReady:boolean,stage:RefObject<HTMLElement|null>){
 const [focused,setFocused]=useState(initial);
 // Server and first hydration snapshots agree. React switches to the client
 // snapshot once handlers are attached, without a mount-effect state setter.
 const focusReady=useSyncExternalStore(subscribeToHydration,clientReady,serverReady);
 // Asset completion can change the surrounding layout. Retain the requested view
 // and re-align it once, without forcing focus when the user opened review tools.
 useEffect(()=>{if(focused)stage.current?.scrollIntoView({block:'start',behavior:'auto'});},[focused,sceneReady,stage]);
 return {focused,focusReady,toggleFocus:()=>setFocused(value=>!value)};
}
