import { parseManifest, parsePointer, type AssetManifest } from "./types";

// Call at scene/navigation boundaries. A caller keeps the returned release for its scene.
// No timer, eager image download, or mid-scene replacement is performed here.
export function createAssetLoader(fetcher: typeof fetch = (...args) => fetch(...args)) {
    const cache = new Map<string, { manifest: AssetManifest; checkedAt: number }>();
    const pending = new Map<string, Promise<AssetManifest>>();

    return async function loadAssetPack(pack: string, fallback?: AssetManifest): Promise<AssetManifest> {
        if (!/^[a-z][a-z0-9-]{0,63}$/.test(pack)) throw new Error("Invalid asset pack name");
        if (fallback) parseManifest(fallback, pack);
        const cached = cache.get(pack);
        if (cached && Date.now() - cached.checkedAt < 30_000) return cached.manifest;
        let request = pending.get(pack);
        if (!request) {
            request = (async () => {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 4000);
                try {
                    const options = { signal: controller.signal, credentials: "omit" as const, cache: "default" as const };
                    const pointerResponse = await fetcher(`/media/pointers/${pack}.json`, options);
                    if (!pointerResponse.ok) throw new Error("Asset pointer unavailable");
                    const pointer = parsePointer(await pointerResponse.json(), pack);
                    const manifestResponse = await fetcher(pointer.manifest, {
                        ...options,
                        integrity: `sha256-${btoa(String.fromCharCode(...pointer.revision.match(/../g)!.map(byte => parseInt(byte, 16))))}`,
                    });
                    if (!manifestResponse.ok) throw new Error("Asset manifest unavailable");
                    const manifest = parseManifest(await manifestResponse.json(), pack);
                    cache.set(pack, { manifest, checkedAt: Date.now() });
                    return manifest;
                } finally { clearTimeout(timeout); }
            })();
            pending.set(pack, request);
        }
        try { return await request; }
        catch (error) {
            const lastGood = cache.get(pack)?.manifest ?? fallback;
            if (lastGood) return lastGood;
            throw error;
        } finally {
            if (pending.get(pack) === request) pending.delete(pack);
        }
    };
}

export const loadAssetPack = createAssetLoader();
