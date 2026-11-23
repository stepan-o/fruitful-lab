// Optional provenance refresh, not a build dependency. Requires Node 22+.
// node --experimental-strip-types scripts/capture-loopforge-example.mjs /absolute/path/to/loopforge-presentation-repo
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";

const sourceRoot=process.argv[2];
if(!sourceRoot) throw new Error("Supply the inspected Loopforge presentation repository root.");
const source=resolve(sourceRoot,"apps/lab/lib/loopforge/engine.ts");
const {initialState,transition,defaultAssignments,ENGINE_VERSION}=await import(pathToFileURL(source).href);
let base=initialState(42);
for(let i=0;i<3;i++) {
  const result=transition(base,{type:"resolve",assignments:defaultAssignments,doctrine:"balanced"});
  if(!result.ok) throw new Error(result.error);
  base=result.state;
}
const results={};
for(const doctrine of ["care","pressure"]) {
  const result=transition(base,{type:"resolve",assignments:defaultAssignments,doctrine});
  if(!result.ok) throw new Error(result.error);
  results[doctrine]=result.event;
}
const captured={version:ENGINE_VERSION,sourceCommit:execFileSync("git",["-C",sourceRoot,"rev-parse","--short=7","HEAD"],{encoding:"utf8"}).trim(),sourceSha256:createHash("sha256").update(await readFile(source)).digest("hex"),captured:new Date().toISOString().slice(0,10),seed:42,priorPolicies:["balanced","balanced","balanced"],assignments:defaultAssignments,start:{shift:base.shift,total:base.total,strain:base.strain},results};
const destination=fileURLToPath(new URL("../lib/sanctuary/loopforge-example.json",import.meta.url));
await writeFile(destination,JSON.stringify(captured,null,2)+"\n");
console.log(`Captured ${ENGINE_VERSION} example. Review figure labels and authored dialogue before publishing changed values.`);
