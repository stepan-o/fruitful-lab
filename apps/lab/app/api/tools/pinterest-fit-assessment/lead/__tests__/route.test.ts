const g = globalThis as unknown as Record<string, unknown>;

if (typeof g.Request === "undefined") {
    g.Request = class MinimalRequest {} as unknown;
}

if (
    typeof g.Response === "undefined" ||
    typeof (g.Response as { json?: unknown }).json !== "function"
) {
    class MinimalResponse {
        static json(data: unknown, init?: { status?: number; headers?: unknown }) {
            const status = init?.status ?? 200;
            return {
                status,
                json: async () => data,
                headers: init?.headers ?? {},
            };
        }
    }
    g.Response = MinimalResponse as unknown;
}

if (typeof g.Headers === "undefined") {
    g.Headers = class MinimalHeaders {} as unknown;
}

import "@testing-library/jest-dom";

jest.mock("next/server", () => ({
    NextResponse: {
        json: (data: unknown, init?: { status?: number }) => ({
            status: init?.status ?? 200,
            json: async () => data,
        }),
    },
}));

type RouteResponse = { status: number; json: () => Promise<unknown> };
type PostReq = { json: () => Promise<unknown> };

let POST: (req: PostReq) => Promise<RouteResponse>;

const mailerLiteFieldsResponse = [
    { name: "Pinterest Fit Result", key: "pinterest_fit_result", type: "text" },
    { name: "Top Reason 1", key: "top_reason_1", type: "text" },
    { name: "Top Reason 2", key: "top_reason_2", type: "text" },
    { name: "Top Reason 3", key: "top_reason_3", type: "text" },
    { name: "Pinterest Role", key: "pinterest_role", type: "text" },
    { name: "Recommended Next Step", key: "recommended_next_step", type: "text" },
    { name: "Lead Source", key: "lead_source", type: "text" },
];

const strongLeadFields = {
    pinterest_fit_result: "Strong Pinterest Fit",
    top_reason_1: "Your niche has strong Pinterest potential.",
    top_reason_2: "You already have a product with real traction.",
    top_reason_3: "You are ready to take action.",
    pinterest_role: "Pinterest looks most promising here as a discovery and traffic channel.",
    recommended_next_step: "Want to talk through what this could look like for your brand?",
    lead_source: "Pinterest Fit Assessment",
};

const strongLeadPayload = {
    email: "Founder@Example.com",
    result: strongLeadFields.pinterest_fit_result,
    topReason1: strongLeadFields.top_reason_1,
    topReason2: strongLeadFields.top_reason_2,
    topReason3: strongLeadFields.top_reason_3,
    pinterestRole: strongLeadFields.pinterest_role,
    recommendedNextStep: strongLeadFields.recommended_next_step,
    source: strongLeadFields.lead_source,
};

describe("/api/tools/pinterest-fit-assessment/lead route", () => {
    const originalApiKey = process.env.MAILERLITE_API_KEY;
    const originalGroupId = process.env.MAILERLITE_PINTEREST_FIT_GROUP_ID;
    const originalFetch = global.fetch;

    beforeAll(async () => {
        const routeMod = (await import("@/app/api/tools/pinterest-fit-assessment/lead/route")) as unknown as {
            POST: (req: PostReq) => Promise<RouteResponse>;
        };
        POST = routeMod.POST;
    });

    beforeEach(() => {
        process.env.MAILERLITE_API_KEY = "test-mailerlite-token";
        process.env.MAILERLITE_PINTEREST_FIT_GROUP_ID = "group-123";
        global.fetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = String(input);
            const method = init?.method ?? "GET";

            if (url.endsWith("/fields?limit=100")) {
                return {
                    ok: true,
                    json: async () => ({ data: mailerLiteFieldsResponse }),
                } as Response;
            }

            if (url.endsWith("/subscribers") && method === "POST") {
                return {
                    ok: true,
                    json: async () => ({ data: { id: "subscriber-123" } }),
                } as Response;
            }

            if (url.endsWith("/subscribers/subscriber-123") && method === "PUT") {
                return {
                    ok: true,
                    json: async () => ({
                        data: {
                            id: "subscriber-123",
                            fields: strongLeadFields,
                        },
                    }),
                } as Response;
            }

            if (url.endsWith("/subscribers/subscriber-123/groups/group-123") && method === "POST") {
                return {
                    ok: true,
                    json: async () => ({ data: { id: "subscriber-123" } }),
                } as Response;
            }

            if (url.endsWith("/subscribers/subscriber-123") && method === "GET") {
                return {
                    ok: true,
                    json: async () => ({
                        data: {
                            id: "subscriber-123",
                            fields: strongLeadFields,
                        },
                    }),
                } as Response;
            }

            throw new Error(`Unexpected fetch: ${method} ${url}`);
        });
    });

    afterEach(() => {
        global.fetch = originalFetch;
        process.env.MAILERLITE_API_KEY = originalApiKey;
        process.env.MAILERLITE_PINTEREST_FIT_GROUP_ID = originalGroupId;
    });

    it("adds the subscriber to MailerLite with email, result, source, and group", async () => {
        const res = await POST({
            json: async () => ({
                email: " Founder@Example.com ",
                result: strongLeadPayload.result,
                topReason1: strongLeadPayload.topReason1,
                topReason2: strongLeadPayload.topReason2,
                topReason3: strongLeadPayload.topReason3,
                pinterestRole: strongLeadPayload.pinterestRole,
                recommendedNextStep: strongLeadPayload.recommendedNextStep,
                source: strongLeadPayload.source,
            }),
        });

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ ok: true });

        const fetchMock = global.fetch as jest.Mock;
        const subscriberCall = fetchMock.mock.calls.find(([url, init]) => {
            return String(url).endsWith("/subscribers") && init?.method === "POST";
        });

        expect(subscriberCall).toBeDefined();
        expect(JSON.parse(subscriberCall?.[1]?.body as string)).toEqual({
            email: "founder@example.com",
            groups: ["group-123"],
            fields: strongLeadFields,
        });

        const assignGroupCall = fetchMock.mock.calls.find(([url, init]) => {
            return String(url).endsWith("/subscribers/subscriber-123/groups/group-123") && init?.method === "POST";
        });

        expect(assignGroupCall).toBeDefined();

        const updateFieldsCall = fetchMock.mock.calls.find(([url, init]) => {
            return String(url).endsWith("/subscribers/subscriber-123") && init?.method === "PUT";
        });

        expect(updateFieldsCall).toBeDefined();
        expect(JSON.parse(updateFieldsCall?.[1]?.body as string)).toEqual({
            fields: strongLeadFields,
        });
    });

    it("looks up the subscriber before assigning the group when MailerLite omits the id from subscribe", async () => {
        global.fetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = String(input);
            const method = init?.method ?? "GET";

            if (url.endsWith("/fields?limit=100")) {
                return {
                    ok: true,
                    json: async () => ({ data: mailerLiteFieldsResponse }),
                } as Response;
            }

            if (url.endsWith("/subscribers") && method === "POST") {
                return {
                    ok: true,
                    json: async () => ({ data: {} }),
                } as Response;
            }

            if (url.endsWith("/subscribers/founder%40example.com") && method === "GET") {
                return {
                    ok: true,
                    json: async () => ({ data: { id: "subscriber-lookup-123" } }),
                } as Response;
            }

            if (url.endsWith("/subscribers/subscriber-lookup-123/groups/group-123") && method === "POST") {
                return {
                    ok: true,
                    json: async () => ({ data: { id: "subscriber-lookup-123" } }),
                } as Response;
            }

            if (url.endsWith("/subscribers/subscriber-lookup-123") && method === "PUT") {
                return {
                    ok: true,
                    json: async () => ({ data: { id: "subscriber-lookup-123" } }),
                } as Response;
            }

            if (url.endsWith("/subscribers/subscriber-lookup-123") && method === "GET") {
                return {
                    ok: true,
                    json: async () => ({
                        data: {
                            id: "subscriber-lookup-123",
                            fields: strongLeadFields,
                        },
                    }),
                } as Response;
            }

            throw new Error(`Unexpected fetch: ${method} ${url}`);
        });

        const res = await POST({
            json: async () => strongLeadPayload,
        });

        expect(res.status).toBe(200);

        const fetchMock = global.fetch as jest.Mock;
        expect(
            fetchMock.mock.calls.some(([url, init]) => {
                return String(url).endsWith("/subscribers/subscriber-lookup-123/groups/group-123") && init?.method === "POST";
            }),
        ).toBe(true);
    });

    it("keeps the email gate locked when group assignment fails", async () => {
        global.fetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = String(input);
            const method = init?.method ?? "GET";

            if (url.endsWith("/fields?limit=100")) {
                return {
                    ok: true,
                    json: async () => ({ data: mailerLiteFieldsResponse }),
                } as Response;
            }

            if (url.endsWith("/subscribers") && method === "POST") {
                return {
                    ok: true,
                    json: async () => ({ data: { id: "subscriber-123" } }),
                } as Response;
            }

            if (url.endsWith("/subscribers/subscriber-123/groups/group-123") && method === "POST") {
                return {
                    ok: false,
                    json: async () => ({ message: "Group assignment failed" }),
                } as Response;
            }

            if (url.endsWith("/subscribers/subscriber-123") && method === "PUT") {
                return {
                    ok: true,
                    json: async () => ({ data: { id: "subscriber-123" } }),
                } as Response;
            }

            throw new Error(`Unexpected fetch: ${method} ${url}`);
        });

        const res = await POST({
            json: async () => strongLeadPayload,
        });

        expect(res.status).toBe(502);
        expect(await res.json()).toEqual({ error: "Email capture failed" });
    });

    it("keeps the email gate locked when MailerLite does not save the result field", async () => {
        global.fetch = jest.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
            const url = String(input);
            const method = init?.method ?? "GET";

            if (url.endsWith("/fields?limit=100")) {
                return {
                    ok: true,
                    json: async () => ({ data: mailerLiteFieldsResponse }),
                } as Response;
            }

            if (url.endsWith("/subscribers") && method === "POST") {
                return {
                    ok: true,
                    json: async () => ({ data: { id: "subscriber-123" } }),
                } as Response;
            }

            if (url.endsWith("/subscribers/subscriber-123") && method === "PUT") {
                return {
                    ok: true,
                    json: async () => ({ data: { id: "subscriber-123" } }),
                } as Response;
            }

            if (url.endsWith("/subscribers/subscriber-123/groups/group-123") && method === "POST") {
                return {
                    ok: true,
                    json: async () => ({ data: { id: "subscriber-123" } }),
                } as Response;
            }

            if (url.endsWith("/subscribers/subscriber-123") && method === "GET") {
                return {
                    ok: true,
                    json: async () => ({
                        data: {
                            id: "subscriber-123",
                            fields: {
                                ...strongLeadFields,
                                pinterest_fit_result: null,
                            },
                        },
                    }),
                } as Response;
            }

            throw new Error(`Unexpected fetch: ${method} ${url}`);
        });

        const res = await POST({
            json: async () => strongLeadPayload,
        });

        expect(res.status).toBe(502);
        expect(await res.json()).toEqual({ error: "Email capture failed" });
    });

    it("rejects invalid payloads", async () => {
        const res = await POST({
            json: async () => ({
                email: "not-an-email",
                result: "Strong Pinterest Fit",
            }),
        });

        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ error: "Invalid payload" });
    });

    it("returns a configuration error when the API token is missing", async () => {
        delete process.env.MAILERLITE_API_KEY;

        const res = await POST({
            json: async () => ({
                ...strongLeadPayload,
                email: "founder@example.com",
            }),
        });

        expect(res.status).toBe(503);
        expect(await res.json()).toEqual({ error: "Email capture is not configured" });
    });
});
