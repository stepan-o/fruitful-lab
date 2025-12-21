import { getCurrentUser } from "@/lib/auth";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

const { cookies } = jest.requireMock("next/headers") as {
  cookies: jest.Mock;
};

describe("getCurrentUser", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.resetAllMocks();
    // By default, return a token
    cookies.mockReturnValue({
      get: jest.fn().mockReturnValue({ value: "test-token" }),
    });

    global.fetch = jest.fn();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        email: "admin@example.com",
        full_name: "Admin User",
        is_admin: true,
        is_active: true,
        groups: [],
      }),
    });
  });

  afterEach(() => {
    global.fetch = originalFetch as typeof fetch;
  });

  it("returns null when there is no auth cookie", async () => {
    cookies.mockReturnValue({
      get: jest.fn().mockReturnValue(undefined),
    });

    const user = await getCurrentUser();
    expect(user).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("returns user data when API responds with 200 OK", async () => {
    const user = await getCurrentUser();

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = (global.fetch as jest.Mock).mock.calls[0];

    expect(url).toContain("/auth/me");
    expect(options.headers.Authorization).toBe("Bearer test-token");

    expect(user).toEqual(
      expect.objectContaining({
        email: "admin@example.com",
        is_admin: true,
        is_active: true,
      })
    );
  });

  it("returns null when API responds with non-OK status", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: "Unauthorized" }),
    });

    const user = await getCurrentUser();
    expect(user).toBeNull();
  });

  it("returns null when fetch throws", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    const user = await getCurrentUser();
    expect(user).toBeNull();
  });
});
