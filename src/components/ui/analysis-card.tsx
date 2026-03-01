"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AnalysisCardProps {
    title: string;
    category: string;
    slug: string;
    image: string;
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    riskScore: number;
}

export function AnalysisCard({
    title,
    category,
    slug,
    image,
    riskLevel,
    riskScore,
}: AnalysisCardProps) {
    const riskColor = {
        LOW: "bg-green-500/10 text-green-500 border-green-500/20",
        MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        CRITICAL: "bg-accent-red/10 text-accent-red border-accent-red/20",
    }[riskLevel];

    // Normalize category slug for direct routing
    const categorySlug = category.toLowerCase().replace(/^\/|\/$/g, '');

    return (
        <Link
            href={`/${categorySlug}/${slug}/`}
            className="group flex flex-col space-y-0 rounded-2xl border border-[#1E293B] bg-[#111827] overflow-hidden transition-all hover:border-accent-red/30 hover:shadow-[0_0_30px_rgba(255,75,75,0.05)]"
        >
            <div className="relative aspect-video w-full overflow-hidden border-b border-[#1E293B]">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                    <span className={cn(
                        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black tracking-[0.2em] border uppercase backdrop-blur-md bg-black/40",
                        riskColor
                    )}>
                        {riskLevel} RISK: {riskScore}
                    </span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1 space-y-4">
                <div className="space-y-2">
                    <span className="text-[10px] font-black text-accent-red uppercase tracking-[0.3em]">
                        {category}
                    </span>
                    <h3 className="text-xl font-black leading-tight text-[#F1F5F9] uppercase tracking-tighter italic line-clamp-2 transition-colors group-hover:text-white">
                        {title}
                    </h3>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-[#94A3B8] font-black uppercase tracking-[0.15em]">
                        INTELLIGENCE BRIEFING
                    </span>
                    <span className="text-[10px] text-[#94A3B8]/60 font-bold uppercase tracking-tighter">
                        12 MIN READ
                    </span>
                </div>
            </div>
        </Link>
    );
}
