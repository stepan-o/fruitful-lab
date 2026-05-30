import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CANONICAL_URL, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import "./globals.css";

const comfortaa = localFont({
  src: "../public/fonts/comfortaa-latin-700.ttf",
  weight: "700",
  variable: "--font-heading",
  display: "swap",
});

const raleway = localFont({
  src: "../public/fonts/raleway-latin.woff2",
  weight: "500 800",
  variable: "--font-body",
  display: "swap",
});

const defaultSocialImage = {
  url: "/images/service-product-lab-photo.jpg",
  width: 1536,
  height: 1024,
  alt: "Fruitful Lab product discovery workbench for specialty brands",
};

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} | Product Discovery Systems`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  creator: SITE_NAME,
  publisher: SITE_NAME,
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: `${SITE_NAME} | Product Discovery Systems`,
    description: SITE_DESCRIPTION,
    url: CANONICAL_URL,
    siteName: SITE_NAME,
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Product Discovery Systems`,
    description: SITE_DESCRIPTION,
    images: [defaultSocialImage.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${comfortaa.variable} ${raleway.variable}`} suppressHydrationWarning>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
