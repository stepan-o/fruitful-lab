import type { Metadata } from "next";
import { getRateSnapshot } from "@/lib/tools/finance/data";
import FinanceWorkspace from "@/components/tools/finance/FinanceWorkspace";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Exchange timing · Financial Lab | Fruitful Lab",
  description: "Compare exchanging Canadian dollars for Mexican pesos now, later, or in stages with Bank of Canada data, transparent forecasts and a decision report.",
  alternates: { canonical: "https://www.fruitfulab.net/tools/finance" },
};
export default async function FinancePage() {
  const snapshot = await getRateSnapshot().catch(() => null);
  return <FinanceWorkspace initialSnapshot={snapshot} />;
}
