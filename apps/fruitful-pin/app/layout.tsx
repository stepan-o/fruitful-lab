import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { PinterestTag } from "@/components/PinterestTag";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { CANONICAL_URL, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import "./globals.css";

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "wyaafqmk6j";

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_URL),
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} | Pinterest Marketing Strategy`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} | Pinterest Marketing Strategy`,
    description: SITE_DESCRIPTION,
    url: CANONICAL_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  verification: {
    other: {
      "msvalidate.01": "58686B1363DEF085BD2B102F94E16129",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {CLARITY_PROJECT_ID ? (
          <script
            id="fruitful-pin-microsoft-clarity"
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_PROJECT_ID}");
              `,
            }}
          />
        ) : null}
      </head>
      <body className="font-body">
        <GoogleAnalytics />
        <PinterestTag />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
