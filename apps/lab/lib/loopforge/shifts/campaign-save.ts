import type {Inheritance} from './simulation';
import {playtestQuota,type Progress} from './playthrough';
export type Campaign={
  version:1; id:string; phase:'intro'|'console'|'call'|'floor'; quota:number;
  seconds:number; source?:Inheritance; progress:Progress; room:'security'|'conveyor'; shotSeq:number;
};
const key='loopforge.playthrough.1';
export function freshCampaign():Campaign{
  return {version:1,id:crypto.randomUUID(),phase:'intro',quota:playtestQuota,seconds:0,
    progress:{tick:0,commands:[]},room:'security',shotSeq:0};
}
export function loadCampaign():Campaign|null{
  const raw=sessionStorage.getItem(key);if(!raw)return null;
  const data=JSON.parse(raw) as Campaign;
  if(data.version!==1||!data.id||!['intro','console','call','floor'].includes(data.phase)||
    data.phase!=='intro'&&!data.source)throw Error('Unsupported saved playthrough.');
  return data;
}
export function saveCampaign(run:Campaign){sessionStorage.setItem(key,JSON.stringify(run));}
export function endCampaign(){sessionStorage.removeItem(key);}
