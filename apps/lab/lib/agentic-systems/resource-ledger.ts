import report from "../../public/loopforge-dev-blog/retrospectives/2026-10-25-second-retrospective/source/statistics.json";
import audit from "../../public/agentic-systems/evidence/close-cycle-audit-2026-10-25.json";

export type ResourceRow={role:string;input:number;cache_read:number;output:number;combined:number;count:number;median:number|null};
type AuditRow=typeof audit.windows.last_7h50.rows[number];
const rowFromAudit=(r:AuditRow):ResourceRow=>({role:r.role,input:r.uncached_input_tokens,cache_read:r.cached_input_tokens,output:r.output_tokens,combined:r.total_tokens,count:r.counted_input_requests,median:r.median_input_per_request});
const sum=(rows:ResourceRow[]):ResourceRow=>rows.reduce((a,r)=>({...a,input:a.input+r.input,cache_read:a.cache_read+r.cache_read,output:a.output+r.output,combined:a.combined+r.combined,count:a.count+r.count}),{role:"All ten roles",input:0,cache_read:0,output:0,combined:0,count:0,median:null});
const focused=audit.windows.last_7h50.rows.map(rowFromAudit),day=audit.windows.toronto_day.rows.map(rowFromAudit);
const older:ResourceRow[]=report.roles.map(r=>({role:r.role,input:r.input,cache_read:r.cache_read,output:r.output,combined:r.combined,count:r.sessions,median:null}));
export const ledgerSource="/loopforge-dev-blog/retrospectives/2026-10-25-second-retrospective/source/statistics.json";
const auditSource="/agentic-systems/evidence/close-cycle-audit-2026-10-25.json";
export const resourceWindows=[
 {id:"focused",label:"Later correction · 7 h 50 min",period:"25 Oct 2026 · 16:00–23:50 UTC · noon–19:50 Toronto",relationship:"This window sits inside the Toronto-day account. Do not add them.",rows:focused,total:sum(focused),countLabel:"input-bearing requests",method:audit.method,source:auditSource,limit:"Engine, Producer and Animator used Astra/xhigh throughout this window. Their median inputs describe context exposure, not a causal effect of model choice."},
 {id:"day",label:"Enclosing Toronto day · to cutoff",period:"25 Oct 2026 · 04:00–23:50 UTC · midnight–19:50 Toronto",relationship:"Contains the entire later correction window. It is not an additional charge.",rows:day,total:sum(day),countLabel:"input-bearing requests",method:audit.method,source:auditSource,limit:"The day ends at the audit cutoff, not midnight. Later work is absent; model choices changed earlier in this wider period."},
 {id:"earlier",label:"Earlier retrospective · separate method",period:"22 Oct 22:09:57.919591 UTC (exclusive) → 25 Oct 02:15:41.335719 UTC (inclusive)",relationship:"A separate earlier period and method. It does not include the later correction work.",rows:older,total:{...sum(older),count:report.counts.nativeSessionsWithinWindow},countLabel:"observed sessions",method:"Within each agent/session, the first in-window snapshot is excluded. Only nonnegative consecutive counter deltas are summed. Opening boundaries, unsampled tails, reset intervals and later work are absent.",source:ledgerSource,limit:"This inherited mapping subtracts cache reads from native input and has not been independently reconciled to a provider bill. Requested configuration does not verify every serving call."}
] as const;
export const resourceKinds=[
 {key:"input",label:"Uncached input",color:"#79a9a0",meaning:"Input after subtracting the cached portion. Adding this field to cache reads reconstructs reported input."},
 {key:"cache_read",label:"Cache reads",color:"#d0ac70",meaning:"Repeated input read from cache. It is already included in native input, and is not another charge to add to that native total."},
 {key:"output",label:"Output",color:"#bd8470",meaning:"Includes reasoning under the reported mapping. It does not count accepted code, prose or features."}
] as const;
export const resourceShare=(value:number,total:number)=>total>0?100*value/total:0;
