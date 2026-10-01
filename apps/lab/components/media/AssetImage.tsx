"use client";

import Image from "next/image";
import type { ImageAsset } from "@/lib/assets/types";

export default function AssetImage({ asset, alt, sizes, className, preload = false }: {
    asset: ImageAsset;
    alt: string;
    sizes: string;
    className?: string;
    preload?: boolean;
}) {
    const largest = asset.variants[asset.variants.length - 1];
    return <Image
        src={largest.src}
        loader={({ width }) => (asset.variants.find(file => file.width! >= width) ?? largest).src}
        width={asset.width}
        height={asset.height}
        alt={alt}
        sizes={sizes}
        className={className}
        preload={preload}
        loading={preload ? undefined : "lazy"}
        decoding="async"
    />;
}
