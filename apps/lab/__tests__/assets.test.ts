/** @jest-environment node */
import { createAssetLoader } from "@/lib/assets/client";
import { parseManifest, parsePointer } from "@/lib/assets/types";
import rawManifest from "@/lib/assets/generated/stepanoskin.json";
import pointer from "@/public/media/pointers/stepanoskin.json";
import nextConfig from "@/next.config";

const manifest = parseManifest(rawManifest, "stepanoskin");
const response = (body: unknown, ok = true) => ({ ok, json: async () => body }) as Response;

describe("asset release loading", () => {
    afterEach(() => jest.restoreAllMocks());

    it("shares concurrent requests and keeps a release pinned until the next check", async () => {
        let now = 1000;
        jest.spyOn(Date, "now").mockImplementation(() => now);
        const fetcher = jest.fn().mockResolvedValueOnce(response(pointer)).mockResolvedValueOnce(response(manifest));
        const load = createAssetLoader(fetcher);
        const [a, b] = await Promise.all([load("stepanoskin"), load("stepanoskin")]);
        expect(a).toEqual(b);
        expect(fetcher).toHaveBeenCalledTimes(2);
        expect(fetcher.mock.calls[1][1]).toEqual(expect.objectContaining({ integrity: expect.stringMatching(/^sha256-/), credentials: "omit", cache: "default" }));
        await load("stepanoskin");
        expect(fetcher).toHaveBeenCalledTimes(2);
        now += 31_000;
        fetcher.mockResolvedValueOnce(response(null, false));
        expect(await load("stepanoskin")).toEqual(a);
    });

    it("uses the bundled fallback on failure and retries successfully next time", async () => {
        const fetcher = jest.fn().mockRejectedValueOnce(new Error("offline"));
        const load = createAssetLoader(fetcher);
        expect(await load("stepanoskin", manifest)).toBe(manifest);
        fetcher.mockResolvedValueOnce(response(pointer)).mockResolvedValueOnce(response(manifest));
        expect(await load("stepanoskin", manifest)).toEqual(manifest);
        expect(fetcher).toHaveBeenCalledTimes(3);
    });

    it("rejects a foreign pointer without requesting its target", async () => {
        const fetcher = jest.fn().mockResolvedValue(response({ ...pointer, manifest: "https://example.com/manifest.json" }));
        await expect(createAssetLoader(fetcher)("stepanoskin")).rejects.toThrow("pointer");
        expect(fetcher).toHaveBeenCalledTimes(1);
        expect(() => parsePointer(pointer, "another-pack")).toThrow();
    });

    it("rejects malformed manifests and falls back instead of mixing releases", async () => {
        const malformed = { ...manifest, assets: { bad: { kind: "image", variants: [{ src: "https://example.com/image.webp", mime: "image/webp", bytes: 42 }] } } };
        expect(() => parseManifest(malformed, "stepanoskin")).toThrow();
        const fetcher = jest.fn().mockResolvedValueOnce(response(pointer)).mockResolvedValueOnce(response(malformed));
        expect(await createAssetLoader(fetcher)("stepanoskin", manifest)).toBe(manifest);
    });

    it("separates immutable files from mutable pointers without touching authenticated routes", async () => {
        const headers = await nextConfig.headers!();
        expect(headers).toHaveLength(3);
        expect(headers.find(h => h.source === "/media/files/:path*")?.headers).toContainEqual({ key: "Cache-Control", value: "public, max-age=31536000, immutable" });
        expect(headers.find(h => h.source === "/media/pointers/:pack.json")?.headers).toContainEqual({ key: "Cache-Control", value: "public, max-age=30, must-revalidate" });
        expect(headers.every(h => h.source.startsWith("/media/"))).toBe(true);
    });
});
