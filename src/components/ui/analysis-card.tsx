"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BookmarkButton } from "@/components/intel/BookmarkButton";

interface AnalysisCardProps {
    title: string;
    category: string;
    slug: string;
    image: string;
    riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    riskScore: number;
    id: string;
}

export function AnalysisCard({
    title,
    category,
    slug,
    image,
    riskLevel,
    riskScore,
    id,
}: AnalysisCardProps) {
    const riskColor = {
        LOW: "bg-green-500/10 text-green-500 border-green-500/20",
        MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
        HIGH: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        CRITICAL: "bg-accent-red/10 text-accent-red border-accent-red/20",
    }[riskLevel];

    // Normalize category and article slug for high-fidelity routing (prevents triple-slashes)
    const normalizedCategory = category.toLowerCase().replace(/^\/|\/$/g, '');
    const normalizedArticle = slug.replace(/^\/|\/$/g, '');

    return (
        <Link
            href={`/${normalizedCategory}/${normalizedArticle}/`}
            className="group flex flex-col space-y-0 rounded-2xl border border-border bg-card overflow-hidden transition-all hover:border-accent-red/30 hover:shadow-[0_0_30px_rgba(255,75,75,0.05)]"
        >
            <div className="relative aspect-video w-full overflow-hidden border-b border-border">
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
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <BookmarkButton articleId={id} />
                </div>
            </div>

            <div className="p-6 flex flex-col flex-1 space-y-4">
                <div className="space-y-2">
                    <span className="text-[10px] font-black text-accent-red uppercase tracking-[0.3em]">
                        {category}
                    </span>
                    <h3 className="text-xl font-black leading-tight text-foreground uppercase tracking-tighter italic line-clamp-2 transition-colors group-hover:text-white">
                        {title}
                    </h3>
                </div>

                <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em]">
                        RESEARCH ASSESSMENT
                    </span>
                    <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-tighter">
                        Archive No. 2026-{id.substring(0, 4).toUpperCase()}
                    </span>
                </div>
            </div>
        </Link>
    );
}
