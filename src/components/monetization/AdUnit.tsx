"use client";

import React, { useEffect, useRef } from "react";

type AdPlacement = "leaderboard" | "sidebar" | "in-content" | "footer";

interface AdUnitProps {
    placement: AdPlacement;
    className?: string;
    /** AdSense slot ID for this specific unit */
    adsenseSlot?: string;
    /** GAM ad unit path e.g. /21XXXXXXX/todaydecode_leaderboard */
    gamUnit?: string;
    /** Ezoic placeholder ID */
    ezoicId?: number;
}

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_ID;
const GAM_NETWORK = process.env.NEXT_PUBLIC_GAM_NETWORK_CODE;
const EZOIC_ENABLED = process.env.NEXT_PUBLIC_EZOIC_ENABLED === "true";

const SIZE_MAP: Record<AdPlacement, { width: number; height: number; responsive?: boolean }> = {
    leaderboard: { width: 728, height: 90, responsive: true },
    sidebar:     { width: 300, height: 250 },
    "in-content":{ width: 336, height: 280, responsive: true },
    footer:      { width: 728, height: 90, responsive: true },
};

export function AdUnit({ placement, className = "", adsenseSlot, gamUnit, ezoicId }: AdUnitProps) {
    const adRef = useRef<HTMLDivElement>(null);
    const { width, height } = SIZE_MAP[placement];

    // AdSense push
    useEffect(() => {
        if (!ADSENSE_ID || !adsenseSlot) return;
        try {
            (window as any).adsbygoogle = (window as any).adsbygoogle || [];
            (window as any).adsbygoogle.push({});
        } catch (e) {
            // AdSense not loaded yet
        }
    }, [adsenseSlot]);

    // GAM/ADX display
    useEffect(() => {
        if (!GAM_NETWORK || !gamUnit || !adRef.current) return;
        const divId = `gam-${placement}-${Math.random().toString(36).slice(2, 7)}`;
        adRef.current.id = divId;
        try {
            const googletag = (window as any).googletag || {};
            googletag.cmd = googletag.cmd || [];
            googletag.cmd.push(() => {
                googletag.defineSlot(gamUnit, [[width, height]], divId)
                    ?.addService(googletag.pubads());
                googletag.enableServices();
                googletag.display(divId);
            });
        } catch (e) {
            // GAM not loaded yet
        }
    }, [gamUnit, placement, width, height]);

    // Nothing configured — show placeholder box in dev, nothing in prod
    const isConfigured = ADSENSE_ID || GAM_NETWORK || EZOIC_ENABLED;
    if (!isConfigured) {
        if (process.env.NODE_ENV !== "production") {
            return (
                <div
                    className={`flex items-center justify-center bg-white/[0.02] border border-dashed border-white/10 rounded-lg text-[9px] font-bold text-slate-600 uppercase tracking-widest ${className}`}
                    style={{ minHeight: height, maxWidth: "100%" }}
                >
                    Ad · {placement} · {width}×{height}
                </div>
            );
        }
        return null;
    }

    // Ezoic placeholder
    if (EZOIC_ENABLED && ezoicId) {
        return (
            <div className={className}>
                <div id={`ezoic-pub-ad-placeholder-${ezoicId}`} />
            </div>
        );
    }

    // AdSense unit
    if (ADSENSE_ID && adsenseSlot) {
        return (
            <div className={className}>
                <ins
                    className="adsbygoogle"
                    style={{ display: "block", width: "100%", maxWidth: width, height }}
                    data-ad-client={ADSENSE_ID}
                    data-ad-slot={adsenseSlot}
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            </div>
        );
    }

    // GAM/ADX unit
    if (GAM_NETWORK && gamUnit) {
        return (
            <div className={className}>
                <div ref={adRef} style={{ minWidth: width, minHeight: height }} />
            </div>
        );
    }

    return null;
}
