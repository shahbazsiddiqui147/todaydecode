"use client";

import React, { useState } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

const geoUrl = "https://raw.githubusercontent.com/lotusms/world-map-data/main/world.json";

const colorScale = scaleLinear<string>()
    .domain([0, 40, 70, 100])
    .range(["#1E293B", "#22C55E", "#EAB308", "#FF4B4B"]);

interface RegionData {
    id: string;
    name: string;
    riskScore: number;
    slug: string;
}

// Mock data for regions - in production this would come from a database service
const mockRegionData: Record<string, RegionData> = {
    "USA": { id: "USA", name: "United States", riskScore: 25, slug: "americas" },
    "RUS": { id: "RUS", name: "Russia", riskScore: 85, slug: "europe" },
    "CHN": { id: "CHN", name: "China", riskScore: 65, slug: "apac" },
    "SAU": { id: "SAU", name: "Saudi Arabia", riskScore: 75, slug: "middle-east" },
    "UKR": { id: "UKR", name: "Ukraine", riskScore: 95, slug: "europe" },
    "DEU": { id: "DEU", name: "Germany", riskScore: 20, slug: "europe" },
    "BRA": { id: "BRA", name: "Brazil", riskScore: 45, slug: "americas" },
    "ZAF": { id: "ZAF", name: "South Africa", riskScore: 55, slug: "africa" },
    "IND": { id: "IND", name: "India", riskScore: 40, slug: "apac" },
};

export function GlobalRiskMap() {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; data: RegionData } | null>(null);

    const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
        const regionId = geo.id || (geo.properties && geo.properties.ISO_A3);
        const data = mockRegionData[regionId] || {
            id: regionId,
            name: (geo.properties && geo.properties.NAME) || regionId,
            riskScore: 10,
            slug: "global"
        };

        setTooltip({
            x: event.clientX,
            y: event.clientY,
            data
        });
    };

    return (
        <div className="relative w-full aspect-[16/9] bg-slate-950/50 rounded-2xl border border-border-slate overflow-hidden group">
            <div className="absolute top-6 left-6 z-10">
                <h2 className="text-xl font-black text-white tracking-tight uppercase">
                    Global Risk Command
                </h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    Live Geospatial Intelligence Layer
                </p>
            </div>

            <div className="absolute bottom-6 left-6 z-10 flex space-x-6">
                <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-accent-green" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Low Risk</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medium</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-accent-red" />
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
                                const regionId = geo.id || (geo.properties && geo.properties.ISO_A3);
                                const data = mockRegionData[regionId];
                                const riskScore = data ? data.riskScore : 10;

                                return (
                                    <Link key={geo.rsmKey} href={`/${data?.slug || 'global'}/`}>
                                        <Geography
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
                                                    filter: "drop-shadow(0 0 8px rgba(255, 75, 75, 0.4))",
                                                    cursor: "pointer"
                                                },
                                                pressed: {
                                                    fill: "#FFFFFF",
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 1,
                                                    outline: "none",
                                                }
                                            }}
                                        />
                                    </Link>
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
                        className="bg-primary-dark border border-border-slate p-4 rounded-xl shadow-2xl backdrop-blur-xl min-w-[160px]"
                    >
                        <div className="flex flex-col space-y-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                Region / Authority
                            </span>
                            <span className="text-white font-black text-lg tracking-tight">
                                {tooltip.data.name}
                            </span>
                            <div className="flex items-center justify-between pt-2 border-t border-border-slate">
                                <span className="text-[10px] font-bold text-slate-400 uppercase">Risk Index</span>
                                <span className={cn(
                                    "text-sm font-black",
                                    tooltip.data.riskScore > 70 ? "text-accent-red" : tooltip.data.riskScore > 40 ? "text-yellow-500" : "text-accent-green"
                                )}>
                                    {tooltip.data.riskScore}/100
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
