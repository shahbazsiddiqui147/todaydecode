"use client";

import Script from "next/script";
import { createContext, useContext, ReactNode } from "react";

interface AnalyticsContextType {
    trackEvent: (eventName: string, params?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX";
    const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

    const trackEvent = (eventName: string, params?: Record<string, any>) => {
        if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", eventName, {
                ...params,
                page_path: window.location.pathname + (window.location.pathname.endsWith('/') ? '' : '/'),
            });
            console.log(`[Analytics] Tracked: ${eventName}`, params);
        }
    };

    return (
        <AnalyticsContext.Provider value={{ trackEvent }}>
            {/* Google Analytics 4 */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
                strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                    page_path: window.location.pathname + (window.location.pathname.endsWith('/') ? '' : '/'),
                });
                `}
            </Script>

            {/* Microsoft Clarity */}
            {CLARITY_ID && (
                <Script id="microsoft-clarity" strategy="afterInteractive">
                    {`
                    (function(c,l,a,r,i,t,y){
                        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                    })(window, document, "clarity", "script", "${CLARITY_ID}");
                    `}
                </Script>
            )}

            {children}
        </AnalyticsContext.Provider>
    );
}

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) {
        throw new Error("useAnalytics must be used within an AnalyticsProvider");
    }
    return context;
};
