import "@testing-library/jest-dom";
import type { ReactElement } from "react";
import { render, screen } from "@testing-library/react";

// Mock the rendered components so tests don't depend on actual UI headings/text
jest.mock("@/components/tools/pinterestPotential/PinterestPotentialV1", () => ({
    PinterestPotentialV1: () => <h1>Pinterest Potential — welcome</h1>,
}));
jest.mock("@/components/tools/pinterestPotential/PinterestPotentialV2", () => ({
    PinterestPotentialV2: () => <h1>Pinterest Potential — no_welcome</h1>,
}));

import Page, {
    resolvePinterestPotentialVariant,
} from "@/app/(flow)/tools/pinterest-potential/page";

// Mock cookies() from next/headers to control cookie-based variant
const get = jest.fn();
const set = jest.fn();

jest.mock("next/headers", () => ({
    cookies: async () => ({ get, set }),
}));

describe("pinterest-potential page variant resolution", () => {
    it("honors query override even when cookie differs", () => {
        const v = resolvePinterestPotentialVariant("no_welcome", "welcome");
        expect(v).toBe("no_welcome");
    });

    it("uses cookie when no query provided", () => {
        const v = resolvePinterestPotentialVariant(undefined, "no_welcome");
        expect(v).toBe("no_welcome");
    });

    it("falls back to default when cookie is invalid and no query provided", () => {
        const v = resolvePinterestPotentialVariant(undefined, "not-a-variant");
        expect(["welcome", "no_welcome"]).toContain(v);
        expect(v).not.toBe("not-a-variant");
    });

    it("falls back to default when neither query nor cookie is present", () => {
        const v = resolvePinterestPotentialVariant(undefined, undefined);
        expect(["welcome", "no_welcome"]).toContain(v);
    });
});

type PageProps = {
    searchParams?: { variant?: string; leadMode?: string; t?: string };
};

type PageFn = (props: PageProps) => Promise<ReactElement>;

describe("pinterest-potential page rendering", () => {
    beforeEach(() => {
        get.mockReset();
        set.mockReset();
    });

    it("renders no_welcome when searchParams.variant=no_welcome regardless of cookie", async () => {
        get.mockReturnValueOnce({ name: "pp_variant", value: "welcome" });

        const PageTyped = Page as unknown as PageFn;
        const element = await PageTyped({ searchParams: { variant: "no_welcome" } });

        render(element);
        expect(
            screen.getByRole("heading", { name: /pinterest potential — no_welcome/i }),
        ).toBeInTheDocument();
    });

    it("renders welcome when cookie says welcome and no query", async () => {
        get.mockReturnValueOnce({ name: "pp_variant", value: "welcome" });

        const PageTyped = Page as unknown as PageFn;
        const element = await PageTyped({});

        render(element);
        expect(
            screen.getByRole("heading", { name: /pinterest potential — welcome/i }),
        ).toBeInTheDocument();
    });

    it("renders no_welcome when cookie says no_welcome and no query", async () => {
        get.mockReturnValueOnce({ name: "pp_variant", value: "no_welcome" });

        const PageTyped = Page as unknown as PageFn;
        const element = await PageTyped({});

        render(element);
        expect(
            screen.getByRole("heading", { name: /pinterest potential — no_welcome/i }),
        ).toBeInTheDocument();
    });
});