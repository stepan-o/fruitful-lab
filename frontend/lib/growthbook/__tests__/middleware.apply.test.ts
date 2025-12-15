import "@testing-library/jest-dom";

// Spy on runServerExperiment so we don't hit GB
const runServerExperiment = jest.fn().mockResolvedValue({ variant: "v2", source: "fallback" });
jest.mock("@/lib/growthbook/experiments", () => ({
  runServerExperiment: (...args: any[]) => (runServerExperiment as any)(...args),
}));

import { applyExperimentCookies } from "@/lib/growthbook/middleware";
import { PINTEREST_POTENTIAL_EXPERIMENT } from "@/lib/experiments/config";
import { PINTEREST_POTENTIAL_VARIANT_COOKIE } from "@/lib/tools/pinterestPotentialConfig";

describe("applyExperimentCookies – assignment + cookie persistence", () => {
  function makeReq(cookiesMap: Record<string, string> = {}) {
    return {
      cookies: {
        get: (name: string) => (cookiesMap[name] ? { name, value: cookiesMap[name] } : undefined),
      },
      headers: new Headers(),
    } as any;
  }
  function makeRes() {
    const setCalls: Array<{ name: string; value: string; opts: any }> = [];
    return {
      cookies: {
        set: (name: string, value: string, opts?: any) => setCalls.push({ name, value, opts }),
      },
      __calls: setCalls,
    } as any;
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls runServerExperiment and sets pp_variant when missing", async () => {
    const req = makeReq();
    const res = makeRes();
    await applyExperimentCookies(req, res);
    expect(runServerExperiment).toHaveBeenCalledTimes(1);
    expect(runServerExperiment).toHaveBeenCalledWith(PINTEREST_POTENTIAL_EXPERIMENT);
    expect(res.__calls.length).toBe(1);
    const call = res.__calls[0];
    expect(call.name).toBe(PINTEREST_POTENTIAL_VARIANT_COOKIE);
    expect(["v1", "v2"]).toContain(call.value);
  });

  it("does not call runServerExperiment when valid cookie exists", async () => {
    const req = makeReq({ [PINTEREST_POTENTIAL_VARIANT_COOKIE]: "v1" });
    const res = makeRes();
    await applyExperimentCookies(req, res);
    expect(runServerExperiment).not.toHaveBeenCalled();
    expect(res.__calls.length).toBe(0);
  });
});
