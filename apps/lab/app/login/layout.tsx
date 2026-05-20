// frontend/app/login/layout.tsx
import FlashBanner from "@/components/layout/FlashBanner";
import {Suspense} from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Suspense fallback={null}>
                <FlashBanner />
            </Suspense>
            {children}
        </>
    );
}