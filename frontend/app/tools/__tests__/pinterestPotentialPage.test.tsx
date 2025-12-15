import "@testing-library/jest-dom";
import Page, { resolvePinterestPotentialVariant } from "@/app/tools/pinterest-potential/page";
import { render, screen } from "@testing-library/react";

// Mock cookies() from next/headers to control cookie-based variant
const get = jest.fn();
const set = jest.fn();
jest.mock("next/headers", () => ({
  cookies: async () => ({ get, set }),
}));

describe("pinterest-potential page variant resolution (J3)", () => {
  it("honors query override even when cookie differs", () => {
    const v = resolvePinterestPotentialVariant("v2", "v1");
    expect(v).toBe("v2");
  });

  it("uses cookie when no query provided", () => {
    const v = resolvePinterestPotentialVariant(undefined, "v2");
    expect(v).toBe("v2");
  });

  it("falls back to default when cookie is invalid and no query provided", () => {
    const v = resolvePinterestPotentialVariant(undefined, "not-a-variant");
    expect(["v1", "v2"]).toContain(v);
    // We cannot import DEFAULT_VARIANT directly here without coupling; assert membership and not invalid
    expect(v).not.toBe("not-a-variant");
  });

  it("falls back to default when neither query nor cookie is present", () => {
    const v = resolvePinterestPotentialVariant(undefined, undefined);
    expect(["v1", "v2"]).toContain(v);
  });
});

describe("pinterest-potential page rendering", () => {
  beforeEach(() => {
    get.mockReset();
    set.mockReset();
  });

  it("renders V2 when searchParams.variant=v2 regardless of cookie", async () => {
    get.mockReturnValueOnce({ name: "pp_variant", value: "v1" });
    const element = await (Page as any)({ searchParams: { variant: "v2" } });
    render(element);
    expect(
      screen.getByRole("heading", { name: /pinterest potential calculator — v2/i })
    ).toBeInTheDocument();
  });

  it("renders V1 when cookie says v1 and no query", async () => {
    get.mockReturnValueOnce({ name: "pp_variant", value: "v1" });
    const element = await (Page as any)({});
    render(element);
    expect(
      screen.getByRole("heading", { name: /pinterest potential calculator — v1/i })
    ).toBeInTheDocument();
  });

  it("renders V2 when cookie says v2 and no query", async () => {
    get.mockReturnValueOnce({ name: "pp_variant", value: "v2" });
    const element = await (Page as any)({});
    render(element);
    expect(
      screen.getByRole("heading", { name: /pinterest potential calculator — v2/i })
    ).toBeInTheDocument();
  });
});
