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

    return (
        <Link
            href={`/articles/${slug}/`}
            className="group flex flex-col space-y-3 rounded-lg border border-border-slate bg-card overflow-hidden transition-all hover:border-slate-400"
        >
            <div className="relative aspect-video w-full overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                    <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded text-[10px] font-bold tracking-widest border uppercase",
                        riskColor
                    )}>
                        {riskLevel} RISK: {riskScore}
                    </span>
                </div>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <span className="text-[10px] font-bold text-accent-red uppercase tracking-widest mb-1">
                    {category}
                </span>
                <h3 className="text-lg font-bold leading-snug text-card-foreground line-clamp-2">
                    {title}
                </h3>
                <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium tracking-tight">
                        INTELLIGENCE BRIEFING
                    </span>
                    <span className="text-xs text-slate-400">
                        12 MIN READ
                    </span>
                </div>
            </div>
        </Link>
    );
}
