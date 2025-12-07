// frontend/app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import PublicHubLanding from "@/components/PublicHubLanding";

const COOKIE_NAME = "fruitful_access_token";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    redirect("/dashboard");
  }

  return <PublicHubLanding />;
}
