import type {Run} from './contract';
import {draw,knows} from './dialogue';

// The card is in hand here. Physical presentation is drawn once on admission and
// retained in the private check record, including while the check is suspended.
const presentations:Record<string,string>={
  C01:'card offered',C02:'card set down',C03:'name requested',C04:'subject alone',C05:'waiting for card',
  C06:'silent comparison',C07:'name masked',C08:'hand extended',C09:'faint stamp',C10:'chin lowered',
  C11:'thumb on face',C12:'back showing',C13:'card inverted',C14:'glare',C15:'grit on card',
  C16:'wrong slip',C17:'snagged pocket',C18:'card hooks book',C19:'two hands extended',C20:'stain on photo',
  C21:'book open',C22:'known worker',C23:'witnesses waiting',C24:'name legible',C25:'waiting costs work',
  C26:'request recognition',C27:'uneventful desk',C28:'card crooked',C29:'unsealed passage',C30:'roster search'
};
export function checkReading(s:Run,id:string,missing:boolean){
  if(missing){
    if(id==='kit'&&s.pass?.holder==='kit')return 'M04';
    if(id==='bob')return s.marks.some(e=>e.kind==='custody.admitted'&&e.subject==='bob')?'M03':'M01';
    return 'M02';
  }
  if(id==='sam'&&knows(s,'ed','loose.entry'))return 'C31';
  if(id==='max'&&!knows(s,'LIMEN','against.protocol'))return 'C10';
  const personal:Record<string,string[]>={ben:['C32'],max:knows(s,'gus','encore')?['C33']:[],
    jo:knows(s,'jo','desk.released')?['C34','C40']:['C40'],mae:knows(s,'mae','tray.hand')?['C35']:[],
    sam:knows(s,'sam','shared.tray')?['C36']:[],bob:knows(s,'bob','recognized.original')?['C37']:[],
    lou:['C38'],kit:knows(s,'kit','heard.call')?['C39']:[]};
  const general=Object.keys(presentations).filter(key=>key!=='C23'||s.queue.length>1);
  const choice=draw(s,[...general,...personal[id]??[]]);
  s.dialogue.intent[id]=presentations[choice]??'answer about own work';
  return choice;
}
