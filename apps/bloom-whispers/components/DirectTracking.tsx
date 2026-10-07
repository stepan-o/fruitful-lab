import Script from "next/script";

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const pinterestTagId = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID?.trim();
const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();

function hasValue(value: string | undefined) {
  return Boolean(value && value.length > 0);
}

export function DirectTracking() {
  return (
    <>
      {hasValue(gaMeasurementId) ? (
        <>
          <Script
            id="bloom-ga-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
            strategy="afterInteractive"
          />
          <Script
            id="bloom-ga-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', ${JSON.stringify(gaMeasurementId)});
              `,
            }}
          />
        </>
      ) : null}

      {hasValue(pinterestTagId) ? (
        <>
          <Script
            id="bloom-pinterest-tag"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(e){
                  if(!window.pintrk){
                    window.pintrk = function(){ window.pintrk.queue.push(Array.prototype.slice.call(arguments)); };
                    var n = window.pintrk;
                    n.queue = [];
                    n.version = "3.0";
                    var t = document.createElement("script");
                    t.async = true;
                    t.src = e;
                    var r = document.getElementsByTagName("script")[0];
                    r.parentNode.insertBefore(t, r);
                  }
                }("https://s.pinimg.com/ct/core.js");
                pintrk("load", ${JSON.stringify(pinterestTagId)});
                pintrk("page");
              `,
            }}
          />
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://ct.pinterest.com/v3/?tid=${pinterestTagId}&noscript=1`}
            />
          </noscript>
        </>
      ) : null}

      {hasValue(clarityProjectId) ? (
        <Script
          id="bloom-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a] = c[a] || function(){ (c[a].q = c[a].q || []).push(arguments); };
                t = l.createElement(r);
                t.async = 1;
                t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t, y);
              })(window, document, "clarity", "script", ${JSON.stringify(clarityProjectId)});
            `,
          }}
        />
      ) : null}
    </>
  );
}
