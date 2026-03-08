import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Clock, Layers, ShieldAlert, Activity, BarChart3, Globe, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ContentRenderer } from "@/components/analysis/ContentRenderer";
import { QuickAnswers } from "@/components/aeo/quick-answers";
import { MethodologyBadge } from "@/components/intel/methodology-badge";
import { CitationTool } from "@/components/intel/citation-tool";
import { PaywallGate } from "@/components/monetization/paywall-gate";

interface RiskAssessmentTemplateProps {
    article: any;
    formattedDate: string;
    readingTime: string;
    fullSiloPath?: string;
}

export const RiskAssessmentTemplate: React.FC<RiskAssessmentTemplateProps> = ({
    article,
    formattedDate,
    readingTime,
    fullSiloPath
}) => {
    const structuredData = (article.structuredData as any) || {};
    const volatilityDrivers = Array.isArray(structuredData.volatilityDrivers)
        ? structuredData.volatilityDrivers
        : [];
    const affectedSectors = Array.isArray(structuredData.affectedSectors)
        ? structuredData.affectedSectors
        : [];

    return (
        <div className="risk-assessment-container max-w-7xl mx-auto px-6 py-12">
            {/* Tactical Header */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-white/5 pb-12">
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center gap-4">
                        <Badge className="bg-accent-red text-white dark:bg-accent-red dark:text-white rounded-none px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                            RISK ASSESSMENT
                        </Badge>
                        <MethodologyBadge />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#22D3EE] animate-pulse">Live Risk Monitoring Active</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-[0.9]">
                        {article.title}
                    </h1>

                    <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
                        {article.onPageLead || article.summary.split('\n')[0]}
                    </p>
                </div>

                {/* Primary Risk Metric */}
                <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-end">
                    <div className="p-8 bg-slate-900/50 border border-white/5 rounded-3xl text-center w-full max-w-[280px] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Strategic Risk Rating</div>
                        <div className={cn(
                            "text-7xl font-black tracking-tighter tabular-nums mb-2",
                            article.riskScore > 75 ? "text-accent-red" : article.riskScore > 40 ? "text-yellow-500" : "text-accent-green"
                        )}>
                            {article.riskScore}<span className="text-2xl opacity-40">/100</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-4">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-1000",
                                    article.riskScore > 75 ? "bg-accent-red" : article.riskScore > 40 ? "bg-yellow-500" : "bg-accent-green"
                                )}
                                style={{ width: `${article.riskScore}%` }}
                            />
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">Status: {article.riskLevel} VOLATILITY</div>
                    </div>
                </div>
            </div>

            {/* Technical Grid: Drivers & Sectors */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-16 border-b border-white/5">
                {/* Volatility Drivers */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-[#22D3EE]">
                        <Zap className="h-5 w-5" />
                        <h3 className="text-xs font-black uppercase tracking-widest">Volatility Drivers</h3>
                    </div>
                    <div className="space-y-4">
                        {volatilityDrivers.map((driver: string, i: number) => (
                            <div key={i} className="flex gap-4 items-start p-4 bg-slate-900/30 border border-white/5 rounded-xl group hover:border-[#22D3EE]/30 transition-all">
                                <span className="text-[10px] font-black text-[#22D3EE] pt-1">0{i + 1}</span>
                                <p className="text-sm font-bold text-slate-300 uppercase tracking-tight leading-tight">{driver}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Affected Sectors */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-white">
                        <Globe className="h-5 w-5" />
                        <h3 className="text-xs font-black uppercase tracking-widest">Primary Affected Sectors</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {affectedSectors.map((sector: string, i: number) => (
                            <div key={i} className="flex flex-col gap-2 p-4 bg-black/20 border border-white/5 rounded-xl">
                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Class</span>
                                <span className="text-[11px] font-black text-white uppercase tracking-tighter">{sector}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expected trajectory Summary */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-accent-red">
                        <Activity className="h-5 w-5" />
                        <h3 className="text-xs font-black uppercase tracking-widest">Expected Trajectory</h3>
                    </div>
                    <div className="p-6 bg-accent-red/5 border border-accent-red/10 rounded-2xl relative overflow-hidden">
                        <BarChart3 className="absolute -right-4 -bottom-4 h-24 w-24 opacity-5 text-accent-red" />
                        <p className="text-sm font-medium text-slate-300 leading-relaxed italic relative z-10">
                            Current modeling suggests a directional shift toward {article.riskScore > 50 ? 'intensified fragmentation' : 'moderate stabilization'} over the next 90-day cycle. Stakeholders should prioritize liquidity and secondary contingency protocols.
                        </p>
                    </div>
                </div>
            </div>

            {/* Analysis Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 py-16">
                <main className="lg:col-span-8 space-y-16">
                    <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-headings:uppercase prose-headings:tracking-tighter prose-headings:font-black">
                        <PaywallGate isPremium={article.isPremium}>
                            <ContentRenderer content={article.content} />
                        </PaywallGate>
                    </div>
                    <QuickAnswers faqData={(article.faqData as any) || []} />
                </main>

                <aside className="lg:col-span-4 space-y-10">
                    <div className="sticky top-32 space-y-10">
                        <div className="p-8 bg-slate-900/50 border border-white/5 rounded-3xl space-y-6 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 pb-4">Institutional Attribution</h4>
                            <CitationTool
                                title={article.title}
                                author={article.author.name}
                                publishedDate={formattedDate}
                                category={fullSiloPath || article.category.name}
                                slug={article.slug}
                            />
                        </div>

                        <div className="p-8 bg-secondary/30 border border-border/10 rounded-3xl">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Risk Audit Nodes</h4>
                                <ShieldAlert className="h-3 w-3 text-accent-red" />
                            </div>
                            <div className="space-y-4 font-mono text-[9px] text-slate-500">
                                <div className="flex justify-between"><span>VERIFICATION_HASH:</span> <span className="text-white">TD-{article.id.substring(0, 6)}X</span></div>
                                <div className="flex justify-between"><span>IMPACT_VECT:</span> <span className="text-white">{article.impactScore}% ALPHA</span></div>
                                <div className="flex justify-between"><span>NODAL_SYNC:</span> <span className="text-white">ENCRYPTED</span></div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default RiskAssessmentTemplate;
