import "@testing-library/jest-dom";

// Mock the GrowthBook adapter to avoid importing Next server polyfills in tests
jest.mock("@/lib/growthbook/flags", () => ({
  growthbookAdapter: {
    initialize: jest.fn().mockRejectedValue(new Error("skip-gb-in-tests")),
  },
}));

import {
    normalizeVariant,
    chooseVariantFromWeights,
    applyExperimentCookies,
} from "@/lib/growthbook/middleware";
import { PINTEREST_POTENTIAL_EXPERIMENT } from "@/lib/experiments/config";
import { PINTEREST_POTENTIAL_VARIANT_COOKIE } from "@/lib/tools/pinterestPotentialConfig";

describe("growthbook/middleware helpers", () => {
  test("normalizeVariant accepts only known variants", () => {
    expect(normalizeVariant("v1")).toBe("v1");
    expect(normalizeVariant("v2")).toBe("v2");
    expect(normalizeVariant("foo")).toBeUndefined();
    expect(normalizeVariant(undefined)).toBeUndefined();
  });

  test("chooseVariantFromWeights falls back to even split when no weights", () => {
    const variants = [...PINTEREST_POTENTIAL_EXPERIMENT.variants];
    const picked = chooseVariantFromWeights(variants);
    expect(variants).toContain(picked);
  });

  test("chooseVariantFromWeights respects strong weight bias", () => {
    const variants = [...PINTEREST_POTENTIAL_EXPERIMENT.variants];
    const weights: Record<string, number> = { v1: 0, v2: 100 };
    // Run multiple times; should always pick v2 given zero weight for v1
    for (let i = 0; i < 10; i++) {
      const picked = chooseVariantFromWeights(variants as any, weights as any);
      expect(picked).toBe("v2");
    }
  });
});

describe("applyExperimentCookies", () => {
  const cookieName = PINTEREST_POTENTIAL_VARIANT_COOKIE;

  function makeReq(cookiesMap: Record<string, string> = {}) {
    return {
      cookies: {
        get: (name: string) =>
          cookiesMap[name] ? { name, value: cookiesMap[name] } : undefined,
      },
      headers: new Headers(),
      nextUrl: { pathname: "/tools/pinterest-potential" },
    } as any;
  }

  function makeRes() {
    const setCalls: Array<{ name: string; value: string; opts: any }> = [];
    return {
      cookies: {
        set: (name: string, value: string, opts?: any) => {
          setCalls.push({ name, value, opts });
        },
      },
      __calls: setCalls,
    } as any;
  }

  test("sets a valid variant cookie when none exists (fallback path)", async () => {
    // Ensure GB is skipped so we hit fallback (no client key)
    const originalKey = process.env.GROWTHBOOK_CLIENT_KEY;
    delete process.env.GROWTHBOOK_CLIENT_KEY;

    const req = makeReq();
    const res = makeRes();
    await applyExperimentCookies(req, res);

    expect(res.__calls.length).toBe(1);
    const call = res.__calls[0];
    expect(call.name).toBe(cookieName);
    expect(PINTEREST_POTENTIAL_EXPERIMENT.variants).toContain(call.value);

    // restore env
    if (originalKey) process.env.GROWTHBOOK_CLIENT_KEY = originalKey;
  });

  test("does nothing when a valid cookie already exists", async () => {
    const valid = "v1";
    const req = makeReq({ [cookieName]: valid });
    const res = makeRes();
    await applyExperimentCookies(req, res);
    expect(res.__calls.length).toBe(0);
  });

  test("replaces invalid cookie with a valid one", async () => {
    const req = makeReq({ [cookieName]: "not-a-variant" });
    const res = makeRes();
    await applyExperimentCookies(req, res);
    expect(res.__calls.length).toBe(1);
    const call = res.__calls[0];
    expect(call.name).toBe(cookieName);
    expect(PINTEREST_POTENTIAL_EXPERIMENT.variants).toContain(call.value);
  });
});
