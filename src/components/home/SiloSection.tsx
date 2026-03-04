"use client";

import Link from "next/link";
import { ChevronRight, Layers } from "lucide-react";
import { AnalysisCard } from "@/components/ui/analysis-card";

interface SiloSectionProps {
    title: string;
    slug: string;
    articles: any[];
}

export function SiloSection({ title, slug, articles }: SiloSectionProps) {
    if (articles.length === 0) return null;

    return (
        <section className="space-y-8">
            <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
                <div className="flex items-center gap-3">
                    <Layers className="h-4 w-4 text-[#22D3EE]" />
                    <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground italic">
                        {title}
                    </h2>
                </div>
                <Link
                    href={`/${slug}/`}
                    className="text-[9px] font-black text-muted-foreground hover:text-[#22D3EE] uppercase tracking-widest transition-colors flex items-center gap-2 group"
                >
                    Explore Silo
                    <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {articles.map((article) => (
                    <AnalysisCard
                        key={article.id}
                        id={article.id}
                        title={article.title}
                        category={title}
                        slug={article.slug}
                        image="/images/intel-1.jpg"
                        riskLevel={article.riskLevel}
                        riskScore={article.riskScore}
                    />
                ))}
            </div>
        </section>
    );
}
