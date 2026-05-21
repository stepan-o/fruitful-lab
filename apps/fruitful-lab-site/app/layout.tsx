import type { Metadata } from "next";
import { Lato, Raleway } from "next/font/google";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CANONICAL_URL, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-body",
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} | AI Marketing Systems and Funnels`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} | AI Marketing Systems and Funnels`,
    description: SITE_DESCRIPTION,
    url: CANONICAL_URL,
    siteName: SITE_NAME,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lato.variable} ${raleway.variable}`} suppressHydrationWarning>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
