export type Room = "gate" | "store" | "press" | "break" | "dispatch";
export type Itinerary = "ordinary" | "interrupted";
export type ReservationRule = "lost" | "kept";
type Action = { go: Room } | { do: "take" | "start" | "finish" | "deliver" };
export type FloorAction = "arrive" | "walk" | "take" | "start" | "finish" | "refuse" | "deliver";
export type FloorFrame = { action: FloorAction; room: Room; blank: boolean; job: "idle" | "active" | "done"; owner: boolean; delivered: boolean; visited: Room[]; conditions: string[]; event: string; failed: boolean };
export const roomNames: Record<Room, string> = {gate:"Gate",store:"Stockroom",press:"Press",break:"Break room",dispatch:"Dispatch"};
export const floorPositions: Record<Room, [number,number]> = {gate:[140,429],store:[120,217],press:[385,235],break:[600,217],dispatch:[580,450]};
export const conditionNames = ["Start with a blank", "Leave an active job", "Return to an active job", "Attempt completion", "Attempt delivery"];
const ordinary: Action[] = [{go:"store"},{do:"take"},{go:"press"},{do:"start"},{do:"finish"},{go:"break"},{go:"dispatch"},{do:"deliver"},{go:"gate"}];
const interrupted: Action[] = [{go:"store"},{do:"take"},{go:"press"},{do:"start"},{go:"break"},{go:"press"},{do:"finish"},{go:"dispatch"},{do:"deliver"},{go:"gate"}];
export function floorTrace(itinerary: Itinerary, rule: ReservationRule): FloorFrame[] {
  const first: FloorFrame = {action:"arrive",room:"gate",blank:false,job:"idle",owner:false,delivered:false,visited:["gate"],conditions:[],event:"Kit arrives at the gate. One blank is waiting in the stockroom.",failed:false};
  const frames = [first];
  for (const action of itinerary === "ordinary" ? ordinary : interrupted) {
    const previous = frames[frames.length-1];
    const frame: FloorFrame = {...previous,visited:[...previous.visited],conditions:[...previous.conditions],failed:false};
    const observe = (condition:string) => {if(!frame.conditions.includes(condition)) frame.conditions.push(condition);};
    if ("go" in action) {
      frame.action = "walk";
      if(frame.room === "press" && frame.job === "active") {observe("Leave an active job"); if(rule === "lost") frame.owner = false;}
      frame.room = action.go;
      if(!frame.visited.includes(action.go)) frame.visited.push(action.go);
      if(action.go === "press" && frame.job === "active") observe("Return to an active job");
      frame.event = `Kit enters ${roomNames[action.go].toLowerCase()}.`;
      if(previous.room === "press" && previous.job === "active") frame.event += rule === "lost" ? " The job stays on the press, but its reservation is erased." : " The unfinished job keeps Kit’s reservation.";
      if(action.go === "press" && frame.job === "active") frame.event += frame.owner ? " The reservation still names Kit." : " Nobody owns the unfinished job.";
    } else if(action.do === "take") {
      frame.action = "take";frame.blank = true; frame.event = "Kit takes the one blank from the stockroom.";
    } else if(action.do === "start") {
      frame.action = "start";observe("Start with a blank");frame.blank = false;frame.job = "active";frame.owner = true;frame.event = "The blank is placed on the press. Kit owns the unfinished job.";
    } else if(action.do === "finish") {
      observe("Attempt completion");
      if(frame.job === "active" && frame.owner) {frame.action = "finish";frame.job = "done";frame.event = "The reserved job finishes. One finished piece is ready for dispatch.";}
      else {frame.action = "refuse";frame.failed = true;frame.event = "Completion is refused: the unfinished job has no owner. The blank remains on the press.";}
    } else {
      observe("Attempt delivery");
      if(frame.job === "done") {frame.action = "deliver";frame.delivered = true;frame.event = "One finished piece is delivered.";}
      else {frame.action = "refuse";frame.failed = true;frame.event = "Delivery is refused: no finished piece is available.";}
    }
    frames.push(frame);
  }
  return frames;
}

export type Pilot = "low" | "high";
export type Aperture = "low" | "high" | "wide";
export const apertures: Record<Aperture, {top:number;bottom:number;name:string}> = {low:{top:174,bottom:274,name:"Lower opening"},high:{top:72,bottom:172,name:"Upper opening"},wide:{top:65,bottom:280,name:"Wide opening"}};
export function birdPoint(pilot:Pilot,x:number): [number,number] {return [x,(pilot === "low"?225:120)+12*Math.sin((x-70)/48)];}
// The authored study advances one horizontal unit per sample. The collision body
// is the visible 12-unit disk; appendages do not affect passage.
export function flight(pilot:Pilot,aperture:Aperture) {
  const gate = apertures[aperture], points: [number,number][] = [];
  for(let x=70;x<=650;x++) {
    const point=birdPoint(pilot,x);
    const dx = Math.max(340-x, 0, x-380);
    const upperDy = Math.max(point[1]-gate.top, 0, 45-point[1]);
    const lowerDy = Math.max(gate.bottom-point[1], 0, point[1]-322);
    if(dx*dx + Math.min(upperDy*upperDy, lowerDy*lowerDy) <= 144) return {points,passed:false,stop:points[points.length-1]};
    points.push(point);
  }
  return {points,passed:true,stop:points[points.length-1]};
}
