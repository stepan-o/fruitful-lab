import {factoryClock} from './attention';
import type {View} from './contract';

/** Display only. Production and reading never end or advance the world clock. */
export function dayOneClock(tick:number,stage?:View['dayOne']){
 return stage?.stage==='night'?'End of shift':factoryClock(tick);
}

/** Use public progress and the current check, not a production enum as a crew claim. */
export function dayOneProgress(view:View|null):{heading:string;outputReady:boolean}|undefined{
 const day=view?.dayOne;if(!day||day.stage==='night')return undefined;
 if(view?.credentialStatus){
  const check=view.credentialStatus,name=view.actors.find(a=>a.id===check.actorId)?.name??check.actorId;
  return {heading:`${name} · credential check${check.verified?' complete':''}`,outputReady:false};
 }
 const outputReady=day.stage==='output';
 let heading:string;
 switch(day.stage){
  case 'staffing':heading='The shift joins the line';break;
  case 'production':
   heading=day.pairedOutputs===0?'The paired cycle is in progress':day.crew<8?'Second production output complete':'The staffed cycle is in progress';break;
  case 'output':heading=`Production output ${day.productionOutputs} complete`;break;
  case 'departure':heading='The shift is leaving';break;
  default:return undefined;
 }
 return {heading,outputReady};
}
