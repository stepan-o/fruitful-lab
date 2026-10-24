export type CaptureFile={url:string;name:string};
/** One owned download and one current request. Late callbacks never create URLs. */
export function createCaptureResults(createURL:(blob:Blob)=>string,revokeURL:(url:string)=>void){
 let request=0,pending=false,file:CaptureFile|null=null;
 function release(){if(file){revokeURL(file.url);file=null;}}
 return {
  begin(){request++;pending=true;release();return request;},
  isCurrent(id:number){return id===request;},
  isPending(id:number){return id===request&&pending;},
  complete(id:number,blob:Blob,name:string){
   if(id!==request||!pending)return null;
   const next={url:createURL(blob),name};file=next;pending=false;return next;
  },
  fail(id:number){if(id!==request)return false;pending=false;release();return true;},
  dispose(){request++;pending=false;release();}
 };
}
