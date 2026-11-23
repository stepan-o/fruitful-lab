export const limenIdleDuration=11;
const smooth=(a:number,b:number,t:number)=>{const x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x);};
/** Pure, seekable cosmetic cue. No gameplay RNG or animation callbacks. */
export function limenIdleCue(time:number,reduced=false){
 const t=Math.max(0,Math.min(11,time));
 let power=1-smooth(3.05,3.55,t)+smooth(6.05,6.55,t);
 if(!reduced&&t>=4.45&&t<5.85){
  // Two short, local attempts to strike the current. No screen-wide flash.
  power=.45*(smooth(4.45,4.56,t)-smooth(4.68,4.84,t))+.7*(smooth(5.18,5.30,t)-smooth(5.47,5.65,t));
 }
 return {power,adjust:t>=6.6?0:Math.sin(Math.PI*smooth(3.3,6.6,t)),surge:reduced?0:smooth(6.05,6.25,t)*(1-smooth(6.55,7.0,t)),label:t<1.1||t>=10.5?'Standby':t<3.05?'Inspect the edge':t<3.55?'Power down':t<6.05?'Adjust the emitter':t<6.65?'Reignite':t<8.4?'Check the current':'Return to standby'};
}

export const limenIdleBeats=[{label:'Inspect',time:2.8},{label:'Power off',time:3.9},{label:'Adjust',time:4.75},{label:'Reignite',time:6.3},{label:'Check',time:7.7}] as const;
