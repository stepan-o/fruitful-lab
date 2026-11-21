// The archive player keeps its recorded score. Ordinary play uses this blocking.
import {score,tickAt} from './floor';

type Key={t:number;p:number[]};
const key=(t:number,x:number,y:number):Key=>({t,p:[x,y]});
const replace=(track:Key[],from:number,to:number,...keys:Key[])=>
  [...track.filter(k=>k.t<from),...keys,...track.filter(k=>k.t>to)];
const tracks=score.tracks;
export const playableTracks={
  ...tracks,
  ed:tracks.ed.map(k=>k.t>=89&&k.t<92?{...k,t:k.t+2.4}:k),
  gus:tracks.gus.map(k=>k.t>=89&&k.t<94?{...k,t:k.t+1.8}:k),
  // bob frees the old press, then feeds and washes the second carrier.
  bob:replace(tracks.bob,116,146,key(116.5,119.7,144.4),key(118.6,119.7,144.4),key(121.2,123.7,144.4)),
  sam:replace(tracks.sam,99,102,key(142.8,122.1,142.05),key(146.5,119.7,144.4)),
  jo:replace(tracks.jo,144,146,key(119,126.8,142.5),key(121.6,127.7,144.4),
    key(125.8,127.7,144.4),key(128.4,131.7,144.4),key(139,131.7,144.4),key(142.5,127.7,144.4)),
};
const line=(speaker:string,text:string,start:number,end:number)=>({speaker,text,start,end,aside:''});
export const playableSpeech=score.speech.map((l,i)=>{
  if(i>=20&&i<=23)return {...l,end:88.7};
  if(i===24)return {...l,start:94.6,end:95.6};
  if(i===26)return {...l,text:'Intake again, bob. Then stay on Wash.',end:100.3};
  if(i===27)return {...l,start:103.4,end:104.7};
  if(i===28)return {...l,start:104.8,end:107};
  if(i===30)return {...l,start:122.5,end:124.6};
  if(i===31)return {...l,start:124.65,end:127.8};
  return l;
}).concat([
  line('LIMEN','Okay. Ledger, take the book. Loudspeaker, call the queue.',89.45,94.35),
  line('bob','I think I’m stuck.',101,103.3),
  line('STILETTO','jo! Third station. Start the belt, then take it to the press.',117.1,122.45),
]);
export const secondStarts=[116.6,121.4,124.3,128.5];
export const secondEnds=[118.3,123.3,125.8,130.15];
export const tutorialOrders=[
  {at:49.8,station:'Intake',text:playableSpeech[13].text},
  {at:56.7,station:'Wash',text:playableSpeech[14].text},
  {at:65.5,station:'Belt',text:playableSpeech[15].text},
  {at:72,station:'Forge',text:playableSpeech[16].text},
  {at:115.9,station:'Intake',text:'bob, load the second brain.'},
  {at:120.5,station:'Wash',text:'bob, wash it. Stay there.'},
  {at:123.8,station:'Belt',text:'jo, start the belt.'},
  {at:128,station:'Forge',text:'jo, take the press.'},
].map(order=>({...order,tick:tickAt(order.at)}));
