import "@testing-library/jest-dom";
import type { NextRequest, NextResponse } from "next/server";

// Spy on runServerExperiment so we don't hit GrowthBook
const runServerExperiment = jest
    .fn()
    .mockResolvedValue({ variant: "no_welcome", source: "fallback" });

jest.mock("@/lib/growthbook/experiments", () => ({
    runServerExperiment: (...args: unknown[]) => runServerExperiment(...args),
}));

import { applyExperimentCookies } from "@/lib/growthbook/middleware";
import { PINTEREST_POTENTIAL_EXPERIMENT } from "@/lib/experiments/config";
import { PINTEREST_POTENTIAL_VARIANT_COOKIE } from "@/lib/tools/pinterestPotentialConfig";

type MinimalReq = {
    cookies: { get: (name: string) => { name: string; value: string } | undefined };
    headers: Headers;
    nextUrl: { pathname: string };
};

type CookieSetCall = { name: string; value: string; opts: unknown };

type MinimalRes = {
    cookies: { set: (name: string, value: string, opts?: unknown) => void };
    __calls: CookieSetCall[];
};

describe("applyExperimentCookies – assignment + cookie persistence", () => {
    function makeReq(cookiesMap: Record<string, string> = {}): MinimalReq {
        return {
            cookies: {
                get: (name: string) =>
                    cookiesMap[name] ? { name, value: cookiesMap[name] } : undefined,
            },
            headers: new Headers(),
            nextUrl: { pathname: "/tools/pinterest-potential" },
        };
    }

    function makeRes(): MinimalRes {
        const setCalls: CookieSetCall[] = [];
        return {
            cookies: {
                set: (name: string, value: string, opts?: unknown) => {
                    setCalls.push({ name, value, opts });
                },
            },
            __calls: setCalls,
        };
    }

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("calls runServerExperiment and sets pp_variant when missing", async () => {
        const req = makeReq();
        const res = makeRes();

        await applyExperimentCookies(
            req as unknown as NextRequest,
            res as unknown as NextResponse,
        );

        expect(runServerExperiment).toHaveBeenCalledTimes(1);
        expect(runServerExperiment).toHaveBeenCalledWith(PINTEREST_POTENTIAL_EXPERIMENT);

        expect(res.__calls.length).toBe(1);
        const call = res.__calls[0];

        expect(call.name).toBe(PINTEREST_POTENTIAL_VARIANT_COOKIE);
        expect(["welcome", "no_welcome"]).toContain(call.value);
    });

    it("does not call runServerExperiment when valid cookie exists", async () => {
        const req = makeReq({ [PINTEREST_POTENTIAL_VARIANT_COOKIE]: "welcome" });
        const res = makeRes();

        await applyExperimentCookies(
            req as unknown as NextRequest,
            res as unknown as NextResponse,
        );

        expect(runServerExperiment).not.toHaveBeenCalled();
        expect(res.__calls.length).toBe(0);
    });
});