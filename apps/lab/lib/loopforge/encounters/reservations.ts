/** Atomic actor, station and prop ownership, independent of planner and renderer. */
export function reserve(resources:readonly string[],owner:string,held:Record<string,string>):Record<string,string>|null {
 if(new Set(resources).size!==resources.length||resources.some(id=>held[id]&&held[id]!==owner))return null;
 return {...held,...Object.fromEntries(resources.map(id=>[id,owner]))};
}
