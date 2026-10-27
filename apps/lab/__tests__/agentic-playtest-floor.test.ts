import {floorTrace,flight,type Itinerary,type ReservationRule,type Pilot,type Aperture} from "../lib/agentic-systems/playtest-floor";

describe("the authored playtest situations",()=>{
  it("visits the same named rooms while distinguishing uninterrupted work from recovery",()=>{
    for(const rule of ["lost","kept"] as ReservationRule[]) {
      const normal=floorTrace("ordinary",rule).at(-1)!, interrupted=floorTrace("interrupted",rule).at(-1)!;
      expect([...normal.visited].sort()).toEqual([...interrupted.visited].sort());
      expect(normal.visited).toHaveLength(5);
      expect(normal.delivered).toBe(true);
      expect(interrupted.delivered).toBe(rule === "kept");
      expect(normal.conditions).not.toContain("Return to an active job");
      expect(interrupted.conditions).toContain("Return to an active job");
    }
  });
  it("retains an unfinished blank on failure and never reports delivery before completion",()=>{
    for(const route of ["ordinary","interrupted"] as Itinerary[]) for(const rule of ["lost","kept"] as ReservationRule[]) {
      const frames=floorTrace(route,rule);
      for(const f of frames) {if(f.delivered) expect(f.job).toBe("done");if(f.job !== "idle") expect(f.blank).toBe(false);}
      expect(frames[0].visited).toEqual(["gate"]);
      expect(frames[0].conditions).toEqual([]);
    }
    const failed=floorTrace("interrupted","lost");
    expect(failed.filter(f=>f.failed)).toHaveLength(2);
    expect(failed.at(-1)!.job).toBe("active");
  });
  it("makes compatibility depend on the selected pilot, with no invented player score",()=>{
    for(const pilot of ["low","high"] as Pilot[]) for(const aperture of ["low","high","wide"] as Aperture[]) {
      const result=flight(pilot,aperture);
      expect(result.passed).toBe(aperture === "wide" || aperture === pilot);
      expect(result.stop[0]).toBe(result.passed ? 650 : 327);
      expect(result.points[0][0]).toBe(70);
    }
  });
});
