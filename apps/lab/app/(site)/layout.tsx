// frontend/app/(site)/layout.tsx
import type { ReactNode } from "react";
import { Suspense } from "react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import FlashBanner from "@/components/layout/FlashBanner";

export default function SiteLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
            <SiteHeader />
            <Suspense fallback={null}>
                <FlashBanner topOffsetPx={64} />
            </Suspense>
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    );
}