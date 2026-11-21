// 24-hour wall clock. The edited shift compresses a workday into playable minutes.
export const openingMinute=6*60, closingMinute=24*60;
export function dayOneMinute(seconds:number){
  return openingMinute+(closingMinute-openingMinute)*Math.min(1,seconds/165.4)+Math.max(0,seconds-165.4)/6;
}
export function dayTwoMinute(elapsed:number,workStart:number,workLength:number,morningSeconds:number){
  const morning=openingMinute+morningSeconds/60;
  // The entrance and briefing take place before the production clock starts.
  const morningRate=1/12;
  if(!workLength)return morning+elapsed*morningRate;
  const atWork=morning+workStart*morningRate;
  return atWork+(closingMinute-atWork)*Math.min(1,Math.max(0,(elapsed-workStart)/workLength));
}
export function clockText(minutes:number){
  const whole=Math.floor(minutes)%1440;
  return String(Math.floor(whole/60)).padStart(2,'0')+':'+String(whole%60).padStart(2,'0');
}
