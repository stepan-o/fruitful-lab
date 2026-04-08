import "@testing-library/jest-dom";
import type { NextRequest, NextResponse } from "next/server";

jest.mock("@/lib/growthbook/edgeAdapter", () => ({
    growthbookAdapter: {
        initialize: jest.fn().mockRejectedValue(new Error("skip-gb-in-tests")),
    },
}));

import { growthbookAdapter } from "@/lib/growthbook/edgeAdapter";
import {
    normalizeVariant,
    chooseVariantFromWeights,
    applyExperimentCookies,
} from "@/lib/growthbook/middleware";
import { PINTEREST_POTENTIAL_EXPERIMENT } from "@/lib/experiments/config";
import { PINTEREST_POTENTIAL_VARIANT_COOKIE } from "@/lib/tools/pinterestPotentialConfig";

const initialize = jest.mocked(growthbookAdapter.initialize);

describe("growthbook/middleware helpers", () => {
    test("normalizeVariant accepts only known variants", () => {
        expect(normalizeVariant("welcome")).toBe("welcome");
        expect(normalizeVariant("no_welcome")).toBe("no_welcome");
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
        type V = (typeof variants)[number];

        const weights: Partial<Record<V, number>> = { welcome: 0, no_welcome: 100 };

        for (let i = 0; i < 10; i++) {
            const picked = chooseVariantFromWeights(variants, weights);
            expect(picked).toBe("no_welcome");
        }
    });
});

describe("applyExperimentCookies", () => {
    const cookieName = PINTEREST_POTENTIAL_VARIANT_COOKIE;
    const anonCookieName = "fp_anon_id";

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

    test("sets anon and variant cookies when assignment is needed (fallback path)", async () => {
        const originalKey = process.env.GROWTHBOOK_CLIENT_KEY;
        delete process.env.GROWTHBOOK_CLIENT_KEY;

        const req = makeReq();
        const res = makeRes();

        await applyExperimentCookies(
            req as unknown as NextRequest,
            res as unknown as NextResponse,
        );

        expect(res.__calls).toHaveLength(2);
        expect(res.__calls.map((call) => call.name)).toEqual(
            expect.arrayContaining([anonCookieName, cookieName]),
        );

        const anonCall = res.__calls.find((call) => call.name === anonCookieName);
        expect(anonCall?.value).toBeTruthy();
        expect(anonCall?.opts).toEqual(
            expect.objectContaining({ httpOnly: true, sameSite: "lax" }),
        );

        const variantCall = res.__calls.find((call) => call.name === cookieName);
        expect(variantCall).toBeTruthy();
        expect(PINTEREST_POTENTIAL_EXPERIMENT.variants).toContain(variantCall?.value);
        expect(variantCall?.opts).toEqual(
            expect.objectContaining({ httpOnly: true, sameSite: "lax" }),
        );

        if (originalKey) process.env.GROWTHBOOK_CLIENT_KEY = originalKey;
    });

    test("does nothing when a valid cookie already exists", async () => {
        const valid = "welcome";
        const req = makeReq({ [cookieName]: valid });
        const res = makeRes();

        await applyExperimentCookies(
            req as unknown as NextRequest,
            res as unknown as NextResponse,
        );

        expect(res.__calls.length).toBe(0);
    });

    test("replaces invalid cookie with a valid one when anon id already exists", async () => {
        const req = makeReq({
            [anonCookieName]: "anon-123",
            [cookieName]: "not-a-variant",
        });
        const res = makeRes();

        await applyExperimentCookies(
            req as unknown as NextRequest,
            res as unknown as NextResponse,
        );

        expect(res.__calls.length).toBe(1);
        const call = res.__calls[0];
        expect(call.name).toBe(cookieName);
        expect(PINTEREST_POTENTIAL_EXPERIMENT.variants).toContain(call.value);
        expect(call.opts).toEqual(
            expect.objectContaining({ httpOnly: true, sameSite: "lax" }),
        );
    });
});
