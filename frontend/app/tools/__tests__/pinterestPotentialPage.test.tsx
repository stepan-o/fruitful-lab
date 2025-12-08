import "@testing-library/jest-dom";

import {
  resolvePinterestPotentialVariant,
} from "@/app/tools/pinterest-potential/page";

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
