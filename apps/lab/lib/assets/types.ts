export type AssetFile = Readonly<{
    src: string;
    mime: string;
    bytes: number;
    sha256: string;
    width?: number;
    height?: number;
}>;
export type ImageAsset = Readonly<{
    kind: "image";
    width: number;
    height: number;
    variants: readonly AssetFile[];
}>;
export type Asset = ImageAsset | Readonly<{ kind: "audio" | "video" | "data"; variants: readonly AssetFile[] }>;
export type AssetManifest = Readonly<{ schemaVersion: 1; pack: string; assets: Readonly<Record<string, Asset>> }>;
export type AssetPointer = Readonly<{ schemaVersion: 1; pack: string; revision: string; manifest: string }>;

const packPattern = /^[a-z][a-z0-9-]{0,63}$/;
const hashPattern = /^[a-f0-9]{64}$/;
const filePattern = /^\/media\/files\/([a-f0-9]{64})\.(webp|mp3|ogg|wav|mp4|webm|json)$/;
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
const positive = (v: unknown): v is number => typeof v === "number" && Number.isSafeInteger(v) && v > 0;

export function parsePointer(value: unknown, pack: string): AssetPointer {
    if (!packPattern.test(pack) || !isRecord(value) || value.schemaVersion !== 1 || value.pack !== pack ||
        typeof value.revision !== "string" || !hashPattern.test(value.revision) ||
        value.manifest !== `/media/manifests/${pack}.${value.revision}.json`) throw new Error("Invalid asset pointer");
    return value as AssetPointer;
}

export function parseManifest(value: unknown, pack: string): AssetManifest {
    if (!packPattern.test(pack) || !isRecord(value) || value.schemaVersion !== 1 || value.pack !== pack ||
        !isRecord(value.assets) || !Object.keys(value.assets).length) throw new Error("Invalid asset manifest");
    for (const [id, asset] of Object.entries(value.assets)) {
        if (!packPattern.test(id) || !isRecord(asset) || !["image", "audio", "video", "data"].includes(String(asset.kind)) ||
            !Array.isArray(asset.variants) || !asset.variants.length) throw new Error("Invalid asset entry");
        let previousWidth = 0;
        for (const file of asset.variants) {
            if (!isRecord(file) || typeof file.src !== "string" || typeof file.sha256 !== "string" || !hashPattern.test(file.sha256) || filePattern.exec(file.src)?.[1] !== file.sha256 ||
                !positive(file.bytes) || typeof file.mime !== "string" ||
                !(asset.kind === "data" ? file.mime === "application/json" : file.mime.startsWith(`${asset.kind}/`))) throw new Error("Invalid asset file");
            if (asset.kind === "image") {
                if (!positive(asset.width) || !positive(asset.height) || !positive(file.width) || !positive(file.height) ||
                    file.width <= previousWidth || file.width > asset.width) throw new Error("Invalid image dimensions");
                previousWidth = file.width;
            }
        }
    }
    return value as AssetManifest;
}

export function imageAsset(manifest: AssetManifest, id: string): ImageAsset {
    const asset = manifest.assets[id];
    if (asset?.kind !== "image") throw new Error(`Missing image: ${id}`);
    return asset;
}

export function assetUrl(manifest: AssetManifest, id: string): string {
    const asset = manifest.assets[id];
    if (!asset) throw new Error(`Missing asset: ${id}`);
    return asset.variants[asset.variants.length - 1].src;
}
