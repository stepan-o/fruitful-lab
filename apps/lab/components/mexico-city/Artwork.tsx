import AssetImage from "@/components/media/AssetImage";
import manifest from "@/lib/assets/generated/mexico-city.json";
import { imageAsset, type AssetManifest } from "@/lib/assets/types";

export default function Artwork({
  id,
  sizes = "300px",
  preload = false,
  className = "",
  alt = "",
}: {
  id: string;
  sizes?: string;
  preload?: boolean;
  className?: string;
  alt?: string;
}) {
  return (
    <AssetImage
      asset={imageAsset(manifest as AssetManifest, id)}
      alt={alt}
      sizes={sizes}
      preload={preload}
      className={className}
    />
  );
}
