"use client";

import { preload as preloadImage } from "react-dom";
import type { ImageAsset } from "@/lib/assets/types";

export default function AssetImage({ asset, alt, sizes, className, preload = false }: {
    asset: ImageAsset;
    alt: string;
    sizes: string;
    className?: string;
    preload?: boolean;
}) {
    const largest = asset.variants[asset.variants.length - 1];
    const srcSet = asset.variants.map(file => `${file.src} ${file.width}w`).join(", ");
    if (preload) preloadImage(largest.src, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: "high" });
    // These files are already optimized. Native srcset describes their exact widths
    // without mapping Next's synthetic widths to duplicate or undersized files.
    // eslint-disable-next-line @next/next/no-img-element
    return <img
        src={largest.src}
        srcSet={srcSet}
        width={asset.width}
        height={asset.height}
        alt={alt}
        sizes={sizes}
        className={className}
        fetchPriority={preload ? "high" : undefined}
        loading={preload ? "eager" : "lazy"}
        decoding="async"
    />;
}
