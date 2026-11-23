// frontend/app/login/page.tsx
import { Suspense } from "react";
import LoginPageClient from "./LoginPageClient";

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginPageClient />
        </Suspense>
    );
}
