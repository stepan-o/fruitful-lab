// frontend/app/page.tsx
import { redirect } from "next/navigation";
import PublicHubLanding from "@/components/PublicHubLanding";
import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (user?.is_admin) {
    redirect("/dashboard");
  }
  if (user && !user.is_admin) {
    redirect("/tools");
  }

  return <PublicHubLanding />;
}
