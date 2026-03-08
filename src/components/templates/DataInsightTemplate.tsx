import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock, Layers, BarChart3, Database, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ContentRenderer } from "@/components/analysis/ContentRenderer";
import { QuickAnswers } from "@/components/aeo/quick-answers";
import { MethodologyBadge } from "@/components/intel/methodology-badge";
import { CitationTool } from "@/components/intel/citation-tool";
import { PaywallGate } from "@/components/monetization/paywall-gate";

interface DataInsightTemplateProps {
    article: any;
    formattedDate: string;
    readingTime: string;
}

export const DataInsightTemplate: React.FC<DataInsightTemplateProps> = ({
    article,
    formattedDate,
    readingTime
}) => {
    const structuredData = (article.structuredData as any) || {};

    return (
        <div className="data-insight-container max-w-5xl mx-auto px-6 py-20">
            <div className="space-y-12">
                {/* Minimalist Tech Header */}
                <div className="space-y-6 text-center">
                    <Badge className="bg-[#22D3EE] text-[#0F172A] rounded-none px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                        DATA INSIGHT
                    </Badge>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-tight">
                        {article.title}
                    </h1>
                    <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>{formattedDate}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>{readingTime}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span className="text-[#22D3EE]">NODE_DATA_01</span>
                    </div>
                </div>

                {/* Primary Visual - Above the Fold */}
                <div className="p-8 bg-[#0A0F1E] border-2 border-[#22D3EE] rounded-3xl shadow-[0_30px_60px_-12px_rgba(34,211,238,0.2)]">
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <ContentRenderer content={article.content.split('##')[0]} />
                    </div>
                </div>

                {/* Narrative Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-[#22D3EE]">
                            <Database className="h-5 w-5" />
                            <h2 className="text-xs font-black uppercase tracking-widest">Key Findings</h2>
                        </div>
                        <div className="p-8 bg-slate-900/50 border border-white/5 rounded-2xl relative overflow-hidden">
                            <BarChart3 className="absolute -right-4 -bottom-4 h-24 w-24 opacity-5" />
                            <p className="text-sm font-medium text-slate-300 leading-relaxed italic relative z-10">
                                {structuredData.keyFindings || article.summary.split('\n')[0]}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-slate-400">
                            <Info className="h-5 w-5" />
                            <h2 className="text-xs font-black uppercase tracking-widest">Data Interpretation</h2>
                        </div>
                        <div className="p-8 bg-black/20 border border-white/5 rounded-2xl">
                            <p className="text-sm font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
                                {structuredData.interpretation || "Cross-nodal verification suggests this dataset is a lead indicator for broader volatility in the 30-day window."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Full Analysis Body */}
                <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black pt-12 border-t border-white/5">
                    <PaywallGate isPremium={article.isPremium}>
                        <ContentRenderer content={article.content.includes('##') ? '##' + article.content.split('##').slice(1).join('##') : ''} />
                    </PaywallGate>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all">
                    <CitationTool
                        title={article.title}
                        author={article.author.name}
                        publishedDate={formattedDate}
                        category={article.category.name}
                        slug={article.slug}
                    />
                    <div className="flex justify-end">
                        <MethodologyBadge />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataInsightTemplate;
