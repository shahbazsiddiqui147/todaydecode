"use client";

import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getLatestReportsByRegion, getCountryMetric } from "@/lib/actions/public-actions";

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";

const colorScale = scaleLinear<string>()
    .domain([0, 40, 70, 100])
    .range(["#1E293B", "#22C55E", "#EAB308", "#FF4B4B"]);

interface RegionDataInfo {
    id: string;
    name: string;
    riskScore: number;
    regionEnum: string;
    latestReports: any[];
    metrics?: {
        literacy: string | null;
        economy: string | null;
        energy: string | null;
        army: string | null;
    } | null;
}

const REGION_ISO_MAP: Record<string, string[]> = {
    "AMERICAS": ["USA", "CAN", "MEX", "BRA", "ARG", "COL", "CHL"],
    "EUROPE": ["GBR", "FRA", "DEU", "ITA", "ESP", "UKR", "RUS", "NOR", "SWE", "POL"],
    "APAC": ["CHN", "IND", "JPN", "AUS", "KOR", "VNM", "IDN", "THA"],
    "MENA": ["SAU", "ARE", "EGY", "IRN", "TUR", "ISR", "QAT", "KWT"],
    "AFRICA": ["ZAF", "NGA", "KEN", "ETH", "AGO", "DZA", "MAR"],
    "GLOBAL": []
};

interface GlobalRiskMapProps {
    regionData?: Record<string, number>;
    isBackdrop?: boolean;
}

export function GlobalRiskMap({ regionData = {}, isBackdrop = false }: GlobalRiskMapProps) {
    const [tooltip, setTooltip] = useState<{ id: string; data: RegionDataInfo } | null>(null);
    const [loadingReports, setLoadingReports] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // High-precision mouse tracking
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for the tooltip movement
    const smoothX = useSpring(mouseX, { damping: 25, stiffness: 200 });
    const smoothY = useSpring(mouseY, { damping: 25, stiffness: 200 });

    // Reactive translation logic for boundary detection (no re-renders needed)
    const translateX = useTransform(smoothX, (val) => {
        if (typeof window === "undefined") return 15;
        return val > window.innerWidth - 350 ? -340 : 15;
    });

    const translateY = useTransform(smoothY, (val) => {
        if (typeof window === "undefined") return 15;
        // If near the bottom, flip up. Tooltip height is roughly 400px.
        return val > window.innerHeight - 450 ? -430 : 15;
    });

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const getRegionForCountry = (iso: string) => {
        for (const [region, isos] of Object.entries(REGION_ISO_MAP)) {
            if (isos.includes(iso)) return region;
        }
        return "GLOBAL";
    };

    const getRiskForCountry = (iso: string) => {
        const region = getRegionForCountry(iso);
        return regionData[region] || 10;
    };

    const handleMouseEnter = async (geo: any, event: React.MouseEvent) => {
        if (isMobile) return;
        const iso = geo.id || (geo.properties && geo.properties.ISO_A3);
        const region = getRegionForCountry(iso);
        const riskScore = getRiskForCountry(iso);

        const initialData: RegionDataInfo = {
            id: iso,
            name: (geo.properties && geo.properties.NAME) || iso,
            riskScore: riskScore,
            regionEnum: region,
            latestReports: [],
            metrics: null
        };

        setTooltip({ id: iso, data: initialData });

        // Update mouse position immediately on entry
        mouseX.set(event.clientX);
        mouseY.set(event.clientY);

        setLoadingReports(true);
        try {
            // Concurrent fetch for reports and country-specific metrics
            const [reports, countryMetrics] = await Promise.all([
                region !== "GLOBAL" ? getLatestReportsByRegion(region) : Promise.resolve([]),
                iso ? getCountryMetric(iso) : Promise.resolve(null)
            ]);

            setTooltip(prev => prev ? {
                ...prev,
                data: {
                    ...prev.data,
                    latestReports: reports,
                    metrics: countryMetrics ? {
                        literacy: countryMetrics.literacy,
                        economy: countryMetrics.economy,
                        energy: countryMetrics.energy,
                        army: countryMetrics.army
                    } : null
                }
            } : null);
        } catch (err) {
            console.error("Hover fetch failed:", err);
        } finally {
            setLoadingReports(false);
        }
    };

    return (
        <div className={cn(
            "relative w-full overflow-visible transition-colors duration-300",
            !isBackdrop ? "bg-card rounded-3xl border border-border group" : ""
        )}>
            {/* Command Header */}
            {!isBackdrop && (
                <div className="p-6 md:absolute md:top-6 md:left-6 z-10 bg-card/50 backdrop-blur-md md:rounded-2xl md:border md:border-white/5">
                    <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight uppercase leading-none italic">
                        Global Risk <span className="text-accent-red">Command</span>
                    </h2>
                    <div className="flex items-center space-x-2 mt-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-red animate-pulse" />
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                            Live Strategic Aggregation // Deep Research
                        </p>
                    </div>
                </div>
            )}

            {/* Mobile Regional List Fallback */}
            {!isBackdrop && (
                <div className="lg:hidden p-6 pt-0 space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                        {Object.keys(REGION_ISO_MAP).filter(r => r !== "GLOBAL").map(region => {
                            const score = regionData[region] || 10;
                            return (
                                <Link
                                    key={region}
                                    href={`/${region.toLowerCase()}/`}
                                    className="flex items-center justify-between p-4 bg-secondary border border-border rounded-2xl active:scale-95 transition-all"
                                >
                                    <div className="space-y-1">
                                        <h3 className="text-xs font-black uppercase tracking-widest text-foreground">{region} Silo</h3>
                                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Tactical Sector Index</p>
                                    </div>
                                    <div className={cn(
                                        "flex flex-col items-center justify-center h-10 w-12 rounded-xl border border-border",
                                        score > 70 ? "bg-accent-red/20 text-accent-red border-accent-red/30" :
                                            score > 40 ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" :
                                                "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                                    )}>
                                        <span className="text-xs font-black tracking-tighter">{score}</span>
                                        <span className="text-[6px] font-black uppercase tracking-widest opacity-60">RISK</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Map Visualization (Hidden on small mobile, shown on tablet/desktop) */}
            <div
                onMouseMove={(e) => {
                    if (!isMobile) {
                        mouseX.set(e.clientX);
                        mouseY.set(e.clientY);
                    }
                }}
                className={cn(
                    "relative aspect-[21/9] lg:aspect-[3/1] w-full border border-border/50 rounded-2xl overflow-hidden bg-secondary/5",
                    (isMobile && !isBackdrop) ? "hidden lg:block opacity-40" : "block"
                )}
            >
                <ComposableMap
                    projectionConfig={{ scale: 140 }}
                    className="w-full h-full"
                >
                    <ZoomableGroup center={[0, 0]} zoom={1} minZoom={1} maxZoom={4}>
                        <Geographies geography={geoUrl}>
                            {({ geographies }: { geographies: any[] }) =>
                                geographies.map((geo: any) => {
                                    const iso = geo.id || (geo.properties && geo.properties.ISO_A3);
                                    const riskScore = getRiskForCountry(iso);

                                    return (
                                        <Geography
                                            key={geo.rsmKey}
                                            geography={geo}
                                            onMouseEnter={(e: React.MouseEvent) => handleMouseEnter(geo, e)}
                                            onMouseLeave={() => setTooltip(null)}
                                            style={{
                                                default: {
                                                    fill: riskScore > 10 ? (colorScale(riskScore) as string) : "var(--muted-map)",
                                                    stroke: "var(--border)",
                                                    strokeWidth: 0.5,
                                                    outline: "none",
                                                    transition: "all 250ms"
                                                },
                                                hover: {
                                                    fill: riskScore > 70 ? "#FF4B4B" : riskScore > 40 ? "#EAB308" : "var(--primary)",
                                                    stroke: "var(--primary)",
                                                    strokeWidth: 1,
                                                    outline: "none",
                                                    filter: "drop-shadow(0 0 16px rgba(255, 255, 255, 0.6))",
                                                    cursor: "pointer"
                                                },
                                                pressed: {
                                                    fill: "var(--foreground)",
                                                    outline: "none",
                                                }
                                            }}
                                        />
                                    );
                                })
                            }
                        </Geographies>
                    </ZoomableGroup>
                </ComposableMap>

                {/* Legend (Visual only) */}
                {!isBackdrop && (
                    <div className="absolute bottom-6 left-6 z-10 hidden md:flex space-x-6">
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-accent-green shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Low Risk</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_8_px_rgba(234,179,8,0.3)]" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Medium</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-accent-red shadow-[0_0_8_px_rgba(255,75,75,0.4)]" />
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Critical</span>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {!isMobile && tooltip && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                            position: "fixed",
                            left: 0,
                            top: 0,
                            x: smoothX,
                            y: smoothY,
                            translateX,
                            translateY,
                            pointerEvents: "none",
                            zIndex: 100
                        }}
                        className="bg-[#111827] border border-[#1E293B] p-4 rounded-2xl shadow-2xl backdrop-blur-2xl min-w-[300px] max-w-[340px] transition-colors duration-300 ring-1 ring-white/10"
                    >
                        <div className="flex flex-col space-y-6">
                            <div className="flex items-center justify-between border-b border-border/10 pb-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                        Sovereign Entity // {tooltip.data.id}
                                    </span>
                                    <h3 className="text-[#F1F5F9] font-black text-2xl tracking-tighter leading-none italic uppercase">
                                        {tooltip.data.name}
                                    </h3>
                                </div>
                                <div className={cn(
                                    "flex flex-col items-center justify-center h-12 w-12 rounded-xl border shadow-lg",
                                    tooltip.data.riskScore > 70 ? "border-accent-red/30 bg-accent-red/10 text-accent-red shadow-accent-red/10" : "border-border bg-secondary text-muted-foreground"
                                )}>
                                    <span className="text-sm font-black italic">{tooltip.data.riskScore}</span>
                                    <span className="text-[7px] font-bold uppercase tracking-tighter">Index</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-accent-red uppercase tracking-[0.2em]">
                                    {loadingReports ? "Synchronizing Strategic Assets..." : "Sovereign Strategic Metrics"}
                                </h4>

                                {loadingReports ? (
                                    <div className="grid grid-cols-2 gap-3">
                                        {[1, 2, 3, 4].map(i => <div key={i} className="h-10 w-full bg-foreground/5 rounded-xl animate-pulse" />)}
                                    </div>
                                ) : tooltip.data.metrics ? (
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 bg-secondary/50 rounded-xl border border-border/50">
                                                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Literacy</div>
                                                <div className="text-xs font-black text-foreground">{tooltip.data.metrics.literacy || "N/A"}</div>
                                            </div>
                                            <div className="p-3 bg-secondary/50 rounded-xl border border-border/50">
                                                <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Army</div>
                                                <div className="text-xs font-black text-foreground">{tooltip.data.metrics.army || "N/A"}</div>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-secondary/50 rounded-xl border border-border/50">
                                            <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Economy</div>
                                            <div className="text-xs font-black text-foreground">{tooltip.data.metrics.economy || "N/A"}</div>
                                        </div>
                                        <div className="p-3 bg-secondary/50 rounded-xl border border-border/50">
                                            <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Energy</div>
                                            <div className="text-xs font-black text-foreground">{tooltip.data.metrics.energy || "N/A"}</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-secondary/30 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center space-y-2">
                                        <p className="text-[10px] text-muted-foreground italic font-medium">
                                            Detailed metrics pending synchronization in Admin panel.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
