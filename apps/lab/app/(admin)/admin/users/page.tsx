import type { Metadata } from "next";
import AccountManager from "@/components/accounts/AccountManager";
export const metadata: Metadata = { title: "Cuentas · Fruitful Lab", robots: { index: false, follow: false } };
export default function Page() { return <AccountManager/>; }
