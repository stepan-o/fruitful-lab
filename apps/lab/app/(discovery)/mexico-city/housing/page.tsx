import { getCurrentUser } from "@/lib/auth";
import SavedCity from "@/components/mexico-city/SavedCity";
import "@/components/mexico-city/mexico-city.css";
import "@/components/mexico-city/field-game.css";
import "@/components/mexico-city/saved-city.css";
export const metadata = {
  title: "Vivienda · Mexico city discovery game",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const user = await getCurrentUser();
  return <SavedCity initialKind="rent" signedIn={!!user} />;
}
