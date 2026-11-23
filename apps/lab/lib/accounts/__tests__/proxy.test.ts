/** @jest-environment node */
import { NextRequest } from "next/server";
import { accountProxy } from "../proxy";
import { POST as login } from "@/app/api/auth/login/route";

let cookie: string | undefined;
jest.mock("next/headers", () => ({
  cookies: async () => ({
    get: () => (cookie ? { value: cookie } : undefined),
  }),
}));
jest.mock("@/lib/auth", () => ({ getApiOrigin: () => "http://backend.test" }));
const request = jest.fn();
beforeEach(() => {
  request.mockReset();
  global.fetch = request;
  cookie = undefined;
});
const incoming = (
  method = "POST",
  body: object = {},
  origin = "https://game.test",
) =>
  new NextRequest("https://game.test/api/account/forgot", {
    method,
    headers: { host: "game.test", origin, "Content-Type": "application/json" },
    ...(method === "GET" ? {} : { body: JSON.stringify(body) }),
  });

test("account mutations reject a foreign origin and anonymous administrative requests", async () => {
  expect((await accountProxy(incoming(), "/admin/users", true)).status).toBe(
    401,
  );
  cookie = "fixture-session";
  expect(
    (
      await accountProxy(
        incoming("POST", {}, "https://foreign.test"),
        "/admin/users",
        true,
      )
    ).status,
  ).toBe(403);
  expect(request).not.toHaveBeenCalled();
});

test("admin proxy forwards the session while public recovery does not", async () => {
  cookie = "fixture-session";
  request.mockImplementation(
    async () =>
      new Response(JSON.stringify({ success: true }), { status: 200 }),
  );
  const response = await accountProxy(incoming("GET"), "/admin/users", true);
  expect(request.mock.calls[0][1].headers.Authorization).toBe(
    "Bearer fixture-session",
  );
  expect(response.headers.get("cache-control")).toBe("no-store");
  await accountProxy(incoming(), "/auth/password/forgot", false);
  expect(request.mock.calls[1][1].headers.Authorization).toBeUndefined();
});

test("provider availability survives the proxy without disclosing other upstream details", async () => {
  request
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: "email_unavailable" }), {
        status: 503,
      }),
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: "private database information" }), {
        status: 500,
      }),
    );
  expect(
    await (
      await accountProxy(incoming(), "/auth/password/forgot", false)
    ).json(),
  ).toEqual({ detail: "email_unavailable" });
  expect(
    await (
      await accountProxy(incoming(), "/auth/password/forgot", false)
    ).json(),
  ).toEqual({ detail: "service_unavailable" });
});

test("login differentiates incorrect credentials from a failed backend", async () => {
  request
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ detail: "Incorrect email or password" }), {
        status: 401,
      }),
    )
    .mockResolvedValueOnce(new Response("unavailable", { status: 500 }));
  const credentials = {
    email: "player@example.com",
    password: "local-test-password",
  };
  expect((await login(incoming("POST", credentials))).status).toBe(401);
  expect((await login(incoming("POST", credentials))).status).toBe(503);
  expect(
    (await login(incoming("POST", credentials, "https://foreign.test"))).status,
  ).toBe(403);
});
