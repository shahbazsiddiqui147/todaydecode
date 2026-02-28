"use client";

import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getLatestReportsByRegion } from "@/lib/actions/public-actions";

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
}

export function GlobalRiskMap({ regionData = {} }: GlobalRiskMapProps) {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; data: RegionDataInfo } | null>(null);
    const [loadingReports, setLoadingReports] = useState(false);

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
        const iso = geo.id || (geo.properties && geo.properties.ISO_A3);
        const region = getRegionForCountry(iso);
        const riskScore = getRiskForCountry(iso);

        const initialData: RegionDataInfo = {
            id: iso,
            name: (geo.properties && geo.properties.NAME) || iso,
            riskScore: riskScore,
            regionEnum: region,
            latestReports: []
        };

        setTooltip({
            x: event.clientX,
            y: event.clientY,
            data: initialData
        });

        // Trigger fetch for latest reports if not GLOBAL
        if (region !== "GLOBAL") {
            setLoadingReports(true);
            try {
                const reports = await getLatestReportsByRegion(region);
                setTooltip(prev => prev ? {
                    ...prev,
                    data: { ...prev.data, latestReports: reports }
                } : null);
            } catch (err) {
                console.error("Hover fetch failed:", err);
            } finally {
                setLoadingReports(false);
            }
        }
    };

    return (
        <div className="relative w-full aspect-[16/9] bg-slate-950/50 rounded-2xl border border-border-slate overflow-hidden group">
            <div className="absolute top-6 left-6 z-10">
                <h2 className="text-xl font-black text-white tracking-tight uppercase leading-none">
                    Global Risk Command
                </h2>
                <div className="flex items-center space-x-2 mt-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-red animate-ping" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Live Strategic Aggregation // Deep Intelligence
                    </p>
                </div>
            </div>

            <div className="absolute bottom-6 left-6 z-10 flex space-x-6">
                <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-accent-green shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Low Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.3)]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medium</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-accent-red shadow-[0_0_8px_rgba(255,75,75,0.4)]" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">High / Critical</span>
                </div>
            </div>

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
                                                fill: colorScale(riskScore) as string,
                                                stroke: "#1E293B",
                                                strokeWidth: 0.5,
                                                outline: "none",
                                                transition: "all 250ms"
                                            },
                                            hover: {
                                                fill: riskScore > 70 ? "#FF4B4B" : riskScore > 40 ? "#EAB308" : "#22C55E",
                                                stroke: "#FFFFFF",
                                                strokeWidth: 1,
                                                outline: "none",
                                                filter: "drop-shadow(0 0 12px rgba(255, 255, 255, 0.2))",
                                                cursor: "pointer"
                                            },
                                            pressed: {
                                                fill: "#FFFFFF",
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

            <AnimatePresence>
                {tooltip && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        style={{
                            position: "fixed",
                            left: tooltip.x + 20,
                            top: tooltip.y + 20,
                            pointerEvents: "none",
                            zIndex: 100
                        }}
                        className="bg-slate-900/95 border border-white/10 p-5 rounded-2xl shadow-2xl backdrop-blur-2xl min-w-[280px] max-w-[320px]"
                    >
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        Sector: {tooltip.data.regionEnum}
                                    </span>
                                    <h3 className="text-white font-black text-xl tracking-tighter leading-none">
                                        {tooltip.data.name}
                                    </h3>
                                </div>
                                <div className={cn(
                                    "flex flex-col items-center justify-center h-10 w-10 rounded-lg border",
                                    tooltip.data.riskScore > 70 ? "border-accent-red/30 bg-accent-red/10 text-accent-red" : "border-slate-700 bg-slate-800 text-slate-400"
                                )}>
                                    <span className="text-xs font-black">{tooltip.data.riskScore}</span>
                                    <span className="text-[6px] font-bold uppercase tracking-tighter">Index</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                                    {loadingReports ? "Analyzing Hotspot Intelligence..." : "Latest Strategic Dispatches"}
                                </h4>

                                {loadingReports ? (
                                    <div className="space-y-2">
                                        {[1, 2].map(i => <div key={i} className="h-3 w-full bg-white/5 rounded animate-pulse" />)}
                                    </div>
                                ) : tooltip.data.latestReports.length > 0 ? (
                                    <div className="space-y-3">
                                        {tooltip.data.latestReports.map((report: any) => (
                                            <div key={report.id} className="group/item">
                                                <div className="text-[11px] font-bold text-slate-200 line-clamp-1 group-hover/item:text-white transition-colors">
                                                    {report.title}
                                                </div>
                                                <div className="text-[8px] text-slate-500 uppercase font-bold tracking-widest mt-0.5">
                                                    {new Date(report.publishedAt).toLocaleDateString()} // Confidential
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-slate-500 italic font-medium">
                                        No active reports identified in this sector.
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
