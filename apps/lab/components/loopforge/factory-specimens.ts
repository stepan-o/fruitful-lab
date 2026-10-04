import { type NeuralWeave } from "./factory-neural";

export const specimenSlots = [0, 1, 2, 3, 5, 4, 3, 5, 1, 4, 2, 0] as const;
// Authored against the six 512px atlas cells: fibres enter the cortical folds
// and terminate at the actual fittings. No shared perimeter cable template.
const fibres = [
  [[110,286,104,255,138,248,130,218], [373,329,354,313,369,288,353,271]],
  [[91,277,109,263,93,239,121,222], [337,328,350,307,325,284,342,267]],
  [[184,299,201,279,184,264,205,244], [410,249,390,261,389,283,369,297]],
  [[340,260,367,278,346,303,382,319], [129,207,150,199,140,182,169,169]],
  [[367,232,353,259,382,275,382,300], [142,268,129,245,157,230,151,210]],
  [[131,277,149,266,130,245,160,227], [380,295,365,274,395,257,379,235]],
];
export function specimenWeave(variant: number, seed: number): NeuralWeave {
  const routes = fibres[variant].map(v => {
    const samples = Array.from({length:193}, (_, k): readonly [number,number] => {
    const t=k/192,u=1-t;
    const x=u*u*u*v[0]+3*u*u*t*v[2]+3*u*t*t*v[4]+t*t*t*v[6];
    const y=u*u*u*v[1]+3*u*u*t*v[3]+3*u*t*t*v[5]+t*t*t*v[7];
    return [x/512*210-105,y/512*210-172];
  });
    const lengths=[0];
    for(let k=1;k<samples.length;k++)lengths.push(lengths[k-1]+Math.hypot(samples[k][0]-samples[k-1][0],samples[k][1]-samples[k-1][1]));
    let cursor=1;
    return Array.from({length:65},(_,k):readonly [number,number]=>{
      const d=lengths[192]*k/64;while(cursor<192 && lengths[cursor]<d)cursor++;
      const f=(d-lengths[cursor-1])/(lengths[cursor]-lengths[cursor-1] || 1);
      return [samples[cursor-1][0]*(1-f)+samples[cursor][0]*f,samples[cursor-1][1]*(1-f)+samples[cursor][1]*f];
    });
  });
  return { routes, broken:variant===3, seed };
}
export function paintSpecimenFibres(c: CanvasRenderingContext2D, weave: NeuralWeave) {
  c.lineCap="round"; c.lineJoin="round";
  for(const route of weave.routes) {
    c.beginPath();c.moveTo(...route[0]);for(const p of route)c.lineTo(...p);
    c.strokeStyle="#001c20b0";c.lineWidth=2.4;c.stroke();
    // Minute three-strand twist, with short occlusions where tissue crosses it.
    for(let strand=0;strand<3;strand++) {
      c.beginPath();
      for(let k=0;k<route.length;k++) {
        const [x,y]=route[k],wind=Math.sin(k*.61+strand*Math.PI*2/3)*.36;
        if(k===0 || k===25 || k===49)c.moveTo(x+wind,y);else if(k%24<21)c.lineTo(x+wind,y);
      }
      c.strokeStyle=["#44a9aa","#0e686c","#b2d9cb"][strand];c.lineWidth=.43;c.stroke();
    }
  }
}
