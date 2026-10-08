import { imageAsset, parseManifest, type ImageAsset } from "@/lib/assets/types";
import baseline from "@/lib/assets/generated/loopforge-theme-baseline.json";
import field from "@/lib/assets/generated/loopforge-theme-field-instrument.json";
import broadcast from "@/lib/assets/generated/loopforge-theme-broadcast-desk.json";
import foundry from "@/lib/assets/generated/loopforge-theme-foundry-switchboard.json";
import submarine from "@/lib/assets/generated/loopforge-theme-submarine-watch.json";
import neural from "@/lib/assets/generated/loopforge-theme-neural-diagnostics.json";

// Bundled manifests pin one immutable release. No independently moving latest pointers.
export const THEMES = [
  { id: "baseline", name: "Factory Original", material: "Black enamel · rubbed brass", accent: "#d7bb80", signal: "#8ecac7", surface: "#111b19", manifest: baseline },
  { id: "field-instrument", name: "Field Instrument", material: "Olive enamel · bakelite", accent: "#d4d195", signal: "#b6d7a3", surface: "#20271a", manifest: field },
  { id: "broadcast-desk", name: "Broadcast Desk", material: "Ribbed steel · ivory keys", accent: "#e3d8bb", signal: "#a0c9d3", surface: "#1b2024", manifest: broadcast },
  { id: "foundry-switchboard", name: "Foundry Switchboard", material: "Cast iron · copper contacts", accent: "#edb079", signal: "#9dbfae", surface: "#282019", manifest: foundry },
  { id: "submarine-watch", name: "Submarine Watch", material: "Naval enamel · brass seals", accent: "#dec595", signal: "#a1cfe3", surface: "#152733", manifest: submarine },
  { id: "neural-diagnostics", name: "Neural Diagnostics", material: "Cracked porcelain · copper", accent: "#e2d9bf", signal: "#93d9d2", surface: "#242c2b", manifest: neural },
] as const;
export type ThemeId = (typeof THEMES)[number]["id"];
export type ThemeRecipe = Readonly<{ version: 1; shell: ThemeId; controls: ThemeId }>;
export const DEFAULT_RECIPE: ThemeRecipe = { version: 1, shell: "baseline", controls: "baseline" };
export const THEME_STORAGE_KEY = "loopforge-console-theme-v1";
export const theme = (id: ThemeId) => THEMES.find(t => t.id === id)!;
export const isThemeId = (value: unknown): value is ThemeId => THEMES.some(t => t.id === value);
export function parseRecipe(value: unknown): ThemeRecipe {
  if (typeof value !== "object" || value === null) return DEFAULT_RECIPE;
  const v = value as Partial<ThemeRecipe>;
  return v.version === 1 && isThemeId(v.shell) && isThemeId(v.controls)
    ? { version: 1, shell: v.shell, controls: v.controls } : DEFAULT_RECIPE;
}
export function recipeFromQuery(search: string): ThemeRecipe | null {
  const p = new URLSearchParams(search);
  if (!p.has("theme")) return null;
  const shell = p.get("theme"), controls = p.get("controls") ?? shell;
  return parseRecipe({ version: 1, shell, controls });
}
export function recipeLink(recipe: ThemeRecipe) {
  return `/stepanoskin/loopforge/play?theme=${recipe.shell}${recipe.controls === recipe.shell ? "" : `&controls=${recipe.controls}`}`;
}
const packs = new Map(THEMES.map(t => [t.id, parseManifest(t.manifest, `loopforge-theme-${t.id}`)]));
export function themeMedia(recipe: ThemeRecipe): Record<string, ImageAsset> {
  const shell = packs.get(recipe.shell)!, controls = packs.get(recipe.controls)!;
  return {
    "monitor-frame": imageAsset(shell, "monitor-frame"),
    "supervisor-socket": imageAsset(shell, "supervisor-socket"),
    ...Object.fromEntries(["button-rest", "button-hover", "button-pressed"].map(id => [id, imageAsset(controls, id)])),
  };
}
export function themeFiles(recipe: ThemeRecipe, compact: boolean) {
  return Object.fromEntries(Object.entries(themeMedia(recipe)).map(([key, asset]) =>
    [key, asset.variants[compact ? 0 : asset.variants.length - 1]]));
}

// Deduplicate decoding; retain successes, evict failures so a retry can recover.
const decoded = new Map<string, Promise<void>>();
export function decodeThemeImage(src: string): Promise<void> {
  const cached = decoded.get(src);
  if (cached) return cached;
  const promise = new Promise<void>((resolve, reject) => {
    const img = new Image();
    const timer = window.setTimeout(() => finish(new Error("Image loading timed out")), 8000);
    function finish(error?: Error) {
      clearTimeout(timer); img.onload = null; img.onerror = null;
      if (error) reject(error); else resolve();
    }
    img.onerror = () => finish(new Error("Image unavailable"));
    img.onload = () => {
      if (img.decode) void img.decode().then(() => finish(), () => finish(new Error("Image decoding failed")));
      else finish();
    };
    img.src = src;
  });
  decoded.set(src, promise);
  void promise.catch(() => decoded.delete(src));
  return promise;
}
export async function prepareTheme(recipe: ThemeRecipe, compact: boolean) {
  const files = themeFiles(recipe, compact);
  await Promise.all(Object.values(files).map(file => decodeThemeImage(file.src)));
  return files;
}
