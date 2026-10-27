import report from "../../public/loopforge-dev-blog/retrospectives/2026-10-25-second-retrospective/source/statistics.json";

/** Published interval deltas; neither an invoice nor a complete production total. */
export const resourceRoles = report.roles;
export const resourceTotal = {role:"All ten roles",input:report.observedTokenLowerBound.uncachedInputReported,cache_read:report.observedTokenLowerBound.cachedInputReadReported,output:report.observedTokenLowerBound.outputReported,combined:report.observedTokenLowerBound.combined,sessions:report.counts.nativeSessionsWithinWindow};
export const resourceWindow = report.reportingInterval;
export const resourceKinds = [
 {key:"input",label:"Uncached input",color:"#79a9a0",meaning:"The ledger subtracts cache reads from native input. This inherited mapping has not been independently reconciled to a provider bill."},
 {key:"cache_read",label:"Cache reads",color:"#d0ac70",meaning:"Counted input read from cache. Repeated context can be useful; this field alone cannot identify waste."},
 {key:"output",label:"Output",color:"#bd8470",meaning:"Includes reasoning under the reported mapping. It does not count accepted code, prose or features."}
] as const;
export const ledgerSource="/loopforge-dev-blog/retrospectives/2026-10-25-second-retrospective/source/statistics.json";
