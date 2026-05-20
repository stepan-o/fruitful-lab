import "@testing-library/jest-dom";
import type { NextRequest, NextResponse } from "next/server";

jest.mock("@/lib/growthbook/edgeAdapter", () => ({
    growthbookAdapter: {
        initialize: jest.fn(),
    },
}));

import { growthbookAdapter } from "@/lib/growthbook/edgeAdapter";
import { applyExperimentCookies } from "@/lib/growthbook/middleware";
import { PINTEREST_POTENTIAL_EXPERIMENT } from "@/lib/experiments/config";
import { PINTEREST_POTENTIAL_VARIANT_COOKIE } from "@/lib/tools/pinterestPotentialConfig";

const ANON_COOKIE = "fp_anon_id";
const initialize = jest.mocked(growthbookAdapter.initialize);

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

describe("applyExperimentCookies – GrowthBook evaluation", () => {
    const originalKey = process.env.GROWTHBOOK_CLIENT_KEY;

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
        process.env.GROWTHBOOK_CLIENT_KEY = "test-key";
    });

    afterAll(() => {
        if (originalKey) process.env.GROWTHBOOK_CLIENT_KEY = originalKey;
        else delete process.env.GROWTHBOOK_CLIENT_KEY;
    });

    it("uses the GrowthBook-evaluated variant when the experiment is enabled", async () => {
        initialize.mockResolvedValueOnce({
            evalFeature: (key: string) => {
                if (key === `enable_${PINTEREST_POTENTIAL_EXPERIMENT.gbKey}`) {
                    return { on: true, value: true };
                }
                return { value: "no_welcome" };
            },
        });

        const req = makeReq({ [ANON_COOKIE]: "anon-123" });
        const res = makeRes();

        await applyExperimentCookies(
            req as unknown as NextRequest,
            res as unknown as NextResponse,
        );

        expect(initialize).toHaveBeenCalledTimes(1);
        expect(res.__calls).toHaveLength(1);
        expect(res.__calls[0]?.name).toBe(PINTEREST_POTENTIAL_VARIANT_COOKIE);
        expect(res.__calls[0]?.value).toBe("no_welcome");
    });

    it("uses the default variant when the GrowthBook enable flag is off", async () => {
        initialize.mockResolvedValueOnce({
            evalFeature: (key: string) => {
                if (key === `enable_${PINTEREST_POTENTIAL_EXPERIMENT.gbKey}`) {
                    return { on: false, value: false };
                }
                return { value: "no_welcome" };
            },
        });

        const req = makeReq({ [ANON_COOKIE]: "anon-123" });
        const res = makeRes();

        await applyExperimentCookies(
            req as unknown as NextRequest,
            res as unknown as NextResponse,
        );

        expect(initialize).toHaveBeenCalledTimes(1);
        expect(res.__calls).toHaveLength(1);
        expect(res.__calls[0]?.value).toBe(PINTEREST_POTENTIAL_EXPERIMENT.defaultVariant);
    });
});
