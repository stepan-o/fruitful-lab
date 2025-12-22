// frontend/app/page.tsx
import { redirect } from "next/navigation";
import PublicHubLanding from "@/components/PublicHubLanding";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
    const user = await getCurrentUser();

    if (!user) {
        return <PublicHubLanding />;
    }

    // Admin → admin dashboard
    if (user.is_admin) {
        redirect("/admin/dashboard");
    }

    // Contractor → contractor home
    if (user.groups?.includes("contractor")) {
        redirect("/contractor");
    }

    // General user → tools
    redirect("/tools");
}