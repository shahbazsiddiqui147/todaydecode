/**
 * AdScripts — injects ad network scripts into <head> via Next.js Script component.
 * Drop this inside your root layout. All scripts are conditional on env vars being set.
 *
 * Required env vars (add to .env.local / server .env):
 *   NEXT_PUBLIC_ADSENSE_ID        = ca-pub-XXXXXXXXXXXXXXXXX   (Google AdSense)
 *   NEXT_PUBLIC_GAM_NETWORK_CODE  = 21XXXXXXXXX                (Google Ad Manager / ADX)
 *   NEXT_PUBLIC_EZOIC_ENABLED     = true                       (Ezoic — set after site verification)
 *   NEXT_PUBLIC_EZOIC_SITE_ID     = XXXXX                      (Ezoic site ID)
 */

import Script from "next/script";

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;
const GAM_NETWORK = process.env.NEXT_PUBLIC_GAM_NETWORK_CODE;
const EZOIC_ENABLED = process.env.NEXT_PUBLIC_EZOIC_ENABLED === "true";
const EZOIC_SITE_ID = process.env.NEXT_PUBLIC_EZOIC_SITE_ID;

export function AdScripts() {
    return (
        <>
            {/* ── Google AdSense ── */}
            {ADSENSE_ID && (
                <Script
                    id="adsense-script"
                    async
                    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                />
            )}

            {/* ── Google Ad Manager (ADX) ── */}
            {GAM_NETWORK && (
                <>
                    <Script
                        id="gam-script"
                        async
                        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
                        strategy="afterInteractive"
                    />
                    <Script
                        id="gam-init"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                window.googletag = window.googletag || {cmd: []};
                                googletag.cmd.push(function() {
                                    googletag.pubads().enableSingleRequest();
                                    googletag.pubads().collapseEmptyDivs();
                                    googletag.enableServices();
                                });
                            `
                        }}
                    />
                </>
            )}

            {/* ── Ezoic ── */}
            {EZOIC_ENABLED && EZOIC_SITE_ID && (
                <>
                    {/* Ezoic Privacy Manager */}
                    <Script
                        id="ezoic-privacy"
                        strategy="beforeInteractive"
                        src={`https://cmp.gatekeeperconsent.com/min.js`}
                        data-cfasync="false"
                    />
                    {/* Ezoic main script */}
                    <Script
                        id="ezoic-script"
                        strategy="afterInteractive"
                        src={`https://go.ezodn.com/utilcorner/ezoimgfmt.js`}
                    />
                    <Script
                        id="ezoic-loader"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                var ezoicSiteId = ${EZOIC_SITE_ID};
                                (function(doc, script) {
                                    script = doc.createElement('script');
                                    script.async = 1;
                                    script.src = 'https://go.ezodn.com/utilcorner/ezoimgfmt.js';
                                    doc.getElementsByTagName('head')[0].appendChild(script);
                                }(document));
                            `
                        }}
                    />
                </>
            )}
        </>
    );
}
