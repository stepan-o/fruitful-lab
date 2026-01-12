import "@testing-library/jest-dom";

// Prevent GrowthBook from interfering in these tests
jest.mock("@/lib/growthbook/middleware", () => ({
    applyExperimentCookies: jest.fn(),
}));

// Mock next/server so we can inspect redirects/cookies
const redirectMock = jest.fn();
const nextMock = jest.fn();

jest.mock("next/server", () => ({
    NextResponse: {
        next: (...args: unknown[]) => nextMock(...args),
        redirect: (...args: unknown[]) => redirectMock(...args),
    },
}));

import { middleware } from "@/middleware";

type MiddlewareReq = Parameters<typeof middleware>[0];

type CookieGetResult = { name: string; value: string } | undefined;

function makeReq({
                     pathname,
                     search = "",
                     cookie,
                     origin = "http://localhost:3000",
                 }: {
    pathname: string;
    search?: string;
    cookie?: string | null;
    origin?: string;
}): MiddlewareReq {
    const url = `${origin}${pathname}${search}`;

    const reqLike = {
        url,
        nextUrl: { pathname, search },
        cookies: {
            get: (name: string): CookieGetResult =>
                name === "fruitful_access_token" && cookie ? { name, value: cookie } : undefined,
        },
    };

    // The middleware expects NextRequest, but in tests we only provide the shape it uses.
    return reqLike as unknown as MiddlewareReq;
}

function makeRedirectResponse(): { cookies: { set: jest.Mock } } {
    const set = jest.fn();
    return { cookies: { set } };
}

function makeNextResponse(): { cookies: { set: jest.Mock } } {
    const set = jest.fn();
    return { cookies: { set } };
}

describe("middleware auth policy", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        // Provide a fetch mock for the middleware to call.
        (globalThis as unknown as { fetch: jest.Mock }).fetch = jest.fn();

        redirectMock.mockImplementation(() => makeRedirectResponse());
        nextMock.mockImplementation(() => makeNextResponse());
    });

    test("unauthenticated /admin redirects to /login with next param", async () => {
        const req = makeReq({ pathname: "/admin/dashboard" });
        const res = await middleware(req);

        expect(redirectMock).toHaveBeenCalledTimes(1);
        const urlArg = redirectMock.mock.calls[0][0] as { toString: () => string };
        expect(urlArg.toString()).toContain("/login");
        expect(urlArg.toString()).toContain("next=%2Fadmin%2Fdashboard");
        expect(res).toBeTruthy();
    });

    test("invalid token clears cookie and redirects to login", async () => {
        const fetchMock = (globalThis as unknown as { fetch: jest.Mock }).fetch;
        fetchMock.mockResolvedValueOnce({ ok: false });

        const req = makeReq({ pathname: "/admin/dashboard", cookie: "badtoken" });
        const res = (await middleware(req)) as unknown as { cookies: { set: jest.Mock } };

        expect(redirectMock).toHaveBeenCalledTimes(1);
        expect(res.cookies.set).toHaveBeenCalled(); // cookie cleared
    });

    test("general user hitting /admin is redirected to /tools", async () => {
        const fetchMock = (globalThis as unknown as { fetch: jest.Mock }).fetch;
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ is_admin: false, groups: [] }),
        });

        const req = makeReq({ pathname: "/admin/dashboard", cookie: "tok" });
        await middleware(req);

        const urlArg = redirectMock.mock.calls[0][0] as { toString: () => string };
        expect(urlArg.toString()).toContain("/tools");
    });

    test("contractor hitting /admin is redirected to /contractor", async () => {
        const fetchMock = (globalThis as unknown as { fetch: jest.Mock }).fetch;
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ is_admin: false, groups: ["contractor"] }),
        });

        const req = makeReq({ pathname: "/admin/dashboard", cookie: "tok" });
        await middleware(req);

        const urlArg = redirectMock.mock.calls[0][0] as { toString: () => string };
        expect(urlArg.toString()).toContain("/contractor");
    });

    test("admin can access /admin", async () => {
        const fetchMock = (globalThis as unknown as { fetch: jest.Mock }).fetch;
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ is_admin: true, groups: [] }),
        });

        const req = makeReq({ pathname: "/admin/dashboard", cookie: "tok" });
        await middleware(req);

        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(redirectMock).not.toHaveBeenCalled();
    });

    test("contractor can access /contractor", async () => {
        const fetchMock = (globalThis as unknown as { fetch: jest.Mock }).fetch;
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ is_admin: false, groups: ["contractor"] }),
        });

        const req = makeReq({ pathname: "/contractor", cookie: "tok" });
        await middleware(req);

        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(redirectMock).not.toHaveBeenCalled();
    });
});
