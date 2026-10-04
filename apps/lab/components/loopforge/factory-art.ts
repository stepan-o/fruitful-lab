import manifest from "@/lib/assets/generated/loopforge-stage.json";

/** The same responsive release is shared by the HTML still and the renderer. */
export const factoryArt = manifest.assets;
export function factoryArtUrl(id: keyof typeof factoryArt, compact: boolean) {
  return factoryArt[id].variants[compact ? 0 : 1].src;
}
export function loadFactoryArt(compact: boolean) {
  return Promise.all((["lattice", "specimens", "beacon"] as const).map(id => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => image.decode().then(() => resolve(image), reject);
    image.onerror = () => reject(new Error(`Factory artwork unavailable: ${id}`));
    image.src = factoryArtUrl(id, compact);
  })));
}
