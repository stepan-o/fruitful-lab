/** Shared page/export geometry: preserve the complete source image. */
export function containRect(width:number,height:number,sourceWidth:number,sourceHeight:number){
 if([width,height,sourceWidth,sourceHeight].some(n=>!Number.isFinite(n)||n<=0))throw Error('Invalid presentation dimensions');
 const scale=Math.min(width/sourceWidth,height/sourceHeight),w=sourceWidth*scale,h=sourceHeight*scale;
 return {x:(width-w)/2,y:(height-h)/2,width:w,height:h};
}
